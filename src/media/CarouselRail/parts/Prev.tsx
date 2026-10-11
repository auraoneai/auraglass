'use client';
/* REQ-SURF-150 — Prev: thin chrome material, clear over media. */
import * as React from 'react';
import { cn } from '../../../internal';
import { useCarouselRail } from '../crContext';
import { navMaterial } from '../material';

export function Prev({ className }: { className?: string | undefined } = {}): React.ReactElement {
  const c = useCarouselRail('Prev');
  const atStart = !c.loop && c.index === 0;
  const material = navMaterial(c.overMedia);
  return (
    <button
      {...material}
      type="button"
      data-ag-part="carousel-prev"
      className={cn(material.className, 'ag-carousel-nav', className)}
      aria-label="Previous slide"
      aria-controls={c.viewportId}
      aria-disabled={atStart}
      onClick={() => { if (!atStart) c.step(-1); }}
    ><span aria-hidden="true">‹</span></button>
  );
}
