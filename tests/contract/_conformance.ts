/* Contract conformance support (QUAL, REQ-QUAL-70 / contract §6.3).

   Every §6.3 test reports problems as `Violation`s through `conform()`:
   - each failure line names the seam id (S-xx) and the owning stream of the
     offending path, read from contracts/ownership.json (first match wins);
   - each violation is classified `introduced` (the path is changed on this
     branch relative to its base line) or `pre-existing` (the path is not);
   - `introduced` violations always fail the test;
   - `pre-existing` violations fail in strict mode (GA version, or AG_SCOPE
     release) and are otherwise recorded as `pending` for the lane runner in
     `<evidence dir>/qual/contract-conformance/<suite>.json` (contract §6.3:
     "a failure that pre-dates the PR is pre-existing for other streams").
   Nothing is skipped: every check runs on every invocation, and the pending
   record is part of the job's evidence, never a console warning. */
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join, relative, resolve, sep } from 'node:path';
import picomatch from 'picomatch';

export const ROOT = resolve(__dirname, '..', '..');
export const rel = (abs: string) => relative(ROOT, abs).split(sep).join('/');

// ---------------------------------------------------------------- ownership
interface OwnershipRow { id: string; glob: string; owner: string; lines?: string[] }
const OWNERSHIP = JSON.parse(readFileSync(join(ROOT, 'contracts', 'ownership.json'), 'utf8')) as { rows: OwnershipRow[] };
const MATCHERS = OWNERSHIP.rows.filter((r) => !r.lines).map((r) => ({ row: r, test: picomatch(r.glob, { dot: true }) }));

/** Owning stream of a repo-relative path (contracts/ownership.json, first match wins). */
export function ownerOf(path: string): string {
  const hit = MATCHERS.find((m) => m.test(path));
  return hit ? hit.row.owner : 'NONE';
}

// ---------------------------------------------------------------- mode
const PKG = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8')) as { version: string };
/** Strict = GA: every violation fails, pending is not allowed (contract §6.3, "pending mode before GA"). */
export const STRICT = process.env.AG_SCOPE === 'release' || !/-/.test(PKG.version) || process.env.AG_CONFORMANCE_STRICT === '1';

// ---------------------------------------------------------------- change classification
function git(args: string[]): string | null {
  try {
    return execFileSync('git', args, { cwd: ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
  } catch {
    return null;
  }
}

export interface ChangeSet { base: string | null; how: string; paths: Set<string> | null }

let changeSet: ChangeSet | undefined;
/** Paths changed on this branch relative to its base line. `paths: null` = the base could not be
    resolved, in which case every violation is classified `introduced` (fail closed). */
export function changes(): ChangeSet {
  if (changeSet) return changeSet;
  const baseRef = process.env.AG_CONFORMANCE_BASE ?? process.env.CI_MERGE_REQUEST_DIFF_BASE_SHA ?? 'origin/next';
  if (!git(['rev-parse', '--verify', '--quiet', `${baseRef}^{commit}`]) && process.env.CI && baseRef === 'origin/next') {
    // CI branch pipelines fetch only their own ref; fetch the base line read-only (same as contract:ownership).
    git(['fetch', '--no-tags', 'origin', '+refs/heads/next:refs/remotes/origin/next']);
  }
  const baseSha = git(['rev-parse', '--verify', '--quiet', `${baseRef}^{commit}`]);
  if (!baseSha) {
    changeSet = { base: null, how: `base ${baseRef} unavailable`, paths: null };
    return changeSet;
  }
  const mergeBase = git(['merge-base', baseSha, 'HEAD']);
  const from = mergeBase ?? baseSha;
  const committed = git(['diff', '--name-only', from, 'HEAD']);
  const working = git(['diff', '--name-only', 'HEAD']);
  const untracked = git(['ls-files', '--others', '--exclude-standard']);
  if (committed === null) {
    changeSet = { base: null, how: `diff against ${baseRef} failed`, paths: null };
    return changeSet;
  }
  const paths = new Set<string>();
  for (const block of [committed, working ?? '', untracked ?? '']) for (const p of block.split('\n')) if (p) paths.add(p);
  changeSet = { base: from, how: mergeBase ? `merge-base with ${baseRef}` : `two-dot diff with ${baseRef}`, paths };
  return changeSet;
}

export type ViolationClass = 'introduced' | 'pre-existing';
export function classify(file: string): ViolationClass {
  const { paths } = changes();
  if (paths === null) return 'introduced';
  return paths.has(file) ? 'introduced' : 'pre-existing';
}

// ---------------------------------------------------------------- violations
export interface Violation {
  /** Contract seam id, e.g. 'S-01'. */
  seam: string;
  /** Repo-relative path of the offending file (owner and classification are derived from it). */
  file: string;
  detail: string;
  /** Override the ownership lookup (e.g. a seam whose owner is fixed by the contract). */
  owner?: string;
}
export interface ReportedViolation extends Required<Violation> { class: ViolationClass; status: 'fail' | 'pending' }

export function describeViolation(v: Violation): string {
  const owner = v.owner ?? ownerOf(v.file);
  return `[${v.seam} owner=${owner} ${classify(v.file)}] ${v.file}: ${v.detail}`;
}

const REPORTS = new Map<string, { checks: number; results: ReportedViolation[] }>();

function evidenceFile(suite: string) {
  const dir = join(process.env.AURAGLASS_EVIDENCE_DIR ?? join(ROOT, '.artifacts'), 'qual', 'contract-conformance');
  return join(dir, `${suite}.json`);
}

function flush(suite: string) {
  const r = REPORTS.get(suite)!;
  const file = evidenceFile(suite);
  mkdirSync(dirname(file), { recursive: true });
  const cs = changes();
  writeFileSync(file, `${JSON.stringify({
    version: 1, suite, sha: git(['rev-parse', 'HEAD']), base: cs.base, baseHow: cs.how, strict: STRICT,
    checks: r.checks, results: r.results,
  }, null, 2)}\n`);
}

/** Applies the §6.3 failure policy to one check's violations: throws for every `introduced`
    violation (and for every violation in strict mode); records the rest as `pending`.
    Returns the pending violations so callers can assert on them. */
export function conform(suite: string, check: string, violations: readonly Violation[], opts: { notYetDue?: boolean } = {}): ReportedViolation[] {
  const entry = REPORTS.get(suite) ?? { checks: 0, results: [] };
  REPORTS.set(suite, entry);
  entry.checks += 1;
  const reported = violations.map((v): ReportedViolation => {
    const cls = classify(v.file);
    return {
      seam: v.seam, file: v.file, detail: `${check}: ${v.detail}`, owner: v.owner ?? ownerOf(v.file),
      // notYetDue: the seam's GA line is later than this version (e.g. a ga '5.1' entry at 5.0).
      class: cls, status: !opts.notYetDue && (STRICT || cls === 'introduced') ? 'fail' : 'pending',
    };
  });
  entry.results.push(...reported);
  flush(suite);
  const failing = reported.filter((r) => r.status === 'fail');
  if (failing.length > 0) {
    const lines = failing.map((f) => `  [${f.seam} owner=${f.owner} ${f.class}] ${f.file}: ${f.detail}`);
    throw new Error(`contract conformance (${suite} / ${check}): ${failing.length} violation(s)\n${lines.join('\n')}`);
  }
  return reported.filter((r) => r.status === 'pending');
}

/** Reads back what conform() recorded for a suite (used by the self-test and lane runner). */
export function readReport(suite: string): { checks: number; results: ReportedViolation[] } | null {
  const file = evidenceFile(suite);
  return existsSync(file) ? JSON.parse(readFileSync(file, 'utf8')) : null;
}

// ---------------------------------------------------------------- file discovery
const SKIP_DIRS = new Set(['node_modules', '.git', 'dist', 'storybook-static', '.artifacts', 'legacy']);
export function walk(dir: string, match: (name: string, abs: string) => boolean, out: string[] = [], skip: ReadonlySet<string> = SKIP_DIRS): string[] {
  if (!existsSync(dir)) return out;
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    if (skip.has(e.name)) continue;
    const p = join(dir, e.name);
    if (e.isDirectory()) walk(p, match, out, skip);
    else if (match(e.name, p)) out.push(p);
  }
  return out.sort();
}

const IMPORT_RE = /(?:import|export)[\s\S]*?from\s*['"]([^'"]+)['"]|import\s*\(\s*['"]([^'"]+)['"]\s*\)|import\s+['"]([^'"]+)['"]|require\(\s*['"]([^'"]+)['"]\s*\)/g;
const EXTS = ['.ts', '.tsx', '.js', '.mjs', '.jsx', '.css'];
const SRC = join(ROOT, 'src');
function resolveSpec(spec: string, from: string): string | null {
  if (spec.startsWith('@/')) spec = `./${spec.slice(2)}`;
  let base: string;
  if (spec.startsWith('.')) base = resolve(dirname(from), spec);
  else if (spec === 'aura-glass') base = join(SRC, 'index');
  else if (spec.startsWith('aura-glass/')) base = join(SRC, spec.slice('aura-glass/'.length), 'index');
  else return null;
  if (existsSync(base) && statSync(base).isFile()) return base;
  for (const ext of EXTS) if (existsSync(base + ext)) return base + ext;
  for (const ext of EXTS) if (existsSync(join(base, `index${ext}`))) return join(base, `index${ext}`);
  return null;
}

/** Files that ship in dist/: the src/** import closure of every ENTRIES source module (tsdown
    unbundle mode maps each reachable src file 1:1 to dist), minus the files the package build
    excludes (tsconfig.build.json: seed/testing helpers, tests). */
export function shippedSourceFiles(entrySources: readonly string[]): string[] {
  const BUILD_EXCLUDED = new Set(['src/contracts/seed.tsx', 'src/contracts/testing.ts', 'src/contracts/fragments.ts', 'src/contracts/load-fragments.mjs']);
  const excluded = (r: string) => BUILD_EXCLUDED.has(r) || /(^|\/)__tests__\//.test(r) || /\.(test|spec|stories)\.[jt]sx?$/.test(r);
  const seen = new Set<string>();
  const stack = entrySources.map((s) => join(ROOT, s)).filter((p) => existsSync(p));
  while (stack.length) {
    const f = stack.pop()!;
    if (seen.has(f) || !f.startsWith(SRC + sep)) continue;
    if (excluded(rel(f))) continue;
    seen.add(f);
    if (f.endsWith('.css')) continue;
    const text = readFileSync(f, 'utf8');
    for (const m of text.matchAll(IMPORT_RE)) {
      const r = resolveSpec((m[1] ?? m[2] ?? m[3] ?? m[4]) as string, f);
      if (r) stack.push(r);
    }
  }
  return [...seen].map(rel).sort();
}

/** dist/ when a build ran in this job (plat:build:dist artifacts or a local build); `null` otherwise. */
export function distDir(): string | null {
  const d = process.env.AURAGLASS_DIST_DIR ?? join(ROOT, 'dist');
  return existsSync(join(d, 'index.js')) ? d : null;
}

// ---------------------------------------------------------------- metas and stories
export interface MetaFile { file: string; meta: Record<string, unknown> }
/** Every src/**\/*.meta.ts and the ComponentMeta objects it exports (default or named). */
export function discoverMetas(): MetaFile[] {
  const out: MetaFile[] = [];
  for (const abs of walk(SRC, (n) => n.endsWith('.meta.ts'))) {
    const mod = require(abs) as Record<string, unknown>;
    const seen = new Set<unknown>();
    for (const value of Object.values(mod)) {
      if (seen.has(value)) continue;
      seen.add(value);
      if (value && typeof value === 'object' && typeof (value as { name?: unknown }).name === 'string' && 'parts' in (value as object)) {
        out.push({ file: rel(abs), meta: value as Record<string, unknown> });
      }
    }
  }
  return out;
}

export const storyFiles = () => [...walk(join(ROOT, 'stories'), (n) => n.endsWith('.stories.tsx')), ...walk(SRC, (n) => n.endsWith('.stories.tsx'))].map(rel);

export interface StoryCase { file: string; title: string; name: string; element: unknown }
/** The renderable stories of a CSF file: each named export rendered as Storybook does without
    decorators (`render(args)` or `<component {...args}/>`). A story export that is neither is
    returned with `element: null` so the caller reports it, never drops it. */
export function storyCases(file: string, createElement: (c: unknown, p: unknown) => unknown): StoryCase[] {
  const mod = require(join(ROOT, file)) as Record<string, unknown>;
  const meta = (mod.default ?? {}) as { title?: string; component?: unknown; args?: Record<string, unknown> };
  const title = meta.title ?? file;
  const cases: StoryCase[] = [];
  for (const [name, story] of Object.entries(mod)) {
    if (name === 'default' || name === '__namedExportsOrder' || !story || typeof story !== 'object') continue;
    const s = story as { render?: (a: Record<string, unknown>, ctx: unknown) => unknown; args?: Record<string, unknown> };
    const args = { ...(meta.args ?? {}), ...(s.args ?? {}) };
    let element: unknown = null;
    if (typeof s.render === 'function') element = () => s.render!(args, { args, argTypes: {}, globals: {}, parameters: {} });
    else if (meta.component) element = () => createElement(meta.component, args);
    cases.push({ file, title, name, element });
  }
  return cases;
}
