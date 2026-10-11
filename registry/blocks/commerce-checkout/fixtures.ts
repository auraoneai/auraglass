// fixtures.ts — deterministic sample data for commerce-checkout (no clocks,
// no randomness, no network — contract §3.3 block file contract). The block
// owns its sample data; only the CartItem type comes from the commerce-cart
// registry dependency.
import type { CartItem } from '@/registry/blocks/commerce-cart/index';

export const checkoutItems: CartItem[] = [
  { id: 'sku-atlas', title: 'Atlas chair', unitPrice: 499, quantity: 1 },
  { id: 'sku-nimbus', title: 'Nimbus lamp', unitPrice: 89.5, quantity: 2 },
  { id: 'sku-vega', title: 'Vega desk mat', unitPrice: 24, quantity: 1 },
];

export const checkoutProps = {
  items: checkoutItems,
  locale: 'en-US',
  currency: 'USD',
  shippingAmount: 12,
  defaultStep: 'shipping' as const,
};
