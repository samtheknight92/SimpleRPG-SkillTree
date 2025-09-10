# Character Migration System

## Overview

The Character Migration System automatically updates older character files to match the current system without requiring user confirmation. This ensures backward compatibility when system changes are made (like Lightning → Thunder conversion).

## How It Works

### Automatic Migration
- **Silent Operation**: Migrations run automatically in the background when characters are loaded
- **No User Interaction**: No confirmation dialogs or user prompts required
- **Version Tracking**: Each character tracks its migration version to avoid redundant migrations
- **Safe Updates**: All migrations are designed to be safe and preserve character data

### Migration Process
1. **Character Loading**: When a character is loaded via `characterManager.loadCharacter()`
2. **Version Check**: System checks if character needs migration based on `migrationVersion`
3. **Apply Migrations**: All applicable migrations are applied automatically
4. **Save Updates**: Migrated character is saved back to localStorage
5. **Continue Loading**: Character loads normally with updated data

## Current Migrations

### v1.1.0 - Lightning to Thunder Conversion
**What it does:**
- Converts all `lightning` references to `thunder` in character data
- Updates unlocked skills: `unlockedSkills.magic.lightning` → `unlockedSkills.magic.thunder`
- Updates active toggle skills: `lightning_attunement` → `thunder_attunement`
- Updates equipment IDs and names containing "lightning"
- Updates inventory items with lightning references
- Updates status effects with lightning references
- Updates racial abilities and elemental affinities
- Updates character notes and descriptions

**Example transformations:**
```javascript
// Before migration
{
  unlockedSkills: {
    magic: {
      lightning: ['spark', 'lightning_bolt']
    }
  },
  activeToggleSkills: ['lightning_attunement'],
  equipment: {
    weapon: { id: 'lightning_staff', name: 'Lightning Staff' }
  }
}

// After migration
{
  unlockedSkills: {
    magic: {
      thunder: ['spark', 'thunder_bolt']
    }
  },
  activeToggleSkills: ['thunder_attunement'],
  equipment: {
    weapon: { id: 'thunder_staff', name: 'Thunder Staff' }
  }
}
```

## Adding New Migrations

To add a new migration:

1. **Increment Version**: Update `currentVersion` in `character-migration.js`
2. **Add Migration Object**: Add new migration to the `migrations` array:

```javascript
{
    version: '1.2.0',
    name: 'New Feature Migration',
    description: 'Description of what this migration does',
    migrate: this.migrateNewFeature.bind(this)
}
```

3. **Implement Migration Function**: Create the migration logic:

```javascript
migrateNewFeature(character) {
    let modified = false
    
    // Your migration logic here
    if (character.someOldProperty) {
        character.someNewProperty = character.someOldProperty
        delete character.someOldProperty
        modified = true
    }
    
    if (modified) {
        console.log(`New feature migration applied to character "${character.name}"`)
    }
}
```

## Utility Functions

### Batch Migration
```javascript
// Run migration on all characters at once
const migratedCount = characterManager.runBatchMigration()
console.log(`${migratedCount} characters migrated`)
```

### Migration Statistics
```javascript
// Get migration statistics
const stats = characterManager.getMigrationStats()
console.log('Migration stats:', stats)
// Returns: { totalCharacters, migratedCharacters, versionDistribution, lastMigration }
```

### Manual Migration
```javascript
// Manually migrate a specific character
const migratedChar = window.characterMigration.migrateCharacter(character)
```

## File Structure

- **`character-migration.js`**: Main migration system
- **`character-manager.js`**: Integration with character loading
- **`index.html`**: Script inclusion order

## Testing

The migration system includes validation to ensure migrations work correctly:

```javascript
// Validate a migrated character
const validation = window.characterMigration.validateCharacter(character)
if (!validation.valid) {
    console.error('Migration issues:', validation.issues)
}
```

## Benefits

1. **Seamless Updates**: Users don't need to manually update their characters
2. **Data Preservation**: All character data is preserved during migration
3. **Version Control**: Clear tracking of which migrations have been applied
4. **Extensible**: Easy to add new migrations for future system changes
5. **Safe**: Migrations are designed to be non-destructive
6. **Automatic**: No user intervention required

## Future Migrations

The system is designed to handle various types of migrations:
- **Data Structure Changes**: Adding new properties, reorganizing data
- **ID/Name Changes**: Updating skill IDs, item names, etc.
- **System Updates**: Changes to game mechanics, stat calculations
- **UI Improvements**: Updates to display formats, tooltips, etc.

This migration system ensures that your RPG Skill Tree System can evolve and improve while maintaining compatibility with existing character data.
