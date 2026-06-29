import { cache } from './cache.js'
import { getEffect } from './character.js'
import { getSkill, isToggleSkill } from './skills.js'
import { resolveCareerActionBuffs } from './career-effects.js'

const DAMAGE_TYPE_EFFECTS = new Set([
  'fire_damage', 'ice_damage', 'lightning_damage', 'earth_damage', 'wind_damage',
  'water_damage', 'darkness_damage', 'light_damage', 'holy_damage', 'undead_damage',
  'poison_damage', 'magic_damage', 'physical_damage'
])

const TIER_APPLY_CHANCE = { 2: 0.2, 3: 0.4, 4: 0.75, 5: 0.95 }

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function findEffectByPhrase(phrase) {
  const normalized = String(phrase || '').trim().toLowerCase()
  if (!normalized) return null
  return Object.values(cache.effectDefinitions).find(effect =>
    effect.name.toLowerCase() === normalized || effect.id.replace(/_/g, ' ') === normalized
  ) || null
}

function parseDurationFromText(text, fallbackEffect) {
  const source = String(text || '')
  const turnMatch = source.match(/(?:for\s+)?(\d+)\s*turns?/i)
  if (turnMatch) return Number(turnMatch[1])
  const actMatch = source.match(/cannot act(?:\s+for)?\s+(\d+)\s*turn/i)
  if (actMatch) return Number(actMatch[1])
  const roundMatch = source.match(/(?:for\s+)?(\d+)\s*rounds?/i)
  if (roundMatch) return Number(roundMatch[1])
  const effectDuration = Number(fallbackEffect?.duration)
  if (Number.isFinite(effectDuration) && effectDuration > 0 && effectDuration < 999) return effectDuration
  return 3
}

function parsePotencyFromText(text, fallbackEffect) {
  const source = String(text || '')
  const perTurn = source.match(/(\d+)\s*(?:HP|hp|fire|ice|lightning|damage)?\s*(?:\/|per)\s*turn/i)
  if (perTurn) return Number(perTurn[1])
  const potencyMatch = source.match(/potency\s*(\d+)/i)
  if (potencyMatch) return Number(potencyMatch[1])
  const fallback = fallbackEffect?.potency
  if (typeof fallback === 'number' && Number.isFinite(fallback)) return fallback
  return undefined
}

function parseApplyPhrases(desc) {
  const text = String(desc || '')
  const payloads = []
  const seen = new Set()

  function addPhrase(phrase, parenText) {
    const effect = findEffectByPhrase(phrase)
    if (!effect || DAMAGE_TYPE_EFFECTS.has(effect.id) || seen.has(effect.id)) return
    seen.add(effect.id)
    payloads.push({
      effectId: effect.id,
      duration: parseDurationFromText(parenText || text, effect),
      potency: parsePotencyFromText(parenText || text, effect)
    })
  }

  for (const match of text.matchAll(/apply\s+both\s+([A-Za-z][A-Za-z\s]+?)\s+and\s+([A-Za-z][A-Za-z\s]+?)(?:\s*\(([^)]*)\)|\.|,|$)/gi)) {
    addPhrase(match[1].trim(), match[3])
    addPhrase(match[2].trim(), match[3])
  }

  for (const match of text.matchAll(/(?:\d+%\s+chance to|chance to|may)\s+apply\s+([A-Za-z][A-Za-z\s]+?)(?:\s*\(([^)]*)\)|\.|,|$)/gi)) {
    if (/apply\s+both/i.test(match[0])) continue
    addPhrase(match[1].trim(), match[2])
  }

  for (const match of text.matchAll(/(?:Apply|apply)\s+([A-Za-z][A-Za-z\s]+?)(?:\s*\(([^)]*)\)|\.|,|$)/gi)) {
    if (/apply\s+both/i.test(match[0])) continue
    addPhrase(match[1].trim(), match[2])
  }

  return payloads
}

const FUSION_WEAPON_ALIAS = { bow: 'ranged' }

const ACTION_BAR_GROUP_RANK = {
  sword: 10,
  axe: 20,
  dagger: 30,
  polearm: 40,
  hammer: 50,
  striker: 55,
  ranged: 60,
  staff: 70,
  fire: 110,
  ice: 120,
  lightning: 130,
  earth: 140,
  wind: 150,
  water: 160,
  darkness: 170,
  light: 180
}

const ELEMENT_GROUP_ORDER = ['fire', 'ice', 'lightning', 'earth', 'wind', 'water', 'darkness', 'light']

const CATEGORY_GROUP_RANK = {
  fusion: 200,
  ascension: 210,
  ultimate: 220,
  racial: 300,
  professions: 400
}

/** Sort key for grouping Action Bar skills (sword, staff, fire, lightning, etc.). */
export function getActionBarSkillGroup(skill) {
  if (!skill) return { rank: 9999, subgroup: '', key: 'other' }
  if (skill.id === '__basic_attack__' || skill.isBasicAttack) {
    return { rank: 0, subgroup: '', key: 'basic_attack' }
  }

  if (skill.fusionType) {
    const [rawWeapon, element = ''] = String(skill.fusionType).split('_')
    const weapon = FUSION_WEAPON_ALIAS[rawWeapon] || rawWeapon
    const rank = ACTION_BAR_GROUP_RANK[weapon] ?? 195
    return { rank, subgroup: element, key: `${weapon}:${element || 'fusion'}` }
  }

  if (skill.category === 'weapons') {
    const group = skill.subcategory || 'weapons'
    return {
      rank: ACTION_BAR_GROUP_RANK[group] ?? 95,
      subgroup: '',
      key: group
    }
  }

  if (skill.category === 'magic') {
    const group = skill.elementalType || skill.subcategory || 'magic'
    return {
      rank: ACTION_BAR_GROUP_RANK[group] ?? 195,
      subgroup: '',
      key: group
    }
  }

  if (skill.category === 'fusion') {
    const group = skill.subcategory || 'fusion'
    return {
      rank: CATEGORY_GROUP_RANK.fusion,
      subgroup: group,
      key: `fusion:${group}`
    }
  }

  const category = skill.category || 'other'
  const subgroup = skill.subcategory || skill.raceGroup || ''
  return {
    rank: CATEGORY_GROUP_RANK[category] ?? 500,
    subgroup,
    key: subgroup ? `${category}:${subgroup}` : category
  }
}

function compareActionBarSkills(a, b) {
  const ga = getActionBarSkillGroup(a)
  const gb = getActionBarSkillGroup(b)
  if (ga.rank !== gb.rank) return ga.rank - gb.rank

  if (ga.subgroup !== gb.subgroup) {
    const ai = ELEMENT_GROUP_ORDER.indexOf(ga.subgroup)
    const bi = ELEMENT_GROUP_ORDER.indexOf(gb.subgroup)
    if (ai !== -1 && bi !== -1) return ai - bi
    if (ai !== -1) return -1
    if (bi !== -1) return 1
    return String(ga.subgroup).localeCompare(String(gb.subgroup))
  }

  const typeOrder = { toggle: 0, activatable: 1 }
  const ta = getSkillActivationType(a)
  const tb = getSkillActivationType(b)
  if (typeOrder[ta] !== typeOrder[tb]) return typeOrder[ta] - typeOrder[tb]

  const tierDiff = Number(a.tier || 1) - Number(b.tier || 1)
  if (tierDiff) return tierDiff

  return String(a.name).localeCompare(String(b.name))
}

export function getSkillActivationType(skill) {
  if (!skill) return 'passive'
  if (skill.source === 'homebrew') {
    const type = String(skill.skillType || 'passive').toLowerCase()
    if (type === 'toggle') return 'toggle'
    if (type === 'activatable') return 'activatable'
    return 'passive'
  }
  if (cache.equipmentSkillEffects?.[skill.id]) return 'passive'
  if (isToggleSkill(skill)) return 'toggle'
  if (/^passive:/i.test(skill.desc || '')) return 'passive'
  if (/^action:/i.test(skill.desc || '') || /^spell:/i.test(skill.desc || '')) return 'activatable'
  if (Number(skill.staminaCost || 0) > 0) return 'activatable'
  return 'passive'
}

export function isActionBarSkill(skill) {
  const type = getSkillActivationType(skill)
  return type === 'toggle' || type === 'activatable'
}

export function resolveActivationEffects(skill) {
  if (!skill) return []

  const careerBuffs = resolveCareerActionBuffs(skill)
  if (careerBuffs.length) return careerBuffs

  if (Array.isArray(skill.activationEffects) && skill.activationEffects.length) {
    const hasChance = skill.source !== 'homebrew' && /(?:chance to|may)\s+apply|\d+%\s+chance/i.test(String(skill.desc || ''))
    const chance = hasChance ? (TIER_APPLY_CHANCE[Number(skill.tier)] ?? 1) : 1
    return skill.activationEffects
      .filter(item => item?.effectId && cache.effectDefinitions[item.effectId])
      .map(item => ({
        effectId: item.effectId,
        duration: Number.isFinite(Number(item.duration)) ? Number(item.duration) : parseDurationFromText(skill.desc, getEffect(item.effectId)),
        potency: Number.isFinite(Number(item.potency)) ? Number(item.potency) : parsePotencyFromText(skill.desc, getEffect(item.effectId)),
        chance: skill.source === 'homebrew' ? 1 : (Number.isFinite(Number(item.chance)) ? Number(item.chance) : chance),
        applyTo: item.applyTo,
        source: 'data'
      }))
  }

  const desc = String(skill.desc || '')
  const payloads = parseApplyPhrases(desc)
  const hasChance = /(?:chance to|may)\s+apply|\d+%\s+chance/i.test(desc)
  const chance = hasChance ? (TIER_APPLY_CHANCE[Number(skill.tier)] ?? 1) : 1

  if (payloads.length) {
    return payloads.map(item => ({ ...item, chance, source: 'apply' }))
  }

  const ownEffect = cache.effectDefinitions[skill.id]
  if (ownEffect && !DAMAGE_TYPE_EFFECTS.has(skill.id) && ownEffect.type !== 'passive') {
    const duration = parseDurationFromText(desc, ownEffect)
    const ownHasChance = /chance/i.test(desc)
    return [{
      effectId: skill.id,
      duration,
      potency: parsePotencyFromText(desc, ownEffect),
      chance: ownHasChance ? (TIER_APPLY_CHANCE[Number(skill.tier)] ?? 0.4) : 1,
      source: 'skill'
    }]
  }

  return []
}

export function getActionBarSkills(character) {
  if (!character?.skills?.length) return []
  return character.skills
    .map(id => getSkill(id))
    .filter(skill => skill && isActionBarSkill(skill))
    .sort(compareActionBarSkills)
}

export function rollSkillProc(chance) {
  if (chance >= 1) return true
  if (chance <= 0) return false
  return Math.random() < chance
}

export function tierBorderClass(tier) {
  const value = Number(tier || 1)
  if (value >= 6) return 'skill-slot-tier-6'
  if (value >= 5) return 'skill-slot-tier-5'
  if (value >= 4) return 'skill-slot-tier-4'
  if (value >= 3) return 'skill-slot-tier-3'
  if (value >= 2) return 'skill-slot-tier-2'
  return 'skill-slot-tier-1'
}
