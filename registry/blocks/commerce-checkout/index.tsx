// registry/blocks/commerce-checkout — REQ-SURF-176 (5.1 scope).
// Step-gated checkout shell: shipping → payment → review. Steps follow the
// §4.9 grammar triple (step/defaultStep/onStepChange); all data by props.
// Parts: CheckoutSteps (SURF-589).
import { Button, Card, Separator, TextField } from 'aura-glass';
import { useState } from 'react';
import type { CartItem } from '../commerce-cart/index';
import { formatMoney } from '../commerce-cart/index';
import { CheckoutSteps } from './CheckoutSteps';
import { CHECKOUT_STEPS, type CheckoutStep } from './steps';

export interface CommerceCheckoutProps {
  items: CartItem[];
  locale?: string;
  currency?: string;
  shippingAmount?: number;
  step?: CheckoutStep['id'];
  defaultStep?: CheckoutStep['id'];
  onStepChange?: (step: CheckoutStep['id']) => void;
  onSubmitOrder?: () => void;
}

export function CommerceCheckout({
  items,
  locale = 'en-US',
  currency = 'USD',
  shippingAmount = 0,
  step,
  defaultStep = 'shipping',
  onStepChange,
  onSubmitOrder,
}: CommerceCheckoutProps) {
  // Uncontrolled fallback keeps the grammar triple valid when `step` is unset.
  const [internal, setInternal] = useControlled(step, defaultStep, onStepChange);
  const idx = CHECKOUT_STEPS.findIndex((s) => s.id === internal);
  const fmt = (n: number) => formatMoney(n, currency, locale);
  const subtotal = items.reduce((s, i) => s + i.unitAmount * i.quantity, 0);

  return (
    <Card.Root data-ag-part="root">
      <Card.Header data-ag-part="header">
        <Card.Title>Checkout</Card.Title>
        <CheckoutSteps steps={CHECKOUT_STEPS} current={internal} />
      </Card.Header>
      <Card.Body data-ag-part="body">
        {internal === 'shipping' && (
          <div data-ag-part="shipping-form">
            <TextField label="Full name" name="name" />
            <TextField label="Street" name="street" />
            <TextField label="City" name="city" />
          </div>
        )}
        {internal === 'payment' && (
          <div data-ag-part="payment-form">
            <TextField label="Card number" name="card" inputMode="numeric" />
            <TextField label="Expiry" name="expiry" placeholder="MM/YY" />
          </div>
        )}
        {internal === 'review' && (
          <ul data-ag-part="review-lines" style={{ listStyle: 'none', margin: 0, padding: 0 }}>
            {items.map((i) => (
              <li key={i.id} data-ag-part="line">
                {i.title} × {i.quantity} — {fmt(i.unitAmount * i.quantity)}
              </li>
            ))}
            <Separator />
            <li data-ag-part="review-total"><strong>Total {fmt(subtotal + shippingAmount)}</strong></li>
          </ul>
        )}
      </Card.Body>
      <Card.Footer data-ag-part="footer">
        <Button
          data-ag-part="back"
          disabled={idx === 0}
          onClick={() => setInternal(CHECKOUT_STEPS[idx - 1]!.id)}
        >Back</Button>
        {internal !== 'review' ? (
          <Button data-ag-part="next" onClick={() => setInternal(CHECKOUT_STEPS[idx + 1]!.id)}>Continue</Button>
        ) : (
          <Button data-ag-part="place-order" onClick={onSubmitOrder}>Place order</Button>
        )}
      </Card.Footer>
    </Card.Root>
  );
}

// Minimal controlled/uncontrolled helper — mirrors the §4.9 triple.
function useControlled<T>(value: T | undefined, fallback: T, onChange?: (v: T) => void) {
  const [inner, setInner] = useState(fallback);
  const current = value === undefined ? inner : value;
  return [
    current,
    (next: T) => {
      if (value === undefined) setInner(next);
      onChange?.(next);
    },
  ] as const;
}

export { CheckoutSteps } from './CheckoutSteps';
export { CHECKOUT_STEPS, type CheckoutStep } from './steps';
export default CommerceCheckout;
