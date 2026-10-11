/* @jest-environment node */
/* REQ-MAT-51 / REQ-FIN-58 (D.3-31): motion lint at error.
   1. motion-raf-via-ticker guards src/{components,primitives,app-shell,data,ai,
      media,backdrops,date}/** (RuleTester) and stays silent in src/motion/**.
   2. Its agConfig resolves to 'error' in every guarded dir and 'warn' only for
      the ratcheted files in lint/rules/mat/motion-baseline.json.
   3. scripts/mat/motion-lint-l1.mjs (L1 cell): new violation → 1, ratchet row →
      0, stale/lowered rows → 1, --enforce-zero with rows → 1, repo tree → 0. */
import { describe, expect, it } from '@jest/globals';
import { RuleTester } from 'eslint';
import tsParser from '@typescript-eslint/parser';
import { execFileSync } from 'node:child_process';
import { join } from 'node:path';

const ROOT = join(__dirname, '../../..');
const SCRIPT = join(ROOT, 'scripts/mat/motion-lint-l1.mjs');
const FIX = join(ROOT, 'tests/material/ci/fixtures/motion-lint');
const rafRule = require(join(ROOT, 'lint/rules/mat/motion-raf-via-ticker.cjs')) as {
  meta: unknown; create: unknown; agConfig: Array<{ files: string[]; ignores?: string[]; severity: string }>;
};
const baseline = require(join(ROOT, 'lint/rules/mat/motion-baseline.json')) as { rows: Array<{ file: string; rule: string }> };

const GUARDED = ['components', 'primitives', 'app-shell', 'data', 'ai', 'media', 'backdrops', 'date'];
const tester = new RuleTester({
  languageOptions: { parser: tsParser, ecmaVersion: 2023, sourceType: 'module', parserOptions: { ecmaFeatures: { jsx: true } } },
});

describe('motion-raf-via-ticker guarded dirs (REQ-MAT-51)', () => {
  tester.run('motion-raf-via-ticker', rafRule as never, {
    valid: [
      { code: `requestAnimationFrame(() => {});`, filename: 'src/motion/ticker.ts' },
      { code: `setInterval(() => {}, 16);`, filename: 'src/theme/preferences/store.ts' },
      { code: `subscribeFrame(() => {});`, filename: 'src/ai/thread/x.ts' },
    ],
    invalid: GUARDED.flatMap((d) => [
      { code: `requestAnimationFrame(() => {});`, filename: `src/${d}/x.tsx`, errors: [{ messageId: 'raf' }] },
      { code: `const t = setInterval(() => {}, 1000);`, filename: `src/${d}/nested/y.ts`, errors: [{ messageId: 'raf' }] },
    ]),
  } as never);
});

describe('motion-raf-via-ticker severity through eslint.config.js', () => {
  // eslint.config.js is ESM: resolve it in a child eslint process (jest's VM
  // cannot dynamic-import it) with --print-config.
  const ESLINT_BIN = join(ROOT, 'node_modules/eslint/bin/eslint.js');
  const severity = async (file: string) => {
    const out = execFileSync(process.execPath, [ESLINT_BIN, '--print-config', file], { cwd: ROOT, encoding: 'utf8' });
    const cfg = JSON.parse(out) as { rules?: Record<string, unknown> };
    const v = cfg.rules?.['auraglass/motion-raf-via-ticker'];
    return Array.isArray(v) ? v[0] : v;
  };
  const ratcheted = baseline.rows.filter((r) => r.rule === 'motion-raf-via-ticker').map((r) => r.file);

  it.each(GUARDED)('src/%s/** is error', async (d) => {
    expect(await severity(`src/${d}/__probe__/probe.tsx`)).toBe(2);
  });

  it('ratcheted files stay warn until their owner removes the loop', async () => {
    expect(ratcheted.length).toBeGreaterThan(0);
    for (const f of ratcheted) expect(await severity(f)).toBe(1);
  });

  it('outside the guarded dirs the rule is warn (setter-in-frame check only)', async () => {
    expect(await severity('src/motion/ticker.ts')).toBe(1);
  });
});

const run = (args: string[]) => {
  try {
    const out = execFileSync(process.execPath, [SCRIPT, ...args], { encoding: 'utf8', stdio: 'pipe' });
    return { code: 0, out, err: '' };
  } catch (e) {
    const err = e as { status?: number; stdout?: string; stderr?: string };
    return { code: err.status ?? 1, out: err.stdout ?? '', err: err.stderr ?? '' };
  }
};
const EMPTY = join(ROOT, 'tests/material/ci/fixtures/preference-source/empty-baseline.json');

describe('scripts/mat/motion-lint-l1.mjs', () => {
  it('a new loop in a guarded dir fails', () => {
    const r = run(['--root', join(FIX, 'violating'), '--baseline', EMPTY]);
    expect(r.code).toBe(1);
    expect(r.err).toMatch(/new violation: src\/date\/clock\.ts:4:\d+ auraglass\/motion-raf-via-ticker/);
  });

  it('src/motion owns the ticker: clean fixture passes', () => {
    const r = run(['--root', join(FIX, 'clean'), '--baseline', EMPTY]);
    expect(r.err).toBe('');
    expect(r.code).toBe(0);
    expect(r.out).toMatch(/\[motion-lint\] OK — \d+ rules at error over 1 files/);
  });

  it('a ratchet row covers an existing finding', () => {
    const r = run(['--root', join(FIX, 'ratchet'), '--baseline', join(FIX, 'ratchet/baseline-ok.json')]);
    expect(r.code).toBe(0);
    expect(r.out).toMatch(/1 ratcheted finding\(s\) in 1 baseline row\(s\), 0 new/);
  });

  it('stale and over-counted rows fail (the baseline only shrinks)', () => {
    const r = run(['--root', join(FIX, 'ratchet'), '--baseline', join(FIX, 'ratchet/baseline-stale.json')]);
    expect(r.code).toBe(1);
    expect(r.err).toMatch(/ratchet down: src\/ai\/scroll\.ts auraglass\/motion-raf-via-ticker has 1 < baseline 2/);
    expect(r.err).toMatch(/stale baseline row: src\/ai\/gone\.ts auraglass\/motion-raf-via-ticker has 0 findings/);
  });

  it('--enforce-zero fails while any row remains', () => {
    const r = run(['--root', join(FIX, 'ratchet'), '--baseline', join(FIX, 'ratchet/baseline-ok.json'), '--enforce-zero']);
    expect(r.code).toBe(1);
    expect(r.err).toMatch(/--enforce-zero: 1 baseline row\(s\) remain/);
  });

  it('the repository src/ passes against lint/rules/mat/motion-baseline.json', () => {
    const r = run([]);
    expect(r.err).toBe('');
    expect(r.code).toBe(0);
  });
});
