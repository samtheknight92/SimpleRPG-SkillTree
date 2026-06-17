import { cache } from './cache.js'
import { characterWieldsWeaponKind } from './equipment.js'
import { getEffect, normalizeEffectId } from './character.js'
import { isToggleSkill } from './skills.js'

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function phraseMatchesEffect(haystack, phrase) {
  if (!phrase || phrase.length < 3) return false
  const re = new RegExp(`(?:^|[^a-z0-9_])${escapeRegExp(phrase)}(?:[^a-z0-9_]|$)`)
  return re.test(haystack)
}

function findEffectByPhrase(phrase) {
  const normalized = String(phrase || '').trim().toLowerCase()
  if (!normalized) return null
  return Object.values(cache.effectDefinitions).find(effect =>
    effect.name.toLowerCase() === normalized || effect.id.replace(/_/g, ' ') === normalized
  ) || null
}

function isEffectMentionedAsResistance(text, effect) {
  const hay = String(text || '').toLowerCase()
  const phrases = [
    effect.name.toLowerCase(),
    effect.id.toLowerCase().replace(/_/g, ' ')
  ].filter(phrase => phrase.length >= 4)

  for (const phrase of phrases) {
    const re = escapeRegExp(phrase)
    if (new RegExp(`(?:resistance|resistant)\\s+to\\s+[^.;]{0,80}\\b${re}\\b`, 'i').test(hay)) return true
    if (new RegExp(`(?:immune|immunity)\\s+to\\s+(?:magical\\s+|all\\s+|fear\\s+|status\\s+)?\\b${re}\\b`, 'i').test(hay)) return true
    if (new RegExp(`\\b${re}\\s+immunity\\b`, 'i').test(hay)) return true
    if (/charm|mind|fear|possess/.test(phrase) && /cannot be (?:charmed|frightened|possessed)/i.test(hay)) return true
  }
  return false
}

function isEffectNegatedInText(text, effect) {
  const hay = String(text || '').toLowerCase()
  const phrases = [
    effect.name.toLowerCase(),
    effect.id.toLowerCase().replace(/_/g, ' ')
  ].filter(phrase => phrase.length >= 4)

  for (const phrase of phrases) {
    const re = escapeRegExp(phrase)
    if (new RegExp(`(?:remove|removes|cleanses?|cures?)\\s+(?:the\\s+|all\\s+)?${re}\\b`, 'i').test(hay)) return true
    if (new RegExp(`(?:remove|removes)\\s+[^.;]{0,30}\\b${re}\\b`, 'i').test(hay)) return true
  }
  return false
}

function isLooseFlavorMention(haystack, effect) {
  if (effect.id === 'stealth' && /\+\d+\s+stealth\s+in|stealth\s+in\s+(?:dim|dark)/i.test(haystack)) return true
  return false
}

function extractFromDesc(desc, { excludeResistance = true } = {}) {
  const haystack = String(desc || '').toLowerCase()
  const found = []
  const sorted = Object.values(cache.effectDefinitions).sort((a, b) => b.name.length - a.name.length)
  for (const effect of sorted) {
    const idPhrase = effect.id.toLowerCase().replace(/_/g, ' ')
    const name = effect.name.toLowerCase()
    if (excludeResistance && isEffectMentionedAsResistance(haystack, effect)) continue
    if (isEffectNegatedInText(haystack, effect)) continue
    if (isLooseFlavorMention(haystack, effect)) continue
    if (phraseMatchesEffect(haystack, idPhrase) || phraseMatchesEffect(haystack, name)) {
      found.push(effect.id)
    }
  }
  return found
}

const DAMAGE_TYPE_EFFECTS = new Set([
  'fire_damage', 'ice_damage', 'lightning_damage', 'earth_damage', 'wind_damage',
  'water_damage', 'darkness_damage', 'light_damage', 'holy_damage', 'undead_damage',
  'poison_damage', 'magic_damage', 'physical_damage'
])

function parseApplyEffects(desc) {
  const text = String(desc || '')
  const found = []
  const patterns = [
    /Apply\s+([A-Za-z][A-Za-z\s]+?)(?:\s*\(|\.|,|$)/gi,
    /apply\s+both\s+([A-Za-z][A-Za-z\s]+?)\s+and\s+([A-Za-z][A-Za-z\s]+?)(?:\s*\(|\.|,|$)/gi
  ]
  for (const pattern of patterns) {
    for (const match of text.matchAll(pattern)) {
      for (let i = 1; i < match.length; i++) {
        if (!match[i]) continue
        const effect = findEffectByPhrase(match[i].trim())
        if (effect) found.push(effect.id)
      }
    }
  }
  return [...new Set(found)]
}

function parseGrantEffects(desc) {
  const grant = String(desc || '').match(/GRANTS?:\s*([^.]+)/i)
  if (!grant) return []
  const found = []
  const parts = grant[1].split(/,\s*(?=(?:Fire|Ice|Lightning|Earth|Wind|Water|Darkness|Light)\s)/i)
  for (const part of parts) {
    const cleaned = part.replace(/\s*\d+%?\s*\([+-]?\d+\)/gi, '').trim()
    const resistance = cleaned.match(/^(\w+)\s+resistance/i)
    const weakness = cleaned.match(/^(\w+)\s+weakness/i)
    if (resistance) {
      const id = `${resistance[1].toLowerCase()}_resistance`
      if (cache.effectDefinitions[id]) found.push(id)
      continue
    }
    if (weakness) {
      const id = `${weakness[1].toLowerCase()}_weakness`
      if (cache.effectDefinitions[id]) found.push(id)
      continue
    }
    const byPhrase = findEffectByPhrase(cleaned)
    if (byPhrase) {
      found.push(byPhrase.id)
      continue
    }
    found.push(...extractFromDesc(cleaned))
  }
  return [...new Set(found)].filter(id => !DAMAGE_TYPE_EFFECTS.has(id))
}

function parsePassiveEffectRefs(desc) {
  const applyEffects = parseApplyEffects(desc)
  if (applyEffects.length) return applyEffects
  const text = String(desc || '')
  if (/enhanced regeneration/i.test(text) && cache.effectDefinitions.rapid_regeneration) {
    return ['rapid_regeneration']
  }
  if (/regeneration status|apply regeneration/i.test(text) && cache.effectDefinitions.regeneration) {
    return ['regeneration']
  }
  return []
}

function isPassiveSkill(skill) {
  return /^passive:/i.test(skill?.desc || '')
}

function isAttackSkill(skill) {
  const desc = String(skill?.desc || '')
  return /^action:/i.test(desc) || /^spell:/i.test(desc)
}

/** Effects stored on skill data — ongoing passives and resistances only. */
export function recommendSkillEffects(skill) {
  if (!skill) return []
  const desc = String(skill.desc || '')

  if (cache.equipmentSkillEffects[skill.id]) return []
  if (isToggleSkill(skill)) return []
  if (isAttackSkill(skill) && !isPassiveSkill(skill)) return []

  const mapped = cache.passiveSkillEffects[skill.id]
  if (mapped?.length) {
    return mapped.filter(id => cache.effectDefinitions[id])
  }

  const grantEffects = parseGrantEffects(desc)
  if (grantEffects.length) return grantEffects

  if (cache.effectDefinitions[skill.id] && (isPassiveSkill(skill) || Number(skill.staminaCost || 0) === 0)) {
    return [skill.id]
  }

  if (isPassiveSkill(skill)) {
    return parsePassiveEffectRefs(desc)
  }

  return []
}

/** Effects shown in Skill & Gear Effects and applied as ongoing character modifiers. */
export function resolveSkillGearEffects(skill, character) {
  if (!skill) return []

  const equipRule = cache.equipmentSkillEffects[skill.id]
  if (equipRule) {
    if (character && characterWieldsWeaponKind(character, equipRule.weaponKind)) {
      const effectId = equipRule.effectId && cache.effectDefinitions[equipRule.effectId] ? equipRule.effectId : null
      return effectId ? [effectId] : []
    }
    return []
  }

  if (isToggleSkill(skill)) {
    if (!character?.activeToggles?.includes(skill.id)) return []
    const effectId = cache.toggleSkillEffects[skill.id]
    return effectId && cache.effectDefinitions[effectId] ? [effectId] : []
  }

  const recommended = recommendSkillEffects(skill)
  if (recommended.length) return recommended

  if (Array.isArray(skill.specialEffects)) {
    return skill.specialEffects
      .map(raw => normalizeEffectId(raw))
      .filter(id => cache.effectDefinitions[id])
  }

  return recommendSkillEffects(skill)
}

/** Tooltip / legacy resolver — combat on-hit effects for actions, passives for others. */
export function resolveSkillEffects(skill) {
  if (!skill) return []
  if (Array.isArray(skill.specialEffects)) {
    return skill.specialEffects
      .map(raw => normalizeEffectId(raw))
      .filter(id => cache.effectDefinitions[id])
  }

  const equipRule = cache.equipmentSkillEffects[skill.id]
  if (equipRule) {
    if (equipRule.effectId && cache.effectDefinitions[equipRule.effectId]) {
      return [equipRule.effectId]
    }
    return []
  }

  return recommendSkillEffects(skill)
}

export function equipmentSkillStatModifiers(character) {
  const totals = {}
  if (!character?.skills?.length) return totals
  for (const skillId of character.skills) {
    const rule = cache.equipmentSkillEffects[skillId]
    if (!rule || !characterWieldsWeaponKind(character, rule.weaponKind)) continue
    for (const [stat, value] of Object.entries(rule.statModifiers || {})) {
      totals[stat] = (totals[stat] || 0) + Number(value || 0)
    }
  }
  return totals
}
