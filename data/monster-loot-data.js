// Monster Loot Data - Unique items that drop from specific monster skills
// Each monster skill can potentially drop unique materials/items based on the skill

const MONSTER_LOOT_DATA = {
    // Defense Skills Loot
    tough_skin: {
        id: "thick_hide",
        name: "Thick Hide",
        icon: "🟫",
        desc: "Tough leather from a resilient creature. Can be crafted into basic armor.",
        rarity: "common",
        type: "material"
    },

    rock_skin: {
        id: "living_rock_fragments",
        name: "Living Rock Fragments",
        icon: "🪨",
        desc: "Stone-like material that retains some of the creature's defensive properties.",
        rarity: "uncommon",
        type: "material"
    },

    metal_skin: {
        id: "metallic_fragments",
        name: "Metallic Fragments",
        icon: "⚙️",
        desc: "Metal-infused organic material with natural armor properties.",
        rarity: "rare",
        type: "material"
    },

    magical_resistance: {
        id: "anti_magic_essence",
        name: "Anti-Magic Essence",
        icon: "🔮",
        desc: "A crystalline substance that repels magical energy.",
        rarity: "uncommon",
        type: "essence"
    },

    armored_plates: {
        id: "segmented_carapace",
        name: "Segmented Carapace",
        icon: "🦀",
        desc: "Flexible yet strong armored plates that deflect critical strikes.",
        rarity: "rare",
        type: "material"
    },

    regeneration: {
        id: "regenerative_tissue",
        name: "Regenerative Tissue",
        icon: "💚",
        desc: "Living tissue that continues to heal even after removal.",
        rarity: "epic",
        type: "organic"
    },

    rapid_healing: {
        id: "phoenix_cells",
        name: "Phoenix Cells",
        icon: "✨",
        desc: "Miraculous cells that can rapidly regenerate any wound.",
        rarity: "legendary",
        type: "organic"
    },

    // Combat Skills Loot
    claws: {
        id: "sharp_claws",
        name: "Sharp Claws",
        icon: "🦅",
        desc: "Natural claws that retain their sharpness. Useful for crafting weapons.",
        rarity: "common",
        type: "material"
    },

    razor_claws: {
        id: "razor_talons",
        name: "Razor Talons",
        icon: "🩸",
        desc: "Incredibly sharp claws that cause bleeding wounds.",
        rarity: "uncommon",
        type: "material"
    },

    venomous_claws: {
        id: "venom_sacs",
        name: "Venom Sacs",
        icon: "🟢",
        desc: "Poison glands that can be harvested for toxin extraction.",
        rarity: "rare",
        type: "organic"
    },

    bite_attack: {
        id: "sharp_fangs",
        name: "Sharp Fangs",
        icon: "🦷",
        desc: "Pointed teeth perfect for piercing attacks.",
        rarity: "common",
        type: "material"
    },

    crushing_bite: {
        id: "crusher_molars",
        name: "Crusher Molars",
        icon: "💀",
        desc: "Massive teeth capable of crushing through armor.",
        rarity: "uncommon",
        type: "material"
    },

    tail_swipe: {
        id: "flexible_tail_section",
        name: "Flexible Tail Section",
        icon: "🦎",
        desc: "A section of powerful tail muscle for crafting whips.",
        rarity: "common",
        type: "material"
    },

    spiked_tail: {
        id: "tail_spikes",
        name: "Tail Spikes",
        icon: "🦂",
        desc: "Sharp spikes from a creature's tail, perfect for projectiles.",
        rarity: "uncommon",
        type: "material"
    },

    multiattack: {
        id: "combat_coordination_gland",
        name: "Combat Coordination Gland",
        icon: "⚔️",
        desc: "A rare gland that enhances reflexes and attack coordination.",
        rarity: "epic",
        type: "organic"
    },

    // Magic Skills Loot  
    fire_breath: {
        id: "flame_gland",
        name: "Flame Gland",
        icon: "🔥",
        desc: "Internal organ that produces intense fire. Contains fire essence.",
        rarity: "rare",
        type: "organ"
    },

    ice_breath: {
        id: "frost_core",
        name: "Frost Core",
        icon: "❄️",
        desc: "A crystalline organ that generates freezing temperatures.",
        rarity: "rare",
        type: "organ"
    },

    poison_breath: {
        id: "toxic_lung_tissue",
        name: "Toxic Lung Tissue",
        icon: "☠️",
        desc: "Poisonous respiratory tissue that creates deadly toxins.",
        rarity: "rare",
        type: "organ"
    },

    lightning_breath: {
        id: "storm_chamber",
        name: "Storm Chamber",
        icon: "⚡",
        desc: "Bio-electric organ that generates lightning strikes.",
        rarity: "rare",
        type: "organ"
    },

    acid_spit: {
        id: "acid_bladder",
        name: "Acid Bladder",
        icon: "🟢",
        desc: "Corrosive organ that produces powerful acid.",
        rarity: "uncommon",
        type: "organ"
    },

    fear_aura: {
        id: "terror_essence",
        name: "Terror Essence",
        icon: "😨",
        desc: "Concentrated fear that radiates from the creature's presence.",
        rarity: "rare",
        type: "essence"
    },

    paralyzing_gaze: {
        id: "petrifying_eye",
        name: "Petrifying Eye",
        icon: "👁️",
        desc: "An eye that retains its paralyzing power even after death.",
        rarity: "epic",
        type: "organ"
    },

    invisibility: {
        id: "phase_membrane",
        name: "Phase Membrane",
        icon: "👻",
        desc: "Translucent tissue that can bend light around itself.",
        rarity: "epic",
        type: "material"
    },

    teleport: {
        id: "dimensional_node",
        name: "Dimensional Node",
        icon: "✨",
        desc: "A small organ that can tear holes in space-time.",
        rarity: "epic",
        type: "organ"
    },

    // Utility Skills Loot
    flight: {
        id: "aerial_membrane",
        name: "Aerial Membrane",
        icon: "🦅",
        desc: "Lightweight wing membrane that defies gravity.",
        rarity: "legendary",
        type: "material"
    },

    burrow: {
        id: "earth_shaper_claws",
        name: "Earth Shaper Claws",
        icon: "🕳️",
        desc: "Specialized claws designed for digging through solid rock.",
        rarity: "uncommon",
        type: "material"
    },

    climb: {
        id: "adhesive_pads",
        name: "Adhesive Pads",
        icon: "🧗",
        desc: "Natural climbing pads that stick to any surface.",
        rarity: "common",
        type: "material"
    },

    swim: {
        id: "gill_slits",
        name: "Gill Slits",
        icon: "🏊",
        desc: "Functional gills that allow underwater breathing.",
        rarity: "uncommon",
        type: "organ"
    },

    echolocation: {
        id: "sonar_organ",
        name: "Sonar Organ",
        icon: "🦇",
        desc: "Bio-acoustic organ for echolocation abilities.",
        rarity: "rare",
        type: "organ"
    },

    camouflage: {
        id: "chromatic_scales",
        name: "Chromatic Scales",
        icon: "🦎",
        desc: "Color-changing scales that blend with surroundings.",
        rarity: "uncommon",
        type: "material"
    },

    pack_leader: {
        id: "alpha_pheromones",
        name: "Alpha Pheromones",
        icon: "🐺",
        desc: "Chemical signals that command respect from lesser creatures.",
        rarity: "rare",
        type: "essence"
    },

    size_change: {
        id: "growth_hormone_gland",
        name: "Growth Hormone Gland",
        icon: "📏",
        desc: "Gland that controls dramatic size changes.",
        rarity: "epic",
        type: "organ"
    },

    phase_shift: {
        id: "ethereal_essence",
        name: "Ethereal Essence",
        icon: "👻",
        desc: "Pure spirit energy that exists between dimensions.",
        rarity: "legendary",
        type: "essence"
    },

    ancient_knowledge: {
        id: "memory_crystal",
        name: "Memory Crystal",
        icon: "📚",
        desc: "Crystallized knowledge from an ancient mind.",
        rarity: "legendary",
        type: "crystal"
    },

    // Additional materials for profession items
    nature_communion: {
        id: "nature_essence",
        name: "Nature Essence",
        icon: "🌱",
        desc: "Pure essence of natural life force, useful for herbalism.",
        rarity: "uncommon",
        type: "essence"
    },

    elemental_mastery: {
        id: "elemental_heart",
        name: "Elemental Heart",
        icon: "💓",
        desc: "The core of an elemental being, pulsing with pure elemental energy.",
        rarity: "epic",
        type: "organ"
    },

    void_magic: {
        id: "void_essence",
        name: "Void Essence",
        icon: "🌌",
        desc: "Dark essence from the space between dimensions.",
        rarity: "epic",
        type: "essence"
    },

    time_manipulation: {
        id: "time_crystal",
        name: "Time Crystal",
        icon: "⏰",
        desc: "A crystal that exists outside normal time flow.",
        rarity: "legendary",
        type: "crystal"
    },

    // Crafting mats tied to low–mid tier monster skills (tier 1–2 encounters)
    monster_charge_attack: {
        id: "energy_gland",
        name: "Energy Gland",
        icon: "⚡",
        desc: "Stores burst energy from fast, aggressive beasts. Used in stamina potions and hearty meals.",
        rarity: "uncommon",
        type: "organic"
    },

    camouflage: {
        id: "scent_glands",
        name: "Scent Glands",
        icon: "👃",
        desc: "Musky glands from scavengers and predators. Used in repellents and tracking mixtures.",
        rarity: "common",
        type: "organic"
    },

    echolocation: {
        id: "glowing_crystals",
        name: "Glowing Crystals",
        icon: "💎",
        desc: "Dim crystal shards from minor magical beasts. Used in elixirs and low-tier enchantments.",
        rarity: "uncommon",
        type: "crystal"
    }
}

// Define skill upgrade chains - higher tier skills replace lower tier drops
const MONSTER_SKILL_CHAINS = {
    // Defense upgrade chains
    'tough_skin': ['rock_skin', 'metal_skin'],
    'rock_skin': ['metal_skin'],

    // Combat upgrade chains  
    'claws': ['razor_claws', 'venomous_claws'],
    'razor_claws': ['venomous_claws'],
    'bite_attack': ['crushing_bite'],
    'tail_swipe': ['spiked_tail'],

    // Regeneration chain
    'regeneration': ['rapid_healing']
}

// Get the highest tier skill in a chain that the character has
function getHighestSkillInChain(unlockedSkills, skillId) {
    // Check if this skill has upgrades
    const chain = MONSTER_SKILL_CHAINS[skillId]
    if (!chain) return skillId // No upgrades, return original skill

    // Find the highest tier skill in the chain that's unlocked
    for (let i = chain.length - 1; i >= 0; i--) {
        if (unlockedSkills.includes(chain[i])) {
            return chain[i]
        }
    }

    // If no upgrades are unlocked, return the base skill
    return skillId
}

// Get unique monster loot based on skills, respecting upgrade chains
function getMonsterLoot(character) {
    if (!character.isMonster) return []

    try {
        const unlockedSkills = characterManager.getAllUnlockedSkillIds(character)
        const uniqueLoot = []
        const processedChains = new Set()

        // Process each unlocked skill
        unlockedSkills.forEach(skillId => {
            // Skip if we've already processed this chain
            if (processedChains.has(skillId)) return

            // Get the highest tier skill in this chain
            const highestSkill = getHighestSkillInChain(unlockedSkills, skillId)

            // Mark all skills in this chain as processed
            const chain = MONSTER_SKILL_CHAINS[skillId]
            if (chain) {
                processedChains.add(skillId)
                chain.forEach(chainSkill => processedChains.add(chainSkill))
            } else {
                processedChains.add(skillId)
            }

            // Add loot for the highest tier skill only
            const lootData = MONSTER_LOOT_DATA[highestSkill]
            if (lootData) {
                uniqueLoot.push(lootData)
            }
        })

        return uniqueLoot
    } catch (error) {
        console.error('Error getting monster loot:', error)
        return []
    }
}

// Make globally available for browser environment
window.MONSTER_LOOT_DATA = MONSTER_LOOT_DATA
window.getMonsterLoot = getMonsterLoot

// Generate appropriate price for monster loot items
function generateMonsterLootPrice(item) {
    if (item.price) return item.price // Already has a price

    const rarityPrices = {
        common: { copper: 50 },
        uncommon: { silver: 2 },
        rare: { silver: 8 },
        epic: { silver: 25 },
        legendary: { gold: 2 }
    }

    return rarityPrices[item.rarity] || rarityPrices.common
}

// Auto-assign prices to all monster loot items
function assignPricesToMonsterLoot() {
    for (const item of Object.values(MONSTER_LOOT_DATA)) {
        if (!item.price) {
            item.price = generateMonsterLootPrice(item)
        }
    }
}

window.generateMonsterLootPrice = generateMonsterLootPrice
window.assignPricesToMonsterLoot = assignPricesToMonsterLoot

// Auto-assign prices on load
assignPricesToMonsterLoot()
