/* CMP-298 + REQ-CMP-112: Grid — T0 server layout. `columns` is a number or a
   responsive {base,sm,md,lg} object. Responsive columns render a container
   shell (`container-type: inline-size`) around the grid and set
   --ag-grid-cols-{base,sm,md,lg} inline vars; Grid.css's unnamed @container
   rules pick the nearest breakpoint ≤ shell width (480/768/1024px), so a
   Grid responds even with no Container ancestor. `masonry` (or
   variant='masonry') renders real grid masonry under @supports, falling
   back to CSS columns (GlassMasonry absorbed). gap takes a SpaceToken index,
   a number (→ --ag-space-N), or a raw CSS length. */
import * as React from 'react';
import { cn } from '../../internal/index';

/* SpaceToken equivalent — duplicated here because auraglass/contract-boundary
   forbids importing src/contracts/* from src/components (the union must stay
   in sync with contracts/tokens.ts SpaceToken). */
export type SpaceTokenLike = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '8' | '10' | '12' | '16' | number | (string & {});

export interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  columns?: number | { base?: number; sm?: number; md?: number; lg?: number };
  /** When set, columns auto-fill at this minimum item width. */
  minItemWidth?: number | string;
  /** SpaceToken index, a number (→ var(--ag-space-N)), or a raw CSS length. */
  gap?: SpaceTokenLike;
  /** 'standard' grid or 'masonry' (grid-rows masonry @supports → columns). */
  variant?: 'standard' | 'masonry';
  /** Shortcut for `variant="masonry"`. */
  masonry?: boolean;
}

function gapValue(gap: NonNullable<GridProps['gap']>): string {
  return typeof gap === 'number' || /^\d+$/.test(gap) ? `var(--ag-space-${gap})` : gap;
}

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
}: GridProps & { ref?: React.Ref<HTMLDivElement> | undefined }) {
  const isMasonry = masonry === true || variant === 'masonry';
  const styleObj: React.CSSProperties = { ...style };
  if (gap !== undefined) styleObj.gap = gapValue(gap);

  if (isMasonry) {
    const n = typeof columns === 'number' ? columns : (columns.base ?? 1);
    (styleObj as Record<string, unknown>)['--ag-grid-cols'] = n;
    if (typeof columns === 'number') styleObj.columnCount = columns;
    if (minItemWidth) styleObj.columnWidth = typeof minItemWidth === 'number' ? `${minItemWidth}px` : minItemWidth;
    return (
      <div
        {...rest}
        ref={ref}
        data-ag-part="root"
        data-ag-variant="masonry"
        className={cn('ag-grid', 'ag-grid-masonry', className)}
        style={styleObj}
      />
    );
  }

  if (typeof columns === 'object') {
    const v = styleObj as Record<string, unknown>;
    if (minItemWidth) v['--ag-grid-min-item'] = typeof minItemWidth === 'number' ? `${minItemWidth}px` : minItemWidth;
    v['--ag-grid-cols-base'] = columns.base ?? 1;
    if (columns.sm !== undefined) v['--ag-grid-cols-sm'] = columns.sm;
    if (columns.md !== undefined) v['--ag-grid-cols-md'] = columns.md;
    if (columns.lg !== undefined) v['--ag-grid-cols-lg'] = columns.lg;
    return (
      <div className="ag-grid-shell" data-ag-part="shell">
        <div
          {...rest}
          ref={ref}
          data-ag-part="root"
          data-ag-variant="standard"
          data-ag-cols-base={columns.base ?? 1}
          data-ag-cols-sm={columns.sm}
          data-ag-cols-md={columns.md}
          data-ag-cols-lg={columns.lg}
          data-ag-min-item={minItemWidth ? '' : undefined}
          className={cn('ag-grid', 'ag-grid-responsive', className)}
          style={styleObj}
        />
      </div>
    );
  }

  if (typeof columns === 'number') {
    (styleObj as Record<string, unknown>)['--ag-grid-cols'] = columns;
    if (minItemWidth) (styleObj as Record<string, unknown>)['--ag-grid-min-item'] = `${minItemWidth}px`;
  }
  return (
    <div
      {...rest}
      ref={ref}
      data-ag-part="root"
      data-ag-variant="standard"
      data-ag-cols={columns}
      data-ag-min-item={minItemWidth ? '' : undefined}
      className={cn('ag-grid', className)}
      style={styleObj}
    />
  );
}
