import { readFileSync } from 'fs'

const effects = JSON.parse(readFileSync('./data/json/effects.json', 'utf8'))
const skills = JSON.parse(readFileSync('./data/json/skills.json', 'utf8'))

function normalizeEffectId(v) {
  return String(v || '').trim()
    .replace(/([a-z])([A-Z])/g, '$1_$2')
    .replace(/[\s-]+/g, '_')
    .replace(/[^a-zA-Z0-9_]/g, '')
    .toLowerCase()
}

function escapeRegExp(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function extractOld(text) {
  const haystack = String(text || '').toLowerCase()
  const found = new Set()
  for (const effect of Object.values(effects)) {
    const id = effect.id.toLowerCase()
    const name = effect.name.toLowerCase()
    if (haystack.includes(id.replace(/_/g, ' ')) || haystack.includes(name)) found.add(effect.id)
  }
  for (const token of haystack.split(/[^a-z0-9_]+/)) {
    const id = normalizeEffectId(token)
    if (id && effects[id]) found.add(id)
  }
  return [...found]
}

function extractImproved(text) {
  const haystack = String(text || '').toLowerCase()
  const found = new Set()
  const sorted = Object.values(effects).sort((a, b) => b.name.length - a.name.length)
  for (const effect of sorted) {
    const id = effect.id.toLowerCase()
    const idPhrase = id.replace(/_/g, ' ')
    const name = effect.name.toLowerCase()
    for (const phrase of [idPhrase, name]) {
      if (phrase.length < 3) continue
      const re = new RegExp(`(?:^|[^a-z0-9_])${escapeRegExp(phrase)}(?:[^a-z0-9_]|$)`)
      if (re.test(haystack)) {
        found.add(effect.id)
        break
      }
    }
  }
  return [...found]
}

function resolveSkillEffects(skill) {
  const ids = new Set()
  if (effects[skill.id]) ids.add(skill.id)
  if (skill.specialEffects?.length) {
    for (const raw of skill.specialEffects) {
      const id = normalizeEffectId(raw)
      if (effects[id]) ids.add(id)
    }
  }
  if (ids.size) return [...ids]

  const byName = Object.values(effects).find(e => e.name.toLowerCase() === String(skill.name || '').toLowerCase())
  if (byName) return [byName.id]

  const desc = String(skill.desc || '')
  const applyMatch = desc.match(/Apply\s+([A-Za-z][A-Za-z\s]+?)(?:\s*\(|\.|,|$)/i)
  if (applyMatch) {
    const phrase = applyMatch[1].trim().toLowerCase()
    const effect = Object.values(effects).find(e =>
      e.name.toLowerCase() === phrase || e.id.replace(/_/g, ' ') === phrase
    )
    if (effect) return [effect.id]
  }

  const fromText = extractImproved(`${skill.name} ${desc}`)
  if (fromText.length === 1) return fromText
  if (fromText.length > 1) {
    const skillPhrase = String(skill.name || '').toLowerCase()
    const named = fromText.filter(id => {
      const e = effects[id]
      return e.name.toLowerCase() === skillPhrase || id.replace(/_/g, ' ') === skillPhrase
    })
    if (named.length) return named
  }
  return fromText.slice(0, 1)
}

const allSkills = []
for (const cat of Object.values(skills)) {
  for (const list of Object.values(cat)) {
    if (!Array.isArray(list)) continue
    for (const s of list) allSkills.push(s)
  }
}

let oldMulti = 0
let impMulti = 0
let resolvedMulti = 0
const samples = []

for (const s of allSkills) {
  const text = `${s.name} ${s.desc || ''}`
  const old = extractOld(text)
  const imp = extractImproved(text)
  const resolved = resolveSkillEffects(s)
  if (old.length > 1) oldMulti++
  if (imp.length > 1) impMulti++
  if (resolved.length > 1) resolvedMulti++
  if (old.length > 1 || resolved.length > 1) {
    samples.push({ id: s.id, old, resolved, desc: s.desc })
  }
}

console.log('total skills', allSkills.length)
console.log('old multi:', oldMulti, 'improved multi:', impMulti, 'resolved multi:', resolvedMulti)
console.log('\nShadow step:', resolveSkillEffects(allSkills.find(s => s.id === 'shadow_step')))
console.log('\nSamples where old had multi:')
samples.filter(s => s.old.length > 1).slice(0, 25).forEach(s => {
  console.log(s.id, '| old:', s.old.join(', '), '| resolved:', s.resolved.join(', '))
})

const zero = allSkills.filter(s => resolveSkillEffects(s).length === 0)
console.log('\nzero resolved:', zero.length)
console.log('examples:', zero.slice(0, 15).map(s => s.id).join(', '))
