import { loadGameData } from './data.js'
import { initCache, flattenSkills, itemSources } from './cache.js'
import { load, saveNow } from './storage.js'
import { state, activeCharacter, applyUrlState } from './state.js'
import { render } from './render.js'
import { initEvents } from './events.js'
import { setupTooltips } from './tooltips.js'
import { initUrlState, syncUrlState } from './url-state.js'
import { computeStats } from './character.js'

import { initTheme, applyTheme } from './themes.js'
import { setupActionBarSkillSheet } from './action-bar-sheet.js'

async function boot() {
  try {
    initTheme()
    await loadGameData()
    initCache()
    load()
    applyUrlState()
    initEvents()
    setupTooltips()
    setupActionBarSkillSheet()
    render({ all: true })
    syncUrlState()
    initUrlState(() => render({ content: true, header: true, tabs: true, actionBar: true }))
  } catch (error) {
    console.error(error)
    const content = document.querySelector('#app-content')
    if (content) {
      content.innerHTML = `
        <div class="notice-card">
          <h2>Boot failed</h2>
          <p>The app failed to start. Check data files and console for details.</p>
        </div>
      `
    }
  }
}

window.LumenForge = {
  state,
  helpers: {
    activeCharacter,
    applyUrlState,
    computeStats,
    flattenSkills,
    itemSources,
    render,
    saveNow,
    syncUrlState
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot)
} else {
  boot()
}
