/* LiquidGlassCarouselRail — 4.x compat adapter (REQ-SURF-13, DEP-S0607) →
   CarouselRail. items (ReactNode[]) → slides, label/aria-label → label,
   loop and autoplay map 1:1 (autoplay={true} → 5000 ms). showScrollButtons
   is always on in 5.0 (the Prev/Next controls). */
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { CarouselRail, type CarouselRailSlide } from '../../../media/CarouselRail/CarouselRail';

export interface LiquidGlassCarouselRailProps {
  items?: React.ReactNode[];
  label?: string;
  'aria-label'?: string;
  loop?: boolean;
  autoplay?: boolean | { interval: number };
  className?: string;
  [legacy: string]: unknown;
}

/**
 * 4.x `LiquidGlassCarouselRail` compat adapter (DEP-S0607).
 * @deprecated since 4.2.0, removed in 5.0.0. Use {@link CarouselRail from aura-glass/media}.
 */
export function LiquidGlassCarouselRail(props: LiquidGlassCarouselRailProps) {
  warnDeprecated('DEP-S0607');
  const { items = [], label, loop, autoplay, className } = props;
  const slides: CarouselRailSlide[] = items.map((c, i) => ({ id: `s${i}`, children: c }));
  return (
    <CarouselRail.Root
      label={label ?? props['aria-label'] ?? 'Carousel'}
      slides={slides}
      {...(loop !== undefined ? { loop } : {})}
      autoplay={autoplay === true ? { interval: 5000 } : autoplay ? autoplay : false}
      {...(className ? { className } : {})}
    />
  );
}
