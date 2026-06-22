export const SAVE_VERSION = 2
export const STORAGE_KEY = 'lumenforge_save_v2'
export const LEGACY_STORAGE_KEY = 'lumenforge_characters_v1'
export const LEGACY_ACTIVE_KEY = 'lumenforge_active_character_v1'
/** Legacy item prices still use gold/silver/copper — 1 gil = 1 copper equivalent. */
export const CURRENCY_RATE = { gold: 2500, silver: 100, copper: 1 }
export const DEFAULT_STARTING_GIL = 2400
export const DEFAULT_STARTING_LUMENS = 113

/** Minimum character level to learn a skill of that tier. */
/** +1 vs raw progress floor so tier gates match the same total skill/stat investment as before Level 1 baseline. */
export const TIER_MIN_LEVEL = { 1: 1, 2: 5, 3: 9, 4: 14, 5: 21 }

/** Shop stock unlocks by item rarity (display level). */
export const SHOP_MIN_LEVEL_BY_RARITY = { common: 1, uncommon: 5, rare: 9, epic: 14, legendary: 21 }

/** Default Lumen cost floor by skill tier. */
export const TIER_LUMEN_COST = { 1: 8, 2: 20, 3: 40, 4: 65, 5: 100 }

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
 * Old `professions` trees were removed — crafting uses `careers` instead.
 */
export const HIDDEN_SKILL_CATEGORIES = []

/**
 * Enchantment slots on equipped gear — apply/remove on Character tab.
 */
export const ENCHANTMENTS_PLANNED = false

export const DISPLAY_CATEGORIES = {
  weapons: 'Weapons',
  magic: 'Magic',
  careers: 'Careers',
  fusion: 'Fusion',
  ascension: 'Ascension',
  ultimate: 'Ultimate',
  racial: 'Race'
}

/** Friendly labels for skill subcategory keys (careers, fusion trees, etc.). */
export const SKILL_SUBCATEGORY_LABELS = {
  ranger: 'Ranger',
  soldier: 'Soldier',
  mage: 'Mage',
  musician: 'Musician',
  paladin: 'Paladin',
  thief: 'Thief',
  berserker: 'Berserker',
  marksman: 'Marksman',
  duelist: 'Duelist',
  unarmed: 'Striker',
  striker: 'Striker',
  beast_handler: 'Beast Handler',
  cleric_lay: 'Cleric',
  career_fusion: 'Career Fusion',
  ranged_magic: 'Ranged + Magic',
  melee_magic: 'Melee + Magic',
  utility_combat: 'Utility Combat',
  monster_fusion: 'Monster Fusion',
  pure_magic: 'Pure Magic'
}

/** Retired skill-tree keys mapped to replacements (UI + saves). */
export const RETIRED_SKILL_SUBCATEGORIES = {
  scout: 'ranger'
}
