/** @jest-environment node */
// SURF-125: contract §6.3 — every MigrationRow.props entry in a W1 meta file
// equals the matching CodemodMappingFragment.props row of the same stream, so
// the docs generator and the codemod can never disagree.
import { describe, expect, it } from '@jest/globals';
import { existsSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = join(__dirname, '..', '..');
const W1_DIRS = ['src/app-shell', 'src/components/tabs', 'src/components/tab-bar', 'src/components/breadcrumbs', 'src/components/pagination', 'src/components/command-palette', 'src/components/source-transition'];

function* metaFiles(dir: string): Generator<string> {
  const abs = join(ROOT, dir);
  if (!existsSync(abs)) return;
  for (const name of readdirSync(abs)) {
    const p = join(abs, name);
    if (statSync(p).isDirectory()) {
      if (dir === 'src/app-shell') yield* metaFiles(join(dir, name));
      continue;
    }
    if (name.endsWith('.meta.ts')) yield p;
  }
}

const fragment = require('../../fragments/codemods/surf') as {
  default: { props?: Array<{ component: string; from: string; to: unknown }> };
};
const rows = fragment.default.props ?? [];

describe('SURF-125 meta migration rows == codemod fragment rows', () => {
  it('every codemod prop row has a matching meta migration prop', () => {
    const metas: Array<Record<string, unknown>> = [];
    for (const d of W1_DIRS) for (const f of metaFiles(d)) metas.push((require(f) as { default: Record<string, unknown> }).default);
    const W1_COMPONENTS = new Set(['AppShell', 'Sidebar', 'TopBar', 'StatusBar', 'MobileShell', 'Inspector', 'ResizablePanels', 'Tabs', 'TabBar', 'Breadcrumbs', 'Pagination', 'CommandPalette', 'Command', 'SourceTransition']);
    for (const row of rows) {
      if (!W1_COMPONENTS.has(row.component)) continue; // other lanes' rows are covered by their own migration-rows tests
      const meta = metas.find((m) => m['name'] === row.component);
      if (!meta) throw new Error(`no meta for ${row.component}`);
      expect(meta).toBeTruthy();
      const mig = (meta['migration'] as Array<Record<string, unknown>> | undefined)?.[0] ?? {};
      const props = (mig['props'] ?? {}) as Record<string, unknown>;
      if (!(row.from in props)) {
        throw new Error(`${row.component}: meta migration props missing '${row.from}'`);
      }
      expect(props[row.from]).toEqual(row.to);
    }
  });

  it('fixtures dir named by the fragment exists', () => {
    const fixtures = (fragment.default as { fixtures?: string[] }).fixtures ?? [];
    for (const f of fixtures) {
      if (!existsSync(join(ROOT, f))) throw new Error(`missing fixtures dir ${f}`);
      expect(existsSync(join(ROOT, f))).toBe(true);
      for (const kase of readdirSync(join(ROOT, f))) {
        const dir = join(ROOT, f, kase);
        if (!statSync(dir).isDirectory()) continue;
        expect(existsSync(join(dir, 'input.tsx'))).toBe(true);
        expect(existsSync(join(dir, 'expected.tsx'))).toBe(true);
      }
    }
  });
});
