// tests/labs/admission.test.ts — REQ-SURF-167 (AC-SURF-28).
// Each negative fixture exits 1 naming its rule; the real package exits 0.
import { describe, expect, it } from '@jest/globals';
import { spawnSync } from 'node:child_process';
import { join } from 'node:path';

const ROOT = join(__dirname, '../..');
const SCRIPT = join(ROOT, 'scripts/surf/verify-labs-admission.mjs');
const FX = join(ROOT, 'tests/labs/fixtures');

const run = (args: string[]) =>
  spawnSync(process.execPath, [SCRIPT, ...args], { encoding: 'utf8', cwd: ROOT });

const cases: Array<[string, string]> = [
  ['math-random', 'no-simulation'],
  ['deep-import', 'deep-import'],
  ['side-effect', 'side-effect'],
  ['no-pause', 'no-pause'],
];

describe('labs admission gate', () => {
  for (const [fixture, rule] of cases) {
    it(`fixture ${fixture} exits 1 naming ${rule}`, () => {
      const r = run(['--root', join(FX, fixture)]);
      expect(r.status).toBe(1);
      expect(`${r.stdout}${r.stderr}`).toContain(rule);
    });
  }
  it('the real package exits 0', () => {
    const r = run([]);
    expect(r.status).toBe(0);
  });
});
