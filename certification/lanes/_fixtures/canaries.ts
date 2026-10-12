/* certification/lanes/_fixtures/canaries.ts — QUAL L11 consumer canaries (REQ-QUAL-29). Planning and verdict rules
   used by certification/lanes/canaries.spec.ts; pure where possible (packages/qa/test/canaries-plan.test.ts), the
   install / process helpers shell out to npm and the canary's own toolchain (remote lane only).

   - canaryApps(root): every canaries/<app>/ with a package.json (canaries/_shared is the install helper, not an app).
   - ownAssertion(pkg): the canary's own assertion script — `test`, else `check` (types-strict); none is a failure.
   - nextRoutes(appDir): every static App Router route of a Next canary (every page.* under app/, route groups dropped); a
     dynamic segment has no fixture params and is reported, never silently left out.
   - missingStreamPages(appDir): streams (plat, mat, cmp, surf, qual) without an app/<stream>/ page directory.
   - routeVerdict: HTTP 200 and 0 console errors per route and engine.
   - installedAuraGlass(appDir): node_modules/aura-glass must be a real directory, never a symlink to the workspace.
   - consumer-4x: tests/fixtures/consumer-4x (PLAT, REQ-PLAT-63) needs package.json + flagship-subset.json;
     countTodos counts `TODO(aura-glass 5)` markers in the flagship subset after `migrate 4to5`. */
import { execFileSync, spawnSync } from 'node:child_process';
import { copyFileSync, existsSync, lstatSync, readdirSync, readFileSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

export const CANARIES_DIR = 'canaries';
export const CONSUMER_4X = 'tests/fixtures/consumer-4x';
export const FLAGSHIP_SUBSET = 'flagship-subset.json';
export const TODO_PREFIX = 'TODO(aura-glass 5)';
export const STREAM_PAGES = ['plat', 'mat', 'cmp', 'surf', 'qual'] as const;
/** The Next canary whose production server gets the cross-engine route smoke. */
export const SMOKE_APP = 'next16';

export interface CanaryPackage { name?: string; scripts?: Record<string, string>; dependencies?: Record<string, string>; devDependencies?: Record<string, string> }

export function canaryApps(root: string): string[] {
  const dir = join(root, CANARIES_DIR);
  if (!existsSync(dir)) return [];
  return readdirSync(dir, { withFileTypes: true })
    .filter((d) => d.isDirectory() && !d.name.startsWith('_') && existsSync(join(dir, d.name, 'package.json')))
    .map((d) => d.name).sort();
}

export const readPackage = (dir: string): CanaryPackage => JSON.parse(readFileSync(join(dir, 'package.json'), 'utf8')) as CanaryPackage;

export function ownAssertion(pkg: CanaryPackage): string | null {
  for (const s of ['test', 'check']) if (pkg.scripts?.[s]) return s;
  return null;
}

/** Static routes ('/', '/plat/empty', …) and dynamic route files of a Next App Router app. */
export function nextRoutes(appDir: string): { routes: string[]; dynamic: string[] } {
  const app = join(appDir, 'app');
  const routes: string[] = [];
  const dynamic: string[] = [];
  const walk = (d: string) => {
    for (const e of readdirSync(d, { withFileTypes: true })) {
      const p = join(d, e.name);
      if (e.isDirectory()) { if (!e.name.startsWith('_') && !e.name.startsWith('@')) walk(p); continue; }
      if (!/^page\.(tsx|jsx|ts|js|mdx)$/.test(e.name)) continue;
      const segs = relative(app, d).split(sep).filter(Boolean).filter((s) => !/^\(.*\)$/.test(s));
      if (segs.some((s) => s.startsWith('['))) { dynamic.push(relative(appDir, p).split(sep).join('/')); continue; }
      routes.push(`/${segs.join('/')}`);
    }
  };
  if (existsSync(app)) walk(app);
  return { routes: routes.sort(), dynamic: dynamic.sort() };
}

export function missingStreamPages(appDir: string): string[] {
  const { routes } = nextRoutes(appDir);
  return STREAM_PAGES.filter((s) => !routes.some((r) => r === `/${s}` || r.startsWith(`/${s}/`)));
}

export interface RouteVisit { route: string; engine: string; status: number | null; consoleErrors: string[] }
/** Problems of one route visit (empty = pass): HTTP 200 and 0 console errors. */
export function routeVerdict(v: RouteVisit): string[] {
  const p: string[] = [];
  if (v.status !== 200) p.push(`${v.route} @${v.engine}: HTTP ${v.status ?? 'no response'} (expected 200)`);
  for (const e of v.consoleErrors) p.push(`${v.route} @${v.engine}: console error: ${e}`);
  return p;
}

/** null when node_modules/aura-glass is an installed package directory; otherwise why not. */
export function installedAuraGlass(appDir: string): string | null {
  const p = join(appDir, 'node_modules', 'aura-glass');
  let st;
  try { st = lstatSync(p); } catch { return `${relative(process.cwd(), p)} is not installed`; }
  if (st.isSymbolicLink()) return `${p} is a symlink (workspace link), not the packed tarball`;
  if (!st.isDirectory() || !existsSync(join(p, 'package.json'))) return `${p} is not a package directory`;
  return null;
}

/** Files of flagship-subset.json (an array of paths, or { files: [...] }), relative to the fixture; null when absent. */
export function readFlagshipSubset(fixtureDir: string): string[] | null {
  const f = join(fixtureDir, FLAGSHIP_SUBSET);
  if (!existsSync(f)) return null;
  const raw = JSON.parse(readFileSync(f, 'utf8')) as unknown;
  const files = Array.isArray(raw) ? raw : (raw as { files?: unknown })?.files;
  if (!Array.isArray(files) || !files.length || files.some((x) => typeof x !== 'string' || !x)) {
    throw new Error(`${FLAGSHIP_SUBSET} must list the flagship files (a non-empty string array or { "files": [...] })`);
  }
  return files as string[];
}

export function countTodos(fixtureDir: string, files: readonly string[]): { total: number; perFile: Record<string, number>; missing: string[] } {
  const perFile: Record<string, number> = {};
  const missing: string[] = [];
  let total = 0;
  for (const f of files) {
    const p = join(fixtureDir, f);
    if (!existsSync(p)) { missing.push(f); continue; }
    const n = readFileSync(p, 'utf8').split(TODO_PREFIX).length - 1;
    perFile[f] = n;
    total += n;
  }
  return { total, perFile, missing };
}

/** What tests/fixtures/consumer-4x still lacks to be run (PLAT REQ-PLAT-63); [] when it can run. */
export function consumer4xMissing(root: string): string[] {
  const d = join(root, CONSUMER_4X);
  const out: string[] = [];
  if (!existsSync(join(d, 'package.json'))) out.push(`${CONSUMER_4X}/package.json (fixture harness)`);
  else if (!ownAssertion(readPackage(d)) && !readPackage(d).scripts?.build) out.push(`${CONSUMER_4X}/package.json scripts.test|check|build`);
  if (!existsSync(join(d, FLAGSHIP_SUBSET))) out.push(`${CONSUMER_4X}/${FLAGSHIP_SUBSET}`);
  return out;
}

// ---------------------------------------------------------------- process helpers (remote lane only)

const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';
export interface Run { status: number | null; output: string }
export function sh(cmd: string, args: readonly string[], cwd: string, timeoutMs = 20 * 60_000, env: NodeJS.ProcessEnv = process.env): Run {
  const r = spawnSync(cmd, args, { cwd, env, encoding: 'utf8', timeout: timeoutMs, maxBuffer: 256 * 1024 * 1024 });
  return { status: r.error ? null : r.status, output: `${r.stdout ?? ''}${r.stderr ?? ''}${r.error ? `\n${r.error.message}` : ''}`.slice(-4000) };
}

/** Installs a canary the consumer way: the packed tarball at <root>/aura-glass.tgz (the canaries' file: dependency). */
export function installFromTarball(root: string, appDir: string, tarball: string): Run {
  const dest = join(root, 'aura-glass.tgz');
  if (tarball !== dest) copyFileSync(tarball, dest);
  return sh(npm, ['install', '--no-audit', '--no-fund', '--no-package-lock', '--ignore-scripts', '--legacy-peer-deps'], appDir);
}

/** `npm pack -w @auraglass/cli`; the path of the packed CLI tarball, or why it cannot provide `migrate`. */
export function packCli(root: string, dest: string): { tarball: string } | { problem: string } {
  let out: string;
  try {
    out = execFileSync(npm, ['pack', '-w', '@auraglass/cli', '--json', '--pack-destination', dest], { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
  } catch (e) { return { problem: `npm pack -w @auraglass/cli failed: ${(e as Error).message.split('\n')[0]}` }; }
  const [info] = JSON.parse(out) as Array<{ filename: string; files: Array<{ path: string }> }>;
  if (!info) return { problem: 'npm pack -w @auraglass/cli produced no tarball' };
  if (!info.files.some((f) => f.path === 'dist/bin.js')) return { problem: 'the packed @auraglass/cli has no dist/bin.js (no `migrate` command packed)' };
  return { tarball: join(dest, info.filename) };
}
