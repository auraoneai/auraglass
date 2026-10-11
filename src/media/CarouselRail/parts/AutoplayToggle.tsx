'use client';
import * as React from 'react';
import { useCarouselRail } from '../crContext';

export function AutoplayToggle(): React.ReactElement {
  const c = useCarouselRail('AutoplayToggle');
  return (
    <button
      type="button"
      data-ag-part="carousel-autoplay-toggle"
      aria-pressed={!c.autoplayStopped}
      aria-label={c.autoplayStopped ? 'Start automatic slide show' : 'Stop automatic slide show'}
      onClick={() => c.setAutoplayStopped(!c.autoplayStopped)}
    />
  );
}
