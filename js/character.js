import { DEFAULT_STATS, STAT_RULES, DEFAULT_STARTING_GIL, DEFAULT_STARTING_LUMENS } from './constants.js'
import { cache, getRace, getSkill, getItem } from './cache.js'
import { listHomebrewSkills } from './homebrew.js'
import { equipmentSkillStatModifiers } from './skill-effects.js'
import { armourSkillStatModifiers, conditionalSkillStatModifiers, conditionalSkillStatLabel, evaluateSkillStatCondition } from './career-effects.js'
import { raceEquipmentStatModifiers, raceEquipmentStatBreakdown } from './race-passives.js'
import {
  equippedEnchantmentStatTotals,
  enchantmentStatBreakdown
} from './enchantments.js'
import { characterWieldsWeaponKind, reconcileOffhandEquip } from './equipment.js'
import { getSkillsData } from './data.js'
import { clamp, deepClone, uid, titleCase } from './utils.js'
import { HUMAN_RACE_SKILL } from './skills.js'
import { normalizeGil } from './format.js'
import { applyBackgroundToCharacter, DEFAULT_BACKGROUND } from './backgrounds.js'
import { mergeInventoryStacks } from './items.js'
import { migrateLegacyStatusEffect, statusStatModifiers } from './status-stat-modifiers.js'

export function stripCharacterCache(character) {
  if (!character) return character
  const { _cache, ...rest } = character
  return rest
}

export function invalidateCharacterCache(character) {
  if (character) character._cache = null
}

export function createCharacter(name, raceId, options = {}) {
  const race = getRace(raceId)
  const character = {
    id: uid('char'),
    name: name.trim(),
    created: new Date().toISOString(),
    updated: new Date().toISOString(),
    race: race ? race.id : null,
    background: DEFAULT_BACKGROUND,
    elementalAffinity: '',
    gil: DEFAULT_STARTING_GIL,
    lumens: DEFAULT_STARTING_LUMENS,
    stats: deepClone(DEFAULT_STATS),
    hp: DEFAULT_STATS.hp,
    stamina: DEFAULT_STATS.stamina,
    skills: [],
    activeToggles: [],
    statusEffects: [],
    inventory: [],
    equipped: { weapon: null, offhand: null, armor: null, accessory: null },
    movedThisTurn: false,
    notes: '',
    folder: ''
  }
  if (options.folder) character.folder = String(options.folder).trim().slice(0, 48)
  if (race?.id === 'dragonborn' && options.elementalAffinity) {
    character.elementalAffinity = options.elementalAffinity
  }
  if (race?.id === 'human' && options.humanStarterSkill) {
    character.skills.push(options.humanStarterSkill)
  }
  applyBackgroundToCharacter(character, options.background || DEFAULT_BACKGROUND)
  fillCharacterToFullResources(character)
  return character
}

export function normalizeCharacter(character) {
  const base = createCharacter(character?.name || 'Unnamed Hero', character?.race || null)
  const merged = { ...base, ...character }
  merged.stats = { ...DEFAULT_STATS, ...(character?.stats || {}) }
  merged.gil = normalizeGil(character?.gil ?? character?.currency, DEFAULT_STARTING_GIL)
  delete merged.currency
  merged.elementalAffinity = normalizeElementalAffinity(merged.race, merged.elementalAffinity)
  merged.background = character?.background || DEFAULT_BACKGROUND
  merged.skills = migrateSkillIds(Array.isArray(character?.skills) ? [...new Set(character.skills)] : migrateOldSkills(character?.unlockedSkills))
  merged.activeToggles = Array.isArray(character?.activeToggles) ? character.activeToggles.filter(id => merged.skills.includes(id)) : []
  merged.statusEffects = Array.isArray(character?.statusEffects) ? character.statusEffects.map(normalizeStatusEffect).filter(Boolean) : []
  merged.inventory = Array.isArray(character?.inventory) ? character.inventory.map(normalizeInventoryEntry).filter(Boolean) : []
  mergeInventoryStacks(merged)
  merged.equipped = { weapon: null, offhand: null, armor: null, accessory: null, ...(character?.equipped || {}) }
  merged.equipped = sanitizeEquippedSlots(merged.equipped)
  reconcileOffhandEquip(merged)
  merged.movedThisTurn = Boolean(character?.movedThisTurn)
  merged.premadeId = character?.premadeId || null
  merged.folder = String(character?.folder || '').trim().slice(0, 48)
  merged.hp = Number.isFinite(Number(merged.hp)) ? Number(merged.hp) : merged.stats.hp
  merged.stamina = Number.isFinite(Number(merged.stamina)) ? Number(merged.stamina) : merged.stats.stamina
  invalidateCharacterCache(merged)
  const computed = computeStats(merged)
  merged.hp = clamp(merged.hp, 0, computed.hp)
  merged.stamina = clamp(merged.stamina, 0, computed.stamina)
  return merged
}

function sanitizeEquippedSlots(equipped) {
  const slots = { weapon: null, offhand: null, armor: null, accessory: null, ...(equipped || {}) }
  if (slots.weapon && slots.offhand === slots.weapon) slots.offhand = null
  const seen = new Set()
  for (const slot of Object.keys(slots)) {
    const uid = slots[slot]
    if (!uid) continue
    if (seen.has(uid)) slots[slot] = null
    else seen.add(uid)
  }
  return slots
}

function migrateSkillIds(skills) {
  const aliases = {
    trail_reader: 'trail_warden',
    empty_hand_basics: 'striker_basics',
    empty_hand_mastery: 'striker_mastery',
    swift_jab: 'stone_fists',
    rising_kick: 'crushing_fist',
    knuckle_lock: 'striker_volley',
    step_inside: 'feint_strike',
    minstrels_voice: 'long_set'
  }
  const removed = new Set([
    'haggler', 'appraise', 'ledger', 'find_buyer', 'black_market', 'invest', 'caravan_lead'
  ])
  return [...new Set(skills.map(id => aliases[id] || id).filter(id => !removed.has(id)))]
}

function migrateOldSkills(unlockedSkills) {
  const ids = []
  const walk = value => {
    if (Array.isArray(value)) ids.push(...value)
    else if (value && typeof value === 'object') Object.values(value).forEach(walk)
  }
  walk(unlockedSkills)
  return migrateSkillIds([...new Set(ids)])
}

export function normalizeInventoryEntry(entry) {
  if (!entry) return null
  if (typeof entry === 'string') return { uid: uid('item'), itemId: entry, qty: 1 }
  const itemId = entry.itemId || entry.id
  if (!itemId) return null
  return {
    uid: entry.uid || uid('item'),
    itemId,
    qty: Math.max(1, Number(entry.qty || entry.quantity || 1)),
    craftedBy: entry.craftedBy || null,
    craftedByName: entry.craftedByName || null,
    craftedWithSkills: Array.isArray(entry.craftedWithSkills) ? [...entry.craftedWithSkills] : [],
    craftBonuses: entry.craftBonuses && typeof entry.craftBonuses === 'object' ? { ...entry.craftBonuses } : undefined,
    enchantments: Array.isArray(entry.enchantments) ? [...entry.enchantments] : [],
    boundTo: entry.boundTo || null,
    counter: Number.isFinite(Number(entry.counter)) ? Math.max(0, Math.floor(Number(entry.counter))) : undefined
  }
}

export function normalizeEffectId(value) {
  return String(value || '')
    .trim()
    .replace(/([a-z])([A-Z])/g, '$1_$2')
    .replace(/[\s-]+/g, '_')
    .replace(/[^a-zA-Z0-9_]/g, '')
    .toLowerCase()
}

export function getEffect(effectId) {
  const id = normalizeEffectId(effectId)
  return cache.effectDefinitions[id] || null
}

export function normalizeStatusEffect(entry) {
  if (!entry) return null
  const migrated = migrateLegacyStatusEffect(entry, normalizeEffectId)
  const effectId = normalizeEffectId(migrated.effectId || migrated.id || migrated.name)
  const effect = getEffect(effectId)
  if (!effect) return null
  const durationValue = migrated.duration === '' || migrated.duration === undefined || migrated.duration === null ? effect.duration : Number(migrated.duration)
  const potencyValue = migrated.potency === '' || migrated.potency === undefined || migrated.potency === null ? effect.potency : Number(migrated.potency)
  const normalized = {
    uid: entry.uid || uid('effect'),
    effectId,
    duration: Number.isFinite(durationValue) ? durationValue : effect.duration,
    potency: Number.isFinite(potencyValue) ? potencyValue : effect.potency,
    elapsed: Number.isFinite(Number(entry.elapsed)) ? Number(entry.elapsed) : 0,
    notes: String(migrated.notes || '')
  }
  if (migrated.performance && typeof migrated.performance === 'object') {
    normalized.performance = { ...migrated.performance }
  }
  return normalized
}

export function computeStats(character) {
  if (character?._cache?.stats) return character._cache.stats
  const stats = { ...DEFAULT_STATS, ...(character?.stats || {}) }
  const race = getRace(character?.race)
  for (const [stat, value] of Object.entries(race?.statModifiers || {})) {
    stats[stat] = (stats[stat] || 0) + Number(value || 0)
  }
  for (const entryUid of Object.values(character?.equipped || {})) {
    if (!entryUid) continue
    const entry = character?.inventory?.find(inv => inv.uid === entryUid)
    const item = entry && getItem(entry.itemId)
    for (const [stat, value] of Object.entries(item?.statModifiers || {})) {
      stats[stat] = (stats[stat] || 0) + Number(value || 0)
    }
  }
  for (const skillId of character?.skills || []) {
    const bonus = cache.passiveBonuses[skillId]
    if (!bonus) continue
    for (const [stat, value] of Object.entries(bonus)) stats[stat] = (stats[stat] || 0) + Number(value || 0)
  }
  for (const skillId of character?.skills || []) {
    const skill = getSkill(skillId)
    if (skill?.source !== 'homebrew' || !skill.statModifiers) continue
    for (const [stat, value] of Object.entries(skill.statModifiers)) {
      stats[stat] = (stats[stat] || 0) + Number(value || 0)
    }
  }
  for (const [stat, value] of Object.entries(equipmentSkillStatModifiers(character))) {
    stats[stat] = (stats[stat] || 0) + Number(value || 0)
  }
  for (const [stat, value] of Object.entries(armourSkillStatModifiers(character))) {
    stats[stat] = (stats[stat] || 0) + Number(value || 0)
  }
  for (const [stat, value] of Object.entries(conditionalSkillStatModifiers(character))) {
    stats[stat] = (stats[stat] || 0) + Number(value || 0)
  }
  for (const [stat, value] of Object.entries(raceEquipmentStatModifiers(character))) {
    stats[stat] = (stats[stat] || 0) + Number(value || 0)
  }
  for (const [stat, value] of Object.entries(equippedEnchantmentStatTotals(character))) {
    stats[stat] = (stats[stat] || 0) + Number(value || 0)
  }
  for (const skillId of character?.activeToggles || []) {
    const bonus = cache.toggleBonuses[skillId]
    if (!bonus) continue
    for (const [stat, value] of Object.entries(bonus)) stats[stat] = (stats[stat] || 0) + Number(value || 0)
  }
  for (const status of character?.statusEffects || []) {
    const effect = getEffect(status.effectId)
    for (const [stat, value] of Object.entries(statusStatModifiers(status, effect))) {
      stats[stat] = (stats[stat] || 0) + Number(value || 0)
    }
  }
  stats.hp = Math.max(1, Math.floor(stats.hp))
  stats.stamina = Math.max(1, Math.floor(stats.stamina))
  if (character) {
    character._cache = character._cache || {}
    character._cache.stats = stats
  }
  return stats
}

/** Set current HP and Stamina to computed maximum (creation, premade spawn). */
export function fillCharacterToFullResources(character) {
  if (!character) return character
  invalidateCharacterCache(character)
  const computed = computeStats(character)
  character.hp = computed.hp
  character.stamina = computed.stamina
  return character
}

export function statBreakdown(character, stat) {
  const rows = [{ label: 'Base', value: character.stats[stat] || 0 }]
  const race = getRace(character.race)
  if (race?.statModifiers?.[stat]) rows.push({ label: race.name, value: race.statModifiers[stat] })
  for (const entryUid of Object.values(character.equipped || {})) {
    const entry = character.inventory.find(inv => inv.uid === entryUid)
    const item = entry && getItem(entry.itemId)
    if (item?.statModifiers?.[stat]) rows.push({ label: item.name, value: item.statModifiers[stat] })
  }
  for (const skillId of character.skills || []) {
    if (cache.passiveBonuses[skillId]?.[stat]) rows.push({ label: getSkill(skillId)?.name || titleCase(skillId), value: cache.passiveBonuses[skillId][stat] })
  }
  for (const skillId of character.skills || []) {
    const rule = cache.equipmentSkillEffects[skillId]
    if (!rule?.statModifiers?.[stat]) continue
    if (rule.weaponKind === 'oneHanded') {
      if (!characterWieldsWeaponKind(character, 'oneHanded')) continue
    } else if (!characterWieldsWeaponKind(character, rule.weaponKind)) continue
    const skill = getSkill(skillId)
    rows.push({ label: `${skill?.name || titleCase(skillId)} (${rule.weaponKind})`, value: rule.statModifiers[stat] })
  }
  for (const skillId of character.skills || []) {
    const rule = cache.armourSkillEffects?.[skillId]
    if (!rule?.statModifiers?.[stat]) continue
    const skill = getSkill(skillId)
    rows.push({ label: `${skill?.name || titleCase(skillId)} (armour)`, value: rule.statModifiers[stat] })
  }
  for (const skillId of character.skills || []) {
    const rule = cache.conditionalSkillStats?.[skillId]
    if (!rule?.[stat]) continue
    if (!evaluateSkillStatCondition(character, rule)) continue
    const skill = getSkill(skillId)
    const suffix = conditionalSkillStatLabel(rule.condition)
    const weaponNote = rule.weaponKind ? `, ${rule.weaponKind} equipped` : ''
    rows.push({ label: `${skill?.name || titleCase(skillId)} (${suffix}${weaponNote})`, value: rule[stat] })
  }
  rows.push(...raceEquipmentStatBreakdown(character, stat))
  rows.push(...enchantmentStatBreakdown(character, stat))
  for (const skillId of character.activeToggles || []) {
    if (cache.toggleBonuses[skillId]?.[stat]) rows.push({ label: `${getSkill(skillId)?.name || titleCase(skillId)} active`, value: cache.toggleBonuses[skillId][stat] })
  }
  for (const status of character.statusEffects || []) {
    const effect = getEffect(status.effectId)
    const mods = statusStatModifiers(status, effect)
    if (mods[stat]) rows.push({ label: `${effect.name} effect`, value: mods[stat] })
  }
  return rows
}

export function setRace(character, raceId) {
  const race = getRace(raceId)
  if (!character || !race) return
  character.race = race.id
  if (race.id !== 'dragonborn') character.elementalAffinity = ''

  const racial = getSkillsData().racial || {}
  const racialSkillIds = new Set()
  for (const [key, value] of Object.entries(racial)) {
    if (Array.isArray(value)) value.forEach(skill => racialSkillIds.add(skill.id))
    else if (value && typeof value === 'object') {
      for (const list of Object.values(value)) {
        if (Array.isArray(list)) list.forEach(skill => racialSkillIds.add(skill.id))
      }
    }
  }

  const allowedRacial = new Set()
  if (race.id === 'monster') {
    for (const list of Object.values(racial.monster || {})) {
      if (Array.isArray(list)) list.forEach(skill => allowedRacial.add(skill.id))
    }
  } else if (race.id === 'human') {
    if (Array.isArray(racial.human)) {
      racial.human.forEach(skill => allowedRacial.add(skill.id))
    }
    if (character.skills.includes(HUMAN_RACE_SKILL)) {
      for (const [key, value] of Object.entries(racial)) {
        if (key === 'monster' || key === 'human' || !Array.isArray(value)) continue
        for (const skill of value) {
          if (Number(skill.tier || 1) === 1 && character.skills.includes(skill.id)) {
            allowedRacial.add(skill.id)
          }
        }
      }
      for (const list of Object.values(racial.monster || {})) {
        if (!Array.isArray(list)) continue
        for (const skill of list) {
          if (Number(skill.tier || 1) === 1 && character.skills.includes(skill.id)) {
            allowedRacial.add(skill.id)
          }
        }
      }
    }
  } else if (Array.isArray(racial[race.id])) {
    racial[race.id].forEach(skill => allowedRacial.add(skill.id))
  }

  for (const skill of listHomebrewSkills()) {
    if (skill.category !== 'racial') continue
    racialSkillIds.add(skill.id)
    if (skill.subcategory === race.id) allowedRacial.add(skill.id)
  }

  character.skills = character.skills.filter(id => !racialSkillIds.has(id) || allowedRacial.has(id))
  if (race.id === 'monster') {
    character.skills = character.skills.filter(id => {
      const skill = getSkill(id)
      return !skill || (skill.category !== 'professions' && skill.category !== 'careers')
    })
  }
  character.activeToggles = character.activeToggles.filter(id => character.skills.includes(id))
  invalidateCharacterCache(character)
  const computed = computeStats(character)
  character.hp = clamp(character.hp, 0, computed.hp)
  character.stamina = clamp(character.stamina, 0, computed.stamina)
}

export function setElementalAffinity(character, affinity) {
  if (!character || character.race !== 'dragonborn') return
  character.elementalAffinity = normalizeElementalAffinity('dragonborn', affinity)
  invalidateCharacterCache(character)
}

function normalizeElementalAffinity(raceId, affinity) {
  if (raceId !== 'dragonborn') return ''
  const clean = String(affinity || '').trim().toLowerCase()
  if (!clean) return ''
  if (clean === 'lightning') return 'thunder'
  const allowed = ['fire', 'ice', 'thunder', 'earth', 'wind', 'water', 'darkness', 'light']
  return allowed.includes(clean) ? clean : ''
}
