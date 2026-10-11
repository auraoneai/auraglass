import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';
import { act, fireEvent, render } from '@testing-library/react';
import * as React from 'react';
import { CarouselRail, type CarouselRailSlide } from '../CarouselRail/CarouselRail';
import { AuraGlassProvider } from '../../theme';

const slides = (n: number): CarouselRailSlide[] =>
  Array.from({ length: n }, (_, i) => ({ id: `s${i}`, children: <div>slide {i + 1}</div> }));

/* jsdom has no IntersectionObserver: a recording double lets the tests play
   the observer entries a real swipe would produce. */
type Entry = { target: Element; isIntersecting: boolean; intersectionRatio: number };
class FakeIO {
  static all: FakeIO[] = [];
  observed: Element[] = [];
  constructor(private cb: (entries: Entry[]) => void, public opts?: IntersectionObserverInit) { FakeIO.all.push(this); }
  observe(el: Element) { this.observed.push(el); }
  unobserve(el: Element) { this.observed = this.observed.filter((e) => e !== el); }
  disconnect() { this.observed = []; }
  fire(entries: Entry[]) { act(() => { this.cb(entries); }); }
}
const viewportIO = (vp: Element) => {
  const io = [...FakeIO.all].reverse().find((o) => o.opts?.root === vp);
  if (!io) throw new Error('no IntersectionObserver rooted on the viewport');
  return io;
};
const show = (el: Element): Entry => ({ target: el, isIntersecting: true, intersectionRatio: 1 });
const hide = (el: Element): Entry => ({ target: el, isIntersecting: false, intersectionRatio: 0 });

const origIO = (globalThis as { IntersectionObserver?: unknown }).IntersectionObserver;
beforeEach(() => {
  FakeIO.all = [];
  (globalThis as { IntersectionObserver?: unknown }).IntersectionObserver = FakeIO;
});
afterEach(() => {
  (globalThis as { IntersectionObserver?: unknown }).IntersectionObserver = origIO;
  jest.useRealTimers();
  document.documentElement.removeAttribute('data-ag-continuous');
});

const q = (c: ParentNode, part: string) => c.querySelector(`[data-ag-part="${part}"]`) as HTMLElement;
const qa = (c: ParentNode, part: string) => Array.from(c.querySelectorAll<HTMLElement>(`[data-ag-part="${part}"]`));

/** Stub scrollTo + per-slide offsetLeft (jsdom has no layout). */
function stubLayout(container: HTMLElement, width = 300) {
  const vp = q(container, 'carousel-viewport');
  const scrollTo = jest.fn();
  (vp as unknown as { scrollTo: unknown }).scrollTo = scrollTo;
  Object.defineProperty(vp, 'clientWidth', { value: width, configurable: true });
  qa(container, 'carousel-slide').forEach((s, i) => {
    Object.defineProperty(s, 'offsetLeft', { value: i * width + 7, configurable: true });
    Object.defineProperty(s, 'offsetWidth', { value: width, configurable: true });
  });
  return { vp, scrollTo };
}

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
  it('Indicators buttons variant (Root alias): role=group slides, aria-current buttons', () => {
    const { container } = render(
      <CarouselRail.Root label="P" slides={slides(3)} indicatorsAs="buttons" />,
    );
    expect(container.querySelectorAll('[role="group"][aria-roledescription="slide"]').length).toBe(3);
    const btns = qa(container, 'carousel-indicator');
    expect(btns[0]!.getAttribute('aria-current')).toBe('true');
    expect(btns[0]!.getAttribute('aria-label')).toBe('Slide 1');
  });
  it('Prev/Next aria-disabled at ends when !loop; clicking advances', () => {
    const { container } = render(<CarouselRail.Root label="P" slides={slides(3)} />);
    const prev = q(container, 'carousel-prev');
    const next = q(container, 'carousel-next');
    expect(prev.getAttribute('aria-disabled')).toBe('true');
    fireEvent.click(next);
    const tabs = container.querySelectorAll('[role="tab"]');
    expect(tabs[1]!.getAttribute('aria-selected')).toBe('true');
    fireEvent.click(next); fireEvent.click(next);
    expect(next.getAttribute('aria-disabled')).toBe('true');
  });

  describe('REQ-SURF-146 composable parts', () => {
    it('renders composed children: Viewport + Prev/Next + Indicators as="buttons"', () => {
      const { container } = render(
        <CarouselRail.Root label="Composed" slides={slides(3)}>
          <CarouselRail.Viewport />
          <div className="toolbar"><CarouselRail.Prev /><CarouselRail.Next /></div>
          <CarouselRail.Indicators as="buttons" />
        </CarouselRail.Root>,
      );
      expect(qa(container, 'carousel-slide')).toHaveLength(3);
      expect(container.querySelector('.toolbar [data-ag-part="carousel-prev"]')).not.toBeNull();
      expect(container.querySelector('[role="tablist"]')).toBeNull();
      const dots = qa(container, 'carousel-indicator');
      expect(dots).toHaveLength(3);
      expect(dots[0]!.getAttribute('aria-current')).toBe('true');
      // the slides follow the Indicators variant (basic carousel → role=group)
      expect(qa(container, 'carousel-slide').every((s) => s.getAttribute('role') === 'group')).toBe(true);
      // no autoplay toggle unless composed
      expect(q(container, 'carousel-autoplay-toggle')).toBeNull();
    });
    it('Indicators `as` nested below Root children still sets the slide roles', () => {
      const { container } = render(
        <CarouselRail.Root label="Nested" slides={slides(2)}>
          <CarouselRail.Viewport />
          <footer><CarouselRail.Indicators as="buttons" /></footer>
        </CarouselRail.Root>,
      );
      expect(qa(container, 'carousel-slide').map((s) => s.getAttribute('role'))).toEqual(['group', 'group']);
    });
    it('composed Slide parts inside Viewport', () => {
      const data = slides(2);
      const { container } = render(
        <CarouselRail.Root label="Slides" slides={data}>
          <CarouselRail.Viewport>
            {data.map((s) => <CarouselRail.Slide key={s.id} id={s.id}>custom {s.id}</CarouselRail.Slide>)}
          </CarouselRail.Viewport>
          <CarouselRail.Indicators />
        </CarouselRail.Root>,
      );
      const slideEls = qa(container, 'carousel-slide');
      expect(slideEls.map((s) => s.textContent)).toEqual(['custom s0', 'custom s1']);
      expect(slideEls[1]!.getAttribute('aria-label')).toBe('2 of 2');
      expect(slideEls[1]!.getAttribute('role')).toBe('tabpanel');
    });
    it('numeric slidesPerView sets --_ag-slides-per-view; auto leaves it unset', () => {
      const { container } = render(<CarouselRail.Root label="P" slides={slides(4)} slidesPerView={2} />);
      expect(q(container, 'carousel').style.getPropertyValue('--_ag-slides-per-view')).toBe('2');
      const { container: c2 } = render(<CarouselRail.Root label="P" slides={slides(4)} />);
      expect(q(c2, 'carousel').style.getPropertyValue('--_ag-slides-per-view')).toBe('');
    });
  });

  describe('REQ-SURF-147 APG tabs keyboard', () => {
    it('ArrowRight on tab 1 moves DOM focus and selection to tab 2; Home/End; ArrowLeft', () => {
      const onIndexChange = jest.fn();
      const { container } = render(<CarouselRail.Root label="P" slides={slides(4)} onIndexChange={onIndexChange} />);
      const tabs = () => Array.from(container.querySelectorAll<HTMLElement>('[role="tab"]'));
      act(() => { tabs()[0]!.focus(); });
      fireEvent.keyDown(tabs()[0]!, { key: 'ArrowRight' });
      expect(document.activeElement).toBe(tabs()[1]);
      expect(tabs()[1]!.getAttribute('aria-selected')).toBe('true');
      expect(tabs()[1]!.tabIndex).toBe(0);
      expect(tabs()[0]!.tabIndex).toBe(-1);
      expect(onIndexChange).toHaveBeenLastCalledWith(1);
      fireEvent.keyDown(tabs()[1]!, { key: 'End' });
      expect(document.activeElement).toBe(tabs()[3]);
      expect(tabs()[3]!.getAttribute('aria-selected')).toBe('true');
      fireEvent.keyDown(tabs()[3]!, { key: 'ArrowRight' }); // !loop: stays on the last tab
      expect(document.activeElement).toBe(tabs()[3]);
      fireEvent.keyDown(tabs()[3]!, { key: 'Home' });
      expect(document.activeElement).toBe(tabs()[0]);
      expect(tabs()[0]!.getAttribute('aria-selected')).toBe('true');
      fireEvent.keyDown(tabs()[0]!, { key: 'ArrowLeft' });
      expect(document.activeElement).toBe(tabs()[0]);
    });
    it('loop wraps ArrowLeft from the first tab to the last', () => {
      const { container } = render(<CarouselRail.Root label="P" slides={slides(3)} loop />);
      const tabs = () => Array.from(container.querySelectorAll<HTMLElement>('[role="tab"]'));
      act(() => { tabs()[0]!.focus(); });
      fireEvent.keyDown(tabs()[0]!, { key: 'ArrowLeft' });
      expect(document.activeElement).toBe(tabs()[2]);
      expect(tabs()[2]!.getAttribute('aria-selected')).toBe('true');
    });
    it('RTL flips the arrow keys', () => {
      const { container } = render(<div dir="rtl"><CarouselRail.Root label="P" slides={slides(3)} /></div>);
      const tabs = () => Array.from(container.querySelectorAll<HTMLElement>('[role="tab"]'));
      act(() => { tabs()[0]!.focus(); });
      fireEvent.keyDown(tabs()[0]!, { key: 'ArrowLeft' });
      expect(document.activeElement).toBe(tabs()[1]);
    });
  });

  describe('REQ-SURF-148 viewport scrolling + IO index', () => {
    it('click indicator 3 → viewport.scrollTo with slide 3 offsetLeft (smooth at full motion)', () => {
      const onIndexChange = jest.fn();
      const { container } = render(<CarouselRail.Root label="P" slides={slides(4)} onIndexChange={onIndexChange} />);
      const { scrollTo } = stubLayout(container);
      fireEvent.click(qa(container, 'carousel-indicator')[2]!);
      expect(scrollTo).toHaveBeenCalledTimes(1);
      expect(scrollTo).toHaveBeenCalledWith({ left: 2 * 300 + 7, behavior: 'smooth' });
      expect(onIndexChange).toHaveBeenLastCalledWith(2);
      // buttons variant routes through the same helper
      const { container: c2 } = render(<CarouselRail.Root label="P" slides={slides(4)} indicatorsAs="buttons" />);
      const l2 = stubLayout(c2);
      fireEvent.click(qa(c2, 'carousel-indicator')[3]!);
      expect(l2.scrollTo).toHaveBeenCalledWith({ left: 3 * 300 + 7, behavior: 'smooth' });
    });
    it('reduced motion scrolls with behavior auto', () => {
      const { container } = render(
        <AuraGlassProvider motion="none"><CarouselRail.Root label="P" slides={slides(3)} /></AuraGlassProvider>,
      );
      const { scrollTo } = stubLayout(container);
      fireEvent.click(q(container, 'carousel-next'));
      expect(scrollTo).toHaveBeenCalledWith({ left: 300 + 7, behavior: 'auto' });
    });
    it('RTL aligns the slide end edge with the viewport end', () => {
      const { container } = render(<div dir="rtl"><CarouselRail.Root label="P" slides={slides(3)} /></div>);
      const { scrollTo } = stubLayout(container);
      fireEvent.click(q(container, 'carousel-next'));
      expect(scrollTo).toHaveBeenCalledWith({ left: (300 + 7) + 300 - 300, behavior: 'smooth' });
    });
    it('a swipe (IO entries) updates the index from the latest value, never a stale one', () => {
      const onIndexChange = jest.fn();
      const { container } = render(<CarouselRail.Root label="P" slides={slides(4)} onIndexChange={onIndexChange} />);
      const vp = q(container, 'carousel-viewport');
      const els = qa(container, 'carousel-slide');
      const io = viewportIO(vp);
      expect(io.observed).toEqual(els);
      expect(io.opts?.threshold).toBe(0.6);
      io.fire([show(els[0]!)]);
      expect(onIndexChange).not.toHaveBeenCalled();
      io.fire([hide(els[0]!), show(els[2]!)]);
      expect(onIndexChange).toHaveBeenLastCalledWith(2);
      expect(container.querySelectorAll('[role="tab"]')[2]!.getAttribute('aria-selected')).toBe('true');
      // swiping back to slide 0 must register: the observer reads the latest index (2), not the mount-time 0
      io.fire([hide(els[2]!), show(els[0]!)]);
      expect(onIndexChange).toHaveBeenLastCalledWith(0);
      expect(container.querySelectorAll('[role="tab"]')[0]!.getAttribute('aria-selected')).toBe('true');
    });
    it('slides passed during a programmatic scroll do not hijack the index', () => {
      const onIndexChange = jest.fn();
      const { container } = render(<CarouselRail.Root label="P" slides={slides(4)} onIndexChange={onIndexChange} />);
      stubLayout(container);
      const vp = q(container, 'carousel-viewport');
      const els = qa(container, 'carousel-slide');
      const io = viewportIO(vp);
      io.fire([show(els[0]!)]);
      fireEvent.click(qa(container, 'carousel-indicator')[3]!);
      expect(onIndexChange).toHaveBeenLastCalledWith(3);
      io.fire([hide(els[0]!), show(els[1]!)]);
      io.fire([hide(els[1]!), show(els[2]!)]);
      io.fire([hide(els[2]!), show(els[3]!)]);
      expect(onIndexChange.mock.calls.map((c) => c[0])).toEqual([3]);
      // after arrival, a user swipe is tracked again
      io.fire([hide(els[3]!), show(els[2]!)]);
      expect(onIndexChange).toHaveBeenLastCalledWith(2);
    });
  });

  describe('REQ-SURF-149 autoplay gate', () => {
    it('autoplay prop alone: no rotation and the toggle offers Start (aria-pressed=false)', () => {
      jest.useFakeTimers();
      const onIndexChange = jest.fn();
      const { container } = render(<CarouselRail.Root label="P" slides={slides(3)} autoplay={{ interval: 5000 }} onIndexChange={onIndexChange} />);
      act(() => { jest.advanceTimersByTime(20000); });
      expect(onIndexChange).not.toHaveBeenCalled();
      const toggle = q(container, 'carousel-autoplay-toggle');
      expect(toggle.getAttribute('aria-label')).toBe('Start automatic slide show');
      expect(toggle.getAttribute('aria-pressed')).toBe('false');
      expect(toggle.getAttribute('aria-disabled')).toBe('true');
      expect(q(container, 'carousel').getAttribute('data-state')).toBe('stopped');
    });
    it('autoplay toggle absent without autoplay prop', () => {
      const { container } = render(<CarouselRail.Root label="P" slides={slides(2)} />);
      expect(q(container, 'carousel-autoplay-toggle')).toBeNull();
    });
    it('prop + gate (allowContinuous, motion full, [data-ag-continuous=on]) → rotates every interval', () => {
      jest.useFakeTimers();
      const onIndexChange = jest.fn();
      const { container } = render(
        <AuraGlassProvider allowContinuous motion="full">
          <CarouselRail.Root label="P" slides={slides(3)} autoplay={{ interval: 5000 }} loop onIndexChange={onIndexChange} />
        </AuraGlassProvider>,
      );
      expect(document.documentElement.getAttribute('data-ag-continuous')).toBe('on');
      const toggle = q(container, 'carousel-autoplay-toggle');
      expect(toggle.getAttribute('aria-label')).toBe('Stop automatic slide show');
      expect(toggle.getAttribute('aria-pressed')).toBe('true');
      expect(q(container, 'carousel').getAttribute('data-state')).toBe('playing');
      act(() => { jest.advanceTimersByTime(4000); });
      expect(onIndexChange).not.toHaveBeenCalled();
      act(() => { jest.advanceTimersByTime(1200); });
      expect(onIndexChange).toHaveBeenCalledTimes(1);
      expect(onIndexChange).toHaveBeenLastCalledWith(1);
      act(() => { jest.advanceTimersByTime(5200); });
      expect(onIndexChange).toHaveBeenLastCalledWith(2);
      // the user stops it
      fireEvent.click(toggle);
      expect(toggle.getAttribute('aria-label')).toBe('Start automatic slide show');
      expect(toggle.getAttribute('aria-pressed')).toBe('false');
      onIndexChange.mockClear();
      act(() => { jest.advanceTimersByTime(20000); });
      expect(onIndexChange).not.toHaveBeenCalled();
    });
    it('a hidden document pauses rotation; visible again resumes', () => {
      jest.useFakeTimers();
      const onIndexChange = jest.fn();
      const { container } = render(
        <AuraGlassProvider allowContinuous motion="full">
          <CarouselRail.Root label="P" slides={slides(3)} autoplay={{ interval: 5000 }} loop onIndexChange={onIndexChange} />
        </AuraGlassProvider>,
      );
      const hiddenDesc = Object.getOwnPropertyDescriptor(Document.prototype, 'hidden')!;
      try {
        Object.defineProperty(document, 'hidden', { value: true, configurable: true });
        act(() => { document.dispatchEvent(new Event('visibilitychange')); });
        expect(q(container, 'carousel').getAttribute('data-state')).toBe('stopped');
        act(() => { jest.advanceTimersByTime(20000); });
        expect(onIndexChange).not.toHaveBeenCalled();
      } finally {
        delete (document as unknown as { hidden?: boolean }).hidden;
        Object.defineProperty(Document.prototype, 'hidden', hiddenDesc);
      }
      act(() => { document.dispatchEvent(new Event('visibilitychange')); });
      expect(q(container, 'carousel').getAttribute('data-state')).toBe('playing');
      act(() => { jest.advanceTimersByTime(5200); });
      expect(onIndexChange).toHaveBeenCalledWith(1);
    });
    it('hover and focus inside pause rotation', () => {
      jest.useFakeTimers();
      const onIndexChange = jest.fn();
      const { container } = render(
        <AuraGlassProvider allowContinuous motion="full">
          <CarouselRail.Root label="P" slides={slides(3)} autoplay={{ interval: 5000 }} loop onIndexChange={onIndexChange} />
        </AuraGlassProvider>,
      );
      const root = q(container, 'carousel');
      fireEvent.mouseEnter(root);
      expect(root.getAttribute('data-state')).toBe('stopped');
      act(() => { jest.advanceTimersByTime(12000); });
      expect(onIndexChange).not.toHaveBeenCalled();
      fireEvent.mouseLeave(root);
      act(() => { q(container, 'carousel-next').focus(); });
      expect(root.getAttribute('data-state')).toBe('stopped');
      act(() => { jest.advanceTimersByTime(12000); });
      expect(onIndexChange).not.toHaveBeenCalled();
      // focus leaving the rail resumes rotation
      act(() => { (document.activeElement as HTMLElement).blur(); });
      expect(root.getAttribute('data-state')).toBe('playing');
      act(() => { jest.advanceTimersByTime(5200); });
      expect(onIndexChange).toHaveBeenLastCalledWith(1);
    });
    it('allowContinuous without motion=full keeps the gate closed', () => {
      jest.useFakeTimers();
      const onIndexChange = jest.fn();
      const { container } = render(
        <AuraGlassProvider allowContinuous motion="calm">
          <CarouselRail.Root label="P" slides={slides(3)} autoplay={{ interval: 5000 }} loop onIndexChange={onIndexChange} />
        </AuraGlassProvider>,
      );
      act(() => { jest.advanceTimersByTime(20000); });
      expect(onIndexChange).not.toHaveBeenCalled();
      expect(q(container, 'carousel-autoplay-toggle').getAttribute('aria-label')).toBe('Start automatic slide show');
    });
  });

  describe('REQ-SURF-150 materials', () => {
    it('overMedia: root data-ag-backdrop=media; Prev/Next/Indicators thin clear chrome; slides content-raised', () => {
      const { container } = render(<CarouselRail.Root label="P" slides={slides(3)} overMedia autoplay={{ interval: 6000 }} />);
      expect(q(container, 'carousel').getAttribute('data-ag-backdrop')).toBe('media');
      for (const part of ['carousel-prev', 'carousel-next', 'carousel-indicators']) {
        const el = q(container, part);
        expect(el.classList.contains('ag-surface')).toBe(true);
        expect(el.getAttribute('data-ag-surface')).toBe('');
        expect(el.getAttribute('data-ag-layer')).toBe('chrome');
        expect(el.getAttribute('data-ag-variant')).toBe('clear');
        expect(el.getAttribute('data-ag-thickness')).toBe('thin');
      }
      for (const s of qa(container, 'carousel-slide')) {
        expect(s.classList.contains('ag-surface')).toBe(true);
        expect(s.getAttribute('data-ag-layer')).toBe('content');
        expect(s.getAttribute('data-ag-content')).toBe('content-raised');
      }
      // exactly 3 chrome surfaces per rail (blur budget ≤3 fine): dots and the toggle carry none
      expect(container.querySelectorAll('[data-ag-surface][data-ag-layer="chrome"]')).toHaveLength(3);
      expect(q(container, 'carousel-autoplay-toggle').hasAttribute('data-ag-surface')).toBe(false);
      expect(qa(container, 'carousel-indicator').some((d) => d.hasAttribute('data-ag-surface'))).toBe(false);
    });
    it('not over media: regular chrome and no data-ag-backdrop', () => {
      const { container } = render(<CarouselRail.Root label="P" slides={slides(2)} />);
      expect(q(container, 'carousel').hasAttribute('data-ag-backdrop')).toBe(false);
      expect(q(container, 'carousel-next').getAttribute('data-ag-variant')).toBe('regular');
      expect(q(container, 'carousel-indicators').getAttribute('data-ag-variant')).toBe('regular');
    });
    it('no inline optics: no style attribute carries a blur', () => {
      const { container } = render(<CarouselRail.Root label="P" slides={slides(3)} overMedia />);
      const styled = Array.from(container.querySelectorAll<HTMLElement>('[style]')).map((e) => e.getAttribute('style') ?? '');
      expect(styled.some((s) => /backdrop|blur\(/.test(s))).toBe(false);
    });
  });
});
