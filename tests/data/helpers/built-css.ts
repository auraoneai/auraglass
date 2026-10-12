// Shared machinery for the SURF colour checks computed from BUILT CSS
// (REQ-SURF-90 stat-card delta, REQ-SURF-91 sparkline intents, REQ-SURF-95
// chart palette).
//
// Inputs are the shipped bundles, never the source text:
//   - dist/tokens.css   (MAT tokens:build; S-03 --ag-color-* per scheme)
//   - dist/material.css (content-raised fill: the content-layer rule)
//   - dist/data.css     (the SURF data sheets as assembled + lowered for dist)
// With AG_BUILT_CSS_DIR set they are read from that built dist/; with
// AURAGLASS_TARBALL set (the L4 lane row) they are extracted from the packed
// tarball's package/dist/. Otherwise they are built the way the
// package build does: `scripts/tokens/build.mjs --out <tmp>` for tokens.css,
// and scripts/build/lib/css.mjs (collectCssFragments -> assembleBundle ->
// lowerCss, the functions scripts/build/post.mjs calls) for material.css and
// data.css.
import { expect } from '@jest/globals';
import { execFileSync } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { assembleBundle, collectCssFragments, lowerCss, styleRules } from '../../../scripts/build/lib/css.mjs';
import { oklchToSrgb, contrastRatio } from '../../../scripts/tokens/color.mjs';
import type { Lab } from '../../e2e/mat/helpers/ciede2000';

export { contrastRatio };

export const ROOT = join(__dirname, '../../..');
export type Scheme = 'light' | 'dark';
export type Oklch = { l: number; c: number; h: number };
export const SCHEMES: Scheme[] = ['light', 'dark'];

export interface BuiltCss { tokens: string; material: string; data: string; source: string; cleanup: () => void }

const BUNDLES = ['tokens.css', 'material.css', 'data.css'] as const;

function readDir(dir: string, source: string, cleanup: () => void): BuiltCss {
  const [tokens, material, data] = BUNDLES.map((f) => readFileSync(join(dir, f), 'utf8'));
  return { tokens: tokens!, material: material!, data: data!, source, cleanup };
}

/** The shipped dist/ bundles inside a packed tarball (`package/dist/<file>`). */
function fromTarball(tgz: string, prefix: string): BuiltCss {
  if (!existsSync(tgz)) throw new Error(`AURAGLASS_TARBALL=${tgz} does not exist`);
  const work = mkdtempSync(join(tmpdir(), prefix));
  const cleanup = () => { if (existsSync(work)) rmSync(work, { recursive: true, force: true }); };
  try {
    execFileSync('tar', ['-xzf', tgz, '-C', work, ...BUNDLES.map((f) => `package/dist/${f}`)], { stdio: 'pipe' });
    return readDir(join(work, 'package/dist'), tgz, cleanup);
  } catch (e) {
    cleanup();
    throw new Error(`could not read ${BUNDLES.join(', ')} from package/dist in ${tgz}: ${(e as Error).message}`);
  }
}

/** Read or build tokens.css, material.css and data.css:
    AG_BUILT_CSS_DIR (a built dist/) → the L4 lane's packed tarball
    (AURAGLASS_TARBALL, set by certification/run.mjs for L2/L3/L4 rows; the
    L4 lane fails closed without it so it never certifies a local rebuild) →
    a local build. */
export async function loadBuiltCss(prefix: string): Promise<BuiltCss> {
  const dir = process.env['AG_BUILT_CSS_DIR'];
  if (dir) return readDir(dir, dir, () => {});
  const tgz = process.env['AURAGLASS_TARBALL']?.trim();
  if (tgz) return fromTarball(tgz, prefix);
  if (process.env['AG_LANE'] === 'L4') {
    throw new Error('L4 checks the shipped CSS: AURAGLASS_TARBALL (plat:package:pack) or AG_BUILT_CSS_DIR must be set');
  }
  const work = mkdtempSync(join(tmpdir(), prefix));
  execFileSync(process.execPath, [join(ROOT, 'scripts/tokens/build.mjs'), '--out', work], { cwd: ROOT, stdio: 'pipe' });
  // validate:false — fragment-rule validation (no !important, self-layered)
  // is the build's own gate (tests/css/fragment-validation.test.ts); a
  // violation in another stream's file must not hide these measurements.
  // Assembly and lowering are unchanged.
  const fragments = await collectCssFragments(ROOT, { validate: false });
  return {
    tokens: readFileSync(join(work, 'dist/tokens.css'), 'utf8'),
    material: await lowerCss(await assembleBundle('material.css', fragments, ROOT)),
    data: await lowerCss(await assembleBundle('data.css', fragments, ROOT)),
    source: 'tokens:build --out + scripts/build/lib/css.mjs assembleBundle/lowerCss',
    cleanup: () => { if (existsSync(work)) rmSync(work, { recursive: true, force: true }); },
  };
}

/* ---------- small CSS value evaluator (only what these bundles use) ---------- */

/** Split a function's argument list on top-level commas. */
export function splitArgs(s: string): string[] {
  const out: string[] = [];
  let depth = 0, buf = '';
  for (const ch of s) {
    if (ch === '(') depth++;
    if (ch === ')') depth--;
    if (ch === ',' && depth === 0) { out.push(buf.trim()); buf = ''; continue; }
    buf += ch;
  }
  if (buf.trim()) out.push(buf.trim());
  return out;
}

/** `name(args)` → args, when the whole value is that one call. */
export function callArgs(value: string, name: string): string | null {
  const v = value.trim();
  if (!v.startsWith(`${name}(`) || !v.endsWith(')')) return null;
  let depth = 0;
  for (let i = name.length; i < v.length; i++) {
    if (v[i] === '(') depth++;
    if (v[i] === ')') { depth--; if (depth === 0 && i !== v.length - 1) return null; }
  }
  return v.slice(name.length + 1, -1);
}

/** Space-separated tokens with parenthesised groups kept whole. */
function tokens(s: string): string[] {
  const out: string[] = [];
  let depth = 0, buf = '';
  for (const ch of s.trim()) {
    if (ch === '(') depth++;
    if (ch === ')') depth--;
    if (/\s/.test(ch) && depth === 0) { if (buf) out.push(buf); buf = ''; continue; }
    buf += ch;
  }
  if (buf) out.push(buf);
  return out;
}

const num = (t: string): number => {
  const n = t.endsWith('%') ? Number(t.slice(0, -1)) / 100 : Number(t.replace(/deg$/, ''));
  if (!Number.isFinite(n)) throw new Error(`not a number: ${t}`);
  return n;
};

/** One relative-colour channel: a number, the channel keyword, or calc(<kw> ± n). */
function channel(t: string, base: Oklch): number {
  const kw = (k: string) => (k === 'l' ? base.l : k === 'c' ? base.c : k === 'h' ? base.h : num(k));
  const inner = callArgs(t, 'calc');
  if (inner === null) return kw(t);
  const m = /^\s*([lch]|[-\d.]+)\s*([+-])\s*([-\d.]+)\s*$/.exec(inner);
  if (!m) throw new Error(`unsupported calc(): ${t}`);
  const a = kw(m[1]!), b = num(m[3]!);
  return m[2] === '+' ? a + b : a - b;
}

export type Vars = Record<string, string>;

export function evalColor(value: string, vars: Vars, scheme: Scheme): Oklch {
  const v = value.trim();
  const ld = callArgs(v, 'light-dark');
  if (ld !== null) {
    const [light, dark] = splitArgs(ld);
    return evalColor(scheme === 'light' ? light! : dark!, vars, scheme);
  }
  const ref = callArgs(v, 'var');
  if (ref !== null) {
    const [name, fallback] = splitArgs(ref);
    const resolved = vars[name!] ?? fallback;
    if (resolved === undefined) throw new Error(`unresolved ${name}`);
    return evalColor(resolved, vars, scheme);
  }
  const ok = callArgs(v, 'oklch');
  if (ok !== null) {
    const parts = tokens(ok.split('/')[0]!);
    if (parts[0] === 'from') {
      const base = evalColor(parts[1]!, vars, scheme);
      const [l, c, h] = parts.slice(2).map((t) => channel(t, base));
      return { l: Math.min(1, Math.max(0, l!)), c: Math.max(0, c!), h: ((h! % 360) + 360) % 360 };
    }
    const [l, c, h] = parts.map(num);
    return { l: l!, c: c!, h: h! };
  }
  throw new Error(`unsupported colour value: ${v}`);
}

/** Selector identity independent of minification (quotes, whitespace). */
const selKey = (s: string) => s.replace(/['"\s]/g, '');

function splitDecls(body: string): string[] {
  const out: string[] = [];
  let depth = 0, buf = '';
  for (const ch of body) {
    if (ch === '(') depth++;
    if (ch === ')') depth--;
    if (ch === ';' && depth === 0) { out.push(buf); buf = ''; continue; }
    if (ch === '{' || ch === '}') { buf = ''; continue; }
    buf += ch;
  }
  if (buf.trim()) out.push(buf);
  return out;
}

/** Declarations (custom properties by default, or every property with
    `all: true`) of rules whose selector is exactly `selector`, optionally
    restricted to rules without (or with) given at-rule headers. */
export function declsOf(sheet: string, selector: string, opts: { noHeaders?: RegExp; withHeader?: RegExp; all?: boolean } = {}): Vars {
  const out: Vars = {};
  for (const r of styleRules(sheet)) {
    if (selKey(r.selector) !== selKey(selector)) continue;
    if (opts.noHeaders && r.headers.some((h: string) => opts.noHeaders!.test(h))) continue;
    if (opts.withHeader && !r.headers.some((h: string) => opts.withHeader!.test(h))) continue;
    for (const d of splitDecls(r.body)) {
      const i = d.indexOf(':');
      if (i > 0 && (opts.all || d.trim().startsWith('--'))) out[d.slice(0, i).trim()] = d.slice(i + 1).trim();
    }
  }
  return out;
}

/* ---------- colour math ---------- */

export const inGamut = (o: Oklch) => (oklchToSrgb(o) as number[]).every((x) => x >= -1e-4 && x <= 1 + 1e-4);
export const srgb = (o: Oklch) => (oklchToSrgb(o) as number[]).map((x) => Math.min(1, Math.max(0, x))) as [number, number, number];

export function lab([r, g, b]: [number, number, number]): Lab {
  const lin = (v: number) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
  const [lr, lg, lb] = [lin(r), lin(g), lin(b)];
  const x = 0.4124564 * lr + 0.3575761 * lg + 0.1804375 * lb;
  const y = 0.2126729 * lr + 0.7151522 * lg + 0.072175 * lb;
  const z = 0.0193339 * lr + 0.119192 * lg + 0.9503041 * lb;
  const f = (t: number) => (t > 216 / 24389 ? Math.cbrt(t) : ((24389 / 27) * t + 16) / 116);
  const fx = f(x / 0.95047), fy = f(y / 1), fz = f(z / 1.08883);
  return { L: 116 * fy - 16, a: 500 * (fx - fy), b: 200 * (fy - fz) };
}

/* ---------- resolution against the built bundles ---------- */

export const NO_COND = /^@(supports|media)\b/;
export const SUPPORTS_NO_LIGHT_DARK = /^@supports not \(color: ?light-dark\(/;
export const MEDIA_DARK = /^@media ?\(prefers-color-scheme: ?dark\)/;
const CONTENT_RULE = '[data-ag-surface][data-ag-layer="content"]:not(:where([data-ag-variant]))';

export function tokenVars(css: BuiltCss): Vars {
  const vars = declsOf(css.tokens, ':root', { noHeaders: NO_COND });
  expect(Object.keys(vars).filter((k) => /^--ag-color-(canvas|accent|info|success|warning|danger)$/.test(k)).sort())
    .toEqual(['--ag-color-accent', '--ag-color-canvas', '--ag-color-danger', '--ag-color-info', '--ag-color-success', '--ag-color-warning']);
  return vars;
}

export function contentRaised(css: BuiltCss, scheme: Scheme): Oklch {
  const fill = declsOf(css.material, CONTENT_RULE, { noHeaders: NO_COND })['--_ag-canvas-fill'];
  if (fill === undefined) throw new Error(`content-raised fill (${CONTENT_RULE} --_ag-canvas-fill) not found in material.css`);
  return evalColor(fill, tokenVars(css), scheme);
}

export const round = (n: number, d = 3) => Math.round(n * 10 ** d) / 10 ** d;
