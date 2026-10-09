'use client';
/* VirtualList<T> (I-1 / SURF-150/256, REQ-SURF-80): stream-internal
   virtualization on @tanstack/react-virtual. 0 rAF/intervals while idle —
   all measurement flows through the virtualizer; the scroll listener is the
   element's own onScroll. handle exposes scrollToIndex/scrollToKey +
   measureElement for consumers (Command >threshold, Table, TreeView). */
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
    ref,
    ...rest
  }: VirtualListProps<T> & { ref?: React.Ref<VirtualListHandle> },
) {
  const parentRef = React.useRef<HTMLDivElement | null>(null);
  const horizontal = orientation === 'horizontal';

  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize,
    overscan,
    horizontal,
    getItemKey: (i: number) => getItemKey(items[i] as T, i),
  } as Parameters<typeof useVirtualizer>[0]);

  // End-reached: measured against the scroll offset — runs on scroll events
  // only, no timer/rAF while idle (REQ-SURF-80).
  const endRef = React.useRef(onEndReached);
  endRef.current = onEndReached;
  const checkEnd = React.useCallback(() => {
    const el = parentRef.current;
    if (!el || !endRef.current) return;
    const remaining = horizontal
      ? el.scrollWidth - el.scrollLeft - el.clientWidth
      : el.scrollHeight - el.scrollTop - el.clientHeight;
    if (remaining <= endReachedThreshold) endRef.current();
  }, [horizontal, endReachedThreshold]);

  React.useEffect(() => {
    checkEnd();
  }, [checkEnd, items.length]);

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
      <div style={{ ...sizeStyle, position: 'relative' }}>
        {virtualItems.map((vi) => {
          const item = items[vi.index] as T;
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
                  ? { transform: `translateX(${vi.start}px)`, height: '100%' }
                  : { transform: `translateY(${vi.start}px)`, width: '100%' }),
              }}
            >
              {renderItem(item, vi.index)}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export const VirtualList = VirtualListInner as <T>(
  props: VirtualListProps<T> & { ref?: React.Ref<VirtualListHandle> },
) => React.ReactElement;
