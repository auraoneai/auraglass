/* @jest-environment node */
/* REQ-QUAL-71 (REQ-FIN-104, FIN-442): flagship deliverables check (G-04) — packages/qa/src/deliverables/check.ts. */
import { describe, expect, it } from '@jest/globals';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import {
  FLAGSHIP_COUNT, ITEM_IDS, L7_ENGINES, baselineFrom, collectInputs, evaluate, findOffenders, rangeOwner,
  readBaseline, readImportedNames, readMetaSource, readSizeBudgetSource,
} from '../src/deliverables/check.ts';
import type { Inputs, MetaRecord } from '../src/deliverables/check.ts';

const ROOT = resolve(__dirname, '..', '..', '..');

function meta(n: number, name: string, extra: Partial<MetaRecord> = {}): MetaRecord {
  return {
    file: `src/x/${name}.meta.ts`, name, owner: rangeOwner(n), tier: 'T1', flagship: n,
    parts: ['root', 'label'], migration: [{ from: `Glass${name}`, selectors: { [`.glass-${name}`]: '[data-ag-part="root"]' } }],
    topLevelSelectors: 0, literal: true, ...extra,
  };
}

/** A complete synthetic input set: every flagship has every deliverable. */
function complete(): Inputs {
  const metas = Array.from({ length: FLAGSHIP_COUNT }, (_, i) => meta(i + 1, `F${i + 1}`));
  const inputs: Inputs = {
    metas,
    sizeBudgetIds: new Set(metas.map((m) => m.name)),
    registryImports: new Map(metas.map((m) => [m.name, [`registry/blocks/b/${m.name}.tsx`]])),
    apgSpecs: { cmp: [], surf: [], mat: [] },
    codemodFixtures: { cmp: [], surf: [], mat: [] },
    baselinePngs: new Map(),
    perfReport: { subjects: [] },
    renderedParts: { subjects: {} },
  };
  for (const m of metas) {
    const dir = m.owner.toLowerCase();
    (inputs.apgSpecs[dir] as Array<{ file: string; content: string }>).push({ file: `tests/a11y/apg/${dir}/${m.name.toLowerCase()}.apg.spec.ts`, content: '' });
    (inputs.codemodFixtures[dir] as Array<{ file: string; content: string }>).push({ file: `fragments/codemods/${dir}/fixtures/x/${m.name}/input.tsx`, content: `import { Glass${m.name} } from 'aura-glass';` });
    for (const e of L7_ENGINES) inputs.baselinePngs.set(`${e}/${m.name}`, 10);
    inputs.perfReport!.subjects.push({ subject: m.name, profile: 'desktop-120hz', grade: 'B' }, { subject: m.name, profile: 'mid-mobile', grade: 'C' });
    (inputs.renderedParts!.subjects as Record<string, string[]>)[m.name] = ['label', 'root'];
  }
  return inputs;
}

describe('rangeOwner (contract §1: CMP 1–13, 15–21; SURF 14, 22–44)', () => {
  it('splits the 44 numbers', () => {
    expect([1, 13, 15, 21].map(rangeOwner)).toEqual(['CMP', 'CMP', 'CMP', 'CMP']);
    expect([14, 22, 44].map(rangeOwner)).toEqual(['SURF', 'SURF', 'SURF']);
  });
});

describe('static readers', () => {
  it('reads default defineMeta, const + export default, and exported meta-shaped consts', () => {
    const a = readMetaSource(`import { defineMeta } from '../f';
      export default defineMeta({ name: 'A', owner: 'CMP', tier: 'T1', flagship: 1, parts: ['root'], migration: [{ from: 'GlassA', selectors: { '.g': '[data-ag-part="root"]' }, automation: 'full', compat: true }] });
      export const B_META = { name: 'B', owner: 'CMP', tier: 'T2', flagship: 1, parts: ['root'], migration: [] };`, 'src/a/A.meta.ts');
    expect(a.map((m) => [m.name, m.flagship, m.tier, m.literal])).toEqual([['A', 1, 'T1', true], ['B', 1, 'T2', true]]);
    expect(a[0]!.migration).toEqual([{ from: 'GlassA', selectors: { '.g': '[data-ag-part="root"]' } }]);
    const c = readMetaSource(`const meta: M = defineMeta({ name: 'C', owner: 'SURF', flagship: 30, parts: PARTS, migration: [] }); export default meta;`, 'src/c/C.meta.ts');
    expect(c.map((m) => [m.name, m.flagship, m.literal])).toEqual([['C', 30, false]]);
  });
  it('reads size-budget rows through const spreads, and refuses a non-static fragment', () => {
    const rows = readSizeBudgetSource(`const w1 = [{ id: 'X', import: "{ X } from 'aura-glass'", limitBytes: 1, kind: 'js' }] as const;
      const w2 = [] as const;
      export default [...w1, ...w2] satisfies readonly SizeBudgetRow[];`, 'fragments/size-budgets/surf.ts');
    expect(rows).toEqual([{ id: 'X', import: "{ X } from 'aura-glass'" }]);
    expect(() => readSizeBudgetSource('export default rows();', 'fragments/size-budgets/x.ts')).toThrow(/not a static array literal/);
  });
  it('lists value imports of a registry source (not type-only, not the block\'s own files)', () => {
    expect(readImportedNames(`import { Dialog, type DialogProps } from 'aura-glass';
      import type { Row } from 'aura-glass/data';
      import { fixtures } from './fixtures';
      import { Table as T } from '../../../src/data';`, 'registry/blocks/x/index.tsx')).toEqual(['Dialog', 'Table']);
  });
});

describe('evaluate', () => {
  it('a complete input set reports exactly 44 flagships, every item pass', () => {
    const r = evaluate(complete(), { phase: 'rc' });
    expect(r.flagshipCount).toBe(44);
    expect(r.flagships.map((f) => f.flagship)).toEqual(Array.from({ length: 44 }, (_, i) => i + 1));
    for (const f of r.flagships) {
      expect(Object.keys(f.items).sort()).toEqual([...ITEM_IDS].sort());
      expect(f.status).toBe('pass');
    }
    expect(r.offenders).toEqual([]);
    expect(r.ok).toBe(true);
  });

  const removals: Array<[string, (i: Inputs) => void, string]> = [
    ['parts', (i) => { delete (i.renderedParts!.subjects as Record<string, string[]>).F1; }, 'parts'],
    ['parts mismatch', (i) => { (i.renderedParts!.subjects as Record<string, string[]>).F1 = ['root']; }, 'parts'],
    ['selectors', (i) => { i.metas[0] = { ...i.metas[0]!, migration: [{ from: 'GlassF1' }] }; }, 'selectors'],
    ['registry', (i) => { i.registryImports.delete('F1'); }, 'registry'],
    ['apg', (i) => { i.apgSpecs.cmp = i.apgSpecs.cmp!.filter((s) => !s.file.endsWith('/f1.apg.spec.ts')); }, 'apg'],
    ['size-budget', (i) => { i.sizeBudgetIds.delete('F1'); }, 'size-budget'],
    ['perf-grade missing', (i) => { i.perfReport!.subjects = i.perfReport!.subjects.filter((s) => s.subject !== 'F1'); }, 'perf-grade'],
    ['perf-grade below C', (i) => { i.perfReport!.subjects.push({ subject: 'F1', profile: 'mid-mobile', grade: 'D' }); }, 'perf-grade'],
    ['l7-baselines', (i) => { i.baselinePngs.delete('webkit/F1'); }, 'l7-baselines'],
    ['codemod-fixture', (i) => { i.codemodFixtures.cmp = i.codemodFixtures.cmp!.filter((x) => !x.content.includes('GlassF1 ')); }, 'codemod-fixture'],
  ];
  it.each(removals)('missing %s: pending before RC-1, fail at RC-1', (_label, mutate, item) => {
    const pre = complete(); mutate(pre);
    const a = evaluate(pre, { phase: 'pre-rc' });
    expect(a.flagships[0]!.items[item as (typeof ITEM_IDS)[number]].status).toBe('pending');
    expect(a.flagships[0]!.status).toBe('pending');
    expect(a.flagships.slice(1).every((f) => f.status === 'pass')).toBe(true);
    expect(a.ok).toBe(true);
    const rc = complete(); mutate(rc);
    const b = evaluate(rc, { phase: 'rc' });
    expect(b.flagships[0]!.items[item as (typeof ITEM_IDS)[number]].status).toBe('fail');
    expect(b.ok).toBe(false);
  });

  it('an absent artifact (perf-report.json, rendered-parts.json) is pending for every flagship, never pass', () => {
    const i = complete(); i.perfReport = null; i.renderedParts = null;
    const pre = evaluate(i, { phase: 'pre-rc' });
    expect(pre.flagships.map((f) => [f.items['perf-grade'].status, f.items.parts.status])).toEqual(Array(44).fill(['pending', 'pending']));
    expect(pre.flagships[0]!.items['perf-grade'].detail).toMatch(/perf-report\.json not present/);
    expect(evaluate(i, { phase: 'rc' }).flagships.every((f) => f.status === 'fail')).toBe(true);
  });

  it('an invalid part name fails in every phase', () => {
    const i = complete(); i.metas[0] = { ...i.metas[0]!, parts: ['root', 'Bad_Part'] };
    expect(evaluate(i, { phase: 'pre-rc' }).flagships[0]!.items.parts.status).toBe('fail');
  });

  it('top-level selectors are reported, never accepted for migration[].selectors', () => {
    const i = complete(); i.metas[0] = { ...i.metas[0]!, migration: [{ from: 'GlassF1' }], topLevelSelectors: 1 };
    const item = evaluate(i, { phase: 'rc' }).flagships[0]!.items.selectors;
    expect(item.status).toBe('fail');
    expect(item.detail).toMatch(/top-level `selectors`/);
  });

  it('composite flagships: T1 members carry the per-member items, registry needs any member', () => {
    const i = complete();
    i.metas.push(meta(14, 'F14b', { tier: 'T2' })); // a T2 member with no deliverables at all
    i.registryImports.delete('F14');
    i.registryImports.set('F14b', ['registry/items/x/index.tsx']);
    const f = evaluate(i, { phase: 'rc' }).flagships[13]!;
    expect(f.subjects).toEqual(['F14', 'F14b']);
    expect(f.status).toBe('pass');
  });

  it('structural offenders fail unless baselined; baselined ones are pending until RC-1', () => {
    const i = complete();
    i.metas = i.metas.filter((m) => m.flagship !== 18);
    i.metas[20] = { ...i.metas[20]!, owner: 'CMP' }; // flagship 22 claimed by CMP
    i.metas.push(meta(45, 'Extra'));
    const offenders = findOffenders(i.metas);
    expect(offenders.map((o) => [o.kind, o.flagship, o.owner])).toEqual([['missing', 18, 'CMP'], ['owner-range', 22, 'CMP'], ['out-of-range', 45, 'SURF']]);

    const plain = evaluate(i, { phase: 'pre-rc' });
    expect(plain.flagships[17]!.items.meta.status).toBe('fail');
    expect(plain.flagships[21]!.items.meta.status).toBe('fail');
    expect(plain.ok).toBe(false);

    const baseline = baselineFrom(i.metas);
    expect(baseline.rows.every((r) => r.expires === 'RC-1')).toBe(true);
    const pre = evaluate(i, { phase: 'pre-rc', baseline });
    expect(pre.offenders.every((o) => o.baselined && o.status === 'pending')).toBe(true);
    expect(pre.flagships[17]!.items.meta.status).toBe('pending');
    expect(pre.ok).toBe(true);
    expect(evaluate(i, { phase: 'rc', baseline }).ok).toBe(false);

    // a new offender is not covered by the old baseline
    i.metas = i.metas.filter((m) => m.flagship !== 5);
    const later = evaluate(i, { phase: 'pre-rc', baseline });
    expect(later.offenders.find((o) => o.flagship === 5)).toMatchObject({ baselined: false, status: 'fail' });
    expect(later.ok).toBe(false);
  });

  it('reports baseline rows whose offender was fixed as stale', () => {
    const i = complete();
    const r = evaluate(i, { phase: 'pre-rc', baseline: { version: 1, gate: 'REQ-QUAL-71', rows: [{ kind: 'missing', flagship: 18, owner: 'CMP', metas: [], expires: 'RC-1' }] } });
    expect(r.staleBaselineRows).toHaveLength(1);
    expect(r.ok).toBe(true);
  });
});

describe('the repository', () => {
  const inputs = collectInputs(ROOT);
  const baseline = readBaseline(ROOT);
  it('reports exactly 44 flagships with a status for every item', () => {
    const r = evaluate(inputs, { phase: 'pre-rc', baseline });
    expect(r.flagshipCount).toBe(44);
    for (const f of r.flagships) {
      expect(f.owner).toBe(rangeOwner(f.flagship));
      for (const id of ITEM_IDS) {
        expect(['pass', 'pending', 'fail']).toContain(f.items[id].status);
        expect(f.items[id].detail.length).toBeGreaterThan(0);
      }
    }
    expect(Object.keys(r.byOwner).sort()).toEqual(['CMP', 'SURF']);
  });
  it('every current offender is in the tool-written baseline, which expires at RC-1', () => {
    expect(baseline).not.toBeNull();
    expect(baseline!.rows.length).toBeGreaterThan(0);
    expect(baseline!.rows.every((row) => row.expires === 'RC-1')).toBe(true);
    const r = evaluate(inputs, { phase: 'pre-rc', baseline });
    expect(r.offenders.filter((o) => !o.baselined)).toEqual([]);
    expect(r.ok).toBe(true);
  });
  it('fails at RC-1 while any deliverable is missing', () => {
    expect(evaluate(inputs, { phase: 'rc', baseline }).ok).toBe(false);
  });
});

describe('CLI scripts/qual/deliverables/check.ts', () => {
  const cli = join(ROOT, 'scripts', 'qual', 'deliverables', 'check.ts');
  const node = (args: string[]) => spawnSync(process.execPath, ['--experimental-strip-types', '--no-warnings', cli, ...args], { cwd: ROOT, encoding: 'utf8', env: { ...process.env, CI_COMMIT_TAG: '' } });
  it('exits 2 on usage errors and refuses to rewrite the baseline at rc', () => {
    expect(node(['--phase', 'ga']).status).toBe(2);
    expect(node(['--write-baseline', '--phase', 'rc']).status).toBe(2);
  });
  it('writes the per-flagship report and exits 0 before RC-1, 1 at RC-1', () => {
    const dir = mkdtempSync(join(tmpdir(), 'ag-deliverables-'));
    try {
      const pre = node(['--quiet', '--json', join(dir, 'pre.json')]);
      expect(pre.status).toBe(0);
      const report = JSON.parse(readFileSync(join(dir, 'pre.json'), 'utf8'));
      expect(report.flagships).toHaveLength(44);
      expect(node(['--quiet', '--phase', 'rc', '--json', join(dir, 'rc.json')]).status).toBe(1);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });
});
