#!/usr/bin/env node
/**
 * Encounter loot sim — purchases only at rest (after each encounter).
 * Modes: split (floor ÷4, whole L/G only) | full (each player gets 100% loot).
 * Run: node scripts/encounter-loot-sim.mjs
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { minLevelForTier, characterLevelFromTotal } from './lib/progression.mjs'

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const jsonDir = path.join(root, 'data', 'json')
const premadeDir = path.join(root, 'data', 'premade-characters')

const DEFAULT_STATS = { hp: 10, stamina: 10, strength: -3, magicPower: -3, accuracy: -3, speed: 2, physicalDefence: 8, magicalDefence: 8 }
const STAT_COST = { hp: 3, stamina: 4, strength: 10, magicPower: 10, accuracy: 8, speed: 12, physicalDefence: 10, magicalDefence: 10 }

/** Combat stats before HP padding — mirrors what players actually buy at the table. */
const REST_STAT_PRIORITY = {
  level5_staff_mage: ['accuracy', 'magicPower', 'physicalDefence', 'magicalDefence', 'hp'],
  level5_swordsman: ['accuracy', 'strength', 'physicalDefence', 'hp'],
  level5_rogue: ['accuracy', 'strength', 'physicalDefence', 'hp'],
  level5_archer: ['accuracy', 'strength', 'physicalDefence', 'hp']
}
const STAT_TARGET = { accuracy: 0, strength: 0, magicPower: 0, physicalDefence: 10, magicalDefence: 10 }
const PARTY = 4

const skillsRoot = JSON.parse(fs.readFileSync(path.join(jsonDir, 'skills.json'), 'utf8'))
const itemsRoot = JSON.parse(fs.readFileSync(path.join(jsonDir, 'items.json'), 'utf8'))
const premades = JSON.parse(fs.readFileSync(path.join(jsonDir, 'premade-characters.json'), 'utf8'))

const skillById = new Map()
function walkSkills(node) {
  if (Array.isArray(node)) { for (const s of node) if (s?.id) skillById.set(s.id, s); return }
  if (node && typeof node === 'object') for (const v of Object.values(node)) walkSkills(v)
}
walkSkills(skillsRoot)

const CURRENCY = { gold: 2500, silver: 100, copper: 1 }
function itemGil(itemId) {
  for (const group of Object.values(itemsRoot)) {
    const item = group?.[itemId]
    if (item?.price) {
      const p = item.price
      return (Number(p.gold || 0) * CURRENCY.gold) + (Number(p.silver || 0) * CURRENCY.silver) + Number(p.copper || 0)
    }
  }
  return 0
}

const tierLv = t => Number(t || 1) / 5
const statLv = k => (k === 'hp' || k === 'stamina' ? 0.2 : 0.4)

function levelInfo(char) {
  let skillLevels = 0
  for (const id of char.skills) {
    const s = skillById.get(id)
    if (s) skillLevels += tierLv(s.tier)
  }
  let statLevels = 0
  for (const [stat, base] of Object.entries(DEFAULT_STATS)) {
    const purchases = Math.max(0, (char.stats[stat] ?? base) - base)
    statLevels += purchases * statLv(stat)
  }
  const total = skillLevels + statLevels
  return { total, level: characterLevelFromTotal(total) }
}

function hasSkillPrereqs(char, skill) {
  const req = skill.prerequisites
  if (!req || req.type === 'NONE') return true
  if (req.type === 'LEVEL') return levelInfo(char).level >= Number(req.level || 0)
  if (!req.skills?.length) return true
  if (req.type === 'AND') return req.skills.every(id => char.skills.includes(id))
  if (req.type === 'OR') return req.skills.some(id => char.skills.includes(id))
  return false
}

function canLearn(char, skillId) {
  const skill = skillById.get(skillId)
  if (!skill || char.skills.includes(skillId)) return false
  if (levelInfo(char).level < minLevelForTier(skill.tier)) return false
  if (!hasSkillPrereqs(char, skill)) return false
  if (char.lumens < skill.cost) return false
  return true
}

const NEXT_SKILL = {
  level5_swordsman: ['parry', 'hold_the_line', 'riposte', 'defensive_stance'],
  level5_staff_mage: ['spell_power', 'empower_ally', 'arcane_shield', 'spell_penetration'],
  level5_rogue: ['dirty_trick', 'dual_wield', 'flurry', 'vital_strike'],
  level5_archer: ['power_shot', 'quick_reload', 'parting_shot', 'quick_draw'],
}

function tryLearnNext(char) {
  for (const id of NEXT_SKILL[char.premadeId] || []) {
    if (canLearn(char, id)) {
      const skill = skillById.get(id)
      char.lumens -= skill.cost
      char.skills.push(id)
      return { type: 'skill', name: skill.name, cost: skill.cost, tier: skill.tier }
    }
  }
  return null
}

function buyStat(char, statKey) {
  const cost = STAT_COST[statKey]
  if (!cost || char.lumens < cost) return null
  char.lumens -= cost
  char.stats[statKey] = (char.stats[statKey] ?? DEFAULT_STATS[statKey]) + 1
  const label = statKey === 'hp' ? 'HP'
    : statKey === 'magicPower' ? 'Magic Power'
    : statKey === 'physicalDefence' ? 'Physical Defence'
    : statKey === 'magicalDefence' ? 'Magical Defence'
    : statKey.charAt(0).toUpperCase() + statKey.slice(1)
  return { type: 'stat', stat: label, cost }
}

function tryBuyCombatStat(char) {
  const order = REST_STAT_PRIORITY[char.premadeId] || REST_STAT_PRIORITY.level5_swordsman
  for (const statKey of order) {
    if (statKey === 'hp') {
      const hp = buyStat(char, 'hp')
      if (hp) return hp
      continue
    }
    const base = char.stats[statKey] ?? DEFAULT_STATS[statKey]
    const target = STAT_TARGET[statKey]
    if (base < target) {
      const bought = buyStat(char, statKey)
      if (bought) return bought
    }
  }
  return null
}

function restSpend(char) {
  const buys = []
  for (let i = 0; i < 50; i++) {
    const skill = tryLearnNext(char)
    if (skill) { buys.push(skill); continue }
    const stat = tryBuyCombatStat(char)
    if (stat) { buys.push(stat); continue }
    break
  }
  return buys
}

function restShop(char) {
  const buys = []
  const armorItem = char.inventory?.find(i => i.uid === char.equipped?.armor)
  const currentArmor = armorItem?.itemId

  if (currentArmor === 'leather_armor' && char.gil >= itemGil('studded_leather')) {
    const cost = itemGil('studded_leather')
    char.gil -= cost
    armorItem.itemId = 'studded_leather'
    buys.push({ item: 'Studded Leather', cost })
  } else if (currentArmor === 'cloth_robes' && char.gil >= itemGil('leather_armor')) {
    const cost = itemGil('leather_armor')
    char.gil -= cost
    armorItem.itemId = 'leather_armor'
    buys.push({ item: 'Leather Armor', cost })
  }

  while (char.gil >= itemGil('health_potion')) {
    const cost = itemGil('health_potion')
    char.gil -= cost
    const row = char.inventory.find(i => i.itemId === 'health_potion')
    if (row) row.qty += 1
    else char.inventory.push({ uid: `${char.premadeId}_hp_${char.inventory.length}`, itemId: 'health_potion', qty: 1 })
    buys.push({ item: 'Health Potion', cost })
  }
  while (char.gil >= itemGil('stamina_potion')) {
    const cost = itemGil('stamina_potion')
    char.gil -= cost
    const row = char.inventory.find(i => i.itemId === 'stamina_potion')
    if (row) row.qty += 1
    else char.inventory.push({ uid: `${char.premadeId}_sp_${char.inventory.length}`, itemId: 'stamina_potion', qty: 1 })
    buys.push({ item: 'Stamina Potion', cost })
  }
  return buys
}

function cloneChar(file) {
  return JSON.parse(fs.readFileSync(path.join(premadeDir, file), 'utf8'))
}

function dropFor(id) {
  const p = premades.find(x => x.premadeId === id)
  return { lumens: p.lumens || 0, gil: p.gil || 0, name: p.name }
}

const ENCOUNTERS = [
  { label: '1 — 3× Chicken', foes: [{ id: 'chicken', count: 3 }] },
  { label: '2 — 2× Blue Slime + 1× Crystal Slime', foes: [{ id: 'blue_slime', count: 2 }, { id: 'crystal_slime', count: 1 }] },
  { label: '3 — 1× Ice Octopus', foes: [{ id: 'ice_octopus', count: 1 }] },
  { label: '4 — 4× Smuggler', foes: [{ id: 'smuggler', count: 4 }] },
  { label: '5 — 2× Smuggler + 1× Cultist', foes: [{ id: 'smuggler', count: 2 }, { id: 'cultist', count: 1 }] }
]

function encounterLoot(enc) {
  let lumens = 0
  let gil = 0
  const lines = []
  for (const { id, count } of enc.foes) {
    const d = dropFor(id)
    lumens += d.lumens * count
    gil += d.gil * count
    lines.push(`${count}× ${d.name} → ${d.lumens * count}L / ${(d.gil * count).toLocaleString()}G`)
  }
  return { lumens, gil, lines }
}

function snap(char) {
  const lv = levelInfo(char)
  const armor = char.inventory.find(i => i.uid === char.equipped?.armor)?.itemId
  const hp = char.inventory.find(i => i.itemId === 'health_potion')?.qty || 0
  const sp = char.inventory.find(i => i.itemId === 'stamina_potion')?.qty || 0
  const s = char.stats
  return {
    level: lv.level,
    prog: lv.total.toFixed(1),
    L: char.lumens,
    G: char.gil,
    hp: s.hp,
    sta: s.stamina,
    acc: s.accuracy,
    str: s.strength,
    mag: s.magicPower,
    pd: s.physicalDefence,
    md: s.magicalDefence,
    skills: char.skills.length,
    maxTier: Math.max(0, ...char.skills.map(id => skillById.get(id)?.tier || 0)),
    armor,
    pots: `HP×${hp} STA×${sp}`
  }
}

const ROSTER = [
  ['Road Knight', 'Level5_Swordsman_character.json'],
  ['Apprentice Evoker', 'Level5_Staff_Mage_character.json'],
  ['Alley Cutpurse', 'Level5_Rogue_character.json'],
  ['Range Hand', 'Level5_Archer_character.json']
]

function runMode(mode) {
  const split = mode === 'split'
  const party = ROSTER.map(([name, file]) => ({ name, char: cloneChar(file) }))
  const log = []
  let partyRemainderL = 0
  let partyRemainderG = 0

  for (const enc of ENCOUNTERS) {
    const loot = encounterLoot(enc)
    let perL = 0
    let perG = 0
    if (split) {
      perL = Math.floor(loot.lumens / PARTY)
      perG = Math.floor(loot.gil / PARTY)
      partyRemainderL += loot.lumens - perL * PARTY
      partyRemainderG += loot.gil - perG * PARTY
    } else {
      perL = loot.lumens
      perG = loot.gil
    }

    const before = party.map(p => ({ name: p.name, ...snap(p.char) }))

    for (const p of party) {
      p.char.lumens += perL
      p.char.gil += perG
    }

    const purchases = []
    for (const p of party) {
      const lBuys = restSpend(p.char)
      const gBuys = restShop(p.char)
      purchases.push({ name: p.name, buys: [...lBuys, ...gBuys] })
    }

    const after = party.map(p => ({ name: p.name, ...snap(p.char) }))

    log.push({
      enc: enc.label,
      loot,
      perL,
      perG,
      before,
      purchases,
      after
    })
  }

  const final = party.map(p => ({ name: p.name, ...snap(p.char) }))
  const totalPartyL = ENCOUNTERS.reduce((s, e) => s + encounterLoot(e).lumens, 0)
  const totalPartyG = ENCOUNTERS.reduce((s, e) => s + encounterLoot(e).gil, 0)

  return {
    mode,
    log,
    final,
    partyRemainderL,
    partyRemainderG,
    totalPartyL,
    totalPartyG,
    perPlayerTotalL: split ? log.reduce((s, r) => s + r.perL, 0) : totalPartyL,
    perPlayerTotalG: split ? log.reduce((s, r) => s + r.perG, 0) : totalPartyG
  }
}

function fmtBuy(b) {
  if (b.type === 'skill') return `${b.name} (T${b.tier}, ${b.cost}L)`
  if (b.type === 'stat') return `${b.stat} +1 (${b.cost}L)`
  return `${b.item} (${b.cost}G)`
}

function printMode(result) {
  const title = result.mode === 'split'
    ? 'SPLIT LOOT (floor ÷4 · whole numbers only · rest purchases)'
    : 'FULL LOOT (each player gets 100% · rest purchases)'
  console.log(`\n${'═'.repeat(70)}`)
  console.log(` ${title}`)
  console.log('═'.repeat(70))

  if (result.mode === 'split') {
    console.log(`\nParty loot: ${result.totalPartyL}L · ${result.totalPartyG.toLocaleString()}G`)
    console.log(`Unallocated remainder (integer split): ${result.partyRemainderL}L · ${result.partyRemainderG}G`)
    console.log(`Per player earned: ${result.perPlayerTotalL}L · ${result.perPlayerTotalG.toLocaleString()}G\n`)
  } else {
    console.log(`\nPer player earned (×${PARTY} party total): ${result.perPlayerTotalL}L · ${result.perPlayerTotalG.toLocaleString()}G`)
    console.log(`Party-wide if all kept: ${result.totalPartyL * PARTY}L · ${(result.totalPartyG * PARTY).toLocaleString()}G\n`)
  }

  console.log('START (Level 5 starters, before adventure):')
  for (const row of result.log[0].before) {
    console.log(`  ${row.name}: Lv${row.level} · ${row.L}L · ${row.G}G · HP${row.hp} · T${row.maxTier} skills`)
  }

  for (const step of result.log) {
    console.log(`\n${'─'.repeat(70)}`)
    console.log(`Encounter ${step.enc}`)
    console.log(`  Fight loot (party): ${step.loot.lumens}L · ${step.loot.gil.toLocaleString()}G`)
    for (const line of step.loot.lines) console.log(`    ${line}`)
    console.log(`  Each player receives: +${step.perL}L · +${step.perG.toLocaleString()}G`)
    console.log('  ── Rest (spending only) ──')

    for (const p of step.purchases) {
      const spent = p.buys.length
        ? p.buys.map(fmtBuy).join('; ')
        : 'bank all (nothing affordable or saving)'
      const aft = step.after.find(a => a.name === p.name)
      console.log(`  ${p.name}: ${spent}`)
      console.log(`    → Lv${aft.level} (${aft.prog}) · ${aft.L}L · ${aft.G}G · HP${aft.hp} · ACC${aft.acc} STR${aft.str} MAG${aft.mag} PD${aft.pd} · ${aft.armor} · ${aft.pots}`)
    }
  }

  console.log(`\n${'─'.repeat(70)}`)
  console.log('FINAL (after Rest 5):')
  for (const row of result.final) {
    console.log(`  ${row.name}: Lv${row.level} (${row.prog}) · ${row.L}L · ${row.G}G · HP${row.hp} · ACC${row.acc} STR${row.str} MAG${row.mag} PD${row.pd} MD${row.md}`)
    console.log(`    ${row.skills} skills (max tier ${row.maxTier}) · ${row.armor} · ${row.pots}`)
  }
}

const splitResult = runMode('split')
const fullResult = runMode('full')

console.log('══════════════════════════════════════════════════════════════════════')
console.log(' LUMENFORGE — 5-ENCOUNTER ADVENTURE (4 Level-5 starters)')
console.log(' Rules: no spending during fights · rest & shop after each encounter')
console.log(' Rest priority: next skill if legal → fix ACC/STR/MAG/PD → then HP')
console.log('══════════════════════════════════════════════════════════════════════')

printMode(splitResult)
printMode(fullResult)

console.log(`\n${'═'.repeat(70)}`)
console.log(' COMPARISON')
console.log('═'.repeat(70))
console.log('\n| Metric (per player) | Split (÷4) | Full loot each |')
console.log('|---------------------|------------|----------------|')
console.log(`| Lumens earned       | ${String(splitResult.perPlayerTotalL).padStart(10)} | ${String(fullResult.perPlayerTotalL).padStart(14)} |`)
console.log(`| Gil earned          | ${String(splitResult.perPlayerTotalG).padStart(10)} | ${String(fullResult.perPlayerTotalG).padStart(14)} |`)
console.log(`| Final level (avg)   | ${(splitResult.final.reduce((s, r) => s + r.level, 0) / 4).toFixed(1).padStart(10)} | ${(fullResult.final.reduce((s, r) => s + r.level, 0) / 4).toFixed(1).padStart(14)} |`)
console.log(`| Final HP (avg)      | ${(splitResult.final.reduce((s, r) => s + r.hp, 0) / 4).toFixed(0).padStart(10)} | ${(fullResult.final.reduce((s, r) => s + r.hp, 0) / 4).toFixed(0).padStart(14)} |`)
console.log(`| Banked Lumens       | ${String(splitResult.final.reduce((s, r) => s + r.L, 0)).padStart(10)} | ${String(fullResult.final.reduce((s, r) => s + r.L, 0)).padStart(14)} |`)
