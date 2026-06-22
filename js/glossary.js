/** Player-facing term dictionary — plain language, table-friendly. */

import { COMBAT_GLOSSARY_ENTRIES } from './glossary-combat.js'
import { buildEffectGlossaryEntries } from './glossary-effects.js'

export const GLOSSARY_CATEGORIES = [
  'Resources & money',
  'Core stats',
  'Skills & trees',
  'Team harmony',
  'Elements & damage',
  'Combat & rolls',
  'Damage types',
  'Status & conditions',
  'Buffs & recovery',
  'Resists & immunities',
  'On-hit & bonus effects',
  'Effects & gear',
  'Character & app'
]

export const GLOSSARY_ENTRIES = [
  {
    id: 'lumens',
    term: 'Lumens',
    aliases: ['lumen', 'L'],
    category: 'Resources & money',
    summary: 'Skill points — spent to learn skills and buy stat upgrades.',
    detail: 'Lumens are your build currency. Each skill shows a cost in Lumens on the Skills tab. Stat upgrades on the Stats tab also cost Lumens (HP and Stamina are cheaper than other stats). You start with some Lumens from your background; earn more from play as your GM decides. GM Mode makes everything free.'
  },
  {
    id: 'gil',
    term: 'Gil',
    aliases: ['money', 'currency', 'gold', 'silver', 'copper'],
    category: 'Resources & money',
    summary: 'Shop money — buy gear, materials, and consumables.',
    detail: 'Gil is the in-game coin used in the Shop tab. Item prices are shown in Gil. Shop stock unlocks by rarity: common Level 1 · uncommon Level 5 · rare Level 9 · epic Level 14 · legendary Level 21. Old save data may still list gold, silver, and copper — the app converts them to one Gil total (1 Gil = 1 copper equivalent). Crafting materials are bought or looted, then spent at the Craft tab.'
  },
  {
    id: 'hp',
    term: 'HP (Hit Points)',
    aliases: ['hit points', 'health'],
    category: 'Resources & money',
    summary: 'How much harm you can take before you are out of the fight.',
    detail: 'HP is your health pool. When you take damage, subtract it from current HP. At 0 HP your character is down — the GM decides if that means unconscious, captured, or needing rescue. Raise max HP with stat upgrades, gear, and helpful effects. The action bar has quick +/− buttons during fights.\n\nAt the table: “Subtract damage from HP; at zero, you’re out until someone helps.”'
  },
  {
    id: 'stamina',
    term: 'Stamina',
    aliases: ['STA', 'fuel'],
    category: 'Resources & money',
    summary: 'Fuel for actions — skills, spells, stances, and sustained songs.',
    detail: 'Many active skills list a Stamina cost. Pay it when you use the skill (or once when you start a sustained performance). If you run out, you cannot pay for costly actions until you recover — rest, items, or GM ruling. Toggle skills may cost Stamina to turn on. Max Stamina can rise from stats, race, gear, and effects.'
  },
  {
    id: 'strength',
    term: 'Strength',
    aliases: ['STR', 'str'],
    category: 'Core stats',
    summary: 'Physical power — melee damage, grappling, and brute-force checks.',
    detail: 'Strength adds to physical attacks and strength-based skill effects. Negative Strength is allowed at low levels — you are weak until you invest Lumens on the Stats tab. Some songs and buffs temporarily raise Strength for allies in range.'
  },
  {
    id: 'magic-power',
    term: 'Magic Power',
    aliases: ['magic power', 'magical power', 'MAG'],
    category: 'Core stats',
    summary: 'Spell strength — how hard your magic hits or heals.',
    detail: 'Magic Power adds to spell damage, healing, and magical skill effects. Magical attacks use your Accuracy against the target\'s Magical Defence to see if they hit. Invest on the Stats tab like other core stats.'
  },
  {
    id: 'accuracy',
    term: 'Accuracy',
    aliases: ['ACC', 'to hit', 'attack roll'],
    category: 'Core stats',
    summary: 'Added to d20 attack rolls — meet or beat the target\'s defence to hit.',
    detail: 'When you attack, roll d20 + Accuracy. Physical attacks compare to Physical Defence. Magical attacks compare to Magical Defence. Meet or beat the number to hit; otherwise you miss or they block. Songs and teamwork can raise or lower Accuracy for a round.\n\nAt the table: “Roll d20 plus Accuracy — did you beat their defence?”'
  },
  {
    id: 'speed',
    term: 'Speed',
    aliases: ['SPD', 'initiative'],
    category: 'Core stats',
    summary: 'Turn order, movement feel, and dodge-style checks.',
    detail: 'Speed helps decide who acts first in combat. Some skills and racial traits reference Speed for evasion or special saves. The GM Tools tab has an initiative tracker for the table — Speed is a guide, not auto-sorted by the app.'
  },
  {
    id: 'physical-defence',
    term: 'Physical Defence',
    aliases: ['physical defense', 'physical AC', 'armour against hits'],
    category: 'Core stats',
    summary: 'Armour against physical hits — melee, arrows, claws.',
    detail: 'Physical Defence is the target number enemies must meet with d20 + Accuracy to hit you with physical attacks. Gear, shields, stances, and buffs raise it. Some items say they ignore part of an enemy\'s Physical Defence — that means their attack roll needs less to connect.'
  },
  {
    id: 'magical-defence',
    term: 'Magical Defence',
    aliases: ['magical defense', 'magical AC', 'spell defence'],
    category: 'Core stats',
    summary: 'Armour against spells and magical attacks.',
    detail: 'Magical Defence works like Physical Defence but for spells, curses, and magical skills. Ward effects, auras, and harmony bonuses often stack Magical Defence for the party. Fear and charm saves sometimes reference this stat in skill text.'
  },
  {
    id: 'tier',
    term: 'Skill tier (1–5)',
    aliases: ['tier', 'tier 1', 'tier 5', 'star rating'],
    category: 'Skills & trees',
    summary: 'How advanced a skill is — tier 5 is the biggest, tier 1 is the starter.',
    detail: 'Skills run from tier 1 (basic) to tier 5 (signature capstone). Higher tiers cost more Lumens and count more toward your character level. You usually need lower-tier skills in the same tree first.\n\nNew characters start at Level 1. Minimum level to learn: Tier 1 → Level 1 · Tier 2 → Level 5 · Tier 3 → Level 9 · Tier 4 → Level 14 · Tier 5 → Level 21.\n\nAt the table: “Higher star skill = fancier move — but you need the level first.”'
  },
  {
    id: 'level',
    term: 'Character level',
    aliases: ['level', 'XP', 'experience'],
    category: 'Skills & trees',
    summary: 'Grows as you learn skills and upgrade stats — no grinding XP charts.',
    detail: 'Your level goes up when you spend Lumens on skills and stat upgrades. Bigger skills and upgrades move the bar faster. The Character tab shows your level and progress bar — hover Level for the exact breakdown if you want the numbers.\n\nAt the table: “Level is how grown-up your build is — hover the sheet for details.”'
  },
  {
    id: 'career',
    term: 'Career',
    aliases: ['careers', 'profession', 'job'],
    category: 'Skills & trees',
    summary: 'A job tree — Chef, Soldier, Mage, Musician, and similar.',
    detail: 'Careers replace the old “profession” trees. Pick skills from your career on the Skills tab under the Careers category. Each career has its own sub-tree (Blacksmith, Ranger, etc.). Career skills often include harmony lines so teammates with the same career can join in at the table.'
  },
  {
    id: 'weapons-magic-trees',
    term: 'Weapon & magic trees',
    aliases: ['weapons', 'magic tree', 'sword', 'staff'],
    category: 'Skills & trees',
    summary: 'Combat style skills — sword, bow, fire magic, and so on.',
    detail: 'The Weapons and Magic categories hold attack and spell skills tied to how you fight. Fusion skills combine two styles (e.g. melee + magic). Learn prerequisites in order; incompatible skills block each other — hover a greyed skill to see why.'
  },
  {
    id: 'fusion',
    term: 'Fusion skills',
    aliases: ['fusion', 'hybrid'],
    category: 'Skills & trees',
    summary: 'Skills that mix two styles — need skills from both parents.',
    detail: 'Fusion trees unlock when you have the right skills from two other categories (career + weapon, ranged + magic, etc.). They reward mixed builds without a separate character sheet. Check prerequisites on each fusion skill card.'
  },
  {
    id: 'ascension',
    term: 'Ascension',
    aliases: ['ascension skills', 'racial ascension'],
    category: 'Skills & trees',
    summary: 'High-tier racial power spikes — usually once-per-rest or once-per-day limits.',
    detail: 'Ascension skills sit in the Ascension category and represent a big step in your race\'s power fantasy. Read the skill text for limits (once per day, once per combat, etc.). They are meant to feel special, not spammable.'
  },
  {
    id: 'ultimate',
    term: 'Ultimate',
    aliases: ['ultimate skill', 'capstone'],
    category: 'Skills & trees',
    summary: 'Top-tier signature ability — high cost, big moment.',
    detail: 'Ultimate skills are tier 4–5 capstones, often with clear range, damage, and side effects in one sentence. Many are once per encounter or once per day. Save them for the scene-stealing turn.'
  },
  {
    id: 'racial',
    term: 'Racial skills',
    aliases: ['race tree', 'race skills', 'monster'],
    category: 'Skills & trees',
    summary: 'Skills from your race — passives and actives tied to species.',
    detail: 'The Race category (labeled from your character\'s race) holds skills everyone of that species can learn. Dragonborn may pick an elemental affinity at creation. Racial passives also appear as pills on the Character tab.'
  },
  {
    id: 'action',
    term: 'Action',
    aliases: ['action:', 'your turn'],
    category: 'Skills & trees',
    summary: 'Something you do on your turn — attack, cast, or use a skill that says Action.',
    detail: 'Skills that start with “Action:” use your main turn choice. You might move and act as your table allows. Sustained songs also start with an Action, then keep going until you stop or run out of time. The action bar lists skills you can fire quickly in combat.'
  },
  {
    id: 'passive',
    term: 'Passive',
    aliases: ['passive:', 'always on'],
    category: 'Skills & trees',
    summary: 'Always working when conditions are met — no button press each round.',
    detail: 'Passive skills apply when their trigger happens (e.g. “when you and allies attack the same target”). They do not cost an Action to turn on. Some passives still have harmony lines — teammates add bonuses without spending a Reaction.'
  },
  {
    id: 'toggle',
    term: 'Toggle skill',
    aliases: ['toggle', 'switch on', 'stance'],
    category: 'Skills & trees',
    summary: 'Stays on until you switch off — may cost Stamina to activate.',
    detail: 'Toggle skills show a Switch On / Switch Off button after you learn them. While on, their effect applies (aura, stance, transformation). Turning on may cost Stamina once; the GM tracks ongoing costs if the skill says so. Refunding the skill turns it off automatically.'
  },
  {
    id: 'prerequisite',
    term: 'Prerequisite',
    aliases: ['prereq', 'requires'],
    category: 'Skills & trees',
    summary: 'Another skill or level you need first.',
    detail: 'Greyed skills are locked. Hover or read the card — it lists required skills, minimum level, or incompatible skills you already have. GM Mode ignores prerequisites for testing builds.'
  },
  {
    id: 'harmony',
    term: 'Harmony',
    aliases: ['+ harmony', 'teamwork bonus'],
    category: 'Team harmony',
    summary: 'Teammates with the same career join your skill for extra benefit.',
    detail: 'Harmony is a table rule, not something the app syncs between sheets. When a skill says “+ Harmony:” or “+ Harmony Reaction:”, allies with the same career can join if they meet the skill text. The lead player uses the skill normally; joiners call out their help; the GM counts helpers and applies the bonus. Read the skill for the exact counting line.'
  },
  {
    id: 'harmony-reaction',
    term: 'Harmony Reaction',
    aliases: ['harmony reaction', 'joiner', 'reaction'],
    category: 'Team harmony',
    summary: 'How a helper joins — not a full Action; usually skip your next turn.',
    detail: 'The first ally uses an Action (or starts a song). Extra allies with the same career use a Harmony Reaction to pile on before the next enemy turn. Cost: each joiner typically loses their next turn — they helped instead of acting. They must use the same skill or same song ID. The app does not track this; call it at the table.'
  },
  {
    id: 'huddle-stacking',
    term: 'Huddle stacking',
    aliases: ['shield wall stacking', 'count heads'],
    category: 'Team harmony',
    summary: 'Count everyone helping — each helper adds that many once per helper.',
    detail: 'Used on skills like Shield Wall: count all Soldiers helping (lead + friends who join). Each helper adds that many once. Three Soldiers protecting one ally → +9 Physical Defence. Five Soldiers → +25. One helper alone is still +1. Big groups use the same counting rule.\n\nAt the table: “Count heads, each Soldier adds that number — add it up together.”'
  },
  {
    id: 'sustain',
    term: 'Sustain / sustained',
    aliases: ['sustain', 'maintain', 'song'],
    category: 'Team harmony',
    summary: 'Keep performing over several turns — pay Stamina once to start.',
    detail: 'Musician-style skills say “Sustain up to X turns” and cost Stamina once when you start. You must keep performing each round or the song ends. Others can Harmony Reaction into the same song while it is already playing. With an off-hand instrument equipped, the app extends sustain turns and shows how many Musicians you count as and any listener bonus — harmony stacks with other players are still counted at the table.'
  },
  {
    id: 'cross-career',
    term: 'Cross-career harmony',
    aliases: ['cross career'],
    category: 'Team harmony',
    summary: 'One career\'s skill buffs another career\'s effect — read the specific skill.',
    detail: 'Some combinations let a Chef meal buff a Soldier, or a Musician song stack with a Ward. Cross-career lines say exactly who leads and who benefits. Joiners from other careers usually do not spend Harmony Reactions unless the skill says so.'
  },
  {
    id: 'elemental-affinity',
    term: 'Elemental affinity',
    aliases: ['elements', 'resist', 'weakness', 'immunity'],
    category: 'Elements & damage',
    summary: 'How much typed damage hurts you — fire, ice, thunder, and six others.',
    detail: 'Eight elements: Fire, Ice, Thunder (includes lightning), Earth, Wind, Water, Darkness, Light. Default is normal damage — the Character tab only lists elements you resist, are weak to, or are immune to. Sources include race, skills, gear, and status effects. Hover a row for where it came from.'
  },
  {
    id: 'elemental-tiers',
    term: 'Elemental damage tiers',
    aliases: ['25%', '50%', '200%', '400%', 'resistance tier'],
    category: 'Elements & damage',
    summary: '25% / 50% resist, 200% / 400% weak — multiply typed damage at the table.',
    detail: '25% resistance = quarter damage (÷4) = 2 resist levels. 50% = half (÷2) = 1 level. 200% weakness = double (×2) = 1 weak level. 400% = four times (×4) = 2 levels. Add up resist levels and weak levels from all sources on one element, subtract weak from resist: net 2 vs 2 → normal; net 1 → 50% resist; net −1 → 200% weak. Immunity beats everything. Skill and item text uses both % and plain words.'
  },
  {
    id: 'grants',
    term: 'GRANTS',
    aliases: ['grants:', 'special effect'],
    category: 'Effects & gear',
    summary: 'Gear or skill text that adds an ongoing rule — links to the Effects system.',
    detail: 'Items and skills often end with “GRANTS: Effect Name (what it does at the table).” That hooks into passive effects on the Character tab under Skill & Gear Effects. On-hit procs and one-shot attacks usually stay in the skill description instead of GRANTS.'
  },
  {
    id: 'status-effect',
    term: 'Status effect',
    aliases: ['status', 'buff', 'debuff', 'condition'],
    category: 'Effects & gear',
    summary: 'Temporary condition — poison, burn, bless, dazed, and similar.',
    detail: 'Active statuses show on the Character tab under Applied Status Effects. The GM or player can add one from the Effects list (pick effect, how many rounds, optional notes). Process Turn counts rounds down. Each entry in this dictionary explains what a status does in plain language.\n\nAt the table: “Put a token or note on the sheet — tick down each round.”'
  },
  {
    id: 'potency',
    term: 'Potency',
    aliases: ['effect strength'],
    category: 'Effects & gear',
    summary: 'How strong an applied status is — optional when adding an effect.',
    detail: 'When you add a status effect, Potency can boost or weaken it if the effect definition uses potency (e.g. stronger poison). Leave blank to use the default from the effect list. Shown as a pill on active effect cards when not zero.'
  },
  {
    id: 'duration',
    term: 'Duration (rounds)',
    aliases: ['rounds', 'remaining'],
    category: 'Effects & gear',
    summary: 'How many turns an effect lasts — Process Turn counts down.',
    detail: 'Duration is in rounds unless the effect says otherwise. Blank duration often means “until removed.” Process Turn on the Effects panel reduces remaining time on all active statuses. “Sustain” on skills is separate — that is how long you keep performing a song.'
  },
  {
    id: 'process-turn',
    term: 'Process Turn',
    aliases: ['end of turn', 'tick effects'],
    category: 'Effects & gear',
    summary: 'Button that ticks down status durations and similar end-of-turn cleanup.',
    detail: 'Click Process Turn when a round ends to reduce effect durations and apply any per-turn damage or healing from statuses. It does not replace the GM running enemy turns — it is a sheet helper so you remember to tick poison, regen, and buff timers.'
  },
  {
    id: 'background',
    term: 'Background',
    aliases: ['starting package'],
    category: 'Character & app',
    summary: 'Where your character came from — starting Lumens, gear, or notes.',
    detail: 'Pick a background at creation or on the Character tab. Each background grants a starting package (Lumens, items, or story hooks — see the pill tooltip). Background notes may append to your Notes tab when you first create the character.'
  },
  {
    id: 'gm-mode',
    term: 'GM Mode',
    aliases: ['gm tools', 'free skills'],
    category: 'Character & app',
    summary: 'Unlock everything for testing — free skills, items, and no prerequisites.',
    detail: 'Turn on GM Mode from the GM Tools tab. All skill trees show, prerequisites and incompatibilities are ignored, shop and stat upgrades cost nothing. Craft tab shows Grant (instant item) and free Craft (with craft bonuses on gear). Useful for GM prep and theorycrafting. Deactivate for normal play so costs and locks return.'
  },
  {
    id: 'action-bar',
    term: 'Action bar',
    aliases: ['quick skills', 'combat dock'],
    category: 'Character & app',
    summary: 'Bottom dock — quick HP/Stamina and pinned combat skills.',
    detail: 'When a character is selected, the action bar appears at the bottom. Adjust HP and Stamina with +/−, tap skills to use them (costs Stamina, shows toasts for results). Long-press or use the skill sheet for details before committing. Hides when no character is active.'
  },
  {
    id: 'craft',
    term: 'Crafting',
    aliases: ['craft tab', 'recipe'],
    category: 'Character & app',
    summary: 'Spend materials and meet skill requirements to make items.',
    detail: 'The Craft tab lists recipes filtered by career skills you know. Each recipe shows materials, required career skill tier, and output item. Crafted gear can get bonuses from your crafter’s skills — see the crafted-by label on items. Materials are bought in the Shop (Profession source) or granted by the GM. Enhancement items (enchantments) are crafted here under the Enchanting career filter — not bought from Shop → Enhancement.'
  },
  {
    id: 'enchantment',
    term: 'Enchantment (enhancement)',
    aliases: ['enhancement', 'enchant', 'enchanter craft', 'sharpening stone', 'ward charm', 'apply to weapon', 'apply to armour'],
    category: 'Effects & gear',
    summary: 'Crafted add-on that fits an enchant slot — bonus while attached to equipped gear.',
    detail: 'Enhancements are Enchanter recipes on the Craft tab (Enchanting filter). They sit in Inventory until applied. Equip gear with a free slot, then use Apply to weapon or Apply to armour on the enhancement in Inventory. Bonuses apply only while that gear is equipped and the enchant chip is attached. Most enchants: click the chip to remove and get the item back. No round timer — see While attached. Browse recipes via Shop → Profession → Enhancement (for prices and tooltips); shop stock is craft-only.'
  },
  {
    id: 'enchantment-slot',
    term: 'Enchantment slot',
    aliases: ['enchant slot', 'enchantable', 'empty slot'],
    category: 'Effects & gear',
    summary: 'Socket on gear — one enhancement per slot on the Character tab.',
    detail: 'Many weapons, armour pieces, and accessories list enchant slots in the Shop. When equipped, empty slots show as dashed chips on the Character tab. Dwarf racial Forge Blessing adds +1 slot on weapons and armour they craft. Enchanter Artifact Shaping can bump crafted gear to at least two slots when the base item is lower. Filled slots show a chip with the effect; hover for details.'
  },
  {
    id: 'while-attached',
    term: 'While attached',
    aliases: ['active while attached', 'attached to gear', 'permanent while attached'],
    category: 'Effects & gear',
    summary: 'Enchant bonus is on only while it stays on equipped gear — no countdown.',
    detail: 'Enhancements do not tick down on Process Turn. The bonus applies when the item is equipped and the enchant chip is present. Unequip the gear and the bonus stops (enchants stay on that inventory item). Re-equip and it returns. Remove the chip to reclaim the enhancement item — except barrier pools that were partially used (see Magical damage pool).'
  },
  {
    id: 'magical-damage-pool',
    term: 'Magical damage pool (absorption)',
    aliases: ['barrier crystal', 'absorb', 'absorption', 'magical barrier', 'damage pool', 'soak', 'barrier 40'],
    category: 'Effects & gear',
    summary: 'Soaks magical damage before HP — not healing; finite pool, then the crystal is spent.',
    detail: 'Advanced wards like Barrier Crystal (Ward Scribe recipe) give a fixed pool — e.g. 40 points — that only soaks magical damage. Physical hits ignore it. Absorption is not healing: it prevents HP loss, it does not restore HP. On the Character tab use −1 / −5 on the barrier chip when magical damage would have hit. At 0 the enchant is removed and the crystal is gone. Remove unused (× before any soak) to regain the item. If removed after any absorption, the crystal is destroyed. Armour or accessory slots only.'
  },
  {
    id: 'analyze',
    term: 'Analyze',
    aliases: ['scan enemy'],
    category: 'Character & app',
    summary: 'Reveal an enemy\'s HP band, elemental tiers, and one trait.',
    detail: 'Analyze is a skill effect used at the table to learn monster info without full stat blocks. Typical output: rough HP range, elemental resist/weak tiers (25/50/200/400%), and one special trait the GM chooses to reveal. It does not auto-fill enemy sheets in the app.'
  },
  {
    id: 'character-folder',
    term: 'Character folder (roster)',
    aliases: ['folder', 'roster folder', 'party folder', 'group characters'],
    category: 'Character & app',
    summary: 'Sidebar group for organising multiple characters — collapse, reorder, copy.',
    detail: 'Drag characters into folders on the roster sidebar, or assign a folder at creation. Use the ⋯ menu on a folder to move it up/down, copy the whole folder, or delete it (characters inside move to Unfiled). Folders are local to this browser save — not synced between players. GM spawn folder in GM Tools sets where new premades land.'
  },
  {
    id: 'instrument-amplify',
    term: 'Instrument amplify',
    aliases: ['off-hand instrument', 'instrument bonus', 'amplified song'],
    category: 'Team harmony',
    summary: 'Off-hand instruments extend songs and boost how many Musicians you count as.',
    detail: 'Every Musician can sing without gear — no skill required. With an instrument in the off-hand: common instruments add +1 sustain turn; uncommon also make you count as 2 Musicians for your part of the song; rare and epic add +1 extra for allies listening from your song. Long Set adds another +1 sustain turn. The sheet shows “Now performing” with your counts — harmony from other players is still called at the table.'
  },
  {
    id: 'off-hand-slot',
    term: 'Off-hand slot',
    aliases: ['offhand', 'off hand', 'shield slot', 'second hand'],
    category: 'Effects & gear',
    summary: 'Second hand slot — always visible; locked when a two-handed weapon is equipped.',
    detail: 'The Character tab shows Weapon, Off-hand, Armour, and Accessory in that order. Off-hand accepts shields, tomes, focus items (holy symbols, torches), instruments, and (with Dual Wield) daggers. Equip from Inventory with the Off-hand button. Two-handed weapons (bows, staves, polearms, etc.) use both hands — the off-hand row shows locked until you switch to a one-handed main weapon. Instruments need a Musician career skill; shields, tomes, and focus items work whenever the slot is free.'
  },
  {
    id: 'two-handed-weapon',
    term: 'Two-handed weapon',
    aliases: ['two handed', '2h', 'both hands'],
    category: 'Effects & gear',
    summary: 'Uses both hands — blocks the off-hand slot while equipped.',
    detail: 'Shop and inventory labels show One-handed or Two-handed on weapons. Bows, crossbows, staves, spears, halberds, and great weapons are usually two-handed. Swords, daggers, and light axes are usually one-handed. Equipping a two-handed weapon clears the off-hand slot automatically.'
  },
  {
    id: 'save-export',
    term: 'Save & export',
    aliases: ['import', 'export save', 'backup'],
    category: 'Character & app',
    summary: 'Browser save, backup file, and printable character sheet.',
    detail: 'Characters save automatically in this browser. Export Save in the sidebar downloads a full backup (characters, folders, GM tools, and UI). Import Save restores full saves or merges legacy character-only files. Export on the Character tab downloads one character. On Notes, click Save Notes or press Ctrl/Cmd+S when you edit text.\n\nAt the table: “Back up before a big session — Export Save is your friend.”'
  }
]

export function getAllGlossaryEntries(effectDefinitions = {}) {
  const staticIds = new Set(GLOSSARY_ENTRIES.map(entry => entry.id))
  const combat = COMBAT_GLOSSARY_ENTRIES.filter(entry => !staticIds.has(entry.id))
  combat.forEach(entry => staticIds.add(entry.id))
  const effects = buildEffectGlossaryEntries(effectDefinitions).filter(entry => !staticIds.has(entry.id))
  return [...GLOSSARY_ENTRIES, ...combat, ...effects]
}

export function filterGlossaryEntries(query = '', effectDefinitions = {}) {
  const q = String(query || '').trim().toLowerCase()
  const entries = getAllGlossaryEntries(effectDefinitions)
  if (!q) return entries
  return entries.filter(entry => {
    const haystack = [
      entry.term,
      ...(entry.aliases || []),
      entry.category,
      entry.summary,
      entry.detail,
      entry.effectId || ''
    ].join(' ').toLowerCase()
    return haystack.includes(q)
  })
}

export function groupGlossaryEntries(entries) {
  const order = new Map(GLOSSARY_CATEGORIES.map((name, index) => [name, index]))
  const groups = new Map()
  for (const entry of entries) {
    if (!groups.has(entry.category)) groups.set(entry.category, [])
    groups.get(entry.category).push(entry)
  }
  for (const items of groups.values()) {
    items.sort((a, b) => a.term.localeCompare(b.term, undefined, { sensitivity: 'base' }))
  }
  return [...groups.entries()].sort((a, b) => (order.get(a[0]) ?? 99) - (order.get(b[0]) ?? 99))
}
