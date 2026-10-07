// registry/blocks/commerce-cart — REQ-SURF-176 (5.1 scope).
// Controlled cart UI: items, currency and locale arrive by props; totals are
// formatted with Intl.NumberFormat — no discounts, tax, or fetch logic.
// Parts (SURF-585/-586/-587): ProductCard, LineItem, CartSummary.
import { Badge, Card } from 'aura-glass';
import { CartSummary } from './CartSummary';
import { LineItem, type LineItemData } from './LineItem';

export type CartItem = LineItemData;

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
            <LineItem
              key={item.id}
              item={item}
              currency={currency}
              locale={locale}
              onQuantityChange={onQuantityChange}
            />
          ))}
        </ul>
      </Card.Body>
      {items.length > 0 && (
        <CartSummary
          subtotal={total - shippingAmount}
          shippingAmount={shippingAmount}
          currency={currency}
          locale={locale}
          onCheckout={onCheckout}
        />
      )}
    </Card.Root>
  );
}

export { CartSummary } from './CartSummary';
export { LineItem, type LineItemData, type LineItemProps } from './LineItem';
export { ProductCard, type ProductCardProps } from './ProductCard';
export { formatMoney } from './format-money';
export default CommerceCart;
