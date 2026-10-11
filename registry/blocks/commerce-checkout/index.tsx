// registry/blocks/commerce-checkout — REQ-SURF-176/177 (5.1 scope).
// Step-gated checkout shell: shipping → payment → review. Steps follow the
// §4.9 grammar triple (step/defaultStep/onStepChange); all data by props.
// The shipping and payment fields are a CMP Form: submitting a valid form
// advances to the next step. Parts: CheckoutSteps (SURF-589).
'use client';
import * as React from 'react';
import { Button, Card, Form, Separator, TextField } from 'aura-glass';
import type { CartItem } from '@/registry/blocks/commerce-cart/index';
import { formatMoney } from '@/registry/blocks/commerce-cart/index';
import { CheckoutSteps } from './CheckoutSteps';
import { CHECKOUT_STEPS, withStatus, type CheckoutStepId } from './steps';

export interface CommerceCheckoutProps {
  items: CartItem[];
  locale?: string;
  currency?: string;
  shippingAmount?: number;
  step?: CheckoutStepId;
  defaultStep?: CheckoutStepId;
  onStepChange?: (step: CheckoutStepId) => void;
  /** Called with the collected field values when each form step is submitted. */
  onStepSubmit?: (step: CheckoutStepId, values: Record<string, unknown>) => void;
  onSubmitOrder?: () => void;
  /** Force the compact step indicator (Sheet); default: viewport below 768 px. */
  compactSteps?: boolean;
}

export function CommerceCheckout({
  items,
  locale = 'en-US',
  currency = 'USD',
  shippingAmount = 0,
  step,
  defaultStep = 'shipping',
  onStepChange,
  onStepSubmit,
  onSubmitOrder,
  compactSteps,
}: CommerceCheckoutProps) {
  // Uncontrolled fallback keeps the grammar triple valid when `step` is unset.
  const [current, setCurrent] = useControlled(step, defaultStep, onStepChange);
  const idx = CHECKOUT_STEPS.findIndex((s) => s.id === current);
  const fmt = (n: number) => formatMoney(n, currency, locale);
  const subtotal = items.reduce((s, i) => s + i.unitPrice * i.quantity, 0);
  const next = CHECKOUT_STEPS[idx + 1]?.id;
  const submitStep = (values: Record<string, unknown>) => {
    onStepSubmit?.(current, values);
    if (next !== undefined) setCurrent(next);
  };

  return (
    <Card.Root data-ag-part="root" className="ag-commerce-checkout">
      <Card.Header>
        <Card.Title>Checkout</Card.Title>
        <CheckoutSteps steps={withStatus(CHECKOUT_STEPS, current)} value={current}
          onValueChange={(id) => setCurrent(id as CheckoutStepId)} compact={compactSteps} />
      </Card.Header>
      <Card.Body>
        {current === 'shipping' && (
          <Form key="shipping" data-ag-part="shipping-form" aria-label="Shipping address" onSubmit={submitStep}>
            <TextField label="Full name" name="name" autoComplete="name" required />
            <TextField label="Street" name="street" autoComplete="street-address" required />
            <TextField label="City" name="city" autoComplete="address-level2" required />
            <Button type="submit" data-ag-part="next">Continue</Button>
          </Form>
        )}
        {current === 'payment' && (
          <Form key="payment" data-ag-part="payment-form" aria-label="Payment" onSubmit={submitStep}>
            <TextField label="Card number" name="card" autoComplete="cc-number" required />
            <TextField label="Expiry" name="expiry" placeholder="MM/YY" autoComplete="cc-exp" required />
            <Button type="submit" data-ag-part="next">Continue</Button>
          </Form>
        )}
        {current === 'review' && (
          <ul data-ag-part="review-lines" aria-label="Order" style={{ listStyle: 'none', margin: 0, padding: 0 }}>
            {items.map((i) => (
              <li key={i.id} data-ag-part="line">
                {i.title} × {i.quantity} — {fmt(i.unitPrice * i.quantity)}
              </li>
            ))}
            <li role="presentation"><Separator /></li>
            <li data-ag-part="review-total"><strong>Total {fmt(subtotal + shippingAmount)}</strong></li>
          </ul>
        )}
      </Card.Body>
      <Card.Footer>
        <Button
          data-ag-part="back"
          disabled={idx === 0}
          onClick={() => setCurrent(CHECKOUT_STEPS[idx - 1]!.id)}
        >Back</Button>
        {current === 'review' ? (
          <Button data-ag-part="place-order" onClick={onSubmitOrder}>Place order</Button>
        ) : null}
      </Card.Footer>
    </Card.Root>
  );
}

// Minimal controlled/uncontrolled helper — mirrors the §4.9 triple.
function useControlled<T>(value: T | undefined, fallback: T, onChange?: (v: T) => void) {
  const [inner, setInner] = React.useState(fallback);
  const current = value === undefined ? inner : value;
  return [
    current,
    (next: T) => {
      if (value === undefined) setInner(next);
      onChange?.(next);
    },
  ] as const;
}

export { CheckoutSteps, type CheckoutStepsProps } from './CheckoutSteps';
export { CHECKOUT_STEPS, withStatus, type CheckoutStep, type CheckoutStepId, type CheckoutStepState } from './steps';
export default CommerceCheckout;
