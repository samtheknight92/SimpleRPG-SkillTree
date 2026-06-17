import { readFileSync } from 'fs';

const effects = JSON.parse(readFileSync('data/json/effects.json', 'utf8'));
const meta = JSON.parse(readFileSync('data/json/skill-meta.json', 'utf8'));
const skills = JSON.parse(readFileSync('data/json/skills.json', 'utf8'));

const passiveBonuses = meta.PASSIVE_SKILL_BONUSES || {};
const passiveEffects = meta.PASSIVE_SKILL_EFFECTS || {};
const equipRules = meta.EQUIPMENT_SKILL_EFFECTS || {};

function escapeRegExp(v) {
  return String(v).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
function phraseMatches(h, p) {
  if (!p || p.length < 3) return false;
  const re = new RegExp('(?:^|[^a-z0-9_])' + escapeRegExp(p) + '(?:[^a-z0-9_]|$)');
  return re.test(h);
}
function findEffect(phrase) {
  const n = String(phrase || '').trim().toLowerCase();
  return Object.values(effects).find(
    (e) => e.name.toLowerCase() === n || e.id.replace(/_/g, ' ') === n
  );
}
function extractFromDesc(desc) {
  const hay = String(desc || '').toLowerCase();
  const f = [];
  for (const e of Object.values(effects).sort((a, b) => b.name.length - a.name.length)) {
    const idp = e.id.replace(/_/g, ' ');
    if (phraseMatches(hay, idp) || phraseMatches(hay, e.name.toLowerCase())) f.push(e.id);
  }
  return f;
}
function parseApply(desc) {
  const found = [];
  for (const m of String(desc || '').matchAll(/Apply\s+([A-Za-z][A-Za-z\s]+?)(?:\s*\(|\.|,|$)/gi)) {
    const e = findEffect(m[1].trim());
    if (e) found.push(e.id);
  }
  return [...new Set(found)];
}
function parseGrant(desc) {
  const g = String(desc || '').match(/GRANTS?:\s*([^.]+)/i);
  if (!g) return [];
  return extractFromDesc(g[1]);
}

function recommend(skill) {
  const desc = skill.desc || '';
  if (equipRules[skill.id]) return { type: 'equip', ...equipRules[skill.id] };
  if (passiveEffects[skill.id]?.length) return { type: 'mapped', ids: passiveEffects[skill.id] };
  if (/^passive:/i.test(desc) && effects[skill.id] && Number(skill.staminaCost || 0) === 0) {
    return { type: 'self_effect', ids: [skill.id] };
  }
  const grant = parseGrant(desc);
  if (grant.length) return { type: 'grant', ids: grant };
  if (/^passive:/i.test(desc)) {
    const ap = parseApply(desc);
    if (ap.length) return { type: 'apply', ids: ap };
  }
  if (passiveBonuses[skill.id]) return { type: 'flat_stats', stats: passiveBonuses[skill.id] };
  return { type: 'none' };
}

function flattenSkills(obj) {
  const flat = [];
  for (const val of Object.values(obj)) {
    if (Array.isArray(val)) flat.push(...val);
    else if (val && typeof val === 'object') {
      for (const list of Object.values(val)) {
        if (Array.isArray(list)) flat.push(...list);
      }
    }
  }
  return flat;
}

const passives = flattenSkills(skills).filter((s) => /^passive:/i.test(s.desc || ''));

console.log('=== ALL PASSIVE SKILLS ===');
for (const s of passives) {
  const rec = recommend(s);
  const stored = s.specialEffects || [];
  console.log(
    `${s.id} | rec=${rec.type} | stored=[${stored.join(',')}] | ${(s.desc || '').slice(0, 90)}`
  );
}

const gaps = [];
for (const s of passives) {
  const rec = recommend(s);
  const desc = s.desc || '';
  const needsEquip =
    /(?:staff|wand|dagger|sword|axe|bow|polearm|hammer|ranged).*?(?:equip|wield|hold|using)|(?:equip|wield|hold|using).*?(?:staff|wand|dagger|sword)/i.test(
      desc
    );
  const hasStatInDesc = /\+\d+\s+(magic power|accuracy|speed|hp|stamina|physical defence|magical defence|strength)/i.test(
    desc
  );
  const hasImmunity = /immun/i.test(desc);
  const hasRegen = /per turn|regenerat|restore.*stamina/i.test(desc);

  if (
    rec.type === 'none' &&
    (needsEquip || hasRegen || hasImmunity || hasStatInDesc || parseGrant(desc).length || parseApply(desc).length)
  ) {
    gaps.push({
      id: s.id,
      name: s.name,
      desc,
      needsEquip,
      grant: parseGrant(desc),
      apply: parseApply(desc),
    });
  }
}

console.log('\n=== GAPS (need wiring) ===', gaps.length);
for (const g of gaps) {
  console.log('---');
  console.log(g.id, '|', g.name);
  console.log(' ', g.desc);
  if (g.needsEquip) console.log('  NEEDS_EQUIP_RULE');
  if (g.grant.length) console.log('  GRANT:', g.grant.join(','));
  if (g.apply.length) console.log('  APPLY:', g.apply.join(','));
}
