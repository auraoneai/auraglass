'use client';
import * as React from 'react';
import { formatMediaTime } from '../../formatMediaTime';
import { useNowPlaying } from '../npContext';

export const Progress = (function ({ ref, className }: { className?: string } & { ref?: React.Ref<HTMLDivElement> }) {
    const m = useNowPlaying('Progress');
    const pct = Math.round(Math.min(1, Math.max(0, m.progress)) * 100);
    const text = `${formatMediaTime(m.currentTime, { spoken: true })} of ${formatMediaTime(m.duration, { spoken: true })}`;
    return (
      <div
        ref={ref}
        data-ag-part="now-playing-progress"
        className={['ag-now-playing-progress', className].filter(Boolean).join(' ')}
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={pct}
        aria-valuetext={text}
        aria-label="Playback progress"
      >
        <div data-ag-part="now-playing-progress-fill" aria-hidden="true" />
      </div>
    );
  }
);
