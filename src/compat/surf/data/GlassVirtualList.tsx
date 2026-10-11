/* GlassVirtualList — 4.x compat adapter (REQ-SURF-13, DEP-S0203) → the 5.0
   VirtualList that backs Table virtualization. items {id, height, component,
   props} render `component` with its props; itemHeight (or each item's
   height) seeds estimateSize; height bounds the scroll viewport;
   onEndReached / endThreshold / overscan map 1:1. The legacy
   items + renderItem(item, index) form is also accepted. */
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { VirtualList } from '../../../data/virtual-list/VirtualList';

export interface VirtualListItem {
  id: string;
  height?: number;
  component?: React.ElementType;
  props?: Record<string, unknown>;
}

export interface GlassVirtualListProps {
  items?: readonly (VirtualListItem | unknown)[];
  renderItem?: (item: unknown, index: number) => React.ReactNode;
  height?: number | string;
  itemHeight?: number;
  estimatedItemHeight?: number;
  overscan?: number;
  onEndReached?: () => void;
  endThreshold?: number;
  className?: string;
  'aria-label'?: string;
  [legacy: string]: unknown;
}

const isItem = (x: unknown): x is VirtualListItem => typeof x === 'object' && x !== null && 'id' in x;

/**
 * 4.x `GlassVirtualList` compat adapter (DEP-S0203).
 * @deprecated since 4.3.0, removed in 5.0.0. Use {@link Table virtualization primitives}.
 */
export function GlassVirtualList(props: GlassVirtualListProps) {
  warnDeprecated('DEP-S0203');
  const { items = [], renderItem, height = 400, itemHeight, estimatedItemHeight, overscan, onEndReached, endThreshold, className } = props;
  const fallback = itemHeight ?? estimatedItemHeight ?? 40;
  return (
    <VirtualList<unknown>
      items={items}
      getItemKey={(it, i) => (isItem(it) ? it.id : i)}
      estimateSize={(i) => {
        const it = items[i];
        return isItem(it) && typeof it.height === 'number' ? it.height : fallback;
      }}
      renderItem={(it, i) => {
        if (renderItem) return renderItem(it, i);
        if (isItem(it) && it.component) {
          const Comp = it.component;
          return <Comp {...(it.props ?? {})} />;
        }
        return null;
      }}
      style={{ height }}
      {...(overscan !== undefined ? { overscan } : {})}
      {...(onEndReached ? { onEndReached } : {})}
      {...(endThreshold !== undefined ? { endReachedThreshold: endThreshold } : {})}
      {...(props['aria-label'] ? { 'aria-label': props['aria-label'] } : {})}
      {...(className ? { className } : {})}
    />
  );
}
