/** @jest-environment node */
import { describe, test, expect } from '@jest/globals';
// MAT-053 / REQ-MAT-17: gate tests — undefined-vars and tier-skip exit 0 on the
// real build and dead-vars attributes every finding to its owning stream (exit 1
// exactly when a MAT finding exists); each fixture dir under
// tests/tokens/fixtures/gates exits with the expected code and message; total gate
// runtime <= 30 s. The real-build "0 MAT dead vars" acceptance is the L1 lane
// (scripts/mat/token-gates-l1.mjs in mat:test:token-gates).
import { execFileSync } from 'node:child_process';
import { join } from 'node:path';
import { ROOT } from '../../scripts/tokens/validate.mjs';

const GATES = join(ROOT, 'scripts/tokens/gates');
const F = join(ROOT, 'tests/tokens/fixtures/gates');

const run = (script: string, args: string[]): { code: number; out: string } => {
  try {
    const out = execFileSync('node', [join(GATES, script), ...args], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
    return { code: 0, out };
  } catch (e: any) {
    return { code: e.status ?? 1, out: `${e.stdout ?? ''}${e.stderr ?? ''}` };
  }
};

describe('gates (MAT-053)', () => {
  test('real build: undefined-vars and tier-skip exit 0, dead-vars attributes every finding, within 30 s total', () => {
    const t0 = Date.now();
    const u = run('undefined-vars.mjs', []);
    const d = run('dead-vars.mjs', []);
    const t = run('tier-skip.mjs', []);
    const elapsed = Date.now() - t0;
    console.log(`gate runtimes total: ${elapsed}ms`);
    console.log([u.out, d.out, t.out].join(''));
    expect(elapsed).toBeLessThanOrEqual(30_000);
    expect({ u: u.code, t: t.code }).toEqual({ u: 0, t: 0 });
    // undefined-vars resolves the MAT fragment bundles, not only the dist token entries
    expect(u.out).toMatch(/0 MAT findings .* MAT bundles \(material\.css, styles\.css\)/);
    // every dead-vars line is a finding tagged MAT / pre-existing (<stream>), or the summary
    const lines = d.out.split('\n').filter(Boolean);
    const untagged = lines.filter(
      (l) => !/^dead-vars: (MAT |pre-existing \((plat|cmp|surf|qual|contract)\) |\d+ MAT dead var finding|0 MAT dead vars )/.test(l),
    );
    expect(untagged).toEqual([]);
    const matLines = lines.filter((l) => l.startsWith('dead-vars: MAT ')).length;
    const summary = /dead-vars: (\d+) MAT dead var finding|dead-vars: (0) MAT dead vars /.exec(d.out);
    expect(summary).not.toBeNull();
    expect(Number(summary![1] ?? summary![2])).toBe(matLines);
    // the gate's exit contract: 1 exactly when MAT findings exist
    expect(d.code).toBe(matLines > 0 ? 1 : 0);
  }, 40_000);

  test('fixture: MAT bundle closure — sibling rows and dist/tokens.css define; other bundles and `initial` reservations do not', () => {
    const r = run('undefined-vars.mjs', [
      '--dist', join(F, 'bundle-mat/emitted'),
      '--tokens-css', join(F, 'bundle-mat/emitted/tokens.css'),
      '--src', join(F, 'bundle-mat/src'),
      '--manifest', join(F, 'dead-var/manifest.json'),
      '--fragments', join(F, 'bundle-mat'),
    ]);
    expect(r.code).toBe(1);
    expect(r.out).toContain('undefined-vars: MAT bundle:material.css --_ag-card-only at src/material/css/surface.css:6');
    expect(r.out).toContain('undefined-vars: MAT bundle:material.css --_ag-reserved-only at src/material/css/surface.css:7');
    expect(r.out).not.toContain('--_ag-recipe-fill');
    expect(r.out).not.toContain('--ag-color-fixture');
  });

  test("fixture: another stream's row in a MAT bundle is reported pre-existing and does not fail", () => {
    const r = run('undefined-vars.mjs', [
      '--dist', join(F, 'bundle-foreign/emitted'),
      '--tokens-css', join(F, 'bundle-foreign/emitted/tokens.css'),
      '--src', join(F, 'bundle-foreign/src'),
      '--manifest', join(F, 'dead-var/manifest.json'),
      '--fragments', join(F, 'bundle-foreign'),
    ]);
    expect(r.code).toBe(0);
    expect(r.out).toContain(
      'undefined-vars: pre-existing (cmp) bundle:material.css --_ag-cmp-undeclared-fixture at src/components/card/card.css:1',
    );
    expect(r.out).toContain('0 MAT findings (1 pre-existing in other streams)');
  });

  test('fixture: dead privates — generated files, self-reference, dead chains and @property channels get no exemption', () => {
    const r = run('dead-vars.mjs', ['--root', join(F, 'dead-privates'), '--dist', join(F, 'dead-privates/emitted'), '--manifest', join(F, 'dead-privates/emitted/manifest.json')]);
    expect(r.code).toBe(1);
    const mat = r.out
      .split('\n')
      .filter((l) => l.startsWith('dead-vars: MAT private '))
      .map((l) => l.split(' ')[3])
      .sort();
    expect(mat).toEqual(['--_ag-chain-a', '--_ag-chain-b', '--_ag-channel-fixture', '--_ag-gen-dead', '--_ag-self-fixture']);
    expect(r.out).toContain('dead-vars: pre-existing (cmp) private --_ag-cmp-dead-fixture declared at src/components/card/card.css');
    // live: read by a normal property / through a public custom property; `initial` declares nothing
    expect(r.out).not.toMatch(/--_ag-gen-live|--_ag-via-public|--_ag-reserved-fixture/);
  });

  test("fixture: only another stream's dead private — pre-existing, exit 0", () => {
    const r = run('dead-vars.mjs', ['--root', join(F, 'dead-foreign'), '--dist', join(F, 'dead-foreign/emitted'), '--manifest', join(F, 'dead-foreign/emitted/manifest.json')]);
    expect(r.code).toBe(0);
    expect(r.out).toContain(
      'dead-vars: pre-existing (cmp) private --_ag-cmp-dead-fixture declared at src/components/card/card.css has 0 var() readers',
    );
    expect(r.out).toContain('0 MAT dead vars (1 pre-existing in other streams');
  });

  test('fixture: undefined-var exits 1 naming the var', () => {
    const r = run('undefined-vars.mjs', [
      '--dist', join(F, 'undefined-var'),
      '--src', join(F, 'undefined-var/css'),
      '--manifest', join(F, 'dead-var/manifest.json'),
    ]);
    expect(r.code).toBe(1);
    expect(r.out).toContain('--ag-color-does-not-exist');
  });

  test('fixture: dead-var exits 1 naming the var', () => {
    const r = run('dead-vars.mjs', [
      '--dist', join(F, 'dead-var/dist'),
      '--src', join(F, 'dead-var/src'),
      '--manifest', join(F, 'dead-var/manifest.json'),
    ]);
    expect(r.code).toBe(1);
    expect(r.out).toContain('--ag-dead-fixture');
  });

  test('fixture: ref-in-src exits 1 (tier-skip)', () => {
    const r = run('tier-skip.mjs', [
      '--src', join(F, 'ref-in-src'),
      '--tokens', join(ROOT, 'tokens'),
    ]);
    expect(r.code).toBe(1);
    expect(r.out).toMatch(/_ag-ref|ref\.color|tier/i);
  });

  test('fixture: unmanifested-tsx exits 1 (undefined-vars src scan)', () => {
    const r = run('undefined-vars.mjs', [
      '--dist', join(F, 'dead-var/dist'),
      '--src', join(F, 'unmanifested-tsx'),
      '--manifest', join(F, 'dead-var/manifest.json'),
    ]);
    expect(r.code).toBe(1);
    expect(r.out).toContain('--ag-color-not-in-manifest');
  });
});
