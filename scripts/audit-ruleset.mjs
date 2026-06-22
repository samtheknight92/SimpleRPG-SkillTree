#!/usr/bin/env node
/**
 * Audit player-facing desc text against LumenForge simple-game rules.
 * Scans source data files (not generated json).
 */
import fs from 'fs'
import path from 'path'
import vm from 'vm'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')
const dataDir = path.join(root, 'data')

const CHECKS = [
  { id: 'algebra', label: 'Algebra (n, n², where n)', re: /\bn²\b|\bn\^2\b|where n\b|\(\s*n\s*\)|=\s*n\b/i },
  { id: 'pd-md-abbr', label: 'PD/MD abbreviation in desc', re: /\b(?:\+|\−|\-)\d+\s+PD\b|\bPD for\b|\b\+1 PD\b|\bMD vs\b|\b\+1 MD\b|\bper MD\b/i },
  { id: 'phys-mag-abbr', label: 'Phys/Mag Def abbreviation', re: /Phys Def|Mag Def/i },
  { id: 'bad-harmony', label: 'Wrong harmony phrasing', re: /Other \[careers\]|Other careers Harmony/i },
  { id: 'advantage', label: 'D&D advantage/disadvantage', re: /\badvantage\b|\bdisadvantage\b/i },
  { id: 'percent-resist', label: 'Percent resistance maths', re: /\d+%\s*\([+\-]\d+\)|weakness \d+%/i },
  { id: 'long-desc', label: 'Very long desc (>280 chars)', re: null, test: (d) => d.length > 280 },
  { id: 'unless-chain', label: 'Long unless/except chain', re: /unless.{20,}|except when.{20,}/i },
  { id: 'stack-cap', label: 'Stackable cap bookkeeping', re: /stackable up to|stacking up to|per long rest per source/i },
  { id: 'every-n', label: 'Every N also rider', re: /every \d+ also|at 3\+ also/i }
]

function loadJsExport(file, globalName) {
  const filePath = path.join(dataDir, file)
  if (!fs.existsSync(filePath)) return null
  const sandbox = { window: {}, console }
  vm.createContext(sandbox)
  vm.runInContext(fs.readFileSync(filePath, 'utf8'), sandbox)
  return sandbox.window[globalName] ?? sandbox[globalName]
}

function loadCareersFromData() {
  const filePath = path.join(dataDir, 'careers-skills-data.js')
  const sandbox = { window: {}, console }
  vm.createContext(sandbox)
  vm.runInContext(fs.readFileSync(filePath, 'utf8'), sandbox)
  return sandbox.window.CAREERS_SKILLS_DATA || {}
}

function collectSkillsFromTree(tree, category, subcategory, out) {
  if (!tree) return
  if (Array.isArray(tree)) {
    for (const s of tree) out.push({ ...s, category, subcategory })
    return
  }
  for (const [sub, skills] of Object.entries(tree)) {
    if (Array.isArray(skills)) {
      for (const s of skills) out.push({ ...s, category, subcategory: subcategory || sub })
    } else if (skills && typeof skills === 'object') {
      collectSkillsFromTree(skills, category, sub, out)
    }
  }
}

function collectItems(items, category, out) {
  if (!items) return
  if (Array.isArray(items)) {
    for (const item of items) {
      out.push({ id: item.id, name: item.name, desc: item.desc || '', category, type: item.type })
      if (item.items) collectItems(item.items, category, out)
    }
    return
  }
  if (typeof items === 'object') {
    for (const [key, val] of Object.entries(items)) {
      if (val && typeof val === 'object') collectItems(val, key, out)
    }
  }
}

function auditDesc(entry, checks) {
  const desc = entry.desc || ''
  const hits = []
  for (const c of checks) {
    if (c.re && c.re.test(desc)) hits.push(c.id)
    if (c.test && c.test(desc)) hits.push(c.id)
  }
  return hits
}

const findings = []
const allSkills = []
const allItems = []

// Careers
const careers = loadCareersFromData()
for (const [career, skills] of Object.entries(careers)) {
  for (const s of skills) allSkills.push({ ...s, category: 'careers', subcategory: career, source: 'generate-careers.mjs' })
}

// Weapon/magic/etc skills
const skillsData = loadJsExport('skills-data.js', 'SKILLS_DATA') || {}
for (const [cat, tree] of Object.entries(skillsData)) {
  if (Array.isArray(tree)) {
    for (const s of tree) allSkills.push({ ...s, category: cat, subcategory: cat, source: 'skills-data.js' })
  } else if (tree && typeof tree === 'object') {
    for (const [sub, skills] of Object.entries(tree)) {
      if (Array.isArray(skills)) {
        for (const s of skills) allSkills.push({ ...s, category: cat, subcategory: sub, source: 'skills-data.js' })
      }
    }
  }
}

// Racial skills from races-data
const races = loadJsExport('races-data.js', 'RACES_DATA') || {}
for (const [race, data] of Object.entries(races)) {
  const skills = data?.skills || data?.racialSkills || []
  if (Array.isArray(skills)) {
    for (const s of skills) allSkills.push({ ...s, category: 'racial', subcategory: race, source: 'races-data.js' })
  }
}

// Race skill trees
const raceTrees = loadJsExport('races-data.js', 'RACE_SKILL_TREES') || {}
for (const [race, tiers] of Object.entries(raceTrees)) {
  if (!tiers || typeof tiers !== 'object') continue
  for (const skills of Object.values(tiers)) {
    if (!Array.isArray(skills)) continue
    for (const s of skills) allSkills.push({ ...s, category: 'racial', subcategory: race, source: 'races-data.js (tree)' })
  }
}

// Items
const itemsData = loadJsExport('items-data.js', 'ITEMS_DATA') || {}
collectItems(itemsData, 'items', allItems)

const discoverable = loadJsExport('discoverable-items-data.js', 'DISCOVERABLE_ITEMS_DATA') || {}
collectItems(discoverable, 'discoverable', allItems)

const professionItems = loadJsExport('profession-items-data.js', 'PROFESSION_ITEMS_DATA') || {}
if (Array.isArray(professionItems)) {
  for (const item of professionItems) allItems.push({ ...item, category: 'profession', type: item.type })
} else if (professionItems && typeof professionItems === 'object') {
  collectItems(professionItems, 'profession', allItems)
}

// Duplicate skill ids
const idMap = new Map()
for (const s of allSkills) {
  if (!s.id) continue
  const key = s.id
  if (!idMap.has(key)) idMap.set(key, [])
  idMap.get(key).push(`${s.category}/${s.subcategory}`)
}

for (const s of allSkills) {
  const hits = auditDesc(s, CHECKS)
  if (hits.length) findings.push({ kind: 'skill', id: s.id, name: s.name, source: s.source, category: `${s.category}/${s.subcategory}`, hits, desc: (s.desc || '').slice(0, 120) + '…' })
}

for (const item of allItems) {
  const hits = auditDesc(item, CHECKS)
  if (hits.length) findings.push({ kind: 'item', id: item.id, name: item.name, source: 'items-data.js', category: item.category, hits, desc: (item.desc || '').slice(0, 120) + '…' })
}

const dupes = [...idMap.entries()].filter(([, locs]) => locs.length > 1)

console.log('=== LumenForge ruleset audit ===\n')
console.log(`Skills scanned: ${allSkills.length}`)
console.log(`Items scanned: ${allItems.length}`)
console.log(`Skills with flags: ${findings.filter(f => f.kind === 'skill').length}`)
console.log(`Items with flags: ${findings.filter(f => f.kind === 'item').length}`)
console.log(`Duplicate skill IDs: ${dupes.length}\n`)

if (dupes.length) {
  console.log('--- DUPLICATE SKILL IDs ---')
  for (const [id, locs] of dupes) console.log(`  ${id}: ${locs.join(', ')}`)
  console.log()
}

const byCheck = {}
for (const f of findings) {
  for (const h of f.hits) {
    if (!byCheck[h]) byCheck[h] = []
    byCheck[h].push(f)
  }
}

for (const c of CHECKS) {
  const list = byCheck[c.id] || []
  if (!list.length) continue
  console.log(`--- ${c.label} (${list.length}) ---`)
  for (const f of list.slice(0, 25)) {
    console.log(`  [${f.kind}] ${f.id} (${f.name}) — ${f.category}`)
    console.log(`    ${f.desc}`)
  }
  if (list.length > 25) console.log(`  … and ${list.length - 25} more`)
  console.log()
}

// Harmony skills without harmony line (careers only) - informational
const harmonyCareers = allSkills.filter(s => s.source === 'generate-careers.mjs' && /Action:|Craft:|Pre-combat:/.test(s.desc || '') && !/Harmony/.test(s.desc || ''))
if (harmonyCareers.length) {
  console.log(`--- Career action skills without Harmony line (${harmonyCareers.length}) — OK if solo-only ---`)
  for (const s of harmonyCareers.slice(0, 15)) console.log(`  ${s.id}: ${s.name}`)
  console.log()
}

process.exit(0)
