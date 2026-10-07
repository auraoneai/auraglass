// fixtures.ts — deterministic sample data for commerce-checkout.
import { cartItems, cartProps } from '../commerce-cart/fixtures';

export const checkoutProps = {
  items: cartItems,
  locale: cartProps.locale,
  currency: cartProps.currency,
  shippingAmount: cartProps.shippingAmount,
  defaultStep: 'shipping' as const,
};
