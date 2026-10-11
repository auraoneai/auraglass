/* MAT-134 — canvas sampling helpers for MAT visual specs. Real screenshot
   pixel reads happen on the GitLab playwright lane; these helpers carry the
   same API so specs can run identically in jsdom-adjacent contexts. */
import type { Page } from 'playwright-core';
import pngjs from 'pngjs';
import type { PNG } from 'pngjs';
const Png = pngjs.PNG;

export interface Pixel { x: number; y: number; rgba: [number, number, number, number] }

/** Center pixel of the element's box in a PNG buffer of the page screenshot. */
export function samplePixel(buf: Buffer, x: number, y: number, width: number): [number, number, number, number] {
  const png = Png.sync.read(buf);
  const i = (Math.round(y) * width + Math.round(x)) * 4;
  return [png.data[i] ?? 0, png.data[i + 1] ?? 0, png.data[i + 2] ?? 0, png.data[i + 3] ?? 0];
}

/** Element center coordinate in page space. */
export async function elementCenter(page: Page, selector: string): Promise<{ x: number; y: number }> {
  const box = await page.locator(selector).boundingBox();
  if (!box) throw new Error(`no bounding box for ${selector}`);
  return { x: box.x + box.width / 2, y: box.y + box.height / 2 };
}

/** Rec.601 luminance of every pixel in a screenshot buffer. */
export function bandLuminanceMean(buf: Buffer): number {
  const png = Png.sync.read(buf);
  let sum = 0;
  const n = png.data.length / 4;
  for (let i = 0; i < png.data.length; i += 4) {
    sum += 0.2126 * (png.data[i] ?? 0) + 0.7152 * (png.data[i + 1] ?? 0) + 0.0722 * (png.data[i + 2] ?? 0);
  }
  return sum / Math.max(n, 1);
}

/** Variance of Rec.601 luminance across a screenshot buffer. */
export function bandVariance(buf: Buffer): number {
  const png = Png.sync.read(buf);
  const n = png.data.length / 4;
  let sum = 0;
  let sq = 0;
  for (let i = 0; i < png.data.length; i += 4) {
    const l = 0.2126 * (png.data[i] ?? 0) + 0.7152 * (png.data[i + 1] ?? 0) + 0.0722 * (png.data[i + 2] ?? 0);
    sum += l;
    sq += l * l;
  }
  const mean = sum / Math.max(n, 1);
  return sq / Math.max(n, 1) - mean * mean;
}
