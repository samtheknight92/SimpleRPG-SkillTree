#!/usr/bin/env node
/**
 * Save import/export logic tests — no browser or Python required.
 * Mirrors isFullSaveExport / merge behaviour from js/storage.js.
 * Run: node scripts/test-save-roundtrip.mjs
 */
import assert from 'node:assert/strict'

function isFullSaveExport(parsed) {
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return false
  if (!Array.isArray(parsed.characters)) return false
  return Boolean(parsed.ui) || parsed.activeId != null
}

function mergeCharactersById(existing, imported) {
  const byId = new Map(existing.map(character => [character.id, character]))
  imported.forEach(character => byId.set(character.id, character))
  return [...byId.values()]
}

function applySaveSim(state, parsed, { replace = false } = {}) {
  const characters = Array.isArray(parsed) ? parsed : parsed.characters
  if (!Array.isArray(characters)) throw new Error('No characters array')
  if (replace) {
    state.characters = characters.map(c => ({ ...c }))
    state.activeId = parsed.activeId || characters[0]?.id || null
    if (parsed.ui) Object.assign(state.ui, parsed.ui)
  } else {
    state.characters = mergeCharactersById(state.characters, characters.map(c => ({ ...c })))
    if (parsed.activeId && state.characters.some(c => c.id === parsed.activeId)) {
      state.activeId = parsed.activeId
    }
  }
}

const FULL_UI_KEYS = [
  'tab', 'skillCategory', 'skillSubcategory', 'skillSearch',
  'itemSearch', 'itemCategory', 'itemSource', 'itemRarity',
  'itemBuyableOnly', 'itemSort', 'itemPage', 'gmMode',
  'initiativeTracker', 'gmNpcTurnCharacterIds',
  'characterFolderNames', 'characterFolderOrder', 'characterFolderOpen',
  'gmSpawnFolder'
]

const tests = []

function test(name, fn) {
  tests.push({ name, fn })
}

test('legacy export { version, characters } is not a full save', () => {
  assert.equal(isFullSaveExport({ version: 2, characters: [{ id: 'a', name: 'A' }] }), false)
})

test('full save detected when ui object present', () => {
  assert.equal(isFullSaveExport({ version: 2, characters: [], ui: { tab: 'shop' } }), true)
})

test('full save detected when activeId present', () => {
  assert.equal(isFullSaveExport({ version: 2, characters: [], activeId: 'char_1' }), true)
})

test('raw character array is not a full save', () => {
  assert.equal(isFullSaveExport([{ id: 'a' }]), false)
})

test('merge keeps existing characters and updates by id', () => {
  const state = {
    characters: [
      { id: 'keep', name: 'Keeper', folder: 'Party' },
      { id: 'update', name: 'Old Name', folder: 'Party' }
    ],
    activeId: 'keep',
    ui: { gmMode: true, characterFolderNames: ['Party'] }
  }
  applySaveSim(state, {
    version: 2,
    characters: [{ id: 'update', name: 'New Name', folder: 'NPCs' }],
    activeId: 'update'
  }, { replace: false })

  assert.equal(state.characters.length, 2)
  assert.equal(state.characters.find(c => c.id === 'keep')?.name, 'Keeper')
  assert.equal(state.characters.find(c => c.id === 'update')?.name, 'New Name')
  assert.equal(state.activeId, 'update')
  assert.equal(state.ui.gmMode, true, 'merge must not wipe GM mode')
  assert.deepEqual(state.ui.characterFolderNames, ['Party'], 'merge must not wipe folders')
})

test('replace restores full ui and roster', () => {
  const state = {
    characters: [{ id: 'old', name: 'Old' }],
    activeId: 'old',
    ui: { gmMode: false, tab: 'character', characterFolderNames: [] }
  }
  const incoming = {
    version: 2,
    activeId: 'new',
    ui: {
      tab: 'gm',
      gmMode: true,
      characterFolderNames: ['Encounters'],
      characterFolderOrder: ['Encounters'],
      characterFolderOpen: { Encounters: true },
      gmSpawnFolder: 'Encounters',
      initiativeTracker: { entries: [{ id: 'e1', name: 'Goblin', initiative: 12 }], activeEntryId: 'e1' },
      gmNpcTurnCharacterIds: ['new'],
      itemPage: 2,
      itemSource: 'shop',
      itemBuyableOnly: false
    },
    characters: [{ id: 'new', name: 'Imported', folder: 'Encounters' }]
  }
  applySaveSim(state, incoming, { replace: true })

  assert.equal(state.characters.length, 1)
  assert.equal(state.activeId, 'new')
  assert.equal(state.ui.tab, 'gm')
  assert.equal(state.ui.gmMode, true)
  assert.deepEqual(state.ui.characterFolderNames, ['Encounters'])
  assert.equal(state.ui.gmSpawnFolder, 'Encounters')
  assert.equal(state.ui.initiativeTracker.entries[0].name, 'Goblin')
})

test('serializeSave shape in storage.js includes all UI keys', async () => {
  const { readFileSync } = await import('node:fs')
  const { fileURLToPath } = await import('node:url')
  const { dirname, join } = await import('node:path')
  const root = join(dirname(fileURLToPath(import.meta.url)), '..')
  const src = readFileSync(join(root, 'js', 'storage.js'), 'utf8')
  for (const key of FULL_UI_KEYS) {
    assert.match(src, new RegExp(`\\b${key}\\b:`), `serializeSave ui missing key: ${key}`)
  }
  assert.match(src, /export function serializeSave/, 'serializeSave must be exported')
  assert.match(src, /export function applySavePayload/, 'applySavePayload must be exported')
})

test('exportData uses serializeSave for full export', async () => {
  const { readFileSync } = await import('node:fs')
  const { fileURLToPath } = await import('node:url')
  const { dirname, join } = await import('node:path')
  const root = join(dirname(fileURLToPath(import.meta.url)), '..')
  const src = readFileSync(join(root, 'js', 'actions.js'), 'utf8')
  assert.match(src, /serializeSave\(\)/, 'exportData must call serializeSave for full export')
  assert.match(src, /isFullSaveExport/, 'importData must detect full saves')
  assert.match(src, /applySavePayload/, 'importData must use applySavePayload')
})

let passed = 0
let failed = 0

console.log('=== Save round-trip tests ===\n')

for (const { name, fn } of tests) {
  try {
    fn()
    console.log(`✓ ${name}`)
    passed += 1
  } catch (error) {
    console.log(`✗ ${name}`)
    console.log(`  ${error.message}`)
    failed += 1
  }
}

console.log(`\n${passed} passed, ${failed} failed`)
process.exit(failed ? 1 : 0)
