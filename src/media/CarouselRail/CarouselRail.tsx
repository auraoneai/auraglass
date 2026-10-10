'use client';
/* REQ-SURF-146..150 — CarouselRail: scroll-snap viewport + IntersectionObserver
 * index (threshold 0.6, no scroll listeners); APG tabs|buttons; autoplay only
 * under the continuous gate. */
import * as React from 'react';
import { useResolvedPreferences } from '../../theme';
import { observeOffscreen, subscribeFrame } from '../../motion';
import { CarouselRailContext, type CarouselRailContextValue } from './crContext';
import { useCarouselIndex } from './useCarouselIndex';
import type { CarouselRailSlide } from './types';
import { Viewport } from './parts/Viewport';
import { Slide } from './parts/Slide';
import { Prev } from './parts/Prev';
import { Next } from './parts/Next';
import { Indicators } from './parts/Indicators';
import { AutoplayToggle } from './parts/AutoplayToggle';

export { useCarouselIndex } from './useCarouselIndex';
export type { CarouselRailSlide } from './types';

export interface CarouselRailRootProps {
  label: string;
  slides: CarouselRailSlide[];
  index?: number | undefined;
  defaultIndex?: number | undefined;
  onIndexChange?: ((index: number) => void) | undefined;
  slidesPerView?: number | 'auto' | undefined;
  loop?: boolean | undefined;
  /** {interval ms ≥5000} | false — rotates only under the continuous gate. */
  autoplay?: { interval: number } | false | undefined;
  overMedia?: boolean | undefined;
  indicatorsAs?: 'tabs' | 'buttons' | undefined;
  className?: string | undefined;
}

function Root(props: CarouselRailRootProps): React.ReactElement {
  const {
    label, slides, index, defaultIndex, onIndexChange,
    slidesPerView = 'auto', loop = false, autoplay = false,
    overMedia = false, indicatorsAs = 'tabs', className,
  } = props;
  const [current, goTo] = useCarouselIndex({ count: slides.length, index, defaultIndex, onIndexChange });
  const { allowContinuous, motion } = useResolvedPreferences();
  const [autoplayStopped, setAutoplayStopped] = React.useState(false);
  const [hovered, setHovered] = React.useState(false);
  const [focusedWithin, setFocusedWithin] = React.useState(false);
  const [offscreen, setOffscreen] = React.useState(false);
  const viewportRef = React.useRef<HTMLDivElement | null>(null);
  const rootRef = React.useRef<HTMLElement | null>(null);

  const gate = allowContinuous && motion === 'full';
  const autoplayActive = !!autoplay && gate && !autoplayStopped && !hovered && !focusedWithin && !offscreen;

  React.useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    return observeOffscreen(el);
  }, []);

  // reflect MAT's data-ag-offscreen writes on the root for autoplay gating
  React.useEffect(() => {
    const el = rootRef.current;
    if (!el || typeof MutationObserver === 'undefined') return;
    const mo = new MutationObserver(() => setOffscreen(el.hasAttribute('data-ag-offscreen')));
    mo.observe(el, { attributes: true, attributeFilter: ['data-ag-offscreen'] });
    return () => mo.disconnect();
  }, []);

  // IntersectionObserver on slides (threshold 0.6) drives the active index —
  // never scroll listeners.
  React.useEffect(() => {
    const vp = viewportRef.current;
    if (!vp || typeof IntersectionObserver === 'undefined') return;
    const els = Array.from(vp.querySelectorAll('[data-ag-part="carousel-slide"]'));
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting && e.intersectionRatio >= 0.6) {
          const i = els.indexOf(e.target as Element);
          if (i >= 0 && i !== current) goTo(i);
        }
      }
    }, { root: vp, threshold: 0.6 });
    els.forEach((s) => io.observe(s));
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- slides observed once
  }, [slides.length]);

  // autoplay — frame-gated elapsed check (no timers; visibility/offscreen-aware)
  React.useEffect(() => {
    if (!autoplay || !autoplayActive) return;
    const interval = Math.max(5000, autoplay.interval);
    let last = performance.now();
    return subscribeFrame(() => {
      const now = performance.now();
      if (now - last < interval) return;
      last = now;
      const next = loop ? (current + 1) % slides.length : Math.min(slides.length - 1, current + 1);
      goTo(next);
      const vp = viewportRef.current;
      const target = vp?.children[next] as HTMLElement | undefined;
      if (typeof vp?.scrollTo === 'function') vp.scrollTo({ left: target ? target.offsetLeft : next * vp.clientWidth, behavior: 'auto' });
    });
  }, [autoplay, autoplayActive, current, loop, slides.length, goTo]);

  const step = (d: number) => {
    const n = loop ? ((current + d) % slides.length + slides.length) % slides.length
      : Math.min(slides.length - 1, Math.max(0, current + d));
    goTo(n);
    const vp = viewportRef.current;
    const target = vp?.children[n] as HTMLElement | undefined;
    if (typeof vp?.scrollTo === 'function') vp.scrollTo({ left: target ? target.offsetLeft : n * (vp.clientWidth || 0), behavior: 'auto' });
  };

  const ctx: CarouselRailContextValue = {
    index: current, count: slides.length, loop, autoplayActive, overMedia,
    indicatorsAs, slides, goTo, step, setAutoplayStopped, autoplayStopped, viewportRef,
  };
  const effectivePerView = slidesPerView === 'auto' ? 'auto' : slidesPerView;
  return (
    <CarouselRailContext.Provider value={ctx}>
      <section
        ref={rootRef as React.RefObject<HTMLElement>}
        className={['ag-carousel', className].filter(Boolean).join(' ')}
        data-ag-part="carousel"
        data-state={autoplayActive ? 'autoplaying' : 'stopped'}
        aria-roledescription="carousel"
        aria-label={label}
        style={{ '--_ag-slides-per-view': typeof effectivePerView === 'number' ? effectivePerView : undefined } as React.CSSProperties}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onFocusCapture={() => setFocusedWithin(true)}
        onBlurCapture={() => setFocusedWithin(false)}
      >
        {autoplay ? <AutoplayToggle /> : null}
        <Viewport />
        <Prev />
        <Next />
        <Indicators />
      </section>
    </CarouselRailContext.Provider>
  );
}


export const CarouselRail = { Root, Viewport, Slide, Prev, Next, Indicators, AutoplayToggle } as const;
export type CarouselRail = typeof CarouselRail;
