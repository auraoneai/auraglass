import * as React from 'react';

/** Buffered range layers — the only inline style is --_ag-start/--_ag-end
 * (positions come from stylesheet rules keyed to those custom props). */
export function BufferedLayer({ start, end, max }: { start: number; end: number; max: number }) {
  const pct = (s: number) => (max > 0 ? Math.min(100, Math.max(0, (s / max) * 100)) : 0);
  return (
    <span
      data-ag-part="media-scrubber-buffered"
      aria-hidden="true"
      style={{ '--_ag-start': `${pct(start)}%`, '--_ag-end': `${pct(end)}%` } as React.CSSProperties}
    />
  );
}
