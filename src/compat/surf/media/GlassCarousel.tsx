'use client';
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { CarouselRail, type CarouselRailSlide } from '../../../media/CarouselRail/CarouselRail';

export interface GlassCarouselProps {
  children?: React.ReactNode;
  label?: string;
  infinite?: boolean;
  slidesToShow?: number;
  autoPlay?: boolean;
  autoPlayInterval?: number;
}

export function GlassCarousel(props: GlassCarouselProps) {
  warnDeprecated('GlassCarousel');
  const children = React.Children.toArray(props.children);
  const slides: CarouselRailSlide[] = children.map((c, i) => ({ id: `s${i}`, children: c }));
  return (
    <CarouselRail.Root
      label={props.label ?? 'Carousel'}
      slides={slides}
      loop={props.infinite}
      slidesPerView={props.slidesToShow ?? 'auto'}
      autoplay={props.autoPlay ? { interval: Math.max(5000, props.autoPlayInterval ?? 5000) } : false}
    />
  );
}
