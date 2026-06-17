import {
  createAndSelectCharacter,
  selectCharacter as selectCharacterById,
  learnSkill as doLearnSkill,
  refundSkill as doRefundSkill,
  toggleSkill as doToggleSkill,
  useSkill as doUseSkill,
  processTurn as doProcessTurn,
  addStatusEffect as doAddStatusEffect,
  removeStatusEffect as doRemoveStatusEffect,
  setRace as doSetRace,
  setElementalAffinity as doSetElementalAffinity,
  buyItem as doBuyItem,
  craftRecipe as doCraftRecipe,
  removeInventoryEntry as doRemoveInventoryEntry,
  equipItem as doEquipItem,
  unequip as doUnequip,
  upgradeStat as doUpgradeStat,
  refundStat as doRefundStat,
  setResource as doSetResource,
  adjustResource as doAdjustResource,
  fillResource as doFillResource,
  adjustCurrency as doAdjustCurrency,
  setGil as doSetGil,
  heal as doHeal,
  restoreStamina as doRestoreStamina,
  rollDice as doRollDice,
  duplicateCharacter as doDuplicateCharacter,
  deleteCharacter as doDeleteCharacter,
  exportData,
  importData,
  saveNotes as persistNotes,
  renameCharacter as doRenameCharacter,
  switchTab,
  activateGmModeToggle as doActivateGmModeToggle,
  spawnPremadeCharacter as doSpawnPremadeCharacter,
  markMoved as doMarkMoved,
  generateNpcTurn as doGenerateNpcTurn,
  printCharacterSheet as doPrintCharacterSheet,
  toggleGmTurnCharacter as doToggleGmTurnCharacter,
  selectAllGmTurnCharacters as doSelectAllGmTurnCharacters,
  clearGmTurnCharacters as doClearGmTurnCharacters,
  addInitiativeEntry as doAddInitiativeEntry,
  addRosterToInitiativeTracker as doAddRosterToInitiativeTracker,
  removeInitiativeEntry as doRemoveInitiativeEntry,
  updateInitiativeEntry as doUpdateInitiativeEntry,
  setInitiativeActiveEntry as doSetInitiativeActiveEntry,
  nextInitiativeTurn as doNextInitiativeTurn,
  resetInitiativeRound as doResetInitiativeRound,
  clearInitiativeTracker as doClearInitiativeTracker
} from './actions.js'
import { render } from './render.js'
import { state, activeCharacter, resetItemFilters } from './state.js'
import { TAB_IDS } from './constants.js'
import { DEFAULT_BACKGROUND } from './backgrounds.js'
import { debounce, toast } from './utils.js'
import { saveNow } from './storage.js'
import { subcategoriesFor, visibleSubcategories } from './skills.js'
import { syncUrlState } from './url-state.js'

let initialized = false

const debouncedSkillSearch = debounce(value => {
  state.skillSearch = value
  render({ content: true })
}, 200)

const debouncedCraftSearch = debounce(value => {
  state.craftSearch = value
  render({ content: true })
}, 200)

const debouncedItemSearch = debounce(value => {
  state.itemSearch = value
  state.itemPage = 0
  render({ content: true })
}, 200)

const debouncedNotesSave = debounce(value => {
  persistNotes(value, true)
}, 400)

const debouncedGmPremadeSearch = debounce(value => {
  state.gmPremadeSearch = value
  render({ content: true })
}, 200)

const clickActions = {
  selectCharacter(target) {
    selectCharacterById(target.dataset.selectCharacter)
    document.querySelector('#sidebar')?.classList.remove('open')
  },
  duplicateCharacter(target) { doDuplicateCharacter(target.dataset.duplicateCharacter) },
  learnSkill(target) { doLearnSkill(target.dataset.learnSkill) },
  refundSkill(target) { doRefundSkill(target.dataset.refundSkill) },
  toggleSkill(target) { doToggleSkill(target.dataset.toggleSkill) },
  useSkill(target) { doUseSkill(target.dataset.useSkill) },
  skillCategory(target) {
    state.skillCategory = target.dataset.skillCategory || state.skillCategory
    const character = activeCharacter()
    state.skillSubcategory = visibleSubcategories(state.skillCategory, character)[0] || subcategoriesFor(state.skillCategory, character)[0] || ''
    render({ content: true })
    syncUrlState()
  },
  skillSubcategory(target) {
    state.skillSubcategory = target.dataset.skillSubcategory || state.skillSubcategory
    render({ content: true })
    syncUrlState()
  },
  upgradeStat(target) { doUpgradeStat(target.dataset.upgradeStat) },
  refundStat(target) { doRefundStat(target.dataset.refundStat) },
  buyItem(target) { doBuyItem(target.dataset.buyItem, false) },
  grantItem(target) { doBuyItem(target.dataset.grantItem, true) },
  craftRecipe(target) { doCraftRecipe(target.dataset.craftRecipe) },
  removeItem(target) { doRemoveInventoryEntry(target.dataset.removeItem) },
  equipItem(target) { doEquipItem(target.dataset.equipItem) },
  equipOffhand(target) { doEquipItem(target.dataset.equipOffhand, 'offhand') },
  markMoved() { doMarkMoved() },
  unequip(target) { doUnequip(target.dataset.unequip) },
  resetItemFilters() {
    resetItemFilters()
    render({ content: true })
  },
  itemPagePrev() {
    state.itemPage = Math.max(0, state.itemPage - 1)
    render({ content: true })
    syncUrlState()
  },
  itemPageNext() {
    state.itemPage += 1
    render({ content: true })
    syncUrlState()
  },
  saveNotesButton: () => {
    const notes = document.querySelector('#character-notes')
    persistNotes(notes?.value || '', false)
  },
  healFull() { doHeal() },
  staminaFull() { doRestoreStamina() },
  processTurn() { doProcessTurn() },
  removeEffect(target) { doRemoveStatusEffect(target.dataset.removeEffect) },
  addEffect() {
    doAddStatusEffect(
      document.querySelector('#effect-select')?.value,
      document.querySelector('#effect-duration')?.value,
      document.querySelector('#effect-potency')?.value,
      document.querySelector('#effect-notes')?.value || ''
    )
  },
  adjustResource(target) {
    doAdjustResource(target.dataset.adjustResource, Number(target.dataset.amount || 0))
  },
  fullResource(target) { doFillResource(target.dataset.fullResource) },
  coin(target) { doAdjustCurrency(Number(target.dataset.coin || 0)) },
  rollDice() {
    state.dice.count = Math.max(1, Math.min(40, Number(document.querySelector('#dice-count')?.value || 1)))
    state.dice.sides = Math.max(2, Math.min(100, Number(document.querySelector('#dice-sides')?.value || 20)))
    state.dice.modifier = Math.max(-100, Math.min(100, Number(document.querySelector('#dice-mod')?.value || 0)))
    state.lastRoll = {
      ...doRollDice(state.dice.count, state.dice.sides, state.dice.modifier),
      modifier: state.dice.modifier
    }
    render({ content: true })
  },
  exportCharacter() { exportData(false) },
  exportAllBottom() { exportData(true) },
  deleteActive() {
    const character = activeCharacter()
    if (character) doDeleteCharacter(character.id)
  },
  toggleGmMode() { doActivateGmModeToggle() },
  spawnPremade(target) {
    const premadeId = target.dataset.spawnPremade
    const countInput = target.closest('.premade-card')?.querySelector('[data-premade-count-for]')
    const count = Math.max(1, Math.min(10, Number(countInput?.value || 1)))
    doSpawnPremadeCharacter(premadeId, count)
  },
  generateNpcTurn() { doGenerateNpcTurn() },
  printCharacterSheet() { doPrintCharacterSheet() },
  selectAllGmTurn() { doSelectAllGmTurnCharacters() },
  clearGmTurn() { doClearGmTurnCharacters() },
  addInitiativeEntry() { doAddInitiativeEntry() },
  addRosterInitiative() { doAddRosterToInitiativeTracker() },
  removeInitiative(target) { doRemoveInitiativeEntry(target.dataset.removeInitiative) },
  setInitiativeActive(target) { doSetInitiativeActiveEntry(target.dataset.setInitiativeActive) },
  initiativeNext() { doNextInitiativeTurn() },
  initiativeResetRound() { doResetInitiativeRound() },
  clearInitiative() { doClearInitiativeTracker() },
  gmPremadeCategory(target) {
    state.gmPremadeCategory = target.dataset.gmPremadeCategory || 'all'
    render({ content: true })
  }
}

function invokeDataAction(event, actions) {
  let node = event.target instanceof Element ? event.target : null
  while (node && node !== document.documentElement) {
    if (node.dataset) {
      for (const [key, handler] of Object.entries(actions)) {
        if (node.dataset[key] !== undefined) {
          handler(node, event)
          return true
        }
      }
    }
    node = node.parentElement
  }
  return false
}

function handleCreateCharacter() {
  const nameInput = document.querySelector('#new-name')
  const raceInput = document.querySelector('#new-race')
  const name = nameInput?.value?.trim() || ''
  const raceId = raceInput?.value || ''
  if (!name) return toast('Give the poor little hero a name first.')
  const options = {}
  if (raceId === 'dragonborn') {
    const affinity = document.querySelector('#new-affinity')?.value || ''
    if (!affinity) return toast('Dragonborn must choose an elemental affinity.')
    options.elementalAffinity = affinity
  }
  if (raceId === 'human') {
    const starter = document.querySelector('#new-starter-skill')?.value || ''
    if (!starter) return toast('Humans get one free Tier 1 weapon skill — pick yours.')
    options.humanStarterSkill = starter
  }
  options.background = document.querySelector('#new-background')?.value || DEFAULT_BACKGROUND
  createAndSelectCharacter(name, raceId, options)
  if (nameInput) nameInput.value = ''
}

function handleTabShortcut(event) {
  if (event.ctrlKey || event.metaKey || event.altKey) return false
  if (/^(INPUT|TEXTAREA|SELECT)$/i.test(event.target?.tagName || '')) return false
  if (event.target?.isContentEditable) return false
  if (!/^[1-7]$/.test(event.key)) return false
  const nextTab = TAB_IDS[Number(event.key) - 1]
  if (!nextTab) return false
  event.preventDefault()
  switchTab(nextTab)
  return true
}

function initStaticEvents() {
  document.querySelector('#create-character')?.addEventListener('click', handleCreateCharacter)

  document.querySelector('#new-name')?.addEventListener('keydown', event => {
    if (event.key === 'Enter') handleCreateCharacter()
  })

  document.querySelector('#tabbar')?.addEventListener('click', event => {
    const button = event.target.closest('button[data-tab]')
    if (!button) return
    switchTab(button.dataset.tab)
  })

  document.querySelector('#export-all')?.addEventListener('click', () => exportData(true))
  document.querySelector('#import-save')?.addEventListener('change', async event => {
    await importData(event.target.files?.[0])
    event.target.value = ''
  })

  document.querySelector('#open-sidebar')?.addEventListener('click', () => {
    document.querySelector('#sidebar')?.classList.add('open')
  })
  document.querySelector('#collapse-sidebar')?.addEventListener('click', () => {
    document.querySelector('#sidebar')?.classList.toggle('open')
  })

  document.addEventListener('click', event => {
    const sidebar = document.querySelector('#sidebar')
    if (!sidebar?.classList.contains('open')) return
    if (event.target.closest('#sidebar') || event.target.closest('#open-sidebar')) return
    sidebar.classList.remove('open')
  })

  document.addEventListener('keydown', event => {
    if (handleTabShortcut(event)) return
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 's') {
      event.preventDefault()
      const notes = document.querySelector('#character-notes')
      if (notes) {
        debouncedNotesSave.cancel?.()
        persistNotes(notes.value || '', false)
      }
      saveNow()
      toast('Saved.')
    }
  })
}

function initDelegatedEvents() {
  document.addEventListener('click', event => {
    invokeDataAction(event, clickActions)
  })

  document.addEventListener('input', event => {
    const target = event.target
    if (!(target instanceof HTMLElement)) return

    if (target.id === 'skill-search') {
      debouncedSkillSearch(target.value || '')
      return
    }
    if (target.id === 'gm-premade-search') {
      debouncedGmPremadeSearch(target.value || '')
      return
    }
    if (target.id === 'gm-premade-sort') {
      state.gmPremadeSort = target.value || 'level-desc'
      render({ content: true })
      return
    }
    if (target.id === 'item-search') {
      debouncedItemSearch(target.value || '')
      return
    }
    if (target.id === 'craft-search') {
      debouncedCraftSearch(target.value || '')
      return
    }
    if (target.id === 'character-notes') {
      state.notesDirty = true
      debouncedNotesSave(target.value || '')
    }
  })

  document.addEventListener('change', event => {
    const target = event.target
    if (!(target instanceof HTMLElement)) return

    if (target.matches('[data-resource-input]')) {
      doSetResource(target.dataset.resourceInput, Number(target.value || 0))
      return
    }
    if (target.matches('[data-gil-input]')) {
      doSetGil(Number(target.value || 0))
      return
    }
    if (target.matches('[data-money-input]')) {
      doSetGil(Number(target.value || 0))
      return
    }

    if (target.id === 'item-type') {
      state.itemType = target.value
      state.itemPage = 0
      render({ content: true })
      return
    }
    if (target.id === 'item-source') {
      state.itemSource = target.value
      state.itemPage = 0
      render({ content: true })
      return
    }
    if (target.id === 'item-rarity') {
      state.itemRarity = target.value
      state.itemPage = 0
      render({ content: true })
      return
    }
    if (target.id === 'item-feature') {
      state.itemFeature = target.value
      state.itemPage = 0
      render({ content: true })
      return
    }
    if (target.id === 'item-sort') {
      state.itemSort = target.value
      render({ content: true })
      return
    }
    if (target.id === 'craft-profession') {
      state.craftProfession = target.value || 'all'
      render({ content: true })
      return
    }
    if (target.id === 'craft-learned-only') {
      state.craftLearnedOnly = Boolean(target.checked)
      render({ content: true })
      return
    }
    if (target.id === 'change-race') {
      doSetRace(target.value)
      return
    }
    if (target.id === 'change-affinity') {
      doSetElementalAffinity(target.value)
      return
    }
    if (target.id === 'rename-character') doRenameCharacter(target.value)
  })

  document.addEventListener('change', event => {
    const target = event.target
    if (!(target instanceof HTMLElement)) return

    if (target.dataset.gmTurnCharacter) {
      doToggleGmTurnCharacter(target.dataset.gmTurnCharacter, target.checked)
      return
    }
    if (target.dataset.initiativeName) {
      doUpdateInitiativeEntry(target.dataset.initiativeName, { name: target.value })
      return
    }
    if (target.dataset.initiativeValue) {
      doUpdateInitiativeEntry(target.dataset.initiativeValue, { initiative: target.value })
    }
  })
}

export function initEvents() {
  if (initialized) return
  initialized = true
  initStaticEvents()
  initDelegatedEvents()
}
