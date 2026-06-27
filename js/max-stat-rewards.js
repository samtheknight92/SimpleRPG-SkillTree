import { DEFAULT_STATS, STAT_RULES } from './constants.js'

/** Base stats that can unlock a hidden reward at cap (not HP / Stamina). */
export const MAX_STAT_REWARD_STAT_KEYS = [
  'strength',
  'magicPower',
  'accuracy',
  'speed',
  'physicalDefence',
  'magicalDefence'
]

export const MAX_STAT_REWARDS = [
  {
    statKey: 'strength',
    id: 'max_stat_super_strength',
    name: 'Super Strength',
    icon: '💪',
    desc: 'You lift and break things that should not move. At the table: succeed on Strength checks and Strength saves without rolling unless the GM says the task is truly impossible.'
  },
  {
    statKey: 'magicPower',
    id: 'max_stat_arcane_surge',
    name: 'Arcane Surge',
    icon: '✨',
    desc: 'Your spells hit like a storm when you push them. At the table: once per encounter, when a spell or magical action adds Magic Power to damage or healing, add your Magic Power twice instead of once.'
  },
  {
    statKey: 'accuracy',
    id: 'max_stat_unerring_aim',
    name: 'Unerring Aim',
    icon: '🎯',
    desc: 'Your worst shots still graze the mark. At the table: if an attack roll misses, you still deal half total damage (round down). On a natural 1, you deal basic attack damage only — no Accuracy, stat, or other bonuses.'
  },
  {
    statKey: 'speed',
    id: 'max_stat_afterimage',
    name: 'Afterimage',
    icon: '⚡',
    desc: 'You slip through the fight untouched. At the table: your movement never provokes opportunity attacks; you always win initiative ties against equal or lower Speed.'
  },
  {
    statKey: 'physicalDefence',
    id: 'max_stat_iron_skin',
    name: 'Iron Skin',
    icon: '🛡️',
    desc: 'Blades glance off you. At the table: physical critical hits against you count as normal hits with no crit bonus.'
  },
  {
    statKey: 'magicalDefence',
    id: 'max_stat_spell_turn',
    name: 'Spell Turn',
    icon: '🔮',
    desc: 'Magic bends away at the last second. At the table: when you fail a save against a spell or magical effect, treat it as a success instead.'
  }
]

export function getMaxStatReward(statKey) {
  return MAX_STAT_REWARDS.find(row => row.statKey === statKey) || null
}

export function registerMaxStatRewardEffects(effectDefinitions = {}) {
  for (const reward of MAX_STAT_REWARDS) {
    effectDefinitions[reward.id] = {
      id: reward.id,
      name: reward.name,
      icon: reward.icon,
      type: 'passive',
      duration: 0,
      desc: reward.desc
    }
  }
  return effectDefinitions
}

/** True when the character's purchased stat (Stats tab) is at the rules cap. */
export function isBaseStatAtMax(character, statKey) {
  const rule = STAT_RULES[statKey]
  if (!rule || !character) return false
  const base = Number(character.stats?.[statKey] ?? DEFAULT_STATS[statKey] ?? 0)
  return base >= rule.max
}

export function activeMaxStatRewards(character) {
  if (!character) return []
  return MAX_STAT_REWARDS.filter(reward => isBaseStatAtMax(character, reward.statKey))
}

export function maxStatRewardSourceLabel(statKey) {
  const label = STAT_RULES[statKey]?.label || statKey
  return `Max ${label} (hidden reward)`
}

/** Term Dictionary entries — keep in sync with MAX_STAT_REWARDS. */
export function buildMaxStatGlossaryEntries() {
  const capLines = [
    `HP: ${STAT_RULES.hp?.max ?? 1000}`,
    `Stamina: ${STAT_RULES.stamina?.max ?? 1000}`,
    ...MAX_STAT_REWARD_STAT_KEYS.map(key => {
      const rule = STAT_RULES[key]
      return `${rule?.label || key}: ${rule?.max ?? '?'}`
    })
  ]

  const overview = {
    id: 'max-stat-reward',
    term: 'Max stat hidden reward',
    aliases: [
      'hidden reward',
      'hidden skill',
      'max stat skill',
      'super strength',
      'unerring aim',
      'afterimage',
      'iron skin',
      'spell turn',
      'arcane surge'
    ],
    category: 'Core stats',
    summary: 'Secret passive when a core stat hits its upgrade cap — shows under Skill & Gear Effects.',
    detail: [
      'Max your purchased stat on the Stats tab (not HP or Stamina) and a hidden reward appears on the Character tab under Skill & Gear Effects. It is not a learnable skill — no Lumen cost, not on the Skills tab.',
      'Refund below the cap and it goes away. GM Mode still respects caps unless you edit stats manually.',
      '',
      'Current upgrade caps:',
      ...capLines.map(line => `· ${line}`),
      '',
      'Rewards: Super Strength · Arcane Surge · Unerring Aim · Afterimage · Iron Skin · Spell Turn — search those names in this dictionary for details.'
    ].join('\n')
  }

  const capEntry = {
    id: 'stat-cap',
    term: 'Stat cap (upgrade maximum)',
    aliases: ['stat maximum', 'max stat', 'cap', 'stat limit'],
    category: 'Core stats',
    summary: 'Highest value you can buy with Lumens on the Stats tab.',
    detail: [
      'Each stat has a ceiling for Lumens upgrades. The Stats tab blocks further upgrades at the cap; hover a stat upgrade card to see “Already at maximum.”',
      '',
      'Caps:',
      ...capLines.map(line => `· ${line}`),
      '',
      'Gear, race, skills, and effects can push your total higher than the purchased value — caps only limit what you buy with Lumens.',
      '',
      'At the table: “You can’t buy past the cap — but loot and buffs still stack on top.”'
    ].join('\n')
  }

  const rewards = MAX_STAT_REWARDS.map(reward => {
    const label = STAT_RULES[reward.statKey]?.label || reward.statKey
    const cap = STAT_RULES[reward.statKey]?.max
    return {
      id: `max-stat-${reward.statKey}`,
      term: reward.name,
      aliases: [
        `max ${label.toLowerCase()}`,
        `max ${reward.statKey}`,
        reward.id.replace(/^max_stat_/, '').replace(/_/g, ' ')
      ],
      category: 'Core stats',
      summary: `Hidden reward at ${label} cap (${cap}).`,
      detail: [
        reward.desc,
        '',
        `Unlocks when purchased ${label} reaches ${cap} on the Stats tab. Appears under Skill & Gear Effects with source “Max ${label} (hidden reward).”`
      ].join('\n')
    }
  })

  return [capEntry, overview, ...rewards]
}
