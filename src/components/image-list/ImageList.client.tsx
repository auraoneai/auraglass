/* CMP-308/CMP-424: ImageList — Item + ItemBar. `cols` is a MAXIMUM reduced by
   container width via minItemWidth (default 160px) using exactly one
   ResizeObserver on the masonry variant only; standard/quilted resolve via css.
   ItemBar chrome is thin and declares data-ag-backdrop="media". */
'use client';
import * as React from 'react';
import { cn } from '../../internal/index';

export interface ImageListProps extends React.HTMLAttributes<HTMLDivElement> {
  cols?: number;
  /** Minimum item width used to reduce cols; default 160px. */
  minItemWidth?: number;
  gap?: number | string;
  variant?: 'standard' | 'quilted' | 'masonry';
}

const MIN_ITEM_DEFAULT = 160;

function Root({
  cols = 3,
  minItemWidth = MIN_ITEM_DEFAULT,
  gap,
  variant = 'standard',
  className,
  style,
  ref,
  ...rest
}: ImageListProps & { ref?: React.Ref<HTMLDivElement> | undefined }) {
  const [width, setWidth] = React.useState<number | null>(null);
  const hostRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    if (variant !== 'masonry') return;
    const node = hostRef.current;
    if (!node || typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect.width;
      if (typeof w === 'number') setWidth(w);
    });
    ro.observe(node);
    return () => ro.disconnect();
  }, [variant]);

  const effectiveCols = variant === 'masonry' && width !== null
    ? Math.max(1, Math.min(cols, Math.floor(width / Math.max(1, minItemWidth))))
    : cols;

  const setRefs = (node: HTMLDivElement | null) => {
    hostRef.current = node;
    if (typeof ref === 'function') ref(node);
    else if (ref) (ref as React.RefObject<HTMLDivElement | null>).current = node;
  };

  const styleObj: React.CSSProperties = {
    gap: typeof gap === 'number' ? `var(--ag-space-${gap})` : gap,
    ...(variant === 'masonry' ? { columnCount: effectiveCols } : { gridTemplateColumns: `repeat(${effectiveCols}, minmax(0, 1fr))` }),
    ...style,
  };

  return (
    <div
      {...rest}
      ref={setRefs}
      data-ag-part="root"
      data-ag-variant={variant}
      data-ag-cols={effectiveCols}
      data-ag-min-item={minItemWidth}
      className={cn('ag-image-list', variant === 'masonry' ? 'ag-image-list-masonry' : undefined, className)}
      style={styleObj}
    />
  );
}

function Item({
  className,
  ref,
  ...rest
}: React.HTMLAttributes<HTMLDivElement> & { ref?: React.Ref<HTMLDivElement> | undefined }) {
  return <div {...rest} ref={ref} data-ag-part="item" className={cn('ag-image-list-item', className)} />;
}

export interface ItemBarProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  actionIcon?: React.ReactNode;
  position?: 'bottom' | 'top' | 'overlay';
}

function ItemBar({
  title,
  subtitle,
  actionIcon,
  position = 'bottom',
  className,
  ref,
  ...rest
}: ItemBarProps & { ref?: React.Ref<HTMLDivElement> | undefined }) {
  return (
    <div
      {...rest}
      ref={ref}
      data-ag-part="item-bar"
      data-ag-backdrop="media"
      data-ag-position={position}
      className={cn('ag-image-list-bar', className)}
    >
      <span data-ag-part="item-bar-text" className="ag-image-list-bar-text">
        {title ? <span data-ag-part="item-bar-title">{title}</span> : null}
        {subtitle ? <span data-ag-part="item-bar-subtitle">{subtitle}</span> : null}
      </span>
      {actionIcon ? (
        <span data-ag-part="item-bar-action" className="ag-image-list-bar-action">
          {actionIcon}
        </span>
      ) : null}
    </div>
  );
}

export const ImageList = Object.assign(Root, { Item, ItemBar });
