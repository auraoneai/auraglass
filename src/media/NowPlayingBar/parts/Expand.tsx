'use client';
import * as React from 'react';
import { useNowPlaying } from '../npContext';

export function Expand({ expandedId, expanded, onExpandedChange }: {
  expandedId?: string | undefined;
  expanded?: boolean | undefined;
  onExpandedChange?: ((expanded: boolean) => void) | undefined;
}) {
  useNowPlaying('Expand');
  if (process.env.NODE_ENV !== 'production' && expandedId === undefined) {
    throw new Error('[aura-glass] NowPlayingBar.Expand requires aria-controls via `expandedId`.');
  }
  return (
    <button
      type="button"
      data-ag-part="now-playing-expand"
      className="ag-now-playing-expand"
      aria-expanded={!!expanded}
      aria-controls={expandedId}
      aria-label={expanded ? 'Collapse' : 'Expand'}
      onClick={() => onExpandedChange?.(!expanded)}
    >
      <span aria-hidden="true">{expanded ? '▾' : '▴'}</span>
    </button>
  );
}
