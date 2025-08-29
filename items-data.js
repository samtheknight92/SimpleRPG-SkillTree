// Items Data - Equipment and consumables for the RPG system
// Complete replacement following SHOP_EXPANSION_IDEAS.md
const ITEMS_DATA = {
    weapons: {
        // SWORDS - Complete replacement following SHOP_EXPANSION_IDEAS.md
        // TIER 1
        rusty_sword: {
            id: "rusty_sword",
            name: "Rusty Sword",
            type: "weapon",
            subcategory: "swords",
            shopItem: true,
            craftableItem: true,
            craftingCategory: "Smithing",
            craftingMaterials: [
                { id: "copper_ingot", quantity: 1 },
                { id: "thick_hide", quantity: 1 }
            ],
            requiredSkills: ["smithing_basic"],
            damage: "1d4",
            statModifiers: {},
            specialEffects: [],
            enchantmentSlots: 0,
            desc: "A rusty old sword. Basic weapon. Damage: 1d4",
            icon: "🗡️",
            price: 10,
            rarity: "common"
        },

        // TIER 2
        iron_sword: {
            id: "iron_sword",
            name: "Iron Sword",
            type: "weapon",
            subcategory: "swords",
            shopItem: true,
            craftableItem: true,
            craftingCategory: "Smithing",
            craftingMaterials: [
                { id: "iron_ingot", quantity: 2 },
                { id: "leather_grip", quantity: 1 }
            ],
            requiredSkills: ["smithing_basic"],
            damage: "1d6",
            statModifiers: { strength: 2 },
            specialEffects: [],
            enchantmentSlots: 0,
            desc: "A basic iron sword. +2 Strength. Damage: 1d6",
            icon: "🗡️",
            price: 30,
            rarity: "common"
        },
        short_sword: {
            id: "short_sword",
            name: "Short Sword",
            type: "weapon",
            subcategory: "swords",
            shopItem: true,
            craftableItem: true,
            craftingCategory: "Smithing",
            craftingMaterials: [
                { id: "iron_ingot", quantity: 2 },
                { id: "sharp_claws", quantity: 3 },
                { id: "leather_strap", quantity: 1 }
            ],
            requiredSkills: ["smithing_basic"],
            damage: "1d6",
            statModifiers: { speed: 1 },
            specialEffects: [],
            enchantmentSlots: 0,
            desc: "A nimble short sword. +1 Speed. Damage: 1d6",
            icon: "🗡️",
            price: 30,
            rarity: "common"
        },

        // TIER 3
        steel_sword: {
            id: "steel_sword",
            name: "Steel Sword",
            type: "weapon",
            subcategory: "swords",
            shopItem: true,
            craftableItem: true,
            craftingCategory: "Smithing",
            craftingMaterials: [
                { id: "steel_ingot", quantity: 2 },
                { id: "leather_grip", quantity: 1 },
                { id: "sharpening_stone", quantity: 1 }
            ],
            requiredSkills: ["smithing_basic"],
            damage: "1d8",
            statModifiers: { strength: 3 },
            specialEffects: [],
            enchantmentSlots: 0,
            desc: "A well-forged steel sword. +3 Strength. Damage: 1d8",
            icon: "⚔️",
            price: 60,
            rarity: "common"
        },
        bronze_sword: {
            id: "bronze_sword",
            name: "Bronze Sword",
            type: "weapon",
            subcategory: "swords",
            shopItem: true,
            craftableItem: true,
            craftingCategory: "Smithing",
            craftingMaterials: [
                { id: "copper_ingot", quantity: 3 },
                { id: "thick_hide", quantity: 2 },
                { id: "strength_essence", quantity: 1 }
            ],
            requiredSkills: ["smithing_basic"],
            damage: "1d8",
            statModifiers: { strength: 1, physicalDefence: 1 },
            specialEffects: [],
            enchantmentSlots: 0,
            desc: "A bronze sword with good balance. +1 Strength, +1 Physical Defence. Damage: 1d8",
            icon: "🗡️",
            price: 60,
            rarity: "common"
        },
        guards_sword: {
            id: "guards_sword",
            name: "Guard's Sword",
            type: "weapon",
            subcategory: "swords",
            shopItem: true,
            craftableItem: false,
            craftingCategory: "Smithing",
            craftingMaterials: [
                { id: "iron_ingot", quantity: 2 },
                { id: "precision_essence", quantity: 1 },
                { id: "leather_strap", quantity: 1 }
            ],
            requiredSkills: ["smithing_basic"],
            damage: "1d8",
            statModifiers: { strength: 1, accuracy: 1 },
            specialEffects: [],
            enchantmentSlots: 0,
            desc: "A precise guard's sword. +1 Strength, +1 Accuracy. Damage: 1d8",
            icon: "🗡️",
            price: 60,
            rarity: "common"
        },

        // TIER 4
        silver_sword: {
            id: "silver_sword",
            name: "Silver Sword",
            type: "weapon",
            subcategory: "swords",
            shopItem: true,
            craftableItem: true,
            craftingCategory: "Smithing",
            craftingMaterials: [
                { id: "silver_ingot", quantity: 2 },
                { id: "leather_grip", quantity: 1 },
                { id: "magic_essence", quantity: 1 }
            ],
            requiredSkills: ["smithing_advanced"],
            damage: "1d8",
            statModifiers: { strength: 4, magic: 1 },
            specialEffects: [],
            enchantmentSlots: 0,
            desc: "A silver sword with magical properties. +4 Strength, +1 Magic. Damage: 1d8",
            icon: "🗡️",
            price: 90,
            rarity: "uncommon"
        },
        mithril_sword: {
            id: "mithril_sword",
            name: "Mithril Sword",
            type: "weapon",
            subcategory: "swords",
            shopItem: false,
            craftableItem: true,
            craftingCategory: "Smithing",
            craftingMaterials: [
                { id: "mithril_ingot", quantity: 2 },
                { id: "leather_grip", quantity: 1 },
                { id: "sharpening_stone", quantity: 2 }
            ],
            requiredSkills: ["smithing_advanced"],
            damage: "1d10",
            statModifiers: { strength: 5, speed: 2 },
            specialEffects: [],
            enchantmentSlots: 0,
            desc: "A mithril sword of exceptional quality. +5 Strength, +2 Speed. Damage: 1d10",
            icon: "🗡️",
            price: 120,
            rarity: "uncommon"
        },
        thunder_hammer: {
            id: "thunder_hammer",
            name: "Thunder Hammer",
            type: "weapon",
            subcategory: "hammers",
            shopItem: false,
            craftableItem: true,
            craftingCategory: "Smithing",
            craftingMaterials: [
                { id: "steel_ingot", quantity: 2 },
                { id: "lightning_essence", quantity: 2 },
                { id: "wooden_handle", quantity: 1 }
            ],
            requiredSkills: ["smithing_advanced"],
            damage: "1d12 + thunder chance",
            statModifiers: { strength: 6 },
            specialEffects: [],
            enchantmentSlots: 0,
            desc: "A hammer crackling with thunder. +6 Strength. Damage: 1d12 + thunder chance",
            icon: "🔨",
            price: 120,
            rarity: "uncommon"
        },
        crystal_hammer: {
            id: "crystal_hammer",
            name: "Crystal Hammer",
            type: "weapon",
            subcategory: "hammers",
            shopItem: false,
            craftableItem: true,
            craftingCategory: "Smithing",
            craftingMaterials: [
                { id: "steel_ingot", quantity: 2 },
                { id: "crystal_essence", quantity: 2 },
                { id: "magic_essence", quantity: 1 }
            ],
            requiredSkills: ["smithing_advanced"],
            damage: "1d10",
            statModifiers: { strength: 4, magic: 3 },
            specialEffects: [],
            enchantmentSlots: 0,
            desc: "A hammer with crystal properties. +4 Strength, +3 Magic. Damage: 1d10",
            icon: "🔨",
            price: 110,
            rarity: "uncommon"
        },
        flame_sword: {
            id: "flame_sword",
            name: "Flame Sword",
            type: "weapon",
            subcategory: "swords",
            shopItem: false,
            craftableItem: true,
            craftingCategory: "Smithing",
            craftingMaterials: [
                { id: "steel_ingot", quantity: 2 },
                { id: "fire_essence", quantity: 2 },
                { id: "magic_essence", quantity: 1 }
            ],
            requiredSkills: ["smithing_advanced"],
            damage: "1d8 + 1d4 fire",
            statModifiers: { strength: 4, magic: 2 },
            specialEffects: [],
            enchantmentSlots: 0,
            desc: "A sword wreathed in flames. +4 Strength, +2 Magic. Damage: 1d8 + 1d4 fire",
            icon: "🔥",
            price: 100,
            rarity: "uncommon"
        },
        elven_sword: {
            id: "elven_sword",
            name: "Elven Sword",
            type: "weapon",
            subcategory: "swords",
            shopItem: true,
            craftableItem: false,
            craftingCategory: "Smithing",
            craftingMaterials: [
                { id: "silver_ingot", quantity: 2 },
                { id: "moonbell_flower", quantity: 2 },
                { id: "crystal_sage", quantity: 1 }
            ],
            requiredSkills: ["smithing_advanced"],
            damage: "1d8",
            statModifiers: { speed: 2 },
            specialEffects: ["natures_grace"],
            enchantmentSlots: 1,
            desc: "An elegant elven blade. +2 Speed. 10% chance to gain advantage on next attack roll against an enemy that attacked you. Damage: 1d8",
            icon: "🗡️",
            price: 90,
            rarity: "uncommon"
        },
        pirate_cutlass: {
            id: "pirate_cutlass",
            name: "Pirate Cutlass",
            type: "weapon",
            subcategory: "swords",
            shopItem: true,
            craftableItem: false,
            craftingCategory: "Smithing",
            craftingMaterials: [
                { id: "iron_ingot", quantity: 2 },
                { id: "wave_essence", quantity: 1 },
                { id: "sharp_claws", quantity: 2 }
            ],
            requiredSkills: ["smithing_basic"],
            damage: "1d8",
            statModifiers: { strength: 1, speed: 1 },
            specialEffects: ["riposte_efficiency"],
            enchantmentSlots: 1,
            desc: "A curved pirate's blade. +1 Strength, +1 Speed. Riposte skill costs 1 less stamina when wielding this weapon. Damage: 1d8",
            icon: "🗡️",
            price: 90,
            rarity: "uncommon"
        },

        // TIER 5
        flame_blade: {
            id: "flame_blade",
            name: "Flame Blade",
            type: "weapon",
            subcategory: "swords",
            shopItem: true,
            craftableItem: false,
            damage: "1d10",
            statModifiers: { strength: 2, physicalDefence: 2 },
            specialEffects: ["burn_on_hit"],
            enchantmentSlots: 2,
            elementalAffinities: {
                resistances: { fire: -1 },
                weaknesses: { ice: +1 }
            },
            desc: "A magical sword wreathed in flames. +2 Strength, +2 Physical Defence. 10% chance to apply Burn. Damage: 1d10",
            icon: "🔥",
            price: 180,
            rarity: "rare"
        },
        frostbrand: {
            id: "frostbrand",
            name: "Frostbrand",
            type: "weapon",
            subcategory: "swords",
            shopItem: true,
            craftableItem: false,
            damage: "1d10",
            statModifiers: { strength: 2, magicPower: 1 },
            specialEffects: ["immobilize_on_hit"],
            enchantmentSlots: 2,
            elementalAffinities: {
                resistances: { ice: -1 },
                weaknesses: { fire: +1 }
            },
            desc: "An ice-enchanted blade. +2 Strength, +1 Magic Power. 10% chance to apply Immobilized. Damage: 1d10",
            icon: "❄️",
            price: 180,
            rarity: "rare"
        },
        shadow_sabre: {
            id: "shadow_sabre",
            name: "Shadow Sabre",
            type: "weapon",
            subcategory: "swords",
            shopItem: true,
            craftableItem: false,
            damage: "1d10",
            statModifiers: { speed: 2, accuracy: 1 },
            specialEffects: ["shadowing"],
            enchantmentSlots: 2,
            desc: "A blade wreathed in shadows. +2 Speed, +1 Accuracy. Once per battle, next attack against you has disadvantage. Damage: 1d10",
            icon: "🌑",
            price: 180,
            rarity: "rare"
        },
        knights_blade: {
            id: "knights_blade",
            name: "Knight's Blade",
            type: "weapon",
            subcategory: "swords",
            shopItem: true,
            craftableItem: false,
            damage: "1d10",
            statModifiers: { strength: 3 },
            specialEffects: ["rally"],
            enchantmentSlots: 2,
            desc: "A noble knight's weapon. +3 Strength. On crit, all allies gain advantage on their next attack roll. Damage: 1d10",
            icon: "⚔️",
            price: 180,
            rarity: "rare"
        },

        // TIER 6
        wind_blade: {
            id: "wind_blade",
            name: "Wind Blade",
            type: "weapon",
            subcategory: "swords",
            shopItem: true,
            craftableItem: false,
            damage: "1d12",
            statModifiers: { speed: 3, strength: 2 },
            specialEffects: ["sweeping_slash_efficiency"],
            enchantmentSlots: 2,
            desc: "A sword light as air. +3 Speed, +2 Strength. Sweeping Slash skill costs 2 less stamina when wielding this weapon. Damage: 1d12",
            icon: "🌪️",
            price: 320,
            rarity: "rare"
        },
        crystal_sword: {
            id: "crystal_sword",
            name: "Crystal Sword",
            type: "weapon",
            subcategory: "swords",
            shopItem: true,
            craftableItem: false,
            damage: "1d12",
            statModifiers: { strength: 2, magicPower: 2, magicalDefence: 1 },
            specialEffects: ["stamina_leech"],
            enchantmentSlots: 2,
            desc: "A crystalline blade of power. +2 Strength, +2 Magic Power, +1 Magical Defence. Decrease enemy's Stamina by 2 and Restore 2 stamina for yourself on hit. Damage: 1d12",
            icon: "💎",
            price: 320,
            rarity: "rare"
        },
        sunblade: {
            id: "sunblade",
            name: "Sunblade",
            type: "weapon",
            subcategory: "swords",
            shopItem: true,
            craftableItem: false,
            damage: "1d12",
            statModifiers: { strength: 2, accuracy: 2 },
            specialEffects: ["blinding_flash"],
            enchantmentSlots: 2,
            desc: "A radiant sword of light. +2 Strength, +2 Accuracy. On crit, target has disadvantage on their next attack roll. Damage: 1d12",
            icon: "☀️",
            price: 320,
            rarity: "rare"
        },
        bloodletter: {
            id: "bloodletter",
            name: "Bloodletter",
            type: "weapon",
            subcategory: "swords",
            shopItem: true,
            craftableItem: false,
            damage: "1d12",
            statModifiers: { strength: 3, speed: 1 },
            specialEffects: ["bleed_on_hit"],
            enchantmentSlots: 2,
            desc: "A cruel crimson blade. +3 Strength, +1 Speed. 20% chance to apply Bleed status effect. Damage: 1d12",
            icon: "🩸",
            price: 320,
            rarity: "rare"
        },

        // TIER 7
        obsidian_blade: {
            id: "obsidian_blade",
            name: "Obsidian Blade",
            type: "weapon",
            subcategory: "swords",
            shopItem: true,
            craftableItem: false,
            damage: "2d6",
            statModifiers: { strength: 3, physicalDefence: 3 },
            specialEffects: ["parry_efficiency"],
            enchantmentSlots: 2,
            desc: "A razor-sharp obsidian blade. +3 Strength, +3 Physical Defence. Parry skill costs no stamina when wielding this weapon. Damage: 2d6",
            icon: "🖤",
            price: 340,
            rarity: "rare"
        },
        demon_sword: {
            id: "demon_sword",
            name: "Demon Sword",
            type: "weapon",
            subcategory: "swords",
            shopItem: true,
            craftableItem: false,
            damage: "2d6",
            statModifiers: { strength: 3, magicPower: 2, magicalDefence: 1 },
            specialEffects: ["life_drain"],
            enchantmentSlots: 2,
            desc: "A blade of dark power. +3 Strength, +2 Magic Power, +1 Magical Defence. Heal for 25% of damage dealt. Damage: 2d6",
            icon: "👹",
            price: 340,
            rarity: "rare"
        },
        paladins_sword: {
            id: "paladins_sword",
            name: "Paladin's Sword",
            type: "weapon",
            subcategory: "swords",
            shopItem: true,
            craftableItem: false,
            damage: "2d6",
            statModifiers: { strength: 3, physicalDefence: 2, magicalDefence: 2 },
            specialEffects: ["holy_smite"],
            enchantmentSlots: 2,
            desc: "A holy blade of righteousness. +3 Strength, +2 Physical Defence, +2 Magical Defence. On crit, deal 2d8 Light damage. Damage: 2d6",
            icon: "✨",
            price: 340,
            rarity: "rare"
        },
        light_sabre: {
            id: "light_sabre",
            name: "Light Sabre",
            type: "weapon",
            subcategory: "swords",
            shopItem: true,
            craftableItem: false,
            damage: "2d6",
            statModifiers: { strength: 2, speed: 2 },
            specialEffects: ["light_ray_efficiency"],
            enchantmentSlots: 2,
            desc: "A blade of pure light energy. +2 Strength, +2 Speed. Light Ray skill costs 3 less stamina when wielding this weapon. Damage: 2d6",
            icon: "💫",
            price: 340,
            rarity: "rare"
        },

        // TIER 8
        dragon_blade: {
            id: "dragon_blade",
            name: "Dragon Blade",
            type: "weapon",
            subcategory: "swords",
            shopItem: true,
            craftableItem: false,
            damage: "2d8",
            statModifiers: { strength: 4, physicalDefence: 3 },
            specialEffects: ["fire_breath"],
            enchantmentSlots: 1,
            desc: "Forged from dragon scales. +4 Strength, +3 Physical Defence. Once per battle, cone attack: 3d8 fire damage. Damage: 2d8",
            icon: "🐉",
            price: 500,
            rarity: "legendary"
        },
        void_sword: {
            id: "void_sword",
            name: "Void Sword",
            type: "weapon",
            subcategory: "swords",
            shopItem: true,
            craftableItem: false,
            damage: "2d8",
            statModifiers: { strength: 3, magicPower: 3, magicalDefence: 2 },
            specialEffects: ["piercing_thrust_efficiency"],
            enchantmentSlots: 1,
            desc: "A blade from the void realm. +3 Strength, +3 Magic Power, +2 Magical Defence. Piercing Thrust skill costs 2 less stamina when wielding this weapon. Damage: 2d8",
            icon: "🕳️",
            price: 500,
            rarity: "legendary"
        },
        celestial_sword: {
            id: "celestial_sword",
            name: "Celestial Sword",
            type: "weapon",
            subcategory: "swords",
            shopItem: true,
            craftableItem: false,
            damage: "2d8",
            statModifiers: { strength: 4, magicPower: 2, magicalDefence: 1 },
            specialEffects: ["starfall"],
            enchantmentSlots: 1,
            desc: "A blade blessed by the stars. +4 Strength, +2 Magic Power, +1 Magical Defence. On kill, 20% chance to shoot stars at all visible enemies: 2d10 Light Damage. Damage: 2d8",
            icon: "⭐",
            price: 500,
            rarity: "legendary"
        },

        // TIER 9
        temporal_blade: {
            id: "temporal_blade",
            name: "Temporal Blade",
            type: "weapon",
            subcategory: "swords",
            shopItem: true,
            craftableItem: false,
            damage: "2d10",
            statModifiers: { speed: 4, accuracy: 4, magicPower: 3 },
            specialEffects: ["double_strike"],
            enchantmentSlots: 1,
            desc: "A blade that cuts through time itself. +4 Speed, +4 Accuracy, +3 Magic Power. Can attempt to attack again. Damage: 2d10",
            icon: "⏰",
            price: 750,
            rarity: "legendary"
        },
        genesis_sword: {
            id: "genesis_sword",
            name: "Genesis Sword",
            type: "weapon",
            subcategory: "swords",
            shopItem: true,
            craftableItem: false,
            damage: "2d10",
            statModifiers: { strength: 5, physicalDefence: 3 },
            specialEffects: ["genesis_wave"],
            enchantmentSlots: 1,
            desc: "The first blade, origin of all swords. +5 Strength, +3 Physical Defence. Once per battle, deal 4d10 to all enemies - Become Immobilized. Damage: 2d10",
            icon: "🌌",
            price: 750,
            rarity: "legendary"
        },

        // DAGGERS - Following SHOP_EXPANSION_IDEAS.md
        // TIER 1
        rusty_dagger: {
            id: "rusty_dagger",
            name: "Rusty Dagger",
            type: "weapon",
            subcategory: "daggers",
            shopItem: true,
            craftableItem: true,
            craftingCategory: "Smithing",
            craftingMaterials: [
                { id: "copper_ingot", quantity: 1 },
                { id: "sharp_claws", quantity: 2 }
            ],
            requiredSkills: ["smithing_basic"],
            damage: "1d4",
            statModifiers: {},
            specialEffects: [],
            enchantmentSlots: 0,
            desc: "A rusty old dagger. Basic weapon. Damage: 1d4",
            icon: "🗡️",
            price: 10,
            rarity: "common"
        },

        // TIER 2
        iron_dagger: {
            id: "iron_dagger",
            name: "Iron Dagger",
            type: "weapon",
            subcategory: "daggers",
            shopItem: true,
            craftableItem: true,
            craftingCategory: "Smithing",
            craftingMaterials: [
                { id: "iron_ingot", quantity: 1 },
                { id: "leather_grip", quantity: 1 }
            ],
            requiredSkills: ["smithing_basic"],
            damage: "1d4",
            statModifiers: { strength: 1, speed: 2 },
            specialEffects: [],
            enchantmentSlots: 0,
            desc: "A basic iron dagger. +1 Strength, +2 Speed. Damage: 1d4",
            icon: "🗡️",
            price: 25,
            rarity: "common"
        },
        throwing_knife: {
            id: "throwing_knife",
            name: "Throwing Knife",
            type: "weapon",
            subcategory: "daggers",
            shopItem: true,
            craftableItem: true,
            craftingCategory: "Smithing",
            craftingMaterials: [
                { id: "iron_ingot", quantity: 1 },
                { id: "tail_spikes", quantity: 2 },
                { id: "leather_strap", quantity: 1 }
            ],
            requiredSkills: ["smithing_basic"],
            damage: "1d6",
            statModifiers: { accuracy: 1 },
            specialEffects: [],
            enchantmentSlots: 0,
            desc: "A balanced throwing knife. +1 Accuracy. Damage: 1d6",
            icon: "🗡️",
            price: 25,
            rarity: "common"
        },

        // TIER 3
        steel_dagger: {
            id: "steel_dagger",
            name: "Steel Dagger",
            type: "weapon",
            subcategory: "daggers",
            shopItem: true,
            craftableItem: true,
            craftingCategory: "Smithing",
            craftingMaterials: [
                { id: "steel_ingot", quantity: 1 },
                { id: "leather_grip", quantity: 1 },
                { id: "sharpening_stone", quantity: 1 }
            ],
            requiredSkills: ["smithing_basic"],
            damage: "1d6",
            statModifiers: { strength: 2, speed: 2 },
            specialEffects: [],
            enchantmentSlots: 0,
            desc: "A quality steel dagger. +2 Strength, +2 Speed. Damage: 1d6",
            icon: "🗡️",
            price: 45,
            rarity: "common"
        },
        parrying_dagger: {
            id: "parrying_dagger",
            name: "Parrying Dagger",
            type: "weapon",
            subcategory: "daggers",
            shopItem: true,
            craftableItem: true,
            craftingCategory: "Smithing",
            craftingMaterials: [
                { id: "iron_ingot", quantity: 2 },
                { id: "precision_essence", quantity: 1 },
                { id: "metallic_fragments", quantity: 1 }
            ],
            requiredSkills: ["smithing_basic"],
            damage: "1d8",
            statModifiers: { speed: 1, physicalDefence: 1 },
            specialEffects: [],
            enchantmentSlots: 0,
            desc: "A dagger designed for defense. +1 Speed, +1 Physical Defence. Damage: 1d8",
            icon: "🗡️",
            price: 50,
            rarity: "common"
        },
        hunters_knife: {
            id: "hunters_knife",
            name: "Hunter's Knife",
            type: "weapon",
            subcategory: "daggers",
            shopItem: true,
            craftableItem: false,
            craftingCategory: "Smithing",
            craftingMaterials: [
                { id: "iron_ingot", quantity: 2 },
                { id: "sharp_fangs", quantity: 2 },
                { id: "precision_essence", quantity: 1 }
            ],
            requiredSkills: ["smithing_basic"],
            damage: "1d8",
            statModifiers: { speed: 1, accuracy: 1 },
            specialEffects: [],
            enchantmentSlots: 0,
            desc: "A practical hunting blade. +1 Speed, +1 Accuracy. Damage: 1d8",
            icon: "🗡️",
            price: 50,
            rarity: "common"
        },

        // TIER 4
        silver_dagger: {
            id: "silver_dagger",
            name: "Silver Dagger",
            type: "weapon",
            subcategory: "daggers",
            shopItem: true,
            craftableItem: false,
            damage: "1d8",
            statModifiers: { speed: 1, physicalDefence: 1 },
            specialEffects: ["undead_bane"],
            enchantmentSlots: 0,
            desc: "A blessed silver dagger. +1 Speed, +1 Physical Defence. Undead Bane: +50% damage to undead creatures. Damage: 1d8",
            icon: "🗡️",
            price: 75,
            rarity: "uncommon"
        },
        elven_stiletto: {
            id: "elven_stiletto",
            name: "Elven Stiletto",
            type: "weapon",
            subcategory: "daggers",
            shopItem: true,
            craftableItem: false,
            damage: "1d8",
            statModifiers: { accuracy: 2 },
            specialEffects: ["precision_strike"],
            enchantmentSlots: 0,
            desc: "An elegant elven blade. +2 Accuracy. Precision Strike: Natural rolls of 18-20 are critical hits. Damage: 1d8",
            icon: "🗡️",
            price: 90,
            rarity: "uncommon"
        },
        rogues_blade: {
            id: "rogues_blade",
            name: "Rogue's Blade",
            type: "weapon",
            subcategory: "daggers",
            shopItem: true,
            craftableItem: false,
            damage: "1d8",
            statModifiers: { speed: 1, strength: 1 },
            specialEffects: ["sneak_attack_efficiency"],
            enchantmentSlots: 0,
            desc: "A rogue's favored weapon. +1 Speed, +1 Strength. Sneak Attack skill costs 1 less stamina. Damage: 1d8",
            icon: "🗡️",
            price: 100,
            rarity: "uncommon"
        },

        // TIER 5
        flame_dagger: {
            id: "flame_dagger",
            name: "Flame Dagger",
            type: "weapon",
            subcategory: "daggers",
            shopItem: true,
            craftableItem: false,
            damage: "1d10",
            statModifiers: { speed: 2, accuracy: 2 },
            specialEffects: ["burn_chance"],
            enchantmentSlots: 1,
            desc: "A dagger wreathed in flames. +2 Speed, +2 Accuracy. 10% chance to apply Burn. Damage: 1d10",
            icon: "🔥",
            price: 150,
            rarity: "rare"
        },
        frost_needle: {
            id: "frost_needle",
            name: "Frost Needle",
            type: "weapon",
            subcategory: "daggers",
            shopItem: true,
            craftableItem: false,
            damage: "1d10",
            statModifiers: { speed: 2, magic: 1, magicalDefence: 1 },
            specialEffects: ["ice_shards"],
            enchantmentSlots: 1,
            desc: "An icy thin blade. +2 Speed, +1 Magic, +1 Magical Defence. Ice Shards: 25% chance to slow target (-2 Speed for 2 turns). Damage: 1d10",
            icon: "❄️",
            price: 175,
            rarity: "rare"
        },
        shadow_blade: {
            id: "shadow_blade",
            name: "Shadow Blade",
            type: "weapon",
            subcategory: "daggers",
            shopItem: true,
            craftableItem: false,
            damage: "1d10",
            statModifiers: { speed: 3, accuracy: 1 },
            specialEffects: ["vanish"],
            enchantmentSlots: 1,
            desc: "A blade forged from shadow. +3 Speed, +1 Accuracy. Vanish: Once per battle, next attack against you has disadvantage. Damage: 1d10",
            icon: "🌑",
            price: 200,
            rarity: "rare"
        },
        assassins_edge: {
            id: "assassins_edge",
            name: "Assassin's Edge",
            type: "weapon",
            subcategory: "daggers",
            shopItem: true,
            craftableItem: false,
            damage: "1d10",
            statModifiers: { accuracy: 2, strength: 1 },
            specialEffects: ["silent_strike"],
            enchantmentSlots: 1,
            desc: "A blade for silent kills. +2 Accuracy, +1 Strength. Silent Strike: 25% chance target has disadvantage on next attack. Damage: 1d10",
            icon: "🗡️",
            price: 190,
            rarity: "rare"
        },

        // TIER 6
        wind_razor: {
            id: "wind_razor",
            name: "Wind Razor",
            type: "weapon",
            subcategory: "daggers",
            shopItem: true,
            craftableItem: false,
            damage: "1d12",
            statModifiers: { speed: 3, accuracy: 2 },
            specialEffects: ["flurry_efficiency"],
            enchantmentSlots: 1,
            desc: "A blade as swift as wind. +3 Speed, +2 Accuracy. Flurry skill costs 2 less stamina. Damage: 1d12",
            icon: "💨",
            price: 250,
            rarity: "rare"
        },
        crystal_fang: {
            id: "crystal_fang",
            name: "Crystal Fang",
            type: "weapon",
            subcategory: "daggers",
            shopItem: true,
            craftableItem: false,
            damage: "1d12",
            statModifiers: { speed: 2, magic: 2, magicalDefence: 1 },
            specialEffects: ["stamina_drain"],
            enchantmentSlots: 1,
            desc: "A crystalline dagger. +2 Speed, +2 Magic, +1 Magical Defence. Stamina Drain: Decrease enemy stamina by 3, restore 3 to yourself. Damage: 1d12",
            icon: "💎",
            price: 275,
            rarity: "rare"
        },
        lights_edge: {
            id: "lights_edge",
            name: "Light's Edge",
            type: "weapon",
            subcategory: "daggers",
            shopItem: true,
            craftableItem: false,
            damage: "1d12",
            statModifiers: { speed: 2, accuracy: 2 },
            specialEffects: ["blinding_cut"],
            enchantmentSlots: 1,
            desc: "A radiant blade. +2 Speed, +2 Accuracy. Blinding Cut: 50% chance target has disadvantage on next attack. Damage: 1d12",
            icon: "✨",
            price: 260,
            rarity: "rare"
        },
        bloodthirsty_blade: {
            id: "bloodthirsty_blade",
            name: "Bloodthirsty Blade",
            type: "weapon",
            subcategory: "daggers",
            shopItem: true,
            craftableItem: false,
            damage: "1d12",
            statModifiers: { speed: 3, strength: 1 },
            specialEffects: ["bleed_chance"],
            enchantmentSlots: 1,
            desc: "A blade that thirsts for blood. +3 Speed, +1 Strength. 20% chance to apply Bleed. Damage: 1d12",
            icon: "🩸",
            price: 240,
            rarity: "rare"
        },

        // TIER 7
        obsidian_fang: {
            id: "obsidian_fang",
            name: "Obsidian Fang",
            type: "weapon",
            subcategory: "daggers",
            shopItem: true,
            craftableItem: false,
            damage: "2d6",
            statModifiers: { speed: 3, accuracy: 3 },
            specialEffects: ["vital_strike_efficiency"],
            enchantmentSlots: 1,
            desc: "A deadly obsidian blade. +3 Speed, +3 Accuracy. Vital Strike skill costs 2 less stamina. Damage: 2d6",
            icon: "🖤",
            price: 200,
            rarity: "epic"
        },
        vampiric_dagger: {
            id: "vampiric_dagger",
            name: "Vampiric Dagger",
            type: "weapon",
            subcategory: "daggers",
            shopItem: true,
            craftableItem: false,
            damage: "2d6",
            statModifiers: { speed: 3, magic: 2, magicalDefence: 1 },
            specialEffects: ["life_steal"],
            enchantmentSlots: 1,
            desc: "A cursed vampiric blade. +3 Speed, +2 Magic, +1 Magical Defence. Life Steal: Heal for 20% of damage dealt. Damage: 2d6",
            icon: "🧛",
            price: 250,
            rarity: "epic"
        },
        shrouds_stiletto: {
            id: "shrouds_stiletto",
            name: "Shroud's Stiletto",
            type: "weapon",
            subcategory: "daggers",
            shopItem: true,
            craftableItem: false,
            damage: "2d6",
            statModifiers: { speed: 3, accuracy: 2, magicalDefence: 2 },
            specialEffects: ["enshadowed_pierce"],
            enchantmentSlots: 1,
            desc: "A blade wrapped in shadow. +3 Speed, +2 Accuracy, +2 Magical Defence. Enshadowed Pierce: On crit, deal 2d6 Darkness damage. Damage: 2d6",
            icon: "🌫️",
            price: 300,
            rarity: "epic"
        },
        storm_fang: {
            id: "storm_fang",
            name: "Storm Fang",
            type: "weapon",
            subcategory: "daggers",
            shopItem: true,
            craftableItem: false,
            damage: "2d6",
            statModifiers: { speed: 3, accuracy: 2 },
            specialEffects: ["spark_efficiency"],
            enchantmentSlots: 1,
            desc: "A lightning-charged blade. +3 Speed, +2 Accuracy. Spark skill costs 3 less stamina. Damage: 2d6",
            icon: "⚡",
            price: 280,
            rarity: "epic"
        },

        // TIER 8
        dragon_talon: {
            id: "dragon_talon",
            name: "Dragon Talon",
            type: "weapon",
            subcategory: "daggers",
            shopItem: true,
            craftableItem: false,
            damage: "2d8",
            statModifiers: { speed: 4, accuracy: 3 },
            specialEffects: ["poison_breath"],
            enchantmentSlots: 1,
            desc: "A talon from an ancient dragon. +4 Speed, +3 Accuracy. Poison Breath: Once per battle, cone attack dealing 3d6 poison damage. Damage: 2d8",
            icon: "🐲",
            price: 650,
            rarity: "epic"
        },
        void_needle: {
            id: "void_needle",
            name: "Void Needle",
            type: "weapon",
            subcategory: "daggers",
            shopItem: true,
            craftableItem: false,
            damage: "2d8",
            statModifiers: { speed: 3, magic: 3 },
            specialEffects: ["shadowstep_efficiency"],
            enchantmentSlots: 1,
            desc: "A needle that pierces reality. +3 Speed, +3 Magic. Shadowstep skill costs 2 less stamina. Damage: 2d8",
            icon: "🕳️",
            price: 700,
            rarity: "epic"
        },
        celestial_shard: {
            id: "celestial_shard",
            name: "Celestial Shard",
            type: "weapon",
            subcategory: "daggers",
            shopItem: true,
            craftableItem: false,
            damage: "2d8",
            statModifiers: { speed: 4, magic: 2 },
            specialEffects: ["star_strike"],
            enchantmentSlots: 1,
            desc: "A fragment of a fallen star. +4 Speed, +2 Magic. Star Strike: On kill, 20% chance to blind all visible enemies. Damage: 2d8",
            icon: "⭐",
            price: 750,
            rarity: "epic"
        },

        // TIER 9
        temporal_edge: {
            id: "temporal_edge",
            name: "Temporal Edge",
            type: "weapon",
            subcategory: "daggers",
            shopItem: true,
            craftableItem: false,
            damage: "2d10",
            statModifiers: { speed: 5, accuracy: 4, magic: 3 },
            specialEffects: ["time_slice"],
            enchantmentSlots: 1,
            desc: "A blade that cuts through time. +5 Speed, +4 Accuracy, +3 Magic. Time Slice: Always attempt to attack 1 more time. Damage: 2d10",
            icon: "⏰",
            price: 1200,
            rarity: "legendary"
        },
        genesis_fang: {
            id: "genesis_fang",
            name: "Genesis Fang",
            type: "weapon",
            subcategory: "daggers",
            shopItem: true,
            craftableItem: false,
            damage: "2d10",
            statModifiers: { speed: 5, accuracy: 3 },
            specialEffects: ["reality_cut"],
            enchantmentSlots: 1,
            desc: "The original dagger, birth of all blades. +5 Speed, +3 Accuracy. Reality Cut: Once per battle, deal 2d8 to all enemies - Gain advantage on next 2 attacks. Damage: 2d10",
            icon: "🌌",
            price: 750,
            rarity: "legendary"
        },

        // BOWS - Following SHOP_EXPANSION_IDEAS.md
        // TIER 1
        training_bow: {
            id: "training_bow",
            name: "Training Bow",
            type: "weapon",
            subcategory: "bows",
            shopItem: true,
            craftableItem: true,
            craftingCategory: "Smithing",
            craftingMaterials: [
                { id: "thick_hide", quantity: 2 },
                { id: "flexible_tail_section", quantity: 1 },
                { id: "thread", quantity: 3 }
            ],
            requiredSkills: ["smithing_basic"],
            damage: "1d4",
            statModifiers: {},
            specialEffects: [],
            enchantmentSlots: 0,
            desc: "A simple training bow. Basic weapon. Damage: 1d4",
            icon: "🏹",
            price: 15,
            rarity: "common"
        },

        // TIER 2
        hunter_bow: {
            id: "hunter_bow",
            name: "Hunter Bow",
            type: "weapon",
            subcategory: "bows",
            shopItem: true,
            craftableItem: true,
            craftingCategory: "Smithing",
            craftingMaterials: [
                { id: "training_bow", quantity: 1 },
                { id: "thick_hide", quantity: 1 } // monster-loot-data.js
            ],
            damage: "1d6",
            statModifiers: { accuracy: 1 },
            specialEffects: [],
            enchantmentSlots: 0,
            desc: "A reliable hunting bow. +1 Accuracy. Damage: 1d6",
            icon: "🏹",
            price: 35,
            rarity: "common"
        },
        shortbow: {
            id: "shortbow",
            name: "Short Bow",
            type: "weapon",
            subcategory: "bows",
            shopItem: true,
            craftableItem: true,
            craftingCategory: "Smithing",
            craftingMaterials: [
                { id: "basic_fabric", quantity: 3 },
                { id: "thread", quantity: 1 }
            ],
            requiredSkills: ["smithing_basic"],
            damage: "1d6",
            statModifiers: { speed: 2, accuracy: 1 },
            specialEffects: [],
            enchantmentSlots: 0,
            range: "60ft",
            desc: "A nimble short bow. +2 Speed, +1 Accuracy. Damage: 1d6. Range: 60ft",
            icon: "🏹",
            price: 30,
            rarity: "common"
        },

        // TIER 3
        steel_bow: {
            id: "steel_bow",
            name: "Steel Bow",
            type: "weapon",
            subcategory: "bows",
            shopItem: true,
            craftableItem: true,
            craftingCategory: "Smithing",
            craftingMaterials: [
                { id: "hunter_bow", quantity: 1 },
                { id: "metallic_fragments", quantity: 1 } // monster-loot-data.js
            ],
            damage: "1d8",
            statModifiers: { accuracy: 2 },
            specialEffects: [],
            enchantmentSlots: 0,
            desc: "A steel-reinforced bow. +2 Accuracy. Damage: 1d8",
            icon: "🏹",
            price: 60,
            rarity: "common"
        },
        longbow: {
            id: "longbow",
            name: "Long Bow",
            type: "weapon",
            subcategory: "bows",
            shopItem: true,
            craftableItem: true,
            craftingCategory: "Smithing",
            craftingMaterials: [
                { id: "basic_fabric", quantity: 4 },
                { id: "thread", quantity: 1 },
                { id: "iron_nails", quantity: 1 }
            ],
            requiredSkills: ["smithing_basic"],
            damage: "1d8",
            statModifiers: { speed: 3, accuracy: 2 },
            specialEffects: [],
            enchantmentSlots: 0,
            range: "80ft",
            desc: "A long-range bow. +3 Speed, +2 Accuracy. Damage: 1d8. Range: 80ft",
            icon: "🏹",
            price: 50,
            rarity: "common"
        },
        composite_bow: {
            id: "composite_bow",
            name: "Composite Bow",
            type: "weapon",
            subcategory: "bows",
            shopItem: true,
            craftableItem: true,
            craftingCategory: "Smithing",
            craftingMaterials: [
                { id: "thick_hide", quantity: 3 },
                { id: "ironbark_moss", quantity: 2 },
                { id: "strength_essence", quantity: 1 }
            ],
            requiredSkills: ["smithing_basic"],
            damage: "1d8",
            statModifiers: { accuracy: 1, strength: 1 },
            specialEffects: [],
            enchantmentSlots: 0,
            desc: "A composite bow with reinforced design. +1 Accuracy, +1 Strength. Damage: 1d8",
            icon: "🏹",
            price: 70,
            rarity: "common"
        },

        // TIER 4
        silver_bow: {
            id: "silver_bow",
            name: "Silver Bow",
            type: "weapon",
            subcategory: "bows",
            shopItem: true,
            craftableItem: true,
            craftingCategory: "Smithing",
            craftingMaterials: [
                { id: "basic_fabric", quantity: 4 },
                { id: "silver_ingot", quantity: 1 },
                { id: "thread", quantity: 1 }
            ],
            requiredSkills: ["smithing_advanced"],
            damage: "1d8",
            statModifiers: { speed: 4, accuracy: 3 },
            specialEffects: [],
            enchantmentSlots: 0,
            range: "100ft",
            desc: "A silver-inlaid bow. +4 Speed, +3 Accuracy. Damage: 1d8. Range: 100ft",
            icon: "🏹",
            price: 125,
            rarity: "uncommon"
        },
        lightning_bow: {
            id: "lightning_bow",
            name: "Lightning Bow",
            type: "weapon",
            subcategory: "bows",
            shopItem: false,
            craftableItem: true,
            craftingCategory: "Smithing",
            craftingMaterials: [
                { id: "basic_fabric", quantity: 4 },
                { id: "lightning_essence", quantity: 2 },
                { id: "thread", quantity: 1 }
            ],
            requiredSkills: ["smithing_advanced"],
            damage: "1d8 + 1d4 lightning",
            statModifiers: { speed: 3, accuracy: 4, magic: 1 },
            specialEffects: [],
            enchantmentSlots: 0,
            range: "90ft",
            desc: "A bow crackling with lightning. +3 Speed, +4 Accuracy, +1 Magic. Damage: 1d8 + 1d4 lightning. Range: 90ft",
            icon: "🏹",
            price: 130,
            rarity: "uncommon"
        },
        composite_bow: {
            id: "composite_bow",
            name: "Composite Bow",
            type: "weapon",
            subcategory: "bows",
            shopItem: false,
            craftableItem: true,
            craftingCategory: "Smithing",
            craftingMaterials: [
                { id: "basic_fabric", quantity: 5 },
                { id: "thread", quantity: 2 },
                { id: "iron_nails", quantity: 1 }
            ],
            requiredSkills: ["smithing_advanced"],
            damage: "1d10",
            statModifiers: { speed: 5, accuracy: 2 },
            specialEffects: [],
            enchantmentSlots: 0,
            range: "120ft",
            desc: "A composite bow with reinforced design. +5 Speed, +2 Accuracy. Damage: 1d10. Range: 120ft",
            icon: "🏹",
            price: 140,
            rarity: "uncommon"
        },
        elven_bow: {
            id: "elven_bow",
            name: "Elven Bow",
            type: "weapon",
            subcategory: "bows",
            shopItem: true,
            craftableItem: false,
            damage: "1d8",
            statModifiers: { accuracy: 2 },
            specialEffects: ["Keen Shot (Natural Rolls of 17-20 are treated as Critical hits)"],
            enchantmentSlots: 1,
            desc: "An elegant elven bow. +2 Accuracy. Damage: 1d8. Effect: Keen Shot",
            icon: "🏹",
            price: 100,
            rarity: "uncommon"
        },
        ranger_bow: {
            id: "ranger_bow",
            name: "Ranger Bow",
            type: "weapon",
            subcategory: "bows",
            shopItem: true,
            craftableItem: false,
            damage: "1d8",
            statModifiers: { accuracy: 1, physical_defense: 1 },
            specialEffects: ["Aimed Shot skill costs 2 less stamina when wielding this weapon"],
            enchantmentSlots: 1,
            desc: "A ranger's trusted bow. +1 Accuracy, +1 PD. Damage: 1d8. Effect: Aimed Shot cost reduction",
            icon: "🏹",
            price: 110,
            rarity: "uncommon"
        },

        // TIER 5
        flame_bow: {
            id: "flame_bow",
            name: "Flame Bow",
            type: "weapon",
            subcategory: "bows",
            shopItem: true,
            craftableItem: false,
            damage: "1d10",
            statModifiers: { accuracy: 2, speed: 2 },
            specialEffects: ["Incendiary Arrows (Arrows create small fire zones: 1d4 fire damage to anyone inside - each zone lasts for 2 turns)"],
            enchantmentSlots: 1,
            desc: "A bow wreathed in flames. +2 Accuracy, +2 Speed. Damage: 1d10. Effect: Incendiary Arrows",
            icon: "🏹",
            price: 225,
            rarity: "rare"
        },
        frost_bow: {
            id: "frost_bow",
            name: "Frost Bow",
            type: "weapon",
            subcategory: "bows",
            shopItem: true,
            craftableItem: false,
            damage: "1d10",
            statModifiers: { accuracy: 2, magic: 1 },
            specialEffects: ["10% chance to apply Immobilized"],
            enchantmentSlots: 1,
            desc: "An ice-cold bow. +2 Accuracy, +1 Magic. Damage: 1d10. Effect: 10% chance to immobilize",
            icon: "🏹",
            price: 200,
            rarity: "rare"
        },
        shadow_bow: {
            id: "shadow_bow",
            name: "Shadow Bow",
            type: "weapon",
            subcategory: "bows",
            shopItem: true,
            craftableItem: false,
            damage: "1d10",
            statModifiers: { accuracy: 3, speed: 1 },
            specialEffects: ["Phase Shot (Arrows ignore armor completely)"],
            enchantmentSlots: 1,
            desc: "A bow made of shadows. +3 Accuracy, +1 Speed. Damage: 1d10. Effect: Phase Shot",
            icon: "🏹",
            price: 250,
            rarity: "rare"
        },
        sniper_bow: {
            id: "sniper_bow",
            name: "Sniper Bow",
            type: "weapon",
            subcategory: "bows",
            shopItem: true,
            craftableItem: false,
            damage: "1d10",
            statModifiers: { accuracy: 2, strength: 1 },
            specialEffects: ["Aimed Shot (25% chance target has disadvantage on their next attack roll)"],
            enchantmentSlots: 1,
            desc: "A precision sniper bow. +2 Accuracy, +1 Strength. Damage: 1d10. Effect: Aimed Shot",
            icon: "🏹",
            price: 210,
            rarity: "rare"
        },

        // TIER 6
        wind_bow: {
            id: "wind_bow",
            name: "Wind Bow",
            type: "weapon",
            subcategory: "bows",
            shopItem: true,
            craftableItem: false,
            damage: "1d12",
            statModifiers: { accuracy: 3, speed: 2 },
            specialEffects: ["Multi Shot skill costs 2 less stamina when wielding this weapon"],
            enchantmentSlots: 2,
            desc: "A bow blessed by the winds. +3 Accuracy, +2 Speed. Damage: 1d12. Effect: Multi Shot cost reduction",
            icon: "🏹",
            price: 350,
            rarity: "rare"
        },
        crystal_bow: {
            id: "crystal_bow",
            name: "Crystal Bow",
            type: "weapon",
            subcategory: "bows",
            shopItem: true,
            craftableItem: false,
            damage: "1d12",
            statModifiers: { accuracy: 2, magic: 2 },
            specialEffects: ["Energy Drain (Decrease enemy's Stamina by 2 and Restore 2 stamina for yourself on hit)"],
            enchantmentSlots: 2,
            desc: "A crystalline bow. +2 Accuracy, +2 Magic. Damage: 1d12. Effect: Energy Drain",
            icon: "🏹",
            price: 300,
            rarity: "rare"
        },
        storm_bow: {
            id: "storm_bow",
            name: "Storm Bow",
            type: "weapon",
            subcategory: "bows",
            shopItem: true,
            craftableItem: false,
            damage: "1d12",
            statModifiers: { accuracy: 2, speed: 2 },
            specialEffects: ["Thunder Shot (50% chance target has disadvantage on their next accuracy roll)"],
            enchantmentSlots: 2,
            desc: "A bow charged with storm energy. +2 Accuracy, +2 Speed. Damage: 1d12. Effect: Thunder Shot",
            icon: "🏹",
            price: 400,
            rarity: "rare"
        },
        seeking_bow: {
            id: "seeking_bow",
            name: "Seeking Bow",
            type: "weapon",
            subcategory: "bows",
            shopItem: true,
            craftableItem: false,
            damage: "1d10",
            statModifiers: { accuracy: 3, strength: 1 },
            specialEffects: ["Homing Arrows (Cannot miss - all attacks automatically hit)"],
            enchantmentSlots: 2,
            desc: "A bow with magical guidance. +3 Accuracy, +1 Strength. Damage: 1d10. Effect: Homing Arrows",
            icon: "🏹",
            price: 450,
            rarity: "rare"
        },

        // TIER 7
        obsidian_bow: {
            id: "obsidian_bow",
            name: "Obsidian Bow",
            type: "weapon",
            subcategory: "bows",
            shopItem: true,
            craftableItem: false,
            damage: "2d6",
            statModifiers: { accuracy: 3, speed: 3 },
            specialEffects: ["Explosive Shot skill costs 4 less stamina when wielding this weapon"],
            enchantmentSlots: 2,
            desc: "A bow carved from volcanic glass. +3 Accuracy, +3 Speed. Damage: 2d6. Effect: Explosive Shot cost reduction",
            icon: "🏹",
            price: 650,
            rarity: "epic"
        },
        soul_bow: {
            id: "soul_bow",
            name: "Soul Bow",
            type: "weapon",
            subcategory: "bows",
            shopItem: true,
            craftableItem: false,
            damage: "2d6",
            statModifiers: { accuracy: 3, magic: 2 },
            specialEffects: ["Life Steal (Heal for 20% of damage dealt)"],
            enchantmentSlots: 2,
            desc: "A bow that feeds on souls. +3 Accuracy, +2 Magic. Damage: 2d6. Effect: Life Steal",
            icon: "🏹",
            price: 600,
            rarity: "epic"
        },
        gale_bow: {
            id: "gale_bow",
            name: "Gale Bow",
            type: "weapon",
            subcategory: "bows",
            shopItem: true,
            craftableItem: false,
            damage: "2d6",
            statModifiers: { accuracy: 2, speed: 2, magic: 1 },
            specialEffects: ["Wind Strike (On crit, deal 2d6 Wind damage)"],
            enchantmentSlots: 2,
            desc: "A bow of howling winds. +2 Accuracy, +2 Speed, +1 Magic. Damage: 2d6. Effect: Wind Strike",
            icon: "🏹",
            price: 700,
            rarity: "epic"
        },
        lightning_bow: {
            id: "lightning_bow",
            name: "Lightning Bow",
            type: "weapon",
            subcategory: "bows",
            shopItem: true,
            craftableItem: false,
            damage: "2d6",
            statModifiers: { accuracy: 3, speed: 2 },
            specialEffects: ["Spark skill costs 3 less stamina when wielding this weapon"],
            enchantmentSlots: 2,
            desc: "A bow crackling with electricity. +3 Accuracy, +2 Speed. Damage: 2d6. Effect: Spark cost reduction",
            icon: "🏹",
            price: 750,
            rarity: "epic"
        },

        // TIER 8
        dragon_bow: {
            id: "dragon_bow",
            name: "Dragon Bow",
            type: "weapon",
            subcategory: "bows",
            shopItem: true,
            craftableItem: false,
            damage: "2d8",
            statModifiers: { accuracy: 4, speed: 3 },
            specialEffects: ["Hurricane Shot (Once per battle, create a wind vortex: 3d6 Wind damage to all enemies in a line)"],
            enchantmentSlots: 3,
            desc: "A bow forged from dragon bone. +4 Accuracy, +3 Speed. Damage: 2d8. Effect: Hurricane Shot",
            icon: "🏹",
            price: 950,
            rarity: "epic"
        },
        void_bow: {
            id: "void_bow",
            name: "Void Bow",
            type: "weapon",
            subcategory: "bows",
            shopItem: true,
            craftableItem: false,
            damage: "2d8",
            statModifiers: { accuracy: 3, magic: 3 },
            specialEffects: ["Piercing Shot skill costs 2 less stamina when wielding this weapon"],
            enchantmentSlots: 3,
            desc: "A bow from the void itself. +3 Accuracy, +3 Magic. Damage: 2d8. Effect: Piercing Shot cost reduction",
            icon: "🏹",
            price: 900,
            rarity: "epic"
        },
        celestial_bow: {
            id: "celestial_bow",
            name: "Celestial Bow",
            type: "weapon",
            subcategory: "bows",
            shopItem: true,
            craftableItem: false,
            damage: "2d8",
            statModifiers: { accuracy: 4, magic: 2 },
            specialEffects: ["Star Rain (On kill, 20% chance to rain stars on all visible enemies: 2d8 Wind damage)"],
            enchantmentSlots: 3,
            desc: "A bow blessed by the heavens. +4 Accuracy, +2 Magic. Damage: 2d8. Effect: Star Rain",
            icon: "🏹",
            price: 1000,
            rarity: "epic"
        },

        // TIER 9
        temporal_bow: {
            id: "temporal_bow",
            name: "Temporal Bow",
            type: "weapon",
            subcategory: "bows",
            shopItem: true,
            craftableItem: false,
            damage: "2d10",
            statModifiers: { accuracy: 5, speed: 4, magic: 3 },
            specialEffects: ["Quantum Shot (Attacks hit both the target and a random enemy simultaneously)"],
            enchantmentSlots: 3,
            desc: "A bow that bends time itself. +5 Accuracy, +4 Speed, +3 Magic. Damage: 2d10. Effect: Quantum Shot",
            icon: "🏹",
            price: 750,
            rarity: "legendary"
        },
        genesis_bow: {
            id: "genesis_bow",
            name: "Genesis Bow",
            type: "weapon",
            subcategory: "bows",
            shopItem: true,
            craftableItem: false,
            damage: "2d10",
            statModifiers: { accuracy: 5, speed: 3 },
            specialEffects: ["Reality Arrow (Once per battle, deal 2d10 to all enemies - Gain advantage on next 2 attack rolls)"],
            enchantmentSlots: 3,
            desc: "The first bow, from which all others were made. +5 Accuracy, +3 Speed. Damage: 2d10. Effect: Reality Arrow",
            icon: "🏹",
            price: 1400,
            rarity: "legendary"
        },

        // AXES - Following SHOP_EXPANSION_IDEAS.md
        // TIER 1
        rusty_axe: {
            id: "rusty_axe",
            name: "Rusty Axe",
            type: "weapon",
            subcategory: "axes",
            shopItem: true,
            craftableItem: true,
            craftingCategory: "Smithing",
            craftingMaterials: [
                { id: "copper_ingot", quantity: 2 },
                { id: "thick_hide", quantity: 1 },
                { id: "sharp_claws", quantity: 2 }
            ],
            requiredSkills: ["smithing_basic"],
            damage: "1d4",
            statModifiers: {},
            specialEffects: [],
            enchantmentSlots: 0,
            desc: "A rusty old axe. Basic weapon. Damage: 1d4",
            icon: "🪓",
            price: 5,
            rarity: "common"
        },

        // TIER 2
        iron_axe: {
            id: "iron_axe",
            name: "Iron Axe",
            type: "weapon",
            subcategory: "axes",
            shopItem: true,
            craftableItem: true,
            craftingCategory: "Smithing",
            craftingMaterials: [
                { id: "iron_ingot", quantity: 2 },
                { id: "wooden_handle", quantity: 1 }
            ],
            requiredSkills: ["smithing_basic"],
            damage: "1d6",
            statModifiers: { strength: 3 },
            specialEffects: [],
            enchantmentSlots: 0,
            desc: "A sturdy iron axe. +3 Strength. Damage: 1d6",
            icon: "🪓",
            price: 35,
            rarity: "common"
        },
        hatchet: {
            id: "hatchet",
            name: "Hatchet",
            type: "weapon",
            subcategory: "axes",
            shopItem: true,
            craftableItem: true,
            craftingCategory: "Smithing",
            craftingMaterials: [
                { id: "iron_ingot", quantity: 2 },
                { id: "thick_hide", quantity: 1 },
                { id: "speed_essence", quantity: 1 }
            ],
            requiredSkills: ["smithing_basic"],
            damage: "1d6",
            statModifiers: { speed: 1 },
            specialEffects: [],
            enchantmentSlots: 0,
            desc: "A quick hatchet. +1 Speed. Damage: 1d6",
            icon: "🪓",
            price: 30,
            rarity: "common"
        },

        // TIER 3
        steel_axe: {
            id: "steel_axe",
            name: "Steel Axe",
            type: "weapon",
            subcategory: "axes",
            shopItem: true,
            craftableItem: true,
            craftingCategory: "Smithing",
            craftingMaterials: [
                { id: "steel_ingot", quantity: 2 },
                { id: "wooden_handle", quantity: 1 },
                { id: "sharpening_stone", quantity: 1 }
            ],
            requiredSkills: ["smithing_basic"],
            damage: "1d8",
            statModifiers: { strength: 4 },
            specialEffects: [],
            enchantmentSlots: 0,
            desc: "A steel forged axe. +4 Strength. Damage: 1d8",
            icon: "🪓",
            price: 60,
            rarity: "common"
        },
        battle_axe: {
            id: "battle_axe",
            name: "Battle Axe",
            type: "weapon",
            subcategory: "axes",
            shopItem: true,
            craftableItem: false,
            damage: "1d8",
            statModifiers: { strength: 1, speed: 1 },
            specialEffects: [],
            enchantmentSlots: 0,
            desc: "A heavy battle axe. +1 Strength, +1 Speed. Damage: 1d8",
            icon: "🪓",
            price: 70,
            rarity: "common"
        },
        woodsman_axe: {
            id: "woodsman_axe",
            name: "Woodsman's Axe",
            type: "weapon",
            subcategory: "axes",
            shopItem: true,
            craftableItem: false,
            damage: "1d8",
            statModifiers: { strength: 1, accuracy: 1 },
            specialEffects: [],
            enchantmentSlots: 0,
            desc: "A practical woodsman's axe. +1 Strength, +1 Accuracy. Damage: 1d8",
            icon: "🪓",
            price: 65,
            rarity: "common"
        },

        // TIER 4
        silver_axe: {
            id: "silver_axe",
            name: "Silver Axe",
            type: "weapon",
            subcategory: "axes",
            shopItem: true,
            craftableItem: true,
            craftingCategory: "Smithing",
            craftingMaterials: [
                { id: "silver_ingot", quantity: 2 },
                { id: "wooden_handle", quantity: 1 },
                { id: "sharpening_stone", quantity: 2 }
            ],
            requiredSkills: ["smithing_advanced"],
            damage: "1d10",
            statModifiers: { strength: 5 },
            specialEffects: [],
            enchantmentSlots: 0,
            desc: "A silver-edged axe. +5 Strength. Damage: 1d10",
            icon: "🪓",
            price: 125,
            rarity: "uncommon"
        },
        frost_axe: {
            id: "frost_axe",
            name: "Frost Axe",
            type: "weapon",
            subcategory: "axes",
            shopItem: false,
            craftableItem: true,
            craftingCategory: "Smithing",
            craftingMaterials: [
                { id: "steel_ingot", quantity: 2 },
                { id: "ice_essence", quantity: 2 },
                { id: "magic_essence", quantity: 1 }
            ],
            requiredSkills: ["smithing_advanced"],
            damage: "1d8 + 1d4 ice",
            statModifiers: { strength: 4, magic: 2 },
            specialEffects: [],
            enchantmentSlots: 0,
            desc: "An ice-cold axe. +4 Strength, +2 Magic. Damage: 1d8 + 1d4 ice",
            icon: "🪓",
            price: 130,
            rarity: "uncommon"
        },
        battle_axe: {
            id: "battle_axe",
            name: "Battle Axe",
            type: "weapon",
            subcategory: "axes",
            shopItem: false,
            craftableItem: true,
            craftingCategory: "Smithing",
            craftingMaterials: [
                { id: "steel_ingot", quantity: 3 },
                { id: "wooden_handle", quantity: 1 },
                { id: "reinforcement_studs", quantity: 2 }
            ],
            requiredSkills: ["smithing_advanced"],
            damage: "1d12",
            statModifiers: { strength: 6 },
            specialEffects: [],
            enchantmentSlots: 0,
            desc: "A mighty battle axe. +6 Strength. Damage: 1d12",
            icon: "🪓",
            price: 140,
            rarity: "uncommon"
        },
        elven_war_axe: {
            id: "elven_war_axe",
            name: "Elven War Axe",
            type: "weapon",
            subcategory: "axes",
            shopItem: true,
            craftableItem: false,
            damage: "1d8",
            statModifiers: { speed: 2 },
            specialEffects: ["Berserker Rage (Natural Rolls of 17-20 are treated as Critical hits)"],
            enchantmentSlots: 1,
            desc: "An elegant elven war axe. +2 Speed. Damage: 1d8. Effect: Berserker Rage",
            icon: "🪓",
            price: 110,
            rarity: "uncommon"
        },
        viking_axe: {
            id: "viking_axe",
            name: "Viking Axe",
            type: "weapon",
            subcategory: "axes",
            shopItem: true,
            craftableItem: false,
            damage: "1d8",
            statModifiers: { strength: 1, speed: 1 },
            specialEffects: ["Cleave skill costs 1 less stamina when wielding this weapon"],
            enchantmentSlots: 1,
            desc: "A fierce viking axe. +1 Strength, +1 Speed. Damage: 1d8. Effect: Cleave cost reduction",
            icon: "🪓",
            price: 120,
            rarity: "uncommon"
        },

        // TIER 5
        flame_axe: {
            id: "flame_axe",
            name: "Flame Axe",
            type: "weapon",
            subcategory: "axes",
            shopItem: true,
            craftableItem: false,
            damage: "1d10",
            statModifiers: { strength: 2, speed: 2 },
            specialEffects: ["10% chance to apply Burn"],
            enchantmentSlots: 1,
            desc: "An axe wreathed in flames. +2 Strength, +2 Speed. Damage: 1d10. Effect: 10% chance to burn",
            icon: "🪓",
            price: 225,
            rarity: "rare"
        },
        ice_axe: {
            id: "ice_axe",
            name: "Ice Axe",
            type: "weapon",
            subcategory: "axes",
            shopItem: true,
            craftableItem: false,
            damage: "1d10",
            statModifiers: { strength: 2, magic: 1 },
            specialEffects: ["Frost Bite (25% chance to reduce target's SPD by 2 for 3 turns)"],
            enchantmentSlots: 1,
            desc: "An ice-cold axe. +2 Strength, +1 Magic. Damage: 1d10. Effect: Frost Bite",
            icon: "🪓",
            price: 210,
            rarity: "rare"
        },
        shadow_cleaver: {
            id: "shadow_cleaver",
            name: "Shadow Cleaver",
            type: "weapon",
            subcategory: "axes",
            shopItem: true,
            craftableItem: false,
            damage: "1d10",
            statModifiers: { strength: 3, speed: 1 },
            specialEffects: ["Dark Strike (Once per battle, next attack deals double damage)"],
            enchantmentSlots: 1,
            desc: "A cleaver made of shadows. +3 Strength, +1 Speed. Damage: 1d10. Effect: Dark Strike",
            icon: "🪓",
            price: 250,
            rarity: "rare"
        },
        berserker_axe: {
            id: "berserker_axe",
            name: "Berserker Axe",
            type: "weapon",
            subcategory: "axes",
            shopItem: true,
            craftableItem: false,
            damage: "1d10",
            statModifiers: { strength: 2, speed: 1 },
            specialEffects: ["Fury (Each kill increases damage by +1 for rest of combat)"],
            enchantmentSlots: 1,
            desc: "An axe of the berserkers. +2 Strength, +1 Speed. Damage: 1d10. Effect: Fury",
            icon: "🪓",
            price: 240,
            rarity: "rare"
        },

        // TIER 6
        wind_cleaver: {
            id: "wind_cleaver",
            name: "Wind Cleaver",
            type: "weapon",
            subcategory: "axes",
            shopItem: true,
            craftableItem: false,
            damage: "1d12",
            statModifiers: { strength: 3, speed: 2 },
            specialEffects: ["Wide Cleave skill costs 2 less stamina when wielding this weapon"],
            enchantmentSlots: 2,
            desc: "A cleaver blessed by the winds. +3 Strength, +2 Speed. Damage: 1d12. Effect: Wide Cleave cost reduction",
            icon: "🪓",
            price: 400,
            rarity: "rare"
        },
        crystal_axe: {
            id: "crystal_axe",
            name: "Crystal Axe",
            type: "weapon",
            subcategory: "axes",
            shopItem: true,
            craftableItem: false,
            damage: "1d12",
            statModifiers: { strength: 2, magic: 2 },
            specialEffects: ["Energy Cleave (Attacks restore 1 stamina to self when hitting 2+ enemies)"],
            enchantmentSlots: 2,
            desc: "A crystalline axe. +2 Strength, +2 Magic. Damage: 1d12. Effect: Energy Cleave",
            icon: "🪓",
            price: 300,
            rarity: "rare"
        },
        inferno_axe: {
            id: "inferno_axe",
            name: "Inferno Axe",
            type: "weapon",
            subcategory: "axes",
            shopItem: true,
            craftableItem: false,
            damage: "1d12",
            statModifiers: { strength: 2, speed: 2 },
            specialEffects: ["Blazing Trail (30% chance attacks leave fire trail: 1d4 fire damage for 2 turns)"],
            enchantmentSlots: 2,
            desc: "An axe of pure fire. +2 Strength, +2 Speed. Damage: 1d12. Effect: Blazing Trail",
            icon: "🪓",
            price: 350,
            rarity: "rare"
        },
        blood_reaper: {
            id: "blood_reaper",
            name: "Blood Reaper",
            type: "weapon",
            subcategory: "axes",
            shopItem: true,
            craftableItem: false,
            damage: "1d10",
            statModifiers: { strength: 3, speed: 1 },
            specialEffects: ["20% chance to apply Bleed status effect"],
            enchantmentSlots: 2,
            desc: "An axe that thirsts for blood. +3 Strength, +1 Speed. Damage: 1d10. Effect: 20% chance to bleed",
            icon: "🪓",
            price: 450,
            rarity: "rare"
        },

        // TIER 7
        obsidian_cleaver: {
            id: "obsidian_cleaver",
            name: "Obsidian Cleaver",
            type: "weapon",
            subcategory: "axes",
            shopItem: true,
            craftableItem: false,
            damage: "2d6",
            statModifiers: { strength: 3, speed: 3 },
            specialEffects: ["Armor Break skill costs 2 less stamina when wielding this weapon"],
            enchantmentSlots: 2,
            desc: "A cleaver of volcanic glass. +3 Strength, +3 Speed. Damage: 2d6. Effect: Armor Break cost reduction",
            icon: "🪓",
            price: 650,
            rarity: "epic"
        },
        demon_axe: {
            id: "demon_axe",
            name: "Demon Axe",
            type: "weapon",
            subcategory: "axes",
            shopItem: true,
            craftableItem: false,
            damage: "2d6",
            statModifiers: { strength: 3, magic: 2 },
            specialEffects: ["Carnage (Heal for 15% of damage dealt and gain +1 SPD per kill)"],
            enchantmentSlots: 2,
            desc: "An axe forged in hell. +3 Strength, +2 Magic. Damage: 2d6. Effect: Carnage",
            icon: "🪓",
            price: 600,
            rarity: "epic"
        },
        infernal_cleaver: {
            id: "infernal_cleaver",
            name: "Infernal Cleaver",
            type: "weapon",
            subcategory: "axes",
            shopItem: true,
            craftableItem: false,
            damage: "2d6",
            statModifiers: { strength: 2, speed: 2, magic: 1 },
            specialEffects: ["Hellfire (On crit, deal 2d6 Fire damage and spread to adjacent enemies)"],
            enchantmentSlots: 2,
            desc: "A cleaver of infernal flames. +2 Strength, +2 Speed, +1 Magic. Damage: 2d6. Effect: Hellfire",
            icon: "🪓",
            price: 700,
            rarity: "epic"
        },
        storm_axe: {
            id: "storm_axe",
            name: "Storm Axe",
            type: "weapon",
            subcategory: "axes",
            shopItem: true,
            craftableItem: false,
            damage: "2d6",
            statModifiers: { strength: 3, speed: 2 },
            specialEffects: ["Storm Axe skill costs 3 less stamina when wielding this weapon"],
            enchantmentSlots: 2,
            desc: "An axe crackling with storms. +3 Strength, +2 Speed. Damage: 2d6. Effect: Storm Axe cost reduction",
            icon: "🪓",
            price: 750,
            rarity: "epic"
        },

        // TIER 8
        dragon_axe: {
            id: "dragon_axe",
            name: "Dragon Axe",
            type: "weapon",
            subcategory: "axes",
            shopItem: true,
            craftableItem: false,
            damage: "2d8",
            statModifiers: { strength: 4, speed: 3 },
            specialEffects: ["Flame Spiral (Once per battle, create spinning fire attack: 3d6 Fire damage in expanding circle)"],
            enchantmentSlots: 3,
            desc: "An axe forged from dragon bone. +4 Strength, +3 Speed. Damage: 2d8. Effect: Flame Spiral",
            icon: "🪓",
            price: 950,
            rarity: "epic"
        },
        void_cleaver: {
            id: "void_cleaver",
            name: "Void Cleaver",
            type: "weapon",
            subcategory: "axes",
            shopItem: true,
            craftableItem: false,
            craftingCategory: "Smithing",
            craftingMaterials: [
                { id: "steel_axe", quantity: 1 },
                { id: "void_essence", quantity: 2 },
                { id: "metallic_fragments", quantity: 4 }
            ],
            requiredSkills: ["smithing_master"],
            damage: "2d8",
            statModifiers: { strength: 3, magic: 3 },
            specialEffects: ["Berserker Rage skill costs 2 less stamina when wielding this weapon"],
            enchantmentSlots: 3,
            desc: "A cleaver from the void. +3 Strength, +3 Magic. Damage: 2d8. Effect: Berserker Rage cost reduction",
            icon: "🪓",
            price: 900,
            rarity: "epic"
        },
        celestial_axe: {
            id: "celestial_axe",
            name: "Celestial Axe",
            type: "weapon",
            subcategory: "axes",
            shopItem: true,
            craftableItem: true,
            craftingCategory: "Smithing",
            craftingMaterials: [
                { id: "silver_ingot", quantity: 5 },
                { id: "holy_essence", quantity: 3 },
                { id: "phoenix_cells", quantity: 1 }
            ],
            requiredSkills: ["smithing_master"],
            damage: "2d8",
            statModifiers: { strength: 4, magic: 2 },
            specialEffects: ["Solar Flare (On kill, 20% chance to blind and burn all visible enemies)"],
            enchantmentSlots: 3,
            desc: "An axe blessed by the heavens. +4 Strength, +2 Magic. Damage: 2d8. Effect: Solar Flare",
            icon: "🪓",
            price: 1000,
            rarity: "epic"
        },

        // TIER 9
        temporal_axe: {
            id: "temporal_axe",
            name: "Temporal Axe",
            type: "weapon",
            subcategory: "axes",
            shopItem: true,
            craftableItem: false,
            craftingCategory: "Smithing",
            craftingMaterials: [
                { id: "celestial_axe", quantity: 1 },
                { id: "time_essence", quantity: 3 },
                { id: "regenerative_tissue", quantity: 2 }
            ],
            requiredSkills: ["smithing_legendary"],
            damage: "2d10",
            statModifiers: { strength: 5, speed: 4, magic: 3 },
            specialEffects: ["Space Cleave (All attacks hit up to 3 adjacent enemies)"],
            enchantmentSlots: 3,
            desc: "An axe that cleaves through time. +5 Strength, +4 Speed, +3 Magic. Damage: 2d10. Effect: Space Cleave",
            icon: "🪓",
            price: 750,
            rarity: "legendary"
        },
        genesis_axe: {
            id: "genesis_axe",
            name: "Genesis Axe",
            type: "weapon",
            subcategory: "axes",
            shopItem: true,
            craftableItem: false,
            damage: "2d10",
            statModifiers: { strength: 5, speed: 3 },
            specialEffects: ["Apocalypse (Once per battle, deal 3d8 Fire damage to all enemies - Each enemy killed heals you for 1d6)"],
            enchantmentSlots: 3,
            desc: "The first axe, bringer of the apocalypse. +5 Strength, +3 Speed. Damage: 2d10. Effect: Apocalypse",
            icon: "🪓",
            price: 1400,
            rarity: "legendary"
        },

        // HAMMERS - Following SHOP_EXPANSION_IDEAS.md
        // TIER 1
        crude_hammer: {
            id: "crude_hammer",
            name: "Crude Hammer",
            type: "weapon",
            subcategory: "hammers",
            shopItem: true,
            craftableItem: false,
            damage: "1d4",
            statModifiers: {},
            specialEffects: [],
            enchantmentSlots: 0,
            desc: "A crude hammer. Basic weapon. Damage: 1d4",
            icon: "🔨",
            price: 5,
            rarity: "common"
        },

        // TIER 2
        iron_hammer: {
            id: "iron_hammer",
            name: "Iron Hammer",
            type: "weapon",
            subcategory: "hammers",
            shopItem: true,
            craftableItem: true,
            craftingCategory: "Smithing",
            craftingMaterials: [
                { id: "iron_ingot", quantity: 2 },
                { id: "wooden_handle", quantity: 1 }
            ],
            requiredSkills: ["smithing_basic"],
            damage: "1d6",
            statModifiers: { strength: 3 },
            specialEffects: [],
            enchantmentSlots: 0,
            desc: "A heavy iron hammer. +3 Strength. Damage: 1d6",
            icon: "🔨",
            price: 35,
            rarity: "common"
        },
        stone_hammer: {
            id: "stone_hammer",
            name: "Stone Hammer",
            type: "weapon",
            subcategory: "hammers",
            shopItem: true,
            craftableItem: true,
            craftingCategory: "Smithing",
            craftingMaterials: [
                { id: "living_rock_fragments", quantity: 3 },
                { id: "thick_hide", quantity: 1 },
                { id: "vitality_essence", quantity: 1 }
            ],
            requiredSkills: ["smithing_basic"],
            damage: "1d6",
            statModifiers: { physical_defense: 1 },
            specialEffects: [],
            enchantmentSlots: 0,
            desc: "A stone-headed hammer. +1 PD. Damage: 1d6",
            icon: "🔨",
            price: 30,
            rarity: "common"
        },

        // TIER 3
        steel_hammer: {
            id: "steel_hammer",
            name: "Steel Hammer",
            type: "weapon",
            subcategory: "hammers",
            shopItem: true,
            craftableItem: true,
            craftingCategory: "Smithing",
            craftingMaterials: [
                { id: "steel_ingot", quantity: 2 },
                { id: "wooden_handle", quantity: 1 },
                { id: "reinforcement_studs", quantity: 1 }
            ],
            requiredSkills: ["smithing_basic"],
            damage: "1d8",
            statModifiers: { strength: 4 },
            specialEffects: [],
            enchantmentSlots: 0,
            desc: "A steel hammer. +4 Strength. Damage: 1d8",
            icon: "🔨",
            price: 60,
            rarity: "common"
        },
        war_hammer: {
            id: "war_hammer",
            name: "War Hammer",
            type: "weapon",
            subcategory: "hammers",
            shopItem: true,
            craftableItem: false,
            damage: "1d8",
            statModifiers: { strength: 1, physical_defense: 1 },
            specialEffects: [],
            enchantmentSlots: 0,
            desc: "A mighty war hammer. +1 Strength, +1 PD. Damage: 1d8",
            icon: "🔨",
            price: 70,
            rarity: "common"
        },
        heavy_mace: {
            id: "heavy_mace",
            name: "Heavy Mace",
            type: "weapon",
            subcategory: "hammers",
            shopItem: true,
            craftableItem: true,
            craftingCategory: "Smithing",
            craftingMaterials: [
                { id: "iron_ingot", quantity: 3 },
                { id: "crusher_molars", quantity: 2 },
                { id: "precision_essence", quantity: 1 }
            ],
            requiredSkills: ["smithing_basic"],
            damage: "1d8",
            statModifiers: { strength: 1, accuracy: 1 },
            specialEffects: [],
            enchantmentSlots: 0,
            desc: "A heavy mace. +1 Strength, +1 Accuracy. Damage: 1d8",
            icon: "🔨",
            price: 65,
            rarity: "common"
        },

        // TIER 4
        silver_hammer: {
            id: "silver_hammer",
            name: "Silver Hammer",
            type: "weapon",
            subcategory: "hammers",
            shopItem: true,
            craftableItem: true,
            craftingCategory: "Smithing",
            craftingMaterials: [
                { id: "silver_ingot", quantity: 3 },
                { id: "holy_essence", quantity: 1 },
                { id: "crusher_molars", quantity: 2 }
            ],
            requiredSkills: ["smithing_advanced"],
            damage: "1d8",
            statModifiers: { strength: 1, physical_defense: 1 },
            specialEffects: ["Consecrated Strike (Heals allies within range (30m) for 1d4 when you crit)"],
            enchantmentSlots: 1,
            desc: "A silver-blessed hammer. +1 Strength, +1 PD. Damage: 1d8. Effect: Consecrated Strike",
            icon: "🔨",
            price: 125,
            rarity: "uncommon"
        },
        dwarven_hammer: {
            id: "dwarven_hammer",
            name: "Dwarven Hammer",
            type: "weapon",
            subcategory: "hammers",
            shopItem: true,
            craftableItem: false,
            craftingCategory: "Smithing",
            craftingMaterials: [
                { id: "steel_hammer", quantity: 1 },
                { id: "metallic_fragments", quantity: 3 },
                { id: "strength_essence", quantity: 2 }
            ],
            requiredSkills: ["smithing_advanced"],
            damage: "1d8",
            statModifiers: { strength: 2 },
            specialEffects: ["Mighty Swing (Natural Rolls of 17-20 are treated as Critical hits)"],
            enchantmentSlots: 1,
            desc: "A dwarven-forged hammer. +2 Strength. Damage: 1d8. Effect: Mighty Swing",
            icon: "🔨",
            price: 110,
            rarity: "uncommon"
        },
        crusher: {
            id: "crusher",
            name: "Crusher",
            type: "weapon",
            subcategory: "hammers",
            shopItem: true,
            craftableItem: false,
            craftingCategory: "Smithing",
            craftingMaterials: [
                { id: "iron_ingot", quantity: 4 },
                { id: "crusher_molars", quantity: 3 },
                { id: "strength_essence", quantity: 1 }
            ],
            requiredSkills: ["smithing_basic"],
            damage: "1d8",
            statModifiers: { strength: 1, physical_defense: 1 },
            specialEffects: ["Thunderstrike skill costs 2 less stamina when wielding this weapon"],
            enchantmentSlots: 1,
            desc: "A devastating crusher. +1 Strength, +1 PD. Damage: 1d8. Effect: Thunderstrike cost reduction",
            icon: "🔨",
            price: 120,
            rarity: "uncommon"
        },

        // TIER 5
        molten_hammer: {
            id: "molten_hammer",
            name: "Molten Hammer",
            type: "weapon",
            subcategory: "hammers",
            shopItem: true,
            craftableItem: false,
            damage: "1d10",
            statModifiers: { strength: 2, physical_defense: 2 },
            specialEffects: ["10% chance to apply Burn"],
            enchantmentSlots: 1,
            desc: "A hammer of molten metal. +2 Strength, +2 PD. Damage: 1d10. Effect: 10% chance to burn",
            icon: "🔨",
            price: 225,
            rarity: "rare"
        },
        frost_maul: {
            id: "frost_maul",
            name: "Frost Maul",
            type: "weapon",
            subcategory: "hammers",
            shopItem: true,
            craftableItem: false,
            damage: "1d10",
            statModifiers: { strength: 2, magic: 1 },
            specialEffects: ["Shatter (25% chance to reduce target's PD by 2 for 3 turns)"],
            enchantmentSlots: 1,
            desc: "An ice-cold maul. +2 Strength, +1 Magic. Damage: 1d10. Effect: Shatter",
            icon: "🔨",
            price: 210,
            rarity: "rare"
        },
        gravity_hammer: {
            id: "gravity_hammer",
            name: "Gravity Hammer",
            type: "weapon",
            subcategory: "hammers",
            shopItem: true,
            craftableItem: false,
            damage: "1d10",
            statModifiers: { strength: 3, physical_defense: 1 },
            specialEffects: ["Ground Pound (Once per battle, stun all adjacent enemies for 1 turn)"],
            enchantmentSlots: 1,
            desc: "A hammer that bends gravity. +3 Strength, +1 PD. Damage: 1d10. Effect: Ground Pound",
            icon: "🔨",
            price: 250,
            rarity: "rare"
        },
        forge_hammer: {
            id: "forge_hammer",
            name: "Forge Hammer",
            type: "weapon",
            subcategory: "hammers",
            shopItem: true,
            craftableItem: false,
            damage: "1d10",
            statModifiers: { strength: 2, physical_defense: 1 },
            specialEffects: ["Smithing Strike (On crit, heal all allies in 30m area for 2d4 HP)"],
            enchantmentSlots: 1,
            desc: "A masterwork forge hammer. +2 Strength, +1 PD. Damage: 1d10. Effect: Smithing Strike",
            icon: "🔨",
            price: 240,
            rarity: "rare"
        },

        // TIER 6
        storm_maul: {
            id: "storm_maul",
            name: "Storm Maul",
            type: "weapon",
            subcategory: "hammers",
            shopItem: true,
            craftableItem: false,
            damage: "1d12",
            statModifiers: { strength: 3, physical_defense: 2 },
            specialEffects: ["Thunderstrike skill costs 2 less stamina when wielding this weapon"],
            enchantmentSlots: 2,
            desc: "A maul crackling with storms. +3 Strength, +2 PD. Damage: 1d12. Effect: Thunderstrike cost reduction",
            icon: "🔨",
            price: 400,
            rarity: "rare"
        },
        crystal_maul: {
            id: "crystal_maul",
            name: "Crystal Maul",
            type: "weapon",
            subcategory: "hammers",
            shopItem: true,
            craftableItem: false,
            damage: "1d12",
            statModifiers: { strength: 2, magic: 2 },
            specialEffects: ["Resonance (Deal +2 damage for each enemy within melee range)"],
            enchantmentSlots: 2,
            desc: "A crystalline maul. +2 Strength, +2 Magic. Damage: 1d12. Effect: Resonance",
            icon: "🔨",
            price: 300,
            rarity: "rare"
        },
        quake_hammer: {
            id: "quake_hammer",
            name: "Quake Hammer",
            type: "weapon",
            subcategory: "hammers",
            shopItem: true,
            craftableItem: false,
            damage: "1d12",
            statModifiers: { strength: 2, physical_defense: 2 },
            specialEffects: ["Tremor (30% chance to knock down all adjacent enemies)"],
            enchantmentSlots: 2,
            desc: "A hammer that shakes the earth. +2 Strength, +2 PD. Damage: 1d12. Effect: Tremor",
            icon: "🔨",
            price: 350,
            rarity: "rare"
        },
        bone_crusher: {
            id: "bone_crusher",
            name: "Bone Crusher",
            type: "weapon",
            subcategory: "hammers",
            shopItem: true,
            craftableItem: false,
            damage: "1d10",
            statModifiers: { strength: 3, physical_defense: 1 },
            specialEffects: ["20% chance to apply Weakened"],
            enchantmentSlots: 2,
            desc: "A hammer that breaks bones. +3 Strength, +1 PD. Damage: 1d10. Effect: 20% chance to weaken",
            icon: "🔨",
            price: 450,
            rarity: "rare"
        },

        // TIER 7
        obsidian_maul: {
            id: "obsidian_maul",
            name: "Obsidian Maul",
            type: "weapon",
            subcategory: "hammers",
            shopItem: true,
            craftableItem: false,
            damage: "2d6",
            statModifiers: { strength: 3, physical_defense: 3 },
            specialEffects: ["Ground Slam skill costs 2 less stamina when wielding this weapon"],
            enchantmentSlots: 2,
            desc: "A maul of volcanic glass. +3 Strength, +3 PD. Damage: 2d6. Effect: Ground Slam cost reduction",
            icon: "🔨",
            price: 650,
            rarity: "epic"
        },
        soul_hammer: {
            id: "soul_hammer",
            name: "Soul Hammer",
            type: "weapon",
            subcategory: "hammers",
            shopItem: true,
            craftableItem: false,
            damage: "2d6",
            statModifiers: { strength: 3, magic: 2 },
            specialEffects: ["Spirit Drain (Heal for 20% of damage dealt to all allies within range)"],
            enchantmentSlots: 2,
            desc: "A hammer that channels souls. +3 Strength, +2 Magic. Damage: 2d6. Effect: Spirit Drain",
            icon: "🔨",
            price: 600,
            rarity: "epic"
        },
        earth_shaker: {
            id: "earth_shaker",
            name: "Earth Shaker",
            type: "weapon",
            subcategory: "hammers",
            shopItem: true,
            craftableItem: false,
            damage: "2d6",
            statModifiers: { strength: 2, physical_defense: 2, magic: 1 },
            specialEffects: ["Seismic Strike (On crit, deal 2d6 Earth damage to all adjacent enemies)"],
            enchantmentSlots: 2,
            desc: "A hammer that shakes the world. +2 Strength, +2 PD, +1 Magic. Damage: 2d6. Effect: Seismic Strike",
            icon: "🔨",
            price: 700,
            rarity: "epic"
        },
        thunder_maul: {
            id: "thunder_maul",
            name: "Thunder Maul",
            type: "weapon",
            subcategory: "hammers",
            shopItem: true,
            craftableItem: false,
            damage: "2d6",
            statModifiers: { strength: 3, physical_defense: 2 },
            specialEffects: ["Thunderstrike skill costs 3 less stamina when wielding this weapon"],
            enchantmentSlots: 2,
            desc: "A maul of pure thunder. +3 Strength, +2 PD. Damage: 2d6. Effect: Thunderstrike cost reduction",
            icon: "🔨",
            price: 750,
            rarity: "epic"
        },

        // TIER 8
        dragon_maul: {
            id: "dragon_maul",
            name: "Dragon Maul",
            type: "weapon",
            subcategory: "hammers",
            shopItem: true,
            craftableItem: false,
            damage: "2d8",
            statModifiers: { strength: 4, physical_defense: 3 },
            specialEffects: ["Earthquake (Once per battle, create earth fissures: 3d6 Earth damage to all ground enemies)"],
            enchantmentSlots: 3,
            desc: "A maul forged from dragon bone. +4 Strength, +3 PD. Damage: 2d8. Effect: Earthquake",
            icon: "🔨",
            price: 950,
            rarity: "epic"
        },
        void_hammer: {
            id: "void_hammer",
            name: "Void Hammer",
            type: "weapon",
            subcategory: "hammers",
            shopItem: true,
            craftableItem: false,
            damage: "2d8",
            statModifiers: { strength: 3, magic: 3 },
            specialEffects: ["Crushing Blow skill costs 2 less stamina when wielding this weapon"],
            enchantmentSlots: 3,
            desc: "A hammer from the void. +3 Strength, +3 Magic. Damage: 2d8. Effect: Crushing Blow cost reduction",
            icon: "🔨",
            price: 900,
            rarity: "epic"
        },
        celestial_maul: {
            id: "celestial_maul",
            name: "Celestial Maul",
            type: "weapon",
            subcategory: "hammers",
            shopItem: true,
            craftableItem: false,
            damage: "2d8",
            statModifiers: { strength: 4, magic: 2 },
            specialEffects: ["Meteor Strike (On kill, 20% chance to call down meteors: 2d8 Earth damage to random enemies)"],
            enchantmentSlots: 3,
            desc: "A maul blessed by the heavens. +4 Strength, +2 Magic. Damage: 2d8. Effect: Meteor Strike",
            icon: "🔨",
            price: 1000,
            rarity: "epic"
        },

        // TIER 9
        temporal_hammer: {
            id: "temporal_hammer",
            name: "Temporal Hammer",
            type: "weapon",
            subcategory: "hammers",
            shopItem: true,
            craftableItem: false,
            damage: "2d10",
            statModifiers: { strength: 5, physical_defense: 4, magic: 3 },
            specialEffects: ["Time Crush (Attacks slow all enemies hit: -3 SPD for 2 turns)"],
            enchantmentSlots: 3,
            desc: "A hammer that controls time. +5 Strength, +4 PD, +3 Magic. Damage: 2d10. Effect: Time Crush",
            icon: "🔨",
            price: 750,
            rarity: "legendary"
        },
        genesis_hammer: {
            id: "genesis_hammer",
            name: "Genesis Hammer",
            type: "weapon",
            subcategory: "hammers",
            shopItem: true,
            craftableItem: false,
            damage: "2d10",
            statModifiers: { strength: 5, physical_defense: 3 },
            specialEffects: ["World Breaker (Once per battle, deal 3d6 Earth damage to all enemies - Gain +3 PD for 3 turns)"],
            enchantmentSlots: 3,
            desc: "The first hammer, creator of all things. +5 Strength, +3 PD. Damage: 2d10. Effect: World Breaker",
            icon: "🔨",
            price: 1400,
            rarity: "legendary"
        },

        // STAFFS - Following SHOP_EXPANSION_IDEAS.md
        // TIER 1
        apprentice_staff: {
            id: "apprentice_staff",
            name: "Apprentice Staff",
            type: "weapon",
            subcategory: "staffs",
            shopItem: true,
            craftableItem: true,
            craftingCategory: "Smithing",
            craftingMaterials: [
                { id: "ironbark_moss", quantity: 4 },
                { id: "crystal_shard", quantity: 1 },
                { id: "thread", quantity: 2 }
            ],
            requiredSkills: ["smithing_basic"],
            damage: "1d4",
            statModifiers: {},
            specialEffects: [],
            enchantmentSlots: 0,
            desc: "A simple wooden staff. Basic weapon. Damage: 1d4",
            icon: "🪄",
            price: 15,
            rarity: "common"
        },

        // TIER 2
        wooden_staff: {
            id: "wooden_staff",
            name: "Wooden Staff",
            type: "weapon",
            subcategory: "staffs",
            shopItem: false,
            craftableItem: true,
            craftingCategory: "Smithing",
            craftingMaterials: [
                { id: "basic_fabric", quantity: 2 },
                { id: "thread", quantity: 1 }
            ],
            requiredSkills: ["smithing_basic"],
            damage: "1d6",
            statModifiers: { magic: 1, speed: 1 },
            specialEffects: [],
            enchantmentSlots: 0,
            desc: "A simple wooden staff. +1 Magic, +1 Speed. Damage: 1d6",
            icon: "🪄",
            price: 25,
            rarity: "common"
        },
        iron_staff: {
            id: "iron_staff",
            name: "Iron Staff",
            type: "weapon",
            subcategory: "staffs",
            shopItem: false,
            craftableItem: true,
            craftingCategory: "Smithing",
            craftingMaterials: [
                { id: "iron_ingot", quantity: 2 },
                { id: "basic_fabric", quantity: 1 },
                { id: "thread", quantity: 1 }
            ],
            requiredSkills: ["smithing_basic"],
            damage: "1d8",
            statModifiers: { magic: 2, speed: 1 },
            specialEffects: [],
            enchantmentSlots: 0,
            desc: "An iron-reinforced staff. +2 Magic, +1 Speed. Damage: 1d8",
            icon: "🪄",
            price: 40,
            rarity: "common"
        },
        journeyman_staff: {
            id: "journeyman_staff",
            name: "Journeyman Staff",
            type: "weapon",
            subcategory: "staffs",
            shopItem: true,
            craftableItem: true,
            craftingCategory: "Smithing",
            craftingMaterials: [
                { id: "apprentice_staff", quantity: 1 },
                { id: "crystal_sage", quantity: 1 } // discoverable-items-data.js
            ],
            requiredSkills: ["smithing_basic"],
            damage: "1d6",
            statModifiers: { magic: 1 },
            specialEffects: [],
            enchantmentSlots: 0,
            desc: "An improved staff for mages. +1 Magic. Damage: 1d6",
            icon: "🪄",
            price: 35,
            rarity: "common"
        },
        oak_staff: {
            id: "oak_staff",
            name: "Oak Staff",
            type: "weapon",
            subcategory: "staffs",
            shopItem: true,
            craftableItem: false,
            damage: "1d6",
            statModifiers: { magic: 1 },
            specialEffects: [],
            enchantmentSlots: 0,
            desc: "A staff carved from solid oak. +1 Magic. Damage: 1d6",
            icon: "🪄",
            price: 30,
            rarity: "common"
        },

        birch_staff: {
            id: "birch_staff",
            name: "Birch Staff",
            type: "weapon",
            subcategory: "staffs",
            shopItem: true,
            craftableItem: true,
            craftingCategory: "Smithing",
            craftingMaterials: [
                { id: "ironbark_moss", quantity: 3 },
                { id: "precision_essence", quantity: 1 },
                { id: "thread", quantity: 1 }
            ],
            requiredSkills: ["smithing_basic"],
            damage: "1d6",
            statModifiers: { accuracy: 1 },
            specialEffects: [],
            enchantmentSlots: 0,
            desc: "A staff made from flexible birch wood. +1 Accuracy. Damage: 1d6",
            icon: "🪄",
            price: 35,
            rarity: "common"
        },

        // TIER 3 - Staffs
        ironwood_staff: {
            id: "ironwood_staff",
            name: "Ironwood Staff",
            type: "weapon",
            subcategory: "staffs",
            shopItem: true,
            craftableItem: true,
            craftingCategory: "Smithing",
            craftingMaterials: [
                { id: "journeyman_staff", quantity: 1 },
                { id: "living_rock_fragments", quantity: 1 } // monster-loot-data.js
            ],
            damage: "1d8",
            statModifiers: { magic: 2 },
            specialEffects: [],
            enchantmentSlots: 1,
            desc: "A staff made from ironwood. +2 Magic. Damage: 1d8",
            icon: "🪄",
            price: 60,
            rarity: "common"
        },

        battle_staff: {
            id: "battle_staff",
            name: "Battle Staff",
            type: "weapon",
            subcategory: "staffs",
            shopItem: true,
            craftableItem: true,
            craftingCategory: "Smithing",
            craftingMaterials: [
                { id: "ironwood_staff", quantity: 1 },
                { id: "iron_ingot", quantity: 2 },
                { id: "precision_essence", quantity: 1 }
            ],
            requiredSkills: ["smithing_advanced"],
            damage: "1d8",
            statModifiers: { magic: 1, accuracy: 1 },
            specialEffects: [],
            enchantmentSlots: 1,
            desc: "A reinforced staff for combat mages. +1 Magic, +1 Accuracy. Damage: 1d8",
            icon: "🪄",
            price: 75,
            rarity: "common"
        },

        scholars_staff: {
            id: "scholars_staff",
            name: "Scholar's Staff",
            type: "weapon",
            subcategory: "staffs",
            shopItem: true,
            craftableItem: false,
            damage: "1d8",
            statModifiers: { magic: 1, magicalDefense: 1 },
            specialEffects: [],
            enchantmentSlots: 1,
            desc: "A staff favored by scholars. +1 Magic, +1 Magical Defense. Damage: 1d8",
            icon: "🪄",
            price: 90,
            rarity: "common"
        },

        // TIER 4 - Staffs
        silver_staff: {
            id: "silver_staff",
            name: "Silver Staff",
            type: "weapon",
            subcategory: "staffs",
            shopItem: true,
            craftableItem: false,
            damage: "1d8",
            statModifiers: { magic: 1, magicalDefense: 1 },
            specialEffects: ["Stamina Efficiency (All spells cost 1 less stamina to cast)"],
            enchantmentSlots: 1,
            desc: "A staff inlaid with silver. +1 Magic, +1 Magical Defense. Damage: 1d8. Effect: All spells cost 1 less stamina",
            icon: "🪄",
            price: 150,
            rarity: "uncommon"
        },
        crystal_staff: {
            id: "crystal_staff",
            name: "Crystal Staff",
            type: "weapon",
            subcategory: "staffs",
            shopItem: false,
            craftableItem: true,
            craftingCategory: "Smithing",
            craftingMaterials: [
                { id: "wooden_handle", quantity: 1 },
                { id: "crystal_essence", quantity: 2 },
                { id: "magic_essence", quantity: 1 }
            ],
            requiredSkills: ["smithing_advanced"],
            damage: "1d8 + 1d4 magic",
            statModifiers: { magic: 5, intelligence: 2 },
            specialEffects: [],
            enchantmentSlots: 0,
            desc: "A staff with crystal focus. +5 Magic, +2 Intelligence. Damage: 1d8 + 1d4 magic",
            icon: "🦯",
            price: 130,
            rarity: "uncommon"
        },
        flame_staff: {
            id: "flame_staff",
            name: "Flame Staff",
            type: "weapon",
            subcategory: "staffs",
            shopItem: false,
            craftableItem: true,
            craftingCategory: "Smithing",
            craftingMaterials: [
                { id: "wooden_handle", quantity: 1 },
                { id: "fire_essence", quantity: 2 },
                { id: "magic_essence", quantity: 1 }
            ],
            requiredSkills: ["smithing_advanced"],
            damage: "1d8 + 1d4 fire",
            statModifiers: { magic: 4, intelligence: 3 },
            specialEffects: [],
            enchantmentSlots: 0,
            desc: "A staff wreathed in flames. +4 Magic, +3 Intelligence. Damage: 1d8 + 1d4 fire",
            icon: "🦯",
            price: 130,
            rarity: "uncommon"
        },
        elven_staff: {
            id: "elven_staff",
            name: "Elven Staff",
            type: "weapon",
            subcategory: "staffs",
            shopItem: true,
            craftableItem: false,
            damage: "1d8",
            statModifiers: { magic: 2 },
            specialEffects: ["Spell Focus (Natural Rolls of 18-20 with spells are treated as Critical hits)"],
            enchantmentSlots: 1,
            desc: "An elegant elven staff. +2 Magic. Damage: 1d8. Effect: Spell critical hit enchantment",
            icon: "🪄",
            price: 175,
            rarity: "uncommon"
        },

        sages_staff: {
            id: "sages_staff",
            name: "Sage's Staff",
            type: "weapon",
            subcategory: "staffs",
            shopItem: true,
            craftableItem: false,
            damage: "1d8",
            statModifiers: { magic: 1, speed: 1 },
            specialEffects: ["Meditation (Restore 1 stamina at the start of each turn)"],
            enchantmentSlots: 1,
            desc: "A staff of the wise. +1 Magic, +1 Speed. Damage: 1d8. Effect: Stamina regeneration",
            icon: "🪄",
            price: 160,
            rarity: "uncommon"
        },

        // TIER 5 - Staffs
        fire_staff: {
            id: "fire_staff",
            name: "Fire Staff",
            type: "weapon",
            subcategory: "staffs",
            shopItem: true,
            craftableItem: false,
            damage: "1d10",
            statModifiers: { magic: 2, accuracy: 2 },
            specialEffects: ["All Fire spells cost 1 less stamina and have +10% increased status effect chance"],
            enchantmentSlots: 2,
            desc: "A staff wreathed in flames. +2 Magic, +2 Accuracy. Damage: 1d10. Effect: Fire spell enchantment",
            icon: "🔥",
            price: 300,
            rarity: "rare"
        },

        ice_staff: {
            id: "ice_staff",
            name: "Ice Staff",
            type: "weapon",
            subcategory: "staffs",
            shopItem: true,
            craftableItem: false,
            damage: "1d10",
            statModifiers: { magic: 2, magicalDefense: 1 },
            specialEffects: ["All Ice spells cost 1 less stamina and have +10% status effect chance"],
            enchantmentSlots: 2,
            desc: "A staff of eternal ice. +2 Magic, +1 Magical Defense. Damage: 1d10. Effect: Ice spell enchantment",
            icon: "❄️",
            price: 290,
            rarity: "rare"
        },

        shadow_staff: {
            id: "shadow_staff",
            name: "Shadow Staff",
            type: "weapon",
            subcategory: "staffs",
            shopItem: true,
            craftableItem: false,
            damage: "1d10",
            statModifiers: { magic: 3, accuracy: 1 },
            specialEffects: ["All Darkness spells cost 1 less stamina and have +10% status effect chance"],
            enchantmentSlots: 2,
            desc: "A staff wreathed in shadows. +3 Magic, +1 Accuracy. Damage: 1d10. Effect: Darkness spell enchantment",
            icon: "🌑",
            price: 325,
            rarity: "rare"
        },

        healing_staff: {
            id: "healing_staff",
            name: "Healing Staff",
            type: "weapon",
            subcategory: "staffs",
            shopItem: true,
            craftableItem: false,
            damage: "1d10",
            statModifiers: { magic: 2, magicalDefense: 1 },
            specialEffects: ["All healing effects are increased by 50%"],
            enchantmentSlots: 2,
            desc: "A staff blessed with healing power. +2 Magic, +1 Magical Defense. Damage: 1d10. Effect: Healing enchantment",
            icon: "✨",
            price: 350,
            rarity: "rare"
        },

        // TIER 6 - Staffs
        storm_staff: {
            id: "storm_staff",
            name: "Storm Staff",
            type: "weapon",
            subcategory: "staffs",
            shopItem: true,
            craftableItem: false,
            damage: "1d12",
            statModifiers: { magic: 3, accuracy: 2 },
            specialEffects: ["All Lightning spells cost 1 less stamina and chain to 1 additional target"],
            enchantmentSlots: 2,
            desc: "A staff crackling with lightning. +3 Magic, +2 Accuracy. Damage: 1d12. Effect: Lightning spell enchantment",
            icon: "⚡",
            price: 600,
            rarity: "rare"
        },

        crystal_staff: {
            id: "crystal_staff",
            name: "Crystal Staff",
            type: "weapon",
            subcategory: "staffs",
            shopItem: true,
            craftableItem: false,
            damage: "1d12",
            statModifiers: { magic: 2, magicalDefense: 2 },
            specialEffects: ["Spell Echo (20% chance spells cast twice for no additional cost)"],
            enchantmentSlots: 2,
            desc: "A staff topped with pure crystal. +2 Magic, +2 Magical Defense. Damage: 1d12. Effect: Spell echoing",
            icon: "💎",
            price: 625,
            rarity: "rare"
        },

        light_staff: {
            id: "light_staff",
            name: "Light Staff",
            type: "weapon",
            subcategory: "staffs",
            shopItem: true,
            craftableItem: false,
            damage: "1d12",
            statModifiers: { magic: 2, accuracy: 2 },
            specialEffects: ["All Light spells cost 1 less stamina and have +25% crit chance"],
            enchantmentSlots: 2,
            desc: "A staff radiating pure light. +2 Magic, +2 Accuracy. Damage: 1d12. Effect: Light spell enchantment",
            icon: "☀️",
            price: 650,
            rarity: "rare"
        },

        dark_staff: {
            id: "dark_staff",
            name: "Dark Staff",
            type: "weapon",
            subcategory: "staffs",
            shopItem: true,
            craftableItem: false,
            damage: "1d10",
            statModifiers: { magic: 3, magicalDefense: 1 },
            specialEffects: ["Stamina Burn (Spells that hit restore 2 stamina to caster)"],
            enchantmentSlots: 2,
            desc: "A staff of pure darkness. +3 Magic, +1 Magical Defense. Damage: 1d10. Effect: Stamina restoration",
            icon: "🌚",
            price: 675,
            rarity: "rare"
        },

        // TIER 7 - Staffs
        obsidian_staff: {
            id: "obsidian_staff",
            name: "Obsidian Staff",
            type: "weapon",
            subcategory: "staffs",
            shopItem: true,
            craftableItem: false,
            damage: "2d6",
            statModifiers: { magic: 3, magicalDefense: 2 },
            specialEffects: ["All Earth spells cost 2 less stamina and affect larger areas"],
            enchantmentSlots: 3,
            desc: "A staff carved from volcanic glass. +3 Magic, +2 Magical Defense. Damage: 2d6. Effect: Earth spell mastery",
            icon: "🌋",
            price: 950,
            rarity: "epic"
        },

        arcane_staff: {
            id: "arcane_staff",
            name: "Arcane Staff",
            type: "weapon",
            subcategory: "staffs",
            shopItem: true,
            craftableItem: false,
            damage: "2d6",
            statModifiers: { magic: 3, speed: 2 },
            specialEffects: ["Metamagic (Once per battle, cast any spell without stamina cost)"],
            enchantmentSlots: 3,
            desc: "A staff of pure magical energy. +3 Magic, +2 Speed. Damage: 2d6. Effect: Free spell casting",
            icon: "🔮",
            price: 1050,
            rarity: "epic"
        },

        prismatic_staff: {
            id: "prismatic_staff",
            name: "Prismatic Staff",
            type: "weapon",
            subcategory: "staffs",
            shopItem: true,
            craftableItem: false,
            damage: "2d6",
            statModifiers: { magic: 3, accuracy: 2 },
            specialEffects: ["Elemental Mastery (All elemental spells deal +1d4 damage of their type)"],
            enchantmentSlots: 3,
            desc: "A staff shimmering with all colors. +3 Magic, +2 Accuracy. Damage: 2d6. Effect: Elemental damage boost",
            icon: "🌈",
            price: 1000,
            rarity: "epic"
        },

        time_staff: {
            id: "time_staff",
            name: "Time Staff",
            type: "weapon",
            subcategory: "staffs",
            shopItem: true,
            craftableItem: false,
            damage: "2d6",
            statModifiers: { magic: 3, magicalDefense: 2 },
            specialEffects: ["Temporal Magic (All spells have 25% chance to not consume a turn)"],
            enchantmentSlots: 3,
            desc: "A staff that bends time itself. +3 Magic, +2 Magical Defense. Damage: 2d6. Effect: Time manipulation",
            icon: "⏰",
            price: 1100,
            rarity: "epic"
        },

        // TIER 8 - Staffs
        dragon_staff: {
            id: "dragon_staff",
            name: "Dragon Staff",
            type: "weapon",
            subcategory: "staffs",
            shopItem: true,
            craftableItem: false,
            damage: "2d8",
            statModifiers: { magic: 4, magicalDefense: 3 },
            specialEffects: ["Draconic Power (Once per battle, next spell deals double damage and hits all enemies)"],
            enchantmentSlots: 3,
            desc: "A staff carved from dragon bone. +4 Magic, +3 Magical Defense. Damage: 2d8. Effect: Draconic spell enchantment",
            icon: "🐉",
            price: 1500,
            rarity: "legendary"
        },

        void_staff_supreme: {
            id: "void_staff_supreme",
            name: "Void Staff Supreme",
            type: "weapon",
            subcategory: "staffs",
            shopItem: true,
            craftableItem: false,
            damage: "2d8",
            statModifiers: { magic: 3, speed: 3 },
            specialEffects: ["Reality Bend (Spells ignore all resistances and immunities)"],
            enchantmentSlots: 3,
            desc: "A staff from the void between realities. +3 Magic, +3 Speed. Damage: 2d8. Effect: Spell penetration",
            icon: "🕳️",
            price: 1550,
            rarity: "legendary"
        },

        celestial_staff: {
            id: "celestial_staff",
            name: "Celestial Staff",
            type: "weapon",
            subcategory: "staffs",
            shopItem: true,
            craftableItem: false,
            damage: "2d8",
            statModifiers: { magic: 4, magicalDefense: 2 },
            specialEffects: ["Divine Favor (On spell kill, all allies gain +2 to all stats for 2 turns)"],
            enchantmentSlots: 3,
            desc: "A staff blessed by the heavens. +4 Magic, +2 Magical Defense. Damage: 2d8. Effect: Divine blessing",
            icon: "🌟",
            price: 1450,
            rarity: "legendary"
        },

        // TIER 9 - Staffs
        temporal_staff: {
            id: "temporal_staff",
            name: "Temporal Staff",
            type: "weapon",
            subcategory: "staffs",
            shopItem: true,
            craftableItem: false,
            damage: "2d10",
            statModifiers: { magic: 5, accuracy: 4, speed: 3 },
            specialEffects: ["Time Echo (All spells have 50% chance to trigger again immediately for 0 stamina)"],
            enchantmentSlots: 4,
            desc: "A staff that controls time itself. +5 Magic, +4 Accuracy, +3 Speed. Damage: 2d10. Effect: Spell time echoing",
            icon: "⌛",
            price: 2200,
            rarity: "legendary"
        },

        genesis_staff: {
            id: "genesis_staff",
            name: "Genesis Staff",
            type: "weapon",
            subcategory: "staffs",
            shopItem: true,
            craftableItem: false,
            damage: "2d10",
            statModifiers: { magic: 5, accuracy: 3 },
            specialEffects: ["Divine Power (Once per battle, next spell affects all enemies and costs an additional 1 stamina per extra enemy)"],
            enchantmentSlots: 4,
            desc: "The staff of creation itself. +5 Magic, +3 Accuracy. Damage: 2d10. Effect: Divine spell power",
            icon: "🌌",
            price: 2500,
            rarity: "legendary"
        },

        // POLEARMS - Following SHOP_EXPANSION_IDEAS.md  
        // TIER 1
        spear: {
            id: "spear",
            name: "Spear",
            type: "weapon",
            subcategory: "polearms",
            shopItem: true,
            craftableItem: true,
            craftingCategory: "Smithing",
            craftingMaterials: [
                { id: "thick_hide", quantity: 2 },
                { id: "sharp_claws", quantity: 1 },
                { id: "thread", quantity: 1 }
            ],
            requiredSkills: ["smithing_basic"],
            damage: "1d4",
            statModifiers: {},
            specialEffects: [],
            enchantmentSlots: 0,
            desc: "A basic wooden spear. Basic weapon. Damage: 1d4",
            icon: "🔱",
            price: 10,
            rarity: "common"
        },

        // TIER 2
        pike: {
            id: "pike",
            name: "Pike",
            type: "weapon",
            subcategory: "polearms",
            shopItem: true,
            craftableItem: true,
            craftingCategory: "Smithing",
            craftingMaterials: [
                { id: "spear", quantity: 1 },
                { id: "thick_hide", quantity: 1 } // monster-loot-data.js
            ],
            damage: "1d6",
            statModifiers: { accuracy: 1 },
            specialEffects: [],
            enchantmentSlots: 0,
            desc: "A long military pike. +1 Accuracy. Damage: 1d6",
            icon: "🔱",
            price: 35,
            rarity: "common"
        },
        halberd: {
            id: "halberd",
            name: "Halberd",
            type: "weapon",
            subcategory: "polearms",
            shopItem: true,
            craftableItem: true,
            craftingCategory: "Smithing",
            craftingMaterials: [
                { id: "iron_spear", quantity: 1 },
                { id: "iron_ingot", quantity: 2 },
                { id: "strength_essence", quantity: 1 }
            ],
            requiredSkills: ["smithing_basic"],
            damage: "1d6",
            statModifiers: { strength: 1 },
            specialEffects: [],
            enchantmentSlots: 0,
            desc: "A versatile halberd. +1 Strength. Damage: 1d6",
            icon: "🔱",
            price: 40,
            rarity: "common"
        },

        iron_spear: {
            id: "iron_spear",
            name: "Iron Spear",
            type: "weapon",
            subcategory: "polearms",
            shopItem: true,
            craftableItem: true,
            craftingCategory: "Smithing",
            craftingMaterials: [
                { id: "iron_ingot", quantity: 2 },
                { id: "basic_fabric", quantity: 1 },
                { id: "thread", quantity: 1 }
            ],
            requiredSkills: ["smithing_basic"],
            damage: "1d8",
            statModifiers: { strength: 2, speed: 1 },
            specialEffects: [],
            enchantmentSlots: 0,
            desc: "A spear with an iron tip. +2 Strength, +1 Speed. Damage: 1d8",
            icon: "🔱",
            price: 30,
            rarity: "common"
        },

        // TIER 3 - Polearms
        steel_spear: {
            id: "steel_spear",
            name: "Steel Spear",
            type: "weapon",
            subcategory: "polearms",
            shopItem: true,
            craftableItem: true,
            craftingCategory: "Smithing",
            craftingMaterials: [
                { id: "halberd", quantity: 1 },
                { id: "steel_ingot", quantity: 2 },
                { id: "metallic_fragments", quantity: 1 }
            ],
            requiredSkills: ["smithing_advanced"],
            damage: "1d8",
            statModifiers: { strength: 2 },
            specialEffects: [],
            enchantmentSlots: 1,
            desc: "A spear with a steel head. +2 Strength. Damage: 1d8",
            icon: "🔱",
            price: 60,
            rarity: "common"
        },

        steel_halberd: {
            id: "steel_halberd",
            name: "Steel Halberd",
            type: "weapon",
            subcategory: "polearms",
            shopItem: true,
            craftableItem: true,
            craftingCategory: "Smithing",
            craftingMaterials: [
                { id: "steel_ingot", quantity: 2 },
                { id: "basic_fabric", quantity: 1 },
                { id: "iron_nails", quantity: 1 }
            ],
            requiredSkills: ["smithing_basic"],
            damage: "1d10",
            statModifiers: { strength: 3, speed: 1 },
            specialEffects: [],
            enchantmentSlots: 0,
            desc: "A reinforced steel halberd. +3 Strength, +1 Speed. Damage: 1d10",
            icon: "🔱",
            price: 75,
            rarity: "common"
        },

        lance: {
            id: "lance",
            name: "Lance",
            type: "weapon",
            subcategory: "polearms",
            shopItem: true,
            craftableItem: false,
            damage: "1d8",
            statModifiers: { strength: 1, speed: 1 },
            specialEffects: [],
            enchantmentSlots: 1,
            desc: "A cavalry lance. +1 Strength, +1 Speed. Damage: 1d8",
            icon: "🔱",
            price: 90,
            rarity: "common"
        },

        // TIER 4 - Polearms
        silver_spear: {
            id: "silver_spear",
            name: "Silver Spear",
            type: "weapon",
            subcategory: "polearms",
            shopItem: true,
            craftableItem: true,
            craftingCategory: "Smithing",
            craftingMaterials: [
                { id: "iron_spear", quantity: 1 },
                { id: "silver_ingot", quantity: 1 },
                { id: "thread", quantity: 1 }
            ],
            requiredSkills: ["smithing_advanced"],
            damage: "1d10",
            statModifiers: { strength: 4, accuracy: 2 },
            specialEffects: [],
            enchantmentSlots: 0,
            desc: "A spear with silver tip. +4 Strength, +2 Accuracy. Damage: 1d10",
            icon: "🔱",
            price: 150,
            rarity: "uncommon"
        },
        lightning_spear: {
            id: "lightning_spear",
            name: "Lightning Spear",
            type: "weapon",
            subcategory: "polearms",
            shopItem: false,
            craftableItem: true,
            craftingCategory: "Smithing",
            craftingMaterials: [
                { id: "iron_spear", quantity: 1 },
                { id: "lightning_essence", quantity: 2 },
                { id: "magic_essence", quantity: 1 }
            ],
            requiredSkills: ["smithing_advanced"],
            damage: "1d10 + 1d4 lightning",
            statModifiers: { strength: 3, speed: 3, magic: 1 },
            specialEffects: [],
            enchantmentSlots: 0,
            desc: "A spear crackling with lightning. +3 Strength, +3 Speed, +1 Magic. Damage: 1d10 + 1d4 lightning",
            icon: "🔱",
            price: 130,
            rarity: "uncommon"
        },
        crystal_lance: {
            id: "crystal_lance",
            name: "Crystal Lance",
            type: "weapon",
            subcategory: "polearms",
            shopItem: false,
            craftableItem: true,
            craftingCategory: "Smithing",
            craftingMaterials: [
                { id: "iron_spear", quantity: 1 },
                { id: "crystal_essence", quantity: 2 },
                { id: "magic_essence", quantity: 1 }
            ],
            requiredSkills: ["smithing_advanced"],
            damage: "1d10 + 1d4 magic",
            statModifiers: { strength: 2, accuracy: 4, magic: 2 },
            specialEffects: [],
            enchantmentSlots: 0,
            desc: "A lance with crystal focus. +2 Strength, +4 Accuracy, +2 Magic. Damage: 1d10 + 1d4 magic",
            icon: "🔱",
            price: 130,
            rarity: "uncommon"
        },
        elven_glaive: {
            id: "elven_glaive",
            name: "Elven Glaive",
            type: "weapon",
            subcategory: "polearms",
            shopItem: true,
            craftableItem: false,
            damage: "1d8",
            statModifiers: { speed: 2 },
            specialEffects: ["Graceful Sweep (Natural Rolls of 18-20 are treated as Critical hits)"],
            enchantmentSlots: 1,
            desc: "An elegant elven glaive. +2 Speed. Damage: 1d8. Effect: Enhanced critical hits",
            icon: "🔱",
            price: 175,
            rarity: "uncommon"
        },

        guardian_poleaxe: {
            id: "guardian_poleaxe",
            name: "Guardian Poleaxe",
            type: "weapon",
            subcategory: "polearms",
            shopItem: true,
            craftableItem: false,
            damage: "1d8",
            statModifiers: { strength: 1, physicalDefense: 1 },
            specialEffects: ["Defensive Stance (Piercing Thrust skill costs 1 less stamina when wielding this weapon)"],
            enchantmentSlots: 1,
            desc: "A defensive poleaxe. +1 Strength, +1 Physical Defense. Damage: 1d8. Effect: Skill cost reduction",
            icon: "🔱",
            price: 160,
            rarity: "uncommon"
        },

        // TIER 5 - Polearms
        flame_spear: {
            id: "flame_spear",
            name: "Flame Spear",
            type: "weapon",
            subcategory: "polearms",
            shopItem: true,
            craftableItem: false,
            damage: "1d10",
            statModifiers: { strength: 2, accuracy: 2 },
            specialEffects: ["10% chance to apply Burn (reference to status-effects.js)"],
            enchantmentSlots: 2,
            desc: "A spear wreathed in flames. +2 Strength, +2 Accuracy. Damage: 1d10. Effect: Burn chance",
            icon: "🔥",
            price: 300,
            rarity: "rare"
        },

        frost_lance: {
            id: "frost_lance",
            name: "Frost Lance",
            type: "weapon",
            subcategory: "polearms",
            shopItem: true,
            craftableItem: false,
            damage: "1d10",
            statModifiers: { strength: 2, physicalDefense: 1 },
            specialEffects: ["Ice Pierce (25% chance to slow target: -2 SPD for 2 turns)"],
            enchantmentSlots: 2,
            desc: "A lance of eternal ice. +2 Strength, +1 Physical Defense. Damage: 1d10. Effect: Speed reduction",
            icon: "❄️",
            price: 290,
            rarity: "rare"
        },

        shadow_glaive: {
            id: "shadow_glaive",
            name: "Shadow Glaive",
            type: "weapon",
            subcategory: "polearms",
            shopItem: true,
            craftableItem: false,
            damage: "1d10",
            statModifiers: { speed: 3, accuracy: 1 },
            specialEffects: ["Phantom Strike (Once per battle, next attack has advantage)"],
            enchantmentSlots: 2,
            desc: "A glaive wreathed in shadows. +3 Speed, +1 Accuracy. Damage: 1d10. Effect: Advantaged attack",
            icon: "🌑",
            price: 325,
            rarity: "rare"
        },

        knights_halberd: {
            id: "knights_halberd",
            name: "Knight's Halberd",
            type: "weapon",
            subcategory: "polearms",
            shopItem: true,
            craftableItem: false,
            damage: "1d10",
            statModifiers: { strength: 2, physicalDefense: 1 },
            specialEffects: ["Rally (On crit, all allies gain advantage on their next attack roll)"],
            enchantmentSlots: 2,
            desc: "A noble knight's halberd. +2 Strength, +1 Physical Defense. Damage: 1d10. Effect: Ally inspiration",
            icon: "🛡️",
            price: 350,
            rarity: "rare"
        },

        // TIER 6 - Polearms
        wind_spear: {
            id: "wind_spear",
            name: "Wind Spear",
            type: "weapon",
            subcategory: "polearms",
            shopItem: true,
            craftableItem: false,
            damage: "1d12",
            statModifiers: { speed: 3, accuracy: 2 },
            specialEffects: ["Whirlwind Attack skill costs 2 less stamina when wielding this weapon"],
            enchantmentSlots: 2,
            desc: "A spear blessed by wind spirits. +3 Speed, +2 Accuracy. Damage: 1d12. Effect: Skill cost reduction",
            icon: "💨",
            price: 600,
            rarity: "rare"
        },

        crystal_lance: {
            id: "crystal_lance",
            name: "Crystal Lance",
            type: "weapon",
            subcategory: "polearms",
            shopItem: true,
            craftableItem: false,
            damage: "1d12",
            statModifiers: { strength: 2, magic: 2, accuracy: 1 },
            specialEffects: ["Energy Channel (Decrease enemy's Stamina by 2 and Restore 2 stamina for yourself on hit)"],
            enchantmentSlots: 2,
            desc: "A lance of pure crystal. +2 Strength, +2 Magic, +1 Accuracy. Damage: 1d12. Effect: Stamina manipulation",
            icon: "💎",
            price: 625,
            rarity: "rare"
        },

        storm_glaive: {
            id: "storm_glaive",
            name: "Storm Glaive",
            type: "weapon",
            subcategory: "polearms",
            shopItem: true,
            craftableItem: false,
            damage: "1d12",
            statModifiers: { strength: 2, speed: 2 },
            specialEffects: ["Lightning Strike (On crit, target has disadvantage on their next attack roll)"],
            enchantmentSlots: 2,
            desc: "A glaive crackling with lightning. +2 Strength, +2 Speed. Damage: 1d12. Effect: Attack debuff",
            icon: "⚡",
            price: 650,
            rarity: "rare"
        },

        blood_pike: {
            id: "blood_pike",
            name: "Blood Pike",
            type: "weapon",
            subcategory: "polearms",
            shopItem: true,
            craftableItem: false,
            damage: "1d12",
            statModifiers: { strength: 3, accuracy: 1 },
            specialEffects: ["20% chance to apply Bleed status effect (see status-effects.js)"],
            enchantmentSlots: 2,
            desc: "A pike thirsting for blood. +3 Strength, +1 Accuracy. Damage: 1d12. Effect: Bleed chance",
            icon: "🩸",
            price: 675,
            rarity: "rare"
        },

        // TIER 7 - Polearms
        obsidian_spear: {
            id: "obsidian_spear",
            name: "Obsidian Spear",
            type: "weapon",
            subcategory: "polearms",
            shopItem: true,
            craftableItem: false,
            damage: "2d6",
            statModifiers: { strength: 3, accuracy: 3 },
            specialEffects: ["Piercing Thrust skill costs no stamina when wielding this weapon"],
            enchantmentSlots: 3,
            desc: "A spear of volcanic glass. +3 Strength, +3 Accuracy. Damage: 2d6. Effect: Free skill usage",
            icon: "🌋",
            price: 950,
            rarity: "epic"
        },

        demon_glaive: {
            id: "demon_glaive",
            name: "Demon Glaive",
            type: "weapon",
            subcategory: "polearms",
            shopItem: true,
            craftableItem: false,
            damage: "2d6",
            statModifiers: { strength: 3, magic: 2, accuracy: 1 },
            specialEffects: ["Soul Rend (Heal for 25% of damage dealt)"],
            enchantmentSlots: 3,
            desc: "A glaive forged in the abyss. +3 Strength, +2 Magic, +1 Accuracy. Damage: 2d6. Effect: Life steal",
            icon: "👹",
            price: 1050,
            rarity: "epic"
        },

        holy_lance: {
            id: "holy_lance",
            name: "Holy Lance",
            type: "weapon",
            subcategory: "polearms",
            shopItem: true,
            craftableItem: false,
            damage: "2d6",
            statModifiers: { strength: 3, physicalDefense: 2, magicalDefense: 2 },
            specialEffects: ["Divine Strike (On crit, deal 2d8 Light damage)"],
            enchantmentSlots: 3,
            desc: "A lance blessed by the heavens. +3 Strength, +2 Physical Defense, +2 Magical Defense. Damage: 2d6. Effect: Holy damage",
            icon: "🌟",
            price: 1000,
            rarity: "epic"
        },

        void_halberd: {
            id: "void_halberd",
            name: "Void Halberd",
            type: "weapon",
            subcategory: "polearms",
            shopItem: true,
            craftableItem: false,
            damage: "2d6",
            statModifiers: { strength: 2, speed: 2 },
            specialEffects: ["Dimensional Cut skill costs 3 less stamina when wielding this weapon"],
            enchantmentSlots: 3,
            desc: "A halberd from the void. +2 Strength, +2 Speed. Damage: 2d6. Effect: Skill cost reduction",
            icon: "🕳️",
            price: 1100,
            rarity: "epic"
        },

        // TIER 8 - Polearms
        dragon_spear: {
            id: "dragon_spear",
            name: "Dragon Spear",
            type: "weapon",
            subcategory: "polearms",
            shopItem: true,
            craftableItem: false,
            damage: "2d8",
            statModifiers: { strength: 4, accuracy: 3 },
            specialEffects: ["Draconic Charge (Once per battle, line attack: 3d8 fire damage)"],
            enchantmentSlots: 3,
            desc: "A spear forged from dragon scale. +4 Strength, +3 Accuracy. Damage: 2d8. Effect: Line breath attack",
            icon: "🐉",
            price: 1500,
            rarity: "legendary"
        },

        void_lance: {
            id: "void_lance",
            name: "Void Lance",
            type: "weapon",
            subcategory: "polearms",
            shopItem: true,
            craftableItem: false,
            damage: "2d8",
            statModifiers: { strength: 3, magic: 3 },
            specialEffects: ["Reality Pierce skill costs 2 less stamina when wielding this weapon"],
            enchantmentSlots: 3,
            desc: "A lance that pierces reality itself. +3 Strength, +3 Magic. Damage: 2d8. Effect: Skill cost reduction",
            icon: "🌌",
            price: 1550,
            rarity: "legendary"
        },

        celestial_glaive: {
            id: "celestial_glaive",
            name: "Celestial Glaive",
            type: "weapon",
            subcategory: "polearms",
            shopItem: true,
            craftableItem: false,
            damage: "2d8",
            statModifiers: { strength: 4, magic: 2 },
            specialEffects: ["Star Fall (On kill, 20% chance to rain stars on all visible enemies: 2d10 Light damage)"],
            enchantmentSlots: 3,
            desc: "A glaive blessed by the stars. +4 Strength, +2 Magic. Damage: 2d8. Effect: Star rain",
            icon: "✨",
            price: 1450,
            rarity: "legendary"
        },

        // TIER 9 - Polearms
        temporal_spear: {
            id: "temporal_spear",
            name: "Temporal Spear",
            type: "weapon",
            subcategory: "polearms",
            shopItem: true,
            craftableItem: false,
            damage: "2d10",
            statModifiers: { strength: 5, accuracy: 4, speed: 3 },
            specialEffects: ["Time Pierce (Attacks hit both the target and a random enemy simultaneously)"],
            enchantmentSlots: 4,
            desc: "A spear that transcends time. +5 Strength, +4 Accuracy, +3 Speed. Damage: 2d10. Effect: Dual targeting",
            icon: "⌛",
            price: 2200,
            rarity: "legendary"
        },

        genesis_halberd: {
            id: "genesis_halberd",
            name: "Genesis Halberd",
            type: "weapon",
            subcategory: "polearms",
            shopItem: true,
            craftableItem: false,
            damage: "2d10",
            statModifiers: { strength: 5, physicalDefense: 3 },
            specialEffects: ["Creation Strike (Once per battle, deal 2d10 to all enemies in a line - Gain advantage on next 2 attack rolls)"],
            enchantmentSlots: 4,
            desc: "The halberd of creation itself. +5 Strength, +3 Physical Defense. Damage: 2d10. Effect: Divine line attack",
            icon: "🌌",
            price: 2500,
            rarity: "legendary"
        }

        // Note: This is just the beginning - we need to add all weapon types, armor, and accessories
        // This demonstrates the proper structure for the new items system
    },

    armor: {
        // LIGHT ARMOR - Following SHOP_EXPANSION_IDEAS.md
        // TIER 1
        cloth_robes: {
            id: "cloth_robes",
            name: "Cloth Robes",
            type: "armor",
            subcategory: "Light armor",
            shopItem: true,
            craftableItem: true,
            craftingCategory: "Smithing",
            craftingMaterials: ["basic_fabric", "thread"],
            statModifiers: {},
            specialEffects: [],
            enchantmentSlots: 0,
            desc: "Simple cloth robes. Basic protection.",
            icon: "🧥",
            price: 15,
            rarity: "common"
        },

        // TIER 2  
        leather_vest: {
            id: "leather_vest",
            name: "Leather Vest",
            type: "armor",
            subcategory: "Light armor",
            shopItem: true,
            craftableItem: true,
            craftingCategory: "Smithing",
            craftingMaterials: [
                { id: "leather", quantity: 2 },
                { id: "thread", quantity: 1 }
            ],
            requiredSkills: ["smithing_basic"],
            statModifiers: { physicalDefence: 2, speed: 1 },
            specialEffects: [],
            enchantmentSlots: 0,
            desc: "A basic leather vest. +2 Physical Defence, +1 Speed.",
            icon: "🥋",
            price: 25,
            rarity: "common"
        },
        leather_armor: {
            id: "leather_armor",
            name: "Leather Armor",
            type: "armor",
            subcategory: "Light armor",
            shopItem: true,
            craftableItem: true,
            craftingCategory: "Smithing",
            craftingMaterials: ["leather", "thread"],
            statModifiers: { physicalDefence: 1 },
            specialEffects: [],
            enchantmentSlots: 0,
            desc: "Basic leather armor. +1 Physical Defence.",
            icon: "🥋",
            price: 25,
            rarity: "common"
        },
        padded_armor: {
            id: "padded_armor",
            name: "Padded Armor",
            type: "armor",
            subcategory: "Light armor",
            shopItem: true,
            craftableItem: false,
            statModifiers: { physicalDefence: 1, speed: 1 },
            specialEffects: [],
            enchantmentSlots: 0,
            desc: "Light padded armor. +1 Physical Defence, +1 Speed.",
            icon: "🥋",
            price: 25,
            rarity: "common"
        },

        // TIER 3 - Light Armor
        studded_leather: {
            id: "studded_leather",
            name: "Studded Leather",
            type: "armor",
            subcategory: "Light armor",
            shopItem: true,
            craftableItem: true,
            craftingCategory: "Smithing",
            craftingMaterials: ["leather", "iron_nails", "thread"],
            statModifiers: { physicalDefence: 2, speed: 1 },
            specialEffects: [],
            enchantmentSlots: 0,
            desc: "Reinforced leather with metal studs. +2 Physical Defence, +1 Speed.",
            icon: "🦺",
            price: 45,
            rarity: "common"
        },
        scouts_leather: {
            id: "scouts_leather",
            name: "Scout's Leather",
            type: "armor",
            subcategory: "Light armor",
            shopItem: true,
            craftableItem: true,
            craftingCategory: "Smithing",
            craftingMaterials: [
                { id: "thick_hide", quantity: 3 },
                { id: "sharp_claws", quantity: 2 },
                { id: "thread", quantity: 2 }
            ],
            requiredSkills: ["smithing_basic"],
            statModifiers: { physicalDefence: 1, speed: 2 },
            specialEffects: [],
            enchantmentSlots: 0,
            desc: "Lightweight scouting armor. +1 Physical Defence, +2 Speed.",
            icon: "🦺",
            price: 45,
            rarity: "common"
        },
        hunters_vest: {
            id: "hunters_vest",
            name: "Hunter's Vest",
            type: "armor",
            subcategory: "Light armor",
            shopItem: true,
            craftableItem: true,
            craftingCategory: "Smithing",
            craftingMaterials: [
                { id: "thick_hide", quantity: 2 },
                { id: "thread", quantity: 3 },
                { id: "copper_ingot", quantity: 1 }
            ],
            requiredSkills: ["smithing_basic"],
            statModifiers: { physicalDefence: 1, speed: 1, accuracy: 1 },
            specialEffects: [],
            enchantmentSlots: 0,
            desc: "Practical hunting gear. +1 Physical Defence, +1 Speed, +1 Accuracy.",
            icon: "🦺",
            price: 50,
            rarity: "common"
        },

        // TIER 4 - Light Armor
        reinforced_leather: {
            id: "reinforced_leather",
            name: "Reinforced Leather",
            type: "armor",
            subcategory: "Light armor",
            shopItem: true,
            craftableItem: true,
            craftingCategory: "Smithing",
            craftingMaterials: [
                { id: "scouts_leather", quantity: 1 },
                { id: "iron_ingot", quantity: 2 },
                { id: "metallic_fragments", quantity: 1 }
            ],
            requiredSkills: ["smithing_advanced"],
            statModifiers: { physicalDefence: 2, speed: 1 },
            specialEffects: ["Evasion Training (Enemy close-range attacks have disadvantage on you)"],
            enchantmentSlots: 1,
            desc: "Enhanced leather armor. +2 Physical Defence, +1 Speed. Effect: Evasion boost",
            icon: "🦺",
            price: 125,
            rarity: "uncommon"
        },
        silver_chainmail: {
            id: "silver_chainmail",
            name: "Silver Chainmail",
            type: "armor",
            subcategory: "Light armor",
            shopItem: false,
            craftableItem: true,
            craftingCategory: "Smithing",
            craftingMaterials: [
                { id: "iron_chainmail", quantity: 1 },
                { id: "silver_ingot", quantity: 2 },
                { id: "thread", quantity: 2 }
            ],
            requiredSkills: ["smithing_advanced"],
            statModifiers: { physicalDefence: 4, speed: 2 },
            specialEffects: [],
            enchantmentSlots: 0,
            desc: "Chainmail with silver links. +4 Physical Defence, +2 Speed",
            icon: "🥋",
            price: 130,
            rarity: "uncommon"
        },
        crystal_vest: {
            id: "crystal_vest",
            name: "Crystal Vest",
            type: "armor",
            subcategory: "Light armor",
            shopItem: false,
            craftableItem: true,
            craftingCategory: "Smithing",
            craftingMaterials: [
                { id: "leather_vest", quantity: 1 },
                { id: "crystal_essence", quantity: 2 },
                { id: "magic_essence", quantity: 1 }
            ],
            requiredSkills: ["smithing_advanced"],
            statModifiers: { physicalDefence: 3, magic: 3 },
            specialEffects: [],
            enchantmentSlots: 0,
            desc: "A vest with crystal protection. +3 Physical Defence, +3 Magic",
            icon: "🥋",
            price: 130,
            rarity: "uncommon"
        },
        elven_chain: {
            id: "elven_chain",
            name: "Elven Chain",
            type: "armor",
            subcategory: "Light armor",
            shopItem: true,
            craftableItem: false,
            statModifiers: { physicalDefence: 2, speed: 2 },
            specialEffects: ["Silent Movement (Movement doesn't trigger opportunity attacks)"],
            enchantmentSlots: 1,
            desc: "Elegant elven chainmail. +2 Physical Defence, +2 Speed. Effect: Silent movement",
            icon: "✨",
            price: 150,
            rarity: "uncommon"
        },

        rangers_armor: {
            id: "rangers_armor",
            name: "Ranger's Armor",
            type: "armor",
            subcategory: "Light armor",
            shopItem: true,
            craftableItem: false,
            statModifiers: { physicalDefence: 2, accuracy: 1 },
            specialEffects: ["Camouflage (25% chance attacks against you have disadvantage in wilderness)"],
            enchantmentSlots: 1,
            desc: "Specialized ranger gear. +2 Physical Defence, +1 Accuracy. Effect: Wilderness camouflage",
            icon: "🏹",
            price: 140,
            rarity: "uncommon"
        },

        // TIER 5 - Light Armor
        shadow_leather: {
            id: "shadow_leather",
            name: "Shadow Leather",
            type: "armor",
            subcategory: "Light armor",
            shopItem: true,
            craftableItem: false,
            statModifiers: { physicalDefence: 3, speed: 2 },
            specialEffects: ["Shadow Cloak (Once per battle, become invisible until your next attack or 3 turns)"],
            enchantmentSlots: 2,
            desc: "Armor infused with shadows. +3 Physical Defence, +2 Speed. Effect: Invisibility",
            icon: "🌑",
            price: 275,
            rarity: "rare"
        },

        wind_walker: {
            id: "wind_walker",
            name: "Wind Walker",
            type: "armor",
            subcategory: "Light armor",
            shopItem: true,
            craftableItem: false,
            statModifiers: { physicalDefence: 2, speed: 3 },
            specialEffects: ["Air Dash (Movement speed increased by 50% for 2 turns, once per battle)"],
            enchantmentSlots: 2,
            desc: "Armor blessed by wind spirits. +2 Physical Defence, +3 Speed. Effect: Speed burst",
            icon: "💨",
            price: 300,
            rarity: "rare"
        },

        assassins_garb: {
            id: "assassins_garb",
            name: "Assassin's Garb",
            type: "armor",
            subcategory: "Light armor",
            shopItem: true,
            craftableItem: false,
            statModifiers: { physicalDefence: 2, accuracy: 2 },
            specialEffects: ["First Strike (First attack each battle has advantage)"],
            enchantmentSlots: 2,
            desc: "Armor of the shadow guild. +2 Physical Defence, +2 Accuracy. Effect: First strike advantage",
            icon: "🗡️",
            price: 290,
            rarity: "rare"
        },

        mirror_mail: {
            id: "mirror_mail",
            name: "Mirror Mail",
            type: "armor",
            subcategory: "Light armor",
            shopItem: true,
            craftableItem: false,
            statModifiers: { physicalDefence: 3, speed: 1 },
            specialEffects: ["10% chance to reflect projectile/magic attacks back to attacker"],
            enchantmentSlots: 2,
            desc: "Polished reflective armor. +3 Physical Defence, +1 Speed. Effect: Attack reflection",
            icon: "🪞",
            price: 325,
            rarity: "rare"
        },

        // TIER 6 - Light Armor
        mithril_chain: {
            id: "mithril_chain",
            name: "Mithril Chain",
            type: "armor",
            subcategory: "Light armor",
            shopItem: true,
            craftableItem: false,
            statModifiers: { physicalDefence: 4, speed: 3 },
            specialEffects: ["Weightless (Immune to movement-restricting status effects)"],
            enchantmentSlots: 2,
            desc: "Legendary mithril chainmail. +4 Physical Defence, +3 Speed. Effect: Movement immunity",
            icon: "⭐",
            price: 550,
            rarity: "rare"
        },

        storm_cloak: {
            id: "storm_cloak",
            name: "Storm Cloak",
            type: "armor",
            subcategory: "Light armor",
            shopItem: true,
            craftableItem: false,
            statModifiers: { physicalDefence: 3, speed: 2, accuracy: 1 },
            specialEffects: ["Lightning Reflexes (Enemies attacking you roll 3 dice and take the lowest result)"],
            enchantmentSlots: 2,
            desc: "Cloak crackling with lightning. +3 Physical Defence, +2 Speed, +1 Accuracy. Effect: Enhanced evasion",
            icon: "⚡",
            price: 575,
            rarity: "rare"
        },

        phase_armor: {
            id: "phase_armor",
            name: "Phase Armor",
            type: "armor",
            subcategory: "Light armor",
            shopItem: true,
            craftableItem: false,
            statModifiers: { physicalDefence: 3, accuracy: 2 },
            specialEffects: ["Ethereal Form (Once per battle, negate damage from 1 attack against you)"],
            enchantmentSlots: 2,
            desc: "Armor that phases between dimensions. +3 Physical Defence, +2 Accuracy. Effect: Damage negation",
            icon: "👻",
            price: 600,
            rarity: "rare"
        },

        salamander_hide: {
            id: "salamander_hide",
            name: "Salamander Hide",
            type: "armor",
            subcategory: "Light armor",
            shopItem: true,
            craftableItem: false,
            statModifiers: { physicalDefence: 4, speed: 2 },
            specialEffects: ["Fire Resistance (resistances: { fire: -1 }, weaknesses: { ice: +1 })"],
            elementalAffinities: { resistances: { fire: -1 }, weaknesses: { ice: +1 } },
            enchantmentSlots: 2,
            desc: "Hide from a fire salamander. +4 Physical Defence, +2 Speed. Effect: Fire resistance",
            icon: "🔥",
            price: 625,
            rarity: "rare"
        },

        // TIER 7 - Light Armor
        void_leather: {
            id: "void_leather",
            name: "Void Leather",
            type: "armor",
            subcategory: "Light armor",
            shopItem: true,
            craftableItem: false,
            statModifiers: { physicalDefence: 4, speed: 3, accuracy: 2 },
            specialEffects: ["Dimensional Step (Teleport attacks: appear behind enemy for flanking bonus)"],
            enchantmentSlots: 3,
            desc: "Leather from the void realm. +4 Physical Defence, +3 Speed, +2 Accuracy. Effect: Teleport attacks",
            icon: "🕳️",
            price: 900,
            rarity: "epic"
        },

        celestial_robes: {
            id: "celestial_robes",
            name: "Celestial Robes",
            type: "armor",
            subcategory: "Light armor",
            shopItem: true,
            craftableItem: false,
            statModifiers: { physicalDefence: 4, accuracy: 3, magicalDefence: 1 },
            specialEffects: ["Divine Protection (Heal 1d4 HP when you dodge an attack)"],
            enchantmentSlots: 3,
            desc: "Robes blessed by celestials. +4 Physical Defence, +3 Accuracy, +1 Magical Defence. Effect: Dodge healing",
            icon: "🌟",
            price: 950,
            rarity: "epic"
        },

        phoenix_feather_cloak: {
            id: "phoenix_feather_cloak",
            name: "Phoenix Feather Cloak",
            type: "armor",
            subcategory: "Light armor",
            shopItem: true,
            craftableItem: false,
            statModifiers: { physicalDefence: 4, speed: 3, magicalDefence: 1 },
            specialEffects: ["Rebirth (If reduced to 0 HP, revive with 1 HP once per day)"],
            enchantmentSlots: 3,
            desc: "Cloak woven from phoenix feathers. +4 Physical Defence, +3 Speed, +1 Magical Defence. Effect: Death prevention",
            icon: "🔥",
            price: 980,
            rarity: "epic"
        },

        frost_walker: {
            id: "frost_walker",
            name: "Frost Walker",
            type: "armor",
            subcategory: "Light armor",
            shopItem: true,
            craftableItem: false,
            statModifiers: { physicalDefence: 4, speed: 3, magicalDefence: 1 },
            specialEffects: ["Ice Immunity (resistances: { ice: -3 }, weaknesses: { fire: +2 })"],
            elementalAffinities: { resistances: { ice: -3 }, weaknesses: { fire: +2 } },
            enchantmentSlots: 3,
            desc: "Armor of the ice walkers. +4 Physical Defence, +3 Speed, +1 Magical Defence. Effect: Ice immunity",
            icon: "❄️",
            price: 1000,
            rarity: "epic"
        },

        // TIER 8 - Light Armor
        artifact_robes: {
            id: "artifact_robes",
            name: "Artifact Robes",
            type: "armor",
            subcategory: "Light armor",
            shopItem: true,
            craftableItem: false,
            statModifiers: { physicalDefence: 6, speed: 4, accuracy: 2 },
            specialEffects: ["Spell Deflection (50% chance to deflect spells back at caster)"],
            enchantmentSlots: 3,
            desc: "Ancient artifact robes. +6 Physical Defence, +4 Speed, +2 Accuracy. Effect: Spell reflection",
            icon: "📜",
            price: 1400,
            rarity: "legendary"
        },

        shadowmeld_armor: {
            id: "shadowmeld_armor",
            name: "Shadowmeld Armor",
            type: "armor",
            subcategory: "Light armor",
            shopItem: true,
            craftableItem: false,
            statModifiers: { physicalDefence: 5, speed: 4, magicalDefence: 2 },
            specialEffects: ["Perfect Invisibility (Once per battle, become invisible for 3 turns)"],
            enchantmentSlots: 3,
            desc: "Armor that melds with shadows. +5 Physical Defence, +4 Speed, +2 Magical Defence. Effect: Extended invisibility",
            icon: "🌚",
            price: 1450,
            rarity: "legendary"
        },

        genesis_light_armor: {
            id: "genesis_light_armor",
            name: "Genesis Light Armor",
            type: "armor",
            subcategory: "Light armor",
            shopItem: true,
            craftableItem: false,
            statModifiers: { physicalDefence: 6, accuracy: 4, magicalDefence: 1 },
            specialEffects: ["Reality Shift (Once per battle, negate any effect targeting you)"],
            enchantmentSlots: 3,
            desc: "Armor forged at creation's dawn. +6 Physical Defence, +4 Accuracy, +1 Magical Defence. Effect: Reality negation",
            icon: "🌌",
            price: 1500,
            rarity: "legendary"
        },

        // TIER 9 - Light Armor
        temporal_chain: {
            id: "temporal_chain",
            name: "Temporal Chain",
            type: "armor",
            subcategory: "Light armor",
            shopItem: true,
            craftableItem: false,
            statModifiers: { physicalDefence: 7, speed: 5, accuracy: 4 },
            specialEffects: ["Chronos Guard (All attacks against you have 50% chance to miss due to time distortion)"],
            enchantmentSlots: 4,
            desc: "Chainmail that exists across time. +7 Physical Defence, +5 Speed, +4 Accuracy. Effect: Temporal evasion",
            icon: "⌛",
            price: 2000,
            rarity: "legendary"
        },

        masters_robes: {
            id: "masters_robes",
            name: "Master's Robes",
            type: "armor",
            subcategory: "Light armor",
            shopItem: true,
            craftableItem: false,
            statModifiers: { physicalDefence: 8, accuracy: 5, magicalDefence: 3 },
            specialEffects: ["Transcendence (Once per battle, become incorporeal for 2 turns - immune to all damage)"],
            enchantmentSlots: 4,
            desc: "The ultimate light armor. +8 Physical Defence, +5 Accuracy, +3 Magical Defence. Effect: Incorporeal form",
            icon: "👑",
            price: 2400,
            rarity: "legendary"
        },

        // MEDIUM ARMOR
        // TIER 1
        hide_armor: {
            id: "hide_armor",
            name: "Hide Armor",
            type: "armor",
            subcategory: "Medium armor",
            shopItem: true,
            craftableItem: false,
            statModifiers: { physicalDefence: 1 },
            specialEffects: [],
            enchantmentSlots: 0,
            desc: "Basic hide armor. +1 Physical Defence.",
            icon: "🛡️",
            price: 20,
            rarity: "common"
        },

        // TIER 2
        chain_shirt: {
            id: "chain_shirt",
            name: "Chain Shirt",
            type: "armor",
            subcategory: "Medium armor",
            shopItem: true,
            craftableItem: false,
            statModifiers: { physicalDefence: 2 },
            specialEffects: [],
            enchantmentSlots: 0,
            desc: "Light chain mail shirt. +2 Physical Defence.",
            icon: "🛡️",
            price: 35,
            rarity: "common"
            , craftableItem: true,
            craftingMaterials: ["iron_ingot", "chain_links", "thread"]
        },
        brigandine: {
            id: "brigandine",
            name: "Brigandine",
            type: "armor",
            subcategory: "Medium armor",
            shopItem: true,
            craftableItem: false,
            statModifiers: { physicalDefence: 2, hitPoints: 1 },
            specialEffects: [],
            enchantmentSlots: 0,
            desc: "Flexible armor with metal plates. +2 Physical Defence, +1 Hit Points.",
            icon: "🛡️",
            price: 40,
            rarity: "common"
        },

        // TIER 3
        iron_chainmail: {
            id: "iron_chainmail",
            name: "Iron Chainmail",
            type: "armor",
            subcategory: "Medium armor",
            shopItem: true,
            craftableItem: true,
            craftingCategory: "Smithing",
            craftingMaterials: [
                { id: "iron_ingot", quantity: 3 },
                { id: "chain_links", quantity: 2 },
                { id: "thread", quantity: 1 }
            ],
            requiredSkills: ["smithing_basic"],
            statModifiers: { physicalDefence: 3, hitPoints: 1 },
            specialEffects: [],
            enchantmentSlots: 0,
            desc: "Iron chainmail armor. +3 Physical Defence, +1 Hit Points.",
            icon: "⚔️",
            price: 60,
            rarity: "common"
        },
        chain_mail: {
            id: "chain_mail",
            name: "Chain Mail",
            type: "armor",
            subcategory: "Medium armor",
            shopItem: true,
            craftableItem: false,
            statModifiers: { physicalDefence: 2, hitPoints: 2 },
            specialEffects: [],
            enchantmentSlots: 0,
            desc: "Full chain mail armor. +2 Physical Defence, +2 Hit Points.",
            icon: "⚔️",
            price: 60,
            rarity: "common"
        },
        scale_mail: {
            id: "scale_mail",
            name: "Scale Mail",
            type: "armor",
            subcategory: "Medium armor",
            shopItem: true,
            craftableItem: false,
            statModifiers: { physicalDefence: 3, hitPoints: 1 },
            specialEffects: [],
            enchantmentSlots: 0,
            desc: "Armor made of overlapping scales. +3 Physical Defence, +1 Hit Points.",
            icon: "⚔️",
            price: 70,
            rarity: "common"
        },

        // TIER 3 - Medium Armor (continued)
        banded_mail: {
            id: "banded_mail",
            name: "Banded Mail",
            type: "armor",
            subcategory: "Medium armor",
            shopItem: true,
            craftableItem: false,
            statModifiers: { physicalDefence: 2, hitPoints: 1, stamina: 1 },
            specialEffects: [],
            enchantmentSlots: 0,
            desc: "Mail reinforced with metal bands. +2 Physical Defence, +1 Hit Points, +1 Stamina.",
            icon: "⚔️",
            price: 80,
            rarity: "common"
        },

        // TIER 4 - Medium Armor
        steel_scale: {
            id: "steel_scale",
            name: "Steel Scale",
            type: "armor",
            subcategory: "Medium armor",
            shopItem: true,
            craftableItem: false,
            statModifiers: { physicalDefence: 3, hitPoints: 2 },
            specialEffects: ["Damage Reduction (Reduce all physical damage by 1)"],
            enchantmentSlots: 1,
            desc: "High-quality steel scale armor. +3 Physical Defence, +2 Hit Points. Effect: Damage reduction",
            icon: "🛡️",
            price: 150,
            rarity: "uncommon"
            , craftableItem: true,
            craftingMaterials: ["steel_ingot", "scale_fragment", "thread"]
        },
        mithril_chainmail: {
            id: "mithril_chainmail",
            name: "Mithril Chainmail",
            type: "armor",
            subcategory: "Medium armor",
            shopItem: false,
            craftableItem: true,
            craftingCategory: "Smithing",
            craftingMaterials: [
                { id: "iron_chainmail", quantity: 1 },
                { id: "mithril_ingot", quantity: 2 },
                { id: "thread", quantity: 2 }
            ],
            requiredSkills: ["smithing_advanced"],
            statModifiers: { physicalDefence: 5, speed: 1 },
            specialEffects: [],
            enchantmentSlots: 0,
            desc: "Chainmail made of mithril. +5 Physical Defence, +1 Speed",
            icon: "🛡️",
            price: 130,
            rarity: "uncommon"
        },
        crystal_scale: {
            id: "crystal_scale",
            name: "Crystal Scale",
            type: "armor",
            subcategory: "Medium armor",
            shopItem: false,
            craftableItem: true,
            craftingCategory: "Smithing",
            craftingMaterials: [
                { id: "scale_mail", quantity: 1 },
                { id: "crystal_essence", quantity: 2 },
                { id: "magic_essence", quantity: 1 }
            ],
            requiredSkills: ["smithing_advanced"],
            statModifiers: { physicalDefence: 4, magic: 2 },
            specialEffects: [],
            enchantmentSlots: 0,
            desc: "Scale armor with crystal protection. +4 Physical Defence, +2 Magic",
            icon: "🛡️",
            price: 130,
            rarity: "uncommon"
        },
        dwarven_mail: {
            id: "dwarven_mail",
            name: "Dwarven Mail",
            type: "armor",
            subcategory: "Medium armor",
            shopItem: true,
            craftableItem: true,
            craftingCategory: "Smithing",
            craftingMaterials: [
                { id: "steel_ingot", quantity: 4 },
                { id: "metallic_fragments", quantity: 3 },
                { id: "crusher_molars", quantity: 2 }
            ],
            requiredSkills: ["smithing_advanced"],
            statModifiers: { physicalDefence: 3, hitPoints: 1, stamina: 1 },
            specialEffects: ["Endurance (Recover 1 stamina at start of each turn)"],
            enchantmentSlots: 1,
            desc: "Masterwork dwarven chainmail. +3 Physical Defence, +1 Hit Points, +1 Stamina. Effect: Stamina recovery",
            icon: "⚒️",
            price: 175,
            rarity: "uncommon"
        },

        mercenary_armor: {
            id: "mercenary_armor",
            name: "Mercenary Armor",
            type: "armor",
            subcategory: "Medium armor",
            shopItem: true,
            craftableItem: true,
            craftingCategory: "Smithing",
            craftingMaterials: [
                { id: "iron_ingot", quantity: 3 },
                { id: "thick_hide", quantity: 2 },
                { id: "strength_essence", quantity: 1 }
            ],
            requiredSkills: ["smithing_basic"],
            statModifiers: { physicalDefence: 3, stamina: 2 },
            specialEffects: ["Battle Hardened (Resistance to fear and charm effects)"],
            enchantmentSlots: 1,
            desc: "Practical mercenary gear. +3 Physical Defence, +2 Stamina. Effect: Mental resistance",
            icon: "⚔️",
            price: 160,
            rarity: "uncommon"
        },

        // TIER 5 - Medium Armor
        molten_plate: {
            id: "molten_plate",
            name: "Molten Plate",
            type: "armor",
            subcategory: "Medium armor",
            shopItem: true,
            craftableItem: false,
            statModifiers: { physicalDefence: 4, hitPoints: 3 },
            specialEffects: ["Fire Resistance (resistances: { fire: -2 }, weaknesses: { ice: +1 })"],
            elementalAffinities: { resistances: { fire: -2 }, weaknesses: { ice: +1 } },
            enchantmentSlots: 2,
            desc: "Plate forged in molten lava. +4 Physical Defence, +3 Hit Points. Effect: Fire resistance",
            icon: "🔥",
            price: 300,
            rarity: "rare"
        },

        knights_mail: {
            id: "knights_mail",
            name: "Knight's Mail",
            type: "armor",
            subcategory: "Medium armor",
            shopItem: true,
            craftableItem: false,
            statModifiers: { physicalDefence: 4, hitPoints: 2, stamina: 1 },
            specialEffects: ["Valor (Allies within 30ft gain +1 to attack rolls)"],
            enchantmentSlots: 2,
            desc: "Noble knight's chainmail. +4 Physical Defence, +2 Hit Points, +1 Stamina. Effect: Ally inspiration",
            icon: "🛡️",
            price: 325,
            rarity: "rare"
        },

        war_harness: {
            id: "war_harness",
            name: "War Harness",
            type: "armor",
            subcategory: "Medium armor",
            shopItem: true,
            craftableItem: false,
            statModifiers: { physicalDefence: 3, hitPoints: 4 },
            specialEffects: ["Second Wind (Once per battle, heal 2d6 HP)"],
            enchantmentSlots: 2,
            desc: "Battle-tested war harness. +3 Physical Defence, +4 Hit Points. Effect: Battle healing",
            icon: "⚔️",
            price: 290,
            rarity: "rare"
        },

        storm_mail: {
            id: "storm_mail",
            name: "Storm Mail",
            type: "armor",
            subcategory: "Medium armor",
            shopItem: true,
            craftableItem: true,
            craftingCategory: "Smithing",
            craftingMaterials: [
                { id: "steel_ingot", quantity: 4 },
                { id: "lightning_essence", quantity: 2 },
                { id: "storm_crystal", quantity: 1 }
            ],
            requiredSkills: ["smithing_advanced"],
            statModifiers: { physicalDefence: 3, hitPoints: 2, magicalDefence: 1 },
            specialEffects: ["Lightning Resistance (resistances: { lightning: -2 }, weaknesses: { earth: +1 })"],
            elementalAffinities: { resistances: { lightning: -2 }, weaknesses: { earth: +1 } },
            enchantmentSlots: 2,
            desc: "Mail crackling with electricity. +3 Physical Defence, +2 Hit Points, +1 Magical Defence. Effect: Lightning resistance",
            icon: "⚡",
            price: 310,
            rarity: "rare"
        },

        // TIER 6 - Medium Armor
        enchanted_plate: {
            id: "enchanted_plate",
            name: "Enchanted Plate",
            type: "armor",
            subcategory: "Medium armor",
            shopItem: true,
            craftableItem: true,
            craftingCategory: "Smithing",
            craftingMaterials: [
                { id: "iron_ingot", quantity: 6 },
                { id: "arcane_dust", quantity: 3 },
                { id: "crystal_sage", quantity: 2 }
            ],
            requiredSkills: ["smithing_advanced"],
            statModifiers: { physicalDefence: 5, hitPoints: 3, magicalDefence: 2 },
            specialEffects: ["Magic Ward (Spells have 25% chance to fail against you)"],
            enchantmentSlots: 2,
            desc: "Magically enhanced plate armor. +5 Physical Defence, +3 Hit Points, +2 Magical Defence. Effect: Spell resistance",
            icon: "✨",
            price: 600,
            rarity: "rare"
        },

        guardians_mail: {
            id: "guardians_mail",
            name: "Guardian's Mail",
            type: "armor",
            subcategory: "Medium armor",
            shopItem: true,
            craftableItem: true,
            craftingCategory: "Smithing",
            craftingMaterials: [
                { id: "enchanted_plate", quantity: 1 },
                { id: "holy_essence", quantity: 2 },
                { id: "vitality_essence", quantity: 2 }
            ],
            requiredSkills: ["smithing_master"],
            statModifiers: { physicalDefence: 5, hitPoints: 4 },
            specialEffects: ["Protective Aura (Adjacent allies take 25% less damage)"],
            enchantmentSlots: 2,
            desc: "Mail of the royal guard. +5 Physical Defence, +4 Hit Points. Effect: Ally protection",
            icon: "🛡️",
            price: 625,
            rarity: "rare"
        },

        glacier_chain: {
            id: "glacier_chain",
            name: "Glacier Chain",
            type: "armor",
            subcategory: "Medium armor",
            shopItem: true,
            craftableItem: false,
            statModifiers: { physicalDefence: 4, hitPoints: 3, stamina: 2 },
            specialEffects: ["Ice Mastery (resistances: { ice: -2 }, weaknesses: { fire: +1 }, plus ice spells cost 1 less stamina)"],
            elementalAffinities: { resistances: { ice: -2 }, weaknesses: { fire: +1 } },
            enchantmentSlots: 2,
            desc: "Chainmail forged from glacier ice. +4 Physical Defence, +3 Hit Points, +2 Stamina. Effect: Ice enchantment",
            icon: "❄️",
            price: 650,
            rarity: "rare"
        },

        earthshaker_armor: {
            id: "earthshaker_armor",
            name: "Earthshaker Armor",
            type: "armor",
            subcategory: "Medium armor",
            shopItem: true,
            craftableItem: false,
            statModifiers: { physicalDefence: 4, hitPoints: 2, magicalDefence: 3 },
            specialEffects: ["Earth Attunement (resistances: { earth: -1 }, weaknesses: { wind: +1 })"],
            elementalAffinities: { resistances: { earth: -1 }, weaknesses: { wind: +1 } },
            enchantmentSlots: 2,
            desc: "Armor blessed by earth spirits. +4 Physical Defence, +2 Hit Points, +3 Magical Defence. Effect: Earth resistance",
            icon: "🌍",
            price: 675,
            rarity: "rare"
        },

        // TIER 7 - Medium Armor
        dragonscale_plate: {
            id: "dragonscale_plate",
            name: "Dragonscale Plate",
            type: "armor",
            subcategory: "Medium armor",
            shopItem: true,
            craftableItem: false,
            statModifiers: { physicalDefence: 6, hitPoints: 4, magicalDefence: 3 },
            specialEffects: ["elemental_attunement"],
            enchantmentSlots: 3,
            desc: "Plate made from dragon scales. +6 Physical Defence, +4 Hit Points, +3 Magical Defence. Effect: Elemental immunity",
            icon: "🐉",
            price: 950,
            rarity: "epic"
        },

        paladins_armor: {
            id: "paladins_armor",
            name: "Paladin's Armor",
            type: "armor",
            subcategory: "Medium armor",
            shopItem: true,
            craftableItem: false,
            statModifiers: { physicalDefence: 6, hitPoints: 4, stamina: 2 },
            specialEffects: ["Holy Aura (Undead take 1d6 damage when attacking you)"],
            enchantmentSlots: 3,
            desc: "Blessed paladin armor. +6 Physical Defence, +4 Hit Points, +2 Stamina. Effect: Undead damage",
            icon: "✨",
            price: 1000,
            rarity: "epic"
        },

        demon_plate: {
            id: "demon_plate",
            name: "Demon Plate",
            type: "armor",
            subcategory: "Medium armor",
            shopItem: true,
            craftableItem: false,
            statModifiers: { physicalDefence: 5, hitPoints: 5, magicalDefence: 2 },
            specialEffects: ["Life Steal Armor (Heal 1 HP for every enemy you kill)"],
            enchantmentSlots: 3,
            desc: "Plate forged in the abyss. +5 Physical Defence, +5 Hit Points, +2 Magical Defence. Effect: Kill healing",
            icon: "👹",
            price: 1050,
            rarity: "epic"
        },

        void_plate: {
            id: "void_plate",
            name: "Void Plate",
            type: "armor",
            subcategory: "Medium armor",
            shopItem: true,
            craftableItem: false,
            statModifiers: { physicalDefence: 6, hitPoints: 3, magicalDefence: 3 },
            specialEffects: ["Null Field (Magic effects have 50% chance to be negated)"],
            enchantmentSlots: 3,
            desc: "Plate forged in the void. +6 Physical Defence, +3 Hit Points, +3 Magical Defence. Effect: Magic negation",
            icon: "🕳️",
            price: 1100,
            rarity: "epic"
        },

        // TIER 8 - Medium Armor
        ancient_dragonscale: {
            id: "ancient_dragonscale",
            name: "Ancient Dragonscale",
            type: "armor",
            subcategory: "Medium armor",
            shopItem: true,
            craftableItem: false,
            statModifiers: { physicalDefence: 7, hitPoints: 5, magicalDefence: 4 },
            specialEffects: ["Legendary Resistance (Once per battle, automatically succeed any saving throw)"],
            enchantmentSlots: 3,
            desc: "Scale from an ancient dragon. +7 Physical Defence, +5 Hit Points, +4 Magical Defence. Effect: Save guarantee",
            icon: "🐲",
            price: 1450,
            rarity: "legendary"
        },

        celestial_plate: {
            id: "celestial_plate",
            name: "Celestial Plate",
            type: "armor",
            subcategory: "Medium armor",
            shopItem: true,
            craftableItem: false,
            statModifiers: { physicalDefence: 7, hitPoints: 5, stamina: 3 },
            specialEffects: ["Divine Intervention (When reduced to 0 HP, heal to full once per day)"],
            enchantmentSlots: 3,
            desc: "Plate blessed by celestials. +7 Physical Defence, +5 Hit Points, +3 Stamina. Effect: Death prevention",
            icon: "🌟",
            price: 1500,
            rarity: "legendary"
        },

        temporal_plate: {
            id: "temporal_plate",
            name: "Temporal Plate",
            type: "armor",
            subcategory: "Medium armor",
            shopItem: true,
            craftableItem: false,
            statModifiers: { physicalDefence: 6, hitPoints: 6, magicalDefence: 3 },
            specialEffects: ["Time Shield (Once per battle, reverse all damage taken in last turn)"],
            enchantmentSlots: 3,
            desc: "Plate that exists across time. +6 Physical Defence, +6 Hit Points, +3 Magical Defence. Effect: Damage reversal",
            icon: "⌛",
            price: 1550,
            rarity: "legendary"
        },

        // TIER 9 - Medium Armor
        genesis_plate_medium: {
            id: "genesis_plate_medium",
            name: "Genesis Plate (Medium)",
            type: "armor",
            subcategory: "Medium armor",
            shopItem: true,
            craftableItem: false,
            statModifiers: { physicalDefence: 8, hitPoints: 6, magicalDefence: 5 },
            specialEffects: ["Perfect Defense (Once per battle, become immune to all damage for 1 turn)"],
            enchantmentSlots: 4,
            desc: "Medium armor forged at creation's dawn. +8 Physical Defence, +6 Hit Points, +5 Magical Defence. Effect: Perfect immunity",
            icon: "🌌",
            price: 2200,
            rarity: "legendary"
        },

        masters_scale: {
            id: "masters_scale",
            name: "Master's Scale",
            type: "armor",
            subcategory: "Medium armor",
            shopItem: true,
            craftableItem: false,
            statModifiers: { physicalDefence: 9, hitPoints: 6, stamina: 4 },
            specialEffects: ["Unbreakable (Cannot be reduced below 1 HP except by effects that specifically kill)"],
            enchantmentSlots: 4,
            desc: "The ultimate medium armor. +9 Physical Defence, +6 Hit Points, +4 Stamina. Effect: Death immunity",
            icon: "👑",
            price: 2500,
            rarity: "legendary"
        },

        // HEAVY ARMOR
        // TIER 1
        crude_plate: {
            id: "crude_plate",
            name: "Crude Plate",
            type: "armor",
            subcategory: "Heavy armor",
            shopItem: true,
            craftableItem: false,
            statModifiers: { physicalDefence: 2 },
            specialEffects: [],
            enchantmentSlots: 0,
            desc: "Basic plate armor. +2 Physical Defence.",
            icon: "🛡️",
            price: 30,
            rarity: "common"
        },

        // TIER 2
        iron_plate_armor: {
            id: "iron_plate_armor",
            name: "Iron Plate Armor",
            type: "armor",
            subcategory: "Heavy armor",
            shopItem: true,
            craftableItem: true,
            craftingCategory: "Smithing",
            craftingMaterials: [
                { id: "iron_ingot", quantity: 4 },
                { id: "iron_plate", quantity: 2 },
                { id: "leather_strap", quantity: 1 }
            ],
            requiredSkills: ["smithing_basic"],
            statModifiers: { physicalDefence: 4, hitPoints: 2, speed: -1 },
            specialEffects: [],
            enchantmentSlots: 0,
            desc: "Heavy iron plate armor. +4 Physical Defence, +2 Hit Points, -1 Speed.",
            icon: "🛡️",
            price: 80,
            rarity: "common"
        },
        iron_plate: {
            id: "iron_plate",
            name: "Iron Plate",
            type: "armor",
            subcategory: "Heavy armor",
            shopItem: true,
            craftableItem: false,
            statModifiers: { physicalDefence: 3 },
            specialEffects: [],
            enchantmentSlots: 0,
            desc: "Solid iron plate armor. +3 Physical Defence.",
            icon: "🛡️",
            price: 45,
            rarity: "common"
            , craftableItem: true,
            craftingMaterials: ["iron_ingot", "leather_strap"]
        },
        steel_armor: {
            id: "steel_armor",
            name: "Steel Armor",
            type: "armor",
            subcategory: "Heavy armor",
            shopItem: true,
            craftableItem: false,
            statModifiers: { physicalDefence: 3, magicalDefence: 1 },
            specialEffects: [],
            enchantmentSlots: 0,
            desc: "High-quality steel armor. +3 Physical Defence, +1 Magical Defence.",
            icon: "🛡️",
            price: 50,
            rarity: "common"
        },

        // TIER 3 - Heavy Armor
        reinforced_plate: {
            id: "reinforced_plate",
            name: "Reinforced Plate",
            type: "armor",
            subcategory: "Heavy armor",
            shopItem: true,
            craftableItem: false,
            statModifiers: { physicalDefence: 4, hitPoints: 1 },
            specialEffects: [],
            enchantmentSlots: 0,
            desc: "Reinforced heavy plate. +4 Physical Defence, +1 Hit Points.",
            icon: "🛡️",
            price: 90,
            rarity: "common"
            , craftableItem: true,
            craftingMaterials: ["steel_ingot", "iron_plate", "leather_strap"]
        },

        knights_plate: {
            id: "knights_plate",
            name: "Knight's Plate",
            type: "armor",
            subcategory: "Heavy armor",
            shopItem: true,
            craftableItem: false,
            statModifiers: { physicalDefence: 4, magicalDefence: 2 },
            specialEffects: [],
            enchantmentSlots: 0,
            desc: "Noble knight's full plate. +4 Physical Defence, +2 Magical Defence.",
            icon: "🛡️",
            price: 100,
            rarity: "common"
        },

        fortress_armor: {
            id: "fortress_armor",
            name: "Fortress Armor",
            type: "armor",
            subcategory: "Heavy armor",
            shopItem: true,
            craftableItem: false,
            statModifiers: { physicalDefence: 5, hitPoints: 2 },
            specialEffects: [],
            enchantmentSlots: 0,
            desc: "Fortress-grade heavy armor. +5 Physical Defence, +2 Hit Points.",
            icon: "🏰",
            price: 110,
            rarity: "common"
        },

        // TIER 4 - Heavy Armor
        juggernaut_plate: {
            id: "juggernaut_plate",
            name: "Juggernaut Plate",
            type: "armor",
            subcategory: "Heavy armor",
            shopItem: true,
            craftableItem: false,
            statModifiers: { physicalDefence: 5, hitPoints: 3 },
            specialEffects: ["Unstoppable (Immune to knockdown and movement effects)"],
            enchantmentSlots: 1,
            desc: "Massive siege armor. +5 Physical Defence, +3 Hit Points. Effect: Movement immunity",
            icon: "🤖",
            price: 200,
            rarity: "uncommon"
        },
        mithril_plate_armor: {
            id: "mithril_plate_armor",
            name: "Mithril Plate Armor",
            type: "armor",
            subcategory: "Heavy armor",
            shopItem: false,
            craftableItem: true,
            craftingCategory: "Smithing",
            craftingMaterials: [
                { id: "iron_plate_armor", quantity: 1 },
                { id: "mithril_ingot", quantity: 3 },
                { id: "leather_strap", quantity: 2 }
            ],
            requiredSkills: ["smithing_advanced"],
            statModifiers: { physicalDefence: 6, hitPoints: 3 },
            specialEffects: [],
            enchantmentSlots: 0,
            desc: "Plate armor made of mithril. +6 Physical Defence, +3 Hit Points",
            icon: "🛡️",
            price: 130,
            rarity: "uncommon"
        },
        crystal_plate: {
            id: "crystal_plate",
            name: "Crystal Plate",
            type: "armor",
            subcategory: "Heavy armor",
            shopItem: false,
            craftableItem: true,
            craftingCategory: "Smithing",
            craftingMaterials: [
                { id: "iron_plate_armor", quantity: 1 },
                { id: "crystal_essence", quantity: 3 },
                { id: "magic_essence", quantity: 2 }
            ],
            requiredSkills: ["smithing_advanced"],
            statModifiers: { physicalDefence: 5, hitPoints: 2, magic: 2 },
            specialEffects: [],
            enchantmentSlots: 0,
            desc: "Plate armor with crystal protection. +5 Physical Defence, +2 Hit Points, +2 Magic",
            icon: "🛡️",
            price: 130,
            rarity: "uncommon"
        },
        tower_guard_armor: {
            id: "tower_guard_armor",
            name: "Tower Guard Armor",
            type: "armor",
            subcategory: "Heavy armor",
            shopItem: true,
            craftableItem: false,
            statModifiers: { physicalDefence: 6, hitPoints: 2 },
            specialEffects: ["Sentinel (Attacks of opportunity deal +2 damage)"],
            enchantmentSlots: 1,
            desc: "Elite guard's plate armor. +6 Physical Defence, +2 Hit Points. Effect: Enhanced opportunity attacks",
            icon: "🗼",
            price: 210,
            rarity: "uncommon"
        },

        bastion_armor: {
            id: "bastion_armor",
            name: "Bastion Armor",
            type: "armor",
            subcategory: "Heavy armor",
            shopItem: true,
            craftableItem: false,
            statModifiers: { physicalDefence: 5, hitPoints: 4 },
            specialEffects: ["Shield Wall (Adjacent allies gain +1 physical defense)"],
            enchantmentSlots: 1,
            desc: "Defensive fortress armor. +5 Physical Defence, +4 Hit Points. Effect: Ally defense boost",
            icon: "🛡️",
            price: 190,
            rarity: "uncommon"
        },

        // TIER 5 - Heavy Armor
        dragonbone_plate: {
            id: "dragonbone_plate",
            name: "Dragonbone Plate",
            type: "armor",
            subcategory: "Heavy armor",
            shopItem: true,
            craftableItem: false,
            statModifiers: { physicalDefence: 6, hitPoints: 4, magicalDefence: 2 },
            specialEffects: ["elemental_attunement"],
            enchantmentSlots: 2,
            desc: "Plate forged from dragon bones. +6 Physical Defence, +4 Hit Points, +2 Magical Defence. Effect: Elemental resistance",
            icon: "🐲",
            price: 375,
            rarity: "rare"
        },

        titan_armor: {
            id: "titan_armor",
            name: "Titan Armor",
            type: "armor",
            subcategory: "Heavy armor",
            shopItem: true,
            craftableItem: false,
            statModifiers: { physicalDefence: 7, hitPoints: 5 },
            specialEffects: ["Colossal (Your size counts as one category larger for all effects)"],
            enchantmentSlots: 2,
            desc: "Armor of the ancient titans. +7 Physical Defence, +5 Hit Points. Effect: Size increase",
            icon: "⛰️",
            price: 400,
            rarity: "rare"
        },

        crusader_plate: {
            id: "crusader_plate",
            name: "Crusader Plate",
            type: "armor",
            subcategory: "Heavy armor",
            shopItem: true,
            craftableItem: false,
            statModifiers: { physicalDefence: 6, hitPoints: 3, magicalDefence: 3 },
            specialEffects: ["Righteous Fury (Deal +1 damage against evil creatures)"],
            enchantmentSlots: 2,
            desc: "Holy crusader's armor. +6 Physical Defence, +3 Hit Points, +3 Magical Defence. Effect: Anti-evil damage",
            icon: "⚔️",
            price: 390,
            rarity: "rare"
        },

        fortress_king_armor: {
            id: "fortress_king_armor",
            name: "Fortress King Armor",
            type: "armor",
            subcategory: "Heavy armor",
            shopItem: true,
            craftableItem: false,
            statModifiers: { physicalDefence: 7, hitPoints: 4, stamina: 1 },
            specialEffects: ["Command Presence (Allies gain +1 to all rolls when within 30ft)"],
            enchantmentSlots: 2,
            desc: "Armor of the fortress kings. +7 Physical Defence, +4 Hit Points, +1 Stamina. Effect: Leadership aura",
            icon: "👑",
            price: 425,
            rarity: "rare"
        },

        // TIER 6 - Heavy Armor
        adamantine_plate: {
            id: "adamantine_plate",
            name: "Adamantine Plate",
            type: "armor",
            subcategory: "Heavy armor",
            shopItem: true,
            craftableItem: false,
            statModifiers: { physicalDefence: 8, hitPoints: 5, magicalDefence: 3 },
            specialEffects: ["Adamantine Body (Immune to critical hits and precision damage)"],
            enchantmentSlots: 2,
            desc: "Plate forged from adamantine. +8 Physical Defence, +5 Hit Points, +3 Magical Defence. Effect: Critical immunity",
            icon: "💎",
            price: 750,
            rarity: "rare"
        },

        warmaster_plate: {
            id: "warmaster_plate",
            name: "Warmaster Plate",
            type: "armor",
            subcategory: "Heavy armor",
            shopItem: true,
            craftableItem: false,
            statModifiers: { physicalDefence: 8, hitPoints: 6 },
            specialEffects: ["Tactical Genius (All allies gain +2 initiative)"],
            enchantmentSlots: 2,
            desc: "Armor of legendary warmasters. +8 Physical Defence, +6 Hit Points. Effect: Initiative boost",
            icon: "⚔️",
            price: 800,
            rarity: "rare"
        },

        void_forged_plate: {
            id: "void_forged_plate",
            name: "Void-Forged Plate",
            type: "armor",
            subcategory: "Heavy armor",
            shopItem: true,
            craftableItem: false,
            statModifiers: { physicalDefence: 7, hitPoints: 5, magicalDefence: 4 },
            specialEffects: ["Void Resistance (50% chance to ignore debuffs and curses)"],
            enchantmentSlots: 2,
            desc: "Plate forged in the void. +7 Physical Defence, +5 Hit Points, +4 Magical Defence. Effect: Debuff resistance",
            icon: "🕳️",
            price: 775,
            rarity: "rare"
        },

        mountain_lord_armor: {
            id: "mountain_lord_armor",
            name: "Mountain Lord Armor",
            type: "armor",
            subcategory: "Heavy armor",
            shopItem: true,
            craftableItem: false,
            statModifiers: { physicalDefence: 8, hitPoints: 4, stamina: 2 },
            specialEffects: ["Immovable (Cannot be forcibly moved or teleported)"],
            enchantmentSlots: 2,
            desc: "Armor of the mountain lords. +8 Physical Defence, +4 Hit Points, +2 Stamina. Effect: Movement immunity",
            icon: "🏔️",
            price: 825,
            rarity: "rare"
        },

        // TIER 7 - Heavy Armor
        god_slayer_plate: {
            id: "god_slayer_plate",
            name: "God-Slayer Plate",
            type: "armor",
            subcategory: "Heavy armor",
            shopItem: true,
            craftableItem: false,
            statModifiers: { physicalDefence: 9, hitPoints: 6, magicalDefence: 5 },
            specialEffects: ["Deicide (Deal double damage to divine and celestial creatures)"],
            enchantmentSlots: 3,
            desc: "Armor forged to kill gods. +9 Physical Defence, +6 Hit Points, +5 Magical Defence. Effect: Divine slaying",
            icon: "⚡",
            price: 1150,
            rarity: "epic"
        },

        demon_lord_armor: {
            id: "demon_lord_armor",
            name: "Demon Lord Armor",
            type: "armor",
            subcategory: "Heavy armor",
            shopItem: true,
            craftableItem: false,
            statModifiers: { physicalDefence: 9, hitPoints: 7, stamina: 2 },
            specialEffects: ["Infernal Might (Regenerate 2 HP per turn in combat)"],
            enchantmentSlots: 3,
            desc: "Armor of the demon lords. +9 Physical Defence, +7 Hit Points, +2 Stamina. Effect: Combat regeneration",
            icon: "👹",
            price: 1200,
            rarity: "epic"
        },

        worldbreaker_plate: {
            id: "worldbreaker_plate",
            name: "Worldbreaker Plate",
            type: "armor",
            subcategory: "Heavy armor",
            shopItem: true,
            craftableItem: false,
            statModifiers: { physicalDefence: 10, hitPoints: 8 },
            specialEffects: ["Reality Rend (Your attacks ignore all armor and defenses)"],
            enchantmentSlots: 3,
            desc: "Armor that can break reality. +10 Physical Defence, +8 Hit Points. Effect: Defense piercing",
            icon: "🌍",
            price: 1250,
            rarity: "epic"
        },

        // TIER 8 - Heavy Armor
        cosmic_guardian_plate: {
            id: "cosmic_guardian_plate",
            name: "Cosmic Guardian Plate",
            type: "armor",
            subcategory: "Heavy armor",
            shopItem: true,
            craftableItem: false,
            statModifiers: { physicalDefence: 11, hitPoints: 9, magicalDefence: 6 },
            specialEffects: ["Universal Protection (Immune to instant death and disintegration)"],
            enchantmentSlots: 3,
            desc: "Armor of cosmic guardians. +11 Physical Defence, +9 Hit Points, +6 Magical Defence. Effect: Death immunity",
            icon: "🌌",
            price: 1700,
            rarity: "legendary"
        },

        infinity_plate: {
            id: "infinity_plate",
            name: "Infinity Plate",
            type: "armor",
            subcategory: "Heavy armor",
            shopItem: true,
            craftableItem: false,
            statModifiers: { physicalDefence: 12, hitPoints: 10, stamina: 4 },
            specialEffects: ["Infinite Endurance (Never lose stamina, all abilities cost 0)"],
            enchantmentSlots: 3,
            desc: "Plate forged from infinity itself. +12 Physical Defence, +10 Hit Points, +4 Stamina. Effect: No resource costs",
            icon: "♾️",
            price: 1750,
            rarity: "legendary"
        },

        // TIER 9 - Heavy Armor
        genesis_fortress: {
            id: "genesis_fortress",
            name: "Genesis Fortress",
            type: "armor",
            subcategory: "Heavy armor",
            shopItem: true,
            craftableItem: false,
            statModifiers: { physicalDefence: 15, hitPoints: 12, magicalDefence: 8 },
            specialEffects: ["Primordial Defense (Immune to all damage types except from artifacts)"],
            enchantmentSlots: 4,
            desc: "The ultimate fortress armor from creation's dawn. +15 Physical Defence, +12 Hit Points, +8 Magical Defence. Effect: Near-total immunity",
            icon: "🌌",
            price: 3000,
            rarity: "legendary"
        },

        masters_aegis: {
            id: "masters_aegis",
            name: "Master's Aegis",
            type: "armor",
            subcategory: "Heavy armor",
            shopItem: true,
            craftableItem: false,
            statModifiers: { physicalDefence: 20, hitPoints: 15, stamina: 5 },
            specialEffects: ["Perfect Aegis (Reflect all damage back to attackers while taking none yourself)"],
            enchantmentSlots: 4,
            desc: "The ultimate heavy armor. +20 Physical Defence, +15 Hit Points, +5 Stamina. Effect: Perfect reflection",
            icon: "👑",
            price: 4000,
            rarity: "legendary"
        },

        // ROBES & MAGICAL ARMOR
        apprentice_robes: {
            id: "apprentice_robes",
            name: "Apprentice Robes",
            type: "armor",
            subcategory: "Robes",
            shopItem: true,
            craftableItem: false,
            statModifiers: { magicalDefence: 1 },
            specialEffects: [],
            enchantmentSlots: 0,
            desc: "Simple mage robes. +1 Magical Defence.",
            icon: "🧙‍♂️",
            price: 25,
            rarity: "common"
            , craftableItem: true,
            craftingMaterials: ["basic_fabric", "thread", "arcane_dust"]
        },
        journeyman_vestments: {
            id: "journeyman_vestments",
            name: "Journeyman Vestments",
            type: "armor",
            subcategory: "Robes",
            shopItem: true,
            craftableItem: false,
            statModifiers: { magicalDefence: 2, magic: 1 },
            specialEffects: [],
            enchantmentSlots: 0,
            desc: "Improved mage robes. +2 Magical Defence, +1 Magic.",
            icon: "🧙‍♂️",
            price: 45,
            rarity: "common"
        },
        scholar_robes: {
            id: "scholar_robes",
            name: "Scholar Robes",
            type: "armor",
            subcategory: "Robes",
            shopItem: true,
            craftableItem: false,
            statModifiers: { magicalDefence: 1, magic: 2 },
            specialEffects: [],
            enchantmentSlots: 0,
            desc: "Academic robes for scholars. +1 Magical Defence, +2 Magic.",
            icon: "🧙‍♂️",
            price: 50,
            rarity: "common"
        },

        // TIER 3 - Robes
        adept_robes: {
            id: "adept_robes",
            name: "Adept Robes",
            type: "armor",
            subcategory: "Robes",
            shopItem: true,
            craftableItem: false,
            statModifiers: { magicalDefence: 2, magic: 2, stamina: 1 },
            specialEffects: [],
            enchantmentSlots: 0,
            desc: "Robes of a magical adept. +2 Magical Defence, +2 Magic, +1 Stamina.",
            icon: "🧙‍♂️",
            price: 90,
            rarity: "common"
        },

        elementalist_vestments: {
            id: "elementalist_vestments",
            name: "Elementalist Vestments",
            type: "armor",
            subcategory: "Robes",
            shopItem: true,
            craftableItem: false,
            statModifiers: { magicalDefence: 3, magic: 3 },
            specialEffects: [],
            enchantmentSlots: 0,
            desc: "Robes woven with elemental magic. +3 Magical Defence, +3 Magic.",
            icon: "🔥",
            price: 100,
            rarity: "common"
        },

        battle_mage_robes: {
            id: "battle_mage_robes",
            name: "Battle Mage Robes",
            type: "armor",
            subcategory: "Robes",
            shopItem: true,
            craftableItem: false,
            statModifiers: { magicalDefence: 2, magic: 2, physicalDefence: 1 },
            specialEffects: [],
            enchantmentSlots: 0,
            desc: "Reinforced robes for combat mages. +2 Magical Defence, +2 Magic, +1 Physical Defence.",
            icon: "⚔️",
            price: 110,
            rarity: "common"
            , craftableItem: true,
            craftingMaterials: ["basic_fabric", "thread", "iron_nails", "arcane_dust"]
        },

        // TIER 4 - Robes
        enchanted_silk_robes: {
            id: "enchanted_silk_robes",
            name: "Enchanted Silk Robes",
            type: "armor",
            subcategory: "Robes",
            shopItem: true,
            craftableItem: false,
            statModifiers: { magicalDefence: 3, magic: 4 },
            specialEffects: ["Mana Efficiency (Spells cost 1 less stamina, minimum 1)"],
            enchantmentSlots: 1,
            desc: "Silk robes enhanced with magic. +3 Magical Defence, +4 Magic. Effect: Reduced spell costs",
            icon: "✨",
            price: 200,
            rarity: "uncommon"
        },

        flame_weaver_robes: {
            id: "flame_weaver_robes",
            name: "Flame Weaver Robes",
            type: "armor",
            subcategory: "Robes",
            shopItem: true,
            craftableItem: false,
            statModifiers: { magicalDefence: 4, magic: 3 },
            specialEffects: ["Fire Mastery (resistances: { fire: -2 }, fire spells deal +1 damage)"],
            elementalAffinities: { resistances: { fire: -2 }, weaknesses: { ice: +1 } },
            enchantmentSlots: 1,
            desc: "Robes woven from salamander hide. +4 Magical Defence, +3 Magic. Effect: Fire enchantment",
            icon: "🔥",
            price: 210,
            rarity: "uncommon"
        },

        storm_caller_vestments: {
            id: "storm_caller_vestments",
            name: "Storm Caller Vestments",
            type: "armor",
            subcategory: "Robes",
            shopItem: true,
            craftableItem: false,
            statModifiers: { magicalDefence: 3, magic: 3, stamina: 2 },
            specialEffects: ["Lightning Mastery (resistances: { lightning: -2 }, lightning spells cost 1 less stamina)"],
            elementalAffinities: { resistances: { lightning: -2 }, weaknesses: { earth: +1 } },
            enchantmentSlots: 1,
            desc: "Vestments crackling with electricity. +3 Magical Defence, +3 Magic, +2 Stamina. Effect: Lightning enchantment",
            icon: "⚡",
            price: 190,
            rarity: "uncommon"
        },

        // TIER 5 - Robes
        archmage_robes: {
            id: "archmage_robes",
            name: "Archmage Robes",
            type: "armor",
            subcategory: "Robes",
            shopItem: true,
            craftableItem: false,
            statModifiers: { magicalDefence: 5, magic: 5, stamina: 2 },
            specialEffects: ["Spell Power (All spells deal +2 damage)"],
            enchantmentSlots: 2,
            desc: "Robes of a true archmage. +5 Magical Defence, +5 Magic, +2 Stamina. Effect: Enhanced spell damage",
            icon: "🧙‍♂️",
            price: 375,
            rarity: "rare"
        },

        void_touched_robes: {
            id: "void_touched_robes",
            name: "Void-Touched Robes",
            type: "armor",
            subcategory: "Robes",
            shopItem: true,
            craftableItem: false,
            statModifiers: { magicalDefence: 4, magic: 4, hitPoints: 2 },
            specialEffects: ["Void Mastery (resistances: { necrotic: -2 }, necrotic spells deal +2 damage)"],
            elementalAffinities: { resistances: { necrotic: -2 } },
            enchantmentSlots: 2,
            desc: "Robes touched by the void. +4 Magical Defence, +4 Magic, +2 Hit Points. Effect: Necrotic enchantment",
            icon: "🕳️",
            price: 400,
            rarity: "rare"
        },

        celestial_vestments: {
            id: "celestial_vestments",
            name: "Celestial Vestments",
            type: "armor",
            subcategory: "Robes",
            shopItem: true,
            craftableItem: false,
            statModifiers: { magicalDefence: 6, magic: 4, hitPoints: 1 },
            specialEffects: ["Divine Protection (Immune to charm and fear effects)"],
            enchantmentSlots: 2,
            desc: "Vestments blessed by celestials. +6 Magical Defence, +4 Magic, +1 Hit Points. Effect: Mental immunity",
            icon: "🌟",
            price: 390,
            rarity: "rare"
        },

        nature_keeper_robes: {
            id: "nature_keeper_robes",
            name: "Nature Keeper Robes",
            type: "armor",
            subcategory: "Robes",
            shopItem: true,
            craftableItem: false,
            statModifiers: { magicalDefence: 4, magic: 5, stamina: 3 },
            specialEffects: ["Natural Harmony (Regenerate 1 stamina per turn in natural environments)"],
            enchantmentSlots: 2,
            desc: "Robes woven from living vines. +4 Magical Defence, +5 Magic, +3 Stamina. Effect: Nature regeneration",
            icon: "🌿",
            price: 410,
            rarity: "rare"
        },

        // TIER 6 - Robes
        planar_scholar_robes: {
            id: "planar_scholar_robes",
            name: "Planar Scholar Robes",
            type: "armor",
            subcategory: "Robes",
            shopItem: true,
            craftableItem: false,
            statModifiers: { magicalDefence: 6, magic: 6, stamina: 3 },
            specialEffects: ["Planar Knowledge (Can cast spells from any school regardless of class)"],
            enchantmentSlots: 2,
            desc: "Robes that exist across planes. +6 Magical Defence, +6 Magic, +3 Stamina. Effect: Universal spellcasting",
            icon: "🌌",
            price: 750,
            rarity: "rare"
        },

        dragon_scale_robes: {
            id: "dragon_scale_robes",
            name: "Dragon Scale Robes",
            type: "armor",
            subcategory: "Robes",
            shopItem: true,
            craftableItem: false,
            statModifiers: { magicalDefence: 7, magic: 5, physicalDefence: 2 },
            specialEffects: ["elemental_attunement"],
            enchantmentSlots: 2,
            desc: "Robes lined with dragon scales. +7 Magical Defence, +5 Magic, +2 Physical Defence. Effect: Elemental immunity",
            icon: "🐉",
            price: 800,
            rarity: "rare"
        },

        time_mage_vestments: {
            id: "time_mage_vestments",
            name: "Time Mage Vestments",
            type: "armor",
            subcategory: "Robes",
            shopItem: true,
            craftableItem: false,
            statModifiers: { magicalDefence: 6, magic: 7, hitPoints: 2 },
            specialEffects: ["Temporal Mastery (Once per battle, take an extra turn)"],
            enchantmentSlots: 2,
            desc: "Vestments that bend time. +6 Magical Defence, +7 Magic, +2 Hit Points. Effect: Extra turn",
            icon: "⌛",
            price: 825,
            rarity: "rare"
        },

        chaos_weaver_robes: {
            id: "chaos_weaver_robes",
            name: "Chaos Weaver Robes",
            type: "armor",
            subcategory: "Robes",
            shopItem: true,
            craftableItem: false,
            statModifiers: { magicalDefence: 5, magic: 8 },
            specialEffects: ["Chaos Magic (All spells have random additional effects)"],
            enchantmentSlots: 2,
            desc: "Robes that channel pure chaos. +5 Magical Defence, +8 Magic. Effect: Random spell bonuses",
            icon: "🌪️",
            price: 775,
            rarity: "rare"
        },

        // TIER 7 - Robes
        reality_shaper_robes: {
            id: "reality_shaper_robes",
            name: "Reality Shaper Robes",
            type: "armor",
            subcategory: "Robes",
            shopItem: true,
            craftableItem: false,
            statModifiers: { magicalDefence: 8, magic: 8, stamina: 4 },
            specialEffects: ["Reality Alteration (Once per battle, completely negate any effect)"],
            enchantmentSlots: 3,
            desc: "Robes that reshape reality. +8 Magical Defence, +8 Magic, +4 Stamina. Effect: Reality negation",
            icon: "🌍",
            price: 1150,
            rarity: "epic"
        },

        cosmic_oracle_vestments: {
            id: "cosmic_oracle_vestments",
            name: "Cosmic Oracle Vestments",
            type: "armor",
            subcategory: "Robes",
            shopItem: true,
            craftableItem: false,
            statModifiers: { magicalDefence: 9, magic: 7, hitPoints: 3 },
            specialEffects: ["Cosmic Insight (See all possible futures, gain +5 to all saving throws)"],
            enchantmentSlots: 3,
            desc: "Vestments of cosmic oracles. +9 Magical Defence, +7 Magic, +3 Hit Points. Effect: Future sight",
            icon: "🔮",
            price: 1200,
            rarity: "epic"
        },

        primordial_force_robes: {
            id: "primordial_force_robes",
            name: "Primordial Force Robes",
            type: "armor",
            subcategory: "Robes",
            shopItem: true,
            craftableItem: false,
            statModifiers: { magicalDefence: 8, magic: 9, physicalDefence: 1 },
            specialEffects: ["Elemental Mastery (All elemental spells deal maximum damage)"],
            enchantmentSlots: 3,
            desc: "Robes channeling primordial forces. +8 Magical Defence, +9 Magic, +1 Physical Defence. Effect: Maximum spell damage",
            icon: "🌊",
            price: 1250,
            rarity: "epic"
        },

        // TIER 8 - Robes
        omnimage_robes: {
            id: "omnimage_robes",
            name: "Omnimage Robes",
            type: "armor",
            subcategory: "Robes",
            shopItem: true,
            craftableItem: false,
            statModifiers: { magicalDefence: 10, magic: 10, stamina: 5 },
            specialEffects: ["Omniscience (Know all spells, unlimited spell slots)"],
            enchantmentSlots: 3,
            desc: "Robes of ultimate magical knowledge. +10 Magical Defence, +10 Magic, +5 Stamina. Effect: Unlimited magic",
            icon: "🧙‍♂️",
            price: 1700,
            rarity: "legendary"
        },

        universe_weaver_vestments: {
            id: "universe_weaver_vestments",
            name: "Universe Weaver Vestments",
            type: "armor",
            subcategory: "Robes",
            shopItem: true,
            craftableItem: false,
            statModifiers: { magicalDefence: 12, magic: 8, hitPoints: 4 },
            specialEffects: ["Universe Control (Create or destroy matter with spells)"],
            enchantmentSlots: 3,
            desc: "Vestments that weave universes. +12 Magical Defence, +8 Magic, +4 Hit Points. Effect: Matter control",
            icon: "🌌",
            price: 1750,
            rarity: "legendary"
        },

        // TIER 9 - Robes
        genesis_mage_robes: {
            id: "genesis_mage_robes",
            name: "Genesis Mage Robes",
            type: "armor",
            subcategory: "Robes",
            shopItem: true,
            craftableItem: false,
            statModifiers: { magicalDefence: 15, magic: 12, stamina: 6 },
            specialEffects: ["Creation Magic (Spells can create permanent effects and items)"],
            enchantmentSlots: 4,
            desc: "Robes worn at the dawn of creation. +15 Magical Defence, +12 Magic, +6 Stamina. Effect: Creation power",
            icon: "🌌",
            price: 3000,
            rarity: "legendary"
        },

        masters_transcendence: {
            id: "masters_transcendence",
            name: "Master's Transcendence",
            type: "armor",
            subcategory: "Robes",
            shopItem: true,
            craftableItem: false,
            statModifiers: { magicalDefence: 20, magic: 15, hitPoints: 5, stamina: 5 },
            specialEffects: ["Transcendent Power (All magical effects are doubled and cost no resources)"],
            enchantmentSlots: 4,
            desc: "The ultimate magical robes transcending mortal limits. +20 Magical Defence, +15 Magic, +5 Hit Points, +5 Stamina. Effect: Transcendent magic",
            icon: "👑",
            price: 4000,
            rarity: "legendary"
        },

        // Note: We'll continue adding more armor types following the same pattern

        // ADDITIONAL ARMOR ITEMS (Consolidated)
        // LIGHT ARMOR - Missing Tier 4+ items
        reinforced_leather: {
            id: "reinforced_leather",
            name: "Reinforced Leather",
            type: "armor",
            subcategory: "Light armor",
            shopItem: true,
            craftableItem: true,
            craftingCategory: "Leatherworking",
            craftingMaterials: [
                { id: "leather", quantity: 3 },
                { id: "iron_ingot", quantity: 1 }
            ],
            requiredSkills: ["leatherworking_basic"],
            statModifiers: { physicalDefence: 2, speed: 1 },
            specialEffects: ["Evasion Training (Enemy close-range attacks have disadvantage on you)"],
            desc: "Reinforced leather armor with metal studs. +2 Physical Defence, +1 Speed. Effect: Evasion Training",
            icon: "🥋",
            price: 120,
            rarity: "uncommon"
        },

        elven_chain: {
            id: "elven_chain",
            name: "Elven Chain",
            type: "armor",
            subcategory: "Light armor",
            shopItem: true,
            craftableItem: true,
            craftingCategory: "Smithing",
            craftingMaterials: [
                { id: "mithril_ingot", quantity: 2 },
                { id: "elven_essence", quantity: 1 }
            ],
            requiredSkills: ["smithing_intermediate"],
            statModifiers: { physicalDefence: 2, speed: 2 },
            specialEffects: ["Silent Movement (Movement doesn't trigger opportunity attacks)"],
            desc: "Lightweight elven chainmail. +2 Physical Defence, +2 Speed. Effect: Silent Movement",
            icon: "🥋",
            price: 150,
            rarity: "uncommon"
        },

        rangers_armor: {
            id: "rangers_armor",
            name: "Ranger's Armor",
            type: "armor",
            subcategory: "Light armor",
            shopItem: true,
            craftableItem: true,
            craftingCategory: "Leatherworking",
            craftingMaterials: [
                { id: "leather", quantity: 4 },
                { id: "green_herb", quantity: 2 }
            ],
            requiredSkills: ["leatherworking_basic"],
            statModifiers: { physicalDefence: 2, accuracy: 1 },
            specialEffects: ["Camouflage (25% chance attacks against you have disadvantage in wilderness)"],
            desc: "Camouflaged ranger armor. +2 Physical Defence, +1 Accuracy. Effect: Camouflage",
            icon: "🥋",
            price: 140,
            rarity: "uncommon"
        },

        // MEDIUM ARMOR - Missing Tier 4+ items
        steel_scale: {
            id: "steel_scale",
            name: "Steel Scale",
            type: "armor",
            subcategory: "Medium armor",
            shopItem: true,
            craftableItem: true,
            craftingCategory: "Smithing",
            craftingMaterials: [
                { id: "steel_ingot", quantity: 3 },
                { id: "leather", quantity: 2 }
            ],
            requiredSkills: ["smithing_basic"],
            statModifiers: { physicalDefence: 3, hitPoints: 2 },
            specialEffects: ["Damage Reduction (Reduce all physical damage by 1)"],
            desc: "Steel scale armor. +3 Physical Defence, +2 Hit Points. Effect: Damage Reduction",
            icon: "🛡️",
            price: 180,
            rarity: "uncommon"
        },

        dwarven_mail: {
            id: "dwarven_mail",
            name: "Dwarven Mail",
            type: "armor",
            subcategory: "Medium armor",
            shopItem: true,
            craftableItem: true,
            craftingCategory: "Smithing",
            craftingMaterials: [
                { id: "steel_ingot", quantity: 4 },
                { id: "dwarven_essence", quantity: 1 }
            ],
            requiredSkills: ["smithing_intermediate"],
            statModifiers: { physicalDefence: 3, hitPoints: 1, stamina: 1 },
            specialEffects: ["Endurance (Recover 1 stamina at start of each turn)"],
            desc: "Dwarven-crafted mail armor. +3 Physical Defence, +1 Hit Points, +1 Stamina. Effect: Endurance",
            icon: "🛡️",
            price: 200,
            rarity: "uncommon"
        },

        // HEAVY ARMOR - Missing Tier 4+ items
        fortress_plate: {
            id: "fortress_plate",
            name: "Fortress Plate",
            type: "armor",
            subcategory: "Heavy armor",
            shopItem: true,
            craftableItem: true,
            craftingCategory: "Smithing",
            craftingMaterials: [
                { id: "steel_ingot", quantity: 5 },
                { id: "iron_ingot", quantity: 2 }
            ],
            requiredSkills: ["smithing_intermediate"],
            statModifiers: { physicalDefence: 4, magicalDefence: 2 },
            specialEffects: ["Spell Resistance (Magic attacks have 25% chance to fail)"],
            desc: "Heavy fortress plate armor. +4 Physical Defence, +2 Magical Defence. Effect: Spell Resistance",
            icon: "🛡️",
            price: 250,
            rarity: "uncommon"
        },

        paladin_armor: {
            id: "paladin_armor",
            name: "Paladin Armor",
            type: "armor",
            subcategory: "Heavy armor",
            shopItem: true,
            craftableItem: true,
            craftingCategory: "Smithing",
            craftingMaterials: [
                { id: "steel_ingot", quantity: 4 },
                { id: "holy_essence", quantity: 2 }
            ],
            requiredSkills: ["smithing_intermediate"],
            statModifiers: { physicalDefence: 5, magicalDefence: 1 },
            specialEffects: ["Turn Undead (Undead within 30ft have disadvantage on attacks)"],
            desc: "Holy paladin armor. +5 Physical Defence, +1 Magical Defence. Effect: Turn Undead",
            icon: "🛡️",
            price: 280,
            rarity: "uncommon"
        }
    },

    accessories: {
        // RINGS - Following SHOP_EXPANSION_IDEAS.md 4-tier system
        // TIER 1 (Common)
        copper_ring: {
            id: "copper_ring",
            name: "Copper Ring",
            type: "accessory",
            subcategory: "Rings",
            shopItem: true,
            craftableItem: false,
            statModifiers: { physicalDefence: 1 },
            specialEffects: [],
            desc: "A simple copper ring. +1 Physical Defence.",
            icon: "💍",
            price: 30,
            rarity: "common"
            , craftableItem: true,
            craftingMaterials: ["copper_ingot"]
        },
        iron_band: {
            id: "iron_band",
            name: "Iron Band",
            type: "accessory",
            subcategory: "Rings",
            shopItem: true,
            craftableItem: false,
            statModifiers: { strength: 1 },
            specialEffects: [],
            desc: "A sturdy iron band. +1 Strength.",
            icon: "💍",
            price: 30,
            rarity: "common"
            , craftableItem: true,
            craftingMaterials: ["iron_ingot"]
        },
        silver_ring: {
            id: "silver_ring",
            name: "Silver Ring",
            type: "accessory",
            subcategory: "Rings",
            shopItem: true,
            craftableItem: true,
            craftingCategory: "Smithing",
            craftingMaterials: [
                { id: "silver_ingot", quantity: 1 },
                { id: "crystal_shard", quantity: 1 }
            ],
            requiredSkills: ["smithing_basic"],
            statModifiers: { magic: 1 },
            specialEffects: [],
            desc: "An elegant silver ring. +1 Magic.",
            icon: "💍",
            price: 30,
            rarity: "common"
        },

        // TIER 2 (Uncommon)
        ring_of_strength: {
            id: "ring_of_strength",
            name: "Ring of Strength",
            type: "accessory",
            subcategory: "Rings",
            shopItem: true,
            craftableItem: true,
            craftingCategory: "Smithing",
            craftingMaterials: [
                { id: "iron_ingot", quantity: 2 },
                { id: "strength_essence", quantity: 1 }
            ],
            requiredSkills: ["smithing_basic"],
            statModifiers: { strength: 2 },
            specialEffects: [],
            desc: "A ring that enhances physical power. +2 Strength.",
            icon: "💍",
            price: 60,
            rarity: "uncommon"
        },
        ring_of_precision: {
            id: "ring_of_precision",
            name: "Ring of Precision",
            type: "accessory",
            subcategory: "Rings",
            shopItem: true,
            craftableItem: true,
            craftingCategory: "Smithing",
            craftingMaterials: [
                { id: "silver_ingot", quantity: 2 },
                { id: "precision_essence", quantity: 1 },
                { id: "crystal_shard", quantity: 1 }
            ],
            requiredSkills: ["smithing_advanced"],
            statModifiers: { accuracy: 2 },
            specialEffects: [],
            desc: "A ring that improves aim. +2 Accuracy.",
            icon: "💍",
            price: 60,
            rarity: "uncommon"
        },
        ring_of_swiftness: {
            id: "ring_of_swiftness",
            name: "Ring of Swiftness",
            type: "accessory",
            subcategory: "Rings",
            shopItem: true,
            craftableItem: false,
            statModifiers: { speed: 2 },
            specialEffects: [],
            desc: "A ring that increases agility. +2 Speed.",
            icon: "💍",
            price: 60,
            rarity: "uncommon"
        },
        ring_of_vitality: {
            id: "ring_of_vitality",
            name: "Ring of Vitality",
            type: "accessory",
            subcategory: "Rings",
            shopItem: true,
            craftableItem: false,
            statModifiers: { hitPoints: 3 },
            specialEffects: [],
            desc: "A ring that bolsters health. +3 Hit Points.",
            icon: "💍",
            price: 60,
            rarity: "uncommon"
        },
        ring_of_energy: {
            id: "ring_of_energy",
            name: "Ring of Energy",
            type: "accessory",
            subcategory: "Rings",
            shopItem: true,
            craftableItem: false,
            statModifiers: { stamina: 3 },
            specialEffects: [],
            desc: "A ring that boosts endurance. +3 Stamina.",
            icon: "💍",
            price: 60,
            rarity: "uncommon"
        },

        // TIER 3 (Uncommon)
        ring_of_the_warrior: {
            id: "ring_of_the_warrior",
            name: "Ring of the Warrior",
            type: "accessory",
            subcategory: "Rings",
            shopItem: true,
            craftableItem: false,
            statModifiers: { strength: 2, physicalDefence: 1 },
            specialEffects: [],
            desc: "A ring favored by warriors. +2 Strength, +1 Physical Defence.",
            icon: "💍",
            price: 100,
            rarity: "uncommon"
        },
        ring_of_the_mage: {
            id: "ring_of_the_mage",
            name: "Ring of the Mage",
            type: "accessory",
            subcategory: "Rings",
            shopItem: true,
            craftableItem: true,
            craftingCategory: "Smithing",
            craftingMaterials: [
                { id: "silver_ingot", quantity: 2 },
                { id: "arcane_dust", quantity: 2 }
            ],
            requiredSkills: ["smithing_basic"],
            statModifiers: { magic: 2, magicalDefence: 1 },
            specialEffects: [],
            desc: "A ring cherished by mages. +2 Magic, +1 Magical Defence.",
            icon: "💍",
            price: 100,
            rarity: "uncommon"
        },
        silver_ring: {
            id: "silver_ring",
            name: "Silver Ring",
            type: "accessory",
            subcategory: "Rings",
            shopItem: false,
            craftableItem: true,
            craftingCategory: "Smithing",
            craftingMaterials: [
                { id: "iron_ring", quantity: 1 },
                { id: "silver_ingot", quantity: 1 },
                { id: "crystal_shard", quantity: 1 }
            ],
            requiredSkills: ["smithing_advanced"],
            statModifiers: { magic: 3, intelligence: 2 },
            specialEffects: [],
            enchantmentSlots: 0,
            desc: "A ring with silver enchantment. +3 Magic, +2 Intelligence",
            icon: "💍",
            price: 130,
            rarity: "uncommon"
        },
        crystal_ring: {
            id: "crystal_ring",
            name: "Crystal Ring",
            type: "accessory",
            subcategory: "Rings",
            shopItem: false,
            craftableItem: true,
            craftingCategory: "Smithing",
            craftingMaterials: [
                { id: "iron_ring", quantity: 1 },
                { id: "crystal_essence", quantity: 2 },
                { id: "magic_essence", quantity: 1 }
            ],
            requiredSkills: ["smithing_advanced"],
            statModifiers: { magic: 2, intelligence: 3 },
            specialEffects: [],
            enchantmentSlots: 0,
            desc: "A ring with crystal focus. +2 Magic, +3 Intelligence",
            icon: "💍",
            price: 130,
            rarity: "uncommon"
        },
        ring_of_the_scout: {
            id: "ring_of_the_scout",
            name: "Ring of the Scout",
            type: "accessory",
            subcategory: "Rings",
            shopItem: true,
            craftableItem: true,
            craftingCategory: "Smithing",
            craftingMaterials: [
                { id: "silver_ingot", quantity: 1 },
                { id: "speed_essence", quantity: 1 },
                { id: "precision_essence", quantity: 1 }
            ],
            requiredSkills: ["smithing_basic"],
            statModifiers: { speed: 2, accuracy: 1 },
            specialEffects: [],
            desc: "A ring worn by skilled scouts. +2 Speed, +1 Accuracy.",
            icon: "💍",
            price: 100,
            rarity: "uncommon"
        },
        ring_of_protection: {
            id: "ring_of_protection",
            name: "Ring of Protection",
            type: "accessory",
            subcategory: "Rings",
            shopItem: true,
            craftableItem: true,
            craftingCategory: "Smithing",
            craftingMaterials: [
                { id: "iron_ingot", quantity: 2 },
                { id: "vitality_essence", quantity: 1 },
                { id: "crystal_shard", quantity: 1 }
            ],
            requiredSkills: ["smithing_basic"],
            statModifiers: { physicalDefence: 1, magicalDefence: 1, hitPoints: 2 },
            specialEffects: [],
            desc: "A protective ring. +1 Physical Defence, +1 Magical Defence, +2 Hit Points.",
            icon: "💍",
            price: 110,
            rarity: "uncommon"
        },
        ring_of_power: {
            id: "ring_of_power",
            name: "Ring of Power",
            type: "accessory",
            subcategory: "Rings",
            shopItem: true,
            craftableItem: false,
            statModifiers: { strength: 1, magic: 1, accuracy: 1 },
            specialEffects: [],
            desc: "A ring that enhances multiple abilities. +1 Strength, +1 Magic, +1 Accuracy.",
            icon: "💍",
            price: 125,
            rarity: "uncommon"
        },

        // TIER 4 (Rare)
        ring_of_mastery: {
            id: "ring_of_mastery",
            name: "Ring of Mastery",
            type: "accessory",
            subcategory: "Rings",
            shopItem: true,
            craftableItem: false,
            statModifiers: { strength: 2, magic: 2, speed: 2, accuracy: 2, physicalDefence: 2, magicalDefence: 2, hitPoints: 2, stamina: 2 },
            specialEffects: [],
            desc: "A ring that enhances all abilities. +2 to all stats.",
            icon: "💍",
            price: 250,
            rarity: "rare"
        },
        ring_of_the_elements: {
            id: "ring_of_the_elements",
            name: "Ring of the Elements",
            type: "accessory",
            subcategory: "Rings",
            shopItem: true,
            craftableItem: false,
            statModifiers: { magic: 3, magicalDefence: 2 },
            specialEffects: ["elemental_attunement"],
            desc: "A ring attuned to elemental forces. +3 Magic, +2 Magical Defence. Effect: Choose elemental resistance.",
            icon: "💍",
            price: 300,
            rarity: "rare"
        },
        ring_of_perfect_balance: {
            id: "ring_of_perfect_balance",
            name: "Ring of Perfect Balance",
            type: "accessory",
            subcategory: "Rings",
            shopItem: true,
            craftableItem: false,
            statModifiers: { strength: 2, magic: 2, speed: 2 },
            specialEffects: ["Dual Action (You may use one physical skill and one magical skill in the same turn. You must skip your next turn.)"],
            desc: "A ring that balances physical and magical power. +2 Strength, +2 Magic, +2 Speed. Effect: Dual actions with rest penalty.",
            icon: "💍",
            price: 350,
            rarity: "rare"
        },

        // AMULETS & NECKLACES
        simple_pendant: {
            id: "simple_pendant",
            name: "Simple Pendant",
            type: "accessory",
            subcategory: "Necklaces",
            shopItem: true,
            craftableItem: false,
            statModifiers: { magicalDefence: 1 },
            specialEffects: [],
            desc: "A basic pendant for protection. +1 Magical Defence.",
            icon: "📿",
            price: 25,
            rarity: "common"
            , craftableItem: true,
            craftingMaterials: ["copper_ingot", "thread"]
        },
        charm_of_health: {
            id: "charm_of_health",
            name: "Charm of Health",
            type: "accessory",
            subcategory: "Necklaces",
            shopItem: true,
            craftableItem: false,
            statModifiers: { hitPoints: 2 },
            specialEffects: [],
            desc: "A charm that boosts vitality. +2 Hit Points.",
            icon: "📿",
            price: 35,
            rarity: "common"
            , craftableItem: true,
            craftingMaterials: ["silver_ingot", "vitality_essence"]
        },
        charm_of_energy: {
            id: "charm_of_energy",
            name: "Charm of Energy",
            type: "accessory",
            subcategory: "Necklaces",
            shopItem: true,
            craftableItem: false,
            statModifiers: { stamina: 2 },
            specialEffects: [],
            desc: "A charm that increases endurance. +2 Stamina.",
            icon: "📿",
            price: 35,
            rarity: "common"
        },

        // TIER 2 - Amulets & Necklaces (Uncommon)
        amulet_of_fire_ward: {
            id: "amulet_of_fire_ward",
            name: "Amulet of Fire Ward",
            type: "accessory",
            subcategory: "Necklaces",
            shopItem: true,
            craftableItem: false,
            statModifiers: { magicalDefence: 1 },
            specialEffects: ["Fire Resistance (25% less fire damage taken)"],
            elementalAffinities: { resistances: { fire: -1 } },
            desc: "An amulet that protects against flames. +1 Magical Defence. Effect: Fire resistance.",
            icon: "🔥",
            price: 75,
            rarity: "uncommon"
            , craftableItem: true,
            craftingMaterials: ["silver_ingot", "fire_essence"]
        },

        amulet_of_ice_shield: {
            id: "amulet_of_ice_shield",
            name: "Amulet of Ice Shield",
            type: "accessory",
            subcategory: "Necklaces",
            shopItem: true,
            craftableItem: false,
            statModifiers: { magicalDefence: 1 },
            specialEffects: ["Ice Resistance (25% less ice damage taken)"],
            elementalAffinities: { resistances: { ice: -1 } },
            desc: "An amulet that shields from frost. +1 Magical Defence. Effect: Ice resistance.",
            icon: "❄️",
            price: 75,
            rarity: "uncommon"
        },

        amulet_of_lightning_guard: {
            id: "amulet_of_lightning_guard",
            name: "Amulet of Lightning Guard",
            type: "accessory",
            subcategory: "Necklaces",
            shopItem: true,
            craftableItem: true,
            craftingCategory: "Smithing",
            craftingMaterials: [
                { id: "silver_ingot", quantity: 1 },
                { id: "lightning_essence", quantity: 1 },
                { id: "crystal_shard", quantity: 1 }
            ],
            requiredSkills: ["smithing_basic"],
            statModifiers: { magicalDefence: 1 },
            specialEffects: ["Lightning Resistance (25% less lightning damage taken)"],
            elementalAffinities: { resistances: { lightning: -1 } },
            desc: "An amulet that guards against storms. +1 Magical Defence. Effect: Lightning resistance.",
            icon: "⚡",
            price: 75,
            rarity: "uncommon"
        },

        amulet_of_the_healer: {
            id: "amulet_of_the_healer",
            name: "Amulet of the Healer",
            type: "accessory",
            subcategory: "Necklaces",
            shopItem: true,
            craftableItem: false,
            statModifiers: { magic: 2 },
            specialEffects: ["Enhanced Healing (All healing effects increased by 25%)"],
            desc: "An amulet blessed by healers. +2 Magic. Effect: Improved healing.",
            icon: "💚",
            price: 100,
            rarity: "uncommon"
        },

        amulet_of_spell_focus: {
            id: "amulet_of_spell_focus",
            name: "Amulet of Spell Focus",
            type: "accessory",
            subcategory: "Necklaces",
            shopItem: true,
            craftableItem: false,
            statModifiers: { magic: 2, accuracy: 1 },
            specialEffects: ["Spell Precision (Spells have +5% critical hit chance)"],
            desc: "An amulet that enhances magical focus. +2 Magic, +1 Accuracy. Effect: Spell crits.",
            icon: "🔮",
            price: 125,
            rarity: "uncommon"
        },

        // TIER 3 - Amulets & Necklaces (Uncommon)
        amulet_of_elemental_defense: {
            id: "amulet_of_elemental_defense",
            name: "Amulet of Elemental Defense",
            type: "accessory",
            subcategory: "Necklaces",
            shopItem: true,
            craftableItem: false,
            statModifiers: { magicalDefence: 2, magic: 1 },
            specialEffects: ["dual_elemental_mastery"],
            desc: "An amulet attuned to multiple elements. +2 Magical Defence, +1 Magic. Effect: Choose 2 resistances.",
            icon: "🌈",
            price: 175,
            rarity: "uncommon"
        },
        silver_pendant: {
            id: "silver_pendant",
            name: "Silver Pendant",
            type: "accessory",
            subcategory: "Necklaces",
            shopItem: false,
            craftableItem: true,
            craftingCategory: "Smithing",
            craftingMaterials: [
                { id: "iron_pendant", quantity: 1 },
                { id: "silver_ingot", quantity: 1 },
                { id: "crystal_shard", quantity: 1 }
            ],
            requiredSkills: ["smithing_advanced"],
            statModifiers: { magic: 3, intelligence: 2 },
            specialEffects: [],
            enchantmentSlots: 0,
            desc: "A pendant with silver enchantment. +3 Magic, +2 Intelligence",
            icon: "📿",
            price: 130,
            rarity: "uncommon"
        },
        crystal_pendant: {
            id: "crystal_pendant",
            name: "Crystal Pendant",
            type: "accessory",
            subcategory: "Necklaces",
            shopItem: false,
            craftableItem: true,
            craftingCategory: "Smithing",
            craftingMaterials: [
                { id: "iron_pendant", quantity: 1 },
                { id: "crystal_essence", quantity: 2 },
                { id: "magic_essence", quantity: 1 }
            ],
            requiredSkills: ["smithing_advanced"],
            statModifiers: { magic: 2, intelligence: 3 },
            specialEffects: [],
            enchantmentSlots: 0,
            desc: "A pendant with crystal focus. +2 Magic, +3 Intelligence",
            icon: "📿",
            price: 130,
            rarity: "uncommon"
        },
        amulet_of_spell_turning: {
            id: "amulet_of_spell_turning",
            name: "Amulet of Spell Turning",
            type: "accessory",
            subcategory: "Necklaces",
            shopItem: true,
            craftableItem: false,
            statModifiers: { magicalDefence: 3 },
            specialEffects: ["Spell Reflection (10% chance to reflect spells back at caster)"],
            desc: "An amulet that turns magic against itself. +3 Magical Defence. Effect: Spell reflection.",
            icon: "🪞",
            price: 200,
            rarity: "uncommon"
        },

        amulet_of_life_force: {
            id: "amulet_of_life_force",
            name: "Amulet of Life Force",
            type: "accessory",
            subcategory: "Necklaces",
            shopItem: true,
            craftableItem: false,
            statModifiers: { hitPoints: 3, stamina: 2 },
            specialEffects: ["Desperation Power (When reduced to 25% HP, gain +1 to all stats)"],
            desc: "An amulet that feeds on life energy. +3 Hit Points, +2 Stamina. Effect: Low HP bonuses.",
            icon: "💗",
            price: 175,
            rarity: "uncommon"
        },

        amulet_of_arcane_power: {
            id: "amulet_of_arcane_power",
            name: "Amulet of Arcane Power",
            type: "accessory",
            subcategory: "Necklaces",
            shopItem: true,
            craftableItem: false,
            statModifiers: { magic: 3, magicalDefence: 1 },
            specialEffects: ["Efficiency (All spells cost 1 less stamina, minimum 1)"],
            desc: "An amulet pulsing with arcane energy. +3 Magic, +1 Magical Defence. Effect: Reduced spell costs.",
            icon: "🌟",
            price: 225,
            rarity: "uncommon"
        },

        amulet_of_divine_favor: {
            id: "amulet_of_divine_favor",
            name: "Amulet of Divine Favor",
            type: "accessory",
            subcategory: "Necklaces",
            shopItem: true,
            craftableItem: false,
            statModifiers: { magic: 2, magicalDefence: 2 },
            specialEffects: ["Light Resistance (25% less light damage taken)"],
            elementalAffinities: { resistances: { light: -1 } },
            desc: "An amulet blessed by divine forces. +2 Magic, +2 Magical Defence. Effect: Light resistance.",
            icon: "✨",
            price: 200,
            rarity: "uncommon"
        },

        // TIER 4 - Amulets & Necklaces (Rare)
        amulet_of_elemental_mastery: {
            id: "amulet_of_elemental_mastery",
            name: "Amulet of Elemental Mastery",
            type: "accessory",
            subcategory: "Necklaces",
            shopItem: true,
            craftableItem: false,
            statModifiers: { magicalDefence: 4, magic: 3 },
            specialEffects: ["Elemental Immunity (Choose 1 element for immunity)"],
            desc: "An amulet of complete elemental mastery. +4 Magical Defence, +3 Magic. Effect: Choose immunity.",
            icon: "💎",
            price: 375,
            rarity: "rare"
        },

        amulet_of_spell_supremacy: {
            id: "amulet_of_spell_supremacy",
            name: "Amulet of Spell Supremacy",
            type: "accessory",
            subcategory: "Necklaces",
            shopItem: true,
            craftableItem: false,
            statModifiers: { magic: 3, magicalDefence: 3, stamina: 2 },
            specialEffects: ["Spell Echo (25% chance to immediately gain an additional action after casting a spell)"],
            desc: "An amulet of supreme magical power. +3 Magic, +3 Magical Defence, +2 Stamina. Effect: Bonus actions.",
            icon: "👑",
            price: 425,
            rarity: "rare"
        },

        amulet_of_universal_protection: {
            id: "amulet_of_universal_protection",
            name: "Amulet of Universal Protection",
            type: "accessory",
            subcategory: "Necklaces",
            shopItem: true,
            craftableItem: false,
            statModifiers: { magicalDefence: 5, physicalDefence: 2 },
            specialEffects: ["Universal Resistance (Resist 25% of all elemental damage)"],
            desc: "An amulet that protects against all forces. +5 Magical Defence, +2 Physical Defence. Effect: All elemental resistance.",
            icon: "🛡️",
            price: 400,
            rarity: "rare"
        },

        // CLOAKS & CAPES
        travelers_cloak: {
            id: "travelers_cloak",
            name: "Traveler's Cloak",
            type: "accessory",
            subcategory: "Cloaks",
            shopItem: true,
            craftableItem: false,
            statModifiers: { speed: 1 },
            specialEffects: [],
            desc: "A practical travel cloak. +1 Speed.",
            icon: "🧥",
            price: 45,
            rarity: "common"
        },
        scouts_cloak: {
            id: "scouts_cloak",
            name: "Scout's Cloak",
            type: "accessory",
            subcategory: "Cloaks",
            shopItem: true,
            craftableItem: true,
            craftingCategory: "Smithing",
            craftingMaterials: [
                { id: "basic_fabric", quantity: 3 },
                { id: "thread", quantity: 2 },
                { id: "precision_essence", quantity: 1 }
            ],
            requiredSkills: ["smithing_basic"],
            statModifiers: { accuracy: 1 },
            specialEffects: [],
            desc: "A cloak favored by scouts. +1 Accuracy.",
            icon: "🧥",
            price: 45,
            rarity: "common"
        },
        simple_cape: {
            id: "simple_cape",
            name: "Simple Cape",
            type: "accessory",
            subcategory: "Cloaks",
            shopItem: true,
            craftableItem: true,
            craftingCategory: "Smithing",
            craftingMaterials: [
                { id: "basic_fabric", quantity: 2 },
                { id: "thread", quantity: 1 },
                { id: "arcane_dust", quantity: 1 }
            ],
            requiredSkills: ["smithing_basic"],
            statModifiers: { magicalDefence: 1 },
            specialEffects: [],
            desc: "A basic cape for protection. +1 Magical Defence.",
            icon: "🧥",
            price: 40,
            rarity: "common"
        },

        // TIER 2 - Cloaks & Capes (Uncommon)
        cloak_of_swiftness: {
            id: "cloak_of_swiftness",
            name: "Cloak of Swiftness",
            type: "accessory",
            subcategory: "Cloaks",
            shopItem: true,
            craftableItem: true,
            craftingCategory: "Smithing",
            craftingMaterials: [
                { id: "simple_cape", quantity: 1 },
                { id: "speed_essence", quantity: 2 },
                { id: "moonbell_flower", quantity: 1 }
            ],
            requiredSkills: ["smithing_advanced"],
            statModifiers: { speed: 2 },
            specialEffects: ["Fleet Footed (+10% movement speed)"],
            desc: "A cloak that enhances speed. +2 Speed. Effect: Movement bonus.",
            icon: "💨",
            price: 90,
            rarity: "uncommon"
        },

        cloak_of_shadows: {
            id: "cloak_of_shadows",
            name: "Cloak of Shadows",
            type: "accessory",
            subcategory: "Cloaks",
            shopItem: true,
            craftableItem: false,
            statModifiers: { speed: 1, accuracy: 1 },
            specialEffects: ["First Strike (First attack each battle has advantage)"],
            desc: "A cloak that blends with shadows. +1 Speed, +1 Accuracy. Effect: Battle opener advantage.",
            icon: "🌫️",
            price: 110,
            rarity: "uncommon"
        },
        silver_cloak: {
            id: "silver_cloak",
            name: "Silver Cloak",
            type: "accessory",
            subcategory: "Cloaks",
            shopItem: false,
            craftableItem: true,
            craftingCategory: "Smithing",
            craftingMaterials: [
                { id: "leather_cloak", quantity: 1 },
                { id: "silver_ingot", quantity: 1 },
                { id: "thread", quantity: 2 }
            ],
            requiredSkills: ["smithing_advanced"],
            statModifiers: { speed: 3, magic: 2 },
            specialEffects: [],
            enchantmentSlots: 0,
            desc: "A cloak with silver enchantment. +3 Speed, +2 Magic",
            icon: "🧥",
            price: 130,
            rarity: "uncommon"
        },
        crystal_cloak: {
            id: "crystal_cloak",
            name: "Crystal Cloak",
            type: "accessory",
            subcategory: "Cloaks",
            shopItem: false,
            craftableItem: true,
            craftingCategory: "Smithing",
            craftingMaterials: [
                { id: "leather_cloak", quantity: 1 },
                { id: "crystal_essence", quantity: 2 },
                { id: "magic_essence", quantity: 1 }
            ],
            requiredSkills: ["smithing_advanced"],
            statModifiers: { speed: 2, magic: 3 },
            specialEffects: [],
            enchantmentSlots: 0,
            desc: "A cloak with crystal protection. +2 Speed, +3 Magic",
            icon: "🧥",
            price: 130,
            rarity: "uncommon"
        },
        cloak_of_elements: {
            id: "cloak_of_elements",
            name: "Cloak of Elements",
            type: "accessory",
            subcategory: "Cloaks",
            shopItem: true,
            craftableItem: false,
            statModifiers: { speed: 1, magicalDefence: 1 },
            specialEffects: ["Elemental Attunement (Choose 1 element for resistance)"],
            desc: "A cloak attuned to elemental forces. +1 Speed, +1 Magical Defence. Effect: Choose resistance.",
            icon: "🌀",
            price: 100,
            rarity: "uncommon"
        },

        cloak_of_evasion: {
            id: "cloak_of_evasion",
            name: "Cloak of Evasion",
            type: "accessory",
            subcategory: "Cloaks",
            shopItem: true,
            craftableItem: false,
            statModifiers: { accuracy: 2 },
            specialEffects: ["Minor Evasion (Attacks against you have 5% chance to miss)"],
            desc: "A cloak that aids in dodging. +2 Accuracy. Effect: Miss chance.",
            icon: "👻",
            price: 125,
            rarity: "uncommon"
        },

        cape_of_the_wind: {
            id: "cape_of_the_wind",
            name: "Cape of the Wind",
            type: "accessory",
            subcategory: "Cloaks",
            shopItem: true,
            craftableItem: false,
            statModifiers: { speed: 2, accuracy: 1 },
            specialEffects: ["Phase Movement (Can move through enemies)"],
            desc: "A cape that flows like wind. +2 Speed, +1 Accuracy. Effect: Pass through enemies.",
            icon: "🌪️",
            price: 140,
            rarity: "uncommon"
        },

        // TIER 3 - Cloaks & Capes (Uncommon)
        cloak_of_invisibility: {
            id: "cloak_of_invisibility",
            name: "Cloak of Invisibility",
            type: "accessory",
            subcategory: "Cloaks",
            shopItem: true,
            craftableItem: false,
            statModifiers: { speed: 2, accuracy: 2 },
            specialEffects: ["Invisibility (Once per battle become invisible for 2 turns)"],
            desc: "A cloak that bends light. +2 Speed, +2 Accuracy. Effect: Battle invisibility.",
            icon: "👤",
            price: 225,
            rarity: "uncommon"
        },

        cloak_of_flame_walking: {
            id: "cloak_of_flame_walking",
            name: "Cloak of Flame Walking",
            type: "accessory",
            subcategory: "Cloaks",
            shopItem: true,
            craftableItem: false,
            statModifiers: { speed: 2, magicalDefence: 1 },
            specialEffects: ["Fire Immunity (Complete immunity to fire damage)"],
            elementalAffinities: { resistances: { fire: -3 } },
            desc: "A cloak wreathed in flames. +2 Speed, +1 Magical Defence. Effect: Fire immunity.",
            icon: "🔥",
            price: 250,
            rarity: "uncommon"
        },

        cloak_of_the_assassin: {
            id: "cloak_of_the_assassin",
            name: "Cloak of the Assassin",
            type: "accessory",
            subcategory: "Cloaks",
            shopItem: true,
            craftableItem: false,
            statModifiers: { accuracy: 3, speed: 1 },
            specialEffects: ["Backstab (Attacks from behind deal +1d6 damage)"],
            desc: "A cloak favored by assassins. +3 Accuracy, +1 Speed. Effect: Flanking damage.",
            icon: "🗡️",
            price: 240,
            rarity: "uncommon"
        },

        cloak_of_displacement: {
            id: "cloak_of_displacement",
            name: "Cloak of Displacement",
            type: "accessory",
            subcategory: "Cloaks",
            shopItem: true,
            craftableItem: false,
            statModifiers: { speed: 3, accuracy: 2 },
            specialEffects: ["Displacement (All attacks against you have 15% chance to miss)"],
            desc: "A cloak that distorts perception. +3 Speed, +2 Accuracy. Effect: Improved miss chance.",
            icon: "🌀",
            price: 260,
            rarity: "uncommon"
        },

        cape_of_phase_walking: {
            id: "cape_of_phase_walking",
            name: "Cape of Phase Walking",
            type: "accessory",
            subcategory: "Cloaks",
            shopItem: true,
            craftableItem: false,
            statModifiers: { speed: 2, magicalDefence: 2 },
            specialEffects: ["Phase Walk (Can move through walls once per battle)"],
            desc: "A cape that phases between dimensions. +2 Speed, +2 Magical Defence. Effect: Wall phasing.",
            icon: "🌌",
            price: 275,
            rarity: "uncommon"
        },

        // TIER 4 - Cloaks & Capes (Rare)
        cloak_of_perfect_evasion: {
            id: "cloak_of_perfect_evasion",
            name: "Cloak of Perfect Evasion",
            type: "accessory",
            subcategory: "Cloaks",
            shopItem: true,
            craftableItem: false,
            statModifiers: { speed: 4, accuracy: 3, magicalDefence: 2 },
            specialEffects: ["Perfect Evasion (All attacks against you have 25% chance to miss)"],
            desc: "A cloak of legendary evasion. +4 Speed, +3 Accuracy, +2 Magical Defence. Effect: High miss chance.",
            icon: "💫",
            price: 425,
            rarity: "rare"
        },

        cloak_of_elemental_immunity: {
            id: "cloak_of_elemental_immunity",
            name: "Cloak of Elemental Immunity",
            type: "accessory",
            subcategory: "Cloaks",
            shopItem: true,
            craftableItem: false,
            statModifiers: { speed: 3, magicalDefence: 2 },
            specialEffects: ["Dual Elemental Mastery (Choose 1 element for immunity and 1 for resistance)"],
            desc: "A cloak mastering multiple elements. +3 Speed, +2 Magical Defence. Effect: Dual elemental protection.",
            icon: "🔮",
            price: 450,
            rarity: "rare"
        },

        cloak_of_reality_shift: {
            id: "cloak_of_reality_shift",
            name: "Cloak of Reality Shift",
            type: "accessory",
            subcategory: "Cloaks",
            shopItem: true,
            craftableItem: true,
            craftingCategory: "Smithing",
            craftingMaterials: [
                { id: "cloak_of_swiftness", quantity: 1 },
                { id: "void_essence", quantity: 2 },
                { id: "crystal_sage", quantity: 3 }
            ],
            requiredSkills: ["smithing_master"],
            statModifiers: { speed: 3, accuracy: 3, magicalDefence: 2 },
            specialEffects: ["Reality Shift (Once per battle negate any effect targeting you)"],
            desc: "A cloak that bends reality itself. +3 Speed, +3 Accuracy, +2 Magical Defence. Effect: Effect negation.",
            icon: "🌟",
            price: 475,
            rarity: "rare"
        },

        // BOOTS & FOOTWEAR
        // TIER 1 - Boots & Footwear (Common)
        leather_boots: {
            id: "leather_boots",
            name: "Leather Boots",
            type: "accessory",
            subcategory: "Footwear",
            shopItem: true,
            craftableItem: true,
            craftingMaterials: ["leather", "leather_strap", "thread"],
            statModifiers: { speed: 1 },
            specialEffects: [],
            desc: "Sturdy leather boots for traveling. +1 Speed.",
            icon: "🥾",
            price: 35,
            rarity: "common"
        },
        travel_boots: {
            id: "travel_boots",
            name: "Travel Boots",
            type: "accessory",
            subcategory: "Footwear",
            shopItem: true,
            craftableItem: true,
            craftingCategory: "Smithing",
            craftingMaterials: [
                { id: "leather", quantity: 2 },
                { id: "thread", quantity: 1 },
                { id: "speed_essence", quantity: 1 }
            ],
            requiredSkills: ["smithing_basic"],
            statModifiers: {},
            specialEffects: ["Fleet Travel (+5% movement speed)"],
            desc: "Boots designed for long journeys. Effect: Movement speed bonus.",
            icon: "👢",
            price: 45,
            rarity: "common"
        },
        sturdy_boots: {
            id: "sturdy_boots",
            name: "Sturdy Boots",
            type: "accessory",
            subcategory: "Footwear",
            shopItem: true,
            craftableItem: true,
            craftingCategory: "Smithing",
            craftingMaterials: [
                { id: "thick_hide", quantity: 2 },
                { id: "iron_nails", quantity: 3 },
                { id: "mountain_essence", quantity: 1 }
            ],
            requiredSkills: ["smithing_basic"],
            statModifiers: {},
            specialEffects: ["Sure Footed (Immune to knockdown)"],
            desc: "Boots with excellent grip. Effect: Knockdown immunity.",
            icon: "🥾",
            price: 40,
            rarity: "common"
        },

        // TIER 2 - Boots & Footwear (Uncommon)
        boots_of_speed: {
            id: "boots_of_speed",
            name: "Boots of Speed",
            type: "accessory",
            subcategory: "Footwear",
            shopItem: true,
            craftableItem: true,
            craftingCategory: "Smithing",
            craftingMaterials: [
                { id: "travel_boots", quantity: 1 },
                { id: "speed_essence", quantity: 2 },
                { id: "wind_crystal", quantity: 1 }
            ],
            requiredSkills: ["smithing_advanced"],
            statModifiers: { speed: 2 },
            specialEffects: ["Enhanced Speed (+15% movement speed)"],
            desc: "Boots that enhance natural speed. +2 Speed. Effect: Movement bonus.",
            icon: "💨",
            price: 100,
            rarity: "uncommon"
        },

        boots_of_sure_footing: {
            id: "boots_of_sure_footing",
            name: "Boots of Sure Footing",
            type: "accessory",
            subcategory: "Footwear",
            shopItem: true,
            craftableItem: true,
            craftingMaterials: ["leather_boots", "iron_ingot", "mountain_essence"],
            statModifiers: { speed: 1, accuracy: 1 },
            specialEffects: ["Terrain Master (Immune to knockdown and difficult terrain)"],
            desc: "Boots that provide perfect balance. +1 Speed, +1 Accuracy. Effect: Terrain immunity.",
            icon: "⚖️",
            price: 125,
            rarity: "uncommon"
        },

        climbing_boots: {
            id: "climbing_boots",
            name: "Climbing Boots",
            type: "accessory",
            subcategory: "Footwear",
            shopItem: true,
            craftableItem: false,
            statModifiers: { speed: 1, strength: 1 },
            specialEffects: ["Spider Climb (Can climb any surface)"],
            desc: "Boots with supernatural grip. +1 Speed, +1 Strength. Effect: Wall climbing.",
            icon: "🧗",
            price: 110,
            rarity: "uncommon"
        },

        boots_of_water_walking: {
            id: "boots_of_water_walking",
            name: "Boots of Water Walking",
            type: "accessory",
            subcategory: "Footwear",
            shopItem: true,
            craftableItem: false,
            statModifiers: { speed: 1, magicalDefence: 1 },
            specialEffects: ["Liquid Walking (Can walk on water and liquids)"],
            desc: "Boots that defy liquid surfaces. +1 Speed, +1 Magical Defence. Effect: Water walking.",
            icon: "🌊",
            price: 140,
            rarity: "uncommon",
            craftableItem: true,
            craftingMaterials: ["leather_boots", "water_essence", "arcane_dust"]
        },

        boots_of_jumping: {
            id: "boots_of_jumping",
            name: "Boots of Jumping",
            type: "accessory",
            subcategory: "Footwear",
            shopItem: true,
            craftableItem: false,
            statModifiers: { speed: 2 },
            specialEffects: ["Super Jump (Can jump twice normal distance)"],
            desc: "Boots that enhance jumping ability. +2 Speed. Effect: Enhanced jumping.",
            icon: "🦘",
            price: 120,
            rarity: "uncommon"
        },

        // TIER 3 - Boots & Footwear (Uncommon)
        boots_of_haste: {
            id: "boots_of_haste",
            name: "Boots of Haste",
            type: "accessory",
            subcategory: "Footwear",
            shopItem: true,
            craftableItem: false,
            statModifiers: { speed: 3, accuracy: 1 },
            specialEffects: ["Haste (+25% movement speed, act first in combat)"],
            desc: "Boots of supernatural speed. +3 Speed, +1 Accuracy. Effect: Speed and initiative.",
            icon: "⚡",
            price: 225,
            rarity: "uncommon"
        },

        boots_of_flying: {
            id: "boots_of_flying",
            name: "Boots of Flying",
            type: "accessory",
            subcategory: "Footwear",
            shopItem: true,
            craftableItem: false,
            statModifiers: { speed: 2, magicalDefence: 1 },
            specialEffects: ["Flight (You can fly. If you end your turn mid-air without stable surface, you fall)"],
            desc: "Boots that grant the power of flight. +2 Speed, +1 Magical Defence. Effect: Flying.",
            icon: "�",
            price: 275,
            rarity: "uncommon"
        },

        boots_of_fire_walking: {
            id: "boots_of_fire_walking",
            name: "Boots of Fire Walking",
            type: "accessory",
            subcategory: "Footwear",
            shopItem: true,
            craftableItem: false,
            statModifiers: { speed: 2, physicalDefence: 1 },
            specialEffects: ["Fire Immunity (Complete immunity to fire damage)"],
            elementalAffinities: { resistances: { fire: -3 } },
            desc: "Boots that walk through flames. +2 Speed, +1 Physical Defence. Effect: Fire immunity.",
            icon: "🔥",
            price: 250,
            rarity: "uncommon"
        },

        boots_of_the_mountain: {
            id: "boots_of_the_mountain",
            name: "Boots of the Mountain",
            type: "accessory",
            subcategory: "Footwear",
            shopItem: true,
            craftableItem: false,
            statModifiers: { speed: 2, strength: 1, physicalDefence: 1 },
            specialEffects: ["Terrain Mastery (Walk through any terrain at full speed and take no damage)"],
            desc: "Boots carved from mountain stone. +2 Speed, +1 Strength, +1 Physical Defence. Effect: Terrain immunity.",
            icon: "🏔️",
            price: 260,
            rarity: "uncommon"
        },

        boots_of_teleportation: {
            id: "boots_of_teleportation",
            name: "Boots of Teleportation",
            type: "accessory",
            subcategory: "Footwear",
            shopItem: true,
            craftableItem: false,
            statModifiers: { speed: 3, accuracy: 2 },
            specialEffects: ["Short Teleport (Can teleport 15ft once per turn)"],
            desc: "Boots that bend space. +3 Speed, +2 Accuracy. Effect: Combat teleportation.",
            icon: "✨",
            price: 290,
            rarity: "uncommon"
        },

        // TIER 4 - Boots & Footwear (Rare)
        boots_of_godspeed: {
            id: "boots_of_godspeed",
            name: "Boots of Godspeed",
            type: "accessory",
            subcategory: "Footwear",
            shopItem: true,
            craftableItem: false,
            statModifiers: { speed: 4, accuracy: 3, magicalDefence: 1 },
            specialEffects: ["Godspeed (Double movement speed, always act first)"],
            desc: "Boots of divine swiftness. +4 Speed, +3 Accuracy, +1 Magical Defence. Effect: Ultimate speed.",
            icon: "🌟",
            price: 450,
            rarity: "rare"
        },

        boots_of_dimensional_step: {
            id: "boots_of_dimensional_step",
            name: "Boots of Dimensional Step",
            type: "accessory",
            subcategory: "Footwear",
            shopItem: true,
            craftableItem: false,
            statModifiers: { speed: 3, accuracy: 3, magicalDefence: 2 },
            specialEffects: ["Dimensional Step (Can teleport to any visible location once per turn)"],
            desc: "Boots that cross dimensions. +3 Speed, +3 Accuracy, +2 Magical Defence. Effect: Long-range teleport.",
            icon: "🌌",
            price: 475,
            rarity: "rare"
        },

        boots_of_universal_travel: {
            id: "boots_of_universal_travel",
            name: "Boots of Universal Travel",
            type: "accessory",
            subcategory: "Footwear",
            shopItem: true,
            craftableItem: false,
            statModifiers: { speed: 5, accuracy: 2, magicalDefence: 2 },
            specialEffects: ["Universal Travel (Can travel to any known location once per day)"],
            desc: "Boots that transcend distance. +5 Speed, +2 Accuracy, +2 Magical Defence. Effect: Dimensional travel.",
            icon: "🚀",
            price: 500,
            rarity: "rare"
        },

        // MISCELLANEOUS ACCESSORIES
        // TIER 1 - Miscellaneous (Common)
        lucky_coin: {
            id: "lucky_coin",
            name: "Lucky Coin",
            type: "accessory",
            subcategory: "Miscellaneous",
            shopItem: true,
            craftableItem: false,
            statModifiers: {},
            specialEffects: ["Lucky Break (Reroll one failed roll per battle)"],
            desc: "A coin that brings fortune. Effect: Battle reroll.",
            icon: "🪙",
            price: 60,
            rarity: "common",
            craftableItem: true,
            craftingMaterials: ["gold_ingot", "luck_essence"]
        },

        simple_compass: {
            id: "simple_compass",
            name: "Simple Compass",
            type: "accessory",
            subcategory: "Miscellaneous",
            shopItem: true,
            craftableItem: false,
            statModifiers: { accuracy: 1 },
            specialEffects: ["Navigation (Never get lost)"],
            desc: "A reliable compass for navigation. +1 Accuracy. Effect: Navigation aid.",
            icon: "🧭",
            price: 45,
            rarity: "common",
            craftableItem: true,
            craftingMaterials: ["iron_ingot", "crystal_shard"]
        },

        training_weights: {
            id: "training_weights",
            name: "Training Weights",
            type: "accessory",
            subcategory: "Miscellaneous",
            shopItem: true,
            craftableItem: false,
            statModifiers: { strength: 1, speed: -1 },
            specialEffects: [],
            desc: "Weights for strength training. +1 Strength, -1 Speed.",
            icon: "🏋️",
            price: 35,
            rarity: "common"
        },

        // TIER 2 - Miscellaneous (Uncommon)
        belt_of_endurance: {
            id: "belt_of_endurance",
            name: "Belt of Endurance",
            type: "accessory",
            subcategory: "Miscellaneous",
            shopItem: true,
            craftableItem: false,
            statModifiers: { stamina: 2 },
            specialEffects: ["Endurance (Recover 1 stamina at start of each turn)"],
            desc: "A belt that enhances endurance. +2 Stamina. Effect: Stamina regeneration.",
            icon: "🔗",
            price: 125,
            rarity: "uncommon",
            craftableItem: true,
            craftingMaterials: ["leather_strap", "vitality_essence", "iron_ingot"]
        },

        gloves_of_skill: {
            id: "gloves_of_skill",
            name: "Gloves of Skill",
            type: "accessory",
            subcategory: "Miscellaneous",
            shopItem: true,
            craftableItem: false,
            statModifiers: { accuracy: 1 },
            specialEffects: ["Skill Mastery (All skills cost 1 less stamina, minimum 1)"],
            desc: "Gloves that enhance dexterity. +1 Accuracy. Effect: Reduced skill costs.",
            icon: "🧤",
            price: 150,
            rarity: "uncommon",
            craftableItem: true,
            craftingMaterials: ["leather", "thread", "precision_essence"]
        },

        headband_of_focus: {
            id: "headband_of_focus",
            name: "Headband of Focus",
            type: "accessory",
            subcategory: "Miscellaneous",
            shopItem: true,
            craftableItem: false,
            statModifiers: { magic: 1, accuracy: 1 },
            specialEffects: ["Mental Focus (Spells have +5% critical chance)"],
            desc: "A headband that sharpens the mind. +1 Magic, +1 Accuracy. Effect: Spell crits.",
            icon: "🎯",
            price: 140,
            rarity: "uncommon"
        },

        bracers_of_defense: {
            id: "bracers_of_defense",
            name: "Bracers of Defense",
            type: "accessory",
            subcategory: "Miscellaneous",
            shopItem: true,
            craftableItem: false,
            statModifiers: { physicalDefence: 1, magicalDefence: 1 },
            specialEffects: ["Damage Reduction (Reduce all damage by 1, minimum 1)"],
            desc: "Bracers that deflect attacks. +1 Physical Defence, +1 Magical Defence. Effect: Damage reduction.",
            icon: "🛡️",
            price: 160,
            rarity: "uncommon"
        },

        wristguards_of_power: {
            id: "wristguards_of_power",
            name: "Wristguards of Power",
            type: "accessory",
            subcategory: "Miscellaneous",
            shopItem: true,
            craftableItem: false,
            statModifiers: { strength: 1, accuracy: 1 },
            specialEffects: ["Enhanced Strikes (Melee attacks deal +1 damage)"],
            desc: "Wristguards that empower attacks. +1 Strength, +1 Accuracy. Effect: Bonus melee damage.",
            icon: "💪",
            price: 130,
            rarity: "uncommon"
        },

        // TIER 3 - Miscellaneous (Uncommon)
        belt_of_giant_strength: {
            id: "belt_of_giant_strength",
            name: "Belt of Giant Strength",
            type: "accessory",
            subcategory: "Miscellaneous",
            shopItem: true,
            craftableItem: false,
            statModifiers: { strength: 2, stamina: 2, physicalDefence: 1 },
            specialEffects: [],
            desc: "A belt imbued with giant's might. +2 Strength, +2 Stamina, +1 Physical Defence.",
            icon: "⚡",
            price: 225,
            rarity: "uncommon"
        },

        gloves_of_power: {
            id: "gloves_of_power",
            name: "Gloves of Power",
            type: "accessory",
            subcategory: "Miscellaneous",
            shopItem: true,
            craftableItem: false,
            statModifiers: { strength: 2, accuracy: 1 },
            specialEffects: ["Power Strike (All attacks deal +1 damage)"],
            desc: "Gloves that enhance all strikes. +2 Strength, +1 Accuracy. Effect: Universal damage bonus.",
            icon: "👊",
            price: 250,
            rarity: "uncommon"
        },

        crown_of_intellect: {
            id: "crown_of_intellect",
            name: "Crown of Intellect",
            type: "accessory",
            subcategory: "Miscellaneous",
            shopItem: true,
            craftableItem: false,
            statModifiers: { magic: 3, magicalDefence: 2 },
            specialEffects: ["Intellectual Mastery (All spells cost 1 less stamina, minimum 1)"],
            desc: "A crown that enhances mental capacity. +3 Magic, +2 Magical Defence. Effect: Reduced spell costs.",
            icon: "👑",
            price: 275,
            rarity: "uncommon"
        },

        gauntlets_of_the_elements: {
            id: "gauntlets_of_the_elements",
            name: "Gauntlets of the Elements",
            type: "accessory",
            subcategory: "Miscellaneous",
            shopItem: true,
            craftableItem: false,
            statModifiers: { accuracy: 2, magic: 1 },
            specialEffects: ["Elemental Weapon (Choose element: attacks deal +1d4 elemental damage)"],
            desc: "Gauntlets attuned to elements. +2 Accuracy, +1 Magic. Effect: Elemental weapon damage.",
            icon: "🌪️",
            price: 240,
            rarity: "uncommon"
        },

        mask_of_stealth: {
            id: "mask_of_stealth",
            name: "Mask of Stealth",
            type: "accessory",
            subcategory: "Miscellaneous",
            shopItem: true,
            craftableItem: false,
            statModifiers: { accuracy: 2, speed: 1 },
            specialEffects: ["Stealth Mastery (Enemies have disadvantage on first attack against you each battle)"],
            desc: "A mask that conceals identity and intent. +2 Accuracy, +1 Speed. Effect: First attack protection.",
            icon: "🎭",
            price: 260,
            rarity: "uncommon"
        },

        // TIER 4 - Miscellaneous (Rare)
        belt_of_legendary_might: {
            id: "belt_of_legendary_might",
            name: "Belt of Legendary Might",
            type: "accessory",
            subcategory: "Miscellaneous",
            shopItem: true,
            craftableItem: false,
            statModifiers: { strength: 4, stamina: 3, physicalDefence: 2 },
            specialEffects: ["Legendary Strength (Deal double damage on critical hits)"],
            desc: "A belt of legendary warriors. +4 Strength, +3 Stamina, +2 Physical Defence. Effect: Crit damage.",
            icon: "⚔️",
            price: 425,
            rarity: "rare"
        },

        gloves_of_mastery: {
            id: "gloves_of_mastery",
            name: "Gloves of Mastery",
            type: "accessory",
            subcategory: "Miscellaneous",
            shopItem: true,
            craftableItem: false,
            statModifiers: { accuracy: 4, strength: 2, magic: 2 },
            specialEffects: ["Perfect Technique (All attacks and spells have +10% critical chance)"],
            desc: "Gloves of perfect technique. +4 Accuracy, +2 Strength, +2 Magic. Effect: Universal crit bonus.",
            icon: "✨",
            price: 475,
            rarity: "rare"
        },

        crown_of_universal_mastery: {
            id: "crown_of_universal_mastery",
            name: "Crown of Universal Mastery",
            type: "accessory",
            subcategory: "Miscellaneous",
            shopItem: true,
            craftableItem: false,
            statModifiers: { magic: 4, magicalDefence: 3, stamina: 2 },
            specialEffects: ["Universal Mastery (All abilities cost 1 less stamina and have +5% crit chance)"],
            desc: "A crown of absolute mastery. +4 Magic, +3 Magical Defence, +2 Stamina. Effect: Universal enchantment.",
            icon: "👑",
            price: 500,
            rarity: "rare"
        },

        // PROFESSION ITEMS - BALANCED FOR SIMPLE GAME
        // ===========================================

        // SMITHING ITEMS
        bone_club: {
            id: "bone_club",
            name: "Bone Club",
            type: "weapon",
            subcategory: "hammers",
            shopItem: true,
            craftableItem: true,
            craftingCategory: "Smithing",
            craftingMaterials: [
                { id: "crusher_molars", quantity: 2 },
                { id: "thick_hide", quantity: 1 }
            ],
            requiredSkills: ["smithing_basic"],
            damage: "1d6",
            statModifiers: { strength: 3 },
            specialEffects: ["Crushing Blow (25% chance to deal +2 damage to armored enemies)"],
            desc: "Heavy club made from dense monster bones. +3 Strength. Crushing attacks have 25% chance to deal +2 damage to armored enemies.",
            icon: "🦴",
            price: 75,
            rarity: "common"
        },

        living_stone_armor: {
            id: "living_stone_armor",
            name: "Living Stone Armor",
            type: "armor",
            subcategory: "chest",
            shopItem: true,
            craftableItem: true,
            craftingCategory: "Smithing",
            craftingMaterials: [
                { id: "living_rock_fragments", quantity: 5 },
                { id: "thick_hide", quantity: 3 },
                { id: "sharp_claws", quantity: 2 }
            ],
            requiredSkills: ["smithing_advanced"],
            statModifiers: { physicalDefence: 4, hp: 2 },
            specialEffects: ["Stone Adaptation (Reduces incoming physical damage by 1)"],
            desc: "Armor that adapts like living rock. +4 Physical Defence, +2 HP. Reduces incoming physical damage by 1.",
            icon: "🪨",
            price: 200,
            rarity: "uncommon"
        },

        razor_talon_daggers: {
            id: "razor_talon_daggers",
            name: "Razor Talon Daggers",
            type: "weapon",
            subcategory: "daggers",
            shopItem: true,
            craftableItem: true,
            craftingCategory: "Smithing",
            craftingMaterials: [
                { id: "razor_talons", quantity: 4 },
                { id: "sharp_fangs", quantity: 2 },
                { id: "metallic_fragments", quantity: 3 }
            ],
            requiredSkills: ["smithing_advanced"],
            damage: "1d6",
            statModifiers: { speed: 3, strength: 2 },
            specialEffects: ["Armor Pierce (Ignores 2 points of enemy physical defense)", "Bleeding Strike (25% chance to cause bleeding for 2 turns)"],
            desc: "Twin daggers that pierce armor. +3 Speed, +2 Strength. Ignores 2 points of enemy physical defense. 25% chance to cause bleeding for 2 turns.",
            icon: "🗡️",
            price: 180,
            rarity: "uncommon"
        },

        drake_scale_mail: {
            id: "drake_scale_mail",
            name: "Drake Scale Mail",
            type: "armor",
            subcategory: "chest",
            shopItem: true,
            craftableItem: true,
            craftingCategory: "Smithing",
            craftingMaterials: [
                { id: "chromatic_scales", quantity: 8 },
                { id: "thick_hide", quantity: 3 },
                { id: "metallic_fragments", quantity: 6 }
            ],
            requiredSkills: ["smithing_advanced"],
            statModifiers: { physicalDefence: 4, magicalDefence: 2, speed: -1 },
            specialEffects: ["Fire Resistance (50% reduction to fire damage)"],
            elementalAffinities: { resistances: { fire: -1 } },
            desc: "Armor made from chromatic scales. +4 Physical Defence, +2 Magical Defence, -1 Speed. 50% reduction to fire damage.",
            icon: "🐉",
            price: 250,
            rarity: "uncommon"
        },

        venom_blade: {
            id: "venom_blade",
            name: "Venom Blade",
            type: "weapon",
            subcategory: "swords",
            shopItem: true,
            craftableItem: true,
            craftingCategory: "Smithing",
            craftingMaterials: [
                { id: "venom_sacs", quantity: 4 },
                { id: "sharp_fangs", quantity: 6 },
                { id: "metallic_fragments", quantity: 3 }
            ],
            requiredSkills: ["smithing_advanced"],
            damage: "1d8",
            statModifiers: { strength: 3, speed: 2 },
            specialEffects: ["Poison Strike (30% chance to poison enemy for 3 turns)", "Armor Pierce (Ignores 1 point of enemy physical defense)"],
            desc: "Blade infused with poison sacs. +3 Strength, +2 Speed. 30% chance to poison enemy for 3 turns. Ignores 1 point of enemy physical defense.",
            icon: "⚔️",
            price: 220,
            rarity: "uncommon"
        },

        crystal_hammer: {
            id: "crystal_hammer",
            name: "Crystal Hammer",
            type: "weapon",
            subcategory: "hammers",
            shopItem: true,
            craftableItem: true,
            craftingCategory: "Smithing",
            craftingMaterials: [
                { id: "anti_magic_essence", quantity: 3 },
                { id: "crusher_molars", quantity: 4 },
                { id: "thick_hide", quantity: 2 }
            ],
            requiredSkills: ["smithing_advanced"],
            damage: "1d8",
            statModifiers: { strength: 4, magic: 2 },
            specialEffects: ["Stunning Blow (20% chance to stun enemy for 1 turn)", "Magic Damage (Deals additional magic damage equal to Magic Power)"],
            desc: "Heavy hammer with crystal head. +4 Strength, +2 Magic Power. 20% chance to stun enemy for 1 turn. Deals additional magic damage equal to Magic Power.",
            icon: "🔨",
            price: 280,
            rarity: "uncommon"
        },

        segmented_carapace_armor: {
            id: "segmented_carapace_armor",
            name: "Segmented Carapace Armor",
            type: "armor",
            subcategory: "chest",
            shopItem: true,
            craftableItem: true,
            craftingCategory: "Smithing",
            craftingMaterials: [
                { id: "segmented_carapace", quantity: 3 },
                { id: "metallic_fragments", quantity: 4 },
                { id: "living_rock_fragments", quantity: 3 }
            ],
            requiredSkills: ["smithing_master"],
            statModifiers: { physicalDefence: 6, hp: 3, speed: 1 },
            specialEffects: ["Critical Immunity (Cannot be critically hit)", "Flexible Defense (Reduces incoming damage by 2)"],
            desc: "Flexible armor that prevents critical hits. +6 Physical Defence, +3 HP, +1 Speed. Cannot be critically hit. Reduces incoming damage by 2.",
            icon: "🦗",
            price: 400,
            rarity: "rare"
        },

        void_steel_blade: {
            id: "void_steel_blade",
            name: "Void Steel Blade",
            type: "weapon",
            subcategory: "swords",
            shopItem: true,
            craftableItem: true,
            craftingCategory: "Smithing",
            craftingMaterials: [
                { id: "void_essence", quantity: 4 },
                { id: "metallic_fragments", quantity: 6 },
                { id: "razor_talons", quantity: 3 }
            ],
            requiredSkills: ["smithing_master"],
            damage: "1d10",
            statModifiers: { strength: 5, speed: 3, magic: 2 },
            specialEffects: ["Void Damage (Ignores all enemy defenses)", "Life Steal (Heals for 25% of damage dealt)"],
            desc: "Blade forged from void essence. +5 Strength, +3 Speed, +2 Magic Power. Ignores all enemy defenses. Heals for 25% of damage dealt.",
            icon: "⚔️",
            price: 450,
            rarity: "rare"
        },

        iron_shield: {
            id: "iron_shield",
            name: "Iron Shield",
            type: "accessory",
            subcategory: "shield",
            shopItem: true,
            craftableItem: true,
            craftingCategory: "Smithing",
            craftingMaterials: [
                { id: "iron_ingot", quantity: 2 },
                { id: "leather", quantity: 1 }
            ],
            requiredSkills: ["smithing_basic"],
            statModifiers: { physicalDefence: 2 },
            specialEffects: [],
            desc: "A basic iron shield. +2 Physical Defence.",
            icon: "🛡️",
            price: 40,
            rarity: "common"
        },
        iron_ring: {
            id: "iron_ring",
            name: "Iron Ring",
            type: "accessory",
            subcategory: "Rings",
            shopItem: true,
            craftableItem: true,
            craftingCategory: "Smithing",
            craftingMaterials: [
                { id: "iron_ingot", quantity: 1 }
            ],
            requiredSkills: ["smithing_basic"],
            statModifiers: { strength: 1 },
            specialEffects: [],
            desc: "A simple iron ring. +1 Strength.",
            icon: "💍",
            price: 20,
            rarity: "common"
        },
        iron_pendant: {
            id: "iron_pendant",
            name: "Iron Pendant",
            type: "accessory",
            subcategory: "Necklaces",
            shopItem: true,
            craftableItem: true,
            craftingCategory: "Smithing",
            craftingMaterials: [
                { id: "iron_ingot", quantity: 1 },
                { id: "thread", quantity: 1 }
            ],
            requiredSkills: ["smithing_basic"],
            statModifiers: { magicalDefence: 1 },
            specialEffects: [],
            desc: "A simple iron pendant. +1 Magical Defence.",
            icon: "📿",
            price: 25,
            rarity: "common"
        },
        leather_cloak: {
            id: "leather_cloak",
            name: "Leather Cloak",
            type: "accessory",
            subcategory: "Cloaks",
            shopItem: true,
            craftableItem: true,
            craftingCategory: "Smithing",
            craftingMaterials: [
                { id: "leather", quantity: 2 },
                { id: "thread", quantity: 1 }
            ],
            requiredSkills: ["smithing_basic"],
            statModifiers: { speed: 1, physicalDefence: 1 },
            specialEffects: [],
            desc: "A basic leather cloak. +1 Speed, +1 Physical Defence.",
            icon: "👘",
            price: 30,
            rarity: "common"
        },
        guardian_shield: {
            id: "guardian_shield",
            name: "Guardian Shield",
            type: "accessory",
            subcategory: "shield",
            shopItem: true,
            craftableItem: true,
            craftingCategory: "Smithing",
            craftingMaterials: [
                { id: "chromatic_scales", quantity: 5 },
                { id: "anti_magic_essence", quantity: 4 },
                { id: "living_rock_fragments", quantity: 3 }
            ],
            requiredSkills: ["smithing_master"],
            statModifiers: { physicalDefence: 5, magicalDefence: 3, hp: 2 },
            specialEffects: ["Damage Reflection (50% of physical damage taken is reflected to attacker)", "Magic Barrier (Tier 3 or lower magic attacks deal 0 damage)"],
            desc: "Shield that reflects attacks. +5 Physical Defence, +3 Magical Defence, +2 HP. 50% of physical damage taken is reflected to attacker. Tier 3 or lower magic attacks deal 0 damage.",
            icon: "🛡️",
            price: 380,
            rarity: "rare"
        },

        // Note: Complete accessories implementation finished
    },

    consumables: {
        // HEALTH POTIONS
        healing_salve: {
            id: "healing_salve",
            name: "Healing Salve",
            type: "consumable",
            subcategory: "Potion",
            shopItem: true,
            craftableItem: true,
            craftingCategory: "Alchemy",
            craftingMaterials: [
                { id: "regenerative_tissue", quantity: 1 },
                { id: "venom_sacs", quantity: 1 }
            ],
            requiredSkills: ["alchemy_basic"],
            effect: { type: "heal", amount: 15, duration: 0 },
            desc: "A basic healing remedy crafted from regenerative tissue and venom sacs. Restores 15 HP instantly.",
            icon: "🧪",
            price: 25,
            rarity: "common"
        },

        minor_health_potion: {
            id: "minor_health_potion",
            name: "Minor Health Potion",
            type: "consumable",
            subcategory: "Potion",
            shopItem: true,
            craftableItem: true,
            craftingCategory: "Alchemy",
            craftingMaterials: [
                { id: "red_herb", quantity: 2 },
                { id: "water", quantity: 1 }
            ],
            requiredSkills: ["alchemy_basic"],
            effect: { type: "heal", amount: 10, duration: 0 },
            desc: "A basic healing potion. Restores 10 HP instantly.",
            icon: "🧪",
            price: 25,
            rarity: "common"
        },

        health_potion: {
            id: "health_potion",
            name: "Health Potion",
            type: "consumable",
            subcategory: "Potion",
            shopItem: true,
            craftableItem: true,
            craftingCategory: "Alchemy",
            craftingMaterials: [
                { id: "red_herb", quantity: 3 },
                { id: "blue_herb", quantity: 1 },
                { id: "water", quantity: 1 }
            ],
            requiredSkills: ["alchemy_basic"],
            effect: { type: "heal", amount: 25, duration: 0 },
            desc: "A standard healing potion. Restores 25 HP instantly.",
            icon: "🧪",
            price: 50,
            rarity: "common"
        },

        greater_health_potion: {
            id: "greater_health_potion",
            name: "Greater Health Potion",
            type: "consumable",
            subcategory: "Potion",
            shopItem: true,
            craftableItem: true,
            craftingCategory: "Alchemy",
            craftingMaterials: [
                { id: "red_herb", quantity: 4 },
                { id: "blue_herb", quantity: 2 },
                { id: "crystal_shard", quantity: 1 }
            ],
            requiredSkills: ["alchemy_intermediate"],
            effect: { type: "heal", amount: 50, duration: 0 },
            desc: "A powerful healing potion. Restores 50 HP instantly.",
            icon: "🧪",
            price: 100,
            rarity: "uncommon"
        },

        // STAMINA POTIONS
        minor_stamina_potion: {
            id: "minor_stamina_potion",
            name: "Minor Stamina Potion",
            type: "consumable",
            subcategory: "Potion",
            shopItem: true,
            craftableItem: true,
            craftingCategory: "Alchemy",
            craftingMaterials: [
                { id: "yellow_herb", quantity: 2 },
                { id: "water", quantity: 1 }
            ],
            requiredSkills: ["alchemy_basic"],
            effect: { type: "stamina", amount: 10, duration: 0 },
            desc: "A basic stamina potion. Restores 10 Stamina instantly.",
            icon: "⚡",
            price: 20,
            rarity: "common"
        },

        stamina_potion: {
            id: "stamina_potion",
            name: "Stamina Potion",
            type: "consumable",
            subcategory: "Potion",
            shopItem: true,
            craftableItem: true,
            craftingCategory: "Alchemy",
            craftingMaterials: [
                { id: "yellow_herb", quantity: 3 },
                { id: "energy_gland", quantity: 1 },
                { id: "water", quantity: 1 }
            ],
            requiredSkills: ["alchemy_basic"],
            effect: { type: "stamina", amount: 25, duration: 0 },
            desc: "A standard stamina potion. Restores 25 Stamina instantly.",
            icon: "⚡",
            price: 40,
            rarity: "common"
        },

        advanced_stamina_potion: {
            id: "advanced_stamina_potion",
            name: "Advanced Stamina Potion",
            type: "consumable",
            subcategory: "Potion",
            shopItem: true,
            craftableItem: true,
            craftingCategory: "Alchemy",
            craftingMaterials: [
                { id: "energy_gland", quantity: 2 },
                { id: "thick_hide", quantity: 1 }
            ],
            requiredSkills: ["alchemy_basic"],
            effect: { type: "restore_stamina", amount: 25, duration: 0 },
            desc: "Energizing potion made from energy glands and thick hide. Restores 25 stamina instantly.",
            icon: "⚡",
            price: 30,
            rarity: "common"
        },

        // BUFF ITEMS
        strength_potion: {
            id: "strength_potion",
            name: "Strength Potion",
            type: "consumable",
            subcategory: "Potion",
            shopItem: true,
            craftableItem: true,
            craftingCategory: "Alchemy",
            craftingMaterials: [
                { id: "red_herb", quantity: 2 },
                { id: "iron_essence", quantity: 1 },
                { id: "water", quantity: 1 }
            ],
            requiredSkills: ["alchemy_intermediate"],
            effect: { type: "buff", stat: "strength", amount: 3, duration: 300 },
            desc: "A potion that temporarily increases strength. +3 Strength for 5 minutes.",
            icon: "💪",
            price: 75,
            rarity: "uncommon"
        },

        speed_potion: {
            id: "speed_potion",
            name: "Speed Potion",
            type: "consumable",
            subcategory: "Potion",
            shopItem: true,
            craftableItem: true,
            craftingCategory: "Alchemy",
            craftingMaterials: [
                { id: "yellow_herb", quantity: 2 },
                { id: "wind_essence", quantity: 1 },
                { id: "water", quantity: 1 }
            ],
            requiredSkills: ["alchemy_intermediate"],
            effect: { type: "buff", stat: "speed", amount: 3, duration: 300 },
            desc: "A potion that temporarily increases speed. +3 Speed for 5 minutes.",
            icon: "🏃",
            price: 75,
            rarity: "uncommon"
        },

        accuracy_potion: {
            id: "accuracy_potion",
            name: "Accuracy Potion",
            type: "consumable",
            subcategory: "Potion",
            shopItem: true,
            craftableItem: true,
            craftingCategory: "Alchemy",
            craftingMaterials: [
                { id: "blue_herb", quantity: 2 },
                { id: "precision_essence", quantity: 1 },
                { id: "water", quantity: 1 }
            ],
            requiredSkills: ["alchemy_intermediate"],
            effect: { type: "buff", stat: "accuracy", amount: 3, duration: 300 },
            desc: "A potion that temporarily increases accuracy. +3 Accuracy for 5 minutes.",
            icon: "🎯",
            price: 75,
            rarity: "uncommon"
        },

        // UTILITY ITEMS
        antitoxin_draught: {
            id: "antitoxin_draught",
            name: "Antitoxin Draught",
            type: "consumable",
            subcategory: "Tool",
            shopItem: true,
            craftableItem: true,
            craftingCategory: "Alchemy",
            craftingMaterials: [
                { id: "venom_sacs", quantity: 2 },
                { id: "anti_magic_essence", quantity: 1 }
            ],
            requiredSkills: ["alchemy_basic"],
            effect: { type: "cure_poison", duration: 300 },
            desc: "Neutralizes poison effects using venom sacs and anti-magic essence. Cures poison and provides immunity for 5 minutes.",
            icon: "🧪",
            price: 35,
            rarity: "common"
        },

        beast_repellent: {
            id: "beast_repellent",
            name: "Beast Repellent",
            type: "consumable",
            subcategory: "Tool",
            shopItem: true,
            craftableItem: true,
            craftingCategory: "Alchemy",
            craftingMaterials: [
                { id: "scent_glands", quantity: 3 },
                { id: "venom_sacs", quantity: 1 }
            ],
            requiredSkills: ["alchemy_basic"],
            effect: { type: "stealth_boost", duration: 600 },
            desc: "Scent-masking compound made from scent glands and venom sacs. Makes you less likely to be detected by monsters for 10 minutes.",
            icon: "🧪",
            price: 40,
            rarity: "common"
        },
        torch: {
            id: "torch",
            name: "Torch",
            type: "consumable",
            subcategory: "Tool",
            shopItem: true,
            craftableItem: true,
            craftingCategory: "Crafting",
            craftingMaterials: [
                { id: "wood", quantity: 1 },
                { id: "cloth", quantity: 1 }
            ],
            requiredSkills: ["crafting_basic"],
            effect: { type: "light", radius: 30, duration: 600 },
            desc: "A simple torch that provides light. Illuminates 30ft radius for 10 minutes.",
            icon: "🔥",
            price: 5,
            rarity: "common"
        },

        rope: {
            id: "rope",
            name: "Rope",
            type: "consumable",
            subcategory: "Tool",
            shopItem: true,
            craftableItem: true,
            craftingCategory: "Crafting",
            craftingMaterials: [
                { id: "cloth", quantity: 3 }
            ],
            requiredSkills: ["crafting_basic"],
            effect: { type: "climbing", length: 50 },
            desc: "A sturdy rope for climbing and securing. 50ft length.",
            icon: "🪢",
            price: 15,
            rarity: "common"
        },

        lockpick: {
            id: "lockpick",
            name: "Lockpick",
            type: "consumable",
            subcategory: "Tool",
            shopItem: true,
            craftableItem: true,
            craftingCategory: "Crafting",
            craftingMaterials: [
                { id: "iron_ingot", quantity: 1 }
            ],
            requiredSkills: ["crafting_basic"],
            effect: { type: "lockpicking", success_rate: 0.6 },
            desc: "A simple lockpick for opening locks. 60% success rate.",
            icon: "🔓",
            price: 20,
            rarity: "common"
        },

        // SCROLLS
        fireball_scroll: {
            id: "fireball_scroll",
            name: "Fireball Scroll",
            type: "consumable",
            subcategory: "Scroll",
            shopItem: true,
            craftableItem: true,
            craftingCategory: "Enchanting",
            craftingMaterials: [
                { id: "paper", quantity: 1 },
                { id: "fire_essence", quantity: 2 },
                { id: "ink", quantity: 1 }
            ],
            requiredSkills: ["enchanting_basic"],
            effect: { type: "spell", spell: "fireball", damage: "3d6", range: 60 },
            desc: "A scroll containing the Fireball spell. Casts 3d6 fire damage at 60ft range.",
            icon: "📜",
            price: 80,
            rarity: "uncommon"
        },

        heal_scroll: {
            id: "heal_scroll",
            name: "Heal Scroll",
            type: "consumable",
            subcategory: "Scroll",
            shopItem: true,
            craftableItem: true,
            craftingCategory: "Enchanting",
            craftingMaterials: [
                { id: "paper", quantity: 1 },
                { id: "healing_essence", quantity: 2 },
                { id: "ink", quantity: 1 }
            ],
            requiredSkills: ["enchanting_basic"],
            effect: { type: "spell", spell: "heal", healing: "2d8", range: 30 },
            desc: "A scroll containing the Heal spell. Restores 2d8 HP to target within 30ft.",
            icon: "📜",
            price: 60,
            rarity: "uncommon"
        },

        // ADDITIONAL ENCHANTING SCROLLS
        lightning_bolt_scroll: {
            id: "lightning_bolt_scroll",
            name: "Lightning Bolt Scroll",
            type: "consumable",
            subcategory: "Scroll",
            shopItem: true,
            craftableItem: true,
            craftingCategory: "Enchanting",
            craftingMaterials: [
                { id: "paper", quantity: 1 },
                { id: "lightning_essence", quantity: 2 },
                { id: "ink", quantity: 1 }
            ],
            requiredSkills: ["enchanting_basic"],
            effect: { type: "spell", spell: "lightning_bolt", damage: "2d8", range: 60 },
            desc: "A scroll containing the Lightning Bolt spell. Casts 2d8 lightning damage at 60ft range.",
            icon: "📜",
            price: 70,
            rarity: "uncommon"
        },

        ice_shield_scroll: {
            id: "ice_shield_scroll",
            name: "Ice Shield Scroll",
            type: "consumable",
            subcategory: "Scroll",
            shopItem: true,
            craftableItem: true,
            craftingCategory: "Enchanting",
            craftingMaterials: [
                { id: "paper", quantity: 1 },
                { id: "ice_essence", quantity: 2 },
                { id: "ink", quantity: 1 }
            ],
            requiredSkills: ["enchanting_basic"],
            effect: { type: "spell", spell: "ice_shield", defense: 10, duration: 300 },
            desc: "A scroll containing the Ice Shield spell. Provides 10 defense for 5 minutes.",
            icon: "📜",
            price: 80,
            rarity: "uncommon"
        },

        teleport_scroll: {
            id: "teleport_scroll",
            name: "Teleport Scroll",
            type: "consumable",
            subcategory: "Scroll",
            shopItem: true,
            craftableItem: true,
            craftingCategory: "Enchanting",
            craftingMaterials: [
                { id: "paper", quantity: 1 },
                { id: "void_essence", quantity: 1 },
                { id: "ink", quantity: 1 }
            ],
            requiredSkills: ["enchanting_intermediate"],
            effect: { type: "spell", spell: "teleport" },
            desc: "A scroll containing the Teleport spell. Teleports you and allies to a safe location.",
            icon: "📜",
            price: 1000,
            rarity: "rare"
        },

        resurrection_scroll: {
            id: "resurrection_scroll",
            name: "Resurrection Scroll",
            type: "consumable",
            subcategory: "Scroll",
            shopItem: true,
            craftableItem: true,
            craftingCategory: "Enchanting",
            craftingMaterials: [
                { id: "paper", quantity: 1 },
                { id: "phoenix_feather", quantity: 1 },
                { id: "healing_essence", quantity: 3 },
                { id: "ink", quantity: 1 }
            ],
            requiredSkills: ["enchanting_advanced"],
            effect: { type: "spell", spell: "resurrection", target: "ally" },
            desc: "A scroll containing the Resurrection spell. Revives a fallen ally with 50% HP.",
            icon: "📜",
            price: 300,
            rarity: "epic"
        },

        meteor_storm_scroll: {
            id: "meteor_storm_scroll",
            name: "Meteor Storm Scroll",
            type: "consumable",
            subcategory: "Scroll",
            shopItem: true,
            craftableItem: true,
            craftingCategory: "Enchanting",
            craftingMaterials: [
                { id: "paper", quantity: 1 },
                { id: "fire_essence", quantity: 3 },
                { id: "magic_essence", quantity: 2 },
                { id: "ink", quantity: 1 }
            ],
            requiredSkills: ["enchanting_advanced"],
            effect: { type: "spell", spell: "meteor_storm", damage: "8d6", range: 120, area: "large" },
            desc: "A scroll containing the devastating Meteor Storm spell. Calls down fiery meteors dealing 8d6 damage in a large area.",
            icon: "📜",
            price: 800,
            rarity: "epic"
        },

        invisibility_scroll: {
            id: "invisibility_scroll",
            name: "Invisibility Scroll",
            type: "consumable",
            subcategory: "Scroll",
            shopItem: true,
            craftableItem: true,
            craftingCategory: "Enchanting",
            craftingMaterials: [
                { id: "paper", quantity: 1 },
                { id: "shadow_essence", quantity: 2 },
                { id: "ink", quantity: 1 }
            ],
            requiredSkills: ["enchanting_intermediate"],
            effect: { type: "spell", spell: "invisibility", duration: 300 },
            desc: "A scroll containing the Invisibility spell. Makes you invisible for 5 minutes.",
            icon: "📜",
            price: 150,
            rarity: "rare"
        },

        haste_scroll: {
            id: "haste_scroll",
            name: "Haste Scroll",
            type: "consumable",
            subcategory: "Scroll",
            shopItem: true,
            craftableItem: true,
            craftingCategory: "Enchanting",
            craftingMaterials: [
                { id: "paper", quantity: 1 },
                { id: "wind_essence", quantity: 2 },
                { id: "ink", quantity: 1 }
            ],
            requiredSkills: ["enchanting_basic"],
            effect: { type: "spell", spell: "haste", speed: 3, duration: 300 },
            desc: "A scroll containing the Haste spell. +3 Speed for 5 minutes.",
            icon: "📜",
            price: 90,
            rarity: "uncommon"
        },

        protection_scroll: {
            id: "protection_scroll",
            name: "Protection Scroll",
            type: "consumable",
            subcategory: "Scroll",
            shopItem: true,
            craftableItem: true,
            craftingCategory: "Enchanting",
            craftingMaterials: [
                { id: "paper", quantity: 1 },
                { id: "earth_essence", quantity: 2 },
                { id: "ink", quantity: 1 }
            ],
            requiredSkills: ["enchanting_basic"],
            effect: { type: "spell", spell: "protection", defense: 5, duration: 600 },
            desc: "A scroll containing the Protection spell. +5 defense for 10 minutes.",
            icon: "📜",
            price: 85,
            rarity: "uncommon"
        },

        dispel_magic_scroll: {
            id: "dispel_magic_scroll",
            name: "Dispel Magic Scroll",
            type: "consumable",
            subcategory: "Scroll",
            shopItem: true,
            craftableItem: true,
            craftingCategory: "Enchanting",
            craftingMaterials: [
                { id: "paper", quantity: 1 },
                { id: "anti_magic_essence", quantity: 2 },
                { id: "ink", quantity: 1 }
            ],
            requiredSkills: ["enchanting_intermediate"],
            effect: { type: "spell", spell: "dispel_magic", target: "enemy" },
            desc: "A scroll containing the Dispel Magic spell. Removes magical effects from target.",
            icon: "📜",
            price: 110,
            rarity: "rare"
        },

        summon_familiar_scroll: {
            id: "summon_familiar_scroll",
            name: "Summon Familiar Scroll",
            type: "consumable",
            subcategory: "Scroll",
            shopItem: true,
            craftableItem: true,
            craftingCategory: "Enchanting",
            craftingMaterials: [
                { id: "paper", quantity: 1 },
                { id: "magic_essence", quantity: 3 },
                { id: "ink", quantity: 1 }
            ],
            requiredSkills: ["enchanting_advanced"],
            effect: { type: "spell", spell: "summon_familiar", duration: 1800 },
            desc: "A scroll containing the Summon Familiar spell. Summons a magical familiar for 30 minutes.",
            icon: "📜",
            price: 200,
            rarity: "rare"
        },

        // BASIC FOOD ITEMS
        apple: {
            id: "apple",
            name: "Apple",
            type: "consumable",
            subcategory: "Food",
            shopItem: true,
            craftableItem: false,
            craftingCategory: "Alchemy",
            craftingMaterials: [
                { id: "apple_seed", quantity: 1 },
                { id: "water", quantity: 1 }
            ],
            requiredSkills: ["alchemy_basic"],
            effect: { type: "restore", hitPoints: 3, stamina: 2 },
            desc: "A fresh apple. Restores 3 HP and 2 Stamina.",
            icon: "🍎",
            price: 2,
            rarity: "common"
        },

        bread: {
            id: "bread",
            name: "Bread",
            type: "consumable",
            subcategory: "Food",
            shopItem: true,
            craftableItem: true,
            craftingCategory: "Alchemy",
            craftingMaterials: [
                { id: "flour", quantity: 2 },
                { id: "water", quantity: 1 }
            ],
            requiredSkills: ["alchemy_basic"],
            effect: { type: "restore", hitPoints: 8, stamina: 5 },
            desc: "Fresh baked bread. Restores 8 HP and 5 Stamina.",
            icon: "🍞",
            price: 5,
            rarity: "common"
        },

        cheese: {
            id: "cheese",
            name: "Cheese",
            type: "consumable",
            subcategory: "Food",
            shopItem: true,
            craftableItem: false,
            craftingCategory: "Alchemy",
            craftingMaterials: [
                { id: "milk", quantity: 2 },
                { id: "salt", quantity: 1 }
            ],
            requiredSkills: ["alchemy_basic"],
            effect: { type: "restore", hitPoints: 5, stamina: 3 },
            desc: "A wedge of cheese. Restores 5 HP and 3 Stamina.",
            icon: "🧀",
            price: 4,
            rarity: "common"
        },

        meat_stew: {
            id: "meat_stew",
            name: "Meat Stew",
            type: "consumable",
            subcategory: "Food",
            shopItem: true,
            craftableItem: true,
            craftingCategory: "Alchemy",
            craftingMaterials: [
                { id: "meat", quantity: 1 },
                { id: "vegetables", quantity: 2 },
                { id: "water", quantity: 1 }
            ],
            requiredSkills: ["alchemy_intermediate"],
            effect: { type: "restore", hitPoints: 20, stamina: 12 },
            desc: "A hearty meat stew. Restores 20 HP and 12 Stamina.",
            icon: "🍖",
            price: 15,
            rarity: "common"
        },

        royal_feast: {
            id: "royal_feast",
            name: "Royal Feast",
            type: "consumable",
            subcategory: "Food",
            shopItem: true,
            craftableItem: true,
            craftingCategory: "Alchemy",
            craftingMaterials: [
                { id: "meat", quantity: 2 },
                { id: "vegetables", quantity: 3 },
                { id: "herbs", quantity: 2 },
                { id: "wine", quantity: 1 }
            ],
            requiredSkills: ["alchemy_advanced"],
            effect: { type: "restore", hitPoints: 35, stamina: 20, lumen: 8 },
            desc: "A luxurious feast fit for royalty. Restores 35 HP, 20 Stamina, and grants 8 Lumen.",
            icon: "🍽️",
            price: 50,
            rarity: "rare"
        },

        // ADDITIONAL ALCHEMY ITEMS
        invisibility_potion: {
            id: "invisibility_potion",
            name: "Invisibility Potion",
            type: "consumable",
            subcategory: "Potion",
            shopItem: true,
            craftableItem: true,
            craftingCategory: "Alchemy",
            craftingMaterials: [
                { id: "shadow_essence", quantity: 2 },
                { id: "water", quantity: 1 },
                { id: "blue_herb", quantity: 1 }
            ],
            requiredSkills: ["alchemy_intermediate"],
            effect: { type: "buff", stat: "stealth", amount: 5, duration: 300 },
            desc: "A potion that makes you nearly invisible. +5 Stealth for 5 minutes.",
            icon: "👻",
            price: 120,
            rarity: "uncommon"
        },

        fire_resistance_potion: {
            id: "fire_resistance_potion",
            name: "Fire Resistance Potion",
            type: "consumable",
            subcategory: "Potion",
            shopItem: true,
            craftableItem: true,
            craftingCategory: "Alchemy",
            craftingMaterials: [
                { id: "fire_essence", quantity: 1 },
                { id: "ice_essence", quantity: 2 },
                { id: "water", quantity: 1 }
            ],
            requiredSkills: ["alchemy_intermediate"],
            effect: { type: "resistance", element: "fire", amount: 50, duration: 600 },
            desc: "A potion that provides fire resistance. 50% fire damage reduction for 10 minutes.",
            icon: "🔥",
            price: 100,
            rarity: "uncommon"
        },

        poison_potion: {
            id: "poison_potion",
            name: "Poison Potion",
            type: "consumable",
            subcategory: "Potion",
            shopItem: true,
            craftableItem: true,
            craftingCategory: "Alchemy",
            craftingMaterials: [
                { id: "venom_sacs", quantity: 2 },
                { id: "poison_essence", quantity: 1 },
                { id: "water", quantity: 1 }
            ],
            requiredSkills: ["alchemy_basic"],
            effect: { type: "weapon_coat", effect: "poison", damage: "1d4", duration: 300 },
            desc: "A potion to coat weapons with poison. Adds 1d4 poison damage for 5 minutes.",
            icon: "☠️",
            price: 80,
            rarity: "uncommon"
        },

        regeneration_potion: {
            id: "regeneration_potion",
            name: "Regeneration Potion",
            type: "consumable",
            subcategory: "Potion",
            shopItem: true,
            craftableItem: true,
            craftingCategory: "Alchemy",
            craftingMaterials: [
                { id: "regenerative_tissue", quantity: 2 },
                { id: "healing_essence", quantity: 1 },
                { id: "water", quantity: 1 }
            ],
            requiredSkills: ["alchemy_advanced"],
            effect: { type: "regeneration", amount: 5, duration: 600 },
            desc: "A potion that continuously heals you. Restores 5 HP every 30 seconds for 10 minutes.",
            icon: "💚",
            price: 150,
            rarity: "rare"
        },

        mana_potion: {
            id: "mana_potion",
            name: "Mana Potion",
            type: "consumable",
            subcategory: "Potion",
            shopItem: true,
            craftableItem: true,
            craftingCategory: "Alchemy",
            craftingMaterials: [
                { id: "magic_essence", quantity: 2 },
                { id: "blue_herb", quantity: 2 },
                { id: "water", quantity: 1 }
            ],
            requiredSkills: ["alchemy_intermediate"],
            effect: { type: "grant", lumen: 10 },
            desc: "A potion that restores magical energy. Grants 10 Lumen.",
            icon: "🔮",
            price: 90,
            rarity: "uncommon"
        },

        ice_resistance_potion: {
            id: "ice_resistance_potion",
            name: "Ice Resistance Potion",
            type: "consumable",
            subcategory: "Potion",
            shopItem: true,
            craftableItem: true,
            craftingCategory: "Alchemy",
            craftingMaterials: [
                { id: "ice_essence", quantity: 2 },
                { id: "fire_essence", quantity: 1 },
                { id: "water", quantity: 1 }
            ],
            requiredSkills: ["alchemy_intermediate"],
            effect: { type: "resistance", element: "ice", amount: 50, duration: 600 },
            desc: "A potion that provides ice resistance. 50% ice damage reduction for 10 minutes.",
            icon: "❄️",
            price: 100,
            rarity: "uncommon"
        },

        lightning_resistance_potion: {
            id: "lightning_resistance_potion",
            name: "Lightning Resistance Potion",
            type: "consumable",
            subcategory: "Potion",
            shopItem: true,
            craftableItem: true,
            craftingCategory: "Alchemy",
            craftingMaterials: [
                { id: "lightning_essence", quantity: 1 },
                { id: "earth_essence", quantity: 2 },
                { id: "water", quantity: 1 }
            ],
            requiredSkills: ["alchemy_intermediate"],
            effect: { type: "resistance", element: "lightning", amount: 50, duration: 600 },
            desc: "A potion that provides lightning resistance. 50% lightning damage reduction for 10 minutes.",
            icon: "⚡",
            price: 100,
            rarity: "uncommon"
        },

        antidote_potion: {
            id: "antidote_potion",
            name: "Antidote Potion",
            type: "consumable",
            subcategory: "Potion",
            shopItem: true,
            craftableItem: true,
            craftingCategory: "Alchemy",
            craftingMaterials: [
                { id: "healing_essence", quantity: 1 },
                { id: "blue_herb", quantity: 2 },
                { id: "water", quantity: 1 }
            ],
            requiredSkills: ["alchemy_basic"],
            effect: { type: "cure", condition: "poison" },
            desc: "A potion that cures poison effects.",
            icon: "💊",
            price: 60,
            rarity: "common"
        },

        cure_disease_potion: {
            id: "cure_disease_potion",
            name: "Cure Disease Potion",
            type: "consumable",
            subcategory: "Potion",
            shopItem: true,
            craftableItem: true,
            craftingCategory: "Alchemy",
            craftingMaterials: [
                { id: "healing_essence", quantity: 2 },
                { id: "red_herb", quantity: 1 },
                { id: "water", quantity: 1 }
            ],
            requiredSkills: ["alchemy_intermediate"],
            effect: { type: "cure", condition: "disease" },
            desc: "A potion that cures disease effects.",
            icon: "💊",
            price: 80,
            rarity: "uncommon"
        },

        night_vision_potion: {
            id: "night_vision_potion",
            name: "Night Vision Potion",
            type: "consumable",
            subcategory: "Potion",
            shopItem: true,
            craftableItem: true,
            craftingCategory: "Alchemy",
            craftingMaterials: [
                { id: "shadow_essence", quantity: 1 },
                { id: "blue_herb", quantity: 1 },
                { id: "water", quantity: 1 }
            ],
            requiredSkills: ["alchemy_basic"],
            effect: { type: "buff", stat: "vision", amount: 1, duration: 1800 },
            desc: "A potion that allows you to see in darkness. +1 Vision for 30 minutes.",
            icon: "👁️",
            price: 70,
            rarity: "uncommon"
        },

        water_breathing_potion: {
            id: "water_breathing_potion",
            name: "Water Breathing Potion",
            type: "consumable",
            subcategory: "Potion",
            shopItem: true,
            craftableItem: true,
            craftingCategory: "Alchemy",
            craftingMaterials: [
                { id: "water_essence", quantity: 2 },
                { id: "blue_herb", quantity: 1 },
                { id: "water", quantity: 1 }
            ],
            requiredSkills: ["alchemy_intermediate"],
            effect: { type: "buff", stat: "water_breathing", duration: 600 },
            desc: "A potion that allows you to breathe underwater for 10 minutes.",
            icon: "🌊",
            price: 85,
            rarity: "uncommon"
        },

        feather_fall_potion: {
            id: "feather_fall_potion",
            name: "Feather Fall Potion",
            type: "consumable",
            subcategory: "Potion",
            shopItem: true,
            craftableItem: true,
            craftingCategory: "Alchemy",
            craftingMaterials: [
                { id: "wind_essence", quantity: 2 },
                { id: "yellow_herb", quantity: 1 },
                { id: "water", quantity: 1 }
            ],
            requiredSkills: ["alchemy_basic"],
            effect: { type: "buff", stat: "feather_fall", duration: 300 },
            desc: "A potion that makes you fall slowly like a feather for 5 minutes.",
            icon: "🍃",
            price: 65,
            rarity: "uncommon"
        },

        // ADDITIONAL MEALS - Non-craftable but buyable
        grilled_salmon: {
            id: "grilled_salmon",
            name: "Grilled Salmon",
            type: "consumable",
            subcategory: "Food",
            shopItem: true,
            craftableItem: false,
            effect: { type: "restore", hitPoints: 25, stamina: 15, lumens: 8 },
            desc: "Fresh grilled salmon with herbs. Restores 25 HP, 15 Stamina, and +8 Lumens.",
            icon: "🐟",
            price: 105,
            rarity: "uncommon"
        },

        mushroom_risotto: {
            id: "mushroom_risotto",
            name: "Mushroom Risotto",
            type: "consumable",
            subcategory: "Food",
            shopItem: true,
            craftableItem: false,
            effect: { type: "restore", hitPoints: 18, stamina: 20, lumens: 6 },
            desc: "Creamy risotto with wild mushrooms. Restores 18 HP, 20 Stamina, and +6 Lumens.",
            icon: "🍄",
            price: 84,
            rarity: "uncommon"
        },

        honey_roasted_chicken: {
            id: "honey_roasted_chicken",
            name: "Honey Roasted Chicken",
            type: "consumable",
            subcategory: "Food",
            shopItem: true,
            craftableItem: false,
            effect: { type: "restore", hitPoints: 30, stamina: 18, lumens: 10 },
            desc: "Tender chicken roasted with honey glaze. Restores 30 HP, 18 Stamina, and +10 Lumens.",
            icon: "🍗",
            price: 126,
            rarity: "uncommon"
        },

        vegetable_curry: {
            id: "vegetable_curry",
            name: "Vegetable Curry",
            type: "consumable",
            subcategory: "Food",
            shopItem: true,
            craftableItem: false,
            effect: { type: "restore", hitPoints: 22, stamina: 25, lumens: 7 },
            desc: "Spicy vegetable curry with rice. Restores 22 HP, 25 Stamina, and +7 Lumens.",
            icon: "🍛",
            price: 96,
            rarity: "uncommon"
        },

        chocolate_cake: {
            id: "chocolate_cake",
            name: "Chocolate Cake",
            type: "consumable",
            subcategory: "Food",
            shopItem: true,
            craftableItem: false,
            effect: { type: "restore", hitPoints: 15, stamina: 30, lumens: 5 },
            desc: "Rich chocolate cake with frosting. Restores 15 HP, 30 Stamina, and +5 Lumens.",
            icon: "🍰",
            price: 75,
            rarity: "common"
        }
    },

    materials: {
        // Basic crafting materials
        leather_grip: {
            id: "leather_grip",
            name: "Leather Grip",
            type: "material",
            subcategory: "Leather & hide",
            shopItem: false,
            craftableItem: false,
            monsterItem: true,
            desc: "A leather grip for weapon handles",
            icon: "🟫",
            price: 5,
            rarity: "common"
        },
        wooden_handle: {
            id: "wooden_handle",
            name: "Wooden Handle",
            type: "material",
            subcategory: "Crafting supplies",
            shopItem: true,
            craftableItem: false,
            desc: "A wooden handle for tools and weapons",
            icon: "🪵",
            price: 3,
            rarity: "common"
        },
        chain_links: {
            id: "chain_links",
            name: "Chain Links",
            type: "material",
            subcategory: "Crafting supplies",
            shopItem: true,
            craftableItem: false,
            desc: "Metal chain links for armor",
            icon: "⛓️",
            price: 8,
            rarity: "common"
        },
        iron_plate: {
            id: "iron_plate",
            name: "Iron Plate",
            type: "material",
            subcategory: "Crafting supplies",
            shopItem: true,
            craftableItem: false,
            desc: "A flat iron plate for armor",
            icon: "🛡️",
            price: 12,
            rarity: "common"
        },
        leather_strap: {
            id: "leather_strap",
            name: "Leather Strap",
            type: "material",
            subcategory: "Leather & hide",
            shopItem: false,
            craftableItem: false,
            monsterItem: true,
            desc: "A leather strap for securing armor",
            icon: "🟫",
            price: 4,
            rarity: "common"
        },
        reinforcement_studs: {
            id: "reinforcement_studs",
            name: "Reinforcement Studs",
            type: "material",
            subcategory: "Crafting supplies",
            shopItem: true,
            craftableItem: false,
            desc: "Metal studs for reinforcing armor",
            icon: "🔩",
            price: 6,
            rarity: "common"
        },
        sharpening_essence: {
            id: "sharpening_essence",
            name: "Sharpening Essence",
            type: "material",
            subcategory: "Essences",
            shopItem: false,
            craftableItem: false,
            monsterItem: true,
            desc: "Magical essence for sharpening weapons",
            icon: "✨",
            price: 15,
            rarity: "uncommon"
        },
        sharpening_stone: {
            id: "sharpening_stone",
            name: "Sharpening Stone",
            type: "material",
            subcategory: "Crafting supplies",
            shopItem: true,
            craftableItem: false,
            desc: "A stone for sharpening weapons",
            icon: "🪨",
            price: 8,
            rarity: "common"
        },
        defense_essence: {
            id: "defense_essence",
            name: "Defense Essence",
            type: "material",
            subcategory: "Essences",
            shopItem: false,
            craftableItem: false,
            monsterItem: true,
            desc: "Magical essence for enhancing defense",
            icon: "🛡️",
            price: 15,
            rarity: "uncommon"
        },
        rune_paper: {
            id: "rune_paper",
            name: "Rune Paper",
            type: "material",
            subcategory: "Magical components",
            shopItem: false,
            craftableItem: false,
            monsterItem: true,
            desc: "Special paper for writing enchantments",
            icon: "📜",
            price: 10,
            rarity: "common"
        },
        polish: {
            id: "polish",
            name: "Polish",
            type: "material",
            subcategory: "Crafting supplies",
            shopItem: true,
            craftableItem: false,
            desc: "Polish for maintaining equipment",
            icon: "🧽",
            price: 5,
            rarity: "common"
        },
        oil: {
            id: "oil",
            name: "Oil",
            type: "material",
            subcategory: "Crafting supplies",
            shopItem: true,
            craftableItem: false,
            desc: "Oil for weapon maintenance",
            icon: "🛢️",
            price: 8,
            rarity: "common"
        },
        stone: {
            id: "stone",
            name: "Stone",
            type: "material",
            subcategory: "Crafting supplies",
            shopItem: true,
            craftableItem: false,
            desc: "Basic stone for crafting",
            icon: "🪨",
            price: 2,
            rarity: "common"
        },
        lightning_essence: {
            id: "lightning_essence",
            name: "Lightning Essence",
            type: "material",
            subcategory: "Essences",
            shopItem: false,
            craftableItem: false,
            monsterItem: true,
            desc: "Essence of lightning for enchantments",
            icon: "⚡",
            price: 25,
            rarity: "uncommon"
        },
        earth_essence: {
            id: "earth_essence",
            name: "Earth Essence",
            type: "material",
            subcategory: "Essences",
            shopItem: false,
            craftableItem: false,
            monsterItem: true,
            desc: "Essence of earth for enchantments",
            icon: "🌍",
            price: 20,
            rarity: "uncommon"
        },
        wind_essence: {
            id: "wind_essence",
            name: "Wind Essence",
            type: "material",
            subcategory: "Essences",
            shopItem: false,
            craftableItem: false,
            monsterItem: true,
            desc: "Essence of wind for enchantments",
            icon: "💨",
            price: 20,
            rarity: "uncommon"
        },
        water_essence: {
            id: "water_essence",
            name: "Water Essence",
            type: "material",
            subcategory: "Essences",
            shopItem: false,
            craftableItem: false,
            monsterItem: true,
            desc: "Essence of water for enchantments",
            icon: "💧",
            price: 20,
            rarity: "uncommon"
        },
        magic_essence: {
            id: "magic_essence",
            name: "Magic Essence",
            type: "material",
            subcategory: "Essences",
            shopItem: false,
            craftableItem: false,
            monsterItem: true,
            desc: "Pure magical essence for enchantments",
            icon: "✨",
            price: 30,
            rarity: "uncommon"
        },
        fire_essence: {
            id: "fire_essence",
            name: "Fire Essence",
            type: "material",
            subcategory: "Essences",
            shopItem: false,
            craftableItem: false,
            desc: "Essence of fire for enchantments",
            icon: "🔥",
            price: 25,
            rarity: "uncommon"
        },
        shadow_essence: {
            id: "shadow_essence",
            name: "Shadow Essence",
            type: "material",
            subcategory: "Essences",
            shopItem: false,
            craftableItem: false,
            monsterItem: true,
            desc: "Essence of shadows for enchantments",
            icon: "🌑",
            price: 25,
            rarity: "uncommon"
        },
        poison_essence: {
            id: "poison_essence",
            name: "Poison Essence",
            type: "material",
            subcategory: "Essences",
            shopItem: false,
            craftableItem: false,
            monsterItem: true,
            desc: "Essence of poison for enchantments",
            icon: "☠️",
            price: 25,
            rarity: "uncommon"
        },
        crystal_essence: {
            id: "crystal_essence",
            name: "Crystal Essence",
            type: "material",
            subcategory: "Essences",
            shopItem: false,
            craftableItem: false,
            monsterItem: true,
            desc: "Essence of crystal for enchantments",
            icon: "💎",
            price: 30,
            rarity: "uncommon"
        },
        mithril_ingot: {
            id: "mithril_ingot",
            name: "Mithril Ingot",
            type: "material",
            subcategory: "Metal ingots",
            shopItem: false,
            craftableItem: false,
            monsterItem: true,
            desc: "A rare mithril ingot for crafting",
            icon: "⚔️",
            price: 50,
            rarity: "rare"
        },
        herbs: {
            id: "herbs",
            name: "Herbs",
            type: "material",
            subcategory: "Alchemy",
            shopItem: true,
            craftableItem: false,
            desc: "Medicinal herbs for alchemy",
            icon: "🌿",
            price: 3,
            rarity: "common"
        },
        water: {
            id: "water",
            name: "Water",
            type: "material",
            subcategory: "Alchemy",
            shopItem: true,
            craftableItem: false,
            desc: "Pure water for alchemy",
            icon: "💧",
            price: 1,
            rarity: "common"
        },
        basic_fabric: {
            id: "basic_fabric",
            name: "Basic Fabric",
            type: "material",
            subcategory: "Crafting supplies",
            shopItem: true,
            craftableItem: false,
            desc: "Basic fabric for clothing and armor",
            icon: "🧵",
            price: 3,
            rarity: "common"
        },
        thread: {
            id: "thread",
            name: "Thread",
            type: "material",
            subcategory: "Crafting supplies",
            shopItem: true,
            craftableItem: false,
            desc: "Thread for sewing and crafting",
            icon: "🧵",
            price: 2,
            rarity: "common"
        },
        iron_nails: {
            id: "iron_nails",
            name: "Iron Nails",
            type: "material",
            subcategory: "Crafting supplies",
            shopItem: true,
            craftableItem: false,
            desc: "Iron nails for construction and armor",
            icon: "🔩",
            price: 4,
            rarity: "common"
        },
        arcane_dust: {
            id: "arcane_dust",
            name: "Arcane Dust",
            type: "material",
            subcategory: "Magical components",
            shopItem: false,
            craftableItem: false,
            monsterItem: true,
            desc: "Magical dust for enchantments",
            icon: "✨",
            price: 20,
            rarity: "uncommon"
        },
        scale_fragment: {
            id: "scale_fragment",
            name: "Scale Fragment",
            type: "material",
            subcategory: "Magical components",
            shopItem: false,
            craftableItem: false,
            monsterItem: true,
            desc: "Fragment of dragon or monster scales",
            icon: "🐉",
            price: 15,
            rarity: "uncommon"
        },
        copper_ingot: {
            id: "copper_ingot",
            name: "Copper Ingot",
            type: "material",
            subcategory: "Metal ingots",
            shopItem: true,
            craftableItem: false,
            desc: "Copper ingot for basic crafting",
            icon: "🔶",
            price: 5,
            rarity: "common"
        },
        iron_ingot: {
            id: "iron_ingot",
            name: "Iron Ingot",
            type: "material",
            subcategory: "Metal ingots",
            shopItem: true,
            craftableItem: false,
            desc: "Iron ingot for weapon and armor crafting",
            icon: "🔶",
            price: 8,
            rarity: "common"
        },
        steel_ingot: {
            id: "steel_ingot",
            name: "Steel Ingot",
            type: "material",
            subcategory: "Metal ingots",
            shopItem: false,
            craftableItem: false,
            monsterItem: true,
            desc: "Steel ingot for advanced crafting",
            icon: "🔶",
            price: 15,
            rarity: "uncommon"
        },
        silver_ingot: {
            id: "silver_ingot",
            name: "Silver Ingot",
            type: "material",
            subcategory: "Metal ingots",
            shopItem: false,
            craftableItem: false,
            monsterItem: true,
            desc: "Silver ingot for magical crafting",
            icon: "🔶",
            price: 25,
            rarity: "uncommon"
        },
        gold_ingot: {
            id: "gold_ingot",
            name: "Gold Ingot",
            type: "material",
            subcategory: "Metal ingots",
            shopItem: false,
            craftableItem: false,
            monsterItem: true,
            desc: "Gold ingot for master crafting",
            icon: "🔶",
            price: 50,
            rarity: "rare"
        },
        leather: {
            id: "leather",
            name: "Leather",
            type: "material",
            subcategory: "Leather & hide",
            shopItem: true,
            craftableItem: false,
            desc: "Basic leather for armor crafting",
            icon: "🟫",
            price: 4,
            rarity: "common"
        },
        thick_hide: {
            id: "thick_hide",
            name: "Thick Hide",
            type: "material",
            subcategory: "Leather & hide",
            shopItem: false,
            craftableItem: false,
            monsterItem: true,
            desc: "Thick hide for reinforced armor",
            icon: "🟫",
            price: 8,
            rarity: "common"
        },
        living_rock_fragments: {
            id: "living_rock_fragments",
            name: "Living Rock Fragments",
            type: "material",
            subcategory: "Magical components",
            shopItem: false,
            craftableItem: false,
            monsterItem: true,
            desc: "Magical rock fragments for special crafting",
            icon: "🪨",
            price: 20,
            rarity: "uncommon"
        },
        crusher_molars: {
            id: "crusher_molars",
            name: "Crusher Molars",
            type: "material",
            subcategory: "Magical components",
            shopItem: false,
            craftableItem: false,
            monsterItem: true,
            desc: "Tough teeth for bone crafting",
            icon: "🦷",
            price: 12,
            rarity: "uncommon"
        },
        training_bow: {
            id: "training_bow",
            name: "Training Bow",
            type: "material",
            subcategory: "Weapon parts",
            shopItem: false,
            craftableItem: false,
            monsterItem: true,
            desc: "Basic training bow for crafting",
            icon: "🏹",
            price: 10,
            rarity: "common"
        },
        hunter_bow: {
            id: "hunter_bow",
            name: "Hunter Bow",
            type: "material",
            subcategory: "Weapon parts",
            shopItem: false,
            craftableItem: false,
            monsterItem: true,
            desc: "Hunter's bow for advanced crafting",
            icon: "🏹",
            price: 20,
            rarity: "uncommon"
        },
        ironbark_moss: {
            id: "ironbark_moss",
            name: "Ironbark Moss",
            type: "material",
            subcategory: "Alchemy",
            shopItem: false,
            craftableItem: false,
            monsterItem: true,
            desc: "Magical moss for staff crafting",
            icon: "🌿",
            price: 15,
            rarity: "uncommon"
        },
        apprentice_staff: {
            id: "apprentice_staff",
            name: "Apprentice Staff",
            type: "material",
            subcategory: "Weapon parts",
            shopItem: false,
            craftableItem: false,
            monsterItem: true,
            desc: "Basic staff for advanced crafting",
            icon: "🦯",
            price: 12,
            rarity: "common"
        },
        journeyman_staff: {
            id: "journeyman_staff",
            name: "Journeyman Staff",
            type: "material",
            subcategory: "Weapon parts",
            shopItem: false,
            craftableItem: false,
            monsterItem: true,
            desc: "Journeyman staff for expert crafting",
            icon: "🦯",
            price: 25,
            rarity: "uncommon"
        },
        spear: {
            id: "spear",
            name: "Spear",
            type: "material",
            subcategory: "Weapon parts",
            shopItem: false,
            craftableItem: false,
            monsterItem: true,
            desc: "Basic spear for polearm crafting",
            icon: "🔱",
            price: 8,
            rarity: "common"
        },
        iron_spear: {
            id: "iron_spear",
            name: "Iron Spear",
            type: "material",
            subcategory: "Weapon parts",
            shopItem: false,
            craftableItem: false,
            monsterItem: true,
            desc: "Iron spear for advanced polearm crafting",
            icon: "🔱",
            price: 15,
            rarity: "uncommon"
        },
        leather_boots: {
            id: "leather_boots",
            name: "Leather Boots",
            type: "material",
            subcategory: "Leather & hide",
            shopItem: false,
            craftableItem: false,
            monsterItem: true,
            desc: "Basic leather boots for crafting",
            icon: "👢",
            price: 6,
            rarity: "common"
        },
        mountain_essence: {
            id: "mountain_essence",
            name: "Mountain Essence",
            type: "material",
            subcategory: "Essences",
            shopItem: false,
            craftableItem: false,
            monsterItem: true,
            desc: "Essence of mountain strength",
            icon: "🏔️",
            price: 30,
            rarity: "rare"
        },
        luck_essence: {
            id: "luck_essence",
            name: "Luck Essence",
            type: "material",
            subcategory: "Essences",
            shopItem: false,
            craftableItem: false,
            monsterItem: true,
            desc: "Essence of good fortune",
            icon: "🍀",
            price: 40,
            rarity: "rare"
        },
        crystal_shard: {
            id: "crystal_shard",
            name: "Crystal Shard",
            type: "material",
            subcategory: "Magical components",
            shopItem: false,
            craftableItem: false,
            monsterItem: true,
            desc: "Magical crystal shard for crafting",
            icon: "💎",
            price: 35,
            rarity: "rare"
        },
        vitality_essence: {
            id: "vitality_essence",
            name: "Vitality Essence",
            type: "material",
            subcategory: "Essences",
            shopItem: false,
            craftableItem: false,
            monsterItem: true,
            desc: "Essence of life and vitality",
            icon: "❤️",
            price: 25,
            rarity: "uncommon"
        },
        fire_essence: {
            id: "fire_essence",
            name: "Fire Essence",
            type: "material",
            subcategory: "Essences",
            shopItem: false,
            craftableItem: false,
            monsterItem: true,
            desc: "Essence of fire for magical crafting",
            icon: "🔥",
            price: 30,
            rarity: "uncommon"
        },

        // Monster Loot Items
        metallic_fragments: {
            id: "metallic_fragments",
            name: "Metallic Fragments",
            type: "material",
            subcategory: "Magical components",
            shopItem: false,
            craftableItem: false,
            monsterItem: true,
            desc: "Metal-infused organic material with natural armor properties",
            icon: "⚙️",
            price: 50,
            rarity: "rare"
        },
        anti_magic_essence: {
            id: "anti_magic_essence",
            name: "Anti-Magic Essence",
            type: "material",
            subcategory: "Essences",
            shopItem: false,
            craftableItem: false,
            monsterItem: true,
            desc: "A crystalline substance that repels magical energy",
            icon: "🔮",
            price: 40,
            rarity: "uncommon"
        },
        segmented_carapace: {
            id: "segmented_carapace",
            name: "Segmented Carapace",
            type: "material",
            subcategory: "Magical components",
            shopItem: false,
            craftableItem: false,
            monsterItem: true,
            desc: "Flexible yet strong armored plates that deflect critical strikes",
            icon: "🦀",
            price: 60,
            rarity: "rare"
        },
        regenerative_tissue: {
            id: "regenerative_tissue",
            name: "Regenerative Tissue",
            type: "material",
            subcategory: "Organic",
            shopItem: false,
            craftableItem: false,
            monsterItem: true,
            desc: "Living tissue that continues to heal even after removal",
            icon: "💚",
            price: 100,
            rarity: "epic"
        },
        phoenix_cells: {
            id: "phoenix_cells",
            name: "Phoenix Cells",
            type: "material",
            subcategory: "Organic",
            shopItem: false,
            craftableItem: false,
            monsterItem: true,
            desc: "Miraculous cells that can rapidly regenerate any wound",
            icon: "✨",
            price: 200,
            rarity: "legendary"
        },
        sharp_claws: {
            id: "sharp_claws",
            name: "Sharp Claws",
            type: "material",
            subcategory: "Weapon parts",
            shopItem: false,
            craftableItem: false,
            monsterItem: true,
            desc: "Natural claws that retain their sharpness. Useful for crafting weapons",
            icon: "🦅",
            price: 15,
            rarity: "common"
        },
        razor_talons: {
            id: "razor_talons",
            name: "Razor Talons",
            type: "material",
            subcategory: "Weapon parts",
            shopItem: false,
            craftableItem: false,
            monsterItem: true,
            desc: "Incredibly sharp claws that cause bleeding wounds",
            icon: "🩸",
            price: 30,
            rarity: "uncommon"
        },
        venom_sacs: {
            id: "venom_sacs",
            name: "Venom Sacs",
            type: "material",
            subcategory: "Organic",
            shopItem: false,
            craftableItem: false,
            monsterItem: true,
            desc: "Poison glands that can be harvested for toxin extraction",
            icon: "🟢",
            price: 45,
            rarity: "rare"
        },
        sharp_fangs: {
            id: "sharp_fangs",
            name: "Sharp Fangs",
            type: "material",
            subcategory: "Weapon parts",
            shopItem: false,
            craftableItem: false,
            monsterItem: true,
            desc: "Pointed teeth perfect for piercing attacks",
            icon: "🦷",
            price: 12,
            rarity: "common"
        },
        flexible_tail_section: {
            id: "flexible_tail_section",
            name: "Flexible Tail Section",
            type: "material",
            subcategory: "Weapon parts",
            shopItem: false,
            craftableItem: false,
            monsterItem: true,
            desc: "A section of powerful tail muscle for crafting whips",
            icon: "🦎",
            price: 18,
            rarity: "common"
        },
        tail_spikes: {
            id: "tail_spikes",
            name: "Tail Spikes",
            type: "material",
            subcategory: "Weapon parts",
            shopItem: false,
            craftableItem: false,
            monsterItem: true,
            desc: "Sharp spikes from a creature's tail, perfect for projectiles",
            icon: "🦂",
            price: 25,
            rarity: "uncommon"
        },
        combat_coordination_gland: {
            id: "combat_coordination_gland",
            name: "Combat Coordination Gland",
            type: "material",
            subcategory: "Organic",
            shopItem: false,
            craftableItem: false,
            monsterItem: true,
            desc: "A rare gland that enhances reflexes and attack coordination",
            icon: "⚔️",
            price: 80,
            rarity: "epic"
        },
        flame_gland: {
            id: "flame_gland",
            name: "Flame Gland",
            type: "material",
            subcategory: "Organic",
            shopItem: false,
            craftableItem: false,
            monsterItem: true,
            desc: "Internal organ that produces intense fire. Contains fire essence",
            icon: "🔥",
            price: 50,
            rarity: "rare"
        },
        frost_core: {
            id: "frost_core",
            name: "Frost Core",
            type: "material",
            subcategory: "Organic",
            shopItem: false,
            craftableItem: false,
            monsterItem: true,
            desc: "A crystalline organ that generates freezing temperatures",
            icon: "❄️",
            price: 50,
            rarity: "rare"
        },
        toxic_lung_tissue: {
            id: "toxic_lung_tissue",
            name: "Toxic Lung Tissue",
            type: "material",
            subcategory: "Organic",
            shopItem: false,
            craftableItem: false,
            monsterItem: true,
            desc: "Poisonous respiratory tissue that creates deadly toxins",
            icon: "☠️",
            price: 50,
            rarity: "rare"
        },
        storm_chamber: {
            id: "storm_chamber",
            name: "Storm Chamber",
            type: "material",
            subcategory: "Organic",
            shopItem: false,
            craftableItem: false,
            monsterItem: true,
            desc: "Bio-electric organ that generates lightning strikes",
            icon: "⚡",
            price: 50,
            rarity: "rare"
        },
        acid_bladder: {
            id: "acid_bladder",
            name: "Acid Bladder",
            type: "material",
            subcategory: "Organic",
            shopItem: false,
            craftableItem: false,
            monsterItem: true,
            desc: "Corrosive organ that produces powerful acid",
            icon: "🟢",
            price: 35,
            rarity: "uncommon"
        },
        terror_essence: {
            id: "terror_essence",
            name: "Terror Essence",
            type: "material",
            subcategory: "Essences",
            shopItem: false,
            craftableItem: false,
            monsterItem: true,
            desc: "Concentrated fear that radiates from the creature's presence",
            icon: "😨",
            price: 45,
            rarity: "rare"
        },
        petrifying_eye: {
            id: "petrifying_eye",
            name: "Petrifying Eye",
            type: "material",
            subcategory: "Organic",
            shopItem: false,
            craftableItem: false,
            monsterItem: true,
            desc: "An eye that retains its paralyzing power even after death",
            icon: "👁️",
            price: 120,
            rarity: "epic"
        },
        phase_membrane: {
            id: "phase_membrane",
            name: "Phase Membrane",
            type: "material",
            subcategory: "Magical components",
            shopItem: false,
            craftableItem: false,
            monsterItem: true,
            desc: "Translucent tissue that can bend light around itself",
            icon: "👻",
            price: 150,
            rarity: "epic"
        },
        dimensional_node: {
            id: "dimensional_node",
            name: "Dimensional Node",
            type: "material",
            subcategory: "Organic",
            shopItem: false,
            craftableItem: false,
            monsterItem: true,
            desc: "A small organ that can tear holes in space-time",
            icon: "✨",
            price: 180,
            rarity: "epic"
        },
        aerial_membrane: {
            id: "aerial_membrane",
            name: "Aerial Membrane",
            type: "material",
            subcategory: "Magical components",
            shopItem: false,
            craftableItem: false,
            monsterItem: true,
            desc: "Lightweight wing membrane that defies gravity",
            icon: "🦅",
            price: 250,
            rarity: "legendary"
        },
        earth_shaper_claws: {
            id: "earth_shaper_claws",
            name: "Earth Shaper Claws",
            type: "material",
            subcategory: "Weapon parts",
            shopItem: false,
            craftableItem: false,
            monsterItem: true,
            desc: "Specialized claws designed for digging through solid rock",
            icon: "🕳️",
            price: 35,
            rarity: "uncommon"
        },
        adhesive_pads: {
            id: "adhesive_pads",
            name: "Adhesive Pads",
            type: "material",
            subcategory: "Magical components",
            shopItem: false,
            craftableItem: false,
            monsterItem: true,
            desc: "Natural climbing pads that stick to any surface",
            icon: "🧗",
            price: 20,
            rarity: "common"
        },
        gill_slits: {
            id: "gill_slits",
            name: "Gill Slits",
            type: "material",
            subcategory: "Organic",
            shopItem: false,
            craftableItem: false,
            monsterItem: true,
            desc: "Functional gills that allow underwater breathing",
            icon: "🏊",
            price: 30,
            rarity: "uncommon"
        },
        sonar_organ: {
            id: "sonar_organ",
            name: "Sonar Organ",
            type: "material",
            subcategory: "Organic",
            shopItem: false,
            craftableItem: false,
            monsterItem: true,
            desc: "Bio-acoustic organ for echolocation abilities",
            icon: "🦇",
            price: 55,
            rarity: "rare"
        },
        chromatic_scales: {
            id: "chromatic_scales",
            name: "Chromatic Scales",
            type: "material",
            subcategory: "Magical components",
            shopItem: false,
            craftableItem: false,
            monsterItem: true,
            desc: "Color-changing scales that blend with surroundings",
            icon: "🦎",
            price: 40,
            rarity: "uncommon"
        },
        alpha_pheromones: {
            id: "alpha_pheromones",
            name: "Alpha Pheromones",
            type: "material",
            subcategory: "Essences",
            shopItem: false,
            craftableItem: false,
            monsterItem: true,
            desc: "Chemical signals that command respect from lesser creatures",
            icon: "🐺",
            price: 60,
            rarity: "rare"
        },
        scent_glands: {
            id: "scent_glands",
            name: "Scent Glands",
            type: "material",
            subcategory: "Organic",
            shopItem: false,
            craftableItem: false,
            monsterItem: true,
            desc: "Glands that produce natural scent-masking compounds",
            icon: "👃",
            price: 15,
            rarity: "common"
        },
        giant_essence: {
            id: "giant_essence",
            name: "Giant Essence",
            type: "material",
            subcategory: "Essences",
            shopItem: false,
            craftableItem: false,
            monsterItem: true,
            desc: "Concentrated essence of giant strength and power",
            icon: "🏔️",
            price: 90,
            rarity: "epic"
        },
        storm_organ: {
            id: "storm_organ",
            name: "Storm Organ",
            type: "material",
            subcategory: "Organic",
            shopItem: false,
            craftableItem: false,
            monsterItem: true,
            desc: "Bio-electric organ that generates storm energy",
            icon: "🌩️",
            price: 65,
            rarity: "rare"
        },
        growth_hormone_gland: {
            id: "growth_hormone_gland",
            name: "Growth Hormone Gland",
            type: "material",
            subcategory: "Organic",
            shopItem: false,
            craftableItem: false,
            monsterItem: true,
            desc: "Gland that controls dramatic size changes",
            icon: "📏",
            price: 140,
            rarity: "epic"
        },
        ethereal_essence: {
            id: "ethereal_essence",
            name: "Ethereal Essence",
            type: "material",
            subcategory: "Essences",
            shopItem: false,
            craftableItem: false,
            monsterItem: true,
            desc: "Pure spirit energy that exists between dimensions",
            icon: "👻",
            price: 300,
            rarity: "legendary"
        },
        memory_crystal: {
            id: "memory_crystal",
            name: "Memory Crystal",
            type: "material",
            subcategory: "Magical components",
            shopItem: false,
            craftableItem: false,
            monsterItem: true,
            desc: "Crystallized knowledge from an ancient mind",
            icon: "📚",
            price: 400,
            rarity: "legendary"
        },
        nature_essence: {
            id: "nature_essence",
            name: "Nature Essence",
            type: "material",
            subcategory: "Essences",
            shopItem: false,
            craftableItem: false,
            monsterItem: true,
            desc: "Pure essence of natural life force, useful for herbalism",
            icon: "🌱",
            price: 35,
            rarity: "uncommon"
        },
        elemental_heart: {
            id: "elemental_heart",
            name: "Elemental Heart",
            type: "material",
            subcategory: "Organic",
            shopItem: false,
            craftableItem: false,
            monsterItem: true,
            desc: "The core of an elemental being, pulsing with pure elemental energy",
            icon: "💓",
            price: 200,
            rarity: "epic"
        },
        void_essence: {
            id: "void_essence",
            name: "Void Essence",
            type: "material",
            subcategory: "Essences",
            shopItem: false,
            craftableItem: false,
            monsterItem: true,
            desc: "Dark essence from the space between dimensions",
            icon: "🌌",
            price: 160,
            rarity: "epic"
        },
        time_crystal: {
            id: "time_crystal",
            name: "Time Crystal",
            type: "material",
            subcategory: "Magical components",
            shopItem: false,
            craftableItem: false,
            monsterItem: true,
            desc: "A crystal that exists outside normal time flow",
            icon: "⏰",
            price: 500,
            rarity: "legendary"
        },

        // Discoverable Items
        wild_mint: {
            id: "wild_mint",
            name: "Wild Mint",
            type: "material",
            subcategory: "Herbs",
            shopItem: true,
            craftableItem: false,
            discoverableItem: true,
            desc: "Fresh mint leaves with a cooling effect. Used in alchemy and cooking",
            icon: "🌱",
            price: 5,
            rarity: "common"
        },
        moonbell_flower: {
            id: "moonbell_flower",
            name: "Moonbell Flower",
            type: "material",
            subcategory: "Herbs",
            shopItem: false,
            craftableItem: false,
            discoverableItem: true,
            desc: "A rare flower that blooms only under moonlight. Highly magical",
            icon: "🌙",
            price: 20,
            rarity: "uncommon"
        },
        crystal_sage: {
            id: "crystal_sage",
            name: "Crystal Sage",
            type: "material",
            subcategory: "Herbs",
            shopItem: false,
            craftableItem: false,
            discoverableItem: true,
            desc: "Sage infused with crystal energy. Enhances mental clarity",
            icon: "💎",
            price: 50,
            rarity: "rare"
        },
        phoenix_petal: {
            id: "phoenix_petal",
            name: "Phoenix Petal",
            type: "material",
            subcategory: "Herbs",
            shopItem: false,
            craftableItem: false,
            discoverableItem: true,
            desc: "A petal from the legendary Phoenix Flower. Grants rebirth properties",
            icon: "🌺",
            price: 100,
            rarity: "epic"
        },
        cave_salt: {
            id: "cave_salt",
            name: "Cave Salt",
            type: "material",
            subcategory: "Seasonings",
            shopItem: true,
            craftableItem: false,
            discoverableItem: true,
            desc: "Pure salt crystals from deep caves. Preserves and flavors food",
            icon: "🧂",
            price: 10,
            rarity: "common"
        },
        fire_spice: {
            id: "fire_spice",
            name: "Fire Spice",
            type: "material",
            subcategory: "Seasonings",
            shopItem: false,
            craftableItem: false,
            discoverableItem: true,
            desc: "Spicy seasoning that warms the body and soul",
            icon: "🌶️",
            price: 10,
            rarity: "uncommon"
        },
        honey_crystal: {
            id: "honey_crystal",
            name: "Honey Crystal",
            type: "material",
            subcategory: "Sweeteners",
            shopItem: false,
            craftableItem: false,
            discoverableItem: true,
            desc: "Crystallized honey from giant bees. Sweet and energizing",
            icon: "🍯",
            price: 20,
            rarity: "uncommon"
        },
        aged_wine: {
            id: "aged_wine",
            name: "Aged Wine",
            type: "material",
            subcategory: "Liquids",
            shopItem: false,
            craftableItem: false,
            discoverableItem: true,
            desc: "Fine wine aged in mystical barrels. Enhances magical properties",
            icon: "🍷",
            price: 80,
            rarity: "rare"
        },
        ancient_parchment: {
            id: "ancient_parchment",
            name: "Ancient Parchment",
            type: "material",
            subcategory: "Scrolls",
            shopItem: false,
            craftableItem: false,
            discoverableItem: true,
            desc: "Old parchment with faded writings. Contains forgotten knowledge",
            icon: "📜",
            price: 30,
            rarity: "uncommon"
        },
        runic_stone: {
            id: "runic_stone",
            name: "Runic Stone",
            type: "material",
            subcategory: "Runes",
            shopItem: false,
            craftableItem: false,
            discoverableItem: true,
            desc: "Stone carved with ancient runes. Holds magical power",
            icon: "🗿",
            price: 100,
            rarity: "rare"
        },
        timeworn_gear: {
            id: "timeworn_gear",
            name: "Timeworn Gear",
            type: "material",
            subcategory: "Mechanisms",
            shopItem: false,
            craftableItem: false,
            discoverableItem: true,
            desc: "Ancient mechanical component. Still functional after centuries",
            icon: "⚙️",
            price: 100,
            rarity: "rare"
        },
        soul_fragment: {
            id: "soul_fragment",
            name: "Soul Fragment",
            type: "material",
            subcategory: "Essences",
            shopItem: false,
            craftableItem: false,
            discoverableItem: true,
            desc: "Fragment of an ancient soul. Dangerous but powerful",
            icon: "👻",
            price: 200,
            rarity: "epic"
        },

        // Discoverable Consumables
        pain_relief_leaf: {
            id: "pain_relief_leaf",
            name: "Pain Relief Leaf",
            type: "consumable",
            subcategory: "Herbs",
            shopItem: true,
            craftableItem: false,
            discoverableItem: true,
            desc: "Natural painkiller. Restores 15 HP instantly",
            icon: "🍃",
            price: 25,
            rarity: "common"
        },
        energy_berry: {
            id: "energy_berry",
            name: "Energy Berry",
            type: "consumable",
            subcategory: "Food",
            shopItem: true,
            craftableItem: false,
            discoverableItem: true,
            effect: { type: "restore", stamina: 5 },
            desc: "A small wild berry. Restores 5 Stamina.",
            icon: "🫐",
            price: 1,
            rarity: "common"
        },
        mana_mushroom: {
            id: "mana_mushroom",
            name: "Mana Mushroom",
            type: "consumable",
            subcategory: "Food",
            shopItem: false,
            craftableItem: true,
            craftingCategory: "Alchemy",
            craftingMaterials: [
                { id: "magic_essence", quantity: 1 },
                { id: "mushroom", quantity: 2 },
                { id: "water", quantity: 1 }
            ],
            requiredSkills: ["alchemy_basic"],
            discoverableItem: true,
            effect: { type: "grant", lumen: 3 },
            desc: "A magical mushroom. Grants 3 Lumen.",
            icon: "🟣",
            price: 8,
            rarity: "uncommon"
        },
        warrior_root: {
            id: "warrior_root",
            name: "Warrior's Root",
            type: "consumable",
            subcategory: "Food",
            shopItem: false,
            craftableItem: false,
            discoverableItem: true,
            effect: { type: "restore", hitPoints: 8, stamina: 3 },
            desc: "A tough, nutritious root. Restores 8 HP and 3 Stamina.",
            icon: "🥕",
            price: 3,
            rarity: "common"
        },
        scholar_tea: {
            id: "scholar_tea",
            name: "Scholar's Tea",
            type: "consumable",
            subcategory: "Food",
            shopItem: false,
            craftableItem: true,
            craftingCategory: "Alchemy",
            craftingMaterials: [
                { id: "herbs", quantity: 2 },
                { id: "magic_essence", quantity: 1 },
                { id: "water", quantity: 1 }
            ],
            requiredSkills: ["alchemy_intermediate"],
            discoverableItem: true,
            effect: { type: "restore", stamina: 5, lumen: 2 },
            desc: "A calming herbal tea. Restores 5 Stamina and grants 2 Lumen.",
            icon: "🍵",
            price: 12,
            rarity: "uncommon"
        },
        trail_rations: {
            id: "trail_rations",
            name: "Trail Rations",
            type: "consumable",
            subcategory: "Food",
            shopItem: true,
            craftableItem: false,
            discoverableItem: true,
            effect: { type: "restore", hitPoints: 15, stamina: 10 },
            desc: "Basic preserved food. Restores 15 HP and 10 Stamina.",
            icon: "🥨",
            price: 8,
            rarity: "common"
        },
        elven_bread: {
            id: "elven_bread",
            name: "Elven Bread",
            type: "consumable",
            subcategory: "Food",
            shopItem: false,
            craftableItem: false,
            discoverableItem: true,
            effect: { type: "restore", hitPoints: 25, stamina: 15, lumen: 5 },
            desc: "Magical bread that sustains for days. Restores 25 HP, 15 Stamina, and grants 5 Lumen.",
            icon: "🍞",
            price: 45,
            rarity: "rare"
        },
        dwarven_ale: {
            id: "dwarven_ale",
            name: "Dwarven Ale",
            type: "consumable",
            subcategory: "Food",
            shopItem: false,
            craftableItem: false,
            discoverableItem: true,
            effect: { type: "restore", stamina: 12, lumen: 3 },
            desc: "Strong ale that warms the soul. Restores 12 Stamina and grants 3 Lumen.",
            icon: "🍺",
            price: 18,
            rarity: "uncommon"
        },

        // Discoverable Artifacts & Tools
        explorers_compass: {
            id: "explorers_compass",
            name: "Explorer's Compass",
            type: "tool",
            subcategory: "Tool",
            shopItem: false,
            craftableItem: false,
            discoverableItem: true,
            desc: "Ancient compass that always points to treasure. +20% chance to find rare items",
            icon: "🧭",
            price: 150,
            rarity: "uncommon"
        },
        scholars_monocle: {
            id: "scholars_monocle",
            name: "Scholar's Monocle",
            type: "tool",
            subcategory: "Tool",
            shopItem: false,
            craftableItem: false,
            discoverableItem: true,
            desc: "Magical monocle that reveals hidden knowledge. +15% experience from archaeology",
            icon: "🔍",
            price: 100,
            rarity: "rare"
        },
        time_worn_key: {
            id: "time_worn_key",
            name: "Time-Worn Key",
            type: "key",
            subcategory: "Tool",
            shopItem: false,
            craftableItem: false,
            discoverableItem: true,
            desc: "Ancient key that opens forgotten doors. Required for some ruins",
            icon: "🗝️",
            price: 200,
            rarity: "rare"
        },
        crystal_orb: {
            id: "crystal_orb",
            name: "Crystal Orb",
            type: "artifact",
            subcategory: "Tool",
            shopItem: false,
            craftableItem: false,
            discoverableItem: true,
            desc: "Mystical orb that reveals the location of nearby secrets",
            icon: "🔮",
            price: 300,
            rarity: "epic"
        },
        golden_idol: {
            id: "golden_idol",
            name: "Golden Idol",
            type: "relic",
            subcategory: "Tool",
            shopItem: false,
            craftableItem: false,
            discoverableItem: true,
            desc: "Priceless golden statue from a lost civilization. Extremely valuable",
            icon: "🏺",
            price: 1000,
            rarity: "epic"
        },
        royal_seal: {
            id: "royal_seal",
            name: "Royal Seal",
            type: "relic",
            subcategory: "Tool",
            shopItem: false,
            craftableItem: false,
            discoverableItem: true,
            desc: "Seal of an ancient king. Proves royal lineage and grants respect",
            icon: "👑",
            price: 2500,
            rarity: "legendary"
        },

        // Quest Items
        dragons_tear: {
            id: "dragons_tear",
            name: "Dragon's Tear",
            type: "quest_item",
            subcategory: "Tool",
            shopItem: false,
            craftableItem: false,
            discoverableItem: true,
            desc: "Crystallized tear of an ancient dragon. Said to grant incredible power",
            icon: "💧",
            price: 10000,
            rarity: "legendary"
        },
        phoenix_feather: {
            id: "phoenix_feather",
            name: "Phoenix Feather",
            type: "quest_item",
            subcategory: "Tool",
            shopItem: false,
            craftableItem: false,
            discoverableItem: true,
            desc: "Feather from the immortal phoenix. Radiates warmth and hope",
            icon: "🪶",
            price: 5000,
            rarity: "legendary"
        },
        void_shard: {
            id: "void_shard",
            name: "Void Shard",
            type: "quest_item",
            subcategory: "Tool",
            shopItem: false,
            craftableItem: false,
            discoverableItem: true,
            desc: "Fragment of pure nothingness. Handle with extreme caution",
            icon: "◼️",
            price: 7500,
            rarity: "legendary"
        }
    }
}

// Cache for performance optimization
let _allItemsCache = null
let _itemsByIdCache = new Map()
let _itemsByTypeCache = new Map()
let _itemsByRarityCache = new Map()

// Clear cache when needed
function clearItemCache() {
    _allItemsCache = null
    _itemsByIdCache.clear()
    _itemsByTypeCache.clear()
    _itemsByRarityCache.clear()
}

// Get all items as a flat array (cached)
function getAllItems() {
    if (_allItemsCache === null) {
        _allItemsCache = []
        Object.values(ITEMS_DATA).forEach(category => {
            Object.values(category).forEach(item => {
                _allItemsCache.push(item)
            })
        })
    }
    return _allItemsCache
}

// Find item by ID (optimized with caching)
function findItemById(itemId) {
    // Check cache first
    if (_itemsByIdCache.has(itemId)) {
        return _itemsByIdCache.get(itemId)
    }

    // Check regular items first
    for (const category of Object.values(ITEMS_DATA)) {
        for (const item of Object.values(category)) {
            if (item.id === itemId) {
                _itemsByIdCache.set(itemId, item)
                return item
            }
        }
    }

    // Check discoverable items
    if (window.DISCOVERABLE_ITEMS_DATA) {
        for (const discoverableItem of Object.values(window.DISCOVERABLE_ITEMS_DATA)) {
            if (discoverableItem.id === itemId) {
                _itemsByIdCache.set(itemId, discoverableItem)
                return discoverableItem
            }
        }
    }

    // Check monster loot data
    if (window.MONSTER_LOOT_DATA) {
        for (const lootItem of Object.values(window.MONSTER_LOOT_DATA)) {
            if (lootItem.id === itemId) {
                _itemsByIdCache.set(itemId, lootItem)
                return lootItem
            }
        }
    }

    console.warn(`Item not found: ${itemId}`)
    _itemsByIdCache.set(itemId, null)
    return null
}

// Get items by type (cached)
function getItemsByType(type) {
    if (_itemsByTypeCache.has(type)) {
        return _itemsByTypeCache.get(type)
    }

    const items = getAllItems().filter(item => item.type === type)
    _itemsByTypeCache.set(type, items)
    return items
}

// Get items by rarity (cached)
function getItemsByRarity(rarity) {
    if (_itemsByRarityCache.has(rarity)) {
        return _itemsByRarityCache.get(rarity)
    }

    const items = getAllItems().filter(item => item.rarity === rarity)
    _itemsByRarityCache.set(rarity, items)
    return items
}

// Make globally available for browser environment
window.ITEMS_DATA = ITEMS_DATA
window.getAllItems = getAllItems
window.findItemById = findItemById
window.getItemsByType = getItemsByType
window.getItemsByRarity = getItemsByRarity
window.clearItemCache = clearItemCache

// Clear cache on load to ensure new materials, subcategories, shop changes, and monster items are available
clearItemCache()


