/* REQ-QUAL-29 — L11 consumer canaries (QUAL). Registered on L11 in certification/lanes.config.ts; runs in the chromium,
   webkit and firefox projects of certification/playwright.cert.config.ts. Remote-only (GitLab CI / gated runner).

   5.x line:
   1. Every canaries/<app>/ (canaryApps) is installed from the packed tarball (AURAGLASS_TARBALL, plat:package:pack →
      <root>/aura-glass.tgz, the canaries' file: dependency), node_modules/aura-glass must not be a symlink, and the
      canary's own assertions (`test`, else `check`) must exit 0. One test per app, chromium project.
   2. Cross-engine smoke: the canaries/next16 production server (`next build` + `next start` of that install) serves
      every static App Router route — including the per-stream pages under app/<stream>/ — with HTTP 200 and 0 console
      errors in chromium, webkit and firefox. A stream without an app/<stream>/ page, or a dynamic route without
      fixture params, is pending before release and a failure at release. A missing route is a failure (negative control).
   3. tests/fixtures/consumer-4x after `migrate 4to5` from `npm pack -w @auraglass/cli`: 0 `TODO(aura-glass 5)`
      markers in flagship-subset.json files (count recorded in <evidence>/canaries/consumer-4x.json, folded into the
      lane manifest), then its own assertions against the 5.x tarball.
   4.x line (AG_CERT_LINE=4x, AURAGLASS_TARBALL = the 4.x tarball): tests/fixtures/consumer-4x unchanged, its own
   assertions against the 4.x tarball. A missing fixture or a CLI that does not pack `migrate` is pending before
   release and a failure at release (pendingOrFail). */
import { spawn, type ChildProcess } from 'node:child_process';
import { cpSync, existsSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { Page } from '@playwright/test';
import { test, expect } from './_fixtures/determinism';
import { pendingOrFail } from './_fixtures/pending';
import {
  CONSUMER_4X, SMOKE_APP, canaryApps, consumer4xMissing, countTodos, installFromTarball, installedAuraGlass, missingStreamPages,
  nextRoutes, ownAssertion, packCli, readFlagshipSubset, readPackage, routeVerdict, sh, type RouteVisit,
} from './_fixtures/canaries';

const ROOT = fileURLToPath(new URL('../../', import.meta.url));
const LINE = process.env.AG_CERT_LINE === '4x' ? '4x' : '5x';
const EVIDENCE_DIR = join(process.env.AG_LANE_EVIDENCE_DIR
  ?? join(ROOT, process.env.AURAGLASS_EVIDENCE_DIR || '.artifacts', 'qual', process.env.CI_JOB_NAME_SLUG || 'qual-certify-l11'), 'canaries');
const PLAYWRIGHT_CLI = join(ROOT, 'node_modules/@playwright/test/cli.js');
const INSTALL_TIMEOUT_MS = 30 * 60_000;
const ROUTE_TIMEOUT_MS = 60_000;

const writeEvidence = (name: string, body: unknown) => {
  mkdirSync(EVIDENCE_DIR, { recursive: true });
  writeFileSync(join(EVIDENCE_DIR, name), `${JSON.stringify(body, null, 2)}\n`);
};

/** The packed tarball under test; never the workspace. */
function tarball(): string {
  const t = process.env.AURAGLASS_TARBALL?.trim();
  if (!t) pendingOrFail('AURAGLASS_TARBALL is unset (no packed tarball for the canaries)', 'plat:package:pack');
  const p = t.startsWith('/') ? t : join(ROOT, t);
  if (!existsSync(p)) throw new Error(`AURAGLASS_TARBALL=${t} does not exist`);
  return p;
}

/** Cross-worker lock (the three engine projects share one canary install + build). */
async function withLock<T>(dir: string, fn: () => T): Promise<T> {
  const lock = join(dir, '.ag-l11.lock');
  for (let i = 0; ; i++) {
    try { mkdirSync(lock); break; } catch {
      if (i > INSTALL_TIMEOUT_MS / 2000) throw new Error(`${lock} held for over ${INSTALL_TIMEOUT_MS / 60_000} min`);
      await new Promise((r) => setTimeout(r, 2000));
    }
  }
  try { return fn(); } finally { rmSync(lock, { recursive: true, force: true }); }
}

/** Installs a canary from the tarball once (and `next build`s a Next canary); throws with the tool output on failure. */
async function prepare(app: string): Promise<string> {
  const dir = join(ROOT, 'canaries', app);
  const tgz = tarball();
  await withLock(dir, () => {
    const marker = join(dir, 'node_modules', '.ag-l11-installed');
    if (!existsSync(marker)) {
      const r = installFromTarball(ROOT, dir, tgz);
      if (r.status !== 0) throw new Error(`npm install in canaries/${app} failed (exit ${r.status}):\n${r.output}`);
      writeFileSync(marker, tgz);
    }
    const isNext = Boolean(readPackage(dir).dependencies?.next);
    if (isNext && !existsSync(join(dir, '.next', 'BUILD_ID'))) {
      const r = sh(join(dir, 'node_modules/.bin/next'), ['build'], dir, INSTALL_TIMEOUT_MS);
      if (r.status !== 0) throw new Error(`next build in canaries/${app} failed (exit ${r.status}):\n${r.output}`);
    }
  });
  return dir;
}

/** Runs the canary's own assertions: `playwright test` scripts with the runner's Playwright (as canaries/next-serve.mjs
    expects), anything else through npm. */
function runOwnAssertions(dir: string, script: string) {
  const cmd = readPackage(dir).scripts![script]!;
  if (/^playwright test\b/.test(cmd)) {
    return sh(process.execPath, [PLAYWRIGHT_CLI, 'test', ...cmd.split(/\s+/).slice(2), '--reporter=line'], dir, INSTALL_TIMEOUT_MS,
      { ...process.env, PLAYWRIGHT_JSON_OUTPUT_NAME: '' });
  }
  return sh(process.platform === 'win32' ? 'npm.cmd' : 'npm', ['run', script], dir, INSTALL_TIMEOUT_MS);
}

async function startNext(dir: string, port: number): Promise<{ url: string; child: ChildProcess }> {
  const child = spawn(join(dir, 'node_modules/.bin/next'), ['start', '-p', String(port)], { cwd: dir, stdio: 'ignore' });
  const url = `http://127.0.0.1:${port}`;
  const deadline = Date.now() + 120_000;
  for (;;) {
    if (child.exitCode !== null) throw new Error(`next start exited ${child.exitCode} before serving ${url}`);
    try { await fetch(`${url}/`); return { url, child }; } catch { /* not listening yet */ }
    if (Date.now() > deadline) { child.kill('SIGTERM'); throw new Error(`next start did not serve ${url} within 120 s`); }
    await new Promise((r) => setTimeout(r, 1000));
  }
}

async function visit(page: Page, url: string, route: string, engine: string): Promise<RouteVisit> {
  const consoleErrors: string[] = [];
  page.on('console', (m) => { if (m.type() === 'error') consoleErrors.push(m.text()); });
  page.on('pageerror', (e) => consoleErrors.push(`pageerror: ${e.message}`));
  const res = await page.goto(`${url}${route}`, { waitUntil: 'load', timeout: ROUTE_TIMEOUT_MS });
  await page.waitForLoadState('networkidle', { timeout: ROUTE_TIMEOUT_MS }).catch((e: Error) => consoleErrors.push(`networkidle: ${e.message.split('\n')[0]}`));
  return { route, engine, status: res?.status() ?? null, consoleErrors };
}

// ---------------------------------------------------------------- 5.x: canaries + cross-engine smoke
if (LINE === '5x') {
  test.describe('L11 canaries: own assertions from the packed tarball', () => {
    const apps = canaryApps(ROOT);
    test('canary apps exist @engine-chromium', () => {
      expect(apps.length, 'canaries/<app>/ fixtures').toBeGreaterThan(0);
      expect(apps).toContain(SMOKE_APP);
    });
    for (const app of apps) {
      test(`canaries/${app} @engine-chromium`, async () => {
        test.setTimeout(INSTALL_TIMEOUT_MS * 2);
        const script = ownAssertion(readPackage(join(ROOT, 'canaries', app)));
        expect(script, `canaries/${app}/package.json has a test or check script`).not.toBeNull();
        const dir = await prepare(app);
        expect(installedAuraGlass(dir), `canaries/${app}: node_modules/aura-glass is the installed tarball`).toBeNull();
        const r = runOwnAssertions(dir, script!);
        expect(r.status, `canaries/${app} \`${script}\` output:\n${r.output}`).toBe(0);
      });
    }
  });

  test.describe(`L11 ${SMOKE_APP} production server: every route, HTTP 200, 0 console errors`, () => {
    test.describe.configure({ mode: 'serial' });
    const appDir = join(ROOT, 'canaries', SMOKE_APP);
    const { routes, dynamic } = nextRoutes(appDir);
    let server: { url: string; child: ChildProcess } | null = null;
    const visits: RouteVisit[] = [];

    test.beforeAll(async ({ browserName }, testInfo) => {
      testInfo.setTimeout(INSTALL_TIMEOUT_MS * 2);
      console.log(`[L11] ${SMOKE_APP} server for ${browserName} on port ${3400 + testInfo.parallelIndex}`);
      await prepare(SMOKE_APP);
      server = await startNext(appDir, 3400 + testInfo.parallelIndex);
    });
    test.afterAll(async ({ browserName }) => {
      server?.child.kill('SIGTERM');
      writeEvidence(`routes-${browserName}.json`, { app: SMOKE_APP, routes, dynamic, visits });
    });

    test('routes are enumerable and cover every stream page', () => {
      expect(routes.length, `${SMOKE_APP} static routes`).toBeGreaterThan(0);
      const missing = missingStreamPages(appDir);
      if (dynamic.length) pendingOrFail(`dynamic route(s) without fixture params: ${dynamic.join(', ')}`, 'stream canary pages');
      if (missing.length) pendingOrFail(`canaries/${SMOKE_APP}/app has no page for stream(s) ${missing.join(', ')}`, missing.map((s) => s.toUpperCase()).join(', '));
    });
    for (const route of routes) {
      test(`${route}`, async ({ page, browserName }) => {
        const v = await visit(page, server!.url, route, browserName);
        visits.push(v);
        expect(routeVerdict(v), `${route} in ${browserName}`).toEqual([]);
      });
    }
    test('negative control: a route that does not exist fails the smoke rule', async ({ page, browserName }) => {
      const v = await visit(page, server!.url, '/__ag-l11-missing-route__', browserName);
      expect(v.status).toBe(404);
      expect(routeVerdict(v)).toEqual(expect.arrayContaining([expect.stringContaining('HTTP 404 (expected 200)')]));
    });
  });
}

// ---------------------------------------------------------------- consumer-4x (both lines)
test.describe('L11 tests/fixtures/consumer-4x', () => {
  test(`consumer-4x ${LINE === '4x' ? 'unchanged against the 4.x tarball' : 'after migrate 4to5 against the 5.x tarball'} @engine-chromium`, async () => {
    test.setTimeout(INSTALL_TIMEOUT_MS * 2);
    const missing = consumer4xMissing(ROOT);
    if (missing.length) pendingOrFail(`consumer-4x fixture incomplete: ${missing.join(', ')}`, 'PLAT REQ-PLAT-63');
    const work = mkdtempSync(join(tmpdir(), 'ag-consumer-4x-'));
    try {
      const fixture = join(work, 'fixture');
      cpSync(join(ROOT, CONSUMER_4X), fixture, { recursive: true, filter: (s) => !/[/\\]node_modules([/\\]|$)/.test(s) });
      const subset = readFlagshipSubset(fixture)!;
      let todos: ReturnType<typeof countTodos> | null = null;
      if (LINE === '5x') {
        const cli = packCli(ROOT, work);
        if ('problem' in cli) pendingOrFail(cli.problem, 'PLAT packages/cli migrate 4to5');
        const tools = join(work, 'tools');
        mkdirSync(tools);
        writeFileSync(join(tools, 'package.json'), '{"name":"ag-l11-tools","private":true}');
        const inst = sh('npm', ['install', '--no-audit', '--no-fund', '--no-package-lock', cli.tarball], tools);
        expect(inst.status, `install of the packed CLI:\n${inst.output}`).toBe(0);
        const mig = sh(join(tools, 'node_modules/.bin/auraglass'), ['migrate', '4to5', '--allow-no-git'], fixture);
        expect(mig.status, `migrate 4to5:\n${mig.output}`).toBe(0);
        todos = countTodos(fixture, subset);
        writeEvidence('consumer-4x.json', { line: LINE, flagshipFiles: subset.length, todos: todos.total, perFile: todos.perFile, missing: todos.missing });
        expect(todos.missing, 'flagship-subset.json files present after migrate').toEqual([]);
        expect(todos.total, `TODO(aura-glass 5) markers on the flagship subset: ${JSON.stringify(todos.perFile)}`).toBe(0);
      }
      const tgz = tarball();
      const inst = sh('npm', ['install', '--no-audit', '--no-fund', '--no-package-lock', '--legacy-peer-deps', tgz], fixture, INSTALL_TIMEOUT_MS);
      expect(inst.status, `install of ${tgz}:\n${inst.output}`).toBe(0);
      expect(installedAuraGlass(fixture), 'consumer-4x: node_modules/aura-glass is the installed tarball').toBeNull();
      const pkg = readPackage(fixture);
      const script = ownAssertion(pkg) ?? 'build';
      const r = sh('npm', ['run', script], fixture, INSTALL_TIMEOUT_MS);
      if (LINE === '4x') writeEvidence('consumer-4x.json', { line: LINE, flagshipFiles: subset.length, todos: null, script, exit: r.status });
      expect(r.status, `consumer-4x \`${script}\` (${LINE}):\n${r.output}`).toBe(0);
    } finally {
      rmSync(work, { recursive: true, force: true });
    }
  });
});
