// Discoverable Items Data - Items that can be found, bought, or given by NPCs
// These items don't require crafting but can be used as materials or consumed directly

const DISCOVERABLE_ITEMS_DATA = {
    // === RAW MATERIALS & INGREDIENTS ===
    materials: {
        // Basic Herbs - Can be found in nature or bought from herbalists
        wild_mint: {
            id: "wild_mint",
            name: "Wild Mint",
            type: "ingredient",
            category: "herb",
            icon: "🌱",
            desc: "Fresh mint leaves with a cooling effect. Used in alchemy and cooking.",
            rarity: "common",
            value: { copper: 5 },
            source: ["forage", "shop"],
            uses: ["alchemy", "cooking"],
            stackable: true,
            maxStack: 50
        },

        tree_bark: {
            id: "tree_bark",
            name: "Tree Bark",
            type: "ingredient",
            category: "herb",
            icon: "🪵",
            desc: "Sturdy bark stripped from woodland trees. Used in herbal poultices and camp craft.",
            rarity: "common",
            value: { copper: 3 },
            source: ["forage", "shop"],
            uses: ["herbalism", "cooking"],
            stackable: true,
            maxStack: 50
        },

        moonbell_flower: {
            id: "moonbell_flower",
            name: "Moonbell Flower",
            type: "ingredient",
            category: "herb",
            icon: "🌙",
            desc: "A rare flower that blooms only under moonlight. Highly magical.",
            rarity: "uncommon",
            value: { silver: 2 },
            source: ["forage_night", "quest"],
            uses: ["alchemy", "enchanting"],
            stackable: true,
            maxStack: 20
        },

        ironbark_moss: {
            id: "ironbark_moss",
            name: "Ironbark Moss",
            type: "ingredient",
            category: "herb",
            icon: "🍄",
            desc: "Tough moss that grows on ancient trees. Strengthens the body.",
            rarity: "uncommon",
            value: { silver: 1, copper: 50 },
            source: ["forage_forest", "shop"],
            uses: ["alchemy", "cooking"],
            stackable: true,
            maxStack: 30
        },

        crystal_sage: {
            id: "crystal_sage",
            name: "Crystal Sage",
            type: "ingredient",
            category: "herb",
            icon: "💎",
            desc: "Sage infused with crystal energy. Enhances mental clarity.",
            rarity: "rare",
            value: { silver: 5 },
            source: ["forage_mountain", "rare_find"],
            uses: ["alchemy", "enchanting"],
            stackable: true,
            maxStack: 10
        },

        phoenix_petal: {
            id: "phoenix_petal",
            name: "Phoenix Petal",
            type: "ingredient",
            category: "herb",
            icon: "🌺",
            desc: "A petal from the legendary Phoenix Flower. Grants rebirth properties.",
            rarity: "epic",
            value: { gold: 1 },
            source: ["rare_find", "quest", "boss_drop"],
            uses: ["alchemy", "cooking"],
            stackable: true,
            maxStack: 5
        },

        // Food Ingredients - Raw materials for cooking
        cave_salt: {
            id: "cave_salt",
            name: "Cave Salt",
            type: "ingredient",
            category: "seasoning",
            icon: "🧂",
            desc: "Pure salt crystals from deep caves. Preserves and flavors food.",
            rarity: "common",
            value: { copper: 10 },
            source: ["mine", "shop"],
            uses: ["cooking"],
            stackable: true,
            maxStack: 100
        },

        fire_spice: {
            id: "fire_spice",
            name: "Fire Spice",
            type: "ingredient",
            category: "seasoning",
            icon: "🌶️",
            desc: "Spicy seasoning that warms the body and soul.",
            rarity: "uncommon",
            value: { silver: 1 },
            source: ["forage_desert", "shop"],
            uses: ["cooking"],
            stackable: true,
            maxStack: 50
        },

        honey_crystal: {
            id: "honey_crystal",
            name: "Honey Crystal",
            type: "ingredient",
            category: "sweetener",
            icon: "🍯",
            desc: "Crystallized honey from giant bees. Sweet and energizing.",
            rarity: "uncommon",
            value: { silver: 2 },
            source: ["hive_raid", "shop"],
            uses: ["cooking", "alchemy"],
            stackable: true,
            maxStack: 25
        },

        aged_wine: {
            id: "aged_wine",
            name: "Aged Wine",
            type: "ingredient",
            category: "liquid",
            icon: "🍷",
            desc: "Fine wine aged in mystical barrels. Enhances magical properties.",
            rarity: "rare",
            value: { silver: 8 },
            source: ["shop", "treasure", "quest"],
            uses: ["cooking", "alchemy"],
            stackable: true,
            maxStack: 12
        },

        // Archaeological Materials - Found items and ancient components
        ancient_parchment: {
            id: "ancient_parchment",
            name: "Ancient Parchment",
            type: "ingredient",
            category: "scroll",
            icon: "📜",
            desc: "Old parchment with faded writings. Contains forgotten knowledge.",
            rarity: "uncommon",
            value: { silver: 3 },
            source: ["ruins", "library", "treasure"],
            uses: ["archaeology", "enchanting"],
            stackable: true,
            maxStack: 20
        },

        runic_stone: {
            id: "runic_stone",
            name: "Runic Stone",
            type: "ingredient",
            category: "rune",
            icon: "🗿",
            desc: "Stone carved with ancient runes. Holds magical power.",
            rarity: "rare",
            value: { silver: 10 },
            source: ["ruins", "excavation", "puzzle"],
            uses: ["archaeology", "enchanting"],
            stackable: true,
            maxStack: 8
        },

        timeworn_gear: {
            id: "timeworn_gear",
            name: "Timeworn Gear",
            type: "ingredient",
            category: "mechanism",
            icon: "⚙️",
            desc: "Ancient mechanical component. Still functional after centuries.",
            rarity: "rare",
            value: { gold: 1 },
            source: ["ruins", "excavation", "ancient_tech"],
            uses: ["archaeology", "smithing"],
            stackable: true,
            maxStack: 5
        },

        soul_fragment: {
            id: "soul_fragment",
            name: "Soul Fragment",
            type: "ingredient",
            category: "essence",
            icon: "👻",
            desc: "Fragment of an ancient soul. Dangerous but powerful.",
            rarity: "epic",
            value: { gold: 2 },
            source: ["haunted_ruins", "lich_defeat", "dark_ritual"],
            uses: ["archaeology", "enchanting", "alchemy"],
            stackable: true,
            maxStack: 3
        }
    },

    // === READY-TO-USE CONSUMABLES ===
    consumables: {
        // Basic Herbs - Ready to use without processing
        pain_relief_leaf: {
            id: "pain_relief_leaf",
            name: "Pain Relief Leaf",
            type: "consumable",
            category: "herb",
            icon: "🍃",
            desc: "Natural painkiller. Restores 15 HP instantly.",
            rarity: "common",
            effect: { type: "heal", amount: 15 },
            value: { copper: 25 },
            source: ["forage", "shop", "npc_gift"],
            stackable: true,
            maxStack: 20
        },

        energy_berry: {
            id: "energy_berry",
            name: "Energy Berry",
            type: "consumable",
            category: "fruit",
            icon: "🫐",
            desc: "Wild berry that restores stamina. +20 Stamina.",
            rarity: "common",
            effect: { type: "stamina_restore", amount: 20 },
            value: { copper: 15 },
            source: ["forage", "shop"],
            stackable: true,
            maxStack: 30
        },

        mana_mushroom: {
            id: "mana_mushroom",
            name: "Mana Mushroom",
            type: "consumable",
            category: "fungi",
            icon: "🟣",
            desc: "Magical mushroom that restores mana. +25 MP.",
            rarity: "uncommon",
            effect: { type: "mana_restore", amount: 25 },
            value: { silver: 1 },
            source: ["forage_cave", "shop"],
            stackable: true,
            maxStack: 15
        },

        warrior_root: {
            id: "warrior_root",
            name: "Warrior's Root",
            type: "consumable",
            category: "root",
            icon: "🥕",
            desc: "Tough root that increases strength temporarily. +3 Strength for 10 rounds.",
            rarity: "uncommon",
            effect: { type: "stat_boost", stats: { strength: 3 }, duration: 3600 },
            value: { silver: 2 },
            source: ["forage_mountain", "shop", "quest"],
            stackable: true,
            maxStack: 10
        },

        scholar_tea: {
            id: "scholar_tea",
            name: "Scholar's Tea",
            type: "consumable",
            category: "beverage",
            icon: "🍵",
            desc: "Herbal tea that sharpens the mind. +25% experience gain for 20 rounds.",
            rarity: "rare",
            effect: { type: "experience_boost", amount: 25, duration: 7200 },
            value: { silver: 5 },
            source: ["shop", "quest", "npc_gift"],
            stackable: true,
            maxStack: 8
        },

        // Prepared Foods - Found or purchased ready-to-eat
        trail_rations: {
            id: "trail_rations",
            name: "Trail Rations",
            type: "consumable",
            category: "food",
            icon: "🥨",
            desc: "Basic preserved food. Restores 25 HP and removes hunger.",
            rarity: "common",
            effect: { type: "heal", amount: 25, removes: ["hunger"] },
            value: { copper: 50 },
            source: ["shop", "caravan", "npc_gift"],
            stackable: true,
            maxStack: 20
        },

        elven_bread: {
            id: "elven_bread",
            name: "Elven Bread",
            type: "consumable",
            category: "food",
            icon: "🍞",
            desc: "Magical bread that sustains for days. +2 All Stats for 40 rounds.",
            rarity: "rare",
            effect: { type: "stat_boost", stats: { all: 2 }, duration: 14400 },
            value: { silver: 8 },
            source: ["elf_village", "quest", "rare_find"],
            stackable: true,
            maxStack: 5
        },

        dwarven_ale: {
            id: "dwarven_ale",
            name: "Dwarven Ale",
            type: "consumable",
            category: "beverage",
            icon: "🍺",
            desc: "Strong ale that boosts constitution. +5 Constitution, +10% damage resistance for 10 rounds.",
            rarity: "uncommon",
            effect: { type: "stat_boost", stats: { constitution: 5 }, damage_resistance: 10, duration: 3600 },
            value: { silver: 3 },
            source: ["dwarf_tavern", "shop", "celebration"],
            stackable: true,
            maxStack: 12
        }
    },

    // === ARCHAEOLOGICAL DISCOVERIES ===
    artifacts: {
        // Ancient Tools - Functional archaeological finds
        explorers_compass: {
            id: "explorers_compass",
            name: "Explorer's Compass",
            type: "tool",
            category: "navigation",
            icon: "🧭",
            desc: "Ancient compass that always points to treasure. +20% chance to find rare items.",
            rarity: "uncommon",
            effect: { type: "find_bonus", amount: 20 },
            value: { silver: 15 },
            source: ["ruins", "treasure", "excavation"],
            stackable: false
        },

        scholars_monocle: {
            id: "scholars_monocle",
            name: "Scholar's Monocle",
            type: "tool",
            category: "research",
            icon: "🔍",
            desc: "Magical monocle that reveals hidden knowledge. +15% experience from archaeology.",
            rarity: "rare",
            effect: { type: "skill_experience_bonus", skill: "archaeology", amount: 15 },
            value: { gold: 1 },
            source: ["ancient_library", "puzzle", "scholar_ghost"],
            stackable: false
        },

        time_worn_key: {
            id: "time_worn_key",
            name: "Time-Worn Key",
            type: "key",
            category: "unlock",
            icon: "🗝️",
            desc: "Ancient key that opens forgotten doors. Required for some ruins.",
            rarity: "rare",
            value: { silver: 20 },
            source: ["ruins", "boss_drop", "puzzle_reward"],
            stackable: true,
            maxStack: 3
        },

        crystal_orb: {
            id: "crystal_orb",
            name: "Crystal Orb",
            type: "artifact",
            category: "divination",
            icon: "🔮",
            desc: "Mystical orb that reveals the location of nearby secrets.",
            rarity: "epic",
            effect: { type: "secret_detection", range: 50 },
            value: { gold: 3 },
            source: ["ancient_sanctum", "lich_vault", "hidden_chamber"],
            stackable: false
        },

        // Historical Relics - Valuable but not necessarily functional
        golden_idol: {
            id: "golden_idol",
            name: "Golden Idol",
            type: "relic",
            category: "treasure",
            icon: "🏺",
            desc: "Priceless golden statue from a lost civilization. Extremely valuable.",
            rarity: "epic",
            value: { gold: 10 },
            source: ["temple", "tomb", "treasure_room"],
            stackable: false
        },

        royal_seal: {
            id: "royal_seal",
            name: "Royal Seal",
            type: "relic",
            category: "insignia",
            icon: "👑",
            desc: "Seal of an ancient king. Proves royal lineage and grants respect.",
            rarity: "legendary",
            effect: { type: "social_bonus", amount: 25 },
            value: { gold: 25 },
            source: ["royal_tomb", "throne_room", "crown_jewels"],
            stackable: false
        }
    },

    // === SPECIAL QUEST ITEMS ===
    quest_items: {
        // Important story items that can't be sold
        dragons_tear: {
            id: "dragons_tear",
            name: "Dragon's Tear",
            type: "quest_item",
            category: "legendary",
            icon: "💧",
            desc: "Crystallized tear of an ancient dragon. Said to grant incredible power.",
            rarity: "legendary",
            value: { gold: 100 }, // Very valuable but can't be sold
            source: ["dragon_defeat", "epic_quest"],
            stackable: false,
            sellable: false
        },

        phoenix_feather: {
            id: "phoenix_feather",
            name: "Phoenix Feather",
            type: "quest_item",
            category: "legendary",
            icon: "🪶",
            desc: "Feather from the immortal phoenix. Radiates warmth and hope.",
            rarity: "legendary",
            value: { gold: 50 },
            source: ["phoenix_encounter", "rebirth_quest"],
            stackable: false,
            sellable: false
        },

        void_shard: {
            id: "void_shard",
            name: "Void Shard",
            type: "quest_item",
            category: "dangerous",
            icon: "◼️",
            desc: "Fragment of pure nothingness. Handle with extreme caution.",
            rarity: "legendary",
            value: { gold: 75 },
            source: ["void_breach", "dark_summoning"],
            stackable: false,
            sellable: false
        }
    }
}

// Helper functions for discoverable items
function getDiscoverableItemById(itemId) {
    for (const category of Object.values(DISCOVERABLE_ITEMS_DATA)) {
        if (category[itemId]) {
            return category[itemId]
        }
    }
    return null
}

function getItemsBySource(source) {
    const items = []
    for (const category of Object.values(DISCOVERABLE_ITEMS_DATA)) {
        for (const item of Object.values(category)) {
            if (item.source && item.source.includes(source)) {
                items.push(item)
            }
        }
    }
    return items
}

function getItemsByCategory(categoryName) {
    const items = []
    for (const category of Object.values(DISCOVERABLE_ITEMS_DATA)) {
        for (const item of Object.values(category)) {
            if (item.category === categoryName) {
                items.push(item)
            }
        }
    }
    return items
}

function getItemsByRarity(rarity) {
    const items = []
    for (const category of Object.values(DISCOVERABLE_ITEMS_DATA)) {
        for (const item of Object.values(category)) {
            if (item.rarity === rarity) {
                items.push(item)
            }
        }
    }
    return items
}

// Make globally available for browser environment
window.DISCOVERABLE_ITEMS_DATA = DISCOVERABLE_ITEMS_DATA
window.getDiscoverableItemById = getDiscoverableItemById
window.getItemsBySource = getItemsBySource
window.getItemsByCategory = getItemsByCategory
window.getItemsByRarity = getItemsByRarity

// Normalize discoverable items to use 'price' instead of 'value' for consistency
function normalizeDiscoverableItemPricing() {
    for (const category of Object.values(DISCOVERABLE_ITEMS_DATA)) {
        for (const item of Object.values(category)) {
            if (item.value && !item.price) {
                item.price = item.value
            }
        }
    }
}

window.normalizeDiscoverableItemPricing = normalizeDiscoverableItemPricing

// Auto-normalize pricing on load
normalizeDiscoverableItemPricing()

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        DISCOVERABLE_ITEMS_DATA,
        getDiscoverableItemById,
        getItemsBySource,
        getItemsByCategory,
        getItemsByRarity
    }
}
