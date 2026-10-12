'use client';

/* CMP-185 (REQ-CMP-72): owned windowed list for >200-item Combobox — no
   tanstack import (not in CMP's allowlisted importers; CC-CMP-06 stays a
   fallback). `items` is Base UI's FILTERED list (Combobox.useFilteredItems),
   so typing narrows the rows and every row's aria-setsize is the filtered
   count; aria-posinset is the 1-based index into it. One scrollTop ref; a
   scroll marks the window dirty and schedules ONE S-13 subscribeFrame
   recompute (the frame subscription is released after it runs, so an idle
   list costs no per-frame work). `activeIndex` (the highlighted option)
   is scrolled into the window so aria-activedescendant always names a
   mounted node. DOM option count <= visible + 2*overscan. */
import * as React from 'react';
import { subscribeFrame } from '../../motion/ticker';

export const VIRTUAL_OVERSCAN = 5;
/* Matches the popup's max-block-size (288px) — jsdom measures 0, so a real
   measurement only ever shrinks the window, never grows it. */
const DEFAULT_VIEWPORT_PX = 288;

export interface ComboboxVirtualListProps<Item> {
  items: readonly Item[];
  /** Estimated row block-size in px. */
  estimateSize?: number;
  /** Index (into `items`) of the highlighted option; kept inside the window. */
  activeIndex?: number | undefined;
  children: (item: Item, index: number) => React.ReactNode;
}

interface WindowRange { start: number; end: number }

export function windowFor(scrollTop: number, viewPx: number, estimateSize: number, count: number): WindowRange {
  const visible = Math.ceil(viewPx / estimateSize);
  const start = Math.max(0, Math.min(Math.floor(scrollTop / estimateSize) - VIRTUAL_OVERSCAN, count - visible - VIRTUAL_OVERSCAN));
  const end = Math.min(count, start + visible + 2 * VIRTUAL_OVERSCAN);
  return { start, end };
}

/** scrollTop that brings row `index` fully into a `viewPx` viewport (unchanged when already visible). */
export function scrollTopFor(index: number, scrollTop: number, viewPx: number, estimateSize: number): number {
  const top = index * estimateSize;
  const bottom = top + estimateSize;
  if (top < scrollTop) return top;
  if (bottom > scrollTop + viewPx) return Math.max(0, bottom - viewPx);
  return scrollTop;
}

export function ComboboxVirtualList<Item>({ items, estimateSize = 32, activeIndex, children }: ComboboxVirtualListProps<Item>) {
  const parentRef = React.useRef<HTMLDivElement>(null);
  const scrollTopRef = React.useRef(0);
  const viewRef = React.useRef(DEFAULT_VIEWPORT_PX);
  const frameOff = React.useRef<(() => void) | null>(null);
  const count = items.length;
  /* The render window is state, not a ref: render must not read ref.current
     (REQ-CMP-24, React Compiler 'Refs' rule). The functional update returns
     the previous object when the window is unchanged, so a recompute with no
     movement schedules no re-render. */
  const [range, setRange] = React.useState<WindowRange>(() => windowFor(0, DEFAULT_VIEWPORT_PX, estimateSize, count));

  const recompute = React.useCallback(() => {
    const next = windowFor(scrollTopRef.current, viewRef.current, estimateSize, count);
    setRange((prev) => (prev.start === next.start && prev.end === next.end ? prev : next));
  }, [count, estimateSize]);

  /* Measure once and recompute when the (filtered) item count changes. A
     narrower list can leave scrollTop past its end: clamp it. */
  React.useLayoutEffect(() => {
    const el = parentRef.current;
    if (el && el.clientHeight > 0) viewRef.current = el.clientHeight;
    const maxTop = Math.max(0, count * estimateSize - viewRef.current);
    if (scrollTopRef.current > maxTop) {
      scrollTopRef.current = maxTop;
      if (el) el.scrollTop = maxTop;
    }
    recompute();
  }, [recompute, count, estimateSize]);

  React.useEffect(() => () => { frameOff.current?.(); frameOff.current = null; }, []);

  const onScroll = React.useCallback((e: React.UIEvent<HTMLDivElement>) => {
    scrollTopRef.current = e.currentTarget.scrollTop;
    if (frameOff.current !== null) return; // already dirty: one recompute per frame
    frameOff.current = subscribeFrame(() => {
      frameOff.current?.();
      frameOff.current = null;
      recompute();
    });
  }, [recompute]);

  /* Keyboard highlight beyond the window: scroll the scroller so the row is
     in view and mount it synchronously (before paint), so the input's
     aria-activedescendant never points at an unmounted option. */
  React.useLayoutEffect(() => {
    if (activeIndex === undefined || activeIndex < 0 || activeIndex >= count) return;
    const nextTop = scrollTopFor(activeIndex, scrollTopRef.current, viewRef.current, estimateSize);
    if (nextTop === scrollTopRef.current) return;
    scrollTopRef.current = nextTop;
    const el = parentRef.current;
    if (el) el.scrollTop = nextTop;
    recompute();
  }, [activeIndex, count, estimateSize, recompute]);

  const { start, end } = range;
  const rows: React.ReactNode[] = [];
  for (let i = start; i < Math.min(end, count); i++) {
    const item = items[i] as Item;
    const node = children(item, i);
    const rendered = React.isValidElement(node)
      ? React.cloneElement(node as React.ReactElement<Record<string, unknown>>, {
          index: i,
          'aria-setsize': count,
          'aria-posinset': i + 1,
        })
      : node;
    rows.push(
      <div
        key={i}
        style={{
          position: 'absolute',
          insetInlineStart: 0,
          insetBlockStart: 0,
          inlineSize: '100%',
          transform: `translateY(${i * estimateSize}px)`,
        }}
      >
        {rendered}
      </div>,
    );
  }
  return (
    <div ref={parentRef} className="ag-combobox-vscroll" onScroll={onScroll} style={{ overflowY: 'auto' }}>
      <div style={{ blockSize: `${count * estimateSize}px`, position: 'relative' }}>{rows}</div>
    </div>
  );
}
