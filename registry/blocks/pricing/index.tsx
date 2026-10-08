// registry/blocks/pricing — REQ-SURF-176 (5.2 scope).
// Plan grid: localized price formatting via Intl.NumberFormat, controlled
// billing-period via the §4.9 grammar triple. No fetch, no timers.
// Parts (SURF-591/-592): PricingTable, PlanComparison.
import { useState } from 'react';
import { PricingTable } from './PricingTable';
import type { PricingPlan } from './types';

export interface PricingProps {
  plans: PricingPlan[];
  locale?: string;
  currency?: string;
  period?: 'monthly' | 'yearly';
  defaultPeriod?: 'monthly' | 'yearly';
  onPeriodChange?: (p: 'monthly' | 'yearly') => void;
  onSelect?: (planId: string) => void;
}

export function Pricing({
  plans,
  locale = 'en-US',
  currency = 'USD',
  period,
  defaultPeriod = 'monthly',
  onPeriodChange,
  onSelect,
}: PricingProps) {
  const [inner, setInner] = useState(defaultPeriod);
  const current = period === undefined ? inner : period;
  const setPeriod = (p: 'monthly' | 'yearly') => {
    if (period === undefined) setInner(p);
    onPeriodChange?.(p);
  };
  const featured = plans.find((p) => p.featured)?.id;

  return (
    <PricingTable
      plans={plans}
      period={current}
      onPeriodChange={setPeriod}
      highlightPlanId={featured}
      locale={locale}
      currency={currency}
      onSelect={onSelect}
    />
  );
}

export { PlanComparison } from './PlanComparison';
export { PricingTable, type PricingTableProps } from './PricingTable';
export type { PricingPlan } from './types';
export default Pricing;
