// SURF-149/253 — REQ-SURF-03: every W2 css file is declared in
// fragments/css/surf.ts, starts with LAYER_ORDER_STATEMENT, uses one
// @layer ag.components block, has no !important / hex / physical
// properties (logical-properties rule).
import { describe, expect, it } from '@jest/globals';
import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const ROOT = process.cwd();
const LAYER_ORDER = '@layer ag.compat, ag.reset, ag.tokens, ag.material, ag.components, ag.a11y;';
const PHYSICAL = /(?<![a-z-])(?:left|right|top|bottom|margin-left|margin-right|margin-top|margin-bottom|padding-left|padding-right|padding-top|padding-bottom|border-left|border-right|border-top|border-bottom|inset-left|inset-right)\s*:/;

function* walk(dir: string): Generator<string> {
  if (!existsSync(dir)) return;
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) yield* walk(p);
    else if (e.endsWith('.css')) yield p;
  }
}

/* Every SURF-owned css root — W1 (app-shell + 6 flagship component sheets),
   W2 (data/date/charts/timeline), W3 (ai), W4 (media + backdrops incl.
   presets). */
const SURF_DIRS = [
  'src/app-shell', 'src/data', 'src/date', 'src/charts',
  'src/components/timeline', 'src/components/tabs', 'src/components/tab-bar',
  'src/components/breadcrumbs', 'src/components/pagination',
  'src/components/command-palette', 'src/components/source-transition',
  'src/ai', 'src/media', 'src/backdrops',
];
const fragSrc = readFileSync(join(ROOT, 'fragments/css/surf.ts'), 'utf8');

describe('SURF css discipline (SURF-149, REQ-SURF-03)', () => {
  const files: string[] = [];
  for (const d of SURF_DIRS) for (const f of walk(join(ROOT, d))) files.push(relative(ROOT, f).replace(/\\/g, '/'));

  it('every SURF css file is declared in the fragment (0 orphans)', () => {
    const orphans = files.filter((f) => !fragSrc.includes(`'${f}'`));
    expect(orphans).toEqual([]);
  });
  it('every file starts with LAYER_ORDER_STATEMENT and a components layer', () => {
    const bad = files.filter((f) => {
      const src = readFileSync(join(ROOT, f), 'utf8');
      return !src.startsWith(LAYER_ORDER) || !/@layer ag\.components \{/.test(src);
    });
    expect(bad).toEqual([]);
  });
  it('no non-ag.components layers', () => {
    const bad: string[] = [];
    for (const f of files) {
      const src = readFileSync(join(ROOT, f), 'utf8');
      for (const m of src.matchAll(/@layer\s+([a-zA-Z0-9_.,\s-]+?)\s*\{/g)) {
        const names = m[1]!.trim();
        /* The frozen order statement lists several layer names — it ends
           with ';' not '{'. Anything in a layer BLOCK beyond ag.components
           is an orphan layer. */
        if (names !== 'ag.components') bad.push(`${f}: @layer ${names} {`);
      }
    }
    expect(bad).toEqual([]);
  });
  it('no !important, no hex literals, no physical properties', () => {
    const bad: string[] = [];
    for (const f of files) {
      const src = readFileSync(join(ROOT, f), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
      if (/!important/.test(src)) bad.push(`${f}: !important`);
      if (/#[0-9a-fA-F]{3,8}\b/.test(src)) bad.push(`${f}: hex literal`);
      if (PHYSICAL.test(src)) bad.push(`${f}: physical property`);
      /* Raw duration/radius literals must ride a var(--ag-*) fallback —
         strip var(...) spans first, then flag bare <number>ms|<number>rem. */
      const sansVars = src.replace(/var\([^)]*\)/g, '');
      for (const m of sansVars.matchAll(/[\d.]+(?:ms|rem)\b/g)) bad.push(`${f}: literal ${m[0]}`);
    }
    expect(bad).toEqual([]);
  });
});
