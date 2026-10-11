// registry/blocks/pricing — REQ-SURF-176/177 (5.2 scope).
// Plan grid: localized price formatting via Intl.NumberFormat, controlled
// billing-period via the §4.9 grammar triple, optional feature comparison.
// No fetch, no timers. Parts (SURF-591/-592): PricingTable, PlanComparison.
'use client';
import { useState } from 'react';
import { PricingTable } from './PricingTable';
import { PlanComparison } from './PlanComparison';
import type { BillingPeriod, PricingPlan } from './types';
import './pricing.css';

export interface PricingProps {
  plans: PricingPlan[];
  locale?: string;
  currency?: string;
  period?: BillingPeriod;
  defaultPeriod?: BillingPeriod;
  onPeriodChange?: (p: BillingPeriod) => void;
  onSelect?: (planId: string) => void;
  /** Render the feature comparison table under the plan grid. */
  compare?: boolean;
}

export function Pricing({
  plans,
  locale = 'en-US',
  currency = 'USD',
  period,
  defaultPeriod = 'monthly',
  onPeriodChange,
  onSelect,
  compare = false,
}: PricingProps) {
  const [inner, setInner] = useState(defaultPeriod);
  const current = period === undefined ? inner : period;
  const setPeriod = (p: BillingPeriod) => {
    if (period === undefined) setInner(p);
    onPeriodChange?.(p);
  };
  const featured = plans.find((p) => p.featured)?.id;

  return (
    <div className="ag-pricing-block">
      <PricingTable
        plans={plans}
        period={current}
        onPeriodChange={setPeriod}
        highlightPlanId={featured}
        locale={locale}
        currency={currency}
        onSelect={onSelect}
      />
      {compare && plans.length > 0 ? (
        <PlanComparison plans={plans} period={current} locale={locale} currency={currency} />
      ) : null}
    </div>
  );
}

export { PlanComparison, type PlanComparisonProps } from './PlanComparison';
export { PricingTable, type PricingTableProps } from './PricingTable';
export type { BillingPeriod, PricingPlan } from './types';
export default Pricing;
