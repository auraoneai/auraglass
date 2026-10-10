/* CMP-308/CMP-424: ImageList — Item + ItemBar. `cols` is a MAXIMUM reduced by
   container width via minItemWidth (default 160px); standard/quilted resolve
   via css grid (RSC-safe, no measurement). The masonry variant delegates to the
   ImageList.Masonry island — the only client boundary in this component.
   ItemBar chrome is thin and declares data-ag-backdrop="media". */
import * as React from 'react';
import { cn } from '../../internal/index';
import { MasonryRoot } from './ImageList.Masonry.client';

export interface ImageListProps extends React.HTMLAttributes<HTMLDivElement> {
  cols?: number;
  /** Minimum item width used to reduce cols; default 160px. */
  minItemWidth?: number;
  gap?: number | string;
  variant?: 'standard' | 'quilted' | 'masonry';
}

function Root({ variant = 'standard', ref, ...rest }: ImageListProps & { ref?: React.Ref<HTMLDivElement> | undefined }) {
  if (variant === 'masonry') return <MasonryRoot variant="masonry" ref={ref} {...rest} />;
  return <StandardRoot variant={variant} ref={ref} {...rest} />;
}

function StandardRoot({
  cols = 3,
  minItemWidth = 160,
  gap,
  variant,
  className,
  style,
  ref,
  ...rest
}: ImageListProps & { ref?: React.Ref<HTMLDivElement> | undefined }) {
  return (
    <div
      {...rest}
      ref={ref}
      data-ag-part="root"
      data-ag-variant={variant}
      data-ag-cols={cols}
      data-ag-min-item={minItemWidth}
      className={cn('ag-image-list', className)}
      style={{
        gap: typeof gap === 'number' ? `var(--ag-space-${gap})` : gap,
        gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
        ...style,
      }}
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
