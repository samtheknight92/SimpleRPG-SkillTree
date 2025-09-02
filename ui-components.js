// UI Components - Handles dynamic rendering of all UI elements
class UIComponents {
    constructor() {
        this.currentTab = 'character-sheet'
        this.lastTab = 'character-sheet' // Store last tab for session navigation
        this.lastUpdateTab = 'character-sheet' // Track last tab for tooltip management
        this.selectedSkillCategory = 'weapons'
        this.selectedSkillSubcategory = 'sword'
        this.selectedShopCategory = 'weapons' // Default shop tab
        this.devMode = false // Track dev mode state
        this.toggleInProgress = false // Prevent double-clicking toggle skills

        // Performance optimization: Add caching
        this.renderCache = new Map()
        this.lastRenderState = {}
        this.debounceTimers = new Map()
    }

    // Initialize the UI
    init() {
        this.setupEventListeners()
        this.setupDynamicButtonHandlers()
        this.renderCharacterList()
        this.updateDisplay()

        // Set up periodic cache cleanup to prevent memory leaks
        setInterval(() => {
            this.cleanupCache()
        }, 60000) // Clean up every minute
    }

    // Clean up old cache entries to prevent memory leaks
    cleanupCache() {
        const maxCacheSize = 100
        if (this.renderCache.size > maxCacheSize) {
            const entries = Array.from(this.renderCache.entries())
            // Remove oldest entries
            entries.slice(0, this.renderCache.size - maxCacheSize).forEach(([key]) => {
                this.renderCache.delete(key)
            })
        }
    }

    // Set up all event listeners
    // Helper method to safely set up a button click listener
    setupButtonListener(buttonId, handler) {
        const button = document.getElementById(buttonId)
        if (button) {
            const newButton = button.cloneNode(true)
            button.parentNode.replaceChild(newButton, button)
            newButton.addEventListener('click', (e) => {
                e.preventDefault()
                e.stopPropagation()
                handler.call(this, e)
            })
        }
    }

    // Flag to prevent multiple event listener setup
    _eventListenersSetup = false

    // Setup handlers for dynamically generated buttons
    setupDynamicButtonHandlers() {
        // Store handler reference for proper cleanup
        if (!this.buttonHandlers) {
            this.buttonHandlers = new Map()
        }

        // Clean up any existing handlers
        if (this.buttonHandlers.has('dynamic')) {
            document.removeEventListener('click', this.buttonHandlers.get('dynamic'))
        }

        // Create new handler and bind it to maintain the correct 'this' context
        const dynamicButtonHandler = ((e) => {
            const button = e.target.closest('button')
            if (!button) return

            // Debug for currency buttons
            if (button.classList.contains('currency-btn')) {
                // Currency buttons should be handled by dedicated handlers
            }

            // Only prevent default for buttons we handle
            const shouldHandle =
                button.classList.contains('buy-skill-btn') ||
                button.classList.contains('refund-skill-btn') ||
                button.classList.contains('stat-upgrade-btn') ||
                button.classList.contains('stat-refund-btn') ||
                button.classList.contains('process-turn-btn') ||
                button.classList.contains('remove-effect-btn') ||
                button.classList.contains('unequip-btn') ||
                button.classList.contains('select-race-btn')

            if (!shouldHandle) return

            e.preventDefault()
            e.stopPropagation()
            e.stopImmediatePropagation()

            // Skill tree buttons
            if (button.classList.contains('buy-skill-btn')) {
                const skillId = button.dataset.skillId
                this.purchaseSkill(skillId)
            }
            else if (button.classList.contains('refund-skill-btn')) {
                const skillId = button.dataset.skillId
                this.refundSkill(skillId)
            }
            // Stat buttons
            else if (button.classList.contains('stat-upgrade-btn')) {
                const stat = button.dataset.stat
                this.upgradeStat(stat)
            }
            else if (button.classList.contains('stat-refund-btn')) {
                const stat = button.dataset.stat
                this.refundStat(stat)
            }
            else if (button.classList.contains('process-turn-btn')) {
                this.processTurn()
            }
            else if (button.classList.contains('remove-effect-btn')) {
                const effectId = button.dataset.effectId
                this.removeStatusEffect(effectId)
            }
            // Equipment buttons
            else if (button.classList.contains('unequip-btn')) {
                const slot = button.dataset.slot
                this.unequipItem(slot)
            }
            // Race selection buttons
            else if (button.classList.contains('select-race-btn')) {
                const raceId = button.dataset.raceId
                console.log('Race selection clicked:', raceId, 'from button:', button)
                this.selectRace(raceId)
            }
        })

        // Store the handler for future cleanup
        this.buttonHandlers.set('dynamic', dynamicButtonHandler)

        // Add the handler with capture phase to ensure it runs first
        document.addEventListener('click', dynamicButtonHandler, true)
    }

    setupEventListeners() {
        // Prevent multiple event listener setup
        if (this._eventListenersSetup) {
            console.log('Event listeners already set up, skipping...')
            return
        }
        this._eventListenersSetup = true

        // Hamburger menu toggle
        this.setupButtonListener('hamburger', (e) => {
            const sidePanel = document.getElementById('side-panel')
            const hamburger = document.getElementById('hamburger')

            sidePanel.classList.toggle('open')

            // Hide hamburger when sidebar is open
            if (sidePanel.classList.contains('open')) {
                hamburger.classList.add('hidden')
            } else {
                hamburger.classList.remove('hidden')
            }

            e.target.classList.toggle('active')
        })

        // Close sidebar button
        this.setupButtonListener('close-sidebar-btn', () => {
            const sidePanel = document.getElementById('side-panel')
            const hamburger = document.getElementById('hamburger')

            sidePanel.classList.remove('open')
            hamburger.classList.remove('hidden')
        })

        // Tab navigation (use event delegation with protection)
        const tabHandler = (e) => {
            if (e.target.classList.contains('nav-tab')) {
                e.preventDefault()
                e.stopPropagation()
                this.switchTab(e.target.dataset.tab)
            }
        }
        document.removeEventListener('click', tabHandler)
        document.addEventListener('click', tabHandler)

        // Character management buttons
        this.setupButtonListener('new-character-btn', () => this.showNewCharacterDialog())
        this.setupButtonListener('dev-mode-btn', () => this.toggleDevMode())
        this.setupButtonListener('close-item-sidebar-btn', () => this.hideItemAdminSidebar())
        this.setupButtonListener('create-character-btn', () => this.createNewCharacter())
        this.setupButtonListener('cancel-character-btn', () => this.hideNewCharacterDialog())
        this.setupButtonListener('close-item-admin-btn', () => this.hideItemAdminDialog())

        // Character name input Enter key support
        const characterNameInput = document.getElementById('character-name-input')
        if (characterNameInput) {
            characterNameInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault()
                    this.createNewCharacter()
                }
            })
        }

        // HP/Stamina handlers removed - now handled in consolidated event listener below

        // Item admin sidebar search and category filters
        const setupInputListener = (elementId, handler) => {
            const element = document.getElementById(elementId)
            if (element) {
                const newElement = element.cloneNode(true)
                element.parentNode.replaceChild(newElement, element)
                newElement.addEventListener('input', (e) => {
                    e.stopPropagation()
                    handler.call(this, e)
                })
            }
        }

        const setupSelectListener = (elementId, handler) => {
            const element = document.getElementById(elementId)
            if (element) {
                const newElement = element.cloneNode(true)
                element.parentNode.replaceChild(newElement, element)
                newElement.addEventListener('change', (e) => {
                    e.stopPropagation()
                    handler.call(this, e)
                })
            }
        }

        setupInputListener('sidebar-item-search', () => this.filterSidebarItemList())
        setupInputListener('sidebar-item-name-search', () => this.filterSidebarItemList())
        setupInputListener('sidebar-item-desc-search', () => this.filterSidebarItemList())
        setupSelectListener('sidebar-item-type', () => this.filterSidebarItemList())
        setupSelectListener('sidebar-item-rarity', () => this.filterSidebarItemList())

        // Clear filters button
        const clearFiltersBtn = document.getElementById('clear-item-filters-btn')
        if (clearFiltersBtn) {
            clearFiltersBtn.addEventListener('click', () => this.clearItemFilters())
        }

        // Skill category selection (use event delegation with protection)
        const categoryHandler = (e) => {
            if (e.target.classList.contains('skill-category')) {
                e.preventDefault()
                e.stopPropagation()
                this.selectSkillCategory(e.target.dataset.category)
            }
        }
        document.removeEventListener('click', categoryHandler)
        document.addEventListener('click', categoryHandler)

        // Skill subcategory tabs
        const subcategoryHandler = (e) => {
            if (e.target.classList.contains('skill-tab')) {
                e.preventDefault()
                e.stopPropagation()
                this.selectSkillSubcategory(e.target.dataset.subcategory)
            }
        }
        document.removeEventListener('click', subcategoryHandler)
        document.addEventListener('click', subcategoryHandler)

        // Shop category tabs
        const shopHandler = (e) => {
            if (e.target.classList.contains('shop-tab')) {
                e.preventDefault()
                e.stopPropagation()
                this.selectShopCategory(e.target.dataset.category)
            }
        }
        document.removeEventListener('click', shopHandler)
        document.addEventListener('click', shopHandler)

        // Stat upgrade buttons
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('stat-upgrade-btn')) {
                this.upgradeStat(e.target.dataset.stat)
            }
            if (e.target.classList.contains('stat-refund-btn')) {
                this.refundStat(e.target.dataset.stat)
            }
            if (e.target.classList.contains('mass-refund-stats-btn')) {
                this.massRefundStats()
            }
            if (e.target.classList.contains('mass-refund-skills-btn')) {
                this.massRefundSkills()
            }
        })

        // Skill purchase buttons
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('skill-purchase-btn')) {
                this.purchaseSkill(e.target.dataset.skillId)
            }
        })

        // Skill refund buttons
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('skill-refund-btn')) {
                this.refundSkill(e.target.dataset.skillId)
            }
        })

        // Character selection
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('character-select-btn')) {
                this.selectCharacter(e.target.dataset.characterId)
            }
        })

        // Character deletion
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('character-delete-btn')) {
                this.deleteCharacter(e.target.dataset.characterId)
            }
        })

        // Status effects and testing buttons (consolidated to prevent double activation)
        document.addEventListener('click', (e) => {
            // HP/Stamina testing buttons
            if (e.target.classList.contains('hp-decrease-btn') ||
                e.target.classList.contains('hp-increase-btn') ||
                e.target.classList.contains('stamina-decrease-btn') ||
                e.target.classList.contains('stamina-increase-btn')) {
                e.preventDefault()
                e.stopPropagation()
                e.stopImmediatePropagation()
                this.adjustTestingValue(e.target.dataset.action, e.target.dataset.type)
                return
            }

            // Status effects process turn button
            if (e.target.id === 'process-effects-btn') {
                console.log('Process turn button clicked at:', new Date().toISOString())
                console.log('Button event listeners:', e.target.onclick, e.target.getEventListeners ? e.target.getEventListeners('click') : 'N/A')
                console.log('Button render time:', e.target.dataset.renderTime)

                // Check for duplicate buttons
                const allButtons = document.querySelectorAll('#process-effects-btn')
                if (allButtons.length > 1) {
                    console.warn('Multiple process-effects-btn buttons found:', allButtons.length)
                }

                e.preventDefault()
                e.stopPropagation()
                e.stopImmediatePropagation()
                this.processStatusEffects()
                return
            }

            // Status effect buttons
            if (e.target.classList.contains('status-btn')) {
                e.preventDefault()
                e.stopPropagation()
                e.stopImmediatePropagation()
                const effectId = e.target.dataset.effect
                this.toggleStatusEffect(effectId)
                return
            }

            // Clear all status effects button
            if (e.target.id === 'clear-all-effects-btn') {
                e.preventDefault()
                e.stopPropagation()
                e.stopImmediatePropagation()
                this.clearAllStatusEffects()
                return
            }
        })

        // Inventory system event delegation
        document.addEventListener('click', (e) => {
            const target = e.target

            // Buy item buttons
            if (target.classList.contains('buy-btn')) {
                e.preventDefault()
                e.stopPropagation()
                e.stopImmediatePropagation()
                const itemId = target.dataset.itemId
                this.buyItem(itemId)
            }

            // Equip item buttons
            else if (target.classList.contains('equip-btn')) {
                e.preventDefault()
                e.stopPropagation()
                e.stopImmediatePropagation()
                const itemId = target.dataset.itemId
                const targetSlot = target.dataset.slot || null
                this.equipItem(itemId, targetSlot)
            }

            // Unequip item buttons
            else if (target.classList.contains('unequip-btn')) {
                e.preventDefault()
                e.stopPropagation()
                e.stopImmediatePropagation()
                const slot = target.dataset.slot
                this.unequipItem(slot)
            }

            // Use consumable buttons
            else if (target.classList.contains('use-btn')) {
                e.preventDefault()
                e.stopPropagation()
                e.stopImmediatePropagation()
                const itemId = target.dataset.itemId
                this.useConsumable(itemId)
            }

            // Drop item buttons
            else if (target.classList.contains('drop-btn')) {
                e.preventDefault()
                e.stopPropagation()
                e.stopImmediatePropagation()
                const itemId = target.dataset.itemId
                this.dropItem(itemId)
            }

            // Equip enchantment to weapon buttons
            else if (target.classList.contains('equip-to-weapon-btn')) {
                e.preventDefault()
                e.stopPropagation()
                e.stopImmediatePropagation()
                const enchantmentId = target.dataset.enchantmentId
                this.equipEnchantmentToWeapon(enchantmentId)
            }

            // Equip enchantment to armor buttons
            else if (target.classList.contains('equip-to-armor-btn')) {
                e.preventDefault()
                e.stopPropagation()
                e.stopImmediatePropagation()
                const enchantmentId = target.dataset.enchantmentId
                this.equipEnchantmentToArmor(enchantmentId)
            }

            // Sell item buttons
            else if (target.classList.contains('sell-btn')) {
                e.preventDefault()
                e.stopPropagation()
                e.stopImmediatePropagation()
                const itemId = target.dataset.itemId
                this.sellItem(itemId)
            }

            // Remove status effect buttons (testing)
            else if (target.classList.contains('remove-effect-btn')) {
                e.preventDefault()
                e.stopPropagation()
                e.stopImmediatePropagation()
                const effectId = target.dataset.effectId
                this.removeStatusEffect(effectId)
            }

            // Currency adjustment buttons
            else if (target.classList.contains('currency-btn')) {
                // Currency buttons are handled by their own hold-to-repeat system
                // No action needed here as it's handled by setupCurrencyHoldToRepeat
                return
            }

            // Toggle skill buttons
            else if (target.classList.contains('toggle-button')) {
                const skillId = target.dataset.skillId
                this.toggleSkill(skillId)
            }

            // Enchantment slot interactions
            else if (target.closest('.enchantment-slot')) {
                e.preventDefault()
                e.stopPropagation()
                e.stopImmediatePropagation()
                const enchantmentSlot = target.closest('.enchantment-slot')

                if (enchantmentSlot.classList.contains('filled')) {
                    // Click on filled slot - unequip enchantment
                    const enchantmentId = enchantmentSlot.dataset.enchantmentId
                    const equipmentSlot = enchantmentSlot.dataset.slot
                    this.unequipEnchantment(enchantmentId, equipmentSlot)
                } else if (enchantmentSlot.classList.contains('empty')) {
                    // Click on empty slot - show available enchantments
                    const equipmentSlot = enchantmentSlot.dataset.slot
                    const slotIndex = enchantmentSlot.dataset.slotIndex
                    this.showEnchantmentSelection(equipmentSlot, slotIndex)
                }
            }
        })

        // Test/dev lumens buttons with hold-to-repeat (README spec)
        this.setupHoldToRepeatButton('add-lumens-btn', () => this.addTestLumens())
        this.setupHoldToRepeatButton('remove-lumens-btn', () => this.removeTestLumens())

        // Global tooltip cleanup handlers
        this.setupGlobalTooltipCleanup()
    }

    // Setup hold-to-repeat functionality for buttons
    setupHoldToRepeatButton(buttonId, action) {
        const button = document.getElementById(buttonId)
        if (!button) return

        // Clean up any existing listeners to prevent duplicates
        if (button._lumenCleanup) {
            button._lumenCleanup()
        }

        let holdTimer = null
        let accelerationTimer = null
        let currentDelay = 500 // Initial delay: 500ms
        let isHolding = false

        const startHolding = () => {
            if (isHolding) return
            isHolding = true
            currentDelay = 500 // Reset to initial delay

            // Execute immediately
            action()

            // Start the hold timer with initial delay
            holdTimer = setTimeout(() => {
                repeatedAction()
            }, currentDelay)
        }

        const repeatedAction = () => {
            if (!isHolding) return

            action()

            // Accelerate: reduce delay, but cap at 10ms (100 lumens/second max)
            currentDelay = Math.max(10, currentDelay * 0.9)

            holdTimer = setTimeout(repeatedAction, currentDelay)
        }

        const stopHolding = () => {
            isHolding = false
            if (holdTimer) {
                clearTimeout(holdTimer)
                holdTimer = null
            }
            currentDelay = 500 // Reset for next time
        }

        // Prevent default click events to avoid double activation
        const preventClick = (e) => {
            e.preventDefault()
            e.stopPropagation()
            e.stopImmediatePropagation()
            return false
        }

        // Mouse events
        button.addEventListener('click', preventClick, true)
        button.addEventListener('mousedown', startHolding)
        button.addEventListener('mouseup', stopHolding)
        button.addEventListener('mouseleave', stopHolding)

        // Touch events for mobile
        button.addEventListener('touchstart', (e) => {
            e.preventDefault()
            startHolding()
        })
        button.addEventListener('touchend', (e) => {
            e.preventDefault()
            stopHolding()
        })
        button.addEventListener('touchcancel', stopHolding)

        // Keyboard events for accessibility
        button.addEventListener('keydown', (e) => {
            if (e.key === ' ' || e.key === 'Enter') {
                e.preventDefault()
                startHolding()
            }
        })
        button.addEventListener('keyup', (e) => {
            if (e.key === ' ' || e.key === 'Enter') {
                e.preventDefault()
                stopHolding()
            }
        })

        // Store cleanup function to prevent duplicate listeners
        button._lumenCleanup = () => {
            button.removeEventListener('click', preventClick, true)
            button.removeEventListener('mousedown', startHolding)
            button.removeEventListener('mouseup', stopHolding)
            button.removeEventListener('mouseleave', stopHolding)
            if (holdTimer) {
                clearTimeout(holdTimer)
                holdTimer = null
            }
        }
    }

    // Setup hold-to-repeat for currency buttons (similar to lumens)
    setupCurrencyHoldToRepeat(button, currency, isIncrease) {
        // Clean up any existing listeners to prevent memory leaks
        const existingEvents = button._currencyEvents
        if (existingEvents) {
            button.removeEventListener('mousedown', existingEvents.mousedown)
            button.removeEventListener('mouseup', existingEvents.mouseup)
            button.removeEventListener('mouseleave', existingEvents.mouseleave)
            button.removeEventListener('click', existingEvents.click, true)
            document.removeEventListener('mouseup', existingEvents.documentMouseup)
        }

        let holdTimer = null
        let currentDelay = 500
        let isHolding = false

        const action = () => {
            this.adjustCurrency(currency, isIncrease ? 1 : -1)
        }

        const startHolding = (e) => {
            e.preventDefault()
            e.stopPropagation()
            e.stopImmediatePropagation()

            if (isHolding) return
            isHolding = true
            currentDelay = 500

            // Execute immediately
            action()

            // Start the hold timer with initial delay
            holdTimer = setTimeout(() => {
                repeatedAction()
            }, currentDelay)
        }

        const repeatedAction = () => {
            if (!isHolding) return

            action()

            // Accelerate: reduce delay, but cap at 50ms
            currentDelay = Math.max(50, currentDelay * 0.9)

            holdTimer = setTimeout(repeatedAction, currentDelay)
        }

        const stopHolding = (e) => {
            if (e) {
                e.preventDefault()
                e.stopPropagation()
                e.stopImmediatePropagation()
            }

            isHolding = false
            if (holdTimer) {
                clearTimeout(holdTimer)
                holdTimer = null
            }
            currentDelay = 500
        }

        // Override click behavior completely
        const preventClick = (e) => {
            e.preventDefault()
            e.stopPropagation()
            e.stopImmediatePropagation()
            return false
        }

        // Remove any existing event listeners first
        if (button._cleanup) {
            button._cleanup()
        }

        // Add all event listeners
        // Use simple click handler instead of complex mousedown system
        button.addEventListener('click', (e) => {
            e.preventDefault()
            e.stopPropagation()
            e.stopImmediatePropagation()
            action()
            return false
        }, true)

        // Keep mousedown for hold-to-repeat functionality  
        button.addEventListener('mousedown', startHolding, true)
        button.addEventListener('mouseup', stopHolding, true)
        button.addEventListener('mouseleave', stopHolding, true)
        button.addEventListener('touchstart', startHolding, true)
        button.addEventListener('touchend', stopHolding, true)
        button.addEventListener('touchcancel', stopHolding, true)

        // Global mouse up listener
        const globalMouseUp = (e) => {
            if (isHolding) {
                stopHolding(e)
            }
        }

        document.addEventListener('mouseup', globalMouseUp, true)

        // Store event references for cleanup
        button._currencyEvents = {
            mousedown: startHolding,
            mouseup: stopHolding,
            mouseleave: stopHolding,
            click: preventClick,
            documentMouseup: globalMouseUp
        }

        // Cleanup function
        button._cleanup = () => {
            stopHolding()
            button.removeEventListener('click', preventClick, true)
            button.removeEventListener('mousedown', startHolding, true)
            button.removeEventListener('mouseup', stopHolding, true)
            button.removeEventListener('mouseleave', stopHolding, true)
            button.removeEventListener('touchstart', startHolding, true)
            button.removeEventListener('touchend', stopHolding, true)
            button.removeEventListener('touchcancel', stopHolding, true)
            document.removeEventListener('mouseup', globalMouseUp, true)
            delete button._currencyEvents
        }

        // Store additional cleanup reference for setupCurrencyButtonAcceleration
        button._currencyCleanup = button._cleanup
    }

    // Setup global tooltip cleanup handlers
    setupGlobalTooltipCleanup() {
        // Clean up tooltips when clicking anywhere outside
        document.addEventListener('click', (e) => {
            // Only clean up if the click wasn't on a skill item, shop item, inventory item, equipped item, skill node, or tooltip itself
            if (!e.target.closest('.unlocked-skill-item') &&
                !e.target.closest('.shop-item') &&
                !e.target.closest('.inventory-item') &&
                !e.target.closest('.equipped-item') &&
                !e.target.closest('.skill-node') &&
                !e.target.closest('.race-card') &&
                !e.target.closest('.skill-tooltip') &&
                !e.target.closest('.shop-item-tooltip') &&
                !e.target.closest('.inventory-item-tooltip') &&
                !e.target.closest('.skill-tree-tooltip') &&
                !e.target.closest('.race-tooltip')) {
                this.removeTooltip()
            }
        })

        // Clean up tooltips on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.removeTooltip()
            }
        })

        // Clean up tooltips when scrolling (tooltips can get mispositioned)
        document.addEventListener('scroll', () => {
            this.removeTooltip()
        }, true) // Use capture to catch all scroll events

        // Clean up tooltips on window resize
        window.addEventListener('resize', () => {
            this.removeTooltip()
        })
    }

    // Switch between main tabs
    switchTab(tabName) {
        // Clean up any existing tooltips when switching tabs
        this.removeTooltip()

        // Store the previous tab as last tab for session navigation
        this.lastTab = this.currentTab
        this.currentTab = tabName

        // Update tab buttons
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.classList.toggle('active', tab.dataset.tab === tabName)
        })

        // Update content sections
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.toggle('active', content.id === `${tabName}-tab`)
        })

        this.updateDisplay()
    }

    // Select skill category - Dynamic version
    selectSkillCategory(category) {
        const character = characterManager.getCurrentCharacter()

        // Use dynamic skills system to verify category availability
        if (!window.dynamicSkills?.isCategoryAvailable(category, character, this.devMode)) {
            console.error(`Invalid or unavailable skill category: ${category}`)
            return
        }

        this.selectedSkillCategory = category

        // Update category buttons
        document.querySelectorAll('.skill-category').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.category === category)
        })

        // Get the default subcategory for this category
        const defaultSubcategory = window.dynamicSkills?.getDefaultSubcategory(category, character, this.devMode)

        if (!defaultSubcategory) {
            console.warn(`No subcategories available for category: ${category}`)
            return
        }

        this.selectedSkillSubcategory = defaultSubcategory

        this.renderSkillTabs()
        this.renderSkillTree()
    }

    // Render skill categories dynamically based on available data
    renderSkillCategories() {
        const container = document.querySelector('.skill-categories')
        if (!container) return

        const character = characterManager.getCurrentCharacter()
        const categories = window.dynamicSkills?.getAvailableCategories() || []

        // Filter categories by availability for current character
        const availableCategories = categories.filter(category =>
            window.dynamicSkills?.isCategoryAvailable(category, character, this.devMode)
        )

        if (availableCategories.length === 0) {
            container.innerHTML = '<div class="no-categories">No skill categories available</div>'
            return
        }

        // Ensure we have a valid selected category
        if (!this.selectedSkillCategory || !availableCategories.includes(this.selectedSkillCategory)) {
            this.selectedSkillCategory = availableCategories[0]
        }

        container.innerHTML = availableCategories.map(category => {
            const displayName = window.dynamicSkills?.getCategoryDisplayName(category) || category
            const iconName = this.getCategoryIconName(category)

            return `
                <button class="skill-category ${category === this.selectedSkillCategory ? 'active' : ''}" 
                        data-category="${category}">
                    <span class="btn-icon" data-icon-category="skills" data-icon-name="${iconName}"></span>
                    ${displayName}
                </button>
            `
        }).join('')
    }

    // Get icon name for skill category
    getCategoryIconName(category) {
        const iconMap = {
            'weapons': 'dirk',
            'magic': 'fire',
            'professions': 'smithing',
            'racial': 'crown',
            'monster': 'monster',
            'fusion': 'star',
            'ascension': 'star'
        }
        return iconMap[category] || 'default'
    }

    // Select skill subcategory
    selectSkillSubcategory(subcategory) {
        this.selectedSkillSubcategory = subcategory

        // Update subcategory tabs
        document.querySelectorAll('.skill-tab').forEach(tab => {
            tab.classList.toggle('active', tab.dataset.subcategory === subcategory)
        })

        this.renderSkillTree()
    }

    // Select shop category tab
    selectShopCategory(category) {
        this.selectedShopCategory = category

        // Update shop category tabs
        document.querySelectorAll('.shop-tab').forEach(tab => {
            tab.classList.toggle('active', tab.dataset.category === category)
        })

        this.renderShop()
    }

    // Render character list in side panel with folder system
    renderCharacterList() {
        const container = document.getElementById('character-list')
        if (!container) return

        const characters = characterManager.getAllCharacters()
        const currentChar = characterManager.getCurrentCharacter()
        const folders = characterManager.getAllFolders()

        if (characters.length === 0 && folders.length <= 1) {
            container.innerHTML = '<p class="no-characters">No characters created yet</p>'
            return
        }

        // Create folder structure
        let html = ''

        // Add folder management controls
        html += `
            <div class="folder-controls">
                <button class="btn btn-small folder-add-btn" onclick="uiComponents.showCreateFolderDialog()">
                    + Folder
                </button>
            </div>
        `

        // Render each folder
        folders.forEach(folderName => {
            const folderCharacters = characterManager.getCharactersByFolder(folderName)
            const folderKey = `folder_${folderName.replace(/\s+/g, '_')}`
            const isExpanded = localStorage.getItem(folderKey) !== 'false' // Default to expanded

            html += `
                <div class="folder-section">
                    <div class="folder-header" onclick="uiComponents.toggleFolder('${folderName.replace(/'/g, "\\'")}')">
                        <span class="folder-toggle ${isExpanded ? 'expanded' : 'collapsed'}">${isExpanded ? '?' : '?'}</span>
                        <span class="folder-name">${folderName}</span>
                        <span class="character-count">(${folderCharacters.length})</span>
                        ${folderName !== 'Default' ? `
                            <button class="btn btn-tiny folder-delete-btn" onclick="uiComponents.deleteFolderDialog('${folderName.replace(/'/g, "\\'")}')" title="Delete Folder">
                                🗑️
                            </button>
                        ` : ''}
                    </div>
                    <div class="folder-content ${isExpanded ? 'expanded' : 'collapsed'}" id="folder-${folderName.replace(/\s+/g, '_')}">
                        ${folderCharacters.map(char => {
                const summary = characterManager.getCharacterSummary(char)
                const isActive = currentChar && currentChar.id === char.id
                const isMonster = char.isMonster || false
                const raceInfo = char.race ? window.RACES_DATA?.[char.race] : null
                const raceDisplay = isMonster ? (raceInfo?.name || 'Monster') : (raceInfo?.name || 'No Race')
                const raceIcon = raceInfo?.icon || (isMonster ? '??' : '?')

                return `
                                <div class="character-item ${isActive ? 'active' : ''} ${isMonster ? 'monster-character' : ''}" 
                                     data-character-id="${char.id}"
                                     data-character-name="${char.name}"
                                     data-character-race="${raceDisplay}"
                                     data-character-level="${summary.level}"
                                     data-character-lumens="${summary.lumens || 0}"
                                     data-character-hp="${char.stats?.hp || 0}"
                                     data-character-stamina="${char.stats?.stamina || 0}"
                                     data-character-total-skills="${summary.totalSkills || 0}"
                                     data-character-last-played="${summary.lastPlayed || 'Never'}"
                                     onclick="uiComponents.selectCharacter('${char.id.replace(/'/g, "\\'")}')"
                                     draggable="true"
                                     ondragstart="uiComponents.dragCharacterStart(event)"
                                     ondragover="uiComponents.dragCharacterOver(event)"
                                     ondrop="uiComponents.dragCharacterDrop(event)">
                                    
                                    <div class="character-info">
                                        <div class="character-avatar">
                                            ${raceIcon}
                                        </div>
                                        <div class="character-main-info">
                                            <div class="character-name">${char.name}</div>
                                        </div>
                                        <div class="character-level-badge level-${this.getLevelColor(summary.level)}">
                                            📊 Lv. ${summary.level}
                                        </div>
                                        <div class="character-menu">
                                            <button class="character-menu-btn" onclick="uiComponents.toggleCharacterMenu('${char.id.replace(/'/g, "\\'")}', event); event.stopPropagation();" title="Character Menu">
                                                ⚙️
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            `
            }).join('')}
                        ${folderCharacters.length === 0 ? '<div class="empty-folder">No characters in this folder</div>' : ''}
                    </div>
                </div>
            `
        })

        container.innerHTML = html

        // Initialize character tooltips after rendering
        this.initializeCharacterTooltips()
    }

    // Show new character creation dialog
    showNewCharacterDialog() {
        const dialog = document.getElementById('new-character-dialog')
        dialog.style.display = 'flex'
        document.getElementById('character-name-input').focus()

        // Add click-outside-to-close functionality
        dialog.onclick = (e) => {
            if (e.target === dialog) {
                this.hideNewCharacterDialog()
            }
        }

        // Add escape key to close
        const escapeHandler = (e) => {
            if (e.key === 'Escape') {
                this.hideNewCharacterDialog()
                document.removeEventListener('keydown', escapeHandler)
            }
        }
        document.addEventListener('keydown', escapeHandler)
    }

    // Hide new character creation dialog
    hideNewCharacterDialog() {
        document.getElementById('new-character-dialog').style.display = 'none'
        document.getElementById('character-name-input').value = ''
    }

    // Create new character
    createNewCharacter() {
        const nameInput = document.getElementById('character-name-input')
        const name = nameInput.value.trim()

        if (!name) {
            alert('Please enter a character name')
            return
        }

        try {
            const character = characterManager.createCharacter(name)
            characterManager.saveCharacter(character)
            characterManager.loadCharacter(character.id)

            this.hideNewCharacterDialog()
            this.renderCharacterList()
            this.updateDisplay()

            // Show success message
            this.showMessage(`Character "${name}" created successfully!`, 'success')
        } catch (error) {
            alert(`Failed to create character: ${error.message}`)
        }
    }

    // Select a character
    selectCharacter(characterId) {
        const character = characterManager.loadCharacter(characterId)
        if (character) {
            // Close any open character menus
            document.querySelectorAll('.character-menu-dropdown').forEach(menu => {
                menu.classList.remove('open')
            })

            this.renderCharacterList()
            this.updateDisplay()
            this.showMessage(`Switched to character "${character.name}"`, 'success')
        }
    }

    // Delete a character
    deleteCharacter(characterId) {
        const characters = characterManager.getAllCharacters()
        const character = characters.find(c => c.id === characterId)

        if (!character) return

        this.showConfirm(
            'Delete Character',
            `Are you sure you want to delete "${character.name}"?\n\nThis cannot be undone.`
        ).then(confirmed => {
            if (confirmed) {
                // Close any open character menus
                document.querySelectorAll('.character-menu-dropdown').forEach(menu => {
                    menu.classList.remove('open')
                })

                characterManager.deleteCharacter(characterId)
                this.renderCharacterList()
                this.updateDisplay()
                this.showMessage(`Character "${character.name}" deleted`, 'success')
            }
        })
    }

    // Folder Management Methods

    // Toggle folder expanded/collapsed state
    toggleFolder(folderName) {
        const folderKey = `folder_${folderName.replace(/\s+/g, '_')}`
        const currentState = localStorage.getItem(folderKey) !== 'false' // Default to expanded
        const newState = !currentState

        localStorage.setItem(folderKey, newState.toString())
        this.renderCharacterList()
    }

    // Universal Modal System
    showModal(modalId, setup = null) {
        const modal = document.getElementById(modalId)
        if (!modal) return

        modal.style.display = 'flex'

        // Setup modal content if provided
        if (setup) setup()

        // Add click-outside-to-close
        modal.onclick = (e) => {
            if (e.target === modal) {
                this.hideModal(modalId)
            }
        }

        // Add escape key to close
        const escapeHandler = (e) => {
            if (e.key === 'Escape') {
                this.hideModal(modalId)
                document.removeEventListener('keydown', escapeHandler)
            }
        }
        document.addEventListener('keydown', escapeHandler)
    }

    hideModal(modalId) {
        const modal = document.getElementById(modalId)
        if (modal) {
            modal.style.display = 'none'
        }
    }

    // Promise-based confirm dialog
    showConfirm(title, message) {
        return new Promise((resolve) => {
            this.showModal('confirm-modal', () => {
                document.getElementById('confirm-title').textContent = title
                document.getElementById('confirm-message').textContent = message

                const yesBtn = document.getElementById('confirm-yes-btn')
                const noBtn = document.getElementById('confirm-no-btn')

                // Clean up old listeners
                yesBtn.replaceWith(yesBtn.cloneNode(true))
                noBtn.replaceWith(noBtn.cloneNode(true))

                // Add new listeners
                document.getElementById('confirm-yes-btn').onclick = () => {
                    this.hideModal('confirm-modal')
                    resolve(true)
                }
                document.getElementById('confirm-no-btn').onclick = () => {
                    this.hideModal('confirm-modal')
                    resolve(false)
                }
            })
        })
    }

    // Promise-based prompt dialog
    showPrompt(title, message, defaultValue = '') {
        return new Promise((resolve) => {
            this.showModal('prompt-modal', () => {
                document.getElementById('prompt-title').textContent = title
                document.getElementById('prompt-message').textContent = message

                const input = document.getElementById('prompt-input')
                input.value = defaultValue
                input.focus()

                const okBtn = document.getElementById('prompt-ok-btn')
                const cancelBtn = document.getElementById('prompt-cancel-btn')

                // Clean up old listeners
                okBtn.replaceWith(okBtn.cloneNode(true))
                cancelBtn.replaceWith(cancelBtn.cloneNode(true))

                const handleOk = () => {
                    const value = input.value.trim()
                    this.hideModal('prompt-modal')
                    resolve(value || null)
                }

                const handleCancel = () => {
                    this.hideModal('prompt-modal')
                    resolve(null)
                }

                // Add new listeners
                document.getElementById('prompt-ok-btn').onclick = handleOk
                document.getElementById('prompt-cancel-btn').onclick = handleCancel

                // Add Enter key support
                input.onkeydown = (e) => {
                    if (e.key === 'Enter') {
                        e.preventDefault()
                        handleOk()
                    }
                }
            })
        })
    }

    // Show create folder dialog
    showCreateFolderDialog() {
        this.showModal('create-folder-modal', () => {
            const input = document.getElementById('folder-name-input')
            input.value = ''
            input.focus()

            const createBtn = document.getElementById('create-folder-btn')
            const cancelBtn = document.getElementById('cancel-folder-btn')

            // Clean up old listeners
            createBtn.replaceWith(createBtn.cloneNode(true))
            cancelBtn.replaceWith(cancelBtn.cloneNode(true))

            const handleCreate = () => {
                const folderName = input.value.trim()
                if (folderName) {
                    if (characterManager.createFolder(folderName)) {
                        this.renderCharacterList()
                        this.showMessage(`Folder "${folderName}" created`, 'success')
                        this.hideModal('create-folder-modal')
                    } else {
                        this.showMessage('Failed to create folder', 'error')
                    }
                }
            }

            const handleCancel = () => {
                this.hideModal('create-folder-modal')
            }

            // Add new listeners
            document.getElementById('create-folder-btn').onclick = handleCreate
            document.getElementById('cancel-folder-btn').onclick = handleCancel

            // Add Enter key support
            input.onkeydown = (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault()
                    handleCreate()
                }
            }
        })
    }

    // Show delete folder confirmation
    async deleteFolderDialog(folderName) {
        const confirmed = await this.showConfirm(
            'Delete Folder',
            `Are you sure you want to delete the folder "${folderName}"?\n\nAll characters will be moved to the Default folder.`
        )

        if (confirmed) {
            if (characterManager.deleteFolder(folderName)) {
                this.renderCharacterList()
                this.showMessage(`Folder "${folderName}" deleted`, 'success')
            } else {
                this.showMessage('Failed to delete folder', 'error')
            }
        }
    }

    // Show move character dialog
    showMoveCharacterDialog(characterId) {
        // Close any open character menus
        document.querySelectorAll('.character-menu-dropdown').forEach(menu => {
            menu.classList.remove('open')
        })

        const folders = characterManager.getAllFolders()
        const character = characterManager.getAllCharacters().find(c => c.id === characterId)

        if (!character) return

        // Debug logging
        console.log('showMoveCharacterDialog debug:', {
            folders: folders,
            foldersLength: folders.length,
            folderNames: folders.map(f => f),
            character: character.name,
            characterFolder: character.folder
        })

        let options = folders.map(folder =>
            `<option value="${folder}" ${character.folder === folder ? 'selected' : ''}>${folder}</option>`
        ).join('')

        const folderSelect = document.createElement('select')
        folderSelect.innerHTML = options
        folderSelect.style.cssText = 'padding: 8px; margin: 10px 0; width: 200px; border: 1px solid #ccc; border-radius: 4px;'

        const dialog = document.createElement('div')
        dialog.style.cssText = 'position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: white; padding: 20px; border-radius: 8px; box-shadow: 0 4px 20px rgba(0,0,0,0.3); z-index: 10000; color: black;'
        dialog.innerHTML = `
            <h3>Move "${character.name}" to folder:</h3>
            <div style="margin: 10px 0;"></div>
            <div>
                <button id="move-confirm" style="padding: 8px 16px; margin-right: 10px; background: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer;">Move</button>
                <button id="move-cancel" style="padding: 8px 16px; background: #f44336; color: white; border: none; border-radius: 4px; cursor: pointer;">Cancel</button>
            </div>
        `

        dialog.querySelector('div').appendChild(folderSelect)
        document.body.appendChild(dialog)

        dialog.querySelector('#move-confirm').onclick = () => {
            const selectedFolder = folderSelect.value
            if (characterManager.moveCharacterToFolder(characterId, selectedFolder)) {
                this.renderCharacterList()
                this.showMessage(`"${character.name}" moved to "${selectedFolder}"`, 'success')
            } else {
                this.showMessage('Failed to move character', 'error')
            }
            document.body.removeChild(dialog)
        }

        dialog.querySelector('#move-cancel').onclick = () => {
            document.body.removeChild(dialog)
        }
    }

    // Drag and drop functionality for characters
    dragCharacterStart(event) {
        const characterId = event.target.closest('.character-item').dataset.characterId
        event.dataTransfer.setData('text/plain', characterId)
        event.dataTransfer.effectAllowed = 'move'
    }

    dragCharacterOver(event) {
        event.preventDefault()
        event.dataTransfer.dropEffect = 'move'
    }

    dragCharacterDrop(event) {
        event.preventDefault()
        const characterId = event.dataTransfer.getData('text/plain')
        const folderElement = event.target.closest('.folder-section')

        if (folderElement) {
            const folderName = folderElement.querySelector('.folder-name').textContent
            const character = characterManager.getAllCharacters().find(c => c.id === characterId)

            if (character && characterManager.moveCharacterToFolder(characterId, folderName)) {
                this.renderCharacterList()
                this.showMessage(`"${character.name}" moved to "${folderName}"`, 'success')
            }
        }
    }

    // Character Menu Management

    // Toggle character menu dropdown
    toggleCharacterMenu(characterId, event) {
        console.log('toggleCharacterMenu called with:', characterId, event)

        // Remove any existing menus
        document.querySelectorAll('.character-menu-dropdown').forEach(menu => {
            menu.remove()
        })

        const characters = characterManager.getAllCharacters()
        const character = characters.find(c => c.id === characterId)
        const currentChar = characterManager.getCurrentCharacter()
        const isActive = currentChar && currentChar.id === characterId

        if (!character) {
            console.log('Character not found:', characterId)
            return
        }

        console.log('Creating menu for character:', character.name)

        // Get all folders for the folder list
        const folders = characterManager.getAllFolders()
        const currentFolder = character.folder || 'Default'

        // Create folder list items
        const folderItems = folders.map(folder => {
            const isCurrentFolder = folder === currentFolder
            return `
                <div class="menu-item folder-item ${isCurrentFolder ? 'current-folder' : ''}" 
                     onclick="uiComponents.moveCharacterToFolderFromMenu('${characterId.replace(/'/g, "\\'")}', '${folder.replace(/'/g, "\\'")}')">
                    ?? ${folder} ${isCurrentFolder ? '(current)' : ''}
                </div>
            `
        }).join('')

        // Create menu content with folder list instead of single "Move to Folder" button
        const menuContent = `
            <div class="menu-item ${isActive ? 'disabled' : ''}" onclick="if (!this.classList.contains('disabled')) { uiComponents.selectCharacterFromMenu('${characterId.replace(/'/g, "\\'")}') }">
                Select Character
            </div>
            <div class="menu-separator"></div>
            <div class="menu-section-header">Move to Folder:</div>
            ${folderItems}
            <div class="menu-separator"></div>
            <div class="menu-item danger" onclick="uiComponents.deleteCharacterFromMenu('${characterId.replace(/'/g, "\\'")}')">
                Delete Character
            </div>
        `

        // Create menu element with proper styling
        const menu = document.createElement('div')
        menu.className = 'character-menu-dropdown'
        menu.innerHTML = menuContent
        menu.style.position = 'absolute'
        menu.style.zIndex = '99999'
        menu.style.pointerEvents = 'auto'

        console.log('Menu element created:', menu)

        // Append to body
        document.body.appendChild(menu)
        console.log('Menu appended to body')

        // Position manually next to the button instead of using updateTooltipPosition
        const button = event.target.closest('.character-menu-btn')
        if (button) {
            const buttonRect = button.getBoundingClientRect()
            const menuWidth = 200 // approximate width
            const menuHeight = 250 // approximate height

            // Position to the right of the button with some margin
            let left = buttonRect.right + 8
            let top = buttonRect.top

            // Adjust if menu would go off screen
            if (left + menuWidth > window.innerWidth) {
                left = buttonRect.left - menuWidth - 8 // Show on left side instead
            }

            if (top + menuHeight > window.innerHeight) {
                top = window.innerHeight - menuHeight - 8
            }

            menu.style.left = `${left}px`
            menu.style.top = `${top}px`

            console.log('Menu manually positioned at:', left, top)
        }

        // Close menu when clicking outside
        setTimeout(() => {
            document.addEventListener('click', function closeMenu(clickEvent) {
                if (!clickEvent.target.closest('.character-menu-dropdown') && !clickEvent.target.closest('.character-menu-btn')) {
                    console.log('Closing menu')
                    menu.remove()
                    document.removeEventListener('click', closeMenu)
                }
            })
        }, 10)
    }

    // Helper methods for menu actions
    selectCharacterFromMenu(characterId) {
        document.querySelectorAll('.character-menu-dropdown').forEach(menu => menu.remove())
        this.selectCharacter(characterId)
    }

    deleteCharacterFromMenu(characterId) {
        document.querySelectorAll('.character-menu-dropdown').forEach(menu => menu.remove())
        this.deleteCharacter(characterId)
    }

    moveCharacterToFolderFromMenu(characterId, folderName) {
        document.querySelectorAll('.character-menu-dropdown').forEach(menu => menu.remove())
        const character = characterManager.getAllCharacters().find(c => c.id === characterId)

        if (character && characterManager.moveCharacterToFolder(characterId, folderName)) {
            this.renderCharacterList()
            this.showMessage(`"${character.name}" moved to "${folderName}"`, 'success')
        } else {
            this.showMessage('Failed to move character', 'error')
        }
    }

    showMoveCharacterDialogFromMenu(characterId) {
        document.querySelectorAll('.character-menu-dropdown').forEach(menu => menu.remove())
        this.showMoveCharacterDialog(characterId)
    }    // Toggle Dev Mode
    toggleDevMode() {
        this.devMode = !this.devMode
        const devBtn = document.getElementById('dev-mode-btn')

        if (this.devMode) {
            devBtn.textContent = 'Dev Mode: ON'
            devBtn.classList.add('active')
            this.showMessage('Dev Mode enabled - All skills visible!', 'success')
        } else {
            devBtn.textContent = 'Dev Mode'
            devBtn.classList.remove('active')
            this.showMessage('Dev Mode disabled', 'success')
        }

        // Re-render everything to apply dev mode changes
        this.renderSkillCategories() // Re-render categories to show/hide monster/fusion
        this.renderSkillTabs() // Re-render tabs to show/hide fusion categories
        this.renderSkillTree()
        this.renderCrafting() // Re-render crafting to update material counts
    }

    // Render skill categories dynamically based on character type
    // Check if a fusion skill category has any unlocked or purchasable skills
    hasFusionSkillsInCategory(character, categoryName) {
        if (!character || this.selectedSkillCategory !== 'fusion') {
            return true // Show all categories for non-fusion skills
        }

        // In dev mode, show all fusion categories
        if (this.devMode) {
            return true
        }

        // Check if fusion category exists
        const fusionSkills = SKILLS_DATA.fusion?.[categoryName]
        if (!fusionSkills) return false

        // Check if character has fusion skills unlocked in this category
        const unlockedFusion = character.unlockedSkills?.fusion || {}
        const unlockedSkills = unlockedFusion[categoryName] || []

        // Check if any skills in this category are unlocked or can be unlocked
        return fusionSkills.some(skill => {
            const isUnlocked = unlockedSkills.includes(skill.id)
            const canUnlock = characterManager.validateSkillPrerequisites(character, skill.id)
            return isUnlocked || canUnlock
        })
    }

    // Render skill tabs for current category - Dynamic version
    renderSkillTabs() {
        const container = document.getElementById('skill-tabs')
        if (!container) return

        const character = characterManager.getCurrentCharacter()

        // Use dynamic skills system to get subcategories
        const subcategories = window.dynamicSkills?.getAvailableSubcategories(
            this.selectedSkillCategory,
            character,
            this.devMode
        ) || []

        // If no subcategories available, show appropriate message
        if (subcategories.length === 0) {
            container.innerHTML = '<div class="no-subcategories">No skills available in this category</div>'
            return
        }

        // Ensure we have a valid selected subcategory
        if (!this.selectedSkillSubcategory || !subcategories.includes(this.selectedSkillSubcategory)) {
            this.selectedSkillSubcategory = subcategories[0]
        }

        container.innerHTML = subcategories.map(subcategory => {
            const displayName = window.dynamicSkills?.getSubcategoryDisplayName(
                subcategory,
                this.selectedSkillCategory
            ) || subcategory

            return `
                <button class="skill-tab ${subcategory === this.selectedSkillSubcategory ? 'active' : ''}" 
                        data-subcategory="${subcategory}">
                    ${displayName}
                </button>
            `
        }).join('')
    }

    // Ensure all skill structures exist for dev mode
    ensureAllSkillStructures(character) {
        if (!this.devMode || !character) return

        // Ensure monster skills structure exists
        if (!character.unlockedSkills.monster) {
            character.unlockedSkills.monster = {
                defense: [],
                combat: [],
                magic: [],
                utility: []
            }
        }

        // Ensure fusion skills structure exists  
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

        // Ensure racial skills structure exists
        if (!character.unlockedSkills.racial) {
            character.unlockedSkills.racial = {}
        }

        // If character has a race, ensure that race's skill array exists
        if (character.race && !character.unlockedSkills.racial[character.race]) {
            character.unlockedSkills.racial[character.race] = []
        }
    }

    // Render skill tree for current selection with caching
    renderSkillTree() {
        const container = document.getElementById('skill-tree')
        if (!container) return

        const character = characterManager.getCurrentCharacter()
        if (!character) {
            container.innerHTML = '<p class="no-character">Please select a character to view skills</p>'
            return
        }

        // Performance optimization: Check if we need to re-render
        const currentState = {
            category: this.selectedSkillCategory,
            subcategory: this.selectedSkillSubcategory,
            characterId: character.id,
            unlockedSkills: JSON.stringify(character.unlockedSkills),
            lumens: character.lumens
        }

        const cacheKey = `skillTree_${JSON.stringify(currentState)}`

        // Check if we have a cached version
        if (this.renderCache.has(cacheKey)) {
            container.innerHTML = this.renderCache.get(cacheKey)
            // Initialize tooltips and connections even for cached content
            setTimeout(() => {
                this.initializeSkillTreeTooltips()

                // Get skills data for connections (same logic as below)
                let skills = []
                if (this.selectedSkillCategory === 'racial') {
                    let raceKey
                    if (this.devMode) {
                        raceKey = this.selectedSkillSubcategory
                        skills = window.RACE_SKILL_TREES[raceKey] || []
                    } else {
                        raceKey = this.getRaceKeyFromId(character.race)
                        if (character.race === 'human' && characterManager.canLearnCrossCulturalSkills(character)) {
                            const humanSkills = window.RACE_SKILL_TREES[raceKey] || []
                            const crossCulturalSkills = characterManager.getAvailableCrossCulturalSkills(character)
                            skills = [...humanSkills, ...crossCulturalSkills]
                        } else {
                            skills = window.RACE_SKILL_TREES[raceKey] || []
                        }
                    }
                } else if (this.selectedSkillCategory === 'monster') {
                    skills = SKILLS_DATA.monster[this.selectedSkillSubcategory] || []
                } else {
                    skills = SKILLS_DATA[this.selectedSkillCategory][this.selectedSkillSubcategory] || []
                }

                // Add tier-based skill connection lines
                if (window.skillConnectionRenderer && skills.length > 0) {
                    // Gather all skills data including racial skills
                    const allSkillsData = {
                        ...SKILLS_DATA,
                        racial: window.RACE_SKILL_TREES || {}
                    }

                    window.skillConnectionRenderer.renderSkillConnections(
                        container,
                        skills,
                        character,
                        this.selectedSkillCategory,
                        this.selectedSkillSubcategory,
                        allSkillsData // Pass all skills data for cross-tree lookups
                    )
                }
            }, 200)
            return
        }

        // Ensure all skill structures exist in dev mode
        this.ensureAllSkillStructures(character)

        // Handle all categories including monster and fusion (with subcategories)
        let skills, unlockedSkills

        // Special verification for racial category
        if (this.selectedSkillCategory === 'racial') {
            if (!this.devMode && (!character.race || !window.RACE_SKILL_TREES)) {
                console.error(`No racial skills available: character.race = ${character.race}`)
                container.innerHTML = '<p class="error">No racial skills available. Please select a race first.</p>'
                return
            }

            if (!this.devMode) {
                const raceKey = this.getRaceKeyFromId(character.race)
                if (!window.RACE_SKILL_TREES[raceKey]) {
                    console.error(`Invalid race for skills: ${character.race} (${raceKey})`)
                    container.innerHTML = '<p class="error">Invalid race selected for skills</p>'
                    return
                }
            } else {
                // In dev mode, just check if RACE_SKILL_TREES exists
                if (!window.RACE_SKILL_TREES) {
                    console.error('RACE_SKILL_TREES not loaded')
                    container.innerHTML = '<p class="error">Racial skills data not loaded</p>'
                    return
                }
            }
        }
        // Special verification for monster category since it has a different structure
        else if (this.selectedSkillCategory === 'monster') {
            if (!SKILLS_DATA.monster || !SKILLS_DATA.monster[this.selectedSkillSubcategory]) {
                console.error(`Invalid monster subcategory: ${this.selectedSkillSubcategory}`)
                container.innerHTML = '<p class="error">Invalid monster skill category selected</p>'
                return
            }
        } else if (this.selectedSkillCategory !== 'racial' && (!SKILLS_DATA[this.selectedSkillCategory] || !SKILLS_DATA[this.selectedSkillCategory][this.selectedSkillSubcategory])) {
            console.error(`Invalid category/subcategory: ${this.selectedSkillCategory}/${this.selectedSkillSubcategory}`)
            container.innerHTML = '<p class="error">Invalid skill category selected</p>'
            return
        }

        if (this.selectedSkillCategory === 'racial') {
            // Special handling for racial skills
            let raceKey
            if (this.devMode) {
                // In dev mode, use the selected subcategory as the race key
                raceKey = this.selectedSkillSubcategory
                skills = window.RACE_SKILL_TREES[raceKey] || []
            } else {
                // Normal mode: use character's race
                raceKey = this.getRaceKeyFromId(character.race)

                // Special case for humans: show both their own racial skills AND cross-cultural skills
                if (character.race === 'human' && characterManager.canLearnCrossCulturalSkills(character)) {
                    const humanSkills = window.RACE_SKILL_TREES[raceKey] || []
                    const crossCulturalSkills = characterManager.getAvailableCrossCulturalSkills(character)

                    // Combine human racial skills with cross-cultural skills
                    skills = [...humanSkills, ...crossCulturalSkills]

                    // Add a helpful message if no cross-cultural skills are available
                    if (crossCulturalSkills.length === 0) {
                        console.log('No cross-cultural skills available for human character')
                    }
                } else if (character.race === 'human') {
                    // Human without cross-cultural learning ability - show only their own skills
                    skills = window.RACE_SKILL_TREES[raceKey] || []
                } else {
                    skills = window.RACE_SKILL_TREES[raceKey] || []
                }
            }

            // Initialize racial skills structure if needed
            if (!character.unlockedSkills.racial) {
                character.unlockedSkills.racial = {}
            }

            // Handle unlocked skills differently for humans with cross-cultural abilities
            if (character.race === 'human' && characterManager.canLearnCrossCulturalSkills(character) && !this.devMode) {
                // For humans, we need to check unlocked skills across all source races
                // Initialize human cross-cultural skills tracking
                if (!character.unlockedSkills.racial.human) {
                    character.unlockedSkills.racial.human = []
                }
                unlockedSkills = character.unlockedSkills.racial.human
            } else {
                // Initialize this race's skills if needed (use character race or dev mode race)
                const unlockRaceKey = this.devMode ? raceKey : character.race
                if (!character.unlockedSkills.racial[unlockRaceKey]) {
                    character.unlockedSkills.racial[unlockRaceKey] = []
                }
                unlockedSkills = character.unlockedSkills.racial[unlockRaceKey]
            }
        } else if (this.selectedSkillCategory === 'fusion') {
            // Special handling for fusion skills - only show available ones (unless dev mode)
            skills = SKILLS_DATA[this.selectedSkillCategory][this.selectedSkillSubcategory]

            // Ensure fusion subcategory exists in unlockedSkills
            if (!character.unlockedSkills.fusion) {
                character.unlockedSkills.fusion = {}
            }
            if (!character.unlockedSkills.fusion[this.selectedSkillSubcategory]) {
                character.unlockedSkills.fusion[this.selectedSkillSubcategory] = []
            }

            unlockedSkills = character.unlockedSkills.fusion[this.selectedSkillSubcategory]

            // Filter fusion skills based on availability (only show if unlocked or can unlock)
            // Skip filtering in dev mode to show all skills
            if (!this.devMode) {
                skills = skills.filter(skill => {
                    const isUnlocked = unlockedSkills.includes(skill.id)
                    const canUnlock = characterManager.validateSkillPrerequisites(character, skill.id)
                    return isUnlocked || canUnlock
                })
            }
        } else if (this.selectedSkillCategory === 'monster') {
            // Special handling for monster skills
            skills = SKILLS_DATA.monster[this.selectedSkillSubcategory]

            // Initialize monster skills structure if needed
            if (!character.unlockedSkills.monster) {
                character.unlockedSkills.monster = {
                    defense: [],
                    combat: [],
                    magic: [],
                    utility: []
                }
            }

            // Ensure this subcategory exists in unlockedSkills
            if (!character.unlockedSkills.monster[this.selectedSkillSubcategory]) {
                character.unlockedSkills.monster[this.selectedSkillSubcategory] = []
            }

            unlockedSkills = character.unlockedSkills.monster[this.selectedSkillSubcategory]
        } else if (this.selectedSkillCategory === 'ascension') {
            // Special handling for ascension skills (level-gated unique skills)
            skills = SKILLS_DATA.ascension[this.selectedSkillSubcategory]

            // Initialize ascension skills structure if needed
            if (!character.unlockedSkills.ascension) {
                character.unlockedSkills.ascension = {
                    unique: []
                }
            }

            // Ensure this subcategory exists in unlockedSkills
            if (!character.unlockedSkills.ascension[this.selectedSkillSubcategory]) {
                character.unlockedSkills.ascension[this.selectedSkillSubcategory] = []
            }

            unlockedSkills = character.unlockedSkills.ascension[this.selectedSkillSubcategory]
        } else {
            skills = SKILLS_DATA[this.selectedSkillCategory][this.selectedSkillSubcategory]
            unlockedSkills = character.unlockedSkills[this.selectedSkillCategory][this.selectedSkillSubcategory]
        }

        // Filter out elemental affinity skills for non-monster characters (unless dev mode)
        if (!this.devMode && !character.isMonster) {
            const elementalAffinitySkillIds = window.monsterSystem ? window.monsterSystem.getElementalAffinitySkillIds() : []
            skills = skills.filter(skill => !elementalAffinitySkillIds.includes(skill.id))
        }

        // Group skills by tier
        const skillsByTier = {}
        skills.forEach(skill => {
            if (!skillsByTier[skill.tier]) {
                skillsByTier[skill.tier] = []
            }
            skillsByTier[skill.tier].push(skill)
        })

        // Generate the skill tree HTML
        let skillTreeHTML = ''

        // Add special header for human cross-cultural skills
        if (character.race === 'human' && !this.devMode) {
            const hasHumanDetermination = character.unlockedSkills.racial?.human?.includes('human_determination')
            const crossCulturalCount = hasHumanDetermination ? characterManager.getAvailableCrossCulturalSkills(character).length : 0

            if (hasHumanDetermination) {
                skillTreeHTML += `
                    <div class="cross-cultural-header">
                        <h3>💪 Human Determination + 🌍 Cross-Cultural Learning</h3>
                        <p>Human Determination unlocked! You now have access to ${crossCulturalCount} Tier 1 skills from other races. Adaptability over specialization!</p>
                    </div>
                `
            } else {
                skillTreeHTML += `
                    <div class="cross-cultural-header">
                        <h3>💪 Human Determination</h3>
                        <p>Learn Human Determination first to unlock Cross-Cultural Learning and gain access to Tier 1 skills from other races!</p>
                    </div>
                `
            }
        } skillTreeHTML += `
            <div class="mass-refund-section">
                <button class="btn btn-danger mass-refund-skills-btn">${iconMapper.createIconElement('ui', 'mass_refund', 12)} Refund All Skills (75%)</button>
                <p class="refund-note">This will refund all skills in the current category at 75% value</p>
            </div>
            ` + Object.keys(skillsByTier)
                .sort((a, b) => parseInt(a) - parseInt(b))
                .map(tier => `
                <div class="skill-tier">
                    <h3 class="tier-header">${tier === '0' ? 'Foundation' : `Tier ${tier}`}</h3>
                    <div class="skill-row">
                        ${skillsByTier[tier].map(skill => this.renderSkillNode(skill, character)).join('')}
                    </div>
                </div>
            `).join('')

        container.innerHTML = skillTreeHTML

        // Cache the rendered HTML for performance
        this.renderCache.set(cacheKey, skillTreeHTML)

        // Initialize skill tree tooltips for all skill categories
        setTimeout(() => {
            this.initializeSkillTreeTooltips()

            // Add tier-based skill connection lines
            if (window.skillConnectionRenderer && skills.length > 0) {
                // Gather all skills data including racial skills
                const allSkillsData = {
                    ...SKILLS_DATA,
                    racial: window.RACE_SKILL_TREES || {}
                }

                window.skillConnectionRenderer.renderSkillConnections(
                    container,
                    skills,
                    character,
                    this.selectedSkillCategory,
                    this.selectedSkillSubcategory,
                    allSkillsData // Pass all skills data for cross-tree lookups
                )
            }
        }, 200) // Increased timeout to ensure DOM is ready
    }

    // Render individual skill node
    renderSkillNode(skill, character) {
        // Handle all skill categories uniformly (including monster and racial)
        let unlockedSkillsArray = []

        if (this.selectedSkillCategory === 'racial') {
            // For racial skills, get the array for the character's race
            if (character.unlockedSkills.racial && character.unlockedSkills.racial[character.race]) {
                unlockedSkillsArray = character.unlockedSkills.racial[character.race]
            }
        } else {
            // Add defensive checks to ensure the skill category and subcategory exist
            const categorySkills = character.unlockedSkills[this.selectedSkillCategory] || {}

            // Map weapon subcategories to character structure (same as in unlockSkill)
            const weaponSubcategoryMap = {
                'Bow': 'ranged',
                'Crossbow': 'ranged'
            }
            const mappedSubcategory = weaponSubcategoryMap[this.selectedSkillSubcategory] || this.selectedSkillSubcategory

            unlockedSkillsArray = categorySkills[mappedSubcategory] || []
        }

        const isUnlocked = unlockedSkillsArray.includes(skill.id)
        const prerequisitesMet = characterManager.validateSkillPrerequisites(character, skill.id)
        const canPurchase = !isUnlocked &&
            (this.devMode || prerequisitesMet) &&
            character.lumens >= skill.cost
        const canAfford = character.lumens >= skill.cost

        let statusClass = ''
        let actionButton = ''

        if (isUnlocked) {
            statusClass = 'unlocked'
            // Check if this skill is unrefundable
            const unrefundableSkills = ['unarmed_beginner']
            if (unrefundableSkills.includes(skill.id)) {
                actionButton = `<span class="unrefundable-note">Unrefundable</span>`
            } else {
                actionButton = `<button class="btn btn-small btn-danger refund-skill-btn" data-skill-id="${skill.id}">${iconMapper.createIconElement('ui', 'refund', 12)} Refund</button>`
            }
        } else if (canPurchase) {
            statusClass = 'available'
            const devNote = this.devMode && !prerequisitesMet ? ' (DEV)' : ''
            actionButton = `<button class="btn btn-small buy-skill-btn" data-skill-id="${skill.id}">${iconMapper.createIconElement('ui', 'purchase', 12)} Buy${devNote} (${skill.cost}L)</button>`
        } else if (!canAfford) {
            statusClass = 'expensive'
            actionButton = `<span class="cost-display">${skill.cost}L</span>`
        } else {
            statusClass = this.devMode ? 'available' : 'locked'
            if (this.devMode && !prerequisitesMet) {
                actionButton = `<button class="btn btn-small buy-skill-btn" data-skill-id="${skill.id}">${iconMapper.createIconElement('ui', 'purchase', 12)} Buy (DEV) (${skill.cost}L)</button>`
            } else {
                actionButton = `<span class="cost-display">${skill.cost}L</span>`
            }
        }

        // Check if this is a cross-cultural skill for humans
        let skillDisplayName = skill.name
        if (skill.sourceRace) {
            const sourceRaceData = window.RACES_DATA?.[skill.sourceRace]
            const raceIcon = sourceRaceData?.icon || '🏛️'
            skillDisplayName = `${skill.name} <span class="source-race">(${raceIcon} ${this.capitalizeFirst(skill.sourceRace)})</span>`
        }

        // Add special class for Tier 0 foundational skills
        const foundationalClass = skill.tier === 0 ? ' foundational' : ''

        return `
            <div class="skill-node ${statusClass}${foundationalClass}" data-skill-id="${skill.id}">
                <div class="skill-icon">${skill.icon}</div>
                <h4 class="skill-name">${skillDisplayName}</h4>
                <div class="skill-action">
                    ${actionButton}
                </div>
            </div>
        `
    }

    // Render skill prerequisites
    renderPrerequisites(skill) {
        if (skill.prerequisites.type === 'NONE') {
            return '<span class="prereq-none">No prerequisites</span>'
        }

        // Handle level-based prerequisites
        if (skill.prerequisites.type === 'LEVEL') {
            return `<span class="prereq-list">Requires: Level ${skill.prerequisites.level}+</span>`
        }

        // Handle special prerequisite types
        if (skill.prerequisites.type === 'THREE_TIER5_MAGIC') {
            const tier5MagicMasteries = ['fire_supremacy', 'ice_supremacy', 'lightning_supremacy', 'earth_supremacy', 'wind_mastery', 'water_mastery', 'light_mastery', 'darkness_mastery']
            const prereqSkills = tier5MagicMasteries.map(skillId => {
                const prereqSkill = findSkillById(skillId)
                return prereqSkill ? prereqSkill.name : skillId
            })
            return `<span class="prereq-list">Requires: Any 3 of: ${prereqSkills.join(', ')}</span>`
        } else if (skill.prerequisites.type === 'ALL_LIGHT_MAGIC') {
            const lightMagicSpells = ['heal', 'cure', 'blessing', 'holy_light', 'light_mastery']
            const prereqSkills = lightMagicSpells.map(skillId => {
                const prereqSkill = findSkillById(skillId)
                return prereqSkill ? prereqSkill.name : skillId
            })
            return `<span class="prereq-list">Requires: All: ${prereqSkills.join(', ')}</span>`
        } else if (skill.prerequisites.type === 'OR_WEAPON_MASTERY_AND_DARKNESS') {
            const weaponMasteries = ['sword_mastery', 'bow_mastery', 'staff_mastery', 'dagger_mastery']
            const weaponPrereqSkills = weaponMasteries.map(skillId => {
                const prereqSkill = findSkillById(skillId)
                return prereqSkill ? prereqSkill.name : skillId
            })
            const darknessPrereqSkill = findSkillById('darkness_mastery')
            const darknessName = darknessPrereqSkill ? darknessPrereqSkill.name : 'darkness_mastery'
            return `<span class="prereq-list">Requires: Any weapon mastery (${weaponPrereqSkills.join(', ')}) AND ${darknessName}</span>`
        }

        // Handle standard AND/OR prerequisites
        const prereqSkills = skill.prerequisites.skills.map(skillId => {
            const prereqSkill = findSkillById(skillId)
            if (!prereqSkill) return skillId

            // Check if this prerequisite is from a different skill tree
            const skillTreeInfo = this.findSkillTreeInfo(skillId)
            if (skillTreeInfo) {
                const categoryName = skillTreeInfo.category === 'racial'
                    ? `${skillTreeInfo.subcategory.charAt(0).toUpperCase() + skillTreeInfo.subcategory.slice(1)} Racial`
                    : `${skillTreeInfo.category.charAt(0).toUpperCase() + skillTreeInfo.category.slice(1)} → ${skillTreeInfo.subcategory.charAt(0).toUpperCase() + skillTreeInfo.subcategory.slice(1)}`

                return `${prereqSkill.name} (${categoryName})`
            }

            return prereqSkill.name
        })

        const connector = skill.prerequisites.type === 'AND' ? ' AND ' : ' OR '
        return `<span class="prereq-list">Requires: ${prereqSkills.join(connector)}</span>`
    }

    // Purchase a skill
    purchaseSkill(skillId) {
        const character = characterManager.getCurrentCharacter()
        if (!character) return

        try {
            characterManager.unlockSkill(character, skillId, this.devMode)
            this.renderSkillCategories() // Re-render categories to check for fusion skills
            this.renderSkillTabs() // Re-render tabs to show/hide fusion categories
            this.renderSkillTree()
            this.updateCharacterDisplay()

            const skill = findSkillById(skillId)
            const devNote = this.devMode ? ' (DEV MODE)' : ''
            this.showMessage(`Learned "${skill.name}"!${devNote}`, 'success')
        } catch (error) {
            this.showMessage(error.message, 'error')
        }
    }

    // Refund a skill
    refundSkill(skillId) {
        const character = characterManager.getCurrentCharacter()
        if (!character) return

        const skill = findSkillById(skillId)
        this.showConfirm(
            'Refund Skill',
            `Are you sure you want to refund "${skill.name}"?\n\nThis will also refund any skills that depend on it.`
        ).then(confirmed => {
            if (confirmed) {
                try {
                    const result = characterManager.refundSkill(character, skillId)
                    this.renderSkillCategories() // Re-render categories to check for fusion skills
                    this.renderSkillTabs() // Re-render tabs to show/hide fusion categories
                    this.renderSkillTree()
                    this.updateCharacterDisplay()

                    const message = `Refunded "${skill.name}" and ${result.refundedSkills.length - 1} dependent skills for ${result.totalRefund} lumens`
                    this.showMessage(message, 'success')
                } catch (error) {
                    this.showMessage(error.message, 'error')
                }
            }
        })
    }

    // Upgrade a stat
    upgradeStat(statName) {
        const character = characterManager.getCurrentCharacter()
        if (!character) return

        const currentValue = character.stats[statName]
        const cost = gameLogic.getStatUpgradeCost(currentValue, statName)

        if (character.lumens < cost) {
            this.showMessage(`Not enough lumens! Need ${cost}L`, 'error')
            return
        }

        try {
            characterManager.spendLumens(character, cost)
            const newValue = currentValue + 1

            // Check for HP milestone bonus
            if (statName === 'hp') {
                const milestoneResult = gameLogic.getMilestoneBonus(newValue, character)
                if (milestoneResult.bonus > 0) {
                    // Mark milestone as achieved and apply bonus
                    if (!character.hpMilestones) {
                        character.hpMilestones = { hp25: false, hp50: false, hp100: false, hp200: false, hp300: false, hp400: false, hp500: false }
                    }
                    character.hpMilestones[milestoneResult.flag] = true

                    // Apply base upgrade + milestone bonus
                    characterManager.updateStats(character, statName, newValue + milestoneResult.bonus)
                    this.showMessage(`?? HP MILESTONE REACHED! HP increased to ${newValue + milestoneResult.bonus} (+${milestoneResult.bonus} bonus HP!)`, 'success')
                } else {
                    characterManager.updateStats(character, statName, newValue)
                    this.showMessage(`${this.capitalizeFirst(statName)} increased to ${newValue}!`, 'success')
                }
            }
            // Check for Stamina milestone bonus
            else if (statName === 'stamina') {
                const milestoneResult = gameLogic.getStaminaMilestoneBonus(newValue, character)
                if (milestoneResult.bonus > 0) {
                    // Mark milestone as achieved and apply bonus
                    if (!character.staminaMilestones) {
                        character.staminaMilestones = { stamina15: false, stamina25: false, stamina40: false, stamina60: false }
                    }
                    character.staminaMilestones[milestoneResult.flag] = true

                    // Apply base upgrade + milestone bonus
                    characterManager.updateStats(character, statName, newValue + milestoneResult.bonus)
                    this.showMessage(`? STAMINA MILESTONE REACHED! Stamina increased to ${newValue + milestoneResult.bonus} (+${milestoneResult.bonus} bonus stamina!)`, 'success')
                } else {
                    characterManager.updateStats(character, statName, newValue)
                    this.showMessage(`${this.capitalizeFirst(statName)} increased to ${newValue}!`, 'success')
                }
            } else {
                characterManager.updateStats(character, statName, newValue)
                this.showMessage(`${this.capitalizeFirst(statName)} increased to ${newValue}!`, 'success')
            }

            this.updateCharacterDisplay()
            this.renderStatsTab()

        } catch (error) {
            this.showMessage(error.message, 'error')
        }
    }

    // Refund a stat upgrade
    refundStat(statName) {
        const character = characterManager.getCurrentCharacter()
        if (!character) return

        const currentValue = character.stats[statName]
        const minValue = this.getMinStatValue(statName)

        if (currentValue <= minValue) {
            this.showMessage(`Cannot refund ${this.capitalizeFirst(statName)} below minimum value`, 'error')
            return
        }

        // Calculate refund amount (75% of the cost to get to current level)
        const costOfCurrentLevel = gameLogic.getStatUpgradeCost(currentValue - 1, statName)
        const refundAmount = Math.floor(costOfCurrentLevel * 0.75)

        this.showConfirm(
            'Refund Stat',
            `Refund ${this.capitalizeFirst(statName)} from ${currentValue} to ${currentValue - 1} for ${refundAmount} lumens (75% refund)?`
        ).then(confirmed => {
            if (confirmed) {
                try {
                    // Give back lumens
                    character.lumens += refundAmount
                    character.totalLumensSpent -= refundAmount

                    // Decrease stat
                    characterManager.updateStats(character, statName, currentValue - 1)

                    // Update milestone tracking if necessary
                    if (statName === 'hp') {
                        // Update HP milestones based on new value
                        const newHpMilestones = {}
                        const hpThresholds = [25, 50, 100, 200, 300, 400, 500]

                        hpThresholds.forEach(threshold => {
                            if (character.stats.hp >= threshold) {
                                newHpMilestones[threshold] = true
                            }
                        })

                        character.hpMilestones = newHpMilestones
                    } else if (statName === 'stamina') {
                        // Update stamina milestones based on new value
                        const newStaminaMilestones = {}
                        const staminaThresholds = [15, 25, 40, 60]

                        staminaThresholds.forEach(threshold => {
                            if (character.stats.stamina >= threshold) {
                                newStaminaMilestones[threshold] = true
                            }
                        })

                        character.staminaMilestones = newStaminaMilestones
                    }

                    characterManager.saveCharacter(character)

                    this.updateCharacterDisplay()
                    this.renderStatsTab()

                    this.showMessage(`${this.capitalizeFirst(statName)} decreased to ${currentValue - 1}! Refunded ${refundAmount}L`, 'success')
                } catch (error) {
                    this.showMessage(error.message, 'error')
                }
            }
        })
    }

    // Get minimum stat value based on stat type
    getMinStatValue(statName) {
        // HP has special milestone-based minimum to prevent exploit
        if (statName === 'hp') {
            const character = characterManager.getCurrentCharacter()
            return gameLogic.getMinimumHP(character)
        }

        // Stamina has special milestone-based minimum to prevent exploit
        if (statName === 'stamina') {
            const character = characterManager.getCurrentCharacter()
            return gameLogic.getMinimumStamina(character)
        }

        // Other stats have fixed minimums
        switch (statName) {
            case 'strength':
            case 'magicPower':
            case 'accuracy':
                return -3  // README spec: -3 to +8
            case 'speed':
                return 2   // Minimum speed for basic movement
            case 'physicalDefence':
            case 'magicalDefence':
                return 8   // New starting value
            default:
                return 0
        }
    }

    // Get a friendly display name for monster skill subcategories
    getMonsterSubcategoryDisplayName(subcategory) {
        const displayNames = {
            'defense': 'Defensive Skills',
            'combat': 'Combat Skills',
            'magic': 'Magical Abilities',
            'utility': 'Utility Skills'
        }
        return displayNames[subcategory] || this.capitalizeFirst(subcategory)
    }

    // Get the race key for RACE_SKILL_TREES from race ID
    getRaceKeyFromId(raceId) {
        const raceKeyMap = {
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
        return raceKeyMap[raceId] || raceId
    }

    // Get racial skills display name
    getRacialDisplayName(raceId) {
        if (!window.RACES_DATA || !window.RACES_DATA[raceId]) {
            return this.capitalizeFirst(raceId)
        }
        return window.RACES_DATA[raceId].name
    }

    // Mass refund all stats
    massRefundStats() {
        const character = characterManager.getCurrentCharacter()
        if (!character) return

        // Calculate total refund amount
        let totalRefund = 0
        const statChanges = []

        Object.entries(character.stats).forEach(([statName, currentValue]) => {
            const minValue = this.getMinStatValue(statName)
            if (currentValue > minValue) {
                // Calculate refund for each level above minimum
                let statRefund = 0
                for (let level = minValue; level < currentValue; level++) {
                    const costAtLevel = gameLogic.getStatUpgradeCost(level, statName)
                    statRefund += Math.floor(costAtLevel * 0.75)
                }

                if (statRefund > 0) {
                    totalRefund += statRefund
                    statChanges.push({
                        stat: statName,
                        from: currentValue,
                        to: minValue,
                        refund: statRefund
                    })
                }
            }
        })

        if (totalRefund === 0) {
            this.showMessage('No stat upgrades to refund', 'error')
            return
        }

        const changesSummary = statChanges.map(change =>
            `${this.capitalizeFirst(change.stat)}: ${change.from} -> ${change.to} (+${change.refund}L)`
        ).join('\n')

        if (confirm(`Mass refund all stats?\n\n${changesSummary}\n\nTotal refund: ${totalRefund} lumens\n\nThis cannot be undone!`)) {
            try {
                // Apply all changes
                statChanges.forEach(change => {
                    characterManager.updateStats(character, change.stat, change.to)
                })

                // Give back lumens
                character.lumens += totalRefund
                character.totalLumensSpent -= totalRefund

                characterManager.saveCharacter(character)

                this.updateCharacterDisplay()
                this.renderStatsTab()

                this.showMessage(`All stats refunded! Received ${totalRefund} lumens back`, 'success')
            } catch (error) {
                this.showMessage(error.message, 'error')
            }
        }
    }

    // Select a race for the current character
    selectRace(raceId) {
        console.log('selectRace called with:', raceId)
        console.log('Available races:', Object.keys(window.RACES_DATA || {}))

        const character = characterManager.getCurrentCharacter()
        if (!character) {
            this.showMessage('No character selected', 'error')
            return
        }

        if (character.isMonster) {
            this.showMessage('Monsters cannot have races', 'error')
            return
        }

        if (character.race !== null) {
            this.showMessage('Character race is already set and cannot be changed', 'error')
            return
        }

        if (!window.RACES_DATA || !window.RACES_DATA[raceId]) {
            this.showMessage(`Invalid race: ${raceId}`, 'error')
            return
        }

        const raceData = window.RACES_DATA[raceId]

        // Special handling for dragonborn elemental choice
        if (raceId === 'dragonborn') {
            this.showRaceSelectionWithElement(raceId, raceData)
        } else {
            this.showRaceSelectionConfirmation(raceId, raceData)
        }
    }

    // Show race selection confirmation modal
    showRaceSelectionConfirmation(raceId, raceData) {
        this.showModal('race-selection-modal', () => {
            document.getElementById('race-selection-title').textContent = `Confirm Race Selection: ${raceData.name}`
            document.getElementById('race-selection-message').textContent =
                `Are you sure you want to choose ${raceData.name}?\n\n${raceData.description}\n\nThis choice is PERMANENT and cannot be changed.`

            // Hide elemental choice for non-dragonborn
            document.getElementById('race-elemental-choice').style.display = 'none'

            const confirmBtn = document.getElementById('confirm-race-btn')
            const cancelBtn = document.getElementById('cancel-race-btn')

            // Clean up old listeners
            confirmBtn.replaceWith(confirmBtn.cloneNode(true))
            cancelBtn.replaceWith(cancelBtn.cloneNode(true))

            const handleConfirm = () => {
                this.confirmRaceSelection(raceId, null)
                this.hideModal('race-selection-modal')
            }

            const handleCancel = () => {
                this.hideModal('race-selection-modal')
            }

            // Add new listeners
            document.getElementById('confirm-race-btn').onclick = handleConfirm
            document.getElementById('cancel-race-btn').onclick = handleCancel
        })
    }

    // Show race selection with elemental choice for dragonborn
    showRaceSelectionWithElement(raceId, raceData) {
        this.showModal('race-selection-modal', () => {
            document.getElementById('race-selection-title').textContent = `Confirm Race Selection: ${raceData.name}`
            document.getElementById('race-selection-message').textContent =
                `Are you sure you want to choose ${raceData.name}?\n\n${raceData.description}\n\nThis choice is PERMANENT and cannot be changed.`

            // Show elemental choice for dragonborn
            const elementalChoice = document.getElementById('race-elemental-choice')
            elementalChoice.style.display = 'block'

            const elementalSelect = document.getElementById('elemental-select')
            elementalSelect.value = '' // Reset selection

            const confirmBtn = document.getElementById('confirm-race-btn')
            const cancelBtn = document.getElementById('cancel-race-btn')

            // Clean up old listeners
            confirmBtn.replaceWith(confirmBtn.cloneNode(true))
            cancelBtn.replaceWith(cancelBtn.cloneNode(true))

            const handleConfirm = () => {
                const selectedElement = elementalSelect.value
                if (!selectedElement) {
                    this.showMessage('Please select an elemental affinity', 'error')
                    return
                }
                this.confirmRaceSelection(raceId, selectedElement.toLowerCase())
                this.hideModal('race-selection-modal')
            }

            const handleCancel = () => {
                this.hideModal('race-selection-modal')
            }

            // Add new listeners
            document.getElementById('confirm-race-btn').onclick = handleConfirm
            document.getElementById('cancel-race-btn').onclick = handleCancel
        })
    }

    // Actually confirm and apply the race selection
    confirmRaceSelection(raceId, elementalChoice) {
        const character = characterManager.getCurrentCharacter()
        if (!character) return

        const raceData = window.RACES_DATA[raceId]

        try {
            // For dragonborn, set elemental choice BEFORE setting race
            if (raceId === 'dragonborn' && elementalChoice) {
                // Temporarily set the elemental choice so applyRacialAbilities can use it
                character.racialAbilities = character.racialAbilities || {}
                character.racialAbilities.draconicElement = elementalChoice
                character.racialAbilities.elementalResistance = elementalChoice
            }

            // Set the race using character manager
            characterManager.setCharacterRace(character, raceId)

            // Refresh the character sheet to show the selected race
            this.renderCharacterSheet()

            this.showMessage(`Welcome, ${character.name} the ${raceData.name}! Your racial abilities are now active.`, 'success')
        } catch (error) {
            this.showMessage(error.message, 'error')
        }
    }

    // Dev Mode: Remove character race
    removeCharacterRace() {
        if (!this.devMode) {
            this.showMessage('This feature is only available in Dev Mode', 'error')
            return
        }

        const character = characterManager.getCurrentCharacter()
        if (!character) {
            this.showMessage('No character selected', 'error')
            return
        }

        if (!character.race) {
            this.showMessage('Character has no race to remove', 'info')
            return
        }

        this.showConfirm(
            'Remove Race (Dev Mode)',
            `Are you sure you want to remove ${character.name}'s race?\n\nThis will reset all racial abilities and bonuses.\n\nThis action can be undone by selecting a new race.`
        ).then(confirmed => {
            if (confirmed) {
                try {
                    // Store the old race data for reverting changes
                    const raceData = window.RACES_DATA?.[character.race]
                    const oldRaceName = raceData?.name || character.race

                    // Remove racial stat modifiers
                    if (raceData?.statModifiers) {
                        Object.keys(raceData.statModifiers).forEach(stat => {
                            if (character.stats[stat] !== undefined) {
                                character.stats[stat] -= raceData.statModifiers[stat]
                            }
                        })

                        // Update max HP and stamina if they were modified
                        if (raceData.statModifiers.hp) {
                            character.maxHp -= raceData.statModifiers.hp
                            character.hp = Math.max(1, character.hp - raceData.statModifiers.hp)
                        }
                        if (raceData.statModifiers.stamina) {
                            character.maxStamina -= raceData.statModifiers.stamina
                            character.stamina = Math.max(0, character.stamina - raceData.statModifiers.stamina)
                        }
                    }

                    // Reset race-related properties
                    character.race = null
                    character.racialAbilities = {}
                    character.racialPassiveTraits = []

                    // Clear racial skills
                    if (character.unlockedSkills?.racial) {
                        character.unlockedSkills.racial = {}
                    }

                    // Save the character
                    characterManager.saveCharacter(character)

                    // Refresh the character sheet
                    this.renderCharacterSheet()
                    this.updateCharacterDisplay()

                    this.showMessage(`${character.name}'s race (${oldRaceName}) has been removed. You can now select a new race.`, 'success')
                } catch (error) {
                    this.showMessage(`Error removing race: ${error.message}`, 'error')
                }
            }
        })
    }

    // Mass refund all skills in current category
    massRefundSkills() {
        const character = characterManager.getCurrentCharacter()
        if (!character) return

        const category = this.selectedSkillCategory
        const unlockedSkillIds = characterManager.getAllUnlockedSkillIdsForRefund(character)

        // Filter skills to only those in the current category
        const categorySkillIds = unlockedSkillIds.filter(skillId => {
            const skill = findSkillById(skillId)
            return skill && this.findSkillCategory(skillId) === category
        })

        if (categorySkillIds.length === 0) {
            this.showMessage(`No skills to refund in ${this.capitalizeFirst(category)} category`, 'error')
            return
        }

        // Calculate total refund
        let totalRefund = 0
        const skillChanges = []

        categorySkillIds.forEach(skillId => {
            const skill = findSkillById(skillId)
            if (skill) {
                const refundAmount = Math.floor(skill.cost * 0.75)
                totalRefund += refundAmount
                skillChanges.push({
                    skill: skill.name,
                    cost: skill.cost,
                    refund: refundAmount
                })
            }
        })

        const changesSummary = skillChanges.map(change =>
            `${change.skill}: ${change.cost}L -> +${change.refund}L refund`
        ).join('\n')

        if (confirm(`Mass refund all ${this.capitalizeFirst(category)} skills?\n\n${changesSummary}\n\nTotal refund: ${totalRefund} lumens\n\nThis cannot be undone!`)) {
            try {
                // Refund all skills in the category
                categorySkillIds.forEach(skillId => {
                    characterManager.refundSkill(character, skillId)
                })

                this.renderSkillCategories() // Re-render categories to check for fusion skills
                this.renderSkillTabs() // Re-render tabs to show/hide fusion categories
                this.updateCharacterDisplay()
                this.renderSkillTree()

                this.showMessage(`All ${this.capitalizeFirst(category)} skills refunded! Received ${totalRefund} lumens back`, 'success')
            } catch (error) {
                this.showMessage(error.message, 'error')
            }
        }
    }

    // Helper method to find which category a skill belongs to
    findSkillCategory(skillId) {
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

    // Render stats tab
    renderStatsTab() {
        const container = document.getElementById('stats-content')
        if (!container) return

        const character = characterManager.getCurrentCharacter()
        if (!character) {
            container.innerHTML = '<p class="no-character">Please select a character to view stats</p>'
            return
        }

        const stats = character.stats
        const effectiveStats = window.inventorySystem ? window.inventorySystem.getEffectiveStats(character) : stats
        const derivedStats = gameLogic.calculateDerivedStats(effectiveStats)

        container.innerHTML = `
            <div class="stats-grid">
                <!-- Primary Stats Group -->
                <div class="stat-group">
                    <h3>${iconMapper.createIconElement('statusEffects', 'enhanced', 16)} Primary Stats</h3>
                    ${this.renderStatUpgrade('hp', stats.hp, character.lumens, 'HP')}
                    ${this.renderStatUpgrade('stamina', stats.stamina, character.lumens, 'Stamina')}
                </div>
                
                <!-- Combat Stats Group -->
                <div class="stat-group">
                    <h3>${iconMapper.createIconElement('weapons', 'battle_axe', 16)} Combat Stats</h3>
                    ${this.renderStatUpgrade('strength', stats.strength, character.lumens, 'Strength (Damage Modifier)')}
                    ${this.renderStatUpgrade('magicPower', stats.magicPower, character.lumens, 'Magic Power (Damage Modifier)')}
                    ${this.renderStatUpgrade('accuracy', stats.accuracy, character.lumens, 'Accuracy (Hit Chance)')}
                </div>
                
                <!-- Mobility & Defense Group -->
                <div class="stat-group">
                    <h3>${iconMapper.createIconElement('armor', 'armor', 16)} Mobility & Defense</h3>
                    ${this.renderStatUpgrade('speed', stats.speed, character.lumens, 'Speed (1 = 5ft movement)')}
                    ${this.renderStatUpgrade('physicalDefence', stats.physicalDefence, character.lumens, 'Physical Defence')}
                    ${this.renderStatUpgrade('magicalDefence', stats.magicalDefence, character.lumens, 'Magical Defence')}
                </div>
            </div>
            
            <div class="derived-stats">
                <h3>${iconMapper.createIconElement('ui', 'calculated_values', 16)} Calculated Values</h3>
                <div class="derived-stats-grid">
                    <div class="stat-display">
                        <span class="stat-name">Current HP</span>
                        <span class="stat-value ${this.getHPColorClass(character.hp, character.maxHp)}">${character.hp} / ${character.maxHp}</span>
                        <span class="stat-formula">(Current / Max)</span>
                    </div>
                    <div class="stat-display">
                        <span class="stat-name">Current Stamina</span>
                        <span class="stat-value">${character.stamina} / ${character.maxStamina}</span>
                        <span class="stat-formula">(Current / Max)</span>
                    </div>
                    <div class="stat-display">
                        <span class="stat-name">Total Physical AC</span>
                        <span class="stat-value">${derivedStats.totalPhysicalDefence}</span>
                        <span class="stat-formula">(${this.buildACFormulaDisplay(character, 'physicalDefence', derivedStats.speedACBonus)})</span>
                    </div>
                    <div class="stat-display">
                        <span class="stat-name">Total Magical AC</span>
                        <span class="stat-value">${derivedStats.totalMagicalDefence}</span>
                        <span class="stat-formula">(${this.buildACFormulaDisplay(character, 'magicalDefence', derivedStats.speedACBonus)})</span>
                    </div>
                    <div class="stat-display">
                        <span class="stat-name">Movement Speed</span>
                        <span class="stat-value">${this.getTotalMovementSpeed(character)}ft</span>
                        <span class="stat-formula">(${this.getMovementSpeedFormula(character)})</span>
                    </div>
                </div>
            </div>
            
            <div class="mass-refund-section">
                <h3>${iconMapper.createIconElement('ui', 'mass_refund', 16)} Mass Refund Options</h3>
                <div class="mass-refund-buttons">
                    <button class="btn btn-danger mass-refund-stats-btn">${iconMapper.createIconElement('ui', 'mass_refund', 12)} Refund All Stats (75%)</button>
                    <p class="refund-note">This will refund all stat upgrades at 75% value and reset stats to starting values</p>
                </div>
            </div>
        `
    }

    // Render individual stat upgrade section
    renderStatUpgrade(statName, currentValue, lumens, displayName = null) {
        // Handle undefined currentValue
        if (currentValue === undefined || currentValue === null) {
            console.warn(`Stat ${statName} is undefined, defaulting to 0`)
            currentValue = 0
        }

        const cost = gameLogic.getStatUpgradeCost(currentValue, statName)
        const canAfford = lumens >= cost
        const upgrade = gameLogic.canUpgradeStat({ stats: { [statName]: currentValue }, lumens }, statName)

        const name = displayName || this.capitalizeFirst(statName)

        return `
            <div class="stat-upgrade">
                <h4>${name}</h4>
                <div class="stat-current">${currentValue}</div>
                <div class="stat-buttons">
                    <button class="btn stat-upgrade-btn ${canAfford && !upgrade.atMaxLevel ? '' : 'disabled'}" 
                            data-stat="${statName}" ${canAfford && !upgrade.atMaxLevel ? '' : 'disabled'}>
                        ${upgrade.atMaxLevel ? `MAX` : `Upgrade for ${cost}L`}
                    </button>
                    ${currentValue > this.getMinStatValue(statName) ?
                `<button class="btn btn-small btn-danger stat-refund-btn" data-stat="${statName}">Refund</button>` : ''}
                </div>
                <div class="stat-preview">Next: ${upgrade.atMaxLevel ? 'MAX' : currentValue + 1}</div>
            </div>
        `
    }

    // Render character sheet
    renderCharacterSheet() {
        const container = document.getElementById('character-sheet-content')
        if (!container) return

        const character = characterManager.getCurrentCharacter()
        if (!character) {
            container.innerHTML = '<p class="no-character">Please select a character to view character sheet</p>'
            return
        }

        // Run migration for Guardian Shield type change
        this.migrateGuardianShield(character)

        const summary = characterManager.getCharacterSummary(character)
        const allUnlockedSkills = characterManager.getAllUnlockedSkillIds(character)

        // Calculate effective stats including skill bonuses for derived stats
        const effectiveStats = { ...character.stats }
        if (window.skillBonusSystem) {
            const skillBonuses = window.skillBonusSystem.getAllBonuses(character)
            for (const [stat, bonus] of Object.entries(skillBonuses)) {
                if (effectiveStats.hasOwnProperty(stat)) {
                    effectiveStats[stat] = (effectiveStats[stat] || 0) + bonus
                }
            }
        }
        const derivedStats = gameLogic.calculateDerivedStats(effectiveStats)

        container.innerHTML = `
            <div class="character-overview">
                <div class="character-header">
                    <h2>${character.name}</h2>
                    <div class="character-header-buttons">
                        <button id="show-item-admin-btn" class="btn btn-tertiary">
                            <span class="btn-icon" data-icon-category="ui" data-icon-name="create"></span> Item Admin
                        </button>
                        ${this.devMode && character.race && !character.isMonster ? `
                        <button class="btn btn-danger remove-race-btn" title="Dev Mode: Remove Race">
                            ${iconMapper.createIconElement('ui', 'delete', 16)} Remove Race
                        </button>
                        ` : ''}
                        ${character.isMonster ? `
                        <button id="show-monster-presets-btn" class="btn btn-secondary">
                            ${iconMapper.createIconElement('ui', 'monster', 16)} Monster Presets
                        </button>
                        ` : ''}
                    </div>
                </div>
                
                ${(!character.isMonster || character.race === 'monster') ? this.renderRaceSelection(character) : ''}
                
                ${character.isMonster ? `
                <!-- Monster Presets Section -->
                <div class="monster-presets-section" style="margin-bottom: 20px;">
                    <div class="presets-controls">
                        <div class="preset-dropdown-container">
                            <label for="monster-preset-select">Quick Load Monster:</label>
                            <select id="monster-preset-select" class="preset-select">
                                <option value="">-- Select a Monster Preset --</option>
                                ${this.renderMonsterPresetOptions()}
                            </select>
                            <button id="apply-preset-btn" class="btn btn-primary" disabled>
                                ${iconMapper.createIconElement('ui', 'load', 16)} Apply Preset
                            </button>
                        </div>
                        <div class="preset-save-container">
                            <button id="save-preset-btn" class="btn btn-success">
                                ${iconMapper.createIconElement('ui', 'save', 16)} Save as Preset
                            </button>
                            <span class="preset-save-note">Save current monster configuration</span>
                        </div>
                    </div>
                </div>
                ` : ''}
                <div class="character-summary">
                    <div class="summary-item">
                        <span class="label">Level:</span>
                        <span class="value">${summary.level}</span>
                    </div>
                    <div class="summary-item">
                        <span class="label">Total Points:</span>
                        <span class="value">${summary.totalPoints}</span>
                    </div>
                    <div class="summary-item">
                        <span class="label">Skills (${summary.totalSkills}):</span>
                        <span class="value">${summary.tierPoints} pts</span>
                    </div>
                    <div class="summary-item">
                        <span class="label">Stat Upgrades:</span>
                        <span class="value">${summary.statPoints} pts</span>
                    </div>
                    <div class="summary-item">
                        <span class="label">Lumens:</span>
                        <span class="value">${character.lumens}</span>
                    </div>
                    <div class="summary-item">
                        <span class="label">Current Investment:</span>
                        <span class="value">${summary.totalSpent}L</span>
                    </div>
                    ${character.isMonster ? `
                    <div class="summary-item monster-drop">
                        <span class="label">Lumen Drop (if defeated):</span>
                        <span class="value">${this.calculateMonsterLumenDrop(summary.totalSpent)}L</span>
                    </div>
                    ` : ''}
                </div>
            </div>

            <!-- Three Column Layout for Main Content -->
            <div class="character-main-content">
                <div class="character-stats-column">
                    <h3>Statistics</h3>
                    <div class="stats-display">
                        <div class="stat-item">
                            <span class="stat-name">HP</span>
                            <span class="stat-value">${this.getEffectiveStatDisplay(character, 'hp')}</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-name">Stamina</span>
                            <span class="stat-value">${this.getEffectiveStatDisplay(character, 'stamina')}</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-name">Strength</span>
                            <span class="stat-value">${this.getEffectiveStatDisplay(character, 'strength')}</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-name">Magic Power</span>
                            <span class="stat-value">${this.getEffectiveStatDisplay(character, 'magicPower')}</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-name">Accuracy</span>
                            <span class="stat-value">${this.getEffectiveStatDisplay(character, 'accuracy')}</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-name">Speed</span>
                            <span class="stat-value">${this.getEffectiveStatDisplay(character, 'speed')}</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-name">Movement Speed</span>
                            <span class="stat-value">${this.getTotalMovementSpeed(character)}ft</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-name">Physical Defence</span>
                            <span class="stat-value">${this.getDefenceStatDisplay(character, 'physicalDefence', derivedStats.speedACBonus)}</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-name">Magical Defence</span>
                            <span class="stat-value">${this.getDefenceStatDisplay(character, 'magicalDefence', derivedStats.speedACBonus)}</span>
                        </div>
                    </div>
                    
                    ${this.renderElementalResistances(character)}
                </div>

                <div class="unlocked-skills-column">
                    <h3>Unlocked Skills</h3>
                    <p class="skills-note">Only the highest tier of each skill chain is shown (e.g., Metal Skin instead of Tough Skin + Rock Skin)</p>
                    
                    <!-- Search & Filter Controls -->
                    <div class="skills-controls">
                        <div class="search-container">
                            <input type="text" 
                                   id="skills-search" 
                                   class="skills-search-input" 
                                   placeholder="?? Search skills..." 
                                   autocomplete="off">
                        </div>
                        <div class="filter-container">
                            <select id="skills-category-filter" class="skills-filter">
                                <option value="all">All Categories</option>
                                <option value="weapons">Weapon Skills</option>
                                <option value="magic">Magic Skills</option>
                                <option value="professions">Professions</option>
                                <option value="monster">Monster Skills</option>
                                <option value="fusion">Fusion Skills</option>
                            </select>
                            <select id="skills-tier-filter" class="skills-filter">
                                <option value="all">All Tiers</option>
                                <option value="1">Tier 1</option>
                                <option value="2">Tier 2</option>
                                <option value="3">Tier 3</option>
                                <option value="4">Tier 4</option>
                                <option value="5">Tier 5</option>
                            </select>
                            <select id="skills-type-filter" class="skills-filter">
                                <option value="all">All Types</option>
                                <option value="toggle">Toggle Skills</option>
                                <option value="passive">Passive Skills</option>
                            </select>
                        </div>
                        <div class="sort-container">
                            <select id="skills-sort" class="skills-sort">
                                <option value="category">Sort by Category</option>
                                <option value="name">Sort by Name</option>
                                <option value="tier">Sort by Tier</option>
                            </select>
                        </div>
                    </div>
                    
                    <div class="skills-content" id="skills-content">
                        ${this.renderUnlockedSkillsList(character)}
                    </div>
                </div>

                <div class="testing-column">
                    <h3>${iconMapper.createIconElement('ui', 'combat_testing', 16)} Combat Testing & Status Effects</h3>
                    <p class="testing-note">Adjust current values for combat scenario testing and manage status effects</p>
                    
                    <div class="testing-grid">
                        <!-- HP/Stamina Controls -->
                        <div class="hp-stamina-controls">
                            <div class="hp-control">
                                <label>Current HP:</label>
                                <button class="btn btn-small hp-decrease-btn" data-action="decrease" data-type="hp">-</button>
                                <span class="current-value ${this.getHPColorClass(character.hp, character.maxHp)}" id="current-hp">${character.hp}</span>
                                <button class="btn btn-small hp-increase-btn" data-action="increase" data-type="hp">+</button>
                                <span class="max-display">/ ${character.maxHp}</span>
                            </div>
                            
                            <div class="stamina-control">
                                <label>Current Stamina:</label>
                                <button class="btn btn-small stamina-decrease-btn" data-action="decrease" data-type="stamina">-</button>
                                <span class="current-value" id="current-stamina">${character.stamina}</span>
                                <button class="btn btn-small stamina-increase-btn" data-action="increase" data-type="stamina">+</button>
                                <span class="max-display">/ ${character.maxStamina}</span>
                            </div>
                        </div>

                        <!-- Status Effects Testing -->
                        <div class="status-effects-controls">
                            <div class="status-buttons">
                                <h4>Status Effects:</h4>
                                
                                <!-- Damage Over Time Effects -->
                                <div class="status-category">
                                    <h5>${iconMapper.createIconElement('statusEffects', 'burn', 16)} Damage Over Time</h5>
                                    <div class="status-button-row">
                                        <button class="btn btn-small status-btn ${character.statusEffects?.some(e => e.id === 'burn') ? 'active' : ''} ${this.isStatusEffectDisabled(character, 'burn') ? 'disabled' : ''}" data-effect="burn">${iconMapper.createIconElement('statusEffects', 'burn', 16)} Burn</button>
                                        <button class="btn btn-small status-btn ${character.statusEffects?.some(e => e.id === 'poison') ? 'active' : ''} ${this.isStatusEffectDisabled(character, 'poison') ? 'disabled' : ''}" data-effect="poison">${iconMapper.createIconElement('statusEffects', 'poison', 16)} Poison</button>
                                        <button class="btn btn-small status-btn ${character.statusEffects?.some(e => e.id === 'bleed') ? 'active' : ''} ${this.isStatusEffectDisabled(character, 'bleed') ? 'disabled' : ''}" data-effect="bleed">${iconMapper.createIconElement('statusEffects', 'bleed', 16)} Bleed</button>
                                        <button class="btn btn-small status-btn ${character.statusEffects?.some(e => e.id === 'acid_corrosion') ? 'active' : ''} ${this.isStatusEffectDisabled(character, 'acid_corrosion') ? 'disabled' : ''}" data-effect="acid_corrosion">${iconMapper.createIconElement('statusEffects', 'acid_corrosion', 16)} Acid</button>
                                    </div>
                                </div>

                                <!-- Control Effects -->
                                <div class="status-category">
                                    <h5>${iconMapper.createIconElement('statusEffects', 'paralyzed', 16)} Control Effects</h5>
                                    <div class="status-button-row">
                                        <button class="btn btn-small status-btn ${character.statusEffects?.some(e => e.id === 'incapacitated') ? 'active' : ''} ${this.isStatusEffectDisabled(character, 'incapacitated') ? 'disabled' : ''}" data-effect="incapacitated">${iconMapper.createIconElement('statusEffects', 'incapacitated', 16)} Incapacitated</button>
                                        <button class="btn btn-small status-btn ${character.statusEffects?.some(e => e.id === 'immobilized') ? 'active' : ''} ${this.isStatusEffectDisabled(character, 'immobilized') ? 'disabled' : ''}" data-effect="immobilized">${iconMapper.createIconElement('statusEffects', 'immobilized', 16)} Immobilized</button>
                                        <button class="btn btn-small status-btn ${character.statusEffects?.some(e => e.id === 'mind_controlled') ? 'active' : ''} ${this.isStatusEffectDisabled(character, 'mind_controlled') ? 'disabled' : ''}" data-effect="mind_controlled">${iconMapper.createIconElement('statusEffects', 'mind_controlled', 16)} Mind Control</button>
                                    </div>
                                </div>

                                <!-- Debuffs -->
                                <div class="status-category">
                                    <h5>${iconMapper.createIconElement('statusEffects', 'cursed', 16)} Debuffs</h5>
                                    <div class="status-button-row">
                                        <button class="btn btn-small status-btn ${character.statusEffects?.some(e => e.id === 'weakened') ? 'active' : ''} ${this.isStatusEffectDisabled(character, 'weakened') ? 'disabled' : ''}" data-effect="weakened">${iconMapper.createIconElement('statusEffects', 'weakened', 16)} Weakened</button>
                                        <button class="btn btn-small status-btn ${character.statusEffects?.some(e => e.id === 'cursed') ? 'active' : ''} ${this.isStatusEffectDisabled(character, 'cursed') ? 'disabled' : ''}" data-effect="cursed">${iconMapper.createIconElement('statusEffects', 'cursed', 16)} Cursed</button>
                                    </div>
                                </div>

                                <!-- Beneficial Effects -->
                                <div class="status-category">
                                    <h5>${iconMapper.createIconElement('statusEffects', 'enhanced', 16)} Buffs</h5>
                                    <div class="status-button-row">
                                        <button class="btn btn-small status-btn ${character.statusEffects?.some(e => e.id === 'regeneration') ? 'active' : ''} ${this.isStatusEffectDisabled(character, 'regeneration') ? 'disabled' : ''}" data-effect="regeneration">${iconMapper.createIconElement('statusEffects', 'regeneration', 16)} Regeneration</button>
                                        <button class="btn btn-small status-btn ${character.statusEffects?.some(e => e.id === 'enhanced') ? 'active' : ''} ${this.isStatusEffectDisabled(character, 'enhanced') ? 'disabled' : ''}" data-effect="enhanced">${iconMapper.createIconElement('statusEffects', 'enhanced', 16)} Enhanced</button>
                                        <button class="btn btn-small status-btn ${character.statusEffects?.some(e => e.id === 'empowered') ? 'active' : ''} ${this.isStatusEffectDisabled(character, 'empowered') ? 'disabled' : ''}" data-effect="empowered">${iconMapper.createIconElement('statusEffects', 'empowered', 16)} Empowered</button>
                                        <button class="btn btn-small status-btn ${character.statusEffects?.some(e => e.id === 'weapon_enchanted') ? 'active' : ''} ${this.isStatusEffectDisabled(character, 'weapon_enchanted') ? 'disabled' : ''}" data-effect="weapon_enchanted">${iconMapper.createIconElement('statusEffects', 'weapon_enchanted', 16)} Enchanted Weapon</button>
                                    </div>
                                </div>

                                <!-- Protection Effects -->
                                <div class="status-category">
                                    <h5>${iconMapper.createIconElement('statusEffects', 'protected', 16)} Protection</h5>
                                    <div class="status-button-row">
                                        <button class="btn btn-small status-btn ${character.statusEffects?.some(e => e.id === 'protected') ? 'active' : ''} ${this.isStatusEffectDisabled(character, 'protected') ? 'disabled' : ''}" data-effect="protected">${iconMapper.createIconElement('statusEffects', 'protected', 16)} Protected</button>
                                        <button class="btn btn-small status-btn ${character.statusEffects?.some(e => e.id === 'spell_warded') ? 'active' : ''} ${this.isStatusEffectDisabled(character, 'spell_warded') ? 'disabled' : ''}" data-effect="spell_warded">${iconMapper.createIconElement('statusEffects', 'spell_warded', 16)} Spell Warded</button>
                                    </div>
                                </div>

                                <!-- Special Effects -->
                                <div class="status-category">
                                    <h5>${iconMapper.createIconElement('statusEffects', 'enhanced_mobility', 16)} Special</h5>
                                    <div class="status-button-row">
                                        <button class="btn btn-small status-btn ${character.statusEffects?.some(e => e.id === 'enhanced_mobility') ? 'active' : ''} ${this.isStatusEffectDisabled(character, 'enhanced_mobility') ? 'disabled' : ''}" data-effect="enhanced_mobility">${iconMapper.createIconElement('statusEffects', 'enhanced_mobility', 16)} Enhanced Mobility</button>
                                        <button class="btn btn-small status-btn ${character.statusEffects?.some(e => e.id === 'stealth_mastery') ? 'active' : ''} ${this.isStatusEffectDisabled(character, 'stealth_mastery') ? 'disabled' : ''}" data-effect="stealth_mastery">${iconMapper.createIconElement('statusEffects', 'stealth_mastery', 16)} Stealth Mastery</button>
                                    </div>
                                </div>

                                <!-- Aura Effects -->
                                <div class="status-category">
                                    <h5>Auras</h5>
                                    <div class="status-button-row">
                                        <button class="btn btn-small status-btn ${character.statusEffects?.some(e => e.id === 'intimidating_aura') ? 'active' : ''} ${this.isStatusEffectDisabled(character, 'intimidating_aura') ? 'disabled' : ''}" data-effect="intimidating_aura">Intimidating</button>
                                        <button class="btn btn-small status-btn ${character.statusEffects?.some(e => e.id === 'toxic_presence') ? 'active' : ''} ${this.isStatusEffectDisabled(character, 'toxic_presence') ? 'disabled' : ''}" data-effect="toxic_presence">Toxic Presence</button>
                                    </div>
                                </div>

                                <div class="status-actions">
                                    <button id="process-effects-btn" class="btn btn-primary" data-render-time="${Date.now()}">${iconMapper.createIconElement('ui', 'process_turn', 12)} Process Turn</button>
                                    <button id="clear-all-effects-btn" class="btn btn-danger">${iconMapper.createIconElement('ui', 'clear_effects', 12)} Clear All</button>
                                </div>
                            </div>
                            
                            <div class="active-status-effects">
                                <h4>Active Effects:</h4>
                                <div class="status-effects">
                                    ${this.renderStatusEffects(character)}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Equipment & Inventory Section (Full Width Below) -->
            <div class="equipment-inventory-section">
                <h3>Equipment & Inventory</h3>
                <div id="inventory-container" class="inventory-container">
                    <!-- Inventory content will be rendered by renderInventory() -->
                </div>
            </div>
        `

        // Render inventory after setting the main HTML
        this.renderInventory(character)

        // Add event listener for Item Admin button
        document.getElementById('show-item-admin-btn')?.addEventListener('click', () => {
            this.showItemAdminSidebar()
        })

        // Add event listener for Remove Race button (dev mode)
        document.querySelector('.remove-race-btn')?.addEventListener('click', () => {
            this.removeCharacterRace()
        })

        // Add event listeners for Monster Presets
        this.setupMonsterPresetEventListeners()

        // Initialize skill tooltips
        this.initializeSkillTooltips()

        // Initialize race tooltips
        this.initializeRaceTooltips()

        // Initialize skills search and filter functionality
        setTimeout(() => this.initializeSkillsFilter(), 100)
    }

    // Render race selection section for character sheet
    renderRaceSelection(character) {
        if (character.isMonster) return ''

        const hasRace = character.race !== null

        if (hasRace) {
            // Display current race with passive traits
            const raceData = window.RACES_DATA?.[character.race]
            if (!raceData) return ''

            return `
                <div class="race-selection-section" style="margin-bottom: 20px;">
                    <div class="race-header">
                        <h3>${raceData.icon} ${raceData.name}</h3>
                        <div class="race-description">${raceData.description}</div>
                    </div>
                    <div class="race-traits">
                        <h4>Racial Passive Traits:</h4>
                        <ul class="trait-list">
                            ${character.racialPassiveTraits && character.racialPassiveTraits.length > 0
                    ? character.racialPassiveTraits.map(trait => `<li>${trait}</li>`).join('')
                    : raceData.passiveTraits.map(trait => `<li>${trait}</li>`).join('')
                }
                        </ul>
                    </div>
                    ${raceData.statModifiers && Object.keys(raceData.statModifiers).length > 0 ? `
                    <div class="race-stat-bonuses">
                        <h4>Stat Bonuses:</h4>
                        <div class="stat-bonus-list">
                            ${Object.entries(raceData.statModifiers).map(([stat, bonus]) =>
                    `<span class="stat-bonus">+${bonus} ${this.formatStatName(stat)}</span>`
                ).join('')}
                        </div>
                    </div>
                    ` : ''}
                </div>
            `
        } else {
            // Show race selection interface
            if (!window.RACES_DATA) {
                return '<div class="race-error">Race data not available</div>'
            }

            const races = Object.values(window.RACES_DATA)

            return `
                <div class="race-selection-section" style="margin-bottom: 20px;">
                    <div class="race-selection-header">
                        <h3>?? Choose Your Race</h3>
                        <p class="race-selection-note">This choice is permanent and will affect your character's abilities and available skills.</p>
                    </div>
                    <div class="race-grid">
                        ${races.map(race => `
                            <div class="race-card compact" 
                                 data-race-id="${race.id}"
                                 data-race-name="${race.name}"
                                 data-race-icon="${race.icon}"
                                 data-race-description="${race.description}"
                                 data-race-traits="${race.passiveTraits.join(' | ')}"
                                 data-race-bonuses="${race.statModifiers ? Object.entries(race.statModifiers).map(([stat, bonus]) => `+${bonus} ${this.formatStatName(stat)}`).join(', ') : 'None'}">
                                <div class="race-card-content">
                                    <div class="race-card-header">
                                        <span class="race-icon">${race.icon}</span>
                                        <span class="race-name">${race.name}</span>
                                    </div>
                                    <div class="race-card-info">
                                        <p class="race-description-short">${race.description.split('.')[0]}.</p>
                                        ${race.statModifiers && Object.keys(race.statModifiers).length > 0 ? `
                                        <div class="race-bonuses-preview">
                                            ${Object.entries(race.statModifiers).map(([stat, bonus]) =>
                `<span class="bonus-tag">+${bonus} ${this.formatStatName(stat)}</span>`
            ).join(' ')}
                                        </div>
                                        ` : ''}
                                    </div>
                                </div>
                                <div class="race-card-footer">
                                    <button class="btn btn-primary select-race-btn" data-race-id="${race.id}">
                                        Choose ${race.name}
                                    </button>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `
        }
    }

    // Helper method to format stat names for display
    formatStatName(stat) {
        const statNames = {
            hp: 'HP',
            stamina: 'Stamina',
            strength: 'Strength',
            magicPower: 'Magic Power',
            accuracy: 'Accuracy',
            speed: 'Speed',
            physicalDefence: 'Physical Defense',
            magicalDefence: 'Magical Defense'
        }
        return statNames[stat] || stat
    }

    // Render monster preset dropdown options
    renderMonsterPresetOptions() {
        if (!window.monsterPresets) {
            return '<option value="">Monster presets not available</option>'
        }

        const presets = window.monsterPresets.getAllPresets()

        // Calculate level for each preset and sort by level
        const presetsWithLevels = presets.map(preset => {
            const level = this.calculatePresetLevel(preset)
            return { ...preset, calculatedLevel: level }
        })

        // Sort by level (ascending), then by name for ties
        presetsWithLevels.sort((a, b) => {
            if (a.calculatedLevel !== b.calculatedLevel) {
                return a.calculatedLevel - b.calculatedLevel
            }
            return a.name.localeCompare(b.name)
        })

        return presetsWithLevels.map(preset => {
            const typeLabel = preset.builtIn ? '[Built-in]' : '[Custom]'
            return `<option value="${preset.id}">${typeLabel} ${preset.name} (Level ${preset.calculatedLevel})</option>`
        }).join('')
    }

    // Calculate the level of a monster preset based on stats and skills
    calculatePresetLevel(preset) {
        // Use the same calculation as character level
        const stats = preset.stats

        // Calculate stat points (same as character manager)
        const statPoints = this.calculateStatPointsForPreset(stats)

        // Calculate skill points (same as character manager)
        const skillPoints = this.calculateSkillPointsForPreset(preset.unlockedSkills)

        // Total points
        const totalPoints = statPoints + skillPoints

        // Use the same level calculation as character manager
        return characterManager.calculateLevel(totalPoints)
    }

    // Calculate stat points for preset (same logic as character manager)
    calculateStatPointsForPreset(stats) {
        let totalPoints = 0

        // Calculate points for each stat (same as character manager logic)
        Object.entries(stats).forEach(([statName, currentValue]) => {
            if (statName === 'accuracy') return // Skip accuracy for now

            let points = 0
            let baseValue = 10 // Base value for HP/Stamina
            let minValue = 10  // Min value for HP/Stamina

            if (statName === 'strength' || statName === 'magicPower') {
                baseValue = -3
                minValue = -3
            } else if (statName === 'speed') {
                baseValue = 2
                minValue = 2
            } else if (statName === 'physicalDefence' || statName === 'magicalDefence') {
                baseValue = 8
                minValue = 8
            }

            // Calculate points from base to current value
            if (currentValue > baseValue) {
                points = currentValue - baseValue
            } else if (currentValue < baseValue) {
                points = Math.abs(currentValue - baseValue) // Negative stats still cost points
            }

            totalPoints += points
        })

        return totalPoints
    }

    // Calculate skill points for preset (same logic as character manager)
    calculateSkillPointsForPreset(unlockedSkills) {
        let totalPoints = 0

        if (unlockedSkills) {
            Object.values(unlockedSkills).forEach(category => {
                if (typeof category === 'object') {
                    Object.values(category).forEach(skillArray => {
                        if (Array.isArray(skillArray)) {
                            totalPoints += skillArray.length * 2 // Each skill = 2 points (same as character manager)
                        }
                    })
                }
            })
        }

        return totalPoints
    }

    // Setup monster preset event listeners
    setupMonsterPresetEventListeners() {
        // Preset selection dropdown
        const presetSelect = document.getElementById('monster-preset-select')
        const applyBtn = document.getElementById('apply-preset-btn')
        const saveBtn = document.getElementById('save-preset-btn')

        if (presetSelect && applyBtn) {
            presetSelect.addEventListener('change', (e) => {
                applyBtn.disabled = !e.target.value
            })

            applyBtn.addEventListener('click', () => {
                const selectedPresetId = presetSelect.value
                if (selectedPresetId) {
                    this.applyMonsterPreset(selectedPresetId)
                }
            })
        }

        if (saveBtn) {
            saveBtn.addEventListener('click', () => {
                this.showSavePresetDialog()
            })
        }
    }

    // Apply a monster preset to the current character
    applyMonsterPreset(presetId) {
        const character = characterManager.getCurrentCharacter()
        if (!character) {
            alert('No character selected')
            return
        }

        if (!window.monsterPresets) {
            alert('Monster presets system not available')
            return
        }

        const preset = window.monsterPresets.getPresetById(presetId)
        if (!preset) {
            alert('Preset not found')
            return
        }

        // Confirm with user about the changes
        const confirmMsg = `Apply preset "${preset.name}"?\n\n` +
            `This will:\n` +
            `� Reset all current skills and stats\n` +
            `� Apply the preset configuration\n` +
            `� Refund your current investment (${characterManager.calculateCurrentInvestmentValue(character)} lumens)\n` +
            `� Set character as monster\n` +
            `� Keep existing currency unchanged\n\n` +
            `This action cannot be undone easily.`

        if (!confirm(confirmMsg)) {
            return
        }

        const result = window.monsterPresets.applyPresetToCharacter(presetId, character.id, characterManager)

        if (result.success) {
            // Refresh the UI
            this.updateDisplay()
            this.renderCharacterList() // Update sidebar to show new character name
            alert(`Successfully applied preset "${result.presetName}"!\n\nRefunded ${result.refundAmount} lumens from previous skills.`)
        } else {
            alert(`Failed to apply preset: ${result.error}`)
        }
    }

    // Show dialog to save current character as preset
    showSavePresetDialog() {
        const character = characterManager.getCurrentCharacter()
        if (!character || !character.isMonster) {
            alert('Only monster characters can be saved as presets')
            return
        }

        if (!window.monsterPresets) {
            alert('Monster presets system not available')
            return
        }

        const name = prompt('Enter a name for this monster preset:', `${character.name} Preset`)
        if (!name) return

        const description = prompt('Enter a description (optional):', `Based on ${character.name}`)

        try {
            const savedPreset = window.monsterPresets.saveCustomPreset(name, description || '', character)
            alert(`Successfully saved preset "${savedPreset.name}"!`)

            // Refresh the preset dropdown
            const presetSelect = document.getElementById('monster-preset-select')
            if (presetSelect) {
                presetSelect.innerHTML = `
                    <option value="">-- Select a Monster Preset --</option>
                    ${this.renderMonsterPresetOptions()}
                `
            }
        } catch (error) {
            alert(`Failed to save preset: ${error.message}`)
        }
    }

    // Render shop page
    renderShop() {
        const container = document.getElementById('shop-content')
        if (!container) return

        const character = characterManager.getCurrentCharacter()
        if (!character) {
            container.innerHTML = '<p class="no-character">Please select a character to access the shop</p>'
            return
        }

        const gil = characterManager.getGil(character)

        container.innerHTML = `
            <div class="shop-container">
                <div class="shop-header">
                    <h2>Adventurer's Shop</h2>
                    <div class="currency-management">
                        <span class="currency-label">Your Money:</span>
                        <div class="currency-controls">
                            <div class="currency-item">
                                <button class="currency-btn decrease" data-currency="gil">-</button>
                                <span class="currency-value">${gil} Gil</span>
                                <button class="currency-btn increase" data-currency="gil">+</button>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="shop-tabs-container">
                    ${this.renderUniversalShop()}
                </div>
            </div>
        `

        // Set up hold-to-repeat for currency buttons after rendering
        setTimeout(() => {
            this.setupCurrencyButtonAcceleration()
            this.initializeShopTooltips() // Initialize shop tooltips
        }, 0)
    }

    // Setup acceleration for all currency buttons in the shop
    setupCurrencyButtonAcceleration() {
        // Clean up any existing buttons first
        const oldButtons = document.querySelectorAll('.currency-btn[data-setup="true"]')
        oldButtons.forEach(button => {
            if (button._cleanup) {
                button._cleanup()
            }
        })

        const currencyButtons = document.querySelectorAll('.currency-btn')
        currencyButtons.forEach(button => {
            // Skip if already set up
            if (button.dataset.setup === "true") {
                return
            }

            // Clean up any existing listeners on this specific button
            if (button._currencyCleanup) {
                button._currencyCleanup()
            }

            const currency = button.dataset.currency
            const isIncrease = button.classList.contains('increase')
            this.setupCurrencyHoldToRepeat(button, currency, isIncrease)
            button.dataset.setup = "true"
        })
    }

    // Render the currently selected shop category
    renderShopCategory() {
        if (this.selectedShopCategory === 'weapons') {
            return this.renderWeaponSubcategories()
        } else if (this.selectedShopCategory === 'armor') {
            return this.renderArmorSubcategories()
        } else if (this.selectedShopCategory === 'accessories') {
            return this.renderAccessorySubcategories()
        } else if (this.selectedShopCategory === 'consumables') {
            return this.renderConsumableSubcategories()
        }
        return ''
    }

    // Render armor subcategories/sections - DYNAMIC VERSION
    renderArmorSubcategories() {
        const armorCategories = this.getArmorCategoriesFromData()

        return `
            <div class="armor-container">
                ${Object.entries(armorCategories).map(([key, cat]) => `
                    <div class="armor-subcategory shop-section-box">
                        <h4 class="armor-subcategory-title">${cat.title}</h4>
                        <div class="armor-scroll-container">
                            <div class="shop-items">
                                ${this.renderShopItemsByCategory(cat.items)}
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `
    }

    // Automatically generate armor categories from ITEMS_DATA
    getArmorCategoriesFromData() {
        if (!window.ITEMS_DATA || !window.ITEMS_DATA.armor) {
            console.warn('ITEMS_DATA.armor not found, using fallback categories')
            return this.getFallbackArmorCategories()
        }

        const categories = {
            light: { title: '🧥 Light Armor', items: [] },
            medium: { title: '🦾 Medium Armor', items: [] },
            heavy: { title: '🛡️ Heavy Armor', items: [] },
            robes: { title: '🧙‍♂️ Robes & Magical Armor', items: [] }
        }

        // Sort armor by price and rarity
        const armors = Object.values(window.ITEMS_DATA.armor)
        const sortedArmors = armors.sort((a, b) => {
            const priceA = typeof a.price === 'number' ? a.price : 0
            const priceB = typeof b.price === 'number' ? b.price : 0
            if (priceA !== priceB) return priceA - priceB

            const rarityOrder = { common: 1, uncommon: 2, rare: 3, legendary: 4 }
            return (rarityOrder[a.rarity] || 1) - (rarityOrder[b.rarity] || 1)
        })

        // Categorize armor based on name patterns and stats
        sortedArmors.forEach(armor => {
            const name = armor.name.toLowerCase()
            const id = armor.id
            const stats = armor.statModifiers || {}

            if (name.includes('robe') || name.includes('vestment') || name.includes('garb')) {
                categories.robes.items.push(id)
            } else if (name.includes('plate') || name.includes('aegis') || name.includes('fortress') || name.includes('cosmic') || name.includes('avatar') || armor.rarity === 'legendary') {
                categories.heavy.items.push(id)
            } else if (name.includes('mail') || name.includes('harness') || name.includes('knight') || name.includes('guard') || stats.physicalDefence >= 3) {
                categories.medium.items.push(id)
            } else {
                // Default to light armor (leather, cloth, etc.)
                categories.light.items.push(id)
            }
        })

        // Remove empty categories
        Object.keys(categories).forEach(key => {
            if (categories[key].items.length === 0) {
                delete categories[key]
            }
        })

        return categories
    }

    // Fallback armor categories for compatibility
    getFallbackArmorCategories() {
        return {
            light: {
                title: '🧥 Light Armor',
                items: ['cloth_robes', 'leather_armor', 'studded_leather', 'chain_mail', 'scale_mail']
            },
            medium: {
                title: '🦾 Medium Armor',
                items: ['plate_mail', 'knight_armor']
            },
            heavy: {
                title: '🐲 Heavy/Legendary Armor',
                items: ['dragon_scale_armor', 'void_armor']
            },
            robes: {
                title: '🧙‍♂️ Robes & Magical Armor',
                items: ['mage_robes', 'fire_robes', 'ice_armor', 'shadow_cloak', 'celestial_robes']
            }
        }
    }

    // Render accessory subcategories/sections
    renderAccessorySubcategories() {
        // Get dynamic accessory categories from items data
        const accessoryCategories = this.getAccessoryCategoriesFromData()

        return `
            <div class="accessory-container">
                ${Object.entries(accessoryCategories).map(([key, cat]) => `
                    <div class="accessory-subcategory shop-section-box">
                        <h4 class="accessory-subcategory-title">${cat.title}</h4>
                        <div class="accessory-scroll-container">
                            <div class="shop-items">
                                ${this.renderShopItemsByCategory(cat.items)}
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `
    }

    // Get accessory categories dynamically from items data
    getAccessoryCategoriesFromData() {
        if (!window.ITEMS_DATA || !window.ITEMS_DATA.accessories) {
            return {}
        }

        const accessories = window.ITEMS_DATA.accessories
        const categories = {}

        // Categorize accessories by name patterns
        Object.entries(accessories).forEach(([id, item]) => {
            const name = item.name.toLowerCase()

            if (name.includes('ring') || name.includes('band')) {
                if (!categories.rings) {
                    categories.rings = { title: '💍 Rings', items: [] }
                }
                categories.rings.items.push(id)
            }
            else if (name.includes('boot') || name.includes('shoe') || name.includes('sandal')) {
                if (!categories.boots) {
                    categories.boots = { title: '🥾 Boots & Footwear', items: [] }
                }
                categories.boots.items.push(id)
            }
            else if (name.includes('amulet') || name.includes('necklace') || name.includes('pendant') || name.includes('chain')) {
                if (!categories.amulets) {
                    categories.amulets = { title: '🧿 Amulets & Necklaces', items: [] }
                }
                categories.amulets.items.push(id)
            }
            else if (name.includes('cloak') || name.includes('cape') || name.includes('mantle')) {
                if (!categories.cloaks) {
                    categories.cloaks = { title: '🧥 Cloaks & Capes', items: [] }
                }
                categories.cloaks.items.push(id)
            }
            else {
                // Miscellaneous accessories
                if (!categories.misc) {
                    categories.misc = { title: '🎲 Miscellaneous', items: [] }
                }
                categories.misc.items.push(id)
            }
        })

        return categories
    }

    // Render consumable subcategories/sections
    renderConsumableSubcategories() {
        // Get dynamic consumable categories from items data
        const consumableCategories = this.getConsumableCategoriesFromData()

        return `
            <div class="consumable-container">
                ${Object.entries(consumableCategories).map(([key, cat]) => `
                    <div class="consumable-subcategory shop-section-box">
                        <h4 class="consumable-subcategory-title">${cat.title}</h4>
                        <div class="consumable-scroll-container">
                            <div class="shop-items">
                                ${this.renderShopItemsByCategory(cat.items)}
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `
    }

    // Get consumable categories dynamically from items data
    getConsumableCategoriesFromData() {
        const categories = {}

        // Check for actual consumables in different sections
        if (window.ITEMS_DATA) {
            // Check all sections for consumable items
            Object.values(window.ITEMS_DATA).forEach(section => {
                Object.entries(section).forEach(([id, item]) => {
                    const name = item.name.toLowerCase()
                    const type = item.type

                    // Only include actual consumables, not crafting materials
                    if (name.includes('potion') || name.includes('elixir')) {
                        if (!categories.potions) {
                            categories.potions = { title: '🧪 Potions & Elixirs', items: [] }
                        }
                        categories.potions.items.push(id)
                    }
                    else if (name.includes('food') || name.includes('bread') || name.includes('meat') || name.includes('apple') || name.includes('wine') || name.includes('cheese') || name.includes('ration')) {
                        if (!categories.food) {
                            categories.food = { title: '🍎 Food & Drink', items: [] }
                        }
                        categories.food.items.push(id)
                    }
                    else if (name.includes('scroll')) {
                        if (!categories.scrolls) {
                            categories.scrolls = { title: '📜 Scrolls', items: [] }
                        }
                        categories.scrolls.items.push(id)
                    }
                    // Skip crafting materials (wood, iron ore, leather, crystal, etc.)
                    // These should go in their own Materials shop tab eventually
                })
            })
        }

        // If no consumables found, show a message
        if (Object.keys(categories).length === 0) {
            categories.empty = {
                title: '📦 Coming Soon',
                items: []
            }
        }

        return categories
    }

    // Render weapon subcategories - DYNAMIC VERSION
    renderWeaponSubcategories() {
        // Get all weapons from ITEMS_DATA and categorize them automatically
        const weaponCategories = this.getWeaponCategoriesFromData()

        return `
            <div class="weapons-container">
                ${Object.entries(weaponCategories).map(([categoryKey, category]) => `
                    <div class="weapon-subcategory shop-section-box">
                        <h4 class="weapon-subcategory-title">${category.title}</h4>
                        <div class="weapon-scroll-container">
                            <div class="shop-items">
                                ${this.renderShopItemsByCategory(category.items)}
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `
    }

    // Automatically generate weapon categories from ITEMS_DATA
    getWeaponCategoriesFromData() {
        if (!window.ITEMS_DATA || !window.ITEMS_DATA.weapons) {
            console.warn('ITEMS_DATA.weapons not found, using fallback categories')
            return this.getFallbackWeaponCategories()
        }

        const categories = {
            swords: { title: '🗡️ Swords & Blades', items: [] },
            daggers: { title: '🗡️ Daggers', items: [] },
            bows: { title: '🏹 Bows & Ranged', items: [] },
            hammers: { title: '🔨 Hammers & Maces', items: [] },
            axes: { title: '🪓 Axes', items: [] },
            staffs: { title: '🪄 Staffs & Staves', items: [] },
            polearms: { title: '🔱 Polearms', items: [] }
        }

        // Sort weapons by tier based on price and rarity
        const weapons = Object.values(window.ITEMS_DATA.weapons)
        const sortedWeapons = weapons.sort((a, b) => {
            // Sort by price (Gil), then by rarity
            const priceA = typeof a.price === 'number' ? a.price : 0
            const priceB = typeof b.price === 'number' ? b.price : 0
            if (priceA !== priceB) return priceA - priceB

            // Secondary sort by rarity order
            const rarityOrder = { common: 1, uncommon: 2, rare: 3, legendary: 4 }
            return (rarityOrder[a.rarity] || 1) - (rarityOrder[b.rarity] || 1)
        })

        // Categorize weapons based on name patterns
        sortedWeapons.forEach(weapon => {
            const name = weapon.name.toLowerCase()
            const id = weapon.id

            if (name.includes('sword') || name.includes('blade') || name.includes('sabre') || name.includes('cutlass')) {
                categories.swords.items.push(id)
            } else if (name.includes('dagger') || name.includes('knife') || name.includes('stiletto') || name.includes('fang') || name.includes('needle') || name.includes('edge')) {
                categories.daggers.items.push(id)
            } else if (name.includes('bow') || name.includes('crossbow') || name.includes('arrow')) {
                categories.bows.items.push(id)
            } else if (name.includes('hammer') || name.includes('mace') || name.includes('maul') || name.includes('crusher')) {
                categories.hammers.items.push(id)
            } else if (name.includes('axe') || name.includes('cleaver') || name.includes('hatchet')) {
                categories.axes.items.push(id)
            } else if (name.includes('staff') || name.includes('rod') || name.includes('wand')) {
                categories.staffs.items.push(id)
            } else if (name.includes('spear') || name.includes('lance') || name.includes('pike') || name.includes('halberd') || name.includes('glaive')) {
                categories.polearms.items.push(id)
            } else {
                // Default to swords if we can't categorize
                categories.swords.items.push(id)
            }
        })

        // Remove empty categories
        Object.keys(categories).forEach(key => {
            if (categories[key].items.length === 0) {
                delete categories[key]
            }
        })

        return categories
    }

    // Fallback weapon categories for compatibility
    getFallbackWeaponCategories() {
        return {
            swords: {
                title: '🗡️ Swords & Blades',
                items: ['bronze_sword', 'iron_sword', 'steel_sword', 'silver_sword', 'flame_blade', 'frost_sword', 'wind_blade', 'obsidian_blade', 'dragon_blade']
            },
            daggers: {
                title: '🗡️ Daggers',
                items: ['bronze_dagger', 'iron_dagger', 'silver_dagger', 'poison_dagger', 'shadow_dagger', 'assassin_blade', 'void_dagger', 'shadow_fang', 'temporal_blade']
            },
            bows: {
                title: '🏹 Bows & Ranged',
                items: ['training_bow', 'hunting_bow', 'crossbow', 'composite_bow', 'lightning_bow', 'elvish_bow', 'crystal_bow', 'storm_bow', 'celestial_bow']
            },
            hammers: {
                title: '🔨 Hammers & Maces',
                items: ['stone_hammer', 'iron_mace', 'war_hammer', 'blessed_mace', 'frost_hammer', 'earth_hammer', 'thunder_hammer', 'titan_hammer', 'void_crusher']
            },
            axes: {
                title: '🪓 Axes',
                items: ['bronze_axe', 'iron_axe', 'battle_axe', 'double_axe', 'berserker_axe', 'demon_axe', 'executioner_axe', 'chaos_axe', 'world_cleaver']
            },
            staffs: {
                title: '🪄 Staffs & Staves',
                items: ['wooden_staff', 'quarterstaff', 'mystic_staff', 'crystal_staff', 'arcane_staff', 'void_staff', 'elemental_staff', 'cosmic_staff', 'genesis_rod']
            },
            polearms: {
                title: '🔱 Polearms',
                items: ['bronze_spear', 'iron_spear', 'spear', 'halberd', 'pike', 'glaive', 'dragon_lance', 'infinity_spear', 'reality_piercer']
            }
        }
    }

    // Render list of unlocked skills by category with enhanced card design
    renderUnlockedSkillsList(character) {
        let html = ''
        let allSkills = []

        // Collect all skills from all categories
        Object.entries(character.unlockedSkills).forEach(([category, categoryData]) => {
            Object.entries(categoryData).forEach(([subcategory, skillIds]) => {
                if (skillIds.length === 0) return

                // Filter out upgraded skills
                const filteredSkillIds = this.filterUpgradedSkills(skillIds, character)
                filteredSkillIds.forEach(skillId => {
                    const skill = findSkillById(skillId)
                    if (skill) {
                        allSkills.push({
                            ...skill,
                            category,
                            subcategory,
                            isToggleSkill: skill.desc.toLowerCase().includes('toggle:'),
                            isToggled: characterManager.isSkillToggled(character.id, skillId)
                        })
                    }
                })
            })
        })

        if (allSkills.length === 0) {
            return '<div class="no-skills-message">No skills unlocked yet</div>'
        }

        // Render skills as enhanced cards
        html += '<div class="skills-card-grid">'
        allSkills.forEach(skill => {
            const tierClass = `tier-${skill.tier}`
            const categoryClass = `category-${skill.category}`
            const typeClass = skill.isToggleSkill ? 'toggle-skill' : 'passive-skill'

            html += `
                <div class="skill-card ${tierClass} ${categoryClass} ${typeClass}" 
                     data-skill-id="${skill.id}"
                     data-skill-name="${skill.name}"
                     data-skill-desc="${skill.desc}"
                     data-skill-tier="${skill.tier}"
                     data-skill-cost="${skill.cost}"
                     data-skill-stamina="${skill.staminaCost}"
                     data-skill-icon="${skill.icon}"
                     data-category="${skill.category}"
                     data-subcategory="${skill.subcategory}">
                    
                    <div class="skill-card-header">
                        <div class="skill-icon-container">
                            <span class="skill-icon">${skill.icon}</span>
                            <div class="skill-tier-badge">T${skill.tier}</div>
                        </div>
                        <div class="skill-info">
                            <h4 class="skill-name">${skill.name}</h4>
                            <div class="skill-meta">
                                <span class="skill-category-tag">${this.capitalizeFirst(skill.category)}</span>
                                <span class="skill-subcategory-tag">${this.capitalizeFirst(skill.subcategory)}</span>
                            </div>
                        </div>
                        ${skill.isToggleSkill ? `
                            <button class="toggle-button ${skill.isToggled ? 'active' : ''}" 
                                    data-skill-id="${skill.id}"
                                    title="${skill.isToggled ? 'Click to deactivate' : 'Click to activate'}">
                                ${skill.isToggled ? 'ON' : 'OFF'}
                            </button>
                        ` : ''}
                    </div>
                    
                    <div class="skill-card-body">
                        <p class="skill-description">${skill.desc}</p>
                        <div class="skill-stats">
                            <span class="skill-cost">Cost: ${skill.cost} lumens</span>
                            ${skill.staminaCost ? `<span class="skill-stamina">Stamina: ${skill.staminaCost}</span>` : ''}
                        </div>
                    </div>
                </div>
            `
        })
        html += '</div>'

        return html
    }

    // Update all displays with performance optimization
    updateDisplay() {
        // Clear any existing debounce timer
        if (this.debounceTimers.has('updateDisplay')) {
            clearTimeout(this.debounceTimers.get('updateDisplay'))
        }

        // Set a new debounce timer for performance
        const timer = setTimeout(() => {
            this._performUpdateDisplay()
        }, 16) // ~60fps debounce

        this.debounceTimers.set('updateDisplay', timer)
    }

    // Force immediate update (for critical changes)
    forceUpdateDisplay() {
        // Clear any pending debounced updates
        if (this.debounceTimers.has('updateDisplay')) {
            clearTimeout(this.debounceTimers.get('updateDisplay'))
        }

        this._performUpdateDisplay()
    }

    // Internal method to perform the actual update
    _performUpdateDisplay() {
        if (window.DEBUG_MODE) {
            console.log('[DEBUG] updateDisplay called. Current tab:', this.currentTab)
        }
        // Only remove tooltips when switching tabs or major UI changes
        // Don't remove tooltips during normal updates to preserve hover state
        if (this.lastUpdateTab !== this.currentTab) {
            this.removeTooltip()
            this.lastUpdateTab = this.currentTab
        }

        this.updateCharacterDisplay()
        this.renderSkillCategories()  // Add this to update skill categories

        if (this.currentTab === 'skills') {
            this.renderSkillTabs()
            this.renderSkillTree()
        } else if (this.currentTab === 'stats') {
            this.renderStatsTab()
        } else if (this.currentTab === 'character-sheet') {
            this.renderCharacterSheet()
        } else if (this.currentTab === 'shop') {
            this.renderShop()
        } else if (this.currentTab === 'crafting') {
            this.renderCrafting()
        } else if (this.currentTab === 'notes') {
            this.renderNotes()
        }
        // Log character after display update
        const character = characterManager.getCurrentCharacter()
        if (window.DEBUG_MODE) {
            console.log('[DEBUG] updateDisplay finished. Character state:', JSON.parse(JSON.stringify(character)))
        }
    }

    // Update character info display
    updateCharacterDisplay() {
        const character = characterManager.getCurrentCharacter()
        const lumensDisplay = document.getElementById('lumens-display')
        const nameDisplay = document.getElementById('character-name-display')
        const currencyDisplay = document.getElementById('currency-display')

        if (character) {
            if (lumensDisplay) lumensDisplay.textContent = `${character.lumens} Lumens`
            if (nameDisplay) nameDisplay.textContent = character.name
            if (currencyDisplay) {
                const gil = characterManager.getGil(character)
                currencyDisplay.textContent = characterManager.formatGil(gil)
            }
        } else {
            if (lumensDisplay) lumensDisplay.textContent = 'No Character'
            if (nameDisplay) nameDisplay.textContent = 'No Character Selected'
            if (currencyDisplay) currencyDisplay.textContent = '0 Gil'
        }
    }

    // Show temporary message
    showMessage(text, type = 'info') {
        // Create message element
        const message = document.createElement('div')
        message.className = `message message-${type}`
        message.textContent = text

        // Add to DOM
        document.body.appendChild(message)

        // Remove after 3 seconds
        setTimeout(() => {
            if (message.parentNode) {
                message.parentNode.removeChild(message)
            }
        }, 3000)
    }

    // Adjust HP/Stamina testing values
    adjustTestingValue(action, type) {
        const character = characterManager.getCurrentCharacter()
        if (!character) return

        const currentElement = document.getElementById(`current-${type}`)
        if (!currentElement) return

        let currentValue = parseInt(currentElement.textContent)
        const maxValue = type === 'hp' ? character.stats.maxHp : character.stats.maxStamina

        if (action === 'increase' && currentValue < maxValue) {
            currentValue++
        } else if (action === 'decrease' && currentValue > 0) {
            currentValue--
        }

        currentElement.textContent = currentValue

        // Update visual feedback for low values
        if (type === 'hp') {
            const percentage = (currentValue / maxValue) * 100
            currentElement.className = 'current-value'
            if (percentage <= 30) {
                currentElement.classList.add('low-hp')
            } else if (percentage <= 60) {
                currentElement.classList.add('medium-hp')
            } else {
                currentElement.classList.add('high-hp')
            }
        }
    }

    // Utility function to capitalize first letter
    capitalizeFirst(str) {
        // Handle special fusion skill category names
        const specialNames = {
            'ranged_magic': 'Ranged Magic',
            'melee_magic': 'Melee Magic',
            'utility_combat': 'Utility Combat',
            'monster_fusion': 'Monster Fusion'
        }

        if (specialNames[str]) {
            return specialNames[str]
        }

        return str.charAt(0).toUpperCase() + str.slice(1)
    }

    // Get profession icon
    getProfessionIcon(profession) {
        const icons = {
            'smithing': '🔨',
            'alchemy': '🧪',
            'enchanting': '✨',
            'tailoring': '🧵'
        }
        return icons[profession] || '⚒️'
    }

    // Get profession description
    getProfessionDescription(profession) {
        const descriptions = {
            'smithing': 'Forge weapons and armor from metal and stone materials',
            'alchemy': 'Brew potions and craft magical consumables from rare ingredients',
            'enchanting': 'Imbue items with magical properties using mystical components',
            'tailoring': 'Craft armor and clothing from fabric, leather, and thread'
        }
        return descriptions[profession] || 'Learn skills to unlock crafting recipes'
    }

    // Get tier icon
    getTierIcon(tier) {
        const icons = {
            'basic': '⭐',
            'advanced': '⭐⭐',
            'expert': '⭐⭐⭐',
            'master': '👑'
        }
        return icons[tier] || '⭐'
    }

    // Adjust HP/Stamina current values for testing (README spec)
    adjustTestingValue(action, type) {
        const character = characterManager.getCurrentCharacter()
        if (!character) return

        const amount = action === 'increase' ? 1 : -1

        try {
            characterManager.adjustCurrentValue(character, type, amount)
            this.renderCharacterSheet() // Update the character sheet display
            this.showMessage(`${type.toUpperCase()} ${action === 'increase' ? 'increased' : 'decreased'}`, 'info')
        } catch (error) {
            this.showMessage(error.message, 'error')
        }
    }

    // Add test lumens for debugging (README spec)
    addTestLumens() {
        const character = characterManager.getCurrentCharacter()
        if (!character) {
            this.showMessage('No character selected', 'error')
            return
        }

        characterManager.addLumens(character, 1)
        this.updateCharacterDisplay()
        this.showMessage('Added 1 lumen', 'success')
    }

    // Remove test lumens for debugging
    removeTestLumens() {
        const character = characterManager.getCurrentCharacter()
        if (!character) {
            this.showMessage('No character selected', 'error')
            return
        }

        if (character.lumens > 0) {
            characterManager.addLumens(character, -1)
            this.updateCharacterDisplay()
            this.showMessage('Removed 1 lumen', 'success')
        } else {
            this.showMessage('Cannot go below 0 lumens', 'error')
        }
    }

    // Get HP color class based on percentage (README spec)
    getHPColorClass(currentHP, maxHP) {
        if (maxHP === 0) return ''

        const percentage = (currentHP / maxHP) * 100

        if (percentage > 60) return 'high-hp'      // Green
        if (percentage >= 30) return 'medium-hp'   // Yellow  
        return 'low-hp'                            // Red
    }

    // Get effective stat display (base + equipment + status effects + skill bonuses)
    getEffectiveStatDisplay(character, statName) {
        const baseStat = character.stats?.[statName] ?? 0
        const equipmentBonus = character.equipmentBonuses?.[statName] ?? 0
        const statusBonus = window.inventorySystem ?
            window.inventorySystem.getStatusEffectBonuses(character)[statName] ?? 0 : 0
        const skillBonus = window.skillBonusSystem ?
            window.skillBonusSystem.getStatBonus(character, statName) : 0

        // Calculate total effective value
        const totalValue = baseStat + equipmentBonus + statusBonus + skillBonus

        // Build breakdown text for components
        let breakdown = []
        if (equipmentBonus !== 0) {
            breakdown.push(`${equipmentBonus > 0 ? '+' : ''}${equipmentBonus} eq`)
        }
        if (statusBonus !== 0) {
            breakdown.push(`${statusBonus > 0 ? '+' : ''}${statusBonus} temp`)
        }
        if (skillBonus !== 0) {
            breakdown.push(`${skillBonus > 0 ? '+' : ''}${skillBonus} skills`)
        }

        // Format: "Total (base + bonuses)" or just "Total" if no bonuses
        if (breakdown.length > 0) {
            return `${totalValue} <span class="stat-breakdown">(${baseStat} + ${breakdown.join(' + ')})</span>`
        } else {
            return totalValue.toString()
        }
    }

    // Get defence stat display (includes speed bonus + skill bonuses)
    getDefenceStatDisplay(character, statName, speedBonus) {
        const baseStat = character.stats?.[statName] ?? 0
        const equipmentBonus = character.equipmentBonuses?.[statName] ?? 0
        const statusBonus = window.inventorySystem ?
            window.inventorySystem.getStatusEffectBonuses(character)[statName] ?? 0 : 0
        const skillBonus = window.skillBonusSystem ?
            window.skillBonusSystem.getStatBonus(character, statName) : 0

        // Calculate total effective value including speed bonus
        const totalValue = baseStat + equipmentBonus + statusBonus + skillBonus + speedBonus

        // Build breakdown text for components
        let breakdown = []
        if (equipmentBonus !== 0) {
            breakdown.push(`${equipmentBonus} eq`)
        }
        if (statusBonus !== 0) {
            breakdown.push(`${statusBonus} temp`)
        }
        if (skillBonus !== 0) {
            breakdown.push(`${skillBonus} skills`)
        }
        if (speedBonus !== 0) {
            breakdown.push(`${speedBonus} speed`)
        }

        // Format: "Total (base + bonuses)" or just "Total" if no bonuses
        if (breakdown.length > 0) {
            return `${totalValue} <span class="stat-breakdown">(${baseStat} + ${breakdown.join(' + ')})</span>`
        } else {
            return totalValue.toString()
        }
    }

    // ===== SKILL TOOLTIP SYSTEM =====

    // Get skill upgrade chains - dynamically built from skill data
    getSkillUpgradeChains() {
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

    // Filter out lower-tier skills that have been upgraded
    filterUpgradedSkills(skillIds, character) {
        const upgradeChains = this.getSkillUpgradeChains()
        const allUnlockedSkills = characterManager.getAllUnlockedSkillIds(character)
        const filteredSkills = []

        for (const skillId of skillIds) {
            let shouldShow = true

            // Check if this skill has an upgraded version that the character has unlocked
            let currentSkillId = skillId
            while (upgradeChains[currentSkillId]) {
                const upgradedVersion = upgradeChains[currentSkillId]
                if (allUnlockedSkills.includes(upgradedVersion)) {
                    // Character has the upgraded version, hide this lower version
                    shouldShow = false
                    break
                }
                currentSkillId = upgradedVersion
            }

            if (shouldShow) {
                filteredSkills.push(skillId)
            }
        }

        return filteredSkills
    }

    // Get what skill this skill upgraded from (reverse lookup)
    getUpgradedFromSkill(skillId) {
        const upgradeChains = this.getSkillUpgradeChains()

        // Find the skill that upgrades to this one
        for (const [baseSkill, upgradedSkill] of Object.entries(upgradeChains)) {
            if (upgradedSkill === skillId) {
                const baseSkillData = findSkillById(baseSkill)
                return baseSkillData ? baseSkillData.name : null
            }
        }

        return null
    }

    // Initialize skill tooltips for character sheet
    initializeSkillTooltips() {
        // Remove any existing tooltip
        this.removeTooltip()

        // Add event listeners to all skill items
        const skillItems = document.querySelectorAll('.unlocked-skill-item')
        skillItems.forEach(item => {
            item.addEventListener('mouseenter', (e) => this.showSkillTooltip(e))
            item.addEventListener('mouseleave', () => this.hideSkillTooltip())
            item.addEventListener('mousemove', (e) => this.updateTooltipPosition(e))
        })
    }

    // Initialize race tooltips for character sheet
    initializeRaceTooltips() {
        // Remove any existing tooltip
        this.removeTooltip()

        // Add event listeners to all race cards
        const raceCards = document.querySelectorAll('.race-card')
        raceCards.forEach(card => {
            card.addEventListener('mouseenter', (e) => this.showRaceTooltip(e))
            card.addEventListener('mouseleave', () => this.hideRaceTooltip())
            card.addEventListener('mousemove', (e) => this.updateTooltipPosition(e))
        })
    }

    // Initialize character tooltips for character list
    initializeCharacterTooltips() {
        // Remove any existing tooltip
        this.removeTooltip()

        // Add event listeners to all character items
        const characterItems = document.querySelectorAll('.character-item')
        characterItems.forEach(item => {
            item.addEventListener('mouseenter', (e) => this.showCharacterTooltip(e))
            item.addEventListener('mouseleave', () => this.hideCharacterTooltip())
            item.addEventListener('mousemove', (e) => this.updateTooltipPosition(e))
        })
    }

    // Show race tooltip
    showRaceTooltip(event) {
        // Remove any existing tooltip first to prevent multiple tooltips
        this.removeTooltip()

        const card = event.currentTarget
        const raceData = {
            id: card.dataset.raceId,
            name: card.dataset.raceName,
            icon: card.dataset.raceIcon,
            description: card.dataset.raceDescription,
            traits: card.dataset.raceTraits,
            bonuses: card.dataset.raceBonuses
        }

        // Create tooltip element
        const tooltip = document.createElement('div')
        tooltip.className = 'race-tooltip'
        tooltip.innerHTML = `
            <div class="race-tooltip-header">
                <span class="race-tooltip-icon">${raceData.icon}</span>
                <span class="race-tooltip-name">${raceData.name}</span>
            </div>
            <div class="race-tooltip-description">${raceData.description}</div>
            <div class="race-tooltip-traits">
                <div class="race-tooltip-section-title">Racial Traits:</div>
                <div class="race-tooltip-traits-list">${raceData.traits.split(' | ').map(trait => `<div class="race-trait-item">? ${trait}</div>`).join('')}</div>
            </div>
            <div class="race-tooltip-bonuses">
                <div class="race-tooltip-section-title">Stat Bonuses:</div>
                <div class="race-tooltip-bonuses-list">${raceData.bonuses !== 'None' ? raceData.bonuses : 'No stat bonuses'}</div>
            </div>
        `

        // Add to document
        document.body.appendChild(tooltip)
        this.currentTooltip = tooltip

        // Position tooltip
        this.updateTooltipPosition(event)

        // Show tooltip with animation
        setTimeout(() => {
            if (this.currentTooltip === tooltip) { // Check tooltip still exists
                tooltip.classList.add('visible')
            }
        }, 10)
    }

    // Hide race tooltip
    hideRaceTooltip() {
        if (this.currentTooltip) {
            this.currentTooltip.classList.remove('visible')
            setTimeout(() => {
                this.removeTooltip()
            }, 200)
        }
    }

    // Show character tooltip
    showCharacterTooltip(event) {
        // Remove any existing tooltip first to prevent multiple tooltips
        this.removeTooltip()

        const item = event.currentTarget
        const characterName = item.getAttribute('data-character-name')
        const characterRace = item.getAttribute('data-character-race')
        const characterLevel = item.getAttribute('data-character-level')
        const characterLumens = item.getAttribute('data-character-lumens')
        const characterHp = item.getAttribute('data-character-hp')
        const characterStamina = item.getAttribute('data-character-stamina')
        const characterTotalSkills = item.getAttribute('data-character-total-skills')
        const characterLastPlayed = item.getAttribute('data-character-last-played')

        // Create tooltip content
        let tooltipContent = `
            <div class="character-tooltip-header">
                <strong>${characterName}</strong>
            </div>
            <div class="character-stat-line"><span class="character-stat-label">Race:</span> ${characterRace}</div>
            <div class="character-stat-line"><span class="character-stat-label">Level:</span> ${characterLevel}</div>
            <div class="character-stat-line"><span class="character-stat-label">HP:</span> ${characterHp}</div>
            <div class="character-stat-line"><span class="character-stat-label">Stamina:</span> ${characterStamina}</div>
            <div class="character-stat-line"><span class="character-stat-label">Skills Unlocked:</span> ${characterTotalSkills}</div>
            <div class="character-stat-line"><span class="character-stat-label">Lumens:</span> ${characterLumens}</div>
            <div class="character-stat-line"><span class="character-stat-label">Last Played:</span> ${characterLastPlayed}</div>
        `

        // Create tooltip element
        const tooltip = document.createElement('div')
        tooltip.className = 'character-tooltip tooltip'
        tooltip.innerHTML = tooltipContent
        tooltip.style.position = 'absolute'
        tooltip.style.zIndex = '1000'
        tooltip.style.pointerEvents = 'none'

        document.body.appendChild(tooltip)
        this.currentTooltip = tooltip

        // Position the tooltip
        this.updateTooltipPosition(event, tooltip)

        // Add visible class with a small delay for smooth animation
        setTimeout(() => {
            if (tooltip && tooltip.parentNode) {
                tooltip.classList.add('visible')
            }
        }, 10)
    }

    // Hide character tooltip
    hideCharacterTooltip() {
        if (this.currentTooltip) {
            this.currentTooltip.classList.remove('visible')
            setTimeout(() => {
                this.removeTooltip()
            }, 200)
        }
    }

    // Show skill tooltip
    showSkillTooltip(event) {
        // Remove any existing tooltip first to prevent multiple tooltips
        this.removeTooltip()

        const item = event.currentTarget
        const skillData = {
            id: item.dataset.skillId,
            name: item.dataset.skillName,
            desc: item.dataset.skillDesc,
            tier: item.dataset.skillTier,
            cost: item.dataset.skillCost,
            stamina: item.dataset.skillStamina,
            icon: item.dataset.skillIcon
        }

        // Check if this skill is an upgraded version of another skill
        const upgradedFromSkill = this.getUpgradedFromSkill(skillData.id)

        // Create tooltip element
        const tooltip = document.createElement('div')
        tooltip.className = 'skill-tooltip'
        tooltip.innerHTML = `
            <div class="skill-tooltip-header">
                <span class="skill-tooltip-icon">${skillData.icon}</span>
                <span class="skill-tooltip-name">${skillData.name}</span>
                <span class="skill-tooltip-tier">Tier ${skillData.tier}</span>
            </div>
            <div class="skill-tooltip-description">${skillData.desc}</div>
            <div class="skill-tooltip-costs">
                <div class="skill-tooltip-cost">
                    <span class="skill-tooltip-cost-label">Cost:</span>
                    <span>${skillData.cost}L</span>
                </div>
                <div class="skill-tooltip-cost">
                    <span class="skill-tooltip-cost-label">Stamina:</span>
                    <span>${skillData.stamina}</span>
                </div>
            </div>
            ${upgradedFromSkill ? `<div class="skill-tooltip-upgrade-info">(This is an upgraded version of ${upgradedFromSkill})</div>` : ''}
        `

        // Add to document
        document.body.appendChild(tooltip)
        this.currentTooltip = tooltip

        // Position tooltip
        this.updateTooltipPosition(event)

        // Show tooltip with animation
        setTimeout(() => {
            if (this.currentTooltip === tooltip) { // Check tooltip still exists
                tooltip.classList.add('visible')
            }
        }, 10)
    }

    // Hide skill tooltip
    hideSkillTooltip() {
        if (this.currentTooltip) {
            this.currentTooltip.classList.remove('visible')
            setTimeout(() => {
                this.removeTooltip()
            }, 200)
        }
    }

    // Update tooltip position
    updateTooltipPosition(event) {
        if (!this.currentTooltip) return

        const tooltip = this.currentTooltip

        // Get mouse position relative to the page (includes scroll)
        const mouseX = event.pageX
        const mouseY = event.pageY

        // Get tooltip dimensions (force a layout if needed)
        tooltip.style.visibility = 'hidden'
        tooltip.style.display = 'block'
        const tooltipWidth = tooltip.offsetWidth
        const tooltipHeight = tooltip.offsetHeight
        tooltip.style.visibility = 'visible'
        tooltip.style.display = ''

        // Get viewport dimensions and scroll position
        const viewportWidth = window.innerWidth
        const viewportHeight = window.innerHeight
        const scrollX = window.pageXOffset || document.documentElement.scrollLeft
        const scrollY = window.pageYOffset || document.documentElement.scrollTop

        // Calculate position (offset from mouse cursor)
        let x = mouseX + 15
        let y = mouseY - 10

        // Adjust if tooltip would go off the right edge of viewport
        if (x + tooltipWidth > scrollX + viewportWidth) {
            x = mouseX - tooltipWidth - 15
        }

        // Adjust if tooltip would go off the bottom edge of viewport
        if (y + tooltipHeight > scrollY + viewportHeight) {
            y = mouseY - tooltipHeight - 10
        }

        // Ensure tooltip doesn't go off the left edge
        if (x < scrollX) {
            x = scrollX + 10
        }

        // Ensure tooltip doesn't go off the top edge
        if (y < scrollY) {
            y = scrollY + 10
        }

        tooltip.style.left = x + 'px'
        tooltip.style.top = y + 'px'
    }

    // Remove current tooltip
    removeTooltip() {
        // Clear any pending timers
        if (this.tooltipShowTimer) {
            clearTimeout(this.tooltipShowTimer)
            this.tooltipShowTimer = null
        }
        if (this.tooltipHideTimer) {
            clearTimeout(this.tooltipHideTimer)
            this.tooltipHideTimer = null
        }

        if (this.currentTooltip) {
            this.currentTooltip.remove()
            this.currentTooltip = null
        }

        // Fallback: remove any stray tooltips that might exist
        const strayTooltips = document.querySelectorAll('.skill-tooltip, .shop-item-tooltip, .inventory-item-tooltip, .skill-tree-tooltip, .character-tooltip')
        strayTooltips.forEach(tooltip => tooltip.remove())
    }

    // Initialize shop item tooltips
    initializeShopTooltips() {
        // Remove any existing tooltip
        this.removeTooltip()

        // Add event listeners to all shop items
        const shopItems = document.querySelectorAll('.shop-item')
        shopItems.forEach(item => {
            item.addEventListener('mouseenter', (e) => this.showShopTooltip(e))
            item.addEventListener('mouseleave', () => this.hideShopTooltip())
            item.addEventListener('mousemove', (e) => this.updateTooltipPosition(e))
        })
    }

    // Initialize inventory item tooltips
    initializeInventoryTooltips() {
        // Remove any existing tooltip
        this.removeTooltip()

        // Add event listeners to all inventory items
        const inventoryItems = document.querySelectorAll('.inventory-item')
        inventoryItems.forEach(item => {
            item.addEventListener('mouseenter', (e) => this.showInventoryTooltip(e))
            item.addEventListener('mouseleave', () => this.hideInventoryTooltip())
            item.addEventListener('mousemove', (e) => this.updateTooltipPosition(e))
        })

        // Add event listeners to all equipped items
        const equippedItems = document.querySelectorAll('.equipped-item')
        equippedItems.forEach(item => {
            item.addEventListener('mouseenter', (e) => this.showInventoryTooltip(e))
            item.addEventListener('mouseleave', () => this.hideInventoryTooltip())
            item.addEventListener('mousemove', (e) => this.updateTooltipPosition(e))
        })
    }

    // Show shop item tooltip
    showShopTooltip(event) {
        // Clear any existing timers
        if (this.tooltipHideTimer) {
            clearTimeout(this.tooltipHideTimer)
            this.tooltipHideTimer = null
        }

        // Remove any existing tooltip first
        this.removeTooltip()

        const item = event.currentTarget
        const itemId = item.dataset.itemId
        const itemData = findItemById(itemId)

        if (!itemData) return

        // Get character for affordability check
        const character = characterManager.getCurrentCharacter()
        if (!character) return null

        const gil = characterManager.getGil(character)

        // Calculate if affordable
        const itemPrice = typeof itemData.price === 'number' ? itemData.price : 0
        const isAffordable = gil >= itemPrice

        // Format price
        const priceText = `${itemPrice} Gil`

        // Build stat bonuses HTML
        let statBonusesHtml = ''
        if (itemData.statModifiers && Object.keys(itemData.statModifiers).length > 0) {
            Object.entries(itemData.statModifiers).forEach(([stat, value]) => {
                const displayName = stat === 'magicPower' ? 'Magic Power' :
                    stat === 'physicalDefence' ? 'Physical Defence' :
                        stat === 'magicalDefence' ? 'Magical Defence' :
                            stat.charAt(0).toUpperCase() + stat.slice(1)
                const sign = value >= 0 ? '+' : ''
                statBonusesHtml += `<span class="tooltip-stat-bonus">${sign}${value} ${displayName}</span>`
            })
        }

        // Build damage tag for weapons
        let damageTagHtml = ''
        if (itemData.type === 'weapon' && itemData.damage) {
            damageTagHtml = `<span class="tooltip-damage-tag">${itemData.damage}</span>`
        }

        // Create tooltip element
        const tooltip = document.createElement('div')
        tooltip.className = 'shop-item-tooltip'
        tooltip.innerHTML = `
            <div class="tooltip-header">
                ${window.renderItemIcon ? window.renderItemIcon(itemData, 20, 'tooltip-icon') : `<span class="tooltip-icon">${itemData.icon}</span>`}
                <span class="tooltip-name">${itemData.name}</span>
                ${damageTagHtml}
                <span class="tooltip-price ${isAffordable ? '' : 'expensive'}">${priceText}</span>
            </div>
            <div class="tooltip-description">${this.getEnhancedItemDescription(itemData)}</div>
            ${statBonusesHtml ? `<div class="tooltip-stats">${statBonusesHtml}</div>` : ''}
            <div class="tooltip-rarity ${itemData.rarity}">${itemData.rarity}</div>
        `

        // Add to document
        document.body.appendChild(tooltip)
        this.currentTooltip = tooltip

        // Position tooltip
        this.updateTooltipPosition(event)

        // Show tooltip with fade in - use timer to prevent conflicts
        this.tooltipShowTimer = setTimeout(() => {
            if (tooltip.parentNode && this.currentTooltip === tooltip) {
                tooltip.classList.add('visible')
            }
            this.tooltipShowTimer = null
        }, 50)
    }

    // Hide shop tooltip
    hideShopTooltip() {
        // Clear show timer if pending
        if (this.tooltipShowTimer) {
            clearTimeout(this.tooltipShowTimer)
            this.tooltipShowTimer = null
        }

        if (this.currentTooltip) {
            this.currentTooltip.classList.remove('visible')
            this.tooltipHideTimer = setTimeout(() => {
                if (this.currentTooltip && this.currentTooltip.parentNode) {
                    this.currentTooltip.remove()
                    this.currentTooltip = null
                }
                this.tooltipHideTimer = null
            }, 150)
        }
    }

    // Show inventory item tooltip
    showInventoryTooltip(event) {
        // Clear any existing timers
        if (this.tooltipHideTimer) {
            clearTimeout(this.tooltipHideTimer)
            this.tooltipHideTimer = null
        }

        // Remove any existing tooltip first
        this.removeTooltip()

        const item = event.currentTarget
        const itemId = item.dataset.itemId
        const itemData = this.findItemById(itemId)

        if (!itemData) return

        // Get character for equipped status and stats
        const character = characterManager.getCurrentCharacter()
        const isEquipped = character ? this.isItemEquipped(character, itemId) : false
        const equippedSlot = isEquipped ? this.getEquippedSlot(character, itemId) : null

        // Build stat bonuses HTML
        let statBonusesHtml = ''
        if (itemData.statModifiers && Object.keys(itemData.statModifiers).length > 0) {
            Object.entries(itemData.statModifiers).forEach(([stat, value]) => {
                const displayName = stat === 'magicPower' ? 'Magic Power' :
                    stat === 'physicalDefence' ? 'Physical Defence' :
                        stat === 'magicalDefence' ? 'Magical Defence' :
                            stat.charAt(0).toUpperCase() + stat.slice(1)
                const sign = value >= 0 ? '+' : ''
                statBonusesHtml += `<span class="tooltip-stat-bonus">${sign}${value} ${displayName}</span>`
            })
        }

        // Build special effects HTML
        let effectsHtml = ''
        if (itemData.effects && itemData.effects.length > 0) {
            effectsHtml = `<div class="tooltip-effects">${itemData.effects.map(effect => `<span class="tooltip-effect">� ${effect}</span>`).join('')}</div>`
        }

        // Build damage info for weapons
        let damageHtml = ''
        if (itemData.type === 'weapon') {
            const weaponDamage = window.gameLogic ? window.gameLogic.getWeaponDamage(itemData) : (itemData.damage || 'No damage')
            damageHtml = `<div class="tooltip-damage">?? Damage: ${weaponDamage}</div>`
        }

        // Build price info if item is sellable
        let priceHtml = ''
        if (itemData.price && itemData.sellable !== false) {
            const sellPrice = typeof itemData.price === 'number' ? Math.floor(itemData.price * 0.5) : 0
            if (sellPrice > 0) {
                priceHtml = `<div class="tooltip-sell-price">🔄 Sell for: ${sellPrice} Gil</div>`
            }
        }

        // Get quantity info
        const quantityInfo = character && character.inventory && character.inventory[itemId] > 1 ?
            `<div class="tooltip-quantity">?? Quantity: ${character.inventory[itemId]}</div>` : ''

        // Create tooltip element
        const tooltip = document.createElement('div')
        tooltip.className = 'inventory-item-tooltip'
        tooltip.innerHTML = `
            <div class="tooltip-header">
                ${window.renderItemIcon ? window.renderItemIcon(itemData, 20, 'tooltip-icon') : `<span class="tooltip-icon">${itemData.icon}</span>`}
                <span class="tooltip-name">${itemData.name}</span>
                ${isEquipped ? `<span class="tooltip-equipped">EQUIPPED</span>` : ''}
            </div>
            <div class="tooltip-description">${this.getEnhancedItemDescription(itemData)}</div>
            ${damageHtml}
            ${statBonusesHtml ? `<div class="tooltip-stats">${statBonusesHtml}</div>` : ''}
            ${effectsHtml}
            ${quantityInfo}
            ${priceHtml}
            <div class="tooltip-rarity ${itemData.rarity || 'common'}">${(itemData.rarity || 'common').charAt(0).toUpperCase() + (itemData.rarity || 'common').slice(1)}</div>
        `

        // Add to document
        document.body.appendChild(tooltip)
        this.currentTooltip = tooltip

        // Position tooltip
        this.updateTooltipPosition(event)

        // Show tooltip with fade in - use timer to prevent conflicts
        this.tooltipShowTimer = setTimeout(() => {
            if (tooltip.parentNode && this.currentTooltip === tooltip) {
                tooltip.classList.add('visible')
            }
            this.tooltipShowTimer = null
        }, 50)
    }

    // Hide inventory tooltip
    hideInventoryTooltip() {
        // Clear show timer if pending
        if (this.tooltipShowTimer) {
            clearTimeout(this.tooltipShowTimer)
            this.tooltipShowTimer = null
        }

        if (this.currentTooltip) {
            this.currentTooltip.classList.remove('visible')
            this.tooltipHideTimer = setTimeout(() => {
                if (this.currentTooltip && this.currentTooltip.parentNode) {
                    this.currentTooltip.remove()
                    this.currentTooltip = null
                }
                this.tooltipHideTimer = null
            }, 150)
        }
    }

    // Render tooltip stats helper
    renderTooltipStats(item) {
        let html = ''

        // Show stat modifiers
        if (item.statModifiers) {
            for (const [stat, value] of Object.entries(item.statModifiers)) {
                html += `<div class="stat-bonus">+${value} ${this.capitalizeFirst(stat)}</div>`
            }
        }

        // Show special effects
        if (item.specialEffects && item.specialEffects.length > 0) {
            html += `<div class="special-effects-section">`
            html += `<div class="effects-title">Special Effects:</div>`
            for (const effect of item.specialEffects) {
                html += `<div class="effect">${effect.replace(/_/g, ' ')}</div>`
            }
            html += `</div>`
        }

        return html
    }

    // Initialize skill tree tooltips
    initializeSkillTreeTooltips() {
        // Remove any existing tooltip
        this.removeTooltip()

        // Add event listeners to all skill nodes for all categories
        const skillNodes = document.querySelectorAll('.skill-node')

        skillNodes.forEach(node => {
            const skillId = node.dataset.skillId

            node.addEventListener('mouseenter', (e) => {
                this.showSkillTreeTooltip(e)
            })
            node.addEventListener('mouseleave', () => {
                this.hideSkillTreeTooltip()
            })
            node.addEventListener('mousemove', (e) => this.updateTooltipPosition(e))
        })
    }

    // Show skill tree tooltip
    showSkillTreeTooltip(event) {
        // Clear any existing timers
        if (this.tooltipHideTimer) {
            clearTimeout(this.tooltipHideTimer)
            this.tooltipHideTimer = null
        }

        // Remove any existing tooltip first
        this.removeTooltip()

        const skillNode = event.currentTarget
        const skillId = skillNode.dataset.skillId
        const skill = findSkillById(skillId)

        if (!skill) {
            return
        }

        // Get character for status information
        const character = characterManager.getCurrentCharacter()
        const categorySkills = character.unlockedSkills[this.selectedSkillCategory] || {}
        const unlockedSkillsArray = categorySkills[this.selectedSkillSubcategory] || []
        const isUnlocked = unlockedSkillsArray.includes(skill.id)
        const prerequisitesMet = characterManager.validateSkillPrerequisites(character, skill.id)
        const canAfford = character.lumens >= skill.cost

        // Build status info
        let statusHtml = ''
        if (isUnlocked) {
            statusHtml = '<div class="tooltip-status unlocked">? UNLOCKED</div>'
        } else if (prerequisitesMet && canAfford) {
            statusHtml = '<div class="tooltip-status available">?? AVAILABLE</div>'
        } else if (!canAfford) {
            statusHtml = '<div class="tooltip-status expensive">?? NEED MORE LUMENS</div>'
        } else {
            statusHtml = '<div class="tooltip-status locked">?? PREREQUISITES NOT MET</div>'
        }

        // Build prerequisites info
        let prereqHtml = ''
        if (skill.prerequisites.type !== 'NONE') {
            if (skill.prerequisites.type === 'LEVEL') {
                // Handle level-based prerequisites
                const characterLevel = characterManager.calculateLevel(characterManager.calculateTierPoints(character) + characterManager.calculateStatPoints(character))
                const isLevelMet = characterLevel >= skill.prerequisites.level
                const status = isLevelMet ? '✅' : '❌'

                prereqHtml = `<div class="tooltip-prerequisites">
                    <strong>Prerequisites:</strong><br>
                    ${status} Character Level ${skill.prerequisites.level}+ (Current: ${characterLevel})
                </div>`
            } else if (skill.prerequisites.skills && Array.isArray(skill.prerequisites.skills)) {
                // Handle skill-based prerequisites
                const prereqSkills = skill.prerequisites.skills.map(skillId => {
                    const prereqSkill = findSkillById(skillId)
                    const isPrereqUnlocked = prereqSkill && unlockedSkillsArray.includes(skillId)
                    const status = isPrereqUnlocked ? '✅' : '❌'

                    if (!prereqSkill) return skillId

                    // Check if this prerequisite is from a different skill tree
                    const skillTreeInfo = this.findSkillTreeInfo(skillId)
                    let skillDisplayName = prereqSkill.name

                    if (skillTreeInfo) {
                        const categoryName = skillTreeInfo.category === 'racial'
                            ? `${skillTreeInfo.subcategory.charAt(0).toUpperCase() + skillTreeInfo.subcategory.slice(1)} Racial`
                            : `${skillTreeInfo.category.charAt(0).toUpperCase() + skillTreeInfo.category.slice(1)} → ${skillTreeInfo.subcategory.charAt(0).toUpperCase() + skillTreeInfo.subcategory.slice(1)}`

                        skillDisplayName = `${prereqSkill.name} <span style="color: #888; font-size: 0.9em;">(${categoryName})</span>`
                    }

                    return `${status} ${skillDisplayName}`
                })
                const connector = skill.prerequisites.type === 'AND' ? ' AND ' : ' OR '
                prereqHtml = `<div class="tooltip-prerequisites">
                    <strong>Prerequisites:</strong><br>
                    ${prereqSkills.join('<br>' + connector + ' ')}
                </div>`
            } else {
                // Handle other prerequisite types
                prereqHtml = `<div class="tooltip-prerequisites">
                    <strong>Prerequisites:</strong><br>
                    Special requirements (see skill description)
                </div>`
            }
        }

        // Create tooltip element
        const tooltip = document.createElement('div')
        tooltip.className = 'skill-tree-tooltip'
        tooltip.innerHTML = `
            <div class="tooltip-header">
                <span class="tooltip-icon">${skill.icon}</span>
                <span class="tooltip-name">${skill.name}</span>
                <span class="tooltip-tier">Tier ${skill.tier}</span>
            </div>
            <div class="tooltip-description">${skill.desc}</div>
            <div class="tooltip-costs">
                <div class="tooltip-cost-item">?? Cost: ${skill.cost}L</div>
                ${skill.staminaCost > 0 ? `<div class="tooltip-cost-item">? Stamina: ${skill.staminaCost}</div>` : ''}
            </div>
            ${prereqHtml}
            ${statusHtml}
        `

        // Add to document
        document.body.appendChild(tooltip)
        this.currentTooltip = tooltip

        // Position tooltip
        this.updateTooltipPosition(event)

        // Show tooltip with fade in - use timer to prevent conflicts
        this.tooltipShowTimer = setTimeout(() => {
            if (tooltip.parentNode && this.currentTooltip === tooltip) {
                tooltip.classList.add('visible')
            }
            this.tooltipShowTimer = null
        }, 50)
    }

    // Hide skill tree tooltip
    hideSkillTreeTooltip() {
        // Clear show timer if pending
        if (this.tooltipShowTimer) {
            clearTimeout(this.tooltipShowTimer)
            this.tooltipShowTimer = null
        }

        if (this.currentTooltip) {
            this.currentTooltip.classList.remove('visible')
            this.tooltipHideTimer = setTimeout(() => {
                if (this.currentTooltip && this.currentTooltip.parentNode) {
                    this.currentTooltip.remove()
                    this.currentTooltip = null
                }
                this.tooltipHideTimer = null
            }, 150)
        }
    }

    // Initialize crafting tooltips
    initializeCraftingTooltips() {
        const professionContent = document.querySelector('.profession-content')
        if (!professionContent) return

        let hoverTimer = null
        let hideTimer = null
        let currentHoveredItem = null

        // Use direct event listeners on crafting items
        const attachTooltipEvents = () => {
            const craftingItems = professionContent.querySelectorAll('.crafting-item')
            craftingItems.forEach(item => {
                // Remove any existing listeners first
                item.removeEventListener('mouseenter', item._tooltipEnterHandler)
                item.removeEventListener('mousemove', item._tooltipMoveHandler)
                item.removeEventListener('mouseleave', item._tooltipLeaveHandler)

                // Create new handlers
                item._tooltipEnterHandler = (e) => {
                    const itemId = item.dataset.itemId

                    // Skip if already showing tooltip for this item
                    if (currentHoveredItem === itemId) return
                    currentHoveredItem = itemId

                    // Clear any existing timers
                    if (hideTimer) {
                        clearTimeout(hideTimer)
                        hideTimer = null
                    }

                    // Show tooltip after short delay
                    hoverTimer = setTimeout(() => {
                        this.showCraftingTooltip(e, item)
                        hoverTimer = null
                    }, 50)
                }

                item._tooltipMoveHandler = (e) => {
                    // Update tooltip position when mouse moves within the item
                    if (currentHoveredItem === item.dataset.itemId) {
                        this.updateTooltipPosition(e)
                    }
                }

                item._tooltipLeaveHandler = (e) => {
                    const itemId = item.dataset.itemId
                    currentHoveredItem = null

                    // Clear hover timer if still pending
                    if (hoverTimer) {
                        clearTimeout(hoverTimer)
                        hoverTimer = null
                    }

                    // Hide tooltip after delay
                    hideTimer = setTimeout(() => {
                        this.hideCraftingTooltip()
                        hideTimer = null
                    }, 150)
                }

                // Attach the new listeners
                item.addEventListener('mouseenter', item._tooltipEnterHandler)
                item.addEventListener('mousemove', item._tooltipMoveHandler)
                item.addEventListener('mouseleave', item._tooltipLeaveHandler)
            })
        }

        // Initial attachment
        attachTooltipEvents()

        // Store the function for later use when switching tabs
        professionContent._attachTooltipEvents = attachTooltipEvents
    }

    // Show crafting tooltip
    showCraftingTooltip(event, craftingElement) {
        try {
            // Clear any existing timers
            if (this.tooltipHideTimer) {
                clearTimeout(this.tooltipHideTimer)
                this.tooltipHideTimer = null
            }

            // Remove any existing tooltip first
            this.removeTooltip()

            const itemId = craftingElement.dataset.itemId
            if (!itemId) return

            // Find the item in ITEMS_DATA
            let item = null
            if (window.ITEMS_DATA) {
                // Search through all item categories
                for (const categoryKey in window.ITEMS_DATA) {
                    const category = window.ITEMS_DATA[categoryKey]
                    for (const itemKey in category) {
                        const currentItem = category[itemKey]
                        if (currentItem.id === itemId) {
                            item = currentItem
                            break
                        }
                    }
                    if (item) break
                }
            }

            if (!item) {
                return
            }

            const character = window.characterManager?.getCurrentCharacter() || {}
            const canCraft = this.canPlayerCraftItem(item, character)
            const hasRequiredSkills = this.hasRequiredSkillsForCrafting(item, character)

            // Check materials (support both old 'materials' and new 'craftingMaterials')
            const materialsArray = item.craftingMaterials || item.materials || []
            const materialChecks = materialsArray.map(material => {
                const materialId = typeof material === 'string' ? material : (material.id || material.item)
                const quantity = typeof material === 'string' ? 1 : (material.quantity || 1)
                const available = this.getPlayerMaterialCount(character, materialId)
                const hasEnough = available >= quantity
                return {
                    id: materialId,
                    quantity: quantity,
                    available,
                    hasEnough
                }
            })

            // Create tooltip
            const tooltip = document.createElement('div')
            tooltip.className = 'crafting-item-tooltip'
            tooltip.innerHTML = `
                <div class="tooltip-header">
                    <div class="tooltip-title">${item.name}</div>
                    <div class="tooltip-type">${this.formatItemType(item.type)}</div>
                </div>
                
                                    <div class="tooltip-description">${this.getEnhancedItemDescription(item)}</div>
                
                <div class="tooltip-stats">
                    ${this.renderCraftingTooltipStats(item)}
                </div>
                
                <div class="tooltip-requirements">
                    <div class="requirements-title">Requirements:</div>
                    ${this.formatSkillRequirements(item)}
                </div>
                
                <div class="tooltip-materials">
                    <div class="materials-title">Materials Required:</div>
                    <div class="materials-list">
                        ${materialChecks.map(material => `
                            <div class="material-requirement ${material.hasEnough ? 'sufficient' : 'insufficient'}">
                                <span class="material-name">${this.getMaterialName(material.id)}</span>
                                <span class="material-count">${material.available}/${material.quantity}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                ${!canCraft ? `
                    <div class="tooltip-warning">
                        ${!hasRequiredSkills ? 'Missing required skills' : 'Insufficient materials'}
                    </div>
                ` : ''}
            `

            // Add to document
            document.body.appendChild(tooltip)
            this.currentTooltip = tooltip

            // Position tooltip
            this.updateTooltipPosition(event)

            // Show tooltip with fade in - use timer to prevent conflicts
            this.tooltipShowTimer = setTimeout(() => {
                if (tooltip.parentNode && this.currentTooltip === tooltip) {
                    tooltip.classList.add('visible')
                }
                this.tooltipShowTimer = null
            }, 50)

        } catch (error) {
            console.error('?? Error showing crafting tooltip:', error)
        }
    }

    // Hide crafting tooltip
    hideCraftingTooltip() {
        // Clear show timer if pending
        if (this.tooltipShowTimer) {
            clearTimeout(this.tooltipShowTimer)
            this.tooltipShowTimer = null
        }

        if (this.currentTooltip) {
            this.currentTooltip.classList.remove('visible')
            this.tooltipHideTimer = setTimeout(() => {
                if (this.currentTooltip && this.currentTooltip.parentNode) {
                    this.currentTooltip.remove()
                    this.currentTooltip = null
                }
                this.tooltipHideTimer = null
            }, 150)
        }
    }

    // Update crafting tooltip position based on mouse movement
    // Render crafting tooltip stats helper
    renderCraftingTooltipStats(item) {
        let html = ''

        // Show stat modifiers
        if (item.statModifiers) {
            for (const [stat, value] of Object.entries(item.statModifiers)) {
                html += `<div class="stat-bonus">+${value} ${this.capitalizeFirst(stat)}</div>`
            }
        }

        // Show special effects
        if (item.specialEffects && item.specialEffects.length > 0) {
            html += `<div class="special-effects-section">`
            html += `<div class="effects-title">Special Effects:</div>`
            for (const effect of item.specialEffects) {
                html += `<div class="effect">${effect.replace(/_/g, ' ')}</div>`
            }
            html += `</div>`
        }

        return html
    }

    // Helper method to build AC formula display with breakdown
    buildACFormulaDisplay(character, defenseType, speedACBonus) {
        const baseDefence = character.stats[defenseType] || 8
        const speedBonus = speedACBonus || 0

        return `${baseDefence} base + ${speedBonus} speed`
    }

    // Calculate total movement speed including all bonuses
    getTotalMovementSpeed(character) {
        const baseSpeed = character.stats?.speed ?? 2
        const equipmentBonus = character.equipmentBonuses?.speed ?? 0
        const statusBonus = window.inventorySystem ?
            window.inventorySystem.getStatusEffectBonuses(character).speed ?? 0 : 0
        const skillBonus = window.skillBonusSystem ?
            window.skillBonusSystem.getStatBonus(character, 'speed') : 0

        const totalSpeed = baseSpeed + equipmentBonus + statusBonus + skillBonus
        return totalSpeed * 5 // Convert to meters
    }

    // Get movement speed formula breakdown
    getMovementSpeedFormula(character) {
        const baseSpeed = character.stats?.speed ?? 2
        const equipmentBonus = character.equipmentBonuses?.speed ?? 0
        const statusBonus = window.inventorySystem ?
            window.inventorySystem.getStatusEffectBonuses(character).speed ?? 0 : 0
        const skillBonus = window.skillBonusSystem ?
            window.skillBonusSystem.getStatBonus(character, 'speed') : 0

        const totalSpeed = baseSpeed + equipmentBonus + statusBonus + skillBonus

        // Build breakdown for bonuses
        let breakdown = []
        if (equipmentBonus !== 0) {
            breakdown.push(`${equipmentBonus > 0 ? '+' : ''}${equipmentBonus} eq`)
        }
        if (statusBonus !== 0) {
            breakdown.push(`${statusBonus > 0 ? '+' : ''}${statusBonus} temp`)
        }
        if (skillBonus !== 0) {
            breakdown.push(`${skillBonus > 0 ? '+' : ''}${skillBonus} skills`)
        }

        // Format the formula
        if (breakdown.length > 0) {
            return `(${baseSpeed} + ${breakdown.join(' + ')}) � 5ft = ${totalSpeed} � 5ft`
        } else {
            return `${baseSpeed} speed � 5ft`
        }
    }

    // ===== INVENTORY SYSTEM METHODS =====

    // Get proper slot label
    getSlotLabel(slotType) {
        const labels = {
            'primaryWeapon': 'PRIMARY WEAPON',
            'secondaryWeapon': 'SECONDARY WEAPON',
            'weapon': 'WEAPON', // Legacy support
            'armor': 'ARMOR',
            'accessory': 'ACCESSORY'
        }
        return labels[slotType] || this.capitalizeFirst(slotType)
    }

    // Check if item type belongs in equipment section
    isEquipmentSection(itemType) {
        return itemType === 'weapon' || itemType === 'armor' || itemType === 'accessory'
    }

    // Migration function to handle Guardian Shield type change
    migrateGuardianShield(character) {
        if (!character.equipped) return

        // Check if Guardian Shield is equipped as armor and migrate it to accessory
        if (character.equipped.armor && character.equipped.armor.id === 'guardian_shield') {
            // Update the item type to accessory
            character.equipped.armor.type = 'accessory'

            // Move from armor slot to accessory slot
            character.equipped.accessory = character.equipped.armor
            character.equipped.armor = null

            // Also migrate any enchantments
            if (character.equippedEnchantments && character.equippedEnchantments.armor) {
                if (!character.equippedEnchantments.accessory) {
                    character.equippedEnchantments.accessory = []
                }
                character.equippedEnchantments.accessory = [...character.equippedEnchantments.armor]
                character.equippedEnchantments.armor = []
            }

            // Save the character with the migration
            if (window.characterManager) {
                window.characterManager.saveCharacter(character)
            }
        }
    }

    // Render inventory UI
    renderInventory(character) {
        // Run migration for Guardian Shield type change
        this.migrateGuardianShield(character)

        const inventoryContainer = document.getElementById('inventory-container')
        if (!inventoryContainer) return

        // Check if character has dual wield skill
        const hasDualWield = this.hasDualWieldSkill(character)

        let html = `
            <div class="inventory-section">
                <h3>Equipment</h3>
                <div class="equipment-slots">
                    ${this.renderEquipmentSlot(character, 'primaryWeapon', '⚔️')}
                    ${hasDualWield ? this.renderEquipmentSlot(character, 'secondaryWeapon', '🗡️') : ''}
                    ${this.renderEquipmentSlot(character, 'armor', '🛡️')}
                    ${this.renderEquipmentSlot(character, 'accessory', '💍')}
                </div>
            </div>
            
            <div class="inventory-section">
                <h3>Inventory</h3>
                <div class="inventory-grid">
                    ${this.renderInventoryItems(character)}
                </div>
            </div>
            
            ${character.isMonster ? this.renderMonsterLootSection(character) : ''}
        `

        inventoryContainer.innerHTML = html
        // Initialize inventory tooltips after rendering
        setTimeout(() => this.initializeInventoryTooltips(), 10)
        // Event listeners are handled by global event delegation, no need to set up here
    }

    // Render monster loot section for inventory
    renderMonsterLootSection(character) {
        const characterSummary = characterManager.getCharacterSummary(character)

        // Calculate player count for lumen drop scaling
        const allCharacters = characterManager.getAllCharacters()
        const playerCount = allCharacters.filter(char => !char.isMonster).length

        // Calculate drop percentage based on player count
        let dropPercentage = 0.10 // 10% for 1 player (default)
        if (playerCount >= 6) {
            dropPercentage = 0.25 // 25% for 6+ players
        } else if (playerCount >= 4) {
            dropPercentage = 0.20 // 20% for 4-5 players
        } else if (playerCount >= 2) {
            dropPercentage = 0.15 // 15% for 2-3 players
        }

        const lumenDrop = Math.max(1, Math.floor(characterSummary.totalSpent * dropPercentage))
        const lootItems = getMonsterLoot(character)

        return `
            <div class="inventory-section monster-loot-section">
                <h3>Defeated Monster Drops</h3>
                <div class="monster-drops-info">
                    <div class="lumen-drop-info">
                        <span class="drop-type">Lumen Reward:</span>
                        <span class="lumen-amount">${lumenDrop}L</span>
                    </div>
                    ${lootItems.length > 0 ? `
                        <div class="loot-items-info">
                            <span class="drop-type">Material Drops:</span>
                            <div class="loot-items-grid">
                                ${lootItems.map(item => this.renderLootItem(item)).join('')}
                            </div>
                        </div>
                    ` : `
                        <div class="no-loot-info">
                            <span class="drop-type">Material Drops:</span>
                            <span class="no-drops">None (basic monster)</span>
                        </div>
                    `}
                </div>
            </div>
        `
    }

    // Calculate monster lumen drop based on player count
    calculateMonsterLumenDrop(totalSpent) {
        // Calculate player count for lumen drop scaling
        const allCharacters = characterManager.getAllCharacters()
        const playerCount = allCharacters.filter(char => !char.isMonster).length

        // Calculate drop percentage based on player count
        let dropPercentage = 0.10 // 10% for 1 player (default)
        if (playerCount >= 6) {
            dropPercentage = 0.25 // 25% for 6+ players
        } else if (playerCount >= 4) {
            dropPercentage = 0.20 // 20% for 4-5 players
        } else if (playerCount >= 2) {
            dropPercentage = 0.15 // 15% for 2-3 players
        }

        return Math.max(1, Math.floor(totalSpent * dropPercentage))
    }

    // Render individual loot item with description
    renderLootItem(item) {
        const rarityColors = {
            'common': '#9E9E9E',
            'uncommon': '#4CAF50',
            'rare': '#2196F3',
            'epic': '#9C27B0',
            'legendary': '#FF9800'
        }

        const color = rarityColors[item.rarity] || '#9E9E9E'

        return `
            <div class="loot-item-card" style="border-color: ${color};">
                <div class="loot-item-header">
                    ${window.renderItemIcon ? window.renderItemIcon(item, 24, 'loot-item-icon') : `<span class="loot-item-icon">${item.icon}</span>`}
                    <span class="loot-item-name" style="color: ${color};">${item.name}</span>
                </div>
                <div class="loot-item-rarity" style="color: ${color};">${item.rarity.charAt(0).toUpperCase() + item.rarity.slice(1)} ${item.type}</div>
                <div class="loot-item-desc">${this.getEnhancedItemDescription(item)}</div>
            </div>
        `
    }

    // Render equipment slot
    renderEquipmentSlot(character, slotType, icon) {
        const equippedItem = character.equipped[slotType]
        const slotClass = equippedItem ? 'equipment-slot equipped' : 'equipment-slot empty'

        // Add dual wield indicator for secondary weapon slot
        const dualWieldIndicator = slotType === 'secondaryWeapon' && this.hasDualWieldSkill(character) ?
            '<div class="dual-wield-indicator">(Dual Wield)</div>' : ''

        return `
            <div class="${slotClass}" data-slot="${slotType}">
                <div class="slot-icon">${icon}</div>
                <div class="slot-label">${this.getSlotLabel(slotType)}</div>
                ${dualWieldIndicator}
                ${equippedItem ? `
                    <div class="equipped-item" data-item-id="${equippedItem.id}">
                        ${window.renderItemIcon ? window.renderItemIcon(equippedItem, 20, 'item-icon') : `<span class="item-icon">${equippedItem.icon}</span>`}
                        <span class="item-name">${equippedItem.name}</span>
                        ${equippedItem.type === 'weapon' ? `<div class="weapon-damage-equipped">Damage: ${window.gameLogic ? window.gameLogic.getWeaponDamage(equippedItem) : (equippedItem.damage || 'No damage')}</div>` : ''}
                        <button class="unequip-btn" data-item-id="${equippedItem.id}" data-slot="${slotType}">
                            Unequip
                        </button>
                        ${this.renderElementalChoiceButton(equippedItem, slotType)}
                        ${this.renderEnchantmentSlots(character, slotType, equippedItem)}
                    </div>
                ` : `
                    <div class="empty-slot">Empty</div>
                `}
            </div>
        `
    }

    // Render enchantment slots for equipped items (weapons and armor only)
    renderEnchantmentSlots(character, slotType, equippedItem) {
        // Only weapons and armor can have enchantments
        if (slotType === 'accessory') {
            return ''
        }

        const maxSlots = equippedItem.enchantmentSlots || 0
        if (maxSlots === 0) {
            return ''
        }

        const equippedEnchantments = (character.equippedEnchantments && character.equippedEnchantments[slotType])
            ? character.equippedEnchantments[slotType]
            : []

        let slotsHtml = '<div class="enchantment-slots">'
        slotsHtml += '<div class="enchantment-label">Enchantments:</div>'

        for (let i = 0; i < maxSlots; i++) {
            const enchantmentId = equippedEnchantments[i]

            if (enchantmentId) {
                // Equipped enchantment - show icon with click to unequip
                const enchantment = this.findEnchantmentById(enchantmentId)
                if (enchantment) {
                    slotsHtml += `
                        <div class="enchantment-slot filled" 
                             data-enchantment-id="${enchantmentId}" 
                             data-slot="${slotType}"
                             title="${enchantment.name}: ${enchantment.desc}">
                            ${window.renderEnchantmentIcon ? window.renderEnchantmentIcon(enchantment, 16, 'enchantment-icon') : `<span class="enchantment-icon">${enchantment.icon}</span>`}
                        </div>
                    `
                }
            } else {
                // Empty slot - show empty square
                slotsHtml += `
                    <div class="enchantment-slot empty" 
                         data-slot="${slotType}" 
                         data-slot-index="${i}"
                         title="Empty enchantment slot - drag enchantment here">
                        <span class="empty-icon">?</span>
                    </div>
                `
            }
        }

        slotsHtml += '</div>'
        return slotsHtml
    }

    // Render elemental choice button for equipment
    renderElementalChoiceButton(equippedItem, slotType) {
        // Check if item has elemental choice effect
        if (!equippedItem.specialEffects || !equippedItem.specialEffects.some(effect => {
            const effectStr = effect.toString().toLowerCase()
            return effectStr.includes('choose resistance') ||
                effectStr.includes('choose element') ||
                effectStr.includes('elemental attunement') ||
                effectStr.includes('choose 1 element') ||
                effectStr.includes('elemental')
        })) {
            return ''
        }

        const currentResistance = equippedItem.elementalChoice?.resistance
        const currentWeakness = equippedItem.elementalChoice?.weakness

        let buttonText = 'Choose Element'
        let buttonClass = 'elemental-btn'
        let title = 'Choose elemental resistance (auto-applies opposing weakness)'
        let icon = '⚡'

        if (currentResistance && currentWeakness) {
            buttonText = `${currentResistance.charAt(0).toUpperCase() + currentResistance.slice(1)} Resist`
            buttonClass = 'elemental-btn chosen resistance'
            title = `Currently: ${currentResistance} resistance + ${currentWeakness} weakness`
            icon = this.getElementIcon(currentResistance)
        }

        return `
            <button class="${buttonClass}" 
                    data-slot="${slotType}" 
                    data-item-id="${equippedItem.id}"
                    title="${title}"
                    onclick="window.inventorySystem.showElementalSelectionDialog('${equippedItem.id}', '${slotType}')">
                ${icon} ${buttonText}
            </button>
        `
    }

    // Get element icon
    getElementIcon(element) {
        const elementIcons = {
            fire: '🔥',
            ice: '❄️',
            lightning: '⚡',
            water: '💧',
            earth: '🌍',
            wind: '🌪️',
            light: '☀️',
            dark: '🌑'
        }
        return elementIcons[element] || '⚡'
    }

    // Helper function to find which skill tree a skill belongs to
    findSkillTreeInfo(skillId) {
        // Search in main skill data
        if (typeof SKILLS_DATA !== 'undefined') {
            for (const [category, subcategories] of Object.entries(SKILLS_DATA)) {
                if (typeof subcategories === 'object' && subcategories !== null) {
                    for (const [subcategory, skills] of Object.entries(subcategories)) {
                        if (Array.isArray(skills)) {
                            const skill = skills.find(s => s.id === skillId)
                            if (skill) {
                                return {
                                    category: category,
                                    subcategory: subcategory,
                                    skill: skill
                                }
                            }
                        }
                    }
                }
            }
        }

        // Search in racial skill data
        if (typeof RACE_SKILL_TREES !== 'undefined') {
            for (const [race, raceData] of Object.entries(RACE_SKILL_TREES)) {
                if (raceData.skills && Array.isArray(raceData.skills)) {
                    const skill = raceData.skills.find(s => s.id === skillId)
                    if (skill) {
                        return {
                            category: 'racial',
                            subcategory: race,
                            skill: skill
                        }
                    }
                }
            }
        }

        return null
    }

    // Helper function to find enchantment by ID
    findEnchantmentById(enchantmentId) {
        if (typeof ENCHANTMENTS_DATA !== 'undefined') {
            if (ENCHANTMENTS_DATA.weapons && ENCHANTMENTS_DATA.weapons[enchantmentId]) {
                return ENCHANTMENTS_DATA.weapons[enchantmentId]
            }
            if (ENCHANTMENTS_DATA.armor && ENCHANTMENTS_DATA.armor[enchantmentId]) {
                return ENCHANTMENTS_DATA.armor[enchantmentId]
            }
        }

        // Check ITEMS_DATA for enchantment type items
        if (typeof window.ITEMS_DATA !== 'undefined') {
            // Search through each item category
            for (const categoryKey in window.ITEMS_DATA) {
                const category = window.ITEMS_DATA[categoryKey]
                for (const itemKey in category) {
                    const item = category[itemKey]
                    if (item.id === enchantmentId && item.type === 'enchantment') {
                        return item
                    }
                }
            }
        }

        return null
    }

    // Render inventory items
    renderInventoryItems(character) {
        if (!character.inventory) {
            return '<div class="empty-inventory">No items in inventory</div>'
        }



        // Handle both old array format and new object format
        let inventoryItems = []

        if (Array.isArray(character.inventory)) {
            // Old format - convert to new format
            inventoryItems = character.inventory
        } else {
            // New format - object with itemId: quantity
            for (const [itemId, quantity] of Object.entries(character.inventory)) {
                const itemData = this.findItemById(itemId)
                if (itemData) {
                    inventoryItems.push({
                        ...itemData,
                        quantity: quantity
                    })


                }
            }
        }

        if (inventoryItems.length === 0) {
            return '<div class="empty-inventory">No items in inventory</div>'
        }

        // Categorize items
        const categories = {
            equipment: [],
            enchantments: [],
            consumables: [],
            materials: [],
            other: []
        }

        inventoryItems.forEach(item => {
            if (item.type === 'weapon_enchantment' || item.type === 'armor_enchantment' || item.type === 'enchantment') {
                categories.enchantments.push(item)
            } else if (this.canEquipItem(item)) {
                categories.equipment.push(item)
            } else if (this.canUseItem(item)) {
                categories.consumables.push(item)
            } else if (item.type === 'material' || item.type === 'ingredient' ||
                item.category === 'material' || item.category === 'herb' ||
                item.category === 'ingredient') {
                categories.materials.push(item)
            } else {
                categories.other.push(item)
            }
        })

        // Render each category
        let html = ''

        // Equipment Section
        if (categories.equipment.length > 0) {
            html += `
                <div class="inventory-category">
                    <h4 class="category-header">Equipment</h4>
                    <div class="category-items">
                        ${this.renderCategoryItems(categories.equipment, character)}
                    </div>
                </div>
            `
        }

        // Enchantments Section
        if (categories.enchantments.length > 0) {
            html += `
                <div class="inventory-category">
                    <h4 class="category-header">Enchantments</h4>
                    <div class="category-items">
                        ${this.renderEnchantmentItems(categories.enchantments, character)}
                    </div>
                </div>
            `
        }

        // Consumables Section
        if (categories.consumables.length > 0) {
            html += `
                <div class="inventory-category">
                    <h4 class="category-header">Consumables</h4>
                    <div class="category-items">
                        ${this.renderCategoryItems(categories.consumables, character)}
                    </div>
                </div>
            `
        }

        // Materials Section
        if (categories.materials.length > 0) {
            html += `
                <div class="inventory-category">
                    <h4 class="category-header">Materials</h4>
                    <div class="category-items">
                        ${this.renderCategoryItems(categories.materials, character)}
                    </div>
                </div>
            `
        }

        // Other Items Section
        if (categories.other.length > 0) {
            html += `
                <div class="inventory-category">
                    <h4 class="category-header">Other</h4>
                    <div class="category-items">
                        ${this.renderCategoryItems(categories.other, character)}
                    </div>
                </div>
            `
        }

        return html
    }

    // Render items for a specific category
    renderCategoryItems(items, character) {
        return items.map(item => {
            // Check if this item is currently equipped
            const isEquipped = this.isItemEquipped(character, item.id)
            // Only show equipped styling if this is NOT in the equipment section
            const equippedClass = (isEquipped && !this.isEquipmentSection(item.type)) ? 'equipped' : ''
            const equippedSlot = isEquipped ? this.getEquippedSlot(character, item.id) : null

            // Determine item actions based on type
            const canEquip = this.canEquipItem(item)
            const canUse = this.canUseItem(item)
            const showQuantity = item.quantity && item.quantity > 1

            return `
                <div class="inventory-item ${item.type} ${item.rarity || 'common'} ${equippedClass}" data-item-id="${item.id}">
                    ${window.renderItemIcon ? window.renderItemIcon(item, 32, 'item-icon') : `<span class="item-icon">${item.icon || '??'}</span>`}
                    <div class="item-details">
                        <span class="item-name">
                            ${item.name}
                            <span class="item-type-tag" title="${this.getItemTypeDisplayName(item)}">${this.getItemTypeTag(item)}</span>
                        </span>
                        <span class="item-type">${this.formatItemType(item.type)}</span>
                        ${item.type === 'weapon' ? `<div class="weapon-damage-inventory">Damage: ${window.gameLogic ? window.gameLogic.getWeaponDamage(item) : (item.damage || 'No damage')}</div>` : ''}
                        ${item.category ? `<span class="item-category">${item.category}</span>` : ''}
                    </div>
                    <div class="item-status">
                        ${(isEquipped && !this.isEquipmentSection(item.type)) ? '<span class="equipped-indicator">EQUIPPED</span>' : ''}
                        ${showQuantity ? `<span class="item-quantity">x${item.quantity}</span>` : ''}
                        ${(isEquipped && !this.isEquipmentSection(item.type)) && showQuantity && item.quantity > 1 ? '<span class="equipped-note">(1 equipped, ' + (item.quantity - 1) + ' in bag)</span>' : ''}
                    </div>
                    <div class="item-actions">
                        ${canEquip ? `
                            ${isEquipped ? `
                                <button class="unequip-btn" data-item-id="${item.id}" data-slot="${equippedSlot}">Unequip</button>
                            ` : `
                                ${item.type === 'weapon' && this.hasDualWieldSkill(character) ? `
                                    <button class="equip-btn" data-item-id="${item.id}" data-slot="primaryWeapon">Equip Primary</button>
                                    <button class="equip-btn" data-item-id="${item.id}" data-slot="secondaryWeapon">Equip Secondary</button>
                                ` : `
                                    <button class="equip-btn" data-item-id="${item.id}">Equip</button>
                                `}
                            `}
                        ` : ''}
                        ${canUse ? `
                            <button class="use-btn" data-item-id="${item.id}">Use</button>
                        ` : ''}
                        ${item.sellable !== false ? `
                            <button class="sell-btn" data-item-id="${item.id}">Sell</button>
                        ` : ''}
                        <button class="drop-btn" data-item-id="${item.id}">Drop</button>
                    </div>
                </div>
            `
        }).join('')
    }

    // Render enchantment items with special buttons
    renderEnchantmentItems(items, character) {
        return items.map(item => {
            const showQuantity = item.quantity && item.quantity > 1

            return `
                <div class="inventory-item enchantment-item" data-item-id="${item.id}">
                    <div class="item-icon">
                        ${window.renderEnchantmentIcon ? window.renderEnchantmentIcon(item, 24, 'item-emoji') : `<span class="item-emoji">${item.icon}</span>`}
                    </div>
                    <div class="item-info">
                        <span class="item-name">${item.name}</span>
                        <span class="item-type">${this.getEnchantmentTypeDisplay(item)}</span>
                        ${item.category ? `<span class="item-category">${item.category}</span>` : ''}
                    </div>
                    <div class="item-status">
                        ${showQuantity ? `<span class="item-quantity">x${item.quantity}</span>` : ''}
                    </div>
                    <div class="item-actions">
                        ${this.renderEnchantmentButtons(item)}
                        ${item.sellable !== false ? `
                            <button class="sell-btn" data-item-id="${item.id}">Sell</button>
                        ` : ''}
                        <button class="drop-btn" data-item-id="${item.id}">Drop</button>
                    </div>
                </div>
            `
        }).join('')
    }

    // Check if character has dual wield skill
    hasDualWieldSkill(character) {
        if (!character.unlockedSkills || !character.unlockedSkills.weapons) {
            return false
        }

        // Check if dual_wield skill is unlocked in dagger skills
        return character.unlockedSkills.weapons.dagger &&
            character.unlockedSkills.weapons.dagger.includes('dual_wield')
    }

    // Helper function to get display text for enchantment type
    getEnchantmentTypeDisplay(item) {
        if (item.type === 'weapon_enchantment') {
            return 'Weapon Enchantment'
        } else if (item.type === 'armor_enchantment') {
            return 'Armor Enchantment'
        } else if (item.type === 'enchantment') {
            // For enchantment items, check the effect type
            if (item.effect && item.effect.type === 'weapon_enchant') {
                return 'Weapon Enchantment'
            } else if (item.effect && item.effect.type === 'armor_enchant') {
                return 'Armor Enchantment'
            } else if (item.effect && item.effect.type === 'stat_boost') {
                return 'Stat Enchantment'
            } else {
                return 'Enchantment'
            }
        }
        return 'Enchantment'
    }

    // Helper function to render appropriate enchantment buttons
    renderEnchantmentButtons(item) {
        let buttons = ''

        if (item.type === 'weapon_enchantment') {
            // Traditional weapon enchantments - only weapon button
            buttons += `<button class="equip-to-weapon-btn" data-enchantment-id="${item.id}">Equip to Weapon</button>`
        } else if (item.type === 'armor_enchantment') {
            // Traditional armor enchantments - only armor button
            buttons += `<button class="equip-to-armor-btn" data-enchantment-id="${item.id}">Equip to Armor</button>`
        } else if (item.type === 'enchantment') {
            // Enchantment items - check effect type
            if (item.effect && item.effect.type === 'weapon_enchant') {
                // Weapon enchantment - only weapon button
                buttons += `<button class="equip-to-weapon-btn" data-enchantment-id="${item.id}">Equip to Weapon</button>`
            } else if (item.effect && item.effect.type === 'armor_enchant') {
                // Armor enchantment - only armor button
                buttons += `<button class="equip-to-armor-btn" data-enchantment-id="${item.id}">Equip to Armor</button>`
            } else if (item.effect && item.effect.type === 'stat_boost') {
                // Stat enchantment - both buttons
                buttons += `<button class="equip-to-weapon-btn" data-enchantment-id="${item.id}">Equip to Weapon</button>`
                buttons += `<button class="equip-to-armor-btn" data-enchantment-id="${item.id}">Equip to Armor</button>`
            } else {
                // Unknown enchantment type - both buttons for safety
                buttons += `<button class="equip-to-weapon-btn" data-enchantment-id="${item.id}">Equip to Weapon</button>`
                buttons += `<button class="equip-to-armor-btn" data-enchantment-id="${item.id}">Equip to Armor</button>`
            }
        } else {
            // Fallback - both buttons
            buttons += `<button class="equip-to-weapon-btn" data-enchantment-id="${item.id}">Equip to Weapon</button>`
            buttons += `<button class="equip-to-armor-btn" data-enchantment-id="${item.id}">Equip to Armor</button>`
        }

        return buttons
    }

    // Helper function to find item by ID (including enchantments)
    findItemById(itemId) {
        // First check regular items
        const regularItem = window.findItemById ? window.findItemById(itemId) : null
        if (regularItem) {
            return regularItem
        }

        // Check enchantments data
        return this.findEnchantmentById(itemId)
    }

    // Check if an item can be equipped
    canEquipItem(item) {
        return item.type === 'weapon' || item.type === 'armor' || item.type === 'accessory' ||
            item.type === 'craftable_weapon' || item.type === 'craftable_armor' ||
            item.type === 'tool' || item.type === 'artifact'
    }

    // Check if an item can be used/consumed
    canUseItem(item) {
        // Enchantments should not show "Use" button - they are equipped to equipment slots
        if (item.type === 'weapon_enchantment' || item.type === 'armor_enchantment' || item.type === 'enchantment') {
            return false
        }

        return item.type === 'consumable' || item.type === 'herb' ||
            item.type === 'food' || item.effect
    }

    // Helper function to check if an item is equipped
    isItemEquipped(character, itemId) {
        if (!character.equipped) return false

        // First try exact ID match
        let isEquipped = Object.values(character.equipped).some(equippedItem =>
            equippedItem && equippedItem.id === itemId
        )

        // If not found by ID, try to find by name (for items that might have different IDs)
        if (!isEquipped) {
            const itemData = this.findItemById(itemId)
            if (itemData) {
                isEquipped = Object.values(character.equipped).some(equippedItem =>
                    equippedItem && equippedItem.name === itemData.name
                )
            }
        }

        return isEquipped
    }

    // Helper function to get the slot where an item is equipped
    getEquippedSlot(character, itemId) {
        if (!character.equipped) return null

        // First try exact ID match
        for (const [slot, equippedItem] of Object.entries(character.equipped)) {
            if (equippedItem && equippedItem.id === itemId) {
                return slot
            }
        }

        // If not found by ID, try to find by name
        const itemData = this.findItemById(itemId)
        if (itemData) {
            for (const [slot, equippedItem] of Object.entries(character.equipped)) {
                if (equippedItem && equippedItem.name === itemData.name) {
                    return slot
                }
            }
        }

        return null
    }

    // Render status effects
    renderStatusEffects(character) {
        if (!character.statusEffects || character.statusEffects.length === 0) {
            return '<div class="no-effects">No active effects</div>'
        }

        return character.statusEffects.map(effect => {
            const statusData = STATUS_EFFECTS_DATA[effect.id]
            if (!statusData) return ''

            const effectClass = this.getStatusEffectClass(statusData.type)
            const durationBar = this.renderDurationBar(effect.duration, statusData.duration)

            return `
                <div class="status-effect ${effectClass}" data-effect-id="${effect.id}">
                    <div class="effect-header">
                        <span class="effect-icon" title="${statusData.desc}">${statusData.icon}</span>
                        <div class="effect-info">
                            <span class="effect-name">${statusData.name}</span>
                            <span class="effect-turns">${effect.duration}/${statusData.duration} turns</span>
                        </div>
                        <button class="remove-effect-btn" data-effect-id="${effect.id}" title="Remove effect (testing)">X</button>
                    </div>
                    <div class="effect-description">${statusData.desc}</div>
                    <div class="effect-details">
                        ${this.renderEffectDetails(statusData, effect)}
                    </div>
                    <div class="duration-bar">
                        ${durationBar}
                    </div>
                </div>
            `
        }).join('')
    }

    // Get CSS class for status effect type
    getStatusEffectClass(type) {
        const typeMap = {
            'damageOverTime': 'effect-damage',
            'control': 'effect-control',
            'buff': 'effect-buff',
            'debuff': 'effect-debuff',
            'heal': 'effect-heal'
        }
        return typeMap[type] || 'effect-neutral'
    }

    // Render duration bar visual
    renderDurationBar(currentDuration, maxDuration) {
        const percentage = (currentDuration / maxDuration) * 100
        const barClass = percentage > 60 ? 'duration-high' : percentage > 30 ? 'duration-medium' : 'duration-low'

        return `
            <div class="duration-progress">
                <div class="duration-fill ${barClass}" style="width: ${percentage}%"></div>
            </div>
        `
    }

    // Render specific effect details
    renderEffectDetails(statusData, effect) {
        let details = []

        if (statusData.potency > 0) {
            if (statusData.type === 'damageOverTime') {
                details.push(`${statusData.potency} damage per turn`)
            } else if (statusData.type === 'buff') {
                details.push(`+${statusData.potency} bonus`)
            } else if (statusData.type === 'debuff') {
                details.push(`-${statusData.potency} penalty`)
            } else if (statusData.type === 'heal') {
                details.push(`+${statusData.potency} healing per turn`)
            }
        }

        if (statusData.stackable && effect.stacks > 1) {
            details.push(`Stacked ${effect.stacks}x`)
        }

        if (statusData.type === 'control') {
            details.push(`Action restricted`)
        }

        return details.length > 0 ? `<div class="effect-mechanics">${details.join(' - ')}</div>` : ''
    }

    // Render shop items for testing
    renderShopItems() {
        const shopItems = [
            'iron_sword', 'flame_blade', 'leather_armor', 'plate_mail',
            'power_ring', 'health_potion', 'stamina_potion'
        ]

        return shopItems.map(itemId => {
            const item = findItemById(itemId)
            if (!item) return ''

            return `
                <div class="shop-item" data-item-id="${itemId}">
                    ${window.renderItemIcon ? window.renderItemIcon(item, 24, 'item-icon') : `<span class="item-icon">${item.icon}</span>`}
                    <span class="item-name">${item.name}</span>
                    <span class="item-price">${item.value}L</span>
                    <button class="buy-btn" data-item-id="${itemId}">Buy</button>
                </div>
            `
        }).join('')
    }

    // Render shop items by specific category
    renderShopItemsByCategory(itemIds) {
        const character = characterManager.getCurrentCharacter()
        if (!character) return ''

        return itemIds.map(itemId => {
            const item = findItemById(itemId)
            if (!item) return ''

            const canAfford = characterManager.canAfford(character, item.price)

            return `
                <div class="shop-item" data-item-id="${itemId}">
                    <div class="item-header">
                        ${window.renderItemIcon ? window.renderItemIcon(item, 24, 'item-icon') : `<span class="item-icon">${item.icon}</span>`}
                        <span class="item-name">
                            ${item.name}
                            <span class="item-type-tag" title="${this.getItemTypeDisplayName(item)}">${this.getItemTypeTag(item)}</span>
                        </span>
                    </div>
                    ${item.type === 'weapon' ? `<div class="weapon-damage">?? ${window.gameLogic ? window.gameLogic.getWeaponDamage(item) : (item.damage || 'No damage')}</div>` : ''}
                    <button class="buy-btn ${canAfford ? '' : 'disabled'}" data-item-id="${itemId}" ${canAfford ? '' : 'disabled'}>
                        ${canAfford ? 'Buy' : 'Too Expensive'}
                    </button>
                </div>
            `
        }).join('')
    }

    // Render item stats for shop display
    renderItemStats(item) {
        if (!item.statModifiers) return ''

        return Object.entries(item.statModifiers)
            .filter(([stat, value]) => value !== 0)
            .map(([stat, value]) => {
                const sign = value > 0 ? '+' : ''
                const statName = this.getStatDisplayName(stat)
                return `<span class="stat-bonus">${sign}${value} ${statName}</span>`
            })
            .join(' ')
    }

    // Get display name for stats
    getStatDisplayName(stat) {
        const statNames = {
            hp: 'HP',
            stamina: 'Stamina',
            strength: 'STR',
            magicPower: 'MP',
            speed: 'SPD',
            physicalDefence: 'PDEF',
            magicalDefence: 'MDEF'
        }
        return statNames[stat] || stat
    }

    // Equip an item
    equipItem(itemId, targetSlot = null) {
        let character = characterManager.getCurrentCharacter()
        console.log('[DEBUG] equipItem called. Character before equip:', JSON.parse(JSON.stringify(character)))
        if (!character || !window.inventorySystem) return

        if (window.inventorySystem.equipItem(character, itemId, targetSlot)) {
            // Reload character from storage to get latest state
            character = characterManager.loadCharacter(character.id)
            console.log('[DEBUG] equipItem success. Character after equip:', JSON.parse(JSON.stringify(character)))
            const item = window.findItemById ? window.findItemById(itemId) : null
            this.showMessage(`Equipped ${item?.name || 'item'}`, 'success')
            this.updateDisplay()
        } else {
            console.log('[DEBUG] equipItem failed.')
            this.showMessage('Failed to equip item', 'error')
        }
    }

    // Unequip an item
    unequipItem(slot) {
        let character = characterManager.getCurrentCharacter()
        console.log('[DEBUG] unequipItem called. Character before unequip:', JSON.parse(JSON.stringify(character)))
        if (!character || !window.inventorySystem) return

        const item = character.equipped[slot]
        if (window.inventorySystem.unequipItem(character, slot)) {
            // Reload character from storage to get latest state
            character = characterManager.loadCharacter(character.id)
            console.log('[DEBUG] unequipItem success. Character after unequip:', JSON.parse(JSON.stringify(character)))
            this.showMessage(`Unequipped ${item?.name}`, 'success')
            this.updateDisplay()
        } else {
            console.log('[DEBUG] unequipItem failed.')
            this.showMessage('Failed to unequip item', 'error')
        }
    }

    // Use a consumable
    useConsumable(itemId) {
        const character = characterManager.getCurrentCharacter()
        if (!character || !window.inventorySystem) return

        if (window.inventorySystem.useConsumable(character, itemId)) {
            this.showMessage(`Used ${findItemById(itemId)?.name}`, 'success')
            this.updateDisplay()
        } else {
            this.showMessage('Failed to use item', 'error')
        }
    }

    // Drop an item
    dropItem(itemId) {
        const character = characterManager.getCurrentCharacter()
        if (!character || !window.inventorySystem) return

        const item = findItemById(itemId)
        if (!item) return

        // Get current quantity in inventory
        let currentQuantity = 1
        if (Array.isArray(character.inventory)) {
            const inventoryItem = character.inventory.find(invItem => invItem.id === itemId)
            currentQuantity = inventoryItem?.quantity || 1
        } else {
            const inventoryItem = character.inventory[itemId]
            currentQuantity = inventoryItem?.quantity || 1
        }

        let quantityToDrop = 1

        // If item is stackable and we have more than 1, ask how many to drop
        if (item.stackable && currentQuantity > 1) {
            const userInput = prompt(`How many ${item.name} do you want to drop? (Max: ${currentQuantity})`, '1')
            if (userInput === null) return // User cancelled

            quantityToDrop = parseInt(userInput)
            if (isNaN(quantityToDrop) || quantityToDrop < 1) {
                this.showMessage('Invalid quantity', 'error')
                return
            }
            if (quantityToDrop > currentQuantity) {
                quantityToDrop = currentQuantity
            }
        }

        // Confirm the drop
        const dropText = quantityToDrop === 1 ?
            `Drop ${item.name}?` :
            `Drop ${quantityToDrop} ${item.name}?`

        if (confirm(dropText)) {
            if (window.inventorySystem.removeItem(character, itemId, quantityToDrop)) {
                const resultText = quantityToDrop === 1 ?
                    `Dropped ${item.name}` :
                    `Dropped ${quantityToDrop} ${item.name}`
                this.showMessage(resultText, 'success')
                this.updateDisplay()
            }
        }
    }

    // Sell an item
    sellItem(itemId) {
        const character = characterManager.getCurrentCharacter()
        if (!character || !window.inventorySystem) return

        const item = findItemById(itemId)
        if (!item) return

        // Check if item is sellable
        if (item.sellable === false) {
            this.showMessage('This item cannot be sold', 'error')
            return
        }

        // Get current quantity in inventory
        let currentQuantity = 1
        if (Array.isArray(character.inventory)) {
            const inventoryItem = character.inventory.find(invItem => invItem.id === itemId)
            currentQuantity = inventoryItem?.quantity || 1
        } else {
            const inventoryItem = character.inventory[itemId]
            currentQuantity = inventoryItem?.quantity || 1
        }

        let quantityToSell = 1

        // If item is stackable and we have more than 1, ask how many to sell
        if (item.stackable && currentQuantity > 1) {
            const userInput = prompt(`How many ${item.name} do you want to sell? (Max: ${currentQuantity})`, '1')
            if (userInput === null) return // User cancelled

            quantityToSell = parseInt(userInput)
            if (isNaN(quantityToSell) || quantityToSell < 1) {
                this.showMessage('Invalid quantity', 'error')
                return
            }
            if (quantityToSell > currentQuantity) {
                quantityToSell = currentQuantity
            }
        }

        // Calculate sell price (50% of buy price)
        let basePrice = typeof item.price === 'number' ? item.price : 0

        // If no price is defined, generate one based on rarity and type
        if (!basePrice) {
            const fallbackPrices = {
                common: 10,
                uncommon: 50,
                rare: 200,
                epic: 500,
                legendary: 1000
            }

            const typeMultipliers = {
                weapon: 3,
                armor: 2.5,
                accessory: 2,
                consumable: 0.5,
                herb: 0.3,
                food: 0.4,
                material: 0.2,
                ingredient: 0.1
            }

            basePrice = fallbackPrices[item.rarity] || fallbackPrices.common
            const multiplier = typeMultipliers[item.type] || 1
            basePrice = Math.max(1, Math.floor(basePrice * multiplier))
        }

        // Calculate total sell price (50% of buy price)
        const totalSellPrice = Math.floor((basePrice * quantityToSell) / 2)

        // Confirm the sale
        const sellText = quantityToSell === 1 ?
            `Sell ${item.name} for ${totalSellPrice} Gil?` :
            `Sell ${quantityToSell} ${item.name} for ${totalSellPrice} Gil?`

        if (confirm(sellText)) {
            if (window.inventorySystem.removeItem(character, itemId, quantityToSell)) {
                // Add Gil to character
                characterManager.addGil(character, totalSellPrice)

                const resultText = quantityToSell === 1 ?
                    `Sold ${item.name} for ${totalSellPrice} Gil` :
                    `Sold ${quantityToSell} ${item.name} for ${totalSellPrice} Gil`
                this.showMessage(resultText, 'success')
                this.updateDisplay()
            }
        }
    }

    // Buy an item
    buyItem(itemId) {
        const character = characterManager.getCurrentCharacter()
        if (!character) {
            return
        }
        if (!window.inventorySystem) {
            return
        }

        const item = findItemById(itemId)
        if (!item) {
            return
        }

        // Atomic purchase operation - check and deduct in one step
        const success = characterManager.deductGil(character, item.price)
        if (success) {
            window.inventorySystem.addItem(character, itemId)
            this.showMessage(`Bought ${item.name} for ${characterManager.formatGil(item.price)}`, 'success')
            this.updateDisplay()
        } else {
            this.showMessage('Not enough Gil', 'error')
        }
    }

    // Adjust Gil (for testing/admin purposes)
    adjustCurrency(currencyType, amount) {
        const character = characterManager.getCurrentCharacter()
        if (!character) return

        // Only handle Gil adjustments now
        if (currencyType === 'gil') {
            characterManager.adjustGil(character, amount)
            this.updateDisplay()

            const action = amount > 0 ? 'Added' : 'Removed'
            this.showMessage(`${action} ${Math.abs(amount)} Gil`, 'info')
        }
    }

    // Process status effects (testing)
    processStatusEffects() {
        // Debounce check to prevent double processing
        const now = Date.now()
        if (this._lastProcessTurn && (now - this._lastProcessTurn < 500)) {
            console.log('Process turn debounced - too soon since last call')
            return
        }
        this._lastProcessTurn = now

        console.log('Processing status effects turn at:', new Date().toISOString())

        const character = characterManager.getCurrentCharacter()
        if (!character || !window.inventorySystem) return

        window.inventorySystem.processStatusEffects(character)
        this.showMessage('Processed status effects', 'success')
        this.updateDisplay()
    }

    // Add status effect for testing
    addTestStatusEffect(effectId) {
        const character = characterManager.getCurrentCharacter()
        if (!character || !window.inventorySystem) return

        if (window.inventorySystem.addStatusEffect(character, effectId)) {
            this.showMessage(`Added ${effectId} effect`, 'success')
            this.updateDisplay()
        }
    }

    // Toggle status effect (add if not present, remove if present)
    toggleStatusEffect(effectId) {
        const character = characterManager.getCurrentCharacter()

        // Early return checks
        if (!character) {
            return
        }

        if (!window.inventorySystem) {
            return
        }

        // Ensure status effects array exists
        if (!character.statusEffects) {
            character.statusEffects = []
        }

        // Get current effect state
        const hasEffect = character.statusEffects.some(effect => effect.id === effectId)

        // Debounce check to prevent double toggling
        const now = Date.now()
        if (this._lastToggle && this._lastToggle[effectId] && (now - this._lastToggle[effectId] < 500)) {
            return
        }
        this._lastToggle = this._lastToggle || {}
        this._lastToggle[effectId] = now

        if (hasEffect) {
            // Remove the effect
            character.statusEffects = character.statusEffects.filter(effect => effect.id !== effectId)
            window.inventorySystem.applyEquipmentStats(character) // Recalculate stats
            characterManager.saveCharacter(character)
            this.showMessage(`Removed ${STATUS_EFFECTS_DATA[effectId].name}`, 'info')
        } else {
            // Check if the effect can be applied
            const validation = StatusEffectManager.validateEffectApplication(character.id, effectId, character)

            if (!validation.valid) {
                this.showMessage(`Cannot apply ${effectId}: ${validation.reason}`, 'error')
                return
            }

            // Add the effect using inventory system
            if (window.inventorySystem.addStatusEffect(character, effectId)) {
                this.showMessage(`Added ${STATUS_EFFECTS_DATA[effectId].name}`, 'success')
            }
        }

        // Single update at the end
        this.updateDisplay()
    }

    // Toggle skill activation (add if not active, remove if active)
    toggleSkill(skillId) {
        // Prevent rapid double-clicking
        if (this.toggleInProgress) return
        this.toggleInProgress = true

        const character = characterManager.getCurrentCharacter()
        if (!character) {
            this.toggleInProgress = false
            return
        }

        // Toggle the skill using character manager
        if (characterManager.toggleSkill(character.id, skillId)) {
            const isNowToggled = characterManager.isSkillToggled(character.id, skillId)
            const skill = findSkillById(skillId)

            if (skill) {
                this.showMessage(
                    `${skill.name} ${isNowToggled ? 'activated' : 'deactivated'}`,
                    'success'
                )
            }

            // Update display to show new toggle state and stat changes
            this.updateDisplay()
        } else {
            this.showMessage('Failed to toggle skill', 'error')
        }

        // Reset flag after a short delay to prevent rapid clicking
        setTimeout(() => {
            this.toggleInProgress = false
        }, 100)
    }

    // Clear all status effects
    clearAllStatusEffects() {
        // Debounce check to prevent double clearing
        const now = Date.now()
        if (this._lastClearAll && (now - this._lastClearAll < 500)) {
            return
        }
        this._lastClearAll = now

        const character = characterManager.getCurrentCharacter()
        if (!character) return

        if (character.statusEffects && character.statusEffects.length > 0) {
            character.statusEffects = []
            characterManager.saveCharacter(character)
            this.showMessage('Cleared all status effects', 'success')
            this.updateDisplay()
        }
    }

    // Check if a status effect button should be disabled due to immunities
    isStatusEffectDisabled(effectId, character) {
        if (!character.statusEffects) return false

        // Check immunities from active effects
        for (const activeEffect of character.statusEffects) {
            const immunities = StatusEffectManager.getImmunities(activeEffect.id)
            if (immunities.includes(effectId)) {
                return true
            }
        }

        // Check if effect doesn't stack and is already active
        if (!StatusEffectManager.canStack(effectId)) {
            const hasEffect = character.statusEffects.some(effect => effect.id === effectId)
            if (hasEffect) {
                return false // Not disabled, but will be removed when clicked
            }
        }

        return false
    }

    // Get the display class for a status effect button
    getStatusEffectButtonClass(effectId, character) {
        let classes = 'btn btn-small status-btn'

        if (!character.statusEffects) return classes

        const hasEffect = character.statusEffects.some(effect => effect.id === effectId)
        const isDisabled = this.isStatusEffectDisabled(effectId, character)

        if (hasEffect) {
            classes += ' active'
        }

        if (isDisabled) {
            classes += ' disabled'
        }

        return classes
    }

    // Remove status effect for testing
    removeStatusEffect(effectId) {
        const character = characterManager.getCurrentCharacter()
        if (!character) return

        // Find and remove the effect
        const effectIndex = character.statusEffects.findIndex(effect => effect.id === effectId)
        if (effectIndex !== -1) {
            const removedEffect = character.statusEffects.splice(effectIndex, 1)[0]
            characterManager.saveCharacter(character)
            this.showMessage(`Removed ${removedEffect.id} effect`, 'success')
            this.updateDisplay()
        }
    }

    // Initialize skills search and filter functionality
    initializeSkillsFilter() {
        const searchInput = document.getElementById('skills-search')
        const categoryFilter = document.getElementById('skills-category-filter')
        const tierFilter = document.getElementById('skills-tier-filter')
        const typeFilter = document.getElementById('skills-type-filter')
        const sortSelect = document.getElementById('skills-sort')

        if (!searchInput || !categoryFilter || !tierFilter || !typeFilter || !sortSelect) return

        // Debounce function for search
        let searchTimeout
        const debounce = (func, delay) => {
            return (...args) => {
                clearTimeout(searchTimeout)
                searchTimeout = setTimeout(() => func.apply(this, args), delay)
            }
        }

        // Filter and search function
        const filterSkills = debounce(() => {
            const searchTerm = searchInput.value.toLowerCase()
            const categoryFilter = document.getElementById('skills-category-filter').value
            const tierFilter = document.getElementById('skills-tier-filter').value
            const typeFilter = document.getElementById('skills-type-filter').value
            const sortBy = document.getElementById('skills-sort').value

            const skillCards = document.querySelectorAll('.skill-card')
            let visibleCards = []

            skillCards.forEach(card => {
                const skillName = card.dataset.skillName.toLowerCase()
                const skillDesc = card.dataset.skillDesc.toLowerCase()
                const category = card.dataset.category
                const tier = card.dataset.skillTier
                const isToggleSkill = card.classList.contains('toggle-skill')

                // Search filter
                const matchesSearch = searchTerm === '' ||
                    skillName.includes(searchTerm) ||
                    skillDesc.includes(searchTerm)

                // Category filter
                const matchesCategory = categoryFilter === 'all' || category === categoryFilter

                // Tier filter
                const matchesTier = tierFilter === 'all' || tier === tierFilter

                // Type filter
                const matchesType = typeFilter === 'all' ||
                    (typeFilter === 'toggle' && isToggleSkill) ||
                    (typeFilter === 'passive' && !isToggleSkill)

                // Show/hide card
                if (matchesSearch && matchesCategory && matchesTier && matchesType) {
                    card.style.display = 'block'
                    visibleCards.push(card)
                } else {
                    card.style.display = 'none'
                }
            })

            // Sort visible cards
            this.sortSkillCards(visibleCards, sortBy)

            // Update no results message
            this.updateNoResultsMessage(visibleCards.length)
        }, 300)

        // Add event listeners
        searchInput.addEventListener('input', filterSkills)
        categoryFilter.addEventListener('change', filterSkills)
        tierFilter.addEventListener('change', filterSkills)
        typeFilter.addEventListener('change', filterSkills)
        sortSelect.addEventListener('change', filterSkills)
    }

    // Sort skill cards by selected criteria
    sortSkillCards(cards, sortBy) {
        const container = document.querySelector('.skills-card-grid')
        if (!container) return

        cards.sort((a, b) => {
            switch (sortBy) {
                case 'name':
                    return a.dataset.skillName.localeCompare(b.dataset.skillName)
                case 'tier':
                    return parseInt(a.dataset.skillTier) - parseInt(b.dataset.skillTier)
                case 'category':
                default:
                    const catCompare = a.dataset.category.localeCompare(b.dataset.category)
                    if (catCompare === 0) {
                        return a.dataset.subcategory.localeCompare(b.dataset.subcategory)
                    }
                    return catCompare
            }
        })

        // Reorder in DOM
        cards.forEach(card => container.appendChild(card))
    }

    // Render elemental resistances for characters with elemental skills
    renderElementalResistances(character) {
        if (!window.MONSTER_SYSTEM) {
            return '<div class="elemental-affinities-section"><h4>?? DEBUG: MONSTER_SYSTEM not available</h4></div>'
        }

        // Get all unlocked skills from all categories (flatten the structure)
        const allUnlockedSkills = characterManager.getAllUnlockedSkillIds(character)

        // Get skills that have elemental affinities
        const elementalSkills = allUnlockedSkills.filter(skillId => {
            const hasAffinity = window.MONSTER_SYSTEM.elementalAffinities[skillId]
            return hasAffinity
        })

        // Get combined elemental profile from both skills and equipment
        const profile = window.MONSTER_SYSTEM.calculateCombinedElementalProfile(character)

        if (!profile) {
            return `
                <div class="elemental-affinities-section">
                    <div class="affinities-header">
                        <div class="affinities-icon">🌪️</div>
                        <h4>Elemental Affinities</h4>
                    </div>
                    <div class="affinities-content">
                        <div class="no-affinities">
                            <div class="no-affinities-icon">⚪</div>
                            <span class="no-affinities-text">No elemental resistances or weaknesses</span>
                        </div>
                    </div>
                </div>
            `
        }

        // Create source information showing skills, equipment, and racial traits
        const sourceInfo = []
        if (profile.sources.skills.length > 0) {
            const skillNames = profile.sources.skills.map(skillId => {
                const skill = getAllSkills().find(s => s.id === skillId)
                return skill ? skill.name : skillId
            }).join(', ')
            sourceInfo.push(`<span class="source-item skills-source">🎯 Skills: ${skillNames}</span>`)
        }
        if (profile.sources.equipment.length > 0) {
            const equipNames = profile.sources.equipment.map(itemId => {
                // Get item name from ITEMS_DATA if available
                const item = this.findItemById(itemId)
                return item ? item.name : itemId
            }).join(', ')
            sourceInfo.push(`<span class="source-item equipment-source">⚔️ Equipment: ${equipNames}</span>`)
        }
        if (profile.sources.racial && profile.sources.racial.length > 0) {
            const racialTraits = profile.sources.racial.map(raceElement => {
                const [race, element] = raceElement.split('_')
                const raceData = window.RACES_DATA?.[race]
                const raceName = raceData ? raceData.name : race
                if (race === 'dragonborn') {
                    return `${raceName} Scaled Hide (${element})`
                } else if (race === 'tiefling' && element === 'fire') {
                    return `${raceName} Infernal Heritage`
                } else if (race === 'drow' && element === 'poison') {
                    return `${raceName} Poison Immunity`
                } else {
                    return `${raceName} (${element})`
                }
            }).join(', ')
            sourceInfo.push(`<span class="source-item racial-source">👤 Racial: ${racialTraits}</span>`)
        }
        if (profile.sources.statusEffects && profile.sources.statusEffects.length > 0) {
            const statusEffectNames = profile.sources.statusEffects.map(effectId => {
                const [element, type] = effectId.split('_')
                const elementName = element.charAt(0).toUpperCase() + element.slice(1)
                const typeName = type === 'resistance' ? 'Resistance' : 'Weakness'
                return `${elementName} ${typeName}`
            }).join(', ')
            sourceInfo.push(`<span class="source-item status-source">✨ Status Effects: ${statusEffectNames}</span>`)
        }

        // Helper function to render resistance level with modifiers
        const renderResistanceLevel = (elements, level, className, icon, color) => {
            if (elements.length === 0) return ''

            const elementList = elements.map(element => {
                const modifier = profile.modifiers[element]
                const percentage = this.getResistancePercentage(modifier)
                const elementIcon = this.getElementIcon(element)
                return `
                    <div class="element-card ${className}-element" style="border-color: ${color}">
                        <div class="element-icon">${elementIcon}</div>
                        <div class="element-info">
                            <div class="element-name">${element.charAt(0).toUpperCase() + element.slice(1)}</div>
                            <div class="element-percentage" style="color: ${color}">${percentage}</div>
                        </div>
                    </div>
                `
            }).join('')

            return `
                <div class="affinity-category ${className}-category">
                    <div class="category-header" style="border-color: ${color}">
                        <div class="category-icon">${icon}</div>
                        <span class="category-label">${level}</span>
                    </div>
                    <div class="element-grid">
                        ${elementList}
                    </div>
                </div>
            `
        }

        return `
            <div class="elemental-affinities-section">
                <div class="affinities-header">
                    <div class="affinities-icon">🌪️</div>
                    <h4>Elemental Affinities</h4>
                </div>
                <div class="affinities-content">
                    ${renderResistanceLevel(profile.immunities, 'Immunity', 'immunity', '🛡️', '#00ff88')}
                    ${renderResistanceLevel(profile.resistances, 'Resist', 'resist', '🛡️', '#00ccff')}
                    ${renderResistanceLevel(profile.minorResistances, 'Minor Resist', 'minor-resist', '🛡️', '#66ccff')}
                    ${renderResistanceLevel(profile.weaknesses, 'Weak', 'weak', '⚠️', '#ffaa00')}
                    ${renderResistanceLevel(profile.criticalWeaknesses, 'Critical Weak', 'critical-weak', '💀', '#ff4400')}
                    ${renderResistanceLevel(profile.instantKills, 'Instant Kill', 'instant-kill', '☠️', '#ff0000')}
                </div>
                ${sourceInfo.length > 0 ? `
                    <div class="affinities-sources">
                        ${sourceInfo.join('')}
                    </div>
                ` : ''}
            </div>
        `
    }

    // Helper function to convert modifier to percentage display
    getResistancePercentage(modifier) {
        if (modifier <= -3) return 'IMMUNE'
        if (modifier === -2) return '25%'
        if (modifier === -1) return '50%'
        if (modifier === 0) return '100%'
        if (modifier === 1) return '200%'
        if (modifier === 2) return '400%'
        if (modifier >= 3) return 'INSTANT KILL'
        return '100%'
    }

    // Get appropriate icon for element type
    getElementIcon(element) {
        // Map element names to icon mapping system
        const elementMappings = {
            fire: 'fire',
            ice: 'ice',
            water: 'water',
            lightning: 'lightning',
            earth: 'earth',
            wind: 'wind',
            poison: 'necromancy', // Use necromancy icon for poison
            light: 'light',
            darkness: 'darkness',
            shadow: 'shadow'
        }

        const iconName = elementMappings[element.toLowerCase()]
        if (iconName) {
            return iconMapper.createIconElement('magic', iconName, 16)
        }

        // Fallback to a generic magic icon
        return iconMapper.createIconElement('magic', 'elemental', 16)
    }

    // Helper function to find item by ID
    // Update no results message
    updateNoResultsMessage(visibleCount) {
        let noResultsMsg = document.querySelector('.no-results-message')

        if (visibleCount === 0) {
            if (!noResultsMsg) {
                noResultsMsg = document.createElement('div')
                noResultsMsg.className = 'no-results-message'
                noResultsMsg.innerHTML = '?? No skills match your current filters'
                document.querySelector('.skills-content').appendChild(noResultsMsg)
            }
            noResultsMsg.style.display = 'block'
        } else if (noResultsMsg) {
            noResultsMsg.style.display = 'none'
        }
    }

    // Render Crafting Tab
    renderCrafting() {
        const character = characterManager.getCurrentCharacter()
        const craftingContent = document.getElementById('crafting-content')

        if (!character) {
            craftingContent.innerHTML = `
                <div class="no-character-content">
                    <h3>No Character Selected</h3>
                    <p>Please select a character to view crafting options.</p>
                </div>
            `
            return
        }

        craftingContent.innerHTML = `
            <div class="crafting-container">
                <div class="crafting-header">
                    <h2>⚒️ Crafting & Professions</h2>
                    <p>Create powerful items using materials from defeated monsters</p>
                </div>
                
                <div class="profession-tabs">
                    <button class="profession-tab active" data-profession="smithing">🔨 Smithing</button>
                    <button class="profession-tab" data-profession="alchemy">🧪 Alchemy</button>
                    <button class="profession-tab" data-profession="enchanting">✨ Enchanting</button>
                </div>
                
                <div class="profession-content">
                    ${this.renderProfessionItems(character, 'smithing')}
                </div>
            </div>
        `

        // Add event listeners for profession tabs
        document.querySelectorAll('.profession-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                const profession = e.target.dataset.profession
                this.switchProfessionTab(profession, character)
            })
        })

        // Initialize crafting tooltips for initial content (smithing)
        setTimeout(() => this.initializeCraftingTooltips(), 100)
    }

    // Switch between profession tabs
    switchProfessionTab(profession, character) {
        // Update tab buttons
        document.querySelectorAll('.profession-tab').forEach(tab => {
            tab.classList.toggle('active', tab.dataset.profession === profession)
        })

        // Update content
        const professionContent = document.querySelector('.profession-content')
        professionContent.innerHTML = this.renderProfessionItems(character, profession)

        // Initialize crafting tooltips after content is rendered
        setTimeout(() => {
            this.initializeCraftingTooltips()
            // Re-attach events if the function exists
            if (professionContent._attachTooltipEvents) {
                professionContent._attachTooltipEvents()
            }
        }, 100)
    }

    // Render profession items for a specific profession
    renderProfessionItems(character, profession) {
        if (!window.ITEMS_DATA) {
            return `
                <div class="profession-section">
                    <h3>${this.getProfessionIcon(profession)} ${this.capitalizeFirst(profession)}</h3>
                    <p>Items data not loaded.</p>
                </div>
            `
        }

        // Find all craftable items for this profession from ITEMS_DATA
        const craftableItems = []

        // Search through all item categories (weapons, armor, accessories)
        for (const categoryKey in window.ITEMS_DATA) {
            const category = window.ITEMS_DATA[categoryKey]
            for (const itemKey in category) {
                const item = category[itemKey]
                if (item.craftableItem && item.craftingCategory && item.craftingCategory.toLowerCase() === profession.toLowerCase()) {
                    craftableItems.push({
                        ...item,
                        category: categoryKey
                    })
                }
            }
        }

        if (craftableItems.length === 0) {
            return `
                <div class="profession-section">
                    <h3>${this.getProfessionIcon(profession)} ${this.capitalizeFirst(profession)}</h3>
                    <div class="profession-description">${this.getProfessionDescription(profession)}</div>
                    <p>No craftable items found for ${profession}.</p>
                </div>
            `
        }

        // Group items by subcategory for better organization
        const itemsBySubcategory = {}
        craftableItems.forEach(item => {
            const subcategory = item.subcategory || item.type || 'Other'
            if (!itemsBySubcategory[subcategory]) {
                itemsBySubcategory[subcategory] = []
            }
            itemsBySubcategory[subcategory].push(item)
        })

        let html = `
            <div class="profession-section">
                <div class="profession-info">
                    <h3>${this.getProfessionIcon(profession)} ${this.capitalizeFirst(profession)}</h3>
                    <div class="profession-description">${this.getProfessionDescription(profession)}</div>
                </div>
        `

        // Render each subcategory
        for (const subcategory in itemsBySubcategory) {
            const items = itemsBySubcategory[subcategory]

            html += `
                <div class="tier-section">
                    <h4 class="tier-title">${this.capitalizeFirst(subcategory)}</h4>
                    <div class="crafting-items">
            `

            for (const item of items) {
                html += this.renderCraftingItem(item, character)
            }

            html += `
                    </div>
                </div>
            `
        }

        html += `
            </div>
        `

        return html
    }

    // Render individual crafting item
    renderCraftingItem(item, character) {
        const canCraft = this.canPlayerCraftItem(item, character)
        const hasRequiredSkills = this.hasRequiredSkillsForCrafting(item, character)

        const rarityClass = item.rarity || 'common'
        const craftableClass = canCraft ? 'craftable' : 'not-craftable'

        let html = `
            <div class="crafting-item ${rarityClass} ${craftableClass}" data-item-id="${item.id}">
                <div class="item-header">
                    ${window.renderItemIcon ? window.renderItemIcon(item, 48, 'item-icon') : `<div class="item-icon">${item.icon || '⚒️'}</div>`}
                    <div class="item-info">
                        <div class="item-name">
                            ${item.name}
                            <span class="item-type-tag" title="${this.getItemTypeDisplayName(item)}">${this.getItemTypeTag(item)}</span>
                        </div>
                    </div>
                </div>
                
                ${item.desc ? `
                    <div class="item-description">
                        ${this.getEnhancedItemDescription(item)}
                    </div>
                ` : ''}
                
                <div class="item-hover-hint">
                    💡 Hover for requirements
                </div>
                
                <div class="craft-actions">
        `

        if (canCraft) {
            html += `
                <button class="craft-button" onclick="uiComponents.craftItem('${item.id}', '${item.craftingCategory}')">
                    ⚒️ Craft Item
                </button>
            `
        } else if (!hasRequiredSkills) {
            html += `
                <div class="requirement-warning">
                    Missing Required Skills
                </div>
            `
        } else {
            html += `
                <div class="requirement-warning">
                    Insufficient Materials
                </div>
            `
        }

        html += `
                </div>
            </div>
        `

        return html
    }

    // Check if player can craft an item
    canPlayerCraftItem(item, character) {
        // Check required skills instead of skill levels
        if (item.requiredSkills) {
            for (const skillId of item.requiredSkills) {
                const hasSkill = characterManager.isSkillUnlocked(character, skillId)
                if (!hasSkill) {
                    // Only log in debug mode or when actually trying to craft
                    if (window.DEBUG_MODE) {
                        console.log(`Missing skill: ${skillId} for item: ${item.name}`)
                    }
                    return false
                }
            }
        }
        // Legacy support for old requiredSkillLevel system
        else if (item.requiredSkillLevel) {
            // For legacy items, we'll need some fallback logic
            // For now, assume they need basic skills
            const basicSkills = {
                'smithing': 'smithing_basic',
                'alchemy': 'alchemy_basic',
                'enchanting': 'enchanting_basic'
            }
            const requiredSkill = basicSkills[item.profession]
            if (requiredSkill && !characterManager.isSkillUnlocked(character, requiredSkill)) {
                // Only log in debug mode or when actually trying to craft
                if (window.DEBUG_MODE) {
                    console.log(`Missing skill: ${requiredSkill} for item: ${item.name}`)
                }
                return false
            }
        }

        // Check materials (support both old 'materials' and new 'craftingMaterials')
        const materialsArray = item.craftingMaterials || item.materials
        if (!Array.isArray(materialsArray) || materialsArray.length === 0) {
            // If materials is missing or not an array, treat as craftable (or adjust logic as needed)
            return false
        }
        for (const material of materialsArray) {
            const materialId = typeof material === 'string' ? material : material.id
            const quantity = typeof material === 'string' ? 1 : (material.quantity || 1)
            const available = this.getPlayerMaterialCount(character, materialId)
            if (available < quantity) {
                // Only log in debug mode or when actually trying to craft
                if (window.DEBUG_MODE) {
                    console.log(`Missing material: ${materialId} (need ${quantity}, have ${available}) for item: ${item.name}`)
                }
                return false
            }
        }

        return true
    }

    // Get player's material count (from inventory or monster loot)
    getPlayerMaterialCount(character, materialId) {
        if (!character || !character.inventory) {
            return 0
        }

        // Handle both array and object inventory formats
        if (Array.isArray(character.inventory)) {
            // Old array format
            const inventoryItem = character.inventory.find(item => item.id === materialId)
            return inventoryItem ? inventoryItem.quantity : 0
        } else {
            // New object format {itemId: quantity}
            return character.inventory[materialId] || 0
        }
    }

    // Get material display name
    getMaterialName(materialId) {
        // Look up material name from monster loot data
        if (window.MONSTER_LOOT_DATA) {
            for (const lootData of Object.values(window.MONSTER_LOOT_DATA)) {
                if (lootData.id === materialId) {
                    return lootData.name
                }
            }
        }

        // Fallback to formatted ID
        return materialId.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
    }

    // Format item type for display
    formatItemType(type) {
        switch (type) {
            case 'craftable_armor': return 'Armor'
            case 'craftable_weapon': return 'Weapon'
            case 'consumable': return 'Consumable'
            case 'enchantment': return 'Enchantment'
            case 'food': return 'Food'
            case 'artifact': return 'Artifact'
            case 'herb': return 'Herb'
            default: return type.replace(/_/g, ' ')
        }
    }

    // Format skill requirements for display
    formatSkillRequirements(item) {
        if (item.requiredSkills && item.requiredSkills.length > 0) {
            const character = characterManager.getCurrentCharacter()
            const skillNames = item.requiredSkills.map(skillId => {
                const hasSkill = character?.unlockedSkills?.[skillId]
                const skillName = this.getSkillDisplayName(skillId)
                const statusClass = hasSkill ? 'skill-known' : 'skill-missing'
                return `<span class="${statusClass}">${skillName}</span>`
            })
            return `Requires: ${skillNames.join(', ')}`
        } else if (item.requiredSkillLevel) {
            // Legacy support
            return `Req: Level ${item.requiredSkillLevel}`
        }
        return ''
    }

    // Get skill display name from skill ID
    getSkillDisplayName(skillId) {
        if (window.SKILLS_DATA) {
            for (const category of Object.values(window.SKILLS_DATA)) {
                for (const skillGroup of Object.values(category)) {
                    for (const skill of skillGroup) {
                        if (skill.id === skillId) {
                            return skill.name
                        }
                    }
                }
            }
        }
        // Fallback to formatted ID
        return skillId.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
    }

    // Calculate profession level based on unlocked skills
    calculateProfessionLevel(character, profession) {
        if (!character.unlockedSkills || !window.SKILLS_DATA?.professions?.[profession]) {
            return 0
        }

        const professionSkills = window.SKILLS_DATA.professions[profession]
        let highestTier = 0

        for (const skill of professionSkills) {
            if (character.unlockedSkills[skill.id]) {
                highestTier = Math.max(highestTier, skill.tier)
            }
        }

        return highestTier
    }

    // Check if character has required skills for crafting
    hasRequiredSkillsForCrafting(item, character) {
        if (item.requiredSkills) {
            for (const skillId of item.requiredSkills) {
                if (!character.unlockedSkills || !character.unlockedSkills[skillId]) {
                    return false
                }
            }
            return true
        }

        // Legacy support for requiredSkillLevel
        if (item.requiredSkillLevel) {
            const professionLevel = this.calculateProfessionLevel(character, item.profession)
            return professionLevel >= item.requiredSkillLevel
        }

        return true
    }

    // Craft an item
    craftItem(itemId, profession) {
        const character = characterManager.getCurrentCharacter()
        if (!character) return

        const item = this.findProfessionItem(itemId, profession)
        if (!item) {
            this.showMessage('Item not found!', 'error')
            return
        }

        // Check if player can craft this item (includes skill and material checks)
        if (!this.canPlayerCraftItem(item, character)) {
            this.showMessage('Cannot craft this item! Check skills and materials.', 'error')
            return
        }

        // Implement actual crafting logic
        // character is already defined above

        // Validate character and inventory
        if (!character) {
            this.showMessage('No character selected!', 'error')
            return
        }

        if (!character.inventory) {
            this.showMessage('Character has no inventory!', 'error')
            return
        }

        // Check if item has materials for crafting
        const materialsArray = item.craftingMaterials || item.materials || []
        if (!materialsArray || !Array.isArray(materialsArray)) {
            this.showMessage('This item cannot be crafted!', 'error')
            return
        }

        // Remove materials from inventory
        let canCraft = true
        const materialsNeeded = []

        materialsArray.forEach(material => {
            // Handle both array and object inventory formats
            let hasEnoughMaterial = false

            if (Array.isArray(character.inventory)) {
                // Old array format
                const inventoryItem = character.inventory.find(invItem =>
                    invItem.id === material.id && invItem.quantity >= material.quantity
                )
                hasEnoughMaterial = !!inventoryItem
            } else {
                // New object format {itemId: quantity}
                const available = character.inventory[material.id] || 0
                hasEnoughMaterial = available >= material.quantity
            }

            if (!hasEnoughMaterial) {
                canCraft = false
                // Get material name from monster loot data
                const materialData = window.findItemById ? window.findItemById(material.id) : null
                const materialName = materialData ? materialData.name : material.id
                materialsNeeded.push(`${material.quantity}x ${materialName}`)
            }
        })

        if (!canCraft) {
            this.showMessage(`Missing materials: ${materialsNeeded.join(', ')}`, 'error')
            return
        }

        // Remove materials from inventory
        materialsArray.forEach(material => {
            if (Array.isArray(character.inventory)) {
                // Old array format
                const inventoryIndex = character.inventory.findIndex(invItem => invItem.id === material.id)
                if (inventoryIndex !== -1) {
                    character.inventory[inventoryIndex].quantity -= material.quantity
                    if (character.inventory[inventoryIndex].quantity <= 0) {
                        character.inventory.splice(inventoryIndex, 1)
                    }
                }
            } else {
                // New object format {itemId: quantity}
                if (character.inventory[material.id]) {
                    character.inventory[material.id] -= material.quantity
                    if (character.inventory[material.id] <= 0) {
                        delete character.inventory[material.id]
                    }
                }
            }
        })

        // Add crafted item to inventory
        if (Array.isArray(character.inventory)) {
            // Old array format
            const existingItem = character.inventory.find(invItem => invItem.id === item.id)
            if (existingItem && item.stackable) {
                existingItem.quantity += item.quantity || 1
            } else {
                character.inventory.push({
                    ...item,
                    quantity: item.quantity || 1
                })
            }
        } else {
            // New object format {itemId: quantity}
            if (character.inventory[item.id] && item.stackable) {
                character.inventory[item.id] += item.quantity || 1
            } else {
                character.inventory[item.id] = item.quantity || 1
            }
        }

        characterManager.saveCharacter(character)
        this.showMessage(`Successfully crafted ${item.name}!`, 'success')

        // Refresh the crafting display
        this.renderCrafting()
    }

    // Find a profession item by ID
    findProfessionItem(itemId, profession) {
        // First check the new ITEMS_DATA structure
        if (window.ITEMS_DATA) {
            for (const category of Object.values(window.ITEMS_DATA)) {
                for (const item of Object.values(category)) {
                    if (item.id === itemId && item.craftableItem && item.craftingCategory &&
                        item.craftingCategory.toLowerCase() === profession.toLowerCase()) {
                        return item
                    }
                }
            }
        }



        return null
    }

    // === ITEM ADMINISTRATION SYSTEM ===

    // Show item admin sidebar
    showItemAdminSidebar() {
        const character = characterManager.getCurrentCharacter()
        if (!character) {
            this.showMessage('Please select a character first!', 'warning')
            return
        }

        const sidebar = document.getElementById('item-admin-sidebar')
        sidebar.classList.add('open')

        // Initialize the item list
        this.populateSidebarItemList()
    }

    // Hide item admin sidebar
    hideItemAdminSidebar() {
        const sidebar = document.getElementById('item-admin-sidebar')
        sidebar.classList.remove('open')
    }

    // Populate the full item list for sidebar
    populateSidebarItemList() {
        const itemList = document.getElementById('sidebar-item-list')
        if (!itemList) return

        const allItems = this.getAllAvailableItems()
        this.renderSidebarItemList(allItems)
    }

    // Filter sidebar item list based on search, type, and rarity
    filterSidebarItemList() {
        // Handle both single search box and separate name/description search boxes
        const singleSearchBox = document.getElementById('sidebar-item-search')
        const nameSearchBox = document.getElementById('sidebar-item-name-search')
        const descSearchBox = document.getElementById('sidebar-item-desc-search')

        let nameSearchTerm = ''
        let descSearchTerm = ''

        if (singleSearchBox) {
            // Single search box - search both name and description
            const searchTerm = singleSearchBox.value.toLowerCase()
            nameSearchTerm = searchTerm
            descSearchTerm = searchTerm
        } else if (nameSearchBox && descSearchBox) {
            // Separate search boxes
            nameSearchTerm = nameSearchBox.value.toLowerCase()
            descSearchTerm = descSearchBox.value.toLowerCase()
        }

        const selectedType = document.getElementById('sidebar-item-type')?.value || 'all'
        const selectedRarity = document.getElementById('sidebar-item-rarity')?.value || 'all'

        const allItems = this.getAllAvailableItems()

        let filteredItems = allItems.filter(item => {
            const matchesNameSearch = nameSearchTerm === '' ||
                item.name.toLowerCase().includes(nameSearchTerm)
            const matchesDescSearch = descSearchTerm === '' ||
                item.desc.toLowerCase().includes(descSearchTerm)

            const matchesType = selectedType === 'all' ||
                this.getItemType(item) === selectedType

            const matchesRarity = selectedRarity === 'all' ||
                (item.rarity || 'common') === selectedRarity

            return matchesNameSearch && matchesDescSearch && matchesType && matchesRarity
        })

        this.renderSidebarItemList(filteredItems)
    }

    // Clear all item filters
    clearItemFilters() {
        const searchInput = document.getElementById('sidebar-item-search')
        const nameSearchInput = document.getElementById('sidebar-item-name-search')
        const descSearchInput = document.getElementById('sidebar-item-desc-search')
        const typeSelect = document.getElementById('sidebar-item-type')
        const raritySelect = document.getElementById('sidebar-item-rarity')

        if (searchInput) searchInput.value = ''
        if (nameSearchInput) nameSearchInput.value = ''
        if (descSearchInput) descSearchInput.value = ''
        if (typeSelect) typeSelect.value = 'all'
        if (raritySelect) raritySelect.value = 'all'

        this.filterSidebarItemList()
    }

    // Render the filtered item list in sidebar
    renderSidebarItemList(items) {
        const itemList = document.getElementById('sidebar-item-list')
        if (!itemList) return

        if (items.length === 0) {
            itemList.innerHTML = '<div class="no-items">No items found matching your criteria.</div>'
            return
        }

        let html = ''
        for (const item of items.slice(0, 100)) { // Increased limit for sidebar
            html += this.renderSidebarItemCard(item)
        }

        if (items.length > 100) {
            html += '<div class="item-limit-notice">Showing first 100 items. Use search to narrow results.</div>'
        }

        itemList.innerHTML = html
    }

    // Render individual item card for sidebar
    renderSidebarItemCard(item) {
        const rarityClass = item.rarity || 'common'
        const categoryLabel = this.getItemAdminCategory(item)
        const typeTag = this.getItemTypeTag(item)
        const typeName = this.getItemTypeDisplayName(item)

        return `
            <div class="sidebar-item-card ${rarityClass}">
                <div class="sidebar-item-header">
                    ${window.renderItemIcon ? window.renderItemIcon(item, 22, 'sidebar-item-icon') : `<span class="sidebar-item-icon">${item.icon || '??'}</span>`}
                    <div class="sidebar-item-info">
                        <div class="sidebar-item-name">
                            ${item.name}
                            <span class="item-type-tag" title="${typeName}">${typeTag}</span>
                        </div>
                        <div class="sidebar-item-category">${categoryLabel}</div>
                    </div>
                </div>
                <div class="sidebar-item-desc">${this.getEnhancedItemDescription(item)}</div>
                <div class="sidebar-item-actions">
                    <button class="btn btn-tiny btn-primary" onclick="uiComponents.grantItemToCharacter('${item.id}', 1)">
                        +1
                    </button>
                    <button class="btn btn-tiny btn-secondary" onclick="uiComponents.grantItemToCharacter('${item.id}', 5)">
                        +5
                    </button>
                    <div class="custom-grant">
                        <input type="number" min="1" max="999" value="1" class="quantity-input-small" 
                               id="qty-${item.id}">
                        <button class="btn btn-tiny btn-success" onclick="uiComponents.grantCustomQuantity('${item.id}')">
                            Grant
                        </button>
                    </div>
                </div>
                ${item.value ? `<div class="sidebar-item-value">Value: ${this.formatItemValue(item.value)}</div>` : ''}
            </div>
        `
    }

    // Generate enhanced item description that includes special effects
    getEnhancedItemDescription(item) {
        let description = item.desc || ''

        // Remove basic "Effect:" descriptions since we show the full special effects below
        description = description.replace(/\s*Effect:\s*[^.]+\.?\s*$/, '')

        // Add special effects if they exist
        if (item.specialEffects && item.specialEffects.length > 0) {
            description += '\n\n✨ Special Effects:'
            for (const effect of item.specialEffects) {
                description += `\n• ${effect}`
            }
        }

        return description
    }

    // Get all items from all sources
    getAllAvailableItems() {
        let allItems = []

        // Add discoverable items
        if (window.DISCOVERABLE_ITEMS_DATA) {
            for (const category of Object.values(window.DISCOVERABLE_ITEMS_DATA)) {
                allItems = allItems.concat(Object.values(category))
            }
        }



        // Add regular shop items
        if (window.ITEMS_DATA) {
            for (const category of Object.values(window.ITEMS_DATA)) {
                allItems = allItems.concat(Object.values(category))
            }
        }

        // Add monster loot items
        if (window.MONSTER_LOOT_DATA) {
            allItems = allItems.concat(Object.values(window.MONSTER_LOOT_DATA))
        }

        return allItems
    }

    // Filter item list based on search and category
    filterItemAdminList() {
        const searchTerm = document.getElementById('item-search')?.value.toLowerCase() || ''
        const selectedCategory = document.getElementById('item-category')?.value || 'all'

        const allItems = this.getAllAvailableItems()

        let filteredItems = allItems.filter(item => {
            const matchesSearch = item.name.toLowerCase().includes(searchTerm) ||
                item.desc.toLowerCase().includes(searchTerm)

            const matchesCategory = selectedCategory === 'all' ||
                this.getItemAdminCategory(item) === selectedCategory

            return matchesSearch && matchesCategory
        })

        this.renderItemAdminList(filteredItems)
    }

    // Determine admin category for an item
    getItemAdminCategory(item) {
        // Check if item is craftable
        if (item.craftableItem === true) return 'craftable'

        // Check if item is shop item
        if (item.shopItem === true) return 'shop'

        // Check item type for categorization
        if (item.type === 'weapon') return 'weapons'
        if (item.type === 'armor') return 'armor'
        if (item.type === 'ring' || item.type === 'amulet' || item.type === 'accessory') return 'accessories'
        if (item.type === 'quest_item') return 'quest_items'
        if (item.type === 'consumable' || item.type === 'herb' || item.type === 'food') return 'consumables'
        if (item.type === 'ingredient' || item.type === 'material') return 'materials'

        // Check subcategory for weapons/armor
        if (item.subcategory && ['swords', 'bows', 'staves', 'axes', 'daggers', 'hammers', 'unarmed'].includes(item.subcategory)) return 'weapons'
        if (item.subcategory && ['light_armor', 'medium_armor', 'heavy_armor'].includes(item.subcategory)) return 'armor'

        // Default based on type
        if (item.type === 'weapon') return 'weapons'
        if (item.type === 'armor') return 'armor'

        return 'materials' // default fallback
    }

    // Determine item type for filtering
    getItemType(item) {
        // Check subcategory first for special cases
        if (item.subcategory === 'Food') return 'food'

        // Direct type mapping
        if (item.type === 'weapon' || item.type === 'craftable_weapon') return 'weapon'
        if (item.type === 'armor' || item.type === 'craftable_armor') return 'armor'
        if (item.type === 'ring') return 'ring'
        if (item.type === 'amulet') return 'amulet'
        if (item.type === 'accessory') return 'accessory'
        if (item.type === 'ingredient') return 'ingredient'
        if (item.type === 'consumable') return 'consumable'
        if (item.type === 'quest_item' || item.type === 'artifact' || item.type === 'relic') return 'quest_item'
        if (item.type === 'material') return 'material'

        // Check subcategory for weapons/armor
        if (item.subcategory && ['swords', 'bows', 'staves', 'axes', 'daggers', 'hammers', 'unarmed'].includes(item.subcategory)) return 'weapon'
        if (item.subcategory && ['light_armor', 'medium_armor', 'heavy_armor'].includes(item.subcategory)) return 'armor'

        // Default based on category structure
        if (item.subcategory === 'rings') return 'ring'
        if (item.subcategory === 'amulets') return 'amulet'
        if (item.subcategory === 'accessories') return 'accessory'

        return 'material' // default fallback
    }

    // Get visual tag for item type
    getItemTypeTag(item) {
        const type = this.getItemType(item)
        const tags = {
            weapon: '⚔️',
            armor: '🛡️',
            ring: '💍',
            amulet: '📿',
            accessory: '✨',
            ingredient: '🌿',
            food: '🍎',
            consumable: '🧪',
            quest_item: '📜',
            material: '🔧'
        }
        return tags[type] || '📦'
    }

    // Get item type display name
    getItemTypeDisplayName(item) {
        const type = this.getItemType(item)
        const names = {
            weapon: 'Weapon',
            armor: 'Armor',
            ring: 'Ring',
            amulet: 'Amulet',
            accessory: 'Accessory',
            ingredient: 'Ingredient',
            food: 'Food',
            consumable: 'Consumable',
            quest_item: 'Quest Item',
            material: 'Material'
        }
        return names[type] || 'Item'
    }

    // Render the filtered item list
    renderItemAdminList(items) {
        const itemList = document.getElementById('item-list')
        if (!itemList) return

        if (items.length === 0) {
            itemList.innerHTML = '<div class="no-items">No items found matching your criteria.</div>'
            return
        }

        let html = ''
        for (const item of items.slice(0, 50)) { // Limit to 50 items for performance
            html += this.renderAdminItemCard(item)
        }

        if (items.length > 50) {
            html += '<div class="item-limit-notice">Showing first 50 items. Use search to narrow results.</div>'
        }

        itemList.innerHTML = html
    }

    // Render individual item card for admin
    renderAdminItemCard(item) {
        const rarityClass = item.rarity || 'common'
        const categoryLabel = this.getItemAdminCategory(item)

        return `
            <div class="admin-item-card ${rarityClass}">
                <div class="admin-item-header">
                    ${window.renderItemIcon ? window.renderItemIcon(item, 22, 'admin-item-icon') : `<span class="admin-item-icon">${item.icon || '??'}</span>`}
                    <div class="admin-item-info">
                        <div class="admin-item-name">${item.name}</div>
                        <div class="admin-item-category">${categoryLabel}</div>
                    </div>
                    <div class="admin-item-actions">
                        <button class="btn btn-small btn-primary" onclick="uiComponents.grantItemToCharacter('${item.id}', 1)">
                            +1
                        </button>
                        <button class="btn btn-small btn-secondary" onclick="uiComponents.grantItemToCharacter('${item.id}', 5)">
                            +5
                        </button>
                        <input type="number" min="1" max="999" value="1" class="quantity-input" 
                               id="qty-${item.id}" style="width: 50px;">
                        <button class="btn btn-small btn-success" onclick="uiComponents.grantCustomQuantity('${item.id}')">
                            Grant
                        </button>
                    </div>
                </div>
                <div class="admin-item-desc">${this.getEnhancedItemDescription(item)}</div>
                ${item.value ? `<div class="admin-item-value">Value: ${this.formatItemValue(item.value)}</div>` : ''}
            </div>
        `
    }

    // Grant item to current character
    grantItemToCharacter(itemId, quantity = 1) {
        const character = characterManager.getCurrentCharacter()
        if (!character) {
            this.showMessage('No character selected!', 'error')
            return
        }

        const item = this.findItemById(itemId)
        if (!item) {
            this.showMessage('Item not found!', 'error')
            return
        }

        // Initialize inventory if it doesn't exist
        if (!character.inventory) {
            character.inventory = {}
        }

        // Convert old array format to new object format if needed
        if (Array.isArray(character.inventory)) {
            const newInventory = {}

            // Convert existing array items to object format
            for (const existingItem of character.inventory) {
                if (existingItem && existingItem.id) {
                    newInventory[existingItem.id] = existingItem.quantity || 1
                }
            }

            character.inventory = newInventory
        }

        // Add item to inventory
        if (item.stackable !== false) {
            character.inventory[itemId] = (character.inventory[itemId] || 0) + quantity
        } else {
            // Non-stackable items
            if (!character.inventory[itemId]) {
                character.inventory[itemId] = 1
            } else {
                this.showMessage(`${item.name} is not stackable and character already has one!`, 'warning')
                return
            }
        }

        // Save character data
        characterManager.saveCharacter(character)

        // Show success message
        const typeTag = this.getItemTypeTag(item)
        const typeName = this.getItemTypeDisplayName(item)
        this.showMessage(`Granted ${quantity}x ${item.name} ${typeTag} to ${character.name} (${typeName})`, 'success')

        // Update displays - refresh inventory on character sheet if open
        if (this.currentTab === 'character-sheet') {
            this.renderCharacterSheet()
        } else {
            // If on a different tab, just refresh the inventory display
            this.renderInventory(character)
        }
    }

    // Grant custom quantity
    grantCustomQuantity(itemId) {
        const qtyInput = document.getElementById(`qty-${itemId}`)
        const quantity = parseInt(qtyInput?.value) || 1
        this.grantItemToCharacter(itemId, quantity)
    }

    // Find any item by ID across all data sources
    findItemById(itemId) {
        // Check discoverable items
        if (window.DISCOVERABLE_ITEMS_DATA) {
            for (const category of Object.values(window.DISCOVERABLE_ITEMS_DATA)) {
                if (category[itemId]) return category[itemId]
            }
        }



        // Check monster loot data
        if (window.MONSTER_LOOT_DATA) {
            for (const lootItem of Object.values(window.MONSTER_LOOT_DATA)) {
                if (lootItem.id === itemId) return lootItem
            }
        }

        // Check regular items
        if (window.ITEMS_DATA) {
            for (const category of Object.values(window.ITEMS_DATA)) {
                if (category[itemId]) return category[itemId]
            }
        }

        return null
    }

    // Format item value for display
    formatItemValue(value) {
        // Handle both old currency format (object) and new Gil format (number)
        if (typeof value === 'number') {
            return `${value} Gil`
        }

        // Legacy support for old currency format
        if (typeof value === 'object' && value) {
            const parts = []
            if (value.gold) parts.push(`${value.gold}g`)
            if (value.silver) parts.push(`${value.silver}s`)
            if (value.copper) parts.push(`${value.copper}c`)
            return parts.join(' ') || 'No value'
        }

        return 'No value'
    }

    // ========== ENCHANTMENT INTERACTION METHODS ==========

    // Unequip an enchantment from equipment
    unequipEnchantment(enchantmentId, equipmentSlot) {
        const character = characterManager.getCurrentCharacter()
        if (!character) return

        const success = window.inventorySystem.unequipEnchantment(character, enchantmentId, equipmentSlot)
        if (success) {
            this.showMessage(`Enchantment removed and returned to inventory`, 'success')
            this.updateDisplay() // Refresh UI
        } else {
            this.showMessage('Failed to remove enchantment', 'error')
        }
    }

    // Show available enchantments for selection
    showEnchantmentSelection(equipmentSlot, slotIndex) {
        const character = this.characterManager.currentCharacter
        if (!character) return

        // Get available enchantments from inventory
        const availableEnchantments = this.getAvailableEnchantments(character, equipmentSlot)

        if (availableEnchantments.length === 0) {
            this.showErrorMessage(`No ${equipmentSlot} enchantments available in inventory`)
            return
        }

        // Show selection modal
        this.showEnchantmentSelectionModal(availableEnchantments, equipmentSlot)
    }

    // Get enchantments available in inventory for the given equipment slot
    getAvailableEnchantments(character, equipmentSlot) {
        const availableEnchantments = []

        if (!character.inventory) {
            return availableEnchantments
        }

        // Handle both old array format and new object format
        let inventoryItems = []

        if (Array.isArray(character.inventory)) {
            // Old format - convert to new format
            inventoryItems = character.inventory
        } else {
            // New format - object with itemId: quantity
            for (const [itemId, quantity] of Object.entries(character.inventory)) {
                inventoryItems.push({ id: itemId, quantity: quantity })
            }
        }

        inventoryItems.forEach(item => {
            const enchantment = this.findEnchantmentById(item.id)
            if (enchantment) {
                // Check if enchantment type matches equipment slot
                if ((equipmentSlot === 'weapon' && enchantment.type === 'weapon_enchantment') ||
                    (equipmentSlot === 'armor' && enchantment.type === 'armor_enchantment')) {
                    availableEnchantments.push({
                        ...enchantment,
                        quantity: item.quantity || 1
                    })
                }
            }
        })

        return availableEnchantments
    }

    // Show modal for selecting an enchantment to equip
    showEnchantmentSelectionModal(availableEnchantments, equipmentSlot) {
        // Create modal HTML
        const modalHtml = `
            <div class="enchantment-selection-modal">
                <div class="modal-content">
                    <h3>Select Enchantment for ${this.capitalizeFirst(equipmentSlot)}</h3>
                    <div class="enchantment-options">
                        ${availableEnchantments.map(enchantment => `
                            <div class="enchantment-option" data-enchantment-id="${enchantment.id}" data-slot="${equipmentSlot}">
                                ${window.renderEnchantmentIcon ? window.renderEnchantmentIcon(enchantment, 20, 'enchantment-icon') : `<span class="enchantment-icon">${enchantment.icon}</span>`}
                                <div class="enchantment-details">
                                    <div class="enchantment-name">${enchantment.name}</div>
                                    <div class="enchantment-desc">${enchantment.desc}</div>
                                    <div class="enchantment-tier">Tier ${enchantment.tier}</div>
                                </div>
                                <button class="apply-enchantment-btn" data-enchantment-id="${enchantment.id}" data-slot="${equipmentSlot}">
                                    Apply
                                </button>
                            </div>
                        `).join('')}
                    </div>
                    <button class="close-modal-btn">Cancel</button>
                </div>
            </div>
        `

        // Add modal to page
        document.body.insertAdjacentHTML('beforeend', modalHtml)

        // Add event listeners
        const modal = document.querySelector('.enchantment-selection-modal')

        // Close modal handlers
        modal.querySelector('.close-modal-btn').addEventListener('click', () => {
            modal.remove()
        })

        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.remove()
        })

        // Apply enchantment handlers
        modal.querySelectorAll('.apply-enchantment-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault()
                const enchantmentId = btn.dataset.enchantmentId
                const slot = btn.dataset.slot
                this.applyEnchantment(enchantmentId, slot)
                modal.remove()
            })
        })
    }

    // Apply an enchantment to equipment
    applyEnchantment(enchantmentId, equipmentSlot) {
        const character = this.characterManager.currentCharacter
        if (!character) return

        const success = this.inventorySystem.equipEnchantment(character, enchantmentId, equipmentSlot)
        if (success) {
            this.showSuccessMessage(`Enchantment applied successfully`)
            this.updateCharacterSheet() // Refresh UI
        } else {
            this.showErrorMessage('Failed to apply enchantment')
        }
    }

    // Add test enchantments to current character's inventory (legacy method)
    addTestEnchantments() {
        const character = this.characterManager.currentCharacter
        if (!character) {
            this.showErrorMessage('Please select a character first')
            return
        }

        const success = this.inventorySystem.addTestEnchantments(character)
        if (success) {
            this.showSuccessMessage('Test enchantments added to inventory!')
            this.updateCharacterSheet() // Refresh UI to show new items
        } else {
            this.showErrorMessage('Failed to add test enchantments')
        }
    }

    // Equip enchantment directly to weapon slot
    equipEnchantmentToWeapon(enchantmentId) {
        const character = characterManager.getCurrentCharacter()
        if (!character) {
            this.showMessage('Please select a character first', 'error')
            return
        }

        if (!character.equipped.weapon) {
            this.showMessage('No weapon equipped. Please equip a weapon first.', 'error')
            return
        }

        const success = window.inventorySystem.equipEnchantment(character, enchantmentId, 'weapon')
        if (success) {
            this.showMessage(`Enchantment applied to weapon successfully!`, 'success')
            this.updateDisplay() // Refresh UI
        } else {
            this.showMessage('Failed to apply enchantment to weapon', 'error')
        }
    }

    // Equip enchantment directly to armor slot
    equipEnchantmentToArmor(enchantmentId) {
        const character = characterManager.getCurrentCharacter()
        if (!character) {
            this.showMessage('Please select a character first', 'error')
            return
        }

        if (!character.equipped.armor) {
            this.showMessage('No armor equipped. Please equip armor first.', 'error')
            return
        }

        const success = window.inventorySystem.equipEnchantment(character, enchantmentId, 'armor')
        if (success) {
            this.showMessage(`Enchantment applied to armor successfully!`, 'success')
            this.updateDisplay() // Refresh UI
        } else {
            this.showMessage('Failed to apply enchantment to armor', 'error')
        }
    }
    // Helper method for level badge colors
    getLevelColor(level) {
        if (level <= 5) return 'green'
        if (level <= 10) return 'blue'
        if (level <= 15) return 'orange'
        return 'purple'
    }

    // Render Notes Tab
    renderNotes() {
        const character = characterManager.getCurrentCharacter()
        const notesContent = document.getElementById('notes-content')

        if (!character) {
            notesContent.innerHTML = `
                <div class="no-character-content">
                    <h3>No Character Selected</h3>
                    <p>Please select a character to view or edit notes</p>
                </div>
            `
            return
        }

        // Initialize notes if they don't exist
        if (!character.notes) {
            character.notes = ''
        }

        notesContent.innerHTML = `
            <div class="notes-container">
                <div class="notes-header">
                    <h2>📝 Notes for ${character.name}</h2>
                    <div class="notes-actions">
                        <button class="btn btn-secondary" id="manage-saved-notes-btn" title="Manage saved notes">
                            ${iconMapper.createIconElement('ui', 'folder', 16)} Saved Notes
                        </button>
                        <button class="btn btn-secondary" id="save-as-btn" title="Save as new note">
                            ${iconMapper.createIconElement('ui', 'save', 16)} Save As...
                        </button>
                        <button class="btn btn-secondary" id="clear-notes-btn" title="Clear all notes">
                            ${iconMapper.createIconElement('ui', 'delete', 16)} Clear
                        </button>
                        <button class="btn btn-primary" id="save-notes-btn" title="Save notes">
                            ${iconMapper.createIconElement('ui', 'save', 16)} Save
                        </button>
                    </div>
                </div>
                
                <div class="saved-notes-panel" id="saved-notes-panel" style="display: none;">
                    <div class="saved-notes-header">
                        <h3>📚 Saved Notes</h3>
                        <button class="btn btn-small btn-secondary" id="close-saved-panel-btn">✕</button>
                    </div>
                    <div class="saved-notes-list" id="saved-notes-list">
                        <!-- Saved notes will be populated here -->
                    </div>
                </div>
                
                <div class="notes-editor">
                    <textarea 
                        id="notes-textarea" 
                        placeholder="Keep track of your character's journey, important NPCs, quest details, session notes, and anything else you want to remember..."
                        maxlength="10000"
                    >${character.notes}</textarea>
                    
                    <div class="notes-footer">
                        <span class="character-count">
                            <span id="notes-char-count">${character.notes.length}</span>/10000 characters
                        </span>
                        <span class="auto-save-indicator" id="auto-save-indicator">Auto-saved</span>
                    </div>
                </div>
            </div>
        `

        // Set up event listeners
        this.setupNotesEventListeners()
    }

    setupNotesEventListeners() {
        const textarea = document.getElementById('notes-textarea')
        const saveBtn = document.getElementById('save-notes-btn')
        const clearBtn = document.getElementById('clear-notes-btn')
        const saveAsBtn = document.getElementById('save-as-btn')
        const manageSavedBtn = document.getElementById('manage-saved-notes-btn')
        const closeSavedPanelBtn = document.getElementById('close-saved-panel-btn')
        const charCount = document.getElementById('notes-char-count')
        const autoSaveIndicator = document.getElementById('auto-save-indicator')

        let autoSaveTimeout = null

        // Initialize saved notes panel
        this.loadSavedNotesList()

        // Character count update
        textarea?.addEventListener('input', () => {
            const count = textarea.value.length
            charCount.textContent = count

            // Auto-save after 2 seconds of no typing
            clearTimeout(autoSaveTimeout)
            autoSaveIndicator.textContent = 'Typing...'
            autoSaveIndicator.className = 'auto-save-indicator saving'

            autoSaveTimeout = setTimeout(() => {
                this.saveNotes()
                autoSaveIndicator.textContent = 'Auto-saved'
                autoSaveIndicator.className = 'auto-save-indicator'

                // Show brief success animation
                setTimeout(() => {
                    autoSaveIndicator.style.animation = 'saveIndicatorPulse 0.5s ease-in-out'
                    setTimeout(() => {
                        autoSaveIndicator.style.animation = ''
                    }, 500)
                }, 100)
            }, 2000)
        })

        // Manual save
        saveBtn?.addEventListener('click', () => {
            clearTimeout(autoSaveTimeout)
            autoSaveIndicator.textContent = 'Saving...'
            autoSaveIndicator.className = 'auto-save-indicator saving'

            setTimeout(() => {
                this.saveNotes()
                autoSaveIndicator.textContent = 'Saved!'
                autoSaveIndicator.className = 'auto-save-indicator'

                // Show success animation
                autoSaveIndicator.style.animation = 'saveIndicatorPulse 0.5s ease-in-out'
                setTimeout(() => {
                    autoSaveIndicator.style.animation = ''
                    autoSaveIndicator.textContent = 'Auto-saved'
                }, 500)
            }, 200) // Small delay to show the "Saving..." state
        })

        // Clear notes
        clearBtn?.addEventListener('click', () => {
            this.showConfirm(
                'Clear Notes',
                'Are you sure you want to clear all notes? This cannot be undone.',
                'warning'
            ).then(confirmed => {
                if (confirmed) {
                    textarea.value = ''
                    charCount.textContent = '0'

                    autoSaveIndicator.textContent = 'Clearing...'
                    autoSaveIndicator.className = 'auto-save-indicator saving'

                    setTimeout(() => {
                        this.saveNotes()
                        autoSaveIndicator.textContent = 'Cleared'
                        autoSaveIndicator.className = 'auto-save-indicator'
                        this.showMessage('Notes cleared successfully', 'success')

                        setTimeout(() => {
                            autoSaveIndicator.textContent = 'Auto-saved'
                        }, 2000)
                    }, 300)
                }
            })
        })

        // Save As button
        saveAsBtn?.addEventListener('click', () => {
            this.showSaveAsDialog()
        })

        // Manage Saved Notes button
        manageSavedBtn?.addEventListener('click', () => {
            this.toggleSavedNotesPanel()
        })

        // Close Saved Notes Panel button
        closeSavedPanelBtn?.addEventListener('click', () => {
            this.closeSavedNotesPanel()
        })
    }

    saveNotes() {
        const character = characterManager.getCurrentCharacter()
        const textarea = document.getElementById('notes-textarea')

        if (character && textarea) {
            character.notes = textarea.value
            characterManager.saveCharacter(character)
        }
    }

    // ============================================================================
    // SAVED NOTES SYSTEM
    // ============================================================================

    getSavedNotesKey() {
        const character = characterManager.getCurrentCharacter()
        return `savedNotes_${character.name}_${character.id || 'default'}`
    }

    getSavedNotes() {
        const key = this.getSavedNotesKey()
        const saved = localStorage.getItem(key)
        return saved ? JSON.parse(saved) : []
    }

    saveSavedNotes(notes) {
        const key = this.getSavedNotesKey()
        localStorage.setItem(key, JSON.stringify(notes))
    }

    showSaveAsDialog() {
        const textarea = document.getElementById('notes-textarea')
        if (!textarea || !textarea.value.trim()) {
            this.showMessage('No content to save', 'warning')
            return
        }

        this.showPrompt(
            'Save Notes As...',
            'Enter a name for this saved note:',
            'Session Notes'
        ).then(name => {
            if (name && name.trim()) {
                this.saveNotesAs(name.trim(), textarea.value)
            }
        })
    }

    saveNotesAs(name, content) {
        const savedNotes = this.getSavedNotes()
        const timestamp = new Date().toISOString()

        // Check if name already exists
        const existingIndex = savedNotes.findIndex(note => note.name === name)

        const noteData = {
            name,
            content,
            timestamp,
            preview: content.substring(0, 100) + (content.length > 100 ? '...' : '')
        }

        if (existingIndex >= 0) {
            // Update existing note
            this.showConfirm(
                'Overwrite Note',
                `A note named "${name}" already exists. Do you want to overwrite it?`,
                'warning'
            ).then(confirmed => {
                if (confirmed) {
                    savedNotes[existingIndex] = noteData
                    this.saveSavedNotes(savedNotes)
                    this.showMessage(`Note "${name}" updated successfully`, 'success')
                    this.loadSavedNotesList()
                }
            })
        } else {
            // Create new note
            savedNotes.push(noteData)
            this.saveSavedNotes(savedNotes)
            this.showMessage(`Note "${name}" saved successfully`, 'success')
            this.loadSavedNotesList()
        }
    }

    toggleSavedNotesPanel() {
        const panel = document.getElementById('saved-notes-panel')
        if (panel) {
            if (panel.style.display === 'none') {
                this.openSavedNotesPanel()
            } else {
                this.closeSavedNotesPanel()
            }
        }
    }

    openSavedNotesPanel() {
        const panel = document.getElementById('saved-notes-panel')
        if (panel) {
            panel.style.display = 'block'
            setTimeout(() => panel.classList.add('open'), 10)
            this.loadSavedNotesList()
        }
    }

    closeSavedNotesPanel() {
        const panel = document.getElementById('saved-notes-panel')
        if (panel) {
            panel.classList.remove('open')
            setTimeout(() => panel.style.display = 'none', 300)
        }
    }

    loadSavedNotesList() {
        const listContainer = document.getElementById('saved-notes-list')
        if (!listContainer) return

        const savedNotes = this.getSavedNotes()

        if (savedNotes.length === 0) {
            listContainer.innerHTML = `
                <div class="no-saved-notes">
                    <p>No saved notes yet</p>
                    <p>Use "Save As..." to create your first saved note</p>
                </div>
            `
            return
        }

        // Sort by timestamp, newest first
        savedNotes.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))

        let html = ''
        savedNotes.forEach((note, index) => {
            const date = new Date(note.timestamp).toLocaleDateString()
            const time = new Date(note.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

            html += `
                <div class="saved-note-item" data-index="${index}">
                    <div class="saved-note-header">
                        <h4 class="saved-note-name">${this.escapeHtml(note.name)}</h4>
                        <div class="saved-note-actions">
                            <button class="btn btn-small btn-primary" onclick="uiComponents.loadSavedNote(${index})" title="Load this note">
                                📄 Load
                            </button>
                            <button class="btn btn-small btn-secondary" onclick="uiComponents.deleteSavedNote(${index})" title="Delete this note">
                                🗑️ Delete
                            </button>
                        </div>
                    </div>
                    <div class="saved-note-meta">
                        <span class="saved-note-date">${date} at ${time}</span>
                        <span class="saved-note-length">${note.content.length} characters</span>
                    </div>
                    <div class="saved-note-preview">${this.escapeHtml(note.preview)}</div>
                </div>
            `
        })

        listContainer.innerHTML = html
    }

    loadSavedNote(index) {
        const savedNotes = this.getSavedNotes()
        if (index >= 0 && index < savedNotes.length) {
            const note = savedNotes[index]
            const textarea = document.getElementById('notes-textarea')
            const charCount = document.getElementById('notes-char-count')

            if (textarea) {
                this.showConfirm(
                    'Load Saved Note',
                    `Load "${note.name}"? This will replace your current notes.`,
                    'info'
                ).then(confirmed => {
                    if (confirmed) {
                        textarea.value = note.content
                        if (charCount) {
                            charCount.textContent = note.content.length
                        }
                        this.saveNotes() // Save to character
                        this.showMessage(`Loaded "${note.name}"`, 'success')
                        this.closeSavedNotesPanel()
                    }
                })
            }
        }
    }

    deleteSavedNote(index) {
        const savedNotes = this.getSavedNotes()
        if (index >= 0 && index < savedNotes.length) {
            const note = savedNotes[index]

            this.showConfirm(
                'Delete Saved Note',
                `Are you sure you want to delete "${note.name}"? This cannot be undone.`,
                'warning'
            ).then(confirmed => {
                if (confirmed) {
                    savedNotes.splice(index, 1)
                    this.saveSavedNotes(savedNotes)
                    this.showMessage(`Deleted "${note.name}"`, 'success')
                    this.loadSavedNotesList()
                }
            })
        }
    }

    escapeHtml(text) {
        const div = document.createElement('div')
        div.textContent = text
        return div.innerHTML
    }

    // ============================================================================
    // UNIVERSAL DATA-DRIVEN SHOP SYSTEM
    // ============================================================================

    // Get all shop items from all categories, grouped by type and subcategory
    getAllShopItems() {
        const allItems = []

        // Collect items from all ITEMS_DATA categories
        Object.values(window.ITEMS_DATA || {}).forEach(category => {
            Object.values(category).forEach(item => {
                // Only include items marked for shop display
                if (item.shopItem === true) {
                    allItems.push(item)
                }
            })
        })

        return allItems
    }

    // Group items by category (type) and subcategory dynamically
    groupItemsByCategory(items) {
        const catalog = {}

        items.forEach(item => {
            // Use item.type as category, fallback to "misc"
            const category = item.type || 'misc'
            // Use item.subcategory as subcategory, fallback to "general"
            const subcategory = item.subcategory || 'general'

            // Initialize category if it doesn't exist
            if (!catalog[category]) {
                catalog[category] = {}
            }

            // Initialize subcategory if it doesn't exist
            if (!catalog[category][subcategory]) {
                catalog[category][subcategory] = []
            }

            catalog[category][subcategory].push(item)
        })

        // Sort items within each subcategory by data file order, then price as fallback
        Object.keys(catalog).forEach(category => {
            Object.keys(catalog[category]).forEach(subcategory => {
                catalog[category][subcategory].sort((a, b) => {
                    // Primary sort: preserve order from items-data.js file
                    const orderA = this.getItemDataOrder(a.id)
                    const orderB = this.getItemDataOrder(b.id)
                    if (orderA !== orderB) return orderA - orderB

                    // Secondary sort: price (lowest to highest)
                    const priceA = this.calculatePriceValue(a.price)
                    const priceB = this.calculatePriceValue(b.price)
                    if (priceA !== priceB) return priceA - priceB

                    // Tertiary sort: name
                    return (a.name || '').localeCompare(b.name || '')
                })
            })
        })

        return catalog
    }

    // Get item order from items-data.js file for natural sorting
    getItemDataOrder(itemId) {
        if (!window.ITEMS_DATA) return 999999

        let order = 0

        // Iterate through categories and items to find the order
        for (const [categoryKey, categoryItems] of Object.entries(window.ITEMS_DATA)) {
            for (const [itemKey, item] of Object.entries(categoryItems)) {
                if (item.id === itemId) {
                    return order
                }
                order++
            }
        }

        // If not found, return high number to sort at end
        return 999999
    }

    // Calculate total price value for sorting
    calculatePriceValue(price = 0) {
        return typeof price === 'number' ? price : 0
    }

    // Get categories in the order they appear in the items-data.js file
    getCategoriesInDataOrder(catalog) {
        const categoryOrder = []
        const seenCategories = new Set()

        // Iterate through ITEMS_DATA in the order categories appear in the file
        if (window.ITEMS_DATA) {
            Object.keys(window.ITEMS_DATA).forEach(categoryKey => {
                const categoryItems = window.ITEMS_DATA[categoryKey]

                // Find the first item's type to determine category
                const firstItem = Object.values(categoryItems)[0]
                if (firstItem && firstItem.type) {
                    const category = firstItem.type

                    // Only add if this category exists in our catalog and we haven't seen it
                    if (catalog[category] && !seenCategories.has(category)) {
                        categoryOrder.push(category)
                        seenCategories.add(category)
                    }
                }
            })
        }

        // Add any remaining categories that weren't found in ITEMS_DATA
        Object.keys(catalog).forEach(category => {
            if (!seenCategories.has(category)) {
                categoryOrder.push(category)
            }
        })

        return categoryOrder
    }

    // Generate display name for category
    getCategoryDisplayName(categoryKey) {
        const categoryMap = {
            'weapon': '⚔️ Weapons',
            'armor': '🛡️ Armor',
            'accessory': '💍 Accessories',
            'consumable': '🧪 Consumables',
            'misc': '📦 Miscellaneous'
        }

        return categoryMap[categoryKey] || this.capitalizeFirst(categoryKey)
    }

    // Generate display name for subcategory (use original casing)
    getSubcategoryDisplayName(subcategoryKey) {
        // For subcategories, use the original casing and add icons for common ones
        const subcategoryMap = {
            'swords': '🗡️ Swords',
            'daggers': '🗡️ Daggers',
            'bows': '🏹 Bows',
            'axes': '🪓 Axes',
            'hammers': '🔨 Hammers',
            'staffs': '🪄 Staffs',
            'polearms': '🔱 Polearms',
            'lasers': '🔫 Lasers',
            'light armor': '🧥 Light Armor',
            'medium armor': '🦾 Medium Armor',
            'heavy armor': '🛡️ Heavy Armor',
            'robes': '🧙‍♂️ Robes',
            'rings': '💍 Rings',
            'necklaces': '📿 Necklaces',
            'cloaks': '🧥 Cloaks',
            'footwear': '👢 Footwear',
            'general': '📋 General'
        }

        return subcategoryMap[subcategoryKey.toLowerCase()] || this.capitalizeFirst(subcategoryKey)
    }

    // Utility: Capitalize first letter
    capitalizeFirst(str) {
        return str.charAt(0).toUpperCase() + str.slice(1)
    }

    // Universal shop renderer - replaces all the hardcoded category renderers
    renderUniversalShop() {
        const allShopItems = this.getAllShopItems()
        const catalog = this.groupItemsByCategory(allShopItems)

        // Get categories in the order they appear in the data file (preserve natural order)
        const categories = this.getCategoriesInDataOrder(catalog)

        if (!this.selectedShopCategory || !catalog[this.selectedShopCategory]) {
            this.selectedShopCategory = categories[0] || 'weapon'
        }

        const currentCategoryItems = catalog[this.selectedShopCategory] || {}

        return `
            <div class="shop-content">
                ${this.renderShopTabs(categories)}
                <div class="shop-content-area">
                    ${this.renderShopSubcategories(currentCategoryItems)}
                </div>
            </div>
        `
    }

    // Render shop tabs dynamically
    renderShopTabs(categories) {
        return `
            <div class="shop-tabs">
                ${categories.map(category => `
                    <button class="shop-tab ${category === this.selectedShopCategory ? 'active' : ''}" 
                            data-category="${category}">
                        ${this.getCategoryDisplayName(category)}
                    </button>
                `).join('')}
            </div>
        `
    }

    // Render subcategories for current category
    renderShopSubcategories(categoryItems) {
        const subcategories = Object.keys(categoryItems).sort()

        if (subcategories.length === 0) {
            return `<div class="no-items">No items available in this category.</div>`
        }

        return `
            <div class="subcategories-container">
                ${subcategories.map(subcategory => `
                    <div class="${subcategory}-subcategory shop-section-box">
                        <h4 class="${subcategory}-subcategory-title">
                            ${this.getSubcategoryDisplayName(subcategory)}
                        </h4>
                        <div class="weapon-scroll-container">
                            <div class="shop-items">
                                ${this.renderShopItemsByCategory(categoryItems[subcategory].map(item => item.id))}
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `
    }
}

// Create global instance
const uiComponents = new UIComponents()
window.uiComponents = uiComponents;







