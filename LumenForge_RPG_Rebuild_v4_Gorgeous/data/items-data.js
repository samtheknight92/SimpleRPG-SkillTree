// Items Data - Equipment and consumables for the RPG system
const ITEMS_DATA = {
    "weapons": {
        "bronze_sword": {
            "id": "bronze_sword",
            "name": "Bronze Sword",
            "type": "weapon",
            "damage": "1d4",
            "statModifiers": {
                "strength": 1
            },
            "specialEffects": [],
            "enchantmentSlots": 0,
            "desc": "A simple bronze sword. +1 Strength when equipped. Damage: 1d4",
            "icon": "ðŸ—¡ï¸",
            "price": {
                "silver": 3
            },
            "rarity": "common"
        },
        "iron_sword": {
            "id": "iron_sword",
            "name": "Iron Sword",
            "type": "weapon",
            "damage": "1d6",
            "statModifiers": {
                "strength": 2
            },
            "specialEffects": [],
            "enchantmentSlots": 0,
            "desc": "A basic iron sword. +2 Strength when equipped. Damage: 1d6",
            "icon": "ðŸ—¡ï¸",
            "price": {
                "silver": 8
            },
            "rarity": "common",
            "craftingRecipe": {
                "materials": [
                    {
                        "id": "iron_ore",
                        "quantity": 3
                    },
                    {
                        "id": "wood",
                        "quantity": 1
                    }
                ],
                "quantity": 1,
                "skillRequired": 2
            }
        },
        "steel_sword": {
            "id": "steel_sword",
            "name": "Steel Sword",
            "type": "weapon",
            "damage": "1d8",
            "statModifiers": {
                "strength": 3
            },
            "specialEffects": [],
            "enchantmentSlots": 0,
            "desc": "A well-forged steel sword. +3 Strength when equipped. Damage: 1d8",
            "icon": "âš”ï¸",
            "price": {
                "silver": 15
            },
            "rarity": "common"
        },
        "silver_sword": {
            "id": "silver_sword",
            "name": "Silver Sword",
            "type": "weapon",
            "damage": "1d8",
            "statModifiers": {
                "strength": 2,
                "magicalDefence": 1
            },
            "specialEffects": [
                "undead_bane"
            ],
            "enchantmentSlots": 1,
            "desc": "A blessed silver sword. +2 Strength, +1 Magical Defence. Damage: 1d8. Extra damage vs undead. GRANTS: Undead Bane.",
            "icon": "ðŸ—¡ï¸",
            "price": {
                "silver": 25
            },
            "rarity": "uncommon"
        },
        "flame_blade": {
            "id": "flame_blade",
            "name": "Flame Blade",
            "type": "weapon",
            "damage": "1d12",
            "statModifiers": {
                "strength": 3,
                "magicPower": 1
            },
            "specialEffects": [
                "burn_on_hit",
                "burn"
            ],
            "enchantmentSlots": 2,
            "elementalAffinities": {
                "resistances": {
                    "fire": -1
                },
                "weaknesses": {
                    "ice": 1
                }
            },
            "desc": "A magical sword wreathed in flames. +3 Strength, +1 Magic Power. Attacks may burn enemies. Damage: 1d12 GRANTS: Burn On Hit.",
            "icon": "ðŸ”¥",
            "price": {
                "gold": 1,
                "silver": 20
            },
            "rarity": "rare"
        },
        "frost_sword": {
            "id": "frost_sword",
            "name": "Frost Sword",
            "type": "weapon",
            "damage": "1d10",
            "statModifiers": {
                "strength": 3,
                "magicPower": 1
            },
            "specialEffects": [
                "freeze_on_hit"
            ],
            "enchantmentSlots": 2,
            "desc": "An ice-enchanted blade. +3 Strength, +1 Magic Power. Damage: 1d10. Attacks may freeze enemies. GRANTS: Freeze On Hit.",
            "icon": "â„ï¸",
            "price": {
                "gold": 1,
                "silver": 20
            },
            "rarity": "rare"
        },
        "wind_blade": {
            "id": "wind_blade",
            "name": "Wind Blade",
            "type": "weapon",
            "damage": "1d8",
            "statModifiers": {
                "strength": 2,
                "speed": 3
            },
            "specialEffects": [
                "wind_slash"
            ],
            "desc": "A sword light as air. +2 Strength, +3 Speed. Damage: 1d8. Cuts with wind magic. GRANTS: Wind Slash.",
            "icon": "ðŸŒªï¸",
            "price": {
                "gold": 1,
                "silver": 18
            },
            "enchantmentSlots": 2,
            "rarity": "rare"
        },
        "obsidian_blade": {
            "id": "obsidian_blade",
            "name": "Obsidian Blade",
            "type": "weapon",
            "damage": "1d10",
            "statModifiers": {
                "strength": 4,
                "speed": 1
            },
            "specialEffects": [
                "bleeding"
            ],
            "desc": "A razor-sharp obsidian blade. +4 Strength, +1 Speed. Damage: 1d10. Causes bleeding wounds.",
            "icon": "ðŸ–¤",
            "price": {
                "gold": 1,
                "silver": 40
            },
            "enchantmentSlots": 2,
            "rarity": "rare"
        },
        "dragon_blade": {
            "id": "dragon_blade",
            "name": "Dragon Blade",
            "type": "weapon",
            "damage": "4d12",
            "statModifiers": {
                "strength": 4,
                "magicPower": 3,
                "physicalDefence": 1
            },
            "specialEffects": [
                "dragon_fire"
            ],
            "enchantmentSlots": 1,
            "desc": "Forged from dragon scales. +4 Strength, +3 Magic Power, +1 Physical Defence. Breathes fire. Damage: 4d12 GRANTS: Dragon Fire.",
            "icon": "ðŸ‰",
            "price": {
                "gold": 3,
                "silver": 75
            },
            "rarity": "legendary"
        },
        "bronze_dagger": {
            "id": "bronze_dagger",
            "name": "Bronze Dagger",
            "type": "weapon",
            "damage": "1d4",
            "statModifiers": {
                "speed": 1
            },
            "specialEffects": [],
            "enchantmentSlots": 0,
            "desc": "A basic bronze dagger. +1 Speed when equipped. Damage: 1d4",
            "icon": "ðŸ—¡ï¸",
            "price": {
                "silver": 2
            },
            "rarity": "common"
        },
        "iron_dagger": {
            "id": "iron_dagger",
            "name": "Iron Dagger",
            "type": "weapon",
            "damage": "1d6",
            "statModifiers": {
                "speed": 1
            },
            "specialEffects": [],
            "enchantmentSlots": 0,
            "desc": "A sturdy iron dagger. +1 Speed when equipped. Damage: 1d6",
            "icon": "ðŸ—¡ï¸",
            "price": {
                "silver": 6
            },
            "rarity": "common"
        },
        "silver_dagger": {
            "id": "silver_dagger",
            "name": "Silver Dagger",
            "type": "weapon",
            "damage": "1d8",
            "statModifiers": {
                "speed": 2,
                "magicalDefence": 1
            },
            "specialEffects": [
                "undead_bane"
            ],
            "enchantmentSlots": 1,
            "desc": "A blessed silver dagger. +2 Speed, +1 Magical Defence. Damage: 1d8. Extra damage vs undead. GRANTS: Undead Bane.",
            "icon": "ðŸ—¡ï¸",
            "price": {
                "silver": 15
            },
            "rarity": "uncommon"
        },
        "poison_dagger": {
            "id": "poison_dagger",
            "name": "Poison Dagger",
            "type": "weapon",
            "damage": "1d8",
            "statModifiers": {
                "speed": 2
            },
            "specialEffects": [
                "poison_on_hit",
                "poison"
            ],
            "desc": "A venomous dagger. +2 Speed. Damage: 1d8. Attacks may poison enemies. GRANTS: Poison On Hit.",
            "icon": "ðŸ",
            "price": {
                "silver": 30
            },
            "enchantmentSlots": 1,
            "rarity": "uncommon"
        },
        "shadow_dagger": {
            "id": "shadow_dagger",
            "name": "Shadow Dagger",
            "type": "weapon",
            "damage": "1d8",
            "statModifiers": {
                "speed": 2,
                "magicPower": 1
            },
            "specialEffects": [
                "stealth_strike",
                "stealth"
            ],
            "enchantmentSlots": 2,
            "desc": "A dagger forged from shadow. +2 Speed, +1 Magic Power. Damage: 1d8. Enhanced stealth attacks. GRANTS: Stealth Strike.",
            "icon": "ðŸ—¡ï¸",
            "price": {
                "gold": 1,
                "silver": 15
            },
            "rarity": "rare"
        },
        "assassin_blade": {
            "id": "assassin_blade",
            "name": "Assassin's Blade",
            "type": "weapon",
            "damage": "2d6",
            "statModifiers": {
                "speed": 3,
                "strength": 1
            },
            "specialEffects": [
                "critical_strike"
            ],
            "enchantmentSlots": 2,
            "desc": "A deadly assassin's weapon. +3 Speed, +1 Strength. Increased critical hit chance. Damage: 2d6 GRANTS: Critical Strike.",
            "icon": "ðŸ—¡ï¸",
            "price": {
                "gold": 1,
                "silver": 0
            },
            "rarity": "rare"
        },
        "void_dagger": {
            "id": "void_dagger",
            "name": "Void Dagger",
            "type": "weapon",
            "damage": "1d10",
            "statModifiers": {
                "speed": 3,
                "magicPower": 2
            },
            "specialEffects": [
                "phase_strike"
            ],
            "enchantmentSlots": 2,
            "desc": "A dagger from the void realm. +3 Speed, +2 Magic Power. Damage: 1d10. Ignores armor. GRANTS: Phase Strike.",
            "icon": "ðŸ–¤",
            "price": {
                "gold": 2,
                "silver": 0
            },
            "rarity": "epic"
        },
        "shadow_fang": {
            "id": "shadow_fang",
            "name": "Shadow Fang",
            "type": "weapon",
            "damage": "2d6",
            "statModifiers": {
                "speed": 4,
                "magicPower": 2
            },
            "specialEffects": [
                "shadow_step"
            ],
            "desc": "A dagger forged in shadows. +4 Speed, +2 Magic Power. Damage: 2d6. Teleports behind enemies. GRANTS: Shadow Step.",
            "icon": "ðŸŒ‘",
            "price": {
                "gold": 3,
                "silver": 50
            },
            "enchantmentSlots": 1,
            "rarity": "legendary"
        },
        "temporal_blade": {
            "id": "temporal_blade",
            "name": "Temporal Blade",
            "type": "weapon",
            "damage": "2d10",
            "statModifiers": {
                "speed": 4,
                "magicPower": 2
            },
            "specialEffects": [
                "time_strike"
            ],
            "desc": "A blade that cuts through time itself. +4 Speed, +2 Magic Power. Damage: 2d10. Can strike twice. GRANTS: Time Strike.",
            "icon": "â°",
            "price": {
                "gold": 4,
                "silver": 0
            },
            "enchantmentSlots": 1,
            "rarity": "legendary"
        },
        "training_bow": {
            "id": "training_bow",
            "name": "Training Bow",
            "type": "weapon",
            "damage": "1d4",
            "statModifiers": {
                "speed": 1
            },
            "specialEffects": [],
            "desc": "A simple training bow. +1 Speed when equipped. Damage: 1d4",
            "icon": "ðŸ¹",
            "price": {
                "silver": 5
            },
            "enchantmentSlots": 0,
            "rarity": "common"
        },
        "hunting_bow": {
            "id": "hunting_bow",
            "name": "Hunting Bow",
            "type": "weapon",
            "damage": "1d6",
            "statModifiers": {
                "speed": 2
            },
            "specialEffects": [],
            "desc": "A reliable hunting bow. +2 Speed when equipped. Damage: 1d6",
            "icon": "ðŸ¹",
            "price": {
                "silver": 10
            },
            "enchantmentSlots": 0,
            "rarity": "common"
        },
        "crossbow": {
            "id": "crossbow",
            "name": "Crossbow",
            "type": "weapon",
            "damage": "1d8",
            "statModifiers": {
                "strength": 1,
                "speed": 1
            },
            "specialEffects": [
                "piercing"
            ],
            "desc": "A mechanical crossbow. +1 Strength, +1 Speed. Piercing shots.",
            "icon": "ðŸ¹",
            "price": {
                "silver": 16
            },
            "enchantmentSlots": 0,
            "rarity": "common"
        },
        "composite_bow": {
            "id": "composite_bow",
            "name": "Composite Bow",
            "type": "weapon",
            "damage": "1d8",
            "statModifiers": {
                "speed": 2,
                "strength": 1
            },
            "specialEffects": [],
            "desc": "A reinforced composite bow. +2 Speed, +1 Strength when equipped. Damage: 1d8. 1 enchantment slot.",
            "icon": "ðŸ¹",
            "price": {
                "silver": 20
            },
            "enchantmentSlots": 1,
            "rarity": "uncommon"
        },
        "lightning_bow": {
            "id": "lightning_bow",
            "name": "Lightning Bow",
            "type": "weapon",
            "damage": "1d10",
            "statModifiers": {
                "speed": 2,
                "magicPower": 2
            },
            "specialEffects": [
                "shock_on_hit"
            ],
            "desc": "A bow that crackles with electricity. +2 Speed, +2 Magic Power. Damage: 1d10. Attacks may shock enemies. GRANTS: Shock On Hit.",
            "icon": "ðŸ¹",
            "price": {
                "gold": 1,
                "silver": 10
            },
            "enchantmentSlots": 2,
            "rarity": "rare"
        },
        "elvish_bow": {
            "id": "elvish_bow",
            "name": "Elvish Bow",
            "type": "weapon",
            "damage": "1d10",
            "statModifiers": {
                "speed": 3,
                "magicPower": 1
            },
            "specialEffects": [
                "nature_blessing"
            ],
            "desc": "An elegant elvish bow. +3 Speed, +1 Magic Power. Damage: 1d10. Blessed by nature spirits. GRANTS: Nature Blessing.",
            "icon": "ðŸ§",
            "price": {
                "gold": 1,
                "silver": 25
            },
            "enchantmentSlots": 2,
            "rarity": "rare"
        },
        "crystal_bow": {
            "id": "crystal_bow",
            "name": "Crystal Bow",
            "type": "weapon",
            "damage": "1d12",
            "statModifiers": {
                "speed": 3,
                "magicPower": 2
            },
            "specialEffects": [
                "piercing_light",
                "piercing"
            ],
            "desc": "A bow carved from pure crystal. +3 Speed, +2 Magic Power. Damage: 1d12. Shoots light arrows. GRANTS: Piercing Light.",
            "icon": "ðŸ’Ž",
            "price": {
                "gold": 1,
                "silver": 30
            },
            "enchantmentSlots": 3,
            "rarity": "epic"
        },
        "storm_bow": {
            "id": "storm_bow",
            "name": "Storm Bow",
            "type": "weapon",
            "damage": "2d6",
            "statModifiers": {
                "speed": 3,
                "magicPower": 2
            },
            "specialEffects": [
                "lightning_arrows"
            ],
            "desc": "A bow that commands storms. +3 Speed, +2 Magic Power. Damage: 2d6. Arrows become lightning. GRANTS: Lightning Arrows.",
            "icon": "âš¡",
            "price": {
                "gold": 2,
                "silver": 0
            },
            "enchantmentSlots": 3,
            "rarity": "epic"
        },
        "celestial_bow": {
            "id": "celestial_bow",
            "name": "Celestial Bow",
            "type": "weapon",
            "damage": "2d8",
            "statModifiers": {
                "speed": 4,
                "magicPower": 3
            },
            "specialEffects": [
                "star_arrows"
            ],
            "desc": "A bow crafted from starlight. +4 Speed, +3 Magic Power. Damage: 2d8. Shoots celestial energy. GRANTS: Star Arrows.",
            "icon": "âœ¨",
            "price": {
                "gold": 5,
                "silver": 0
            },
            "enchantmentSlots": 2,
            "rarity": "legendary"
        },
        "stone_hammer": {
            "id": "stone_hammer",
            "name": "Stone Hammer",
            "type": "weapon",
            "damage": "1d4",
            "statModifiers": {
                "strength": 2
            },
            "specialEffects": [],
            "desc": "A crude stone hammer. +2 Strength when equipped. Damage: 1d4",
            "icon": "ðŸ”¨",
            "price": {
                "silver": 6
            },
            "enchantmentSlots": 0,
            "rarity": "common"
        },
        "iron_mace": {
            "id": "iron_mace",
            "name": "Iron Mace",
            "type": "weapon",
            "damage": "1d6",
            "statModifiers": {
                "strength": 3,
                "physicalDefence": 1
            },
            "specialEffects": [],
            "desc": "A solid iron mace. +3 Strength, +1 Physical Defence when equipped. Damage: 1d6",
            "icon": "âš’ï¸",
            "price": {
                "silver": 12
            },
            "enchantmentSlots": 0,
            "rarity": "common"
        },
        "war_hammer": {
            "id": "war_hammer",
            "name": "War Hammer",
            "type": "weapon",
            "damage": "1d10",
            "statModifiers": {
                "strength": 4,
                "speed": -1
            },
            "specialEffects": [
                "armor_pierce"
            ],
            "desc": "A heavy war hammer. +4 Strength, -1 Speed. Damage: 1d10. Pierces armor. GRANTS: Armor Pierce.",
            "icon": "ðŸ”¨",
            "price": {
                "silver": 18
            },
            "enchantmentSlots": 0,
            "rarity": "common"
        },
        "blessed_mace": {
            "id": "blessed_mace",
            "name": "Blessed Mace",
            "type": "weapon",
            "damage": "1d10",
            "statModifiers": {
                "strength": 3,
                "magicPower": 1
            },
            "specialEffects": [
                "holy_strike"
            ],
            "desc": "A mace blessed by divine power. +3 Strength, +1 Magic Power. Damage: 1d10. Holy damage vs undead. GRANTS: Holy Strike.",
            "icon": "âœï¸",
            "price": {
                "silver": 35
            },
            "enchantmentSlots": 1,
            "rarity": "uncommon"
        },
        "frost_hammer": {
            "id": "frost_hammer",
            "name": "Frost Hammer",
            "type": "weapon",
            "damage": "1d10",
            "statModifiers": {
                "strength": 4,
                "magicPower": 1
            },
            "specialEffects": [
                "freeze_on_hit"
            ],
            "desc": "A hammer of eternal ice. +4 Strength, +1 Magic Power. Damage: 1d10. Freezes enemies on impact. GRANTS: Freeze On Hit.",
            "icon": "â„ï¸",
            "price": {
                "gold": 1,
                "silver": 30
            },
            "enchantmentSlots": 2,
            "rarity": "rare"
        },
        "earth_hammer": {
            "id": "earth_hammer",
            "name": "Earth Hammer",
            "type": "weapon",
            "damage": "1d10",
            "statModifiers": {
                "strength": 4,
                "physicalDefence": 2
            },
            "specialEffects": [
                "earthquake"
            ],
            "desc": "A hammer imbued with earth magic. +4 Strength, +2 Physical Defence. Damage: 1d10. Creates tremors. GRANTS: Earthquake.",
            "icon": "ðŸŒ",
            "price": {
                "gold": 1,
                "silver": 25
            },
            "enchantmentSlots": 2,
            "rarity": "rare"
        },
        "thunder_hammer": {
            "id": "thunder_hammer",
            "name": "Thunder Hammer",
            "type": "weapon",
            "damage": "1d12",
            "statModifiers": {
                "strength": 5,
                "magicPower": 2
            },
            "specialEffects": [
                "thunder_strike"
            ],
            "desc": "A hammer that roars with thunder. +5 Strength, +2 Magic Power. Damage: 1d12. Sonic shockwaves. GRANTS: Thunder Strike.",
            "icon": "âš¡",
            "price": {
                "gold": 2,
                "silver": 50
            },
            "enchantmentSlots": 3,
            "rarity": "epic"
        },
        "titan_hammer": {
            "id": "titan_hammer",
            "name": "Titan's Hammer",
            "type": "weapon",
            "damage": "2d8",
            "statModifiers": {
                "strength": 6,
                "hp": 5,
                "speed": -1
            },
            "specialEffects": [
                "earth_shatter"
            ],
            "desc": "The legendary hammer of titans. +6 Strength, +5 HP, -1 Speed. Damage: 2d8. Shatters the earth. GRANTS: Earth Shatter.",
            "icon": "ðŸ”ï¸",
            "price": {
                "gold": 6,
                "silver": 0
            },
            "enchantmentSlots": 1,
            "rarity": "legendary"
        },
        "void_crusher": {
            "id": "void_crusher",
            "name": "Void Crusher",
            "type": "weapon",
            "damage": "2d10",
            "statModifiers": {
                "strength": 7,
                "magicPower": 3,
                "hp": -2
            },
            "specialEffects": [
                "void_impact"
            ],
            "desc": "A hammer that crushes reality itself. +7 Strength, +3 Magic Power, -2 HP. Damage: 2d10. Void damage. GRANTS: Void Impact.",
            "icon": "ðŸ•³ï¸",
            "price": {
                "gold": 8,
                "silver": 0
            },
            "enchantmentSlots": 1,
            "rarity": "legendary"
        },
        "bronze_axe": {
            "id": "bronze_axe",
            "name": "Bronze Axe",
            "type": "weapon",
            "damage": "1d4",
            "statModifiers": {
                "strength": 2
            },
            "specialEffects": [],
            "desc": "A simple bronze axe. +2 Strength when equipped. Damage: 1d4",
            "icon": "ðŸª“",
            "price": {
                "silver": 7
            },
            "enchantmentSlots": 0,
            "rarity": "common"
        },
        "iron_axe": {
            "id": "iron_axe",
            "name": "Iron Axe",
            "type": "weapon",
            "damage": "1d6",
            "statModifiers": {
                "strength": 3
            },
            "specialEffects": [],
            "desc": "A sturdy iron axe. +3 Strength when equipped. Damage: 1d6",
            "icon": "ðŸª“",
            "price": {
                "silver": 13
            },
            "enchantmentSlots": 0,
            "rarity": "common"
        },
        "battle_axe": {
            "id": "battle_axe",
            "name": "Battle Axe",
            "type": "weapon",
            "damage": "1d8",
            "statModifiers": {
                "strength": 3,
                "speed": -1
            },
            "specialEffects": [
                "cleave"
            ],
            "desc": "A brutal battle axe. +3 Strength, -1 Speed. Damage: 1d8. Cleaves through enemies. GRANTS: Cleave.",
            "icon": "ðŸª“",
            "price": {
                "silver": 14
            },
            "enchantmentSlots": 0,
            "rarity": "common"
        },
        "double_axe": {
            "id": "double_axe",
            "name": "Double Axe",
            "type": "weapon",
            "damage": "1d10",
            "statModifiers": {
                "strength": 4,
                "speed": -1
            },
            "specialEffects": [
                "double_strike"
            ],
            "desc": "A double-headed axe. +4 Strength, -1 Speed. Damage: 1d10. Can strike twice per attack. GRANTS: Double Strike.",
            "icon": "ðŸª“",
            "price": {
                "silver": 40
            },
            "enchantmentSlots": 1,
            "rarity": "uncommon"
        },
        "demon_axe": {
            "id": "demon_axe",
            "name": "Demon Axe",
            "type": "weapon",
            "damage": "1d12",
            "statModifiers": {
                "strength": 5,
                "speed": -1,
                "hp": -2
            },
            "specialEffects": [
                "lifesteal"
            ],
            "desc": "A cursed demonic axe. +5 Strength, -1 Speed, -2 HP. Damage: 1d12. Steals life from enemies. GRANTS: Lifesteal.",
            "icon": "ðŸ‘¹",
            "price": {
                "gold": 2,
                "silver": 50
            },
            "enchantmentSlots": 1,
            "rarity": "legendary"
        },
        "berserker_axe": {
            "id": "berserker_axe",
            "name": "Berserker Axe",
            "type": "weapon",
            "damage": "1d10",
            "statModifiers": {
                "strength": 5,
                "speed": 1,
                "hp": -1
            },
            "specialEffects": [
                "rage_mode"
            ],
            "desc": "An axe that fuels bloodlust. +5 Strength, +1 Speed, -1 HP. Damage: 1d10. Enters rage when wounded. GRANTS: Rage Mode.",
            "icon": "ðŸ’€",
            "price": {
                "gold": 1,
                "silver": 50
            },
            "enchantmentSlots": 2,
            "rarity": "rare"
        },
        "executioner_axe": {
            "id": "executioner_axe",
            "name": "Executioner's Axe",
            "type": "weapon",
            "damage": "2d6",
            "statModifiers": {
                "strength": 6,
                "speed": -2
            },
            "specialEffects": [
                "execution"
            ],
            "desc": "A massive executioner's axe. +6 Strength, -2 Speed. Damage: 2d6. Instant kill on critical hits. GRANTS: Execution.",
            "icon": "âš”ï¸",
            "price": {
                "gold": 3,
                "silver": 0
            },
            "enchantmentSlots": 3,
            "rarity": "epic"
        },
        "chaos_axe": {
            "id": "chaos_axe",
            "name": "Chaos Axe",
            "type": "weapon",
            "damage": "2d8",
            "statModifiers": {
                "strength": 7,
                "magicPower": 2,
                "hp": -3
            },
            "specialEffects": [
                "chaos_strike"
            ],
            "desc": "An axe forged in chaos itself. +7 Strength, +2 Magic Power, -3 HP. Damage: 2d8. Unpredictable effects. GRANTS: Chaos Strike.",
            "icon": "ðŸŒ€",
            "price": {
                "gold": 5,
                "silver": 50
            },
            "enchantmentSlots": 2,
            "rarity": "legendary"
        },
        "world_cleaver": {
            "id": "world_cleaver",
            "name": "World Cleaver",
            "type": "weapon",
            "damage": "3d8",
            "statModifiers": {
                "strength": 8,
                "physicalDefence": 2,
                "speed": -3
            },
            "specialEffects": [
                "reality_cut"
            ],
            "desc": "An axe that can cleave worlds in two. +8 Strength, +2 Physical Defence, -3 Speed. Damage: 3d8. Reality-breaking power. GRANTS: Reality Cut.",
            "icon": "ðŸŒ",
            "price": {
                "gold": 10,
                "silver": 0
            },
            "enchantmentSlots": 1,
            "rarity": "legendary"
        },
        "wooden_staff": {
            "id": "wooden_staff",
            "name": "Wooden Staff",
            "type": "weapon",
            "damage": "1d4",
            "statModifiers": {
                "magicPower": 1
            },
            "specialEffects": [],
            "desc": "A simple wooden staff. +1 Magic Power when equipped. Damage: 1d4",
            "icon": "ðŸª„",
            "price": {
                "silver": 4
            },
            "enchantmentSlots": 0,
            "rarity": "common"
        },
        "quarterstaff": {
            "id": "quarterstaff",
            "name": "Quarterstaff",
            "type": "weapon",
            "damage": "1d4",
            "statModifiers": {
                "strength": 1,
                "magicPower": 1,
                "physicalDefence": 1
            },
            "specialEffects": [],
            "desc": "A versatile wooden staff. +1 Strength, +1 Magic Power, +1 Physical Defence. Damage: 1d4",
            "icon": "ðŸ¥¢",
            "price": {
                "silver": 9
            },
            "enchantmentSlots": 0,
            "rarity": "common"
        },
        "mystic_staff": {
            "id": "mystic_staff",
            "name": "Mystic Staff",
            "type": "weapon",
            "damage": "1d6",
            "statModifiers": {
                "magicPower": 2
            },
            "specialEffects": [],
            "desc": "A wooden staff carved with mystical runes. +2 Magic Power when equipped. Damage: 1d6. Enables staff skill bonuses.",
            "icon": "ðŸª„",
            "price": {
                "silver": 12
            },
            "enchantmentSlots": 0,
            "rarity": "common"
        },
        "crystal_staff": {
            "id": "crystal_staff",
            "name": "Crystal Staff",
            "type": "weapon",
            "damage": "1d8",
            "statModifiers": {
                "magicPower": 3,
                "stamina": 2
            },
            "specialEffects": [],
            "desc": "A staff topped with pure crystal. +3 Magic Power, +2 Stamina when equipped. Damage: 1d8",
            "icon": "ðŸ’Ž",
            "price": {
                "silver": 28
            },
            "enchantmentSlots": 1,
            "rarity": "uncommon"
        },
        "arcane_staff": {
            "id": "arcane_staff",
            "name": "Arcane Staff",
            "type": "weapon",
            "damage": "1d10",
            "statModifiers": {
                "magicPower": 4,
                "magicalDefence": 2
            },
            "specialEffects": [
                "mana_efficiency"
            ],
            "desc": "A staff humming with arcane energy. +4 Magic Power, +2 Magical Defence. Damage: 1d10. Reduces mana costs. GRANTS: Mana Efficiency.",
            "icon": "ðŸ”®",
            "price": {
                "gold": 1,
                "silver": 35
            },
            "enchantmentSlots": 2,
            "rarity": "rare"
        },
        "void_staff": {
            "id": "void_staff",
            "name": "Void Staff",
            "type": "weapon",
            "damage": "1d10",
            "statModifiers": {
                "magicPower": 4,
                "magicalDefence": 1
            },
            "specialEffects": [
                "drain_mana"
            ],
            "desc": "A staff channeling dark energy. +4 Magic Power, +1 Magical Defence. Damage: 1d10. Drains enemy mana. GRANTS: Drain Mana.",
            "icon": "ðŸ–¤",
            "price": {
                "gold": 2,
                "silver": 10
            },
            "enchantmentSlots": 3,
            "rarity": "epic"
        },
        "elemental_staff": {
            "id": "elemental_staff",
            "name": "Elemental Staff",
            "type": "weapon",
            "damage": "1d12",
            "statModifiers": {
                "magicPower": 5,
                "stamina": 3
            },
            "specialEffects": [
                "elemental_mastery",
                "elemental_mastery_passive"
            ],
            "desc": "A staff attuned to all elements. +5 Magic Power, +3 Stamina. Damage: 1d12. Elemental spell mastery. GRANTS: Elemental Mastery.",
            "icon": "ðŸŒŸ",
            "price": {
                "gold": 2,
                "silver": 25
            },
            "enchantmentSlots": 3,
            "rarity": "epic"
        },
        "cosmic_staff": {
            "id": "cosmic_staff",
            "name": "Cosmic Staff",
            "type": "weapon",
            "damage": "2d6",
            "statModifiers": {
                "magicPower": 6,
                "stamina": 5,
                "hp": 2
            },
            "specialEffects": [
                "cosmic_power"
            ],
            "desc": "A staff channeling cosmic forces. +6 Magic Power, +5 Stamina, +2 HP. Damage: 2d6. Reality-bending magic. GRANTS: Cosmic Power.",
            "icon": "ðŸŒŒ",
            "price": {
                "gold": 7,
                "silver": 0
            },
            "enchantmentSlots": 2,
            "rarity": "legendary"
        },
        "genesis_rod": {
            "id": "genesis_rod",
            "name": "Genesis Rod",
            "type": "weapon",
            "damage": "2d8",
            "statModifiers": {
                "magicPower": 7,
                "stamina": 6,
                "hp": 3,
                "speed": 1
            },
            "specialEffects": [
                "creation_magic"
            ],
            "desc": "The staff of creation itself. +7 Magic Power, +6 Stamina, +3 HP, +1 Speed. Damage: 2d8. Creates matter from nothing. GRANTS: Creation Magic.",
            "icon": "âœ¨",
            "price": {
                "gold": 12,
                "silver": 0
            },
            "enchantmentSlots": 1,
            "rarity": "legendary"
        },
        "bronze_spear": {
            "id": "bronze_spear",
            "name": "Bronze Spear",
            "type": "weapon",
            "damage": "1d4",
            "statModifiers": {
                "strength": 1,
                "physicalDefence": 1
            },
            "specialEffects": [],
            "desc": "A basic bronze spear. +1 Strength, +1 Physical Defence when equipped. Damage: 1d4",
            "icon": "ðŸ”±",
            "price": {
                "silver": 6
            },
            "enchantmentSlots": 0,
            "rarity": "common"
        },
        "iron_spear": {
            "id": "iron_spear",
            "name": "Iron Spear",
            "type": "weapon",
            "damage": "1d6",
            "statModifiers": {
                "strength": 2,
                "physicalDefence": 1
            },
            "specialEffects": [],
            "desc": "A sturdy iron spear. +2 Strength, +1 Physical Defence when equipped. Damage: 1d6",
            "icon": "ðŸ”±",
            "price": {
                "silver": 10
            },
            "enchantmentSlots": 0,
            "rarity": "common"
        },
        "spear": {
            "id": "spear",
            "name": "Spear",
            "type": "weapon",
            "damage": "1d6",
            "statModifiers": {
                "strength": 2,
                "physicalDefence": 1
            },
            "specialEffects": [
                "reach"
            ],
            "desc": "A long spear. +2 Strength, +1 Physical Defence. Damage: 1d6. Extended reach.",
            "icon": "ðŸ”±",
            "price": {
                "silver": 11
            },
            "enchantmentSlots": 0,
            "rarity": "common"
        },
        "halberd": {
            "id": "halberd",
            "name": "Halberd",
            "type": "weapon",
            "damage": "1d10",
            "statModifiers": {
                "strength": 3,
                "physicalDefence": 2,
                "speed": -1
            },
            "specialEffects": [
                "reach",
                "cleave"
            ],
            "desc": "A versatile halberd. +3 Strength, +2 Physical Defence, -1 Speed. Damage: 1d10. Reach and cleave attacks.",
            "icon": "âš”ï¸",
            "price": {
                "silver": 25
            },
            "enchantmentSlots": 1,
            "rarity": "uncommon"
        },
        "pike": {
            "id": "pike",
            "name": "Pike",
            "type": "weapon",
            "damage": "1d8",
            "statModifiers": {
                "strength": 2,
                "physicalDefence": 3,
                "speed": -1
            },
            "specialEffects": [
                "anti_cavalry"
            ],
            "desc": "A long pike for formation fighting. +2 Strength, +3 Physical Defence, -1 Speed. Damage: 1d8. Extra damage vs mounted foes. GRANTS: Anti Cavalry.",
            "icon": "ðŸ”±",
            "price": {
                "silver": 20
            },
            "enchantmentSlots": 1,
            "rarity": "uncommon"
        },
        "glaive": {
            "id": "glaive",
            "name": "Glaive",
            "type": "weapon",
            "damage": "1d12",
            "statModifiers": {
                "strength": 4,
                "speed": 1,
                "physicalDefence": 1
            },
            "specialEffects": [
                "sweeping_strikes"
            ],
            "desc": "An elegant glaive. +4 Strength, +1 Speed, +1 Physical Defence. Damage: 1d12. Sweeping attack patterns. GRANTS: Sweeping Strikes.",
            "icon": "âš”ï¸",
            "price": {
                "gold": 1,
                "silver": 15
            },
            "enchantmentSlots": 2,
            "rarity": "rare"
        },
        "dragon_lance": {
            "id": "dragon_lance",
            "name": "Dragon Lance",
            "type": "weapon",
            "damage": "2d6",
            "statModifiers": {
                "strength": 4,
                "physicalDefence": 3,
                "magicPower": 2
            },
            "specialEffects": [
                "dragon_slayer"
            ],
            "desc": "A lance forged to slay dragons. +4 Strength, +3 Physical Defence, +2 Magic Power. Damage: 2d6. Dragon slaying power. GRANTS: Dragon Slayer.",
            "icon": "ðŸ²",
            "price": {
                "gold": 2,
                "silver": 75
            },
            "enchantmentSlots": 3,
            "rarity": "epic"
        },
        "infinity_spear": {
            "id": "infinity_spear",
            "name": "Infinity Spear",
            "type": "weapon",
            "damage": "2d8",
            "statModifiers": {
                "strength": 5,
                "physicalDefence": 4,
                "magicPower": 3,
                "speed": 1
            },
            "specialEffects": [
                "infinite_reach"
            ],
            "desc": "A spear that transcends distance. +5 Strength, +4 Physical Defence, +3 Magic Power, +1 Speed. Damage: 2d8. Infinite reach.",
            "icon": "â™¾ï¸",
            "price": {
                "gold": 8,
                "silver": 0
            },
            "enchantmentSlots": 1,
            "rarity": "legendary"
        },
        "reality_piercer": {
            "id": "reality_piercer",
            "name": "Reality Piercer",
            "type": "weapon",
            "damage": "2d10",
            "statModifiers": {
                "strength": 6,
                "physicalDefence": 5,
                "magicPower": 4,
                "speed": 2
            },
            "specialEffects": [
                "dimension_pierce"
            ],
            "desc": "A spear that pierces through dimensions. +6 Strength, +5 Physical Defence, +4 Magic Power, +2 Speed. Damage: 2d10. Ignores all defenses. GRANTS: Dimension Pierce.",
            "icon": "ðŸ•³ï¸",
            "price": {
                "gold": 15,
                "silver": 0
            },
            "enchantmentSlots": 1,
            "rarity": "legendary"
        }
    },
    "armor": {
        "cloth_robes": {
            "id": "cloth_robes",
            "name": "Cloth Robes",
            "type": "armor",
            "statModifiers": {
                "magicPower": 1
            },
            "specialEffects": [],
            "desc": "Simple cloth robes. +1 Magic Power when equipped.",
            "icon": "ðŸ‘˜",
            "price": {
                "silver": 3
            },
            "enchantmentSlots": 0,
            "rarity": "common"
        },
        "leather_armor": {
            "id": "leather_armor",
            "name": "Leather Armor",
            "type": "armor",
            "statModifiers": {
                "physicalDefence": 2
            },
            "specialEffects": [],
            "desc": "Basic leather protection. +2 Physical Defence when equipped.",
            "icon": "ðŸ¥¼",
            "price": {
                "silver": 5
            },
            "enchantmentSlots": 0,
            "rarity": "common",
            "craftingRecipe": {
                "materials": [
                    {
                        "id": "leather",
                        "quantity": 4
                    }
                ],
                "quantity": 1,
                "skillRequired": 2
            }
        },
        "studded_leather": {
            "id": "studded_leather",
            "name": "Studded Leather",
            "type": "armor",
            "statModifiers": {
                "physicalDefence": 3,
                "speed": -1
            },
            "specialEffects": [],
            "desc": "Leather armor with metal studs. +3 Physical Defence, -1 Speed.",
            "icon": "ðŸ¥¼",
            "price": {
                "silver": 8
            },
            "enchantmentSlots": 0,
            "rarity": "common"
        },
        "chain_mail": {
            "id": "chain_mail",
            "name": "Chain Mail",
            "type": "armor",
            "statModifiers": {
                "physicalDefence": 4,
                "speed": -1
            },
            "specialEffects": [],
            "desc": "Interlocked metal rings. +4 Physical Defence, -1 Speed.",
            "icon": "â›“ï¸",
            "price": {
                "silver": 15
            },
            "enchantmentSlots": 0,
            "rarity": "common"
        },
        "scale_mail": {
            "id": "scale_mail",
            "name": "Scale Mail",
            "type": "armor",
            "statModifiers": {
                "physicalDefence": 4,
                "magicalDefence": 1,
                "speed": -1
            },
            "specialEffects": [],
            "desc": "Overlapping metal scales. +4 Physical Defence, +1 Magical Defence, -1 Speed.",
            "icon": "ðŸŸ",
            "price": {
                "silver": 18
            },
            "enchantmentSlots": 0,
            "rarity": "common"
        },
        "plate_mail": {
            "id": "plate_mail",
            "name": "Plate Mail",
            "type": "armor",
            "statModifiers": {
                "physicalDefence": 5,
                "speed": -1
            },
            "specialEffects": [
                "damage_reduction"
            ],
            "desc": "Heavy steel armor. +5 Physical Defence, -1 Speed. Reduces incoming damage. GRANTS: Damage Reduction.",
            "icon": "ðŸ›¡ï¸",
            "price": {
                "gold": 1,
                "silver": 50
            },
            "enchantmentSlots": 1,
            "rarity": "uncommon"
        },
        "knight_armor": {
            "id": "knight_armor",
            "name": "Knight's Armor",
            "type": "armor",
            "statModifiers": {
                "physicalDefence": 6,
                "magicalDefence": 1,
                "speed": -2
            },
            "specialEffects": [
                "damage_reduction"
            ],
            "desc": "Full plate armor of a knight. +6 Physical Defence, +1 Magical Defence, -2 Speed. GRANTS: Damage Reduction.",
            "icon": "ðŸ›¡ï¸",
            "price": {
                "gold": 2,
                "silver": 25
            },
            "enchantmentSlots": 1,
            "rarity": "uncommon"
        },
        "mage_robes": {
            "id": "mage_robes",
            "name": "Mage Robes",
            "type": "armor",
            "statModifiers": {
                "magicalDefence": 4,
                "magicPower": 2
            },
            "specialEffects": [
                "mana_regeneration",
                "regeneration"
            ],
            "desc": "Enchanted robes. +4 Magical Defence, +2 Magic Power. Restores stamina over time. GRANTS: Mana Regeneration.",
            "icon": "ðŸ‘˜",
            "price": {
                "gold": 1,
                "silver": 30
            },
            "enchantmentSlots": 1,
            "rarity": "uncommon"
        },
        "fire_robes": {
            "id": "fire_robes",
            "name": "Fire Robes",
            "type": "armor",
            "statModifiers": {
                "magicalDefence": 3,
                "magicPower": 3
            },
            "specialEffects": [
                "fire_resistance",
                "fire_immunity"
            ],
            "elementalAffinities": {
                "resistances": {
                    "fire": -2
                },
                "weaknesses": {
                    "ice": 1,
                    "water": 1
                }
            },
            "desc": "Robes woven with fire magic. +3 Magical Defence, +3 Magic Power. Immune to fire damage. GRANTS: Fire resistance 25% (-2), Ice/Water weakness 200% (+1)",
            "icon": "ðŸ”¥",
            "price": {
                "gold": 1,
                "silver": 40
            },
            "rarity": "rare"
        },
        "ice_armor": {
            "id": "ice_armor",
            "name": "Ice Armor",
            "type": "armor",
            "statModifiers": {
                "physicalDefence": 3,
                "magicalDefence": 3,
                "speed": -1
            },
            "specialEffects": [
                "ice_resistance",
                "cold_aura"
            ],
            "elementalAffinities": {
                "resistances": {
                    "ice": -2
                },
                "weaknesses": {
                    "fire": 1,
                    "lightning": 1
                }
            },
            "desc": "Armor made of magical ice. +3 Physical Defence, +3 Magical Defence, -1 Speed. Freezes attackers. GRANTS: Ice resistance 25% (-2), Fire/Lightning weakness 200% (+1)",
            "icon": "â„ï¸",
            "price": {
                "gold": 1,
                "silver": 45
            },
            "rarity": "rare"
        },
        "shadow_cloak": {
            "id": "shadow_cloak",
            "name": "Shadow Cloak",
            "type": "armor",
            "statModifiers": {
                "speed": 2,
                "magicalDefence": 2
            },
            "specialEffects": [
                "stealth"
            ],
            "desc": "A cloak woven from shadows. +2 Speed, +2 Magical Defence. Enhanced stealth.",
            "icon": "ðŸ¦‡",
            "price": {
                "gold": 1,
                "silver": 35
            },
            "enchantmentSlots": 2,
            "rarity": "rare"
        },
        "dragon_scale_armor": {
            "id": "dragon_scale_armor",
            "name": "Dragon Scale Armor",
            "type": "armor",
            "statModifiers": {
                "physicalDefence": 5,
                "magicalDefence": 4,
                "hp": 5
            },
            "specialEffects": [
                "damage_reduction",
                "fire_immunity"
            ],
            "desc": "Armor crafted from ancient dragon scales. +5 Physical Defence, +4 Magical Defence, +5 HP. GRANTS: Fire Immunity, Damage Reduction.",
            "icon": "ðŸ‰",
            "price": {
                "gold": 4,
                "silver": 0
            },
            "enchantmentSlots": 1,
            "rarity": "legendary"
        },
        "void_armor": {
            "id": "void_armor",
            "name": "Void Armor",
            "type": "armor",
            "statModifiers": {
                "physicalDefence": 3,
                "magicalDefence": 6,
                "magicPower": 2,
                "hp": -3
            },
            "specialEffects": [
                "spell_absorption"
            ],
            "desc": "Armor from the void realm. +3 Physical Defence, +6 Magical Defence, +2 Magic Power, -3 HP. GRANTS: Spell Absorption.",
            "icon": "ðŸ–¤",
            "price": {
                "gold": 3,
                "silver": 50
            },
            "enchantmentSlots": 3,
            "rarity": "epic"
        },
        "celestial_robes": {
            "id": "celestial_robes",
            "name": "Celestial Robes",
            "type": "armor",
            "statModifiers": {
                "magicalDefence": 5,
                "magicPower": 4,
                "hp": 3,
                "stamina": 3
            },
            "specialEffects": [
                "mana_regeneration",
                "regeneration",
                "light_aura"
            ],
            "desc": "Robes blessed by celestial beings. +5 Magical Defence, +4 Magic Power, +3 HP, +3 Stamina. GRANTS: Light Aura, Mana Regeneration.",
            "icon": "âœ¨",
            "price": {
                "gold": 5,
                "silver": 0
            },
            "enchantmentSlots": 1,
            "rarity": "legendary"
        }
    },
    "accessories": {
        "power_ring": {
            "id": "power_ring",
            "name": "Ring of Power",
            "type": "accessory",
            "statModifiers": {
                "strength": 1,
                "magicPower": 1
            },
            "specialEffects": [],
            "desc": "A simple enchanted ring. +1 Strength, +1 Magic Power when worn.",
            "icon": "ðŸ’",
            "price": {
                "silver": 25
            },
            "rarity": "common"
        },
        "ring_of_speed": {
            "id": "ring_of_speed",
            "name": "Ring of Speed",
            "type": "accessory",
            "statModifiers": {
                "speed": 2
            },
            "specialEffects": [
                "haste"
            ],
            "desc": "A ring that quickens movement. +2 Speed. Grants extra actions. GRANTS: Haste.",
            "icon": "ðŸ’",
            "price": {
                "silver": 30
            },
            "rarity": "uncommon"
        },
        "ring_of_protection": {
            "id": "ring_of_protection",
            "name": "Ring of Protection",
            "type": "accessory",
            "statModifiers": {
                "physicalDefence": 2,
                "magicalDefence": 2
            },
            "specialEffects": [],
            "desc": "A protective ring. +2 Physical Defence, +2 Magical Defence.",
            "icon": "ðŸ’",
            "price": {
                "silver": 40
            },
            "rarity": "uncommon"
        },
        "ring_of_fire": {
            "id": "ring_of_fire",
            "name": "Ring of Fire",
            "type": "accessory",
            "statModifiers": {
                "magicPower": 3
            },
            "specialEffects": [
                "fire_resistance",
                "ice_weakness",
                "fire_immunity",
                "burn_aura"
            ],
            "elementalAffinities": {
                "resistances": {
                    "fire": -1
                },
                "weaknesses": {
                    "ice": 1
                }
            },
            "desc": "A ring wreathed in flames. +3 Magic Power. Fire immunity and burning aura. GRANTS: Fire resistance 50% (-1), Ice weakness 200% (+1)",
            "icon": "ðŸ”¥",
            "price": {
                "gold": 1,
                "silver": 20
            },
            "rarity": "rare"
        },
        "ring_of_ice": {
            "id": "ring_of_ice",
            "name": "Ring of Ice",
            "type": "accessory",
            "statModifiers": {
                "magicPower": 3,
                "magicalDefence": 1
            },
            "specialEffects": [
                "ice_resistance",
                "fire_weakness",
                "frost_aura"
            ],
            "elementalAffinities": {
                "resistances": {
                    "ice": -1
                },
                "weaknesses": {
                    "fire": 1
                }
            },
            "desc": "A ring of eternal frost. +3 Magic Power, +1 Magical Defence. Frost aura. GRANTS: Ice resistance 50% (-1), Fire weakness 200% (+1)",
            "icon": "â„ï¸",
            "price": {
                "gold": 1,
                "silver": 20
            },
            "rarity": "rare"
        },
        "ring_of_storms": {
            "id": "ring_of_storms",
            "name": "Ring of Storms",
            "type": "accessory",
            "statModifiers": {
                "magicPower": 2,
                "speed": 2
            },
            "specialEffects": [
                "lightning_resistance",
                "earth_weakness",
                "lightning_bolt"
            ],
            "elementalAffinities": {
                "resistances": {
                    "lightning": -1
                },
                "weaknesses": {
                    "earth": 1
                }
            },
            "desc": "A ring crackling with electricity. +2 Magic Power, +2 Speed. Lightning attacks. GRANTS: Lightning resistance 50% (-1), Earth weakness 200% (+1)",
            "icon": "âš¡",
            "price": {
                "gold": 1,
                "silver": 25
            },
            "rarity": "rare"
        },
        "ring_of_shadows": {
            "id": "ring_of_shadows",
            "name": "Ring of Shadows",
            "type": "accessory",
            "statModifiers": {
                "speed": 3,
                "magicPower": 1
            },
            "specialEffects": [
                "invisibility"
            ],
            "desc": "A ring that bends light. +3 Speed, +1 Magic Power. Can become invisible. GRANTS: Invisibility.",
            "icon": "ðŸ–¤",
            "price": {
                "gold": 1,
                "silver": 35
            },
            "rarity": "rare"
        },
        "speed_boots": {
            "id": "speed_boots",
            "name": "Boots of Speed",
            "type": "accessory",
            "statModifiers": {
                "speed": 3
            },
            "specialEffects": [
                "extra_movement"
            ],
            "desc": "Enchanted boots that enhance mobility. +3 Speed. Grants extra movement in combat.",
            "icon": "ðŸ‘¢",
            "price": {
                "silver": 75
            },
            "rarity": "uncommon"
        },
        "boots_of_stealth": {
            "id": "boots_of_stealth",
            "name": "Boots of Stealth",
            "type": "accessory",
            "statModifiers": {
                "speed": 2
            },
            "specialEffects": [
                "silent_movement"
            ],
            "desc": "Soft-soled boots. +2 Speed. Move without making sound. GRANTS: Silent Movement.",
            "icon": "ðŸ‘Ÿ",
            "price": {
                "silver": 60
            },
            "rarity": "uncommon"
        },
        "iron_boots": {
            "id": "iron_boots",
            "name": "Iron Boots",
            "type": "accessory",
            "statModifiers": {
                "physicalDefence": 3,
                "speed": -1
            },
            "specialEffects": [
                "immovable"
            ],
            "desc": "Heavy iron boots. +3 Physical Defence, -1 Speed. Cannot be knocked down. GRANTS: Immovable.",
            "icon": "ðŸ¥¾",
            "price": {
                "silver": 45
            },
            "rarity": "common"
        },
        "winged_boots": {
            "id": "winged_boots",
            "name": "Winged Boots",
            "type": "accessory",
            "statModifiers": {
                "speed": 4
            },
            "specialEffects": [
                "flight"
            ],
            "desc": "Boots with ethereal wings. +4 Speed. Grants limited flight ability.",
            "icon": "ðŸ‘¼",
            "price": {
                "gold": 2,
                "silver": 0
            },
            "rarity": "epic"
        },
        "health_amulet": {
            "id": "health_amulet",
            "name": "Amulet of Health",
            "type": "accessory",
            "statModifiers": {
                "hp": 5,
                "stamina": 3
            },
            "specialEffects": [
                "regeneration"
            ],
            "desc": "A life-enhancing amulet. +5 HP, +3 Stamina. Slowly regenerates health. GRANTS: Regeneration.",
            "icon": "ðŸ”®",
            "price": {
                "gold": 1,
                "silver": 25
            },
            "rarity": "rare"
        },
        "amulet_of_mana": {
            "id": "amulet_of_mana",
            "name": "Amulet of Mana",
            "type": "accessory",
            "statModifiers": {
                "magicPower": 3,
                "stamina": 5
            },
            "specialEffects": [
                "mana_regeneration",
                "regeneration"
            ],
            "desc": "An amulet pulsing with magical energy. +3 Magic Power, +5 Stamina. Restores mana over time. GRANTS: Mana Regeneration.",
            "icon": "ðŸ”®",
            "price": {
                "gold": 1,
                "silver": 30
            },
            "rarity": "rare"
        },
        "pendant_of_wisdom": {
            "id": "pendant_of_wisdom",
            "name": "Pendant of Wisdom",
            "type": "accessory",
            "statModifiers": {
                "magicPower": 2,
                "magicalDefence": 3
            },
            "specialEffects": [
                "spell_resistance"
            ],
            "desc": "A pendant containing ancient knowledge. +2 Magic Power, +3 Magical Defence. GRANTS: Spell Resistance.",
            "icon": "ðŸ“¿",
            "price": {
                "gold": 1,
                "silver": 15
            },
            "rarity": "uncommon"
        },
        "amulet_of_earth": {
            "id": "amulet_of_earth",
            "name": "Amulet of Earth",
            "type": "accessory",
            "statModifiers": {
                "physicalDefence": 3,
                "hp": 3
            },
            "specialEffects": [
                "earth_resistance",
                "wind_weakness",
                "stone_skin"
            ],
            "desc": "An amulet of solid stone. +3 Physical Defence, +3 HP. Stone skin protection. GRANTS: Earth resistance 50% (-1), Wind weakness 200% (+1)",
            "icon": "ðŸŒ",
            "price": {
                "gold": 1,
                "silver": 18
            },
            "rarity": "rare"
        },
        "amulet_of_shadows": {
            "id": "amulet_of_shadows",
            "name": "Amulet of Shadows",
            "type": "accessory",
            "statModifiers": {
                "speed": 3,
                "magicalDefence": 2
            },
            "specialEffects": [
                "darkness_resistance",
                "light_weakness",
                "shadow_stealth"
            ],
            "desc": "An amulet wreathed in darkness. +3 Speed, +2 Magical Defence. Shadow stealth. GRANTS: Darkness resistance 50% (-1), Light weakness 200% (+1)",
            "icon": "ðŸŒ‘",
            "price": {
                "gold": 1,
                "silver": 22
            },
            "rarity": "rare"
        },
        "amulet_of_light": {
            "id": "amulet_of_light",
            "name": "Amulet of Light",
            "type": "accessory",
            "statModifiers": {
                "magicPower": 2,
                "magicalDefence": 3
            },
            "specialEffects": [
                "light_resistance",
                "darkness_weakness",
                "radiant_aura",
                "undead_bane"
            ],
            "desc": "An amulet glowing with holy light. +2 Magic Power, +3 Magical Defence. Radiant aura, extra damage vs undead. GRANTS: Light resistance 50% (-1), Darkness weakness 200% (+1)",
            "icon": "âœ¨",
            "price": {
                "gold": 1,
                "silver": 25
            },
            "rarity": "rare"
        },
        "cloak_of_elvenkind": {
            "id": "cloak_of_elvenkind",
            "name": "Cloak of Elvenkind",
            "type": "accessory",
            "statModifiers": {
                "speed": 2,
                "magicalDefence": 2
            },
            "specialEffects": [
                "stealth",
                "nature_resistance"
            ],
            "desc": "An elven cloak. +2 Speed, +2 Magical Defence. Enhanced stealth and nature resistance.",
            "icon": "ðŸ§¥",
            "price": {
                "gold": 1,
                "silver": 50
            },
            "rarity": "rare"
        },
        "cloak_of_displacement": {
            "id": "cloak_of_displacement",
            "name": "Cloak of Displacement",
            "type": "accessory",
            "statModifiers": {
                "speed": 1,
                "physicalDefence": 2,
                "magicalDefence": 2
            },
            "specialEffects": [
                "mirror_image"
            ],
            "desc": "A shimmering cloak. +1 Speed, +2 Physical Defence, +2 Magical Defence. Creates mirror images. GRANTS: Mirror Image.",
            "icon": "ðŸª©",
            "price": {
                "gold": 2,
                "silver": 25
            },
            "rarity": "epic"
        },
        "lucky_coin": {
            "id": "lucky_coin",
            "name": "Lucky Coin",
            "type": "accessory",
            "statModifiers": {},
            "specialEffects": [
                "critical_chance",
                "luck"
            ],
            "desc": "An ancient lucky coin. Increases critical hit chance and general luck. GRANTS: Critical Chance, Luck.",
            "icon": "ðŸª™",
            "price": {
                "silver": 20
            },
            "rarity": "uncommon"
        },
        "crystal_monocle": {
            "id": "crystal_monocle",
            "name": "Crystal Monocle",
            "type": "accessory",
            "statModifiers": {
                "magicPower": 2
            },
            "specialEffects": [
                "magic_sight",
                "identify"
            ],
            "desc": "A monocle made of pure crystal. +2 Magic Power. See magical auras and identify items. GRANTS: Magic Sight, Identify.",
            "icon": "ðŸ§",
            "price": {
                "gold": 1,
                "silver": 0
            },
            "rarity": "rare"
        },
        "gauntlets_of_ogre_power": {
            "id": "gauntlets_of_ogre_power",
            "name": "Gauntlets of Ogre Power",
            "type": "accessory",
            "statModifiers": {
                "strength": 4,
                "speed": -1
            },
            "specialEffects": [
                "crush"
            ],
            "desc": "Massive gauntlets. +4 Strength, -1 Speed. Can crush armor and weapons.",
            "icon": "ðŸ§¤",
            "price": {
                "gold": 1,
                "silver": 60
            },
            "rarity": "rare"
        },
        "belt_of_giant_strength": {
            "id": "belt_of_giant_strength",
            "name": "Belt of Giant Strength",
            "type": "accessory",
            "statModifiers": {
                "strength": 3,
                "hp": 3
            },
            "specialEffects": [],
            "desc": "A belt crafted by giants. +3 Strength, +3 HP. Increases carrying capacity.",
            "icon": "ðŸ”—",
            "price": {
                "gold": 1,
                "silver": 40
            },
            "rarity": "uncommon"
        },
        "headband_of_intellect": {
            "id": "headband_of_intellect",
            "name": "Headband of Intellect",
            "type": "accessory",
            "statModifiers": {
                "magicPower": 3,
                "stamina": 2
            },
            "specialEffects": [
                "spell_memory"
            ],
            "desc": "A scholarly headband. +3 Magic Power, +2 Stamina. Remember more spells. GRANTS: Spell Memory.",
            "icon": "ðŸŽ¯",
            "price": {
                "gold": 1,
                "silver": 35
            },
            "rarity": "uncommon"
        },
        "eagle_eye_pendant": {
            "id": "eagle_eye_pendant",
            "name": "Eagle Eye Pendant",
            "type": "accessory",
            "statModifiers": {
                "accuracy": 2
            },
            "specialEffects": [
                "keen_sight"
            ],
            "desc": "A pendant carved with an eagle's eye. +2 Accuracy. See targets more clearly. GRANTS: Keen Sight.",
            "icon": "👁️",
            "price": {
                "silver": 30
            },
            "rarity": "uncommon"
        },
        "marksman_gloves": {
            "id": "marksman_gloves",
            "name": "Marksman's Gloves",
            "type": "accessory",
            "statModifiers": {
                "accuracy": 1,
                "speed": 1
            },
            "specialEffects": [
                "steady_hands"
            ],
            "desc": "Precision gloves worn by expert marksmen. +1 Accuracy, +1 Speed. Reduces hand tremor. GRANTS: Steady Hands.",
            "icon": "🧤",
            "price": {
                "silver": 25
            },
            "rarity": "common"
        },
        "precision_scope": {
            "id": "precision_scope",
            "name": "Precision Scope",
            "type": "accessory",
            "statModifiers": {
                "accuracy": 3,
                "speed": -1
            },
            "specialEffects": [
                "long_range_sight"
            ],
            "desc": "A masterwork telescopic scope. +3 Accuracy, -1 Speed. See and hit distant targets. GRANTS: Long Range Sight.",
            "icon": "🔭",
            "price": {
                "gold": 1,
                "silver": 15
            },
            "rarity": "rare"
        },
        "hunter_focus_charm": {
            "id": "hunter_focus_charm",
            "name": "Hunter's Focus Charm",
            "type": "accessory",
            "statModifiers": {
                "accuracy": 1,
                "physicalDefence": 1
            },
            "specialEffects": [
                "concentration"
            ],
            "desc": "A charm that sharpens focus and awareness. +1 Accuracy, +1 Physical Defence. GRANTS: Concentration while sustaining a channeled spell or toggle.",
            "icon": "🔮",
            "price": {
                "silver": 20
            },
            "rarity": "common"
        }
    },
    "consumables": {
        "apple": {
            "id": "apple",
            "name": "Apple",
            "type": "consumable",
            "statModifiers": {},
            "specialEffects": [
                "heal_2"
            ],
            "desc": "A fresh apple. Restores 2 HP when consumed. GRANTS: Heal 2.",
            "icon": "ðŸŽ",
            "price": {
                "copper": 1
            },
            "rarity": "common",
            "stackable": true
        },
        "bread": {
            "id": "bread",
            "name": "Bread",
            "type": "consumable",
            "statModifiers": {},
            "specialEffects": [
                "heal_5"
            ],
            "desc": "A simple loaf of bread. Restores 5 HP when consumed. GRANTS: Heal 5.",
            "icon": "ðŸž",
            "price": {
                "copper": 5
            },
            "rarity": "common",
            "stackable": true
        },
        "cheese": {
            "id": "cheese",
            "name": "Cheese",
            "type": "consumable",
            "statModifiers": {},
            "specialEffects": [
                "restore_stamina_2",
                "heal_3"
            ],
            "desc": "Aged cheese. Restores 3 HP and 2 Stamina when consumed. GRANTS: Heal 3, Restore Stamina 2.",
            "icon": "ï¿½",
            "price": {
                "copper": 8
            },
            "rarity": "common",
            "stackable": true
        },
        "meat_ration": {
            "id": "meat_ration",
            "name": "Meat Ration",
            "type": "consumable",
            "statModifiers": {},
            "specialEffects": [
                "temp_strength_1",
                "heal_8"
            ],
            "desc": "Preserved meat. Restores 8 HP and temporarily boosts Strength by 1 for 5 turns. GRANTS: Heal 8, Temp Strength 1.",
            "icon": "ðŸ¥©",
            "price": {
                "silver": 1
            },
            "rarity": "common",
            "stackable": true
        },
        "wine": {
            "id": "wine",
            "name": "Wine",
            "type": "consumable",
            "statModifiers": {},
            "specialEffects": [
                "restore_stamina_5",
                "temp_magic_1"
            ],
            "desc": "Fine wine. Restores 5 Stamina and temporarily boosts Magic Power by 1 for 3 turns. GRANTS: Restore Stamina 5, Temp Magic 1.",
            "icon": "ðŸ·",
            "price": {
                "silver": 2
            },
            "rarity": "common",
            "stackable": true
        },
        "health_potion": {
            "id": "health_potion",
            "name": "Health Potion",
            "type": "consumable",
            "statModifiers": {},
            "specialEffects": [
                "heal_25"
            ],
            "desc": "Restores 25 HP when consumed. GRANTS: Heal 25.",
            "icon": "ðŸ§ª",
            "price": {
                "silver": 2
            },
            "rarity": "common",
            "stackable": true,
            "craftingRecipe": {
                "materials": [
                    {
                        "id": "herbs",
                        "quantity": 2
                    }
                ],
                "quantity": 2,
                "skillRequired": 1
            }
        },
        "stamina_potion": {
            "id": "stamina_potion",
            "name": "Stamina Potion",
            "type": "consumable",
            "statModifiers": {},
            "specialEffects": [
                "restore_stamina_15"
            ],
            "desc": "Restores 15 Stamina when consumed. GRANTS: Restore Stamina 15.",
            "icon": "âš¡",
            "price": {
                "silver": 1,
                "copper": 50
            },
            "rarity": "common",
            "stackable": true
        },
        "greater_health_potion": {
            "id": "greater_health_potion",
            "name": "Greater Health Potion",
            "type": "consumable",
            "statModifiers": {},
            "specialEffects": [
                "heal_50"
            ],
            "desc": "A more potent healing potion. Restores 50 HP when consumed. GRANTS: Heal 50.",
            "icon": "ðŸ§ª",
            "price": {
                "silver": 8
            },
            "rarity": "uncommon",
            "stackable": true
        },
        "superior_stamina_potion": {
            "id": "superior_stamina_potion",
            "name": "Superior Stamina Potion",
            "type": "consumable",
            "statModifiers": {},
            "specialEffects": [
                "restore_stamina_30"
            ],
            "desc": "A potent energy potion. Restores 30 Stamina when consumed. GRANTS: Restore Stamina 30.",
            "icon": "âš¡",
            "price": {
                "silver": 6
            },
            "rarity": "uncommon",
            "stackable": true
        },
        "strength_elixir": {
            "id": "strength_elixir",
            "name": "Elixir of Strength",
            "type": "consumable",
            "statModifiers": {},
            "specialEffects": [
                "temp_strength_3"
            ],
            "desc": "Temporarily increases Strength by 3 for 10 turns. GRANTS: Temp Strength 3.",
            "icon": "ðŸ’ª",
            "price": {
                "silver": 15
            },
            "rarity": "uncommon",
            "stackable": true
        },
        "speed_elixir": {
            "id": "speed_elixir",
            "name": "Elixir of Speed",
            "type": "consumable",
            "statModifiers": {},
            "specialEffects": [
                "temp_speed_3"
            ],
            "desc": "Temporarily increases Speed by 3 for 8 turns. GRANTS: Temp Speed 3.",
            "icon": "ðŸ’¨",
            "price": {
                "silver": 15
            },
            "rarity": "uncommon",
            "stackable": true
        },
        "magic_elixir": {
            "id": "magic_elixir",
            "name": "Elixir of Magic",
            "type": "consumable",
            "statModifiers": {},
            "specialEffects": [
                "temp_magic_3"
            ],
            "desc": "Temporarily increases Magic Power by 3 for 10 turns. GRANTS: Temp Magic 3.",
            "icon": "âœ¨",
            "price": {
                "silver": 18
            },
            "rarity": "uncommon",
            "stackable": true
        },
        "defense_elixir": {
            "id": "defense_elixir",
            "name": "Elixir of Defense",
            "type": "consumable",
            "statModifiers": {},
            "specialEffects": [
                "temp_defense_4"
            ],
            "desc": "Temporarily increases both defenses by 4 for 12 turns. GRANTS: Temp Defense 4.",
            "icon": "ðŸ›¡ï¸",
            "price": {
                "silver": 20
            },
            "rarity": "uncommon",
            "stackable": true
        },
        "invisibility_potion": {
            "id": "invisibility_potion",
            "name": "Potion of Invisibility",
            "type": "consumable",
            "statModifiers": {},
            "specialEffects": [
                "invisibility_5_turns",
                "invisibility"
            ],
            "desc": "Grants invisibility for 5 turns. Enemies cannot target you. GRANTS: Invisibility 5 Turns.",
            "icon": "ðŸ‘»",
            "price": {
                "gold": 1,
                "silver": 10
            },
            "rarity": "rare",
            "stackable": true
        },
        "fire_resistance_potion": {
            "id": "fire_resistance_potion",
            "name": "Fire Resistance Potion",
            "type": "consumable",
            "statModifiers": {},
            "specialEffects": [
                "fire_immunity_10_turns",
                "fire_immunity"
            ],
            "desc": "Grants immunity to fire damage for 10 turns. GRANTS: Fire Immunity 10 Turns.",
            "icon": "ðŸ”¥",
            "price": {
                "silver": 25
            },
            "rarity": "uncommon",
            "stackable": true
        },
        "ice_resistance_potion": {
            "id": "ice_resistance_potion",
            "name": "Ice Resistance Potion",
            "type": "consumable",
            "statModifiers": {},
            "specialEffects": [
                "cold_immunity_10_turns"
            ],
            "desc": "Grants immunity to cold damage for 10 turns. GRANTS: Cold Immunity 10 Turns.",
            "icon": "â„ï¸",
            "price": {
                "silver": 25
            },
            "rarity": "uncommon",
            "stackable": true
        },
        "berserker_potion": {
            "id": "berserker_potion",
            "name": "Berserker Potion",
            "type": "consumable",
            "statModifiers": {},
            "specialEffects": [
                "temp_defense_minus_2",
                "temp_strength_5",
                "temp_speed_2"
            ],
            "desc": "Enter a berserker rage! +5 Strength, +2 Speed, -2 Defense for 8 turns. GRANTS: Temp Strength 5, Temp Speed 2, Temp Defense Minus 2.",
            "icon": "ðŸ˜¤",
            "price": {
                "gold": 1,
                "silver": 5
            },
            "rarity": "rare",
            "stackable": true
        },
        "scroll_of_fireball": {
            "id": "scroll_of_fireball",
            "name": "Scroll of Fireball",
            "type": "consumable",
            "statModifiers": {},
            "specialEffects": [
                "cast_fireball"
            ],
            "desc": "A magical scroll. Allows casting Fireball spell once, even without magic skills. GRANTS: Cast Fireball.",
            "icon": "ðŸ“œ",
            "price": {
                "silver": 30
            },
            "rarity": "uncommon",
            "stackable": true
        },
        "scroll_of_healing": {
            "id": "scroll_of_healing",
            "name": "Scroll of Healing",
            "type": "consumable",
            "statModifiers": {},
            "specialEffects": [
                "remove_poison",
                "heal_40"
            ],
            "desc": "A divine scroll. Restores 40 HP and removes poison effects. GRANTS: Heal 40, Remove Poison.",
            "icon": "ðŸ“œ",
            "price": {
                "silver": 35
            },
            "rarity": "uncommon",
            "stackable": true
        },
        "scroll_of_teleport": {
            "id": "scroll_of_teleport",
            "name": "Scroll of Teleport",
            "type": "consumable",
            "statModifiers": {},
            "specialEffects": [
                "teleport"
            ],
            "desc": "A dimensional scroll. Instantly teleport to a safe location, escaping combat.",
            "icon": "ðŸ“œ",
            "price": {
                "gold": 1,
                "silver": 0
            },
            "rarity": "rare",
            "stackable": true
        },
        "phoenix_feather": {
            "id": "phoenix_feather",
            "name": "Phoenix Feather",
            "type": "consumable",
            "statModifiers": {},
            "specialEffects": [
                "remove_all_debuffs",
                "full_heal",
                "fire_immunity_permanent"
            ],
            "desc": "A legendary phoenix feather. Full heal, remove all debuffs, permanent fire immunity. GRANTS: Full Heal, Remove All Debuffs, Fire Immunity Permanent.",
            "icon": "ðŸª¶",
            "price": {
                "gold": 5,
                "silver": 0
            },
            "rarity": "legendary",
            "stackable": true
        },
        "dragon_heart": {
            "id": "dragon_heart",
            "name": "Dragon Heart",
            "type": "consumable",
            "statModifiers": {},
            "specialEffects": [
                "permanent_strength_2",
                "permanent_hp_5",
                "dragon_breath"
            ],
            "desc": "The heart of an ancient dragon. Permanently increases HP by 5, Strength by 2, grants dragon breath. GRANTS: Permanent HP 5, Permanent Strength 2, Dragon Breath.",
            "icon": "â¤ï¸",
            "price": {
                "gold": 10,
                "silver": 0
            },
            "rarity": "legendary",
            "stackable": true
        },
        "elixir_of_immortality": {
            "id": "elixir_of_immortality",
            "name": "Elixir of Immortality",
            "type": "consumable",
            "statModifiers": {},
            "specialEffects": [
                "regeneration_permanent",
                "permanent_all_stats_1",
                "regeneration"
            ],
            "desc": "The ultimate elixir. Permanently increases all stats by 1 and grants eternal regeneration. GRANTS: Permanent All Stats 1, Regeneration Permanent.",
            "icon": "âš—ï¸",
            "price": {
                "gold": 25,
                "silver": 0
            },
            "rarity": "legendary",
            "stackable": false
        },
        "lockpick_set": {
            "id": "lockpick_set",
            "name": "Lockpick Set",
            "type": "consumable",
            "statModifiers": {},
            "specialEffects": [
                "unlock_doors"
            ],
            "desc": "A set of fine lockpicks. Can open locked doors and chests. GRANTS: Unlock Doors.",
            "icon": "ðŸ—ï¸",
            "price": {
                "silver": 8
            },
            "rarity": "common",
            "stackable": true
        },
        "rope": {
            "id": "rope",
            "name": "Rope",
            "type": "consumable",
            "statModifiers": {},
            "specialEffects": [
                "climb_assistance"
            ],
            "desc": "50 feet of sturdy rope. Useful for climbing and exploration. GRANTS: Climb Assistance.",
            "icon": "ðŸª¢",
            "price": {
                "silver": 3
            },
            "rarity": "common",
            "stackable": true
        },
        "torch": {
            "id": "torch",
            "name": "Torch",
            "type": "consumable",
            "statModifiers": {},
            "specialEffects": [
                "light_source",
                "fire_damage"
            ],
            "desc": "A burning torch. Provides light and can be used as a weapon. GRANTS: Light Source, Fire Damage.",
            "icon": "ðŸ”¦",
            "price": {
                "copper": 50
            },
            "rarity": "common",
            "stackable": true
        },
        "holy_water": {
            "id": "holy_water",
            "name": "Holy Water",
            "type": "consumable",
            "statModifiers": {},
            "specialEffects": [
                "purify",
                "undead_damage"
            ],
            "desc": "Blessed water. Deals extra damage to undead and purifies corruption. GRANTS: Undead Damage, Purify.",
            "icon": "ðŸ’§",
            "price": {
                "silver": 12
            },
            "rarity": "uncommon",
            "stackable": true
        }
    },
    "materials": {
        "iron_ore": {
            "id": "iron_ore",
            "name": "Iron Ore",
            "type": "material",
            "statModifiers": {},
            "specialEffects": [],
            "desc": "Raw iron ore. Used for crafting iron weapons and armor.",
            "icon": "â›ï¸",
            "price": {
                "copper": 20
            },
            "rarity": "common",
            "stackable": true
        },
        "wood": {
            "id": "wood",
            "name": "Wood",
            "type": "material",
            "statModifiers": {},
            "specialEffects": [],
            "desc": "Sturdy wood. Used for crafting wooden weapons and tools.",
            "icon": "ðŸªµ",
            "price": {
                "copper": 5
            },
            "rarity": "common",
            "stackable": true
        },
        "leather": {
            "id": "leather",
            "name": "Leather",
            "type": "material",
            "statModifiers": {},
            "specialEffects": [],
            "desc": "Tanned leather. Used for crafting light armor and accessories.",
            "icon": "ðŸ¦¬",
            "price": {
                "copper": 15
            },
            "rarity": "common",
            "stackable": true
        },
        "herbs": {
            "id": "herbs",
            "name": "Medicinal Herbs",
            "type": "material",
            "statModifiers": {},
            "specialEffects": [],
            "desc": "Fresh medicinal herbs. Used for brewing potions.",
            "icon": "ðŸŒ¿",
            "price": {
                "copper": 8
            },
            "rarity": "common",
            "stackable": true
        },
        "crystal": {
            "id": "crystal",
            "name": "Mana Crystal",
            "type": "material",
            "statModifiers": {},
            "specialEffects": [],
            "desc": "A crystal charged with magical energy. Used for enchanting.",
            "icon": "ðŸ’Ž",
            "price": {
                "silver": 2
            },
            "rarity": "uncommon",
            "stackable": true
        }
    }
};

window.ITEMS_DATA = ITEMS_DATA;
