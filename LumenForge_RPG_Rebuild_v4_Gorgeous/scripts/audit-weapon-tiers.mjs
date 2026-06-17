#!/usr/bin/env node
/**
 * Audits weapon progression chains — each step must improve damage, stats, effects, or enchant slots.
 */
import fs from 'fs';
import vm from 'vm';

const code = fs.readFileSync('./data/items-data.js', 'utf8');
const sandbox = { console, window: {}, globalThis: {} };
sandbox.globalThis.window = sandbox.window;
vm.createContext(sandbox);
vm.runInContext(code, sandbox);
const items = sandbox.window.ITEMS_DATA.weapons;

const CHAINS = {
  sword: ['bronze_sword', 'iron_sword', 'steel_sword', 'silver_sword'],
  dagger: ['bronze_dagger', 'iron_dagger', 'silver_dagger', 'poison_dagger', 'shadow_dagger', 'void_dagger', 'shadow_fang'],
  bow: ['training_bow', 'hunting_bow', 'crossbow', 'composite_bow', 'lightning_bow', 'elvish_bow', 'crystal_bow', 'storm_bow', 'celestial_bow'],
  hammer: ['stone_hammer', 'iron_mace', 'war_hammer', 'blessed_mace', 'earth_hammer', 'frost_hammer', 'thunder_hammer', 'titan_hammer', 'void_crusher'],
  axe: ['bronze_axe', 'iron_axe', 'battle_axe', 'double_axe', 'berserker_axe', 'demon_axe', 'executioner_axe', 'chaos_axe', 'world_cleaver'],
  staff: ['wooden_staff', 'quarterstaff', 'mystic_staff', 'crystal_staff', 'arcane_staff', 'void_staff', 'elemental_staff', 'cosmic_staff', 'genesis_rod'],
  polearm: ['bronze_spear', 'iron_spear', 'spear', 'pike', 'halberd', 'glaive', 'dragon_lance', 'infinity_spear', 'reality_piercer'],
};

function priceSilver(item) {
  const p = item.price || {};
  return (p.gold || 0) * 100 + (p.silver || 0) + (p.copper || 0) / 100;
}

function avgDamage(dmg) {
  const m = String(dmg || '').match(/(\d+)d(\d+)/);
  if (!m) return 0;
  return (Number(m[1]) * (Number(m[2]) + 1)) / 2;
}

function upgradeReason(prev, cur) {
  const reasons = [];
  if (avgDamage(cur.damage) > avgDamage(prev.damage)) reasons.push(`damage ${prev.damage || '1'}→${cur.damage}`);
  const prevStats = Object.values(prev.statModifiers || {}).reduce((s, v) => s + Number(v), 0);
  const curStats = Object.values(cur.statModifiers || {}).reduce((s, v) => s + Number(v), 0);
  if (curStats > prevStats) reasons.push('better net stats');
  const prevFx = (prev.specialEffects || []).length;
  const curFx = (cur.specialEffects || []).length;
  if (curFx > prevFx) reasons.push('more effects');
  else if (curFx === prevFx && curFx > 0) {
    const newFx = (cur.specialEffects || []).filter((f) => !(prev.specialEffects || []).includes(f));
    if (newFx.length) reasons.push(`new effects: ${newFx.join(', ')}`);
  }
  if ((cur.enchantmentSlots || 0) > (prev.enchantmentSlots || 0)) reasons.push('more enchant slots');
  return reasons;
}

let issues = 0;
for (const [family, chain] of Object.entries(CHAINS)) {
  console.log(`\n=== ${family.toUpperCase()} ===`);
  for (let i = 0; i < chain.length; i++) {
    const id = chain[i];
    const w = items[id];
    if (!w) {
      console.log(`  MISSING: ${id}`);
      issues++;
      continue;
    }
    const dmg = w.damage || '(default 1)';
    const fx = (w.specialEffects || []).join(', ') || '—';
    console.log(`  ${id}: ${dmg} | ${priceSilver(w).toFixed(0)}s | fx: ${fx} | ench: ${w.enchantmentSlots || 0}`);
    if (i === 0) continue;
    const prev = items[chain[i - 1]];
    const reasons = upgradeReason(prev, w);
    if (!reasons.length) {
      console.log(`    ⚠ NO UPGRADE vs ${chain[i - 1]}`);
      issues++;
    }
  }
}

console.log(issues ? `\n${issues} issue(s) found.` : '\nAll chains OK.');
process.exit(issues ? 1 : 0);
