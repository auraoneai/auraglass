// SURF-139 — REQ-SURF-04 import boundary scan over SURF sources.
// @tanstack/react-table + @tanstack/react-virtual only src/data/**;
// react-aria-components only src/date/** + src/data/tree-view/**;
// @internationalized/date only src/date/**; @base-ui/react only the §4.4
// allowlist; d3-* only src/charts/**; three only src/three/**; banned deps
// never appear.
import { describe, expect, it } from '@jest/globals';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const ROOT = process.cwd();

function* walk(dir: string): Generator<string> {
  if (!existsSync(dir)) return;
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) yield* walk(p);
    else if (/\.(ts|tsx)$/.test(e) && !/\.(test|spec|stories|meta|d)\./.test(e)) yield p;
  }
}

interface Rule { spec: RegExp; allow: (rel: string) => boolean; why: string }
const RULES: Rule[] = [
  { spec: /^@tanstack\/react-table/, allow: (r) => r.startsWith('src/data/'), why: 'react-table only src/data' },
  { spec: /^@tanstack\/react-virtual/, allow: (r) => r.startsWith('src/data/'), why: 'react-virtual only src/data' },
  { spec: /^react-aria-components/, allow: (r) => r.startsWith('src/date/') || r.startsWith('src/data/tree-view/'), why: 'RAC only src/date + src/data/tree-view' },
  { spec: /^@internationalized\/date/, allow: (r) => r.startsWith('src/date/'), why: '@internationalized/date only src/date' },
  { spec: /^d3-/, allow: (r) => r.startsWith('src/charts/'), why: 'd3-* only src/charts (5.1)' },
  { spec: /^(three|@react-three\/)/, allow: (r) => r.startsWith('src/three/'), why: 'three only src/three' },
  {
    spec: /^@base-ui\/react/, allow: (r) =>
      /^src\/(app-shell|data|ai|media|date)\//.test(r) ||
      /^src\/components\/(tabs|tab-bar|breadcrumbs|pagination|command-palette|source-transition|timeline)\//.test(r),
    why: 'base-ui §4.4 allowlist',
  },
];

const BANNED = /^(chart\.js|react-chartjs-2|date-fns|echarts|recharts|moment|dayjs|luxon)\b/;

const SURF_PREFIX = /^src\/(app-shell|data|date|ai|media|backdrops|charts|three|components\/(tabs|tab-bar|breadcrumbs|pagination|command-palette|source-transition|timeline))\//;

describe('import boundaries (SURF-139, REQ-SURF-04)', () => {
  it('dependency allowlist holds over every SURF source', () => {
    const violations: string[] = [];
    for (const f of walk(join(ROOT, 'src'))) {
      const rel = relative(ROOT, f).replace(/\\/g, '/');
      if (!SURF_PREFIX.test(rel)) continue;
      const src = readFileSync(f, 'utf8');
      for (const m of src.matchAll(/(?:from|import)\s*\(?\s*['"]([^'"]+)['"]/g)) {
        const spec = m[1]!;
        if (BANNED.test(spec)) violations.push(`${rel}: banned dep ${spec}`);
        for (const r of RULES) {
          if (r.spec.test(spec) && !r.allow(rel)) violations.push(`${rel}: ${spec} (${r.why})`);
        }
      }
    }
    expect(violations).toEqual([]);
  });
});
