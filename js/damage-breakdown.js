import { computeStats } from './character.js'
import { getRace, getSkill, cache } from './cache.js'
import { getEquippedWeapon, getEquippedOffhand, getWeaponKind } from './equipment.js'
import { collectCareerFlatDamageBonuses } from './career-effects.js'

export const BASIC_ATTACK_ID = '__basic_attack__'
/** Minimum result for any attack or direct heal after stat modifiers. */
export const MIN_EFFECT_AMOUNT = 1
export const MIN_ATTACK_DAMAGE = MIN_EFFECT_AMOUNT
export const MIN_HEAL_AMOUNT = MIN_EFFECT_AMOUNT

const STAT_LABEL = {
  magicPower: 'Magic Power',
  strength: 'Strength',
  accuracy: 'Accuracy'
}

export function isRangedBasicAttack(character) {
  return equippedWeaponKinds(character).has('ranged')
}

/** Stat added to basic attack damage after weapon dice (+ Strength). */
export function basicAttackDamageStatKey() {
  return 'strength'
}

/** Effective stat value added to attack/heal totals (uses full computed stat). */
export function getStatDamageContribution(character, statKey) {
  if (!character || !statKey) return 0
  return Number(computeStats(character)[statKey] || 0)
}

function safeGetRace(raceId) {
  try {
    return getRace(raceId)
  } catch {
    return null
  }
}

export function applyBasicAttackDamage(character, skill, baseDamage) {
  const flatBonuses = collectFlatDamageBonuses(character, skill)
  const flatTotal = flatBonuses
    .filter(bonus => !bonus.conditional)
    .reduce((sum, bonus) => sum + bonus.value, 0)
  const strength = getStatDamageContribution(character, 'strength')
  const rawTotal = baseDamage + flatTotal + strength
  return {
    total: Math.max(MIN_ATTACK_DAMAGE, rawTotal),
    rawTotal,
    minApplied: rawTotal < MIN_ATTACK_DAMAGE,
    flatTotal,
    statValue: strength,
    stat: 'strength',
    flatBonuses
  }
}

export function isBasicAttackSkill(skill) {
  return skill?.id === BASIC_ATTACK_ID || skill?.isBasicAttack
}

function parseDamageFormula(formula) {
  const text = String(formula || '').trim()
  const match = text.match(/^(\d+)d(\d+)(?:\s*\+\s*(\d+))?$/i)
  if (!match) return null
  return {
    count: Number(match[1]),
    sides: Number(match[2]),
    modifier: Number(match[3] || 0)
  }
}

export function rollWeaponDamage(formula, rollDiceFn) {
  const parsed = parseDamageFormula(formula)
  if (!parsed) return { total: 1, detail: '1' }
  const rolls = rollDiceFn(parsed.count, parsed.sides, parsed.modifier)
  return {
    total: rolls.total,
    detail: rolls.rolls?.length
      ? `${rolls.rolls.join('+')}${parsed.modifier ? `+${parsed.modifier}` : ''} = ${rolls.total}`
      : String(rolls.total)
  }
}

export function skillDealsDirectDamage(skill) {
  if (!skill) return false
  if (isBasicAttackSkill(skill)) return true
  if (skillHealsDirectHP(skill)) return false
  const desc = String(skill.desc || '')
  return /\d+d\d+/i.test(desc) || /\+\d+\s+damage\b/i.test(desc)
}

const HEAL_HALF_DAMAGE_RE = /heal(?:ing)?\s+(?:you|yourself|self|allies)\s+for\s+half/i

export function skillHealsDirectHP(skill) {
  if (!skill || isBasicAttackSkill(skill)) return false
  return !!parseHealAmount(skill.desc)
}

export function usesMagicPowerForHeal(skill) {
  const desc = String(skill?.desc || '')
  if (!skillHealsDirectHP(skill)) return false
  if (/\+\s*magic\s+power/i.test(desc)) return true
  if (/^spell:/i.test(desc)) return true
  if (/^action:/i.test(desc) && /magic|holy|light|arcane|touch ally/i.test(desc)) return true
  return false
}

function parseHealAmount(desc) {
  const text = String(desc || '')
  if (!text || HEAL_HALF_DAMAGE_RE.test(text)) return null
  if (/\d+\s*HP\s*\/\s*turn/i.test(text)) return null
  if (/gain\s+\+\d+\s*HP\b/i.test(text)) return null

  const diceMatch = text.match(
    /(?:restore|heals?(?:\s+\w+){0,5}\s+for)\s+(\d+)d(\d+)(?:\s*\+\s*(\d+))?\s*HP/i
  ) || text.match(/heal\s+(\d+)d(\d+)(?:\s*\+\s*(\d+))?\s*HP/i)
    || text.match(/heals?\s+allies\s+(?:for\s+)?(\d+)d(\d+)(?:\s*\+\s*(\d+))?/i)

  if (diceMatch) {
    const modifier = Number(diceMatch[3] || 0)
    return {
      count: Number(diceMatch[1]),
      sides: Number(diceMatch[2]),
      modifier,
      formula: `${diceMatch[1]}d${diceMatch[2]}${modifier ? `+${modifier}` : ''}`,
      flat: 0
    }
  }

  const flatMatch = text.match(/(?:restore|heals?(?:\s+\w+){0,5}\s+for)\s+(\d+)\s*HP/i)
  if (flatMatch) {
    return {
      count: 0,
      sides: 0,
      modifier: 0,
      formula: String(flatMatch[1]),
      flat: Number(flatMatch[1])
    }
  }

  return null
}

export function collectFlatHealBonuses(character, skill) {
  if (!character || !skill || !skillHealsDirectHP(skill)) return []

  const bonuses = []
  const seen = new Set()
  const isSpellHeal = /^spell:/i.test(String(skill.desc || ''))

  for (const learnedId of character.skills || []) {
    const passive = getSkill(learnedId)
    const desc = String(passive?.desc || '')
    if (!desc) continue

    const careerRule = cache.careerHealBonuses?.[learnedId]
    if (careerRule?.flat && (!careerRule.spellOnly || isSpellHeal)) {
      if (!careerRule.onOthers || !skillHealTargetsSelf(skill)) {
        const key = `${learnedId}|career|${careerRule.flat}`
        if (!seen.has(key)) {
          seen.add(key)
          bonuses.push({
            value: Number(careerRule.flat),
            source: passive.name,
            sourceId: learnedId,
            conditional: false
          })
        }
      }
    }

    const amplified = desc.match(/healing spells you cast on others restore \+(\d+)\s*HP/i)
    if (amplified && isSpellHeal) {
      const key = `${learnedId}|${amplified[1]}`
      if (!seen.has(key)) {
        seen.add(key)
        bonuses.push({
          value: Number(amplified[1]),
          source: passive.name,
          sourceId: learnedId,
          conditional: false
        })
      }
    }
  }

  return bonuses
}

export function healStatKey(skill) {
  return usesMagicPowerForHeal(skill) ? 'magicPower' : null
}

export function skillHasEffectBreakdown(skill) {
  return skillDealsDirectDamage(skill) || skillHealsDirectHP(skill)
}

/** True when the skill's heal line applies to the caster (not touch-ally / stabilise-other). */
export function skillHealTargetsSelf(skill) {
  if (!skillHealsDirectHP(skill)) return false
  const desc = String(skill.desc || '')
  if (/touch ally|ally\s+within|on others|stabilise\s+(?:a\s+)?downed ally|downed ally|willing ally/i.test(desc)) {
    return false
  }
  if (/heals?\s+allies\b/i.test(desc) && !/heals?\s+(?:you|yourself|self)\b/i.test(desc)) return false
  return true
}

export function applySkillHeal(character, skill, rollDiceFn) {
  if (!character || !skill || !skillHealTargetsSelf(skill)) return null

  const breakdown = resolveHealBreakdown(character, skill, { rollDiceFn })
  if (!breakdown) return null

  const stats = computeStats(character)
  const before = character.hp
  character.hp = Math.min(stats.hp, before + breakdown.total)
  const healed = character.hp - before

  return { breakdown, healed, amount: breakdown.total }
}

export function formatHealUseSummary(breakdown, healed) {
  if (!breakdown) return ''
  const detail = formatHealBreakdownPlain(breakdown).replace(/^Healing \(yours\):\s*/, '')
  if (healed === 0 && breakdown.total > 0) {
    return `${detail} (already at full HP)`
  }
  if (healed > 0 && healed < breakdown.total) {
    return `${detail} (${healed} HP restored — at cap)`
  }
  return detail
}

export function usesMagicPowerForDamage(skill) {
  const desc = String(skill?.desc || '')
  if (/^spell:/i.test(desc)) return true
  if (/\+\s*magic\s+power/i.test(desc)) return true
  if (String(skill?.subcategory || '').toLowerCase() === 'ranged_magic') return true
  return false
}

export function usesStrengthForDamage(skill) {
  if (isBasicAttackSkill(skill)) return true
  const desc = String(skill?.desc || '')
  if (usesMagicPowerForDamage(skill)) return false
  if (/^action:/i.test(desc)) return true
  if (/\+\s*strength\b/i.test(desc)) return true
  return false
}

export function damageStatKey(skill, character = null) {
  if (isBasicAttackSkill(skill)) return basicAttackDamageStatKey()
  if (usesMagicPowerForDamage(skill)) return 'magicPower'
  if (usesStrengthForDamage(skill)) return 'strength'
  return null
}

function diceAverage(count, sides, modifier = 0) {
  return Math.round(count * (sides + 1) / 2 + modifier)
}

function parsePrimaryDice(desc) {
  const text = String(desc || '')
  const dicePattern = /(\d+)d(\d+)(?:\s*\+\s*(\d+))?/gi
  let match
  while ((match = dicePattern.exec(text))) {
    const before = text.slice(Math.max(0, match.index - 50), match.index).toLowerCase()
    if (/restore|heals?\s|healing\s+(allies|self|yourself)|recover\s/.test(before) && !/steal|drain/.test(before)) {
      continue
    }
    if (/stamina\s*\(/.test(before)) continue
    return {
      count: Number(match[1]),
      sides: Number(match[2]),
      modifier: Number(match[3] || 0),
      formula: match[0].replace(/\s+/g, '')
    }
  }
  return null
}

function inventoryEntry(character, entryUid) {
  if (!entryUid || !character?.inventory) return null
  return character.inventory.find(inv => inv.uid === entryUid) || null
}

function weaponCraftDamageBonus(character, slot = 'weapon') {
  const entry = inventoryEntry(character, character?.equipped?.[slot])
  return Number(entry?.craftBonuses?.damageBonus || 0)
}

function equippedWeaponKinds(character) {
  return new Set([
    getWeaponKind(getEquippedWeapon(character)),
    getWeaponKind(getEquippedOffhand(character))
  ].filter(Boolean))
}

function skillImpliedWeaponKinds(skill) {
  const kinds = new Set()
  const sub = String(skill?.subcategory || '').toLowerCase()
  const weaponSubs = ['sword', 'axe', 'dagger', 'polearm', 'hammer', 'staff', 'ranged', 'ranged_magic']
  if (weaponSubs.includes(sub)) kinds.add(sub === 'ranged_magic' ? 'ranged' : sub)
  const desc = String(skill?.desc || '').toLowerCase()
  if (/sword/.test(desc)) kinds.add('sword')
  if (/\baxe\b/.test(desc)) kinds.add('axe')
  if (/dagger/.test(desc)) kinds.add('dagger')
  if (/polearm|spear|glaive|halberd|lance/.test(desc)) kinds.add('polearm')
  if (/hammer|mace|maul/.test(desc)) kinds.add('hammer')
  if (/bow|crossbow|arrow|bolt/.test(desc)) kinds.add('ranged')
  if (/\b(staff|wand|rod)\b/.test(desc)) kinds.add('staff')
  return kinds
}

function attackIsRangedBasic(character, skill) {
  if (!isBasicAttackSkill(skill)) return false
  return equippedWeaponKinds(character).has('ranged')
}

function attackIsMelee(character, skill) {
  if (usesMagicPowerForDamage(skill)) return false
  if (isBasicAttackSkill(skill)) return !attackIsRangedBasic(character, skill)
  const kinds = skillImpliedWeaponKinds(skill)
  if (kinds.has('ranged') || kinds.has('ranged_magic')) return false
  return usesStrengthForDamage(skill)
}

function pushFlatBonus(list, seen, entry) {
  const key = `${entry.sourceId}|${entry.value}|${entry.conditional ? 'c' : 'f'}`
  if (seen.has(key)) return
  seen.add(key)
  list.push(entry)
}

export function collectFlatDamageBonuses(character, skill) {
  if (!character || !skill) return []
  const bonuses = []
  const seen = new Set()
  const weaponKinds = equippedWeaponKinds(character)
  const isMelee = attackIsMelee(character, skill)
  const isRangedBasic = attackIsRangedBasic(character, skill)
  const isSpell = usesMagicPowerForDamage(skill)
  const skillKinds = skillImpliedWeaponKinds(skill)

  const race = safeGetRace(character.race)
  for (const trait of race?.passiveTraits || []) {
    const meleeMatch = trait.match(/\+(\d+)\s+damage\s+with\s+melee\s+weapons/i)
    if (meleeMatch && isMelee) {
      pushFlatBonus(bonuses, seen, {
        value: Number(meleeMatch[1]),
        source: trait.split(':')[0].trim(),
        sourceId: `race_${character.race}_melee`,
        conditional: false
      })
    }
    const conditionalMatch = trait.match(/\+(\d+)\s+damage\s+against/i)
    if (conditionalMatch && (isMelee || isSpell || isBasicAttackSkill(skill))) {
      pushFlatBonus(bonuses, seen, {
        value: Number(conditionalMatch[1]),
        source: trait.split(':')[0].trim(),
        sourceId: `race_${character.race}_conditional`,
        conditional: true,
        note: 'qualifying targets only'
      })
    }
  }

  for (const learnedId of character.skills || []) {
    if (cache.careerDamageBonuses?.[learnedId]) continue
    const passive = getSkill(learnedId)
    const desc = String(passive?.desc || '')
    if (!desc) continue

    let match = desc.match(/\+(\d+)\s+damage\s+on\s+(\w+)\s+hits?/i)
    if (match) {
      const kind = match[2].toLowerCase() === 'ranged' ? 'ranged' : match[2].toLowerCase()
      const applies = weaponKinds.has(kind) || skillKinds.has(kind)
        || (kind === 'dagger' && (weaponKinds.has('dagger') || skillKinds.has('dagger')))
      if (applies && (isMelee || isRangedBasic || skillKinds.has(kind))) {
        pushFlatBonus(bonuses, seen, {
          value: Number(match[1]),
          source: passive.name,
          sourceId: learnedId,
          conditional: false
        })
      }
      continue
    }

    match = desc.match(/\+(\d+)\s+damage\s+on\s+ranged\s+weapon\s+hits?/i)
    if (match && isRangedBasic) {
      pushFlatBonus(bonuses, seen, {
        value: Number(match[1]),
        source: passive.name,
        sourceId: learnedId,
        conditional: false
      })
      continue
    }

    match = desc.match(/passive:\s*\+(\d+)\s+damage\s+on\s+melee/i)
    if (match && isMelee) {
      pushFlatBonus(bonuses, seen, {
        value: Number(match[1]),
        source: passive.name,
        sourceId: learnedId,
        conditional: /below half/i.test(desc),
        note: /below half/i.test(desc) ? 'while below half HP' : undefined
      })
    }
  }

  const careerBonuses = collectCareerFlatDamageBonuses(character, skill, {
    isMelee,
    isRanged: isRangedBasic
  })
  for (const bonus of careerBonuses) {
    pushFlatBonus(bonuses, seen, bonus)
  }

  if (isBasicAttackSkill(skill)) {
    const mainBonus = weaponCraftDamageBonus(character, 'weapon')
    if (mainBonus) {
      pushFlatBonus(bonuses, seen, {
        value: mainBonus,
        source: 'Crafted weapon',
        sourceId: 'craft_weapon',
        conditional: false
      })
    }
    const offBonus = weaponCraftDamageBonus(character, 'offhand')
    if (offBonus) {
      pushFlatBonus(bonuses, seen, {
        value: offBonus,
        source: 'Crafted off-hand',
        sourceId: 'craft_offhand',
        conditional: false
      })
    }
  }

  return bonuses
}

function rollWeaponBaseSegments(character, rollDiceFn) {
  const segments = []
  const main = getEquippedWeapon(character)
  const off = getEquippedOffhand(character)

  if (main) {
    const result = main.damage
      ? rollWeaponDamage(main.damage, rollDiceFn)
      : { total: 1, detail: '1' }
    segments.push({ label: main.name, total: result.total, detail: result.detail })
  } else {
    segments.push({ label: 'Unarmed', total: 1, detail: '1' })
  }

  if (off) {
    const result = off.damage
      ? rollWeaponDamage(off.damage, rollDiceFn)
      : { total: 1, detail: '1' }
    segments.push({ label: off.name, total: result.total, detail: result.detail })
  }

  return segments
}

export function resolveDamageBreakdown(character, skill, options = {}) {
  if (!character || !skill || !skillDealsDirectDamage(skill)) return null

  const parts = []
  let baseTotal = 0
  const rollDiceFn = options.rollDiceFn

  if (isBasicAttackSkill(skill)) {
    const segments = rollWeaponBaseSegments(character, rollDiceFn || ((count, sides, mod = 0) => ({
      total: diceAverage(count, sides, mod),
      rolls: []
    })))
    for (const segment of segments) {
      parts.push({
        kind: 'base',
        label: segment.label,
        value: segment.total,
        detail: segment.detail,
        average: !rollDiceFn
      })
      baseTotal += segment.total
    }
  } else {
    const dice = parsePrimaryDice(skill.desc)
    if (dice) {
      if (rollDiceFn) {
        const rolled = rollDiceFn(dice.count, dice.sides, dice.modifier)
        const rollText = rolled.rolls?.length
          ? `${rolled.rolls.join('+')}${dice.modifier ? `+${dice.modifier}` : ''}`
          : String(rolled.total)
        parts.push({
          kind: 'base',
          label: dice.formula,
          value: rolled.total,
          detail: rollText,
          average: false
        })
        baseTotal += rolled.total
      } else {
        const avg = diceAverage(dice.count, dice.sides, dice.modifier)
        parts.push({
          kind: 'base',
          label: dice.formula,
          value: avg,
          average: true
        })
        baseTotal += avg
      }
    }
  }

  const flatBonuses = collectFlatDamageBonuses(character, skill)
  let flatTotal = 0
  for (const bonus of flatBonuses) {
    parts.push({
      kind: 'bonus',
      label: bonus.source,
      value: bonus.value,
      conditional: bonus.conditional,
      note: bonus.note
    })
    if (!bonus.conditional) flatTotal += bonus.value
  }

  let stat = damageStatKey(skill, character)
  let statValue = 0
  if (isBasicAttackSkill(skill)) {
    stat = 'strength'
    statValue = getStatDamageContribution(character, 'strength')
  } else if (stat) {
    statValue = getStatDamageContribution(character, stat)
  }
  if (stat) {
    parts.push({
      kind: 'stat',
      label: STAT_LABEL[stat] || stat,
      value: statValue
    })
  }

  const rawTotal = baseTotal + flatTotal + statValue
  const total = Math.max(MIN_ATTACK_DAMAGE, rawTotal)

  return {
    parts,
    kind: 'damage',
    baseTotal,
    flatTotal,
    statValue,
    stat,
    rawTotal,
    total,
    minApplied: rawTotal < MIN_ATTACK_DAMAGE,
    conditionalBonuses: flatBonuses.filter(b => b.conditional)
  }
}

function formatSignedValue(value) {
  if (value < 0) return `(${value})`
  return String(value)
}

export function resolveHealBreakdown(character, skill, options = {}) {
  if (!character || !skill || !skillHealsDirectHP(skill)) return null

  const heal = parseHealAmount(skill.desc)
  if (!heal) return null

  const parts = []
  let baseTotal = 0
  const rollDiceFn = options.rollDiceFn

  if (heal.flat) {
    parts.push({ kind: 'base', label: heal.formula, value: heal.flat, average: false })
    baseTotal += heal.flat
  } else if (heal.count && heal.sides) {
    if (rollDiceFn) {
      const rolled = rollDiceFn(heal.count, heal.sides, heal.modifier)
      const rollText = rolled.rolls?.length
        ? `${rolled.rolls.join('+')}${heal.modifier ? `+${heal.modifier}` : ''}`
        : String(rolled.total)
      parts.push({
        kind: 'base',
        label: heal.formula,
        value: rolled.total,
        detail: rollText,
        average: false
      })
      baseTotal += rolled.total
    } else {
      const avg = diceAverage(heal.count, heal.sides, heal.modifier)
      parts.push({
        kind: 'base',
        label: heal.formula,
        value: avg,
        average: true
      })
      baseTotal += avg
    }
  }

  const flatBonuses = collectFlatHealBonuses(character, skill)
  let flatTotal = 0
  for (const bonus of flatBonuses) {
    parts.push({
      kind: 'bonus',
      label: bonus.source,
      value: bonus.value,
      conditional: false
    })
    flatTotal += bonus.value
  }

  const stat = healStatKey(skill)
  let statValue = 0
  if (stat) {
    statValue = getStatDamageContribution(character, stat)
    parts.push({
      kind: 'stat',
      label: STAT_LABEL[stat] || stat,
      value: statValue
    })
  }

  const rawTotal = baseTotal + flatTotal + statValue
  const total = Math.max(MIN_HEAL_AMOUNT, rawTotal)

  return {
    kind: 'heal',
    parts,
    baseTotal,
    flatTotal,
    statValue,
    stat,
    rawTotal,
    total,
    minApplied: rawTotal < MIN_HEAL_AMOUNT,
    conditionalBonuses: []
  }
}

function formatBreakdownTerms(parts) {
  const terms = []
  for (const part of parts) {
    if (part.kind === 'base') {
      if (part.detail && !part.average) {
        terms.push(`${part.detail} (${part.label})`)
      } else if (part.average) {
        terms.push(`${part.label} (avg ${part.value})`)
      } else {
        terms.push(String(part.value))
      }
      continue
    }
    if (part.kind === 'bonus') {
      if (part.conditional) {
        terms.push(`${part.label} +${part.value}${part.note ? ` (${part.note})` : ''}`)
      } else {
        terms.push(`${part.label} +${part.value}`)
      }
      continue
    }
    if (part.kind === 'stat') {
      terms.push(`${part.label} ${formatSignedValue(part.value)}`)
    }
  }
  return terms
}

export function formatHealBreakdownPlain(breakdown) {
  if (!breakdown?.parts?.length) return ''

  const terms = formatBreakdownTerms(breakdown.parts)
  let line = `Healing (yours): ${terms.join(' + ')}`
  if (breakdown.minApplied) {
    line += ` = ${breakdown.rawTotal} → min ${MIN_HEAL_AMOUNT} HP`
  } else {
    line += ` = ${breakdown.total} HP`
  }
  return line
}

export function resolveSkillEffectBreakdown(character, skill, options = {}) {
  if (skillHealsDirectHP(skill)) return resolveHealBreakdown(character, skill, options)
  if (skillDealsDirectDamage(skill)) return resolveDamageBreakdown(character, skill, options)
  return null
}

export function formatSkillEffectBreakdownPlain(breakdown) {
  if (!breakdown) return ''
  if (breakdown.kind === 'heal') return formatHealBreakdownPlain(breakdown)
  return formatDamageBreakdownPlain(breakdown)
}

export function formatDamageBreakdownPlain(breakdown) {
  if (!breakdown?.parts?.length) return ''

  const terms = formatBreakdownTerms(breakdown.parts)
  let line = `Damage (yours): ${terms.join(' + ')}`
  if (breakdown.minApplied) {
    line += ` = ${breakdown.rawTotal} → min ${MIN_ATTACK_DAMAGE}`
  } else {
    line += ` = ${breakdown.total}`
  }
  return line
}

export function formatDamageBreakdownHtml(breakdown) {
  if (!breakdown?.parts?.length) return ''
  const text = formatSkillEffectBreakdownPlain(breakdown)
  const cls = breakdown.kind === 'heal' ? 'action-bar-tip-healing' : 'action-bar-tip-damage'
  return `<div class="${cls}">${escapeHtml(text)}</div>`
}

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export function finalizeAttackDamage(character, skill, baseDamage) {
  if (isBasicAttackSkill(skill)) {
    return applyBasicAttackDamage(character, skill, baseDamage)
  }

  const flatBonuses = collectFlatDamageBonuses(character, skill)
  const flatTotal = flatBonuses
    .filter(bonus => !bonus.conditional)
    .reduce((sum, bonus) => sum + bonus.value, 0)
  const stat = damageStatKey(skill, character)
  const statValue = stat ? getStatDamageContribution(character, stat) : 0
  const rawTotal = baseDamage + flatTotal + statValue
  return {
    total: Math.max(MIN_ATTACK_DAMAGE, rawTotal),
    rawTotal,
    minApplied: rawTotal < MIN_ATTACK_DAMAGE,
    flatTotal,
    statValue,
    stat,
    flatBonuses
  }
}

export function formatDamageModifierSummary(baseSummary, finalized) {
  const extras = []
  for (const bonus of finalized.flatBonuses || []) {
    if (!bonus.conditional) extras.push(`${bonus.source} +${bonus.value}`)
  }
  if (finalized.stat) {
    const label = STAT_LABEL[finalized.stat] || finalized.stat
    extras.push(`${label} ${formatSignedValue(finalized.statValue)}`)
  }
  let summary = baseSummary
  if (extras.length) summary += ` + ${extras.join(' + ')}`
  if (finalized.minApplied) {
    summary += ` = ${finalized.rawTotal} → min ${MIN_ATTACK_DAMAGE}`
  } else if (extras.length) {
    summary += ` = ${finalized.total}`
  }
  return summary
}
