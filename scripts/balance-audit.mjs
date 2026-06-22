#!/usr/bin/env node
/**
 * Balance audit — gear costs, level-43 budgets, premade loot vs progression.
 * Run: node scripts/balance-audit.mjs
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

import {
  LUMEN_PER_LEVEL,
  GIL_PER_LEVEL,
  HUMANOID_MONSTER_GIL
} from './lib/premade-generator.mjs'
import { TIER_LUMEN_COST, TIER_MIN_LEVEL, minLevelForTier, characterLevelFromTotal } from './lib/progression.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')
const jsonDir = path.join(root, 'data', 'json')

const CURRENCY = { gold: 2500, silver: 100, copper: 1 }
const toGil = p => (Number(p?.gold || 0) * CURRENCY.gold) + (Number(p?.silver || 0) * CURRENCY.silver) + Number(p?.copper || 0)

const DEFAULT_STATS = { hp: 10, stamina: 10, strength: -3, magicPower: -3, accuracy: -3, speed: 2, physicalDefence: 8, magicalDefence: 8 }
const STAT_RULES = { hp: 3, stamina: 4, strength: 10, magicPower: 10, accuracy: 8, speed: 12, physicalDefence: 10, magicalDefence: 10 }
const STAT_MAX = { hp: 500, stamina: 200, strength: 15, magicPower: 15, accuracy: 12, speed: 20, physicalDefence: 30, magicalDefence: 30 }
const START_LUMEN = 113
const START_GIL = 2400
const TARGET_LEVEL = 43

const tierLevel = t => Number(t || 1) / 5
const statLevel = k => (k === 'hp' || k === 'stamina' ? 0.2 : 0.4)

function walkSkills(node, out = []) {
  if (Array.isArray(node)) {
    for (const s of node) if (s?.id) out.push(s)
    return out
  }
  if (node && typeof node === 'object') {
    for (const v of Object.values(node)) walkSkills(v, out)
  }
  return out
}

const skillsRoot = JSON.parse(fs.readFileSync(path.join(jsonDir, 'skills.json'), 'utf8'))
const itemsRoot = JSON.parse(fs.readFileSync(path.join(jsonDir, 'items.json'), 'utf8'))
const premades = JSON.parse(fs.readFileSync(path.join(jsonDir, 'premade-characters.json'), 'utf8'))

const allSkills = walkSkills(skillsRoot)
const skillById = new Map(allSkills.map(s => [s.id, s]))

const items = []
for (const group of Object.values(itemsRoot)) {
  if (!group || typeof group !== 'object') continue
  for (const item of Object.values(group)) if (item?.id) items.push(item)
}

const shop = items.filter(i => i.price && toGil(i.price) > 0)
const weapons = shop.filter(i => i.type === 'weapon').sort((a, b) => toGil(b.price) - toGil(a.price))
const armors = shop.filter(i => i.type === 'armor').sort((a, b) => toGil(b.price) - toGil(a.price))
const accessories = shop.filter(i => i.type === 'accessory').sort((a, b) => toGil(b.price) - toGil(a.price))
const potions = shop.filter(i => /potion|elixir|draught|tonic/i.test(`${i.name} ${i.id}`)).sort((a, b) => toGil(b.price) - toGil(a.price))

const topWeapon = weapons.find(i => i.rarity === 'legendary') || weapons[0]
const topArmor = armors.find(i => i.rarity === 'legendary') || armors[0]
const topAccessory = accessories[0]
const healItems = [
  potions.find(p => /health|healing/i.test(`${p.id} ${p.name}`)),
  potions.find(p => /stamina/i.test(`${p.id} ${p.name}`)),
  potions.find(p => /greater|super|major|strong/i.test(`${p.id} ${p.name}`)) || potions[2]
].filter(Boolean)

const kitLines = [
  { slot: 'Weapon', name: topWeapon?.name, gil: toGil(topWeapon?.price) },
  { slot: 'Armor', name: topArmor?.name, gil: toGil(topArmor?.price) },
  { slot: 'Accessory', name: topAccessory?.name, gil: toGil(topAccessory?.price) },
  ...healItems.map((h, i) => ({ slot: `Healing x3 (${i + 1})`, name: h.name, gil: toGil(h.price) * 3 }))
]
const kitGilTotal = kitLines.reduce((sum, row) => sum + row.gil, 0)

let maxStatLevels = 0
let maxStatLumen = 0
for (const [stat, base] of Object.entries(DEFAULT_STATS)) {
  const purchases = Math.max(0, STAT_MAX[stat] - base)
  maxStatLevels += purchases * statLevel(stat)
  maxStatLumen += purchases * STAT_RULES[stat]
}

const allSkillLevels = allSkills.reduce((s, sk) => s + tierLevel(sk.tier), 0)
const allSkillLumen = allSkills.reduce((s, sk) => s + Number(sk.cost || 0), 0)

function packSkillsForLevel(displayLevel) {
  const pool = [...allSkills]
  let rem = Math.max(0, displayLevel - 1)
  let skillLevels = 0
  let count = 0
  let lumen = 0
  const picked = []

  while (rem > 0.001) {
    const charLevel = characterLevelFromTotal(skillLevels)
    const eligible = pool.filter(sk =>
      tierLevel(sk.tier) <= rem + 0.001 && minLevelForTier(sk.tier) <= charLevel
    )
    if (!eligible.length) break
    const sk = eligible.sort((a, b) => (b.tier - a.tier) || (a.cost - b.cost))[0]
    rem -= tierLevel(sk.tier)
    skillLevels += tierLevel(sk.tier)
    lumen += Number(sk.cost || 0)
    count += 1
    picked.push({ id: sk.id, tier: sk.tier, cost: sk.cost })
    pool.splice(pool.indexOf(sk), 1)
  }
  return { count, lumen, leftover: rem, picked, skillLevels }
}

/** Skills + HP padding when tier gates block pure skill packing (matches fresh-sheet flow). */
function packSkillsForLevelWithStatUnlock(displayLevel) {
  let rem = Math.max(0, displayLevel - 1)
  let skillLevels = 0
  let statLevels = 0
  let lumen = 0
  let hpPurchases = 0
  const pool = [...allSkills]
  const picked = []

  while (rem > 0.001) {
    const charLevel = characterLevelFromTotal(skillLevels + statLevels)
    const eligible = pool.filter(sk =>
      tierLevel(sk.tier) <= rem + 0.001 && minLevelForTier(sk.tier) <= charLevel
    )
    if (eligible.length) {
      const sk = eligible.sort((a, b) => (b.tier - a.tier) || (a.cost - b.cost))[0]
      rem -= tierLevel(sk.tier)
      skillLevels += tierLevel(sk.tier)
      lumen += Number(sk.cost || 0)
      picked.push({ id: sk.id, tier: sk.tier, cost: sk.cost, kind: 'skill' })
      pool.splice(pool.indexOf(sk), 1)
      continue
    }
    if (rem < statLevel('hp') - 0.001) break
    rem -= statLevel('hp')
    statLevels += statLevel('hp')
    lumen += STAT_RULES.hp
    hpPurchases += 1
    picked.push({ kind: 'hp', cost: STAT_RULES.hp })
  }
  return {
    count: picked.filter(p => p.kind === 'skill').length,
    lumen,
    leftover: rem,
    picked,
    skillLevels,
    statLevels,
    hpPurchases
  }
}

function packStatsForLevel(displayLevel) {
  let rem = Math.max(0, displayLevel - 1)
  let lumen = 0
  const purchases = {}
  const final = { ...DEFAULT_STATS }
  for (const stat of ['strength', 'magicPower', 'physicalDefence', 'magicalDefence', 'accuracy', 'speed', 'stamina', 'hp']) {
    const base = DEFAULT_STATS[stat]
    const max = STAT_MAX[stat]
    const cost = STAT_RULES[stat]
    const lv = statLevel(stat)
    let cur = base
    while (cur < max && rem >= lv - 0.001) {
      cur += 1
      rem -= lv
      lumen += cost
      purchases[stat] = (purchases[stat] || 0) + 1
      final[stat] = cur
    }
  }
  return { lumen, purchases, final, leftover: rem }
}

const skillOnly43 = packSkillsForLevelWithStatUnlock(TARGET_LEVEL)
const skillOnly43Naive = packSkillsForLevel(TARGET_LEVEL)
const statOnly43 = packStatsForLevel(TARGET_LEVEL)

const tier5 = allSkills.filter(s => s.tier === 5).sort((a, b) => a.cost - b.cost)
const tier5Lumen43 = tier5.slice(0, 43).reduce((s, sk) => s + sk.cost, 0)

const costByTier = {}
for (const s of allSkills) {
  const t = s.tier || 1
  if (!costByTier[t]) costByTier[t] = []
  costByTier[t].push(s.cost)
}

function premadeFullLevel(entry) {
  let skillLevels = 0
  for (const id of entry.skills || []) {
    const sk = skillById.get(id)
    if (sk) skillLevels += tierLevel(sk.tier)
  }
  let statLevels = 0
  for (const [stat, base] of Object.entries(DEFAULT_STATS)) {
    const purchases = Math.max(0, Number(entry.stats?.[stat] ?? base) - base)
    statLevels += purchases * statLevel(stat)
  }
  return {
    skillLevels,
    statLevels,
    total: skillLevels + statLevels,
    level: characterLevelFromTotal(skillLevels + statLevels)
  }
}

function auditPremadeSpend(entry) {
  let skillLumen = 0
  let skillLevels = 0
  for (const id of entry.skills || []) {
    const sk = skillById.get(id)
    if (!sk) continue
    skillLumen += Number(sk.cost || 0)
    skillLevels += tierLevel(sk.tier)
  }
  let statLumen = 0
  let statLevels = 0
  for (const [stat, base] of Object.entries(DEFAULT_STATS)) {
    const purchases = Math.max(0, Number(entry.stats?.[stat] ?? base) - base)
    statLumen += purchases * STAT_RULES[stat]
    statLevels += purchases * statLevel(stat)
  }
  const level = characterLevelFromTotal(skillLevels + statLevels)
  const gateViolations = (entry.skills || [])
    .map(id => skillById.get(id))
    .filter(Boolean)
    .filter(sk => minLevelForTier(sk.tier) > level)
    .map(sk => `${sk.id} (T${sk.tier} needs Lv${minLevelForTier(sk.tier)})`)
  return {
    level,
    skillLevels,
    statLevels,
    skillLumen,
    statLumen,
    lumenSpent: skillLumen + statLumen,
    gateViolations
  }
}

const level5Starters = premades.filter(p => String(p.premadeId || '').startsWith('level5_'))

const premadeRows = premades.map(p => {
  const lv = premadeFullLevel(p)
  return {
    id: p.premadeId,
    name: p.name,
    category: p.category,
    level: lv.level,
    skillLevels: lv.skillLevels,
    statLevels: lv.statLevels,
    lumens: p.lumens,
    gil: p.gil,
    skills: (p.skills || []).length
  }
}).sort((a, b) => b.level - a.level)

const monsters = premades.filter(p => p.category === 'monster')
const humanoids = premades.filter(p => p.category !== 'monster')
const maxLumenDrop = Math.max(...premades.map(p => p.lumens))
const maxGilDrop = Math.max(...premades.map(p => p.gil))
const avgMonsterLumen = Math.round(monsters.reduce((s, p) => s + p.lumens, 0) / monsters.length)
const avgNpcGil = Math.round(humanoids.reduce((s, p) => s + p.gil, 0) / humanoids.length)

// Level-43 enemies only
const lv43Enemies = premadeRows.filter(r => r.level >= TARGET_LEVEL)

console.log('═══════════════════════════════════════════════════════')
console.log(' LUMENFORGE BALANCE AUDIT')
console.log('═══════════════════════════════════════════════════════\n')

console.log('## Progression rules')
console.log('  Tier level gates:', Object.entries(TIER_MIN_LEVEL).map(([t, lv]) => `T${t}→Lv${lv}`).join(' · '))
console.log('  Tier Lumen floors:', Object.entries(TIER_LUMEN_COST).map(([t, c]) => `T${t}=${c}L`).join(' · '))
console.log('')

console.log('## Starting character')
console.log(`  ${START_LUMEN} Lumens · ${START_GIL.toLocaleString()} Gil\n`)

console.log('## High-tier gear kit (best shop prices + 3× each healing item)')
for (const row of kitLines) {
  console.log(`  ${row.slot.padEnd(22)} ${row.name.padEnd(28)} ${row.gil.toLocaleString()} Gil`)
}
console.log(`  ${'TOTAL'.padEnd(22)} ${''.padEnd(28)} ${kitGilTotal.toLocaleString()} Gil`)
console.log(`  Net after starting Gil: ${Math.max(0, kitGilTotal - START_GIL).toLocaleString()} Gil to earn\n`)

console.log('## Level 43 progression budgets')
console.log('  Level rule: tier-5 skill = +1 level · tier N = N÷5 · HP/STA upgrade = +0.2 · other stat = +0.4\n')

console.log('  A) Skills only (gate-aware + HP unlock padding) to reach level 43:')
console.log(`     ${skillOnly43.count} skills · ${skillOnly43.hpPurchases} HP upgrades · ${skillOnly43.lumen.toLocaleString()} Lumens (${(skillOnly43.lumen - START_LUMEN).toLocaleString()} beyond start)`)
if (skillOnly43.leftover > 0.01) {
  console.log(`     Note: ${skillOnly43.leftover.toFixed(1)} levels unreachable under tier gates with this greedy pack`)
}
console.log(`     Naive (ignores gates): ${skillOnly43Naive.count} skills · ${skillOnly43Naive.lumen.toLocaleString()} Lumens\n`)

console.log('  B) Stats only (no skills) to reach level 43:')
console.log(`     ${statOnly43.lumen.toLocaleString()} Lumens (${(statOnly43.lumen - START_LUMEN).toLocaleString()} beyond start)`)
console.log(`     Example spread: STR ${statOnly43.final.strength}, MAG ${statOnly43.final.magicPower}, ACC ${statOnly43.final.accuracy}, SPD ${statOnly43.final.speed}, PD ${statOnly43.final.physicalDefence}, MD ${statOnly43.final.magicalDefence}, HP ${statOnly43.final.hp}, STA ${statOnly43.final.stamina}\n`)

console.log('  C) Theoretical caps (entire game):')
console.log(`     All ${allSkills.length} skills = +${allSkillLevels.toFixed(1)} levels · ${allSkillLumen.toLocaleString()} Lumens`)
console.log(`     Max every stat = +${maxStatLevels.toFixed(1)} levels · ${maxStatLumen.toLocaleString()} Lumens`)
console.log(`     Combined ceiling ≈ level ${characterLevelFromTotal(allSkillLevels + maxStatLevels)} if you bought everything\n`)

console.log('  Skill costs by tier (Lumen avg/min/max):')
for (const t of [1, 2, 3, 4, 5]) {
  const costs = costByTier[t] || []
  if (!costs.length) continue
  const avg = Math.round(costs.reduce((a, b) => a + b, 0) / costs.length)
  console.log(`     Tier ${t}: ${costs.length} skills · avg ${avg} · ${Math.min(...costs)}–${Math.max(...costs)}`)
}

console.log('\n## Level 5 starter builds (tier ≤2 at Lv5 · T3 unlocks Lv8 · T5 mastery Lv20)')
for (const entry of level5Starters) {
  const spend = auditPremadeSpend(entry)
  const gearGil = START_GIL - Number(entry.gil || 0)
  const maxTier = Math.max(0, ...(entry.skills || []).map(id => skillById.get(id)?.tier || 0))
  console.log(`  ${entry.name} (${entry.premadeId})`)
  console.log(`    Level ${spend.level} · ${(entry.skills || []).length} skills (max tier ${maxTier}) · HP ${entry.stats?.hp ?? DEFAULT_STATS.hp}`)
  console.log(`    Lumens spent: ${spend.lumenSpent} (${spend.skillLumen} skills + ${spend.statLumen} stats) · wallet ${entry.lumens}L`)
  console.log(`    Gil spent: ~${gearGil.toLocaleString()} · wallet ${Number(entry.gil || 0).toLocaleString()}G`)
  if (spend.gateViolations.length) {
    console.log(`    ⚠ Gate violations: ${spend.gateViolations.join(', ')}`)
  }
}

console.log('\n## Milestone: one weapon tree to Sword Mastery (example)')
const swordCap = skillById.get('sword_mastery')
if (swordCap) {
  const chainIds = ['sword_basics', 'sword_stance', 'parry', 'quick_strike', 'riposte', 'defensive_stance', 'master_parry', 'sword_mastery']
  let chainLumen = 0
  let chainLevels = 0
  for (const id of chainIds) {
    const sk = skillById.get(id)
    if (sk) {
      chainLumen += Number(sk.cost || 0)
      chainLevels += tierLevel(sk.tier)
    }
  }
  console.log(`  ${chainIds.length} skills · level +${chainLevels.toFixed(1)} · ${chainLumen} Lumens · capstone unlocks at Lv${minLevelForTier(5)}`)
}

console.log('\n## Highest premade enemies (by skill level)')
for (const row of premadeRows.slice(0, 10)) {
  console.log(`  Lv ${String(row.level).padStart(2)} ${row.name.padEnd(22)} ${row.category.padEnd(10)} +${row.skillLevels.toFixed(1)} sk / +${row.statLevels.toFixed(1)} st · drop ${row.lumens}L / ${row.gil.toLocaleString()}G`)
}

console.log('\n## Defeat loot rules')
console.log(`  Monsters: ${LUMEN_PER_LEVEL} Lumens × level`)
console.log(`  Humanoid NPCs: ${LUMEN_PER_LEVEL} Lumens × level + ${GIL_PER_LEVEL} Gil × level`)
console.log(`  Humanoid monsters (goblins/orcs/etc.): ${LUMEN_PER_LEVEL} Lumens × level + ${HUMANOID_MONSTER_GIL} Gil`)
console.log(`  Monsters (${monsters.length}): avg ${avgMonsterLumen} Lumens · max ${maxLumenDrop}`)
console.log(`  Humanoids (${humanoids.length}): avg ${avgNpcGil.toLocaleString()} Gil · max ${maxGilDrop.toLocaleString()}`)
console.log(`  At level ${TARGET_LEVEL}+: ${lv43Enemies.length} templates — drops ${lv43Enemies.map(e => `${e.name} ${e.lumens}L`).join(', ')}\n`)

console.log('## Farming math (worst-case — every kill pays max drop)')
const kills = (need, drop) => Math.ceil(need / Math.max(1, drop))
console.log(`  Max-lumen boss (${maxLumenDrop}L) → all skills (${allSkillLumen}L): ${kills(allSkillLumen, maxLumenDrop)} kills`)
console.log(`  Max-lumen boss → level-43 skill build (${skillOnly43.lumen}L): ${kills(skillOnly43.lumen, maxLumenDrop)} kills`)
console.log(`  Max-lumen boss → max all stats (${maxStatLumen}L): ${kills(maxStatLumen, maxLumenDrop)} kills`)
console.log(`  Max-gil NPC (${maxGilDrop.toLocaleString()}G) → full gear kit (${kitGilTotal.toLocaleString()}G): ${kills(kitGilTotal, maxGilDrop)} kills`)
console.log(`  Avg monster (${avgMonsterLumen}L) → level-43 skills: ${kills(skillOnly43.lumen, avgMonsterLumen)} kills`)

console.log('\n## Balance flags')
const flags = []
if (kills(skillOnly43.lumen, maxLumenDrop) <= 3) flags.push('CRITICAL: 3 or fewer top-boss kills fund a full level-43 skill build')
else if (kills(skillOnly43.lumen, maxLumenDrop) <= 6) flags.push('WARNING: 6 or fewer top-boss kills fund level-43 skills')
if (kills(allSkillLumen, maxLumenDrop) <= 12) flags.push('WARNING: ~12 top-boss kills buys every skill in the game')
if (kills(kitGilTotal, maxGilDrop) <= 2) flags.push('Gear kit is cheap vs richest humanoid drop')
if (maxStatLumen < skillOnly43.lumen) flags.push('Stat-maxed build costs LESS Lumens than skill level-43 build')
if (!flags.length) flags.push('No automatic red flags — review tier distribution manually')
for (const f of flags) console.log(`  • ${f}`)

console.log('\n## Suggested targets (current rules)')
const need43 = Math.max(0, skillOnly43.lumen - START_LUMEN)
console.log(`  Boss Lv43 (${43 * LUMEN_PER_LEVEL}L/kill) → gate-aware Lv43 build (${skillOnly43.lumen}L): ~${kills(need43, 43 * LUMEN_PER_LEVEL)} kills beyond start`)
console.log(`  Avg monster Lv8 (${8 * LUMEN_PER_LEVEL}L/kill) → same: ~${kills(need43, 8 * LUMEN_PER_LEVEL)} kills beyond start`)
console.log(`  Rich NPC Lv11 (${11 * GIL_PER_LEVEL}G/kill) → full gear kit (${kitGilTotal.toLocaleString()}G): ~${kills(kitGilTotal, 11 * GIL_PER_LEVEL)} kills`)
console.log('')
