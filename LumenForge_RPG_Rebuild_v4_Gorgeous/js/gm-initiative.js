export function createInitiativeEntry(name = '', initiative = '') {
  return {
    id: `init_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`,
    name: String(name || '').trim(),
    initiative: initiative === '' || initiative == null ? '' : Number(initiative)
  }
}

export function sortInitiativeEntries(entries = []) {
  return [...entries].sort((a, b) => {
    const aVal = Number(a.initiative)
    const bVal = Number(b.initiative)
    const aScore = Number.isFinite(aVal) ? aVal : -Infinity
    const bScore = Number.isFinite(bVal) ? bVal : -Infinity
    if (bScore !== aScore) return bScore - aScore
    return String(a.name || '').localeCompare(String(b.name || ''))
  })
}

export function nextTurnEntryId(entries = [], activeId = null) {
  const sorted = sortInitiativeEntries(entries)
  if (!sorted.length) return null
  if (!activeId) return sorted[0].id
  const index = sorted.findIndex(entry => entry.id === activeId)
  if (index === -1) return sorted[0].id
  return sorted[(index + 1) % sorted.length].id
}

export function activeInitiativeEntry(entries = [], activeId = null) {
  const sorted = sortInitiativeEntries(entries)
  if (!sorted.length) return null
  if (!activeId) return sorted[0]
  return sorted.find(entry => entry.id === activeId) || sorted[0]
}
