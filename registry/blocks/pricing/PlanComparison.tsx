// registry/blocks/pricing/PlanComparison.tsx — SURF-592 (AC-SURF-26),
// REQ-SURF-177. Feature-matrix comparison: one row per capability, one column
// per plan; the header carries the localized price for the current period.
// Boolean cells are an icon plus visually-hidden 'Included' / 'Not included'.
// The table sits in a focusable horizontal-scroll region with a sticky first
// column so it stays usable at 390 px (pricing.css).
import { VisuallyHidden } from 'aura-glass';
import { CheckIcon, MinusIcon } from 'aura-glass/icons';
import { formatMoney } from '@/registry/blocks/commerce-cart/format-money';
import type { BillingPeriod, PricingPlan } from './types';

export interface PlanComparisonProps {
  plans: PricingPlan[];
  period: BillingPeriod;
  locale?: string;
  currency?: string;
  /** Accessible name of the scroll region and the table caption. */
  label?: string;
}

export function PlanComparison({ plans, period, locale = 'en-US', currency = 'USD', label = 'Compare plans' }: PlanComparisonProps) {
  const fmt = (n: number) => formatMoney(n, currency, locale);
  const allFeatures = [...new Set(plans.flatMap((p) => p.features))];
  return (
    <div data-ag-part="comparison-scroll" className="ag-pricing__scroll" role="region" aria-label={label} tabIndex={0}>
      <table data-ag-part="comparison" className="ag-pricing__comparison">
        <caption><VisuallyHidden>{label}</VisuallyHidden></caption>
        <thead>
          <tr>
            <th scope="col" data-ag-part="feature-head">Feature</th>
            {plans.map((plan) => (
              <th key={plan.id} scope="col" data-ag-part="plan-head" data-state={plan.featured ? 'featured' : 'normal'}>
                {plan.name}
                <div data-ag-part="plan-price">
                  {fmt(period === 'monthly' ? plan.monthlyAmount : plan.yearlyAmount)}
                  <span data-ag-part="per">/{period === 'monthly' ? 'mo' : 'yr'}</span>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {allFeatures.map((feature) => (
            <tr key={feature} data-ag-part="feature-row">
              <th scope="row" data-ag-part="feature">{feature}</th>
              {plans.map((plan) => {
                const included = plan.features.includes(feature);
                return (
                  <td key={plan.id} data-ag-part="cell" data-state={included ? 'yes' : 'no'}>
                    {included ? <CheckIcon aria-hidden="true" /> : <MinusIcon aria-hidden="true" />}
                    <VisuallyHidden>{included ? 'Included' : 'Not included'}</VisuallyHidden>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default PlanComparison;
