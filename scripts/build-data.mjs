import fs from 'fs'
import path from 'path'
import vm from 'vm'
import { execSync } from 'child_process'
import { fileURLToPath } from 'url'
import { shopMinLevelForItem } from './lib/progression.mjs'

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

function iconLooksCorrupt(text) {
  return typeof text === 'string' && /[ÃÂâð��]/.test(text)
}

function deepFix(value, key = '') {
  if (typeof value === 'string') {
    const fixed = fixMojibake(value)
    // A few source icon strings contain replacement characters, meaning the
    // original emoji cannot be recovered. Blank them so the app can use its
    // normal fallback icons instead of showing mojibake.
    if (key === 'icon' && iconLooksCorrupt(fixed)) return ''
    return fixed
  }
  if (Array.isArray(value)) return value.map(item => deepFix(item, key))
  if (value && typeof value === 'object') {
    const out = {}
    for (const [k, v] of Object.entries(value)) out[k] = deepFix(v, k)
    return out
  }
  return value
}

function writeJson(name, data) {
  fs.writeFileSync(path.join(jsonDir, `${name}.json`), JSON.stringify(deepFix(data), null, 2), 'utf8')
}

function extractEffects() {
  const effectsJson = path.join(jsonDir, 'effects.json')
  if (!fs.existsSync(effectsJson)) {
    throw new Error('Missing data/json/effects.json — run scripts/generate-career-effects.mjs or restore effects.json')
  }
  writeJson('effects', JSON.parse(fs.readFileSync(effectsJson, 'utf8')))
}

fs.mkdirSync(jsonDir, { recursive: true })

execSync('node scripts/generate-career-effects.mjs', { cwd: root, stdio: 'inherit' })
execSync('node scripts/generate-careers.mjs', { cwd: root, stdio: 'inherit' })
execSync('node scripts/attach-activation-effects.mjs', { cwd: root, stdio: 'inherit' })
execSync('node scripts/adjust-skill-costs.mjs', { cwd: root, stdio: 'inherit' })

const loadOrder = [
  'races-data.js',
  'skills-data.js',
  'careers-skills-data.js',
  'career-fusions-skills-data.js',
  'profession-items-data.js',
  'discoverable-items-data.js',
  'monster-loot-data.js',
  'items-data.js'
]

const window = {}
for (const file of loadOrder) {
  const filePath = path.join(dataDir, file)
  if (!fs.existsSync(filePath)) {
    if (file === 'career-fusions-skills-data.js') continue
    throw new Error(`Missing data file: ${file}`)
  }
  const code = fs.readFileSync(filePath, 'utf8')
  const sandbox = { console, window, globalThis: { window } }
  vm.createContext(sandbox)
  vm.runInContext(code, sandbox)
}

extractEffects()

writeJson('races', window.RACES_DATA || {})

const skills = { ...(window.SKILLS_DATA || {}) }
if (window.CAREERS_SKILLS_DATA) skills.careers = window.CAREERS_SKILLS_DATA
if (window.CAREER_FUSIONS_DATA) {
  skills.fusion = { ...(skills.fusion || {}), ...window.CAREER_FUSIONS_DATA }
}
const racial = window.RACE_SKILL_TREES || {}
skills.racial = { ...racial }
if (skills.monster) {
  skills.racial.monster = skills.monster
  delete skills.monster
}
writeJson('skills', skills)

const itemsData = window.ITEMS_DATA || {}
for (const category of Object.values(itemsData)) {
  if (!category || typeof category !== 'object') continue
  for (const item of Object.values(category)) {
    if (!item?.price) continue
    item.shopMinLevel = shopMinLevelForItem(item)
  }
}
writeJson('items', itemsData)
writeJson('profession-items', window.PROFESSION_ITEMS_DATA || {})
writeJson('discoverable-items', window.DISCOVERABLE_ITEMS_DATA || {})
writeJson('monster-loot', window.MONSTER_LOOT_DATA || {})

function mergeMetaMaps(...maps) {
  const out = {}
  for (const map of maps) {
    for (const [key, value] of Object.entries(map || {})) {
      if (value && typeof value === 'object' && !Array.isArray(value) && out[key] && typeof out[key] === 'object' && !Array.isArray(out[key])) {
        out[key] = { ...out[key], ...value }
      } else {
        out[key] = value
      }
    }
  }
  return out
}

function loadMetaExports(file, names) {
  const raw = fs.readFileSync(path.join(dataDir, file), 'utf8').replace(/^\uFEFF/, '')
  const code = raw.replace(/^export const /gm, 'const ')
  const sandbox = {}
  vm.createContext(sandbox)
  const assigns = names.map(name => `globalThis.__meta_${name} = ${name}`).join('\n')
  vm.runInContext(`${code}\n${assigns}`, sandbox)
  return names.reduce((acc, name) => {
    acc[name] = sandbox[`__meta_${name}`]
    return acc
  }, {})
}

const metaResult = loadMetaExports('skill-meta.js', [
  'TOGGLE_BONUSES',
  'PASSIVE_SKILL_BONUSES',
  'PASSIVE_SKILL_EFFECTS',
  'EQUIPMENT_SKILL_EFFECTS',
  'TOGGLE_SKILL_EFFECTS',
  'INCOMPATIBILITIES'
])
const careerMeta = loadMetaExports('career-skill-meta.js', [
  'CAREER_PASSIVE_BONUSES',
  'CAREER_EQUIPMENT_EFFECTS',
  'CAREER_ARMOUR_EFFECTS',
  'CAREER_PASSIVE_EFFECTS',
  'CAREER_CONDITIONAL_STATS',
  'CAREER_DAMAGE_BONUSES',
  'CAREER_HEAL_BONUSES',
  'CAREER_ACTION_BUFFS',
  'CAREER_STAMINA_DISCOUNTS'
])

writeJson('skill-meta', {
  TOGGLE_BONUSES: metaResult.TOGGLE_BONUSES || {},
  PASSIVE_SKILL_BONUSES: mergeMetaMaps(metaResult.PASSIVE_SKILL_BONUSES, careerMeta.CAREER_PASSIVE_BONUSES),
  PASSIVE_SKILL_EFFECTS: mergeMetaMaps(metaResult.PASSIVE_SKILL_EFFECTS, careerMeta.CAREER_PASSIVE_EFFECTS),
  EQUIPMENT_SKILL_EFFECTS: mergeMetaMaps(metaResult.EQUIPMENT_SKILL_EFFECTS, careerMeta.CAREER_EQUIPMENT_EFFECTS),
  TOGGLE_SKILL_EFFECTS: metaResult.TOGGLE_SKILL_EFFECTS || {},
  INCOMPATIBILITIES: metaResult.INCOMPATIBILITIES || {},
  ARMOUR_SKILL_EFFECTS: careerMeta.CAREER_ARMOUR_EFFECTS || {},
  CONDITIONAL_SKILL_STATS: careerMeta.CAREER_CONDITIONAL_STATS || {},
  CAREER_DAMAGE_BONUSES: careerMeta.CAREER_DAMAGE_BONUSES || {},
  CAREER_HEAL_BONUSES: careerMeta.CAREER_HEAL_BONUSES || {},
  CAREER_ACTION_BUFFS: careerMeta.CAREER_ACTION_BUFFS || {},
  CAREER_STAMINA_DISCOUNTS: careerMeta.CAREER_STAMINA_DISCOUNTS || {}
})

console.log('Built JSON data')
writeJson('manifest', { version: Date.now() })
execSync('node scripts/build-premade-characters.mjs', { cwd: root, stdio: 'inherit' })
