/* REQ-CMP-17: masonry island — the only ImageList path that measures.
   Exactly one ResizeObserver reduces `cols` by container width. */
'use client';
import * as React from 'react';
import { cn } from '../../internal/index';
import type { ImageListProps } from './ImageList';

export function MasonryRoot({
  variant: _variant,
  cols = 3,
  minItemWidth = 160,
  gap,
  className,
  style,
  ref,
  ...rest
}: ImageListProps & { ref?: React.Ref<HTMLDivElement> | undefined }) {
  const [width, setWidth] = React.useState<number | null>(null);
  const hostRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    const node = hostRef.current;
    if (!node || typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect.width;
      if (typeof w === 'number') setWidth(w);
    });
    ro.observe(node);
    return () => ro.disconnect();
  }, []);

  const effectiveCols = width !== null
    ? Math.max(1, Math.min(cols, Math.floor(width / Math.max(1, minItemWidth))))
    : cols;

  const setRefs = (node: HTMLDivElement | null) => {
    hostRef.current = node;
    if (typeof ref === 'function') ref(node);
    else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
  };

  return (
    <div
      {...rest}
      ref={setRefs}
      data-ag-part="root"
      data-ag-variant="masonry"
      data-ag-cols={effectiveCols}
      data-ag-min-item={minItemWidth}
      className={cn('ag-image-list', 'ag-image-list-masonry', className)}
      style={{
        gap: typeof gap === 'number' ? `var(--ag-space-${gap})` : gap,
        columnCount: effectiveCols,
        ...style,
      }}
    />
  );
}
