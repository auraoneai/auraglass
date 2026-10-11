/* REQ-QUAL-67 (FIN-425): remote-only guard. No QUAL script launches a browser unless CI=true or AG_REMOTE_RUNNER=1; a
   local run prints the remote command and exits 2 unless AG_CERT_ALLOW_LOCAL=1. Every browser-launching QUAL script
   imports scripts/qual/remote-guard.mjs; the certification Playwright config refuses to load locally. */
import { describe, expect, it } from '@jest/globals';
import { spawnSync } from 'node:child_process';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { REMOTE_EXIT, checkRemote, remoteAllowed, remoteCommand, remoteMessage } from '../../../scripts/qual/remote-guard.mjs';
import { REPO } from './helpers/laneFixture.ts';

/** A local shell: no CI, no remote-runner or local-debug flag. */
const LOCAL = { PATH: `${dirname(process.execPath)}:/usr/bin:/bin`, HOME: process.env.HOME };
const node = (args: string[], env: Record<string, string | undefined> = LOCAL) =>
  spawnSync(process.execPath, args, { cwd: REPO, env, encoding: 'utf8', timeout: 120_000 });

describe('remoteAllowed / checkRemote', () => {
  it.each([
    [{}, false], [{ CI: 'false' }, false], [{ AG_REMOTE_RUNNER: '0' }, false], [{ AG_CERT_ALLOW_LOCAL: 'yes' }, false],
    [{ CI: 'true' }, true], [{ AG_REMOTE_RUNNER: '1' }, true], [{ AG_CERT_ALLOW_LOCAL: '1' }, true],
  ])('%j → %s', (env, allowed) => {
    expect(remoteAllowed(env)).toBe(allowed);
    expect(checkRemote({ command: 'node x.mjs', env }) === null).toBe(allowed);
  });

  it('a refusal is exit 2 with the remote command', () => {
    expect(checkRemote({ command: 'node certification/run.mjs --lane L6 --scope pr', env: {} })).toEqual({
      code: 2, message: remoteMessage('node certification/run.mjs --lane L6 --scope pr', 'QUAL certification'),
    });
    expect(REMOTE_EXIT).toBe(2);
    expect(remoteMessage('node a.mjs')).toContain('Remote command: node a.mjs');
    expect(remoteMessage('node a.mjs')).toContain(remoteCommand('node a.mjs'));
    expect(remoteCommand('node a.mjs')).toBe('AG_REMOTE_RUNNER=1 node a.mjs');
  });
});

describe('cert scripts run locally without the env vars exit 2', () => {
  it('certification/run.mjs', () => {
    const r = node(['certification/run.mjs', '--lane', 'L6', '--scope', 'pr']);
    expect(r.status).toBe(2);
    expect(r.stderr).toContain('remote-only: certification/run.mjs launches browsers');
    expect(r.stderr).toContain('Remote command: node certification/run.mjs --lane L6 --scope pr');
  });

  it('playwright test -c certification/playwright.cert.config.ts (the config refuses to load)', () => {
    const r = node(['node_modules/@playwright/test/cli.js', 'test', '-c', 'certification/playwright.cert.config.ts', '--list']);
    expect(r.status).toBe(2);
    expect(r.stderr).toContain('remote-only: certification/playwright.cert.config.ts launches browsers');
    expect(r.stderr).toContain('Remote command: npx playwright test -c certification/playwright.cert.config.ts --list');
  });

  it('tests/perf/harness/run-perf.mjs (stricter: AG_REMOTE_RUNNER=1 only)', () => {
    for (const env of [LOCAL, { ...LOCAL, CI: 'true' }, { ...LOCAL, AG_CERT_ALLOW_LOCAL: '1' }]) {
      const r = node(['tests/perf/harness/run-perf.mjs', '--profile', 'c'], env);
      expect(r.status).toBe(2);
      expect(r.stderr).toContain('Remote command: AG_REMOTE_RUNNER=1 node tests/perf/harness/run-perf.mjs');
    }
  });

  it('AG_CERT_ALLOW_LOCAL=1 passes the guard (explicit local debugging)', () => {
    const r = node(['certification/run.mjs', '--lane', 'L99', '--scope', 'pr'], { ...LOCAL, AG_CERT_ALLOW_LOCAL: '1' });
    expect(r.status).toBe(64); // past the guard: the usage error is next
  });
});

describe('every browser-launching QUAL script imports the guard', () => {
  /** QUAL-owned code (PRD-F §6) that is not a spec/test; specs run only under the guarded configs. */
  const ROOTS = ['certification', 'scripts/qual', 'scripts/storybook', 'packages/qa/src', 'tests/perf/harness'];
  /** Launches a browser directly, or spawns the Playwright test runner. */
  const LAUNCH = /\b(chromium|firefox|webkit|browserType|bt)\.launch(Persistent(Context)?)?\(|playwrightCli|@playwright\/test\/cli/;
  const GUARD = /from ['"][./]+(?:scripts\/qual\/|\.\.\/)*remote-guard\.mjs['"]/;
  const files: string[] = [];
  const walk = (d: string) => {
    for (const n of readdirSync(join(REPO, d))) {
      const rel = `${d}/${n}`;
      if (/(^|\/)(node_modules|__fixtures__|fixtures|baselines)(\/|$)/.test(rel)) continue;
      if (statSync(join(REPO, rel)).isDirectory()) walk(rel);
      else if (/\.(ts|tsx|mjs|js|cjs)$/.test(n) && !/\.(spec|test|d)\.[cm]?[tj]sx?$/.test(n)) files.push(rel);
    }
  };
  for (const r of ROOTS) walk(r);
  const launching = files.filter((f) => LAUNCH.test(readFileSync(join(REPO, f), 'utf8')));

  it('finds the launchers (the scan is not vacuous)', () => {
    expect(launching).toEqual(expect.arrayContaining(['packages/qa/src/evidence/laneRunner.ts', 'tests/perf/harness/run-perf.mjs']));
  });

  it.each(['certification/playwright.cert.config.ts', ...launching])('%s imports scripts/qual/remote-guard.mjs', (f) => {
    const src = readFileSync(join(REPO, f), 'utf8');
    const m = src.match(GUARD);
    expect([f, m?.[0] ?? null]).toEqual([f, expect.stringContaining('remote-guard.mjs')]);
    // the import resolves to the one guard module
    const spec = m![0].replace(/^from ['"]|['"]$/g, '');
    expect(relative(REPO, join(REPO, dirname(f), spec))).toBe('scripts/qual/remote-guard.mjs');
  });
});
