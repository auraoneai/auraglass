// Shared step model for the checkout block (SURF-589).
export interface CheckoutStep {
  id: 'shipping' | 'payment' | 'review';
  label: string;
}

export const CHECKOUT_STEPS: CheckoutStep[] = [
  { id: 'shipping', label: 'Shipping' },
  { id: 'payment', label: 'Payment' },
  { id: 'review', label: 'Review' },
];
