/* tests/dx/quickstart.spec.ts — REQ-PLAT-103 (PLAT-386/387/388), AC-PLAT-29.
   Remote L11 subject (fragments/lanes/plat.ts) run by plat:test:docs; never on
   a dev machine (a local invocation exits 2 with the remote command).

   "Install to beautiful": executes the `{step}` blocks of
   docs/quickstart/{next,vite}.md literally — one command per block, `cd`
   moves the working directory, `file=` blocks replace that file — in four
   cells: next-tailwind, next-plain, vite-plain, vite-tailwind. Each cell is a
   fresh directory and HOME against a `verdaccio` registry seeded with the
   packed aura-glass, aura-glass-cli and aura-glass-registry (third-party
   packages proxied from npmjs, cache warmed before the first cell).

   Per cell it asserts:
     - ≤6 commands and ≤2 manual edits;
     - measured wall time of install + init + add + edit + build (dev server
       ready) + first render ≤300 s Next / ≤240 s Vite (targets 180/120 s);
     - the first screenshot after `load` + two rAF, at 1440×900 and 390×844,
       shows [data-ag-surface][data-ag-layer="chrome"] passing material
       presence (backdrop σ(L) under the surface with only it hidden);
     - 0 console errors / page errors;
     - no "use client" boundary error (browser or dev-server output);
     - next-tailwind: an element styled only with `glass-regular` computes the
       same backdrop-filter as [data-ag-variant=regular].

   Target block: resolved from the registry index (S-46, scripts/registry/
   build.mjs). When registry/blocks/app-frame/ is absent or its
   meta.auraglass.certified is not the run's SHA, the cell renders
   tests/dx/fixtures/alpha-smoke/ instead of `add app-frame` + the block edit,
   runs every check on it, and records the cell `pending` (the GA checklist
   measures app-frame only).

   Output: .artifacts/plat/quickstart-timing.json (per-phase timings and checks
   per cell, plus the quickstart-seconds-{next,vite} claims gen-claims reads)
   and screenshots under .artifacts/plat/quickstart/.

   Inputs: tarballs from plat:package:pack in .artifacts/pack/ (or
   $AG_QUICKSTART_TARBALLS); verdaccio storage in
   $AG_QUICKSTART_VERDACCIO_STORAGE (default .artifacts/plat/verdaccio-storage,
   cacheable — the three AuraGlass packages are removed and re-published every
   run). */
import { test, expect, type Page } from '@playwright/test';
import { spawn, spawnSync, type ChildProcess } from 'node:child_process';
import { cpSync, existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { createServer } from 'node:net';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { commandOf, countSteps, isEdit, isShell, parseQuickstart, stepsFor } from '../../scripts/docs/quickstart-steps.mjs';
import { ARTIFACTS } from '../../scripts/docs/paths.mjs';
import { build as buildRegistry } from '../../scripts/registry/build.mjs';
import {
  BUDGET_SECONDS, TARGET_SECONDS, TIMED_PHASES, aggregateTiming, boundaryErrors, devServerUrl, lumSigma, materialVerdict,
  type CellRecord, type Check, type Framework, type TimingFile,
} from './lib/quickstart';

const REMOTE_COMMAND = 'npx playwright test tests/dx/quickstart.spec.ts (GitLab plat:test:docs, L11)';
if (!(process.env.CI === 'true' || process.env.AG_REMOTE_RUNNER === '1')) {
  console.error(`tests/dx/quickstart.spec.ts is remote-only (scaffolds real apps, runs verdaccio and a browser).\nRemote command: ${REMOTE_COMMAND}`);
  process.exit(2);
}

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const TIMING_OUT = join(ROOT, ARTIFACTS.quickstartTiming as string);
const SHOT_DIR = join(ROOT, '.artifacts/plat/quickstart');
const ALPHA_SMOKE = join(ROOT, 'tests/dx/fixtures/alpha-smoke');
const PARITY_PROBE = join(ROOT, 'tests/dx/fixtures/quickstart-probes');
const VERDACCIO_VERSION = '6.10.5';
const VIEWPORTS = [{ width: 1440, height: 900 }, { width: 390, height: 844 }] as const;
const CHROME_SURFACE = '[data-ag-surface][data-ag-layer="chrome"]';
const STEP_TIMEOUT_MS = 15 * 60_000;
const SHA = process.env.AG_RELEASE_SHA ?? process.env.CI_COMMIT_SHA
  ?? spawnSync('git', ['rev-parse', 'HEAD'], { cwd: ROOT, encoding: 'utf8' }).stdout.trim();

const CELLS: Array<{ cell: string; framework: Framework; variant: 'tailwind' | 'plain'; parity: boolean }> = [
  { cell: 'next-tailwind', framework: 'next', variant: 'tailwind', parity: true },
  { cell: 'next-plain', framework: 'next', variant: 'plain', parity: false },
  { cell: 'vite-plain', framework: 'vite', variant: 'plain', parity: false },
  { cell: 'vite-tailwind', framework: 'vite', variant: 'tailwind', parity: false },
];

interface Ctx {
  registryUrl: string;
  token: string;
  npmCache: string;
  registryDir: string | null;
  target: 'app-frame' | 'alpha-smoke';
  targetReason: string;
  verdaccio: ChildProcess | null;
}
const ctx: Ctx = { registryUrl: '', token: '', npmCache: '', registryDir: null, target: 'alpha-smoke', targetReason: '', verdaccio: null };

/* ------------------------------------------------------------ processes */

/** Inherited env minus npm_config_* / AURAGLASS_* (cells get a clean HOME instead). */
function baseEnv(extra: Record<string, string>): NodeJS.ProcessEnv {
  const env: NodeJS.ProcessEnv = {};
  for (const [k, v] of Object.entries(process.env)) {
    if (/^npm_config_/i.test(k) || /^AURAGLASS_/.test(k) || k === 'PORT' || k === 'NODE_ENV') continue;
    env[k] = v;
  }
  return { ...env, CI: 'true', NEXT_TELEMETRY_DISABLED: '1', ...extra };
}

const tail = (s: string | null | undefined, n = 40) => (s ?? '').split('\n').slice(-n).join('\n');

function run(cmd: string, cwd: string, env: NodeJS.ProcessEnv): { ms: number; output: string } {
  const t0 = Date.now();
  const r = spawnSync('bash', ['-c', cmd], { cwd, env, encoding: 'utf8', timeout: STEP_TIMEOUT_MS, maxBuffer: 256 * 1024 * 1024 });
  const output = `${r.stdout ?? ''}\n${r.stderr ?? ''}`;
  if (r.status !== 0) throw new Error(`\`${cmd}\` failed in ${cwd} (${r.error?.message ?? r.signal ?? `exit ${r.status}`})\n${tail(output)}`);
  return { ms: Date.now() - t0, output };
}

function killGroup(child: ChildProcess | null): Promise<void> {
  if (!child?.pid || child.exitCode !== null) return Promise.resolve();
  return new Promise((done) => {
    const timer = setTimeout(() => { try { process.kill(-child.pid!, 'SIGKILL'); } catch { /* gone */ } done(); }, 10_000);
    child.once('exit', () => { clearTimeout(timer); done(); });
    try { process.kill(-child.pid!, 'SIGTERM'); } catch { clearTimeout(timer); done(); }
  });
}

function freePort(): Promise<number> {
  return new Promise((res, rej) => {
    const srv = createServer();
    srv.once('error', rej);
    srv.listen(0, '127.0.0.1', () => { const { port } = srv.address() as { port: number }; srv.close(() => res(port)); });
  });
}

async function waitFor<T>(what: string, timeoutMs: number, probe: () => Promise<T | null>): Promise<T> {
  const t0 = Date.now();
  let last = '';
  while (Date.now() - t0 < timeoutMs) {
    try { const v = await probe(); if (v !== null) return v; } catch (e) { last = String(e); }
    await new Promise((r) => setTimeout(r, 250));
  }
  throw new Error(`timed out after ${timeoutMs / 1000}s waiting for ${what}${last ? ` (${last})` : ''}`);
}

/* ------------------------------------------------------------ registry */

function tarballs(): Record<'aura-glass' | 'aura-glass-cli' | 'aura-glass-registry', string> {
  const dir = resolve(ROOT, process.env.AG_QUICKSTART_TARBALLS ?? '.artifacts/pack');
  if (!existsSync(dir)) throw new Error(`${dir} missing: plat:test:docs needs the plat:package:pack artifacts (.artifacts/pack/*.tgz)`);
  const found: Record<string, string> = {};
  for (const f of readdirSync(dir).filter((x) => x.endsWith('.tgz'))) {
    const r = spawnSync('tar', ['-xOzf', join(dir, f), 'package/package.json'], { encoding: 'utf8' });
    if (r.status === 0) found[(JSON.parse(r.stdout) as { name: string }).name] = join(dir, f);
  }
  const want = ['aura-glass', 'aura-glass-cli', 'aura-glass-registry'] as const;
  const missing = want.filter((n) => !found[n]);
  if (missing.length) throw new Error(`packed tarball(s) missing in ${dir}: ${missing.join(', ')}`);
  return found as Record<(typeof want)[number], string>;
}

function verdaccioConfig(storage: string, htpasswd: string): string {
  return [
    `storage: ${JSON.stringify(storage)}`,
    'max_body_size: 500mb',
    'web: { enable: false }',
    'auth:',
    '  htpasswd:',
    `    file: ${JSON.stringify(htpasswd)}`,
    '    max_users: 10',
    'uplinks:',
    '  npmjs:',
    '    url: https://registry.npmjs.org/',
    '    timeout: 60s',
    '    cache: true',
    'packages:',
    "  'aura-glass':",
    '    access: $all',
    '    publish: $authenticated',
    "  'aura-glass-*':",
    '    access: $all',
    '    publish: $authenticated',
    "  '**':",
    '    access: $all',
    '    publish: $authenticated',
    '    proxy: npmjs',
    'log: { type: stdout, format: pretty, level: warn }',
    '',
  ].join('\n');
}

/** Clean per-cell HOME: npmrc pointing at verdaccio, shared warm npm cache, git identity. */
function makeHome(): string {
  const home = mkdtempSync(join(tmpdir(), 'qs-home-'));
  const host = ctx.registryUrl.replace(/^https?:/, '');
  writeFileSync(join(home, '.npmrc'), [
    `registry=${ctx.registryUrl}`,
    `${host}:_authToken=${ctx.token}`,
    `cache=${ctx.npmCache}`,
    'fund=false', 'audit=false', 'update-notifier=false', '',
  ].join('\n'));
  writeFileSync(join(home, '.gitconfig'), '[user]\n\tname = AuraGlass Quickstart\n\temail = quickstart@example.invalid\n[init]\n\tdefaultBranch = main\n');
  return home;
}

/** Resolve the quickstart target from the registry index (S-46). */
function resolveTarget(work: string): void {
  if (!existsSync(join(ROOT, 'registry/blocks/app-frame/registry-item.json'))) {
    ctx.target = 'alpha-smoke'; ctx.targetReason = 'registry/blocks/app-frame/ absent'; return;
  }
  const { index, report } = buildRegistry({ sha: SHA, write: false }) as {
    index: { items: Array<{ name: string }> };
    report: { items: Array<{ name: string; kind: string; status: string; reason?: string }> };
  };
  const row = report.items.find((i) => i.name === 'app-frame' && i.kind === 'blocks');
  if (row?.status !== 'certified') {
    ctx.target = 'alpha-smoke';
    ctx.targetReason = `app-frame ${row?.status ?? 'missing from index'}${row?.reason ? ` (${row.reason})` : ''}; run SHA ${SHA}`;
    return;
  }
  /* The run's certified items, as the CLI fetches them (`<registry>/<name>.json`). */
  const dir = join(work, 'registry');
  mkdirSync(dir, { recursive: true });
  const certified = new Set(report.items.filter((i) => i.status === 'certified').map((i) => i.name));
  for (const item of index.items.filter((i) => certified.has(i.name))) writeFileSync(join(dir, `${item.name}.json`), JSON.stringify(item, null, 2));
  ctx.registryDir = dir;
  ctx.target = 'app-frame';
  ctx.targetReason = `app-frame certified for ${SHA}`;
}

/* ------------------------------------------------------------ artifact */

function readTiming(): TimingFile {
  if (existsSync(TIMING_OUT)) {
    const prev = JSON.parse(readFileSync(TIMING_OUT, 'utf8')) as TimingFile;
    if (prev.sha === SHA && prev.cells) return prev;
  }
  return { sha: SHA, generatedAt: new Date().toISOString(), cells: {} };
}

function writeCell(rec: CellRecord): void {
  const file = readTiming();
  file.cells[rec.cell] = rec;
  file.generatedAt = new Date().toISOString();
  file.target = { block: 'app-frame', resolved: ctx.target, reason: ctx.targetReason };
  mkdirSync(dirname(TIMING_OUT), { recursive: true });
  writeFileSync(TIMING_OUT, JSON.stringify(aggregateTiming(file, CELLS), null, 2) + '\n');
}

/* ------------------------------------------------------------ browser checks */

const twoRaf = (page: Page) => page.evaluate(() => new Promise<void>((r) => requestAnimationFrame(() => requestAnimationFrame(() => r()))));

/** Material presence: σ(L) of the backdrop under the chrome surface, captured with only it hidden. */
async function materialPresence(page: Page, decoder: Page, vp: { width: number; height: number }): Promise<Check> {
  const name = `material-presence ${vp.width}x${vp.height}`;
  const surface = page.locator(CHROME_SURFACE).first();
  if ((await page.locator(CHROME_SURFACE).count()) === 0) return { name, pass: false, detail: `no ${CHROME_SURFACE} rendered` };
  const box = await surface.boundingBox();
  const x = Math.max(0, Math.floor(box?.x ?? 0));
  const y = Math.max(0, Math.floor(box?.y ?? 0));
  const width = Math.min(vp.width, Math.ceil((box?.x ?? 0) + (box?.width ?? 0))) - x;
  const height = Math.min(vp.height, Math.ceil((box?.y ?? 0) + (box?.height ?? 0))) - y;
  if (!box || width <= 0 || height <= 0) return { name, pass: false, detail: `${CHROME_SURFACE} has no visible box in the viewport` };
  await surface.evaluate((el: HTMLElement) => { el.dataset.qsVisibility = el.style.visibility; el.style.visibility = 'hidden'; });
  await twoRaf(page);
  const png = await page.screenshot({ clip: { x, y, width, height } });
  await surface.evaluate((el: HTMLElement) => { el.style.visibility = el.dataset.qsVisibility ?? ''; delete el.dataset.qsVisibility; });
  const b64 = await decoder.evaluate(async (src: string) => {
    const img = new Image();
    img.src = `data:image/png;base64,${src}`;
    await img.decode();
    const c = document.createElement('canvas');
    c.width = img.naturalWidth; c.height = img.naturalHeight;
    const g = c.getContext('2d')!;
    g.drawImage(img, 0, 0);
    const d = g.getImageData(0, 0, c.width, c.height).data;
    let s = '';
    for (let i = 0; i < d.length; i += 0x8000) s += String.fromCharCode(...d.subarray(i, i + 0x8000));
    return btoa(s);
  }, png.toString('base64'));
  const rgba = Buffer.from(b64, 'base64');
  const v = materialVerdict(lumSigma(rgba), rgba.length / 4);
  return { name, pass: v.pass, detail: v.detail };
}

async function backdropParity(page: Page, url: string): Promise<Check> {
  await page.goto(`${url}/ag-quickstart-parity`, { waitUntil: 'load' });
  await twoRaf(page);
  const r = await page.evaluate(() => {
    const bf = (el: Element | null) => {
      if (!el) return null;
      const cs = getComputedStyle(el) as CSSStyleDeclaration & { webkitBackdropFilter?: string };
      return cs.backdropFilter || cs.webkitBackdropFilter || 'none';
    };
    return {
      tailwind: bf(document.querySelector('[data-qs-probe="tailwind"]')),
      material: bf(document.querySelector('[data-qs-probe="material"][data-ag-variant="regular"]')),
    };
  });
  return {
    name: 'glass-regular parity',
    pass: r.material !== null && r.material !== 'none' && r.tailwind === r.material,
    // eslint-disable-next-line auraglass/no-optics-outside-material -- failure detail text naming the compared property
    detail: `glass-regular backdrop-filter=${r.tailwind} vs [data-ag-variant=regular]=${r.material}`,
  };
}

/* ------------------------------------------------------------ suite */

test.describe.configure({ mode: 'serial' });

test.describe('quickstart: install to beautiful (REQ-PLAT-103, remote)', () => {
  test.beforeAll(async () => {
    test.setTimeout(20 * 60_000);
    const packs = tarballs();
    const work = mkdtempSync(join(tmpdir(), 'qs-setup-'));
    resolveTarget(work);

    /* verdaccio: persistent (cacheable) storage for proxied third-party
       packages; the AuraGlass packages are always the run's tarballs. */
    const storage = resolve(ROOT, process.env.AG_QUICKSTART_VERDACCIO_STORAGE ?? '.artifacts/plat/verdaccio-storage');
    mkdirSync(storage, { recursive: true });
    for (const p of ['aura-glass', 'aura-glass-cli', 'aura-glass-registry', 'aura-glass-mcp', 'aura-glass-labs', '.verdaccio-db.json']) rmSync(join(storage, p), { recursive: true, force: true });
    const vHome = mkdtempSync(join(tmpdir(), 'qs-verdaccio-'));
    const cfg = join(vHome, 'config.yaml');
    writeFileSync(cfg, verdaccioConfig(storage, join(vHome, 'htpasswd')));
    const port = await freePort();
    ctx.registryUrl = `http://127.0.0.1:${port}/`;
    let vlog = '';
    ctx.verdaccio = spawn('npx', ['--yes', `verdaccio@${VERDACCIO_VERSION}`, '--config', cfg, '--listen', `http://127.0.0.1:${port}`],
      { env: baseEnv({ HOME: vHome }), detached: true, stdio: ['ignore', 'pipe', 'pipe'] });
    ctx.verdaccio.stdout?.on('data', (d) => { vlog += String(d); });
    ctx.verdaccio.stderr?.on('data', (d) => { vlog += String(d); });
    await waitFor(`verdaccio on ${ctx.registryUrl}\n${tail(vlog)}`, 180_000, async () => ((await fetch(`${ctx.registryUrl}-/ping`)).ok ? true : null));

    /* A local-only user for publishing the run's tarballs. */
    const res = await fetch(`${ctx.registryUrl}-/user/org.couchdb.user:quickstart`, {
      method: 'PUT',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ name: 'quickstart', password: `qs-${port}-${Date.now()}`, type: 'user', roles: [], date: new Date().toISOString() }),
    });
    const body = (await res.json()) as { token?: string };
    if (!res.ok || !body.token) throw new Error(`verdaccio adduser failed: ${res.status} ${JSON.stringify(body)}`);
    ctx.token = body.token;
    ctx.npmCache = mkdtempSync(join(tmpdir(), 'qs-npm-cache-'));

    const home = makeHome();
    const env = baseEnv({ HOME: home });
    const publish = (tgz: string) => run(`npm publish ${JSON.stringify(tgz)} --registry ${ctx.registryUrl} --tag latest --access public --no-provenance --ignore-scripts`, work, env);
    publish(packs['aura-glass']);
    publish(packs['aura-glass-cli']);
    publish(packs['aura-glass-registry']);
    const agVersion = (JSON.parse(spawnSync('tar', ['-xOzf', packs['aura-glass'], 'package/package.json'], { encoding: 'utf8' }).stdout) as { version: string }).version;
    /* The quickstarts install `aura-glass@next` (the 5.0 pre-release train). */
    run(`npm dist-tag add aura-glass@${agVersion} next --registry ${ctx.registryUrl}`, work, env);

    /* Warm the third-party cache (verdaccio storage + shared npm cache). */
    const warm = join(work, 'warm');
    mkdirSync(warm);
    writeFileSync(join(warm, 'package.json'), '{ "name": "qs-warm", "private": true }\n');
    run('npm install aura-glass@next aura-glass-cli@latest --no-save --no-package-lock --ignore-scripts', warm, env);
  });

  test.afterAll(async () => {
    await killGroup(ctx.verdaccio);
  });

  for (const spec of CELLS) {
    test(`${spec.cell}: docs/quickstart/${spec.framework}.md renders app-frame within ${BUDGET_SECONDS[spec.framework]}s`, async ({ page, context }, testInfo) => {
      test.setTimeout(30 * 60_000);
      const blocks = stepsFor(parseQuickstart(readFileSync(join(ROOT, `docs/quickstart/${spec.framework}.md`), 'utf8')), spec.variant);
      const counts = countSteps(blocks);
      const target = ctx.target;
      const rec: CellRecord = {
        cell: spec.cell, framework: spec.framework, variant: spec.variant, target,
        status: 'fail', commands: counts.commands, manualEdits: counts.edits,
        phases: {}, scaffoldSeconds: 0, totalSeconds: 0,
        budgetSeconds: BUDGET_SECONDS[spec.framework], targetSeconds: TARGET_SECONDS[spec.framework],
        checks: [], at: new Date().toISOString(),
      };
      const checks = rec.checks;
      checks.push({ name: 'commands', pass: counts.commands <= 6, detail: `${counts.commands} shell commands (max 6)` });
      checks.push({ name: 'manual-edits', pass: counts.edits <= 2, detail: `${counts.edits} manual edits (max 2)` });

      const work = mkdtempSync(join(tmpdir(), `qs-${spec.cell}-`));
      const home = makeHome();
      const env = baseEnv({ HOME: home, ...(ctx.registryDir ? { AURAGLASS_REGISTRY: ctx.registryDir } : {}) });
      const time = (phase: string, ms: number) => { rec.phases[phase] = Number(((rec.phases[phase] ?? 0) + ms / 1000).toFixed(3)); };
      const consoleErrors: string[] = [];
      page.on('console', (m) => { if (m.type() === 'error') consoleErrors.push(m.text()); });
      page.on('pageerror', (e) => consoleErrors.push(`pageerror: ${e.message}`));
      let server: ChildProcess | null = null;
      let serverLog = '';
      let cwd = work;

      try {
        for (const b of blocks) {
          const timed = b.kind === 'step';
          if (b.phase === 'add' && target === 'alpha-smoke') continue; // block pending: alpha-smoke replaces add + edit
          if (isEdit(b)) {
            const t0 = Date.now();
            if (b.kind === 'step' && target === 'alpha-smoke') {
              /* Same file the quickstart edits, alpha-smoke content. */
              const entry = join(ALPHA_SMOKE, b.file!);
              if (!existsSync(entry)) throw new Error(`alpha-smoke has no ${b.file} for ${spec.framework}`);
              cpSync(join(ALPHA_SMOKE, 'components'), join(cwd, 'components'), { recursive: true });
              mkdirSync(dirname(join(cwd, b.file!)), { recursive: true });
              cpSync(entry, join(cwd, b.file!));
              time('alphaSmoke', Date.now() - t0);
            } else {
              mkdirSync(dirname(join(cwd, b.file!)), { recursive: true });
              writeFileSync(join(cwd, b.file!), `${b.body}\n`);
              if (timed) time('edit', Date.now() - t0);
            }
            continue;
          }
          if (!isShell(b)) throw new Error(`line ${b.line}: unsupported block (${b.lang})`);
          const cmd = commandOf(b);
          const cd = cmd.match(/^cd\s+(\S+)$/);
          if (cd) {
            cwd = resolve(cwd, cd[1]!);
            if (!existsSync(cwd)) throw new Error(`\`${cmd}\`: ${cwd} does not exist`);
            continue;
          }
          if (b.phase === 'run') {
            if (spec.parity) cpSync(join(PARITY_PROBE, 'app'), join(cwd, 'app'), { recursive: true });
            const t0 = Date.now();
            server = spawn('bash', ['-c', cmd], { cwd, env, detached: true, stdio: ['ignore', 'pipe', 'pipe'] });
            server.stdout?.on('data', (d) => { serverLog += String(d); });
            server.stderr?.on('data', (d) => { serverLog += String(d); });
            const url = await waitFor(`dev server URL from \`${cmd}\``, rec.budgetSeconds * 1000, async () => {
              if (server!.exitCode !== null) throw new Error(`\`${cmd}\` exited ${server!.exitCode}\n${tail(serverLog)}`);
              return devServerUrl(serverLog);
            });
            /* Any HTTP response means the first compile finished; the status is a check. */
            const status = await waitFor(`${url}/ to respond`, rec.budgetSeconds * 1000, async () => (await fetch(`${url}/`)).status);
            time('build', Date.now() - t0);
            checks.push({ name: 'http-status', pass: status === 200, detail: `GET ${url}/ → ${status}` });

            const decoder = await context.newPage();
            for (const [i, vp] of VIEWPORTS.entries()) {
              await page.setViewportSize(vp);
              const r0 = Date.now();
              await page.goto(`${url}/`, { waitUntil: 'load' });
              await twoRaf(page);
              const shot = await page.screenshot();
              if (i === 0) time('firstRender', Date.now() - r0);
              mkdirSync(SHOT_DIR, { recursive: true });
              const shotPath = join(SHOT_DIR, `${spec.cell}-${vp.width}x${vp.height}.png`);
              writeFileSync(shotPath, shot);
              await testInfo.attach(`${spec.cell}-${vp.width}x${vp.height}`, { path: shotPath, contentType: 'image/png' });
              checks.push(await materialPresence(page, decoder, vp));
            }
            await decoder.close();
            if (spec.parity) checks.push(await backdropParity(page, url));
            continue;
          }
          const r = run(cmd, cwd, env);
          if (b.phase === 'scaffold' || b.kind === 'prepare') rec.scaffoldSeconds = Number((rec.scaffoldSeconds + r.ms / 1000).toFixed(3));
          else time(b.phase, r.ms);
        }

        rec.totalSeconds = Number(TIMED_PHASES.reduce((s, p) => s + (rec.phases[p] ?? 0), 0).toFixed(3));
        checks.push({ name: 'budget', pass: rec.totalSeconds <= rec.budgetSeconds, detail: `${rec.totalSeconds}s measured (budget ${rec.budgetSeconds}s, target ${rec.targetSeconds}s)` });
        checks.push({ name: 'console-errors', pass: consoleErrors.length === 0, detail: consoleErrors.length ? consoleErrors.slice(0, 10).join(' | ') : '0 console errors' });
        const boundary = boundaryErrors(`${serverLog}\n${consoleErrors.join('\n')}`);
        checks.push({ name: 'use-client-boundary', pass: boundary.length === 0, detail: boundary.length ? boundary.slice(0, 5).join(' | ') : 'no client-boundary error' });
        const failed = checks.filter((c) => !c.pass);
        rec.status = failed.length ? 'fail' : target === 'alpha-smoke' ? 'pending' : 'pass';
        if (failed.length) rec.reason = failed.map((c) => c.name).join(', ');
        else if (target === 'alpha-smoke') rec.reason = `block cell pending: ${ctx.targetReason}`;
      } catch (e) {
        rec.status = 'fail';
        rec.reason = String((e as Error).message ?? e);
        checks.push({ name: 'steps', pass: false, detail: rec.reason });
      } finally {
        await killGroup(server);
        writeCell(rec);
        if (target === 'alpha-smoke') testInfo.annotations.push({ type: 'pending', description: `app-frame cell pending — rendered alpha-smoke (${ctx.targetReason})` });
      }

      for (const c of checks) expect(c.pass, `${spec.cell} ${c.name}: ${c.detail}`).toBe(true);
    });
  }
});
