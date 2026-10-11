/* REQ-FIN-05 (MAT-54, FIN-A.3 #7): the checks verify-a11y-css gained for the
   a11y CSS shipping work — undefined --_ag-* refs, numeric / generated-floor
   var() fallbacks, fallback-less --ag-* refs that the token build does not
   emit — plus the expiring integration baseline it shares with the other
   cross-stream gates (PRD-F §4.3 rule 3). The per-rule fixtures of the older
   ten rules stay in tests/a11y/verify-a11y-css.test.ts (FIN-D). */
import { describe, expect, it } from '@jest/globals';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { atOrAfterRc1, rowProblems } from '../../scripts/integration/lib/baseline-expiry.mjs';

const REPO = resolve(__dirname, '../..');
const GATE = join(REPO, 'scripts/mat/verify-a11y-css.mjs');
const FIX = 'tests/integration/fixtures/a11y-css';

const run = (args: string[], env: Record<string, string> = {}) => {
  const e = { ...process.env, ...env };
  delete e.CI_COMMIT_TAG;
  if (!env.AG_RELEASE_VERSION) delete e.AG_RELEASE_VERSION;
  try {
    return { code: 0, out: execFileSync(process.execPath, [GATE, ...args], { cwd: REPO, env: e, encoding: 'utf8' }) };
  } catch (err: any) {
    return { code: err.status ?? 1, out: `${err.stdout ?? ''}${err.stderr ?? ''}` };
  }
};

describe('REQ-FIN-05 verify-a11y-css additions', () => {
  it.each([
    ['no-undefined-ag-var', 'var(--_ag-fixture-never-produced) has no producer'],
    ['no-numeric-floor-fallback', 'numeric var() fallback for --_ag-tint-floor*'],
    ['no-undefined-ag-token', 'var(--ag-z-fixture-not-a-token) has no fallback and is not emitted by the token build'],
  ])('%s: fail.css flagged with its message, pass.css silent', (rule, message) => {
    const fail = run(['--src', `${FIX}/${rule}/fail.css`, '--all-enforced']);
    expect(fail.code).toBe(1);
    expect(fail.out).toContain(`verify-a11y-css/${rule}`);
    expect(fail.out).toContain(message);
    const pass = run(['--src', `${FIX}/${rule}/pass.css`, '--all-enforced']);
    expect(pass.out).not.toContain(`verify-a11y-css/${rule}`);
    expect(pass.code).toBe(0);
  });

  it('a generated floor read with any fallback is rejected (rungs read the compiler output bare)', () => {
    const r = run(['--src', `${FIX}/no-numeric-floor-fallback/fail.css`, '--all-enforced']);
    expect(r.out).toContain('var(--_ag-fallback-fill, …) — the compiler emits --_ag-fallback-fill; read it without a fallback');
  });

  it.each(['layers.css', 'targets.css', 'scroll-padding.css'])(
    'src/a11y/css/%s is clean on its own (no baseline row)',
    (file) => {
      const r = run(['--src', `src/a11y/css/${file}`, '--all-enforced']);
      expect(r.out).toContain('0 violation(s)');
      expect(r.code).toBe(0);
    },
  );

  it('layers.css stacks the three layer roots on token-build --ag-z-* vars', () => {
    const css = readFileSync(join(REPO, 'src/a11y/css/layers.css'), 'utf8');
    const manifest = readFileSync(join(REPO, 'src/tokens/generated/manifest.ts'), 'utf8');
    for (const root of ['overlay', 'transient', 'toast']) {
      expect(css).toContain(`[data-ag-layer-root="${root}"]`);
      expect(css).toContain(`z-index: var(--ag-z-${root});`);
      expect(manifest).toContain(`"cssVar": "--ag-z-${root}"`);
    }
  });

  it('the repo run passes with the expiring baseline before RC-1', () => {
    const r = run([], { AG_RELEASE_VERSION: '5.0.0-alpha.0' });
    expect(r.out).not.toMatch(/^FAIL /m);
    expect(r.code).toBe(0);
  });

  it('the same repo run fails once RC-1 is being built (every RC-1 row expires)', () => {
    const r = run([], { AG_RELEASE_VERSION: '5.0.0-rc.1' });
    expect(r.out).toContain('FAIL verify-a11y-css: expired baseline row src/a11y/css/rungs.css (expires RC-1, building 5.0.0-rc.1)');
    expect(r.code).toBe(1);
  });
});

describe('expiring baseline rows (scripts/integration/lib/baseline-expiry.mjs)', () => {
  it.each([
    ['5.0.0-alpha.0', false], ['5.0.0-beta.9', false], ['5.0.0-rc.0', false], ['4.3.0', false],
    ['5.0.0-rc.1', true], ['5.0.0-rc.2', true], ['5.0.0', true], ['5.1.0-alpha.0', true], ['v5.0.0-rc.1', true],
  ])('atOrAfterRc1(%s) = %s', (v, want) => {
    expect(atOrAfterRc1(v)).toBe(want);
  });

  const row = { file: 'src/x.css', owner: 'CMP', reqFin: 'REQ-FIN-70' };
  it('accepts a live RC-1 row and a future ISO date', () => {
    expect(rowProblems([{ ...row, expires: 'RC-1' }, { ...row, expires: '2999-01-01' }], { gate: 'g', version: '5.0.0-alpha.0' })).toEqual([]);
  });
  it('rejects past ISO dates, unknown expiries and malformed rows', () => {
    const out = rowProblems([
      { ...row, expires: '2020-01-01' },
      { ...row, expires: 'someday' },
      { file: 'src/y.css', owner: 'CMP', expires: 'RC-1' },
    ], { gate: 'g', today: new Date('2026-10-10T00:00:00Z'), version: '5.0.0-alpha.0' });
    expect(out).toEqual([
      'g: expired baseline row src/x.css (expires 2020-01-01) — REQ-FIN-70 (CMP) must fix the file',
      "g: baseline row src/x.css has expires 'someday' — use 'RC-1' or YYYY-MM-DD",
      "g: malformed baseline row src/y.css — needs {file, owner, reqFin: 'REQ-FIN-…', expires}",
    ]);
  });
});
