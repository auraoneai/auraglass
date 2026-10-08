/* tests/dx/quickstart.spec.ts — PLAT-387/388. Replays every {step} block
   in docs/quickstart/{next,vite}.md inside the alpha-smoke fixture and
   records timings into .artifacts/dx/quickstart-timing.json. Remote-only:
   scaffolds real apps (no fixture networks on dev machines).
   Cells: next×init, next×add, vite×init, vite×add — ≤300s / ≤240s budgets. */
import { test, expect } from '@playwright/test';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, writeFileSync, mkdirSync, cpSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const FIXTURE = join(ROOT, 'tests/dx/fixtures/alpha-smoke');
const TIMING_OUT = join(ROOT, '.artifacts/dx/quickstart-timing.json');
const STEP_RE = /\{step[^}]*\}\s*```(?:bash|ts|tsx)\n([\s\S]*?)```/g;

export function steps(docPath: string): string[] {
  const src = readFileSync(docPath, 'utf8');
  return [...src.matchAll(STEP_RE)].map((m) => m[1].trim()).filter((s) => s.startsWith('npx') || s.startsWith('npm') || s.startsWith('cd'));
}

test.describe('quickstart replay', () => {
  test.skip(!process.env.CI, 'remote-only: scaffolds real apps and times the network path');

  for (const [doc, budget, appDir] of [['next', 300_000, 'my-app'], ['vite', 240_000, 'my-app']] as const) {
    test(`${doc} quickstart completes ≤ ${budget / 1000}s`, () => {
      const work = mkdtempSync(join(tmpdir(), `qs-${doc}-`));
      cpSync(FIXTURE, join(work, 'smoke'), { recursive: true });
      const commands = steps(join(ROOT, `docs/quickstart/${doc}.md`));
      expect(commands.length, `${doc}.md must stay ≤ 6 commands`).toBeLessThanOrEqual(6);
      const t0 = Date.now();
      let cwd = work;
      for (const cmd of commands) {
        if (cmd.startsWith('cd ')) { cwd = join(work, cmd.slice(3).trim()); continue; }
        const [bin, ...args] = cmd.split(/\s+/);
        execFileSync(bin, args, { cwd, timeout: budget, stdio: 'pipe', env: { ...process.env, CI: '1' } });
        if (existsSync(join(work, appDir))) cwd = join(work, appDir);
      }
      const seconds = (Date.now() - t0) / 1000;
      mkdirSync(dirname(TIMING_OUT), { recursive: true });
      const timings = existsSync(TIMING_OUT) ? JSON.parse(readFileSync(TIMING_OUT, 'utf8')) : {};
      timings[`quickstart-seconds-${doc}`] = { value: seconds, at: new Date().toISOString() };
      writeFileSync(TIMING_OUT, JSON.stringify(timings, null, 2) + '\n');
      expect(seconds).toBeLessThanOrEqual(budget / 1000);
    });
  }
});
