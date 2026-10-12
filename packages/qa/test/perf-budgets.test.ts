/** @jest-environment node */
/* packages/qa/test/perf-budgets.test.ts — REQ-QUAL-38 budget resolution: defaults, owner rows tighten only,
   perf-budget-looser (scripts/qual/perf/resolve-budgets.mjs exits non-zero), shrink-only expiring baseline. */
import { spawnSync } from 'node:child_process';
import { cpSync, mkdirSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it } from '@jest/globals';
import { budgetFor, checkLooserBaseline, defaultFor, isLooser, parsePerfThresholds, resolveBudgets, rowErrors } from '../src/perf/budgets';

const ROOT = join(__dirname, '../../..');
const raw = JSON.parse(readFileSync(join(ROOT, 'certification/thresholds.json'), 'utf8'));
const t = parsePerfThresholds(raw);
const SCRIPT = join(ROOT, 'scripts/qual/perf/resolve-budgets.mjs');

describe('thresholds.json#perf', () => {
  it('holds the REQ-QUAL-38 default ceilings', () => {
    expect(t.ceilings.blurredSurfaces).toEqual({ fine: 6, coarse: 3 });
    expect(t.ceilings.bci).toEqual({ fine: 2, coarse: 1.2 });
    expect(t.ceilings.effectiveNesting).toEqual({ default: 1, allowNested: 2 });
    expect(t.ceilings.blurRadiusPx).toBe(32);
    expect(t.ceilings.fullViewportBlur).toMatchObject({ layer: 'scrim', maxPx: 12 });
    expect(t.ceilings.refractingSurfaces).toEqual({ fine: 2, coarse: 1, maxViewportShare: 0.25 });
    expect(t.ceilings.liveWebglContexts).toBe(1);
    expect(t.ceilings.frameP95Ms).toEqual({ fine: 16.7, coarse: 25 });
    expect(t.ceilings.settledLongAnimationFrames).toEqual({ fine: 0, coarse: 1 });
    expect(t.ceilings.interactionLatencyP95Ms).toEqual({ fine: 50, coarse: 100, subjects: ['Menu', 'Select', 'Combobox', 'Tabs'] });
    expect([t.ceilings.heapDeltaMB, t.ceilings.dashboardHeapAtRestMB, t.ceilings.layoutsPerFrameDuringScroll, t.ceilings.dashboardRenderToStringMedianMs]).toEqual([1, 30, 0, 50]);
    expect(t.ceilings.styleRecalcMsDuringScroll).toEqual({ fine: 1, coarse: 3 });
    expect(t.surfaceBudget.viewports.map((v) => `${v.width}x${v.height}:${v.pointer}`)).toEqual(['1440x900:fine', '1920x1080:fine', '390x844:coarse']);
    expect(t.surfaceBudget.scrollPositions).toHaveLength(3);
  });
  it('a missing or mistyped key throws (no built-in fallback)', () => {
    const bad = structuredClone(raw); delete bad.perf.ceilings.bci.coarse; bad.perf.grades.heapDeltaMB = [1, 0.5, 2, 5];
    expect(() => parsePerfThresholds(bad)).toThrow(/perf\.ceilings\.bci\.coarse must be a number.*perf\.grades\.heapDeltaMB must be non-decreasing/);
  });
});

describe('resolveBudgets', () => {
  const frag = (stream: string, value: unknown) => ({ stream, file: `/r/fragments/perf-budgets/${stream}.ts`, value });
  it('defaults per profile/metric; lcp-ms has no QUAL default', () => {
    expect(defaultFor(t, 'desktop-120hz', 'blurred-surfaces')).toBe(6);
    expect(defaultFor(t, 'mid-mobile', 'blurred-surfaces')).toBe(3);
    expect(defaultFor(t, 'mid-mobile', 'frame-p95-ms')).toBe(25);
    expect(defaultFor(t, 'desktop-120hz', 'grade')).toBe('C');
    expect(defaultFor(t, 'desktop-120hz', 'lcp-ms')).toBeNull();
  });
  it('a tighter row overrides the default; a looser row is reported and never widens the budget', () => {
    const res = resolveBudgets(t, [frag('cmp', [
      { subject: 'Dialog', profile: 'desktop-120hz', metric: 'blurred-surfaces', max: 2, provisional: true },
      { subject: 'Sheet', profile: 'mid-mobile', metric: 'blurred-surfaces', max: 4, provisional: true },
      { subject: 'Menu', profile: 'desktop-120hz', metric: 'grade', max: 'B', provisional: false },
    ])]);
    expect(budgetFor(res, ['Dialog'], 'desktop-120hz', 'blurred-surfaces')).toBe(2);
    expect(budgetFor(res, ['Sheet'], 'mid-mobile', 'blurred-surfaces')).toBe(3);
    expect(budgetFor(res, ['Tabs'], 'mid-mobile', 'bci')).toBe(1.2);
    expect(res.looser).toEqual([expect.objectContaining({ subject: 'Sheet', max: 4, default: 3 })]);
    expect(isLooser('D', 'C')).toBe(true);
    expect(isLooser('B', 'C')).toBe(false);
  });
  it('duplicates keep the tightest value; malformed rows are reported', () => {
    const res = resolveBudgets(t, [frag('cmp', [{ subject: 'X', profile: 'mid-mobile', metric: 'bci', max: 1, provisional: true }]),
      frag('surf', [{ subject: 'X', profile: 'mid-mobile', metric: 'bci', max: 0.8, provisional: true }, { subject: 'Y', profile: 'tablet', metric: 'bci', max: 1 }])]);
    expect(budgetFor(res, ['X'], 'mid-mobile', 'bci')).toBe(0.8);
    expect(res.duplicates).toEqual([expect.objectContaining({ key: 'X|mid-mobile|bci', kept: 0.8 })]);
    expect(res.malformed).toHaveLength(1);
    expect(rowErrors({ subject: 'Y', profile: 'tablet', metric: 'bci', max: 1 })).toEqual(['profile must be desktop-120hz|mid-mobile', 'provisional must be a boolean']);
  });
});

describe('expiring baseline', () => {
  const looser = [{ stream: 'surf', file: '/r/fragments/perf-budgets/surf.ts', subject: 'S', profile: 'mid-mobile' as const, metric: 'blurred-surfaces' as const, max: 4, default: 3 }];
  const row = { file: 'fragments/perf-budgets/surf.ts', owner: 'SURF', reqFin: 'REQ-FIN-105', expires: 'RC-1', subject: 'S', profile: 'mid-mobile', metric: 'blurred-surfaces' };
  const relf = (f: string) => f.replace('/r/', '');
  it('covers a listed offender before RC-1, fails new offenders, stale rows, wrong owners, and every row at release', () => {
    expect(checkLooserBaseline([row], looser, relf, 'pr')).toEqual([]);
    expect(checkLooserBaseline([], looser, relf, 'pr')[0]).toMatch(/^perf-budget-looser: fragments\/perf-budgets\/surf\.ts S mid-mobile blurred-surfaces max 4 is looser than the QUAL default 3/);
    expect(checkLooserBaseline([row], [], relf, 'pr')[0]).toMatch(/stale row/);
    expect(checkLooserBaseline([{ ...row, owner: 'CMP' }], looser, relf, 'pr')[0]).toMatch(/does not own/);
    expect(checkLooserBaseline([row], looser, relf, 'release')[0]).toMatch(/expired at RC-1/);
    expect(checkLooserBaseline([{ ...row, expires: '2027-01-01' }], looser, relf, 'pr')[0]).toMatch(/malformed/);
  });
});

describe('scripts/qual/perf/resolve-budgets.mjs', () => {
  function fixtureRoot(rows: unknown[]): string {
    const dir = mkdtempSync(join(tmpdir(), 'ag-resolve-'));
    mkdirSync(join(dir, 'certification'), { recursive: true });
    mkdirSync(join(dir, 'fragments/perf-budgets'), { recursive: true });
    cpSync(join(ROOT, 'certification/thresholds.json'), join(dir, 'certification/thresholds.json'));
    writeFileSync(join(dir, 'certification/perf-budget-looser.baseline.json'), '[]');
    writeFileSync(join(dir, 'fragments/perf-budgets/cmp.json'), JSON.stringify(rows));
    return dir;
  }
  const runScript = (root: string) => spawnSync(process.execPath, [SCRIPT, '--root', root], { encoding: 'utf8' });
  it('exits 0 and writes budgets.json when every row tightens', () => {
    const root = fixtureRoot([{ subject: 'Dialog', profile: 'desktop-120hz', metric: 'blurred-surfaces', max: 2, provisional: true }]);
    const r = runScript(root);
    expect(r.stdout).toMatch(/1 resolved row/);
    expect(r.status).toBe(0);
    const out = JSON.parse(readFileSync(join(root, 'certification/budgets.json'), 'utf8'));
    expect(out.rows).toEqual([expect.objectContaining({ subject: 'Dialog', max: 2, default: 6, file: 'fragments/perf-budgets/cmp.json' })]);
  });
  it('exits non-zero with perf-budget-looser on a looser fixture row', () => {
    const r = runScript(fixtureRoot([{ subject: 'Dialog', profile: 'desktop-120hz', metric: 'bci', max: 2.5, provisional: true }]));
    expect(r.status).toBe(1);
    expect(r.stdout).toMatch(/FAIL perf-budget-looser: fragments\/perf-budgets\/cmp\.json Dialog desktop-120hz bci max 2\.5 is looser than the QUAL default 2/);
  });
  it('passes on this checkout (current offenders are baselined, owner named, expiring RC-1)', () => {
    const r = spawnSync(process.execPath, [SCRIPT, '--out', join(mkdtempSync(join(tmpdir(), 'ag-resolve-out-')), 'budgets.json')], { encoding: 'utf8', cwd: ROOT });
    expect(r.stdout).not.toMatch(/FAIL/);
    expect(r.status).toBe(0);
  });
});

describe('generated certification/budgets.json is never committed (REQ-QUAL-38)', () => {
  const git = (...a: string[]) => spawnSync('git', a, { cwd: ROOT, encoding: 'utf8' });
  it('is git-ignored at the default resolve-budgets.mjs output path', () => {
    const r = git('check-ignore', '--no-index', '-q', 'certification/budgets.json');
    expect(r.status).toBe(0);
  });
  it('is not tracked', () => {
    expect(git('ls-files', '--', 'certification/budgets.json').stdout.trim()).toBe('');
  });
  it('resolve-budgets.mjs writes there by default', () => {
    const src = readFileSync(SCRIPT, 'utf8');
    expect(src).toContain("o.out ??= join(o.root, 'certification/budgets.json');");
  });
});
