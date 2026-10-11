'use client';
import * as React from 'react';
import { useMediaModel } from '../mediaContext';

export const Mute = function Mute({className, ref}: { className?: string } & { ref?: React.Ref<HTMLButtonElement> }) {
  const m = useMediaModel('Mute');
  return (
    <button
        type="button"
        role="button"
        tabIndex={0}
      ref={ref}
      className={['ag-media-btn', className].filter(Boolean).join(' ')}
      data-ag-part="media-mute"
      aria-pressed={m.muted}
      aria-label={m.muted ? 'Unmute' : 'Mute'}
      onClick={() => m.setMuted(!m.muted)}
    >
      <span aria-hidden="true">{m.muted ? '🔇' : '🔊'}</span>
    </button>
  );
};
