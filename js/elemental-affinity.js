import { getRace, getSkill, getItem } from './cache.js'
import { getEffect, normalizeEffectId } from './character.js'

/** Standard elements — thunder is canonical; lightning is an alias. */
export const ELEMENTS = [
  { id: 'fire', icon: '🔥', label: 'Fire' },
  { id: 'ice', icon: '❄️', label: 'Ice' },
  { id: 'thunder', icon: '⚡', label: 'Thunder' },
  { id: 'earth', icon: '🪨', label: 'Earth' },
  { id: 'wind', icon: '💨', label: 'Wind' },
  { id: 'water', icon: '💧', label: 'Water' },
  { id: 'darkness', icon: '🌑', label: 'Darkness' },
  { id: 'light', icon: '☀️', label: 'Light' }
]

const ELEMENT_IDS = new Set(ELEMENTS.map(element => element.id))

const RESIST_TIER_LABEL = {
  25: '25% resist (÷4)',
  50: '50% resist (÷2)'
}

const WEAK_TIER_LABEL = {
  200: '200% weak (×2)',
  400: '400% weak (×4)'
}

const DAMAGE_MULTIPLIER = {
  immunity: 0,
  resistance: { 25: 0.25, 50: 0.5 },
  neutral: 1,
  weakness: { 200: 2, 400: 4 }
}

/** Resist/weak tiers ↔ stacking levels (net levels cancel before resolving). */
const RESIST_TIER_TO_LEVEL = { 25: 2, 50: 1 }
const WEAK_TIER_TO_LEVEL = { 200: 1, 400: 2 }
const NET_RESIST_LEVEL_TO_TIER = { 1: 50, 2: 25 }
const NET_WEAK_LEVEL_TO_TIER = { 1: 200, 2: 400 }
const MAX_NET_LEVEL = 2

function normalizeElementId(name) {
  const clean = String(name || '').trim().toLowerCase()
  if (!clean) return ''
  if (clean === 'lightning') return 'thunder'
  return ELEMENT_IDS.has(clean) ? clean : ''
}

function splitElementList(raw) {
  return String(raw || '')
    .split(/\s+and\s+|\s*,\s*/i)
    .map(part => normalizeElementId(part.trim()))
    .filter(Boolean)
}

function pushEntry(entries, { element, kind, tier, source }) {
  const id = normalizeElementId(element)
  if (!id || !source) return
  entries.push({ element: id, kind, tier, source })
}

function parsePercentTier(value) {
  const tier = Number(value)
  if (!Number.isFinite(tier)) return null
  if (tier === 25 || tier === 50) return { kind: 'resistance', tier }
  if (tier === 200 || tier === 400) return { kind: 'weakness', tier }
  return null
}

/** Parse elemental resist/weak/immune lines from skill or item desc text. */
export function parseElementalEntriesFromText(text, source) {
  if (!text || !source) return []
  const entries = []
  const haystack = String(text)

  const grant = haystack.match(/GRANTS?:\s*([^.\n]+)/i)
  const segments = grant
    ? grant[1].split(/;\s*/)
    : [haystack]

  for (const segment of segments) {
    const chunk = segment.trim()
    if (!chunk) continue

    for (const match of chunk.matchAll(/\b((?:[A-Za-z]+\s+and\s+)?[A-Za-z]+)\s+(resistance|weakness)\s+(\d+)%/gi)) {
      const parsed = parsePercentTier(match[3])
      if (!parsed) continue
      for (const element of splitElementList(match[1])) {
        pushEntry(entries, { element, kind: parsed.kind, tier: parsed.tier, source })
      }
    }

    for (const match of chunk.matchAll(/\b(fire|ice|lightning|thunder|earth|wind|water|darkness|light)\s+immunity\b/gi)) {
      pushEntry(entries, { element: match[1], kind: 'immunity', tier: 0, source })
    }

    for (const match of chunk.matchAll(/immune\s+to\s+(fire|ice|lightning|thunder|earth|wind|water|darkness|light)(?:\s+damage)?/gi)) {
      pushEntry(entries, { element: match[1], kind: 'immunity', tier: 0, source })
    }
  }

  return entries
}

function tierFromEffectId(effectId) {
  const id = normalizeEffectId(effectId)
  const match = id.match(/^(fire|ice|lightning|thunder|earth|wind|water|darkness|light)_(resistance|weakness|immunity)$/)
  if (!match) return null
  const element = normalizeElementId(match[1])
  if (!element) return null
  if (match[2] === 'immunity') return { element, kind: 'immunity', tier: 0 }
  if (match[2] === 'resistance') return { element, kind: 'resistance', tier: 50 }
  if (match[2] === 'weakness') return { element, kind: 'weakness', tier: 200 }
  return null
}

/** Legacy item.elementalAffinities (+/- flat) → nearest % tier when desc has no GRANTS line. */
function parseLegacyItemAffinities(item, source) {
  const affinities = item?.elementalAffinities
  if (!affinities) return []
  const entries = []

  for (const [element, value] of Object.entries(affinities.resistances || {})) {
    const amount = Number(value)
    if (!Number.isFinite(amount) || amount >= 0) continue
    const tier = amount <= -2 ? 25 : 50
    pushEntry(entries, { element, kind: 'resistance', tier, source })
  }

  for (const [element, value] of Object.entries(affinities.weaknesses || {})) {
    const amount = Number(value)
    if (!Number.isFinite(amount) || amount <= 0) continue
    const tier = amount >= 2 ? 400 : 200
    pushEntry(entries, { element, kind: 'weakness', tier, source })
  }

  return entries
}

function collectDragonbornEntries(character) {
  const affinity = normalizeElementId(character?.elementalAffinity)
  if (!affinity) return []
  const hasMastery = character.skills?.includes('elemental_mastery')
  if (hasMastery) {
    return [{ element: affinity, kind: 'immunity', tier: 0, source: 'Skill: Elemental Mastery' }]
  }
  return [{ element: affinity, kind: 'resistance', tier: 50, source: 'Race: Draconic Heritage (Scaled Hide)' }]
}

/** All elemental tier contributions for one character (skills, gear, race, status). */
export function collectElementalAffinitySources(character) {
  if (!character) return []

  const entries = []
  const seenFromText = new Set()

  const race = getRace(character.race)
  for (const trait of race?.passiveTraits || []) {
    for (const entry of parseElementalEntriesFromText(trait, `Race: ${race.name}`)) {
      entries.push(entry)
      seenFromText.add(`${entry.element}:${entry.kind}:${entry.tier}:${entry.source}`)
    }
  }
  for (const effectId of race?.specialEffects || []) {
    const mapped = tierFromEffectId(effectId)
    if (mapped) entries.push({ ...mapped, source: `Race: ${race.name}` })
  }

  for (const entry of collectDragonbornEntries(character)) entries.push(entry)

  for (const skillId of character.skills || []) {
    const skill = getSkill(skillId)
    if (!skill) continue
    const source = `Skill: ${skill.name}`
    for (const entry of parseElementalEntriesFromText(skill.desc, source)) {
      entries.push(entry)
      seenFromText.add(`${entry.element}:${entry.kind}:${entry.tier}:${entry.source}`)
    }
    for (const effectId of skill.specialEffects || []) {
      const mapped = tierFromEffectId(effectId)
      if (mapped) entries.push({ ...mapped, source })
    }
  }

  for (const entryUid of Object.values(character.equipped || {})) {
    if (!entryUid) continue
    const inv = character.inventory?.find(row => row.uid === entryUid)
    const item = inv && getItem(inv.itemId)
    if (!item) continue
    const source = `Equipped: ${item.name}`
    const fromText = parseElementalEntriesFromText(item.desc, source)
    if (fromText.length) {
      for (const entry of fromText) {
        entries.push(entry)
        seenFromText.add(`${entry.element}:${entry.kind}:${entry.tier}:${entry.source}`)
      }
    } else {
      for (const entry of parseLegacyItemAffinities(item, source)) entries.push(entry)
    }
    for (const effectId of item.specialEffects || []) {
      const mapped = tierFromEffectId(effectId)
      if (!mapped) continue
      const key = `${mapped.element}:${mapped.kind}:${mapped.tier}:${source}`
      if (fromText.some(row => row.element === mapped.element && row.kind === mapped.kind)) continue
      if (!seenFromText.has(key)) entries.push({ ...mapped, source })
    }
  }

  for (const status of character.statusEffects || []) {
    const effect = getEffect(status.effectId)
    const mapped = tierFromEffectId(status.effectId)
    if (!mapped) continue
    entries.push({
      ...mapped,
      source: `Status: ${effect?.name || status.effectId}`
    })
    for (const entry of parseElementalEntriesFromText(effect?.desc, `Status: ${effect?.name || status.effectId}`)) {
      entries.push(entry)
    }
  }

  return entries
}

function labelForEntry(kind, tier) {
  if (kind === 'immunity') return 'Immune'
  if (kind === 'resistance') return RESIST_TIER_LABEL[tier] || `${tier}% resist`
  if (kind === 'weakness') return WEAK_TIER_LABEL[tier] || `${tier}% weak`
  return 'Normal'
}

function multiplierFor(kind, tier) {
  if (kind === 'immunity') return 0
  if (kind === 'resistance') return DAMAGE_MULTIPLIER.resistance[tier] ?? 1
  if (kind === 'weakness') return DAMAGE_MULTIPLIER.weakness[tier] ?? 1
  return 1
}

function resistLevelsForTier(tier) {
  return RESIST_TIER_TO_LEVEL[tier] ?? 0
}

function weakLevelsForTier(tier) {
  return WEAK_TIER_TO_LEVEL[tier] ?? 0
}

function totalResistLevels(entries) {
  return entries
    .filter(entry => entry.kind === 'resistance')
    .reduce((sum, entry) => sum + resistLevelsForTier(entry.tier), 0)
}

function totalWeakLevels(entries) {
  return entries
    .filter(entry => entry.kind === 'weakness')
    .reduce((sum, entry) => sum + weakLevelsForTier(entry.tier), 0)
}

function resistTierFromNetLevels(netLevels) {
  const capped = Math.min(Math.max(1, netLevels), MAX_NET_LEVEL)
  return NET_RESIST_LEVEL_TO_TIER[capped]
}

function weakTierFromNetLevels(netLevels) {
  const capped = Math.min(Math.max(1, netLevels), MAX_NET_LEVEL)
  return NET_WEAK_LEVEL_TO_TIER[capped]
}

function aggregateElement(entries) {
  if (!entries.length) {
    return { kind: 'neutral', tier: 100, statusLabel: 'Normal', multiplier: 1, sources: [] }
  }

  const sources = [...new Set(entries.map(entry => entry.source))]
  if (entries.some(entry => entry.kind === 'immunity')) {
    return { kind: 'immunity', tier: 0, statusLabel: 'Immune', multiplier: 0, sources }
  }

  const resistLevels = totalResistLevels(entries)
  const weakLevels = totalWeakLevels(entries)
  const netLevels = resistLevels - weakLevels
  const conflicted = resistLevels > 0 && weakLevels > 0

  if (netLevels === 0) {
    return {
      kind: 'neutral',
      tier: 100,
      statusLabel: conflicted ? 'Normal (levels cancel)' : 'Normal',
      multiplier: 1,
      sources,
      conflicted,
      resistLevels,
      weakLevels,
      netLevels: 0
    }
  }

  if (netLevels > 0) {
    const tier = resistTierFromNetLevels(netLevels)
    return {
      kind: 'resistance',
      tier,
      statusLabel: labelForEntry('resistance', tier),
      multiplier: multiplierFor('resistance', tier),
      sources,
      resistLevels,
      weakLevels,
      netLevels
    }
  }

  const tier = weakTierFromNetLevels(-netLevels)
  return {
    kind: 'weakness',
    tier,
    statusLabel: labelForEntry('weakness', tier),
    multiplier: multiplierFor('weakness', tier),
    sources,
    resistLevels,
    weakLevels,
    netLevels
  }
}

/** Resolved per-element profile for display and combat. */
export function computeElementalAffinity(character) {
  if (character?._cache?.elementalAffinity) return character._cache.elementalAffinity

  const allSources = collectElementalAffinitySources(character)
  const byElement = Object.fromEntries(ELEMENTS.map(element => [element.id, []]))
  for (const entry of allSources) {
    if (byElement[entry.element]) byElement[entry.element].push(entry)
  }

  const elements = {}
  for (const element of ELEMENTS) {
    elements[element.id] = {
      id: element.id,
      icon: element.icon,
      name: element.label,
      ...aggregateElement(byElement[element.id])
    }
  }

  const profile = { elements, sources: allSources }
  if (character) {
    character._cache = character._cache || {}
    character._cache.elementalAffinity = profile
  }
  return profile
}

/** Typed damage multiplier for combat (0 = immune, 0.25–4 otherwise). */
export function getElementalDamageMultiplier(character, elementType) {
  const id = normalizeElementId(elementType)
  if (!id) return 1
  const profile = computeElementalAffinity(character)
  return profile.elements[id]?.multiplier ?? 1
}

export function elementalAffinityTooltip(elementProfile) {
  if (!elementProfile) return ''
  const out = [
    `${elementProfile.icon} ${elementProfile.name}`,
    `Damage taken: ${elementProfile.statusLabel}`
  ]
  if (elementProfile.id === 'thunder') out.push('Includes lightning damage.')

  const { resistLevels, weakLevels, netLevels } = elementProfile
  if (elementProfile.conflicted && Number.isFinite(resistLevels) && Number.isFinite(weakLevels)) {
    out.push(
      '',
      `Levels: ${resistLevels} resist − ${weakLevels} weak = ${netLevels} net`,
      '25% resist = 2 levels · 50% = 1 level · 200% weak = 1 level · 400% = 2 levels'
    )
  }

  if (elementProfile.kind === 'neutral' && elementProfile.conflicted) {
    out.push('', 'At the table: normal damage (×1) — resist and weakness levels matched.')
  } else if (elementProfile.netLevels > 0) {
    out.push('', `At the table: ${elementProfile.statusLabel} after level cancel.`)
  } else if (elementProfile.netLevels < 0) {
    out.push('', `At the table: ${elementProfile.statusLabel} after level cancel.`)
  } else {
    out.push('', `At the table: ${elementProfile.statusLabel}`)
  }

  if (elementProfile.sources?.length) {
    out.push('', 'From:')
    for (const source of elementProfile.sources) out.push(`• ${source}`)
  } else {
    out.push('', 'No modifiers from race, skills, or equipment.')
  }
  return out.join('\n')
}

export function elementalAffinityTone(profile) {
  if (!profile) return ''
  if (profile.kind === 'immunity') return 'good'
  if (profile.kind === 'resistance') return 'good'
  if (profile.kind === 'weakness') return 'bad'
  if (profile.conflicted) return 'neutral'
  return ''
}

export function isElementalAffinityRowVisible(row) {
  if (!row) return false
  return row.kind !== 'neutral' || row.conflicted === true
}
