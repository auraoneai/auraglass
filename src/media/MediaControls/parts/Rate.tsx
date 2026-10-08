'use client';
import * as React from 'react';
import { useMediaModel } from '../mediaContext';

export const Rate = React.forwardRef<HTMLButtonElement, { className?: string }>(function Rate({ className }, ref) {
  const m = useMediaModel('Rate');
  return (
    <button
        type="button"
        role="button"
        tabIndex={0}
      ref={ref}
      className={['ag-media-btn', className].filter(Boolean).join(' ')}
      data-ag-part="media-rate"
      aria-label="Playback rate"
      onClick={() => m.setRate(m.playbackRate >= 2 ? 1 : m.playbackRate + 0.25)}
    >
      {m.playbackRate}×
    </button>
  );
});
