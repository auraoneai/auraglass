'use client';
import * as React from 'react';
import { useMediaModel } from '../mediaContext';
import { MediaGlyph } from '../../glyphs';

export const Fullscreen = function Fullscreen({className, ref}: { className?: string } & { ref?: React.Ref<HTMLButtonElement> }) {
  const m = useMediaModel('Fullscreen');
  return (
    <button
        type="button"
        role="button"
        tabIndex={0}
      ref={ref}
      className={['ag-media-btn', className].filter(Boolean).join(' ')}
      data-ag-part="media-fullscreen"
      aria-label="Fullscreen"
      onClick={() => m.requestFullscreen()}
    >
      <MediaGlyph name="fullscreen" />
    </button>
  );
};
