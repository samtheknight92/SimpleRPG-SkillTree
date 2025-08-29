// Character Manager - Handles character creation, saving, loading, and management
class CharacterManager {
    constructor() {
        this.currentCharacter = null
        this.storageKey = 'rpg_characters'
        this.activeCharacterKey = 'rpg_active_character'
        this.foldersKey = 'rpg_character_folders'
    }

    // Create a new character with default values
    createCharacter(name) {
        if (!name || name.trim() === '') {
            throw new Error('Character name cannot be empty')
        }

        const character = {
            id: this.generateId(),
            name: name.trim(),
            folder: 'Default', // Default folder for organization
            created: new Date().toISOString(),
            lastPlayed: new Date().toISOString(),

            // Current HP/Stamina (for combat testing)
            hp: 10,              // Current HP
            maxHp: 10,           // Max HP (1:1 with HP stat)
            stamina: 10,         // Current Stamina  
            maxStamina: 10,      // Max Stamina (1:1 with Stamina stat)

            // Upgradeable Stats
            stats: {
                hp: 10,              // HP stat (increases maxHp 1:1)
                stamina: 10,         // Stamina stat (increases maxStamina 1:1)
                strength: -3,        // Physical damage modifier (-3 to +15)
                magicPower: -3,      // Magical damage modifier (-3 to +15)
                accuracy: -3,        // Hit chance modifier (-3 to +8)
                speed: 2,            // Turn order, walk speed, evasion (auto-adds 25% to AC) - minimum 2 for 10m movement
                physicalDefence: 8,  // Physical AC (starting at 8)
                magicalDefence: 8    // Magical AC (starting at 8)
            },

            // Resources
            lumens: 150,

            // HP Milestone Tracking (prevents exploit)
            hpMilestones: {
                hp25: false,  // +5 bonus HP when reaching 25
                hp50: false,  // +10 bonus HP when reaching 50  
                hp100: false, // +25 bonus HP when reaching 100
                hp200: false, // +25 bonus HP when reaching 200
                hp300: false, // +25 bonus HP when reaching 300
                hp400: false, // +25 bonus HP when reaching 400
                hp500: false  // +25 bonus HP when reaching 500
            },

            // Stamina Milestone Tracking (prevents exploit, more expensive than HP)
            staminaMilestones: {
                stamina15: false, // +3 bonus stamina when reaching 15 (costs 5L each = 75L total)
                stamina25: false, // +5 bonus stamina when reaching 25 (costs 5L each = 125L total)
                stamina40: false, // +10 bonus stamina when reaching 40 (costs 5L each = 200L total)
                stamina60: false  // +15 bonus stamina when reaching 60 (costs 5L each = 300L total)
            },

            // New Currency System - Gil (Final Fantasy inspired)
            gil: 65,  // Starting Gil amount - enough for Tier 1 weapon (10) + armor (15) + accessory (30) + 10 spare for consumables

            // Character Type System
            isMonster: false,  // Flag to determine if character is a monster
            race: null,        // Selected race (null = no race selected yet, permanent once set)

            // Racial Passive Traits System
            racialPassiveTraits: [],  // Array of active racial passive trait descriptions
            racialAbilities: {},      // Object storing special racial ability flags and data

            // Skills (arrays of unlocked skill IDs)
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
                monster: {   // Monster-specific skills organized by category
                    defense: [],
                    combat: [],
                    magic: [],
                    utility: []
                },
                fusion: {    // Fusion skills unlocked by combining skills from different trees
                    ranged_magic: [],
                    melee_magic: [],
                    utility_combat: [],
                    monster_fusion: []
                },
                ultimate: {  // Ultimate endgame skills with legendary power
                    legendary: []
                },
                racial: {    // Racial skills organized by race
                    elven: [],
                    dwarven: [],
                    halfling: [],
                    orcish: [],
                    human: [],
                    dragonborn: [],
                    tiefling: [],
                    drow: [],
                    gnoll: []
                }
            },

            // Equipment and Inventory System
            inventory: [],    // Array of owned items
            equipped: {       // Currently equipped items
                primaryWeapon: null,  // Main weapon slot
                secondaryWeapon: null, // Secondary weapon slot (for dual wielding)
                armor: null,
                accessory: null
            },
            equippedEnchantments: {  // Enchantments equipped on gear
                primaryWeapon: [],   // Array of enchantment IDs equipped on primary weapon
                secondaryWeapon: [], // Array of enchantment IDs equipped on secondary weapon
                armor: [],           // Array of enchantment IDs equipped on armor
                accessory: []        // Array of enchantment IDs equipped on accessory
            },

            // Status Effects
            statusEffects: [],    // Array of active status effects
            equipmentBonuses: {  // Stat bonuses from equipment
                hp: 0,
                stamina: 0,
                strength: 0,
                magicPower: 0,
                speed: 0,
                physicalDefence: 0,
                magicalDefence: 0,
                accuracy: 0
            },

            // Status Effects System
            statusEffects: [],    // Array of active status effects

            // Toggle Skills System  
            activeToggleSkills: [],  // Array of currently active toggle skill IDs

            // Equipment (placeholder for future expansion)
            equipment: {
                weapon: null,
                armor: null,
                accessory: null
            },

            // Achievements and progress tracking
            achievements: [],
            totalSkillsUnlocked: 0,
            totalLumensSpent: 0
        }

        return character
    }

    // Generate unique character ID
    generateId() {
        return 'char_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
    }

    // Save character to localStorage
    saveCharacter(character) {
        try {
            // First validate character data
            if (!character.activeToggleSkills || !Array.isArray(character.activeToggleSkills)) {
                character.activeToggleSkills = []
            }

            const characters = this.getAllCharacters()
            const existingIndex = characters.findIndex(c => c.id === character.id)

            // Update last played time
            character.lastPlayed = new Date().toISOString()

            if (existingIndex >= 0) {
                // Preserve the toggle skills array when saving
                const oldCharacter = characters[existingIndex]
                if (oldCharacter.activeToggleSkills && Array.isArray(oldCharacter.activeToggleSkills)) {
                    character.activeToggleSkills = character.activeToggleSkills || oldCharacter.activeToggleSkills
                }
                characters[existingIndex] = character
            } else {
                characters.push(character)
            }

            const dataToSave = JSON.stringify(characters)

            // Check data size before saving (warn if approaching limits)
            const sizeInMB = new Blob([dataToSave]).size / (1024 * 1024)
            if (sizeInMB > 4) {
                console.warn(`Save data is ${sizeInMB.toFixed(2)}MB - approaching storage limits`)
            }

            localStorage.setItem(this.storageKey, dataToSave)
            return true
        } catch (error) {
            if (error.name === 'QuotaExceededError' || error.code === 22) {
                console.error('Storage quota exceeded! Cannot save character data.')
                // Attempt to clean up old data or notify user
                this.handleStorageQuotaExceeded()
                return false
            }
            console.error('Failed to save character:', error)
            return false
        }
    }

    // Save all characters to localStorage
    saveAllCharacters(characters) {
        try {
            const dataToSave = JSON.stringify(characters)

            // Check data size before saving (warn if approaching limits)
            const sizeInMB = new Blob([dataToSave]).size / (1024 * 1024)
            if (sizeInMB > 4) {
                console.warn(`Save data is ${sizeInMB.toFixed(2)}MB - approaching storage limits`)
            }

            localStorage.setItem(this.storageKey, dataToSave)
            return true
        } catch (error) {
            if (error.name === 'QuotaExceededError' || error.code === 22) {
                console.error('Storage quota exceeded! Cannot save character data.')
                this.handleStorageQuotaExceeded()
                return false
            }
            console.error('Failed to save characters:', error)
            return false
        }
    }

    // Handle storage quota exceeded
    handleStorageQuotaExceeded() {
        // Could implement data cleanup strategies here
        // For now, just alert the user
        if (typeof window !== 'undefined' && window.alert) {
            alert('Save data storage is full! Consider exporting your data as backup.')
        }
    }

    // Load character by ID
    loadCharacter(characterId) {
        try {
            const characters = this.getAllCharacters()
            const character = characters.find(c => c.id === characterId)

            if (character) {
                // Ensure character has latest properties through migration
                this.currentCharacter = this.migrateCharacter(character)
                localStorage.setItem(this.activeCharacterKey, characterId)
                return this.currentCharacter
            }
            return null
        } catch (error) {
            console.error('Failed to load character:', error)
            return null
        }
    }

    // Get all saved characters
    getAllCharacters() {
        try {
            const saved = localStorage.getItem(this.storageKey)
            const characters = saved ? JSON.parse(saved) : []

            // Migrate characters to add new properties if needed
            return characters.map(character => this.migrateCharacter(character))
        } catch (error) {
            console.error('Failed to load characters:', error)
            return []
        }
    }

    // Migrate character data to latest version
    migrateCharacter(character) {
        // Validate character has required base properties
        if (!character.name || !character.stats || !character.unlockedSkills) {
            console.error('Invalid character data during migration:', character)
            return null
        }

        // Add Gil currency system if it doesn't exist
        if (typeof character.gil !== 'number') {
            character.gil = 65  // Starting Gil amount (balanced for early game)
        }

        // Migrate old currency system to Gil if present
        if (character.currency && !character.gil) {
            // Convert old currency to Gil (rough conversion)
            const oldTotal = (character.currency.gold || 0) * 100 +
                (character.currency.silver || 0) * 4 +
                (character.currency.copper || 0) * 0.1
            character.gil = Math.max(65, Math.floor(oldTotal))
            delete character.currency  // Remove old currency system
        }

        // Add inventory system properties if they don't exist
        if (!character.inventory) {
            character.inventory = []
        }

        if (!character.equipped) {
            character.equipped = {
                primaryWeapon: null,
                secondaryWeapon: null,
                armor: null,
                accessory: null
            }
        } else {
            // Migrate legacy weapon slot to new dual weapon system
            if (character.equipped.weapon && !character.equipped.primaryWeapon) {
                character.equipped.primaryWeapon = character.equipped.weapon
                delete character.equipped.weapon
            }

            // Ensure all required slots exist
            if (!character.equipped.primaryWeapon) character.equipped.primaryWeapon = null
            if (!character.equipped.secondaryWeapon) character.equipped.secondaryWeapon = null
        }

        // Ensure accessory slot exists (for old characters)
        if (character.equipped && !character.equipped.hasOwnProperty('accessory')) {
            character.equipped.accessory = null
        }

        // Ensure accessory enchantment slot exists (for old characters)
        if (character.equippedEnchantments && !character.equippedEnchantments.hasOwnProperty('accessory')) {
            character.equippedEnchantments.accessory = []
        }

        // Migrate weapon enchantments to new dual weapon system
        if (character.equippedEnchantments) {
            if (character.equippedEnchantments.weapon && !character.equippedEnchantments.primaryWeapon) {
                character.equippedEnchantments.primaryWeapon = character.equippedEnchantments.weapon
                delete character.equippedEnchantments.weapon
            }

            // Ensure all enchantment slots exist
            if (!character.equippedEnchantments.primaryWeapon) character.equippedEnchantments.primaryWeapon = []
            if (!character.equippedEnchantments.secondaryWeapon) character.equippedEnchantments.secondaryWeapon = []
        } else {
            character.equippedEnchantments = {
                primaryWeapon: [],
                secondaryWeapon: [],
                armor: [],
                accessory: []
            }
        }

        // Add folder property if it doesn't exist
        if (!character.folder) {
            character.folder = character.isMonster ? 'Monsters' : 'Default'
        }

        // Ensure activeToggleSkills array exists
        if (!Array.isArray(character.activeToggleSkills)) {
            character.activeToggleSkills = []
        }

        if (!character.equipmentBonuses) {
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
        }

        if (!character.statusEffects) {
            character.statusEffects = []
        }

        // Migrate unlockedSkills to include new weapon categories
        if (!character.unlockedSkills.weapons.staff) {
            character.unlockedSkills.weapons.staff = []
        }
        if (!character.unlockedSkills.weapons.dagger) {
            character.unlockedSkills.weapons.dagger = []
        }
        if (!character.unlockedSkills.weapons.polearm) {
            character.unlockedSkills.weapons.polearm = []
        }
        if (!character.unlockedSkills.weapons.hammer) {
            character.unlockedSkills.weapons.hammer = []
        }
        // Ensure ranged skill tree exists (migration for old bow/crossbow characters)
        if (!character.unlockedSkills.weapons.ranged) {
            character.unlockedSkills.weapons.ranged = []

            // Migrate old bow skills to ranged
            if (character.unlockedSkills.weapons.bow) {
                character.unlockedSkills.weapons.ranged = [...character.unlockedSkills.weapons.bow]
                delete character.unlockedSkills.weapons.bow
            }

            // Migrate old crossbow skills to ranged (append if bow skills existed)
            if (character.unlockedSkills.weapons.crossbow) {
                character.unlockedSkills.weapons.ranged = [...character.unlockedSkills.weapons.ranged, ...character.unlockedSkills.weapons.crossbow]
                delete character.unlockedSkills.weapons.crossbow
            }
        }

        // Ensure toggle skills system exists (migration)
        if (!character.activeToggleSkills) {
            character.activeToggleSkills = []
        }

        // Ensure toggle skills array is always an array (fix for null/undefined)
        if (!Array.isArray(character.activeToggleSkills)) {
            character.activeToggleSkills = []
        }

        // Migrate unlockedSkills to include new magic elements
        if (!character.unlockedSkills.magic.earth) {
            character.unlockedSkills.magic.earth = []
        }
        if (!character.unlockedSkills.magic.wind) {
            character.unlockedSkills.magic.wind = []
        }
        if (!character.unlockedSkills.magic.water) {
            character.unlockedSkills.magic.water = []
        }
        if (!character.unlockedSkills.magic.darkness) {
            character.unlockedSkills.magic.darkness = []
        }
        if (!character.unlockedSkills.magic.light) {
            character.unlockedSkills.magic.light = []
        }

        // Migrate unlockedSkills to include new professions
        if (!character.unlockedSkills.professions.cooking) {
            character.unlockedSkills.professions.cooking = []
        }
        if (!character.unlockedSkills.professions.archaeology) {
            character.unlockedSkills.professions.archaeology = []
        }
        if (!character.unlockedSkills.professions.herbalism) {
            character.unlockedSkills.professions.herbalism = []
        }

        // Migrate character to include monster system
        if (typeof character.isMonster !== 'boolean') {
            character.isMonster = false  // Default to non-monster
        }

        // Migrate monster skills from old flat array to new nested structure
        if (!character.unlockedSkills.monster) {
            character.unlockedSkills.monster = {
                defense: [],
                combat: [],
                magic: [],
                utility: []
            }
        } else if (Array.isArray(character.unlockedSkills.monster)) {
            // Migrate from old flat array to new nested structure
            const oldMonsterSkills = character.unlockedSkills.monster
            character.unlockedSkills.monster = {
                defense: [],
                combat: [],
                magic: [],
                utility: []
            }

            // Redistribute old skills to appropriate categories based on skill definitions
            oldMonsterSkills.forEach(skillId => {
                const skill = findSkillById(skillId)
                if (skill) {
                    // Find which category this skill belongs to in the new structure
                    let foundCategory = false
                    Object.entries(SKILLS_DATA.monster).forEach(([category, skillsArray]) => {
                        if (!foundCategory && skillsArray.some(s => s.id === skillId)) {
                            character.unlockedSkills.monster[category].push(skillId)
                            foundCategory = true
                        }
                    })
                }
            })

            console.log('Migrated monster skills from flat array to nested structure')
        }

        // Migrate to include fusion skills system
        if (!character.unlockedSkills.fusion) {
            character.unlockedSkills.fusion = {
                ranged_magic: [],
                melee_magic: [],
                utility_combat: [],
                monster_fusion: [],
                pure_magic: []
            }
        }

        // Ensure all fusion categories exist (for existing characters)
        if (!character.unlockedSkills.fusion.pure_magic) {
            character.unlockedSkills.fusion.pure_magic = []
        }

        // Migrate to include ultimate skills system
        if (!character.unlockedSkills.ultimate) {
            character.unlockedSkills.ultimate = {
                legendary: []
            }
        }

        // Ensure HP/Stamina current values exist and are valid
        if (typeof character.hp !== 'number' || character.hp < 0) {
            character.hp = character.maxHp || character.stats.hp || 10
        }
        if (typeof character.stamina !== 'number' || character.stamina < 0) {
            character.stamina = character.maxStamina || character.stats.stamina || 10
        }
        if (typeof character.maxHp !== 'number') {
            character.maxHp = character.stats.hp || 10
        }
        if (typeof character.maxStamina !== 'number') {
            character.maxStamina = character.stats.stamina || 10
        }

        // Migrate HP milestone system (prevents refund exploit)
        if (!character.hpMilestones) {
            character.hpMilestones = {
                hp25: false, hp50: false, hp100: false, hp200: false,
                hp300: false, hp400: false, hp500: false
            }

            // For existing characters, retroactively mark achieved milestones based on current HP
            const currentHP = character.stats.hp || 10
            if (currentHP >= 525) character.hpMilestones.hp500 = true  // 500+25 bonus
            if (currentHP >= 425) character.hpMilestones.hp400 = true  // 400+25 bonus
            if (currentHP >= 325) character.hpMilestones.hp300 = true  // 300+25 bonus
            if (currentHP >= 225) character.hpMilestones.hp200 = true  // 200+25 bonus
            if (currentHP >= 125) character.hpMilestones.hp100 = true  // 100+25 bonus  
            if (currentHP >= 60) character.hpMilestones.hp50 = true    // 50+10 bonus
            if (currentHP >= 30) character.hpMilestones.hp25 = true    // 25+5 bonus
        }

        // Add missing milestone flags for existing characters
        if (!character.hpMilestones.hp300) character.hpMilestones.hp300 = false
        if (!character.hpMilestones.hp400) character.hpMilestones.hp400 = false
        if (!character.hpMilestones.hp500) character.hpMilestones.hp500 = false

        // Migrate Stamina milestone system (prevents refund exploit)
        if (!character.staminaMilestones) {
            character.staminaMilestones = {
                stamina15: false, stamina25: false, stamina40: false, stamina60: false
            }

            // For existing characters, retroactively mark achieved milestones based on current stamina
            const currentStamina = character.stats.stamina || 10
            if (currentStamina >= 75) character.staminaMilestones.stamina60 = true  // 60+15 bonus
            if (currentStamina >= 50) character.staminaMilestones.stamina40 = true  // 40+10 bonus
            if (currentStamina >= 30) character.staminaMilestones.stamina25 = true  // 25+5 bonus
            if (currentStamina >= 18) character.staminaMilestones.stamina15 = true  // 15+3 bonus
        }

        // Migrate to include accuracy stat (hit chance separate from damage)
        if (typeof character.stats.accuracy !== 'number') {
            character.stats.accuracy = -3  // Default accuracy for existing characters

            // Update equipment bonuses to include accuracy
            if (character.equipmentBonuses && typeof character.equipmentBonuses.accuracy !== 'number') {
                character.equipmentBonuses.accuracy = 0
            }
        }

        // Migrate speed minimum to 2 (10m movement)
        if (character.stats.speed < 2) {
            character.stats.speed = 2  // Ensure minimum speed for basic movement
        }

        return character
    }

    // Delete character by ID
    deleteCharacter(characterId) {
        try {
            const characters = this.getAllCharacters()
            const filteredCharacters = characters.filter(c => c.id !== characterId)

            localStorage.setItem(this.storageKey, JSON.stringify(filteredCharacters))

            // If this was the active character, clear it
            if (this.currentCharacter && this.currentCharacter.id === characterId) {
                this.currentCharacter = null
                localStorage.removeItem(this.activeCharacterKey)
            }

            return true
        } catch (error) {
            console.error('Failed to delete character:', error)
            return false
        }
    }

    // Toggle monster status for a character
    toggleMonsterStatus(characterId) {
        try {
            const character = this.loadCharacter(characterId)
            if (!character) {
                console.error('Character not found for monster toggle:', characterId)
                return false
            }

            // Toggle monster status
            const wasMonster = character.isMonster
            character.isMonster = !character.isMonster

            // If becoming a monster, ensure monster skills structure exists
            if (character.isMonster && !character.unlockedSkills.monster) {
                character.unlockedSkills.monster = {
                    defense: [],
                    combat: [],
                    magic: [],
                    utility: []
                }
            }

            // If becoming a monster, refund all profession skills (they can't learn them)
            if (!wasMonster && character.isMonster && character.unlockedSkills.professions) {
                let totalRefund = 0
                let refundedSkillsCount = 0

                // Iterate through all profession skill categories
                Object.keys(character.unlockedSkills.professions).forEach(category => {
                    const professionSkills = character.unlockedSkills.professions[category]

                    // Refund each profession skill
                    professionSkills.forEach(skillId => {
                        const skill = findSkillById(skillId)
                        if (skill) {
                            totalRefund += skill.cost
                            refundedSkillsCount++
                        }
                    })

                    // Clear the category
                    character.unlockedSkills.professions[category] = []
                })

                // Add refunded lumens back to character
                character.lumens += totalRefund

                console.log(`Refunded ${refundedSkillsCount} profession skills for ${totalRefund} lumens when becoming monster`)
            }

            // If reverting from monster to regular character, refund all monster skills
            if (wasMonster && !character.isMonster && character.unlockedSkills.monster) {
                let totalRefund = 0
                let refundedSkillsCount = 0

                // Iterate through all monster skill categories
                Object.keys(character.unlockedSkills.monster).forEach(category => {
                    const monsterSkills = character.unlockedSkills.monster[category]

                    // Refund each monster skill
                    monsterSkills.forEach(skillId => {
                        const skill = findSkillById(skillId)
                        if (skill) {
                            totalRefund += skill.cost
                            refundedSkillsCount++
                        }
                    })

                    // Clear the category
                    character.unlockedSkills.monster[category] = []
                })

                // Add refunded lumens back to character
                character.lumens += totalRefund

                console.log(`Refunded ${refundedSkillsCount} monster skills for ${totalRefund} lumens when becoming regular character`)
            }

            // Also refund elemental affinity skills when becoming regular character
            if (wasMonster && !character.isMonster) {
                let elementalRefund = 0
                let refundedElementalCount = 0

                // Check all skill categories for elemental affinity skills
                Object.entries(character.unlockedSkills).forEach(([category, categoryData]) => {
                    if (category === 'monster' || category === 'professions') return // Already handled

                    Object.entries(categoryData).forEach(([subcategory, skillIds]) => {
                        // Filter out elemental affinity skills and refund them
                        const remainingSkills = skillIds.filter(skillId => {
                            const isElementalSkill = window.monsterSystem && window.monsterSystem.isElementalAffinitySkill(skillId)
                            if (isElementalSkill) {
                                const skill = findSkillById(skillId)
                                if (skill) {
                                    elementalRefund += skill.cost
                                    refundedElementalCount++
                                }
                                return false // Remove this skill
                            }
                            return true // Keep this skill
                        })

                        // Update the skill array
                        character.unlockedSkills[category][subcategory] = remainingSkills
                    })
                })

                if (refundedElementalCount > 0) {
                    character.lumens += elementalRefund
                    console.log(`Refunded ${refundedElementalCount} elemental affinity skills for ${elementalRefund} lumens when becoming regular character`)
                }
            }

            // Save the updated character
            this.saveCharacter(character)

            // Update current character if it's the active one
            if (this.currentCharacter && this.currentCharacter.id === characterId) {
                this.currentCharacter = character
            }

            return true
        } catch (error) {
            console.error('Failed to toggle monster status:', error)
            return false
        }
    }

    // Toggle skill activation for a character
    toggleSkill(characterId, skillId) {
        try {
            const character = this.loadCharacter(characterId)
            if (!character) {
                console.error('Character not found for skill toggle:', characterId)
                return false
            }

            // Ensure activeToggleSkills array exists and is an array
            if (!Array.isArray(character.activeToggleSkills)) {
                character.activeToggleSkills = []
            }

            // Toggle the skill
            const skill = findSkillById(skillId)

            if (!skill) {
                console.error('Skill not found:', skillId)
                return false
            }

            // Check if this is a toggle skill
            if (!skill.desc.toLowerCase().includes('toggle:')) {
                console.error('Not a toggle skill:', skillId)
                return false
            }

            // First check for any incompatible toggle skills
            const INCOMPATIBLE_SKILLS = {
                'defensive_stance': ['berserker_rage', 'monster_berserker_rage', 'fortress_stance'],
                'polearm_defensive_stance': ['berserker_rage', 'monster_berserker_rage', 'fortress_stance'],
                'berserker_rage': ['defensive_stance', 'polearm_defensive_stance', 'fortress_stance'],
                'monster_berserker_rage': ['defensive_stance', 'polearm_defensive_stance', 'fortress_stance'],
                'fortress_stance': ['defensive_stance', 'berserker_rage', 'monster_berserker_rage', 'polearm_defensive_stance']
            }

            // Determine if we're turning it on or off
            const isCurrentlyActive = character.activeToggleSkills.includes(skillId)
            const skillName = skill.name

            if (isCurrentlyActive) {
                // Turning it off - remove it from active skills
                const index = character.activeToggleSkills.indexOf(skillId)
                character.activeToggleSkills.splice(index, 1)
            } else {
                // Turning it on - check for incompatible skills first
                if (INCOMPATIBLE_SKILLS[skillId]) {
                    INCOMPATIBLE_SKILLS[skillId].forEach(incompatibleSkillId => {
                        const index = character.activeToggleSkills.indexOf(incompatibleSkillId)
                        if (index > -1) {
                            character.activeToggleSkills.splice(index, 1)
                        }
                    })
                }
                // Now add the new skill
                character.activeToggleSkills.push(skillId)
            }

            // Update current character if it's the active one
            if (this.currentCharacter && this.currentCharacter.id === characterId) {
                this.currentCharacter.activeToggleSkills = [...character.activeToggleSkills]
            }

            // Save the updated character
            const saveResult = this.saveCharacter(character)

            return saveResult
        } catch (error) {
            console.error('Failed to toggle skill:', error)
            return false
        }
    }

    // Check if a skill is currently active/toggled
    isSkillToggled(characterId, skillId) {
        try {
            // Use current character if it matches ID to avoid disk load
            const character = (this.currentCharacter && this.currentCharacter.id === characterId)
                ? this.currentCharacter
                : this.loadCharacter(characterId)

            if (!character) {
                return false
            }
            if (!Array.isArray(character.activeToggleSkills)) {
                character.activeToggleSkills = []
            }
            return character.activeToggleSkills.includes(skillId)
        } catch (error) {
            console.error('Failed to check skill toggle status:', error)
            return false
        }
    }

    // Get all currently active toggle skills for a character
    getActiveToggleSkills(characterId) {
        try {
            const character = this.loadCharacter(characterId)
            if (!character) {
                return []
            }
            return character.activeToggleSkills || []
        } catch (error) {
            console.error('Failed to get active toggle skills:', error)
            return []
        }
    }

    // Get currently active character
    getCurrentCharacter() {
        // Always reload from localStorage to get the latest state
        try {
            const activeId = localStorage.getItem(this.activeCharacterKey)
            if (activeId) {
                return this.loadCharacter(activeId)
            }
        } catch (error) {
            console.error('Failed to load active character:', error)
        }

        return null
    }

    // Update character stats
    updateStats(character, statName, newValue) {
        if (!character.stats.hasOwnProperty(statName)) {
            throw new Error(`Invalid stat name: ${statName}`)
        }

        character.stats[statName] = newValue

        // Update max values when HP/Stamina stats change (1:1 ratio per README)
        if (statName === 'hp') {
            character.maxHp = newValue
            // Don't let current HP exceed new max
            if (character.hp > character.maxHp) {
                character.hp = character.maxHp
            }
        } else if (statName === 'stamina') {
            character.maxStamina = newValue
            // Don't let current stamina exceed new max
            if (character.stamina > character.maxStamina) {
                character.stamina = character.maxStamina
            }
        }

        // Auto-calculate Speed AC bonus (25% of Speed adds to both AC values)
        const speedACBonus = Math.floor(character.stats.speed * 0.25)

        // Note: Physical and Magical Defence are base values
        // Speed bonus is calculated when needed, not stored

        this.saveCharacter(character)
        return character
    }

    // Add lumens to character
    addLumens(character, amount) {
        character.lumens += amount
        this.saveCharacter(character)
        return character
    }

    // Adjust current HP/Stamina for testing (README spec)
    adjustCurrentValue(character, type, amount) {
        if (type === 'hp') {
            character.hp = Math.max(0, Math.min(character.maxHp, character.hp + amount))
        } else if (type === 'stamina') {
            character.stamina = Math.max(0, Math.min(character.maxStamina, character.stamina + amount))
        } else {
            throw new Error(`Invalid type for adjustment: ${type}`)
        }

        this.saveCharacter(character)
        return character
    }

    // Spend lumens (returns true if successful, false if insufficient funds)
    spendLumens(character, amount) {
        if (character.lumens >= amount) {
            character.lumens -= amount
            character.totalLumensSpent += amount
            this.saveCharacter(character)
            return true
        }
        return false
    }

    // Unlock a skill
    unlockSkill(character, skillId, devMode = false) {
        const skill = findSkillById(skillId)
        if (!skill) {
            throw new Error(`Skill not found: ${skillId}`)
        }

        // Check if already unlocked
        const category = this.findSkillCategory(skillId)
        const subcategory = this.findSkillSubcategory(skillId)

        // Handle different skill categories  
        let unlockedSkillsArray
        if (category === 'racial') {
            // Ensure racial skills structure exists
            if (!character.unlockedSkills.racial) {
                character.unlockedSkills.racial = {}
            }

            // Special case for humans learning cross-cultural skills
            if (character.race === 'human' && this.canLearnCrossCulturalSkills(character)) {
                // Check if this is a cross-cultural skill (Tier 1 from another race)
                const crossCulturalSkills = this.getAvailableCrossCulturalSkills(character)
                const isCrossCultural = crossCulturalSkills.some(skill => skill.id === skillId)

                if (isCrossCultural) {
                    // Store all cross-cultural skills under 'human'
                    if (!character.unlockedSkills.racial.human) {
                        character.unlockedSkills.racial.human = []
                    }
                    unlockedSkillsArray = character.unlockedSkills.racial.human
                } else {
                    // Regular racial skill (shouldn't happen for humans, but handle it)
                    if (!character.unlockedSkills.racial[subcategory]) {
                        character.unlockedSkills.racial[subcategory] = []
                    }
                    unlockedSkillsArray = character.unlockedSkills.racial[subcategory]
                }
            } else {
                // Regular racial skills for other races
                if (!character.unlockedSkills.racial[subcategory]) {
                    character.unlockedSkills.racial[subcategory] = []
                }
                unlockedSkillsArray = character.unlockedSkills.racial[subcategory]
            }
        } else if (category === 'monster') {
            unlockedSkillsArray = character.unlockedSkills.monster[subcategory]
        } else {
            unlockedSkillsArray = character.unlockedSkills[category][subcategory]
        }

        if (unlockedSkillsArray.includes(skillId)) {
            throw new Error('Skill already unlocked')
        }

        // Check prerequisites (skip in dev mode)
        if (!devMode && !this.validateSkillPrerequisites(character, skillId)) {
            throw new Error('Prerequisites not met')
        }

        // Check cost
        if (!this.spendLumens(character, skill.cost)) {
            throw new Error('Insufficient lumens')
        }

        // Unlock the skill
        unlockedSkillsArray.push(skillId)
        character.totalSkillsUnlocked++

        this.saveCharacter(character)
        return character
    }

    // Find which category a skill belongs to
    findSkillCategory(skillId) {
        // Check racial skills first
        if (window.RACE_SKILL_TREES) {
            for (const raceSkills of Object.values(window.RACE_SKILL_TREES)) {
                if (raceSkills.some(skill => skill.id === skillId)) {
                    return 'racial'
                }
            }
        }

        // Check monster skills first (nested structure like other categories)
        if (SKILLS_DATA.monster) {
            for (const skillsArray of Object.values(SKILLS_DATA.monster)) {
                if (skillsArray.some(skill => skill.id === skillId)) {
                    return 'monster'
                }
            }
        }

        // Check fusion skills (nested structure like other categories)
        if (SKILLS_DATA.fusion) {
            for (const skillsArray of Object.values(SKILLS_DATA.fusion)) {
                if (skillsArray.some(skill => skill.id === skillId)) {
                    return 'fusion'
                }
            }
        }

        // Check other categories (nested structure)
        for (const [category, subcategories] of Object.entries(SKILLS_DATA)) {
            if (category === 'monster' || category === 'fusion') continue // Already checked above

            for (const [subcategory, skills] of Object.entries(subcategories)) {
                if (skills.some(skill => skill.id === skillId)) {
                    return category
                }
            }
        }
        return null
    }

    // Find which subcategory a skill belongs to
    findSkillSubcategory(skillId) {
        // Check racial skills first
        if (window.RACE_SKILL_TREES) {
            for (const [raceKey, raceSkills] of Object.entries(window.RACE_SKILL_TREES)) {
                if (raceSkills.some(skill => skill.id === skillId)) {
                    // Find the race ID from the race key
                    const raceIdMap = {
                        'elf': 'elf',
                        'dwarf': 'dwarf',
                        'human': 'human',
                        'orc': 'orc',
                        'dragonborn': 'dragonborn',
                        'halfling': 'halfling',
                        'tiefling': 'tiefling',
                        'drow': 'drow',
                        'gnoll': 'gnoll'
                    }
                    return raceIdMap[raceKey] || raceKey
                }
            }
        }

        // Check monster skills (now have subcategories)
        if (SKILLS_DATA.monster) {
            for (const [subcategory, skills] of Object.entries(SKILLS_DATA.monster)) {
                if (skills.some(skill => skill.id === skillId)) {
                    return subcategory
                }
            }
        }

        // Check fusion skills (have subcategories)
        if (SKILLS_DATA.fusion) {
            for (const [subcategory, skills] of Object.entries(SKILLS_DATA.fusion)) {
                if (skills.some(skill => skill.id === skillId)) {
                    return subcategory
                }
            }
        }

        // Check other categories (nested structure)
        for (const [category, subcategories] of Object.entries(SKILLS_DATA)) {
            if (category === 'monster' || category === 'fusion') continue // Already handled above

            for (const [subcategory, skills] of Object.entries(subcategories)) {
                if (skills.some(skill => skill.id === skillId)) {
                    return subcategory
                }
            }
        }
        return null
    }

    // Validate skill prerequisites for a character
    validateSkillPrerequisites(character, skillId) {
        const skill = findSkillById(skillId)
        if (!skill) return false

        // Check character type restrictions (unless in dev mode)
        const devMode = localStorage.getItem('rpg_debug_mode') === 'true'
        if (!devMode) {
            // Monsters cannot learn profession skills
            if (character.isMonster && this.isProfessionSkill(skillId)) {
                return false
            }

            // Regular characters cannot learn elemental affinity skills
            if (!character.isMonster && window.monsterSystem && window.monsterSystem.isElementalAffinitySkill(skillId)) {
                return false
            }

            // Humans can learn their own racial skills AND cross-cultural skills (Tier 1 from other races)
            if (character.race === 'human') {
                const crossCulturalSkills = this.getAvailableCrossCulturalSkills(character)
                const isCrossCultural = crossCulturalSkills.some(skill => skill.id === skillId)
                const category = this.findSkillCategory(skillId)
                const subcategory = this.findSkillSubcategory(skillId)

                // If it's a racial skill, humans can only learn their own skills OR cross-cultural skills
                if (category === 'racial' && subcategory !== 'human' && !isCrossCultural) {
                    return false
                }
            }

            // Non-human characters cannot learn cross-cultural skills from other races
            if (character.race !== 'human') {
                const category = this.findSkillCategory(skillId)
                const subcategory = this.findSkillSubcategory(skillId)

                // If it's a racial skill from a different race, they can't learn it
                if (category === 'racial' && subcategory !== character.race) {
                    return false
                }
            }
        }

        if (skill.prerequisites.type === 'NONE') return true

        const unlockedSkillIds = this.getAllUnlockedSkillIds(character)

        if (skill.prerequisites.type === 'AND') {
            return skill.prerequisites.skills.every(prereqId =>
                unlockedSkillIds.includes(prereqId)
            )
        } else if (skill.prerequisites.type === 'OR') {
            return skill.prerequisites.skills.some(prereqId =>
                unlockedSkillIds.includes(prereqId)
            )
        } else if (skill.prerequisites.type === 'OR_WEAPON_MASTERY_AND_DARKNESS') {
            // Requires at least one weapon mastery AND darkness mastery
            const weaponMasteries = ['sword_mastery', 'bow_mastery', 'staff_mastery', 'dagger_mastery']
            const hasWeaponMastery = weaponMasteries.some(weaponId => unlockedSkillIds.includes(weaponId))
            const hasDarknessMastery = unlockedSkillIds.includes('darkness_mastery')
            return hasWeaponMastery && hasDarknessMastery
        } else if (skill.prerequisites.type === 'ALL_LIGHT_MAGIC') {
            // Requires all light magic spells
            const lightMagicSpells = ['heal', 'cure', 'blessing', 'holy_light', 'light_mastery']
            return lightMagicSpells.every(spellId => unlockedSkillIds.includes(spellId))
        } else if (skill.prerequisites.type === 'THREE_TIER5_MAGIC') {
            // Requires any three Tier 5 magic mastery skills
            const tier5MagicMasteries = ['fire_supremacy', 'ice_supremacy', 'lightning_supremacy', 'earth_supremacy', 'wind_mastery', 'water_mastery', 'light_mastery', 'darkness_mastery']
            const unlockedMasteries = tier5MagicMasteries.filter(masteryId => unlockedSkillIds.includes(masteryId))
            return unlockedMasteries.length >= 3
        }

        return false
    }

    // Check if a skill is a profession skill
    isProfessionSkill(skillId) {
        // Check if the skill exists in any profession subcategory
        if (SKILLS_DATA.professions) {
            return Object.values(SKILLS_DATA.professions).some(skillArray =>
                skillArray.some(skill => skill.id === skillId)
            )
        }
        return false
    }

    // Get all unlocked skill IDs for a character
    getAllUnlockedSkillIds(character) {
        const allIds = []

        // Handle all categories (nested structure, including monster and racial)
        Object.entries(character.unlockedSkills).forEach(([category, categoryData]) => {
            if (category === 'racial') {
                // Racial skills are organized by race ID
                Object.values(categoryData).forEach(skillArray => {
                    allIds.push(...skillArray)
                })
            } else {
                // Standard nested structure for other categories
                Object.values(categoryData).forEach(skillArray => {
                    allIds.push(...skillArray)
                })
            }
        })

        return allIds
    }

    // Check if a specific skill is unlocked for a character
    isSkillUnlocked(character, skillId) {
        const unlockedSkillIds = this.getAllUnlockedSkillIds(character)
        return unlockedSkillIds.includes(skillId)
    }

    // Refund a skill (cascade refund for prerequisites)
    refundSkill(character, skillId) {
        const skill = findSkillById(skillId)
        if (!skill) {
            throw new Error(`Skill not found: ${skillId}`)
        }

        const category = this.findSkillCategory(skillId)
        const subcategory = this.findSkillSubcategory(skillId)

        // Handle different skill categories
        let unlockedSkillsArray
        if (category === 'racial') {
            unlockedSkillsArray = character.unlockedSkills.racial[subcategory]
        } else if (category === 'monster') {
            unlockedSkillsArray = character.unlockedSkills.monster[subcategory]
        } else {
            unlockedSkillsArray = character.unlockedSkills[category][subcategory]
        }

        // Check if skill is unlocked
        if (!unlockedSkillsArray.includes(skillId)) {
            throw new Error('Skill not unlocked')
        }

        // Find skills that depend on this one (cascade refund)
        const dependentSkills = this.findDependentSkills(character, skillId)

        // Refund all dependent skills first
        let totalRefund = 0
        for (const dependentId of dependentSkills) {
            const dependentSkill = findSkillById(dependentId)
            const refundAmount = Math.ceil(dependentSkill.cost * 0.75) // 75% refund, round up
            totalRefund += refundAmount

            const depCategory = this.findSkillCategory(dependentId)
            const depSubcategory = this.findSkillSubcategory(dependentId)

            // Handle different skill categories for dependents too
            let depUnlockedSkillsArray
            if (depCategory === 'racial') {
                depUnlockedSkillsArray = character.unlockedSkills.racial[depSubcategory]
            } else if (depCategory === 'monster') {
                depUnlockedSkillsArray = character.unlockedSkills.monster[depSubcategory]
            } else {
                depUnlockedSkillsArray = character.unlockedSkills[depCategory][depSubcategory]
            }

            // Remove from unlocked skills
            const index = depUnlockedSkillsArray.indexOf(dependentId)
            if (index > -1) {
                depUnlockedSkillsArray.splice(index, 1)
                character.totalSkillsUnlocked--
            }
        }

        // Refund the main skill (75% refund, round up)
        const mainRefundAmount = Math.ceil(skill.cost * 0.75)
        totalRefund += mainRefundAmount
        const index = unlockedSkillsArray.indexOf(skillId)
        if (index > -1) {
            unlockedSkillsArray.splice(index, 1)
            character.totalSkillsUnlocked--
        }

        // Add lumens back
        character.lumens += totalRefund
        character.totalLumensSpent -= totalRefund

        this.saveCharacter(character)
        return { character, refundedSkills: [skillId, ...dependentSkills], totalRefund }
    }

    // Find skills that depend on the given skill
    findDependentSkills(character, skillId) {
        const dependent = []
        const unlockedSkillIds = this.getAllUnlockedSkillIds(character)

        // Check all unlocked skills to see if they depend on this one
        for (const unlockedId of unlockedSkillIds) {
            if (unlockedId === skillId) continue

            const unlockedSkill = findSkillById(unlockedId)
            if (!unlockedSkill) continue

            // Check if this unlocked skill has the target skill as a prerequisite
            if (unlockedSkill.prerequisites.type === 'AND' || unlockedSkill.prerequisites.type === 'OR') {
                if (unlockedSkill.prerequisites.skills.includes(skillId)) {
                    dependent.push(unlockedId)
                    // Recursively find skills that depend on this dependent skill
                    dependent.push(...this.findDependentSkills(character, unlockedId))
                }
            }
        }

        // Remove duplicates
        return [...new Set(dependent)]
    }

    // Import character data (for save file imports)
    importCharacter(characterData) {
        try {
            // Validate character data structure
            if (!this.validateCharacterData(characterData)) {
                throw new Error('Invalid character data')
            }

            // Generate new ID to avoid conflicts
            characterData.id = this.generateId()
            characterData.lastPlayed = new Date().toISOString()

            this.saveCharacter(characterData)
            return characterData
        } catch (error) {
            console.error('Failed to import character:', error)
            throw error
        }
    }

    // Export character data
    exportCharacter(characterId) {
        const character = this.getAllCharacters().find(c => c.id === characterId)
        if (!character) {
            throw new Error('Character not found')
        }

        return JSON.stringify(character, null, 2)
    }

    // Validate character data structure
    validateCharacterData(data) {
        const required = ['name', 'stats', 'lumens', 'unlockedSkills']

        for (const field of required) {
            if (!data.hasOwnProperty(field)) {
                return false
            }
        }

        // Validate stats
        const requiredStats = ['strength', 'intelligence', 'speed', 'health', 'stamina', 'armorClass']
        for (const stat of requiredStats) {
            if (typeof data.stats[stat] !== 'number') {
                return false
            }
        }

        return true
    }

    // Get character summary for display
    getCharacterSummary(character) {
        const totalSkills = character.totalSkillsUnlocked
        const tierPoints = this.calculateTierPoints(character)
        const statPoints = this.calculateStatPoints(character)
        const totalPoints = tierPoints + statPoints
        const totalSpent = this.calculateCurrentInvestmentValue(character)
        const lastPlayed = new Date(character.lastPlayed).toLocaleDateString()

        return {
            name: character.name,
            level: this.calculateLevel(totalPoints),
            totalSkills,
            tierPoints,
            statPoints,
            totalPoints,
            totalSpent,
            lastPlayed,
            lumens: character.lumens
        }
    }

    // Calculate current value of all active upgrades (skills + stats)
    calculateCurrentInvestmentValue(character) {
        let totalValue = 0

        // Calculate cost of all unlocked skills
        const unlockedSkillIds = this.getAllUnlockedSkillIds(character)
        unlockedSkillIds.forEach(skillId => {
            const skill = findSkillById(skillId)
            if (skill) {
                totalValue += skill.cost
            }
        })

        // Calculate cost of all stat upgrades
        const stats = character.stats
        const startingValues = {
            hp: 10,
            stamina: 10,
            strength: -3,
            magicPower: -3,
            speed: 0,
            physicalDefence: 8,
            magicalDefence: 8
        }

        // Each stat upgrade costs increasing amounts
        Object.entries(stats).forEach(([statName, currentValue]) => {
            const startingValue = startingValues[statName] || 0
            const upgrades = currentValue - startingValue
            if (upgrades > 0) {
                // Calculate cumulative cost (1L for first upgrade, 2L for second, etc.)
                for (let i = 1; i <= upgrades; i++) {
                    totalValue += i
                }
            }
        })

        return totalValue
    }

    // Calculate total tier points for all unlocked skills
    calculateTierPoints(character) {
        let totalPoints = 0
        const unlockedSkillIds = this.getAllUnlockedSkillIds(character)

        unlockedSkillIds.forEach(skillId => {
            const skill = findSkillById(skillId)
            if (skill) {
                totalPoints += skill.tier // Tier 1 = 1 point, Tier 2 = 2 points, etc.
            }
        })

        return totalPoints
    }

    // Calculate total stat points for all stat upgrades
    calculateStatPoints(character) {
        let totalPoints = 0
        const stats = character.stats

        // Starting values for each stat
        const startingValues = {
            hp: 10,
            stamina: 10,
            strength: -3,
            magicPower: -3,
            speed: 0,
            physicalDefence: 8,
            magicalDefence: 8
        }

        // Each stat upgrade = 1 point
        Object.entries(stats).forEach(([statName, currentValue]) => {
            const startingValue = startingValues[statName] || 0
            const upgrades = currentValue - startingValue
            if (upgrades > 0) {
                totalPoints += upgrades
            }
        })

        return totalPoints
    }

    // Calculate character level based on total points (tier points + stat points)
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

    // Currency Management Functions
    getGil(character) {
        if (typeof character.gil !== 'number') {
            character.gil = 65  // Default starting Gil (balanced for early game)
        }
        return character.gil
    }

    // Check if character can afford an item
    canAfford(character, price) {
        const currentGil = this.getGil(character)

        // Price is now a simple number (Gil amount)
        const priceAmount = typeof price === 'number' ? price : 0

        return currentGil >= priceAmount
    }

    // Deduct Gil for purchase
    deductGil(character, price) {
        const priceAmount = typeof price === 'number' ? price : 0

        if (!this.canAfford(character, priceAmount)) {
            return false
        }

        character.gil -= priceAmount
        this.saveCharacter(character)
        return true
    }

    // Add Gil (for selling items, rewards, etc.)
    addGil(character, amount) {
        const addAmount = typeof amount === 'number' ? amount : 0
        character.gil = (character.gil || 0) + addAmount
        this.saveCharacter(character)
    }

    // Adjust Gil amount (for testing/admin purposes)
    adjustGil(character, amount) {
        character.gil = Math.max(0, (character.gil || 0) + amount)
        this.saveCharacter(character)
    }

    // Format Gil for display
    formatGil(amount) {
        const gilAmount = typeof amount === 'number' ? amount : 0
        return `${gilAmount} Gil`
    }

    // Check if any fusion skills are available for a character
    hasAvailableFusionSkills(character) {
        const allUnlockedSkills = this.getAllUnlockedSkillIds(character)

        // Check each fusion skill to see if prerequisites are met
        for (const [categoryName, fusionCategory] of Object.entries(SKILLS_DATA.fusion)) {
            for (const fusionSkill of fusionCategory) {
                // Skip if already unlocked
                const isAlreadyUnlocked = this.isSkillUnlocked(character, fusionSkill.id)
                if (isAlreadyUnlocked) continue

                // Check if prerequisites are met
                const prereqsMet = this.validateSkillPrerequisites(character, fusionSkill.id)
                if (prereqsMet) {
                    return true
                }
            }
        }

        return false
    }

    // Check if any fusion skills are unlocked for a character  
    hasUnlockedFusionSkills(character) {
        for (const fusionCategory of Object.values(character.unlockedSkills.fusion)) {
            if (fusionCategory.length > 0) {
                return true
            }
        }
        return false
    }

    // Check if any ultimate skills are available for a character
    hasAvailableUltimateSkills(character) {
        const allUnlockedSkills = this.getAllUnlockedSkillIds(character)

        // Check each ultimate skill to see if prerequisites are met
        for (const [categoryName, ultimateCategory] of Object.entries(SKILLS_DATA.ultimate)) {
            for (const ultimateSkill of ultimateCategory) {
                // Skip if already unlocked
                const isAlreadyUnlocked = this.isSkillUnlocked(character, ultimateSkill.id)
                if (isAlreadyUnlocked) continue

                // Check if prerequisites are met
                const prereqsMet = this.validateSkillPrerequisites(character, ultimateSkill.id)
                if (prereqsMet) {
                    return true
                }
            }
        }

        return false
    }

    // Check if any ultimate skills are unlocked for a character  
    hasUnlockedUltimateSkills(character) {
        if (!character.unlockedSkills.ultimate) return false
        for (const ultimateCategory of Object.values(character.unlockedSkills.ultimate)) {
            if (ultimateCategory.length > 0) {
                return true
            }
        }
        return false
    }

    // Get all available fusion skills for a character (unlocked or can be unlocked)
    getAvailableFusionSkills(character) {
        const availableSkills = []

        for (const [category, fusionSkills] of Object.entries(SKILLS_DATA.fusion)) {
            for (const fusionSkill of fusionSkills) {
                const isUnlocked = this.isSkillUnlocked(character, fusionSkill.id)
                const canUnlock = this.validateSkillPrerequisites(character, fusionSkill.id)

                if (isUnlocked || canUnlock) {
                    availableSkills.push({
                        ...fusionSkill,
                        category,
                        isUnlocked,
                        canUnlock
                    })
                }
            }
        }

        return availableSkills
    }

    // Folder Management Methods

    // Get all unique folders (including empty ones)
    getAllFolders() {
        // Get folders from characters
        const characters = this.getAllCharacters()
        const characterFolders = new Set(['Default']) // Ensure Default always exists

        characters.forEach(char => {
            if (char.folder) {
                characterFolders.add(char.folder)
            }
        })

        // Get manually created folders
        const storedFolders = this.getStoredFolders()
        storedFolders.forEach(folder => characterFolders.add(folder))

        return Array.from(characterFolders).sort()
    }

    // Get stored folders from localStorage
    getStoredFolders() {
        try {
            const saved = localStorage.getItem(this.foldersKey)
            return saved ? JSON.parse(saved) : []
        } catch (error) {
            console.error('Failed to load folders:', error)
            return []
        }
    }

    // Save folders to localStorage
    saveStoredFolders(folders) {
        try {
            localStorage.setItem(this.foldersKey, JSON.stringify(folders))
        } catch (error) {
            console.error('Failed to save folders:', error)
        }
    }

    // Get characters by folder
    getCharactersByFolder(folderName = 'Default') {
        const characters = this.getAllCharacters()
        return characters.filter(char => (char.folder || 'Default') === folderName)
    }

    // Move character to folder
    moveCharacterToFolder(characterId, folderName) {
        const characters = this.getAllCharacters()
        const charIndex = characters.findIndex(c => c.id === characterId)

        if (charIndex !== -1) {
            characters[charIndex].folder = folderName || 'Default'
            this.saveAllCharacters(characters)

            // Ensure folder is stored
            this.createFolder(folderName)

            return true
        }
        return false
    }

    // Create new folder
    createFolder(folderName) {
        if (!folderName || folderName.trim() === '') {
            return false
        }

        const trimmedName = folderName.trim()
        const storedFolders = this.getStoredFolders()

        if (!storedFolders.includes(trimmedName)) {
            storedFolders.push(trimmedName)
            this.saveStoredFolders(storedFolders)
        }

        return true
    }

    // Delete folder (moves all characters to Default)
    deleteFolder(folderName) {
        if (folderName === 'Default') {
            return false // Cannot delete default folder
        }

        const characters = this.getAllCharacters()
        let moved = false

        characters.forEach(char => {
            if (char.folder === folderName) {
                char.folder = 'Default'
                moved = true
            }
        })

        if (moved) {
            this.saveAllCharacters(characters)
        }

        // Remove from stored folders
        const storedFolders = this.getStoredFolders()
        const folderIndex = storedFolders.indexOf(folderName)
        if (folderIndex !== -1) {
            storedFolders.splice(folderIndex, 1)
            this.saveStoredFolders(storedFolders)
        }

        return true
    }

    // Set character race (permanent choice)
    setCharacterRace(character, raceId) {
        // Check if race is already set
        if (character.race !== null) {
            throw new Error('Character race is already set and cannot be changed')
        }

        // Check if character is a monster
        if (character.isMonster) {
            throw new Error('Monsters cannot have races')
        }

        // Validate race exists
        if (!window.RACES_DATA || !window.RACES_DATA[raceId]) {
            throw new Error(`Invalid race: ${raceId}`)
        }

        // Set the race
        character.race = raceId

        // Apply racial stat modifiers
        const raceData = window.RACES_DATA[raceId]
        if (raceData.statModifiers) {
            Object.keys(raceData.statModifiers).forEach(stat => {
                if (character.stats[stat] !== undefined) {
                    character.stats[stat] += raceData.statModifiers[stat]
                }
            })
        }

        // Update max HP and stamina if they were modified
        if (raceData.statModifiers?.hp) {
            character.maxHp += raceData.statModifiers.hp
            character.hp += raceData.statModifiers.hp
        }
        if (raceData.statModifiers?.stamina) {
            character.maxStamina += raceData.statModifiers.stamina
            character.stamina += raceData.statModifiers.stamina
        }

        // Initialize racial skills structure based on selected race
        if (!character.unlockedSkills.racial) {
            character.unlockedSkills.racial = {}
        }

        // Clear existing racial skills and set up only for the chosen race
        character.unlockedSkills.racial = {}
        character.unlockedSkills.racial[raceId] = []

        // Apply special racial abilities
        this.applyRacialAbilities(character, raceId)

        // Save the character
        this.saveCharacter(character)

        return character
    }

    // Apply special racial abilities and bonuses
    applyRacialAbilities(character, raceId) {
        // Initialize racial abilities if not present
        character.racialAbilities = character.racialAbilities || {}
        character.racialPassiveTraits = character.racialPassiveTraits || []

        // Get race data
        const raceData = window.RACES_DATA?.[raceId]
        if (!raceData) {
            console.warn(`Race data not found for: ${raceId}`)
            return
        }

        // Clear any existing racial passive traits (in case race was changed)
        character.racialPassiveTraits = []

        // Apply all passive traits from the race data
        if (raceData.passiveTraits && Array.isArray(raceData.passiveTraits)) {
            // For most races, use the standard passive traits
            character.racialPassiveTraits = [...raceData.passiveTraits]
        }

        // Apply race-specific mechanical implementations
        switch (raceId) {
            case 'elf':
                // Keen Senses: +1 Accuracy (already applied via statModifiers)
                // Magical Affinity: +1 Magic Power when using staves (handled in combat)
                character.racialAbilities.keenSenses = true
                character.racialAbilities.magicalAffinity = true
                character.racialAbilities.elvenLongevity = true
                break

            case 'dwarf':
                // Stone Sense: Detection abilities (handled in exploration)
                // Dwarven Resilience: Poison immunity (handled in status effects)
                // Master Craftsman: Crafting bonuses (handled in crafting system)
                character.racialAbilities.stoneSense = true
                character.racialAbilities.poisonImmunity = true
                character.racialAbilities.masterCraftsman = true
                break

            case 'halfling':
                // Lucky: Reroll 1s (handled in dice mechanics)
                // Small & Nimble: Movement bonuses (already applied via statModifiers)
                // Brave Heart: Fear immunity (handled in status effects)
                character.racialAbilities.lucky = true
                character.racialAbilities.smallAndNimble = true
                character.racialAbilities.braveHeart = true
                character.racialAbilities.fearImmunity = true
                break

            case 'orc':
                // Savage Critical: Extra damage on crits (handled in combat)
                // Relentless Endurance: Death save once per day (handled in combat)
                // Powerful Build: Melee damage bonus (handled in combat)
                character.racialAbilities.savageCritical = true
                character.racialAbilities.relentlessEndurance = true
                character.racialAbilities.relentlessEnduranceUsed = false // Tracks daily usage
                character.racialAbilities.powerfulBuild = true
                break

            case 'human':
                // Versatile Learning: Free weapon skill (granted immediately)
                this.grantFreeWeaponSkill(character)
                // Ambitious Spirit: 10% more lumens (handled in lumen calculations)
                // Cross-Cultural Learning: Learn other race tier-1 skills (handled in skill purchase)
                character.racialAbilities.versatileLearning = true
                character.racialAbilities.ambitiousSpirit = true
                character.racialAbilities.crossCulturalLearning = true
                break

            case 'dragonborn':
                // Draconic Heritage: Elemental choice (must be set during character creation)
                // Scaled Hide: Elemental resistance (handled in damage calculation)
                // Draconic Senses: Magical detection (handled in exploration)

                // Only set default element if none exists
                if (!character.racialAbilities.draconicElement) {
                    character.racialAbilities.draconicElement = 'fire' // Default fallback
                }
                character.racialAbilities.elementalResistance = character.racialAbilities.draconicElement
                character.racialAbilities.scaledHide = true
                character.racialAbilities.draconicSenses = true

                // Now customize the passive traits based on the element (after setting it)
                const element = character.racialAbilities.draconicElement
                const elementCapitalized = element.charAt(0).toUpperCase() + element.slice(1)

                character.racialPassiveTraits = [
                    `Draconic Heritage: Chosen elemental trait: ${elementCapitalized}`,
                    `Scaled Hide: Resistance to ${element} damage`,
                    `Draconic Senses: Can detect magical auras and see in dim light`
                ]
                break

            case 'tiefling':
                // Infernal Heritage: Fire immunity and charm resistance (handled in status/damage)
                // Darkvision: Perfect darkness vision (handled in exploration)
                // Fiendish Cunning: Social bonuses (handled in interactions)
                character.racialAbilities.fireImmunity = true
                character.racialAbilities.charmResistance = true
                character.racialAbilities.darkvision = true
                character.racialAbilities.fiendishCunning = true
                break

            case 'drow':
                // Superior Darkvision: Extended darkness vision (handled in exploration)
                // Sunlight Sensitivity: Accuracy penalty in bright light (handled in combat)
                // Poison Immunity: Complete poison immunity (handled in status effects)
                character.racialAbilities.superiorDarkvision = true
                character.racialAbilities.sunlightSensitivity = true
                character.racialAbilities.poisonImmunity = true
                break

            case 'gnoll':
                // Pack Tactics: Accuracy bonus with allies (handled in combat)
                // Keen Smell: Tracking and detection (handled in exploration)
                // Savage Instincts: Damage vs wounded enemies (handled in combat)
                character.racialAbilities.packTactics = true
                character.racialAbilities.keenSmell = true
                character.racialAbilities.savageInstincts = true
                break

            case 'monster':
                // Monster Nature: Set isMonster flag and apply monster-specific logic
                character.isMonster = true
                character.racialAbilities.monsterNature = true
                character.racialAbilities.aberrantForm = true
                character.racialAbilities.unnaturalVitality = true

                // Apply the same logic as toggleMonsterStatus when converting to monster
                this.applyMonsterConversion(character)
                break

            default:
                console.warn(`Unknown race for racial abilities: ${raceId}`)
                break
        }

        console.log(`Applied racial abilities for ${raceId}:`, character.racialAbilities)
        console.log(`Applied racial passive traits:`, character.racialPassiveTraits)
    }

    // Apply monster conversion logic (extracted from toggleMonsterStatus)
    applyMonsterConversion(character) {
        console.log("Converting character to monster:", character.name)

        // Refund all profession skills when becoming a monster
        if (character.unlockedSkills && character.unlockedSkills.professions) {
            Object.keys(character.unlockedSkills.professions).forEach(professionCategory => {
                const skills = character.unlockedSkills.professions[professionCategory]
                if (skills && skills.length > 0) {
                    // Calculate lumens to refund
                    let refundLumens = 0
                    skills.forEach(skillId => {
                        // For profession skills, refund full cost
                        refundLumens += 10 // Most profession skills cost 10 lumens
                    })

                    // Refund the lumens
                    character.lumens = (character.lumens || 0) + refundLumens

                    // Clear the profession skills
                    character.unlockedSkills.professions[professionCategory] = []

                    console.log(`Refunded ${refundLumens} lumens from ${professionCategory} profession skills`)
                }
            })
        }

        // Initialize monster skills structure
        if (!character.unlockedSkills.monster) {
            character.unlockedSkills.monster = {
                aberrant: [],
                draconic: [],
                undead: [],
                fiendish: [],
                elemental: [],
                beast: [],
                construct: [],
                psychic: []
            }
        }

        // Clear any conflicting elemental affinity skills (from the original toggle logic)
        if (character.unlockedSkills.magic) {
            const elementalCategories = ['fire', 'ice', 'lightning', 'earth', 'wind', 'water', 'darkness', 'light']
            elementalCategories.forEach(element => {
                if (character.unlockedSkills.magic[element]) {
                    const affinitySkills = character.unlockedSkills.magic[element].filter(skill =>
                        skill.includes('affinity') || skill.includes('mastery')
                    )
                    if (affinitySkills.length > 0) {
                        console.log(`Clearing ${element} affinity skills for monster conversion:`, affinitySkills)
                        character.unlockedSkills.magic[element] = character.unlockedSkills.magic[element].filter(skill =>
                            !skill.includes('affinity') && !skill.includes('mastery')
                        )
                    }
                }
            })
        }

        console.log("Monster conversion complete")
    }

    // Fix existing characters to have racial passive traits (migration function)
    fixExistingCharacterRacialTraits() {
        const characters = this.getAllCharacters()
        let fixedCount = 0

        characters.forEach(character => {
            // Skip monsters and characters without races
            if (character.isMonster || !character.race) {
                return
            }

            // Check if character already has racial passive traits
            if (!character.racialPassiveTraits || character.racialPassiveTraits.length === 0) {
                console.log(`Fixing racial traits for character: ${character.name} (${character.race})`)

                // Apply racial abilities to add missing passive traits
                this.applyRacialAbilities(character, character.race)

                // Save the updated character
                this.saveCharacter(character)
                fixedCount++
            }
        })

        if (fixedCount > 0) {
            console.log(`Fixed racial passive traits for ${fixedCount} characters`)
            return fixedCount
        } else {
            console.log('All characters already have proper racial passive traits')
            return 0
        }
    }

    // Debug function to view character's racial traits
    debugRacialTraits(character = null) {
        const char = character || this.getCurrentCharacter()
        if (!char) {
            console.log('No character selected')
            return
        }

        console.log(`=== Racial Traits Debug for ${char.name} ===`)
        console.log('Race:', char.race)
        console.log('Racial Passive Traits:', char.racialPassiveTraits)
        console.log('Racial Abilities:', char.racialAbilities)

        if (char.race && window.RACES_DATA?.[char.race]) {
            const raceData = window.RACES_DATA[char.race]
            console.log('Race Data Passive Traits:', raceData.passiveTraits)
            console.log('Race Data Stat Modifiers:', raceData.statModifiers)
        }

        return {
            race: char.race,
            appliedTraits: char.racialPassiveTraits,
            racialAbilities: char.racialAbilities,
            raceDataTraits: char.race && window.RACES_DATA?.[char.race]?.passiveTraits
        }
    }

    // Refresh racial passive traits for a character (useful for updating display)
    refreshRacialPassiveTraits(character = null) {
        const char = character || this.getCurrentCharacter()
        if (!char || !char.race) {
            console.log('No character with race found')
            return
        }

        console.log(`Refreshing racial passive traits for ${char.name} (${char.race})`)
        this.applyRacialAbilities(char, char.race)
        this.saveCharacter(char)

        // If this is the current character, update the UI
        if (char === this.getCurrentCharacter() && window.uiComponents) {
            window.uiComponents.renderCharacterSheet()
        }

        return char.racialPassiveTraits
    }

    // Force update all Dragonborn characters' passive traits display
    forceUpdateDragonbornTraits() {
        const characters = this.getAllCharacters()
        let updatedCount = 0

        characters.forEach(character => {
            if (character.race === 'dragonborn' && !character.isMonster) {
                console.log(`Force updating Dragonborn traits for: ${character.name}`)
                console.log(`Current element:`, character.racialAbilities?.draconicElement)
                console.log(`Current traits:`, character.racialPassiveTraits)

                // Reapply racial abilities to update the passive traits
                this.applyRacialAbilities(character, character.race)
                this.saveCharacter(character)
                updatedCount++

                console.log(`Updated traits:`, character.racialPassiveTraits)
            }
        })

        console.log(`Force updated ${updatedCount} Dragonborn characters`)

        // Refresh UI if current character is Dragonborn
        const currentChar = this.getCurrentCharacter()
        if (currentChar && currentChar.race === 'dragonborn' && window.uiComponents) {
            window.uiComponents.renderCharacterSheet()
        }

        return updatedCount
    }

    // Grant a free Tier 1 weapon skill to humans
    grantFreeWeaponSkill(character) {
        // Get all tier 1 weapon skills
        const weaponCategories = ['sword', 'axe', 'spear', 'dagger', 'bow', 'staff', 'polearm', 'hammer']
        const tier1WeaponSkills = []

        if (typeof SKILLS_DATA !== 'undefined' && SKILLS_DATA.weapons) {
            weaponCategories.forEach(category => {
                if (SKILLS_DATA.weapons[category]) {
                    const tier1Skills = SKILLS_DATA.weapons[category].filter(skill => skill.tier === 1)
                    tier1Skills.forEach(skill => {
                        tier1WeaponSkills.push({
                            skillId: skill.id,
                            category: category,
                            name: skill.name
                        })
                    })
                }
            })
        }

        if (tier1WeaponSkills.length > 0) {
            // For now, grant the first sword skill as default
            // This could be expanded to let players choose
            const defaultSkill = tier1WeaponSkills.find(skill => skill.category === 'sword') || tier1WeaponSkills[0]
            if (defaultSkill && !character.unlockedSkills.weapons[defaultSkill.category].includes(defaultSkill.skillId)) {
                character.unlockedSkills.weapons[defaultSkill.category].push(defaultSkill.skillId)
                console.log(`Human racial bonus: Granted free skill ${defaultSkill.name}`)
            }
        }
    }

    // Set dragonborn elemental heritage
    setDragonbornElement(character, element) {
        if (character.race !== 'dragonborn') {
            throw new Error('Only dragonborn can choose elemental heritage')
        }

        const validElements = ['fire', 'ice', 'lightning', 'acid', 'wind', 'light', 'dark']
        if (!validElements.includes(element)) {
            throw new Error(`Invalid element: ${element}. Valid elements: ${validElements.join(', ')}`)
        }

        character.racialAbilities = character.racialAbilities || {}
        character.racialAbilities.draconicElement = element
        character.racialAbilities.elementalResistance = element

        // Update the passive traits to reflect the chosen element
        const elementCapitalized = element.charAt(0).toUpperCase() + element.slice(1)
        character.racialPassiveTraits = [
            `Draconic Heritage: Chosen elemental trait: ${elementCapitalized}`,
            `Scaled Hide: Resistance to ${element} damage`,
            `Draconic Senses: Can detect magical auras and see in dim light`
        ]

        this.saveCharacter(character)
        return character
    }

    // Check if a character can learn cross-cultural skills (humans only)
    canLearnCrossCulturalSkills(character) {
        if (character.race !== 'human') return false
        if (!character.racialAbilities || !character.racialAbilities.crossCulturalLearning) return false

        // Must have learned Human Determination first to unlock cross-cultural learning
        const humanSkills = character.unlockedSkills.racial?.human || []
        return humanSkills.includes('human_determination')
    }

    // Get available cross-cultural skills for humans
    getAvailableCrossCulturalSkills(character) {
        if (!this.canLearnCrossCulturalSkills(character)) {
            return []
        }

        const availableSkills = []

        // Get tier 1 skills from all racial skill trees
        if (typeof window.RACE_SKILL_TREES !== 'undefined') {
            Object.keys(window.RACE_SKILL_TREES).forEach(raceKey => {
                if (raceKey === 'human') return // Skip human racial skills

                const raceSkills = window.RACE_SKILL_TREES[raceKey]
                const tier1Skills = raceSkills.filter(skill => skill.tier === 1)

                tier1Skills.forEach(skill => {
                    availableSkills.push({
                        ...skill,
                        sourceRace: raceKey
                    })
                })
            })
        }

        return availableSkills
    }

    // Apply dwarven crafting bonus
    applyDwarvenCraftingBonus(character, recipe) {
        if (character.race !== 'dwarf' ||
            !character.racialAbilities ||
            !character.racialAbilities.masterCraftsman) {
            return recipe
        }

        // Create a modified recipe with 1 less of each material (minimum 1)
        const modifiedRecipe = { ...recipe }
        if (modifiedRecipe.materials) {
            modifiedRecipe.materials = { ...modifiedRecipe.materials }
            Object.keys(modifiedRecipe.materials).forEach(material => {
                modifiedRecipe.materials[material] = Math.max(1, modifiedRecipe.materials[material] - 1)
            })
        }

        return modifiedRecipe
    }

    // Check if character can select a race
    canSelectRace(character) {
        return character && !character.isMonster && character.race === null
    }

    // Calculate racial elemental modifiers (for Dragonborn Scaled Hide, etc.)
    getRacialElementalModifiers(character) {
        const modifiers = {}

        // Initialize all elements to 0 (normal damage)
        const elements = ['fire', 'ice', 'lightning', 'earth', 'water', 'wind', 'light', 'darkness', 'poison']
        elements.forEach(element => modifiers[element] = 0)

        if (!character.race) {
            console.log('No race found for character:', character.name)
            return modifiers
        }

        console.log(`Calculating racial modifiers for ${character.name} (${character.race}):`, character.racialAbilities)

        switch (character.race) {
            case 'dragonborn':
                // Scaled Hide: 50% resistance to chosen element
                if (character.racialAbilities?.draconicElement) {
                    const element = character.racialAbilities.draconicElement
                    // Map 'dark' to 'darkness' for consistency with the elemental system
                    const elementKey = element === 'dark' ? 'darkness' : element
                    console.log(`Dragonborn element: ${element} -> system key: ${elementKey}`)
                    if (elements.includes(elementKey)) {
                        modifiers[elementKey] = -1 // 50% resistance
                        console.log(`Applied -1 resistance to ${elementKey}`)
                    } else {
                        console.warn(`Element ${elementKey} not found in elements array:`, elements)
                    }
                }
                break

            case 'tiefling':
                // Infernal Heritage: Fire immunity (could be implemented as -3)
                modifiers.fire = -3 // Immunity (0% damage)
                console.log('Applied fire immunity to Tiefling')
                break

            case 'drow':
                // Poison Immunity
                modifiers.poison = -3 // Immunity (0% damage)
                console.log('Applied poison immunity to Drow')
                break

            // Other races could have elemental affinities added here in the future
        }

        console.log('Final racial modifiers:', modifiers)
        return modifiers
    }

    // Get combined elemental profile including racial and skill modifiers
    getElementalProfile(character) {
        if (!window.monsterSystem) {
            console.warn('Monster system not available for elemental profile calculation')
            return null
        }

        // Get skill-based elemental modifiers
        const allSkills = this.getAllUnlockedSkillIds(character)
        const elementalSkills = allSkills.filter(skillId =>
            window.monsterSystem.isElementalAffinitySkill &&
            window.monsterSystem.isElementalAffinitySkill(skillId)
        )

        // Calculate skill-based profile
        const skillProfile = window.monsterSystem.calculateElementalProfile(elementalSkills)

        // Get racial elemental modifiers
        const racialModifiers = this.getRacialElementalModifiers(character)

        // Combine racial and skill modifiers
        const combinedModifiers = { ...skillProfile.modifiers }
        Object.entries(racialModifiers).forEach(([element, racialMod]) => {
            combinedModifiers[element] += racialMod
        })

        // Recategorize with combined modifiers
        const profile = {
            immunities: [],
            resistances: [],
            minorResistances: [],
            normalDamage: [],
            weaknesses: [],
            criticalWeaknesses: [],
            instantKills: [],
            modifiers: combinedModifiers,
            racialModifiers: racialModifiers // Include racial breakdown for display
        }

        Object.entries(combinedModifiers).forEach(([element, modifier]) => {
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
    }
}

// Create global instance
const characterManager = new CharacterManager()
window.characterManager = characterManager
