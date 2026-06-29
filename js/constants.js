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

/** Ascension & Ultimate — stricter tier level gates (weapons/magic/careers use TIER_MIN_LEVEL). Tier 6 = Ultimate only. */
export const CAPSTONE_TIER_MIN_LEVEL = { 3: 10, 4: 15, 5: 22, 6: 30 }

/** Default Lumen cost floors for capstone tiers (individual skills may cost more). */
export const CAPSTONE_TIER_LUMEN_COST = { 3: 133, 4: 163, 5: 320, 6: 450 }

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
  hp: { label: 'HP', cost: 3, min: 1, max: 1000, desc: 'Maximum health. Simple, boring, important. Like vegetables, but with less betrayal.' },
  stamina: { label: 'Stamina', cost: 4, min: 1, max: 1000, desc: 'Fuel for active skills, stances, spells and heroic nonsense.' },
  strength: { label: 'Strength', cost: 10, min: -5, max: 30, desc: 'Physical damage, grappling and hitting problems until they become smaller problems.' },
  magicPower: { label: 'Magic Power', cost: 10, min: -5, max: 30, desc: 'Spell power and magical effectiveness.' },
  accuracy: { label: 'Accuracy', cost: 8, min: -5, max: 15, desc: 'Added to d20 attack rolls. Meet or beat the target\'s Physical Defence (physical attacks) or Magical Defence (magical attacks) to hit.' },
  speed: { label: 'Speed', cost: 12, min: 1, max: 12, desc: 'Turn order and combat movement — 1 Speed = 5ft per turn (max 60ft at cap 12). Also used for evasion-style checks.' },
  physicalDefence: { label: 'Physical Defence', cost: 10, min: 1, max: 30, desc: 'Physical AC — melee, ranged and other physical attacks must roll d20 + accuracy at or above this to hit (otherwise miss/block).' },
  magicalDefence: { label: 'Magical Defence', cost: 10, min: 1, max: 30, desc: 'Magical AC — spells and magical attacks must roll d20 + accuracy at or above this to hit (otherwise miss/block).' }
}

export const TAB_IDS = ['character', 'skills', 'stats', 'shop', 'craft', 'homebrew', 'gm', 'notes', 'howtoplay']

/** Callout shown above a weapon skill subcategory on the Skills tab. */
export const RANGED_CRITICAL_RULE =
  'Ranged criticals: if a bow or crossbow attack rolls a natural 20 on accuracy, roll one extra d20. If that second roll is also a natural 20, the GM may allow an instant takedown or vital-shot effect.'

export const WEAPON_SKILL_TREE_INTROS = {
  ranged: [
    'With bows and crossbows, you normally cannot move and attack in the same turn, in either order — unless you have Quick Draw or a skill says otherwise (e.g. Parting Shot: attack then up to 15ft; with Quick Draw, that 15ft is in addition to normal movement). Mark Moved on the action bar when you reposition.',
    'Range is based on line of sight, but the GM decides whether the shot is practical, too far, blocked, or affected by cover.',
    RANGED_CRITICAL_RULE
  ]
}

export const HOMEBREW_STORAGE_KEY = 'lumenforge_homebrew_v1'
export const HOMEBREW_STORE_VERSION = 1
export const HOMEBREW_ID_PREFIX = 'custom_'
export const HOMEBREW_ITEM_TYPES = ['weapon', 'armor', 'accessory', 'consumable', 'material']
export const HOMEBREW_RARITIES = ['common', 'uncommon', 'rare', 'epic', 'legendary']
export const HOMEBREW_SKILL_CATEGORIES = ['weapons', 'magic', 'careers', 'fusion', 'ascension', 'ultimate', 'racial']
export const HOMEBREW_SKILL_DAMAGE_MODES = [
  { id: 'none', label: 'No damage roll' },
  { id: 'dice', label: 'Custom damage dice' },
  { id: 'basic_plus_dice', label: 'Basic attack + custom dice' },
  { id: 'elemental_dice', label: 'Custom elemental dice' },
  { id: 'basic_plus_elemental_dice', label: 'Basic attack + elemental dice' }
]
export const HOMEBREW_ELEMENT_TYPES = ['fire', 'ice', 'thunder', 'earth', 'wind', 'water', 'darkness', 'light', 'holy', 'poison']
/** Stat added to custom dice damage on homebrew action use (dice total + stat value). */
export const HOMEBREW_DAMAGE_STAT_KEYS = ['strength', 'magicPower', 'physicalDefence', 'magicalDefence', 'speed']
export const HOMEBREW_SKILL_TYPES = [
  { id: 'passive', label: 'Passive' },
  { id: 'toggle', label: 'Toggle (stance)' },
  { id: 'activatable', label: 'Action (uses stamina)' }
]

/** Official weapon-type tags for skills and homebrew gear locks. */
export const OFFICIAL_WEAPON_KINDS = [
  'sword', 'axe', 'dagger', 'polearm', 'hammer', 'staff', 'ranged', 'striker', 'unarmed'
]

/** Generic equipped main-hand weapon (fusion / homebrew locks). */
export const ANY_WEAPON_KIND = '__any_weapon__'

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
  racial: 'Race',
  homebrew: 'Homebrew'
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
  blacksmith: 'Blacksmith',
  chef: 'Chef',
  medic: 'Medic',
  alchemist: 'Alchemist',
  enchanter: 'Enchanter',
  detective: 'Detective',
  career_fusions: 'Career Fusions',
  career_fusion: 'Career Fusion',
  ranged_magic: 'Ranged + Magic',
  melee_magic: 'Melee + Magic',
  utility_combat: 'Utility Combat',
  monster_fusion: 'Monster Fusion',
  pure_magic: 'Pure Magic',
  unique: 'Breakthroughs',
  legendary: 'Rare Legends',
  weapon_ultimates: 'Weapon Mastery',
  magic_ultimates: 'Element Mastery'
}

/** Retired skill-tree keys mapped to replacements (UI + saves). */
export const RETIRED_SKILL_SUBCATEGORIES = {
  scout: 'ranger',
  beast_handler: 'ranger',
  cleric_lay: 'paladin',
  farmer: 'medic',
  scholar: 'detective',
  archaeologist: 'detective',
  engineer: 'blacksmith',
  ranged_magic: 'melee_magic',
  utility_combat: 'career_fusions',
  career_fusion: 'career_fusions'
}
