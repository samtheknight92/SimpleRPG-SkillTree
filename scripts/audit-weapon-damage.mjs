#!/usr/bin/env node
/**
 * Audit all weapon items for damage field presence and parseable dice formulas.
 * Run: node scripts/audit-weapon-damage.mjs
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath, pathToFileURL } from 'url'

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')

function parseDamageFormula(formula) {
  const text = String(formula || '').trim()
  const match = text.match(/^(\d+)d(\d+)(?:\s*\+\s*(\d+))?$/i)
  if (!match) return null
  return {
    count: Number(match[1]),
    sides: Number(match[2]),
    modifier: Number(match[3] || 0)
  }
}

function collectWeaponsFromCatalog(data, source) {
  const weapons = []
  const add = (item, src) => {
    if (!item?.id) return
    const type = String(item.type || '').toLowerCase()
    if (!type.includes('weapon')) return
    weapons.push({ ...item, _source: src })
  }

  for (const [key, value] of Object.entries(data || {})) {
    if (key === 'effects') continue
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      if (value.id && String(value.type || '').toLowerCase().includes('weapon')) {
        add(value, source)
        continue
      }
      for (const item of Object.values(value)) {
        if (item && typeof item === 'object') add(item, `${source}/${key}`)
      }
    }
  }
  return weapons
}

function loadJson(rel) {
  const file = path.join(root, rel)
  if (!fs.existsSync(file)) return null
  return JSON.parse(fs.readFileSync(file, 'utf8'))
}

const catalogs = [
  ['data/json/items.json', loadJson('data/json/items.json')],
  ['data/json/profession-items.json', loadJson('data/json/profession-items.json')],
  ['data/json/discoverable-items.json', loadJson('data/json/discoverable-items.json')],
  ['data/json/loot-items.json', loadJson('data/json/loot-items.json')]
].filter(([, data]) => data)

const byId = new Map()
for (const [label, data] of catalogs) {
  for (const w of collectWeaponsFromCatalog(data, label)) {
    if (!byId.has(w.id)) byId.set(w.id, w)
    else {
      const prev = byId.get(w.id)
      if (prev.damage !== w.damage) {
        byId.set(w.id, { ...prev, _damageMismatch: [prev.damage, w.damage, prev._source, w._source] })
      }
    }
  }
}

const weapons = [...byId.values()].sort((a, b) => String(a.name).localeCompare(String(b.name)))

const missing = []
const unparseable = []
const descMismatch = []

for (const w of weapons) {
  const dmg = w.damage
  if (!dmg || !String(dmg).trim()) {
    missing.push(w)
    continue
  }
  if (!parseDamageFormula(dmg)) {
    unparseable.push(w)
  }
  const desc = String(w.desc || '')
  const descMatch = desc.match(/Damage:\s*([^\s.]+)/i)
  if (descMatch && descMatch[1] !== String(dmg).replace(/\s+/g, '')) {
    descMismatch.push({ weapon: w, descDice: descMatch[1], itemDice: dmg })
  }
}

console.log(`Weapon audit — ${weapons.length} unique weapons across catalogs\n`)

if (missing.length) {
  console.log(`MISSING damage field (${missing.length}):`)
  for (const w of missing) {
    console.log(`  - ${w.id} (${w.name}) [${w._source}] type=${w.type}`)
  }
  console.log()
}

if (unparseable.length) {
  console.log(`UNPARSEABLE damage formula (${unparseable.length}) — rollWeaponDamage falls back to flat 1:`)
  for (const w of unparseable) {
    console.log(`  - ${w.id} (${w.name}): "${w.damage}" [${w._source}]`)
  }
  console.log()
}

if (descMismatch.length) {
  console.log(`DESC vs damage field mismatch (${descMismatch.length}):`)
  for (const row of descMismatch) {
    console.log(`  - ${row.weapon.id}: item.damage="${row.itemDice}" but desc says "${row.descDice}"`)
  }
  console.log()
}

const dupDamageMismatch = weapons.filter(w => w._damageMismatch)
if (dupDamageMismatch.length) {
  console.log(`Cross-catalog damage mismatch (${dupDamageMismatch.length}):`)
  for (const w of dupDamageMismatch) {
    console.log(`  - ${w.id}: ${w._damageMismatch.join(' | ')}`)
  }
  console.log()
}

// Spot-check rollWeaponDamage output includes formula
const { rollWeaponDamage } = await import(pathToFileURL(path.join(root, 'js/damage-breakdown.js')).href)
const rollDice = (count, sides, mod = 0) => ({ rolls: [3], total: 3 + mod })
let rollFail = 0
for (const w of weapons) {
  if (!w.damage || !parseDamageFormula(w.damage)) continue
  const r = rollWeaponDamage(w.damage, rollDice)
  if (!r.detail.includes('d')) {
    rollFail++
    console.log(`ROLL DISPLAY FAIL: ${w.id} detail="${r.detail}"`)
  }
}

if (!missing.length && !unparseable.length && !descMismatch.length && !rollFail) {
  console.log('All weapons OK: every weapon has a parseable NdM damage formula.')
  console.log('Sample formulas:')
  const samples = weapons.slice(0, 5).map(w => `  ${w.name}: ${w.damage}`)
  console.log(samples.join('\n'))
  console.log(`  ... and ${weapons.length - 5} more`)
} else {
  console.log(`Summary: ${missing.length} missing, ${unparseable.length} unparseable, ${descMismatch.length} desc mismatches, ${rollFail} roll display fails`)
  process.exitCode = 1
}
