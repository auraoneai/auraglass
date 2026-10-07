// registry/blocks/commerce-cart — REQ-SURF-176 (5.1 scope).
// Controlled cart UI: items, currency and locale arrive by props; totals are
// formatted with Intl.NumberFormat — no discounts, tax, or fetch logic.
import { Badge, Button, Card, Separator } from 'aura-glass';

export interface CartItem {
  id: string;
  title: string;
  unitAmount: number;
  quantity: number;
  imageAlt?: string;
}

export interface CommerceCartProps {
  items: CartItem[];
  /** BCP-47 tag, e.g. 'en-US', 'de-DE' */
  locale?: string;
  /** ISO 4217, e.g. 'USD', 'EUR', 'JPY' */
  currency?: string;
  shippingAmount?: number;
  onQuantityChange?: (id: string, quantity: number) => void;
  onCheckout?: () => void;
  emptyLabel?: string;
}

export function formatMoney(amount: number, currency: string, locale: string): string {
  return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(amount);
}

export function CommerceCart({
  items,
  locale = 'en-US',
  currency = 'USD',
  shippingAmount = 0,
  onQuantityChange,
  onCheckout,
  emptyLabel = 'Your cart is empty',
}: CommerceCartProps) {
  const subtotal = items.reduce((s, i) => s + i.unitAmount * i.quantity, 0);
  const total = subtotal + (items.length ? shippingAmount : 0);
  const fmt = (n: number) => formatMoney(n, currency, locale);

  return (
    <Card.Root data-ag-part="root">
      <Card.Header data-ag-part="header">
        <Card.Title>Cart</Card.Title>
        <Badge>{items.reduce((s, i) => s + i.quantity, 0)} items</Badge>
      </Card.Header>
      <Card.Body data-ag-part="body">
        {items.length === 0 && <p data-ag-part="empty">{emptyLabel}</p>}
        <ul data-ag-part="lines" style={{ listStyle: 'none', margin: 0, padding: 0 }}>
          {items.map((item) => (
            <li key={item.id} data-ag-part="line" style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <span data-ag-part="line-title" style={{ flex: 1 }}>{item.title}</span>
              <span data-ag-part="line-qty">
                <Button
                  data-ag-part="qty-dec"
                  aria-label={`decrease ${item.title}`}
                  onClick={() => onQuantityChange?.(item.id, Math.max(0, item.quantity - 1))}
                >−</Button>
                <span data-ag-part="qty-value">{item.quantity}</span>
                <Button
                  data-ag-part="qty-inc"
                  aria-label={`increase ${item.title}`}
                  onClick={() => onQuantityChange?.(item.id, item.quantity + 1)}
                >+</Button>
              </span>
              <span data-ag-part="line-amount">{fmt(item.unitAmount * item.quantity)}</span>
            </li>
          ))}
        </ul>
      </Card.Body>
      {items.length > 0 && (
        <Card.Footer data-ag-part="footer">
          <div data-ag-part="subtotal"><span>Subtotal</span><span>{fmt(subtotal)}</span></div>
          <div data-ag-part="shipping"><span>Shipping</span><span>{fmt(shippingAmount)}</span></div>
          <Separator data-ag-part="separator" />
          <div data-ag-part="total"><span>Total</span><strong>{fmt(total)}</strong></div>
          <Button data-ag-part="checkout" onClick={onCheckout}>Checkout</Button>
        </Card.Footer>
      )}
    </Card.Root>
  );
}

export default CommerceCart;
