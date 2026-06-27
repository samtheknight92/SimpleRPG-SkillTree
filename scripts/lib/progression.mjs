/** Minimum character level to learn a skill of that tier (shared app + build scripts). */
/** +1 vs raw progress floor — pairs with characterLevelFromTotal (floor + 1). */
export const TIER_MIN_LEVEL = { 1: 1, 2: 5, 3: 9, 4: 14, 5: 21 }

export function characterLevelFromTotal(total) {
  return Math.floor(Number(total || 0)) + 1
}

/** Shop stock unlocks by item rarity (display level). */
export const SHOP_MIN_LEVEL_BY_RARITY = { common: 1, uncommon: 5, rare: 9, epic: 14, legendary: 21 }

export function shopMinLevelForItem(item) {
  if (Number.isFinite(Number(item?.shopMinLevel))) return Number(item.shopMinLevel)
  return SHOP_MIN_LEVEL_BY_RARITY[String(item?.rarity || 'common').toLowerCase()] ?? 1
}

/** Standard Lumen cost floor by tier (replaces old 5 / 10 / 15 / 20 / 25). */
export const TIER_LUMEN_COST = { 1: 8, 2: 20, 3: 40, 4: 65, 5: 100 }

const TIER_LUMEN_COST_OLD = { 1: 5, 2: 10, 3: 15, 4: 20, 5: 25 }

/** Highest typical legacy cost per tier before rebalance (standard + modest premiums). */
export const LEGACY_COST_CAP = { 1: 10, 2: 12, 3: 50, 4: 50, 5: 80 }

export function minLevelForTier(tier) {
  return TIER_MIN_LEVEL[Number(tier || 1)] ?? 1
}

export function minLevelToLearnSkill(skill) {
  const tierGate = minLevelForTier(skill?.tier)
  const explicit = skill?.prerequisites?.type === 'LEVEL' ? Number(skill.prerequisites.level || 0) : 0
  return Math.max(tierGate, explicit)
}

/** Idempotent: map legacy tier costs to new floors; scale old premiums once. */
export function adjustSkillCost(skill) {
  const tier = Number(skill?.tier || 1)
  const floor = TIER_LUMEN_COST[tier] ?? 8
  const oldFloor = TIER_LUMEN_COST_OLD[tier] ?? 5
  const legacyCap = LEGACY_COST_CAP[tier] ?? oldFloor
  const old = Number(skill?.cost ?? oldFloor)
  if (old <= oldFloor) return floor
  if (old === floor) return floor
  if (old <= legacyCap) {
    return Math.max(floor, Math.round(old * (floor / oldFloor)))
  }
  return old
}
