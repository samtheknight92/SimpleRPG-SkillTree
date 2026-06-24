export const $ = (selector, root = document) => root.querySelector(selector)
export const $$ = (selector, root = document) => [...root.querySelectorAll(selector)]
export const clamp = (value, min, max) => Math.min(max, Math.max(min, value))
export const deepClone = value => JSON.parse(JSON.stringify(value))
export const esc = value => String(value ?? '').replace(/[&<>'"]/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char]))
export const safeId = value => String(value || '').replace(/[^a-zA-Z0-9_-]/g, '')

export function titleCase(value) {
  return String(value || '')
    .replace(/_/g, ' ')
    .replace(/\b\w/g, letter => letter.toUpperCase())
}

export function debounce(fn, ms = 200) {
  let timer
  const debounced = (...args) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), ms)
  }
  debounced.flush = () => {
    clearTimeout(timer)
    fn()
  }
  debounced.cancel = () => clearTimeout(timer)
  return debounced
}

export function uid(prefix = 'id') {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`
}

function stripHtml(html) {
  return String(html).replace(/<[^>]*>/g, '')
}

const TOAST_DURATION_MS = 2900

let toastTimeout
let dismissBound = false

function hideToast() {
  const el = $('#toast')
  if (!el) return
  el.classList.remove('show', 'toast-combat')
  el.removeAttribute('aria-label')
  clearTimeout(toastTimeout)
}

function bindToastDismiss() {
  if (dismissBound) return
  const el = $('#toast')
  if (!el) return
  dismissBound = true
  el.addEventListener('click', () => hideToast())
  el.addEventListener('keydown', event => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      hideToast()
    }
  })
}

/**
 * @param {string} message
 * @param {{ combat?: boolean, duration?: number }} [options]
 */
export function toast(message, options = {}) {
  const el = $('#toast')
  if (!el) return
  bindToastDismiss()

  el.classList.add('show')
  el.classList.toggle('toast-combat', Boolean(options.combat))
  el.tabIndex = options.combat ? 0 : -1
  if (options.html) el.innerHTML = message
  else el.textContent = message
  const plain = options.html ? stripHtml(message) : message
  el.setAttribute('aria-label', options.combat ? `${plain}. Click to dismiss.` : plain)
  clearTimeout(toastTimeout)

  if (options.combat) return

  toastTimeout = setTimeout(hideToast, options.duration ?? TOAST_DURATION_MS)
}

/** Roll / combat feedback — stays visible until the next toast or click to dismiss. */
export function toastCombat(message, options = {}) {
  toast(message, { combat: true, ...options })
}
