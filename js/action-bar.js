import { esc } from './utils.js'
import { activePerformanceStatuses } from './instruments.js'
import { computeStats } from './character.js'
import {
  getActionBarSkills,
  getActionBarSkillGroup,
  getSkillActivationType,
  tierBorderClass
} from './skill-activation.js'
import {
  BASIC_ATTACK_ID,
  getBasicAttackSkill,
  getActionBarBlockReason,
  isBasicAttackSkill
} from './combat.js'
import {
  formatBonusChipText,
  formatBonusStatLabel,
  formatDescWithBonusTotalsPlain,
  getActionBarSkillBonuses,
  skillShowsActionBarBonuses,
  summarizeActionBarBonuses
} from './action-bar-bonuses.js'
import {
  formatSkillEffectBreakdownPlain,
  resolveSkillEffectBreakdown,
  skillHasEffectBreakdown
} from './damage-breakdown.js'

function resourceMeter(resource, label, icon, value, max, tone) {
  const pct = max > 0 ? Math.max(0, Math.min(100, Math.round((value / max) * 100))) : 0
  return `
    <div class="action-bar-meter action-bar-meter-${tone}" data-tooltip="${esc(`${label}\n${value} / ${max}`)}" tabindex="0">
      <div class="action-bar-meter-head">
        <span class="action-bar-meter-icon">${icon}</span>
        <span class="action-bar-meter-label">${esc(label)}</span>
        <span class="action-bar-meter-value">${value}/${max}</span>
      </div>
      <div class="action-bar-meter-body">
        <button type="button" class="action-bar-adjust action-bar-adjust-minus" data-adjust-resource="${esc(resource)}" data-amount="-1" aria-label="${esc(`${label} minus 1`)}">−</button>
        <div class="action-bar-meter-track" role="progressbar" aria-valuemin="0" aria-valuemax="${max}" aria-valuenow="${value}" aria-label="${esc(label)}">
          <div class="action-bar-meter-fill" style="width:${pct}%"></div>
        </div>
        <button type="button" class="action-bar-adjust action-bar-adjust-plus" data-adjust-resource="${esc(resource)}" data-amount="1" aria-label="${esc(`${label} plus 1`)}">+</button>
      </div>
    </div>
  `
}

function skillSlot(skill, character) {
  const type = isBasicAttackSkill(skill) ? 'activatable' : getSkillActivationType(skill)
  const cost = Number(skill.staminaCost || 0)
  const active = type === 'toggle' && character.activeToggles?.includes(skill.id)
  const disableReason = (type === 'activatable' || type === 'toggle')
    ? getActionBarBlockReason(character, skill, type)
    : ''
  const disabled = Boolean(disableReason) && !(type === 'toggle' && active)
  const allBonuses = getActionBarSkillBonuses(character, skill)
  const showBonuses = skillShowsActionBarBonuses(skill)
  const bonuses = showBonuses ? allBonuses : []
  const bonusTotals = summarizeActionBarBonuses(bonuses)
  const statKeys = Object.keys(bonusTotals)
  const bonusStatClass = statKeys.length === 1 ? statKeys[0] : 'mixed'
  const bonusChip = bonuses.length ? formatBonusChipText(bonuses) : ''
  const effectBreakdown = skillHasEffectBreakdown(skill)
    ? formatSkillEffectBreakdownPlain(resolveSkillEffectBreakdown(character, skill))
    : ''
  const tooltipLines = [
    skill.name,
    bonuses.length ? formatDescWithBonusTotalsPlain(skill.desc || '', bonusTotals) : (skill.desc || ''),
    ...bonuses.map(bonus => `${formatBonusStatLabel(bonus.stat, bonus.value)} (${bonus.sourceName})`),
    effectBreakdown
  ].filter(Boolean)
  if (disableReason) tooltipLines.push('', `Why greyed out: ${disableReason}`)
  const classes = [
    'action-bar-skill',
    tierBorderClass(skill.tier),
    type === 'toggle' ? 'is-toggle' : 'is-activatable',
    active ? 'is-active' : '',
    disabled ? 'is-disabled' : '',
    disableReason ? 'is-blocked' : '',
    bonuses.length ? 'has-bonuses' : ''
  ].filter(Boolean).join(' ')

  const action = type === 'toggle' ? 'data-toggle-skill' : 'data-use-skill'
  const badge = type === 'toggle'
    ? (active ? 'ON' : 'TGL')
    : `${cost}`

  const bonusHtml = bonusChip
    ? `<span class="action-bar-skill-bonus bonus-stat-${esc(bonusStatClass)}" aria-hidden="true">${esc(bonusChip)}</span>`
    : ''

  return `
    <button
      type="button"
      class="${classes}"
      ${action}="${esc(skill.id)}"
      data-action-bar-skill="${esc(skill.id)}"
      data-tooltip="${esc(tooltipLines.join('\n'))}"
      ${disabled && !window.matchMedia('(max-width: 760px)').matches ? 'disabled' : ''}
      ${disableReason ? `title="${esc(disableReason)}"` : ''}
      aria-pressed="${active ? 'true' : 'false'}"
      aria-label="${esc(`${skill.name}, ${type}, ${cost} stamina${disableReason ? `, unavailable: ${disableReason}` : ''}${bonusChip ? `, ${bonusChip} from passives` : ''}`)}"
    >
      ${disableReason ? '<span class="action-bar-skill-block-hint" aria-hidden="true">!</span>' : ''}
      ${bonusHtml}
      <span class="action-bar-skill-icon">${esc(skill.icon || '✦')}</span>
      <span class="action-bar-skill-cost">${esc(badge)}</span>
    </button>
  `
}

function renderActionBarSkillSlots(skills, character) {
  let lastGroupKey = null
  return skills.map(skill => {
    const groupKey = getActionBarSkillGroup(skill).key
    const divider = lastGroupKey && lastGroupKey !== groupKey
      ? '<span class="action-bar-skill-divider" aria-hidden="true"></span>'
      : ''
    lastGroupKey = groupKey
    return divider + skillSlot(skill, character)
  }).join('')
}

let actionBarInsetObserver

/** Keep scrollable content clear of the fixed action bar (height varies by viewport). */
export function syncActionBarInset() {
  const bar = document.querySelector('#action-bar')
  const root = document.documentElement
  if (!bar || bar.hidden) {
    root.style.removeProperty('--action-bar-offset')
    return
  }
  const height = bar.getBoundingClientRect().height
  const extra = 24
  root.style.setProperty('--action-bar-offset', `${Math.ceil(height + extra)}px`)
}

function ensureActionBarInsetObserver() {
  const bar = document.querySelector('#action-bar')
  if (!bar || actionBarInsetObserver) return
  actionBarInsetObserver = new ResizeObserver(() => syncActionBarInset())
  actionBarInsetObserver.observe(bar)
  window.addEventListener('resize', syncActionBarInset, { passive: true })
}

function scheduleActionBarInsetSync() {
  requestAnimationFrame(() => {
    syncActionBarInset()
    requestAnimationFrame(syncActionBarInset)
  })
}

export function renderActionBar(character) {
  const bar = document.querySelector('#action-bar')
  if (!bar) return

  if (!character) {
    bar.hidden = true
    bar.innerHTML = ''
    document.body.classList.remove('has-action-bar')
    syncActionBarInset()
    return
  }

  const stats = computeStats(character)
  const learned = getActionBarSkills(character)
  const skills = [getBasicAttackSkill(character), ...learned.filter(s => s.id !== BASIC_ATTACK_ID)]

  bar.hidden = false
  document.body.classList.add('has-action-bar')
  bar.innerHTML = `
    <div class="action-bar-dock">
      <div class="action-bar-inner">
        <div class="action-bar-resources">
          ${resourceMeter('hp', 'HP', '♥', character.hp, stats.hp, 'hp')}
          ${resourceMeter('stamina', 'Stamina', '⚡', character.stamina, stats.stamina, 'stamina')}
        </div>
        <div class="action-bar-skills-wrap">
          <div class="action-bar-skills-label">Skills</div>
          <div class="action-bar-skills" role="toolbar" aria-label="Activatable skills">
            ${skills.length
              ? renderActionBarSkillSlots(skills, character)
              : '<div class="action-bar-empty">Learn Action, Spell, or Toggle skills to slot them here.</div>'}
          </div>
          <button type="button" class="ghost-btn tiny action-bar-move-btn" data-mark-moved="">Mark movement</button>
          ${activePerformanceStatuses(character).length
            ? `<button type="button" class="ghost-btn tiny action-bar-stop-performance-btn" data-stop-performance="" aria-label="Stop current performance">Stop performance</button>`
            : ''}
        </div>
      </div>
    </div>
  `
  ensureActionBarInsetObserver()
  scheduleActionBarInsetSync()
}
