import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')

const FILES = [
  'data/skills-data.js',
  'data/races-data.js',
  'data/profession-items-data.js',
  'data/discoverable-items-data.js',
  'data/json/skills.json',
  'data/json/profession-items.json',
  'data/json/discoverable-items.json'
]

function roundWord(n) {
  return Number(n) === 1 ? 'round' : 'rounds'
}

export function normalizeTimeUnits(text) {
  if (typeof text !== 'string' || !/\b(minute|minutes|hour|hours|second|seconds)\b/i.test(text)) {
    return text
  }

  let out = text

  out = out.replace(/\bevery \d+ seconds\b/gi, 'every round')

  out = out.replace(/\b(\d+)\s+minutes\b/gi, (_, n) => `${n} ${roundWord(n)}`)
  out = out.replace(/\b(\d+)\s+minute\b/gi, (_, n) => `${n} ${roundWord(n)}`)

  out = out.replace(/\b24\s+hours\b/gi, '1 day')
  out = out.replace(/\b(\d+)\s+hours\b/gi, (_, n) => {
    const count = Number(n)
    if (count >= 24) return `${Math.round(count / 24)} days`
    return `${count * 10} ${roundWord(count * 10)}`
  })
  out = out.replace(/\b(\d+)\s+hour\b/gi, (_, n) => {
    const count = Number(n)
    return `${count * 10} ${roundWord(count * 10)}`
  })

  return out
}

function walk(value) {
  if (typeof value === 'string') return normalizeTimeUnits(value)
  if (Array.isArray(value)) return value.map(walk)
  if (value && typeof value === 'object') {
    const out = {}
    for (const [key, child] of Object.entries(value)) out[key] = walk(child)
    return out
  }
  return value
}

function processFile(relativePath) {
  const filePath = path.join(root, relativePath)
  const raw = fs.readFileSync(filePath, 'utf8')

  if (relativePath.endsWith('.json')) {
    const data = JSON.parse(raw)
    const next = walk(data)
    fs.writeFileSync(filePath, `${JSON.stringify(next, null, 2)}\n`, 'utf8')
    return
  }

  const next = normalizeTimeUnits(raw)
  if (next !== raw) fs.writeFileSync(filePath, next, 'utf8')
}

let changed = 0
for (const file of FILES) {
  const before = fs.readFileSync(path.join(root, file), 'utf8')
  processFile(file)
  const after = fs.readFileSync(path.join(root, file), 'utf8')
  if (before !== after) {
    changed += 1
    console.log('Updated', file)
  }
}

console.log(`Normalized time units in ${changed} file(s).`)
