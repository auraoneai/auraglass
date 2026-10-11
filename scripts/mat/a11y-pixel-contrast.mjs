#!/usr/bin/env node
/* scripts/mat/a11y-pixel-contrast.mjs — REQ-MAT-65 (D.3-39) rendered-pixel
   text-contrast artifact: pure math shared with
   tests/visual/mat/a11y/pixel-contrast.spec.ts, the merge of the per-test part
   files the spec writes, and the fail-closed validator the GitLab lane and
   tests/a11y/pixel-contrast-artifact.test.ts both use.

   Usage (GitLab job only; numbers come from the remote browsers, never by hand):
     node scripts/mat/a11y-pixel-contrast.mjs --merge <partsDir> --out <file>
     node scripts/mat/a11y-pixel-contrast.mjs --check <file>
   --merge writes the artifact and then validates it; both modes exit 1 on any
   validation error (missing matrix cell, missing row field, failing row, no
   sha/run id) and 64 on a usage error. */
import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
export const CONTRACT_PATH = 'tests/a11y/pixel-contrast.contract.json';

export function loadContract(root = ROOT) {
  return JSON.parse(readFileSync(join(root, CONTRACT_PATH), 'utf8'));
}

// ---------------------------------------------------------------- colour math (WCAG 2.x)

const lin = (c) => {
  const v = c / 255;
  return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
};
/** WCAG relative luminance of an 8-bit sRGB triple. */
export function luminance([r, g, b]) {
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}
/** WCAG contrast ratio of two 8-bit sRGB triples. */
export function contrast(a, b) {
  const la = luminance(a), lb = luminance(b);
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}
/** Source-over composite of an sRGB colour with alpha (0..1) over an opaque backdrop. */
export function composite([r, g, b], alpha, [br, bg, bb]) {
  return [r * alpha + br * (1 - alpha), g * alpha + bg * (1 - alpha), b * alpha + bb * (1 - alpha)];
}
export const hex = ([r, g, b]) => `#${[r, g, b].map((v) => Math.round(v).toString(16).padStart(2, '0')).join('')}`;

/** Median backdrop colour of an RGBA buffer region: the pixel of median luminance
    (an actual rendered pixel, not a channel-wise blend). */
export function medianPixel(data, width, rect) {
  const px = [];
  const x0 = Math.max(0, Math.floor(rect.x)), y0 = Math.max(0, Math.floor(rect.y));
  const x1 = Math.min(width, Math.ceil(rect.x + rect.width));
  const height = data.length / 4 / width;
  const y1 = Math.min(height, Math.ceil(rect.y + rect.height));
  for (let y = y0; y < y1; y++) {
    for (let x = x0; x < x1; x++) {
      const i = (y * width + x) * 4;
      px.push([data[i], data[i + 1], data[i + 2]]);
    }
  }
  if (!px.length) return null;
  px.sort((a, b) => luminance(a) - luminance(b));
  return px[Math.floor(px.length / 2)];
}

/** Glyph core of a text run: the text-visible pixel that differs most from the
    text-hidden twin at the same position (null when the run drew no pixel). */
export function glyphCore(visible, hidden, width, rect) {
  let best = null, bestD = 0;
  const x0 = Math.max(0, Math.floor(rect.x)), y0 = Math.max(0, Math.floor(rect.y));
  const x1 = Math.min(width, Math.ceil(rect.x + rect.width));
  const height = visible.length / 4 / width;
  const y1 = Math.min(height, Math.ceil(rect.y + rect.height));
  for (let y = y0; y < y1; y++) {
    for (let x = x0; x < x1; x++) {
      const i = (y * width + x) * 4;
      const d = Math.abs(visible[i] - hidden[i]) + Math.abs(visible[i + 1] - hidden[i + 1]) + Math.abs(visible[i + 2] - hidden[i + 2]);
      if (d > bestD) { bestD = d; best = [visible[i], visible[i + 1], visible[i + 2]]; }
    }
  }
  return best;
}

/** Required ratio: contrast=more 7, large text 3, body 4.5 (contract thresholds). */
export function requiredRatio({ mode, fontSizePx, fontWeight }, thresholds) {
  if (mode === 'more') return thresholds.more;
  const large = fontSizePx >= 24 || (fontSizePx >= 18.66 && fontWeight >= 700);
  return large ? thresholds.large.ratio : thresholds.body;
}

// ---------------------------------------------------------------- artifact

export function matrixCells(contract) {
  const M = contract.matrix;
  const out = [];
  for (const scene of M.scenes) for (const engine of M.engines) for (const scheme of M.schemes)
    for (const transparency of M.transparency) for (const mode of M.modes) for (const viewport of M.viewports)
      out.push([scene, engine, scheme, transparency, mode, viewport].join('|'));
  return out;
}
const cellOf = (r) => [r.scene ?? r.background, r.engine, r.scheme, r.transparency, r.mode, r.viewport].join('|');

/** Every error that makes the artifact unacceptable; [] means valid. */
export function validateArtifact(art, contract) {
  const errors = [];
  if (!art || typeof art !== 'object') return ['artifact is not a JSON object'];
  if (!(art.sha ?? art.commit)) errors.push('artifact has no sha');
  if (!(art.runId ?? art.run ?? art.job)) errors.push('artifact has no run id / job');
  const rows = Array.isArray(art.rows) ? art.rows : [];
  if (!rows.length) errors.push('artifact has 0 rows');
  rows.forEach((row, i) => {
    const missing = contract.rowSchema.required.filter((k) => !(k in row));
    if (missing.length) errors.push(`row ${i} (${row.storyId ?? '?'}) misses ${missing.join(',')}`);
  });
  const have = new Set(rows.map(cellOf));
  const absent = matrixCells(contract).filter((c) => !have.has(c));
  if (absent.length) errors.push(`${absent.length} matrix cell(s) missing, e.g. ${absent.slice(0, 5).join(' ; ')}`);
  for (const r of rows.filter((x) => x.fail === true)) {
    errors.push(`FAIL [${r.owner ?? '?'} ${r.subject ?? '?'} ${r.storyId}] ${cellOf(r)}: "${String(r.text ?? '').slice(0, 40)}" ${r.worstRatio} < ${r.need}${r.reason ? ` (${r.reason})` : ''}`);
  }
  return errors;
}

/** Whether the lane must hold the artifact: when A11Y_PIXEL_CONTRAST_ART is set,
    on release scope/tags and on main/next/release branches (AG_SCOPE main|release). */
export function artifactRequired(env) {
  if (env.A11Y_PIXEL_CONTRAST_ART) return true;
  if (env.AG_SCOPE === 'release' || env.AG_SCOPE === 'main') return true;
  if (env.CI_COMMIT_TAG) return true;
  const b = env.CI_COMMIT_BRANCH ?? '';
  return b === 'main' || b === 'next' || /^release\//.test(b);
}

/** The gate the jest consumer applies: [] when acceptable. */
export function gate(env, root = ROOT) {
  const art = env.A11Y_PIXEL_CONTRAST_ART ?? '.artifacts/mat/a11y-pixel-contrast.json';
  const path = resolve(root, art);
  if (!existsSync(path)) return artifactRequired(env) ? [`artifact ${art} missing (required on this lane)`] : [];
  let parsed;
  try { parsed = JSON.parse(readFileSync(path, 'utf8')); } catch (e) { return [`artifact ${art} is not JSON: ${e.message}`]; }
  return validateArtifact(parsed, loadContract(root));
}

function walk(dir) {
  return readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    return statSync(p).isDirectory() ? walk(p) : p.endsWith('.json') ? [p] : [];
  });
}

/** Merge the spec's part files into one artifact. */
export function mergeParts(dir, env = process.env) {
  if (!existsSync(dir)) throw new Error(`parts dir ${dir} does not exist (pixel-contrast spec wrote nothing)`);
  const parts = walk(dir).map((p) => JSON.parse(readFileSync(p, 'utf8')));
  if (!parts.length) throw new Error(`parts dir ${dir} holds no part files`);
  return {
    version: 1,
    id: 'a11y-pixel-contrast',
    sha: env.CI_COMMIT_SHA ?? null,
    runId: env.CI_PIPELINE_ID ?? null,
    job: env.CI_JOB_ID ?? null,
    jobUrl: env.CI_JOB_URL ?? null,
    method: 'text-hidden twin; per text run the resolved text colour composited over the median rendered backdrop pixel; worst run per row',
    rows: parts.flatMap((p) => p.rows ?? []),
  };
}

export function main(argv = process.argv.slice(2), env = process.env) {
  const arg = (k) => { const i = argv.indexOf(k); return i >= 0 ? argv[i + 1] : undefined; };
  const contract = loadContract();
  let file;
  if (argv.includes('--merge')) {
    const dir = arg('--merge'), out = arg('--out');
    if (!dir || !out) { console.error('usage: --merge <partsDir> --out <file>'); return 64; }
    const art = mergeParts(dir, env);
    mkdirSync(dirname(out), { recursive: true });
    writeFileSync(out, JSON.stringify(art, null, 2));
    console.log(`[a11y-pixel-contrast] wrote ${out}: ${art.rows.length} rows`);
    file = out;
  } else if (argv.includes('--check')) {
    file = arg('--check');
    if (!file) { console.error('usage: --check <file>'); return 64; }
  } else {
    console.error('usage: a11y-pixel-contrast.mjs --merge <partsDir> --out <file> | --check <file>');
    return 64;
  }
  if (!existsSync(file)) { console.error(`[a11y-pixel-contrast] ${file} missing`); return 1; }
  const errors = validateArtifact(JSON.parse(readFileSync(file, 'utf8')), contract);
  for (const e of errors.slice(0, 200)) console.error(`[a11y-pixel-contrast] ${e}`);
  if (errors.length > 200) console.error(`[a11y-pixel-contrast] … ${errors.length - 200} more`);
  console.log(errors.length ? `[a11y-pixel-contrast] FAIL (${errors.length} error(s))` : '[a11y-pixel-contrast] OK');
  return errors.length ? 1 : 0;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  process.exit(main());
}
