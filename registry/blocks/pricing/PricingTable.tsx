// registry/blocks/pricing/PricingTable.tsx — SURF-591 (AC-SURF-26).
// Plan grid + period toggle: SegmentedControl-style radiogroup for
// monthly/yearly; 1/2/3+ columns at 390/768/>=1024 px via auto-fit grid;
// the toggle is sticky under 390 px.
import { Badge, Button, Card } from 'aura-glass';
import { formatMoney } from '@/registry/blocks/commerce-cart/format-money';
import type { PricingPlan } from './types';

export interface PricingTableProps {
  plans: PricingPlan[];
  period: 'monthly' | 'yearly';
  onPeriodChange?: ((p: 'monthly' | 'yearly') => void) | undefined;
  highlightPlanId?: string | undefined;
  locale?: string;
  currency?: string;
  onSelect?: ((planId: string) => void) | undefined;
}

export function PricingTable({
  plans,
  period,
  onPeriodChange,
  highlightPlanId,
  locale = 'en-US',
  currency = 'USD',
  onSelect,
}: PricingTableProps) {
  const fmt = (n: number) => formatMoney(n, currency, locale);
  return (
    <section data-ag-part="root">
      <div
        data-ag-part="period-toggle"
        role="radiogroup"
        aria-label="billing period"
        style={{ position: 'sticky', top: 0 }}
      >
        {(['monthly', 'yearly'] as const).map((p) => (
          <Button
            key={p}
            data-ag-part="period"
            role="radio"
            aria-checked={period === p}
            data-state={period === p ? 'on' : 'off'}
            onClick={() => onPeriodChange?.(p)}
          >{p}</Button>
        ))}
      </div>
      <div
        data-ag-part="grid"
        style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}
      >
        {plans.map((plan) => {
          const featured = plan.featured || plan.id === highlightPlanId;
          return (
            <Card.Root key={plan.id} data-ag-part="plan" data-state={featured ? 'featured' : 'normal'}>
              <Card.Header>
                <Card.Title>{plan.name}</Card.Title>
                {featured && <Badge data-ag-part="featured-badge">Popular</Badge>}
              </Card.Header>
              <Card.Body>
                <div data-ag-part="price">
                  <strong>{fmt(period === 'monthly' ? plan.monthlyAmount : plan.yearlyAmount)}</strong>
                  <span data-ag-part="per">/{period === 'monthly' ? 'mo' : 'yr'}</span>
                </div>
                <ul data-ag-part="features" style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                  {plan.features.map((f) => <li key={f}>{f}</li>)}
                </ul>
              </Card.Body>
              <Card.Footer>
                <Button data-ag-part="select" onClick={() => onSelect?.(plan.id)}>
                  Choose {plan.name}
                </Button>
              </Card.Footer>
            </Card.Root>
          );
        })}
      </div>
    </section>
  );
}

export default PricingTable;
