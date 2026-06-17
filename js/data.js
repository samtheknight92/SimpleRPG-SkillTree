const FILES = [
  'races',
  'skills',
  'items',
  'profession-items',
  'discoverable-items',
  'monster-loot',
  'effects',
  'skill-meta',
  'premade-characters'
]

let gameData = null
let dataVersion = ''

async function fetchJson(path) {
  const query = dataVersion ? `?v=${encodeURIComponent(dataVersion)}` : ''
  const response = await fetch(`${path}${query}`, { cache: 'no-store' })
  if (!response.ok) throw new Error(`Failed to load ${path}`)
  return response.json()
}

export async function loadGameData() {
  try {
    const manifest = await fetchJson('data/json/manifest.json')
    dataVersion = String(manifest?.version || '')
  } catch {
    dataVersion = ''
  }

  const entries = await Promise.all(FILES.map(async file => {
    const data = await fetchJson(`data/json/${file}.json`)
    return [file, data]
  }))
  gameData = Object.fromEntries(entries)
  return gameData
}
export function getGameData() {
  if (!gameData) throw new Error('Game data not loaded')
  return gameData
}

export const getRacesData = () => getGameData().races
export const getSkillsData = () => getGameData().skills
export const getItemsData = () => getGameData().items
export const getEffectsData = () => getGameData().effects
export const getSkillMeta = () => getGameData()['skill-meta']
