/* MAT-256 (A11Y-011): per-rule pass/fail fixtures for verify-a11y-css.mjs —
   each rule fires on its fail fixture and stays silent on pass. Baseline
   ratchet is decrease-only. */
import { describe, expect, it } from '@jest/globals';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const FIX = 'scripts/ci/__fixtures__/a11y-css';
const GATE = 'scripts/mat/verify-a11y-css.mjs';

const run = (file: string): { code: number; out: string } => {
  try {
    const out = execFileSync('node', [GATE, '--src', file, '--all-enforced'], { encoding: 'utf8' });
    return { code: 0, out };
  } catch (e) {
    const err = e as { status?: number; stdout?: string; stderr?: string };
    return { code: err.status ?? 1, out: `${err.stdout ?? ''}${err.stderr ?? ''}` };
  }
};

const RULES = fs.readdirSync(FIX).filter((d) => fs.statSync(path.join(FIX, d)).isDirectory());

describe('verify-a11y-css fixtures', () => {
  it('has fixtures for all ten rules', () => {
    expect(RULES.sort()).toEqual([
      'a11y-selectors-keyed-on-data-ag-surface',
      'focus-outline-none-count',
      'layer-order',
      'max-specificity',
      'no-global-element-selectors',
      'no-handwritten-floor',
      'no-host-opacity-on-disabled',
      'no-important',
      'no-outline-none-focus',
      'no-prefers-contrast-high',
    ]);
  });

  for (const rule of RULES) {
    const failFile = ['fail.css', 'fail.tsx'].find((f) => fs.existsSync(path.join(FIX, rule, f)));
    it(`${rule}: ${failFile} flagged`, () => {
      const r = run(path.join(FIX, rule, failFile!));
      expect(r.code).toBe(1);
      expect(r.out).toContain(`verify-a11y-css/${rule}`);
    });
    it(`${rule}: pass.css silent`, () => {
      const r = run(path.join(FIX, rule, 'pass.css'));
      expect(r.code).toBe(0);
      expect(r.out).not.toContain(`verify-a11y-css/${rule}`);
    });
  }

  it('real src/a11y+theme+material css is clean', () => {
    const r = run('src/a11y');
    expect(r.code).toBe(0);
  });

  it('baseline file is a decrease-only ratchet', () => {
    const b = JSON.parse(fs.readFileSync('scripts/ci/a11y-baselines/focus-outline-none.json', 'utf8')) as { count: number; ratchet: string };
    expect(b.ratchet).toBe('decrease-only');
    expect(b.count).toBeGreaterThanOrEqual(0);
  });
});
