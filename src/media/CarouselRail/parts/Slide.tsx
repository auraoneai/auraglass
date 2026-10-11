/* REQ-SURF-146/150 — compositional slide: reads its position from the shared
 * context; opaque content-raised material (never a backdrop filter). */
import * as React from 'react';
import { cn } from '../../../internal';
import { useCarouselRail } from '../crContext';
import { slideMaterial } from '../material';

export interface CarouselRailSlideProps {
  id: string;
  label?: string | undefined;
  className?: string | undefined;
  children?: React.ReactNode;
}

export function Slide({ id, label, className, children }: CarouselRailSlideProps): React.ReactElement {
  const c = useCarouselRail('Slide');
  const i = Math.max(0, c.slides.findIndex((s) => s.id === id));
  const material = slideMaterial();
  return (
    <div
      {...material}
      data-ag-part="carousel-slide"
      className={cn(material.className, 'ag-carousel-slide', className)}
      role={c.indicatorsAs === 'tabs' ? 'tabpanel' : 'group'}
      aria-roledescription="slide"
      aria-label={label ?? `${i + 1} of ${c.count}`}
      id={`ag-slide-${id}`}
    >
      {children}
    </div>
  );
}
