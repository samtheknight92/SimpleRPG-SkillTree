/**
 * Lists action-bar ranged / bow-fusion skills and whether they are blocked after movement.
 * Run: node scripts/audit-ranged-move-rule.mjs
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const skills = JSON.parse(fs.readFileSync(path.join(root, 'data/json/skills.json'), 'utf8'))

const DAMAGE_TYPE_EFFECTS = new Set([
  'fire_damage', 'ice_damage', 'lightning_damage', 'earth_damage', 'wind_damage',
  'water_damage', 'darkness_damage', 'light_damage', 'holy_damage', 'undead_damage',
  'poison_damage', 'magic_damage', 'physical_damage'
])

const WEAPON_SKILL_KINDS = ['sword', 'axe', 'dagger', 'polearm', 'hammer', 'staff', 'ranged']
const WEAPON_FUSION_KINDS = ['sword', 'bow', 'dagger', 'polearm', 'hammer', 'axe', 'staff']
const MOVE_EXEMPT = new Set(['quick_draw'])

function flattenSkills(node, category = '', subcategory = '') {
  const rows = []
  for (const [key, value] of Object.entries(node || {})) {
    if (Array.isArray(value)) {
      for (const skill of value) {
        if (skill?.id) rows.push({ ...skill, category, subcategory: subcategory || key })
      }
    } else if (value && typeof value === 'object') {
      rows.push(...flattenSkills(value, category || key, key))
    }
  }
  return rows
}

function isToggleSkill(skill) {
  return /\bToggle\s*:/i.test(skill?.desc || '')
}

function getSkillActivationType(skill) {
  if (isToggleSkill(skill)) return 'toggle'
  if (/^passive:/i.test(skill?.desc || '')) return 'passive'
  if (/^action:/i.test(skill?.desc || '') || /^spell:/i.test(skill?.desc || '')) return 'activatable'
  if (Number(skill.staminaCost || 0) > 0) return 'activatable'
  return 'passive'
}

function isActionBarSkill(skill) {
  const type = getSkillActivationType(skill)
  return type === 'toggle' || type === 'activatable'
}

function weaponKindsFromFusion(fusionType) {
  const fusion = String(fusionType || '').toLowerCase()
  if (!fusion || fusion.startsWith('monster_')) return []
  const parts = fusion.split('_')
  if (parts.length < 2) return []
  const [first] = parts
  if (WEAPON_FUSION_KINDS.includes(first)) return [first === 'bow' ? 'ranged' : first]
  return []
}

function getSkillWeaponKinds(skill) {
  const kinds = new Set()
  const sub = String(skill?.subcategory || '').toLowerCase()
  const desc = String(skill?.desc || '').toLowerCase()
  const fusion = String(skill?.fusionType || '')
  if (WEAPON_SKILL_KINDS.includes(sub)) kinds.add(sub)
  if (sub === 'ranged_magic') kinds.add('ranged')
  for (const kind of weaponKindsFromFusion(fusion)) kinds.add(kind)
  if (String(fusion).toLowerCase().startsWith('bow_')) kinds.add('ranged')
  if (/^action:/i.test(desc)) {
    if (/bow|crossbow|arrow|bolt/.test(desc)) kinds.add('ranged')
  }
  return kinds
}

function isBowFusionSkill(skill) {
  return String(skill?.fusionType || '').toLowerCase().startsWith('bow_')
}

function fusionDescImpliesRangedAttack(skill) {
  const desc = String(skill?.desc || '')
  return /\b(arrows?|volley|projectiles?|bow shot|shot from (?:a |your )?bow|burning arrows?|frost arrows?|enchanted arrows?)\b/i.test(desc)
}

function isRangedAttackSkill(skill) {
  if (MOVE_EXEMPT.has(skill.id)) return false
  const type = getSkillActivationType(skill)
  if (type === 'passive' || type === 'toggle') return false
  const sub = String(skill?.subcategory || '').toLowerCase()
  if (sub === 'ranged_magic') return true
  if (isBowFusionSkill(skill)) return true
  if (sub === 'ranged') return true
  if ([...getSkillWeaponKinds(skill)].includes('ranged')) return true
  if (skill.category === 'fusion' && fusionDescImpliesRangedAttack(skill)) return true
  return false
}

const all = flattenSkills(skills)
const actionBar = all.filter(isActionBarSkill)
const ranged = actionBar.filter(isRangedAttackSkill)
const notRanged = actionBar.filter(skill => {
  const sub = String(skill.subcategory || '').toLowerCase()
  const fusion = String(skill.fusionType || '')
  const isToggle = getSkillActivationType(skill) === 'toggle'
  if (isToggle) return false
  return sub === 'ranged' || sub === 'ranged_magic' || fusion.startsWith('bow_')
}).filter(skill => !isRangedAttackSkill(skill))

console.log(`Action-bar skills: ${actionBar.length}`)
console.log(`Blocked after movement (no Quick Draw): ${ranged.length}`)
console.log('\nRanged / bow-fusion action-bar skills:')
for (const skill of ranged.sort((a, b) => a.name.localeCompare(b.name))) {
  console.log(`  ✓ ${skill.id} — ${skill.name} (${getSkillActivationType(skill)}, ${skill.subcategory || skill.category})`)
}

if (notRanged.length) {
  console.log('\n⚠ Expected ranged but NOT matched:')
  for (const skill of notRanged) {
    console.log(`  ✗ ${skill.id} — ${skill.name}`)
  }
  process.exitCode = 1
} else {
  console.log('\nAll ranged / bow-fusion action-bar skills matched.')
}
