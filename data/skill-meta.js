export const TOGGLE_BONUSES = {
  defensive_stance: { physicalDefence: 2, magicalDefence: 2 },
  polearm_defensive_stance: { physicalDefence: 2, magicalDefence: 2 },
  berserker_rage: { strength: 2, speed: 2, physicalDefence: -1 },
  monster_berserker_rage: { strength: 2, speed: 2, physicalDefence: -1 },
  fortress_stance: { physicalDefence: 4, magicalDefence: 4 }
}

export const PASSIVE_SKILL_BONUSES = {
  tough_skin: { physicalDefence: 2 },
  rock_skin: { physicalDefence: 3 },
  metal_skin: { physicalDefence: 4 },
  magical_resistance: { magicalDefence: 3 },
  spell_immunity: { magicalDefence: 6 },
  wind_mastery: { speed: 3 },
  dwarven_toughness: { hp: 5 },
  elven_accuracy: { accuracy: 1 },
  human_determination: { accuracy: 1 },
  pack_coordination: { accuracy: 1 },
  evasion: { physicalDefence: 2, magicalDefence: 2 },
  infernal_constitution: { stamina: 2 }
}

/** Passive bonuses that only apply while a matching weapon type is equipped. */
export const EQUIPMENT_SKILL_EFFECTS = {
  sword_basics: { weaponKind: 'sword', effectId: 'sword_training', statModifiers: { accuracy: 1 } },
  sword_stance: { weaponKind: 'sword', effectId: 'combat_stance', statModifiers: { physicalDefence: 1 } },
  ranged_basics: { weaponKind: 'ranged', effectId: 'ranged_training', statModifiers: { accuracy: 1 } },
  axe_basics: { weaponKind: 'axe', effectId: 'axe_training', statModifiers: { accuracy: 1 } },
  dagger_basics: { weaponKind: 'dagger', effectId: 'dagger_training', statModifiers: { accuracy: 1 } },
  polearm_basics: { weaponKind: 'polearm', effectId: 'polearm_training', statModifiers: { accuracy: 1 } },
  hammer_basics: { weaponKind: 'hammer', effectId: 'hammer_training', statModifiers: { accuracy: 1 } },
  staff_basics: { weaponKind: 'staff', effectId: 'staff_training', statModifiers: { magicPower: 1 } },
  mana_focus: { weaponKind: 'staff', effectId: 'mana_focus', statModifiers: {} },
  spell_power: { weaponKind: 'staff', effectId: null, statModifiers: { magicPower: 2 } },
  staff_mastery: { weaponKind: 'staff', effectId: null, statModifiers: { magicPower: 4 } },
  light_step: { weaponKind: 'dagger', effectId: 'light_step', statModifiers: { speed: 1 } },
  dagger_mastery: { weaponKind: 'dagger', effectId: 'dagger_mastery_passive', statModifiers: { speed: 2 } }
}

/** Ongoing passive effects shown in Skill & Gear Effects (not weapon-conditional). */
export const PASSIVE_SKILL_EFFECTS = {
  arcane_mastery: ['arcane_mastery'],
  elven_high_magic: ['arcane_mastery', 'spell_warded'],
  spell_penetration: ['spell_penetration'],
  mind_shield: ['mind_shield'],
  infernal_constitution: ['fire_immunity', 'darkness_resistance'],
  hammer_mastery: ['hammer_mastery_passive'],
  elemental_mastery: ['elemental_mastery_passive'],
  rapid_healing: ['rapid_regeneration'],
  human_determination: ['incapacitated_resistance'],
  dwarven_toughness: ['knockdown_resistance'],
  shadow_affinity: ['shadow_affinity_passive'],
  immunity_poison: ['poison_resistance', 'disease_immunity'],
  armored_plates: ['critical_immunity'],
  cosmic_awareness: ['magic_sight'],
  multiattack: ['multiattack'],
  quick_draw: ['quick_draw']
}

/** Effect shown in Skill & Gear Effects while a toggle skill is active. */
export const TOGGLE_SKILL_EFFECTS = {
  defensive_stance: 'defensive_stance_buff',
  polearm_defensive_stance: 'defensive_stance_buff',
  berserker_rage: 'berserker_rage_buff',
  monster_berserker_rage: 'berserker_rage_buff',
  fortress_stance: 'fortress_stance_buff'
}

export const INCOMPATIBILITIES = {
  defensive_stance: ['berserker_rage', 'monster_berserker_rage', 'fortress_stance', 'polearm_defensive_stance'],
  berserker_rage: ['defensive_stance', 'polearm_defensive_stance', 'fortress_stance', 'monster_berserker_rage'],
  monster_berserker_rage: ['defensive_stance', 'berserker_rage', 'polearm_defensive_stance', 'fortress_stance'],
  polearm_defensive_stance: ['berserker_rage', 'monster_berserker_rage', 'fortress_stance', 'defensive_stance'],
  fortress_stance: ['defensive_stance', 'berserker_rage', 'monster_berserker_rage', 'polearm_defensive_stance'],
  regeneration: ['rapid_healing', 'water_mastery'],
  rapid_healing: ['regeneration', 'water_mastery'],
  water_mastery: ['regeneration', 'rapid_healing', 'fire_mastery', 'lightning_mastery'],
  sword_fire_fusion: ['ice_mastery', 'water_mastery'],
  sword_ice_fusion: ['fire_mastery'],
  bow_lightning_fusion: ['water_mastery'],
  fire_mastery: ['ice_mastery', 'water_mastery'],
  ice_mastery: ['fire_mastery'],
  lightning_mastery: ['water_mastery']
}
