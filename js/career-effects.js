import { cache, getSkill, getItem } from './cache.js'
import { characterWieldsWeaponKind } from './equipment.js'

function getEffectDefinition(effectId) {
  return cache.effectDefinitions?.[effectId] || null
}

function inventoryEntry(character, entryUid) {
  if (!entryUid || !character?.inventory) return null
  return character.inventory.find(inv => inv.uid === entryUid) || null
}

/** light | medium | heavy | none */
function getArmourWeightClass(character) {
  const entry = inventoryEntry(character, character?.equipped?.armor)
  const armour = entry ? getItem(entry.itemId) : null
  if (!armour) return 'none'
  const text = `${armour.id} ${armour.name} ${armour.desc || ''}`.toLowerCase()
  if (/\b(plate|full plate|heavy|adamantine|mithril plate|tower shield)\b/.test(text)) return 'heavy'
  if (/\b(chain|scale|brigandine|medium|splint|banded)\b/.test(text)) return 'medium'
  return 'light'
}

export function isBelowHalfHp(character) {
  if (!character) return false
  const maxHp = character?._cache?.stats?.hp
    ?? Math.max(1, Math.floor(Number(character?.stats?.hp ?? 10)))
  return Number(character.hp || 0) <= maxHp / 2
}

function hasStatusEffect(character, effectId) {
  return (character?.statusEffects || []).some(status => status.effectId === effectId)
}

function evaluateDamageCondition(character, condition, options = {}) {
  switch (condition) {
    case 'selfBelowHalfHp':
      return isBelowHalfHp(character)
    case 'notMovedThisTurn':
      return !character?.movedThisTurn
    case 'targetBelowHalfHp':
      return options.targetBelowHalfHp === true
    case 'targetNotActed':
      return options.targetNotActed === true
    case 'partyWeakness':
      return character?.combatFlags?.partyWeakness === true
    case 'hasStatus':
      return options.statusEffectId ? hasStatusEffect(character, options.statusEffectId) : false
    default:
      return true
  }
}

export function conditionalSkillStatLabel(condition) {
  switch (condition) {
    case 'selfBelowHalfHp':
      return 'below half HP'
    case 'notMovedThisTurn':
      return "didn't move this turn"
    default:
      return condition || 'conditional'
  }
}

export function evaluateSkillStatCondition(character, rule) {
  if (!character || !rule) return false
  if (rule.weaponKind && !characterWieldsWeaponKind(character, rule.weaponKind)) return false
  return evaluateDamageCondition(character, rule.condition)
}

export function armourSkillStatModifiers(character) {
  const totals = {}
  if (!character?.skills?.length) return totals

  const weight = getArmourWeightClass(character)
  for (const skillId of character.skills) {
    const rule = cache.armourSkillEffects?.[skillId]
    if (!rule?.armourWeights?.includes(weight)) continue
    for (const [stat, value] of Object.entries(rule.statModifiers || {})) {
      totals[stat] = (totals[stat] || 0) + Number(value || 0)
    }
  }
  return totals
}

export function conditionalSkillStatModifiers(character) {
  const totals = {}
  if (!character?.skills?.length) return totals

  for (const skillId of character.skills) {
    const rule = cache.conditionalSkillStats?.[skillId]
    if (!rule) continue
    if (!evaluateSkillStatCondition(character, rule)) continue
    for (const [stat, value] of Object.entries(rule)) {
      if (stat === 'condition' || stat === 'weaponKind') continue
      totals[stat] = (totals[stat] || 0) + Number(value || 0)
    }
  }
  return totals
}

export function collectCareerFlatDamageBonuses(character, skill, context = {}) {
  const bonuses = []
  if (!character || !skill) return bonuses

  const isMelee = context.isMelee === true
  const isRanged = context.isRanged === true

  for (const status of character.statusEffects || []) {
    const effect = getEffectDefinition(status.effectId)
    if (!effect?.flatDamageBonus) continue
    bonuses.push({
      value: Number(effect.flatDamageBonus),
      source: effect.name,
      sourceId: effect.id,
      conditional: false
    })
  }

  for (const skillId of character.skills || []) {
    const rule = cache.careerDamageBonuses?.[skillId]
    if (!rule) continue
    if (rule.melee && !isMelee) continue
    if (rule.ranged && !isRanged) continue

    const active = evaluateDamageCondition(character, rule.condition, {
      ...context,
      statusEffectId: rule.condition === 'hasStatus' ? skillId : undefined
    })
    const passive = getSkill(skillId)
    bonuses.push({
      value: Number(rule.flat || 0),
      source: passive?.name || skillId,
      sourceId: skillId,
      conditional: !active,
      note: rule.condition === 'selfBelowHalfHp'
        ? 'while below half HP'
        : rule.condition === 'targetBelowHalfHp'
          ? 'vs bloodied targets'
          : rule.condition === 'targetNotActed'
            ? 'vs targets who have not acted'
            : undefined
    })
  }

  return bonuses
}

export function getCareerStaminaDiscount(character, skill) {
  if (!character || !skill) return 0
  let discount = 0
  const isRanged = /\branged\b/i.test(String(skill.subcategory || ''))
    || /bow|crossbow|arrow|bolt/i.test(String(skill.desc || ''))

  for (const skillId of character.skills || []) {
    const rule = cache.careerStaminaDiscounts?.[skillId]
    if (!rule) continue
    if (rule.rangedOnly && !isRanged) continue
    discount += Number(rule.amount || 0)
  }
  return discount
}

export function getEffectiveSkillStaminaCost(character, skill) {
  return Math.max(0, Number(skill?.staminaCost || 0) - getCareerStaminaDiscount(character, skill))
}

export function resolveCareerActionBuffs(skill) {
  if (!skill) return []
  const mapped = cache.careerActionBuffs?.[skill.id]
  if (!mapped) return []
  return [{
    effectId: mapped.effectId,
    duration: mapped.duration,
    potency: mapped.potency,
    chance: 1,
    source: 'career'
  }]
}

export function resolveArmourSkillEffects(skill, character) {
  const rule = cache.armourSkillEffects?.[skill.id]
  if (!rule || !character) return []
  const weight = getArmourWeightClass(character)
  if (!rule.armourWeights?.includes(weight)) return []
  return rule.effectId ? [rule.effectId] : []
}
