/** Skills that repeat a weapon-damage attack N times (e.g. Multi Shot, Rapid Fire). */
export function parseMultiWeaponAttackCount(skill) {
  const desc = String(skill?.desc || '')
  const makeMatch = desc.match(/Make\s+(\d+)\s+ranged\s+weapon\s+attacks?/i)
  if (makeMatch) return Number(makeMatch[1])
  return 0
}

export function isMultiWeaponAttackSkill(skill) {
  return parseMultiWeaponAttackCount(skill) > 0
}
