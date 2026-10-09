/* CMP-308/CMP-424: masonry-only client island — exactly one ResizeObserver
   measures the viewport width and resolves columnCount. Everything else in
   ImageList is server-rendered (ImageList.tsx). */
'use client';
import * as React from 'react';
import { cn } from '../../internal/index';

export interface MasonryViewportProps extends React.HTMLAttributes<HTMLDivElement> {
  cols: number;
  minItemWidth: number;
  gap?: number | string;
}

export function MasonryViewport({
  cols,
  minItemWidth,
  gap,
  className,
  style,
  ref,
  children,
  ...rest
}: MasonryViewportProps & { ref?: React.Ref<HTMLDivElement> | undefined }) {
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

  const styleObj: React.CSSProperties = {
    gap: typeof gap === 'number' ? `var(--ag-space-${gap})` : gap,
    columnCount: effectiveCols,
    ...style,
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
      style={styleObj}
    >
      {children}
    </div>
  );
}
