/* @jest-environment node */
// REQ-SURF-15 (REQ-FIN-80): the L11 migrate-4to5 canary's expectations
// (tests/fixtures/consumer-4x/cases/surf/canary.json) and its pure rules
// (scripts/surf/migrate-canary-lib.mjs). The canary itself runs remotely in
// surf:package:migrate-canary; this file keeps the manifest honest on L1.
import { describe, expect, it } from '@jest/globals';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  countHandlerButtons,
  countMarkers,
  evaluateCase,
  listCaseFiles,
  reviveProps,
  stripTsNocheck,
  validateManifest,
} from '../../scripts/surf/migrate-canary-lib.mjs';

const CASES = join(__dirname, '../fixtures/consumer-4x/cases/surf');
const manifest = JSON.parse(readFileSync(join(CASES, 'canary.json'), 'utf8'));
const files = listCaseFiles(CASES);

describe('consumer-4x SURF cases manifest', () => {
  it('classifies every case page exactly once with valid fields', () => {
    expect(validateManifest(manifest, files)).toEqual([]);
  });

  it('keeps one page per absorbed family: Stats.page.tsx is split into StatCard and Sparkline pages', () => {
    expect(files).not.toContain('data/Stats.page.tsx');
    expect(files).toEqual(expect.arrayContaining(['data/StatCard.page.tsx', 'data/Sparkline.page.tsx']));
    const families = (f: string) => manifest.cases.find((c: { file: string }) => c.file === f).families;
    expect(families('data/Sparkline.page.tsx')).toEqual(['GlassSparkline']);
    expect(families('data/StatCard.page.tsx')).not.toContain('GlassSparkline');
  });

  it('covers every REQ-SURF-15 family', () => {
    const covered = new Set(manifest.cases.flatMap((c: { families: string[] }) => c.families));
    for (const fam of ['GlassAppShell', 'GlassDataTable', 'GlassDataGrid', 'GlassVirtualTable', 'GlassSparkline', 'GlassStatCard',
      'GlassTimeline', 'GlassDatePicker', 'date-fns', 'GlassChat', 'LiquidGlassMediaControls', 'GlassCarousel', 'AuroraBackground', 'GlassDataChart']) {
      expect(covered.has(fam)).toBe(true);
    }
    const sources = files.map((f) => readFileSync(join(CASES, f), 'utf8'));
    expect(sources.some((s) => /from 'aura-glass\/app-shell'/.test(s))).toBe(true);
    // A case imports date-fns directly (written without the literal import text so
    // tests/charts/peer-isolation.test.ts does not read this test as an import).
    expect(sources.some((s) => /\bfrom\s+(['"])date-fns\1/.test(s))).toBe(true);
  });

  it('the date case does not use the removed `format` prop', () => {
    const src = readFileSync(join(CASES, 'date/DatePicker.page.tsx'), 'utf8');
    expect(src).not.toMatch(/\bformat=/);
  });

  it('every case keeps its leading @ts-nocheck (root tsc) and the canary strips exactly that line', () => {
    for (const f of files) {
      const src = readFileSync(join(CASES, f), 'utf8');
      expect(src.startsWith('// @ts-nocheck')).toBe(true);
      const stripped = stripTsNocheck(src);
      expect(stripped).toBe(src.slice(src.indexOf('\n') + 1));
      expect(stripped).not.toMatch(/@ts-nocheck/);
    }
  });

  it('rejects an unclassified case, a duplicate and a flagship page without render or exemption', () => {
    const bad = {
      from: 'aura-glass@4.1.0',
      cases: [
        { file: 'a/A.page.tsx', families: ['A'], subset: 'flagship' },
        { file: 'a/A.page.tsx', families: ['A'], subset: 'chart' },
      ],
    };
    const errors = validateManifest(bad, ['a/A.page.tsx', 'b/B.page.tsx']);
    expect(errors).toEqual(expect.arrayContaining([
      expect.stringContaining('needs exactly one of render'),
      expect.stringContaining('listed 2 times'),
      expect.stringContaining('b/B.page.tsx is not classified'),
    ]));
  });
});

describe('canary rules', () => {
  const marker = '// TODO(aura-glass 5): removed in 5.0 (registry item \'chart-adapter\'), see docs/x.md';
  const removedTodo = { transform: 'removed', reason: "removed in 5.0 (registry item 'chart-adapter')", doc: 'docs/x.md' };

  it('flagship passes only with 0 TODOs and 0 markers', () => {
    const c = { file: 'x.page.tsx', subset: 'flagship' as const, families: ['X'] };
    expect(evaluateCase(c, { todos: [], source: 'export {}' }).ok).toBe(true);
    const r = evaluateCase(c, { todos: [removedTodo], source: `${marker}\nexport {}` });
    expect(r.ok).toBe(false);
    expect(r.failures).toHaveLength(2);
  });

  it('chart passes only with exactly one removed TODO', () => {
    const c = { file: 'c.page.tsx', subset: 'chart' as const, families: ['GlassDataChart'] };
    expect(evaluateCase(c, { todos: [removedTodo], source: `${marker}\nx` }).ok).toBe(true);
    expect(evaluateCase(c, { todos: [], source: 'x' }).ok).toBe(false);
    expect(evaluateCase(c, { todos: [removedTodo, removedTodo], source: `${marker}\n${marker}` }).ok).toBe(false);
    expect(evaluateCase(c, { todos: [{ ...removedTodo, transform: 'prop-grammar' }], source: `${marker}\nx` }).ok).toBe(false);
  });

  it('handler-only items must become render={<button type="button" onClick={…} />}', () => {
    const c = { file: 's.page.tsx', subset: 'flagship' as const, families: ['GlassSidebar'], handlerOnlyItems: 2 };
    const good = '<Sidebar.Item render={<button type="button" onClick={a} />}>A</Sidebar.Item>\n<Sidebar.Item render={ <button type="button" onClick={() => b()} /> }>B</Sidebar.Item>';
    expect(countHandlerButtons(good)).toBe(2);
    expect(evaluateCase(c, { todos: [], source: good }).ok).toBe(true);
    const onSelect = '<Sidebar.Item onSelect={a}>A</Sidebar.Item><Sidebar.Item onSelect={b}>B</Sidebar.Item>';
    expect(evaluateCase(c, { todos: [], source: onSelect }).failures).toEqual([expect.stringContaining('expected 2')]);
    expect(countHandlerButtons('<Sidebar.Item render={<a href="/x" />} />')).toBe(0);
  });

  it('counts markers and revives $date props', () => {
    expect(countMarkers(`${marker}\n${marker}\nconst a = 1;`)).toBe(2);
    const p = reviveProps({ events: [{ at: { $date: '2026-10-01T09:00:00.000Z' }, n: 1 }] }) as { events: [{ at: Date; n: number }] };
    const [ev] = p.events;
    expect(ev.at).toBeInstanceOf(Date);
    expect(ev.at.toISOString()).toBe('2026-10-01T09:00:00.000Z');
    expect(ev.n).toBe(1);
  });
});
