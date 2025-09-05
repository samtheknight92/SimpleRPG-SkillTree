// Dynamic Skill Bonuses System - Automatically parses skill descriptions for stat bonuses
class DynamicSkillBonusSystem {
    constructor() {
        // Map skill upgrade chains
        this.upgradeChains = this.initializeUpgradeChains()

        // Cache for parsed bonuses to avoid re-parsing
        this.bonusCache = new Map()
    }

    // Initialize skill upgrade chains - dynamically built from skill data
    initializeUpgradeChains() {
        const upgradeChains = {}

        // Get all skills from all categories
        const allSkills = []
        Object.values(SKILLS_DATA).forEach(category => {
            Object.values(category).forEach(subcategory => {
                if (Array.isArray(subcategory)) {
                    allSkills.push(...subcategory)
                }
            })
        })

        // Build upgrade chains from skills that have an 'upgrade' property
        allSkills.forEach(skill => {
            if (skill.upgrade) {
                upgradeChains[skill.upgrade] = skill.id
            }
        })

        return upgradeChains
    }

    // Parse skill description to extract stat bonuses
    parseSkillBonuses(skill) {
        if (!skill || !skill.desc) return null

        const desc = skill.desc.toLowerCase()

        // Only parse Passive and Toggle skills - ignore Action/Reaction skills
        // Also include skills that have stat bonuses but don't explicitly say "Passive:"
        if (!desc.includes('passive') && !desc.includes('toggle') && !desc.includes('+')) {
            return null
        }

        const bonuses = {}

        // Parse different stat patterns
        const statPatterns = {
            // Physical stats
            'strength': /\+(\d+)\s+(?:strength|str)/gi,
            'speed': /\+(\d+)\s+(?:speed|spd)/gi,
            'physicalDefence': /\+(\d+)\s+(?:physical\s+defence|physical\s+defense|ac|armor\s+class)/gi,
            'magicalDefence': /\+(\d+)\s+(?:magical\s+defence|magical\s+defense|magic\s+defence|magic\s+defense)/gi,

            // Combat stats
            'damage': /\+(\d+)\s+(?:damage|dmg)/gi,
            'accuracy': /\+(\d+)\s+(?:accuracy|acc)/gi,
            'attack': /\+(\d+)\s+(?:attack|atk)/gi,

            // Magic stats
            'magicPower': /\+(\d+)\s+(?:magic\s+power|magical\s+power|magic|magical)/gi,

            // Health/Stamina
            'hp': /\+(\d+)\s+(?:hp|health|hit\s+points)/gi,
            'stamina': /\+(\d+)\s+(?:max\s+)?(?:stamina|stam)/gi,

            // Special stats
            'stealth': /\+(\d+)\s+(?:stealth|stealth\s+checks)/gi,
            'reach': /\+(\d+)\s+(?:reach|range)/gi,
            'critical': /\+(\d+)%\s+(?:critical|crit)/gi,

            // Elemental resistances (positive values) - capture both percentage and modifier
            'fireResistance': /(?:fire|flame)\s+resistance\s+(\d+)%\s*(?:\(([+-]\d+)\))?/gi,
            'iceResistance': /(?:ice|cold|frost)\s+resistance\s+(\d+)%\s*(?:\(([+-]\d+)\))?/gi,
            'lightningResistance': /(?:lightning|electric|electrical)\s+resistance\s+(\d+)%\s*(?:\(([+-]\d+)\))?/gi,
            'earthResistance': /(?:earth|stone)\s+resistance\s+(\d+)%\s*(?:\(([+-]\d+)\))?/gi,
            'windResistance': /(?:wind|air)\s+resistance\s+(\d+)%\s*(?:\(([+-]\d+)\))?/gi,
            'waterResistance': /(?:water|aqua)\s+resistance\s+(\d+)%\s*(?:\(([+-]\d+)\))?/gi,
            'darknessResistance': /(?:darkness|dark|shadow)\s+resistance\s+(\d+)%\s*(?:\(([+-]\d+)\))?/gi,
            'lightResistance': /(?:light|radiant)\s+resistance\s+(\d+)%\s*(?:\(([+-]\d+)\))?/gi,

            // Elemental weaknesses (negative values) - capture both percentage and modifier
            'fireWeakness': /(?:fire|flame)\s+weakness\s+(\d+)%\s*(?:\(([+-]\d+)\))?/gi,
            'iceWeakness': /(?:ice|cold|frost)\s+weakness\s+(\d+)%\s*(?:\(([+-]\d+)\))?/gi,
            'lightningWeakness': /(?:lightning|electric|electrical)\s+weakness\s+(\d+)%\s*(?:\(([+-]\d+)\))?/gi,
            'earthWeakness': /(?:earth|stone)\s+weakness\s+(\d+)%\s*(?:\(([+-]\d+)\))?/gi,
            'windWeakness': /(?:wind|air)\s+weakness\s+(\d+)%\s*(?:\(([+-]\d+)\))?/gi,
            'waterWeakness': /(?:water|aqua)\s+weakness\s+(\d+)%\s*(?:\(([+-]\d+)\))?/gi,
            'darknessWeakness': /(?:darkness|dark|shadow)\s+weakness\s+(\d+)%\s*(?:\(([+-]\d+)\))?/gi,
            'lightWeakness': /(?:light|radiant)\s+weakness\s+(\d+)%\s*(?:\(([+-]\d+)\))?/gi
        }

        // Extract bonuses from description
        for (const [stat, pattern] of Object.entries(statPatterns)) {
            const matches = desc.match(pattern)
            if (matches) {
                if (stat.includes('Resistance') || stat.includes('Weakness')) {
                    // Handle elemental affinities with modifiers
                    // matches[1] = percentage, matches[2] = modifier (optional)
                    const percentage = parseInt(matches[1])
                    const modifier = matches[2] ? parseInt(matches[2]) : 0

                    // Store as object with both percentage and modifier
                    bonuses[stat] = {
                        percentage: percentage,
                        modifier: modifier
                    }
                } else {
                    // Handle regular stats
                    const maxBonus = Math.max(...matches.map(match => parseInt(match[1])))
                    bonuses[stat] = maxBonus
                }
            }
        }

        // Check for equipment requirements
        const equipmentPatterns = {
            'sword': /(?:while|when|with|wielding|equipped)\s+(?:a\s+)?sword/gi,
            'dagger': /(?:while|when|with|wielding|equipped)\s+(?:a\s+)?dagger/gi,
            'staff': /(?:while|when|with|wielding|using|equipped)\s+(?:a\s+)?staff/gi,
            'bow': /(?:while|when|with|wielding|equipped)\s+(?:a\s+)?bow/gi,
            'axe': /(?:while|when|with|wielding|equipped)\s+(?:a\s+)?axe/gi,
            'hammer': /(?:while|when|with|wielding|equipped)\s+(?:a\s+)?hammer/gi,
            'polearm': /(?:while|when|with|wielding|equipped)\s+(?:a\s+)?polearm/gi
        }

        // Check for multiple weapon requirements (e.g., "Bow or Staff")
        const multiWeaponPattern = /(?:when|while|with|wielding|equipped)\s+([^,]+)\s+or\s+([^,]+)/gi
        const multiWeaponMatch = desc.match(multiWeaponPattern)
        if (multiWeaponMatch) {
            // For now, we'll treat multi-weapon requirements as "any of these weapons"
            // This could be enhanced to check if ANY of the weapons are equipped
            equipmentRequirement = 'multi'
        }

        let equipmentRequirement = null
        for (const [equipment, pattern] of Object.entries(equipmentPatterns)) {
            if (desc.match(pattern)) {
                equipmentRequirement = equipment
                break
            }
        }

        // Return null if no bonuses found
        if (Object.keys(bonuses).length === 0) {
            return null
        }

        // Return bonus object with equipment requirement if applicable
        if (equipmentRequirement) {
            return {
                condition: equipmentRequirement,
                bonuses: bonuses
            }
        } else {
            return bonuses
        }
    }

    // Get cached or parse skill bonuses
    getSkillBonuses(skillId) {
        // Check cache first
        if (this.bonusCache.has(skillId)) {
            return this.bonusCache.get(skillId)
        }

        // Find skill and parse bonuses
        const skill = findSkillById(skillId)
        if (!skill) {
            this.bonusCache.set(skillId, null)
            return null
        }

        const bonuses = this.parseSkillBonuses(skill)
        this.bonusCache.set(skillId, bonuses)
        return bonuses
    }

    // Check if skill is a toggle skill
    isToggleSkill(skillId) {
        const skill = findSkillById(skillId)
        if (!skill) return false

        const desc = skill.desc.toLowerCase()
        return desc.includes('toggle:') || desc.includes('toggle skill')
    }

    // Filter out lower-tier skills that have been upgraded (same logic as UI)
    filterUpgradedSkills(skillIds, allUnlockedSkills) {
        const filteredSkills = []

        for (const skillId of skillIds) {
            let shouldInclude = true

            // Check if this skill has an upgraded version that the character has unlocked
            let currentSkillId = skillId
            while (this.upgradeChains[currentSkillId]) {
                const upgradedVersion = this.upgradeChains[currentSkillId]
                if (allUnlockedSkills.includes(upgradedVersion)) {
                    // Character has the upgraded version, exclude this lower version
                    shouldInclude = false
                    break
                }
                currentSkillId = upgradedVersion
            }

            if (shouldInclude) {
                filteredSkills.push(skillId)
            }
        }

        return filteredSkills
    }

    // Get the weapon type from equipped weapon
    getEquippedWeaponType(character) {
        const weapon = character.equipped?.primaryWeapon || character.equipped?.weapon // Legacy support
        if (!weapon) return null

        // Map weapon names to types (based on item data patterns)
        const weaponTypeMap = {
            'sword': 'sword',
            'blade': 'sword',
            'bow': 'bow',
            'staff': 'staff',
            'dagger': 'dagger',
            'hammer': 'hammer',
            'axe': 'axe',
            'polearm': 'polearm',
            'crossbow': 'crossbow'
        }

        // Check weapon name/id for type keywords
        const weaponName = weapon.name.toLowerCase()
        const weaponId = weapon.id.toLowerCase()

        for (const [keyword, type] of Object.entries(weaponTypeMap)) {
            if (weaponName.includes(keyword) || weaponId.includes(keyword)) {
                return type
            }
        }

        return null
    }

    // Calculate total skill bonuses for a character (dynamic parsing)
    calculateSkillBonuses(character) {
        if (!character || !character.unlockedSkills) {
            return {}
        }

        const bonuses = {
            hp: 0,
            stamina: 0,
            strength: 0,
            magicPower: 0,
            speed: 0,
            physicalDefence: 0,
            magicalDefence: 0,
            damage: 0,
            accuracy: 0,
            attack: 0,
            stealth: 0,
            reach: 0,
            critical: 0,
            // Elemental resistances and weaknesses
            fireResistance: 0,
            iceResistance: 0,
            lightningResistance: 0,
            earthResistance: 0,
            windResistance: 0,
            waterResistance: 0,
            darknessResistance: 0,
            lightResistance: 0,
            fireWeakness: 0,
            iceWeakness: 0,
            lightningWeakness: 0,
            earthWeakness: 0,
            windWeakness: 0,
            waterWeakness: 0,
            darknessWeakness: 0,
            lightWeakness: 0
        }

        // Get all unlocked skill IDs using the character manager
        const allUnlockedSkills = characterManager.getAllUnlockedSkillIds(character)

        // Filter out lower-tier skills that have been upgraded
        const filteredSkills = this.filterUpgradedSkills(allUnlockedSkills, allUnlockedSkills)

        // Get currently equipped weapon type for conditional bonuses
        const equippedWeaponType = this.getEquippedWeaponType(character)

        // Add bonuses from each filtered unlocked skill
        for (const skillId of filteredSkills) {
            const skillBonus = this.getSkillBonuses(skillId)
            if (skillBonus) {
                // Check if this skill has equipment requirements
                if (skillBonus.condition) {
                    // Skill has equipment requirements - check if they're met
                    let conditionMet = false

                    if (skillBonus.condition === 'multi') {
                        // Multi-weapon requirement (e.g., "Bow or Staff")
                        // Check if any of the weapons are equipped
                        const primaryWeapon = character.equipped?.primaryWeapon
                        const secondaryWeapon = character.equipped?.secondaryWeapon

                        if (primaryWeapon && (primaryWeapon.subcategory === 'bows' || primaryWeapon.subcategory === 'staves')) {
                            conditionMet = true
                        } else if (secondaryWeapon && (secondaryWeapon.subcategory === 'bows' || secondaryWeapon.subcategory === 'staves')) {
                            conditionMet = true
                        }
                    } else if (equippedWeaponType === skillBonus.condition) {
                        conditionMet = true
                    }

                    if (conditionMet) {
                        // Apply conditional bonuses
                        for (const [stat, bonus] of Object.entries(skillBonus.bonuses)) {
                            if (bonuses.hasOwnProperty(stat)) {
                                if (stat.includes('Resistance') || stat.includes('Weakness')) {
                                    // Handle elemental affinities with modifiers
                                    if (typeof bonus === 'object' && bonus.percentage !== undefined) {
                                        // Store the object with percentage and modifier
                                        bonuses[stat] = bonus
                                    } else {
                                        // Fallback for old format
                                        bonuses[stat] = bonus
                                    }
                                } else {
                                    // Handle regular stats
                                    bonuses[stat] += bonus
                                }
                            }
                        }
                    }
                } else {
                    // Skill has no equipment requirements - apply directly
                    for (const [stat, bonus] of Object.entries(skillBonus)) {
                        if (bonuses.hasOwnProperty(stat)) {
                            if (stat.includes('Resistance') || stat.includes('Weakness')) {
                                // Handle elemental affinities with modifiers
                                if (typeof bonus === 'object' && bonus.percentage !== undefined) {
                                    // Store the object with percentage and modifier
                                    bonuses[stat] = bonus
                                } else {
                                    // Fallback for old format
                                    bonuses[stat] = bonus
                                }
                            } else {
                                // Handle regular stats
                                bonuses[stat] += bonus
                            }
                        }
                    }
                }
            }
        }

        // Add bonuses from active toggle skills
        const activeToggleSkills = character.activeToggleSkills || []

        // Apply Human Determination racial ability
        if (character.race === 'human' && character.hp <= 5) {
            // Check if character has the human_determination skill
            const hasHumanDetermination = character.unlockedSkills &&
                character.unlockedSkills.racial &&
                character.unlockedSkills.racial.human &&
                character.unlockedSkills.racial.human.includes('human_determination')

            if (hasHumanDetermination) {
                bonuses.physicalDefence += 1
                bonuses.magicalDefence += 1
            }
        }
        const filteredToggleSkills = this.filterUpgradedSkills(activeToggleSkills, allUnlockedSkills)

        for (const skillId of filteredToggleSkills) {
            const skillBonus = this.getSkillBonuses(skillId)
            if (skillBonus && this.isToggleSkill(skillId)) {
                // Apply toggle skill bonuses directly (they have no conditions)
                if (skillBonus.condition) {
                    // Toggle skill with equipment requirement
                    if (equippedWeaponType === skillBonus.condition) {
                        for (const [stat, bonus] of Object.entries(skillBonus.bonuses)) {
                            if (bonuses.hasOwnProperty(stat)) {
                                bonuses[stat] += bonus
                            }
                        }
                    }
                } else {
                    // Toggle skill without equipment requirement
                    for (const [stat, bonus] of Object.entries(skillBonus)) {
                        if (bonuses.hasOwnProperty(stat)) {
                            bonuses[stat] += bonus
                        }
                    }
                }
            }
        }

        // Handle Dual Wield special case - accuracy penalty if not both daggers
        if (filteredSkills.includes('dual_wield')) {
            const primaryWeapon = character.equipped?.primaryWeapon
            const secondaryWeapon = character.equipped?.secondaryWeapon

            if (primaryWeapon && secondaryWeapon) {
                // Check if both weapons are daggers
                const bothDaggers = primaryWeapon.subcategory === 'daggers' && secondaryWeapon.subcategory === 'daggers'

                if (!bothDaggers) {
                    // Apply -6 accuracy penalty for non-dagger dual wielding
                    bonuses.accuracy -= 6
                }
            }
        }

        return bonuses
    }

    // Get bonus for a specific stat
    getStatBonus(character, statName) {
        const bonuses = this.calculateSkillBonuses(character)
        return bonuses[statName] || 0
    }

    // Get all skill bonuses as a formatted object
    getAllBonuses(character) {
        return this.calculateSkillBonuses(character)
    }

    // Get skills that provide bonuses to a specific stat (for debugging/display)
    getSkillsForStat(character, statName) {
        if (!character || !character.unlockedSkills) {
            return []
        }

        const allUnlockedSkills = characterManager.getAllUnlockedSkillIds(character)
        const skillsForStat = []

        for (const skillId of allUnlockedSkills) {
            const skillBonus = this.getSkillBonuses(skillId)
            if (skillBonus) {
                let hasBonus = false
                let bonusValue = 0

                if (skillBonus.condition) {
                    // Conditional skill
                    if (skillBonus.bonuses[statName]) {
                        hasBonus = true
                        bonusValue = skillBonus.bonuses[statName]
                    }
                } else {
                    // Direct skill
                    if (skillBonus[statName]) {
                        hasBonus = true
                        bonusValue = skillBonus[statName]
                    }
                }

                if (hasBonus) {
                    const skill = findSkillById(skillId)
                    if (skill) {
                        skillsForStat.push({
                            name: skill.name,
                            bonus: bonusValue,
                            conditional: !!skillBonus.condition
                        })
                    }
                }
            }
        }

        return skillsForStat
    }

    // Clear the bonus cache (useful for debugging or when skills are updated)
    clearCache() {
        this.bonusCache.clear()
    }

    // Debug function to show what bonuses were parsed from a skill
    debugSkillBonuses(skillId) {
        const skill = findSkillById(skillId)
        if (!skill) {
            console.log(`Skill not found: ${skillId}`)
            return
        }

        console.log(`Skill: ${skill.name}`)
        console.log(`Description: ${skill.desc}`)
        console.log(`Parsed bonuses:`, this.getSkillBonuses(skillId))

        // Test the regex patterns directly
        const desc = skill.desc.toLowerCase()
        console.log(`Lowercase description: ${desc}`)

        const physicalDefencePattern = /\+(\d+)\s+(?:physical\s+defence|physical\s+defense|ac|armor\s+class)/gi
        const matches = desc.match(physicalDefencePattern)
        console.log(`Physical Defence regex matches:`, matches)

        const swordPattern = /(?:while|when|with|wielding)\s+(?:a\s+)?sword/gi
        const swordMatches = desc.match(swordPattern)
        console.log(`Sword requirement regex matches:`, swordMatches)
    }
}

// Create global instance
window.dynamicSkillBonusSystem = new DynamicSkillBonusSystem()

// Optional: Replace the old system with the new one
// Uncomment the line below to use the dynamic system instead of the old one
window.skillBonusSystem = window.dynamicSkillBonusSystem
