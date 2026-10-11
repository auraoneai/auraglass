/** @jest-environment jsdom */
// SURF-151: windowing math, end-reached, anchor='end', handle methods.
import { describe, expect, it, jest, beforeEach } from '@jest/globals';
import { act, render } from '@testing-library/react';
import * as React from 'react';
import { VirtualList, type VirtualListHandle } from './VirtualList';

// jsdom has no layout — give every element measurable box values so the
// virtualizer can compute windows.
const ITEM = 40;
const VIEWPORT = 200;
beforeEach(() => {
  jest.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function (this: HTMLElement) {
    const idx = this.dataset?.index ? Number(this.dataset.index) : 0;
    const isScroller = this.dataset.index === undefined;
    return {
      x: 0, y: 0,
      top: isScroller ? 0 : idx * ITEM,
      bottom: isScroller ? VIEWPORT : (idx + 1) * ITEM,
      left: 0, right: 400,
      width: 400,
      height: isScroller ? VIEWPORT : ITEM,
      toJSON: () => ({}),
    } as DOMRect;
  });
  Object.defineProperty(HTMLElement.prototype, 'offsetHeight', {
    configurable: true,
    get(this: HTMLElement) {
      return this.dataset?.index !== undefined ? ITEM : VIEWPORT;
    },
  });
  Object.defineProperty(HTMLElement.prototype, 'clientHeight', {
    configurable: true,
    get() {
      return VIEWPORT;
    },
  });
  // content height = the virtual sizer's height (jsdom has no layout)
  Object.defineProperty(HTMLElement.prototype, 'scrollHeight', {
    configurable: true,
    get(this: HTMLElement) {
      const sizer = this.firstElementChild as HTMLElement | null;
      return sizer ? Number.parseFloat(sizer.style.height || '0') || 0 : 0;
    },
  });
});

const items = Array.from({ length: 500 }, (_, i) => `row-${i}`);

import type { VirtualListProps } from './VirtualList';

function List({ n = 500, ...props }: Partial<VirtualListProps<string>> & { n?: number; ref?: React.Ref<VirtualListHandle> | undefined }) {
  return (
    <VirtualList
      {...({
        items: items.slice(0, n),
        getItemKey: (s: string) => s,
        renderItem: (s: string) => <div>{s}</div>,
        estimateSize: () => ITEM,
        style: { height: VIEWPORT },
        ...props,
      } as Parameters<typeof VirtualList>[0])}
    />
  );
}

describe('VirtualList (SURF-150/256, I-1)', () => {
  it('renders at most ceil(viewport/estimate) + overscan*2 items', () => {
    const { container } = render(<List />);
    const rendered = container.querySelectorAll('[data-index]');
    const max = Math.ceil(VIEWPORT / ITEM) + 6 * 2 + 1;
    expect(rendered.length).toBeLessThanOrEqual(max);
    expect(rendered.length).toBeGreaterThan(0);
  });

  it('keys via getItemKey', () => {
    const { container } = render(<List />);
    expect(container.querySelectorAll('[data-index="0"]').length).toBe(1);
  });

  it('onEndReached fires when scrolled near the bottom', () => {
    const onEnd = jest.fn();
    const { container } = render(<List onEndReached={onEnd} />);
    const scroller = container.firstElementChild as HTMLElement;
    Object.defineProperties(scroller, {
      scrollHeight: { configurable: true, value: 500 * ITEM },
      scrollTop: { configurable: true, writable: true, value: 500 * ITEM - VIEWPORT - 50 },
    });
    act(() => {
      scroller.dispatchEvent(new Event('scroll'));
    });
    expect(onEnd).toHaveBeenCalled();
  });

  it('handle scrollToIndex/scrollToKey/measureElement do not throw', () => {
    const ref = React.createRef<VirtualListHandle>();
    render(<List ref={ref as never} />);
    act(() => {
      ref.current?.scrollToIndex(400);
      ref.current?.scrollToKey('row-499');
      ref.current?.scrollToOffset(0);
      ref.current?.measureElement(document.createElement('div'));
    });
  });

  it('scrollToKey is a no-op for an unknown key', () => {
    const ref = React.createRef<VirtualListHandle>();
    render(<List ref={ref as never} />);
    act(() => {
      ref.current?.scrollToKey('nope');
    });
  });

  it('onEndReached fires exactly once for 3 scroll events inside the threshold', () => {
    const onEnd = jest.fn();
    const { container } = render(<List onEndReached={onEnd} />);
    expect(onEnd).not.toHaveBeenCalled();
    const scroller = container.firstElementChild as HTMLElement;
    for (const fromEnd of [150, 100, 20]) {
      Object.defineProperty(scroller, 'scrollTop', { configurable: true, writable: true, value: 500 * ITEM - VIEWPORT - fromEnd });
      act(() => {
        scroller.dispatchEvent(new Event('scroll'));
      });
    }
    expect(onEnd).toHaveBeenCalledTimes(1);
    // scrolling back above the threshold re-arms it
    Object.defineProperty(scroller, 'scrollTop', { configurable: true, writable: true, value: 0 });
    act(() => {
      scroller.dispatchEvent(new Event('scroll'));
    });
    Object.defineProperty(scroller, 'scrollTop', { configurable: true, writable: true, value: 500 * ITEM - VIEWPORT - 10 });
    act(() => {
      scroller.dispatchEvent(new Event('scroll'));
    });
    expect(onEnd).toHaveBeenCalledTimes(2);
  });

  it("anchor='end': appending items scrolls to the last index (bottom stays pinned)", () => {
    const calls: ScrollToOptions[] = [];
    const prevScrollTo = Object.getOwnPropertyDescriptor(Element.prototype, 'scrollTo');
    Object.defineProperty(Element.prototype, 'scrollTo', {
      configurable: true,
      value(opts: ScrollToOptions) { calls.push(opts); },
    });
    try {
      const { rerender } = render(<List n={20} anchor="end" />);
      calls.length = 0;
      rerender(<List n={21} anchor="end" />);
      expect(calls.length).toBeGreaterThanOrEqual(1);
      // last index aligned to the end: 21 * 40 - 200 viewport = 640
      expect(calls[calls.length - 1]!.top).toBe(21 * ITEM - VIEWPORT);
      // anchor='start' never auto-scrolls on append
      const { rerender: r2 } = render(<List n={20} anchor="start" />);
      calls.length = 0;
      r2(<List n={21} anchor="start" />);
      expect(calls.length).toBe(0);
    } finally {
      if (prevScrollTo) Object.defineProperty(Element.prototype, 'scrollTo', prevScrollTo);
      else delete (Element.prototype as unknown as { scrollTo?: unknown }).scrollTo;
    }
  });

  it('idle: 0 requestAnimationFrame and 0 setInterval calls in the 500 ms after settle', async () => {
    const raf = jest.spyOn(window, 'requestAnimationFrame');
    const interval = jest.spyOn(window, 'setInterval');
    const { container, unmount } = render(<List onEndReached={() => {}} />);
    // settle: flush effects and one macrotask
    await act(async () => {
      await new Promise((r) => setTimeout(r, 0));
    });
    expect(container.querySelectorAll('[data-index]').length).toBeGreaterThan(0);
    raf.mockClear();
    interval.mockClear();
    await act(async () => {
      await new Promise((r) => setTimeout(r, 500));
    });
    expect(raf).toHaveBeenCalledTimes(0);
    expect(interval).toHaveBeenCalledTimes(0);
    unmount();
    raf.mockRestore();
    interval.mockRestore();
  });
});
