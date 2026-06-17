export const THEME_STORAGE_KEY = 'lumenforge_theme'
export const APPEARANCE_STORAGE_KEY = 'lumenforge_appearance'

export const THEMES = [
  { id: 'midnight', label: 'Midnight', hint: 'Blue & black (default)', swatch: ['#4a9eff', '#0c1220'] },
  { id: 'ember', label: 'Ember', hint: 'Red & orange', swatch: ['#ff6b4a', '#1a0804'] },
  { id: 'twilight', label: 'Twilight', hint: 'Pink & purple', swatch: ['#e879f9', '#140820'] },
  { id: 'frost', label: 'Frost', hint: 'Ice blue & black', swatch: ['#7dd3fc', '#040a12'] },
  { id: 'verdant', label: 'Verdant', hint: 'Green & teal', swatch: ['#34d399', '#030c08'] },
  { id: 'slate', label: 'Slate', hint: 'Grey & charcoal', swatch: ['#94a3b8', '#0a0c10'] },
  { id: 'dusk', label: 'Dusk', hint: 'Purple & amber', swatch: ['#a78bfa', '#fbbf24'] },
  { id: 'rose', label: 'Rose', hint: 'Rose & crimson', swatch: ['#fb7185', '#1a0810'] }
]

const LEGACY_THEME_IDS = { forge: 'midnight' }

export function normalizeThemeId(themeId) {
  return LEGACY_THEME_IDS[themeId] || themeId
}

export function getTheme() {
  const saved = normalizeThemeId(localStorage.getItem(THEME_STORAGE_KEY) || 'midnight')
  return THEMES.some(theme => theme.id === saved) ? saved : 'midnight'
}

export function getAppearance() {
  const saved = localStorage.getItem(APPEARANCE_STORAGE_KEY) || 'dark'
  return saved === 'light' ? 'light' : 'dark'
}

export function applyTheme(themeId) {
  const theme = normalizeThemeId(THEMES.find(entry => entry.id === themeId)?.id || themeId)
  const resolved = THEMES.some(entry => entry.id === theme) ? theme : 'midnight'
  document.documentElement.dataset.theme = resolved
  localStorage.setItem(THEME_STORAGE_KEY, resolved)
  document.querySelectorAll('[data-set-theme]').forEach(button => {
    const active = button.dataset.setTheme === resolved
    button.classList.toggle('active', active)
    button.setAttribute('aria-pressed', active ? 'true' : 'false')
  })
}

export function applyAppearance(appearance) {
  const resolved = appearance === 'light' ? 'light' : 'dark'
  document.documentElement.dataset.appearance = resolved
  localStorage.setItem(APPEARANCE_STORAGE_KEY, resolved)
  document.querySelectorAll('[data-set-appearance]').forEach(button => {
    const active = button.dataset.setAppearance === resolved
    button.classList.toggle('active', active)
    button.setAttribute('aria-pressed', active ? 'true' : 'false')
  })
}

export function renderThemePicker() {
  const host = document.querySelector('#theme-picker')
  if (!host) return
  const current = getTheme()
  host.innerHTML = THEMES.map(theme => {
    const active = theme.id === current
    const swatch = theme.swatch.map(color => `<span style="background:${color}"></span>`).join('')
    return `<button type="button" class="theme-swatch${active ? ' active' : ''}" data-set-theme="${theme.id}" aria-label="${theme.label}: ${theme.hint}" aria-pressed="${active}" title="${theme.hint}">${swatch}</button>`
  }).join('')
}

export function renderAppearanceToggle() {
  const host = document.querySelector('#appearance-toggle')
  if (!host) return
  const current = getAppearance()
  host.innerHTML = `
    <button type="button" class="appearance-btn${current === 'dark' ? ' active' : ''}" data-set-appearance="dark" aria-pressed="${current === 'dark'}" title="Dark mode">🌙 Dark</button>
    <button type="button" class="appearance-btn${current === 'light' ? ' active' : ''}" data-set-appearance="light" aria-pressed="${current === 'light'}" title="Light mode">☀️ Light</button>
  `
}

export function initTheme() {
  applyAppearance(getAppearance())
  applyTheme(getTheme())
  renderAppearanceToggle()
  renderThemePicker()
}
