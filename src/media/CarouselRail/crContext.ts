'use client';
import * as React from 'react';
import type { CarouselRailSlide } from './types';

export interface CarouselRailContextValue {
  index: number;
  count: number;
  loop: boolean;
  autoplayActive: boolean;
  overMedia: boolean;
  indicatorsAs: 'tabs' | 'buttons';
  slides: CarouselRailSlide[];
  goTo(i: number): void;
  step(d: number): void;
  setAutoplayStopped(v: boolean): void;
  autoplayStopped: boolean;
  viewportRef: React.RefObject<HTMLDivElement | null>;
}
export const CarouselRailContext = React.createContext<CarouselRailContextValue | null>(null);
export function useCarouselRail(part: string): CarouselRailContextValue {
  const c = React.useContext(CarouselRailContext);
  if (!c) throw new Error(`CarouselRail.${part} must render inside <CarouselRail.Root>`);
  return c;
}
