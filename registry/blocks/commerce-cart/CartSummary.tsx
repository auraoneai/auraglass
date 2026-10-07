// registry/blocks/commerce-cart/CartSummary.tsx — SURF-587 (AC-SURF-26).
// Footer summary: subtotal, shipping, separator, localized total, checkout.
import { Button, Card, Separator } from 'aura-glass';
import { formatMoney } from './format-money';

export interface CartSummaryProps {
  subtotal: number;
  shippingAmount: number;
  currency: string;
  locale: string;
  onCheckout?: (() => void) | undefined;
}

export function CartSummary({ subtotal, shippingAmount, currency, locale, onCheckout }: CartSummaryProps) {
  const fmt = (n: number) => formatMoney(n, currency, locale);
  return (
    <Card.Footer data-ag-part="footer">
      <div data-ag-part="subtotal"><span>Subtotal</span><span>{fmt(subtotal)}</span></div>
      <div data-ag-part="shipping"><span>Shipping</span><span>{fmt(shippingAmount)}</span></div>
      <Separator data-ag-part="separator" />
      <div data-ag-part="total"><span>Total</span><strong>{fmt(subtotal + shippingAmount)}</strong></div>
      <Button data-ag-part="checkout" onClick={onCheckout}>Checkout</Button>
    </Card.Footer>
  );
}

export default CartSummary;
