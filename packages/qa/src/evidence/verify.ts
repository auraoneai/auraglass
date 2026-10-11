/* REQ-QUAL-61 Evidence verifier (QUAL). Generalises the provenance binding of legacy
   `scripts/audit/verify-visual-evidence.js` from one screenshot run to the whole certification evidence set of a SHA.
   For the SHA under test it checks:
     1. every lane L1–L12 has a lane manifest (S-43, certification/schemas/lane-manifest.schema.json) bound to the SHA
        with results.length > 0 for that lane;
     2. the thresholds, scenes, inventory (SubjectIndex) and baselines sha256 in every manifest equal the values
        recomputed from the checkout (a null on either side is a failure: an unbound manifest proves nothing);
     3. every `visual` inventory subject is in the capture plan, and every planned cell has a capture row;
     4. every PNG a capture row declares decodes, has its declared size and is not blank;
     5. from RC-1 (requireHumanRecords): the L13 aggregate (FIN-H tests/a11y/manual/aggregate.mjs,
        `.artifacts/qual/a11y-manual-<sha>.json`) is bound to the SHA with verdict pass, and an L14 review record
        (reviewRecord.ts) passes for every flagship subject-state, the T0 matrix and every S1 showcase, bound to the SHA
        or to an earlier SHA whose baselines and DOM snapshot for that subject have zero diffs;
     6. no exemption (certification/exemptions.json) or console-allowlist entry is expired;
     7. 0 quarantined cells (certification/quarantine.json empty and no `quarantined` result).
   Any missing element fails; nothing is inferred from absence. `collectEvidence` reads an evidence directory (the
   merged GitLab artifacts of the pipeline), `verifyEvidence` is the pure check. */
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync, globSync, readFileSync, statSync } from 'node:fs';
import { dirname, join, relative, sep } from 'node:path';
import { validateExemptions } from './exemptions.ts';
import { blankReason, decodePng, rasterStats } from './png.ts';
import { kebab, requiredItems, summarizeReview, type LoadedRecord, type ReviewItemRef, type ReviewSummary } from './reviewRecord.ts';

export const VERIFIED_LANES = ['L1', 'L2', 'L3', 'L4', 'L5', 'L6', 'L7', 'L8', 'L9', 'L10', 'L11', 'L12'] as const;
export const HASHED_INPUTS = {
  thresholdsSha256: 'certification/thresholds.json',
  scenesSha256: 'certification/scenes/scenes.manifest.json',
  inventorySha256: 'storybook-static/cert-manifest.json',
  baselinesSha256: 'certification/baselines',
} as const;
export type HashKey = keyof typeof HASHED_INPUTS;
export const CONSOLE_ALLOWLIST = 'certification/console-allowlist.json';
export const QUARANTINE = 'certification/quarantine.json';

export type ProblemCode =
  | 'lane-missing' | 'lane-empty' | 'sha-mismatch' | 'hash-missing' | 'hash-mismatch'
  | 'inventory-missing' | 'subject-unplanned' | 'cell-missing' | 'png-missing' | 'png-invalid' | 'png-size' | 'png-blank'
  | 'l13-missing' | 'l13-unbound' | 'l13-not-pass' | 'l14-incomplete' | 'l14-fail'
  | 'exemption-invalid' | 'exemption-expired' | 'allowlist-invalid' | 'allowlist-expired' | 'quarantined';
export interface Problem { code: ProblemCode; message: string }

export interface ManifestResultLike { lane: string; state: string; path?: string; stream?: string; subjects?: string[] }
export interface LaneManifestLike {
  version?: number; lane: string; sha: string | null; scope?: string; line?: string; results: ManifestResultLike[];
  cells?: string[]; subjects?: string[]; browserVersions?: Record<string, string>;
  thresholdsSha256?: string | null; scenesSha256?: string | null; inventorySha256?: string | null; baselinesSha256?: string | null;
}
export interface CaptureRowLike { id?: string; cell?: string; subject?: string; pngs?: Array<{ path: string; width: number; height: number }>;
  gates?: Array<{ gate: string; status?: string; value?: number; limit?: number }> }
export interface InventoryLike { items: Array<{ name: string; class: string; entry?: string }> }
export interface L13AggregateLike { sha: string; verdict: string; required?: number; recorded?: number; passed?: number; missing?: unknown[] }

export interface EvidenceSet {
  dir: string;
  manifests: Array<{ file: string; manifest: LaneManifestLike }>;
  plans: Array<{ file: string; plan: { sha?: string | null; cells?: string[]; subjects?: string[] } }>;
  captures: Array<{ file: string; row: CaptureRowLike }>;
  inventory: { file: string; value: InventoryLike } | null;
  l13: { file: string; value: L13AggregateLike } | null;
  l14: LoadedRecord[];
}

export interface VerifyOptions {
  sha: string;
  now: Date;
  recomputed: Record<HashKey, string | null>;
  flagships: ReadonlyArray<{ name: string; states: readonly string[] | null | undefined }>;
  s1Showcases: readonly string[];
  /** L13/L14 are required from RC-1 only (REQ-QUAL-63). */
  requireHumanRecords: boolean;
  exemptions: unknown;
  consoleAllowlist: unknown;
  quarantine: unknown;
  /** bytes of a file in the evidence set, or null when absent */
  readFile: (path: string) => Uint8Array | null;
  unchangedSince?: (item: ReviewItemRef, recordSha: string) => boolean;
  /** subjects changed by a baseline refresh in this release (each needs an L14 record) */
  changedSubjects?: readonly string[];
}

export interface Verification { ok: boolean; sha: string; problems: Problem[]; lanes: Record<string, number>; review: ReviewSummary | null }

const DAY_END = (d: string) => Date.parse(`${d}T23:59:59.999Z`);

export function verifyEvidence(set: EvidenceSet, o: VerifyOptions): Verification {
  const problems: Problem[] = [];
  const add = (code: ProblemCode, message: string) => problems.push({ code, message });

  // 1. lane manifests bound to the SHA, results per lane
  const bound = set.manifests.filter(({ file, manifest }) => {
    if (manifest.sha === o.sha) return true;
    add('sha-mismatch', `${file}: lane manifest sha ${manifest.sha ?? 'null'} != ${o.sha}`);
    return false;
  });
  const lanes: Record<string, number> = {};
  for (const lane of VERIFIED_LANES) {
    const covering = bound.filter(({ manifest }) => manifest.lane === lane || manifest.lane === 'all');
    if (!covering.length) { add('lane-missing', `${lane}: no lane manifest for ${o.sha}`); continue; }
    const n = covering.reduce((k, { manifest }) => k + (manifest.results ?? []).filter((r) => r.lane === lane).length, 0);
    lanes[lane] = n;
    if (n === 0) add('lane-empty', `${lane}: lane manifest(s) ${covering.map((c) => c.file).join(', ')} have 0 results for ${lane}`);
  }

  // 2. provenance hashes
  for (const { file, manifest } of bound) {
    for (const key of Object.keys(HASHED_INPUTS) as HashKey[]) {
      const have = manifest[key] ?? null;
      const want = o.recomputed[key];
      if (want === null) add('hash-missing', `${file}: ${HASHED_INPUTS[key]} is absent from the checkout, so ${key} cannot be recomputed`);
      else if (have === null) add('hash-missing', `${file}: ${key} is null (the lane ran without ${HASHED_INPUTS[key]})`);
      else if (have !== want) add('hash-mismatch', `${file}: ${key} ${have} != recomputed ${want} (${HASHED_INPUTS[key]})`);
    }
  }

  // 3. visual subjects → planned cells → capture rows
  if (!set.inventory) add('inventory-missing', 'no inventory.json (L1 scripts/qual/write-inventory.mjs) in the evidence set');
  const planned = new Set<string>();
  const plannedSubjects = new Set<string>();
  for (const { file, plan } of set.plans) {
    if (plan.sha != null && plan.sha !== o.sha) { add('sha-mismatch', `${file}: capture plan sha ${plan.sha} != ${o.sha}`); continue; }
    for (const c of plan.cells ?? []) planned.add(c);
    for (const s of plan.subjects ?? []) plannedSubjects.add(s);
  }
  const visual = [...new Set((set.inventory?.value.items ?? []).filter((i) => i.class === 'visual').map((i) => i.name))].sort();
  for (const s of visual) if (!plannedSubjects.has(s)) add('subject-unplanned', `visual subject ${s} has no required cell in any capture plan`);
  const captured = new Set(set.captures.map(({ row }) => row.id).filter((x): x is string => !!x));
  const missingCells = [...planned].filter((c) => !captured.has(c)).sort();
  for (const c of missingCells.slice(0, 50)) add('cell-missing', `planned cell ${c} has no capture result`);
  if (missingCells.length > 50) add('cell-missing', `… and ${missingCells.length - 50} more planned cells without a capture result`);

  // 4. PNG evidence
  for (const { file, row } of set.captures) {
    for (const p of row.pngs ?? []) {
      const path = join(dirname(file), p.path);
      const bytes = o.readFile(path);
      const at = `${row.id ?? '?'} ${p.path}`;
      if (!bytes) { add('png-missing', `${at}: declared PNG is not in the evidence set`); continue; }
      let img;
      try { img = decodePng(bytes); } catch (e) { add('png-invalid', `${at}: ${(e as Error).message}`); continue; }
      if (img.width !== p.width || img.height !== p.height) add('png-size', `${at}: ${img.width}x${img.height}, declared ${p.width}x${p.height}`);
      const blank = blankReason(rasterStats(img));
      if (blank) add('png-blank', `${at}: ${blank}`);
    }
  }

  // 5. human records (RC-1 onward)
  let review: ReviewSummary | null = null;
  if (o.requireHumanRecords) {
    const l13 = set.l13;
    if (!l13) add('l13-missing', `no L13 aggregate a11y-manual-${o.sha}.json (FIN-H tests/a11y/manual/aggregate.mjs)`);
    else if (l13.value.sha !== o.sha) add('l13-unbound', `${l13.file}: sha ${l13.value.sha} != ${o.sha}`);
    else if (l13.value.verdict !== 'pass') add('l13-not-pass', `${l13.file}: L13 verdict ${l13.value.verdict}`);
    const req = requiredItems({ flagships: o.flagships, s1Showcases: o.s1Showcases, changedSubjects: o.changedSubjects });
    review = summarizeReview({ sha: o.sha, records: set.l14, required: req.items, requiredProblems: req.problems, unchangedSince: o.unchangedSince });
    if (review.verdict === 'fail') {
      add('l14-fail', `L14: ${[...review.invalid.map((i) => `${i.file} invalid (${i.problems.join('; ')})`), ...review.failing.map((f) => `${f.item} scored <3 on ${f.criteria.join(',')}`),
        ...review.unbound.map((u) => `${u.item} bound to ${u.sha}, not ${o.sha}, with baseline/DOM diffs`), ...review.compositeMismatch.map((c) => `${c.item} composite mismatch`), ...review.problems].join(' | ')}`);
    }
    if (review.missing.length) add('l14-incomplete', `L14: ${review.missing.length} required review item(s) without a record: ${review.missing.slice(0, 20).join(', ')}${review.missing.length > 20 ? ', …' : ''}`);
  }

  // 6. expiring allowances
  for (const p of validateExemptions(o.exemptions, o.now)) add(p.code === 'expired' ? 'exemption-expired' : 'exemption-invalid', p.message);
  if (o.consoleAllowlist !== null) {
    if (!Array.isArray(o.consoleAllowlist)) add('allowlist-invalid', `${CONSOLE_ALLOWLIST} must be a JSON array`);
    else o.consoleAllowlist.forEach((e, i) => {
      const exp = (e as { expires?: unknown } | null)?.expires;
      if (typeof exp !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(exp)) add('allowlist-invalid', `${CONSOLE_ALLOWLIST}[${i}]: expires must be YYYY-MM-DD`);
      else if (DAY_END(exp) < o.now.getTime()) add('allowlist-expired', `${CONSOLE_ALLOWLIST}[${i}]: expired on ${exp}`);
    });
  }

  // 7. quarantine
  if (o.quarantine !== null) {
    if (!Array.isArray(o.quarantine)) add('quarantined', `${QUARANTINE} must be a JSON array`);
    else for (const q of o.quarantine) add('quarantined', `${QUARANTINE}: cell ${(q as { cell?: string })?.cell ?? '?'} is quarantined`);
  }
  for (const { file, manifest } of bound) {
    for (const r of manifest.results ?? []) if (r.state === 'quarantined') add('quarantined', `${file}: [${r.lane}] ${r.path ?? ''} is quarantined`);
  }

  return { ok: problems.length === 0, sha: o.sha, problems, lanes, review };
}

// ---------------------------------------------------------------- checkout + evidence-dir readers

export function sha256File(file: string): string | null {
  return existsSync(file) && statSync(file).isFile() ? createHash('sha256').update(readFileSync(file)).digest('hex') : null;
}

/** sha256 over the sorted `path\0sha256\n` list of every file under certification/baselines (null when absent). */
export function baselinesSha256(root: string): string | null {
  const dir = join(root, HASHED_INPUTS.baselinesSha256);
  if (!existsSync(dir)) return null;
  const files = globSync('**/*', { cwd: dir }).filter((f) => statSync(join(dir, f)).isFile()).map((f) => f.split(sep).join('/')).sort();
  const h = createHash('sha256');
  for (const f of files) h.update(`${f}\0${sha256File(join(dir, f))}\n`);
  return h.digest('hex');
}

export function recomputeHashes(root: string): Record<HashKey, string | null> {
  return {
    thresholdsSha256: sha256File(join(root, HASHED_INPUTS.thresholdsSha256)),
    scenesSha256: sha256File(join(root, HASHED_INPUTS.scenesSha256)),
    inventorySha256: sha256File(join(root, HASHED_INPUTS.inventorySha256)),
    baselinesSha256: baselinesSha256(root),
  };
}

const readJson = (file: string): unknown => JSON.parse(readFileSync(file, 'utf8'));
const EXCLUDE = (p: string) => /(^|\/)node_modules(\/|$)/.test(p);

/** Reads an evidence directory (merged job artifacts). L14 records are read from `recordsDir`. */
export function collectEvidence(dir: string, opts: { sha: string; recordsDir: string; loadRecords: (dir: string) => LoadedRecord[] }): EvidenceSet {
  const find = (pattern: string) => (existsSync(dir) ? globSync(pattern, { cwd: dir, exclude: EXCLUDE }).map((f) => join(dir, f)).sort() : []);
  const manifests = find('**/lane-manifest.json').map((file) => ({ file, manifest: readJson(file) as LaneManifestLike }));
  const plans = find('**/environment-visual/plan.json').map((file) => ({ file, plan: readJson(file) as EvidenceSet['plans'][number]['plan'] }));
  const captures = find('**/captures-*.jsonl').flatMap((file) => readFileSync(file, 'utf8').split('\n').filter(Boolean)
    .map((l) => ({ file, row: JSON.parse(l) as CaptureRowLike })));
  const inv = find('**/inventory.json')[0];
  const l13 = find(`**/a11y-manual-${opts.sha}.json`)[0];
  return {
    dir, manifests, plans, captures,
    inventory: inv ? { file: inv, value: readJson(inv) as InventoryLike } : null,
    l13: l13 ? { file: l13, value: readJson(l13) as L13AggregateLike } : null,
    l14: opts.loadRecords(opts.recordsDir),
  };
}

/** Files under `certification/baselines` or `certification/dom-snapshots` whose path names the subject (kebab id). */
export function subjectEvidencePaths(subjectId: string): string[] {
  return [`certification/baselines/**/*${subjectId}*`, `certification/dom-snapshots/**/*${subjectId}*`];
}

/** Default `unchangedSince` (REQ-QUAL-61): an earlier record binds only when `git diff <recordSha> <sha>` shows no
    change to that subject's baselines or DOM snapshots, and the record SHA is an ancestor of `sha`. An unknown SHA
    (shallow clone, typo) never binds. */
export function gitUnchangedSince(root: string, sha: string) {
  return (item: ReviewItemRef, recordSha: string): boolean => {
    const id = item.kind === 'showcase' ? item.subject : kebab(item.subject);
    try {
      execFileSync('git', ['merge-base', '--is-ancestor', recordSha, sha], { cwd: root, stdio: 'ignore' });
      const out = execFileSync('git', ['diff', '--name-only', recordSha, sha, '--', ...subjectEvidencePaths(id).map((g) => `:(glob)${g}`)],
        { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });
      return out.trim() === '';
    } catch { return false; }
  };
}

export const relativeTo = (root: string, p: string) => relative(root, p).split(sep).join('/');
