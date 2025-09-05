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
                "Keen Senses: +1 Accuracy when using a bow",
                "Magical Affinity: +1 Magic Power when using staves",
                "Elven Longevity: Immune to Cursed and Poison status effects"
            ],
            statModifiers: {
                magicPower: 1,
                accuracy: 1
            },
            exclusiveSkills: ["elven_accuracy", "forest_step", "moonbeam", "elven_high_magic", "starlight_mastery"]
        },

        dwarf: {
            id: "dwarf",
            name: "Dwarf",
            icon: "🧔",
            description: "Masters of Craft and Stone with natural resilience, stone sense, and craftsman heritage.",
            passiveTraits: [
                "Stone Sense: Can detect traps, secret doors, and structural weaknesses",
                "Dwarven Resilience: Immune to Poison status effects",
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
                "Small & Nimble: Can move through other creature spaces, Enemies have disadvantage to hit when doing an opportunity attack on you",
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
                "Savage Critical: Rolls of 18-20 are considered Critical Hits and deal +1 extra damage die",
                "Relentless Endurance: When reduced to 0 HP, drop to 1 HP instead (once per day)",
                "Powerful Build: additional +1 Strength"
            ],
            statModifiers: {
                strength: 3,
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
                "Versatile Learning: All Weapon beginner skills are unlocked upon creation",
                "Ambitious Spirit: Can choose to go first in initiative (Only one human per team can use this per combat)",
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
                "Draconic Heritage: Choose elemental affinity (Fire/Ice/Lightning/Acid/Wind/Light/Dark)",
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
                "Savage Instincts: +1 Physical damage against enemies below 50% HP"
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
        elf: [
            // Tier 1
            {
                id: 'elven_accuracy',
                name: 'Elven Accuracy',
                tier: 1,
                cost: 5,
                staminaCost: 0,
                desc: 'Passive: +1 accuracy when Bow or Staff weapons are equipped',
                icon: '🎯',
                prerequisites: { type: 'NONE', skills: [] },
                race: 'elf'
            },
            // Tier 2  
            {
                id: 'forest_step',
                name: 'Forest Step',
                tier: 2,
                cost: 10,
                staminaCost: 3,
                desc: 'Action: Move through natural terrain without movement penalty, gain advantage on rolls to stay hidden in forests',
                icon: '🌲',
                prerequisites: { type: 'AND', skills: ['elven_accuracy'] },
                race: 'elf'
            },
            // Tier 3
            {
                id: 'moonbeam',
                name: 'Moonbeam',
                tier: 3,
                cost: 15,
                staminaCost: 6,
                desc: 'Spell: Create beam of silver light (2d6 light damage + reveals invisible enemies)',
                icon: '🌙',
                prerequisites: { type: 'AND', skills: ['forest_step'] },
                race: 'elf'
            },
            // Tier 4
            {
                id: 'elven_high_magic',
                name: 'Elven High Magic',
                tier: 4,
                cost: 20,
                staminaCost: 0,
                desc: 'Passive: All spells cost -1 stamina (minimum 1), immune to magical charm effects',
                icon: '✨',
                prerequisites: { type: 'AND', skills: ['moonbeam'] },
                race: 'elf'
            },
            // Tier 5
            {
                id: 'starlight_mastery',
                name: 'Starlight Mastery',
                tier: 5,
                cost: 25,
                staminaCost: 12,
                desc: 'Ultimate: Summon starfall in 30ft radius (4d8 light damage, heals allies 2d6 HP)',
                icon: '⭐',
                prerequisites: { type: 'AND', skills: ['elven_high_magic'] },
                race: 'elf'
            }
        ],

        dwarf: [
            // Tier 1
            {
                id: 'dwarven_toughness',
                name: 'Dwarven Toughness',
                tier: 1,
                cost: 5,
                staminaCost: 0,
                desc: 'Passive: +5 HP, resistance to knockdown effects',
                icon: '💪',
                prerequisites: { type: 'NONE', skills: [] },
                race: 'dwarf'
            },
            // Tier 2
            {
                id: 'forge_blessing',
                name: 'Forge Blessing',
                tier: 2,
                cost: 10,
                staminaCost: 0,
                desc: 'Passive: Crafted weapons/armor gain +1 enchantment slot and +1 to all crafted item stats',
                icon: '🔨',
                prerequisites: { type: 'AND', skills: ['dwarven_toughness'] },
                race: 'dwarf'
            },
            // Tier 3
            {
                id: 'mountain_charge',
                name: 'Mountain Charge',
                tier: 3,
                cost: 15,
                staminaCost: 5,
                desc: 'Action: Charge 20ft ignoring difficult terrain (+3 Physical damage, knockdown on hit)',
                icon: '🏔️',
                prerequisites: { type: 'AND', skills: ['forge_blessing'] },
                race: 'dwarf'
            },
            // Tier 4
            {
                id: 'runic_weapon',
                name: 'Runic Weapon',
                tier: 4,
                cost: 20,
                staminaCost: 8,
                desc: 'Toggle: Inscribe runes on weapon (+1d6 damage, bypasses Elemental resistances) Costs 8 Stamina to activate, 2 Stamina per turn to maintain',
                icon: '🔤',
                prerequisites: { type: 'AND', skills: ['mountain_charge'] },
                race: 'dwarf'
            },
            // Tier 5
            {
                id: 'ancestral_might',
                name: 'Ancestral Might',
                tier: 5,
                cost: 25,
                staminaCost: 10,
                desc: 'Toggle: Channel ancient dwarven spirits (+4 Strength, +3 Physical Defence) Costs 10 Stamina to activate, 5 Stamina per turn to maintain',
                icon: '👑',
                prerequisites: { type: 'AND', skills: ['runic_weapon'] },
                race: 'dwarf'
            }
        ],

        halfling: [
            // Tier 1
            {
                id: 'lucky_dodge',
                name: 'Lucky Dodge',
                tier: 1,
                cost: 5,
                staminaCost: 3,
                desc: 'Reaction: Force an enemy\'s attack to reroll (once per attack)',
                icon: '🍀',
                prerequisites: { type: 'NONE', skills: [] },
                race: 'halfling'
            },
            // Tier 2
            {
                id: 'sneaky_strike',
                name: 'Sneaky Strike',
                tier: 2,
                cost: 10,
                staminaCost: 4,
                desc: 'Action: Attack from stealth gains +3 accuracy',
                icon: '🤫',
                prerequisites: { type: 'AND', skills: ['lucky_dodge'] },
                race: 'halfling'
            },
            // Tier 3
            {
                id: 'fortune_favor',
                name: 'Fortune\'s Favor',
                tier: 3,
                cost: 15,
                staminaCost: 6,
                desc: 'Action: Grant luck to ally (next 3 rolls are advantage) or curse enemy (disadvantage)',
                icon: '🎲',
                prerequisites: { type: 'AND', skills: ['sneaky_strike'] },
                race: 'halfling'
            },
            // Tier 4
            {
                id: 'miraculous_escape',
                name: 'Miraculous Escape',
                tier: 4,
                cost: 20,
                staminaCost: 8,
                desc: 'Reaction: When reduced to 0 HP, teleport to safety with 1 HP (once per day)',
                icon: '💨',
                prerequisites: { type: 'AND', skills: ['fortune_favor'] },
                race: 'halfling'
            },
            // Tier 5
            {
                id: 'legendary_luck',
                name: 'Legendary Luck',
                tier: 5,
                cost: 25,
                staminaCost: 0,
                desc: 'Passive: Reroll any failed resistance check or critical failure, allies within 10ft gain the same effect',
                icon: '⭐',
                prerequisites: { type: 'AND', skills: ['miraculous_escape'] },
                race: 'halfling'
            }
        ],

        orc: [
            // Tier 1
            {
                id: 'orcish_fury',
                name: 'Orcish Fury',
                tier: 1,
                cost: 5,
                staminaCost: 3,
                desc: 'Action: Next attack deals +1d6 damage and gains advantage',
                icon: '😡',
                prerequisites: { type: 'NONE', skills: [] },
                race: 'orc'
            },
            // Tier 2
            {
                id: 'intimidating_roar',
                name: 'Intimidating Roar',
                tier: 2,
                cost: 10,
                staminaCost: 4,
                desc: 'Action: 15ft cone, apply Mind Control (fear variant) for 2 turns',
                icon: '🦁',
                prerequisites: { type: 'AND', skills: ['orcish_fury'] },
                race: 'orc'
            },
            // Tier 3
            {
                id: 'blood_frenzy',
                name: 'Blood Frenzy',
                tier: 3,
                cost: 15,
                staminaCost: 0,
                desc: 'Passive: When an enemy dies within 30ft, gain +2 Physical damage for rest of combat (stackable up to +10 damage)',
                icon: '🩸',
                prerequisites: { type: 'AND', skills: ['intimidating_roar'] },
                race: 'orc'
            },
            // Tier 4
            {
                id: 'unstoppable_charge',
                name: 'Unstoppable Charge',
                tier: 4,
                cost: 20,
                staminaCost: 8,
                desc: 'Action: Charge through multiple enemies (each takes 2d6)',
                icon: '🐂',
                prerequisites: { type: 'AND', skills: ['blood_frenzy'] },
                race: 'orc'
            },
            // Tier 5
            {
                id: 'warchief_presence',
                name: 'Warchief Presence',
                tier: 5,
                cost: 25,
                staminaCost: 10,
                desc: 'Aura: Allies within 20ft gain +2 Physical damage and immunity to fear effects',
                icon: '👑',
                prerequisites: { type: 'AND', skills: ['unstoppable_charge'] },
                race: 'orc'
            }
        ],

        human: [
            // Tier 1 - Human's unique foundation skill
            {
                id: 'human_determination',
                name: 'Human Determination',
                tier: 1,
                cost: 5,
                staminaCost: 0,
                desc: 'Passive: When your health drops below 5HP, gain +1 Physical and Magical Defence. Unlocks Cross-Cultural Learning.',
                icon: '�',
                prerequisites: { type: 'NONE', skills: [] },
                race: 'human'
            }
            // Humans develop through Cross-Cultural Learning rather than their own advanced techniques
        ],

        dragonborn: [
            // Tier 1
            {
                id: 'breath_weapon',
                name: 'Draconic Breath',
                tier: 1,
                cost: 5,
                staminaCost: 10,
                desc: 'Action: 15ft cone of chosen element (2d6 + low chance of status effect based on element)',
                icon: '🔥',
                prerequisites: { type: 'NONE', skills: [] },
                race: 'dragonborn'
            },
            // Tier 2
            {
                id: 'draconic_presence',
                name: 'Draconic Presence',
                tier: 2,
                cost: 10,
                staminaCost: 4,
                desc: 'Action: Project intimidating aura (enemies within 10ft must resist fear)',
                icon: '👁️',
                prerequisites: { type: 'AND', skills: ['breath_weapon'] },
                race: 'dragonborn'
            },
            // Tier 3
            {
                id: 'elemental_mastery',
                name: 'Elemental Mastery',
                tier: 3,
                cost: 15,
                staminaCost: 0,
                desc: 'Passive: All attacks deal +1d4 elemental damage of chosen element, immunity to said element',
                icon: '⚡',
                prerequisites: { type: 'AND', skills: ['draconic_presence'] },
                race: 'dragonborn'
            },
            // Tier 4
            {
                id: 'dragon_wings',
                name: 'Dragon Wings',
                tier: 4,
                cost: 20,
                staminaCost: 5,
                desc: 'Toggle: Manifest wings for flight (60ft speed, lasts 10 minutes)',
                icon: '🦅',
                prerequisites: { type: 'AND', skills: ['elemental_mastery'] },
                race: 'dragonborn'
            },
            // Tier 5
            {
                id: 'ancient_fury',
                name: 'Ancient Fury',
                tier: 5,
                cost: 25,
                staminaCost: 15,
                desc: 'Ultimate: Channel ancient dragon (30ft breath, 4d8 damage, + high chance of status effect based on element)',
                icon: '🐲',
                prerequisites: { type: 'AND', skills: ['dragon_wings'] },
                race: 'dragonborn'
            }
        ],

        tiefling: [
            // Tier 1
            {
                id: 'hellish_rebuke',
                name: 'Hellish Rebuke',
                tier: 1,
                cost: 5,
                staminaCost: 4,
                desc: 'Reaction: When damaged, attacker takes 1d6 fire damage',
                icon: '🔥',
                prerequisites: { type: 'NONE', skills: [] },
                race: 'tiefling'
            },
            // Tier 2
            {
                id: 'infernal_constitution',
                name: 'Infernal Constitution',
                tier: 2,
                cost: 10,
                staminaCost: 0,
                desc: 'Passive: Resistance to Darkness elemental damage, +2 max stamina',
                icon: '😈',
                prerequisites: { type: 'AND', skills: ['hellish_rebuke'] },
                race: 'tiefling'
            },
            // Tier 3
            {
                id: 'devils_bargain',
                name: 'Devil\'s Bargain',
                tier: 3,
                cost: 15,
                staminaCost: 8,
                desc: 'Action: Offer deal to enemy (they take -2 to all rolls but you take +1 Physical damage from them)',
                icon: '📜',
                prerequisites: { type: 'AND', skills: ['infernal_constitution'] },
                race: 'tiefling'
            },
            // Tier 4
            {
                id: 'summon_imp',
                name: 'Summon Imp',
                tier: 4,
                cost: 20,
                staminaCost: 10,
                desc: 'Action: Summon imp familiar (fights alongside you for 5 minutes)',
                icon: '👺',
                prerequisites: { type: 'AND', skills: ['devils_bargain'] },
                race: 'tiefling'
            },
            // Tier 5
            {
                id: 'infernal_dominion',
                name: 'Infernal Dominion',
                tier: 5,
                cost: 25,
                staminaCost: 12,
                desc: 'Ultimate: Create 30ft radius hellish terrain for 5 turns (enemies take 1d8 fire damage when in terrain, allies gain +2 Physical damage while in terrain)',
                icon: '🔥',
                prerequisites: { type: 'AND', skills: ['summon_imp'] },
                race: 'tiefling'
            }
        ],

        drow: [
            // Tier 1
            {
                id: 'shadow_affinity',
                name: 'Shadow Affinity',
                tier: 1,
                cost: 5,
                staminaCost: 0,
                desc: 'Passive: +3 damage with Darkness Magic skills, darkvision extends to 150ft',
                icon: '🌑',
                prerequisites: { type: 'NONE', skills: [] },
                race: 'drow'
            },
            // Tier 2
            {
                id: 'drow_poison',
                name: 'Drow Poison',
                tier: 2,
                cost: 10,
                staminaCost: 3,
                desc: 'Toggle: Coat weapons with drow poison for entire combat encounter (medium chance of Daze effect + 1d4 poison damage) Costs 3 Stamina to activate, 1 Stamina per turn to maintain',
                icon: '☠️',
                prerequisites: { type: 'AND', skills: ['shadow_affinity'] },
                race: 'drow'
            },
            // Tier 3
            {
                id: 'darkness_spell',
                name: 'Darkness',
                tier: 3,
                cost: 15,
                staminaCost: 8,
                desc: 'Spell: Create 20ft radius of magical darkness for 3 turns (only you can see inside)',
                icon: '⚫',
                prerequisites: { type: 'AND', skills: ['drow_poison'] },
                race: 'drow'
            },
            // Tier 4
            {
                id: 'spider_climb',
                name: 'Spider Climb',
                tier: 4,
                cost: 20,
                staminaCost: 6,
                desc: 'Action: Walk on walls and ceilings for 10 minutes (normal movement speed)',
                icon: '🕷️',
                prerequisites: { type: 'AND', skills: ['darkness_spell'] },
                race: 'drow'
            },
            // Tier 5
            {
                id: 'drow_matron',
                name: 'Drow Matron Magic',
                tier: 5,
                cost: 25,
                staminaCost: 15,
                desc: 'Ultimate: Summon 3 "shadows" to fight for you until the end of combat',
                icon: '👸',
                prerequisites: { type: 'AND', skills: ['spider_climb'] },
                race: 'drow'
            }
        ],

        gnoll: [
            // Tier 1
            {
                id: 'pack_coordination',
                name: 'Pack Coordination',
                tier: 1,
                cost: 5,
                staminaCost: 0,
                desc: 'Passive: When ally hits same target, your next attack gains +2 Physical damage',
                icon: '🐺',
                prerequisites: { type: 'NONE', skills: [] },
                race: 'gnoll'
            },
            // Tier 2
            {
                id: 'savage_bite',
                name: 'Savage Bite',
                tier: 2,
                cost: 10,
                staminaCost: 4,
                desc: 'Action: Bite attack (1d8 + Strength, applies Poison)',
                icon: '🦷',
                prerequisites: { type: 'AND', skills: ['pack_coordination'] },
                race: 'gnoll'
            },
            // Tier 3
            {
                id: 'howl_of_the_pack',
                name: 'Howl of the Pack',
                tier: 3,
                cost: 15,
                staminaCost: 6,
                desc: 'Action: Rally allies within 30ft (+2 Physical damage for 5 turns, immune to Mind Control)',
                icon: '🌙',
                prerequisites: { type: 'AND', skills: ['savage_bite'] },
                race: 'gnoll'
            },
            // Tier 4
            {
                id: 'rampage',
                name: 'Rampage',
                tier: 4,
                cost: 20,
                staminaCost: 8,
                desc: 'Trigger: When you kill an enemy, immediately move and attack another',
                icon: '⚡',
                prerequisites: { type: 'AND', skills: ['howl_of_the_pack'] },
                race: 'gnoll'
            },
            // Tier 5
            {
                id: 'alpha_dominance',
                name: 'Alpha Dominance',
                tier: 5,
                cost: 25,
                staminaCost: 12,
                desc: 'Ultimate: All allies gain Pack Coordination and Rampage for 10 turns',
                icon: '👑',
                prerequisites: { type: 'AND', skills: ['rampage'] },
                race: 'gnoll'
            }
        ]
    }

    // Helper function to get all racial skills
    function getAllRacialSkills() {
        const allSkills = []
        for (const raceSkills of Object.values(RACE_SKILL_TREES)) {
            allSkills.push(...raceSkills)
        }
        return allSkills
    }

    // Helper function to get skills for a specific race
    function getSkillsForRace(raceId) {
        const raceKey = raceId === 'elf' ? 'elven' :
            raceId === 'dwarf' ? 'dwarven' :
                raceId === 'orc' ? 'orcish' :
                    raceId
        return RACE_SKILL_TREES[raceKey] || []
    }

    // Export for use in other files
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = { RACES_DATA, RACE_SKILL_TREES, getAllRacialSkills, getSkillsForRace }
    }

    console.log('RACES_DATA loaded successfully:', Object.keys(RACES_DATA))
    console.log('RACE_SKILL_TREES loaded successfully:', Object.keys(RACE_SKILL_TREES))

    // Ensure global access both ways for compatibility
    window.RACES_DATA = RACES_DATA
    window.RACE_SKILL_TREES = RACE_SKILL_TREES

    // Also make available as global variables for scripts loaded after
    if (typeof globalThis !== 'undefined') {
        globalThis.RACES_DATA = RACES_DATA
        globalThis.RACE_SKILL_TREES = RACE_SKILL_TREES
    }
} catch (error) {
    console.error('Error loading races data:', error)
    // Provide fallback
    window.RACES_DATA = {}
    window.RACE_SKILL_TREES = {}
}
