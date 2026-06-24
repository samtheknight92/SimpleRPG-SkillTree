import { TAB_IDS, RETIRED_SKILL_SUBCATEGORIES } from './constants.js'
import { parseUrlState } from './url-state.js'

export const state = {
  characters: [],
  activeId: null,
  tab: 'character',
  skillCategory: 'weapons',
  skillSubcategory: 'sword',
  skillSearch: '',
  itemSearch: '',
  itemCategory: 'all',
  itemSource: 'shop',
  itemRarity: 'all',
  itemBuyableOnly: true,
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
  glossarySearch: '',
  gmNpcTurnCharacterIds: [],
  lastNpcTurns: [],
  characterFolderNames: [],
  characterFolderOrder: [],
  characterFolderOpen: {},
  gmSpawnFolder: '',
  homebrewSearch: '',
  homebrewSelected: {},
  homebrewEditingId: null,
  homebrewDraft: null,
  homebrewShowEffectPicker: false,
  homebrewEffectSearch: '',
  homebrewShowCounterOptions: false,
  homebrewEditorKind: null,
  homebrewListFilter: 'all',
  homebrewSkillDraft: null,
  homebrewSkillEditingId: null,
  homebrewSkillShowEffectPicker: false,
  homebrewSkillEffectSearch: '',
  homebrewSkillShowUseEffectPicker: false,
  homebrewSkillUseEffectSearch: '',
  homebrewSkillSelected: {},
  homebrewRaceDraft: null,
  homebrewRaceEditingId: null,
  homebrewRaceSelected: {},
  homebrewRaceShowEffectPicker: false,
  homebrewRaceEffectSearch: '',
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
  if (fromUrl.skillSubcategory) {
    state.skillSubcategory = RETIRED_SKILL_SUBCATEGORIES[fromUrl.skillSubcategory] || fromUrl.skillSubcategory
  }
  if (fromUrl.itemSource) state.itemSource = fromUrl.itemSource
  if (fromUrl.itemPage != null) state.itemPage = fromUrl.itemPage
}

export function resetItemFilters() {
  state.itemSearch = ''
  state.itemCategory = 'all'
  state.itemSource = 'shop'
  state.itemRarity = 'all'
  state.itemBuyableOnly = true
  state.itemSort = 'name'
  state.itemPage = 0
}
