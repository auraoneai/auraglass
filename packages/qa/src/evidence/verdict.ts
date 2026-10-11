/* REQ-QUAL-63 ReleaseVerdict and GA checklist (S-55 REPORTS.releaseVerdict, contract §6.2; QUAL).
   `node certification/run.mjs --lane all --scope release --verdict <path>` runs every lane at release scope, verifies
   the evidence (verify.ts) and writes
     { version: 1, sha, tag, items: [{ id: 'G-01'..'G-16', status, reason, source }], ga, line, phase, advisory, checklist }
   with `ga: true` only when every item is `pass`. Items verified outside QUAL (G-11 issue query, G-12, G-14, G-15,
   G-16) are read from their owners' artifacts when present — `release-items/G-NN.json` anywhere in the merged
   artifacts, `{ version: 1, id, sha, status: 'pass' | 'fail', evidence: [urls] }` bound to the SHA — and are `pending`
   otherwise. L13 (G-09) and L14 (G-10) are required from RC-1 only: before RC-1 a missing record is `pending`, from
   RC-1 it is `fail`. The verdict is advisory (never fails the job by itself) for pre-release tags and on the 4.x line
   (contract §4.13.7); on a GA tag a verdict with `ga: false` fails the job. The rendered checklist ticks every item
   from evidence only, never by hand. */
import { execFileSync } from 'node:child_process';
import { existsSync, globSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, relative, sep } from 'node:path';
import type { ReleaseVerdict } from '../../../../src/contracts/testing.ts';
import { loadComponentMetas } from '../resolve/componentMetas.ts';
import { writeClaims } from './claims.ts';
import { EXEMPTIONS_FILE } from './exemptions.ts';
import { loadRecords, requiredItems, summarizeReview, REVIEW_RECORDS_DIR, type ReviewSummary } from './reviewRecord.ts';
import { collectEvidence, gitUnchangedSince, recomputeHashes, verifyEvidence, CONSOLE_ALLOWLIST, QUARANTINE,
  type L13AggregateLike, type ManifestResultLike, type Verification } from './verify.ts';

export const GA_ITEMS = ['G-01', 'G-02', 'G-03', 'G-04', 'G-05', 'G-06', 'G-07', 'G-08', 'G-09', 'G-10', 'G-11', 'G-12', 'G-13', 'G-14', 'G-15', 'G-16'] as const;
export type GaItem = (typeof GA_ITEMS)[number];
export type ItemStatus = 'pass' | 'fail' | 'pending';
export type Phase = 'untagged' | 'alpha' | 'beta' | 'rc' | 'ga' | '4x';

type Check =
  | { kind: 'lanes'; lanes: readonly string[] }
  | { kind: 'paths'; match: RegExp; producer: string }
  | { kind: 'all-lanes' }
  | { kind: 'l13' }
  | { kind: 'l14' }
  | { kind: 'external'; owner: string; localGuard?: 'legacy-reports' };

/** contract §6.2, one row per GA item; certification/RELEASE_CHECKLIST.md is the prose of this table (test-checked). */
export const CHECKLIST: ReadonlyArray<{ id: GaItem; item: string; verifiedBy: string; check: Check }> = [
  { id: 'G-01', item: 'Every lane L1–L12 is pass for every GA subject; no pending, double-pass or pre-existing remains; the evidence verifies (REQ-QUAL-61)', verifiedBy: 'qual:certify:release (lane manifest + evidence verifier)', check: { kind: 'all-lanes' } },
  { id: 'G-02', item: 'Zero @ag-contract-seed markers in src/; zero data-ag-seed, story-only or banned attributes in dist/; the tarball has no contracts/, tests/, fragments/ or stubs', verifiedBy: 'L1, L2', check: { kind: 'lanes', lanes: ['L1', 'L2'] } },
  { id: 'G-03', item: "Every ENTRIES row with ga: '5.0' is built and its value exports equal the contract list; ROOT_EXPORTS equals the root's value exports", verifiedBy: 'tests/contract/entries.test.ts against the tarball', check: { kind: 'paths', match: /(^|\/)tests\/contract\/(\*\*\/\*\.test\.ts\*?|entries\.test\.ts)$/, producer: 'tests/contract/entries.test.ts release registration (G-02)' } },
  { id: 'G-04', item: 'All 44 flagships have the §11.3 deliverables', verifiedBy: 'packages/qa/src/deliverables/ (scripts/qual/deliverables/check.ts on L1)', check: { kind: 'paths', match: /scripts\/qual\/deliverables\/check\.ts|packages\/qa\/test\/deliverables\.test\.ts/, producer: 'deliverables check registration (G-19, REQ-QUAL-71)' } },
  { id: 'G-05', item: 'All auraglass lint rules at error everywhere with zero violations; the literal baseline is 0 for every stream', verifiedBy: 'L1', check: { kind: 'lanes', lanes: ['L1'] } },
  { id: 'G-06', item: 'Contract conformance suite green (§6.3)', verifiedBy: 'tests/contract/**', check: { kind: 'paths', match: /(^|\/)tests\/contract\//, producer: 'tests/contract/** release registration (G-02)' } },
  { id: 'G-07', item: 'Every 5.0 removal or rename has a deprecations entry that shipped in a published 4.x minor (≥4.2.0)', verifiedBy: 'L3 against the published 4.x tarballs', check: { kind: 'lanes', lanes: ['L3'] } },
  { id: 'G-08', item: 'Codemods run clean on the canaries and every registry block; the frozen 4.x fixture passes migrate 4to5 with zero TODOs', verifiedBy: 'L11', check: { kind: 'lanes', lanes: ['L11'] } },
  { id: 'G-09', item: 'L13 manual screen-reader records exist for all 44 flagships with no fail open', verifiedBy: 'L13 artifact (.artifacts/qual/a11y-manual-<sha>.json, FIN-H aggregate)', check: { kind: 'l13' } },
  { id: 'G-10', item: 'L14 human visual review signed for the six product surfaces (S1 showcases) and the T0 matrix', verifiedBy: 'L14 records (certification/review/records/, qual:certify:review-record)', check: { kind: 'l14' } },
  { id: 'G-11', item: 'Zero open P0, and ≥4 weeks since the first P0-free RC (§14.1)', verifiedBy: 'issue tracker query (PLAT artifact release-items/G-11.json)', check: { kind: 'external', owner: 'PLAT' } },
  { id: 'G-12', item: 'legacy/ is empty and reports/ is absent', verifiedBy: 'L1 (PLAT artifact release-items/G-12.json; QUAL cross-checks the checkout)', check: { kind: 'external', owner: 'PLAT', localGuard: 'legacy-reports' } },
  { id: 'G-13', item: 'Size and perf budgets within their calibrated ceilings, no raise after calibration', verifiedBy: 'L2, L10', check: { kind: 'lanes', lanes: ['L2', 'L10'] } },
  { id: 'G-14', item: 'README and release-note claims are generated from this run’s artifacts', verifiedBy: 'PLAT docs-claims gate (release-items/G-14.json)', check: { kind: 'external', owner: 'PLAT' } },
  { id: 'G-15', item: 'Gates outside the agent perimeter recorded as decided (Base UI sign-off, D-31 font licence, npm scope, OD-10 trusted publishing, OD-11 GitLab settings)', verifiedBy: 'docs/release/decisions/ (PLAT artifact release-items/G-15.json)', check: { kind: 'external', owner: 'PLAT' } },
  { id: 'G-16', item: 'No GitHub Actions workflow other than mirror-to-gitlab.yml on the GA SHA, and every REQUIRED_JOBS entry is allow_failure: false', verifiedBy: 'contract:ci-fragments (PLAT artifact release-items/G-16.json)', check: { kind: 'external', owner: 'PLAT' } },
];

/** Release phase of a tag: v5.0.0-alpha.N / -beta.N / -rc.N / v5.x.y; anything on the 4.x line (tag v4.* or AG_LINE 4x) is `4x`. */
export function releasePhase(tag: string | null | undefined, line: '4x' | '5x'): Phase {
  if (line === '4x' || /^v?4\./.test(tag ?? '')) return '4x';
  const m = /^v?(\d+)\.(\d+)\.(\d+)(?:-(alpha|beta|rc)\.(\d+))?$/.exec(tag ?? '');
  if (!m) return 'untagged';
  return (m[4] as Phase | undefined) ?? 'ga';
}
/** L13/L14 are required from RC-1 (contract §6.2, REQ-QUAL-63). */
export const humanRecordsRequired = (phase: Phase) => phase === 'rc' || phase === 'ga';
export const isAdvisory = (phase: Phase) => phase !== 'ga';

export interface ExternalItem { file: string; value: unknown }
export interface VerdictInput {
  sha: string; tag: string; line: '4x' | '5x';
  /** this run's lane results (release scope) */
  results: readonly ManifestResultLike[];
  verification: Verification;
  l13: { file: string; value: L13AggregateLike } | null;
  /** L14 review summary over the records present (computed whether or not RC-1 requires it) */
  review: ReviewSummary | null;
  external: Partial<Record<GaItem, ExternalItem>>;
  /** git-tracked paths of the checkout (G-12 local guard) */
  trackedPaths: readonly string[];
  checklistPath?: string;
}
export interface VerdictItem { id: GaItem; status: ItemStatus; reason: string; source: string[] }
export interface Verdict extends ReleaseVerdict { items: VerdictItem[]; line: '4x' | '5x'; phase: Phase; advisory: boolean; checklist?: string }

const worst = (states: readonly ItemStatus[]): ItemStatus => (states.includes('fail') ? 'fail' : states.includes('pending') ? 'pending' : 'pass');
const stateOf = (s: string): ItemStatus => (s === 'pass' ? 'pass' : s === 'pending' ? 'pending' : 'fail');

function fromRows(rows: readonly ManifestResultLike[], what: string): Omit<VerdictItem, 'id'> {
  if (!rows.length) return { status: 'pending', reason: `no ${what} result in this release run`, source: [] };
  const bad = rows.filter((r) => r.state !== 'pass');
  const status = worst(rows.map((r) => stateOf(r.state)));
  return { status, reason: status === 'pass' ? `${rows.length} ${what} result(s) pass` : bad.slice(0, 5).map((r) => `[${r.lane}] ${r.path ?? ''}: ${r.state}`).join('; '),
    source: [...new Set(rows.map((r) => `${r.lane}:${r.path ?? ''}`))].slice(0, 20) };
}

function external(id: GaItem, x: ExternalItem | undefined, sha: string, owner: string): Omit<VerdictItem, 'id'> {
  if (!x) return { status: 'pending', reason: `no ${owner} artifact release-items/${id}.json in this pipeline`, source: [] };
  const v = x.value as { version?: unknown; id?: unknown; sha?: unknown; status?: unknown; evidence?: unknown } | null;
  if (!v || v.version !== 1 || v.id !== id || !['pass', 'fail'].includes(String(v.status)) || !Array.isArray(v.evidence)) {
    return { status: 'fail', reason: `${x.file}: not a release item record { version: 1, id: '${id}', sha, status: pass|fail, evidence: [] }`, source: [x.file] };
  }
  if (v.sha !== sha) return { status: 'pending', reason: `${x.file} is bound to ${String(v.sha)}, not ${sha}`, source: [x.file] };
  if (v.status === 'pass' && !(v.evidence as unknown[]).length) return { status: 'fail', reason: `${x.file}: pass without evidence URLs`, source: [x.file] };
  return { status: v.status as ItemStatus, reason: `${owner}: ${String(v.status)}`, source: [x.file, ...(v.evidence as string[])] };
}

export function buildVerdict(input: VerdictInput): Verdict {
  const phase = releasePhase(input.tag, input.line);
  const required = humanRecordsRequired(phase);
  const lane5 = (lanes: readonly string[]) => input.results.filter((r) => lanes.includes(r.lane));
  const items: VerdictItem[] = CHECKLIST.map(({ id, check }) => {
    let r: Omit<VerdictItem, 'id'>;
    switch (check.kind) {
      case 'all-lanes': {
        const lanes = fromRows(lane5(['L1', 'L2', 'L3', 'L4', 'L5', 'L6', 'L7', 'L8', 'L9', 'L10', 'L11', 'L12']), 'lane');
        const missing = ['L1', 'L2', 'L3', 'L4', 'L5', 'L6', 'L7', 'L8', 'L9', 'L10', 'L11', 'L12'].filter((l) => !input.results.some((x) => x.lane === l));
        const v = input.verification;
        const status = worst([lanes.status, missing.length ? 'fail' : 'pass', v.ok ? 'pass' : 'fail']);
        r = { status, source: lanes.source,
          reason: [missing.length ? `lanes without results: ${missing.join(', ')}` : '', lanes.status !== 'pass' ? lanes.reason : '',
            v.ok ? '' : `evidence verifier: ${v.problems.slice(0, 5).map((p) => `${p.code} ${p.message}`).join(' | ')}${v.problems.length > 5 ? ` (+${v.problems.length - 5})` : ''}`]
            .filter(Boolean).join('; ') || 'every lane pass and the evidence verifies' };
        break;
      }
      case 'lanes': r = fromRows(lane5(check.lanes), check.lanes.join('/')); break;
      case 'paths': {
        const rows = input.results.filter((x) => check.match.test(x.path ?? ''));
        r = rows.length ? fromRows(rows, 'registered') : { status: 'pending', reason: `not registered in this release run: ${check.producer}`, source: [] };
        break;
      }
      case 'l13': {
        const a = input.l13;
        if (!a) r = { status: required ? 'fail' : 'pending', reason: `no a11y-manual-${input.sha}.json${required ? ' (required from RC-1)' : ' (required from RC-1; not yet)'}`, source: [] };
        else if (a.value.sha !== input.sha) r = { status: required ? 'fail' : 'pending', reason: `${a.file} is bound to ${a.value.sha}`, source: [a.file] };
        else if (a.value.verdict === 'pass') r = { status: 'pass', reason: 'L13 aggregate verdict pass', source: [a.file] };
        else if (a.value.verdict === 'fail') r = { status: 'fail', reason: 'L13 aggregate verdict fail', source: [a.file] };
        else r = { status: required ? 'fail' : 'pending', reason: `L13 aggregate verdict ${a.value.verdict}`, source: [a.file] };
        break;
      }
      case 'l14': {
        const s = input.review;
        const rel = (i: string) => i === 't0-matrix' || i.startsWith('showcase-');
        if (!s) { r = { status: required ? 'fail' : 'pending', reason: 'no L14 review summary', source: [] }; break; }
        const bad = [...s.failing.map((f) => f.item), ...s.unbound.map((u) => u.item), ...s.compositeMismatch.map((c) => c.item)].filter(rel);
        const missing = s.missing.filter(rel);
        if (bad.length || s.invalid.length) r = { status: 'fail', reason: `failing/unbound/invalid L14 records: ${[...bad, ...s.invalid.map((i) => i.file)].join(', ')}`, source: ['certification/review/records/'] };
        else if (missing.length) r = { status: required ? 'fail' : 'pending', reason: `no L14 record for ${missing.join(', ')}`, source: ['certification/review/records/'] };
        else r = { status: 'pass', reason: 'T0 matrix and every S1 showcase reviewed, all criteria ≥3', source: ['certification/review/records/'] };
        break;
      }
      case 'external': {
        r = external(id, input.external[id], input.sha, check.owner);
        if (check.localGuard === 'legacy-reports') {
          const tracked = input.trackedPaths.filter((p) => p.startsWith('legacy/') || p.startsWith('reports/'));
          if (tracked.length) r = { status: 'fail', reason: `checkout still tracks ${tracked.length} file(s) under legacy/ or reports/ (e.g. ${tracked.slice(0, 3).join(', ')})`, source: r.source };
        }
        break;
      }
    }
    return { id, ...r };
  });
  const ga = items.every((i) => i.status === 'pass');
  return { version: 1, sha: input.sha, tag: input.tag, items, ga, line: input.line, phase, advisory: isAdvisory(phase),
    ...(input.checklistPath ? { checklist: input.checklistPath } : {}) };
}

/** The checklist rendered from the verdict: a box is ticked only when its item is `pass` in this verdict. */
export function renderChecklist(v: Verdict): string {
  const lines = [
    `# AuraGlass release checklist — ${v.tag || 'untagged'} @ ${v.sha}`,
    '',
    `Generated by \`node certification/run.mjs --lane all --scope release --verdict\` from this pipeline's evidence. Phase: ${v.phase}${v.advisory ? ' (advisory)' : ''}. GA: **${v.ga ? 'yes' : 'no'}**.`,
    '',
    '| | # | Item | Verified by | Status | Detail |',
    '|---|---|---|---|---|---|',
    ...CHECKLIST.map((c) => {
      const it = v.items.find((i) => i.id === c.id)!;
      const esc = (s: string) => s.replace(/\|/g, '\\|').replace(/\n/g, ' ');
      return `| ${it.status === 'pass' ? '[x]' : '[ ]'} | ${c.id} | ${esc(c.item)} | ${esc(c.verifiedBy)} | ${it.status} | ${esc(it.reason)} |`;
    }),
    '',
  ];
  return lines.join('\n');
}

/** Owner artifacts `release-items/G-NN.json` anywhere under the evidence dir (first match per id, sorted). */
export function readExternalItems(dir: string): Partial<Record<GaItem, ExternalItem>> {
  const out: Partial<Record<GaItem, ExternalItem>> = {};
  if (!existsSync(dir)) return out;
  for (const f of globSync('**/release-items/G-*.json', { cwd: dir, exclude: (p) => /node_modules/.test(p) }).sort()) {
    const id = /G-\d{2}(?=\.json$)/.exec(f)?.[0] as GaItem | undefined;
    if (!id || !(GA_ITEMS as readonly string[]).includes(id) || out[id]) continue;
    const file = join(dir, f);
    let value: unknown;
    try { value = JSON.parse(readFileSync(file, 'utf8')); } catch { value = null; }
    out[id] = { file: relative(dir, file).split(sep).join('/'), value };
  }
  return out;
}

/** Structural check against the S-55 ReleaseVerdict type (used by the tests and before writing). */
export function verdictProblems(v: unknown): string[] {
  const p: string[] = [];
  const o = v as Record<string, unknown> | null;
  if (!o || typeof o !== 'object') return ['not an object'];
  if (o.version !== 1) p.push('version must be 1');
  if (typeof o.sha !== 'string' || !o.sha) p.push('sha must be a non-empty string');
  if (typeof o.tag !== 'string') p.push('tag must be a string');
  if (typeof o.ga !== 'boolean') p.push('ga must be a boolean');
  if (!Array.isArray(o.items)) p.push('items must be an array');
  else {
    const ids = o.items.map((i: { id?: unknown }) => i?.id);
    if (JSON.stringify(ids) !== JSON.stringify(GA_ITEMS)) p.push(`items must be exactly ${GA_ITEMS.join(',')} in order`);
    for (const i of o.items as Array<{ id?: unknown; status?: unknown }>) if (!['pass', 'fail', 'pending'].includes(String(i?.status))) p.push(`${String(i?.id)}: status ${String(i?.status)}`);
    if (o.ga === true && (o.items as Array<{ status?: unknown }>).some((i) => i.status !== 'pass')) p.push('ga is true while an item is not pass');
  }
  return p;
}

// ---------------------------------------------------------------- release run (certification/run.mjs --verdict)

export interface ReleaseRunInput {
  root: string;
  /** merged artifacts root ($AURAGLASS_EVIDENCE_DIR, default .artifacts) */
  evidenceRoot: string;
  sha: string; tag: string; line: '4x' | '5x';
  results: readonly ManifestResultLike[];
  verdictPath: string;
  now?: Date;
}
export interface ReleaseRunOutput { verdict: Verdict; verification: Verification; claims: { code: 0 | 1; file: string | null; reasons: string[] }; checklistPath: string }

const readJsonOr = (file: string, fallback: unknown): unknown => {
  if (!existsSync(file)) return fallback;
  try { return JSON.parse(readFileSync(file, 'utf8')); } catch { return undefined; }
};

/** Verifies the evidence, writes claims.json (only when complete), the ReleaseVerdict and the rendered checklist. */
export function runReleaseVerdict(input: ReleaseRunInput): ReleaseRunOutput {
  const { root, sha } = input;
  const now = input.now ?? new Date();
  const phase = releasePhase(input.tag, input.line);
  const flagships = [...loadComponentMetas(root).values()].flat().filter((m) => m.flagship !== undefined)
    .map((m) => ({ name: m.name, states: m.states })).sort((a, b) => a.name.localeCompare(b.name));
  const showcases = readJsonOr(join(root, 'showcase/showcases.json'), { showcases: [] }) as { showcases?: Array<{ id: string; tier: string }> } | undefined;
  const s1Showcases = (showcases?.showcases ?? []).filter((s) => s.tier === 'S1').map((s) => s.id);
  const set = collectEvidence(input.evidenceRoot, { sha, recordsDir: join(root, REVIEW_RECORDS_DIR), loadRecords });
  const unchangedSince = gitUnchangedSince(root, sha);
  const verification = verifyEvidence(set, {
    sha, now, recomputed: recomputeHashes(root), flagships, s1Showcases, requireHumanRecords: humanRecordsRequired(phase),
    exemptions: readJsonOr(join(root, EXEMPTIONS_FILE), undefined), consoleAllowlist: readJsonOr(join(root, CONSOLE_ALLOWLIST), null),
    quarantine: readJsonOr(join(root, QUARANTINE), null),
    readFile: (p) => (existsSync(p) ? readFileSync(p) : null), unchangedSince,
  });
  const req = requiredItems({ flagships, s1Showcases });
  const review = verification.review ?? summarizeReview({ sha, records: set.l14, required: req.items, requiredProblems: req.problems, unchangedSince });
  let trackedPaths: string[] = [];
  try { trackedPaths = execFileSync('git', ['ls-files', '-z', '--', 'legacy', 'reports'], { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).split('\0').filter(Boolean); } catch { trackedPaths = []; }
  const claims = writeClaims({ set, verification, flagships: flagships.map((f) => f.name) }, join(input.evidenceRoot, 'qual', 'claims.json'));
  const checklistPath = join(dirname(input.verdictPath), 'release-checklist.md');
  const verdict = buildVerdict({ sha, tag: input.tag, line: input.line, results: input.results, verification, l13: set.l13, review,
    external: readExternalItems(input.evidenceRoot), trackedPaths, checklistPath: relative(root, checklistPath).split(sep).join('/') });
  const problems = verdictProblems(verdict);
  if (problems.length) throw new Error(`ReleaseVerdict does not satisfy S-55: ${problems.join('; ')}`);
  mkdirSync(dirname(input.verdictPath), { recursive: true });
  writeFileSync(input.verdictPath, `${JSON.stringify(verdict, null, 2)}\n`);
  writeFileSync(checklistPath, renderChecklist(verdict));
  return { verdict, verification, claims, checklistPath };
}
