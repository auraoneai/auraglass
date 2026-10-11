/* REQ-QUAL-03 (QUAL). 64-bit difference hash over an RGBA buffer, and Hamming distance.
   The image is reduced to 9×8 luminance cells by area averaging; bit i is set when cell (x, y)
   is brighter than cell (x+1, y). Bits are packed row-major, MSB first, into a 64-bit bigint. */

export interface RgbaImage { data: Uint8Array | Uint8ClampedArray; width: number; height: number }

const W = 9;
const H = 8;

function assertImage(img: RgbaImage): void {
  if (!Number.isInteger(img.width) || !Number.isInteger(img.height) || img.width < 1 || img.height < 1) {
    throw new Error(`dhash: invalid image size ${img.width}x${img.height}`);
  }
  if (img.data.length !== img.width * img.height * 4) {
    throw new Error(`dhash: buffer length ${img.data.length} != ${img.width}x${img.height}x4`);
  }
}

/** Rec. 709 luma of an sRGB pixel composited over white (alpha-aware, so transparent ≠ black). */
function luma(d: RgbaImage['data'], i: number): number {
  const a = d[i + 3]! / 255;
  const r = d[i]! * a + 255 * (1 - a);
  const g = d[i + 1]! * a + 255 * (1 - a);
  const b = d[i + 2]! * a + 255 * (1 - a);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** Area-averaged luminance grid of `cols × rows` cells. */
export function luminanceGrid(img: RgbaImage, cols = W, rows = H): Float64Array {
  assertImage(img);
  const out = new Float64Array(cols * rows);
  for (let cy = 0; cy < rows; cy++) {
    const y0 = (cy * img.height) / rows;
    const y1 = ((cy + 1) * img.height) / rows;
    for (let cx = 0; cx < cols; cx++) {
      const x0 = (cx * img.width) / cols;
      const x1 = ((cx + 1) * img.width) / cols;
      let sum = 0;
      let area = 0;
      for (let py = Math.floor(y0); py < Math.ceil(y1); py++) {
        const wy = Math.min(py + 1, y1) - Math.max(py, y0);
        if (wy <= 0) continue;
        for (let px = Math.floor(x0); px < Math.ceil(x1); px++) {
          const wx = Math.min(px + 1, x1) - Math.max(px, x0);
          if (wx <= 0) continue;
          sum += luma(img.data, (py * img.width + px) * 4) * wx * wy;
          area += wx * wy;
        }
      }
      out[cy * cols + cx] = sum / area;
    }
  }
  return out;
}

export function dhash(img: RgbaImage): bigint {
  const g = luminanceGrid(img);
  let h = 0n;
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W - 1; x++) {
      h = (h << 1n) | (g[y * W + x]! > g[y * W + x + 1]! ? 1n : 0n);
    }
  }
  return h;
}

export function hamming(a: bigint, b: bigint): number {
  let x = (a ^ b) & 0xffff_ffff_ffff_ffffn;
  let n = 0;
  while (x) { x &= x - 1n; n++; }
  return n;
}

export const toHex = (h: bigint): string => h.toString(16).padStart(16, '0');
