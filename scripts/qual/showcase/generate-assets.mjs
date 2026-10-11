#!/usr/bin/env node
/* REQ-QUAL-58 / REQ-QUAL-59 showcase asset generator (FIN-G, QUAL-owned).
 *
 * Every showcase image is original artwork drawn here from deterministic SVG
 * (no randomness, no network, no third-party imagery) and encoded to AVIF with
 * sharp. The output is therefore owned by the project and released as CC0-1.0,
 * which satisfies "licensed for a public static site". Each run also writes
 * showcase/<id>/assets/ASSETS.json with the licence, the generator path and the
 * name/dimensions of every file, so provenance is checkable. (AVIF bytes are not
 * pinned: encoder output can differ between libvips builds.)
 *
 * Usage: node scripts/qual/showcase/generate-assets.mjs [--check]
 *   --check  regenerate in memory and exit 1 if any planned file is missing,
 *            any ASSETS.json is stale, or any encoding exceeds the limits.
 *
 * sharp is resolved from the repo's installed dependencies (root or the
 * apps/docs workspace); the script fails with a clear message when absent.
 */
import { mkdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const LIMIT_BYTES = 300 * 1024;
const LIMIT_COUNT = 12;

function loadSharp() {
  const candidates = [ROOT, path.join(ROOT, 'apps', 'docs')];
  for (const dir of candidates) {
    try {
      return createRequire(path.join(dir, 'package.json'))('sharp');
    } catch {
      /* try the next workspace */
    }
  }
  throw new Error('generate-assets: sharp is not installed (looked in the root and apps/docs workspaces).');
}

/* ---- deterministic drawing helpers ---- */
const svg = (w, h, body) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${body}</svg>`;

const linear = (id, stops, x2 = 0, y2 = 1) =>
  `<linearGradient id="${id}" x1="0" y1="0" x2="${x2}" y2="${y2}">${stops
    .map(([o, c]) => `<stop offset="${o}" stop-color="${c}"/>`)
    .join('')}</linearGradient>`;

function mark(glyphPath, from, to) {
  return svg(256, 256,
    `<defs>${linear('g', [[0, from], [1, to]], 1, 1)}</defs>` +
    `<rect width="256" height="256" rx="56" fill="url(#g)"/>` +
    `<path d="${glyphPath}" fill="none" stroke="#ffffff" stroke-width="18" stroke-linecap="round" stroke-linejoin="round"/>`);
}

function landscape(w, h, sky, hills, sunY) {
  const layers = hills
    .map((c, i) => {
      const base = h * (0.55 + i * 0.12);
      const amp = h * (0.08 - i * 0.015);
      const pts = [];
      for (let x = 0; x <= w; x += w / 12) {
        const y = base - amp * Math.sin((x / w) * Math.PI * (2 + i) + i * 1.3);
        pts.push(`${x.toFixed(1)},${y.toFixed(1)}`);
      }
      return `<polygon points="0,${h} ${pts.join(' ')} ${w},${h}" fill="${c}"/>`;
    })
    .join('');
  return svg(w, h,
    `<defs>${linear('sky', sky)}</defs><rect width="${w}" height="${h}" fill="url(#sky)"/>` +
    `<circle cx="${w * 0.7}" cy="${h * sunY}" r="${h * 0.09}" fill="#fff4d6" opacity="0.9"/>` + layers);
}

function cover(w, rings, from, to) {
  const c = w / 2;
  const circles = rings
    .map((col, i) => `<circle cx="${c}" cy="${c}" r="${(w * 0.42 * (rings.length - i)) / rings.length}" fill="${col}"/>`)
    .join('');
  return svg(w, w, `<defs>${linear('bg', [[0, from], [1, to]], 1, 1)}</defs><rect width="${w}" height="${w}" fill="url(#bg)"/>${circles}`);
}

function product(w, h, bgFrom, bgTo, shape, body) {
  const shapes = {
    chair: `<rect x="${w * 0.3}" y="${h * 0.3}" width="${w * 0.4}" height="${h * 0.32}" rx="${w * 0.05}" fill="${body}"/>` +
      `<rect x="${w * 0.28}" y="${h * 0.58}" width="${w * 0.44}" height="${h * 0.08}" rx="${w * 0.03}" fill="${body}"/>` +
      `<rect x="${w * 0.32}" y="${h * 0.64}" width="${w * 0.03}" height="${h * 0.2}" fill="#3b3b3b"/>` +
      `<rect x="${w * 0.65}" y="${h * 0.64}" width="${w * 0.03}" height="${h * 0.2}" fill="#3b3b3b"/>`,
    lamp: `<polygon points="${w * 0.36},${h * 0.42} ${w * 0.64},${h * 0.42} ${w * 0.58},${h * 0.24} ${w * 0.42},${h * 0.24}" fill="${body}"/>` +
      `<rect x="${w * 0.49}" y="${h * 0.42}" width="${w * 0.02}" height="${h * 0.36}" fill="#4a4a4a"/>` +
      `<ellipse cx="${w * 0.5}" cy="${h * 0.8}" rx="${w * 0.12}" ry="${h * 0.03}" fill="#4a4a4a"/>`,
    mug: `<rect x="${w * 0.36}" y="${h * 0.36}" width="${w * 0.26}" height="${h * 0.34}" rx="${w * 0.03}" fill="${body}"/>` +
      `<circle cx="${w * 0.64}" cy="${h * 0.52}" r="${h * 0.08}" fill="none" stroke="${body}" stroke-width="${w * 0.025}"/>`,
    bag: `<rect x="${w * 0.32}" y="${h * 0.36}" width="${w * 0.36}" height="${h * 0.4}" rx="${w * 0.04}" fill="${body}"/>` +
      `<path d="M${w * 0.42} ${h * 0.36} q${w * 0.08} ${-h * 0.16} ${w * 0.16} 0" fill="none" stroke="${body}" stroke-width="${w * 0.02}"/>`,
  };
  return svg(w, h,
    `<defs>${linear('bg', [[0, bgFrom], [1, bgTo]])}</defs><rect width="${w}" height="${h}" fill="url(#bg)"/>` +
    `<ellipse cx="${w * 0.5}" cy="${h * 0.86}" rx="${w * 0.26}" ry="${h * 0.035}" fill="#000000" opacity="0.12"/>` + shapes[shape]);
}

function room(w, h, from, to, accent) {
  return svg(w, h,
    `<defs>${linear('bg', [[0, from], [1, to]])}</defs><rect width="${w}" height="${h}" fill="url(#bg)"/>` +
    `<rect x="0" y="${h * 0.68}" width="${w}" height="${h * 0.32}" fill="#000000" opacity="0.18"/>` +
    `<rect x="${w * 0.12}" y="${h * 0.2}" width="${w * 0.3}" height="${h * 0.34}" fill="#ffffff" opacity="0.22"/>` +
    `<rect x="${w * 0.58}" y="${h * 0.48}" width="${w * 0.28}" height="${h * 0.2}" rx="${h * 0.03}" fill="${accent}"/>`);
}

function documentCover(w, h) {
  const lines = Array.from({ length: 9 }, (_, i) =>
    `<rect x="${w * 0.14}" y="${h * (0.36 + i * 0.06)}" width="${w * (i % 3 === 2 ? 0.48 : 0.72)}" height="${h * 0.018}" rx="4" fill="#ffffff" opacity="0.55"/>`).join('');
  return svg(w, h,
    `<defs>${linear('bg', [[0, '#3a4f9a'], [1, '#8a5bb8']], 1, 1)}</defs><rect width="${w}" height="${h}" fill="url(#bg)"/>` +
    `<rect x="${w * 0.14}" y="${h * 0.16}" width="${w * 0.5}" height="${h * 0.06}" rx="6" fill="#ffffff" opacity="0.85"/>` + lines);
}

/* ---- the asset plan: id -> [{ file, width, height, svg, alt }] ---- */
const GLYPH_SPARK = 'M128 52 L128 204 M52 128 L204 128 M78 78 L178 178 M178 78 L78 178';
const GLYPH_LEDGER = 'M72 184 L72 72 M72 184 L188 184 M100 152 L132 116 L156 136 L188 92';
const GLYPH_BEACON = 'M128 64 L128 120 M84 192 a44 44 0 0 1 88 0 M64 120 a64 64 0 0 1 128 0';
const GLYPH_TASKS = 'M72 92 L96 116 L136 76 M72 164 L96 188 L136 148 M156 100 L196 100 M156 172 L196 172';
const GLYPH_CHART = 'M68 188 L68 132 M108 188 L108 92 M148 188 L148 116 M188 188 L188 68';

export const PLAN = {
  'ai-command-center': [{ file: 'workspace-mark.avif', width: 256, height: 256, draw: () => mark(GLYPH_SPARK, '#3d2c8d', '#0f8b8d') }],
  'financial-dashboard': [{ file: 'ledgerline-mark.avif', width: 256, height: 256, draw: () => mark(GLYPH_LEDGER, '#0b5d3b', '#1e88e5') }],
  'ops-console': [{ file: 'beacon-mark.avif', width: 256, height: 256, draw: () => mark(GLYPH_BEACON, '#7a1f1f', '#d9480f') }],
  'media-workspace': [
    { file: 'still-harbor.avif', width: 1280, height: 720, draw: () => landscape(1280, 720, [[0, '#1c2b4a'], [1, '#e08e5a']], ['#2f3d5c', '#22304a', '#141d30'], 0.42) },
    { file: 'still-ridge.avif', width: 1280, height: 720, draw: () => landscape(1280, 720, [[0, '#7fb3d5'], [1, '#f4e1c1']], ['#5d7f5a', '#3f5e3d', '#294229'], 0.3) },
    { file: 'still-dunes.avif', width: 1280, height: 720, draw: () => landscape(1280, 720, [[0, '#f2b880'], [1, '#fbe3c4']], ['#d08c4a', '#b06f34', '#8a5424'], 0.35) },
    { file: 'still-night.avif', width: 1280, height: 720, draw: () => landscape(1280, 720, [[0, '#0b1026'], [1, '#2c3e70']], ['#1d2546', '#141a33', '#0b0f21'], 0.25) },
  ],
  'collaborative-workspace': [{ file: 'brief-cover.avif', width: 960, height: 540, draw: () => documentCover(960, 540) }],
  'mobile-productivity': [{ file: 'tasks-mark.avif', width: 256, height: 256, draw: () => mark(GLYPH_TASKS, '#5b2a86', '#e05780') }],
  'music-player': [
    { file: 'cover-tidal.avif', width: 512, height: 512, draw: () => cover(512, ['#0e3b5c', '#1f6f8b', '#99d5c9'], '#06202f', '#1b4b5a') },
    { file: 'cover-ember.avif', width: 512, height: 512, draw: () => cover(512, ['#7a1f1f', '#d9480f', '#ffc078'], '#2b0b0b', '#5c1a1a') },
    { file: 'cover-meadow.avif', width: 512, height: 512, draw: () => cover(512, ['#2b5d34', '#74b72e', '#e9f5db'], '#132a17', '#345e3b') },
    { file: 'cover-dusk.avif', width: 512, height: 512, draw: () => cover(512, ['#3d2c8d', '#916bbf', '#f1d1ff'], '#1a1240', '#3b2d6b') },
    { file: 'cover-salt.avif', width: 512, height: 512, draw: () => cover(512, ['#495057', '#adb5bd', '#f8f9fa'], '#212529', '#495057') },
  ],
  'spatial-control-center': [
    { file: 'room-living.avif', width: 960, height: 600, draw: () => room(960, 600, '#e9d8c4', '#b89b7d', '#6d597a') },
    { file: 'room-studio.avif', width: 960, height: 600, draw: () => room(960, 600, '#cfe1ea', '#7c9fb0', '#355070') },
    { file: 'room-kitchen.avif', width: 960, height: 600, draw: () => room(960, 600, '#f3ead3', '#c9b98f', '#b56576') },
  ],
  ecommerce: [
    { file: 'atlas-chair.avif', width: 960, height: 960, draw: () => product(960, 960, '#efe6dc', '#d8c9b8', 'chair', '#8a5a44') },
    { file: 'atlas-chair-side.avif', width: 960, height: 960, draw: () => product(960, 960, '#e4e9ee', '#c5ced8', 'chair', '#8a5a44') },
    { file: 'nimbus-lamp.avif', width: 960, height: 960, draw: () => product(960, 960, '#f1efe7', '#d7d2c1', 'lamp', '#d9a441') },
    { file: 'vega-mug.avif', width: 960, height: 960, draw: () => product(960, 960, '#e7eef0', '#c3d3d8', 'mug', '#2f6f73') },
    { file: 'orbit-tote.avif', width: 960, height: 960, draw: () => product(960, 960, '#f3e9e4', '#dcc5bb', 'bag', '#a44a3f') },
  ],
  analytics: [{ file: 'insight-mark.avif', width: 256, height: 256, draw: () => mark(GLYPH_CHART, '#0b4f6c', '#01baef') }],
};

async function render(sharp, entry) {
  const buf = await sharp(Buffer.from(entry.draw()))
    .resize(entry.width, entry.height)
    .avif({ quality: 55, effort: 4, chromaSubsampling: '4:2:0' })
    .toBuffer();
  return buf;
}

async function main() {
  const check = process.argv.includes('--check');
  const sharp = loadSharp();
  let failed = false;
  for (const [id, entries] of Object.entries(PLAN)) {
    if (entries.length > LIMIT_COUNT) throw new Error(`${id}: ${entries.length} assets > ${LIMIT_COUNT}`);
    const dir = path.join(ROOT, 'showcase', id, 'assets');
    const manifestPath = path.join(dir, 'ASSETS.json');
    const manifest = {
      licence: 'CC0-1.0',
      source: 'Original artwork drawn from deterministic SVG by scripts/qual/showcase/generate-assets.mjs (no third-party imagery).',
      files: [],
    };
    for (const entry of entries) {
      const buf = await render(sharp, entry);
      if (buf.length > LIMIT_BYTES) throw new Error(`${id}/${entry.file}: ${buf.length} bytes > ${LIMIT_BYTES}`);
      manifest.files.push({ file: entry.file, width: entry.width, height: entry.height, format: 'avif' });
      if (!check) {
        mkdirSync(dir, { recursive: true });
        writeFileSync(path.join(dir, entry.file), buf);
      } else if (!existsSync(path.join(dir, entry.file))) {
        console.error(`missing ${id}/assets/${entry.file}`);
        failed = true;
      }
    }
    const text = `${JSON.stringify(manifest, null, 2)}\n`;
    if (!check) writeFileSync(manifestPath, text);
    else if (!existsSync(manifestPath) || readFileSync(manifestPath, 'utf8') !== text) {
      console.error(`stale ${id}/assets/ASSETS.json`);
      failed = true;
    }
  }
  if (failed) process.exit(1);
  console.log(check ? 'showcase assets up to date' : 'showcase assets written');
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((err) => {
    console.error(err instanceof Error ? err.message : err);
    process.exit(1);
  });
}
