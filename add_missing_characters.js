const fs = require('fs')
const path = require('path')

// Configuration
const CHARACTER_DIRS = [
    'Potential Pre-made characters/Human Enemies',
    'Potential Pre-made characters/Pedestrian NPC',
    'Potential Pre-made characters/Common Monsters'
]

const OUTPUT_FILE = 'premade-characters-data.js'
const BACKUP_FILE = 'premade-characters-data-backup.js'

console.log('🚀 Starting comprehensive character addition...\n')

// Create backup of existing file
if (fs.existsSync(OUTPUT_FILE)) {
    fs.copyFileSync(OUTPUT_FILE, BACKUP_FILE)
    console.log(`✅ Created backup: ${BACKUP_FILE}`)
}

// Read existing data file
let existingData = {}
if (fs.existsSync(OUTPUT_FILE)) {
    try {
        const content = fs.readFileSync(OUTPUT_FILE, 'utf8')
        const match = content.match(/const PREMADE_CHARACTERS_DATA = ({[\s\S]*?});/)
        if (match) {
            existingData = JSON.parse(match[1])
            console.log(`📖 Loaded existing data with ${Object.keys(existingData).length} characters`)
        }
    } catch (error) {
        console.log(`⚠️  Could not parse existing data file: ${error.message}`)
    }
}

// Function to determine filter category
function getFilterCategory(character, filename) {
    const name = character.name?.toLowerCase() || ''
    const race = character.race?.toLowerCase() || ''
    const isMonster = character.isMonster || false

    // Human characters (not monsters)
    if (!isMonster) {
        if (filename.includes('Pedestrian')) {
            return 'Pedestrian'
        }
        return 'Human Enemies'
    }

    // Monster categories
    if (race === 'goblin' || name.includes('goblin')) return 'Goblins'
    if (race === 'orc' || name.includes('orc')) return 'Orcs'
    if (race === 'dragon' || name.includes('dragon')) return 'Dragons'
    if (race === 'slime' || name.includes('slime')) return 'Slimes'
    if (race === 'giant' || name.includes('giant')) return 'Giants'
    if (race === 'golem' || name.includes('golem')) return 'Golems'
    if (race === 'sprite' || name.includes('sprite')) return 'Sprites'
    if (race === 'serpent' || name.includes('serpent')) return 'Serpents'
    if (race === 'fish' || name.includes('fish')) return 'Fish'
    if (race === 'octopus' || name.includes('octopus')) return 'Octopi'
    if (race === 'ghost' || name.includes('ghost') || name.includes('specter') || name.includes('phantom') || name.includes('banshee') || name.includes('revenant')) return 'Ghosts'
    if (race === 'wyvern' || name.includes('wyvern')) return 'Wyverns'
    if (race === 'angel' || name.includes('angel')) return 'Angels'
    if (race === 'devil' || name.includes('devil') || name.includes('demon')) return 'Devils'
    if (race === 'shadow' || name.includes('shadow')) return 'Shadows'
    if (race === 'rat' || name.includes('rat')) return 'Rats'
    if (name.includes('possessed') || name.includes('cursed') || name.includes('haunted') || name.includes('living') || name.includes('blessed')) return 'Possessed Items'

    // Default fallback
    return 'Other Monsters'
}

// Process all character files
let processedCount = 0
let skippedCount = 0
let errorCount = 0
let categoryStats = {}

for (const dir of CHARACTER_DIRS) {
    if (!fs.existsSync(dir)) {
        console.log(`⚠️  Directory not found: ${dir}`)
        continue
    }

    console.log(`📁 Processing directory: ${dir}`)
    const files = fs.readdirSync(dir).filter(file => file.endsWith('.json'))
    console.log(`   Found ${files.length} character files`)

    for (const file of files) {
        const filePath = path.join(dir, file)

        try {
            // Check if character already exists
            if (existingData[file]) {
                console.log(`   ⏭️  Skipping ${file}: Already exists`)
                skippedCount++
                continue
            }

            // Read and parse character file
            const content = fs.readFileSync(filePath, 'utf8')
            const character = JSON.parse(content)

            // Validate required fields
            if (!character.id || !character.name) {
                console.log(`   ⚠️  Skipping ${file}: Missing required fields (id, name)`)
                errorCount++
                continue
            }

            // Calculate level if not present
            if (!character.level) {
                const stats = character.stats || {}
                const tierPoints = character.tierPoints || 0
                const statPoints = (stats.strength || 0) + (stats.magicPower || 0) + (stats.accuracy || 0) + (stats.speed || 0) + (stats.physicalDefence || 0) + (stats.magicalDefence || 0)
                const totalPoints = tierPoints + statPoints

                if (totalPoints <= 0) character.level = 1
                else if (totalPoints <= 10) character.level = 1
                else if (totalPoints <= 20) character.level = 2
                else if (totalPoints <= 30) character.level = 3
                else if (totalPoints <= 40) character.level = 4
                else if (totalPoints <= 50) character.level = 5
                else if (totalPoints <= 60) character.level = 6
                else if (totalPoints <= 70) character.level = 7
                else if (totalPoints <= 80) character.level = 8
                else if (totalPoints <= 90) character.level = 9
                else if (totalPoints <= 100) character.level = 10
                else if (totalPoints <= 120) character.level = 11
                else if (totalPoints <= 140) character.level = 12
                else if (totalPoints <= 160) character.level = 13
                else if (totalPoints <= 180) character.level = 14
                else if (totalPoints <= 200) character.level = 15
                else if (totalPoints <= 230) character.level = 16
                else if (totalPoints <= 260) character.level = 17
                else if (totalPoints <= 290) character.level = 18
                else if (totalPoints <= 320) character.level = 19
                else character.level = 20
            }

            // Determine filter category
            const category = getFilterCategory(character, file)
            character.filterCategory = category

            // Track category stats
            categoryStats[category] = (categoryStats[category] || 0) + 1

            // Add to existing data
            existingData[file] = character
            processedCount++

            console.log(`   ✅ ${file} -> ${category} (Level ${character.level})`)

        } catch (error) {
            console.log(`   ❌ Error processing ${file}: ${error.message}`)
            errorCount++
        }
    }
    console.log('')
}

// Generate the output file
const outputContent = `// premade-characters-data.js
// This file contains all pre-made character data for the Dev Mode character selector
// Generated automatically - do not edit manually

const PREMADE_CHARACTERS_DATA = ${JSON.stringify(existingData, null, 2)};

window.PREMADE_CHARACTERS_DATA = PREMADE_CHARACTERS_DATA;
`

// Write the output file
fs.writeFileSync(OUTPUT_FILE, outputContent)

// Print summary
console.log('🎉 Character processing complete!')
console.log(`📊 Summary:`)
console.log(`   ✅ Successfully processed: ${processedCount} characters`)
console.log(`   ⏭️  Skipped (already exist): ${skippedCount} characters`)
console.log(`   ❌ Errors encountered: ${errorCount} characters`)
console.log(`   📁 Total characters in data file: ${Object.keys(existingData).length}`)
console.log(`   📄 Output file: ${OUTPUT_FILE}`)
console.log(`   💾 Backup file: ${BACKUP_FILE}`)

console.log(`\n📈 Category breakdown:`)
Object.entries(categoryStats).sort((a, b) => b[1] - a[1]).forEach(([category, count]) => {
    console.log(`   ${category}: ${count} characters`)
})

console.log(`\n🔍 Next steps:`)
console.log(`   1. Test the Dev Mode character selector in your application`)
console.log(`   2. Verify all filter categories work correctly`)
console.log(`   3. Test character loading functionality`)
console.log(`   4. Check for any console errors`)

if (errorCount > 0) {
    console.log(`\n⚠️  ${errorCount} files had errors and were skipped. Check the output above for details.`)
}
