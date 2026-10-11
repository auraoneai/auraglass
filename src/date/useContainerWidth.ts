'use client';
/* useContainerWidth (REQ-SURF-98/101/102): inline size of a date component's
   root element, which is block-level and therefore tracks the width of the
   container it is placed in. `null` until measured — on the server, before the
   first layout, and where ResizeObserver is unavailable — so callers fall back
   to their wide-layout default. */
import { useCallback, useEffect, useState } from 'react';

export function useContainerWidth(): [(el: Element | null) => void, number | null] {
  const [el, setEl] = useState<Element | null>(null);
  const [width, setWidth] = useState<number | null>(null);

  useEffect(() => {
    if (el === null || typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver((entries) => {
      const entry = entries[entries.length - 1];
      if (entry === undefined) return;
      const w = entry.contentBoxSize?.[0]?.inlineSize ?? entry.contentRect.width;
      setWidth((cur) => (cur === w ? cur : w));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [el]);

  const ref = useCallback((node: Element | null) => {
    setEl((cur) => (cur === node ? cur : node));
  }, []);
  return [ref, width];
}

/** Popover at or above this container width, bottom-sheet presentation below (REQ-SURF-98). */
export const SHEET_BELOW_PX = 640;
/** DateRangePicker shows two months at or above this container width (REQ-SURF-102). */
export const TWO_MONTHS_FROM_PX = 768;
