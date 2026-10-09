/* CMP-315: ScrollArea on BU ScrollArea. The viewport is tabIndex=0 only while
   content overflows (keyboard scrolling needs a focusable region only then);
   implemented as a ref callback that returns the ResizeObserver cleanup.
   parts [root, viewport, scrollbar, thumb]. */
'use client';
import * as React from 'react';
import { ScrollArea as BaseScrollArea } from '@base-ui/react/scroll-area';
import { cn } from '../../internal/index';

function Root({ className, ref, ...rest }: React.ComponentProps<typeof BaseScrollArea.Root>) {
  return <BaseScrollArea.Root {...rest} ref={ref} data-ag-part="root" className={cn('ag-scroll-area', className)} />;
}

function Viewport({
  className,
  ref,
  ...rest
}: React.ComponentProps<typeof BaseScrollArea.Viewport>) {
  const callbackRef = React.useCallback(
    (node: HTMLDivElement | null) => {
      if (typeof ref === 'function') ref(node);
      else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
      if (!node) return;
      let warned = false;
      const update = () => {
        const overflowing = node.scrollHeight > node.clientHeight + 1 || node.scrollWidth > node.clientWidth + 1;
        if (overflowing) {
          node.setAttribute('tabindex', '0');
          // REQ-CMP-122: a focusable region needs an accessible name — warn once
          // per instance in dev when it overflows unlabeled.
          if (
            !warned &&
            process.env.NODE_ENV !== 'production' &&
            !node.getAttribute('aria-label') &&
            !node.getAttribute('aria-labelledby')
          ) {
            warned = true;
            console.warn(
              '[aura-glass] ScrollArea.Viewport is overflowing and focusable (tabIndex=0) but has no ' +
                'aria-label or aria-labelledby — give the scrollable region an accessible name.',
            );
          }
        } else node.removeAttribute('tabindex');
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

function Scrollbar({ className, ref, ...rest }: React.ComponentProps<typeof BaseScrollArea.Scrollbar>) {
  return <BaseScrollArea.Scrollbar {...rest} ref={ref} data-ag-part="scrollbar" className={cn('ag-scroll-area-scrollbar', className)} />;
}

function Thumb({ className, ref, ...rest }: React.ComponentProps<typeof BaseScrollArea.Thumb>) {
  return <BaseScrollArea.Thumb {...rest} ref={ref} data-ag-part="thumb" className={cn('ag-scroll-area-thumb', className)} />;
}

export const ScrollArea = { Root, Viewport, Scrollbar, Thumb };
