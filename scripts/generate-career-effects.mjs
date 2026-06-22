#!/usr/bin/env node
/**
 * Generates career effect definitions and merges into effects.json.
 * Run: node scripts/generate-career-effects.mjs
 */
import fs from 'fs'
import path from 'path'
import vm from 'vm'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')
const dataDir = path.join(root, 'data')
const jsonDir = path.join(dataDir, 'json')

function loadCareerSkills() {
  const code = fs.readFileSync(path.join(dataDir, 'careers-skills-data.js'), 'utf8')
  const sandbox = {}
  vm.createContext(sandbox)
  vm.runInContext(`${code}\n;globalThis.__careerSkills = CAREERS_SKILLS_DATA`, sandbox)
  const skills = []
  for (const list of Object.values(sandbox.__careerSkills || {})) {
    if (Array.isArray(list)) skills.push(...list)
  }
  const fusionCode = fs.readFileSync(path.join(dataDir, 'career-fusions-skills-data.js'), 'utf8')
  const fusionSandbox = {}
  vm.createContext(fusionSandbox)
  vm.runInContext(`${fusionCode}\n;globalThis.__fusionSkills = (typeof CAREER_FUSIONS_DATA !== 'undefined' ? CAREER_FUSIONS_DATA : CAREER_FUSION_DATA)`, fusionSandbox)
  for (const list of Object.values(fusionSandbox.__fusionSkills || {})) {
    if (Array.isArray(list)) skills.push(...list)
  }
  return skills
}

function stripPrefix(desc) {
  return String(desc || '').replace(/^(?:Passive|Action|Craft|Spell|Toggle):\s*/i, '').trim()
}

function inferEffectType(desc) {
  const text = String(desc || '')
  if (/^passive:/i.test(text)) return 'passive'
  if (/restore\s+\d+d\d+|heals?\s+\d+d\d+|stabilise|stabilize/i.test(text)) return 'heal'
  if (/\+\s*(\d+)\s+stamina/i.test(text)) return 'buff'
  if (/−\d+\s+accuracy|suffer\s+−\d+/i.test(text)) return 'debuff'
  if (/\+\s*(\d+)\s+(strength|physical defence|magical defence|speed|accuracy)/i.test(text)) return 'buff'
  if (/^craft:/i.test(text)) return 'utility'
  if (/^action:/i.test(text)) return 'utility'
  return 'utility'
}

function parseStatModifiers(desc) {
  const mods = {}
  const text = String(desc || '')
  const patterns = [
    [/\+\s*(\d+)\s+strength\b/i, 'strength'],
    [/\+\s*(\d+)\s+speed\b/i, 'speed'],
    [/\+\s*(\d+)\s+accuracy\b/i, 'accuracy'],
    [/\+\s*(\d+)\s+magic(?:al)?\s+power\b/i, 'magicPower'],
    [/\+\s*(\d+)\s+physical\s+defence\b/i, 'physicalDefence'],
    [/\+\s*(\d+)\s+magical\s+defence\b/i, 'magicalDefence'],
    [/−\s*(\d+)\s+physical\s+defence\b/i, 'physicalDefence', -1],
    [/−\s*(\d+)\s+magical\s+defence\b/i, 'magicalDefence', -1],
    [/−\s*(\d+)\s+accuracy\b/i, 'accuracy', -1]
  ]
  for (const row of patterns) {
    const [re, key, sign = 1] = row
    const match = text.match(re)
    if (match) mods[key] = (mods[key] || 0) + sign * Number(match[1])
  }
  const dual = text.match(/\+\s*(\d+)\s+physical\s+defence\s+and\s+\+\s*(\d+)\s+magical\s+defence/i)
  if (dual) {
    mods.physicalDefence = Number(dual[1])
    mods.magicalDefence = Number(dual[2])
  }
  return Object.keys(mods).length ? mods : undefined
}

function parseDuration(desc, fallback = 0) {
  const roundMatch = String(desc || '').match(/(\d+)\s*rounds?/i)
  if (roundMatch) return Number(roundMatch[1])
  const turnMatch = String(desc || '').match(/(\d+)\s*turns?/i)
  if (turnMatch) return Number(turnMatch[1])
  const hourMatch = String(desc || '').match(/(\d+)\s*hours?/i)
  if (hourMatch) return Number(hourMatch[1]) >= 8 ? 999 : Number(hourMatch[1]) * 10
  return fallback
}

function buildCareerEffect(skill) {
  const desc = stripPrefix(skill.desc)
  const type = inferEffectType(skill.desc)
  const statModifiers = parseStatModifiers(skill.desc)
  const effect = {
    id: skill.id,
    name: skill.name,
    icon: skill.icon || '✦',
    type,
    duration: type === 'passive' ? 0 : parseDuration(skill.desc, type === 'buff' || type === 'debuff' ? 3 : 0),
    potency: 0,
    desc,
    stackable: false,
    manual: type === 'utility'
  }
  if (statModifiers) effect.statModifiers = statModifiers
  if (/below half hp|bloodied/i.test(skill.desc)) effect.condition = 'belowHalfHp'
  if (/melee/i.test(skill.desc)) effect.attackScope = 'melee'
  if (/ranged/i.test(skill.desc)) effect.attackScope = 'ranged'
  const dmg = skill.desc.match(/\+(\d+)\s+damage/i)
  if (dmg) effect.flatDamageBonus = Number(dmg[1])
  const stam = skill.desc.match(/regain\s+(\d+)\s+stamina/i)
  if (stam) effect.onKillStamina = Number(stam[1])
  return effect
}

const BUFF_EFFECTS = {
  career_rage_buff: {
    id: 'career_rage_buff',
    name: 'Career Rage',
    icon: '🔥',
    type: 'buff',
    duration: 3,
    potency: 0,
    desc: '+2 Strength, −1 Magical Defence for 3 rounds (Berserker Rage action).',
    stackable: false,
    statModifiers: { strength: 2, magicalDefence: -1 },
    manual: false
  },
  reckless_strike_buff: {
    id: 'reckless_strike_buff',
    name: 'Reckless Strike',
    icon: '💥',
    type: 'buff',
    duration: 2,
    potency: 0,
    desc: 'Your next attack gains +2 damage; you suffer −2 Physical Defence until your next turn.',
    stackable: false,
    statModifiers: { physicalDefence: -2 },
    flatDamageBonus: 2,
    manual: false
  },
  sacred_stance_buff: {
    id: 'sacred_stance_buff',
    name: 'Sacred Stance',
    icon: '🛐',
    type: 'buff',
    duration: 2,
    potency: 0,
    desc: '+2 Physical Defence and +2 Magical Defence; you cannot move.',
    stackable: false,
    statModifiers: { physicalDefence: 2, magicalDefence: 2 },
    manual: false
  },
  lay_blessing_buff: {
    id: 'lay_blessing_buff',
    name: 'Lay Blessing',
    icon: '✝️',
    type: 'buff',
    duration: 999,
    potency: 0,
    desc: '+1 Magical Defence for 8 hours.',
    stackable: false,
    statModifiers: { magicalDefence: 1 },
    manual: false
  },
  ward_circle_buff: {
    id: 'ward_circle_buff',
    name: 'Ward Circle',
    icon: '⭕',
    type: 'aura',
    duration: 3,
    potency: 0,
    desc: '10ft aura — allies gain +1 Magical Defence.',
    stackable: false,
    statModifiers: { magicalDefence: 1 },
    manual: false
  },
  hearty_rations_buff: {
    id: 'hearty_rations_buff',
    name: 'Hearty Rations',
    icon: '🥘',
    type: 'buff',
    duration: 10,
    potency: 0,
    desc: '+2 Stamina after eating travel food.',
    stackable: false,
    statModifiers: { stamina: 2 },
    manual: false
  },
  banquet_planner_buff: {
    id: 'banquet_planner_buff',
    name: 'Banquet Feast',
    icon: '🎉',
    type: 'buff',
    duration: 20,
    potency: 0,
    desc: 'Shared feast buff: +1 Accuracy.',
    stackable: false,
    statModifiers: { accuracy: 1 },
    manual: false
  },
  battle_breakfast_pd_buff: {
    id: 'battle_breakfast_pd_buff',
    name: 'Battle Breakfast (Defence)',
    icon: '🥞',
    type: 'buff',
    duration: 999,
    potency: 0,
    desc: '+1 Physical Defence for the first combat only.',
    stackable: false,
    statModifiers: { physicalDefence: 1 },
    manual: false
  },
  battle_breakfast_init_buff: {
    id: 'battle_breakfast_init_buff',
    name: 'Battle Breakfast (Initiative)',
    icon: '🥞',
    type: 'buff',
    duration: 999,
    potency: 0,
    desc: '+2 to initiative for the first combat only.',
    stackable: false,
    statModifiers: { speed: 2 },
    manual: false
  },
  empower_ally_buff: {
    id: 'empower_ally_buff',
    name: 'Empowered',
    icon: '✨',
    type: 'buff',
    duration: 1,
    potency: 0,
    desc: 'Next spell or magical attack +1d4 damage or +2 HP on heal.',
    stackable: false,
    flatHealBonus: 2,
    flatDamageBonus: 2,
    manual: false
  },
  shield_wall_buff: {
    id: 'shield_wall_buff',
    name: 'Shield Wall',
    icon: '🛡️',
    type: 'buff',
    duration: 1,
    potency: 0,
    desc: 'Adjacent ally gains +1 Physical Defence until your next turn.',
    stackable: false,
    statModifiers: { physicalDefence: 1 },
    manual: false
  },
  intimidate_debuff: {
    id: 'intimidate_debuff',
    name: 'Intimidated',
    icon: '😠',
    type: 'debuff',
    duration: 1,
    potency: 0,
    desc: '−1 Accuracy for 1 round.',
    stackable: false,
    statModifiers: { accuracy: -1 },
    manual: true
  },
  suppressing_fire_debuff: {
    id: 'suppressing_fire_debuff',
    name: 'Suppressed',
    icon: '🔫',
    type: 'debuff',
    duration: 1,
    potency: 0,
    desc: '−1 to attacks or movement for 1 round.',
    stackable: false,
    statModifiers: { accuracy: -1, speed: -1 },
    manual: true
  },
  dirty_trick_buff: {
    id: 'dirty_trick_buff',
    name: 'Dirty Trick Setup',
    icon: '🎭',
    type: 'buff',
    duration: 1,
    potency: 0,
    desc: 'One ally gains +2 on their next attack against the distracted target.',
    stackable: false,
    statModifiers: { accuracy: 2 },
    manual: false
  },
  volley_call_buff: {
    id: 'volley_call_buff',
    name: 'Volley Called',
    icon: '📣',
    type: 'buff',
    duration: 1,
    potency: 0,
    desc: '+1 on next attack against the called target.',
    stackable: false,
    statModifiers: { accuracy: 1 },
    manual: false
  },
  called_shot_buff: {
    id: 'called_shot_buff',
    name: 'Called Shot',
    icon: '🎯',
    type: 'buff',
    duration: 1,
    potency: 0,
    desc: '−2 to hit; on hit, +1d6 damage.',
    stackable: false,
    statModifiers: { accuracy: -2 },
    flatDamageBonus: 3,
    manual: false
  },
  field_fit_buff: {
    id: 'field_fit_buff',
    name: 'Field Fit',
    icon: '🔧',
    type: 'buff',
    duration: 1,
    potency: 0,
    desc: '+1 on first attack roll or +1 Physical Defence for the first round.',
    stackable: false,
    statModifiers: { physicalDefence: 1, accuracy: 1 },
    manual: false
  },
  second_wind_heal: {
    id: 'second_wind_heal',
    name: 'Second Wind',
    icon: '💨',
    type: 'heal',
    duration: 0,
    potency: 0,
    desc: 'Restore 1d6 HP (once per short rest).',
    stackable: false,
    healFormula: '1d6',
    manual: false
  },
  lay_on_hands_heal: {
    id: 'lay_on_hands_heal',
    name: 'Lay on Hands',
    icon: '🤲',
    type: 'heal',
    duration: 0,
    potency: 0,
    desc: 'Touch ally — restore 1d6+1 HP.',
    stackable: false,
    healFormula: '1d6+1',
    manual: false
  },
  clean_bandage_heal: {
    id: 'clean_bandage_heal',
    name: 'Clean Bandage',
    icon: '🩹',
    type: 'heal',
    duration: 0,
    potency: 0,
    desc: 'Stabilise downed ally and restore 1 HP.',
    stackable: false,
    healFormula: '1',
    manual: false
  },
  fusion_field_spark_heal: {
    id: 'fusion_field_spark_heal',
    name: 'Field Spark',
    icon: '⚡💊',
    type: 'heal',
    duration: 0,
    potency: 0,
    desc: 'Stabilise downed ally — restore 1 HP and remove Stunned.',
    stackable: false,
    healFormula: '1',
    manual: false
  },
  work_song_buff: {
    id: 'work_song_buff',
    name: 'Work Song',
    icon: '⛏️',
    type: 'aura',
    duration: 3,
    potency: 0,
    desc: 'Allies in hearing range +1 Strength per performing Musician (+1 Physical Defence per harmony joiner).',
    stackable: false,
    statModifiers: { strength: 1 },
    manual: true
  },
  marching_tune_buff: {
    id: 'marching_tune_buff',
    name: 'Marching Tune',
    icon: '🥁',
    type: 'aura',
    duration: 2,
    potency: 0,
    desc: 'Allies in hearing range +1 Speed per performing Musician (+1 initiative per harmony joiner).',
    stackable: false,
    statModifiers: { speed: 1 },
    manual: true
  },
  soothing_hymn_buff: {
    id: 'soothing_hymn_buff',
    name: 'Soothing Hymn',
    icon: '🕊️',
    type: 'aura',
    duration: 2,
    potency: 0,
    desc: 'Allies in hearing range +1 Magical Defence per performing Musician (+1 Stamina at turn start per harmony joiner).',
    stackable: false,
    statModifiers: { magicalDefence: 1 },
    manual: true
  },
  battle_anthem_buff: {
    id: 'battle_anthem_buff',
    name: 'Battle Anthem',
    icon: '🎺',
    type: 'aura',
    duration: 3,
    potency: 0,
    desc: 'Allies in hearing range +1 accuracy per performing Musician (+1 damage on next hit per harmony joiner).',
    stackable: false,
    statModifiers: { accuracy: 1 },
    manual: true
  },
  dissonant_note_debuff: {
    id: 'dissonant_note_debuff',
    name: 'Dissonant Note',
    icon: '🎸',
    type: 'debuff',
    duration: 1,
    potency: 0,
    desc: 'Enemies in hearing range −1 accuracy per performing Musician (−1 on saves per harmony joiner).',
    stackable: false,
    statModifiers: { accuracy: -1 },
    manual: true
  },
  long_set: {
    id: 'long_set',
    name: 'Long Set',
    icon: '🎭',
    type: 'passive',
    duration: 0,
    potency: 0,
    desc: 'Your sustained songs may last 1 extra turn.',
    stackable: false,
    manual: false
  },
  encore: {
    id: 'encore',
    name: 'Encore',
    icon: '🎤',
    type: 'passive',
    duration: 0,
    potency: 0,
    desc: 'Once per combat, replay a song you already used this fight for free — base sustain length only (no Long Set, instrument, or other bonus turns).',
    stackable: false,
    manual: false
  }
}

const skills = loadCareerSkills()
const effectsPath = path.join(jsonDir, 'effects.json')
const effects = JSON.parse(fs.readFileSync(effectsPath, 'utf8'))

let added = 0
for (const skill of skills) {
  if (!skill?.id) continue
  effects[skill.id] = buildCareerEffect(skill)
  added += 1
}
for (const [id, effect] of Object.entries(BUFF_EFFECTS)) {
  if (!effects[id]) {
    effects[id] = effect
    added += 1
  }
}

fs.writeFileSync(effectsPath, JSON.stringify(effects, null, 2), 'utf8')
console.log(`Career effects: wrote ${added} career skill entries + buff helpers in effects.json`)
