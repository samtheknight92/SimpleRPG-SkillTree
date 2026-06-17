import { readFileSync, writeFileSync } from 'fs'

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

function phraseMatchesEffect(haystack, phrase) {
  if (!phrase || phrase.length < 3) return false
  const re = new RegExp(`(?:^|[^a-z0-9_])${escapeRegExp(phrase)}(?:[^a-z0-9_]|$)`)
  return re.test(haystack)
}

function extractFromDesc(desc) {
  const haystack = String(desc || '').toLowerCase()
  const found = []
  const sorted = Object.values(effects).sort((a, b) => b.name.length - a.name.length)
  for (const effect of sorted) {
    const idPhrase = effect.id.toLowerCase().replace(/_/g, ' ')
    const name = effect.name.toLowerCase()
    if (phraseMatchesEffect(haystack, idPhrase) || phraseMatchesEffect(haystack, name)) found.push(effect.id)
  }
  return found
}

function findEffectByPhrase(phrase) {
  const normalized = String(phrase || '').trim().toLowerCase()
  if (!normalized) return null
  return Object.values(effects).find(e =>
    e.name.toLowerCase() === normalized || e.id.replace(/_/g, ' ') === normalized
  ) || null
}

function resolveSkillEffects(skill) {
  const ids = new Set()
  if (effects[skill.id]) ids.add(skill.id)
  for (const raw of skill.specialEffects || []) {
    const id = normalizeEffectId(raw)
    if (effects[id]) ids.add(id)
  }
  if (ids.size) return [...ids]

  const byName = findEffectByPhrase(skill.name)
  if (byName) return [byName.id]

  const desc = String(skill.desc || '')
  const applyMatch = desc.match(/Apply\s+([A-Za-z][A-Za-z\s]+?)(?:\s*\(|\.|,|$)/i)
  if (applyMatch) {
    const effect = findEffectByPhrase(applyMatch[1].trim())
    if (effect) return [effect.id]
  }

  const fromDesc = extractFromDesc(desc)
  if (fromDesc.length === 1) return fromDesc
  if (fromDesc.length > 1) {
    const skillPhrase = String(skill.name || '').toLowerCase()
    const named = fromDesc.filter(id => {
      const e = effects[id]
      return e.name.toLowerCase() === skillPhrase || id.replace(/_/g, ' ') === skillPhrase
    })
    if (named.length) return named
  }
  return fromDesc.slice(0, 1)
}

function inferIntendedEffects(skill) {
  const desc = String(skill.desc || '')
  const intended = []

  const applyMatches = [...desc.matchAll(/Apply\s+([A-Za-z][A-Za-z\s]+?)(?:\s*\(|\.|,|$)/gi)]
  for (const m of applyMatches) {
    const effect = findEffectByPhrase(m[1].trim())
    if (effect) intended.push(effect.id)
  }

  const grantMatch = desc.match(/GRANTS?:\s*([^\.]+)/i)
  if (grantMatch) {
    for (const id of extractFromDesc(grantMatch[1])) intended.push(id)
  }

  const statusMatch = desc.match(/(?:immune to|immunity to|resistance to|weakness to|status effect[s]?:?\s*)\s*([^\.]+)/i)
  if (statusMatch) {
    for (const id of extractFromDesc(statusMatch[1])) intended.push(id)
  }

  return [...new Set(intended)]
}

function isPassiveSkill(skill) {
  return /^passive:/i.test(skill.desc || '') || Number(skill.staminaCost || 0) === 0 && /passive/i.test(skill.desc || '')
}

function isActionOnlySkill(skill) {
  const desc = String(skill.desc || '')
  if (/^action:/i.test(desc) && !/apply\s+/i.test(desc)) {
    return !extractFromDesc(desc).length
  }
  if (/^spell:/i.test(desc) && !/apply\s+/i.test(desc) && !effects[skill.id]) {
    const fromDesc = extractFromDesc(desc)
    if (!fromDesc.length) return true
  }
  return false
}

const allSkills = []
for (const cat of Object.values(skills)) {
  for (const list of Object.values(cat)) {
    if (!Array.isArray(list)) continue
    for (const s of list) allSkills.push(s)
  }
}

const withEffects = []
const mismatches = []
const missingEffect = []
const falsePositives = []

for (const skill of allSkills) {
  const resolved = resolveSkillEffects(skill)
  const intended = inferIntendedEffects(skill)
  if (resolved.length) withEffects.push({ skill, resolved })

  if (resolved.length && intended.length && !resolved.every(id => intended.includes(id))) {
    mismatches.push({ skill, resolved, intended, reason: 'resolved differs from Apply/GRANTS text' })
  }

  if (resolved.length && !intended.length && isActionOnlySkill(skill)) {
    falsePositives.push({ skill, resolved, reason: 'action skill with no status in desc' })
  }

  if (!resolved.length && intended.length) {
    missingEffect.push({ skill, intended, reason: 'desc mentions effect but none linked' })
  }

  // Name substring false positive: effect name appears in skill name but not in desc
  if (resolved.length === 1) {
    const effect = effects[resolved[0]]
    const nameLower = skill.name.toLowerCase()
    const effectName = effect.name.toLowerCase()
    const descLower = String(skill.desc || '').toLowerCase()
    if (
      nameLower.includes(effectName) &&
      effectName.length >= 4 &&
      !phraseMatchesEffect(descLower, effectName) &&
      !phraseMatchesEffect(descLower, effect.id.replace(/_/g, ' ')) &&
      skill.name.toLowerCase() !== effect.name.toLowerCase() &&
      !effects[skill.id]
    ) {
      falsePositives.push({ skill, resolved, reason: `effect "${effect.name}" matched via skill name only` })
    }
  }
}

console.log('Skills with linked effects:', withEffects.length)
console.log('False positives (should remove link):', falsePositives.length)
console.log('Missing effects (desc mentions, none linked):', missingEffect.length)
console.log('Mismatches:', mismatches.length)

console.log('\n--- False positives (first 40) ---')
falsePositives.slice(0, 40).forEach(({ skill, resolved, reason }) => {
  console.log(`${skill.id} | ${resolved.join(',')} | ${reason} | ${skill.desc}`)
})

console.log('\n--- Missing effects (first 30) ---')
missingEffect.slice(0, 30).forEach(({ skill, intended }) => {
  console.log(`${skill.id} | need: ${intended.join(',')} | ${skill.desc}`)
})

console.log('\n--- Mismatches ---')
mismatches.slice(0, 30).forEach(({ skill, resolved, intended }) => {
  console.log(`${skill.id} | got: ${resolved.join(',')} | want: ${intended.join(',')} | ${skill.desc}`)
})

// Current production logic (includes skill name in text scan)
function resolveCurrent(skill) {
  const ids = new Set()
  if (effects[skill.id]) ids.add(skill.id)
  for (const raw of skill.specialEffects || []) {
    const id = normalizeEffectId(raw)
    if (effects[id]) ids.add(id)
  }
  if (ids.size) return [...ids]
  const byName = findEffectByPhrase(skill.name)
  if (byName) return [byName.id]
  const desc = String(skill.desc || '')
  const applyMatch = desc.match(/Apply\s+([A-Za-z][A-Za-z\s]+?)(?:\s*\(|\.|,|$)/i)
  if (applyMatch) {
    const effect = findEffectByPhrase(applyMatch[1].trim())
    if (effect) return [effect.id]
  }
  const fromText = extractFromDesc(`${skill.name} ${desc}`)
  if (fromText.length <= 1) return fromText
  const skillPhrase = String(skill.name || '').toLowerCase()
  const named = fromText.filter(id => {
    const e = effects[id]
    return e.name.toLowerCase() === skillPhrase || id.replace(/_/g, ' ') === skillPhrase
  })
  if (named.length) return named
  return [fromText[0]]
}

const nameOnlyFalsePositives = []
for (const skill of allSkills) {
  const resolved = resolveCurrent(skill)
  if (resolved.length !== 1) continue
  const effect = effects[resolved[0]]
  const descLower = String(skill.desc || '').toLowerCase()
  const effectName = effect.name.toLowerCase()
  const idPhrase = effect.id.replace(/_/g, ' ')
  if (
    skill.name.toLowerCase().includes(effectName) &&
    effectName.length >= 4 &&
    !phraseMatchesEffect(descLower, effectName) &&
    !phraseMatchesEffect(descLower, idPhrase) &&
    skill.name.toLowerCase() !== effect.name.toLowerCase() &&
    !effects[skill.id]
  ) {
    nameOnlyFalsePositives.push({ skill, resolved: resolved[0] })
  }
}

console.log('\n--- Name-only false positives (current logic):', nameOnlyFalsePositives.length, '---')
nameOnlyFalsePositives.forEach(({ skill, resolved }) => {
  console.log(`${skill.id} -> ${resolved} | ${skill.desc}`)
})

const descMismatch = []
for (const skill of allSkills) {
  const resolved = resolveSkillEffects(skill)
  if (!resolved.length) continue
  const descLower = String(skill.desc || '').toLowerCase()
  const intended = inferIntendedEffects(skill)
  const allMentioned = resolved.every(id => {
    if (intended.includes(id)) return true
    const e = effects[id]
    return phraseMatchesEffect(descLower, e.name.toLowerCase()) ||
      phraseMatchesEffect(descLower, e.id.replace(/_/g, ' '))
  })
  if (!allMentioned && !effects[skill.id] && skill.name.toLowerCase() !== effects[resolved[0]]?.name.toLowerCase()) {
    descMismatch.push({ skill, resolved, intended })
  }
}

console.log('\n--- Effect not mentioned in description:', descMismatch.length, '---')
descMismatch.slice(0, 50).forEach(({ skill, resolved }) => {
  console.log(`${skill.id} -> ${resolved.join(',')} | ${skill.desc}`)
})


