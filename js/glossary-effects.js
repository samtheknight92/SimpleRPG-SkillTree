import { effectDurationLabel } from './effects.js'
import { formatStatModifiers } from './format.js'
import { titleCase } from './utils.js'

/** Alternate names players see in skill text → canonical effect. */
export const EFFECT_ALIASES = {
  burn: ['burning', 'on fire', 'burn status'],
  poison: ['poisoned', 'toxic', 'venom'],
  acid_corrosion: ['acid', 'corrosion', 'corroded'],
  bleeding: ['bleed', 'bleeding wound'],
  critical_bleeding: ['deep bleed', 'crit bleed'],
  incapacitated: ['stunned', 'stun', 'dazed', 'daze', 'knocked out', 'ko', 'stunning'],
  immobilized: ['freeze', 'frozen', 'entangled', 'rooted', 'paralyzed', 'paralysis', 'slowed'],
  mind_controlled: ['mind control', 'mind controlled', 'dominated', 'possessed'],
  fear: ['frightened', 'afraid', 'panic', 'terrified', 'scared'],
  charm: ['charmed', 'friendly enchantment'],
  silenced: ['silence', 'muted', 'cannot speak'],
  blinded: ['blind', 'cannot see'],
  knockdown: ['prone', 'knocked down', 'on the ground'],
  stagger: ['staggered', 'off balance'],
  exhausted: ['exhaustion', 'overextended', 'tired out'],
  weakened: ['weak', 'feeble', 'slow and confused'],
  cursed: ['hexed', 'hex', 'curse'],
  regeneration: ['regen', 'regenerate', 'healing over time'],
  hp_regen: ['hp regeneration', 'health regen'],
  rapid_regeneration: ['fast regen', 'enhanced regeneration'],
  intimidate_debuff: ['intimidated'],
  intimidate: ['intimidate skill', 'intimidation'],
  suppressing_fire_debuff: ['suppressed', 'suppression'],
  dissonant_note_debuff: ['dissonant debuff'],
  dissonant_note: ['dissonant note skill'],
  burn_on_hit: ['may burn', 'burn on hit'],
  freeze_on_hit: ['may freeze', 'freeze on hit'],
  poison_on_hit: ['may poison', 'poison on hit'],
  poison_immunity: ['immune to poison'],
  fire_immunity: ['immune to fire', 'fire immune'],
  fire_resistance: ['fire resist', 'resist fire'],
  ice_resistance: ['ice resist', 'resist ice'],
  spell_warded: ['warded', 'immune to charm and fear'],
  mind_shield: ['mental shield'],
  remove_poison: ['cure poison', 'antidote'],
  rage: ['enraged', 'battle rage'],
  reckless_strike: ['reckless attack'],
  damage_reduction: ['damage reduction', 'take less damage'],
  magic_barrier: ['barrier', 'shield spell'],
  stone_skin: ['stoneskin', 'tough skin'],
  spell_absorption: ['absorb spells'],
  spell_resistance: ['spell resist']
}

/** Dictionary-only wording — game data in effects.json stays unchanged. */
export const EFFECT_DESC_OVERRIDES = {
  burn: 'Take 1 fire damage each turn for 4 turns. While burning, Strength is 2 lower.',
  poison: 'Poison damage each turn for 3 turns: 1, then 2, then 3.',
  acid_corrosion: 'Acid weakens armour each turn: Physical Defence goes down by 1 per turn for 5 turns. Usually no direct HP loss unless the GM adds it.',
  bleeding: 'A nasty cut: lose 1 HP at the start of each turn for 3 turns. First aid or bandaging can end it early.',
  critical_bleeding: 'A deep cut from a critical hit: lose 2 HP at the start of each turn for 3 turns.',
  incapacitated: 'You cannot take actions this round — stunned, dazed, knocked out, or similar.',
  immobilized: 'You cannot move, but you can still attack or cast if the rules allow. Covers freeze, roots, and stuck-in-place effects.',
  mind_controlled: 'Someone else is steering your choices. Fear makes you move away; charm makes you unwilling to hurt the charmer.',
  fear: 'You must move away and cannot willingly move closer. While facing what scared you, roll twice on attacks and keep the lower roll.',
  charm: 'You cannot attack whoever charmed you and may treat them as a friend until they hurt you or the effect ends.',
  silenced: 'You cannot use spells, shouts, or commands that need your voice.',
  blinded: 'You cannot see. Attacks and checks that need sight are much harder (Accuracy −3).',
  knockdown: 'You are on the ground for 1 turn: Accuracy −2 and you cannot move until you stand up (uses your action).',
  stagger: 'You are wobbly: Accuracy −2 and you cannot use reactions until the end of your next turn.',
  exhausted: 'You are worn out: all stats −1 and you cannot cast spells while exhausted.',
  weakened: 'You feel slow and muddled: Strength, Speed, Magic Power, and Accuracy are each 2 lower.',
  cursed: 'A hex: Accuracy −2 and Magic Power −1 for 8 turns. Stamina abilities cost 1 extra Stamina while cursed.',
  intimidate_debuff: 'Shaken up: Accuracy −1 for 1 round.',
  suppressing_fire_debuff: 'Pinned down: −1 to attacks or movement for 1 round.',
  dissonant_note_debuff: 'Distracting noise: enemies in range have Accuracy −1 per performing Musician (saves also −1 per helper joining the song).',
  regeneration: 'Heal 2 HP each turn for 5 turns. Also helps shrug off poison and disease while active.',
  hp_regen: 'Heal a little HP each turn while this lasts.',
  rapid_regeneration: 'Heal more HP each turn than normal regeneration.',
  auto_healing: 'Your body mends itself a little each turn automatically.',
  stamina_regen: 'Recover Stamina faster while this lasts.',
  mana_regeneration: 'Recover spell energy over time — ask the GM how much each turn.',
  mana_focus: 'Your next spell or magical attack hits a little harder or heals a little more.',
  poison_immunity: 'Poison damage and the Poison status cannot affect you.',
  poison_resistance: 'Poison damage is halved. You cannot gain new Poison stacks while this lasts (existing Poison still ticks).',
  fire_resistance: 'Fire damage is halved (50% resist — divide by 2).',
  ice_resistance: 'Ice damage is quartered (25% resist — divide by 4) or halved depending on the source — read the skill.',
  fire_weakness: 'Fire damage is doubled (200% weak — multiply by 2).',
  ice_weakness: 'Ice damage is doubled unless your sheet says otherwise.',
  spell_warded: 'You are protected from charm and fear effects.',
  mind_shield: 'Extra protection against mind-affecting magic.',
  protected: 'You take less damage from the next hits — track how much is left with the GM.',
  damage_reduction: 'Incoming damage is reduced by a flat amount or a step on the table — read the source.',
  burn_on_hit: 'When you hit with this weapon, there is a 40% chance (tier 3+) to apply Burn for 4 turns.',
  freeze_on_hit: 'When you hit, you may freeze the target in place (Immobilized) — read the item tier.',
  poison_on_hit: 'When you hit, there is a 40% chance (tier 3+) to apply Poison.',
  stunning: 'On hit, 40% chance (tier 3+) to leave the target unable to act for 1 turn (Incapacitated) if they fail a save.',
  intimidate: 'Nearby foes must save or suffer Accuracy −1 for 1 round. More Berserkers helping means more −1 stacks.',
  rage: '+2 Strength and −1 Magical Defence for 3 rounds — once per combat.',
  reckless_strike: 'Your next attack deals +2 damage, but your Physical Defence is −2 until your next turn.',
  remove_poison: 'Cleanses Poison and poison damage-over-time immediately.'
}

/** One-line read-aloud summary for kids and casual tables. */
export const EFFECT_TABLE_HINTS = {
  burn: 'At the table: “You’re on fire — 1 damage each turn and you’re weaker until it fades.”',
  poison: 'At the table: “The poison gets worse — 1, then 2, then 3 damage on Process Turn.”',
  acid_corrosion: 'At the table: “Your armour is melting — subtract 1 Physical Defence each turn.”',
  bleeding: 'At the table: “You’re bleeding — lose 1 HP when the turn ticks; bandage to stop.”',
  critical_bleeding: 'At the table: “Bad cut — 2 HP each turn until healed or time runs out.”',
  incapacitated: 'At the table: “You sit out your turn — no actions until it wears off.”',
  immobilized: 'At the table: “Your feet are stuck — you can still swing or cast if allowed.”',
  mind_controlled: 'At the table: “The GM tells you what your character does or feels until you shake it off.”',
  fear: 'At the table: “Back away! Attacks while scared use the worse of two d20 rolls.”',
  charm: 'At the table: “You won’t hurt your friend who charmed you until something breaks the spell.”',
  silenced: 'At the table: “No yelling spells — mouth magic and commands are off.”',
  blinded: 'At the table: “Cover your eyes — anything needing sight is much harder.”',
  knockdown: 'At the table: “You’re on the floor — stand up to move again.”',
  stagger: 'At the table: “You’re wobbly — harder to hit and no reactions for a bit.”',
  exhausted: 'At the table: “Too tired to cast — rest when you can.”',
  weakened: 'At the table: “Everything feels harder — subtract 2 from the big stats.”',
  cursed: 'At the table: “Bad luck magic — weaker hits and spells cost extra Stamina.”',
  intimidate_debuff: 'At the table: “They stared you down — −1 to hit this round.”',
  suppressing_fire_debuff: 'At the table: “Keep your head down — −1 to hit or move.”',
  regeneration: 'At the table: “You glow a little — +2 HP each Process Turn.”',
  hp_regen: 'At the table: “Slow healing — tick HP up each turn.”',
  poison_immunity: 'At the table: “Poison slides off — no poison damage or Poison status.”',
  fire_resistance: 'At the table: “Flames hurt half as much.”',
  fire_weakness: 'At the table: “Fire hits you twice as hard — watch out for torches and dragons.”',
  burn_on_hit: 'At the table: “If the hit lands, roll to see if they catch fire.”',
  freeze_on_hit: 'At the table: “If the hit lands, they might be stuck in place.”',
  poison_on_hit: 'At the table: “If the hit lands, they might get Poison.”'
}

const DICTIONARY_EFFECT_TYPES = new Set([
  'control',
  'debuff',
  'damageOverTime',
  'damage',
  'heal',
  'healOverTime',
  'recovery',
  'statDebuff',
  'statBuff',
  'vulnerability',
  'movement',
  'buff',
  'protection'
])

const FAMILY_TYPE_LABELS = {
  control: 'Hard to act normally',
  debuff: 'Penalty',
  damageOverTime: 'Ongoing harm',
  damage: 'Instant harm',
  heal: 'Healing',
  healOverTime: 'Healing over time',
  recovery: 'Recovery',
  statDebuff: 'Stats lowered',
  statBuff: 'Stats raised',
  vulnerability: 'Takes extra damage',
  movement: 'Movement bonus',
  buff: 'Helpful effect',
  protection: 'Protection'
}

/** Skill/gear effects worth listing even when not in the GM manual dropdown. */
export const EXTRA_EFFECT_IDS = [
  'intimidate',
  'stunning',
  'burn_on_hit',
  'freeze_on_hit',
  'poison_on_hit',
  'critical_bleeding',
  'rage',
  'reckless_strike',
  'remove_poison',
  'burn_aura',
  'shield_wall_buff',
  'empower_ally_buff',
  'dissonant_note'
]

function categoryForEffect(effect) {
  const type = String(effect?.type || '').toLowerCase()
  if (type === 'protection' || type === 'vulnerability') return 'Resists & immunities'
  if (['heal', 'healovertime', 'recovery', 'statbuff', 'buff', 'movement'].includes(type)) {
    return 'Buffs & recovery'
  }
  if (/_on_hit$/.test(effect.id) || ['stunning', 'intimidate', 'dissonant_note', 'reckless_strike'].includes(effect.id)) {
    return 'On-hit & bonus effects'
  }
  return 'Status & conditions'
}

function familyTypeLabel(type) {
  return FAMILY_TYPE_LABELS[String(type || '').toLowerCase()] || 'Effect'
}

function sanitizeDesc(text) {
  return String(text || '')
    .replace(/\bdisadvantage\b/gi, 'roll twice and keep the lower roll')
    .replace(/\badvantage\b/gi, 'roll twice and keep the higher roll')
    .replace(/\bDoT\b/g, 'damage each turn')
    .replace(/\bproc\b/gi, 'bonus effect')
    .replace(/\bDC\b/g, 'target number')
    .replace(/\bpenalised\b/gi, 'harder')
    .replace(/\bpenalized\b/gi, 'harder')
    .replace(/\bHP\b/g, 'health')
    .trim()
}

function dictionaryDesc(effect) {
  const override = EFFECT_DESC_OVERRIDES[effect.id]
  if (override) return override
  return sanitizeDesc(effect.desc)
}

function summaryFromDesc(desc, maxLen = 120) {
  const text = String(desc || '').trim()
  if (!text) return 'See full entry.'
  const first = text.split(/[.!?]/)[0]?.trim()
  const line = first || text
  return line.length <= maxLen ? line : `${line.slice(0, maxLen - 1)}…`
}

function formatEffectDetail(effect) {
  const lines = [dictionaryDesc(effect)]

  const durationLine = effectDurationLabel(effect.duration)
  lines.push('', `Kind: ${familyTypeLabel(effect.type)} · Usually lasts: ${durationLine}`)

  if (effect.statModifiers && Object.keys(effect.statModifiers).length) {
    lines.push(`While active: ${formatStatModifiers(effect.statModifiers)}`)
  }
  if (effect.tickHeal) lines.push(`Heals ${effect.tickHeal} health each turn when you press Process Turn.`)
  if (effect.flatDamageBonus) lines.push(`Bonus damage: +${effect.flatDamageBonus} while active.`)
  if (effect.stackable) lines.push('Can stack: yes — the GM tracks multiple copies if needed.')
  if (effect.immunities?.length) {
    lines.push(`Blocks: ${effect.immunities.map(id => titleCase(String(id).replace(/_/g, ' '))).join(', ')}`)
  }

  const tableHint = EFFECT_TABLE_HINTS[effect.id]
  if (tableHint) lines.push('', tableHint)

  const aliases = EFFECT_ALIASES[effect.id]
  if (aliases?.length) {
    lines.push('', `Also called: ${aliases.join(', ')}`)
  }

  lines.push('', 'On your sheet: Character tab → Effects, or from skills and gear.')
  return lines.join('\n')
}

function shouldIncludeEffect(effect) {
  if (!effect?.id || !effect.name) return false
  if (effect.manual && DICTIONARY_EFFECT_TYPES.has(effect.type)) return true
  if (EXTRA_EFFECT_IDS.includes(effect.id)) return true
  return false
}

export function buildEffectGlossaryEntries(effectDefinitions = {}) {
  const effects = Object.values(effectDefinitions || {})
    .filter(shouldIncludeEffect)
    .sort((a, b) => a.name.localeCompare(b.name))

  return effects.map(effect => {
    const desc = dictionaryDesc(effect)
    return {
      id: `effect-${effect.id}`,
      term: `${effect.icon ? `${effect.icon} ` : ''}${effect.name}`.trim(),
      aliases: EFFECT_ALIASES[effect.id] || [],
      category: categoryForEffect(effect),
      summary: summaryFromDesc(desc),
      detail: formatEffectDetail(effect),
      effectId: effect.id
    }
  })
}
