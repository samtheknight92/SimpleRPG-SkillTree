#!/usr/bin/env node
/**
 * Attach activationEffects (duration + potency) to skills that apply status on use.
 * Rewrites data/skills-data.js; career skills get the same via generate-careers.mjs.
 */
import fs from 'fs'
import path from 'path'
import vm from 'vm'
import { fileURLToPath } from 'url'
import {
  resolveActivationEffectsForSkill,
  walkSkillLists
} from './lib/resolve-activation-effects.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')
const dataDir = path.join(root, 'data')
const jsonDir = path.join(dataDir, 'json')

function loadJsObject(file, exportName) {
  const code = fs.readFileSync(path.join(dataDir, file), 'utf8')
  const sandbox = { window: {} }
  vm.createContext(sandbox)
  vm.runInContext(code, sandbox)
  return sandbox.window[exportName]
}

function loadCareerActionBuffs() {
  const raw = fs.readFileSync(path.join(dataDir, 'career-skill-meta.js'), 'utf8').replace(/^\uFEFF/, '').replace(/^export const /gm, 'const ')
  const sandbox = {}
  vm.createContext(sandbox)
  vm.runInContext(`${raw}\n;globalThis.__buffs = CAREER_ACTION_BUFFS`, sandbox)
  return sandbox.__buffs || {}
}

function attachToSkills(skills, effects, careerActionBuffs) {
  let attached = 0
  let cleared = 0
  for (const skill of walkSkillLists(skills)) {
    const resolved = resolveActivationEffectsForSkill(skill, effects, { careerActionBuffs })
    if (resolved.length) {
      skill.activationEffects = resolved
      attached += 1
    } else if (skill.activationEffects) {
      delete skill.activationEffects
      cleared += 1
    }
  }
  return { attached, cleared }
}

function writeRacesData(raceSkillTrees) {
  const filePath = path.join(dataDir, 'races-data.js')
  const raw = fs.readFileSync(filePath, 'utf8')
  const marker = 'const RACE_SKILL_TREES ='
  const headerEnd = raw.indexOf(marker)
  if (headerEnd === -1) throw new Error('Could not find RACE_SKILL_TREES in races-data.js')

  const footerStart = raw.indexOf('window.RACES_DATA = RACES_DATA')
  if (footerStart === -1) throw new Error('Could not find races-data.js footer')

  const header = raw.slice(0, headerEnd)
  const footer = raw.slice(footerStart)
  const body = `${marker} ${JSON.stringify(raceSkillTrees, null, 4)};\n\n    `
  fs.writeFileSync(filePath, header + body + footer, 'utf8')
}
function writeSkillsData(skillsData) {
  const filePath = path.join(dataDir, 'skills-data.js')
  const raw = fs.readFileSync(filePath, 'utf8')
  const marker = 'const SKILLS_DATA ='
  const headerEnd = raw.indexOf(marker)
  if (headerEnd === -1) throw new Error('Could not find SKILLS_DATA in skills-data.js')

  const header = raw.slice(0, headerEnd)
  const body = `${marker} ${JSON.stringify(skillsData, null, 4)};\n\nwindow.SKILLS_DATA = SKILLS_DATA;\n`
  fs.writeFileSync(filePath, header + body, 'utf8')
}

function enrichCareerActionBuffs(buffs, effects) {
  let changed = false
  for (const [skillId, row] of Object.entries(buffs)) {
    const effect = effects[row.effectId]
    if (!effect) continue
    if (row.potency === undefined) {
      const potency = effect.potency
      row.potency = typeof potency === 'number' && Number.isFinite(potency) ? potency : 0
      changed = true
    }
  }
  return changed
}

function writeCareerActionBuffs(buffs) {
  const filePath = path.join(dataDir, 'career-skill-meta.js')
  let raw = fs.readFileSync(filePath, 'utf8')
  const start = raw.indexOf('export const CAREER_ACTION_BUFFS = {')
  const end = raw.indexOf('\n}', start) + 2
  if (start === -1 || end <= start) throw new Error('CAREER_ACTION_BUFFS block not found')

  const lines = ['export const CAREER_ACTION_BUFFS = {']
  for (const [skillId, row] of Object.entries(buffs)) {
    const parts = [`effectId: '${row.effectId}'`, `duration: ${row.duration}`]
    if (row.potency !== undefined) parts.push(`potency: ${row.potency}`)
    lines.push(`  ${skillId}: { ${parts.join(', ')} },`)
  }
  lines.push('}')
  raw = raw.slice(0, start) + lines.join('\n') + raw.slice(end)
  fs.writeFileSync(filePath, raw, 'utf8')
}

const effects = JSON.parse(fs.readFileSync(path.join(jsonDir, 'effects.json'), 'utf8'))
const careerActionBuffs = loadCareerActionBuffs()
const buffsChanged = enrichCareerActionBuffs(careerActionBuffs, effects)
if (buffsChanged) writeCareerActionBuffs(careerActionBuffs)

const skillsData = loadJsObject('skills-data.js', 'SKILLS_DATA')
const raceSkillTrees = loadJsObject('races-data.js', 'RACE_SKILL_TREES')
const skillsResult = attachToSkills(skillsData, effects, careerActionBuffs)
const racialResult = attachToSkills(raceSkillTrees, effects, careerActionBuffs)
writeSkillsData(skillsData)
writeRacesData(raceSkillTrees)

console.log(`activationEffects: ${skillsResult.attached} weapon-tree, ${racialResult.attached} racial (${skillsResult.cleared + racialResult.cleared} cleared)`)
if (buffsChanged) console.log('Added explicit potency to CAREER_ACTION_BUFFS')
