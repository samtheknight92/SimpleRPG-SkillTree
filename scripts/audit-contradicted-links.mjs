/**
 * Find effect links contradicted by description text (remove X -> X, etc.)
 */
import fs from 'fs'
import vm from 'vm'
import path from 'path'
import { fileURLToPath } from 'url'

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const effects = JSON.parse(fs.readFileSync(path.join(root, 'data/json/effects.json'), 'utf8'))

function escapeRegExp(s) {
  return String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function isNegatedMention(desc, effect) {
  const hay = String(desc || '').toLowerCase()
  const phrases = [effect.name.toLowerCase(), effect.id.replace(/_/g, ' ')]
    .filter(p => p.length >= 4)
  for (const phrase of phrases) {
    const re = escapeRegExp(phrase)
    if (new RegExp(`(?:remove|removes|cleanses?|cures?)\\s+(?:the\\s+)?${re}\\b`, 'i').test(hay)) return true
    if (new RegExp(`(?:immune|immunity|resistance|resistant)\\s+to\\s+[^.;]{0,60}\\b${re}\\b`, 'i').test(hay)) return true
    if (new RegExp(`\\b${re}\\s+immunity\\b`, 'i').test(hay)) return true
  }
  return false
}

function isResistanceContext(desc, effect) {
  const hay = String(desc || '').toLowerCase()
  const phrases = [effect.name.toLowerCase(), effect.id.replace(/_/g, ' ')]
    .filter(p => p.length >= 4)
  for (const phrase of phrases) {
    const re = escapeRegExp(phrase)
    if (new RegExp(`(?:immune|immunity|resistance|resistant)\\s+to\\s+[^.;]{0,80}\\b${re}\\b`, 'i').test(hay)) return true
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

function walkSkills(t, fn) {
  for (const v of Object.values(t || {})) {
    if (Array.isArray(v)) v.forEach(fn)
    else if (v && typeof v === 'object') walkSkills(v, fn)
  }
}

function walkItems(t, fn) {
  for (const v of Object.values(t || {})) {
    if (v?.id && v?.name) fn(v)
    else if (v && typeof v === 'object') walkItems(v, fn)
  }
}

const NEG_TYPES = new Set(['control', 'statdebuff', 'damageovertime', 'vulnerability'])

function isDebuff(effect) {
  if (/_weakness$/.test(effect.id)) return true
  return NEG_TYPES.has(String(effect.type || '').toLowerCase())
}

const issues = []

function check(entity, kind) {
  const desc = entity.desc || ''
  for (const id of entity.specialEffects || []) {
    const e = effects[id]
    if (!e) continue
    if (isNegatedMention(desc, e) && isDebuff(e)) {
      issues.push({
        kind, id: entity.id, name: entity.name, effectId: id, effect: e.name,
        msg: 'Links debuff but description negates/removes it',
        desc: desc.slice(0, 120)
      })
    }
    if (isResistanceContext(desc, e) && isDebuff(e)) {
      issues.push({
        kind, id: entity.id, name: entity.name, effectId: id, effect: e.name,
        msg: 'Links debuff but description grants resistance/immunity',
        desc: desc.slice(0, 120)
      })
    }
  }
}

walkSkills(load('skills-data.js', 'SKILLS_DATA'), s => check(s, 'skill'))
walkSkills(load('races-data.js', 'RACE_SKILL_TREES'), s => check(s, 'racial'))
walkItems(load('items-data.js', 'ITEMS_DATA'), i => check(i, 'item'))
walkItems(load('profession-items-data.js', 'PROFESSION_ITEMS_DATA'), i => check(i, 'prof'))
walkItems(JSON.parse(fs.readFileSync(path.join(root, 'data/json/discoverable-items.json'), 'utf8')), i => check(i, 'disc'))

console.log('Contradicted links:', issues.length)
for (const x of issues) {
  console.log(`\n[${x.kind}] ${x.id} -> ${x.effectId} (${x.effect})`)
  console.log(' ', x.msg)
  console.log(' ', x.desc)
}
