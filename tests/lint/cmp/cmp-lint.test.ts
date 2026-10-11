/* @jest-environment node */
/* REQ-CMP-08: the CMP css/tsx surface carries zero raw optics and zero raw
   design values. Runs the MAT literal scanner + the optics patterns over every
   CMP file (scripts/cmp/cmp-file-scope.cjs: src/{components,primitives,icons,
   foundation,forms} minus the SURF dirs, which FIN-F sweeps under SURF-190);
   only files the literals baseline records non-zero may keep counts (test
   fixtures), and never above baseline. The baseline is generator output
   (scripts/cmp/gen-literals-baseline.mjs), never hand-edited. */
import { describe, expect, it } from '@jest/globals';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const { scanText } = require(join(process.cwd(), 'lint/rules/mat/_literals.cjs')) as {
  scanText: (text: string, file?: string) => { category: string; line: number }[];
};

const OPTICS = [
  // only a filter-bearing value is an optic — `backdrop-filter: none` is the
  // forced-colors/solid reset that keeps optics OFF.
  /backdrop-filter\s*:(?!\s*none\b)/i,
  /-webkit-backdrop-filter\s*:(?!\s*none\b)/i,
  /\bblur\(\s*\d/,
  /\bsaturate\(\s*\d/,
];
const COLOR_LITERAL = /#[0-9a-fA-F]{3,8}\b|\b(?:rgb|rgba|hsl|hsla)\(\s*\d|\boklch\((?!\s*from\s*var\()/;
const IMPORTANT = /!important/;

const { listCmpFiles } = require(join(process.cwd(), 'scripts/cmp/cmp-file-scope.cjs')) as {
  listCmpFiles: (root?: string) => string[];
};
const stripComments = (t: string, css: boolean) =>
  t.replace(/\/\*[\s\S]*?\*\/|\/\/[^\n]*/g, (m) => (css && m.startsWith('//') ? m : m.replace(/[^\n]/g, ' ')));

const baseline = JSON.parse(
  readFileSync(join(process.cwd(), 'fragments/literals-baseline/cmp.json'), 'utf8'),
) as { files: Record<string, Record<string, number>> };

const files = listCmpFiles(process.cwd());

describe('cmp-lint (REQ-CMP-08)', () => {
  it('literals baseline covers every CMP file', () => {
    expect(files.length).toBeGreaterThan(0);
    const missing = files.filter((f) => !(f in baseline.files));
    expect(missing).toEqual([]);
  });

  it('literals baseline is exactly the generator output (not stale, not hand-edited)', () => {
    expect(() =>
      execFileSync(process.execPath, ['scripts/cmp/gen-literals-baseline.mjs', '--check'], { stdio: 'pipe' }),
    ).not.toThrow();
  });

  it('no optics outside material: backdrop-filter/blur()/saturate() literals = 0', () => {
    const bad: string[] = [];
    for (const f of files) {
      const text = stripComments(readFileSync(f, 'utf8'), f.endsWith('.css'));
      for (const re of OPTICS) if (re.test(text)) bad.push(`${f}: ${re}`);
    }
    expect(bad).toEqual([]);
  });

  it('no raw design values: literal counts <= baseline (0 for shipped CSS)', () => {
    const over: string[] = [];
    for (const f of files) {
      const hits = scanText(readFileSync(f, 'utf8'), f);
      const byCat: Record<string, number> = {};
      for (const h of hits) byCat[h.category] = (byCat[h.category] ?? 0) + 1;
      for (const [cat, n] of Object.entries(byCat)) {
        const allowed = baseline.files[f]?.[cat] ?? 0;
        if (n > allowed) over.push(`${f}: ${cat} ${allowed} -> ${n}`);
      }
      if (f.endsWith('.css') && Object.keys(byCat).length > 0) {
        over.push(`${f}: shipped CSS has literals ${JSON.stringify(byCat)}`);
      }
    }
    expect(over).toEqual([]);
  });

  it('no transition:all in CMP css', () => {
    const bad: string[] = [];
    for (const f of files.filter((p) => p.endsWith('.css'))) {
      const text = stripComments(readFileSync(f, 'utf8'), true);
      if (/transition(?:-[a-z]+)?\s*:[^;}]*\ball\b/.test(text)) bad.push(f);
    }
    expect(bad).toEqual([]);
  });

  it('will-change appears only behind the transient data-ag-animating flag', () => {
    const bad: string[] = [];
    for (const f of files.filter((p) => p.endsWith('.css'))) {
      const text = readFileSync(f, 'utf8');
      for (const m of text.matchAll(/([^{}]*)\{([^{}]*will-change[^{}]*)\}/g)) {
        const sel = m[1];
        if (!/data-ag-animating|data-vt-animating|data-ending|data-starting/.test(sel)) {
          bad.push(`${f}: ${sel.trim()}`);
        }
      }
    }
    expect(bad).toEqual([]);
  });

  it('no !important and no colour literals in shipped CMP css', () => {
    const bad: string[] = [];
    for (const f of files.filter((p) => p.endsWith('.css'))) {
      const text = stripComments(readFileSync(f, 'utf8'), true);
      if (IMPORTANT.test(text)) bad.push(`${f}: !important`);
      if (COLOR_LITERAL.test(text)) bad.push(`${f}: colour literal`);
    }
    expect(bad).toEqual([]);
  });
});
