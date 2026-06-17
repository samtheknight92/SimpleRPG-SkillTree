#!/usr/bin/env node
/**
 * Align profession recipe materials with monster/discoverable drop tiers.
 * basic → common/uncommon · advanced → up to rare · expert → up to epic · master → legendary
 */
import fs from 'fs'
import path from 'path'
import vm from 'vm'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')
const dataDir = path.join(root, 'data')

function load(file, key) {
  const code = fs.readFileSync(path.join(dataDir, file), 'utf8')
  const sandbox = { console, window: {}, globalThis: {} }
  sandbox.globalThis.window = sandbox.window
  vm.createContext(sandbox)
  vm.runInContext(code, sandbox)
  return sandbox.window[key]
}

const RANK = { common: 1, uncommon: 2, rare: 3, epic: 4, legendary: 5 }
const TIER_CAP = { basic: 2, advanced: 3, expert: 4, master: 5 }

/** Explicit recipe fixes — materials from tier-appropriate drops/forage. */
const RECIPE_OVERRIDES = {
  healing_salve: [
    { id: 'thick_hide', quantity: 2 },
    { id: 'wild_mint', quantity: 1 }
  ],
  healing_herbs: [
    { id: 'nature_essence', quantity: 2 },
    { id: 'wild_mint', quantity: 1 }
  ],
  antitoxin_draught: [
    { id: 'acid_bladder', quantity: 2 },
    { id: 'wild_mint', quantity: 1 }
  ],
  stamina_potion: [
    { id: 'energy_berry', quantity: 2 },
    { id: 'thick_hide', quantity: 1 }
  ],
  beast_repellent: [
    { id: 'scent_glands', quantity: 2 },
    { id: 'wild_mint', quantity: 1 }
  ],
  minor_magic_elixir: [
    { id: 'ironbark_moss', quantity: 1 },
    { id: 'wild_mint', quantity: 2 }
  ],
  energy_steaks: [
    { id: 'flexible_tail_section', quantity: 2 },
    { id: 'thick_hide', quantity: 1 }
  ],
  hunter_bread: [
    { id: 'thick_hide', quantity: 1 },
    { id: 'energy_berry', quantity: 2 }
  ],
  ancient_coin: [
    { id: 'sharp_fangs', quantity: 3 },
    { id: 'crusher_molars', quantity: 1 }
  ],
  forgotten_map: [
    { id: 'thick_hide', quantity: 2 },
    { id: 'flexible_tail_section', quantity: 1 }
  ],
  warriors_charm: [
    { id: 'sharp_claws', quantity: 2 },
    { id: 'crusher_molars', quantity: 1 }
  ],
  regenerative_stew: [
    { id: 'nature_essence', quantity: 2 },
    { id: 'ironbark_moss', quantity: 1 },
    { id: 'thick_hide', quantity: 1 }
  ],
  vitality_bloom: [
    { id: 'nature_essence', quantity: 3 },
    { id: 'ironbark_moss', quantity: 2 }
  ],
  dragons_breath_flower: [
    { id: 'nature_essence', quantity: 2 },
    { id: 'moonbell_flower', quantity: 1 }
  ],
  giants_root: [
    { id: 'nature_essence', quantity: 2 },
    { id: 'tree_bark', quantity: 3 }
  ],
  berserker_elixir: [
    { id: 'energy_gland', quantity: 2 },
    { id: 'thick_hide', quantity: 2 }
  ],
  giant_strength_serum: [
    { id: 'energy_gland', quantity: 2 },
    { id: 'thick_hide', quantity: 2 }
  ]
}

/** Thematic pools — ordered low → high rarity within each theme. */
const POOLS = {
  heal: ['wild_mint', 'thick_hide', 'nature_essence', 'ironbark_moss', 'acid_bladder', 'regenerative_tissue', 'phoenix_cells'],
  poison: ['wild_mint', 'acid_bladder', 'toxic_lung_tissue', 'venom_sacs'],
  physical: ['thick_hide', 'sharp_claws', 'sharp_fangs', 'flexible_tail_section', 'crusher_molars', 'living_rock_fragments', 'metallic_fragments'],
  magic: ['wild_mint', 'anti_magic_essence', 'nature_essence', 'ironbark_moss', 'glowing_crystals', 'void_essence'],
  energy: ['energy_berry', 'flexible_tail_section', 'energy_gland', 'combat_coordination_gland'],
  fire: ['acid_bladder', 'flame_gland', 'frost_core'],
  arcane: ['anti_magic_essence', 'glowing_crystals', 'elemental_heart', 'void_essence'],
  relic: ['sharp_fangs', 'crusher_molars', 'metallic_fragments', 'memory_crystal', 'time_crystal']
}

const MATERIAL_THEME = {
  regenerative_tissue: 'heal',
  phoenix_cells: 'heal',
  venom_sacs: 'poison',
  toxic_lung_tissue: 'poison',
  combat_coordination_gland: 'energy',
  void_essence: 'arcane',
  time_crystal: 'relic',
  memory_crystal: 'relic',
  metallic_fragments: 'physical',
  elemental_heart: 'arcane',
  flame_gland: 'fire',
  frost_core: 'fire'
}

function buildRarityMap() {
  const map = {}
  const loot = load('monster-loot-data.js', 'MONSTER_LOOT_DATA')
  for (const row of Object.values(loot)) map[row.id] = row.rarity || 'common'

  const disc = load('discoverable-items-data.js', 'DISCOVERABLE_ITEMS_DATA')
  for (const group of Object.values(disc || {})) {
    for (const row of Object.values(group || {})) {
      if (row?.id) map[row.id] = row.rarity || map[row.id] || 'common'
    }
  }
  return map
}

function rank(id, rarities) {
  return RANK[rarities[id] || 'common'] || 1
}

function pickSubstitute(materialId, recipeTier, rarities) {
  const cap = TIER_CAP[recipeTier] || 2
  const theme = MATERIAL_THEME[materialId] || 'physical'
  const pool = POOLS[theme] || POOLS.physical
  let best = pool[0]
  for (const id of pool) {
    if (rank(id, rarities) <= cap) best = id
  }
  return best
}

function mergeMaterials(list) {
  const merged = new Map()
  for (const row of list) {
    const id = row.id
    merged.set(id, (merged.get(id) || 0) + Number(row.quantity || 1))
  }
  return [...merged.entries()].map(([id, quantity]) => ({ id, quantity }))
}

function alignMaterials(recipe, rarities) {
  if (RECIPE_OVERRIDES[recipe.id]) {
    return mergeMaterials(RECIPE_OVERRIDES[recipe.id])
  }
  const cap = TIER_CAP[recipe.tier || 'basic'] || 2
  const out = []
  for (const mat of recipe.materials || []) {
    const id = mat.id
    const qty = Number(mat.quantity || mat.qty || 1)
    if (rank(id, rarities) <= cap) {
      out.push({ id, quantity: qty })
      continue
    }
    const sub = pickSubstitute(id, recipe.tier || 'basic', rarities)
    out.push({ id: sub, quantity: qty })
  }
  return mergeMaterials(out)
}

const rarities = buildRarityMap()
const prof = load('profession-items-data.js', 'PROFESSION_ITEMS_DATA')
let changed = 0

for (const items of Object.values(prof)) {
  for (const recipe of Object.values(items)) {
    const before = JSON.stringify(recipe.materials || [])
    recipe.materials = alignMaterials(recipe, rarities)
    if (JSON.stringify(recipe.materials) !== before) changed += 1
  }
}

const out = `// Profession Items Data - Craftable items for each profession using monster materials\n// Items are organized by profession and tier (basic → advanced → expert → master)\n\nconst PROFESSION_ITEMS_DATA = ${JSON.stringify(prof, null, 4)}\n\nif (typeof window !== 'undefined') {\n  window.PROFESSION_ITEMS_DATA = PROFESSION_ITEMS_DATA\n}\n`
fs.writeFileSync(path.join(dataDir, 'profession-items-data.js'), out, 'utf8')
console.log(`Aligned materials on ${changed} recipes.`)
