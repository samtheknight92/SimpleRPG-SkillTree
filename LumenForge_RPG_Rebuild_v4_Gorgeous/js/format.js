import { titleCase } from './utils.js'
import { CURRENCY_RATE } from './constants.js'

export function sentenceList(values) {
  return (values || [])
    .filter(Boolean)
    .map(value => titleCase(String(value)))
    .join(', ')
}

export function formatStatModifiers(modifiers = {}) {
  const entries = Object.entries(modifiers || {})
  if (!entries.length) return 'None'
  return entries.map(([stat, value]) => `${titleCase(stat)} ${Number(value) >= 0 ? '+' : ''}${value}`).join(', ')
}

export function formatCraftingRecipe(recipe) {
  if (!recipe) return ''
  const materials = (recipe.materials || []).map(material => {
    if (Array.isArray(material)) return `${material[1] || 1}× ${titleCase(material[0])}`
    if (typeof material === 'object') return `${material.qty || material.quantity || 1}× ${titleCase(material.item || material.id || material.name || 'material')}`
    return titleCase(material)
  }).join(', ')
  const skill = recipe.skillRequired ? ` · Skill required: ${recipe.skillRequired}` : ''
  const quantity = recipe.quantity ? ` · Makes: ${recipe.quantity}` : ''
  return [materials ? `Recipe: ${materials}` : 'Recipe available', skill, quantity].join('')
}

export function formatElementalAffinities(affinities) {
  if (!affinities) return ''
  const lines = []
  for (const [group, values] of Object.entries(affinities)) {
    if (!values || typeof values !== 'object') continue
    const parts = Object.entries(values).map(([element, value]) => `${titleCase(element)} ${Number(value) >= 0 ? '+' : ''}${value}`)
    if (parts.length) lines.push(`${titleCase(group)}: ${parts.join(', ')}`)
  }
  return lines.join('\n')
}

function legacyPriceToGil(price = {}) {
  return (Number(price.gold || 0) * CURRENCY_RATE.gold)
    + (Number(price.silver || 0) * CURRENCY_RATE.silver)
    + Number(price.copper || 0)
}

/** Normalize saves that used gil, legacy {gold,silver,copper}, or raw numbers. */
export function normalizeGil(value, fallback = 0) {
  if (Number.isFinite(Number(value))) return Math.max(0, Math.floor(Number(value)))
  if (value && typeof value === 'object') {
    if (Number.isFinite(Number(value.gil))) return Math.max(0, Math.floor(Number(value.gil)))
    return legacyPriceToGil(value)
  }
  return Math.max(0, Math.floor(Number(fallback || 0)))
}

export function formatCurrency(gil) {
  const amount = normalizeGil(gil)
  return `${amount.toLocaleString()} Gil`
}

export function itemPriceGil(item) {
  return legacyPriceToGil(item?.price || item?.value || {})
}

/** @deprecated Use normalizeGil — kept for import compatibility during migration. */
export function currencyToCopper(currency) {
  return normalizeGil(currency)
}

/** @deprecated Use normalizeGil directly. */
export function copperToCurrency(total) {
  return { gil: normalizeGil(total) }
}

/** @deprecated Use itemPriceGil. */
export function itemPriceCopper(item) {
  return itemPriceGil(item)
}

export function fallbackIcon(item) {
  const icon = String(item?.icon || '')
  if (icon && !/[ÃÂâð]/.test(icon)) return icon
  const type = String(item?.type || '').toLowerCase()
  if (type.includes('weapon')) return '⚔️'
  if (type.includes('armor')) return '🛡️'
  if (type.includes('accessory')) return '💍'
  if (type.includes('consumable') || type.includes('potion')) return '🧪'
  if (type.includes('material') || type.includes('ingredient')) return '🌿'
  if (type.includes('quest')) return '📜'
  return '✦'
}

export function damageAverage(item) {
  const match = String(item?.damage || '').match(/(\d+)d(\d+)(?:\s*([+-])\s*(\d+))?/i)
  if (!match) return 0
  const count = Number(match[1] || 0)
  const sides = Number(match[2] || 0)
  const mod = match[3] ? Number(`${match[3]}${match[4]}`) : 0
  return count * ((sides + 1) / 2) + mod
}
