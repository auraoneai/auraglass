/** @jest-environment jsdom */
// tests/capability/registry/commerce-cart.test.tsx — REQ-SURF-177
// (REQ-FIN-88, AC-FIN-88). Rendered against the REAL library sources:
// localized totals (USD, de-DE EUR, JPY with 0 decimals), CMP NumberField
// quantities clamped to [1, maxQuantity], the polite line-total announcement,
// the CartSummary {lines,total,currency,cta,footnote} shape, layout CSS, no
// timers.
//
// Resolution: 'aura-glass' is aliased to src/index.ts via jest.requireActual
// until the root mapper lands (REQ-FIN-09 / contract C-4, FIN-A).
import { afterEach, describe, expect, it, jest } from '@jest/globals';
import { act, cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import * as fs from 'node:fs';
import * as React from 'react';

jest.mock('aura-glass', () => jest.requireActual('../../../src/index'), { virtual: true });

import { CommerceCart, CartSummary, formatMoney, type CartItem } from '../../../registry/blocks/commerce-cart/index';
import { cartProps, cartPropsDE, cartPropsJP } from '../../../registry/blocks/commerce-cart/fixtures';

afterEach(cleanup);

/** A stateful host so quantity changes round-trip like a real app. */
function Host({ initial, ...rest }: { initial: CartItem[] } & Omit<React.ComponentProps<typeof CommerceCart>, 'items'>) {
  const [items, setItems] = React.useState(initial);
  return (
    <CommerceCart {...rest} items={items}
      onQuantityChange={(id, q) => setItems((xs) => xs.map((x) => (x.id === id ? { ...x, quantity: q } : x)))}
      onRemove={(id) => setItems((xs) => xs.filter((x) => x.id !== id))} />
  );
}

const totalText = () => document.querySelector('[data-ag-part="total"] strong')!.textContent!;
const lineOf = (title: string) => screen.getByText(title).closest('li') as HTMLElement;
const qtyInput = (title: string) => within(lineOf(title)).getByRole('textbox', { name: `Quantity, ${title}` }) as HTMLInputElement;

describe('commerce-cart block', () => {
  it('renders lines and the USD total (subtotal + shipping)', () => {
    render(<CommerceCart {...cartProps} />);
    expect(screen.getByText('Atlas chair')).toBeTruthy();
    // 499 + 2×89.5 + 24 + 12 shipping
    expect(totalText()).toBe(formatMoney(714, 'USD', 'en-US'));
    expect(totalText()).toBe('$714.00');
  });

  it('JPY renders with 0 decimals everywhere', () => {
    const { container } = render(<CommerceCart {...cartPropsJP} />);
    // 74800 + 2×13450 + 3600 + 0 shipping
    expect(totalText()).toBe(formatMoney(105300, 'JPY', 'ja-JP'));
    expect(totalText()).toMatch(/^[¥￥]105,300$/);
    const amounts = [...container.querySelectorAll('[data-ag-part="line-amount"], [data-ag-part="summary-line"] dd')].map((n) => n.textContent!);
    expect(amounts.length).toBeGreaterThan(0);
    for (const a of amounts) expect(a).not.toMatch(/[.,]\d{2}$/);
  });

  it('de-DE EUR formats with comma decimals and €', () => {
    render(<CommerceCart {...cartPropsDE} />);
    expect(totalText()).toBe(formatMoney(714, 'EUR', 'de-DE'));
    expect(totalText()).toMatch(/^714,00\s€$/);
  });

  it('quantity is a CMP NumberField with min 1 and max maxQuantity', async () => {
    const onQuantityChange = jest.fn();
    const { container } = render(<CommerceCart {...cartProps} onQuantityChange={onQuantityChange} />);
    const roots = container.querySelectorAll('.ag-number-field.ag-commerce-cart__qty');
    expect(roots).toHaveLength(cartProps.items.length);
    expect(qtyInput('Atlas chair').value).toBe('1');
    // Decrement at 1 is disabled — a line can never reach 0.
    const dec = within(lineOf('Atlas chair')).getByRole('button', { name: /decrease/i });
    expect(dec.hasAttribute('data-disabled')).toBe(true);
    await act(async () => { fireEvent.click(dec); });
    expect(onQuantityChange).not.toHaveBeenCalled();
    expect(qtyInput('Atlas chair').value).toBe('1');
  });

  it('increment updates the line total and announces it politely; never exceeds maxQuantity', async () => {
    const onQuantityChange = jest.fn();
    render(<Host initial={[{ id: 'x', title: 'Atlas chair', unitPrice: 499, quantity: 3, maxQuantity: 4 }]} onQuantityChange={onQuantityChange} />);
    const inc = within(lineOf('Atlas chair')).getByRole('button', { name: /increase/i });
    await act(async () => { fireEvent.click(inc); });
    expect(qtyInput('Atlas chair').value).toBe('4');
    expect(within(lineOf('Atlas chair')).getByText('$1,996.00')).toBeTruthy();
    const live = lineOf('Atlas chair').querySelector('[aria-live="polite"]')!;
    expect(live.getAttribute('role')).toBe('status');
    expect(live.textContent).toContain('line total $1,996.00');
    // At max: increment is a no-op.
    await act(async () => { fireEvent.click(within(lineOf('Atlas chair')).getByRole('button', { name: /increase/i })); });
    expect(qtyInput('Atlas chair').value).toBe('4');
  });

  it('the live region is silent on first render', () => {
    render(<CommerceCart {...cartProps} />);
    for (const live of document.querySelectorAll('[data-ag-part="line"] [aria-live="polite"]')) expect(live.textContent).toBe('');
  });

  it('onRemove removes a line', async () => {
    render(<Host initial={cartProps.items} />);
    await act(async () => { fireEvent.click(screen.getByRole('button', { name: 'Remove Vega desk mat' })); });
    expect(screen.queryByText('Vega desk mat')).toBeNull();
  });

  it('CartSummary takes {lines,total,currency,cta,footnote}', () => {
    render(<CartSummary lines={[{ id: 'subtotal', label: 'Subtotal', amount: 10 }, { id: 'tax', label: 'Tax', amount: 2 }]}
      total={12} currency="EUR" locale="de-DE" cta={<button type="button">Pay now</button>} footnote="Prices include VAT" />);
    const region = screen.getByRole('region', { name: 'Order summary' });
    expect(within(region).getByText('Tax')).toBeTruthy();
    expect(region.querySelector('[data-ag-part="total"] strong')!.textContent).toMatch(/^12,00\s€$/);
    expect(within(region).getByRole('button', { name: 'Pay now' })).toBeTruthy();
    expect(within(region).getByText('Prices include VAT')).toBeTruthy();
  });

  it('empty state renders the empty label and no summary', () => {
    render(<CommerceCart {...cartProps} items={[]} />);
    expect(screen.getByText('Your cart is empty')).toBeTruthy();
    expect(screen.queryByRole('button', { name: 'Checkout' })).toBeNull();
  });

  it('layout CSS: side by side at >=1024 px; sticky CTA with the safe-area inset below', () => {
    const css = fs.readFileSync('registry/blocks/commerce-cart/commerce-cart.css', 'utf8');
    expect(css).toMatch(/@container ag-commerce-cart \(min-width: 1024px\)[\s\S]*grid-template-columns: minmax\(0, 2fr\)/);
    expect(css).toMatch(/\.ag-commerce-cart__cta \{[^}]*position: sticky;[^}]*padding-bottom: calc\(var\(--ag-space-3\) \+ env\(safe-area-inset-bottom\)\)/);
  });

  it('leaves no timers', () => {
    jest.useFakeTimers();
    try {
      render(<CommerceCart {...cartProps} />);
      expect(jest.getTimerCount()).toBe(0);
    } finally {
      jest.useRealTimers();
    }
  });
});
