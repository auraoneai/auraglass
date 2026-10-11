/* REQ-QUAL-24 / -25 / -26 (QUAL, FIN-432, FIN-433). Minimal PNG reader/writer on node:zlib — no PNG-decoder dependency
   (REQ-QUAL-15 forbids adding one). Used by the L7 tooling, which works on committed baselines and job-artifact PNGs:
   - `pngChunks` lists chunk types and sizes (REQ-QUAL-24 metadata rule: baselines carry image chunks only);
   - `decodePng` → straight RGBA for 8-bit, non-interlaced PNGs of colour type 0, 2, 3, 4 or 6 (what Playwright writes);
   - `encodePng` writes an 8-bit RGBA PNG with IHDR/IDAT/IEND only (diff images, test fixtures).
   Anything else (16-bit, interlaced, bad CRC, truncated data) throws with the reason; it is never guessed. */
import { deflateSync, inflateSync } from 'node:zlib';

export interface RgbaImage { width: number; height: number; data: Uint8Array | Uint8ClampedArray }
export interface PngChunk { type: string; length: number; offset: number }

const SIGNATURE = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

const CRC_TABLE = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return t;
})();

export function crc32(buf: Uint8Array): number {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]!) & 0xff]! ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

export function isPng(buf: Uint8Array): boolean {
  return buf.length >= 8 && Buffer.from(buf.subarray(0, 8)).equals(SIGNATURE);
}

/** Every chunk in file order; throws on a missing signature, a truncated chunk or a CRC mismatch. */
export function pngChunks(input: Uint8Array): PngChunk[] {
  const buf = Buffer.from(input.buffer, input.byteOffset, input.byteLength);
  if (!isPng(buf)) throw new Error('png: missing PNG signature');
  const out: PngChunk[] = [];
  let off = 8;
  while (off < buf.length) {
    if (off + 12 > buf.length) throw new Error(`png: truncated chunk header at byte ${off}`);
    const length = buf.readUInt32BE(off);
    const type = buf.toString('latin1', off + 4, off + 8);
    if (!/^[A-Za-z]{4}$/.test(type)) throw new Error(`png: invalid chunk type at byte ${off}`);
    const end = off + 12 + length;
    if (end > buf.length) throw new Error(`png: chunk ${type} at byte ${off} overruns the file`);
    const crc = buf.readUInt32BE(off + 8 + length);
    if (crc32(buf.subarray(off + 4, off + 8 + length)) !== crc) throw new Error(`png: CRC mismatch in chunk ${type} at byte ${off}`);
    out.push({ type, length, offset: off });
    off = end;
    if (type === 'IEND') break;
  }
  if (out[0]?.type !== 'IHDR') throw new Error('png: first chunk is not IHDR');
  if (out.at(-1)?.type !== 'IEND') throw new Error('png: no IEND chunk');
  if (off !== buf.length) throw new Error(`png: ${buf.length - off} trailing byte(s) after IEND`);
  return out;
}

const CHANNELS: Record<number, number> = { 0: 1, 2: 3, 3: 1, 4: 2, 6: 4 };

function paeth(a: number, b: number, c: number): number {
  const p = a + b - c;
  const pa = Math.abs(p - a);
  const pb = Math.abs(p - b);
  const pc = Math.abs(p - c);
  return pa <= pb && pa <= pc ? a : pb <= pc ? b : c;
}

export function decodePng(input: Uint8Array): RgbaImage {
  const buf = Buffer.from(input.buffer, input.byteOffset, input.byteLength);
  const chunks = pngChunks(buf);
  const data = (c: PngChunk) => buf.subarray(c.offset + 8, c.offset + 8 + c.length);
  const ihdr = data(chunks[0]!);
  const width = ihdr.readUInt32BE(0);
  const height = ihdr.readUInt32BE(4);
  const [depth, colorType, , , interlace] = [ihdr[8]!, ihdr[9]!, ihdr[10]!, ihdr[11]!, ihdr[12]!];
  if (width < 1 || height < 1) throw new Error(`png: invalid size ${width}x${height}`);
  if (depth !== 8) throw new Error(`png: bit depth ${depth} is not supported (8 only)`);
  if (interlace !== 0) throw new Error('png: interlaced PNGs are not supported');
  const channels = CHANNELS[colorType];
  if (!channels) throw new Error(`png: colour type ${colorType} is not supported`);
  const plte = chunks.find((c) => c.type === 'PLTE');
  const trns = chunks.find((c) => c.type === 'tRNS');
  const palette = plte ? data(plte) : null;
  const paletteAlpha = trns && colorType === 3 ? data(trns) : null;
  if (colorType === 3 && !palette) throw new Error('png: palette image without PLTE');

  const raw = inflateSync(Buffer.concat(chunks.filter((c) => c.type === 'IDAT').map(data)));
  const stride = width * channels;
  if (raw.length !== (stride + 1) * height) throw new Error(`png: image data is ${raw.length} bytes, expected ${(stride + 1) * height}`);
  const px = new Uint8Array(stride * height);
  for (let y = 0; y < height; y++) {
    const filter = raw[y * (stride + 1)]!;
    const src = raw.subarray(y * (stride + 1) + 1, (y + 1) * (stride + 1));
    const row = y * stride;
    for (let x = 0; x < stride; x++) {
      const a = x >= channels ? px[row + x - channels]! : 0;
      const b = y > 0 ? px[row - stride + x]! : 0;
      const c = x >= channels && y > 0 ? px[row - stride + x - channels]! : 0;
      let v = src[x]!;
      switch (filter) {
        case 0: break;
        case 1: v += a; break;
        case 2: v += b; break;
        case 3: v += (a + b) >> 1; break;
        case 4: v += paeth(a, b, c); break;
        default: throw new Error(`png: unknown filter type ${filter} on row ${y}`);
      }
      px[row + x] = v & 0xff;
    }
  }
  const out = new Uint8ClampedArray(width * height * 4);
  for (let i = 0, j = 0; i < width * height; i++, j += channels) {
    const o = i * 4;
    switch (colorType) {
      case 0: out[o] = out[o + 1] = out[o + 2] = px[j]!; out[o + 3] = 255; break;
      case 2: out[o] = px[j]!; out[o + 1] = px[j + 1]!; out[o + 2] = px[j + 2]!; out[o + 3] = 255; break;
      case 3: {
        const k = px[j]!;
        if (k * 3 + 2 >= palette!.length) throw new Error(`png: palette index ${k} out of range`);
        out[o] = palette![k * 3]!; out[o + 1] = palette![k * 3 + 1]!; out[o + 2] = palette![k * 3 + 2]!;
        out[o + 3] = paletteAlpha && k < paletteAlpha.length ? paletteAlpha[k]! : 255;
        break;
      }
      case 4: out[o] = out[o + 1] = out[o + 2] = px[j]!; out[o + 3] = px[j + 1]!; break;
      case 6: out[o] = px[j]!; out[o + 1] = px[j + 1]!; out[o + 2] = px[j + 2]!; out[o + 3] = px[j + 3]!; break;
    }
  }
  return { width, height, data: out };
}

function chunk(type: string, body: Uint8Array): Buffer {
  const head = Buffer.alloc(8);
  head.writeUInt32BE(body.length, 0);
  head.write(type, 4, 'latin1');
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([head.subarray(4), body])), 0);
  return Buffer.concat([head, body, crc]);
}

/** 8-bit RGBA PNG (filter 0 rows, IHDR/IDAT/IEND only). `extra` chunks are inserted before IDAT (test fixtures). */
export function encodePng(img: RgbaImage, extra: Array<{ type: string; data: Uint8Array }> = []): Buffer {
  if (img.data.length !== img.width * img.height * 4) throw new Error(`png: buffer length ${img.data.length} != ${img.width}x${img.height}x4`);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(img.width, 0);
  ihdr.writeUInt32BE(img.height, 4);
  ihdr[8] = 8; ihdr[9] = 6; ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0;
  const stride = img.width * 4;
  const raw = Buffer.alloc((stride + 1) * img.height);
  for (let y = 0; y < img.height; y++) Buffer.from(img.data.buffer, img.data.byteOffset + y * stride, stride).copy(raw, y * (stride + 1) + 1);
  return Buffer.concat([SIGNATURE, chunk('IHDR', ihdr), ...extra.map((e) => chunk(e.type, e.data)),
    chunk('IDAT', deflateSync(raw, { level: 9 })), chunk('IEND', new Uint8Array(0))]);
}
