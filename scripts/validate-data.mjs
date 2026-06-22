import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { resolveActivationEffectsForSkill } from './lib/resolve-activation-effects.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')
const jsonDir = path.join(root, 'data', 'json')
const errors = []

function readJson(name) {
  const file = path.join(jsonDir, `${name}.json`)
  if (!fs.existsSync(file)) {
    errors.push(`Missing generated data file: ${name}.json`)
    return {}
  }
  return JSON.parse(fs.readFileSync(file, 'utf8'))
}

function walkSkills(value, pathParts = [], out = []) {
  if (Array.isArray(value)) {
    value.forEach((skill, index) => {
      if (skill && typeof skill === 'object') out.push({ skill, path: [...pathParts, index].join('/') })
    })
    return out
  }
  if (value && typeof value === 'object') {
    for (const [key, child] of Object.entries(value)) walkSkills(child, [...pathParts, key], out)
  }
  return out
}

function walkItems(value, pathParts = [], out = []) {
  if (Array.isArray(value)) {
    value.forEach((child, index) => walkItems(child, [...pathParts, index], out))
    return out
  }
  if (value && typeof value === 'object') {
    if (value.id && value.name) out.push({ item: value, path: pathParts.join('/') })
    for (const [key, child] of Object.entries(value)) {
      if (child && typeof child === 'object') walkItems(child, [...pathParts, key], out)
    }
  }
  return out
}

function findDuplicates(rows, idGetter, label) {
  const byId = new Map()
  for (const row of rows) {
    const id = idGetter(row)
    if (!id) continue
    if (!byId.has(id)) byId.set(id, [])
    byId.get(id).push(row)
  }
  for (const [id, entries] of byId.entries()) {
    if (entries.length > 1) errors.push(`Duplicate ${label} id "${id}": ${entries.map(row => row.path).join(', ')}`)
  }
  return byId
}

function iconLooksCorrupt(icon) {
  return typeof icon === 'string' && /[ÃÂâð�\uFFFD]/.test(icon)
}

const effects = readJson('effects')
const skills = readJson('skills')
const items = readJson('items')
const professionItems = readJson('profession-items')
const discoverableItems = readJson('discoverable-items')
const monsterLoot = readJson('monster-loot')
const meta = readJson('skill-meta')

const skillRows = walkSkills(skills)
const skillById = findDuplicates(skillRows, row => row.skill.id, 'skill')
const skillIds = new Set(skillRows.map(row => row.skill.id).filter(Boolean))

for (const { skill, path: skillPath } of skillRows) {
  if (!skill.id) errors.push(`Skill missing id at ${skillPath}`)
  const prereqIds = skill.prerequisites?.skills || []
  for (const prereq of prereqIds) {
    if (!skillIds.has(prereq)) errors.push(`Skill "${skill.id}" has missing prerequisite "${prereq}" at ${skillPath}`)
  }
  if (iconLooksCorrupt(skill.icon)) errors.push(`Skill "${skill.id}" has corrupt icon at ${skillPath}`)

  const expectedActivation = resolveActivationEffectsForSkill(skill, effects, {
    careerActionBuffs: meta.CAREER_ACTION_BUFFS || {}
  })
  if (expectedActivation.length) {
    if (!Array.isArray(skill.activationEffects) || !skill.activationEffects.length) {
      errors.push(`Skill "${skill.id}" applies status but missing activationEffects at ${skillPath}`)
    } else {
      for (const row of skill.activationEffects) {
        if (!row?.effectId || !effects[row.effectId]) {
          errors.push(`Skill "${skill.id}" has invalid activationEffects.effectId "${row?.effectId}" at ${skillPath}`)
        }
        if (!Number.isFinite(Number(row.duration))) {
          errors.push(`Skill "${skill.id}" activationEffects missing duration at ${skillPath}`)
        }
        if (!Number.isFinite(Number(row.potency))) {
          errors.push(`Skill "${skill.id}" activationEffects missing potency at ${skillPath}`)
        }
      }
    }
  }
}

const itemRows = [
  ...walkItems(items, ['items']),
  ...walkItems(professionItems, ['profession-items']),
  ...walkItems(discoverableItems, ['discoverable-items']),
  ...walkItems(monsterLoot, ['monster-loot'])
]
findDuplicates(itemRows, row => row.item.id, 'item')
const itemIds = new Set(itemRows.map(row => row.item.id).filter(Boolean))

for (const { item, path: itemPath } of itemRows) {
  if (!item.id) errors.push(`Item missing id at ${itemPath}`)
  if (iconLooksCorrupt(item.icon)) errors.push(`Item "${item.id}" has corrupt icon at ${itemPath}`)

  const materialLists = [item.materials || [], item.craftingRecipe?.materials || []]
  for (const materials of materialLists) {
    for (const material of materials) {
      const materialId = material.id || material.item
      if (!itemIds.has(materialId)) errors.push(`Recipe/item "${item.id}" needs missing material "${materialId}" at ${itemPath}`)
    }
  }

  for (const requiredSkill of item.requiredSkills || []) {
    if (!skillIds.has(requiredSkill)) errors.push(`Recipe/item "${item.id}" needs missing skill "${requiredSkill}" at ${itemPath}`)
  }
}

const metaSections = [
  'TOGGLE_BONUSES',
  'PASSIVE_SKILL_BONUSES',
  'PASSIVE_SKILL_EFFECTS',
  'EQUIPMENT_SKILL_EFFECTS',
  'TOGGLE_SKILL_EFFECTS',
  'INCOMPATIBILITIES',
  'ARMOUR_SKILL_EFFECTS',
  'CONDITIONAL_SKILL_STATS',
  'CAREER_DAMAGE_BONUSES',
  'CAREER_HEAL_BONUSES',
  'CAREER_ACTION_BUFFS',
  'CAREER_STAMINA_DISCOUNTS'
]

for (const section of metaSections) {
  for (const key of Object.keys(meta[section] || {})) {
    if (!skillIds.has(key)) errors.push(`skill-meta.${section} has missing skill key "${key}"`)
  }
}

for (const [key, list] of Object.entries(meta.INCOMPATIBILITIES || {})) {
  for (const linkedId of list || []) {
    if (!skillIds.has(linkedId)) errors.push(`skill-meta.INCOMPATIBILITIES links "${key}" to missing skill "${linkedId}"`)
  }
}

if (errors.length) {
  console.error(`Data validation failed with ${errors.length} issue(s):`)
  for (const error of errors) console.error(`- ${error}`)
  process.exit(1)
}

console.log(`Data validation passed: ${skillRows.length} skills, ${itemRows.length} items/materials, no broken references.`)
