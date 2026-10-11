// SURF-146 — REQ-SURF-04: no chart.js/react-chartjs-2/date-fns anywhere in
// SURF paths (source, registry, compat).
import { describe, expect, it } from '@jest/globals';
import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const ROOT = process.cwd();
const BAN = /\b(?:chart\.js|react-chartjs-2|date-fns)\b/;
const DIRS = ['src/data', 'src/date', 'src/charts', 'src/components/timeline', 'src/compat/surf', 'registry/blocks', 'registry/items'];

function* walk(dir: string): Generator<string> {
  if (!existsSync(dir)) return;
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) yield* walk(p);
    else if (/\.(ts|tsx)$/.test(e) && !/no-chart-deps/.test(e)) yield p;
  }
}

describe('no chart/date legacy deps (SURF-146)', () => {
  it('rg "chart.js|react-chartjs-2|date-fns" over SURF paths = 0', () => {
    const hits: string[] = [];
    for (const d of DIRS) {
      for (const f of walk(join(ROOT, d))) {
        const src = readFileSync(f, 'utf8');
        for (const m of src.matchAll(/(?:from|import)\s*\(?\s*['"]([^'"]+)['"]/g)) {
          if (BAN.test(m[1]!)) hits.push(`${relative(ROOT, f)}: ${m[1]}`);
        }
      }
    }
    expect(hits).toEqual([]);
  });
});
