'use client';
import * as React from 'react';
import { useCarouselRail } from '../crContext';

export function Viewport(): React.ReactElement {
  const c = useCarouselRail('Viewport');
  return (
    <div
      ref={c.viewportRef}
      data-ag-part="carousel-viewport"
      className="ag-carousel-viewport"
      aria-live={c.autoplayActive ? 'off' : 'polite'}
    >
      {c.slides.map((s, i) => (
        <div
          key={s.id}
          data-ag-part="carousel-slide"
          className="ag-carousel-slide"
          role={c.indicatorsAs === 'tabs' ? 'tabpanel' : 'group'}
          aria-roledescription="slide"
          aria-label={`${i + 1} of ${c.count}`}
          id={`ag-slide-${s.id}`}
        >
          {s.children}
        </div>
      ))}
    </div>
  );
}
