import { computeStats } from './character.js'
import { getActionBarSkills, getSkillActivationType } from './skill-activation.js'
import { getSkillDisabledReason } from './combat.js'
import { BASIC_ATTACK_ID, getBasicAttackSkill } from './combat.js'

export const MULTIATTACK_SKILL_ID = 'multiattack'

export function characterHasMultiattack(character) {
  return Boolean(character?.skills?.includes(MULTIATTACK_SKILL_ID))
}

function shuffle(array) {
  const copy = [...array]
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

function buildAttackPool(character) {
  const bar = [
    getBasicAttackSkill(character),
    ...getActionBarSkills(character).filter(skill => skill.id !== BASIC_ATTACK_ID)
  ]
  return bar.filter(skill => getSkillActivationType(skill) === 'activatable')
}

function pickDistinctSkills(pool, count) {
  const picked = []
  const seen = new Set()
  for (const skill of shuffle(pool)) {
    if (seen.has(skill.id)) continue
    picked.push(skill)
    seen.add(skill.id)
    if (picked.length >= count) break
  }
  return picked
}

function pickTurnAttacks(character) {
  const activatable = buildAttackPool(character)
  const usable = activatable.filter(skill => !getSkillDisabledReason(character, skill))
  const pool = usable.length ? usable : activatable
  const count = characterHasMultiattack(character) ? 2 : 1
  return pickDistinctSkills(pool, count)
}

export function buildNpcTurnSuggestion(character) {
  if (!character) return null
  const stats = computeStats(character)
  const hasMultiattack = characterHasMultiattack(character)
  const skills = pickTurnAttacks(character)

  const suggestions = skills.map(skill => {
    const cost = Number(skill.staminaCost || 0)
    const blocked = getSkillDisabledReason(character, skill)
    return {
      id: skill.id,
      name: skill.name,
      cost,
      desc: skill.desc || '',
      blocked: blocked || null
    }
  })

  const movementHint = character.movedThisTurn
    ? 'Moved this turn — ranged blocked unless Quick Draw.'
    : ''

  return {
    characterId: character.id,
    characterName: character.name,
    hp: `${character.hp}/${stats.hp}`,
    stamina: `${character.stamina}/${stats.stamina}`,
    hasMultiattack,
    suggestions,
    movementHint,
    generatedAt: new Date().toISOString()
  }
}

export function buildNpcTurnSuggestions(characters = []) {
  return characters.map(buildNpcTurnSuggestion).filter(Boolean)
}
