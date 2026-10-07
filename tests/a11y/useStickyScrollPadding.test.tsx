/* MAT-305/306 (A11Y-028): sticky element height drives --ag-scroll-padding-*
   on the closest [data-ag-scroll-container] (else <html>); writes only on
   change; property removed + observer disconnected on unmount. */
import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';
import React from 'react';
import { act, render } from '@testing-library/react';
import { useStickyScrollPadding } from '../../src/a11y/useStickyScrollPadding';

type RO = { observe: jest.Mock; disconnect: jest.Mock; cb: () => void };
const observers: RO[] = [];

class FakeRO {
  cb: () => void;
  observe = jest.fn();
  unobserve = jest.fn();
  disconnect = jest.fn();
  constructor(cb: () => void) {
    this.cb = cb;
    observers.push(this as unknown as RO);
  }
}

const setHeight = (el: HTMLElement, h: number) => {
  jest.spyOn(el, 'getBoundingClientRect').mockImplementation(() => ({ height: h }) as DOMRect);
};

function Sticky({ edge = 'top' as 'top' | 'bottom', enabled = true }) {
  const ref = React.useRef<HTMLElement>(null);
  useStickyScrollPadding({ ref, edge, enabled });
  return <header ref={ref as React.RefObject<HTMLElement>} data-testid="sticky" />;
}

describe('useStickyScrollPadding', () => {
  const RealRO = (globalThis as { ResizeObserver?: unknown }).ResizeObserver;
  beforeEach(() => {
    observers.length = 0;
    (globalThis as { ResizeObserver?: unknown }).ResizeObserver = FakeRO;
  });
  afterEach(() => {
    (globalThis as { ResizeObserver?: unknown }).ResizeObserver = RealRO;
    document.documentElement.style.removeProperty('--ag-scroll-padding-top');
    document.documentElement.style.removeProperty('--ag-scroll-padding-bottom');
    document.querySelectorAll('[data-ag-scroll-container]').forEach((el) => el.remove());
    jest.restoreAllMocks();
  });

  it('writes block size + 8px to <html> when no scroll container exists', () => {
    const { getByTestId } = render(<Sticky />);
    const sticky = getByTestId('sticky');
    setHeight(sticky, 56);
    act(() => { observers[0]!.cb(); });
    expect(document.documentElement.style.getPropertyValue('--ag-scroll-padding-top')).toBe('64px');
  });

  it('targets the closest [data-ag-scroll-container]', () => {
    const container = document.createElement('div');
    container.setAttribute('data-ag-scroll-container', '');
    document.body.appendChild(container);
    const { getByTestId } = render(<Sticky />, { container });
    const sticky = getByTestId('sticky');
    setHeight(sticky, 40);
    act(() => { observers[0]!.cb(); });
    expect(container.style.getPropertyValue('--ag-scroll-padding-top')).toBe('48px');
    expect(document.documentElement.style.getPropertyValue('--ag-scroll-padding-top')).toBe('');
  });

  it('bottom edge writes --ag-scroll-padding-bottom', () => {
    const { getByTestId } = render(<Sticky edge="bottom" />);
    setHeight(getByTestId('sticky'), 32);
    act(() => { observers[0]!.cb(); });
    expect(document.documentElement.style.getPropertyValue('--ag-scroll-padding-bottom')).toBe('40px');
  });

  it('skips unchanged writes and removes the property + disconnects on unmount', () => {
    const { getByTestId, unmount } = render(<Sticky />);
    const sticky = getByTestId('sticky');
    setHeight(sticky, 24);
    const ro = observers[0]!;
    const spy = jest.spyOn(document.documentElement.style, 'setProperty');
    act(() => { ro.cb(); });
    act(() => { ro.cb(); });
    expect(spy.mock.calls.filter((c) => c[0] === '--ag-scroll-padding-top').length).toBe(1);
    unmount();
    expect(ro.disconnect).toHaveBeenCalled();
    expect(document.documentElement.style.getPropertyValue('--ag-scroll-padding-top')).toBe('');
  });

  it('enabled=false registers no observer and writes nothing', () => {
    render(<Sticky enabled={false} />);
    expect(observers.length).toBe(0);
    expect(document.documentElement.style.getPropertyValue('--ag-scroll-padding-top')).toBe('');
  });
});
