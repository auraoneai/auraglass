// SURF-249/162 — ./charts peer isolation: d3-* must not leak outside
// src/charts, and no chart runtime deps exist in src/data/src/date.
import { describe, expect, it } from '@jest/globals';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = join(__dirname, '..', '..');
function* walk(dir: string): Generator<string> {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) yield* walk(p);
    else if (/\.(ts|tsx)$/.test(p)) yield p;
  }
}

const BANNED = ['d3-scale', 'd3-shape', 'chart.js', 'react-chartjs-2', 'date-fns', 'echarts', 'recharts', 'visx'];

describe('charts peer isolation (SURF-249)', () => {
  it('no d3/chart.js/date-fns imports outside src/charts (and none there until the 5.1 peer lands)', () => {
    const hits: string[] = [];
    for (const dir of ['src', 'tests', 'registry']) {
      for (const f of walk(join(ROOT, dir))) {
        if (f.includes('peer-isolation.test.ts') || f.includes('no-chart-deps.test.ts') || f.includes('tests/fixtures/consumer-4x/')) continue; // consumer-4x cases are frozen 4.x inputs whose banned imports are the codemod's target (REQ-SURF-15)
        const src = readFileSync(f, 'utf8');
        for (const m of src.matchAll(/from ['"]([^'"]+)['"]/g)) {
          const spec = m[1]!;
          if (BANNED.some((b) => spec === b || spec.startsWith(`${b}/`) || spec.includes(b))) {
            hits.push(`${f.replace(ROOT + '/', '')}: ${spec}`);
          }
        }
      }
    }
    expect(hits).toEqual([]);
  });

  it('src/charts is self-contained (no src/data import beyond ChartFrame seam)', () => {
    const leaks: string[] = [];
    for (const f of walk(join(ROOT, 'src', 'charts'))) {
      const src = readFileSync(f, 'utf8');
      for (const m of src.matchAll(/from ['"]([^'"]+)['"]/g)) {
        const spec = m[1]!;
        if (spec.startsWith('.') || spec.startsWith('..')) {
          const rel = spec.replace(/^\.\.\//, '');
          if (rel.startsWith('data/') && !rel.startsWith('data/chart-frame')) leaks.push(`${f}: ${spec}`);
          if (/^(app-shell|date|ai|media|backdrops|three|components)\//.test(rel)) leaks.push(`${f}: ${spec}`);
        }
      }
    }
    expect(leaks).toEqual([]);
  });
});
