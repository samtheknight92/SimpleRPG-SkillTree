// Toggle Skill System - Stamina-based toggle skills
// ================================================================

const TOGGLE_SKILL_SYSTEM = {

    // Toggle skill definitions with stamina costs
    toggleSkills: {
        // Staff toggle skills
        frost_staff: {
            name: "Frost Staff",
            activationCost: 2,  // Stamina cost to activate
            maintenanceCost: 2, // Stamina cost per turn to maintain
            description: "Toggle: Frost Staff - Channel frost magic through your staff. Costs 2 Stamina to activate, 2 Stamina per turn to maintain."
        },
        fire_staff: {
            name: "Fire Staff",
            activationCost: 3,
            maintenanceCost: 2,
            description: "Toggle: Fire Staff - Channel fire magic through your staff. Costs 3 Stamina to activate, 2 Stamina per turn to maintain."
        },

        // Sword toggle skills
        defensive_stance: {
            name: "Defensive Stance",
            activationCost: 1,
            maintenanceCost: 1,
            description: "Toggle: Defensive Stance - +2 Physical Defence but -2 attack damage. Costs 1 Stamina to activate, 1 Stamina per turn to maintain."
        },

        // Axe toggle skills
        berserker_rage: {
            name: "Berserker Rage",
            activationCost: 5,
            maintenanceCost: 2,
            description: "Toggle: Berserker Rage - +4 Strength and Physical Defence and additional basic attack. Costs 5 Stamina to activate, 2 Stamina per turn to maintain."
        },

        // Polearm toggle skills
        polearm_defensive_stance: {
            name: "Polearm Defensive Stance",
            activationCost: 1,
            maintenanceCost: 1,
            description: "Toggle: Polearm Defensive Stance - +2 AC but cannot move. Costs 1 Stamina to activate, 1 Stamina per turn to maintain."
        },
        fortress_stance: {
            name: "Fortress Stance",
            activationCost: 3,
            maintenanceCost: 3,
            description: "Toggle: Fortress Stance - +4 AC, reflect 50% damage back to attackers. Costs 3 Stamina to activate, 3 Stamina per turn to maintain."
        },

        // Dagger toggle skills
        poison_blade: {
            name: "Poison Blade",
            activationCost: 2,
            maintenanceCost: 2,
            description: "Toggle: Poison Blade - Coat daggers with poison (escalating: 1→2→3 damage over 3 turns). Costs 2 Stamina to activate, 2 Stamina per turn to maintain."
        },

        // Axe toggle skills
        ricochet_axe: {
            name: "Ricochet Axe",
            activationCost: 3,
            maintenanceCost: 3,
            description: "Toggle: Ricochet Axe - Thrown axes bounce to hit 1 additional target within 15ft of original target. Costs 3 Stamina to activate, 3 Stamina per turn to maintain."
        },

        // Add more toggle skills as needed
    },

    // Check if a skill is a toggle skill
    isToggleSkill(skillId) {
        return this.toggleSkills.hasOwnProperty(skillId)
    },

    // Get toggle skill data
    getToggleSkillData(skillId) {
        return this.toggleSkills[skillId] || null
    },

    // Check if character can afford to activate a toggle skill
    canAffordActivation(character, skillId) {
        const toggleData = this.getToggleSkillData(skillId)
        if (!toggleData) return false

        return character.stamina >= toggleData.activationCost
    },

    // Check if character can afford to maintain all active toggle skills
    canAffordMaintenance(character) {
        if (!character.activeToggleSkills || character.activeToggleSkills.length === 0) {
            return true
        }

        const totalMaintenanceCost = character.activeToggleSkills.reduce((total, skillId) => {
            const toggleData = this.getToggleSkillData(skillId)
            return total + (toggleData ? toggleData.maintenanceCost : 0)
        }, 0)

        return character.stamina >= totalMaintenanceCost
    },

    // Activate a toggle skill (consume activation stamina)
    activateToggleSkill(character, skillId) {
        const toggleData = this.getToggleSkillData(skillId)
        if (!toggleData) {
            console.error('Not a valid toggle skill:', skillId)
            return false
        }

        if (!this.canAffordActivation(character, skillId)) {
            console.error('Cannot afford activation cost for:', skillId)
            return false
        }

        // Consume activation stamina
        character.stamina -= toggleData.activationCost

        // Ensure stamina doesn't go below 0
        character.stamina = Math.max(0, character.stamina)

        console.log(`Activated ${skillId}, consumed ${toggleData.activationCost} stamina. Remaining: ${character.stamina}`)
        return true
    },

    // Maintain active toggle skills (consume maintenance stamina)
    maintainToggleSkills(character) {
        if (!character.activeToggleSkills || character.activeToggleSkills.length === 0) {
            return { success: true, deactivatedSkills: [] }
        }

        const deactivatedSkills = []
        let totalCost = 0

        // Calculate total maintenance cost
        character.activeToggleSkills.forEach(skillId => {
            const toggleData = this.getToggleSkillData(skillId)
            if (toggleData) {
                totalCost += toggleData.maintenanceCost
            }
        })

        // Check if character can afford maintenance
        if (character.stamina < totalCost) {
            // Cannot afford maintenance - deactivate all toggle skills
            deactivatedSkills.push(...character.activeToggleSkills)
            character.activeToggleSkills = []
            console.log(`Cannot afford maintenance cost (${totalCost}), deactivated all toggle skills`)
        } else {
            // Can afford maintenance - consume stamina
            character.stamina -= totalCost
            console.log(`Maintained toggle skills, consumed ${totalCost} stamina. Remaining: ${character.stamina}`)
        }

        return { success: true, deactivatedSkills }
    },

    // Get total maintenance cost for all active toggle skills
    getTotalMaintenanceCost(character) {
        if (!character.activeToggleSkills || character.activeToggleSkills.length === 0) {
            return 0
        }

        return character.activeToggleSkills.reduce((total, skillId) => {
            const toggleData = this.getToggleSkillData(skillId)
            return total + (toggleData ? toggleData.maintenanceCost : 0)
        }, 0)
    },

    // Get maintenance cost for a specific skill
    getMaintenanceCost(skillId) {
        const toggleData = this.getToggleSkillData(skillId)
        return toggleData ? toggleData.maintenanceCost : 0
    },

    // Get activation cost for a specific skill
    getActivationCost(skillId) {
        const toggleData = this.getToggleSkillData(skillId)
        return toggleData ? toggleData.activationCost : 0
    },

    // Format toggle skill description with costs
    formatToggleDescription(skillId) {
        const toggleData = this.getToggleSkillData(skillId)
        if (!toggleData) return null

        return `${toggleData.description}\n\nActivation: ${toggleData.activationCost} Stamina\nMaintenance: ${toggleData.maintenanceCost} Stamina per turn`
    }
}

// Make it available globally
if (typeof window !== 'undefined') {
    window.TOGGLE_SKILL_SYSTEM = TOGGLE_SKILL_SYSTEM
}

// For Node.js environments
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TOGGLE_SKILL_SYSTEM
}
