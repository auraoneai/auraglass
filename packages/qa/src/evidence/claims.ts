/* REQ-QUAL-62 Computed claims (QUAL). Writes `.artifacts/qual/claims.json` =
     { <id>: { value, unit, source: { artifact, sha, path } } }
   from verified evidence only (verify.ts). The ported "incomplete language" guard of the 4.x audit applies: if the
   evidence set does not verify, any lane result is not `pass`, or any claim's source artifact is missing or not bound
   to the SHA, nothing is written and the caller exits non-zero. QUAL writes no README or release-note text; PLAT's
   docs-claims gate (G-14) may read this file next to PerfReport and ReleaseVerdict (until CC-Q3 adds REPORTS.claims).

   Claim ids and their sources (an artifact is bound when it sits in a job directory whose lane-manifest.json is bound
   to the SHA, or carries `sha` equal to it):
     visual-components   distinct `visual` subjects in inventory.json (L1, scripts/qual/write-inventory.mjs)
     flagships-certified flagships with passing L13 (aggregate verdict pass) and L14 records (RC-1 onward)
     cells-per-lane      planned capture cells per lane (lane manifests `cells`)
     results-per-lane    lane-runner result rows per lane
     failures            failing results (always 0 when written)
     ocr-contrast-worst  lowest `ocr-contrast` gate value over every capture row (L6, G-13)
     token-contrast-min  minimum `minRatio` per contrast class (`pair`) in the L4 contrast-matrix.json (MAT build)
     import-bytes        min+gzip-9 bytes per root export from dist-perf.json (REQ-QUAL-46, G-24)
     perf-grades         A–F grade distribution per profile in perf-report.json (REPORTS.perf, G-21)
     engines             engines covered by capture cells and lane browserVersions
     review-records      L13 and L14 record counts */
import { existsSync, globSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join, relative, sep } from 'node:path';
import { VERIFIED_LANES, type EvidenceSet, type Verification } from './verify.ts';

export const CLAIMS_FILE = '.artifacts/qual/claims.json';
export type ClaimValue = number | string | string[] | Record<string, number> | Record<string, Record<string, number>>;
export interface Claim { value: ClaimValue; unit: string; source: { artifact: string; sha: string; path: string } }
export type Claims = Record<string, Claim>;

export class ClaimsRefused extends Error {
  readonly reasons: string[];
  constructor(reasons: string[]) { super(`claims refused (incomplete evidence):\n  - ${reasons.join('\n  - ')}`); this.name = 'ClaimsRefused'; this.reasons = reasons; }
}

const rel = (root: string, p: string) => relative(root, p).split(sep).join('/');

/** Walks a nested contrast matrix down to `{ minRatio, pair }` leaves. */
function contrastLeaves(node: unknown, out: Array<{ minRatio: number; pair: string }> = []): Array<{ minRatio: number; pair: string }> {
  if (!node || typeof node !== 'object') return out;
  const o = node as Record<string, unknown>;
  if (typeof o.minRatio === 'number' && typeof o.pair === 'string') out.push({ minRatio: o.minRatio, pair: o.pair });
  else for (const v of Object.values(o)) contrastLeaves(v, out);
  return out;
}

export interface ClaimsInput { set: EvidenceSet; verification: Verification; flagships: readonly string[] }

/** Computes every claim, or throws ClaimsRefused listing every reason. Pure apart from reading the evidence dir. */
export function computeClaims({ set, verification, flagships }: ClaimsInput): Claims {
  const sha = verification.sha;
  const reasons: string[] = [];
  if (!verification.ok) reasons.push(...verification.problems.map((p) => `verify ${p.code}: ${p.message}`));
  const bound = set.manifests.filter((m) => m.manifest.sha === sha);
  for (const { file, manifest } of bound) {
    for (const r of manifest.results ?? []) if (r.state !== 'pass') reasons.push(`${rel(set.dir, file)}: [${r.lane}] ${r.path ?? ''} is ${r.state}, not pass`);
  }
  const boundDirs = new Set(bound.map((m) => dirname(m.file)));
  /** an artifact is bound when it carries sha == SHA, or lives in (or below) a job dir with a bound lane manifest */
  const isBound = (file: string, value?: unknown): boolean => {
    const own = (value as { sha?: unknown } | null)?.sha;
    if (typeof own === 'string') return own === sha;
    for (let d = dirname(file); d.startsWith(set.dir); d = dirname(d)) {
      if (boundDirs.has(d)) return true;
      if (d === dirname(d)) break;
    }
    return false;
  };
  const find = (pattern: string) => (existsSync(set.dir) ? globSync(pattern, { cwd: set.dir, exclude: (p) => /node_modules/.test(p) }).map((f) => join(set.dir, f)).sort() : []);
  const src = (file: string, path: string) => ({ artifact: rel(set.dir, file), sha, path });
  const claims: Claims = {};

  // visual-components
  if (!set.inventory) reasons.push('visual-components: no inventory.json');
  else if (!isBound(set.inventory.file, set.inventory.value)) reasons.push(`visual-components: ${rel(set.dir, set.inventory.file)} is not bound to ${sha}`);
  else {
    const n = new Set(set.inventory.value.items.filter((i) => i.class === 'visual').map((i) => i.name)).size;
    claims['visual-components'] = { value: n, unit: 'components', source: src(set.inventory.file, '$.items[?(@.class=="visual")].name') };
  }

  // flagships-certified
  const review = verification.review;
  if (!review || !set.l13) reasons.push('flagships-certified: L13 aggregate and L14 review are required (RC-1 onward)');
  else if (review.verdict !== 'pass' || set.l13.value.verdict !== 'pass') reasons.push('flagships-certified: L13/L14 not pass');
  else claims['flagships-certified'] = { value: flagships.length, unit: 'flagships', source: src(set.l13.file, '$.verdict') };

  // cells-per-lane, results-per-lane, failures
  if (!bound.length) reasons.push('cells-per-lane: no lane manifest bound to the SHA');
  else {
    const cells: Record<string, number> = {};
    const results: Record<string, number> = {};
    for (const lane of VERIFIED_LANES) {
      const ms = bound.filter((m) => m.manifest.lane === lane || m.manifest.lane === 'all');
      cells[lane] = ms.reduce((n, m) => n + (m.manifest.lane === lane || lane === 'L6' ? (m.manifest.cells ?? []).length : 0), 0);
      results[lane] = ms.reduce((n, m) => n + (m.manifest.results ?? []).filter((r) => r.lane === lane).length, 0);
    }
    const first = bound[0]!.file;
    claims['cells-per-lane'] = { value: cells, unit: 'cells', source: src(first, '$.cells') };
    claims['results-per-lane'] = { value: results, unit: 'results', source: src(first, '$.results[*].lane') };
    const failures = bound.reduce((n, m) => n + (m.manifest.results ?? []).filter((r) => r.state === 'fail').length, 0);
    claims.failures = { value: failures, unit: 'failures', source: src(first, '$.results[?(@.state=="fail")]') };
  }

  // ocr-contrast-worst
  const ocr = set.captures.flatMap(({ file, row }) => (row.gates ?? []).filter((g) => g.gate === 'ocr-contrast' && typeof g.value === 'number').map((g) => ({ file, value: g.value! })));
  if (!ocr.length) reasons.push('ocr-contrast-worst: no ocr-contrast gate value in any capture row');
  else if (ocr.some((o) => !isBound(o.file))) reasons.push('ocr-contrast-worst: a capture file is not in a job dir bound to the SHA');
  else {
    const worst = ocr.reduce((a, b) => (b.value < a.value ? b : a));
    claims['ocr-contrast-worst'] = { value: worst.value, unit: 'contrast ratio (:1)', source: src(worst.file, '$.gates[?(@.gate=="ocr-contrast")].value') };
  }

  // token-contrast-min
  const matrix = find('**/contrast-matrix.json')[0];
  if (!matrix) reasons.push('token-contrast-min: no contrast-matrix.json (L4)');
  else if (!isBound(matrix)) reasons.push(`token-contrast-min: ${rel(set.dir, matrix)} is not in a job dir bound to the SHA`);
  else {
    const min: Record<string, number> = {};
    for (const l of contrastLeaves(JSON.parse(readFileSync(matrix, 'utf8')))) min[l.pair] = Math.min(min[l.pair] ?? Infinity, l.minRatio);
    if (!Object.keys(min).length) reasons.push(`token-contrast-min: ${rel(set.dir, matrix)} has no {minRatio, pair} cells`);
    else claims['token-contrast-min'] = { value: Object.fromEntries(Object.entries(min).sort()), unit: 'contrast ratio (:1) per class', source: src(matrix, '$..minRatio') };
  }

  // import-bytes
  const distPerf = find('**/dist-perf.json')[0];
  const bytes = distPerf ? (JSON.parse(readFileSync(distPerf, 'utf8')) as { bytes?: Record<string, number> }).bytes : undefined;
  if (!distPerf || !bytes || !Object.keys(bytes).length) reasons.push('import-bytes: no dist-perf.json bytes map (REQ-QUAL-46)');
  else if (!isBound(distPerf)) reasons.push(`import-bytes: ${rel(set.dir, distPerf)} is not in a job dir bound to the SHA`);
  else claims['import-bytes'] = { value: Object.fromEntries(Object.entries(bytes).sort()), unit: 'bytes (min+gzip-9)', source: src(distPerf, '$.bytes') };

  // perf-grades
  const perf = find('**/perf-report.json')[0];
  const perfValue = perf ? (JSON.parse(readFileSync(perf, 'utf8')) as { sha?: string; subjects?: Array<{ profile: string; grade: string }> }) : null;
  if (!perf || !perfValue?.subjects?.length) reasons.push('perf-grades: no perf-report.json (REPORTS.perf)');
  else if (!isBound(perf, perfValue)) reasons.push(`perf-grades: ${rel(set.dir, perf)} sha ${perfValue.sha ?? 'null'} != ${sha}`);
  else {
    const dist: Record<string, Record<string, number>> = {};
    for (const s of perfValue.subjects) { dist[s.profile] ??= { A: 0, B: 0, C: 0, D: 0, F: 0 }; dist[s.profile]![s.grade] = (dist[s.profile]![s.grade] ?? 0) + 1; }
    claims['perf-grades'] = { value: dist, unit: 'subjects per grade', source: src(perf, '$.subjects[*].grade') };
  }

  // engines
  const engines = new Set<string>();
  for (const { plan } of set.plans) for (const c of plan.cells ?? []) { const e = c.split('|')[2]; if (e) engines.add(e); }
  for (const { manifest } of bound) {
    for (const c of manifest.cells ?? []) { const e = c.split('|')[2]; if (e) engines.add(e); }
    for (const k of Object.keys(manifest.browserVersions ?? {})) engines.add(k);
  }
  if (!engines.size) reasons.push('engines: no capture cell or browserVersions names an engine');
  else claims.engines = { value: [...engines].sort(), unit: 'engines', source: src(set.plans[0]?.file ?? bound[0]!.file, '$.cells[*] (engine segment)') };

  // review-records
  if (review && set.l13) {
    claims['review-records'] = { value: { l13: Number(set.l13.value.recorded ?? 0), l14: review.recorded }, unit: 'records', source: src(set.l13.file, '$.recorded') };
  } else reasons.push('review-records: L13/L14 records are required (RC-1 onward)');

  if (reasons.length) throw new ClaimsRefused(reasons);
  return claims;
}

/** Writes claims.json, or nothing (code 1) when refused. Removes a stale file from an earlier run first. */
export function writeClaims(input: ClaimsInput, outFile: string): { code: 0 | 1; file: string | null; reasons: string[] } {
  let claims: Claims;
  try { claims = computeClaims(input); } catch (e) {
    if (e instanceof ClaimsRefused) { rmSync(outFile, { force: true }); return { code: 1, file: null, reasons: e.reasons }; }
    throw e;
  }
  mkdirSync(dirname(outFile), { recursive: true });
  writeFileSync(outFile, `${JSON.stringify(claims, null, 2)}\n`);
  return { code: 0, file: outFile, reasons: [] };
}
