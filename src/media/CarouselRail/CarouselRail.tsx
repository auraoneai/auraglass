'use client';
/* REQ-SURF-146..150 — CarouselRail.
 * 146: compositional parts — Root renders its children when given, else the
 *      default layout; `<CarouselRail.Indicators as>` picks tabs|buttons
 *      (Root `indicatorsAs` stays as an alias); `.ag-carousel` is the size
 *      container the 480 px rule queries.
 * 147: APG carousel — tabs variant moves DOM focus with Arrow/Home/End.
 * 148: scroll-snap viewport; every index change scrolls through one helper
 *      (smooth unless reduced motion); an IntersectionObserver (threshold 0.6,
 *      no scroll listeners) reads the latest index from a ref.
 * 149: autoplay rotates only under the continuous gate (allowContinuous +
 *      motion=full + a [data-ag-continuous="on"] ancestor), never while
 *      hovered, focused, offscreen or the document is hidden; driven by the
 *      shared MAT frame loop (no timers).
 * 150: MAT materials on slides and navigation; data-ag-backdrop=media over media. */
import * as React from 'react';
import { useResolvedPreferences } from '../../theme';
import { observeOffscreen, subscribeFrame } from '../../motion';
import {
  CarouselRailContext, isRtl, useIsoLayoutEffect,
  type CarouselRailContextValue, type CarouselRailIndicatorsAs,
} from './crContext';
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
export type { CarouselRailIndicatorsProps } from './parts/Indicators';

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
  /** Alias of `<CarouselRail.Indicators as>` for the default layout. */
  indicatorsAs?: CarouselRailIndicatorsAs | undefined;
  className?: string | undefined;
  /** Compose the parts yourself; omitted → Autoplay toggle, Viewport, Prev, Next, Indicators. */
  children?: React.ReactNode;
}

/** `as` of an Indicators element among Root's children (through fragments). */
function indicatorsAsIn(children: React.ReactNode): CarouselRailIndicatorsAs | undefined {
  let found: CarouselRailIndicatorsAs | undefined;
  React.Children.forEach(children, (child) => {
    if (found || !React.isValidElement(child)) return;
    const props = child.props as { as?: CarouselRailIndicatorsAs; children?: React.ReactNode };
    if (child.type === Indicators) found = props.as;
    else if (child.type === React.Fragment) found = indicatorsAsIn(props.children);
  });
  return found;
}

const SLIDE_SELECTOR = '[data-ag-part="carousel-slide"]';
const slideEls = (vp: HTMLElement): HTMLElement[] => Array.from(vp.querySelectorAll<HTMLElement>(SLIDE_SELECTOR));

function Root(props: CarouselRailRootProps): React.ReactElement {
  const {
    label, slides, index, defaultIndex, onIndexChange,
    slidesPerView = 'auto', loop = false, autoplay = false,
    overMedia = false, indicatorsAs, className, children,
  } = props;
  const count = slides.length;
  const [current, setIndex] = useCarouselIndex({ count, index, defaultIndex, onIndexChange });
  const { allowContinuous, motion } = useResolvedPreferences();
  const [autoplayStopped, setAutoplayStopped] = React.useState(false);
  const [hovered, setHovered] = React.useState(false);
  const [focusedWithin, setFocusedWithin] = React.useState(false);
  const [offscreen, setOffscreen] = React.useState(false);
  const [hidden, setHidden] = React.useState(false);
  const [continuousAncestor, setContinuousAncestor] = React.useState(false);
  const [registeredAs, setRegisteredAs] = React.useState<CarouselRailIndicatorsAs | undefined>(undefined);
  const viewportRef = React.useRef<HTMLDivElement | null>(null);
  const rootRef = React.useRef<HTMLElement | null>(null);
  const viewportId = `${React.useId()}-viewport`;

  // latest values for observers/frame callbacks (never stale closures)
  const indexRef = React.useRef(current);
  const setIndexRef = React.useRef(setIndex);
  useIsoLayoutEffect(() => { indexRef.current = current; setIndexRef.current = setIndex; });
  // slide a programmatic scroll is heading to: the IO ignores the slides it passes on the way
  const pendingRef = React.useRef<number | null>(null);
  const visibleRef = React.useRef(new Set<number>());

  const gate = continuousAncestor && allowContinuous && motion === 'full';
  const autoplayActive = !!autoplay && gate && !autoplayStopped && !hovered && !focusedWithin && !offscreen && !hidden;
  const smooth = motion === 'full';
  const resolvedAs: CarouselRailIndicatorsAs = indicatorsAsIn(children) ?? registeredAs ?? indicatorsAs ?? 'tabs';

  const scrollViewport = React.useCallback((n: number) => {
    const vp = viewportRef.current;
    if (!vp || typeof vp.scrollTo !== 'function') return;
    const target = slideEls(vp)[n];
    pendingRef.current = visibleRef.current.has(n) ? null : n;
    const left = !target ? n * vp.clientWidth
      : isRtl(vp) ? target.offsetLeft + target.offsetWidth - vp.clientWidth
        : target.offsetLeft;
    vp.scrollTo({ left, behavior: smooth ? 'smooth' : 'auto' });
  }, [smooth]);

  const goTo = React.useCallback((i: number) => {
    const n = Math.min(count - 1, Math.max(0, i));
    setIndexRef.current(n);
    scrollViewport(n);
  }, [count, scrollViewport]);

  const step = React.useCallback((d: number): number => {
    const cur = indexRef.current;
    const n = loop ? ((cur + d) % count + count) % count : Math.min(count - 1, Math.max(0, cur + d));
    if (n !== cur) goTo(n);
    return n;
  }, [count, loop, goTo]);

  const registerIndicatorsAs = React.useCallback((v: CarouselRailIndicatorsAs | undefined) => setRegisteredAs(v), []);

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

  // the continuous gate is an ancestor attribute written by the provider (MAT)
  React.useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const read = () => setContinuousAncestor(el.closest('[data-ag-continuous="on"]') !== null);
    read();
    if (typeof MutationObserver === 'undefined') return;
    const mo = new MutationObserver(read);
    mo.observe(el.ownerDocument.documentElement, { attributes: true, subtree: true, attributeFilter: ['data-ag-continuous'] });
    return () => mo.disconnect();
  }, [allowContinuous, motion]);

  // a hidden document pauses rotation (WCAG 2.2.2; the frame loop also stops)
  React.useEffect(() => {
    if (typeof document === 'undefined') return;
    const ac = new AbortController();
    const read = () => setHidden(document.hidden);
    read();
    document.addEventListener('visibilitychange', read, { signal: ac.signal });
    return () => ac.abort();
  }, []);

  // IntersectionObserver on slides (threshold 0.6) drives the active index —
  // never scroll listeners. Reads the latest index through indexRef.
  React.useEffect(() => {
    const vp = viewportRef.current;
    if (!vp || typeof IntersectionObserver === 'undefined') return;
    const els = slideEls(vp);
    const visible = visibleRef.current;
    visible.clear();
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        const i = els.indexOf(e.target as HTMLElement);
        if (i < 0) continue;
        if (!(e.isIntersecting && e.intersectionRatio >= 0.6)) { visible.delete(i); continue; }
        visible.add(i);
        const pending = pendingRef.current;
        if (pending !== null) {
          if (i === pending) pendingRef.current = null;
          continue;
        }
        if (i !== indexRef.current) setIndexRef.current(i);
      }
    }, { root: vp, threshold: 0.6 });
    els.forEach((s) => io.observe(s));
    // a user gesture always wins over an in-flight programmatic scroll
    const ac = new AbortController();
    const release = () => { pendingRef.current = null; };
    for (const type of ['pointerdown', 'touchstart', 'wheel'] as const) {
      vp.addEventListener(type, release, { passive: true, signal: ac.signal });
    }
    return () => { io.disconnect(); ac.abort(); };
  }, [count]);

  // autoplay — elapsed time on the shared frame loop (no timers); the
  // subscription exists only while rotation is active
  const interval = autoplay ? Math.max(5000, autoplay.interval) : 0;
  React.useEffect(() => {
    if (!interval || !autoplayActive) return;
    let elapsed = 0;
    const el = rootRef.current;
    return subscribeFrame((dt) => {
      elapsed += dt;
      if (elapsed < interval) return;
      elapsed = 0;
      const cur = indexRef.current;
      const next = loop ? (cur + 1) % count : Math.min(count - 1, cur + 1);
      if (next !== cur) goTo(next);
    }, el ? { element: el } : undefined);
  }, [interval, autoplayActive, loop, count, goTo]);

  const ctx: CarouselRailContextValue = {
    index: current, count, loop, autoplayActive, autoplayGate: gate, autoplayStopped, setAutoplayStopped,
    overMedia, indicatorsAs: resolvedAs, registerIndicatorsAs, slides, goTo, step, viewportRef, viewportId,
  };
  return (
    <CarouselRailContext.Provider value={ctx}>
      <section
        ref={rootRef as React.RefObject<HTMLElement>}
        className={['ag-carousel', className].filter(Boolean).join(' ')}
        data-ag-part="carousel"
        data-state={autoplayActive ? 'playing' : 'stopped'}
        data-ag-backdrop={overMedia ? 'media' : undefined}
        aria-roledescription="carousel"
        aria-label={label}
        style={{ '--_ag-slides-per-view': typeof slidesPerView === 'number' ? slidesPerView : undefined } as React.CSSProperties}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onFocusCapture={() => setFocusedWithin(true)}
        onBlurCapture={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setFocusedWithin(false);
        }}
      >
        {children ?? (
          <>
            {autoplay ? <AutoplayToggle /> : null}
            <Viewport />
            <Prev />
            <Next />
            <Indicators />
          </>
        )}
      </section>
    </CarouselRailContext.Provider>
  );
}


export const CarouselRail = { Root, Viewport, Slide, Prev, Next, Indicators, AutoplayToggle } as const;
export type CarouselRail = typeof CarouselRail;
