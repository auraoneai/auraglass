/** @jest-environment node */
// REQ-SURF-95 (SURF-185): the chart palette, computed from BUILT CSS.
//
// Inputs are the shipped bundles, never the source text:
//   - dist/tokens.css   (MAT tokens:build; S-03 --ag-color-* per scheme)
//   - dist/material.css (content-raised fill: the content-layer rule)
//   - dist/data.css     (chart-frame.css as assembled + lowered for dist)
// With AG_BUILT_CSS_DIR set (the L4 lane points it at the packed/built
// dist), those files are read from there. Otherwise this test builds them
// the way the package build does: `scripts/tokens/build.mjs --out <tmp>` for
// tokens.css, and scripts/build/lib/css.mjs (collectCssFragments ->
// assembleBundle -> lowerCss, the functions scripts/build/post.mjs calls)
// for material.css and data.css.
//
// For light and dark it resolves --_ag-chart-1..8 inside .ag-chart-frame
// (light-dark() arm, relative oklch(from var(--ag-color-*) …) channels) and
// the content-raised fill, then asserts:
//   - every colour is inside sRGB (so no gamut mapping changes the numbers)
//   - WCAG contrast >= 3:1 against content-raised for 1..8 (WCAG 1.4.11)
//   - OKLCH chroma >= 0.08 for 1..6
//   - CIEDE2000 >= 15 for every pair of 1..4 after Machado (2009) severity-1
//     protan / deutan / tritan simulation
//   - the @supports-not(light-dark) fallback blocks carry the same arms
// The computed table is written to .artifacts/surf/chart-palette.json.
import { afterAll, beforeAll, describe, expect, it } from '@jest/globals';
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { assembleBundle, collectCssFragments, lowerCss, styleRules } from '../../scripts/build/lib/css.mjs';
import { oklchToSrgb, contrastRatio } from '../../scripts/tokens/color.mjs';
import { simulateCvd, type CvdType } from '../e2e/mat/helpers/machado';
import { deltaE2000, type Lab } from '../e2e/mat/helpers/ciede2000';

const ROOT = join(__dirname, '../..');
type Scheme = 'light' | 'dark';
type Oklch = { l: number; c: number; h: number };
const SCHEMES: Scheme[] = ['light', 'dark'];
const CVD: CvdType[] = ['protan', 'deutan', 'tritan'];

let work = '';
let css: { tokens: string; material: string; data: string; source: string };

beforeAll(async () => {
  const dir = process.env['AG_BUILT_CSS_DIR'];
  if (dir) {
    css = {
      tokens: readFileSync(join(dir, 'tokens.css'), 'utf8'),
      material: readFileSync(join(dir, 'material.css'), 'utf8'),
      data: readFileSync(join(dir, 'data.css'), 'utf8'),
      source: dir,
    };
    return;
  }
  work = mkdtempSync(join(tmpdir(), 'ag-chart-palette-'));
  execFileSync(process.execPath, [join(ROOT, 'scripts/tokens/build.mjs'), '--out', work], { cwd: ROOT, stdio: 'pipe' });
  // validate:false — fragment-rule validation (no !important, self-layered)
  // is the build's own gate (tests/css/fragment-validation.test.ts); a
  // violation in another stream's file must not hide these measurements.
  // Assembly and lowering are unchanged.
  const fragments = await collectCssFragments(ROOT, { validate: false });
  css = {
    tokens: readFileSync(join(work, 'dist/tokens.css'), 'utf8'),
    material: await lowerCss(await assembleBundle('material.css', fragments, ROOT)),
    data: await lowerCss(await assembleBundle('data.css', fragments, ROOT)),
    source: 'tokens:build --out + scripts/build/lib/css.mjs assembleBundle/lowerCss',
  };
}, 120_000);

afterAll(() => { if (work && existsSync(work)) rmSync(work, { recursive: true, force: true }); });

/* ---------- small CSS value evaluator (only what these bundles use) ---------- */

/** Split a function's argument list on top-level commas. */
function splitArgs(s: string): string[] {
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
function callArgs(value: string, name: string): string | null {
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

type Vars = Record<string, string>;

function evalColor(value: string, vars: Vars, scheme: Scheme): Oklch {
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

/** Custom properties declared by rules whose selector is exactly `selector`,
    optionally restricted to rules without (or with) given at-rule headers. */
function declsOf(sheet: string, selector: string, opts: { noHeaders?: RegExp; withHeader?: RegExp } = {}): Vars {
  const out: Vars = {};
  for (const r of styleRules(sheet)) {
    if (selKey(r.selector) !== selKey(selector)) continue;
    if (opts.noHeaders && r.headers.some((h: string) => opts.noHeaders!.test(h))) continue;
    if (opts.withHeader && !r.headers.some((h: string) => opts.withHeader!.test(h))) continue;
    for (const d of splitArgsDecls(r.body)) {
      const i = d.indexOf(':');
      if (i > 0 && d.trim().startsWith('--')) out[d.slice(0, i).trim()] = d.slice(i + 1).trim();
    }
  }
  return out;
}

function splitArgsDecls(body: string): string[] {
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

/* ---------- colour math ---------- */

const inGamut = (o: Oklch) => (oklchToSrgb(o) as number[]).every((x) => x >= -1e-4 && x <= 1 + 1e-4);
const srgb = (o: Oklch) => (oklchToSrgb(o) as number[]).map((x) => Math.min(1, Math.max(0, x))) as [number, number, number];

function lab([r, g, b]: [number, number, number]): Lab {
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

const NO_COND = /^@(supports|media)\b/;
const CONTENT_RULE = '[data-ag-surface][data-ag-layer="content"]:not(:where([data-ag-variant]))';

function tokenVars(): Vars {
  const vars = declsOf(css.tokens, ':root', { noHeaders: NO_COND });
  expect(Object.keys(vars).filter((k) => /^--ag-color-(canvas|accent|info|success|warning|danger)$/.test(k)).sort())
    .toEqual(['--ag-color-accent', '--ag-color-canvas', '--ag-color-danger', '--ag-color-info', '--ag-color-success', '--ag-color-warning']);
  return vars;
}

function contentRaised(scheme: Scheme): Oklch {
  const fill = declsOf(css.material, CONTENT_RULE, { noHeaders: NO_COND })['--_ag-canvas-fill'];
  if (fill === undefined) throw new Error(`content-raised fill (${CONTENT_RULE} --_ag-canvas-fill) not found in material.css`);
  return evalColor(fill, tokenVars(), scheme);
}

function palette(): Vars {
  return declsOf(css.data, '.ag-chart-frame', { noHeaders: NO_COND });
}

interface Row { index: number; oklch: Oklch; inGamut: boolean; contrast: number }
function rows(scheme: Scheme): Row[] {
  const pal = palette();
  const vars = tokenVars();
  const bg = srgb(contentRaised(scheme));
  return [1, 2, 3, 4, 5, 6, 7, 8].map((i) => {
    const decl = pal[`--_ag-chart-${i}`];
    if (decl === undefined) throw new Error(`--_ag-chart-${i} missing from .ag-chart-frame in data.css`);
    const o = evalColor(decl, vars, scheme);
    return { index: i, oklch: o, inGamut: inGamut(o), contrast: contrastRatio(srgb(o), bg) };
  });
}

function cvdPairs(scheme: Scheme) {
  const first4 = rows(scheme).slice(0, 4);
  const out: { type: CvdType; a: number; b: number; deltaE: number }[] = [];
  for (const type of CVD) {
    for (let i = 0; i < 4; i++) for (let j = i + 1; j < 4; j++) {
      const a = simulateCvd(type, ...srgb(first4[i]!.oklch));
      const b = simulateCvd(type, ...srgb(first4[j]!.oklch));
      out.push({ type, a: i + 1, b: j + 1, deltaE: deltaE2000(lab(a), lab(b)) });
    }
  }
  return out;
}

const round = (n: number, d = 3) => Math.round(n * 10 ** d) / 10 ** d;

describe('chart palette from built CSS (REQ-SURF-95)', () => {
  it('declares --_ag-chart-1..8 in .ag-chart-frame from S-03 --ag-color-* only', () => {
    const pal = palette();
    const names = Object.keys(pal).filter((k) => k.startsWith('--_ag-chart-')).sort();
    expect(names).toEqual([1, 2, 3, 4, 5, 6, 7, 8].map((i) => `--_ag-chart-${i}`));
    const sources = new Set<string>();
    for (const n of names) {
      const refs = [...pal[n]!.matchAll(/var\((--[\w-]+)/g)].map((m) => m[1]!);
      // each arm reads exactly one public S-03 colour, never a private or --ag-chart-N name
      expect({ n, refs: refs.filter((r) => !/^--ag-color-(accent|info|success|warning|danger)$/.test(r)) }).toEqual({ n, refs: [] });
      refs.forEach((r) => sources.add(r));
    }
    expect(sources.size).toBeGreaterThanOrEqual(5);
  });

  it.each(SCHEMES)('%s: every colour is inside sRGB and >= 3:1 against content-raised', (scheme) => {
    const r = rows(scheme);
    expect(r.filter((x) => !x.inGamut).map((x) => x.index)).toEqual([]);
    expect(r.filter((x) => x.contrast < 3).map((x) => ({ index: x.index, contrast: round(x.contrast, 2) }))).toEqual([]);
  });

  it.each(SCHEMES)('%s: OKLCH chroma >= 0.08 for indices 1..6', (scheme) => {
    const r = rows(scheme).slice(0, 6);
    expect(r.filter((x) => x.oklch.c < 0.08).map((x) => ({ index: x.index, c: round(x.oklch.c) }))).toEqual([]);
  });

  it.each(SCHEMES)('%s: CIEDE2000 >= 15 between indices 1..4 under protan, deutan and tritan simulation', (scheme) => {
    const pairs = cvdPairs(scheme);
    expect(pairs).toHaveLength(18);
    expect(pairs.filter((p) => p.deltaE < 15).map((p) => ({ ...p, deltaE: round(p.deltaE, 1) }))).toEqual([]);
  });

  it('the no-light-dark() fallback blocks carry the same light and dark arms', () => {
    const main = palette();
    const SUP = /^@supports not \(color: ?light-dark\(/;
    const light = declsOf(css.data, '.ag-chart-frame', { withHeader: SUP });
    const dark = declsOf(css.data, '[data-ag-scheme=dark] .ag-chart-frame', { withHeader: SUP });
    const darkMedia = declsOf(css.data, ':root:not([data-ag-scheme]) .ag-chart-frame', { withHeader: /^@media ?\(prefers-color-scheme: ?dark\)/ });
    const norm = (s: string | undefined) => (s ?? '').replace(/\s+/g, ' ').trim();
    for (let i = 1; i <= 8; i++) {
      const k = `--_ag-chart-${i}`;
      const [l, d] = splitArgs(callArgs(main[k]!, 'light-dark')!);
      expect({ k, light: norm(light[k]), dark: norm(dark[k]), media: norm(darkMedia[k]) })
        .toEqual({ k, light: norm(l), dark: norm(d), media: norm(d) });
    }
  });

  it('writes the computed table (tool output, never hand-authored)', () => {
    const table = Object.fromEntries(SCHEMES.map((s) => [s, {
      contentRaised: contentRaised(s),
      colours: rows(s).map((r) => ({ ...r, oklch: { l: round(r.oklch.l), c: round(r.oklch.c), h: round(r.oklch.h, 1) }, contrast: round(r.contrast, 2) })),
      cvd: cvdPairs(s).map((p) => ({ ...p, deltaE: round(p.deltaE, 2) })),
    }]));
    const dir = join(ROOT, '.artifacts/surf');
    mkdirSync(dir, { recursive: true });
    writeFileSync(join(dir, 'chart-palette.json'), JSON.stringify({ source: css.source, ...table }, null, 2) + '\n');
    expect(Object.keys(table)).toEqual(SCHEMES);
  });
});
