const fs = require('fs')

// Read the file
let content = fs.readFileSync('premade-characters-data.js', 'utf8')

// Fix duplicate isEnemy fields - remove consecutive duplicates
content = content.replace(/(\s*"isEnemy": true,\s*)\1+/g, '$1')

// Fix duplicate isEnemy fields with different spacing
content = content.replace(/(\s*"isEnemy": true,\s*)\s*"isEnemy": true,\s*/g, '$1')

// Write the fixed content
fs.writeFileSync('premade-characters-data-fixed.js', content)

console.log('Fixed duplicate isEnemy fields')
