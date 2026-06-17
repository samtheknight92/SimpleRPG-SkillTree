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

let toastTimeout
export function toast(message) {
  const el = $('#toast')
  if (!el) return
  el.textContent = message
  el.classList.add('show')
  clearTimeout(toastTimeout)
  toastTimeout = setTimeout(() => el.classList.remove('show'), 2900)
}
