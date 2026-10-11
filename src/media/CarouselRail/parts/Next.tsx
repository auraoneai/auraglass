'use client';
import * as React from 'react';
import { useCarouselRail } from '../crContext';

export function Next(): React.ReactElement {
  const c = useCarouselRail('Next');
  const atEnd = !c.loop && c.index === c.count - 1;
  return (
    <button
      type="button"
      data-ag-part="carousel-next"
      className="ag-carousel-nav"
      aria-label="Next slide"
      aria-disabled={atEnd}
      onClick={() => !atEnd && c.step(1)}
    >›</button>
  );
}
