/** Strip trailing " 2", " 3", or stacked " Copy" suffixes from a roster name. */
export function baseCharacterName(name) {
  let base = String(name || '').trim()
  base = base.replace(/\s+Copy(?:\s+Copy)*$/i, '').trim()
  base = base.replace(/\s+\d+$/, '').trim()
  return base || 'Character'
}

function nameMatchesBase(name, base) {
  const trimmed = String(name || '').trim()
  const escaped = base.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  return new RegExp(`^${escaped}(?:\\s+(\\d+))?$`, 'i').test(trimmed)
}

/** Next unused name: "Thief", then "Thief 2", "Thief 3", … */
export function nextCharacterName(baseName, existingNames = []) {
  const base = baseCharacterName(baseName)
  let maxNum = 0
  let hasAny = false

  for (const name of existingNames) {
    if (!nameMatchesBase(name, base)) continue
    hasAny = true
    const match = String(name).trim().match(new RegExp(`^${base.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?:\\s+(\\d+))?$`, 'i'))
    const num = match?.[1] ? Number(match[1]) : 1
    maxNum = Math.max(maxNum, num)
  }

  if (!hasAny) return base
  return `${base} ${maxNum + 1}`
}

export function allocateCharacterName(baseName, existingNames = []) {
  const base = baseCharacterName(baseName)
  const taken = new Set(existingNames.map(name => String(name).trim().toLowerCase()))
  if (!taken.has(base.toLowerCase())) return base
  return nextCharacterName(base, existingNames)
}

export function countCharactersWithBaseName(baseName, existingNames = []) {
  const base = baseCharacterName(baseName)
  return existingNames.filter(name => nameMatchesBase(name, base)).length
}
