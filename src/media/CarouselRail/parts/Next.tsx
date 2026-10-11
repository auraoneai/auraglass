'use client';
/* REQ-SURF-150 — Next: thin chrome material, clear over media. */
import * as React from 'react';
import { cn } from '../../../internal';
import { useCarouselRail } from '../crContext';
import { navMaterial } from '../material';

export function Next({ className }: { className?: string | undefined } = {}): React.ReactElement {
  const c = useCarouselRail('Next');
  const atEnd = !c.loop && c.index === c.count - 1;
  const material = navMaterial(c.overMedia);
  return (
    <button
      {...material}
      type="button"
      data-ag-part="carousel-next"
      className={cn(material.className, 'ag-carousel-nav', className)}
      aria-label="Next slide"
      aria-controls={c.viewportId}
      aria-disabled={atEnd}
      onClick={() => { if (!atEnd) c.step(1); }}
    ><span aria-hidden="true">›</span></button>
  );
}
