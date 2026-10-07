// fixtures.ts — deterministic sample data for commerce-cart (no clocks,
// no randomness, no network — contract §3.3 block file contract).
import type { CartItem } from './index';

export const cartItems: CartItem[] = [
  { id: 'sku-atlas', title: 'Atlas chair', unitAmount: 499, quantity: 1 },
  { id: 'sku-nimbus', title: 'Nimbus lamp', unitAmount: 89.5, quantity: 2 },
  { id: 'sku-vega', title: 'Vega desk mat', unitAmount: 24, quantity: 1 },
];

export const cartProps = {
  items: cartItems,
  locale: 'en-US',
  currency: 'USD',
  shippingAmount: 12,
};

export const cartPropsDE = {
  items: cartItems,
  locale: 'de-DE',
  currency: 'EUR',
  shippingAmount: 12,
};

export const cartPropsJP = {
  items: cartItems,
  locale: 'ja-JP',
  currency: 'JPY',
  shippingAmount: 0,
};
