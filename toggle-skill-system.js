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
        flame_staff: {
            name: "Flame Staff",
            activationCost: 2,
            maintenanceCost: 2,
            description: "Toggle: Staff attacks deal +1d6 Fire Damage and have a 20% chance to apply Burn. Costs 2 Stamina to activate, 2 Stamina per turn to maintain."
        },
        storm_staff: {
            name: "Storm Staff",
            activationCost: 2,
            maintenanceCost: 2,
            description: "Toggle: Staff attacks deal +1d6 Lightning Damage and have a 20% chance to apply Incapacitated. Costs 2 Stamina to activate, 2 Stamina per turn to maintain."
        },
        shadow_staff: {
            name: "Shadow Staff",
            activationCost: 2,
            maintenanceCost: 2,
            description: "Toggle: Staff attacks deal +1d6 Darkness Damage and have a 20% chance to apply Mind Controlled (fear variant). Costs 2 Stamina to activate, 2 Stamina per turn to maintain."
        },
        light_staff: {
            name: "Light Staff",
            activationCost: 2,
            maintenanceCost: 2,
            description: "Toggle: Staff attacks deal +1d6 Light Damage and have a 20% chance to apply Mind Controlled (charm variant). Costs 2 Stamina to activate, 2 Stamina per turn to maintain."
        },

        // Sword toggle skills
        defensive_stance: {
            name: "Defensive Stance",
            activationCost: 1,
            maintenanceCost: 1,
            description: "Toggle: Defensive Stance - +2 Physical Defence but they lose -2 to accuracy against you. Costs 1 Stamina to activate, 1 Stamina per turn to maintain."
        },
        flame_edge: {
            name: "Flame Edge",
            activationCost: 2,
            maintenanceCost: 2,
            description: "Toggle: Sword attacks deal +1d6 Fire Damage and have a 20% chance to apply Burn. Costs 2 Stamina to activate, 2 Stamina per turn to maintain."
        },
        frostbrand: {
            name: "Frostbrand",
            activationCost: 2,
            maintenanceCost: 2,
            description: "Toggle: Sword attacks deal +1d6 Ice Damage and have a 20% chance to apply Immobilized. Costs 2 Stamina to activate, 2 Stamina per turn to maintain."
        },
        storm_blade: {
            name: "Storm Blade",
            activationCost: 2,
            maintenanceCost: 2,
            description: "Toggle: Sword attacks deal +1d6 Lightning Damage and have a 20% chance to apply Incapacitated. Costs 2 Stamina to activate, 2 Stamina per turn to maintain."
        },
        shadow_edge: {
            name: "Shadow Edge",
            activationCost: 2,
            maintenanceCost: 2,
            description: "Toggle: Sword attacks deal +1d6 Darkness Damage and have a 20% chance to apply Mind Controlled (fear variant). Costs 2 Stamina to activate, 2 Stamina per turn to maintain."
        },
        radiant_blade: {
            name: "Radiant Blade",
            activationCost: 2,
            maintenanceCost: 2,
            description: "Toggle: Sword attacks deal +1d6 Light Damage and have a 20% chance to apply Mind Controlled (charm variant). Costs 2 Stamina to activate, 2 Stamina per turn to maintain."
        },

        // Axe toggle skills
        berserker_rage: {
            name: "Berserker Rage",
            activationCost: 5,
            maintenanceCost: 2,
            description: "Toggle: Berserker Rage - +4 Strength and Physical Defence and additional basic attack. Costs 5 Stamina to activate, 2 Stamina per turn to maintain."
        },
        ricochet_axe: {
            name: "Ricochet Axe",
            activationCost: 3,
            maintenanceCost: 3,
            description: "Toggle: Ricochet Axe - Thrown axes bounce to hit 1 additional target within 15ft of original target. Costs 3 Stamina to activate, 3 Stamina per turn to maintain."
        },
        flame_axe: {
            name: "Flame Axe",
            activationCost: 2,
            maintenanceCost: 2,
            description: "Toggle: Axe attacks deal +1d6 Fire Damage and have a 20% chance to apply Burn. Costs 2 Stamina to activate, 2 Stamina per turn to maintain."
        },
        frost_axe: {
            name: "Frost Axe",
            activationCost: 2,
            maintenanceCost: 2,
            description: "Toggle: Axe attacks deal +1d6 Ice Damage and have a 20% chance to apply Immobilized. Costs 2 Stamina to activate, 2 Stamina per turn to maintain."
        },
        storm_axe: {
            name: "Storm Axe",
            activationCost: 2,
            maintenanceCost: 2,
            description: "Toggle: Axe attacks deal +1d6 Lightning Damage and have a 20% chance to apply Incapacitated. Costs 2 Stamina to activate, 2 Stamina per turn to maintain."
        },
        shadow_axe: {
            name: "Shadow Axe",
            activationCost: 2,
            maintenanceCost: 2,
            description: "Toggle: Axe attacks deal +1d6 Darkness Damage and have a 20% chance to apply Mind Controlled (fear variant). Costs 2 Stamina to activate, 2 Stamina per turn to maintain."
        },
        light_axe: {
            name: "Light Axe",
            activationCost: 2,
            maintenanceCost: 2,
            description: "Toggle: Axe attacks deal +1d6 Light Damage and have a 20% chance to apply Mind Controlled (charm variant). Costs 2 Stamina to activate, 2 Stamina per turn to maintain."
        },

        // Polearm toggle skills
        polearm_defensive_stance: {
            name: "Polearm Defensive Stance",
            activationCost: 1,
            maintenanceCost: 1,
            description: "Toggle: Polearm Defensive Stance - +2 Physical Defence but cannot move. Costs 1 Stamina to activate, 1 Stamina per turn to maintain."
        },
        fortress_stance: {
            name: "Fortress Stance",
            activationCost: 3,
            maintenanceCost: 3,
            description: "Toggle: Fortress Stance - +4 Physical Defence, reflect 50% damage back to attackers. Costs 3 Stamina to activate, 3 Stamina per turn to maintain."
        },
        flame_glaive: {
            name: "Flame Glaive",
            activationCost: 2,
            maintenanceCost: 2,
            description: "Toggle: Polearm attacks deal +1d6 Fire Damage and have a 20% chance to apply Burn. Costs 2 Stamina to activate, 2 Stamina per turn to maintain."
        },
        frost_halberd: {
            name: "Frost Halberd",
            activationCost: 2,
            maintenanceCost: 2,
            description: "Toggle: Polearm attacks deal +1d6 Ice Damage and have a 20% chance to apply Immobilized. Costs 2 Stamina to activate, 2 Stamina per turn to maintain."
        },
        storm_glaive: {
            name: "Storm Glaive",
            activationCost: 2,
            maintenanceCost: 2,
            description: "Toggle: Polearm attacks deal +1d6 Lightning Damage and have a 20% chance to apply Incapacitated. Costs 2 Stamina to activate, 2 Stamina per turn to maintain."
        },
        shadow_glaive: {
            name: "Shadow Glaive",
            activationCost: 2,
            maintenanceCost: 2,
            description: "Toggle: Polearm attacks deal +1d6 Darkness Damage and have a 20% chance to apply Mind Controlled (fear variant). Costs 2 Stamina to activate, 2 Stamina per turn to maintain."
        },
        light_glaive: {
            name: "Light Glaive",
            activationCost: 2,
            maintenanceCost: 2,
            description: "Toggle: Polearm attacks deal +1d6 Light Damage and have a 20% chance to apply Mind Controlled (charm variant). Costs 2 Stamina to activate, 2 Stamina per turn to maintain."
        },

        // Dagger toggle skills
        poison_blade: {
            name: "Poison Blade",
            activationCost: 2,
            maintenanceCost: 2,
            description: "Toggle: Poison Blade - Coat daggers with poison (escalating: 1→2→3 damage over 3 turns). Costs 2 Stamina to activate, 2 Stamina per turn to maintain."
        },
        flame_dagger: {
            name: "Flame Dagger",
            activationCost: 2,
            maintenanceCost: 2,
            description: "Toggle: Dagger attacks deal +1d6 Fire Damage and have a 20% chance to apply Burn. Costs 2 Stamina to activate, 2 Stamina per turn to maintain."
        },
        frost_dagger: {
            name: "Frost Dagger",
            activationCost: 2,
            maintenanceCost: 2,
            description: "Toggle: Dagger attacks deal +1d6 Ice Damage and have a 20% chance to apply Immobilized. Costs 2 Stamina to activate, 2 Stamina per turn to maintain."
        },
        storm_dagger: {
            name: "Storm Dagger",
            activationCost: 2,
            maintenanceCost: 2,
            description: "Toggle: Dagger attacks deal +1d6 Lightning Damage and have a 20% chance to apply Incapacitated. Costs 2 Stamina to activate, 2 Stamina per turn to maintain."
        },
        shadow_dagger: {
            name: "Shadow Dagger",
            activationCost: 2,
            maintenanceCost: 2,
            description: "Toggle: Dagger attacks deal +1d6 Darkness Damage and have a 20% chance to apply Mind Controlled (fear variant). Costs 2 Stamina to activate, 2 Stamina per turn to maintain."
        },
        light_dagger: {
            name: "Light Dagger",
            activationCost: 2,
            maintenanceCost: 2,
            description: "Toggle: Dagger attacks deal +1d6 Light Damage and have a 20% chance to apply Mind Controlled (charm variant). Costs 2 Stamina to activate, 2 Stamina per turn to maintain."
        },

        // Hammer toggle skills
        flame_hammer: {
            name: "Flame Hammer",
            activationCost: 2,
            maintenanceCost: 2,
            description: "Toggle: Hammer attacks deal +1d6 Fire Damage and have a 20% chance to apply Burn. Costs 2 Stamina to activate, 2 Stamina per turn to maintain."
        },
        frost_hammer: {
            name: "Frost Hammer",
            activationCost: 2,
            maintenanceCost: 2,
            description: "Toggle: Hammer attacks deal +1d6 Ice Damage and have a 20% chance to apply Immobilized. Costs 2 Stamina to activate, 2 Stamina per turn to maintain."
        },
        storm_hammer: {
            name: "Storm Hammer",
            activationCost: 2,
            maintenanceCost: 2,
            description: "Toggle: Hammer attacks deal +1d6 Lightning Damage and have a 20% chance to apply Incapacitated. Costs 2 Stamina to activate, 2 Stamina per turn to maintain."
        },
        shadow_hammer: {
            name: "Shadow Hammer",
            activationCost: 2,
            maintenanceCost: 2,
            description: "Toggle: Hammer attacks deal +1d6 Darkness Damage and have a 20% chance to apply Mind Controlled (fear variant). Costs 2 Stamina to activate, 2 Stamina per turn to maintain."
        },
        radiant_hammer: {
            name: "Radiant Hammer",
            activationCost: 2,
            maintenanceCost: 2,
            description: "Toggle: Hammer attacks deal +1d6 Light Damage and have a 20% chance to apply Mind Controlled (charm variant). Costs 2 Stamina to activate, 2 Stamina per turn to maintain."
        },

        // Bow toggle skills
        flame_arrow: {
            name: "Flame Arrow",
            activationCost: 2,
            maintenanceCost: 2,
            description: "Toggle: Ranged attacks deal +1d6 Fire Damage and have a 20% chance to apply Burn. Costs 2 Stamina to activate, 2 Stamina per turn to maintain."
        },
        frost_arrow: {
            name: "Frost Arrow",
            activationCost: 2,
            maintenanceCost: 2,
            description: "Toggle: Ranged attacks deal +1d6 Ice Damage and have a 20% chance to apply Immobilized. Costs 2 Stamina to activate, 2 Stamina per turn to maintain."
        },
        storm_arrow: {
            name: "Storm Arrow",
            activationCost: 2,
            maintenanceCost: 2,
            description: "Toggle: Ranged attacks deal +1d6 Lightning Damage and have a 20% chance to apply Incapacitated. Costs 2 Stamina to activate, 2 Stamina per turn to maintain."
        },
        shadow_arrow: {
            name: "Shadow Arrow",
            activationCost: 2,
            maintenanceCost: 2,
            description: "Toggle: Ranged attacks deal +1d6 Darkness Damage and have a 20% chance to apply Mind Controlled (fear variant). Costs 2 Stamina to activate, 2 Stamina per turn to maintain."
        },
        light_arrow: {
            name: "Light Arrow",
            activationCost: 2,
            maintenanceCost: 2,
            description: "Toggle: Ranged attacks deal +1d6 Light Damage and have a 20% chance to apply Mind Controlled (charm variant). Costs 2 Stamina to activate, 2 Stamina per turn to maintain."
        },

        // Racial toggle skills
        drow_poison: {
            name: "Drow Poison",
            activationCost: 3,
            maintenanceCost: 1,
            description: "Toggle: Drow Poison - Coat weapons with drow poison for entire combat encounter (medium chance of Daze effect + 1d4 poison damage). Costs 3 Stamina to activate, 1 Stamina per turn to maintain."
        },
        runic_weapon: {
            name: "Runic Weapon",
            activationCost: 8,
            maintenanceCost: 2,
            description: "Toggle: Runic Weapon - Inscribe runes on weapon (+2d6 damage, bypasses resistances for 10 attacks). Costs 8 Stamina to activate, 2 Stamina per turn to maintain."
        },

        // Magic toggle skills
        phoenix_form: {
            name: "Phoenix Form",
            activationCost: 10,
            maintenanceCost: 5,
            description: "Toggle: Phoenix Form - Transform into phoenix form. All basic attacks gain +1d4 Fire Damage. Costs 10 Stamina to activate, 5 Stamina per turn to maintain."
        }
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
