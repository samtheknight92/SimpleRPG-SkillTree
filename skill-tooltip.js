// Skill tooltip utility using existing modal/tooltip conventions
// Provides consistent tooltip display for radial skill tree nodes

class SkillTooltip {
    constructor() {
        this.tooltip = null;
        this.isVisible = false;
        this.fadeTimeout = null;
        this.currentNode = null;
        
        this.init();
    }

    /**
     * Initialize tooltip DOM element
     */
    init() {
        // Create tooltip element if it doesn't exist
        this.tooltip = document.getElementById('radial-skill-tooltip');
        
        if (!this.tooltip) {
            this.tooltip = document.createElement('div');
            this.tooltip.id = 'radial-skill-tooltip';
            this.tooltip.className = 'radial-skill-tooltip';
            document.body.appendChild(this.tooltip);
        }

        // Hide initially
        this.hide();
        
        // Add global event listeners for cleanup
        document.addEventListener('scroll', () => this.hide());
        window.addEventListener('resize', () => this.hide());
    }

    /**
     * Show tooltip for a skill node
     * @param {Object} node - Node object with skill data
     * @param {number} x - X position for tooltip
     * @param {number} y - Y position for tooltip
     * @param {Object} character - Current character (for unlock status)
     */
    show(node, x, y, character = null) {
        if (!node || !this.tooltip) return;

        this.currentNode = node;
        
        // Build tooltip content
        const content = this.buildTooltipContent(node, character);
        this.tooltip.innerHTML = content;

        // Position tooltip
        this.positionTooltip(x, y);

        // Show tooltip
        this.tooltip.style.display = 'block';
        this.tooltip.style.opacity = '0';
        
        // Fade in
        clearTimeout(this.fadeTimeout);
        this.fadeTimeout = setTimeout(() => {
            if (this.tooltip) {
                this.tooltip.style.opacity = '1';
            }
        }, 10);

        this.isVisible = true;
    }

    /**
     * Hide tooltip
     */
    hide() {
        if (!this.tooltip || !this.isVisible) return;

        this.tooltip.style.opacity = '0';
        
        clearTimeout(this.fadeTimeout);
        this.fadeTimeout = setTimeout(() => {
            if (this.tooltip) {
                this.tooltip.style.display = 'none';
            }
        }, 200);

        this.isVisible = false;
        this.currentNode = null;
    }

    /**
     * Build tooltip content HTML
     * @param {Object} node - Node object
     * @param {Object} character - Current character
     * @returns {string} HTML content
     */
    buildTooltipContent(node, character) {
        const isUnlocked = this.isSkillUnlocked(node, character);
        const canUnlock = this.canUnlockSkill(node, character);
        const prereqsMet = this.arePrerequisitesMet(node, character);
        
        // Status indicators
        let statusClass = 'locked';
        let statusText = 'Locked';
        let statusIcon = '🔒';
        
        if (isUnlocked) {
            statusClass = 'unlocked';
            statusText = 'Unlocked';
            statusIcon = '✅';
        } else if (canUnlock) {
            statusClass = 'available';
            statusText = 'Available';
            statusIcon = '🟡';
        } else if (!prereqsMet) {
            statusClass = 'prerequisites-unmet';
            statusText = 'Prerequisites Not Met';
            statusIcon = '❌';
        }

        // Build prerequisites list
        const prereqsHtml = this.buildPrerequisitesHtml(node, character);
        
        // Format cost display
        const costDisplay = node.cost > 0 ? `${node.cost} Lumens` : 'Free';
        
        // Keystone indicator
        const keystoneHtml = node.keystone ? 
            '<div class="tooltip-keystone">👑 Keystone Skill</div>' : '';

        // Element indicator
        const elementHtml = node.element ? 
            `<div class="tooltip-element">Element: ${node.element}</div>` : '';

        // Stamina cost
        const staminaHtml = node.staminaCost > 0 ? 
            `<div class="tooltip-stamina">Stamina Cost: ${node.staminaCost}</div>` : '';

        return `
            <div class="tooltip-header">
                <div class="tooltip-title">
                    <span class="tooltip-icon">${node.icon}</span>
                    <span class="tooltip-name">${node.name}</span>
                </div>
                <div class="tooltip-status ${statusClass}">
                    <span class="status-icon">${statusIcon}</span>
                    <span class="status-text">${statusText}</span>
                </div>
            </div>
            
            <div class="tooltip-body">
                <div class="tooltip-info">
                    <div class="tooltip-tier">Tier ${node.tier}</div>
                    <div class="tooltip-cost">${costDisplay}</div>
                    <div class="tooltip-category">${this.formatCategory(node.category)}</div>
                </div>
                
                ${keystoneHtml}
                ${elementHtml}
                ${staminaHtml}
                
                <div class="tooltip-description">
                    ${node.desc || 'No description available.'}
                </div>
                
                ${prereqsHtml}
                
                <div class="tooltip-actions">
                    ${this.buildActionsHtml(node, character, canUnlock)}
                </div>
            </div>
        `;
    }

    /**
     * Build prerequisites HTML
     * @param {Object} node - Node object
     * @param {Object} character - Current character
     * @returns {string} Prerequisites HTML
     */
    buildPrerequisitesHtml(node, character) {
        if (!node.prerequisites || node.prerequisites.length === 0) {
            return '<div class="tooltip-prerequisites">No prerequisites</div>';
        }

        const prereqsList = node.prerequisites.map(prereqId => {
            const isPrereqMet = this.isSkillUnlocked({ id: prereqId }, character);
            const statusIcon = isPrereqMet ? '✅' : '❌';
            const statusClass = isPrereqMet ? 'met' : 'unmet';
            
            return `<li class="prereq-item ${statusClass}">
                <span class="prereq-status">${statusIcon}</span>
                <span class="prereq-name">${this.formatSkillName(prereqId)}</span>
            </li>`;
        }).join('');

        return `
            <div class="tooltip-prerequisites">
                <h4>Prerequisites:</h4>
                <ul class="prereq-list">
                    ${prereqsList}
                </ul>
            </div>
        `;
    }

    /**
     * Build actions HTML (unlock button, etc.)
     * @param {Object} node - Node object
     * @param {Object} character - Current character
     * @param {boolean} canUnlock - Whether skill can be unlocked
     * @returns {string} Actions HTML
     */
    buildActionsHtml(node, character, canUnlock) {
        if (!character) {
            return '<div class="tooltip-action-hint">Select a character to see actions</div>';
        }

        if (this.isSkillUnlocked(node, character)) {
            return '<div class="tooltip-action-hint">✅ Skill already unlocked</div>';
        }

        if (canUnlock) {
            return `
                <div class="tooltip-action-hint">
                    💡 <strong>Shift+Click</strong> to unlock this skill
                </div>
            `;
        }

        return '<div class="tooltip-action-hint">Cannot unlock yet - check prerequisites and lumens</div>';
    }

    /**
     * Position tooltip relative to cursor/node
     * @param {number} x - X position
     * @param {number} y - Y position
     */
    positionTooltip(x, y) {
        if (!this.tooltip) return;

        const rect = this.tooltip.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        
        // Default offset from cursor
        let left = x + 15;
        let top = y - 10;

        // Adjust if tooltip would go off-screen
        if (left + rect.width > viewportWidth) {
            left = x - rect.width - 15;
        }
        
        if (top + rect.height > viewportHeight) {
            top = y - rect.height + 10;
        }

        // Ensure tooltip stays on screen
        left = Math.max(10, Math.min(left, viewportWidth - rect.width - 10));
        top = Math.max(10, Math.min(top, viewportHeight - rect.height - 10));

        this.tooltip.style.left = `${left}px`;
        this.tooltip.style.top = `${top}px`;
    }

    /**
     * Check if a skill is unlocked for the character
     * @param {Object} node - Node object
     * @param {Object} character - Character object
     * @returns {boolean} Whether skill is unlocked
     */
    isSkillUnlocked(node, character) {
        if (!character || !character.unlockedSkills) return false;
        
        // Check all skill categories in character data
        for (const category in character.unlockedSkills) {
            const categorySkills = character.unlockedSkills[category];
            
            if (typeof categorySkills === 'object') {
                for (const subcategory in categorySkills) {
                    if (Array.isArray(categorySkills[subcategory])) {
                        if (categorySkills[subcategory].includes(node.id)) {
                            return true;
                        }
                    }
                }
            } else if (Array.isArray(categorySkills)) {
                if (categorySkills.includes(node.id)) {
                    return true;
                }
            }
        }
        
        return false;
    }

    /**
     * Check if skill can be unlocked (prerequisites + lumens)
     * @param {Object} node - Node object
     * @param {Object} character - Character object
     * @returns {boolean} Whether skill can be unlocked
     */
    canUnlockSkill(node, character) {
        if (!character) return false;
        if (this.isSkillUnlocked(node, character)) return false;
        
        // Check lumens
        const hasEnoughLumens = character.lumens >= node.cost;
        
        // Check prerequisites
        const prereqsMet = this.arePrerequisitesMet(node, character);
        
        return hasEnoughLumens && prereqsMet;
    }

    /**
     * Check if all prerequisites are met
     * @param {Object} node - Node object
     * @param {Object} character - Character object
     * @returns {boolean} Whether prerequisites are met
     */
    arePrerequisitesMet(node, character) {
        if (!node.prerequisites || node.prerequisites.length === 0) return true;
        if (!character) return false;
        
        return node.prerequisites.every(prereqId => 
            this.isSkillUnlocked({ id: prereqId }, character)
        );
    }

    /**
     * Format category name for display
     * @param {string} category - Category name
     * @returns {string} Formatted category
     */
    formatCategory(category) {
        if (category.startsWith('racial_')) {
            const race = category.replace('racial_', '');
            return `${race.charAt(0).toUpperCase() + race.slice(1)} Racial`;
        }
        
        return category.charAt(0).toUpperCase() + category.slice(1).replace(/_/g, ' ');
    }

    /**
     * Format skill name from ID
     * @param {string} skillId - Skill ID
     * @returns {string} Formatted skill name
     */
    formatSkillName(skillId) {
        return skillId.replace(/_/g, ' ')
                     .replace(/\b\w/g, l => l.toUpperCase());
    }

    /**
     * Update tooltip content if it's currently showing the same node
     * @param {Object} node - Updated node object
     * @param {Object} character - Current character
     */
    updateIfVisible(node, character) {
        if (this.isVisible && this.currentNode && this.currentNode.id === node.id) {
            const content = this.buildTooltipContent(node, character);
            if (this.tooltip) {
                this.tooltip.innerHTML = content;
            }
        }
    }

    /**
     * Destroy tooltip and clean up
     */
    destroy() {
        this.hide();
        
        if (this.tooltip && this.tooltip.parentNode) {
            this.tooltip.parentNode.removeChild(this.tooltip);
        }
        
        clearTimeout(this.fadeTimeout);
        this.tooltip = null;
        this.currentNode = null;
    }
}

// Export for use in other modules
if (typeof window !== 'undefined') {
    window.SkillTooltip = SkillTooltip;
}
