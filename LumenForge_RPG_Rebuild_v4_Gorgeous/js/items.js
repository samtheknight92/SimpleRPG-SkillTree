import { uid } from './utils.js'
import { ITEMS_PER_PAGE } from './constants.js'
import { cache, getItem, itemSources, getItemSearchText, rarityRank } from './cache.js'
import { activeCharacter, state } from './state.js'
import { normalizeGil, itemPriceGil, damageAverage } from './format.js'

const STACKABLE_TYPES = new Set([
  'material', 'ingredient', 'consumable', 'organic', 'essence', 'crystal', 'food', 'herb', 'reagent', 'potion'
])

const NON_STACKABLE_TYPES = new Set([
  'weapon', 'armor', 'accessory', 'craftable_weapon', 'craftable_armor', 'enhancement'
])

export function isStackableItem(item) {
  if (!item) return false
  if (item.stackable === true) return true
  if (item.stackable === false) return false
  const type = String(item.type || '').toLowerCase()
  if ([...NON_STACKABLE_TYPES].some(part => type.includes(part))) return false
  if ([...STACKABLE_TYPES].some(part => type.includes(part))) return true
  return false
}

export function inventoryEntryStackKey(entry) {
  if (!entry?.itemId) return ''
  if (entry.craftedBy || entry.boundTo || (entry.enchantments?.length > 0)) {
    return [
      entry.itemId,
      entry.craftedBy || '',
      JSON.stringify(entry.craftBonuses || {}),
      (entry.craftedWithSkills || []).slice().sort().join(',')
    ].join('|')
  }
  return entry.itemId
}

export function isEntryEquipped(character, entryUid) {
  return Object.values(character?.equipped || {}).includes(entryUid)
}

export function findStackableEntry(character, itemId, meta = {}) {
  const item = getItem(itemId)
  if (!character || !item || !isStackableItem(item)) return null
  const key = inventoryEntryStackKey({ itemId, ...meta })
  return character.inventory.find(entry =>
    !isEntryEquipped(character, entry.uid) && inventoryEntryStackKey(entry) === key
  ) || null
}

/** Merge duplicate stackable rows (e.g. after load or repeated grants). Keeps equipped rows separate. */
export function mergeInventoryStacks(character) {
  if (!character?.inventory?.length) return
  const equippedUids = new Set(Object.values(character.equipped || {}).filter(Boolean))
  const kept = []
  const buckets = new Map()

  for (const entry of character.inventory) {
    if (equippedUids.has(entry.uid)) {
      kept.push(entry)
      continue
    }
    const item = getItem(entry.itemId)
    if (!item || !isStackableItem(item)) {
      kept.push(entry)
      continue
    }
    const key = inventoryEntryStackKey(entry)
    const qty = Math.max(1, Number(entry.qty || 1))
    if (!buckets.has(key)) {
      buckets.set(key, { ...entry, qty })
    } else {
      buckets.get(key).qty += qty
    }
  }
  character.inventory = [...kept, ...buckets.values()]
}

export function countInventoryItem(character, itemId, { includeEquipped = false } = {}) {
  return (character?.inventory || []).reduce((sum, entry) => {
    if (entry.itemId !== itemId) return sum
    if (!includeEquipped && isEntryEquipped(character, entry.uid)) return sum
    return sum + Math.max(1, Number(entry.qty || 1))
  }, 0)
}

export function removeInventoryItems(character, itemId, amount, { includeEquipped = false } = {}) {
  if (!character || amount <= 0) return 0
  let remaining = amount
  for (const entry of character.inventory) {
    if (remaining <= 0) break
    if (entry.itemId !== itemId) continue
    if (!includeEquipped && isEntryEquipped(character, entry.uid)) continue
    const take = Math.min(remaining, Math.max(1, Number(entry.qty || 1)))
    entry.qty = Math.max(0, Number(entry.qty || 1) - take)
    remaining -= take
    if (entry.qty <= 0) entry._remove = true
  }
  character.inventory = character.inventory.filter(entry => !entry._remove)
  return amount - remaining
}

export function itemMatchesFeature(item, feature, character = activeCharacter()) {
  const type = String(item.type || '').toLowerCase()
  const stats = item.statModifiers || {}
  const effects = item.specialEffects || []
  const price = itemPriceGil(item)
  if (feature === 'all') return true
  if (feature === 'equippable') return ['weapon', 'armor', 'accessory'].some(value => type.includes(value))
  if (feature === 'weapon') return type.includes('weapon')
  if (feature === 'armor') return type.includes('armor')
  if (feature === 'accessory') return type.includes('accessory')
  if (feature === 'damage') return Boolean(item.damage)
  if (feature === 'consumable') return ['consumable', 'food', 'potion', 'herb'].some(value => type.includes(value))
  if (feature === 'crafting') return ['material', 'ingredient', 'essence', 'organ', 'organic', 'crystal'].some(value => type.includes(value)) || Boolean(item.craftingRecipe)
  if (feature === 'quest') return ['quest', 'key', 'artifact', 'relic'].some(value => type.includes(value))
  if (feature === 'strength') return Number(stats.strength || 0) > 0
  if (feature === 'magicPower') return Number(stats.magicPower || 0) > 0
  if (feature === 'accuracy') return Number(stats.accuracy || 0) > 0
  if (feature === 'speed') return Number(stats.speed || 0) > 0
  if (feature === 'defence') return Number(stats.physicalDefence || 0) > 0 || Number(stats.magicalDefence || 0) > 0
  if (feature === 'special') return effects.length > 0
  if (feature === 'enchantable') return Number(item.enchantmentSlots || 0) > 0
  if (feature === 'free') return price === 0
  if (feature === 'affordable') return character ? price <= normalizeGil(character.gil) : true
  return true
}

export function sortItems(items, sortKey) {
  const sorted = [...items]
  const byName = (a, b) => String(a.name).localeCompare(String(b.name))
  sorted.sort((a, b) => {
    if (sortKey === 'priceAsc') return itemPriceGil(a) - itemPriceGil(b) || byName(a, b)
    if (sortKey === 'priceDesc') return itemPriceGil(b) - itemPriceGil(a) || byName(a, b)
    if (sortKey === 'rarityDesc') return rarityRank(b.rarity) - rarityRank(a.rarity) || byName(a, b)
    if (sortKey === 'damageDesc') return damageAverage(b) - damageAverage(a) || byName(a, b)
    if (sortKey === 'strengthDesc') return Number(b.statModifiers?.strength || 0) - Number(a.statModifiers?.strength || 0) || byName(a, b)
    if (sortKey === 'magicDesc') return Number(b.statModifiers?.magicPower || 0) - Number(a.statModifiers?.magicPower || 0) || byName(a, b)
    if (sortKey === 'defenceDesc') return (Number(b.statModifiers?.physicalDefence || 0) + Number(b.statModifiers?.magicalDefence || 0)) - (Number(a.statModifiers?.physicalDefence || 0) + Number(a.statModifiers?.magicalDefence || 0)) || byName(a, b)
    if (sortKey === 'sourceType') return String(a.source).localeCompare(String(b.source)) || String(a.type).localeCompare(String(b.type)) || byName(a, b)
    return byName(a, b)
  })
  return sorted
}

export function filterCatalogItems(character = activeCharacter()) {
  const allItems = itemSources()
  return sortItems(allItems.filter(item => {
    const search = getItemSearchText(item)
    const typeOk = state.itemType === 'all' || String(item.type || '').toLowerCase() === state.itemType || String(item.type || '').toLowerCase().includes(state.itemType)
    const sourceOk = state.itemSource === 'all' || item.source === state.itemSource
    const rarityOk = state.itemRarity === 'all' || String(item.rarity || 'common').toLowerCase() === state.itemRarity
    const featureOk = itemMatchesFeature(item, state.itemFeature, character)
    const terms = String(state.itemSearch || '').toLowerCase().split(/\s+/).map(term => term.trim()).filter(Boolean)
    const searchOk = !terms.length || terms.every(term => search.includes(term))
    return typeOk && sourceOk && rarityOk && featureOk && searchOk
  }), state.itemSort)
}

export function paginateItems(items) {
  const totalPages = Math.max(1, Math.ceil(items.length / ITEMS_PER_PAGE))
  const page = Math.min(state.itemPage, totalPages - 1)
  state.itemPage = Math.max(0, page)
  const start = state.itemPage * ITEMS_PER_PAGE
  return {
    items: items.slice(start, start + ITEMS_PER_PAGE),
    total: items.length,
    page: state.itemPage,
    totalPages
  }
}

export function addItemToInventory(character, itemId, qty = 1) {
  const item = getItem(itemId)
  if (!character || !item || qty <= 0) return
  const existing = findStackableEntry(character, itemId)
  if (existing) {
    existing.qty = Math.max(1, Number(existing.qty || 1)) + qty
    return existing
  }
  const entry = { uid: uid('item'), itemId, qty }
  character.inventory.push(entry)
  return entry
}

export function addCraftedItemToInventory(character, recipe, craftMeta = {}) {
  const item = getItem(recipe?.id)
  if (!character || !item) return null
  const meta = {
    craftedBy: craftMeta.craftedBy || null,
    craftedByName: craftMeta.craftedByName || null,
    craftedWithSkills: craftMeta.craftedWithSkills || [],
    craftBonuses: craftMeta.craftBonuses,
    enchantments: [],
    boundTo: null
  }
  if (isStackableItem(item)) {
    const existing = findStackableEntry(character, recipe.id, meta)
    if (existing) {
      existing.qty = Math.max(1, Number(existing.qty || 1)) + 1
      return existing
    }
  }
  const entry = { uid: uid('item'), itemId: recipe.id, qty: 1, ...meta }
  character.inventory.push(entry)
  return entry
}

export { getItem, itemSources, cache }
