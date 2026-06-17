import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')

function readJson(name) {
  return JSON.parse(fs.readFileSync(path.join(root, 'data/json', name), 'utf8'))
}

const effects = readJson('effects.json')
const skills = readJson('skills.json')
const items = readJson('items.json')
const prof = readJson('profession-items.json')
const disc = readJson('discoverable-items.json')
const meta = readJson('skill-meta.json')

const keep = new Set()

function findEffect(phrase) {
  const n = String(phrase || '').trim().toLowerCase()
  if (!n) return null
  return Object.values(effects).find(e =>
    e.name.toLowerCase() === n || e.id.replace(/_/g, ' ') === n
  )?.id || null
}

function collectSpecial(obj) {
  if (!obj) return
  if (Array.isArray(obj)) obj.forEach(collectSpecial)
  else if (typeof obj === 'object') {
    if (Array.isArray(obj.specialEffects)) obj.specialEffects.forEach(id => keep.add(id))
    Object.values(obj).forEach(collectSpecial)
  }
}

collectSpecial(skills)
collectSpecial(items)
collectSpecial(prof)
collectSpecial(disc)
for (const rule of Object.values(meta.EQUIPMENT_SKILL_EFFECTS || {})) {
  if (rule.effectId) keep.add(rule.effectId)
}
for (const effectId of Object.values(meta.TOGGLE_SKILL_EFFECTS || {})) keep.add(effectId)

function walkSkills(tree) {
  for (const value of Object.values(tree || {})) {
    if (Array.isArray(value)) {
      for (const skill of value) {
        if (/^passive:/i.test(skill.desc || '') && effects[skill.id]) keep.add(skill.id)
        const desc = String(skill.desc || '')
        for (const match of desc.matchAll(/(?:Apply|apply|chance to apply|may apply)\s+([A-Za-z][A-Za-z\s]+?)(?:\s*\(|\.|,|$)/gi)) {
          const id = findEffect(match[1])
          if (id) keep.add(id)
        }
        for (const match of desc.matchAll(/GRANTS?:\s*([^.]+)/gi)) {
          for (const part of match[1].split(/,|and/)) {
            const id = findEffect(part)
            if (id) keep.add(id)
          }
        }
      }
    } else if (value && typeof value === 'object') walkSkills(value)
  }
}

walkSkills(skills)

const all = Object.keys(effects)
const removable = all.filter(id => !keep.has(id))

console.log('Total effects:', all.length)
console.log('Kept:', keep.size)
console.log('Removable:', removable.length)
console.log('\nRemovable by type:')
const byType = {}
for (const id of removable) {
  const type = effects[id].type
  ;(byType[type] ||= []).push(id)
}
for (const [type, ids] of Object.entries(byType).sort((a, b) => b[1].length - a[1].length)) {
  console.log(`  ${type} (${ids.length}): ${ids.join(', ')}`)
}

const specialType = Object.values(effects).filter(e => e.type === 'special').map(e => e.id)
const fromSpecial = new Set()
function collectSpecialOnly(obj) {
  if (!obj) return
  if (Array.isArray(obj)) obj.forEach(collectSpecialOnly)
  else if (typeof obj === 'object') {
    if (Array.isArray(obj.specialEffects)) obj.specialEffects.forEach(id => fromSpecial.add(id))
    Object.values(obj).forEach(collectSpecialOnly)
  }
}
collectSpecialOnly(skills)
collectSpecialOnly(items)
collectSpecialOnly(prof)
const orphanSpecial = specialType.filter(id => !fromSpecial.has(id) && !keep.has(id))
const keptSpecialNotInData = specialType.filter(id => keep.has(id) && !fromSpecial.has(id))
console.log('\nSpecial-type not in any specialEffects:', specialType.filter(id => !fromSpecial.has(id)).length)
console.log('Kept via desc/GRANTS only:', keptSpecialNotInData.slice(0, 20).join(', '), keptSpecialNotInData.length > 20 ? '...' : '')

const notInSpecialEffects = all.filter(id => !fromSpecial.has(id))
console.log('\nNot in specialEffects arrays:', notInSpecialEffects.length)
console.log(notInSpecialEffects.join(', '))

