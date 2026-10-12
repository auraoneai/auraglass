/* CMP-298 + REQ-CMP-112: Grid — T0 server layout.
   - `columns` number: one element; Grid.css reads --_ag-grid-cols.
   - `columns` {base,sm,md,lg}: Grid renders its own container shell
     (`.ag-grid-shell`, data-ag-part="shell", container-type inline-size) around
     the grid element and sets --_ag-grid-cols-{base,sm,md,lg} inline. Grid.css's
     unnamed @container rules at 480/768/1024px pick the nearest breakpoint
     <= the shell width, so a Grid responds with or without a Container
     ancestor. ref, className and the rest props stay on the grid element
     (data-ag-part="root").
   - `minItemWidth`: auto-fill columns at that floor (--_ag-grid-min-item).
   - `masonry` (or variant="masonry"): `grid-template-rows: masonry` under
     @supports, otherwise a CSS-columns fallback. Both keep DOM order, so Tab
     order equals source order (GlassMasonry/GlassMasonryGrid absorbed).
   - `gap`: SpaceToken index, or a raw CSS length. */
import * as React from 'react';
import { cn } from '../../internal/index';
import { spaceGap } from '../stack/Stack';
import type { SpaceTokenLike } from '../stack/Stack';

export type GridColumns = number | { base?: number; sm?: number; md?: number; lg?: number };

export interface GridProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** Column count, or a responsive map of column counts. */
  columns?: GridColumns;
  /** When set, columns auto-fill at this minimum item width. */
  minItemWidth?: number | string;
  /** SpaceToken index (→ var(--ag-space-N)) or a raw CSS length. */
  gap?: SpaceTokenLike;
  /** 'standard' grid or 'masonry'. */
  variant?: 'standard' | 'masonry';
  /** Shortcut for `variant="masonry"`. */
  masonry?: boolean;
}

type VarStyle = React.CSSProperties & Record<`--_ag-${string}`, string | number>;

const len = (v: number | string): string => (typeof v === 'number' ? `${v}px` : v);

export function Grid({
  columns = 1,
  minItemWidth,
  gap,
  variant,
  masonry,
  className,
  style,
  ref,
  ...rest
}: GridProps & {
  /** Ref to the rendered root element. */
  ref?: React.Ref<HTMLDivElement> | undefined }) {
  const styleObj: VarStyle = { ...style };
  if (gap !== undefined) styleObj.gap = spaceGap(gap);
  if (minItemWidth !== undefined) styleObj['--_ag-grid-min-item'] = len(minItemWidth);

  if (masonry === true || variant === 'masonry') {
    // minItemWidth wins over a fixed count (auto-fill tracks / column-width).
    if (minItemWidth === undefined) {
      styleObj['--_ag-grid-cols'] = typeof columns === 'number' ? columns : (columns.base ?? 1);
    }
    return (
      <div
        {...rest}
        ref={ref}
        data-ag-part="root"
        data-ag-appearance="masonry"
        data-min-item={minItemWidth !== undefined ? '' : undefined}
        className={cn('ag-grid', 'ag-grid-masonry', className)}
        style={styleObj}
      />
    );
  }

  if (typeof columns === 'object') {
    styleObj['--_ag-grid-cols-base'] = columns.base ?? 1;
    if (columns.sm !== undefined) styleObj['--_ag-grid-cols-sm'] = columns.sm;
    if (columns.md !== undefined) styleObj['--_ag-grid-cols-md'] = columns.md;
    if (columns.lg !== undefined) styleObj['--_ag-grid-cols-lg'] = columns.lg;
    return (
      <div className="ag-grid-shell" data-ag-part="shell">
        <div
          {...rest}
          ref={ref}
          data-ag-part="root"
          data-ag-appearance="standard"
          data-cols-base={columns.base ?? 1}
          data-cols-sm={columns.sm}
          data-cols-md={columns.md}
          data-cols-lg={columns.lg}
          data-min-item={minItemWidth !== undefined ? '' : undefined}
          className={cn('ag-grid', className)}
          style={styleObj}
        />
      </div>
    );
  }

  styleObj['--_ag-grid-cols'] = columns;
  return (
    <div
      {...rest}
      ref={ref}
      data-ag-part="root"
      data-ag-appearance="standard"
      data-cols={columns}
      data-min-item={minItemWidth !== undefined ? '' : undefined}
      className={cn('ag-grid', className)}
      style={styleObj}
    />
  );
}
