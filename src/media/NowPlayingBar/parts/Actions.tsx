'use client';
import * as React from 'react';
import { useNowPlaying } from '../npContext';

export function Actions({ onPrevious, onNext }: { onPrevious?: (() => void) | undefined; onNext?: (() => void) | undefined }) {
  const m = useNowPlaying('Actions');
  return (
    <div data-ag-part="now-playing-actions" className="ag-now-playing-actions">
      {onPrevious ? <button type="button" aria-label="Previous" data-ag-part="now-playing-prev" onClick={onPrevious}>⏮</button> : null}
      <button
        type="button"
        aria-pressed={m.playing}
        aria-label={m.playing ? 'Pause' : 'Play'}
        data-ag-part="now-playing-play"
        onClick={() => m.toggle()}
      ><span aria-hidden="true">{m.playing ? '❚❚' : '▶'}</span></button>
      {onNext ? <button type="button" aria-label="Next" data-ag-part="now-playing-next" onClick={onNext}>⏭</button> : null}
    </div>
  );
}
