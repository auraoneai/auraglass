'use client';
import * as React from 'react';
import type { CarouselRailSlide } from './types';

export type CarouselRailIndicatorsAs = 'tabs' | 'buttons';

export interface CarouselRailContextValue {
  index: number;
  count: number;
  loop: boolean;
  /** Rotation is running right now (gate open, not stopped, not paused). */
  autoplayActive: boolean;
  /** The continuous gate: allowContinuous + motion=full + a
   * [data-ag-continuous="on"] ancestor (contract §9: every loop needs all three). */
  autoplayGate: boolean;
  autoplayStopped: boolean;
  setAutoplayStopped(v: boolean): void;
  overMedia: boolean;
  /** Resolved indicator variant (Indicators `as` wins over Root `indicatorsAs`). */
  indicatorsAs: CarouselRailIndicatorsAs;
  /** Lets an Indicators part nested below Root's direct children declare its variant. */
  registerIndicatorsAs(v: CarouselRailIndicatorsAs | undefined): void;
  slides: CarouselRailSlide[];
  /** Move to slide `i` (clamped) and scroll the viewport to it. */
  goTo(i: number): void;
  /** Move by `d` (wrapping when loop) and scroll; returns the new index. */
  step(d: number): number;
  viewportRef: React.RefObject<HTMLDivElement | null>;
  viewportId: string;
}
export const CarouselRailContext = React.createContext<CarouselRailContextValue | null>(null);
export function useCarouselRail(part: string): CarouselRailContextValue {
  const c = React.useContext(CarouselRailContext);
  if (!c) throw new Error(`CarouselRail.${part} must render inside <CarouselRail.Root>`);
  return c;
}

export const useIsoLayoutEffect = typeof window === 'undefined' ? React.useEffect : React.useLayoutEffect;

/** Logical direction of the carousel (arrows and scroll offsets flip in RTL). */
export function isRtl(el: Element | null): boolean {
  return el?.closest('[dir]')?.getAttribute('dir') === 'rtl';
}
