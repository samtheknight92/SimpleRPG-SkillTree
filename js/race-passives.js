import { getRace } from './cache.js'
import { characterWieldsWeaponKind } from './equipment.js'

/** Stat bonuses from race passives that require a specific weapon type equipped. */
export function raceEquipmentStatModifiers(character) {
  const totals = {}
  const rules = getRace(character?.race)?.equipmentStatModifiers || []
  for (const rule of rules) {
    if (!characterWieldsWeaponKind(character, rule.weaponKind)) continue
    for (const [stat, value] of Object.entries(rule.statModifiers || {})) {
      totals[stat] = (totals[stat] || 0) + Number(value || 0)
    }
  }
  return totals
}

export function raceEquipmentStatBreakdown(character, stat) {
  const rows = []
  const rules = getRace(character?.race)?.equipmentStatModifiers || []
  for (const rule of rules) {
    const value = rule.statModifiers?.[stat]
    if (!value || !characterWieldsWeaponKind(character, rule.weaponKind)) continue
    const label = rule.label || rule.id || getRace(character.race)?.name || 'Race'
    const kind = rule.weaponKind ? ` (${rule.weaponKind})` : ''
    rows.push({ label: `${label}${kind}`, value })
  }
  return rows
}
