(() => {
  'use strict'

  const STORAGE_KEY = 'lumenforge_characters_v1'
  const ACTIVE_KEY = 'lumenforge_active_character_v1'
  const CURRENCY_RATE = { gold: 2500, silver: 100, copper: 1 }

  const DEFAULT_STATS = {
    hp: 10,
    stamina: 10,
    strength: -3,
    magicPower: -3,
    accuracy: -3,
    speed: 2,
    physicalDefence: 8,
    magicalDefence: 8
  }

  const STAT_RULES = {
    hp: { label: 'HP', cost: 3, min: 1, max: 500, desc: 'Maximum health. Simple, boring, important. Like vegetables, but with less betrayal.' },
    stamina: { label: 'Stamina', cost: 4, min: 1, max: 200, desc: 'Fuel for active skills, stances, spells and heroic nonsense.' },
    strength: { label: 'Strength', cost: 10, min: -5, max: 15, desc: 'Physical damage, grappling and hitting problems until they become smaller problems.' },
    magicPower: { label: 'Magic Power', cost: 10, min: -5, max: 15, desc: 'Spell power and magical effectiveness.' },
    accuracy: { label: 'Accuracy', cost: 8, min: -5, max: 12, desc: 'Helps attacks connect instead of humiliating you publicly.' },
    speed: { label: 'Speed', cost: 12, min: 1, max: 20, desc: 'Turn order, movement feel and evasion-style checks.' },
    physicalDefence: { label: 'Physical Defence', cost: 10, min: 1, max: 30, desc: 'Armour class against sharp, blunt and generally rude physical threats.' },
    magicalDefence: { label: 'Magical Defence', cost: 10, min: 1, max: 30, desc: 'Protection against spells, curses and suspicious glowing nonsense.' }
  }

  const TOGGLE_BONUSES = {
    defensive_stance: { physicalDefence: 2, magicalDefence: 2 },
    polearm_defensive_stance: { physicalDefence: 2, magicalDefence: 2 },
    berserker_rage: { strength: 2, speed: 2, physicalDefence: -1 },
    monster_berserker_rage: { strength: 2, speed: 2, physicalDefence: -1 },
    fortress_stance: { physicalDefence: 4, magicalDefence: 4 }
  }

  const PASSIVE_SKILL_BONUSES = {
    tough_skin: { physicalDefence: 2 },
    rock_skin: { physicalDefence: 3 },
    metal_skin: { physicalDefence: 4 },
    magical_resistance: { magicalDefence: 3 },
    spell_immunity: { magicalDefence: 6 },
    staff_basics: { magicPower: 1 },
    staff_mastery: { magicPower: 4 },
    dagger_mastery: { speed: 2 },
    wind_mastery: { speed: 3 },
    dwarven_toughness: { hp: 5 },
    elven_accuracy: { accuracy: 1 },
    human_determination: { accuracy: 1 },
    pack_coordination: { accuracy: 1 }
  }

  const INCOMPATIBILITIES = {
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

  const EFFECT_DEFINITIONS = {
    "burn": {
      "id": "burn",
      "name": "Burn",
      "icon": "🔥",
      "type": "damageOverTime",
      "duration": 4,
      "potency": 1,
      "desc": "Take 1 fire damage per turn for 4 turns. Strength is reduced by 2 while burning.",
      "statModifiers": {
        "strength": -2
      },
      "stackable": false,
      "manual": true
    },
    "poison": {
      "id": "poison",
      "name": "Poison",
      "icon": "☠️",
      "type": "damageOverTime",
      "duration": 3,
      "potency": "escalating",
      "desc": "Escalating toxin damage over 3 turns: 1 damage, then 2, then 3.",
      "stackable": true,
      "manual": true
    },
    "acid_corrosion": {
      "id": "acid_corrosion",
      "name": "Acid Corrosion",
      "icon": "🧪",
      "type": "damageOverTime",
      "duration": 5,
      "potency": 1,
      "desc": "Corrodes armour by 1 each turn for 5 turns. Usually no direct damage, but armour loss can become permanent if untreated.",
      "stackable": true
    },
    "incapacitated": {
      "id": "incapacitated",
      "name": "Incapacitated",
      "icon": "😵",
      "type": "control",
      "duration": 2,
      "potency": 0,
      "desc": "Cannot take actions. Covers stun, knockout, daze and similar hard-control effects.",
      "stackable": false
    },
    "immobilized": {
      "id": "immobilized",
      "name": "Immobilized",
      "icon": "🧊",
      "type": "control",
      "duration": 3,
      "potency": 0,
      "desc": "Cannot move, but can still attack/cast if otherwise able. Covers freeze, entangle and paralysis-like roots.",
      "stackable": false
    },
    "mind_controlled": {
      "id": "mind_controlled",
      "name": "Mind Controlled",
      "icon": "🧠",
      "type": "control",
      "duration": 3,
      "potency": 0,
      "desc": "Mental control variant. Fear forces movement away; charm prevents attacks against the charmer.",
      "stackable": false
    },
    "weakened": {
      "id": "weakened",
      "name": "Weakened",
      "icon": "💔",
      "type": "statDebuff",
      "duration": 4,
      "potency": 2,
      "desc": "All major stats are reduced by 2 while active. Combines slow, weak and confused style effects.",
      "statModifiers": {
        "strength": -2,
        "speed": -2,
        "magicPower": -2,
        "accuracy": -2
      },
      "stackable": false
    },
    "cursed": {
      "id": "cursed",
      "name": "Cursed",
      "icon": "💀",
      "type": "statDebuff",
      "duration": 8,
      "potency": 1,
      "desc": "Bad luck clings to the target: -2 Luck/roll pressure and 1 damage when using abilities if your table uses that rule.",
      "statModifiers": {
        "luck": -2
      },
      "stackable": true
    },
    "regeneration": {
      "id": "regeneration",
      "name": "Regeneration",
      "icon": "💚",
      "type": "healOverTime",
      "duration": 5,
      "potency": 2,
      "desc": "Restore 2 HP per turn for 5 turns. Also grants immunity/resistance to poison and disease while active.",
      "immunities": [
        "poison"
      ],
      "stackable": false,
      "tickHeal": 2
    },
    "hp_regen": {
      "id": "hp_regen",
      "name": "HP Regen",
      "icon": "💚",
      "type": "healOverTime",
      "duration": 5,
      "potency": 1,
      "desc": "Restore HP every turn. Default: 1 HP per turn unless potency is changed.",
      "stackable": true,
      "tickHeal": 1,
      "manual": true
    },
    "stamina_regen": {
      "id": "stamina_regen",
      "name": "Stamina Regen",
      "icon": "🟢",
      "type": "recovery",
      "duration": 5,
      "potency": 1,
      "desc": "Restore Stamina every turn. Default: 1 Stamina per turn unless potency is changed.",
      "stackable": true,
      "tickStamina": 1,
      "manual": true
    },
    "enhanced": {
      "id": "enhanced",
      "name": "Enhanced",
      "icon": "💪",
      "type": "statBuff",
      "duration": 8,
      "potency": 2,
      "desc": "Physical enhancement: Strength +2, Speed +2 and Physical Defence +2 while active.",
      "statModifiers": {
        "strength": 2,
        "speed": 2,
        "physicalDefence": 2
      },
      "stackable": false
    },
    "empowered": {
      "id": "empowered",
      "name": "Empowered",
      "icon": "✨",
      "type": "statBuff",
      "duration": 6,
      "potency": 3,
      "desc": "Magical empowerment: Magic Power +3 and spell costs may be reduced by 1.",
      "statModifiers": {
        "magicPower": 3
      },
      "spellCostReduction": 1,
      "stackable": false
    },
    "weapon_enchanted": {
      "id": "weapon_enchanted",
      "name": "Enchanted Weapon",
      "icon": "⚔️",
      "type": "enhancement",
      "duration": 10,
      "potency": 0,
      "desc": "Weapon deals +1d6 chosen elemental damage while active. Choose fire, ice, lightning or radiant.",
      "stackable": false
    },
    "protected": {
      "id": "protected",
      "name": "Protected",
      "icon": "🛡️",
      "type": "protection",
      "duration": 6,
      "potency": 3,
      "desc": "Absorb or block the next few attacks. Suggested default: +3 Physical and Magical Defence while protection remains.",
      "statModifiers": {
        "physicalDefence": 3,
        "magicalDefence": 3
      },
      "stackable": false
    },
    "spell_warded": {
      "id": "spell_warded",
      "name": "Spell Warded",
      "icon": "🔮",
      "type": "protection",
      "duration": 8,
      "potency": 0,
      "desc": "Immune/resistant to magical status effects. Suggested default: half magic damage and immunity to curse/charm/weakened from spells.",
      "stackable": false
    },
    "enhanced_mobility": {
      "id": "enhanced_mobility",
      "name": "Enhanced Mobility",
      "icon": "🦅",
      "type": "movement",
      "duration": 10,
      "potency": 0,
      "desc": "Can fly, breathe water, or ignore movement restrictions depending on source. Immune to Immobilized while active.",
      "immunities": [
        "immobilized"
      ],
      "stackable": false
    },
    "stealth_mastery": {
      "id": "stealth_mastery",
      "name": "Stealth Mastery",
      "icon": "👻",
      "type": "utility",
      "duration": 5,
      "potency": 0,
      "desc": "Invisible/hard to target and resistant to mental effects. Perfect sneaky-gremlin mode.",
      "immunities": [
        "mind_controlled"
      ],
      "stackable": false
    },
    "intimidating_aura": {
      "id": "intimidating_aura",
      "name": "Intimidating Aura",
      "icon": "👹",
      "type": "aura",
      "duration": 999,
      "potency": 2,
      "desc": "Enemies nearby must resist fear/mind-control pressure when they see you. Default aura range: 30ft.",
      "stackable": false
    },
    "toxic_presence": {
      "id": "toxic_presence",
      "name": "Toxic Presence",
      "icon": "☠️",
      "type": "aura",
      "duration": 999,
      "potency": 1,
      "desc": "Enemies nearby take poison pressure or damage; allies may gain poison immunity. Default aura range: 15ft.",
      "stackable": false
    },
    "fear": {
      "id": "fear",
      "name": "Fear",
      "icon": "😨",
      "type": "control",
      "duration": 3,
      "potency": 0,
      "desc": "Target must move away, cannot willingly approach, or takes disadvantage while facing the source.",
      "stackable": false,
      "manual": true
    },
    "charm": {
      "id": "charm",
      "name": "Charm",
      "icon": "💘",
      "type": "control",
      "duration": 3,
      "potency": 0,
      "desc": "Target cannot attack the charmer and may treat them as friendly until harmed or the effect ends.",
      "stackable": false,
      "manual": true
    },
    "silenced": {
      "id": "silenced",
      "name": "Silenced",
      "icon": "🤐",
      "type": "control",
      "duration": 2,
      "potency": 0,
      "desc": "Cannot use voice-based spells, commands, shouts, or sound effects.",
      "stackable": false,
      "manual": true
    },
    "blinded": {
      "id": "blinded",
      "name": "Blinded",
      "icon": "🙈",
      "type": "control",
      "duration": 2,
      "potency": 0,
      "desc": "Cannot see. Attacks and perception relying on sight are heavily penalised.",
      "statModifiers": {
        "accuracy": -3
      },
      "stackable": false,
      "manual": true
    },
    "knockdown": {
      "id": "knockdown",
      "name": "Knockdown",
      "icon": "🌀",
      "type": "control",
      "duration": 1,
      "potency": 0,
      "desc": "Knocked prone/off-balance. Usually costs movement or an action to stand.",
      "stackable": false,
      "manual": true
    },
    "poison_immunity": {
      "id": "poison_immunity",
      "name": "Poison Immunity",
      "icon": "☠️",
      "type": "protection",
      "duration": 999,
      "potency": 0,
      "desc": "Immune to poison damage and poison status effects.",
      "immunities": [
        "poison"
      ],
      "stackable": false
    },
    "poison_resistance": {
      "id": "poison_resistance",
      "name": "Poison Resistance",
      "icon": "☠️",
      "type": "protection",
      "duration": 999,
      "potency": 0,
      "desc": "Take reduced poison damage and gain advantage/resistance against poison status effects.",
      "stackable": false
    },
    "disease_immunity": {
      "id": "disease_immunity",
      "name": "Disease Immunity",
      "icon": "🧬",
      "type": "protection",
      "duration": 999,
      "potency": 0,
      "desc": "Immune to disease status effects unless a story/legendary effect overrides it.",
      "stackable": false
    },
    "fire_resistance": {
      "id": "fire_resistance",
      "name": "Fire Resistance",
      "icon": "🔥",
      "type": "protection",
      "duration": 999,
      "potency": 0,
      "desc": "Reduce fire damage taken. Suggested default: half damage from fire and advantage/resistance vs Burn.",
      "stackable": false
    },
    "undead_bane": {
      "id": "undead_bane",
      "name": "Undead Bane",
      "icon": "☀️",
      "type": "special",
      "duration": 0,
      "potency": 0,
      "desc": "Deal extra damage or gain advantage against undead. Suggested default: +1d6 radiant/holy damage to undead.",
      "stackable": false
    },
    "burn_on_hit": {
      "id": "burn_on_hit",
      "name": "Burn On Hit",
      "icon": "🔥",
      "type": "damageOverTime",
      "duration": 0,
      "potency": 0,
      "desc": "On hit, the attack may apply Burn: 1 fire damage per turn for 4 turns and Strength -2 while burning.",
      "stackable": false
    },
    "freeze_on_hit": {
      "id": "freeze_on_hit",
      "name": "Freeze On Hit",
      "icon": "❄️",
      "type": "special",
      "duration": 0,
      "potency": 0,
      "desc": "On hit, the attack may apply Immobilized/frozen: target cannot move but can still act unless fully frozen by the GM.",
      "stackable": false
    },
    "wind_slash": {
      "id": "wind_slash",
      "name": "Wind Slash",
      "icon": "✦",
      "type": "special",
      "duration": 0,
      "potency": 0,
      "desc": "A ranged wind blade. Suggested default: slash at short range and push target 5–10ft.",
      "stackable": false
    },
    "bleeding": {
      "id": "bleeding",
      "name": "Bleeding",
      "icon": "🩸",
      "type": "damageOverTime",
      "duration": 0,
      "potency": 0,
      "desc": "Target bleeds after a strong hit. Suggested default: 1 damage per turn for 3 turns or until treated.",
      "stackable": false
    },
    "dragon_fire": {
      "id": "dragon_fire",
      "name": "Dragon Fire",
      "icon": "🔥",
      "type": "special",
      "duration": 0,
      "potency": 0,
      "desc": "Attack carries dragon flame. Suggested default: +1d6 fire damage and chance to Burn; stronger against fear-prone enemies.",
      "stackable": false
    },
    "poison_on_hit": {
      "id": "poison_on_hit",
      "name": "Poison On Hit",
      "icon": "☠️",
      "type": "damageOverTime",
      "duration": 0,
      "potency": 0,
      "desc": "On hit, the attack may apply Poison: escalating damage over 3 turns, usually 1 then 2 then 3.",
      "stackable": false
    },
    "stealth_strike": {
      "id": "stealth_strike",
      "name": "Stealth Strike",
      "icon": "🌑",
      "type": "utility",
      "duration": 0,
      "potency": 0,
      "desc": "Deal extra damage when attacking from stealth. Suggested default: +1d6 damage from hidden/ambush positions.",
      "stackable": false
    },
    "critical_strike": {
      "id": "critical_strike",
      "name": "Critical Strike",
      "icon": "✦",
      "type": "special",
      "duration": 0,
      "potency": 0,
      "desc": "Improves critical-hit reliability or damage. Suggested default: critical on 19–20 or +1 damage die on crits.",
      "stackable": false
    },
    "phase_strike": {
      "id": "phase_strike",
      "name": "Phase Strike",
      "icon": "✦",
      "type": "special",
      "duration": 0,
      "potency": 0,
      "desc": "Attack partially phases through defences. Suggested default: ignore shields/barriers for this strike.",
      "stackable": false
    },
    "shadow_step": {
      "id": "shadow_step",
      "name": "Shadow Step",
      "icon": "🌑",
      "type": "utility",
      "duration": 0,
      "potency": 0,
      "desc": "Teleport or blink between shadows. Suggested default: move up to 30ft between dim/dark spaces.",
      "stackable": false
    },
    "time_strike": {
      "id": "time_strike",
      "name": "Time Strike",
      "icon": "✦",
      "type": "special",
      "duration": 0,
      "potency": 0,
      "desc": "Special effect: Time Strike. Use the item/skill text first; if no exact number is listed, treat this as a light GM-defined bonus.",
      "stackable": false
    },
    "piercing": {
      "id": "piercing",
      "name": "Piercing",
      "icon": "✦",
      "type": "special",
      "duration": 0,
      "potency": 0,
      "desc": "Ignores light cover or part of physical defence. Suggested default: ignore 1–2 points of armour/defence.",
      "stackable": false
    },
    "shock_on_hit": {
      "id": "shock_on_hit",
      "name": "Shock On Hit",
      "icon": "⚡",
      "type": "special",
      "duration": 0,
      "potency": 0,
      "desc": "On hit, the attack may apply Incapacitated/stunned: target loses actions briefly on a failed save.",
      "stackable": false
    },
    "nature_blessing": {
      "id": "nature_blessing",
      "name": "Nature Blessing",
      "icon": "✦",
      "type": "special",
      "duration": 0,
      "potency": 0,
      "desc": "Nature magic assists the user. Suggested default: bonus to survival/nature checks and minor healing or calm animals.",
      "stackable": false
    },
    "piercing_light": {
      "id": "piercing_light",
      "name": "Piercing Light",
      "icon": "☀️",
      "type": "special",
      "duration": 0,
      "potency": 0,
      "desc": "Radiant attack pierces cover, darkness, or illusions. Suggested default: ignore concealment from darkness.",
      "stackable": false
    },
    "lightning_arrows": {
      "id": "lightning_arrows",
      "name": "Lightning Arrows",
      "icon": "⚡",
      "type": "special",
      "duration": 0,
      "potency": 0,
      "desc": "Arrows carry lightning. Suggested default: +1d6 lightning damage and chance to Incapacitate.",
      "stackable": false
    },
    "star_arrows": {
      "id": "star_arrows",
      "name": "Star Arrows",
      "icon": "✦",
      "type": "special",
      "duration": 0,
      "potency": 0,
      "desc": "Arrows carry celestial power. Suggested default: radiant/cosmic damage and easier hits in darkness.",
      "stackable": false
    },
    "armor_pierce": {
      "id": "armor_pierce",
      "name": "Armor Pierce",
      "icon": "🛡️",
      "type": "special",
      "duration": 0,
      "potency": 0,
      "desc": "Ignores part of enemy armour. Suggested default: reduce target Physical Defence by 2 for this attack.",
      "stackable": false
    },
    "holy_strike": {
      "id": "holy_strike",
      "name": "Holy Strike",
      "icon": "☀️",
      "type": "special",
      "duration": 0,
      "potency": 0,
      "desc": "Attack deals holy/radiant damage and is especially effective against undead, demons, and darkness.",
      "stackable": false
    },
    "earthquake": {
      "id": "earthquake",
      "name": "Earthquake",
      "icon": "✦",
      "type": "special",
      "duration": 0,
      "potency": 0,
      "desc": "Creates a ground shock. Suggested default: area knockdown/terrain disruption and earth damage.",
      "stackable": false
    },
    "thunder_strike": {
      "id": "thunder_strike",
      "name": "Thunder Strike",
      "icon": "⚡",
      "type": "special",
      "duration": 0,
      "potency": 0,
      "desc": "Thunderous hit. Suggested default: extra lightning/thunder damage and chance to Incapacitate.",
      "stackable": false
    },
    "earth_shatter": {
      "id": "earth_shatter",
      "name": "Earth Shatter",
      "icon": "✦",
      "type": "special",
      "duration": 0,
      "potency": 0,
      "desc": "Breaks stone/armour/ground. Suggested default: damage plus reduce defence or destroy cover.",
      "stackable": false
    },
    "void_impact": {
      "id": "void_impact",
      "name": "Void Impact",
      "icon": "🌑",
      "type": "special",
      "duration": 0,
      "potency": 0,
      "desc": "Hit carries void force. Suggested default: +1d6 void damage and possible knockback or anti-magic pressure.",
      "stackable": false
    },
    "cleave": {
      "id": "cleave",
      "name": "Cleave",
      "icon": "✦",
      "type": "special",
      "duration": 0,
      "potency": 0,
      "desc": "When you drop or heavily wound a target, carry some damage into an adjacent enemy or make a follow-up swing.",
      "stackable": false
    },
    "double_strike": {
      "id": "double_strike",
      "name": "Double Strike",
      "icon": "✦",
      "type": "special",
      "duration": 0,
      "potency": 0,
      "desc": "May strike twice as part of the attack. Default: second hit uses the same roll rules but does not double other once-per-turn bonuses.",
      "stackable": false
    },
    "lifesteal": {
      "id": "lifesteal",
      "name": "Lifesteal",
      "icon": "💚",
      "type": "special",
      "duration": 0,
      "potency": 0,
      "desc": "Heal for part of the damage you deal. Suggested default: regain HP equal to half the damage dealt.",
      "stackable": false
    },
    "rage_mode": {
      "id": "rage_mode",
      "name": "Rage Mode",
      "icon": "💪",
      "type": "special",
      "duration": 0,
      "potency": 0,
      "desc": "Enter rage. Suggested default: +2 Strength, resist pain/control, but -1 Defence or limited tactical choices.",
      "stackable": false
    },
    "execution": {
      "id": "execution",
      "name": "Execution",
      "icon": "✦",
      "type": "special",
      "duration": 0,
      "potency": 0,
      "desc": "Deal bonus damage to wounded targets. Suggested default: +1d6 damage if the target is below half HP.",
      "stackable": false
    },
    "chaos_strike": {
      "id": "chaos_strike",
      "name": "Chaos Strike",
      "icon": "✦",
      "type": "special",
      "duration": 0,
      "potency": 0,
      "desc": "Unstable strike with chaotic extra effects. Suggested default: add random element/damage or roll on a small chaos table.",
      "stackable": false
    },
    "reality_cut": {
      "id": "reality_cut",
      "name": "Reality Cut",
      "icon": "✦",
      "type": "special",
      "duration": 0,
      "potency": 0,
      "desc": "Legendary attack that cuts through reality. Suggested default: bypass most normal defence/barriers once per scene.",
      "stackable": false
    },
    "mana_efficiency": {
      "id": "mana_efficiency",
      "name": "Mana Efficiency",
      "icon": "✨",
      "type": "special",
      "duration": 0,
      "potency": 0,
      "desc": "Reduce spell or skill Stamina costs. Suggested default: magical abilities cost 1 less Stamina, minimum 1.",
      "stackable": false
    },
    "drain_mana": {
      "id": "drain_mana",
      "name": "Drain Mana",
      "icon": "✨",
      "type": "special",
      "duration": 0,
      "potency": 0,
      "desc": "Drain magical energy/stamina from the target. Suggested default: target loses 1d4+1 Stamina; user may regain half.",
      "stackable": false
    },
    "elemental_mastery": {
      "id": "elemental_mastery",
      "name": "Elemental Mastery",
      "icon": "✦",
      "type": "special",
      "duration": 0,
      "potency": 0,
      "desc": "Improve elemental magic. Suggested default: choose/empower elements and gain +1 damage die or +2 checks with elemental effects.",
      "stackable": false
    },
    "cosmic_power": {
      "id": "cosmic_power",
      "name": "Cosmic Power",
      "icon": "✦",
      "type": "special",
      "duration": 0,
      "potency": 0,
      "desc": "Legendary cosmic magic. Suggested default: boosts spell power and may bend gravity/space in GM-approved ways.",
      "stackable": false
    },
    "creation_magic": {
      "id": "creation_magic",
      "name": "Creation Magic",
      "icon": "✨",
      "type": "statBuff",
      "duration": 0,
      "potency": 0,
      "desc": "Can create or shape minor objects/energy. Legendary versions can make major constructs at GM discretion.",
      "stackable": false
    },
    "reach": {
      "id": "reach",
      "name": "Reach",
      "icon": "✦",
      "type": "special",
      "duration": 0,
      "potency": 0,
      "desc": "Can attack from farther away. Suggested default: melee reach increases by 5ft.",
      "stackable": false
    },
    "anti_cavalry": {
      "id": "anti_cavalry",
      "name": "Anti Cavalry",
      "icon": "✦",
      "type": "special",
      "duration": 0,
      "potency": 0,
      "desc": "Strong against charging/large moving enemies. Suggested default: bonus damage or stop movement on hit.",
      "stackable": false
    },
    "sweeping_strikes": {
      "id": "sweeping_strikes",
      "name": "Sweeping Strikes",
      "icon": "✦",
      "type": "special",
      "duration": 0,
      "potency": 0,
      "desc": "Hit multiple nearby enemies with broad swings. Suggested default: one attack can affect two adjacent targets.",
      "stackable": false
    },
    "dragon_slayer": {
      "id": "dragon_slayer",
      "name": "Dragon Slayer",
      "icon": "🐉",
      "type": "special",
      "duration": 0,
      "potency": 0,
      "desc": "Deal extra damage or gain advantage against dragons. Suggested default: +1d6 damage to dragons, +2 on relevant checks.",
      "stackable": false
    },
    "infinite_reach": {
      "id": "infinite_reach",
      "name": "Infinite Reach",
      "icon": "✦",
      "type": "special",
      "duration": 0,
      "potency": 0,
      "desc": "Can strike at extreme or magical range. Use as a legendary reach effect; GM sets line of sight/range limits.",
      "stackable": false
    },
    "dimension_pierce": {
      "id": "dimension_pierce",
      "name": "Dimension Pierce",
      "icon": "✦",
      "type": "special",
      "duration": 0,
      "potency": 0,
      "desc": "Attacks can bypass physical barriers, armour, or dimensional protection. Legendary effect; GM decides exact limits.",
      "stackable": false
    },
    "damage_reduction": {
      "id": "damage_reduction",
      "name": "Damage Reduction",
      "icon": "✦",
      "type": "protection",
      "duration": 0,
      "potency": 0,
      "desc": "Reduce incoming damage. Suggested default: subtract 1 damage from each hit, or more for rare/legendary armour.",
      "stackable": false
    },
    "mana_regeneration": {
      "id": "mana_regeneration",
      "name": "Mana Regeneration",
      "icon": "💚",
      "type": "recovery",
      "duration": 0,
      "potency": 0,
      "desc": "Regain magical energy over time. In this rebuild, treat it as +1 Stamina at the start of each turn unless the GM scales it.",
      "stackable": false
    },
    "fire_immunity": {
      "id": "fire_immunity",
      "name": "Fire Immunity",
      "icon": "🔥",
      "type": "special",
      "duration": 0,
      "potency": 0,
      "desc": "Immune to fire damage and Burn while the effect is active.",
      "stackable": false
    },
    "cold_aura": {
      "id": "cold_aura",
      "name": "Cold Aura",
      "icon": "❄️",
      "type": "aura",
      "duration": 0,
      "potency": 0,
      "desc": "Creates a chilling aura. Suggested default: nearby enemies lose speed or risk Immobilized on failed saves.",
      "stackable": false
    },
    "stealth": {
      "id": "stealth",
      "name": "Stealth",
      "icon": "🌑",
      "type": "utility",
      "duration": 0,
      "potency": 0,
      "desc": "Gain advantage/bonus on stealth checks and may hide more easily.",
      "stackable": false
    },
    "spell_absorption": {
      "id": "spell_absorption",
      "name": "Spell Absorption",
      "icon": "✨",
      "type": "protection",
      "duration": 0,
      "potency": 0,
      "desc": "Absorb or nullify some incoming magic. Suggested default: once per scene, cancel a spell and regain Stamina equal to its cost.",
      "stackable": false
    },
    "light_aura": {
      "id": "light_aura",
      "name": "Light Aura",
      "icon": "☀️",
      "type": "aura",
      "duration": 0,
      "potency": 0,
      "desc": "Creates a bright protective aura. Suggested default: sheds light, pressures undead/shadows, and grants allies +1 vs fear/darkness nearby.",
      "stackable": false
    },
    "haste": {
      "id": "haste",
      "name": "Haste",
      "icon": "💨",
      "type": "utility",
      "duration": 0,
      "potency": 0,
      "desc": "Move and act faster. Suggested default: +2 Speed and one small extra action/movement each turn.",
      "stackable": false
    },
    "burn_aura": {
      "id": "burn_aura",
      "name": "Burn Aura",
      "icon": "🔥",
      "type": "damageOverTime",
      "duration": 0,
      "potency": 0,
      "desc": "Creates a fire aura. Suggested default: adjacent enemies take 1 fire damage per turn or risk Burn.",
      "stackable": false
    },
    "frost_aura": {
      "id": "frost_aura",
      "name": "Frost Aura",
      "icon": "❄️",
      "type": "aura",
      "duration": 0,
      "potency": 0,
      "desc": "Creates a frost aura. Suggested default: nearby enemies lose speed or risk Immobilized on failed saves.",
      "stackable": false
    },
    "lightning_bolt": {
      "id": "lightning_bolt",
      "name": "Lightning Bolt",
      "icon": "⚡",
      "type": "special",
      "duration": 0,
      "potency": 0,
      "desc": "Can release a lightning bolt. Suggested default: ranged spell attack dealing lightning damage and possible Incapacitated.",
      "stackable": false
    },
    "invisibility": {
      "id": "invisibility",
      "name": "Invisibility",
      "icon": "🌑",
      "type": "utility",
      "duration": 0,
      "potency": 0,
      "desc": "Cannot be seen normally. Attacking, casting, or loud actions may break it depending on GM ruling.",
      "stackable": false
    },
    "extra_movement": {
      "id": "extra_movement",
      "name": "Extra Movement",
      "icon": "💨",
      "type": "utility",
      "duration": 0,
      "potency": 0,
      "desc": "Gain additional movement. Suggested default: +10ft movement or one extra movement step per turn.",
      "stackable": false
    },
    "silent_movement": {
      "id": "silent_movement",
      "name": "Silent Movement",
      "icon": "💨",
      "type": "utility",
      "duration": 0,
      "potency": 0,
      "desc": "Move silently. Suggested default: advantage on stealth movement and no noise from normal steps.",
      "stackable": false
    },
    "immovable": {
      "id": "immovable",
      "name": "Immovable",
      "icon": "✦",
      "type": "protection",
      "duration": 0,
      "potency": 0,
      "desc": "Cannot be forcibly moved, knocked down, or pushed unless the enemy effect is stronger/legendary.",
      "stackable": false
    },
    "flight": {
      "id": "flight",
      "name": "Flight",
      "icon": "☀️",
      "type": "utility",
      "duration": 0,
      "potency": 0,
      "desc": "Can fly while the effect is active. Suggested default: flying movement equal to normal movement speed.",
      "stackable": false
    },
    "spell_resistance": {
      "id": "spell_resistance",
      "name": "Spell Resistance",
      "icon": "✨",
      "type": "protection",
      "duration": 0,
      "potency": 0,
      "desc": "Reduce spell damage or improve saves against spells. Suggested default: +2 Magical Defence or half minor spell damage.",
      "stackable": false
    },
    "stone_skin": {
      "id": "stone_skin",
      "name": "Stone Skin",
      "icon": "🛡️",
      "type": "protection",
      "duration": 0,
      "potency": 0,
      "desc": "Skin hardens like stone. Suggested default: +3 Physical Defence and resistance to mundane weapon damage.",
      "stackable": false
    },
    "shadow_stealth": {
      "id": "shadow_stealth",
      "name": "Shadow Stealth",
      "icon": "🌑",
      "type": "utility",
      "duration": 0,
      "potency": 0,
      "desc": "Superior stealth in dim light or darkness; suggested default: advantage to hide and harder to target.",
      "stackable": false
    },
    "radiant_aura": {
      "id": "radiant_aura",
      "name": "Radiant Aura",
      "icon": "☀️",
      "type": "aura",
      "duration": 0,
      "potency": 0,
      "desc": "Creates a radiant aura. Suggested default: allies nearby resist darkness/fear; undead nearby take holy pressure or disadvantage.",
      "stackable": false
    },
    "nature_resistance": {
      "id": "nature_resistance",
      "name": "Nature Resistance",
      "icon": "🛡️",
      "type": "protection",
      "duration": 0,
      "potency": 0,
      "desc": "Resist natural hazards, poison plants, difficult terrain, and weather effects.",
      "stackable": false
    },
    "mirror_image": {
      "id": "mirror_image",
      "name": "Mirror Image",
      "icon": "✦",
      "type": "special",
      "duration": 0,
      "potency": 0,
      "desc": "Creates decoy images. Suggested default: first few incoming hits may strike an illusion instead.",
      "stackable": false
    },
    "critical_chance": {
      "id": "critical_chance",
      "name": "Critical Chance",
      "icon": "✦",
      "type": "special",
      "duration": 0,
      "potency": 0,
      "desc": "Improves odds of critical hits. Suggested default: critical range +1, such as 19–20 instead of only 20.",
      "stackable": false
    },
    "luck": {
      "id": "luck",
      "name": "Luck",
      "icon": "🍀",
      "type": "statBuff",
      "duration": 0,
      "potency": 0,
      "desc": "Improves luck. Suggested default: once per session/scene reroll a bad roll or add +2 after rolling.",
      "stackable": false
    },
    "magic_sight": {
      "id": "magic_sight",
      "name": "Magic Sight",
      "icon": "✨",
      "type": "statBuff",
      "duration": 0,
      "potency": 0,
      "desc": "Can see magical auras, invisible magic traces, or enchanted objects.",
      "stackable": false
    },
    "identify": {
      "id": "identify",
      "name": "Identify",
      "icon": "👁️",
      "type": "special",
      "duration": 0,
      "potency": 0,
      "desc": "Can identify magic items/effects more easily, usually without a full ritual.",
      "stackable": false
    },
    "crush": {
      "id": "crush",
      "name": "Crush",
      "icon": "💪",
      "type": "special",
      "duration": 0,
      "potency": 0,
      "desc": "Crushing force. Suggested default: bonus vs armour/shields and may knock target prone.",
      "stackable": false
    },
    "spell_memory": {
      "id": "spell_memory",
      "name": "Spell Memory",
      "icon": "✨",
      "type": "special",
      "duration": 0,
      "potency": 0,
      "desc": "Remember or prepare additional spells. Suggested default: +1 prepared spell/known cast option.",
      "stackable": false
    },
    "keen_sight": {
      "id": "keen_sight",
      "name": "Keen Sight",
      "icon": "👁️",
      "type": "special",
      "duration": 0,
      "potency": 0,
      "desc": "Improved vision and awareness. Suggested default: +2/advantage on perception checks.",
      "stackable": false
    },
    "steady_hands": {
      "id": "steady_hands",
      "name": "Steady Hands",
      "icon": "✦",
      "type": "statBuff",
      "duration": 0,
      "potency": 0,
      "desc": "Better precision. Suggested default: +2 to delicate ranged/tool checks and fewer fumbles.",
      "stackable": false
    },
    "long_range_sight": {
      "id": "long_range_sight",
      "name": "Long Range Sight",
      "icon": "👁️",
      "type": "special",
      "duration": 0,
      "potency": 0,
      "desc": "See clearly at long range. Suggested default: ignore range penalties for scouting/aiming within reason.",
      "stackable": false
    },
    "concentration": {
      "id": "concentration",
      "name": "Concentration",
      "icon": "✦",
      "type": "statBuff",
      "duration": 0,
      "potency": 0,
      "desc": "Better at maintaining spells. Suggested default: advantage/+2 on concentration checks.",
      "stackable": false
    },
    "heal_2": {
      "id": "heal_2",
      "name": "Heal 2",
      "icon": "💚",
      "type": "recovery",
      "duration": 0,
      "potency": 0,
      "desc": "Restore 2 HP when used. Usually instant, unless the GM says the item takes time to consume.",
      "stackable": false
    },
    "heal_5": {
      "id": "heal_5",
      "name": "Heal 5",
      "icon": "💚",
      "type": "recovery",
      "duration": 0,
      "potency": 0,
      "desc": "Restore 5 HP when used. Usually instant, unless the GM says the item takes time to consume.",
      "stackable": false
    },
    "heal_3": {
      "id": "heal_3",
      "name": "Heal 3",
      "icon": "💚",
      "type": "recovery",
      "duration": 0,
      "potency": 0,
      "desc": "Restore 3 HP when used. Usually instant, unless the GM says the item takes time to consume.",
      "stackable": false
    },
    "restore_stamina_2": {
      "id": "restore_stamina_2",
      "name": "Restore Stamina 2",
      "icon": "✦",
      "type": "recovery",
      "duration": 0,
      "potency": 0,
      "desc": "Restore 2 Stamina when used. Treat this as instant during downtime or as an action in combat.",
      "stackable": false
    },
    "heal_8": {
      "id": "heal_8",
      "name": "Heal 8",
      "icon": "💚",
      "type": "recovery",
      "duration": 0,
      "potency": 0,
      "desc": "Restore 8 HP when used. Usually instant, unless the GM says the item takes time to consume.",
      "stackable": false
    },
    "temp_strength_1": {
      "id": "temp_strength_1",
      "name": "Temp Strength 1",
      "icon": "💪",
      "type": "statBuff",
      "duration": 0,
      "potency": 0,
      "desc": "Gain +1 Strength temporarily, usually for one scene, fight, or GM-defined duration.",
      "stackable": false
    },
    "restore_stamina_5": {
      "id": "restore_stamina_5",
      "name": "Restore Stamina 5",
      "icon": "✦",
      "type": "recovery",
      "duration": 0,
      "potency": 0,
      "desc": "Restore 5 Stamina when used. Treat this as instant during downtime or as an action in combat.",
      "stackable": false
    },
    "temp_magic_1": {
      "id": "temp_magic_1",
      "name": "Temp Magic 1",
      "icon": "✨",
      "type": "statBuff",
      "duration": 0,
      "potency": 0,
      "desc": "Gain +1 Magic Power temporarily, usually for one scene, fight, or GM-defined duration.",
      "stackable": false
    },
    "heal_25": {
      "id": "heal_25",
      "name": "Heal 25",
      "icon": "💚",
      "type": "recovery",
      "duration": 0,
      "potency": 0,
      "desc": "Restore 25 HP when used. Usually instant, unless the GM says the item takes time to consume.",
      "stackable": false
    },
    "restore_stamina_15": {
      "id": "restore_stamina_15",
      "name": "Restore Stamina 15",
      "icon": "✦",
      "type": "recovery",
      "duration": 0,
      "potency": 0,
      "desc": "Restore 15 Stamina when used. Treat this as instant during downtime or as an action in combat.",
      "stackable": false
    },
    "heal_50": {
      "id": "heal_50",
      "name": "Heal 50",
      "icon": "💚",
      "type": "recovery",
      "duration": 0,
      "potency": 0,
      "desc": "Restore 50 HP when used. Usually instant, unless the GM says the item takes time to consume.",
      "stackable": false
    },
    "restore_stamina_30": {
      "id": "restore_stamina_30",
      "name": "Restore Stamina 30",
      "icon": "✦",
      "type": "recovery",
      "duration": 0,
      "potency": 0,
      "desc": "Restore 30 Stamina when used. Treat this as instant during downtime or as an action in combat.",
      "stackable": false
    },
    "temp_strength_3": {
      "id": "temp_strength_3",
      "name": "Temp Strength 3",
      "icon": "💪",
      "type": "statBuff",
      "duration": 0,
      "potency": 0,
      "desc": "Gain +3 Strength temporarily, usually for one scene, fight, or GM-defined duration.",
      "stackable": false
    },
    "temp_speed_3": {
      "id": "temp_speed_3",
      "name": "Temp Speed 3",
      "icon": "💨",
      "type": "statBuff",
      "duration": 0,
      "potency": 0,
      "desc": "Gain +3 Speed temporarily, usually for one scene, fight, or GM-defined duration.",
      "stackable": false
    },
    "temp_magic_3": {
      "id": "temp_magic_3",
      "name": "Temp Magic 3",
      "icon": "✨",
      "type": "statBuff",
      "duration": 0,
      "potency": 0,
      "desc": "Gain +3 Magic Power temporarily, usually for one scene, fight, or GM-defined duration.",
      "stackable": false
    },
    "temp_defense_4": {
      "id": "temp_defense_4",
      "name": "Temp Defense 4",
      "icon": "🛡️",
      "type": "protection",
      "duration": 0,
      "potency": 0,
      "desc": "Gain +4 Defence temporarily, usually for one scene, fight, or GM-defined duration.",
      "stackable": false
    },
    "invisibility_5_turns": {
      "id": "invisibility_5_turns",
      "name": "Invisibility 5 Turns",
      "icon": "🌑",
      "type": "utility",
      "duration": 0,
      "potency": 0,
      "desc": "Become invisible for 5 turns, or until the GM rules the effect breaks.",
      "stackable": false
    },
    "fire_immunity_10_turns": {
      "id": "fire_immunity_10_turns",
      "name": "Fire Immunity 10 Turns",
      "icon": "🔥",
      "type": "special",
      "duration": 0,
      "potency": 0,
      "desc": "Become immune to fire damage and matching status effects for 10 turns.",
      "stackable": false
    },
    "cold_immunity_10_turns": {
      "id": "cold_immunity_10_turns",
      "name": "Cold Immunity 10 Turns",
      "icon": "❄️",
      "type": "special",
      "duration": 0,
      "potency": 0,
      "desc": "Immune to cold/ice damage and freeze-style effects for 10 turns.",
      "stackable": false
    },
    "temp_strength_5": {
      "id": "temp_strength_5",
      "name": "Temp Strength 5",
      "icon": "💪",
      "type": "statBuff",
      "duration": 0,
      "potency": 0,
      "desc": "Gain +5 Strength temporarily, usually for one scene, fight, or GM-defined duration.",
      "stackable": false
    },
    "temp_speed_2": {
      "id": "temp_speed_2",
      "name": "Temp Speed 2",
      "icon": "💨",
      "type": "statBuff",
      "duration": 0,
      "potency": 0,
      "desc": "Gain +2 Speed temporarily, usually for one scene, fight, or GM-defined duration.",
      "stackable": false
    },
    "temp_defense_minus_2": {
      "id": "temp_defense_minus_2",
      "name": "Temp Defense Minus 2",
      "icon": "🛡️",
      "type": "protection",
      "duration": 0,
      "potency": 0,
      "desc": "Temporary modifier: Temp Defense Minus 2. Use for one scene/fight or the item's listed duration.",
      "stackable": false
    },
    "cast_fireball": {
      "id": "cast_fireball",
      "name": "Cast Fireball",
      "icon": "🔥",
      "type": "special",
      "duration": 0,
      "potency": 0,
      "desc": "Cast Fireball from the item/scroll: area fire damage with a chance to Burn.",
      "stackable": false
    },
    "heal_40": {
      "id": "heal_40",
      "name": "Heal 40",
      "icon": "💚",
      "type": "recovery",
      "duration": 0,
      "potency": 0,
      "desc": "Restore 40 HP when used. Usually instant, unless the GM says the item takes time to consume.",
      "stackable": false
    },
    "remove_poison": {
      "id": "remove_poison",
      "name": "Remove Poison",
      "icon": "☠️",
      "type": "damageOverTime",
      "duration": 0,
      "potency": 0,
      "desc": "Remove Poison and similar toxin effects.",
      "stackable": false
    },
    "teleport": {
      "id": "teleport",
      "name": "Teleport",
      "icon": "✦",
      "type": "utility",
      "duration": 0,
      "potency": 0,
      "desc": "Instantly move to a visible or known location within GM-approved range.",
      "stackable": false
    },
    "full_heal": {
      "id": "full_heal",
      "name": "Full Heal",
      "icon": "💚",
      "type": "recovery",
      "duration": 0,
      "potency": 0,
      "desc": "Restore HP to maximum.",
      "stackable": false
    },
    "remove_all_debuffs": {
      "id": "remove_all_debuffs",
      "name": "Remove All Debuffs",
      "icon": "✦",
      "type": "special",
      "duration": 0,
      "potency": 0,
      "desc": "Remove all negative status effects currently affecting the character.",
      "stackable": false
    },
    "fire_immunity_permanent": {
      "id": "fire_immunity_permanent",
      "name": "Fire Immunity Permanent",
      "icon": "🔥",
      "type": "special",
      "duration": 0,
      "potency": 0,
      "desc": "Permanently immune to fire damage and Burn, unless a story effect overrides it.",
      "stackable": false
    },
    "permanent_hp_5": {
      "id": "permanent_hp_5",
      "name": "Permanent HP 5",
      "icon": "✦",
      "type": "statBuff",
      "duration": 0,
      "potency": 0,
      "desc": "Permanently increase maximum HP by 5 after the item/effect is consumed or awarded.",
      "stackable": false
    },
    "permanent_strength_2": {
      "id": "permanent_strength_2",
      "name": "Permanent Strength 2",
      "icon": "💪",
      "type": "statBuff",
      "duration": 0,
      "potency": 0,
      "desc": "Permanently increase Strength by 2 after the item/effect is consumed or awarded.",
      "stackable": false
    },
    "dragon_breath": {
      "id": "dragon_breath",
      "name": "Dragon Breath",
      "icon": "🐉",
      "type": "special",
      "duration": 0,
      "potency": 0,
      "desc": "Special effect: Dragon Breath. Use the item/skill text first; if no exact number is listed, treat this as a light GM-defined bonus.",
      "stackable": false
    },
    "permanent_all_stats_1": {
      "id": "permanent_all_stats_1",
      "name": "Permanent All Stats 1",
      "icon": "✦",
      "type": "statBuff",
      "duration": 0,
      "potency": 0,
      "desc": "Permanently increase every core stat by 1 after the item/effect is consumed or awarded.",
      "stackable": false
    },
    "regeneration_permanent": {
      "id": "regeneration_permanent",
      "name": "Regeneration Permanent",
      "icon": "💚",
      "type": "recovery",
      "duration": 0,
      "potency": 0,
      "desc": "Special effect: Regeneration Permanent. Use the item/skill text first; if no exact number is listed, treat this as a light GM-defined bonus.",
      "stackable": false
    },
    "unlock_doors": {
      "id": "unlock_doors",
      "name": "Unlock Doors",
      "icon": "✦",
      "type": "special",
      "duration": 0,
      "potency": 0,
      "desc": "Helps open locks. Suggested default: advantage/+2 on lockpicking or bypass mundane locks.",
      "stackable": false
    },
    "climb_assistance": {
      "id": "climb_assistance",
      "name": "Climb Assistance",
      "icon": "✦",
      "type": "utility",
      "duration": 0,
      "potency": 0,
      "desc": "Helps climbing. Suggested default: advantage/+2 on climbing checks and secure rope use.",
      "stackable": false
    },
    "light_source": {
      "id": "light_source",
      "name": "Light Source",
      "icon": "☀️",
      "type": "special",
      "duration": 0,
      "potency": 0,
      "desc": "Creates light. Suggested default: bright light nearby and dim light beyond.",
      "stackable": false
    },
    "fire_damage": {
      "id": "fire_damage",
      "name": "Fire Damage",
      "icon": "🔥",
      "type": "damage",
      "duration": 0,
      "potency": 0,
      "desc": "Adds fire damage. Suggested default: +1 fire damage or +1d6 for magical/rare sources.",
      "stackable": false
    },
    "undead_damage": {
      "id": "undead_damage",
      "name": "Undead Damage",
      "icon": "☀️",
      "type": "damage",
      "duration": 0,
      "potency": 0,
      "desc": "Deals holy/radiant damage to undead. Suggested default: +1d6 damage to undead.",
      "stackable": false
    },
    "purify": {
      "id": "purify",
      "name": "Purify",
      "icon": "✦",
      "type": "special",
      "duration": 0,
      "potency": 0,
      "desc": "Cleanse corruption, disease, poison, cursed water/food, or minor dark magic.",
      "stackable": false
    },
    "parry_bonus": {
      "id": "parry_bonus",
      "name": "Parry Bonus",
      "icon": "✦",
      "type": "special",
      "duration": 0,
      "potency": 0,
      "desc": "Better parries. Suggested default: +2 to defensive reaction/parry checks.",
      "stackable": false
    },
    "crushing": {
      "id": "crushing",
      "name": "Crushing",
      "icon": "💪",
      "type": "special",
      "duration": 0,
      "potency": 0,
      "desc": "Crushing force. Suggested default: bonus vs armour/shields and may knock target prone.",
      "stackable": false
    },
    "critical_bleeding": {
      "id": "critical_bleeding",
      "name": "Critical Bleeding",
      "icon": "🩸",
      "type": "damageOverTime",
      "duration": 0,
      "potency": 0,
      "desc": "Critical hits apply a stronger bleed. Suggested default: 2 damage per turn for 3 turns or until treated.",
      "stackable": false
    },
    "armor_piercing": {
      "id": "armor_piercing",
      "name": "Armor Piercing",
      "icon": "🛡️",
      "type": "special",
      "duration": 0,
      "potency": 0,
      "desc": "Ignores part of enemy armour. Suggested default: reduce target Physical Defence by 2 for this attack.",
      "stackable": false
    },
    "stunning": {
      "id": "stunning",
      "name": "Stunning",
      "icon": "✦",
      "type": "control",
      "duration": 0,
      "potency": 0,
      "desc": "May stun/incapacitate the target briefly on failed save.",
      "stackable": false
    },
    "magic_damage": {
      "id": "magic_damage",
      "name": "Magic Damage",
      "icon": "✨",
      "type": "statBuff",
      "duration": 0,
      "potency": 0,
      "desc": "Special effect: Magic Damage. Use the item/skill text first; if no exact number is listed, treat this as a light GM-defined bonus.",
      "stackable": false
    },
    "critical_immunity": {
      "id": "critical_immunity",
      "name": "Critical Immunity",
      "icon": "✦",
      "type": "special",
      "duration": 0,
      "potency": 0,
      "desc": "Critical hits against you become normal hits.",
      "stackable": false
    },
    "flexible_defense": {
      "id": "flexible_defense",
      "name": "Flexible Defense",
      "icon": "🛡️",
      "type": "protection",
      "duration": 0,
      "potency": 0,
      "desc": "Adapt defence to the incoming threat. Suggested default: choose +2 Physical or +2 Magical Defence each turn.",
      "stackable": false
    },
    "void_damage": {
      "id": "void_damage",
      "name": "Void Damage",
      "icon": "🌑",
      "type": "damage",
      "duration": 0,
      "potency": 0,
      "desc": "Deals void damage that is hard to resist and may harm magical barriers more effectively.",
      "stackable": false
    },
    "life_steal": {
      "id": "life_steal",
      "name": "Life Steal",
      "icon": "💚",
      "type": "special",
      "duration": 0,
      "potency": 0,
      "desc": "Heal for part of the damage you deal. Suggested default: regain HP equal to half the damage dealt.",
      "stackable": false
    },
    "reflect_damage": {
      "id": "reflect_damage",
      "name": "Reflect Damage",
      "icon": "✦",
      "type": "special",
      "duration": 0,
      "potency": 0,
      "desc": "Reflect some incoming damage. Suggested default: attacker takes 1 damage or half minor magical damage back.",
      "stackable": false
    },
    "magic_barrier": {
      "id": "magic_barrier",
      "name": "Magic Barrier",
      "icon": "✨",
      "type": "protection",
      "duration": 0,
      "potency": 0,
      "desc": "Creates a magical shield. Suggested default: +3 Magical Defence or absorb the next magical hit.",
      "stackable": false
    },
    "auto_healing": {
      "id": "auto_healing",
      "name": "Auto Healing",
      "icon": "💚",
      "type": "recovery",
      "duration": 0,
      "potency": 0,
      "desc": "Automatically heals the wearer over time. Suggested default: restore 1–2 HP at the start of each turn.",
      "stackable": false
    },
    "critical_strikes": {
      "id": "critical_strikes",
      "name": "Critical Strikes",
      "icon": "✦",
      "type": "special",
      "duration": 0,
      "potency": 0,
      "desc": "Special effect: Critical Strikes. Use the item/skill text first; if no exact number is listed, treat this as a light GM-defined bonus.",
      "stackable": false
    },
    "energy_waves": {
      "id": "energy_waves",
      "name": "Energy Waves",
      "icon": "✦",
      "type": "special",
      "duration": 0,
      "potency": 0,
      "desc": "Releases ranged energy waves from attacks. Suggested default: short-range projectile or cone after weapon swing.",
      "stackable": false
    },
    "damage_immunity": {
      "id": "damage_immunity",
      "name": "Damage Immunity",
      "icon": "✦",
      "type": "special",
      "duration": 0,
      "potency": 0,
      "desc": "Immune to normal damage for the listed duration/condition. Legendary effect; GM should define limits.",
      "stackable": false
    },
    "titan_strength": {
      "id": "titan_strength",
      "name": "Titan Strength",
      "icon": "💪",
      "type": "statBuff",
      "duration": 0,
      "potency": 0,
      "desc": "Massive strength. Suggested default: advantage/+3 on feats of strength and heavy weapon damage.",
      "stackable": false
    }
  }



  const state = {
    characters: [],
    activeId: null,
    tab: 'character',
    skillCategory: 'weapons',
    skillSubcategory: 'sword',
    skillSearch: '',
    itemSearch: '',
    itemType: 'all',
    itemSource: 'shop',
    itemRarity: 'all',
    itemFeature: 'all',
    itemSort: 'name',
    gmMode: false,
    dice: { count: 1, sides: 20, modifier: 0 }
  }

  const $ = (selector, root = document) => root.querySelector(selector)
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)]
  const clamp = (value, min, max) => Math.min(max, Math.max(min, value))
  const deepClone = value => JSON.parse(JSON.stringify(value))
  const esc = value => String(value ?? '').replace(/[&<>'"]/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char]))
  const safeId = value => String(value || '').replace(/[^a-zA-Z0-9_-]/g, '')

  function toast(message) {
    const el = $('#toast')
    el.textContent = message
    el.classList.add('show')
    clearTimeout(toast.timeout)
    toast.timeout = setTimeout(() => el.classList.remove('show'), 2900)
  }

  function activeCharacter() {
    return state.characters.find(character => character.id === state.activeId) || null
  }

  function raceOptions() {
    const races = window.RACES_DATA || {}
    return Object.values(races).sort((a, b) => a.name.localeCompare(b.name))
  }

  function getRace(raceId) {
    return (window.RACES_DATA || {})[raceId] || null
  }

  function uid(prefix = 'id') {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`
  }

  function createCharacter(name, raceId) {
    const race = getRace(raceId)
    const character = {
      id: uid('char'),
      name: name.trim(),
      created: new Date().toISOString(),
      updated: new Date().toISOString(),
      race: race ? race.id : null,
      elementalAffinity: '',
      lumens: 150,
      currency: { copper: 200, silver: 20, gold: 2 },
      stats: deepClone(DEFAULT_STATS),
      hp: DEFAULT_STATS.hp,
      stamina: DEFAULT_STATS.stamina,
      skills: [],
      activeToggles: [],
      statusEffects: [],
      inventory: [],
      equipped: { weapon: null, armor: null, accessory: null },
      notes: ''
    }
    return character
  }

  function normalizeCharacter(character) {
    const base = createCharacter(character?.name || 'Unnamed Hero', character?.race || null)
    const merged = { ...base, ...character }
    merged.stats = { ...DEFAULT_STATS, ...(character?.stats || {}) }
    merged.currency = { copper: 0, silver: 0, gold: 0, ...(character?.currency || {}) }
    merged.skills = Array.isArray(character?.skills) ? [...new Set(character.skills)] : migrateOldSkills(character?.unlockedSkills)
    merged.activeToggles = Array.isArray(character?.activeToggles) ? character.activeToggles.filter(id => merged.skills.includes(id)) : []
    merged.statusEffects = Array.isArray(character?.statusEffects) ? character.statusEffects.map(normalizeStatusEffect).filter(Boolean) : []
    merged.inventory = Array.isArray(character?.inventory) ? character.inventory.map(normalizeInventoryEntry).filter(Boolean) : []
    merged.equipped = { weapon: null, armor: null, accessory: null, ...(character?.equipped || {}) }
    merged.hp = Number.isFinite(Number(merged.hp)) ? Number(merged.hp) : merged.stats.hp
    merged.stamina = Number.isFinite(Number(merged.stamina)) ? Number(merged.stamina) : merged.stats.stamina
    const computed = computeStats(merged)
    merged.hp = clamp(merged.hp, 0, computed.hp)
    merged.stamina = clamp(merged.stamina, 0, computed.stamina)
    return merged
  }

  function migrateOldSkills(unlockedSkills) {
    const ids = []
    const walk = value => {
      if (Array.isArray(value)) ids.push(...value)
      else if (value && typeof value === 'object') Object.values(value).forEach(walk)
    }
    walk(unlockedSkills)
    return [...new Set(ids)]
  }

  function normalizeInventoryEntry(entry) {
    if (!entry) return null
    if (typeof entry === 'string') return { uid: uid('item'), itemId: entry, qty: 1 }
    const itemId = entry.itemId || entry.id
    if (!itemId) return null
    return {
      uid: entry.uid || uid('item'),
      itemId,
      qty: Math.max(1, Number(entry.qty || entry.quantity || 1))
    }
  }


  function normalizeEffectId(value) {
    return String(value || '')
      .trim()
      .replace(/([a-z])([A-Z])/g, '$1_$2')
      .replace(/[\s-]+/g, '_')
      .replace(/[^a-zA-Z0-9_]/g, '')
      .toLowerCase()
  }

  function getEffect(effectId) {
    const id = normalizeEffectId(effectId)
    return EFFECT_DEFINITIONS[id] || null
  }

  function normalizeStatusEffect(entry) {
    if (!entry) return null
    const effectId = normalizeEffectId(entry.effectId || entry.id || entry.name)
    const effect = getEffect(effectId)
    if (!effect) return null
    const durationValue = entry.duration === '' || entry.duration === undefined || entry.duration === null ? effect.duration : Number(entry.duration)
    const potencyValue = entry.potency === '' || entry.potency === undefined || entry.potency === null ? effect.potency : Number(entry.potency)
    return {
      uid: entry.uid || uid('effect'),
      effectId,
      duration: Number.isFinite(durationValue) ? durationValue : effect.duration,
      potency: Number.isFinite(potencyValue) ? potencyValue : effect.potency,
      elapsed: Number.isFinite(Number(entry.elapsed)) ? Number(entry.elapsed) : 0,
      notes: String(entry.notes || '')
    }
  }

  function save() {
    const cleanCharacters = state.characters.map(character => ({ ...character, updated: new Date().toISOString() }))
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cleanCharacters))
    if (state.activeId) localStorage.setItem(ACTIVE_KEY, state.activeId)
  }

  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      state.characters = raw ? JSON.parse(raw).map(normalizeCharacter) : []
      state.activeId = localStorage.getItem(ACTIVE_KEY)
      if (!state.characters.some(character => character.id === state.activeId)) {
        state.activeId = state.characters[0]?.id || null
      }
    } catch (error) {
      console.error(error)
      state.characters = []
      state.activeId = null
      toast('Save data could not be loaded, so I started clean.')
    }
  }

  function flattenSkills() {
    const data = window.SKILLS_DATA || {}
    const skills = []
    for (const [category, categoryData] of Object.entries(data)) {
      for (const [subcategory, list] of Object.entries(categoryData || {})) {
        if (!Array.isArray(list)) continue
        for (const skill of list) skills.push({ ...skill, category, subcategory })
      }
    }
    const seen = new Set()
    return skills.filter(skill => {
      if (!skill.id || seen.has(skill.id)) return false
      seen.add(skill.id)
      return true
    })
  }

  function getSkill(skillId) {
    return flattenSkills().find(skill => skill.id === skillId) || null
  }

  function skillCategories() {
    return Object.keys(window.SKILLS_DATA || {})
  }

  function displayCategory(category) {
    return {
      weapons: 'Weapons',
      magic: 'Magic',
      professions: 'Professions',
      monster: 'Monster',
      fusion: 'Fusion',
      ultimate: 'Ultimate',
      racial: 'Race'
    }[category] || titleCase(category)
  }

  function titleCase(value) {
    return String(value || '')
      .replace(/_/g, ' ')
      .replace(/\b\w/g, letter => letter.toUpperCase())
  }

  function subcategoriesFor(category, character = activeCharacter()) {
    const categoryData = (window.SKILLS_DATA || {})[category] || {}
    let keys = Object.keys(categoryData)
    if (category === 'racial' && character?.race) keys = keys.filter(key => key === character.race)
    return keys
  }

  function isToggleSkill(skill) {
    return /\bToggle\s*:/i.test(skill?.desc || '') || Object.prototype.hasOwnProperty.call(TOGGLE_BONUSES, skill?.id)
  }

  function prereqLabel(skill) {
    const req = skill?.prerequisites
    if (!req || req.type === 'NONE' || !req.skills?.length) return 'No prerequisite'
    const labels = req.skills.map(id => getSkill(id)?.name || titleCase(id))
    return `${req.type}: ${labels.join(req.type === 'AND' ? ' + ' : ' / ')}`
  }

  function hasPrerequisites(character, skill) {
    const req = skill?.prerequisites
    if (!req || req.type === 'NONE' || !req.skills?.length) return true
    if (req.type === 'AND') return req.skills.every(id => character.skills.includes(id))
    if (req.type === 'OR') return req.skills.some(id => character.skills.includes(id))
    return false
  }

  function incompatibilityReason(character, skill) {
    const conflicts = INCOMPATIBILITIES[skill.id] || []
    const found = conflicts.find(id => character.skills.includes(id))
    if (!found) return ''
    return `Conflicts with ${getSkill(found)?.name || titleCase(found)}`
  }

  function raceAllowed(character, skill) {
    if (!skill) return false
    if (skill.category !== 'racial') return true
    if (!character.race) return false
    return skill.subcategory === character.race
  }

  function canLearnSkill(character, skill) {
    if (!character || !skill) return { ok: false, reason: 'No character selected' }
    if (character.skills.includes(skill.id)) return { ok: false, reason: 'Already learned' }
    if (!raceAllowed(character, skill)) return { ok: false, reason: 'Wrong race' }
    if (!hasPrerequisites(character, skill)) return { ok: false, reason: 'Missing prerequisite' }
    const conflict = incompatibilityReason(character, skill)
    if (conflict) return { ok: false, reason: conflict }
    if (character.lumens < skill.cost) return { ok: false, reason: 'Not enough lumens' }
    return { ok: true, reason: 'Ready' }
  }

  function dependentUnlockedSkills(character, skillId) {
    return character.skills
      .map(id => getSkill(id))
      .filter(Boolean)
      .filter(skill => (skill.prerequisites?.skills || []).includes(skillId))
  }

  function learnSkill(skillId) {
    const character = activeCharacter()
    const skill = getSkill(skillId)
    const check = canLearnSkill(character, skill)
    if (!check.ok) return toast(check.reason)
    character.lumens -= skill.cost
    character.skills.push(skill.id)
    character.updated = new Date().toISOString()
    const computed = computeStats(character)
    character.hp = clamp(character.hp, 0, computed.hp)
    character.stamina = clamp(character.stamina, 0, computed.stamina)
    save()
    render()
    toast(`${skill.name} learned. Glorious little power goblin behaviour.`)
  }

  function refundSkill(skillId) {
    const character = activeCharacter()
    const skill = getSkill(skillId)
    if (!character || !skill || !character.skills.includes(skillId)) return
    const dependents = dependentUnlockedSkills(character, skillId)
    if (dependents.length) return toast(`Refund ${dependents[0].name} first — it depends on this skill.`)
    character.skills = character.skills.filter(id => id !== skillId)
    character.activeToggles = character.activeToggles.filter(id => id !== skillId)
    character.lumens += skill.cost
    save()
    render()
    toast(`${skill.name} refunded.`)
  }

  function toggleSkill(skillId) {
    const character = activeCharacter()
    const skill = getSkill(skillId)
    if (!character || !skill || !character.skills.includes(skillId) || !isToggleSkill(skill)) return
    if (character.activeToggles.includes(skillId)) {
      character.activeToggles = character.activeToggles.filter(id => id !== skillId)
      toast(`${skill.name} switched off.`)
    } else {
      const conflicts = INCOMPATIBILITIES[skillId] || []
      character.activeToggles = character.activeToggles.filter(id => !conflicts.includes(id))
      character.activeToggles.push(skillId)
      toast(`${skill.name} switched on.`)
    }
    const computed = computeStats(character)
    character.hp = clamp(character.hp, 0, computed.hp)
    character.stamina = clamp(character.stamina, 0, computed.stamina)
    save()
    render()
  }

  function processTurn() {
    const character = activeCharacter()
    if (!character) return
    const stillActive = []
    let spent = 0
    const messages = []
    for (const skillId of character.activeToggles) {
      const skill = getSkill(skillId)
      const cost = Math.max(0, Number(skill?.staminaCost || 0))
      if (character.stamina >= cost) {
        character.stamina -= cost
        spent += cost
        stillActive.push(skillId)
      } else {
        messages.push(`${skill?.name || titleCase(skillId)} switched off: not enough Stamina.`)
      }
    }
    character.activeToggles = stillActive
    const effectTick = tickStatusEffects(character)
    const stats = computeStats(character)
    character.hp = clamp(character.hp, 0, stats.hp)
    character.stamina = clamp(character.stamina, 0, stats.stamina)
    save()
    render()
    const effectText = effectTick.summary ? ` ${effectTick.summary}` : ''
    const toggleText = spent ? `${spent} Stamina spent.` : 'No toggle costs.'
    toast(`Processed turn. ${toggleText}${effectText}${messages.length ? ` ${messages[0]}` : ''}`)
  }


  function tickStatusEffects(character) {
    const statuses = Array.isArray(character.statusEffects) ? character.statusEffects : []
    if (!statuses.length) return { summary: '' }
    const kept = []
    let damage = 0
    let healed = 0
    let staminaRestored = 0
    let expired = 0
    for (const status of statuses) {
      const effect = getEffect(status.effectId)
      if (!effect) continue
      status.elapsed = Number(status.elapsed || 0) + 1
      const potency = Number.isFinite(Number(status.potency)) ? Number(status.potency) : Number(effect.potency || 0)
      let tickDamage = Number(effect.tickDamage || 0)
      if (effect.type === 'damageOverTime' && !tickDamage) tickDamage = effect.id === 'poison' ? Math.min(status.elapsed, 3) : Math.max(1, potency || 1)
      if (tickDamage > 0) {
        character.hp = Math.max(0, character.hp - tickDamage)
        damage += tickDamage
      }
      const tickHeal = Number(effect.tickHeal || (effect.type === 'healOverTime' ? (potency || 1) : 0))
      if (tickHeal > 0) {
        const before = character.hp
        character.hp += tickHeal
        healed += Math.max(0, character.hp - before)
      }
      const tickStamina = Number(effect.tickStamina || (effect.id === 'mana_regeneration' || effect.id === 'stamina_regen' ? (potency || 1) : 0))
      if (tickStamina > 0) {
        const before = character.stamina
        character.stamina += tickStamina
        staminaRestored += Math.max(0, character.stamina - before)
      }
      if (Number(status.duration) > 0 && Number(status.duration) < 999) status.duration = Number(status.duration) - 1
      if (Number(status.duration) === 0 && effect.duration !== 0) expired += 1
      else kept.push(status)
    }
    character.statusEffects = kept
    const parts = []
    if (damage) parts.push(`${damage} HP lost`)
    if (healed) parts.push(`${healed} HP restored`)
    if (staminaRestored) parts.push(`${staminaRestored} Stamina restored`)
    if (expired) parts.push(`${expired} effect${expired === 1 ? '' : 's'} expired`)
    return { summary: parts.join(', ') }
  }

  function addStatusEffect(effectId, duration, potency, notes) {
    const character = activeCharacter()
    const effect = getEffect(effectId)
    if (!character || !effect) return toast('Choose a valid effect first.')
    const cleanDuration = duration === '' || duration === null || duration === undefined ? effect.duration : Number(duration)
    const cleanPotency = potency === '' || potency === null || potency === undefined ? effect.potency : Number(potency)
    if (!effect.stackable && character.statusEffects?.some(status => status.effectId === effect.id)) {
      return toast(`${effect.name} is already active and does not stack.`)
    }
    character.statusEffects = Array.isArray(character.statusEffects) ? character.statusEffects : []
    character.statusEffects.push(normalizeStatusEffect({
      uid: uid('effect'),
      effectId: effect.id,
      duration: Number.isFinite(cleanDuration) ? cleanDuration : effect.duration,
      potency: Number.isFinite(cleanPotency) ? cleanPotency : effect.potency,
      notes
    }))
    save()
    render()
    toast(`${effect.name} added.`)
  }

  function removeStatusEffect(effectUid) {
    const character = activeCharacter()
    if (!character) return
    character.statusEffects = (character.statusEffects || []).filter(status => status.uid !== effectUid)
    save()
    render()
    toast('Effect removed.')
  }

  function setRace(raceId) {
    const character = activeCharacter()
    if (!character) return
    const race = getRace(raceId)
    if (!race) return
    character.race = race.id
    const allowedRacial = new Set(((window.SKILLS_DATA?.racial || {})[race.id] || []).map(skill => skill.id))
    const allRacial = new Set(Object.values(window.SKILLS_DATA?.racial || {}).flat().map(skill => skill.id))
    character.skills = character.skills.filter(id => !allRacial.has(id) || allowedRacial.has(id))
    character.activeToggles = character.activeToggles.filter(id => character.skills.includes(id))
    const computed = computeStats(character)
    character.hp = clamp(character.hp, 0, computed.hp)
    character.stamina = clamp(character.stamina, 0, computed.stamina)
    save()
    render()
    toast(`Race set to ${race.name}. Fancy.`)
  }

  function itemSources() {
    const items = []
    const addObjectValues = (source, sourceLabel) => {
      for (const categoryValue of Object.values(source || {})) {
        if (Array.isArray(categoryValue)) {
          categoryValue.forEach(item => item?.id && items.push({ ...item, source: sourceLabel }))
        } else if (categoryValue && typeof categoryValue === 'object') {
          Object.values(categoryValue).forEach(item => item?.id && items.push({ ...item, source: sourceLabel }))
        }
      }
    }
    addObjectValues(window.ITEMS_DATA, 'shop')
    addObjectValues(window.PROFESSION_ITEMS_DATA, 'profession')
    addObjectValues(window.DISCOVERABLE_ITEMS_DATA, 'discoverable')
    for (const item of Object.values(window.MONSTER_LOOT_DATA || {})) {
      if (item?.id) items.push({ ...item, source: 'loot' })
    }
    const seen = new Map()
    for (const item of items) {
      if (!seen.has(item.id)) seen.set(item.id, item)
    }
    return [...seen.values()].sort((a, b) => String(a.name).localeCompare(String(b.name)))
  }

  function getItem(itemId) {
    return itemSources().find(item => item.id === itemId) || null
  }

  function fallbackIcon(item) {
    const icon = String(item?.icon || '')
    if (icon && !/[ÃÂâð�]/.test(icon)) return icon
    const type = String(item?.type || '').toLowerCase()
    if (type.includes('weapon')) return '⚔️'
    if (type.includes('armor')) return '🛡️'
    if (type.includes('accessory')) return '💍'
    if (type.includes('consumable') || type.includes('potion')) return '🧪'
    if (type.includes('material') || type.includes('ingredient')) return '🌿'
    if (type.includes('quest')) return '📜'
    return '✦'
  }

  function itemPriceCopper(item) {
    const price = item?.price || item?.value || {}
    return (Number(price.gold || 0) * CURRENCY_RATE.gold) + (Number(price.silver || 0) * CURRENCY_RATE.silver) + Number(price.copper || 0)
  }

  function currencyToCopper(currency) {
    return (Number(currency.gold || 0) * CURRENCY_RATE.gold) + (Number(currency.silver || 0) * CURRENCY_RATE.silver) + Number(currency.copper || 0)
  }

  function copperToCurrency(total) {
    total = Math.max(0, Math.floor(total))
    const gold = Math.floor(total / CURRENCY_RATE.gold)
    total -= gold * CURRENCY_RATE.gold
    const silver = Math.floor(total / CURRENCY_RATE.silver)
    total -= silver * CURRENCY_RATE.silver
    return { gold, silver, copper: total }
  }

  function formatCurrency(currencyOrCopper) {
    const currency = typeof currencyOrCopper === 'number' ? copperToCurrency(currencyOrCopper) : currencyOrCopper
    return `${currency.gold || 0}g ${currency.silver || 0}s ${currency.copper || 0}c`
  }

  function sentenceList(values) {
    return (values || [])
      .filter(Boolean)
      .map(value => titleCase(String(value)))
      .join(', ')
  }

  function formatStatModifiers(modifiers = {}) {
    const entries = Object.entries(modifiers || {})
    if (!entries.length) return 'None'
    return entries.map(([stat, value]) => `${titleCase(stat)} ${Number(value) >= 0 ? '+' : ''}${value}`).join(', ')
  }

  function formatCraftingRecipe(recipe) {
    if (!recipe) return ''
    const materials = (recipe.materials || []).map(material => {
      if (Array.isArray(material)) return `${material[1] || 1}× ${titleCase(material[0])}`
      if (typeof material === 'object') return `${material.qty || material.quantity || 1}× ${titleCase(material.item || material.id || material.name || 'material')}`
      return titleCase(material)
    }).join(', ')
    const skill = recipe.skillRequired ? ` · Skill required: ${recipe.skillRequired}` : ''
    const quantity = recipe.quantity ? ` · Makes: ${recipe.quantity}` : ''
    return [materials ? `Recipe: ${materials}` : 'Recipe available', skill, quantity].join('')
  }

  function formatElementalAffinities(affinities) {
    if (!affinities) return ''
    const lines = []
    for (const [group, values] of Object.entries(affinities)) {
      if (!values || typeof values !== 'object') continue
      const parts = Object.entries(values).map(([element, value]) => `${titleCase(element)} ${Number(value) >= 0 ? '+' : ''}${value}`)
      if (parts.length) lines.push(`${titleCase(group)}: ${parts.join(', ')}`)
    }
    return lines.join('\n')
  }

  function itemTooltip(item) {
    if (!item) return ''
    const lines = [
      item.name,
      `${titleCase(item.rarity || 'common')} ${titleCase(item.type || 'item')} · ${titleCase(item.source || 'shop')}`
    ]
    if (item.desc) lines.push('', item.desc)
    if (item.damage) lines.push(`Damage: ${item.damage}`)
    lines.push(`Stats: ${formatStatModifiers(item.statModifiers)}`)
    if (item.specialEffects?.length) {
      lines.push('', `Special: ${sentenceList(item.specialEffects)}`)
      lines.push(...effectDetailLines(item.specialEffects))
    }
    if (Number(item.enchantmentSlots || 0)) lines.push(`Enchantment Slots: ${item.enchantmentSlots}`)
    if (item.price || item.value) lines.push(`Price/Value: ${formatCurrency(itemPriceCopper(item))}`)
    const elements = formatElementalAffinities(item.elementalAffinities)
    if (elements) lines.push(elements)
    const recipe = formatCraftingRecipe(item.craftingRecipe)
    if (recipe) lines.push(recipe)
    return lines.filter(line => line !== undefined && line !== null).join('\n')
  }


  function skillTooltip(skill) {
    if (!skill) return ''
    const lines = [
      skill.name,
      `${displayCategory(skill.category)} / ${titleCase(skill.subcategory)} · Tier ${skill.tier || 1}`,
      `Cost: ${skill.cost || 0} Lumens · Stamina: ${Number(skill.staminaCost || 0)}`
    ]
    if (skill.desc) lines.push('', skill.desc)
    const skillEffects = extractEffectIdsFromText(`${skill.name} ${skill.desc || ''}`)
    if (skillEffects.length) {
      lines.push('', 'Detected Effects:')
      lines.push(...effectDetailLines(skillEffects))
    }
    lines.push(`Prerequisite: ${prereqLabel(skill)}`)
    const conflicts = INCOMPATIBILITIES[skill.id] || []
    if (conflicts.length) lines.push(`Conflicts: ${conflicts.map(id => getSkill(id)?.name || titleCase(id)).join(', ')}`)
    if (isToggleSkill(skill)) lines.push('Type: Toggle / active skill')
    if (skill.elementalType) lines.push(`Element: ${titleCase(skill.elementalType)}`)
    if (skill.lootType) lines.push(`Loot Type: ${titleCase(skill.lootType)}`)
    if (skill.fusionType) lines.push(`Fusion Type: ${titleCase(skill.fusionType)}`)
    return lines.join('\n')
  }


  function effectList() {
    return Object.values(EFFECT_DEFINITIONS).sort((a, b) => String(a.type).localeCompare(String(b.type)) || String(a.name).localeCompare(String(b.name)))
  }

  function effectDurationLabel(duration) {
    const value = Number(duration)
    if (!Number.isFinite(value) || value === 0) return 'Instant / GM-defined'
    if (value >= 999) return 'Permanent'
    return `${value} turn${value === 1 ? '' : 's'}`
  }

  function effectTypeLabel(type) {
    return titleCase(type || 'special')
  }

  function effectTone(effect) {
    const type = String(effect?.type || '').toLowerCase()
    if (['damageovertime', 'control', 'statdebuff'].includes(type)) return 'bad'
    if (['recovery', 'healoverTime'.toLowerCase(), 'statbuff', 'protection', 'enhancement', 'movement', 'utility'].includes(type)) return 'good'
    if (type === 'aura') return 'warn'
    return 'warn'
  }

  function effectDetailLines(effectIds) {
    return [...new Set(effectIds || [])].map(effectId => {
      const effect = getEffect(effectId)
      if (!effect) return `• ${titleCase(effectId)}: No rules text found yet.`
      const duration = effect.duration ? ` Duration: ${effectDurationLabel(effect.duration)}.` : ''
      const potency = effect.potency && effect.potency !== 0 ? ` Potency: ${effect.potency}.` : ''
      const modifiers = effect.statModifiers ? ` Modifiers: ${formatStatModifiers(effect.statModifiers)}.` : ''
      return `• ${effect.icon || '✦'} ${effect.name}: ${effect.desc}${duration}${potency}${modifiers}`
    })
  }

  function effectTooltip(effectId, source = '', status = null) {
    const effect = getEffect(effectId)
    if (!effect) return `${titleCase(effectId)}\nNo rules text found yet.`
    const lines = [
      `${effect.icon || '✦'} ${effect.name}`,
      `${effectTypeLabel(effect.type)} · ${effectDurationLabel(status?.duration ?? effect.duration)}`,
      '',
      effect.desc
    ]
    if (effect.statModifiers) lines.push(`Stats: ${formatStatModifiers(effect.statModifiers)}`)
    if (effect.immunities?.length) lines.push(`Immunities: ${effect.immunities.map(titleCase).join(', ')}`)
    if (effect.tickHeal || effect.tickDamage || effect.tickStamina || effect.type === 'damageOverTime') {
      lines.push('Turn processing: this effect can be ticked by Process Turn.')
    }
    if (status) {
      lines.push(`Remaining: ${effectDurationLabel(status.duration)}`)
      if (status.potency !== undefined && status.potency !== null && status.potency !== 0) lines.push(`Current potency: ${status.potency}`)
      if (status.notes) lines.push(`Notes: ${status.notes}`)
    }
    if (source) lines.push(`Source: ${source}`)
    return lines.join('\n')
  }

  function extractEffectIdsFromText(text) {
    const lower = String(text || '').toLowerCase().replace(/[_-]/g, ' ')
    if (!lower) return []
    const found = []
    const add = id => { if (getEffect(id) && !found.includes(id)) found.push(id) }
    if (/immune[^.]*poison|poison[^.]*immun/i.test(text)) add('poison_immunity')
    if (/poison[^.]*resist|resist[^.]*poison/i.test(text)) add('poison_resistance')
    if (/immune[^.]*fire|fire[^.]*immun/i.test(text)) add('fire_immunity')
    if (/regenerate\s+\d*\s*hp|hp\s*\/\s*turn|hp per turn/i.test(text)) add('hp_regen')
    if (/regenerate\s+(mana|stamina)|mana regeneration|stamina per turn/i.test(text)) add('stamina_regen')
    for (const effect of effectList()) {
      const labels = [effect.id.replace(/_/g, ' '), String(effect.name || '').toLowerCase()].filter(label => label && label.length >= 4)
      if (labels.some(label => lower.includes(label))) add(effect.id)
    }
    return found
  }

  function recordEffect(map, effectId, source) {
    const effect = getEffect(effectId)
    if (!effect) return
    if (!map.has(effect.id)) map.set(effect.id, { effect, sources: [] })
    const item = map.get(effect.id)
    if (source && !item.sources.includes(source)) item.sources.push(source)
  }

  function characterEffectSources(character) {
    const map = new Map()
    if (!character) return []
    const race = getRace(character.race)
    for (const trait of race?.passiveTraits || []) {
      for (const id of extractEffectIdsFromText(trait)) recordEffect(map, id, `Race: ${race.name}`)
    }
    for (const entryUid of Object.values(character.equipped || {})) {
      const entry = character.inventory.find(inv => inv.uid === entryUid)
      const item = entry && getItem(entry.itemId)
      for (const effectId of item?.specialEffects || []) recordEffect(map, effectId, `Equipped: ${item.name}`)
    }
    for (const skillId of character.skills || []) {
      const skill = getSkill(skillId)
      if (!skill) continue
      for (const effectId of extractEffectIdsFromText(`${skill.name} ${skill.desc || ''}`)) {
        recordEffect(map, effectId, `Skill: ${skill.name}`)
      }
    }
    return [...map.values()].sort((a, b) => effectTone(a.effect).localeCompare(effectTone(b.effect)) || a.effect.name.localeCompare(b.effect.name))
  }

  function renderEffectPill(effectId, source = '', status = null) {
    const effect = getEffect(effectId)
    if (!effect) return ''
    return `<span class="pill ${effectTone(effect)}" data-tooltip="${esc(effectTooltip(effectId, source, status))}" tabindex="0">${esc(effect.icon || '✦')} ${esc(effect.name)}</span>`
  }


  function itemSearchText(item) {
    return [
      item.name,
      item.id,
      item.desc,
      item.type,
      item.rarity,
      item.source,
      item.damage,
      Object.keys(item.statModifiers || {}).join(' '),
      formatStatModifiers(item.statModifiers),
      (item.specialEffects || []).join(' '),
      effectDetailLines(item.specialEffects || []).join(' '),
      formatElementalAffinities(item.elementalAffinities),
      formatCraftingRecipe(item.craftingRecipe)
    ].filter(Boolean).join(' ').toLowerCase()
  }

  function rarityRank(rarity) {
    return { common: 1, uncommon: 2, rare: 3, epic: 4, legendary: 5 }[String(rarity || '').toLowerCase()] || 0
  }

  function damageAverage(item) {
    const match = String(item?.damage || '').match(/(\d+)d(\d+)(?:\s*([+-])\s*(\d+))?/i)
    if (!match) return 0
    const count = Number(match[1] || 0)
    const sides = Number(match[2] || 0)
    const mod = match[3] ? Number(`${match[3]}${match[4]}`) : 0
    return count * ((sides + 1) / 2) + mod
  }

  function itemMatchesFeature(item, feature, character = activeCharacter()) {
    const type = String(item.type || '').toLowerCase()
    const stats = item.statModifiers || {}
    const effects = item.specialEffects || []
    const price = itemPriceCopper(item)
    if (feature === 'all') return true
    if (feature === 'equippable') return ['weapon', 'armor', 'accessory'].some(value => type.includes(value))
    if (feature === 'weapon') return type.includes('weapon')
    if (feature === 'armor') return type.includes('armor')
    if (feature === 'accessory') return type.includes('accessory')
    if (feature === 'damage') return Boolean(item.damage)
    if (feature === 'consumable') return ['consumable', 'food', 'potion', 'herb'].some(value => type.includes(value))
    if (feature === 'crafting') return ['material', 'ingredient', 'essence', 'organ', 'organic', 'crystal'].some(value => type.includes(value)) || Boolean(item.craftingRecipe)
    if (feature === 'quest') return ['quest', 'key', 'artifact', 'relic'].some(value => type.includes(value))
    if (feature === 'strength') return Number(stats.strength || 0) > 0
    if (feature === 'magicPower') return Number(stats.magicPower || 0) > 0
    if (feature === 'accuracy') return Number(stats.accuracy || 0) > 0
    if (feature === 'speed') return Number(stats.speed || 0) > 0
    if (feature === 'defence') return Number(stats.physicalDefence || 0) > 0 || Number(stats.magicalDefence || 0) > 0
    if (feature === 'special') return effects.length > 0
    if (feature === 'enchantable') return Number(item.enchantmentSlots || 0) > 0
    if (feature === 'free') return price === 0
    if (feature === 'affordable') return character ? price <= currencyToCopper(character.currency) : true
    return true
  }

  function sortItems(items, sortKey) {
    const sorted = [...items]
    const byName = (a, b) => String(a.name).localeCompare(String(b.name))
    sorted.sort((a, b) => {
      if (sortKey === 'priceAsc') return itemPriceCopper(a) - itemPriceCopper(b) || byName(a, b)
      if (sortKey === 'priceDesc') return itemPriceCopper(b) - itemPriceCopper(a) || byName(a, b)
      if (sortKey === 'rarityDesc') return rarityRank(b.rarity) - rarityRank(a.rarity) || byName(a, b)
      if (sortKey === 'damageDesc') return damageAverage(b) - damageAverage(a) || byName(a, b)
      if (sortKey === 'strengthDesc') return Number(b.statModifiers?.strength || 0) - Number(a.statModifiers?.strength || 0) || byName(a, b)
      if (sortKey === 'magicDesc') return Number(b.statModifiers?.magicPower || 0) - Number(a.statModifiers?.magicPower || 0) || byName(a, b)
      if (sortKey === 'defenceDesc') return (Number(b.statModifiers?.physicalDefence || 0) + Number(b.statModifiers?.magicalDefence || 0)) - (Number(a.statModifiers?.physicalDefence || 0) + Number(a.statModifiers?.magicalDefence || 0)) || byName(a, b)
      if (sortKey === 'sourceType') return String(a.source).localeCompare(String(b.source)) || String(a.type).localeCompare(String(b.type)) || byName(a, b)
      return byName(a, b)
    })
    return sorted
  }

  function buyItem(itemId, free = false) {
    const character = activeCharacter()
    const item = getItem(itemId)
    if (!character || !item) return
    const price = itemPriceCopper(item)
    const current = currencyToCopper(character.currency)
    if (!free && price > current) return toast('Not enough coin. Tragic little wallet noises.')
    if (!free) character.currency = copperToCurrency(current - price)
    addItemToInventory(character, itemId, 1)
    save()
    render()
    toast(`${item.name} ${free ? 'granted' : 'bought'}!`)
  }

  function addItemToInventory(character, itemId, qty = 1) {
    const item = getItem(itemId)
    if (!item) return
    const stackable = item.stackable || ['material', 'ingredient', 'consumable'].includes(String(item.type).toLowerCase())
    if (stackable) {
      const existing = character.inventory.find(entry => entry.itemId === itemId && !Object.values(character.equipped).includes(entry.uid))
      if (existing) {
        existing.qty += qty
        return
      }
    }
    character.inventory.push({ uid: uid('inv'), itemId, qty })
  }

  function removeInventoryEntry(entryUid) {
    const character = activeCharacter()
    if (!character) return
    for (const slot of Object.keys(character.equipped)) {
      if (character.equipped[slot] === entryUid) character.equipped[slot] = null
    }
    character.inventory = character.inventory.filter(entry => entry.uid !== entryUid)
    save()
    render()
  }

  function equipItem(entryUid) {
    const character = activeCharacter()
    const entry = character?.inventory.find(i => i.uid === entryUid)
    const item = entry && getItem(entry.itemId)
    if (!character || !entry || !item) return
    const type = String(item.type || '').toLowerCase()
    const slot = type.includes('weapon') ? 'weapon' : type.includes('armor') ? 'armor' : type.includes('accessory') ? 'accessory' : null
    if (!slot) return toast('That item is not equipment.')
    character.equipped[slot] = entry.uid
    const computed = computeStats(character)
    character.hp = clamp(character.hp, 0, computed.hp)
    character.stamina = clamp(character.stamina, 0, computed.stamina)
    save()
    render()
    toast(`${item.name} equipped.`)
  }

  function unequip(slot) {
    const character = activeCharacter()
    if (!character) return
    character.equipped[slot] = null
    save()
    render()
  }

  function computeStats(character) {
    const stats = { ...DEFAULT_STATS, ...(character?.stats || {}) }
    const race = getRace(character?.race)
    for (const [stat, value] of Object.entries(race?.statModifiers || {})) {
      stats[stat] = (stats[stat] || 0) + Number(value || 0)
    }
    for (const entryUid of Object.values(character?.equipped || {})) {
      const entry = character?.inventory?.find(inv => inv.uid === entryUid)
      const item = entry && getItem(entry.itemId)
      for (const [stat, value] of Object.entries(item?.statModifiers || {})) {
        stats[stat] = (stats[stat] || 0) + Number(value || 0)
      }
    }
    for (const skillId of character?.skills || []) {
      const bonus = PASSIVE_SKILL_BONUSES[skillId]
      if (!bonus) continue
      for (const [stat, value] of Object.entries(bonus)) stats[stat] = (stats[stat] || 0) + Number(value || 0)
    }
    for (const skillId of character?.activeToggles || []) {
      const bonus = TOGGLE_BONUSES[skillId]
      if (!bonus) continue
      for (const [stat, value] of Object.entries(bonus)) stats[stat] = (stats[stat] || 0) + Number(value || 0)
    }
    for (const status of character?.statusEffects || []) {
      const effect = getEffect(status.effectId)
      for (const [stat, value] of Object.entries(effect?.statModifiers || {})) stats[stat] = (stats[stat] || 0) + Number(value || 0)
    }
    stats.hp = Math.max(1, Math.floor(stats.hp))
    stats.stamina = Math.max(1, Math.floor(stats.stamina))
    return stats
  }

  function skillProgress(character) {
    const all = flattenSkills().filter(skill => raceAllowed(character, skill))
    const learned = character?.skills?.length || 0
    return { learned, total: all.length, pct: all.length ? Math.round((learned / all.length) * 100) : 0 }
  }

  function statBreakdown(character, stat) {
    const rows = [{ label: 'Base', value: character.stats[stat] || 0 }]
    const race = getRace(character.race)
    if (race?.statModifiers?.[stat]) rows.push({ label: race.name, value: race.statModifiers[stat] })
    for (const entryUid of Object.values(character.equipped || {})) {
      const entry = character.inventory.find(inv => inv.uid === entryUid)
      const item = entry && getItem(entry.itemId)
      if (item?.statModifiers?.[stat]) rows.push({ label: item.name, value: item.statModifiers[stat] })
    }
    for (const skillId of character.skills || []) {
      if (PASSIVE_SKILL_BONUSES[skillId]?.[stat]) rows.push({ label: getSkill(skillId)?.name || titleCase(skillId), value: PASSIVE_SKILL_BONUSES[skillId][stat] })
    }
    for (const skillId of character.activeToggles || []) {
      if (TOGGLE_BONUSES[skillId]?.[stat]) rows.push({ label: `${getSkill(skillId)?.name || titleCase(skillId)} active`, value: TOGGLE_BONUSES[skillId][stat] })
    }
    for (const status of character.statusEffects || []) {
      const effect = getEffect(status.effectId)
      if (effect?.statModifiers?.[stat]) rows.push({ label: `${effect.name} effect`, value: effect.statModifiers[stat] })
    }
    return rows
  }

  function upgradeStat(stat) {
    const character = activeCharacter()
    const rule = STAT_RULES[stat]
    if (!character || !rule) return
    if (character.stats[stat] >= rule.max) return toast(`${rule.label} is already at its cap.`)
    if (character.lumens < rule.cost) return toast('Not enough lumens for that upgrade.')
    character.stats[stat] += 1
    character.lumens -= rule.cost
    if (stat === 'hp') character.hp += 1
    if (stat === 'stamina') character.stamina += 1
    save()
    render()
  }

  function refundStat(stat) {
    const character = activeCharacter()
    const rule = STAT_RULES[stat]
    if (!character || !rule) return
    if (character.stats[stat] <= DEFAULT_STATS[stat]) return toast(`${rule.label} is already at its starting value.`)
    character.stats[stat] -= 1
    character.lumens += rule.cost
    const computed = computeStats(character)
    character.hp = clamp(character.hp, 0, computed.hp)
    character.stamina = clamp(character.stamina, 0, computed.stamina)
    save()
    render()
  }

  function heal(amount = 9999) {
    const character = activeCharacter()
    if (!character) return
    const stats = computeStats(character)
    character.hp = clamp(character.hp + amount, 0, stats.hp)
    save()
    render()
  }

  function restoreStamina(amount = 9999) {
    const character = activeCharacter()
    if (!character) return
    const stats = computeStats(character)
    character.stamina = clamp(character.stamina + amount, 0, stats.stamina)
    save()
    render()
  }

  function setResource(resource, value) {
    const character = activeCharacter()
    if (!character) return
    const stats = computeStats(character)
    const cleanValue = Math.floor(Number(value || 0))
    if (resource === 'hp') character.hp = clamp(cleanValue, 0, stats.hp)
    if (resource === 'stamina') character.stamina = clamp(cleanValue, 0, stats.stamina)
    if (resource === 'lumens') character.lumens = Math.max(0, cleanValue)
    save()
    render()
  }

  function adjustResource(resource, amount) {
    const character = activeCharacter()
    if (!character) return
    const current = resource === 'hp' ? character.hp : resource === 'stamina' ? character.stamina : character.lumens
    setResource(resource, current + Number(amount || 0))
  }

  function fillResource(resource) {
    const character = activeCharacter()
    if (!character) return
    const stats = computeStats(character)
    if (resource === 'hp') setResource('hp', stats.hp)
    if (resource === 'stamina') setResource('stamina', stats.stamina)
  }

  function adjustLumens(amount) {
    adjustResource('lumens', amount)
  }

  function adjustCurrency(copper) {
    const character = activeCharacter()
    if (!character) return
    character.currency = copperToCurrency(currencyToCopper(character.currency) + copper)
    save()
    render()
  }

  function setCurrencyPart(part, value) {
    const character = activeCharacter()
    if (!character || !['gold', 'silver', 'copper'].includes(part)) return
    character.currency[part] = Math.max(0, Math.floor(Number(value || 0)))
    character.currency = copperToCurrency(currencyToCopper(character.currency))
    save()
    render()
  }

  function rollDice(count, sides, modifier = 0) {
    const rolls = Array.from({ length: count }, () => 1 + Math.floor(Math.random() * sides))
    return { rolls, total: rolls.reduce((sum, value) => sum + value, 0) + modifier }
  }

  function duplicateCharacter(id) {
    const original = state.characters.find(character => character.id === id)
    if (!original) return
    const copy = normalizeCharacter(deepClone(original))
    copy.id = uid('char')
    copy.name = `${copy.name} Copy`
    copy.created = new Date().toISOString()
    state.characters.push(copy)
    state.activeId = copy.id
    save()
    render()
    toast('Character duplicated.')
  }

  function deleteCharacter(id) {
    const character = state.characters.find(c => c.id === id)
    if (!character) return
    if (!confirm(`Delete ${character.name}? This cannot be undone.`)) return
    state.characters = state.characters.filter(c => c.id !== id)
    if (state.activeId === id) state.activeId = state.characters[0]?.id || null
    save()
    render()
    toast('Character deleted.')
  }

  function exportData(all = true) {
    const payload = all ? { version: 1, characters: state.characters } : { version: 1, characters: [activeCharacter()] }
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = all ? 'lumenforge-save.json' : `${activeCharacter()?.name || 'character'}-lumenforge.json`.replace(/[^a-z0-9_.-]+/gi, '_')
    a.click()
    URL.revokeObjectURL(a.href)
  }

  async function importData(file) {
    if (!file) return
    try {
      const raw = await file.text()
      const parsed = JSON.parse(raw)
      const imported = Array.isArray(parsed) ? parsed : parsed.characters
      if (!Array.isArray(imported)) throw new Error('No characters array')
      const normalized = imported.map(normalizeCharacter)
      const byId = new Map(state.characters.map(character => [character.id, character]))
      normalized.forEach(character => byId.set(character.id, character))
      state.characters = [...byId.values()]
      state.activeId = normalized[0]?.id || state.activeId
      save()
      render()
      toast(`Imported ${normalized.length} character${normalized.length === 1 ? '' : 's'}.`)
    } catch (error) {
      console.error(error)
      toast('Import failed. That file does not look like a LumenForge save.')
    }
  }

  function render() {
    renderRaceSelects()
    renderCharacterList()
    renderHeader()
    renderContent()
    bindDynamicActions()
  }

  function renderRaceSelects() {
    const options = raceOptions().map(race => `<option value="${esc(race.id)}">${esc(race.icon || '✦')} ${esc(race.name)}</option>`).join('')
    const newRace = $('#new-race')
    if (newRace && !newRace.dataset.ready) {
      newRace.innerHTML = options
      const human = raceOptions().find(race => race.id === 'human')
      if (human) newRace.value = human.id
      newRace.dataset.ready = 'true'
    }
  }

  function renderCharacterList() {
    const list = $('#character-list')
    if (!list) return
    if (!state.characters.length) {
      list.innerHTML = '<div class="empty">No characters yet. Make a chaos gremlin above.</div>'
      return
    }
    list.innerHTML = state.characters.map(character => {
      const race = getRace(character.race)
      const progress = skillProgress(character)
      return `
        <button class="character-card ${character.id === state.activeId ? 'active' : ''}" data-select-character="${esc(character.id)}">
          <strong>${esc(race?.icon || '👤')} ${esc(character.name)}</strong>
          <span>${esc(race?.name || 'No race')} · ${progress.learned} skills · ${character.lumens}L</span>
        </button>
      `
    }).join('')
  }

  function renderHeader() {
    const character = activeCharacter()
    const name = $('#current-name')
    const subtitle = $('#current-subtitle')
    const avatar = $('#current-avatar')
    const lumens = $('#lumens-pill')
    const hp = $('#hp-pill')
    const stamina = $('#stamina-pill')
    const coin = $('#coin-pill')
    if (!character) {
      name.textContent = 'No character selected'
      subtitle.textContent = 'Create or select a character to begin.'
      avatar.textContent = '?'
      lumens.textContent = '0'
      hp.textContent = '0/0'
      stamina.textContent = '0/0'
      coin.textContent = '0g 0s 0c'
      return
    }
    const stats = computeStats(character)
    const race = getRace(character.race)
    name.textContent = character.name
    subtitle.textContent = `${race?.name || 'Unknown race'} · ${character.skills.length} learned skills · ${character.inventory.length} inventory lines`
    avatar.textContent = race?.icon || '👤'
    lumens.textContent = character.lumens
    hp.textContent = `${character.hp}/${stats.hp}`
    stamina.textContent = `${character.stamina}/${stats.stamina}`
    coin.textContent = formatCurrency(character.currency)
  }

  function renderContent() {
    const content = $('#app-content')
    const character = activeCharacter()
    if (!character && state.tab !== 'gm') {
      content.innerHTML = `
        <div class="notice-card">
          <h2>Welcome to LumenForge ✨</h2>
          <p>This rebuild keeps the core idea: characters, races, lumens, skills, equipment and GM-friendly tools — but trims the clutter so it is actually usable at the table.</p>
        </div>
      `
      return
    }
    if (state.tab === 'character') content.innerHTML = renderCharacterTab(character)
    if (state.tab === 'skills') content.innerHTML = renderSkillsTab(character)
    if (state.tab === 'stats') content.innerHTML = renderStatsTab(character)
    if (state.tab === 'inventory') content.innerHTML = renderInventoryTab(character)
    if (state.tab === 'gm') content.innerHTML = renderGmTab(character)
    if (state.tab === 'notes') content.innerHTML = renderNotesTab(character)
  }


  function effectOptionsMarkup() {
    const groups = new Map()
    for (const effect of effectList()) {
      const group = effectTypeLabel(effect.type)
      if (!groups.has(group)) groups.set(group, [])
      groups.get(group).push(effect)
    }
    return [...groups.entries()].map(([group, effects]) => `
      <optgroup label="${esc(group)}">
        ${effects.map(effect => `<option value="${esc(effect.id)}">${esc(effect.icon || '✦')} ${esc(effect.name)}</option>`).join('')}
      </optgroup>
    `).join('')
  }

  function renderEffectsSnapshot(character) {
    const active = character.statusEffects || []
    const sourced = characterEffectSources(character)
    const activePills = active.slice(0, 8).map(status => renderEffectPill(status.effectId, 'Applied status', status)).join('')
    const sourcePills = sourced.slice(0, 8).map(entry => renderEffectPill(entry.effect.id, entry.sources.join(', '))).join('')
    const extraCount = Math.max(0, active.length + sourced.length - 16)
    return `
      <div class="effects-snapshot">
        <div class="effect-mini-title">Effects & specials</div>
        <div class="wrap">
          ${activePills || ''}
          ${sourcePills || ''}
          ${extraCount ? `<span class="pill">+${extraCount} more below</span>` : ''}
          ${!active.length && !sourced.length ? '<span class="pill">No detected effects yet</span>' : ''}
        </div>
      </div>
    `
  }

  function renderEffectsManager(character) {
    const sourced = characterEffectSources(character)
    const active = character.statusEffects || []
    const sourceCards = sourced.map(entry => `
      <article class="effect-card ${effectTone(entry.effect)}" data-tooltip="${esc(effectTooltip(entry.effect.id, entry.sources.join(', ')))}" tabindex="0">
        <div class="effect-card-title"><strong>${esc(entry.effect.icon || '✦')} ${esc(entry.effect.name)}</strong><span class="pill">${esc(effectTypeLabel(entry.effect.type))}</span></div>
        <p>${esc(entry.effect.desc)}</p>
        <div class="subtle">From: ${esc(entry.sources.slice(0, 4).join(', '))}${entry.sources.length > 4 ? ` and ${entry.sources.length - 4} more` : ''}</div>
      </article>
    `).join('')
    const activeCards = active.map(status => {
      const effect = getEffect(status.effectId)
      if (!effect) return ''
      return `
        <article class="effect-card ${effectTone(effect)}" data-tooltip="${esc(effectTooltip(effect.id, 'Applied status', status))}" tabindex="0">
          <div class="effect-card-title"><strong>${esc(effect.icon || '✦')} ${esc(effect.name)}</strong><button class="danger-btn tiny" data-remove-effect="${esc(status.uid)}">Remove</button></div>
          <p>${esc(effect.desc)}</p>
          <div class="wrap">
            <span class="pill">Remaining: ${esc(effectDurationLabel(status.duration))}</span>
            ${status.potency !== undefined && status.potency !== null && status.potency !== 0 ? `<span class="pill warn">Potency ${esc(status.potency)}</span>` : ''}
            ${effect.statModifiers ? `<span class="pill ${effectTone(effect)}">${esc(formatStatModifiers(effect.statModifiers))}</span>` : ''}
          </div>
          ${status.notes ? `<div class="subtle">${esc(status.notes)}</div>` : ''}
        </article>
      `
    }).join('')
    return `
      <section class="card effects-manager" style="margin-top: 16px;">
        <div class="card-header">
          <div>
            <div class="kicker">Rules Brain</div>
            <h3>Effects & Status Manager</h3>
            <p>Hover any effect to see what it does. Gear and learned skills are detected automatically; applied statuses are things currently affecting the character.</p>
          </div>
          <button class="ghost-btn tiny" data-process-turn>Process Turn</button>
        </div>

        <div class="grid two">
          <div>
            <h3>Applied Status Effects</h3>
            <div class="effect-grid">${activeCards || '<div class="empty">No active status effects. Suspiciously healthy.</div>'}</div>
          </div>
          <div>
            <h3>Skill & Gear Effects</h3>
            <div class="effect-grid">${sourceCards || '<div class="empty">No skill/gear special effects detected yet.</div>'}</div>
          </div>
        </div>

        <div class="effect-add-box">
          <h3>Add Effect</h3>
          <p>Use this for Poison, Burn, HP Regen, buffs, debuffs, auras, item specials, or GM-made nonsense. Leave duration/potency blank to use the default.</p>
          <div class="effect-add-grid">
            <label><span class="field-label">Effect</span><select class="input" id="effect-select">${effectOptionsMarkup()}</select></label>
            <label><span class="field-label">Duration</span><input class="input" id="effect-duration" type="number" min="0" placeholder="Default" /></label>
            <label><span class="field-label">Potency</span><input class="input" id="effect-potency" type="number" placeholder="Default" /></label>
            <label><span class="field-label">Notes</span><input class="input" id="effect-notes" placeholder="Optional source/variant" /></label>
          </div>
          <button class="primary-btn full" data-add-effect>Add Effect</button>
        </div>
      </section>
    `
  }

  function renderCharacterTab(character) {
    const race = getRace(character.race)
    const stats = computeStats(character)
    const progress = skillProgress(character)
    const unlocked = character.skills.map(getSkill).filter(Boolean)
    const equippedRows = ['weapon', 'armor', 'accessory'].map(slot => {
      const entry = character.inventory.find(inv => inv.uid === character.equipped[slot])
      const item = entry && getItem(entry.itemId)
      return `<div class="equip-row" ${item ? `data-tooltip="${esc(itemTooltip(item))}" tabindex="0"` : ''}><div><strong>${titleCase(slot)}</strong><div class="subtle">${item ? `${fallbackIcon(item)} ${esc(item.name)} · ${formatStatModifiers(item.statModifiers)}` : 'Nothing equipped'}</div></div>${item ? `<button class="ghost-btn tiny" data-unequip="${slot}">Unequip</button>` : ''}</div>`
    }).join('')
    const passives = (race?.passiveTraits || []).map(trait => `<span class="pill good">${esc(trait)}</span>`).join('') || '<span class="pill">No race passives</span>'
    return `
      <div class="grid two">
        <section class="card">
          <div class="card-header">
            <div>
              <div class="kicker">Character Sheet</div>
              <h3>${esc(race?.icon || '👤')} ${esc(character.name)}</h3>
              <p>${esc(race?.description || 'Choose a race to unlock passives and racial skills.')}</p>
            </div>
            <button class="ghost-btn tiny" data-export-character>Export</button>
          </div>
          <label class="field-label">Rename</label>
          <input class="input" id="rename-character" value="${esc(character.name)}" />
          <label class="field-label">Race</label>
          <select class="input" id="change-race">
            ${raceOptions().map(option => `<option value="${esc(option.id)}" ${option.id === character.race ? 'selected' : ''}>${esc(option.icon || '✦')} ${esc(option.name)}</option>`).join('')}
          </select>
          <div class="wrap" style="margin-top: 12px;">${passives}</div>
        </section>

        <section class="card">
          <div class="kicker">Progress</div>
          <h3>${progress.learned}/${progress.total} available skills</h3>
          <div class="progress-bar"><div class="progress-fill" style="width:${progress.pct}%"></div></div>
          <div class="wrap" style="margin-top: 14px;">
            <span class="pill gold">${character.lumens} Lumens</span>
            <span class="pill">${formatCurrency(character.currency)}</span>
            <span class="pill good">${character.hp}/${stats.hp} HP</span>
            <span class="pill warn">${character.stamina}/${stats.stamina} Stamina</span>
          </div>
          ${renderEffectsSnapshot(character)}
        </section>
      </div>

      ${renderEffectsManager(character)}

      <div class="grid two" style="margin-top: 16px;">
        <section class="card">
          <h3>Core Stats</h3>
          <div class="grid two">
            ${Object.entries(STAT_RULES).map(([stat, rule]) => `<div class="stat-row"><div><strong>${esc(rule.label)}</strong><div class="subtle">${esc(rule.desc)}</div></div><div class="stat-value">${stats[stat]}</div></div>`).join('')}
          </div>
        </section>
        <section class="card">
          <h3>Equipment</h3>
          <div class="stack">${equippedRows}</div>
        </section>
      </div>

      <section class="card" style="margin-top: 16px;">
        <h3>Unlocked Skills</h3>
        ${unlocked.length ? `<div class="wrap">${unlocked.map(skill => `<span class="pill ${isToggleSkill(skill) ? 'warn' : 'good'}" data-tooltip="${esc(skillTooltip(skill))}" tabindex="0">${esc(skill.icon || '✦')} ${esc(skill.name)}</span>`).join('')}</div>` : '<div class="empty">No skills yet. Time to spend shiny brain-money.</div>'}
      </section>
    `
  }

  function renderSkillsTab(character) {
    const categories = skillCategories()
    if (!categories.includes(state.skillCategory)) state.skillCategory = categories[0] || 'weapons'
    const subs = subcategoriesFor(state.skillCategory, character)
    if (!subs.includes(state.skillSubcategory)) state.skillSubcategory = subs[0] || ''
    const list = ((window.SKILLS_DATA?.[state.skillCategory] || {})[state.skillSubcategory] || [])
      .map(skill => ({ ...skill, category: state.skillCategory, subcategory: state.skillSubcategory }))
      .filter(skill => !state.skillSearch || `${skill.name} ${skill.desc} ${skill.id}`.toLowerCase().includes(state.skillSearch.toLowerCase()))
    const byTier = new Map()
    list.forEach(skill => {
      if (!byTier.has(skill.tier)) byTier.set(skill.tier, [])
      byTier.get(skill.tier).push(skill)
    })
    const learnedInTree = list.filter(skill => character.skills.includes(skill.id)).length
    const costRemaining = list.filter(skill => !character.skills.includes(skill.id)).reduce((sum, skill) => sum + skill.cost, 0)
    return `
      <div class="toolbar">
        <input class="input" id="skill-search" placeholder="Search skills, effects, prerequisites..." value="${esc(state.skillSearch)}" />
        <span class="pill good">${learnedInTree}/${list.length} in tree</span>
        <span class="pill gold">${costRemaining}L remaining</span>
      </div>
      <div class="segmented">${categories.map(category => `<button data-skill-category="${esc(category)}" class="${category === state.skillCategory ? 'active' : ''}">${displayCategory(category)}</button>`).join('')}</div>
      <div class="segmented">${subs.map(sub => `<button data-skill-subcategory="${esc(sub)}" class="${sub === state.skillSubcategory ? 'active' : ''}">${titleCase(sub)}</button>`).join('') || '<span class="pill bad">No tree available for this character</span>'}</div>
      <div class="skill-tree">
        ${[...byTier.entries()].sort((a, b) => a[0] - b[0]).map(([tier, skills]) => `
          <section class="tier-lane">
            <h3>Tier ${tier}</h3>
            <div class="skill-grid">${skills.map(skill => renderSkillCard(character, skill)).join('')}</div>
          </section>
        `).join('') || '<div class="empty">No skills matched your search.</div>'}
      </div>
    `
  }

  function renderSkillCard(character, skill) {
    const unlocked = character.skills.includes(skill.id)
    const check = canLearnSkill(character, skill)
    const active = character.activeToggles.includes(skill.id)
    const conflict = incompatibilityReason(character, skill)
    const cls = unlocked ? 'unlocked' : check.ok ? 'available' : conflict ? 'incompatible' : 'locked'
    const action = unlocked
      ? `<button class="ghost-btn tiny" data-refund-skill="${esc(skill.id)}">Refund</button>${isToggleSkill(skill) ? `<button class="chip-btn tiny" data-toggle-skill="${esc(skill.id)}">${active ? 'Switch Off' : 'Switch On'}</button>` : ''}`
      : `<button class="primary-btn tiny" data-learn-skill="${esc(skill.id)}" ${check.ok ? '' : 'disabled'}>Learn</button>`
    return `
      <article class="skill-card ${cls}" data-tooltip="${esc(skillTooltip(skill))}" tabindex="0">
        <div class="skill-top">
          <div class="skill-icon">${esc(skill.icon || '✦')}</div>
          <div>
            <h4>${esc(skill.name)}</h4>
            <div class="wrap" style="margin-top: 7px;">
              <span class="pill gold">${skill.cost}L</span>
              <span class="pill warn">${Number(skill.staminaCost || 0)} STA</span>
              <span class="pill">Tier ${Number(skill.tier || 1)}</span>
              ${active ? '<span class="pill good">Active</span>' : ''}
            </div>
          </div>
        </div>
        <p>${esc(skill.desc)}</p>
        <div class="wrap detail-pills">
          ${isToggleSkill(skill) ? '<span class="pill warn">Toggle</span>' : ''}
          ${skill.elementalType ? `<span class="pill">${titleCase(skill.elementalType)}</span>` : ''}
          ${skill.lootType ? `<span class="pill">${titleCase(skill.lootType)}</span>` : ''}
          ${conflict ? '<span class="pill bad">Conflict</span>' : ''}
        </div>
        <div class="spacer"></div>
        <div class="subtle">${esc(prereqLabel(skill))}</div>
        ${!unlocked && !check.ok ? `<div class="pill bad">${esc(check.reason)}</div>` : ''}
        <div class="skill-actions">${action}</div>
      </article>
    `
  }

  function renderResourceManager(character) {
    const stats = computeStats(character)
    const resourceControl = (resource, label, value, max, quick = [1, 5, 10]) => `
      <div class="resource-editor" data-tooltip="${esc(`${label}
Current value can be adjusted directly or with the quick buttons. Maximum: ${max}`)}" tabindex="0">
        <div>
          <strong>${label}</strong>
          <div class="subtle">Current / max: ${value}/${max}</div>
        </div>
        <div class="resource-control-row">
          ${quick.map(amount => `<button class="ghost-btn tiny" data-adjust-resource="${resource}" data-amount="-${amount}">−${amount}</button>`).join('')}
          <input class="input mini-input" type="number" min="0" max="${max}" value="${value}" data-resource-input="${resource}" />
          ${quick.map(amount => `<button class="ghost-btn tiny" data-adjust-resource="${resource}" data-amount="${amount}">+${amount}</button>`).join('')}
          <button class="primary-btn tiny" data-full-resource="${resource}">Full</button>
        </div>
      </div>
    `
    return `
      <section class="card resource-card">
        <div class="card-header">
          <div>
            <div class="kicker">Live Resource Editor</div>
            <h3>HP, Stamina, Lumens & Money</h3>
            <p>Use this during play to damage, heal, reward, spend, pay, rob, or otherwise lovingly bully the character.</p>
          </div>
          <span class="pill gold">${formatCurrency(character.currency)}</span>
        </div>
        <div class="stack">
          ${resourceControl('hp', 'HP', character.hp, stats.hp)}
          ${resourceControl('stamina', 'Stamina', character.stamina, stats.stamina)}
          <div class="resource-editor" data-tooltip="${esc('Lumens\nSpend or award any amount. Use the direct box for exact values instead of being trapped in +5/+25 jail.')}" tabindex="0">
            <div>
              <strong>Lumens</strong>
              <div class="subtle">Current: ${character.lumens}</div>
            </div>
            <div class="resource-control-row">
              ${[-25, -10, -5, -1].map(amount => `<button class="${amount < 0 ? 'danger-btn' : 'ghost-btn'} tiny" data-adjust-resource="lumens" data-amount="${amount}">${amount}</button>`).join('')}
              <input class="input mini-input" type="number" min="0" value="${character.lumens}" data-resource-input="lumens" />
              ${[1, 5, 10, 25].map(amount => `<button class="ghost-btn tiny" data-adjust-resource="lumens" data-amount="${amount}">+${amount}</button>`).join('')}
            </div>
          </div>
          <div class="resource-editor" data-tooltip="${esc('Money\nEdit exact gold, silver, and copper values, or use quick add/remove buttons. The app converts 25 silver into 1 gold and 100 copper into 1 silver.')}" tabindex="0">
            <div>
              <strong>Money</strong>
              <div class="subtle">Current: ${formatCurrency(character.currency)}</div>
            </div>
            <div class="money-grid">
              <label><span class="field-label">Gold</span><input class="input mini-input" type="number" min="0" value="${character.currency.gold || 0}" data-money-input="gold" /></label>
              <label><span class="field-label">Silver</span><input class="input mini-input" type="number" min="0" value="${character.currency.silver || 0}" data-money-input="silver" /></label>
              <label><span class="field-label">Copper</span><input class="input mini-input" type="number" min="0" value="${character.currency.copper || 0}" data-money-input="copper" /></label>
              <div class="wrap">
                <button class="danger-btn tiny" data-coin="-2500">−1g</button>
                <button class="danger-btn tiny" data-coin="-100">−1s</button>
                <button class="danger-btn tiny" data-coin="-1">−1c</button>
                <button class="ghost-btn tiny" data-coin="1">+1c</button>
                <button class="ghost-btn tiny" data-coin="100">+1s</button>
                <button class="ghost-btn tiny" data-coin="2500">+1g</button>
              </div>
            </div>
          </div>
        </div>
      </section>
    `
  }

  function renderStatsTab(character) {
    const computed = computeStats(character)
    return `
      ${renderResourceManager(character)}
      <div class="grid two" style="margin-top: 16px;">
        ${Object.entries(STAT_RULES).map(([stat, rule]) => {
          const rows = statBreakdown(character, stat).map(row => `<span class="pill ${row.value >= 0 ? 'good' : 'bad'}">${esc(row.label)} ${row.value >= 0 ? '+' : ''}${row.value}</span>`).join('')
          return `
            <section class="card">
              <div class="stat-row">
                <div>
                  <div class="kicker">${rule.cost} Lumens / point</div>
                  <h3>${esc(rule.label)}</h3>
                  <p>${esc(rule.desc)}</p>
                </div>
                <div class="stat-value">${computed[stat]}</div>
              </div>
              <div class="wrap" style="margin: 12px 0;">${rows}</div>
              <div class="stat-actions">
                <button class="ghost-btn" data-refund-stat="${esc(stat)}">− Refund</button>
                <button class="primary-btn" data-upgrade-stat="${esc(stat)}">+ Upgrade</button>
              </div>
            </section>
          `
        }).join('')}
      </div>
    `
  }

  function renderInventoryTab(character) {
    const allItems = itemSources()
    const typeOptions = ['all', ...new Set(allItems.map(item => String(item.type || 'item').toLowerCase()).filter(Boolean).sort())]
    const rarityOptions = ['all', ...new Set(allItems.map(item => String(item.rarity || 'common').toLowerCase()).filter(Boolean).sort((a, b) => rarityRank(a) - rarityRank(b)))]
    const featureOptions = [
      ['all', 'Any purpose'],
      ['equippable', 'Any equipment'],
      ['weapon', 'Weapons'],
      ['armor', 'Armour'],
      ['accessory', 'Accessories'],
      ['damage', 'Has damage dice'],
      ['consumable', 'Consumables / food'],
      ['crafting', 'Crafting materials'],
      ['quest', 'Quest / key items'],
      ['strength', 'Boosts Strength'],
      ['magicPower', 'Boosts Magic Power'],
      ['accuracy', 'Boosts Accuracy'],
      ['speed', 'Boosts Speed'],
      ['defence', 'Boosts Defence'],
      ['special', 'Has special effect'],
      ['enchantable', 'Has enchant slots'],
      ['affordable', 'Affordable now'],
      ['free', 'Free / loot']
    ]
    const sortOptions = [
      ['name', 'Name A–Z'],
      ['priceAsc', 'Cheapest first'],
      ['priceDesc', 'Most expensive'],
      ['rarityDesc', 'Rarest first'],
      ['damageDesc', 'Highest damage'],
      ['strengthDesc', 'Best Strength boost'],
      ['magicDesc', 'Best Magic boost'],
      ['defenceDesc', 'Best Defence boost'],
      ['sourceType', 'Source then type']
    ]
    const items = sortItems(allItems.filter(item => {
      const search = itemSearchText(item)
      const typeOk = state.itemType === 'all' || String(item.type || '').toLowerCase() === state.itemType || String(item.type || '').toLowerCase().includes(state.itemType)
      const sourceOk = state.itemSource === 'all' || item.source === state.itemSource
      const rarityOk = state.itemRarity === 'all' || String(item.rarity || 'common').toLowerCase() === state.itemRarity
      const featureOk = itemMatchesFeature(item, state.itemFeature, character)
      const terms = String(state.itemSearch || '').toLowerCase().split(/\s+/).map(term => term.trim()).filter(Boolean)
      const searchOk = !terms.length || terms.every(term => search.includes(term))
      return typeOk && sourceOk && rarityOk && featureOk && searchOk
    }), state.itemSort)
    const invRows = character.inventory.map(entry => {
      const item = getItem(entry.itemId)
      if (!item) return ''
      const equippedSlot = Object.entries(character.equipped || {}).find(([, uidValue]) => uidValue === entry.uid)?.[0]
      const canEquip = ['weapon', 'armor', 'accessory'].some(type => String(item.type || '').toLowerCase().includes(type))
      return `
        <div class="inventory-row" data-tooltip="${esc(itemTooltip(item))}" tabindex="0">
          <div>
            <strong>${fallbackIcon(item)} ${esc(item.name)} ${entry.qty > 1 ? `×${entry.qty}` : ''}</strong>
            <div class="subtle">${esc(item.type || 'item')} · ${esc(item.rarity || 'common')} ${equippedSlot ? `· Equipped as ${titleCase(equippedSlot)}` : ''}</div>
            <div class="subtle detail-line">${esc(item.desc || 'No description provided.')}</div>
          </div>
          <div class="wrap">
            ${canEquip ? `<button class="primary-btn tiny" data-equip-item="${esc(entry.uid)}">Equip</button>` : ''}
            <button class="danger-btn tiny" data-remove-item="${esc(entry.uid)}">Remove</button>
          </div>
        </div>
      `
    }).join('')
    const maxResults = 240
    const shownItems = items.slice(0, maxResults)
    return `
      <div class="grid two">
        <section class="card">
          <h3>Inventory</h3>
          <div class="stack">${invRows || '<div class="empty">Inventory empty. Pocket goblin is starving.</div>'}</div>
        </section>
        <section class="card">
          <h3>Equipment Slots</h3>
          <div class="stack">
            ${['weapon', 'armor', 'accessory'].map(slot => {
              const entry = character.inventory.find(inv => inv.uid === character.equipped[slot])
              const item = entry && getItem(entry.itemId)
              return `<div class="equip-row" ${item ? `data-tooltip="${esc(itemTooltip(item))}" tabindex="0"` : ''}><div><strong>${titleCase(slot)}</strong><div class="subtle">${item ? `${fallbackIcon(item)} ${esc(item.name)} · ${formatStatModifiers(item.statModifiers)}` : 'Empty'}</div></div>${item ? `<button class="ghost-btn tiny" data-unequip="${slot}">Unequip</button>` : ''}</div>`
            }).join('')}
          </div>
        </section>
      </div>
      <section class="card" style="margin-top: 16px;">
        <div class="card-header">
          <div>
            <div class="kicker">Catalogue</div>
            <h3>Shop & Item Granting</h3>
            <p>Search by name, effect, stat, damage dice, rarity, source, crafting recipe, or plain words like “burn”, “defence”, “sword”, “food”, or “affordable”. Hover any card for full details.</p>
          </div>
          <span class="pill gold">${formatCurrency(character.currency)}</span>
        </div>
        <div class="toolbar item-toolbar">
          <input class="input" id="item-search" placeholder="Search effects/stats e.g. burn, +strength, 1d8, dragon, defence..." value="${esc(state.itemSearch)}" />
          <select class="input" id="item-source">
            ${['shop','profession','discoverable','loot','all'].map(source => `<option value="${source}" ${state.itemSource === source ? 'selected' : ''}>${titleCase(source)}</option>`).join('')}
          </select>
          <select class="input" id="item-type">
            ${typeOptions.map(type => `<option value="${esc(type)}" ${state.itemType === type ? 'selected' : ''}>${titleCase(type)}</option>`).join('')}
          </select>
          <select class="input" id="item-rarity">
            ${rarityOptions.map(rarity => `<option value="${esc(rarity)}" ${state.itemRarity === rarity ? 'selected' : ''}>${titleCase(rarity)}</option>`).join('')}
          </select>
          <select class="input" id="item-feature">
            ${featureOptions.map(([value, label]) => `<option value="${value}" ${state.itemFeature === value ? 'selected' : ''}>${esc(label)}</option>`).join('')}
          </select>
          <select class="input" id="item-sort">
            ${sortOptions.map(([value, label]) => `<option value="${value}" ${state.itemSort === value ? 'selected' : ''}>Sort: ${esc(label)}</option>`).join('')}
          </select>
        </div>
        <div class="catalogue-summary">
          <span class="pill good">${items.length} match${items.length === 1 ? '' : 'es'}</span>
          ${items.length > maxResults ? `<span class="pill warn">Showing first ${maxResults}; narrow the search for the rest</span>` : ''}
          <button class="ghost-btn tiny" data-reset-item-filters>Reset Filters</button>
        </div>
        <div class="item-grid">${shownItems.map(item => renderItemCard(item, character)).join('') || '<div class="empty">No items matched.</div>'}</div>
      </section>
    `
  }

  function renderItemCard(item, character = activeCharacter()) {
    const price = itemPriceCopper(item)
    const affordable = !character || price <= currencyToCopper(character.currency)
    const statPills = Object.entries(item.statModifiers || {}).map(([stat, value]) => `<span class="pill ${value >= 0 ? 'good' : 'bad'}">${titleCase(stat)} ${value >= 0 ? '+' : ''}${value}</span>`).join('')
    const effectPills = (item.specialEffects || []).slice(0, 3).map(effect => `<span class="pill warn">${titleCase(effect)}</span>`).join('')
    return `
      <article class="item-card" data-tooltip="${esc(itemTooltip(item))}" tabindex="0">
        <div class="item-title">
          <strong>${fallbackIcon(item)} ${esc(item.name)}</strong>
          <span class="pill">${esc(item.rarity || 'common')}</span>
        </div>
        <div class="item-meta">${esc(item.type || 'item')} · ${esc(item.source || 'shop')}${item.damage ? ` · ${esc(item.damage)}` : ''}</div>
        <p class="subtle">${esc(item.desc || 'No description provided.')}</p>
        <div class="wrap detail-pills">
          ${statPills || '<span class="pill">No stat modifiers</span>'}
          ${effectPills}
          ${Number(item.enchantmentSlots || 0) ? `<span class="pill good">${item.enchantmentSlots} enchant slot${Number(item.enchantmentSlots) === 1 ? '' : 's'}</span>` : ''}
        </div>
        <div class="skill-actions">
          <span class="pill gold">${price ? formatCurrency(price) : 'Free/loot'}</span>
          <span class="wrap compact-actions">
            <button class="ghost-btn tiny" data-grant-item="${esc(item.id)}">Grant</button>
            <button class="primary-btn tiny" data-buy-item="${esc(item.id)}" ${affordable ? '' : 'disabled'}>Buy</button>
          </span>
        </div>
      </article>
    `
  }

  function renderGmTab(character) {
    const diceResult = state.lastRoll ? `<div class="notice-card"><h2>${state.lastRoll.total}</h2><p>Rolls: ${state.lastRoll.rolls.join(', ')} ${state.lastRoll.modifier ? `· Modifier ${state.lastRoll.modifier >= 0 ? '+' : ''}${state.lastRoll.modifier}` : ''}</p></div>` : ''
    return `
      <div class="grid two">
        <section class="card">
          <div class="kicker">Table Controls</div>
          <h3>GM Quick Tools</h3>
          <p>Fast changes for rests, turn upkeep and table nonsense. Exact HP, stamina, lumen and money editing is now in the resource editor below.</p>
          <div class="wrap" style="margin-top: 14px;">
            <button class="primary-btn" data-heal-full ${character ? '' : 'disabled'}>Full Heal</button>
            <button class="primary-btn" data-stamina-full ${character ? '' : 'disabled'}>Restore Stamina</button>
            <button class="ghost-btn" data-process-turn ${character ? '' : 'disabled'}>Process Turn</button>
          </div>
        </section>

        <section class="card">
          <div class="kicker">Dice Roller</div>
          <h3>Roll Dice</h3>
          <div class="grid three">
            <label><span class="field-label">Count</span><input class="input" id="dice-count" type="number" min="1" max="40" value="${state.dice.count}" /></label>
            <label><span class="field-label">Sides</span><input class="input" id="dice-sides" type="number" min="2" max="100" value="${state.dice.sides}" /></label>
            <label><span class="field-label">Modifier</span><input class="input" id="dice-mod" type="number" min="-100" max="100" value="${state.dice.modifier}" /></label>
          </div>
          <button class="primary-btn full" data-roll-dice>Roll</button>
          <div style="margin-top: 14px;">${diceResult}</div>
        </section>
      </div>

      <div style="margin-top: 16px;">
        ${character ? renderResourceManager(character) : '<div class="notice-card"><h2>No character selected</h2><p>Create or select a character to use resource controls.</p></div>'}
      </div>

      <section class="card" style="margin-top: 16px;">
        <h3>Save Utilities</h3>
        <div class="wrap">
          <button class="ghost-btn" data-export-character ${character ? '' : 'disabled'}>Export Current Character</button>
          <button class="ghost-btn" data-export-all-bottom>Export Whole Save</button>
          <button class="danger-btn" data-delete-active ${character ? '' : 'disabled'}>Delete Current Character</button>
        </div>
      </section>
    `
  }

  function renderNotesTab(character) {
    return `
      <section class="card">
        <div class="card-header">
          <div>
            <div class="kicker">Campaign Notes</div>
            <h3>${esc(character.name)}'s Notes</h3>
            <p>Use this for build plans, loot promises, session reminders, crimes committed, crimes denied, and suspiciously specific goblin grudges.</p>
          </div>
          <button class="primary-btn tiny" data-save-notes>Save Notes</button>
        </div>
        <textarea id="character-notes">${esc(character.notes || '')}</textarea>
      </section>
    `
  }

  function refreshContentAndRefocus(selector, value) {
    renderContent()
    bindDynamicActions()
    const input = $(selector)
    if (!input) return
    input.focus()
    input.value = value
    const pos = String(value).length
    input.setSelectionRange?.(pos, pos)
  }

  function bindDynamicActions() {
    $$('[data-select-character]').forEach(button => button.addEventListener('click', () => {
      state.activeId = button.dataset.selectCharacter
      save()
      render()
      $('#sidebar')?.classList.remove('open')
    }))
    $$('[data-learn-skill]').forEach(button => button.addEventListener('click', () => learnSkill(button.dataset.learnSkill)))
    $$('[data-refund-skill]').forEach(button => button.addEventListener('click', () => refundSkill(button.dataset.refundSkill)))
    $$('[data-toggle-skill]').forEach(button => button.addEventListener('click', () => toggleSkill(button.dataset.toggleSkill)))
    $$('[data-skill-category]').forEach(button => button.addEventListener('click', () => {
      state.skillCategory = button.dataset.skillCategory
      state.skillSubcategory = subcategoriesFor(state.skillCategory)[0] || ''
      render()
    }))
    $$('[data-skill-subcategory]').forEach(button => button.addEventListener('click', () => {
      state.skillSubcategory = button.dataset.skillSubcategory
      render()
    }))
    $('#skill-search')?.addEventListener('input', event => {
      state.skillSearch = event.target.value
      refreshContentAndRefocus('#skill-search', state.skillSearch)
    })
    $$('[data-upgrade-stat]').forEach(button => button.addEventListener('click', () => upgradeStat(button.dataset.upgradeStat)))
    $$('[data-refund-stat]').forEach(button => button.addEventListener('click', () => refundStat(button.dataset.refundStat)))
    $$('[data-buy-item]').forEach(button => button.addEventListener('click', () => buyItem(button.dataset.buyItem, false)))
    $$('[data-grant-item]').forEach(button => button.addEventListener('click', () => buyItem(button.dataset.grantItem, true)))
    $$('[data-remove-item]').forEach(button => button.addEventListener('click', () => removeInventoryEntry(button.dataset.removeItem)))
    $$('[data-equip-item]').forEach(button => button.addEventListener('click', () => equipItem(button.dataset.equipItem)))
    $$('[data-unequip]').forEach(button => button.addEventListener('click', () => unequip(button.dataset.unequip)))
    $('#item-search')?.addEventListener('input', event => { state.itemSearch = event.target.value; refreshContentAndRefocus('#item-search', state.itemSearch) })
    $('#item-type')?.addEventListener('change', event => { state.itemType = event.target.value; renderContent(); bindDynamicActions() })
    $('#item-source')?.addEventListener('change', event => { state.itemSource = event.target.value; renderContent(); bindDynamicActions() })
    $('#item-rarity')?.addEventListener('change', event => { state.itemRarity = event.target.value; renderContent(); bindDynamicActions() })
    $('#item-feature')?.addEventListener('change', event => { state.itemFeature = event.target.value; renderContent(); bindDynamicActions() })
    $('#item-sort')?.addEventListener('change', event => { state.itemSort = event.target.value; renderContent(); bindDynamicActions() })
    $('[data-reset-item-filters]')?.addEventListener('click', () => {
      state.itemSearch = ''
      state.itemType = 'all'
      state.itemSource = 'shop'
      state.itemRarity = 'all'
      state.itemFeature = 'all'
      state.itemSort = 'name'
      renderContent(); bindDynamicActions()
    })
    $('#change-race')?.addEventListener('change', event => setRace(event.target.value))
    $('#rename-character')?.addEventListener('change', event => {
      const character = activeCharacter()
      if (!character) return
      character.name = event.target.value.trim() || character.name
      save()
      render()
    })
    $('[data-save-notes]')?.addEventListener('click', () => {
      const character = activeCharacter()
      if (!character) return
      character.notes = $('#character-notes')?.value || ''
      save()
      toast('Notes saved.')
    })
    $('[data-heal-full]')?.addEventListener('click', () => heal())
    $('[data-stamina-full]')?.addEventListener('click', () => restoreStamina())
    $$('[data-process-turn]').forEach(button => button.addEventListener('click', () => processTurn()))
    $$('[data-remove-effect]').forEach(button => button.addEventListener('click', () => removeStatusEffect(button.dataset.removeEffect)))
    $('[data-add-effect]')?.addEventListener('click', () => {
      addStatusEffect($('#effect-select')?.value, $('#effect-duration')?.value, $('#effect-potency')?.value, $('#effect-notes')?.value || '')
    })
    $$('[data-lumens]').forEach(button => button.addEventListener('click', () => adjustLumens(Number(button.dataset.lumens))))
    $$('[data-adjust-resource]').forEach(button => button.addEventListener('click', () => adjustResource(button.dataset.adjustResource, Number(button.dataset.amount))))
    $$('[data-full-resource]').forEach(button => button.addEventListener('click', () => fillResource(button.dataset.fullResource)))
    $$('[data-resource-input]').forEach(input => {
      input.addEventListener('change', () => setResource(input.dataset.resourceInput, Number(input.value)))
      input.addEventListener('keydown', event => { if (event.key === 'Enter') setResource(input.dataset.resourceInput, Number(input.value)) })
    })
    $$('[data-coin]').forEach(button => button.addEventListener('click', () => adjustCurrency(Number(button.dataset.coin))))
    $$('[data-money-input]').forEach(input => {
      input.addEventListener('change', () => setCurrencyPart(input.dataset.moneyInput, Number(input.value)))
      input.addEventListener('keydown', event => { if (event.key === 'Enter') setCurrencyPart(input.dataset.moneyInput, Number(input.value)) })
    })
    $('[data-roll-dice]')?.addEventListener('click', () => {
      state.dice.count = clamp(Number($('#dice-count')?.value || 1), 1, 40)
      state.dice.sides = clamp(Number($('#dice-sides')?.value || 20), 2, 100)
      state.dice.modifier = clamp(Number($('#dice-mod')?.value || 0), -100, 100)
      state.lastRoll = { ...rollDice(state.dice.count, state.dice.sides, state.dice.modifier), modifier: state.dice.modifier }
      renderContent(); bindDynamicActions()
    })
    $('[data-export-character]')?.addEventListener('click', () => exportData(false))
    $('[data-export-all-bottom]')?.addEventListener('click', () => exportData(true))
    $('[data-delete-active]')?.addEventListener('click', () => activeCharacter() && deleteCharacter(activeCharacter().id))
  }

  function setupTooltips() {
    const tooltip = $('#hover-tooltip')
    if (!tooltip || tooltip.dataset.ready) return
    tooltip.dataset.ready = 'true'
    const move = (x, y) => {
      const margin = 16
      const rect = tooltip.getBoundingClientRect()
      let left = x + margin
      let top = y + margin
      if (left + rect.width > window.innerWidth - 8) left = x - rect.width - margin
      if (top + rect.height > window.innerHeight - 8) top = y - rect.height - margin
      tooltip.style.left = `${Math.max(8, left)}px`
      tooltip.style.top = `${Math.max(8, top)}px`
    }
    const show = (target, x, y) => {
      const text = target?.dataset?.tooltip
      if (!text) return
      tooltip.textContent = text
      tooltip.classList.add('show')
      move(x, y)
    }
    const hide = () => tooltip.classList.remove('show')
    document.addEventListener('mouseover', event => {
      const target = event.target.closest('[data-tooltip]')
      if (!target) return
      show(target, event.clientX, event.clientY)
    })
    document.addEventListener('mousemove', event => {
      if (tooltip.classList.contains('show')) move(event.clientX, event.clientY)
    })
    document.addEventListener('mouseout', event => {
      const target = event.target.closest('[data-tooltip]')
      if (!target || target.contains(event.relatedTarget)) return
      hide()
    })
    document.addEventListener('focusin', event => {
      const target = event.target.closest('[data-tooltip]')
      if (!target) return
      const rect = target.getBoundingClientRect()
      show(target, rect.left + rect.width / 2, rect.bottom)
    })
    document.addEventListener('focusout', hide)
    document.addEventListener('scroll', hide, true)
  }

  function setupStaticEvents() {
    setupTooltips()
    $('#create-character')?.addEventListener('click', () => {
      const name = $('#new-name').value.trim()
      const raceId = $('#new-race').value
      if (!name) return toast('Give the poor little hero a name first.')
      const character = createCharacter(name, raceId)
      state.characters.push(character)
      state.activeId = character.id
      $('#new-name').value = ''
      save()
      render()
      toast(`${character.name} created.`)
    })
    $('#new-name')?.addEventListener('keydown', event => {
      if (event.key === 'Enter') $('#create-character')?.click()
    })
    $('#tabbar')?.addEventListener('click', event => {
      const button = event.target.closest('button[data-tab]')
      if (!button) return
      state.tab = button.dataset.tab
      $$('#tabbar button').forEach(tab => tab.classList.toggle('active', tab.dataset.tab === state.tab))
      renderContent()
      bindDynamicActions()
    })
    $('#export-all')?.addEventListener('click', () => exportData(true))
    $('#import-save')?.addEventListener('change', event => importData(event.target.files?.[0]))
    $('#open-sidebar')?.addEventListener('click', () => $('#sidebar')?.classList.add('open'))
    $('#collapse-sidebar')?.addEventListener('click', () => $('#sidebar')?.classList.toggle('open'))
    document.addEventListener('click', event => {
      const sidebar = $('#sidebar')
      if (!sidebar?.classList.contains('open')) return
      if (event.target.closest('#sidebar') || event.target.closest('#open-sidebar')) return
      sidebar.classList.remove('open')
    })
    document.addEventListener('keydown', event => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 's') {
        event.preventDefault()
        const character = activeCharacter()
        const notes = $('#character-notes')
        if (character && notes) character.notes = notes.value
        save()
        toast('Saved.')
      }
    })
  }

  function boot() {
    if (!window.SKILLS_DATA || !window.RACES_DATA || !window.ITEMS_DATA) {
      $('#app-content').innerHTML = '<div class="notice-card"><h2>Data failed to load</h2><p>One of the game data files is missing. Make sure the data folder is beside index.html.</p></div>'
      return
    }
    load()
    setupStaticEvents()
    render()
  }

  window.LumenForge = {
    state,
    get activeCharacter() { return activeCharacter() },
    flattenSkills,
    itemSources,
    computeStats
  }

  document.addEventListener('DOMContentLoaded', boot)
})()
