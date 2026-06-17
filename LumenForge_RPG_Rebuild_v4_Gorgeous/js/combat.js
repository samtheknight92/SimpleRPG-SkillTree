import { getItem } from './cache.js'
import { getEquippedWeapon, getEquippedOffhand, getWeaponKind } from './equipment.js'
import { getSkillWeaponKinds, ANY_WEAPON_KIND } from './action-bar-bonuses.js'
import { getSkillActivationType } from './skill-activation.js'

export const BASIC_ATTACK_ID = '__basic_attack__'

/** Ranged skills that intentionally work after movement. */
const MOVE_EXEMPT_SKILL_IDS = new Set(['quick_draw'])

export function getBasicAttackSkill(character) {
  const weapon = getEquippedWeapon(character)
  const offhand = getEquippedOffhand(character)
  const parts = []
  if (weapon?.damage) parts.push(`${weapon.name}: ${weapon.damage}`)
  else if (weapon) parts.push(`${weapon.name} (1 damage)`)
  else parts.push('Unarmed: 1 damage')
  if (offhand?.damage) parts.push(`+ ${offhand.name}: ${offhand.damage}`)
  return {
    id: BASIC_ATTACK_ID,
    name: 'Basic Attack',
    icon: '⚔️',
    tier: 1,
    staminaCost: 0,
    category: 'combat',
    subcategory: 'attack',
    desc: `Action: Strike with your weapon. Roll d20 + accuracy vs target Physical Defence; on hit: ${parts.join('; ')}.`,
    isBasicAttack: true
  }
}

export function isBasicAttackSkill(skill) {
  return skill?.id === BASIC_ATTACK_ID || skill?.isBasicAttack
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
  const cost = Math.max(0, Number(skill.staminaCost || 0))
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

function parseDamageFormula(formula) {
  const text = String(formula || '').trim()
  const match = text.match(/^(\d+)d(\d+)(?:\s*\+\s*(\d+))?$/i)
  if (!match) return null
  return {
    count: Number(match[1]),
    sides: Number(match[2]),
    modifier: Number(match[3] || 0)
  }
}

export function rollWeaponDamage(formula, rollDiceFn) {
  const parsed = parseDamageFormula(formula)
  if (!parsed) return { total: 1, detail: '1' }
  const rolls = rollDiceFn(parsed.count, parsed.sides, parsed.modifier)
  return {
    total: rolls.total,
    detail: rolls.rolls?.length
      ? `${rolls.rolls.join('+')}${parsed.modifier ? `+${parsed.modifier}` : ''} = ${rolls.total}`
      : String(rolls.total)
  }
}

export function resolveBasicAttackDamage(character, rollDiceFn) {
  const segments = []
  let total = 0
  const main = getEquippedWeapon(character)
  const off = getEquippedOffhand(character)

  if (main) {
    const result = main.damage
      ? rollWeaponDamage(main.damage, rollDiceFn)
      : { total: 1, detail: '1' }
    total += result.total
    segments.push(`${main.name}: ${result.detail}`)
  } else {
    total += 1
    segments.push('Unarmed: 1')
  }

  if (off) {
    const result = off.damage
      ? rollWeaponDamage(off.damage, rollDiceFn)
      : { total: 1, detail: '1' }
    total += result.total
    segments.push(`${off.name}: ${result.detail}`)
  }

  return { total, summary: segments.join('; ') }
}
