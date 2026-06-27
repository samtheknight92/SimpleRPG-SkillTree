import { getItem } from './cache.js'
import { getEffect } from './character.js'
import { isEntryEquipped } from './items.js'
import { titleCase, uid } from './utils.js'
import { formatStatModifiers } from './format.js'

const STAT_KEYS = [
  'hp', 'stamina', 'strength', 'magicPower', 'accuracy', 'speed', 'physicalDefence', 'magicalDefence'
]

const LEGACY_STAT = {
  magical_defence: 'magicalDefence',
  physical_defence: 'physicalDefence',
  magic_power: 'magicPower',
  damage: 'damageBonus'
}

export function isEnhancementItem(item) {
  return String(item?.type || '').toLowerCase() === 'enhancement'
}

function normalizeStatKey(key) {
  const raw = String(key || '').trim()
  if (LEGACY_STAT[raw]) return LEGACY_STAT[raw]
  if (raw === 'all') return 'all'
  const camel = raw.replace(/_([a-z])/g, (_, c) => c.toUpperCase())
  return STAT_KEYS.includes(camel) ? camel : camel
}

function expandStatModifiers(stats = {}) {
  const out = {}
  for (const [key, value] of Object.entries(stats)) {
    const norm = normalizeStatKey(key)
    if (norm === 'all') {
      for (const stat of STAT_KEYS) out[stat] = (out[stat] || 0) + Number(value || 0)
    } else if (norm === 'damageBonus') {
      out.damageBonus = (out.damageBonus || 0) + Number(value || 0)
    } else if (STAT_KEYS.includes(norm)) {
      out[norm] = (out[norm] || 0) + Number(value || 0)
    }
  }
  return out
}

function gearKindForSlot(slot, gearItem = null) {
  if (slot === 'weapon' || slot === 'offhand') {
    if (slot === 'offhand' && gearItem) {
      const t = String(gearItem.offhandType || '').toLowerCase()
      if (t === 'shield') return 'armor'
      if (t === 'weapon' || (String(gearItem.type || '').includes('weapon') && !t)) return 'weapon'
      return 'accessory'
    }
    if (slot === 'offhand') return 'weapon'
    return 'weapon'
  }
  if (slot === 'armor') return 'armor'
  if (slot === 'accessory') return 'accessory'
  return ''
}

function targetKindsForEffect(effectType) {
  const t = String(effectType || '').toLowerCase()
  if (t === 'weapon_enchant') return new Set(['weapon'])
  if (t === 'armor_enchant') return new Set(['armor'])
  if (t === 'magical_shield') return new Set(['armor', 'accessory'])
  return new Set(['weapon', 'armor', 'accessory'])
}

/** Build runtime enchant payload from a profession enhancement item definition. */
export function resolveEnchantmentFromItem(item) {
  if (!item?.effect) return null
  const effect = item.effect
  const type = String(effect.type || '').toLowerCase()

  const statModifiers = {}
  let damageBonus = 0
  let elementalDamage = ''
  let shieldMax = null
  let shieldRemaining = null
  let shieldMagicalOnly = false

  if (type === 'weapon_enchant') {
    if (effect.stat === 'damage' || effect.amount != null) {
      damageBonus = Number(effect.amount || 0)
    }
    if (effect.element === 'random') {
      const elements = ['fire', 'ice', 'thunder', 'earth', 'wind', 'water', 'light', 'darkness']
      elementalDamage = elements[Math.floor(Math.random() * elements.length)]
    } else if (effect.element) {
      elementalDamage = String(effect.element).toLowerCase()
    }
  } else if (type === 'armor_enchant') {
    const stat = normalizeStatKey(effect.stat || 'magicalDefence')
    if (stat === 'damageBonus') damageBonus = Number(effect.amount || 0)
    else if (STAT_KEYS.includes(stat)) statModifiers[stat] = Number(effect.amount || 0)
  } else if (type === 'stat_boost' || type === 'permanent_enchant') {
    Object.assign(statModifiers, expandStatModifiers(effect.stats || {}))
  } else if (type === 'magical_shield') {
    shieldMax = Math.max(0, Number(effect.amount || 0))
    shieldRemaining = shieldMax
    shieldMagicalOnly = true
  }

  if (effect.stats) Object.assign(statModifiers, expandStatModifiers(effect.stats))

  const specialEffects = [...(effect.bonus_effects || [])]

  return {
    sourceItemId: item.id,
    name: item.name,
    icon: item.icon || '✨',
    effectType: type,
    statModifiers,
    damageBonus,
    elementalDamage,
    specialEffects,
    shieldMax,
    shieldRemaining,
    shieldMagicalOnly,
    targetKinds: [...targetKindsForEffect(type)]
  }
}

export function maxEnchantmentSlots(entry, item) {
  if (!item) return 0
  const base = Number(item.enchantmentSlots || 0)
  const bonus = Number(entry?.craftBonuses?.enchantmentSlotBonus || entry?.enchantmentSlotBonus || 0)
  let total = base + bonus
  if ((entry?.craftedWithSkills || []).includes('artifact_shaping') && (base + bonus) < 2) {
    total = Math.max(total, 2)
  }
  return Math.max(0, total)
}

export function entryEnchantments(entry) {
  return Array.isArray(entry?.enchantments) ? entry.enchantments : []
}

export function isShieldEnchant(enchant) {
  return enchant?.shieldMax != null && Number(enchant.shieldMax) > 0
}

export function shieldEnchantRemaining(enchant) {
  if (!isShieldEnchant(enchant)) return 0
  return Math.max(0, Number(enchant.shieldRemaining ?? enchant.shieldMax))
}

export function shieldEnchantWasUsed(enchant) {
  if (!isShieldEnchant(enchant)) return false
  return shieldEnchantRemaining(enchant) < Number(enchant.shieldMax)
}

export function enchantDisplayLabel(enchant) {
  if (isShieldEnchant(enchant)) {
    const rem = shieldEnchantRemaining(enchant)
    return `Barrier ${rem}/${enchant.shieldMax} (magical)`
  }
  if (enchant.damageBonus) return `+${enchant.damageBonus} damage`
  const stats = formatStatModifiers(enchant.statModifiers || {})
  if (stats && stats !== 'None') return stats
  return enchant.name || 'Enchant'
}

export function enchantmentTooltip(enchant, gearItemName = '') {
  if (!enchant) return ''
  const lines = [
    enchant.name || 'Enchantment',
    gearItemName ? `On ${gearItemName} while equipped` : 'While this item is equipped'
  ]
  const statPart = formatStatModifiers(enchant.statModifiers || {})
  if (statPart && statPart !== 'None') lines.push(`Stats: ${statPart}`)
  if (enchant.damageBonus) lines.push(`Weapon damage: +${enchant.damageBonus}`)
  if (enchant.elementalDamage) lines.push(`Elemental: ${titleCase(enchant.elementalDamage)} damage on hits`)
  if (isShieldEnchant(enchant)) {
    const rem = shieldEnchantRemaining(enchant)
    lines.push(
      '',
      `Magical damage pool: ${rem}/${enchant.shieldMax} remaining.`,
      'Soaks magical damage before HP — not healing.',
      'Use −1 / −5 on the chip to record damage at the table.',
      rem < enchant.shieldMax
        ? 'If removed after any absorption, the crystal is destroyed (not returned).'
        : 'Unused — × removes and returns the crystal to inventory.'
    )
  }
  if (enchant.specialEffects?.length) {
    lines.push('', ...enchant.specialEffects.map(id => {
      const eff = getEffect(id)
      return eff ? `${eff.icon || '✦'} ${eff.name}: ${eff.desc}` : titleCase(id.replace(/_/g, ' '))
    }))
  }
  lines.push('', 'Active while attached — remove to regain the enhancement item.')
  if (isShieldEnchant(enchant)) {
    lines[lines.length - 1] = 'Active while attached — see pool rules above.'
  }
  if (enchant.desc) lines.push('', enchant.desc)
  return lines.join('\n')
}

export function canApplyEnhancementToGear(enhancementItem, gearItem, gearSlot) {
  if (!isEnhancementItem(enhancementItem) || !gearItem) {
    return { ok: false, reason: 'Not a valid enchantment for gear.' }
  }
  const spec = resolveEnchantmentFromItem(enhancementItem)
  if (!spec) return { ok: false, reason: 'This item has no enchant effect.' }
  const kind = gearKindForSlot(gearSlot, gearItem)
  if (!spec.targetKinds.includes(kind)) {
    return { ok: false, reason: `This enchant fits ${spec.targetKinds.join(' or ')} only.` }
  }
  return { ok: true, spec }
}

export function compatibleEnhancementsInInventory(character, gearEntry, gearSlot) {
  const gearItem = getItem(gearEntry?.itemId)
  if (!character || !gearEntry || !gearItem) return []
  const rows = []
  for (const inv of character.inventory || []) {
    if (inv.uid === gearEntry.uid) continue
    if (isEntryEquipped(character, inv.uid)) continue
    const item = getItem(inv.itemId)
    if (!isEnhancementItem(item)) continue
    const check = canApplyEnhancementToGear(item, gearItem, gearSlot)
    if (!check.ok) continue
    rows.push({ entry: inv, item, spec: check.spec })
  }
  return rows
}

/** Equipped gear that can still take this enhancement (for Inventory apply buttons). */
export function compatibleEquippedGearForEnhancement(character, enhancementItem) {
  if (!character || !isEnhancementItem(enhancementItem)) return []
  const rows = []
  for (const [slot, entryUid] of Object.entries(character.equipped || {})) {
    if (!entryUid) continue
    const entry = character.inventory.find(inv => inv.uid === entryUid)
    const gearItem = entry && getItem(entry.itemId)
    if (!entry || !gearItem) continue
    const check = canApplyEnhancementToGear(enhancementItem, gearItem, slot)
    if (!check.ok) continue
    const max = maxEnchantmentSlots(entry, gearItem)
    if (entryEnchantments(entry).length >= max) continue
    rows.push({ entry, slot, gearItem })
  }
  return rows
}

export function applyEnchantTargetLabel(slot) {
  if (slot === 'weapon') return 'Apply to weapon'
  if (slot === 'offhand') return 'Apply to off-hand'
  if (slot === 'armor') return 'Apply to armour'
  if (slot === 'accessory') return 'Apply to accessory'
  return 'Apply'
}

export function createAppliedEnchantment(enhancementItem) {
  const spec = resolveEnchantmentFromItem(enhancementItem)
  if (!spec) return null
  return {
    id: uid('ench'),
    ...spec,
    desc: enhancementItem.desc || '',
    appliedAt: new Date().toISOString()
  }
}

/** Sum stat modifiers from all enchants on equipped items. */
export function equippedEnchantmentStatTotals(character) {
  const totals = {}
  for (const entryUid of Object.values(character?.equipped || {})) {
    if (!entryUid) continue
    const entry = character?.inventory?.find(inv => inv.uid === entryUid)
    for (const ench of entryEnchantments(entry)) {
      for (const [stat, value] of Object.entries(ench.statModifiers || {})) {
        totals[stat] = (totals[stat] || 0) + Number(value || 0)
      }
    }
  }
  return totals
}

export function enchantmentStatBreakdown(character, stat) {
  const rows = []
  for (const entryUid of Object.values(character?.equipped || {})) {
    if (!entryUid) continue
    const entry = character.inventory.find(inv => inv.uid === entryUid)
    const item = entry && getItem(entry.itemId)
    for (const ench of entryEnchantments(entry)) {
      const value = ench.statModifiers?.[stat]
      if (!value) continue
      rows.push({ label: `${ench.name} (${item?.name || 'gear'})`, value })
    }
  }
  return rows
}

/** Flat damage bonus from weapon/off-hand enchants. */
export function enchantmentDamageBonusForEntry(entry) {
  let total = 0
  for (const ench of entryEnchantments(entry)) {
    total += Number(ench.damageBonus || 0)
  }
  return total
}

export function enchantmentSpecialEffectsForEntry(entry) {
  const ids = []
  for (const ench of entryEnchantments(entry)) {
    for (const id of ench.specialEffects || []) ids.push(id)
  }
  return ids
}

export function enchantmentElementForEntry(entry) {
  for (const ench of entryEnchantments(entry)) {
    if (ench.elementalDamage) return ench.elementalDamage
  }
  return ''
}
