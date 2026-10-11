/* packages/qa/src/perf/ratchet.ts — REQ-QUAL-40 PR frame-time ratchet (QUAL). Used by tests/perf/qual/pr-ratchet.spec.ts
   and scripts/qual/perf/affected.mjs.

   Profile (a) only (`desktop-120hz` PerfReport rows). For every affected subject present in both the merge-base
   main-scope perf-report.json and the PR head report:
     - p95 frame time may not regress by more than max(ratio × base, minMs) (10 %, 1 ms), compared per window kind
       (settled vs settled, transition vs transition) — a window present on one side only is not compared (like windows only);
     - blurred-surface count and BCI may not increase at all.
   A subject absent from the base report is reported `new` (not compared); an affected subject absent from the head report
   is a failure (the PR did not measure it). Pool size of qual:certify:l10-gpu = ceil(subjects × perSubjectSeconds ÷ 600). */
import type { PerfReport } from '../../../../src/contracts/testing.ts';
import type { PerfThresholds } from './budgets.ts';

export interface RatchetFinding { subject: string; metric: string; base: number; head: number; limit: number; detail: string }
export interface RatchetResult { regressions: RatchetFinding[]; compared: string[]; newSubjects: string[]; missingInHead: string[] }

const WINDOWS = [['frameP95Ms', 'settled'], ['transitionFrameP95Ms', 'transition']] as const;
const BCI_EPSILON = 1e-6;

export function p95Limit(base: number, t: PerfThresholds['ratchet']): number {
  return base + Math.max(base * t.p95RegressionRatio, t.p95RegressionMinMs);
}

export function compareRatchet(base: PerfReport, head: PerfReport, affected: readonly string[] | null, t: PerfThresholds['ratchet']): RatchetResult {
  const pick = (r: PerfReport) => new Map(r.subjects.filter((s) => s.profile === 'desktop-120hz').map((s) => [s.subject, s.metrics]));
  const b = pick(base); const h = pick(head);
  const subjects = affected ?? [...h.keys()];
  const out: RatchetResult = { regressions: [], compared: [], newSubjects: [], missingInHead: [] };
  for (const subject of subjects) {
    const hm = h.get(subject);
    if (!hm) { out.missingInHead.push(subject); continue; }
    const bm = b.get(subject);
    if (!bm) { out.newSubjects.push(subject); continue; }
    out.compared.push(subject);
    for (const [metric, kind] of WINDOWS) {
      const bv = bm[metric]; const hv = hm[metric];
      if (typeof bv !== 'number' || typeof hv !== 'number') continue;
      const limit = p95Limit(bv, t);
      if (hv > limit) out.regressions.push({ subject, metric, base: bv, head: hv, limit,
        detail: `${kind} p95 ${hv.toFixed(2)} ms > ${limit.toFixed(2)} ms (base ${bv.toFixed(2)} ms + max(${t.p95RegressionRatio * 100}%, ${t.p95RegressionMinMs} ms))` });
    }
    for (const metric of ['blurredSurfaces', 'bci'] as const) {
      const bv = bm[metric]; const hv = hm[metric];
      if (typeof bv !== 'number' || typeof hv !== 'number') {
        if (typeof bv === 'number' && typeof hv !== 'number') out.regressions.push({ subject, metric, base: bv, head: Number.NaN, limit: bv, detail: `${metric} not measured at head` });
        continue;
      }
      if (hv > bv + (metric === 'bci' ? BCI_EPSILON : 0)) out.regressions.push({ subject, metric, base: bv, head: hv, limit: bv, detail: `${metric} increased ${bv} → ${hv}` });
    }
  }
  return out;
}

/** GitLab `parallel:` for qual:certify:l10-gpu so the affected set finishes in ≤ targetMinutes. */
export function poolSize(subjects: number, t: PerfThresholds['ratchet']): number {
  return Math.max(1, Math.ceil((subjects * t.perSubjectSeconds) / (t.targetMinutes * 60)));
}

/** Round-robin shard (CI_NODE_INDEX is 1-based). */
export function shardOf<T>(items: readonly T[], index: number, total: number): T[] {
  if (!(total >= 1) || !(index >= 1 && index <= total)) throw new Error(`invalid shard ${index}/${total}`);
  return items.filter((_, i) => i % total === index - 1);
}

/* ---------------------------------------------------------------- affected subjects from the import graph */

export interface ImportGraph { /** file → files it imports (repo-relative) */ edges: ReadonlyMap<string, readonly string[]> }

/** Files that (transitively) import any of `changed` — reverse reachability over the import graph, including `changed`. */
export function dependents(graph: ImportGraph, changed: readonly string[]): Set<string> {
  const rev = new Map<string, string[]>();
  for (const [from, tos] of graph.edges) for (const to of tos) { const a = rev.get(to) ?? []; a.push(from); rev.set(to, a); }
  const seen = new Set<string>(changed);
  const queue = [...changed];
  while (queue.length) {
    const f = queue.pop() as string;
    for (const d of rev.get(f) ?? []) if (!seen.has(d)) { seen.add(d); queue.push(d); }
  }
  return seen;
}

/** Affected flagships: a flagship is affected when any file in its component directory is in `dependents(changed)`;
    the sentinel is always included (runner drift check). Sorted, unique. */
export function affectedFlagships(graph: ImportGraph, changed: readonly string[], flagships: ReadonlyArray<{ subject: string; dir: string }>, sentinel: string): string[] {
  const hit = dependents(graph, changed);
  const out = new Set<string>([sentinel]);
  for (const f of flagships) {
    const prefix = f.dir.endsWith('/') ? f.dir : `${f.dir}/`;
    for (const file of hit) if (file.startsWith(prefix)) { out.add(f.subject); break; }
  }
  return [...out].sort();
}
