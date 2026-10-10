'use client';

/* CMP-185 (REQ-CMP-72): owned windowed list for >200-item Combobox — no
   tanstack import (not in CMP's allowlisted importers; CC-CMP-06 stays a
   fallback). One scrollTop ref + one subscribeFrame recomputes the render
   window (overscan 5). Each row keeps aria-setsize = total and
   aria-posinset = 1-based index; DOM option count <= visible + 2*overscan. */
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
  children: (item: Item, index: number) => React.ReactNode;
}

export function ComboboxVirtualList<Item>({ items, estimateSize = 32, children }: ComboboxVirtualListProps<Item>) {
  const parentRef = React.useRef<HTMLDivElement>(null);
  const scrollTopRef = React.useRef(0);
  const viewRef = React.useRef(DEFAULT_VIEWPORT_PX);
  /* The render window is state, not a ref: render must not read ref.current
     (REQ-CMP-24, React Compiler 'Refs' rule). The functional update returns
     the previous object when the window is unchanged, so a frame with no
     scroll movement schedules no re-render. */
  const [range, setRange] = React.useState({ start: 0, end: 0 });

  const recompute = React.useCallback(() => {
    const n = items.length;
    const visible = Math.ceil(viewRef.current / estimateSize);
    const start = Math.max(0, Math.floor(scrollTopRef.current / estimateSize) - VIRTUAL_OVERSCAN);
    const end = Math.min(n, start + visible + 2 * VIRTUAL_OVERSCAN);
    setRange((prev) => (prev.start === start && prev.end === end ? prev : { start, end }));
  }, [items.length, estimateSize]);

  React.useEffect(() => {
    const el = parentRef.current;
    if (el && el.clientHeight > 0) viewRef.current = el.clientHeight;
    recompute();
    return subscribeFrame(recompute);
  }, [recompute]);

  const onScroll = React.useCallback((e: React.UIEvent<HTMLDivElement>) => {
    scrollTopRef.current = e.currentTarget.scrollTop;
  }, []);

  const { start, end } = range;
  const rows: React.ReactNode[] = [];
  for (let i = start; i < end; i++) {
    const item = items[i] as Item;
    const node = children(item, i);
    const rendered = React.isValidElement(node)
      ? React.cloneElement(node as React.ReactElement<Record<string, unknown>>, {
          index: i,
          'aria-setsize': items.length,
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
    <div ref={parentRef} className="ag-combobox-vscroll" onScroll={onScroll} style={{ overflowY: 'auto', maxBlockSize: 'inherit' }}>
      <div style={{ blockSize: `${items.length * estimateSize}px`, position: 'relative' }}>{rows}</div>
    </div>
  );
}
