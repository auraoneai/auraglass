// registry/blocks/commerce-cart/CartSummary.tsx — SURF-587 (AC-SURF-26),
// REQ-SURF-177. Summary: the labelled amount lines, a separator, the
// localized total, the call to action and an optional footnote. Below 1024 px
// of cart width the CTA bar is sticky at the bottom with the safe-area inset
// (commerce-cart.css).
import * as React from 'react';
import { Card, Separator } from 'aura-glass';
import { formatMoney } from './format-money';

export interface CartSummaryLine {
  id: string;
  label: React.ReactNode;
  amount: number;
}

export interface CartSummaryProps {
  lines: readonly CartSummaryLine[];
  total: number;
  /** ISO 4217 code the amounts are in. */
  currency: string;
  /** The checkout action (e.g. a Button or a link). */
  cta: React.ReactNode;
  footnote?: React.ReactNode;
  /** BCP-47 tag for formatting (default 'en-US'). */
  locale?: string;
}

export function CartSummary({ lines, total, currency, cta, footnote, locale = 'en-US' }: CartSummaryProps) {
  const fmt = (n: number) => formatMoney(n, currency, locale);
  return (
    <Card.Root data-ag-part="summary" className="ag-commerce-cart__summary" aria-label="Order summary" role="region">
      <Card.Body>
        <dl className="ag-commerce-cart__summary-lines">
          {lines.map((l) => (
            <div key={l.id} data-ag-part="summary-line" data-line={l.id}><dt>{l.label}</dt><dd>{fmt(l.amount)}</dd></div>
          ))}
        </dl>
        <Separator />
        <div data-ag-part="total" className="ag-commerce-cart__total"><span>Total</span><strong>{fmt(total)}</strong></div>
        {footnote !== undefined ? <p data-ag-part="footnote" className="ag-commerce-cart__footnote">{footnote}</p> : null}
      </Card.Body>
      <div data-ag-part="cta" className="ag-commerce-cart__cta">{cta}</div>
    </Card.Root>
  );
}

export default CartSummary;
