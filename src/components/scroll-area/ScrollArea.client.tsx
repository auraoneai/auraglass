/* CMP-315: ScrollArea on BU ScrollArea. The viewport is tabIndex=0 only while
   content overflows (keyboard scrolling needs a focusable region only then);
   implemented as a ref callback that returns the ResizeObserver cleanup.
   parts [root, viewport, scrollbar, thumb]. */
'use client';
import * as React from 'react';
import { ScrollArea as BaseScrollArea } from '@base-ui/react/scroll-area';
import { cn } from '../../internal/index';

/* REQ-CMP-01: AuraGlass-owned part props (no Base UI types in the d.ts). */
interface ScrollAreaPartProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'className'> {
  className?: string;
  ref?: React.Ref<HTMLDivElement> | undefined;
}
export type ScrollAreaRootProps = ScrollAreaPartProps;
export type ScrollAreaViewportProps = ScrollAreaPartProps;
export interface ScrollAreaScrollbarProps extends ScrollAreaPartProps {
  orientation?: 'vertical' | 'horizontal';
  /** Keep the scrollbar mounted when content does not overflow. */
  keepMounted?: boolean;
}
export type ScrollAreaThumbProps = ScrollAreaPartProps;

function Root({ className, ref, ...rest }: ScrollAreaRootProps) {
  return <BaseScrollArea.Root {...rest} ref={ref} data-ag-part="root" className={cn('ag-scroll-area', className)} />;
}

function Viewport({
  className,
  ref,
  ...rest
}: ScrollAreaViewportProps) {
  const callbackRef = React.useCallback(
    (node: HTMLDivElement | null) => {
      if (typeof ref === 'function') ref(node);
      else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
      if (!node) return;
      const update = () => {
        const overflowing = node.scrollHeight > node.clientHeight + 1 || node.scrollWidth > node.clientWidth + 1;
        if (overflowing) node.setAttribute('tabindex', '0');
        else node.removeAttribute('tabindex');
      };
      update();
      if (typeof ResizeObserver === 'undefined') return;
      const ro = new ResizeObserver(update);
      ro.observe(node);
      for (const child of Array.from(node.children)) ro.observe(child);
      return () => ro.disconnect();
    },
    [ref],
  );
  return (
    <BaseScrollArea.Viewport
      {...rest}
      ref={callbackRef}
      data-ag-part="viewport"
      className={cn('ag-scroll-area-viewport', className)}
    />
  );
}

function Scrollbar({ className, ref, ...rest }: ScrollAreaScrollbarProps) {
  return <BaseScrollArea.Scrollbar {...rest} ref={ref} data-ag-part="scrollbar" className={cn('ag-scroll-area-scrollbar', className)} />;
}

function Thumb({ className, ref, ...rest }: ScrollAreaThumbProps) {
  return <BaseScrollArea.Thumb {...rest} ref={ref} data-ag-part="thumb" className={cn('ag-scroll-area-thumb', className)} />;
}

export const ScrollArea = { Root, Viewport, Scrollbar, Thumb };
