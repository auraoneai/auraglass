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

  it('idle timers: no rAF or interval left behind', () => {
    jest.useFakeTimers();
    const { unmount } = render(<List />);
    expect(jest.getTimerCount()).toBe(0);
    unmount();
    jest.useRealTimers();
  });

  describe('getScrollElement (REQ-SURF-109)', () => {
    function External(props: Partial<VirtualListProps<string>> & { ref?: React.Ref<VirtualListHandle> | undefined }) {
      const ref = React.useRef<HTMLDivElement | null>(null);
      return (
        <div ref={ref} data-testid="scroller">
          <List getScrollElement={() => ref.current} style={undefined} {...props} />
        </div>
      );
    }

    it('renders no scroll container of its own and windows against the ancestor', () => {
      const { getByTestId } = render(<External />);
      const scroller = getByTestId('scroller');
      const list = scroller.firstElementChild as HTMLElement;
      expect(list.getAttribute('role')).toBe('list');
      expect(list.style.overflow).toBe('');
      expect(list.style.height).toBe(`${500 * ITEM}px`);
      expect([...scroller.querySelectorAll<HTMLElement>('*')].filter((el) => el.style.overflow !== '')).toEqual([]);
      const rendered = scroller.querySelectorAll('[data-index]');
      expect(rendered.length).toBeGreaterThan(0);
      expect(rendered.length).toBeLessThanOrEqual(Math.ceil(VIEWPORT / ITEM) + 6 * 2 + 1);
    });

    it('onEndReached listens on the ancestor scroller, once per crossing', () => {
      const onEnd = jest.fn();
      const { getByTestId } = render(<External onEndReached={onEnd} />);
      const scroller = getByTestId('scroller');
      let top = 0;
      Object.defineProperties(scroller, {
        scrollHeight: { configurable: true, value: 500 * ITEM },
        scrollTop: { configurable: true, get: () => top, set: (v: number) => { top = v; } },
      });
      act(() => { scroller.dispatchEvent(new Event('scroll')); }); // top: re-arms
      onEnd.mockClear();
      top = 500 * ITEM - VIEWPORT - 50;
      act(() => { scroller.dispatchEvent(new Event('scroll')); });
      act(() => { scroller.dispatchEvent(new Event('scroll')); });
      expect(onEnd).toHaveBeenCalledTimes(1);
    });

    it('scrollToKey scrolls the ancestor to the row offset', () => {
      const ref = React.createRef<VirtualListHandle>();
      const { getByTestId } = render(<External ref={ref as never} />);
      const scroller = getByTestId('scroller');
      Object.defineProperty(scroller, 'scrollHeight', { configurable: true, value: 500 * ITEM });
      const scrollTo = jest.fn();
      (scroller as unknown as { scrollTo: typeof scrollTo }).scrollTo = scrollTo;
      act(() => { ref.current?.scrollToKey('row-100', { align: 'start' }); });
      expect((scrollTo.mock.calls[0]?.[0] as ScrollToOptions).top).toBe(100 * ITEM);
    });
  });
});
