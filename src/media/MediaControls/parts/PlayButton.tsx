'use client';
import * as React from 'react';
import { useMediaModel } from '../mediaContext';
import { MediaGlyph } from '../../glyphs';

export const PlayButton = function PlayButton({className, ref}: { className?: string } & { ref?: React.Ref<HTMLButtonElement> }) {
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
      <MediaGlyph name={m.playing ? 'pause' : 'play'} />
    </button>
  );
};
