/** @jest-environment node */
// REQ-SURF-09 — SURF meta completeness (static half). The rendered-parts
// half — render every story fixture, collect the [data-ag-part] set and
// diff it against meta.parts for every SURF meta — lives in
// meta-coverage.test.tsx. This file gates the fields that need no render:
// every SURF meta declares budgetKb equal to its fragments/size-budgets/
// surf.ts js row (S-44), a material.layer, an APG pattern URL when the
// component is interactive (rsc client/mixed), and kebab-unique parts.
import { describe, expect, it } from '@jest/globals';
import { readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import sizeBudgets from '../../fragments/size-budgets/surf';

const ROOT = join(__dirname, '..', '..');
const PART_RE = /^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/;
const LAYERS = ['chrome', 'overlay', 'transient', 'content'];
const APG_RE = /^https:\/\/www\.w3\.org\/WAI\/ARIA\/apg\/(patterns|practices)\/[a-z-]+\/(examples\/[a-z-]+\/)?$/;

interface MetaLike {
  name: string;
  owner: string;
  rsc?: string;
  parts?: string[];
  budgetKb?: number;
  apg?: string;
  material?: { layer?: string };
}

function walkMetas(dir: string, out: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    if (name === 'node_modules' || name.startsWith('.')) continue;
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walkMetas(p, out);
    else if (name.endsWith('.meta.ts')) out.push(p);
  }
  return out;
}

const SURF_METAS: Array<{ file: string; meta: MetaLike }> = walkMetas(join(ROOT, 'src'))
  .map((file) => {
    const mod = require(file) as { default?: MetaLike };
    return { file: relative(ROOT, file), meta: mod.default as MetaLike };
  })
  .filter((r) => r.meta && r.meta.owner === 'SURF');

const APP_SHELL = SURF_METAS.filter((r) => r.file.startsWith('src/app-shell/'));
const JS_ROWS = new Map(
  (sizeBudgets as ReadonlyArray<{ id: string; limitBytes: number; kind: string }>)
    .filter((row) => row.kind === 'js')
    .map((row) => [row.id, row.limitBytes]),
);

describe('app-shell meta coverage (REQ-SURF-09)', () => {
  it('ships a meta for every app-shell component', () => {
    expect(APP_SHELL.map((r) => r.meta.name).sort()).toEqual(
      ['AppShell', 'Inspector', 'MobileShell', 'ResizablePanels', 'Sidebar', 'SidebarDrawer', 'StatusBar', 'TopBar'].sort(),
    );
  });

  it.each(APP_SHELL.map((r) => [r.meta.name, r] as const))('%s: parts are kebab-case, unique, non-empty', (_name, { meta }) => {
    const parts = meta.parts ?? [];
    expect({ parts }).toEqual({ parts: parts.filter((p) => PART_RE.test(p) && parts.indexOf(p) === parts.lastIndexOf(p)) });
    expect(parts.length).toBeGreaterThan(0);
  });
});

describe('SURF meta completeness (REQ-SURF-09)', () => {
  it('discovers every SURF meta', () => {
    expect(SURF_METAS.length).toBeGreaterThanOrEqual(49);
    const names = SURF_METAS.map((r) => r.meta.name);
    expect(names.filter((n, i) => names.indexOf(n) !== i)).toEqual([]);
  });

  it('every SURF meta declares budgetKb equal to its size-budget row', () => {
    const bad = SURF_METAS.flatMap(({ file, meta }) => {
      if (meta.budgetKb === undefined) return [`${meta.name} (${file}): no budgetKb`];
      const row = JS_ROWS.get(meta.name);
      if (row === undefined) return [`${meta.name} (${file}): budgetKb ${meta.budgetKb} has no js row in fragments/size-budgets/surf.ts`];
      return row === meta.budgetKb * 1024 ? [] : [`${meta.name} (${file}): budgetKb ${meta.budgetKb} != row ${row} B`];
    });
    expect(bad).toEqual([]);
  });

  it('every SURF meta declares a material.layer', () => {
    const bad = SURF_METAS
      .filter(({ meta }) => !meta.material || !LAYERS.includes(meta.material.layer ?? ''))
      .map(({ file, meta }) => `${meta.name} (${file}): material.layer=${JSON.stringify(meta.material?.layer)}`);
    expect(bad).toEqual([]);
  });

  it('every interactive (client/mixed) SURF meta declares an APG pattern URL', () => {
    const bad = SURF_METAS
      .filter(({ meta }) => (meta.rsc === 'client' || meta.rsc === 'mixed') && !APG_RE.test(meta.apg ?? ''))
      .map(({ file, meta }) => `${meta.name} (${file}): rsc=${meta.rsc} apg=${JSON.stringify(meta.apg)}`);
    expect(bad).toEqual([]);
  });

  it('every SURF meta has kebab-case, unique, non-empty parts', () => {
    const bad = SURF_METAS.flatMap(({ file, meta }) => {
      const parts = meta.parts ?? [];
      const issues: string[] = [];
      if (parts.length === 0) issues.push('parts is empty');
      for (const p of parts) if (!PART_RE.test(p)) issues.push(`part ${JSON.stringify(p)} is not kebab-case`);
      for (const p of parts) if (parts.indexOf(p) !== parts.lastIndexOf(p)) issues.push(`part ${p} is duplicated`);
      return issues.map((i) => `${meta.name} (${file}): ${i}`);
    });
    expect(bad).toEqual([]);
  });
});
