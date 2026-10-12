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

/** WCAG relative luminance of an sRGB byte triple. */
function luminance(r: number, g: number, b: number): number {
  const f = (v: number) => {
    const x = v / 255;
    return x <= 0.04045 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
}

/** REQ-MAT-61 (WCAG 2.4.13): per-pixel contrast ratio between the unfocused
 *  and focused renders of the same clip, for every pixel that changed,
 *  sorted high → low. Both PNGs are opaque page screenshots of equal size. */
export function changedPixelRatios(unfocused: Buffer, focused: Buffer): number[] {
  const a = PNG.sync.read(unfocused);
  const b = PNG.sync.read(focused);
  if (a.width !== b.width || a.height !== b.height) {
    throw new Error(`png size mismatch ${a.width}x${a.height} vs ${b.width}x${b.height}`);
  }
  const out: number[] = [];
  for (let i = 0; i < a.data.length; i += 4) {
    if (a.data[i] === b.data[i] && a.data[i + 1] === b.data[i + 1] && a.data[i + 2] === b.data[i + 2]) continue;
    const la = luminance(a.data[i]!, a.data[i + 1]!, a.data[i + 2]!);
    const lb = luminance(b.data[i]!, b.data[i + 1]!, b.data[i + 2]!);
    out.push((Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05));
  }
  return out.sort((x, y) => y - x);
}
