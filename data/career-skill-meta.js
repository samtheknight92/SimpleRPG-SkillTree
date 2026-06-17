/** Career skill effect wiring — merged into skill-meta.json by build-data.mjs */

export const CAREER_PASSIVE_BONUSES = {
  oathbound: { magicalDefence: 1 },
  hands_in_soil: { hp: 1 }
}

/** Stat bonuses that require equipped weapon type (extends EQUIPMENT_SKILL_EFFECTS). */
export const CAREER_EQUIPMENT_EFFECTS = {
  steady_hand: { weaponKind: 'ranged', effectId: 'steady_hand', statModifiers: { accuracy: 1 } },
  precise_footwork: { weaponKind: 'oneHanded', effectId: 'precise_footwork', statModifiers: { speed: 1 } }
}

/** Stat bonuses gated on armour weight class (light | medium | heavy | none). */
export const CAREER_ARMOUR_EFFECTS = {
  soldier_training: { armourWeights: ['medium', 'heavy'], effectId: 'soldier_training', statModifiers: { strength: 1 } },
  shadow_blend: { armourWeights: ['light', 'none'], effectId: 'shadow_blend', statModifiers: {} }
}

/** Ongoing passives linked to effects.json entries (Skill & Gear panel). */
export const CAREER_PASSIVE_EFFECTS = {
  weaponwright: ['weaponwright'],
  armourer: ['armourer'],
  tempered_steel: ['tempered_steel'],
  spice_box: ['spice_box'],
  hands_in_soil: ['hands_in_soil'],
  bountiful_plot: ['bountiful_plot'],
  field_medic: ['field_medic'],
  antidote_training: ['antidote_training'],
  surgical_touch: ['surgical_touch'],
  plague_ward: ['plague_ward'],
  volatile_expert: ['volatile_expert'],
  trace_evidence: ['trace_evidence'],
  case_notes: ['case_notes'],
  trap_sense: ['trap_sense'],
  lost_technique: ['lost_technique'],
  ambush_spotter: ['ambush_spotter'],
  keen_sight: ['keen_sight'],
  haggler: ['haggler'],
  pack_tactics: ['pack_tactics'],
  last_rites: ['last_rites'],
  holy_symbol_craft: ['holy_symbol_craft'],
  faiths_reservoir: ['faiths_reservoir'],
  hold_the_line: ['hold_the_line'],
  phalanx: ['phalanx'],
  commanders_presence: ['commanders_presence'],
  arcane_study: ['arcane_study'],
  mana_font: ['mana_font'],
  amplified_healing: ['amplified_healing'],
  oathbound: ['oathbound'],
  battle_fury: ['battle_fury'],
  bulwark: ['bulwark'],
  aura_of_protection: ['aura_of_protection'],
  bloodlust: ['bloodlust'],
  executioner: ['executioner'],
  unstoppable: ['unstoppable'],
  quick_reload: ['quick_reload'],
  volley_support: ['volley_support'],
  snap_shot: ['snap_shot'],
  disengage_master: ['disengage_master'],
  dueling_stance: ['dueling_stance'],
  finishing_thrust: ['finishing_thrust'],
  escape_artist: ['escape_artist'],
  hit_and_run: ['hit_and_run'],
  light_fingers: ['light_fingers'],
  caravan_lead: ['caravan_lead'],
  chefs_instinct: ['chefs_instinct'],
  animal_sense: ['animal_sense'],
  trail_warden: ['trail_warden'],
  reinforced_frame: ['reinforced_frame'],
  polyglot: ['polyglot'],
  map_archive: ['map_archive'],
  sages_conclusion: ['sages_conclusion'],
  ancient_tongues: ['ancient_tongues'],
  label_reader: ['label_reader'],
  schematic_mind: ['schematic_mind'],
  ledger: ['ledger'],
  black_market: ['black_market']
}

/** Stat modifiers applied only when a condition is met during stat calculation. */
export const CAREER_CONDITIONAL_STATS = {
  bulwark: { physicalDefence: 1, condition: 'selfBelowHalfHp' }
}

/** Flat damage bonuses evaluated at attack time (see career-effects.js). */
export const CAREER_DAMAGE_BONUSES = {
  battle_fury: { flat: 1, melee: true, condition: 'selfBelowHalfHp' },
  executioner: { flat: 2, condition: 'targetBelowHalfHp' },
  finishing_thrust: { flat: 2, condition: 'targetNotActed' },
  lost_technique: { flat: 2, condition: 'partyWeakness' }
}

/** Heal bonuses from career passives (see damage-breakdown collectFlatHealBonuses). */
export const CAREER_HEAL_BONUSES = {
  amplified_healing: { flat: 2, onOthers: true, spellOnly: true },
  field_medic: { flat: 2, craftedPotion: true },
  faiths_reservoir: { multiplier: 2, oncePerDay: true }
}

/** Action skills that apply a status effect on use (self unless noted). */
export const CAREER_ACTION_BUFFS = {
  rage: { effectId: 'career_rage_buff', duration: 3 },
  reckless_strike: { effectId: 'reckless_strike_buff', duration: 2 },
  sacred_stance: { effectId: 'sacred_stance_buff', duration: 2 },
  lay_blessing: { effectId: 'lay_blessing_buff', duration: 999 },
  ward_circle: { effectId: 'ward_circle_buff', duration: 3 },
  hearty_rations: { effectId: 'hearty_rations_buff', duration: 10 },
  battle_breakfast_pd: { effectId: 'battle_breakfast_pd_buff', duration: 999 },
  battle_breakfast_init: { effectId: 'battle_breakfast_init_buff', duration: 999 },
  banquet_planner: { effectId: 'banquet_planner_buff', duration: 20 },
  empower_ally: { effectId: 'empower_ally_buff', duration: 1 },
  shield_wall: { effectId: 'shield_wall_buff', duration: 1 },
  second_wind: { effectId: 'second_wind_heal', duration: 0 },
  lay_on_hands: { effectId: 'lay_on_hands_heal', duration: 0 },
  clean_bandage: { effectId: 'clean_bandage_heal', duration: 0 },
  intimidate: { effectId: 'intimidate_debuff', duration: 1 },
  suppressing_fire: { effectId: 'suppressing_fire_debuff', duration: 1 },
  dirty_trick: { effectId: 'dirty_trick_buff', duration: 1 },
  volley_call: { effectId: 'volley_call_buff', duration: 1 },
  called_shot: { effectId: 'called_shot_buff', duration: 1 },
  field_fit: { effectId: 'field_fit_buff', duration: 1 },
  fusion_field_spark: { effectId: 'fusion_field_spark_heal', duration: 0 }
}

/** Stamina cost reduction for ranged attacks (minimum 0). */
export const CAREER_STAMINA_DISCOUNTS = {
  quick_reload: { amount: 1, rangedOnly: true }
}
