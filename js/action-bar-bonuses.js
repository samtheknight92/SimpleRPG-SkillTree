import { cache, getRace, getSkill } from './cache.js'
import { characterWieldsWeaponKind } from './equipment.js'
import { titleCase } from './utils.js'
import { displayCategory } from './skills.js'
import { isToggleSkill } from './skills.js'
import { getSkillActivationType } from './skill-activation.js'
import { getActionBarBlockReason } from './combat.js'
import {
  resolveSkillEffectBreakdown,
  formatDamageBreakdownHtml,
  skillHasEffectBreakdown,
  skillHealsDirectHP,
  usesMagicPowerForHeal,
  isBasicAttackSkill
} from './damage-breakdown.js'

const ATTACK_STATS = new Set(['magicPower', 'accuracy', 'strength', 'speed'])

const STAT_SHORT = {
  magicPower: 'MP',
  accuracy: 'ACC',
  strength: 'STR',
  speed: 'SPD'
}

const STAT_LABEL = {
  magicPower: 'Magic Power',
  accuracy: 'Accuracy',
  strength: 'Strength',
  speed: 'Speed'
}

function getSkillBenefitStats(skill) {
  const desc = String(skill?.desc || '')
  const stats = new Set()
  if (isBasicAttackSkill(skill)) stats.add('strength')
  if (/^spell:/i.test(desc) || /magic power|magical attack/i.test(desc)) stats.add('magicPower')
  if (/^action:/i.test(desc) || /attack|strike|shot|slash|swing|cleave/i.test(desc)) {
    stats.add('accuracy')
    if (!/magic power/i.test(desc)) stats.add('strength')
  }
  if (isToggleSkill(skill)) {
    if (/staff|wand|magic|spell/i.test(desc)) stats.add('magicPower')
    if (/attack|weapon|strike/i.test(desc)) stats.add('accuracy')
  }
  if (skillHealsDirectHP(skill) && usesMagicPowerForHeal(skill)) stats.add('magicPower')
  return stats
}

const WEAPON_SKILL_KINDS = ['sword', 'axe', 'dagger', 'polearm', 'hammer', 'staff', 'ranged', 'striker', 'unarmed']
const WEAPON_FUSION_KINDS = ['sword', 'bow', 'dagger', 'polearm', 'hammer', 'axe', 'staff']
const ELEMENT_FUSION_KINDS = new Set([
  'fire', 'ice', 'lightning', 'thunder', 'earth', 'wind', 'water', 'darkness', 'light'
])

/** Any equipped main-hand weapon (for generic weapon + magic fusions). */
export const ANY_WEAPON_KIND = '__any_weapon__'

function weaponKindsFromFusion(fusionType) {
  const fusion = String(fusionType || '').toLowerCase()
  if (!fusion || fusion.startsWith('monster_')) return []

  if (fusion === 'weapon_light') return [ANY_WEAPON_KIND]

  const parts = fusion.split('_')
  if (parts.length < 2) return []

  const [first, second] = parts
  // Element + element (e.g. fire_ice, darkness_light) — pure magic, no weapon.
  if (ELEMENT_FUSION_KINDS.has(first) && ELEMENT_FUSION_KINDS.has(second)) return []

  // Weapon + magic/profession (e.g. sword_fire, bow_enchanting, staff_ice).
  if (WEAPON_FUSION_KINDS.includes(first)) return [first === 'bow' ? 'ranged' : first]

  return []
}

export function getSkillWeaponKinds(skill) {
  const kinds = new Set()
  const sub = String(skill?.subcategory || '').toLowerCase()
  const desc = String(skill?.desc || '').toLowerCase()
  const fusion = String(skill?.fusionType || '')

  if (WEAPON_SKILL_KINDS.includes(sub)) kinds.add(sub)
  if (sub === 'ranged_magic') kinds.add('ranged')

  for (const kind of weaponKindsFromFusion(fusion)) kinds.add(kind)
  if (String(fusion).toLowerCase().startsWith('bow_')) kinds.add('ranged')

  // Weapon techniques only — plain spells are not gear-gated.
  if (/^action:/i.test(desc)) {
    if (/sword/.test(desc)) kinds.add('sword')
    if (/\baxe\b/.test(desc)) kinds.add('axe')
    if (/dagger/.test(desc)) kinds.add('dagger')
    if (/polearm|spear|glaive|halberd|lance/.test(desc)) kinds.add('polearm')
    if (/hammer|mace|maul/.test(desc)) kinds.add('hammer')
    if (/\b(staff|wand|rod)\b/.test(desc)) kinds.add('staff')
    if (/bow|crossbow|arrow|bolt/.test(desc)) kinds.add('ranged')
    if (/empty.?hand|both hands empty|unarmed|striker/i.test(desc)) kinds.add('striker')
  }

  return kinds
}

function equipmentRuleApplies(rule, skill, benefitStats) {
  const kinds = getSkillWeaponKinds(skill)
  const desc = String(skill?.desc || '')
  const isSpell = /^spell:/i.test(desc)
  const hasRelevantStat = Object.entries(rule.statModifiers || {}).some(
    ([stat, value]) => value && benefitStats.has(stat)
  )
  if (!hasRelevantStat) return false

  if (rule.weaponKind === 'staff') {
    return isSpell || kinds.has('staff') || (isToggleSkill(skill) && /staff|wand/i.test(desc))
  }
  if (rule.weaponKind === 'ranged') {
    return kinds.has('ranged') || skill.subcategory === 'ranged'
  }
  if (rule.weaponKind === 'striker' || rule.weaponKind === 'unarmed') {
    return kinds.has('striker') || kinds.has('unarmed') || skill.subcategory === 'striker' || skill.subcategory === 'unarmed'
  }
  return kinds.has(rule.weaponKind) || skill.subcategory === rule.weaponKind
}

function pushBonus(list, seen, entry) {
  const key = `${entry.stat}|${entry.sourceId}|${entry.value}`
  if (seen.has(key)) return
  seen.add(key)
  list.push(entry)
}

/** Passive / equipment bonuses that apply when using this Action Bar skill. */
export function getActionBarSkillBonuses(character, skill) {
  if (!character || !skill) return []

  const benefitStats = getSkillBenefitStats(skill)
  if (!benefitStats.size) return []

  const bonuses = []
  const seen = new Set()

  for (const learnedId of character.skills || []) {
    const rule = cache.equipmentSkillEffects[learnedId]
    if (!rule || !characterWieldsWeaponKind(character, rule.weaponKind)) continue
    if (!equipmentRuleApplies(rule, skill, benefitStats)) continue
    const passiveSkill = getSkill(learnedId)
    for (const [stat, value] of Object.entries(rule.statModifiers || {})) {
      if (!value || !benefitStats.has(stat)) continue
      pushBonus(bonuses, seen, {
        stat,
        value: Number(value),
        sourceId: learnedId,
        sourceName: passiveSkill?.name || titleCase(learnedId)
      })
    }
  }

  const race = getRace(character.race)
  for (const rule of race?.equipmentStatModifiers || []) {
    if (!characterWieldsWeaponKind(character, rule.weaponKind)) continue
    if (!equipmentRuleApplies({ weaponKind: rule.weaponKind, statModifiers: rule.statModifiers }, skill, benefitStats)) {
      continue
    }
    for (const [stat, value] of Object.entries(rule.statModifiers || {})) {
      if (!value || !benefitStats.has(stat)) continue
      pushBonus(bonuses, seen, {
        stat,
        value: Number(value),
        sourceId: rule.id || `race_${character.race}`,
        sourceName: rule.label || race?.name || 'Race passive'
      })
    }
  }

  const desc = String(skill.desc || '')
  const isSpell = /^spell:/i.test(desc)

  for (const learnedId of character.skills || []) {
    const flat = cache.passiveBonuses[learnedId]
    if (!flat) continue
    const passiveSkill = getSkill(learnedId)
    for (const [stat, value] of Object.entries(flat)) {
      if (!value || !ATTACK_STATS.has(stat) || !benefitStats.has(stat)) continue
      if (learnedId === 'elven_accuracy' && !isSpell && skill.subcategory !== 'ranged') continue
      pushBonus(bonuses, seen, {
        stat,
        value: Number(value),
        sourceId: learnedId,
        sourceName: passiveSkill?.name || titleCase(learnedId)
      })
    }
  }

  return bonuses
}

export function summarizeActionBarBonuses(bonuses) {
  const totals = {}
  for (const bonus of bonuses) {
    totals[bonus.stat] = (totals[bonus.stat] || 0) + bonus.value
  }
  return totals
}

export function formatBonusStatLabel(stat, value) {
  const sign = value >= 0 ? '+' : ''
  const label = STAT_LABEL[stat] || titleCase(stat)
  return `${sign}${value} ${label}`
}

export function formatBonusTotalsLabel(totals) {
  return Object.entries(totals)
    .map(([stat, value]) => formatBonusStatLabel(stat, value))
    .join(', ')
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

function findHealTextEnd(desc) {
  const text = String(desc || '')
  const match = text.match(/\d+d\d+(?:\s*\+\s*\d+)?\s*HP/i)
    || text.match(/(?:restore|heals?(?:\s+\w+){0,5}\s+for)\s+\d+\s*HP/i)
  return match ? match.index + match[0].length : null
}

function findStrengthTextEnd(desc) {
  const text = String(desc || '')
  const match = text.match(/\+\s*Strength\b/i)
  return match ? match.index + match[0].length : null
}

function findBonusInsertEnd(desc) {
  return findDamageTextEnd(desc) ?? findHealTextEnd(desc) ?? findStrengthTextEnd(desc)
}

function descHasDirectDamage(desc) {
  return findDamageTextEnd(desc) !== null
}

function descHasDirectHeal(desc) {
  return findHealTextEnd(desc) !== null
}

export function skillShowsActionBarBonuses(skillOrDesc) {
  if (skillOrDesc && typeof skillOrDesc === 'object') {
    if (isBasicAttackSkill(skillOrDesc)) return true
    return skillShowsActionBarBonuses(skillOrDesc.desc || '')
  }
  const desc = String(skillOrDesc || '')
  return descHasDirectDamage(desc) || descHasDirectHeal(desc) || findStrengthTextEnd(desc) !== null
}

export function formatDescWithBonusTotals(desc, totals) {
  const text = String(desc || '')
  const entries = Object.entries(totals || {}).filter(([, value]) => value)
  if (!text || !entries.length) return escapeHtml(text)

  const insertAt = findBonusInsertEnd(text)
  if (insertAt === null) return escapeHtml(text)
  const before = escapeHtml(text.slice(0, insertAt))
  const after = escapeHtml(text.slice(insertAt))
  const totalHtml = entries
    .map(([stat, value], index) => {
      const sep = index ? '<span class="action-bar-tip-bonus-total-sep">, </span>' : ''
      const statClass = `bonus-stat-${stat}`
      return `${sep}<span class="action-bar-tip-bonus-total ${statClass}">${escapeHtml(formatBonusStatLabel(stat, value))}</span>`
    })
    .join('')

  return `${before} ${totalHtml}${after}`
}

export function formatDescWithBonusTotalsPlain(desc, totals) {
  const text = String(desc || '')
  const label = formatBonusTotalsLabel(totals)
  if (!text || !label) return text
  const insertAt = findBonusInsertEnd(text)
  if (insertAt === null) return text
  return `${text.slice(0, insertAt)} ${label}${text.slice(insertAt)}`
}

export function formatBonusChipText(bonuses) {
  const totals = summarizeActionBarBonuses(bonuses)
  return Object.entries(totals)
    .map(([stat, value]) => {
      const short = STAT_SHORT[stat] || titleCase(stat).slice(0, 3).toUpperCase()
      return `${value >= 0 ? '+' : ''}${value} ${short}`
    })
    .join(' · ')
}

export function actionBarSkillTooltipHtml(skill, character) {
  if (!skill) return ''
  const allBonuses = getActionBarSkillBonuses(character, skill)
  const showBonuses = skillShowsActionBarBonuses(skill)
  const bonuses = showBonuses ? allBonuses : []
  const totals = summarizeActionBarBonuses(bonuses)
  const lines = []

  lines.push(`<div class="action-bar-tip-title">${escapeHtml(skill.name)}</div>`)
  lines.push(
    `<div class="action-bar-tip-meta">${escapeHtml(displayCategory(skill.category))} / ${escapeHtml(titleCase(skill.subcategory))} · Tier ${skill.tier || 1}</div>`
  )
  lines.push(
    `<div class="action-bar-tip-meta">Stamina: ${Number(skill.staminaCost || 0)}</div>`
  )
  if (skill.desc) {
    lines.push(`<div class="action-bar-tip-desc">${formatDescWithBonusTotals(skill.desc, totals)}</div>`)
  }

  if (character && skillHasEffectBreakdown(skill)) {
    const breakdown = resolveSkillEffectBreakdown(character, skill)
    const breakdownHtml = formatDamageBreakdownHtml(breakdown)
    if (breakdownHtml) lines.push(breakdownHtml)
  }

  if (bonuses.length) {
    lines.push('<div class="action-bar-tip-bonuses">')
    for (const bonus of bonuses) {
      const statClass = `bonus-stat-${bonus.stat}`
      lines.push(
        `<div class="action-bar-tip-bonus-row"><span class="action-bar-tip-bonus ${statClass}">${escapeHtml(formatBonusStatLabel(bonus.stat, bonus.value))}</span> <span class="action-bar-tip-bonus-source">(${escapeHtml(bonus.sourceName)})</span></div>`
      )
    }
    lines.push('</div>')
  }

  const type = getSkillActivationType(skill)
  if (character && (type === 'activatable' || type === 'toggle')) {
    const disableReason = getActionBarBlockReason(character, skill, type)
    if (disableReason) {
      lines.push(`<div class="action-bar-tip-warn">Why greyed out: ${escapeHtml(disableReason)}</div>`)
    }
  }

  return lines.join('')
}

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}
