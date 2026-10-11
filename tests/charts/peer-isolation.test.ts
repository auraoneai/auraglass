// SURF-249 / REQ-SURF-162 — ./charts peer isolation: d3-scale/d3-shape (the
// 5.1 optional peers) may be imported only under src/charts/**; every other
// chart/date runtime stays banned everywhere.
import { describe, expect, it } from '@jest/globals';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

const ROOT = join(__dirname, '..', '..');
function* walk(dir: string): Generator<string> {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) yield* walk(p);
    else if (/\.(ts|tsx)$/.test(p)) yield p;
  }
}

const D3 = ['d3-scale', 'd3-shape'];
const BANNED = ['chart.js', 'react-chartjs-2', 'date-fns', 'echarts', 'recharts', 'visx'];
const matches = (spec: string, names: readonly string[]) =>
  names.some((b) => spec === b || spec.startsWith(`${b}/`) || spec.includes(b));
const rel = (f: string) => relative(ROOT, f).split(sep).join('/');
// consumer-4x cases are frozen 4.x inputs whose banned imports are the
// codemod's target (REQ-SURF-15); this file and no-chart-deps.test.ts name
// the banned specifiers themselves.
const skip = (f: string) => /peer-isolation\.test\.ts$|no-chart-deps\.test\.ts$/.test(f) || rel(f).startsWith('tests/fixtures/consumer-4x/');

function imports(f: string): string[] {
  const src = readFileSync(f, 'utf8');
  return [...src.matchAll(/(?:from|import)\s*\(?\s*['"]([^'"]+)['"]|require\(\s*['"]([^'"]+)['"]\s*\)/g)].map((m) => (m[1] ?? m[2])!);
}

describe('charts peer isolation (SURF-249, REQ-SURF-162)', () => {
  it('d3-scale/d3-shape are imported nowhere outside src/charts/**', () => {
    const hits: string[] = [];
    for (const dir of ['src', 'tests', 'registry']) {
      for (const f of walk(join(ROOT, dir))) {
        if (skip(f) || rel(f).startsWith('src/charts/')) continue;
        for (const spec of imports(f)) if (matches(spec, D3)) hits.push(`${rel(f)}: ${spec}`);
      }
    }
    expect(hits).toEqual([]);
  });

  it('no chart.js/echarts/recharts/visx/date-fns imports anywhere, src/charts included', () => {
    const hits: string[] = [];
    for (const dir of ['src', 'tests', 'registry']) {
      for (const f of walk(join(ROOT, dir))) {
        if (skip(f)) continue;
        for (const spec of imports(f)) if (matches(spec, BANNED)) hits.push(`${rel(f)}: ${spec}`);
      }
    }
    expect(hits).toEqual([]);
  });

  it('src/charts imports d3 only from d3-scale / d3-shape (no other d3 module)', () => {
    const hits: string[] = [];
    for (const f of walk(join(ROOT, 'src', 'charts'))) {
      for (const spec of imports(f)) {
        if (/^d3(-|$)/.test(spec) && !D3.some((d) => spec === d)) hits.push(`${rel(f)}: ${spec}`);
      }
    }
    expect(hits).toEqual([]);
  });

  it('src/charts is self-contained (no src/data import beyond ChartFrame seam)', () => {
    const leaks: string[] = [];
    for (const f of walk(join(ROOT, 'src', 'charts'))) {
      for (const spec of imports(f)) {
        if (spec.startsWith('.')) {
          const r = spec.replace(/^(\.\.\/)+/, '');
          if (spec.startsWith('../') && r.startsWith('data/') && !r.startsWith('data/chart-frame')) leaks.push(`${rel(f)}: ${spec}`);
          if (spec.startsWith('../') && /^(app-shell|date|ai|media|backdrops|three|components)\//.test(r)) leaks.push(`${rel(f)}: ${spec}`);
        }
      }
    }
    expect(leaks).toEqual([]);
  });
});
