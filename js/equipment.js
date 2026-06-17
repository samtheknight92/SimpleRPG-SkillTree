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
  if (weaponKind === 'oneHanded') return characterWieldsOneHandedWeapon(character)
  const main = getEquippedWeapon(character)
  const off = getEquippedOffhand(character)
  if (getWeaponKind(main) === weaponKind) return true
  if (weaponKind === 'dagger' && getWeaponKind(off) === 'dagger') return true
  return false
}

export function characterWieldsOneHandedWeapon(character) {
  const main = getEquippedWeapon(character)
  if (!main) return false
  const text = `${main.id} ${main.name} ${main.desc || ''}`.toLowerCase()
  if (/\b(great|heavy|two.hand|2.hand|battleaxe|greataxe|halberd|glaive|polearm|spear|longbow|staff|maul)\b/.test(text)) {
    return false
  }
  const kind = getWeaponKind(main)
  if (kind === 'polearm' || kind === 'staff') return false
  if (kind === 'ranged' && !/hand crossbow|light crossbow/i.test(text)) return false
  if (kind === 'hammer' && !/light|hand/i.test(text)) return false
  return true
}

export function getEquippedArmour(character) {
  const entry = inventoryEntry(character, character?.equipped?.armor)
  return entry ? getItem(entry.itemId) : null
}

/** light | medium | heavy | none */
export function getArmourWeightClass(character) {
  const armour = getEquippedArmour(character)
  if (!armour) return 'none'
  const text = `${armour.id} ${armour.name} ${armour.desc || ''}`.toLowerCase()
  if (/\b(plate|full plate|heavy|adamantine|mithril plate|tower shield)\b/.test(text)) return 'heavy'
  if (/\b(chain|scale|brigandine|medium|splint|banded)\b/.test(text)) return 'medium'
  return 'light'
}
