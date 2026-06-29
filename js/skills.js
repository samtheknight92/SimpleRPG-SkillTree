import { getSkillsData } from './data.js'
import { HIDDEN_SKILL_CATEGORIES, SKILL_SUBCATEGORY_LABELS, TIER_MIN_LEVEL, CAPSTONE_TIER_MIN_LEVEL } from './constants.js'
import { cache, flattenSkills, getSkill, displayCategory, getRace } from './cache.js'
import {
  listHomebrewSkills,
  listHomebrewRaces,
  homebrewSubcategoriesForCategory,
  homebrewSkillLockSummary,
  isHomebrewSkill,
  resolvedHomebrewSkill
} from './homebrew.js'
import { activeCharacter, state } from './state.js'
import { isGmMode } from './gm-mode.js'
import { titleCase } from './utils.js'
import { characterLevelInfo } from './level.js'
import {
  FUSION_UI_GROUPS,
  allFusionSkillsInGroup,
  applyFusionNavigationState,
  availableFusionFilters,
  normalizeFusionGroup,
  pruneFusionFilters,
  skillMatchesFusionFilters
} from './fusion-nav.js'

export const HUMAN_RACE_SKILL = 'human_determination'

export function humanStarterWeaponOptions() {
  const weapons = getSkillsData().weapons || {}
  const options = []
  for (const [weaponType, list] of Object.entries(weapons)) {
    if (!Array.isArray(list)) continue
    for (const skill of list) {
      if (Number(skill.tier || 1) !== 1) continue
      if (skill.prerequisites?.type !== 'NONE') continue
      options.push({
        id: skill.id,
        name: skill.name,
        icon: skill.icon,
        weaponType,
        desc: skill.desc
      })
    }
  }
  return options.sort((a, b) => a.name.localeCompare(b.name))
}

export function humanHasCrossCultural(character) {
  return character?.race === 'human' && character.skills?.includes(HUMAN_RACE_SKILL)
}

export function isHumanCrossCulturalSkill(character, skill) {
  if (!character || character.race !== 'human' || !skill) return false
  return skill.category === 'racial'
    && skill.subcategory !== 'human'
    && skill.raceGroup !== 'monster'
}

export function isHumanMonsterSkill(skill) {
  return isMonsterRacialSkill(skill)
}

function playableCrossCulturalRaces(racial) {
  return Object.entries(racial).filter(([key, value]) =>
    key !== 'monster' && key !== 'human' && Array.isArray(value)
  )
}

function racialTreeData(character) {
  const racial = getSkillsData().racial || {}
  if (character?.race === 'monster') return racial.monster || {}
  if (character?.race === 'human') {
    const out = {}
    if (Array.isArray(racial.human)) out.human = racial.human
    if (humanHasCrossCultural(character)) {
      for (const [key, value] of playableCrossCulturalRaces(racial)) {
        out[key] = value
      }
      const monster = racial.monster || {}
      if (Object.keys(monster).length) {
        out.monster = {}
        for (const [subKey, list] of Object.entries(monster)) {
          if (!Array.isArray(list)) continue
          out.monster[subKey] = list.filter(skill => Number(skill.tier || 1) === 1)
        }
      }
    }
    return out
  }
  if (character?.race && Array.isArray(racial[character.race])) {
    return { [character.race]: racial[character.race] }
  }
  if (character?.race && getRace(character.race)?.source === 'homebrew') {
    return { [character.race]: [] }
  }
  return {}
}

export function subcategoriesFor(category, character = activeCharacter()) {
  if (category === 'fusion') return [...FUSION_UI_GROUPS]
  if (category === 'racial') {
    const racial = getSkillsData().racial || {}
    if (isGmMode()) {
      const subs = []
      for (const [key, value] of Object.entries(racial)) {
        if (key === 'monster' && value && typeof value === 'object' && !Array.isArray(value)) {
          subs.push(...Object.keys(value))
        } else if (Array.isArray(value)) subs.push(key)
      }
      return subs
    }
    if (!character?.race) return []
    if (character.race === 'monster') return Object.keys(racial.monster || {})
    if (character.race === 'human') {
      const subs = racial.human ? ['human'] : []
    if (humanHasCrossCultural(character)) {
      subs.push(...playableCrossCulturalRaces(racial).map(([key]) => key).sort())
      subs.push(...Object.keys(racial.monster || {}).sort())
    }
      return subs
    }
    if (racial[character.race]) return [character.race]
    if (getRace(character.race)?.source === 'homebrew') return [character.race]
    return []
  }
  return Object.keys(getSkillsData()[category] || {})
}

function listForSubcategory(tree, subcategory) {
  if (!tree || !subcategory) return []
  if (Array.isArray(tree[subcategory])) return tree[subcategory]
  if (tree.monster?.[subcategory]) return tree.monster[subcategory]
  return []
}

export function categoryTreeData(category, character = activeCharacter()) {
  if (category === 'racial') {
    if (isGmMode()) return getSkillsData().racial || {}
    return racialTreeData(character)
  }
  return getSkillsData()[category] || {}
}

function isSkillCategoryHidden(category) {
  return HIDDEN_SKILL_CATEGORIES.includes(category)
}

export function categoryAllowed(character, category) {
  if (isSkillCategoryHidden(category)) return false
  if (isGmMode()) return Boolean(character)
  if (!character) return false
  if (category === 'professions' && character.race === 'monster') return false
  if (category === 'careers' && character.race === 'monster') return false
  return true
}

export function isMonsterRacialSkill(skill) {
  return skill?.category === 'racial' && skill?.raceGroup === 'monster'
}

export function raceAllowed(character, skill) {
  if (!skill) return false
  if (skill.source === 'homebrew') {
    if (skill.category === 'racial') {
      if (isGmMode()) return true
      if (!character?.race) return false
      return skill.subcategory === character.race
    }
    if (skill.lockRaces?.length) {
      if (isGmMode()) return true
      if (!character?.race) return false
      return skill.lockRaces.includes(character.race)
    }
    return true
  }
  if (isGmMode()) return true
  if (skill.category !== 'racial') return true
  if (!character?.race) return false
  if (character.race === 'monster') return isMonsterRacialSkill(skill)
  if (character.race === 'human') {
    if (skill.subcategory === 'human') return true
    if (!humanHasCrossCultural(character)) return false
    if (isMonsterRacialSkill(skill) && Number(skill.tier || 1) === 1) return true
    if (isHumanCrossCulturalSkill(character, skill) && Number(skill.tier || 1) === 1) return true
    return false
  }
  return skill.subcategory === character.race && skill.raceGroup !== 'monster'
}

/** Ascension & Ultimate breakthroughs stay off the tree until fully eligible (capstone tier level + prereqs). */
function isCapstoneSkillUnlocked(character, skill) {
  if (character.skills.includes(skill.id)) return true
  if (characterLevelInfo(character).level < minLevelToLearnSkill(skill)) return false
  if (!hasPrerequisites(character, skill)) return false
  if (incompatibilityReason(character, skill)) return false
  return true
}

function capstoneTierMinLevel(skill) {
  const tier = Number(skill?.tier || 1)
  const category = skill?.category
  if (category !== 'ascension' && category !== 'ultimate') return null
  if (tier === 6 && category !== 'ultimate') return 99
  return CAPSTONE_TIER_MIN_LEVEL[tier] ?? null
}

export function isSkillVisible(character, skill) {
  if (!skill || !character) return false
  if (skill.source === 'homebrew') {
    if (!categoryAllowed(character, skill.category)) return false
    if (skill.category === 'racial' && !raceAllowed(character, skill)) return false
    if (skill.lockRaces?.length && !isGmMode() && !character.skills.includes(skill.id)) {
      if (!character?.race || !skill.lockRaces.includes(character.race)) return false
    }
    if ((skill.category === 'ascension' || skill.category === 'ultimate') && !isGmMode()) {
      return isCapstoneSkillUnlocked(character, skill)
    }
    return true
  }
  if (isGmMode()) return true
  if (!raceAllowed(character, skill)) return false
  if (!categoryAllowed(character, skill.category)) return false
  if (isHumanCrossCulturalSkill(character, skill)) {
    if (!humanHasCrossCultural(character)) return false
    if (Number(skill.tier || 1) > 1 && !character.skills.includes(skill.id)) return false
  }
  if (character.race === 'human' && isMonsterRacialSkill(skill)) {
    if (!humanHasCrossCultural(character)) return false
    if (Number(skill.tier || 1) > 1 && !character.skills.includes(skill.id)) return false
  }
  if (skill.category === 'ascension' || skill.category === 'ultimate') {
    return isCapstoneSkillUnlocked(character, skill)
  }
  if (character.skills.includes(skill.id)) return true
  return hasPrerequisites(character, skill)
}

export function skillsInSubcategory(category, subcategory, character = activeCharacter()) {
  if (category === 'fusion') {
    const group = normalizeFusionGroup(subcategory)
    applyFusionNavigationState(state)
    syncFusionFilters(character)
    const list = allFusionSkillsInGroup(group)
    const official = list.map(skill =>
      getSkill(skill.id) || { ...skill, category, subcategory: group }
    )
    const homebrew = listHomebrewSkills()
      .filter(skill => skill.category === category && normalizeFusionGroup(skill.subcategory || '') === group)
      .map(skill => getSkill(skill.id))
      .filter(Boolean)
    const visible = [...official, ...homebrew].filter(skill => isGmMode() || isSkillVisible(character, skill))
    return visible.filter(skill => skillMatchesFusionFilters(skill, state.skillFusionFilters, group))
  }

  const tree = categoryTreeData(category, character)
  const list = listForSubcategory(tree, subcategory)
  const official = Array.isArray(list)
    ? list.map(skill => getSkill(skill.id) || { ...skill, category, subcategory })
    : []
  const homebrew = listHomebrewSkills()
    .filter(skill => skill.category === category && (skill.subcategory || 'custom') === subcategory)
    .map(skill => getSkill(skill.id))
    .filter(Boolean)
  const merged = [...official, ...homebrew]
  return merged.filter(skill => isGmMode() || isSkillVisible(character, skill))
}

export function visibleSubcategories(category, character = activeCharacter()) {
  if (!categoryAllowed(character, category)) return []
  if (category === 'fusion') {
    applyFusionNavigationState(state)
    const visible = FUSION_UI_GROUPS.filter(group =>
      allFusionSkillsInGroup(group)
        .map(skill => getSkill(skill.id) || skill)
        .some(skill => isGmMode() || isSkillVisible(character, skill))
    )
    if (visible.length) return visible
    return isGmMode() ? [...FUSION_UI_GROUPS] : []
  }
  const official = isGmMode()
    ? subcategoriesFor(category, character)
    : subcategoriesFor(category, character).filter(sub =>
      skillsInSubcategory(category, sub, character).length > 0
    )
  const extra = homebrewSubcategoriesForCategory(category).filter(sub => !official.includes(sub))
  let merged = [...official, ...extra]
  if (category === 'racial') {
    const homebrewRaceIds = listHomebrewRaces().map(race => race.id)
    if (isGmMode()) merged = [...new Set([...merged, ...homebrewRaceIds])]
    else if (character?.race && getRace(character.race)?.source === 'homebrew') {
      merged = [...new Set([...merged, character.race])]
    }
  }
  if (isGmMode()) {
    if (merged.length) return merged
    if (category === 'racial') {
      return [...new Set([...homebrewSubcategoriesForCategory(category), ...listHomebrewRaces().map(race => race.id)])]
    }
    return homebrewSubcategoriesForCategory(category)
  }
  return merged.filter(sub => {
    if (category === 'racial' && character?.race === sub && getRace(sub)?.source === 'homebrew') return true
    return skillsInSubcategory(category, sub, character).length > 0
  })
}

export function visibleSkillCategories(character = activeCharacter()) {
  const hasHomebrewInCategory = category =>
    listHomebrewSkills().some(skill => skill.category === category)

  const allowed = category =>
    !isSkillCategoryHidden(category) &&
    categoryAllowed(character, category) &&
    (isGmMode() || visibleSubcategories(category, character).length > 0 || hasHomebrewInCategory(category))

  if (isGmMode()) {
    return Object.keys(getSkillsData()).filter(category => !isSkillCategoryHidden(category))
  }
  return Object.keys(getSkillsData()).filter(allowed)
}

export function displaySubcategory(subcategory) {
  return SKILL_SUBCATEGORY_LABELS[subcategory] || getRace(subcategory)?.name || titleCase(subcategory)
}

export function fusionVisibleSkillsForGroup(group, character = activeCharacter()) {
  return allFusionSkillsInGroup(group)
    .map(skill => getSkill(skill.id) || skill)
    .filter(skill => isGmMode() || isSkillVisible(character, skill))
}

export function syncFusionFilters(character = activeCharacter()) {
  if (state.skillCategory !== 'fusion') return
  applyFusionNavigationState(state)
  const group = state.skillSubcategory
  const visible = fusionVisibleSkillsForGroup(group, character)
  const available = availableFusionFilters(group, visible)
  state.skillFusionFilters = pruneFusionFilters(state.skillFusionFilters, available)
}

export function fusionFilterOptions(group, character = activeCharacter()) {
  const visible = fusionVisibleSkillsForGroup(group, character)
  return availableFusionFilters(group, visible)
}

export function isToggleSkill(skill) {
  return skill?.isToggle || Object.prototype.hasOwnProperty.call(cache.toggleBonuses, skill?.id)
}

export function minLevelToLearnSkill(skill) {
  skill = resolvedHomebrewSkill(skill)
  const tier = Number(skill?.tier || 1)
  const capstoneGate = capstoneTierMinLevel(skill)
  const tierGate = capstoneGate ?? TIER_MIN_LEVEL[tier] ?? 1
  const explicit = skill?.prerequisites?.type === 'LEVEL' ? Number(skill.prerequisites.level || 0) : 0
  if (isHomebrewSkill(skill)) {
    const homebrewLock = Number(skill.lockMinLevel || 0)
    if (homebrewLock > 0) return Math.max(homebrewLock, explicit)
    return Math.max(tierGate, explicit)
  }
  return Math.max(tierGate, explicit)
}

function countLearnedTier5MagicSkills(character) {
  return character.skills.filter(id => {
    const learned = getSkill(id)
    return learned?.category === 'magic' && Number(learned.tier) === 5
  }).length
}

function formatPrerequisiteReq(req) {
  if (!req || req.type === 'NONE' || req.type === 'LEVEL') return ''
  if (req.type === 'OR_WEAPON_MASTERY_AND_DARKNESS') {
    const weaponIds = (req.skills || []).filter(id => id !== 'darkness_mastery')
    const weaponLabels = weaponIds.map(id => getSkill(id)?.name || titleCase(id))
    return `Darkness Mastery + one weapon mastery (${weaponLabels.join(' / ')})`
  }
  if (req.type === 'ALL_LIGHT_MAGIC') {
    const labels = (req.skills || []).map(id => getSkill(id)?.name || titleCase(id))
    return `All listed Light skills: ${labels.join(' + ')}`
  }
  if (req.type === 'THREE_TIER5_MAGIC') {
    return 'Any 3 Tier 5 magic capstones learned'
  }
  if (req.skills?.length) {
    const labels = req.skills.map(id => getSkill(id)?.name || titleCase(id))
    return `${req.type}: ${labels.join(req.type === 'AND' ? ' + ' : ' / ')}`
  }
  if (req.anyOfSkills?.length) {
    const labels = req.anyOfSkills.map(id => getSkill(id)?.name || titleCase(id))
    return `One of: ${labels.join(' / ')}`
  }
  return titleCase(req.type.replace(/_/g, ' '))
}

function evaluatePrerequisiteReq(character, req) {
  if (!req || req.type === 'NONE') return true
  if (req.type === 'LEVEL') {
    return characterLevelInfo(character).level >= Number(req.level || 0)
  }
  if (req.anyOfSkills?.length) {
    if (!req.anyOfSkills.some(id => character.skills.includes(id))) return false
  }
  if (req.type === 'OR_WEAPON_MASTERY_AND_DARKNESS') {
    const weaponIds = (req.skills || []).filter(id => id !== 'darkness_mastery')
    return character.skills.includes('darkness_mastery') && weaponIds.some(id => character.skills.includes(id))
  }
  if (req.type === 'ALL_LIGHT_MAGIC') {
    return (req.skills || []).length > 0 && (req.skills || []).every(id => character.skills.includes(id))
  }
  if (req.type === 'THREE_TIER5_MAGIC') {
    return countLearnedTier5MagicSkills(character) >= 3
  }
  if (!req.skills?.length) return req.type !== 'AND' && req.type !== 'OR'
  if (req.type === 'AND') return req.skills.every(id => character.skills.includes(id))
  if (req.type === 'OR') return req.skills.some(id => character.skills.includes(id))
  return false
}

export function prereqLabel(skill) {
  if (isHomebrewSkill(skill)) {
    skill = resolvedHomebrewSkill(skill)
    const parts = [`Level ${minLevelToLearnSkill(skill)}+`]
    const extras = homebrewSkillLockSummary(skill, { skipLevel: true })
    if (extras) parts.push(extras)
    return parts.join(' · ')
  }
  const parts = [`Level ${minLevelToLearnSkill(skill)}+`]
  const req = skill?.prerequisites
  const main = formatPrerequisiteReq(req)
  if (main) parts.push(main)
  const alt = formatPrerequisiteReq(skill?.alternativePrerequisite)
  if (alt) parts.push(`Or: ${alt}`)
  if (!main && (!req || req.type === 'NONE' || req.type === 'LEVEL') && !alt) return parts[0]
  return parts.join(' · ')
}

export function hasPrerequisites(character, skill) {
  skill = resolvedHomebrewSkill(skill)
  if (isHomebrewSkill(skill) && skill.lockSkills?.length) {
    if (!skill.lockSkills.every(id => character.skills.includes(id))) return false
  }
  const req = skill?.prerequisites
  if (!req && !skill?.alternativePrerequisite) return true
  if (evaluatePrerequisiteReq(character, req)) return true
  if (skill?.alternativePrerequisite) {
    return evaluatePrerequisiteReq(character, skill.alternativePrerequisite)
  }
  return false
}

export function incompatibilityReason(character, skill) {
  const conflicts = cache.incompatibilities[skill.id] || []
  const found = conflicts.find(id => character.skills.includes(id))
  if (!found) return ''
  return `Conflicts with ${getSkill(found)?.name || titleCase(found)}`
}

export function canLearnSkill(character, skill) {
  if (!character || !skill) return { ok: false, reason: 'No character selected' }
  skill = resolvedHomebrewSkill(skill)
  if (character.skills.includes(skill.id)) return { ok: false, reason: 'Already learned' }
  if (isGmMode()) return { ok: true, reason: 'GM Mode — free' }
  if (character.race === 'human' && isHumanCrossCulturalSkill(character, skill)) {
    if (!humanHasCrossCultural(character)) {
      return { ok: false, reason: 'Learn Human Determination first' }
    }
    if (Number(skill.tier || 1) > 1) {
      return { ok: false, reason: 'Humans can only learn Tier 1 skills from other races' }
    }
  }
  if (character.race === 'human' && isMonsterRacialSkill(skill)) {
    if (!humanHasCrossCultural(character)) {
      return { ok: false, reason: 'Learn Human Determination first' }
    }
    if (Number(skill.tier || 1) > 1) {
      return { ok: false, reason: 'Humans can only learn Tier 1 monster skills' }
    }
  }
  if (!raceAllowed(character, skill)) {
    if (isHomebrewSkill(skill) && skill.lockRaces?.length) {
      const labels = skill.lockRaces.map(id => getRace(id)?.name || titleCase(id))
      return { ok: false, reason: `Requires race: ${labels.join(' or ')}` }
    }
    return { ok: false, reason: 'Wrong race' }
  }
  const needLevel = minLevelToLearnSkill(skill)
  if (characterLevelInfo(character).level < needLevel) {
    return {
      ok: false,
      reason: isHomebrewSkill(skill)
        ? `Requires level ${needLevel}`
        : `Requires level ${needLevel} (Tier ${skill.tier || 1})`
    }
  }
  if (!hasPrerequisites(character, skill)) {
    const req = skill?.prerequisites
    if (req?.type === 'LEVEL') return { ok: false, reason: `Requires level ${req.level}` }
    if (isHomebrewSkill(skill) && skill.lockSkills?.length) {
      const labels = skill.lockSkills.map(id => getSkill(id)?.name || id)
      return { ok: false, reason: `Requires: ${labels.join(' + ')}` }
    }
    const label = prereqLabel(skill)
    return { ok: false, reason: label !== `Level ${minLevelToLearnSkill(skill)}+` ? `Requires ${label}` : 'Missing prerequisite' }
  }
  const conflict = incompatibilityReason(character, skill)
  if (conflict) return { ok: false, reason: conflict }
  if (character.lumens < skill.cost) return { ok: false, reason: 'Not enough lumens' }
  return { ok: true, reason: 'Ready' }
}

export function humanMonsterSkillIds(character) {
  if (!character?.skills?.length) return []
  return character.skills.filter(id => {
    const skill = getSkill(id)
    return skill && isMonsterRacialSkill(skill)
  })
}

export function humanCrossCulturalSkillIds(character) {
  if (!character?.skills?.length) return []
  return character.skills.filter(id => {
    const skill = getSkill(id)
    return skill && isHumanCrossCulturalSkill(character, skill)
  })
}

export function dependentUnlockedSkills(character, skillId) {
  return character.skills
    .map(id => getSkill(id))
    .filter(Boolean)
    .filter(skill => (skill.prerequisites?.skills || []).includes(skillId))
}

export function skillProgress(character) {
  const all = flattenSkills().filter(skill => raceAllowed(character, skill) && isSkillVisible(character, skill))
  const learned = character?.skills?.filter(id => {
    const skill = getSkill(id)
    return skill && raceAllowed(character, skill)
  }).length || 0
  const visible = all.length
  return { learned, total: visible, pct: visible ? Math.round((learned / visible) * 100) : 0 }
}

export { displayCategory, flattenSkills, getSkill }
