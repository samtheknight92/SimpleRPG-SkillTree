import { DEFAULT_STARTING_GIL, DEFAULT_STARTING_LUMENS } from './constants.js'
import { getItem } from './cache.js'
import { addItemToInventory } from './items.js'
import { formatCurrency } from './format.js'

export const DEFAULT_BACKGROUND = 'wanderer'

/** Starting packages — gil / lumens / items applied only at character creation. */
export const BACKGROUNDS = {
  wanderer: {
    id: 'wanderer',
    name: 'Wanderer',
    icon: '🎒',
    desc: 'A traveler with a bedroll and just enough coin to reach the next town.',
    gil: DEFAULT_STARTING_GIL,
    lumens: DEFAULT_STARTING_LUMENS,
    items: [{ itemId: 'health_potion', qty: 1 }]
  },
  isekai: {
    id: 'isekai',
    name: "Isekai'd",
    icon: '🌀',
    desc: 'Summoned from another world with nothing on you. Locals trade Gil and never speak of Lumens — but you see the glow when foes fall, and you level up fast. That is your isekai blessing.',
    gil: 0,
    lumens: 0,
    items: [],
    tableNote: 'Natives do not see or spend Lumens. Your sheet still tracks them — defeat loot and rests are how you grow. Fast leveling compared to locals is the point; the GM sets the pace.'
  },
  noble_scion: {
    id: 'noble_scion',
    name: 'Noble Scion',
    icon: '👑',
    desc: 'Born to wealth and etiquette. Plenty of Gil, less hunger to prove yourself.',
    gil: 4000,
    lumens: 90,
    items: [{ itemId: 'leather_armor', qty: 1 }, { itemId: 'stamina_potion', qty: 1 }]
  },
  street_urchin: {
    id: 'street_urchin',
    name: 'Street Urchin',
    icon: '🏚️',
    desc: 'Grew up scrapping for scraps. Light purse, sharp instincts.',
    gil: 1333,
    lumens: 131,
    items: [{ itemId: 'iron_dagger', qty: 1 }, { itemId: 'health_potion', qty: 1 }]
  },
  apprentice_scholar: {
    id: 'apprentice_scholar',
    name: 'Apprentice Scholar',
    icon: '📚',
    desc: 'Years in dusty archives traded coin for knowledge and a starter staff.',
    gil: 2000,
    lumens: 150,
    items: [{ itemId: 'wooden_staff', qty: 1 }, { itemId: 'herbs', qty: 3 }]
  },
  mercenary_veteran: {
    id: 'mercenary_veteran',
    name: 'Mercenary Veteran',
    icon: '⚔️',
    desc: 'Already bled for pay. Arrives armed, armored, and mildly suspicious.',
    gil: 2667,
    lumens: 120,
    items: [
      { itemId: 'iron_sword', qty: 1 },
      { itemId: 'leather_armor', qty: 1 },
      { itemId: 'health_potion', qty: 2 }
    ]
  },
  hermit: {
    id: 'hermit',
    name: 'Hermit',
    icon: '🏔️',
    desc: 'Lived apart from civilization. Modest funds, strong focus, herbal stock.',
    gil: 2467,
    lumens: 143,
    items: [
      { itemId: 'herbs', qty: 5 },
      { itemId: 'health_potion', qty: 1 },
      { itemId: 'stamina_potion', qty: 1 }
    ]
  },
  merchants_heir: {
    id: 'merchants_heir',
    name: "Merchant's Heir",
    icon: '💰',
    desc: 'Family trade built a fortune. You start rich, not battle-ready.',
    gil: 5333,
    lumens: 98,
    items: [{ itemId: 'stamina_potion', qty: 2 }]
  }
}

export function getBackground(id) {
  return BACKGROUNDS[id] || BACKGROUNDS[DEFAULT_BACKGROUND]
}

export function backgroundOptions() {
  return Object.values(BACKGROUNDS)
}

export function backgroundItemLabel(row) {
  const item = getItem(row.itemId)
  const name = item?.name || row.itemId
  return `${name} ×${row.qty || 1}`
}

export function backgroundRewardSummary(background) {
  const bg = typeof background === 'string' ? getBackground(background) : background
  if (!bg) return ''
  const items = (bg.items || [])
    .filter(row => getItem(row.itemId))
    .map(backgroundItemLabel)
    .join(', ')
  return [
    formatCurrency(bg.gil),
    `${bg.lumens} Lumens`,
    items ? `Items: ${items}` : 'No starting items'
  ].join(' · ')
}

export function applyBackgroundToCharacter(character, backgroundId) {
  const bg = getBackground(backgroundId)
  character.background = bg.id
  character.gil = bg.gil
  character.lumens = bg.lumens
  for (const row of bg.items || []) {
    if (getItem(row.itemId)) addItemToInventory(character, row.itemId, row.qty || 1)
  }
  const noteLine = `Background: ${bg.name} — ${bg.desc}`
  const tableLine = bg.tableNote ? `\n\nTable: ${bg.tableNote}` : ''
  character.notes = character.notes ? `${character.notes}\n\n${noteLine}${tableLine}` : `${noteLine}${tableLine}`
}
