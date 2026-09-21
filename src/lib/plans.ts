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
    dayLimit: 40,
    canRestart: false,
  },
  lifetime: {
    id: 'lifetime',
    label: 'Lifetime',
    tagline: 'जीवनभर पहुंच + जितनी बार चाहें दोहराएं',
    priceRupees: 499,
    pricePaise: 49900,
    dayLimit: 40,
    canRestart: true,
  },
};

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
