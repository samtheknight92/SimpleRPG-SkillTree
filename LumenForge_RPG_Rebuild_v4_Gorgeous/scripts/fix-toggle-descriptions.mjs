/**
 * Fusion toggles are buffs, not attacks — rewrite descriptions accordingly.
 * Run: node scripts/fix-toggle-descriptions.mjs
 */
import fs from 'fs'
import path from 'path'
import vm from 'vm'
import { fileURLToPath } from 'url'

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const skillsPath = path.join(root, 'data', 'skills-data.js')

function loadSkills() {
  const code = fs.readFileSync(skillsPath, 'utf8')
  const sandbox = { console, window: {}, globalThis: {} }
  sandbox.globalThis.window = sandbox.window
  vm.createContext(sandbox)
  vm.runInContext(code, sandbox)
  return { code, data: sandbox.window.SKILLS_DATA }
}

function rewriteToggle(desc) {
  if (!/^Toggle:/.test(desc) || !/Attack roll/.test(desc)) return desc

  let weapon = 'attacks'
  if (/Ranged/i.test(desc)) weapon = 'ranged attacks'
  else if (/Sword/i.test(desc)) weapon = 'sword attacks'
  else if (/Dagger/i.test(desc)) weapon = 'dagger attacks'
  else if (/Polearm/i.test(desc)) weapon = 'polearm attacks'
  else if (/Hammer/i.test(desc)) weapon = 'hammer attacks'
  else if (/Axe/i.test(desc)) weapon = 'axe attacks'
  else if (/Staff/i.test(desc)) weapon = 'staff attacks'

  if (/Treat target Physical Defence as 2 lower/i.test(desc)) {
    return `Toggle: While active, ${weapon} gain +1d6 earth damage on hit; attack rolls against targets treat Physical Defence as 2 lower. Costs stamina per turn while active.`
  }
  if (/push target 5ft/i.test(desc)) {
    return `Toggle: While active, ${weapon} gain +1d6 wind damage on hit and push the target 5ft on a hit. Costs stamina per turn while active.`
  }
  if (/Physical Defence is 1 lower for 2 turns/i.test(desc)) {
    return `Toggle: While active, ${weapon} gain +1d6 water damage on hit; on a hit, the target's Physical Defence is 1 lower for 2 turns. Costs stamina per turn while active.`
  }

  const elem = desc.match(/\+1d6 (\w+)/i)?.[1] || 'bonus'
  const chance = desc.match(/(\d+)% chance to apply ([^.]+)/i)
  const chancePart = chance ? ` and have a ${chance[1]}% chance to apply ${chance[2].trim()}` : ''
  const cap = elem.charAt(0).toUpperCase() + elem.slice(1)
  return `Toggle: While active, ${weapon} gain +1d6 ${cap} damage on hit${chancePart}. Costs stamina per turn while active.`
}

function flattenSkills(node) {
  const rows = []
  for (const value of Object.values(node || {})) {
    if (Array.isArray(value)) rows.push(...value.filter(s => s?.id))
    else if (value && typeof value === 'object') rows.push(...flattenSkills(value))
  }
  return rows
}

function walk(node) {
  if (Array.isArray(node)) {
    for (const skill of node) {
      if (skill?.desc) skill.desc = rewriteToggle(skill.desc)
    }
    return
  }
  if (node && typeof node === 'object') {
    for (const value of Object.values(node)) walk(value)
  }
}

const { code, data } = loadSkills()
walk(data)

let out = code
for (const skill of flattenSkills(data)) {
  const newDesc = skill.desc.replace(/\\/g, '\\\\').replace(/"/g, '\\"')
  const re = new RegExp(`("id": "${skill.id}"[\\s\\S]*?"desc": ")(?:[^"\\\\]|\\\\.)*(")`, 'm')
  if (!re.test(out)) {
    console.warn('Could not patch:', skill.id)
    continue
  }
  out = out.replace(re, `$1${newDesc}$2`)
}

fs.writeFileSync(skillsPath, out, 'utf8')
const fixed = flattenSkills(data).filter(s => /^Toggle: While active/.test(s.desc)).length
console.log(`Fixed ${fixed} toggle descriptions.`)
