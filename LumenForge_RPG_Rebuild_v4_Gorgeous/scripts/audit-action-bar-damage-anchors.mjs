import fs from 'fs'

const skills = JSON.parse(fs.readFileSync('data/json/skills.json', 'utf8'))
const meta = JSON.parse(fs.readFileSync('data/json/skill-meta.json', 'utf8'))
const equipIds = new Set(Object.keys(meta.EQUIPMENT_SKILL_EFFECTS || {}))

function flatten(obj) {
  const out = []
  for (const v of Object.values(obj || {})) {
    if (Array.isArray(v)) out.push(...v)
    else if (v && typeof v === 'object') out.push(...flatten(v))
  }
  return out
}

function isActionBarSkill(skill) {
  if (equipIds.has(skill.id)) return false
  if (/\bToggle\s*:/i.test(skill.desc || '')) return true
  if (/^passive:/i.test(skill.desc || '')) return false
  if (/^action:/i.test(skill.desc || '') || /^spell:/i.test(skill.desc || '')) return true
  if (Number(skill.staminaCost || 0) > 0) return true
  return false
}

// Mirror action-bar-bonuses.js (filled in after import from built module - duplicated for audit)
function skillDealsDirectDamage(desc) {
  return findDamageTextEnd(desc) !== null || findFlatDamageEnd(desc) !== null
}

function findFlatDamageEnd(desc) {
  const text = String(desc || '')
  const match = text.match(/\+\d+\s+damage\b(?!\s+to\s+next)/i)
  return match ? match.index + match[0].length : null
}

function findDamageTextEnd(desc) {
  const text = String(desc || '')
  if (!text) return null
  if (/\+?\d+\s+damage\s+to\s+next/i.test(text)) return null
  if (/build\s+\w+\s+energy/i.test(text)) return null

  const dicePattern = /\d+d\d+(?:\+\d+|\s*\+\s*(?:\d+|magic power))?/gi
  let match
  while ((match = dicePattern.exec(text))) {
    const idx = match.index
    const before = text.slice(Math.max(0, idx - 50), idx).toLowerCase()
    const ahead = text.slice(idx, idx + 40).toLowerCase()
    if (/restore|heals?\s|healing\s+(allies|self|yourself)|recover\s/.test(before) && !/steal|drain/.test(before)) {
      continue
    }
    if (/stamina\s*\(/.test(before + ahead)) continue
    const rest = text.slice(match.index + match[0].length)
    const extend = rest.match(/^(?:\s+\+\s*normal\s+damage|\s+[a-z]+)*(?:\s+damage)?/i)
    return match.index + match[0].length + (extend ? extend[0].length : 0)
  }
  return findFlatDamageEnd(text)
}

const actionSkills = flatten(skills).filter(isActionBarSkill)
const gaps = []
const excluded = []

for (const skill of actionSkills) {
  const desc = skill.desc || ''
  const hasDice = /\d+d\d+/.test(desc)
  const anchor = findDamageTextEnd(desc)
  const deals = skillDealsDirectDamage(desc)
  if (hasDice && !anchor && !/build\s+\w+\s+energy|damage\s+to\s+next|restore|heal/i.test(desc)) {
    gaps.push({ id: skill.id, desc })
  }
  if (hasDice && !deals && /build|next\s+\w+\s+spell|restore|healing/i.test(desc)) {
    excluded.push(skill.id)
  }
}

console.log('Action bar skills:', actionSkills.length)
console.log('Likely missing anchor:', gaps.length)
for (const row of gaps) console.log(' -', row.id, '|', row.desc.slice(0, 100))
