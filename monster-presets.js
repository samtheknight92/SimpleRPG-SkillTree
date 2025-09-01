// Monster Presets System - Handles monster preset definitions and management
class MonsterPresets {
    constructor() {
        this.storageKey = 'rpg_monster_presets'
        this.presetIdCounter = Date.now() // Simple ID generation
    }

    // Built-in monster presets
    getBuiltInPresets() {
        return [
            {
                id: 'goblin_warrior',
                name: 'Goblin Warrior',
                description: 'A basic melee monster with sword skills and light armor',
                builtIn: true,
                stats: {
                    hp: 12,
                    stamina: 12,
                    strength: -1,
                    magicPower: -3,
                    speed: 4,
                    physicalDefence: 10,
                    magicalDefence: 8,
                    accuracy: -1
                },
                unlockedSkills: {
                    weapons: {
                        sword: ['sword_basics', 'quick_strike'],
                        ranged: [],
                        axe: [],
                        staff: [],
                        dagger: [],
                        polearm: [],
                        hammer: []
                    },
                    magic: {
                        fire: [],
                        ice: [],
                        lightning: [],
                        earth: [],
                        wind: [],
                        water: [],
                        darkness: [],
                        light: []
                    },
                    professions: {
                        smithing: [],
                        alchemy: [],
                        enchanting: [],
                        cooking: [],
                        archaeology: [],
                        herbalism: []
                    },
                    monster: {
                        combat: ['claws', 'bite_attack'],
                        defense: ['tough_skin'],
                        magic: [],
                        utility: []
                    },
                    fusion: {
                        ranged_magic: [],
                        melee_magic: [],
                        utility_combat: [],
                        monster_fusion: [],
                        pure_magic: []
                    }
                },
                currency: { Gil: 10 },
                isMonster: true
            },
            {
                id: 'fire_mage',
                name: 'Fire Mage',
                description: 'A spellcaster specializing in fire magic',
                builtIn: true,
                stats: {
                    hp: 10,
                    stamina: 15,
                    strength: -3,
                    magicPower: 2,
                    speed: 2,
                    physicalDefence: 8,
                    magicalDefence: 12,
                    accuracy: 0
                },
                unlockedSkills: {
                    weapons: {
                        sword: [],
                        ranged: [],
                        axe: [],
                        staff: ['staff_basics', 'spell_power'],
                        dagger: [],
                        polearm: [],
                        hammer: []
                    },
                    magic: {
                        fire: ['fire_spark', 'fireball', 'fire_mastery'],
                        ice: [],
                        lightning: [],
                        earth: [],
                        wind: [],
                        water: [],
                        darkness: [],
                        light: []
                    },
                    professions: {
                        smithing: [],
                        alchemy: [],
                        enchanting: [],
                        cooking: [],
                        archaeology: [],
                        herbalism: []
                    },
                    monster: {
                        magic: ['fire_breath', 'fear_aura'],
                        defense: [],
                        combat: [],
                        utility: ['echolocation']
                    },
                    fusion: {
                        ranged_magic: [],
                        melee_magic: [],
                        utility_combat: [],
                        monster_fusion: [],
                        pure_magic: []
                    }
                },
                currency: { Gil: 105 },
                isMonster: true
            },
            {
                id: 'armored_guard',
                name: 'Armored Guard',
                description: 'A heavily defended warrior with strong defensive capabilities',
                builtIn: true,
                stats: {
                    hp: 15,
                    stamina: 12,
                    strength: 0,
                    magicPower: -3,
                    speed: 2,
                    physicalDefence: 14,
                    magicalDefence: 8,
                    accuracy: -2
                },
                unlockedSkills: {
                    weapons: {
                        sword: ['sword_basics', 'sword_stance', 'parry'],
                        ranged: [],
                        axe: [],
                        staff: [],
                        dagger: [],
                        polearm: [],
                        hammer: []
                    },
                    magic: {
                        fire: [],
                        ice: [],
                        lightning: [],
                        earth: [],
                        wind: [],
                        water: [],
                        darkness: [],
                        light: []
                    },
                    professions: {
                        smithing: [],
                        alchemy: [],
                        enchanting: [],
                        cooking: [],
                        archaeology: [],
                        herbalism: []
                    },
                    monster: {
                        defense: ['tough_skin', 'rock_skin', 'metal_skin'],
                        combat: ['monster_charge_attack', 'rend'],
                        magic: [],
                        utility: []
                    },
                    fusion: {
                        ranged_magic: [],
                        melee_magic: [],
                        utility_combat: [],
                        monster_fusion: [],
                        pure_magic: []
                    }
                },
                currency: { Gil: 208 },
                isMonster: true
            },
            {
                id: 'swift_assassin',
                name: 'Swift Assassin',
                description: 'A fast, agile monster with dagger skills and stealth abilities',
                builtIn: true,
                stats: {
                    hp: 10,
                    stamina: 15,
                    strength: -1,
                    magicPower: -2,
                    speed: 6,
                    physicalDefence: 8,
                    magicalDefence: 8,
                    accuracy: 2
                },
                unlockedSkills: {
                    weapons: {
                        sword: [],
                        ranged: [],
                        axe: [],
                        staff: [],
                        dagger: ['dagger_basics', 'light_step', 'dual_wield'],
                        polearm: [],
                        hammer: []
                    },
                    magic: {
                        fire: [],
                        ice: [],
                        lightning: [],
                        earth: [],
                        wind: [],
                        water: [],
                        darkness: [],
                        light: []
                    },
                    professions: {
                        smithing: [],
                        alchemy: [],
                        enchanting: [],
                        cooking: [],
                        archaeology: [],
                        herbalism: []
                    },
                    monster: {
                        utility: ['camouflage', 'climb'],
                        combat: ['venomous_claws', 'pounce'],
                        defense: [],
                        magic: []
                    },
                    fusion: {
                        ranged_magic: [],
                        melee_magic: [],
                        utility_combat: [],
                        monster_fusion: [],
                        pure_magic: []
                    }
                },
                currency: { Gil: 156 },
                isMonster: true
            },
            {
                id: 'ice_elemental',
                name: 'Ice Elemental',
                description: 'A magical creature with powerful ice magic and frost abilities',
                builtIn: true,
                stats: {
                    hp: 12,
                    stamina: 15,
                    strength: -2,
                    magicPower: 3,
                    speed: 2,
                    physicalDefence: 8,
                    magicalDefence: 14,
                    accuracy: 0
                },
                unlockedSkills: {
                    weapons: {
                        sword: [],
                        ranged: [],
                        axe: [],
                        staff: ['staff_basics', 'spell_power'],
                        dagger: [],
                        polearm: [],
                        hammer: []
                    },
                    magic: {
                        fire: [],
                        ice: ['frost_touch', 'ice_shard', 'freeze', 'ice_mastery'],
                        lightning: [],
                        earth: [],
                        wind: [],
                        water: [],
                        darkness: [],
                        light: []
                    },
                    professions: {
                        smithing: [],
                        alchemy: [],
                        enchanting: [],
                        cooking: [],
                        archaeology: [],
                        herbalism: []
                    },
                    monster: {
                        magic: ['ice_breath', 'teleport', 'paralyzing_gaze'],
                        defense: ['magical_resistance'],
                        combat: [],
                        utility: []
                    },
                    fusion: {
                        ranged_magic: [],
                        melee_magic: [],
                        utility_combat: [],
                        monster_fusion: [],
                        pure_magic: []
                    }
                },
                currency: { Gil: 312 },
                isMonster: true
            },

            // ADDITIONAL MONSTER VARIETY (weak to strong)
            {
                id: 'feral_rat',
                name: 'Feral Rat',
                description: 'A diseased and aggressive rat - the weakest of monsters',
                builtIn: true,
                stats: {
                    hp: 8,
                    stamina: 8,
                    strength: -2,
                    magicPower: -3,
                    speed: 4,
                    physicalDefence: 8,
                    magicalDefence: 8,
                    accuracy: -2
                },
                unlockedSkills: {
                    weapons: {
                        sword: [],
                        ranged: [],
                        axe: [],
                        staff: [],
                        dagger: [],
                        polearm: [],
                        hammer: []
                    },
                    magic: {
                        fire: [],
                        ice: [],
                        lightning: [],
                        earth: [],
                        wind: [],
                        water: [],
                        darkness: [],
                        light: []
                    },
                    professions: {
                        smithing: [],
                        alchemy: [],
                        enchanting: [],
                        cooking: [],
                        archaeology: [],
                        herbalism: []
                    },
                    monster: {
                        combat: ['bite_attack'],
                        defense: [],
                        magic: [],
                        utility: []
                    },
                    fusion: {
                        ranged_magic: [],
                        melee_magic: [],
                        utility_combat: [],
                        monster_fusion: [],
                        pure_magic: []
                    }
                },
                currency: { Gil: 2 },
                isMonster: true
            },
            {
                id: 'goblin_scout',
                name: 'Goblin Scout',
                description: 'A young, inexperienced goblin - weaker than a warrior',
                builtIn: true,
                stats: {
                    hp: 10,
                    stamina: 10,
                    strength: -2,
                    magicPower: -3,
                    speed: 4,
                    physicalDefence: 8,
                    magicalDefence: 8,
                    accuracy: 0
                },
                unlockedSkills: {
                    weapons: {
                        sword: [],
                        ranged: ['ranged_basics'],
                        axe: [],
                        staff: [],
                        dagger: ['dagger_basics'],
                        polearm: [],
                        hammer: []
                    },
                    magic: {
                        fire: [],
                        ice: [],
                        lightning: [],
                        earth: [],
                        wind: [],
                        water: [],
                        darkness: [],
                        light: []
                    },
                    professions: {
                        smithing: [],
                        alchemy: [],
                        enchanting: [],
                        cooking: [],
                        archaeology: [],
                        herbalism: []
                    },
                    monster: {
                        combat: ['claws'],
                        defense: [],
                        magic: [],
                        utility: []
                    },
                    fusion: {
                        ranged_magic: [],
                        melee_magic: [],
                        utility_combat: [],
                        monster_fusion: [],
                        pure_magic: []
                    }
                },
                currency: { Gil: 6 },
                isMonster: true
            },
            {
                id: 'goblin_chief',
                name: 'Goblin Chief',
                description: 'A seasoned goblin leader with enhanced combat abilities',
                builtIn: true,
                stats: {
                    hp: 14,
                    stamina: 14,
                    strength: 1,
                    magicPower: 0,
                    speed: 3,
                    physicalDefence: 12,
                    magicalDefence: 10,
                    accuracy: 0
                },
                unlockedSkills: {
                    weapons: {
                        sword: ['sword_basics', 'quick_strike', 'sword_stance'],
                        ranged: [],
                        axe: ['axe_basics', 'heavy_swing'],
                        staff: [],
                        dagger: [],
                        polearm: [],
                        hammer: []
                    },
                    magic: {
                        fire: ['fire_spark'],
                        ice: [],
                        lightning: [],
                        earth: [],
                        wind: [],
                        water: [],
                        darkness: [],
                        light: []
                    },
                    professions: {
                        smithing: [],
                        alchemy: [],
                        enchanting: [],
                        cooking: [],
                        archaeology: [],
                        herbalism: []
                    },
                    monster: {
                        combat: ['claws', 'bite_attack', 'monster_charge_attack'],
                        defense: ['tough_skin'],
                        magic: ['roar'],
                        utility: []
                    },
                    fusion: {
                        ranged_magic: [],
                        melee_magic: [],
                        utility_combat: [],
                        monster_fusion: [],
                        pure_magic: []
                    }
                },
                currency: { Gil: 17 },
                isMonster: true
            },
            {
                id: 'skeletal_warrior',
                name: 'Skeletal Warrior',
                description: 'An undead soldier risen from the grave',
                builtIn: true,
                stats: {
                    hp: 12,
                    stamina: 12,
                    strength: 0,
                    magicPower: -2,
                    speed: 2,
                    physicalDefence: 12,
                    magicalDefence: 8,
                    accuracy: -1
                },
                unlockedSkills: {
                    weapons: {
                        sword: ['sword_basics', 'quick_strike'],
                        ranged: [],
                        axe: [],
                        staff: [],
                        dagger: [],
                        polearm: [],
                        hammer: []
                    },
                    magic: {
                        fire: [],
                        ice: [],
                        lightning: [],
                        earth: [],
                        wind: [],
                        water: [],
                        darkness: ['shadow_bolt'],
                        light: []
                    },
                    professions: {
                        smithing: [],
                        alchemy: [],
                        enchanting: [],
                        cooking: [],
                        archaeology: [],
                        herbalism: []
                    },
                    monster: {
                        combat: ['claws'],
                        defense: ['damage_reduction'],
                        magic: [],
                        utility: []
                    },
                    fusion: {
                        ranged_magic: [],
                        melee_magic: [],
                        utility_combat: [],
                        monster_fusion: [],
                        pure_magic: []
                    }
                },
                currency: { Gil: 12 },
                isMonster: true
            },
            {
                id: 'giant_spider',
                name: 'Giant Spider',
                description: 'A large arachnid with web attacks and venomous bite',
                builtIn: true,
                stats: {
                    hp: 12,
                    stamina: 12,
                    strength: -1,
                    magicPower: -1,
                    speed: 6,
                    physicalDefence: 8,
                    magicalDefence: 8,
                    accuracy: 2
                },
                unlockedSkills: {
                    weapons: {
                        sword: [],
                        ranged: [],
                        axe: [],
                        staff: [],
                        dagger: [],
                        polearm: [],
                        hammer: []
                    },
                    magic: {
                        fire: [],
                        ice: [],
                        lightning: [],
                        earth: [],
                        wind: [],
                        water: [],
                        darkness: [],
                        light: []
                    },
                    professions: {
                        smithing: [],
                        alchemy: [],
                        enchanting: [],
                        cooking: [],
                        archaeology: [],
                        herbalism: []
                    },
                    monster: {
                        combat: ['bite_attack', 'venomous_claws'],
                        defense: [],
                        magic: ['web_shot'],
                        utility: ['climb']
                    },
                    fusion: {
                        ranged_magic: [],
                        melee_magic: [],
                        utility_combat: [],
                        monster_fusion: [],
                        pure_magic: []
                    }
                },
                currency: { Gil: 11 },
                isMonster: true
            },
            {
                id: 'orc_berserker',
                name: 'Orc Berserker',
                description: 'A fierce orc warrior driven by battle fury',
                builtIn: true,
                stats: {
                    hp: 16,
                    stamina: 14,
                    strength: 3,
                    magicPower: -3,
                    speed: 3,
                    physicalDefence: 12,
                    magicalDefence: 8,
                    accuracy: -1
                },
                unlockedSkills: {
                    weapons: {
                        sword: [],
                        ranged: [],
                        axe: ['axe_basics', 'heavy_swing', 'cleave'],
                        staff: [],
                        dagger: [],
                        polearm: [],
                        hammer: []
                    },
                    magic: {
                        fire: [],
                        ice: [],
                        lightning: [],
                        earth: [],
                        wind: [],
                        water: [],
                        darkness: [],
                        light: []
                    },
                    professions: {
                        smithing: [],
                        alchemy: [],
                        enchanting: [],
                        cooking: [],
                        archaeology: [],
                        herbalism: []
                    },
                    monster: {
                        combat: ['claws', 'monster_berserker_rage'],
                        defense: ['tough_skin'],
                        magic: ['roar'],
                        utility: []
                    },
                    fusion: {
                        ranged_magic: [],
                        melee_magic: [],
                        utility_combat: [],
                        monster_fusion: [],
                        pure_magic: []
                    }
                },
                currency: { Gil: 18 },
                isMonster: true
            },

            // SUMMONED CREATURES (for Pack Leader skill)
            {
                id: 'dire_wolf',
                name: 'Dire Wolf',
                description: 'A large, fierce wolf summoned by Pack Leader - strong and loyal',
                builtIn: true,
                stats: {
                    hp: 12,
                    stamina: 12,
                    strength: 1,
                    magicPower: -2,
                    speed: 4,
                    physicalDefence: 8,
                    magicalDefence: 8,
                    accuracy: 1
                },
                unlockedSkills: {
                    weapons: {
                        sword: [],
                        ranged: [],
                        axe: [],
                        staff: [],
                        dagger: [],
                        polearm: [],
                        hammer: []
                    },
                    magic: {
                        fire: [],
                        ice: [],
                        lightning: [],
                        earth: [],
                        wind: [],
                        water: [],
                        darkness: [],
                        light: []
                    },
                    professions: {
                        smithing: [],
                        alchemy: [],
                        enchanting: [],
                        cooking: [],
                        archaeology: [],
                        herbalism: []
                    },
                    monster: {
                        combat: ['bite_attack', 'pounce'],
                        defense: ['tough_skin'],
                        magic: [],
                        utility: []
                    },
                    fusion: {
                        ranged_magic: [],
                        melee_magic: [],
                        utility_combat: [],
                        monster_fusion: [],
                        pure_magic: []
                    }
                },
                currency: { Gil: 10 },
                isMonster: true
            },
            {
                id: 'shadow_hound',
                name: 'Shadow Hound',
                description: 'A dark, stealthy creature summoned by Pack Leader - fast and sneaky',
                builtIn: true,
                stats: {
                    hp: 10,
                    stamina: 14,
                    strength: -1,
                    magicPower: 0,
                    speed: 6,
                    physicalDefence: 8,
                    magicalDefence: 8,
                    accuracy: 2
                },
                unlockedSkills: {
                    weapons: {
                        sword: [],
                        ranged: [],
                        axe: [],
                        staff: [],
                        dagger: [],
                        polearm: [],
                        hammer: []
                    },
                    magic: {
                        fire: [],
                        ice: [],
                        lightning: [],
                        earth: [],
                        wind: [],
                        water: [],
                        darkness: ['shadow_bolt'],
                        light: []
                    },
                    professions: {
                        smithing: [],
                        alchemy: [],
                        enchanting: [],
                        cooking: [],
                        archaeology: [],
                        herbalism: []
                    },
                    monster: {
                        utility: ['camouflage'],
                        combat: ['bite_attack'],
                        defense: [],
                        magic: []
                    },
                    fusion: {
                        ranged_magic: [],
                        melee_magic: [],
                        utility_combat: [],
                        monster_fusion: [],
                        pure_magic: []
                    }
                },
                currency: { Gil: 6 },
                isMonster: true
            },
            {
                id: 'earth_badger',
                name: 'Earth Badger',
                description: 'A sturdy burrowing creature summoned by Pack Leader - defensive and persistent',
                builtIn: true,
                stats: {
                    hp: 14,
                    stamina: 12,
                    strength: 0,
                    magicPower: -1,
                    speed: 2,
                    physicalDefence: 12,
                    magicalDefence: 8,
                    accuracy: 0
                },
                unlockedSkills: {
                    weapons: {
                        sword: [],
                        ranged: [],
                        axe: [],
                        staff: [],
                        dagger: [],
                        polearm: [],
                        hammer: []
                    },
                    magic: {
                        fire: [],
                        ice: [],
                        lightning: [],
                        earth: ['stone_spear'],
                        wind: [],
                        water: [],
                        darkness: [],
                        light: []
                    },
                    professions: {
                        smithing: [],
                        alchemy: [],
                        enchanting: [],
                        cooking: [],
                        archaeology: [],
                        herbalism: []
                    },
                    monster: {
                        defense: ['tough_skin', 'rock_skin'],
                        combat: ['claws'],
                        magic: [],
                        utility: ['burrow']
                    },
                    fusion: {
                        ranged_magic: [],
                        melee_magic: [],
                        utility_combat: [],
                        monster_fusion: [],
                        pure_magic: []
                    }
                },
                currency: { Gil: 7 },
                isMonster: true
            },
            {
                id: 'wind_sprite',
                name: 'Wind Sprite',
                description: 'A small aerial creature summoned by Pack Leader - fast and magical',
                builtIn: true,
                stats: {
                    hp: 8,
                    stamina: 15,
                    strength: -3,
                    magicPower: 2,
                    speed: 6,
                    physicalDefence: 8,
                    magicalDefence: 12,
                    accuracy: 3
                },
                unlockedSkills: {
                    weapons: {
                        sword: [],
                        ranged: [],
                        axe: [],
                        staff: [],
                        dagger: [],
                        polearm: [],
                        hammer: []
                    },
                    magic: {
                        fire: [],
                        ice: [],
                        lightning: ['spark'],
                        earth: [],
                        wind: ['gust', 'wind_blade'],
                        water: [],
                        darkness: [],
                        light: []
                    },
                    professions: {
                        smithing: [],
                        alchemy: [],
                        enchanting: [],
                        cooking: [],
                        archaeology: [],
                        herbalism: []
                    },
                    monster: {
                        magic: [],
                        defense: [],
                        combat: [],
                        utility: []
                    },
                    fusion: {
                        ranged_magic: [],
                        melee_magic: [],
                        utility_combat: [],
                        monster_fusion: [],
                        pure_magic: []
                    }
                },
                currency: { Gil: 5 },
                isMonster: true
            },
            {
                id: 'guardian_bear',
                name: 'Guardian Bear',
                description: 'A powerful summoned protector - the strongest Pack Leader creature',
                builtIn: true,
                stats: {
                    hp: 16,
                    stamina: 12,
                    strength: 2,
                    magicPower: -1,
                    speed: 3,
                    physicalDefence: 14,
                    magicalDefence: 8,
                    accuracy: 0
                },
                unlockedSkills: {
                    weapons: {
                        sword: [],
                        ranged: [],
                        axe: [],
                        staff: [],
                        dagger: [],
                        polearm: [],
                        hammer: []
                    },
                    magic: {
                        fire: [],
                        ice: [],
                        lightning: [],
                        earth: ['stone_spear'],
                        wind: [],
                        water: [],
                        darkness: [],
                        light: []
                    },
                    professions: {
                        smithing: [],
                        alchemy: [],
                        enchanting: [],
                        cooking: [],
                        archaeology: [],
                        herbalism: []
                    },
                    monster: {
                        combat: ['claws', 'bite_attack', 'rend'],
                        defense: ['tough_skin', 'rock_skin'],
                        magic: [],
                        utility: []
                    },
                    fusion: {
                        ranged_magic: [],
                        melee_magic: [],
                        utility_combat: [],
                        monster_fusion: [],
                        pure_magic: []
                    }
                },
                currency: { Gil: 12 },
                isMonster: true
            },

            // NEW HIGHER LEVEL MONSTERS
            {
                id: 'veteran_warrior',
                name: 'Veteran Warrior',
                description: 'A seasoned fighter with years of combat experience',
                builtIn: true,
                stats: {
                    hp: 16,
                    stamina: 14,
                    strength: 2,
                    magicPower: -2,
                    speed: 4,
                    physicalDefence: 12,
                    magicalDefence: 10,
                    accuracy: 1
                },
                unlockedSkills: {
                    weapons: {
                        sword: ['sword_basics', 'quick_strike', 'sword_stance', 'parry'],
                        ranged: [],
                        axe: ['axe_basics'],
                        staff: [],
                        dagger: [],
                        polearm: [],
                        hammer: []
                    },
                    magic: {
                        fire: [],
                        ice: [],
                        lightning: [],
                        earth: [],
                        wind: [],
                        water: [],
                        darkness: [],
                        light: []
                    },
                    professions: {
                        smithing: [],
                        alchemy: [],
                        enchanting: [],
                        cooking: [],
                        archaeology: [],
                        herbalism: []
                    },
                    monster: {
                        combat: ['claws', 'bite_attack', 'monster_charge_attack'],
                        defense: ['tough_skin', 'rock_skin'],
                        magic: ['roar'],
                        utility: []
                    },
                    fusion: {
                        ranged_magic: [],
                        melee_magic: [],
                        utility_combat: [],
                        monster_fusion: [],
                        pure_magic: []
                    }
                },
                currency: { Gil: 25 },
                isMonster: true
            },
            {
                id: 'battle_mage',
                name: 'Battle Mage',
                description: 'A warrior-mage hybrid with both combat and magical prowess',
                builtIn: true,
                stats: {
                    hp: 14,
                    stamina: 16,
                    strength: 1,
                    magicPower: 3,
                    speed: 3,
                    physicalDefence: 10,
                    magicalDefence: 14,
                    accuracy: 1
                },
                unlockedSkills: {
                    weapons: {
                        sword: ['sword_basics', 'quick_strike'],
                        ranged: [],
                        axe: [],
                        staff: ['staff_basics', 'spell_power'],
                        dagger: [],
                        polearm: [],
                        hammer: []
                    },
                    magic: {
                        fire: ['fire_spark', 'fireball'],
                        ice: ['frost_touch'],
                        lightning: ['spark'],
                        earth: [],
                        wind: [],
                        water: [],
                        darkness: [],
                        light: []
                    },
                    professions: {
                        smithing: [],
                        alchemy: [],
                        enchanting: [],
                        cooking: [],
                        archaeology: [],
                        herbalism: []
                    },
                    monster: {
                        combat: ['claws'],
                        defense: ['magical_resistance'],
                        magic: ['fire_breath', 'ice_breath'],
                        utility: []
                    },
                    fusion: {
                        ranged_magic: [],
                        melee_magic: [],
                        utility_combat: [],
                        monster_fusion: [],
                        pure_magic: []
                    }
                },
                currency: { Gil: 30 },
                isMonster: true
            },
            {
                id: 'elite_guard',
                name: 'Elite Guard',
                description: 'A highly trained defensive specialist with superior armor',
                builtIn: true,
                stats: {
                    hp: 18,
                    stamina: 16,
                    strength: 3,
                    magicPower: -1,
                    speed: 3,
                    physicalDefence: 16,
                    magicalDefence: 12,
                    accuracy: 0
                },
                unlockedSkills: {
                    weapons: {
                        sword: ['sword_basics', 'quick_strike', 'sword_stance', 'parry'],
                        ranged: [],
                        axe: ['axe_basics', 'heavy_swing'],
                        staff: [],
                        dagger: [],
                        polearm: ['polearm_basics'],
                        hammer: []
                    },
                    magic: {
                        fire: [],
                        ice: [],
                        lightning: [],
                        earth: [],
                        wind: [],
                        water: [],
                        darkness: [],
                        light: []
                    },
                    professions: {
                        smithing: [],
                        alchemy: [],
                        enchanting: [],
                        cooking: [],
                        archaeology: [],
                        herbalism: []
                    },
                    monster: {
                        combat: ['claws', 'bite_attack', 'monster_charge_attack', 'rend'],
                        defense: ['tough_skin', 'rock_skin', 'metal_skin'],
                        magic: ['roar'],
                        utility: []
                    },
                    fusion: {
                        ranged_magic: [],
                        melee_magic: [],
                        utility_combat: [],
                        monster_fusion: [],
                        pure_magic: []
                    }
                },
                currency: { Gil: 45 },
                isMonster: true
            },
            {
                id: 'shadow_assassin',
                name: 'Shadow Assassin',
                description: 'A deadly stealth specialist with advanced assassination techniques',
                builtIn: true,
                stats: {
                    hp: 12,
                    stamina: 18,
                    strength: 2,
                    magicPower: 1,
                    speed: 8,
                    physicalDefence: 10,
                    magicalDefence: 12,
                    accuracy: 4
                },
                unlockedSkills: {
                    weapons: {
                        sword: [],
                        ranged: [],
                        axe: [],
                        staff: [],
                        dagger: ['dagger_basics', 'light_step', 'dual_wield'],
                        polearm: [],
                        hammer: []
                    },
                    magic: {
                        fire: [],
                        ice: [],
                        lightning: [],
                        earth: [],
                        wind: [],
                        water: [],
                        darkness: ['shadow_bolt', 'shadow_step'],
                        light: []
                    },
                    professions: {
                        smithing: [],
                        alchemy: [],
                        enchanting: [],
                        cooking: [],
                        archaeology: [],
                        herbalism: []
                    },
                    monster: {
                        utility: ['camouflage', 'climb', 'stealth'],
                        combat: ['venomous_claws', 'pounce', 'backstab'],
                        defense: [],
                        magic: []
                    },
                    fusion: {
                        ranged_magic: [],
                        melee_magic: [],
                        utility_combat: [],
                        monster_fusion: [],
                        pure_magic: []
                    }
                },
                currency: { Gil: 50 },
                isMonster: true
            },
            {
                id: 'elemental_lord',
                name: 'Elemental Lord',
                description: 'A master of multiple elements with devastating magical power',
                builtIn: true,
                stats: {
                    hp: 16,
                    stamina: 18,
                    strength: -1,
                    magicPower: 6,
                    speed: 4,
                    physicalDefence: 10,
                    magicalDefence: 16,
                    accuracy: 2
                },
                unlockedSkills: {
                    weapons: {
                        sword: [],
                        ranged: [],
                        axe: [],
                        staff: ['staff_basics', 'spell_power', 'staff_mastery'],
                        dagger: [],
                        polearm: [],
                        hammer: []
                    },
                    magic: {
                        fire: ['fire_spark', 'fireball', 'fire_mastery'],
                        ice: ['frost_touch', 'ice_shard', 'freeze'],
                        lightning: ['spark', 'lightning_bolt'],
                        earth: ['stone_spear'],
                        wind: ['gust'],
                        water: ['water_jet'],
                        darkness: ['shadow_bolt'],
                        light: ['light_beam']
                    },
                    professions: {
                        smithing: [],
                        alchemy: [],
                        enchanting: [],
                        cooking: [],
                        archaeology: [],
                        herbalism: []
                    },
                    monster: {
                        magic: ['fire_breath', 'ice_breath', 'lightning_breath', 'teleport'],
                        defense: ['magical_resistance', 'elemental_barrier'],
                        combat: [],
                        utility: ['elemental_sight']
                    },
                    fusion: {
                        ranged_magic: [],
                        melee_magic: [],
                        utility_combat: [],
                        monster_fusion: [],
                        pure_magic: []
                    }
                },
                currency: { Gil: 60 },
                isMonster: true
            },
            {
                id: 'berserker_chief',
                name: 'Berserker Chief',
                description: 'A powerful orc leader with enhanced berserker abilities',
                builtIn: true,
                stats: {
                    hp: 20,
                    stamina: 18,
                    strength: 5,
                    magicPower: -2,
                    speed: 4,
                    physicalDefence: 14,
                    magicalDefence: 10,
                    accuracy: 1
                },
                unlockedSkills: {
                    weapons: {
                        sword: ['sword_basics', 'quick_strike', 'sword_stance'],
                        ranged: [],
                        axe: ['axe_basics', 'heavy_swing', 'cleave', 'axe_mastery'],
                        staff: [],
                        dagger: [],
                        polearm: ['polearm_basics'],
                        hammer: ['hammer_basics']
                    },
                    magic: {
                        fire: ['fire_spark'],
                        ice: [],
                        lightning: [],
                        earth: [],
                        wind: [],
                        water: [],
                        darkness: [],
                        light: []
                    },
                    professions: {
                        smithing: [],
                        alchemy: [],
                        enchanting: [],
                        cooking: [],
                        archaeology: [],
                        herbalism: []
                    },
                    monster: {
                        combat: ['claws', 'bite_attack', 'monster_charge_attack', 'rend', 'monster_berserker_rage'],
                        defense: ['tough_skin', 'rock_skin'],
                        magic: ['roar', 'battle_cry'],
                        utility: []
                    },
                    fusion: {
                        ranged_magic: [],
                        melee_magic: [],
                        utility_combat: [],
                        monster_fusion: [],
                        pure_magic: []
                    }
                },
                currency: { Gil: 65 },
                isMonster: true
            },
            {
                id: 'ancient_dragon',
                name: 'Ancient Dragon',
                description: 'A legendary dragon with centuries of power and wisdom',
                builtIn: true,
                stats: {
                    hp: 24,
                    stamina: 20,
                    strength: 6,
                    magicPower: 5,
                    speed: 5,
                    physicalDefence: 18,
                    magicalDefence: 18,
                    accuracy: 3
                },
                unlockedSkills: {
                    weapons: {
                        sword: [],
                        ranged: [],
                        axe: [],
                        staff: [],
                        dagger: [],
                        polearm: [],
                        hammer: []
                    },
                    magic: {
                        fire: ['fire_spark', 'fireball', 'fire_mastery'],
                        ice: ['frost_touch', 'ice_shard', 'freeze'],
                        lightning: ['spark', 'lightning_bolt'],
                        earth: ['stone_spear'],
                        wind: ['gust', 'wind_blade'],
                        water: ['water_jet'],
                        darkness: ['shadow_bolt'],
                        light: ['light_beam']
                    },
                    professions: {
                        smithing: [],
                        alchemy: [],
                        enchanting: [],
                        cooking: [],
                        archaeology: [],
                        herbalism: []
                    },
                    monster: {
                        combat: ['claws', 'bite_attack', 'monster_charge_attack', 'rend'],
                        defense: ['tough_skin', 'rock_skin', 'metal_skin', 'dragon_scales'],
                        magic: ['fire_breath', 'ice_breath', 'lightning_breath', 'fear_aura'],
                        utility: ['flight', 'dragon_sight']
                    },
                    fusion: {
                        ranged_magic: [],
                        melee_magic: [],
                        utility_combat: [],
                        monster_fusion: [],
                        pure_magic: []
                    }
                },
                currency: { Gil: 80 },
                isMonster: true
            },
            {
                id: 'void_walker',
                name: 'Void Walker',
                description: 'A mysterious entity that exists between dimensions',
                builtIn: true,
                stats: {
                    hp: 18,
                    stamina: 20,
                    strength: 3,
                    magicPower: 7,
                    speed: 6,
                    physicalDefence: 12,
                    magicalDefence: 20,
                    accuracy: 4
                },
                unlockedSkills: {
                    weapons: {
                        sword: [],
                        ranged: [],
                        axe: [],
                        staff: ['staff_basics', 'spell_power', 'staff_mastery'],
                        dagger: [],
                        polearm: [],
                        hammer: []
                    },
                    magic: {
                        fire: ['fire_spark', 'fireball'],
                        ice: ['frost_touch', 'ice_shard'],
                        lightning: ['spark', 'lightning_bolt'],
                        earth: ['stone_spear'],
                        wind: ['gust', 'wind_blade'],
                        water: ['water_jet'],
                        darkness: ['shadow_bolt', 'shadow_step', 'void_magic'],
                        light: ['light_beam']
                    },
                    professions: {
                        smithing: [],
                        alchemy: [],
                        enchanting: [],
                        cooking: [],
                        archaeology: [],
                        herbalism: []
                    },
                    monster: {
                        magic: ['void_breath', 'teleport', 'paralyzing_gaze', 'void_pull'],
                        defense: ['void_barrier', 'phase_shift'],
                        combat: ['void_claws'],
                        utility: ['void_walk', 'dimensional_sight']
                    },
                    fusion: {
                        ranged_magic: [],
                        melee_magic: [],
                        utility_combat: [],
                        monster_fusion: [],
                        pure_magic: []
                    }
                },
                currency: { Gil: 90 },
                isMonster: true
            }
        ]
    }

    // Get all presets (built-in + custom)
    getAllPresets() {
        const builtIn = this.getBuiltInPresets()
        const custom = this.getCustomPresets()
        return [...builtIn, ...custom]
    }

    // Get custom presets from localStorage
    getCustomPresets() {
        try {
            const saved = localStorage.getItem(this.storageKey)
            return saved ? JSON.parse(saved) : []
        } catch (error) {
            console.error('Failed to load custom monster presets:', error)
            return []
        }
    }

    // Save a custom preset
    saveCustomPreset(name, description, character) {
        try {
            if (!name || name.trim() === '') {
                throw new Error('Preset name cannot be empty')
            }

            const customPresets = this.getCustomPresets()

            // Create preset from current character state
            const preset = {
                id: `custom_${this.presetIdCounter++}`,
                name: name.trim(),
                description: description?.trim() || '',
                builtIn: false,
                created: new Date().toISOString(),
                stats: { ...character.stats },
                unlockedSkills: JSON.parse(JSON.stringify(character.unlockedSkills)), // Deep copy
                currency: { ...character.currency },
                equipment: { ...character.equipped },
                isMonster: true
            }

            customPresets.push(preset)
            localStorage.setItem(this.storageKey, JSON.stringify(customPresets))
            return preset
        } catch (error) {
            console.error('Failed to save monster preset:', error)
            throw error
        }
    }

    // Delete a custom preset
    deleteCustomPreset(presetId) {
        try {
            const customPresets = this.getCustomPresets()
            const filteredPresets = customPresets.filter(p => p.id !== presetId)
            localStorage.setItem(this.storageKey, JSON.stringify(filteredPresets))
            return true
        } catch (error) {
            console.error('Failed to delete monster preset:', error)
            return false
        }
    }

    // Get preset by ID
    getPresetById(presetId) {
        const allPresets = this.getAllPresets()
        return allPresets.find(p => p.id === presetId)
    }

    // Apply preset to character (with automatic skill refunding)
    applyPresetToCharacter(presetId, characterId, characterManager) {
        try {
            const preset = this.getPresetById(presetId)
            if (!preset) {
                throw new Error('Preset not found')
            }

            const character = characterManager.loadCharacter(characterId)
            if (!character) {
                throw new Error('Character not found')
            }

            // Step 1: Calculate refund for existing skills and return lumens
            const refundAmount = this.calculateSkillRefund(character, characterManager)

            // Step 2: Reset character to base state
            this.resetCharacterToBase(character)

            // Step 3: Apply preset configuration (but preserve existing currency and lumens)
            const originalCurrency = { ...character.currency }
            const originalLumens = character.lumens
            this.applyPresetConfiguration(character, preset, characterManager)

            // Step 4: Restore original currency and add refunded lumens back
            character.currency = originalCurrency
            character.lumens = originalLumens + refundAmount

            // Step 5: Save the updated character
            characterManager.saveCharacter(character)

            return {
                success: true,
                character: character,
                refundAmount: refundAmount,
                presetName: preset.name
            }
        } catch (error) {
            console.error('Failed to apply monster preset:', error)
            return {
                success: false,
                error: error.message
            }
        }
    }

    // Calculate total lumen value of all purchased skills and stats
    calculateSkillRefund(character, characterManager) {
        // Calculate current investment value (same logic as character manager)
        const tierPoints = characterManager.calculateTierPoints(character)
        const statPoints = characterManager.calculateStatPoints(character)
        return tierPoints + statPoints
    }

    // Reset character to base state (remove all skills and reset stats)
    resetCharacterToBase(character) {
        // Reset stats to base values (10 each)
        character.stats = {
            hp: 10,
            stamina: 10,
            strength: 10,
            magicPower: 10,
            speed: 10,
            physicalDefence: 10,
            magicalDefence: 10
        }

        // Reset HP/Stamina to match new stats
        character.maxHp = 10
        character.maxStamina = 10
        character.hp = 10
        character.stamina = 10

        // Clear all unlocked skills
        character.unlockedSkills = {
            weapons: {
                sword: [],
                ranged: [],
                axe: [],
                staff: [],
                dagger: [],
                polearm: [],
                hammer: [],
                unarmed: ['unarmed_beginner']  // Keep unarmed_beginner even on reset
            },
            magic: {
                fire: [],
                ice: [],
                lightning: [],
                earth: [],
                wind: [],
                water: [],
                darkness: [],
                light: []
            },
            professions: {
                smithing: [],
                alchemy: [],
                enchanting: [],
                cooking: [],
                archaeology: [],
                herbalism: []
            },
            monster: {
                defense: [],
                combat: [],
                magic: [],
                utility: []
            },
            fusion: {
                ranged_magic: [],
                melee_magic: [],
                utility_combat: [],
                monster_fusion: [],
                pure_magic: []
            }
        }

        // Clear milestones (will be recalculated when stats are applied)
        character.hpMilestones = {
            hp25: false, hp50: false, hp100: false, hp200: false,
            hp300: false, hp400: false, hp500: false
        }
        character.staminaMilestones = {
            stamina15: false, stamina25: false, stamina40: false, stamina60: false
        }

        // Reset other tracking
        character.totalSkillsUnlocked = 0
        character.totalLumensSpent = 0
        character.activeToggleSkills = []
        character.statusEffects = []

        // Reset equipment
        character.equipped = {
            primaryWeapon: null,
            secondaryWeapon: null,
            armor: null,
            accessory: null
        }

        // Reset currency to starting amount
        character.currency = {
            copper: 200,
            silver: 20,
            gold: 2
        }
    }

    // Apply preset configuration to character
    applyPresetConfiguration(character, preset, characterManager) {
        // Apply stats
        character.stats = { ...preset.stats }
        character.maxHp = preset.stats.hp
        character.maxStamina = preset.stats.stamina
        character.hp = preset.stats.hp
        character.stamina = preset.stats.stamina

        // Apply unlocked skills (deep copy to avoid reference issues)
        character.unlockedSkills = JSON.parse(JSON.stringify(preset.unlockedSkills))

        // Apply equipment if specified in preset
        if (preset.equipment) {
            character.equipped = this.loadEquipmentData(preset.equipment)
        } else {
            // Set default equipment based on monster type and level
            character.equipped = this.loadEquipmentData(this.getDefaultEquipmentForMonster(preset))
        }

        // Set monster status
        character.isMonster = true

        // Apply preset name with automatic numbering for duplicates
        character.name = this.generateUniqueName(preset.name, character.id, characterManager)

        // Note: Currency is preserved by the calling method

        // Recalculate milestones based on new stats
        this.recalculateMilestones(character)

        // Update totals
        character.totalSkillsUnlocked = this.countTotalSkills(character.unlockedSkills)
    }

    // Get default equipment for monster based on type and level
    getDefaultEquipmentForMonster(preset) {
        const level = this.calculatePresetLevel(preset)
        const name = preset.name.toLowerCase()

        // Base equipment structure
        const equipment = {
            primaryWeapon: null,
            secondaryWeapon: null,
            armor: null,
            accessory: null
        }

        // Determine equipment based on monster type and level
        if (name.includes('goblin')) {
            if (name.includes('warrior')) {
                equipment.primaryWeapon = { id: "rusty_sword" }
                equipment.armor = { id: "cloth_robes" }
            } else if (name.includes('scout')) {
                // Scout has ranged and dagger skills, so give them a dagger
                equipment.primaryWeapon = { id: "iron_dagger" }
                equipment.armor = { id: "leather_vest" }
            } else if (name.includes('chief')) {
                equipment.primaryWeapon = { id: "iron_sword" }
                equipment.armor = { id: "leather_armor" }
            }
        } else if (name.includes('fire mage') || name.includes('ice elemental')) {
            equipment.primaryWeapon = { id: "apprentice_staff" }
            equipment.armor = { id: "cloth_robes" }
        } else if (name.includes('armored guard')) {
            equipment.primaryWeapon = { id: "iron_sword" }
            equipment.armor = { id: "studded_leather" }
        } else if (name.includes('swift assassin')) {
            equipment.primaryWeapon = { id: "iron_dagger" }
            equipment.armor = { id: "leather_vest" }
        } else if (name.includes('skeletal warrior')) {
            equipment.primaryWeapon = { id: "rusty_sword" }
            equipment.armor = { id: "cloth_robes" }
        } else if (name.includes('orc berserker')) {
            equipment.primaryWeapon = { id: "iron_axe" }
            equipment.armor = { id: "leather_armor" }
        } else if (name.includes('giant spider')) {
            // Spiders don't use weapons - they have natural weapons
            equipment.armor = { id: "cloth_robes" }
        } else if (name.includes('veteran warrior')) {
            equipment.primaryWeapon = { id: "steel_sword" }
            equipment.armor = { id: "studded_leather" }
        } else if (name.includes('battle mage')) {
            equipment.primaryWeapon = { id: "iron_sword" }
            equipment.secondaryWeapon = { id: "apprentice_staff" }
            equipment.armor = { id: "leather_vest" }
        } else if (name.includes('elite guard')) {
            equipment.primaryWeapon = { id: "steel_sword" }
            equipment.armor = { id: "iron_plate_armor" }
        } else if (name.includes('shadow assassin')) {
            equipment.primaryWeapon = { id: "steel_dagger" }
            equipment.armor = { id: "scouts_leather" }
        } else if (name.includes('elemental lord')) {
            equipment.primaryWeapon = { id: "arcane_staff" }
            equipment.armor = { id: "cloth_robes" }
        } else if (name.includes('berserker chief')) {
            equipment.primaryWeapon = { id: "steel_axe" }
            equipment.armor = { id: "iron_plate_armor" }
        } else if (name.includes('ancient dragon')) {
            // Dragons don't use weapons - they have natural weapons
            equipment.armor = { id: "dragon_scales" }
        } else if (name.includes('void walker')) {
            // Void entities don't need physical weapons
            equipment.armor = { id: "shadowmeld_armor" }
        } else if (name.includes('dire wolf') || name.includes('shadow hound') || name.includes('earth badger') || name.includes('wind sprite') || name.includes('guardian bear')) {
            // Summoned creatures don't use weapons - they have natural abilities
            equipment.armor = { id: "cloth_robes" }
        } else {
            // Default equipment for unknown monsters
            if (level <= 3) {
                equipment.primaryWeapon = { id: "rusty_sword" }
                equipment.armor = { id: "cloth_robes" }
            } else if (level <= 6) {
                equipment.primaryWeapon = { id: "iron_sword" }
                equipment.armor = { id: "leather_armor" }
            } else if (level <= 9) {
                equipment.primaryWeapon = { id: "steel_sword" }
                equipment.armor = { id: "studded_leather" }
            } else {
                equipment.primaryWeapon = { id: "steel_sword" }
                equipment.armor = { id: "iron_plate_armor" }
            }
        }

        return equipment
    }

    // Load full equipment data from item IDs
    loadEquipmentData(equipmentIds) {
        const equipment = {
            primaryWeapon: null,
            secondaryWeapon: null,
            armor: null,
            accessory: null
        }

        // Load full item data for each equipped item
        if (equipmentIds.primaryWeapon && equipmentIds.primaryWeapon.id) {
            const item = this.findItemById(equipmentIds.primaryWeapon.id)
            if (item) {
                equipment.primaryWeapon = { ...item }
            }
        }

        if (equipmentIds.secondaryWeapon && equipmentIds.secondaryWeapon.id) {
            const item = this.findItemById(equipmentIds.secondaryWeapon.id)
            if (item) {
                equipment.secondaryWeapon = { ...item }
            }
        }

        if (equipmentIds.armor && equipmentIds.armor.id) {
            const item = this.findItemById(equipmentIds.armor.id)
            if (item) {
                equipment.armor = { ...item }
            }
        }

        if (equipmentIds.accessory && equipmentIds.accessory.id) {
            const item = this.findItemById(equipmentIds.accessory.id)
            if (item) {
                equipment.accessory = { ...item }
            }
        }

        return equipment
    }

    // Find item by ID (helper function)
    findItemById(itemId) {
        // Check if ITEMS_DATA is available globally
        if (window.ITEMS_DATA) {
            // Search in weapons
            if (window.ITEMS_DATA.weapons && window.ITEMS_DATA.weapons[itemId]) {
                return window.ITEMS_DATA.weapons[itemId]
            }
            // Search in armor
            if (window.ITEMS_DATA.armor && window.ITEMS_DATA.armor[itemId]) {
                return window.ITEMS_DATA.armor[itemId]
            }
            // Search in accessories
            if (window.ITEMS_DATA.accessories && window.ITEMS_DATA.accessories[itemId]) {
                return window.ITEMS_DATA.accessories[itemId]
            }
        }

        // Fallback: try to find the item using the global findItemById function if it exists
        if (window.findItemById) {
            return window.findItemById(itemId)
        }

        console.warn(`Item not found: ${itemId}`)
        return null
    }

    // Calculate preset level (same as UI components)
    calculatePresetLevel(preset) {
        const stats = preset.stats

        // Calculate stat points (same as character manager)
        const statPoints = this.calculateStatPointsForPreset(stats)

        // Calculate skill points (same as character manager)
        const skillPoints = this.calculateSkillPointsForPreset(preset.unlockedSkills)

        // Total points
        const totalPoints = statPoints + skillPoints

        // Use the same level calculation as character manager
        return this.calculateLevel(totalPoints)
    }

    // Calculate stat points for preset (same logic as character manager)
    calculateStatPointsForPreset(stats) {
        let totalPoints = 0

        // Calculate points for each stat (same as character manager logic)
        Object.entries(stats).forEach(([statName, currentValue]) => {
            if (statName === 'accuracy') return // Skip accuracy for now

            let points = 0
            let baseValue = 10 // Base value for HP/Stamina
            let minValue = 10  // Min value for HP/Stamina

            if (statName === 'strength' || statName === 'magicPower') {
                baseValue = -3
                minValue = -3
            } else if (statName === 'speed') {
                baseValue = 2
                minValue = 2
            } else if (statName === 'physicalDefence' || statName === 'magicalDefence') {
                baseValue = 8
                minValue = 8
            }

            // Calculate points from base to current value
            if (currentValue > baseValue) {
                points = currentValue - baseValue
            } else if (currentValue < baseValue) {
                points = Math.abs(currentValue - baseValue) // Negative stats still cost points
            }

            totalPoints += points
        })

        return totalPoints
    }

    // Calculate skill points for preset (same logic as character manager)
    calculateSkillPointsForPreset(unlockedSkills) {
        let totalPoints = 0

        if (unlockedSkills) {
            Object.values(unlockedSkills).forEach(category => {
                if (typeof category === 'object') {
                    Object.values(category).forEach(skillArray => {
                        if (Array.isArray(skillArray)) {
                            totalPoints += skillArray.length * 2 // Each skill = 2 points (same as character manager)
                        }
                    })
                }
            })
        }

        return totalPoints
    }

    // Calculate level from total points (same as character manager)
    calculateLevel(totalPoints) {
        if (totalPoints <= 2) return 1        // Level 1: 0-2 points
        if (totalPoints <= 5) return 2        // Level 2: 3-5 points
        if (totalPoints <= 9) return 3        // Level 3: 6-9 points
        if (totalPoints <= 14) return 4       // Level 4: 10-14 points
        if (totalPoints <= 20) return 5       // Level 5: 15-20 points
        if (totalPoints <= 27) return 6       // Level 6: 21-27 points
        if (totalPoints <= 35) return 7       // Level 7: 28-35 points
        if (totalPoints <= 44) return 8       // Level 8: 36-44 points
        if (totalPoints <= 54) return 9       // Level 9: 45-54 points
        if (totalPoints <= 65) return 10      // Level 10: 55-65 points

        // For levels beyond 10, continue the pattern (~12+ points per level)
        return Math.floor((totalPoints - 65) / 12) + 11
    }

    // Generate unique name by checking for duplicates and adding numbers
    generateUniqueName(baseName, currentCharacterId, characterManager) {
        const allCharacters = characterManager.getAllCharacters()
        const existingNames = allCharacters
            .filter(char => char.id !== currentCharacterId) // Exclude current character
            .map(char => char.name.toLowerCase())

        // If base name is available, use it
        if (!existingNames.includes(baseName.toLowerCase())) {
            return baseName
        }

        // Find the next available numbered name
        let counter = 2
        let testName = `${baseName} ${counter}`

        while (existingNames.includes(testName.toLowerCase())) {
            counter++
            testName = `${baseName} ${counter}`
        }

        return testName
    }

    // Apply refund as additional currency instead of lumens
    applyRefundAsCurrency(character, refundAmount) {
        if (refundAmount > 0) {
            // Convert lumens to copper at 1:1 ratio (reasonable conversion)
            character.currency.copper += refundAmount

            // Optionally convert excess copper to higher denominations
            // 25 copper = 1 silver, 25 silver = 1 gold
            if (character.currency.copper >= 25) {
                const silverToAdd = Math.floor(character.currency.copper / 25)
                character.currency.silver += silverToAdd
                character.currency.copper %= 25
            }

            if (character.currency.silver >= 25) {
                const goldToAdd = Math.floor(character.currency.silver / 25)
                character.currency.gold += goldToAdd
                character.currency.silver %= 25
            }
        }
    }

    // Recalculate milestones based on current stats
    recalculateMilestones(character) {
        const hp = character.stats.hp
        const stamina = character.stats.stamina

        // HP milestones (with bonus calculation)
        character.hpMilestones.hp25 = hp >= 30    // 25+5 bonus
        character.hpMilestones.hp50 = hp >= 60    // 50+10 bonus
        character.hpMilestones.hp100 = hp >= 125  // 100+25 bonus
        character.hpMilestones.hp200 = hp >= 225  // 200+25 bonus
        character.hpMilestones.hp300 = hp >= 325  // 300+25 bonus
        character.hpMilestones.hp400 = hp >= 425  // 400+25 bonus
        character.hpMilestones.hp500 = hp >= 525  // 500+25 bonus

        // Stamina milestones (with bonus calculation)
        character.staminaMilestones.stamina15 = stamina >= 18  // 15+3 bonus
        character.staminaMilestones.stamina25 = stamina >= 30  // 25+5 bonus
        character.staminaMilestones.stamina40 = stamina >= 50  // 40+10 bonus
        character.staminaMilestones.stamina60 = stamina >= 75  // 60+15 bonus
    }

    // Count total skills across all categories
    countTotalSkills(unlockedSkills) {
        let total = 0
        for (const category of Object.values(unlockedSkills)) {
            if (typeof category === 'object') {
                for (const subcategory of Object.values(category)) {
                    if (Array.isArray(subcategory)) {
                        total += subcategory.length
                    }
                }
            }
        }
        return total
    }

    // Validate preset data
    validatePreset(preset) {
        const required = ['name', 'stats', 'unlockedSkills']
        for (const field of required) {
            if (!preset.hasOwnProperty(field)) {
                return false
            }
        }

        // Validate stats structure
        const requiredStats = ['hp', 'stamina', 'strength', 'magicPower', 'speed', 'physicalDefence', 'magicalDefence']
        for (const stat of requiredStats) {
            if (typeof preset.stats[stat] !== 'number') {
                return false
            }
        }

        return true
    }
}

// Create global instance
window.monsterPresets = new MonsterPresets()
