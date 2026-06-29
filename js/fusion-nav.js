import { getSkillsData } from './data.js'
import { SKILL_SUBCATEGORY_LABELS } from './constants.js'
import { titleCase } from './utils.js'

/** Top-level Fusion tab keys (UI only — data may still use ranged_magic / utility_combat buckets). */
export const FUSION_UI_GROUPS = ['melee_magic', 'pure_magic', 'monster_fusion', 'career_fusions']

export const FUSION_WEAPON_TABS = ['sword', 'bow', 'axe', 'dagger', 'polearm', 'hammer', 'staff', 'striker']

export const FUSION_ELEMENT_TABS = ['fire', 'ice', 'lightning', 'earth', 'wind', 'water', 'darkness', 'light']

export const FUSION_CAREER_KIND_TABS = ['magic', 'weapons']

const FUSION_WEAPON_PREFIXES = new Set(FUSION_WEAPON_TABS)
const FUSION_ELEMENT_SET = new Set(FUSION_ELEMENT_TABS)

const FUSION_ELEMENT_ICON = {
  fire: '🔥',
  ice: '❄️',
  lightning: '⚡',
  earth: '🪨',
  wind: '💨',
  water: '💧',
  darkness: '🌑',
  light: '☀️'
}

const RETIRED_FUSION_SUB_MAP = {
  ranged_magic: 'melee_magic',
  utility_combat: 'career_fusions',
  career_fusion: 'career_fusions'
}

const RETIRED_FUSION_NEST_MAP = {
  ranged_magic: { weapons: ['bow'] },
  utility_combat: { kinds: ['weapons'] },
  career_fusion: { kinds: ['magic'] }
}

export const EMPTY_FUSION_FILTERS = () => ({
  weapons: [],
  elements: [],
  kinds: []
})

export function normalizeFusionGroup(subcategory) {
  return RETIRED_FUSION_SUB_MAP[subcategory] || subcategory
}

export function filtersForRetiredFusionSubcategory(subcategory) {
  return RETIRED_FUSION_NEST_MAP[subcategory] || null
}

export function displayFusionWeapon(weapon) {
  if (weapon === 'bow') return 'Ranged'
  return SKILL_SUBCATEGORY_LABELS[weapon] || titleCase(weapon)
}

export function displayFusionElement(element) {
  const icon = FUSION_ELEMENT_ICON[element] || ''
  return icon ? `${icon} ${titleCase(element)}` : titleCase(element)
}

export function displayFusionCareerKind(kind) {
  if (kind === 'weapons') return 'Weapons'
  if (kind === 'magic') return 'Magic'
  return titleCase(kind)
}

export function weaponFromFusionType(fusionType) {
  const first = String(fusionType || '').split('_')[0]
  return FUSION_WEAPON_PREFIXES.has(first) ? first : null
}

export function elementsFromFusionType(fusionType) {
  if (!fusionType) return []
  const parts = String(fusionType).split('_')
  if (parts[0] === 'monster' && FUSION_ELEMENT_SET.has(parts[1])) return [parts[1]]
  if (parts.length >= 2 && FUSION_ELEMENT_SET.has(parts[0]) && FUSION_ELEMENT_SET.has(parts[1])) {
    return [parts[0], parts[1]]
  }
  if (parts.length >= 2 && FUSION_WEAPON_PREFIXES.has(parts[0]) && FUSION_ELEMENT_SET.has(parts[1])) {
    return [parts[1]]
  }
  return []
}

export function careerKindFromSkill(skill) {
  if (skill?.fusionType && ['sword_alchemy', 'bow_enchanting', 'weapon_light'].includes(skill.fusionType)) {
    return 'weapons'
  }
  if (skill?.fusionKind === 'career') return 'magic'
  return null
}

function rawFusionLists(group) {
  const fusion = getSkillsData().fusion || {}
  if (group === 'melee_magic') {
    return [...(fusion.melee_magic || []), ...(fusion.ranged_magic || [])]
  }
  if (group === 'pure_magic') return fusion.pure_magic || []
  if (group === 'monster_fusion') return fusion.monster_fusion || []
  if (group === 'career_fusions') {
    return [...(fusion.utility_combat || []), ...(fusion.career_fusion || [])]
  }
  return []
}

/** All official skills in a fusion UI group (before filter chips). */
export function allFusionSkillsInGroup(group) {
  return rawFusionLists(normalizeFusionGroup(group))
}

export function fusionFilterDimensions(group) {
  const normalized = normalizeFusionGroup(group)
  if (normalized === 'melee_magic') {
    return { weapons: true, elements: true, kinds: false }
  }
  if (normalized === 'career_fusions') {
    return { weapons: false, elements: false, kinds: true }
  }
  if (normalized === 'pure_magic' || normalized === 'monster_fusion') {
    return { weapons: false, elements: true, kinds: false }
  }
  return { weapons: false, elements: false, kinds: false }
}

/** Which filter chips to show — only options that appear on at least one visible skill. */
export function availableFusionFilters(group, visibleSkills) {
  const dims = fusionFilterDimensions(group)
  const weapons = new Set()
  const elements = new Set()
  const kinds = new Set()

  for (const skill of visibleSkills) {
    if (dims.weapons) {
      const weapon = weaponFromFusionType(skill.fusionType)
      if (weapon) weapons.add(weapon)
    }
    if (dims.elements) {
      for (const el of elementsFromFusionType(skill.fusionType)) elements.add(el)
    }
    if (dims.kinds) {
      const kind = careerKindFromSkill(skill)
      if (kind) kinds.add(kind)
    }
  }

  return {
    weapons: dims.weapons ? FUSION_WEAPON_TABS.filter(w => weapons.has(w)) : [],
    elements: dims.elements ? FUSION_ELEMENT_TABS.filter(e => elements.has(e)) : [],
    kinds: dims.kinds ? FUSION_CAREER_KIND_TABS.filter(k => kinds.has(k)) : []
  }
}

export function skillMatchesFusionFilters(skill, filters, group) {
  const dims = fusionFilterDimensions(group)
  const f = filters || EMPTY_FUSION_FILTERS()

  if (dims.weapons && f.weapons?.length) {
    const weapon = weaponFromFusionType(skill.fusionType)
    if (!weapon || !f.weapons.includes(weapon)) return false
  }

  if (dims.elements && f.elements?.length) {
    const els = elementsFromFusionType(skill.fusionType)
    if (!els.some(el => f.elements.includes(el))) return false
  }

  if (dims.kinds && f.kinds?.length) {
    const kind = careerKindFromSkill(skill)
    if (!kind || !f.kinds.includes(kind)) return false
  }

  return true
}

export function hasActiveFusionFilters(filters) {
  const f = filters || EMPTY_FUSION_FILTERS()
  return Boolean(f.weapons?.length || f.elements?.length || f.kinds?.length)
}

export function pruneFusionFilters(filters, available) {
  const f = filters || EMPTY_FUSION_FILTERS()
  return {
    weapons: (f.weapons || []).filter(w => available.weapons.includes(w)),
    elements: (f.elements || []).filter(e => available.elements.includes(e)),
    kinds: (f.kinds || []).filter(k => available.kinds.includes(k))
  }
}

export function applyFusionNavigationState(state) {
  if (state.skillCategory !== 'fusion') return
  const raw = state.skillSubcategory
  const filterHint = filtersForRetiredFusionSubcategory(raw)
  state.skillSubcategory = normalizeFusionGroup(raw)
  if (!FUSION_UI_GROUPS.includes(state.skillSubcategory)) {
    state.skillSubcategory = FUSION_UI_GROUPS[0]
  }
  if (!state.skillFusionFilters || typeof state.skillFusionFilters !== 'object') {
    state.skillFusionFilters = EMPTY_FUSION_FILTERS()
  }
  if (filterHint) {
    state.skillFusionFilters = {
      ...EMPTY_FUSION_FILTERS(),
      ...filterHint
    }
  }
}

export function resetFusionFilters(state) {
  state.skillFusionFilters = EMPTY_FUSION_FILTERS()
}

export function toggleFusionFilterValue(filters, dimension, value) {
  const next = {
    weapons: [...(filters?.weapons || [])],
    elements: [...(filters?.elements || [])],
    kinds: [...(filters?.kinds || [])]
  }
  const list = next[dimension]
  if (!Array.isArray(list)) return next
  if (list.includes(value)) next[dimension] = list.filter(v => v !== value)
  else next[dimension] = [...list, value]
  return next
}

export function serializeFusionFilters(filters) {
  const f = filters || EMPTY_FUSION_FILTERS()
  return {
    w: (f.weapons || []).join(','),
    e: (f.elements || []).join(','),
    k: (f.kinds || []).join(',')
  }
}

export function parseFusionFiltersFromUrl(params) {
  const split = key => String(params[key] || '').split(',').map(s => s.trim()).filter(Boolean)
  const legacyNest = params.fnest || ''
  const filters = EMPTY_FUSION_FILTERS()
  if (params.ffw || params.ffe || params.ffk) {
    filters.weapons = split('ffw')
    filters.elements = split('ffe')
    filters.kinds = split('ffk')
    return filters
  }
  if (legacyNest === 'bow') filters.weapons = ['bow']
  else if (legacyNest === 'weapons') filters.kinds = ['weapons']
  else if (legacyNest === 'magic') filters.kinds = ['magic']
  else if (FUSION_WEAPON_TABS.includes(legacyNest)) filters.weapons = [legacyNest]
  return filters
}
