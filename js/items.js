import { uid, titleCase } from './utils.js'
import { ITEMS_PER_PAGE, SHOP_MIN_LEVEL_BY_RARITY } from './constants.js'
import { cache, getItem, itemSources, getItemSearchText, rarityRank } from './cache.js'
import { activeCharacter, state } from './state.js'
import { normalizeGil, itemPriceGil, damageAverage } from './format.js'
import { characterLevelInfo } from './level.js'
import { isGmMode } from './gm-mode.js'

const STACKABLE_TYPES = new Set([
  'material', 'ingredient', 'consumable', 'organic', 'essence', 'crystal', 'food', 'herb', 'reagent', 'potion'
])

const NON_STACKABLE_TYPES = new Set([
  'weapon', 'armor', 'accessory', 'offhand', 'craftable_weapon', 'craftable_armor', 'enhancement'
])

export function isStackableItem(item) {
  if (!item) return false
  if (itemHasCounter(item)) return false
  if (item.stackable === true) return true
  if (item.stackable === false) return false
  const type = String(item.type || '').toLowerCase()
  if ([...NON_STACKABLE_TYPES].some(part => type.includes(part))) return false
  if ([...STACKABLE_TYPES].some(part => type.includes(part))) return true
  return false
}

export function itemCounterLabel(item) {
  const label = String(item?.counterLabel || '').trim()
  return label || null
}

export function itemHasCounter(item) {
  return Boolean(itemCounterLabel(item))
}

export function defaultInventoryCounter(item) {
  if (!itemHasCounter(item)) return 0
  const value = Number(item.counterDefault)
  return Number.isFinite(value) ? Math.max(0, Math.floor(value)) : 0
}

export function inventoryCounterValue(entry, item) {
  if (!itemHasCounter(item)) return 0
  const value = Number(entry?.counter)
  return Number.isFinite(value) ? Math.max(0, Math.floor(value)) : defaultInventoryCounter(item)
}

const COUNTER_RULE_OPS = new Set(['above', 'below', 'eq'])

export function normalizeCounterRuleOperator(raw) {
  const op = String(raw || 'above').toLowerCase()
  return COUNTER_RULE_OPS.has(op) ? op : 'above'
}

export function counterRuleThreshold(item) {
  const value = Number(item?.counterRuleValue)
  return Number.isFinite(value) ? Math.max(0, Math.floor(value)) : 0
}

export function counterRuleMatches(entry, item) {
  if (!itemHasCounter(item)) return false
  const value = inventoryCounterValue(entry, item)
  const threshold = counterRuleThreshold(item)
  const op = normalizeCounterRuleOperator(item?.counterRuleOperator)
  if (op === 'below') return value < threshold
  if (op === 'eq') return value === threshold
  return value > threshold
}

export function counterRulePhrase(item) {
  const threshold = counterRuleThreshold(item)
  const op = normalizeCounterRuleOperator(item?.counterRuleOperator)
  if (op === 'below') return `is below ${threshold}`
  if (op === 'eq') return `is ${threshold}`
  return `is above ${threshold}`
}

export function itemBlocksUnequipWithCounter(entry, item) {
  if (!item?.blockUnequipWithCounter || !itemHasCounter(item)) return false
  return counterRuleMatches(entry, item)
}

export function itemBlocksRemoveWithCounter(entry, item) {
  if (!item?.blockRemoveWithCounter || !itemHasCounter(item)) return false
  return counterRuleMatches(entry, item)
}

export function counterMaxValue(item) {
  if (!itemHasCounter(item)) return null
  const max = Number(item.counterMax)
  return Number.isFinite(max) && max > 0 ? Math.floor(max) : null
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

export const ITEM_CATALOG_CATEGORIES = [
  { id: 'all', label: 'All categories', searchTerms: [] },
  { id: 'weapon', label: 'Weapons', searchTerms: ['weapon', 'sword', 'bow', 'staff'] },
  { id: 'armor', label: 'Armour', searchTerms: ['armor', 'armour', 'robe', 'mail'] },
  { id: 'accessory', label: 'Accessories', searchTerms: ['accessory', 'ring', 'amulet', 'cloak'] },
  { id: 'offhand', label: 'Off-hand', searchTerms: ['offhand', 'off-hand', 'shield', 'tome', 'instrument'] },
  { id: 'food', label: 'Food & drink', searchTerms: ['food', 'drink', 'snack', 'meal', 'bread', 'apple', 'cheese', 'wine'] },
  { id: 'potion', label: 'Potions & scrolls', searchTerms: ['potion', 'elixir', 'scroll', 'tonic', 'draught'] },
  { id: 'supply', label: 'Adventuring supplies', searchTerms: ['rope', 'torch', 'lockpick', 'tool'] },
  { id: 'material', label: 'Materials', searchTerms: ['material', 'ore', 'herb', 'ingredient', 'essence'] },
  { id: 'enhancement', label: 'Enhancements', searchTerms: ['enhancement', 'enchant'] },
  { id: 'other', label: 'Other', searchTerms: [] }
]

const ITEM_CATALOG_CATEGORY_BY_ID = Object.fromEntries(ITEM_CATALOG_CATEGORIES.map(row => [row.id, row]))

const POTION_ITEM_RE = /potion|elixir|scroll|phoenix_feather|dragon_heart|immortality|holy_water|berserker|resistance|feather/i
const SUPPLY_ITEM_RE = /lockpick|rope|torch/i

export function resolveItemCatalogCategory(item) {
  const type = String(item?.type || '').toLowerCase()
  const hay = `${item?.id || ''} ${item?.name || ''}`.toLowerCase()
  if (type.includes('weapon') || type === 'craftable_weapon') return 'weapon'
  if (type.includes('armor') || type === 'craftable_armor') return 'armor'
  if (type.includes('accessory')) return 'accessory'
  if (type.includes('offhand')) return 'offhand'
  if (type === 'food') return 'food'
  if (type.includes('enhancement')) return 'enhancement'
  if (type === 'consumable') {
    if (POTION_ITEM_RE.test(hay)) return 'potion'
    if (SUPPLY_ITEM_RE.test(hay)) return 'supply'
    return 'food'
  }
  if (['material', 'ingredient', 'essence', 'organic', 'crystal', 'herb', 'reagent'].some(part => type.includes(part))) {
    return 'material'
  }
  return 'other'
}

function itemCatalogSearchText(item) {
  const category = resolveItemCatalogCategory(item)
  const meta = ITEM_CATALOG_CATEGORY_BY_ID[category]
  return [
    getItemSearchText(item),
    category,
    meta?.label || '',
    ...(meta?.searchTerms || [])
  ].join(' ').toLowerCase()
}

function matchesCatalogFilters(item, character, skip = {}) {
  if (!skip.search) {
    const terms = String(state.itemSearch || '').toLowerCase().split(/\s+/).map(term => term.trim()).filter(Boolean)
    const search = itemCatalogSearchText(item)
    if (terms.length && !terms.every(term => search.includes(term))) return false
  }
  if (!skip.source && state.itemSource !== 'all') {
    if (state.itemSource === 'shop') {
      const inShop = item.source === 'shop'
        || (item.source === 'homebrew' && item.listInShop && itemPriceGil(item) > 0)
      if (!inShop) return false
    } else if (state.itemSource === 'homebrew') {
      if (item.source !== 'homebrew') return false
    } else if (item.source !== state.itemSource) return false
  }
  if (!skip.rarity && state.itemRarity !== 'all' && String(item.rarity || 'common').toLowerCase() !== state.itemRarity) {
    return false
  }
  if (!skip.category && state.itemCategory !== 'all' && resolveItemCatalogCategory(item) !== state.itemCategory) {
    return false
  }
  if (!skip.buyable && state.itemBuyableOnly && !isCatalogItemBuyable(character, item)) return false
  return true
}

export function catalogCategoryCounts(character = activeCharacter()) {
  const counts = { all: 0 }
  for (const item of itemSources()) {
    if (!matchesCatalogFilters(item, character, { category: true })) continue
    counts.all += 1
    const category = resolveItemCatalogCategory(item)
    counts[category] = (counts[category] || 0) + 1
  }
  return counts
}

export function catalogSourceCounts(character = activeCharacter()) {
  const counts = { all: 0 }
  for (const item of itemSources()) {
    if (!matchesCatalogFilters(item, character, { source: true })) continue
    counts.all += 1
    const source = item.source || 'shop'
    if (source === 'homebrew') {
      counts.homebrew = (counts.homebrew || 0) + 1
      if (item.listInShop && itemPriceGil(item) > 0) counts.shop = (counts.shop || 0) + 1
    } else if (source === 'shop') {
      counts.shop = (counts.shop || 0) + 1
    } else {
      counts[source] = (counts[source] || 0) + 1
    }
  }
  return counts
}

export function activeCatalogFilterLabels() {
  const labels = []
  if (state.itemSearch) labels.push(`“${state.itemSearch}”`)
  if (state.itemSource !== 'shop') labels.push(titleCase(state.itemSource))
  if (state.itemCategory !== 'all') labels.push(ITEM_CATALOG_CATEGORY_BY_ID[state.itemCategory]?.label || state.itemCategory)
  if (state.itemRarity !== 'all') labels.push(titleCase(state.itemRarity))
  if (state.itemBuyableOnly && !isGmMode()) labels.push('Buyable only')
  return labels
}

export function shopMinLevelForItem(item) {
  if (!item) return 1
  if (Number.isFinite(Number(item.shopMinLevel))) return Number(item.shopMinLevel)
  return SHOP_MIN_LEVEL_BY_RARITY[String(item.rarity || 'common').toLowerCase()] ?? 1
}

export function isShopPurchaseItem(item) {
  if (item?.source === 'shop' && itemPriceGil(item) > 0) return true
  return item?.source === 'homebrew' && item.listInShop && itemPriceGil(item) > 0
}

export function isShopItemLevelUnlocked(character, item) {
  if (!isShopPurchaseItem(item)) return true
  if (isGmMode()) return true
  if (!character) return false
  return characterLevelInfo(character).level >= shopMinLevelForItem(item)
}

/** Shop tab filter — item can be purchased from the shop right now (level + Gil). */
export function isCatalogItemBuyable(character, item) {
  if (isGmMode()) return true
  if (!isShopPurchaseItem(item)) return false
  return shopPurchaseCheck(character, item).ok
}

export function shopPurchaseCheck(character, item, { free = false } = {}) {
  if (!item) return { ok: false, reason: 'Unknown item.' }
  if (free || isGmMode()) return { ok: true }
  if (!isShopPurchaseItem(item)) {
    const reason = item?.source === 'profession'
      ? 'Craft on the Craft tab.'
      : item?.source === 'homebrew'
        ? 'Grant from the Homebrew tab.'
        : 'Not sold in the shop.'
    return { ok: false, reason }
  }
  if (!character) return { ok: false, reason: 'No character loaded.' }
  const need = shopMinLevelForItem(item)
  const level = characterLevelInfo(character).level
  if (level < need) return { ok: false, reason: `Requires Level ${need}` }
  const price = itemPriceGil(item)
  if (price > normalizeGil(character.gil)) return { ok: false, reason: 'Not enough Gil.' }
  return { ok: true }
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
  return sortItems(
    itemSources().filter(item => matchesCatalogFilters(item, character)),
    state.itemSort
  )
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
  if (itemHasCounter(item)) entry.counter = defaultInventoryCounter(item)
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
