/** @jest-environment jsdom */
// tests/capability/registry/pricing.test.tsx — REQ-SURF-177 (REQ-FIN-88,
// AC-FIN-88). Rendered against the REAL library sources: JPY with 0
// decimals, de-DE EUR, the CMP SegmentedControl radiogroup for the billing
// period, PlanComparison boolean cells as icon + visually-hidden
// 'Included'/'Not included', and the scroll wrapper with a sticky first column.
//
// Resolution: 'aura-glass', 'aura-glass/icons' and the shadcn `@/registry/...`
// alias are mapped to the real modules via jest.requireActual until the root
// mapper lands (REQ-FIN-09 / contract C-4, FIN-A).
import { afterEach, describe, expect, it, jest } from '@jest/globals';
import { act, cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { axe } from 'jest-axe';
import * as fs from 'node:fs';
import * as React from 'react';

jest.mock('aura-glass', () => jest.requireActual('../../../src/index'), { virtual: true });
jest.mock('aura-glass/icons', () => jest.requireActual('../../../src/icons/index'), { virtual: true });
jest.mock('@/registry/blocks/commerce-cart/format-money', () => jest.requireActual('../../../registry/blocks/commerce-cart/format-money'), { virtual: true });

import { Pricing, PlanComparison } from '../../../registry/blocks/pricing/index';
import { plans, pricingProps, pricingPropsDE, pricingPropsJP } from '../../../registry/blocks/pricing/fixtures';

// jsdom lacks PointerEvent; Base UI Radio dispatches it on activation.
if (typeof window.PointerEvent !== 'function') {
  (window as unknown as { PointerEvent: typeof MouseEvent }).PointerEvent = MouseEvent;
}

afterEach(cleanup);

/** jest-axe result shape (the package ships no types for it here). */
type AxeResult = { violations: Array<{ id: string; nodes: Array<{ target: unknown }> }> };

const AMOUNTS = [9, 29, 99];
const prices = () => [...document.querySelectorAll('[data-ag-part="price"] strong')].map((n) => n.textContent!);

describe('pricing block', () => {
  it('JPY renders with 0 decimals', () => {
    render(<Pricing {...pricingPropsJP} />);
    expect(prices()).toHaveLength(AMOUNTS.length);
    prices().forEach((p, i) => expect(p).toMatch(new RegExp(`^[¥￥]${AMOUNTS[i]}$`)));
  });

  it('de-DE EUR renders comma decimals and €', () => {
    render(<Pricing {...pricingPropsDE} />);
    expect(prices()).toHaveLength(AMOUNTS.length);
    prices().forEach((p, i) => expect(p).toMatch(new RegExp(`^${AMOUNTS[i]},00\\s€$`)));
  });

  it('the billing period is a CMP SegmentedControl radiogroup', async () => {
    const onPeriodChange = jest.fn();
    const { container } = render(<Pricing {...pricingProps} onPeriodChange={onPeriodChange} />);
    const group = screen.getByRole('radiogroup', { name: 'Billing period' });
    expect(group.classList.contains('ag-segmented-control')).toBe(true);
    expect(container.querySelectorAll('[role="radiogroup"]')).toHaveLength(1);
    const radios = within(group).getAllByRole('radio');
    expect(radios.map((r) => r.textContent)).toEqual(['Monthly', 'Yearly']);
    expect(radios[0]!.getAttribute('aria-checked')).toBe('true');
    expect(prices()[0]).toBe('$9.00');
    await act(async () => { fireEvent.click(radios[1]!); });
    expect(onPeriodChange).toHaveBeenCalledWith('yearly');
    expect(within(group).getAllByRole('radio')[1]!.getAttribute('aria-checked')).toBe('true');
    expect(prices()[0]).toBe('$90.00');
  });

  it('yearly period shows yearly prices', () => {
    render(<Pricing {...pricingProps} defaultPeriod="yearly" />);
    expect(prices()).toEqual(['$90.00', '$290.00', '$990.00']);
    expect(document.querySelector('[data-ag-part="per"]')!.textContent).toBe('/yr');
  });

  it('featured plan carries the badge', () => {
    render(<Pricing {...pricingProps} />);
    const featured = document.querySelector('[data-state="featured"]') as HTMLElement;
    expect(within(featured).getByText('Popular')).toBeTruthy();
    expect(within(featured).getByText('Team')).toBeTruthy();
  });

  it("PlanComparison boolean cells: icon + visually-hidden 'Included' / 'Not included' (no bare glyphs)", () => {
    const { container } = render(<PlanComparison plans={plans} period="monthly" />);
    const cells = [...container.querySelectorAll('td[data-ag-part="cell"]')];
    const allFeatures = [...new Set(plans.flatMap((p) => p.features))];
    expect(cells).toHaveLength(allFeatures.length * plans.length);
    for (const td of cells) {
      const hidden = td.querySelector('.ag-visually-hidden')!;
      expect(hidden.textContent).toBe(td.getAttribute('data-state') === 'yes' ? 'Included' : 'Not included');
      expect(td.querySelector('svg[aria-hidden="true"]')).not.toBeNull();
      expect(td.textContent).not.toMatch(/[✓—]/);
    }
    // Starter has '1 workspace'; Team does not.
    const row = screen.getByRole('rowheader', { name: '1 workspace' }).closest('tr')!;
    const [starter, team] = within(row).getAllByRole('cell');
    expect(starter!.textContent).toBe('Included');
    expect(team!.textContent).toBe('Not included');
  });

  it('the comparison sits in a focusable horizontal-scroll region with a sticky first column', () => {
    render(<Pricing {...pricingProps} compare />);
    const region = screen.getByRole('region', { name: 'Compare plans' });
    expect(region.getAttribute('tabindex')).toBe('0');
    expect(region.querySelector('table')).not.toBeNull();
    const css = fs.readFileSync('registry/blocks/pricing/pricing.css', 'utf8');
    expect(css).toMatch(/\.ag-pricing__scroll \{[^}]*overflow-x: auto/);
    expect(css).toMatch(/th\[scope='row'\],[\s\S]*?\{[^}]*position: sticky;[^}]*inset-inline-start: 0/);
  });

  it('has 0 axe violations with the comparison', async () => {
    const { container } = render(<Pricing {...pricingProps} compare />);
    const r = (await axe(container, { rules: { region: { enabled: false } } })) as AxeResult;
    expect(r.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target).join(',')}`)).toEqual([]);
  });

  it('leaves no timers', () => {
    jest.useFakeTimers();
    try {
      render(<Pricing {...pricingProps} />);
      expect(jest.getTimerCount()).toBe(0);
    } finally {
      jest.useRealTimers();
    }
  });
});
