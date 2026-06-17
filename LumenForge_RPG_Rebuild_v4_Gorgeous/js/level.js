import { DEFAULT_STATS } from './constants.js'
import { getSkill } from './cache.js'

/** Tier 5 skill = exactly 1 level; tier N contributes N ÷ 5. */
export function tierLevelValue(tier) {
  return Number(tier || 1) / 5
}

/** HP & Stamina upgrades count as tier 1; all other stats as tier 2. */
export function statLevelValue(statKey) {
  return statKey === 'hp' || statKey === 'stamina' ? tierLevelValue(1) : tierLevelValue(2)
}

export function formatLevelValue(total) {
  const value = Math.round(Number(total || 0) * 10) / 10
  return Number.isInteger(value) ? String(value) : value.toFixed(1)
}

export function characterLevelInfo(character) {
  if (!character) {
    return {
      skillCount: 0,
      skillLevels: 0,
      statLevels: 0,
      hpStaminaUpgrades: 0,
      otherStatUpgrades: 0,
      total: 0,
      level: 0,
      fraction: 0,
      pct: 0,
      display: '0'
    }
  }

  let skillCount = 0
  let skillLevels = 0
  for (const id of character.skills || []) {
    const skill = getSkill(id)
    if (!skill) continue
    skillCount += 1
    skillLevels += tierLevelValue(skill.tier)
  }

  let statLevels = 0
  let hpStaminaUpgrades = 0
  let otherStatUpgrades = 0
  for (const [stat, base] of Object.entries(DEFAULT_STATS)) {
    const purchases = Math.max(0, Number(character.stats?.[stat] ?? base) - base)
    if (!purchases) continue
    if (stat === 'hp' || stat === 'stamina') hpStaminaUpgrades += purchases
    else otherStatUpgrades += purchases
    statLevels += purchases * statLevelValue(stat)
  }

  const total = skillLevels + statLevels
  const level = Math.floor(total)
  const fraction = total - level

  return {
    skillCount,
    skillLevels,
    statLevels,
    hpStaminaUpgrades,
    otherStatUpgrades,
    total,
    level,
    fraction,
    pct: Math.round(fraction * 100),
    display: String(level)
  }
}

export function levelTooltip(info) {
  return [
    `Level ${info.level}`,
    info.fraction > 0 ? `${info.pct}% toward Level ${info.level + 1}` : 'Whole level reached',
    '',
    'No level curve — contributions add directly:',
    '· Tier 5 skill = +1 level (tier N = N ÷ 5)',
    '· HP / Stamina upgrade = tier 1 (+0.2)',
    '· Other stat upgrade = tier 2 (+0.4)',
    '',
    `Skills: +${formatLevelValue(info.skillLevels)} (${info.skillCount} learned)`,
    `Stats: +${formatLevelValue(info.statLevels)} (${info.hpStaminaUpgrades} HP/STA, ${info.otherStatUpgrades} other)`,
    '',
    `Progress total: ${formatLevelValue(info.total)}`
  ].join('\n')
}
