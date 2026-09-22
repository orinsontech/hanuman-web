export type PlanId = 'trial' | 'full' | 'yearly' | 'lifetime';

export interface Plan {
  id: PlanId;
  label: string;
  tagline: string;
  priceRupees: number;
  pricePaise: number;
  dayLimit: number;
  canRestart: boolean;
  // Days after purchase until access lapses. null = never expires.
  durationDays: number | null;
}

// 'trial' is retired: kept out of PLAN_ORDER so it can never be purchased
// or ranked as an upgrade target again, but its entry in PLANS below stays
// populated so existing users still on plan='trial' keep working (dayLimitFor,
// canRestart, etc. all index PLANS[plan] unconditionally in a few places).
export const PLAN_ORDER: PlanId[] = ['full', 'yearly', 'lifetime'];

export const DEFAULT_PLAN: PlanId = 'yearly';

export const PLANS: Record<PlanId, Plan> = {
  trial: {
    id: 'trial',
    label: '3-दिन ट्रायल',
    tagline: 'पहले 3 दिन आज़माएं',
    priceRupees: 11,
    pricePaise: 1100,
    dayLimit: 3,
    canRestart: false,
    durationDays: null,
  },
  full: {
    id: 'full',
    label: '40-दिन साधना',
    tagline: 'पूरी 40 दिन की साधना, एक बार',
    priceRupees: 199,
    pricePaise: 19900,
    // 42 = 40 marketed days + 2 hidden buffer/makeup days. UI and the
    // certificate threshold (CERTIFICATE_DAYS) stay at 40 — see uiDayLimitFor.
    dayLimit: 42,
    canRestart: false,
    durationDays: null,
  },
  yearly: {
    id: 'yearly',
    label: '1 साल एक्सेस',
    tagline: '1 साल तक पूरी साधना का उपयोग करें',
    priceRupees: 349,
    pricePaise: 34900,
    dayLimit: 42,
    canRestart: false,
    durationDays: 365,
  },
  lifetime: {
    id: 'lifetime',
    label: 'Lifetime',
    tagline: 'जीवनभर पहुंच + जितनी बार चाहें दोहराएं',
    priceRupees: 499,
    pricePaise: 49900,
    dayLimit: 42,
    canRestart: true,
    durationDays: null,
  },
};

// The number of completed days the product is marketed/certified on. Plans
// may internally allow a couple of extra buffer days (see dayLimit above),
// but the UI and certificate eligibility always key off this constant.
export const CERTIFICATE_DAYS = 40;

// Access ceiling used for content gating (how many day numbers are visible
// and selectable in the UI / auto-advance flow) — capped at CERTIFICATE_DAYS
// even when the plan's real dayLimit is higher, so the extra buffer days
// stay invisible during normal use.
export function uiDayLimitFor(id: PlanId | null | undefined): number {
  return Math.min(dayLimitFor(id), CERTIFICATE_DAYS);
}

export function isValidPlan(id: unknown): id is PlanId {
  return typeof id === 'string' && Object.prototype.hasOwnProperty.call(PLANS, id);
}

export function planRank(id: PlanId | null | undefined): number {
  if (!id) return -1;
  return PLAN_ORDER.indexOf(id);
}

export function dayLimitFor(id: PlanId | null | undefined): number {
  if (!id) return 0;
  return PLANS[id].dayLimit;
}

export function isPlanExpired(expiresAt: string | Date | null | undefined): boolean {
  if (!expiresAt) return false;
  return new Date(expiresAt).getTime() < Date.now();
}

// Builds a `CASE column WHEN 'id' THEN rank ... END` SQL fragment from
// PLAN_ORDER, so the two payment routes never hand-duplicate this map again.
// Plans retired from PLAN_ORDER (e.g. 'trial') fall through to their
// planRank() value (-1) automatically, instead of an unmatched CASE
// silently evaluating to SQL NULL.
export function planRankSqlCase(column: string): string {
  const whens = Object.keys(PLANS)
    .map((id) => `WHEN '${id}' THEN ${planRank(id as PlanId)}`)
    .join(' ');
  return `(CASE ${column} ${whens} END)`;
}
