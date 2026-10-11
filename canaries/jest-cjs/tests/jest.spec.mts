/* PLAT-293 (D-03 evidence): a CommonJS Jest 29 consumer (jsdom env) imports the
   ESM-only artifact with a dynamic import(). Jest needs Node's VM-modules API
   for that, so the consumer runs jest under --experimental-vm-modules (the
   canary's `npm test`); the run must pass with exactly the one canary test. */
import { test, expect } from '@playwright/test';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const DIR = fileURLToPath(new URL('..', import.meta.url));

test('jest-cjs consumer: dynamic import of aura-glass/material passes', () => {
  const r = spawnSync(process.execPath, ['--experimental-vm-modules', 'node_modules/jest/bin/jest.js', '--ci', '--json'], {
    cwd: DIR, encoding: 'utf8',
  });
  if (r.status !== 0) console.error(r.stderr);
  expect(r.status).toBe(0);
  const report = JSON.parse(r.stdout) as { success: boolean; numTotalTests: number; numPassedTests: number };
  expect(report.success).toBe(true);
  expect(report.numTotalTests).toBe(1);
  expect(report.numPassedTests).toBe(1);
});
