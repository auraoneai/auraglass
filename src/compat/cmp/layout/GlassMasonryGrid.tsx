/* CMP-112 compat: GlassMasonryGrid (4.x) -> Grid masonry (5.0).
   warnDeprecated fires at call time, once per page load per symbol;
   unmappable props drop with a single warning; never throws.
   Mapping: items -> one child per item in source order (item.content, keyed
   by id; item.height -> min-block-size); config.columns number -> columns,
   'auto' -> minItemWidth = config.minItemWidth (4.x default 200); config.gap
   (px) -> gap; maxHeight -> max-block-size with overflow auto; className.
   Dropped (no 5.0 equivalent; compose them around Grid): showControls,
   showFilters, showStats, enableVirtualization, enableInfiniteScroll,
   enableDragReorder, enableSearch, filterBy, sortBy, sortOrder,
   loadingItems, onItemClick, onItemsReorder, onLoadMore, onFilterChange,
   compact, contained, and the other config keys. */
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { Grid } from '../../../components/grid/Grid';

const DEP = 'DEP-C0272';
const drop = (p: string) => warnDeprecated(`${DEP}.prop.${p}`);

export interface MasonryItem {
  id: string;
  content: React.ReactNode;
  height?: number;
  aspectRatio?: number;
  priority?: number;
  category?: string;
  metadata?: Record<string, unknown>;
}

export interface MasonryConfig {
  columns: number | 'auto';
  gap: number;
  minItemWidth: number;
  maxItemWidth?: number;
  itemPadding: number;
  autoResize: boolean;
  animationDelay: number;
  breakpoints: { [key: number]: number };
}

export interface GlassMasonryGridProps {
  items: MasonryItem[];
  config?: Partial<MasonryConfig>;
  showControls?: boolean;
  showFilters?: boolean;
  showStats?: boolean;
  enableVirtualization?: boolean;
  enableInfiniteScroll?: boolean;
  enableDragReorder?: boolean;
  enableSearch?: boolean;
  filterBy?: string;
  sortBy?: 'id' | 'height' | 'priority' | 'category';
  sortOrder?: 'asc' | 'desc';
  loadingItems?: number;
  onItemClick?: (item: MasonryItem, index: number) => void;
  onItemsReorder?: (items: MasonryItem[]) => void;
  onLoadMore?: () => void;
  onFilterChange?: (filter: string) => void;
  compact?: boolean;
  contained?: boolean;
  maxHeight?: number | string;
  className?: string;
}

const DROPPED = [
  'showControls', 'showFilters', 'showStats', 'enableVirtualization', 'enableInfiniteScroll',
  'enableDragReorder', 'enableSearch', 'filterBy', 'sortBy', 'sortOrder', 'loadingItems',
  'onItemClick', 'onItemsReorder', 'onLoadMore', 'onFilterChange', 'compact', 'contained',
] as const;
const DROPPED_CONFIG = ['maxItemWidth', 'itemPadding', 'autoResize', 'animationDelay', 'breakpoints'] as const;

/** @deprecated since 4.3.0, removed in 6.0.0. Use {@link Grid}. */
export function GlassMasonryGrid(props: GlassMasonryGridProps & { ref?: React.Ref<HTMLDivElement> | undefined }) {
  const { items, config = {}, maxHeight, className, ref } = props;
  warnDeprecated(DEP);
  for (const p of DROPPED) if (props[p] !== undefined) drop(p);
  for (const k of DROPPED_CONFIG) if (config[k] !== undefined) drop(`config.${k}`);

  const columns = config.columns ?? 'auto';
  const style: React.CSSProperties = {};
  if (maxHeight !== undefined) {
    style.maxBlockSize = typeof maxHeight === 'number' ? `${maxHeight}px` : maxHeight;
    style.overflow = 'auto';
  }
  return (
    <Grid
      ref={ref}
      masonry
      {...(columns === 'auto' ? { minItemWidth: config.minItemWidth ?? 200 } : { columns })}
      gap={`${config.gap ?? 16}px`}
      {...(className !== undefined ? { className } : {})}
      style={style}
    >
      {items.map((item) => (
        <div key={item.id} {...(item.height !== undefined ? { style: { minBlockSize: `${item.height}px` } } : {})}>
          {item.content}
        </div>
      ))}
    </Grid>
  );
}
