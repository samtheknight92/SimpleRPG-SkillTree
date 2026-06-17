import { DISPLAY_CATEGORIES } from './constants.js'
import { getGameData, getRacesData, getSkillsData } from './data.js'
import { titleCase } from './utils.js'
import { formatStatModifiers } from './format.js'

export const cache = {
  skillById: new Map(),
  skillsFlat: [],
  itemById: new Map(),
  itemsFlat: [],
  itemSearchText: new Map(),
  itemTypeOptions: ['all'],
  itemRarityOptions: ['all'],
  toggleBonuses: {},
  passiveBonuses: {},
  passiveSkillEffects: {},
  equipmentSkillEffects: {},
  toggleSkillEffects: {},
  incompatibilities: {},
  effectDefinitions: {}
}

function sanitizeItem(item) {
  const icon = String(item?.icon || '')
  if (icon && !/[ÃÂâð�\uFFFD]/.test(icon)) return item
  return { ...item, icon: '' }
}

function registerSkillTree(category, categoryData, parentSubcategory = null) {
  for (const [subcategory, list] of Object.entries(categoryData || {})) {
    if (Array.isArray(list)) {
      for (const skill of list) {
        if (!skill?.id || cache.skillById.has(skill.id)) continue
        const enriched = {
          ...skill,
          category,
          subcategory,
          raceGroup: parentSubcategory || (category === 'racial' ? subcategory : null),
          isToggle: detectToggle(skill)
        }
        cache.skillById.set(skill.id, enriched)
        cache.skillsFlat.push(enriched)
      }
      continue
    }
    if (list && typeof list === 'object') {
      registerSkillTree(category, list, subcategory)
    }
  }
}

export function initCache() {
  const data = getGameData()
  cache.effectDefinitions = data.effects || {}
  cache.toggleBonuses = data['skill-meta']?.TOGGLE_BONUSES || {}
  cache.passiveBonuses = data['skill-meta']?.PASSIVE_SKILL_BONUSES || {}
  cache.passiveSkillEffects = data['skill-meta']?.PASSIVE_SKILL_EFFECTS || {}
  cache.equipmentSkillEffects = data['skill-meta']?.EQUIPMENT_SKILL_EFFECTS || {}
  cache.toggleSkillEffects = data['skill-meta']?.TOGGLE_SKILL_EFFECTS || {}
  cache.incompatibilities = data['skill-meta']?.INCOMPATIBILITIES || {}

  cache.skillsFlat = []
  cache.skillById.clear()
  for (const [category, categoryData] of Object.entries(getSkillsData())) {
    registerSkillTree(category, categoryData)
  }

  cache.itemsFlat = buildItemCatalog(data).map(sanitizeItem)
  cache.itemById.clear()
  cache.itemSearchText.clear()
  for (const item of cache.itemsFlat) {
    cache.itemById.set(item.id, item)
    cache.itemSearchText.set(item.id, buildItemSearchText(item))
  }

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
}

function detectToggle(skill) {
  const toggles = cache.toggleBonuses || {}
  return /\bToggle\s*:/i.test(skill?.desc || '') || Object.prototype.hasOwnProperty.call(toggles, skill?.id)
}

function buildItemCatalog(data) {
  const items = []
  const addObjectValues = (source, sourceLabel) => {
    for (const categoryValue of Object.values(source || {})) {
      if (Array.isArray(categoryValue)) {
        categoryValue.forEach(item => item?.id && items.push({ ...item, source: sourceLabel }))
      } else if (categoryValue && typeof categoryValue === 'object') {
        Object.values(categoryValue).forEach(item => item?.id && items.push({ ...item, source: sourceLabel }))
      }
    }
  }
  addObjectValues(data.items, 'shop')
  addObjectValues(data['profession-items'], 'profession')
  addObjectValues(data['discoverable-items'], 'discoverable')
  for (const item of Object.values(data['monster-loot'] || {})) {
    if (item?.id) items.push({ ...item, source: 'loot' })
  }
  const seen = new Map()
  for (const item of items) {
    if (!seen.has(item.id)) seen.set(item.id, item)
  }
  return [...seen.values()].sort((a, b) => String(a.name).localeCompare(String(b.name)))
}

function buildItemSearchText(item) {
  return [
    item.name,
    item.id,
    item.desc,
    item.type,
    item.rarity,
    item.source,
    item.damage,
    Object.keys(item.statModifiers || {}).join(' '),
    formatStatModifiers(item.statModifiers),
    (item.specialEffects || []).join(' ')
  ].filter(Boolean).join(' ').toLowerCase()
}

export function rarityRank(rarity) {
  return { common: 1, uncommon: 2, rare: 3, epic: 4, legendary: 5 }[String(rarity || '').toLowerCase()] || 0
}

export function getRace(raceId) {
  return getRacesData()[raceId] || null
}

export function raceOptions() {
  return Object.values(getRacesData()).sort((a, b) => a.name.localeCompare(b.name))
}

export function getSkill(skillId) {
  return cache.skillById.get(skillId) || null
}

export function flattenSkills() {
  return cache.skillsFlat
}

export function getItem(itemId) {
  return cache.itemById.get(itemId) || null
}

export function itemSources() {
  return cache.itemsFlat
}

export function getItemSearchText(item) {
  return cache.itemSearchText.get(item.id) || buildItemSearchText(item)
}

export function skillCategories() {
  return Object.keys(getSkillsData())
}

export function displayCategory(category) {
  return DISPLAY_CATEGORIES[category] || titleCase(category)
}
