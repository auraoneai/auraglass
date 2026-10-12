/* CMP-308/CMP-424: ImageList — server-first. `cols` is a MAXIMUM reduced by
   container width via minItemWidth (default 160px); standard/quilted resolve
   via css grid. `items` is the flat API — each row renders Item + optional
   ItemBar (chrome-thin, data-ag-backdrop="media"). The masonry path renders
   through the client MasonryViewport island (one ResizeObserver). */
import * as React from 'react';
import { cn } from '../../internal/index';
import { materialProps } from '../../material/index';
import { MasonryRoot as MasonryViewport } from './ImageList.Masonry.client';

const CHROME_THIN = materialProps({ layer: 'chrome', thickness: 'thin' });

export interface ImageListItem {
  src: string;
  alt: string;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  actions?: React.ReactNode;
}

export interface ImageListProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** Number of columns. */
  cols?: number;
  /** Minimum item width used to reduce cols; default 160px. */
  minItemWidth?: number;
  /** Gap between items (number in CSS pixels, or a CSS length). */
  gap?: number | string;
  /** Layout: uniform grid, quilted (items span cells) or masonry. */
  variant?: 'standard' | 'quilted' | 'masonry';
  /** Flat API — renders Item/ItemBar parts per row. */
  items?: readonly ImageListItem[];
}

const MIN_ITEM_DEFAULT = 160;

function Root({
  cols = 3,
  minItemWidth = MIN_ITEM_DEFAULT,
  gap,
  variant = 'standard',
  items,
  className,
  style,
  ref,
  children,
  ...rest
}: ImageListProps & {
  /** Ref to the rendered root element. */
  ref?: React.Ref<HTMLDivElement> | undefined }) {
  const body = items
    ? items.map((item, i) => (
        <Item key={`${item.src}-${i}`}>
          <img data-ag-part="item-img" src={item.src} alt={item.alt} className="ag-image-list-img" />
          {item.title || item.subtitle || item.actions ? (
            <ItemBar title={item.title} subtitle={item.subtitle} actionIcon={item.actions} />
          ) : null}
        </Item>
      ))
    : children;

  if (variant === 'masonry') {
    return (
      <MasonryViewport
        {...rest}
        ref={ref}
        cols={cols}
        minItemWidth={minItemWidth}
        {...(gap !== undefined ? { gap } : {})}
        {...(className !== undefined ? { className } : {})}
        {...(style !== undefined ? { style } : {})}
      >
        {body}
      </MasonryViewport>
    );
  }

  const styleObj: React.CSSProperties = {
    gap: typeof gap === 'number' ? `var(--ag-space-${gap})` : gap,
    gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
    ...style,
  };

  return (
    <div
      {...rest}
      ref={ref}
      data-ag-part="root"
      data-ag-appearance={variant}
      data-cols={cols}
      data-min-item={minItemWidth}
      className={cn('ag-image-list', className)}
      style={styleObj}
    >
      {body}
    </div>
  );
}

export function Item({
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

export function ItemBar({
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
      {...CHROME_THIN}
      ref={ref}
      data-ag-part="item-bar"
      data-ag-backdrop="media"
      data-position={position}
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
