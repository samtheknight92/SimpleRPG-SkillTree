import { getRace } from './cache.js'
import { characterWieldsWeaponKind } from './equipment.js'

/** Race passives the app does not automate — GM or table applies them. */
export const TABLE_RULE_RACE_PASSIVES = [
  { id: 'halfling_lucky', pattern: /^Lucky:/i, note: 'Reroll natural 1s with real dice at the table.' },
  { id: 'orc_relentless', pattern: /^Relentless Endurance:/i, note: 'GM adjudicates dropping to 1 HP once per day.' },
  { id: 'human_ambitious', pattern: /^Ambitious Spirit:/i, note: 'Extra Lumens from defeats are awarded by the GM, not the app.' },
  { id: 'drow_sunlight', pattern: /^Sunlight Sensitivity:/i, note: 'Apply −1 Accuracy when the GM says the scene is bright sun.' },
  { id: 'gnoll_pack_tactics', pattern: /^Pack Tactics:/i, note: 'Apply +1 Accuracy when an ally is adjacent to the same target.' }
]

export function tableRuleRacePassiveInfo(trait) {
  const text = String(trait || '')
  return TABLE_RULE_RACE_PASSIVES.find(rule => rule.pattern.test(text)) || null
}

export function isTableRuleRacePassive(trait) {
  return Boolean(tableRuleRacePassiveInfo(trait))
}

export function racePassiveTooltip(trait) {
  const rule = tableRuleRacePassiveInfo(trait)
  if (!rule) return trait
  return `${trait}\n\nTable rule — not automated in the app.\n${rule.note}`
}

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
