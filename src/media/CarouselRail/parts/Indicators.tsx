'use client';
import * as React from 'react';
import { useCarouselRail } from '../crContext';

export function Indicators(): React.ReactElement {
  const c = useCarouselRail('Indicators');
  const [focused, setFocused] = React.useState(false);
  if (c.indicatorsAs === 'buttons') {
    return (
      <div data-ag-part="carousel-indicators" className="ag-carousel-indicators">
        {c.slides.map((s, i) => (
          <button
            key={s.id}
            type="button"
            aria-label={`Slide ${i + 1}`}
            aria-current={i === c.index}
            data-ag-part="carousel-indicator"
            onClick={() => c.goTo(i)}
          />
        ))}
      </div>
    );
  }
  return (
    <div
      role="tablist"
      data-ag-part="carousel-indicators"
      className="ag-carousel-indicators"
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      onKeyDown={(e) => {
        if (!focused) return;
        if (e.key === 'ArrowLeft') { c.step(-1); e.preventDefault(); }
        if (e.key === 'ArrowRight') { c.step(1); e.preventDefault(); }
      }}
    >
      {c.slides.map((s, i) => (
        <button
          key={s.id}
          role="tab"
          type="button"
          aria-selected={i === c.index}
          aria-controls={`ag-slide-${s.id}`}
          tabIndex={i === c.index ? 0 : -1}
          data-ag-part="carousel-indicator"
          aria-label={s.label ?? `Slide ${i + 1}`}
          onClick={() => c.goTo(i)}
        />
      ))}
    </div>
  );
}
