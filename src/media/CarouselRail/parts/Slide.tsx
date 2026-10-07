'use client';
import * as React from 'react';
import { useCarouselRail } from '../crContext';

/** Compositional slide — reads its position from the shared context. */
export function Slide({ id, label, children }: { id: string; label?: string | undefined; children?: React.ReactNode }) {
  const c = useCarouselRail('Slide');
  const i = Math.max(0, c.slides.findIndex((s) => s.id === id));
  return (
    <div
      data-ag-part="carousel-slide"
      className="ag-carousel-slide"
      role={c.indicatorsAs === 'tabs' ? 'tabpanel' : 'group'}
      aria-roledescription="slide"
      aria-label={label ?? `${i + 1} of ${c.count}`}
      id={`ag-slide-${id}`}
    >
      {children}
    </div>
  );
}
