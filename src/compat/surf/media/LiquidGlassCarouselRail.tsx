'use client';
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { CarouselRail, type CarouselRailSlide } from '../../../media/CarouselRail/CarouselRail';

export interface LiquidGlassCarouselRailProps {
  items?: React.ReactNode[];
  label?: string;
  loop?: boolean;
  autoplay?: boolean | { interval: number };
}

export function LiquidGlassCarouselRail(props: LiquidGlassCarouselRailProps) {
  warnDeprecated('DEP-S0607';
  const slides: CarouselRailSlide[] = (props.items ?? []).map((c, i) => ({ id: `s${i}`, children: c }));
  return (
    <CarouselRail.Root
      label={props.label ?? 'Carousel'}
      slides={slides}
      loop={props.loop}
      autoplay={props.autoplay === true ? { interval: 5000 }
        : props.autoplay ? props.autoplay : false}
    />
  );
}
