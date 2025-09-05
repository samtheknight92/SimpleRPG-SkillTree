// Status Effects Data - Conditions and temporary effects

// -----------------------------------------------------------------------------
// Status Effect Application Chance Rule (ALL Skills)
// -----------------------------------------------------------------------------
// If any skill "may apply" a status effect, the chance is based on the skill's tier:
//   - Tier 2: 20% chance
//   - Tier 3: 40% chance
//   - Tier 4: 75% chance
//   - Tier 5: 95% chance
// All status effect chances must be written as:
//   "Has a X% chance to apply [Status Effect] ([reference to status-effects.js])"
// Do not invent new status effects or durations; always reference this file.
// This rule applies to ALL skills, not just fusion skills.
// -----------------------------------------------------------------------------
const STATUS_EFFECTS_DATA = {
    // Damage Over Time Effects - Each with unique mechanics
    burn: {
        id: "burn",
        name: "Burn",
        type: "damageOverTime",
        duration: 4,
        potency: 1,
        icon: "🔥",
        desc: "Take 1 fire damage per turn for 4 turns. Strength reduced by 2 (pain/exhaustion).",
        statModifiers: { strength: -2 },
        stackable: false,
        source: ["ignite", "fire_breath", "dragon_flame"]
    },

    poison: {
        id: "poison",
        name: "Poison",
        type: "damageOverTime",
        duration: 3,
        potency: "escalating",
        icon: "☠️",
        desc: "Take 1 damage first turn, 2 second turn, 3 third turn (escalating toxicity).",
        stackable: true,
        source: ["poison_blade", "poison_breath", "poison_brewing"]
    },

    bleed: {
        id: "bleed",
        name: "Bleed",
        type: "damageOverTime",
        duration: 3,
        potency: "1d6",
        icon: "🩸",
        desc: "Take 1d6 physical damage per turn for 3 turns from bleeding wounds.",
        stackable: true,
        source: ["bloodletter", "serrated_blade", "deep_cuts"]
    },

    acid_corrosion: {
        id: "acid_corrosion",
        name: "Acid Corrosion",
        type: "armorDestruction",
        duration: 5,
        potency: 1,
        icon: "�",
        desc: "Armor reduced by 1 each turn for 5 turns. No direct damage, but permanent armor loss.",
        stackable: true,
        source: ["acid_creation", "acid_spit", "universal_solvent"]
    },

    // Control Effects - Each with unique restrictions
    incapacitated: {
        id: "incapacitated",
        name: "Incapacitated",
        type: "control",
        duration: 2,
        potency: 0,
        icon: "😵",
        desc: "Cannot take actions for 2 turns. Covers stun, knockout, daze effects.",
        stackable: false,
        source: ["stunning_blow", "crushing_blow", "thunderstrike", "knockout"]
    },

    immobilized: {
        id: "immobilized",
        name: "Immobilized",
        type: "control",
        duration: 3,
        potency: 0,
        icon: "🧊",
        desc: "Cannot move but can still attack/cast. Covers freeze, entangle, paralysis.",
        stackable: false,
        source: ["freeze", "ice_breath", "web_shot", "entangle", "paralyzing_touch"]
    },

    mind_controlled: {
        id: "mind_controlled",
        name: "Mind Controlled",
        type: "control",
        duration: 3,
        potency: 0,
        icon: "�",
        desc: "Must move away from enemies (fear) OR cannot attack charmer (charm). Covers mental effects.",
        variants: ["fear", "charm"],
        stackable: false,
        source: ["fear", "terrifying_roar", "charm_person", "siren_song", "hypnotic_gaze"]
    },

    // Stat Modification Effects - Unique mechanical changes
    weakened: {
        id: "weakened",
        name: "Weakened",
        type: "statDebuff",
        duration: 4,
        potency: 3,
        icon: "💔",
        desc: "All stats reduced by 2. Combines slow, weak, and confused effects.",
        statModifiers: { strength: -2, speed: -2, magicPower: -2, accuracy: -2 },
        stackable: false,
        source: ["mana_burn", "energy_drain", "weakness_curse", "slow"]
    },

    cursed: {
        id: "cursed",
        name: "Cursed",
        type: "statDebuff",
        duration: 8,
        potency: 1,
        icon: "💀",
        desc: "Bad luck: -2 to all dice rolls. Take 1 damage when using abilities.",
        statModifiers: { luck: -2 },
        damageOnAbilityUse: 1,
        stackable: true,
        source: ["curse", "dark_magic", "evil_eye"]
    },

    // Beneficial Effects - Each with unique advantages
    regeneration: {
        id: "regeneration",
        name: "Regeneration",
        type: "healOverTime",
        duration: 5,
        potency: 2,
        icon: "💚",
        desc: "Restore 2 HP per turn for 5 turns. Immunity to poison and disease.",
        immunities: ["poison"],
        stackable: false,
        source: ["regeneration", "healing_light", "life_force"]
    },

    enhanced: {
        id: "enhanced",
        name: "Enhanced",
        type: "statBuff",
        duration: 8,
        potency: 3,
        icon: "💪",
        desc: "All physical stats +2 (Str, Spd, Physical Defence). Combines multiple enchantment effects.",
        statModifiers: { strength: 2, speed: 2, armorClass: 2 },
        stackable: false,
        source: ["berserker_rage", "bull_strength", "haste", "magic_enchantment"]
    },

    empowered: {
        id: "empowered",
        name: "Empowered",
        type: "statBuff",
        duration: 6,
        potency: 4,
        icon: "✨",
        desc: "Magic Power +3, spell costs reduced by 1, immunity to magic debuffs.",
        statModifiers: { magicPower: 3 },
        spellCostReduction: 1,
        immunities: ["cursed", "weakened"],
        stackable: false,
        source: ["arcane_focus", "spell_power", "divine_blessing"]
    },

    weapon_enchanted: {
        id: "weapon_enchanted",
        name: "Enchanted Weapon",
        type: "enchantment",
        duration: 10,
        potency: 6,
        icon: "⚔️",
        desc: "Weapon deals +1d6 elemental damage. Choose fire, ice, lightning, or radiant.",
        elementalDamage: "1d6",
        stackable: false,
        source: ["holy_weapon", "elemental_infusion", "flame_blade", "frost_weapon"]
    },

    // Protection Effects - Unique defensive mechanics
    protected: {
        id: "protected",
        name: "Protected",
        type: "protection",
        duration: 6,
        potency: 3,
        icon: "🛡️",
        desc: "Absorb next 3 attacks (no damage). +3 Physical Defence against everything else.",
        attacksBlocked: 3,
        statModifiers: { armorClass: 3 },
        stackable: false,
        source: ["arcane_shield", "magic_barrier", "divine_protection", "stoneskin"]
    },

    spell_warded: {
        id: "spell_warded",
        name: "Spell Warded",
        type: "protection",
        duration: 8,
        potency: 0,
        icon: "�",
        desc: "Immune to status effects from spells. Magic damage reduced by half.",
        immunities: ["cursed", "mind_controlled", "weakened"],
        magicDamageReduction: 0.5,
        stackable: false,
        source: ["spell_immunity", "anti_magic", "arcane_resistance"]
    },
    // Special Movement & Utility Effects
    enhanced_mobility: {
        id: "enhanced_mobility",
        name: "Enhanced Mobility",
        type: "movement",
        duration: 10,
        potency: 0,
        icon: "🦅",
        desc: "Can fly, water breathing, immunity to movement restrictions. Ultimate mobility.",
        immunities: ["immobilized"],
        abilities: ["flight", "water_breathing", "freedom_of_movement"],
        stackable: false,
        source: ["flight", "wind_walk", "levitate", "water_breathing", "freedom"]
    },

    stealth_mastery: {
        id: "stealth_mastery",
        name: "Stealth Mastery",
        type: "special",
        duration: 5,
        potency: 0,
        icon: "👻",
        desc: "Invisible + cannot be targeted + immune to mental effects. Perfect infiltration.",
        immunities: ["mind_controlled"],
        stackable: false,
        source: ["invisibility", "shadow_cloak", "vanish", "darkness_mastery"]
    },

    // Aura Effects - Permanent until removed
    intimidating_aura: {
        id: "intimidating_aura",
        name: "Intimidating Aura",
        type: "aura",
        duration: 999,
        potency: 2,
        icon: "👹",
        desc: "Enemies within 30ft must resist mind control when they see you. Your presence is terrifying.",
        auraRange: 30,
        auraEffect: "mind_controlled",
        stackable: false,
        source: ["terrifying_roar", "draconic_presence", "monster_aura"]
    },

    toxic_presence: {
        id: "toxic_presence",
        name: "Toxic Presence",
        type: "aura",
        duration: 999,
        potency: 1,
        icon: "☠️",
        desc: "Enemies within 15ft take 1 poison damage per turn. Allies gain poison immunity.",
        auraRange: 15,
        auraEffect: "poison",
        allyBenefit: "poison_immunity",
        stackable: false,
        source: ["poison_aura", "toxic_presence", "venomous_skin"]
    },

    // Elemental Resistance Effects
    fire_resistance: {
        id: "fire_resistance",
        name: "Fire Resistance",
        type: "elementalResistance",
        duration: 999,
        potency: 1,
        icon: "🔥",
        desc: "Take 50% less damage from fire attacks. Immune to burn status.",
        getDamageReduction: function () {
            // Use potency to determine resistance level
            // potency 1 = -1 (50% resistance), potency 2 = -2 (75% resistance), potency 3 = -3 (100% immunity)
            const resistanceLevel = -this.potency
            if (resistanceLevel <= -3) return { fire: 0 } // Immunity
            else if (resistanceLevel === -2) return { fire: 0.25 } // 75% resistance
            else return { fire: 0.5 } // 50% resistance (default)
        },
        immunities: ["burn"],
        stackable: false,
        source: ["fire_resistance", "flame_shield", "elemental_protection"]
    },

    ice_resistance: {
        id: "ice_resistance",
        name: "Ice Resistance",
        type: "elementalResistance",
        duration: 999,
        potency: 1,
        icon: "❄️",
        desc: "Take 50% less damage from ice attacks. Immune to freeze status.",
        getDamageReduction: function () {
            const resistanceLevel = -this.potency
            if (resistanceLevel <= -3) return { ice: 0 } // Immunity
            else if (resistanceLevel === -2) return { ice: 0.25 } // 75% resistance
            else return { ice: 0.5 } // 50% resistance (default)
        },
        immunities: ["immobilized"],
        stackable: false,
        source: ["ice_resistance", "frost_shield", "elemental_protection"]
    },

    lightning_resistance: {
        id: "lightning_resistance",
        name: "Lightning Resistance",
        type: "elementalResistance",
        duration: 999,
        potency: 1,
        icon: "⚡",
        desc: "Take 50% less damage from lightning attacks. Immune to paralysis.",
        getDamageReduction: function () {
            const resistanceLevel = -this.potency
            if (resistanceLevel <= -3) return { lightning: 0 } // Immunity
            else if (resistanceLevel === -2) return { lightning: 0.25 } // 75% resistance
            else return { lightning: 0.5 } // 50% resistance (default)
        },
        immunities: ["immobilized"],
        stackable: false,
        source: ["lightning_resistance", "storm_shield", "elemental_protection"]
    },

    water_resistance: {
        id: "water_resistance",
        name: "Water Resistance",
        type: "elementalResistance",
        duration: 999,
        potency: 1,
        icon: "💧",
        desc: "Take 50% less damage from water attacks. Immune to drowning effects.",
        getDamageReduction: function () {
            const resistanceLevel = -this.potency
            if (resistanceLevel <= -3) return { water: 0 } // Immunity
            else if (resistanceLevel === -2) return { water: 0.25 } // 75% resistance
            else return { water: 0.5 } // 50% resistance (default)
        },
        immunities: ["weakened"],
        stackable: false,
        source: ["water_resistance", "tidal_shield", "elemental_protection"]
    },

    earth_resistance: {
        id: "earth_resistance",
        name: "Earth Resistance",
        type: "elementalResistance",
        duration: 999,
        potency: 1,
        icon: "🌍",
        desc: "Take 50% less damage from earth attacks. Immune to petrification.",
        getDamageReduction: function () {
            const resistanceLevel = -this.potency
            if (resistanceLevel <= -3) return { earth: 0 } // Immunity
            else if (resistanceLevel === -2) return { earth: 0.25 } // 75% resistance
            else return { earth: 0.5 } // 50% resistance (default)
        },
        immunities: ["immobilized"],
        stackable: false,
        source: ["earth_resistance", "stone_shield", "elemental_protection"]
    },

    wind_resistance: {
        id: "wind_resistance",
        name: "Wind Resistance",
        type: "elementalResistance",
        duration: 999,
        potency: 1,
        icon: "🌪️",
        desc: "Take 50% less damage from wind attacks. Immune to knockback.",
        getDamageReduction: function () {
            const resistanceLevel = -this.potency
            if (resistanceLevel <= -3) return { wind: 0 } // Immunity
            else if (resistanceLevel === -2) return { wind: 0.25 } // 75% resistance
            else return { wind: 0.5 } // 50% resistance (default)
        },
        immunities: ["weakened"],
        stackable: false,
        source: ["wind_resistance", "gale_shield", "elemental_protection"]
    },

    light_resistance: {
        id: "light_resistance",
        name: "Light Resistance",
        type: "elementalResistance",
        duration: 999,
        potency: 1,
        icon: "☀️",
        desc: "Take 50% less damage from light attacks. Immune to blinding effects.",
        getDamageReduction: function () {
            const resistanceLevel = -this.potency
            if (resistanceLevel <= -3) return { light: 0 } // Immunity
            else if (resistanceLevel === -2) return { light: 0.25 } // 75% resistance
            else return { light: 0.5 } // 50% resistance (default)
        },
        immunities: ["incapacitated"],
        stackable: false,
        source: ["light_resistance", "radiant_shield", "elemental_protection"]
    },

    darkness_resistance: {
        id: "darkness_resistance",
        name: "Darkness Resistance",
        type: "elementalResistance",
        duration: 999,
        potency: 1,
        icon: "🌑",
        desc: "Take 50% less damage from darkness attacks. Immune to fear effects.",
        getDamageReduction: function () {
            const resistanceLevel = -this.potency
            if (resistanceLevel <= -3) return { darkness: 0 } // Immunity
            else if (resistanceLevel === -2) return { darkness: 0.25 } // 75% resistance
            else return { darkness: 0.5 } // 50% resistance (default)
        },
        immunities: ["mind_controlled"],
        stackable: false,
        source: ["darkness_resistance", "shadow_shield", "elemental_protection"]
    },

    // Elemental Weakness Effects
    fire_weakness: {
        id: "fire_weakness",
        name: "Fire Weakness",
        type: "elementalWeakness",
        duration: 999,
        potency: 1,
        icon: "🔥",
        desc: "Take 50% more damage from fire attacks. Vulnerable to burn status.",
        getDamageIncrease: function () {
            // Use potency to determine weakness level
            // potency 1 = +1 (200% damage), potency 2 = +2 (400% damage), potency 3 = +3 (instant kill)
            if (this.potency >= 3) return { fire: 999 } // Instant kill
            else if (this.potency === 2) return { fire: 3 } // 400% damage
            else return { fire: 1 } // 200% damage (default)
        },
        vulnerabilities: ["burn"],
        stackable: false,
        source: ["fire_weakness", "elemental_vulnerability"]
    },

    ice_weakness: {
        id: "ice_weakness",
        name: "Ice Weakness",
        type: "elementalWeakness",
        duration: 999,
        potency: 1,
        icon: "❄️",
        desc: "Take 50% more damage from ice attacks. Vulnerable to freeze status.",
        getDamageIncrease: function () {
            if (this.potency >= 3) return { ice: 999 } // Instant kill
            else if (this.potency === 2) return { ice: 3 } // 400% damage
            else return { ice: 1 } // 200% damage (default)
        },
        vulnerabilities: ["immobilized"],
        stackable: false,
        source: ["ice_weakness", "elemental_vulnerability"]
    },

    lightning_weakness: {
        id: "lightning_weakness",
        name: "Lightning Weakness",
        type: "elementalWeakness",
        duration: 999,
        potency: 1,
        icon: "⚡",
        desc: "Take 50% more damage from lightning attacks. Vulnerable to paralysis.",
        getDamageIncrease: function () {
            if (this.potency >= 3) return { lightning: 999 } // Instant kill
            else if (this.potency === 2) return { lightning: 3 } // 400% damage
            else return { lightning: 1 } // 200% damage (default)
        },
        vulnerabilities: ["immobilized"],
        stackable: false,
        source: ["lightning_weakness", "elemental_vulnerability"]
    },

    water_weakness: {
        id: "water_weakness",
        name: "Water Weakness",
        type: "elementalWeakness",
        duration: 999,
        potency: 1,
        icon: "💧",
        desc: "Take 50% more damage from water attacks. Vulnerable to drowning effects.",
        getDamageIncrease: function () {
            if (this.potency >= 3) return { water: 999 } // Instant kill
            else if (this.potency === 2) return { water: 3 } // 400% damage
            else return { water: 1 } // 200% damage (default)
        },
        vulnerabilities: ["weakened"],
        stackable: false,
        source: ["water_weakness", "elemental_vulnerability"]
    },

    earth_weakness: {
        id: "earth_weakness",
        name: "Earth Weakness",
        type: "elementalWeakness",
        duration: 999,
        potency: 1,
        icon: "🌍",
        desc: "Take 50% more damage from earth attacks. Vulnerable to petrification.",
        getDamageIncrease: function () {
            if (this.potency >= 3) return { earth: 999 } // Instant kill
            else if (this.potency === 2) return { earth: 3 } // 400% damage
            else return { earth: 1 } // 200% damage (default)
        },
        vulnerabilities: ["immobilized"],
        stackable: false,
        source: ["earth_weakness", "elemental_vulnerability"]
    },

    wind_weakness: {
        id: "wind_weakness",
        name: "Wind Weakness",
        type: "elementalWeakness",
        duration: 999,
        potency: 1,
        icon: "🌪️",
        desc: "Take 50% more damage from wind attacks. Vulnerable to knockback.",
        getDamageIncrease: function () {
            if (this.potency >= 3) return { wind: 999 } // Instant kill
            else if (this.potency === 2) return { wind: 3 } // 400% damage
            else return { wind: 1 } // 200% damage (default)
        },
        vulnerabilities: ["weakened"],
        stackable: false,
        source: ["wind_weakness", "elemental_vulnerability"]
    },

    light_weakness: {
        id: "light_weakness",
        name: "Light Weakness",
        type: "elementalWeakness",
        duration: 999,
        potency: 1,
        icon: "☀️",
        desc: "Take 50% more damage from light attacks. Vulnerable to blinding effects.",
        getDamageIncrease: function () {
            if (this.potency >= 3) return { light: 999 } // Instant kill
            else if (this.potency === 2) return { light: 3 } // 400% damage
            else return { light: 1 } // 200% damage (default)
        },
        vulnerabilities: ["incapacitated"],
        stackable: false,
        source: ["light_weakness", "elemental_vulnerability"]
    },

    darkness_weakness: {
        id: "darkness_weakness",
        name: "Darkness Weakness",
        type: "elementalWeakness",
        duration: 999,
        potency: 1,
        icon: "🌑",
        desc: "Take 50% more damage from darkness attacks. Vulnerable to fear effects.",
        getDamageIncrease: function () {
            if (this.potency >= 3) return { darkness: 999 } // Instant kill
            else if (this.potency === 2) return { darkness: 3 } // 400% damage
            else return { darkness: 1 } // 200% damage (default)
        },
        vulnerabilities: ["mind_controlled"],
        stackable: false,
        source: ["darkness_weakness", "elemental_vulnerability"]
    }
}

// Create a status effect instance
function createStatusEffect(effectId, duration = null, potency = null) {
    console.log('createStatusEffect called with:', { effectId, duration, potency })
    console.log('STATUS_EFFECTS_DATA available:', !!STATUS_EFFECTS_DATA)
    console.log('STATUS_EFFECTS_DATA keys:', Object.keys(STATUS_EFFECTS_DATA || {}))

    const template = STATUS_EFFECTS_DATA[effectId]
    console.log('Template found for', effectId, ':', template)

    if (!template) {
        console.error(`Status effect '${effectId}' not found`)
        return null
    }

    const result = {
        ...template,
        duration: duration !== null ? duration : template.duration,
        potency: potency !== null ? potency : template.potency,
        appliedAt: Date.now() // For tracking when effect was applied
    }

    console.log('Created status effect:', result)
    return result
}

// Get all status effects as array
function getAllStatusEffects() {
    return Object.values(STATUS_EFFECTS_DATA)
}

// Find status effect by ID
function findStatusEffectById(effectId) {
    return STATUS_EFFECTS_DATA[effectId]
}

// Get status effects by type
function getStatusEffectsByType(type) {
    return Object.values(STATUS_EFFECTS_DATA).filter(effect => effect.type === type)
}

// Advanced Status Effect Management Functions
class StatusEffectManager {
    static getEffectBySourceSkill(skillId) {
        for (const [effectId, effect] of Object.entries(STATUS_EFFECTS_DATA)) {
            if (effect.source && effect.source.includes(skillId)) {
                return effect
            }
        }
        return null
    }

    static getEffectsByType(type) {
        return Object.values(STATUS_EFFECTS_DATA).filter(effect => effect.type === type)
    }

    static canStack(effectId) {
        const effect = STATUS_EFFECTS_DATA[effectId]
        return effect ? effect.stackable : false
    }

    static getImmunities(effectId) {
        const effect = STATUS_EFFECTS_DATA[effectId]
        return effect ? (effect.immunities || []) : []
    }

    static getDurationString(duration) {
        if (duration === 999) return "Permanent"
        if (duration === 1) return "1 turn"
        return `${duration} turns`
    }

    static isDebuff(effectId) {
        const effect = STATUS_EFFECTS_DATA[effectId]
        if (!effect) return false
        return ['damageOverTime', 'control', 'statDebuff'].includes(effect.type)
    }

    static isBuff(effectId) {
        const effect = STATUS_EFFECTS_DATA[effectId]
        if (!effect) return false
        return ['healOverTime', 'statBuff', 'protection', 'enchantment'].includes(effect.type)
    }

    static getEffectDescription(effectId, potency = null) {
        const effect = STATUS_EFFECTS_DATA[effectId]
        if (!effect) return "Unknown effect"

        let desc = effect.desc
        if (potency !== null && potency !== effect.potency) {
            // Customize description based on actual potency
            desc = desc.replace(/\d+/g, potency)
        }

        return `${effect.icon} ${effect.name}: ${desc}`
    }

    static getCounterEffects(effectId) {
        // Returns effects that counter or remove this effect
        const counters = {
            'burn': ['water_breathing', 'freeze'],
            'freeze': ['burn', 'fire_resistance'],
            'poison': ['regeneration', 'rapid_healing'],
            'fear': ['berserker_rage', 'darkness_cloak'],
            'charm': ['berserker_rage', 'darkness_cloak'],
            'paralyzed': ['haste', 'freedom_of_movement'],
            'entangled': ['flight', 'freedom_of_movement'],
            'cursed': ['divine_blessing', 'holy_weapon']
        }

        return counters[effectId] || []
    }

    static validateEffectApplication(targetId, effectId, character) {
        const effect = STATUS_EFFECTS_DATA[effectId]
        if (!effect) return { valid: false, reason: "Effect not found" }

        // Check immunities from other active effects
        const activeEffects = character.statusEffects || []
        for (const activeEffect of activeEffects) {
            const immunities = this.getImmunities(activeEffect.id)
            if (immunities.includes(effectId)) {
                return {
                    valid: false,
                    reason: `Immune due to ${STATUS_EFFECTS_DATA[activeEffect.id].name}`
                }
            }
        }

        // Check if effect can stack
        if (!this.canStack(effectId)) {
            const hasEffect = activeEffects.some(ae => ae.id === effectId)
            if (hasEffect) {
                return {
                    valid: false,
                    reason: "Effect does not stack"
                }
            }
        }

        return { valid: true }
    }

    static getSkillStatusEffects(skillId) {
        // Returns all status effects that a skill can cause
        const effects = []
        for (const [effectId, effect] of Object.entries(STATUS_EFFECTS_DATA)) {
            if (effect.source && effect.source.includes(skillId)) {
                effects.push(effect)
            }
        }
        return effects
    }

    static getEffectSummary(effectId) {
        const effect = STATUS_EFFECTS_DATA[effectId]
        if (!effect) return null

        return {
            id: effect.id,
            name: effect.name,
            type: effect.type,
            icon: effect.icon,
            duration: this.getDurationString(effect.duration),
            isBuff: this.isBuff(effectId),
            isDebuff: this.isDebuff(effectId),
            shortDesc: effect.desc.split('.')[0] + '.'
        }
    }
}
