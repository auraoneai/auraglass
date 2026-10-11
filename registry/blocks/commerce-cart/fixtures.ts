// fixtures.ts — deterministic sample data for commerce-cart (no clocks,
// no randomness, no network — contract §3.3 block file contract).
import type { CartItem } from './index';

export const cartItems: CartItem[] = [
  { id: 'sku-atlas', title: 'Atlas chair', unitPrice: 499, quantity: 1, maxQuantity: 4 },
  { id: 'sku-nimbus', title: 'Nimbus lamp', unitPrice: 89.5, quantity: 2, maxQuantity: 10 },
  { id: 'sku-vega', title: 'Vega desk mat', unitPrice: 24, quantity: 1 },
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

/** JPY has no minor unit: whole-yen prices, rendered with 0 decimals. */
export const cartItemsJP: CartItem[] = [
  { id: 'sku-atlas', title: 'Atlas chair', unitPrice: 74800, quantity: 1, maxQuantity: 4 },
  { id: 'sku-nimbus', title: 'Nimbus lamp', unitPrice: 13450, quantity: 2, maxQuantity: 10 },
  { id: 'sku-vega', title: 'Vega desk mat', unitPrice: 3600, quantity: 1 },
];

export const cartPropsJP = {
  items: cartItemsJP,
  locale: 'ja-JP',
  currency: 'JPY',
  shippingAmount: 0,
};
