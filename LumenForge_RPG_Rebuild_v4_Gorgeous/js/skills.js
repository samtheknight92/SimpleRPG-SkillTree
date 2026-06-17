import { getSkillsData } from './data.js'
import { HIDDEN_SKILL_CATEGORIES } from './constants.js'
import { cache, flattenSkills, getSkill, displayCategory } from './cache.js'
import { activeCharacter } from './state.js'
import { isGmMode } from './gm-mode.js'
import { titleCase } from './utils.js'
import { characterLevelInfo } from './level.js'

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
  return {}
}

export function subcategoriesFor(category, character = activeCharacter()) {
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

export function isSkillVisible(character, skill) {
  if (!skill || !character) return false
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
  if (character.skills.includes(skill.id)) return true
  return hasPrerequisites(character, skill)
}

export function skillsInSubcategory(category, subcategory, character = activeCharacter()) {
  const tree = categoryTreeData(category, character)
  const list = listForSubcategory(tree, subcategory)
  if (!Array.isArray(list)) return []
  return list
    .map(skill => getSkill(skill.id) || { ...skill, category, subcategory })
    .filter(skill => isGmMode() || isSkillVisible(character, skill))
}

export function visibleSubcategories(category, character = activeCharacter()) {
  if (!categoryAllowed(character, category)) return []
  if (isGmMode()) return subcategoriesFor(category, character)
  return subcategoriesFor(category, character).filter(sub =>
    skillsInSubcategory(category, sub, character).length > 0
  )
}

export function visibleSkillCategories(character = activeCharacter()) {
  const allowed = category =>
    !isSkillCategoryHidden(category) &&
    categoryAllowed(character, category) &&
    (isGmMode() || visibleSubcategories(category, character).length > 0)

  if (isGmMode()) {
    return Object.keys(getSkillsData()).filter(category => !isSkillCategoryHidden(category))
  }
  return Object.keys(getSkillsData()).filter(allowed)
}

export function isToggleSkill(skill) {
  return skill?.isToggle || Object.prototype.hasOwnProperty.call(cache.toggleBonuses, skill?.id)
}

export function prereqLabel(skill) {
  const req = skill?.prerequisites
  if (req?.type === 'LEVEL') return `Level ${req.level}+`
  if (!req || req.type === 'NONE' || !req.skills?.length) return 'No prerequisite'
  const labels = req.skills.map(id => getSkill(id)?.name || titleCase(id))
  return `${req.type}: ${labels.join(req.type === 'AND' ? ' + ' : ' / ')}`
}

export function hasPrerequisites(character, skill) {
  const req = skill?.prerequisites
  if (!req || req.type === 'NONE') return true
  if (req.type === 'LEVEL') {
    return characterLevelInfo(character).level >= Number(req.level || 0)
  }
  if (!req.skills?.length) return true
  if (req.type === 'AND') return req.skills.every(id => character.skills.includes(id))
  if (req.type === 'OR') return req.skills.some(id => character.skills.includes(id))
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
  if (!raceAllowed(character, skill)) return { ok: false, reason: 'Wrong race' }
  if (!hasPrerequisites(character, skill)) {
    const req = skill?.prerequisites
    if (req?.type === 'LEVEL') return { ok: false, reason: `Requires level ${req.level}` }
    return { ok: false, reason: 'Missing prerequisite' }
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
