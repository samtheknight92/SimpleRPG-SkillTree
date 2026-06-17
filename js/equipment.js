import { getItem } from './cache.js'

const WEAPON_KIND_PATTERNS = [
  ['sword', /\bsword\b/i],
  ['axe', /\baxe\b/i],
  ['dagger', /\bdagger\b/i],
  ['polearm', /\b(spear|polearm|glaive|halberd|lance|pike)\b/i],
  ['hammer', /\b(hammer|mace|club|maul)\b/i],
  ['staff', /\b(staff|wand|rod)\b/i],
  ['ranged', /\b(bow|crossbow|arrow|bolt|ranged|longbow|shortbow)\b/i]
]

function inventoryEntry(character, entryUid) {
  if (!entryUid || !character?.inventory) return null
  return character.inventory.find(inv => inv.uid === entryUid) || null
}

export function getEquippedWeapon(character) {
  return inventoryEntry(character, character?.equipped?.weapon)
    ? getItem(inventoryEntry(character, character.equipped.weapon).itemId)
    : null
}

export function getEquippedOffhandEntry(character) {
  return inventoryEntry(character, character?.equipped?.offhand)
}

export function getEquippedOffhand(character) {
  const entry = getEquippedOffhandEntry(character)
  return entry ? getItem(entry.itemId) : null
}

export function characterHasDualWield(character) {
  if (!character?.skills?.includes('dual_wield')) return false
  return getWeaponKind(getEquippedWeapon(character)) === 'dagger'
}

export function offhandSlotAvailable(character) {
  return characterHasDualWield(character)
}

/** Which equip slot holds this inventory entry uid, if any. */
export function equippedSlotForEntry(character, entryUid) {
  if (!entryUid) return null
  for (const [slot, uid] of Object.entries(character?.equipped || {})) {
    if (uid === entryUid) return slot
  }
  return null
}

export function getWeaponKind(item) {
  if (!item) return null
  const type = String(item.type || '').toLowerCase()
  if (!type.includes('weapon')) return null
  const text = `${item.id} ${item.name} ${item.desc || ''}`
  for (const [kind, pattern] of WEAPON_KIND_PATTERNS) {
    if (pattern.test(text)) return kind
  }
  return null
}

export function characterWieldsWeaponKind(character, weaponKind) {
  if (!weaponKind) return false
  const main = getEquippedWeapon(character)
  const off = getEquippedOffhand(character)
  if (getWeaponKind(main) === weaponKind) return true
  if (weaponKind === 'dagger' && getWeaponKind(off) === 'dagger') return true
  return false
}
