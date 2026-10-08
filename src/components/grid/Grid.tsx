/* CMP-298: Grid — T0 server layout. `columns` is a number or a responsive
   {base,sm,md,lg} object resolved against the 480/768/1024px container
   breakpoints (nearest breakpoint ≤ container width wins; css declares the
   container-query classes). `minItemWidth` switches to auto-fill sizing;
   `masonry` renders the CSS-columns variant (GlassMasonry absorbed). */
import * as React from 'react';
import { cn } from '../../internal/index';

export interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  columns?: number | { base?: number; sm?: number; md?: number; lg?: number };
  /** When set, columns auto-fill at this minimum item width. */
  minItemWidth?: number | string;
  gap?: number | string;
  /** 'standard' grid or 'masonry' (CSS columns). */
  variant?: 'standard' | 'masonry';
}

export function Grid({
  columns = 1,
  minItemWidth,
  gap,
  variant = 'standard',
  className,
  style,
  ref,
  ...rest
}: GridProps & { ref?: React.Ref<HTMLDivElement> | undefined }) {
  const styleObj: React.CSSProperties = { ...style };
  if (typeof gap === 'number') styleObj.gap = `var(--ag-space-${gap})`;
  else if (gap) styleObj.gap = gap;

  if (variant === 'masonry') {
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

  if (typeof columns === 'number') {
    styleObj.display = 'grid';
    styleObj.gridTemplateColumns = minItemWidth
      ? `repeat(auto-fill, minmax(${typeof minItemWidth === 'number' ? `${minItemWidth}px` : minItemWidth}, 1fr))`
      : `repeat(${columns}, minmax(0, 1fr))`;
  }
  const responsive = typeof columns === 'object' ? columns : undefined;
  return (
    <div
      {...rest}
      ref={ref}
      data-ag-part="root"
      data-ag-variant="standard"
      data-ag-cols={typeof columns === 'number' ? columns : undefined}
      data-ag-cols-base={responsive?.base}
      data-ag-cols-sm={responsive?.sm}
      data-ag-cols-md={responsive?.md}
      data-ag-cols-lg={responsive?.lg}
      data-ag-min-item={minItemWidth ? '' : undefined}
      className={cn('ag-grid', className)}
      style={styleObj}
    />
  );
}
