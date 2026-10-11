/* FIN-G lane fixture (G-18, REQ-QUAL-22/23): pixel reads without a PNG
   decoder dependency. Screenshots are decoded by the browser under test
   (canvas getImageData in a scratch page of the same context), then compared
   with pixelmatch using the contract tolerance (S-55 VISUAL_TOLERANCE). */
import type { BrowserContext } from '@playwright/test';
import { VISUAL_TOLERANCE } from '../../../src/contracts/testing';

export interface Rgba { width: number; height: number; data: Uint8ClampedArray }

/** Decodes PNG bytes in a scratch page of `context`. */
export async function decodePng(context: BrowserContext, png: Buffer): Promise<Rgba> {
  const scratch = await context.newPage();
  try {
    const { width, height, bytes } = await scratch.evaluate(async (b64: string) => {
      const img = new Image();
      img.src = `data:image/png;base64,${b64}`;
      await img.decode();
      const c = document.createElement('canvas');
      c.width = img.naturalWidth;
      c.height = img.naturalHeight;
      const ctx = c.getContext('2d', { willReadFrequently: true });
      if (!ctx) throw new Error('2d canvas unavailable');
      ctx.drawImage(img, 0, 0);
      const d = ctx.getImageData(0, 0, c.width, c.height).data;
      let bin = '';
      for (let i = 0; i < d.length; i += 0x8000) bin += String.fromCharCode(...d.subarray(i, i + 0x8000));
      return { width: c.width, height: c.height, bytes: btoa(bin) };
    }, png.toString('base64'));
    return { width, height, data: new Uint8ClampedArray(Buffer.from(bytes, 'base64')) };
  } finally {
    await scratch.close();
  }
}

/** Standard deviation of relative luminance (Rec. 709 weights on sRGB 0..255). */
export function luminanceSigma(img: Rgba): number {
  const n = img.width * img.height;
  if (n === 0) throw new Error('empty image');
  let sum = 0;
  let sq = 0;
  for (let i = 0; i < img.data.length; i += 4) {
    const l = 0.2126 * img.data[i]! + 0.7152 * img.data[i + 1]! + 0.0722 * img.data[i + 2]!;
    sum += l;
    sq += l * l;
  }
  const mean = sum / n;
  return Math.sqrt(Math.max(0, sq / n - mean * mean));
}

/** Fraction of differing pixels (pixelmatch, VISUAL_TOLERANCE threshold/includeAA). */
export async function diffRatio(a: Rgba, b: Rgba): Promise<number> {
  if (a.width !== b.width || a.height !== b.height) {
    throw new Error(`size mismatch ${a.width}x${a.height} vs ${b.width}x${b.height}`);
  }
  const { default: pixelmatch } = await import('pixelmatch');
  const diff = pixelmatch(a.data, b.data, undefined, a.width, a.height, {
    threshold: VISUAL_TOLERANCE.pixelmatchThreshold,
    includeAA: VISUAL_TOLERANCE.includeAA,
  });
  return diff / (a.width * a.height);
}

/** true when ≥1 pixel differs from the first pixel (not a flat fill). */
export function notUniform(img: Rgba): boolean {
  const d = img.data;
  for (let i = 4; i < d.length; i += 4) {
    if (d[i] !== d[0] || d[i + 1] !== d[1] || d[i + 2] !== d[2] || d[i + 3] !== d[3]) return true;
  }
  return false;
}
