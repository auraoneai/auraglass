'use client';
import * as React from 'react';
import { useNowPlaying } from '../npContext';
import { MediaGlyph } from '../../glyphs';

export function Actions({ onPrevious, onNext }: { onPrevious?: (() => void) | undefined; onNext?: (() => void) | undefined }) {
  const m = useNowPlaying('Actions');
  return (
    <div data-ag-part="now-playing-actions" className="ag-now-playing-actions">
      {onPrevious ? (
        <button type="button" className="ag-media-btn" aria-label="Previous" data-ag-part="now-playing-prev" onClick={onPrevious}>
          <MediaGlyph name="previous" />
          <span data-ag-part="hit-area" aria-hidden="true" />
        </button>
      ) : null}
      <button
        type="button"
        className="ag-media-btn"
        aria-pressed={m.playing}
        aria-label={m.playing ? 'Pause' : 'Play'}
        data-ag-part="now-playing-play"
        onClick={() => m.toggle()}
      ><MediaGlyph name={m.playing ? 'pause' : 'play'} size={20} /><span data-ag-part="hit-area" aria-hidden="true" /></button>
      {onNext ? (
        <button type="button" className="ag-media-btn" aria-label="Next" data-ag-part="now-playing-next" onClick={onNext}>
          <MediaGlyph name="next" />
          <span data-ag-part="hit-area" aria-hidden="true" />
        </button>
      ) : null}
    </div>
  );
}
