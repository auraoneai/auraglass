// registry/blocks/pricing — REQ-SURF-176 (5.2 scope).
// Plan grid: localized price formatting via Intl.NumberFormat, controlled
// billing-period via the §4.9 grammar triple. No fetch, no timers.
import { Badge, Button, Card } from 'aura-glass';
import { formatMoney } from '../commerce-cart/index';

export interface PricingPlan {
  id: string;
  name: string;
  monthlyAmount: number;
  yearlyAmount: number;
  features: string[];
  featured?: boolean;
}

export interface PricingProps {
  plans: PricingPlan[];
  locale?: string;
  currency?: string;
  period?: 'monthly' | 'yearly';
  defaultPeriod?: 'monthly' | 'yearly';
  onPeriodChange?: (p: 'monthly' | 'yearly') => void;
  onSelect?: (planId: string) => void;
}

import { useState } from 'react';

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
  const fmt = (n: number) => formatMoney(n, currency, locale);

  return (
    <section data-ag-part="root">
      <div data-ag-part="period-toggle" role="group" aria-label="billing period">
        {(['monthly', 'yearly'] as const).map((p) => (
          <Button
            key={p}
            data-ag-part="period"
            data-state={current === p ? 'on' : 'off'}
            onClick={() => setPeriod(p)}
          >{p}</Button>
        ))}
      </div>
      <div data-ag-part="grid" style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
        {plans.map((plan) => (
          <Card.Root key={plan.id} data-ag-part="plan" data-state={plan.featured ? 'featured' : 'normal'}>
            <Card.Header>
              <Card.Title>{plan.name}</Card.Title>
              {plan.featured && <Badge data-ag-part="featured-badge">Popular</Badge>}
            </Card.Header>
            <Card.Body>
              <div data-ag-part="price">
                <strong>{fmt(current === 'monthly' ? plan.monthlyAmount : plan.yearlyAmount)}</strong>
                <span data-ag-part="per">/{current === 'monthly' ? 'mo' : 'yr'}</span>
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
        ))}
      </div>
    </section>
  );
}

export default Pricing;
