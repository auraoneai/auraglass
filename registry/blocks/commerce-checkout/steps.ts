// Shared step model for the checkout block (SURF-589, REQ-SURF-177).
export type CheckoutStepId = 'shipping' | 'payment' | 'review';
export type CheckoutStepStatus = 'complete' | 'current' | 'upcoming';

export interface CheckoutStep {
  id: CheckoutStepId;
  label: string;
}

/** A step as CheckoutSteps renders it: the step plus its status. */
export interface CheckoutStepState {
  id: string;
  label: string;
  status: CheckoutStepStatus;
}

export const CHECKOUT_STEPS: CheckoutStep[] = [
  { id: 'shipping', label: 'Shipping' },
  { id: 'payment', label: 'Payment' },
  { id: 'review', label: 'Review' },
];

/** Status per step from the current step id: before = complete, at = current, after = upcoming. */
export function withStatus(steps: readonly CheckoutStep[], current: string): CheckoutStepState[] {
  const idx = steps.findIndex((s) => s.id === current);
  return steps.map((s, i) => ({ ...s, status: i < idx ? 'complete' : i === idx ? 'current' : 'upcoming' }));
}
