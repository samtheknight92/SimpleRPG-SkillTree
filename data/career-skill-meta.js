/** Career skill effect wiring — merged into skill-meta.json by build-data.mjs.
 *  Harmony Reaction / + Harmony lines in skill desc are table rules; joiners are not synced across sheets. */

export const CAREER_PASSIVE_BONUSES = {
  oathbound: { magicalDefence: 1 }
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
  field_medic: ['field_medic'],
  antidote_training: ['antidote_training'],
  surgical_touch: ['surgical_touch'],
  plague_ward: ['plague_ward'],
  volatile_expert: ['volatile_expert'],
  trace_evidence: ['trace_evidence'],
  case_notes: ['case_notes'],
  ambush_spotter: ['ambush_spotter'],
  keen_sight: ['keen_sight'],
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
  chefs_instinct: ['chefs_instinct'],
  trail_warden: ['trail_warden'],
  label_reader: ['label_reader'],
  long_set: ['long_set'],
  encore: ['encore']
}

/** Stat modifiers applied only when a condition is met during stat calculation. */
export const CAREER_CONDITIONAL_STATS = {
  bulwark: { physicalDefence: 1, condition: 'selfBelowHalfHp' }
}

/** Flat damage bonuses evaluated at attack time (see career-effects.js). */
export const CAREER_DAMAGE_BONUSES = {
  battle_fury: { flat: 1, melee: true, condition: 'selfBelowHalfHp' },
  executioner: { flat: 2, condition: 'targetBelowHalfHp' },
  finishing_thrust: { flat: 2, condition: 'targetNotActed' }
}

/** Heal bonuses from career passives (see damage-breakdown collectFlatHealBonuses). */
export const CAREER_HEAL_BONUSES = {
  amplified_healing: { flat: 2, onOthers: true, spellOnly: true },
  field_medic: { flat: 2, craftedPotion: true }
}

/** Action skills that apply a status effect on use (self unless noted). */
export const CAREER_ACTION_BUFFS = {
  rage: { effectId: 'career_rage_buff', duration: 3, potency: 0 },
  reckless_strike: { effectId: 'reckless_strike_buff', duration: 2, potency: 0 },
  sacred_stance: { effectId: 'sacred_stance_buff', duration: 2, potency: 0 },
  ward_circle: { effectId: 'ward_circle_buff', duration: 3, potency: 0 },
  hearty_rations: { effectId: 'hearty_rations_buff', duration: 10, potency: 0 },
  battle_breakfast: { effectId: 'battle_breakfast', duration: 999, potency: 0 },
  banquet_planner: { effectId: 'banquet_planner_buff', duration: 20, potency: 0 },
  empower_ally: { effectId: 'empower_ally_buff', duration: 1, potency: 0 },
  shield_wall: { effectId: 'shield_wall_buff', duration: 1, potency: 0 },
  second_wind: { effectId: 'second_wind_heal', duration: 0, potency: 0 },
  lay_on_hands: { effectId: 'lay_on_hands_heal', duration: 0, potency: 0 },
  clean_bandage: { effectId: 'clean_bandage_heal', duration: 0, potency: 0 },
  intimidate: { effectId: 'intimidate_debuff', duration: 1, potency: 0 },
  suppressing_fire: { effectId: 'suppressing_fire_debuff', duration: 1, potency: 0 },
  dirty_trick: { effectId: 'dirty_trick_buff', duration: 1, potency: 0 },
  volley_call: { effectId: 'volley_call_buff', duration: 1, potency: 0 },
  called_shot: { effectId: 'called_shot_buff', duration: 1, potency: 0 },
  field_fit: { effectId: 'field_fit_buff', duration: 1, potency: 0 },
  fusion_field_spark: { effectId: 'fusion_field_spark_heal', duration: 0, potency: 0 },
  work_song: { effectId: 'work_song_buff', duration: 3, potency: 0 },
  marching_tune: { effectId: 'marching_tune_buff', duration: 2, potency: 0 },
  soothing_hymn: { effectId: 'soothing_hymn_buff', duration: 2, potency: 0 },
  battle_anthem: { effectId: 'battle_anthem_buff', duration: 3, potency: 0 },
  dissonant_note: { effectId: 'dissonant_note_debuff', duration: 1, potency: 0 }
}

/** Stamina cost reduction for ranged attacks (minimum 0). */
export const CAREER_STAMINA_DISCOUNTS = {
  quick_reload: { amount: 1, rangedOnly: true }
}
