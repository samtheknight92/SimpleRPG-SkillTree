import { getGameData } from './data.js'
import { state } from './state.js'
import { normalizeCharacter } from './character.js'
import { characterLevelInfo } from './level.js'
import { countCharactersWithBaseName } from './character-naming.js'
let cache = null
const levelCache = new Map()

export const PREMADE_SORT_OPTIONS = [
  ['name', 'Name A–Z'],
  ['name-desc', 'Name Z–A'],
  ['level-desc', 'Level (high → low)'],
  ['level-asc', 'Level (low → high)'],
  ['category', 'Category']
]

export function getPremadeCharactersData() {
  if (cache) return cache
  try {
    cache = getGameData()['premade-characters'] || []
  } catch {
    cache = []
  }
  return cache
}

export function premadeTemplateLevel(entry) {
  if (!entry?.premadeId) return 0
  if (levelCache.has(entry.premadeId)) return levelCache.get(entry.premadeId)
  const normalized = normalizeCharacter({
    ...entry,
    id: `preview_${entry.premadeId}`,
    premadeId: entry.premadeId
  })
  const level = characterLevelInfo(normalized).level
  levelCache.set(entry.premadeId, level)
  return level
}

export function sortPremadeCharacters(list, sort = 'name') {
  const rows = list.map(entry => ({ entry, level: premadeTemplateLevel(entry) }))
  rows.sort((a, b) => {
    switch (sort) {
      case 'name-desc':
        return b.entry.name.localeCompare(a.entry.name)
      case 'level-desc':
        return b.level - a.level || a.entry.name.localeCompare(b.entry.name)
      case 'level-asc':
        return a.level - b.level || a.entry.name.localeCompare(b.entry.name)
      case 'category':
        return (a.entry.category || '').localeCompare(b.entry.category || '')
          || b.level - a.level
          || a.entry.name.localeCompare(b.entry.name)
      default:
        return a.entry.name.localeCompare(b.entry.name)
    }
  })
  return rows
}

export function listPremadeCharacters() {
  return [...getPremadeCharactersData()].sort((a, b) => a.name.localeCompare(b.name))
}

export function getPremadeCharacter(premadeId) {
  return getPremadeCharactersData().find(entry => entry.premadeId === premadeId) || null
}

export function premadeCategories() {
  const categories = new Set(listPremadeCharacters().map(entry => entry.category || 'npc'))
  return ['all', ...[...categories].sort()]
}

export function filterPremadeCharacters({ search = '', category = 'all', sort = 'name' } = {}) {
  const query = String(search || '').trim().toLowerCase()
  const filtered = listPremadeCharacters().filter(entry => {
    if (category !== 'all' && entry.category !== category) return false
    if (!query) return true
    const level = premadeTemplateLevel(entry)
    const haystack = `${entry.name} ${entry.premadeId} ${entry.race} ${entry.category} ${entry.notes || ''} level ${level}`.toLowerCase()
    return haystack.includes(query)
  })
  return sortPremadeCharacters(filtered, sort)
}

export function countPremadeInRoster(premadeId) {
  const template = getPremadeCharacter(premadeId)
  if (!template) return 0
  return countCharactersWithBaseName(template.name, state.characters.map(c => c.name))
}

/** @deprecated Use countPremadeInRoster — premades can be added multiple times now. */
export function premadeInUse(premadeId) {
  return countPremadeInRoster(premadeId) > 0
}

export function premadeRosterIds() {
  return new Set(state.characters.map(character => character.premadeId).filter(Boolean))
}
