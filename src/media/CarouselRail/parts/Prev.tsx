'use client';
import * as React from 'react';
import { materialProps } from '../../../material';
import { useCarouselRail } from '../crContext';
import { MediaGlyph } from '../../glyphs';

export function Prev(): React.ReactElement {
  const c = useCarouselRail('Prev');
  const atEnd = !c.loop && c.index === 0;
  return (
    <button
      type="button"
      data-ag-part="carousel-prev"
      className="ag-carousel-nav"
      {...materialProps({ layer: 'chrome', variant: c.overMedia ? 'clear' : 'regular', thickness: 'thin', shape: 'capsule' })}
      aria-label="Previous slide"
      aria-disabled={atEnd}
      onClick={() => !atEnd && c.step(-1)}
    ><MediaGlyph name="chevron-left" /></button>
  );
}
