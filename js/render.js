import { $, $$, esc, titleCase } from './utils.js'
import { STAT_RULES, ITEMS_PER_PAGE, DRAGONBORN_AFFINITIES, HOMEBREW_ITEM_TYPES, HOMEBREW_RARITIES, HOMEBREW_SKILL_CATEGORIES, HOMEBREW_SKILL_TYPES, HOMEBREW_SKILL_DAMAGE_MODES, HOMEBREW_ELEMENT_TYPES, HOMEBREW_DAMAGE_STAT_KEYS, TIER_LUMEN_COST } from './constants.js'
import { state, activeCharacter } from './state.js'
import { raceOptions, getRace, getSkill, getItem, cache } from './cache.js'
import { computeStats, statBreakdown, getEffect } from './character.js'
import { offhandSlotLockReason, weaponHandednessLabel, offhandTypeLabel, canEquipToOffhand, isOffhandItem, canEquipToMainHand } from './equipment.js'
import { activePerformanceStatuses, formatPerformanceMeta } from './instruments.js'
import {
  visibleSubcategories,
  visibleSkillCategories,
  skillsInSubcategory,
  displayCategory,
  canLearnSkill,
  displaySubcategory,
  incompatibilityReason,
  isToggleSkill,
  prereqLabel,
  humanStarterWeaponOptions
} from './skills.js'
import { characterLevelInfo, levelTooltip } from './level.js'
import { isTableRuleRacePassive, racePassiveTooltip } from './race-passives.js'
import { listHomebrewItems, listHomebrewSkills, listHomebrewRaces, homebrewSkillTreeOptions, homebrewRaceOptionsForSkills } from './homebrew.js'
import { homebrewDamageStatLabel } from './homebrew-combat.js'
import { isGmMode } from './gm-mode.js'
import {
  filterPremadeCharacters,
  premadeCategories,
  countPremadeInRoster,
  PREMADE_SORT_OPTIONS
} from './premade-characters.js'
import { filterCatalogItems, paginateItems, isShopPurchaseItem, shopMinLevelForItem, shopPurchaseCheck, ITEM_CATALOG_CATEGORIES, catalogCategoryCounts, catalogSourceCounts, activeCatalogFilterLabels, itemHasCounter, itemCounterLabel, inventoryCounterValue } from './items.js'
import {
  manualEffectList,
  effectList,
  effectDurationLabel,
  effectTypeLabel,
  effectTone,
  effectTooltip,
  effectUsesPotency,
  effectPotencyLabel,
  characterEffectSources
} from './effects.js'
import { formatCurrency, formatStatModifiers, fallbackIcon, itemPriceGil, normalizeGil } from './format.js'
import { itemTooltip, skillTooltip, statTooltip, statUpgradeTooltip, statRefundTooltip } from './tooltips-text.js'
import { renderActionBar } from './action-bar.js'
import { backgroundOptions, getBackground, backgroundRewardSummary, DEFAULT_BACKGROUND } from './backgrounds.js'
import { sortInitiativeEntries, activeInitiativeEntry } from './gm-initiative.js'
import { filterCraftRecipes, canCraftRecipe, materialsStatus, craftProfessionOptions } from './craft.js'
import { craftedByLabel } from './craft-bonuses.js'
import {
  maxEnchantmentSlots,
  entryEnchantments,
  enchantmentTooltip,
  isEnhancementItem,
  compatibleEquippedGearForEnhancement,
  applyEnchantTargetLabel,
  enchantDisplayLabel,
  isShieldEnchant
} from './enchantments.js'
import {
  computeElementalAffinity,
  elementalAffinityTooltip,
  elementalAffinityTone,
  isElementalAffinityRowVisible,
  ELEMENTS
} from './elemental-affinity.js'
import { filterGlossaryEntries, groupGlossaryEntries, GLOSSARY_CATEGORIES, getAllGlossaryEntries } from './glossary.js'
import {
  characterFolder,
  folderAssignOptions,
  listCharacterFolders,
  rosterFolderSections,
  isRosterFolderOpen
} from './character-folders.js'

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

function captureContentFocus() {
  const active = document.activeElement
  if (!(active instanceof HTMLElement)) return null
  if (!active.closest('#app-content') || !active.id) return null
  const capture = { id: active.id }
  if (active instanceof HTMLInputElement || active instanceof HTMLTextAreaElement) {
    capture.selectionStart = active.selectionStart
    capture.selectionEnd = active.selectionEnd
  }
  return capture
}

function restoreContentFocus(capture) {
  if (!capture?.id) return
  const el = document.getElementById(capture.id)
  if (!(el instanceof HTMLElement)) return
  el.focus({ preventScroll: true })
  if (
    (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) &&
    capture.selectionStart != null &&
    typeof el.setSelectionRange === 'function'
  ) {
    const start = capture.selectionStart
    const end = capture.selectionEnd ?? start
    try {
      el.setSelectionRange(start, end)
    } catch {
      // Some input types do not support selection ranges.
    }
  }
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
  preview.innerHTML = [
    `<span class="create-preview-desc">${esc(bg.desc)}</span>`,
    `<span class="create-preview-start">Starting: ${esc(backgroundRewardSummary(bg))}.</span>`
  ].join('')
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

function renderCharacterCard(character) {
  const race = getRace(character.race)
  const level = characterLevelInfo(character)
  const folder = characterFolder(character)
  const folderOptions = folderAssignOptions(state, folder)
  return `
    <div class="character-card-wrap">
      <button type="button" class="character-card ${character.id === state.activeId ? 'active' : ''}" data-select-character="${esc(character.id)}">
        <strong>${esc(race?.icon || '👤')} ${esc(character.name)}</strong>
        <span>Lv ${level.display} · ${level.skillCount} skills · ${character.lumens}L</span>
      </button>
      <div class="character-move-picker">
        <button
          type="button"
          class="ghost-btn tiny character-folder-move"
          data-toggle-character-move="${esc(character.id)}"
          data-tooltip="Move folder"
          title="Move folder"
          aria-label="Move ${esc(character.name)} to another folder"
          aria-expanded="false"
          aria-haspopup="menu"
        >→</button>
        <div class="character-move-menu" hidden data-character-move-menu="${esc(character.id)}" role="menu">
          ${folderOptions.map(opt => `
            <button
              type="button"
              role="menuitem"
              class="ghost-btn tiny character-move-option${opt.value === folder ? ' is-current' : ''}"
              data-move-character="${esc(character.id)}"
              data-move-folder="${esc(opt.value)}"
            >${esc(opt.label)}</button>
          `).join('')}
        </div>
      </div>
      <button type="button" class="ghost-btn tiny character-dup" data-duplicate-character="${esc(character.id)}" title="Duplicate character">⧉</button>
    </div>
  `
}

function renderFolderSummary(section, open) {
  const count = section.characters.length
  if (!section.canManage) {
    return `
      <summary class="character-folder-summary">
        <span class="character-folder-summary-text">${esc(section.label)} <span class="character-folder-count">(${count})</span></span>
      </summary>
    `
  }

  const atTop = section.folderIndex <= 0
  const atBottom = section.folderIndex >= section.folderCount - 1
  return `
    <summary class="character-folder-summary">
      <span class="character-folder-summary-text">${esc(section.label)} <span class="character-folder-count">(${count})</span></span>
      <span class="character-folder-picker">
        <button
          type="button"
          class="ghost-btn tiny character-folder-menu-btn"
          data-toggle-folder-menu="${esc(section.key)}"
          data-tooltip="Folder options"
          title="Folder options"
          aria-label="Folder options for ${esc(section.label)}"
          aria-expanded="false"
          aria-haspopup="menu"
        >⋯</button>
        <div class="character-folder-menu" hidden data-folder-menu="${esc(section.key)}" role="menu">
          <button type="button" role="menuitem" class="ghost-btn tiny character-folder-menu-option" data-folder-move-up="${esc(section.key)}" ${atTop ? 'disabled' : ''}>Move up</button>
          <button type="button" role="menuitem" class="ghost-btn tiny character-folder-menu-option" data-folder-move-down="${esc(section.key)}" ${atBottom ? 'disabled' : ''}>Move down</button>
          <button type="button" role="menuitem" class="ghost-btn tiny character-folder-menu-option" data-copy-folder="${esc(section.key)}">Copy folder</button>
          <button type="button" role="menuitem" class="ghost-btn tiny character-folder-menu-option danger-btn" data-delete-folder="${esc(section.key)}">Delete folder</button>
        </div>
      </span>
    </summary>
  `
}

function renderCharacterList() {
  const list = $('#character-list')
  if (!list) return
  if (!state.characters.length && !(state.characterFolderOrder || []).length) {
    list.innerHTML = '<div class="empty">No characters yet. Make a chaos gremlin above.</div>'
    return
  }

  const sections = rosterFolderSections(state)
  list.innerHTML = sections.map(section => {
    const open = isRosterFolderOpen(state, section.key, section.characters)
    const body = section.characters.length
      ? section.characters.map(renderCharacterCard).join('')
      : '<p class="subtle character-folder-empty">No characters here yet.</p>'
    return `
      <details class="character-folder-details" data-folder-key="${esc(section.key)}" ${open ? 'open' : ''}>
        ${renderFolderSummary(section, open)}
        <div class="character-folder-body">
          ${body}
        </div>
      </details>
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
  const focusCapture = captureContentFocus()
  const content = $('#app-content')
  const character = activeCharacter()
  if (!character && state.tab !== 'gm' && state.tab !== 'homebrew') {
    content.innerHTML = `
      <div class="notice-card">
        <h2>Welcome to LumenForge ✨</h2>
        <p>This rebuild keeps the core idea: characters, races, lumens, skills, equipment and GM-friendly tools - but trims the clutter so it is actually usable at the table.</p>
      </div>
    `
    restoreContentFocus(focusCapture)
    return
  }

  const tabs = {
    character: () => renderCharacterTab(character),
    skills: () => renderSkillsTab(character),
    stats: () => renderStatsTab(character),
    shop: () => renderShopTab(character),
    craft: () => renderCraftTab(character),
    homebrew: () => renderHomebrewTab(),
    gm: () => renderGmTab(character),
    notes: () => renderNotesTab(character)
  }
  content.innerHTML = tabs[state.tab]?.() || ''
  restoreContentFocus(focusCapture)
}

export function renderEquipSlots(character, emptyLabel = 'Empty') {
  const slots = ['weapon', 'offhand', 'armor', 'accessory']
  const offhandLocked = offhandSlotLockReason(character)
  return slots.map(slot => {
    const entry = character.inventory.find(inv => inv.uid === character.equipped[slot])
    const item = entry && getItem(entry.itemId)
    const label = slot === 'offhand' ? 'Off-hand' : titleCase(slot)
    const enchantRow = entry && item ? renderEquipEnchantSlots(character, entry, item) : ''
    const rowTip = item ? itemTooltip(item, character, entry) : ''
    const lockedHint = slot === 'offhand' && offhandLocked && !item
      ? offhandLocked
      : ''
    const emptyText = lockedHint || emptyLabel
    const rowClass = lockedHint ? 'equip-row equip-slot-row equip-slot-locked' : 'equip-row equip-slot-row'
    return `
      <div class="${rowClass}">
        <div class="equip-slot-copy"${rowTip ? ` data-tooltip="${esc(rowTip)}" tabindex="0"` : lockedHint ? ` data-tooltip="${esc(lockedHint)}" tabindex="0"` : ''}>
          <strong class="equip-slot-label">${label}${lockedHint ? ' <span class="subtle">(locked)</span>' : ''}</strong>
          <div class="subtle equip-slot-item">${item ? `${fallbackIcon(item)} ${esc(item.name)} · ${formatStatModifiers(item.statModifiers)}` : emptyText}</div>
          ${entry && item ? renderItemCounterControls(entry, item, { showWhenEquipped: true }) : ''}
          ${enchantRow}
        </div>
        ${item ? `<button type="button" class="ghost-btn tiny" data-unequip="${slot}">Unequip</button>` : ''}
      </div>
    `
  }).join('')
}

function renderEquipEnchantSlots(character, entry, item) {
  const max = maxEnchantmentSlots(entry, item)
  if (max <= 0) return ''
  const enchants = entryEnchantments(entry)
  const chips = []
  for (let i = 0; i < max; i++) {
    const ench = enchants[i]
    if (ench) {
      const tip = enchantmentTooltip(ench, item.name)
      if (isShieldEnchant(ench)) {
        chips.push(`
          <span class="enchant-slot-chip filled enchant-shield-chip" data-tooltip="${esc(tip)}" tabindex="0">
            ${esc(ench.icon || '✨')} ${esc(enchantDisplayLabel(ench))}
          </span>
          <button type="button" class="ghost-btn tiny enchant-shield-soak-btn" data-shield-soak-gear="${esc(entry.uid)}" data-enchant-id="${esc(ench.id)}" data-shield-soak-amount="1" title="Record 1 magical damage soaked">−1</button>
          <button type="button" class="ghost-btn tiny enchant-shield-soak-btn" data-shield-soak-gear="${esc(entry.uid)}" data-enchant-id="${esc(ench.id)}" data-shield-soak-amount="5" title="Record 5 magical damage soaked">−5</button>
          <button type="button" class="ghost-btn tiny enchant-remove-btn" data-remove-enchant="${esc(entry.uid)}" data-enchant-id="${esc(ench.id)}" title="Remove barrier">×</button>
        `)
      } else {
        const removeTip = `${tip}\n\nClick to remove and return to inventory.`
        chips.push(`
          <button type="button" class="enchant-slot-chip filled" data-remove-enchant="${esc(entry.uid)}" data-enchant-id="${esc(ench.id)}" data-tooltip="${esc(removeTip)}" title="Remove enchant">
            ${esc(ench.icon || '✨')} ${esc(enchantDisplayLabel(ench))}
          </button>
        `)
      }
    } else {
      chips.push(`
        <span class="enchant-slot-chip empty" data-tooltip="${esc('Empty enchant slot — use Apply on an enhancement in Inventory.')}" tabindex="0">Empty slot</span>
      `)
    }
  }
  return `<div class="enchant-slot-row">${chips.join('')}</div>`
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

function renderHomebrewEffectSection(draft, options = {}) {
  const {
    intro = 'Pick established game effects so passives and combat math work like official content. Unique rules stay in the description.',
    showPicker = state.homebrewShowEffectPicker,
    search = state.homebrewEffectSearch,
    toggleData = 'homebrew-toggle-effects',
    searchId = 'homebrew-effect-search',
    toggleCheckbox = 'homebrew-effect-toggle',
    removeBtn = 'homebrew-effect-remove'
  } = options
  const selected = new Set(draft?.specialEffects || [])
  const selectedPills = [...selected].map(effectId => {
    const effect = getEffect(effectId)
    if (!effect) {
      return `<span class="pill warn">${esc(effectId)} <button type="button" class="homebrew-effect-remove" data-${removeBtn}="${esc(effectId)}" aria-label="Remove">×</button></span>`
    }
    return `<span class="pill ${effectTone(effect)}" data-tooltip="${esc(effectTooltip(effectId, 'Homebrew'))}" tabindex="0">${esc(effect.icon || '✦')} ${esc(effect.name)} <button type="button" class="homebrew-effect-remove" data-${removeBtn}="${esc(effectId)}" aria-label="Remove ${esc(effect.name)}">×</button></span>`
  }).join('')

  const query = String(search || '').toLowerCase().trim()
  const filtered = effectList().filter(effect => {
    if (!query) return true
    const hay = `${effect.name} ${effect.id} ${effect.desc} ${effect.type}`.toLowerCase()
    return hay.includes(query)
  })
  const groups = new Map()
  for (const effect of filtered) {
    const group = effectTypeLabel(effect.type)
    if (!groups.has(group)) groups.set(group, [])
    groups.get(group).push(effect)
  }
  const pickerRows = [...groups.entries()].map(([group, effects]) => `
    <div class="homebrew-effect-group">
      <div class="homebrew-effect-group-title">${esc(group)}</div>
      ${effects.map(effect => `
        <label class="homebrew-effect-option ${selected.has(effect.id) ? 'selected' : ''}" data-tooltip="${esc(effectTooltip(effect.id, 'Catalog effect'))}" tabindex="0">
          <input type="checkbox" data-${toggleCheckbox}="${esc(effect.id)}" ${selected.has(effect.id) ? 'checked' : ''} />
          <span class="homebrew-effect-option-copy">
            <strong>${esc(effect.icon || '✦')} ${esc(effect.name)}</strong>
            <span class="subtle">${esc(effect.desc || '')}</span>
          </span>
        </label>
      `).join('')}
    </div>
  `).join('')

  return `
    <div class="homebrew-effects span-2">
      <div class="kicker">Special effects (optional)</div>
      <p class="subtle">${esc(intro)}</p>
      <div class="wrap detail-pills homebrew-effect-selected">${selectedPills || '<span class="pill">No effects selected</span>'}</div>
      <button type="button" class="ghost-btn tiny mt-12" data-${toggleData}>${showPicker ? 'Hide effect list' : 'Add effect(s)'}</button>
      ${showPicker ? `
        <div class="homebrew-effect-picker mt-12">
          <input class="input" id="${searchId}" placeholder="Search effects…" value="${esc(search || '')}" />
          <div class="homebrew-effect-list">${pickerRows || '<div class="empty">No effects match your search.</div>'}</div>
        </div>
      ` : ''}
    </div>
  `
}

function homebrewDamageModeLabel(mode) {
  return HOMEBREW_SKILL_DAMAGE_MODES.find(row => row.id === mode)?.label || titleCase(mode || 'none')
}

function renderHomebrewSkillDamageSection(draft) {
  if (draft?.skillType !== 'activatable') return ''
  const mode = draft.damageMode || 'none'
  const needsElement = mode.includes('elemental')
  const modeActive = mode !== 'none'
  const damageStat = draft.damageStat || (needsElement ? 'magicPower' : 'strength')
  return `
    <div class="homebrew-damage span-2">
      <div class="kicker">Damage (optional)</div>
      <p class="subtle">For attack actions. Custom dice can add a stat (e.g. Physical Defence for a shield bash). Opponent effects stay in the description.</p>
      <div class="grid two mt-12">
        <label>
          <span class="field-label">Damage mode</span>
          <select class="input" name="hbs-damage-mode">
            ${HOMEBREW_SKILL_DAMAGE_MODES.map(row => `<option value="${row.id}" ${mode === row.id ? 'selected' : ''}>${esc(row.label)}</option>`).join('')}
          </select>
        </label>
        <label>
          <span class="field-label">Damage dice${modeActive ? ' *' : ''}</span>
          <input class="input" name="hbs-damage-dice" value="${esc(draft.damageDice || '')}" placeholder="${mode.startsWith('basic_plus') ? 'e.g. 100 + 10d20' : 'e.g. 100 + 10d20 or 2d6'}" />
        </label>
      </div>
      <div class="grid two mt-12">
        <label>
          <span class="field-label">Add stat to dice${modeActive ? '' : ''}</span>
          <select class="input" name="hbs-damage-stat" ${modeActive ? '' : 'disabled'}>
            <option value="none" ${!damageStat || damageStat === 'none' ? 'selected' : ''}>None (dice only)</option>
            ${HOMEBREW_DAMAGE_STAT_KEYS.map(key => `<option value="${key}" ${damageStat === key ? 'selected' : ''}>${esc(STAT_RULES[key]?.label || titleCase(key))}</option>`).join('')}
          </select>
        </label>
        <label>
          <span class="field-label">Element${needsElement ? ' *' : ''}</span>
          <select class="input" name="hbs-elemental-type">
            <option value="">${needsElement ? 'Pick element…' : 'Only for elemental damage modes'}</option>
            ${HOMEBREW_ELEMENT_TYPES.map(ele => `<option value="${ele}" ${draft.elementalType === ele ? 'selected' : ''}>${titleCase(ele)}</option>`).join('')}
          </select>
        </label>
      </div>
      ${modeActive && damageStat && damageStat !== 'none' ? `<p class="subtle mt-12">On use: dice total + ${esc(homebrewDamageStatLabel(damageStat))}.</p>` : ''}
      ${!modeActive ? '<p class="subtle mt-12">Choose a damage mode above, then enter dice (and element if elemental).</p>' : ''}
    </div>
  `
}

function renderHomebrewUseEffectSection(draft) {
  if (draft?.skillType !== 'activatable') return ''
  const rows = draft.activationEffects || []
  const selectedIds = new Set(rows.map(row => row.effectId))
  const selectedRows = rows.map(row => {
    const effect = getEffect(row.effectId)
    const potencyLabel = effectUsesPotency(effect) ? effectPotencyLabel(effect) : 'Potency'
    return `
      <div class="homebrew-use-effect-row">
        <span class="pill ${effect ? effectTone(effect) : 'warn'}">${effect ? esc(`${effect.icon || '✦'} ${effect.name}`) : esc(row.effectId)}</span>
        <label class="field-label compact">Turns
          <input class="input tiny" type="number" min="0" name="hbs-use-duration-${esc(row.effectId)}" value="${esc(String(row.duration ?? 3))}" />
        </label>
        <label class="field-label compact">${esc(potencyLabel)}
          <input class="input tiny" type="number" name="hbs-use-potency-${esc(row.effectId)}" value="${row.potency == null ? '' : esc(String(row.potency))}" placeholder="auto" />
        </label>
        <button type="button" class="homebrew-effect-remove" data-homebrew-skill-use-effect-remove="${esc(row.effectId)}" aria-label="Remove">×</button>
      </div>
    `
  }).join('')

  const query = String(state.homebrewSkillUseEffectSearch || '').toLowerCase().trim()
  const filtered = effectList().filter(effect => {
    if (!query) return true
    const hay = `${effect.name} ${effect.id} ${effect.desc} ${effect.type}`.toLowerCase()
    return hay.includes(query)
  })
  const groups = new Map()
  for (const effect of filtered) {
    const group = effectTypeLabel(effect.type)
    if (!groups.has(group)) groups.set(group, [])
    groups.get(group).push(effect)
  }
  const pickerRows = [...groups.entries()].map(([group, effects]) => `
    <div class="homebrew-effect-group">
      <div class="homebrew-effect-group-title">${esc(group)}</div>
      ${effects.map(effect => `
        <label class="homebrew-effect-option ${selectedIds.has(effect.id) ? 'selected' : ''}" data-tooltip="${esc(effectTooltip(effect.id, 'On-use effect'))}" tabindex="0">
          <input type="checkbox" data-homebrew-skill-use-effect-toggle="${esc(effect.id)}" ${selectedIds.has(effect.id) ? 'checked' : ''} />
          <span class="homebrew-effect-option-copy">
            <strong>${esc(effect.icon || '✦')} ${esc(effect.name)}</strong>
            <span class="subtle">${esc(effect.desc || '')}</span>
          </span>
        </label>
      `).join('')}
    </div>
  `).join('')

  return `
    <div class="homebrew-effects span-2">
      <div class="kicker">On-use effects (optional)</div>
      <p class="subtle">Applied to this character when the action is used. Set duration (turns) and potency. Debuffs on enemies belong in the description only.</p>
      <div class="homebrew-use-effect-rows">${selectedRows || '<p class="subtle">No on-use effects selected.</p>'}</div>
      <button type="button" class="ghost-btn tiny mt-12" data-homebrew-toggle-skill-use-effects>${state.homebrewSkillShowUseEffectPicker ? 'Hide effect list' : 'Add on-use effect(s)'}</button>
      ${state.homebrewSkillShowUseEffectPicker ? `
        <div class="homebrew-effect-picker mt-12">
          <input class="input" id="homebrew-skill-use-effect-search" placeholder="Search effects…" value="${esc(state.homebrewSkillUseEffectSearch || '')}" />
          <div class="homebrew-effect-list">${pickerRows || '<div class="empty">No effects match your search.</div>'}</div>
        </div>
      ` : ''}
    </div>
  `
}

function renderItemCounterControls(entry, item, { showWhenEquipped = false } = {}) {
  if (!entry || !itemHasCounter(item)) return ''
  if (item.counterEquippedOnly && !showWhenEquipped) return ''
  const label = itemCounterLabel(item)
  const value = inventoryCounterValue(entry, item)
  const max = item.counterMax
  const maxHint = Number.isFinite(Number(max)) && Number(max) > 0 ? ` / ${Math.floor(Number(max))}` : ''
  return `
    <div class="item-counter-controls">
      <span class="item-counter-label">${esc(label)}</span>
      <button type="button" class="ghost-btn tiny item-counter-btn" data-inventory-counter="${esc(entry.uid)}" data-counter-delta="-1" aria-label="Decrease ${esc(label)}">−</button>
      <span class="item-counter-value">${value}${maxHint}</span>
      <button type="button" class="ghost-btn tiny item-counter-btn" data-inventory-counter="${esc(entry.uid)}" data-counter-delta="1" aria-label="Increase ${esc(label)}">+</button>
    </div>
  `
}

function homebrewCounterWhenLabel(draft) {
  const op = String(draft?.counterRuleOperator || 'above')
  const x = draft?.counterRuleValue ?? 0
  if (op === 'below') return `below ${x}`
  if (op === 'eq') return `${x}`
  return `above ${x}`
}

function homebrewCounterSummary(draft) {
  const label = String(draft?.counterLabel || '').trim()
  if (!label) return ''
  const rules = []
  const when = homebrewCounterWhenLabel(draft)
  if (draft.blockUnequipWithCounter) rules.push(`cannot unequip when ${when}`)
  if (draft.blockRemoveWithCounter) rules.push(`cannot remove when ${when}`)
  if (draft.counterEquippedOnly) rules.push('equipped only')
  const max = Number(draft.counterMax)
  const maxPart = Number.isFinite(max) && max > 0 ? ` · max ${Math.floor(max)}` : ''
  return `${label} · starts ${draft.counterDefault ?? 0}${maxPart}${rules.length ? ` · ${rules.join(', ')}` : ''}`
}

function renderHomebrewCounterSection(draft) {
  const hasCounter = Boolean(String(draft?.counterLabel || '').trim())
  const summary = homebrewCounterSummary(draft)
  const panelOpen = state.homebrewShowCounterOptions
  const ruleOp = draft?.counterRuleOperator || 'above'
  const ruleValue = draft?.counterRuleValue ?? 0
  return `
    <div class="homebrew-counter span-2">
      <div class="kicker">Counter (optional)</div>
      <p class="subtle">Track a tally on each inventory copy. Rules stay in the description — this is just the number at the table.</p>
      ${summary && !panelOpen ? `<div class="wrap detail-pills mt-12"><span class="pill warn">${esc(summary)}</span></div>` : ''}
      <button type="button" class="ghost-btn tiny mt-12" data-homebrew-toggle-counter>${panelOpen ? 'Hide counter options' : hasCounter ? 'Edit counter' : 'Add counter'}</button>
      ${hasCounter && !panelOpen ? `<button type="button" class="ghost-btn tiny mt-12" data-homebrew-clear-counter>Remove counter</button>` : ''}
      <div class="homebrew-counter-panel mt-12${panelOpen ? '' : ' hidden'}">
        <div class="grid three">
          <label>
            <span class="field-label">Label</span>
            <input class="input" name="hb-counter-label" maxlength="24" value="${esc(draft?.counterLabel || '')}" placeholder="Charges" />
          </label>
          <label>
            <span class="field-label">Starting value</span>
            <input class="input" type="number" min="0" name="hb-counter-default" value="${esc(String(draft?.counterDefault ?? 0))}" />
          </label>
          <label>
            <span class="field-label">Max (optional)</span>
            <input class="input" type="number" min="1" name="hb-counter-max" value="${draft?.counterMax != null ? esc(String(draft.counterMax)) : ''}" placeholder="No cap" />
          </label>
        </div>
        <div class="homebrew-counter-rules mt-12">
          <div class="homebrew-counter-when">
            <span class="field-label">While counter is</span>
            <select class="input homebrew-counter-op" name="hb-counter-rule-op" aria-label="Counter comparison">
              <option value="above" ${ruleOp === 'above' ? 'selected' : ''}>above</option>
              <option value="below" ${ruleOp === 'below' ? 'selected' : ''}>below</option>
              <option value="eq" ${ruleOp === 'eq' ? 'selected' : ''}>equal to</option>
            </select>
            <input class="input homebrew-counter-threshold" type="number" min="0" name="hb-counter-rule-value" value="${esc(String(ruleValue))}" aria-label="Counter threshold" />
          </div>
          <label class="pill-label homebrew-counter-rule">
            <input type="checkbox" name="hb-block-unequip-counter" ${draft?.blockUnequipWithCounter ? 'checked' : ''} />
            Cannot unequip
          </label>
          <label class="pill-label homebrew-counter-rule">
            <input type="checkbox" name="hb-block-remove-counter" ${draft?.blockRemoveWithCounter ? 'checked' : ''} />
            Cannot remove from inventory
          </label>
          <div class="field-label homebrew-counter-display-label">Display</div>
          <label class="pill-label homebrew-counter-rule">
            <input type="checkbox" name="hb-counter-equipped-only" ${draft?.counterEquippedOnly ? 'checked' : ''} />
            Show counter only when equipped
          </label>
        </div>
        ${hasCounter ? `<button type="button" class="ghost-btn tiny mt-12" data-homebrew-clear-counter>Remove counter from item</button>` : ''}
      </div>
    </div>
  `
}

function sourceEffectStatus(entry) {
  return {
    duration: entry.duration,
    potency: entry.potency,
    sourcePassive: true
  }
}

function renderEffectsSnapshot(character) {
  const active = character.statusEffects || []
  const sourced = characterEffectSources(character)
  const activePills = active.slice(0, 8).map(status => renderEffectPill(status.effectId, 'Applied status', status)).join('')
  const sourcePills = sourced.slice(0, 8).map(entry => renderEffectPill(entry.effect.id, entry.sources.join(', '), sourceEffectStatus(entry))).join('')
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
  const sourceCards = sourced.map(entry => {
    const potencyText = effectPotencyLabel(entry.effect, entry.potency)
    return `
    <article class="effect-card effect-card-source ${effectTone(entry.effect)}" data-tooltip="${esc(effectTooltip(entry.effect.id, entry.sources.join(', '), sourceEffectStatus(entry)))}" tabindex="0">
      <div class="effect-card-title"><strong>${esc(entry.effect.icon || '✦')} ${esc(entry.effect.name)}</strong><span class="pill">${esc(effectTypeLabel(entry.effect.type))}</span></div>
      <p class="effect-card-desc">${esc(entry.effect.desc)}</p>
      <div class="wrap effect-card-tags">
        <span class="pill">Duration: ${esc(effectDurationLabel(entry.duration))}</span>
        ${potencyText && effectUsesPotency(entry.effect) ? `<span class="pill warn">Potency ${esc(potencyText)}</span>` : ''}
        ${entry.effect.statModifiers ? `<span class="pill ${effectTone(entry.effect)}">${esc(formatStatModifiers(entry.effect.statModifiers))}</span>` : ''}
      </div>
      <div class="subtle effect-card-meta">From: ${esc(entry.sources.slice(0, 4).join(', '))}${entry.sources.length > 4 ? ` and ${entry.sources.length - 4} more` : ''}</div>
    </article>
  `
  }).join('')
  const activeCards = active.map(status => {
    const effect = getEffect(status.effectId)
    if (!effect) return ''
    return `
      <article class="effect-card effect-card-active ${effectTone(effect)}" data-tooltip="${esc(effectTooltip(effect.id, 'Applied status', status))}" tabindex="0">
        <div class="effect-card-title"><strong>${esc(effect.icon || '✦')} ${esc(effect.name)}</strong><button type="button" class="danger-btn tiny" data-remove-effect="${esc(status.uid)}">Remove</button></div>
        <p class="effect-card-desc">${esc(effect.desc)}</p>
        <div class="wrap effect-card-tags">
          <span class="pill">Remaining: ${esc(effectDurationLabel(status.duration))}</span>
          ${status.potency !== undefined && status.potency !== null && status.potency !== 0 ? `<span class="pill warn">Potency ${esc(status.potency)}</span>` : ''}
          ${effect.statModifiers ? `<span class="pill ${effectTone(effect)}">${esc(formatStatModifiers(effect.statModifiers))}</span>` : ''}
        </div>
          ${status.notes ? `<div class="subtle effect-card-meta">${esc(status.notes)}</div>` : ''}
          ${status.performance ? `<div class="subtle effect-card-meta good">${esc(formatPerformanceMeta(status.performance))}</div>` : ''}
        </article>
    `
  }).join('')
  return `
    <section class="card effects-manager mt-16">
      <div class="card-header effects-manager-header">
        <div>
          <div class="kicker">Rules Brain</div>
          <h3>Effects & Status Manager</h3>
          <p class="effects-manager-intro">Hover any effect to see what it does. Shows ongoing passives from gear, weapon-matched skills, active toggles, max-stat hidden rewards, and resistances — not one-shot attack spells.</p>
        </div>
        <button type="button" class="ghost-btn tiny" data-process-turn>Process Turn</button>
      </div>

      <div class="grid two effects-sections">
        <div class="effects-section">
          <h3 class="effects-section-title">Applied Status Effects</h3>
          <div class="effect-grid">${activeCards || '<div class="empty effects-empty">No active status effects. Suspiciously healthy.</div>'}</div>
        </div>
        <div class="effects-section">
          <h3 class="effects-section-title">Skill & Gear Effects</h3>
          <div class="effect-grid">${sourceCards || '<div class="empty effects-empty">No skill/gear special effects detected yet.</div>'}</div>
        </div>
      </div>

      <div class="effect-add-box">
        <h3 class="effects-section-title">Add Effect</h3>
        <p class="effect-add-intro">Use this for Poison, Burn, HP Regen, buffs, debuffs, auras, or GM-made nonsense. Duration counts down each Process Turn; leave blank to use the effect default. Potency matters for damage/heal per turn — leave blank for the default.</p>
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

function renderElementalAffinitySection(character) {
  const profile = computeElementalAffinity(character)
  const affected = ELEMENTS
    .map(element => profile.elements[element.id])
    .filter(isElementalAffinityRowVisible)
  if (!affected.length) return ''

  const rows = affected.map(row => `
    <div class="elemental-affinity-row ${elementalAffinityTone(row)}" data-tooltip="${esc(elementalAffinityTooltip(row))}" tabindex="0">
      <span class="elemental-affinity-name">${esc(row.icon)} ${esc(row.name)}</span>
      <span class="elemental-affinity-status">${esc(row.statusLabel)}</span>
    </div>
  `).join('')

  return `
    <section class="card elemental-affinity-card mt-16">
      <div class="kicker">Defences</div>
      <h3>Elemental Affinity</h3>
      <p class="subtle elemental-affinity-intro">Resist and weakness stack in levels (25% = 2, 50% = 1, 200% weak = 1, 400% = 2). Opposing levels cancel before the final tier is shown.</p>
      <div class="elemental-affinity-grid">${rows}</div>
    </section>
  `
}

function renderCharacterTab(character) {
  const race = getRace(character.race)
  const background = getBackground(character.background)
  const stats = computeStats(character)
  const level = characterLevelInfo(character)
  const unlocked = character.skills.map(getSkill).filter(Boolean)
  const passives = (race?.passiveTraits || []).map(trait => {
    const tableRule = isTableRuleRacePassive(trait)
    const pillClass = tableRule ? 'pill warn' : 'pill good'
    const prefix = tableRule ? 'Table rule · ' : ''
    return `<span class="${pillClass}" data-tooltip="${esc(racePassiveTooltip(trait))}" tabindex="0">${esc(prefix + trait)}</span>`
  }).join('')
  const raceEffectPills = (race?.specialEffects || []).map(id => renderEffectPill(id, race?.name || 'Race')).join('')
  const passiveRow = [passives, raceEffectPills].filter(Boolean).join('') || '<span class="pill">No race passives</span>'
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
        <div class="wrap mt-12">${passiveRow}</div>
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

    ${renderElementalAffinitySection(character)}

    ${renderEffectsManager(character)}

    ${renderPerformanceBanner(character)}

    <div class="grid three char-gear-grid mt-16">
      <section class="card">
        <h3>Core Stats</h3>
        <div class="grid three core-stats-grid">
          ${Object.entries(STAT_RULES).map(([stat, rule]) => `<div class="stat-row stat-row-compact" data-tooltip="${esc(statTooltip(rule))}" tabindex="0"><strong>${esc(rule.label)}</strong><div class="stat-value">${stats[stat]}</div></div>`).join('')}
        </div>
      </section>
      <section class="card equipment-card">
        <h3 class="gear-section-title">Equipment</h3>
        <div class="stack gear-stack">${renderEquipSlots(character, 'Nothing equipped')}</div>
      </section>
      <section class="card inventory-card">
        <h3 class="gear-section-title">Inventory</h3>
        <div class="stack gear-stack">${renderInventoryRows(character)}</div>
      </section>
    </div>

    <section class="card mt-16">
      <h3>Unlocked Skills</h3>
      ${unlocked.length ? `<div class="wrap">${unlocked.map(skill => `<span class="pill ${isToggleSkill(skill) ? 'warn' : 'good'}" data-tooltip="${esc(skillTooltip(skill, character))}" tabindex="0">${esc(skill.icon || '✦')} ${esc(skill.name)}</span>`).join('')}</div>` : '<div class="empty">No skills yet. Time to spend shiny brain-money.</div>'}
    </section>
  `
}

function renderPerformanceBanner(character) {
  const rows = activePerformanceStatuses(character)
  if (!rows.length) return ''
  const pills = rows.map(status => {
    const effect = getEffect(status.effectId)
    const name = effect?.name || titleCase(String(status.effectId || 'song').replace(/_buff|_debuff/g, ''))
    const turns = Number.isFinite(Number(status.duration)) ? status.duration : '?'
    const perf = formatPerformanceMeta(status.performance)
    const tip = [
      `Performing: ${name}`,
      `${turns} turn${turns === 1 ? '' : 's'} remaining on your sheet`,
      perf ? perf : 'Vocal performance',
      '',
      'Keep performing each turn or end the song. Harmony joiners are counted at the table.'
    ].join('\n')
    return `<span class="pill warn" data-tooltip="${esc(tip)}" tabindex="0">🎵 ${esc(name)} (${turns}t)${perf ? ` · ${esc(perf)}` : ''}</span>`
  }).join('')
  return `
    <section class="card performance-banner mt-16">
      <div class="kicker">Musician</div>
      <h3 class="performance-banner-title">Now performing</h3>
      <div class="wrap">${pills}</div>
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
    <div class="toolbar skills-toolbar">
      <input class="input" id="skill-search" placeholder="Search skills, effects, prerequisites..." value="${esc(state.skillSearch)}" />
      <span class="pill good">${learnedInTree}/${list.length} in tree</span>
      <span class="pill gold">${isGmMode() ? 'Free (GM)' : `${costRemaining}L remaining`}</span>
    </div>
    <div class="segmented">${categories.map(category => `<button type="button" data-skill-category="${esc(category)}" class="${category === state.skillCategory ? 'active' : ''}">${displayCategory(category)}</button>`).join('')}</div>
    <div class="segmented">${subs.map(sub => `<button type="button" data-skill-subcategory="${esc(sub)}" class="${sub === state.skillSubcategory ? 'active' : ''}">${displaySubcategory(sub)}</button>`).join('')}</div>
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
    <article class="skill-card ${cls}" data-tooltip="${esc(skillTooltip(skill, unlocked ? character : null))}" tabindex="0">
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
        ${skill.fusionKind === 'career' ? '<span class="pill good">Career Fusion</span>' : ''}
        ${skill.source === 'homebrew' ? '<span class="pill warn">Homebrew</span>' : ''}
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
          <p class="tab-intro">Use this during play to damage, heal, reward, spend, pay, rob, or otherwise lovingly bully the character.</p>
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
    <div class="grid two stat-upgrade-grid mt-16">
      ${Object.entries(STAT_RULES).map(([stat, rule]) => {
        const rows = statBreakdown(character, stat).map(row => `<span class="pill ${row.value >= 0 ? 'good' : 'bad'}">${esc(row.label)} ${row.value >= 0 ? '+' : ''}${row.value}</span>`).join('')
        return `
          <section class="card stat-upgrade-card">
            <div class="stat-row stat-row-upgrade" data-tooltip="${esc(statTooltip(rule, { includeCost: true }))}" tabindex="0">
              <div class="stat-upgrade-head">
                <div class="kicker">${rule.cost} Lumens / point</div>
                <h3>${esc(rule.label)}</h3>
              </div>
              <div class="stat-value">${computed[stat]}</div>
            </div>
            <div class="wrap mt-12 stat-breakdown-pills">${rows}</div>
            <div class="stat-actions">
              <button type="button" class="ghost-btn" data-refund-stat="${esc(stat)}" data-tooltip="${esc(statRefundTooltip(stat, rule, character))}" tabindex="0">- Refund</button>
              <button type="button" class="primary-btn" data-upgrade-stat="${esc(stat)}" data-tooltip="${esc(statUpgradeTooltip(stat, rule, character))}" tabindex="0">Upgrade (${isGmMode() ? 'Free' : `${rule.cost}L`})</button>
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
    const type = String(item.type || '').toLowerCase()
    const canEquipWeapon = canEquipToMainHand(item)
    const canEquipArmor = type.includes('armor')
    const canEquipAccessory = type.includes('accessory')
    const offhandCheck = isOffhandItem(item) ? canEquipToOffhand(character, item) : { ok: false }
    const canEquipOffhand = offhandCheck.ok && !equippedSlot
    const canEquip = (canEquipWeapon || canEquipArmor || canEquipAccessory) && !equippedSlot
    const crafted = craftedByLabel(entry, character)
    const enchantTargets = isEnhancementItem(item) && !equippedSlot
      ? compatibleEquippedGearForEnhancement(character, item)
      : []
    return `
      <div class="inventory-row inventory-item-row" data-tooltip="${esc(itemTooltip(item, character, entry))}" tabindex="0">
        <div class="inventory-item-copy">
          <strong class="inventory-item-name">${fallbackIcon(item)} ${esc(item.name)} ${entry.qty > 1 ? `x${entry.qty}` : ''}</strong>
          <div class="subtle inventory-item-meta">${esc(item.type || 'item')} · ${esc(item.rarity || 'common')} ${equippedSlot ? `· ${titleCase(equippedSlot)}` : ''}</div>
          ${crafted ? `<div class="wrap inventory-item-tags"><span class="pill good">${esc(crafted)}</span></div>` : ''}
          ${renderItemCounterControls(entry, item, { showWhenEquipped: Boolean(equippedSlot) })}
          <div class="subtle inventory-item-desc detail-line">${esc(item.desc || 'No description provided.')}</div>
        </div>
        <div class="wrap inventory-item-actions">
          ${enchantTargets.map(row => `<button type="button" class="primary-btn tiny" data-apply-enchant-gear="${esc(row.entry.uid)}" data-apply-enchant-scroll="${esc(entry.uid)}">${esc(applyEnchantTargetLabel(row.slot))}</button>`).join('')}
          ${canEquip ? `<button type="button" class="primary-btn tiny" data-equip-item="${esc(entry.uid)}">Equip</button>` : ''}
          ${canEquipOffhand ? `<button type="button" class="offhand-btn tiny" data-equip-offhand="${esc(entry.uid)}" title="${esc(offhandCheck.reason)}">Off-hand</button>` : ''}
          <button type="button" class="danger-btn tiny" data-remove-item="${esc(entry.uid)}">Remove</button>
        </div>
      </div>
    `
  }).join('')
  return rows || '<div class="empty gear-empty">Inventory empty. Visit the Shop tab to gear up.</div>'
}

function renderHomebrewTab() {
  const q = String(state.homebrewSearch || '').toLowerCase().trim()
  const items = listHomebrewItems().filter(item => {
    if (!q) return true
    return `${item.name} ${item.id} ${item.desc} ${item.type}`.toLowerCase().includes(q)
  })
  const skills = listHomebrewSkills().filter(skill => {
    if (!q) return true
    return `${skill.name} ${skill.id} ${skill.desc} ${skill.category} ${skill.subcategory}`.toLowerCase().includes(q)
  })
  const races = listHomebrewRaces().filter(race => {
    if (!q) return true
    return `${race.name} ${race.id} ${race.description}`.toLowerCase().includes(q)
  })
  const filter = state.homebrewListFilter || 'all'
  const showItems = filter === 'all' || filter === 'items'
  const showSkills = filter === 'all' || filter === 'skills'
  const showRaces = filter === 'all' || filter === 'races'
  const draft = state.homebrewDraft
  const skillDraft = state.homebrewSkillDraft
  const raceDraft = state.homebrewRaceDraft
  const grantOptions = state.characters.map(c =>
    `<option value="${esc(c.id)}" ${c.id === state.activeId ? 'selected' : ''}>${esc(c.name)}</option>`
  ).join('')
  const statFields = (draft, prefix = 'hb') => ['strength', 'magicPower', 'accuracy', 'speed', 'hp', 'stamina', 'physicalDefence', 'magicalDefence']
    .map(key => {
      const rule = STAT_RULES[key]
      const value = draft?.statModifiers?.[key] ?? ''
      return `
        <label class="field-label">${esc(rule?.label || titleCase(key))}</label>
        <input class="input" type="number" name="${prefix}-stat-${key}" value="${value === '' ? '' : esc(String(value))}" placeholder="0" />
      `
    }).join('')

  const listRows = showItems ? items.map(item => {
    const checked = Boolean(state.homebrewSelected[item.id])
    const shopLabel = item.listInShop && item.shopPriceGil
      ? formatCurrency(item.shopPriceGil)
      : 'Grant only'
    return `
      <article class="item-card homebrew-row">
        <div class="item-title">
          <label class="homebrew-check"><input type="checkbox" data-homebrew-select="${esc(item.id)}" ${checked ? 'checked' : ''} /> ${fallbackIcon(item)} <strong>${esc(item.name)}</strong></label>
          <span class="pill warn">Item</span>
        </div>
        <div class="item-meta">${esc(item.type)} · ${esc(item.rarity || 'common')} · ${esc(shopLabel)}${item.damage ? ` · ${esc(item.damage)}` : ''}${itemHasCounter(item) ? ` · Counter: ${esc(itemCounterLabel(item))}` : ''}</div>
        <p class="subtle">${esc(item.desc || 'No description.')}</p>
        <div class="wrap detail-pills">${Object.entries(item.statModifiers || {}).map(([k, v]) => `<span class="pill good">${titleCase(k)} ${v >= 0 ? '+' : ''}${v}</span>`).join('')}${(item.specialEffects || []).map(id => renderEffectPill(id, item.name)).join('') || (!Object.keys(item.statModifiers || {}).length ? '<span class="pill">No stat modifiers</span>' : '')}</div>
        <div class="skill-actions">
          <select class="input tiny" id="homebrew-grant-${esc(item.id)}" aria-label="Grant target for ${esc(item.name)}">
            ${grantOptions || '<option value="">No characters</option>'}
          </select>
          <span class="wrap compact-actions">
            <button type="button" class="primary-btn tiny" data-grant-homebrew="${esc(item.id)}" ${grantOptions ? '' : 'disabled'}>Add to character</button>
            <button type="button" class="ghost-btn tiny" data-homebrew-edit="${esc(item.id)}">Edit</button>
            <button type="button" class="ghost-btn tiny" data-homebrew-duplicate="${esc(item.id)}">Duplicate</button>
            <button type="button" class="danger-btn tiny" data-homebrew-delete="${esc(item.id)}">Delete</button>
          </span>
        </div>
      </article>
    `
  }).join('') : ''

  const skillRows = showSkills ? skills.map(skill => {
    const checked = Boolean(state.homebrewSkillSelected[skill.id])
    const typeLabel = HOMEBREW_SKILL_TYPES.find(row => row.id === skill.skillType)?.label || titleCase(skill.skillType || 'passive')
    const damageLabel = skill.damageMode && skill.damageMode !== 'none'
      ? ` · ${homebrewDamageModeLabel(skill.damageMode)}${skill.damageDice ? ` ${skill.damageDice}` : ''}${skill.damageStat ? ` + ${homebrewDamageStatLabel(skill.damageStat)}` : ''}`
      : ''
    const useFx = (skill.activationEffects || []).length
      ? ` · ${skill.activationEffects.length} on-use effect${skill.activationEffects.length === 1 ? '' : 's'}`
      : ''
    return `
      <article class="item-card homebrew-row">
        <div class="item-title">
          <label class="homebrew-check"><input type="checkbox" data-homebrew-skill-select="${esc(skill.id)}" ${checked ? 'checked' : ''} /> ${esc(skill.icon || '✦')} <strong>${esc(skill.name)}</strong></label>
          <span class="pill good">Skill</span>
        </div>
        <div class="item-meta">${displayCategory(skill.category)} · ${displaySubcategory(skill.subcategory || 'custom')} · Tier ${skill.tier} · ${skill.cost}L · ${esc(typeLabel)}${esc(damageLabel)}${esc(useFx)}</div>
        <p class="subtle">${esc(skill.desc || 'No description.')}</p>
        <div class="wrap detail-pills">${Object.entries(skill.statModifiers || {}).map(([k, v]) => `<span class="pill good">${titleCase(k)} ${v >= 0 ? '+' : ''}${v}</span>`).join('')}${(skill.specialEffects || []).map(id => renderEffectPill(id, skill.name)).join('') || (!Object.keys(skill.statModifiers || {}).length ? '<span class="pill">No stat modifiers</span>' : '')}</div>
        <div class="skill-actions">
          <select class="input tiny" id="homebrew-skill-grant-${esc(skill.id)}" aria-label="Grant target for ${esc(skill.name)}">
            ${grantOptions || '<option value="">No characters</option>'}
          </select>
          <span class="wrap compact-actions">
            <button type="button" class="primary-btn tiny" data-grant-homebrew-skill="${esc(skill.id)}" ${grantOptions ? '' : 'disabled'}>Grant skill</button>
            <button type="button" class="ghost-btn tiny" data-homebrew-skill-edit="${esc(skill.id)}">Edit</button>
            <button type="button" class="ghost-btn tiny" data-homebrew-skill-duplicate="${esc(skill.id)}">Duplicate</button>
            <button type="button" class="danger-btn tiny" data-homebrew-skill-delete="${esc(skill.id)}">Delete</button>
          </span>
        </div>
      </article>
    `
  }).join('') : ''

  const raceRows = showRaces ? races.map(race => {
    const checked = Boolean(state.homebrewRaceSelected[race.id])
    const skillCount = listHomebrewSkills().filter(skill => skill.category === 'racial' && skill.subcategory === race.id).length
    const passives = (race.passiveTraits || []).map(trait => `<span class="pill good">${esc(trait)}</span>`).join('')
    const effectPills = (race.specialEffects || []).map(id => renderEffectPill(id, race.name)).join('')
    return `
      <article class="item-card homebrew-row">
        <div class="item-title">
          <label class="homebrew-check"><input type="checkbox" data-homebrew-race-select="${esc(race.id)}" ${checked ? 'checked' : ''} /> ${esc(race.icon || '✦')} <strong>${esc(race.name)}</strong></label>
          <span class="pill">Race</span>
        </div>
        <div class="item-meta">${esc(race.id)} · ${skillCount} racial skill${skillCount === 1 ? '' : 's'}</div>
        <p class="subtle">${esc(race.description || 'No description.')}</p>
        <div class="wrap detail-pills">${Object.entries(race.statModifiers || {}).map(([k, v]) => `<span class="pill good">${titleCase(k)} ${v >= 0 ? '+' : ''}${v}</span>`).join('')}${effectPills}${passives}${(!Object.keys(race.statModifiers || {}).length && !passives && !effectPills ? '<span class="pill">No stat modifiers</span>' : '')}</div>
        <div class="skill-actions">
          <span class="wrap compact-actions">
            <button type="button" class="ghost-btn tiny" data-homebrew-race-edit="${esc(race.id)}">Edit</button>
            <button type="button" class="ghost-btn tiny" data-homebrew-race-duplicate="${esc(race.id)}">Duplicate</button>
            <button type="button" class="danger-btn tiny" data-homebrew-race-delete="${esc(race.id)}">Delete</button>
          </span>
        </div>
      </article>
    `
  }).join('') : ''

  const itemEditor = draft && state.homebrewEditorKind === 'item' ? `
    <section class="card homebrew-editor mt-16">
      <div class="card-header">
        <div>
          <div class="kicker">${state.homebrewEditingId ? 'Edit item' : 'New item'}</div>
          <h3>${state.homebrewEditingId ? esc(draft.name || 'Edit') : 'Create homebrew item'}</h3>
        </div>
        <button type="button" class="ghost-btn tiny" data-homebrew-cancel>Cancel</button>
      </div>
      <form id="homebrew-form" class="homebrew-form grid two">
        <input type="hidden" name="hb-id" value="${esc(draft.id || '')}" />
        <div>
          <label class="field-label">Name *</label>
          <input class="input" name="hb-name" required maxlength="80" value="${esc(draft.name || '')}" placeholder="Lucky Charm" />
          <label class="field-label mt-12">Icon (emoji)</label>
          <input class="input" name="hb-icon" maxlength="8" value="${esc(draft.icon || '✦')}" />
          <label class="field-label mt-12">Type *</label>
          <select class="input" name="hb-type">
            ${HOMEBREW_ITEM_TYPES.map(type => `<option value="${type}" ${draft.type === type ? 'selected' : ''}>${titleCase(type)}</option>`).join('')}
          </select>
          <label class="field-label mt-12">Rarity</label>
          <select class="input" name="hb-rarity">
            ${HOMEBREW_RARITIES.map(r => `<option value="${r}" ${draft.rarity === r ? 'selected' : ''}>${titleCase(r)}</option>`).join('')}
          </select>
          <label class="field-label mt-12">Damage (weapons, e.g. 1d8)</label>
          <input class="input" name="hb-damage" value="${esc(draft.damage || '')}" placeholder="1d8" />
        </div>
        <div>
          <label class="field-label">Description *</label>
          <textarea class="input homebrew-desc" name="hb-desc" required maxlength="2000" rows="6" placeholder="What it does at the table…">${esc(draft.desc || '')}</textarea>
          <label class="field-label mt-12 pill-label">
            <input type="checkbox" name="hb-list-in-shop" ${draft.listInShop ? 'checked' : ''} />
            List in Shop (Gil price)
          </label>
          <label class="field-label mt-12">Shop price (Gil)</label>
          <input class="input" type="number" min="0" name="hb-price" value="${esc(String(draft.shopPriceGil || 0))}" />
          <p class="subtle mt-12">Leave shop unchecked for grant-only loot (Homebrew tab → Add to character).</p>
        </div>
        <div class="homebrew-stats span-2">
          <div class="kicker">Optional stat modifiers</div>
          <div class="grid four">${statFields(draft, 'hb')}</div>
        </div>
        ${renderHomebrewEffectSection(draft)}
        ${renderHomebrewCounterSection(draft)}
        <div class="span-2">
          <button type="submit" class="primary-btn">Save item</button>
        </div>
      </form>
    </section>
  ` : ''

  const skillEditor = skillDraft && state.homebrewEditorKind === 'skill' ? (() => {
    const skillCategory = skillDraft.category || 'weapons'
    const isRacial = skillCategory === 'racial'
    const treeOptions = isRacial ? homebrewRaceOptionsForSkills() : homebrewSkillTreeOptions(skillCategory)
    const treeListId = `homebrew-skill-tree-list-${skillCategory}`
    const treeField = isRacial ? `
          <label class="field-label mt-12">Race *</label>
          <select class="input" name="hbs-subcategory" required>
            ${treeOptions.map(raceId => {
              const race = getRace(raceId)
              return `<option value="${esc(raceId)}" ${skillDraft.subcategory === raceId ? 'selected' : ''}>${esc(race?.icon || '✦')} ${esc(race?.name || displaySubcategory(raceId))}</option>`
            }).join('')}
          </select>
          <p class="subtle mt-12">Racial skills only appear for characters of this race. Create custom races below, or pick an official race.</p>
        ` : `
          <label class="field-label mt-12">Tree / group</label>
          <input class="input" name="hbs-subcategory" maxlength="32" list="${treeListId}" value="${esc(skillDraft.subcategory || 'sword')}" placeholder="sword" />
          <datalist id="${treeListId}">
            ${treeOptions.map(sub => `<option value="${esc(sub)}">${esc(displaySubcategory(sub))}</option>`).join('')}
          </datalist>
          <p class="subtle mt-12">Pick an existing weapon, magic school, career, or fusion tree — or type a new group name.</p>
        `
    return `
    <section class="card homebrew-editor mt-16">
      <div class="card-header">
        <div>
          <div class="kicker">${state.homebrewSkillEditingId ? 'Edit skill' : 'New skill'}</div>
          <h3>${state.homebrewSkillEditingId ? esc(skillDraft.name || 'Edit') : 'Create homebrew skill'}</h3>
        </div>
        <button type="button" class="ghost-btn tiny" data-homebrew-cancel>Cancel</button>
      </div>
      <form id="homebrew-skill-form" class="homebrew-form grid two">
        <input type="hidden" name="hbs-id" value="${esc(skillDraft.id || '')}" />
        <div>
          <label class="field-label">Name *</label>
          <input class="input" name="hbs-name" required maxlength="80" value="${esc(skillDraft.name || '')}" placeholder="Lucky Strike" />
          <label class="field-label mt-12">Icon (emoji)</label>
          <input class="input" name="hbs-icon" maxlength="8" value="${esc(skillDraft.icon || '✦')}" />
          <label class="field-label mt-12">Category *</label>
          <select class="input" name="hbs-category">
            ${HOMEBREW_SKILL_CATEGORIES.map(cat => `<option value="${cat}" ${skillDraft.category === cat ? 'selected' : ''}>${displayCategory(cat)}</option>`).join('')}
          </select>
          ${treeField}
        </div>
        <div>
          <label class="field-label">Description *</label>
          <textarea class="input homebrew-desc" name="hbs-desc" required maxlength="2000" rows="6" placeholder="Passive: … / Action: … — plain language for the table">${esc(skillDraft.desc || '')}</textarea>
          <div class="grid three mt-12">
            <label>
              <span class="field-label">Tier</span>
              <select class="input" name="hbs-tier">
                ${[1, 2, 3, 4, 5].map(t => `<option value="${t}" ${Number(skillDraft.tier) === t ? 'selected' : ''}>Tier ${t}</option>`).join('')}
              </select>
            </label>
            <label>
              <span class="field-label">Lumen cost</span>
              <input class="input" type="number" min="0" name="hbs-cost" value="${esc(String(skillDraft.cost ?? TIER_LUMEN_COST[skillDraft.tier] ?? 8))}" />
            </label>
            <label>
              <span class="field-label">Type</span>
              <select class="input" name="hbs-skill-type">
                ${HOMEBREW_SKILL_TYPES.map(row => `<option value="${row.id}" ${skillDraft.skillType === row.id ? 'selected' : ''}>${esc(row.label)}</option>`).join('')}
              </select>
            </label>
          </div>
          <label class="field-label mt-12">Stamina cost (actions / toggles)</label>
          <input class="input" type="number" min="0" name="hbs-stamina" value="${esc(String(skillDraft.staminaCost ?? 0))}" />
        </div>
        ${renderHomebrewSkillDamageSection(skillDraft)}
        ${renderHomebrewUseEffectSection(skillDraft)}
        <div class="homebrew-stats span-2">
          <div class="kicker">Optional passive stat modifiers</div>
          <div class="grid four">${statFields(skillDraft, 'hbs')}</div>
        </div>
        ${renderHomebrewEffectSection(skillDraft, {
          intro: 'Passive effects while learned (resistances, stat hooks, etc.).',
          showPicker: state.homebrewSkillShowEffectPicker,
          search: state.homebrewSkillEffectSearch,
          toggleData: 'homebrew-toggle-skill-effects',
          searchId: 'homebrew-skill-effect-search',
          toggleCheckbox: 'homebrew-skill-effect-toggle',
          removeBtn: 'homebrew-skill-effect-remove'
        })}
        <div class="span-2">
          <button type="submit" class="primary-btn">Save skill</button>
        </div>
      </form>
    </section>
  `
  })() : ''

  const raceEditor = raceDraft && state.homebrewEditorKind === 'race' ? `
    <section class="card homebrew-editor mt-16">
      <div class="card-header">
        <div>
          <div class="kicker">${state.homebrewRaceEditingId ? 'Edit race' : 'New race'}</div>
          <h3>${state.homebrewRaceEditingId ? esc(raceDraft.name || 'Edit') : 'Create homebrew race'}</h3>
        </div>
        <button type="button" class="ghost-btn tiny" data-homebrew-cancel>Cancel</button>
      </div>
      <form id="homebrew-race-form" class="homebrew-form grid two">
        <input type="hidden" name="hbr-id" value="${esc(raceDraft.id || '')}" />
        <div>
          <label class="field-label">Name *</label>
          <input class="input" name="hbr-name" required maxlength="80" value="${esc(raceDraft.name || '')}" placeholder="Fae Folk" />
          <label class="field-label mt-12">Icon (emoji)</label>
          <input class="input" name="hbr-icon" maxlength="8" value="${esc(raceDraft.icon || '✦')}" />
          <label class="field-label mt-12">Description *</label>
          <textarea class="input homebrew-desc" name="hbr-description" required maxlength="2000" rows="6" placeholder="What makes this race special at the table…">${esc(raceDraft.description || '')}</textarea>
        </div>
        <div>
          <label class="field-label">Passive traits (one per line)</label>
          <textarea class="input homebrew-desc" name="hbr-passives" maxlength="2000" rows="6" placeholder="Keen Senses: +1 Accuracy when scouting">${esc(raceDraft.passiveTraitsText || '')}</textarea>
          <p class="subtle mt-12">Plain-language table rules. Shown on the Character tab like official race passives.</p>
        </div>
        <div class="homebrew-stats span-2">
          <div class="kicker">Optional starting stat modifiers</div>
          <div class="grid four">${statFields(raceDraft, 'hbr')}</div>
        </div>
        ${renderHomebrewEffectSection(raceDraft, {
          intro: 'Pick immunities, resistances, and other passive hooks from the catalog — applied while this race is selected (like gear effects).',
          showPicker: state.homebrewRaceShowEffectPicker,
          search: state.homebrewRaceEffectSearch,
          toggleData: 'homebrew-toggle-race-effects',
          searchId: 'homebrew-race-effect-search',
          toggleCheckbox: 'homebrew-race-effect-toggle',
          removeBtn: 'homebrew-race-effect-remove'
        })}
        <div class="span-2">
          <button type="submit" class="primary-btn">Save race</button>
        </div>
      </form>
    </section>
  ` : ''

  const emptyCopy = filter === 'skills'
    ? 'No homebrew skills yet.'
    : filter === 'items'
      ? 'No homebrew items yet.'
      : filter === 'races'
        ? 'No homebrew races yet.'
        : 'No homebrew yet.'
  const emptyBtn = filter === 'skills'
    ? `<button type="button" class="primary-btn tiny" data-homebrew-skill-new>Create your first skill</button>`
    : filter === 'items'
      ? `<button type="button" class="primary-btn tiny" data-homebrew-new>Create your first item</button>`
      : filter === 'races'
        ? `<button type="button" class="primary-btn tiny" data-homebrew-race-new>Create your first race</button>`
        : `<button type="button" class="primary-btn tiny" data-homebrew-new>Create an item</button> <button type="button" class="primary-btn tiny" data-homebrew-skill-new>Create a skill</button> <button type="button" class="primary-btn tiny" data-homebrew-race-new>Create a race</button>`

  return `
    <section class="card catalogue-card">
      <div class="card-header">
        <div>
          <div class="kicker">Custom content</div>
          <h3>Homebrew</h3>
          <p class="tab-intro">Custom items, skills, and races for your table — stored in this browser. Export packs to share. Races appear in character creation and get their own tab under Skills → Race; racial skills must pick a real race.</p>
        </div>
        <span class="pill good">${items.length} item${items.length === 1 ? '' : 's'} · ${skills.length} skill${skills.length === 1 ? '' : 's'} · ${races.length} race${races.length === 1 ? '' : 's'}</span>
      </div>
      <div class="toolbar item-toolbar">
        <input class="input" id="homebrew-search" placeholder="Search homebrew…" value="${esc(state.homebrewSearch || '')}" />
        <button type="button" class="primary-btn tiny" data-homebrew-new>+ New item</button>
        <button type="button" class="primary-btn tiny" data-homebrew-skill-new>+ New skill</button>
        <button type="button" class="primary-btn tiny" data-homebrew-race-new>+ New race</button>
        <label class="ghost-btn tiny file-label">Import pack<input id="import-homebrew-pack" type="file" accept="application/json" hidden /></label>
        <button type="button" class="ghost-btn tiny" data-homebrew-export-selected>Export selected</button>
        <button type="button" class="ghost-btn tiny" data-homebrew-export-all>Export all</button>
      </div>
      <div class="segmented homebrew-filter">
        <button type="button" data-homebrew-filter="all" class="${filter === 'all' ? 'active' : ''}">All</button>
        <button type="button" data-homebrew-filter="items" class="${filter === 'items' ? 'active' : ''}">Items</button>
        <button type="button" data-homebrew-filter="skills" class="${filter === 'skills' ? 'active' : ''}">Skills</button>
        <button type="button" data-homebrew-filter="races" class="${filter === 'races' ? 'active' : ''}">Races</button>
      </div>
      ${itemEditor}
      ${skillEditor}
      ${raceEditor}
      <div class="item-grid mt-16">
        ${listRows}${skillRows}${raceRows || (!listRows && !skillRows ? `<div class="empty">${emptyCopy} ${emptyBtn}</div>` : '')}
      </div>
    </section>
  `
}

function renderShopTab(character) {
  const items = filterCatalogItems(character)
  const pageData = paginateItems(items)
  const categoryCounts = catalogCategoryCounts(character)
  const sourceCounts = catalogSourceCounts(character)
  const rarityOptions = cache.itemRarityOptions || ['all']
  const activeFilters = activeCatalogFilterLabels()
  const sourceOptions = [
    ['shop', 'Shop'],
    ['homebrew', 'Homebrew'],
    ['profession', 'Profession'],
    ['discoverable', 'Discoverable'],
    ['loot', 'Loot'],
    ['all', 'All sources']
  ]
  const categoryOptions = ITEM_CATALOG_CATEGORIES.filter(row =>
    row.id === 'all' || row.id === state.itemCategory || (categoryCounts[row.id] || 0) > 0
  )
  const sortOptions = [
    ['name', 'Name A–Z'],
    ['priceAsc', 'Cheapest first'],
    ['priceDesc', 'Most expensive'],
    ['rarityDesc', 'Rarest first'],
    ['damageDesc', 'Highest damage'],
    ['strengthDesc', 'Best Strength'],
    ['magicDesc', 'Best Magic'],
    ['defenceDesc', 'Best Defence'],
    ['sourceType', 'Source, then type']
  ]
  return `
    <section class="card catalogue-card">
      <div class="card-header">
        <div>
          <div class="kicker">Item Catalogue</div>
          <h3>Shop</h3>
          <p class="tab-intro">Browse gear by category — food includes shop snacks like apples and cheese, not just chef recipes. Stock unlocks by rarity at your level. Hover cards for details; Grant is GM-only free loot.</p>
        </div>
        <span class="pill gold">${formatCurrency(character.gil)}</span>
      </div>
      <div class="shop-filters">
        <div class="shop-filters-primary">
          <input class="input shop-search" id="item-search" placeholder="Search name, effect, stat, food, potion, sword…" value="${esc(state.itemSearch)}" />
          <select class="input" id="item-source" title="Where the item comes from">
            ${sourceOptions.map(([value, label]) => {
              const count = value === 'all' ? sourceCounts.all : (sourceCounts[value] || 0)
              return `<option value="${value}" ${state.itemSource === value ? 'selected' : ''}>${esc(label)} (${count})</option>`
            }).join('')}
          </select>
          <select class="input" id="item-category" title="Friendly item groups — Food & drink includes shop consumables">
            ${categoryOptions.map(row => {
              const count = row.id === 'all' ? categoryCounts.all : (categoryCounts[row.id] || 0)
              return `<option value="${esc(row.id)}" ${state.itemCategory === row.id ? 'selected' : ''}>${esc(row.label)} (${count})</option>`
            }).join('')}
          </select>
          <select class="input" id="item-rarity" title="Item rarity">
            ${rarityOptions.map(rarity => `<option value="${esc(rarity)}" ${state.itemRarity === rarity ? 'selected' : ''}>${rarity === 'all' ? 'Any rarity' : titleCase(rarity)}</option>`).join('')}
          </select>
        </div>
        <div class="shop-filters-secondary">
          <select class="input" id="item-sort">
            ${sortOptions.map(([value, label]) => `<option value="${value}" ${state.itemSort === value ? 'selected' : ''}>${esc(label)}</option>`).join('')}
          </select>
          <label class="pill ${state.itemBuyableOnly ? 'good' : ''} shop-filter-toggle" title="Shop stock you can afford at your level — profession/loot items are craft-only or GM grant">
            <input type="checkbox" id="item-buyable-only" ${state.itemBuyableOnly ? 'checked' : ''} ${isGmMode() ? 'disabled' : ''} />
            Buyable only
          </label>
          ${activeFilters.length ? `<span class="pill warn shop-active-filters">Filters: ${activeFilters.map(label => esc(label)).join(' · ')}</span>` : ''}
        </div>
      </div>
      <div class="catalogue-summary">
        <span class="pill good">${pageData.total} match${pageData.total === 1 ? '' : 'es'}</span>
        <span class="pill">Page ${pageData.page + 1}/${pageData.totalPages} · ${ITEMS_PER_PAGE} per page</span>
        <button type="button" class="ghost-btn tiny" data-item-page-prev ${pageData.page <= 0 ? 'disabled' : ''}>Prev</button>
        <button type="button" class="ghost-btn tiny" data-item-page-next ${pageData.page >= pageData.totalPages - 1 ? 'disabled' : ''}>Next</button>
        <button type="button" class="ghost-btn tiny" data-reset-item-filters>Reset filters</button>
      </div>
      <div class="item-grid">${pageData.items.map(item => renderItemCard(item, character)).join('') || `<div class="empty">${state.itemBuyableOnly && state.itemSource !== 'shop' ? 'Buyable only applies to Shop stock — switch source to Shop, or turn off the filter to browse profession/loot catalogues.' : 'No items matched. Try Shop source, turn off Buyable only, or pick All categories.'}</div>`}</div>
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
    <section class="card catalogue-card">
      <div class="card-header">
        <div>
          <div class="kicker">Career Crafting</div>
          <h3>Craft</h3>
          <p class="tab-intro">Craft items from career recipes. Materials are taken from your inventory. ${gmFree ? 'GM Mode: Grant adds items instantly; Craft skips materials and skill gates but keeps craft bonuses on gear.' : 'Learn career skills on the Skills tab to unlock recipes.'}</p>
        </div>
        <span class="pill">${recipes.length} recipe${recipes.length === 1 ? '' : 's'}</span>
      </div>
      <div class="toolbar item-toolbar">
        <input class="input" id="craft-search" placeholder="Search recipes, materials, careers..." value="${esc(state.craftSearch)}" />
        <select class="input" id="craft-profession">
          ${professions.map(profession => `<option value="${esc(profession)}" ${state.craftProfession === profession ? 'selected' : ''}>${profession === 'all' ? 'All careers' : displaySubcategory(profession)}</option>`).join('')}
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
      <div class="item-meta">${esc(displaySubcategory(recipe.profession || 'career'))} · ${esc(recipe.type || 'item')}</div>
      <p class="subtle">${esc(recipe.desc || 'No description provided.')}</p>
      <div class="wrap detail-pills">
        <span class="pill">Requires: ${esc(skillLabels || '—')}</span>
        ${matPills || '<span class="pill">No materials</span>'}
      </div>
      <div class="skill-actions">
        <span class="pill ${check.ok ? 'good' : 'warn'}">${esc(check.reason)}</span>
        <span class="wrap compact-actions">
          ${isGmMode() ? `<button type="button" class="ghost-btn tiny" data-grant-craft-recipe="${esc(recipe.id)}">Grant</button>` : ''}
          <button type="button" class="primary-btn tiny" data-craft-recipe="${esc(recipe.id)}" ${check.ok ? '' : 'disabled'}>Craft</button>
        </span>
      </div>
    </article>
  `
}

function renderItemCard(item, character = activeCharacter()) {
  const price = itemPriceGil(item)
  const gmFree = isGmMode()
  const purchase = shopPurchaseCheck(character, item, { free: gmFree })
  const shopLocked = isShopPurchaseItem(item) && !gmFree && character && characterLevelInfo(character).level < shopMinLevelForItem(item)
  const canBuy = isShopPurchaseItem(item) || gmFree
  const affordLocked = isShopPurchaseItem(item) && !gmFree && character && itemPriceGil(item) > normalizeGil(character.gil)
  const statPills = Object.entries(item.statModifiers || {}).map(([stat, value]) => `<span class="pill ${value >= 0 ? 'good' : 'bad'}">${titleCase(stat)} ${value >= 0 ? '+' : ''}${value}</span>`).join('')
  const effectPills = (item.specialEffects || []).slice(0, 3).map(effect => `<span class="pill warn">${titleCase(effect)}</span>`).join('')
  const handsLabel = weaponHandednessLabel(item)
  const offhandLabel = offhandTypeLabel(item)
  const levelPill = isShopPurchaseItem(item) && !gmFree
    ? `<span class="pill ${shopLocked ? 'warn' : 'good'}">${shopLocked ? `Lv ${shopMinLevelForItem(item)}+` : 'Unlocked'}</span>`
    : ''
  const craftPill = item.source === 'profession' && !gmFree
    ? '<span class="pill">Craft only</span>'
    : ''
  const homebrewPill = item.source === 'homebrew'
    ? `<span class="pill warn">${item.listInShop && price ? 'Homebrew · Shop' : 'Homebrew · Grant only'}</span>`
    : ''
  const affordPill = affordLocked
    ? '<span class="pill warn">Too expensive</span>'
    : ''
  return `
    <article class="item-card" data-tooltip="${esc(itemTooltip(item, character))}" tabindex="0">
      <div class="item-title">
        <strong>${fallbackIcon(item)} ${esc(item.name)}</strong>
        <span class="pill">${esc(item.rarity || 'common')}</span>
      </div>
      <div class="item-meta">${esc(item.type || 'item')} · ${esc(item.source || 'shop')}${item.damage ? ` · ${esc(item.damage)}` : ''}${handsLabel ? ` · ${esc(handsLabel)}` : ''}${offhandLabel ? ` · ${esc(offhandLabel)}` : ''}</div>
      <p class="subtle">${esc(item.desc || 'No description provided.')}</p>
      <div class="wrap detail-pills">
        ${statPills || '<span class="pill">No stat modifiers</span>'}
        ${effectPills}
        ${levelPill}
        ${craftPill}
        ${homebrewPill}
        ${affordPill}
        ${Number(item.enchantmentSlots || 0) ? `<span class="pill good">${item.enchantmentSlots} enchant slot${Number(item.enchantmentSlots) === 1 ? '' : 's'}</span>` : ''}
      </div>
      <div class="skill-actions">
        <span class="pill gold">${gmFree ? 'Free (GM)' : price ? formatCurrency(price) : 'Free/loot'}</span>
        <span class="wrap compact-actions">
          <button type="button" class="ghost-btn tiny" data-grant-item="${esc(item.id)}">Grant</button>
          ${canBuy ? `<button type="button" class="primary-btn tiny" data-buy-item="${esc(item.id)}" ${purchase.ok ? '' : 'disabled'}>${gmFree ? 'Take' : 'Buy'}</button>` : ''}
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
        <select class="input" id="gm-spawn-folder" aria-label="Folder for spawned characters">
          <option value="">Spawn to: Unfiled</option>
          ${listCharacterFolders(state).map(name => `
            <option value="${esc(name)}" ${state.gmSpawnFolder === name ? 'selected' : ''}>Spawn to: ${esc(name)}</option>
          `).join('')}
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
                ${entry.lumens > 0 ? `<span class="pill gold">${entry.lumens}L loot</span>` : ''}
                ${entry.gil > 0 ? `<span class="pill">${formatCurrency(entry.gil)} loot</span>` : ''}
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

function renderGlossaryEntry(entry, openByDefault) {
  return `
    <details class="glossary-entry"${openByDefault ? ' open' : ''}>
      <summary class="glossary-entry-summary">
        <strong class="glossary-entry-term">${esc(entry.term)}</strong>
        <span class="subtle glossary-entry-blurb">${esc(entry.summary)}</span>
      </summary>
      <p class="glossary-entry-body">${esc(entry.detail)}</p>
    </details>
  `
}

function renderGlossarySection() {
  const query = state.glossarySearch || ''
  const entries = filterGlossaryEntries(query, cache.effectDefinitions)
  const grouped = groupGlossaryEntries(entries)
  const openByDefault = Boolean(query.trim())
  const total = getAllGlossaryEntries(cache.effectDefinitions).length
  const countLabel = query.trim()
    ? `${entries.length} match${entries.length === 1 ? '' : 'es'}`
    : `${total} terms`

  if (!entries.length) {
    return `
      <div class="glossary-results">
        <div class="empty glossary-empty">No terms match “${esc(query)}”. Try “burn”, “force”, “freeze”, “mind control”, or “incapacitated”.</div>
      </div>
    `
  }

  const sections = grouped.map(([category, items]) => `
    <section class="glossary-category">
      <h4 class="glossary-category-title">${esc(category)}</h4>
      <div class="glossary-entries">
        ${items.map(entry => renderGlossaryEntry(entry, openByDefault)).join('')}
      </div>
    </section>
  `).join('')

  return `
    <div class="glossary-meta subtle">${esc(countLabel)} · ${GLOSSARY_CATEGORIES.length} categories</div>
    <div class="glossary-results">${sections}</div>
  `
}

function renderNotesTab(character) {
  const statusLabel = state.notesDirty ? 'Unsaved changes' : 'Saved'
  const toneClass = state.notesDirty ? 'warn' : 'good'
  return `
    <div class="grid two notes-grid">
      <section class="card notes-card">
        <div class="card-header">
          <div>
            <div class="kicker">Campaign Notes</div>
            <h3>${esc(character.name)}'s Notes</h3>
            <p>Build plans, session reminders, loot lists, and anything your character should remember.</p>
          </div>
          <div class="wrap">
            <span id="notes-status" class="pill ${toneClass}">${statusLabel}</span>
            <button type="button" class="primary-btn tiny" data-save-notes-button>Save Notes</button>
          </div>
        </div>
        <textarea id="character-notes" class="notes-textarea">${esc(character.notes || '')}</textarea>
      </section>

      <section class="card glossary-card">
        <div class="card-header">
          <div>
            <div class="kicker">Rules reference</div>
            <h3>Term Dictionary</h3>
            <p>Plain-language rules, status effects, and damage types — written for casual tables and read-aloud play.</p>
          </div>
        </div>
        <label class="field-label" for="glossary-search">Search terms</label>
        <input class="input glossary-search" id="glossary-search" placeholder="e.g. burn, enchant, barrier, force damage, intimidated…" value="${esc(state.glossarySearch || '')}" />
        ${renderGlossarySection()}
      </section>
    </div>
  `
}