// registry/blocks/pricing/PricingTable.tsx — SURF-591 (AC-SURF-26),
// REQ-SURF-177. Plan grid + billing-period toggle: CMP SegmentedControl
// (radiogroup semantics) for monthly/yearly; 1/2/3+ columns via an auto-fit
// grid; the toggle is sticky under 390 px (pricing.css).
'use client';
import { Badge, Button, Card, SegmentedControl } from 'aura-glass';
import { formatMoney } from '@/registry/blocks/commerce-cart/format-money';
import type { BillingPeriod, PricingPlan } from './types';

export interface PricingTableProps {
  plans: PricingPlan[];
  period: BillingPeriod;
  onPeriodChange?: ((p: BillingPeriod) => void) | undefined;
  highlightPlanId?: string | undefined;
  locale?: string;
  currency?: string;
  onSelect?: ((planId: string) => void) | undefined;
}

const PERIOD_LABEL: Record<BillingPeriod, string> = { monthly: 'Monthly', yearly: 'Yearly' };

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
    <section data-ag-part="root" className="ag-pricing" aria-label="Plans">
      <div data-ag-part="period-toggle" className="ag-pricing__toggle">
        <SegmentedControl.Root
          aria-label="Billing period"
          value={period}
          onValueChange={(v) => { if (v === 'monthly' || v === 'yearly') onPeriodChange?.(v); }}
        >
          {(['monthly', 'yearly'] as const).map((p) => (
            <SegmentedControl.Item key={p} value={p}>{PERIOD_LABEL[p]}</SegmentedControl.Item>
          ))}
        </SegmentedControl.Root>
      </div>
      <div data-ag-part="grid" className="ag-pricing__grid">
        {plans.map((plan) => {
          const featured = plan.featured || plan.id === highlightPlanId;
          return (
            <Card.Root key={plan.id} data-state={featured ? 'featured' : 'normal'} className="ag-pricing__plan">
              <Card.Header>
                <Card.Title>{plan.name}</Card.Title>
                {featured && <Badge>Popular</Badge>}
              </Card.Header>
              <Card.Body>
                <div data-ag-part="price">
                  <strong>{fmt(period === 'monthly' ? plan.monthlyAmount : plan.yearlyAmount)}</strong>
                  <span data-ag-part="per">/{period === 'monthly' ? 'mo' : 'yr'}</span>
                </div>
                <ul data-ag-part="features" className="ag-pricing__features">
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
