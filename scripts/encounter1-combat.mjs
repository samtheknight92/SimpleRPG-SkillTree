#!/usr/bin/env node
/**
 * Encounter 1 combat math — why default stats hurt vs 3× Chicken.
 * Run: node scripts/encounter1-combat.mjs
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const premadeDir = path.join(root, 'data', 'premade-characters')
const itemsRoot = JSON.parse(fs.readFileSync(path.join(root, 'data', 'json', 'items.json'), 'utf8'))
const skillMeta = JSON.parse(fs.readFileSync(path.join(root, 'data', 'json', 'skill-meta.json'), 'utf8'))
const chicken = JSON.parse(fs.readFileSync(path.join(root, 'data', 'json', 'premade-characters.json'), 'utf8'))
  .find(p => p.premadeId === 'chicken')

const DEFAULT_STATS = {
  hp: 10, stamina: 10, strength: -3, magicPower: -3, accuracy: -3,
  speed: 2, physicalDefence: 8, magicalDefence: 8
}
const STAT_COST = { hp: 3, accuracy: 8, strength: 10, magicPower: 10, physicalDefence: 10, magicalDefence: 10 }

const WEAPON_KIND = {
  bronze_sword: 'sword', wooden_staff: 'staff', bronze_dagger: 'dagger', training_bow: 'ranged'
}

const STARTERS = [
  ['Road Knight', 'Level5_Swordsman_character.json', {
    attack: 'Quick Strike', accBonus: 0, dmg: '1d4', dmgStat: 'strength', targetDef: 'physicalDefence'
  }],
  ['Apprentice Evoker', 'Level5_Staff_Mage_character.json', {
    attack: 'Staff Strike', accBonus: 0, dmg: '1d6', dmgStat: 'magicPower', targetDef: 'physicalDefence'
  }],
  ['Alley Cutpurse', 'Level5_Rogue_character.json', {
    attack: 'Basic Attack', accBonus: 0, dmg: '1d4', dmgStat: 'strength', targetDef: 'physicalDefence', dualWield: true
  }],
  ['Range Hand', 'Level5_Archer_character.json', {
    attack: 'Aimed Shot', accBonus: 3, dmg: '1d4', dmgStat: 'strength', dmgFlat: 2, targetDef: 'physicalDefence'
  }]
]

function itemById(id) {
  for (const group of Object.values(itemsRoot)) {
    if (group?.[id]) return group[id]
  }
  return null
}

function equippedItems(char) {
  const out = []
  for (const uid of Object.values(char.equipped || {})) {
    if (!uid) continue
    const row = char.inventory?.find(i => i.uid === uid)
    if (row) out.push(itemById(row.itemId))
  }
  return out.filter(Boolean)
}

function weaponKind(char) {
  const wUid = char.equipped?.weapon
  const row = char.inventory?.find(i => i.uid === wUid)
  return row ? WEAPON_KIND[row.itemId] : null
}

function computeStats(char) {
  const stats = { ...DEFAULT_STATS, ...char.stats }
  for (const item of equippedItems(char)) {
    for (const [k, v] of Object.entries(item.statModifiers || {})) {
      stats[k] = (stats[k] || 0) + Number(v)
    }
  }
  const kind = weaponKind(char)
  const equipFx = skillMeta.EQUIPMENT_SKILL_EFFECTS || {}
  for (const skillId of char.skills || []) {
    const rule = equipFx[skillId]
    if (rule?.statModifiers && (!rule.weaponKind || rule.weaponKind === kind)) {
      for (const [k, v] of Object.entries(rule.statModifiers)) {
        stats[k] = (stats[k] || 0) + Number(v)
      }
    }
  }
  return stats
}

/** d20 + acc >= def — need roll R where R + acc >= def → R >= def - acc */
function hitChance(acc, def) {
  const need = def - acc
  if (need <= 1) return 1
  if (need > 20) return 0.05
  return (21 - need) / 20
}

function diceAvg(formula, stat, flat = 0) {
  const m = String(formula).match(/^(\d+)d(\d+)$/)
  if (!m) return 1
  const count = Number(m[1])
  const sides = Number(m[2])
  const faceAvg = (sides + 1) / 2
  let sum = 0
  for (let f = 1; f <= sides; f++) {
    sum += Math.max(1, count * f + stat + flat)
  }
  return sum / sides
}

function fmtPct(n) { return `${(n * 100).toFixed(0)}%` }

function applyStatBuy(char, stat) {
  char.stats[stat] = (char.stats[stat] ?? DEFAULT_STATS[stat]) + 1
  char.lumens -= STAT_COST[stat]
}

function rest1Sensible(char) {
  const isMage = char.premadeId === 'level5_staff_mage'
  const order = isMage
    ? ['accuracy', 'magicPower', 'physicalDefence']
    : ['accuracy', 'strength', 'physicalDefence']
  const buys = []
  let budget = 9
  const c = JSON.parse(JSON.stringify(char))
  c.lumens = budget
  for (const stat of order) {
    const base = c.stats[stat] ?? DEFAULT_STATS[stat]
    const target = 0
    if (base < target && budget >= STAT_COST[stat]) {
      applyStatBuy(c, stat)
      budget -= STAT_COST[stat]
      buys.push(`${stat} +1 (${STAT_COST[stat]}L)`)
      if (budget < 3) break
    }
  }
  while (budget >= STAT_COST.hp) {
    applyStatBuy(c, 'hp')
    budget -= STAT_COST.hp
    buys.push(`hp +1 (${STAT_COST.hp}L)`)
  }
  return { buys, char: c, banked: budget }
}

function rest1HpOnly(char) {
  const c = JSON.parse(JSON.stringify(char))
  c.lumens = 9
  const buys = []
  while (c.lumens >= STAT_COST.hp) {
    applyStatBuy(c, 'hp')
    buys.push(`hp +1 (${STAT_COST.hp}L)`)
  }
  return { buys, char: c, banked: c.lumens }
}

function row(label, stats, atk, foeStats) {
  const acc = stats.accuracy + (atk.accBonus || 0)
  const defKey = atk.targetDef
  const foeDef = foeStats[defKey]
  const hit = hitChance(acc, foeDef)
  const statVal = stats[atk.dmgStat] || 0
  const dmg = diceAvg(atk.dmg, statVal, atk.dmgFlat || 0) * (atk.dualWield ? 2 : 1)

  const foeHit = hitChance(foeStats.accuracy, stats.physicalDefence)
  const foeDmg = diceAvg('1d6', 2) // claws 1d6+2, chicken STR -2 → +2 flat in desc

  const turnsToKill = Math.ceil(chicken.stats.hp / (hit * dmg))
  const foeHitsToDown = Math.ceil(stats.hp / (foeHit * foeDmg))

  return { label, acc, hit, dmg, foeHit, foeDmg, turnsToKill, foeHitsToDown, hp: stats.hp, pd: stats.physicalDefence }
}

console.log('══════════════════════════════════════════════════════════════════════')
console.log(' ENCOUNTER 1 — 3× Chicken vs Level-5 starters (combat math)')
console.log(' Default bases trained at creation; starters at HP 24 with ACC/STR (or MAG) bumps · PD 8+armour')
console.log(' Rest 1 loot (split ÷4): 36L party → 9L each · chickens PD/MD 10 · claws 1d6+2')
console.log('══════════════════════════════════════════════════════════════════════\n')

for (const [name, file, atk] of STARTERS) {
  const char = JSON.parse(fs.readFileSync(path.join(premadeDir, file), 'utf8'))
  const foe = { ...DEFAULT_STATS, ...chicken.stats }

  const before = computeStats(char)
  const hpOnly = rest1HpOnly(char)
  const smart = rest1Sensible(char)
  const afterHp = computeStats(hpOnly.char)
  const afterSmart = computeStats(smart.char)

  const b = row('Before rest', before, atk, foe)
  const h = row('HP-only rest', afterHp, atk, foe)
  const s = row('Sensible rest', afterSmart, atk, foe)

  console.log(`── ${name} (${atk.attack}) ──`)
  console.log(`  Effective now: ACC ${before.accuracy} · ${atk.dmgStat === 'magicPower' ? 'MAG' : 'STR'} ${before[atk.dmgStat]} · PD ${before.physicalDefence} · HP ${before.hp}`)
  console.log(`  vs Chicken PD ${foe.physicalDefence}: ${fmtPct(b.hit)} to hit · ~${b.dmg.toFixed(1)} dmg/swing → ~${b.turnsToKill} swings to drop one (16 HP)`)
  console.log(`  Chicken vs your PD ${before.physicalDefence}: ${fmtPct(b.foeHit)} to hit you · ~${b.foeDmg.toFixed(1)}/claw → ~${b.foeHitsToDown} connecting hits to drop you`)
  console.log('')
  console.log(`  Rest 1 if you buy ONLY HP (3×): ${hpOnly.buys.join(', ') || '—'}`)
  console.log(`    → ACC ${afterHp.accuracy} · ${atk.dmgStat === 'magicPower' ? 'MAG' : 'STR'} ${afterHp[atk.dmgStat]} · PD ${afterHp.physicalDefence} · HP ${afterHp.hp}`)
  console.log(`    → still ${fmtPct(h.hit)} hit rate · ~${h.dmg.toFixed(1)} dmg — fight barely changes, you just have ${afterHp.hp - before.hp} more HP`)
  console.log('')
  console.log(`  Rest 1 sensible (${smart.buys.join(', ') || 'bank'}${smart.banked ? ` · bank ${smart.banked}L` : ''}):`)
  console.log(`    → ACC ${afterSmart.accuracy} · ${atk.dmgStat === 'magicPower' ? 'MAG' : 'STR'} ${afterSmart[atk.dmgStat]} · PD ${afterSmart.physicalDefence} · HP ${afterSmart.hp}`)
  console.log(`    → ${fmtPct(s.hit)} hit · ~${s.dmg.toFixed(1)} dmg · ~${s.turnsToKill} swings/chicken · you survive ~${s.foeHitsToDown} claws`)
  console.log('')
}

console.log('── Takeaway ──')
console.log('  At −3 ACC you need d20 13+ vs PD 10 (35–45% hit depending on weapon passives).')
console.log('  At −3 STR/MAG, weapon damage floors at 1 — you can hit and still barely scratch a chicken.')
console.log('  PD 8 means chickens connect ~55% of the time for ~5–6 damage; cloth-robe mage is especially soft.')
console.log('  9L buys +1 ACC (8L) for every starter — that is the obvious first rest purchase, not a third HP bump.')
console.log('  HP-only rest after encounter 1 makes the sim look fine while hiding a miserable first fight.\n')
