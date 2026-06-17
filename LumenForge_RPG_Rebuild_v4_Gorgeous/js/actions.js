import { DEFAULT_STATS, STAT_RULES } from './constants.js'
import { state, activeCharacter } from './state.js'
import { save, saveNow } from './storage.js'
import { render } from './render.js'
import { toast, clamp, deepClone, uid, titleCase } from './utils.js'
import {
  createCharacter,
  normalizeCharacter,
  computeStats,
  invalidateCharacterCache,
  setRace as applyRace,
  setElementalAffinity as applyElementalAffinity,
  getEffect
} from './character.js'
import {
  getSkill,
  canLearnSkill,
  dependentUnlockedSkills,
  isToggleSkill,
  HUMAN_RACE_SKILL,
  humanCrossCulturalSkillIds,
  humanMonsterSkillIds
} from './skills.js'
import { getItem, addItemToInventory, addCraftedItemToInventory } from './items.js'
import { addStatusEffectToCharacter, tickStatusEffects, tickPassiveEffectSources } from './effects.js'
import {
  getSkillActivationType,
  resolveActivationEffects,
  rollSkillProc
} from './skill-activation.js'
import {
  BASIC_ATTACK_ID,
  getSkillUseBlockReason,
  isBasicAttackSkill,
  resolveBasicAttackDamage
} from './combat.js'
import { itemPriceGil, normalizeGil } from './format.js'
import { syncUrlState } from './url-state.js'
import { isGmMode, toggleGmMode as flipGmMode } from './gm-mode.js'
import { getPremadeCharacter } from './premade-characters.js'
import { allocateCharacterName } from './character-naming.js'
import { buildNpcTurnSuggestions } from './gm-npc-turn.js'
import { openPrintableCharacterSheet } from './export-sheet.js'
import {
  createInitiativeEntry,
  nextTurnEntryId,
  activeInitiativeEntry,
  sortInitiativeEntries
} from './gm-initiative.js'
import { getWeaponKind, getEquippedWeapon, equippedSlotForEntry } from './equipment.js'
import { canCraftRecipe, deductMaterials, buildCraftMetadata, listCraftRecipes } from './craft.js'
import { formatCraftBonusLabel } from './craft-bonuses.js'

function touch(character, partial = { header: true, sidebar: true, content: true, actionBar: true }) {
  if (character) invalidateCharacterCache(character)
  save()
  render(partial)
  syncUrlState()
}

export function createAndSelectCharacter(name, raceId, options = {}) {
  const character = createCharacter(name, raceId, options)
  state.characters.push(character)
  state.activeId = character.id
  touch(character)
  toast(`${character.name} created.`)
  return character
}

export function selectCharacter(id) {
  state.activeId = id
  touch(null, { sidebar: true, header: true, content: true, actionBar: true })
}

export function learnSkill(skillId) {
  const character = activeCharacter()
  const skill = getSkill(skillId)
  const check = canLearnSkill(character, skill)
  if (!character || !skill || !check.ok) return toast(check?.reason || 'Cannot learn that skill.')
  character.skills.push(skill.id)
  if (!isGmMode()) character.lumens -= skill.cost
  touch(character)
  toast(`${skill.name} learned${isGmMode() ? ' (GM Mode)' : ''}.`)
}

export function refundSkill(skillId) {
  const character = activeCharacter()
  const skill = getSkill(skillId)
  if (!character || !skill || !character.skills.includes(skill.id)) return
  const dependents = dependentUnlockedSkills(character, skill.id)
  if (dependents.length) return toast(`Refund blocked: ${dependents.map(s => s.name).join(', ')} depend on this skill.`)
  const stripCrossCultural = skill.id === HUMAN_RACE_SKILL && character.race === 'human'
    ? [...humanCrossCulturalSkillIds(character), ...humanMonsterSkillIds(character)]
    : []
  character.skills = character.skills.filter(id => id !== skill.id && !stripCrossCultural.includes(id))
  character.activeToggles = character.activeToggles.filter(id => id !== skill.id && !stripCrossCultural.includes(id))
  if (!isGmMode()) character.lumens += skill.cost
  const computed = computeStats(character)
  character.hp = clamp(character.hp, 0, computed.hp)
  character.stamina = clamp(character.stamina, 0, computed.stamina)
  touch(character)
  if (stripCrossCultural.length) {
    toast(`${skill.name} refunded. Removed ${stripCrossCultural.length} cross-cultural racial skill${stripCrossCultural.length === 1 ? '' : 's'}.`)
    return
  }
  toast(`${skill.name} refunded.`)
}

export function toggleSkill(skillId) {
  const character = activeCharacter()
  const skill = getSkill(skillId)
  if (!character || !skill || !character.skills.includes(skill.id) || !isToggleSkill(skill)) return
  const active = character.activeToggles.includes(skill.id)
  if (!active) {
    const blockReason = getSkillUseBlockReason(character, skill)
    if (blockReason) return toast(blockReason)
  }
  if (active) character.activeToggles = character.activeToggles.filter(id => id !== skill.id)
  else character.activeToggles.push(skill.id)
  const computed = computeStats(character)
  character.hp = clamp(character.hp, 0, computed.hp)
  character.stamina = clamp(character.stamina, 0, computed.stamina)
  touch(character)
  toast(`${skill.name} ${active ? 'deactivated' : 'activated'}.`)
}

export function useSkill(skillId) {
  const character = activeCharacter()
  if (skillId === BASIC_ATTACK_ID) return useBasicAttack()

  const skill = getSkill(skillId)
  if (!character || !skill || !character.skills.includes(skill.id)) return

  const type = getSkillActivationType(skill)
  if (type === 'toggle') return toggleSkill(skillId)
  if (type !== 'activatable') return toast(`${skill.name} is passive and cannot be used from the Action bar.`)

  const blockReason = getSkillUseBlockReason(character, skill)
  if (blockReason) return toast(blockReason)

  const cost = Math.max(0, Number(skill.staminaCost || 0))
  if (character.stamina < cost) {
    return toast(`Not enough Stamina for ${skill.name} (need ${cost}, have ${character.stamina}).`)
  }

  character.stamina -= cost
  const activations = resolveActivationEffects(skill)
  const applied = []
  const missed = []

  for (const payload of activations) {
    const effect = getEffect(payload.effectId)
    if (!effect) continue
    if (!rollSkillProc(payload.chance ?? 1)) {
      missed.push(effect.name)
      continue
    }
    const ok = addStatusEffectToCharacter(
      character,
      payload.effectId,
      payload.duration,
      undefined,
      `Used ${skill.name}`
    )
    if (ok) applied.push(`${effect.name} (${payload.duration} turn${payload.duration === 1 ? '' : 's'})`)
    else missed.push(`${effect.name} (already active)`)
  }

  touch(character, { header: true, content: true, actionBar: true })

  if (!activations.length) {
    toast(`${skill.name} used (−${cost} Stamina).`)
    return
  }
  if (applied.length && !missed.length) {
    toast(`${skill.name}: ${applied.join(', ')} (−${cost} Stamina).`)
    return
  }
  if (applied.length) {
    toast(`${skill.name}: ${applied.join(', ')}; ${missed.join(', ')} (−${cost} Stamina).`)
    return
  }
  toast(`${skill.name} failed to apply effects${missed.length ? `: ${missed.join(', ')}` : ''} (−${cost} Stamina).`)
}

export function processTurn() {
  const character = activeCharacter()
  if (!character) return
  character.movedThisTurn = false
  const stillActive = []
  let spent = 0
  const messages = []
  for (const skillId of character.activeToggles) {
    const skill = getSkill(skillId)
    const cost = Math.max(0, Number(skill?.staminaCost || 0))
    if (character.stamina >= cost) {
      character.stamina -= cost
      spent += cost
      stillActive.push(skillId)
    } else {
      messages.push(`${skill?.name || titleCase(skillId)} switched off: not enough Stamina.`)
    }
  }
  character.activeToggles = stillActive
  const effectTick = tickStatusEffects(character)
  const passiveTick = tickPassiveEffectSources(character)
  const stats = computeStats(character)
  character.hp = clamp(character.hp, 0, stats.hp)
  character.stamina = clamp(character.stamina, 0, stats.stamina)
  touch(character)
  const effectParts = [effectTick.summary, passiveTick.summary].filter(Boolean)
  const effectText = effectParts.length ? ` ${effectParts.join(', ')}.` : ''
  const toggleText = spent ? `${spent} Stamina spent.` : 'No toggle costs.'
  toast(`Processed turn. ${toggleText}${effectText}${messages.length ? ` ${messages[0]}` : ''}`)
}

export function addStatusEffect(effectId, duration, potency, notes) {
  const character = activeCharacter()
  const effect = getEffect(effectId)
  if (!character || !effect) return toast('Choose a valid effect first.')
  if (!addStatusEffectToCharacter(character, effectId, duration, potency, notes)) {
    return toast(`${effect.name} is already active and does not stack.`)
  }
  touch(character)
  toast(`${effect.name} added.`)
}

export function removeStatusEffect(effectUid) {
  const character = activeCharacter()
  if (!character) return
  character.statusEffects = (character.statusEffects || []).filter(status => status.uid !== effectUid)
  touch(character)
  toast('Effect removed.')
}

export function setRace(raceId) {
  const character = activeCharacter()
  if (!character) return
  applyRace(character, raceId)
  touch(character)
  toast(`Race updated.`)
}

export function setElementalAffinity(affinity) {
  const character = activeCharacter()
  if (!character) return
  applyElementalAffinity(character, affinity)
  touch(character)
  toast(character.elementalAffinity ? `Elemental affinity: ${titleCase(character.elementalAffinity)}.` : 'Elemental affinity cleared.')
}

export function buyItem(itemId, free = false) {
  const character = activeCharacter()
  const item = getItem(itemId)
  if (!character || !item) return
  const isFree = free || isGmMode()
  const price = itemPriceGil(item)
  const current = normalizeGil(character.gil)
  if (!isFree && price > current) return toast('Not enough Gil. Tragic little wallet noises.')
  if (!isFree) character.gil = current - price
  addItemToInventory(character, itemId, 1)
  touch(character)
  toast(`${item.name} ${isFree ? 'granted' : 'bought'}!`)
}

export function craftRecipe(recipeId) {
  const character = activeCharacter()
  const recipe = listCraftRecipes().find(row => row.id === recipeId)
  if (!character || !recipe) return toast('Unknown recipe.')
  const check = canCraftRecipe(character, recipe)
  if (!check.ok) return toast(check.reason)
  deductMaterials(character, recipe)
  const meta = buildCraftMetadata(character, recipe)
  addCraftedItemToInventory(character, recipe, meta)
  const bonus = formatCraftBonusLabel(meta.craftBonuses)
  touch(character)
  toast(bonus ? `${recipe.name} crafted (${bonus}).` : `${recipe.name} crafted.`)
}

export function removeInventoryEntry(entryUid) {
  const character = activeCharacter()
  if (!character) return
  for (const slot of Object.keys(character.equipped)) {
    if (character.equipped[slot] === entryUid) character.equipped[slot] = null
  }
  character.inventory = character.inventory.filter(entry => entry.uid !== entryUid)
  touch(character)
}

export function equipItem(entryUid, slot = null) {
  const character = activeCharacter()
  const entry = character?.inventory.find(i => i.uid === entryUid)
  const item = entry && getItem(entry.itemId)
  if (!character || !entry || !item) return

  const type = String(item.type || '').toLowerCase()
  const isOffhandEquip = slot === 'offhand'

  if (isOffhandEquip) {
    if (!character.skills.includes('dual_wield')) return toast('Learn Dual Wield to use an off-hand dagger.')
    if (getWeaponKind(item) !== 'dagger') return toast('Off-hand slot only accepts daggers.')
    if (getWeaponKind(getEquippedWeapon(character)) !== 'dagger') {
      return toast('Equip a dagger in your main hand before using the off-hand slot.')
    }
    const alreadyIn = equippedSlotForEntry(character, entry.uid)
    if (alreadyIn && alreadyIn !== 'offhand') {
      return toast(`${item.name} is already equipped (${titleCase(alreadyIn === 'offhand' ? 'off-hand' : alreadyIn)}).`)
    }
    character.equipped.offhand = entry.uid
    invalidateCharacterCache(character)
    touch(character)
    return toast(`${item.name} equipped (off-hand).`)
  }

  const equipSlot = type.includes('weapon')
    ? 'weapon'
    : type.includes('armor')
      ? 'armor'
      : type.includes('accessory')
        ? 'accessory'
        : null
  if (!equipSlot) return toast('That item is not equipment.')

  const alreadyIn = equippedSlotForEntry(character, entry.uid)
  if (alreadyIn && alreadyIn !== equipSlot) {
    return toast(`${item.name} is already equipped (${titleCase(alreadyIn === 'offhand' ? 'off-hand' : alreadyIn)}).`)
  }

  if (equipSlot === 'weapon' && getWeaponKind(item) !== 'dagger' && character.equipped.offhand) {
    character.equipped.offhand = null
  }
  character.equipped[equipSlot] = entry.uid
  if (equipSlot === 'weapon' && getWeaponKind(item) !== 'dagger') {
    character.equipped.offhand = null
  }
  invalidateCharacterCache(character)
  const computed = computeStats(character)
  character.hp = clamp(character.hp, 0, computed.hp)
  character.stamina = clamp(character.stamina, 0, computed.stamina)
  touch(character)
  toast(`${item.name} equipped.`)
}

export function useBasicAttack() {
  const character = activeCharacter()
  if (!character) return
  const blockReason = getSkillUseBlockReason(character, { id: BASIC_ATTACK_ID, subcategory: 'attack' })
  if (blockReason) return toast(blockReason)
  const { total, summary } = resolveBasicAttackDamage(character, rollDice)
  touch(character, { header: true, content: true, actionBar: true })
  toast(`Basic Attack: ${summary} (${total} damage).`)
}

export function markMoved() {
  const character = activeCharacter()
  if (!character) return
  character.movedThisTurn = true
  touch(character, { actionBar: true })
  toast('Movement marked — ranged attacks blocked this turn (Quick Draw bypasses this).')
}

export function unequip(slot) {
  const character = activeCharacter()
  if (!character) return
  character.equipped[slot] = null
  if (slot === 'weapon') character.equipped.offhand = null
  touch(character)
}

export function upgradeStat(stat) {
  const character = activeCharacter()
  const rule = STAT_RULES[stat]
  if (!character || !rule) return
  if (character.stats[stat] >= rule.max) return toast(`${rule.label} is already at its cap.`)
  if (!isGmMode() && character.lumens < rule.cost) return toast('Not enough lumens for that upgrade.')
  character.stats[stat] += 1
  if (!isGmMode()) character.lumens -= rule.cost
  if (stat === 'hp') character.hp += 1
  if (stat === 'stamina') character.stamina += 1
  touch(character)
}

export function refundStat(stat) {
  const character = activeCharacter()
  const rule = STAT_RULES[stat]
  if (!character || !rule) return
  if (character.stats[stat] <= DEFAULT_STATS[stat]) return toast(`${rule.label} is already at its starting value.`)
  character.stats[stat] -= 1
  if (!isGmMode()) character.lumens += rule.cost
  const computed = computeStats(character)
  character.hp = clamp(character.hp, 0, computed.hp)
  character.stamina = clamp(character.stamina, 0, computed.stamina)
  touch(character)
}

export function setResource(resource, value) {
  const character = activeCharacter()
  if (!character) return
  const stats = computeStats(character)
  const cleanValue = Math.floor(Number(value || 0))
  if (resource === 'hp') character.hp = clamp(cleanValue, 0, stats.hp)
  if (resource === 'stamina') character.stamina = clamp(cleanValue, 0, stats.stamina)
  if (resource === 'lumens') character.lumens = Math.max(0, cleanValue)
  touch(character, { header: true, content: true, actionBar: true })
}

export function adjustResource(resource, amount) {
  const character = activeCharacter()
  if (!character) return
  const current = resource === 'hp' ? character.hp : resource === 'stamina' ? character.stamina : character.lumens
  setResource(resource, current + Number(amount || 0))
}

export function fillResource(resource) {
  const character = activeCharacter()
  if (!character) return
  const stats = computeStats(character)
  if (resource === 'hp') setResource('hp', stats.hp)
  if (resource === 'stamina') setResource('stamina', stats.stamina)
}

export function adjustCurrency(amount) {
  const character = activeCharacter()
  if (!character) return
  character.gil = normalizeGil(character.gil) + Math.floor(Number(amount || 0))
  if (character.gil < 0) character.gil = 0
  touch(character, { header: true, content: true })
}

export function setGil(value) {
  const character = activeCharacter()
  if (!character) return
  character.gil = normalizeGil(value)
  touch(character, { header: true, content: true })
}

/** @deprecated Use setGil. */
export function setCurrencyPart(_part, value) {
  setGil(value)
}

export function heal(amount = 9999) {
  const character = activeCharacter()
  if (!character) return
  const stats = computeStats(character)
  character.hp = clamp(character.hp + amount, 0, stats.hp)
  touch(character, { header: true, content: true })
}

export function restoreStamina(amount = 9999) {
  const character = activeCharacter()
  if (!character) return
  const stats = computeStats(character)
  character.stamina = clamp(character.stamina + amount, 0, stats.stamina)
  touch(character, { header: true, content: true })
}

export function rollDice(count, sides, modifier = 0) {
  const rolls = Array.from({ length: count }, () => 1 + Math.floor(Math.random() * sides))
  return { rolls, total: rolls.reduce((sum, value) => sum + value, 0) + modifier }
}

export function duplicateCharacter(id) {
  const original = state.characters.find(character => character.id === id)
  if (!original) return
  const copy = normalizeCharacter(deepClone(original))
  copy.id = uid('char')
  copy.name = allocateCharacterName(original.name, state.characters.map(c => c.name))
  copy.premadeId = null
  copy.created = new Date().toISOString()
  state.characters.push(copy)
  state.activeId = copy.id
  touch(copy)
  toast(`${copy.name} added to roster.`)
}

export function deleteCharacter(id) {
  const character = state.characters.find(c => c.id === id)
  if (!character) return
  if (!confirm(`Delete ${character.name}? This cannot be undone.`)) return
  state.characters = state.characters.filter(c => c.id !== id)
  if (state.activeId === id) state.activeId = state.characters[0]?.id || null
  touch(null)
  toast('Character deleted.')
}

export function exportData(all = true) {
  const payload = all
    ? { version: 2, characters: state.characters.map(c => normalizeCharacter(deepClone(c))) }
    : { version: 2, characters: [normalizeCharacter(deepClone(activeCharacter()))].filter(Boolean) }
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = all ? 'lumenforge-save.json' : `${activeCharacter()?.name || 'character'}-lumenforge.json`.replace(/[^a-z0-9_.-]+/gi, '_')
  a.click()
  URL.revokeObjectURL(a.href)
}

export async function importData(file) {
  if (!file) return
  try {
    const raw = await file.text()
    const parsed = JSON.parse(raw)
    const imported = Array.isArray(parsed) ? parsed : parsed.characters
    if (!Array.isArray(imported)) throw new Error('No characters array')
    const normalized = imported.map(normalizeCharacter)
    const byId = new Map(state.characters.map(character => [character.id, character]))
    normalized.forEach(character => byId.set(character.id, character))
    state.characters = [...byId.values()]
    state.activeId = normalized[0]?.id || state.activeId
    saveNow()
    render({ all: true })
    syncUrlState()
    toast(`Imported ${normalized.length} character${normalized.length === 1 ? '' : 's'}.`)
  } catch (error) {
    console.error(error)
    toast('Import failed. That file does not look like a LumenForge save.')
  }
}

export function saveNotes(value, silent = false) {
  const character = activeCharacter()
  if (!character) return
  character.notes = value
  state.notesDirty = false
  save()
  if (!silent) toast('Notes saved.')
  else {
    const status = document.querySelector('#notes-status')
    if (status) {
      status.textContent = 'Saved'
      status.className = 'pill good'
    }
  }
}

export function renameCharacter(name) {
  const character = activeCharacter()
  if (!character) return
  character.name = name.trim() || character.name
  touch(character, { sidebar: true, header: true, content: true })
}

export function switchTab(tab) {
  if (tab === 'inventory') tab = 'shop'
  state.tab = tab
  render({ content: true, tabs: true })
  syncUrlState()
}

export function activateGmModeToggle() {
  const enabled = flipGmMode()
  for (const character of state.characters) invalidateCharacterCache(character)
  save()
  render({ all: true })
  toast(enabled
    ? 'GM Mode ON — all skills visible, no prerequisites, free skills & items.'
    : 'GM Mode OFF — normal rules restored.')
}

export function spawnPremadeCharacter(premadeId, count = 1) {
  if (!isGmMode()) return toast('Enable GM Mode to add premade characters.')
  const template = getPremadeCharacter(premadeId)
  if (!template) return toast('Unknown premade character.')

  const amount = Math.max(1, Math.min(10, Math.floor(Number(count) || 1)))
  const addedNames = []

  for (let i = 0; i < amount; i += 1) {
    const character = normalizeCharacter(deepClone(template))
    character.id = uid('char')
    character.name = allocateCharacterName(template.name, [
      ...state.characters.map(c => c.name),
      ...addedNames
    ])
    character.premadeId = null
    character.created = new Date().toISOString()
    character.updated = character.created
    state.characters.push(character)
    addedNames.push(character.name)
    state.activeId = character.id
  }

  touch(state.characters.find(c => c.id === state.activeId))
  toast(amount === 1
    ? `${addedNames[0]} added to roster.`
    : `Added ${amount}× ${template.name}: ${addedNames.join(', ')}.`)
}

export function generateNpcTurn() {
  const selectedIds = state.gmNpcTurnCharacterIds.filter(id =>
    state.characters.some(character => character.id === id)
  )
  const fallbackId = activeCharacter()?.id || state.characters[0]?.id
  const ids = selectedIds.length ? selectedIds : (fallbackId ? [fallbackId] : [])
  if (!ids.length) return toast('Add characters to the roster first.')

  const characters = ids.map(id => state.characters.find(c => c.id === id)).filter(Boolean)
  state.lastNpcTurns = buildNpcTurnSuggestions(characters)
  render({ content: true })
  toast(characters.length === 1
    ? `Turn suggestion for ${characters[0].name}.`
    : `Turn suggestions for ${characters.map(c => c.name).join(', ')}.`)
}

export function toggleGmTurnCharacter(characterId, checked) {
  const ids = new Set(state.gmNpcTurnCharacterIds)
  if (checked) ids.add(characterId)
  else ids.delete(characterId)
  state.gmNpcTurnCharacterIds = [...ids]
  save()
  render({ content: true })
}

export function selectAllGmTurnCharacters() {
  state.gmNpcTurnCharacterIds = state.characters.map(c => c.id)
  render({ content: true })
}

export function clearGmTurnCharacters() {
  state.gmNpcTurnCharacterIds = []
  render({ content: true })
}

export function addInitiativeEntry(name = '') {
  state.initiativeTracker.entries.push(createInitiativeEntry(name))
  save()
  render({ content: true })
}

export function addRosterToInitiativeTracker() {
  const existing = new Set(state.initiativeTracker.entries.map(entry => entry.name.toLowerCase()))
  let added = 0
  for (const character of state.characters) {
    if (existing.has(character.name.toLowerCase())) continue
    state.initiativeTracker.entries.push(createInitiativeEntry(character.name, ''))
    existing.add(character.name.toLowerCase())
    added += 1
  }
  save()
  render({ content: true })
  toast(added ? `Added ${added} character${added === 1 ? '' : 's'} to initiative.` : 'Everyone on the roster is already listed.')
}

export function removeInitiativeEntry(entryId) {
  state.initiativeTracker.entries = state.initiativeTracker.entries.filter(entry => entry.id !== entryId)
  if (state.initiativeTracker.activeEntryId === entryId) {
    state.initiativeTracker.activeEntryId = sortInitiativeEntries(state.initiativeTracker.entries)[0]?.id || null
  }
  save()
  render({ content: true })
}

export function updateInitiativeEntry(entryId, patch) {
  const entry = state.initiativeTracker.entries.find(item => item.id === entryId)
  if (!entry) return
  if (patch.name != null) entry.name = String(patch.name)
  if (patch.initiative != null) {
    entry.initiative = patch.initiative === '' ? '' : Number(patch.initiative)
  }
  save()
  render({ content: true })
}

export function setInitiativeActiveEntry(entryId) {
  state.initiativeTracker.activeEntryId = entryId || null
  save()
  render({ content: true })
}

export function nextInitiativeTurn() {
  const { entries, activeEntryId } = state.initiativeTracker
  if (!entries.length) return toast('Add combatants to the initiative list first.')
  const nextId = nextTurnEntryId(entries, activeEntryId)
  state.initiativeTracker.activeEntryId = nextId
  save()
  render({ content: true })
  const active = activeInitiativeEntry(entries, nextId)
  if (active) toast(`${active.name}'s turn.`)
}

export function resetInitiativeRound() {
  const first = sortInitiativeEntries(state.initiativeTracker.entries)[0]
  state.initiativeTracker.activeEntryId = first?.id || null
  save()
  render({ content: true })
  if (first) toast(`Round reset — ${first.name} goes first.`)
}

export function clearInitiativeTracker() {
  state.initiativeTracker = { entries: [], activeEntryId: null }
  save()
  render({ content: true })
  toast('Initiative list cleared.')
}

export function printCharacterSheet() {
  const character = activeCharacter()
  if (!character) return toast('Select a character first.')
  openPrintableCharacterSheet(character)
}
