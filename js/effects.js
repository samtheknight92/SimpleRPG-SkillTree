import { cache, getRace, getSkill, getItem } from './cache.js'
import { getEffect, normalizeEffectId, normalizeStatusEffect, invalidateCharacterCache, computeStats } from './character.js'
import { characterWieldsWeaponKind } from './equipment.js'
import { resolveSkillGearEffects } from './skill-effects.js'
import {
  entryEnchantments,
  enchantmentSpecialEffectsForEntry
} from './enchantments.js'
import { isToggleSkill } from './skills.js'
import { titleCase } from './utils.js'
import { formatStatModifiers } from './format.js'
import { formatPerformanceMeta } from './instruments.js'
import { activeMaxStatRewards, maxStatRewardSourceLabel } from './max-stat-rewards.js'

export function effectList() {
  return Object.values(cache.effectDefinitions).sort((a, b) => a.name.localeCompare(b.name))
}

/** Effects the GM can apply from the Character tab dropdown. */
export function manualEffectList() {
  const manual = effectList().filter(effect => effect.manual)
  return manual.length ? manual : effectList()
}

/** Duration stored on applied status while a skill/gear/toggle source is active. */
export const SOURCE_PASSIVE_DURATION = 999

export function effectDurationLabel(duration) {
  const value = Number(duration)
  if (!Number.isFinite(value)) return 'Default'
  if (value >= SOURCE_PASSIVE_DURATION) return '∞'
  if (value === 0) return 'Instant / passive'
  return `${value} turn${value === 1 ? '' : 's'}`
}

/** Whether potency is meaningful for ticks (DoT/HoT/regen), not resistances or stat auras. */
export function effectUsesPotency(effect) {
  if (!effect) return false
  const type = String(effect.type || '').toLowerCase()
  if (type.includes('damageovertime') || type.includes('healovertime')) return true
  if (Number(effect.tickDamage) > 0 || Number(effect.tickHeal) > 0 || Number(effect.tickStamina) > 0) return true
  const potency = effect.potency
  if (typeof potency === 'number' && potency !== 0) return true
  return false
}

export function effectPotencyLabel(effect, potency) {
  const value = potency ?? effect?.potency
  if (value === 'escalating') return 'Escalating'
  const num = Number(value)
  if (!Number.isFinite(num) || num === 0) return ''
  return String(num)
}

export function effectTypeLabel(type) {
  return titleCase(String(type || 'effect').replace(/([A-Z])/g, ' $1'))
}

export function effectTone(effect) {
  const type = String(effect?.type || '').toLowerCase()
  if (type.includes('buff') || type.includes('heal') || type.includes('recovery') || type.includes('protection')) return 'good'
  if (type.includes('damage') || type.includes('control') || type.includes('debuff')) return 'bad'
  if (type.includes('aura') || type.includes('utility')) return 'warn'
  return ''
}

export function effectDetailLines(effectIds) {
  return (effectIds || []).map(rawId => {
    const effect = getEffect(rawId)
    if (!effect) return titleCase(String(rawId).replace(/_/g, ' '))
    const mods = effect.statModifiers ? ` (${formatStatModifiers(effect.statModifiers)})` : ''
    return `${effect.icon || '✦'} ${effect.name}${mods}: ${effect.desc}`
  })
}

export function effectTooltip(effectId, source = '', status = null) {
  const effect = getEffect(effectId)
  if (!effect) return ''
  const isSourcePassive = status?.sourcePassive === true
  const duration = status?.duration ?? (isSourcePassive ? SOURCE_PASSIVE_DURATION : effect.duration)
  const lines = [
    effect.name,
    `${effectTypeLabel(effect.type)} · ${isSourcePassive ? 'While active: ∞' : effectDurationLabel(duration)}`
  ]
  const potencyText = effectPotencyLabel(effect, status?.potency)
  if (potencyText && (isSourcePassive ? effectUsesPotency(effect) : true)) {
    lines.push(`Potency: ${potencyText}`)
  }
  if (effect.desc) lines.push('', effect.desc)
  if (effect.statModifiers) lines.push(`Stat modifiers: ${formatStatModifiers(effect.statModifiers)}`)
  if (status?.performance) {
    const perfLine = formatPerformanceMeta(status.performance)
    if (perfLine) lines.push('', `Performance: ${perfLine}`)
    if (status.performance.performerCount > 1) {
      lines.push(`Table: you count as ${status.performance.performerCount} Musicians for per-musician song bonuses.`)
    }
    if (status.performance.listenerBonus > 0) {
      lines.push(`Table: allies listening get +${status.performance.listenerBonus} extra from your song.`)
    }
  }
  if (source) lines.push('', `Source: ${source}`)
  if (status?.notes) lines.push(`Notes: ${status.notes}`)
  return lines.join('\n')
}

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function phraseMatchesEffect(haystack, phrase) {
  if (!phrase || phrase.length < 3) return false
  const re = new RegExp(`(?:^|[^a-z0-9_])${escapeRegExp(phrase)}(?:[^a-z0-9_]|$)`)
  return re.test(haystack)
}

export function extractEffectIdsFromText(text) {
  const haystack = String(text || '').toLowerCase()
  const found = new Set()
  const sorted = [...effectList()].sort((a, b) => b.name.length - a.name.length)
  for (const effect of sorted) {
    const idPhrase = effect.id.toLowerCase().replace(/_/g, ' ')
    const name = effect.name.toLowerCase()
    if (phraseMatchesEffect(haystack, idPhrase) || phraseMatchesEffect(haystack, name)) found.add(effect.id)
  }
  return [...found]
}

const RACE_TRAIT_EFFECT_RULES = [
  [/poison\s+immunity/i, 'poison_immunity'],
  [/immune\s+to\s+(?:all\s+)?poison/i, 'poison_immunity'],
  [/immune\s+to\s+disease/i, 'disease_immunity'],
  [/immune\s+to\s+aging\s+and\s+disease/i, 'disease_immunity'],
  [/immune\s+to\s+fire(?:\s+damage)?/i, 'fire_immunity'],
  [/immune\s+to\s+charm/i, 'spell_warded'],
  [/immune\s+to\s+fear/i, 'spell_warded'],
  [/resistance\s+to\s+(?:chosen\s+)?element/i, 'fire_resistance']
]

/** Parse race passive traits — prefer immunities/resistances over debuff name matches. */
export function extractRaceEffectIdsFromTrait(trait) {
  const text = String(trait || '')
  const found = new Set()

  for (const [pattern, effectId] of RACE_TRAIT_EFFECT_RULES) {
    if (pattern.test(text) && getEffect(effectId)) found.add(effectId)
  }

  if (!found.size && !/immune\s+to|immunity|resistance/i.test(text)) {
    for (const id of extractEffectIdsFromText(text)) found.add(id)
  }

  return [...found]
}

export { resolveSkillEffects, resolveSkillGearEffects } from './skill-effects.js'

function recordEffect(map, effectId, source) {
  const effect = getEffect(effectId)
  if (!effect) return
  if (!map.has(effect.id)) map.set(effect.id, { effect, sources: [], duration: SOURCE_PASSIVE_DURATION, potency: effect.potency })
  const item = map.get(effect.id)
  if (source && !item.sources.includes(source)) item.sources.push(source)
}

export function characterEffectSources(character) {
  if (character?._cache?.effectSources) return character._cache.effectSources
  const map = new Map()
  if (!character) return []
  const race = getRace(character.race)
  for (const trait of race?.passiveTraits || []) {
    for (const id of extractRaceEffectIdsFromTrait(trait)) recordEffect(map, id, `Race: ${race.name}`)
  }
  for (const effectId of race?.specialEffects || []) {
    recordEffect(map, effectId, `Race: ${race.name}`)
  }
  for (const entryUid of Object.values(character.equipped || {})) {
    const entry = character.inventory.find(inv => inv.uid === entryUid)
    const item = entry && getItem(entry.itemId)
    for (const effectId of item?.specialEffects || []) recordEffect(map, effectId, `Equipped: ${item.name}`)
    for (const effectId of enchantmentSpecialEffectsForEntry(entry)) {
      recordEffect(map, effectId, `Enchant: ${item.name}`)
    }
  }
  for (const skillId of character.skills || []) {
    const skill = getSkill(skillId)
    if (!skill) continue
    if (skill.source === 'homebrew' && skill.specialEffects?.length) {
      for (const effectId of skill.specialEffects) {
        recordEffect(map, effectId, `Skill: ${skill.name}`)
      }
    }
    const gearEffects = resolveSkillGearEffects(skill, character)
    for (const effectId of gearEffects) {
      const equipRule = cache.equipmentSkillEffects[skillId]
      const armourRule = cache.armourSkillEffects?.[skillId]
      let source = `Skill: ${skill.name}`
      if (equipRule && characterWieldsWeaponKind(character, equipRule.weaponKind)) {
        source = `Skill: ${skill.name} (${equipRule.weaponKind} equipped)`
      } else if (armourRule) {
        source = `Skill: ${skill.name} (armour)`
      } else if (isToggleSkill(skill) && character.activeToggles?.includes(skillId)) {
        source = `Skill: ${skill.name} (active)`
      }
      recordEffect(map, effectId, source)
    }
    const flat = cache.passiveBonuses[skillId]
    if (flat && Object.keys(flat).length && !gearEffects.length) {
      const existing = getEffect(skillId)
      if (existing) {
        recordEffect(map, existing.id, `Skill: ${skill.name}`)
      } else {
        const virtualId = `__passive_${skillId}__`
        if (!map.has(virtualId)) {
          map.set(virtualId, {
            effect: {
              id: virtualId,
              name: skill.name,
              icon: skill.icon || '✦',
              type: 'passive',
              duration: SOURCE_PASSIVE_DURATION,
              potency: 0,
              desc: `Ongoing passive bonuses from ${skill.name}.`,
              statModifiers: flat
            },
            sources: [`Skill: ${skill.name}`],
            duration: SOURCE_PASSIVE_DURATION,
            potency: 0
          })
        }
      }
    }
  }
  for (const reward of activeMaxStatRewards(character)) {
    recordEffect(map, reward.id, maxStatRewardSourceLabel(reward.statKey))
  }
  const result = [...map.values()].sort((a, b) => effectTone(a.effect).localeCompare(effectTone(b.effect)) || a.effect.name.localeCompare(b.effect.name))
  if (character) {
    character._cache = character._cache || {}
    character._cache.effectSources = result
  }
  return result
}

/** Tick heal/stamina from Skill & Gear passives not already tracked as applied status effects. */
export function tickPassiveEffectSources(character) {
  if (!character) return { healed: 0, staminaRestored: 0, summary: '' }

  const activeIds = new Set((character.statusEffects || []).map(status => status.effectId))
  let healed = 0
  let staminaRestored = 0
  const stats = computeStats(character)

  for (const { effect } of characterEffectSources(character)) {
    if (activeIds.has(effect.id)) continue

    const potency = Number(effect.potency || 0)
    const tickHeal = Number(effect.tickHeal || (effect.type === 'healOverTime' ? (potency || 0) : 0))
    const tickStamina = Number(effect.tickStamina || (effect.id === 'mana_regeneration' || effect.id === 'mana_focus' || effect.id === 'stamina_regen' ? (potency || 1) : 0))

    if (tickHeal > 0) {
      const before = character.hp
      character.hp = Math.min(character.hp + tickHeal, stats.hp)
      healed += Math.max(0, character.hp - before)
    }
    if (tickStamina > 0) {
      const before = character.stamina
      character.stamina = Math.min(character.stamina + tickStamina, stats.stamina)
      staminaRestored += Math.max(0, character.stamina - before)
    }
  }

  if (healed || staminaRestored) invalidateCharacterCache(character)

  const parts = []
  if (healed) parts.push(`${healed} HP restored`)
  if (staminaRestored) parts.push(`${staminaRestored} Stamina restored`)
  return { healed, staminaRestored, summary: parts.join(', ') }
}

export function tickStatusEffects(character) {
  const statuses = Array.isArray(character.statusEffects) ? character.statusEffects : []
  if (!statuses.length) return { summary: '' }
  const kept = []
  let damage = 0
  let healed = 0
  let staminaRestored = 0
  let expired = 0
  for (const status of statuses) {
    const effect = getEffect(status.effectId)
    if (!effect) continue
    status.elapsed = Number(status.elapsed || 0) + 1
    const potency = Number.isFinite(Number(status.potency)) ? Number(status.potency) : Number(effect.potency || 0)
    let tickDamage = Number(effect.tickDamage || 0)
    if (effect.type === 'damageOverTime' && !tickDamage) tickDamage = effect.id === 'poison' ? Math.min(status.elapsed, 3) : Math.max(1, potency || 1)
    if (tickDamage > 0) {
      character.hp = Math.max(0, character.hp - tickDamage)
      damage += tickDamage
    }
    const tickHeal = Number(effect.tickHeal || (effect.type === 'healOverTime' ? (potency || 1) : 0))
    if (tickHeal > 0) {
      const before = character.hp
      character.hp += tickHeal
      healed += Math.max(0, character.hp - before)
    }
    const tickStamina = Number(effect.tickStamina || (effect.id === 'mana_regeneration' || effect.id === 'mana_focus' || effect.id === 'stamina_regen' ? (potency || 1) : 0))
    if (tickStamina > 0) {
      const before = character.stamina
      character.stamina += tickStamina
      staminaRestored += Math.max(0, character.stamina - before)
    }
    if (Number(status.duration) > 0 && Number(status.duration) < 999) status.duration = Number(status.duration) - 1
    if (Number(status.duration) === 0 && effect.duration !== 0) expired += 1
    else kept.push(status)
  }
  character.statusEffects = kept
  invalidateCharacterCache(character)
  const parts = []
  if (damage) parts.push(`${damage} HP lost`)
  if (healed) parts.push(`${healed} HP restored`)
  if (staminaRestored) parts.push(`${staminaRestored} Stamina restored`)
  if (expired) parts.push(`${expired} effect${expired === 1 ? '' : 's'} expired`)
  return { summary: parts.join(', ') }
}

export function addStatusEffectToCharacter(character, effectId, duration, potency, notes, extras = null) {
  const effect = getEffect(effectId)
  if (!character || !effect) return false
  const cleanDuration = duration === '' || duration === null || duration === undefined ? effect.duration : Number(duration)
  const cleanPotency = potency === '' || potency === null || potency === undefined ? effect.potency : Number(potency)
  if (!effect.stackable && character.statusEffects?.some(status => status.effectId === effect.id)) return false
  character.statusEffects = Array.isArray(character.statusEffects) ? character.statusEffects : []
  const row = {
    uid: `effect_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`,
    effectId: effect.id,
    duration: Number.isFinite(cleanDuration) ? cleanDuration : effect.duration,
    potency: Number.isFinite(cleanPotency) ? cleanPotency : effect.potency,
    notes
  }
  if (extras?.performance) row.performance = extras.performance
  character.statusEffects.push(normalizeStatusEffect(row))
  invalidateCharacterCache(character)
  return true
}

export { normalizeStatusEffect }
