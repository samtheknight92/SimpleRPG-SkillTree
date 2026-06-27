/**
 * Resolve structured activationEffects for skills that apply status on use.
 * Used by attach-activation-effects.mjs and generate-careers.mjs.
 */

const DAMAGE_TYPE_EFFECTS = new Set([
  'fire_damage', 'ice_damage', 'lightning_damage', 'earth_damage', 'wind_damage',
  'water_damage', 'darkness_damage', 'light_damage', 'holy_damage', 'undead_damage',
  'poison_damage', 'magic_damage', 'physical_damage'
])

const TIER_APPLY_CHANCE = { 2: 0.2, 3: 0.4, 4: 0.75, 5: 0.95 }

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function normalizePhrase(phrase) {
  return String(phrase || '')
    .replace(/\s+status$/i, '')
    .replace(/\s+debuff$/i, '')
    .replace(/\s+buff$/i, '')
    .trim()
}

export function findEffectByPhrase(phrase, effects) {
  const normalized = normalizePhrase(phrase).toLowerCase()
  if (!normalized) return null

  const list = Object.values(effects || {})
  for (const effect of list) {
    if (effect.name.toLowerCase() === normalized) return effect
    if (effect.id.replace(/_/g, ' ') === normalized) return effect
  }

  const sorted = [...list].sort((a, b) => b.name.length - a.name.length)
  for (const effect of sorted) {
    const name = effect.name.toLowerCase()
    const idPhrase = effect.id.replace(/_/g, ' ')
    if (normalized === name || normalized === idPhrase) return effect
    if (normalized.startsWith(name + ' ') || normalized.endsWith(' ' + name)) return effect
    if (name.length >= 4 && normalized.includes(name)) return effect
    if (idPhrase.length >= 4 && normalized.includes(idPhrase)) return effect
  }
  return null
}

export function parseDurationFromText(text, fallbackEffect) {
  const source = String(text || '')
  const turnMatch = source.match(/(?:for\s+)?(\d+)\s*turns?/i)
  if (turnMatch) return Number(turnMatch[1])
  const actMatch = source.match(/cannot act(?:\s+for)?\s+(\d+)\s*turn/i)
  if (actMatch) return Number(actMatch[1])
  const roundMatch = source.match(/(?:for\s+)?(\d+)\s*rounds?/i)
  if (roundMatch) return Number(roundMatch[1])
  const effectDuration = Number(fallbackEffect?.duration)
  if (Number.isFinite(effectDuration) && effectDuration >= 0 && effectDuration < 999) return effectDuration
  return 3
}

export function parsePotencyFromText(text, fallbackEffect) {
  const source = String(text || '')
  const perTurn = source.match(/(\d+)\s*(?:HP|hp|fire|ice|lightning|damage)?\s*(?:\/|per)\s*turn/i)
  if (perTurn) return Number(perTurn[1])
  const potencyMatch = source.match(/potency\s*(\d+)/i)
  if (potencyMatch) return Number(potencyMatch[1])
  const fallback = fallbackEffect?.potency
  if (typeof fallback === 'number' && Number.isFinite(fallback)) return fallback
  return 0
}

function contextForTiming(parenText, fullText) {
  const paren = String(parenText || '')
  if (paren && /(\d+)\s*(?:turns?|rounds?)/i.test(paren)) return paren
  return String(fullText || '')
}

function applyChanceFromDesc(desc, tier) {
  const text = String(desc || '')
  if (/(?:chance to|may)\s+apply|\d+%\s+chance/i.test(text)) {
    return TIER_APPLY_CHANCE[Number(tier)] ?? 1
  }
  const pctMatch = text.match(/(\d+)%\s+(?:chance\s+to\s+)?apply/i)
  if (pctMatch) return Number(pctMatch[1]) / 100
  const barePct = text.match(/(\d+)%\s+[A-Za-z]/)
  if (barePct && Number(barePct[1]) <= 100) return Number(barePct[1]) / 100
  return undefined
}

function isPassiveOngoingApply(skill) {
  const desc = String(skill?.desc || '')
  if (!/^passive:/i.test(desc)) return false
  return /apply\s+/i.test(desc)
}

function parseApplyPhrases(desc, effects, skill) {
  const text = String(desc || '')
  const payloads = []
  const seen = new Set()

  function addPhrase(phrase, parenText) {
    const effect = findEffectByPhrase(phrase, effects)
    if (!effect || DAMAGE_TYPE_EFFECTS.has(effect.id) || seen.has(effect.id)) return
    seen.add(effect.id)
    const context = contextForTiming(parenText, text)
    payloads.push({
      effectId: effect.id,
      duration: parseDurationFromText(context, effect),
      potency: parsePotencyFromText(context, effect)
    })
  }

  for (const match of text.matchAll(/apply\s+both\s+([A-Za-z][A-Za-z\s]+?)\s+and\s+([A-Za-z][A-Za-z\s]+?)(?:\s*\(([^)]*)\)|(?=\s+to\b)|[.;,]|$)/gi)) {
    addPhrase(match[1].trim(), match[3])
    addPhrase(match[2].trim(), match[3])
  }

  for (const match of text.matchAll(/(?:\d+%\s+chance to|chance to|may)\s+apply\s+([A-Za-z][A-Za-z\s]+?)(?:\s*\(([^)]*)\)|(?=\s+to\b)|[.;,]|$)/gi)) {
    if (/apply\s+both/i.test(match[0])) continue
    addPhrase(match[1].trim(), match[2])
  }

  for (const match of text.matchAll(/(?:Apply|apply)\s+([A-Za-z][A-Za-z\s]+?)(?:\s*\(([^)]*)\)|(?=\s+to\b)|[.;,]|$)/gi)) {
    if (/apply\s+both/i.test(match[0])) continue
    addPhrase(match[1].trim(), match[2])
  }

  for (const match of text.matchAll(/all attacks apply\s+([A-Za-z][A-Za-z\s]+?)(?:\s*\(|,|\.|$)/gi)) {
    addPhrase(match[1].trim(), text)
  }

  for (const match of text.matchAll(/(\d+)%\s+([A-Za-z][A-Za-z\s]+?)(?:[.;,+]|\s+\+|$)/g)) {
    if (/harmony|accuracy|damage|chance/i.test(match[0]) && !findEffectByPhrase(match[2], effects)) continue
    addPhrase(match[2].trim(), text)
  }

  const chance = applyChanceFromDesc(text, skill?.tier)
  if (chance !== undefined && chance < 1) {
    for (const row of payloads) row.chance = chance
  }

  return payloads
}

function fromCareerBuff(skillId, buff, effects) {
  const effect = effects[buff.effectId]
  return [{
    effectId: buff.effectId,
    duration: Number.isFinite(Number(buff.duration)) ? Number(buff.duration) : parseDurationFromText('', effect),
    potency: Number.isFinite(Number(buff.potency))
      ? Number(buff.potency)
      : parsePotencyFromText('', effect)
  }]
}

/** Returns activationEffects array or empty if this skill does not apply status on use. */
export function resolveActivationEffectsForSkill(skill, effects, options = {}) {
  if (!skill?.id || !effects) return []

  const careerActionBuffs = options.careerActionBuffs || {}
  const buff = careerActionBuffs[skill.id]
  if (buff?.effectId && effects[buff.effectId]) {
    return fromCareerBuff(skill.id, buff, effects)
  }

  if (isPassiveOngoingApply(skill)) return []

  const parsed = parseApplyPhrases(skill.desc, effects, skill)
  if (parsed.length) return parsed

  const ownEffect = effects[skill.id]
  if (ownEffect && !DAMAGE_TYPE_EFFECTS.has(skill.id) && ownEffect.type !== 'passive') {
    const desc = String(skill.desc || '')
    const isActivatable = /^action:/i.test(desc) || /^spell:/i.test(desc) || Number(skill.staminaCost || 0) > 0
    if (isActivatable && (/chance/i.test(desc) || /apply/i.test(desc) || ownEffect.type !== 'utility')) {
      const row = {
        effectId: skill.id,
        duration: parseDurationFromText(desc, ownEffect),
        potency: parsePotencyFromText(desc, ownEffect)
      }
      const chance = applyChanceFromDesc(desc, skill.tier)
      if (chance !== undefined && chance < 1) row.chance = chance
      return [row]
    }
  }

  return []
}

export function walkSkillLists(root, out = []) {
  if (Array.isArray(root)) {
    for (const skill of root) {
      if (skill && typeof skill === 'object' && skill.id) out.push(skill)
    }
    return out
  }
  if (root && typeof root === 'object') {
    for (const value of Object.values(root)) walkSkillLists(value, out)
  }
  return out
}
