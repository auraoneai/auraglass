// SURF-140 — REQ-SURF-01: ./data and ./date barrels export exactly the
// contract ENTRIES lists; ./charts ships only { Chart } and is absent from
// the 5.0 latest map; the root surf slice carries the nine flagship names.
import { describe, expect, it } from '@jest/globals';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = process.cwd();
const named = (file: string) =>
  [...readFileSync(file, 'utf8').matchAll(/export\s+(?:const|function|class|type|interface)\s+([A-Za-z_$][\w$]*)|export\s*\{([^}]+)\}/g)]
    .flatMap((m) => (m[1] !== undefined ? [m[1]] : (m[2] ?? '').split(',').map((s) => s.trim().split(/\s+as\s+/).pop()!.replace(/\{|\}/g, '').trim())))
    .filter(Boolean)
    .filter((n) => /^[A-Z]/.test(n) && !/^(Props|State|Model|Field|Group|Node|Rule|Item|Series|Context|Adapter|Value|Preset|Messages|Handle|Curve|Type|Density|Mode|Fragment|Cookie)$/.test(n) && !n.endsWith('Props'));

describe('SURF entry value exports (SURF-140)', () => {
  it('./data exports exactly the contract list', () => {
    const file = join(ROOT, 'src/data/index.ts');
    const text = readFileSync(file, 'utf8');
    for (const name of ['Table', 'TreeView', 'FilterBar', 'Chip', 'KeyValueEditor', 'StatCard', 'Sparkline', 'ChartFrame']) {
      expect(text).toMatch(new RegExp(`export\\s+\\{[^}]*\\b${name}\\b`));
    }
    // no other VALUE exports (type exports are not counted)
    const valueNames = [...text.matchAll(/^export\s+(const|function|class|enum)\s+(\w+)/gm)].map((m) => m[2]);
    expect(valueNames.sort()).toEqual([]);
  });
  it('./date exports exactly the contract list', () => {
    const text = readFileSync(join(ROOT, 'src/date/index.ts'), 'utf8');
    for (const name of ['DateField', 'TimeField', 'DatePicker', 'DateRangePicker', 'Calendar', 'TimePicker', 'RangeCalendar']) {
      expect(text).toMatch(new RegExp(`export\\s+\\{[^}]*\\b${name}\\b`));
    }
    const valueNames = [...text.matchAll(/^export\s+(const|function|class|enum)\s+(\w+)/gm)].map((m) => m[2]);
    expect(valueNames).toEqual([]);
  });
  it('root surf barrel exports Timeline + ActivityFeed (W2) and leaves W1 names pending', () => {
    const text = readFileSync(join(ROOT, 'src/root/surf.ts'), 'utf8');
    expect(text).toMatch(/export \{ Timeline/);
    expect(text).toMatch(/export \{ ActivityFeed/);
  });
  it('./charts index exports only { Chart } and nothing else leaks', () => {
    const file = join(ROOT, 'src/charts/index.ts');
    expect(existsSync(file)).toBe(true);
    const text = readFileSync(file, 'utf8');
    const namedExports = [...text.matchAll(/export \{ ([^}]+) \}/g)].flatMap((m) => m[1]!.split(',').map((s) => s.trim()));
    expect(namedExports.filter((n) => /^[A-Z]/.test(n))).toEqual(['Chart']);
  });
});
