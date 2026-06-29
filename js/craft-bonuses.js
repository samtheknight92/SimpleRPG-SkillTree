import { getSkill } from './cache.js'
import { titleCase } from './utils.js'

const HEAL_TYPES = new Set(['heal', 'healing', 'cure_poison', 'recovery'])

export function deriveCraftBonuses(character, recipe) {
  const bonuses = {}
  const skills = new Set(character?.skills || [])
  const type = String(recipe?.type || '').toLowerCase()
  const profession = String(recipe?.profession || '').toLowerCase()
  const effectType = String(recipe?.effect?.type || '').toLowerCase()

  if (skills.has('field_medic') && (type.includes('consumable') || type.includes('potion') || HEAL_TYPES.has(effectType))) {
    bonuses.healBonus = 2
  }
  if (skills.has('weaponwright') && (type.includes('weapon') || profession === 'blacksmith' || profession === 'smithing')) {
    if (recipe.statModifiers?.strength != null || recipe.damage || type.includes('weapon')) {
      bonuses.damageBonus = 1
    }
  }
  if (skills.has('armourer') && (type.includes('armor') || (profession === 'blacksmith' || profession === 'smithing') && type.includes('armor'))) {
    bonuses.physicalDefenceBonus = 1
    bonuses.magicalDefenceBonus = 1
  }
  if (skills.has('spice_box') && (profession === 'chef' || profession === 'cooking' || type.includes('food') || type.includes('meal'))) {
    bonuses.mealHealBonus = 1
  }
  if (skills.has('forge_blessing') && (type.includes('weapon') || type.includes('armor'))) {
    bonuses.enchantmentSlotBonus = (bonuses.enchantmentSlotBonus || 0) + 1
  }
  return bonuses
}

export function craftBonusSkillIds(character, recipe) {
  const skills = new Set(character?.skills || [])
  const ids = []
  if (skills.has('field_medic') && deriveCraftBonuses(character, recipe).healBonus) ids.push('field_medic')
  if (skills.has('weaponwright') && deriveCraftBonuses(character, recipe).damageBonus) ids.push('weaponwright')
  if (skills.has('armourer') && deriveCraftBonuses(character, recipe).physicalDefenceBonus) ids.push('armourer')
  if (skills.has('spice_box') && deriveCraftBonuses(character, recipe).mealHealBonus) ids.push('spice_box')
  return ids
}

export function formatCraftBonusLabel(bonuses = {}) {
  const parts = []
  if (bonuses.healBonus) parts.push(`+${bonuses.healBonus} HP`)
  if (bonuses.damageBonus) parts.push(`+${bonuses.damageBonus} damage`)
  if (bonuses.physicalDefenceBonus) parts.push(`+${bonuses.physicalDefenceBonus} PD`)
  if (bonuses.magicalDefenceBonus) parts.push(`+${bonuses.magicalDefenceBonus} MD`)
  if (bonuses.mealHealBonus) parts.push(`+${bonuses.mealHealBonus} meal heal`)
  if (bonuses.enchantmentSlotBonus) parts.push(`+${bonuses.enchantmentSlotBonus} enchant slot`)
  return parts.join(', ')
}

export function craftedByLabel(entry, viewerCharacter = null) {
  if (!entry?.craftedBy && !entry?.craftedByName) return ''
  const name = entry.craftedByName || 'Unknown'
  const self = viewerCharacter && entry.craftedBy === viewerCharacter.id
  const bonus = formatCraftBonusLabel(entry.craftBonuses)
  const skillNames = (entry.craftedWithSkills || [])
    .map(id => getSkill(id)?.name || titleCase(id))
    .filter(Boolean)
  const parts = [`Crafted by ${name}${self ? ' (you)' : ''}`]
  if (bonus) parts.push(bonus)
  else if (skillNames.length) parts.push(skillNames.join(', '))
  return parts.join(' · ')
}
