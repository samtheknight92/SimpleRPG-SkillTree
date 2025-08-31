// Dynamic Skills System - Auto-discovers skill categories and subcategories
// This makes adding new weapon categories as simple as adding them to skills-data.js

class DynamicSkillsSystem {
    constructor() {
        this.skillCache = new Map()
        this.categoryCache = new Map()
    }

    /**
     * Get all available skill categories dynamically from SKILLS_DATA
     * @returns {Array} Array of category names
     */
    getAvailableCategories() {
        if (!window.SKILLS_DATA) {
            console.warn('SKILLS_DATA not loaded yet')
            return []
        }

        const categories = Object.keys(window.SKILLS_DATA)

        // Add racial category if race skill trees are available
        if (window.RACE_SKILL_TREES) {
            categories.push('racial')
        }

        return categories
    }

    /**
     * Get all subcategories for a given category
     * @param {string} category - The skill category
     * @param {Object} character - Current character (needed for racial skills)
     * @param {boolean} devMode - Whether in dev mode
     * @returns {Array} Array of subcategory names
     */
    getAvailableSubcategories(category, character = null, devMode = false) {
        if (!window.SKILLS_DATA && category !== 'racial') {
            return []
        }

        // Handle special cases
        if (category === 'racial') {
            return this.getRacialSubcategories(character, devMode)
        }

        if (category === 'monster') {
            return this.getMonsterSubcategories(character, devMode)
        }

        if (category === 'fusion') {
            return this.getFusionSubcategories(character, devMode)
        }

        if (category === 'ascension') {
            return this.getAscensionSubcategories(character, devMode)
        }

        // For standard categories, return the subcategories
        if (window.SKILLS_DATA[category]) {
            return Object.keys(window.SKILLS_DATA[category])
        }

        return []
    }

    /**
     * Get racial subcategories based on character and mode
     */
    getRacialSubcategories(character, devMode) {
        if (!window.RACE_SKILL_TREES) {
            return []
        }

        if (devMode) {
            // In dev mode, show all available races
            return Object.keys(window.RACE_SKILL_TREES)
        } else if (character && character.race) {
            // Normal mode: only show character's race
            return [character.race]
        }

        return []
    }

    /**
     * Get monster subcategories
     */
    getMonsterSubcategories(character, devMode) {
        if (!character?.isMonster && !devMode) {
            return []
        }

        // Return the standard monster categories
        return ['combat', 'defense', 'magic', 'utility']
    }

    /**
     * Get fusion subcategories (filtered by availability)
     */
    getFusionSubcategories(character, devMode) {
        if (!window.SKILLS_DATA.fusion) {
            return []
        }

        const subcategories = Object.keys(window.SKILLS_DATA.fusion)

        if (devMode) {
            return subcategories
        }

        // Filter to only show categories with available skills
        return subcategories.filter(subcategory =>
            this.hasFusionSkillsInCategory(character, subcategory)
        )
    }

    /**
     * Get ascension subcategories (level-gated unique skills)
     */
    getAscensionSubcategories(character, devMode) {
        if (!window.SKILLS_DATA.ascension) {
            return []
        }

        const subcategories = Object.keys(window.SKILLS_DATA.ascension)

        if (devMode) {
            return subcategories
        }

        // Filter to only show categories with available skills based on level
        return subcategories.filter(subcategory =>
            this.hasAscensionSkillsInCategory(character, subcategory)
        )
    }

    /**
     * Check if character has fusion skills available in a category
     */
    hasFusionSkillsInCategory(character, subcategory) {
        if (!character || !window.SKILLS_DATA.fusion?.[subcategory]) {
            return false
        }

        const fusionSkills = window.SKILLS_DATA.fusion[subcategory]
        const unlockedSkills = character.unlockedSkills || {}

        return fusionSkills.some(skill => {
            // Check if fusion skill is available based on prerequisites
            return this.isFusionSkillAvailable(skill, unlockedSkills)
        })
    }

    /**
     * Check if character has ascension skills available in a category
     */
    hasAscensionSkillsInCategory(character, subcategory) {
        if (!character || !window.SKILLS_DATA.ascension?.[subcategory]) {
            return false
        }

        const ascensionSkills = window.SKILLS_DATA.ascension[subcategory]
        const characterLevel = characterManager.calculateLevel(characterManager.calculateTierPoints(character) + characterManager.calculateStatPoints(character))

        return ascensionSkills.some(skill => {
            // Check if ascension skill is available based on level requirements
            return skill.prerequisites?.type === 'LEVEL' && characterLevel >= skill.prerequisites.level
        })
    }

    /**
     * Check if a fusion skill is available based on prerequisites
     */
    isFusionSkillAvailable(skill, unlockedSkills) {
        if (!skill.fusionRequirements) {
            return false
        }

        // Check if all required skills are unlocked
        return skill.fusionRequirements.every(reqGroup => {
            return reqGroup.skills.every(skillId => {
                // Find the skill in unlocked skills across all categories
                return Object.values(unlockedSkills).some(categorySkills =>
                    Object.values(categorySkills).some(subcatSkills =>
                        subcatSkills.includes(skillId)
                    )
                )
            })
        })
    }

    /**
     * Get display name for a category
     * @param {string} category - Category key
     * @returns {string} Human-readable category name
     */
    getCategoryDisplayName(category) {
        const displayNames = {
            'weapons': '⚔️ Weapons',
            'magic': '🔮 Magic',
            'professions': '🔨 Professions',
            'racial': '🏛️ Racial',
            'monster': '👹 Monster',
            'fusion': '💫 Fusion',
            'ascension': '⭐ Ascension'
        }

        return displayNames[category] || this.capitalizeFirst(category)
    }

    /**
     * Get display name for a subcategory
     * @param {string} subcategory - Subcategory key
     * @param {string} category - Parent category for context
     * @returns {string} Human-readable subcategory name
     */
    getSubcategoryDisplayName(subcategory, category = null) {
        // Weapon subcategory icons
        const weaponIcons = {
            'sword': '⚔️',
            'ranged': '🏹',
            'axe': '🪓',
            'staff': '🪄',
            'dagger': '🗡️',
            'polearm': '🔱',
            'hammer': '🔨',
            'unarmed': '👊'
        }

        // Magic subcategory icons
        const magicIcons = {
            'fire': '🔥',
            'ice': '❄️',
            'lightning': '⚡',
            'earth': '🌍',
            'wind': '💨',
            'water': '🌊',
            'darkness': '🌑',
            'light': '☀️'
        }

        // Professional subcategory icons
        const professionIcons = {
            'smithing': '⚒️',
            'alchemy': '🧪',
            'enchanting': '✨',
            'cooking': '🍳'
        }

        // Monster subcategory icons
        const monsterIcons = {
            'combat': '⚔️',
            'defense': '🛡️',
            'magic': '🔮',
            'utility': '🛠️'
        }

        // Racial names (these should use proper capitalization)
        const racialNames = {
            'elf': 'Elf',
            'dwarf': 'Dwarf',
            'human': 'Human',
            'orc': 'Orc',
            'halfling': 'Halfling',
            'dragonborn': 'Dragonborn',
            'tiefling': 'Tiefling',
            'drow': 'Drow',
            'gnoll': 'Gnoll'
        }

        // Choose the appropriate icon set based on category
        let icon = ''
        if (category === 'weapons' && weaponIcons[subcategory]) {
            icon = weaponIcons[subcategory] + ' '
        } else if (category === 'magic' && magicIcons[subcategory]) {
            icon = magicIcons[subcategory] + ' '
        } else if (category === 'professions' && professionIcons[subcategory]) {
            icon = professionIcons[subcategory] + ' '
        } else if (category === 'monster' && monsterIcons[subcategory]) {
            icon = monsterIcons[subcategory] + ' '
        }

        // Handle racial names specially
        if (category === 'racial' && racialNames[subcategory]) {
            return racialNames[subcategory]
        }

        return icon + this.capitalizeFirst(subcategory)
    }

    /**
     * Get the first available subcategory for a category
     * @param {string} category - Category name
     * @param {Object} character - Current character
     * @param {boolean} devMode - Whether in dev mode
     * @returns {string|null} First available subcategory or null
     */
    getDefaultSubcategory(category, character = null, devMode = false) {
        const subcategories = this.getAvailableSubcategories(category, character, devMode)
        return subcategories.length > 0 ? subcategories[0] : null
    }

    /**
     * Check if a category is available for the current character
     * @param {string} category - Category to check
     * @param {Object} character - Current character
     * @param {boolean} devMode - Whether in dev mode
     * @returns {boolean} Whether category is available
     */
    isCategoryAvailable(category, character = null, devMode = false) {
        if (category === 'racial') {
            // Hide racial category for monster characters since they have their own monster category
            if (character && character.isMonster) {
                return false
            }
            return (character && character.race && window.RACE_SKILL_TREES) ||
                (devMode && window.RACE_SKILL_TREES)
        }

        if (category === 'monster') {
            return (character && character.isMonster) || devMode
        }

        if (category === 'fusion') {
            const subcategories = this.getFusionSubcategories(character, devMode)
            return subcategories.length > 0
        }

        if (category === 'ascension') {
            const subcategories = this.getAscensionSubcategories(character, devMode)
            return subcategories.length > 0
        }

        return window.SKILLS_DATA && window.SKILLS_DATA[category]
    }

    /**
     * Capitalize first letter of a string
     */
    capitalizeFirst(str) {
        if (!str) return ''
        return str.charAt(0).toUpperCase() + str.slice(1)
    }

    /**
     * Get all skills for a category/subcategory combination
     * @param {string} category - Category name
     * @param {string} subcategory - Subcategory name  
     * @param {Object} character - Current character
     * @returns {Array} Array of skills
     */
    getSkillsForCategory(category, subcategory, character = null) {
        if (category === 'racial') {
            if (!window.RACE_SKILL_TREES || !subcategory) {
                return []
            }

            const raceKey = this.getRaceKeyFromId(subcategory)

            // Special handling for human cross-cultural skills
            if (character && character.race === 'human' &&
                typeof characterManager?.canLearnCrossCulturalSkills === 'function' &&
                characterManager.canLearnCrossCulturalSkills(character)) {

                const humanSkills = window.RACE_SKILL_TREES[raceKey] || []
                const crossCulturalSkills = characterManager.getAvailableCrossCulturalSkills(character) || []
                return [...humanSkills, ...crossCulturalSkills]
            }

            return window.RACE_SKILL_TREES[raceKey]?.skills || window.RACE_SKILL_TREES[raceKey] || []
        }

        if (window.SKILLS_DATA[category] && window.SKILLS_DATA[category][subcategory]) {
            return window.SKILLS_DATA[category][subcategory]
        }

        return []
    }

    /**
     * Get unlocked skills for a category/subcategory combination
     * @param {string} category - Category name
     * @param {string} subcategory - Subcategory name
     * @param {Object} character - Current character
     * @returns {Array} Array of unlocked skill IDs
     */
    getUnlockedSkillsForCategory(category, subcategory, character = null) {
        if (!character || !character.unlockedSkills) {
            return []
        }

        if (category === 'racial') {
            if (!character.unlockedSkills.racial) {
                return []
            }

            // Special handling for humans with cross-cultural skills
            if (character.race === 'human' &&
                typeof characterManager?.canLearnCrossCulturalSkills === 'function' &&
                characterManager.canLearnCrossCulturalSkills(character)) {
                return character.unlockedSkills.racial.human || []
            }

            return character.unlockedSkills.racial[subcategory] || []
        }

        if (character.unlockedSkills[category] && character.unlockedSkills[category][subcategory]) {
            return character.unlockedSkills[category][subcategory]
        }

        return []
    }

    /**
     * Convert race ID to race key for RACE_SKILL_TREES lookup
     */
    getRaceKeyFromId(raceId) {
        // This might need adjustment based on how race IDs map to keys
        return raceId // Assuming they're the same for now
    }

    /**
     * Ensure all skill structures exist for a character (useful for dev mode)
     * @param {Object} character - Character to initialize
     * @param {boolean} devMode - Whether in dev mode
     */
    ensureSkillStructures(character, devMode = false) {
        if (!devMode || !character) return

        // Ensure base unlocked skills structure
        if (!character.unlockedSkills) {
            character.unlockedSkills = {}
        }

        // Get all available categories and ensure their structures exist
        const categories = this.getAvailableCategories()

        categories.forEach(category => {
            if (!character.unlockedSkills[category]) {
                character.unlockedSkills[category] = {}
            }

            const subcategories = this.getAvailableSubcategories(category, character, devMode)
            subcategories.forEach(subcategory => {
                if (!character.unlockedSkills[category][subcategory]) {
                    character.unlockedSkills[category][subcategory] = []
                }
            })
        })

        // Special handling for racial skills
        if (!character.unlockedSkills.racial) {
            character.unlockedSkills.racial = {}
        }

        // If character has a race, ensure that race's skill array exists
        if (character.race && !character.unlockedSkills.racial[character.race]) {
            character.unlockedSkills.racial[character.race] = []
        }
    }

    /**
     * Clear any cached data (useful when skills data changes)
     */
    clearCache() {
        this.skillCache.clear()
        this.categoryCache.clear()
    }
}

// Create global instance
window.DynamicSkillsSystem = DynamicSkillsSystem
window.dynamicSkills = new DynamicSkillsSystem()
