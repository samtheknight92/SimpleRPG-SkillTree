import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { generatePremadeBuild, loadGeneratorData } from './lib/premade-generator.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')
const manifestPath = path.join(root, 'characters_in_data_file.txt')
const sourceDir = path.join(root, 'data', 'premade-characters')
const outPath = path.join(root, 'data', 'json', 'premade-characters.json')

const PEDESTRIAN_RACES = {
  elf: 'elf',
  dwarf: 'dwarf',
  human: 'human',
  halfling: 'halfling',
  tiefling: 'tiefling',
  drow: 'drow'
}

const NPC_ARCHETYPES = /alchemist|archer|assassin|battle_mage|beast_tamer|berserker|bounty_hunter|con_artist|cultist|duelist|elementalist|enchanter|engineer|gambler|gladiator|inquisitor|medic|mercenary|monk|necromancer|ninja|paladin|poisoner|politician|pyromancer|scout|sergeant|smuggler|spearman|spy|thief|time_mage|vampire_hunter|warlock|zealot|heretic|pirate|politician/i

const MONSTER_PATTERN = /slime|goblin|orc|wyvern|dragon|devil|demon|golem|giant|serpent|sprite|fish|octopus|kraken|lich|angel|banshee|phantom|revenant|rat|flayer|doppelganger|poltergeist|armor|knight|weapon|shield|bow|staff|piranha|eel|haunted|possessed|blessed|cursed|living|crystal|electric|fire_|ice_|water_|earth_|forest_|desert_|arctic_|shadow_|prismatic_|ancient_|greater_|lesser_|hell_|healing_|light_|golden_|green_|blue_|red_|plague_|dire_|feral_|cloud_|hill_|frost_|sea_|mind_|warlord|lieutenant|brute|chief|raider|shaman|warrior|bandit|corrupt|crime|torturer|slave|kraken|chernubim|cherubim/i

function titleCase(value) {
  return String(value || '')
    .replace(/_/g, ' ')
    .replace(/\b\w/g, letter => letter.toUpperCase())
}

function cleanStem(file) {
  return String(file || '')
    .trim()
    .replace(/\.json$/i, '')
    .replace(/_character$/i, '')
}

function premadeIdFromFile(file) {
  return cleanStem(file)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_|_$/g, '')
}

const NPC_NAME_OVERRIDES = {
  scout: 'Ranger'
}

function inferFromFilename(file) {
  const stem = cleanStem(file)
  const premadeId = premadeIdFromFile(file)

  if (stem.startsWith('Pedestrian_')) {
    const parts = stem.slice('Pedestrian_'.length).split('_')
    const raceKey = parts[0].toLowerCase()
    if (raceKey === 'dragonborn') {
      const element = (parts[1] || '').toLowerCase()
      return {
        premadeId,
        name: `Pedestrian Dragonborn (${titleCase(element)})`,
        race: 'dragonborn',
        elementalAffinity: element,
        category: 'pedestrian',
        notes: `Premade pedestrian dragonborn (${element || 'unspecified'} affinity).`
      }
    }
    const race = PEDESTRIAN_RACES[raceKey] || 'human'
    return {
      premadeId,
      name: `Pedestrian ${titleCase(raceKey)}`,
      race,
      category: 'pedestrian',
      notes: `Premade pedestrian ${raceKey}.`
    }
  }

  const name = NPC_NAME_OVERRIDES[premadeId] || titleCase(stem)
  if (NPC_ARCHETYPES.test(stem)) {
    return {
      premadeId,
      name,
      race: 'human',
      category: 'npc',
      notes: `Premade NPC archetype: ${name}.`
    }
  }
  if (MONSTER_PATTERN.test(stem)) {
    return {
      premadeId,
      name,
      race: 'monster',
      category: 'monster',
      notes: `Premade monster/NPC: ${name}.`
    }
  }

  return {
    premadeId,
    name,
    race: 'human',
    category: 'npc',
    notes: `Premade NPC: ${name}.`
  }
}

function normalizeAffinity(value) {
  const clean = String(value || '').trim().toLowerCase()
  if (!clean) return ''
  if (clean === 'lightning') return 'thunder'
  return clean
}

function migrateUnlockedSkills(unlockedSkills) {
  const ids = []
  const walk = value => {
    if (Array.isArray(value)) ids.push(...value)
    else if (value && typeof value === 'object') Object.values(value).forEach(walk)
  }
  walk(unlockedSkills)
  return [...new Set(ids)]
}

function loadSourceCharacter(file) {
  const candidates = [file, file.endsWith('.json') ? file : `${file}.json`]
  for (const name of candidates) {
    const filePath = path.join(sourceDir, name)
    if (!fs.existsSync(filePath)) continue
    try {
      return JSON.parse(fs.readFileSync(filePath, 'utf8'))
    } catch (error) {
      console.warn(`Skipping invalid JSON: ${name}`, error.message)
    }
  }
  return null
}

function buildTemplate(file, generatorData) {
  const inferred = inferFromFilename(file)
  const source = loadSourceCharacter(file)
  const generated = generatePremadeBuild(inferred, cleanStem(file), generatorData)
  const base = {
    premadeId: inferred.premadeId,
    name: inferred.name,
    race: inferred.race,
    category: inferred.category,
    elementalAffinity: normalizeAffinity(generated.elementalAffinity || inferred.elementalAffinity || ''),
    lumens: generated.lumens,
    gil: generated.gil ?? generated.currency,
    stats: generated.stats,
    skills: generated.skills,
    activeToggles: generated.activeToggles || [],
    statusEffects: [],
    inventory: generated.inventory,
    equipped: generated.equipped,
    notes: generated.notes || inferred.notes
  }

  if (!source) return base

  const migratedSkills = Array.isArray(source.skills)
    ? source.skills
    : migrateUnlockedSkills(source.unlockedSkills)
  const { id, created, updated, premadeId, unlockedSkills, ...rest } = source
  const merged = {
    ...base,
    ...rest,
    premadeId: inferred.premadeId,
    name: rest.name || base.name,
    race: rest.race || base.race,
    category: base.category,
    elementalAffinity: normalizeAffinity(rest.elementalAffinity || base.elementalAffinity),
    gil: rest.gil ?? rest.currency ?? base.gil,
    skills: migratedSkills.length ? migratedSkills : base.skills,
    stats: rest.stats || base.stats,
    inventory: Array.isArray(rest.inventory) && rest.inventory.length ? rest.inventory : base.inventory,
    equipped: rest.equipped || base.equipped,
    notes: rest.notes || base.notes
  }
  return merged
}

function readManifest() {
  const raw = fs.readFileSync(manifestPath)
  const text = raw[0] === 0xFF && raw[1] === 0xFE
    ? raw.toString('utf16le')
    : raw.toString('utf8')
  return [...new Set(
    text
      .split(/\r?\n/)
      .map(line => line.trim())
      .filter(Boolean)
  )].sort((a, b) => a.localeCompare(b))
}

const manifest = readManifest()
const generatorData = loadGeneratorData(root)

const templates = manifest.map(file => buildTemplate(file, generatorData))
const ids = new Set()
for (const template of templates) {
  if (ids.has(template.premadeId)) {
    throw new Error(`Duplicate premadeId: ${template.premadeId}`)
  }
  ids.add(template.premadeId)
}

fs.mkdirSync(path.dirname(outPath), { recursive: true })
fs.writeFileSync(outPath, `${JSON.stringify(templates, null, 2)}\n`, 'utf8')

const withSource = manifest.filter(file => fs.existsSync(path.join(sourceDir, file))).length
console.log(`Built ${templates.length} premade characters (${withSource} from data/premade-characters/).`)
