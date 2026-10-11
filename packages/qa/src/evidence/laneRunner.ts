/* REQ-QUAL-05, -06, -27, -28, -30 lane runner (QUAL; LANE_COMMAND, S-43).
   `certification/run.mjs` is the CLI; this module is the implementation, so it is unit-tested under
   jest.qual.config.js (packages/qa/test/{lane-runner,fail-closed,l1-wiring}.test.ts).

   Registrations = QUAL built-ins (certification/lanes.config.ts) + every stream's fragments/lanes/<stream>.ts
   (loadFragments('lanes'), S-50). A registration's `scope` is the narrowest pipeline scope it starts running at:
   pr ⊂ main ⊂ nightly ⊂ release (a `pr` row also runs at main/nightly/release; a `release` row only at release);
   identical lane/kind/path rows are run once.

   Per registration state: pass | fail | pending | pre-existing (contract §6.1). Fail closed (REQ-QUAL-06): a crash,
   a missing report ("manifest"), 0 tests while the row has ≥1 subject file, or a registered path that matches
   nothing is `fail`. A lane with 0 subjects is `pending` at pr/main/nightly and `fail` at release; at release every
   `pending` is `fail` (G-01: pending is not pass). Pending is reported only here:
   - node-script rows exit PENDING_EXIT (75) to say "producer not landed";
   - jest/playwright rows whose every failure is an `AgPendingProducer` / `pending:` error are pending.
   Exit codes: 0 no blocking failure · 1 blocking failure · 2 invoked outside a remote runner · 64 usage error. */
import { execFileSync, spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync, globSync, mkdirSync, readFileSync, realpathSync, statSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { cpus } from 'node:os';
import { isAbsolute, join, relative, resolve, sep } from 'node:path';
import { build } from 'esbuild';
import { loadFragments } from '../../../../src/contracts/load-fragments.mjs';
import type { LaneRegistration } from '../../../../src/contracts/fragments.ts';
import { buildCoveragePlan, evaluateCoverage, flagshipDirs, readRatchets, seedDirs, type GroupResult } from './coverageThreshold.ts';
import { loadOwnerOf } from './ownership.ts';

export const LANE_IDS = ['L1', 'L2', 'L3', 'L4', 'L5', 'L6', 'L7', 'L8', 'L9', 'L10', 'L11', 'L12'] as const;
export const SCOPES = ['pr', 'main', 'nightly', 'release'] as const;
export const KINDS = ['node-script', 'jest', 'playwright', 'story-subjects', 'manual-record'] as const;
export const BROWSER_KINDS = new Set(['playwright', 'story-subjects']);
/** Lanes that consume the package tarball (REQ-QUAL-28; L11 canaries resolve their own, G-06). */
export const TARBALL_LANES = new Set(['L2', 'L3', 'L4']);
/** A node-script registration exits with this code to report `pending` (producer not landed). */
export const PENDING_EXIT = 75;
export const EXIT = { ok: 0, fail: 1, local: 2, usage: 64 } as const;
export const ROW_TIMEOUT_MS = 30 * 60 * 1000;
const GLOB_EXCLUDE = (p: string) => /(^|\/)(node_modules|dist|legacy|\.git|\.artifacts)(\/|$)/.test(p);
const STREAMS = ['plat', 'mat', 'cmp', 'surf', 'qual'] as const;

export type LaneId = (typeof LANE_IDS)[number];
export type Scope = (typeof SCOPES)[number];
export type Stream = (typeof STREAMS)[number];
export type State = 'pass' | 'fail' | 'pending' | 'double-pass' | 'pre-existing';

export interface Registration extends Omit<LaneRegistration, 'lane'> {
  lane: LaneId | 'L13' | 'L14';
  stream: Stream;
  source: string;
  /** built-ins only: jest config for a `jest` row (default: the verbatim root jest.config.js). */
  config?: string;
  /** built-ins only: the L12 unit-and-coverage row (REQ-QUAL-30). */
  coverage?: boolean;
}
export interface PendingBuiltin { lane: LaneId; path: string; producer: string }
export interface Registrations { rows: Registration[]; pending: PendingBuiltin[]; problems: string[] }

export interface RowResult {
  state: State;
  reason?: string;
  tests?: number;
  failed?: number;
  failedSuites?: string[];
  /** owners (contracts/ownership.json, lower-case) of the failing files; used for pre-existing attribution */
  failedOwners?: string[];
  durationMs?: number;
  records?: number;
  subjects?: string[];
  coverage?: Array<GroupResult & { owner: string }>;
  coveragePending?: Array<{ key: string; reason: string }>;
}
export interface ManifestResult extends RowResult { lane: string; stream: Stream; kind: string; path: string; scope: Scope; source: string | null; blockingFor?: string }

export interface Tools { node: string; jestBin: string; playwrightCli: string; npm: string }
export interface Tarball { source: 'env' | 'pack'; path: string }
export interface RowContext { root: string; evidenceDir: string; idx: number; scope: Scope; env: NodeJS.ProcessEnv; tools: Tools; tarball: Tarball | null }

export interface Args { lane: LaneId | 'all'; scope: Scope; verdict: string | null; line: '4x' | '5x' }

export function parseArgs(argv: readonly string[]): Args {
  const out: { lane: string | null; scope: string | null; verdict: string | null; line: string } = { lane: null, scope: null, verdict: null, line: '5x' };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    const v = argv[i + 1];
    if (a === '--lane') { out.lane = v ?? null; i++; }
    else if (a === '--scope') { out.scope = v ?? null; i++; }
    else if (a === '--verdict') { out.verdict = v ?? null; i++; }
    else if (a === '--line') { out.line = v ?? ''; i++; }
    else throw new Error(`unknown argument ${a}`);
  }
  if (out.lane !== 'all' && !(LANE_IDS as readonly string[]).includes(out.lane ?? '')) throw new Error(`--lane must be one of ${LANE_IDS.join('|')}|all (got ${out.lane})`);
  if (!(SCOPES as readonly string[]).includes(out.scope ?? '')) throw new Error(`--scope must be one of ${SCOPES.join('|')} (got ${out.scope})`);
  if (!['4x', '5x'].includes(out.line)) throw new Error(`--line must be 4x|5x (got ${out.line})`);
  return out as Args;
}

/** Evaluates a TypeScript config module (types-only imports) — same path under node and jest. */
export async function loadTsModule(file: string): Promise<Record<string, unknown>> {
  const res = await build({ entryPoints: [file], bundle: true, write: false, format: 'cjs', platform: 'node', logLevel: 'silent' });
  const module = { exports: {} as Record<string, unknown> };
  // Same evaluation path as src/contracts/load-fragments.mjs (works under node and jest's module registry).
  new Function('module', 'exports', 'require', res.outputFiles[0]!.text)(module, module.exports, createRequire(file));
  return module.exports;
}

const gateFile = (path: string) => path.trim().split(/\s+/)[0]!;

/** Built-ins + stream fragments, each tagged with its registering stream. A pending built-in whose gate is now
    registered (by its producer, in a fragment or a built-in) is dropped; one whose gate file exists but is not
    registered is a problem (the producer landed without wiring its gate). */
export async function loadRegistrations(root: string): Promise<Registrations> {
  const cfg = await loadTsModule(join(root, 'certification/lanes.config.ts'));
  const builtins = (cfg.BUILTINS ?? []) as Array<Omit<Registration, 'stream' | 'source'> & { owner?: Stream }>;
  const rows: Registration[] = builtins.map(({ owner, ...r }) => ({ ...r, stream: owner ?? 'qual', source: 'certification/lanes.config.ts' }));
  for (const f of await loadFragments('lanes', root)) {
    if (!Array.isArray(f.value)) throw new Error(`${f.file}: default export is not an array`);
    for (const r of f.value as LaneRegistration[]) {
      const { config: _c, coverage: _v, ...plain } = r as Registration; // fragment rows may not use built-in-only keys
      rows.push({ ...plain, stream: f.stream as Stream, source: f.file.slice(root.length + 1) });
    }
  }
  const problems: string[] = [];
  const pending: PendingBuiltin[] = [];
  for (const p of (cfg.PENDING_BUILTINS ?? []) as PendingBuiltin[]) {
    if (rows.some((r) => r.lane === p.lane && gateFile(r.path) === gateFile(p.path))) continue;
    if (existsSync(join(root, gateFile(p.path)))) problems.push(`${p.path} exists (producer ${p.producer} landed) but is not registered on ${p.lane}`);
    else pending.push(p);
  }
  return { rows, pending, problems };
}

const SCOPE_RANK: Record<Scope, number> = { pr: 0, main: 1, nightly: 2, release: 3 };

/** Rows of `lane` that run at `scope` (registration scope ≤ run scope), de-duplicated by lane/kind/path. */
export function selectRows(rows: readonly Registration[], lane: LaneId | 'all', scope: Scope): Registration[] {
  const seen = new Set<string>();
  return rows.filter((r) => {
    if (!(lane === 'all' || r.lane === lane) || !(r.scope in SCOPE_RANK) || SCOPE_RANK[r.scope] > SCOPE_RANK[scope]) return false;
    const key = `${r.lane}\0${r.kind}\0${r.path}\0${r.config ?? ''}\0${r.coverage ? 1 : 0}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

/** Stream owning the PR branch (contract §6.1 pre-existing attribution); null on next/main/release/tags. */
export function branchStream(branch: string | null | undefined, scope: Scope): Stream | null {
  if (scope !== 'pr' || !branch) return null;
  let m = branch.match(/^(?:next|4x|4x11)-(plat|mat|cmp|surf|qual)\//);
  if (m) return m[1] as Stream;
  m = branch.match(/^(?:next|4x|4x11)-fin\/([a-h])-/);
  if (m) return (({ a: 'plat', b: 'plat', c: 'plat', d: 'mat', e: 'cmp', f: 'surf', g: 'qual' }) as Record<string, Stream>)[m[1]!] ?? null;
  return null;
}

/** Mirror of jest.config.js testMatch / testPathIgnorePatterns (contract-v1.1 verbatim config). */
function isRootJestTest(p: string): boolean {
  return (/^(src|registry|showcase)\/.*\.test\.(ts|tsx)$/.test(p) || /^tests\/.*\.test\.(ts|tsx|mjs)$/.test(p)
    || /^fragments\/.*\.test\.ts$/.test(p) || /^scripts\/.*\.test\.(ts|mjs)$/.test(p)) && !/^(packages|apps|legacy|dist)\//.test(p);
}

export function expand(pattern: string, root: string): string[] {
  const out = globSync(pattern, { cwd: root, exclude: GLOB_EXCLUDE });
  return out.flatMap((p) => {
    const full = join(root, p);
    if (statSync(full).isDirectory()) return globSync(`${p}/**/*`, { cwd: root, exclude: GLOB_EXCLUDE }).filter((q) => statSync(join(root, q)).isFile());
    return [p];
  }).sort();
}

interface Spawned { status: number | null; signal: NodeJS.Signals | null; error: string | undefined; output: string; durationMs: number }

function run(cmd: string, args: readonly string[], cwd: string, env: NodeJS.ProcessEnv): Spawned {
  const t0 = Date.now();
  const r = spawnSync(cmd, args, { cwd, encoding: 'utf8', env, timeout: ROW_TIMEOUT_MS, maxBuffer: 256 * 1024 * 1024 });
  const output = `${r.stdout ?? ''}${r.stderr ?? ''}`;
  if (output) process.stdout.write(output.endsWith('\n') ? output : `${output}\n`);
  return { status: r.status, signal: r.signal, error: r.error?.message, output, durationMs: Date.now() - t0 };
}

const PENDING_MESSAGE = /(^|\n)\s*(?:AgPendingProducer: |Error: )?pending:/;
const allPending = (messages: readonly string[]) => messages.length > 0 && messages.every((m) => PENDING_MESSAGE.test(m));

function rowEnv(row: Registration, ctx: RowContext): NodeJS.ProcessEnv {
  return { ...ctx.env, AG_SCOPE: ctx.scope, AG_LANE: row.lane, ...(ctx.tarball ? { AURAGLASS_TARBALL: ctx.tarball.path } : {}) };
}

/** Node needs --experimental-strip-types for .ts gates before 22.18; harmless where types are stripped natively. */
const NODE_TS_FLAGS = (process as { features?: { typescript?: unknown } }).features?.typescript ? [] : ['--experimental-strip-types'];

function runNodeScript(row: Registration, ctx: RowContext): RowResult {
  const [script, ...args] = row.path.trim().split(/\s+/);
  if (!existsSync(join(ctx.root, script!))) return { state: 'fail', reason: `registered path missing: ${script}` };
  const r = run(ctx.tools.node, [...NODE_TS_FLAGS, script!, ...args], ctx.root, rowEnv(row, ctx));
  if (r.error || r.signal) return { state: 'fail', reason: `crashed: ${r.error ?? r.signal}`, durationMs: r.durationMs };
  if (r.status === PENDING_EXIT) return { state: 'pending', reason: `${script} reported pending (exit ${PENDING_EXIT})`, durationMs: r.durationMs };
  return { state: r.status === 0 ? 'pass' : 'fail', ...(r.status === 0 ? {} : { reason: `exit ${r.status}` }), durationMs: r.durationMs };
}

interface JestReport {
  success?: boolean; numTotalTests?: number; numFailedTests?: number; numRuntimeErrorTestSuites?: number;
  testResults?: Array<{ name: string; status: string; message?: string; failureMessage?: string; assertionResults?: Array<{ status: string; failureMessages?: string[] }> }>;
}

/** Repo-relative path of a tool-reported file (tools report real paths, e.g. /private/var for /var). */
export function relToRoot(p: string, root: string): string {
  if (!isAbsolute(p)) return p;
  const real = realpathSync(root);
  return relative(p.startsWith(real) ? real : root, p).split(sep).join('/');
}

function ownersOf(files: readonly string[], ctx: RowContext): string[] {
  if (!files.length || !existsSync(join(ctx.root, 'contracts/ownership.json'))) return [];
  const ownerOf = loadOwnerOf(ctx.root);
  return [...new Set(files.map((f) => ownerOf(f).toLowerCase()))];
}

function runJest(row: Registration, ctx: RowContext): RowResult {
  const outFile = join(ctx.evidenceDir, `jest-${ctx.idx}.json`);
  const workers = String(Math.max(1, Math.min(cpus().length, 4)));
  // The verbatim root config needs ESM vm-modules (as `npm test`); jest.qual.config.js runs everything through babel.
  const base = [...(row.config ? [] : ['--experimental-vm-modules']), ctx.tools.jestBin, ...(row.config ? ['-c', row.config] : []),
    '--ci', '--json', `--outputFile=${outFile}`, `--maxWorkers=${workers}`];
  let args: string[];
  let plan: ReturnType<typeof buildCoveragePlan> | null = null;
  let coverageDir: string | null = null;
  let subjectFiles: number;
  if (row.coverage) {
    // REQ-QUAL-30: `npm test` over every test by location, with the floors of certification/ratchets.json.
    plan = buildCoveragePlan(readRatchets(ctx.root), { flagship: flagshipDirs(ctx.root), seed: seedDirs(ctx.root) });
    coverageDir = join(ctx.evidenceDir, `coverage-${ctx.idx}`);
    args = [...base, '--coverage', `--coverageThreshold=${JSON.stringify(plan.threshold)}`, `--coverageDirectory=${coverageDir}`,
      '--coverageReporters=json-summary', '--coverageReporters=text-summary',
      ...plan.collectCoverageFrom.map((g) => `--collectCoverageFrom=${g}`),
      ...plan.coveragePathIgnorePatterns.map((g) => `--coveragePathIgnorePatterns=${g}`)];
    subjectFiles = 1;
  } else {
    const files = expand(row.path, ctx.root);
    if (!files.length) return { state: 'fail', reason: `registered path matches nothing: ${row.path}`, tests: 0 };
    const isTest = row.config ? (p: string) => /\.test\.(ts|tsx|mjs|js)$/.test(p) : isRootJestTest;
    const tests = files.filter(isTest);
    const sources = files.filter((f) => !isTest(f));
    // Test files run directly; non-test paths (e.g. rule sources) run the tests that import them.
    args = tests.length ? [...base, '--runTestsByPath', ...tests] : [...base, '--findRelatedTests', ...sources];
    subjectFiles = files.length;
  }
  const r = run(ctx.tools.node, args, ctx.root, rowEnv(row, ctx));
  let report: JestReport | null = null;
  try { report = JSON.parse(readFileSync(outFile, 'utf8')) as JestReport; } catch { /* crash: no report */ }
  if (!report) return { state: 'fail', reason: `jest wrote no report (exit ${r.status}${r.signal ? `, ${r.signal}` : ''})`, tests: 0, durationMs: r.durationMs };
  const total = report.numTotalTests ?? 0;
  if (total === 0) return { state: 'fail', reason: `0 tests for ${subjectFiles} subject file(s)`, tests: 0, durationMs: r.durationMs };
  const failedSuites = (report.testResults ?? []).filter((s) => s.status !== 'passed').map((s) => relToRoot(s.name, ctx.root));
  const messages = (report.testResults ?? []).filter((s) => s.status !== 'passed').flatMap((s) => {
    const failing = (s.assertionResults ?? []).filter((a) => a.status === 'failed').flatMap((a) => a.failureMessages ?? []);
    return failing.length ? failing : [s.failureMessage ?? s.message ?? ''];
  });
  let coverage: RowResult['coverage'];
  let coverageFailed = false;
  if (plan && coverageDir) {
    const summaryFile = join(coverageDir, 'coverage-summary.json');
    if (!existsSync(summaryFile)) return { state: 'fail', reason: 'jest wrote no coverage-summary.json', tests: total, durationMs: r.durationMs };
    const groups = evaluateCoverage(JSON.parse(readFileSync(summaryFile, 'utf8')), plan.threshold, ctx.root);
    const ownerOf = existsSync(join(ctx.root, 'contracts/ownership.json')) ? loadOwnerOf(ctx.root) : () => 'QUAL';
    coverage = groups.map((g) => ({ ...g, owner: (g.key === 'global' ? 'QUAL' : ownerOf(`${g.key.slice(2)}index.ts`)).toLowerCase() }));
    coverageFailed = groups.some((g) => g.state === 'fail');
  }
  const testsOk = r.status === 0 && report.success === true;
  const common = { tests: total, failed: report.numFailedTests ?? 0, failedSuites, durationMs: r.durationMs,
    ...(coverage ? { coverage, coveragePending: plan!.pending } : {}) };
  if (!failedSuites.length && !coverageFailed && testsOk) return { state: 'pass', ...common };
  if (!coverageFailed && failedSuites.length && allPending(messages)) return { state: 'pending', reason: 'every failure is a pending-producer error', ...common };
  const failedOwners = [...new Set([...ownersOf(failedSuites, ctx), ...(coverage ?? []).filter((g) => g.state === 'fail').map((g) => g.owner)])];
  const why = [failedSuites.length ? `jest: ${report.numFailedTests ?? 0} failed test(s), ${report.numRuntimeErrorTestSuites ?? 0} suite error(s)` : '',
    coverageFailed ? `coverage below floor: ${(coverage ?? []).filter((g) => g.state === 'fail').map((g) => g.key).join(', ')}` : '',
    !failedSuites.length && !coverageFailed ? `jest exit ${r.status}` : ''].filter(Boolean).join('; ');
  return { state: 'fail', reason: why, failedOwners, ...common };
}

interface PwSuite { file?: string; specs?: Array<{ file?: string; tests?: Array<{ status?: string; results?: Array<{ error?: { message?: string }; errors?: Array<{ message?: string }> }> }> }>; suites?: PwSuite[] }
interface PwReport { stats?: { expected?: number; unexpected?: number; flaky?: number; skipped?: number }; suites?: PwSuite[]; errors?: Array<{ message?: string }> }

/** QUAL's certification specs (certification/**) run under certification/playwright.cert.config.ts (its testDir is
    certification/); stream specs (tests/{a11y/apg,e2e,visual,ssr,rsc}/<stream>/**, canaries, …) under the verbatim root
    playwright.config.ts, whose projects and fragment projects own them. null = a row mixing both. */
export function playwrightConfigFor(files: readonly string[]): string | null {
  const cert = files.filter((f) => f.startsWith('certification/'));
  if (cert.length === files.length) return 'certification/playwright.cert.config.ts';
  return cert.length ? null : 'playwright.config.ts';
}

/** Playwright JSON report → counts. A failing test whose error starts with `pending:` is a producer that has not
    landed (PRD-F §4.3 rule 2; lanes throw it only below release scope). */
export function classifyPlaywrightReport(report: PwReport): { total: number; failed: number; pendingOnly: boolean; pendingReasons: string[] } {
  const tests: Array<{ status?: string; results?: Array<{ error?: { message?: string }; errors?: Array<{ message?: string }> }> }> = [];
  const walk = (suite: PwSuite) => {
    for (const spec of suite.specs ?? []) for (const t of spec.tests ?? []) tests.push(t);
    for (const s of suite.suites ?? []) walk(s);
  };
  for (const s of report.suites ?? []) walk(s);
  const failed = tests.filter((t) => t.status === 'unexpected');
  const pendingRe = /(^|[\s:])pending: /;
  const reasons = failed.map((t) => {
    const last = (t.results ?? []).at(-1);
    return String(last?.error?.message ?? last?.errors?.[0]?.message ?? '');
  });
  const pending = reasons.filter((m) => pendingRe.test(m));
  return { total: tests.length, failed: failed.length, pendingOnly: failed.length > 0 && pending.length === failed.length,
    pendingReasons: [...new Set(pending.map((m) => m.slice(m.search(pendingRe)).trim().split('\n')[0]!))] };
}

/** Spec files the cert config cannot run: outside certification/lanes and outside every `<stream>:cert-*` fragment
    project (REQ-QUAL-12: the cert config lists only those). Reported with the fix instead of Playwright's bare
    "No tests found". */
export function uncoveredSpecs(files: readonly string[], root: string, certTestDirs: readonly string[]): string[] {
  const dirs = [join(root, 'certification/lanes'), ...certTestDirs].map((d) => (d.endsWith('/') ? d : `${d}/`));
  return files.filter((f) => !dirs.some((d) => join(root, f).startsWith(d)));
}

/** L6 capture evidence written by certification/lanes/environment-visual.spec.ts (plan + per-worker capture rows). */
export function readCaptureEvidence(evidenceDir: string): { plan: { cells?: string[]; subjects?: string[]; tarball?: { sha256?: string }; storybookIndexSha256?: string }; captures: number; captureRate: number | null } | null {
  const dir = join(evidenceDir, 'environment-visual');
  if (!existsSync(join(dir, 'plan.json'))) return null;
  const plan = JSON.parse(readFileSync(join(dir, 'plan.json'), 'utf8'));
  const rows = globSync('captures-*.jsonl', { cwd: dir })
    .flatMap((f) => readFileSync(join(dir, f), 'utf8').split('\n').filter(Boolean).map((l) => JSON.parse(l) as { captures?: number; durationMs?: number }));
  const captures = rows.reduce((n, r) => n + (r.captures ?? 0), 0);
  const seconds = rows.reduce((n, r) => n + (r.durationMs ?? 0), 0) / 1000;
  return { plan, captures, captureRate: captures && seconds ? captures / seconds : null };
}

async function runPlaywright(row: Registration, ctx: RowContext): Promise<RowResult> {
  const files = expand(row.path, ctx.root).filter((f) => /\.spec\.(ts|tsx|js|mjs)$/.test(f));
  if (!files.length) return { state: 'fail', reason: `registered path matches no spec: ${row.path}` };
  const outFile = join(ctx.evidenceDir, `playwright-${ctx.idx}.json`);
  const config = playwrightConfigFor(files);
  if (!config) return { state: 'fail', reason: `registered path mixes certification/ and stream specs: ${row.path} (register them separately)` };
  if (config === 'certification/playwright.cert.config.ts' && existsSync(join(ctx.root, 'certification/lanes/_fixtures/fragments.ts'))) {
    const { loadCertProjects } = await loadTsModule(join(ctx.root, 'certification/lanes/_fixtures/fragments.ts')) as
      { loadCertProjects: (root: string) => { projects: Array<{ testDir: string }> } };
    const uncovered = uncoveredSpecs(files, ctx.root, loadCertProjects(ctx.root).projects.map((p) => p.testDir));
    if (uncovered.length) {
      return { state: 'fail', reason: `${uncovered.length} spec(s) outside certification/lanes and every ${row.stream}:cert-* project — register a `
        + `'${row.stream}:cert-<id>' project in fragments/playwright/${row.stream}.json covering: ${uncovered.slice(0, 5).join(', ')}${uncovered.length > 5 ? ', …' : ''}` };
    }
  }
  const r = run(ctx.tools.node, [ctx.tools.playwrightCli, 'test', '-c', config, '--reporter=line,json', ...files],
    ctx.root, { ...rowEnv(row, ctx), PLAYWRIGHT_JSON_OUTPUT_NAME: outFile, AG_LANE_EVIDENCE_DIR: ctx.evidenceDir });
  if (r.error || r.signal) return { state: 'fail', reason: `crashed: ${r.error ?? r.signal}`, durationMs: r.durationMs };
  let report: PwReport | null = null;
  try { report = JSON.parse(readFileSync(outFile, 'utf8')) as PwReport; } catch { /* no report */ }
  if (!report?.stats) return { state: 'fail', reason: `playwright wrote no report (exit ${r.status})`, tests: 0, durationMs: r.durationMs };
  const s = report.stats;
  const total = (s.expected ?? 0) + (s.unexpected ?? 0) + (s.flaky ?? 0);
  if (total === 0) return { state: 'fail', reason: `0 tests ran for ${files.length} spec file(s)`, tests: 0, durationMs: r.durationMs };
  const failing: Array<{ file: string; messages: string[] }> = [];
  const visit = (suite: PwSuite) => {
    for (const spec of suite.specs ?? []) for (const t of spec.tests ?? []) {
      if (t.status === 'unexpected') failing.push({ file: spec.file ?? suite.file ?? '', messages: (t.results ?? []).map((x) => x.error?.message ?? '').filter(Boolean) });
    }
    (suite.suites ?? []).forEach(visit);
  };
  (report.suites ?? []).forEach(visit);
  const messages = [...failing.flatMap((f) => f.messages), ...(report.errors ?? []).map((e) => e.message ?? '')];
  const common = { tests: total, failed: s.unexpected ?? 0, durationMs: r.durationMs };
  if (r.status === 0 && !(s.unexpected ?? 0)) return { state: 'pass', ...common };
  if (allPending(messages)) return { state: 'pending', reason: 'every failure is a pending-producer error', ...common };
  // Playwright reports spec files relative to the config's testDir (tests/ or certification/).
  const testDir = config === 'playwright.config.ts' ? 'tests/' : 'certification/';
  const failedSuites = [...new Set(failing.map((f) => f.file).filter(Boolean).map((f) => (isAbsolute(f) ? relToRoot(f, ctx.root) : f.startsWith(testDir) ? f : `${testDir}${f}`)))];
  return { state: 'fail', reason: `playwright: ${s.unexpected ?? 0} failed test(s) (exit ${r.status})`, failedSuites, failedOwners: ownersOf(failedSuites, ctx), ...common };
}

function runManualRecord(row: Registration, ctx: RowContext): RowResult {
  const files = expand(row.path, ctx.root);
  return files.length ? { state: 'pass', records: files.length } : { state: 'pending', reason: `no record at ${row.path}` };
}

/** Subjects of the story files matched by the row, resolved through the SubjectIndex (REPORTS.subjects). */
async function runStorySubjects(row: Registration, ctx: RowContext): Promise<RowResult> {
  const files = expand(row.path, ctx.root).filter((f) => /\.stories\.(ts|tsx|js|jsx|mdx)$/.test(f));
  if (!files.length) return { state: 'fail', reason: `registered path matches no story file: ${row.path}` };
  const manifestFile = join(ctx.root, 'storybook-static/cert-manifest.json');
  if (!existsSync(manifestFile)) return { state: 'pending', reason: 'storybook-static/cert-manifest.json not built (qual:build:storybook)' };
  const index = JSON.parse(readFileSync(manifestFile, 'utf8')) as { stories?: Array<{ id: string; subject: string; importPath?: string }> };
  const storyIndex = existsSync(join(ctx.root, 'storybook-static/index.json'))
    ? (JSON.parse(readFileSync(join(ctx.root, 'storybook-static/index.json'), 'utf8')) as { entries?: Record<string, { importPath?: string }> }).entries ?? {}
    : {};
  const wanted = new Set(files.map((f) => `./${f}`));
  const subjects = [...new Set((index.stories ?? []).filter((s) => wanted.has(storyIndex[s.id]?.importPath ?? s.importPath ?? '')).map((s) => s.subject))].sort();
  if (!subjects.length) return { state: 'fail', reason: `${files.length} story file(s) but 0 subjects in the SubjectIndex`, subjects };
  // Capturing subject cells is the capture driver's (REQ-QUAL-12, G-12); until it lands the subjects are pending.
  const driver = 'certification/lanes/environment-visual.spec.ts';
  if (!existsSync(join(ctx.root, driver))) return { state: 'pending', reason: `capture driver ${driver} (G-12) not merged`, subjects };
  const r = await runPlaywright({ ...row, kind: 'playwright', path: driver }, { ...ctx, env: { ...ctx.env, AG_SUBJECTS: subjects.join(',') } });
  return { ...r, subjects };
}

export async function executeRow(row: Registration, ctx: RowContext): Promise<RowResult> {
  if (!(KINDS as readonly string[]).includes(row.kind)) return { state: 'fail', reason: `unknown kind ${row.kind}` };
  if (row.failClosed !== true) return { state: 'fail', reason: 'registration must set failClosed: true (S-43)' };
  if (BROWSER_KINDS.has(row.kind) && row.remote !== true) return { state: 'fail', reason: `remote:false is not allowed for browser kind ${row.kind}` };
  switch (row.kind) {
    case 'node-script': return runNodeScript(row, ctx);
    case 'jest': return runJest(row, ctx);
    case 'playwright': return runPlaywright(row, ctx);
    case 'manual-record': return runManualRecord(row, ctx);
    case 'story-subjects': return runStorySubjects(row, ctx);
    default: return { state: 'fail', reason: `unknown kind ${String(row.kind)}` };
  }
}

/** REQ-QUAL-28: the package tarball for L2/L3/L4 — AURAGLASS_TARBALL (plat:package:pack dotenv) or, if unset,
    `npm pack --pack-destination .artifacts/pack` of the working tree (needs a built dist/). Throws when the
    tarball cannot be produced, so the lane fails closed instead of testing an empty package. */
export function resolveTarball(root: string, env: NodeJS.ProcessEnv, tools: Pick<Tools, 'npm'> = { npm: 'npm' }): Tarball {
  const fromEnv = env.AURAGLASS_TARBALL?.trim();
  if (fromEnv) {
    const p = isAbsolute(fromEnv) ? fromEnv : resolve(root, fromEnv);
    if (!existsSync(p)) throw new Error(`AURAGLASS_TARBALL=${fromEnv} does not exist`);
    return { source: 'env', path: p };
  }
  const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8')) as { files?: string[] };
  if ((pkg.files ?? []).includes('dist') && !existsSync(join(root, 'dist'))) {
    throw new Error('AURAGLASS_TARBALL unset and dist/ missing: needs plat:package:pack (dotenv) or plat:build:dist artifacts');
  }
  const dest = join(root, '.artifacts/pack');
  mkdirSync(dest, { recursive: true });
  // `npm pack` prints the tarball file name as the last line of stdout (notices go to stderr).
  const out = execFileSync(tools.npm, ['pack', '--pack-destination', dest], { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], maxBuffer: 64 * 1024 * 1024 });
  const name = out.trim().split('\n').pop()?.trim();
  const file = name ? join(dest, name) : null;
  if (!file || !name!.endsWith('.tgz') || !existsSync(file)) throw new Error(`npm pack produced no tarball in ${dest} (stdout: ${out.trim().slice(-200)})`);
  return { source: 'pack', path: file };
}

/** REQ-QUAL-06 sentinel set: every affected-subject PR lane carries these subject-states; a sentinel whose
    component is still a contract seed (or has no ComponentMeta) is pending. */
export const CAPTURE_DRIVER = 'certification/lanes/environment-visual.spec.ts';

export async function sentinelResults(sentinels: ReadonlyArray<{ subject: string; story?: string; state?: string }>, lane: LaneId, ctx: RowContext): Promise<ManifestResult[]> {
  const { root, scope } = ctx;
  const metaFiles = globSync('src/**/*.meta.ts', { cwd: root, exclude: GLOB_EXCLUDE });
  const out: ManifestResult[] = [];
  for (const [i, s] of sentinels.entries()) {
    const base = { lane, stream: 'qual' as const, kind: 'story-subjects', path: `sentinel:${s.subject}:${s.state ?? s.story}`, scope, source: 'certification/matrix.config.ts', subjects: [s.subject] };
    const meta = metaFiles.find((f) => new RegExp(`\\bname:\\s*['"]${s.subject}['"]`).test(readFileSync(join(root, f), 'utf8')));
    if (!meta) { out.push({ ...base, state: 'pending', reason: `sentinel ${s.subject} has no ComponentMeta yet (seed)` }); continue; }
    const dir = meta.slice(0, meta.lastIndexOf('/'));
    const seeded = globSync(`${dir}/*.{ts,tsx}`, { cwd: root }).some((f) => /@ag-contract-seed|data-ag-seed/.test(readFileSync(join(root, f), 'utf8')));
    if (seeded) { out.push({ ...base, state: 'pending', reason: `sentinel ${s.subject} is still a contract seed (${dir})` }); continue; }
    if (!existsSync(join(root, CAPTURE_DRIVER))) { out.push({ ...base, state: 'pending', reason: `capture driver ${CAPTURE_DRIVER} (G-12) not merged` }); continue; }
    const row: Registration = { lane, kind: 'playwright', path: CAPTURE_DRIVER, scope, remote: true, failClosed: true, stream: 'qual', source: base.source };
    const res = await runPlaywright(row, { ...ctx, idx: 1000 + i, env: { ...ctx.env, AG_SUBJECTS: s.subject, ...(s.state ? { AG_SUBJECT_STATES: s.state } : {}) } });
    out.push({ ...base, ...res, subjects: [s.subject] });
  }
  return out;
}

function sha256(file: string): string | null {
  return existsSync(file) ? createHash('sha256').update(readFileSync(file)).digest('hex') : null;
}

function gitSha(root: string, env: NodeJS.ProcessEnv): string | null {
  if (env.CI_COMMIT_SHA) return env.CI_COMMIT_SHA;
  try { return execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim(); } catch { return null; }
}

interface Schema { enum?: unknown[]; type?: string | string[]; required?: string[]; properties?: Record<string, Schema>; items?: Schema }

/** Minimal JSON-schema check for the manifest (types, required keys, enums) — no extra dependency. */
export function validateManifest(manifest: unknown, schema: Schema): string[] {
  const errors: string[] = [];
  const check = (value: unknown, s: Schema, path: string) => {
    if (s.enum && !s.enum.includes(value)) errors.push(`${path}: ${JSON.stringify(value)} not in enum`);
    const types = s.type ? ([] as string[]).concat(s.type) : null;
    if (types) {
      const t = value === null ? 'null' : Array.isArray(value) ? 'array' : Number.isInteger(value) ? 'integer' : typeof value;
      if (!types.includes(t) && !(t === 'integer' && types.includes('number'))) { errors.push(`${path}: type ${t}, expected ${types.join('|')}`); return; }
    }
    if (s.required && value !== null && typeof value === 'object') for (const k of s.required) if (!(k in value)) errors.push(`${path}.${k}: required`);
    if (s.properties && value && typeof value === 'object') for (const [k, sub] of Object.entries(s.properties)) if (k in value) check((value as Record<string, unknown>)[k], sub, `${path}.${k}`);
    if (s.items && Array.isArray(value)) value.forEach((v, i) => check(v, s.items!, `${path}[${i}]`));
  };
  check(manifest, schema, '$');
  return errors;
}

export interface MainOptions { root: string; env?: NodeJS.ProcessEnv; tools?: Partial<Tools> }
export interface MainResult { code: number; manifestPath: string | null; manifest: Record<string, unknown> | null }

export async function runLanes(argv: readonly string[], opts: MainOptions): Promise<MainResult> {
  const env = opts.env ?? process.env;
  const root = opts.root;
  let args: Args;
  try { args = parseArgs(argv); } catch (e) { console.error(`run.mjs: ${(e as Error).message}`); return { code: EXIT.usage, manifestPath: null, manifest: null }; }
  const command = `node certification/run.mjs ${argv.join(' ')}`;
  if (!(env.CI === 'true' || env.AG_REMOTE_RUNNER === '1' || env.AG_CERT_ALLOW_LOCAL === '1')) {
    console.error(`run.mjs: certification lanes run only on GitLab CI or the gated remote runner (machine policy).\nRemote command: ${command}`);
    return { code: EXIT.local, manifestPath: null, manifest: null };
  }
  const tools: Tools = { node: process.execPath, jestBin: join(root, 'node_modules/jest/bin/jest.js'), playwrightCli: join(root, 'node_modules/@playwright/test/cli.js'), npm: 'npm', ...opts.tools };
  const t0 = Date.now();
  const jobSlug = env.CI_JOB_NAME_SLUG || `qual-certify-${args.lane.toLowerCase()}`;
  const evidenceDir = join(root, env.AURAGLASS_EVIDENCE_DIR || '.artifacts', 'qual', jobSlug);
  mkdirSync(evidenceDir, { recursive: true });
  const manifestPath = join(evidenceDir, 'lane-manifest.json');

  let regs: Registrations;
  let matrix: { SENTINELS?: Array<{ subject: string; story?: string; state?: string }>; SENTINEL_LANES?: string[] } = {};
  try {
    regs = await loadRegistrations(root);
    if (existsSync(join(root, 'certification/matrix.config.ts'))) matrix = await loadTsModule(join(root, 'certification/matrix.config.ts'));
  } catch (e) {
    console.error(`run.mjs: failed to load lane registrations: ${(e as Error).stack ?? (e as Error).message}`);
    return { code: EXIT.fail, manifestPath: null, manifest: null };
  }
  const lanes: readonly string[] = args.lane === 'all' ? LANE_IDS : [args.lane];
  const rows = selectRows(regs.rows, args.lane, args.scope);
  const prStream = branchStream(env.CI_COMMIT_BRANCH || env.CI_COMMIT_REF_NAME, args.scope);
  const results: ManifestResult[] = [];
  const push = (entry: ManifestResult) => results.push(Object.fromEntries(Object.entries(entry).filter(([, v]) => v !== undefined)) as ManifestResult);
  for (const p of regs.problems) push({ lane: args.lane === 'all' ? 'L1' : args.lane, stream: 'qual', kind: 'node-script', path: 'certification/lanes.config.ts', scope: args.scope, source: 'certification/lanes.config.ts', state: 'fail', reason: p });

  let tarball: Tarball | null = null;
  let tarballError: string | null = null;
  if (rows.some((r) => TARBALL_LANES.has(r.lane))) {
    try { tarball = resolveTarball(root, env, tools); console.log(`tarball (${tarball.source}): ${tarball.path}`); } catch (e) { tarballError = (e as Error).message; }
  }
  for (const [idx, row] of rows.entries()) {
    console.log(`\n=== [${row.lane}] ${row.stream} ${row.kind} ${row.path} (${row.source})`);
    let res: RowResult;
    if (TARBALL_LANES.has(row.lane) && tarballError) res = { state: 'fail', reason: `tarball: ${tarballError}` };
    else {
      try { res = await executeRow(row, { root, evidenceDir, idx, scope: args.scope, env, tools, tarball: TARBALL_LANES.has(row.lane) ? tarball : null }); } catch (e) { res = { state: 'fail', reason: `runner crash: ${(e as Error).message}` }; }
    }
    let entry: ManifestResult = { lane: row.lane, stream: row.stream, kind: row.kind, path: row.path, scope: args.scope, source: row.source, ...res };
    if (res.state === 'fail' && prStream) {
      const owners = res.failedOwners?.length ? res.failedOwners : [row.stream];
      if (!owners.includes(prStream)) entry = { ...entry, state: 'pre-existing', blockingFor: owners.join(',') };
    }
    console.log(`=== [${row.lane}] ${entry.state}${entry.reason ? ` — ${entry.reason}` : ''}`);
    push(entry);
  }
  for (const p of regs.pending.filter((p) => lanes.includes(p.lane))) {
    push({ lane: p.lane, stream: 'qual', kind: 'node-script', path: p.path, scope: args.scope, source: 'certification/lanes.config.ts', state: 'pending', reason: `producer ${p.producer} not merged` });
  }
  if (args.scope === 'pr') {
    for (const l of lanes.filter((l) => (matrix.SENTINEL_LANES ?? []).includes(l))) {
      const ctx: RowContext = { root, evidenceDir, idx: 0, scope: args.scope, env, tools, tarball: null };
      for (const s of await sentinelResults(matrix.SENTINELS ?? [], l as LaneId, ctx)) push(s);
    }
  }
  for (const l of lanes) {
    // REQ-QUAL-06: 0 subjects → pending at pr/main/nightly, fail at release.
    if (!results.some((r) => r.lane === l)) push({ lane: l, stream: 'qual', kind: 'node-script', path: '(no registrations)', scope: args.scope, source: null, state: 'pending', reason: '0 subjects registered for this lane at this scope' });
  }
  if (args.scope === 'release') {
    // G-01: at release pending, double-pass and pre-existing are not pass.
    for (const r of results) if (r.state === 'pending' || r.state === 'double-pass') { r.reason = `${r.state} at release scope${r.reason ? `: ${r.reason}` : ''}`; r.state = 'fail'; }
  }
  const tests = results.reduce((n, r) => n + (r.tests ?? 0), 0);
  // L6 (REQ-QUAL-04/-12): planned cells, live subjects, the packed tarball's sha256 and the measured capture rate.
  const capture = readCaptureEvidence(evidenceDir);
  const manifest: Record<string, unknown> = {
    version: 1, lane: args.lane, line: args.line, sha: gitSha(root, env), scope: args.scope,
    branch: env.CI_COMMIT_BRANCH || env.CI_COMMIT_REF_NAME || null, prStream,
    runnerTag: env.CI_RUNNER_TAGS || null, imageDigest: env.CI_JOB_IMAGE || null, browserVersions: {},
    subjects: [...new Set([...results.flatMap((r) => r.subjects ?? [r.path]), ...(capture?.plan.subjects ?? [])])], cells: capture?.plan.cells ?? [], results,
    tarball: tarball ? { source: tarball.source, file: tarball.path.startsWith(root) ? tarball.path.slice(root.length + 1) : tarball.path, sha256: sha256(tarball.path) } : null,
    thresholdsSha256: sha256(join(root, 'certification/thresholds.json')),
    scenesSha256: sha256(join(root, 'certification/scenes/scenes.manifest.json')),
    inventorySha256: sha256(join(root, 'storybook-static/cert-manifest.json')),
    durationMs: Date.now() - t0, captureRate: capture?.captureRate ?? null,
    ...(capture ? { tarballSha256: capture.plan.tarball?.sha256 ?? null, storybookIndexSha256: capture.plan.storybookIndexSha256 ?? null, captures: capture.captures } : {}),
    summary: Object.fromEntries(['pass', 'fail', 'pending', 'pre-existing', 'double-pass'].map((s) => [s, results.filter((r) => r.state === s).length])),
    tests,
  };
  const schema = JSON.parse(readFileSync(join(root, 'certification/schemas/lane-manifest.schema.json'), 'utf8')) as Schema;
  const errors = validateManifest(manifest, schema);
  writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
  console.log(`\nlane-manifest: ${manifestPath.slice(root.length + 1)}  ${JSON.stringify(manifest.summary)}`);
  if (errors.length) { console.error(`run.mjs: lane manifest invalid:\n${errors.join('\n')}`); return { code: EXIT.fail, manifestPath, manifest }; }
  if (args.verdict) {
    // The release verdict (REQ-QUAL-32/S-55) is G-16's; without it a release run cannot pass.
    console.error('run.mjs: --verdict is produced by the release-verdict work item (G-16); no verdict written, failing closed.');
    return { code: EXIT.fail, manifestPath, manifest };
  }
  const blocking = results.filter((r) => r.state === 'fail');
  if (blocking.length) {
    console.error(`run.mjs: ${blocking.length} blocking failure(s):\n${blocking.map((r) => `  [${r.lane}] ${r.stream} ${r.path}: ${r.reason}`).join('\n')}`);
    return { code: EXIT.fail, manifestPath, manifest };
  }
  return { code: EXIT.ok, manifestPath, manifest };
}
