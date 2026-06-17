import { getGameData } from './data.js'
import { getItem } from './cache.js'
import { isGmMode } from './gm-mode.js'
import { titleCase } from './utils.js'
import { countInventoryItem, removeInventoryItems } from './items.js'
import { craftBonusSkillIds, deriveCraftBonuses } from './craft-bonuses.js'

export function listCraftRecipes() {
  const data = getGameData()['profession-items'] || {}
  return Object.entries(data).flatMap(([profession, items]) =>
    Object.values(items || {}).map(item => ({ ...item, profession }))
  ).sort((a, b) => String(a.name).localeCompare(String(b.name)))
}

export function craftProfessionOptions() {
  const professions = new Set(listCraftRecipes().map(recipe => recipe.profession).filter(Boolean))
  return ['all', ...[...professions].sort()]
}

export function characterHasRecipeSkills(character, recipe) {
  const required = recipe?.requiredSkills || []
  if (!required.length) return false
  return required.every(id => character?.skills?.includes(id))
}

export function countInventoryMaterial(character, itemId) {
  return countInventoryItem(character, itemId)
}

export function materialsStatus(character, recipe) {
  return (recipe?.materials || []).map(mat => {
    const id = mat.id || mat.item
    const need = Number(mat.quantity || mat.qty || 1)
    const have = countInventoryMaterial(character, id)
    const item = getItem(id)
    return {
      id,
      name: item?.name || titleCase(id),
      need,
      have,
      ok: have >= need
    }
  })
}

export function canCraftRecipe(character, recipe) {
  if (!character || !recipe) return { ok: false, reason: 'No recipe' }
  if (!characterHasRecipeSkills(character, recipe)) {
    return { ok: false, reason: 'Learn the required career skill first' }
  }
  if (isGmMode()) return { ok: true, reason: 'GM Mode — free craft' }
  const mats = materialsStatus(character, recipe)
  const missing = mats.filter(mat => !mat.ok)
  if (missing.length) {
    return {
      ok: false,
      reason: `Missing: ${missing.map(mat => `${mat.need - mat.have}× ${mat.name}`).join(', ')}`
    }
  }
  return { ok: true, reason: 'Ready to craft' }
}

export function deductMaterials(character, recipe) {
  if (!character || isGmMode()) return
  for (const mat of recipe.materials || []) {
    const id = mat.id || mat.item
    const need = Number(mat.quantity || mat.qty || 1)
    removeInventoryItems(character, id, need)
  }
}

export function buildCraftMetadata(character, recipe) {
  const craftBonuses = deriveCraftBonuses(character, recipe)
  const bonusSkills = craftBonusSkillIds(character, recipe)
  const craftedWithSkills = [...new Set([...(recipe.requiredSkills || []), ...bonusSkills])]
  return {
    craftedBy: character.id,
    craftedByName: character.name,
    craftedWithSkills,
    craftBonuses: Object.keys(craftBonuses).length ? craftBonuses : undefined
  }
}

export function filterCraftRecipes(character, { search = '', profession = 'all', learnedOnly = true } = {}) {
  const query = String(search || '').trim().toLowerCase()
  return listCraftRecipes().filter(recipe => {
    if (profession !== 'all' && recipe.profession !== profession) return false
    if (learnedOnly && !isGmMode() && !characterHasRecipeSkills(character, recipe)) return false
    if (!query) return true
    const haystack = [
      recipe.name,
      recipe.id,
      recipe.desc,
      recipe.profession,
      ...(recipe.requiredSkills || []),
      ...(recipe.materials || []).map(mat => mat.id)
    ].join(' ').toLowerCase()
    return haystack.includes(query)
  })
}
