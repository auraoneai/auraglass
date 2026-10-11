/* Minimal non-interlaced 8-bit PNG decoder for frame-diff (no native deps).
   Returns null for anything else (playwright always emits 8-bit RGBA/RGB). */
import { inflateSync } from 'node:zlib';

export interface DecodedPng {
  width: number;
  height: number;
  /** RGBA bytes, len = width*height*4 */
  data: Buffer;
}

const paeth = (a: number, b: number, c: number): number => {
  const p = a + b - c;
  const pa = Math.abs(p - a);
  const pb = Math.abs(p - b);
  const pc = Math.abs(p - c);
  return pa <= pb && pa <= pc ? a : pb <= pc ? b : c;
};

export const decodePng = (buf: Buffer): DecodedPng | null => {
  const SIG = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  if (buf.length < 33 || !buf.subarray(0, 8).equals(SIG)) return null;
  let off = 8;
  let width = 0;
  let height = 0;
  let bitDepth = 0;
  let colorType = 0;
  let interlace = 0;
  const idat: Buffer[] = [];
  while (off + 12 <= buf.length) {
    const len = buf.readUInt32BE(off);
    const type = buf.toString('ascii', off + 4, off + 8);
    const data = buf.subarray(off + 8, off + 8 + len);
    if (type === 'IHDR') {
      width = data.readUInt32BE(0);
      height = data.readUInt32BE(4);
      bitDepth = data[8]!;
      colorType = data[9]!;
      interlace = data[12]!;
    } else if (type === 'IDAT') {
      idat.push(data);
    } else if (type === 'IEND') {
      break;
    }
    off += 12 + len;
  }
  if (interlace !== 0 || bitDepth !== 8 || (colorType !== 6 && colorType !== 2) || idat.length === 0) {
    return null;
  }
  const raw = inflateSync(Buffer.concat(idat));
  const channels = colorType === 6 ? 4 : 3;
  const stride = width * channels;
  const out = Buffer.alloc(width * height * 4);
  const prior = Buffer.alloc(stride);
  let src = 0;
  let dst = 0;
  const line = Buffer.alloc(stride);
  for (let y = 0; y < height; y++) {
    const filter = raw[src++]!;
    line.set(raw.subarray(src, src + stride));
    src += stride;
    for (let x = 0; x < stride; x++) {
      const left = x >= channels ? line[x - channels]! : 0;
      const up = prior[x]!;
      const upLeft = x >= channels ? prior[x - channels]! : 0;
      switch (filter) {
        case 1: line[x] = (line[x]! + left) & 0xff; break;
        case 2: line[x] = (line[x]! + up) & 0xff; break;
        case 3: line[x] = (line[x]! + ((left + up) >> 1)) & 0xff; break;
        case 4: line[x] = (line[x]! + paeth(left, up, upLeft)) & 0xff; break;
        default: break; // 0: none
      }
    }
    for (let x = 0; x < width; x++) {
      const s = x * channels;
      out[dst++] = line[s]!;
      out[dst++] = line[s + 1]!;
      out[dst++] = line[s + 2]!;
      out[dst++] = channels === 4 ? line[s + 3]! : 255;
    }
    prior.set(line);
  }
  return { width, height, data: out };
};

/** Fraction of pixels whose RGBA channels differ by > 8/255 in any channel. */
export const diffRatio = (a: Buffer, b: Buffer): number => {
  const n = Math.min(a.length, b.length);
  let diff = 0;
  for (let i = 0; i < n; i += 4) {
    if (
      Math.abs(a[i]! - b[i]!) > 8 || Math.abs(a[i + 1]! - b[i + 1]!) > 8 ||
      Math.abs(a[i + 2]! - b[i + 2]!) > 8 || Math.abs(a[i + 3]! - b[i + 3]!) > 8
    ) diff++;
  }
  return diff / Math.max(1, n / 4);
};
