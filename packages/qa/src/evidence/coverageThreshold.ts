/* REQ-QUAL-30 L12 coverage floors (QUAL). Builds the `--coverageThreshold` JSON for `npm test --coverage`
   from certification/ratchets.json: src/material/ 90/85, every flagship directory 85/75, src/theme/ 80/70,
   global 70/60 (lines/branches). A directory whose code still carries `@ag-contract-seed` is excluded from
   collection and reported `pending`. Floors only increase: compareRatchets() fails any floor lower than the
   merge-base ratchets.json. evaluateCoverage() recomputes every threshold group from jest's json-summary so the
   lane manifest records a per-group state (and the owner of each failing group). */
import { execFileSync } from 'node:child_process';
import { readFileSync, readdirSync, realpathSync, statSync } from 'node:fs';
import { dirname, join, relative, sep } from 'node:path';
import { loadComponentMetas } from '../resolve/componentMetas.ts';

export const RATCHETS_FILE = 'certification/ratchets.json';
export const SEED_MARKER = '@ag-contract-seed';

export interface Floor { lines: number; branches: number }
export interface Ratchets { version: 1; floors: { global: Floor; flagship: Floor; [dir: string]: Floor } }
export interface CoveragePlan {
  /** jest `coverageThreshold` (keys: `global` and `./<dir>/`). */
  threshold: Record<string, Floor>;
  /** jest `--collectCoverageFrom` globs. */
  collectCoverageFrom: string[];
  /** jest `--coveragePathIgnorePatterns` (seed directories). */
  coveragePathIgnorePatterns: string[];
  /** threshold groups not enforced because their code is still a contract seed. */
  pending: Array<{ key: string; reason: string }>;
}
export interface GroupResult { key: string; files: number; lines: number | null; branches: number | null; floor: Floor; state: 'pass' | 'fail'; reason?: string }

const SKIP = new Set(['node_modules', '.git', 'dist', 'legacy', 'storybook-static', '.artifacts']);

function isFloor(f: unknown): f is Floor {
  const o = f as Floor;
  return !!o && typeof o === 'object' && [o.lines, o.branches].every((n) => typeof n === 'number' && n >= 0 && n <= 100);
}

export function parseRatchets(text: string): Ratchets {
  const r = JSON.parse(text) as Ratchets;
  if (r?.version !== 1 || !r.floors || typeof r.floors !== 'object') throw new Error(`${RATCHETS_FILE}: expected { version: 1, floors: {...} }`);
  for (const k of ['global', 'flagship']) if (!(k in r.floors)) throw new Error(`${RATCHETS_FILE}: floors.${k} is required`);
  for (const [k, f] of Object.entries(r.floors)) {
    if (!isFloor(f)) throw new Error(`${RATCHETS_FILE}: floors['${k}'] must be { lines, branches } percentages`);
    if (k !== 'global' && k !== 'flagship' && !/^src\/.+\/$/.test(k)) throw new Error(`${RATCHETS_FILE}: floor key '${k}' must be global, flagship or a src/<dir>/ path`);
  }
  return r;
}

export function readRatchets(root: string): Ratchets {
  return parseRatchets(readFileSync(join(root, RATCHETS_FILE), 'utf8'));
}

function walk(dir: string, out: string[]): void {
  let names: string[];
  try { names = readdirSync(dir); } catch { return; }
  for (const n of names) {
    if (SKIP.has(n)) continue;
    const p = join(dir, n);
    const st = statSync(p);
    if (st.isDirectory()) walk(p, out);
    else if (/\.(ts|tsx|js|mjs|css)$/.test(n)) out.push(p);
  }
}

const posix = (root: string, abs: string) => relative(root, abs).split(sep).join('/');

/** Directories (repo-relative, trailing slash) under src/ whose code carries the seed marker. */
export function seedDirs(root: string): string[] {
  const files: string[] = [];
  walk(join(root, 'src'), files);
  const dirs = new Set<string>();
  for (const f of files) if (readFileSync(f, 'utf8').includes(SEED_MARKER)) dirs.add(`${posix(root, dirname(f))}/`);
  return [...dirs].sort();
}

/** Directories (repo-relative, trailing slash) holding a ComponentMeta with a `flagship` number. */
export function flagshipDirs(root: string): string[] {
  const dirs = new Set<string>();
  for (const recs of loadComponentMetas(root).values()) for (const r of recs) if (typeof r.flagship === 'number') dirs.add(`${dirname(r.file)}/`);
  return [...dirs].sort();
}

const within = (dir: string, parent: string) => dir.startsWith(parent);

export function buildCoveragePlan(ratchets: Ratchets, dirs: { flagship: readonly string[]; seed: readonly string[] }): CoveragePlan {
  const groups = new Map<string, Floor>();
  for (const [k, f] of Object.entries(ratchets.floors)) if (k !== 'global' && k !== 'flagship') groups.set(k, f);
  for (const d of dirs.flagship) {
    const prev = groups.get(d);
    const fl = ratchets.floors.flagship;
    groups.set(d, prev ? { lines: Math.max(prev.lines, fl.lines), branches: Math.max(prev.branches, fl.branches) } : fl);
  }
  const pending: CoveragePlan['pending'] = [];
  const threshold: Record<string, Floor> = { global: ratchets.floors.global };
  for (const [dir, floor] of [...groups].sort(([a], [b]) => a.localeCompare(b))) {
    const seed = dirs.seed.find((s) => within(dir, s));
    if (seed) { pending.push({ key: `./${dir}`, reason: `${seed} carries ${SEED_MARKER}` }); continue; }
    threshold[`./${dir}`] = floor;
  }
  return {
    threshold,
    collectCoverageFrom: ['src/**/*.{ts,tsx}', '!src/**/*.{test,stories,meta}.{ts,tsx}', '!src/**/*.d.ts'],
    coveragePathIgnorePatterns: ['/node_modules/', ...dirs.seed.map((s) => `<rootDir>/${s}`)],
    pending,
  };
}

interface SummaryCounts { total: number; covered: number }
type Summary = Record<string, { lines: SummaryCounts; branches: SummaryCounts }>;

const pct = (c: SummaryCounts) => (c.total === 0 ? 100 : (c.covered / c.total) * 100);

/** Re-evaluates every threshold group from jest's coverage-summary.json (keys are absolute file paths). */
export function evaluateCoverage(summary: Summary, threshold: Record<string, Floor>, root: string): GroupResult[] {
  const real = realpathSync(root); // jest reports real paths (e.g. /private/var vs /var)
  const files = Object.keys(summary).filter((k) => k !== 'total').map((abs) => ({ abs, rel: posix(abs.startsWith(real) ? real : root, abs) }));
  const dirKeys = Object.keys(threshold).filter((k) => k !== 'global');
  const out: GroupResult[] = [];
  const claimed = new Set<string>();
  const group = (key: string, members: typeof files, floor: Floor) => {
    if (!members.length) { out.push({ key, files: 0, lines: null, branches: null, floor, state: 'fail', reason: 'no coverage data for this group' }); return; }
    const sum = (k: 'lines' | 'branches') => members.reduce((a, m) => ({ total: a.total + summary[m.abs]![k].total, covered: a.covered + summary[m.abs]![k].covered }), { total: 0, covered: 0 });
    const lines = pct(sum('lines'));
    const branches = pct(sum('branches'));
    const ok = lines >= floor.lines && branches >= floor.branches;
    out.push({ key, files: members.length, lines: Math.round(lines * 100) / 100, branches: Math.round(branches * 100) / 100, floor, state: ok ? 'pass' : 'fail',
      ...(ok ? {} : { reason: `lines ${lines.toFixed(2)}% / branches ${branches.toFixed(2)}% below floor ${floor.lines}/${floor.branches}` }) });
  };
  for (const key of dirKeys) {
    const dir = key.replace(/^\.\//, '');
    const members = files.filter((f) => f.rel.startsWith(dir));
    members.forEach((m) => claimed.add(m.abs));
    group(key, members, threshold[key]!);
  }
  if (threshold.global) group('global', files.filter((f) => !claimed.has(f.abs)), threshold.global);
  return out;
}

/** Floors that decreased (or disappeared) from `base` to `head`. */
export function compareRatchets(base: Ratchets, head: Ratchets): string[] {
  const out: string[] = [];
  for (const [k, b] of Object.entries(base.floors)) {
    const h = head.floors[k];
    if (!h) { out.push(`floor '${k}' was removed (base ${b.lines}/${b.branches})`); continue; }
    if (h.lines < b.lines) out.push(`floor '${k}' lines decreased ${b.lines} → ${h.lines}`);
    if (h.branches < b.branches) out.push(`floor '${k}' branches decreased ${b.branches} → ${h.branches}`);
  }
  return out;
}

/** ratchets.json at the merge base of HEAD and `baseRef`; null when the file did not exist there yet.
    Throws when the merge base cannot be computed (fail closed: the ratchet is never silently skipped). */
export function mergeBaseRatchets(root: string, baseRef: string): Ratchets | null {
  const git = (args: string[]) => execFileSync('git', args, { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
  const mb = git(['merge-base', 'HEAD', baseRef]);
  let text: string;
  try { text = git(['show', `${mb}:${RATCHETS_FILE}`]); } catch { return null; }
  return parseRatchets(text);
}
