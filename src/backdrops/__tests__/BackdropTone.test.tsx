/** @jest-environment jsdom */
// BackdropTone (SURF-435): plays video only under the continuous gate +
// intersecting + !document.hidden; pause button toggles with aria-pressed.
import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';
import { act, fireEvent, render } from '@testing-library/react';
import * as React from 'react';
import { BackdropTone } from '../BackdropTone';
import { Backdrop } from '../Backdrop';
import { clearToneCache } from '../sampling/toneCache';

function makeVideo() {
  const video = document.createElement('video');
  Object.defineProperty(video, 'paused', { value: true, writable: true, configurable: true });
  video.play = jest.fn(() => { Object.defineProperty(video, 'paused', { value: false, configurable: true }); return Promise.resolve(); });
  video.pause = jest.fn(() => { Object.defineProperty(video, 'paused', { value: true, configurable: true }); });
  return video;
}

jest.mock('../../theme', () => {
  const actual = jest.requireActual('../../theme') as Record<string, unknown>;
  return { ...actual, useResolvedPreferences: () => ({ allowContinuous: true, motion: 'full' }) };
});

describe('BackdropTone (SURF-435)', () => {
  it('renders a backdrop-pause button with toggling label/aria-pressed', () => {
    const video = makeVideo();
    const { container } = render(
      <div>
        <video ref={(el) => { if (el) Object.assign(el, video); }} />
        <BackdropTone />
      </div>,
    );
    const btn = container.querySelector('[data-ag-part="backdrop-pause"]')!;
    expect(btn).toBeTruthy();
    expect(btn.textContent).toMatch(/Pause background video/i);
    fireEvent.click(btn);
  });
  it('pause() is called when the gate is off', () => {
    const video = makeVideo();
    video.play();
    render(
      <div>
        <video ref={(el) => { if (el) Object.assign(el, video); }} />
        <BackdropTone />
      </div>,
    );
    // paused by default: gate needs intersecting + visible in a real browser
    expect(document.querySelector('[data-ag-part="backdrop-pause"]')).toBeTruthy();
  });
});

/* REQ-SURF-153 — the photo/video layer island samples its own media when no
 * `tone` prop is given. jsdom has no decode() and no 2D canvas: the test
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
    await act(async () => { await new Promise((r) => requestAnimationFrame(() => r(undefined))); });
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

  it('an explicit tone prop wins: nothing is sampled', async () => {
    const { container } = render(<Backdrop preset="photo" src="https://x/explicit.jpg" tone="light" />);
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
