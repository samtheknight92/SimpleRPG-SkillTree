import {
  HOMEBREW_STORAGE_KEY,
  HOMEBREW_STORE_VERSION,
  HOMEBREW_ID_PREFIX,
  SHOP_MIN_LEVEL_BY_RARITY,
  TIER_LUMEN_COST,
  HOMEBREW_SKILL_DAMAGE_MODES,
  HOMEBREW_ELEMENT_TYPES,
  HOMEBREW_SKILL_CATEGORIES,
  HOMEBREW_DAMAGE_STAT_KEYS
} from './constants.js'
import { isValidDamageDice } from './homebrew-combat.js'
import { debounce } from './utils.js'
import { cache, getItem, getItemSearchText, getSkill, rarityRank, registerHomebrewRacesInCache } from './cache.js'
import { normalizeCounterRuleOperator } from './items.js'
import { getRacesData, getSkillsData } from './data.js'
import { getEffect } from './character.js'
import { state } from './state.js'

/** @type {{ version: number, items: Record<string, object>, skills: Record<string, object>, races: Record<string, object> }} */
let store = { version: HOMEBREW_STORE_VERSION, items: {}, skills: {}, races: {} }

const saveDebounced = debounce(() => {
  try {
    localStorage.setItem(HOMEBREW_STORAGE_KEY, JSON.stringify({
      ...store,
      updated: new Date().toISOString()
    }))
  } catch (error) {
    console.error('Homebrew save failed', error)
  }
}, 200)

export function loadHomebrewStore() {
  try {
    const raw = localStorage.getItem(HOMEBREW_STORAGE_KEY)
    if (!raw) return store
    const parsed = JSON.parse(raw)
    store = {
      version: parsed.version || HOMEBREW_STORE_VERSION,
      items: parsed.items && typeof parsed.items === 'object' ? parsed.items : {},
      skills: parsed.skills && typeof parsed.skills === 'object' ? parsed.skills : {},
      races: parsed.races && typeof parsed.races === 'object' ? parsed.races : {}
    }
  } catch (error) {
    console.error('Homebrew load failed', error)
    store = { version: HOMEBREW_STORE_VERSION, items: {}, skills: {}, races: {} }
  }
  return store
}

export function saveHomebrewNow() {
  saveDebounced.cancel?.()
  try {
    localStorage.setItem(HOMEBREW_STORAGE_KEY, JSON.stringify({
      ...store,
      updated: new Date().toISOString()
    }))
  } catch (error) {
    console.error('Homebrew save failed', error)
  }
}

export function getHomebrewStore() {
  return store
}

export function listHomebrewItems() {
  return Object.values(store.items)
    .map(normalizeHomebrewItem)
    .filter(Boolean)
    .sort((a, b) => String(a.name).localeCompare(String(b.name)))
}

export function getHomebrewItem(itemId) {
  const row = store.items[itemId]
  return row ? normalizeHomebrewItem(row) : null
}

export function ensureCustomId(preferred, name = 'item') {
  return ensureCustomEntryId(preferred, name, 'item')
}

export function ensureCustomSkillId(preferred, name = 'skill') {
  return ensureCustomEntryId(preferred, name, 'skill')
}

export function ensureCustomRaceId(preferred, name = 'race') {
  return ensureCustomEntryId(preferred, name, 'race')
}

function customIdInUse(id, kind) {
  if (kind === 'item') {
    if (store.items[id]) return true
    const cached = getItem(id)
    return Boolean(cached && cached.source !== 'homebrew')
  }
  if (kind === 'race') {
    if (store.races[id]) return true
    return Boolean(getRacesData()[id])
  }
  if (store.skills[id]) return true
  const cached = getSkill(id)
  if (cached && cached.source !== 'homebrew') return true
  if (store.items[id]) return true
  if (store.races[id]) return true
  return false
}

function ensureCustomEntryId(preferred, name, kind) {
  const pref = String(preferred || '').trim()
  const slug = String(name || kind).toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '').slice(0, 40)
  let stem = pref.startsWith(HOMEBREW_ID_PREFIX) ? pref : `${HOMEBREW_ID_PREFIX}${slug || kind}`
  let candidate = stem
  let n = 2
  while (true) {
    const storeHit = kind === 'item'
      ? store.items[candidate]
      : kind === 'race'
        ? store.races[candidate]
        : store.skills[candidate]
    if (!customIdInUse(candidate, kind)) return candidate
    if (storeHit && candidate === pref) return candidate
    candidate = `${stem}_${n++}`
  }
}

const STAT_KEYS = ['strength', 'magicPower', 'accuracy', 'speed', 'hp', 'stamina', 'physicalDefence', 'magicalDefence']

export function emptyHomebrewDraft(overrides = {}) {
  return {
    id: '',
    name: '',
    desc: '',
    type: 'weapon',
    icon: '✦',
    rarity: 'common',
    damage: '',
    listInShop: false,
    shopPriceGil: 0,
    statModifiers: {},
    specialEffects: [],
    counterLabel: '',
    counterDefault: 0,
    counterMax: null,
    blockUnequipWithCounter: false,
    blockRemoveWithCounter: false,
    counterEquippedOnly: false,
    counterRuleOperator: 'above',
    counterRuleValue: 0,
    ...overrides
  }
}

export function normalizeSpecialEffectIds(raw) {
  if (!Array.isArray(raw)) return []
  return [...new Set(raw.map(id => String(id || '').trim()).filter(Boolean))]
}

export function normalizeHomebrewItem(raw) {
  if (!raw || typeof raw !== 'object') return null
  const name = String(raw.name || '').trim().slice(0, 80)
  if (!name) return null
  const id = raw.id && store.items[raw.id] ? raw.id : ensureCustomId(raw.id, name)
  const type = String(raw.type || 'accessory').toLowerCase()
  const rarity = String(raw.rarity || 'common').toLowerCase()
  const listInShop = Boolean(raw.listInShop)
  const shopPriceGil = Math.max(0, Math.floor(Number(raw.shopPriceGil ?? raw.shopPrice ?? 0)))
  const statModifiers = {}
  for (const key of STAT_KEYS) {
    const value = Number(raw.statModifiers?.[key] ?? raw[key])
    if (Number.isFinite(value) && value !== 0) statModifiers[key] = value
  }
  const damage = type.includes('weapon') ? String(raw.damage || '').trim().slice(0, 24) : ''
  const priceGil = listInShop ? shopPriceGil : 0
  const specialEffects = normalizeSpecialEffectIds(raw.specialEffects)
  const counterLabel = String(raw.counterLabel || '').trim().slice(0, 24)
  const counterDefault = counterLabel
    ? Math.max(0, Math.floor(Number(raw.counterDefault ?? 0)))
    : undefined
  const blockUnequipWithCounter = counterLabel ? Boolean(raw.blockUnequipWithCounter) : undefined
  const blockRemoveWithCounter = counterLabel ? Boolean(raw.blockRemoveWithCounter) : undefined
  const counterEquippedOnly = counterLabel ? Boolean(raw.counterEquippedOnly) : undefined
  const counterMaxRaw = counterLabel ? Number(raw.counterMax) : NaN
  const counterMax = counterLabel && Number.isFinite(counterMaxRaw) && counterMaxRaw > 0
    ? Math.floor(counterMaxRaw)
    : undefined
  const counterRuleOperator = counterLabel ? normalizeCounterRuleOperator(raw.counterRuleOperator) : undefined
  const counterRuleValue = counterLabel
    ? Math.max(0, Math.floor(Number(raw.counterRuleValue ?? 0)))
    : undefined
  return {
    id,
    name,
    desc: String(raw.desc || '').trim().slice(0, 2000),
    type,
    icon: String(raw.icon || '✦').trim().slice(0, 8) || '✦',
    rarity,
    damage: damage || undefined,
    statModifiers: Object.keys(statModifiers).length ? statModifiers : undefined,
    specialEffects: specialEffects.length ? specialEffects : undefined,
    counterLabel: counterLabel || undefined,
    counterDefault,
    counterMax,
    blockUnequipWithCounter,
    blockRemoveWithCounter,
    counterEquippedOnly,
    counterRuleOperator,
    counterRuleValue,
    listInShop,
    shopPriceGil: priceGil,
    price: priceGil > 0 ? { copper: priceGil } : undefined,
    shopMinLevel: SHOP_MIN_LEVEL_BY_RARITY[rarity] ?? 1,
    source: 'homebrew',
    created: raw.created || new Date().toISOString(),
    updated: new Date().toISOString()
  }
}

export function upsertHomebrewItem(raw) {
  const item = normalizeHomebrewItem(raw)
  if (!item) throw new Error('Name is required.')
  const conflict = getItem(item.id)
  if (conflict && conflict.source !== 'homebrew' && !store.items[item.id]) {
    throw new Error(`ID "${item.id}" conflicts with official content.`)
  }
  const existing = store.items[item.id]
  if (existing) item.created = existing.created
  store.items[item.id] = item
  saveDebounced()
  registerHomebrewInCache()
  return item
}

export function deleteHomebrewItem(itemId) {
  if (!store.items[itemId]) return false
  delete store.items[itemId]
  saveDebounced()
  registerHomebrewInCache()
  return true
}

export function duplicateHomebrewItem(itemId) {
  const source = store.items[itemId]
  if (!source) return null
  const copy = normalizeHomebrewItem({
    ...source,
    id: ensureCustomId(`${itemId}_copy`, `${source.name} copy`),
    name: `${source.name} (copy)`
  })
  store.items[copy.id] = copy
  saveDebounced()
  registerHomebrewInCache()
  return copy
}

export function charactersUsingHomebrewItem(itemId) {
  return (state.characters || []).filter(character =>
    (character.inventory || []).some(entry => entry.itemId === itemId)
  )
}

export function listHomebrewSkills() {
  return Object.values(store.skills)
    .map(normalizeHomebrewSkill)
    .filter(Boolean)
    .sort((a, b) => String(a.name).localeCompare(String(b.name)))
}

export function getHomebrewSkill(skillId) {
  const row = store.skills[skillId]
  return row ? normalizeHomebrewSkill(row) : null
}

function normalizeDamageMode(raw) {
  const mode = String(raw || 'none').toLowerCase()
  return HOMEBREW_SKILL_DAMAGE_MODES.some(row => row.id === mode) ? mode : 'none'
}

function normalizeElementType(raw) {
  const value = String(raw || '').toLowerCase().trim()
  return HOMEBREW_ELEMENT_TYPES.includes(value) ? value : undefined
}

function defaultHomebrewDamageStat(damageMode) {
  return String(damageMode || '').includes('elemental') ? 'magicPower' : 'strength'
}

function normalizeDamageStat(raw, damageMode) {
  const value = String(raw || '').trim()
  if (!value || value === 'none') return undefined
  return HOMEBREW_DAMAGE_STAT_KEYS.includes(value) ? value : defaultHomebrewDamageStat(damageMode)
}

function normalizeActivationEffects(raw) {
  if (!Array.isArray(raw)) return []
  return raw.map(row => {
    const effectId = String(row?.effectId || '').trim()
    if (!effectId || !getEffect(effectId)) return null
    const durationRaw = Number(row.duration)
    const potencyRaw = row.potency
    return {
      effectId,
      duration: Number.isFinite(durationRaw) ? Math.max(0, Math.floor(durationRaw)) : 3,
      potency: potencyRaw === '' || potencyRaw == null || !Number.isFinite(Number(potencyRaw))
        ? undefined
        : Number(potencyRaw)
    }
  }).filter(Boolean)
}

export function emptyHomebrewSkillDraft(overrides = {}) {
  return {
    id: '',
    name: '',
    desc: '',
    icon: '✦',
    category: 'weapons',
    subcategory: 'sword',
    tier: 1,
    cost: TIER_LUMEN_COST[1],
    skillType: 'passive',
    staminaCost: 0,
    damageMode: 'none',
    damageDice: '',
    damageStat: '',
    elementalType: '',
    statModifiers: {},
    specialEffects: [],
    activationEffects: [],
    ...overrides
  }
}

function normalizeHomebrewSkillType(raw) {
  const type = String(raw?.skillType || raw?.type || 'passive').toLowerCase()
  if (type === 'toggle' || type === 'activatable') return type
  return 'passive'
}

export function normalizeHomebrewSkill(raw) {
  if (!raw || typeof raw !== 'object') return null
  const name = String(raw.name || '').trim().slice(0, 80)
  if (!name) return null
  const id = raw.id && store.skills[raw.id] ? raw.id : ensureCustomSkillId(raw.id, name)
  let category = String(raw.category || 'weapons').toLowerCase()
  if (category === 'homebrew') category = 'weapons'
  if (!HOMEBREW_SKILL_CATEGORIES.includes(category)) category = 'weapons'
  let subcategory = String(raw.subcategory || 'custom').toLowerCase().replace(/[^a-z0-9_]+/g, '_').slice(0, 32) || 'custom'
  if (category === 'racial') {
    const allowed = homebrewRaceOptionsForSkills()
    if (!allowed.includes(subcategory)) subcategory = allowed[0] || 'human'
  }
  const tier = Math.min(5, Math.max(1, Math.floor(Number(raw.tier || 1))))
  const skillType = normalizeHomebrewSkillType(raw)
  const cost = Math.max(0, Math.floor(Number(raw.cost ?? TIER_LUMEN_COST[tier] ?? 8)))
  const damageMode = normalizeDamageMode(raw.damageMode)
  const damageDiceRaw = String(raw.damageDice || '').trim().slice(0, 48)
  const damageDice = damageMode !== 'none' && isValidDamageDice(damageDiceRaw) ? damageDiceRaw : undefined
  const elementalType = damageMode.includes('elemental') ? normalizeElementType(raw.elementalType) : undefined
  const damageStat = damageMode !== 'none' ? normalizeDamageStat(raw.damageStat, damageMode) : undefined
  const activationEffects = normalizeActivationEffects(raw.activationEffects)
  const statModifiers = {}
  for (const key of STAT_KEYS) {
    const value = Number(raw.statModifiers?.[key] ?? raw[key])
    if (Number.isFinite(value) && value !== 0) statModifiers[key] = value
  }
  const specialEffects = normalizeSpecialEffectIds(raw.specialEffects)
  const staminaCost = skillType === 'passive'
    ? undefined
    : Math.max(0, Math.floor(Number(raw.staminaCost ?? 0)))
  return {
    id,
    name,
    desc: String(raw.desc || '').trim().slice(0, 2000),
    icon: String(raw.icon || '✦').trim().slice(0, 8) || '✦',
    category,
    subcategory,
    tier,
    cost,
    skillType,
    isToggle: skillType === 'toggle',
    staminaCost,
    damageMode: damageMode !== 'none' ? damageMode : undefined,
    damageDice,
    damageStat,
    elementalType,
    activationEffects: activationEffects.length ? activationEffects : undefined,
    statModifiers: Object.keys(statModifiers).length ? statModifiers : undefined,
    specialEffects: specialEffects.length ? specialEffects : undefined,
    source: 'homebrew',
    created: raw.created || new Date().toISOString(),
    updated: new Date().toISOString()
  }
}

export function upsertHomebrewSkill(raw) {
  const skill = normalizeHomebrewSkill(raw)
  if (!skill) throw new Error('Name is required.')
  if (skill.category === 'racial' && !homebrewRaceOptionsForSkills().includes(skill.subcategory)) {
    throw new Error('Pick a valid race for this racial skill.')
  }
  const conflict = getSkill(skill.id)
  if (conflict && conflict.source !== 'homebrew' && !store.skills[skill.id]) {
    throw new Error(`ID "${skill.id}" conflicts with official content.`)
  }
  if (getItem(skill.id) && !store.items[skill.id]) {
    throw new Error(`ID "${skill.id}" conflicts with a homebrew item.`)
  }
  const existing = store.skills[skill.id]
  if (existing) skill.created = existing.created
  store.skills[skill.id] = skill
  saveDebounced()
  registerHomebrewInCache()
  return skill
}

export function deleteHomebrewSkill(skillId) {
  if (!store.skills[skillId]) return false
  delete store.skills[skillId]
  saveDebounced()
  registerHomebrewInCache()
  return true
}

export function duplicateHomebrewSkill(skillId) {
  const source = store.skills[skillId]
  if (!source) return null
  const copy = normalizeHomebrewSkill({
    ...source,
    id: ensureCustomSkillId(`${skillId}_copy`, `${source.name} copy`),
    name: `${source.name} (copy)`
  })
  store.skills[copy.id] = copy
  saveDebounced()
  registerHomebrewInCache()
  return copy
}

export function charactersUsingHomebrewSkill(skillId) {
  return (state.characters || []).filter(character => (character.skills || []).includes(skillId))
}

export function listHomebrewRaces() {
  return Object.values(store.races)
    .map(normalizeHomebrewRace)
    .filter(Boolean)
    .sort((a, b) => String(a.name).localeCompare(String(b.name)))
}

export function getHomebrewRace(raceId) {
  const row = store.races[raceId]
  return row ? normalizeHomebrewRace(row) : null
}

function parsePassiveTraits(raw) {
  if (Array.isArray(raw)) {
    return raw.map(row => String(row || '').trim()).filter(Boolean).slice(0, 12)
  }
  return String(raw || '')
    .split(/\r?\n/)
    .map(row => row.trim())
    .filter(Boolean)
    .slice(0, 12)
}

export function emptyHomebrewRaceDraft(overrides = {}) {
  return {
    id: '',
    name: '',
    description: '',
    icon: '✦',
    passiveTraitsText: '',
    statModifiers: {},
    specialEffects: [],
    ...overrides
  }
}

export function normalizeHomebrewRace(raw) {
  if (!raw || typeof raw !== 'object') return null
  const name = String(raw.name || '').trim().slice(0, 80)
  if (!name) return null
  const id = raw.id && store.races[raw.id] ? raw.id : ensureCustomRaceId(raw.id, name)
  if (getRacesData()[id] && !store.races[id]) return null
  const statModifiers = {}
  for (const key of STAT_KEYS) {
    const value = Number(raw.statModifiers?.[key] ?? raw[key])
    if (Number.isFinite(value) && value !== 0) statModifiers[key] = value
  }
  const passiveTraits = parsePassiveTraits(raw.passiveTraits ?? raw.passiveTraitsText)
  const specialEffects = normalizeSpecialEffectIds(raw.specialEffects)
  return {
    id,
    name,
    icon: String(raw.icon || '✦').trim().slice(0, 8) || '✦',
    description: String(raw.description || raw.desc || '').trim().slice(0, 2000),
    passiveTraits: passiveTraits.length ? passiveTraits : undefined,
    statModifiers: Object.keys(statModifiers).length ? statModifiers : undefined,
    specialEffects: specialEffects.length ? specialEffects : undefined,
    source: 'homebrew',
    created: raw.created || new Date().toISOString(),
    updated: new Date().toISOString()
  }
}

export function upsertHomebrewRace(raw) {
  const race = normalizeHomebrewRace(raw)
  if (!race) throw new Error('Name is required.')
  if (getRacesData()[race.id] && !store.races[race.id]) {
    throw new Error(`ID "${race.id}" conflicts with an official race.`)
  }
  if (getItem(race.id) && !store.items[race.id]) {
    throw new Error(`ID "${race.id}" conflicts with a homebrew item.`)
  }
  if (getSkill(race.id) && !store.skills[race.id]) {
    throw new Error(`ID "${race.id}" conflicts with a homebrew skill.`)
  }
  const existing = store.races[race.id]
  if (existing) race.created = existing.created
  store.races[race.id] = race
  saveDebounced()
  registerHomebrewInCache()
  return race
}

export function deleteHomebrewRace(raceId) {
  if (!store.races[raceId]) return false
  delete store.races[raceId]
  saveDebounced()
  registerHomebrewInCache()
  return true
}

export function duplicateHomebrewRace(raceId) {
  const source = store.races[raceId]
  if (!source) return null
  const copy = normalizeHomebrewRace({
    ...source,
    id: ensureCustomRaceId(`${raceId}_copy`, `${source.name} copy`),
    name: `${source.name} (copy)`
  })
  store.races[copy.id] = copy
  saveDebounced()
  registerHomebrewInCache()
  return copy
}

export function charactersUsingHomebrewRace(raceId) {
  return (state.characters || []).filter(character => character.race === raceId)
}

export function homebrewSkillsForRace(raceId) {
  return listHomebrewSkills().filter(skill => skill.category === 'racial' && skill.subcategory === raceId)
}

export function homebrewRaceOptionsForSkills() {
  const official = Object.keys(getRacesData())
  const homebrew = listHomebrewRaces().map(race => race.id)
  return [...new Set([...official, ...homebrew])].sort((a, b) => {
    const label = id => getHomebrewRace(id)?.name || getRacesData()[id]?.name || id
    return label(a).localeCompare(label(b))
  })
}

export function officialSubcategoriesForCategory(category) {
  const data = getSkillsData()
  if (category === 'racial') {
    const racial = data.racial || {}
    const subs = new Set()
    for (const [key, value] of Object.entries(racial)) {
      if (Array.isArray(value)) subs.add(key)
      else if (value && typeof value === 'object') {
        for (const subKey of Object.keys(value)) subs.add(subKey)
      }
    }
    return [...subs].sort((a, b) => a.localeCompare(b))
  }
  const tree = data[category]
  if (!tree || typeof tree !== 'object') return []
  return Object.keys(tree).sort((a, b) => a.localeCompare(b))
}

export function homebrewSubcategoriesForCategory(category) {
  const subs = new Set()
  for (const skill of listHomebrewSkills()) {
    if (skill.category === category) subs.add(skill.subcategory || 'custom')
  }
  return [...subs]
}

export function homebrewSkillTreeOptions(category) {
  if (category === 'racial') return homebrewRaceOptionsForSkills()
  return [...new Set([
    ...officialSubcategoriesForCategory(category),
    ...homebrewSubcategoriesForCategory(category)
  ])].sort((a, b) => a.localeCompare(b))
}

export function alignHomebrewSkillSubcategory(draft) {
  if (!draft) return draft
  const options = homebrewSkillTreeOptions(draft.category || 'weapons')
  if (!options.length) return draft
  if (!options.includes(draft.subcategory)) draft.subcategory = options[0]
  return draft
}

export function homebrewSkillsForExport(skillIds) {
  return skillIds.map(id => store.skills[id]).filter(Boolean).map(row => ({ ...normalizeHomebrewSkill(row) }))
}

export function collectHomebrewIdsFromCharacter(character) {
  const ids = new Set()
  if (!character) return ids
  for (const entry of character.inventory || []) {
    if (String(entry.itemId || '').startsWith(HOMEBREW_ID_PREFIX)) ids.add(entry.itemId)
  }
  for (const skillId of character.skills || []) {
    if (String(skillId).startsWith(HOMEBREW_ID_PREFIX)) ids.add(skillId)
    const skill = store.skills[skillId] || null
    if (skill?.category === 'racial' && String(skill.subcategory || '').startsWith(HOMEBREW_ID_PREFIX)) {
      ids.add(skill.subcategory)
    }
  }
  if (String(character.race || '').startsWith(HOMEBREW_ID_PREFIX)) ids.add(character.race)
  return ids
}

export function homebrewRacesForExport(raceIds) {
  return raceIds.filter(id => store.races[id]).map(id => ({ ...normalizeHomebrewRace(store.races[id]) }))
}

export function homebrewItemsForExport(itemIds) {
  return itemIds.filter(id => store.items[id]).map(id => ({ ...normalizeHomebrewItem(store.items[id]) }))
}

export function buildHomebrewPack({ name = 'Homebrew pack', author = '', itemIds = null, skillIds = null, raceIds = null } = {}) {
  const items = (itemIds ? itemIds.map(id => store.items[id]).filter(Boolean) : Object.values(store.items))
    .map(row => ({ ...normalizeHomebrewItem(row) }))
  const skills = (skillIds ? skillIds.map(id => store.skills[id]).filter(Boolean) : Object.values(store.skills))
    .map(row => ({ ...normalizeHomebrewSkill(row) }))
  const races = (raceIds ? raceIds.map(id => store.races[id]).filter(Boolean) : Object.values(store.races))
    .map(row => ({ ...normalizeHomebrewRace(row) }))
  return {
    version: 1,
    type: 'lumenforge-homebrew-pack',
    name: String(name).slice(0, 80),
    author: String(author).slice(0, 80),
    exported: new Date().toISOString(),
    items,
    skills,
    races
  }
}

export function mergeHomebrewImport(parsed, { replace = false } = {}) {
  const incomingItems = Array.isArray(parsed?.items) ? parsed.items : []
  const incomingSkills = Array.isArray(parsed?.skills) ? parsed.skills : []
  const incomingRaces = Array.isArray(parsed?.races) ? parsed.races : []
  if (replace) {
    store.items = {}
    store.skills = {}
    store.races = {}
  }
  let mergedItems = 0
  let mergedSkills = 0
  let mergedRaces = 0
  for (const row of incomingItems) {
    const item = normalizeHomebrewItem(row)
    if (!item) continue
    if (getItem(item.id) && !store.items[item.id]) continue
    store.items[item.id] = item
    mergedItems += 1
  }
  for (const row of incomingRaces) {
    const race = normalizeHomebrewRace(row)
    if (!race) continue
    if (getRacesData()[race.id] && !store.races[race.id]) continue
    store.races[race.id] = race
    mergedRaces += 1
  }
  for (const row of incomingSkills) {
    const skill = normalizeHomebrewSkill(row)
    if (!skill) continue
    if (getSkill(skill.id) && !store.skills[skill.id]) continue
    store.skills[skill.id] = skill
    mergedSkills += 1
  }
  saveHomebrewNow()
  registerHomebrewInCache()
  return { items: mergedItems, skills: mergedSkills, races: mergedRaces, total: mergedItems + mergedSkills + mergedRaces }
}

export function isHomebrewPackFile(parsed) {
  return parsed?.type === 'lumenforge-homebrew-pack'
    || (Array.isArray(parsed?.items) && !parsed?.characters && parsed?.type !== 'lumenforge-save')
    || (Array.isArray(parsed?.skills) && !parsed?.characters && parsed?.type !== 'lumenforge-save')
    || (Array.isArray(parsed?.races) && !parsed?.characters && parsed?.type !== 'lumenforge-save')
}

export function registerHomebrewInCache() {
  cache.itemsFlat = cache.itemsFlat.filter(item => item.source !== 'homebrew')
  for (const [id, item] of cache.itemById.entries()) {
    if (item.source === 'homebrew') cache.itemById.delete(id)
  }
  for (const item of listHomebrewItems()) {
    cache.itemById.set(item.id, item)
    cache.itemsFlat.push(item)
    cache.itemSearchText.set(item.id, getItemSearchText(item))
  }
  cache.itemsFlat.sort((a, b) => String(a.name).localeCompare(String(b.name)))

  cache.skillsFlat = cache.skillsFlat.filter(skill => skill.source !== 'homebrew')
  for (const [id, skill] of cache.skillById.entries()) {
    if (skill.source === 'homebrew') cache.skillById.delete(id)
  }
  for (const skill of listHomebrewSkills()) {
    cache.skillById.set(skill.id, skill)
    cache.skillsFlat.push(skill)
  }
  cache.skillsFlat.sort((a, b) => String(a.name).localeCompare(String(b.name)))

  const types = new Set(['all'])
  const rarities = new Set(['all'])
  for (const item of cache.itemsFlat) {
    if (item.type) types.add(String(item.type).toLowerCase())
    if (item.rarity) rarities.add(String(item.rarity).toLowerCase())
  }
  cache.itemTypeOptions = [...types].sort()
  cache.itemRarityOptions = [...rarities].sort((a, b) => {
    if (a === 'all') return -1
    if (b === 'all') return 1
    return rarityRank(a) - rarityRank(b)
  })

  registerHomebrewRacesInCache(listHomebrewRaces())
}

export function serializeHomebrewForSave() {
  return {
    version: store.version,
    items: store.items,
    skills: store.skills,
    races: store.races
  }
}

export function applyHomebrewFromSave(block) {
  if (!block || typeof block !== 'object') return
  store = {
    version: block.version || HOMEBREW_STORE_VERSION,
    items: block.items && typeof block.items === 'object' ? block.items : {},
    skills: block.skills && typeof block.skills === 'object' ? block.skills : {},
    races: block.races && typeof block.races === 'object' ? block.races : {}
  }
  saveHomebrewNow()
  registerHomebrewInCache()
}

export function draftFromHomebrewItem(item) {
  if (!item) return emptyHomebrewDraft()
  return emptyHomebrewDraft({
    id: item.id,
    name: item.name,
    desc: item.desc,
    type: item.type,
    icon: item.icon,
    rarity: item.rarity,
    damage: item.damage || '',
    listInShop: Boolean(item.listInShop),
    shopPriceGil: item.shopPriceGil || 0,
    statModifiers: { ...(item.statModifiers || {}) },
    specialEffects: [...(item.specialEffects || [])],
    counterLabel: item.counterLabel || '',
    counterDefault: item.counterDefault ?? 0,
    counterMax: item.counterMax ?? null,
    blockUnequipWithCounter: Boolean(item.blockUnequipWithCounter),
    blockRemoveWithCounter: Boolean(item.blockRemoveWithCounter),
    counterEquippedOnly: Boolean(item.counterEquippedOnly),
    counterRuleOperator: item.counterRuleOperator || 'above',
    counterRuleValue: item.counterRuleValue ?? 0
  })
}

export function parseHomebrewDraftForm(form) {
  const statModifiers = {}
  for (const key of STAT_KEYS) {
    const value = Number(form.querySelector(`[name="hb-stat-${key}"]`)?.value)
    if (Number.isFinite(value) && value !== 0) statModifiers[key] = value
  }
  const counterLabel = String(form.querySelector('[name="hb-counter-label"]')?.value || '').trim().slice(0, 24)
  const hasCounter = Boolean(counterLabel)
  const counterDefault = hasCounter
    ? Math.max(0, Math.floor(Number(form.querySelector('[name="hb-counter-default"]')?.value ?? 0)))
    : 0
  const counterMaxRaw = hasCounter ? Number(form.querySelector('[name="hb-counter-max"]')?.value) : NaN
  const counterMax = hasCounter && Number.isFinite(counterMaxRaw) && counterMaxRaw > 0
    ? Math.floor(counterMaxRaw)
    : null
  const counterRuleOperator = hasCounter
    ? normalizeCounterRuleOperator(form.querySelector('[name="hb-counter-rule-op"]')?.value)
    : 'above'
  const counterRuleValue = hasCounter
    ? Math.max(0, Math.floor(Number(form.querySelector('[name="hb-counter-rule-value"]')?.value ?? 0)))
    : 0
  return emptyHomebrewDraft({
    id: form.querySelector('[name="hb-id"]')?.value,
    name: form.querySelector('[name="hb-name"]')?.value,
    desc: form.querySelector('[name="hb-desc"]')?.value,
    type: form.querySelector('[name="hb-type"]')?.value,
    icon: form.querySelector('[name="hb-icon"]')?.value,
    rarity: form.querySelector('[name="hb-rarity"]')?.value,
    damage: form.querySelector('[name="hb-damage"]')?.value,
    listInShop: form.querySelector('[name="hb-list-in-shop"]')?.checked,
    shopPriceGil: form.querySelector('[name="hb-price"]')?.value,
    statModifiers,
    counterLabel,
    counterDefault,
    counterMax,
    blockUnequipWithCounter: hasCounter && Boolean(form.querySelector('[name="hb-block-unequip-counter"]')?.checked),
    blockRemoveWithCounter: hasCounter && Boolean(form.querySelector('[name="hb-block-remove-counter"]')?.checked),
    counterEquippedOnly: hasCounter && Boolean(form.querySelector('[name="hb-counter-equipped-only"]')?.checked),
    counterRuleOperator,
    counterRuleValue
  })
}

/** Keep in-progress editor fields when toggling effects/counter panels (re-render reads draft, not DOM). */
export function syncHomebrewDraftFromForm(form = null) {
  const el = form || (typeof document !== 'undefined' ? document.querySelector('#homebrew-form') : null)
  if (!el || !state.homebrewDraft) return state.homebrewDraft
  const parsed = parseHomebrewDraftForm(el)
  state.homebrewDraft = {
    ...parsed,
    specialEffects: [...(state.homebrewDraft.specialEffects || [])],
    id: state.homebrewEditingId || parsed.id || state.homebrewDraft.id || ''
  }
  return state.homebrewDraft
}

export function draftFromHomebrewSkill(skill) {
  if (!skill) return emptyHomebrewSkillDraft()
  return emptyHomebrewSkillDraft({
    id: skill.id,
    name: skill.name,
    desc: skill.desc,
    icon: skill.icon,
    category: skill.category,
    subcategory: skill.subcategory,
    tier: skill.tier,
    cost: skill.cost,
    skillType: skill.skillType || 'passive',
    staminaCost: skill.staminaCost ?? 0,
    damageMode: skill.damageMode || 'none',
    damageDice: skill.damageDice || '',
    damageStat: skill.damageStat || defaultHomebrewDamageStat(skill.damageMode),
    elementalType: skill.elementalType || '',
    statModifiers: { ...(skill.statModifiers || {}) },
    specialEffects: [...(skill.specialEffects || [])],
    activationEffects: [...(skill.activationEffects || [])]
  })
}

function parseUseEffectsFromForm(form, draft) {
  return (draft?.activationEffects || []).map(row => {
    const durationRaw = Number(form.querySelector(`[name="hbs-use-duration-${row.effectId}"]`)?.value)
    const potencyRaw = form.querySelector(`[name="hbs-use-potency-${row.effectId}"]`)?.value
    return {
      effectId: row.effectId,
      duration: Number.isFinite(durationRaw) ? Math.max(0, Math.floor(durationRaw)) : 3,
      potency: potencyRaw === '' || potencyRaw == null || !Number.isFinite(Number(potencyRaw))
        ? undefined
        : Number(potencyRaw)
    }
  }).filter(row => row.effectId)
}

export function parseHomebrewSkillDraftForm(form, draft = null) {
  const statModifiers = {}
  for (const key of STAT_KEYS) {
    const value = Number(form.querySelector(`[name="hbs-stat-${key}"]`)?.value)
    if (Number.isFinite(value) && value !== 0) statModifiers[key] = value
  }
  const tier = Math.min(5, Math.max(1, Math.floor(Number(form.querySelector('[name="hbs-tier"]')?.value ?? 1))))
  const skillType = normalizeHomebrewSkillType({ skillType: form.querySelector('[name="hbs-skill-type"]')?.value })
  const damageMode = normalizeDamageMode(form.querySelector('[name="hbs-damage-mode"]')?.value)
  const damageDice = String(form.querySelector('[name="hbs-damage-dice"]')?.value || '').trim()
  const damageStat = form.querySelector('[name="hbs-damage-stat"]')?.value || ''
  const elementalType = normalizeElementType(form.querySelector('[name="hbs-elemental-type"]')?.value) || ''
  const baseDraft = draft || state.homebrewSkillDraft
  return emptyHomebrewSkillDraft({
    id: form.querySelector('[name="hbs-id"]')?.value,
    name: form.querySelector('[name="hbs-name"]')?.value,
    desc: form.querySelector('[name="hbs-desc"]')?.value,
    icon: form.querySelector('[name="hbs-icon"]')?.value,
    category: form.querySelector('[name="hbs-category"]')?.value,
    subcategory: form.querySelector('[name="hbs-subcategory"]')?.value,
    tier,
    cost: form.querySelector('[name="hbs-cost"]')?.value,
    skillType,
    staminaCost: form.querySelector('[name="hbs-stamina"]')?.value,
    damageMode,
    damageDice,
    damageStat,
    elementalType,
    statModifiers,
    activationEffects: parseUseEffectsFromForm(form, baseDraft)
  })
}

export function syncHomebrewSkillDraftFromForm(form = null) {
  const el = form || (typeof document !== 'undefined' ? document.querySelector('#homebrew-skill-form') : null)
  if (!el || !state.homebrewSkillDraft) return state.homebrewSkillDraft
  const parsed = parseHomebrewSkillDraftForm(el, state.homebrewSkillDraft)
  state.homebrewSkillDraft = {
    ...parsed,
    specialEffects: [...(state.homebrewSkillDraft.specialEffects || [])],
    activationEffects: parsed.activationEffects?.length
      ? parsed.activationEffects
      : [...(state.homebrewSkillDraft.activationEffects || [])],
    id: state.homebrewSkillEditingId || parsed.id || state.homebrewSkillDraft.id || ''
  }
  return state.homebrewSkillDraft
}

export function draftFromHomebrewRace(race) {
  if (!race) return emptyHomebrewRaceDraft()
  return emptyHomebrewRaceDraft({
    id: race.id,
    name: race.name,
    description: race.description || '',
    icon: race.icon,
    passiveTraitsText: (race.passiveTraits || []).join('\n'),
    statModifiers: { ...(race.statModifiers || {}) },
    specialEffects: [...(race.specialEffects || [])]
  })
}

export function parseHomebrewRaceDraftForm(form) {
  const statModifiers = {}
  for (const key of STAT_KEYS) {
    const value = Number(form.querySelector(`[name="hbr-stat-${key}"]`)?.value)
    if (Number.isFinite(value) && value !== 0) statModifiers[key] = value
  }
  const passiveTraitsText = String(form.querySelector('[name="hbr-passives"]')?.value || '')
  return emptyHomebrewRaceDraft({
    id: form.querySelector('[name="hbr-id"]')?.value,
    name: form.querySelector('[name="hbr-name"]')?.value,
    description: form.querySelector('[name="hbr-description"]')?.value,
    icon: form.querySelector('[name="hbr-icon"]')?.value,
    passiveTraitsText,
    statModifiers
  })
}

export function syncHomebrewRaceDraftFromForm(form = null) {
  const el = form || (typeof document !== 'undefined' ? document.querySelector('#homebrew-race-form') : null)
  if (!el || !state.homebrewRaceDraft) return state.homebrewRaceDraft
  const parsed = parseHomebrewRaceDraftForm(el)
  state.homebrewRaceDraft = {
    ...parsed,
    specialEffects: [...(state.homebrewRaceDraft.specialEffects || [])],
    id: state.homebrewRaceEditingId || parsed.id || state.homebrewRaceDraft.id || ''
  }
  return state.homebrewRaceDraft
}
