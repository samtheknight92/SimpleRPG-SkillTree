import { getItem, getSkill } from './cache.js'

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

export function getEquippedWeaponEntry(character) {
  return inventoryEntry(character, character?.equipped?.weapon)
}

export function getEquippedWeapon(character) {
  const entry = getEquippedWeaponEntry(character)
  return entry ? getItem(entry.itemId) : null
}

export function getEquippedOffhandEntry(character) {
  return inventoryEntry(character, character?.equipped?.offhand)
}

export function getEquippedOffhand(character) {
  const entry = getEquippedOffhandEntry(character)
  return entry ? getItem(entry.itemId) : null
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

/** Explicit `hands: "two"|"one"` on item, else name/desc/kind heuristics. */
export function isTwoHandedWeapon(item) {
  if (!item) return false
  const type = String(item.type || '').toLowerCase()
  if (!type.includes('weapon')) return false
  const hands = item.hands ?? item.handedness
  if (hands === 'two' || hands === 2 || item.twoHanded === true) return true
  if (hands === 'one' || hands === 1 || item.twoHanded === false) return false
  const text = `${item.id} ${item.name} ${item.desc || ''}`.toLowerCase()
  if (/\b(two.hand|2.hand|two-handed|two handed)\b/.test(text)) return true
  if (/\b(greatsword|greataxe|great axe|battleaxe|battle axe|world-shattering)\b/.test(text)) return true
  if (item.id === 'quarterstaff') return false
  const kind = getWeaponKind(item)
  if (kind === 'polearm' || kind === 'staff') return true
  if (kind === 'ranged') {
    if (/\b(hand crossbow|light crossbow)\b/.test(text)) return false
    if (/\b(bow|crossbow|longbow|shortbow)\b/.test(text)) return true
  }
  if (kind === 'hammer' && /\b(great|heavy|warhammer|maul)\b/.test(text) && !/\b(light|hand)\b/.test(text)) return true
  if (/\b(great|heavy)\b/.test(text) && /\b(sword|axe|hammer)\b/.test(text)) return true
  return false
}

export function weaponHandednessLabel(item) {
  if (!item || !String(item.type || '').toLowerCase().includes('weapon')) return ''
  return isTwoHandedWeapon(item) ? 'Two-handed' : 'One-handed'
}

export function getOffhandType(item) {
  if (!item) return null
  if (item.offhandType) return String(item.offhandType).toLowerCase()
  if (String(item.type || '').toLowerCase() === 'offhand') return 'focus'
  if (String(item.type || '').includes('weapon') && getWeaponKind(item) === 'dagger') return 'weapon'
  return null
}

export function isOffhandItem(item) {
  return Boolean(getOffhandType(item))
}

export function offhandTypeLabel(item) {
  const type = getOffhandType(item)
  if (type === 'shield') return 'Shield'
  if (type === 'tome') return 'Tome'
  if (type === 'instrument') return 'Instrument'
  if (type === 'weapon') return 'Off-hand weapon'
  if (type === 'focus') return 'Focus'
  return ''
}

function gearKindForOffhandItem(item) {
  const type = getOffhandType(item)
  if (type === 'shield') return 'armor'
  if (type === 'weapon') return 'weapon'
  return 'accessory'
}

export function gearKindForEquipSlot(slot, gearItem = null) {
  if (slot === 'weapon') return 'weapon'
  if (slot === 'offhand') return gearKindForOffhandItem(gearItem)
  if (slot === 'armor') return 'armor'
  if (slot === 'accessory') return 'accessory'
  return ''
}

export function characterHasMusicianSkill(character) {
  return (character?.skills || []).some(id => getSkill(id)?.subcategory === 'musician')
}

export function offhandSlotLockReason(character) {
  const main = getEquippedWeapon(character)
  if (main && isTwoHandedWeapon(main)) {
    return 'Two-handed weapon equipped — off-hand unavailable.'
  }
  return null
}

/** @deprecated use offhandSlotLockReason / canUseOffhandSlot */
export function offhandSlotAvailable(character) {
  return !offhandSlotLockReason(character)
}

export function canUseOffhandSlot(character) {
  return !offhandSlotLockReason(character)
}

export function canEquipToOffhand(character, item) {
  if (!character || !item) return { ok: false, reason: 'No item.' }
  const offType = getOffhandType(item)
  if (!offType) return { ok: false, reason: 'Not an off-hand item.' }
  const lock = offhandSlotLockReason(character)
  if (lock) return { ok: false, reason: lock.replace(' — off-hand unavailable.', '.') }
  const main = getEquippedWeapon(character)
  if (offType === 'weapon') {
    if (!character.skills?.includes('dual_wield')) {
      return { ok: false, reason: 'Learn Dual Wield for an off-hand dagger.' }
    }
    if (getWeaponKind(item) !== 'dagger') {
      return { ok: false, reason: 'Off-hand weapons must be daggers.' }
    }
    if (!main || getWeaponKind(main) !== 'dagger') {
      return { ok: false, reason: 'Equip a main-hand dagger first.' }
    }
  }
  if (offType === 'instrument' && !characterHasMusicianSkill(character)) {
    return { ok: false, reason: 'Learn a Musician skill to use an instrument.' }
  }
  return { ok: true, reason: 'Ready for off-hand.' }
}

export function canEquipToMainHand(item) {
  if (!item) return false
  const type = String(item.type || '').toLowerCase()
  if (type === 'offhand') return false
  return type.includes('weapon')
}

/** Which equip slot holds this inventory entry uid, if any. */
export function equippedSlotForEntry(character, entryUid) {
  if (!entryUid) return null
  for (const [slot, uid] of Object.entries(character?.equipped || {})) {
    if (uid === entryUid) return slot
  }
  return null
}

export function characterHasDualWield(character) {
  if (!character?.skills?.includes('dual_wield')) return false
  return getWeaponKind(getEquippedWeapon(character)) === 'dagger'
}

export function characterHandsEmpty(character) {
  if (!character?.equipped) return true
  if (character.equipped.weapon) return false
  if (character.equipped.offhand) return false
  return true
}

export function characterWieldsOneHandedWeapon(character) {
  const main = getEquippedWeapon(character)
  if (!main) return false
  return !isTwoHandedWeapon(main)
}

export function characterWieldsWeaponKind(character, weaponKind) {
  if (!weaponKind) return false
  if (weaponKind === 'striker' || weaponKind === 'unarmed') return characterHandsEmpty(character)
  if (weaponKind === 'oneHanded') return characterWieldsOneHandedWeapon(character)
  const main = getEquippedWeapon(character)
  const off = getEquippedOffhand(character)
  if (getWeaponKind(main) === weaponKind) return true
  if (weaponKind === 'dagger' && getWeaponKind(off) === 'dagger') return true
  return false
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

/** Drop off-hand when main weapon blocks it or off-hand item is invalid. */
export function reconcileOffhandEquip(character) {
  if (!character?.equipped) return
  const lock = offhandSlotLockReason(character)
  if (lock) {
    character.equipped.offhand = null
    return
  }
  const offEntry = getEquippedOffhandEntry(character)
  if (!offEntry) return
  const offItem = getItem(offEntry.itemId)
  const check = canEquipToOffhand(character, offItem)
  if (!check.ok) character.equipped.offhand = null
}
