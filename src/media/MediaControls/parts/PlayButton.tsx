'use client';
import * as React from 'react';
import { useMediaModel } from '../mediaContext';

export const PlayButton = (function ({ ref, className }: { className?: string } & { ref?: React.Ref<HTMLButtonElement> }) {
  const m = useMediaModel('PlayButton');
  return (
    <button
        type="button"
        role="button"
        tabIndex={0}
      ref={ref}
      className={['ag-media-btn', className].filter(Boolean).join(' ')}
      data-ag-part="media-play"
      aria-pressed={m.playing}
      aria-label={m.playing ? 'Pause' : 'Play'}
      onClick={() => m.toggle()}
    >
      <span aria-hidden="true">{m.playing ? '❚❚' : '▶'}</span>
    </button>
  );
});
