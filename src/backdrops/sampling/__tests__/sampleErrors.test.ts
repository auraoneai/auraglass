import { describe, expect, it, jest } from '@jest/globals';
import { sampleOwnedPixels } from '../sampleOwnedPixels';

const makeImg = (src: string) => {
  const el = document.createElement('img');
  Object.defineProperty(el, 'naturalWidth', { value: 100 });
  Object.defineProperty(el, 'naturalHeight', { value: 100 });
  Object.defineProperty(el, 'currentSrc', { value: src });
  return el;
};

describe('sampleOwnedPixels error paths (REQ-SURF-153)', () => {
  it('SecurityError → null + one exact dev warning; same src warns once', () => {
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
    const real = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function () {
      return { drawImage() { throw new DOMException('tainted', 'SecurityError'); }, getImageData() { throw new DOMException('tainted', 'SecurityError'); } } as never;
    };
    try {
      const el = makeImg('https://x/tainted.png');
      expect(sampleOwnedPixels(el)).toBeNull();
      expect(warn).toHaveBeenCalledTimes(1);
      expect(warn.mock.calls[0]![0]).toBe('[aura-glass] Cannot sample https://x/tainted.png: add crossOrigin="anonymous" and CORS headers, or pass mediaTone="light|dark" to Backdrop.');
      expect(sampleOwnedPixels(el)).toBeNull();
      expect(warn).toHaveBeenCalledTimes(1);
    } finally {
      HTMLCanvasElement.prototype.getContext = real;
      warn.mockRestore();
    }
  });
  it('disables smoothing before drawImage so busy scenes point-sample (REQ-SURF-152)', () => {
    const real = HTMLCanvasElement.prototype.getContext;
    const ctx: Record<string, unknown> = {
      imageSmoothingEnabled: true,
      drawImage() {},
      getImageData(_x: number, _y: number, w: number, h: number) {
        return { data: new Uint8ClampedArray(w * h * 4).fill(255), width: w, height: h };
      },
    };
    HTMLCanvasElement.prototype.getContext = function () { return ctx as never; };
    try {
      expect(sampleOwnedPixels(makeImg('https://x/busy.png'))?.mean).toBeCloseTo(1, 3);
      expect(ctx['imageSmoothingEnabled']).toBe(false);
    } finally {
      HTMLCanvasElement.prototype.getContext = real;
    }
  });
  it('zero natural size → null, no throw', () => {
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
    const el = document.createElement('img'); // naturalWidth 0
    expect(sampleOwnedPixels(el)).toBeNull();
    warn.mockRestore();
  });
});
