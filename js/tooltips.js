import { activeCharacter } from './state.js'
import { getSkill } from './skills.js'
import { actionBarSkillTooltipHtml } from './action-bar-bonuses.js'
import { BASIC_ATTACK_ID, getBasicAttackSkill } from './combat.js'
let initialized = false
const MOBILE_TOOLTIP_CLASS = 'tooltip-detail-open'

export function setupTooltips() {
  if (initialized) return
  initialized = true

  const tooltip = document.querySelector('#hover-tooltip')
  if (!tooltip) return

  const isMobile = () => window.matchMedia('(max-width: 760px)').matches
  const margin = 16

  const clearMobileDetails = except => {
    document.querySelectorAll(`[data-tooltip].${MOBILE_TOOLTIP_CLASS}, [data-action-bar-skill].${MOBILE_TOOLTIP_CLASS}`).forEach(el => {
      if (el !== except) el.classList.remove(MOBILE_TOOLTIP_CLASS)
    })
  }

  const move = (x, y) => {
    const rect = tooltip.getBoundingClientRect()
    let left = x + margin
    let top = y + margin
    if (left + rect.width > window.innerWidth - 8) left = x - rect.width - margin
    if (top + rect.height > window.innerHeight - 8) top = y - rect.height - margin
    tooltip.style.left = `${Math.max(8, left)}px`
    tooltip.style.top = `${Math.max(8, top)}px`
  }

  const show = (target, x, y) => {
    if (isMobile()) return
    const skillId = target?.dataset?.actionBarSkill
    if (skillId) {
      const character = activeCharacter()
      const skill = skillId === BASIC_ATTACK_ID
        ? getBasicAttackSkill(character)
        : getSkill(skillId)
      const html = actionBarSkillTooltipHtml(skill, character)
      if (!html) {
        const fallback = target?.dataset?.tooltip
        if (!fallback) return
        tooltip.textContent = fallback
        tooltip.classList.remove('is-rich')
        tooltip.classList.add('show')
        move(x, y)
        return
      }
      tooltip.innerHTML = html
      tooltip.classList.add('show', 'is-rich')
      move(x, y)
      return
    }
    const text = target?.dataset?.tooltip
    if (!text) return
    tooltip.textContent = text
    tooltip.classList.remove('is-rich')
    tooltip.classList.add('show')
    move(x, y)
  }

  const hide = () => {
    tooltip.classList.remove('show', 'is-rich')
    tooltip.innerHTML = ''
  }

  document.addEventListener('mouseover', event => {
    if (isMobile()) return
    const target = event.target.closest('[data-tooltip], [data-action-bar-skill]')
    if (!target) return
    show(target, event.clientX, event.clientY)
  })

  document.addEventListener('mousemove', event => {
    if (isMobile()) return
    if (tooltip.classList.contains('show')) move(event.clientX, event.clientY)
  })

  document.addEventListener('mouseout', event => {
    if (isMobile()) return
    const target = event.target.closest('[data-tooltip], [data-action-bar-skill]')
    if (!target || target.contains(event.relatedTarget)) return
    hide()
  })

  document.addEventListener('focusin', event => {
    if (isMobile()) return
    const target = event.target.closest('[data-tooltip], [data-action-bar-skill]')
    if (!target) return
    const rect = target.getBoundingClientRect()
    show(target, rect.left + rect.width / 2, rect.bottom)
  })

  document.addEventListener('focusout', () => {
    if (isMobile()) return
    hide()
  })

  document.addEventListener('scroll', () => {
    if (isMobile()) return
    hide()
  }, true)

  document.addEventListener('click', event => {
    if (!isMobile()) return
    if (event.target.closest('[data-action-bar-skill]')) return
    const target = event.target.closest('[data-tooltip]')
    if (!target) {
      clearMobileDetails()
      return
    }
    const shouldOpen = !target.classList.contains(MOBILE_TOOLTIP_CLASS)
    clearMobileDetails(target)
    target.classList.toggle(MOBILE_TOOLTIP_CLASS, shouldOpen)
  })

  window.addEventListener('resize', () => {
    if (!isMobile()) clearMobileDetails()
    hide()
  })
}
