# Read the file
$content = Get-Content "premade-characters-data.js" -Raw

# Fix duplicate isEnemy fields - remove consecutive duplicates
$content = $content -replace '(\s*"isEnemy": true,\s*)\1+', '$1'

# Fix duplicate isEnemy fields with different spacing
$content = $content -replace '(\s*"isEnemy": true,\s*)\s*"isEnemy": true,\s*', '$1'

# Write the fixed content
$content | Set-Content "premade-characters-data-fixed.js" -NoNewline

Write-Host "Fixed duplicate isEnemy fields"
