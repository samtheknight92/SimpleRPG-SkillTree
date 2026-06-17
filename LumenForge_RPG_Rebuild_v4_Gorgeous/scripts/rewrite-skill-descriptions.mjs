/**
 * Rewrite all skill descriptions for consistent combat terminology:
 * - Physical attacks: d20 + accuracy vs Physical Defence (PD = physical AC)
 * - Magical attacks/spells: d20 + accuracy vs Magical Defence (MD = magical AC)
 * - On hit: weapon damage or listed dice (+ Magic Power where noted)
 * Run: node scripts/rewrite-skill-descriptions.mjs
 */
import fs from 'fs'
import path from 'path'
import vm from 'vm'
import { fileURLToPath } from 'url'

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const skillsPath = path.join(root, 'data', 'skills-data.js')

const PD = 'Physical Defence'
const MD = 'Magical Defence'
const PHYS = `d20 + accuracy vs ${PD}`
const MAG = `d20 + accuracy vs ${MD}`

function loadSkills() {
  const code = fs.readFileSync(skillsPath, 'utf8')
  const sandbox = { console, window: {}, globalThis: {} }
  sandbox.globalThis.window = sandbox.window
  vm.createContext(sandbox)
  vm.runInContext(code, sandbox)
  return { code, data: sandbox.window.SKILLS_DATA }
}

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

function spellHit(dice, opts = {}) {
  const { range = '', extra = '', accMod = '', aoe = false, noRoll = false } = opts
  const acc = accMod ? ` (${accMod})` : ''
  const roll = noRoll ? 'Automatically hits (no attack roll)' : `Attack roll ${MAG}${acc}`
  const hit = noRoll ? `Deals ${dice}` : `on a hit, ${dice}`
  const parts = [`Spell: ${roll}; ${hit}`]
  if (range) parts.push(range)
  if (extra) parts.push(extra)
  return parts.join('. ').replace(/\.\./g, '.') + (aoe ? '' : '.')
}

function physHit(opts = {}) {
  const {
    verb = 'Melee weapon attack',
    accMod = '',
    dmgBonus = '',
    extra = '',
    multi = 0,
    perTarget = false
  } = opts
  const acc = accMod ? ` (${accMod})` : ''
  const dmg = dmgBonus ? `weapon damage ${dmgBonus} on hit` : 'weapon damage on hit'
  if (multi > 1) {
    return `Action: Make ${multi} ${verb.toLowerCase()}s as one action. Each attack roll is ${PHYS}${acc}; ${dmg}.${extra ? ` ${extra}` : ''}`
  }
  if (perTarget) {
    return `Action: ${verb}. Separate attack roll (${PHYS}${acc}) per target; ${dmg}.${extra ? ` ${extra}` : ''}`
  }
  return `Action: ${verb}. Attack roll d20 + accuracy${acc} vs ${PD}; ${dmg}.${extra ? ` ${extra}` : ''}`
}

/** Per-skill overrides (highest priority). */
const BY_ID = {
  // --- Sword ---
  sword_basics: 'Passive: +1 Accuracy while wielding a sword.',
  sword_stance: `Passive: +1 ${PD} while wielding a sword.`,
  quick_strike: physHit({ verb: 'Sword attack', accMod: '+2' }),
  parry: 'Reaction: When hit by a melee attack, roll d20 + accuracy vs the attacker\'s accuracy; on success, block the hit (no damage).',
  lunge_attack: physHit({ verb: 'Extended-reach sword attack (+5ft range)', dmgBonus: '+1' }),
  riposte: 'Reaction: After a successful Parry, counter with a Basic Attack (+2 damage on hit). Costs 1 stamina.',
  sweeping_slash: `Action: Wide sword arc. Up to 3 adjacent enemies; separate attack roll (${PHYS}) vs each; weapon damage on each hit.`,
  blade_dance: `Action: Sword combo of 3 attacks. Each attack roll is ${PHYS} −1; weapon damage +1 on each hit.`,
  defensive_stance: `Toggle: +2 ${PD} and +2 ${MD}, but −1 damage on your attacks. Costs 1 stamina per turn (max 10 turns).`,
  master_parry: 'Reaction: On a successful Parry, reflect the melee attack back at the attacker for full damage.',
  whirlwind: `Action: Spinning sword attack. One attack roll per enemy within 10ft (${PHYS} −2); weapon damage on each hit. Friendly fire possible.`,
  piercing_thrust: `Action: Armour-piercing sword thrust. Attack roll ${PHYS}; on a hit, weapon damage. Critical hit on natural 18–20. Target's armour bonuses do not add to ${PD} against this attack.`,
  sword_mastery: 'Passive: +3 damage on sword hits; critical hits restore 1 stamina.',

  // --- Axe ---
  axe_basics: 'Passive: +1 Accuracy while wielding an axe.',
  heavy_swing: physHit({ verb: 'Overhead axe chop', accMod: '−1', dmgBonus: '+3' }),
  cleave: 'Passive: When you kill an enemy, make a Basic Attack against an adjacent foe (costs 1 stamina).',
  armor_break: `Action: Sunder armour. On a successful melee attack roll (${PHYS}), reduce the target's ${PD} by 2 for 1 day (once per enemy).`,
  throwing_axe: `Action: Throw axe (30ft). Attack roll ${PHYS}; weapon damage on hit. Axe returns to your hand.`,
  berserker_rage: `Toggle: +2 Strength and +2 ${PD}. Costs 2 stamina per turn (max 5 turns).`,
  crushing_blow: `Action: Axe smash. Attack roll ${PHYS}; weapon damage on hit. 50% chance to apply Incapacitated (1 turn) and knock prone.`,
  ricochet_axe: 'Enhancement: Thrown axe attacks may bounce to one additional target (separate attack roll per target; weapon damage on each hit).',
  wide_cleave: `Action: Cleave arc (15ft). One attack roll (${PHYS}) per enemy in the arc; weapon damage on each hit.`,
  earthquake_slam: `Action: Ground slam (20ft radius). One attack roll per creature (${PHYS} −2); weapon damage on each hit; knockdown on hit. Friendly fire possible.`,
  whirling_axes: `Action: Spin with axes (10ft radius). One attack roll per enemy (${PHYS} −2); weapon damage on each hit. You may move while spinning. Friendly fire possible.`,
  axe_storm: `Action: Throw 6 axes (360°). Six attack rolls (${PHYS}); weapon damage on each hit.`,
  axe_mastery: 'Passive: +3 damage on axe hits; axe attacks have a 25% chance to Cleave.',

  // --- Staff ---
  staff_basics: 'Passive: +1 Magic Power while wielding a staff.',
  mana_focus: 'Passive: Restore +1 stamina per turn while a staff is equipped.',
  spell_power: 'Passive: +2 Magic Power on magical attacks while using a staff.',
  arcane_shield: 'Action: Apply Spell Warded to yourself (magical immunity + magical damage halved, 8 turns).',
  staff_strike: `Action: Melee staff strike. Attack roll ${PHYS}; on a hit, 1d6 + Magic Power damage.`,
  spell_penetration: `Passive: Your spell attack rolls treat the target's ${MD} as 2 lower.`,
  mana_burn: `Action: Drain mana. Attack roll ${MAG}; on a hit, apply Weakened (all stats −2) and drain 1d4+2 stamina from the target.`,
  elemental_staff: 'Action: Imbue staff with Fire, Ice, or Lightning for 10 turns (GM: adds elemental flavour to staff strikes/spells).',
  dispel_ward: 'Action: Remove all magical effects from one target (ally or enemy).',
  arcane_mastery: 'Passive: All spells cost −1 stamina (minimum 1).',
  staff_of_power: `Action: Release stored energy (60ft). Attack roll ${MAG}; on a hit, 3d8 force damage + Magic Power.`,
  reality_tear: 'Action: Open a dimensional rift — teleport anywhere within 100ft.',
  staff_mastery: 'Passive: +4 Magic Power; once per day, cast two spells in one turn.',

  // --- Dagger ---
  dagger_basics: 'Passive: +1 Accuracy while wielding a dagger.',
  light_step: 'Passive: +1 Speed and silent movement while a dagger is equipped.',
  dual_wield: 'Passive: With a dagger in your main hand, unlock an off-hand dagger slot. Basic Attack rolls damage for both daggers.',
  sneak_attack: `Action: Dagger attack from behind or while hidden. Attack roll ${PHYS}; weapon damage +3 on hit.`,
  poison_blade: 'Enhancement: Coat daggers with poison — escalating 1→2→3 damage over 3 turns on hit (GM).',
  flurry: `Action: Make 4 dagger attacks. Each attack roll is ${PHYS} −1; weapon damage on each hit.`,
  shadowstep: 'Action: Teleport behind a target within 30ft. Your next attack qualifies as Sneak Attack.',
  vital_strike: `Action: Dagger vital strike. Attack roll ${PHYS}; weapon damage on hit. Critical hit on natural 15–20.`,
  evasion: `Passive: +2 ${PD} and +2 ${MD}; GM may allow a dodge roll to avoid area attacks.`,
  thousand_cuts: `Action: Eight dagger strikes — automatically hit (no attack roll). Weapon damage on each hit.`,
  shadow_clone: 'Action: Create a mirror image that fights alongside you for 5 turns (50% your stats, GM).',
  assassinate: `Action: Lethal strike. Attack roll ${PHYS}; on a critical hit, instant kill on most enemies (GM discretion).`,
  dagger_mastery: 'Passive: +2 Speed, +3 damage on dagger hits; attacks have 25% critical chance.',

  // --- Polearm ---
  polearm_basics: 'Passive: +1 Accuracy while wielding a polearm.',
  reach_advantage: 'Passive: You may attack enemies 10ft away; they cannot reach you with melee unless they close distance.',
  thrust_attack: `Action: Piercing polearm thrust. Attack roll ${PHYS} (treat target ${PD} as 1 lower); weapon damage +2 on hit.`,
  polearm_defensive_stance: `Toggle: +2 ${PD} and +2 ${MD}, but you cannot move. Costs 1 stamina per turn (max 10 turns).`,
  sweep_attack: `Action: Wide sweep. Up to 3 enemies in front; separate attack roll (${PHYS}) vs each; weapon damage on each hit.`,
  spear_wall: `Action: Set a 10ft-wide block. Enemies entering the zone are attacked (${PHYS}); weapon damage on hit.`,
  polearm_charge_attack: `Action: Charge then strike. Attack roll ${PHYS}; weapon damage +1 per 5ft moved (max +6) on hit.`,
  trip_attack: `Action: Trip with polearm. Attack roll ${PHYS}; on a hit, knock target prone (they lose next turn, GM).`,
  phalanx_formation: `Passive: +1 ${PD} and +1 ${MD} for each polearm ally within 10ft.`,
  impale: `Action: Impaling thrust. Attack roll ${PHYS}; on a hit, 3d6 damage and target cannot move for 3 turns.`,
  whirlwind_sweep: `Action: 360° sweep (15ft). One attack roll per enemy (${PHYS} −2); weapon damage on each hit. Friendly fire possible.`,
  fortress_stance: `Toggle: +4 ${PD} and +4 ${MD}; reflect 50% damage to attackers. Costs 3 stamina per turn (max 5 turns).`,
  polearm_mastery: 'Passive: +20ft reach, +3 damage on polearm hits; opportunity attacks when enemies move (GM).',

  // --- Hammer ---
  hammer_basics: 'Passive: +1 Accuracy while wielding a hammer.',
  heavy_impact: physHit({ verb: 'Hammer blow', accMod: '−2', dmgBonus: '+4' }),
  armor_crusher: `Passive: Hammer attack rolls treat the target's ${PD} as 2 lower.`,
  stunning_blow: `Action: Stunning hammer blow. Attack roll ${PHYS}; weapon damage on hit. 50% chance to apply Incapacitated (1 turn).`,
  ground_slam: `Action: Ground slam (10ft). One attack roll per enemy (${PHYS} −1); weapon damage on each hit; knockdown on hit. Friendly fire possible.`,
  thunderstrike: `Action: Lightning-infused hammer strike. Attack roll ${PHYS}; on a hit, weapon damage + 2d6 lightning damage.`,
  earth_shaker: `Action: Earthquake hammer slam (20ft). One attack roll per creature (${PHYS} −2); weapon damage on each hit; difficult terrain. Friendly fire possible.`,
  berserker_swing: `Action: Wild hammer swing. Attack roll ${PHYS}; weapon damage +6 on hit. Until your next turn, −3 ${PD} and −3 ${MD}.`,
  shield_breaker: 'Action: Destroy a target\'s shield and remove Protected status (attack roll vs shield/holder, GM).',
  mjolnir_strike: `Action: Throw hammer (60ft line). Attack roll (${PHYS}) per enemy in the line; weapon damage on each hit. Hammer returns.`,
  apocalypse_slam: `Action: Devastating slam (40ft radius). One attack roll per creature (${PHYS} −4); on each hit, 4d6 damage. Friendly fire possible.`,
  fortress_buster: 'Action: Destroy structures or barriers (walls, doors) — no attack roll vs creatures.',
  hammer_mastery: 'Passive: +4 damage on hammer hits; attacks cause knockdown; immune to Incapacitated.',

  // --- Monster ---
  multiattack: 'Passive: Each turn, make 2 different attacks (each pays its own stamina cost).',
  claws: `Action: Claw attack. Attack roll ${PHYS}; on a hit, 1d6+2 slashing damage.`,
  razor_claws: `Action: Claw attack. Attack roll ${PHYS}; on a hit, 1d8+3 slashing damage; causes bleeding (GM).`,
  venomous_claws: `Action: Claw attack. Attack roll ${PHYS}; on a hit, weapon damage + poison 1d4/turn (GM).`,
  bite_attack: `Action: Bite. Attack roll ${PHYS}; on a hit, 1d8+1 piercing damage.`,
  crushing_bite: `Action: Bite. Attack roll ${PHYS} (treat ${PD} as 2 lower); on a hit, 2d6+2 damage.`,
  tail_swipe: `Action: Tail sweep — adjacent enemies. Separate attack roll (${PHYS}) vs each; 1d6 damage on each hit.`,
  spiked_tail: `Action: Tail strike (10ft reach). Attack roll ${PHYS}; on a hit, 1d10+3 piercing damage.`,
  monster_charge_attack: `Action: Charge 20ft and attack. Attack roll ${PHYS}; double weapon/natural damage on hit.`,
  monster_berserker_rage: `Toggle: +4 damage, +2 attacks per turn, −2 ${PD} and −2 ${MD} for 3 turns.`,
  rend: 'Passive: If both claw attacks hit the same target in one turn, deal bonus 1d6 damage.',
  pounce: `Action: Leap 15ft and attack. Attack roll ${PHYS}; on a hit, knock prone.`,
  gore: `Action: Horn attack. Attack roll ${PHYS}; on a hit, 1d8+2 piercing and push 5ft.`,
  trample: 'Action: Move through enemies; each takes 1d6 damage (GM: attack roll or save as appropriate).',
  blood_frenzy: 'Passive: When an enemy drops below 25% HP, gain +3 damage until end of combat.',
  fire_breath: `Action: 30ft cone. Attack roll ${MAG} vs each target; on a hit, 2d8 fire + apply Burn. Grants fire resistance; ice/water weakness.`,
  ice_breath: `Action: 30ft cone. Attack roll ${MAG} vs each target; on a hit, 2d6 cold + apply Weakened. Grants ice/water resistance; fire/lightning weakness.`,
  poison_breath: `Action: 25ft cone. Attack roll ${MAG} vs each target; on a hit, 1d8 poison + apply Poison. Grants poison resistance; light/fire weakness.`,
  lightning_breath: `Action: 60ft line. Attack roll ${MAG} vs each target; on a hit, 2d10 lightning + apply Immobilized. Grants lightning resistance; earth/water weakness.`,
  acid_spit: `Action: Spit acid (ranged). Attack roll ${PHYS}; on a hit, 1d8 acid + apply Acid Corrosion. Grants poison resistance; ice/water weakness.`,
  damage_reduction: 'Passive: Reduce all incoming damage by 2 (applied after a hit).',
  tough_skin: `Passive: +2 ${PD}.`,
  rock_skin: `Passive: +3 ${PD}; resist piercing (GM).`,
  metal_skin: `Passive: +4 ${PD}; resist slashing (GM).`,
  magical_resistance: `Passive: +3 ${MD}.`,
  armored_plates: `Passive: +2 ${PD} and +2 ${MD}; immune to critical hits.`,
}

function rewriteFusionToggle(desc, weaponWord) {
  return desc.replace(
    /^Toggle:\s*/i,
    `Toggle: ${weaponWord} attacks — attack roll ${PHYS}; weapon damage on hit, plus `
  ).replace(/Ranged attacks deal/, 'plus').replace(/attacks deal \+/, 'plus +')
}

function rewriteSkill(skill) {
  if (BY_ID[skill.id]) return BY_ID[skill.id]
  let d = String(skill.desc || '')

  if (d.includes('d20 + accuracy vs')) return d

  const id = skill.id
  const tier = Number(skill.tier || 1)
  const cat = skill.category || ''
  const sub = skill.subcategory || ''

  // --- Dual-element fusion / ascension damage spells ---
  const dualElem = d.match(/dealing (\d+d\d+) (\w+) or (\w+) damage \(whichever the target is weak to\)/i)
  if (dualElem) {
    const chance = d.match(/(\d+)% chance to apply/i)?.[1]
    const chanceText = chance ? ` Has a ${chance}% chance to apply the listed status.` : ''
    const roll = /touch|melee|strike|slash|cleave|smash/i.test(d) && cat !== 'magic' ? PHYS : MAG
    const prefix = d.startsWith('Spell:') ? 'Spell:' : 'Action:'
    const area = d.match(/(all enemies|in an area|large area|each target)/i)?.[0] || ''
    const areaNote = area ? ` ${area}; separate attack roll per target.` : ''
    return `${prefix} Attack roll ${roll}; on a hit, ${dualElem[1]} ${dualElem[2]} or ${dualElem[3]} damage (use whichever element the target is weakest to).${areaNote}${chanceText}`
  }

  // --- Fusion toggles (buffs on weapon hits, not separate attacks) ---
  if (/^Toggle:/i.test(d) && /\+1d6/i.test(d)) {
    const weapon = d.match(/(Ranged|Sword|Dagger|Polearm|Hammer|Axe|Staff) attacks/i)?.[1] || 'Weapon'
    const w = weapon.toLowerCase()
    const weaponLabel = w === 'ranged' ? 'ranged attacks' : `${w} attacks`
    if (/Treat target Physical Defence as 2 lower/i.test(d)) {
      return `Toggle: While active, ${weaponLabel} gain +1d6 earth damage on hit; attack rolls against targets treat Physical Defence as 2 lower. Costs stamina per turn while active.`
    }
    if (/push target 5ft/i.test(d)) {
      return `Toggle: While active, ${weaponLabel} gain +1d6 wind damage on hit and push the target 5ft on a hit. Costs stamina per turn while active.`
    }
    if (/Physical Defence is 1 lower for 2 turns/i.test(d)) {
      return `Toggle: While active, ${weaponLabel} gain +1d6 water damage on hit; on a hit, the target's Physical Defence is 1 lower for 2 turns. Costs stamina per turn while active.`
    }
    const m = d.match(/\+1d6 (\w+) damage and have a (\d+)% chance to apply ([^.]+)/i)
      || d.match(/\+1d6 (\w+) on hit\. (\d+)% chance to apply ([^.]+)/i)
    if (m) {
      const cap = m[1].charAt(0).toUpperCase() + m[1].slice(1)
      return `Toggle: While active, ${weaponLabel} gain +1d6 ${cap} damage on hit and have a ${m[2]}% chance to apply ${m[3].trim()}. Costs stamina per turn while active.`
    }
  }

  if (/ignore 2 points of (armor|armour)/i.test(d)) {
    const label = d.match(/^(Ranged |Sword |Dagger |Polearm |Hammer |Axe |Staff )?/i)?.[0]?.trim() || ''
    const weapon = label ? `${label.toLowerCase().replace(/\s+$/, '')} attacks` : 'attacks'
    return `Toggle: While active, ${weapon} gain +1d6 earth damage on hit; attack rolls against targets treat Physical Defence as 2 lower. Costs stamina per turn while active.`
  }

  if (/reduce enemy Physical Defence by 1/i.test(d)) {
    return d.replace(/^(Ranged )?attacks? deal /i, `Attack roll ${PHYS}; weapon damage +`)
      .replace(/reduce enemy Physical Defence by 1 for 2 turns \(no status effect\)/i, `target's ${PD} is 1 lower for 2 turns on hit`)
  }

  // --- Fusion activatables with proc chance ---
  if (/\d+% chance to apply/i.test(d) && /\d+d\d+/.test(d)) {
    const chance = d.match(/(\d+)% chance to apply/i)?.[1] || (tier === 2 ? 20 : tier === 3 ? 40 : 75)
    const dice = d.match(/(\d+d\d+)/)?.[1] || '2d6'
    const elem = d.match(/(fire|ice|lightning|earth|wind|water|darkness|light|electric)/i)?.[1] || ''
    const isPhys = /strike|slash|cleave|smash|parry|sweep|shot|arrow|volley|dance|assault|pound|slam|crash|bite|claw/i.test(d)
      && !/channel|cone|staff becomes|focus|transform/i.test(d)
    const roll = isPhys ? PHYS : MAG
    let prefix = 'Action:'
    if (/^Parry/i.test(d) || /^Reaction/i.test(d)) prefix = 'Reaction:'
    if (/^Spell:/i.test(d)) prefix = 'Spell:'
    if (/auto-hit|automatically hits|Does not miss/i.test(d)) {
      return d.replace(/pierces armor/i, `treat target ${MD} as 3 lower`)
        .replace(/ignore(s)? (\d+) points of armor/gi, `treat target ${PD} as $2 lower`)
    }
    const multi = /all (adjacent |nearby )?enemies|each target|multiple targets|360°|volley/i.test(d)
    const multiNote = multi ? ' Separate attack roll per target;' : ''
    return `${prefix}${multiNote} Attack roll ${roll}; on a hit, ${dice}${elem ? ` ${elem}` : ''} damage${multi ? ' each' : ''}. Has a ${chance}% chance to apply the listed status.`
      .replace(/^Action:(?= Attack)/, 'Action:')
      .replace(/^Action: Separate/, 'Action: Separate')
  }

  // --- Spell: projectile (NdM damage, range) ---
  const spellProj = d.match(/^Spell: [^(]+\((\d+d\d+)[^)]*?(?:damage)?[^)]*?(\d+ft[^)]*)\)/i)
    || d.match(/^Spell: [^(]+\((\d+d\d+)[^)]*?(fire|ice|cold|lightning|earth|wind|water|darkness|light|poison|psychic)[^)]*(\d+ft)?/i)
  if (spellProj && !/Apply |Create |Restore |Detect |See |Float|True flight|Become |Protected area|Remove |Clean |Summon |Grant |Bring |Set \d+ft radius ablaze/i.test(d)) {
    const dice = spellProj[1]
    const range = (spellProj[2] && /\d+ft/.test(spellProj[2]) ? spellProj[2] : spellProj[3]) || d.match(/(\d+ft)/)?.[1] || ''
    const elem = d.match(/(fire|ice|cold|lightning|earth|wind|water|darkness|light|poison|psychic|force)/i)?.[1] || ''
    return spellHit(`${dice}${elem ? ` ${elem}` : ''} damage + Magic Power`, { range: range ? range.trim() : '' })
  }

  // --- Spell: AoE with accuracy penalty ---
  const spellAoe = d.match(/^Spell: (\d+ft[^(]+)\((\d+d\d+)[^)]*(-\d+) accuracy/i)
  if (spellAoe) {
    return `Spell: ${spellAoe[1].trim()}. One attack roll per creature (${MAG} ${spellAoe[3]}); on each hit, ${spellAoe[2]} damage + Magic Power. Friendly fire possible.`
  }

  const spellAoeSimple = d.match(/^Spell: (\d+ft radius[^.]+)\((\d+d\d+)/i)
  if (spellAoeSimple && /damage|storm|explosion|freeze|ablaze/i.test(d)) {
    const acc = d.match(/(-\d+) accuracy/)?.[1] || ''
    const accPart = acc ? ` ${acc}` : ''
    const extra = /apply|Weakened|knockdown/i.test(d) ? ` ${d.match(/apply[^.)]+/i)?.[0] || ''}` : ''
    return `Spell: ${spellAoeSimple[1].trim()}. One attack roll per creature (${MAG}${accPart}); on each hit, ${spellAoeSimple[2]} damage + Magic Power.${extra} Friendly fire possible.`
  }

  // --- Spell: touch / single-target status ---
  if (/^Spell: Touch attack/i.test(d)) {
    return d.replace(/^Spell: Touch attack/i, `Spell: Touch attack. Attack roll ${MAG}; on a hit,`)
  }

  if (/^Spell: Apply /i.test(d) && !/\d+d\d+ damage/.test(d)) {
    if (/steal|drain|Stun/i.test(d)) {
      return d.replace(/^Spell:/, `Spell: Attack roll ${MAG}; on a hit,`)
    }
    return d
  }

  // --- Spell: AC buffs ---
  if (/^Spell: \+\d+ Physical Defence/i.test(d)) {
    return d.replace(/^Spell: \+(\d+) Physical Defence and \+(\d+) Magical Defence/i,
      `Spell: Gain +$1 ${PD} and +$2 ${MD} (raises your AC)`)
  }

  if (/^Spell: .*\+(\d+) Physical Defence and \+(\d+) Magical Defence/i.test(d)) {
    return d.replace(/\+(\d+) Physical Defence and \+(\d+) Magical Defence/i,
      `+$1 ${PD} and +$2 ${MD} (AC bonus)`)
  }

  // --- Spell: walls / zones / utility (no attack roll) ---
  if (/^Spell: (Create|Detect|See |Float|True flight|Become |Protected area|Remove |Restore \d|Apply Enhanced|Apply Protected|Apply Regeneration|Apply Weapon|Applies )/i.test(d)) {
    return d
  }

  if (/^Spell: .*Devastating|^Spell: Set \d+ft|^Spell: Moving \d+ft|^Spell: Instantly freeze|^Spell: Freeze \d+ft|^Spell: Reshape|^Spell: Control weather|^Spell: Massive|^Spell: Target takes damage equal/i.test(d)) {
    const dice = d.match(/(\d+d\d+)/)?.[1]
    const acc = d.match(/(-\d+) accuracy/)?.[1] || ''
    if (dice) {
      const accPart = acc ? ` ${acc}` : ''
      if (/radius|all inside|all enemies/i.test(d)) {
        return `Spell: Area effect. One attack roll per creature (${MAG}${accPart}); on each hit, ${dice} damage + Magic Power. ${d.includes('GRANTS') ? d.match(/GRANTS:[^.]+/)?.[0] || '' : ''}`.trim()
      }
      return `Spell: Attack roll ${MAG}${accPart}; on a hit, ${dice} damage + Magic Power.`
    }
    if (/Target takes damage equal/i.test(d)) {
      return `Spell: Attack roll ${MAG}; on a hit, damage equal to half the target's max HP.`
    }
    return d
  }

  // --- Spell: line / chain attacks ---
  if (/^Spell: .*line attack|^Spell: Lightning jumps|^Spell: .*piercing/i.test(d)) {
    const dice = d.match(/(\d+d\d+)/)?.[1] || '2d6'
    const range = d.match(/(\d+ft)/)?.[1] || ''
    const multi = /jumps|additional targets|all inside/i.test(d)
    if (multi) {
      return `Spell: Attack roll ${MAG} per target; on each hit, ${dice} damage + Magic Power.${range ? ` ${range}.` : ''}`
    }
    return spellHit(`${dice} damage + Magic Power`, { range })
  }

  // --- Physical weapon patterns ---
  const physMod = d.match(/^Action: ([^(]+?)(?:,|\.)?\s*\+(\d+) damage(?: but| and)?\s*(-?\d+) accuracy/i)
  if (physMod) {
    const [, name, dmg, acc] = physMod
    return physHit({ verb: name.trim(), accMod: acc.startsWith('-') ? acc : `+${acc}`, dmgBonus: `+${dmg}` })
  }

  const multiAtk = d.match(/^Action: Make (\d+) .*attacks?, each at (-?\d+) accuracy/i)
  if (multiAtk) {
    const [, n, acc] = multiAtk
    const weapon = sub || 'weapon'
    return `Action: Make ${n} ${weapon} attacks. Each attack roll is ${PHYS} ${acc}; weapon damage on each hit.`
  }

  const aoe = d.match(/^Action: ([^.]*hits all enemies[^.]*)\((-?\d+) accuracy/i)
  if (aoe) {
    return `Action: ${aoe[1].trim()}. One attack roll per enemy (${PHYS} ${aoe[2]}); weapon damage on each hit. Friendly fire possible.`
  }

  // --- Natural / monster melee ---
  if (/^(Melee attack|Bite attack|Ranged attack|Ranged:|Horn attack|Touch:)/i.test(d)) {
    const dice = d.match(/(\d+d\d+[^,]*)/)?.[1] || 'weapon damage'
    const isRanged = /^Ranged/i.test(d)
    const roll = isRanged ? PHYS : PHYS
    return d.replace(/^(Melee attack|Bite attack|Ranged attack|Ranged:|Horn attack|Touch:)/i,
      `Action: $1`).replace(/:\s*(\d+d\d+)/, `. Attack roll ${roll}; on a hit, $1`)
      + (d.includes('ignores') ? `. ${d.match(/ignores \d+ Physical Defence/i)?.[0]?.replace('ignores', 'treat ' + PD + ' as')?.replace('Physical Defence', 'lower') || ''}` : '')
  }

  if (/^Action: \+(\d+) damage when attacking/i.test(d)) {
    return d.replace(/^Action:/, `Action: Attack roll ${PHYS}; weapon damage +$1 on hit when attacking`)
  }

  if (/^Action: Target vital|^Action: Instant kill/i.test(d)) {
    return d.replace(/^Action: Target vital points/, `Action: Dagger vital strike. Attack roll ${PHYS}; weapon damage on hit`)
      .replace(/^Action: Instant kill/, `Action: Lethal strike. Attack roll ${PHYS}; on a critical hit, instant kill`)
  }

  if (/^Action: Unleash \d+ strikes.*auto-hit/i.test(d)) {
    const n = d.match(/(\d+) strikes/)?.[1] || '8'
    return `Action: ${n} dagger strikes — automatically hit (no attack roll). Weapon damage on each hit.`
  }

  // --- Passive / toggle prefix ---
  if (skill.staminaCost === 0 && !/^(Passive|Toggle|Action|Spell|Reaction|Enhancement|Utility|Craft|Action \()/i.test(d)) {
    if (/^\+1 Accuracy/i.test(d)) {
      const w = d.match(/with (\w+)/i)?.[1] || 'this weapon'
      return `Passive: +1 Accuracy while wielding a ${w}.`
    }
    if (/^\+1 magic power/i.test(d)) return `Passive: +1 Magic Power while wielding a staff.`
    if (/^Passive:/i.test(d)) return d
    if (/attunement|GRANTS:|Master |Know weakness|When enemy|If both|Segmented|Strong resistance|Natural armor|Innate magic|Reduce all incoming/i.test(d)) {
      return d.startsWith('Passive:') ? d : `Passive: ${d}`
    }
  }

  if (/^Toggle:/i.test(d) && /Physical Defense/i.test(d)) {
    return d.replace('Physical Defense', PD)
  }

  // --- Professions ---
  if (/smithing|alchemy|enchanting|cooking|archaeolog|herbal|_brewing|_crafting|_study|_remedies|_salves|_herbs|_chef|_mastery|_archaeologist|_enchanter/i.test(id)) {
    if (!/^(Craft|Utility|Passive)/i.test(d)) return `Craft: ${d}`
  }

  // --- Ascension / ultimate ---
  if (cat === 'ascension' || cat === 'ultimate') {
    d = d.replace(/ignore(s)? (\d+) points of armor/gi, `treat target ${PD} as $2 lower`)
    d = d.replace(/ignore(s)? armor completely/gi, `no armour bonus to ${PD}`)
    d = d.replace(/pierces armor/gi, `treat target ${MD} as 3 lower`)
    if (/Deals \d+d\d+ physical damage/i.test(d)) {
      return d.replace(/Deals (\d+d\d+) physical damage/, `One attack roll per creature (${PHYS}); on each hit, $1 physical damage`)
    }
    if (/dealing \d+d\d+ damage \(DEX save halves\)/i.test(d)) {
      return d.replace(/dealing (\d+d\d+) damage \(DEX save halves\)/i,
        `attack roll ${MAG} per creature; on each hit, $1 damage (GM: DEX save halves on miss-by-1)`)
    }
    if (/^Action: Analyze|^Action: Emit|^Action: Instantly teleport|^Action: Read recent|^Action: Move up to|^Action: Alter gravity|^Action: Link HP/i.test(d)) {
      return d
    }
    if (/^Reaction/i.test(d) || /^Passive:/i.test(d)) return d
    if (!/d20 \+ accuracy/.test(d) && /^Action:/.test(d)) {
      return d
    }
    return d
  }

  // --- Global armour wording cleanup ---
  d = d.replace(/ignore(s)? (\d+) points of (armor|armour|Physical Defence)/gi, `treat target ${PD} as $2 lower`)
  d = d.replace(/ignore(s)? armor completely/gi, `target's armour does not add to ${PD}`)
  d = d.replace(/pierces armor/gi, `treat target ${PD} as 3 lower`)
  d = d.replace(/ignores (\d+) Physical Defence/gi, `treat target ${PD} as $1 lower`)

  return d
}

function applyToTree(node) {
  if (Array.isArray(node)) {
    for (const skill of node) {
      if (skill?.id) skill.desc = rewriteSkill(skill)
    }
    return
  }
  if (node && typeof node === 'object') {
    for (const value of Object.values(node)) applyToTree(value)
  }
}

function patchFile(original, data) {
  let out = original
  const all = flattenSkills(data)
  for (const skill of all) {
    const newDesc = skill.desc.replace(/\\/g, '\\\\').replace(/"/g, '\\"')
    const re = new RegExp(`("id": "${skill.id}"[\\s\\S]*?"desc": ")(?:[^"\\\\]|\\\\.)*(")`, 'm')
    if (!re.test(out)) {
      console.warn('Could not patch:', skill.id)
      continue
    }
    out = out.replace(re, `$1${newDesc}$2`)
  }
  return out
}

const { code, data } = loadSkills()
applyToTree(data)

// Add combat terminology to file header if not present
let headerNote = `// COMBAT: Physical attacks roll d20 + accuracy vs target Physical Defence (PD).
// Magical attacks/spells roll d20 + accuracy vs target Magical Defence (MD).
// PD and MD are AC values — meet or beat to hit; damage applies only on a hit.
`
let newCode = code
if (!code.includes('PD and MD are AC values')) {
  newCode = code.replace(
    '// BALANCE NOTES:',
    `${headerNote}// BALANCE NOTES:`
  )
}

newCode = patchFile(newCode, data)
fs.writeFileSync(skillsPath, newCode, 'utf8')

const changed = flattenSkills(data).filter(s => s.desc)
console.log(`Updated ${changed.length} skill descriptions.`)
