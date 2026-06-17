import { $, $$, esc, titleCase } from './utils.js'
import { STAT_RULES, ITEMS_PER_PAGE, DRAGONBORN_AFFINITIES } from './constants.js'
import { state, activeCharacter } from './state.js'
import { raceOptions, getRace, getSkill, getItem, cache } from './cache.js'
import { computeStats, statBreakdown, getEffect } from './character.js'
import { offhandSlotAvailable } from './equipment.js'
import {
  visibleSubcategories,
  visibleSkillCategories,
  skillsInSubcategory,
  displayCategory,
  canLearnSkill,
  incompatibilityReason,
  isToggleSkill,
  prereqLabel,
  humanStarterWeaponOptions
} from './skills.js'
import { characterLevelInfo, levelTooltip } from './level.js'
import { isGmMode } from './gm-mode.js'
import {
  filterPremadeCharacters,
  premadeCategories,
  countPremadeInRoster,
  PREMADE_SORT_OPTIONS
} from './premade-characters.js'
import { filterCatalogItems, paginateItems } from './items.js'
import {
  manualEffectList,
  effectDurationLabel,
  effectTypeLabel,
  effectTone,
  effectTooltip,
  characterEffectSources
} from './effects.js'
import { formatCurrency, formatStatModifiers, fallbackIcon, itemPriceGil, normalizeGil } from './format.js'
import { itemTooltip, skillTooltip, statTooltip, statUpgradeTooltip, statRefundTooltip } from './tooltips-text.js'
import { renderActionBar } from './action-bar.js'
import { backgroundOptions, getBackground, backgroundRewardSummary, DEFAULT_BACKGROUND } from './backgrounds.js'
import { sortInitiativeEntries, activeInitiativeEntry } from './gm-initiative.js'
import { filterCraftRecipes, canCraftRecipe, materialsStatus, craftProfessionOptions } from './craft.js'
import { craftedByLabel } from './craft-bonuses.js'

export function render(options = { all: true }) {
  const opts = options.all
    ? { sidebar: true, header: true, content: true, tabs: true, actionBar: true }
    : { actionBar: options.actionBar !== false, ...options }
  if (opts.sidebar) {
    renderRaceSelects()
    renderCharacterList()
  }
  if (opts.header) renderHeader()
  if (opts.actionBar !== false) renderActionBar(activeCharacter())
  if (opts.tabs) syncTabBar()
  if (opts.content) renderContent()
}

function syncTabBar() {
  $$('#tabbar button').forEach(tab => {
    const selected = tab.dataset.tab === state.tab
    tab.classList.toggle('active', selected)
    tab.setAttribute('aria-selected', selected ? 'true' : 'false')
  })
}

function renderBackgroundSelect() {
  const select = $('#new-background')
  if (!select) return
  if (!select.dataset.ready) {
    select.innerHTML = backgroundOptions().map(bg =>
      `<option value="${esc(bg.id)}">${esc(bg.icon || '✦')} ${esc(bg.name)}</option>`
    ).join('')
    select.value = DEFAULT_BACKGROUND
    select.dataset.ready = 'true'
    select.addEventListener('change', updateBackgroundPreview)
  }
  updateBackgroundPreview()
}

function updateBackgroundPreview() {
  const preview = $('#background-preview')
  const select = $('#new-background')
  if (!preview || !select) return
  const bg = getBackground(select.value)
  preview.textContent = `${bg.desc} Starting: ${backgroundRewardSummary(bg)}.`
}

function renderRaceSelects() {
  const options = raceOptions().map(race => `<option value="${esc(race.id)}">${esc(race.icon || '✦')} ${esc(race.name)}</option>`).join('')
  const newRace = $('#new-race')
  if (newRace && !newRace.dataset.ready) {
    newRace.innerHTML = options
    const human = raceOptions().find(race => race.id === 'human')
    if (human) newRace.value = human.id
    newRace.dataset.ready = 'true'
    newRace.addEventListener('change', () => renderCreateExtras(newRace.value))
  }
  renderBackgroundSelect()
  renderCreateExtras(newRace?.value || 'human')
}

function renderCreateExtras(raceId) {
  const host = $('#create-extras')
  if (!host) return
  const parts = []
  if (raceId === 'dragonborn') {
    parts.push(`
      <label class="field-label" for="new-affinity">Elemental Affinity</label>
      <select id="new-affinity" class="input">
        <option value="">Choose affinity…</option>
        ${DRAGONBORN_AFFINITIES.map(affinity => `<option value="${esc(affinity)}">${esc(titleCase(affinity))}</option>`).join('')}
      </select>
    `)
  }
  if (raceId === 'human') {
    const starters = humanStarterWeaponOptions()
    parts.push(`
      <label class="field-label" for="new-starter-skill">Free Tier 1 Weapon Skill</label>
      <select id="new-starter-skill" class="input">
        <option value="">Choose starter skill…</option>
        ${starters.map(skill => `<option value="${esc(skill.id)}">${esc(skill.icon || '⚔️')} ${esc(skill.name)} (${esc(titleCase(skill.weaponType))})</option>`).join('')}
      </select>
    `)
  }
  host.innerHTML = parts.join('')
}

function renderCharacterList() {
  const list = $('#character-list')
  if (!list) return
  if (!state.characters.length) {
    list.innerHTML = '<div class="empty">No characters yet. Make a chaos gremlin above.</div>'
    return
  }
  list.innerHTML = state.characters.map(character => {
    const race = getRace(character.race)
    const level = characterLevelInfo(character)
    return `
      <div class="character-card-wrap">
        <button type="button" class="character-card ${character.id === state.activeId ? 'active' : ''}" data-select-character="${esc(character.id)}">
          <strong>${esc(race?.icon || '👤')} ${esc(character.name)}</strong>
          <span>Lv ${level.display} · ${level.skillCount} skills · ${character.lumens}L</span>
        </button>
        <button type="button" class="ghost-btn tiny character-dup" data-duplicate-character="${esc(character.id)}" title="Duplicate character">⧉</button>
      </div>
    `
  }).join('')
}

function renderHeader() {
  const character = activeCharacter()
  const name = $('#current-name')
  const subtitle = $('#current-subtitle')
  const avatar = $('#current-avatar')
  const lumens = $('#lumens-pill')
  const hp = $('#hp-pill')
  const stamina = $('#stamina-pill')
  const coin = $('#coin-pill')
  if (!character) {
    name.textContent = 'No character selected'
    subtitle.textContent = 'Create or select a character to begin.'
    avatar.textContent = '?'
    lumens.textContent = '0'
    hp.textContent = '0/0'
    stamina.textContent = '0/0'
    coin.textContent = '0 Gil'
    return
  }
  const stats = computeStats(character)
  const race = getRace(character.race)
  name.textContent = character.name
  subtitle.textContent = `${race?.name || 'Unknown race'} · Level ${characterLevelInfo(character).display}${isGmMode() ? ' · GM Mode' : ''} · ${character.skills.length} skills · ${character.inventory.length} inventory lines`
  avatar.textContent = race?.icon || '👤'
  lumens.textContent = character.lumens
  hp.textContent = `${character.hp}/${stats.hp}`
  stamina.textContent = `${character.stamina}/${stats.stamina}`
  coin.textContent = formatCurrency(character.gil)
}

export function renderContent() {
  const content = $('#app-content')
  const character = activeCharacter()
  if (!character && state.tab !== 'gm') {
    content.innerHTML = `
      <div class="notice-card">
        <h2>Welcome to LumenForge ✨</h2>
        <p>This rebuild keeps the core idea: characters, races, lumens, skills, equipment and GM-friendly tools - but trims the clutter so it is actually usable at the table.</p>
      </div>
    `
    return
  }

  const tabs = {
    character: () => renderCharacterTab(character),
    skills: () => renderSkillsTab(character),
    stats: () => renderStatsTab(character),
    shop: () => renderShopTab(character),
    craft: () => renderCraftTab(character),
    gm: () => renderGmTab(character),
    notes: () => renderNotesTab(character)
  }
  content.innerHTML = tabs[state.tab]?.() || ''
}

export function renderEquipSlots(character, emptyLabel = 'Empty') {
  const slots = ['weapon', 'armor', 'accessory']
  if (offhandSlotAvailable(character)) slots.splice(1, 0, 'offhand')
  return slots.map(slot => {
    const entry = character.inventory.find(inv => inv.uid === character.equipped[slot])
    const item = entry && getItem(entry.itemId)
    const label = slot === 'offhand' ? 'Off-hand' : titleCase(slot)
    return `<div class="equip-row"${item ? ` data-tooltip="${esc(itemTooltip(item, character))}" tabindex="0"` : ''}><div><strong>${label}</strong><div class="subtle">${item ? `${fallbackIcon(item)} ${esc(item.name)} · ${formatStatModifiers(item.statModifiers)}` : emptyLabel}</div></div>${item ? `<button type="button" class="ghost-btn tiny" data-unequip="${slot}">Unequip</button>` : ''}</div>`
  }).join('')
}

function effectOptionsMarkup() {
  const groups = new Map()
  for (const effect of manualEffectList()) {
    const group = effectTypeLabel(effect.type)
    if (!groups.has(group)) groups.set(group, [])
    groups.get(group).push(effect)
  }
  return [...groups.entries()].map(([group, effects]) => `
    <optgroup label="${esc(group)}">
      ${effects.map(effect => `<option value="${esc(effect.id)}">${esc(effect.icon || '✦')} ${esc(effect.name)}</option>`).join('')}
    </optgroup>
  `).join('')
}

function renderEffectPill(effectId, source = '', status = null) {
  const effect = getEffect(effectId)
  if (!effect) return ''
  return `<span class="pill ${effectTone(effect)}" data-tooltip="${esc(effectTooltip(effectId, source, status))}" tabindex="0">${esc(effect.icon || '✦')} ${esc(effect.name)}</span>`
}

function renderEffectsSnapshot(character) {
  const active = character.statusEffects || []
  const sourced = characterEffectSources(character)
  const activePills = active.slice(0, 8).map(status => renderEffectPill(status.effectId, 'Applied status', status)).join('')
  const sourcePills = sourced.slice(0, 8).map(entry => renderEffectPill(entry.effect.id, entry.sources.join(', '))).join('')
  const extraCount = Math.max(0, active.length + sourced.length - 16)
  return `
    <div class="effects-snapshot">
      <div class="effect-mini-title">Effects & specials</div>
      <div class="wrap">
        ${activePills || ''}
        ${sourcePills || ''}
        ${extraCount ? `<span class="pill">+${extraCount} more below</span>` : ''}
        ${!active.length && !sourced.length ? '<span class="pill">No detected effects yet</span>' : ''}
      </div>
    </div>
  `
}

function renderEffectsManager(character) {
  const sourced = characterEffectSources(character)
  const active = character.statusEffects || []
  const sourceCards = sourced.map(entry => `
    <article class="effect-card ${effectTone(entry.effect)}" data-tooltip="${esc(effectTooltip(entry.effect.id, entry.sources.join(', ')))}" tabindex="0">
      <div class="effect-card-title"><strong>${esc(entry.effect.icon || '✦')} ${esc(entry.effect.name)}</strong><span class="pill">${esc(effectTypeLabel(entry.effect.type))}</span></div>
      <p>${esc(entry.effect.desc)}</p>
      <div class="subtle">From: ${esc(entry.sources.slice(0, 4).join(', '))}${entry.sources.length > 4 ? ` and ${entry.sources.length - 4} more` : ''}</div>
    </article>
  `).join('')
  const activeCards = active.map(status => {
    const effect = getEffect(status.effectId)
    if (!effect) return ''
    return `
      <article class="effect-card ${effectTone(effect)}" data-tooltip="${esc(effectTooltip(effect.id, 'Applied status', status))}" tabindex="0">
        <div class="effect-card-title"><strong>${esc(effect.icon || '✦')} ${esc(effect.name)}</strong><button type="button" class="danger-btn tiny" data-remove-effect="${esc(status.uid)}">Remove</button></div>
        <p>${esc(effect.desc)}</p>
        <div class="wrap">
          <span class="pill">Remaining: ${esc(effectDurationLabel(status.duration))}</span>
          ${status.potency !== undefined && status.potency !== null && status.potency !== 0 ? `<span class="pill warn">Potency ${esc(status.potency)}</span>` : ''}
          ${effect.statModifiers ? `<span class="pill ${effectTone(effect)}">${esc(formatStatModifiers(effect.statModifiers))}</span>` : ''}
        </div>
        ${status.notes ? `<div class="subtle">${esc(status.notes)}</div>` : ''}
      </article>
    `
  }).join('')
  return `
    <section class="card effects-manager mt-16">
      <div class="card-header">
        <div>
          <div class="kicker">Rules Brain</div>
          <h3>Effects & Status Manager</h3>
          <p>Hover any effect to see what it does. Shows ongoing passives from gear, weapon-matched skills, active toggles, and resistances — not one-shot attack spells.</p>
        </div>
        <button type="button" class="ghost-btn tiny" data-process-turn>Process Turn</button>
      </div>

      <div class="grid two">
        <div>
          <h3>Applied Status Effects</h3>
          <div class="effect-grid">${activeCards || '<div class="empty">No active status effects. Suspiciously healthy.</div>'}</div>
        </div>
        <div>
          <h3>Skill & Gear Effects</h3>
          <div class="effect-grid">${sourceCards || '<div class="empty">No skill/gear special effects detected yet.</div>'}</div>
        </div>
      </div>

      <div class="effect-add-box">
        <h3>Add Effect</h3>
        <p>Use this for Poison, Burn, HP Regen, buffs, debuffs, auras, or GM-made nonsense. Leave duration/potency blank to use the default. Item-only and on-hit procs are hidden from this list.</p>
        <div class="effect-add-grid">
          <label><span class="field-label">Effect</span><select class="input" id="effect-select">${effectOptionsMarkup()}</select></label>
          <label><span class="field-label">Duration</span><input class="input" id="effect-duration" type="number" min="0" placeholder="Default" /></label>
          <label><span class="field-label">Potency</span><input class="input" id="effect-potency" type="number" placeholder="Default" /></label>
          <label><span class="field-label">Notes</span><input class="input" id="effect-notes" placeholder="Optional source/variant" /></label>
        </div>
        <button type="button" class="primary-btn full" data-add-effect>Add Effect</button>
      </div>
    </section>
  `
}

function renderCharacterTab(character) {
  const race = getRace(character.race)
  const background = getBackground(character.background)
  const stats = computeStats(character)
  const level = characterLevelInfo(character)
  const unlocked = character.skills.map(getSkill).filter(Boolean)
  const passives = (race?.passiveTraits || []).map(trait => `<span class="pill good">${esc(trait)}</span>`).join('') || '<span class="pill">No race passives</span>'
  return `
    <div class="grid two">
      <section class="card">
        <div class="card-header">
          <div>
            <div class="kicker">Character Sheet</div>
            <h3>${esc(race?.icon || '👤')} ${esc(character.name)}</h3>
            <p>${esc(race?.description || 'Choose a race to unlock passives and racial skills.')}</p>
          </div>
          <button type="button" class="ghost-btn tiny" data-export-character>Export</button>
        </div>
        <label class="field-label">Rename</label>
        <input class="input" id="rename-character" value="${esc(character.name)}" />
        <label class="field-label">Race</label>
        <select class="input" id="change-race">
          ${raceOptions().map(option => `<option value="${esc(option.id)}" ${option.id === character.race ? 'selected' : ''}>${esc(option.icon || '✦')} ${esc(option.name)}</option>`).join('')}
        </select>
        ${character.race === 'dragonborn' ? `
          <label class="field-label mt-12" for="change-affinity">Elemental Affinity</label>
          <select class="input" id="change-affinity">
            <option value="">None selected</option>
            ${DRAGONBORN_AFFINITIES.map(affinity => `<option value="${esc(affinity)}" ${character.elementalAffinity === affinity ? 'selected' : ''}>${esc(titleCase(affinity))}</option>`).join('')}
          </select>
        ` : ''}
        ${character.elementalAffinity ? `<div class="subtle mt-12">Draconic heritage: ${esc(titleCase(character.elementalAffinity))} affinity</div>` : ''}
        <div class="wrap mt-12">
          <span class="pill" data-tooltip="${esc(`${background.name}\n${background.desc}\n\nStarting package: ${backgroundRewardSummary(background)}`)}" tabindex="0">${esc(background.icon || '✦')} ${esc(background.name)}</span>
        </div>
        <div class="wrap mt-12">${passives}</div>
      </section>

      <section class="card">
        <div class="kicker">Level</div>
        <h3 data-tooltip="${esc(levelTooltip(level))}" tabindex="0">Level ${level.display}</h3>
        <div class="level-xp-meta subtle">${level.fraction > 0 ? `${level.pct}% toward Level ${level.level + 1}` : 'Whole level — tier 5 skill = +1 level'}</div>
        <div class="progress-bar level-xp-bar"><div class="progress-fill" style="width:${level.pct}%"></div></div>
        <div class="wrap mt-14">
          <span class="pill gold">${character.lumens} Lumens</span>
          <span class="pill">${formatCurrency(character.gil)}</span>
          <span class="pill good">${character.hp}/${stats.hp} HP</span>
          <span class="pill warn">${character.stamina}/${stats.stamina} Stamina</span>
        </div>
        ${renderEffectsSnapshot(character)}
      </section>
    </div>

    ${renderEffectsManager(character)}

    <div class="grid two mt-16">
      <section class="card">
        <h3>Core Stats</h3>
        <div class="grid two">
          ${Object.entries(STAT_RULES).map(([stat, rule]) => `<div class="stat-row stat-row-compact" data-tooltip="${esc(statTooltip(rule))}" tabindex="0"><strong>${esc(rule.label)}</strong><div class="stat-value">${stats[stat]}</div></div>`).join('')}
        </div>
      </section>
      <section class="card">
        <h3>Equipment</h3>
        <div class="stack">${renderEquipSlots(character, 'Nothing equipped')}</div>
      </section>
    </div>

    <section class="card mt-16">
      <h3>Inventory</h3>
      <div class="stack">${renderInventoryRows(character)}</div>
    </section>

    <section class="card mt-16">
      <h3>Unlocked Skills</h3>
      ${unlocked.length ? `<div class="wrap">${unlocked.map(skill => `<span class="pill ${isToggleSkill(skill) ? 'warn' : 'good'}" data-tooltip="${esc(skillTooltip(skill))}" tabindex="0">${esc(skill.icon || '✦')} ${esc(skill.name)}</span>`).join('')}</div>` : '<div class="empty">No skills yet. Time to spend shiny brain-money.</div>'}
    </section>
  `
}

function renderSkillsTab(character) {
  const categories = visibleSkillCategories(character)
  if (!categories.length) {
    return '<div class="empty">No skill trees available yet. Learn prerequisite skills to reveal more.</div>'
  }
  if (!categories.includes(state.skillCategory)) state.skillCategory = categories[0]
  const subs = visibleSubcategories(state.skillCategory, character)
  if (!subs.includes(state.skillSubcategory)) state.skillSubcategory = subs[0] || ''

  const list = skillsInSubcategory(state.skillCategory, state.skillSubcategory, character)
    .filter(skill => !state.skillSearch || `${skill.name} ${skill.desc} ${skill.id}`.toLowerCase().includes(state.skillSearch.toLowerCase()))

  const byTier = new Map()
  list.forEach(skill => {
    if (!byTier.has(skill.tier)) byTier.set(skill.tier, [])
    byTier.get(skill.tier).push(skill)
  })

  const learnedInTree = list.filter(skill => character.skills.includes(skill.id)).length
  const costRemaining = isGmMode()
    ? 0
    : list.filter(skill => !character.skills.includes(skill.id)).reduce((sum, skill) => sum + skill.cost, 0)

  return `
    <div class="toolbar">
      <input class="input" id="skill-search" placeholder="Search skills, effects, prerequisites..." value="${esc(state.skillSearch)}" />
      <span class="pill good">${learnedInTree}/${list.length} in tree</span>
      <span class="pill gold">${isGmMode() ? 'Free (GM)' : `${costRemaining}L remaining`}</span>
    </div>
    <div class="segmented">${categories.map(category => `<button type="button" data-skill-category="${esc(category)}" class="${category === state.skillCategory ? 'active' : ''}">${displayCategory(category)}</button>`).join('')}</div>
    <div class="segmented">${subs.map(sub => `<button type="button" data-skill-subcategory="${esc(sub)}" class="${sub === state.skillSubcategory ? 'active' : ''}">${titleCase(sub)}</button>`).join('')}</div>
    <div class="skill-tree">
      ${[...byTier.entries()].sort((a, b) => a[0] - b[0]).map(([tier, skills]) => `
        <section class="tier-lane">
          <h3>Tier ${tier}</h3>
          <div class="skill-grid">${skills.map(skill => renderSkillCard(character, skill)).join('')}</div>
        </section>
      `).join('') || '<div class="empty">No skills matched your search.</div>'}
    </div>
  `
}

function renderSkillCard(character, skill) {
  const unlocked = character.skills.includes(skill.id)
  const check = canLearnSkill(character, skill)
  const active = character.activeToggles.includes(skill.id)
  const conflict = incompatibilityReason(character, skill)
  const cls = unlocked ? 'unlocked' : check.ok ? 'available' : conflict ? 'incompatible' : 'locked'
  const action = unlocked
    ? `<button type="button" class="ghost-btn tiny" data-refund-skill="${esc(skill.id)}">Refund</button>${isToggleSkill(skill) ? `<button type="button" class="chip-btn tiny" data-toggle-skill="${esc(skill.id)}">${active ? 'Switch Off' : 'Switch On'}</button>` : ''}`
    : `<button type="button" class="primary-btn tiny" data-learn-skill="${esc(skill.id)}" ${check.ok ? '' : 'disabled'}>Learn</button>`
  return `
    <article class="skill-card ${cls}" data-tooltip="${esc(skillTooltip(skill))}" tabindex="0">
      <div class="skill-top">
        <div class="skill-icon">${esc(skill.icon || '✦')}</div>
        <div>
          <h4>${esc(skill.name)}</h4>
          <div class="wrap mt-12">
            <span class="pill gold">${isGmMode() && !unlocked ? 'Free' : `${skill.cost}L`}</span>
            <span class="pill warn">${Number(skill.staminaCost || 0)} STA</span>
            <span class="pill">Tier ${Number(skill.tier || 1)}</span>
            ${active ? '<span class="pill good">Active</span>' : ''}
          </div>
        </div>
      </div>
      <p>${esc(skill.desc)}</p>
      <div class="wrap detail-pills">
        ${isToggleSkill(skill) ? '<span class="pill warn">Toggle</span>' : ''}
        ${skill.elementalType ? `<span class="pill">${titleCase(skill.elementalType)}</span>` : ''}
        ${skill.lootType ? `<span class="pill">${titleCase(skill.lootType)}</span>` : ''}
        ${conflict ? '<span class="pill bad">Conflict</span>' : ''}
      </div>
      <div class="spacer"></div>
      <div class="subtle">${esc(prereqLabel(skill))}</div>
      ${!unlocked && !check.ok ? `<div class="pill bad">${esc(check.reason)}</div>` : ''}
      <div class="skill-actions">${action}</div>
    </article>
  `
}

function renderResourceManager(character) {
  const stats = computeStats(character)
  const resourceControl = (resource, label, value, max, quick = [1, 5, 10]) => `
    <div class="resource-editor" data-tooltip="${esc(`${label}
Current value can be adjusted directly or with the quick buttons. Maximum: ${max}`)}" tabindex="0">
      <div>
        <strong>${label}</strong>
        <div class="subtle">Current / max: ${value}/${max}</div>
      </div>
      <div class="resource-control-row">
        ${quick.map(amount => `<button type="button" class="ghost-btn tiny" data-adjust-resource="${resource}" data-amount="-${amount}">-${amount}</button>`).join('')}
        <input class="input mini-input" type="number" min="0" max="${max}" value="${value}" data-resource-input="${resource}" />
        ${quick.map(amount => `<button type="button" class="ghost-btn tiny" data-adjust-resource="${resource}" data-amount="${amount}">+${amount}</button>`).join('')}
        <button type="button" class="primary-btn tiny" data-full-resource="${resource}">Full</button>
      </div>
    </div>
  `
  return `
    <section class="card resource-card">
      <div class="card-header">
        <div>
          <div class="kicker">Live Resource Editor</div>
          <h3>HP, Stamina, Lumens & Gil</h3>
          <p>Use this during play to damage, heal, reward, spend, pay, rob, or otherwise lovingly bully the character.</p>
        </div>
        <span class="pill gold">${formatCurrency(character.gil)}</span>
      </div>
      <div class="stack">
        ${resourceControl('hp', 'HP', character.hp, stats.hp)}
        ${resourceControl('stamina', 'Stamina', character.stamina, stats.stamina)}
        <div class="resource-editor" data-tooltip="${esc('Lumens\nSpend or award any amount. Use the direct box for exact values instead of being trapped in +5/+25 jail.')}" tabindex="0">
          <div>
            <strong>Lumens</strong>
            <div class="subtle">Current: ${character.lumens}</div>
          </div>
          <div class="resource-control-row">
            ${[-25, -10, -5, -1].map(amount => `<button type="button" class="${amount < 0 ? 'danger-btn' : 'ghost-btn'} tiny" data-adjust-resource="lumens" data-amount="${amount}">${amount}</button>`).join('')}
            <input class="input mini-input" type="number" min="0" value="${character.lumens}" data-resource-input="lumens" />
            ${[1, 5, 10, 25].map(amount => `<button type="button" class="ghost-btn tiny" data-adjust-resource="lumens" data-amount="${amount}">+${amount}</button>`).join('')}
          </div>
        </div>
        <div class="resource-editor" data-tooltip="${esc('Gil\nSingle currency for the whole economy. Edit the exact amount or use quick add/remove buttons.')}" tabindex="0">
          <div>
            <strong>Gil</strong>
            <div class="subtle">Current: ${formatCurrency(character.gil)}</div>
          </div>
          <div class="money-grid">
            <label><span class="field-label">Amount</span><input class="input mini-input" type="number" min="0" value="${normalizeGil(character.gil)}" data-gil-input /></label>
            <div class="wrap">
              <button type="button" class="danger-btn tiny" data-coin="-1000">-1k</button>
              <button type="button" class="danger-btn tiny" data-coin="-100">-100</button>
              <button type="button" class="danger-btn tiny" data-coin="-10">-10</button>
              <button type="button" class="ghost-btn tiny" data-coin="10">+10</button>
              <button type="button" class="ghost-btn tiny" data-coin="100">+100</button>
              <button type="button" class="ghost-btn tiny" data-coin="1000">+1k</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  `
}

function renderStatsTab(character) {
  const computed = computeStats(character)
  return `
    ${renderResourceManager(character)}
    <div class="grid two mt-16">
      ${Object.entries(STAT_RULES).map(([stat, rule]) => {
        const rows = statBreakdown(character, stat).map(row => `<span class="pill ${row.value >= 0 ? 'good' : 'bad'}">${esc(row.label)} ${row.value >= 0 ? '+' : ''}${row.value}</span>`).join('')
        return `
          <section class="card">
            <div class="stat-row" data-tooltip="${esc(statTooltip(rule, { includeCost: true }))}" tabindex="0">
              <div>
                <div class="kicker">${rule.cost} Lumens / point</div>
                <h3>${esc(rule.label)}</h3>
              </div>
              <div class="stat-value">${computed[stat]}</div>
            </div>
            <div class="wrap mt-12">${rows}</div>
            <div class="stat-actions">
              <button type="button" class="ghost-btn" data-refund-stat="${esc(stat)}" data-tooltip="${esc(statRefundTooltip(stat, rule, character))}" tabindex="0">- Refund</button>
              <button type="button" class="primary-btn" data-upgrade-stat="${esc(stat)}" data-tooltip="${esc(statUpgradeTooltip(stat, rule, character))}" tabindex="0">+ Upgrade</button>
            </div>
          </section>
        `
      }).join('')}
    </div>
  `
}

function renderInventoryRows(character) {
  const rows = character.inventory.map(entry => {
    const item = getItem(entry.itemId)
    if (!item) return ''
    const equippedSlot = Object.entries(character.equipped || {}).find(([, uidValue]) => uidValue === entry.uid)?.[0]
    const canEquipWeapon = String(item.type || '').toLowerCase().includes('weapon')
    const canEquipArmor = String(item.type || '').toLowerCase().includes('armor')
    const canEquipAccessory = String(item.type || '').toLowerCase().includes('accessory')
    const canEquipOffhand = canEquipWeapon && offhandSlotAvailable(character) && /\bdagger\b/i.test(`${item.id} ${item.name}`) && !equippedSlot
    const canEquip = (canEquipWeapon || canEquipArmor || canEquipAccessory) && !equippedSlot
    const crafted = craftedByLabel(entry, character)
    return `
      <div class="inventory-row" data-tooltip="${esc(itemTooltip(item, character, entry))}" tabindex="0">
        <div>
          <strong>${fallbackIcon(item)} ${esc(item.name)} ${entry.qty > 1 ? `x${entry.qty}` : ''}</strong>
          <div class="subtle">${esc(item.type || 'item')} · ${esc(item.rarity || 'common')} ${equippedSlot ? `· Equipped as ${titleCase(equippedSlot)}` : ''}</div>
          ${crafted ? `<div class="wrap detail-pills"><span class="pill good">${esc(crafted)}</span></div>` : ''}
          <div class="subtle detail-line">${esc(item.desc || 'No description provided.')}</div>
        </div>
        <div class="wrap">
          ${canEquip ? `<button type="button" class="primary-btn tiny" data-equip-item="${esc(entry.uid)}">Equip</button>` : ''}
          ${canEquipOffhand ? `<button type="button" class="ghost-btn tiny" data-equip-offhand="${esc(entry.uid)}">Off-hand</button>` : ''}
          <button type="button" class="danger-btn tiny" data-remove-item="${esc(entry.uid)}">Remove</button>
        </div>
      </div>
    `
  }).join('')
  return rows || '<div class="empty">Inventory empty. Visit the Shop tab to gear up.</div>'
}

function renderShopTab(character) {
  const items = filterCatalogItems(character)
  const pageData = paginateItems(items)
  const typeOptions = cache.itemTypeOptions || ['all']
  const rarityOptions = cache.itemRarityOptions || ['all']
  const featureOptions = [
    ['all', 'Any purpose'],
    ['equippable', 'Any equipment'],
    ['weapon', 'Weapons'],
    ['armor', 'Armour'],
    ['accessory', 'Accessories'],
    ['damage', 'Has damage dice'],
    ['consumable', 'Consumables / food'],
    ['crafting', 'Crafting materials'],
    ['quest', 'Quest / key items'],
    ['strength', 'Boosts Strength'],
    ['magicPower', 'Boosts Magic Power'],
    ['accuracy', 'Boosts Accuracy'],
    ['speed', 'Boosts Speed'],
    ['defence', 'Boosts Defence'],
    ['special', 'Has special effect'],
    ['enchantable', 'Has enchant slots'],
    ['affordable', 'Affordable now'],
    ['free', 'Free / loot']
  ]
  const sortOptions = [
    ['name', 'Name A-Z'],
    ['priceAsc', 'Cheapest first'],
    ['priceDesc', 'Most expensive'],
    ['rarityDesc', 'Rarest first'],
    ['damageDesc', 'Highest damage'],
    ['strengthDesc', 'Best Strength boost'],
    ['magicDesc', 'Best Magic boost'],
    ['defenceDesc', 'Best Defence boost'],
    ['sourceType', 'Source then type']
  ]
  return `
    <section class="card">
      <div class="card-header">
        <div>
          <div class="kicker">Item Catalogue</div>
          <h3>Shop</h3>
          <p>Browse and buy gear. Search by name, effect, stat, damage dice, rarity, or keywords like "burn", "defence", or "sword". Hover any card for full details. Use Grant for free GM loot.</p>
        </div>
        <span class="pill gold">${formatCurrency(character.gil)}</span>
      </div>
      <div class="toolbar item-toolbar">
        <input class="input" id="item-search" placeholder="Search effects/stats e.g. burn, +strength, 1d8, dragon, defence..." value="${esc(state.itemSearch)}" />
        <select class="input" id="item-source">
          ${['shop', 'profession', 'discoverable', 'loot', 'all'].map(source => `<option value="${source}" ${state.itemSource === source ? 'selected' : ''}>${titleCase(source)}</option>`).join('')}
        </select>
        <select class="input" id="item-type">
          ${typeOptions.map(type => `<option value="${esc(type)}" ${state.itemType === type ? 'selected' : ''}>${titleCase(type)}</option>`).join('')}
        </select>
        <select class="input" id="item-rarity">
          ${rarityOptions.map(rarity => `<option value="${esc(rarity)}" ${state.itemRarity === rarity ? 'selected' : ''}>${titleCase(rarity)}</option>`).join('')}
        </select>
        <select class="input" id="item-feature">
          ${featureOptions.map(([value, label]) => `<option value="${value}" ${state.itemFeature === value ? 'selected' : ''}>${esc(label)}</option>`).join('')}
        </select>
        <select class="input" id="item-sort">
          ${sortOptions.map(([value, label]) => `<option value="${value}" ${state.itemSort === value ? 'selected' : ''}>Sort: ${esc(label)}</option>`).join('')}
        </select>
      </div>
      <div class="catalogue-summary">
        <span class="pill good">${pageData.total} match${pageData.total === 1 ? '' : 'es'}</span>
        <span class="pill">Page ${pageData.page + 1}/${pageData.totalPages} · ${ITEMS_PER_PAGE} per page</span>
        <button type="button" class="ghost-btn tiny" data-item-page-prev ${pageData.page <= 0 ? 'disabled' : ''}>Prev</button>
        <button type="button" class="ghost-btn tiny" data-item-page-next ${pageData.page >= pageData.totalPages - 1 ? 'disabled' : ''}>Next</button>
        <button type="button" class="ghost-btn tiny" data-reset-item-filters>Reset Filters</button>
      </div>
      <div class="item-grid">${pageData.items.map(item => renderItemCard(item, character)).join('') || '<div class="empty">No items matched.</div>'}</div>
    </section>
  `
}

function renderCraftTab(character) {
  const recipes = filterCraftRecipes(character, {
    search: state.craftSearch,
    profession: state.craftProfession,
    learnedOnly: state.craftLearnedOnly && !isGmMode()
  })
  const professions = craftProfessionOptions()
  const gmFree = isGmMode()
  return `
    <section class="card">
      <div class="card-header">
        <div>
          <div class="kicker">Career Crafting</div>
          <h3>Craft</h3>
          <p>Craft items from career recipes. Materials are taken from your inventory. ${gmFree ? 'GM Mode: craft without materials.' : 'Learn career skills on the Skills tab to unlock recipes.'}</p>
        </div>
        <span class="pill">${recipes.length} recipe${recipes.length === 1 ? '' : 's'}</span>
      </div>
      <div class="toolbar item-toolbar">
        <input class="input" id="craft-search" placeholder="Search recipes, materials, careers..." value="${esc(state.craftSearch)}" />
        <select class="input" id="craft-profession">
          ${professions.map(profession => `<option value="${esc(profession)}" ${state.craftProfession === profession ? 'selected' : ''}>${profession === 'all' ? 'All careers' : titleCase(profession)}</option>`).join('')}
        </select>
        <label class="pill ${state.craftLearnedOnly ? 'good' : ''}" style="display:inline-flex;align-items:center;gap:.35rem;padding:.35rem .6rem;">
          <input type="checkbox" id="craft-learned-only" ${state.craftLearnedOnly ? 'checked' : ''} ${gmFree ? 'disabled' : ''} />
          Unlocked only
        </label>
      </div>
      <div class="item-grid mt-16">
        ${recipes.map(recipe => renderCraftRecipeCard(recipe, character)).join('') || '<div class="empty">No recipes matched. Learn a tier-1 career skill to unlock crafting.</div>'}
      </div>
    </section>
  `
}

function renderCraftRecipeCard(recipe, character) {
  const check = canCraftRecipe(character, recipe)
  const mats = materialsStatus(character, recipe)
  const skillLabels = (recipe.requiredSkills || []).map(id => getSkill(id)?.name || titleCase(id)).join(', ')
  const matPills = mats.map(mat => `<span class="pill ${mat.ok || isGmMode() ? 'good' : 'bad'}">${esc(mat.name)} ${mat.have}/${mat.need}</span>`).join('')
  return `
    <article class="item-card">
      <div class="item-title">
        <strong>${fallbackIcon(recipe)} ${esc(recipe.name)}</strong>
        <span class="pill">${esc(recipe.tier || recipe.rarity || 'craft')}</span>
      </div>
      <div class="item-meta">${esc(titleCase(recipe.profession || 'career'))} · ${esc(recipe.type || 'item')}</div>
      <p class="subtle">${esc(recipe.desc || 'No description provided.')}</p>
      <div class="wrap detail-pills">
        <span class="pill">Requires: ${esc(skillLabels || '—')}</span>
        ${matPills || '<span class="pill">No materials</span>'}
      </div>
      <div class="skill-actions">
        <span class="pill ${check.ok ? 'good' : 'warn'}">${esc(check.reason)}</span>
        <button type="button" class="primary-btn tiny" data-craft-recipe="${esc(recipe.id)}" ${check.ok ? '' : 'disabled'}>Craft</button>
      </div>
    </article>
  `
}

function renderItemCard(item, character = activeCharacter()) {
  const price = itemPriceGil(item)
  const gmFree = isGmMode()
  const affordable = gmFree || !character || price <= normalizeGil(character.gil)
  const statPills = Object.entries(item.statModifiers || {}).map(([stat, value]) => `<span class="pill ${value >= 0 ? 'good' : 'bad'}">${titleCase(stat)} ${value >= 0 ? '+' : ''}${value}</span>`).join('')
  const effectPills = (item.specialEffects || []).slice(0, 3).map(effect => `<span class="pill warn">${titleCase(effect)}</span>`).join('')
  return `
    <article class="item-card" data-tooltip="${esc(itemTooltip(item, character))}" tabindex="0">
      <div class="item-title">
        <strong>${fallbackIcon(item)} ${esc(item.name)}</strong>
        <span class="pill">${esc(item.rarity || 'common')}</span>
      </div>
      <div class="item-meta">${esc(item.type || 'item')} · ${esc(item.source || 'shop')}${item.damage ? ` · ${esc(item.damage)}` : ''}</div>
      <p class="subtle">${esc(item.desc || 'No description provided.')}</p>
      <div class="wrap detail-pills">
        ${statPills || '<span class="pill">No stat modifiers</span>'}
        ${effectPills}
        ${Number(item.enchantmentSlots || 0) ? `<span class="pill good" data-tooltip="${esc('Enchantment slots shown — enchant UI not implemented yet (planned).')}" tabindex="0">${item.enchantmentSlots} enchant slot${Number(item.enchantmentSlots) === 1 ? '' : 's'}</span>` : ''}
      </div>
      <div class="skill-actions">
        <span class="pill gold">${gmFree ? 'Free (GM)' : price ? formatCurrency(price) : 'Free/loot'}</span>
        <span class="wrap compact-actions">
          <button type="button" class="ghost-btn tiny" data-grant-item="${esc(item.id)}">Grant</button>
          <button type="button" class="primary-btn tiny" data-buy-item="${esc(item.id)}" ${affordable ? '' : 'disabled'}>${gmFree ? 'Take' : 'Buy'}</button>
        </span>
      </div>
    </article>
  `
}

function renderGmPremadePicker() {
  const list = filterPremadeCharacters({
    search: state.gmPremadeSearch,
    category: state.gmPremadeCategory,
    sort: state.gmPremadeSort
  })
  const categories = premadeCategories()
  const sortOptions = PREMADE_SORT_OPTIONS
  const rosterCount = state.characters.length

  return `
    <section class="card mt-16">
      <div class="kicker">Premade Characters</div>
      <h3>Add NPC / Hero Templates</h3>
      <p>Spawn from ${list.length} templates. Add multiple copies at once — names become <em>Thief</em>, <em>Thief 2</em>, <em>Thief 3</em>, etc.</p>
      <div class="toolbar mt-12">
        <input class="input" id="gm-premade-search" placeholder="Search premade characters..." value="${esc(state.gmPremadeSearch)}" />
        <select class="input" id="gm-premade-sort" aria-label="Sort premade characters">
          ${sortOptions.map(([value, label]) => `<option value="${esc(value)}" ${state.gmPremadeSort === value ? 'selected' : ''}>${esc(label)}</option>`).join('')}
        </select>
        <span class="pill">${rosterCount} in roster</span>
      </div>
      <div class="segmented mt-12">${categories.map(category => `
        <button type="button" data-gm-premade-category="${esc(category)}" class="${category === state.gmPremadeCategory ? 'active' : ''}">${titleCase(category)}</button>
      `).join('')}</div>
      <div class="premade-grid mt-14">
        ${list.map(({ entry, level }) => {
          const inRoster = countPremadeInRoster(entry.premadeId)
          const race = getRace(entry.race)
          const skillCount = Array.isArray(entry.skills) ? entry.skills.length : 0
          return `
            <article class="premade-card">
              <div class="premade-card-top">
                <strong>${esc(race?.icon || '👤')} ${esc(entry.name)}</strong>
                <span class="pill level-pill">Lv ${level}</span>
              </div>
              <div class="wrap">
                <span class="pill">${esc(entry.category || 'npc')}</span>
                <span class="pill subtle-pill">${skillCount} skill${skillCount === 1 ? '' : 's'}</span>
                ${inRoster ? `<span class="pill good">${inRoster} in roster</span>` : ''}
              </div>
              <div class="subtle">${esc(race?.name || entry.race || 'Unknown race')}${entry.elementalAffinity ? ` · ${titleCase(entry.elementalAffinity)}` : ''}</div>
              <p class="subtle">${esc(entry.notes || '')}</p>
              <div class="skill-actions premade-spawn-row">
                <label class="premade-count-label">
                  <span class="field-label">Qty</span>
                  <input type="number" class="input tiny premade-count-input" min="1" max="10" value="1" data-premade-count-for="${esc(entry.premadeId)}" aria-label="How many ${esc(entry.name)} to add" />
                </label>
                <button type="button" class="primary-btn tiny" data-spawn-premade="${esc(entry.premadeId)}">Add to Roster</button>
              </div>
            </article>
          `
        }).join('') || '<div class="empty">No premade characters matched your search.</div>'}
      </div>
    </section>
  `
}

function renderNpcTurnSuggestionCard(result) {
  const skillsHtml = result.suggestions.length
    ? result.suggestions.map((skill, index) => `
        <div class="npc-turn-skill">
          ${result.suggestions.length > 1 ? `<span class="subtle">${index + 1}.</span>` : ''}
          <strong>${esc(skill.name)}</strong>
          <span class="subtle">· ${skill.cost} stamina</span>
          ${skill.blocked ? `<span class="pill warn tiny-pill">${esc(skill.blocked)}</span>` : ''}
        </div>
      `).join('')
    : '<div class="subtle">No activatable attacks on action bar.</div>'

  return `
    <article class="npc-turn-result ${result.hasMultiattack ? 'has-multiattack' : ''}">
      <div class="npc-turn-result-head">
        <strong>${esc(result.characterName)}</strong>
        <span class="subtle">HP ${esc(result.hp)} · STA ${esc(result.stamina)}</span>
      </div>
      ${result.hasMultiattack ? '<span class="pill subtle-pill tiny-pill">Multiattack</span>' : ''}
      ${skillsHtml}
      ${result.movementHint ? `<p class="npc-turn-note subtle">${esc(result.movementHint)}</p>` : ''}
    </article>
  `
}

function renderGmNpcTurnPanel() {
  const roster = state.characters
  const selectedIds = new Set(state.gmNpcTurnCharacterIds)
  const results = state.lastNpcTurns || []
  const suggestionHtml = results.length
    ? `<div class="npc-turn-results">${results.map(renderNpcTurnSuggestionCard).join('')}</div>`
    : '<p class="subtle">Select roster characters, then suggest turns. Characters with Multiattack get 2 different attacks.</p>'

  return `
    <section class="card mt-16">
      <div class="kicker">Combat Helper</div>
      <h3>Enemy / NPC Turn Template</h3>
      <p>Suggests attacks from each character's action bar. Multiattack passives get 2 different skills.</p>
      <div class="gm-turn-picker mt-12">
        <div class="section-title-row">
          <span class="field-label">Characters</span>
          <div class="wrap compact-actions">
            <button type="button" class="ghost-btn tiny" data-select-all-gm-turn ${roster.length ? '' : 'disabled'}>Select all</button>
            <button type="button" class="ghost-btn tiny" data-clear-gm-turn ${roster.length ? '' : 'disabled'}>Clear</button>
          </div>
        </div>
        <div class="gm-check-grid">
          ${roster.map(character => `
            <label class="gm-check-row">
              <input type="checkbox" data-gm-turn-character="${esc(character.id)}" ${selectedIds.has(character.id) ? 'checked' : ''} />
              <span>${esc(character.name)}</span>
            </label>
          `).join('') || '<p class="subtle">No characters in roster yet.</p>'}
        </div>
      </div>
      <div class="wrap mt-12">
        <button type="button" class="primary-btn" data-generate-npc-turn ${roster.length ? '' : 'disabled'}>Suggest Turn${selectedIds.size > 1 ? 's' : ''}</button>
        ${selectedIds.size ? `<span class="pill">${selectedIds.size} selected</span>` : '<span class="subtle">None selected — uses active character</span>'}
      </div>
      <div class="mt-14">${suggestionHtml}</div>
    </section>
  `
}

function renderGmInitiativeTracker() {
  const { entries, activeEntryId } = state.initiativeTracker
  const sorted = sortInitiativeEntries(entries)
  const active = activeInitiativeEntry(entries, activeEntryId)

  const sortedList = sorted.length
    ? `<ol class="initiative-order-list">
        ${sorted.map((entry, index) => {
          const isActive = entry.id === active?.id
          const initLabel = entry.initiative === '' || entry.initiative == null ? '—' : entry.initiative
          return `
            <li class="initiative-order-item ${isActive ? 'is-active-turn' : ''}">
              <button type="button" class="initiative-turn-btn ${isActive ? 'active' : ''}" data-set-initiative-active="${esc(entry.id)}" title="Set as current turn">
                <span class="initiative-rank">${index + 1}</span>
                <span class="initiative-name">${esc(entry.name || 'Unnamed')}</span>
                <span class="initiative-score">${esc(String(initLabel))}</span>
              </button>
            </li>
          `
        }).join('')}
      </ol>`
    : '<p class="subtle">Add combatants and enter initiative — the list sorts highest to lowest automatically.</p>'

  const editorRows = entries.length
    ? entries.map(entry => `
        <div class="initiative-edit-row">
          <input class="input" type="text" value="${esc(entry.name)}" data-initiative-name="${esc(entry.id)}" placeholder="Name" aria-label="Initiative name" />
          <input class="input initiative-value-input" type="number" value="${entry.initiative === '' || entry.initiative == null ? '' : entry.initiative}" data-initiative-value="${esc(entry.id)}" placeholder="Init" aria-label="Initiative value" />
          <button type="button" class="ghost-btn tiny" data-remove-initiative="${esc(entry.id)}" aria-label="Remove ${esc(entry.name || 'entry')}">Remove</button>
        </div>
      `).join('')
    : ''

  return `
    <section class="card mt-16">
      <div class="kicker">Combat Helper</div>
      <h3>Initiative Tracker</h3>
      <p>Build the turn order, enter each initiative roll, and step through combat with <strong>Next player</strong>.</p>

      ${active ? `
        <div class="initiative-current-turn notice-card">
          <div class="kicker">Current turn</div>
          <h2>${esc(active.name || 'Unnamed')}</h2>
          <p class="subtle">Initiative ${active.initiative === '' || active.initiative == null ? 'not set' : active.initiative}</p>
        </div>
      ` : ''}

      <div class="initiative-layout mt-14">
        <div class="initiative-sorted">
          <div class="section-title-row">
            <span class="field-label">Turn order</span>
          </div>
          ${sortedList}
        </div>
        <div class="initiative-editor">
          <div class="section-title-row">
            <span class="field-label">Combatants</span>
            <div class="wrap compact-actions">
              <button type="button" class="ghost-btn tiny" data-add-initiative-entry>Add blank</button>
              <button type="button" class="ghost-btn tiny" data-add-roster-initiative ${state.characters.length ? '' : 'disabled'}>Add roster</button>
            </div>
          </div>
          <div class="initiative-edit-rows">${editorRows || '<p class="subtle">No entries yet.</p>'}</div>
        </div>
      </div>

      <div class="wrap mt-14">
        <button type="button" class="primary-btn" data-initiative-next ${entries.length ? '' : 'disabled'}>Next player</button>
        <button type="button" class="ghost-btn" data-initiative-reset-round ${entries.length ? '' : 'disabled'}>Reset round</button>
        <button type="button" class="ghost-btn" data-clear-initiative ${entries.length ? '' : 'disabled'}>Clear list</button>
      </div>
    </section>
  `
}

function renderGmTab(character) {
  const diceResult = state.lastRoll ? `<div class="notice-card"><h2>${state.lastRoll.total}</h2><p>Rolls: ${state.lastRoll.rolls.join(', ')} ${state.lastRoll.modifier ? `· Modifier ${state.lastRoll.modifier >= 0 ? '+' : ''}${state.lastRoll.modifier}` : ''}</p></div>` : ''
  const gmOn = isGmMode()
  return `
    <div class="grid two">
      <section class="card ${gmOn ? 'gm-mode-card-active' : ''}">
        <div class="kicker">GM Mode</div>
        <h3>${gmOn ? 'GM Mode Active' : 'Activate GM Mode'}</h3>
        <p>Unlock every skill tree, ignore prerequisites and incompatibilities, and make all skills, stat upgrades, and shop items free.</p>
        <div class="wrap mt-14">
          <button type="button" class="${gmOn ? 'danger-btn' : 'primary-btn'}" data-toggle-gm-mode>${gmOn ? 'Deactivate GM Mode' : 'Activate GM Mode'}</button>
        </div>
        ${gmOn ? '<p class="subtle mt-12">Skills tab shows all trees. Buy/Take items for free. Stat upgrades cost no Lumens.</p>' : ''}
      </section>

      <section class="card">
        <div class="kicker">Dice Roller</div>
        <h3>Roll Dice</h3>
        <div class="grid three">
          <label><span class="field-label">Count</span><input class="input" id="dice-count" type="number" min="1" max="40" value="${state.dice.count}" /></label>
          <label><span class="field-label">Sides</span><input class="input" id="dice-sides" type="number" min="2" max="100" value="${state.dice.sides}" /></label>
          <label><span class="field-label">Modifier</span><input class="input" id="dice-mod" type="number" min="-100" max="100" value="${state.dice.modifier}" /></label>
        </div>
        <button type="button" class="primary-btn full" data-roll-dice>Roll</button>
        <div class="mt-14">${diceResult}</div>
      </section>
    </div>

    ${renderGmInitiativeTracker()}

    ${renderGmNpcTurnPanel()}

    ${gmOn ? renderGmPremadePicker() : ''}

    <section class="card mt-16">
      <h3>Save Utilities</h3>
      <div class="wrap">
        <button type="button" class="ghost-btn" data-export-character ${character ? '' : 'disabled'}>Export Current Character (JSON)</button>
        <button type="button" class="ghost-btn" data-print-character-sheet ${character ? '' : 'disabled'}>Print Character Sheet</button>
        <button type="button" class="ghost-btn" data-export-all-bottom>Export Whole Save</button>
        <button type="button" class="danger-btn" data-delete-active ${character ? '' : 'disabled'}>Delete Current Character</button>
      </div>
    </section>
  `
}

function renderNotesTab(character) {
  const statusLabel = state.notesDirty ? 'Unsaved changes' : 'Saved'
  const toneClass = state.notesDirty ? 'warn' : 'good'
  return `
    <section class="card">
      <div class="card-header">
        <div>
          <div class="kicker">Campaign Notes</div>
          <h3>${esc(character.name)}'s Notes</h3>
          <p>Use this for build plans, loot promises, session reminders, crimes committed, crimes denied, and suspiciously specific goblin grudges.</p>
        </div>
        <div class="wrap">
          <span id="notes-status" class="pill ${toneClass}">${statusLabel}</span>
          <button type="button" class="primary-btn tiny" data-save-notes-button>Save Notes</button>
        </div>
      </div>
      <textarea id="character-notes">${esc(character.notes || '')}</textarea>
    </section>
  `
}