/* REQ-SURF-138 — <time datetime="PT1M32S"> with tabular-nums; aria-hidden
 * only when a Scrubber is mounted in the same Root (its valuetext already
 * speaks the position). Below 480 px it shows elapsed time only. */
import * as React from 'react';
import { formatMediaTime, formatMediaTimeIso } from '../../formatMediaTime';
import { useMediaLayout, useMediaModel } from '../mediaContext';

export function Time({ className, showDuration = true, ref }: {
  className?: string | undefined;
  showDuration?: boolean | undefined;
  ref?: React.Ref<HTMLTimeElement> | undefined;
}) {
  const m = useMediaModel('Time');
  const { size, parts } = useMediaLayout();
  if (size === 'minimal') return null;
  const withDuration = showDuration && size === 'full';
  return (
    <time
      ref={ref}
      className={['ag-media-time', className].filter(Boolean).join(' ')}
      data-ag-part="media-time"
      dateTime={formatMediaTimeIso(m.currentTime)}
      aria-hidden={parts.scrubber > 0 || undefined}
    >
      {formatMediaTime(m.currentTime)}
      {withDuration ? ` / ${formatMediaTime(m.duration)}` : ''}
    </time>
  );
}
