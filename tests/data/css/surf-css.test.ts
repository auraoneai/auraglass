// SURF-149/253 — REQ-SURF-03 (REQ-FIN-80): every SURF css file under every
// SURF css root is declared in fragments/css/surf.ts, starts with
// LAYER_ORDER_STATEMENT, keeps all of its rules inside exactly one
// `@layer ag.components {}` block, and has no !important / hex / physical
// properties (logical-properties rule) / raw duration or rem literals outside
// var() fallbacks.
import { describe, expect, it } from '@jest/globals';
import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { LAYER_ORDER_STATEMENT } from '../../../src/contracts/tokens';

const ROOT = process.cwd();
const PHYSICAL = /(?<![a-z-])(?:left|right|top|bottom|margin-left|margin-right|margin-top|margin-bottom|padding-left|padding-right|padding-top|padding-bottom|border-left|border-right|border-top|border-bottom|inset-left|inset-right)\s*:/;

function* walk(dir: string): Generator<string> {
  if (!existsSync(dir)) return;
  for (const e of readdirSync(dir)) {
    if (e === 'node_modules') continue;
    const p = join(dir, e);
    if (statSync(p).isDirectory()) yield* walk(p);
    else if (e.endsWith('.css')) yield p;
  }
}

/* Every SURF-owned css root (PRD-F §6 FIN-F row) — W1 (app-shell + the 6
   flagship component sheets), W2 (data/date/charts/timeline), W3 (ai), W4
   (media + backdrops incl. presets). */
const SURF_CSS_ROOTS = [
  'src/app-shell', 'src/data', 'src/date', 'src/charts',
  'src/components/timeline', 'src/components/tabs', 'src/components/tab-bar',
  'src/components/breadcrumbs', 'src/components/pagination',
  'src/components/command-palette', 'src/components/source-transition',
  'src/ai', 'src/media', 'src/backdrops',
];
/* SURF roots that ship no css today; scanned so a css file added there is
   gated the moment it lands. */
const SURF_OTHER_ROOTS = ['src/three', 'src/compat/surf', 'packages/labs'];

const rel = (f: string) => relative(ROOT, f).replace(/\\/g, '/');
const stripComments = (s: string) => s.replace(/\/\*[\s\S]*?\*\//g, '');
/* Remove var(...) spans, innermost first, so nested fallbacks
   (var(--a, var(--b, 1rem))) are stripped completely. */
const stripVars = (s: string) => {
  let prev: string;
  do { prev = s; s = s.replace(/var\([^()]*(?:\([^()]*\)[^()]*)*\)/g, ''); } while (s !== prev);
  return s;
};

const fragSrc = readFileSync(join(ROOT, 'fragments/css/surf.ts'), 'utf8');

describe('SURF css discipline (SURF-149, REQ-SURF-03)', () => {
  const byRoot = new Map<string, string[]>();
  for (const d of [...SURF_CSS_ROOTS, ...SURF_OTHER_ROOTS]) byRoot.set(d, [...walk(join(ROOT, d))].map(rel));
  const files = [...byRoot.values()].flat();

  it('scans every SURF css root (each W1–W4 root contributes files)', () => {
    const empty = SURF_CSS_ROOTS.filter((d) => byRoot.get(d)!.length === 0);
    expect(empty).toEqual([]);
  });
  it('every SURF css file is declared in the fragment (0 orphans)', () => {
    const orphans = files.filter((f) => !fragSrc.includes(`'${f}'`));
    expect(orphans).toEqual([]);
  });
  it('every file starts with LAYER_ORDER_STATEMENT (0 missing layer-order lines)', () => {
    const bad = files.filter((f) => !readFileSync(join(ROOT, f), 'utf8').startsWith(LAYER_ORDER_STATEMENT + '\n'));
    expect(bad).toEqual([]);
  });
  it('no @import and balanced braces (the build concatenates fragment rows)', () => {
    const bad: string[] = [];
    for (const f of files) {
      const src = stripComments(readFileSync(join(ROOT, f), 'utf8')).replace(/(["'])(?:\\.|(?!\1).)*\1/g, '""');
      if (/@import\b/.test(src)) bad.push(`${f}: @import`);
      let depth = 0;
      for (const c of src) {
        if (c === '{') depth++;
        else if (c === '}' && --depth < 0) break;
      }
      if (depth !== 0) bad.push(`${f}: unbalanced braces (${depth})`);
    }
    expect(bad).toEqual([]);
  });
  it('every rule sits inside exactly one @layer ag.components block', () => {
    const bad: string[] = [];
    for (const f of files) {
      const src = stripComments(readFileSync(join(ROOT, f), 'utf8')).slice(LAYER_ORDER_STATEMENT.length);
      const open = src.indexOf('@layer ag.components {');
      const blocks = src.match(/@layer\s+ag\.components\s*\{/g)?.length ?? 0;
      if (blocks !== 1) { bad.push(`${f}: ${blocks} ag.components blocks`); continue; }
      /* Nothing but whitespace before the block, and the block's closing brace
         is the last non-whitespace character of the file. */
      if (src.slice(0, open).trim() !== '') bad.push(`${f}: content before the layer block`);
      let depth = 0;
      let end = -1;
      for (let i = open; i < src.length; i++) {
        if (src[i] === '{') depth++;
        else if (src[i] === '}' && --depth === 0) { end = i; break; }
      }
      if (end < 0 || src.slice(end + 1).trim() !== '') bad.push(`${f}: content after the layer block`);
    }
    expect(bad).toEqual([]);
  });
  it('no non-ag.components layers', () => {
    const bad: string[] = [];
    for (const f of files) {
      const src = stripComments(readFileSync(join(ROOT, f), 'utf8'));
      /* Layer BLOCKS end with '{'; the frozen order statement ends with ';'. */
      for (const m of src.matchAll(/@layer\s+([a-zA-Z0-9_.,\s-]+?)\s*\{/g)) {
        const names = m[1]!.trim();
        if (names !== 'ag.components') bad.push(`${f}: @layer ${names} {`);
      }
      /* Any other layer statement than the frozen one is a stray layer. */
      for (const m of src.matchAll(/@layer\s+[^;{]+;/g)) {
        if (m[0] !== LAYER_ORDER_STATEMENT) bad.push(`${f}: ${m[0]}`);
      }
    }
    expect(bad).toEqual([]);
  });
  it('no !important, no hex literals, no physical properties, no raw duration/rem literals', () => {
    const bad: string[] = [];
    for (const f of files) {
      const src = stripComments(readFileSync(join(ROOT, f), 'utf8'));
      if (/!important/.test(src)) bad.push(`${f}: !important`);
      if (/#[0-9a-fA-F]{3,8}\b/.test(src)) bad.push(`${f}: hex literal`);
      if (PHYSICAL.test(src)) bad.push(`${f}: physical property`);
      /* Raw duration/rem literals must ride a var(--ag-*|--_ag-*) fallback. */
      for (const m of stripVars(src).matchAll(/(?<![\w-])\d*\.?\d+(?:ms|s|rem)\b/g)) bad.push(`${f}: literal ${m[0]}`);
    }
    expect(bad).toEqual([]);
  });
});
