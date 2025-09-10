// Character Migration System - Automatically updates older character files to match current system
// This runs silently in the background without user confirmation

class CharacterMigration {
    constructor() {
        this.currentVersion = '1.1.0' // Increment this when adding new migrations
        this.migrations = [
            {
                version: '1.1.0',
                name: 'Lightning to Thunder Conversion',
                description: 'Updates all lightning references to thunder across skills, items, and effects',
                migrate: this.migrateLightningToThunder.bind(this)
            }
            // Future migrations can be added here
        ]
    }

    // Main migration entry point - called when loading characters
    migrateCharacter(character) {
        if (!character) return character

        // Add version tracking if missing
        if (!character.migrationVersion) {
            character.migrationVersion = '0.0.0'
        }

        // Check if character needs migration
        if (this.needsMigration(character.migrationVersion)) {
            console.log(`Migrating character "${character.name}" from v${character.migrationVersion} to v${this.currentVersion}`)

            // Apply all applicable migrations
            this.applyMigrations(character)

            // Update version
            character.migrationVersion = this.currentVersion
            character.lastMigrated = new Date().toISOString()

            console.log(`Character "${character.name}" migration complete`)
        }

        return character
    }

    // Check if character needs migration
    needsMigration(characterVersion) {
        return this.compareVersions(characterVersion, this.currentVersion) < 0
    }

    // Apply all applicable migrations
    applyMigrations(character) {
        const characterVersion = character.migrationVersion || '0.0.0'

        this.migrations.forEach(migration => {
            if (this.compareVersions(characterVersion, migration.version) < 0) {
                console.log(`Applying migration: ${migration.name}`)
                migration.migrate(character)
            }
        })
    }

    // Lightning to Thunder migration
    migrateLightningToThunder(character) {
        let modified = false

        // Migrate unlocked skills
        if (character.unlockedSkills && character.unlockedSkills.magic) {
            if (character.unlockedSkills.magic.lightning !== undefined) {
                // Move lightning skills to thunder
                character.unlockedSkills.magic.thunder = character.unlockedSkills.magic.lightning
                delete character.unlockedSkills.magic.lightning
                modified = true
            }
        }

        // Migrate active toggle skills
        if (character.activeToggleSkills && Array.isArray(character.activeToggleSkills)) {
            character.activeToggleSkills = character.activeToggleSkills.map(skillId => {
                if (skillId.includes('lightning')) {
                    modified = true
                    return skillId.replace(/lightning/g, 'thunder')
                }
                return skillId
            })
        }

        // Migrate equipment with lightning references
        if (character.equipment) {
            Object.keys(character.equipment).forEach(slot => {
                const item = character.equipment[slot]
                if (item && item.id && item.id.includes('lightning')) {
                    character.equipment[slot] = {
                        ...item,
                        id: item.id.replace(/lightning/g, 'thunder'),
                        name: item.name ? item.name.replace(/lightning/gi, 'thunder') : item.name
                    }
                    modified = true
                }
            })
        }

        // Migrate inventory items
        if (character.inventory && Array.isArray(character.inventory)) {
            character.inventory = character.inventory.map(item => {
                if (item.id && item.id.includes('lightning')) {
                    modified = true
                    return {
                        ...item,
                        id: item.id.replace(/lightning/g, 'thunder'),
                        name: item.name ? item.name.replace(/lightning/gi, 'thunder') : item.name
                    }
                }
                return item
            })
        }

        // Migrate status effects
        if (character.statusEffects && Array.isArray(character.statusEffects)) {
            character.statusEffects = character.statusEffects.map(effect => {
                if (effect.id && effect.id.includes('lightning')) {
                    modified = true
                    return {
                        ...effect,
                        id: effect.id.replace(/lightning/g, 'thunder'),
                        name: effect.name ? effect.name.replace(/lightning/gi, 'thunder') : effect.name
                    }
                }
                return effect
            })
        }

        // Migrate racial abilities (for Dragonborn)
        if (character.racialPassiveTraits && Array.isArray(character.racialPassiveTraits)) {
            character.racialPassiveTraits = character.racialPassiveTraits.map(trait => {
                if (trait.includes('lightning')) {
                    modified = true
                    return trait.replace(/lightning/gi, 'thunder')
                }
                return trait
            })
        }

        // Migrate monster skills (if character is a monster)
        if (character.isMonster && character.monsterSkills && Array.isArray(character.monsterSkills)) {
            character.monsterSkills = character.monsterSkills.map(skill => {
                if (skill.includes('lightning')) {
                    modified = true
                    return skill.replace(/lightning/g, 'thunder')
                }
                return skill
            })
        }

        // Migrate elemental affinities
        if (character.elementalAffinity && character.elementalAffinity.includes('lightning')) {
            character.elementalAffinity = character.elementalAffinity.replace(/lightning/gi, 'thunder')
            modified = true
        }

        // Migrate any custom notes or descriptions
        if (character.notes && character.notes.includes('lightning')) {
            character.notes = character.notes.replace(/lightning/gi, 'thunder')
            modified = true
        }

        if (character.description && character.description.includes('lightning')) {
            character.description = character.description.replace(/lightning/gi, 'thunder')
            modified = true
        }

        if (modified) {
            console.log(`Lightning→Thunder migration applied to character "${character.name}"`)
        }
    }

    // Version comparison utility
    compareVersions(version1, version2) {
        const v1parts = version1.split('.').map(Number)
        const v2parts = version2.split('.').map(Number)

        for (let i = 0; i < Math.max(v1parts.length, v2parts.length); i++) {
            const v1part = v1parts[i] || 0
            const v2part = v2parts[i] || 0

            if (v1part < v2part) return -1
            if (v1part > v2part) return 1
        }

        return 0
    }

    // Get migration history for a character
    getMigrationHistory(character) {
        if (!character.migrationHistory) {
            character.migrationHistory = []
        }
        return character.migrationHistory
    }

    // Add migration record
    addMigrationRecord(character, migrationName, details = {}) {
        if (!character.migrationHistory) {
            character.migrationHistory = []
        }

        character.migrationHistory.push({
            version: this.currentVersion,
            migration: migrationName,
            timestamp: new Date().toISOString(),
            details: details
        })
    }

    // Validate character after migration
    validateCharacter(character) {
        const issues = []

        // Check for orphaned lightning references
        const characterStr = JSON.stringify(character).toLowerCase()
        if (characterStr.includes('lightning')) {
            issues.push('Character still contains lightning references')
        }

        // Check for invalid skill references
        if (character.unlockedSkills && character.unlockedSkills.magic) {
            if (character.unlockedSkills.magic.lightning) {
                issues.push('Character still has lightning magic skills')
            }
        }

        return {
            valid: issues.length === 0,
            issues: issues
        }
    }

    // Batch migrate all characters
    migrateAllCharacters(characterManager) {
        const characters = characterManager.getAllCharacters()
        let migratedCount = 0

        characters.forEach(character => {
            const originalVersion = character.migrationVersion || '0.0.0'
            const migratedCharacter = this.migrateCharacter(character)

            if (migratedCharacter.migrationVersion !== originalVersion) {
                characterManager.saveCharacter(migratedCharacter)
                migratedCount++
            }
        })

        console.log(`Batch migration complete: ${migratedCount} characters updated`)
        return migratedCount
    }

    // Get migration statistics
    getMigrationStats(characterManager) {
        const characters = characterManager.getAllCharacters()
        const stats = {
            totalCharacters: characters.length,
            migratedCharacters: 0,
            versionDistribution: {},
            lastMigration: null
        }

        characters.forEach(character => {
            const version = character.migrationVersion || '0.0.0'
            stats.versionDistribution[version] = (stats.versionDistribution[version] || 0) + 1

            if (character.lastMigrated) {
                stats.migratedCharacters++
                if (!stats.lastMigration || character.lastMigrated > stats.lastMigration) {
                    stats.lastMigration = character.lastMigrated
                }
            }
        })

        return stats
    }
}

// Create global instance
window.characterMigration = new CharacterMigration()

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CharacterMigration
}
