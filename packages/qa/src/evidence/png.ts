/* PNG decode/encode for the evidence tooling (QUAL; REQ-QUAL-61, -73). No image-library dependency: a port of the
   decoder and raster statistics of legacy `scripts/audit/verify-visual-evidence.js` (inspectPng / rasterStats), so
   "a PNG exists" can never stand in for visual evidence. Supports non-interlaced 8-bit PNGs of colour types
   0 (grey), 2 (RGB), 3 (indexed, with PLTE/tRNS), 4 (grey+alpha) and 6 (RGBA) — what Playwright and Chromium write.
   The encoder writes 8-bit RGBA (colour type 6, filter 0) for review composites. */
import { deflateSync, inflateSync } from 'node:zlib';
import type { RgbaImage } from '../pixel/dhash.ts';

const SIGNATURE = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
const CHANNELS: Readonly<Record<number, number>> = { 0: 1, 2: 3, 3: 1, 4: 2, 6: 4 };

export class PngError extends Error {
  constructor(message: string) { super(message); this.name = 'PngError'; }
}

export interface DecodedPng extends RgbaImage { data: Uint8Array }

/** Decodes a PNG into RGBA. Throws PngError on anything that is not a complete, supported PNG. */
export function decodePng(source: Uint8Array): DecodedPng {
  const buf = Buffer.from(source.buffer, source.byteOffset, source.byteLength);
  if (buf.length < 33 || !buf.subarray(0, 8).equals(SIGNATURE)) throw new PngError('not a PNG file');
  let offset = 8;
  let ihdr: { width: number; height: number; bitDepth: number; colorType: number; compression: number; filter: number; interlace: number } | null = null;
  let palette: Buffer | null = null;
  let trns: Buffer | null = null;
  const idat: Buffer[] = [];
  let ended = false;
  while (offset + 12 <= buf.length) {
    const length = buf.readUInt32BE(offset);
    const type = buf.toString('ascii', offset + 4, offset + 8);
    const start = offset + 8;
    const end = start + length;
    if (end + 4 > buf.length) throw new PngError(`truncated ${type} chunk`);
    const chunk = buf.subarray(start, end);
    if (type === 'IHDR') {
      if (length !== 13) throw new PngError('invalid IHDR length');
      ihdr = { width: chunk.readUInt32BE(0), height: chunk.readUInt32BE(4), bitDepth: chunk[8]!, colorType: chunk[9]!,
        compression: chunk[10]!, filter: chunk[11]!, interlace: chunk[12]! };
    } else if (type === 'PLTE') palette = chunk;
    else if (type === 'tRNS') trns = chunk;
    else if (type === 'IDAT') idat.push(chunk);
    else if (type === 'IEND') { ended = true; break; }
    offset = end + 4;
  }
  if (!ihdr || !ihdr.width || !ihdr.height || !idat.length) throw new PngError('PNG is missing IHDR or IDAT data');
  if (!ended) throw new PngError('PNG has no IEND chunk (truncated file)');
  if (ihdr.bitDepth !== 8 || ihdr.interlace !== 0 || ihdr.compression !== 0 || ihdr.filter !== 0) {
    throw new PngError(`unsupported PNG encoding (bitDepth=${ihdr.bitDepth}, interlace=${ihdr.interlace})`);
  }
  const channels = CHANNELS[ihdr.colorType];
  if (!channels) throw new PngError(`unsupported PNG color type ${ihdr.colorType}`);
  if (ihdr.colorType === 3 && !palette) throw new PngError('indexed PNG is missing PLTE');
  let inflated: Buffer;
  try { inflated = inflateSync(Buffer.concat(idat)); } catch (e) { throw new PngError(`IDAT does not inflate: ${(e as Error).message}`); }
  const { width, height } = ihdr;
  const rowBytes = width * channels;
  if (inflated.length !== (rowBytes + 1) * height) throw new PngError(`unexpected decoded PNG length ${inflated.length}`);
  const raw = Buffer.alloc(rowBytes * height);
  let previous = Buffer.alloc(rowBytes);
  let at = 0;
  for (let y = 0; y < height; y++) {
    const filter = inflated[at++]!;
    const row = Buffer.alloc(rowBytes);
    const scan = inflated.subarray(at, at + rowBytes);
    at += rowBytes;
    for (let x = 0; x < rowBytes; x++) {
      const left = x >= channels ? row[x - channels]! : 0;
      const up = previous[x]!;
      const upLeft = x >= channels ? previous[x - channels]! : 0;
      if (filter === 0) row[x] = scan[x]!;
      else if (filter === 1) row[x] = (scan[x]! + left) & 255;
      else if (filter === 2) row[x] = (scan[x]! + up) & 255;
      else if (filter === 3) row[x] = (scan[x]! + Math.floor((left + up) / 2)) & 255;
      else if (filter === 4) {
        const p = left + up - upLeft;
        const pa = Math.abs(p - left); const pb = Math.abs(p - up); const pc = Math.abs(p - upLeft);
        row[x] = (scan[x]! + (pa <= pb && pa <= pc ? left : pb <= pc ? up : upLeft)) & 255;
      } else throw new PngError(`unsupported PNG filter ${filter}`);
    }
    row.copy(raw, y * rowBytes);
    previous = row;
  }
  const data = new Uint8Array(width * height * 4);
  for (let i = 0, o = 0; i < width * height; i++, o += 4) {
    const s = i * channels;
    switch (ihdr.colorType) {
      case 0: data[o] = data[o + 1] = data[o + 2] = raw[s]!; data[o + 3] = 255; break;
      case 2: data[o] = raw[s]!; data[o + 1] = raw[s + 1]!; data[o + 2] = raw[s + 2]!; data[o + 3] = 255; break;
      case 3: {
        const idx = raw[s]!;
        if (idx * 3 + 2 >= palette!.length) throw new PngError(`palette index ${idx} out of range`);
        data[o] = palette![idx * 3]!; data[o + 1] = palette![idx * 3 + 1]!; data[o + 2] = palette![idx * 3 + 2]!;
        data[o + 3] = trns && idx < trns.length ? trns[idx]! : 255;
        break;
      }
      case 4: data[o] = data[o + 1] = data[o + 2] = raw[s]!; data[o + 3] = raw[s + 1]!; break;
      default: data[o] = raw[s]!; data[o + 1] = raw[s + 1]!; data[o + 2] = raw[s + 2]!; data[o + 3] = raw[s + 3]!;
    }
  }
  return { width, height, data };
}

const CRC_TABLE = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return t;
})();

function crc32(bytes: Uint8Array): number {
  let c = 0xffffffff;
  for (const b of bytes) c = CRC_TABLE[(c ^ b) & 0xff]! ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type: string, body: Buffer): Buffer {
  const head = Buffer.alloc(8);
  head.writeUInt32BE(body.length, 0);
  head.write(type, 4, 'ascii');
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([head.subarray(4), body])), 0);
  return Buffer.concat([head, body, crc]);
}

/** Encodes RGBA pixels as an 8-bit RGBA PNG. */
export function encodePng(img: RgbaImage): Buffer {
  const { width, height, data } = img;
  if (data.length !== width * height * 4) throw new PngError(`encode: buffer length ${data.length} != ${width}x${height}x4`);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0); ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; ihdr[9] = 6; ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0;
  const raw = Buffer.alloc((width * 4 + 1) * height);
  for (let y = 0; y < height; y++) {
    raw[y * (width * 4 + 1)] = 0;
    Buffer.from(data.buffer, data.byteOffset + y * width * 4, width * 4).copy(raw, y * (width * 4 + 1) + 1);
  }
  return Buffer.concat([SIGNATURE, chunk('IHDR', ihdr), chunk('IDAT', deflateSync(raw)), chunk('IEND', Buffer.alloc(0))]);
}

export interface RasterStats { width: number; height: number; opaquePixelRatio: number; uniqueColorBuckets: number; dominantColorRatio: number; luminanceStdDev: number }

/** Raster statistics (legacy rasterStats): 4-bit-per-channel colour buckets keep anti-aliased captures stable while
    still separating a rendered page from a one-colour placeholder. */
export function rasterStats(img: RgbaImage): RasterStats {
  const total = img.width * img.height;
  const buckets = new Map<number, number>();
  let opaque = 0; let sum = 0; let sumSq = 0;
  for (let i = 0; i < total; i++) {
    const r = img.data[i * 4]!; const g = img.data[i * 4 + 1]!; const b = img.data[i * 4 + 2]!; const a = img.data[i * 4 + 3]!;
    if (a > 0) opaque++;
    const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    sum += lum; sumSq += lum * lum;
    const key = ((r >> 4) << 12) | ((g >> 4) << 8) | ((b >> 4) << 4) | (a >> 4);
    buckets.set(key, (buckets.get(key) ?? 0) + 1);
  }
  const dominant = Math.max(0, ...buckets.values());
  return {
    width: img.width, height: img.height,
    opaquePixelRatio: opaque / total,
    uniqueColorBuckets: buckets.size,
    dominantColorRatio: dominant / total,
    luminanceStdDev: Math.sqrt(Math.max(0, sumSq / total - (sum / total) ** 2)),
  };
}

/** Why an image is not visual evidence (legacy thresholds), or null when it carries rendered pixels. */
export function blankReason(stats: RasterStats): string | null {
  if (stats.opaquePixelRatio < 0.01) return 'image is effectively transparent';
  if (stats.uniqueColorBuckets < 2 || (stats.dominantColorRatio > 0.995 && stats.luminanceStdDev < 1)) return 'image is visually blank or a single-colour placeholder';
  return null;
}
