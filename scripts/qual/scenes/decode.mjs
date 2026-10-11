/* REQ-QUAL-07 (FIN-427): dependency-free decoders and scene statistics for certification/scenes.
   - decodePng: 8-bit, non-interlaced PNG (colour types 0, 2, 3, 4, 6) via node:zlib.
   - decodeJpeg: baseline / extended-sequential Huffman JPEG (SOF0/SOF1), 8-bit, 1 or 3 components,
     any sampling factors, restart intervals. Progressive/arithmetic/12-bit files are rejected, never guessed.
   - webmDuration: reads Segment/Info Duration × TimecodeScale from the EBML header.
   - sceneStats: Rec.709 luma on sRGB-encoded 8-bit values (0..255): mean, population sigma,
     Hasler–Süsstrunk colourfulness, share of 8×8 blocks whose luma range is >= 40 levels.
   Used by scripts/qual/scenes/write-manifest.mjs (writes the manifest numbers) and by the scene tests
   (recompute them from the committed files). No PNG/JPEG decoder dependency is added (QUAL-15 rule). */
import { inflateSync } from 'node:zlib';

const PNG_SIG = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

/** @returns {{ width: number, height: number, channels: 3, data: Uint8Array }} RGB, 8 bits per channel */
export function decodePng(buf) {
  if (!Buffer.isBuffer(buf)) buf = Buffer.from(buf);
  if (!buf.subarray(0, 8).equals(PNG_SIG)) throw new Error('png: bad signature');
  let off = 8; let width = 0; let height = 0; let depth = 0; let ctype = 0; let interlace = 0;
  let palette = null; const idat = [];
  while (off < buf.length) {
    const len = buf.readUInt32BE(off); const type = buf.toString('latin1', off + 4, off + 8);
    const body = buf.subarray(off + 8, off + 8 + len); off += 12 + len;
    if (type === 'IHDR') {
      width = body.readUInt32BE(0); height = body.readUInt32BE(4); depth = body[8]; ctype = body[9]; interlace = body[12];
    } else if (type === 'PLTE') palette = body;
    else if (type === 'IDAT') idat.push(body);
    else if (type === 'IEND') break;
  }
  if (depth !== 8) throw new Error(`png: bit depth ${depth} unsupported`);
  if (interlace !== 0) throw new Error('png: interlaced files unsupported');
  const bpp = { 0: 1, 2: 3, 3: 1, 4: 2, 6: 4 }[ctype];
  if (!bpp) throw new Error(`png: colour type ${ctype} unsupported`);
  if (ctype === 3 && !palette) throw new Error('png: palette missing');
  const raw = inflateSync(Buffer.concat(idat));
  const stride = width * bpp;
  if (raw.length !== (stride + 1) * height) throw new Error('png: truncated image data');
  const cur = new Uint8Array(stride); const prev = new Uint8Array(stride);
  const out = new Uint8Array(width * height * 3);
  for (let y = 0; y < height; y++) {
    const base = y * (stride + 1); const filter = raw[base];
    for (let i = 0; i < stride; i++) {
      const x = raw[base + 1 + i]; const a = i >= bpp ? cur[i - bpp] : 0; const b = prev[i]; const c = i >= bpp ? prev[i - bpp] : 0;
      let v;
      switch (filter) {
        case 0: v = x; break;
        case 1: v = x + a; break;
        case 2: v = x + b; break;
        case 3: v = x + ((a + b) >> 1); break;
        case 4: { const p = a + b - c; const pa = Math.abs(p - a); const pb = Math.abs(p - b); const pc = Math.abs(p - c);
          v = x + (pa <= pb && pa <= pc ? a : pb <= pc ? b : c); break; }
        default: throw new Error(`png: filter ${filter} invalid`);
      }
      cur[i] = v & 0xff;
    }
    for (let px = 0; px < width; px++) {
      const o = (y * width + px) * 3;
      if (ctype === 0 || ctype === 4) { const g = cur[px * bpp]; out[o] = g; out[o + 1] = g; out[o + 2] = g; }
      else if (ctype === 3) { const p = cur[px] * 3; out[o] = palette[p]; out[o + 1] = palette[p + 1]; out[o + 2] = palette[p + 2]; }
      else { out[o] = cur[px * bpp]; out[o + 1] = cur[px * bpp + 1]; out[o + 2] = cur[px * bpp + 2]; }
    }
    prev.set(cur);
  }
  return { width, height, channels: 3, data: out };
}

const ZIGZAG = Int32Array.from([0, 1, 8, 16, 9, 2, 3, 10, 17, 24, 32, 25, 18, 11, 4, 5, 12, 19, 26, 33, 40, 48, 41, 34, 27, 20, 13, 6, 7, 14, 21,
  28, 35, 42, 49, 56, 57, 50, 43, 36, 29, 22, 15, 23, 30, 37, 44, 51, 58, 59, 52, 45, 38, 31, 39, 46, 53, 60, 61, 54, 47, 55, 62, 63]);
const COS = (() => {
  const t = new Float64Array(64);
  for (let x = 0; x < 8; x++) for (let u = 0; u < 8; u++) t[x * 8 + u] = (u === 0 ? Math.SQRT1_2 : 1) * Math.cos(((2 * x + 1) * u * Math.PI) / 16) / 2;
  return t;
})();

function buildHuffman(counts, symbols) {
  // canonical code tables per ITU T.81 F.2.2.3: maxcode/valptr/mincode indexed by code length 1..16
  const maxcode = new Int32Array(18).fill(-1); const valptr = new Int32Array(17); const mincode = new Int32Array(17);
  let code = 0; let k = 0;
  for (let l = 1; l <= 16; l++) {
    valptr[l] = k; mincode[l] = code; code += counts[l - 1]; k += counts[l - 1];
    maxcode[l] = counts[l - 1] ? code - 1 : -1; code <<= 1;
  }
  maxcode[17] = 0x7fffffff;
  return { maxcode, valptr, mincode, symbols };
}

/** @returns {{ width: number, height: number, channels: 3, data: Uint8Array }} RGB */
export function decodeJpeg(buf) {
  if (!Buffer.isBuffer(buf)) buf = Buffer.from(buf);
  if (buf[0] !== 0xff || buf[1] !== 0xd8) throw new Error('jpeg: missing SOI');
  const qt = []; const dc = []; const ac = []; let frame = null; let restart = 0; let adobe = null;
  let off = 2;
  for (;;) {
    while (buf[off] === 0xff && buf[off + 1] === 0xff) off++;
    if (buf[off] !== 0xff) throw new Error(`jpeg: marker expected at ${off}`);
    const m = buf[off + 1]; off += 2;
    if (m === 0xd9) break;
    const len = buf.readUInt16BE(off); const seg = buf.subarray(off + 2, off + len);
    if (m === 0xdb) {
      let p = 0;
      while (p < seg.length) {
        const pq = seg[p] >> 4; const tq = seg[p] & 15; p++;
        const t = new Int32Array(64);
        for (let i = 0; i < 64; i++) { t[ZIGZAG[i]] = pq ? seg.readUInt16BE(p + i * 2) : seg[p + i]; }
        p += pq ? 128 : 64; qt[tq] = t;
      }
    } else if (m === 0xc4) {
      let p = 0;
      while (p < seg.length) {
        const tc = seg[p] >> 4; const th = seg[p] & 15; const counts = seg.subarray(p + 1, p + 17);
        const n = counts.reduce((s, c) => s + c, 0);
        const table = buildHuffman(counts, seg.subarray(p + 17, p + 17 + n));
        (tc === 0 ? dc : ac)[th] = table; p += 17 + n;
      }
    } else if (m === 0xc0 || m === 0xc1) {
      if (seg[0] !== 8) throw new Error(`jpeg: ${seg[0]}-bit precision unsupported`);
      const comps = [];
      for (let i = 0; i < seg[5]; i++) comps.push({ id: seg[6 + i * 3], h: seg[7 + i * 3] >> 4, v: seg[7 + i * 3] & 15, tq: seg[8 + i * 3] });
      frame = { height: seg.readUInt16BE(1), width: seg.readUInt16BE(3), comps };
    } else if ((m >= 0xc2 && m <= 0xcf) && m !== 0xc4 && m !== 0xc8 && m !== 0xcc) {
      throw new Error(`jpeg: SOF marker 0x${m.toString(16)} (progressive/lossless/arithmetic) unsupported`);
    } else if (m === 0xdd) {
      restart = seg.readUInt16BE(0);
    } else if (m === 0xee && seg.toString('latin1', 0, 5) === 'Adobe') {
      adobe = seg[11];
    } else if (m === 0xda) {
      if (!frame) throw new Error('jpeg: SOS before SOF');
      const ns = seg[0]; const scomps = [];
      for (let i = 0; i < ns; i++) {
        const c = frame.comps.find((x) => x.id === seg[1 + i * 2]);
        c.dc = dc[seg[2 + i * 2] >> 4]; c.ac = ac[seg[2 + i * 2] & 15]; scomps.push(c);
      }
      if (ns !== frame.comps.length) throw new Error('jpeg: non-interleaved scans unsupported');
      off = decodeScan(buf, off + len, frame, scomps, qt, restart);
      continue;
    }
    off += len;
  }
  if (!frame || !frame.comps[0].pixels) throw new Error('jpeg: no image data');
  return toRgb(frame, adobe);
}

function decodeScan(buf, start, frame, comps, qt, restart) {
  const hmax = Math.max(...frame.comps.map((c) => c.h)); const vmax = Math.max(...frame.comps.map((c) => c.v));
  const mcux = Math.ceil(frame.width / (8 * hmax)); const mcuy = Math.ceil(frame.height / (8 * vmax));
  for (const c of comps) {
    c.bw = mcux * c.h; c.bh = mcuy * c.v; c.stride = c.bw * 8;
    c.pixels = new Uint8Array(c.stride * c.bh * 8); c.pred = 0; c.q = qt[c.tq];
    if (!c.q || !c.dc || !c.ac) throw new Error('jpeg: missing table');
  }
  let pos = start; let bits = 0; let nbits = 0;
  const readBit = () => {
    if (nbits === 0) {
      let b = buf[pos++];
      if (b === 0xff) {
        const n = buf[pos];
        if (n === 0) pos++;
        else if (n >= 0xd0 && n <= 0xd7) throw new Error('jpeg: unexpected RST');
        else { b = 0; pos--; }            // marker: feed zeros, decoder stops at MCU count
      }
      bits = b; nbits = 8;
    }
    nbits--; return (bits >> nbits) & 1;
  };
  const receive = (n) => { let v = 0; for (let i = 0; i < n; i++) v = (v << 1) | readBit(); return v; };
  const extend = (v, n) => (n === 0 ? 0 : v < 1 << (n - 1) ? v - (1 << n) + 1 : v);
  const decodeSym = (t) => {
    let code = readBit(); let l = 1;
    while (code > t.maxcode[l]) { code = (code << 1) | readBit(); l++; if (l > 16) throw new Error('jpeg: bad Huffman code'); }
    return t.symbols[t.valptr[l] + code - t.mincode[l]];
  };
  const coef = new Float64Array(64); const tmp = new Float64Array(64);
  const block = (c, bx, by) => {
    coef.fill(0);
    const s = decodeSym(c.dc); c.pred += extend(receive(s), s); coef[0] = c.pred * c.q[0];
    for (let k = 1; k < 64;) {
      const rs = decodeSym(c.ac); const r = rs >> 4; const sz = rs & 15;
      if (sz === 0) { if (r === 15) { k += 16; continue; } break; }
      k += r; if (k > 63) throw new Error('jpeg: coefficient overflow');
      coef[ZIGZAG[k]] = extend(receive(sz), sz) * c.q[ZIGZAG[k]]; k++;
    }
    // separable 2-D IDCT: rows then columns
    for (let y = 0; y < 8; y++) for (let x = 0; x < 8; x++) {
      let s = 0; for (let u = 0; u < 8; u++) s += COS[x * 8 + u] * coef[y * 8 + u]; tmp[y * 8 + x] = s;
    }
    const o = by * 8 * c.stride + bx * 8;
    for (let x = 0; x < 8; x++) for (let y = 0; y < 8; y++) {
      let s = 0; for (let v = 0; v < 8; v++) s += COS[y * 8 + v] * tmp[v * 8 + x];
      const p = Math.round(s + 128); c.pixels[o + y * c.stride + x] = p < 0 ? 0 : p > 255 ? 255 : p;
    }
  };
  const total = mcux * mcuy;
  for (let n = 0; n < total; n++) {
    if (restart && n > 0 && n % restart === 0) {
      nbits = 0;
      while (pos < buf.length && !(buf[pos] === 0xff && buf[pos + 1] >= 0xd0 && buf[pos + 1] <= 0xd7)) pos++;
      pos += 2; for (const c of comps) c.pred = 0;
    }
    const mx = n % mcux; const my = (n / mcux) | 0;
    for (const c of comps) for (let v = 0; v < c.v; v++) for (let h = 0; h < c.h; h++) block(c, mx * c.h + h, my * c.v + v);
  }
  // find the next marker after the entropy-coded segment
  while (pos < buf.length - 1 && !(buf[pos] === 0xff && buf[pos + 1] !== 0 && !(buf[pos + 1] >= 0xd0 && buf[pos + 1] <= 0xd7))) pos++;
  return pos;
}

function toRgb(frame, adobe) {
  const { width, height, comps } = frame;
  const hmax = Math.max(...comps.map((c) => c.h)); const vmax = Math.max(...comps.map((c) => c.v));
  const out = new Uint8Array(width * height * 3);
  const sample = (c, x, y) => c.pixels[((y * c.v) / vmax | 0) * c.stride + ((x * c.h) / hmax | 0)];
  const ycc = comps.length === 3 && adobe !== 0;
  for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
    const o = (y * width + x) * 3;
    if (comps.length === 1) { const g = sample(comps[0], x, y); out[o] = g; out[o + 1] = g; out[o + 2] = g; continue; }
    const a = sample(comps[0], x, y); const b = sample(comps[1], x, y); const c = sample(comps[2], x, y);
    if (!ycc) { out[o] = a; out[o + 1] = b; out[o + 2] = c; continue; }
    const r = a + 1.402 * (c - 128); const g = a - 0.344136 * (b - 128) - 0.714136 * (c - 128); const bl = a + 1.772 * (b - 128);
    out[o] = r < 0 ? 0 : r > 255 ? 255 : Math.round(r);
    out[o + 1] = g < 0 ? 0 : g > 255 ? 255 : Math.round(g);
    out[o + 2] = bl < 0 ? 0 : bl > 255 ? 255 : Math.round(bl);
  }
  return { width, height, channels: 3, data: out };
}

/** Decodes by signature. */
export function decodeImage(buf) {
  if (buf[0] === 0x89 && buf[1] === 0x50) return decodePng(buf);
  if (buf[0] === 0xff && buf[1] === 0xd8) return decodeJpeg(buf);
  throw new Error('decodeImage: neither PNG nor JPEG');
}

/** WebM/Matroska: Segment → Info → Duration (float, in TimecodeScale ns units). Returns seconds. */
export function webmDuration(buf) {
  if (!Buffer.isBuffer(buf)) buf = Buffer.from(buf);
  const vint = (p, keepMarker) => {
    const first = buf[p]; let len = 1; while (len <= 8 && !(first & (0x80 >> (len - 1)))) len++;
    if (len > 8) throw new Error('webm: bad vint');
    let v = keepMarker ? first : first & (0xff >> len);
    for (let i = 1; i < len; i++) v = v * 256 + buf[p + i];
    return { v, len };
  };
  const walk = (start, end, want) => {
    let p = start;
    while (p < end) {
      const id = vint(p, true); p += id.len; const size = vint(p, false); p += size.len;
      if (id.v === want) return { start: p, end: Math.min(end, p + size.v) };
      if (size.v >= 2 ** 56 - 1) return null;             // unknown-size element: cannot skip
      p += size.v;
    }
    return null;
  };
  const seg = walk(0, buf.length, 0x18538067);
  if (!seg) throw new Error('webm: Segment not found');
  // Segment may be unknown-size (live); bound the search by the buffer
  const info = walk(seg.start, buf.length, 0x1549a966);
  if (!info) throw new Error('webm: Info not found');
  let scale = 1e6; let duration = null; let p = info.start;
  while (p < info.end) {
    const id = vint(p, true); p += id.len; const size = vint(p, false); p += size.len;
    if (id.v === 0x2ad7b1) { scale = 0; for (let i = 0; i < size.v; i++) scale = scale * 256 + buf[p + i]; }
    if (id.v === 0x4489) duration = size.v === 4 ? buf.readFloatBE(p) : buf.readDoubleBE(p);
    p += size.v;
  }
  if (duration === null) throw new Error('webm: Duration not found');
  return (duration * scale) / 1e9;
}

/** WebM pixel size from the first video track (Tracks → TrackEntry → Video → PixelWidth/PixelHeight). */
export function webmSize(buf) {
  if (!Buffer.isBuffer(buf)) buf = Buffer.from(buf);
  const ids = { PixelWidth: [0xb0], PixelHeight: [0xba] };
  // linear scan for the Video element (0xE0) and read its children
  for (let p = 0; p < buf.length - 4; p++) {
    if (buf[p] !== 0xe0) continue;
    const sizeByte = buf[p + 1]; let len = 1; while (len <= 8 && !(sizeByte & (0x80 >> (len - 1)))) len++;
    if (len > 8) continue;
    let size = sizeByte & (0xff >> len); for (let i = 1; i < len; i++) size = size * 256 + buf[p + 1 + i];
    const start = p + 1 + len; const end = start + size; if (size > 64 || end > buf.length) continue;
    const found = {}; let q = start;
    while (q < end) {
      const id = buf[q]; const s = buf[q + 1] & 0x7f; if (!(buf[q + 1] & 0x80)) break;
      let v = 0; for (let i = 0; i < s; i++) v = v * 256 + buf[q + 2 + i];
      if (id === ids.PixelWidth[0]) found.width = v; if (id === ids.PixelHeight[0]) found.height = v;
      q += 2 + s;
    }
    if (found.width && found.height) return found;
  }
  throw new Error('webm: video size not found');
}

const round = (v, d = 3) => Math.round(v * 10 ** d) / 10 ** d;

/** Statistics written into scenes.manifest.json and asserted by the band tests. */
export function sceneStats({ width, height, data }) {
  const n = width * height; const luma = new Float32Array(n);
  let sum = 0; let sum2 = 0; let rgS = 0; let rgS2 = 0; let ybS = 0; let ybS2 = 0;
  for (let i = 0; i < n; i++) {
    const r = data[i * 3]; const g = data[i * 3 + 1]; const b = data[i * 3 + 2];
    const y = 0.2126 * r + 0.7152 * g + 0.0722 * b; luma[i] = y; sum += y; sum2 += y * y;
    const rg = r - g; const yb = 0.5 * (r + g) - b; rgS += rg; rgS2 += rg * rg; ybS += yb; ybS2 += yb * yb;
  }
  const mean = sum / n; const sigma = Math.sqrt(Math.max(0, sum2 / n - mean * mean));
  const mrg = rgS / n; const myb = ybS / n;
  const srg = Math.sqrt(Math.max(0, rgS2 / n - mrg * mrg)); const syb = Math.sqrt(Math.max(0, ybS2 / n - myb * myb));
  const colourfulness = Math.sqrt(srg * srg + syb * syb) + 0.3 * Math.sqrt(mrg * mrg + myb * myb);
  let blocks = 0; let busy = 0;
  for (let by = 0; by + 8 <= height; by += 8) for (let bx = 0; bx + 8 <= width; bx += 8) {
    let lo = 255; let hi = 0;
    for (let y = by; y < by + 8; y++) for (let x = bx; x < bx + 8; x++) { const v = luma[y * width + x]; if (v < lo) lo = v; if (v > hi) hi = v; }
    blocks++; if (hi - lo >= 40) busy++;
  }
  return { meanLuminance: round(mean), luminanceSigma: round(sigma), colourfulness: round(colourfulness), hfBlockShare: round(busy / blocks, 4) };
}

export const LUMINANCE_DEFINITION = 'Rec.709 luma (0.2126R+0.7152G+0.0722B) on sRGB-encoded 8-bit values, 0..255, population sigma';
