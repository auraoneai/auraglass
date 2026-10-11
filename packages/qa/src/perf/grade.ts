/* packages/qa/src/perf/grade.ts — REQ-QUAL-37 perf grades + PerfReport (QUAL). CLI: scripts/qual/perf/grade.mjs.

   Grades every flagship and T2 subject from its worst cell over profile (a) at 120 Hz (`desktop-120hz`) and profile (b)
   (`mid-mobile`), standard tier, `photo` scene. Columns (QUAL PRD §5.7 table, bounds in thresholds.json#perf.grades):

     column               value                                                          A      B      C      D
     frame p95            settled-window presented-frame p95, absolute (ms)             ≤8.3   ≤11    ≤16.7  ≤25   (a@120)
                                                                                         ≤16.7  ≤20    ≤25    ≤33   (b)
     long-anim frames     LoAF >100 ms in the 5 s settled window, delta vs blank (≥0)   0      0      ≤1     ≤3
     settled idle         rAF requests in quiet + pending rAF + intervals + ∞ anims      0      0      0      0
     heap delta           10 mount/unmount cycles, MB (2^20 B; a heap shrink counts 0)   ≤0.5   ≤1     ≤2     ≤5
     bytes vs row         min+gzip bytes / SizeBudgetRow.limitBytes                       ≤80%   ≤100%  ≤100%  ≤100%
     BCI vs budget        BCI / resolved bci budget                                      ≤50%   ≤75%   ≤100%  ≤100% T1, ≤150% T2

   The lowest column wins. F: worse than D in any column, no SizeBudgetRow for the subject, or a column whose metric is
   missing (fail closed — a missing measurement never grades better than F).

   Release gate: any T1 subject below C, any T2 below D, or a drop of ≥1 letter vs the previous release's
   perf-grades.json on the same runner tag fails. Different runner tags are not compared (reported). */
import type { PerfReport, PerfProfileId } from '../../../../src/contracts/testing.ts';
import { GRADE_LETTERS, letterRank, budgetFor, type Letter, type PerfThresholds, type Resolution } from './budgets.ts';

export type Tier = 'T0' | 'T1' | 'T2' | 'preview';
export type Column = 'framePeriod' | 'longAnimationFrames' | 'settledIdle' | 'heapDelta' | 'bytes' | 'bci';
export const COLUMNS: readonly Column[] = ['framePeriod', 'longAnimationFrames', 'settledIdle', 'heapDelta', 'bytes', 'bci'];

/* ---- minimal structural view of tests/perf/harness/perf-results.schema.json (G-20) ---- */
export interface PerfWindowLike {
  durationMs: number;
  frames: { count: number; p50Ms: number | null; p95Ms: number | null };
  longTasks: { count: number; totalMs: number; maxMs: number } | null;
  loaf: { count: number; over100ms: number; maxMs: number } | null;
}
export interface PerfResultLike {
  subject: string; storyId: string; kind: 'fixture' | 'flagship'; owner: string | null; profile: 'a' | 'b' | 'c' | 'd';
  engine: string; refreshHz: number; tier: string; scene: string; status: 'pass' | 'fail'; failures: Array<{ code: string; detail: string }>;
  windows: { transition: PerfWindowLike | null; settled: PerfWindowLike | null };
  gpu: { blurredSurfaces: number; bci: number } | null;
  heap: { deltaBytes: number } | null;
  idle: { rafRequestsInQuiet: number; pendingRaf: number; intervals: number; infiniteAnimations: number } | null;
  bytes: { limitBytes: number; minGzipBytes: number } | null;
  bytesNote: string | null;
}
export interface PerfResultsLike { sha: string; scope: string; runner: { tags: string | null; jobUrl: string | null }; results: PerfResultLike[] }

export const BLANK_STORY_ID = 'perf-harness-blank--default';
const MB = 1024 * 1024;

/** perf-results cell → PerfProfileId, or null when the cell is not graded (profiles c/d, a@60 Hz). */
export function perfProfileOf(r: Pick<PerfResultLike, 'profile' | 'refreshHz'>): PerfProfileId | null {
  if (r.profile === 'a' && r.refreshHz === 120) return 'desktop-120hz';
  if (r.profile === 'b') return 'mid-mobile';
  return null;
}

/** Metrics written to PerfReport (numbers only; a metric that was not measured is omitted, never invented). */
export interface CellMetrics {
  frameP95Ms: number | null; transitionFrameP95Ms: number | null; longAnimationFrames: number | null; settledIdle: number | null;
  heapDeltaMB: number | null; bytesRatio: number | null; hasSizeRow: boolean; bci: number | null; blurredSurfaces: number | null;
}

/** Extracts the graded metrics of one cell; `blank` is the blank-fixture cell of the same run (profile, engine, Hz, scene). */
export function cellMetrics(r: PerfResultLike, blank: PerfResultLike | null): CellMetrics {
  const s = r.windows.settled;
  const loaf = s?.loaf ? s.loaf.over100ms : null;
  const blankLoaf = blank?.windows.settled?.loaf ? blank.windows.settled.loaf.over100ms : null;
  const hasSizeRow = !!r.bytes || (r.bytesNote !== null && r.bytesNote !== 'no SizeBudgetRow for this subject');
  return {
    frameP95Ms: s?.frames.p95Ms ?? null,
    transitionFrameP95Ms: r.windows.transition?.frames.p95Ms ?? null,
    longAnimationFrames: loaf === null || blankLoaf === null ? null : Math.max(0, loaf - blankLoaf),
    settledIdle: r.idle ? r.idle.rafRequestsInQuiet + r.idle.pendingRaf + r.idle.intervals + r.idle.infiniteAnimations : null,
    heapDeltaMB: r.heap ? Math.max(0, r.heap.deltaBytes) / MB : null,
    bytesRatio: r.bytes && r.bytes.limitBytes > 0 ? r.bytes.minGzipBytes / r.bytes.limitBytes : null,
    hasSizeRow,
    bci: r.gpu ? r.gpu.bci : null,
    blurredSurfaces: r.gpu ? r.gpu.blurredSurfaces : null,
  };
}

/** Letter for a value against A..D upper bounds (inclusive). null → F. */
export function letterFor(value: number | null, bounds: readonly number[]): Letter {
  if (value === null || !Number.isFinite(value)) return 'F';
  for (let i = 0; i < 4; i++) if (value <= (bounds[i] as number)) return GRADE_LETTERS[i] as Letter;
  return 'F';
}

export const worst = (letters: readonly Letter[]): Letter => letters.reduce<Letter>((w, l) => (letterRank(l) > letterRank(w) ? l : w), 'A');

export interface CellGrade { grade: Letter; columns: Record<Column, Letter>; reasons: string[] }

/** Grades one cell. `bciBudget` is the resolved `bci` budget for the subject/profile. */
export function gradeCell(m: CellMetrics, ctx: { profile: PerfProfileId; tier: Tier | null; bciBudget: number | null }, t: PerfThresholds): CellGrade {
  const g = t.grades;
  const tierKey = ctx.tier === 'T2' ? 'T2' : 'T1';
  const bciRatio = m.bci === null || ctx.bciBudget === null || !(ctx.bciBudget > 0) ? null : m.bci / ctx.bciBudget;
  const columns: Record<Column, Letter> = {
    framePeriod: letterFor(m.frameP95Ms, g.frameP95Ms[ctx.profile]),
    longAnimationFrames: letterFor(m.longAnimationFrames, g.longAnimationFrames),
    settledIdle: letterFor(m.settledIdle, g.settledIdle),
    heapDelta: letterFor(m.heapDeltaMB, g.heapDeltaMB),
    bytes: m.hasSizeRow ? letterFor(m.bytesRatio, g.bytesVsRow) : 'F',
    bci: letterFor(bciRatio, g.bciVsBudget[tierKey]),
  };
  const reasons: string[] = [];
  const missing: Array<[Column, unknown]> = [['framePeriod', m.frameP95Ms], ['longAnimationFrames', m.longAnimationFrames], ['settledIdle', m.settledIdle],
    ['heapDelta', m.heapDeltaMB], ['bci', bciRatio]];
  for (const [c, v] of missing) if (v === null) reasons.push(`${c}: metric missing`);
  if (!m.hasSizeRow) reasons.push('bytes: no SizeBudgetRow for the subject');
  else if (m.bytesRatio === null) reasons.push('bytes: bundle not measured');
  const grade = worst(COLUMNS.map((c) => columns[c]));
  for (const c of COLUMNS) if (columns[c] === grade && grade !== 'A') reasons.push(`limited by ${c}`);
  return { grade, columns, reasons };
}

/* ---------------------------------------------------------------- report */

export interface SubjectGrade {
  subject: string; storyId: string; owner: string | null; tier: Tier | null; profile: PerfProfileId; grade: Letter;
  columns: Record<Column, Letter>; reasons: string[]; metrics: Record<string, number>; cells: number; harnessFailures: string[];
}
export interface PerfGrades {
  version: 1; sha: string; scope: string; runnerTag: string | null; sources: string[]; thresholdsSha256: string | null;
  subjects: SubjectGrade[];
  /** flagship/T2 subjects with no graded cell for a profile (fail closed at release) */
  unmeasured: Array<{ subject: string; profile: PerfProfileId; tier: Tier | null }>;
}

const metricsRecord = (m: CellMetrics, bciBudget: number | null): Record<string, number> => {
  const out: Record<string, number> = {};
  const put = (k: string, v: number | null) => { if (v !== null && Number.isFinite(v)) out[k] = v; };
  put('frameP95Ms', m.frameP95Ms); put('transitionFrameP95Ms', m.transitionFrameP95Ms); put('longAnimationFrames', m.longAnimationFrames);
  put('settledIdle', m.settledIdle); put('heapDeltaMB', m.heapDeltaMB); put('bytesRatio', m.bytesRatio); put('bci', m.bci);
  put('bciBudget', bciBudget); put('blurredSurfaces', m.blurredSurfaces);
  return out;
};

export interface GradeInput {
  results: readonly PerfResultsLike[];
  sources: readonly string[];
  /** ComponentMeta tier by subject name (src/**\/*.meta.ts) */
  tiers: ReadonlyMap<string, Tier>;
  /** subjects that must be graded (flagships + T2 metas); missing ones are listed as unmeasured */
  required: ReadonlyArray<{ subject: string; tier: Tier | null }>;
  budgets: Pick<Resolution, 'rows' | 'defaults'>;
  thresholds: PerfThresholds;
  thresholdsSha256: string | null;
}

/** Grades every graded cell; per (subject, profile) the worst cell wins. */
export function gradeResults(input: GradeInput): { report: PerfReport; grades: PerfGrades } {
  const t = input.thresholds;
  const sha = input.results[0]?.sha ?? 'unknown';
  const shas = new Set(input.results.map((d) => d.sha));
  if (shas.size > 1) throw new Error(`perf-results from different commits cannot be graded together: ${[...shas].join(', ')}`);
  const tags = new Set(input.results.map((d) => d.runner.tags ?? ''));
  const best = new Map<string, SubjectGrade>();
  for (const doc of input.results) {
    const blanks = doc.results.filter((r) => r.storyId === BLANK_STORY_ID);
    for (const r of doc.results) {
      if (r.kind === 'fixture') continue;
      const profile = perfProfileOf(r);
      if (!profile || r.tier !== 'standard' || r.scene !== 'photo') continue;
      const blank = blanks.find((b) => b.profile === r.profile && b.engine === r.engine && b.refreshHz === r.refreshHz && b.scene === r.scene) ?? null;
      const tier = input.tiers.get(r.subject) ?? null;
      const ids = [r.storyId, r.subject];
      const bciBudgetRaw = budgetFor(input.budgets, ids, profile, 'bci');
      const bciBudget = typeof bciBudgetRaw === 'number' ? bciBudgetRaw : null;
      const m = cellMetrics(r, blank);
      const cg = gradeCell(m, { profile, tier, bciBudget }, t);
      const harnessFailures = r.failures.map((f) => f.code);
      if (!blank) cg.reasons.push('no blank baseline in the same run (long-animation-frame delta missing)');
      const key = `${r.subject}|${profile}`;
      const cur = best.get(key);
      const entry: SubjectGrade = { subject: r.subject, storyId: r.storyId, owner: r.owner, tier, profile, grade: cg.grade, columns: cg.columns,
        reasons: cg.reasons, metrics: metricsRecord(m, bciBudget), cells: (cur?.cells ?? 0) + 1, harnessFailures };
      if (!cur || letterRank(entry.grade) > letterRank(cur.grade)) best.set(key, entry);
      else cur.cells = entry.cells;
    }
  }
  const subjects = [...best.values()].sort((a, b) => `${a.subject}|${a.profile}`.localeCompare(`${b.subject}|${b.profile}`));
  const unmeasured: PerfGrades['unmeasured'] = [];
  for (const req of input.required) for (const profile of ['desktop-120hz', 'mid-mobile'] as const) {
    if (!best.has(`${req.subject}|${profile}`)) unmeasured.push({ subject: req.subject, profile, tier: req.tier });
  }
  const report: PerfReport = { version: 1, sha, subjects: subjects.map((s) => ({ subject: s.subject, profile: s.profile, metrics: s.metrics, grade: s.grade })) };
  const grades: PerfGrades = { version: 1, sha, scope: input.results[0]?.scope ?? 'unknown', runnerTag: tags.size === 1 ? ([...tags][0] || null) : [...tags].sort().join(' + '),
    sources: [...input.sources], thresholdsSha256: input.thresholdsSha256, subjects, unmeasured };
  return { report, grades };
}

/** Structural validation of a PerfReport (S-55): exact keys, PerfProfileId values, letters, numeric metrics. */
export function validatePerfReport(doc: unknown): string[] {
  const e: string[] = [];
  const o = doc as Record<string, unknown> | null;
  if (!o || typeof o !== 'object') return ['not an object'];
  for (const k of Object.keys(o)) if (!['version', 'sha', 'subjects'].includes(k)) e.push(`unknown key ${k}`);
  if (o.version !== 1) e.push('version must be 1');
  if (typeof o.sha !== 'string' || !o.sha) e.push('sha must be a non-empty string');
  if (!Array.isArray(o.subjects)) return [...e, 'subjects must be an array'];
  o.subjects.forEach((s: any, i: number) => {
    if (!s || typeof s !== 'object') { e.push(`subjects[${i}] not an object`); return; }
    for (const k of Object.keys(s)) if (!['subject', 'profile', 'metrics', 'grade'].includes(k)) e.push(`subjects[${i}] unknown key ${k}`);
    if (typeof s.subject !== 'string' || !s.subject) e.push(`subjects[${i}].subject`);
    if (s.profile !== 'desktop-120hz' && s.profile !== 'mid-mobile') e.push(`subjects[${i}].profile ${s.profile}`);
    if (!(GRADE_LETTERS as readonly string[]).includes(s.grade)) e.push(`subjects[${i}].grade ${s.grade}`);
    if (!s.metrics || typeof s.metrics !== 'object' || !Object.values(s.metrics).every((v) => typeof v === 'number' && Number.isFinite(v))) e.push(`subjects[${i}].metrics must be Record<string, number>`);
  });
  return e;
}

/* ---------------------------------------------------------------- release gate */

export interface GateResult { failures: string[]; notes: string[] }

/** Overall subject letter = worst over its profiles. */
export function overallBySubject(subjects: readonly SubjectGrade[]): Map<string, { grade: Letter; tier: Tier | null }> {
  const m = new Map<string, { grade: Letter; tier: Tier | null }>();
  for (const s of subjects) {
    const cur = m.get(s.subject);
    m.set(s.subject, { grade: cur ? worst([cur.grade, s.grade]) : s.grade, tier: s.tier });
  }
  return m;
}

/** Release gate (REQ-QUAL-37). `previous` = the previous release's perf-grades.json (null = no previous 5.x release). */
export function releaseGate(cur: PerfGrades, previous: PerfGrades | null, t: PerfThresholds): GateResult {
  const failures: string[] = []; const notes: string[] = [];
  const floor = t.grades.releaseFloor;
  for (const [subject, { grade, tier }] of overallBySubject(cur.subjects)) {
    const tierKey = tier === 'T2' ? 'T2' : 'T1';
    if (letterRank(grade) > letterRank(floor[tierKey])) failures.push(`perf-grade-floor: ${subject} (${tier ?? 'no meta tier, gated as T1'}) grade ${grade} is below ${floor[tierKey]}`);
  }
  for (const u of cur.unmeasured) failures.push(`perf-grade-unmeasured: ${u.subject} (${u.tier ?? 'flagship'}) has no graded ${u.profile} cell`);
  if (!previous) { notes.push('no previous release perf-grades.json: letter-drop check not applicable'); return { failures, notes }; }
  if ((previous.runnerTag ?? '') !== (cur.runnerTag ?? '')) {
    notes.push(`previous release ${previous.sha} ran on runner tag '${previous.runnerTag}', this run on '${cur.runnerTag}': letters are not compared across runners`);
    return { failures, notes };
  }
  const prev = new Map(previous.subjects.map((s) => [`${s.subject}|${s.profile}`, s.grade]));
  for (const s of cur.subjects) {
    const p = prev.get(`${s.subject}|${s.profile}`);
    if (!p) continue;
    const drop = letterRank(s.grade) - letterRank(p);
    if (drop > t.grades.maxDropLetters) failures.push(`perf-grade-drop: ${s.subject} ${s.profile} ${p} → ${s.grade} vs previous release ${previous.sha}`);
  }
  return { failures, notes };
}
