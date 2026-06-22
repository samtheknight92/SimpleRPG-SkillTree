import { getEquippedOffhand } from './equipment.js'

/** Action skills that sustain a song (aura on self while performing). */
export const MUSICIAN_PERFORMANCE_SKILL_IDS = new Set([
  'work_song',
  'marching_tune',
  'soothing_hymn',
  'battle_anthem',
  'dissonant_note'
])

const AMPLIFY_BY_RARITY = {
  common: { extraTurns: 1, performerCount: 1, listenerBonus: 0 },
  uncommon: { extraTurns: 1, performerCount: 2, listenerBonus: 0 },
  rare: { extraTurns: 1, performerCount: 2, listenerBonus: 1 },
  epic: { extraTurns: 2, performerCount: 2, listenerBonus: 1 },
  legendary: { extraTurns: 2, performerCount: 2, listenerBonus: 1 }
}

export function isMusicianPerformanceSkill(skill) {
  return Boolean(skill?.id && MUSICIAN_PERFORMANCE_SKILL_IDS.has(skill.id))
}

export function isInstrumentItem(item) {
  return String(item?.offhandType || '').toLowerCase() === 'instrument'
}

/** Amplify rules for an instrument item (explicit `instrumentAmplify` overrides rarity defaults). */
export function resolveInstrumentAmplify(item) {
  if (!isInstrumentItem(item)) return null
  const rarity = String(item.rarity || 'common').toLowerCase()
  const base = AMPLIFY_BY_RARITY[rarity] || AMPLIFY_BY_RARITY.common
  const custom = item.instrumentAmplify || {}
  return {
    extraTurns: Number(custom.extraTurns ?? base.extraTurns) || 0,
    performerCount: Math.max(1, Number(custom.performerCount ?? base.performerCount) || 1),
    listenerBonus: Number(custom.listenerBonus ?? base.listenerBonus) || 0,
    instrumentId: item.id,
    instrumentName: item.name
  }
}

export function getCharacterInstrumentAmplify(character) {
  const item = getEquippedOffhand(character)
  return item ? resolveInstrumentAmplify(item) : null
}

export function extraSongTurnsFromSkills(character) {
  return character?.skills?.includes('long_set') ? 1 : 0
}

/** Apply instrument + Long Set to musician skill activation payloads (duration + table counts). */
export function applyInstrumentToActivations(character, skill, activations, options = {}) {
  if (!isMusicianPerformanceSkill(skill) || !activations?.length) return activations
  const encoreReplay = options.encoreReplay === true

  return activations.map(payload => {
    const baseDuration = Number(payload.duration) || 0
    if (encoreReplay) {
      return {
        ...payload,
        duration: baseDuration,
        performance: {
          skillId: skill.id,
          performerCount: 1,
          listenerBonus: 0,
          instrumentId: null,
          instrumentName: null,
          vocalOnly: true,
          encoreReplay: true
        }
      }
    }

    const amp = getCharacterInstrumentAmplify(character)
    const longSet = extraSongTurnsFromSkills(character)

    let duration = baseDuration
    if (amp?.extraTurns) duration += amp.extraTurns
    if (longSet) duration += longSet

    const performerCount = amp?.performerCount || 1
    const listenerBonus = amp?.listenerBonus || 0

    return {
      ...payload,
      duration,
      performance: {
        skillId: skill.id,
        performerCount,
        listenerBonus,
        instrumentId: amp?.instrumentId || null,
        instrumentName: amp?.instrumentName || null,
        vocalOnly: !amp,
        extraTurnsFromInstrument: amp?.extraTurns || 0,
        extraTurnsFromLongSet: longSet
      }
    }
  })
}

export function canEncoreReplay(character, skillId) {
  if (!character?.skills?.includes('encore')) return false
  const flags = character.combatFlags || {}
  if (flags.encoreUsedThisCombat) return false
  return (flags.musicianSongsThisCombat || []).includes(skillId)
}

export function noteMusicianSongStarted(character, skillId, { encoreReplay = false } = {}) {
  if (!character || !skillId) return
  character.combatFlags = character.combatFlags || {}
  if (encoreReplay) {
    character.combatFlags.encoreUsedThisCombat = true
    return
  }
  const list = character.combatFlags.musicianSongsThisCombat || []
  if (!list.includes(skillId)) {
    character.combatFlags.musicianSongsThisCombat = [...list, skillId]
  }
}

export function formatPerformanceMeta(performance) {
  if (!performance) return ''
  const parts = []
  if (performance.encoreReplay) {
    parts.push('Encore — base length only')
  } else {
    if (performance.instrumentName) {
      parts.push(performance.instrumentName)
    } else if (performance.vocalOnly) {
      parts.push('Vocal')
    }
    if (performance.performerCount > 1) {
      parts.push(`count as ${performance.performerCount} Musicians`)
    }
    if (performance.listenerBonus > 0) {
      parts.push(`listeners +${performance.listenerBonus} from you`)
    }
  }
  return parts.join(' · ')
}

export function instrumentAmplifyTooltipLines(item) {
  const amp = resolveInstrumentAmplify(item)
  if (!amp) return []
  const lines = ['', 'Musician songs (off-hand):']
  if (amp.extraTurns) {
    lines.push(`• Songs last +${amp.extraTurns} sustain turn${amp.extraTurns === 1 ? '' : 's'}`)
  }
  if (amp.performerCount > 1) {
    lines.push(`• You count as ${amp.performerCount} Musicians for your part (per-musician bonuses and harmony)`)
  }
  if (amp.listenerBonus > 0) {
    lines.push(`• Allies listening get +${amp.listenerBonus} extra from your song on top of per-musician stacks`)
  }
  if (amp.performerCount <= 1 && !amp.listenerBonus) {
    lines.push('• Sing without an instrument — equip a better instrument for more bonuses')
  }
  return lines
}

export function activePerformanceStatuses(character) {
  return (character?.statusEffects || []).filter(status => status.performance?.skillId)
}

export function performanceBannerText(character) {
  const rows = activePerformanceStatuses(character)
  if (!rows.length) return ''
  return rows.map(status => {
    const perf = status.performance
    const turns = Number.isFinite(Number(status.duration)) ? status.duration : '?'
    const meta = formatPerformanceMeta(perf)
    const name = status.effectId?.replace(/_buff|_debuff/g, '').replace(/_/g, ' ') || 'Song'
    return meta ? `Performing: ${name} (${turns} turn${turns === 1 ? '' : 's'} left) — ${meta}` : `Performing: ${name} (${turns} turn${turns === 1 ? '' : 's'} left)`
  }).join('\n')
}
