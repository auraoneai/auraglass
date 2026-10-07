import { describe, expect, it, jest } from '@jest/globals';
import { act, fireEvent, render } from '@testing-library/react';
import * as React from 'react';
import { CarouselRail, type CarouselRailSlide } from '../CarouselRail/CarouselRail';

const slides = (n: number): CarouselRailSlide[] =>
  Array.from({ length: n }, (_, i) => ({ id: `s${i}`, children: <div>slide {i + 1}</div> }));

describe('CarouselRail (REQ-SURF-146..150)', () => {
  it('section has aria-roledescription=carousel and required label', () => {
    const { container } = render(<CarouselRail.Root label="Photos" slides={slides(3)} />);
    const root = container.querySelector('section')!;
    expect(root.getAttribute('aria-roledescription')).toBe('carousel');
    expect(root.getAttribute('aria-label')).toBe('Photos');
    expect(root.getAttribute('data-state')).toBe('stopped');
  });
  it('Indicators default tabs: tablist/tab/aria-selected/tabpanel on slides', () => {
    const { container } = render(<CarouselRail.Root label="P" slides={slides(3)} />);
    const tabs = container.querySelectorAll('[role="tab"]');
    expect(tabs.length).toBe(3);
    expect(tabs[0]!.getAttribute('aria-selected')).toBe('true');
    expect(tabs[0]!.getAttribute('aria-controls')).toBe('ag-slide-s0');
    const panels = container.querySelectorAll('[role="tabpanel"]');
    expect(panels.length).toBe(3);
    expect(panels[1]!.getAttribute('aria-label')).toBe('2 of 3');
    expect(panels[1]!.getAttribute('aria-roledescription')).toBe('slide');
  });
  it('Indicators buttons variant: role=group slides, aria-current buttons', () => {
    const { container } = render(
      <CarouselRail.Root label="P" slides={slides(3)} indicatorsAs="buttons" />,
    );
    expect(container.querySelectorAll('[role="group"]').length).toBe(3);
    const btns = container.querySelectorAll('[data-ag-part="carousel-indicator"]');
    expect(btns[0]!.getAttribute('aria-current')).toBe('true');
    expect(btns[0]!.getAttribute('aria-label')).toBe('Slide 1');
  });
  it('Prev/Next aria-disabled at ends when !loop; clicking advances', () => {
    const { container } = render(<CarouselRail.Root label="P" slides={slides(3)} />);
    const prev = container.querySelector('[data-ag-part="carousel-prev"]')!;
    const next = container.querySelector('[data-ag-part="carousel-next"]')!;
    expect(prev.getAttribute('aria-disabled')).toBe('true');
    fireEvent.click(next);
    const tabs = container.querySelectorAll('[role="tab"]');
    expect(tabs[1]!.getAttribute('aria-selected')).toBe('true');
    fireEvent.click(next); fireEvent.click(next);
    expect(next.getAttribute('aria-disabled')).toBe('true');
  });
  it('autoplay prop alone does NOT rotate (no continuous gate)', () => {
    jest.useFakeTimers();
    const onIndexChange = jest.fn();
    render(<CarouselRail.Root label="P" slides={slides(3)} autoplay={{ interval: 5000 }} onIndexChange={onIndexChange} />);
    act(() => { jest.advanceTimersByTime(20000); });
    expect(onIndexChange).not.toHaveBeenCalled();
    jest.useRealTimers();
  });
  it('autoplay toggle absent without autoplay prop; present with it', () => {
    const { container } = render(<CarouselRail.Root label="P" slides={slides(2)} />);
    expect(container.querySelector('[data-ag-part="carousel-autoplay-toggle"]')).toBeNull();
    const { container: c2 } = render(<CarouselRail.Root label="P" slides={slides(2)} autoplay={{ interval: 6000 }} />);
    const toggle = c2.querySelector('[data-ag-part="carousel-autoplay-toggle"]')!;
    expect(toggle.getAttribute('aria-label')).toBe('Stop automatic slide show');
  });
});
