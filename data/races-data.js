// Races Data - Character races with unique abilities and racial skill trees

try {
    console.log('Loading races data...')

    const RACES_DATA = {
        elf: {
            id: "elf",
            name: "Elf",
            icon: "🧝",
            description: "Masters of Magic and Nature with keen senses, magical affinity, and natural longevity.",
            passiveTraits: [
                "Keen Senses: +1 Accuracy for detecting hidden enemies and precise attacks",
                "Magical Affinity: +1 Magic Power when using staves or wands",
                "Elven Longevity: Immune to aging and disease status effects"
            ],
            statModifiers: {
                accuracy: 1
            },
            equipmentStatModifiers: [
                {
                    id: "magical_affinity",
                    label: "Magical Affinity",
                    weaponKind: "staff",
                    statModifiers: { magicPower: 1 }
                }
            ],
            exclusiveSkills: ["elven_accuracy", "forest_step", "moonbeam", "elven_high_magic", "starlight_mastery"]
        },

        dwarf: {
            id: "dwarf",
            name: "Dwarf",
            icon: "🧔",
            description: "Masters of Craft and Stone with natural resilience, stone sense, and craftsman heritage.",
            passiveTraits: [
                "Stone Sense: Can detect traps, secret doors, and structural weaknesses",
                "Dwarven Resilience: Immune to poison status effects",
                "Master Craftsman: All crafting recipes require 1 less material (minimum 1)"
            ],
            statModifiers: {
                physicalDefence: 2,
                hp: 1
            },
            exclusiveSkills: ["dwarven_toughness", "forge_blessing", "mountain_charge", "runic_weapon", "ancestral_might"]
        },

        halfling: {
            id: "halfling",
            name: "Halfling",
            icon: "🦶",
            description: "Masters of Luck and Stealth with natural fortune, small size advantages, and brave hearts.",
            passiveTraits: [
                "Lucky: Can reroll any natural 1 on dice (once per combat/encounter)",
                "Small & Nimble: Can move through larger creature spaces, +1 Speed",
                "Brave Heart: Immune to fear and intimidation status effects"
            ],
            statModifiers: {
                speed: 2,
                accuracy: 1
            },
            exclusiveSkills: ["lucky_dodge", "sneaky_strike", "fortune_favor", "miraculous_escape", "legendary_luck"]
        },

        orc: {
            id: "orc",
            name: "Orc",
            icon: "👹",
            description: "Masters of Fury and Might with savage attacks, relentless endurance, and powerful build.",
            passiveTraits: [
                "Savage Critical: Critical hits deal +1 extra damage die",
                "Relentless Endurance: When reduced to 0 HP, drop to 1 HP instead (once per day)",
                "Powerful Build: +1 damage with melee weapons, +2 carrying capacity"
            ],
            statModifiers: {
                strength: 2,
                hp: 1
            },
            exclusiveSkills: ["orcish_fury", "intimidating_roar", "blood_frenzy", "unstoppable_charge", "warchief_presence"]
        },

        human: {
            id: "human",
            name: "Human",
            icon: "👤",
            description: "Jack of all trades, master of none. Humans don't develop advanced racial techniques, instead learning from other cultures through adaptability and determination.",
            passiveTraits: [
                "Versatile Learning: Gain one free Tier 1 weapon skill upon character creation",
                "Ambitious Spirit: Earn 10% more Lumens from all sources",
                "Cross-Cultural Learning: Can learn Tier 1 skills from other races' skill trees"
            ],
            statModifiers: {
                hp: 1,
                stamina: 1,
                accuracy: 1
            },
            exclusiveSkills: ["human_determination"]
        },

        dragonborn: {
            id: "dragonborn",
            name: "Dragonborn",
            icon: "🐉",
            description: "Masters of Elements and Honor with draconic heritage, scaled hide, and draconic senses.",
            passiveTraits: [
                "Draconic Heritage: Choose elemental affinity (Fire/Ice/Thunder/Earth/Wind/Water/Light/Darkness)",
                "Scaled Hide: Resistance to chosen element damage",
                "Draconic Senses: Can detect magical auras and see in dim light"
            ],
            statModifiers: {
                physicalDefence: 1,
                magicalDefence: 1,
                strength: 1
            },
            exclusiveSkills: ["breath_weapon", "draconic_presence", "elemental_mastery", "dragon_wings", "ancient_fury"]
        },

        tiefling: {
            id: "tiefling",
            name: "Tiefling",
            icon: "😈",
            description: "Masters of Chaos and Contracts with infernal heritage, darkvision, and fiendish cunning.",
            passiveTraits: [
                "Infernal Heritage: Immune to fire damage and charm status effects",
                "Darkvision: Can see in complete darkness as if it were dim light",
                "Fiendish Cunning: +1 to social manipulation and intimidation"
            ],
            statModifiers: {
                magicPower: 1,
                magicalDefence: 1,
                stamina: 1
            },
            exclusiveSkills: ["hellish_rebuke", "infernal_constitution", "devils_bargain", "summon_imp", "infernal_dominion"]
        },

        drow: {
            id: "drow",
            name: "Dark Elf (Drow)",
            icon: "🌙",
            description: "Masters of Shadow and Poison with superior darkvision, sunlight sensitivity, and poison mastery.",
            passiveTraits: [
                "Superior Darkvision: Perfect vision in complete darkness (extended range)",
                "Sunlight Sensitivity: -1 Accuracy penalty when fighting in bright sunlight",
                "Poison Immunity: Immune to all poison damage and poison status effects"
            ],
            statModifiers: {
                speed: 1,
                magicPower: 1,
                magicalDefence: 1
            },
            exclusiveSkills: ["shadow_affinity", "drow_poison", "darkness_spell", "spider_climb", "drow_matron"]
        },

        gnoll: {
            id: "gnoll",
            name: "Gnoll",
            icon: "🐺",
            description: "Masters of Pack Hunting and Savagery with pack tactics, keen smell, and savage instincts.",
            passiveTraits: [
                "Pack Tactics: +1 Accuracy when an ally is adjacent to the same target",
                "Keen Smell: Can track creatures and detect invisible/hidden enemies nearby",
                "Savage Instincts: +1 damage against enemies below 50% HP"
            ],
            statModifiers: {
                strength: 1,
                speed: 1,
                hp: 1
            },
            exclusiveSkills: ["pack_coordination", "savage_bite", "howl_of_the_pack", "rampage", "alpha_dominance"]
        },

        monster: {
            id: "monster",
            name: "Monster",
            icon: "👹",
            description: "This is for Enemy characters and Summons.",
            passiveTraits: [
                "Monster Nature: Access to specialized monster skill categories",
                "Monster Stupidity: No access to Profession Skills/Crafting",
            ],
            statModifiers: {
                none: 0 // Monsters should not get any boosts, as they are NPC Enemies
            },
            exclusiveSkills: [] // Monster skills are handled differently through the monster system
        }
    }

    // Complete Racial Skill Trees
    const RACE_SKILL_TREES = {
    "elf": [
        {
            "id": "elven_accuracy",
            "name": "Elven Accuracy",
            "tier": 1,
            "cost": 5,
            "staminaCost": 0,
            "desc": "Passive: +1 accuracy with ranged weapons and spells",
            "icon": "🎯",
            "prerequisites": {
                "type": "NONE",
                "skills": []
            },
            "race": "elf"
        },
        {
            "id": "forest_step",
            "name": "Forest Step",
            "tier": 2,
            "cost": 10,
            "staminaCost": 3,
            "desc": "Action: Move through natural terrain without movement penalty, +2 stealth in forests",
            "icon": "🌲",
            "prerequisites": {
                "type": "AND",
                "skills": [
                    "elven_accuracy"
                ]
            },
            "race": "elf"
        },
        {
            "id": "moonbeam",
            "name": "Moonbeam",
            "tier": 3,
            "cost": 15,
            "staminaCost": 6,
            "desc": "Spell: Create beam of silver light (2d6 light damage + reveals invisible enemies)",
            "icon": "🌙",
            "prerequisites": {
                "type": "AND",
                "skills": [
                    "forest_step"
                ]
            },
            "race": "elf"
        },
        {
            "id": "elven_high_magic",
            "name": "Elven High Magic",
            "tier": 4,
            "cost": 20,
            "staminaCost": 0,
            "desc": "Passive: All spells cost -1 stamina (minimum 1), immune to magical charm effects",
            "icon": "✨",
            "prerequisites": {
                "type": "AND",
                "skills": [
                    "moonbeam"
                ]
            },
            "race": "elf",
            "specialEffects": [
                "arcane_mastery",
                "spell_warded"
            ]
        },
        {
            "id": "starlight_mastery",
            "name": "Starlight Mastery",
            "tier": 5,
            "cost": 25,
            "staminaCost": 12,
            "desc": "Ultimate: Summon starfall in 30ft radius (4d8 light damage, heals allies 2d6)",
            "icon": "⭐",
            "prerequisites": {
                "type": "AND",
                "skills": [
                    "elven_high_magic"
                ]
            },
            "race": "elf"
        }
    ],
    "dwarf": [
        {
            "id": "dwarven_toughness",
            "name": "Dwarven Toughness",
            "tier": 1,
            "cost": 5,
            "staminaCost": 0,
            "desc": "Passive: +5 max HP, resistance to knockdown effects",
            "icon": "💪",
            "prerequisites": {
                "type": "NONE",
                "skills": []
            },
            "race": "dwarf",
            "specialEffects": [
                "knockdown_resistance"
            ]
        },
        {
            "id": "forge_blessing",
            "name": "Forge Blessing",
            "tier": 2,
            "cost": 10,
            "staminaCost": 0,
            "desc": "Passive: Crafted weapons/armor gain +1 enchantment slot and +1 to all stat bonuses",
            "icon": "🔨",
            "prerequisites": {
                "type": "AND",
                "skills": [
                    "dwarven_toughness"
                ]
            },
            "race": "dwarf"
        },
        {
            "id": "mountain_charge",
            "name": "Mountain Charge",
            "tier": 3,
            "cost": 15,
            "staminaCost": 5,
            "desc": "Action: Charge 20ft ignoring difficult terrain (+3 damage, knockdown on hit)",
            "icon": "🏔️",
            "prerequisites": {
                "type": "AND",
                "skills": [
                    "forge_blessing"
                ]
            },
            "race": "dwarf"
        },
        {
            "id": "runic_weapon",
            "name": "Runic Weapon",
            "tier": 4,
            "cost": 20,
            "staminaCost": 8,
            "desc": "Enhancement: Inscribe runes on weapon (+2d6 damage, bypasses resistances for 10 attacks)",
            "icon": "🔤",
            "prerequisites": {
                "type": "AND",
                "skills": [
                    "mountain_charge"
                ]
            },
            "race": "dwarf"
        },
        {
            "id": "ancestral_might",
            "name": "Ancestral Might",
            "tier": 5,
            "cost": 25,
            "staminaCost": 10,
            "desc": "Toggle: Channel ancient dwarven spirits (+4 Strength, +3 Physical Defence and +3 Magical Defence, +5 crafting bonus)",
            "icon": "👑",
            "prerequisites": {
                "type": "AND",
                "skills": [
                    "runic_weapon"
                ]
            },
            "race": "dwarf"
        }
    ],
    "halfling": [
        {
            "id": "lucky_dodge",
            "name": "Lucky Dodge",
            "tier": 1,
            "cost": 5,
            "staminaCost": 3,
            "desc": "Reaction: Force an enemy's attack to reroll (once per attack)",
            "icon": "🍀",
            "prerequisites": {
                "type": "NONE",
                "skills": []
            },
            "race": "halfling"
        },
        {
            "id": "sneaky_strike",
            "name": "Sneaky Strike",
            "tier": 2,
            "cost": 10,
            "staminaCost": 4,
            "desc": "Action: Attack from stealth gains +3 attack roll",
            "icon": "🤫",
            "prerequisites": {
                "type": "AND",
                "skills": [
                    "lucky_dodge"
                ]
            },
            "race": "halfling"
        },
        {
            "id": "fortune_favor",
            "name": "Fortune's Favor",
            "tier": 3,
            "cost": 15,
            "staminaCost": 6,
            "desc": "Action: Grant luck to ally (next 3 rolls are advantage) or curse enemy (disadvantage)",
            "icon": "🎲",
            "prerequisites": {
                "type": "AND",
                "skills": [
                    "sneaky_strike"
                ]
            },
            "race": "halfling"
        },
        {
            "id": "miraculous_escape",
            "name": "Miraculous Escape",
            "tier": 4,
            "cost": 20,
            "staminaCost": 8,
            "desc": "Reaction: When reduced to 0 HP, teleport to safety with 1 HP (once per day)",
            "icon": "💨",
            "prerequisites": {
                "type": "AND",
                "skills": [
                    "fortune_favor"
                ]
            },
            "race": "halfling"
        },
        {
            "id": "legendary_luck",
            "name": "Legendary Luck",
            "tier": 5,
            "cost": 25,
            "staminaCost": 0,
            "desc": "Passive: Reroll any failed save or critical failure, allies within 10ft gain the same effect",
            "icon": "⭐",
            "prerequisites": {
                "type": "AND",
                "skills": [
                    "miraculous_escape"
                ]
            },
            "race": "halfling"
        }
    ],
    "orc": [
        {
            "id": "orcish_fury",
            "name": "Orcish Fury",
            "tier": 1,
            "cost": 5,
            "staminaCost": 3,
            "desc": "Action: Next attack deals +1d6 damage and gains advantage",
            "icon": "😡",
            "prerequisites": {
                "type": "NONE",
                "skills": []
            },
            "race": "orc"
        },
        {
            "id": "intimidating_roar",
            "name": "Intimidating Roar",
            "tier": 2,
            "cost": 10,
            "staminaCost": 4,
            "desc": "Action: 15ft cone, apply Mind Controlled (fear variant) for 2 turns",
            "icon": "🦁",
            "prerequisites": {
                "type": "AND",
                "skills": [
                    "orcish_fury"
                ]
            },
            "race": "orc"
        },
        {
            "id": "blood_frenzy",
            "name": "Blood Frenzy",
            "tier": 3,
            "cost": 15,
            "staminaCost": 0,
            "desc": "Passive: When an enemy dies within 30ft, gain +2 damage for rest of combat (stackable up to +10 damage)",
            "icon": "🩸",
            "prerequisites": {
                "type": "AND",
                "skills": [
                    "intimidating_roar"
                ]
            },
            "race": "orc"
        },
        {
            "id": "unstoppable_charge",
            "name": "Unstoppable Charge",
            "tier": 4,
            "cost": 20,
            "staminaCost": 8,
            "desc": "Action: Charge through multiple enemies (each takes 2d6)",
            "icon": "🐂",
            "prerequisites": {
                "type": "AND",
                "skills": [
                    "blood_frenzy"
                ]
            },
            "race": "orc"
        },
        {
            "id": "warchief_presence",
            "name": "Warchief Presence",
            "tier": 5,
            "cost": 25,
            "staminaCost": 10,
            "desc": "Aura: Allies within 20ft gain +2 damage and immunity to fear effects",
            "icon": "👑",
            "prerequisites": {
                "type": "AND",
                "skills": [
                    "unstoppable_charge"
                ]
            },
            "race": "orc"
        }
    ],
    "human": [
        {
            "id": "human_determination",
            "name": "Human Determination",
            "tier": 1,
            "cost": 5,
            "staminaCost": 0,
            "desc": "Passive: +1 to all saving throws, resistance to Incapacitated. Unlocks Cross-Cultural Learning and Tier 1 monster skills.",
            "icon": "�",
            "prerequisites": {
                "type": "NONE",
                "skills": []
            },
            "race": "human",
            "specialEffects": [
                "incapacitated_resistance"
            ]
        }
    ],
    "dragonborn": [
        {
            "id": "breath_weapon",
            "name": "Draconic Breath",
            "tier": 1,
            "cost": 5,
            "staminaCost": 10,
            "desc": "Action: 15ft cone of chosen element (2d6 + low chance of status effect based on element)",
            "icon": "🔥",
            "prerequisites": {
                "type": "NONE",
                "skills": []
            },
            "race": "dragonborn"
        },
        {
            "id": "draconic_presence",
            "name": "Draconic Presence",
            "tier": 2,
            "cost": 10,
            "staminaCost": 4,
            "desc": "Action: Project intimidating aura (enemies within 10ft must save vs fear)",
            "icon": "👁️",
            "prerequisites": {
                "type": "AND",
                "skills": [
                    "breath_weapon"
                ]
            },
            "race": "dragonborn"
        },
        {
            "id": "elemental_mastery",
            "name": "Elemental Mastery",
            "tier": 3,
            "cost": 15,
            "staminaCost": 0,
            "desc": "Passive: All attacks deal +1d4 elemental damage of chosen element, immunity to said element",
            "icon": "⚡",
            "prerequisites": {
                "type": "AND",
                "skills": [
                    "draconic_presence"
                ]
            },
            "race": "dragonborn",
            "specialEffects": [
                "elemental_mastery_passive"
            ]
        },
        {
            "id": "dragon_wings",
            "name": "Dragon Wings",
            "tier": 4,
            "cost": 20,
            "staminaCost": 5,
            "desc": "Toggle: Manifest wings for flight (60ft speed, lasts 10 rounds)",
            "icon": "🦅",
            "prerequisites": {
                "type": "AND",
                "skills": [
                    "elemental_mastery"
                ]
            },
            "race": "dragonborn"
        },
        {
            "id": "ancient_fury",
            "name": "Ancient Fury",
            "tier": 5,
            "cost": 25,
            "staminaCost": 15,
            "desc": "Ultimate: Channel ancient dragon (30ft breath, 4d8 damage, + high chance of status effect based on element)",
            "icon": "🐲",
            "prerequisites": {
                "type": "AND",
                "skills": [
                    "dragon_wings"
                ]
            },
            "race": "dragonborn"
        }
    ],
    "tiefling": [
        {
            "id": "hellish_rebuke",
            "name": "Hellish Rebuke",
            "tier": 1,
            "cost": 5,
            "staminaCost": 4,
            "desc": "Reaction: When damaged, attacker takes 1d6 fire damage",
            "icon": "🔥",
            "prerequisites": {
                "type": "NONE",
                "skills": []
            },
            "race": "tiefling"
        },
        {
            "id": "infernal_constitution",
            "name": "Infernal Constitution",
            "tier": 2,
            "cost": 10,
            "staminaCost": 0,
            "desc": "Passive: Immunity to fire, resistance to Dark elemental damage, +2 max stamina",
            "icon": "😈",
            "prerequisites": {
                "type": "AND",
                "skills": [
                    "hellish_rebuke"
                ]
            },
            "race": "tiefling",
            "specialEffects": [
                "fire_immunity",
                "darkness_resistance"
            ]
        },
        {
            "id": "devils_bargain",
            "name": "Devil's Bargain",
            "tier": 3,
            "cost": 15,
            "staminaCost": 8,
            "desc": "Action: Offer deal to enemy (they take -2 to all rolls but you take +1 damage from them)",
            "icon": "📜",
            "prerequisites": {
                "type": "AND",
                "skills": [
                    "infernal_constitution"
                ]
            },
            "race": "tiefling"
        },
        {
            "id": "summon_imp",
            "name": "Summon Imp",
            "tier": 4,
            "cost": 20,
            "staminaCost": 10,
            "desc": "Action: Summon imp familiar (fights alongside you for 5 rounds)",
            "icon": "👺",
            "prerequisites": {
                "type": "AND",
                "skills": [
                    "devils_bargain"
                ]
            },
            "race": "tiefling"
        },
        {
            "id": "infernal_dominion",
            "name": "Infernal Dominion",
            "tier": 5,
            "cost": 25,
            "staminaCost": 12,
            "desc": "Ultimate: Create 30ft radius hellish terrain for 5 turns (enemies take 1d8 fire damage when in terrain, allies gain Enhanced Effect while in terrain)",
            "icon": "🔥",
            "prerequisites": {
                "type": "AND",
                "skills": [
                    "summon_imp"
                ]
            },
            "race": "tiefling"
        }
    ],
    "drow": [
        {
            "id": "shadow_affinity",
            "name": "Shadow Affinity",
            "tier": 1,
            "cost": 5,
            "staminaCost": 0,
            "desc": "Passive: +3 stealth in dim light or darkness, darkvision extends to 150ft",
            "icon": "🌑",
            "prerequisites": {
                "type": "NONE",
                "skills": []
            },
            "race": "drow",
            "specialEffects": [
                "shadow_affinity_passive"
            ]
        },
        {
            "id": "drow_poison",
            "name": "Drow Poison",
            "tier": 2,
            "cost": 10,
            "staminaCost": 3,
            "desc": "Enhancement: Coat weapons with drow poison for entire combat encounter (medium chance of Daze (Incapacitated) effect + 1d4 poison damage)",
            "icon": "☠️",
            "prerequisites": {
                "type": "AND",
                "skills": [
                    "shadow_affinity"
                ]
            },
            "race": "drow"
        },
        {
            "id": "darkness_spell",
            "name": "Darkness",
            "tier": 3,
            "cost": 15,
            "staminaCost": 8,
            "desc": "Spell: Create 20ft radius of magical darkness for 3 turns (only you can see inside)",
            "icon": "⚫",
            "prerequisites": {
                "type": "AND",
                "skills": [
                    "drow_poison"
                ]
            },
            "race": "drow"
        },
        {
            "id": "spider_climb",
            "name": "Spider Climb",
            "tier": 4,
            "cost": 20,
            "staminaCost": 6,
            "desc": "Action: Walk on walls and ceilings for 10 rounds (normal movement speed)",
            "icon": "🕷️",
            "prerequisites": {
                "type": "AND",
                "skills": [
                    "darkness_spell"
                ]
            },
            "race": "drow"
        },
        {
            "id": "drow_matron",
            "name": "Drow Matron Magic",
            "tier": 5,
            "cost": 25,
            "staminaCost": 15,
            "desc": "Ultimate: Summon 3 \"shadows\" to fight for you until the end of combat",
            "icon": "👸",
            "prerequisites": {
                "type": "AND",
                "skills": [
                    "spider_climb"
                ]
            },
            "race": "drow"
        }
    ],
    "gnoll": [
        {
            "id": "pack_coordination",
            "name": "Pack Coordination",
            "tier": 1,
            "cost": 5,
            "staminaCost": 0,
            "desc": "Passive: When ally hits same target, your next attack gains +2 damage",
            "icon": "🐺",
            "prerequisites": {
                "type": "NONE",
                "skills": []
            },
            "race": "gnoll"
        },
        {
            "id": "savage_bite",
            "name": "Savage Bite",
            "tier": 2,
            "cost": 10,
            "staminaCost": 4,
            "desc": "Action: Bite attack (1d8 + Strength, applies Poison)",
            "icon": "🦷",
            "prerequisites": {
                "type": "AND",
                "skills": [
                    "pack_coordination"
                ]
            },
            "race": "gnoll"
        },
        {
            "id": "howl_of_the_pack",
            "name": "Howl of the Pack",
            "tier": 3,
            "cost": 15,
            "staminaCost": 6,
            "desc": "Action: Rally allies within 30ft (+2 damage for 5 turns, immune to Mind Control)",
            "icon": "🌙",
            "prerequisites": {
                "type": "AND",
                "skills": [
                    "savage_bite"
                ]
            },
            "race": "gnoll"
        },
        {
            "id": "rampage",
            "name": "Rampage",
            "tier": 4,
            "cost": 20,
            "staminaCost": 8,
            "desc": "Trigger: When you kill an enemy, immediately move and attack another",
            "icon": "⚡",
            "prerequisites": {
                "type": "AND",
                "skills": [
                    "howl_of_the_pack"
                ]
            },
            "race": "gnoll"
        },
        {
            "id": "alpha_dominance",
            "name": "Alpha Dominance",
            "tier": 5,
            "cost": 25,
            "staminaCost": 12,
            "desc": "Ultimate: All allies gain Pack Coordination and Rampage for 10 turns",
            "icon": "👑",
            "prerequisites": {
                "type": "AND",
                "skills": [
                    "rampage"
                ]
            },
            "race": "gnoll"
        }
    ]
};

    window.RACES_DATA = RACES_DATA;
    window.RACE_SKILL_TREES = RACE_SKILL_TREES;
    console.log('RACES_DATA loaded successfully:', Object.keys(RACES_DATA));
    console.log('RACE_SKILL_TREES loaded successfully:', Object.keys(RACE_SKILL_TREES));
} catch (error) {
    console.error('Error loading races data:', error);
}
