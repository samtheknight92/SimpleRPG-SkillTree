/**
 * Computes recommended specialEffects + optional description fixes for every skill.
 * Run: node scripts/sync-skill-effects.mjs [--write]
 */
import fs from 'fs'
import path from 'path'
import vm from 'vm'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')
const effects = JSON.parse(fs.readFileSync(path.join(root, 'data/json/effects.json'), 'utf8'))
const skillsPath = path.join(root, 'data/skills-data.js')
const skillsJsonPath = path.join(root, 'data/json/skills.json')

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function phraseMatchesEffect(haystack, phrase) {
  if (!phrase || phrase.length < 3) return false
  const re = new RegExp(`(?:^|[^a-z0-9_])${escapeRegExp(phrase)}(?:[^a-z0-9_]|$)`)
  return re.test(haystack)
}

function findEffectByPhrase(phrase) {
  const normalized = String(phrase || '').trim().toLowerCase()
  if (!normalized) return null
  return Object.values(effects).find(effect =>
    effect.name.toLowerCase() === normalized || effect.id.replace(/_/g, ' ') === normalized
  ) || null
}

function extractFromDesc(desc) {
  const haystack = String(desc || '').toLowerCase()
  const found = []
  const sorted = Object.values(effects).sort((a, b) => b.name.length - a.name.length)
  for (const effect of sorted) {
    const idPhrase = effect.id.toLowerCase().replace(/_/g, ' ')
    const name = effect.name.toLowerCase()
    if (phraseMatchesEffect(haystack, idPhrase) || phraseMatchesEffect(haystack, name)) {
      found.push(effect.id)
    }
  }
  return found
}

function parseApplyEffects(desc) {
  const text = String(desc || '')
  const found = []
  const patterns = [
    /Apply\s+([A-Za-z][A-Za-z\s]+?)(?:\s*\(|\.|,|$)/gi,
    /apply\s+both\s+([A-Za-z][A-Za-z\s]+?)\s+and\s+([A-Za-z][A-Za-z\s]+?)(?:\s*\(|\.|,|$)/gi,
    /(?:chance to|may)\s+apply\s+([A-Za-z][A-Za-z\s]+?)(?:\s*\(|\.|,|$)/gi,
    /(?:chance to|may)\s+apply\s+both\s+([A-Za-z][A-Za-z\s]+?)\s+and\s+([A-Za-z][A-Za-z\s]+?)(?:\s*\(|\.|,|$)/gi
  ]
  for (const pattern of patterns) {
    for (const match of text.matchAll(pattern)) {
      for (let i = 1; i < match.length; i++) {
        if (!match[i]) continue
        const effect = findEffectByPhrase(match[i].trim())
        if (effect) found.push(effect.id)
      }
    }
  }
  return [...new Set(found)]
}

const EQUIPMENT_SKILL_IDS = new Set([
  'sword_basics', 'sword_stance', 'ranged_basics', 'axe_basics',
  'dagger_basics', 'polearm_basics', 'hammer_basics'
])

const DAMAGE_TYPE_EFFECTS = new Set([
  'fire_damage', 'ice_damage', 'lightning_damage', 'earth_damage', 'wind_damage',
  'water_damage', 'darkness_damage', 'light_damage', 'holy_damage', 'undead_damage',
  'poison_damage', 'magic_damage', 'physical_damage'
])

function isPassiveSkill(skill) {
  return /^passive:/i.test(skill?.desc || '')
}

function isAttackSkill(skill) {
  const desc = String(skill?.desc || '')
  return /^action:/i.test(desc) || /^spell:/i.test(desc)
}

function isToggleSkill(skill) {
  return /\bToggle\s*:/i.test(skill?.desc || '')
}

function parseGrantEffects(desc) {
  const grant = String(desc || '').match(/GRANTS?:\s*([^.]+)/i)
  if (!grant) return []
  return extractFromDesc(grant[1]).filter(id => !DAMAGE_TYPE_EFFECTS.has(id))
}

function fixSkillDescription(skill) {
  let desc = String(skill.desc || '').replace(/\s*Linked effects: [^.]+\./g, '')

  desc = desc
    .replace(/\+(\d+)\s+attack bonus/gi, '+$1 Accuracy')
    .replace(/\battack bonus\b/gi, 'Accuracy bonus')

  if (!/\bAC\b/.test(desc)) return desc

  if (/while wielding|while holding|when wielding/i.test(desc)) {
    return desc.replace(/\+(\d+)\s+AC\b/g, '+$1 Physical Defence')
  }
  if (/^Toggle:/i.test(desc)) {
    return desc.replace(/\+(\d+)\s+AC\b/g, '+$1 Physical Defence and +$1 Magical Defence')
  }
  if (/ignore[s]?\s+\d+\s+AC/i.test(desc)) {
    return desc.replace(/ignore[s]?\s+(\d+)\s+AC/gi, 'ignores $1 Physical Defence')
  }
  if (/target'?s AC|enemy AC|Reduce.*AC by|reduce.*AC by/i.test(desc)) {
    return desc
      .replace(/target'?s AC/gi, "target's Physical Defence")
      .replace(/enemy AC/gi, 'enemy Physical Defence')
      .replace(/Reduce target's AC by/gi, "Reduce target's Physical Defence by")
      .replace(/reduce enemy AC by/gi, 'reduce enemy Physical Defence by')
  }

  return desc
    .replace(/\+(\d+)\s+AC\b/g, '+$1 Physical Defence and +$1 Magical Defence')
    .replace(/-\s*(\d+)\s+AC\b/g, '-$1 Physical Defence and -$1 Magical Defence')
    .replace(/(\d+)\s+AC\b/g, '$1 Physical Defence')
}

export function recommendSkillEffects(skill) {
  const desc = String(skill.desc || '')

  if (EQUIPMENT_SKILL_IDS.has(skill.id)) return []
  if (isToggleSkill(skill)) return []
  if (isAttackSkill(skill) && !isPassiveSkill(skill)) return []

  const grantEffects = parseGrantEffects(desc)
  if (grantEffects.length) return grantEffects

  if (effects[skill.id] && (isPassiveSkill(skill) || Number(skill.staminaCost || 0) === 0)) {
    return [skill.id]
  }

  if (isPassiveSkill(skill)) {
    const applyEffects = parseApplyEffects(desc).filter(id => !DAMAGE_TYPE_EFFECTS.has(id))
    if (applyEffects.length) return applyEffects
  }

  return []
}

function loadSkillsData() {
  const code = fs.readFileSync(skillsPath, 'utf8')
  const sandbox = { window: {}, console }
  vm.createContext(sandbox)
  vm.runInContext(code, sandbox)
  return sandbox.window.SKILLS_DATA
}

function walkSkills(tree, fn) {
  for (const subcats of Object.values(tree)) {
    for (const list of Object.values(subcats)) {
      if (!Array.isArray(list)) continue
      list.forEach(skill => fn(skill))
    }
  }
}

const skillsData = loadSkillsData()
const report = []
let descUpdates = 0
let effectAssignments = 0

walkSkills(skillsData, skill => {
  const recommended = recommendSkillEffects(skill)
  skill.specialEffects = recommended
  if (recommended.length) effectAssignments++

  const nextDesc = fixSkillDescription(skill)
  if (nextDesc !== skill.desc) {
    skill.desc = nextDesc
    descUpdates++
  }

  report.push({
    id: skill.id,
    tier: skill.tier,
    recommended,
    desc: skill.desc
  })
})

console.log(`Processed ${report.length} skills`)
console.log(`With linked effects: ${effectAssignments}, no linked effect: ${report.length - effectAssignments}`)
console.log(`Descriptions fixed: ${descUpdates}`)

const checks = [
  'piercing_thrust',
  'fire_spark',
  'sword_basics',
  'sword_stance',
  'shadow_step',
  'fear',
  'crushing_blow',
  'thunder_strike',
  'invisibility',
  'monster_flight',
  'earthquake_slam',
  'shadowflame',
  'hellfire',
  'dark_frost',
  'phoenix_form',
  'immunity_poison'
]
console.log('\nKey skill checks:')
for (const id of checks) {
  const row = report.find(r => r.id === id)
  if (row) console.log(`  ${id} -> ${row.recommended.join(', ') || '(none)'}`)
}

const write = process.argv.includes('--write')
if (write) {
  const source = fs.readFileSync(skillsPath, 'utf8')
  const headerEnd = source.indexOf('const SKILLS_DATA = {')
  const header = source.slice(0, headerEnd)
  const body = `const SKILLS_DATA = ${JSON.stringify(skillsData, null, 2)};\n\nwindow.SKILLS_DATA = SKILLS_DATA;\n`
  fs.writeFileSync(skillsPath, header + body, 'utf8')
  fs.writeFileSync(skillsJsonPath, JSON.stringify(skillsData, null, 2), 'utf8')
  console.log('\nWrote skills-data.js and skills.json')
} else {
  console.log('\nDry run. Pass --write to update skill data files.')
}
