/* MAT-282: pixel-diff helper — pngjs decode + pixelmatch inside a clip box.
 *  Exact pins (pixelmatch threshold 0.1, includeAA false) per the spec. */
import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch';

export interface Box { x: number; y: number; width: number; height: number }

/** Ratio (0..1) of differing pixels inside `box` for two PNG buffers of the
 *  same dimensions. Out-of-bounds boxes are clipped to the image. */
export function diffRatioInBox(a: Buffer, b: Buffer, box: Box): number {
  const pa = PNG.sync.read(a);
  const pb = PNG.sync.read(b);
  if (pa.width !== pb.width || pa.height !== pb.height) {
    throw new Error(`png size mismatch ${pa.width}x${pa.height} vs ${pb.width}x${pb.height}`);
  }
  const x0 = Math.max(0, Math.floor(box.x));
  const y0 = Math.max(0, Math.floor(box.y));
  const x1 = Math.min(pa.width, Math.ceil(box.x + box.width));
  const y1 = Math.min(pa.height, Math.ceil(box.y + box.height));
  const w = Math.max(0, x1 - x0);
  const h = Math.max(0, y1 - y0);
  if (w === 0 || h === 0) return 0;
  const sub = (src: PNG) => {
    const out = new PNG({ width: w, height: h });
    PNG.bitblt(src, out, x0, y0, w, h, 0, 0);
    return out;
  };
  const sa = sub(pa);
  const sb = sub(pb);
  const diff = new PNG({ width: w, height: h });
  const n = pixelmatch(sa.data, sb.data, diff.data, w, h, { threshold: 0.1, includeAA: false });
  return n / (w * h);
}
