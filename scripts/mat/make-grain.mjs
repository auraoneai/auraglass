#!/usr/bin/env node
/* MAT-117 — deterministic 128x128 grain generator (seeded noise, no deps for
   the pixel pass). Emits src/material/assets/ag-grain-128.avif, <= 4 KB.
   PNG pixels come from a mulberry32 PRNG at seed 0xA6A1; the AVIF is encoded
   through ffmpeg/libaom-av1 when available, else an ImageMagick `convert`
   fallback; --png-only writes the intermediate PNG next to the target.

   Usage: node scripts/mat/make-grain.mjs [--out <path>] [--check] */
import { writeFileSync, existsSync, mkdirSync, statSync, unlinkSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join, dirname, resolve } from 'node:path';
import { tmpdir } from 'node:os';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { PNG } = require('pngjs');

const SEED = 0xa6a1;
const SIZE = 128;
export function mulberry32(seed) {
  let a = seed >>> 0;
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function grainPixels() {
  const rng = mulberry32(SEED);
  const png = new PNG({ width: SIZE, height: SIZE });
  for (let i = 0; i < SIZE * SIZE; i += 1) {
    const v = rng();                       // luminance jitter
    const g = 118 + Math.round(v * 20);    // 118..138 mid gray
    const a = Math.round(2 + rng() * 12);  // 2..14 alpha (<= ~5.5%)
    const o = i * 4;
    png.data[o] = g; png.data[o + 1] = g; png.data[o + 2] = g; png.data[o + 3] = a;
  }
  return png;
}

const isMain = process.argv[1] && resolve(process.argv[1]) === resolve(new URL(import.meta.url).pathname);

if (isMain) {
  const args = process.argv.slice(2);
  const opt = (name, fallback) => {
    const i = args.indexOf(name);
    return i >= 0 ? args[i + 1] : fallback;
  };
  const OUT = resolve(opt('--out', 'src/material/assets/ag-grain-128.avif'));
  const PNG_ONLY = args.includes('--png-only');
  const CHECK = args.includes('--check');
  const pngBuf = PNG.sync.write(grainPixels());
  const tmpPng = join(tmpdir(), `ag-grain-${process.pid}.png`);
  writeFileSync(tmpPng, pngBuf);
  mkdirSync(dirname(OUT), { recursive: true });
  if (PNG_ONLY) {
    writeFileSync(OUT.replace(/\.avif$/, '.png'), pngBuf);
    console.log(`[make-grain] wrote ${OUT.replace(/\.avif$/, '.png')} (png-only)`);
    process.exit(0);
  }
  let wrote = false;
  try {
    execFileSync('ffmpeg', ['-y', '-v', 'error', '-i', tmpPng, '-c:v', 'libaom-av1',
      '-frames:v', '1', '-pix_fmt', 'yuva420p', '-crf', '50', '-cpu-used', '8', OUT]);
    wrote = true;
  } catch {
    try {
      execFileSync('convert', [tmpPng, '-quality', '60', OUT]);
      wrote = true;
    } catch { /* no encoder available */ }
  }
  unlinkSync(tmpPng);
  if (!wrote) {
    console.error('[make-grain] no AVIF encoder available (ffmpeg libaom-av1 or ImageMagick AVIF)');
    process.exit(1);
  }
  const size = statSync(OUT).size;
  console.log(`[make-grain] wrote ${OUT} (${size} B)`);
  if (size > 4096) {
    console.error(`[make-grain] exceeds 4 KB budget (${size} B)`);
    process.exit(1);
  }
  if (CHECK) process.exit(0);
}
