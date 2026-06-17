import { SAVE_VERSION, STORAGE_KEY, LEGACY_STORAGE_KEY, LEGACY_ACTIVE_KEY, RETIRED_SKILL_SUBCATEGORIES } from './constants.js'
import { state } from './state.js'
import { debounce, toast } from './utils.js'
import { normalizeCharacter, stripCharacterCache } from './character.js'

function serializeSave() {
  return {
    version: SAVE_VERSION,
    activeId: state.activeId,
    ui: {
      tab: state.tab,
      skillCategory: state.skillCategory,
      skillSubcategory: state.skillSubcategory,
      itemSource: state.itemSource,
      itemPage: state.itemPage,
      gmMode: state.gmMode,
      initiativeTracker: state.initiativeTracker,
      gmNpcTurnCharacterIds: state.gmNpcTurnCharacterIds
    },
    characters: state.characters.map(character => {
      const clean = stripCharacterCache(character)
      return { ...clean, updated: new Date().toISOString() }
    })
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
        state.characters = (parsed.characters || []).map(normalizeCharacter)
        state.activeId = parsed.activeId || null
        if (parsed.ui) {
          if (parsed.ui.tab) state.tab = parsed.ui.tab
          if (parsed.ui.skillCategory) state.skillCategory = parsed.ui.skillCategory
          if (parsed.ui.skillSubcategory) {
            state.skillSubcategory = RETIRED_SKILL_SUBCATEGORIES[parsed.ui.skillSubcategory] || parsed.ui.skillSubcategory
          }
          if (parsed.ui.itemSource) state.itemSource = parsed.ui.itemSource
          if (parsed.ui.itemPage != null) state.itemPage = parsed.ui.itemPage
          if (parsed.ui.gmMode != null) state.gmMode = Boolean(parsed.ui.gmMode)
          if (parsed.ui.initiativeTracker) {
            state.initiativeTracker = {
              entries: Array.isArray(parsed.ui.initiativeTracker.entries)
                ? parsed.ui.initiativeTracker.entries.map(entry => ({
                  id: entry.id || `init_${Math.random().toString(36).slice(2, 9)}`,
                  name: String(entry.name || ''),
                  initiative: entry.initiative === '' || entry.initiative == null ? '' : Number(entry.initiative)
                }))
                : [],
              activeEntryId: parsed.ui.initiativeTracker.activeEntryId || null
            }
          }
          if (Array.isArray(parsed.ui.gmNpcTurnCharacterIds)) {
            state.gmNpcTurnCharacterIds = parsed.ui.gmNpcTurnCharacterIds
          }
        }
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
