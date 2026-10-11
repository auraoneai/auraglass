'use client';
/* VirtualList<T> (I-1 / SURF-150/256, REQ-SURF-80): stream-internal
   virtualization on @tanstack/react-virtual. 0 rAF/intervals while idle —
   all measurement flows through the virtualizer; the scroll listener is the
   element's own onScroll. handle exposes scrollToIndex/scrollToKey +
   measureElement for consumers (Command >threshold, Table, TreeView).
   REQ-SURF-109: `getScrollElement` hands the scrolling to an ancestor (Thread's
   role=log) — the list then renders no overflow container of its own. */
import * as React from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';

export interface VirtualListHandle {
  scrollToIndex: (index: number, options?: { align?: 'start' | 'center' | 'end' | 'auto' | undefined }) => void;
  scrollToKey: (key: React.Key, options?: { align?: 'start' | 'center' | 'end' | 'auto' | undefined }) => void;
  measureElement: (el: Element | null) => void;
  scrollToOffset: (offset: number) => void;
}

export type VirtualListProps<T> = {
  items: readonly T[];
  getItemKey: (item: T, index: number) => React.Key;
  renderItem: (item: T, index: number) => React.ReactNode;
  /** Estimated item size in px before measurement. */
  estimateSize: (index: number) => number;
  overscan?: number | undefined;
  orientation?: 'vertical' | 'horizontal' | undefined;
  /** 'end' keeps the viewport pinned to the last item while items append. */
  anchor?: 'start' | 'end' | undefined;
  onEndReached?: (() => void) | undefined;
  /** Distance in px from the list end that triggers onEndReached. */
  endReachedThreshold?: number | undefined;
  role?: 'list' | 'log' | 'listbox' | undefined;
  itemRole?: string | undefined;
  /** Fires with the count of rendered items when it changes (tests/metrics). */
  onRangeChange?: ((range: { startIndex: number; endIndex: number }) => void) | undefined;
  className?: string | undefined;
  'aria-label'?: string | undefined;
  'aria-labelledby'?: string | undefined;
  style?: React.CSSProperties | undefined;
  /**
   * External scroll container (REQ-SURF-109). When set, VirtualList renders no
   * scroller of its own (no `overflow`): the returned ancestor scrolls and the
   * list measures its offset inside it as the virtualizer's scroll margin.
   */
  getScrollElement?: (() => HTMLElement | null) | undefined;
};

function VirtualListInner<T>(
  {
    items,
    getItemKey,
    renderItem,
    estimateSize,
    overscan = 6,
    orientation = 'vertical',
    anchor = 'start',
    onEndReached,
    endReachedThreshold = 200,
    role = 'list',
    itemRole,
    onRangeChange,
    className,
    style,
    getScrollElement: externalScrollElement,
    ...rest
  }: VirtualListProps<T>,
  ref: React.ForwardedRef<VirtualListHandle>,
) {
  const parentRef = React.useRef<HTMLDivElement | null>(null);
  const innerRef = React.useRef<HTMLDivElement | null>(null);
  const horizontal = orientation === 'horizontal';
  const external = externalScrollElement !== undefined;
  const externalRef = React.useRef(externalScrollElement);
  externalRef.current = externalScrollElement;
  const scrollEl = React.useCallback(
    (): HTMLElement | null => (externalRef.current ? externalRef.current() : parentRef.current),
    [],
  );

  // An ancestor's ref attaches after this component's layout effects, so on
  // the first commit an external scroll element is still null; re-render
  // once it is attached so the virtualizer picks it up.
  const [attached, setAttached] = React.useState(false);
  React.useEffect(() => {
    if (external && !attached && scrollEl()) setAttached(true);
  }, [external, attached, scrollEl]);

  // External scroller: the list starts `scrollMargin` px into it (content
  // above it, e.g. Thread's top sentinel). Measured after commit.
  const [scrollMargin, setScrollMargin] = React.useState(0);
  React.useLayoutEffect(() => {
    if (!external) return;
    const el = scrollEl();
    const inner = innerRef.current;
    if (!el || !inner) return;
    const a = inner.getBoundingClientRect();
    const b = el.getBoundingClientRect();
    const m = horizontal ? a.left - b.left + el.scrollLeft : a.top - b.top + el.scrollTop;
    setScrollMargin((prev) => (Math.abs(prev - m) < 0.5 ? prev : m));
  }, [external, horizontal, scrollEl, items.length, attached]);

  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: scrollEl,
    scrollMargin: external ? scrollMargin : 0,
    estimateSize,
    overscan,
    horizontal,
    getItemKey: (i: number) => getItemKey(items[i] as T, i),
  } as Parameters<typeof useVirtualizer>[0]);

  // End-reached: measured against the scroll offset — runs on scroll events
  // only, no timer/rAF while idle. REQ-SURF-80: latched — fires once per
  // crossing; re-arms when the user scrolls back above the threshold or the
  // item count grows (new tail to reach).
  const endRef = React.useRef(onEndReached);
  endRef.current = onEndReached;
  const endLatched = React.useRef(false);
  const lastLen = React.useRef(items.length);
  const checkEnd = React.useCallback(() => {
    const el = scrollEl();
    if (!el || !endRef.current) return;
    const remaining = horizontal
      ? el.scrollWidth - el.scrollLeft - el.clientWidth
      : el.scrollHeight - el.scrollTop - el.clientHeight;
    if (items.length > lastLen.current) endLatched.current = false;
    if (remaining > endReachedThreshold) {
      endLatched.current = false;
      return;
    }
    if (!endLatched.current) {
      endLatched.current = true;
      endRef.current();
    }
  }, [horizontal, endReachedThreshold, items.length, scrollEl]);

  React.useEffect(() => {
    lastLen.current = items.length;
    checkEnd();
  }, [checkEnd, items.length]);

  // External scroller: listen on it (an event listener, not a timer).
  React.useEffect(() => {
    if (!external) return;
    const el = scrollEl();
    if (!el) return;
    el.addEventListener('scroll', checkEnd, { passive: true });
    return () => el.removeEventListener('scroll', checkEnd);
  }, [external, scrollEl, checkEnd]);

  // anchor='end': pin to the last item whenever the count grows.
  const lastCount = React.useRef(items.length);
  React.useEffect(() => {
    if (anchor === 'end' && items.length > lastCount.current) {
      virtualizer.scrollToIndex(items.length - 1, { align: 'end' });
    }
    lastCount.current = items.length;
  }, [anchor, items.length, virtualizer]);

  const rangeRef = React.useRef(onRangeChange);
  rangeRef.current = onRangeChange;
  const virtualItems = virtualizer.getVirtualItems();
  const rangeKey =
    virtualItems.length > 0
      ? `${virtualItems[0]!.index}:${virtualItems[virtualItems.length - 1]!.index}`
      : '';
  React.useEffect(() => {
    if (!rangeKey || !rangeRef.current) return;
    const [startIndex, endIndex] = rangeKey.split(':').map(Number);
    rangeRef.current({ startIndex: startIndex!, endIndex: endIndex! });
  }, [rangeKey]);

  React.useImperativeHandle(
    ref,
    (): VirtualListHandle => ({
      scrollToIndex: (index, options) =>
        virtualizer.scrollToIndex(index, options !== undefined && options.align !== undefined ? { align: options.align } : {}),
      scrollToKey: (key, options) => {
        const index = items.findIndex((item, i) => getItemKey(item, i) === key);
        if (index >= 0)
          virtualizer.scrollToIndex(index, options !== undefined && options.align !== undefined ? { align: options.align } : {});
      },
      measureElement: (el) => {
        if (el) virtualizer.measureElement(el);
      },
      scrollToOffset: (offset) => virtualizer.scrollToOffset(offset),
    }),
    [virtualizer, items, getItemKey],
  );

  const totalSize = virtualizer.getTotalSize();
  const sizeStyle: React.CSSProperties = horizontal
    ? { width: `${totalSize}px`, height: '100%' }
    : { height: `${totalSize}px`, width: '100%' };

  const offset = external ? scrollMargin : 0;
  const rows = virtualItems.map((vi) => {
    const item = items[vi.index] as T;
    const start = vi.start - offset;
    return (
      <div
        key={vi.key}
        data-index={vi.index}
        ref={virtualizer.measureElement}
        {...(itemRole !== undefined ? { role: itemRole } : {})}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          ...(horizontal
            ? { transform: `translateX(${start}px)`, height: '100%' }
            : { transform: `translateY(${start}px)`, width: '100%' }),
        }}
      >
        {renderItem(item, vi.index)}
      </div>
    );
  });

  if (external) {
    return (
      <div
        ref={innerRef}
        role={role}
        className={className}
        style={{ ...sizeStyle, position: 'relative', ...style }}
        {...rest}
      >
        {rows}
      </div>
    );
  }

  return (
    <div
      ref={parentRef}
      role={role}
      className={className}
      onScroll={checkEnd}
      style={{
        overflow: 'auto',
        contain: 'strict',
        ...style,
      }}
      {...rest}
    >
      <div style={{ ...sizeStyle, position: 'relative' }}>{rows}</div>
    </div>
  );
}

export const VirtualList = React.forwardRef(VirtualListInner) as <T>(
  props: VirtualListProps<T> & { ref?: React.ForwardedRef<VirtualListHandle> },
) => React.ReactElement;
