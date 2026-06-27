#!/usr/bin/env node
/**
 * Supplemental LumenForge design-rules compliance (beyond full-audit.mjs).
 * Run: node scripts/rules-compliance.mjs
 */
import fs from 'fs'
import path from 'path'
import vm from 'vm'
import { fileURLToPath } from 'url'
import { minLevelForTier, SHOP_MIN_LEVEL_BY_RARITY } from './lib/progression.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')
const dataDir = path.join(root, 'data')
const jsonDir = path.join(root, 'data', 'json')

const findings = []

function add(sev, cat, msg) {
  findings.push({ sev, cat, msg })
}

function loadJsExport(file, globalName) {
  const sandbox = { window: {}, console }
  vm.createContext(sandbox)
  vm.runInContext(fs.readFileSync(path.join(dataDir, file), 'utf8'), sandbox)
  return sandbox.window[globalName]
}

function walkItems(value, out = []) {
  if (!value) return out
  if (Array.isArray(value)) {
    for (const c of value) walkItems(c, out)
    return out
  }
  if (value.id && value.name) out.push(value)
  for (const c of Object.values(value)) {
    if (c && typeof c === 'object') walkItems(c, out)
  }
  return out
}

function walkSkills(value, out = []) {
  if (!value) return out
  if (Array.isArray(value)) {
    for (const s of value) if (s?.id) out.push(s)
    return out
  }
  if (value && typeof value === 'object') {
    for (const v of Object.values(value)) walkSkills(v, out)
  }
  return out
}

// ── Weapons must have damage ──
const shop = loadJsExport('items-data.js', 'ITEMS_DATA')
const prof = loadJsExport('profession-items-data.js', 'PROFESSION_ITEMS_DATA')
const allSourceItems = [...walkItems(shop), ...walkItems(prof)]
const weapons = allSourceItems.filter(i => /weapon/i.test(String(i.type || '')))
const noDmg = weapons.filter(i => !i.damage)
if (noDmg.length) {
  add('ERROR', 'weapons', `${noDmg.length} weapons missing damage: ${noDmg.map(i => i.id).join(', ')}`)
}

// ── Merchant career removed ──
const careers = loadJsExport('careers-skills-data.js', 'CAREERS_SKILLS_DATA') || {}
if (careers.merchant) add('ERROR', 'careers', 'merchant career still in careers-skills-data.js')
const genSrc = fs.readFileSync(path.join(root, 'scripts', 'generate-careers.mjs'), 'utf8')
if (/\bid:\s*['"]merchant['"]/.test(genSrc)) {
  add('ERROR', 'careers', 'merchant career still defined in generate-careers.mjs')
}

// ── Level 1 baseline ──
if (minLevelForTier(1) !== 1) add('ERROR', 'level', `tier 1 min level is ${minLevelForTier(1)}, expected 1`)
if (minLevelForTier(5) !== 21) add('ERROR', 'level', `tier 5 min level is ${minLevelForTier(5)}, expected 21`)

const CURRENCY = { gold: 2500, silver: 100, copper: 1 }
const toGil = p => (Number(p?.gold || 0) * CURRENCY.gold) + (Number(p?.silver || 0) * CURRENCY.silver) + Number(p?.copper || 0)

// ── Shop rarity gates ──
const itemsJson = JSON.parse(fs.readFileSync(path.join(jsonDir, 'items.json'), 'utf8'))
const pricedShop = walkItems(itemsJson).filter(i => i.price && toGil(i.price) > 0)
const badGate = pricedShop.filter(i => {
  const r = String(i.rarity || 'common').toLowerCase()
  const exp = SHOP_MIN_LEVEL_BY_RARITY[r] ?? 1
  return i.shopMinLevel != null && i.shopMinLevel !== exp
})
if (badGate.length) {
  add('WARN', 'shop', `${badGate.length} priced items with wrong shopMinLevel: ${badGate.slice(0, 8).map(i => `${i.id}=${i.shopMinLevel}`).join(', ')}`)
}
const missingGate = pricedShop.filter(i => i.shopMinLevel == null)
if (missingGate.length) {
  add('WARN', 'shop', `${missingGate.length} priced shop items missing shopMinLevel`)
}

// ── Copy rules on built skills.json ──
const skillsJson = JSON.parse(fs.readFileSync(path.join(jsonDir, 'skills.json'), 'utf8'))
const allSkills = walkSkills(skillsJson)
const COPY_CHECKS = [
  { id: 'algebra', re: /\bn²\b|\bn\^2\b|where n\b/i, allow: [] },
  { id: 'advantage', re: /\badvantage\b|\bdisadvantage\b/i, allow: [/reach_advantage/i] },
  { id: 'pd-md', re: /\b\+\d+ PD\b|\b\+\d+ MD\b|\bPD for\b/i, allow: [] },
  { id: 'bad-harmony', re: /Other \[careers\]/i, allow: [] },
  { id: 'stack-bookkeeping', re: /stackable up to|per long rest per source|every \d+ also|at 3\+ also/i, allow: [] }
]
for (const s of allSkills) {
  const d = s.desc || ''
  for (const c of COPY_CHECKS) {
    if (!c.re.test(d)) continue
    if (c.allow.some(a => a.test(s.id))) continue
    add('WARN', 'copy', `${c.id}: ${s.id} (${s.name})`)
  }
}

// ── GRANTS text vs data ──
const effects = JSON.parse(fs.readFileSync(path.join(jsonDir, 'effects.json'), 'utf8'))
const profJson = JSON.parse(fs.readFileSync(path.join(jsonDir, 'profession-items.json'), 'utf8'))
const allBuiltItems = [...walkItems(itemsJson), ...walkItems(profJson)]
for (const item of allBuiltItems) {
  for (const id of item.specialEffects || []) {
    if (!effects[id]) add('ERROR', 'items', `${item.id} references missing effect ${id}`)
  }
  if (/GRANTS:/i.test(item.desc || '') && !(item.specialEffects?.length) && !item.statModifiers) {
    add('WARN', 'items', `${item.id} says GRANTS but has no specialEffects/statModifiers`)
  }
}

// ── Harmony careers: skills with Harmony Reaction format ──
const careerSkills = Object.values(careers).flat()
const harmonySkills = careerSkills.filter(s => /Harmony Reaction:|\+ Harmony:/.test(s.desc || ''))
const actionSkills = careerSkills.filter(s => /Action:|Craft:|Pre-combat:/.test(s.desc || ''))

// ── Enchantments: recipes exist ──
function walkItemsWithPath(value, pathParts = [], out = []) {
  if (!value) return out
  if (Array.isArray(value)) {
    for (const c of value) walkItemsWithPath(c, pathParts, out)
    return out
  }
  if (value.id && value.name) out.push({ ...value, _path: pathParts.join('/') })
  for (const [key, c] of Object.entries(value)) {
    if (c && typeof c === 'object') walkItemsWithPath(c, [...pathParts, key], out)
  }
  return out
}
const profRows = walkItemsWithPath(profJson)
const enchantRecipes = profRows.filter(i => i._path.startsWith('enchanting') || /enchant/i.test(String(i.type || '')))

console.log('=== LumenForge rules compliance (supplemental) ===\n')
console.log(`Weapons: ${weapons.length} (missing damage: ${noDmg.length})`)
console.log(`Priced shop items: ${pricedShop.length}`)
console.log(`Career skills: ${careerSkills.length} (${harmonySkills.length} with Harmony lines, ${actionSkills.length - harmonySkills.length} action/craft without — OK if solo)`)
console.log(`Enchantment recipes in profession data: ${enchantRecipes.length}`)

const errors = findings.filter(f => f.sev === 'ERROR')
const warns = findings.filter(f => f.sev === 'WARN')

if (errors.length) {
  console.log(`\n--- ERRORS (${errors.length}) ---`)
  for (const f of errors) console.log(`  [${f.cat}] ${f.msg}`)
}
if (warns.length) {
  console.log(`\n--- WARNINGS (${warns.length}) ---`)
  for (const f of warns.slice(0, 40)) console.log(`  [${f.cat}] ${f.msg}`)
  if (warns.length > 40) console.log(`  … and ${warns.length - 40} more`)
}

if (!errors.length && !warns.length) {
  console.log('\nAll supplemental checks passed.')
} else if (!errors.length) {
  console.log('\nPASSED — no blocking errors; review warnings above.')
} else {
  console.log('\nFAILED — fix errors above.')
  process.exit(1)
}
