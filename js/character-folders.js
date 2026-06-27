/** Sidebar roster folders — GM encounter prep. */

export const FOLDER_FILTER_ALL = 'all'
export const FOLDER_FILTER_UNFILED = '__unfiled__'

export function normalizeFolderName(value) {
  return String(value ?? '').trim().slice(0, 48)
}

export function characterFolder(character) {
  return normalizeFolderName(character?.folder)
}

export function listCharacterFolders(state) {
  syncCharacterFolderOrder(state)
  return [...(state.characterFolderOrder || [])]
}

/** Keep folder order in sync with characters and empty folder slots. */
export function syncCharacterFolderOrder(state) {
  const seen = new Set()
  const order = []

  const push = name => {
    const folder = normalizeFolderName(name)
    if (!folder || seen.has(folder)) return
    seen.add(folder)
    order.push(folder)
  }

  for (const name of state.characterFolderOrder || []) push(name)
  for (const character of state.characters || []) push(character.folder)
  for (const name of state.characterFolderNames || []) push(name)

  state.characterFolderOrder = order
  state.characterFolderNames = [...order]
}

export function folderOrderIndex(state, folderName) {
  const folder = normalizeFolderName(folderName)
  return listCharacterFolders(state).indexOf(folder)
}

export function filterCharactersByFolder(characters, filter) {
  if (filter === FOLDER_FILTER_ALL) return characters
  if (filter === FOLDER_FILTER_UNFILED) return characters.filter(c => !characterFolder(c))
  return characters.filter(c => characterFolder(c) === filter)
}

export function folderFilterOptions(state) {
  const total = state.characters.length
  const unfiledCount = state.characters.filter(c => !characterFolder(c)).length
  const options = [
    { value: FOLDER_FILTER_ALL, label: `All (${total})` },
    { value: FOLDER_FILTER_UNFILED, label: `Unfiled (${unfiledCount})` }
  ]
  for (const name of listCharacterFolders(state)) {
    const count = state.characters.filter(c => characterFolder(c) === name).length
    options.push({ value: name, label: `${name} (${count})` })
  }
  return options
}

export function folderAssignOptions(state, current = '') {
  const currentNorm = normalizeFolderName(current)
  const folders = listCharacterFolders(state)
  if (currentNorm && !folders.includes(currentNorm)) folders.unshift(currentNorm)
  return [
    { value: '', label: 'Unfiled' },
    ...folders.map(name => ({ value: name, label: name }))
  ]
}

export function ensureFolderRegistered(state, folderName) {
  const folder = normalizeFolderName(folderName)
  if (!folder) return ''
  syncCharacterFolderOrder(state)
  if (!state.characterFolderOrder.includes(folder)) {
    state.characterFolderOrder.push(folder)
    state.characterFolderNames = [...state.characterFolderOrder]
  }
  return folder
}

/** Sidebar accordion sections: Unfiled + each named folder (includes empty folders). */
export function rosterFolderSections(state) {
  syncCharacterFolderOrder(state)
  const unfiled = []
  const byName = new Map()

  for (const name of state.characterFolderOrder || []) {
    byName.set(name, [])
  }
  for (const character of state.characters || []) {
    const folder = characterFolder(character)
    if (!folder) unfiled.push(character)
    else {
      if (!byName.has(folder)) byName.set(folder, [])
      byName.get(folder).push(character)
    }
  }

  const sections = [{
    key: FOLDER_FILTER_UNFILED,
    label: 'Unfiled',
    characters: unfiled,
    canManage: false
  }]

  for (let i = 0; i < (state.characterFolderOrder || []).length; i++) {
    const name = state.characterFolderOrder[i]
    sections.push({
      key: name,
      label: name,
      characters: byName.get(name) || [],
      canManage: true,
      folderIndex: i,
      folderCount: state.characterFolderOrder.length
    })
  }
  return sections
}

export function isRosterFolderOpen(state, sectionKey, characters) {
  const saved = state.characterFolderOpen?.[sectionKey]
  if (saved != null) return Boolean(saved)
  if (characters.some(c => c.id === state.activeId)) return true
  // Named folders default open; Unfiled defaults closed unless it holds the active character.
  return sectionKey === FOLDER_FILTER_UNFILED ? false : true
}

export function setRosterFolderOpen(state, sectionKey, open) {
  if (!state.characterFolderOpen) state.characterFolderOpen = {}
  state.characterFolderOpen[sectionKey] = Boolean(open)
}
