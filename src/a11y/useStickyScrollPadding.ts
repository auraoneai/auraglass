'use client';
/* MAT-305/306 (A11Y-028): sticky headers/footers contribute scroll-padding so
   keyboard focus and anchor navigation never slide content underneath them.
   One ResizeObserver per element; writes --ag-scroll-padding-<edge> on the
   closest [data-ag-scroll-container] or <html>; value = border-box block size
   + 8px. Inline-custom-property writes are the named REQ-A11Y-28 exception.
   Unchanged values are not rewritten; the property is removed and the observer
   disconnected on unmount. */
import { useEffect, useRef } from 'react';

export type StickyScrollPaddingOptions<E extends HTMLElement = HTMLElement> = {
  ref: React.RefObject<E | null>;
  edge: 'top' | 'bottom';
  enabled?: boolean;
};

const prop = (edge: 'top' | 'bottom') => `--ag-scroll-padding-${edge}`;

export function useStickyScrollPadding<E extends HTMLElement>({
  ref,
  edge,
  enabled = true,
}: StickyScrollPaddingOptions<E>) {
  const lastWritten = useRef<string | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!enabled || el == null || typeof ResizeObserver === 'undefined') return;

    const host: HTMLElement =
      (el.closest('[data-ag-scroll-container]') as HTMLElement | null) ??
      document.documentElement;
    const name = prop(edge);

    const write = () => {
      const size = el.getBoundingClientRect().height;
      const value = `${Math.max(0, size) + 8}px`;
      if (value !== lastWritten.current) {
        host.style.setProperty(name, value);
        lastWritten.current = value;
      }
    };

    write();
    const ro = new ResizeObserver(write);
    ro.observe(el);
    return () => {
      ro.disconnect();
      if (lastWritten.current !== null) {
        host.style.removeProperty(name);
        lastWritten.current = null;
      }
    };
  }, [ref, edge, enabled]);
}

export default useStickyScrollPadding;
