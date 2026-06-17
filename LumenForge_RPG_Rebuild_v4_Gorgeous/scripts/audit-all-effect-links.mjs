/**
 * Full audit: skills/items missing or incorrect effect links.
 * Run: node scripts/audit-all-effect-links.mjs
 */
import fs from 'fs'
import vm from 'vm'
import path from 'path'
import { fileURLToPath } from 'url'

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const dataDir = path.join(root, 'data')
const effects = JSON.parse(fs.readFileSync(path.join(dataDir, 'json/effects.json'), 'utf8'))
const meta = JSON.parse(fs.readFileSync(path.join(dataDir, 'json/skill-meta.json'), 'utf8'))

const EQUIPMENT_SKILL_IDS = new Set(Object.keys(meta.EQUIPMENT_SKILL_EFFECTS || {}))
const PASSIVE_SKILL_EFFECTS = meta.PASSIVE_SKILL_EFFECTS || {}
const DAMAGE_TYPE_EFFECTS = new Set([
  'fire_damage', 'ice_damage', 'lightning_damage', 'earth_damage', 'wind_damage',
  'water_damage', 'darkness_damage', 'light_damage', 'holy_damage', 'undead_damage',
  'poison_damage', 'magic_damage', 'physical_damage'
])

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

function isEffectMentionedAsResistance(text, effect) {
  const hay = String(text || '').toLowerCase()
  const phrases = [effect.name.toLowerCase(), effect.id.toLowerCase().replace(/_/g, ' ')]
    .filter(phrase => phrase.length >= 4)
  for (const phrase of phrases) {
    const re = escapeRegExp(phrase)
    if (new RegExp(`(?:resistance|resistant)\\s+to\\s+[^.;]{0,80}\\b${re}\\b`, 'i').test(hay)) return true
    if (new RegExp(`(?:immune|immunity)\\s+to\\s+(?:magical\\s+|all\\s+|fear\\s+|status\\s+)?\\b${re}\\b`, 'i').test(hay)) return true
    if (new RegExp(`\\b${re}\\s+immunity\\b`, 'i').test(hay)) return true
    if (/charm|mind|fear|possess/.test(phrase) && /cannot be (?:charmed|frightened|possessed)/i.test(hay)) return true
  }
  return false
}

function isEffectNegatedInText(text, effect) {
  const hay = String(text || '').toLowerCase()
  const phrases = [effect.name.toLowerCase(), effect.id.toLowerCase().replace(/_/g, ' ')]
    .filter(phrase => phrase.length >= 4)
  for (const phrase of phrases) {
    const re = escapeRegExp(phrase)
    if (new RegExp(`(?:remove|removes|cleanses?|cures?)\\s+(?:the\\s+|all\\s+)?${re}\\b`, 'i').test(hay)) return true
    if (new RegExp(`(?:remove|removes)\\s+[^.;]{0,30}\\b${re}\\b`, 'i').test(hay)) return true
  }
  return false
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
    if (isEffectNegatedInText(haystack, effect)) continue
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
    const byPhrase = findEffectByPhrase(cleaned)
    if (byPhrase) {
      found.push(byPhrase.id)
      continue
    }
    found.push(...extractFromDesc(cleaned))
  }
  return [...new Set(found)].filter(id => !DAMAGE_TYPE_EFFECTS.has(id))
}

function parseApplyEffects(desc) {
  const text = String(desc || '')
  const found = []
  const patterns = [
    /Apply\s+([A-Za-z][A-Za-z\s]+?)(?:\s*\(|\.|,|$)/gi,
    /apply\s+both\s+([A-Za-z][A-Za-z\s]+?)\s+and\s+([A-Za-z][A-Za-z\s]+?)(?:\s*\(|\.|,|$)/gi
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
  const linked = new Set([...fromGrants, ...fromPassive])
  for (const id of item.specialEffects || []) {
    if (!effects[id]) continue
    if (isEffectNegatedInText(item.desc, effects[id])) continue
    linked.add(id)
  }
  return [...linked]
}

function loadWindow(file) {
  const code = fs.readFileSync(path.join(dataDir, file), 'utf8')
  const sandbox = { console, window: {}, globalThis: {} }
  sandbox.globalThis.window = sandbox.window
  vm.createContext(sandbox)
  vm.runInContext(code, sandbox)
  return sandbox.window
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

const skillsData = loadWindow('skills-data.js').SKILLS_DATA
const raceSkillTrees = loadWindow('races-data.js').RACE_SKILL_TREES || {}
const itemsData = loadWindow('items-data.js').ITEMS_DATA
const profData = loadWindow('profession-items-data.js').PROFESSION_ITEMS_DATA
const discData = JSON.parse(fs.readFileSync(path.join(dataDir, 'json/discoverable-items.json'), 'utf8'))

const missingPassives = []
const actionWithStored = []
const storedMismatch = []
const unmappedPassives = []

function setsEqual(a, b) {
  const sa = new Set(a)
  const sb = new Set(b)
  if (sa.size !== sb.size) return false
  for (const x of sa) if (!sb.has(x)) return false
  return true
}

function auditSkill(skill, kind) {
  const stored = (skill.specialEffects || []).filter(id => effects[id])
  const recommended = recommendSkillSpecialEffects(skill)
  const desc = skill.desc || ''

  if (!setsEqual(stored, recommended)) {
    storedMismatch.push({ kind, id: skill.id, name: skill.name, stored, recommended, desc: desc.slice(0, 100) })
  }

  if (isPassiveSkill(skill) && !EQUIPMENT_SKILL_IDS.has(skill.id) && !isToggleSkill(skill)) {
    const shouldHave = recommended.length > 0
    const hasGrantOrApply = /GRANTS?:/i.test(desc) || /^passive:.*apply\s+/i.test(desc)
    const hasImmunity = /immune to|immunity to|resistance to/i.test(desc)
    if ((hasGrantOrApply || hasImmunity) && !shouldHave && !stored.length) {
      missingPassives.push({ kind, id: skill.id, name: skill.name, desc })
    }
    if (hasGrantOrApply && !PASSIVE_SKILL_EFFECTS[skill.id] && !shouldHave) {
      unmappedPassives.push({ kind, id: skill.id, name: skill.name, desc })
    }
  }

  if (isAttackSkill(skill) && !isPassiveSkill(skill) && stored.length) {
    actionWithStored.push({ kind, id: skill.id, name: skill.name, stored, desc: desc.slice(0, 80) })
  }
}

function auditItem(item, kind) {
  const stored = (item.specialEffects || []).filter(id => effects[id])
  const recommended = recommendItemSpecialEffects(item)
  if (!setsEqual(stored, recommended)) {
    storedMismatch.push({
      kind, id: item.id, name: item.name, stored, recommended,
      desc: (item.desc || '').slice(0, 100)
    })
  }
}

walkSkills(skillsData, s => auditSkill(s, 'skill'))
walkSkills(raceSkillTrees, s => auditSkill(s, 'racial'))
walkItems(itemsData, i => auditItem(i, 'item'))
walkItems(profData, i => auditItem(i, 'prof'))
walkItems(discData, i => auditItem(i, 'disc'))

console.log('=== Effect link audit ===')
console.log('Stored vs recommended mismatches:', storedMismatch.length)
console.log('Action/spell skills with stored specialEffects (should be empty):', actionWithStored.length)
console.log('Passives with GRANTS/immunity but no effects:', missingPassives.length)
console.log('Passives needing PASSIVE_SKILL_EFFECTS mapping:', unmappedPassives.length)

if (storedMismatch.length) {
  console.log('\n--- Mismatches ---')
  for (const row of storedMismatch) {
    console.log(`[${row.kind}] ${row.id}: [${row.stored}] vs [${row.recommended}]`)
    console.log(' ', row.desc)
  }
}

if (actionWithStored.length) {
  console.log('\n--- Action skills with stored effects ---')
  for (const row of actionWithStored) {
    console.log(`${row.id}: [${row.stored}] | ${row.desc}`)
  }
}

if (missingPassives.length) {
  console.log('\n--- Missing passive effects ---')
  for (const row of missingPassives) {
    console.log(`${row.id}: ${row.desc}`)
  }
}

if (unmappedPassives.length) {
  console.log('\n--- Unmapped passives (need PASSIVE_SKILL_EFFECTS) ---')
  for (const row of unmappedPassives) {
    console.log(`${row.id}: ${row.desc}`)
  }
}

if (process.argv.includes('--list')) {
  const linked = []
  function addLinked(entity, kind) {
    const se = (entity.specialEffects || []).filter(id => effects[id])
    if (se.length) linked.push({ kind, id: entity.id, name: entity.name, se })
  }
  walkSkills(skillsData, s => addLinked(s, 'skill'))
  walkSkills(raceSkillTrees, s => addLinked(s, 'racial'))
  walkItems(itemsData, i => addLinked(i, 'item'))
  walkItems(profData, i => addLinked(i, 'prof'))
  walkItems(discData, i => addLinked(i, 'disc'))
  console.log('\n=== All linked entities:', linked.length, '===')
  for (const row of linked) {
    console.log(`[${row.kind}] ${row.id}: ${row.se.join(', ')}`)
  }
}
