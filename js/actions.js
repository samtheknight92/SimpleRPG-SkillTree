import { DEFAULT_STATS, STAT_RULES, SAVE_VERSION, HOMEBREW_ID_PREFIX, TIER_LUMEN_COST } from './constants.js'
import { resolveSkillUseDamage } from './homebrew-combat.js'
import { getMaxStatReward } from './max-stat-rewards.js'
import { state, activeCharacter } from './state.js'
import { save, saveNow, serializeSave, applySavePayload, isFullSaveExport } from './storage.js'
import { render } from './render.js'
import { toast, toastCombat, clamp, deepClone, uid, titleCase } from './utils.js'
import {
  createCharacter,
  normalizeCharacter,
  fillCharacterToFullResources,
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
import { getRace } from './cache.js'
import {
  getItem,
  addItemToInventory,
  addCraftedItemToInventory,
  shopPurchaseCheck,
  itemHasCounter,
  itemCounterLabel,
  inventoryCounterValue,
  itemBlocksUnequipWithCounter,
  itemBlocksRemoveWithCounter,
  counterMaxValue,
  counterRulePhrase
} from './items.js'
import {
  canEquipToMainHand,
  canEquipToOffhand,
  characterHandsEmpty,
  equippedSlotForEntry,
  getEquippedOffhand,
  getEquippedWeapon,
  getOffhandType,
  getWeaponKind,
  isTwoHandedWeapon,
  reconcileOffhandEquip
} from './equipment.js'
import {
  addStatusEffectToCharacter,
  tickStatusEffects,
  tickPassiveEffectSources,
  effectUsesPotency,
  isTargetFacingEffect
} from './effects.js'
import {
  getSkillActivationType,
  resolveActivationEffects,
  rollSkillProc
} from './skill-activation.js'
import {
  applyInstrumentToActivations,
  formatPerformanceMeta,
  canEncoreReplay,
  noteMusicianSongStarted,
  isMusicianPerformanceSkill
} from './instruments.js'
import {
  BASIC_ATTACK_ID,
  getSkillUseBlockReason,
  isBasicAttackSkill,
  resolveBasicAttackDamage
} from './combat.js'
import {
  applySkillHeal,
  formatHealUseSummary,
  formatCombatDamageToastLine,
  formatMultiHitCombatToast,
  resolveDamageBreakdown,
  formatDamageBreakdownPlain
} from './damage-breakdown.js'
import {
  characterHasStrikerBasics,
  isStrikerMultiBasicSkill,
  parseMultiBasicAttackCount
} from './striker-combat.js'
import { isMultiWeaponAttackSkill, parseMultiWeaponAttackCount } from './weapon-combat.js'
import { getEffectiveSkillStaminaCost } from './career-effects.js'
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
import { canCraftRecipe, deductMaterials, buildCraftMetadata, listCraftRecipes } from './craft.js'
import { formatCraftBonusLabel } from './craft-bonuses.js'
import {
  canApplyEnhancementToGear,
  createAppliedEnchantment,
  entryEnchantments,
  maxEnchantmentSlots,
  isEnhancementItem,
  isShieldEnchant,
  shieldEnchantWasUsed,
  shieldEnchantRemaining
} from './enchantments.js'
import {
  normalizeFolderName,
  ensureFolderRegistered,
  setRosterFolderOpen,
  syncCharacterFolderOrder,
  characterFolder,
  filterCharactersByFolder,
  FOLDER_FILTER_UNFILED
} from './character-folders.js'
import {
  upsertHomebrewItem,
  deleteHomebrewItem,
  duplicateHomebrewItem,
  buildHomebrewPack,
  mergeHomebrewImport,
  isHomebrewPackFile,
  listHomebrewItems,
  getHomebrewItem,
  listHomebrewSkills,
  getHomebrewSkill,
  draftFromHomebrewItem,
  draftFromHomebrewSkill,
  emptyHomebrewDraft,
  emptyHomebrewSkillDraft,
  collectHomebrewIdsFromCharacter,
  homebrewItemsForExport,
  homebrewSkillsForExport,
  charactersUsingHomebrewItem,
  charactersUsingHomebrewSkill,
  parseHomebrewDraftForm,
  parseHomebrewSkillDraftForm,
  syncHomebrewDraftFromForm,
  syncHomebrewSkillDraftFromForm,
  upsertHomebrewSkill,
  deleteHomebrewSkill,
  duplicateHomebrewSkill,
  listHomebrewRaces,
  getHomebrewRace,
  draftFromHomebrewRace,
  emptyHomebrewRaceDraft,
  upsertHomebrewRace,
  deleteHomebrewRace,
  duplicateHomebrewRace,
  charactersUsingHomebrewRace,
  homebrewSkillsForRace,
  homebrewRacesForExport,
  parseHomebrewRaceDraftForm,
  syncHomebrewRaceDraftFromForm
} from './homebrew.js'

function syncHomebrewEditorFromDom() {
  syncHomebrewDraftFromForm()
}

function touch(character, partial = { header: true, sidebar: true, content: true, actionBar: true }) {
  if (character) invalidateCharacterCache(character)
  save()
  render(partial)
  syncUrlState()
}

export function createAndSelectCharacter(name, raceId, options = {}) {
  const spawnFolder = isGmMode() ? normalizeFolderName(state.gmSpawnFolder) : ''
  if (spawnFolder && !options.folder) options = { ...options, folder: spawnFolder }
  const character = createCharacter(name, raceId, options)
  if (character.folder) ensureFolderRegistered(state, character.folder)
  state.characters.push(character)
  state.activeId = character.id
  touch(character)
  toast(`${character.name} created.`)
  return character
}

export function setCharacterFolder(characterId, folderName) {
  const character = state.characters.find(c => c.id === characterId)
  if (!character) return
  const folder = normalizeFolderName(folderName)
  character.folder = folder
  if (folder) ensureFolderRegistered(state, folder)
  touch(character, { sidebar: true })
}

export function createCharacterFolder(name) {
  const folder = ensureFolderRegistered(state, name)
  if (!folder) return toast('Folder name cannot be empty.')
  setRosterFolderOpen(state, folder, true)
  touch(null, { sidebar: true })
  toast(`Folder “${folder}” created — move characters into it from the Move menu on each card.`)
}

export function rememberRosterFolderOpen(sectionKey, open) {
  setRosterFolderOpen(state, sectionKey, open)
  save()
}

export function setGmSpawnFolder(folderName) {
  state.gmSpawnFolder = normalizeFolderName(folderName)
  if (state.gmSpawnFolder) ensureFolderRegistered(state, state.gmSpawnFolder)
  save()
}

export function moveCharacterFolder(folderName, direction) {
  const folder = normalizeFolderName(folderName)
  if (!folder) return
  syncCharacterFolderOrder(state)
  const order = [...state.characterFolderOrder]
  const idx = order.indexOf(folder)
  if (idx < 0) return
  const target = direction === 'up' ? idx - 1 : idx + 1
  if (target < 0 || target >= order.length) {
    return toast(direction === 'up' ? 'Folder is already at the top.' : 'Folder is already at the bottom.')
  }
  ;[order[idx], order[target]] = [order[target], order[idx]]
  state.characterFolderOrder = order
  state.characterFolderNames = [...order]
  touch(null, { sidebar: true })
}

export function copyCharacterFolder(folderName) {
  const source = normalizeFolderName(folderName)
  if (!source) return
  const suggested = `${source} (copy)`
  const input = prompt(`Copy folder “${source}” as:`, suggested)
  if (input == null) return
  const dest = ensureFolderRegistered(state, input)
  if (!dest) return toast('Folder name cannot be empty.')
  if (dest === source) return toast('Pick a different name for the copy.')

  const originals = state.characters.filter(c => characterFolder(c) === source)
  const added = []
  for (const original of originals) {
    const copy = normalizeCharacter(deepClone(original))
    copy.id = uid('char')
    copy.name = allocateCharacterName(original.name, [
      ...state.characters.map(c => c.name),
      ...added
    ])
    copy.folder = dest
    copy.premadeId = null
    copy.created = new Date().toISOString()
    copy.updated = copy.created
    state.characters.push(copy)
    added.push(copy.name)
  }

  setRosterFolderOpen(state, dest, true)
  touch(null, { sidebar: true })
  toast(originals.length
    ? `Copied ${originals.length} character${originals.length === 1 ? '' : 's'} to “${dest}”.`
    : `Empty folder “${dest}” created.`)
}

export function deleteCharacterFolder(folderName) {
  const folder = normalizeFolderName(folderName)
  if (!folder) return
  const count = state.characters.filter(c => characterFolder(c) === folder).length
  const note = count
    ? `${count} character${count === 1 ? '' : 's'} will move to Unfiled.`
    : 'This empty folder will be removed.'
  if (!confirm(`Delete folder “${folder}”? ${note}`)) return

  for (const character of state.characters) {
    if (characterFolder(character) === folder) character.folder = ''
  }
  syncCharacterFolderOrder(state)
  state.characterFolderOrder = state.characterFolderOrder.filter(name => name !== folder)
  state.characterFolderNames = [...state.characterFolderOrder]
  if (state.characterFolderOpen) delete state.characterFolderOpen[folder]
  if (state.gmSpawnFolder === folder) state.gmSpawnFolder = ''
  touch(null, { sidebar: true })
  toast(`Folder “${folder}” deleted.`)
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

  const cost = getEffectiveSkillStaminaCost(character, skill)
  if (character.stamina < cost) {
    return toast(`Not enough Stamina for ${skill.name} (need ${cost}, have ${character.stamina}).`)
  }

  if (isStrikerMultiBasicSkill(skill)) {
    if (!characterHandsEmpty(character)) {
      return toast(`${skill.name} requires both hands empty.`)
    }
    if (!characterHasStrikerBasics(character)) {
      return toast(`${skill.name} requires Striker Basics.`)
    }
    character.stamina -= cost
    invalidateCharacterCache(character)
    const count = parseMultiBasicAttackCount(skill, character)
    const hitLines = []
    const totals = []
    for (let i = 0; i < count; i++) {
      const { total, summary } = resolveBasicAttackDamage(character, rollDice)
      totals.push(total)
      hitLines.push(formatCombatDamageToastLine(i + 1, summary, total))
    }
    touch(character, { header: true, content: true, actionBar: true })
    toastCombat(formatMultiHitCombatToast(skill.name, hitLines, totals, cost), { html: true })
    return
  }

  if (isMultiWeaponAttackSkill(skill)) {
    character.stamina -= cost
    invalidateCharacterCache(character)
    const count = parseMultiWeaponAttackCount(skill)
    const hitLines = []
    const totals = []
    for (let i = 0; i < count; i++) {
      const breakdown = resolveDamageBreakdown(character, skill, { rollDiceFn: rollDice })
      if (!breakdown?.parts?.length) break
      const plain = formatDamageBreakdownPlain(breakdown)
      const summary = plain.replace(/^Damage \(yours\):\s*/, '')
      totals.push(breakdown.total)
      hitLines.push(formatCombatDamageToastLine(i + 1, summary, breakdown.total))
    }
    touch(character, { header: true, content: true, actionBar: true })
    if (hitLines.length) {
      toastCombat(formatMultiHitCombatToast(skill.name, hitLines, totals, cost), { html: true })
    } else {
      toast(`${skill.name} used (−${cost} Stamina). Roll each hit at the table.`)
    }
    return
  }

  character.stamina -= cost

  const healResult = applySkillHeal(character, skill, rollDice)
  const healSummary = healResult ? formatHealUseSummary(healResult.breakdown, healResult.healed) : ''
  const healOrChoice = /\bOR\s+apply\b/i.test(String(skill.desc || ''))
  const damageResult = resolveSkillUseDamage(character, skill, rollDice)
  const damageLine = damageResult
    ? formatCombatDamageToastLine(null, damageResult.summary, damageResult.total)
    : ''

  let activations = resolveActivationEffects(skill)
  if (healResult && healOrChoice) activations = []
  const encoreReplay = isMusicianPerformanceSkill(skill) && canEncoreReplay(character, skill.id)
  activations = applyInstrumentToActivations(character, skill, activations, { encoreReplay })

  const applied = []
  const missed = []
  const targetProcs = []
  const targetProcMissed = []
  let performanceNote = ''

  for (const payload of activations) {
    const effect = getEffect(payload.effectId)
    if (!effect) continue
    const procRoll = rollSkillProc(payload.chance ?? 1)
    const applyToTarget = payload.applyTo === 'target'
    const applyToSelf = payload.applyTo === 'self'
    if (!applyToSelf && (applyToTarget || isTargetFacingEffect(effect))) {
      const pct = payload.chance != null && payload.chance < 1
        ? `${Math.round(payload.chance * 100)}% `
        : ''
      if (procRoll) {
        targetProcs.push(
          `${pct}${effect.name} on target — add to their sheet manually if the GM confirms the hit`
        )
      } else {
        targetProcMissed.push(`${effect.name} proc missed`)
      }
      continue
    }
    if (!procRoll) {
      missed.push(effect.name)
      continue
    }
    const ok = addStatusEffectToCharacter(
      character,
      payload.effectId,
      payload.duration,
      payload.potency,
      encoreReplay ? `Encore: ${skill.name}` : `Used ${skill.name}`,
      payload.performance ? { performance: payload.performance } : null
    )
    const potencyNote = payload.potency != null && effectUsesPotency(effect)
      ? `, potency ${payload.potency}`
      : ''
    if (ok) {
      applied.push(`${effect.name} (${payload.duration} turn${payload.duration === 1 ? '' : 's'}${potencyNote})`)
      if (payload.performance && !performanceNote) {
        performanceNote = formatPerformanceMeta(payload.performance)
      }
      if (isMusicianPerformanceSkill(skill)) {
        noteMusicianSongStarted(character, skill.id, { encoreReplay })
      }
    } else missed.push(`${effect.name} (already active)`)
  }

  const targetEffectPart = [...targetProcs, ...targetProcMissed].join('; ')

  touch(character, { header: true, content: true, actionBar: true })

  const staminaNote = `(−${cost} Stamina)`
  const healPart = healSummary ? healSummary : ''
  const selfEffectPart = applied.length ? applied.join(', ') : ''
  const effectPart = [selfEffectPart, targetEffectPart].filter(Boolean).join('; ')
  const ampSuffix = performanceNote ? ` — ${performanceNote}` : ''
  const withDamage = (body) => {
    const lead = [damageLine, body].filter(Boolean).join('; ')
    return lead || damageLine
  }

  if (healPart && !effectPart && !missed.length) {
    toastCombat(`${skill.name}: ${withDamage(healPart)} ${staminaNote}.`, { html: Boolean(damageLine) })
    return
  }
  if (healPart && effectPart && !missed.length) {
    toastCombat(`${skill.name}: ${withDamage(`${healPart}; ${effectPart}`)} ${staminaNote}.`, { html: Boolean(damageLine) })
    return
  }
  if (healPart && effectPart && missed.length) {
    toastCombat(`${skill.name}: ${withDamage(`${healPart}; ${effectPart}; ${missed.join(', ')}`)} ${staminaNote}.`, { html: Boolean(damageLine) })
    return
  }
  if (healPart && !effectPart && missed.length) {
    toastCombat(`${skill.name}: ${withDamage(`${healPart}; ${missed.join(', ')}`)} ${staminaNote}.`, { html: Boolean(damageLine) })
    return
  }

  if (!activations.length && !healResult) {
    if (damageLine) {
      toastCombat(`${skill.name}: ${damageLine} ${staminaNote}.`, { html: true })
      return
    }
    toastCombat(`${skill.name} used ${staminaNote}.`)
    return
  }
  if (applied.length && !missed.length) {
    toastCombat(`${skill.name}: ${withDamage(effectPart)}${ampSuffix} (−${cost} Stamina).`, { html: Boolean(damageLine) })
    return
  }
  if (applied.length) {
    toastCombat(`${skill.name}: ${withDamage(`${effectPart}${ampSuffix}; ${missed.join(', ')}`)} (−${cost} Stamina).`, { html: Boolean(damageLine) })
    return
  }
  if (damageLine) {
    toastCombat(`${skill.name}: ${damageLine}; ${missed.length ? missed.join(', ') : 'no effects applied'} (−${cost} Stamina).`, { html: true })
    return
  }
  toastCombat(`${skill.name} failed to apply effects${missed.length ? `: ${missed.join(', ')}` : ''} (−${cost} Stamina).`)
}

export function processTurn() {
  const character = activeCharacter()
  if (!character) return
  character.movedThisTurn = false
  invalidateCharacterCache(character)
  const stillActive = []
  let spent = 0
  const messages = []
  for (const skillId of character.activeToggles) {
    const skill = getSkill(skillId)
    const cost = getEffectiveSkillStaminaCost(character, skill)
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
  toastCombat(`Processed turn. ${toggleText}${effectText}${messages.length ? ` ${messages[0]}` : ''}`)
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
  const check = shopPurchaseCheck(character, item, { free: isFree })
  if (!check.ok) return toast(check.reason)
  const price = itemPriceGil(item)
  const current = normalizeGil(character.gil)
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

/** GM Mode — add recipe output to inventory (no skills, materials, or craft metadata). */
export function grantCraftRecipe(recipeId) {
  const character = activeCharacter()
  const recipe = listCraftRecipes().find(row => row.id === recipeId)
  if (!character || !recipe) return toast('Unknown recipe.')
  if (!isGmMode()) return toast('Grant is GM Mode only.')
  addItemToInventory(character, recipe.id, 1)
  touch(character)
  toast(`${recipe.name} granted.`)
}

function equippedSlotForGearEntry(character, gearEntryUid) {
  for (const [slot, uid] of Object.entries(character?.equipped || {})) {
    if (uid === gearEntryUid) return slot
  }
  return null
}

export function applyEnchantment(gearEntryUid, scrollEntryUid) {
  const character = activeCharacter()
  if (!character || !gearEntryUid || !scrollEntryUid) return

  const gearEntry = character.inventory.find(row => row.uid === gearEntryUid)
  const scrollEntry = character.inventory.find(row => row.uid === scrollEntryUid)
  const gearItem = gearEntry && getItem(gearEntry.itemId)
  const scrollItem = scrollEntry && getItem(scrollEntry.itemId)
  if (!gearEntry || !scrollEntry || !gearItem || !scrollItem) return toast('Item not found.')

  const gearSlot = equippedSlotForGearEntry(character, gearEntryUid)
  if (!gearSlot) return toast('Equip the target weapon or armour first.')

  if (!isEnhancementItem(scrollItem)) return toast('That is not an enchantment item.')

  const check = canApplyEnhancementToGear(scrollItem, gearItem, gearSlot)
  if (!check.ok) return toast(check.reason)

  const maxSlots = maxEnchantmentSlots(gearEntry, gearItem)
  if (maxSlots <= 0) return toast(`${gearItem.name} has no enchantment slots.`)

  if (!Array.isArray(gearEntry.enchantments)) gearEntry.enchantments = []
  if (gearEntry.enchantments.length >= maxSlots) {
    return toast(`All ${maxSlots} slot${maxSlots === 1 ? '' : 's'} are full. Remove one first.`)
  }

  const applied = createAppliedEnchantment(scrollItem)
  if (!applied) return toast('Could not resolve enchant effect.')

  gearEntry.enchantments.push(applied)
  const qty = Math.max(1, Number(scrollEntry.qty || 1))
  if (qty > 1) scrollEntry.qty = qty - 1
  else character.inventory = character.inventory.filter(row => row.uid !== scrollEntryUid)

  invalidateCharacterCache(character)
  const computed = computeStats(character)
  character.hp = clamp(character.hp, 0, computed.hp)
  character.stamina = clamp(character.stamina, 0, computed.stamina)
  touch(character)
  toast(`${applied.name} applied to ${gearItem.name}.`)
}

export function removeEnchantment(gearEntryUid, enchantId) {
  const character = activeCharacter()
  if (!character || !gearEntryUid || !enchantId) return

  const gearEntry = character.inventory.find(row => row.uid === gearEntryUid)
  const gearItem = gearEntry && getItem(gearEntry.itemId)
  if (!gearEntry || !gearItem) return toast('Item not found.')

  const removed = entryEnchantments(gearEntry).find(row => row.id === enchantId)
  if (!removed) return toast('Enchantment not found.')

  gearEntry.enchantments = entryEnchantments(gearEntry).filter(row => row.id !== enchantId)

  const canReturn = removed.sourceItemId && (!isShieldEnchant(removed) || !shieldEnchantWasUsed(removed))
  if (canReturn) {
    addItemToInventory(character, removed.sourceItemId, 1)
  }

  invalidateCharacterCache(character)
  const computed = computeStats(character)
  character.hp = clamp(character.hp, 0, computed.hp)
  character.stamina = clamp(character.stamina, 0, computed.stamina)
  touch(character)
  const itemName = removed.sourceItemId && getItem(removed.sourceItemId)?.name
  if (isShieldEnchant(removed) && shieldEnchantWasUsed(removed)) {
    toast(`${removed.name || itemName || 'Barrier'} removed — crystal destroyed (not returned).`)
  } else if (itemName) {
    toast(`${removed.name || itemName} removed from ${gearItem.name} and returned to inventory.`)
  } else {
    toast(`Enchantment removed from ${gearItem.name}.`)
  }
}

export function recordEnchantShieldAbsorption(gearEntryUid, enchantId, amount) {
  const character = activeCharacter()
  if (!character || !gearEntryUid || !enchantId) return

  const gearEntry = character.inventory.find(row => row.uid === gearEntryUid)
  const gearItem = gearEntry && getItem(gearEntry.itemId)
  if (!gearEntry || !gearItem) return toast('Item not found.')

  const ench = entryEnchantments(gearEntry).find(row => row.id === enchantId)
  if (!ench || !isShieldEnchant(ench)) return toast('Not a barrier enchant.')

  const soak = Math.max(0, Number(amount) || 0)
  if (!soak) return toast('Enter how much magical damage to soak.')

  const before = shieldEnchantRemaining(ench)
  ench.shieldRemaining = Math.max(0, before - soak)

  if (ench.shieldRemaining <= 0) {
    gearEntry.enchantments = entryEnchantments(gearEntry).filter(row => row.id !== enchantId)
    invalidateCharacterCache(character)
    touch(character)
    toast(`${ench.name || 'Barrier Crystal'} spent — ${soak} magical damage soaked (pool empty).`)
    return
  }

  invalidateCharacterCache(character)
  touch(character)
  toast(`Soaked ${soak} magical damage — ${ench.shieldRemaining}/${ench.shieldMax} left on ${gearItem.name}.`)
}

export function removeInventoryEntry(entryUid) {
  const character = activeCharacter()
  if (!character) return
  const entry = character.inventory.find(row => row.uid === entryUid)
  const item = entry && getItem(entry.itemId)
  if (entry && item && itemBlocksRemoveWithCounter(entry, item)) {
    const label = itemCounterLabel(item)
    return toast(`${item.name} cannot be removed while ${label} ${counterRulePhrase(item)} (now ${inventoryCounterValue(entry, item)}).`)
  }
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

  const isOffhandEquip = slot === 'offhand'

  if (isOffhandEquip) {
    const check = canEquipToOffhand(character, item)
    if (!check.ok) return toast(check.reason)
    const alreadyIn = equippedSlotForEntry(character, entry.uid)
    if (alreadyIn && alreadyIn !== 'offhand') {
      return toast(`${item.name} is already equipped (${titleCase(alreadyIn === 'offhand' ? 'off-hand' : alreadyIn)}).`)
    }
    character.equipped.offhand = entry.uid
    invalidateCharacterCache(character)
    touch(character)
    return toast(`${item.name} equipped (off-hand).`)
  }

  const type = String(item.type || '').toLowerCase()
  const equipSlot = canEquipToMainHand(item)
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

  if (equipSlot === 'weapon') {
    character.equipped.weapon = entry.uid
    if (isTwoHandedWeapon(item)) {
      character.equipped.offhand = null
    } else {
      const offItem = getEquippedOffhand(character)
      if (offItem && getOffhandType(offItem) === 'weapon') {
        character.equipped.offhand = null
      }
    }
    reconcileOffhandEquip(character)
  } else {
    character.equipped[equipSlot] = entry.uid
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
  invalidateCharacterCache(character)
  const { total, summary } = resolveBasicAttackDamage(character, rollDice)
  touch(character, { header: true, content: true, actionBar: true })
  toastCombat(`Basic Attack: ${formatCombatDamageToastLine(null, summary, total)}`, { html: true })
}

export function markMoved() {
  const character = activeCharacter()
  if (!character) return
  character.movedThisTurn = true
  invalidateCharacterCache(character)
  touch(character, { header: true, actionBar: true })
  toast('Movement marked — ranged attacks blocked this turn (Quick Draw bypasses this).')
}

export function unequip(slot) {
  const character = activeCharacter()
  if (!character) return
  const entryUid = character.equipped[slot]
  const entry = entryUid ? character.inventory.find(row => row.uid === entryUid) : null
  const item = entry && getItem(entry.itemId)
  if (entry && item && itemBlocksUnequipWithCounter(entry, item)) {
    const label = itemCounterLabel(item)
    return toast(`${item.name} cannot be unequipped while ${label} ${counterRulePhrase(item)} (now ${inventoryCounterValue(entry, item)}).`)
  }
  character.equipped[slot] = null
  if (slot === 'weapon') character.equipped.offhand = null
  touch(character)
}

export function adjustInventoryCounter(entryUid, delta) {
  const character = activeCharacter()
  const entry = character?.inventory.find(row => row.uid === entryUid)
  const item = entry && getItem(entry.itemId)
  if (!character || !entry || !itemHasCounter(item)) return
  let next = Math.max(0, inventoryCounterValue(entry, item) + Number(delta || 0))
  const max = counterMaxValue(item)
  if (max != null) next = Math.min(next, max)
  entry.counter = next
  touch(character)
}

export function upgradeStat(stat) {
  const character = activeCharacter()
  const rule = STAT_RULES[stat]
  if (!character || !rule) return
  if (character.stats[stat] >= rule.max) return toast(`${rule.label} is already at its cap.`)
  if (!isGmMode() && character.lumens < rule.cost) return toast('Not enough lumens for that upgrade.')
  const wasBelowCap = character.stats[stat] < rule.max
  character.stats[stat] += 1
  if (!isGmMode()) character.lumens -= rule.cost
  if (stat === 'hp') character.hp += 1
  if (stat === 'stamina') character.stamina += 1
  touch(character)
  const reward = getMaxStatReward(stat)
  if (wasBelowCap && character.stats[stat] >= rule.max && reward) {
    toast(`Hidden reward unlocked: ${reward.icon} ${reward.name}. See Skill & Gear Effects on the Character tab.`)
  }
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
  if (all) {
    const payload = serializeSave()
    downloadJson(payload, 'lumenforge-save.json')
    return
  }
  const character = activeCharacter()
  if (!character) return toast('No character to export.')
  const homebrewIds = [...collectHomebrewIdsFromCharacter(character)]
  const exportRaceIds = []
  const exportItemIds = []
  const exportSkillIds = []
  for (const id of homebrewIds) {
    if (getHomebrewRace(id)) exportRaceIds.push(id)
    else if (getHomebrewSkill(id)) exportSkillIds.push(id)
    else if (getHomebrewItem(id)) exportItemIds.push(id)
  }
  const payload = {
    version: SAVE_VERSION,
    characters: [normalizeCharacter(deepClone(character))],
    homebrew: {
      items: homebrewItemsForExport(exportItemIds),
      skills: homebrewSkillsForExport(exportSkillIds),
      races: homebrewRacesForExport(exportRaceIds)
    }
  }
  downloadJson(payload, `${character.name || 'character'}-lumenforge.json`.replace(/[^a-z0-9_.-]+/gi, '_'))
}

function downloadJson(payload, filename) {
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = filename
  a.click()
  URL.revokeObjectURL(a.href)
}

export async function importData(file) {
  if (!file) return
  try {
    const parsed = JSON.parse(await file.text())

    if (isHomebrewPackFile(parsed) && !Array.isArray(parsed.characters)) {
      const hasExisting = listHomebrewItems().length > 0 || listHomebrewSkills().length > 0 || listHomebrewRaces().length > 0
      const replace = hasExisting && confirm(
        'Homebrew pack detected.\n\nOK = Replace all local homebrew.\nCancel = Merge by ID (incoming wins conflicts).'
      )
      const result = mergeHomebrewImport(parsed, { replace })
      render({ all: true })
      const parts = []
      if (result.items) parts.push(`${result.items} item${result.items === 1 ? '' : 's'}`)
      if (result.skills) parts.push(`${result.skills} skill${result.skills === 1 ? '' : 's'}`)
      if (result.races) parts.push(`${result.races} race${result.races === 1 ? '' : 's'}`)
      toast(`Imported ${parts.join(' and ') || '0 entries'}.`)
      return
    }

    const nestedHomebrew = parsed.homebrew
    if (nestedHomebrew?.items?.length || nestedHomebrew?.skills?.length || nestedHomebrew?.races?.length) {
      if (!isFullSaveExport(parsed)) {
        mergeHomebrewImport(nestedHomebrew, { replace: false })
      }
    }

    const imported = Array.isArray(parsed) ? parsed : parsed.characters
    if (!Array.isArray(imported)) throw new Error('No characters array')

    const missing = []
    for (const character of imported.map(normalizeCharacter)) {
      for (const itemId of collectHomebrewIdsFromCharacter(character)) {
        if (String(itemId).startsWith(HOMEBREW_ID_PREFIX) && !getItem(itemId) && !getHomebrewRace(itemId)) missing.push(itemId)
      }
      for (const skillId of character.skills || []) {
        if (String(skillId).startsWith(HOMEBREW_ID_PREFIX) && !getSkill(skillId)) missing.push(skillId)
      }
      if (String(character.race || '').startsWith(HOMEBREW_ID_PREFIX) && !getRace(character.race)) missing.push(character.race)
    }
    if (missing.length) {
      throw new Error(`Missing homebrew content: ${[...new Set(missing)].join(', ')}`)
    }

    const fullSave = isFullSaveExport(parsed)
    const hasExisting = state.characters.length > 0
    let replace = false

    if (fullSave) {
      if (!hasExisting) replace = true
      else {
        replace = confirm(
          'This is a full save file.\n\nOK = Replace entire save (characters, folders, GM tools, UI, homebrew).\nCancel = Merge imported characters by ID (keeps your current folders and GM state).'
        )
      }
    }

    applySavePayload(parsed, { replace })
    saveNow()
    render({ all: true })
    syncUrlState()
    const count = imported.length
    toast(
      replace
        ? `Restored full save (${count} character${count === 1 ? '' : 's'}).`
        : `Merged ${count} character${count === 1 ? '' : 's'} into your roster.`
    )
  } catch (error) {
    console.error(error)
    toast(error.message?.includes('Missing homebrew')
      ? error.message
      : 'Import failed. That file does not look like a LumenForge save.')
  }
}

export function startHomebrewEditor(itemId = null) {
  state.homebrewEditorKind = 'item'
  state.homebrewSkillEditingId = null
  state.homebrewSkillDraft = null
  state.homebrewRaceEditingId = null
  state.homebrewRaceDraft = null
  state.homebrewRaceShowEffectPicker = false
  state.homebrewRaceEffectSearch = ''
  state.homebrewSkillShowEffectPicker = false
  state.homebrewSkillEffectSearch = ''
  state.homebrewSkillShowUseEffectPicker = false
  state.homebrewSkillUseEffectSearch = ''
  state.homebrewEditingId = itemId
  state.homebrewDraft = itemId ? draftFromHomebrewItem(getHomebrewItem(itemId)) : emptyHomebrewDraft()
  state.homebrewShowEffectPicker = false
  state.homebrewEffectSearch = ''
  state.homebrewShowCounterOptions = Boolean(state.homebrewDraft?.counterLabel)
  render({ content: true })
}

export function startHomebrewSkillEditor(skillId = null) {
  state.homebrewEditorKind = 'skill'
  state.homebrewEditingId = null
  state.homebrewDraft = null
  state.homebrewRaceEditingId = null
  state.homebrewRaceDraft = null
  state.homebrewRaceShowEffectPicker = false
  state.homebrewRaceEffectSearch = ''
  state.homebrewShowEffectPicker = false
  state.homebrewEffectSearch = ''
  state.homebrewShowCounterOptions = false
  state.homebrewSkillEditingId = skillId
  state.homebrewSkillDraft = skillId ? draftFromHomebrewSkill(getHomebrewSkill(skillId)) : emptyHomebrewSkillDraft()
  state.homebrewSkillShowEffectPicker = false
  state.homebrewSkillEffectSearch = ''
  state.homebrewSkillShowUseEffectPicker = false
  state.homebrewSkillUseEffectSearch = ''
  render({ content: true })
}

export function startHomebrewRaceEditor(raceId = null) {
  state.homebrewEditorKind = 'race'
  state.homebrewEditingId = null
  state.homebrewDraft = null
  state.homebrewSkillEditingId = null
  state.homebrewSkillDraft = null
  state.homebrewShowEffectPicker = false
  state.homebrewEffectSearch = ''
  state.homebrewShowCounterOptions = false
  state.homebrewSkillShowEffectPicker = false
  state.homebrewSkillEffectSearch = ''
  state.homebrewSkillShowUseEffectPicker = false
  state.homebrewSkillUseEffectSearch = ''
  state.homebrewRaceEditingId = raceId
  state.homebrewRaceDraft = raceId ? draftFromHomebrewRace(getHomebrewRace(raceId)) : emptyHomebrewRaceDraft()
  state.homebrewRaceShowEffectPicker = false
  state.homebrewRaceEffectSearch = ''
  render({ content: true })
}

export function cancelHomebrewEditor() {
  state.homebrewEditorKind = null
  state.homebrewEditingId = null
  state.homebrewDraft = null
  state.homebrewShowEffectPicker = false
  state.homebrewEffectSearch = ''
  state.homebrewShowCounterOptions = false
  state.homebrewSkillEditingId = null
  state.homebrewSkillDraft = null
  state.homebrewSkillShowEffectPicker = false
  state.homebrewSkillEffectSearch = ''
  state.homebrewSkillShowUseEffectPicker = false
  state.homebrewSkillUseEffectSearch = ''
  state.homebrewRaceEditingId = null
  state.homebrewRaceDraft = null
  state.homebrewRaceShowEffectPicker = false
  state.homebrewRaceEffectSearch = ''
  render({ content: true })
}

export function toggleHomebrewEffectPicker() {
  syncHomebrewEditorFromDom()
  state.homebrewShowEffectPicker = !state.homebrewShowEffectPicker
  render({ content: true })
}

export function toggleHomebrewCounterOptions() {
  syncHomebrewEditorFromDom()
  state.homebrewShowCounterOptions = !state.homebrewShowCounterOptions
  render({ content: true })
}

export function clearHomebrewDraftCounter() {
  syncHomebrewEditorFromDom()
  if (!state.homebrewDraft) return
  state.homebrewDraft = {
    ...state.homebrewDraft,
    counterLabel: '',
    counterDefault: 0,
    counterMax: null,
    blockUnequipWithCounter: false,
    blockRemoveWithCounter: false,
    counterEquippedOnly: false,
    counterRuleOperator: 'above',
    counterRuleValue: 0
  }
  state.homebrewShowCounterOptions = false
  render({ content: true })
}

export function toggleHomebrewDraftEffect(effectId) {
  syncHomebrewEditorFromDom()
  if (!state.homebrewDraft || !effectId) return
  const selected = new Set(state.homebrewDraft.specialEffects || [])
  if (selected.has(effectId)) selected.delete(effectId)
  else selected.add(effectId)
  state.homebrewDraft.specialEffects = [...selected]
  render({ content: true })
}

export function removeHomebrewDraftEffect(effectId) {
  syncHomebrewEditorFromDom()
  if (!state.homebrewDraft) return
  state.homebrewDraft.specialEffects = (state.homebrewDraft.specialEffects || []).filter(id => id !== effectId)
  render({ content: true })
}

export function saveHomebrewDraftFromForm(form) {
  try {
    const draft = parseHomebrewDraftForm(form)
    if (state.homebrewEditingId) draft.id = state.homebrewEditingId
    draft.specialEffects = [...(state.homebrewDraft?.specialEffects || [])]
    const item = upsertHomebrewItem(draft)
    state.homebrewEditorKind = null
    state.homebrewEditingId = null
    state.homebrewDraft = null
    state.homebrewShowEffectPicker = false
    state.homebrewEffectSearch = ''
    state.homebrewShowCounterOptions = false
    render({ content: true })
    toast(`Saved ${item.name}.`)
  } catch (error) {
    toast(error.message || 'Could not save homebrew item.')
  }
}

export function removeHomebrewItem(itemId) {
  const item = getHomebrewItem(itemId)
  if (!item) return
  const users = charactersUsingHomebrewItem(itemId)
  if (users.length) {
    if (!confirm(`${item.name} is on ${users.length} character sheet(s). Delete anyway? (Inventory entries will break until removed.)`)) return
  } else if (!confirm(`Delete homebrew item "${item.name}"?`)) return
  deleteHomebrewItem(itemId)
  delete state.homebrewSelected[itemId]
  render({ content: true })
  toast('Homebrew item deleted.')
}

export function copyHomebrewItem(itemId) {
  const copy = duplicateHomebrewItem(itemId)
  if (!copy) return toast('Could not duplicate item.')
  render({ content: true })
  toast(`Duplicated as ${copy.name}.`)
}

export function toggleHomebrewSelect(itemId, checked) {
  if (checked) state.homebrewSelected[itemId] = true
  else delete state.homebrewSelected[itemId]
  render({ content: true })
}

export function grantHomebrewItem(itemId, characterId) {
  const item = getHomebrewItem(itemId)
  const targetId = characterId || state.activeId
  const character = state.characters.find(row => row.id === targetId)
  if (!item || !character) return toast('Pick a character first.')
  if (!isGmMode() && targetId !== state.activeId) return toast('You can only grant to your active character.')
  addItemToInventory(character, itemId, 1)
  touch(character)
  toast(`${item.name} added to ${character.name}.`)
}

export function grantHomebrewSkill(skillId, characterId) {
  const skill = getHomebrewSkill(skillId)
  const targetId = characterId || state.activeId
  const character = state.characters.find(row => row.id === targetId)
  if (!skill || !character) return toast('Pick a character first.')
  if (!isGmMode() && targetId !== state.activeId) return toast('You can only grant to your active character.')
  if (character.skills.includes(skillId)) return toast(`${character.name} already knows ${skill.name}.`)
  character.skills.push(skillId)
  touch(character)
  toast(`${skill.name} granted to ${character.name}.`)
}

export function syncHomebrewSkillEditorFromDom() {
  syncHomebrewSkillDraftFromForm()
}

export function toggleHomebrewSkillEffectPicker() {
  syncHomebrewSkillEditorFromDom()
  state.homebrewSkillShowEffectPicker = !state.homebrewSkillShowEffectPicker
  render({ content: true })
}

export function toggleHomebrewSkillDraftEffect(effectId) {
  syncHomebrewSkillEditorFromDom()
  if (!state.homebrewSkillDraft || !effectId) return
  const selected = new Set(state.homebrewSkillDraft.specialEffects || [])
  if (selected.has(effectId)) selected.delete(effectId)
  else selected.add(effectId)
  state.homebrewSkillDraft.specialEffects = [...selected]
  render({ content: true })
}

export function removeHomebrewSkillDraftEffect(effectId) {
  syncHomebrewSkillEditorFromDom()
  if (!state.homebrewSkillDraft) return
  state.homebrewSkillDraft.specialEffects = (state.homebrewSkillDraft.specialEffects || []).filter(id => id !== effectId)
  render({ content: true })
}

export function toggleHomebrewSkillUseEffectPicker() {
  syncHomebrewSkillEditorFromDom()
  state.homebrewSkillShowUseEffectPicker = !state.homebrewSkillShowUseEffectPicker
  render({ content: true })
}

export function toggleHomebrewSkillUseDraftEffect(effectId) {
  syncHomebrewSkillEditorFromDom()
  if (!state.homebrewSkillDraft || !effectId) return
  const list = [...(state.homebrewSkillDraft.activationEffects || [])]
  const idx = list.findIndex(row => row.effectId === effectId)
  if (idx >= 0) list.splice(idx, 1)
  else list.push({ effectId, duration: 3, potency: undefined })
  state.homebrewSkillDraft.activationEffects = list
  render({ content: true })
}

export function removeHomebrewSkillUseDraftEffect(effectId) {
  syncHomebrewSkillEditorFromDom()
  if (!state.homebrewSkillDraft) return
  state.homebrewSkillDraft.activationEffects = (state.homebrewSkillDraft.activationEffects || [])
    .filter(row => row.effectId !== effectId)
  render({ content: true })
}

export function saveHomebrewSkillDraftFromForm(form) {
  try {
    const draft = parseHomebrewSkillDraftForm(form, state.homebrewSkillDraft)
    if (state.homebrewSkillEditingId) draft.id = state.homebrewSkillEditingId
    draft.specialEffects = [...(state.homebrewSkillDraft?.specialEffects || [])]
    draft.lockWeaponKinds = [...(draft.lockWeaponKinds || [])]
    draft.lockRaces = [...(draft.lockRaces || [])]
    draft.lockSkills = [...(draft.lockSkills || [])]
    const skill = upsertHomebrewSkill(draft)
    state.homebrewEditorKind = null
    state.homebrewSkillEditingId = null
    state.homebrewSkillDraft = null
    state.homebrewSkillShowEffectPicker = false
    state.homebrewSkillEffectSearch = ''
    state.homebrewSkillShowUseEffectPicker = false
    state.homebrewSkillUseEffectSearch = ''
    render({ content: true })
    toast(`Saved ${skill.name}.`)
  } catch (error) {
    toast(error.message || 'Could not save homebrew skill.')
  }
}

export function removeHomebrewSkill(skillId) {
  const skill = getHomebrewSkill(skillId)
  if (!skill) return
  const users = charactersUsingHomebrewSkill(skillId)
  if (users.length) {
    if (!confirm(`${skill.name} is on ${users.length} character sheet(s). Delete anyway?`)) return
  } else if (!confirm(`Delete homebrew skill "${skill.name}"?`)) return
  deleteHomebrewSkill(skillId)
  delete state.homebrewSkillSelected[skillId]
  render({ content: true })
  toast('Homebrew skill deleted.')
}

export function copyHomebrewSkill(skillId) {
  const copy = duplicateHomebrewSkill(skillId)
  if (!copy) return toast('Could not duplicate skill.')
  render({ content: true })
  toast(`Duplicated as ${copy.name}.`)
}

export function toggleHomebrewSkillSelect(skillId, checked) {
  if (checked) state.homebrewSkillSelected[skillId] = true
  else delete state.homebrewSkillSelected[skillId]
  render({ content: true })
}

export function setHomebrewListFilter(filter) {
  state.homebrewListFilter = filter
  render({ content: true })
}

export function exportHomebrewSelection(all = false) {
  const itemIds = all ? listHomebrewItems().map(item => item.id) : Object.keys(state.homebrewSelected)
  const skillIds = all ? listHomebrewSkills().map(skill => skill.id) : Object.keys(state.homebrewSkillSelected)
  const raceIds = all ? listHomebrewRaces().map(race => race.id) : Object.keys(state.homebrewRaceSelected)
  if (!itemIds.length && !skillIds.length && !raceIds.length) return toast('Select at least one homebrew entry to export.')
  const name = prompt('Pack name (optional):', 'Homebrew pack') || 'Homebrew pack'
  const author = prompt('Author name (optional):', '') || ''
  const pack = buildHomebrewPack({
    name,
    author,
    itemIds: itemIds.length ? itemIds : null,
    skillIds: skillIds.length ? skillIds : null,
    raceIds: raceIds.length ? raceIds : null
  })
  const total = itemIds.length + skillIds.length + raceIds.length
  downloadJson(pack, `${name.replace(/[^a-z0-9_.-]+/gi, '_') || 'homebrew'}.json`)
  toast(`Exported ${total} entr${total === 1 ? 'y' : 'ies'}.`)
}

export function saveHomebrewRaceDraftFromForm(form) {
  try {
    syncHomebrewRaceDraftFromForm(form)
    const draft = { ...state.homebrewRaceDraft }
    if (state.homebrewRaceEditingId) draft.id = state.homebrewRaceEditingId
    const race = upsertHomebrewRace({
      ...draft,
      passiveTraits: String(draft.passiveTraitsText || '').split(/\r?\n/).map(row => row.trim()).filter(Boolean),
      specialEffects: [...(draft.specialEffects || [])]
    })
    state.homebrewEditorKind = null
    state.homebrewRaceEditingId = null
    state.homebrewRaceDraft = null
    state.homebrewRaceShowEffectPicker = false
    state.homebrewRaceEffectSearch = ''
    render({ content: true })
    toast(`Saved race "${race.name}".`)
  } catch (error) {
    toast(error.message || 'Could not save homebrew race.')
  }
}

export function removeHomebrewRace(raceId) {
  const race = getHomebrewRace(raceId)
  if (!race) return
  const users = charactersUsingHomebrewRace(raceId)
  const linkedSkills = homebrewSkillsForRace(raceId)
  if (users.length) {
    if (!confirm(`Delete "${race.name}"? ${users.length} character${users.length === 1 ? '' : 's'} use this race.`)) return
  } else if (linkedSkills.length) {
    if (!confirm(`Delete "${race.name}"? ${linkedSkills.length} racial skill${linkedSkills.length === 1 ? '' : 's'} are tied to it.`)) return
  } else if (!confirm(`Delete homebrew race "${race.name}"?`)) return
  deleteHomebrewRace(raceId)
  delete state.homebrewRaceSelected[raceId]
  render({ content: true })
  toast('Homebrew race deleted.')
}

export function copyHomebrewRace(raceId) {
  const copy = duplicateHomebrewRace(raceId)
  if (!copy) return toast('Could not duplicate race.')
  render({ content: true })
  toast(`Duplicated as ${copy.name}.`)
}

export function toggleHomebrewRaceSelect(raceId, checked) {
  if (checked) state.homebrewRaceSelected[raceId] = true
  else delete state.homebrewRaceSelected[raceId]
  render({ content: true })
}

export function syncHomebrewRaceEditorFromDom() {
  syncHomebrewRaceDraftFromForm()
}

export function toggleHomebrewRaceEffectPicker() {
  syncHomebrewRaceEditorFromDom()
  state.homebrewRaceShowEffectPicker = !state.homebrewRaceShowEffectPicker
  render({ content: true })
}

export function toggleHomebrewRaceDraftEffect(effectId) {
  syncHomebrewRaceEditorFromDom()
  if (!state.homebrewRaceDraft || !effectId) return
  const selected = new Set(state.homebrewRaceDraft.specialEffects || [])
  if (selected.has(effectId)) selected.delete(effectId)
  else selected.add(effectId)
  state.homebrewRaceDraft.specialEffects = [...selected]
  render({ content: true })
}

export function removeHomebrewRaceDraftEffect(effectId) {
  syncHomebrewRaceEditorFromDom()
  if (!state.homebrewRaceDraft) return
  state.homebrewRaceDraft.specialEffects = (state.homebrewRaceDraft.specialEffects || []).filter(id => id !== effectId)
  render({ content: true })
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
    fillCharacterToFullResources(character)
    character.id = uid('char')
    character.name = allocateCharacterName(template.name, [
      ...state.characters.map(c => c.name),
      ...addedNames
    ])
    character.premadeId = null
    character.created = new Date().toISOString()
    character.updated = character.created
    const spawnFolder = normalizeFolderName(state.gmSpawnFolder)
    if (spawnFolder) {
      character.folder = spawnFolder
      ensureFolderRegistered(state, spawnFolder)
    }
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

export function setGmNpcTurnFolder(folderKey) {
  state.gmNpcTurnFolder = folderKey || ''
  save()
  render({ content: true })
}

export function selectGmTurnFromFolder(folderKey) {
  const key = folderKey || state.gmNpcTurnFolder
  const characters = filterCharactersByFolder(state.characters, key)
  if (!characters.length) {
    return toast(`No characters in “${initiativeFolderLabel(key)}”.`)
  }
  state.gmNpcTurnFolder = key
  state.gmNpcTurnCharacterIds = characters.map(character => character.id)
  save()
  render({ content: true })
}

function initiativeFolderLabel(folderKey) {
  return folderKey === FOLDER_FILTER_UNFILED ? 'Unfiled' : folderKey
}

export function addInitiativeEntry(name = '') {
  state.initiativeTracker.entries.push(createInitiativeEntry(name))
  save()
  render({ content: true })
}

export function addRosterToInitiativeTracker() {
  addCharactersToInitiativeTracker(state.characters)
}

export function addFolderToInitiativeTracker(folderKey) {
  const characters = filterCharactersByFolder(state.characters, folderKey)
  if (!characters.length) return toast(`No characters in “${initiativeFolderLabel(folderKey)}”.`)
  addCharactersToInitiativeTracker(characters, initiativeFolderLabel(folderKey))
}

function addCharactersToInitiativeTracker(characters, folderLabel = '') {
  const existing = new Set(state.initiativeTracker.entries.map(entry => entry.name.toLowerCase()))
  let added = 0
  for (const character of characters) {
    if (existing.has(character.name.toLowerCase())) continue
    state.initiativeTracker.entries.push(createInitiativeEntry(character.name, ''))
    existing.add(character.name.toLowerCase())
    added += 1
  }
  save()
  render({ content: true })
  if (added) {
    toast(folderLabel
      ? `Added ${added} from “${folderLabel}”.`
      : `Added ${added} character${added === 1 ? '' : 's'} to initiative.`)
    return
  }
  toast(folderLabel
    ? `Everyone in “${folderLabel}” is already listed.`
    : 'Everyone on the roster is already listed.')
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
