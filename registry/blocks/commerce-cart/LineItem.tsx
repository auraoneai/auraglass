// registry/blocks/commerce-cart/LineItem.tsx — SURF-586 (AC-SURF-26),
// REQ-SURF-177. One cart line: title, a CMP NumberField quantity (min 1, max
// maxQuantity — a line can never reach 0; removal is its own action), the
// localized line total and a polite live region announcing the new line total
// after a quantity change. Formatting comes from the cart's currency/locale
// (CartFormatContext). All state changes are reported by callback.
'use client';
import * as React from 'react';
import { Button, NumberField, VisuallyHidden } from 'aura-glass';
import { useCartFormat } from './format-money';

export interface LineItemProps {
  id: string;
  title: string;
  quantity: number;
  onQuantityChange: (id: string, quantity: number) => void;
  /** Price of one unit, in the cart currency's major unit. */
  unitPrice: number;
  /** Line total; defaults to unitPrice × quantity. */
  lineTotal?: number | undefined;
  onRemove?: ((id: string) => void) | undefined;
  maxQuantity?: number | undefined;
}

export function LineItem({ id, title, quantity, onQuantityChange, unitPrice, lineTotal, onRemove, maxQuantity }: LineItemProps) {
  const { format } = useCartFormat();
  const total = lineTotal ?? unitPrice * quantity;
  const formatted = format(total);
  /* Announce only after the user changes the quantity, never on mount. */
  const [announcement, setAnnouncement] = React.useState('');
  const changed = React.useRef(false);
  React.useEffect(() => {
    if (changed.current) setAnnouncement(`${title}: ${quantity} × ${format(unitPrice)}, line total ${formatted}`);
  }, [quantity, formatted, title, unitPrice, format]);

  return (
    <li data-ag-part="line" className="ag-commerce-cart__line">
      <span data-ag-part="line-title" className="ag-commerce-cart__line-title">{title}</span>
      <NumberField
        className="ag-commerce-cart__qty"
        aria-label={`Quantity, ${title}`}
        value={quantity}
        min={1}
        {...(maxQuantity !== undefined ? { max: maxQuantity } : {})}
        step={1}
        onValueChange={(v) => {
          if (v === null || v === quantity) return;
          changed.current = true;
          onQuantityChange(id, v);
        }}
      />
      <span data-ag-part="line-amount" className="ag-commerce-cart__line-amount">{formatted}</span>
      {onRemove !== undefined ? (
        <Button data-ag-part="remove" variant="clear" size="sm" aria-label={`Remove ${title}`} onClick={() => onRemove(id)}>Remove</Button>
      ) : null}
      <VisuallyHidden role="status" aria-live="polite" data-ag-part="line-live">{announcement}</VisuallyHidden>
    </li>
  );
}

export default LineItem;
