'use client';
import * as React from 'react';
import { formatMediaTime, formatMediaTimeIso } from '../../formatMediaTime';
import { useMediaModel } from '../mediaContext';

export const Time = function Time({className, showDuration = true, ref}: { className?: string; showDuration?: boolean } & { ref?: React.Ref<HTMLTimeElement> }) {
    const m = useMediaModel('Time');
    const hasScrubber = true; // Scrubber is in the default layout; aria-hidden per REQ-SURF-138
    return (
      <time
        ref={ref}
        className={['ag-media-time', className].filter(Boolean).join(' ')}
        data-ag-part="media-time"
        dateTime={formatMediaTimeIso(m.currentTime)}
        aria-hidden={hasScrubber || undefined}
      >
        {formatMediaTime(m.currentTime)}
        {showDuration ? ` / ${formatMediaTime(m.duration)}` : ''}
      </time>
    );
  };
