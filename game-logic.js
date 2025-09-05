// Game Logic - Handles calculations, rules, and game mechanics
class GameLogic {
    constructor() {
        // Base costs and formulas
        this.baseCosts = {
            statUpgrade: 10,  // Base cost for first stat upgrade
            skillTier: 5      // Base cost per tier (5L, 10L, 15L, etc.)
        }

        // Progression multipliers
        this.progressionRates = {
            statCostMultiplier: 1.2,  // Each stat upgrade costs 20% more
            maxStatValue: 50          // Maximum stat value
        }
    }

    // Calculate stat upgrade cost based on current value
    getStatUpgradeCost(currentValue, statName) {
        // Special HP milestone system - keep flat 3L cost
        if (statName === 'hp') {
            return this.getHPUpgradeCost(currentValue)
        }

        // Special Stamina milestone system - keep flat 5L cost
        if (statName === 'stamina') {
            return this.getStaminaUpgradeCost(currentValue)
        }

        // Get starting value for this stat
        const startingValues = {
            hp: 10,
            stamina: 10,
            strength: -3,
            magicPower: -3,
            accuracy: -3,
            speed: 2,
            physicalDefence: 8,
            magicalDefence: 8
        }

        const startingValue = startingValues[statName] || 0
        const upgradeLevel = currentValue - startingValue

        // New tiered pricing system
        if (upgradeLevel < 0) return 0 // No cost for values below starting values

        // Tier 1 Stats (High Impact) - Max 400L
        if (statName === 'accuracy') {
            const costs = [8, 12, 18, 25, 35, 50, 70, 100, 140, 200, 400]
            return costs[Math.min(upgradeLevel, costs.length - 1)]
        }
        if (statName === 'speed') {
            const costs = [6, 10, 15, 22, 30, 45, 65, 90, 140, 400]
            return costs[Math.min(upgradeLevel, costs.length - 1)]
        }

        // Tier 2 Stats (Medium Impact) - Max 300L
        if (statName === 'strength' || statName === 'magicPower') {
            const costs = [5, 8, 12, 18, 25, 35, 50, 70, 100, 150, 300]
            return costs[Math.min(upgradeLevel, costs.length - 1)]
        }

        // Tier 3 Stats (Low Impact) - Max 200L
        if (statName === 'physicalDefence' || statName === 'magicalDefence') {
            const costs = [3, 6, 10, 15, 20, 30, 45, 200]
            return costs[Math.min(upgradeLevel, costs.length - 1)]
        }

        // Fallback to old system for any other stats
        return Math.floor(this.baseCosts.statUpgrade * Math.pow(this.progressionRates.statCostMultiplier, upgradeLevel))
    }

    // HP Milestone Bonus System - flat 3L per HP with bonus HP at milestones
    getHPUpgradeCost(currentHP) {
        return 3 // Flat 3 lumens per HP point
    }

    // Stamina Milestone System - flat 5L per stamina (more expensive than HP)
    getStaminaUpgradeCost(currentStamina) {
        return 5 // Flat 5 lumens per stamina point (more expensive than HP)
    }

    // Calculate milestone bonus HP to add when reaching certain thresholds
    getMilestoneBonus(newHP, character) {
        const milestones = [
            { threshold: 25, bonus: 5, flag: 'hp25' },   // At HP 25: +5 bonus (30 total)
            { threshold: 50, bonus: 10, flag: 'hp50' },  // At HP 50: +10 bonus (60 total) 
            { threshold: 100, bonus: 25, flag: 'hp100' }, // At HP 100: +25 bonus (125 total)
            { threshold: 200, bonus: 25, flag: 'hp200' }, // At HP 200: +25 bonus (225 total)
            { threshold: 300, bonus: 25, flag: 'hp300' }, // At HP 300: +25 bonus (325 total)
            { threshold: 400, bonus: 25, flag: 'hp400' }, // At HP 400: +25 bonus (425 total)
            { threshold: 500, bonus: 25, flag: 'hp500' } // At HP 500: +25 bonus (525 total)
        ]

        for (const milestone of milestones) {
            if (newHP === milestone.threshold) {
                // Check if this milestone has already been achieved
                if (character.hpMilestones && !character.hpMilestones[milestone.flag]) {
                    return { bonus: milestone.bonus, flag: milestone.flag }
                }
            }
        }
        return { bonus: 0, flag: null }
    }

    // Calculate stamina milestone bonus to add when reaching certain thresholds
    getStaminaMilestoneBonus(newStamina, character) {
        const milestones = [
            { threshold: 15, bonus: 3, flag: 'stamina15' }, // At Stamina 15: +3 bonus (18 total)
            { threshold: 25, bonus: 5, flag: 'stamina25' }, // At Stamina 25: +5 bonus (30 total)
            { threshold: 40, bonus: 10, flag: 'stamina40' }, // At Stamina 40: +10 bonus (50 total)
            { threshold: 60, bonus: 15, flag: 'stamina60' } // At Stamina 60: +15 bonus (75 total)
        ]

        for (const milestone of milestones) {
            if (newStamina === milestone.threshold) {
                // Check if this milestone has already been achieved
                if (character.staminaMilestones && !character.staminaMilestones[milestone.flag]) {
                    return { bonus: milestone.bonus, flag: milestone.flag }
                }
            }
        }
        return { bonus: 0, flag: null }
    }

    // Get minimum HP based on achieved milestones (prevents refund exploit but allows normal refunding)
    getMinimumHP(character) {
        let minHP = 10 // Base minimum

        if (character.hpMilestones) {
            // Minimum increases by exactly the amounts you specified (capped at 25 bonus)
            if (character.hpMilestones.hp25) minHP = Math.max(minHP, 15)   // After HP 25 milestone
            if (character.hpMilestones.hp50) minHP = Math.max(minHP, 25)   // After HP 50 milestone  
            if (character.hpMilestones.hp100) minHP = Math.max(minHP, 50)  // After HP 100 milestone
            if (character.hpMilestones.hp200) minHP = Math.max(minHP, 75)  // After HP 200 milestone (+25 bonus)
            if (character.hpMilestones.hp300) minHP = Math.max(minHP, 100) // After HP 300 milestone (+25 bonus)
            if (character.hpMilestones.hp400) minHP = Math.max(minHP, 125) // After HP 400 milestone (+25 bonus)
            if (character.hpMilestones.hp500) minHP = Math.max(minHP, 150) // After HP 500 milestone (+25 bonus)
        }

        return minHP
    }

    // Get minimum Stamina based on achieved milestones (prevents refund exploit but allows normal refunding)
    getMinimumStamina(character) {
        let minStamina = 10 // Base minimum

        if (character.staminaMilestones) {
            // Minimum increases by the bonus amount to protect milestone bonuses
            if (character.staminaMilestones.stamina15) minStamina = Math.max(minStamina, 13) // 10 + 3 bonus = 13 minimum
            if (character.staminaMilestones.stamina25) minStamina = Math.max(minStamina, 15) // 10 + 5 bonus = 15 minimum
            if (character.staminaMilestones.stamina40) minStamina = Math.max(minStamina, 20) // 10 + 10 bonus = 20 minimum
            if (character.staminaMilestones.stamina60) minStamina = Math.max(minStamina, 25) // 10 + 15 bonus = 25 minimum
        }

        return minStamina
    }

    // Calculate derived stats (Speed AC bonus)
    calculateDerivedStats(baseStats) {
        const speedACBonus = Math.floor(baseStats.speed * 0.25)

        return {
            totalPhysicalDefence: baseStats.physicalDefence + speedACBonus,
            totalMagicalDefence: baseStats.magicalDefence + speedACBonus,
            speedACBonus: speedACBonus
        }
    }

    // Validate stat upgrade
    canUpgradeStat(character, statName) {
        const currentValue = character.stats[statName]
        const cost = this.getStatUpgradeCost(currentValue, statName)

        // Define max values based on README spec
        let maxValue
        switch (statName) {
            case 'hp':
                maxValue = 250 // New milestone system allows up to 250 HP total (200 purchased + 50 bonus)
                break
            case 'stamina':
                maxValue = 50 // Reasonable max for Stamina
                break
            case 'strength':
            case 'magicPower':
                maxValue = 8 // README spec: -3 to +8
                break
            case 'speed':
                maxValue = 12 // Speed cap at 12
                break
            case 'physicalDefence':
            case 'magicalDefence':
                maxValue = 16 // PD/MD cap at 16
                break
            default:
                maxValue = this.progressionRates.maxStatValue
        }

        return {
            canUpgrade: character.lumens >= cost && currentValue < maxValue,
            cost: cost,
            atMaxLevel: currentValue >= maxValue,
            insufficientFunds: character.lumens < cost
        }
    }

    // Calculate skill efficiency (cost per tier)
    getSkillEfficiency(skill) {
        return skill.cost / skill.tier
    }

    // Calculate character power level
    calculatePowerLevel(character) {
        const statTotal = character.stats.hp + character.stats.stamina +
            character.stats.strength + character.stats.magicPower +
            character.stats.speed + character.stats.physicalDefence +
            character.stats.magicalDefence
        const skillCount = character.totalSkillsUnlocked
        const tierBonus = this.calculateTierBonus(character)

        return Math.floor((statTotal * 2) + (skillCount * 5) + tierBonus)
    }

    // Calculate tier bonus based on unlocked skills
    calculateTierBonus(character) {
        let tierBonus = 0

        Object.values(character.unlockedSkills).forEach(category => {
            Object.values(category).forEach(skillIds => {
                skillIds.forEach(skillId => {
                    const skill = findSkillById(skillId)
                    if (skill) {
                        tierBonus += skill.tier * 2 // 2 points per tier
                    }
                })
            })
        })

        return tierBonus
    }

    // Calculate recommended next purchase
    getRecommendedPurchases(character, limit = 5) {
        const recommendations = []

        // Check all available skills
        Object.entries(SKILLS_DATA).forEach(([category, subcategoriesOrSkills]) => {
            if (category === 'monster') {
                // Handle monster skills (direct array)
                subcategoriesOrSkills.forEach(skill => {
                    // Safely check for unlocked skills
                    const categorySkills = character.unlockedSkills?.[category] || []
                    const isUnlocked = categorySkills.includes(skill.id)

                    if (!isUnlocked &&
                        characterManager.validateSkillPrerequisites(character, skill.id) &&
                        character.lumens >= skill.cost) {

                        const efficiency = this.getSkillEfficiency(skill)
                        recommendations.push({
                            type: 'skill',
                            id: skill.id,
                            name: skill.name,
                            cost: skill.cost,
                            category: category,
                            subcategory: 'monster',
                            efficiency: efficiency,
                            tier: skill.tier
                        })
                    }
                })
            } else {
                // Handle other categories (nested structure)
                Object.entries(subcategoriesOrSkills).forEach(([subcategory, skills]) => {
                    skills.forEach(skill => {
                        // Safely check for unlocked skills
                        const categorySkills = character.unlockedSkills?.[category]?.[subcategory] || []
                        const isUnlocked = categorySkills.includes(skill.id)

                        if (!isUnlocked &&
                            characterManager.validateSkillPrerequisites(character, skill.id) &&
                            character.lumens >= skill.cost) {

                            const efficiency = this.getSkillEfficiency(skill)
                            recommendations.push({
                                type: 'skill',
                                id: skill.id,
                                name: skill.name,
                                cost: skill.cost,
                                category: category,
                                subcategory: subcategory,
                                efficiency: efficiency,
                                tier: skill.tier
                            })
                        }
                    })
                })
            }
        });

        // Check stat upgrades
        ['hp', 'stamina', 'strength', 'magicPower', 'speed', 'physicalDefence', 'magicalDefence'].forEach(stat => {
            const upgrade = this.canUpgradeStat(character, stat)
            if (upgrade.canUpgrade) {
                recommendations.push({
                    type: 'stat',
                    id: stat,
                    name: `${this.getStatDisplayName(stat)} Upgrade`,
                    cost: upgrade.cost,
                    efficiency: 1 / upgrade.cost, // Inverse for sorting
                    currentValue: character.stats[stat]
                })
            }
        })

        // Sort by efficiency (higher tier skills and cheaper upgrades first)
        recommendations.sort((a, b) => {
            if (a.type === 'skill' && b.type === 'skill') {
                return b.tier - a.tier || a.cost - b.cost
            } else if (a.type === 'stat' && b.type === 'stat') {
                return a.cost - b.cost
            } else if (a.type === 'skill') {
                return -1 // Prioritize skills
            } else {
                return 1
            }
        })

        return recommendations.slice(0, limit)
    }

    // Calculate total investment in a skill tree
    getSkillTreeInvestment(character, category, subcategory) {
        let unlockedSkills

        if (category === 'monster') {
            unlockedSkills = character.unlockedSkills[category]
        } else {
            unlockedSkills = character.unlockedSkills[category][subcategory]
        }

        let totalCost = 0
        let highestTier = 0

        unlockedSkills.forEach(skillId => {
            const skill = findSkillById(skillId)
            if (skill) {
                totalCost += skill.cost
                highestTier = Math.max(highestTier, skill.tier)
            }
        })

        return {
            totalCost,
            skillCount: unlockedSkills.length,
            highestTier,
            averageTier: unlockedSkills.length > 0 ? totalCost / (unlockedSkills.length * 5) : 0
        }
    }

    // Calculate mastery level for each category
    getMasteryLevels(character) {
        const masteryLevels = {}

        Object.entries(SKILLS_DATA).forEach(([category, subcategoriesOrSkills]) => {
            if (category === 'monster') {
                // Handle monster skills (direct array)
                masteryLevels[category] = {}
                const unlockedSkills = character.unlockedSkills[category]
                const investment = this.getSkillTreeInvestment(character, category, 'monster')

                const masteryPercent = (unlockedSkills.length / subcategoriesOrSkills.length) * 100
                const tierProgress = investment.highestTier / 5 * 100 // Assuming max tier 5

                masteryLevels[category]['monster'] = {
                    percent: Math.floor(masteryPercent),
                    tierProgress: Math.floor(tierProgress),
                    skillCount: `${unlockedSkills.length}/${subcategoriesOrSkills.length}`,
                    investment: investment.totalCost
                }
            } else {
                // Handle other categories (nested structure)
                masteryLevels[category] = {}

                Object.entries(subcategoriesOrSkills).forEach(([subcategory, allSkills]) => {
                    const unlockedSkills = character.unlockedSkills[category][subcategory]
                    const investment = this.getSkillTreeInvestment(character, category, subcategory)

                    const masteryPercent = (unlockedSkills.length / allSkills.length) * 100
                    const tierProgress = investment.highestTier / 5 * 100 // Assuming max tier 5

                    masteryLevels[category][subcategory] = {
                        percent: Math.floor(masteryPercent),
                        tierProgress: Math.floor(tierProgress),
                        skillCount: `${unlockedSkills.length}/${allSkills.length}`,
                        investment: investment.totalCost
                    }
                })
            }
        })

        return masteryLevels
    }

    // Calculate stamina usage efficiency
    getStaminaEfficiency(character) {
        const maxStamina = character.stats.stamina
        let totalStaminaCost = 0
        let activeSkills = 0

        Object.values(character.unlockedSkills).forEach(category => {
            Object.values(category).forEach(skillIds => {
                skillIds.forEach(skillId => {
                    const skill = findSkillById(skillId)
                    if (skill && skill.staminaCost > 0) {
                        totalStaminaCost += skill.staminaCost
                        activeSkills++
                    }
                })
            })
        })

        const averageStaminaCost = activeSkills > 0 ? totalStaminaCost / activeSkills : 0
        const usageRatio = maxStamina > 0 ? averageStaminaCost / maxStamina : 0

        return {
            maxStamina,
            totalStaminaCost,
            activeSkills,
            averageStaminaCost: Math.round(averageStaminaCost * 10) / 10,
            usageRatio: Math.round(usageRatio * 100),
            efficiency: activeSkills > 0 ? Math.round((maxStamina / averageStaminaCost) * 10) / 10 : 0
        }
    }

    // Get build suggestions based on character focus
    getBuildSuggestions(character) {
        const suggestions = []

        // Analyze current character build
        const stats = character.stats
        const masteryLevels = this.getMasteryLevels(character)

        // Determine primary focus
        const highestStat = Math.max(stats.strength, stats.magicDefence, stats.speed)
        let buildType = 'balanced'

        if (stats.strength === highestStat && stats.strength > stats.magicDefence + 3) {
            buildType = 'warrior'
        } else if (stats.magicDefence === highestStat && stats.magicDefence > stats.strength + 3) {
            buildType = 'mage'
        } else if (stats.speed === highestStat && stats.speed > Math.max(stats.strength, stats.magicDefence) + 3) {
            buildType = 'rogue'
        }

        // Generate suggestions based on build type
        switch (buildType) {
            case 'warrior':
                suggestions.push({
                    type: 'focus',
                    title: 'Warrior Build Detected',
                    description: 'Consider focusing on weapon skills and strength upgrades',
                    recommendations: [
                        'Prioritize sword or axe skills for high damage',
                        'Increase strength for more health',
                        'Learn defensive skills for survivability'
                    ]
                })
                break

            case 'mage':
                suggestions.push({
                    type: 'focus',
                    title: 'Mage Build Detected',
                    description: 'Consider focusing on magic skills and Magic Defence upgrades',
                    recommendations: [
                        'Specialize in one magic school first',
                        'Increase Magic Defence for more stamina',
                        'Learn utility spells for versatility'
                    ]
                })
                break

            case 'rogue':
                suggestions.push({
                    type: 'focus',
                    title: 'Rogue Build Detected',
                    description: 'Consider focusing on speed and ranged combat',
                    recommendations: [
                        'Master bow skills for ranged damage',
                        'Increase speed for better AC',
                        'Learn evasive and mobility skills'
                    ]
                })
                break

            default:
                suggestions.push({
                    type: 'focus',
                    title: 'Balanced Build',
                    description: 'Consider specializing in one area for better efficiency',
                    recommendations: [
                        'Choose a primary combat style',
                        'Focus stats that support your chosen style',
                        'Unlock synergistic skills'
                    ]
                })
        }

        // Check for inefficiencies
        const staminaEff = this.getStaminaEfficiency(character)
        if (staminaEff.usageRatio > 80) {
            suggestions.push({
                type: 'warning',
                title: 'High Stamina Usage',
                description: 'Your skills require a lot of stamina relative to your pool',
                recommendations: [
                    'Consider increasing Magic Defence for more stamina',
                    'Look for stamina-efficient skills',
                    'Balance active and passive abilities'
                ]
            })
        }

        // Check for unused lumens
        if (character.lumens > 50 && this.getRecommendedPurchases(character, 1).length > 0) {
            suggestions.push({
                type: 'opportunity',
                title: 'Unspent Lumens',
                description: 'You have lumens available for upgrades',
                recommendations: [
                    'Check the recommended purchases',
                    'Consider upgrading core stats',
                    'Unlock prerequisite skills for higher tiers'
                ]
            })
        }

        return suggestions
    }

    // Calculate optimal skill path to a target skill
    getSkillPath(character, targetSkillId) {
        const targetSkill = findSkillById(targetSkillId)
        if (!targetSkill) return null

        const path = []
        const visited = new Set()

        // Recursive function to build path
        const buildPath = (skillId) => {
            if (visited.has(skillId)) return
            visited.add(skillId)

            const skill = findSkillById(skillId)
            if (!skill) return

            // Check if already unlocked
            const category = characterManager.findSkillCategory(skillId)
            const subcategory = characterManager.findSkillSubcategory(skillId)

            let isUnlocked
            if (category === 'monster') {
                const categorySkills = character.unlockedSkills?.[category] || []
                isUnlocked = categorySkills.includes(skillId)
            } else {
                const categorySkills = character.unlockedSkills?.[category]?.[subcategory] || []
                isUnlocked = categorySkills.includes(skillId)
            }

            if (isUnlocked) {
                return
            }

            // Add prerequisites first
            if (skill.prerequisites.type !== 'NONE') {
                skill.prerequisites.skills.forEach(prereqId => {
                    buildPath(prereqId)
                })
            }

            // Add current skill
            path.push({
                skill: skill,
                cost: skill.cost,
                category: category,
                subcategory: subcategory
            })
        }

        buildPath(targetSkillId)

        // Calculate total cost
        const totalCost = path.reduce((sum, item) => sum + item.cost, 0)

        return {
            path: path,
            totalCost: totalCost,
            canAfford: character.lumens >= totalCost,
            stepsRequired: path.length
        }
    }

    // Validate character build for common issues
    validateBuild(character) {
        const issues = []
        const warnings = []
        const suggestions = []

        // Check for extremely unbalanced stats
        const stats = [character.stats.strength, character.stats.magicDefence, character.stats.speed]
        const maxStat = Math.max(...stats)
        const minStat = Math.min(...stats)

        if (maxStat - minStat > 15) {
            warnings.push('Very unbalanced stat distribution detected')
        }

        // Check for orphaned skill investments
        Object.entries(character.unlockedSkills).forEach(([category, subcategories]) => {
            Object.entries(subcategories).forEach(([subcategory, skillIds]) => {
                if (skillIds.length === 1) {
                    const skill = findSkillById(skillIds[0])
                    if (skill && skill.tier === 1) {
                        suggestions.push(`Consider expanding ${subcategory} tree - only one skill unlocked`)
                    }
                }
            })
        })

        // Check stamina efficiency
        const staminaEff = this.getStaminaEfficiency(character)
        if (staminaEff.activeSkills > 0 && staminaEff.efficiency < 2) {
            issues.push('Low stamina efficiency - consider increasing Magic Defence')
        }

        // Check for no skills unlocked
        if (character.totalSkillsUnlocked === 0 && character.lumens >= 5) {
            issues.push('No skills unlocked yet - consider learning some basic abilities')
        }

        // Check for poor resource allocation
        const totalLumensSpent = character.totalLumensSpent || 0
        const lumensInStats = this.calculateLumensSpentOnStats(character)
        const lumensInSkills = totalLumensSpent - lumensInStats

        if (lumensInStats > lumensInSkills * 2 && totalLumensSpent > 50) {
            warnings.push('Heavy stat investment - consider balancing with more skills')
        }

        if (lumensInSkills > lumensInStats * 3 && totalLumensSpent > 50) {
            warnings.push('Heavy skill investment - consider some stat upgrades for survivability')
        }

        // Check for conflicting build choices
        const buildType = this.determineBuildType(character)
        const skillCategories = this.getSkillCategoryDistribution(character)

        if (buildType === 'Warrior' && skillCategories.magic > skillCategories.weapons) {
            warnings.push('Warrior build with more magic skills than weapon skills')
        }

        if (buildType === 'Mage' && skillCategories.weapons > skillCategories.magic) {
            warnings.push('Mage build with more weapon skills than magic skills')
        }

        // Check for survivability issues
        if (character.stats.hp < 15 && character.stats.physicalDefence < 10 && totalLumensSpent > 30) {
            issues.push('Low survivability - consider investing in HP or Physical Defence')
        }

        // Check for toggle skill overuse
        const toggleSkills = this.countToggleSkills(character)
        if (toggleSkills > character.stats.stamina / 3) {
            warnings.push('Many toggle skills relative to stamina - may have resource issues')
        }

        // Check for tier distribution
        const tierDistribution = this.getSkillTierDistribution(character)
        if (tierDistribution.tier5 > 0 && tierDistribution.tier1 + tierDistribution.tier2 < 3) {
            suggestions.push('Consider more low-tier skills for better resource efficiency')
        }

        return {
            isValid: issues.length === 0,
            issues: issues,
            warnings: warnings,
            suggestions: suggestions,
        }
    }

    // Helper methods for build validation
    calculateLumensSpentOnStats(character) {
        let total = 0
        const baseCost = 4
        const multiplier = 1.2

        // Calculate costs for each stat upgrade
        Object.entries(character.stats).forEach(([statName, currentValue]) => {
            const startingValue = this.getStartingStat(statName)
            const upgrades = Math.max(0, currentValue - startingValue)

            for (let i = 0; i < upgrades; i++) {
                total += Math.ceil(baseCost * Math.pow(multiplier, i))
            }
        })

        return total
    }

    getStartingStat(statName) {
        const startingStats = {
            hp: 10,
            stamina: 10,
            strength: -3,
            magicPower: -3,
            speed: 0,
            physicalDefence: 8,
            magicalDefence: 8
        }
        return startingStats[statName] || 0
    }

    getSkillCategoryDistribution(character) {
        const distribution = { weapons: 0, magic: 0, professions: 0 }

        Object.entries(character.unlockedSkills || {}).forEach(([category, subcategories]) => {
            Object.entries(subcategories).forEach(([subcategory, skillIds]) => {
                distribution[category] = (distribution[category] || 0) + skillIds.length
            })
        })

        return distribution
    }

    countToggleSkills(character) {
        let toggleCount = 0
        const allUnlockedSkills = this.getAllUnlockedSkillIds(character)

        allUnlockedSkills.forEach(skillId => {
            const skill = findSkillById(skillId)
            if (skill && skill.desc && skill.desc.toLowerCase().includes('toggle')) {
                toggleCount++
            }
        })

        return toggleCount
    }

    getSkillTierDistribution(character) {
        const distribution = { tier1: 0, tier2: 0, tier3: 0, tier4: 0, tier5: 0 }
        const allUnlockedSkills = this.getAllUnlockedSkillIds(character)

        allUnlockedSkills.forEach(skillId => {
            const skill = findSkillById(skillId)
            if (skill) {
                distribution[`tier${skill.tier}`] = (distribution[`tier${skill.tier}`] || 0) + 1
            }
        })

        return distribution
    }

    getAllUnlockedSkillIds(character) {
        const allSkills = []
        Object.values(character.unlockedSkills || {}).forEach(subcategories => {
            Object.values(subcategories).forEach(skillIds => {
                allSkills.push(...skillIds)
            })
        })
        return allSkills
    }

    // Generate character export summary
    generateExportSummary(character) {
        const powerLevel = this.calculatePowerLevel(character)
        const masteryLevels = this.getMasteryLevels(character)
        const buildValidation = this.validateBuild(character)

        return {
            name: character.name,
            powerLevel: powerLevel,
            totalSkills: character.totalSkillsUnlocked,
            totalSpent: character.totalLumensSpent,
            lumensRemaining: character.lumens,
            stats: character.stats,
            masteryLevels: masteryLevels,
            buildType: this.determineBuildType(character),
            isValid: buildValidation.isValid,
            issues: buildValidation.issues.length,
            created: character.created,
            lastPlayed: character.lastPlayed
        }
    }

    // Determine primary build type
    determineBuildType(character) {
        const stats = character.stats
        const highestPhysical = Math.max(stats.strength, stats.hp)
        const highestMagical = stats.magicPower
        const highestSpeed = stats.speed

        if (highestPhysical > highestMagical + 2 && highestPhysical > highestSpeed + 2) {
            return 'Warrior'
        } else if (highestMagical > highestPhysical + 2 && highestMagical > highestSpeed + 2) {
            return 'Mage'
        } else if (highestSpeed > highestPhysical + 2 && highestSpeed > highestMagical + 2) {
            return 'Rogue'
        } else {
            return 'Balanced'
        }
    }

    // Get display name for stats with proper icons (README spec)
    getStatDisplayName(statName) {
        const statNames = {
            hp: '❤️ HP',
            stamina: '⚡ Stamina',
            strength: '💪 Strength',
            magicPower: '✨ Magic Power',
            speed: '🏃 Speed',
            physicalDefence: '🛡 Physical Defence',
            magicalDefence: '🔮 Magical Defence'
        }
        return statNames[statName] || statName
    }

    // ==============================================
    // WEAPON DAMAGE SYSTEM
    // ==============================================

    // Parse dice notation (e.g., "2d6", "1d4", "4d12")
    parseDiceNotation(diceString) {
        if (!diceString || typeof diceString !== 'string') return null

        const match = diceString.match(/^(\d+)d(\d+)(?:\+(\d+))?$/)
        if (!match) return null

        return {
            count: parseInt(match[1]),
            sides: parseInt(match[2]),
            bonus: match[3] ? parseInt(match[3]) : 0
        }
    }

    // Roll dice and return total
    rollDice(diceString) {
        const dice = this.parseDiceNotation(diceString)
        if (!dice) return 0

        let total = dice.bonus
        for (let i = 0; i < dice.count; i++) {
            total += Math.floor(Math.random() * dice.sides) + 1
        }
        return total
    }

    // Get average damage for display purposes
    getAverageDamage(diceString) {
        const dice = this.parseDiceNotation(diceString)
        if (!dice) return 0

        const averagePerDie = (dice.sides + 1) / 2
        return dice.count * averagePerDie + dice.bonus
    }

    // Format damage range for display (e.g., "2d6 (2-12)")
    formatDamageRange(diceString) {
        const dice = this.parseDiceNotation(diceString)
        if (!dice) return 'No damage'

        const min = dice.count + dice.bonus
        const max = dice.count * dice.sides + dice.bonus
        const average = Math.round(this.getAverageDamage(diceString) * 10) / 10

        return `${diceString} (${min}-${max}, avg: ${average})`
    }

    // Calculate weapon damage with character bonuses
    calculateWeaponDamage(weapon, character) {
        if (!weapon || !weapon.damage) return 0

        const baseDamage = this.rollDice(weapon.damage)
        const strengthBonus = character ? (character.stats.strength || 0) : 0

        return Math.max(1, baseDamage + Math.floor(strengthBonus / 2))
    }

    // Auto-calculate weapon damage based on stats if no damage property exists
    getWeaponDamage(weapon) {
        if (!weapon || weapon.type !== 'weapon') return null

        // If weapon has explicit damage, use it
        if (weapon.damage) {
            return weapon.damage
        }

        // Auto-calculate based on weapon strength and rarity
        const strength = weapon.statModifiers?.strength || 1
        const rarity = weapon.rarity || 'common'

        // Base damage calculation
        let baseDice = '1d4'

        // Strength-based scaling
        if (strength >= 6) {
            baseDice = '4d12'      // Dragon blade level
        } else if (strength >= 5) {
            baseDice = '3d8'       // Epic weapons
        } else if (strength >= 4) {
            baseDice = '2d8'       // Strong weapons
        } else if (strength >= 3) {
            baseDice = '1d12'      // Elemental weapons
        } else if (strength >= 2) {
            baseDice = '1d8'       // Better weapons
        } else if (strength >= 1) {
            baseDice = '1d6'       // Basic weapons
        }

        // Rarity modifier
        if (rarity === 'legendary') {
            // Upgrade dice: 1d4→2d4, 1d6→2d6, 1d8→2d8, 1d12→2d12, 2d8→3d8
            if (baseDice.includes('d12')) baseDice = baseDice.replace('1d12', '2d12').replace('2d8', '3d8')
            else if (baseDice.includes('d8')) baseDice = baseDice.replace('1d8', '2d8').replace('2d8', '3d8')
            else if (baseDice.includes('d6')) baseDice = baseDice.replace('1d6', '2d6')
            else if (baseDice.includes('d4')) baseDice = baseDice.replace('1d4', '2d4')
        } else if (rarity === 'epic') {
            // Smaller upgrade for epic
            if (baseDice === '1d8') baseDice = '2d6'
            else if (baseDice === '1d6') baseDice = '1d8+1'
        }

        return baseDice
    }
}

// Create global instance
const gameLogic = new GameLogic()
window.gameLogic = gameLogic
