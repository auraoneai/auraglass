/* packages/qa/src/perf/budgets.ts — REQ-QUAL-38 runtime budget resolution (QUAL).

   Resolution order (QUAL PRD §4.6): QUAL default ceilings (`certification/thresholds.json#perf.ceilings`) → overridden
   only DOWNWARD by each owner's `fragments/perf-budgets/<stream>.ts` rows (`PerfBudgetRow`, S-44) → frozen at calibration
   (REQ-QUAL-39, tests/perf/qual/budgets-frozen.test.ts).

   A row looser than the default for its (profile, metric) is a `perf-budget-looser` failure. QUAL never raises a
   default to absorb a row; the owning stream tightens or deletes its row. Profile → pointer class:
   `desktop-120hz` = profile (a), (hover:hover) and (pointer:fine); `mid-mobile` = profile (b), (pointer:coarse).

   Pure module: no file system access except `loadPerfThresholds`. */
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { PerfBudgetRow } from '../../../../src/contracts/fragments.ts';
import type { PerfProfileId } from '../../../../src/contracts/testing.ts';

export const THRESHOLDS_FILE = 'certification/thresholds.json';
export const PERF_PROFILES: readonly PerfProfileId[] = ['desktop-120hz', 'mid-mobile'];
export const PERF_METRICS: readonly PerfBudgetRow['metric'][] = ['frame-p95-ms', 'long-tasks', 'blurred-surfaces', 'bci', 'lcp-ms', 'grade'];
export const GRADE_LETTERS = ['A', 'B', 'C', 'D', 'F'] as const;
export type Letter = (typeof GRADE_LETTERS)[number];
export type Pointer = 'fine' | 'coarse';
export const PROFILE_POINTER: Record<PerfProfileId, Pointer> = { 'desktop-120hz': 'fine', 'mid-mobile': 'coarse' };

type ByPointer = Record<Pointer, number>;
type Bounds4 = [number, number, number, number];

export interface PerfThresholds {
  ceilings: {
    blurredSurfaces: ByPointer; bci: ByPointer; effectiveNesting: { default: number; allowNested: number }; blurRadiusPx: number;
    fullViewportBlur: { layer: string; maxPx: number; minViewportShare: number };
    refractingSurfaces: ByPointer & { maxViewportShare: number }; liveWebglContexts: number; frameP95Ms: ByPointer;
    settledLongAnimationFrames: ByPointer; interactionLatencyP95Ms: ByPointer & { subjects: string[] }; heapDeltaMB: number;
    dashboardHeapAtRestMB: number; layoutsPerFrameDuringScroll: number; styleRecalcMsDuringScroll: ByPointer; dashboardRenderToStringMedianMs: number;
  };
  surfaceBudget: { viewports: Array<{ width: number; height: number; pointer: Pointer }>; scrollPositions: number[] };
  grades: {
    letters: Letter[]; frameP95Ms: Record<PerfProfileId, Bounds4>; longAnimationFrames: Bounds4; settledIdle: Bounds4; heapDeltaMB: Bounds4;
    bytesVsRow: Bounds4; bciVsBudget: { T1: Bounds4; T2: Bounds4 }; releaseFloor: { T1: Letter; T2: Letter }; maxDropLetters: number;
  };
  ratchet: { p95RegressionRatio: number; p95RegressionMinMs: number; perSubjectSeconds: number; perSubjectSecondsSource: string; targetMinutes: number; sentinel: string };
  regression4x: { minFps: number; minBlankRatio: number; libraryLongTaskMs: number; showcases: string[] };
  calibration: { seedFreeSubjects: string[]; raiseFactor: number; bytesRoundTo: number; marker: string };
}

const isNum = (v: unknown): v is number => typeof v === 'number' && Number.isFinite(v);
const isLetter = (v: unknown): v is Letter => typeof v === 'string' && (GRADE_LETTERS as readonly string[]).includes(v);

/** Validates `thresholds.json#perf`; throws listing every missing or mistyped key (a gate never falls back to a built-in number). */
export function parsePerfThresholds(raw: unknown, file = THRESHOLDS_FILE): PerfThresholds {
  const errors: string[] = [];
  const perf = (raw as { perf?: unknown } | null)?.perf as Record<string, any> | undefined;
  if (!perf || typeof perf !== 'object') throw new Error(`${file}: perf section missing`);
  const num = (path: string) => {
    const v = path.split('.').reduce<any>((o, k) => (o == null ? undefined : o[k]), perf);
    if (!isNum(v)) errors.push(`perf.${path} must be a number`);
  };
  const bounds = (path: string) => {
    const v = path.split('.').reduce<any>((o, k) => (o == null ? undefined : o[k]), perf);
    if (!Array.isArray(v) || v.length !== 4 || !v.every(isNum)) { errors.push(`perf.${path} must be 4 numbers (A..D upper bounds)`); return; }
    const nums = v as number[];
    for (let i = 1; i < 4; i++) if ((nums[i] as number) < (nums[i - 1] as number)) errors.push(`perf.${path} must be non-decreasing`);
  };
  for (const p of ['blurredSurfaces', 'bci', 'refractingSurfaces', 'frameP95Ms', 'settledLongAnimationFrames', 'interactionLatencyP95Ms', 'styleRecalcMsDuringScroll']) {
    num(`ceilings.${p}.fine`); num(`ceilings.${p}.coarse`);
  }
  for (const p of ['effectiveNesting.default', 'effectiveNesting.allowNested', 'blurRadiusPx', 'fullViewportBlur.maxPx', 'fullViewportBlur.minViewportShare',
    'refractingSurfaces.maxViewportShare', 'liveWebglContexts', 'heapDeltaMB', 'dashboardHeapAtRestMB', 'layoutsPerFrameDuringScroll', 'dashboardRenderToStringMedianMs']) num(`ceilings.${p}`);
  if (typeof perf.ceilings?.fullViewportBlur?.layer !== 'string') errors.push('perf.ceilings.fullViewportBlur.layer must be a string');
  if (!Array.isArray(perf.ceilings?.interactionLatencyP95Ms?.subjects)) errors.push('perf.ceilings.interactionLatencyP95Ms.subjects must be an array');
  const vps = perf.surfaceBudget?.viewports;
  if (!Array.isArray(vps) || !vps.length || !vps.every((v: any) => isNum(v?.width) && isNum(v?.height) && (v?.pointer === 'fine' || v?.pointer === 'coarse'))) {
    errors.push('perf.surfaceBudget.viewports must be [{width, height, pointer: fine|coarse}]');
  }
  const sp = perf.surfaceBudget?.scrollPositions;
  if (!Array.isArray(sp) || !sp.length || !sp.every((x: unknown) => isNum(x) && x >= 0 && x <= 1)) errors.push('perf.surfaceBudget.scrollPositions must be fractions in [0, 1]');
  const letters = perf.grades?.letters;
  if (!Array.isArray(letters) || letters.join() !== GRADE_LETTERS.join()) errors.push(`perf.grades.letters must be ${GRADE_LETTERS.join(',')}`);
  for (const p of PERF_PROFILES) bounds(`grades.frameP95Ms.${p}`);
  for (const p of ['longAnimationFrames', 'settledIdle', 'heapDeltaMB', 'bytesVsRow', 'bciVsBudget.T1', 'bciVsBudget.T2']) bounds(`grades.${p}`);
  if (!isLetter(perf.grades?.releaseFloor?.T1) || !isLetter(perf.grades?.releaseFloor?.T2)) errors.push('perf.grades.releaseFloor.{T1,T2} must be letters');
  num('grades.maxDropLetters');
  for (const p of ['p95RegressionRatio', 'p95RegressionMinMs', 'perSubjectSeconds', 'targetMinutes']) num(`ratchet.${p}`);
  if (typeof perf.ratchet?.sentinel !== 'string' || !perf.ratchet.sentinel) errors.push('perf.ratchet.sentinel must be a subject name');
  for (const p of ['minFps', 'minBlankRatio', 'libraryLongTaskMs']) num(`regression4x.${p}`);
  if (!Array.isArray(perf.regression4x?.showcases)) errors.push('perf.regression4x.showcases must be an array');
  if (!Array.isArray(perf.calibration?.seedFreeSubjects) || !perf.calibration.seedFreeSubjects.length) errors.push('perf.calibration.seedFreeSubjects must be a non-empty array');
  num('calibration.raiseFactor'); num('calibration.bytesRoundTo');
  if (typeof perf.calibration?.marker !== 'string') errors.push('perf.calibration.marker must be a string');
  if (errors.length) throw new Error(`${file}: ${errors.join('; ')}`);
  return perf as PerfThresholds;
}

export function loadPerfThresholds(root: string): { perf: PerfThresholds; sha256: string } {
  const buf = readFileSync(join(root, THRESHOLDS_FILE));
  return { perf: parsePerfThresholds(JSON.parse(buf.toString('utf8'))), sha256: createHash('sha256').update(buf).digest('hex') };
}

/** QUAL default for a PerfBudgetRow (profile, metric). `null` = QUAL has no default ceiling for that metric (`lcp-ms`):
    the owner row is the only budget and is enforced as registered. Grades: the default floor is the T1 release floor. */
export function defaultFor(t: PerfThresholds, profile: PerfProfileId, metric: PerfBudgetRow['metric']): number | Letter | null {
  const ptr = PROFILE_POINTER[profile];
  switch (metric) {
    case 'frame-p95-ms': return t.ceilings.frameP95Ms[ptr];
    case 'long-tasks': return t.ceilings.settledLongAnimationFrames[ptr];
    case 'blurred-surfaces': return t.ceilings.blurredSurfaces[ptr];
    case 'bci': return t.ceilings.bci[ptr];
    case 'grade': return t.grades.releaseFloor.T1;
    case 'lcp-ms': return null;
  }
}

/** Letter order: A best (0) … F worst (4). */
export const letterRank = (l: Letter): number => GRADE_LETTERS.indexOf(l);

export interface FragmentFile { stream: string; file: string; value: unknown }
export interface ResolvedBudget {
  subject: string; profile: PerfProfileId; metric: PerfBudgetRow['metric']; max: number | Letter;
  default: number | Letter | null; stream: string; file: string; provisional: boolean;
}
export interface LooserRow { stream: string; file: string; subject: string; profile: PerfProfileId; metric: PerfBudgetRow['metric']; max: number | string; default: number | string }
export interface MalformedRow { stream: string; file: string; index: number; row: unknown; errors: string[] }
export interface Resolution {
  defaults: Record<PerfProfileId, Record<PerfBudgetRow['metric'], number | Letter | null>>;
  rows: ResolvedBudget[]; looser: LooserRow[]; malformed: MalformedRow[];
  /** same (subject, profile, metric) registered more than once: the tightest value wins; listed so the owner can dedupe */
  duplicates: Array<{ key: string; kept: number | string; dropped: Array<number | string>; files: string[] }>;
}

export const budgetKey = (subject: string, profile: string, metric: string): string => `${subject}|${profile}|${metric}`;

/** Shape check of one row against PerfBudgetRow (S-44). */
export function rowErrors(r: unknown): string[] {
  const e: string[] = [];
  if (!r || typeof r !== 'object') return ['row is not an object'];
  const o = r as Record<string, unknown>;
  if (typeof o.subject !== 'string' || !o.subject) e.push('subject must be a non-empty string');
  if (!(PERF_PROFILES as readonly unknown[]).includes(o.profile)) e.push(`profile must be ${PERF_PROFILES.join('|')}`);
  if (!(PERF_METRICS as readonly unknown[]).includes(o.metric)) e.push(`metric must be ${PERF_METRICS.join('|')}`);
  if (typeof o.provisional !== 'boolean') e.push('provisional must be a boolean');
  if (o.metric === 'grade') { if (!(o.max === 'A' || o.max === 'B' || o.max === 'C')) e.push("grade max must be 'A'|'B'|'C'"); }
  else if (!isNum(o.max) || (o.max as number) < 0) e.push('max must be a finite number ≥ 0');
  for (const k of Object.keys(o)) if (!['subject', 'profile', 'metric', 'max', 'provisional'].includes(k)) e.push(`unknown key ${k}`);
  return e;
}

/** true when `max` permits more than `def` (numbers: larger; letters: a worse letter). */
export function isLooser(max: number | string, def: number | string | null): boolean {
  if (def === null) return false;
  if (typeof def === 'string') return isLetter(max) && letterRank(max) > letterRank(def as Letter);
  return typeof max === 'number' && max > def;
}

const tighter = (a: number | Letter, b: number | Letter): number | Letter =>
  (typeof a === 'string' ? (letterRank(a) <= letterRank(b as Letter) ? a : b) : Math.min(a, b as number));

export function resolveBudgets(t: PerfThresholds, fragments: readonly FragmentFile[]): Resolution {
  const defaults = Object.fromEntries(PERF_PROFILES.map((p) => [p, Object.fromEntries(PERF_METRICS.map((m) => [m, defaultFor(t, p, m)]))])) as Resolution['defaults'];
  const byKey = new Map<string, ResolvedBudget>();
  const dupes = new Map<string, Resolution['duplicates'][number]>();
  const looser: LooserRow[] = []; const malformed: MalformedRow[] = [];
  for (const f of fragments) {
    if (!Array.isArray(f.value)) { malformed.push({ stream: f.stream, file: f.file, index: -1, row: f.value, errors: ['default export is not an array'] }); continue; }
    f.value.forEach((r: unknown, index: number) => {
      const errs = rowErrors(r);
      if (errs.length) { malformed.push({ stream: f.stream, file: f.file, index, row: r, errors: errs }); return; }
      const row = r as PerfBudgetRow;
      const def = defaults[row.profile][row.metric];
      if (isLooser(row.max, def)) looser.push({ stream: f.stream, file: f.file, subject: row.subject, profile: row.profile, metric: row.metric, max: row.max, default: def as number | string });
      const key = budgetKey(row.subject, row.profile, row.metric);
      const cur = byKey.get(key);
      const max = row.max as number | Letter;
      if (cur) {
        const kept = tighter(cur.max, max);
        const d = dupes.get(key) ?? { key, kept, dropped: [], files: [cur.file] };
        d.dropped.push(kept === cur.max ? max : cur.max); d.kept = kept; d.files.push(f.file);
        dupes.set(key, d);
        if (kept !== cur.max) byKey.set(key, { ...cur, max: kept, stream: f.stream, file: f.file, provisional: row.provisional });
        return;
      }
      // A looser row never widens the budget: the effective value is min(row, default) while the row stays a failure.
      const effective = def === null ? max : isLooser(max, def) ? (def as number | Letter) : max;
      byKey.set(key, { subject: row.subject, profile: row.profile, metric: row.metric, max: effective, default: def, stream: f.stream, file: f.file, provisional: row.provisional });
    });
  }
  return { defaults, rows: [...byKey.values()].sort((a, b) => budgetKey(a.subject, a.profile, a.metric).localeCompare(budgetKey(b.subject, b.profile, b.metric))),
    looser, malformed, duplicates: [...dupes.values()] };
}

/** Effective budget for a subject: the owner row (matched by story id first, then subject name), else the default. */
export function budgetFor(res: Pick<Resolution, 'rows' | 'defaults'>, ids: readonly string[], profile: PerfProfileId, metric: PerfBudgetRow['metric']): number | Letter | null {
  for (const id of ids) {
    const row = res.rows.find((r) => r.subject === id && r.profile === profile && r.metric === metric);
    if (row) return row.max;
  }
  return res.defaults[profile][metric];
}

/* ---------------------------------------------------------------- expiring baseline (PRD-F §4.3 rule 3) */

const OWNER: Record<string, string> = { plat: 'PLAT', mat: 'MAT', cmp: 'CMP', surf: 'SURF', qual: 'QUAL' };
export interface LooserBaselineRow { file: string; owner: string; reqFin: string; expires: 'RC-1'; subject: string; profile: string; metric: string }

export const looserKey = (r: { file: string; subject: string; profile: string; metric: string }): string => `${r.file}|${r.subject}|${r.profile}|${r.metric}`;

export function isLooserBaselineRow(r: unknown): r is LooserBaselineRow {
  if (!r || typeof r !== 'object') return false;
  const o = r as Record<string, unknown>;
  return typeof o.file === 'string' && /^fragments\/perf-budgets\/[a-z]+\.(ts|json)$/.test(o.file) && Object.values(OWNER).includes(o.owner as string)
    && typeof o.reqFin === 'string' && /^REQ-FIN-\d+$/.test(o.reqFin) && o.expires === 'RC-1'
    && typeof o.subject === 'string' && (PERF_PROFILES as readonly unknown[]).includes(o.profile) && (PERF_METRICS as readonly unknown[]).includes(o.metric)
    && Object.keys(o).every((k) => ['file', 'owner', 'reqFin', 'expires', 'subject', 'profile', 'metric'].includes(k));
}

/** Shrink-only: fails on a new offender, a stale row (offence gone), a malformed row, a row whose owner is not the file's
    stream, and on every row at release scope (RC-1). */
export function checkLooserBaseline(rows: unknown[], looser: readonly LooserRow[], relFile: (abs: string) => string, scope: string): string[] {
  const out: string[] = [];
  const valid = rows.filter(isLooserBaselineRow);
  for (const r of rows) if (!isLooserBaselineRow(r)) out.push(`perf-budget-looser baseline: malformed row ${JSON.stringify(r)}`);
  for (const r of valid) {
    const stream = /fragments\/perf-budgets\/([a-z]+)\./.exec(r.file)?.[1] ?? '';
    if (OWNER[stream] !== r.owner) out.push(`perf-budget-looser baseline: row owner ${r.owner} does not own ${r.file}`);
  }
  const rowKeys = new Set(valid.map(looserKey));
  const offKeys = new Set(looser.map((l) => looserKey({ ...l, file: relFile(l.file) })));
  for (const l of looser) {
    if (!rowKeys.has(looserKey({ ...l, file: relFile(l.file) }))) {
      out.push(`perf-budget-looser: ${relFile(l.file)} ${l.subject} ${l.profile} ${l.metric} max ${l.max} is looser than the QUAL default ${l.default} `
        + `(owner ${OWNER[l.stream] ?? l.stream} tightens or deletes the row; QUAL never raises the default)`);
    }
  }
  for (const r of valid) if (!offKeys.has(looserKey(r))) out.push(`perf-budget-looser baseline: stale row ${JSON.stringify(r)} — the row is no longer looser, delete the baseline row`);
  if (scope === 'release') for (const r of valid) out.push(`perf-budget-looser baseline: row expired at RC-1 ${JSON.stringify(r)}`);
  return out;
}
