/** @jest-environment jsdom */
// tests/capability/registry/commerce-checkout.test.tsx — REQ-SURF-177
// (REQ-FIN-88, AC-FIN-88). Rendered against the REAL library sources:
// CheckoutSteps {steps:{id,label,status}[], value, onValueChange} with exactly
// one aria-current="step"; the compact 'Step n of m' + CMP Sheet layout below
// 768 px; CMP Form fields that advance the step on a valid submit.
//
// Resolution: 'aura-glass' and the shadcn `@/registry/...` alias are mapped
// here to the real modules via jest.requireActual until the root mapper lands
// (REQ-FIN-09 / contract C-4, FIN-A).
import { afterEach, describe, expect, it, jest } from '@jest/globals';
import { act, cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import * as React from 'react';

jest.mock('aura-glass', () => jest.requireActual('../../../src/index'), { virtual: true });
jest.mock('@/registry/blocks/commerce-cart/index', () => jest.requireActual('../../../registry/blocks/commerce-cart/index'), { virtual: true });

import { CommerceCheckout, CheckoutSteps, CHECKOUT_STEPS, withStatus } from '../../../registry/blocks/commerce-checkout/index';
import { checkoutProps } from '../../../registry/blocks/commerce-checkout/fixtures';
import { AuraGlassProvider } from '../../../src/theme/public';

const wrap = (ui: React.ReactElement) => render(ui, { wrapper: ({ children }) => <AuraGlassProvider storage={null}>{children}</AuraGlassProvider> });

const setViewport = (narrow: boolean) => {
  Object.defineProperty(window, 'matchMedia', {
    configurable: true, writable: true,
    value: (q: string) => ({
      matches: q === '(max-width: 767.98px)' ? narrow : false, media: q, onchange: null,
      addEventListener: () => {}, removeEventListener: () => {}, addListener: () => {}, removeListener: () => {}, dispatchEvent: () => false,
    }),
  });
};
const originalMatchMedia = window.matchMedia;
afterEach(() => {
  cleanup();
  Object.defineProperty(window, 'matchMedia', { configurable: true, writable: true, value: originalMatchMedia });
});

const currentSteps = () => document.querySelectorAll('[aria-current="step"]');
const fill = (label: string, value: string) => fireEvent.change(screen.getByLabelText(label), { target: { value } });

describe('commerce-checkout block', () => {
  it('renders the shipping step by default with exactly one aria-current="step"', () => {
    setViewport(false);
    wrap(<CommerceCheckout {...checkoutProps} />);
    expect(screen.getByRole('form', { name: 'Shipping address' })).toBeTruthy();
    expect(currentSteps()).toHaveLength(1);
    expect(currentSteps()[0]!.textContent).toContain('Shipping');
  });

  it('CheckoutSteps takes {steps:{id,label,status}[], value, onValueChange}', () => {
    setViewport(false);
    const onValueChange = jest.fn();
    render(<CheckoutSteps steps={withStatus(CHECKOUT_STEPS, 'review')} value="review" onValueChange={onValueChange} />);
    const items = screen.getAllByRole('listitem');
    expect(items.map((li) => li.getAttribute('data-state'))).toEqual(['complete', 'complete', 'current']);
    expect(currentSteps()).toHaveLength(1);
    expect(currentSteps()[0]!.textContent).toContain('Review');
    fireEvent.click(screen.getByRole('button', { name: /Shipping/ }));
    expect(onValueChange).toHaveBeenCalledWith('shipping');
  });

  it('a valid Form submit advances shipping → payment → review; an invalid one does not', async () => {
    setViewport(false);
    const onStepChange = jest.fn();
    const onStepSubmit = jest.fn();
    wrap(<CommerceCheckout {...checkoutProps} onStepChange={onStepChange} onStepSubmit={onStepSubmit} />);
    // Required fields empty: stays on shipping.
    await act(async () => { fireEvent.click(screen.getByRole('button', { name: 'Continue' })); });
    expect(onStepChange).not.toHaveBeenCalled();
    fill('Full name', 'Ada Lovelace');
    fill('Street', '1 Analytical Way');
    fill('City', 'London');
    await act(async () => { fireEvent.click(screen.getByRole('button', { name: 'Continue' })); });
    expect(onStepSubmit).toHaveBeenCalledWith('shipping', expect.objectContaining({ name: 'Ada Lovelace', city: 'London' }));
    expect(onStepChange).toHaveBeenLastCalledWith('payment');
    expect(screen.getByRole('form', { name: 'Payment' })).toBeTruthy();
    expect(currentSteps()).toHaveLength(1);
    fill('Card number', '4242 4242 4242 4242');
    fill('Expiry', '12/30');
    await act(async () => { fireEvent.click(screen.getByRole('button', { name: 'Continue' })); });
    expect(onStepChange).toHaveBeenLastCalledWith('review');
    expect(screen.getByText(/Total \$714\.00/)).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Place order' })).toBeTruthy();
  });

  it('controlled step prop wins over defaultStep', () => {
    setViewport(false);
    wrap(<CommerceCheckout {...checkoutProps} step="payment" />);
    expect(screen.getByRole('form', { name: 'Payment' })).toBeTruthy();
  });

  it("below 768 px: 'Step n of m' trigger opens the step list in a CMP Sheet", async () => {
    setViewport(true);
    wrap(<CommerceCheckout {...checkoutProps} defaultStep="payment" />);
    const nav = screen.getByRole('navigation', { name: 'Checkout steps' });
    expect(nav.getAttribute('data-layout')).toBe('sheet');
    const trigger = within(nav).getByRole('button', { name: 'Step 2 of 3' });
    expect(within(nav).queryByRole('list')).toBeNull();
    await act(async () => { fireEvent.click(trigger); });
    const sheet = document.querySelector('[data-ag-overlay="sheet"]') as HTMLElement;
    expect(sheet).not.toBeNull();
    expect(within(sheet).getAllByRole('listitem')).toHaveLength(3);
    expect(sheet.querySelectorAll('[aria-current="step"]')).toHaveLength(1);
    expect(sheet.querySelector('[aria-current="step"]')!.textContent).toContain('Payment');
  });

  it('`compact` forces the Sheet layout at any width', () => {
    setViewport(false);
    wrap(<CommerceCheckout {...checkoutProps} compactSteps />);
    expect(screen.getByRole('button', { name: 'Step 1 of 3' })).toBeTruthy();
  });

  it('leaves no timers', () => {
    setViewport(false);
    jest.useFakeTimers();
    try {
      wrap(<CommerceCheckout {...checkoutProps} />);
      expect(jest.getTimerCount()).toBe(0);
    } finally {
      jest.useRealTimers();
    }
  });
});
