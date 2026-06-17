export const SAVE_VERSION = 2
export const STORAGE_KEY = 'lumenforge_save_v2'
export const LEGACY_STORAGE_KEY = 'lumenforge_characters_v1'
export const LEGACY_ACTIVE_KEY = 'lumenforge_active_character_v1'
/** Legacy item prices still use gold/silver/copper — 1 gil = 1 copper equivalent. */
export const CURRENCY_RATE = { gold: 2500, silver: 100, copper: 1 }
export const DEFAULT_STARTING_GIL = 2400
export const DEFAULT_STARTING_LUMENS = 113

export const DRAGONBORN_AFFINITIES = ['fire', 'ice', 'thunder', 'earth', 'wind', 'water', 'darkness', 'light']
export const ITEMS_PER_PAGE = 48

export const DEFAULT_STATS = {
  hp: 10,
  stamina: 10,
  strength: -3,
  magicPower: -3,
  accuracy: -3,
  speed: 2,
  physicalDefence: 8,
  magicalDefence: 8
}

export const STAT_RULES = {
  hp: { label: 'HP', cost: 3, min: 1, max: 500, desc: 'Maximum health. Simple, boring, important. Like vegetables, but with less betrayal.' },
  stamina: { label: 'Stamina', cost: 4, min: 1, max: 200, desc: 'Fuel for active skills, stances, spells and heroic nonsense.' },
  strength: { label: 'Strength', cost: 10, min: -5, max: 15, desc: 'Physical damage, grappling and hitting problems until they become smaller problems.' },
  magicPower: { label: 'Magic Power', cost: 10, min: -5, max: 15, desc: 'Spell power and magical effectiveness.' },
  accuracy: { label: 'Accuracy', cost: 8, min: -5, max: 12, desc: 'Added to d20 attack rolls. Meet or beat the target\'s Physical Defence (physical attacks) or Magical Defence (magical attacks) to hit.' },
  speed: { label: 'Speed', cost: 12, min: 1, max: 20, desc: 'Turn order, movement feel and evasion-style checks.' },
  physicalDefence: { label: 'Physical Defence', cost: 10, min: 1, max: 30, desc: 'Physical AC — melee, ranged and other physical attacks must roll d20 + accuracy at or above this to hit (otherwise miss/block).' },
  magicalDefence: { label: 'Magical Defence', cost: 10, min: 1, max: 30, desc: 'Magical AC — spells and magical attacks must roll d20 + accuracy at or above this to hit (otherwise miss/block).' }
}

export const TAB_IDS = ['character', 'skills', 'stats', 'shop', 'craft', 'gm', 'notes']

/**
 * Skill tree categories hidden from the Skills tab until ready.
 * TODO: Re-enable professions when crafting / profession items are wired up.
 */
export const HIDDEN_SKILL_CATEGORIES = ['professions']

/**
 * TODO: Item enchantment slots are shown on gear but there is no enchant UI yet —
 * consider re-adding an enchantment workflow (apply scrolls, slot limits, etc.).
 */
export const ENCHANTMENTS_PLANNED = true

export const DISPLAY_CATEGORIES = {
  weapons: 'Weapons',
  magic: 'Magic',
  professions: 'Professions',
  careers: 'Careers',
  fusion: 'Fusion',
  ascension: 'Ascension',
  ultimate: 'Ultimate',
  racial: 'Race'
}
