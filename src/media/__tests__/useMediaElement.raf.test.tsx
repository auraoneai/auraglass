import { describe, expect, it, jest } from '@jest/globals';
import { act, render } from '@testing-library/react';
import * as React from 'react';
import { useMediaElement } from '../useMediaElement';

describe('useMediaElement progress frames (REQ-SURF-131)', () => {
  it('0 frame callbacks while paused; writes --_ag-media-progress while playing', () => {
    const rafCbs: FrameRequestCallback[] = [];
    const origRaf = window.requestAnimationFrame;
    window.requestAnimationFrame = ((cb: FrameRequestCallback) => { rafCbs.push(cb); return rafCbs.length; }) as never;
    const ioCalls: Element[] = [];
    (globalThis as { IntersectionObserver?: unknown }).IntersectionObserver = class {
      constructor(private cb: IntersectionObserverCallback) {}
      observe(el: Element) { ioCalls.push(el); }
      unobserve() {} disconnect() {}
      trigger(is: boolean, el: Element) { this.cb([{ isIntersecting: is, target: el } as IntersectionObserverEntry], this as never); }
    };
    try {
      function H() {
        const ref = React.useRef<HTMLVideoElement>(null);
        useMediaElement(ref);
        return <div data-ag-media-root=""><video ref={ref} /></div>;
      }
      const { container } = render(<H />);
      const video = container.querySelector('video')!;
      // paused → no frame subscription at all
      expect(rafCbs.length).toBe(0);
      // simulate playing state via the store event
      Object.defineProperty(video, 'paused', { value: false, configurable: true });
      act(() => { video.dispatchEvent(new Event('play')); });
      // now a frame subscription exists; run one frame
      const frames = rafCbs.length;
      expect(frames).toBeGreaterThan(0);
      const root = container.querySelector('[data-ag-media-root]') as HTMLElement;
      Object.defineProperty(video, 'duration', { value: 100 });
      Object.defineProperty(video, 'currentTime', { value: 25 });
      for (const cb of rafCbs.slice(0, 1)) cb(16);
      expect(root.style.getPropertyValue('--_ag-media-progress')).toBe('0.2500');
    } finally {
      window.requestAnimationFrame = origRaf;
    }
  });
  it('hidden document writes nothing', () => {
    const rafCbs: FrameRequestCallback[] = [];
    const origRaf = window.requestAnimationFrame;
    window.requestAnimationFrame = ((cb: FrameRequestCallback) => { rafCbs.push(cb); return 1; }) as never;
    try {
      function H() {
        const ref = React.useRef<HTMLVideoElement>(null);
        useMediaElement(ref);
        return <div data-ag-media-root=""><video ref={ref} /></div>;
      }
      const { container } = render(<H />);
      const video = container.querySelector('video')!;
      Object.defineProperty(video, 'paused', { value: false, configurable: true });
      act(() => { video.dispatchEvent(new Event('play')); });
      const root = container.querySelector('[data-ag-media-root]') as HTMLElement;
      const spy = jest.spyOn(document, 'hidden', 'get').mockReturnValue(true);
      for (const cb of rafCbs.slice(0, 1)) cb(16);
      expect(root.style.getPropertyValue('--_ag-media-progress')).toBe('');
      spy.mockRestore();
    } finally { window.requestAnimationFrame = origRaf; }
  });
});
