/* tests/dx/quickstart.spec.ts — PLAT-387/388, PLAT-103 (REQ-FIN-43). Replays
   every {step} block in docs/quickstart/{next,vite}.md — one shell command per
   line — against a verdaccio registry seeded with this commit's packed
   `aura-glass` + `@auraglass/cli` tarballs, with the CLI registry pointed at the
   locally built registry output, and records timings into
   .artifacts/plat/quickstart-timing.json (scripts/docs/paths.mjs
   quickstartTiming, read by gen-claims). Remote-only: scaffolds real apps.
   Budgets: next ≤300s, vite ≤240s. */
import { test, expect } from '@playwright/test';
import { execFileSync, spawn } from 'node:child_process';
import { mkdtempSync, readFileSync, writeFileSync, mkdirSync, cpSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { findTarballs, startLocalRegistry, type LocalRegistry } from './lib/local-registry';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const FIXTURE = join(ROOT, 'tests/dx/fixtures/alpha-smoke');
const TIMING_OUT = join(ROOT, '.artifacts/plat/quickstart-timing.json');
const PACK_DIR = process.env.AG_QUICKSTART_PACK_DIR ?? join(ROOT, '.artifacts/pack');
const REGISTRY_DIR = process.env.AG_QUICKSTART_REGISTRY_DIR ?? join(ROOT, 'apps/docs/public/r');
const STEP_RE = /\{step[^}]*\}\s*```(?:bash|ts|tsx)\n([\s\S]*?)```/g;

/** Shell commands of every {step} block, one per non-empty, non-comment line. */
export function steps(docPath: string): string[] {
  const src = readFileSync(docPath, 'utf8');
  return [...src.matchAll(STEP_RE)]
    .flatMap((m) => m[1]!.split('\n'))
    .map((l) => l.trim())
    .filter((s) => s.startsWith('npx ') || s.startsWith('npm ') || s.startsWith('cd '));
}

/** `aura-glass@^5` cannot match a 5.0.0 prerelease (semver excludes them from
    ranges); while the packed version is a prerelease, pin the doc's spec to it. */
function resolveSpec(arg: string, seeded: Record<string, string>): string {
  const m = /^(aura-glass|@auraglass\/[a-z-]+)@(.+)$/.exec(arg);
  if (!m) return arg;
  const v = seeded[m[1]!];
  return v && v.includes('-') ? `${m[1]}@${v}` : arg;
}

/** `npm run dev` never exits: start it, wait for the first local URL it prints,
    require an HTTP 200 from it, then stop the server (the step is "dev server up"). */
async function devServerUp(cwd: string, env: NodeJS.ProcessEnv, timeoutMs: number): Promise<void> {
  const proc = spawn('npm', ['run', 'dev'], { cwd, env, stdio: ['ignore', 'pipe', 'pipe'], detached: true });
  let log = '';
  try {
    const url = await new Promise<string>((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error(`dev server printed no URL within ${timeoutMs} ms:\n${log}`)), timeoutMs);
      const onData = (b: Buffer) => {
        log += b.toString();
        const m = /https?:\/\/(?:localhost|127\.0\.0\.1):\d+/.exec(log);
        if (m) { clearTimeout(timer); resolve(m[0]); }
      };
      proc.stdout!.on('data', onData);
      proc.stderr!.on('data', onData);
      proc.once('exit', (code) => { clearTimeout(timer); reject(new Error(`dev server exited (${code}):\n${log}`)); });
    });
    const deadline = Date.now() + timeoutMs;
    let status = 0;
    while (Date.now() < deadline) {
      try { status = (await fetch(url)).status; if (status === 200) break; } catch { /* compiling */ }
      await new Promise((r) => setTimeout(r, 1000));
    }
    expect(status, `dev server ${url} answered 200`).toBe(200);
  } finally {
    // detached: kill the whole group (npm -> next/vite children).
    try { process.kill(-proc.pid!, 'SIGTERM'); } catch { /* already gone */ }
  }
}

test.describe('quickstart replay', () => {
  test.skip(!process.env.CI, 'remote-only: scaffolds real apps and times the network path');
  test.describe.configure({ mode: 'serial' });

  let registry: LocalRegistry;
  test.beforeAll(async () => {
    test.setTimeout(300_000);
    registry = await startLocalRegistry(findTarballs(PACK_DIR, ['aura-glass-', 'auraglass-cli-']));
    expect(Object.keys(registry.seeded).sort(), 'packed tarballs seeded').toEqual(['@auraglass/cli', 'aura-glass']);
    expect(existsSync(REGISTRY_DIR), `built registry at ${REGISTRY_DIR} (node scripts/registry/build.mjs)`).toBe(true);
  });
  test.afterAll(() => registry?.stop());

  for (const [doc, budget, appDir] of [['next', 300_000, 'my-app'], ['vite', 240_000, 'my-app']] as const) {
    test(`${doc} quickstart completes ≤ ${budget / 1000}s`, async () => {
      test.setTimeout(budget + 60_000);
      const work = mkdtempSync(join(tmpdir(), `qs-${doc}-`));
      cpSync(FIXTURE, join(work, 'smoke'), { recursive: true });
      const commands = steps(join(ROOT, `docs/quickstart/${doc}.md`));
      expect(commands.length, `${doc}.md must stay ≤ 6 commands`).toBeLessThanOrEqual(6);
      // Project-level .npmrc (no token) routes every npm/npx call in the app to the seeded registry.
      const npmrc = `registry=${registry.url}/\n`;
      writeFileSync(join(work, '.npmrc'), npmrc);
      const env = { ...process.env, CI: '1', AURAGLASS_REGISTRY: REGISTRY_DIR };
      const t0 = Date.now();
      let cwd = work;
      for (const cmd of commands) {
        if (cmd.startsWith('cd ')) { cwd = join(work, cmd.slice(3).trim()); continue; }
        const [bin = '', ...args] = cmd.split(/\s+/);
        const remaining = budget - (Date.now() - t0);
        expect(remaining, `${doc}: budget exhausted before \`${cmd}\``).toBeGreaterThan(0);
        if (cmd === 'npm run dev') { await devServerUp(cwd, env, remaining); continue; }
        execFileSync(bin, args.map((a) => resolveSpec(a, registry.seeded)), { cwd, timeout: remaining, stdio: 'pipe', env });
        if (existsSync(join(work, appDir))) {
          cwd = join(work, appDir);
          if (!existsSync(join(cwd, '.npmrc'))) writeFileSync(join(cwd, '.npmrc'), npmrc);
        }
      }
      const seconds = (Date.now() - t0) / 1000;
      mkdirSync(dirname(TIMING_OUT), { recursive: true });
      const timings = existsSync(TIMING_OUT) ? JSON.parse(readFileSync(TIMING_OUT, 'utf8')) : {};
      timings[`quickstart-seconds-${doc}`] = { value: seconds, at: new Date().toISOString(), versions: registry.seeded };
      writeFileSync(TIMING_OUT, JSON.stringify(timings, null, 2) + '\n');
      expect(seconds).toBeLessThanOrEqual(budget / 1000);
    });
  }
});
