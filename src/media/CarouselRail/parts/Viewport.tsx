/* REQ-SURF-146/148 — Viewport: the scroll-snap container. Renders its
 * children (CarouselRail.Slide parts) when given, else one Slide per Root
 * `slides` entry. Focusable so keyboard users can scroll it (it holds no
 * focusable content of its own); polite live region unless rotating. */
import * as React from 'react';
import { cn } from '../../../internal';
import { useCarouselRail } from '../crContext';
import { Slide } from './Slide';

export function Viewport({ className, children }: { className?: string | undefined; children?: React.ReactNode } = {}): React.ReactElement {
  const c = useCarouselRail('Viewport');
  return (
    <div
      ref={c.viewportRef}
      id={c.viewportId}
      role="group"
      aria-label="Slide viewport"
      tabIndex={0}
      data-ag-part="carousel-viewport"
      className={cn('ag-carousel-viewport', className)}
      aria-live={c.autoplayActive ? 'off' : 'polite'}
    >
      {children ?? c.slides.map((s) => (
        <Slide key={s.id} id={s.id}>{s.children}</Slide>
      ))}
    </div>
  );
}
