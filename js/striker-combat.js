import { characterHandsEmpty, getEquippedWeapon } from './equipment.js'

/** Highest matching passive sets unarmed Basic Attack dice (both hands empty). */
export const STRIKER_BASIC_DAMAGE_BY_SKILL = [
  { id: 'striker_mastery', formula: '2d10' },
  { id: 'empty_hand_mastery', formula: '2d10' },
  { id: 'crushing_fist', formula: '1d12' },
  { id: 'iron_palm', formula: '1d10' },
  { id: 'stone_fists', formula: '1d6' },
  { id: 'striker_basics', formula: '1d4' },
  { id: 'empty_hand_basics', formula: '1d4' }
]

/** Action skills that repeat Basic Attack N times (each full roll). */
export const STRIKER_MULTI_BASIC_SKILLS = {
  feint_strike: 1,
  joint_lock: 1,
  flurry_of_blows: 2,
  striker_volley: 3
}

/** Basic Attack count on Iron Reversal — scales with combo skills learned. */
export function strikerComboBasicCount(character) {
  const learned = new Set(character?.skills || [])
  if (learned.has('striker_volley')) return 3
  if (learned.has('flurry_of_blows')) return 2
  return 1
}

export function characterHasStrikerBasics(character) {
  const skills = character?.skills || []
  return skills.includes('striker_basics') || skills.includes('empty_hand_basics')
}

export function strikerBasicDamageFormula(character) {
  if (!character || getEquippedWeapon(character)) return null
  if (!characterHandsEmpty(character)) return null
  if (!characterHasStrikerBasics(character)) return null
  const learned = new Set(character.skills || [])
  for (const row of STRIKER_BASIC_DAMAGE_BY_SKILL) {
    if (learned.has(row.id)) return row.formula
  }
  return null
}

export function strikerMultiBasicAttackCount(skillId) {
  return STRIKER_MULTI_BASIC_SKILLS[skillId] || 0
}

export function parseMultiBasicAttackCount(skill, character = null) {
  if (skill?.id === 'iron_reversal' && character) {
    return strikerComboBasicCount(character)
  }
  const fixed = strikerMultiBasicAttackCount(skill?.id)
  if (fixed) return fixed
  const desc = String(skill?.desc || '')
  const makeMatch = desc.match(/Make\s+(\d+)\s+Basic\s+Attack/i)
  if (makeMatch) return Number(makeMatch[1])
  if (/\bOne Basic Attack\b/i.test(desc)) return 1
  return 0
}

export function isStrikerMultiBasicSkill(skill) {
  if (skill?.id === 'iron_reversal') return true
  return parseMultiBasicAttackCount(skill) > 0
}
