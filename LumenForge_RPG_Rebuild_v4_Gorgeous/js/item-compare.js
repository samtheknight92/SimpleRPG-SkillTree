import { getItem } from './cache.js'
import { titleCase } from './utils.js'
import { formatStatModifiers } from './format.js'

export function equipSlotForItem(item) {
  const type = String(item?.type || '').toLowerCase()
  if (type.includes('weapon')) return 'weapon'
  if (type.includes('armor')) return 'armor'
  if (type.includes('accessory')) return 'accessory'
  return null
}

function getEquippedItemInSlot(character, slot) {
  if (!character || !slot) return null
  const entryUid = character.equipped?.[slot]
  if (!entryUid) return null
  const entry = character.inventory.find(inv => inv.uid === entryUid)
  return entry ? getItem(entry.itemId) : null
}

function avgDiceDamage(formula) {
  const match = String(formula || '').trim().match(/^(\d+)d(\d+)(?:\s*\+\s*(\d+))?$/i)
  if (!match) return null
  const count = Number(match[1])
  const sides = Number(match[2])
  const modifier = Number(match[3] || 0)
  return (count * (sides + 1)) / 2 + modifier
}

function formatDiff(value) {
  if (value > 0) return `+${value}`
  if (value < 0) return String(value)
  return '±0'
}

function slotLabel(slot) {
  if (slot === 'offhand') return 'Off-hand'
  return titleCase(slot)
}

export function itemCompareLines(candidate, character) {
  if (!candidate || !character) return []
  const slot = equipSlotForItem(candidate)
  if (!slot) return []

  const equipped = getEquippedItemInSlot(character, slot)
  const lines = ['', '— Compare to equipped —']

  if (!equipped) {
    lines.push(`${slotLabel(slot)}: (empty)`)
    if (candidate.damage) lines.push(`Would add damage: ${candidate.damage}`)
    const stats = formatStatModifiers(candidate.statModifiers)
    if (stats !== 'None') lines.push(`Would add stats: ${stats}`)
    return lines
  }

  lines.push(`${slotLabel(slot)}: ${equipped.name}`)

  if (candidate.damage || equipped.damage) {
    const candAvg = avgDiceDamage(candidate.damage)
    const eqAvg = avgDiceDamage(equipped.damage)
    if (candidate.damage && equipped.damage && candAvg != null && eqAvg != null) {
      const diff = Math.round((candAvg - eqAvg) * 10) / 10
      lines.push(`Damage: ${candidate.damage} vs ${equipped.damage} (${formatDiff(diff)} avg)`)
    } else if (candidate.damage) {
      lines.push(`Damage: ${candidate.damage} (equipped has none)`)
    } else if (equipped.damage) {
      lines.push(`Damage: none (equipped ${equipped.damage})`)
    }
  }

  const statKeys = new Set([
    ...Object.keys(candidate.statModifiers || {}),
    ...Object.keys(equipped.statModifiers || {})
  ])
  const statDiffs = []
  for (const stat of statKeys) {
    const delta = Number(candidate.statModifiers?.[stat] || 0) - Number(equipped.statModifiers?.[stat] || 0)
    if (delta !== 0) statDiffs.push(`${titleCase(stat)} ${formatDiff(delta)}`)
  }
  lines.push(statDiffs.length ? `Stat change: ${statDiffs.join(', ')}` : 'Stats: no change')

  const candFx = new Set(candidate.specialEffects || [])
  const eqFx = new Set(equipped.specialEffects || [])
  const added = [...candFx].filter(effect => !eqFx.has(effect))
  const removed = [...eqFx].filter(effect => !candFx.has(effect))
  if (added.length) lines.push(`Gain: ${added.map(titleCase).join(', ')}`)
  if (removed.length) lines.push(`Lose: ${removed.map(titleCase).join(', ')}`)

  const candSlots = Number(candidate.enchantmentSlots || 0)
  const eqSlots = Number(equipped.enchantmentSlots || 0)
  if (candSlots !== eqSlots) {
    lines.push(`Enchant slots: ${candSlots} vs ${eqSlots}`)
  }

  return lines
}
