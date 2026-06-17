/**
 * Normalize skill/item descriptions and align specialEffects with text.
 * Run: node scripts/sync-game-data.mjs [--write]
 */
import fs from 'fs'
import path from 'path'
import vm from 'vm'
import { fileURLToPath } from 'url'
import { execSync } from 'child_process'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')
const dataDir = path.join(root, 'data')
const jsonDir = path.join(dataDir, 'json')

const effects = JSON.parse(fs.readFileSync(path.join(jsonDir, 'effects.json'), 'utf8'))
const meta = JSON.parse(fs.readFileSync(path.join(jsonDir, 'skill-meta.json'), 'utf8'))

const EQUIPMENT_SKILL_IDS = new Set(Object.keys(meta.EQUIPMENT_SKILL_EFFECTS || {}))
const PASSIVE_SKILL_EFFECTS = meta.PASSIVE_SKILL_EFFECTS || {}
const TOGGLE_SKILL_EFFECTS = meta.TOGGLE_SKILL_EFFECTS || {}
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
  const phrases = [
    effect.name.toLowerCase(),
    effect.id.toLowerCase().replace(/_/g, ' ')
  ].filter(phrase => phrase.length >= 4)

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
  const phrases = [
    effect.name.toLowerCase(),
    effect.id.toLowerCase().replace(/_/g, ' ')
  ].filter(phrase => phrase.length >= 4)

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

export function normalizeDescription(text, { isToggle = false, isWeaponConditional = false } = {}) {
  let desc = String(text || '')
    .replace(/\s*Linked effects: [^.]+\./gi, '')
    .replace(/\s*\(status-effects\.js[^)]*\)/gi, '')
    .replace(/\s*—\s*see status-effects\.js[^.]*\./gi, '')
    .replace(/\+(\d+)\s+attack bonus/gi, '+$1 Accuracy')
    .replace(/\battack bonus\b/gi, 'Accuracy bonus')
    .replace(/\s{2,}/g, ' ')
    .trim()

  if (!/\bAC\b/.test(desc)) return desc

  if (isWeaponConditional || /while wielding|while holding|when wielding/i.test(desc)) {
    return desc.replace(/\+(\d+)\s+AC\b/g, '+$1 Physical Defence')
  }
  if (isToggle) {
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

  if (/channeled spell|concentration/i.test(item.desc)) {
    if (effects.concentration) fromPassive.push('concentration')
  }

  if (item.id === 'hunter_focus_charm' && effects.concentration) {
    fromPassive.push('concentration')
  }

  const linked = new Set([...fromGrants, ...fromPassive])
  for (const id of item.specialEffects || []) {
    if (!effects[id]) continue
    if (isEffectNegatedInText(item.desc, effects[id])) continue
    linked.add(id)
  }

  return [...linked]
}

function enrichItemDescription(item) {
  let desc = normalizeDescription(item.desc)
  const linked = recommendItemSpecialEffects({ ...item, desc })

  if (item.id === 'hunter_focus_charm') {
    if (!/concentration/i.test(desc)) {
      desc = `${desc} GRANTS: Concentration while sustaining a channeled spell or toggle.`
    }
  }

  if (linked.length && !/GRANTS?:/i.test(desc)) {
    const labels = linked
      .map(id => effects[id]?.name || id)
      .filter((name, i, arr) => arr.indexOf(name) === i)
    if (labels.length && !labels.every(name => phraseMatchesEffect(desc.toLowerCase(), name.toLowerCase()))) {
      desc = `${desc} GRANTS: ${labels.join(', ')}.`
    }
  }

  return desc.replace(/\s{2,}/g, ' ').replace(/\.\s*\./g, '.').trim()
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

const stats = {
  skillDescUpdates: 0,
  skillEffectUpdates: 0,
  itemDescUpdates: 0,
  itemEffectUpdates: 0
}

walkSkills(skillsData, processSkill)
walkSkills(raceSkillTrees, processSkill)

function processSkill(skill) {
  const nextDesc = normalizeDescription(skill.desc, {
    isToggle: isToggleSkill(skill),
    isWeaponConditional: /while wielding|when wielding/i.test(skill.desc || '')
  })
  if (nextDesc !== skill.desc) {
    skill.desc = nextDesc
    stats.skillDescUpdates++
  }

  const recommended = recommendSkillSpecialEffects(skill)
  const current = Array.isArray(skill.specialEffects) ? skill.specialEffects : []
  const same = current.length === recommended.length && current.every((id, i) => id === recommended[i])
  if (!same) {
    skill.specialEffects = recommended
    stats.skillEffectUpdates++
  }
}

walkItems(itemsData, item => {
  const nextDesc = enrichItemDescription(item)
  if (nextDesc !== item.desc) {
    item.desc = nextDesc
    stats.itemDescUpdates++
  }
  const recommended = recommendItemSpecialEffects(item)
  const current = Array.isArray(item.specialEffects) ? item.specialEffects : []
  const same = current.length === recommended.length && current.every((id, i) => id === recommended[i])
  if (!same) {
    item.specialEffects = recommended
    stats.itemEffectUpdates++
  }
})

walkItems(profData, item => {
  const nextDesc = enrichItemDescription(item)
  if (nextDesc !== item.desc) {
    item.desc = nextDesc
    stats.itemDescUpdates++
  }
  const recommended = recommendItemSpecialEffects(item)
  const current = Array.isArray(item.specialEffects) ? item.specialEffects : []
  const same = current.length === recommended.length && current.every((id, i) => id === recommended[i])
  if (!same) {
    item.specialEffects = recommended
    stats.itemEffectUpdates++
  }
})

console.log('Sync game data report:')
console.log('  Skill descriptions normalized:', stats.skillDescUpdates)
console.log('  Skill specialEffects updated:', stats.skillEffectUpdates)
console.log('  Item descriptions enriched:', stats.itemDescUpdates)
console.log('  Item specialEffects updated:', stats.itemEffectUpdates)

const write = process.argv.includes('--write')
if (!write) {
  console.log('\nDry run. Pass --write to update data files and rebuild JSON.')
  process.exit(0)
}

function rewriteDataFile(file, varName, data) {
  const source = fs.readFileSync(path.join(dataDir, file), 'utf8')
  const marker = `const ${varName} = {`
  const headerEnd = source.indexOf(marker)
  if (headerEnd < 0) throw new Error(`Could not find ${varName} in ${file}`)
  let header = source.slice(0, headerEnd)
  if (file === 'skills-data.js') {
    header = header
      .replace(/\(reference to status-effects\.js\)/g, '(use effect name from Effects list)')
      .replace(/always reference status-effects\.js\./g, 'use standard effect names from the Effects list.')
      .replace(/\(status-effects\.js[^)]*\)/g, '')
  }
  const body = `const ${varName} = ${JSON.stringify(data, null, 4)};\n`
  let footer = ''
  if (file === 'races-data.js' && varName === 'RACE_SKILL_TREES') {
    footer = `
    window.RACES_DATA = RACES_DATA;
    window.RACE_SKILL_TREES = RACE_SKILL_TREES;
    console.log('RACES_DATA loaded successfully:', Object.keys(RACES_DATA));
    console.log('RACE_SKILL_TREES loaded successfully:', Object.keys(RACE_SKILL_TREES));
} catch (error) {
    console.error('Error loading races data:', error);
}
`
  } else {
    footer = `\nwindow.${varName} = ${varName};\n`
  }
  fs.writeFileSync(path.join(dataDir, file), header + body + footer, 'utf8')
}

rewriteDataFile('skills-data.js', 'SKILLS_DATA', skillsData)
rewriteDataFile('races-data.js', 'RACE_SKILL_TREES', raceSkillTrees)
rewriteDataFile('items-data.js', 'ITEMS_DATA', itemsData)
rewriteDataFile('profession-items-data.js', 'PROFESSION_ITEMS_DATA', profData)

execSync('node scripts/build-data.mjs', { cwd: root, stdio: 'inherit' })
console.log('Wrote source data and rebuilt JSON.')
