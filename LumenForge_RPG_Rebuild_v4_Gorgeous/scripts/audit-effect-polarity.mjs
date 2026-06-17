/**
 * Audit skills/items for effect links with wrong polarity (resistance → debuff, etc.)
 * Run: node scripts/audit-effect-polarity.mjs
 */
import fs from 'fs'
import path from 'path'
import vm from 'vm'
import { fileURLToPath } from 'url'

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const dataDir = path.join(root, 'data')
const jsonDir = path.join(dataDir, 'json')

const effects = JSON.parse(fs.readFileSync(path.join(jsonDir, 'effects.json'), 'utf8'))
const meta = JSON.parse(fs.readFileSync(path.join(jsonDir, 'skill-meta.json'), 'utf8'))

const NEGATIVE_TYPES = new Set(['control', 'statdebuff', 'damageovertime', 'vulnerability'])
const POSITIVE_TYPES = new Set(['protection', 'statbuff', 'healovertime', 'recovery', 'passive', 'utility', 'aura'])

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function effectPolarity(effect) {
  const type = String(effect?.type || '').toLowerCase()
  if (effect?.immunities?.length) return 'positive'
  if (/_resistance$|_immunity$|_warded$/.test(effect?.id || '')) return 'positive'
  if (/_weakness$/.test(effect?.id || '')) return 'negative'
  if (NEGATIVE_TYPES.has(type)) return 'negative'
  if (POSITIVE_TYPES.has(type)) return 'positive'
  const mods = effect?.statModifiers
  if (mods && typeof mods === 'object') {
    if (Object.values(mods).some(v => Number(v) < 0)) return 'negative'
    if (Object.values(mods).some(v => Number(v) > 0)) return 'positive'
  }
  return 'neutral'
}

function isEffectMentionedAsResistance(text, effect) {
  const hay = String(text || '').toLowerCase()
  const phrases = [effect.name.toLowerCase(), effect.id.toLowerCase().replace(/_/g, ' ')]
    .filter(p => p.length >= 4)
  for (const phrase of phrases) {
    const re = escapeRegExp(phrase)
    if (new RegExp(`(?:resistance|resistant)\\s+to\\s+[^.;]{0,80}\\b${re}\\b`, 'i').test(hay)) return true
    if (new RegExp(`(?:immune|immunity)\\s+to\\s+(?:magical\\s+|all\\s+|fear\\s+|status\\s+)?\\b${re}\\b`, 'i').test(hay)) return true
  }
  return false
}

function isEffectMentionedAsWeakness(text, effect) {
  const hay = String(text || '').toLowerCase()
  const phrases = [effect.name.toLowerCase(), effect.id.toLowerCase().replace(/_/g, ' ')]
    .filter(p => p.length >= 4)
  for (const phrase of phrases) {
    const re = escapeRegExp(phrase)
    if (new RegExp(`\\b${re}\\s+weakness`, 'i').test(hay)) return true
    if (new RegExp(`weakness\\s+to\\s+[^.;]{0,40}\\b${re}\\b`, 'i').test(hay)) return true
  }
  return false
}

function inferExpectedPolarity(desc, effectId) {
  const effect = effects[effectId]
  if (!effect) return null
  if (isEffectMentionedAsResistance(desc, effect)) return 'positive'
  if (isEffectMentionedAsWeakness(desc, effect)) return 'negative'
  if (/apply\s+/i.test(desc)) {
    const applyMatch = [...String(desc).matchAll(/apply\s+([a-z][a-z\s]+?)(?:\s*\(|\.|,|$)/gi)]
    for (const m of applyMatch) {
      const found = effects[effectId]
      const phrase = m[1].trim().toLowerCase()
      if (found && (found.name.toLowerCase() === phrase || found.id.replace(/_/g, ' ') === phrase)) {
        return 'negative'
      }
    }
  }
  return null
}

function loadWindow(file) {
  const code = fs.readFileSync(path.join(dataDir, file), 'utf8')
  const sandbox = { console, window: {}, globalThis: {} }
  sandbox.globalThis.window = sandbox.window
  vm.createContext(sandbox)
  vm.runInContext(code, sandbox)
  return sandbox.window
}

// Import recommend logic from sync by eval skill-meta + duplicated minimal recommend
const EQUIPMENT_SKILL_IDS = new Set(Object.keys(meta.EQUIPMENT_SKILL_EFFECTS || {}))
const PASSIVE_SKILL_EFFECTS = meta.PASSIVE_SKILL_EFFECTS || {}
const DAMAGE_TYPE_EFFECTS = new Set([
  'fire_damage', 'ice_damage', 'lightning_damage', 'earth_damage', 'wind_damage',
  'water_damage', 'darkness_damage', 'light_damage', 'holy_damage', 'undead_damage',
  'poison_damage', 'magic_damage', 'physical_damage'
])

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

function isLooseFlavorMention(haystack, effect) {
  if (effect.id === 'stealth' && /\+\d+\s+stealth\s+in|stealth\s+in\s+(?:dim|dark)/i.test(haystack)) return true
  return false
}

function extractFromDesc(desc, { excludeResistance = true } = {}) {
  const haystack = String(desc || '').toLowerCase()
  const found = []
  const sorted = Object.values(effects).sort((a, b) => b.name.length - a.name.length)
  for (const effect of sorted) {
    const idPhrase = effect.id.toLowerCase().replace(/_/g, ' ')
    const name = effect.name.toLowerCase()
    if (excludeResistance && isEffectMentionedAsResistance(haystack, effect)) continue
    if (isLooseFlavorMention(haystack, effect)) continue
    if (phraseMatchesEffect(haystack, idPhrase) || phraseMatchesEffect(haystack, name)) found.push(effect.id)
  }
  return found
}

function parseGrantEffects(desc) {
  const grant = String(desc || '').match(/GRANTS?:\s*([^.]+)/i)
  if (!grant) return []
  const found = []
  const parts = grant[1].split(/,\s*(?=(?:Fire|Ice|Lightning|Earth|Wind|Water|Darkness|Light)\s)/i)
  for (const part of parts) {
    const cleaned = part.replace(/\s*\d+%?\s*\([+-]?\d+\)/gi, '').trim()
    const resistance = cleaned.match(/^(\w+)\s+resistance/i)
    const weakness = cleaned.match(/^(\w+)\s+weakness/i)
    if (resistance) {
      const id = `${resistance[1].toLowerCase()}_resistance`
      if (effects[id]) found.push(id)
      continue
    }
    if (weakness) {
      const id = `${weakness[1].toLowerCase()}_weakness`
      if (effects[id]) found.push(id)
      continue
    }
    found.push(...extractFromDesc(cleaned))
  }
  return [...new Set(found)].filter(id => !DAMAGE_TYPE_EFFECTS.has(id))
}

function parseApplyEffects(desc) {
  const text = String(desc || '')
  const found = []
  for (const match of text.matchAll(/Apply\s+([A-Za-z][A-Za-z\s]+?)(?:\s*\(|\.|,|$)/gi)) {
    const effect = findEffectByPhrase(match[1].trim())
    if (effect) found.push(effect.id)
  }
  return [...new Set(found)]
}

function parsePassiveEffectRefs(desc) {
  const applyEffects = parseApplyEffects(desc)
  if (applyEffects.length) return applyEffects
  const text = String(desc || '')
  if (/enhanced regeneration/i.test(text) && effects.rapid_regeneration) return ['rapid_regeneration']
  if (/regeneration status|apply regeneration/i.test(text) && effects.regeneration) return ['regeneration']
  return []
}

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

function recommendSkillSpecialEffects(skill) {
  if (EQUIPMENT_SKILL_IDS.has(skill.id)) return []
  if (isToggleSkill(skill)) return []
  if (isAttackSkill(skill) && !isPassiveSkill(skill)) return []

  const mapped = PASSIVE_SKILL_EFFECTS[skill.id]
  if (mapped?.length) return mapped.filter(id => effects[id])

  const grantEffects = parseGrantEffects(skill.desc)
  if (grantEffects.length) return grantEffects

  if (effects[skill.id] && (isPassiveSkill(skill) || Number(skill.staminaCost || 0) === 0)) {
    return [skill.id]
  }

  if (isPassiveSkill(skill)) {
    return parsePassiveEffectRefs(skill.desc).filter(id => !DAMAGE_TYPE_EFFECTS.has(id))
  }

  return []
}

function recommendItemSpecialEffects(item) {
  const fromGrants = parseGrantEffects(item.desc)
  const fromPassive = []
  if (/channeled spell|concentration/i.test(item.desc || '')) {
    if (effects.concentration) fromPassive.push('concentration')
  }
  if (item.id === 'hunter_focus_charm' && effects.concentration) fromPassive.push('concentration')
  return [...new Set([...fromGrants, ...fromPassive])]
}

function walkSkills(tree, fn) {
  for (const value of Object.values(tree || {})) {
    if (Array.isArray(value)) value.forEach(fn)
    else if (value && typeof value === 'object') walkSkills(value, fn)
  }
}

function walkItems(tree, fn) {
  for (const value of Object.values(tree || {})) {
    if (value?.id && value?.name) fn(value)
    else if (value && typeof value === 'object') walkItems(value, fn)
  }
}

function auditEntity(entity, kind, recommend) {
  const issues = []
  const desc = entity.desc || ''
  const stored = Array.isArray(entity.specialEffects) ? entity.specialEffects.filter(id => effects[id]) : []
  const recommended = recommend(entity)

  for (const effectId of stored) {
    const effect = effects[effectId]
    const actual = effectPolarity(effect)
    const expected = inferExpectedPolarity(desc, effectId)
    if (expected === 'positive' && actual === 'negative') {
      issues.push({
        severity: 'polarity',
        effectId,
        message: `Links debuff "${effect.name}" but description implies resistance/immunity`
      })
    }
    if (expected === 'negative' && actual === 'positive' && !/_weakness$/.test(effectId)) {
      issues.push({
        severity: 'polarity',
        effectId,
        message: `Links buff "${effect.name}" but description implies weakness`
      })
    }
    if (isPassiveSkill(entity) && actual === 'negative' && !parseApplyEffects(desc).includes(effectId)) {
      issues.push({
        severity: 'passive_debuff',
        effectId,
        message: `Passive links debuff "${effect.name}" without Apply clause`
      })
    }
  }

  const storedSet = new Set(stored)
  const recSet = new Set(recommended)
  for (const id of recommended) {
    if (!storedSet.has(id)) {
      issues.push({ severity: 'stale_data', effectId: id, message: 'Recommended but not stored in specialEffects' })
    }
  }
  for (const id of stored) {
    if (!recSet.has(id)) {
      issues.push({ severity: 'stale_data', effectId: id, message: 'Stored but not recommended by current rules' })
    }
  }

  return { id: entity.id, name: entity.name, kind, desc, stored, recommended, issues }
}

const skillsData = loadWindow('skills-data.js').SKILLS_DATA
const raceSkillTrees = loadWindow('races-data.js').RACE_SKILL_TREES || {}
const itemsData = loadWindow('items-data.js').ITEMS_DATA
const profData = loadWindow('profession-items-data.js').PROFESSION_ITEMS_DATA
const discData = JSON.parse(fs.readFileSync(path.join(jsonDir, 'discoverable-items.json'), 'utf8'))

const results = []
walkSkills(skillsData, skill => results.push(auditEntity(skill, 'skill', recommendSkillSpecialEffects)))
walkSkills(raceSkillTrees, skill => results.push(auditEntity(skill, 'racial_skill', recommendSkillSpecialEffects)))
walkItems(itemsData, item => results.push(auditEntity(item, 'item', recommendItemSpecialEffects)))
walkItems(profData, item => results.push(auditEntity(item, 'profession_item', recommendItemSpecialEffects)))
walkItems(discData, item => results.push(auditEntity(item, 'discoverable_item', recommendItemSpecialEffects)))

const withIssues = results.filter(r => r.issues.length)
const polarity = withIssues.filter(r => r.issues.some(i => i.severity === 'polarity' || i.severity === 'passive_debuff'))
const stale = withIssues.filter(r => r.issues.every(i => i.severity === 'stale_data'))

console.log('Audited entities:', results.length)
console.log('With issues:', withIssues.length)
console.log('Polarity / passive-debuff issues:', polarity.length)
console.log('Stale specialEffects only:', stale.length)

console.log('\n=== POLARITY / PASSIVE DEBUFF ISSUES ===')
for (const row of polarity) {
  console.log(`\n[${row.kind}] ${row.id} (${row.name})`)
  console.log(' ', row.desc?.slice(0, 120))
  console.log('  stored:', row.stored.join(', ') || '(none)')
  console.log('  recommended:', row.recommended.join(', ') || '(none)')
  for (const issue of row.issues.filter(i => i.severity !== 'stale_data')) {
    console.log('  !', issue.message)
  }
}

console.log('\n=== STALE specialEffects (stored != recommended) ===')
for (const row of stale.slice(0, 40)) {
  console.log(`${row.id}: [${row.stored.join(',')}] -> [${row.recommended.join(',')}]`)
}
if (stale.length > 40) console.log(`... and ${stale.length - 40} more`)

const clean = results.filter(r => !r.issues.length && r.stored.length).length
console.log('\nClean linked entities:', clean)
