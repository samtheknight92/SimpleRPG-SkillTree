import { SAVE_VERSION, STORAGE_KEY, LEGACY_STORAGE_KEY, LEGACY_ACTIVE_KEY, RETIRED_SKILL_SUBCATEGORIES } from './constants.js'
import { state } from './state.js'
import { applyFusionNavigationState, parseFusionFiltersFromUrl } from './fusion-nav.js'
import { debounce, toast } from './utils.js'
import { normalizeCharacter, stripCharacterCache } from './character.js'
import { serializeHomebrewForSave, applyHomebrewFromSave } from './homebrew.js'

/** Full app save — characters plus UI, folders, GM tools, and filters. */
export function serializeSave() {
  return {
    version: SAVE_VERSION,
    activeId: state.activeId,
    ui: {
      tab: state.tab,
      skillCategory: state.skillCategory,
      skillSubcategory: state.skillSubcategory,
      skillFusionFilters: state.skillFusionFilters,
      skillSearch: state.skillSearch,
      itemSearch: state.itemSearch,
      itemCategory: state.itemCategory,
      itemSource: state.itemSource,
      itemRarity: state.itemRarity,
      itemBuyableOnly: state.itemBuyableOnly,
      itemSort: state.itemSort,
      itemPage: state.itemPage,
      gmMode: state.gmMode,
      initiativeTracker: state.initiativeTracker,
      gmNpcTurnCharacterIds: state.gmNpcTurnCharacterIds,
      gmNpcTurnFolder: state.gmNpcTurnFolder,
      characterFolderNames: state.characterFolderNames,
      characterFolderOrder: state.characterFolderOrder,
      characterFolderOpen: state.characterFolderOpen,
      gmSpawnFolder: state.gmSpawnFolder
    },
    characters: state.characters.map(character => {
      const clean = stripCharacterCache(character)
      return { ...clean, updated: new Date().toISOString() }
    }),
    homebrew: serializeHomebrewForSave()
  }
}

/** True when the file looks like a full save from serializeSave(), not legacy characters-only export. */
export function isFullSaveExport(parsed) {
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return false
  if (!Array.isArray(parsed.characters)) return false
  return Boolean(parsed.ui) || parsed.activeId != null
}

function applyUiFromSave(ui) {
  if (!ui || typeof ui !== 'object') return
  if (ui.tab) state.tab = ui.tab
  if (ui.skillCategory) state.skillCategory = ui.skillCategory
  if (ui.skillSubcategory) {
    state.skillSubcategory = RETIRED_SKILL_SUBCATEGORIES[ui.skillSubcategory] || ui.skillSubcategory
  }
  if (ui.skillFusionFilters && typeof ui.skillFusionFilters === 'object') {
    state.skillFusionFilters = ui.skillFusionFilters
  } else if (ui.skillFusionNest) {
    state.skillFusionFilters = parseFusionFiltersFromUrl({ fnest: ui.skillFusionNest })
  }
  applyFusionNavigationState(state)
  if (ui.skillSearch != null) state.skillSearch = String(ui.skillSearch)
  if (ui.itemSearch != null) state.itemSearch = String(ui.itemSearch)
  if (ui.itemCategory) state.itemCategory = ui.itemCategory
  if (ui.itemSource) state.itemSource = ui.itemSource
  if (ui.itemRarity) state.itemRarity = ui.itemRarity
  if (ui.itemBuyableOnly != null) state.itemBuyableOnly = Boolean(ui.itemBuyableOnly)
  if (ui.itemSort) state.itemSort = ui.itemSort
  if (ui.itemPage != null) state.itemPage = Number(ui.itemPage) || 0
  if (ui.gmMode != null) state.gmMode = Boolean(ui.gmMode)
  if (ui.initiativeTracker) {
    state.initiativeTracker = {
      entries: Array.isArray(ui.initiativeTracker.entries)
        ? ui.initiativeTracker.entries.map(entry => ({
          id: entry.id || `init_${Math.random().toString(36).slice(2, 9)}`,
          name: String(entry.name || ''),
          initiative: entry.initiative === '' || entry.initiative == null ? '' : Number(entry.initiative)
        }))
        : [],
      activeEntryId: ui.initiativeTracker.activeEntryId || null
    }
  }
  if (Array.isArray(ui.gmNpcTurnCharacterIds)) {
    state.gmNpcTurnCharacterIds = ui.gmNpcTurnCharacterIds
  }
  if (ui.gmNpcTurnFolder != null) {
    state.gmNpcTurnFolder = String(ui.gmNpcTurnFolder || '').trim()
  }
  if (Array.isArray(ui.characterFolderNames)) {
    state.characterFolderNames = ui.characterFolderNames
      .map(name => String(name || '').trim())
      .filter(Boolean)
  }
  if (Array.isArray(ui.characterFolderOrder)) {
    state.characterFolderOrder = ui.characterFolderOrder
      .map(name => String(name || '').trim())
      .filter(Boolean)
  } else if (Array.isArray(ui.characterFolderNames)) {
    state.characterFolderOrder = [...state.characterFolderNames]
  }
  if (ui.characterFolderOpen && typeof ui.characterFolderOpen === 'object') {
    state.characterFolderOpen = ui.characterFolderOpen
  } else if (ui.characterFolderFilter && ui.characterFolderFilter !== 'all') {
    const legacy = String(ui.characterFolderFilter)
    state.characterFolderOpen = { [legacy]: true }
  }
  if (ui.gmSpawnFolder != null) {
    state.gmSpawnFolder = String(ui.gmSpawnFolder || '').trim()
  }
}

function mergeCharactersById(imported) {
  const byId = new Map(state.characters.map(character => [character.id, character]))
  imported.forEach(character => byId.set(character.id, character))
  return [...byId.values()]
}

/**
 * Apply parsed save JSON.
 * @param {object} parsed - Full save or legacy { version, characters }
 * @param {{ replace?: boolean }} options - replace=true restores entire save; false merges characters by id
 */
export function applySavePayload(parsed, { replace = false } = {}) {
  const characters = Array.isArray(parsed) ? parsed : parsed.characters
  if (!Array.isArray(characters)) throw new Error('No characters array')
  const normalized = characters.map(normalizeCharacter)

  if (replace) {
    state.characters = normalized
    state.activeId = parsed.activeId || normalized[0]?.id || null
    if (parsed.ui) applyUiFromSave(parsed.ui)
    if (parsed.homebrew) applyHomebrewFromSave(parsed.homebrew)
  } else {
    state.characters = mergeCharactersById(normalized)
    if (parsed.activeId && state.characters.some(character => character.id === parsed.activeId)) {
      state.activeId = parsed.activeId
    }
  }

  if (!state.characters.some(character => character.id === state.activeId)) {
    state.activeId = state.characters[0]?.id || null
  }
}

function writeSave() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(serializeSave()))
}

export const save = debounce(writeSave, 300)
export function saveNow() {
  save.cancel?.()
  writeSave()
}

export function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (parsed.version === SAVE_VERSION) {
        applySavePayload(parsed, { replace: true })
      } else {
        migrateLegacy(parsed)
      }
    } else {
      migrateFromLegacyKeys()
    }
    if (!state.characters.some(character => character.id === state.activeId)) {
      state.activeId = state.characters[0]?.id || null
    }
  } catch (error) {
    console.error(error)
    state.characters = []
    state.activeId = null
    toast('Save data could not be loaded, so I started clean.')
  }
}

function migrateLegacy(parsed) {
  const characters = Array.isArray(parsed) ? parsed : parsed.characters
  if (!Array.isArray(characters)) throw new Error('Invalid save')
  state.characters = characters.map(normalizeCharacter)
  state.activeId = parsed.activeId || localStorage.getItem(LEGACY_ACTIVE_KEY)
}

function migrateFromLegacyKeys() {
  const raw = localStorage.getItem(LEGACY_STORAGE_KEY)
  if (!raw) return
  state.characters = JSON.parse(raw).map(normalizeCharacter)
  state.activeId = localStorage.getItem(LEGACY_ACTIVE_KEY)
  saveNow()
}

window.addEventListener('beforeunload', saveNow)
