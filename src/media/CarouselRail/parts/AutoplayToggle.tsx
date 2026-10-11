'use client';
/* REQ-SURF-149 — rotation control (WCAG 2.2.2). It reports whether rotation
 * is enabled: "Stop automatic slide show" / aria-pressed=true only while the
 * continuous gate is open and the user has not stopped it; otherwise "Start
 * automatic slide show" / aria-pressed=false. With the gate closed it cannot
 * start rotation, so it is aria-disabled. */
import * as React from 'react';
import { useCarouselRail } from '../crContext';

export function AutoplayToggle(): React.ReactElement {
  const c = useCarouselRail('AutoplayToggle');
  const enabled = c.autoplayGate && !c.autoplayStopped;
  return (
    <button
      type="button"
      data-ag-part="carousel-autoplay-toggle"
      aria-pressed={enabled}
      aria-disabled={c.autoplayGate ? undefined : true}
      aria-label={enabled ? 'Stop automatic slide show' : 'Start automatic slide show'}
      aria-controls={c.viewportId}
      onClick={() => { if (c.autoplayGate) c.setAutoplayStopped(enabled); }}
    ><span aria-hidden="true">{enabled ? '❚❚' : '▶'}</span></button>
  );
}
