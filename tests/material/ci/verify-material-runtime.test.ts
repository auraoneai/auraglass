/* @jest-environment node */
/* MAT-152 test: fixtures material-runtime/forbidden|allowed — the gate must flag
   auto-downgrade machinery (IntersectionObserver, rAF, data-ag-tier writes) and
   cinematic escapes; MutationObserver inside useMaterialTier.ts is the one
   permitted observer. */
import { describe, expect, it } from '@jest/globals';
import { execFileSync } from 'node:child_process';
import { join } from 'node:path';

const SCRIPT = join(__dirname, '../../../scripts/mat/verify-material-runtime.mjs');
const FIX = join(__dirname, 'fixtures/material-runtime');

const run = (root: string) => {
  try {
    const out = execFileSync(process.execPath, [SCRIPT, '--root', join(FIX, root)], { encoding: 'utf8' });
    return { code: 0, out, err: '' };
  } catch (e) {
    const err = e as { status?: number; stdout?: string; stderr?: string };
    return { code: err.status ?? 1, out: err.stdout ?? '', err: err.stderr ?? '' };
  }
};

describe('verify-material-runtime', () => {
  it('fails on auto-downgrade machinery inside src/material/**', () => {
    const r = run('forbidden');
    expect(r.code).toBe(1);
    expect(r.out).toMatch(/IntersectionObserver/);
    expect(r.out).toMatch(/requestAnimationFrame/);
    expect(r.out).toMatch(/data-ag-tier write/);
    expect(r.err).toMatch(/forbidden runtime pattern/);
  });

  it('passes when the only observer is useMaterialTier.ts', () => {
    const r = run('allowed');
    expect(r.code).toBe(0);
    expect(r.out).toMatch(/OK/);
  });
});
