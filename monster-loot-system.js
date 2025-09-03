// Monster Loot System - Dynamic Design
// ================================================================

const MONSTER_LOOT_SYSTEM = {

    // Define lootable items based on shop availability
    // Items that cannot be purchased in shops are automatically lootable
    // First 50% of each weapon/armor/consumable type are lootable

    getLootableItems() {
        const allItems = getAllItems()
        const lootableItems = []

        // Get all items that cannot be purchased in shops
        allItems.forEach(item => {
            if (!item.shopItem) {
                lootableItems.push(item)
            }
        })

        // Get first 50% of each weapon type
        const weaponTypes = ['swords', 'bows', 'staves', 'axes', 'daggers', 'hammers', 'polearms']
        weaponTypes.forEach(type => {
            const weaponsOfType = allItems.filter(item =>
                item.type === 'weapon' &&
                item.subcategory === type &&
                item.shopItem === true
            )

            // Sort by price to get tier order
            weaponsOfType.sort((a, b) => a.price - b.price)

            // Take first 50%
            const lootableCount = Math.ceil(weaponsOfType.length * 0.5)
            const lootableWeapons = weaponsOfType.slice(0, lootableCount)
            lootableItems.push(...lootableWeapons)
        })

        // Get first 50% of each armor type
        const armorTypes = ['light', 'medium', 'heavy']
        armorTypes.forEach(type => {
            const armorOfType = allItems.filter(item =>
                item.type === 'armor' &&
                item.subcategory === type &&
                item.shopItem === true
            )

            // Sort by price to get tier order
            armorOfType.sort((a, b) => a.price - b.price)

            // Take first 50%
            const lootableCount = Math.ceil(armorOfType.length * 0.5)
            const lootableArmor = armorOfType.slice(0, lootableCount)
            lootableItems.push(...lootableArmor)
        })

        // Get first 50% of consumables
        const consumables = allItems.filter(item =>
            item.type === 'consumable' &&
            item.shopItem === true
        )

        // Sort by price to get tier order
        consumables.sort((a, b) => a.price - b.price)

        // Take first 50%
        const lootableCount = Math.ceil(consumables.length * 0.5)
        const lootableConsumables = consumables.slice(0, lootableCount)
        lootableItems.push(...lootableConsumables)

        return lootableItems
    },

    // Skill-based loot categories
    skillLootCategories: {
        // Combat skills
        claws: { type: 'combat', keywords: ['claw', 'sharp', 'blade', 'weapon'] },
        bite_attack: { type: 'combat', keywords: ['fang', 'tooth', 'bite', 'weapon'] },
        tail_swipe: { type: 'combat', keywords: ['tail', 'sweep', 'weapon'] },
        charge_attack: { type: 'combat', keywords: ['charge', 'rush', 'weapon'] },
        rend: { type: 'combat', keywords: ['tear', 'rip', 'weapon'] },
        pounce: { type: 'combat', keywords: ['leap', 'jump', 'weapon'] },

        // Magic skills
        fire_breath: { type: 'fire', keywords: ['fire', 'flame', 'burn', 'heat', 'magic'] },
        ice_breath: { type: 'ice', keywords: ['ice', 'frost', 'cold', 'freeze', 'magic'] },
        lightning_breath: { type: 'lightning', keywords: ['lightning', 'thunder', 'spark', 'electric', 'magic'] },
        poison_breath: { type: 'poison', keywords: ['poison', 'venom', 'toxic', 'magic'] },
        acid_spit: { type: 'acid', keywords: ['acid', 'corrosion', 'magic'] },
        fear_aura: { type: 'dark', keywords: ['fear', 'dark', 'shadow', 'magic'] },
        teleport: { type: 'magic', keywords: ['teleport', 'magic', 'arcane'] },
        invisibility: { type: 'magic', keywords: ['invisible', 'stealth', 'magic'] },

        // Defense skills
        tough_skin: { type: 'defense', keywords: ['leather', 'hide', 'skin', 'armor'] },
        rock_skin: { type: 'defense', keywords: ['stone', 'rock', 'armor', 'defense'] },
        metal_skin: { type: 'defense', keywords: ['metal', 'steel', 'iron', 'armor'] },
        magical_resistance: { type: 'defense', keywords: ['magic', 'resistance', 'ward', 'defense'] },

        // Utility skills
        flight: { type: 'utility', keywords: ['wing', 'flight', 'air', 'utility'] },
        burrow: { type: 'utility', keywords: ['earth', 'ground', 'tunnel', 'utility'] },
        climb: { type: 'utility', keywords: ['climb', 'grip', 'utility'] },
        swim: { type: 'utility', keywords: ['water', 'swim', 'aquatic', 'utility'] },
        camouflage: { type: 'utility', keywords: ['stealth', 'hide', 'utility'] }
    },

    // Generate dynamic loot based on monster level and skills
    generateDynamicLoot(monster) {
        if (!monster || !monster.isMonster) return []

        const monsterLevel = this.calculateMonsterLevel(monster)
        const monsterSkills = this.getAllMonsterSkills(monster)
        const loot = []

        // Determine loot tiers based on level
        const lootTiers = this.getLootTiersByLevel(monsterLevel)

        // Get all lootable items
        const allLootableItems = this.getLootableItems()

        // Generate loot for each tier
        lootTiers.forEach(tier => {
            const tierItems = this.getItemsForTier(allLootableItems, tier)
            const skillFilteredItems = this.filterItemsBySkills(tierItems, monsterSkills)

            // Add items based on tier chances
            const itemsToAdd = this.selectItemsForTier(skillFilteredItems, tier, monsterLevel)
            loot.push(...itemsToAdd)
        })

        return loot
    },

    // Calculate monster level based on skills and stats (same as character manager)
    calculateMonsterLevel(monster) {
        // Use the same level calculation as character manager
        if (window.characterManager) {
            const tierPoints = window.characterManager.calculateTierPoints(monster)
            const statPoints = window.characterManager.calculateStatPoints(monster)
            const totalPoints = tierPoints + statPoints
            return window.characterManager.calculateLevel(totalPoints)
        }

        // Fallback calculation if character manager not available
        let skillCount = 0
        if (monster.unlockedSkills) {
            Object.values(monster.unlockedSkills).forEach(category => {
                if (typeof category === 'object') {
                    Object.values(category).forEach(skillArray => {
                        if (Array.isArray(skillArray)) {
                            skillCount += skillArray.length
                        }
                    })
                }
            })
        }

        // Basic level calculation: 1 level per 3 skills, minimum level 1
        return Math.max(1, Math.floor(skillCount / 3))
    },

    // Get all monster skills from the character
    getAllMonsterSkills(monster) {
        const skills = []

        if (monster.unlockedSkills && monster.unlockedSkills.monster) {
            Object.values(monster.unlockedSkills.monster).forEach(skillArray => {
                if (Array.isArray(skillArray)) {
                    skills.push(...skillArray)
                }
            })
        }

        return skills
    },

    // Determine loot tiers based on monster level
    getLootTiersByLevel(level) {
        if (level <= 3) {
            return [
                { rarity: 'common', chance: 25, count: 3 },
                { rarity: 'uncommon', chance: 15, count: 1 },
                { rarity: 'rare', chance: 10, count: 1 }
            ]
        } else if (level <= 7) {
            return [
                { rarity: 'common', chance: 25, count: 2 },
                { rarity: 'uncommon', chance: 15, count: 2 },
                { rarity: 'rare', chance: 10, count: 1 }
            ]
        } else if (level <= 10) {
            return [
                { rarity: 'uncommon', chance: 15, count: 3 },
                { rarity: 'rare', chance: 10, count: 2 },
                { rarity: 'epic', chance: 5, count: 1 }
            ]
        } else {
            return [
                { rarity: 'uncommon', chance: 15, count: 4 },
                { rarity: 'rare', chance: 10, count: 3 },
                { rarity: 'epic', chance: 5, count: 2 }
            ]
        }
    },

    // Get items for a specific tier
    getItemsForTier(allItems, tier) {
        return allItems.filter(item => item.rarity === tier.rarity)
    },

    // Filter items based on monster skills
    filterItemsBySkills(items, monsterSkills) {
        if (monsterSkills.length === 0) return items

        const skillKeywords = []

        // Get keywords from monster skills
        monsterSkills.forEach(skillId => {
            const skillCategory = this.skillLootCategories[skillId]
            if (skillCategory) {
                skillKeywords.push(...skillCategory.keywords)
            }
        })

        if (skillKeywords.length === 0) return items

        // Score items based on keyword matches
        const scoredItems = items.map(item => {
            let score = 0
            const itemText = `${item.name} ${item.desc}`.toLowerCase()

            skillKeywords.forEach(keyword => {
                if (itemText.includes(keyword.toLowerCase())) {
                    score += 1
                }
            })

            return { item, score }
        })

        // Sort by score (highest first) and return top 70% of items
        scoredItems.sort((a, b) => b.score - a.score)
        const topItems = scoredItems.slice(0, Math.ceil(scoredItems.length * 0.7))

        return topItems.map(scored => scored.item)
    },

    // Select items for a tier based on chances
    selectItemsForTier(items, tier, monsterLevel) {
        const selectedItems = []

        // Try to add items up to the tier count
        for (let i = 0; i < tier.count; i++) {
            // Roll for each item in the tier
            items.forEach(item => {
                const roll = Math.random() * 100
                if (roll <= tier.chance && selectedItems.length < tier.count) {
                    // Check if we already have this item
                    const alreadySelected = selectedItems.some(selected => selected.id === item.id)
                    if (!alreadySelected) {
                        selectedItems.push(item)
                    }
                }
            })
        }

        return selectedItems
    },

    // Calculate lumen reward based on monster level and player count
    calculateLumenReward(monster, playerCount = 1) {
        const monsterLevel = this.calculateMonsterLevel(monster)
        const baseReward = monsterLevel * 5 // Base reward per level

        // Player count scaling
        let multiplier = 1.0
        if (playerCount >= 6) multiplier = 2.5
        else if (playerCount >= 4) multiplier = 2.0
        else if (playerCount >= 2) multiplier = 1.5

        return Math.floor(baseReward * multiplier)
    },

    // Get loot analysis for a monster (for UI display)
    getLootAnalysis(monster) {
        const monsterLevel = this.calculateMonsterLevel(monster)
        const monsterSkills = this.getAllMonsterSkills(monster)
        const lootTiers = this.getLootTiersByLevel(monsterLevel)

        return {
            level: monsterLevel,
            skills: monsterSkills,
            lootTiers: lootTiers,
            skillCategories: monsterSkills.map(skillId => this.skillLootCategories[skillId]).filter(Boolean)
        }
    },

    // Legacy function for backward compatibility
    generateLoot(monsterId) {
        // This function is now deprecated - use generateDynamicLoot instead
        console.warn('generateLoot(monsterId) is deprecated. Use generateDynamicLoot(monster) instead.')
        return []
    }
}

// Make it available globally
if (typeof window !== 'undefined') {
    window.MONSTER_LOOT_SYSTEM = MONSTER_LOOT_SYSTEM
}

// For Node.js environments
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MONSTER_LOOT_SYSTEM
}
