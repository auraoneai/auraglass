/** REQ-PLAT-92 codemod canaries (@playwright/test, remote dx lane only —
 *  playwright.dx.config.ts exits 2 outside CI; job plat:test:cli after
 *  plat:package:pack). Inputs are the PACKED tarballs in .artifacts/pack/
 *  (`auraglass-cli-*.tgz`, `aura-glass-5*.tgz`); a missing tarball fails.
 *
 *  `@node` tests run once in the `node` project, which the browser projects
 *  depend on:
 *   - the packed @auraglass/cli is installed into .artifacts/plat/codemod-canary/cli;
 *   - frozen 4.x app (tests/dx/fixtures/app-4x + the flagship recipes): packed
 *     CLI `migrate 4to5` within 15 s, 0 TODOs in the flagship-subset files,
 *     second run 0 changes within 15 s, then the packed aura-glass 5 tarball
 *     is swapped in and `tsc --noEmit` and `next build` exit 0;
 *   - every registry block (registry/blocks/*): migrate terminates within
 *     15 s with 0 TODOs and 0 changes (blocks are 5.0 code);
 *   - every recipes-4x fixture: packed CLI result equals expected-todos.json,
 *     second run 0 changes; the engine leg repeats it over runOnSource;
 *   - a generated 2,000-file tree through the packed CLI: <=60 s wall and
 *     <=1.5 GB peak RSS of the CLI process.
 *  `@browser` tests (chromium, webkit, firefox) serve the built app with
 *  `next start` and smoke every page: HTTP 200, a visible heading, rendered
 *  material, 0 console errors and 0 page errors.
 *  The AuraOne import-site report review is a release-owner step (not here). */
import { test, expect } from '@playwright/test';
import { execFileSync, spawn, type ChildProcess } from 'node:child_process';
import fs from 'node:fs';
import { createServer } from 'node:net';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { runOnSource, selectTransforms, loadCompiledMappings, TRANSFORM_ORDER } from '../../packages/cli/src/migrate/4to5/index.js';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, '..', '..');
const RECIPES = path.join(HERE, 'fixtures', 'recipes-4x');
const APP_FIXTURE = path.join(HERE, 'fixtures', 'app-4x');
const BLOCKS = path.join(REPO, 'registry', 'blocks');
const PACK = path.join(REPO, '.artifacts', 'pack');
const WORK = path.join(REPO, '.artifacts', 'plat', 'codemod-canary');
const APP = path.join(WORK, 'app');
const CLI_PREFIX = path.join(WORK, 'cli');
const MANUAL = '__manual__source-parse-failure';
const RUN_BUDGET_MS = 15_000;
const TODO_RE = /TODO\(aura-glass 5\): ([^\n]+)/g;

interface Report { summary: { filesChanged: number; changes: number; todos: number }; files: { path: string; todos: { reason: string }[] }[] }

/** Newest tarball in .artifacts/pack matching `re`; the canary never falls back to source builds. */
function packed(re: RegExp): string {
  const hits = fs.existsSync(PACK) ? fs.readdirSync(PACK).filter((f) => re.test(f)).sort() : [];
  if (!hits.length) throw new Error(`no ${re} in ${PACK}: run plat:package:pack first (REQ-PLAT-92 runs the packed artifacts only)`);
  return path.join(PACK, hits[hits.length - 1]!);
}
const cliBin = () => path.join(CLI_PREFIX, 'node_modules', '@auraglass', 'cli', 'dist', 'bin.js');

function npm(args: string[], cwd: string, timeout = 10 * 60_000): void {
  execFileSync('npm', [...args, '--no-audit', '--no-fund', '--loglevel=error'], { cwd, stdio: 'inherit', timeout });
}

/** Packed CLI `migrate 4to5` over `dir` (JSON report). `allowTodo` keeps exit 0 when TODOs are expected. */
function migrate(dir: string, { allowTodo = false } = {}): { report: Report | null; code: number; ms: number } {
  const args = [cliBin(), 'migrate', '4to5', '--json', '--allow-no-git', '--allow-dirty', '--cwd', dir];
  if (allowTodo) args.push('--allow-todo');
  const t0 = Date.now();
  let stdout = ''; let code = 0;
  try {
    stdout = execFileSync(process.execPath, args, { cwd: dir, encoding: 'utf8', timeout: RUN_BUDGET_MS * 2 });
  } catch (e) {
    const err = e as { status?: number; stdout?: string };
    stdout = err.stdout ?? ''; code = err.status ?? 1;
  }
  const ms = Date.now() - t0;
  const json = stdout.slice(stdout.indexOf('{'));
  let report: Report | null = null;
  try { report = JSON.parse(json) as Report; } catch { report = null; }
  return { report, code, ms };
}

/** path -> content of every source file under `dir` (node_modules/.next excluded). */
function snapshot(dir: string): Map<string, string> {
  const out = new Map<string, string>();
  const walk = (d: string) => {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      if (e.name === 'node_modules' || e.name === '.next') continue;
      const p = path.join(d, e.name);
      if (e.isDirectory()) walk(p); else out.set(path.relative(dir, p), fs.readFileSync(p, 'utf8'));
    }
  };
  walk(dir);
  return out;
}
const todosIn = (text: string) => [...text.matchAll(TODO_RE)].map((m) => m[1]!.replace(/, see .*/, ''));

function recipeDirs(): string[] {
  return fs.readdirSync(RECIPES).filter((d) => fs.existsSync(path.join(RECIPES, d, 'input.tsx')) && fs.existsSync(path.join(RECIPES, d, 'expected-todos.json'))).sort();
}
const FLAGSHIP = JSON.parse(fs.readFileSync(path.join(RECIPES, 'flagship-subset.json'), 'utf8')) as string[];

/** Frozen 4.x app: the fixture skeleton plus one client page per flagship recipe. */
function stageApp(): void {
  fs.rmSync(APP, { recursive: true, force: true });
  fs.cpSync(APP_FIXTURE, APP, { recursive: true });
  fs.mkdirSync(path.join(APP, 'components', 'recipes'), { recursive: true });
  for (const id of FLAGSHIP) {
    const src = fs.readFileSync(path.join(RECIPES, id, 'input.tsx'), 'utf8');
    const name = /^export function (\w+)/m.exec(src)?.[1];
    if (!name) throw new Error(`recipes-4x/${id}/input.tsx has no exported component`);
    fs.writeFileSync(path.join(APP, 'components', 'recipes', `${id}.tsx`), src);
    const page = path.join(APP, 'app', 'recipes', id, 'page.tsx');
    fs.mkdirSync(path.dirname(page), { recursive: true });
    fs.writeFileSync(page, `'use client';\nimport { ${name} } from '../../../components/recipes/${id}';\n\nexport default function Page() {\n  return <${name} />;\n}\n`);
  }
  fs.writeFileSync(path.join(APP, 'components', 'recipes.ts'), `export const RECIPES = ${JSON.stringify(FLAGSHIP)} as const;\n`);
}

test.describe('@node codemod canary (packed CLI)', () => {
  test.describe.configure({ mode: 'serial' });

  test.beforeAll(() => {
    test.setTimeout(10 * 60_000);
    fs.mkdirSync(CLI_PREFIX, { recursive: true });
    fs.writeFileSync(path.join(CLI_PREFIX, 'package.json'), JSON.stringify({ name: 'canary-cli', private: true }));
    npm(['install', packed(/^auraglass-cli-.*\.tgz$/)], CLI_PREFIX);
    expect(fs.existsSync(cliBin())).toBe(true);
  });

  test('@node frozen 4.x app: migrate, swap in packed aura-glass 5, tsc and next build exit 0', () => {
    test.setTimeout(30 * 60_000);
    stageApp();
    const first = migrate(APP, { allowTodo: true });
    expect(first.report, 'migrate --json report').not.toBeNull();
    expect(first.ms).toBeLessThanOrEqual(RUN_BUDGET_MS);
    expect(first.report!.summary.filesChanged).toBeGreaterThan(0);
    // 0 TODOs in the flagship-subset files (report and file text agree).
    const flagshipFiles = FLAGSHIP.map((id) => path.join('components', 'recipes', `${id}.tsx`));
    const reported = first.report!.files.filter((f) => flagshipFiles.includes(path.normalize(f.path)) && f.todos.length);
    expect(reported.map((f) => `${f.path}: ${f.todos.map((t) => t.reason).join('; ')}`)).toEqual([]);
    for (const f of flagshipFiles) expect({ f, todos: todosIn(fs.readFileSync(path.join(APP, f), 'utf8')) }).toEqual({ f, todos: [] });
    expect(first.code).toBe(0);

    const before = snapshot(APP);
    const second = migrate(APP, { allowTodo: true });
    expect(second.ms).toBeLessThanOrEqual(RUN_BUDGET_MS);
    expect(second.report?.summary.filesChanged).toBe(0);
    expect(snapshot(APP)).toEqual(before);

    const pkgPath = path.join(APP, 'package.json');
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8')) as { dependencies: Record<string, string> };
    pkg.dependencies['aura-glass'] = `file:${packed(/^aura-glass-5.*\.tgz$/)}`;
    fs.writeFileSync(pkgPath, `${JSON.stringify(pkg, null, 2)}\n`);
    npm(['install'], APP);
    execFileSync(process.execPath, [path.join(APP, 'node_modules', 'typescript', 'bin', 'tsc'), '--noEmit', '-p', APP], { cwd: APP, stdio: 'inherit', timeout: 10 * 60_000 });
    execFileSync(process.execPath, [path.join(APP, 'node_modules', 'next', 'dist', 'bin', 'next'), 'build'], { cwd: APP, stdio: 'inherit', timeout: 15 * 60_000, env: { ...process.env, NEXT_TELEMETRY_DISABLED: '1' } });
    expect(fs.existsSync(path.join(APP, '.next', 'BUILD_ID'))).toBe(true);
  });

  const blocks = fs.existsSync(BLOCKS) ? fs.readdirSync(BLOCKS).filter((b) => fs.existsSync(path.join(BLOCKS, b, 'registry-item.json'))).sort() : [];
  test('@node registry blocks exist', () => { expect(blocks.length).toBeGreaterThan(0); });
  for (const block of blocks) {
    test(`@node registry block ${block}: migrate terminates with 0 TODOs and 0 changes`, () => {
      const dir = fs.mkdtempSync(path.join(os.tmpdir(), `agcan-block-${block}-`));
      fs.cpSync(path.join(BLOCKS, block), dir, { recursive: true });
      const before = snapshot(dir);
      const r = migrate(dir);
      expect(r.ms).toBeLessThanOrEqual(RUN_BUDGET_MS);
      expect(r.report?.summary).toMatchObject({ filesChanged: 0, todos: 0 });
      expect(r.code).toBe(0);
      expect(snapshot(dir)).toEqual(before);
      fs.rmSync(dir, { recursive: true, force: true });
    });
  }

  test('@node 28+ frozen recipe sources exist', () => {
    expect(recipeDirs().length).toBeGreaterThanOrEqual(28);
  });
  for (const name of recipeDirs()) {
    test(`@node recipe ${name}: packed CLI todos equal expected-todos.json, second run 0 changes`, () => {
      const dir = fs.mkdtempSync(path.join(os.tmpdir(), `agcan-${name}-`));
      fs.copyFileSync(path.join(RECIPES, name, 'input.tsx'), path.join(dir, 'input.tsx'));
      const expected = JSON.parse(fs.readFileSync(path.join(RECIPES, name, 'expected-todos.json'), 'utf8')) as string[];
      const r = migrate(dir, { allowTodo: true });
      expect(r.ms).toBeLessThanOrEqual(RUN_BUDGET_MS);
      if (expected[0] === MANUAL) {
        /* frozen expectation: the CLI reports the parse failure (non-zero) */
        expect(r.code).not.toBe(0);
        return;
      }
      expect(r.code).toBe(0);
      const out = fs.readFileSync(path.join(dir, 'input.tsx'), 'utf8');
      expect(todosIn(out)).toEqual(expected);
      const r2 = migrate(dir, { allowTodo: true });
      expect(r2.code).toBe(0);
      expect(r2.ms).toBeLessThanOrEqual(RUN_BUDGET_MS);
      expect(r2.report?.summary.filesChanged).toBe(0);
      expect(fs.readFileSync(path.join(dir, 'input.tsx'), 'utf8')).toBe(out);
      fs.rmSync(dir, { recursive: true, force: true });
    });
  }

  test('@node flagship subset: frozen expectation is 0 TODOs', () => {
    expect(FLAGSHIP.length).toBeGreaterThan(0);
    const offenders = FLAGSHIP.filter((id) => (JSON.parse(fs.readFileSync(path.join(RECIPES, id, 'expected-todos.json'), 'utf8')) as string[]).length > 0);
    expect(offenders).toEqual([]);
  });

  test('@node 2,000-file tree through the packed CLI: <=60 s wall, <=1.5 GB peak RSS', () => {
    test.setTimeout(5 * 60_000);
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'agcan-perf-'));
    for (let i = 0; i < 2000; i++) {
      fs.writeFileSync(path.join(dir, `f${i}.tsx`), `import { GlassButton } from 'aura-glass';\nexport const x${i} = <GlassButton variant="primary" />;\n`);
    }
    fs.writeFileSync(path.join(dir, 'package.json'), JSON.stringify({ dependencies: { 'aura-glass': '4.9.0' } }));
    // The probe lives outside the tree and reports the CLI process's own peak RSS at exit.
    const probeDir = fs.mkdtempSync(path.join(os.tmpdir(), 'agcan-probe-'));
    const probe = path.join(probeDir, 'rss-probe.cjs');
    const rssOut = path.join(probeDir, 'rss.json');
    fs.writeFileSync(probe, `process.on('exit', () => require('node:fs').writeFileSync(${JSON.stringify(rssOut)}, JSON.stringify({ maxRSS: process.resourceUsage().maxRSS * 1024 })));\n`);
    const t0 = Date.now();
    const stdout = execFileSync(process.execPath, ['--require', probe, cliBin(), 'migrate', '4to5', '--dry-run', '--json', '--allow-todo', '--cwd', dir], { cwd: dir, encoding: 'utf8', timeout: 120_000, maxBuffer: 512 * 1024 * 1024 });
    const wallMs = Date.now() - t0;
    const report = JSON.parse(stdout.slice(stdout.indexOf('{'))) as Report;
    const { maxRSS } = JSON.parse(fs.readFileSync(rssOut, 'utf8')) as { maxRSS: number };
    expect(report.summary.filesChanged).toBeGreaterThanOrEqual(2000);
    expect(wallMs).toBeLessThanOrEqual(60_000);
    expect(maxRSS).toBeLessThanOrEqual(1.5 * 1024 * 1024 * 1024);
    fs.rmSync(dir, { recursive: true, force: true });
    fs.rmSync(probeDir, { recursive: true, force: true });
  });
});

/* PLAT-340..343: engine-level leg — frozen recipe fixture (tsx/ts/css/json)
 * -> runOnSource -> todos match expected-todos.json; second run idempotent. */
const mappings = loadCompiledMappings();
const all = selectTransforms(undefined);

function recipeInput(dir: string): string | undefined {
  return ['input.tsx', 'input.ts', 'input.css', 'input.json'].find((f) => fs.existsSync(path.join(dir, f)));
}
function engineRecipeDirs(): string[] {
  return fs.readdirSync(RECIPES).filter((d) => recipeInput(path.join(RECIPES, d)) && fs.existsSync(path.join(RECIPES, d, 'expected-todos.json'))).sort();
}

test.describe('@node codemod canary (recipes-4x, engine)', () => {
  test('@node covers all 14 transforms in frozen order', () => {
    expect(TRANSFORM_ORDER.length).toBe(14);
  });
  for (const name of engineRecipeDirs()) {
    test(`@node recipe ${name}: output matches expected-todos.json`, () => {
      const dir = path.join(RECIPES, name);
      const expected = JSON.parse(fs.readFileSync(path.join(dir, 'expected-todos.json'), 'utf8')) as string[];
      const input = recipeInput(dir)!;
      const source = fs.readFileSync(path.join(dir, input), 'utf8');
      const kind = input.endsWith('.css') ? 'css' : input.endsWith('.json') ? 'json' : 'code';
      if (expected[0] === MANUAL) {
        expect(() => runOnSource({ path: input, abs: 'x', kind, source }, all, { mappings, docBase: 'docs' })).toThrow();
        return;
      }
      const r = runOnSource({ path: input, abs: 'x', kind, source }, all, { mappings, docBase: 'docs' });
      expect(r.todos.map((t) => t.reason)).toEqual(expected);
      const r2 = runOnSource({ path: input, abs: 'x', kind, source: r.final }, all, { mappings, docBase: 'docs' });
      expect(r2.final).toBe(r.final);
    });
  }
});

/* Browser smoke over the app the `node` project built (project dependency). */
function freePort(): Promise<number> {
  return new Promise((resolve, reject) => {
    const srv = createServer();
    srv.once('error', reject);
    srv.listen(0, '127.0.0.1', () => { const { port } = srv.address() as { port: number }; srv.close(() => resolve(port)); });
  });
}

test.describe('@browser migrated app smoke', () => {
  test.describe.configure({ mode: 'serial' });
  let server: ChildProcess | null = null;
  let base = '';

  test.beforeAll(async () => {
    test.setTimeout(3 * 60_000);
    if (!fs.existsSync(path.join(APP, '.next', 'BUILD_ID'))) throw new Error(`${APP} has no next build — the node project's app test must pass first`);
    const port = await freePort();
    base = `http://127.0.0.1:${port}`;
    server = spawn(process.execPath, [path.join(APP, 'node_modules', 'next', 'dist', 'bin', 'next'), 'start', '-p', String(port), '-H', '127.0.0.1'], { cwd: APP, stdio: 'inherit', env: { ...process.env, NEXT_TELEMETRY_DISABLED: '1' } });
    const deadline = Date.now() + 120_000;
    for (;;) {
      try { if ((await fetch(base)).ok) break; } catch { /* not listening yet */ }
      if (Date.now() > deadline) throw new Error(`next start did not answer on ${base} within 120 s`);
      await new Promise((r) => setTimeout(r, 500));
    }
  });
  test.afterAll(() => { server?.kill('SIGTERM'); server = null; });

  for (const route of ['/', ...FLAGSHIP.map((id) => `/recipes/${id}`)]) {
    test(`@browser ${route} renders without console or page errors`, async ({ page }) => {
      const errors: string[] = [];
      page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
      page.on('pageerror', (e) => errors.push(String(e)));
      const res = await page.goto(base + route, { waitUntil: 'load' });
      expect(res?.status()).toBe(200);
      await expect(page.locator('h1, h2').first()).toBeVisible();
      expect(await page.locator('[data-ag-surface]').count()).toBeGreaterThan(0);
      expect(errors).toEqual([]);
    });
  }
});
