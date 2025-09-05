// Inventory System - Equipment and item management
class InventorySystem {
    constructor(characterManager) {
        this.characterManager = characterManager
    }

    // Add item to character's inventory
    addItem(character, itemId, quantity = 1) {
        const item = findItemById(itemId)
        if (!item) {
            console.error(`Item '${itemId}' not found`)
            return false
        }

        // Initialize inventory if it doesn't exist
        if (!character.inventory) {
            character.inventory = {}
        }

        // Handle both array and object inventory formats
        if (Array.isArray(character.inventory)) {
            // Old array format - check if item is stackable and already exists
            if (item.stackable) {
                const existingItem = character.inventory.find(invItem => invItem.id === itemId)
                if (existingItem) {
                    existingItem.quantity += quantity
                    this.characterManager.saveCharacter(character)
                    return true
                }
            }

            // Add new item to array inventory
            const inventoryItem = {
                ...item,
                quantity: item.stackable ? quantity : 1
            }

            character.inventory.push(inventoryItem)
        } else {
            // New object format - itemId: quantity
            if (character.inventory[itemId]) {
                character.inventory[itemId] += quantity
            } else {
                character.inventory[itemId] = quantity
            }
        }

        this.characterManager.saveCharacter(character)
        return true
    }

    // Remove item from inventory
    removeItem(character, itemId, quantity = 1) {
        // Handle both array and object inventory formats
        if (Array.isArray(character.inventory)) {
            const itemIndex = character.inventory.findIndex(item => item.id === itemId)
            if (itemIndex === -1) return false

            const item = character.inventory[itemIndex]

            if (item.stackable && item.quantity && item.quantity > quantity) {
                item.quantity -= quantity
            } else {
                character.inventory.splice(itemIndex, 1)
            }
        } else {
            // Object format - itemId: quantity
            const currentQuantity = character.inventory[itemId]
            if (!currentQuantity) return false

            if (currentQuantity > quantity) {
                character.inventory[itemId] -= quantity
            } else {
                delete character.inventory[itemId]
            }
        }

        this.characterManager.saveCharacter(character)
        return true
    }

    // Equip an item
    equipItem(character, itemId, targetSlot = null) {
        const item = findItemById(itemId)

        // Check if item is consumable (cannot equip consumables)
        const isConsumable = item && (
            item.type === 'consumable' ||
            (item.type === 'herb' && item.effect) ||
            (item.type === 'food' && item.effect)
        )

        if (!item || isConsumable) {
            console.error('Cannot equip this item')
            return false
        }

        // Check if item is in inventory - handle both array and object formats
        let inventoryItem
        if (Array.isArray(character.inventory)) {
            inventoryItem = character.inventory.find(invItem => invItem.id === itemId)
        } else if (character.inventory && typeof character.inventory === 'object') {
            // Handle object format - check if quantity > 0
            const quantity = character.inventory[itemId]
            inventoryItem = quantity && quantity > 0 ? { id: itemId, quantity: quantity } : null
        }

        if (!inventoryItem) {
            console.error('Item not in inventory')
            return false
        }

        // Handle weapon equipping with dual wield logic
        if (item.type === 'weapon') {
            return this.equipWeapon(character, item, targetSlot)
        }

        // Handle other equipment types (armor, accessory)
        const slot = item.type
        if (character.equipped[slot]) {
            this.unequipItem(character, slot)
        }

        // Equip new item
        character.equipped[slot] = { ...item }

        // Remove item from inventory
        this.removeItem(character, itemId, 1)

        // Apply stat modifiers
        this.applyEquipmentStats(character)

        this.characterManager.saveCharacter(character)
        return true
    }

    // Handle weapon equipping with dual wield support
    equipWeapon(character, item, targetSlot = null) {
        // Check weapon proficiency first
        if (!this.hasWeaponProficiency(character, item.subcategory)) {
            console.error(`Cannot equip ${item.name} - requires ${item.subcategory} proficiency`)
            return false
        }

        const hasDualWield = this.hasDualWieldSkill(character)
        const isDagger = item.subcategory === 'daggers'

        // Determine target slot
        if (!targetSlot) {
            if (!character.equipped.primaryWeapon) {
                targetSlot = 'primaryWeapon'
            } else if (hasDualWield && isDagger && !character.equipped.secondaryWeapon) {
                targetSlot = 'secondaryWeapon'
            } else {
                // Replace primary weapon
                targetSlot = 'primaryWeapon'
            }
        }

        // Check dual wield restrictions
        if (targetSlot === 'secondaryWeapon') {
            if (!hasDualWield) {
                console.error('Cannot equip secondary weapon without dual wield skill')
                return false
            }
            // Allow any weapon in secondary slot, but accuracy penalty will be applied if not both daggers
            // The penalty is handled by the skill bonus system, not here
        }

        // Unequip current item in target slot if any
        if (character.equipped[targetSlot]) {
            this.unequipItem(character, targetSlot)
        }

        // Equip new weapon
        character.equipped[targetSlot] = { ...item }

        // Remove item from inventory
        this.removeItem(character, item.id, 1)

        // Apply stat modifiers
        this.applyEquipmentStats(character)

        this.characterManager.saveCharacter(character)
        return true
    }

    // Check if character has dual wield skill
    hasDualWieldSkill(character) {
        if (!character.unlockedSkills || !character.unlockedSkills.weapons) {
            return false
        }

        // Check if dual_wield skill is unlocked in dagger skills
        return character.unlockedSkills.weapons.dagger &&
            character.unlockedSkills.weapons.dagger.includes('dual_wield')
    }

    // Check if character has weapon proficiency for a specific weapon type
    hasWeaponProficiency(character, weaponSubcategory) {
        if (!character.unlockedSkills || !character.unlockedSkills.weapons) {
            return false
        }

        // Map weapon subcategories to their Tier 0 skill IDs
        const proficiencySkills = {
            'swords': 'sword_beginner',
            'bows': 'bow_beginner',
            'axes': 'axe_beginner',
            'staves': 'staff_beginner',
            'daggers': 'dagger_beginner',
            'polearms': 'polearm_beginner',
            'hammers': 'hammer_beginner'
        }

        const requiredSkill = proficiencySkills[weaponSubcategory]
        if (!requiredSkill) {
            // If no specific proficiency skill is defined, allow equipping
            return true
        }

        // Check if the character has the required Tier 0 skill
        const weaponCategory = this.getWeaponCategory(weaponSubcategory)
        return character.unlockedSkills.weapons[weaponCategory] &&
            character.unlockedSkills.weapons[weaponCategory].includes(requiredSkill)
    }

    // Get weapon category from subcategory
    getWeaponCategory(subcategory) {
        const categoryMap = {
            'swords': 'sword',
            'bows': 'ranged',
            'axes': 'axe',
            'staves': 'staff',
            'daggers': 'dagger',
            'polearms': 'polearm',
            'hammers': 'hammer'
        }
        return categoryMap[subcategory] || subcategory
    }

    // Migrate legacy weapon slot to new dual weapon system
    migrateWeaponSlots(character) {
        if (!character.equipped) {
            character.equipped = {
                primaryWeapon: null,
                secondaryWeapon: null,
                armor: null,
                accessory: null
            }
            return
        }

        // Migrate legacy weapon slot to primaryWeapon
        if (character.equipped.weapon && !character.equipped.primaryWeapon) {
            character.equipped.primaryWeapon = character.equipped.weapon
            delete character.equipped.weapon
        }

        // Ensure all required slots exist
        if (!character.equipped.primaryWeapon) character.equipped.primaryWeapon = null
        if (!character.equipped.secondaryWeapon) character.equipped.secondaryWeapon = null
        if (!character.equipped.armor) character.equipped.armor = null
        if (!character.equipped.accessory) character.equipped.accessory = null

        // Migrate enchantments
        if (!character.equippedEnchantments) {
            character.equippedEnchantments = {
                primaryWeapon: [],
                secondaryWeapon: [],
                armor: [],
                accessory: []
            }
        } else {
            // Migrate legacy weapon enchantments to primaryWeapon
            if (character.equippedEnchantments.weapon && !character.equippedEnchantments.primaryWeapon) {
                character.equippedEnchantments.primaryWeapon = character.equippedEnchantments.weapon
                delete character.equippedEnchantments.weapon
            }

            // Ensure all enchantment slots exist
            if (!character.equippedEnchantments.primaryWeapon) character.equippedEnchantments.primaryWeapon = []
            if (!character.equippedEnchantments.secondaryWeapon) character.equippedEnchantments.secondaryWeapon = []
            if (!character.equippedEnchantments.armor) character.equippedEnchantments.armor = []
            if (!character.equippedEnchantments.accessory) character.equippedEnchantments.accessory = []
        }
    }

    // Unequip an item
    unequipItem(character, slot) {
        if (!character.equipped[slot]) return false

        const equippedItem = character.equipped[slot]

        // Unequip all enchantments from this equipment slot first
        if (character.equippedEnchantments && character.equippedEnchantments[slot]) {
            // Return enchantments to inventory
            character.equippedEnchantments[slot].forEach(enchantmentId => {
                this.addItem(character, enchantmentId, 1)
            })
            character.equippedEnchantments[slot] = []
        }

        // Add the equipment back to inventory
        this.addItem(character, equippedItem.id, 1)

        // Remove equipment
        character.equipped[slot] = null

        // Recalculate stats
        this.applyEquipmentStats(character)

        this.characterManager.saveCharacter(character)
        return true
    }

    // Apply all equipment stat modifiers
    applyEquipmentStats(character) {
        // Migrate weapon slots if needed
        this.migrateWeaponSlots(character)

        // Reset equipment bonuses (stored separately from base stats)
        character.equipmentBonuses = {
            hp: 0,
            stamina: 0,
            strength: 0,
            magicPower: 0,
            speed: 0,
            physicalDefence: 0,
            magicalDefence: 0,
            accuracy: 0
        }

        // Apply equipment special effects as status effects
        this.applyEquipmentSpecialEffects(character)

        // Apply elemental affinities from equipped items
        this.applyEquipmentElementalAffinities(character)

        // Apply bonuses from equipped items
        Object.values(character.equipped).forEach(item => {
            if (item && item.statModifiers) {
                Object.entries(item.statModifiers).forEach(([stat, bonus]) => {
                    if (character.equipmentBonuses.hasOwnProperty(stat)) {
                        character.equipmentBonuses[stat] += bonus
                    }
                })
            }
        })

        // Apply bonuses from equipped enchantments
        if (character.equippedEnchantments) {
            Object.entries(character.equippedEnchantments).forEach(([slot, enchantments]) => {
                if (Array.isArray(enchantments)) {
                    enchantments.forEach(enchantmentId => {
                        const enchantment = this.findEnchantmentById(enchantmentId)
                        if (enchantment && enchantment.statModifiers) {
                            Object.entries(enchantment.statModifiers).forEach(([stat, bonus]) => {
                                if (character.equipmentBonuses.hasOwnProperty(stat)) {
                                    character.equipmentBonuses[stat] += bonus
                                }
                            })
                        }
                    })
                }
            })
        }

        // Update max HP/Stamina if equipment affects them
        if (character.equipmentBonuses.hp !== 0) {
            // Get skill bonuses for HP
            const skillBonuses = window.skillBonusSystem ? window.skillBonusSystem.getAllBonuses(character) : {}
            const skillHpBonus = skillBonuses.hp || 0

            const newMaxHp = Math.max(1, character.stats.hp + character.equipmentBonuses.hp + skillHpBonus)
            const oldMaxHp = character.maxHp
            character.maxHp = newMaxHp

            // When equipment is removed (newMaxHp < oldMaxHp), cap current HP
            if (newMaxHp < oldMaxHp && character.hp > newMaxHp) {
                character.hp = newMaxHp
            }
            // When equipment is added (newMaxHp > oldMaxHp), don't auto-heal
            // Keep current HP as-is, just increase the maximum
        }

        if (character.equipmentBonuses.stamina !== 0) {
            // Get skill bonuses for Stamina
            const skillBonuses = window.skillBonusSystem ? window.skillBonusSystem.getAllBonuses(character) : {}
            const skillStaminaBonus = skillBonuses.stamina || 0

            const newMaxStamina = Math.max(1, character.stats.stamina + character.equipmentBonuses.stamina + skillStaminaBonus)
            const oldMaxStamina = character.maxStamina
            character.maxStamina = newMaxStamina

            // When equipment is removed, cap current stamina
            if (newMaxStamina < oldMaxStamina && character.stamina > newMaxStamina) {
                character.stamina = newMaxStamina
            }
            // When equipment is added, don't auto-restore stamina
        }
    }

    // Get effective stats (base + equipment + status effects)
    getEffectiveStats(character) {
        const base = character.stats
        const equipment = character.equipmentBonuses || {}
        const statusBonuses = this.getStatusEffectBonuses(character)

        // Helper function to safely add stats with bounds checking
        const safeStat = (baseStat, equipBonus, statusBonus) => {
            const total = baseStat + (equipBonus || 0) + (statusBonus || 0)
            // Ensure stats stay within reasonable bounds (-999 to 9999)
            return Math.max(-999, Math.min(9999, total))
        }

        // Calculate base stats
        let stats = {
            hp: safeStat(base.hp, equipment.hp, 0), // HP can't be negative from bonuses
            stamina: safeStat(base.stamina, equipment.stamina, 0),
            strength: safeStat(base.strength, equipment.strength, statusBonuses.strength),
            magicPower: safeStat(base.magicPower, equipment.magicPower, statusBonuses.magicPower),
            speed: safeStat(base.speed, equipment.speed, statusBonuses.speed),
            physicalDefence: safeStat(base.physicalDefence, equipment.physicalDefence, statusBonuses.physicalDefence),
            magicalDefence: safeStat(base.magicalDefence, equipment.magicalDefence, statusBonuses.magicalDefence),
            accuracy: safeStat(base.accuracy, equipment.accuracy, statusBonuses.accuracy)
        }



        return stats
    }

    // Update max HP/Stamina to include all bonuses (equipment + skills)
    updateMaxHPAndStamina(character) {
        // Get all bonuses
        const equipment = character.equipmentBonuses || {}
        const skillBonuses = window.skillBonusSystem ? window.skillBonusSystem.getAllBonuses(character) : {}

        // Calculate new max HP
        const newMaxHp = Math.max(1, character.stats.hp + (equipment.hp || 0) + (skillBonuses.hp || 0))
        const oldMaxHp = character.maxHp
        character.maxHp = newMaxHp

        // Cap current HP if it exceeds new max
        if (character.hp > newMaxHp) {
            character.hp = newMaxHp
        }

        // Calculate new max Stamina
        const newMaxStamina = Math.max(1, character.stats.stamina + (equipment.stamina || 0) + (skillBonuses.stamina || 0))
        const oldMaxStamina = character.maxStamina
        character.maxStamina = newMaxStamina

        // Cap current Stamina if it exceeds new max
        if (character.stamina > newMaxStamina) {
            character.stamina = newMaxStamina
        }

        return { oldMaxHp, newMaxHp, oldMaxStamina, newMaxStamina }
    }

    // Get stat bonuses from status effects
    getStatusEffectBonuses(character) {
        const bonuses = {
            hp: 0, stamina: 0, strength: 0, magicPower: 0,
            speed: 0, physicalDefence: 0, magicalDefence: 0, accuracy: 0
        }

        if (character.statusEffects) {
            character.statusEffects.forEach(effect => {
                if (effect.statModifiers) {
                    Object.entries(effect.statModifiers).forEach(([stat, bonus]) => {
                        if (bonuses.hasOwnProperty(stat)) {
                            bonuses[stat] += bonus
                        }
                    })
                }
            })
        }

        return bonuses
    }

    // Use a consumable item
    getSkillBonuses(character) {
        const bonuses = {
            hp: 0, stamina: 0, strength: 0, magicPower: 0,
            speed: 0, physicalDefence: 0, magicalDefence: 0, accuracy: 0
        }

        if (!character.unlockedSkills) {
            return bonuses
        }

        // Flatten all unlocked skills into a single array
        const allUnlockedSkills = []
        Object.keys(character.unlockedSkills).forEach(category => {
            if (typeof character.unlockedSkills[category] === 'object') {
                Object.keys(character.unlockedSkills[category]).forEach(subcategory => {
                    if (Array.isArray(character.unlockedSkills[category][subcategory])) {
                        allUnlockedSkills.push(...character.unlockedSkills[category][subcategory])
                    }
                })
            }
        })

        console.log('- Flattened skills:', allUnlockedSkills)

        if (!allUnlockedSkills.length) {
            console.log('- No skills in flattened array')
            return bonuses
        }

        // Get all skill data
        const skillsData = window.skillsData
        if (!skillsData) {
            return bonuses
        }

        // Create skill upgrade chains - map skill IDs to their highest upgrade
        const skillUpgradeMap = new Map()
        const allSkills = []

        // Collect all skills from all categories
        Object.keys(skillsData).forEach(category => {
            if (skillsData[category] && typeof skillsData[category] === 'object') {
                Object.keys(skillsData[category]).forEach(subcategory => {
                    if (Array.isArray(skillsData[category][subcategory])) {
                        allSkills.push(...skillsData[category][subcategory])
                    }
                })
            }
        })

        // Build upgrade chains by analyzing prerequisites
        const findSkillUpgrades = (skillId) => {
            return allSkills.filter(skill => {
                if (skill.prerequisites && skill.prerequisites.skills) {
                    return skill.prerequisites.skills.includes(skillId)
                }
                return false
            })
        }

        // For each owned skill, find if it has upgrades that are also owned
        allUnlockedSkills.forEach(ownedSkillId => {
            let highestSkill = ownedSkillId
            let skillsToCheck = [ownedSkillId]
            let checkedSkills = new Set()

            // Follow upgrade chain to find highest version
            while (skillsToCheck.length > 0) {
                const currentSkillId = skillsToCheck.shift()
                if (checkedSkills.has(currentSkillId)) continue
                checkedSkills.add(currentSkillId)

                const upgrades = findSkillUpgrades(currentSkillId)
                upgrades.forEach(upgrade => {
                    if (allUnlockedSkills.includes(upgrade.id)) {
                        highestSkill = upgrade.id
                        skillsToCheck.push(upgrade.id)
                    }
                })
            }

            skillUpgradeMap.set(ownedSkillId, highestSkill)
        })

        // Apply bonuses only from the highest version of each skill chain
        const appliedSkills = new Set()
        allUnlockedSkills.forEach(skillId => {
            const highestVersion = skillUpgradeMap.get(skillId)

            // Only apply if this is the highest version and we haven't applied it yet
            if (highestVersion === skillId && !appliedSkills.has(skillId)) {
                appliedSkills.add(skillId)
                console.log('- Applying bonuses for skill:', skillId)
                this.applySkillStatBonuses(skillId, bonuses, allSkills)
            }
        })

        console.log('- Final bonuses:', bonuses)
        return bonuses
    }

    // Apply stat bonuses from a specific skill
    applySkillStatBonuses(skillId, bonuses, allSkills) {
        const skill = allSkills.find(s => s.id === skillId)

        if (!skill || !skill.desc) {
            return
        }

        // Parse stat bonuses from skill descriptions
        const desc = skill.desc.toLowerCase()

        // Physical Defence bonuses: "+X Physical Defence"
        const physDefMatch = desc.match(/\+(\d+)\s*physical\s*defence/)
        if (physDefMatch) {
            const bonus = parseInt(physDefMatch[1])
            bonuses.physicalDefence += bonus
        }

        // Magical Defence bonuses: "+X Magical Defence"  
        const magDefMatch = desc.match(/\+(\d+)\s*magical\s*defence/)
        if (magDefMatch) {
            bonuses.magicalDefence += parseInt(magDefMatch[1])
        }

        // Strength bonuses: "+X Strength"
        const strMatch = desc.match(/\+(\d+)\s*strength/)
        if (strMatch) {
            bonuses.strength += parseInt(strMatch[1])
        }

        // Speed bonuses: "+X Speed"
        const speedMatch = desc.match(/\+(\d+)\s*speed/)
        if (speedMatch) {
            bonuses.speed += parseInt(speedMatch[1])
        }

        // Magic Power bonuses: "+X Magic Power" or "+X Magical Power"
        const magPowerMatch = desc.match(/\+(\d+)\s*(?:magic|magical)\s*power/)
        if (magPowerMatch) {
            bonuses.magicPower += parseInt(magPowerMatch[1])
        }

        // HP bonuses: "+X HP" or "+X Health"
        const hpMatch = desc.match(/\+(\d+)\s*(?:hp|health)/)
        if (hpMatch) {
            bonuses.hp += parseInt(hpMatch[1])
        }

        // Stamina bonuses: "+X Stamina"
        const staminaMatch = desc.match(/\+(\d+)\s*stamina/)
        if (staminaMatch) {
            bonuses.stamina += parseInt(staminaMatch[1])
        }
    }

    // Use a consumable item
    useConsumable(character, itemId) {
        const item = findItemById(itemId)

        // Check if item is consumable (consumable type OR herb/food with effects)
        const isConsumable = item && (
            item.type === 'consumable' ||
            (item.type === 'herb' && item.effect) ||
            (item.type === 'food' && item.effect)
        )

        if (!isConsumable) {
            console.error('Item is not consumable')
            return false
        }

        // Handle both array and object inventory formats
        let inventoryItem
        if (Array.isArray(character.inventory)) {
            inventoryItem = character.inventory.find(invItem => invItem.id === itemId)
        } else {
            // Handle object format - check if quantity > 0
            const quantity = character.inventory[itemId]
            inventoryItem = quantity && quantity > 0 ? { id: itemId, quantity: quantity } : null
        }

        if (!inventoryItem) {
            console.error('Item not in inventory')
            return false
        }

        // Apply consumable effects
        this.applyConsumableEffects(character, item)

        // Remove item from inventory
        this.removeItem(character, itemId, 1)

        return true
    }

    // Apply effects from consumable items
    applyConsumableEffects(character, item) {
        if (!item.effect) {
            console.warn('Item has no effect property:', item.name)
            return
        }

        const effect = item.effect

        if (effect.type === 'heal') {
            character.hp = Math.min(character.maxHp, character.hp + effect.amount)
            console.log(`Healed ${effect.amount} HP. Current HP: ${character.hp}`)
        } else if (effect.type === 'restore_mana') {
            character.mp = Math.min(character.maxMp, character.mp + effect.amount)
            console.log(`Restored ${effect.amount} MP. Current MP: ${character.mp}`)
        } else if (effect.type === 'restore_stamina') {
            character.stamina = Math.min(character.maxStamina, character.stamina + effect.amount)
            console.log(`Restored ${effect.amount} stamina. Current stamina: ${character.stamina}`)
        } else if (effect.type === 'health_regen') {
            this.addStatusEffect(character, 'health_regen', effect.duration || 60, effect.amount)
            console.log(`Applied health regeneration: ${effect.amount}/sec for ${effect.duration || 60} seconds`)
        } else if (effect.type === 'full_heal_and_cleanse') {
            character.hp = character.maxHp
            character.mp = character.maxMp || 0
            character.stamina = character.maxStamina
            // Remove all negative status effects
            character.statusEffects = character.statusEffects.filter(eff =>
                !['poison', 'bleeding', 'curse', 'weakness'].includes(eff.type))
            console.log('Full heal and cleanse applied')
        } else if (effect.type === 'temp_strength') {
            const amount = effect.amount || 5
            const duration = effect.duration || 300
            this.addStatusEffect(character, 'strength_boost', duration, amount)
            console.log(`Applied temporary strength boost: +${amount} for ${duration} seconds`)
        } else if (effect.type === 'temp_magic') {
            const amount = effect.amount || 3
            const duration = effect.duration || 240
            this.addStatusEffect(character, 'magic_boost', duration, amount)
            console.log(`Applied temporary magic boost: +${amount} for ${duration} seconds`)
        } else if (effect.type === 'temp_speed') {
            const amount = effect.amount || 2
            const duration = effect.duration || 180
            this.addStatusEffect(character, 'speed_boost', duration, amount)
            console.log(`Applied temporary speed boost: +${amount} for ${duration} seconds`)
        } else if (effect.type === 'stat_boost') {
            // Handle stat boost effects from herbs
            const duration = effect.duration || 1800
            if (effect.stats) {
                Object.entries(effect.stats).forEach(([stat, amount]) => {
                    if (stat === 'speed') {
                        this.addStatusEffect(character, 'speed_boost', duration, amount)
                    } else if (stat === 'strength') {
                        this.addStatusEffect(character, 'strength_boost', duration, amount)
                    } else if (stat === 'physicalDefence') {
                        this.addStatusEffect(character, 'physdef_boost', duration, amount)
                    } else if (stat === 'magicalDefence') {
                        this.addStatusEffect(character, 'magdef_boost', duration, amount)
                    } else if (stat === 'hp') {
                        character.maxHp += amount
                        character.hp += amount
                    }
                })
                console.log(`Applied stat boosts: ${Object.entries(effect.stats).map(([stat, amount]) => `+${amount} ${stat}`).join(', ')} for ${duration} seconds`)
            }
        } else if (effect.type === 'stat_food') {
            // Handle food effects
            const duration = effect.duration || 3600
            if (effect.stats) {
                Object.entries(effect.stats).forEach(([stat, amount]) => {
                    if (stat === 'hp') {
                        character.maxHp += amount
                        character.hp += amount
                    } else if (stat === 'stamina') {
                        character.stamina = Math.min(character.maxStamina, character.stamina + amount)
                    } else if (stat === 'strength') {
                        this.addStatusEffect(character, 'strength_boost', duration, amount)
                    } else if (stat === 'speed') {
                        this.addStatusEffect(character, 'speed_boost', duration, amount)
                    }
                })
                console.log(`Applied food effects: ${Object.entries(effect.stats).map(([stat, amount]) => `+${amount} ${stat}`).join(', ')} for ${duration} seconds`)
            }
        } else if (effect.type === 'cure_poison') {
            // Remove poison effects
            if (character.statusEffects) {
                character.statusEffects = character.statusEffects.filter(eff => eff.type !== 'poison')
            }
            console.log(`Cured poison effects`)
        } else if (effect.type === 'stealth_boost') {
            // Use existing stealth mastery effect
            this.addStatusEffect(character, 'stealth_mastery', effect.duration || 600, 1)
            console.log(`Applied stealth boost for ${effect.duration || 600} seconds`)
        } else if (effect.type === 'magical_barrier') {
            // For now, just log the effect since magical barrier doesn't exist
            console.log(`Applied magical barrier: ${effect.amount || 30} damage absorption for ${effect.duration || 480} seconds`)
        } else if (effect.type === 'magical_shield') {
            // For now, just log the effect since magical shield doesn't exist
            console.log(`Applied magical shield: ${effect.amount || 40} damage absorption for ${effect.duration || 2400} seconds`)
        } else if (effect.type === 'elemental_weapon') {
            // For now, just log the effect since elemental weapon doesn't exist
            console.log(`Applied elemental weapon enchantment for ${effect.duration || 3600} seconds`)
        } else {
            console.warn('Unknown effect type:', effect.type)
        }

        this.characterManager.saveCharacter(character)
    }

    // Add status effect to character
    addStatusEffect(character, effectId, duration = null, potency = null, source = null) {
        const effect = createStatusEffect(effectId, duration, potency)
        if (!effect) return false

        if (!character.statusEffects) {
            character.statusEffects = []
        }

        // Check if effect is stackable
        if (!effect.stackable) {
            // Remove existing effect of same type
            character.statusEffects = character.statusEffects.filter(e => e.id !== effectId)
        }

        // Set source if provided
        if (source) {
            effect.source = source
        }

        character.statusEffects.push(effect)
        // Don't call applyEquipmentStats here to avoid infinite recursion
        // Only recalculate if this effect has stat modifiers
        if (effect.statModifiers) {
            this.characterManager.saveCharacter(character)
        } else {
            this.characterManager.saveCharacter(character)
        }
        return true
    }

    // Process status effects (called at turn start)
    processStatusEffects(character) {
        if (!character.statusEffects) return

        character.statusEffects.forEach(effect => {
            // Apply effect based on type
            switch (effect.type) {
                case 'damageOverTime':
                    character.hp = Math.max(0, character.hp - effect.potency)
                    break
                case 'healOverTime':
                    character.hp = Math.min(character.maxHp, character.hp + effect.potency)
                    break
                // Other effect types handled by stat modifiers
            }

            // Reduce duration
            effect.duration--
        })

        // Remove expired effects
        this.removeExpiredEffects(character)
        this.characterManager.saveCharacter(character)
    }

    // Remove expired status effects
    removeExpiredEffects(character) {
        if (!character.statusEffects) return

        const initialCount = character.statusEffects.length
        character.statusEffects = character.statusEffects.filter(effect => effect.duration > 0)

        // If effects were removed, recalculate stats
        if (character.statusEffects.length !== initialCount) {
            this.applyEquipmentStats(character)
        }
    }

    // Get inventory summary
    getInventorySummary(character) {
        const summary = {
            totalItems: character.inventory.length,
            byType: {},
            totalValue: 0
        }

        character.inventory.forEach(item => {
            summary.byType[item.type] = (summary.byType[item.type] || 0) + (item.quantity || 1)
            summary.totalValue += item.value * (item.quantity || 1)
        })

        return summary
    }

    // ========== ENCHANTMENT SYSTEM ==========

    // Find enchantment by ID
    findEnchantmentById(enchantmentId) {
        if (typeof ENCHANTMENTS_DATA !== 'undefined') {
            // Check weapons enchantments
            if (ENCHANTMENTS_DATA.weapons && ENCHANTMENTS_DATA.weapons[enchantmentId]) {
                return ENCHANTMENTS_DATA.weapons[enchantmentId]
            }
            // Check armor enchantments
            if (ENCHANTMENTS_DATA.armor && ENCHANTMENTS_DATA.armor[enchantmentId]) {
                return ENCHANTMENTS_DATA.armor[enchantmentId]
            }
        }



        return null
    }

    // Equip an enchantment to a weapon or armor
    equipEnchantment(character, enchantmentId, equipmentSlot) {
        const enchantment = this.findEnchantmentById(enchantmentId)
        if (!enchantment) {
            console.error(`Enchantment '${enchantmentId}' not found`)
            return false
        }

        // Check if equipment slot has an item equipped
        if (!character.equipped[equipmentSlot]) {
            console.error(`No ${equipmentSlot} equipped to enchant`)
            return false
        }

        const equippedItem = character.equipped[equipmentSlot]

        // Check if equipment has enchantment slots available
        const maxSlots = equippedItem.enchantmentSlots || 0
        if (maxSlots === 0) {
            console.error(`${equippedItem.name} has no enchantment slots`)
            return false
        }

        // Initialize enchantments array if needed
        if (!character.equippedEnchantments) {
            character.equippedEnchantments = { primaryWeapon: [], secondaryWeapon: [], armor: [], accessory: [] }
        }
        if (!character.equippedEnchantments[equipmentSlot]) {
            character.equippedEnchantments[equipmentSlot] = []
        }

        const currentEnchantments = character.equippedEnchantments[equipmentSlot]

        // Check if already at maximum enchantments
        if (currentEnchantments.length >= maxSlots) {
            console.error(`${equippedItem.name} has all enchantment slots filled`)
            return false
        }

        // Check if character has the enchantment in inventory
        let hasEnchantment = false
        if (Array.isArray(character.inventory)) {
            hasEnchantment = character.inventory.some(item => item.id === enchantmentId)
        } else if (character.inventory && typeof character.inventory === 'object') {
            hasEnchantment = !!(character.inventory[enchantmentId] && character.inventory[enchantmentId] > 0)
        }

        if (!hasEnchantment) {
            console.error('Enchantment not in inventory')
            return false
        }

        // Apply the enchantment
        currentEnchantments.push(enchantmentId)

        // Remove enchantment from inventory
        this.removeItem(character, enchantmentId, 1)

        // Recalculate stats
        this.applyEquipmentStats(character)

        this.characterManager.saveCharacter(character)
        return true
    }

    // Unequip an enchantment from a weapon or armor
    unequipEnchantment(character, enchantmentId, equipmentSlot) {
        if (!character.equippedEnchantments || !character.equippedEnchantments[equipmentSlot]) {
            return false
        }

        const currentEnchantments = character.equippedEnchantments[equipmentSlot]
        const enchantmentIndex = currentEnchantments.indexOf(enchantmentId)

        if (enchantmentIndex === -1) {
            return false
        }

        // Remove enchantment from equipment
        currentEnchantments.splice(enchantmentIndex, 1)

        // Add enchantment back to inventory
        this.addItem(character, enchantmentId, 1)

        // Recalculate stats
        this.applyEquipmentStats(character)

        this.characterManager.saveCharacter(character)
        return true
    }

    // Get available enchantment slots for an equipment piece
    getAvailableEnchantmentSlots(character, equipmentSlot) {
        if (!character.equipped[equipmentSlot]) {
            return 0
        }

        const maxSlots = character.equipped[equipmentSlot].enchantmentSlots || 0
        const usedSlots = (character.equippedEnchantments && character.equippedEnchantments[equipmentSlot])
            ? character.equippedEnchantments[equipmentSlot].length
            : 0

        return Math.max(0, maxSlots - usedSlots)
    }

    // ========== TESTING/DEBUG FUNCTIONS ==========

    // Add test enchantments to character inventory (for testing) - legacy method
    addTestEnchantments(character) {
        // Add some basic enchantments for testing
        const testEnchantments = [
            'sharpness',      // Weapon: +1 Strength
            'magic_weapon',   // Weapon: +1 Magic Power
            'flaming',        // Weapon: +2 Strength, burn effect
            'protection',     // Armor: +1 Physical Defence
            'magic_resistance', // Armor: +1 Magical Defence
            'vitality'        // Armor: +5 HP
        ]

        testEnchantments.forEach(enchantmentId => {
            this.addItem(character, enchantmentId, 1)
        })

        console.log('Added test enchantments to character inventory')
        return true
    }

    // Apply equipment special effects as status effects
    applyEquipmentSpecialEffects(character) {
        if (!character.equipped) {
            return
        }

        // Remove any existing equipment-based status effects
        if (character.statusEffects) {
            character.statusEffects = character.statusEffects.filter(effect =>
                !effect.source || !effect.source.includes('equipment')
            )
        }

        // Process all equipped items
        Object.entries(character.equipped).forEach(([slot, item]) => {
            if (!item || !item.specialEffects || !Array.isArray(item.specialEffects)) {
                return
            }

            // Skip items with elemental choice effects - these are handled by the elemental selection system
            if (this.hasElementalChoiceEffect(item)) {
                console.log(`Skipping elemental choice effects for ${item.name} - handled by elemental selection system`)
                return
            }

            // Map special effects to status effects
            item.specialEffects.forEach(specialEffect => {
                const statusEffect = this.mapSpecialEffectToStatusEffect(specialEffect)
                if (statusEffect) {
                    this.addStatusEffect(character, statusEffect.id, statusEffect.duration, statusEffect.potency, ['equipment', slot])
                    console.log(`Applied ${statusEffect.id} from ${item.name} (${slot})`)
                } else {
                    console.log(`No status effect mapping found for: ${specialEffect} from ${item.name}`)
                }
            })
        })
    }

    // Apply elemental affinities from equipped items
    applyEquipmentElementalAffinities(character) {
        // Remove any existing elemental status effects from equipment (both affinity and choice)
        if (character.statusEffects) {
            character.statusEffects = character.statusEffects.filter(effect => {
                if (effect.source && effect.source.includes('equipment') &&
                    (effect.source.includes('elemental_affinity') || effect.source.includes('elemental_choice'))) {
                    return false
                }
                return true
            })
        }

        // Track accumulated elemental modifiers from all equipment
        const accumulatedModifiers = {
            resistances: {},
            weaknesses: {}
        }

        // Collect all elemental modifiers from equipped items
        Object.entries(character.equipped).forEach(([slot, item]) => {
            if (item && item.elementalAffinities) {
                const affinities = item.elementalAffinities

                // Accumulate resistances
                if (affinities.resistances) {
                    Object.entries(affinities.resistances).forEach(([element, modifier]) => {
                        if (!accumulatedModifiers.resistances[element]) {
                            accumulatedModifiers.resistances[element] = 0
                        }
                        accumulatedModifiers.resistances[element] += modifier
                    })
                }

                // Accumulate weaknesses
                if (affinities.weaknesses) {
                    Object.entries(affinities.weaknesses).forEach(([element, modifier]) => {
                        if (!accumulatedModifiers.weaknesses[element]) {
                            accumulatedModifiers.weaknesses[element] = 0
                        }
                        accumulatedModifiers.weaknesses[element] += modifier
                    })
                }
            }
        })

        // Apply accumulated resistances
        Object.entries(accumulatedModifiers.resistances).forEach(([element, totalModifier]) => {
            const resistanceEffectId = `${element}_resistance`
            console.log(`Applying accumulated elemental resistance: ${resistanceEffectId} with potency ${Math.abs(totalModifier)}`)
            this.addStatusEffect(character, resistanceEffectId, 999, Math.abs(totalModifier), ['equipment', 'accumulated', 'elemental_affinity'])
        })

        // Apply accumulated weaknesses
        Object.entries(accumulatedModifiers.weaknesses).forEach(([element, totalModifier]) => {
            const weaknessEffectId = `${element}_weakness`
            console.log(`Applying accumulated elemental weakness: ${weaknessEffectId} with potency ${totalModifier}`)
            this.addStatusEffect(character, weaknessEffectId, 999, totalModifier, ['equipment', 'accumulated', 'elemental_affinity'])
        })

        // Reapply elemental choice effects if they exist (these are handled separately)
        Object.entries(character.equipped).forEach(([slot, item]) => {
            if (item && item.elementalChoice) {
                this.reapplyElementalChoiceEffects(character, item, slot)
            }
        })
    }

    // Reapply elemental choice effects for items that have previously made choices
    reapplyElementalChoiceEffects(character, item, slot) {
        const choice = item.elementalChoice
        if (!choice) return

        // Define opposing elements
        const opposingElements = {
            fire: 'water',
            water: 'fire',
            ice: 'lightning',
            lightning: 'earth',
            earth: 'wind',
            wind: 'lightning',
            light: 'dark',
            dark: 'light'
        }

        // Check if this is an immunity item or dual elemental mastery item
        const isImmunityItem = item.specialEffects && item.specialEffects.some(effect =>
            effect.toString().toLowerCase().includes('immunity') ||
            effect.toString().toLowerCase().includes('choose 1 element for immunity')
        )
        const isDualElementalItem = item.specialEffects && item.specialEffects.some(effect =>
            effect.toString().toLowerCase().includes('dual elemental mastery')
        )

        if (isDualElementalItem && choice.immunity && choice.resistance) {
            // Reapply dual elemental mastery effects
            const immunityElement = choice.immunity
            const resistanceElement = choice.resistance

            // Apply immunity (-3) to chosen immunity element
            const immunityEffectId = `${immunityElement}_resistance`
            console.log(`Reapplying elemental immunity: ${immunityEffectId} from ${item.name} (${slot})`)
            this.addStatusEffect(character, immunityEffectId, 999, 3, ['equipment', slot, 'elemental_choice'])

            // Apply resistance (-1) to chosen resistance element
            const resistanceEffectId = `${resistanceElement}_resistance`
            console.log(`Reapplying elemental resistance: ${resistanceEffectId} from ${item.name} (${slot})`)
            this.addStatusEffect(character, resistanceEffectId, 999, 1, ['equipment', slot, 'elemental_choice'])

            // Apply weaknesses to opposing elements
            const immunityOpposing = opposingElements[immunityElement]
            const resistanceOpposing = opposingElements[resistanceElement]

            // Apply +2 weakness to immunity element's opposing element
            const immunityWeaknessEffectId = `${immunityOpposing}_weakness`
            console.log(`Reapplying elemental weakness: ${immunityWeaknessEffectId} (+2) from ${item.name} (${slot})`)
            this.addStatusEffect(character, immunityWeaknessEffectId, 999, 2, ['equipment', slot, 'elemental_choice'])

            // Apply +1 weakness to resistance element's opposing element (if different)
            if (resistanceOpposing !== immunityOpposing) {
                const resistanceWeaknessEffectId = `${resistanceOpposing}_weakness`
                console.log(`Reapplying elemental weakness: ${resistanceWeaknessEffectId} (+1) from ${item.name} (${slot})`)
                this.addStatusEffect(character, resistanceWeaknessEffectId, 999, 1, ['equipment', slot, 'elemental_choice'])
            }

        } else if (isImmunityItem && choice.resistance) {
            // Reapply immunity effects (single choice)
            const element = choice.resistance
            const opposingElement = opposingElements[element]

            // Apply immunity (-3) to chosen element
            const resistanceEffectId = `${element}_resistance`
            console.log(`Reapplying elemental immunity: ${resistanceEffectId} from ${item.name} (${slot})`)
            this.addStatusEffect(character, resistanceEffectId, 999, 3, ['equipment', slot, 'elemental_choice'])

            // Apply weaknesses
            const secondWeakness = this.getSecondWeakness(element)

            // Apply +2 weakness to opposing element
            const opposingWeaknessEffectId = `${opposingElement}_weakness`
            console.log(`Reapplying elemental weakness: ${opposingWeaknessEffectId} (+2) from ${item.name} (${slot})`)
            this.addStatusEffect(character, opposingWeaknessEffectId, 999, 2, ['equipment', slot, 'elemental_choice'])

            // Apply +1 weakness to second element
            const secondWeaknessEffectId = `${secondWeakness}_weakness`
            console.log(`Reapplying elemental weakness: ${secondWeaknessEffectId} (+1) from ${item.name} (${slot})`)
            this.addStatusEffect(character, secondWeaknessEffectId, 999, 1, ['equipment', slot, 'elemental_choice'])

        } else if (choice.resistance) {
            // Reapply regular resistance effects (single choice)
            const element = choice.resistance
            const opposingElement = opposingElements[element]

            // Apply resistance (-1) to chosen element
            const resistanceEffectId = `${element}_resistance`
            console.log(`Reapplying elemental resistance: ${resistanceEffectId} from ${item.name} (${slot})`)
            this.addStatusEffect(character, resistanceEffectId, 999, 1, ['equipment', slot, 'elemental_choice'])

            // Apply weakness to opposing element
            const weaknessEffectId = `${opposingElement}_weakness`
            console.log(`Reapplying elemental weakness: ${weaknessEffectId} from ${item.name} (${slot})`)
            this.addStatusEffect(character, weaknessEffectId, 999, 1, ['equipment', slot, 'elemental_choice'])
        }
    }

    // Map weapon special effects to existing status effects
    mapSpecialEffectToStatusEffect(specialEffect) {
        const effectMap = {
            // Damage over time effects
            'burn_on_hit': { id: 'burn', duration: 4, potency: 1 },
            'bleed_on_hit': { id: 'bleed', duration: 3, potency: 1 },
            'poison_breath': { id: 'poison', duration: 3, potency: 1 },
            'burn_chance': { id: 'burn', duration: 4, potency: 1 },
            'bleed_chance': { id: 'bleed', duration: 3, potency: 1 },

            // Control effects
            'immobilize_on_hit': { id: 'immobilized', duration: 3, potency: 0 },
            'blinding_flash': { id: 'incapacitated', duration: 2, potency: 0 },
            'blinding_cut': { id: 'incapacitated', duration: 2, potency: 0 },

            // Stat buffs
            'enhanced': { id: 'enhanced', duration: 8, potency: 3 },
            'empowered': { id: 'empowered', duration: 6, potency: 4 },
            'rally': { id: 'enhanced', duration: 8, potency: 3 },
            'natures_grace': { id: 'enhanced', duration: 8, potency: 3 },

            // Protection effects
            'protected': { id: 'protected', duration: 6, potency: 3 },
            'spell_warded': { id: 'spell_warded', duration: 8, potency: 0 },

            // Special effects
            'stealth_mastery': { id: 'stealth_mastery', duration: 5, potency: 0 },
            'vanish': { id: 'stealth_mastery', duration: 5, potency: 0 },
            'shadowing': { id: 'stealth_mastery', duration: 5, potency: 0 },
            'silent_strike': { id: 'stealth_mastery', duration: 5, potency: 0 },

            // Healing effects
            'regeneration': { id: 'regeneration', duration: 5, potency: 2 },
            'life_drain': { id: 'regeneration', duration: 5, potency: 2 },
            'life_steal': { id: 'regeneration', duration: 5, potency: 2 },
            'stamina_leech': { id: 'regeneration', duration: 5, potency: 2 },
            'stamina_drain': { id: 'regeneration', duration: 5, potency: 2 },

            // Weapon enchantment
            'weapon_enchanted': { id: 'weapon_enchanted', duration: 10, potency: 6 },
            'fire_breath': { id: 'weapon_enchanted', duration: 10, potency: 6 },
            'ice_shards': { id: 'weapon_enchanted', duration: 10, potency: 6 },
            'holy_smite': { id: 'weapon_enchanted', duration: 10, potency: 6 },
            'starfall': { id: 'weapon_enchanted', duration: 10, potency: 6 },
            'genesis_wave': { id: 'weapon_enchanted', duration: 10, potency: 6 },
            'double_strike': { id: 'weapon_enchanted', duration: 10, potency: 6 },
            'star_strike': { id: 'weapon_enchanted', duration: 10, potency: 6 },
            'time_slice': { id: 'weapon_enchanted', duration: 10, potency: 6 },
            'reality_cut': { id: 'weapon_enchanted', duration: 10, potency: 6 },
            'precision_strike': { id: 'weapon_enchanted', duration: 10, potency: 6 },
            'enshadowed_pierce': { id: 'weapon_enchanted', duration: 10, potency: 6 },

            // Aura effects
            'intimidating_aura': { id: 'intimidating_aura', duration: 999, potency: 2 },
            'toxic_presence': { id: 'toxic_presence', duration: 999, potency: 1 },

            // Undead specific
            'undead_bane': { id: 'weapon_enchanted', duration: 10, potency: 6 },

            // Phoenix armor effects
            'auto_healing': { id: 'regeneration', duration: 999, potency: 2 },
            'damage_reduction': { id: 'protected', duration: 999, potency: 3 },
            'critical_immunity': { id: 'protected', duration: 999, potency: 3 },

            // Elemental attunement - this is handled by the elemental selection system
            'elemental_attunement': null, // Skip this, it's handled by the modal
            'dual_elemental_mastery': null, // Skip this, it's handled by the modal

            // Elemental mastery effects - these are handled by elementalAffinities
            'fire_mastery': null, // Skip this, it's handled by elementalAffinities
            'ice_mastery': null, // Skip this, it's handled by elementalAffinities
            'lightning_mastery': null, // Skip this, it's handled by elementalAffinities
            'earth_mastery': null, // Skip this, it's handled by elementalAffinities
            'void_mastery': null, // Skip this, it's handled by elementalAffinities
            'fire_enchantment': null, // Skip this, it's handled by elementalAffinities
            'lightning_enchantment': null, // Skip this, it's handled by elementalAffinities
        }

        // Extract the effect name from the special effect string
        let effectName = specialEffect
        if (typeof specialEffect === 'string') {
            // Handle cases where special effect is just the name
            effectName = specialEffect
        } else if (specialEffect.includes('(')) {
            // Handle cases like "burn_on_hit (10% chance to apply Burn)" or "Elemental Attunement (Choose 1 element for resistance)"
            effectName = specialEffect.split('(')[0].trim().toLowerCase().replace(/\s+/g, '_')
        }

        // Skip null mappings (like elemental_attunement)
        if (effectMap[effectName] === null) {
            return null
        }

        return effectMap[effectName] || null
    }

    // Elemental selection system
    showElementalSelectionDialog(itemId, slot) {
        const character = this.characterManager.getCurrentCharacter()
        if (!character) return

        const item = character.equipped[slot]
        if (!item) return

        // Create modal dialog
        const modal = document.createElement('div')
        modal.className = 'modal-overlay'

        // Check if this is an immunity item or dual elemental mastery item
        const isImmunityItem = item.specialEffects && item.specialEffects.some(effect =>
            effect.toString().toLowerCase().includes('immunity') ||
            effect.toString().toLowerCase().includes('choose 1 element for immunity')
        )
        const isDualElementalItem = item.specialEffects && item.specialEffects.some(effect =>
            effect.toString().toLowerCase().includes('dual elemental mastery')
        )

        let title, description
        if (isDualElementalItem) {
            title = 'Choose Dual Elemental Mastery for'
            description = 'Select one element for immunity and one element for resistance. You will gain weaknesses to opposing elements.'
        } else if (isImmunityItem) {
            title = 'Choose Elemental Immunity for'
            description = 'Select one element to gain immunity to. You will automatically gain weaknesses to opposing and related elements.'
        } else {
            title = 'Choose Elemental Resistance for'
            description = 'Select one element to gain resistance to. You will automatically gain weakness to its opposing element.'
        }

        modal.innerHTML = `
            <div class="modal-content">
                <h3>${title} ${item.name}</h3>
                <p>${description}</p>
                
                <div class="elemental-grid">
                    <button class="element-btn" data-element="fire" data-icon="🔥" title="${isImmunityItem ? 'Fire Immunity + Water/Ice Weakness' : 'Fire Resistance + Water Weakness'}">Fire</button>
                    <button class="element-btn" data-element="ice" data-icon="❄️" title="${isImmunityItem ? 'Ice Immunity + Lightning/Fire Weakness' : 'Ice Resistance + Lightning Weakness'}">Ice</button>
                    <button class="element-btn" data-element="lightning" data-icon="⚡" title="${isImmunityItem ? 'Lightning Immunity + Earth/Lightning Weakness' : 'Lightning Resistance + Earth Weakness'}">Lightning</button>
                    <button class="element-btn" data-element="water" data-icon="💧" title="${isImmunityItem ? 'Water Immunity + Fire/Wind Weakness' : 'Water Resistance + Fire Weakness'}">Water</button>
                    <button class="element-btn" data-element="earth" data-icon="🌍" title="${isImmunityItem ? 'Earth Immunity + Wind/Lightning Weakness' : 'Earth Resistance + Wind Weakness'}">Earth</button>
                    <button class="element-btn" data-element="wind" data-icon="🌪️" title="${isImmunityItem ? 'Wind Immunity + Lightning/Water Weakness' : 'Wind Resistance + Lightning Weakness'}">Wind</button>
                    <button class="element-btn" data-element="light" data-icon="☀️" title="${isImmunityItem ? 'Light Immunity + Dark/Light Weakness' : 'Light Resistance + Dark Weakness'}">Light</button>
                    <button class="element-btn" data-element="darkness" data-icon="🌑" title="${isImmunityItem ? 'Darkness Immunity + Light/Darkness Weakness' : 'Darkness Resistance + Light Weakness'}">Darkness</button>
                </div>
                
                <div class="modal-buttons">
                    <button class="btn btn-secondary" onclick="this.closest('.modal-overlay').remove()">Cancel</button>
                </div>
            </div>
        `

        // Add event listeners to element buttons
        modal.querySelectorAll('.element-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const element = btn.dataset.element
                this.applyElementalEffect(character, itemId, slot, element)
                modal.remove()
            })
        })

        // Add styles
        const style = document.createElement('style')
        style.textContent = `
            .modal-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.7);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 1000;
            }
            .modal-content {
                background: #1a1a2e;
                border: 2px solid #16213e;
                border-radius: 10px;
                padding: 20px;
                max-width: 500px;
                color: white;
            }
            .elemental-grid {
                display: grid;
                grid-template-columns: repeat(4, 1fr);
                gap: 10px;
                margin: 20px 0;
            }
            .element-btn {
                padding: 15px;
                border: 2px solid #0f3460;
                background: #16213e;
                color: white;
                border-radius: 8px;
                cursor: pointer;
                transition: all 0.3s;
                font-size: 16px;
            }
            .element-btn:hover {
                background: #0f3460;
                border-color: #e94560;
                transform: translateY(-2px);
            }
            .modal-buttons {
                text-align: center;
                margin-top: 20px;
            }
            .elemental-btn {
                background: #16213e;
                border: 2px solid #0f3460;
                color: white;
                padding: 8px 12px;
                border-radius: 6px;
                cursor: pointer;
                font-size: 12px;
                margin: 5px 0;
                transition: all 0.3s;
                display: flex;
                align-items: center;
                gap: 5px;
            }
            .elemental-btn:hover {
                background: #0f3460;
                border-color: #e94560;
                transform: translateY(-1px);
            }
            .elemental-btn.chosen.resistance {
                background: #28a745;
                border-color: #28a745;
                font-weight: bold;
            }
            .elemental-btn.chosen.resistance:hover {
                background: #218838;
            }
            .elemental-btn.chosen.weakness {
                background: #dc3545;
                border-color: #dc3545;
                font-weight: bold;
            }
            .elemental-btn.chosen.weakness:hover {
                background: #c82333;
            }

        `
        document.head.appendChild(style)

        document.body.appendChild(modal)
    }

    // Apply elemental effect to character
    applyElementalEffect(character, itemId, slot, element) {
        // Define opposing elements
        const opposingElements = {
            fire: 'water',
            water: 'fire',
            ice: 'lightning',
            lightning: 'earth',
            earth: 'wind',
            wind: 'lightning',
            light: 'dark',
            dark: 'light'
        }

        const opposingElement = opposingElements[element]
        if (!opposingElement) {
            console.error(`No opposing element found for ${element}`)
            return
        }

        // Remove any existing elemental effects from this equipment
        if (character.statusEffects) {
            character.statusEffects = character.statusEffects.filter(effect => {
                if (effect.source && effect.source.includes('equipment') && effect.source.includes(slot)) {
                    return !effect.id.includes('_resistance') && !effect.id.includes('_weakness')
                }
                return true
            })
        }

        // Check if this is an immunity item or dual elemental mastery item
        const item = character.equipped[slot]
        const isImmunityItem = item.specialEffects && item.specialEffects.some(effect =>
            effect.toString().toLowerCase().includes('immunity') ||
            effect.toString().toLowerCase().includes('choose 1 element for immunity')
        )
        const isDualElementalItem = item.specialEffects && item.specialEffects.some(effect =>
            effect.toString().toLowerCase().includes('dual elemental mastery')
        )

        if (isDualElementalItem) {
            // For dual elemental mastery, we need to handle two separate choices
            // This will be handled by a more complex dialog system
            this.showDualElementalSelectionDialog(character, itemId, slot)
            return
        } else if (isImmunityItem) {
            // Apply immunity (-3) to chosen element
            const resistanceEffectId = `${element}_resistance`
            console.log(`Applying elemental immunity: ${resistanceEffectId} to character`)
            this.addStatusEffect(character, resistanceEffectId, 999, 3, ['equipment', slot, 'elemental_choice'])

            // Apply weaknesses based on your system:
            // Option 1: +1 weakness to 3 other elements
            // Option 2: +2 weakness to 1 element and +1 to another
            // Option 3: +3 weakness (instant kill) to 1 element

            // I'll implement Option 2: +2 weakness to opposing element and +1 to another
            const secondWeakness = this.getSecondWeakness(element)

            // Apply +2 weakness to opposing element
            const opposingWeaknessEffectId = `${opposingElement}_weakness`
            console.log(`Applying elemental weakness: ${opposingWeaknessEffectId} (+2) to character`)
            this.addStatusEffect(character, opposingWeaknessEffectId, 999, 2, ['equipment', slot, 'elemental_choice'])

            // Apply +1 weakness to second element
            const secondWeaknessEffectId = `${secondWeakness}_weakness`
            console.log(`Applying elemental weakness: ${secondWeaknessEffectId} (+1) to character`)
            this.addStatusEffect(character, secondWeaknessEffectId, 999, 1, ['equipment', slot, 'elemental_choice'])
        } else {
            // Regular resistance (-1) for normal elemental attunement items
            const resistanceEffectId = `${element}_resistance`
            console.log(`Applying elemental resistance: ${resistanceEffectId} to character`)
            this.addStatusEffect(character, resistanceEffectId, 999, 1, ['equipment', slot, 'elemental_choice'])

            // Apply weakness to opposing element
            const weaknessEffectId = `${opposingElement}_weakness`
            console.log(`Applying elemental weakness: ${weaknessEffectId} to character`)
            this.addStatusEffect(character, weaknessEffectId, 999, 1, ['equipment', slot, 'elemental_choice'])
        }

        // Effects are now marked with source when created

        // Save the elemental choice to the item
        if (!character.equipped[slot].elementalChoice) {
            character.equipped[slot].elementalChoice = {}
        }
        character.equipped[slot].elementalChoice.resistance = element
        character.equipped[slot].elementalChoice.weakness = opposingElement

        this.characterManager.saveCharacter(character)

        // Show confirmation message
        const elementNames = {
            fire: 'Fire', ice: 'Ice', lightning: 'Lightning', water: 'Water',
            earth: 'Earth', wind: 'Wind', light: 'Light', dark: 'Dark'
        }

        console.log(`Applied ${elementNames[element]} resistance and ${elementNames[opposingElement]} weakness from ${character.equipped[slot].name}`)

        // Trigger UI update
        if (window.uiComponents && window.uiComponents.updateCharacterDisplay) {
            window.uiComponents.updateCharacterDisplay()
        }
    }

    // Get second weakness element for immunity items
    getSecondWeakness(chosenElement) {
        // Define logical second weaknesses based on elemental relationships
        const secondWeaknesses = {
            fire: 'ice',      // Fire immunity -> Ice weakness (cold vs heat)
            ice: 'fire',      // Ice immunity -> Fire weakness (heat vs cold)
            lightning: 'earth', // Lightning immunity -> Earth weakness (ground vs sky)
            earth: 'lightning', // Earth immunity -> Lightning weakness (sky vs ground)
            water: 'wind',    // Water immunity -> Wind weakness (still vs moving)
            wind: 'water',    // Wind immunity -> Water weakness (moving vs still)
            light: 'darkness',    // Light immunity -> Darkness weakness (opposite)
            darkness: 'light'     // Darkness immunity -> Light weakness (opposite)
        }

        return secondWeaknesses[chosenElement] || 'fire' // fallback
    }

    // Check if item has elemental choice effect
    hasElementalChoiceEffect(item) {
        return item.specialEffects && item.specialEffects.some(effect => {
            const effectStr = effect.toString().toLowerCase()
            return effectStr.includes('choose resistance') ||
                effectStr.includes('choose element') ||
                effectStr.includes('elemental attunement') ||
                effectStr.includes('dual elemental mastery') ||
                effectStr.includes('choose 1 element') ||
                effectStr.includes('elemental')
        })
    }

    // Dual elemental selection dialog for items that need two separate choices
    showDualElementalSelectionDialog(character, itemId, slot) {
        const item = character.equipped[slot]
        if (!item) return

        // Create modal dialog
        const modal = document.createElement('div')
        modal.className = 'modal-overlay'

        modal.innerHTML = `
            <div class="modal-content">
                <h3>Choose Dual Elemental Mastery for ${item.name}</h3>
                <p>Select one element for immunity and one element for resistance. You will gain weaknesses to opposing elements.</p>
                
                <div class="dual-elemental-section">
                    <h4>Step 1: Choose Element for Immunity</h4>
                    <div class="elemental-grid" id="immunity-grid">
                        <button class="element-btn" data-element="fire" data-icon="🔥" title="Fire Immunity">Fire</button>
                        <button class="element-btn" data-element="ice" data-icon="❄️" title="Ice Immunity">Ice</button>
                        <button class="element-btn" data-element="lightning" data-icon="⚡" title="Lightning Immunity">Lightning</button>
                        <button class="element-btn" data-element="water" data-icon="💧" title="Water Immunity">Water</button>
                        <button class="element-btn" data-element="earth" data-icon="🌍" title="Earth Immunity">Earth</button>
                        <button class="element-btn" data-element="wind" data-icon="🌪️" title="Wind Immunity">Wind</button>
                        <button class="element-btn" data-element="light" data-icon="☀️" title="Light Immunity">Light</button>
                        <button class="element-btn" data-element="dark" data-icon="🌑" title="Dark Immunity">Dark</button>
                    </div>
                </div>

                <div class="dual-elemental-section">
                    <h4>Step 2: Choose Element for Resistance</h4>
                    <div class="elemental-grid" id="resistance-grid">
                        <button class="element-btn" data-element="fire" data-icon="🔥" title="Fire Resistance">Fire</button>
                        <button class="element-btn" data-element="ice" data-icon="❄️" title="Ice Resistance">Ice</button>
                        <button class="element-btn" data-element="lightning" data-icon="⚡" title="Lightning Resistance">Lightning</button>
                        <button class="element-btn" data-element="water" data-icon="💧" title="Water Resistance">Water</button>
                        <button class="element-btn" data-element="earth" data-icon="🌍" title="Earth Resistance">Earth</button>
                        <button class="element-btn" data-element="wind" data-icon="🌪️" title="Wind Resistance">Wind</button>
                        <button class="element-btn" data-element="light" data-icon="☀️" title="Light Resistance">Light</button>
                        <button class="element-btn" data-element="dark" data-icon="🌑" title="Dark Resistance">Dark</button>
                    </div>
                </div>

                <div class="dual-elemental-summary">
                    <h4>Summary</h4>
                    <p id="immunity-choice">Immunity: <span class="not-selected">Not selected</span></p>
                    <p id="resistance-choice">Resistance: <span class="not-selected">Not selected</span></p>
                </div>
                
                <div class="modal-buttons">
                    <button class="btn btn-primary" id="apply-dual-elemental" disabled>Apply Choices</button>
                    <button class="btn btn-secondary" onclick="this.closest('.modal-overlay').remove()">Cancel</button>
                </div>
            </div>
        `

        // Add styles
        const style = document.createElement('style')
        style.textContent = `
            .dual-elemental-section {
                margin: 20px 0;
                padding: 15px;
                border: 1px solid #0f3460;
                border-radius: 8px;
                background: #16213e;
            }
            .dual-elemental-section h4 {
                margin: 0 0 15px 0;
                color: #e94560;
                font-size: 16px;
            }
            .dual-elemental-summary {
                margin: 20px 0;
                padding: 15px;
                border: 1px solid #28a745;
                border-radius: 8px;
                background: #1a1a2e;
            }
            .dual-elemental-summary h4 {
                margin: 0 0 10px 0;
                color: #28a745;
                font-size: 16px;
            }
            .not-selected {
                color: #6c757d;
                font-style: italic;
            }
            .selected {
                color: #28a745;
                font-weight: bold;
            }
            .element-btn.selected {
                background: #28a745;
                border-color: #28a745;
                font-weight: bold;
            }
            .element-btn.selected:hover {
                background: #218838;
            }
            .element-btn.disabled {
                opacity: 0.5;
                cursor: not-allowed;
            }
            .element-btn.disabled:hover {
                background: #16213e;
                border-color: #0f3460;
                transform: none;
            }
        `
        document.head.appendChild(style)

        // State variables
        let selectedImmunity = null
        let selectedResistance = null

        // Add event listeners to immunity buttons
        modal.querySelectorAll('#immunity-grid .element-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                if (btn.classList.contains('disabled')) return

                // Clear previous selection
                modal.querySelectorAll('#immunity-grid .element-btn').forEach(b => b.classList.remove('selected'))

                // Select this button
                btn.classList.add('selected')
                selectedImmunity = btn.dataset.element

                // Update summary
                const elementNames = {
                    fire: 'Fire', ice: 'Ice', lightning: 'Lightning', water: 'Water',
                    earth: 'Earth', wind: 'Wind', light: 'Light', dark: 'Dark'
                }
                modal.querySelector('#immunity-choice span').textContent = elementNames[selectedImmunity]
                modal.querySelector('#immunity-choice span').className = 'selected'

                // Disable the same element in resistance grid
                modal.querySelectorAll('#resistance-grid .element-btn').forEach(b => {
                    if (b.dataset.element === selectedImmunity) {
                        b.classList.add('disabled')
                    } else {
                        b.classList.remove('disabled')
                    }
                })

                // Clear resistance selection if it conflicts
                if (selectedResistance === selectedImmunity) {
                    selectedResistance = null
                    modal.querySelectorAll('#resistance-grid .element-btn').forEach(b => b.classList.remove('selected'))
                    modal.querySelector('#resistance-choice span').textContent = 'Not selected'
                    modal.querySelector('#resistance-choice span').className = 'not-selected'
                }

                updateApplyButton()
            })
        })

        // Add event listeners to resistance buttons
        modal.querySelectorAll('#resistance-grid .element-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                if (btn.classList.contains('disabled')) return

                // Clear previous selection
                modal.querySelectorAll('#resistance-grid .element-btn').forEach(b => b.classList.remove('selected'))

                // Select this button
                btn.classList.add('selected')
                selectedResistance = btn.dataset.element

                // Update summary
                const elementNames = {
                    fire: 'Fire', ice: 'Ice', lightning: 'Lightning', water: 'Water',
                    earth: 'Earth', wind: 'Wind', light: 'Light', dark: 'Dark'
                }
                modal.querySelector('#resistance-choice span').textContent = elementNames[selectedResistance]
                modal.querySelector('#resistance-choice span').className = 'selected'

                updateApplyButton()
            })
        })

        // Update apply button state
        function updateApplyButton() {
            const applyBtn = modal.querySelector('#apply-dual-elemental')
            if (selectedImmunity && selectedResistance) {
                applyBtn.disabled = false
                applyBtn.textContent = `Apply ${selectedImmunity} Immunity & ${selectedResistance} Resistance`
            } else {
                applyBtn.disabled = true
                applyBtn.textContent = 'Apply Choices'
            }
        }

        // Add event listener to apply button
        modal.querySelector('#apply-dual-elemental').addEventListener('click', () => {
            if (selectedImmunity && selectedResistance) {
                this.applyDualElementalEffect(character, itemId, slot, selectedImmunity, selectedResistance)
                modal.remove()
            }
        })

        document.body.appendChild(modal)
    }

    // Apply dual elemental effect (immunity + resistance)
    applyDualElementalEffect(character, itemId, slot, immunityElement, resistanceElement) {
        // Define opposing elements
        const opposingElements = {
            fire: 'water',
            water: 'fire',
            ice: 'lightning',
            lightning: 'earth',
            earth: 'wind',
            wind: 'lightning',
            light: 'dark',
            dark: 'light'
        }

        // Remove any existing elemental effects from this equipment
        if (character.statusEffects) {
            character.statusEffects = character.statusEffects.filter(effect => {
                if (effect.source && effect.source.includes('equipment') && effect.source.includes(slot)) {
                    return !effect.id.includes('_resistance') && !effect.id.includes('_weakness')
                }
                return true
            })
        }

        // Apply immunity (-3) to chosen immunity element
        const immunityEffectId = `${immunityElement}_resistance`
        console.log(`Applying elemental immunity: ${immunityEffectId} to character`)
        this.addStatusEffect(character, immunityEffectId, 999, 3, ['equipment', slot, 'elemental_choice'])

        // Apply resistance (-1) to chosen resistance element
        const resistanceEffectId = `${resistanceElement}_resistance`
        console.log(`Applying elemental resistance: ${resistanceEffectId} to character`)
        this.addStatusEffect(character, resistanceEffectId, 999, 1, ['equipment', slot, 'elemental_choice'])

        // Apply weaknesses to opposing elements
        const immunityOpposing = opposingElements[immunityElement]
        const resistanceOpposing = opposingElements[resistanceElement]

        // Apply +2 weakness to immunity element's opposing element
        const immunityWeaknessEffectId = `${immunityOpposing}_weakness`
        console.log(`Applying elemental weakness: ${immunityWeaknessEffectId} (+2) to character`)
        this.addStatusEffect(character, immunityWeaknessEffectId, 999, 2, ['equipment', slot, 'elemental_choice'])

        // Apply +1 weakness to resistance element's opposing element (if different)
        if (resistanceOpposing !== immunityOpposing) {
            const resistanceWeaknessEffectId = `${resistanceOpposing}_weakness`
            console.log(`Applying elemental weakness: ${resistanceWeaknessEffectId} (+1) to character`)
            this.addStatusEffect(character, resistanceWeaknessEffectId, 999, 1, ['equipment', slot, 'elemental_choice'])
        }

        // Save the elemental choices to the item
        if (!character.equipped[slot].elementalChoice) {
            character.equipped[slot].elementalChoice = {}
        }
        character.equipped[slot].elementalChoice.immunity = immunityElement
        character.equipped[slot].elementalChoice.resistance = resistanceElement

        this.characterManager.saveCharacter(character)

        // Show confirmation message
        const elementNames = {
            fire: 'Fire', ice: 'Ice', lightning: 'Lightning', water: 'Water',
            earth: 'Earth', wind: 'Wind', light: 'Light', dark: 'Dark'
        }

        console.log(`Applied ${elementNames[immunityElement]} immunity, ${elementNames[resistanceElement]} resistance, and weaknesses to opposing elements from ${character.equipped[slot].name}`)

        // Trigger UI update
        if (window.uiComponents && window.uiComponents.updateCharacterDisplay) {
            window.uiComponents.updateCharacterDisplay()
        }
    }
}
