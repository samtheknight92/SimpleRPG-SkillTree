/** Legacy effect IDs → generic entry (+ default potency/duration when missing). */
export const LEGACY_EFFECT_MIGRATION = {
  temp_strength_1: { effectId: 'temp_strength', potency: 1 },
  temp_strength_3: { effectId: 'temp_strength', potency: 3 },
  temp_strength_5: { effectId: 'temp_strength', potency: 5 },
  temp_magic_1: { effectId: 'temp_magic', potency: 1 },
  temp_magic_3: { effectId: 'temp_magic', potency: 3 },
  temp_speed_2: { effectId: 'temp_speed', potency: 2 },
  temp_speed_3: { effectId: 'temp_speed', potency: 3 },
  temp_defense_4: { effectId: 'temp_defense', potency: 4 },
  temp_defense_minus_2: { effectId: 'temp_defense', potency: -2 },
  invisibility_5_turns: { effectId: 'invisibility', duration: 5 },
  fire_immunity_10_turns: { effectId: 'fire_immunity', duration: 10 },
  cold_immunity_10_turns: { effectId: 'cold_immunity', duration: 10 }
}

/** @deprecated Use LEGACY_EFFECT_MIGRATION */
export const LEGACY_TEMP_EFFECT_MIGRATION = LEGACY_EFFECT_MIGRATION

export function migrateLegacyStatusEffect(entry, normalizeEffectId) {
  if (!entry) return entry
  const id = normalizeEffectId(entry.effectId || entry.id || entry.name)
  const row = LEGACY_EFFECT_MIGRATION[id]
  if (!row) return entry
  const migrated = { ...entry, effectId: row.effectId }
  if (migrated.potency === '' || migrated.potency === undefined || migrated.potency === null) {
    if (row.potency != null) migrated.potency = row.potency
  }
  if (migrated.duration === '' || migrated.duration === undefined || migrated.duration === null) {
    if (row.duration != null) migrated.duration = row.duration
  }
  return migrated
}

/** @deprecated */
export const migrateLegacyTempStatus = migrateLegacyStatusEffect

export function effectPotencyStats(effect) {
  if (!effect) return []
  if (Array.isArray(effect.potencyStats) && effect.potencyStats.length) return effect.potencyStats
  if (effect.potencyStat) return [effect.potencyStat]
  return []
}

/** Stat modifiers for an applied status — potency scales temp stat buffs. */
export function statusStatModifiers(status, effect) {
  const stats = effectPotencyStats(effect)
  if (stats.length) {
    const potency = Number(status?.potency ?? effect?.potency ?? 0)
    if (!potency) return {}
    return Object.fromEntries(stats.map(stat => [stat, potency]))
  }
  return effect?.statModifiers || {}
}

export function effectUsesPotencyForStats(effect) {
  return effectPotencyStats(effect).length > 0
}
