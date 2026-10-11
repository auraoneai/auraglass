/** @jest-environment node */
// tests/rsc/surf/data-directives.test.ts — W2 slice of REQ-SURF-07: the data /
// date / charts server list and its client-island exceptions, enforced by
// scanning the sources (the full-suite sibling is directives.test.ts).

import { describe, expect, it } from '@jest/globals';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const ROOT = process.cwd();
const SERVER = [
  'src/data/stat-card/StatCard.tsx',
  'src/data/sparkline/Sparkline.tsx',
  'src/data/chart-frame/ChartFrame.tsx',
  'src/components/timeline/Timeline.tsx',
  'src/components/timeline/ActivityFeed.tsx',
  // REQ-SURF-161: the Chart wrapper, static marks + tooltip are server-safe; ChartPlot is the island.
  'src/charts/Chart.tsx',
  'src/charts/ChartTooltip.tsx',
  'src/charts/marks/Line.tsx',
  'src/charts/marks/Area.tsx',
  'src/charts/marks/Bar.tsx',
  'src/charts/marks/Donut.tsx',
];
const CLIENT = [
  'src/data/chart-frame/ChartFrame.Interactive.tsx',
  'src/data/table/useTableState.ts',
  'src/charts/ChartPlot.tsx',
];

function* walk(dir: string): Generator<string> {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) yield* walk(p);
    else if (/\.tsx$/.test(e)) yield p;
  }
}

describe('data/date directives (REQ-SURF-07)', () => {
  it('server list carries no use client directive', () => {
    for (const f of SERVER) expect(readFileSync(join(ROOT, f), 'utf8')).not.toMatch(/^\s*['"]use client['"]/m);
  });
  it('client islands carry use client', () => {
    for (const f of CLIENT) expect(readFileSync(join(ROOT, f), 'utf8').slice(0, 200)).toMatch(/['"]use client['"]/);
  });
  it('date sources only mark leaves client (provider stays shared)', () => {
    for (const f of walk(join(ROOT, 'src/date'))) {
      const rel = relative(ROOT, f).replace(/\\/g, '/');
      const src = readFileSync(f, 'utf8');
      if (/DateProvider|week-number|shared/.test(rel)) continue;
      if (/use(State|Reducer|Ref|Effect|Memo|Callback)/.test(src))
        expect(src.slice(0, 200)).toMatch(/['"]use client['"]/);
    }
  });
});
