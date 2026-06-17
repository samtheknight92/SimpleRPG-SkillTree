import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { MANUAL_EFFECT_IDS, NEW_EFFECTS } from '../data/effect-manual.js'

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const effectsPath = path.join(root, 'data/json/effects.json')

const effects = JSON.parse(fs.readFileSync(effectsPath, 'utf8'))
const manualSet = new Set(MANUAL_EFFECT_IDS)

for (const [id, effect] of Object.entries(NEW_EFFECTS)) {
  effects[id] = effect
  manualSet.add(id)
}

for (const effect of Object.values(effects)) {
  effect.manual = manualSet.has(effect.id)
}

if (effects.weapon_enchanted) {
  effects.weapon_enchanted.name = 'Weapon Enchanted'
}

const manualCount = Object.values(effects).filter(effect => effect.manual).length
fs.writeFileSync(effectsPath, `${JSON.stringify(effects, null, 2)}\n`, 'utf8')

console.log(`Tagged ${manualCount} manual effects (${Object.keys(effects).length} total definitions).`)
console.log('Added:', Object.keys(NEW_EFFECTS).join(', '))
