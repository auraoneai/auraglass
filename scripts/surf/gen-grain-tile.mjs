#!/usr/bin/env node
/* REQ-SURF-160 — generate src/backdrops/assets/grain-112.{avif,png}:
 * deterministic 112×112 grayscale noise (mulberry32, seed 0x41475235).
 * PNG ≤16 KB; AVIF ≤8 KB encoded via ffmpeg libaom when available. */
import { deflateSync } from 'node:zlib';
import { mkdirSync, writeFileSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const W = 112, H = 112, SEED = 0x41475235;
const outDir = join(dirname(fileURLToPath(import.meta.url)), '../../src/backdrops/assets');
mkdirSync(outDir, { recursive: true });

function mulberry32(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rnd = mulberry32(SEED);
const rgba = Buffer.alloc(W * H * 4);
for (let i = 0; i < W * H; i++) {
  const v = Math.floor(rnd() * 256);
  rgba[i * 4] = v; rgba[i * 4 + 1] = v; rgba[i * 4 + 2] = v; rgba[i * 4 + 3] = 255;
}

// Minimal PNG writer (8-bit RGBA, one IDAT)
function crc32(buf) {
  let c, table = crc32.table;
  if (!table) {
    table = crc32.table = new Int32Array(256);
    for (let n = 0; n < 256; n++) {
      c = n;
      for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
      table[n] = c;
    }
  }
  c = -1;
  for (let i = 0; i < buf.length; i++) c = (c >>> 8) ^ table[(c ^ buf[i]) & 0xff];
  return (c ^ -1) >>> 0;
}
function chunk(type, data) {
  const b = Buffer.alloc(8 + data.length + 4);
  b.writeUInt32BE(data.length, 0);
  b.write(type, 4);
  data.copy(b, 8);
  b.writeUInt32BE(crc32(b.subarray(4, 8 + data.length)), 8 + data.length);
  return b;
}
const ihdr = Buffer.alloc(13);
ihdr.writeUInt32BE(W, 0); ihdr.writeUInt32BE(H, 4);
ihdr[8] = 8; ihdr[9] = 0; // 8-bit grayscale
const raw = Buffer.alloc(H * (1 + W));
for (let y = 0; y < H; y++) {
  raw[y * (1 + W)] = 0;
  for (let x = 0; x < W; x++) raw[y * (1 + W) + 1 + x] = rgba[(y * W + x) * 4];
}
const png = Buffer.concat([
  Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
  chunk('IHDR', ihdr), chunk('IDAT', deflateSync(raw, { level: 9 })), chunk('IEND', Buffer.alloc(0)),
]);
const pngPath = join(outDir, 'grain-112.png');
writeFileSync(pngPath, png);
const pngSize = statSync(pngPath).size;
console.log(`grain-112.png ${pngSize}B ${pngSize <= 16384 ? 'OK' : 'OVER 16KB'}`);

const avifPath = join(outDir, 'grain-112.avif');
let sharp;
try { sharp = (await import('sharp')).default; } catch { sharp = null; }
if (sharp) {
  await sharp(rgba, { raw: { width: W, height: H, channels: 4 } })
    .grayscale()
    .avif({ quality: 45, effort: 9 })
    .toFile(avifPath);
  const s = statSync(avifPath).size;
  console.log(`grain-112.avif ${s}B ${s <= 8192 ? 'OK' : 'OVER 8KB'}`);
} else {
  console.log('sharp unavailable — write grain-112.avif via `npm i -D sharp` then re-run');
}
