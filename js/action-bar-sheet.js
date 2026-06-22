import { activeCharacter } from './state.js'
import { getSkill } from './skills.js'
import { getSkillActivationType } from './skill-activation.js'
import { actionBarSkillTooltipHtml } from './action-bar-bonuses.js'
import { BASIC_ATTACK_ID, getBasicAttackSkill, getActionBarBlockReason } from './combat.js'
import { useSkill, toggleSkill } from './actions.js'

const MOBILE_MQ = '(max-width: 760px)'
let sheetSkillId = null
let sheetReturnFocus = null
let initialized = false

export function isMobileSkillSheetMode() {
  return window.matchMedia(MOBILE_MQ).matches
}

function resolveSheetSkill(skillId) {
  const character = activeCharacter()
  if (skillId === BASIC_ATTACK_ID) return getBasicAttackSkill(character)
  return getSkill(skillId)
}

function sheetElements() {
  return {
    sheet: document.querySelector('#action-bar-skill-sheet'),
    content: document.querySelector('#action-bar-skill-sheet-content'),
    useBtn: document.querySelector('#action-bar-skill-sheet-use')
  }
}

export function closeActionBarSkillSheet() {
  const { sheet } = sheetElements()
  if (!sheet || sheet.hidden) return

  const returnTo = sheetReturnFocus
  sheetReturnFocus = null
  sheetSkillId = null
  document.body.classList.remove('skill-sheet-open')

  if (returnTo instanceof HTMLElement && document.contains(returnTo)) {
    returnTo.focus({ preventScroll: true })
  } else if (document.activeElement instanceof HTMLElement && sheet.contains(document.activeElement)) {
    document.activeElement.blur()
  }

  sheet.hidden = true
}

export function openActionBarSkillSheet(skillId) {
  const { sheet, content, useBtn } = sheetElements()
  if (!sheet || !content || !useBtn || !skillId) return

  const character = activeCharacter()
  const skill = resolveSheetSkill(skillId)
  if (!skill) return

  sheetSkillId = skillId
  content.innerHTML = actionBarSkillTooltipHtml(skill, character)
    || `<div class="action-bar-tip-title">${skill.name}</div>`

  const type = getSkillActivationType(skill)
  const active = type === 'toggle' && character?.activeToggles?.includes(skill.id)
  const blockReason = (type === 'activatable' || type === 'toggle')
    ? getActionBarBlockReason(character, skill, type)
    : ''
  const disabled = Boolean(blockReason) && !(type === 'toggle' && active)

  if (type === 'toggle') {
    useBtn.textContent = active ? 'Switch Off' : 'Switch On'
  } else if (skillId === BASIC_ATTACK_ID) {
    useBtn.textContent = 'Basic Attack'
  } else {
    useBtn.textContent = 'Use Skill'
  }

  useBtn.disabled = disabled
  useBtn.title = blockReason || ''

  sheetReturnFocus = document.activeElement instanceof HTMLElement
    ? document.activeElement
    : null

  sheet.hidden = false
  document.body.classList.add('skill-sheet-open')
  useBtn.focus()
}

function confirmActionBarSkillSheet() {
  if (!sheetSkillId) return
  const skill = resolveSheetSkill(sheetSkillId)
  if (!skill) return
  const type = getSkillActivationType(skill)
  if (type === 'toggle') toggleSkill(sheetSkillId)
  else useSkill(sheetSkillId)
  closeActionBarSkillSheet()
}

/** Mobile: intercept action bar taps and show the skill sheet instead of using immediately. */
export function tryOpenActionBarSkillSheet(event) {
  if (!isMobileSkillSheetMode()) return false
  const btn = event.target.closest('[data-action-bar-skill]')
  if (!btn) return false
  event.preventDefault()
  event.stopPropagation()
  openActionBarSkillSheet(btn.dataset.actionBarSkill)
  return true
}

export function setupActionBarSkillSheet() {
  if (initialized) return
  initialized = true

  document.getElementById('action-bar-skill-sheet-use')?.addEventListener('click', () => {
    confirmActionBarSkillSheet()
  })

  document.addEventListener('click', event => {
    if (event.target.closest('[data-close-skill-sheet]')) {
      closeActionBarSkillSheet()
    }
  })
}
