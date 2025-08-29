// Tier-Based Skill Tree Connection Renderer - RESPONSIVE VERSION
class SkillConnectionRenderer {
    constructor() {
        this.svgNamespace = 'http://www.w3.org/2000/svg'

        // Bright colors matching your tier image
        this.skillColors = [
            '#FFD700', // Gold (Sword Basics)
            '#FF3333', // Red (Quick Strike)
            '#33FF33', // Green (Combat Stance) 
            '#3333FF', // Blue (Lunge Attack)
            '#FF33FF', // Magenta (Parry)
            '#33FFFF', // Cyan (Sweeping Slash)
            '#FF8833', // Orange (Blade Dance)
            '#8833FF', // Purple (Defensive Stance)
            '#FFFF33', // Yellow
            '#FF6633', // Orange-Red
            '#33FF88', // Green-Blue
            '#8833CC'  // Purple-Blue
        ]

        this.skillColorMap = new Map()
        this.colorIndex = 0

        // Responsive connection system
        this.activeConnections = null
        this.resizeObserver = null
        this.debounceTimer = null
        this.lastZoomLevel = window.devicePixelRatio || 1

        // Store rendering context for re-rendering
        this.renderContext = {
            container: null,
            skills: null,
            character: null,
            selectedCategory: null,
            selectedSubcategory: null,
            allSkillsData: null
        }

        // Initialize responsive handlers
        this.initializeResponsiveHandlers()
    }

    getSkillColor(skillId) {
        if (!this.skillColorMap.has(skillId)) {
            const color = this.skillColors[this.colorIndex % this.skillColors.length]
            this.skillColorMap.set(skillId, color)
            this.colorIndex++
        }
        return this.skillColorMap.get(skillId)
    }

    // Initialize responsive connection handlers
    initializeResponsiveHandlers() {
        // Window resize handler with debouncing
        window.addEventListener('resize', () => {
            this.debounceRerender('resize')
        })

        // Zoom detection using devicePixelRatio changes  
        window.addEventListener('resize', () => {
            const currentZoom = window.devicePixelRatio || 1
            if (Math.abs(currentZoom - this.lastZoomLevel) > 0.01) {
                console.log('🔍 Zoom change detected:', this.lastZoomLevel, '→', currentZoom)
                this.lastZoomLevel = currentZoom
                this.debounceRerender('zoom')
            }
        })

        // Detect browser zoom via media queries (backup method)
        window.matchMedia('(resolution: 1dppx)').addListener(() => {
            this.debounceRerender('zoom-media')
        })

        // Page visibility change handler (pause updates when tab hidden)
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'visible') {
                console.log('👁️ Tab visible - checking for needed connection updates')
                this.debounceRerender('visibility-restore')
            } else {
                console.log('🙈 Tab hidden - pausing connection updates')
                if (this.debounceTimer) {
                    clearTimeout(this.debounceTimer)
                    this.debounceTimer = null
                }
            }
        })
    }

    // Debounced re-rendering to prevent excessive recalculation
    debounceRerender(reason) {
        if (!this.renderContext.container) return

        // console.log('📐 Scheduling connection update due to:', reason)

        if (this.debounceTimer) {
            clearTimeout(this.debounceTimer)
        }

        this.debounceTimer = setTimeout(() => {
            // console.log('🔄 Re-rendering connections for responsiveness')
            this.renderSkillConnections(
                this.renderContext.container,
                this.renderContext.skills,
                this.renderContext.character,
                this.renderContext.selectedCategory,
                this.renderContext.selectedSubcategory,
                this.renderContext.allSkillsData
            )
        }, 250) // 250ms debounce delay
    }

    // Manual refresh method for major layout changes
    refreshConnections(reason = 'manual') {
        console.log('🔄 Manual connection refresh requested:', reason)
        if (this.debounceTimer) {
            clearTimeout(this.debounceTimer)
        }
        this.debounceRerender(reason)
    }

    renderSkillConnections(container, skills, character, selectedCategory, selectedSubcategory, allSkillsData = null) {
        // console.log('🎨 Starting RESPONSIVE connection renderer...', skills.length, 'skills')

        // Store rendering context for responsive updates
        this.renderContext = {
            container,
            skills,
            character,
            selectedCategory,
            selectedSubcategory,
            allSkillsData
        }

        // Set up container size observation if not already set
        this.setupContainerObserver(container)

        // Remove existing connections only (external boxes no longer created)
        const existingSvg = container.querySelector('.skill-connections-svg')
        if (existingSvg) existingSvg.remove()

        // Store all skills data for cross-tree lookups
        this.allSkillsData = allSkillsData
        this.currentCategory = selectedCategory

        // Create SVG overlay
        const svg = document.createElementNS(this.svgNamespace, 'svg')
        svg.classList.add('skill-connections-svg')
        svg.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 5;
        `

        // Get skill positions
        const skillNodes = container.querySelectorAll('.skill-node')
        const skillPositions = new Map()

        // console.log('🎯 Found', skillNodes.length, 'skill nodes')

        skillNodes.forEach(node => {
            const skillId = node.dataset.skillId
            if (skillId) {
                const rect = node.getBoundingClientRect()
                const containerRect = container.getBoundingClientRect()

                skillPositions.set(skillId, {
                    x: rect.left - containerRect.left + rect.width / 2,
                    y: rect.top - containerRect.top + rect.height / 2,
                    width: rect.width,
                    height: rect.height,
                    element: node
                })
            }
        })

        // console.log('📍 Mapped', skillPositions.size, 'skill positions')

        // Count incoming connections for each skill to plan connection points
        const incomingConnections = new Map()
        skills.forEach(skill => {
            if (skill.prerequisites && skill.prerequisites.skills && skill.prerequisites.skills.length > 0) {
                skill.prerequisites.skills.forEach(prerequisiteId => {
                    if (!incomingConnections.has(skill.id)) {
                        incomingConnections.set(skill.id, [])
                    }
                    incomingConnections.get(skill.id).push(prerequisiteId)
                })
            }
        })

        // Track which input nodes are already used for smart allocation
        const usedInputNodes = new Map() // skillId -> Set of used node indices

        // Create connections with smart node allocation (1 out, multiple in)
        let connectionsCreated = 0
        skills.forEach(skill => {
            if (skill.prerequisites && skill.prerequisites.skills && skill.prerequisites.skills.length > 0) {
                const connectionCount = skill.prerequisites.skills.length

                // Initialize input node tracking for this skill
                if (!usedInputNodes.has(skill.id)) {
                    usedInputNodes.set(skill.id, new Set())
                }

                skill.prerequisites.skills.forEach((prerequisiteId, index) => {
                    // Check if prerequisite exists in current skill tree
                    const prerequisiteInCurrentTree = skills.find(s => s.id === prerequisiteId)

                    if (prerequisiteInCurrentTree) {
                        // Internal connection - existing logic
                        const parentPos = skillPositions.get(prerequisiteId)
                        const childPos = skillPositions.get(skill.id)

                        if (!parentPos || !childPos) {
                            // Skip connection if position data is missing (skills not rendered)
                            return
                        }

                        const inputNodeIndex = this.findBestInputNode(skill.id, connectionCount, usedInputNodes, parentPos, childPos)

                        const success = this.createSmartConnection(
                            svg,
                            skillPositions,
                            prerequisiteId,
                            skill.id,
                            inputNodeIndex,
                            connectionCount,
                            connectionsCreated
                        )

                        if (success) {
                            usedInputNodes.get(skill.id).add(inputNodeIndex)
                            connectionsCreated++
                        }
                    } else {
                        // Skip external prerequisites - visual problems removed
                        // console.log('⏭️ Skipping external prerequisite:', prerequisiteId, 'for', skill.id)
                    }
                })
            }
        })

        // console.log('🔗 Created', connectionsCreated, 'connections')

        // Add SVG to container
        container.style.position = 'relative'
        container.appendChild(svg)
    }

    // Set up container size observation for responsive updates
    setupContainerObserver(container) {
        // Clean up existing observer
        if (this.resizeObserver) {
            this.resizeObserver.disconnect()
        }

        // Use ResizeObserver if available (modern browsers)
        if (window.ResizeObserver) {
            this.resizeObserver = new ResizeObserver((entries) => {
                for (const entry of entries) {
                    if (entry.target === container) {
                        // Don't re-render if container has no valid size
                        if (entry.contentRect.width > 0 && entry.contentRect.height > 0) {
                            // console.log('📏 Container size changed:', entry.contentRect.width, 'x', entry.contentRect.height)
                            this.debounceRerender('container-resize')
                        }
                        break
                    }
                }
            })
            this.resizeObserver.observe(container)
            // console.log('👀 Container observer set up')
        } else {
            // console.log('⚠️ ResizeObserver not supported, using window resize only')
        }
    }

    // Clean up responsive handlers (call when destroying the renderer)
    cleanup() {
        if (this.resizeObserver) {
            this.resizeObserver.disconnect()
            this.resizeObserver = null
        }

        if (this.debounceTimer) {
            clearTimeout(this.debounceTimer)
            this.debounceTimer = null
        }

        // Clear render context
        this.renderContext = {
            container: null,
            skills: null,
            character: null,
            selectedCategory: null,
            selectedSubcategory: null,
            allSkillsData: null
        }

        console.log('🧹 Connection renderer cleaned up')
    }

    // Find best available input node (prefer middle, then closest to parent position, supports up to 5 nodes)
    findBestInputNode(skillId, totalInputNodes, usedInputNodes, parentPosition, childPosition) {
        const usedNodes = usedInputNodes.get(skillId) || new Set()

        // Cap at 5 input nodes maximum
        const maxNodes = Math.min(totalInputNodes, 5)

        if (maxNodes === 1) {
            return 0 // Only one node, use it
        }

        // Safety check for positions
        if (!parentPosition || !childPosition) {
            console.log('❌ Missing position data in findBestInputNode for skill:', skillId)
            return Math.floor(maxNodes / 2) // Fallback to middle
        }

        // For multiple nodes, prefer middle first (index 2 for 5 nodes: 0,1,2,3,4)
        const middleIndex = Math.floor(maxNodes / 2)

        // Try middle first
        if (!usedNodes.has(middleIndex)) {
            return middleIndex
        }

        // If middle is taken, find closest available node to parent position
        const parentX = parentPosition.x
        let bestIndex = middleIndex
        let shortestDistance = Infinity

        for (let i = 0; i < maxNodes; i++) {
            if (!usedNodes.has(i)) {
                // Calculate the X position of this input node
                const inputNodeX = this.calculateInputNodeX(childPosition, i, maxNodes)
                const distance = Math.abs(inputNodeX - parentX)

                if (distance < shortestDistance) {
                    shortestDistance = distance
                    bestIndex = i
                }
            }
        }

        return bestIndex
    }

    // Calculate the X position of an input node (supports up to 5 nodes)
    calculateInputNodeX(skillPos, nodeIndex, totalNodes) {
        if (totalNodes === 1) {
            return skillPos.x
        } else {
            // Support up to 5 input nodes with wider distribution
            const maxNodes = Math.min(totalNodes, 5) // Cap at 5 input nodes
            const actualIndex = Math.min(nodeIndex, maxNodes - 1) // Ensure index doesn't exceed max

            const spacing = (skillPos.width * 0.9) / Math.max(1, maxNodes - 1) // 90% of width for 5 nodes
            const startX = skillPos.x - (skillPos.width * 0.45) // Start 45% left of center
            return startX + (actualIndex * spacing)
        }
    }

    // Create connection with 1 output node and smart input node allocation
    createSmartConnection(svg, skillPositions, fromSkillId, toSkillId, inputNodeIndex, totalInputNodes, globalIndex) {
        const fromPos = skillPositions.get(fromSkillId)
        const toPos = skillPositions.get(toSkillId)

        if (!fromPos || !toPos) {
            console.log('❌ Missing position for connection:', fromSkillId, '->', toSkillId)
            return false
        }

        // Get unique color for this parent skill
        const connectionColor = this.getSkillColor(fromSkillId)

        // Calculate connection points: 1 output (center), smart input allocation
        const outputPoint = this.getSingleOutputPoint(fromPos)
        const inputPoint = this.getSmartInputPoint(toPos, inputNodeIndex, totalInputNodes)

        // Create path with routing offset to avoid overlaps
        const routingOffset = (globalIndex % 5) * 12 // Vertical spacing for routing
        const points = this.createSmartPath(outputPoint.x, outputPoint.y, inputPoint.x, inputPoint.y, routingOffset)

        // Create polyline
        const polyline = document.createElementNS(this.svgNamespace, 'polyline')
        polyline.setAttribute('points', points)
        polyline.setAttribute('stroke', connectionColor)
        polyline.setAttribute('stroke-width', '4')
        polyline.setAttribute('opacity', '0.9')
        polyline.setAttribute('fill', 'none')
        polyline.setAttribute('stroke-linecap', 'round')
        polyline.setAttribute('stroke-linejoin', 'round')
        polyline.classList.add('skill-connection-line')

        svg.appendChild(polyline)

        // Add visual connection nodes
        this.addSmartConnectionNodes(svg, outputPoint, inputPoint, connectionColor)

        // Add colored border to parent skill
        if (fromPos.element) {
            fromPos.element.style.borderColor = connectionColor
            fromPos.element.style.borderWidth = '2px'
            fromPos.element.style.borderStyle = 'solid'
        }

        // console.log('✅ Smart connection created:', fromSkillId, '->', toSkillId, 'Input node:', inputNodeIndex, 'Color:', connectionColor)
        return true
    }

    // Get single output connection point (center of bottom edge)
    getSingleOutputPoint(skillPos) {
        const skillBottom = skillPos.y + (skillPos.height / 2)
        return { x: skillPos.x, y: skillBottom + 5 }
    }

    // Get smart input connection point (distributed across top edge, middle preferred, up to 5 nodes)
    getSmartInputPoint(skillPos, nodeIndex, totalNodes) {
        const skillTop = skillPos.y - (skillPos.height / 2)

        if (totalNodes === 1) {
            // Single input - use center
            return { x: skillPos.x, y: skillTop - 5 }
        } else {
            // Multiple inputs - distribute evenly across top edge (max 5 nodes)
            const maxNodes = Math.min(totalNodes, 5) // Cap at 5 input nodes
            const actualIndex = Math.min(nodeIndex, maxNodes - 1) // Ensure index doesn't exceed max

            const spacing = (skillPos.width * 0.9) / Math.max(1, maxNodes - 1) // 90% of width for 5 nodes
            const startX = skillPos.x - (skillPos.width * 0.45) // Start 45% left of center
            return { x: startX + (actualIndex * spacing), y: skillTop - 5 }
        }
    }

    // Create path between smart connection points
    createSmartPath(startX, startY, endX, endY, routingOffset) {
        const points = []

        // Start point (single output)
        points.push(`${startX},${startY}`)

        // Go down with routing offset to avoid overlaps
        const midY = startY + 30 + routingOffset
        points.push(`${startX},${midY}`)

        // Go horizontal to target column
        points.push(`${endX},${midY}`)

        // Go up to target (smart input allocation)
        points.push(`${endX},${endY}`)

        return points.join(' ')
    }

    // Add visual connection nodes for smart system
    addSmartConnectionNodes(svg, outputPoint, inputPoint, color) {
        // Single output node (center bottom of parent skill)
        const outputNode = document.createElementNS(this.svgNamespace, 'circle')
        outputNode.setAttribute('cx', outputPoint.x)
        outputNode.setAttribute('cy', outputPoint.y)
        outputNode.setAttribute('r', '3')
        outputNode.setAttribute('fill', color)
        outputNode.setAttribute('stroke', '#fff')
        outputNode.setAttribute('stroke-width', '1')
        outputNode.classList.add('connection-output-node')
        svg.appendChild(outputNode)

        // Smart input node (allocated position on top edge)
        const inputNode = document.createElementNS(this.svgNamespace, 'circle')
        inputNode.setAttribute('cx', inputPoint.x)
        inputNode.setAttribute('cy', inputPoint.y)
        inputNode.setAttribute('r', '3')
        inputNode.setAttribute('fill', color)
        inputNode.setAttribute('stroke', '#fff')
        inputNode.setAttribute('stroke-width', '1')
        inputNode.classList.add('connection-input-node')
        svg.appendChild(inputNode)
    }

    // Find a skill across all skill trees
    findSkillInAllTrees(skillId) {
        if (!this.allSkillsData) return null

        for (const [categoryName, categoryData] of Object.entries(this.allSkillsData)) {
            if (typeof categoryData === 'object' && categoryData !== null) {
                for (const [subcategoryName, skills] of Object.entries(categoryData)) {
                    if (Array.isArray(skills)) {
                        const foundSkill = skills.find(skill => skill.id === skillId)
                        if (foundSkill) {
                            return {
                                skill: foundSkill,
                                category: categoryName,
                                subcategory: subcategoryName
                            }
                        }
                    }
                }
            }
        }
        return null
    }

    // Create external prerequisite text box with connection (placed between tier and skill)
    createExternalPrerequisiteBox(container, svg, targetSkill, externalSkillInfo, skillPositions, inputNodeIndex, totalInputNodes, boxIndex) {
        const targetPos = skillPositions.get(targetSkill.id)
        if (!targetPos) return false

        // Find the target skill's tier container to insert the external box
        const targetSkillElement = targetPos.element
        const skillRow = targetSkillElement.closest('.skill-row')
        const tierContainer = skillRow ? skillRow.closest('.skill-tier') : null

        if (!tierContainer) {
            console.log('❌ Could not find tier container for external prerequisite')
            return false
        }

        // Check if external prerequisites section already exists for this tier
        let externalSection = tierContainer.querySelector('.external-prerequisites-section')
        if (!externalSection) {
            // Create external prerequisites section
            externalSection = document.createElement('div')
            externalSection.className = 'external-prerequisites-section'
            externalSection.style.cssText = `
                margin: 10px 0;
                padding: 8px;
                background: rgba(0, 0, 0, 0.1);
                border-radius: 4px;
                border-left: 3px solid #4CAF50;
            `

            // Insert between tier header and skill row
            const tierHeader = tierContainer.querySelector('.tier-header')
            const skillRowElement = tierContainer.querySelector('.skill-row')
            if (tierHeader && skillRowElement) {
                tierContainer.insertBefore(externalSection, skillRowElement)
            }
        }

        // Create external prerequisite box
        const externalBox = document.createElement('div')
        externalBox.className = 'external-prerequisite-box inline-external-box'
        externalBox.dataset.targetSkill = targetSkill.id
        externalBox.dataset.sourceSkill = externalSkillInfo.skill.id
        externalBox.style.cssText = `
            display: inline-block;
            margin: 4px 8px 4px 0;
            padding: 6px 10px;
            background: linear-gradient(135deg, #2a4a2a, #3a5a3a);
            border: 2px solid #4CAF50;
            border-radius: 6px;
            font-size: 11px;
            color: #fff;
            cursor: pointer;
            transition: all 0.3s ease;
            position: relative;
        `

        // Format skill tree name
        const categoryName = externalSkillInfo.category.charAt(0).toUpperCase() + externalSkillInfo.category.slice(1)
        const subcategoryName = externalSkillInfo.subcategory.charAt(0).toUpperCase() + externalSkillInfo.subcategory.slice(1)

        externalBox.innerHTML = `
            <span style="font-weight: bold; color: #4CAF50;">
                ${externalSkillInfo.skill.name}
            </span>
            <span style="color: #ccc; margin-left: 4px;">
                - ${subcategoryName}
            </span>
            <span style="color: #999; margin-left: 2px;">
                (${categoryName})
            </span>
        `

        // Add to external section
        externalSection.appendChild(externalBox)

        // Create connection from external box to target skill
        setTimeout(() => {
            // Verify the box is still in the DOM and properly positioned
            if (externalBox.parentElement && document.contains(externalBox)) {
                this.createExternalToSkillConnection(svg, externalBox, targetPos, inputNodeIndex, totalInputNodes)
            } else {
                console.log('⚠️ External box not found in DOM, skipping connection')
            }
        }, 100) // Increased delay to ensure box is fully positioned

        console.log('📦 Inline external prerequisite created:', externalSkillInfo.skill.name, 'for', targetSkill.name)
        return true
    }

    // Create connection from inline external box to target skill
    createExternalToSkillConnection(svg, externalBox, targetPos, inputNodeIndex, totalInputNodes) {
        try {
            // Safety checks
            if (!externalBox || !externalBox.parentElement || !document.contains(externalBox)) {
                console.log('⚠️ External box not available for connection')
                return
            }

            if (!svg || !svg.parentElement) {
                console.log('⚠️ SVG not available for connection')
                return
            }

            const boxRect = externalBox.getBoundingClientRect()
            const containerRect = svg.parentElement.getBoundingClientRect()

            // Verify we got valid rects
            if (boxRect.width === 0 || boxRect.height === 0) {
                console.log('⚠️ External box has invalid dimensions, skipping connection')
                return
            }

            // Calculate connection points
            const boxCenterX = (boxRect.left - containerRect.left) + (boxRect.width / 2)
            const boxBottomY = (boxRect.bottom - containerRect.top)

            const inputPoint = this.getSmartInputPoint(targetPos, inputNodeIndex, totalInputNodes)
            const connectionColor = '#4CAF50' // Green for external connections

            // Create curved connection path
            const points = this.createInlineExternalConnectionPath(boxCenterX, boxBottomY, inputPoint.x, inputPoint.y)

            const polyline = document.createElementNS(this.svgNamespace, 'polyline')
            polyline.setAttribute('points', points)
            polyline.setAttribute('stroke', connectionColor)
            polyline.setAttribute('stroke-width', '3')
            polyline.setAttribute('opacity', '0.8')
            polyline.setAttribute('fill', 'none')
            polyline.setAttribute('stroke-linecap', 'round')
            polyline.setAttribute('stroke-linejoin', 'round')
            polyline.setAttribute('stroke-dasharray', '5,3')
            polyline.classList.add('external-connection-line')

            if (externalBox.dataset) {
                polyline.dataset.sourceBox = externalBox.dataset.sourceSkill
                polyline.dataset.targetSkill = externalBox.dataset.targetSkill
            }

            svg.appendChild(polyline)

            // Add connection nodes
            this.addInlineExternalConnectionNodes(svg, boxCenterX, boxBottomY, inputPoint, connectionColor)

            console.log('✅ External connection created successfully')

        } catch (error) {
            console.log('❌ Error creating external connection:', error.message)
        }
    }

    // Create path for inline external connections
    createInlineExternalConnectionPath(startX, startY, endX, endY) {
        const points = []

        // Start from bottom of external box
        points.push(`${startX},${startY}`)

        // Create a gentle curve down to the skill
        const midY = startY + Math.min(30, Math.abs(endY - startY) / 2)
        points.push(`${startX},${midY}`)

        // Curve towards target
        const curveX = startX + (endX - startX) * 0.7
        points.push(`${curveX},${midY}`)

        // Final approach to input point
        points.push(`${endX},${endY}`)

        return points.join(' ')
    }

    // Add visual nodes for inline external connections
    addInlineExternalConnectionNodes(svg, outputX, outputY, inputPoint, color) {
        // Output node (bottom of external box)
        const outputNode = document.createElementNS(this.svgNamespace, 'circle')
        outputNode.setAttribute('cx', outputX)
        outputNode.setAttribute('cy', outputY)
        outputNode.setAttribute('r', '3')
        outputNode.setAttribute('fill', color)
        outputNode.setAttribute('stroke', '#fff')
        outputNode.setAttribute('stroke-width', '1')
        outputNode.classList.add('external-output-node')
        svg.appendChild(outputNode)

        // Input node (skill input point)
        const inputNode = document.createElementNS(this.svgNamespace, 'circle')
        inputNode.setAttribute('cx', inputPoint.x)
        inputNode.setAttribute('cy', inputPoint.y)
        inputNode.setAttribute('r', '3')
        inputNode.setAttribute('fill', color)
        inputNode.setAttribute('stroke', '#fff')
        inputNode.setAttribute('stroke-width', '1')
        inputNode.classList.add('external-input-node')
        svg.appendChild(inputNode)
    }

    // Create path for external connections
    createExternalConnectionPath(startX, startY, endX, endY) {
        const points = []

        // Start from bottom of external box
        points.push(`${startX},${startY}`)

        // Go down a bit
        const midY = startY + 20
        points.push(`${startX},${midY}`)

        // Go horizontal towards target
        points.push(`${endX},${midY}`)

        // Go up to input point
        points.push(`${endX},${endY}`)

        return points.join(' ')
    }

    // Add visual nodes for external connections
    addExternalConnectionNodes(svg, outputX, outputY, inputPoint, color) {
        // Output node (bottom of external box)
        const outputNode = document.createElementNS(this.svgNamespace, 'circle')
        outputNode.setAttribute('cx', outputX)
        outputNode.setAttribute('cy', outputY)
        outputNode.setAttribute('r', '4')
        outputNode.setAttribute('fill', color)
        outputNode.setAttribute('stroke', '#fff')
        outputNode.setAttribute('stroke-width', '1')
        outputNode.classList.add('external-output-node')
        svg.appendChild(outputNode)

        // Input node (skill input point)
        const inputNode = document.createElementNS(this.svgNamespace, 'circle')
        inputNode.setAttribute('cx', inputPoint.x)
        inputNode.setAttribute('cy', inputPoint.y)
        inputNode.setAttribute('r', '4')
        inputNode.setAttribute('fill', color)
        inputNode.setAttribute('stroke', '#fff')
        inputNode.setAttribute('stroke-width', '1')
        inputNode.classList.add('external-input-node')
        svg.appendChild(inputNode)
    }

    // Create deletion marker for missing prerequisites
    createDeleteMarker(container, svg, targetSkill, missingSkillId, skillPositions, inputNodeIndex, totalInputNodes) {
        const targetPos = skillPositions.get(targetSkill.id)
        if (!targetPos) return

        // Position delete marker near the target skill
        const markerX = targetPos.x + (targetPos.width / 2) + 10
        const markerY = targetPos.y - (targetPos.height / 2) - 30

        // Create delete marker box
        const deleteMarker = document.createElement('div')
        deleteMarker.className = 'delete-marker'
        deleteMarker.style.cssText = `
            position: absolute;
            left: ${markerX}px;
            top: ${markerY}px;
            width: 80px;
            height: 30px;
            background: linear-gradient(135deg, #ff4444, #cc3333);
            border: 2px solid #ff6666;
            border-radius: 4px;
            padding: 2px 4px;
            font-size: 10px;
            color: #fff;
            text-align: center;
            font-weight: bold;
            box-shadow: 0 2px 8px rgba(255,0,0,0.3);
            z-index: 20;
            animation: pulse 2s infinite;
        `

        deleteMarker.innerHTML = `
            <div style="font-size: 12px; color: #fff;">DELETE</div>
            <div style="font-size: 8px; color: #ffcccc;">${missingSkillId}</div>
        `

        container.appendChild(deleteMarker)

        // Create warning connection line
        const inputPoint = this.getSmartInputPoint(targetPos, inputNodeIndex, totalInputNodes)
        const warningColor = '#ff4444'

        const points = `${markerX + 40},${markerY + 30} ${inputPoint.x},${inputPoint.y}`

        const polyline = document.createElementNS(this.svgNamespace, 'polyline')
        polyline.setAttribute('points', points)
        polyline.setAttribute('stroke', warningColor)
        polyline.setAttribute('stroke-width', '3')
        polyline.setAttribute('opacity', '0.8')
        polyline.setAttribute('fill', 'none')
        polyline.setAttribute('stroke-dasharray', '3,3')
        polyline.classList.add('delete-marker-line')

        svg.appendChild(polyline)

        console.log('🚨 DELETE marker created for missing skill:', missingSkillId, 'required by', targetSkill.id)
    }

    // Legacy function for compatibility (not used)
    createSimplePath(startX, startY, endX, endY, offset) {
        const points = []

        // Start point
        points.push(`${startX},${startY}`)

        // Go down with slight offset
        const midY = startY + 30 + offset
        points.push(`${startX},${midY}`)

        // Go horizontal to target column
        points.push(`${endX},${midY}`)

        // Go up to target
        points.push(`${endX},${endY}`)

        return points.join(' ')
    }
}

// Initialize
window.skillConnectionRenderer = new SkillConnectionRenderer()
console.log('🎨 SAFE Skill Connection Renderer initialized')