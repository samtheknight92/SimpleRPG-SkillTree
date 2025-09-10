# PowerShell script to add all missing characters to premade-characters-data.js

Write-Host "🚀 Starting comprehensive character addition..." -ForegroundColor Green
Write-Host ""

# Configuration
$CHARACTER_DIRS = @(
    "Potential Pre-made characters/Human Enemies",
    "Potential Pre-made characters/Pedestrian NPC",
    "Potential Pre-made characters/Common Monsters"
)

$OUTPUT_FILE = "premade-characters-data.js"
$BACKUP_FILE = "premade-characters-data-backup.js"

# Create backup of existing file
if (Test-Path $OUTPUT_FILE) {
    Copy-Item $OUTPUT_FILE $BACKUP_FILE
    Write-Host "✅ Created backup: $BACKUP_FILE" -ForegroundColor Green
}

# Read existing data file
$existingData = @{}
if (Test-Path $OUTPUT_FILE) {
    try {
        $content = Get-Content $OUTPUT_FILE -Raw
        $match = [regex]::Match($content, 'const PREMADE_CHARACTERS_DATA = ({[\s\S]*?});')
        if ($match.Success) {
            $jsonContent = $match.Groups[1].Value
            $existingData = $jsonContent | ConvertFrom-Json -AsHashtable
            Write-Host "📖 Loaded existing data with $($existingData.Count) characters" -ForegroundColor Cyan
        }
    } catch {
        Write-Host "⚠️  Could not parse existing data file: $($_.Exception.Message)" -ForegroundColor Yellow
    }
}

# Function to determine filter category
function Get-FilterCategory {
    param($character, $filename)
    
    $name = if ($character.name) { $character.name.ToLower() } else { "" }
    $race = if ($character.race) { $character.race.ToLower() } else { "" }
    $isMonster = if ($character.isMonster) { $character.isMonster } else { $false }
    
    # Human characters (not monsters)
    if (-not $isMonster) {
        if ($filename -like "*Pedestrian*") {
            return "Pedestrian"
        }
        return "Human Enemies"
    }
    
    # Monster categories
    if ($race -eq "goblin" -or $name -like "*goblin*") { return "Goblins" }
    if ($race -eq "orc" -or $name -like "*orc*") { return "Orcs" }
    if ($race -eq "dragon" -or $name -like "*dragon*") { return "Dragons" }
    if ($race -eq "slime" -or $name -like "*slime*") { return "Slimes" }
    if ($race -eq "giant" -or $name -like "*giant*") { return "Giants" }
    if ($race -eq "golem" -or $name -like "*golem*") { return "Golems" }
    if ($race -eq "sprite" -or $name -like "*sprite*") { return "Sprites" }
    if ($race -eq "serpent" -or $name -like "*serpent*") { return "Serpents" }
    if ($race -eq "fish" -or $name -like "*fish*") { return "Fish" }
    if ($race -eq "octopus" -or $name -like "*octopus*") { return "Octopi" }
    if ($race -eq "ghost" -or $name -like "*ghost*" -or $name -like "*specter*" -or $name -like "*phantom*" -or $name -like "*banshee*" -or $name -like "*revenant*") { return "Ghosts" }
    if ($race -eq "wyvern" -or $name -like "*wyvern*") { return "Wyverns" }
    if ($race -eq "angel" -or $name -like "*angel*") { return "Angels" }
    if ($race -eq "devil" -or $name -like "*devil*" -or $name -like "*demon*") { return "Devils" }
    if ($race -eq "shadow" -or $name -like "*shadow*") { return "Shadows" }
    if ($race -eq "rat" -or $name -like "*rat*") { return "Rats" }
    if ($name -like "*possessed*" -or $name -like "*cursed*" -or $name -like "*haunted*" -or $name -like "*living*" -or $name -like "*blessed*") { return "Possessed Items" }
    
    # Default fallback
    return "Other Monsters"
}

# Process all character files
$processedCount = 0
$skippedCount = 0
$errorCount = 0
$categoryStats = @{}

foreach ($dir in $CHARACTER_DIRS) {
    if (-not (Test-Path $dir)) {
        Write-Host "⚠️  Directory not found: $dir" -ForegroundColor Yellow
        continue
    }
    
    Write-Host "📁 Processing directory: $dir" -ForegroundColor Cyan
    $files = Get-ChildItem $dir -Filter "*.json" | Select-Object -ExpandProperty Name
    Write-Host "   Found $($files.Count) character files" -ForegroundColor White
    
    foreach ($file in $files) {
        $filePath = Join-Path $dir $file
        
        try {
            # Check if character already exists
            if ($existingData.ContainsKey($file)) {
                Write-Host "   ⏭️  Skipping $file : Already exists" -ForegroundColor Yellow
                $skippedCount++
                continue
            }
            
            # Read and parse character file
            $content = Get-Content $filePath -Raw
            $character = $content | ConvertFrom-Json
            
            # Validate required fields
            if (-not $character.id -or -not $character.name) {
                Write-Host "   ⚠️  Skipping $file : Missing required fields (id, name)" -ForegroundColor Red
                $errorCount++
                continue
            }
            
            # Calculate level if not present
            if (-not $character.level) {
                $stats = if ($character.stats) { $character.stats } else { @{} }
                $tierPoints = if ($character.tierPoints) { $character.tierPoints } else { 0 }
                $statPoints = ($stats.strength + $stats.magicPower + $stats.accuracy + $stats.speed + $stats.physicalDefence + $stats.magicalDefence)
                $totalPoints = $tierPoints + $statPoints
                
                if ($totalPoints -le 0) { $character.level = 1 }
                elseif ($totalPoints -le 10) { $character.level = 1 }
                elseif ($totalPoints -le 20) { $character.level = 2 }
                elseif ($totalPoints -le 30) { $character.level = 3 }
                elseif ($totalPoints -le 40) { $character.level = 4 }
                elseif ($totalPoints -le 50) { $character.level = 5 }
                elseif ($totalPoints -le 60) { $character.level = 6 }
                elseif ($totalPoints -le 70) { $character.level = 7 }
                elseif ($totalPoints -le 80) { $character.level = 8 }
                elseif ($totalPoints -le 90) { $character.level = 9 }
                elseif ($totalPoints -le 100) { $character.level = 10 }
                elseif ($totalPoints -le 120) { $character.level = 11 }
                elseif ($totalPoints -le 140) { $character.level = 12 }
                elseif ($totalPoints -le 160) { $character.level = 13 }
                elseif ($totalPoints -le 180) { $character.level = 14 }
                elseif ($totalPoints -le 200) { $character.level = 15 }
                elseif ($totalPoints -le 230) { $character.level = 16 }
                elseif ($totalPoints -le 260) { $character.level = 17 }
                elseif ($totalPoints -le 290) { $character.level = 18 }
                elseif ($totalPoints -le 320) { $character.level = 19 }
                else { $character.level = 20 }
            }
            
            # Determine filter category
            $category = Get-FilterCategory $character $file
            $character | Add-Member -NotePropertyName "filterCategory" -NotePropertyValue $category -Force
            
            # Track category stats
            if ($categoryStats.ContainsKey($category)) {
                $categoryStats[$category]++
            } else {
                $categoryStats[$category] = 1
            }
            
            # Add to existing data
            $existingData[$file] = $character
            $processedCount++
            
            Write-Host "   ✅ $file -> $category (Level $($character.level))" -ForegroundColor Green
            
        } catch {
            Write-Host "   ❌ Error processing $file : $($_.Exception.Message)" -ForegroundColor Red
            $errorCount++
        }
    }
    Write-Host ""
}

# Generate the output file
$outputContent = @"
// premade-characters-data.js
// This file contains all pre-made character data for the Dev Mode character selector
// Generated automatically - do not edit manually

const PREMADE_CHARACTERS_DATA = $($existingData | ConvertTo-Json -Depth 10);

window.PREMADE_CHARACTERS_DATA = PREMADE_CHARACTERS_DATA;
"@

# Write the output file
$outputContent | Out-File -FilePath $OUTPUT_FILE -Encoding UTF8

# Print summary
Write-Host "🎉 Character processing complete!" -ForegroundColor Green
Write-Host "📊 Summary:" -ForegroundColor Cyan
Write-Host "   ✅ Successfully processed: $processedCount characters" -ForegroundColor Green
Write-Host "   ⏭️  Skipped (already exist): $skippedCount characters" -ForegroundColor Yellow
Write-Host "   ❌ Errors encountered: $errorCount characters" -ForegroundColor Red
Write-Host "   📁 Total characters in data file: $($existingData.Count)" -ForegroundColor White
Write-Host "   📄 Output file: $OUTPUT_FILE" -ForegroundColor White
Write-Host "   💾 Backup file: $BACKUP_FILE" -ForegroundColor White

Write-Host ""
Write-Host "📈 Category breakdown:" -ForegroundColor Cyan
$categoryStats.GetEnumerator() | Sort-Object Value -Descending | ForEach-Object {
    Write-Host "   $($_.Key): $($_.Value) characters" -ForegroundColor White
}

Write-Host ""
Write-Host "🔍 Next steps:" -ForegroundColor Cyan
Write-Host "   1. Test the Dev Mode character selector in your application" -ForegroundColor White
Write-Host "   2. Verify all filter categories work correctly" -ForegroundColor White
Write-Host "   3. Test character loading functionality" -ForegroundColor White
Write-Host "   4. Check for any console errors" -ForegroundColor White

if ($errorCount -gt 0) {
    Write-Host ""
    Write-Host "⚠️  $errorCount files had errors and were skipped. Check the output above for details." -ForegroundColor Red
}
