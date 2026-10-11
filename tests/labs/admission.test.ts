// tests/labs/admission.test.ts — REQ-SURF-167 (AC-SURF-28), REQ-SURF-168 rejection rule.
// Each negative fixture exits 1 naming its rule; the clean fixture and the real
// package exit 0.
import { describe, expect, it } from '@jest/globals';
import { spawnSync } from 'node:child_process';
import { existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = join(__dirname, '../..');
const SCRIPT = join(ROOT, 'scripts/surf/verify-labs-admission.mjs');
const FX = join(ROOT, 'tests/labs/fixtures');
const SCRATCH = join(ROOT, '.artifacts/surf/labs-admission');

const run = (args: string[]) =>
  spawnSync(process.execPath, [SCRIPT, ...args], { encoding: 'utf8', cwd: ROOT });

const cases: Array<[string, string]> = [
  ['math-random', 'no-simulation'],
  ['deep-import', 'deep-import'],
  ['side-effect', 'side-effect'],
  ['side-effect-var', 'side-effect'],
  ['side-effect-runtime', 'side-effect'],
  ['no-pause', 'no-pause'],
  ['rejected-spatial', 'rejected-spatial'],
];

describe('labs admission gate', () => {
  for (const [fixture, rule] of cases) {
    it(`fixture ${fixture} exits 1 naming ${rule}`, () => {
      const r = run(['--root', join(FX, fixture)]);
      expect(r.status).toBe(1);
      expect(`${r.stdout}${r.stderr}`).toContain(`: ${rule} `);
    });
  }

  it('rule (d) flags a module-scope variable initializer that reads document (static AST)', () => {
    const r = run(['--root', join(FX, 'side-effect-var')]);
    expect(r.stderr).toMatch(/body-ref: side-effect tests\/labs\/fixtures\/side-effect-var\/src\/body-ref\/index\.ts: module-scope document access/);
  });

  it('rule (d) imports the entry in Node with document undefined and fails on the throw', () => {
    const r = run(['--root', join(FX, 'side-effect-var')]);
    expect(r.stderr).toMatch(/body-ref: side-effect importing the entry in Node threw: TypeError/);
  });

  it('rule (d) catches an import-time timer that no module-scope statement names', () => {
    const r = run(['--root', join(FX, 'side-effect-runtime')]);
    const out = `${r.stdout}${r.stderr}`;
    expect(out).toContain('booter: side-effect importing the entry in Node registered setTimeout');
    // The static pass sees only `boot()`; the runtime import is what fails it.
    expect(out).not.toMatch(/booter: side-effect tests\//);
  });

  it('a clean resident (react + local import, DOM only inside a function) exits 0', () => {
    const r = run(['--root', join(FX, 'clean')]);
    expect(`${r.stdout}${r.stderr}`).toContain('labs admission: 1 resident(s) ok');
    expect(r.status).toBe(0);
  });

  it('the real package exits 0', () => {
    const r = run(['--manifest', 'build/exports.manifest.json']);
    expect(r.status).toBe(0);
  });

  it('a --manifest that does not exist is an error, not a skip', () => {
    const r = run(['--manifest', 'build/does-not-exist.json']);
    expect(r.status).toBe(1);
    expect(r.stderr).toContain('does not exist');
  });

  it('leaves no transpile scratch dirs behind', () => {
    run(['--root', join(FX, 'clean')]);
    const left = existsSync(SCRATCH) ? readdirSync(SCRATCH) : [];
    expect(left).toEqual([]);
  });
});
