#!/usr/bin/env node
/* REQ-QUAL-07 (FIN-427): authoring tool that derives the 9 certification scene files.
   Usage: node scripts/qual/scenes/generate.mjs --sources <dir written by fetch-sources.mjs> [--out certification/scenes]
   Needs ImageMagick 7 (`magick`) and ffmpeg with libvpx-vp9. Authoring only (local/remote runner), never a CI lane.
   - photo, dark-media, video-frame(.jpg/.webm): CC0 Commons originals (fetch-sources.mjs), centre-cropped to 2880×1800.
   - saturated-abstract, flat-white, flat-black, hf-pattern: pixels computed here (owned, repo licence).
   - dense-text: seeded English-word prose set in Noto Sans (OFL-1.1) by ImageMagick (owned, repo licence).
   Writes scripts/qual/scenes/provenance.json (machine record of sources + derivation commands); then run
   write-manifest.mjs to compute the manifest statistics from the written files. */
import { execFileSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync, unlinkSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, '../../..');
const arg = (name, d) => { const i = process.argv.indexOf(name); return i > 0 ? process.argv[i + 1] : d; };
const SRC = arg('--sources');
const OUT = resolve(ROOT, arg('--out', 'certification/scenes'));
if (!SRC) { console.error('usage: generate.mjs --sources <dir> [--out certification/scenes]'); process.exit(2); }
const prov = JSON.parse(readFileSync(join(SRC, 'provenance.json'), 'utf8'));
const W = 2880; const H = 1800;
const TMP = mkdtempSync(join(tmpdir(), 'ag-scenes-'));
const run = (cmd, args) => { execFileSync(cmd, args, { stdio: ['ignore', 'ignore', 'inherit'] }); return [cmd, ...args.map((a) => a.replace(SRC, '<sources>').replace(OUT, '<out>').replace(TMP, '<tmp>'))].join(' '); };
const tool = (cmd, args) => execFileSync(cmd, args, { encoding: 'utf8' }).trim().split('\n')[0];
const derivation = {};

// deterministic PRNG (mulberry32)
const rng = (seed) => () => { seed |= 0; seed = (seed + 0x6d2b79f5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };

function writePnm(path, w, h, channels, fill) {
  const header = Buffer.from(`${channels === 1 ? 'P5' : 'P6'}\n${w} ${h}\n255\n`, 'latin1');
  const px = Buffer.alloc(w * h * channels);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) fill(x, y, px, (y * w + x) * channels);
  writeFileSync(path, Buffer.concat([header, px]));
}
const jpegArgs = ['-strip', '-interlace', 'none', '-sampling-factor', '4:2:0', '-quality', '82'];
// 8-bit, non-interlaced PNG; colour type 0 (grey) or 2 (RGB) so decode.mjs reads every file without a dependency
const pngArgs = (type) => ['-strip', '-depth', '8', '-define', 'png:bit-depth=8', '-define', `png:color-type=${type}`,
  '-define', 'png:compression-level=9', '-define', 'png:exclude-chunks=date,time'];
const crop = ['-auto-orient', '-resize', `${W}x${H}^`, '-gravity', 'center', '-extent', `${W}x${H}`, '-colorspace', 'sRGB'];

mkdirSync(OUT, { recursive: true });
for (const stale of ['photo.jpg']) if (existsSync(join(OUT, stale))) unlinkSync(join(OUT, stale));

// photo / dark-media: CC0 originals
for (const id of ['photo', 'dark-media']) {
  const src = join(SRC, prov.files[id].file);
  derivation[id] = { file: `${id}.jpg`, commands: [run('magick', [src, ...crop, ...jpegArgs, join(OUT, `${id}.jpg`)])] };
}

// video-frame: 2 s VP9 loop from 2.0 s of the CC0 original + the still at 2.0 s
{
  const src = join(SRC, prov.files['video-frame'].file);
  const vf = `scale=-2:${H}:flags=lanczos,crop=${W}:${H}`;
  const still = join(TMP, 'still.png');
  derivation['video-frame'] = {
    file: 'video-frame.jpg', video: 'video-frame.webm',
    commands: [
      run('ffmpeg', ['-v', 'error', '-y', '-ss', '2', '-i', src, '-frames:v', '1', '-vf', vf, still]),
      run('magick', [still, ...crop, ...jpegArgs, join(OUT, 'video-frame.jpg')]),
      run('ffmpeg', ['-v', 'error', '-y', '-ss', '2', '-t', '2', '-i', src, '-an', '-vf', `${vf},fps=30`, '-c:v', 'libvpx-vp9',
        '-b:v', '0', '-crf', '42', '-row-mt', '1', '-deadline', 'good', '-cpu-used', '2', '-pix_fmt', 'yuv420p',
        '-fflags', '+bitexact', '-flags:v', '+bitexact', '-map_metadata', '-1', join(OUT, 'video-frame.webm')]),
    ],
  };
}

// flat-white / flat-black: uniform fields
for (const [id, v] of [['flat-white', 255], ['flat-black', 0]]) {
  const pnm = join(TMP, `${id}.pgm`);
  writePnm(pnm, W, H, 1, (x, y, px, o) => { px[o] = v; });
  derivation[id] = { file: `${id}.png`, pixels: `uniform ${v}`, commands: [run('magick', [pnm, ...pngArgs(0), join(OUT, `${id}.png`)])] };
}

// hf-pattern: 6×4 tiles of periodic high-frequency patterns (checkers, stripes, diagonals, dots), each tinted
{
  const pnm = join(TMP, 'hf.ppm'); const tw = W / 6; const th = H / 4;
  const tints = [[255, 255, 255], [255, 220, 200], [200, 230, 255], [220, 255, 210], [255, 240, 190], [230, 210, 255]];
  writePnm(pnm, W, H, 3, (x, y, px, o) => {
    const tx = Math.floor(x / tw); const ty = Math.floor(y / th); const k = ty * 6 + tx; const p = 1 + (k % 4);
    let on;
    switch (k % 6) {
      case 0: on = (Math.floor(x / p) + Math.floor(y / p)) % 2 === 0; break;            // checkerboard p px
      case 1: on = Math.floor(x / p) % 2 === 0; break;                                   // vertical stripes
      case 2: on = Math.floor(y / p) % 2 === 0; break;                                   // horizontal stripes
      case 3: on = Math.floor((x + y) / (p + 1)) % 2 === 0; break;                       // diagonal
      case 4: on = Math.floor((x - y + H) / (p + 1)) % 2 === 0; break;                   // anti-diagonal
      default: on = x % (p + 2) < 2 && y % (p + 2) < 2;                                  // dot grid
    }
    const t = tints[(tx + ty) % tints.length]; const lo = 24;
    for (let c = 0; c < 3; c++) px[o + c] = on ? t[c] : lo;
  });
  derivation['hf-pattern'] = { file: 'hf-pattern.png', pixels: '6x4 tiles of 1-6 px periodic patterns', commands: [run('magick', [pnm, ...pngArgs(2), join(OUT, 'hf-pattern.png')])] };
}

// saturated-abstract: overlapping fully saturated hue fields (HSV, S=1) with a luminance sweep
{
  const pnm = join(TMP, 'sat.ppm'); const r = rng(20261010);
  const blobs = Array.from({ length: 9 }, () => ({ x: r() * W, y: r() * H, s: 300 + r() * 700, hue: r() * 360 }));
  const hsv = (h, v) => { const c = v; const hp = (h % 360) / 60; const xx = c * (1 - Math.abs((hp % 2) - 1));
    const [a, b, d] = hp < 1 ? [c, xx, 0] : hp < 2 ? [xx, c, 0] : hp < 3 ? [0, c, xx] : hp < 4 ? [0, xx, c] : hp < 5 ? [xx, 0, c] : [c, 0, xx];
    return [a, b, d]; };
  writePnm(pnm, W, H, 3, (x, y, px, o) => {
    let wsum = 0; let hx = 0; let hy = 0;
    for (const bl of blobs) { const w = Math.exp(-(((x - bl.x) ** 2 + (y - bl.y) ** 2) / (2 * bl.s * bl.s)));
      wsum += w; hx += w * Math.cos((bl.hue * Math.PI) / 180); hy += w * Math.sin((bl.hue * Math.PI) / 180); }
    const hue = ((Math.atan2(hy, hx) * 180) / Math.PI + 360) % 360;
    const v = 0.25 + 0.75 * (0.5 + 0.5 * Math.sin(x / 210 + Math.sin(y / 330) * 2.2));
    const [a, b, d] = hsv(hue + 40 * Math.sin(y / 400), v * Math.min(1, 0.55 + wsum));
    px[o] = Math.round(a * 255); px[o + 1] = Math.round(b * 255); px[o + 2] = Math.round(d * 255);
  });
  derivation['saturated-abstract'] = { file: 'saturated-abstract.jpg', pixels: 'seeded HSV field, seed 20261010', commands: [run('magick', [pnm, ...jpegArgs, join(OUT, 'saturated-abstract.jpg')])] };
}

// dense-text: seeded prose from a fixed vocabulary in four columns of Noto Sans
{
  const r = rng(7);
  const words = ('glass surface layer depth light shadow window panel border frame motion colour contrast reading text label value '
    + 'button switch slider field toast control system design token theme scene image photo video night city river lake mountain '
    + 'morning evening north south quiet bright clear dark soft sharp small large thin thick regular raised sunken open closed '
    + 'every each other many most some first second third final early later between under above behind across through around '
    + 'shows keeps holds turns moves reads writes builds checks measures renders blends filters scales tests ships passes fails '
    + 'the a of and to in on for with from by at as is are was were be has have will can should must').split(' ');
  const sentence = () => { const n = 7 + Math.floor(r() * 9); const w = Array.from({ length: n }, () => words[Math.floor(r() * words.length)]);
    w[0] = w[0][0].toUpperCase() + w[0].slice(1); return `${w.join(' ')}.`; };
  const para = () => Array.from({ length: 4 + Math.floor(r() * 3) }, sentence).join(' ');
  const cols = 4; const gutter = 64; const margin = 96; const colW = Math.floor((W - 2 * margin - (cols - 1) * gutter) / cols);
  const args = ['-size', `${W}x${H}`, 'xc:#f6f5f2', '-colorspace', 'sRGB'];
  const font = join(SRC, 'NotoSans-Regular.ttf'); const bold = join(SRC, 'NotoSans-Bold.ttf');
  const text = [];
  for (let c = 0; c < cols; c++) {
    const body = Array.from({ length: 5 }, para).join('\n\n'); text.push(body);
    const txt = join(TMP, `col${c}.txt`); writeFileSync(txt, body);
    const head = join(TMP, `head${c}.txt`); writeFileSync(head, `Section ${c + 1}: ${sentence().replace(/\.$/, '')}`);
    const x = margin + c * (colW + gutter);
    args.push('(', '-size', `${colW}x`, '-background', 'none', '-fill', '#141414', '-font', bold, '-pointsize', '30', `caption:@${head}`, ')',
      '-geometry', `+${x}+${margin}`, '-composite',
      '(', '-size', `${colW}x${H - 2 * margin - 110}`, '-background', 'none', '-fill', '#202020', '-font', font, '-pointsize', '23',
      '-interline-spacing', '6', `caption:@${txt}`, ')', '-geometry', `+${x}+${margin + 110}`, '-composite');
  }
  args.push('-colorspace', 'Gray', ...pngArgs(0), join(OUT, 'dense-text.png'));
  derivation['dense-text'] = { file: 'dense-text.png', pixels: 'seeded vocabulary prose, seed 7, Noto Sans 23/30 px', commands: [run('magick', args)],
    words: text.join(' ').split(/\s+/).filter(Boolean).length };
}

rmSync(TMP, { recursive: true, force: true });
const record = {
  retrievedAt: prov.retrievedAt, api: prov.api, files: prov.files, fonts: prov.fonts,
  tools: { magick: tool('magick', ['-version']), ffmpeg: tool('ffmpeg', ['-version']) },
  derivation,
};
writeFileSync(join(HERE, 'provenance.json'), `${JSON.stringify(record, null, 2)}\n`);
console.log(`wrote ${OUT} and ${join(HERE, 'provenance.json')}; now run: node scripts/qual/scenes/write-manifest.mjs`);
