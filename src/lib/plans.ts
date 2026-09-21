export type PlanId = 'trial' | 'full' | 'lifetime';

export interface Plan {
  id: PlanId;
  label: string;
  tagline: string;
  priceRupees: number;
  pricePaise: number;
  dayLimit: number;
  canRestart: boolean;
}

export const PLAN_ORDER: PlanId[] = ['trial', 'full', 'lifetime'];

export const PLANS: Record<PlanId, Plan> = {
  trial: {
    id: 'trial',
    label: '3-दिन ट्रायल',
    tagline: 'पहले 3 दिन आज़माएं',
    priceRupees: 189,
    pricePaise: 18900,
    dayLimit: 3,
    canRestart: false,
  },
  full: {
    id: 'full',
    label: '40-दिन साधना',
    tagline: 'पूरी 40 दिन की साधना, एक बार',
    priceRupees: 299,
    pricePaise: 29900,
    // 42 = 40 marketed days + 2 hidden buffer/makeup days. UI and the
    // certificate threshold (CERTIFICATE_DAYS) stay at 40 — see uiDayLimitFor.
    dayLimit: 42,
    canRestart: false,
  },
  lifetime: {
    id: 'lifetime',
    label: 'Lifetime',
    tagline: 'जीवनभर पहुंच + जितनी बार चाहें दोहराएं',
    priceRupees: 499,
    pricePaise: 49900,
    dayLimit: 42,
    canRestart: true,
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
