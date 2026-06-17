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

export async function loadGameData() {
  const entries = await Promise.all(FILES.map(async file => {
    const response = await fetch(`data/json/${file}.json`)
    if (!response.ok) throw new Error(`Failed to load data/json/${file}.json`)
    return [file, await response.json()]
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
