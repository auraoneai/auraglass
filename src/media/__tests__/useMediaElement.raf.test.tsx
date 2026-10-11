import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';
import { act, render } from '@testing-library/react';
import * as React from 'react';
import { useMediaElement } from '../useMediaElement';

/* REQ-SURF-131: the --_ag-media-progress frame loop holds one MAT
 * subscribeFrame only while playing, visible and intersecting. rAF is
 * captured so a "frame" is: run every callback queued since the last frame.
 * While the hook holds no subscription the shared ticker re-arms nothing, so
 * "0 frame callbacks" = 0 new rAF registrations and no progress write. */

let queue: FrameRequestCallback[] = [];
let registrations = 0;
const origRaf = window.requestAnimationFrame;
const origCaf = window.cancelAnimationFrame;
const origIO = (globalThis as { IntersectionObserver?: unknown }).IntersectionObserver;

class FakeIO {
  static instances: FakeIO[] = [];
  targets: Element[] = [];
  constructor(private cb: IntersectionObserverCallback) { FakeIO.instances.push(this); }
  observe(el: Element) { this.targets.push(el); }
  unobserve() {}
  disconnect() { this.targets = []; }
  trigger(isIntersecting: boolean) {
    for (const target of this.targets) {
      this.cb([{ isIntersecting, target } as IntersectionObserverEntry], this as unknown as IntersectionObserver);
    }
  }
}
/* The hook's own observer is the one observing the media root. */
const rootObserver = (root: Element) => FakeIO.instances.filter((o) => o.targets.includes(root)).at(-1)!;

beforeEach(() => {
  queue = [];
  registrations = 0;
  FakeIO.instances = [];
  window.requestAnimationFrame = ((cb: FrameRequestCallback) => { queue.push(cb); registrations++; return registrations; }) as never;
  window.cancelAnimationFrame = (() => {}) as never;
  (globalThis as { IntersectionObserver?: unknown }).IntersectionObserver = FakeIO;
});
afterEach(() => {
  window.requestAnimationFrame = origRaf;
  window.cancelAnimationFrame = origCaf;
  (globalThis as { IntersectionObserver?: unknown }).IntersectionObserver = origIO;
});

/** Runs one frame; returns how many rAF registrations that frame made. */
function frame(now = 16): number {
  const pending = queue;
  queue = [];
  const before = registrations;
  for (const cb of pending) cb(now);
  return registrations - before;
}

function mount() {
  function H() {
    const ref = React.useRef<HTMLVideoElement>(null);
    useMediaElement(ref);
    return <div data-ag-media-root=""><video ref={ref} /></div>;
  }
  const utils = render(<H />);
  const video = utils.container.querySelector('video')!;
  const root = utils.container.querySelector('[data-ag-media-root]') as HTMLElement;
  Object.defineProperty(video, 'duration', { value: 100, configurable: true });
  Object.defineProperty(video, 'currentTime', { value: 25, configurable: true, writable: true });
  const progress = () => root.style.getPropertyValue('--_ag-media-progress');
  const play = () => {
    Object.defineProperty(video, 'paused', { value: false, configurable: true });
    act(() => { video.dispatchEvent(new Event('play')); });
  };
  /** play + report the root on screen → the frame loop is running. */
  const startRunning = () => {
    play();
    act(() => { rootObserver(root).trigger(true); });
    expect(registrations).toBeGreaterThan(0);
    expect(frame()).toBe(1); // ticker re-arms while subscribed
    expect(progress()).toBe('0.2500');
    root.style.removeProperty('--_ag-media-progress');
  };
  return { ...utils, video, root, progress, play, startRunning };
}

describe('useMediaElement progress frames (REQ-SURF-131)', () => {
  it('playing + visible + intersecting writes --_ag-media-progress each frame', () => {
    const m = mount();
    m.startRunning();
    (m.video as { currentTime: number }).currentTime = 50;
    expect(frame()).toBe(1);
    expect(m.progress()).toBe('0.5000');
    m.unmount();
    expect(frame()).toBe(0);
  });

  it('paused: 0 frame callbacks — none while paused, and 0 after 1 frame once paused', () => {
    const m = mount();
    act(() => { rootObserver(m.root)?.trigger(true); });
    expect(registrations).toBe(0);
    m.startRunning();
    Object.defineProperty(m.video, 'paused', { value: true, configurable: true });
    act(() => { m.video.dispatchEvent(new Event('pause')); });
    expect(frame()).toBe(0);
    expect(m.progress()).toBe('');
    expect(frame()).toBe(0);
    m.unmount();
  });

  it('hidden: 0 frame callbacks after 1 frame; resumes when visible again', () => {
    const m = mount();
    m.startRunning();
    const hidden = jest.spyOn(document, 'hidden', 'get').mockReturnValue(true);
    try {
      act(() => { document.dispatchEvent(new Event('visibilitychange')); });
      expect(frame()).toBe(0);
      expect(m.progress()).toBe('');
      expect(frame()).toBe(0);
    } finally { hidden.mockRestore(); }
    act(() => { document.dispatchEvent(new Event('visibilitychange')); });
    expect(registrations).toBeGreaterThan(0);
    expect(frame()).toBe(1);
    expect(m.progress()).toBe('0.2500');
    m.unmount();
  });

  it('hidden at play time: never subscribes', () => {
    const hidden = jest.spyOn(document, 'hidden', 'get').mockReturnValue(true);
    try {
      const m = mount();
      m.play();
      act(() => { rootObserver(m.root).trigger(true); });
      expect(registrations).toBe(0);
      expect(m.progress()).toBe('');
      m.unmount();
    } finally { hidden.mockRestore(); }
  });

  it('offscreen: 0 frame callbacks after 1 frame; none before the root is reported on screen', () => {
    const m = mount();
    m.play();
    expect(registrations).toBe(0); // not yet reported intersecting
    act(() => { rootObserver(m.root).trigger(true); });
    expect(frame()).toBe(1);
    act(() => { rootObserver(m.root).trigger(false); });
    m.root.style.removeProperty('--_ag-media-progress');
    expect(frame()).toBe(0);
    expect(m.progress()).toBe('');
    expect(frame()).toBe(0);
    m.unmount();
  });
});
