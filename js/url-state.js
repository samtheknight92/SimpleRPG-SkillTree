import { state, applyUrlState } from './state.js'
import { hasActiveFusionFilters, parseFusionFiltersFromUrl, serializeFusionFilters } from './fusion-nav.js'

export function parseUrlState() {
  const hash = location.hash.replace(/^#/, '')
  if (!hash) return {}
  const params = new URLSearchParams(hash)
  const hasFusionFilterParams = params.has('ffw') || params.has('ffe') || params.has('ffk') || params.has('fnest')
  return {
    tab: params.get('tab') || '',
    skillCategory: params.get('cat') || '',
    skillSubcategory: params.get('sub') || '',
    skillFusionFilters: hasFusionFilterParams
      ? parseFusionFiltersFromUrl({
        ffw: params.get('ffw') || '',
        ffe: params.get('ffe') || '',
        ffk: params.get('ffk') || '',
        fnest: params.get('fnest') || ''
      })
      : null,
    itemSource: params.get('src') || '',
    itemPage: params.get('page') != null ? Number(params.get('page')) : null
  }
}

export function syncUrlState() {
  const params = new URLSearchParams()
  if (state.tab) params.set('tab', state.tab)
  if (state.skillCategory) params.set('cat', state.skillCategory)
  if (state.skillSubcategory) params.set('sub', state.skillSubcategory)
  if (state.skillCategory === 'fusion' && hasActiveFusionFilters(state.skillFusionFilters)) {
    const { w, e, k } = serializeFusionFilters(state.skillFusionFilters)
    if (w) params.set('ffw', w)
    if (e) params.set('ffe', e)
    if (k) params.set('ffk', k)
  }
  if (state.itemSource && state.itemSource !== 'shop') params.set('src', state.itemSource)
  if (state.itemPage) params.set('page', String(state.itemPage))
  const next = params.toString()
  const target = next ? `#${next}` : ''
  if (location.hash !== target) history.replaceState(null, '', target || location.pathname)
}

let onHashChange = null

export function initUrlState(handler) {
  onHashChange = handler
  window.addEventListener('hashchange', () => {
    applyUrlState()
    onHashChange?.()
  })
}
