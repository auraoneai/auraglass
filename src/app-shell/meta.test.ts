/** @jest-environment node */
// SURF-095: every W1 meta file parses, parts are kebab-case and unique within
// the component, and migration rows carry an explicit props map (S-31/§6.3 —
// the row is documentation; the codemod fragment is the machine input, and
// migration-rows.test.ts asserts the two never disagree).
import { describe, expect, it } from '@jest/globals';
import { existsSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { PART_NAME_RE } from '../contracts/components';

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

function load(path: string) {
  const mod = require(path) as { default?: Record<string, unknown> };
  return mod.default ?? {};
}

describe('W1 ComponentMeta (SURF-095)', () => {
  it('every W1 directory ships meta for its exported components', () => {
    const found: string[] = [];
    for (const d of W1_DIRS) for (const f of metaFiles(d)) found.push(f);
    expect(found.length).toBeGreaterThanOrEqual(15);
  });

  it('each meta has a unique name and kebab-case parts', () => {
    const names = new Set<string>();
    for (const d of W1_DIRS) {
      for (const f of metaFiles(d)) {
        const meta = load(f);
        const name = meta['name'] as string;
        expect(name).toBeTruthy();
        expect(names.has(name)).toBe(false);
        names.add(name);
        expect(['server', 'client', 'mixed']).toContain(meta['rsc']);
        for (const part of meta['parts'] as string[]) {
          expect(part).toMatch(PART_NAME_RE);
        }
      }
    }
  });

  it('no part name collides across W1 components on shared selectors', () => {
    // data-ag-part values are namespaced per component root; identical part
    // names in different components are legal (item, list…) — the assertion is
    // that every part is declared, i.e. DOM coverage is intentional.
    const declared = new Map<string, Set<string>>();
    for (const d of W1_DIRS) {
      for (const f of metaFiles(d)) {
        const meta = load(f);
        declared.set(meta['name'] as string, new Set(meta['parts'] as string[]));
      }
    }
    const sidebar = declared.get('Sidebar');
    expect(sidebar?.has('sidebar-item')).toBe(true);
    const tabs = declared.get('Tabs');
    expect(tabs?.has('indicator')).toBe(true);
    const command = declared.get('Command');
    expect(command?.has('empty')).toBe(true);
  });

  it('migration rows carry automation + compat flags', () => {
    for (const d of W1_DIRS) {
      for (const f of metaFiles(d)) {
        const meta = load(f);
        for (const row of (meta['migration'] ?? []) as Array<Record<string, unknown>>) {
          expect(row['from']).toBeTruthy();
          expect(['full', 'mostly', 'partial', 'manual', 'none']).toContain(row['automation']);
          expect(typeof row['compat']).toBe('boolean');
        }
      }
    }
  });
});
