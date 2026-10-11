// registry/blocks/commerce-cart — REQ-SURF-177 (5.1 scope).
// Controlled cart UI: items, currency and locale arrive by props; totals are
// formatted with Intl.NumberFormat — no discounts, tax, or fetch logic.
// Parts (SURF-585/-586/-587): ProductCard, LineItem, CartSummary. Layout
// (commerce-cart.css): lines and summary side by side at ≥1024 px of cart
// width; below that the summary's CTA bar sticks to the bottom with
// padding-bottom: env(safe-area-inset-bottom).
'use client';
import * as React from 'react';
import { Badge, Button, Card } from 'aura-glass';
import { CartSummary } from './CartSummary';
import { LineItem } from './LineItem';
import { CartFormatContext, useCartFormatValue } from './format-money';
import './commerce-cart.css';

export interface CartItem {
  id: string;
  title: string;
  /** Price of one unit in the currency's major unit. */
  unitPrice: number;
  quantity: number;
  maxQuantity?: number;
}

export interface CommerceCartProps {
  items: CartItem[];
  /** BCP-47 tag, e.g. 'en-US', 'de-DE' */
  locale?: string;
  /** ISO 4217, e.g. 'USD', 'EUR', 'JPY' */
  currency?: string;
  shippingAmount?: number;
  onQuantityChange?: (id: string, quantity: number) => void;
  onRemove?: (id: string) => void;
  onCheckout?: () => void;
  emptyLabel?: string;
  footnote?: React.ReactNode;
}

export function CommerceCart({
  items,
  locale = 'en-US',
  currency = 'USD',
  shippingAmount = 0,
  onQuantityChange,
  onRemove,
  onCheckout,
  emptyLabel = 'Your cart is empty',
  footnote,
}: CommerceCartProps) {
  const fmt = useCartFormatValue(currency, locale);
  const subtotal = items.reduce((s, i) => s + i.unitPrice * i.quantity, 0);
  const shipping = items.length ? shippingAmount : 0;
  const count = items.reduce((s, i) => s + i.quantity, 0);

  return (
    <CartFormatContext.Provider value={fmt}>
      <Card.Root data-ag-part="root" className="ag-commerce-cart">
        <Card.Header>
          <Card.Title>Cart</Card.Title>
          <Badge>{count} items</Badge>
        </Card.Header>
        <div className="ag-commerce-cart__layout">
          <Card.Body className="ag-commerce-cart__lines">
            {items.length === 0 && <p data-ag-part="empty">{emptyLabel}</p>}
            <ul data-ag-part="lines" aria-label="Cart items" className="ag-commerce-cart__list">
              {items.map((item) => (
                <LineItem
                  key={item.id}
                  id={item.id}
                  title={item.title}
                  quantity={item.quantity}
                  unitPrice={item.unitPrice}
                  maxQuantity={item.maxQuantity}
                  onQuantityChange={(id, q) => onQuantityChange?.(id, q)}
                  onRemove={onRemove}
                />
              ))}
            </ul>
          </Card.Body>
          {items.length > 0 && (
            <CartSummary
              lines={[
                { id: 'subtotal', label: 'Subtotal', amount: subtotal },
                { id: 'shipping', label: 'Shipping', amount: shipping },
              ]}
              total={subtotal + shipping}
              currency={currency}
              locale={locale}
              footnote={footnote}
              cta={<Button data-ag-part="checkout" onClick={onCheckout}>Checkout</Button>}
            />
          )}
        </div>
      </Card.Root>
    </CartFormatContext.Provider>
  );
}

export { CartSummary, type CartSummaryProps, type CartSummaryLine } from './CartSummary';
export { LineItem, type LineItemProps } from './LineItem';
export { ProductCard, type ProductCardProps } from './ProductCard';
export { formatMoney, CartFormatContext } from './format-money';
export default CommerceCart;
