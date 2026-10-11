import * as React from 'react';

export interface ChapterMarker { start: number; title: string }

/** Chapter markers — the only inline style is --_ag-start. */
export function ChapterMarkers({ chapters, max }: { chapters: ChapterMarker[]; max: number }) {
  const pct = (s: number) => (max > 0 ? Math.min(100, Math.max(0, (s / max) * 100)) : 0);
  return (
    <>
      {chapters.map((c, i) => (
        <span
          key={i}
          data-ag-part="media-scrubber-chapter"
          aria-hidden="true"
          title={c.title}
          style={{ '--_ag-start': `${pct(c.start)}%` } as React.CSSProperties}
        />
      ))}
    </>
  );
}
