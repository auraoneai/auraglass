'use client';
import * as React from 'react';
import { materialProps } from '../../../material';
import { useCarouselRail } from '../crContext';
import { MediaGlyph } from '../../glyphs';

export function Next(): React.ReactElement {
  const c = useCarouselRail('Next');
  const atEnd = !c.loop && c.index === c.count - 1;
  return (
    <button
      type="button"
      data-ag-part="carousel-next"
      className="ag-carousel-nav"
      {...materialProps({ layer: 'chrome', variant: c.overMedia ? 'clear' : 'regular', thickness: 'thin', shape: 'capsule' })}
      aria-label="Next slide"
      aria-disabled={atEnd}
      onClick={() => !atEnd && c.step(1)}
    ><MediaGlyph name="chevron-right" /></button>
  );
}
