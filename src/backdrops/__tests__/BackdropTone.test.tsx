/** @jest-environment jsdom */
// BackdropTone (SURF-435, REQ-SURF-157): plays video only under the
// continuous gate + intersecting + !document.hidden; the pause control exists
// only while playing or user-paused. Drift pause attributes (REQ-SURF-159).
import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';
import { act, fireEvent, render } from '@testing-library/react';
import * as React from 'react';
import { Backdrop } from '../Backdrop';
import { clearToneCache } from '../sampling/toneCache';
import { subscribeFrame } from '../../motion';

/* Fake IntersectionObserver: BackdropTone's own observer and MAT's shared
 * offscreen observer both construct through it; fire() drives one entry. */
class FakeIO {
  static instances: FakeIO[] = [];
  observed = new Set<Element>();
  constructor(private cb: (entries: Array<{ isIntersecting: boolean; target: Element }>) => void) { FakeIO.instances.push(this); }
  observe(el: Element) { this.observed.add(el); }
  unobserve(el: Element) { this.observed.delete(el); }
  disconnect() { this.observed.clear(); }
  takeRecords() { return []; }
  static fire(target: Element, isIntersecting: boolean) {
    for (const io of FakeIO.instances) if (io.observed.has(target)) io.cb([{ isIntersecting, target }]);
  }
}

const mockPrefs = { allowContinuous: true };
jest.mock('../../theme', () => {
  const actual = jest.requireActual('../../theme') as Record<string, unknown>;
  return { ...actual, useResolvedPreferences: () => ({ allowContinuous: mockPrefs.allowContinuous, motion: 'full' }) };
});

const setHidden = (hidden: boolean) => {
  Object.defineProperty(document, 'hidden', { configurable: true, get: () => hidden });
  document.dispatchEvent(new Event('visibilitychange'));
};

describe('BackdropTone playback gate + pause toggle (REQ-SURF-157)', () => {
  const realIO = globalThis.IntersectionObserver;
  const play = jest.fn(function (this: HTMLMediaElement) {
    (this as unknown as { _paused: boolean })._paused = false;
    return Promise.resolve();
  });
  const pause = jest.fn(function (this: HTMLMediaElement) { (this as unknown as { _paused: boolean })._paused = true; });
  beforeEach(() => {
    mockPrefs.allowContinuous = true;
    play.mockClear();
    pause.mockClear();
    globalThis.IntersectionObserver = FakeIO as unknown as typeof IntersectionObserver;
    Object.defineProperty(HTMLMediaElement.prototype, 'paused', {
      configurable: true, get(this: { _paused?: boolean }) { return this._paused ?? true; },
    });
    Object.defineProperty(HTMLMediaElement.prototype, 'play', { configurable: true, value: play });
    Object.defineProperty(HTMLMediaElement.prototype, 'pause', { configurable: true, value: pause });
  });
  afterEach(() => {
    globalThis.IntersectionObserver = realIO;
    setHidden(false);
  });
  const mount = () => {
    const { container } = render(<Backdrop preset="video" src="/v.mp4" poster="/p.jpg" mediaTone="dark" />);
    const video = container.querySelector('video')!;
    const button = () => container.querySelector('[data-ag-part="backdrop-pause"]');
    return { video, button };
  };

  it('renders no pause control and never plays until the video intersects', () => {
    const { button } = mount();
    expect(play).not.toHaveBeenCalled();
    expect(button()).toBeNull();
  });

  it('plays once intersecting under the gate; the toggle appears with a stable name and aria-pressed', async () => {
    const { video, button } = mount();
    await act(async () => { FakeIO.fire(video, true); });
    expect(play).toHaveBeenCalledTimes(1);
    expect(video.paused).toBe(false);
    expect(button()!.textContent).toBe('Pause background video');
    expect(button()!.getAttribute('aria-pressed')).toBe('false');

    await act(async () => { fireEvent.click(button()!); });
    expect(pause).toHaveBeenCalledTimes(1);
    expect(video.paused).toBe(true);
    // the user's pause holds the control in place so it can be resumed
    expect(button()!.textContent).toBe('Pause background video');
    expect(button()!.getAttribute('aria-pressed')).toBe('true');

    await act(async () => { fireEvent.click(button()!); });
    expect(play).toHaveBeenCalledTimes(2);
    expect(video.paused).toBe(false);
    expect(button()!.getAttribute('aria-pressed')).toBe('false');
  });

  it('scrolling out or hiding the tab pauses and removes the control', async () => {
    const { video, button } = mount();
    await act(async () => { FakeIO.fire(video, true); });
    expect(button()).not.toBeNull();
    await act(async () => { FakeIO.fire(video, false); });
    expect(pause).toHaveBeenCalledTimes(1);
    expect(button()).toBeNull();

    await act(async () => { FakeIO.fire(video, true); });
    expect(play).toHaveBeenCalledTimes(2);
    await act(async () => { setHidden(true); });
    expect(pause).toHaveBeenCalledTimes(2);
    expect(video.paused).toBe(true);
    expect(button()).toBeNull();
  });

  it('without allowContinuous the video never plays and no control renders', async () => {
    mockPrefs.allowContinuous = false;
    const { video, button } = mount();
    await act(async () => { FakeIO.fire(video, true); });
    expect(play).not.toHaveBeenCalled();
    expect(button()).toBeNull();
  });
});

describe('drift pause attributes (REQ-SURF-159)', () => {
  const realIO = globalThis.IntersectionObserver;
  beforeEach(() => {
    globalThis.IntersectionObserver = FakeIO as unknown as typeof IntersectionObserver;
  });
  afterEach(() => {
    globalThis.IntersectionObserver = realIO;
    setHidden(false);
  });

  it('motion="drift" observes the root through MAT observeOffscreen and marks a hidden tab', async () => {
    const { container, unmount } = render(<Backdrop preset="aurora" motion="drift" />);
    const root = container.querySelector('.ag-backdrop') as HTMLElement;
    expect(FakeIO.instances.some((io) => io.observed.has(root))).toBe(true);
    await act(async () => { FakeIO.fire(root, false); });
    expect(root.hasAttribute('data-ag-offscreen')).toBe(true);
    await act(async () => { FakeIO.fire(root, true); });
    expect(root.hasAttribute('data-ag-offscreen')).toBe(false);

    await act(async () => { setHidden(true); });
    expect(root.hasAttribute('data-backdrop-hidden')).toBe(true);
    await act(async () => { setHidden(false); });
    expect(root.hasAttribute('data-backdrop-hidden')).toBe(false);
    unmount();
    expect(FakeIO.instances.some((io) => io.observed.has(root))).toBe(false);
  });

  it('a media preset with drift is observed too; static backdrops are not', () => {
    const { container } = render(<Backdrop preset="photo" src="/x.jpg" mediaTone="light" motion="drift" />);
    const root = container.querySelector('.ag-backdrop')!;
    expect(FakeIO.instances.some((io) => io.observed.has(root))).toBe(true);
    const { container: c2 } = render(<Backdrop preset="mesh" />);
    const still = c2.querySelector('.ag-backdrop')!;
    expect(FakeIO.instances.some((io) => io.observed.has(still))).toBe(false);
  });
});

/* REQ-SURF-153 — the photo/video layer island samples its own media when no
 * `mediaTone` prop is given. jsdom has no decode() and no 2D canvas: the test
 * installs a resolving decode() that gives the image a natural size, and a
 * canvas context whose getImageData returns a uniform dark buffer. */
describe('BackdropMediaLayer tone sampling (REQ-SURF-153)', () => {
  const getImageData = jest.fn(() => ({ data: new Uint8ClampedArray(32 * 32 * 4).fill(12).map((v, i) => (i % 4 === 3 ? 255 : v)) }));
  const realGetContext = HTMLCanvasElement.prototype.getContext;
  const decode = jest.fn(function (this: HTMLImageElement) {
    Object.defineProperty(this, 'naturalWidth', { configurable: true, value: 1600 });
    Object.defineProperty(this, 'naturalHeight', { configurable: true, value: 900 });
    return Promise.resolve();
  });
  beforeEach(() => {
    clearToneCache();
    getImageData.mockClear();
    decode.mockClear();
    HTMLCanvasElement.prototype.getContext = function getContext() {
      return { drawImage() {}, getImageData } as never;
    } as typeof realGetContext;
    Object.defineProperty(HTMLImageElement.prototype, 'decode', { configurable: true, value: decode });
  });
  afterEach(() => {
    HTMLCanvasElement.prototype.getContext = realGetContext;
    delete (HTMLImageElement.prototype as { decode?: unknown }).decode;
  });
  const settle = async () => {
    // one frame of the shared motion ticker (REQ-MOT-65: no direct rAF under src/backdrops)
    await act(async () => { await new Promise<void>((r) => { const off = subscribeFrame(() => { off(); r(); }); }); });
  };

  it('photo with a mocked decode sets data-ag-media-tone on .ag-backdrop', async () => {
    const { container } = render(<Backdrop preset="photo" src="https://x/dark.jpg" crossOrigin="anonymous" />);
    const root = container.querySelector('.ag-backdrop') as HTMLElement;
    expect(root.hasAttribute('data-ag-media-tone')).toBe(false);
    await settle();
    expect(decode).toHaveBeenCalledTimes(1);
    expect(getImageData).toHaveBeenCalledTimes(1);
    expect(root.getAttribute('data-ag-media-tone')).toBe('dark');
    expect(root.style.getPropertyValue('--_ag-media-luma')).toMatch(/^0\.\d{3}$/);
  });

  it('a MutationObserver on the whole backdrop records only data-ag-media-tone and style(--_ag-media-luma)', async () => {
    const host = document.createElement('div');
    document.body.appendChild(host);
    const records: MutationRecord[] = [];
    const mo = new MutationObserver((r) => { records.push(...r); });
    let styleBefore = '';
    const { container } = render(<Backdrop preset="photo" src="https://x/dark2.jpg"><p>content</p></Backdrop>, { container: host });
    const root = container.querySelector('.ag-backdrop') as HTMLElement;
    styleBefore = root.getAttribute('style') ?? '';
    mo.observe(root, { attributes: true, attributeOldValue: true, childList: true, subtree: true, characterData: true });
    await settle();
    records.push(...mo.takeRecords());
    mo.disconnect();
    expect(records.length).toBeGreaterThan(0);
    expect(records.every((r) => r.type === 'attributes' && r.target === root)).toBe(true);
    expect([...new Set(records.map((r) => r.attributeName))].sort()).toEqual(['data-ag-media-tone', 'style']);
    // the style attribute gained exactly one custom property and nothing else
    const added = Array.from(root.style).filter((p) => !styleBefore.includes(p));
    expect(added).toEqual(['--_ag-media-luma']);
    host.remove();
  });

  it('an explicit mediaTone prop wins: nothing is sampled', async () => {
    const { container } = render(<Backdrop preset="photo" src="https://x/explicit.jpg" mediaTone="light" />);
    await settle();
    expect(decode).not.toHaveBeenCalled();
    expect(getImageData).not.toHaveBeenCalled();
    expect(container.querySelector('.ag-backdrop')!.getAttribute('data-ag-media-tone')).toBe('light');
  });

  it('video samples its poster through an Image, not the <video>', async () => {
    const { container } = render(<Backdrop preset="video" src="https://x/v.mp4" poster="https://x/poster-dark.jpg" />);
    await settle();
    expect(decode).toHaveBeenCalledTimes(1);
    expect((decode.mock.contexts[0] as HTMLImageElement).src).toBe('https://x/poster-dark.jpg');
    expect(getImageData).toHaveBeenCalledTimes(1);
    expect(container.querySelector('.ag-backdrop')!.getAttribute('data-ag-media-tone')).toBe('dark');
  });

  it('graphic presets never mount the sampler', async () => {
    render(<Backdrop preset="aurora" />);
    await settle();
    expect(getImageData).not.toHaveBeenCalled();
  });
});
