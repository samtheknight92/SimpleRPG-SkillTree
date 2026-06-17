import { titleCase } from './utils.js'
import { DEFAULT_STATS } from './constants.js'
import { isGmMode } from './gm-mode.js'
import {
  formatStatModifiers,
  formatElementalAffinities,
  formatCraftingRecipe,
  formatCurrency,
  itemPriceGil,
  sentenceList
} from './format.js'
import { effectDetailLines, resolveSkillEffects } from './effects.js'
import { resolveActivationEffects } from './skill-activation.js'
import { displayCategory, getSkill, isToggleSkill, prereqLabel } from './skills.js'
import { cache } from './cache.js'
import { itemCompareLines } from './item-compare.js'
import { craftedByLabel } from './craft-bonuses.js'

export function itemTooltip(item, character = null, entry = null) {
  if (!item) return ''
  const lines = [
    item.name,
    `${titleCase(item.rarity || 'common')} ${titleCase(item.type || 'item')} · ${titleCase(item.source || 'shop')}`
  ]
  if (entry) {
    const crafted = craftedByLabel(entry, character)
    if (crafted) lines.push(crafted)
  }
  if (item.desc) lines.push('', item.desc)
  if (item.damage) lines.push(`Damage: ${item.damage}`)
  lines.push(`Stats: ${formatStatModifiers(item.statModifiers)}`)
  if (item.specialEffects?.length) {
    lines.push('', `Special: ${sentenceList(item.specialEffects)}`)
    lines.push(...effectDetailLines(item.specialEffects))
  }
  if (Number(item.enchantmentSlots || 0)) lines.push(`Enchantment Slots: ${item.enchantmentSlots} (enchant UI planned)`)
  if (item.price || item.value) lines.push(`Price/Value: ${formatCurrency(itemPriceGil(item))}`)
  const elements = formatElementalAffinities(item.elementalAffinities)
  if (elements) lines.push(elements)
  const recipe = formatCraftingRecipe(item.craftingRecipe)
  if (recipe) lines.push(recipe)
  if (character) lines.push(...itemCompareLines(item, character))
  return lines.filter(line => line !== undefined && line !== null).join('\n')
}

export function statTooltip(rule, { includeCost = false } = {}) {
  if (!rule) return ''
  const lines = [rule.label]
  if (includeCost) lines.push(`${rule.cost} Lumens / point`)
  if (rule.desc) lines.push('', rule.desc)
  return lines.join('\n')
}

export function statUpgradeTooltip(statKey, rule, character) {
  if (!rule || !character) return ''
  const current = Number(character.stats?.[statKey] ?? 0)
  const lines = [
    `Upgrade ${rule.label}`,
    isGmMode() ? 'Cost: Free (GM Mode)' : `Cost: ${rule.cost} Lumens`,
    `Current: ${current} (max ${rule.max})`
  ]
  if (current >= rule.max) lines.push('', 'Already at maximum.')
  else if (!isGmMode() && character.lumens < rule.cost) {
    lines.push('', `Not enough Lumens — you have ${character.lumens}, need ${rule.cost}.`)
  } else {
    lines.push('', `Adds +1 ${rule.label}. You have ${character.lumens} Lumens.`)
  }
  return lines.join('\n')
}

export function statRefundTooltip(statKey, rule, character) {
  if (!rule || !character) return ''
  const current = Number(character.stats?.[statKey] ?? 0)
  const base = Number(DEFAULT_STATS[statKey] ?? 0)
  const lines = [
    `Refund ${rule.label}`,
    `Returns: ${rule.cost} Lumens`,
    `Current: ${current} (base ${base})`
  ]
  if (current <= base) lines.push('', 'Already at starting value — nothing to refund.')
  else lines.push('', `Removes 1 purchased point and refunds ${rule.cost} Lumens.`)
  return lines.join('\n')
}

export function skillTooltip(skill) {
  if (!skill) return ''
  const lines = [
    skill.name,
    `${displayCategory(skill.category)} / ${titleCase(skill.subcategory)} · Tier ${skill.tier || 1}`,
    `Cost: ${skill.cost || 0} Lumens · Stamina: ${Number(skill.staminaCost || 0)}`
  ]
  if (skill.desc) lines.push('', skill.desc)

  const activations = resolveActivationEffects(skill)
  if (activations.length) {
    lines.push('', 'On use (tier-based proc chance):')
    lines.push(...activations.map(entry => {
      const effect = cache.effectDefinitions[entry.effectId]
      const label = effect?.name || entry.effectId
      const chance = entry.chance < 1 ? ` · ${Math.round(entry.chance * 100)}% chance` : ''
      return `• ${label} (${entry.duration} turn${entry.duration === 1 ? '' : 's'})${chance}`
    }))
  }

  const ongoing = resolveSkillEffects(skill)
  if (ongoing.length) {
    lines.push('', 'Ongoing / passive links:')
    lines.push(...effectDetailLines(ongoing))
  }
  lines.push(`Prerequisite: ${prereqLabel(skill)}`)
  const conflicts = cache.incompatibilities[skill.id] || []
  if (conflicts.length) lines.push(`Conflicts: ${conflicts.map(id => getSkill(id)?.name || titleCase(id)).join(', ')}`)
  if (isToggleSkill(skill)) lines.push('Type: Toggle / active skill')
  if (skill.elementalType) lines.push(`Element: ${titleCase(skill.elementalType)}`)
  if (skill.lootType) lines.push(`Loot Type: ${titleCase(skill.lootType)}`)
  if (skill.fusionType) lines.push(`Fusion Type: ${titleCase(skill.fusionType)}`)
  return lines.join('\n')
}
