#!/usr/bin/env node
/**
 * Master audit — runs every automated check and reports in plain sections.
 * Run: node scripts/full-audit.mjs
 */
import fs from 'fs'
import path from 'path'
import { execSync } from 'child_process'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')
const jsonDir = path.join(root, 'data', 'json')

const sections = []
let totalErrors = 0
let totalWarnings = 0

function section(title, ok, details = []) {
  sections.push({ title, ok, details })
  if (!ok) totalErrors += details.filter(d => d.level === 'error').length
  totalWarnings += details.filter(d => d.level === 'warn').length
}

function readJson(name) {
  return JSON.parse(fs.readFileSync(path.join(jsonDir, `${name}.json`), 'utf8'))
}

function walkSkills(value, out = []) {
  if (Array.isArray(value)) {
    for (const s of value) if (s?.id) out.push(s)
    return out
  }
  if (value && typeof value === 'object') {
    for (const v of Object.values(value)) walkSkills(v, out)
  }
  return out
}

function walkItems(value, out = []) {
  if (Array.isArray(value)) {
    for (const c of value) walkItems(c, out)
    return out
  }
  if (value && typeof value === 'object') {
    if (value.id && value.name) out.push(value)
    for (const c of Object.values(value)) if (c && typeof c === 'object') walkItems(c, out)
  }
  return out
}

function parseStatBonusesFromDesc(desc) {
  const totals = {}
  const re = /\+(\d+)\s+(max\s+)?(HP|Stamina|Strength|Magic Power|Accuracy|Speed|Physical Defence|Magical Defence)/gi
  let m
  while ((m = re.exec(desc || ''))) {
    const key = m[3].toLowerCase().replace(/\s+/g, '')
    const stat = key === 'magicpower' ? 'magicPower'
      : key === 'physicaldefence' ? 'physicalDefence'
      : key === 'magicaldefence' ? 'magicalDefence'
      : key
    totals[stat] = (totals[stat] || 0) + Number(m[1])
  }
  return totals
}

function runScript(name) {
  try {
    const out = execSync(`node scripts/${name}`, { cwd: root, encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] })
    return { ok: true, out }
  } catch (err) {
    return { ok: false, out: (err.stdout || '') + (err.stderr || '') + (err.message || '') }
  }
}

console.log('Running full project audit...\n')

// ── 1. Static files (HTML, CSS, JS imports) ──
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8')
const staticDetails = []
for (const m of html.matchAll(/(?:href|src)=["']([^"']+)["']/g)) {
  const ref = m[1]
  if (ref.startsWith('http') || ref.startsWith('#')) continue
  const filePath = path.join(root, ref)
  if (!fs.existsSync(filePath)) {
    staticDetails.push({ level: 'error', text: `Missing file linked from index.html: ${ref}` })
  }
}
const jsFiles = fs.readdirSync(path.join(root, 'js')).filter(f => f.endsWith('.js'))
const importRe = /from\s+['"](\.\/[^'"]+)['"]/g
const jsGraph = new Set(jsFiles.map(f => `./${f}`))
for (const file of jsFiles) {
  const src = fs.readFileSync(path.join(root, 'js', file), 'utf8')
  importRe.lastIndex = 0
  let imp
  while ((imp = importRe.exec(src))) {
    const target = imp[1]
    if (!target.endsWith('.js')) continue
    const resolved = path.normalize(path.join('js', path.dirname(file), target.replace(/^\.\//, '')))
    if (!fs.existsSync(path.join(root, resolved))) {
      staticDetails.push({ level: 'error', text: `${file} imports missing module ${target}` })
    }
  }
}
const DATA_FILES = [
  'races', 'skills', 'items', 'profession-items', 'discoverable-items',
  'monster-loot', 'effects', 'skill-meta', 'premade-characters', 'manifest'
]
for (const key of DATA_FILES) {
  const file = `${key}.json`
  if (!fs.existsSync(path.join(jsonDir, file))) {
    staticDetails.push({ level: 'error', text: `Missing game data file: data/json/${file}` })
  }
}
section('App files & links', staticDetails.length === 0, staticDetails.length ? staticDetails : [{ level: 'ok', text: `${jsFiles.length} JS modules, index.html links, and ${DATA_FILES.length} data files — all present` }])

// ── 2. Data integrity (validate-data) ──
const validate = runScript('validate-data.mjs')
section('Game data links', validate.ok, validate.ok
  ? [{ level: 'ok', text: validate.out.trim() }]
  : [{ level: 'error', text: validate.out.trim() }])

// ── 3. Content audit ──
const content = runScript('content-audit.mjs')
const contentFailed = !content.ok
const contentWarns = (content.out.match(/(\d+) warnings/) || [])[1] || '0'
section('Characters, races & premades', !contentFailed, contentFailed
  ? [{ level: 'error', text: 'Content audit found blocking errors — run node scripts/content-audit.mjs' }]
  : [{ level: 'ok', text: `No broken references. ${contentWarns} table-rule reminders (luck, sunlight, etc. — GM handles those at the table).` }])

// ── 4. Skill bonuses match skill text ──
const skills = walkSkills(readJson('skills'))
const meta = readJson('skill-meta')
const skillById = new Map(skills.map(s => [s.id, s]))
const bonusDetails = []
for (const [skillId, bonuses] of Object.entries(meta.PASSIVE_SKILL_BONUSES || {})) {
  const skill = skillById.get(skillId)
  if (!skill) {
    bonusDetails.push({ level: 'error', text: `Bonus config for unknown skill "${skillId}"` })
    continue
  }
  const fromDesc = parseStatBonusesFromDesc(skill.desc)
  for (const [stat, value] of Object.entries(bonuses)) {
    const descVal = fromDesc[stat]
    if (descVal == null) {
      bonusDetails.push({ level: 'warn', text: `${skill.name}: code gives +${value} ${stat} but skill text doesn't mention it` })
    } else if (descVal !== value) {
      bonusDetails.push({ level: 'error', text: `${skill.name}: text says +${descVal} ${stat}, code gives +${value}` })
    }
  }
}
for (const [skillId, rule] of Object.entries(meta.EQUIPMENT_SKILL_EFFECTS || {})) {
  const skill = skillById.get(skillId)
  if (!skill) bonusDetails.push({ level: 'error', text: `Equipment bonus for unknown skill "${skillId}"` })
  else if (rule.effectId && !readJson('effects')[rule.effectId]) {
    bonusDetails.push({ level: 'error', text: `${skill.name}: equipment effect "${rule.effectId}" missing from effects.json` })
  }
}
for (const [skillId, effectIds] of Object.entries(meta.PASSIVE_SKILL_EFFECTS || {})) {
  const effects = readJson('effects')
  for (const id of effectIds || []) {
    if (!effects[id]) bonusDetails.push({ level: 'error', text: `Skill "${skillId}" passive effect "${id}" missing from effects.json` })
  }
}
section('Skill bonuses match skill descriptions', !bonusDetails.some(d => d.level === 'error'), bonusDetails.length
  ? bonusDetails.slice(0, 20)
  : [{ level: 'ok', text: `Checked ${Object.keys(meta.PASSIVE_SKILL_BONUSES || {}).length} passive bonuses — all match skill text` }])

// ── 5. Items: GRANTS / specialEffects ──
const effects = readJson('effects')
const allItems = [
  ...walkItems(readJson('items')),
  ...walkItems(readJson('profession-items')),
  ...walkItems(readJson('discoverable-items')),
  ...walkItems(readJson('monster-loot'))
]
const itemDetails = []
for (const item of allItems) {
  for (const id of item.specialEffects || []) {
    if (!effects[id]) itemDetails.push({ level: 'error', text: `Item "${item.name}" references missing effect "${id}"` })
  }
  const grantsMatch = (item.desc || '').match(/GRANTS:\s*([^\.]+)/i)
  if (grantsMatch && !(item.specialEffects || []).length && !item.statModifiers) {
    itemDetails.push({ level: 'warn', text: `Item "${item.name}" says GRANTS in text but has no specialEffects in data` })
  }
}
section('Items & their effects', !itemDetails.some(d => d.level === 'error'), itemDetails.length
  ? itemDetails.slice(0, 15)
  : [{ level: 'ok', text: `Checked ${allItems.length} items — all effects exist` }])

// ── 6. Racial exclusive skills exist ──
const races = readJson('races')
const raceDetails = []
const allSkillIds = new Set(skills.map(s => s.id))
for (const [raceId, race] of Object.entries(races)) {
  for (const id of race.exclusiveSkills || []) {
    if (!allSkillIds.has(id)) raceDetails.push({ level: 'error', text: `${race.name}: exclusive skill "${id}" not found in skills.json` })
  }
}
section('Racial skill trees', raceDetails.length === 0, raceDetails.length ? raceDetails : [{ level: 'ok', text: 'Every race exclusive skill exists in the skill tree' }])

function readManifestLines() {
  const raw = fs.readFileSync(path.join(root, 'characters_in_data_file.txt'))
  let text
  if (raw[0] === 0xFF && raw[1] === 0xFE) text = raw.toString('utf16le')
  else if (raw.length > 3 && raw[1] === 0 && raw[3] === 0) text = raw.toString('utf16le')
  else text = raw.toString('utf8')
  return [...new Set(text.split(/\r?\n/).map(l => l.trim().replace(/\0/g, '')).filter(Boolean))]
}

// ── 7. Premade manifest ──
const manifestLines = readManifestLines()
const premades = readJson('premade-characters')
const premadeDetails = []
if (premades.length !== manifestLines.length) {
  premadeDetails.push({ level: 'warn', text: `Manifest lists ${manifestLines.length} characters but built file has ${premades.length}` })
}
section('Premade character list', premadeDetails.length === 0, premadeDetails.length ? premadeDetails : [{ level: 'ok', text: `${premades.length} premade characters built from manifest` }])

// ── 8. Copy quality (ruleset) ──
const ruleset = runScript('audit-ruleset.mjs')
const skillFlags = (ruleset.out.match(/Skills with flags: (\d+)/) || [])[1] || '?'
const itemFlags = (ruleset.out.match(/Items with flags: (\d+)/) || [])[1] || '?'
const dupes = (ruleset.out.match(/Duplicate skill IDs: (\d+)/) || [])[1] || '?'
section('Writing quality (skill & item descriptions)', Number(dupes) === 0, [
  { level: Number(dupes) === 0 ? 'ok' : 'error', text: `Duplicate skill IDs: ${dupes}` },
  { level: Number(itemFlags) === 0 ? 'ok' : 'warn', text: `Items with wording flags: ${itemFlags}` },
  { level: Number(skillFlags) === 0 ? 'ok' : 'warn', text: `Skills with wording flags: ${skillFlags} (mostly attunement % text — intentional)` }
])

// ── 9. Economy sanity ──
const balance = runScript('balance-audit.mjs')
const balanceFlags = balance.out.includes('No automatic red flags')
section('Progression & loot economy', balance.ok && balanceFlags, [
  { level: balanceFlags ? 'ok' : 'warn', text: balanceFlags ? 'Lumen/Gil costs and boss drops look reasonable' : 'Balance audit flagged something — see balance-audit.mjs' }
])

// ── 10. Design rules (weapons, shop gates, copy) ──
const rules = runScript('rules-compliance.mjs')
section('Design rules compliance', rules.ok, [
  { level: rules.ok ? 'ok' : 'error', text: rules.ok ? rules.out.trim().split('\n').slice(-1)[0] || 'Supplemental rules check passed' : 'Rules compliance failed — run node scripts/rules-compliance.mjs' }
])

// ── 11. Save logic & JS syntax ──
const saveTest = runScript('test-save-roundtrip.mjs')
const syntax = runScript('check-js-syntax.mjs')
section('Save round-trip & JS syntax', saveTest.ok && syntax.ok, [
  { level: saveTest.ok ? 'ok' : 'error', text: saveTest.ok ? 'Save import/export logic tests passed' : 'Save tests failed — run node scripts/test-save-roundtrip.mjs' },
  { level: syntax.ok ? 'ok' : 'error', text: syntax.ok ? 'All js/*.js modules pass syntax check' : 'JS syntax check failed — run node scripts/check-js-syntax.mjs' }
])

// ── Report ──
console.log('═══════════════════════════════════════════════════════')
console.log(' FULL PROJECT AUDIT — plain summary')
console.log('═══════════════════════════════════════════════════════\n')

for (const s of sections) {
  const icon = s.ok ? '✓' : '✗'
  console.log(`${icon} ${s.title}`)
  for (const d of s.details.slice(0, 8)) {
    const prefix = d.level === 'error' ? '  !!' : d.level === 'warn' ? '  ?' : '   '
    console.log(`${prefix} ${d.text}`)
  }
  if (s.details.length > 8) console.log(`   … and ${s.details.length - 8} more`)
  console.log()
}

const allOk = sections.every(s => s.ok)
console.log(allOk
  ? 'OVERALL: Everything automated checks passed. The app data is consistent and wired up.'
  : `OVERALL: Found issues above — ${totalErrors} error(s), ${totalWarnings} warning(s).`)
console.log('\nNot checked by script (need playing in browser): button clicks, save/load, combat toasts, folder UI.\n')
process.exit(allOk ? 0 : 1)
