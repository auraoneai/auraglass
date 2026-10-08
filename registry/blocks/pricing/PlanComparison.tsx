// registry/blocks/pricing/PlanComparison.tsx — SURF-592 (AC-SURF-26).
// Feature-matrix comparison: one row per capability, one column per plan,
// header carries the localized price for the current period.
import { formatMoney } from '../commerce-cart/format-money';
import type { PricingPlan } from './types';

export interface PlanComparisonProps {
  plans: PricingPlan[];
  period: 'monthly' | 'yearly';
  locale?: string;
  currency?: string;
}

export function PlanComparison({ plans, period, locale = 'en-US', currency = 'USD' }: PlanComparisonProps) {
  const fmt = (n: number) => formatMoney(n, currency, locale);
  const allFeatures = [...new Set(plans.flatMap((p) => p.features))];
  return (
    <table data-ag-part="comparison">
      <thead>
        <tr>
          <th scope="col" data-ag-part="feature-head">Compare plans</th>
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
            {plans.map((plan) => (
              <td key={plan.id} data-ag-part="cell" data-state={plan.features.includes(feature) ? 'yes' : 'no'}>
                {plan.features.includes(feature) ? '✓' : '—'}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default PlanComparison;
