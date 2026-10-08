// registry/blocks/commerce-cart/LineItem.tsx — SURF-586 (AC-SURF-26).
// One cart line: title, quantity stepper (>=24x24 hit targets) and the
// localized line amount. All state changes are reported by callback.
import { Button } from 'aura-glass';
import { formatMoney } from './format-money';

export interface LineItemData {
  id: string;
  title: string;
  unitAmount: number;
  quantity: number;
  imageAlt?: string;
}

export interface LineItemProps {
  item: LineItemData;
  currency: string;
  locale: string;
  onQuantityChange?: ((id: string, quantity: number) => void) | undefined;
}

const STEP_TARGET = { minWidth: 24, minHeight: 24 } as const;

export function LineItem({ item, currency, locale, onQuantityChange }: LineItemProps) {
  return (
    <li data-ag-part="line" style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      <span data-ag-part="line-title" style={{ flex: 1 }}>{item.title}</span>
      <span data-ag-part="line-qty">
        <Button
          data-ag-part="qty-dec"
          aria-label={`decrease ${item.title}`}
          style={STEP_TARGET}
          onClick={() => onQuantityChange?.(item.id, Math.max(0, item.quantity - 1))}
        >−</Button>
        <span data-ag-part="qty-value">{item.quantity}</span>
        <Button
          data-ag-part="qty-inc"
          aria-label={`increase ${item.title}`}
          style={STEP_TARGET}
          onClick={() => onQuantityChange?.(item.id, item.quantity + 1)}
        >+</Button>
      </span>
      <span data-ag-part="line-amount">
        {formatMoney(item.unitAmount * item.quantity, currency, locale)}
      </span>
    </li>
  );
}

export default LineItem;
