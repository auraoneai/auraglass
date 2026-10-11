import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';
import { act, render } from '@testing-library/react';
import * as React from 'react';
import { clearToneCache, getOrSampleTone, TONE_CACHE_MAX } from '../toneCache';
import { useMediaElement } from '../../../media/useMediaElement';

/* REQ-SURF-153 — the tone LRU and the real sampler underneath it. jsdom has
 * no 2D canvas, so the only stub is the canvas context: getImageData is the
 * spy every assertion counts, and it returns a uniform light 32×32 buffer. */
const getImageData = jest.fn(() => ({ data: new Uint8ClampedArray(32 * 32 * 4).fill(230) }));
const drawImage = jest.fn();
const realGetContext = HTMLCanvasElement.prototype.getContext;

beforeEach(() => {
  clearToneCache();
  getImageData.mockClear();
  drawImage.mockClear();
  HTMLCanvasElement.prototype.getContext = function getContext() {
    return { drawImage, getImageData } as never;
  } as typeof realGetContext;
});
afterEach(() => { HTMLCanvasElement.prototype.getContext = realGetContext; });

const flush = async () => {
  await act(async () => { await new Promise((r) => requestAnimationFrame(() => r(undefined))); });
};

const sized = <T extends HTMLImageElement | HTMLVideoElement>(el: T, src: string): T => {
  const [w, h] = el instanceof HTMLImageElement ? ['naturalWidth', 'naturalHeight'] : ['videoWidth', 'videoHeight'];
  Object.defineProperty(el, w, { configurable: true, value: 640 });
  Object.defineProperty(el, h, { configurable: true, value: 360 });
  Object.defineProperty(el, 'currentSrc', { configurable: true, value: src });
  return el;
};
const img = (src: string) => sized(document.createElement('img'), src);

function Player({ src, poster }: { src: string; poster?: string }) {
  const ref = React.useRef<HTMLVideoElement>(null);
  useMediaElement(ref, { sampleTone: true });
  return (
    <div data-ag-media-root="">
      <video ref={(el) => { (ref as React.MutableRefObject<HTMLVideoElement | null>).current = el ? sized(el, src) : null; }} src={src} poster={poster} />
    </div>
  );
}

describe('toneCache through useMediaElement (REQ-SURF-153)', () => {
  it('a real <video>: 100 timeupdate + 10 seeked → getImageData called exactly once', async () => {
    const { container } = render(<Player src="https://x/clip.mp4" />);
    const video = container.querySelector('video')!;
    const root = container.querySelector('[data-ag-media-root]') as HTMLElement;
    Object.defineProperty(video, 'readyState', { configurable: true, value: 4 });
    act(() => { video.dispatchEvent(new Event('loadeddata')); });
    for (let i = 0; i < 100; i++) {
      Object.defineProperty(video, 'currentTime', { configurable: true, writable: true, value: i * 0.3 });
      act(() => { video.dispatchEvent(new Event('timeupdate')); });
      if (i % 10 === 0) act(() => { video.dispatchEvent(new Event('seeked')); });
    }
    await flush();
    expect(getImageData).toHaveBeenCalledTimes(1);
    expect(root.getAttribute('data-ag-media-tone')).toBe('light');
    expect(root.style.getPropertyValue('--_ag-media-luma')).not.toBe('');
  });

  it('a video poster wins: the poster image is sampled, never a frame, with no loadeddata', async () => {
    // jsdom ships no HTMLImageElement#decode; install a resolving one that
    // gives the decoded image its natural size.
    const decode = jest.fn(function (this: HTMLImageElement) {
      sized(this, this.src);
      return Promise.resolve();
    });
    Object.defineProperty(HTMLImageElement.prototype, 'decode', { configurable: true, value: decode });
    try {
      const { container } = render(<Player src="https://x/clip.mp4" poster="https://x/poster.jpg" />);
      await flush();
      expect(decode).toHaveBeenCalledTimes(1);
      expect(getImageData).toHaveBeenCalledTimes(1);
      const drawn = drawImage.mock.calls[0]![0] as HTMLImageElement;
      expect(drawn).toBeInstanceOf(HTMLImageElement);
      expect(drawn.src).toBe('https://x/poster.jpg');
      expect(container.querySelector('[data-ag-media-root]')!.getAttribute('data-ag-media-tone')).toBe('light');
    } finally {
      delete (HTMLImageElement.prototype as { decode?: unknown }).decode;
    }
  });
});

describe('toneCache LRU (REQ-SURF-153)', () => {
  it('100 requests for one key → one getImageData, every caller gets the tone', async () => {
    const apply = jest.fn();
    const el = img('https://x/a.png');
    for (let i = 0; i < 100; i++) getOrSampleTone(el, undefined, apply);
    await flush();
    expect(getImageData).toHaveBeenCalledTimes(1);
    expect(apply).toHaveBeenCalledTimes(100);
    expect(apply).toHaveBeenLastCalledWith('light', expect.any(Number));
  });

  it(`evicts the oldest entry at insert ${TONE_CACHE_MAX + 1}`, async () => {
    const apply = jest.fn();
    for (let i = 0; i <= TONE_CACHE_MAX; i++) getOrSampleTone(img(`https://x/${i}.png`), undefined, apply);
    await flush();
    expect(getImageData).toHaveBeenCalledTimes(TONE_CACHE_MAX + 1);
    getOrSampleTone(img('https://x/0.png'), undefined, apply); // evicted → sampled again
    await flush();
    expect(getImageData).toHaveBeenCalledTimes(TONE_CACHE_MAX + 2);
    getOrSampleTone(img(`https://x/${TONE_CACHE_MAX}.png`), undefined, apply); // still cached
    await flush();
    expect(getImageData).toHaveBeenCalledTimes(TONE_CACHE_MAX + 2);
  });

  it('the region participates in the cache key', async () => {
    const apply = jest.fn();
    const el = img('https://x/r.png');
    getOrSampleTone(el, undefined, apply);
    getOrSampleTone(el, { x: 0, y: 0, width: 50, height: 50 }, apply);
    await flush();
    expect(getImageData).toHaveBeenCalledTimes(2);
  });
});
