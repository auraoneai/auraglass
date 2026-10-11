/* @jest-environment node */
/* REQ-MAT-51 / REQ-FIN-58 (D.3-31): scripts/mat/verify-preference-source.mjs.
   Fixtures under tests/material/ci/fixtures/preference-source/:
   violating → exit 1 with every matchMedia/import finding listed;
   clean (allowed dirs + non-preference queries) → exit 0;
   ratchet → baseline rows pass, stale/lowered rows and --enforce-zero fail;
   the repository tree passes against its own ratchet baseline. */
import { describe, expect, it } from '@jest/globals';
import { execFileSync } from 'node:child_process';
import { join } from 'node:path';

const ROOT = join(__dirname, '../../..');
const SCRIPT = join(ROOT, 'scripts/mat/verify-preference-source.mjs');
const FIX = join(__dirname, 'fixtures/preference-source');
const EMPTY = join(FIX, 'empty-baseline.json');

const run = (args: string[]) => {
  try {
    const out = execFileSync(process.execPath, [SCRIPT, ...args], { encoding: 'utf8', stdio: 'pipe' });
    return { code: 0, out, err: '' };
  } catch (e) {
    const err = e as { status?: number; stdout?: string; stderr?: string };
    return { code: err.status ?? 1, out: err.stdout ?? '', err: err.stderr ?? '' };
  }
};

describe('verify-preference-source', () => {
  it('fails on the violating fixture and names every finding', () => {
    const r = run(['--root', join(FIX, 'violating'), '--baseline', EMPTY]);
    expect(r.code).toBe(1);
    const lines = r.err.split('\n').filter((l) => l.includes('outside src/theme/{preferences,script}/**'));
    expect(lines).toHaveLength(9);
    // matchMedia: literal, optional-call template, same-file const, element access + concatenation
    expect(r.err).toMatch(/src\/data\/Chart\.tsx:10 matchMedia matchMedia\("\(prefers-reduced-motion: reduce\)"\)/);
    expect(r.err).toMatch(/src\/data\/Chart\.tsx:11 matchMedia matchMedia\("\(forced-colors: active\)"\)/);
    expect(r.err).toMatch(/src\/data\/Chart\.tsx:12 matchMedia matchMedia\("\(prefers-contrast: more\)"\)/);
    expect(r.err).toMatch(/src\/data\/Chart\.tsx:13 matchMedia matchMedia\("\(prefers-reduced-transparency: reduce\)"\)/);
    // 4.x hooks: by name and by module path (re-export, dynamic import, require)
    expect(r.err).toMatch(/src\/data\/Chart\.tsx:4 import 4\.x reduced-motion hook 'useReducedMotion'/);
    expect(r.err).toMatch(/src\/components\/legacy\.ts:3 import 4\.x reduced-motion hook 'MotionPreferenceContext'/);
    expect(r.err).toMatch(/src\/components\/legacy\.ts:4 import 4\.x reduced-motion module '\.\.\/primitives\/motion\/ReducedMotionProvider'/);
    expect(r.err).toMatch(/src\/components\/legacy\.ts:6 import 4\.x reduced-motion module '\.\.\/hooks\/useEnhancedReducedMotion'/);
    expect(r.err).toMatch(/src\/components\/legacy\.ts:8 import 4\.x reduced-motion module '\.\.\/hooks\/useMotionPreference'/);
    // the allowed preference source in the same tree is never reported
    expect(r.err).not.toMatch(/src\/theme\/preferences\/media\.ts/);
  });

  it('passes on the clean fixture (allowed dirs, non-preference queries, 5.x hook)', () => {
    const r = run(['--root', join(FIX, 'clean'), '--baseline', EMPTY]);
    expect(r.err).toBe('');
    expect(r.code).toBe(0);
    expect(r.out).toMatch(/\[verify-preference-source\] OK — 1 files outside src\/theme\/\{preferences,script\}; 0 ratcheted/);
  });

  it('a ratchet row covers an existing finding', () => {
    const r = run(['--root', join(FIX, 'ratchet'), '--baseline', join(FIX, 'ratchet/baseline-ok.json')]);
    expect(r.code).toBe(0);
    expect(r.out).toMatch(/1 ratcheted finding\(s\) in 1 baseline row\(s\), 0 new/);
  });

  it('the same finding without a row fails', () => {
    const r = run(['--root', join(FIX, 'ratchet'), '--baseline', EMPTY]);
    expect(r.code).toBe(1);
    expect(r.err).toMatch(/src\/data\/legacy\.ts:3 matchMedia/);
  });

  it('a stale row fails (the baseline only shrinks)', () => {
    const r = run(['--root', join(FIX, 'ratchet'), '--baseline', join(FIX, 'ratchet/baseline-stale.json')]);
    expect(r.code).toBe(1);
    expect(r.err).toMatch(/stale baseline row: src\/data\/removed\.ts \(matchMedia\) has 0 findings/);
  });

  it('--enforce-zero fails while any row remains', () => {
    const r = run(['--root', join(FIX, 'ratchet'), '--baseline', join(FIX, 'ratchet/baseline-ok.json'), '--enforce-zero']);
    expect(r.code).toBe(1);
    expect(r.err).toMatch(/--enforce-zero: 1 baseline row\(s\) remain/);
  });

  it('the repository src/ passes against scripts/mat/preference-source-baseline.json', () => {
    const r = run([]);
    expect(r.err).toBe('');
    expect(r.code).toBe(0);
  });
});
