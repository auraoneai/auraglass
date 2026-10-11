/** @jest-environment node */
// SURF-224/228 — REQ-SURF-09: every W2 exported component ships a <Name>.meta.ts;
// parts are kebab-case and unique; migration rows mirror the codemod fragment.
import { describe, expect, it } from '@jest/globals';
import { existsSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { PART_NAME_RE } from '../../src/contracts/components';

const ROOT = join(__dirname, '..', '..');
const W2_DIRS = ['src/data', 'src/date', 'src/components/timeline', 'src/charts'];
const REQUIRED = ['Table', 'TreeView', 'FilterBar', 'Chip', 'KeyValueEditor', 'StatCard', 'Sparkline', 'ChartFrame', 'DateField', 'TimeField', 'DatePicker', 'DateRangePicker', 'Calendar', 'TimePicker', 'Timeline', 'ActivityFeed', 'Chart'];

function* metaFiles(dir: string): Generator<string> {
  const abs = join(ROOT, dir);
  if (!existsSync(abs)) return;
  for (const name of readdirSync(abs)) {
    const p = join(abs, name);
    if (statSync(p).isDirectory()) yield* metaFiles(join(dir, name));
    else if (name.endsWith('.meta.ts')) yield p;
  }
}

const all: Record<string, Record<string, unknown>[]> = {};
for (const d of W2_DIRS) {
  for (const f of metaFiles(d)) {
    const mod = require(f) as Record<string, unknown>;
    for (const [k, v] of Object.entries(mod)) {
      if (v !== null && typeof v === 'object' && typeof (v as Record<string, unknown>)['name'] === 'string') {
        (all[(v as Record<string, unknown>)['name'] as string] ??= []).push(v as Record<string, unknown>);
      }
      void k;
    }
  }
}

describe('W2 meta coverage (SURF-224)', () => {
  it.each(REQUIRED)('%s has a meta', (name) => {
    expect(all[name]?.length).toBeGreaterThanOrEqual(1);
  });
  it('parts are kebab-case and unique per component', () => {
    for (const [name, ms] of Object.entries(all)) {
      for (const m of ms) {
        const parts = (m['parts'] as string[]) ?? [];
        expect(new Set(parts).size).toBe(parts.length);
        for (const p of parts) expect(p).toMatch(PART_NAME_RE);
      }
      void name;
    }
  });
});

const fragment = require('../../fragments/codemods/surf') as {
  default: { props?: Array<{ component: string; from: string; to: unknown; values?: Record<string, string> }> };
};

describe('W2 meta migration rows == codemod fragment rows (SURF-228)', () => {
  it('every codemod prop row for a W2 component has a matching meta migration prop', () => {
    const W2_COMPONENTS = new Set(['Table', 'Table.Column', 'DatePicker', 'DateField', 'TimeField', 'StatCard', 'Sparkline', 'Timeline', 'ActivityFeed', 'FilterBar', 'TreeView', 'Chip', 'KeyValueEditor', 'Calendar']);
    for (const row of fragment.default.props ?? []) {
      if (!W2_COMPONENTS.has(row.component)) continue;
      const base = row.component.split('.')[0]!;
      const meta = (all[row.component] ?? all[base])?.[0];
      if (!meta) throw new Error(`no meta for ${row.component}`);
      const migrations = (meta['migration'] as Array<Record<string, unknown>> | undefined) ?? [];
      const props = migrations.flatMap((m) => Object.entries((m['props'] ?? {}) as Record<string, unknown>));
      // A codemod row with a value map mirrors the contract's { to, values } meta form (S-31).
      const expected = row.values ? { to: row.to, values: row.values } : row.to;
      const hit = props.find(([k, v]) => k === row.from && JSON.stringify(v) === JSON.stringify(expected));
      if (!hit) throw new Error(`${row.component}: meta migration missing '${row.from}' -> ${JSON.stringify(expected)}`);
    }
  });
});
