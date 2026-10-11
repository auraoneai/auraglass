/** @jest-environment node */
/* packages/qa/test/grade.test.ts — REQ-QUAL-37 grade boundaries (every column, lowest column wins) and the release gate. */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from '@jest/globals';
import { parsePerfThresholds } from '../src/perf/budgets';
import {
  cellMetrics, gradeCell, gradeResults, letterFor, perfProfileOf, releaseGate, validatePerfReport,
  type CellMetrics, type PerfGrades, type PerfResultLike, type PerfResultsLike,
} from '../src/perf/grade';

const ROOT = join(__dirname, '../../..');
const t = parsePerfThresholds(JSON.parse(readFileSync(join(ROOT, 'certification/thresholds.json'), 'utf8')));

/** An all-A cell; each test moves one column. */
const A: CellMetrics = { frameP95Ms: 8, transitionFrameP95Ms: null, longAnimationFrames: 0, settledIdle: 0, heapDeltaMB: 0.25, bytesRatio: 0.5,
  hasSizeRow: true, bci: 0.4, blurredSurfaces: 2 };
const g = (m: Partial<CellMetrics>, profile: 'desktop-120hz' | 'mid-mobile' = 'desktop-120hz', tier: 'T1' | 'T2' = 'T1') =>
  gradeCell({ ...A, ...m }, { profile, tier, bciBudget: 2 }, t);

describe('letterFor', () => {
  it('bounds are inclusive and anything past D is F; a missing value is F', () => {
    expect(letterFor(8.3, [8.3, 11, 16.7, 25])).toBe('A');
    expect(letterFor(8.31, [8.3, 11, 16.7, 25])).toBe('B');
    expect(letterFor(25.01, [8.3, 11, 16.7, 25])).toBe('F');
    expect(letterFor(null, [1, 2, 3, 4])).toBe('F');
  });
});

describe('frame p95 column', () => {
  it.each([[8.3, 'A'], [8.4, 'B'], [11, 'B'], [11.1, 'C'], [16.7, 'C'], [16.8, 'D'], [25, 'D'], [25.1, 'F']])('a@120 %s ms → %s', (v, l) => {
    expect(g({ frameP95Ms: v }).columns.framePeriod).toBe(l);
  });
  it.each([[16.7, 'A'], [16.8, 'B'], [20, 'B'], [20.1, 'C'], [25, 'C'], [25.1, 'D'], [33, 'D'], [33.1, 'F']])('b %s ms → %s', (v, l) => {
    expect(g({ frameP95Ms: v }, 'mid-mobile').columns.framePeriod).toBe(l);
  });
});

describe('long-animation-frame column (>100 ms in 5 s, delta vs blank)', () => {
  it.each([[0, 'A'], [1, 'C'], [2, 'D'], [3, 'D'], [4, 'F']])('%s → %s', (v, l) => { expect(g({ longAnimationFrames: v }).columns.longAnimationFrames).toBe(l); });
  it('delta vs blank never goes below 0 and needs the blank cell', () => {
    const cell = mkResult({ loaf: 2 }); const blank = mkResult({ storyId: 'perf-harness-blank--default', loaf: 3 });
    expect(cellMetrics(cell, blank).longAnimationFrames).toBe(0);
    expect(cellMetrics(mkResult({ loaf: 4 }), blank).longAnimationFrames).toBe(1);
    expect(cellMetrics(cell, null).longAnimationFrames).toBeNull();
  });
});

describe('settled idle column', () => {
  it.each([[0, 'A'], [1, 'F']])('%s → %s', (v, l) => { expect(g({ settledIdle: v }).columns.settledIdle).toBe(l); });
});

describe('heap delta column (MB after 10 cycles)', () => {
  it.each([[0.5, 'A'], [0.51, 'B'], [1, 'B'], [1.01, 'C'], [2, 'C'], [2.01, 'D'], [5, 'D'], [5.01, 'F']])('%s → %s', (v, l) => {
    expect(g({ heapDeltaMB: v }).columns.heapDelta).toBe(l);
  });
});

describe('bytes vs SizeBudgetRow column', () => {
  it.each([[0.8, 'A'], [0.81, 'B'], [1, 'B'], [1.01, 'F']])('%s → %s', (v, l) => { expect(g({ bytesRatio: v }).columns.bytes).toBe(l); });
  it('no size-budget row is F; a row that was not measured is F', () => {
    expect(g({ hasSizeRow: false, bytesRatio: null }).grade).toBe('F');
    expect(g({ hasSizeRow: false, bytesRatio: null }).reasons).toContain('bytes: no SizeBudgetRow for the subject');
    expect(g({ bytesRatio: null }).columns.bytes).toBe('F');
  });
});

describe('BCI vs budget column', () => {
  // budget 2.0 → ratio = bci / 2
  it.each([[1, 'A'], [1.02, 'B'], [1.5, 'B'], [1.52, 'C'], [2, 'C'], [2.02, 'F'], [3, 'F']])('T1 bci %s → %s', (v, l) => {
    expect(g({ bci: v }).columns.bci).toBe(l);
  });
  it.each([[2, 'C'], [2.02, 'D'], [3, 'D'], [3.02, 'F']])('T2 bci %s → %s (≤150% only for T2)', (v, l) => {
    expect(g({ bci: v }, 'desktop-120hz', 'T2').columns.bci).toBe(l);
  });
});

describe('lowest column wins', () => {
  it('one D column makes the cell D; one F makes it F', () => {
    expect(g({}).grade).toBe('A');
    expect(g({ heapDeltaMB: 3 }).grade).toBe('D');
    expect(g({ heapDeltaMB: 3, frameP95Ms: 12 }).grade).toBe('D');
    expect(g({ heapDeltaMB: 3, settledIdle: 2 }).grade).toBe('F');
    expect(g({ heapDeltaMB: 3 }).reasons).toContain('limited by heapDelta');
  });
  it('a missing metric grades F (fail closed)', () => {
    expect(g({ frameP95Ms: null }).grade).toBe('F');
    expect(g({ frameP95Ms: null }).reasons).toContain('framePeriod: metric missing');
  });
});

/* ---------------------------------------------------------------- report + gate */

function mkResult(o: { storyId?: string; subject?: string; profile?: 'a' | 'b' | 'c'; hz?: number; p95?: number; loaf?: number; heap?: number; bci?: number; kind?: 'fixture' | 'flagship' }): PerfResultLike {
  const storyId = o.storyId ?? 'components-button--playground';
  const win = { durationMs: 5000, frames: { count: 300, p50Ms: 8, p95Ms: o.p95 ?? 8 }, longTasks: { count: 0, totalMs: 0, maxMs: 0 }, loaf: { count: o.loaf ?? 0, over100ms: o.loaf ?? 0, maxMs: 0 } };
  return { subject: o.subject ?? (storyId.startsWith('perf-') ? 'perf-harness-blank' : 'Button'), storyId, kind: o.kind ?? (storyId.startsWith('perf-') ? 'fixture' : 'flagship'),
    owner: 'CMP', profile: o.profile ?? 'a', engine: 'chromium', refreshHz: o.hz ?? 120, tier: 'standard', scene: 'photo', status: 'pass', failures: [],
    windows: { transition: null, settled: win }, gpu: { blurredSurfaces: 1, bci: o.bci ?? 0.4 }, heap: { deltaBytes: (o.heap ?? 0.25) * 1024 * 1024 },
    idle: { rafRequestsInQuiet: 0, pendingRaf: 0, intervals: 0, infiniteAnimations: 0 }, bytes: { limitBytes: 10240, minGzipBytes: 5000 }, bytesNote: null };
}
const doc = (results: PerfResultLike[], tags = 'saas-linux-medium-amd64-gpu-standard'): PerfResultsLike => ({ sha: 'f'.repeat(40), scope: 'main', runner: { tags, jobUrl: null }, results });
const budgets = { rows: [], defaults: { 'desktop-120hz': { bci: 2 }, 'mid-mobile': { bci: 1.2 } } } as never;

function run(results: PerfResultLike[], tiers: Array<[string, 'T1' | 'T2']> = [['Button', 'T1']], tags?: string) {
  return gradeResults({ results: [doc(results, tags)], sources: ['x'], tiers: new Map(tiers), required: tiers.map(([subject, tier]) => ({ subject, tier })),
    budgets, thresholds: t, thresholdsSha256: null });
}
const blankA = mkResult({ storyId: 'perf-harness-blank--default' });
const blankB = mkResult({ storyId: 'perf-harness-blank--default', profile: 'b', hz: 60 });

describe('gradeResults → PerfReport', () => {
  it('maps a@120 → desktop-120hz and b → mid-mobile; a@60, c and d are not graded', () => {
    expect(perfProfileOf({ profile: 'a', refreshHz: 120 })).toBe('desktop-120hz');
    expect(perfProfileOf({ profile: 'a', refreshHz: 60 })).toBeNull();
    expect(perfProfileOf({ profile: 'b', refreshHz: 60 })).toBe('mid-mobile');
    expect(perfProfileOf({ profile: 'c', refreshHz: 60 })).toBeNull();
  });
  it('writes a PerfReport-valid document; the worst cell per (subject, profile) wins', () => {
    const { report, grades } = run([blankA, blankB, mkResult({}), mkResult({ p95: 12 }), mkResult({ profile: 'b', hz: 60, p95: 30 }), mkResult({ profile: 'a', hz: 60, p95: 99 })]);
    expect(validatePerfReport(report)).toEqual([]);
    expect(report.subjects).toEqual([
      expect.objectContaining({ subject: 'Button', profile: 'desktop-120hz', grade: 'C' }),
      expect.objectContaining({ subject: 'Button', profile: 'mid-mobile', grade: 'D' }),
    ]);
    expect(grades.subjects[0]?.cells).toBe(2);
    expect(report.subjects[0]?.metrics.frameP95Ms).toBe(12);
    expect(grades.unmeasured).toEqual([]);
  });
  it('lists a required subject without cells as unmeasured; refuses mixed commits', () => {
    expect(run([blankA, mkResult({})]).grades.unmeasured).toEqual([{ subject: 'Button', profile: 'mid-mobile', tier: 'T1' }]);
    expect(() => gradeResults({ results: [doc([]), { ...doc([]), sha: 'e'.repeat(40) }], sources: [], tiers: new Map(), required: [], budgets, thresholds: t, thresholdsSha256: null }))
      .toThrow(/different commits/);
  });
  it('validatePerfReport rejects unknown keys, profiles and letters', () => {
    expect(validatePerfReport({ version: 1, sha: 'x', subjects: [{ subject: 'B', profile: 'a', metrics: {}, grade: 'E' }], extra: 1 })).toEqual([
      'unknown key extra', 'subjects[0].profile a', 'subjects[0].grade E']);
  });
});

describe('release gate', () => {
  const grades = (cells: PerfResultLike[], tiers: Array<[string, 'T1' | 'T2']>, tags?: string): PerfGrades => run([blankA, blankB, ...cells], tiers, tags).grades;
  const both = (o: Parameters<typeof mkResult>[0]) => [mkResult({ ...o }), mkResult({ ...o, profile: 'b', hz: 60 })];
  it('T1 at C passes, T1 at D fails', () => {
    expect(releaseGate(grades(both({ heap: 1.5 }), [['Button', 'T1']]), null, t).failures).toEqual([]);
    expect(releaseGate(grades(both({ heap: 3 }), [['Button', 'T1']]), null, t).failures).toEqual(['perf-grade-floor: Button (T1) grade D is below C']);
  });
  it('T2 at D passes, T2 at F fails', () => {
    expect(releaseGate(grades(both({ subject: 'Table', heap: 3 }), [['Table', 'T2']]), null, t).failures).toEqual([]);
    expect(releaseGate(grades(both({ subject: 'Table', heap: 6 }), [['Table', 'T2']]), null, t).failures).toEqual(['perf-grade-floor: Table (T2) grade F is below D']);
  });
  it('a drop of one letter vs the previous release on the same runner tag fails; another runner tag is not compared', () => {
    const prev = grades(both({}), [['Button', 'T1']]);
    const cur = grades(both({ heap: 0.75 }), [['Button', 'T1']]);
    expect(releaseGate(cur, prev, t).failures).toEqual([
      expect.stringMatching(/^perf-grade-drop: Button desktop-120hz A → B/), expect.stringMatching(/^perf-grade-drop: Button mid-mobile A → B/)]);
    const other = grades(both({}), [['Button', 'T1']], 'another-runner');
    const r = releaseGate(cur, other, t);
    expect(r.failures).toEqual([]);
    expect(r.notes[0]).toMatch(/not compared across runners/);
  });
  it('an unmeasured flagship fails at release', () => {
    expect(releaseGate(grades([mkResult({})], [['Button', 'T1']]), null, t).failures).toEqual(['perf-grade-unmeasured: Button (T1) has no graded mid-mobile cell']);
  });
});
