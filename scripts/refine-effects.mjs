/**
 * Replaces vague AI placeholder text in effect definitions with concrete LumenForge rules.
 * Run: node scripts/refine-effects.mjs
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)))
const effectsPath = path.join(root, 'data', 'json', 'effects.json')
const effects = JSON.parse(fs.readFileSync(effectsPath, 'utf8'))

/** @type {Record<string, object>} */
const PATCHES = {
  acid_corrosion: {
    desc: 'Corrosive acid eats through armour: reduce Physical Defence by 1 each turn for 5 turns (stack -1 per turn on the sheet). No direct HP damage unless the GM adds it.',
    duration: 5,
    potency: 1,
    statModifiers: { physicalDefence: -1 }
  },
  cursed: {
    desc: 'Hexed: -2 Accuracy and -1 Magic Power for 8 turns. Using Stamina abilities also costs 1 extra Stamina while cursed.',
    statModifiers: { accuracy: -2, magicPower: -1 }
  },
  protected: {
    desc: '+3 Physical Defence and +3 Magical Defence for 6 turns. Represents a ward that absorbs incoming blows.'
  },
  spell_warded: {
    desc: '+4 Magical Defence for 8 turns. Immune to Charm, Fear, and Weakened from magical sources while active.',
    duration: 8,
    statModifiers: { magicalDefence: 4 },
    immunities: ['charm', 'fear', 'weakened', 'mind_controlled']
  },
  empowered: {
    desc: '+3 Magic Power for 6 turns. Magical toggle skills cost 1 less Stamina per turn (minimum 1).'
  },
  weapon_enchanted: {
    desc: 'Weapon attacks deal +1d6 elemental damage (fire, ice, lightning, or radiant — chosen when applied) for 10 turns.'
  },
  enhanced_mobility: {
    desc: '+2 Speed for 10 turns. Immune to Immobilized while active. Can ignore difficult terrain at normal Speed.'
  },
  intimidating_aura: {
    desc: 'Aura (30ft): enemies starting their turn nearby must resist Fear or cannot move toward you willingly.'
  },
  toxic_presence: {
    desc: 'Aura (15ft): enemies nearby take 1 poison pressure damage per turn on Process Turn; allies in the aura gain Poison Immunity while you are the source.'
  },
  knockdown: {
    desc: 'Knocked prone for 1 turn: -2 Accuracy and cannot move until you spend an action to stand.',
    statModifiers: { accuracy: -2, speed: -2 }
  },
  poison_resistance: {
    desc: 'Poison damage is halved and you cannot gain new Poison stacks while this lasts. Existing Poison still ticks.'
  },
  disease_immunity: {
    desc: 'Immune to disease and poison-based debuffs except legendary sources.',
    immunities: ['poison']
  },
  fire_resistance: {
    desc: 'Take half fire damage and cannot gain Burn while this is active. Existing Burn still ticks.',
    immunities: ['burn']
  },
  undead_bane: {
    desc: 'Attacks against undead deal +1d6 radiant damage and have +2 Accuracy against undead targets.'
  },
  burn_on_hit: {
    desc: 'On hit: 40% chance (Tier 3+) to apply Burn for 4 turns — 1 fire damage per turn and -2 Strength.'
  },
  freeze_on_hit: {
    desc: 'On hit: 40% chance (Tier 3+) to apply Immobilized for 3 turns — cannot move but may still attack.'
  },
  poison_on_hit: {
    desc: 'On hit: 40% chance (Tier 3+) to apply Poison — escalating 1, then 2, then 3 damage over 3 turns.'
  },
  shock_on_hit: {
    desc: 'On hit: 40% chance (Tier 3+) to apply Incapacitated for 1 turn on a failed endurance save.'
  },
  wind_slash: {
    desc: 'Release a 20ft wind blade for 1d6 slashing damage and push the target 10ft on a hit.'
  },
  bleeding: {
    type: 'damageOverTime',
    duration: 3,
    potency: 1,
    tickDamage: 1,
    manual: true,
    desc: 'Bleeding wound: lose 1 HP at the start of each turn for 3 turns. Bandaging ends the effect early.'
  },
  dragon_fire: {
    desc: 'Attack deals +1d6 fire damage. On hit, 75% chance to apply Burn. Frightened targets take +1 extra fire damage.'
  },
  stealth_strike: {
    desc: 'First attack from hidden gains +2 Accuracy and +1d6 damage. Breaks stealth after the attack.'
  },
  critical_strike: {
    desc: 'Critical hits occur on a natural 19–20 and deal +1 weapon damage die on crits.'
  },
  phase_strike: {
    desc: 'This attack ignores 3 points of Physical Defence and 3 points of Magical Defence.'
  },
  shadow_step: {
    desc: 'Teleport up to 30ft between shadows or dim light. Does not provoke opportunity attacks.'
  },
  time_strike: {
    desc: 'Once per scene: make an extra weapon attack immediately after this hit lands.'
  },
  piercing: {
    desc: 'Ignore 2 points of cover or Physical Defence on this attack.'
  },
  nature_blessing: {
    desc: '+2 Accuracy and +1 Magic Power in natural terrain for 8 turns. Restore 1 HP when you start a turn outdoors.',
    duration: 8,
    statModifiers: { accuracy: 2, magicPower: 1 },
    tickHeal: 1
  },
  piercing_light: {
    desc: 'Attacks ignore darkness penalties and deal +1d4 radiant damage to shadow or undead targets.'
  },
  lightning_arrows: {
    desc: 'Ranged attacks deal +1d6 lightning damage. On hit, 40% chance to apply Incapacitated for 1 turn.'
  },
  star_arrows: {
    desc: 'Ranged attacks deal +1d6 radiant damage. +2 Accuracy while attacking in darkness.'
  },
  armor_pierce: {
    desc: 'Reduce the target\'s Physical Defence by 2 for this attack only.'
  },
  holy_strike: {
    desc: 'Attack deals +1d6 radiant damage. +2 Accuracy against undead, demons, and creatures of darkness.'
  },
  earthquake: {
    desc: '10ft burst: 2d6 earth damage and apply Knockdown to enemies who fail a Speed save.'
  },
  thunder_strike: {
    desc: 'Attack deals +1d6 thunder damage. 40% chance to apply Incapacitated for 1 turn.'
  },
  earth_shatter: {
    desc: 'Attack deals +1d8 earth damage and reduces target Physical Defence by 2 until end of next turn.'
  },
  void_impact: {
    desc: 'Attack deals +1d6 void damage and pushes the target 10ft on a hit.'
  },
  cleave: {
    desc: 'If this attack drops or crits, immediately deal half the rolled damage to one adjacent enemy.'
  },
  double_strike: {
    desc: 'Make two attack rolls with the same action; the second hit uses the same modifiers but no extra once-per-turn bonuses.'
  },
  lifesteal: {
    desc: 'Heal HP equal to half the damage dealt by this attack (rounded down, minimum 1).'
  },
  life_steal: {
    desc: 'Heal HP equal to half the damage dealt by this attack (rounded down, minimum 1).'
  },
  rage_mode: {
    desc: '+2 Strength and +2 Speed for 8 turns, but -1 Physical Defence while raging.',
    duration: 8,
    statModifiers: { strength: 2, speed: 2, physicalDefence: -1 }
  },
  execution: {
    desc: 'Deal +1d6 damage against targets below half HP.'
  },
  chaos_strike: {
    desc: 'Add +1d6 damage of a random element (fire, ice, lightning, or void) on each hit.'
  },
  reality_cut: {
    desc: 'Once per scene: this attack ignores all defence and cover. Deals normal weapon damage + 2d6 force.'
  },
  mana_efficiency: {
    desc: 'Toggle and active skills cost 1 less Stamina per turn for 10 turns (minimum 1).',
    duration: 10
  },
  drain_mana: {
    desc: 'Target loses 1d4+1 Stamina; you regain half that amount (rounded up).'
  },
  elemental_mastery: {
    desc: '+2 Magic Power and +1 Accuracy with elemental skills for 10 turns.',
    duration: 10,
    statModifiers: { magicPower: 2, accuracy: 1 }
  },
  cosmic_power: {
    desc: '+4 Magic Power and +2 Magical Defence for 6 turns. Legendary cosmic effects only.',
    duration: 6,
    statModifiers: { magicPower: 4, magicalDefence: 2 }
  },
  creation_magic: {
    desc: '+3 Magic Power for 8 turns. Can shape minor objects or barriers as a narrative effect.',
    duration: 8,
    statModifiers: { magicPower: 3 }
  },
  reach: {
    desc: 'Melee reach increases by 5ft for 10 turns.',
    duration: 10
  },
  anti_cavalry: {
    desc: '+2 Accuracy and +1d6 damage against mounted or charging targets.'
  },
  sweeping_strikes: {
    desc: 'One melee attack may hit up to 2 adjacent targets at -1 Accuracy each.'
  },
  dragon_slayer: {
    desc: '+2 Accuracy and +1d6 damage against dragons and draconic creatures.'
  },
  infinite_reach: {
    desc: 'Legendary: melee attacks reach 30ft with line of sight for 3 turns.',
    duration: 3
  },
  dimension_pierce: {
    desc: 'Legendary: ignore all physical barriers and 6 points of total defence once per scene.'
  },
  damage_reduction: {
    desc: 'Reduce each incoming hit by 1 damage for 10 turns (minimum 0).',
    duration: 10
  },
  mana_regeneration: {
    desc: 'Restore 1 Stamina at the start of each turn while active.',
    tickStamina: 1
  },
  mana_focus: {
    desc: 'Restore 1 Stamina at the start of each turn while a staff or wand is equipped (Mana Focus passive).',
    tickStamina: 1
  },
  fire_immunity: {
    desc: 'Immune to fire damage and Burn while active.',
    immunities: ['burn']
  },
  cold_aura: {
    desc: 'Aura (15ft): enemies nearby lose 2 Speed. When an enemy enters or starts their turn in the aura, 40% chance to apply Immobilized.'
  },
  stealth: {
    desc: '+3 Accuracy on stealth attacks and +2 Speed when you did not attack last turn.',
    statModifiers: { accuracy: 3, speed: 2 }
  },
  spell_absorption: {
    desc: 'Once while active: negate one spell targeting you and regain Stamina equal to that spell\'s cost.',
    duration: 10
  },
  light_aura: {
    desc: 'Aura (20ft): allies gain +1 Accuracy vs Fear and +1 Magical Defence. Undead in the aura take 1 radiant damage per turn (GM tracks on enemies).',
    statModifiers: { accuracy: 1, magicalDefence: 1 }
  },
  haste: {
    desc: '+2 Speed for 8 turns and +1 extra movement action each turn.',
    duration: 8,
    statModifiers: { speed: 2 }
  },
  burn_aura: {
    desc: 'Aura (10ft): adjacent enemies take 1 fire damage per turn on Process Turn (track on enemies). 40% chance to apply Burn when they enter.'
  },
  frost_aura: {
    desc: 'Aura (15ft): enemies lose 2 Speed nearby. 40% chance to apply Immobilized when they start their turn inside.'
  },
  lightning_bolt: {
    desc: 'Ranged spell: 2d6 lightning damage in a line. 40% chance to apply Incapacitated for 1 turn on failed save.'
  },
  invisibility: {
    desc: 'Cannot be seen normally for 5 turns. +4 Accuracy on the first attack; broken after attacking or taking damage.',
    duration: 5,
    statModifiers: { accuracy: 4 }
  },
  extra_movement: {
    desc: '+2 Speed and +10ft movement for 8 turns.',
    duration: 8,
    statModifiers: { speed: 2 }
  },
  silent_movement: {
    desc: '+3 Accuracy on stealth rolls and movement makes no sound for 5 turns.',
    duration: 5,
    statModifiers: { accuracy: 3 }
  },
  immovable: {
    desc: 'Cannot be pushed, knocked down, or forcibly moved for 10 turns. +2 Physical Defence while planted.',
    duration: 10,
    statModifiers: { physicalDefence: 2 }
  },
  flight: {
    desc: 'Fly at your normal Speed for 10 turns. Immune to ground-based Immobilized.',
    duration: 10,
    immunities: ['immobilized']
  },
  spell_resistance: {
    desc: '+3 Magical Defence for 10 turns. Reduce incoming spell damage by half (round down).',
    duration: 10,
    statModifiers: { magicalDefence: 3 }
  },
  stone_skin: {
    desc: '+3 Physical Defence for 10 turns. Reduce mundane weapon damage by 1 per hit.',
    duration: 10,
    statModifiers: { physicalDefence: 3 }
  },
  shadow_stealth: {
    desc: '+4 Accuracy in dim light or darkness for 5 turns.',
    duration: 5,
    statModifiers: { accuracy: 4 }
  },
  radiant_aura: {
    desc: 'Aura (20ft): allies gain +1 Magical Defence. Undead in the aura take 1 radiant damage per turn (track on enemies).',
    statModifiers: { magicalDefence: 1 }
  },
  nature_resistance: {
    desc: '+2 Physical Defence and +2 Magical Defence in wilderness. Immune to poison plants and weather exhaustion.',
    statModifiers: { physicalDefence: 2, magicalDefence: 2 }
  },
  mirror_image: {
    desc: 'The next 2 attacks against you have a 50% chance to hit an illusion instead (track uses manually).',
    duration: 8
  },
  critical_chance: {
    desc: 'Critical hits occur on natural 19–20 for 10 turns.',
    duration: 10
  },
  luck: {
    desc: '+2 Accuracy and +1 Speed for 8 turns — fortune favours the bold.',
    duration: 8,
    statModifiers: { accuracy: 2, speed: 1 }
  },
  magic_sight: {
    desc: '+3 Accuracy to detect magic, traps, and hidden enchantments for 10 turns.',
    duration: 10,
    statModifiers: { accuracy: 3 }
  },
  identify: {
    desc: 'Instantly identify magical items and active enchantments on touch (utility, not combat).'
  },
  crush: {
    desc: '+2 Strength for this attack and 40% chance to apply Knockdown on hit.'
  },
  crushing: {
    desc: '+2 Strength for this attack and 40% chance to apply Knockdown on hit.'
  },
  spell_memory: {
    desc: 'Prepare one additional spell or skill option until your next long rest (narrative +1 prepared ability).'
  },
  keen_sight: {
    desc: '+2 Accuracy on perception and ranged attacks for 10 turns.',
    duration: 10,
    statModifiers: { accuracy: 2 }
  },
  steady_hands: {
    desc: '+2 Accuracy on ranged and fine-tool actions for 10 turns.',
    duration: 10,
    statModifiers: { accuracy: 2 }
  },
  long_range_sight: {
    desc: '+2 Accuracy at long range; ignore the first range penalty band for 10 turns.',
    duration: 10,
    statModifiers: { accuracy: 2 }
  },
  concentration: {
    desc: '+2 Magic Power and +2 Magical Defence while you sustain a channeled spell, toggle stance, or similar ongoing ability.',
    duration: 8,
    statModifiers: { magicPower: 2, magicalDefence: 2 }
  },
  heal_2: { desc: 'Instantly restore 2 HP when consumed or activated.' },
  heal_3: { desc: 'Instantly restore 3 HP when consumed or activated.' },
  heal_5: { desc: 'Instantly restore 5 HP when consumed or activated.' },
  heal_8: { desc: 'Instantly restore 8 HP when consumed or activated.' },
  heal_25: { desc: 'Instantly restore 25 HP when consumed or activated.' },
  heal_40: { desc: 'Instantly restore 40 HP when consumed or activated.' },
  heal_50: { desc: 'Instantly restore 50 HP when consumed or activated.' },
  restore_stamina_2: { desc: 'Instantly restore 2 Stamina when consumed or activated.' },
  restore_stamina_5: { desc: 'Instantly restore 5 Stamina when consumed or activated.' },
  restore_stamina_15: { desc: 'Instantly restore 15 Stamina when consumed or activated.' },
  restore_stamina_30: { desc: 'Instantly restore 30 Stamina when consumed or activated.' },
  temp_strength_1: {
    desc: '+1 Strength for 8 turns.',
    duration: 8,
    statModifiers: { strength: 1 }
  },
  temp_magic_1: {
    desc: '+1 Magic Power for 8 turns.',
    duration: 8,
    statModifiers: { magicPower: 1 }
  },
  temp_strength_3: {
    desc: '+3 Strength for 6 turns.',
    duration: 6,
    statModifiers: { strength: 3 }
  },
  temp_speed_3: {
    desc: '+3 Speed for 6 turns.',
    duration: 6,
    statModifiers: { speed: 3 }
  },
  temp_magic_3: {
    desc: '+3 Magic Power for 6 turns.',
    duration: 6,
    statModifiers: { magicPower: 3 }
  },
  temp_defense_4: {
    desc: '+2 Physical Defence and +2 Magical Defence for 6 turns.',
    duration: 6,
    statModifiers: { physicalDefence: 2, magicalDefence: 2 }
  },
  temp_strength_5: {
    desc: '+5 Strength for 4 turns.',
    duration: 4,
    statModifiers: { strength: 5 }
  },
  temp_speed_2: {
    desc: '+2 Speed for 8 turns.',
    duration: 8,
    statModifiers: { speed: 2 }
  },
  temp_defense_minus_2: {
    desc: '-2 Physical Defence and -2 Magical Defence for 4 turns.',
    duration: 4,
    statModifiers: { physicalDefence: -2, magicalDefence: -2 }
  },
  invisibility_5_turns: {
    desc: 'Invisible for 5 turns: +4 Accuracy on first attack; ends if you attack or take damage.',
    duration: 5,
    statModifiers: { accuracy: 4 }
  },
  fire_immunity_10_turns: {
    desc: 'Immune to fire damage and Burn for 10 turns.',
    duration: 10,
    immunities: ['burn']
  },
  cold_immunity_10_turns: {
    desc: 'Immune to cold damage and Immobilized from ice for 10 turns.',
    duration: 10,
    immunities: ['immobilized']
  },
  cast_fireball: {
    desc: 'Cast Fireball: 3d6 fire damage in a 20ft burst. 75% chance to apply Burn to each failed save target.'
  },
  remove_poison: {
    desc: 'Remove Poison and all poison damage-over-time effects immediately.'
  },
  teleport: {
    desc: 'Instantly move up to 60ft to a visible location. Does not cost a movement action.'
  },
  full_heal: {
    desc: 'Restore HP to your current maximum immediately.'
  },
  remove_all_debuffs: {
    desc: 'Remove all negative status effects and stat debuffs immediately.'
  },
  fire_immunity_permanent: {
    desc: 'Permanent immunity to fire damage and Burn (legendary).',
    immunities: ['burn']
  },
  permanent_hp_5: {
    desc: 'Permanently increase maximum HP by 5 after consumption.'
  },
  permanent_strength_2: {
    desc: 'Permanently increase base Strength by 2 after consumption.'
  },
  permanent_all_stats_1: {
    desc: 'Permanently increase Strength, Magic Power, Accuracy, and Speed by 1 after consumption.'
  },
  dragon_breath: {
    desc: 'Cone (30ft): 3d6 fire damage. 75% chance to apply Burn to each target in the cone.'
  },
  regeneration_permanent: {
    desc: 'Permanent: restore 1 HP at the start of each turn (Process Turn). Legendary.',
    tickHeal: 1
  },
  unlock_doors: {
    desc: '+3 Accuracy on lockpicking and can bypass mundane non-magical locks with tools.'
  },
  climb_assistance: {
    desc: '+3 Accuracy on climbing checks and you cannot fall more than 10ft from a failed climb.'
  },
  light_source: {
    desc: 'Bright light 20ft and dim light 40ft. Lasts until extinguished (utility).'
  },
  fire_damage: {
    desc: 'Attacks deal +1d4 fire damage while this weapon effect is active.'
  },
  undead_damage: {
    desc: 'Attacks deal +1d6 radiant damage to undead targets.'
  },
  purify: {
    desc: 'Remove Poison, disease, and one minor curse from food, water, or a willing target.'
  },
  parry_bonus: {
    desc: '+2 Physical Defence when using a parry or block reaction for 8 turns.',
    duration: 8,
    statModifiers: { physicalDefence: 2 }
  },
  critical_bleeding: {
    type: 'damageOverTime',
    duration: 3,
    potency: 2,
    tickDamage: 2,
    desc: 'Critical hit causes deep bleeding: 2 HP lost per turn for 3 turns.'
  },
  armor_piercing: {
    desc: 'Reduce target Physical Defence by 2 for this attack.'
  },
  stunning: {
    desc: '40% chance on hit to apply Incapacitated for 1 turn.'
  },
  magic_damage: {
    desc: 'Spells and magical attacks deal +1d4 magic damage while this effect is active.'
  },
  critical_immunity: {
    desc: 'Critical hits against you become normal hits for 10 turns.',
    duration: 10
  },
  flexible_defense: {
    desc: '+2 Physical Defence OR +2 Magical Defence each turn (choose at start of turn) for 8 turns.',
    duration: 8,
    statModifiers: { physicalDefence: 2, magicalDefence: 2 }
  },
  void_damage: {
    desc: 'Attacks deal +1d6 void damage, effective against magical barriers.'
  },
  reflect_damage: {
    desc: 'When hit in melee, the attacker takes 2 damage back for 6 turns.',
    duration: 6
  },
  magic_barrier: {
    desc: '+3 Magical Defence for 8 turns. The first magical hit each turn is reduced by 3 damage.',
    duration: 8,
    statModifiers: { magicalDefence: 3 }
  },
  auto_healing: {
    type: 'healOverTime',
    duration: 999,
    tickHeal: 1,
    desc: 'Restore 1 HP at the start of each turn while equipped or active.'
  },
  critical_strikes: {
    desc: 'Critical hits on 19–20 and crits deal +1 damage die.'
  },
  energy_waves: {
    desc: 'Melee attacks release a 15ft energy wave for 1d4 force damage to one secondary target.'
  },
  damage_immunity: {
    desc: 'Legendary: immune to non-magical weapon damage for 3 turns.',
    duration: 3
  },
  titan_strength: {
    desc: '+3 Strength and +2 Physical Defence for 8 turns. Heavy weapons deal +1 damage die.',
    duration: 8,
    statModifiers: { strength: 3, physicalDefence: 2 }
  },
  hp_regen: {
    desc: 'Restore 1 HP at the start of each turn for 5 turns (Process Turn).'
  },
  stamina_regen: {
    desc: 'Restore 1 Stamina at the start of each turn for 5 turns (Process Turn).'
  }
}

function mergeEffect(id, patch) {
  effects[id] = { ...effects[id], ...patch }
  // Remove invalid luck stat if present elsewhere
  if (effects[id].statModifiers?.luck != null) {
    delete effects[id].statModifiers.luck
    if (!Object.keys(effects[id].statModifiers).length) delete effects[id].statModifiers
  }
}

for (const [id, patch] of Object.entries(PATCHES)) {
  if (!effects[id]) {
    console.warn('Missing effect id:', id)
    continue
  }
  mergeEffect(id, patch)
}

// Global cleanup pass for anything missed
for (const [id, effect] of Object.entries(effects)) {
  if (typeof effect.desc === 'string') {
    effect.desc = effect.desc
      .replace(/\s*Suggested default:.*?(?=\.|$)/gi, '')
      .replace(/\s*Special effect:.*?GM-defined bonus\.?/gi, '')
      .replace(/\s*Use the item\/skill text first;.*?(?=\.|$)/gi, '')
      .replace(/\s*if your table uses that rule\.?/gi, '.')
      .replace(/\s*Default aura range: /gi, 'Aura radius: ')
      .replace(/\s*usually for one scene, fight, or GM-defined duration\.?/gi, '.')
      .replace(/\s*GM should define limits\.?/gi, 'Legendary — limited duration when applied as a status.')
      .replace(/\s{2,}/g, ' ')
      .trim()
  }
  if (effect.statModifiers?.luck != null) {
    effect.statModifiers.accuracy = (effect.statModifiers.accuracy || 0) - 2
    delete effect.statModifiers.luck
  }
}

fs.writeFileSync(effectsPath, JSON.stringify(effects, null, 2), 'utf8')
console.log(`Refined ${Object.keys(PATCHES).length} effects in ${effectsPath}`)
