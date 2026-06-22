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
  grantCraftRecipe as doGrantCraftRecipe,
  applyEnchantment as doApplyEnchantment,
  removeEnchantment as doRemoveEnchantment,
  recordEnchantShieldAbsorption as doRecordEnchantShieldAbsorption,
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
  setCharacterFolder as doSetCharacterFolder,
  createCharacterFolder as doCreateCharacterFolder,
  rememberRosterFolderOpen as doRememberRosterFolderOpen,
  moveCharacterFolder as doMoveCharacterFolder,
  copyCharacterFolder as doCopyCharacterFolder,
  deleteCharacterFolder as doDeleteCharacterFolder,
  setGmSpawnFolder as doSetGmSpawnFolder,
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
import { closeActionBarSkillSheet, tryOpenActionBarSkillSheet } from './action-bar-sheet.js'
import { debounce, toast, toastCombat } from './utils.js'
import { applyTheme, applyAppearance } from './themes.js'
import { saveNow } from './storage.js'
import { subcategoriesFor, visibleSubcategories } from './skills.js'
import { syncUrlState } from './url-state.js'

let initialized = false
let sidebarScrollLockY = 0

function closeAllCharacterMoveMenus() {
  document.querySelectorAll('[data-character-move-menu]').forEach(menu => {
    menu.hidden = true
  })
  document.querySelectorAll('[data-toggle-character-move]').forEach(button => {
    button.setAttribute('aria-expanded', 'false')
  })
}

function toggleCharacterMoveMenu(characterId) {
  const menu = document.querySelector(`[data-character-move-menu="${CSS.escape(characterId)}"]`)
  const button = document.querySelector(`[data-toggle-character-move="${CSS.escape(characterId)}"]`)
  if (!menu || !button) return
  const willOpen = menu.hidden
  closeAllCharacterMoveMenus()
  if (willOpen) {
    menu.hidden = false
    button.setAttribute('aria-expanded', 'true')
  }
}

function closeAllFolderMenus() {
  document.querySelectorAll('[data-folder-menu]').forEach(menu => {
    menu.hidden = true
  })
  document.querySelectorAll('[data-toggle-folder-menu]').forEach(button => {
    button.setAttribute('aria-expanded', 'false')
  })
}

function toggleFolderMenu(folderKey) {
  const menu = document.querySelector(`[data-folder-menu="${CSS.escape(folderKey)}"]`)
  const button = document.querySelector(`[data-toggle-folder-menu="${CSS.escape(folderKey)}"]`)
  if (!menu || !button) return
  const willOpen = menu.hidden
  closeAllFolderMenus()
  closeAllCharacterMoveMenus()
  if (willOpen) {
    menu.hidden = false
    button.setAttribute('aria-expanded', 'true')
  }
}

function handleFolderMenuClick(event) {
  const toggleButton = event.target.closest('[data-toggle-folder-menu]')
  if (toggleButton) {
    event.preventDefault()
    event.stopPropagation()
    toggleFolderMenu(toggleButton.dataset.toggleFolderMenu)
    return true
  }

  const moveUp = event.target.closest('[data-folder-move-up]')
  if (moveUp && !moveUp.disabled) {
    event.preventDefault()
    event.stopPropagation()
    doMoveCharacterFolder(moveUp.dataset.folderMoveUp, 'up')
    closeAllFolderMenus()
    return true
  }

  const moveDown = event.target.closest('[data-folder-move-down]')
  if (moveDown && !moveDown.disabled) {
    event.preventDefault()
    event.stopPropagation()
    doMoveCharacterFolder(moveDown.dataset.folderMoveDown, 'down')
    closeAllFolderMenus()
    return true
  }

  const copyBtn = event.target.closest('[data-copy-folder]')
  if (copyBtn) {
    event.preventDefault()
    event.stopPropagation()
    doCopyCharacterFolder(copyBtn.dataset.copyFolder)
    closeAllFolderMenus()
    return true
  }

  const deleteBtn = event.target.closest('[data-delete-folder]')
  if (deleteBtn) {
    event.preventDefault()
    event.stopPropagation()
    doDeleteCharacterFolder(deleteBtn.dataset.deleteFolder)
    closeAllFolderMenus()
    return true
  }

  if (!event.target.closest('.character-folder-picker')) {
    closeAllFolderMenus()
  }
  return false
}

function handleCharacterMoveMenuClick(event) {
  const toggleButton = event.target.closest('[data-toggle-character-move]')
  if (toggleButton) {
    event.stopPropagation()
    closeAllFolderMenus()
    toggleCharacterMoveMenu(toggleButton.dataset.toggleCharacterMove)
    return true
  }

  const moveButton = event.target.closest('[data-move-character]')
  if (moveButton) {
    event.stopPropagation()
    doSetCharacterFolder(moveButton.dataset.moveCharacter, moveButton.dataset.moveFolder ?? '')
    closeAllCharacterMoveMenus()
    return true
  }

  if (!event.target.closest('.character-move-picker')) {
    closeAllCharacterMoveMenus()
  }
  return false
}

function isSidebarMobile() {
  return window.matchMedia('(max-width: 1100px)').matches
}

function isSidebarOpen() {
  const sidebar = document.querySelector('#sidebar')
  const shell = document.querySelector('.app-shell')
  if (!sidebar) return false
  if (isSidebarMobile()) return sidebar.classList.contains('open')
  return !shell?.classList.contains('sidebar-collapsed')
}

function setSidebarOpen(open) {
  const sidebar = document.querySelector('#sidebar')
  const backdrop = document.querySelector('#sidebar-backdrop')
  const shell = document.querySelector('.app-shell')
  if (!sidebar) return
  const mobile = isSidebarMobile()

  if (mobile) {
    sidebar.classList.toggle('open', open)
    shell?.classList.remove('sidebar-collapsed')
    document.documentElement.classList.toggle('sidebar-open', open)
    document.body.classList.toggle('sidebar-open', open)

    if (open) {
      sidebarScrollLockY = window.scrollY
      document.body.style.top = `-${sidebarScrollLockY}px`
    } else if (document.body.style.top) {
      document.body.style.top = ''
      window.scrollTo(0, sidebarScrollLockY)
    }

    if (backdrop) {
      backdrop.hidden = !open
      backdrop.setAttribute('aria-hidden', open ? 'false' : 'true')
    }
    return
  }

  sidebar.classList.remove('open')
  shell?.classList.toggle('sidebar-collapsed', !open)
  document.documentElement.classList.remove('sidebar-open')
  document.body.classList.remove('sidebar-open')
  if (document.body.style.top) {
    document.body.style.top = ''
    window.scrollTo(0, sidebarScrollLockY)
  }
  if (backdrop) {
    backdrop.hidden = true
    backdrop.setAttribute('aria-hidden', 'true')
  }
}

function syncSidebarLayout() {
  const sidebar = document.querySelector('#sidebar')
  const shell = document.querySelector('.app-shell')
  if (!sidebar || !shell) return
  if (isSidebarMobile()) {
    shell.classList.remove('sidebar-collapsed')
    setSidebarOpen(sidebar.classList.contains('open'))
  } else {
    setSidebarOpen(!shell.classList.contains('sidebar-collapsed'))
  }
}

function syncSidebarCreatePanel() {
  const panel = document.querySelector('.sidebar-create-details')
  if (!panel) return
  if (window.matchMedia('(max-width: 1100px)').matches) {
    panel.removeAttribute('open')
  } else {
    panel.setAttribute('open', '')
  }
}

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

const debouncedGlossarySearch = debounce(value => {
  state.glossarySearch = value
  render({ content: true })
}, 200)

const clickActions = {
  selectCharacter(target) {
    selectCharacterById(target.dataset.selectCharacter)
    setSidebarOpen(false)
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
  grantCraftRecipe(target) { doGrantCraftRecipe(target.dataset.grantCraftRecipe) },
  removeItem(target) { doRemoveInventoryEntry(target.dataset.removeItem) },
  equipItem(target) { doEquipItem(target.dataset.equipItem) },
  equipOffhand(target) { doEquipItem(target.dataset.equipOffhand, 'offhand') },
  markMoved() { doMarkMoved() },
  unequip(target) { doUnequip(target.dataset.unequip) },
  removeEnchant(target) {
    doRemoveEnchantment(target.dataset.removeEnchant, target.dataset.enchantId)
  },
  applyEnchantGear(target) {
    doApplyEnchantment(target.dataset.applyEnchantGear, target.dataset.applyEnchantScroll)
  },
  shieldSoakGear(target) {
    doRecordEnchantShieldAbsorption(
      target.dataset.shieldSoakGear,
      target.dataset.enchantId,
      target.dataset.shieldSoakAmount
    )
  },
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
    const modifier = state.dice.modifier
    state.lastRoll = {
      ...doRollDice(state.dice.count, state.dice.sides, modifier),
      modifier
    }
    const modText = modifier ? ` · modifier ${modifier >= 0 ? '+' : ''}${modifier}` : ''
    toastCombat(`Roll: ${state.lastRoll.total} (${state.lastRoll.rolls.join(', ')}${modText})`)
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
  },
  setTheme(target) {
    applyTheme(target.dataset.setTheme)
  },
  setAppearance(target) {
    applyAppearance(target.dataset.setAppearance)
  },
  createCharacterFolder() {
    const name = prompt('Folder name (e.g. Forest Ambush, Boss Room):', '')
    if (name != null) doCreateCharacterFolder(name)
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

  document.querySelector('#open-sidebar')?.addEventListener('click', event => {
    event.stopPropagation()
    setSidebarOpen(!isSidebarOpen())
  })
  document.querySelector('#collapse-sidebar')?.addEventListener('click', event => {
    event.stopPropagation()
    setSidebarOpen(!isSidebarOpen())
  })
  document.querySelector('#sidebar-backdrop')?.addEventListener('click', () => {
    setSidebarOpen(false)
  })

  syncSidebarCreatePanel()
  syncSidebarLayout()
  window.addEventListener('resize', () => {
    syncSidebarCreatePanel()
    syncSidebarLayout()
  }, { passive: true })

  document.addEventListener('touchmove', event => {
    if (!document.body.classList.contains('sidebar-open')) return
    if (event.target.closest('#sidebar')) return
    event.preventDefault()
  }, { passive: false })

  document.addEventListener('click', event => {
    if (!isSidebarMobile()) return
    if (!isSidebarOpen()) return
    if (event.target.closest('#sidebar') || event.target.closest('#open-sidebar')) return
    setSidebarOpen(false)
  })

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      if (!document.querySelector('#action-bar-skill-sheet')?.hidden) {
        closeActionBarSkillSheet()
        return
      }
      if (isSidebarOpen()) {
        setSidebarOpen(false)
        return
      }
    }
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
    if (tryOpenActionBarSkillSheet(event)) return
    if (handleFolderMenuClick(event)) return
    if (handleCharacterMoveMenuClick(event)) return
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
    if (target.id === 'glossary-search') {
      debouncedGlossarySearch(target.value || '')
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

    if (target.id === 'item-category') {
      state.itemCategory = target.value || 'all'
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
    if (target.id === 'item-sort') {
      state.itemSort = target.value
      render({ content: true })
      return
    }
    if (target.id === 'item-buyable-only') {
      state.itemBuyableOnly = Boolean(target.checked)
      state.itemPage = 0
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
    if (target.id === 'gm-spawn-folder') {
      doSetGmSpawnFolder(target.value)
    }
  })

  document.addEventListener('toggle', event => {
    const details = event.target
    if (!(details instanceof HTMLDetailsElement)) return
    if (!details.classList.contains('character-folder-details')) return
    const key = details.dataset.folderKey
    if (!key) return
    doRememberRosterFolderOpen(key, details.open)
  }, true)

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
