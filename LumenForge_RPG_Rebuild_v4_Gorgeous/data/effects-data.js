// Auto-generated from app.js — do not edit by hand; run: node scripts/build-data.mjs
export const EFFECT_DEFINITIONS = {
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
  "multiattack": {
    "id": "multiattack",
    "name": "Multiattack",
    "icon": "⚔️",
    "type": "passive",
    "duration": 0,
    "potency": 0,
    "desc": "Each turn, make 2 different attacks (each pays its own stamina cost).",
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
