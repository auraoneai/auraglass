/* CMP-307: Skeleton — aria-hidden placeholder (absorbs GlassLoadingSkeleton).
   shape text|rect|circle; `lines` renders that many text-line bars; the shimmer
   animation lives in css only under (prefers-reduced-motion: no-preference). */
import * as React from 'react';
import { cn } from '../../internal/index';
import { materialProps } from '../../material/index';

const SUNKEN = materialProps({ layer: 'content', content: 'content-sunken' });

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  shape?: 'text' | 'rect' | 'circle';
  /** Number of text lines (shape='text' only); default 1. */
  lines?: number;
}

export function Skeleton({
  shape = 'text',
  lines = 1,
  className,
  style,
  ref,
  ...rest
}: SkeletonProps & { ref?: React.Ref<HTMLDivElement> | undefined }) {
  if (shape === 'text' && lines > 1) {
    return (
      <div {...rest} {...SUNKEN} ref={ref} data-ag-part="root" data-ag-shape="text" aria-hidden="true" className={cn('ag-skeleton', 'ag-skeleton-lines', SUNKEN.className, className)} style={style}>
        {Array.from({ length: lines }, (_, i) => (
          <span key={i} data-ag-part="line" className="ag-skeleton-line" />
        ))}
      </div>
    );
  }
  return (
    <div
      {...rest}
      {...SUNKEN}
      ref={ref}
      data-ag-part="root"
      data-ag-shape={shape}
      aria-hidden="true"
      className={cn('ag-skeleton', SUNKEN.className, className)}
      style={style}
    />
  );
}
