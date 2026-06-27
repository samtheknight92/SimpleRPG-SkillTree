#!/usr/bin/env node
/**
 * Apply tier Lumen cost floors across skill data files.
 * Run via build-data.mjs or: node scripts/adjust-skill-costs.mjs
 */
import fs from 'fs'
import path from 'path'
import vm from 'vm'
import { fileURLToPath } from 'url'
import { adjustSkillCost } from './lib/progression.mjs'
import { walkSkillLists } from './lib/resolve-activation-effects.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')
const dataDir = path.join(root, 'data')

function loadJsObject(file, exportName) {
  const code = fs.readFileSync(path.join(dataDir, file), 'utf8')
  const sandbox = { window: {} }
  vm.createContext(sandbox)
  vm.runInContext(code, sandbox)
  return sandbox.window[exportName]
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

function applyCosts(skills) {
  let changed = 0
  for (const skill of walkSkillLists(skills)) {
    const next = adjustSkillCost(skill)
    if (skill.cost !== next) {
      skill.cost = next
      changed += 1
    }
  }
  return changed
}

const skills = loadJsObject('skills-data.js', 'SKILLS_DATA')
const nSkills = applyCosts(skills)
writeSkillsData(skills)

console.log(`Skill costs updated: ${nSkills} in skills-data.js (careers use generate-careers.mjs tier floors)`)
