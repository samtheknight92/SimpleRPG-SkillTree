import fs from 'fs'
import path from 'path'
import vm from 'vm'
import { execSync } from 'child_process'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')
const dataDir = path.join(root, 'data')
const jsonDir = path.join(dataDir, 'json')

function fixMojibake(text) {
  if (typeof text !== 'string') return text
  if (!/[ÃÂâð�]/.test(text)) return text
  try {
    return Buffer.from(text, 'latin1').toString('utf8')
  } catch {
    return text
  }
}

function deepFix(value) {
  if (typeof value === 'string') return fixMojibake(value)
  if (Array.isArray(value)) return value.map(deepFix)
  if (value && typeof value === 'object') {
    const out = {}
    for (const [k, v] of Object.entries(value)) out[k] = deepFix(v)
    return out
  }
  return value
}

function runLegacy(file) {
  const code = fs.readFileSync(path.join(dataDir, file), 'utf8')
  const sandbox = { console, window: {}, globalThis: {} }
  sandbox.globalThis.window = sandbox.window
  vm.createContext(sandbox)
  vm.runInContext(code, sandbox)
  return sandbox.window
}

function writeJson(name, data) {
  fs.writeFileSync(path.join(jsonDir, `${name}.json`), JSON.stringify(deepFix(data), null, 2), 'utf8')
}

function extractEffects() {
  const legacyApp = path.join(root, 'legacy', 'app.js')
  const effectsJson = path.join(jsonDir, 'effects.json')
  if (fs.existsSync(effectsJson)) {
    writeJson('effects', JSON.parse(fs.readFileSync(effectsJson, 'utf8')))
    return
  }
  if (!fs.existsSync(legacyApp)) return
  const app = fs.readFileSync(legacyApp, 'utf8')
  const start = app.indexOf('const EFFECT_DEFINITIONS = {')
  const end = app.indexOf('\n\n\n  const state = {')
  if (start === -1 || end === -1) throw new Error('Could not locate EFFECT_DEFINITIONS in app.js')
  const block = app.slice(start + 'const EFFECT_DEFINITIONS = '.length, end).trim()
  const effects = vm.runInNewContext(`(${block})`)
  const out = `// Auto-generated from app.js — do not edit by hand; run: node scripts/build-data.mjs\nexport const EFFECT_DEFINITIONS = ${JSON.stringify(deepFix(effects), null, 2)}\n`
  fs.writeFileSync(path.join(dataDir, 'effects-data.js'), out, 'utf8')
  writeJson('effects', effects)
}

fs.mkdirSync(jsonDir, { recursive: true })

const loadOrder = [
  'races-data.js',
  'skills-data.js',
  'careers-skills-data.js',
  'profession-items-data.js',
  'discoverable-items-data.js',
  'monster-loot-data.js',
  'items-data.js'
]

const window = {}
for (const file of loadOrder) {
  const code = fs.readFileSync(path.join(dataDir, file), 'utf8')
  const sandbox = { console, window, globalThis: { window } }
  vm.createContext(sandbox)
  vm.runInContext(code, sandbox)
}

extractEffects()

writeJson('races', window.RACES_DATA || {})

const skills = { ...(window.SKILLS_DATA || {}) }
if (window.CAREERS_SKILLS_DATA) skills.careers = window.CAREERS_SKILLS_DATA
const racial = window.RACE_SKILL_TREES || {}
skills.racial = { ...racial }
if (skills.monster) {
  skills.racial.monster = skills.monster
  delete skills.monster
}
writeJson('skills', skills)
writeJson('items', window.ITEMS_DATA || {})
writeJson('profession-items', window.PROFESSION_ITEMS_DATA || {})
writeJson('discoverable-items', window.DISCOVERABLE_ITEMS_DATA || {})
writeJson('monster-loot', window.MONSTER_LOOT_DATA || {})

const skillMetaRaw = fs.readFileSync(path.join(dataDir, 'skill-meta.js'), 'utf8').replace(/^\uFEFF/, '')
const skillMeta = skillMetaRaw.replace(/^export const /gm, 'const ')
const metaSandbox = { module: { exports: {} } }
vm.createContext(metaSandbox)
const metaResult = vm.runInContext(`${skillMeta}; ({ TOGGLE_BONUSES, PASSIVE_SKILL_BONUSES, PASSIVE_SKILL_EFFECTS, EQUIPMENT_SKILL_EFFECTS, TOGGLE_SKILL_EFFECTS, INCOMPATIBILITIES })`, metaSandbox)
writeJson('skill-meta', {
  TOGGLE_BONUSES: metaResult.TOGGLE_BONUSES || {},
  PASSIVE_SKILL_BONUSES: metaResult.PASSIVE_SKILL_BONUSES || {},
  PASSIVE_SKILL_EFFECTS: metaResult.PASSIVE_SKILL_EFFECTS || {},
  EQUIPMENT_SKILL_EFFECTS: metaResult.EQUIPMENT_SKILL_EFFECTS || {},
  TOGGLE_SKILL_EFFECTS: metaResult.TOGGLE_SKILL_EFFECTS || {},
  INCOMPATIBILITIES: metaResult.INCOMPATIBILITIES || {}
})

console.log('Built JSON data and effects-data.js')
execSync('node scripts/build-premade-characters.mjs', { cwd: root, stdio: 'inherit' })
