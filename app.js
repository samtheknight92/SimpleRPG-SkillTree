// Main Application Controller - Coordinates all components and handles initialization

// Initialize icons in the DOM after scripts are loaded
function initializeIcons() {
    // Initialize the iconMapper
    window.iconMapper = new IconMapper()

    // Replace hamburger icon
    const hamburgerIcon = document.getElementById('hamburger-icon')
    if (hamburgerIcon) {
        hamburgerIcon.innerHTML = iconMapper.createIconElement('ui', 'settings', 24)
    }

    // Replace all button icons
    const buttonIcons = document.querySelectorAll('.btn-icon[data-icon-category]')
    buttonIcons.forEach(icon => {
        const category = icon.dataset.iconCategory
        const name = icon.dataset.iconName
        const size = icon.closest('.btn-small') ? 12 : 16
        icon.innerHTML = iconMapper.createIconElement(category, name, size)
    })

    // Replace currency icons
    const currencyIcons = document.querySelectorAll('.currency-icon[data-icon-category]')
    currencyIcons.forEach(icon => {
        const category = icon.dataset.iconCategory
        const name = icon.dataset.iconName
        icon.innerHTML = iconMapper.createIconElement(category, name, 16)
    })
}

class App {
    constructor() {
        this.initialized = false
        this.version = '1.0.0'
        this.debugMode = false
    }

    // Initialize the application
    async init() {
        try {
            console.log(`RPG Skill Tree v${this.version} - Initializing...`)

            // Check for saved debug setting
            this.debugMode = localStorage.getItem('rpg_debug_mode') === 'true'

            // Validate SKILLS_DATA
            if (!window.SKILLS_DATA) {
                throw new Error('SKILLS_DATA is not defined. Please check that skills-data.js is loaded.')
            }

            // Initialize components in order
            await this.initializeComponents()

            // Set up global event handlers
            this.setupGlobalEventHandlers()

            // Load initial data
            await this.loadInitialData()

            // Mark as initialized
            this.initialized = true

            console.log('RPG Skill Tree - Initialization complete')

            // Show welcome message if first time
            this.checkFirstTimeUser()

        } catch (error) {
            console.error('Failed to initialize application:', error)
            this.showError('Failed to initialize application. Please refresh the page.')
        }
    }

    // Initialize all components
    async initializeComponents() {
        // Initialize icons first
        initializeIcons()

        // Validate skills data structure
        if (!window.SKILLS_DATA) {
            throw new Error('SKILLS_DATA is not defined')
        }

        // Check required categories
        if (!window.SKILLS_DATA.weapons || !window.SKILLS_DATA.professions) {
            throw new Error('SKILLS_DATA is missing required categories')
        }

        // Validate all skill arrays
        for (const category in window.SKILLS_DATA) {
            const categoryData = window.SKILLS_DATA[category]

            if (typeof categoryData !== 'object' || categoryData === null) {
                throw new Error(`Invalid category structure for ${category}`)
            }

            // Each category should contain subcategories
            for (const subcategory in categoryData) {
                const skills = categoryData[subcategory]
                if (!Array.isArray(skills)) {
                    throw new Error(`Skills for ${category}.${subcategory} is not an array`)
                }

                // Check each skill in the subcategory
                skills.forEach(skill => {
                    if (!skill.id || !skill.name || typeof skill.tier !== 'number' || typeof skill.cost !== 'number') {
                        throw new Error(`Invalid skill data in ${category}.${subcategory}: ${JSON.stringify(skill)}`)
                    }
                })
            }
        }

        // Initialize monster system
        window.monsterSystem = MONSTER_SYSTEM

        // Initialize UI components
        uiComponents.init()

        // Initialize inventory system with character manager
        window.inventorySystem = new InventorySystem(characterManager)

        // Try to load the last active character
        const lastCharacter = characterManager.getCurrentCharacter()
        if (lastCharacter) {
            console.log(`Loaded character: ${lastCharacter.name}`)
        }

        // Update displays
        uiComponents.updateDisplay()
    }

    // Set up global event handlers
    setupGlobalEventHandlers() {
        // Handle window beforeunload to save data
        window.addEventListener('beforeunload', () => {
            this.saveApplicationState()
        })

        // Handle keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            this.handleKeyboardShortcuts(e)
        })

        // Handle window resize for responsive adjustments
        window.addEventListener('resize', () => {
            this.handleWindowResize()
        })

        // Handle visibility change to save state when hidden
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.saveApplicationState()
            }
        })

        // Global error handler
        window.addEventListener('error', (e) => {
            console.error('Global error:', e.error)
            if (this.debugMode) {
                this.showError(`Error: ${e.error.message}`)
            }
        })

        // Handle unhandled promise rejections
        window.addEventListener('unhandledrejection', (e) => {
            console.error('Unhandled promise rejection:', e.reason)
            if (this.debugMode) {
                this.showError(`Promise rejection: ${e.reason}`)
            }
        })
    }

    // Load initial application data
    async loadInitialData() {
        try {
            // Validate skills data integrity
            this.validateSkillsData()

            // Load user preferences
            this.loadUserPreferences()

            // Check for data migration needs
            this.checkDataMigration()

        } catch (error) {
            console.error('Error loading initial data:', error)
            throw error
        }
    }

    // Validate skills data for consistency
    validateSkillsData() {
        try {
            let totalSkills = 0
            const allSkillIds = new Set()

            if (!window.SKILLS_DATA) {
                return { error: 'Skills data not found - make sure skills-data.js is loaded properly' }
            }

            // Check required categories
            if (!window.SKILLS_DATA.weapons || !window.SKILLS_DATA.professions) {
                return { error: 'SKILLS_DATA is missing required categories' }
            }

            for (const category in window.SKILLS_DATA) {
                const categoryData = window.SKILLS_DATA[category]

                if (!categoryData) {
                    console.warn(`Empty category found: ${category}`)
                    continue
                }

                if (Array.isArray(categoryData)) {
                    // For flat array categories (like monster)
                    if (categoryData.length < 12) {
                        console.warn(`${category} has only ${categoryData.length} skills (recommended: 12+)`)
                    }
                    for (const skill of categoryData) {
                        this.validateSkill(skill, category, allSkillIds)
                        totalSkills++
                    }
                } else {
                    // For nested categories (like weapons, magic)
                    for (const [subcategory, skills] of Object.entries(categoryData)) {
                        if (!Array.isArray(skills)) {
                            return { error: `Skills for ${category}.${subcategory} is not an array` }
                        }
                        for (const skill of skills) {
                            this.validateSkill(skill, category, allSkillIds)
                            totalSkills++
                        }
                    }
                }
            }

            if (totalSkills === 0) {
                return { error: 'No skills found in skill data' }
            }

            console.log(`Validated ${totalSkills} skills across all categories`)
            return { success: true }
        } catch (error) {
            return { error: `Skills validation error: ${error.message}` }
        }
    }

    validateSkill(skill, category, allSkillIds) {
        if (!skill || typeof skill !== 'object') {
            throw new Error(`Invalid skill in category ${category}`)
        }

        if (!skill.id) {
            throw new Error(`Skill missing ID in category ${category}`)
        }

        if (allSkillIds.has(skill.id)) {
            throw new Error(`Duplicate skill ID found: ${skill.id}`)
        }
        allSkillIds.add(skill.id)

        // Validate required fields
        const requiredFields = ['id', 'name', 'tier', 'cost', 'desc', 'icon', 'prerequisites']
        for (const field of requiredFields) {
            if (!skill.hasOwnProperty(field)) {
                throw new Error(`Skill ${skill.id} missing required field: ${field}`)
            }
        }
    }

    // Load user preferences from localStorage
    loadUserPreferences() {
        try {
            const preferences = localStorage.getItem('rpg_preferences')
            if (preferences) {
                const prefs = JSON.parse(preferences)

                // Apply saved UI preferences
                if (prefs.theme) {
                    document.body.className = prefs.theme
                }

                // Always start with character sheet tab on page load for better UX
                // The lastTab preference will be used for navigation within the session
                uiComponents.currentTab = 'character-sheet'

                // Store the last tab for session navigation, but don't auto-switch on load
                if (prefs.lastTab) {
                    uiComponents.lastTab = prefs.lastTab
                }

                if (prefs.lastSkillCategory) {
                    uiComponents.selectedSkillCategory = prefs.lastSkillCategory
                }

                console.log('User preferences loaded')
            }
        } catch (error) {
            console.warn('Failed to load user preferences:', error)
        }
    }

    // Check if data migration is needed
    checkDataMigration() {
        const currentVersion = localStorage.getItem('rpg_data_version')

        if (!currentVersion || currentVersion !== this.version) {
            console.log('Performing data migration...')
            this.migrateData(currentVersion, this.version)
            localStorage.setItem('rpg_data_version', this.version)
        }
    }

    // Migrate data between versions
    migrateData(fromVersion, toVersion) {
        const characters = characterManager.getAllCharacters()

        characters.forEach(character => {
            let modified = false

            // Add any missing fields
            if (!character.hasOwnProperty('totalLumensSpent')) {
                character.totalLumensSpent = 0
                modified = true
            }

            if (!character.hasOwnProperty('achievements')) {
                character.achievements = []
                modified = true
            }

            if (!character.hasOwnProperty('equipment')) {
                character.equipment = { weapon: null, armor: null, accessory: null }
                modified = true
            }

            // Recalculate derived stats to ensure consistency
            const derivedStats = gameLogic.calculateDerivedStats(character.stats)
            Object.assign(character.stats, derivedStats)
            modified = true

            // Migration for racial passive traits (v1.0+)
            if (!character.racialPassiveTraits && character.race && !character.isMonster) {
                console.log(`Migrating racial traits for ${character.name} (${character.race})`)
                characterManager.applyRacialAbilities(character, character.race)
                modified = true
            }

            // Force refresh for existing Dragonborn characters to update trait display format
            if (character.race === 'dragonborn' && character.racialPassiveTraits) {
                const hasOldFormat = character.racialPassiveTraits.some(trait =>
                    trait.includes('elemental affinity chosen') ||
                    trait.includes('Choose elemental affinity')
                )
                if (hasOldFormat) {
                    console.log(`Updating Dragonborn trait format for ${character.name}`)
                    characterManager.applyRacialAbilities(character, character.race)
                    modified = true
                }
            }

            if (modified) {
                characterManager.saveCharacter(character)
            }
        })

        console.log(`Migrated ${characters.length} characters from v${fromVersion || '0.0.0'} to v${toVersion}`)
    }

    // Handle keyboard shortcuts
    handleKeyboardShortcuts(e) {
        // Only handle shortcuts when not typing in inputs
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
            return
        }

        switch (e.key) {
            case '1':
                if (!e.ctrlKey) uiComponents.switchTab('skills')
                break
            case '2':
                if (!e.ctrlKey) uiComponents.switchTab('stats')
                break
            case '3':
                if (!e.ctrlKey) uiComponents.switchTab('character-sheet')
                break
            case 'n':
                if (e.ctrlKey) {
                    e.preventDefault()
                    uiComponents.showNewCharacterDialog()
                }
                break
            case 's':
                if (e.ctrlKey) {
                    e.preventDefault()
                    this.saveApplicationState()
                    uiComponents.showMessage('Progress saved', 'success')
                }
                break
            case 'F1':
                e.preventDefault()
                this.showHelp()
                break
            case 'F12':
                e.preventDefault()
                this.toggleDebugMode()
                break
        }
    }

    // Handle window resize
    handleWindowResize() {
        // Close side panel on small screens
        const sidePanel = document.getElementById('side-panel')
        if (window.innerWidth > 768 && sidePanel) {
            sidePanel.classList.remove('open')
        }
    }

    // Save application state
    saveApplicationState() {
        try {
            // Save current UI state
            const preferences = {
                theme: document.body.className,
                lastTab: uiComponents.lastTab, // Save the last tab for session navigation
                lastSkillCategory: uiComponents.selectedSkillCategory,
                lastSkillSubcategory: uiComponents.selectedSkillSubcategory,
                version: this.version
            }

            localStorage.setItem('rpg_preferences', JSON.stringify(preferences))

            // Update last played time for current character
            const currentCharacter = characterManager.getCurrentCharacter()
            if (currentCharacter) {
                currentCharacter.lastPlayed = new Date().toISOString()
                characterManager.saveCharacter(currentCharacter)
            }

        } catch (error) {
            console.error('Failed to save application state:', error)
        }
    }

    // Check if this is a first-time user
    checkFirstTimeUser() {
        const hasSeenWelcome = localStorage.getItem('rpg_welcome_shown')
        const hasCharacters = characterManager.getAllCharacters().length > 0

        if (!hasSeenWelcome && !hasCharacters) {
            this.showWelcome()
            localStorage.setItem('rpg_welcome_shown', 'true')
        }
    }

    // Show welcome message for new users
    showWelcome() {
        const welcomeHTML = `
            <div class="welcome-modal">
                <div class="welcome-content">
                    <h2>Welcome to RPG Skill Tree!</h2>
                    <p>Create your first character to begin your adventure.</p>
                    <div class="welcome-features">
                        <h3>Features:</h3>
                        <ul>
                            <li>🗡️ Weapon Skills: Master swords, bows, and axes</li>
                            <li>🔮 Magic Schools: Fire, ice, and thunder magic</li>
                            <li>🔨 Professions: Smithing, alchemy, and enchanting</li>
                            <li>📊 Progressive Stats: Strength, Magic Defence, and speed</li>
                            <li>💾 Auto-Save: Your progress is automatically saved</li>
                        </ul>
                    </div>
                    <div class="welcome-shortcuts">
                        <h3>Keyboard Shortcuts:</h3>
                        <ul>
                            <li><kbd>1</kbd> - Skills Tab</li>
                            <li><kbd>2</kbd> - Stats Tab</li>
                            <li><kbd>3</kbd> - Character Sheet</li>
                            <li><kbd>Ctrl+N</kbd> - New Character</li>
                            <li><kbd>Ctrl+S</kbd> - Save Progress</li>
                            <li><kbd>F1</kbd> - Help</li>
                        </ul>
                    </div>
                    <button class="btn btn-primary" onclick="app.closeWelcome()">Get Started</button>
                </div>
            </div>
        `

        document.body.insertAdjacentHTML('beforeend', welcomeHTML)
    }

    // Close welcome modal
    closeWelcome() {
        const modal = document.querySelector('.welcome-modal')
        if (modal) {
            modal.remove()
        }
        uiComponents.showNewCharacterDialog()
    }

    // Show help information
    showHelp() {
        const helpContent = `
            <div class="help-modal">
                <div class="help-content">
                    <h2>RPG Skill Tree Help</h2>
                    
                    <h3>Getting Started</h3>
                    <p>Create a character to begin. You start with 100 lumens and base stats of 10 in each category.</p>
                    
                    <h3>Stats System</h3>
                    <ul>
                        <li><strong>Strength:</strong> Increases health (HP = 10 + STR × 4)</li>
                        <li><strong>Magic Defence:</strong> Increases stamina (STA = 10 + MD × 4)</li>
                        <li><strong>Speed:</strong> Increases armor class (AC = 10 + SPD ÷ 4)</li>
                    </ul>
                    
                    <h3>Skills</h3>
                    <p>Skills are organized in tiers from 1-5. Higher tier skills require prerequisites and cost more lumens.</p>
                    
                    <h3>Prerequisites</h3>
                    <ul>
                        <li><strong>AND:</strong> All listed skills required</li>
                        <li><strong>OR:</strong> Any one of the listed skills required</li>
                    </ul>
                    
                    <h3>Refunding</h3>
                    <p>Refunding a skill also refunds all skills that depend on it (cascade refund).</p>
                    
                    <button class="btn" onclick="app.closeHelp()">Close</button>
                </div>
            </div>
        `

        document.body.insertAdjacentHTML('beforeend', helpContent)
    }

    // Close help modal
    closeHelp() {
        const modal = document.querySelector('.help-modal')
        if (modal) {
            modal.remove()
        }
    }

    // Toggle debug mode
    toggleDebugMode() {
        this.debugMode = !this.debugMode
        localStorage.setItem('rpg_debug_mode', this.debugMode.toString())

        if (this.debugMode) {
            console.log('Debug mode enabled')
            uiComponents.showMessage('Debug mode enabled', 'info')
        } else {
            console.log('Debug mode disabled')
            uiComponents.showMessage('Debug mode disabled', 'info')
        }
    }

    // Show error message
    showError(message) {
        uiComponents.showMessage(message, 'error')
        console.error(message)
    }

    // Export application data
    exportData() {
        try {
            const exportData = {
                version: this.version,
                exportDate: new Date().toISOString(),
                characters: characterManager.getAllCharacters(),
                preferences: JSON.parse(localStorage.getItem('rpg_preferences') || '{}')
            }

            const dataStr = JSON.stringify(exportData, null, 2)
            const dataBlob = new Blob([dataStr], { type: 'application/json' })

            const url = URL.createObjectURL(dataBlob)
            const link = document.createElement('a')
            link.href = url
            link.download = `rpg-skill-tree-export-${new Date().toISOString().split('T')[0]}.json`
            link.click()

            URL.revokeObjectURL(url)
            uiComponents.showMessage('Data exported successfully', 'success')

        } catch (error) {
            console.error('Export failed:', error)
            this.showError('Failed to export data')
        }
    }

    // Import application data
    importData(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader()

            reader.onload = (e) => {
                try {
                    const data = JSON.parse(e.target.result)

                    // Validate import data
                    if (!data.characters || !Array.isArray(data.characters)) {
                        throw new Error('Invalid import file format')
                    }

                    // Import characters
                    let importedCount = 0
                    data.characters.forEach(character => {
                        try {
                            characterManager.importCharacter(character)
                            importedCount++
                        } catch (error) {
                            console.warn(`Failed to import character ${character.name}:`, error)
                        }
                    })

                    // Update displays
                    uiComponents.renderCharacterList()
                    uiComponents.updateDisplay()

                    uiComponents.showMessage(`Imported ${importedCount} characters`, 'success')
                    resolve(importedCount)

                } catch (error) {
                    console.error('Import failed:', error)
                    this.showError('Failed to import data: ' + error.message)
                    reject(error)
                }
            }

            reader.onerror = () => {
                this.showError('Failed to read import file')
                reject(new Error('File read error'))
            }

            reader.readAsText(file)
        })
    }

    // Get application stats
    getAppStats() {
        const characters = characterManager.getAllCharacters()
        const totalSkills = characters.reduce((sum, char) => sum + char.totalSkillsUnlocked, 0)
        const totalLumens = characters.reduce((sum, char) => sum + char.totalLumensSpent, 0)

        return {
            version: this.version,
            characterCount: characters.length,
            totalSkillsUnlocked: totalSkills,
            totalLumensSpent: totalLumens,
            averageLevel: characters.length > 0 ? Math.floor(totalSkills / characters.length / 5) + 1 : 0,
            debugMode: this.debugMode
        }
    }

    // Clean up on page unload
    cleanup() {
        this.saveApplicationState()
        console.log('Application cleanup complete')
    }
}

// Create global app instance and initialize when DOM is loaded
const app = new App()

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => app.init())
} else {
    app.init()
}
