/* Contract conformance (QUAL, §6.3 / REQ-QUAL-70): meta.test.ts — seams S-31, S-33, S-44, S-39.
   Every src/**\/*.meta.ts satisfies ComponentMeta; `parts` equals the data-ag-part union rendered
   by the component's stories; `budgetKb` equals the owning stream's size-budget row; every
   MigrationRow.props entry equals the matching CodemodMappingFragment.props row of the same
   stream (contract §4.x "one source per mapping"). */
import * as React from 'react';
import { afterEach, describe, expect, it } from '@jest/globals';
import { act, cleanup, render } from '@testing-library/react';
import { join } from 'node:path';
import { PART_NAME_RE } from '../../src/contracts/components';
import type { CodemodMappingFragment, SizeBudgetRow } from '../../src/contracts/fragments';
import { ENTRIES } from '../../src/contracts/entries';
import { ROOT, conform, discoverMetas, ownerOf, storyCases, storyFiles, type Violation } from './_conformance';
import { checkMetaShape } from './_checks';

const SUITE = 'meta';
const metas = discoverMetas();
const stories = storyFiles();
const STREAM = { CMP: 'cmp', SURF: 'surf', MAT: 'mat' } as const;
const fragment = <T,>(kind: string, owner: string): T => (require(join(ROOT, 'fragments', kind, `${STREAM[owner as keyof typeof STREAM] ?? 'plat'}.ts`)) as { default: T }).default;

/* Story modules load at collection time (storybook/test registers framework hooks on import). */
const storyModules = new Map<string, ReturnType<typeof storyCases> | string>();
for (const { meta } of metas) {
  for (const f of stories.filter((s) => s.split('/').pop() === `${String(meta.name)}.stories.tsx`)) {
    if (storyModules.has(f)) continue;
    try {
      storyModules.set(f, storyCases(f, (c, p) => React.createElement(c as React.ComponentType, p as Record<string, unknown>)));
    } catch (e) {
      storyModules.set(f, (e as Error).message.split('\n')[0]!);
    }
  }
}

afterEach(() => {
  cleanup();
  document.body.innerHTML = '';
});

describe('S-31 ComponentMeta', () => {
  it('discovers every *.meta.ts', () => {
    expect(metas.length).toBeGreaterThan(100);
  });

  it('meta names are unique', () => {
    const seen = new Map<string, string>();
    const v: Violation[] = [];
    for (const { file, meta } of metas) {
      const n = String(meta.name);
      if (seen.has(n)) v.push({ seam: 'S-31', file, detail: `meta name ${n} also declared in ${seen.get(n)}` });
      seen.set(n, file);
    }
    conform(SUITE, 'unique-names', v);
  });

  it('every meta satisfies ComponentMeta and is owned by the stream that owns its file', () => {
    const subpaths = new Set(ENTRIES.map((e) => e.subpath));
    const v: Violation[] = [];
    for (const { file, meta } of metas) {
      v.push(...checkMetaShape(file, meta, { subpaths, partRe: PART_NAME_RE }));
      const owner = ownerOf(file);
      if (meta.owner !== owner) v.push({ seam: 'S-31', file, detail: `${String(meta.name)}: meta.owner ${String(meta.owner)} != file owner ${owner}` });
    }
    conform(SUITE, 'shape', v);
  });

  it("budgetKb equals the owning stream's size-budget row", () => {
    const v: Violation[] = [];
    for (const { file, meta } of metas) {
      if (meta.budgetKb === undefined) continue;
      const rows = fragment<SizeBudgetRow[]>('size-budgets', String(meta.owner));
      const row = rows.find((r) => r.id === meta.name && r.kind === 'js');
      if (!row) v.push({ seam: 'S-44', file, detail: `${String(meta.name)}: budgetKb ${String(meta.budgetKb)} has no js row in fragments/size-budgets/${STREAM[meta.owner as keyof typeof STREAM]}.ts` });
      else if (row.limitBytes !== (meta.budgetKb as number) * 1024) v.push({ seam: 'S-44', file, detail: `${String(meta.name)}: budgetKb ${String(meta.budgetKb)} (= ${(meta.budgetKb as number) * 1024} B) != size-budget row ${row.limitBytes} B` });
    }
    conform(SUITE, 'budget', v);
  });

  it('every MigrationRow.props entry equals the stream codemod fragment props row', () => {
    const v: Violation[] = [];
    for (const { file, meta } of metas) {
      const frag = fragment<CodemodMappingFragment>('codemods', String(meta.owner));
      for (const row of (meta.migration as Array<{ from: string; props?: Record<string, unknown> }>) ?? []) {
        for (const [prop, mapping] of Object.entries(row.props ?? {})) {
          const cm = (frag.props ?? []).find((p) => p.component === row.from && p.from === prop);
          const where = `fragments/codemods/${STREAM[meta.owner as keyof typeof STREAM]}.ts`;
          if (!cm) {
            v.push({ seam: 'S-39', file, detail: `${String(meta.name)}: migration ${row.from}.${prop} has no props row in ${where}` });
            continue;
          }
          const want = mapping === null ? { to: null } : typeof mapping === 'string' ? { to: mapping } : mapping as { to: string; values?: Record<string, string> };
          const same = cm.to === want.to && JSON.stringify(cm.values ?? null) === JSON.stringify(('values' in want ? want.values : undefined) ?? null);
          if (!same) v.push({ seam: 'S-39', file, detail: `${String(meta.name)}: migration ${row.from}.${prop} = ${JSON.stringify(want)} but ${where} has ${JSON.stringify({ to: cm.to, values: cm.values })}` });
        }
      }
    }
    conform(SUITE, 'migration-props', v);
  });
});

describe('S-31 / S-33 parts equal the rendered DOM parts', () => {
  for (const { file, meta } of metas) {
    const name = String(meta.name);
    const files = [...storyModules.keys()].filter((f) => f.split('/').pop() === `${name}.stories.tsx`);
    it(`${name}: union of rendered data-ag-part equals meta.parts`, async () => {
      const v: Violation[] = [];
      const seen = new Set<string>();
      let rendered = 0;
      if (files.length === 0) v.push({ seam: 'S-31', file, detail: `${name}: no ${name}.stories.tsx renders this meta` });
      for (const f of files) {
        const cases = storyModules.get(f)!;
        if (typeof cases === 'string') {
          v.push({ seam: 'S-41', file: f, detail: `story module fails to load: ${cases}` });
          continue;
        }
        for (const c of cases) {
          if (c.element === null) continue; // non-renderable exports are reported by attributes.test.ts
          cleanup();
          document.body.innerHTML = '';
          try {
            render(React.createElement(c.element as React.ComponentType));
            await act(async () => {});
          } catch (e) {
            v.push({ seam: 'S-41', file: f, detail: `story ${c.name} throws on render: ${(e as Error).message.split('\n')[0]}` });
            continue;
          }
          rendered += 1;
          for (const el of Array.from(document.querySelectorAll('[data-ag-part]'))) seen.add(el.getAttribute('data-ag-part')!);
        }
      }
      const parts = (meta.parts as string[]) ?? [];
      if (rendered > 0) {
        const extra = [...seen].filter((p) => !parts.includes(p)).sort();
        const missing = parts.filter((p) => !seen.has(p)).sort();
        if (missing.length) v.push({ seam: 'S-31', file, detail: `${name}: meta.parts not rendered by any story: ${missing.join(', ')}` });
        if (extra.length) v.push({ seam: 'S-33', file, detail: `${name}: stories render parts not in meta.parts: ${extra.join(', ')}` });
      }
      conform(SUITE, 'rendered-parts', v);
    });
  }
});
