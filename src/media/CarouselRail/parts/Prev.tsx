'use client';
import * as React from 'react';
import { useCarouselRail } from '../crContext';

export function Prev(): React.ReactElement {
  const c = useCarouselRail('Prev');
  const atEnd = !c.loop && c.index === 0;
  return (
    <button
      type="button"
      data-ag-part="carousel-prev"
      className="ag-carousel-nav"
      aria-label="Previous slide"
      aria-disabled={atEnd}
      onClick={() => !atEnd && c.step(-1)}
    >‹</button>
  );
}
