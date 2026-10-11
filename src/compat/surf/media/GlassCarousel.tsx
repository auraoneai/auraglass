/* GlassCarousel — 4.x compat adapter (REQ-SURF-13, DEP-S0606) →
   CarouselRail. children or items [{id, content}] → slides, infinite → loop,
   slidesToShow → slidesPerView, initialIndex → defaultIndex,
   onSlideChange(index) ← onIndexChange, autoPlay + autoPlayInterval →
   autoplay (5.0 floor 5000 ms, WCAG 2.2.2). Arrows/dots are always the
   CarouselRail controls. */
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { CarouselRail, type CarouselRailSlide } from '../../../media/CarouselRail/CarouselRail';

export interface CarouselItem {
  id: string;
  content: React.ReactNode;
  title?: string;
}

export interface GlassCarouselProps {
  children?: React.ReactNode;
  items?: CarouselItem[];
  label?: string;
  'aria-label'?: string;
  infinite?: boolean;
  slidesToShow?: number;
  initialIndex?: number;
  onSlideChange?: (index: number) => void;
  autoPlay?: boolean;
  autoPlayInterval?: number;
  className?: string;
  [legacy: string]: unknown;
}

/**
 * 4.x `GlassCarousel` compat adapter (DEP-S0606).
 * @deprecated since 4.2.0, removed in 5.0.0. Use {@link CarouselRail from aura-glass/media (infinite to loop, autoPlay gated)}.
 */
export function GlassCarousel(props: GlassCarouselProps) {
  warnDeprecated('DEP-S0606');
  const { children, items, label, infinite, slidesToShow, initialIndex, onSlideChange, autoPlay, autoPlayInterval, className } = props;
  const slides: CarouselRailSlide[] = items
    ? items.map((it) => ({ id: it.id, children: it.content }))
    : React.Children.toArray(children).map((c, i) => ({ id: `s${i}`, children: c }));
  return (
    <CarouselRail.Root
      label={label ?? props['aria-label'] ?? 'Carousel'}
      slides={slides}
      {...(infinite !== undefined ? { loop: infinite } : {})}
      slidesPerView={slidesToShow ?? 'auto'}
      {...(initialIndex !== undefined ? { defaultIndex: initialIndex } : {})}
      {...(onSlideChange ? { onIndexChange: onSlideChange } : {})}
      autoplay={autoPlay ? { interval: Math.max(5000, autoPlayInterval ?? 5000) } : false}
      {...(className ? { className } : {})}
    />
  );
}
