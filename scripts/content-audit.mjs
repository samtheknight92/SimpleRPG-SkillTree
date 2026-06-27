#!/usr/bin/env node
/**
 * Full content audit — races, backgrounds, effects, skills, premades.
 * Run: node scripts/content-audit.mjs
 * Exit 1 if any ERROR-level findings exist.
 */
import fs from 'fs'
import path from 'path'
import vm from 'vm'
import { fileURLToPath } from 'url'
import { findEffectByPhrase } from './lib/resolve-activation-effects.mjs'
import { minLevelForTier, characterLevelFromTotal } from './lib/progression.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')
const jsonDir = path.join(root, 'data', 'json')
const dataDir = path.join(root, 'data')

const DRAGONBORN_AFFINITIES = ['fire', 'ice', 'thunder', 'earth', 'wind', 'water', 'darkness', 'light']
const DEFAULT_STATS = { hp: 10, stamina: 10, strength: -3, magicPower: -3, accuracy: -3, speed: 2, physicalDefence: 8, magicalDefence: 8 }
const STAT_LEVEL = { hp: 0.2, stamina: 0.2, strength: 0.4, magicPower: 0.4, accuracy: 0.4, speed: 0.4, physicalDefence: 0.4, magicalDefence: 0.4 }
const STAT_LABELS = {
  accuracy: 'Accuracy',
  speed: 'Speed',
  strength: 'Strength',
  magicpower: 'Magic Power',
  'magic power': 'Magic Power',
  hp: 'HP',
  stamina: 'Stamina',
  physicaldefence: 'Physical Defence',
  'physical defence': 'Physical Defence',
  magicaldefence: 'Magical Defence',
  'magical defence': 'Magical Defence'
}

const findings = []
let errorCount = 0
let warnCount = 0
let infoCount = 0

function add(level, category, message, detail = '') {
  findings.push({ level, category, message, detail })
  if (level === 'ERROR') errorCount += 1
  else if (level === 'WARN') warnCount += 1
  else infoCount += 1
}

function loadJsExport(file, globalName) {
  const filePath = path.join(dataDir, file)
  if (!fs.existsSync(filePath)) return null
  const sandbox = { window: {}, console }
  vm.createContext(sandbox)
  vm.runInContext(fs.readFileSync(filePath, 'utf8'), sandbox)
  return sandbox.window[globalName] ?? sandbox[globalName]
}

function readJson(name) {
  return JSON.parse(fs.readFileSync(path.join(jsonDir, `${name}.json`), 'utf8'))
}

function walkSkills(value, pathParts = [], out = []) {
  if (Array.isArray(value)) {
    value.forEach((skill, index) => {
      if (skill?.id) out.push({ skill, path: [...pathParts, index].join('/') })
    })
    return out
  }
  if (value && typeof value === 'object') {
    for (const [key, child] of Object.entries(value)) walkSkills(child, [...pathParts, key], out)
  }
  return out
}

function walkItems(value, pathParts = [], out = []) {
  if (Array.isArray(value)) {
    value.forEach((child, index) => walkItems(child, [...pathParts, index], out))
    return out
  }
  if (value && typeof value === 'object') {
    if (value.id && value.name) out.push({ item: value, path: pathParts.join('/') })
    for (const [key, child] of Object.entries(value)) {
      if (child && typeof child === 'object') walkItems(child, [...pathParts, key], out)
    }
  }
  return out
}

function tierLevel(t) {
  return Number(t || 1) / 5
}

// Mirror js/effects.js race trait extraction
const RACE_TRAIT_EFFECT_RULES = [
  [/poison\s+immunity/i, 'poison_immunity'],
  [/immune\s+to\s+(?:all\s+)?poison/i, 'poison_immunity'],
  [/immune\s+to\s+disease/i, 'disease_immunity'],
  [/immune\s+to\s+aging\s+and\s+disease/i, 'disease_immunity'],
  [/immune\s+to\s+fire(?:\s+damage)?/i, 'fire_immunity'],
  [/immune\s+to\s+charm/i, 'spell_warded'],
  [/immune\s+to\s+fear/i, 'spell_warded'],
  [/resistance\s+to\s+(?:chosen\s+)?element/i, '__dragonborn_resist__']
]

function extractRaceEffectIds(trait, effects) {
  const text = String(trait || '')
  const found = new Set()
  for (const [pattern, effectId] of RACE_TRAIT_EFFECT_RULES) {
    if (pattern.test(text)) {
      if (effectId === '__dragonborn_resist__') found.add('__dragonborn_resist__')
      else if (effects[effectId]) found.add(effectId)
    }
  }
  return [...found]
}

function parseStatBonusesFromTrait(trait) {
  const totals = {}
  const re = /\+(\d+)\s+(Accuracy|Speed|Strength|Magic Power|HP|Stamina|Physical Defence|Magical Defence)/gi
  let match
  while ((match = re.exec(trait))) {
    const key = match[2].toLowerCase().replace(/\s+/g, '')
    const stat = key === 'magicpower' ? 'magicPower'
      : key === 'physicaldefence' ? 'physicalDefence'
      : key === 'magicaldefence' ? 'magicalDefence'
      : key
    totals[stat] = (totals[stat] || 0) + Number(match[1])
  }
  return totals
}

function traitClaimsImmunityOrResistance(trait) {
  return /immune\s+to|immunity|resistance\s+to/i.test(trait)
}

function traitClaimsDamageBonus(trait) {
  return /\+\d+\s+damage/i.test(trait)
}

function traitIsTableOnly(trait) {
  return /can (?:reroll|detect|see|track|move through)|once per|drop to 1 hp|10% more|1 less material|darkvision|sunlight|carrying capacity|choose elemental|draconic senses|pack tactics|keen (?:senses|smell)|stone sense|master craftsman|versatile learning|cross-cultural|monster nature|monster stupidity|aging/i.test(trait)
}

function loadBackgroundsFromJs() {
  const src = fs.readFileSync(path.join(root, 'js', 'backgrounds.js'), 'utf8')
  const backgrounds = {}
  const keyRe = /^\s{2}(\w+):\s*\{/gm
  const keys = [...src.matchAll(keyRe)].map(m => ({ key: m[1], index: m.index }))
  for (let i = 0; i < keys.length; i++) {
    const { key, index } = keys[i]
    const end = keys[i + 1]?.index ?? src.length
    const block = src.slice(index, end)
    const id = block.match(/id:\s*'([^']+)'/)?.[1] || key
    const name = block.match(/name:\s*'([^']+)'/)?.[1] || key
    const gil = Number(block.match(/gil:\s*(\d+)/)?.[1] || 0)
    const lumens = Number(block.match(/lumens:\s*(\d+)/)?.[1] || 0)
    const items = [...block.matchAll(/itemId:\s*'([^']+)'\s*,\s*qty:\s*(\d+)/g)]
      .map(m => ({ itemId: m[1], qty: Number(m[2]) }))
    backgrounds[key] = { id, name, gil, lumens, items }
  }
  return backgrounds
}

// ─── Load data ───
const effects = readJson('effects')
const skillsRoot = readJson('skills')
const itemsRoot = readJson('items')
const professionItems = readJson('profession-items')
const discoverableItems = readJson('discoverable-items')
const premades = readJson('premade-characters')
const racesJson = readJson('races')
const backgrounds = loadBackgroundsFromJs()

const monsterLoot = readJson('monster-loot')

const skillRows = walkSkills(skillsRoot)
const skillById = new Map(skillRows.map(row => [row.skill.id, row.skill]))
const skillIds = new Set(skillById.keys())

const itemRows = [
  ...walkItems(itemsRoot, ['items']),
  ...walkItems(professionItems, ['profession-items']),
  ...walkItems(discoverableItems, ['discoverable-items']),
  ...walkItems(monsterLoot, ['monster-loot'])
]
const itemIds = new Set(itemRows.map(row => row.item.id))

const raceIds = new Set(Object.keys(racesJson))

console.log('═══════════════════════════════════════════════════════')
console.log(' LUMENFORGE CONTENT AUDIT')
console.log('═══════════════════════════════════════════════════════\n')

// ─── 1. Race passiveTraits vs implementation ───
console.log('## 1. Race passives vs implementation\n')

for (const [raceId, race] of Object.entries(racesJson)) {
  if (raceId === 'monster') continue
  const mods = { ...(race.statModifiers || {}) }
  delete mods.none

  for (const trait of race.passiveTraits || []) {
    const label = trait.split(':')[0].trim()
    const fromTrait = parseStatBonusesFromTrait(trait)
    const isConditionalStat = /when |if |while |below |above |adjacent|sunlight|in bright/i.test(trait)
    for (const [stat, value] of Object.entries(fromTrait)) {
      if (isConditionalStat) {
        add('INFO', 'race-stat', `${race.name}: "${label}" +${value} ${stat} is conditional (table/combat)`, trait)
        continue
      }
      const equipMods = (race.equipmentStatModifiers || [])
        .reduce((sum, rule) => sum + Number(rule.statModifiers?.[stat] || 0), 0)
      const base = Number(mods[stat] || 0)
      if (equipMods > 0) {
        add('INFO', 'race-passive', `${race.name}: "${label}" stat +${value} ${stat} is equipment-gated`, trait)
        continue
      }
      if (base !== value) {
        add('WARN', 'race-stat', `${race.name}: trait promises +${value} ${stat} but statModifiers has ${base}`, trait)
      }
    }

    if (traitClaimsImmunityOrResistance(trait)) {
      const effectIds = extractRaceEffectIds(trait, effects)
      const isDragonbornResist = raceId === 'dragonborn' && effectIds.includes('__dragonborn_resist__')
      if (!effectIds.length) {
        add('WARN', 'race-immunity', `${race.name}: immunity/resistance trait has no wired effect`, trait)
      } else if (!isDragonbornResist) {
        for (const id of effectIds) {
          if (!effects[id]) add('ERROR', 'race-immunity', `${race.name}: maps to missing effect "${id}"`, trait)
        }
      } else {
        add('INFO', 'race-immunity', `${race.name}: Scaled Hide wired via elemental affinity (50% resist)`, trait)
      }
    }

    if (traitClaimsDamageBonus(trait)) {
      const wired = /\+\d+\s+damage\s+(?:with\s+melee|against)/i.test(trait)
      if (!wired) add('INFO', 'race-damage', `${race.name}: damage bonus is table-only (not parsed in combat)`, trait)
      else add('INFO', 'race-damage', `${race.name}: damage bonus parsed in damage-breakdown.js`, trait)
    }

    if (traitIsTableOnly(trait) && !traitClaimsImmunityOrResistance(trait) && !Object.keys(fromTrait).length && !traitClaimsDamageBonus(trait)) {
      add('INFO', 'race-table', `${race.name}: table-only passive`, trait)
    }
  }

  // statModifiers without mention in traits (informational)
  for (const [stat, value] of Object.entries(mods)) {
    if (!value) continue
    const mentioned = (race.passiveTraits || []).some(trait => parseStatBonusesFromTrait(trait)[stat])
    const equipOnly = (race.equipmentStatModifiers || []).some(rule => rule.statModifiers?.[stat])
    if (!mentioned && !equipOnly) {
      add('INFO', 'race-stat', `${race.name}: statModifiers.${stat}=${value} not spelled out in passiveTraits`, '')
    }
  }
}

// Known unwired race promises (documented gaps)
const UNWIRED_RACE_PROMISES = [
  { race: 'human', pattern: /10% more Lumens/i, note: 'Ambitious Spirit — table/GM award (no auto defeat-loot in app)' },
  { race: 'dwarf', pattern: /1 less material/i, note: 'Master Craftsman — wired in js/craft.js materialQuantityNeeded' },
  { race: 'drow', pattern: /Sunlight Sensitivity.*-1 Accuracy/i, note: 'Sunlight penalty — table rule (no bright-sun toggle in app)' },
  { race: 'gnoll', pattern: /Pack Tactics.*\+1 Accuracy/i, note: 'Pack Tactics — table rule (adjacent ally not tracked)' },
  { race: 'orc', pattern: /Relentless Endurance/i, note: 'Relentless Endurance — table/GM rule only' },
  { race: 'halfling', pattern: /Can reroll any natural 1/i, note: 'Lucky — table rule only' }
]
for (const [raceId, race] of Object.entries(racesJson)) {
  for (const check of UNWIRED_RACE_PROMISES) {
    if (check.race !== raceId) continue
    for (const trait of race.passiveTraits || []) {
      if (!check.pattern.test(trait)) continue
      const wired = check.note.includes('wired in')
      add(wired ? 'INFO' : 'WARN', wired ? 'race-wired' : 'race-unwired', `${race.name}: ${check.note}`, trait)
    }
  }
}

// ─── 2. Background packages ───
console.log('## 2. Background starting packages\n')

for (const bg of Object.values(backgrounds)) {
  for (const row of bg.items || []) {
    if (!itemIds.has(row.itemId)) {
      add('ERROR', 'background', `Background "${bg.name}" references missing item "${row.itemId}"`)
    }
  }
  if (bg.gil < 0 || bg.lumens < 0) {
    add('ERROR', 'background', `Background "${bg.name}" has negative starting currency`)
  }
}

// ─── 3. Dragonborn affinity on premades + creation constants ───
console.log('## 3. Dragonborn elemental affinity\n')

for (const premade of premades) {
  const affinity = String(premade.elementalAffinity || '').trim().toLowerCase()
  if (premade.race === 'dragonborn') {
    if (!affinity) add('ERROR', 'dragonborn', `Premade "${premade.name}" (${premade.premadeId}) is dragonborn without elementalAffinity`)
    else if (!DRAGONBORN_AFFINITIES.includes(affinity)) {
      add('ERROR', 'dragonborn', `Premade "${premade.name}" has invalid affinity "${affinity}"`)
    }
  } else if (affinity) {
    add('WARN', 'dragonborn', `Premade "${premade.name}" (${premade.race}) has elementalAffinity "${affinity}" but is not dragonborn`)
  }
}

// ─── 4. Skill effect references in desc ───
console.log('## 4. Skill descriptions → effects\n')

const STATUS_PHRASES = [
  /(?:applies?|inflicts?|causes?)\s+([a-z][a-z\s-]{2,40}?)(?:\s+status|\s+debuff|\s+for|\s+on|\s+to|\.|,|$)/gi,
  /(?:immune to|immunity to)\s+([a-z][a-z\s-]{2,30}?)(?:\s+status|\s+effects?|\.|,|$)/gi
]

for (const { skill } of skillRows) {
  const desc = skill.desc || ''
  if (!desc || !/(?:applies?|inflicts?|immune|status|debuff|buff|poison|burn|bleed|stun|daze|charm|fear)/i.test(desc)) continue

  if (Array.isArray(skill.activationEffects)) {
    for (const row of skill.activationEffects) {
      if (row?.effectId && !effects[row.effectId]) {
        add('ERROR', 'skill-effect', `Skill "${skill.id}" activationEffects references missing "${row.effectId}"`)
      }
    }
  }

  if (Array.isArray(skill.specialEffects)) {
    for (const effectId of skill.specialEffects) {
      if (!effects[effectId]) add('ERROR', 'skill-effect', `Skill "${skill.id}" specialEffects references missing "${effectId}"`)
    }
  }

  // Glossary-style status words in desc without structured effects
  for (const phraseRe of STATUS_PHRASES) {
    phraseRe.lastIndex = 0
    let match
    while ((match = phraseRe.exec(desc))) {
      const phrase = match[1].trim()
      if (/magical|physical|elemental|all enemies|one target|the target/i.test(phrase)) continue
      const effect = findEffectByPhrase(phrase, effects)
      if (!effect && /(?:poison|burn|bleed|stun|daze|charm|fear|sleep|slow|blind|silence|knockdown|paraly|freeze|shock|curse)/i.test(phrase)) {
        const hasStructured = (skill.activationEffects?.length || skill.specialEffects?.length)
        if (!hasStructured) {
          add('INFO', 'skill-desc', `Skill "${skill.id}" mentions "${phrase}" in desc — verify table application`, desc.slice(0, 100))
        }
      }
    }
  }
}

// ─── 5. Premade characters ───
console.log('## 5. Premade characters\n')

for (const premade of premades) {
  const id = premade.premadeId || premade.name

  if (premade.race && !raceIds.has(premade.race)) {
    add('ERROR', 'premade', `"${id}" has unknown race "${premade.race}"`)
  }

  let skillLevels = 0
  for (const skillId of premade.skills || []) {
    if (!skillIds.has(skillId)) add('ERROR', 'premade', `"${id}" has unknown skill "${skillId}"`)
    else skillLevels += tierLevel(skillById.get(skillId)?.tier)
  }

  let statLevels = 0
  for (const [stat, base] of Object.entries(DEFAULT_STATS)) {
    const purchases = Math.max(0, Number(premade.stats?.[stat] ?? base) - base)
    statLevels += purchases * STAT_LEVEL[stat]
  }
  const level = characterLevelFromTotal(skillLevels + statLevels)

  for (const skillId of premade.skills || []) {
    const sk = skillById.get(skillId)
    if (!sk) continue
    const enforceGate = premade.category === 'starter' || String(premade.premadeId || '').startsWith('level5_')
    if (enforceGate && minLevelForTier(sk.tier) > level) {
      add('WARN', 'premade-gate', `"${id}" (${premade.name}): skill "${skillId}" T${sk.tier} needs Lv${minLevelForTier(sk.tier)}, premade is Lv${level}`)
    }
  }

  for (const row of premade.inventory || []) {
    if (!itemIds.has(row.itemId)) add('ERROR', 'premade', `"${id}" inventory references missing item "${row.itemId}"`)
  }

  for (const slot of Object.values(premade.equipped || {})) {
    if (!slot) continue
    const inv = (premade.inventory || []).find(row => row.uid === slot)
    if (!inv) add('ERROR', 'premade', `"${id}" equipped uid "${slot}" not in inventory`)
    else if (!itemIds.has(inv.itemId)) add('ERROR', 'premade', `"${id}" equipped item "${inv.itemId}" missing from items data`)
  }

  const notes = premade.notes || ''
  const lootMatch = notes.match(/Defeat loot:\s*(\d+)\s*Lumens?(?:,\s*([\d,]+)\s*Gil)?/i)
  if (lootMatch) {
    const noteLumens = Number(lootMatch[1])
    const noteGil = lootMatch[2] ? Number(lootMatch[2].replace(/,/g, '')) : 0
    if (noteLumens !== Number(premade.lumens || 0)) {
      add('WARN', 'premade-loot', `"${id}": notes say ${noteLumens}L but data has ${premade.lumens}L`)
    }
    if (noteGil !== Number(premade.gil || 0)) {
      add('WARN', 'premade-loot', `"${id}": notes say ${noteGil}G but data has ${premade.gil}G`)
    }
  } else if (premade.category !== 'starter') {
    add('INFO', 'premade-loot', `"${id}": no "Defeat loot:" line in notes`)
  }

  if (!premade.category) add('WARN', 'premade', `"${id}" missing category`)
}

// ─── Report ───
const byLevel = { ERROR: [], WARN: [], INFO: [] }
for (const f of findings) byLevel[f.level].push(f)

console.log(`Scanned: ${Object.keys(racesJson).length} races · ${Object.keys(backgrounds).length} backgrounds · ${skillRows.length} skills · ${premades.length} premades\n`)
console.log(`Findings: ${errorCount} errors · ${warnCount} warnings · ${infoCount} info\n`)

for (const level of ['ERROR', 'WARN', 'INFO']) {
  const list = byLevel[level]
  if (!list.length) continue
  console.log(`--- ${level} (${list.length}) ---`)
  const byCat = new Map()
  for (const f of list) {
    if (!byCat.has(f.category)) byCat.set(f.category, [])
    byCat.get(f.category).push(f)
  }
  for (const [cat, rows] of byCat) {
    console.log(`\n  [${cat}]`)
    for (const row of rows.slice(0, 30)) {
      console.log(`    • ${row.message}`)
      if (row.detail) console.log(`      ${row.detail.slice(0, 140)}`)
    }
    if (rows.length > 30) console.log(`    … and ${rows.length - 30} more in ${cat}`)
  }
  console.log()
}

if (errorCount) {
  console.log(`AUDIT FAILED — ${errorCount} error(s) need fixing.\n`)
  process.exit(1)
}

console.log('AUDIT PASSED — no blocking errors. Review warnings and info items above.\n')
process.exit(0)
