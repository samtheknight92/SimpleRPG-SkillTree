import fs from 'fs'
import path from 'path'
import { characterLevelFromTotal } from './progression.mjs'

const CURRENCY_RATE = { gold: 2500, silver: 100, copper: 1 }

function legacyCurrencyToGil(currency) {
  if (Number.isFinite(Number(currency))) return Math.max(0, Math.floor(Number(currency)))
  if (!currency) return 7200
  if (Number.isFinite(Number(currency.gil))) return Math.max(0, Math.floor(Number(currency.gil)))
  return (Number(currency.gold || 0) * CURRENCY_RATE.gold)
    + (Number(currency.silver || 0) * CURRENCY_RATE.silver)
    + Number(currency.copper || 0)
}

const DEFAULT_STATS = {
  hp: 10,
  stamina: 10,
  strength: -3,
  magicPower: -3,
  accuracy: -3,
  speed: 2,
  physicalDefence: 8,
  magicalDefence: 8
}

function tierLevelValue(tier) {
  return Number(tier || 1) / 5
}

function statLevelValue(statKey) {
  return statKey === 'hp' || statKey === 'stamina' ? tierLevelValue(1) : tierLevelValue(2)
}

/** Defeat loot — wallet on sheet equals what the party loots. */
export const LUMEN_PER_LEVEL = 3
export const GIL_PER_LEVEL = 200
export const HUMANOID_MONSTER_GIL = 20

/** Match js/level.js — threat level for loot (display level on premade card). */
export function characterLevelFromBuild(build, skillById, { countStatUpgrades = true } = {}) {
  let skillLevels = 0
  for (const id of build.skills || []) {
    const skill = skillById.get(id)
    if (skill) skillLevels += tierLevelValue(skill.tier)
  }
  let statLevels = 0
  if (countStatUpgrades) {
    for (const [stat, base] of Object.entries(DEFAULT_STATS)) {
      const purchases = Math.max(0, Number(build.stats?.[stat] ?? base) - base)
      statLevels += purchases * statLevelValue(stat)
    }
  }
  const total = skillLevels + statLevels
  return {
    total,
    level: characterLevelFromTotal(total)
  }
}

/** Goblins, orcs, bandits, etc. — Lumen like other monsters + flat pocket Gil. */
export function isHumanoidMonster(stem) {
  return /goblin|orc|bandit|brute|warrior|raider|chief|lieutenant|warlord|knight|guard|torturer|slave|shaman|hell_knight|corrupt_guard|crime_boss|warlord_lieutenant|berserker/.test(String(stem || '').toLowerCase())
}

export function lumenDropForLevel(level) {
  return Math.max(0, Math.floor(Number(level || 0) * LUMEN_PER_LEVEL))
}

export function gilDropForLevel(level) {
  return Math.max(0, Math.floor(Number(level || 0) * GIL_PER_LEVEL))
}

/** @deprecated — use lumenDropForLevel */
export function gilDropForHumanoid(levelInfo) {
  return gilDropForLevel(levelInfo?.level ?? levelInfo?.total ?? 0)
}

/** @deprecated — use lumenDropForLevel */
export function lumenDropForMonster(_tier, levelInfo) {
  return lumenDropForLevel(levelInfo?.level ?? 0)
}

/** @deprecated */
export function tinyGilForHumanoidMonster(_tier, _levelInfo) {
  return HUMANOID_MONSTER_GIL
}

function formatDefeatLootNote(lumens, gil) {
  const parts = []
  if (lumens > 0) parts.push(`${lumens} Lumens`)
  if (gil > 0) parts.push(`${gil} Gil`)
  return parts.length ? `Defeat loot: ${parts.join(', ')}.` : ''
}

function applyDefeatRewards(inferred, stem, build, skillById) {
  const isHumanoid = inferred.category === 'pedestrian' || inferred.category === 'npc'
  const levelInfo = characterLevelFromBuild(build, skillById, { countStatUpgrades: true })
  const level = levelInfo.level

  if (isHumanoid) {
    build.lumens = lumenDropForLevel(level)
    build.gil = gilDropForLevel(level)
  } else {
    build.lumens = lumenDropForLevel(level)
    build.gil = isHumanoidMonster(stem) ? HUMANOID_MONSTER_GIL : 0
  }

  const dropLine = formatDefeatLootNote(build.lumens, build.gil)
  build.notes = [build.notes, dropLine].filter(Boolean).join(' ')
  return build
}

const MONSTER_SKILL_CHAINS = {
  tough_skin: ['rock_skin', 'metal_skin'],
  rock_skin: ['metal_skin'],
  claws: ['razor_claws', 'venomous_claws'],
  razor_claws: ['venomous_claws'],
  bite_attack: ['crushing_bite'],
  tail_swipe: ['spiked_tail'],
  regeneration: ['rapid_healing']
}

const ELEMENT_MAGIC_TARGETS = {
  fire: ['fireball', 'fire_spark'],
  ice: ['ice_spear', 'ice_shard'],
  lightning: ['lightning_bolt', 'gust'],
  thunder: ['lightning_bolt', 'gust'],
  earth: ['stone_throw', 'earth_spike'],
  water: ['water_splash', 'tidal_wave'],
  wind: ['gust', 'wind_blade'],
  light: ['healing_light', 'light_ray'],
  darkness: ['darkness', 'shadow_bolt']
}

const PEDESTRIAN_WEAPON = {
  elf: { weapon: 'hunting_bow', skills: ['ranged_basics', 'steady_aim', 'aimed_shot'] },
  dwarf: { weapon: 'iron_sword', skills: ['sword_basics', 'sword_stance', 'quick_strike'] },
  human: { weapon: 'iron_sword', skills: ['sword_basics', 'quick_strike'] },
  halfling: { weapon: 'iron_dagger', skills: ['dagger_basics', 'poison_blade'] },
  tiefling: { weapon: 'wooden_staff', skills: ['shadow_bolt', 'darkvision'] },
  drow: { weapon: 'iron_dagger', skills: ['shadow_bolt', 'darkvision'] }
}

const RACE_SKILL_TARGETS = {
  elf: ['forest_step', 'elven_accuracy'],
  dwarf: ['dwarven_toughness', 'forge_blessing'],
  human: ['human_determination'],
  halfling: ['lucky_dodge', 'sneaky_strike'],
  tiefling: ['infernal_constitution', 'hellish_rebuke'],
  drow: ['shadow_affinity', 'drow_poison'],
  dragonborn: ['draconic_presence', 'breath_weapon']
}

/** @type {Record<string, object>} */
export const NPC_BUILDS = {
    alchemist: {
    skills: ['volatile_expert', 'field_medic', 'human_determination'],
    items: [{ itemId: 'health_potion', qty: 6 }, { itemId: 'stamina_potion', qty: 4 }, { itemId: 'herbs', qty: 8 }],
    equip: { armor: 'cloth_robes' },
    stats: { hp: 14, stamina: 16, magicPower: 0, accuracy: -2 },
    lumens: 380,
    note: 'Field kit of reagents, poisons, and polished healing draughts.'
  },
  archer: {
    skills: ['multi_shot', 'quick_draw', 'grappling_shot', 'human_determination'],
    items: [{ itemId: 'health_potion', qty: 2 }],
    equip: { weapon: 'hunting_bow', armor: 'leather_armor' },
    stats: { hp: 13, stamina: 14, accuracy: 0, speed: 4 }
  },
  assassin_rogue: {
    skills: ['shadow_step', 'poison_blade', 'flurry', 'human_determination'],
    items: [{ itemId: 'health_potion', qty: 2 }, { itemId: 'stamina_potion', qty: 2 }, { itemId: 'bronze_dagger', qty: 1 }],
    equip: { weapon: 'iron_dagger', offhand: 'bronze_dagger', armor: 'studded_leather' },
    stats: { hp: 12, stamina: 14, accuracy: 1, speed: 5, strength: -1 }
  },
  battle_mage: {
    skills: ['fireball', 'quick_strike', 'sword_basics', 'human_determination'],
    items: [{ itemId: 'health_potion', qty: 3 }, { itemId: 'stamina_potion', qty: 3 }],
    equip: { weapon: 'iron_sword', armor: 'cloth_robes' },
    stats: { hp: 14, stamina: 16, magicPower: 1, strength: -1, accuracy: -1 }
  },
  beast_tamer: {
    skills: ['steady_aim', 'ranged_basics', 'field_medic', 'pounce', 'human_determination'],
    items: [{ itemId: 'health_potion', qty: 3 }, { itemId: 'herbs', qty: 5 }],
    equip: { weapon: 'hunting_bow', armor: 'leather_armor' },
    stats: { hp: 14, stamina: 15, accuracy: 0, speed: 3 },
    note: 'Travels with a trained predator; carries treats and tranquilizer herbs.'
  },
  berserker: {
    skills: ['axe_basics', 'cleave', 'berserker_rage', 'human_determination'],
    items: [{ itemId: 'berserker_potion', qty: 2 }],
    equip: { weapon: 'berserker_axe', armor: 'leather_armor' },
    stats: { hp: 18, stamina: 16, strength: 2, speed: 3, physicalDefence: 6 },
    toggles: ['berserker_rage']
  },
  bounty_hunter: {
    skills: ['aimed_shot', 'power_shot', 'grappling_shot', 'human_determination'],
    items: [{ itemId: 'health_potion', qty: 2 }, { itemId: 'rope', qty: 1 }],
    equip: { weapon: 'crossbow', armor: 'studded_leather' },
    stats: { hp: 15, stamina: 14, accuracy: 1, strength: -1, speed: 3 }
  },
  con_artist: {
    skills: ['dagger_basics', 'poison_blade', 'darkvision', 'human_determination'],
    items: [{ itemId: 'wine', qty: 2 }, { itemId: 'health_potion', qty: 1 }],
    equip: { weapon: 'iron_dagger', armor: 'cloth_robes' },
    stats: { hp: 12, stamina: 13, accuracy: 0, speed: 4, magicPower: -2 },
    currency: { copper: 500, silver: 80, gold: 12 }
  },
  cultist: {
    skills: ['life_drain', 'darkness', 'shadow_bolt', 'human_determination'],
    items: [{ itemId: 'health_potion', qty: 2 }],
    equip: { weapon: 'wooden_staff', armor: 'cloth_robes' },
    stats: { hp: 13, stamina: 15, magicPower: 2, accuracy: -2 },
    note: 'Chalice, black candles, and forbidden sigils hidden beneath the robes.'
  },
  duelist: {
    skills: ['parry', 'quick_strike', 'lunge_attack', 'human_determination'],
    items: [{ itemId: 'health_potion', qty: 2 }],
    equip: { weapon: 'steel_sword', armor: 'leather_armor' },
    stats: { hp: 14, stamina: 15, accuracy: 1, speed: 4, strength: 0 }
  },
  elementalist: {
    skills: ['fire_attunement', 'fireball', 'ice_spear', 'human_determination'],
    items: [{ itemId: 'stamina_potion', qty: 3 }],
    equip: { weapon: 'elemental_staff', armor: 'cloth_robes' },
    stats: { hp: 13, stamina: 17, magicPower: 3, accuracy: -2 }
  },
  enchanter: {
    skills: ['dispel_touch', 'human_determination'],
    items: [{ itemId: 'health_potion', qty: 2 }, { itemId: 'stamina_potion', qty: 2 }],
    equip: { weapon: 'mystic_staff', armor: 'cloth_robes' },
    stats: { hp: 12, stamina: 14, magicPower: 2, accuracy: -2 }
  },
  engineer: {
    skills: ['explosive_compounds', 'weaponwright', 'human_determination'],
    items: [{ itemId: 'health_potion', qty: 2 }, { itemId: 'iron_ore', qty: 4 }],
    equip: { weapon: 'crossbow', armor: 'leather_armor' },
    stats: { hp: 14, stamina: 14, strength: 0, accuracy: 0, physicalDefence: 10 }
  },
  gambler: {
    skills: ['dagger_basics', 'poison_blade', 'human_determination'],
    items: [{ itemId: 'wine', qty: 3 }],
    equip: { weapon: 'iron_dagger', armor: 'cloth_robes' },
    stats: { hp: 12, stamina: 13, accuracy: 0, speed: 4 },
    currency: { copper: 300, silver: 45, gold: 8 }
  },
  gladiator: {
    skills: ['whirlwind', 'quick_strike', 'sword_stance', 'human_determination'],
    items: [{ itemId: 'health_potion', qty: 3 }, { itemId: 'stamina_potion', qty: 2 }],
    equip: { weapon: 'steel_sword', armor: 'chain_mail' },
    stats: { hp: 18, stamina: 16, strength: 1, physicalDefence: 11, speed: 3 }
  },
  inquisitor: {
    skills: ['holy_weapon', 'purify', 'light_ray', 'human_determination'],
    items: [{ itemId: 'health_potion', qty: 3 }],
    equip: { weapon: 'steel_sword', armor: 'chain_mail' },
    stats: { hp: 16, stamina: 15, magicPower: 1, accuracy: 0, physicalDefence: 11 }
  },
  medic: {
    skills: ['light_ray', 'healing_light', 'human_determination'],
    items: [{ itemId: 'health_potion', qty: 8 }, { itemId: 'herbs', qty: 10 }],
    equip: { armor: 'cloth_robes' },
    stats: { hp: 14, stamina: 15, magicPower: 0, accuracy: -2 }
  },
  mercenary: {
    skills: ['parry', 'sword_basics', 'quick_strike', 'human_determination'],
    items: [{ itemId: 'health_potion', qty: 3 }, { itemId: 'stamina_potion', qty: 2 }],
    equip: { weapon: 'iron_sword', armor: 'chain_mail' },
    stats: { hp: 17, stamina: 15, strength: 0, physicalDefence: 11, accuracy: -1 }
  },
  monk: {
    skills: ['hammer_basics', 'heavy_impact', 'human_determination'],
    items: [{ itemId: 'health_potion', qty: 2 }],
    equip: { weapon: 'stone_hammer', armor: 'cloth_robes' },
    stats: { hp: 15, stamina: 18, speed: 5, strength: 0, accuracy: 0, physicalDefence: 9 }
  },
  necromancer: {
    skills: ['life_drain', 'shadow_duplicate', 'darkness', 'human_determination'],
    items: [{ itemId: 'health_potion', qty: 2 }, { itemId: 'stamina_potion', qty: 3 }],
    equip: { weapon: 'void_staff', armor: 'cloth_robes' },
    stats: { hp: 13, stamina: 16, magicPower: 3, accuracy: -2, magicalDefence: 10 }
  },
  ninja: {
    skills: ['shadow_step', 'flurry', 'poison_blade', 'human_determination'],
    items: [{ itemId: 'stamina_potion', qty: 3 }, { itemId: 'bronze_dagger', qty: 1 }],
    equip: { weapon: 'iron_dagger', offhand: 'bronze_dagger', armor: 'studded_leather' },
    stats: { hp: 13, stamina: 16, accuracy: 1, speed: 6, strength: -1 }
  },
  paladin: {
    skills: ['holy_weapon', 'sanctuary', 'healing_light', 'human_determination'],
    items: [{ itemId: 'health_potion', qty: 4 }],
    equip: { weapon: 'steel_sword', armor: 'chain_mail' },
    stats: { hp: 18, stamina: 16, strength: 0, magicPower: 1, physicalDefence: 12, magicalDefence: 11 }
  },
  poisoner: {
    skills: ['acid_vials', 'explosive_compounds', 'poison_blade', 'human_determination'],
    items: [{ itemId: 'health_potion', qty: 2 }, { itemId: 'herbs', qty: 3 }],
    equip: { weapon: 'iron_dagger', armor: 'leather_armor' },
    stats: { hp: 12, stamina: 14, magicPower: 0, accuracy: 0, speed: 3 }
  },
  politician: {
    skills: ['human_determination', 'illuminate', 'light_ray'],
    items: [{ itemId: 'wine', qty: 4 }],
    equip: { armor: 'cloth_robes' },
    stats: { hp: 12, stamina: 12, accuracy: -1, speed: 2, magicPower: -2 },
    currency: { copper: 200, silver: 120, gold: 25 },
    note: 'Fine clothes, sealed letters, and more gold than combat sense.'
  },
  pyromancer: {
    skills: ['fire_attunement', 'fireball', 'fire_wall', 'human_determination'],
    items: [{ itemId: 'stamina_potion', qty: 3 }],
    equip: { weapon: 'crystal_staff', armor: 'cloth_robes' },
    stats: { hp: 13, stamina: 17, magicPower: 3, accuracy: -2 }
  },
  scout: {
    name: 'Ranger',
    skills: ['trail_warden', 'covering_fire', 'steady_aim', 'human_determination'],
    items: [{ itemId: 'health_potion', qty: 2 }, { itemId: 'stamina_potion', qty: 2 }],
    equip: { weapon: 'hunting_bow', armor: 'leather_armor' },
    stats: { hp: 13, stamina: 15, accuracy: 1, speed: 5 }
  },
  sergeant: {
    skills: ['parry', 'sword_stance', 'quick_strike', 'human_determination'],
    items: [{ itemId: 'health_potion', qty: 3 }],
    equip: { weapon: 'steel_sword', armor: 'chain_mail' },
    stats: { hp: 17, stamina: 15, strength: 0, physicalDefence: 12, accuracy: 0 }
  },
  smuggler: {
    skills: ['dagger_basics', 'shadow_step', 'human_determination'],
    items: [{ itemId: 'health_potion', qty: 2 }, { itemId: 'wine', qty: 2 }],
    equip: { weapon: 'iron_dagger', armor: 'studded_leather' },
    stats: { hp: 13, stamina: 14, speed: 4, accuracy: 0 },
    currency: { copper: 400, silver: 60, gold: 10 }
  },
  spearman: {
    skills: ['polearm_charge_attack', 'polearm_defensive_stance', 'human_determination'],
    items: [{ itemId: 'health_potion', qty: 2 }],
    equip: { weapon: 'spear', armor: 'chain_mail' },
    stats: { hp: 16, stamina: 15, strength: 0, physicalDefence: 11, accuracy: -1 }
  },
  spy: {
    skills: ['shadow_step', 'darkness', 'dagger_basics', 'human_determination'],
    items: [{ itemId: 'stamina_potion', qty: 2 }],
    equip: { weapon: 'iron_dagger', armor: 'leather_armor' },
    stats: { hp: 12, stamina: 15, accuracy: 1, speed: 4, magicPower: -1 }
  },
  thief: {
    skills: ['poison_blade', 'dual_wield', 'dagger_basics', 'human_determination'],
    items: [
      { itemId: 'health_potion', qty: 1 },
      { itemId: 'lockpick_set', qty: 1 },
      { itemId: 'iron_dagger', qty: 1 },
      { itemId: 'bronze_dagger', qty: 1 }
    ],
    equip: { weapon: 'iron_dagger', offhand: 'bronze_dagger', armor: 'leather_armor' },
    stats: { hp: 12, stamina: 14, accuracy: 0, speed: 5 },
    currency: { copper: 250, silver: 40, gold: 6 }
  },
  time_mage: {
    skills: ['teleport', 'blinding_flash', 'light_ray', 'human_determination'],
    items: [{ itemId: 'stamina_potion', qty: 4 }],
    equip: { weapon: 'arcane_staff', armor: 'cloth_robes' },
    stats: { hp: 12, stamina: 18, magicPower: 2, speed: 4, accuracy: -1 },
    note: 'Hourglass focus and chronomancy wards woven into spell threads.'
  },
  vampire_hunter: {
    skills: ['holy_weapon', 'aimed_shot', 'purify', 'human_determination'],
    items: [{ itemId: 'health_potion', qty: 4 }, { itemId: 'herbs', qty: 3 }],
    equip: { weapon: 'crossbow', armor: 'studded_leather' },
    stats: { hp: 15, stamina: 15, accuracy: 1, magicPower: 0, physicalDefence: 10 }
  },
  warlock: {
    skills: ['life_drain', 'darkness', 'summon_imp', 'human_determination'],
    items: [{ itemId: 'stamina_potion', qty: 3 }],
    equip: { weapon: 'void_staff', armor: 'cloth_robes' },
    stats: { hp: 13, stamina: 16, magicPower: 3, accuracy: -2 }
  },
  zealot: {
    skills: ['holy_weapon', 'berserker_rage', 'light_ray', 'human_determination'],
    items: [{ itemId: 'health_potion', qty: 3 }],
    equip: { weapon: 'battle_axe', armor: 'chain_mail' },
    stats: { hp: 17, stamina: 15, strength: 1, magicPower: 1, physicalDefence: 11 },
    toggles: ['berserker_rage']
  },
  heretic: {
    skills: ['life_drain', 'darkness', 'shadow_bolt', 'human_determination'],
    items: [{ itemId: 'health_potion', qty: 2 }],
    equip: { weapon: 'wooden_staff', armor: 'cloth_robes' },
    stats: { hp: 13, stamina: 15, magicPower: 2, accuracy: -2 }
  },
  pirate: {
    skills: ['ranged_basics', 'power_shot', 'sword_basics', 'quick_strike', 'human_determination'],
    items: [{ itemId: 'health_potion', qty: 2 }, { itemId: 'wine', qty: 3 }, { itemId: 'iron_sword', qty: 1 }],
    equip: { weapon: 'training_bow', armor: 'leather_armor' },
    stats: { hp: 15, stamina: 14, strength: 0, speed: 3, accuracy: -1 },
    currency: { copper: 300, silver: 35, gold: 7 },
    note: 'Cutlass in inventory — swap weapons for melee vs Power Shot.'
  },
}

export function loadGeneratorData(root) {
  const jsonDir = path.join(root, 'data', 'json')
  const skills = JSON.parse(fs.readFileSync(path.join(jsonDir, 'skills.json'), 'utf8'))
  const itemsRoot = JSON.parse(fs.readFileSync(path.join(jsonDir, 'items.json'), 'utf8'))
  const monsterLoot = JSON.parse(fs.readFileSync(path.join(jsonDir, 'monster-loot.json'), 'utf8'))
  const skillMeta = JSON.parse(fs.readFileSync(path.join(jsonDir, 'skill-meta.json'), 'utf8'))
  const itemIds = new Set()
  for (const group of Object.values(itemsRoot)) {
    if (!group || typeof group !== 'object') continue
    for (const item of Object.values(group)) {
      if (item?.id) itemIds.add(item.id)
    }
  }
  for (const loot of Object.values(monsterLoot)) {
    if (loot?.id) itemIds.add(loot.id)
  }
  const skillById = indexSkills(skills)
  const toggleSkills = new Set(Object.keys(skillMeta.TOGGLE_BONUSES || {}))
  return { skillById, itemIds, monsterLoot, toggleSkills }
}

function indexSkills(skillsRoot) {
  const skillById = new Map()
  const walk = (node, category = null, subcategory = null) => {
    if (!node || typeof node !== 'object') return
    if (Array.isArray(node)) {
      for (const skill of node) {
        if (!skill?.id || skillById.has(skill.id)) continue
        skillById.set(skill.id, { ...skill, category, subcategory })
      }
      return
    }
    for (const [key, value] of Object.entries(node)) {
      if (Array.isArray(value)) walk(value, category || key, category ? key : null)
      else if (value && typeof value === 'object') walk(value, category || key, key)
    }
  }
  walk(skillsRoot)
  return skillById
}

function pathToSkill(skillById, skillId) {
  const chain = []
  const visiting = new Set()
  function walk(id) {
    if (!id || visiting.has(id)) return
    const skill = skillById.get(id)
    if (!skill) return
    visiting.add(id)
    const prereqs = skill.prerequisites?.skills || []
    if (skill.prerequisites?.type === 'OR' && prereqs.length) {
      walk(prereqs[0])
    } else {
      for (const pre of prereqs) walk(pre)
    }
    chain.push(id)
  }
  walk(skillId)
  return chain
}

function expandSkillTargets(targets, skillById) {
  const out = new Set()
  for (const target of targets) {
    for (const id of pathToSkill(skillById, target)) out.add(id)
  }
  return [...out].filter(id => skillById.has(id))
}

function mergeStats(overrides = {}) {
  return { ...DEFAULT_STATS, ...overrides }
}

function makeInventory(itemSpecs, itemIds) {
  const inventory = []
  const equipped = { weapon: null, offhand: null, armor: null, accessory: null }
  for (const spec of itemSpecs) {
    if (!spec?.itemId || !itemIds.has(spec.itemId)) continue
    const uid = `premade_${spec.itemId}_${inventory.length}`
    inventory.push({ uid, itemId: spec.itemId, qty: Math.max(1, Number(spec.qty || 1)) })
    if (spec.equip && equipped[spec.equip] === null) equipped[spec.equip] = uid
  }
  return { inventory, equipped }
}

function addEquipFromMap(equipMap, itemIds, inventory, equipped) {
  for (const [slot, itemId] of Object.entries(equipMap || {})) {
    if (!itemId || !itemIds.has(itemId)) continue
    let entry = inventory.find(row => row.itemId === itemId)
    if (!entry) {
      entry = { uid: `premade_${itemId}_${inventory.length}`, itemId, qty: 1 }
      inventory.push(entry)
    }
    if (slot in equipped) equipped[slot] = entry.uid
  }
}

function buildFromSpec(spec, skillById, itemIds, toggleSkills) {
  const skills = expandSkillTargets(spec.skills || [], skillById)
  const itemRows = [...(spec.items || [])]
  const { inventory, equipped } = makeInventory(itemRows, itemIds)
  addEquipFromMap(spec.equip, itemIds, inventory, equipped)
  const activeToggles = (spec.toggles || []).filter(id => skills.includes(id) && toggleSkills.has(id))
  return {
    skills,
    stats: mergeStats(spec.stats),
    inventory,
    equipped,
    activeToggles,
    notes: spec.note || ''
  }
}

function powerTier(stem) {
  const s = stem.toLowerCase()
  if (/ancient|_lord|_prince|kraken|lich|archangel|demon_weapon|dragon_lord|mind_flayer|rat_king|crime_boss|warlord$|devil_lord|demon_prince/.test(s)) return 5
  if (/greater|hell_knight|frost_giant|fire_giant|cloud_giant|hill_giant|cherubim|prismatic|shadow_dragon|orc_warlord|goblin_chief|orc_chief|dragon$|grizzly|polar_bear|moose/.test(s)) return 4
  if (/wyvern|serpent|golem|phantom|revenant|banshee|shaman|chief|lieutenant|possessed|haunted|cursed_knight|doppelganger|poltergeist|dire_wolf|brown_bear|lion|cougar|giant_spider|croc|alligator|gator|shark|bull|tiger|panther/.test(s)) return 3
  if (/warrior|scout|raider|brute|berserker|bandit|guard|thief|torturer|slave|medic|engineer|wolf|black_bear|boar|spider|eagle|hawk|scorpion|horse|vulture|deer|piranha/.test(s)) return 2
  if (/chicken|rooster|goat|rabbit|bat|garden_snake|farm_|hen|piglet|duck/.test(s)) return 1
  return 1
}

function monsterStats(tier, stem) {
  const s = stem.toLowerCase()
  const bulky = /giant|golem|kraken|dragon|turtle|armor|shield|bear|bull|moose|grizzly|boar|croc|alligator|gator|shark/.test(s)
  const fast = /scout|thief|sprite|rat|eel|ninja|phantom|wolf|deer|horse|cat|lion|cougar|panther|rabbit|bat|piranha|spider|eagle|hawk|snake|serpent/.test(s)
  const magical = /shaman|lich|angel|devil|demon|sprite|flayer|wyvern|dragon|mage/.test(s)
  return mergeStats({
    hp: 10 + tier * (bulky ? 8 : 6),
    stamina: 10 + tier * 3,
    strength: -3 + tier * (bulky ? 2 : 1) + (fast ? 0 : 0),
    magicPower: -3 + (magical ? tier * 2 : tier),
    accuracy: -3 + tier + (fast ? 1 : 0),
    speed: 2 + (fast ? tier : Math.floor(tier / 2)),
    physicalDefence: 8 + tier * (bulky ? 3 : 2),
    magicalDefence: 8 + tier * (magical ? 3 : 2)
  })
}

function monsterSkillTargets(stem, tier) {
  const s = stem.toLowerCase()
  const targets = []
  const isCritter = /chicken|rooster|goat|rabbit|duck|hen|bat|garden_snake|deer/.test(s)

  if (!isCritter) {
    if (tier >= 5) targets.push('metal_skin', 'damage_reduction', 'rapid_healing', 'multiattack')
    else if (tier >= 4) targets.push('armored_plates', 'regeneration', 'multiattack')
    else if (tier >= 3) targets.push('rock_skin', 'magical_resistance')
    else if (tier >= 2) targets.push('magical_resistance', 'tough_skin')
    else targets.push('tough_skin')
  }

  if (/slime/.test(s)) {
    targets.push('acid_spit')
    if (tier >= 3) targets.push('regeneration')
  } else if (/rat/.test(s)) {
    targets.push('bite_attack')
    if (tier >= 2) targets.push('crushing_bite')
    if (/plague/.test(s)) targets.push('venomous_claws', 'immunity_poison')
  } else if (/fish|piranha|eel/.test(s)) {
    targets.push('bite_attack')
    if (/electric|eel/.test(s)) targets.push('lightning_breath')
    if (/fire/.test(s)) targets.push('fire_breath')
    if (/ice/.test(s)) targets.push('ice_breath')
  } else if (/octopus|kraken/.test(s)) {
    targets.push('bite_attack', 'tail_swipe')
    if (tier >= 3) targets.push('spiked_tail', 'mind_control')
    if (/kraken/.test(s)) targets.push('energy_drain', 'monster_earthquake')
  } else if (/wyvern|dragon/.test(s)) {
    if (/ice|arctic|frost/.test(s)) targets.push('ice_breath')
    else if (/fire|desert|red|golden/.test(s)) targets.push('fire_breath')
    else if (/crystal|prismatic/.test(s)) targets.push('fire_breath', 'ice_breath', 'lightning_breath')
    else if (/shadow/.test(s)) targets.push('poison_breath', 'energy_drain')
    else if (/forest/.test(s)) targets.push('poison_breath')
    else targets.push('fire_breath')
    targets.push('monster_flight', 'tail_swipe')
    if (tier >= 4) targets.push('spiked_tail', 'rend')
    if (tier >= 5) targets.push('monster_ancient_knowledge')
  } else if (/shaman/.test(s)) {
    targets.push('magical_resistance', 'web_shot', 'paralyzing_gaze')
    if (tier >= 3) targets.push('mind_control')
    if (tier >= 2) targets.push('claws')
  } else if (/goblin|orc|bandit|brute|warrior|raider|chief|lieutenant|warlord|knight|guard|torturer|slave/.test(s)) {
    targets.push('claws')
    if (tier >= 2) targets.push('razor_claws', 'monster_charge_attack')
    if (tier >= 3) targets.push('monster_berserker_rage', 'pounce')
    if (/berserker/.test(s)) targets.push('monster_berserker_rage', 'blood_frenzy')
    if (/scout|thief/.test(s)) targets.push('pounce', 'monster_shadow_step')
    if (/spear|pike/.test(s)) targets.push('gore')
  } else if (/giant/.test(s)) {
    targets.push('monster_charge_attack', 'trample', 'gore')
    if (/fire/.test(s)) targets.push('fire_breath')
    if (/frost|ice/.test(s)) targets.push('ice_breath')
    if (/hill|cloud/.test(s)) targets.push('monster_earthquake')
  } else if (/golem/.test(s)) {
    targets.push('rock_skin', 'metal_skin', 'monster_earthquake')
  } else if (/devil|demon/.test(s)) {
    targets.push('fire_breath', 'energy_drain', 'paralyzing_gaze')
    if (tier >= 4) targets.push('mind_control')
  } else if (/angel|cherubim|healing/.test(s)) {
    targets.push('magical_resistance', 'fear_aura')
    if (/light|arch|healing/.test(s)) targets.push('regeneration', 'spell_turning')
    if (/arch/.test(s)) targets.push('rapid_healing')
  } else if (/lich|revenant|banshee|phantom|poltergeist/.test(s)) {
    targets.push('energy_drain', 'paralyzing_gaze')
    if (/lich/.test(s)) targets.push('mind_control', 'spell_turning')
    if (/banshee|phantom|poltergeist/.test(s)) targets.push('life_drain')
  } else if (/serpent/.test(s)) {
    targets.push('bite_attack', 'venomous_claws', 'poison_breath')
  } else if (/sprite/.test(s)) {
    targets.push('magical_resistance', 'teleport')
    if (/fire/.test(s)) targets.push('fire_breath')
    if (/ice/.test(s)) targets.push('ice_breath')
    if (/light/.test(s)) targets.push('fear_aura')
  } else if (/armor|shield|bow|staff|weapon|possessed|blessed|cursed|haunted|living/.test(s)) {
    targets.push('metal_skin', 'monster_charge_attack')
    if (/bow/.test(s)) targets.push('razor_claws')
    if (/staff|weapon/.test(s)) targets.push('energy_drain')
    if (/blessed|healing/.test(s)) targets.push('regeneration')
    if (/cursed|haunted/.test(s)) targets.push('energy_drain', 'paralyzing_gaze')
  } else if (/mind_flayer|doppelganger/.test(s)) {
    targets.push('mind_control', 'energy_drain', 'paralyzing_gaze', 'teleport')
  } else if (/chicken|rooster|goat|rabbit|duck|hen/.test(s)) {
    targets.push('claws')
    if (/rooster/.test(s)) targets.push('bite_attack')
  } else if (/wolf|dog|coyote|hyena/.test(s)) {
    targets.push('bite_attack', 'pounce')
    if (/dire/.test(s)) targets.push('razor_claws', 'crushing_bite')
  } else if (/bear|grizzly|polar/.test(s)) {
    targets.push('tough_skin', 'claws', 'crushing_bite')
    if (/grizzly|polar/.test(s)) targets.push('rock_skin')
  } else if (/lion|tiger|cougar|panther|leopard|lynx/.test(s)) {
    targets.push('claws', 'pounce', 'bite_attack')
    if (/lion|tiger/.test(s)) targets.push('razor_claws')
  } else if (/boar|bull|pig/.test(s)) {
    targets.push('gore', 'monster_charge_attack', 'tough_skin')
  } else if (/deer|horse|elk|moose|donkey|mule/.test(s)) {
    targets.push('monster_charge_attack')
    if (/moose|elk|horse/.test(s)) targets.push('trample')
    if (/moose|elk/.test(s)) targets.push('gore')
  } else if (/eagle|hawk|vulture|owl|raven|crow/.test(s)) {
    targets.push('claws', 'monster_flight')
    if (/eagle|hawk/.test(s)) targets.push('razor_claws')
  } else if (/spider/.test(s)) {
    targets.push('web_shot', 'venomous_claws', 'bite_attack')
    if (/giant/.test(s)) targets.push('poison_breath')
  } else if (/scorpion/.test(s)) {
    targets.push('venomous_claws', 'tail_swipe')
  } else if (/croc|gator|alligator/.test(s)) {
    targets.push('bite_attack', 'crushing_bite', 'tough_skin')
  } else if (/shark/.test(s)) {
    targets.push('bite_attack', 'crushing_bite', 'pounce')
  } else if (/bat/.test(s)) {
    targets.push('bite_attack', 'monster_flight')
  } else if (/crab|lobster/.test(s)) {
    targets.push('claws', 'tough_skin')
  } else if (/bee|wasp|hornet/.test(s)) {
    targets.push('venomous_claws', 'bite_attack')
  } else if (/piranha/.test(s)) {
    targets.push('bite_attack')
    if (/giant/.test(s)) targets.push('crushing_bite', 'razor_claws')
  } else if (/garden_snake|viper|cobra/.test(s)) {
    targets.push('bite_attack', 'venomous_claws')
  } else {
    targets.push('claws', 'bite_attack')
    if (tier >= 2) targets.push('razor_claws')
  }

  return [...new Set(targets.filter(Boolean))]
}

function highestLootSkill(skillIds) {
  const owned = new Set(skillIds)
  const processed = new Set()
  const lootSkills = []
  for (const skillId of skillIds) {
    if (processed.has(skillId)) continue
    let highest = skillId
    for (const [base, chain] of Object.entries(MONSTER_SKILL_CHAINS)) {
      const inChain = skillId === base || chain.includes(skillId)
      if (!inChain) continue
      processed.add(base)
      chain.forEach(id => processed.add(id))
      if (owned.has(base)) highest = base
      for (const upgrade of chain) {
        if (owned.has(upgrade)) highest = upgrade
      }
    }
    if (!processed.has(skillId)) processed.add(skillId)
    lootSkills.push(highest)
  }
  return [...new Set(lootSkills)]
}

function monsterDropLoot(skillIds, monsterLoot, itemIds) {
  const items = []
  const seen = new Set()
  for (const skillId of highestLootSkill(skillIds)) {
    const loot = monsterLoot[skillId]
    if (!loot?.id || seen.has(loot.id) || !itemIds.has(loot.id)) continue
    seen.add(loot.id)
    items.push({ itemId: loot.id, qty: 1 })
  }
  return items
}

function monsterCarriedGear(stem, tier, itemIds) {
  const s = stem.toLowerCase()
  const items = []
  const add = (itemId, equip = null) => {
    if (itemIds.has(itemId)) items.push({ itemId, qty: 1, equip })
  }

  if (/shaman|lich|mage|wizard|warlock|sprite|staff|flayer/.test(s)) {
    add(tier >= 4 ? 'void_staff' : tier >= 3 ? 'mystic_staff' : 'wooden_staff', 'weapon')
    add('cloth_robes', 'armor')
  } else if (/knight|warrior|guard|chief|warlord|lieutenant|orc|goblin|bandit|brute|raider|hell/.test(s)) {
    add(tier >= 4 ? 'steel_sword' : tier >= 2 ? 'iron_sword' : 'bronze_sword', 'weapon')
    add(tier >= 4 ? 'chain_mail' : 'leather_armor', 'armor')
  } else if (/archer|bow|haunted_bow/.test(s)) {
    add(tier >= 3 ? 'crossbow' : 'hunting_bow', 'weapon')
    add('leather_armor', 'armor')
  } else if (/golem/.test(s)) {
    add('iron_sword', 'weapon')
  } else if (/giant/.test(s)) {
    add(tier >= 3 ? 'steel_sword' : 'iron_sword', 'weapon')
  }

  if (/bandit|thief|goblin_thief|smuggler|pirate|raider/.test(s)) {
    add('health_potion')
    if (tier >= 2) add('stamina_potion')
  }
  if (/shaman|lich/.test(s) && tier >= 3) add('stamina_potion')

  return items
}

function buildMonster(stem, skillById, itemIds, monsterLoot, toggleSkills) {
  const tier = powerTier(stem)
  const skillTargets = monsterSkillTargets(stem, tier)
  const skills = expandSkillTargets(skillTargets, skillById)
  const dropItems = monsterDropLoot(skills, monsterLoot, itemIds)
  const carried = monsterCarriedGear(stem, tier, itemIds)
  const itemSpecs = [...carried, ...dropItems]
  const { inventory, equipped } = makeInventory(itemSpecs, itemIds)
  const dropNote = dropItems.length
    ? `Potential defeat drops: ${dropItems.map(row => row.itemId).join(', ')}.`
    : ''
  const toggles = skills.filter(id => toggleSkills.has(id) && /rage/i.test(id))
  return {
    skills,
    stats: monsterStats(tier, stem),
    inventory,
    equipped,
    activeToggles: toggles,
    notes: dropNote
  }
}

function pedestrianElementAffinity(stem) {
  const match = stem.match(/dragonborn_([a-z]+)/i)
  if (!match) return ''
  const raw = match[1].toLowerCase()
  if (raw === 'lightning') return 'thunder'
  return raw
}

function buildPedestrian(stem, race, skillById, itemIds) {
  const weaponPlan = PEDESTRIAN_WEAPON[race]
    || (race === 'dragonborn' ? { weapon: 'iron_sword', skills: [] } : PEDESTRIAN_WEAPON.human)
  const racialTargets = RACE_SKILL_TARGETS[race] || RACE_SKILL_TARGETS.human
  const element = pedestrianElementAffinity(stem)
  const magicTargets = element && ELEMENT_MAGIC_TARGETS[element]
    ? ELEMENT_MAGIC_TARGETS[element].slice(0, 2)
    : []
  const skills = expandSkillTargets([...racialTargets, ...weaponPlan.skills, ...magicTargets], skillById)
  const weaponId = weaponPlan.weapon
  const itemSpecs = [{ itemId: 'health_potion', qty: 2 }]
  if (weaponId) itemSpecs.push({ itemId: weaponId, qty: 1, equip: 'weapon' })
  if (weaponPlan.sidearm && itemIds.has(weaponPlan.sidearm)) {
    itemSpecs.push({ itemId: weaponPlan.sidearm, qty: 1 })
  }
  itemSpecs.push({ itemId: 'leather_armor', qty: 1, equip: 'armor' })
  const { inventory, equipped } = makeInventory(itemSpecs, itemIds)
  const statBias = {
    elf: { magicPower: -2, accuracy: -2, stamina: 11 },
    dwarf: { hp: 12, physicalDefence: 10, strength: -2 },
    human: { hp: 11, stamina: 11, accuracy: -2 },
    halfling: { speed: 4, accuracy: -2, hp: 11 },
    tiefling: { magicPower: -1, accuracy: -2, magicalDefence: 9 },
    drow: { magicPower: -1, speed: 3, accuracy: -1 },
    dragonborn: { strength: -2, physicalDefence: 9, magicalDefence: 9, hp: 11 }
  }
  return {
    skills,
    stats: mergeStats(statBias[race] || {}),
    inventory,
    equipped,
    activeToggles: [],
    elementalAffinity: element,
    notes: element ? `Pedestrian dragonborn with ${element} affinity.` : ''
  }
}

export function generatePremadeBuild(inferred, stem, data) {
  const { skillById, itemIds, monsterLoot, toggleSkills } = data
  const stemLower = stem.toLowerCase()
  let build

  if (inferred.category === 'pedestrian') {
    build = buildPedestrian(stemLower, inferred.race, skillById, itemIds)
  } else if (inferred.category === 'npc') {
    const spec = NPC_BUILDS[inferred.premadeId]
    if (spec) {
      build = buildFromSpec(spec, skillById, itemIds, toggleSkills)
      build.notes = [spec.note, inferred.notes].filter(Boolean).join(' ')
    } else {
      build = buildFromSpec({
        skills: ['human_determination', 'sword_basics', 'quick_strike'],
        equip: { weapon: 'iron_sword', armor: 'leather_armor' },
        items: [{ itemId: 'health_potion', qty: 2 }],
        stats: { hp: 14, stamina: 14, strength: -2, accuracy: -2 }
      }, skillById, itemIds, toggleSkills)
    }
  } else {
    build = buildMonster(stemLower, skillById, itemIds, monsterLoot, toggleSkills)
    build.notes = [build.notes, inferred.notes].filter(Boolean).join(' ')
  }

  return applyDefeatRewards(inferred, stemLower, build, skillById)
}
