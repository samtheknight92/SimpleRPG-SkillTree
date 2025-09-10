# Read the file
$content = Get-Content "premade-characters-data.js"

# Find where the duplication starts by looking for the second occurrence of Mercenary
$mercenaryLines = @()
for ($i = 0; $i -lt $content.Length; $i++) {
    if ($content[$i] -match '"Mercenary_character\.json":') {
        $mercenaryLines += $i + 1  # Convert to 1-based line numbers
    }
}

if ($mercenaryLines.Count -ge 2) {
    $duplicateStartLine = $mercenaryLines[1] - 1  # Convert back to 0-based index
    
    Write-Host "Found duplicate starting at line $($mercenaryLines[1])"
    
    # Take only the first part (before duplication)
    $cleanContent = $content[0..($duplicateStartLine - 1)]
    
    # Add the closing brace for the object
    $cleanContent += "}"
    
    # Write the cleaned content
    $cleanContent | Set-Content "premade-characters-data-clean.js"
    
    Write-Host "Removed duplicate section. Original: $($content.Length) lines, Clean: $($cleanContent.Length) lines"
} else {
    Write-Host "No duplicates found"
}
