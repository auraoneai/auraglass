/* G-14 / REQ-QUAL-26 (FIN-433): the S-55 VisualClassReport. Validates against the contract type and the double in
   tests/contract-doubles/reports/visual-class.json; a 0.2 % diff is changed, a 0.05 % diff is not (VISUAL_TOLERANCE);
   run.mjs writes .artifacts/qual/visual-class.json only from a complete merge-base/head set. */
import { afterEach, describe, expect, test } from '@jest/globals';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
// @ts-expect-error — plain ESM module without declarations
import { writeVisualClass } from '../../../certification/run.mjs';
import { REPORTS, VISUAL_TOLERANCE, type VisualClassReport } from '../../../src/contracts/testing';
import { buildRegressionPlan, configCell, REGRESSION_CONFIGS } from '../src/evidence/regression';
import {
  absentAtBase, buildVisualClassReport, cellRow, comparePngs, isVisualClassCell, validateVisualClassReport, writeVisualClassReport,
} from '../src/evidence/visualClass';
import { cellId } from '../src/matrix/axes';
import { encodePng, type RgbaImage } from '../src/pixel/png';

const ROOT = join(__dirname, '../../..');
const SHA = '1'.repeat(40);
const BASE = '2'.repeat(40);
const tmp: string[] = [];
afterEach(() => { for (const d of tmp.splice(0)) rmSync(d, { recursive: true, force: true }); });
const scratch = () => { const d = mkdtempSync(join(tmpdir(), 'ag-vc-')); tmp.push(d); return d; };

function image(w: number, h: number): RgbaImage {
  const data = new Uint8ClampedArray(w * h * 4);
  for (let i = 0; i < w * h; i++) { data[i * 4] = (i * 7) % 200; data[i * 4 + 1] = 80; data[i * 4 + 2] = 160; data[i * 4 + 3] = 255; }
  return { width: w, height: h, data };
}
function change(img: RgbaImage, n: number): RgbaImage {
  const data = new Uint8ClampedArray(img.data);
  for (let i = 0; i < n; i++) { data[i * 4 + 1] = 255; data[i * 4 + 2] = 0; }
  return { ...img, data };
}

describe('S-55 shape', () => {
  test('the contract double validates', () => {
    const double = JSON.parse(readFileSync(join(ROOT, 'tests/contract-doubles/reports/visual-class.json'), 'utf8')) as VisualClassReport;
    expect(validateVisualClassReport(double)).toEqual([]);
  });

  test('a built report is the contract type and validates; changedCount counts changed cells', () => {
    const a = cellId('button--playground', configCell(REGRESSION_CONFIGS[0]!));
    const b = cellId('button--playground', configCell(REGRESSION_CONFIGS[8]!));
    const c = cellId('dialog--open', configCell(REGRESSION_CONFIGS[1]!));
    const report: VisualClassReport = buildVisualClassReport({ sha: SHA, base: BASE, cells: [
      { cell: b, changedRatio: 0, changed: false }, { cell: a, changedRatio: 0.004, changed: true }, absentAtBase(c),
    ] });
    expect(report).toEqual({ version: 1, sha: SHA, base: BASE, changedCount: 2, cells: [
      { cell: a, changedRatio: 0.004, changed: true }, { cell: b, changedRatio: 0, changed: false }, { cell: c, changedRatio: 1, changed: true, reason: 'absent-at-base' },
    ] });
    expect(validateVisualClassReport(report)).toEqual([]);
  });

  test('invalid reports are rejected with the reason', () => {
    const cell = cellId('button--playground', configCell(REGRESSION_CONFIGS[0]!));
    const ok = { version: 1, sha: SHA, base: BASE, cells: [{ cell, changedRatio: 0.002, changed: true }], changedCount: 1 };
    expect(validateVisualClassReport({ ...ok, changedCount: 0 })).toEqual([expect.stringMatching(/changedCount/)]);
    expect(validateVisualClassReport({ ...ok, cells: [{ cell, changedRatio: 0.002, changed: false }] })).toEqual([
      expect.stringMatching(/changed: false disagrees with changedRatio 0.002/), expect.stringMatching(/changedCount/)]);
    expect(validateVisualClassReport({ ...ok, sha: 'abc' })).toEqual([expect.stringMatching(/\$\.sha/)]);
    expect(validateVisualClassReport({ ...ok, cells: [{ cell: 'button|photo|chromium', changedRatio: 0, changed: false }], changedCount: 0 })).toEqual([expect.stringMatching(/not <storyId>\|<scene>\|<engine>\|<axes>/)]);
    expect(validateVisualClassReport({ ...ok, cells: [{ cell: 'b|moon|chromium|x', changedRatio: 0, changed: false }], changedCount: 0 })).toEqual([expect.stringMatching(/unknown scene 'moon'/)]);
    expect(validateVisualClassReport({ ...ok, extra: 1 })).toEqual([expect.stringMatching(/\$\.extra: unknown key/)]);
    expect(() => buildVisualClassReport({ sha: SHA, base: BASE, cells: [ok.cells[0]!, ok.cells[0]!] })).toThrow(/duplicate cell/);
  });
});

describe('VISUAL_TOLERANCE on fixture PNGs', () => {
  const base = image(100, 100); // 10,000 px
  test('0.2 % changed pixels → changed: true', () => {
    const c = comparePngs(encodePng(base), encodePng(change(base, 20)));
    expect(c.changedRatio).toBeCloseTo(0.002, 6);
    expect(c.changed).toBe(true);
  });
  test('0.05 % changed pixels → changed: false', () => {
    const c = comparePngs(encodePng(base), encodePng(change(base, 5)));
    expect(c.changedRatio).toBeCloseTo(0.0005, 6);
    expect(c.changed).toBe(false);
  });
  test('the boundary is strict (ratio = 0.001 is not changed) and a size change is a full change', () => {
    const atBoundary = comparePngs(encodePng(base), encodePng(change(base, 10)));
    expect(atBoundary.changedRatio).toBe(VISUAL_TOLERANCE.changedRatio);
    expect(atBoundary.changed).toBe(false);
    expect(comparePngs(encodePng(base), encodePng(image(100, 101)))).toMatchObject({ changedRatio: 1, changed: true, reason: 'size-changed 100x100→100x101' });
  });
  test('includeAA is false: anti-aliased edge pixels are not counted', () => {
    // a 1-px dark diagonal line on white, shifted by one pixel horizontally: pixelmatch classes the edge pixels as
    // anti-aliasing only when includeAA is false, so the diff is smaller than the raw count of differing pixels.
    const w = 40; const h = 40;
    const draw = (shift: number) => {
      const d = new Uint8ClampedArray(w * h * 4).fill(255);
      for (let y = 0; y < h; y++) for (const [dx, v] of [[0, 0], [1, 128]] as const) {
        const x = y + shift + dx;
        if (x < w) { const i = (y * w + x) * 4; d[i] = d[i + 1] = d[i + 2] = v; }
      }
      return { width: w, height: h, data: d };
    };
    const a = draw(0); const b = draw(1);
    let raw = 0;
    for (let i = 0; i < a.data.length; i += 4) if (a.data[i] !== b.data[i]) raw++;
    const c = comparePngs(encodePng(a), encodePng(b));
    expect(c.diffPixels).toBeLessThan(raw);
  });
});

describe('visual-class cells', () => {
  test('every L7 cell is a default-preference cell at 1440 or 390; a tinted cell is not', () => {
    const plan = buildRegressionPlan({ scope: 'main', indexIds: new Set(['button--playground']), stories: [{ id: 'button--playground', subject: 'Button', kind: 'component', tags: [], owner: 'CMP' }],
      states: new Map([['button--playground', [{ name: 'hover', drive: [{ action: 'hover', target: 'root' }] }]]]), affected: null, sentinels: [] });
    expect(plan.entries).toHaveLength(20); // 2 subject-states × 10 configs
    expect(plan.entries.every((e) => isVisualClassCell(e.id))).toBe(true);
    expect(isVisualClassCell('button--playground|photo|chromium|light.tinted.default.standard.1440')).toBe(false);
    expect(isVisualClassCell('button--playground|photo|chromium|light.glass.contrast-more.standard.1440')).toBe(false);
  });

  test('pr scope plans affected subjects plus sentinels and reports missing sentinels', () => {
    const stories = [
      { id: 'button--playground', subject: 'Button', kind: 'component', tags: [], owner: 'CMP' },
      { id: 'card--playground', subject: 'Card', kind: 'component', tags: [], owner: 'CMP' },
      { id: 'scenes--photo', subject: 'photo', kind: 'scene', tags: [], owner: 'QUAL' },
    ];
    const plan = buildRegressionPlan({ scope: 'pr', indexIds: new Set(stories.map((s) => s.id)), stories, states: new Map(), affected: new Set(['Card']),
      sentinels: [{ subject: 'Button', story: 'playground' }, { subject: 'Dialog', state: 'open' }] });
    expect([...new Set(plan.entries.map((e) => e.storyId))]).toEqual(['button--playground', 'card--playground']);
    expect(plan.pendingSentinels).toEqual([{ subject: 'Dialog', state: 'open' }]);
  });
});

// ---- run.mjs writeVisualClass ---------------------------------------------------------------------------------------
const vcDeps = { buildVisualClassReport, writeVisualClassReport };
function laneEvidence(plan: Record<string, unknown>, rows: unknown[], errors: unknown[] = []): string {
  const dir = scratch();
  mkdirSync(join(dir, 'regression'), { recursive: true });
  writeFileSync(join(dir, 'regression', 'plan.json'), JSON.stringify(plan));
  if (rows.length) writeFileSync(join(dir, 'regression', 'visual-class-9.jsonl'), rows.map((r) => JSON.stringify(r)).join('\n') + '\n');
  if (errors.length) writeFileSync(join(dir, 'regression', 'vc-errors-9.jsonl'), errors.map((r) => JSON.stringify(r)).join('\n') + '\n');
  return dir;
}

describe('run.mjs writes REPORTS.visualClass', () => {
  const cells = REGRESSION_CONFIGS.map((c) => cellId('button--playground', configCell(c)));
  const plan = { base: { sha: BASE, url: 'http://127.0.0.1:6007', error: null }, shard: null, visualClassCells: cells };
  const base = image(100, 100);

  test('a complete set is written with changedCount = changed cells', async () => {
    const rows = cells.map((cell, i) => cellRow(cell, comparePngs(encodePng(base), encodePng(change(base, i === 0 ? 20 : i === 1 ? 5 : 0)))));
    const root = scratch();
    const r = await writeVisualClass({ root, evidenceDir: laneEvidence(plan, rows), scope: 'main', sha: SHA }, vcDeps);
    expect(r).toMatchObject({ lane: 'L7', state: 'pass', file: REPORTS.visualClass });
    const written = JSON.parse(readFileSync(join(root, REPORTS.visualClass), 'utf8')) as VisualClassReport;
    expect(validateVisualClassReport(written)).toEqual([]);
    expect(written).toMatchObject({ sha: SHA, base: BASE, changedCount: 1 });
    expect(written.cells).toHaveLength(10);
  });

  test('a missing merge-base comparison writes no file: pending below release (with the base render error), fail at release', async () => {
    const rows = cells.slice(1).map((cell) => ({ cell, changedRatio: 0, changed: false }));
    const errors = [{ cell: cells[0], error: 'locator.waitFor: Timeout 30000ms exceeded' }];
    for (const [scope, state] of [['pr', 'pending'], ['release', 'fail']] as const) {
      const root = scratch();
      const r = await writeVisualClass({ root, evidenceDir: laneEvidence(plan, rows, errors), scope, sha: SHA }, vcDeps);
      expect(r).toMatchObject({ state, reason: expect.stringContaining('1 visual-class cell(s) without a merge-base/head comparison') });
      expect(r.reason).toContain('merge-base render error: locator.waitFor');
      expect(existsSync(join(root, REPORTS.visualClass))).toBe(false);
    }
  });

  test('no merge-base build, a sharded run or an unknown head sha write no file', async () => {
    const rows = cells.map((cell) => ({ cell, changedRatio: 0, changed: false }));
    const cases: Array<[Record<string, unknown>, string, RegExp]> = [
      [{ ...plan, base: { sha: BASE, error: 'storybook:build at the base failed (exit 1)' } }, SHA, /no merge-base Storybook \(storybook:build at the base failed/],
      [{ ...plan, base: null }, SHA, /AG_L7_BASE not prepared/],
      [{ ...plan, shard: { index: 1, total: 4 } }, SHA, /sharded/],
      [plan, 'unknown', /head sha unknown/],
    ];
    for (const [p, sha, re] of cases) {
      const root = scratch();
      const r = await writeVisualClass({ root, evidenceDir: laneEvidence(p, rows), scope: 'pr', sha }, vcDeps);
      expect(r.state).toBe('pending');
      expect(r.reason).toMatch(re);
      expect(existsSync(join(root, REPORTS.visualClass))).toBe(false);
    }
  });
});
