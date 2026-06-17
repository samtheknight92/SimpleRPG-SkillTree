import fs from 'fs'
import vm from 'vm'
import path from 'path'
import { fileURLToPath } from 'url'

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const effects = JSON.parse(fs.readFileSync(path.join(root, 'data/json/effects.json'), 'utf8'))

const NEG = new Set(['control', 'statdebuff', 'damageovertime', 'vulnerability'])

function polarity(e) {
  if (!e) return 'neutral'
  if (/_resistance$|_immunity$|_warded$/.test(e.id)) return 'positive'
  if (/_weakness$/.test(e.id)) return 'negative'
  if (NEG.has(e.type)) return 'negative'
  if (['protection', 'statbuff', 'healovertime', 'recovery', 'passive', 'utility', 'aura'].includes(e.type)) return 'positive'
  return 'neutral'
}

function escapeRegExp(s) {
  return String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function isRes(text, effect) {
  const hay = String(text).toLowerCase()
  for (const phrase of [effect.name.toLowerCase(), effect.id.replace(/_/g, ' ')]) {
    if (phrase.length < 4) continue
    const re = escapeRegExp(phrase)
    if (new RegExp(`(?:resistance|resistant)\\s+to\\s+[^.;]{0,80}\\b${re}\\b`, 'i').test(hay)) return true
    if (new RegExp(`(?:immune|immunity)\\s+to\\s+(?:magical\\s+|all\\s+|fear\\s+)?\\b${re}\\b`, 'i').test(hay)) return true
    if (new RegExp(`immune to [^.;]{0,40}\\b${re}\\b`, 'i').test(hay)) return true
    if (new RegExp(`cannot be (?:charmed|frightened|possessed)[^.;]*`, 'i').test(hay) && /charm|fear|mind/.test(phrase)) return true
  }
  return false
}

function load(file, varName) {
  const code = fs.readFileSync(path.join(root, 'data', file), 'utf8')
  const sandbox = { console, window: {}, globalThis: {} }
  sandbox.globalThis.window = sandbox.window
  vm.createContext(sandbox)
  vm.runInContext(code, sandbox)
  return sandbox.window[varName]
}

function walkSkills(tree, fn) {
  for (const v of Object.values(tree || {})) {
    if (Array.isArray(v)) v.forEach(fn)
    else if (v && typeof v === 'object') walkSkills(v, fn)
  }
}

function walkItems(tree, fn) {
  for (const v of Object.values(tree || {})) {
    if (v?.id && v?.name) fn(v)
    else if (v && typeof v === 'object') walkItems(v, fn)
  }
}

const issues = []

function check(entity, kind) {
  const desc = entity.desc || ''
  for (const id of entity.specialEffects || []) {
    const e = effects[id]
    if (!e) {
      issues.push({ kind, id: entity.id, name: entity.name, effectId: id, msg: 'unknown effect' })
      continue
    }
    if (isRes(desc, e) && polarity(e) === 'negative') {
      issues.push({
        kind, id: entity.id, name: entity.name, effectId: id, effect: e.name,
        msg: 'INVERTED: resistance/immunity text linked to debuff',
        desc: desc.slice(0, 100)
      })
    }
  }
}

walkSkills(load('skills-data.js', 'SKILLS_DATA'), s => check(s, 'skill'))
walkSkills(load('races-data.js', 'RACE_SKILL_TREES'), s => check(s, 'racial'))
walkItems(load('items-data.js', 'ITEMS_DATA'), i => check(i, 'item'))
walkItems(load('profession-items-data.js', 'PROFESSION_ITEMS_DATA'), i => check(i, 'prof'))
walkItems(JSON.parse(fs.readFileSync(path.join(root, 'data/json/discoverable-items.json'), 'utf8')), i => check(i, 'disc'))

console.log('INVERTED issues:', issues.length)
for (const x of issues) console.log(x)
