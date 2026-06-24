import { computeStats } from './character.js'
import { resolveBasicAttackDamage } from './combat.js'
import { isValidDamageExpression, rollDamageExpression, resolveOfficialSkillUseDamage } from './damage-breakdown.js'
import { STAT_RULES } from './constants.js'
import { titleCase } from './utils.js'

export function isValidDamageDice(value) {
  return isValidDamageExpression(value)
}

export function homebrewDamageStatLabel(statKey) {
  if (!statKey) return ''
  return STAT_RULES[statKey]?.label || titleCase(statKey)
}

export function resolveHomebrewSkillDamageStat(skill) {
  if (!skill || skill.source !== 'homebrew') return undefined
  const stat = String(skill.damageStat || '').trim()
  if (stat === 'none') return undefined
  if (stat) return stat
  const mode = String(skill.damageMode || 'none')
  if (mode === 'none') return undefined
  return mode.includes('elemental') ? 'magicPower' : 'strength'
}

export function homebrewSkillHasDamageRoll(skill) {
  if (!skill || skill.source !== 'homebrew') return false
  const mode = String(skill.damageMode || 'none')
  if (mode === 'none') return false
  if (mode.startsWith('basic_plus')) return true
  return isValidDamageExpression(String(skill.damageDice || '').trim())
}

export function resolveHomebrewSkillUseDamage(character, skill, rollDiceFn) {
  if (!homebrewSkillHasDamageRoll(skill)) return null

  const mode = String(skill.damageMode || 'none')
  const parts = []
  let total = 0

  if (mode.startsWith('basic_plus')) {
    const basic = resolveBasicAttackDamage(character, rollDiceFn)
    total += basic.total
    parts.push(basic.summary)
  }

  const dice = String(skill.damageDice || '').trim()
  const rolled = dice ? rollDamageExpression(dice, rollDiceFn) : null
  if (rolled) {
    const statKey = resolveHomebrewSkillDamageStat(skill)
    const stats = computeStats(character)
    const statVal = statKey ? Number(stats[statKey] || 0) : 0
    total += rolled.total + statVal
    const usesElement = mode.includes('elemental')
    const ele = usesElement && skill.elementalType
      ? `${titleCase(skill.elementalType)} `
      : ''
    const statLabel = statKey && statVal
      ? ` + ${homebrewDamageStatLabel(statKey)} ${statVal}`
      : ''
    parts.push(`${ele}${dice}: ${rolled.detail}${statLabel}`)
  }

  if (!parts.length) return null
  return { total, summary: parts.join('; ') }
}

export function resolveSkillUseDamage(character, skill, rollDiceFn) {
  if (!character || !skill || !rollDiceFn) return null
  if (skill.source === 'homebrew') return resolveHomebrewSkillUseDamage(character, skill, rollDiceFn)
  return resolveOfficialSkillUseDamage(character, skill, rollDiceFn)
}
