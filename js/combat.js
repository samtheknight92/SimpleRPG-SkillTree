import { getEquippedWeapon, getEquippedOffhand, getWeaponKind, characterHandsEmpty } from './equipment.js'
import { getSkillWeaponKinds } from './action-bar-bonuses.js'
import { ANY_WEAPON_KIND } from './constants.js'
import { getSkillActivationType } from './skill-activation.js'
import {
  BASIC_ATTACK_ID,
  applyBasicAttackDamage,
  formatDamageModifierSummary,
  isBasicAttackSkill,
  rollWeaponDamage,
  rollUnarmedBasicSegment,
  rollGearAttackEffectDamage,
  appendGearAttackEffectSummary,
  strikerUnarmedDamageFormula
} from './damage-breakdown.js'
import { strikerBasicDamageFormula } from './striker-combat.js'
import { invalidateCharacterCache } from './character.js'
import { getEffectiveSkillStaminaCost } from './career-effects.js'

export { BASIC_ATTACK_ID, isBasicAttackSkill, rollWeaponDamage }

/** Ranged skills that intentionally work after movement. */
const MOVE_EXEMPT_SKILL_IDS = new Set(['quick_draw'])
export function getBasicAttackSkill(character) {
  const weapon = getEquippedWeapon(character)
  const offhand = getEquippedOffhand(character)
  const parts = []
  if (weapon?.damage) parts.push(`${weapon.name}: ${weapon.damage}`)
  else if (weapon) parts.push(`${weapon.name} (1 damage)`)
  else if (strikerBasicDamageFormula(character)) parts.push(`Striker: ${strikerBasicDamageFormula(character)}`)
  else parts.push('Unarmed: 1 damage')
  if (offhand?.damage) parts.push(`+ ${offhand.name}: ${offhand.damage}`)
  const onHit = parts.length ? `${parts.join('; ')} + Strength` : '1 + Strength'
  return {
    id: BASIC_ATTACK_ID,
    name: 'Basic Attack',
    icon: '⚔️',
    tier: 1,
    staminaCost: 0,
    category: 'combat',
    subcategory: 'attack',
    desc: `Action: Strike with your weapon. Roll d20 + accuracy vs target Physical Defence; on hit: ${onHit}.`,
    isBasicAttack: true
  }
}

export function skillRequiredWeaponKinds(skill) {
  if (!skill || isBasicAttackSkill(skill)) return []
  const kinds = getSkillWeaponKinds(skill)
  return kinds.size ? [...kinds] : []
}

export function skillMeetsWeaponRequirement(character, skill) {
  const kinds = skillRequiredWeaponKinds(skill)
  if (!kinds.length) return true
  return kinds.some(kind => {
    if (kind === ANY_WEAPON_KIND) return !!getEquippedWeapon(character)
    if (kind === 'striker' || kind === 'unarmed') return characterHandsEmpty(character)
    if (kind === 'dagger') {
      return getWeaponKind(getEquippedWeapon(character)) === 'dagger'
        || getWeaponKind(getEquippedOffhand(character)) === 'dagger'
    }
    return getWeaponKind(getEquippedWeapon(character)) === kind
  })
}

export function skillWeaponRequirementLabel(skill) {
  const kinds = skillRequiredWeaponKinds(skill)
  if (!kinds.length) return ''
  return kinds.map(k => {
    if (k === ANY_WEAPON_KIND) return 'weapon'
    if (k === 'striker' || k === 'unarmed') return 'empty hands'
    if (k === 'ranged') return 'ranged weapon'
    return `${k} weapon`
  }).join(' or ')
}

export function characterHasQuickDraw(character) {
  return character?.skills?.includes('quick_draw')
}

function isBowFusionSkill(skill) {
  return String(skill?.fusionType || '').toLowerCase().startsWith('bow_')
}

function fusionDescImpliesRangedAttack(skill) {
  const desc = String(skill?.desc || '')
  return /\b(arrows?|volley|projectiles?|bow shot|shot from (?:a |your )?bow|burning arrows?|frost arrows?|enchanted arrows?)\b/i.test(desc)
}

/** True for activatable ranged attacks blocked after movement (not support toggles). */
export function isRangedAttackSkill(skill) {
  if (!skill || isBasicAttackSkill(skill)) return false
  if (MOVE_EXEMPT_SKILL_IDS.has(skill.id)) return false

  const type = getSkillActivationType(skill)
  if (type === 'passive' || type === 'toggle') return false

  const sub = String(skill?.subcategory || '').toLowerCase()
  if (sub === 'ranged_magic') return true
  if (isBowFusionSkill(skill)) return true
  if (sub === 'ranged') return true
  if (skillRequiredWeaponKinds(skill).includes('ranged')) return true
  if (skill.category === 'fusion' && fusionDescImpliesRangedAttack(skill)) return true
  return false
}

export function isRangedBasicAttack(character) {
  return getWeaponKind(getEquippedWeapon(character)) === 'ranged'
    || getWeaponKind(getEquippedOffhand(character)) === 'ranged'
}

export function skillBlockedByMoveRule(character, skill) {
  if (!character) return false
  if (!character.movedThisTurn) return false
  if (characterHasQuickDraw(character)) return false
  if (isBasicAttackSkill(skill)) return isRangedBasicAttack(character)
  return isRangedAttackSkill(skill)
}

export function getSkillUseBlockReason(character, skill) {
  if (!skill) return 'Unknown skill'
  if (!skillMeetsWeaponRequirement(character, skill)) {
    const label = skillWeaponRequirementLabel(skill)
    return `Requires ${label} equipped`
  }
  if (skillBlockedByMoveRule(character, skill)) {
    return 'Moved this turn — ranged attacks unavailable (learn Quick Draw to fire after moving)'
  }
  return ''
}

export function getActionBarBlockReason(character, skill, activationType = 'activatable') {
  const blockReason = getSkillUseBlockReason(character, skill)
  if (blockReason) return blockReason
  if (!character || !skill || activationType !== 'activatable') return ''
  const cost = getEffectiveSkillStaminaCost(character, skill)
  if (cost > 0 && character.stamina < cost) {
    return `Not enough stamina (${character.stamina}/${cost})`
  }
  return ''
}

export function getSkillDisabledReason(character, skill) {
  const type = getSkillActivationType(skill)
  return getActionBarBlockReason(character, skill, type === 'toggle' ? 'toggle' : 'activatable')
}

export function canUseSkillFromBar(character, skill) {
  if (!character || !skill) return false
  if (getSkillDisabledReason(character, skill)) return false
  return true
}

export function resolveBasicAttackDamage(character, rollDiceFn) {
  invalidateCharacterCache(character)

  const segments = []
  let baseTotal = 0
  const main = getEquippedWeapon(character)
  const off = getEquippedOffhand(character)
  const skill = getBasicAttackSkill(character)

  if (main) {
    const result = main.damage
      ? rollWeaponDamage(main.damage, rollDiceFn)
      : { total: 1, detail: '1' }
    baseTotal += result.total
    segments.push(`${main.name}: ${result.detail}`)
  } else {
    const unarmed = rollUnarmedBasicSegment(character, rollDiceFn)
    baseTotal += unarmed.total
    segments.push(`${unarmed.label}: ${unarmed.detail}`)
  }

  if (off) {
    const result = off.damage
      ? rollWeaponDamage(off.damage, rollDiceFn)
      : { total: 1, detail: '1' }
    baseTotal += result.total
    segments.push(`${off.name}: ${result.detail}`)
  }

  const gearEffects = rollGearAttackEffectDamage(character, skill, rollDiceFn)
  baseTotal += gearEffects.primaryTotal
  segments.push(...gearEffects.segments)

  const finalized = applyBasicAttackDamage(character, skill, baseTotal)
  const summary = appendGearAttackEffectSummary(
    formatDamageModifierSummary(segments.join('; '), finalized),
    gearEffects.splash
  )
  return { total: finalized.total, summary, baseTotal, finalized, splash: gearEffects.splash }
}
