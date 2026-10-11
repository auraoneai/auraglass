'use client';
/* REQ-SURF-146/147/148/150 — Indicators. `as="tabs"` (default) is the APG
 * tabbed carousel: one tab stop, Arrow keys (flipped in RTL), Home and End
 * move both the selection and DOM focus. `as="buttons"` renders plain
 * buttons with aria-current. Clicks scroll the viewport through Root's
 * goTo helper. The group is thin chrome (clear over media). */
import * as React from 'react';
import { cn } from '../../../internal';
import { isRtl, useCarouselRail, useIsoLayoutEffect, type CarouselRailIndicatorsAs } from '../crContext';
import { navMaterial } from '../material';

export interface CarouselRailIndicatorsProps {
  /** tabs (APG tabbed carousel, default) | buttons (APG basic carousel picker). */
  as?: CarouselRailIndicatorsAs | undefined;
  className?: string | undefined;
}

export function Indicators({ as, className }: CarouselRailIndicatorsProps = {}): React.ReactElement {
  const c = useCarouselRail('Indicators');
  const refs = React.useRef<Array<HTMLButtonElement | null>>([]);
  const { registerIndicatorsAs } = c;
  useIsoLayoutEffect(() => {
    if (as === undefined) return;
    registerIndicatorsAs(as);
    return () => registerIndicatorsAs(undefined);
  }, [as, registerIndicatorsAs]);
  const variant = as ?? c.indicatorsAs;
  const material = navMaterial(c.overMedia);
  const cls = cn(material.className, 'ag-carousel-indicators', className);

  if (variant === 'buttons') {
    return (
      <div {...material} data-ag-part="carousel-indicators" className={cls}>
        {c.slides.map((s, i) => (
          <button
            key={s.id}
            type="button"
            aria-label={s.label ?? `Slide ${i + 1}`}
            aria-current={i === c.index}
            aria-controls={c.viewportId}
            data-ag-part="carousel-indicator"
            onClick={() => c.goTo(i)}
          />
        ))}
      </div>
    );
  }

  const focusTab = (n: number) => refs.current[n]?.focus();
  return (
    <div
      {...material}
      role="tablist"
      aria-label="Slides"
      data-ag-part="carousel-indicators"
      className={cls}
      onKeyDown={(e) => {
        const back = isRtl(e.currentTarget) ? 'ArrowRight' : 'ArrowLeft';
        const fwd = back === 'ArrowLeft' ? 'ArrowRight' : 'ArrowLeft';
        let n: number | null = null;
        if (e.key === fwd) n = c.step(1);
        else if (e.key === back) n = c.step(-1);
        else if (e.key === 'Home') { n = 0; c.goTo(0); }
        else if (e.key === 'End') { n = c.count - 1; c.goTo(n); }
        if (n === null) return;
        e.preventDefault();
        focusTab(n);
      }}
    >
      {c.slides.map((s, i) => (
        <button
          key={s.id}
          ref={(el) => { refs.current[i] = el; }}
          role="tab"
          type="button"
          aria-selected={i === c.index}
          aria-controls={`ag-slide-${s.id}`}
          tabIndex={i === c.index ? 0 : -1}
          data-ag-part="carousel-indicator"
          aria-label={s.label ?? `Slide ${i + 1}`}
          onClick={() => c.goTo(i)}
        />
      ))}
    </div>
  );
}
