// Monster System - Stackable Elemental Resistances and Weaknesses
// ================================================================

const MONSTER_SYSTEM = {

    // Stackable Elemental Resistance/Weakness System
    // Resistance levels: -3 = 0% (IMMUNITY), -2 = 25%, -1 = 50%, 0 = 100%, +1 = 200%, +2 = 400%, +3 = INSTANT KILL
    elementalAffinities: {
        // FIRE MAGIC SKILLS
        fire_attunement: {
            resistanceModifiers: { fire: -1 },
            weaknessModifiers: { ice: +1 },
            description: 'Fire Attunement: Fire resistance 50% (-1), Ice weakness 200% (+1)'
        },
        fire_mastery: {
            resistanceModifiers: { fire: -2, earth: -1 },
            weaknessModifiers: { ice: +1, water: +1 },
            description: 'Fire Mastery: Fire resistance 25% (-2), Earth resistance 50% (-1), Ice weakness 200% (+1), Water weakness 200% (+1)'
        },

        // ICE MAGIC SKILLS
        ice_attunement: {
            resistanceModifiers: { ice: -1 },
            weaknessModifiers: { fire: +1 },
            description: 'Ice Attunement: Ice resistance 50% (-1), Fire weakness 200% (+1)'
        },
        ice_dominion: {
            resistanceModifiers: { ice: -2, water: -1 },
            weaknessModifiers: { fire: +1, lightning: +1 },
            description: 'Ice Dominion: Ice resistance 25% (-2), Water resistance 50% (-1), Fire weakness 200% (+1), Lightning weakness 200% (+1)'
        },

        // LIGHTNING MAGIC SKILLS
        lightning_attunement: {
            resistanceModifiers: { lightning: -1 },
            weaknessModifiers: { earth: +1 },
            description: 'Lightning Attunement: Lightning resistance 50% (-1), Earth weakness 200% (+1)'
        },
        storm_mastery: {
            resistanceModifiers: { lightning: -2, wind: -1 },
            weaknessModifiers: { earth: +1, water: +1 },
            description: 'Storm Mastery: Lightning resistance 25% (-2), Wind resistance 50% (-1), Earth weakness 200% (+1), Water weakness 200% (+1)'
        },

        // EARTH MAGIC SKILLS
        earth_attunement: {
            resistanceModifiers: { earth: -1 },
            weaknessModifiers: { wind: +1 },
            description: 'Earth Attunement: Earth resistance 50% (-1), Wind weakness 200% (+1)'
        },
        stone_mastery: {
            resistanceModifiers: { earth: -2, poison: -1 },
            weaknessModifiers: { wind: +1, lightning: +1 },
            description: 'Stone Mastery: Earth resistance 25% (-2), Poison resistance 50% (-1), Wind weakness 200% (+1), Lightning weakness 200% (+1)'
        },

        // WATER MAGIC SKILLS
        water_attunement: {
            resistanceModifiers: { water: -1 },
            weaknessModifiers: { lightning: +1 },
            description: 'Water Attunement: Water resistance 50% (-1), Lightning weakness 200% (+1)'
        },
        hydro_mastery: {
            resistanceModifiers: { water: -2, ice: -1 },
            weaknessModifiers: { lightning: +2 },
            description: 'Hydro Mastery: Water resistance 25% (-2), Ice resistance 50% (-1), Lightning weakness 400% (+2)'
        },

        // WIND MAGIC SKILLS
        wind_attunement: {
            resistanceModifiers: { wind: -1 },
            weaknessModifiers: { lightning: +1 },
            description: 'Wind Attunement: Wind resistance 50% (-1), Lightning weakness 200% (+1)'
        },
        gale_mastery: {
            resistanceModifiers: { wind: -1 },
            weaknessModifiers: { lightning: +1 },
            description: 'Gale Mastery: Wind resistance 50% (-1), Lightning weakness 200% (+1)'
        },

        // LIGHT MAGIC SKILLS
        light_attunement: {
            resistanceModifiers: { light: -1 },
            weaknessModifiers: { dark: +1 },
            description: 'Light Attunement: Light resistance 50% (-1), Dark weakness 200% (+1)'
        },
        radiant_mastery: {
            resistanceModifiers: { light: -2, fire: -1 },
            weaknessModifiers: { dark: +2 },
            description: 'Radiant Mastery: Light resistance 25% (-2), Fire resistance 50% (-1), Dark weakness 400% (+2)'
        },

        // DARK MAGIC SKILLS
        dark_attunement: {
            resistanceModifiers: { dark: -1 },
            weaknessModifiers: { light: +1 },
            description: 'Dark Attunement: Dark resistance 50% (-1), Light weakness 200% (+1)'
        },
        void_mastery: {
            resistanceModifiers: { dark: -2, ice: -1 },
            weaknessModifiers: { light: +2 },
            description: 'Void Mastery: Dark resistance 25% (-2), Ice resistance 50% (-1), Light weakness 400% (+2)'
        },

        // BREATH SKILLS
        fire_breath: {
            resistanceModifiers: { fire: -1 },
            weaknessModifiers: { ice: +1, water: +1 },
            description: 'Fire Breath: Fire resistance 50% (-1), Ice weakness 200% (+1), Water weakness 200% (+1)'
        },
        ice_breath: {
            resistanceModifiers: { ice: -1, water: -1 },
            weaknessModifiers: { fire: +1, lightning: +1 },
            description: 'Ice Breath: Ice resistance 50% (-1), Water resistance 50% (-1), Fire weakness 200% (+1), Lightning weakness 200% (+1)'
        },
        poison_breath: {
            resistanceModifiers: { poison: -1 },
            weaknessModifiers: { light: +1, fire: +1 },
            description: 'Poison Breath: Poison resistance 50% (-1), Light weakness 200% (+1), Fire weakness 200% (+1)'
        },
        lightning_breath: {
            resistanceModifiers: { lightning: -1 },
            weaknessModifiers: { earth: +1, water: +1 },
            description: 'Lightning Breath: Lightning resistance 50% (-1), Earth weakness 200% (+1), Water weakness 200% (+1)'
        }
    },

    // Check if a skill provides elemental resistances/weaknesses (monster-only skills)
    isElementalAffinitySkill(skillId) {
        return this.elementalAffinities.hasOwnProperty(skillId)
    },

    // Get list of all elemental affinity skill IDs (for filtering)
    getElementalAffinitySkillIds() {
        return Object.keys(this.elementalAffinities)
    },

    // Calculate total elemental modifiers from all skills
    calculateElementalProfile(elementalSkills) {
        const totalModifiers = {}

        // Initialize all elements to 0 (normal damage)
        const elements = ['fire', 'ice', 'lightning', 'earth', 'water', 'wind', 'light', 'dark', 'poison']
        elements.forEach(element => totalModifiers[element] = 0)

        // Stack modifiers from all elemental skills
        elementalSkills.forEach(skillId => {
            const affinity = this.elementalAffinities[skillId]
            if (affinity) {
                // Add resistance modifiers (negative values)
                if (affinity.resistanceModifiers) {
                    Object.entries(affinity.resistanceModifiers).forEach(([element, modifier]) => {
                        totalModifiers[element] += modifier
                    })
                }
                // Add weakness modifiers (positive values)
                if (affinity.weaknessModifiers) {
                    Object.entries(affinity.weaknessModifiers).forEach(([element, modifier]) => {
                        totalModifiers[element] += modifier
                    })
                }
            }
        })

        // Categorize by final modifier values
        const profile = {
            immunities: [],             // -3 or less = 0% damage (IMMUNITY)
            resistances: [],            // -2 = 25% damage
            minorResistances: [],       // -1 = 50% damage
            normalDamage: [],           // 0 = 100% damage
            weaknesses: [],             // +1 = 200% damage
            criticalWeaknesses: [],     // +2 = 400% damage
            instantKills: [],           // +3 or more = INSTANT KILL
            modifiers: totalModifiers   // Raw modifier values for display
        }

        Object.entries(totalModifiers).forEach(([element, modifier]) => {
            if (modifier <= -3) {
                profile.immunities.push(element)
            } else if (modifier === -2) {
                profile.resistances.push(element)
            } else if (modifier === -1) {
                profile.minorResistances.push(element)
            } else if (modifier === 0) {
                profile.normalDamage.push(element)
            } else if (modifier === 1) {
                profile.weaknesses.push(element)
            } else if (modifier === 2) {
                profile.criticalWeaknesses.push(element)
            } else if (modifier >= 3) {
                profile.instantKills.push(element)
            }
        })

        return profile
    },

    // Calculate actual damage multiplier from modifier
    calculateDamageMultiplier(element, elementalSkills) {
        const profile = this.calculateElementalProfile(elementalSkills)
        const modifier = profile.modifiers[element] || 0

        // Convert modifier to damage multiplier
        if (modifier <= -3) return 0.0        // IMMUNITY (0% damage)
        if (modifier === -2) return 0.25      // 25%
        if (modifier === -1) return 0.5       // 50%
        if (modifier === 0) return 1.0        // 100%
        if (modifier === 1) return 2.0        // 200%
        if (modifier === 2) return 4.0        // 400%
        if (modifier >= 3) return 'INSTANT_KILL' // INSTANT KILL

        return 1.0 // Default to normal damage
    },

    // LOOT GENERATION SYSTEM
    // ======================

    // Loot categories based on skill types
    lootCategories: {
        combat: ['leather_grip', 'leather_strap', 'sharpening_essence', 'defense_essence', 'steel_ingot', 'scale_fragment', 'spear', 'iron_spear', 'leather_boots'],
        magic: ['arcane_dust', 'crystal_shard', 'vitality_essence', 'fire_essence', 'silver_ingot', 'gold_ingot', 'ironbark_moss', 'apprentice_staff', 'journeyman_staff'],
        utility: ['metallic_fragments', 'anti_magic_essence', 'segmented_carapace', 'regenerative_tissue', 'training_bow', 'hunter_bow'],
        defense: ['leather_strap', 'defense_essence', 'steel_ingot', 'scale_fragment', 'metallic_fragments', 'segmented_carapace']
    },

    // Generate loot based on monster's skills
    generateLoot(character) {
        if (!character.isMonster) return []

        const allSkills = this.getAllUnlockedSkillIds(character)
        const loot = []

        // Categorize skills
        const skillCategories = {
            combat: 0,
            magic: 0,
            utility: 0,
            defense: 0
        }

        allSkills.forEach(skillId => {
            const skill = getAllSkills().find(s => s.id === skillId)
            if (skill && skill.lootType) {
                skillCategories[skill.lootType]++
            }
        })

        // Generate loot based on skill distribution
        Object.entries(skillCategories).forEach(([category, count]) => {
            for (let i = 0; i < Math.min(count, 3); i++) {
                const categoryLoot = this.lootCategories[category]
                const randomLoot = categoryLoot[Math.floor(Math.random() * categoryLoot.length)]
                loot.push(randomLoot)
            }
        })

        return loot
    },

    // Get all unlocked skill IDs from character
    getAllUnlockedSkillIds(character) {
        const allSkills = []

        if (character.unlockedSkills) {
            Object.values(character.unlockedSkills).forEach(category => {
                if (Array.isArray(category)) {
                    allSkills.push(...category)
                } else if (typeof category === 'object') {
                    Object.values(category).forEach(subcategory => {
                        if (Array.isArray(subcategory)) {
                            allSkills.push(...subcategory)
                        }
                    })
                }
            })
        }

        return allSkills
    },

    // Equipment Elemental Affinities - similar to skill affinities but for gear
    equipmentAffinities: {
        // RINGS
        ring_of_fire: {
            resistanceModifiers: { fire: -1 },
            weaknessModifiers: { ice: +1 },
            description: 'Ring of Fire: Fire resistance 50% (-1), Ice weakness 200% (+1)'
        },
        ring_of_ice: {
            resistanceModifiers: { ice: -1 },
            weaknessModifiers: { fire: +1 },
            description: 'Ring of Ice: Ice resistance 50% (-1), Fire weakness 200% (+1)'
        },
        ring_of_storms: {
            resistanceModifiers: { lightning: -1 },
            weaknessModifiers: { earth: +1 },
            description: 'Ring of Storms: Lightning resistance 50% (-1), Earth weakness 200% (+1)'
        },

        // AMULETS
        amulet_of_earth: {
            resistanceModifiers: { earth: -1 },
            weaknessModifiers: { wind: +1 },
            description: 'Amulet of Earth: Earth resistance 50% (-1), Wind weakness 200% (+1)'
        },
        amulet_of_shadows: {
            resistanceModifiers: { dark: -1 },
            weaknessModifiers: { light: +1 },
            description: 'Amulet of Shadows: Dark resistance 50% (-1), Light weakness 200% (+1)'
        },
        amulet_of_light: {
            resistanceModifiers: { light: -1 },
            weaknessModifiers: { dark: +1 },
            description: 'Amulet of Light: Light resistance 50% (-1), Dark weakness 200% (+1)'
        },

        // ARMOR SETS
        fire_robes: {
            resistanceModifiers: { fire: -2 },
            weaknessModifiers: { ice: +1, water: +1 },
            description: 'Fire Robes: Fire resistance 25% (-2), Ice/Water weakness 200% (+1)'
        },
        ice_armor: {
            resistanceModifiers: { ice: -2 },
            weaknessModifiers: { fire: +1, lightning: +1 },
            description: 'Ice Armor: Ice resistance 25% (-2), Fire/Lightning weakness 200% (+1)'
        },
        flame_mail: {
            resistanceModifiers: { fire: -2 },
            weaknessModifiers: { ice: +1, water: +1 },
            description: 'Flame Mail: Fire resistance 25% (-2), Ice/Water weakness 200% (+1)'
        },
        frost_armor: {
            resistanceModifiers: { ice: -2 },
            weaknessModifiers: { fire: +1, lightning: +1 },
            description: 'Frost Armor: Ice resistance 25% (-2), Fire/Lightning weakness 200% (+1)'
        },
        storm_cloak: {
            resistanceModifiers: { lightning: -1, wind: -1 },
            weaknessModifiers: { earth: +1 },
            description: 'Storm Cloak: Lightning/Wind resistance 50% (-1), Earth weakness 200% (+1)'
        }
    },

    // Get equipment elemental affinities from equipped items
    getEquipmentAffinities(character) {
        const affinities = {
            fire: 0, ice: 0, lightning: 0, earth: 0, water: 0, wind: 0,
            light: 0, dark: 0, poison: 0
        }

        // Check each equipment slot
        if (character.equipped) {
            Object.values(character.equipped).forEach(equippedItem => {
                if (equippedItem) {
                    // Handle both old format (item ID) and new format (full item object)
                    let itemData
                    if (typeof equippedItem === 'string') {
                        // Look up item by ID
                        itemData = findItemById(equippedItem)
                    } else {
                        // Use the full item object
                        itemData = equippedItem
                    }

                    // Check if item has elemental affinities
                    if (itemData && itemData.elementalAffinities) {
                        const itemAffinities = itemData.elementalAffinities

                        // Handle resistance modifiers
                        if (itemAffinities.resistances) {
                            Object.entries(itemAffinities.resistances).forEach(([element, modifier]) => {
                                if (affinities.hasOwnProperty(element)) {
                                    affinities[element] += modifier
                                }
                            })
                        }

                        // Handle weakness modifiers (added to affinity value)
                        if (itemAffinities.weaknesses) {
                            Object.entries(itemAffinities.weaknesses).forEach(([element, modifier]) => {
                                if (affinities.hasOwnProperty(element)) {
                                    affinities[element] += modifier
                                }
                            })
                        }
                    }

                    // Fallback: Check old system for items that haven't been updated yet
                    const itemId = typeof equippedItem === 'string' ? equippedItem : equippedItem.id
                    if (itemId && this.equipmentAffinities[itemId]) {
                        const itemAffinities = this.equipmentAffinities[itemId]

                        // Handle resistance modifiers
                        if (itemAffinities.resistanceModifiers) {
                            Object.entries(itemAffinities.resistanceModifiers).forEach(([element, modifier]) => {
                                if (affinities.hasOwnProperty(element)) {
                                    affinities[element] += modifier
                                }
                            })
                        }

                        // Handle weakness modifiers
                        if (itemAffinities.weaknessModifiers) {
                            Object.entries(itemAffinities.weaknessModifiers).forEach(([element, modifier]) => {
                                if (affinities.hasOwnProperty(element)) {
                                    affinities[element] += modifier
                                }
                            })
                        }
                    }
                }
            })
        }

        return affinities
    },

    // Calculate combined elemental profile from both skills and equipment
    calculateCombinedElementalProfile(character) {
        // Get skill-based elemental skills
        const skillAffinities = characterManager.getAllUnlockedSkillIds(character).filter(skillId =>
            this.elementalAffinities[skillId]
        )

        // Get equipment-based affinities (already calculated)
        const equipmentAffinities = this.getEquipmentAffinities(character)

        // Get equipped item IDs for source display
        const equippedItemIds = []
        if (character.equipped) {
            Object.values(character.equipped).forEach(equippedItem => {
                if (equippedItem) {
                    // Handle both old format (item ID) and new format (full item object)
                    const itemId = typeof equippedItem === 'string' ? equippedItem : equippedItem.id
                    if (itemId && this.equipmentAffinities[itemId]) {
                        equippedItemIds.push(itemId)
                    }
                }
            })
        }

        // Get racial modifiers to check if there are any racial affinities
        const racialModifiers = characterManager ? characterManager.getRacialElementalModifiers(character) : {}
        const hasRacialAffinities = Object.values(racialModifiers).some(modifier => modifier !== 0)

        // Check for status effect affinities
        const statusEffectAffinities = character.statusEffects ? character.statusEffects.filter(effect =>
            effect.id && (effect.id.includes('_resistance') || effect.id.includes('_weakness'))
        ) : []

        // If no affinities exist from any source, return null
        if (skillAffinities.length === 0 && equippedItemIds.length === 0 && !hasRacialAffinities && statusEffectAffinities.length === 0) {
            return null
        }

        const totalModifiers = {}
        const elements = ['fire', 'ice', 'lightning', 'earth', 'water', 'wind', 'light', 'dark', 'poison']
        elements.forEach(element => totalModifiers[element] = 0)

        // Stack modifiers from skills
        skillAffinities.forEach(skillId => {
            const affinity = this.elementalAffinities[skillId]
            if (affinity) {
                if (affinity.resistanceModifiers) {
                    Object.entries(affinity.resistanceModifiers).forEach(([element, modifier]) => {
                        totalModifiers[element] += modifier
                    })
                }
                if (affinity.weaknessModifiers) {
                    Object.entries(affinity.weaknessModifiers).forEach(([element, modifier]) => {
                        totalModifiers[element] += modifier
                    })
                }
            }
        })

        // Add modifiers from equipment (already calculated)
        Object.entries(equipmentAffinities).forEach(([element, modifier]) => {
            if (totalModifiers.hasOwnProperty(element)) {
                totalModifiers[element] += modifier
            }
        })

        // Add racial modifiers (Dragonborn Scaled Hide, Tiefling fire immunity, etc.)
        console.log('Racial modifiers from characterManager:', racialModifiers)
        Object.entries(racialModifiers).forEach(([element, modifier]) => {
            if (totalModifiers.hasOwnProperty(element)) {
                totalModifiers[element] += modifier
                if (modifier !== 0) {
                    console.log(`Added racial modifier: ${element} ${modifier}`)
                }
            }
        })

        // Add status effect modifiers (from elemental resistance/weakness status effects)
        if (character.statusEffects) {
            character.statusEffects.forEach(effect => {
                if (effect.id && (effect.id.includes('_resistance') || effect.id.includes('_weakness'))) {
                    const [element] = effect.id.split('_')
                    if (totalModifiers.hasOwnProperty(element)) {
                        // Use potency value from the effect, with proper sign
                        const potency = effect.potency || 1
                        const modifier = effect.id.includes('_resistance') ? -potency : potency
                        totalModifiers[element] += modifier
                        console.log(`Added status effect modifier: ${element} ${modifier} from ${effect.id} (potency: ${potency})`)
                    }
                }
            })
        }

        console.log('Final combined modifiers:', totalModifiers)
        console.log('Status effect affinities found:', statusEffectAffinities.map(e => e.id))

        // Categorize elements by their modifier levels
        const profile = {
            immunities: [],
            resistances: [],
            minorResistances: [],
            weaknesses: [],
            criticalWeaknesses: [],
            instantKills: [],
            modifiers: totalModifiers,
            sources: {
                skills: skillAffinities,
                equipment: equippedItemIds,
                racial: Object.entries(racialModifiers).filter(([element, modifier]) => modifier !== 0).map(([element, modifier]) => `${character.race || 'unknown'}_${element}`),
                statusEffects: statusEffectAffinities.map(effect => effect.id)
            }
        }

        Object.entries(totalModifiers).forEach(([element, modifier]) => {
            if (modifier <= -3) profile.immunities.push(element)
            else if (modifier === -2) profile.resistances.push(element)
            else if (modifier === -1) profile.minorResistances.push(element)
            else if (modifier === 1) profile.weaknesses.push(element)
            else if (modifier === 2) profile.criticalWeaknesses.push(element)
            else if (modifier >= 3) profile.instantKills.push(element)
        })

        return profile
    }
}

// Make it available globally
if (typeof window !== 'undefined') {
    window.MONSTER_SYSTEM = MONSTER_SYSTEM
}

// Global function for UI to get monster loot items
window.getMonsterLoot = function (character) {
    if (!character || !character.isMonster) return []

    // Get loot item IDs from monster system
    const lootItemIds = MONSTER_SYSTEM.generateLoot(character)

    // Convert IDs to actual item objects
    const lootItems = lootItemIds.map(itemId => {
        const item = findItemById(itemId)
        if (!item) {
            console.warn(`Monster loot item not found: ${itemId}`)
            return null
        }
        return item
    }).filter(item => item !== null)

    return lootItems
}

// For Node.js environments
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MONSTER_SYSTEM
}
