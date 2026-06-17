import { TAB_IDS } from './constants.js'
import { parseUrlState } from './url-state.js'

export const state = {
  characters: [],
  activeId: null,
  tab: 'character',
  skillCategory: 'weapons',
  skillSubcategory: 'sword',
  skillSearch: '',
  itemSearch: '',
  itemType: 'all',
  itemSource: 'shop',
  itemRarity: 'all',
  itemFeature: 'all',
  itemSort: 'name',
  itemPage: 0,
  craftSearch: '',
  craftProfession: 'all',
  craftLearnedOnly: true,
  dice: { count: 1, sides: 20, modifier: 0 },
  lastRoll: null,
  notesDirty: false,
  gmMode: false,
  gmPremadeSearch: '',
  gmPremadeCategory: 'all',
  gmPremadeSort: 'level-desc',
  gmNpcTurnCharacterIds: [],
  lastNpcTurns: [],
  initiativeTracker: {
    entries: [],
    activeEntryId: null
  }
}

export function activeCharacter() {
  return state.characters.find(character => character.id === state.activeId) || null
}

export function applyUrlState() {
  const fromUrl = parseUrlState()
  let tab = fromUrl.tab || ''
  if (tab === 'inventory') tab = 'shop'
  if (tab && TAB_IDS.includes(tab)) state.tab = tab
  if (fromUrl.skillCategory) {
    state.skillCategory = fromUrl.skillCategory === 'monster' ? 'racial' : fromUrl.skillCategory
  }
  if (fromUrl.skillSubcategory) state.skillSubcategory = fromUrl.skillSubcategory
  if (fromUrl.itemSource) state.itemSource = fromUrl.itemSource
  if (fromUrl.itemPage != null) state.itemPage = fromUrl.itemPage
}

export function resetItemFilters() {
  state.itemSearch = ''
  state.itemType = 'all'
  state.itemSource = 'shop'
  state.itemRarity = 'all'
  state.itemFeature = 'all'
  state.itemSort = 'name'
  state.itemPage = 0
}
