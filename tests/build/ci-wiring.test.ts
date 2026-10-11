/* @jest-environment node */
/* PLAT-285/286: the successor gates are wired and the deleted scripts are gone. */
import { describe, expect, it } from '@jest/globals';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { ROOT } from './helpers';

describe('ci wiring (PLAT-285/286)', () => {
  it('deleted gates are gone', () => {
    for (const p of ['scripts/ci/verify-tree-shaking.js', 'scripts/ci/verify-no-core-ui-deps.js',
      'scripts/ci/check-undefined-custom-props.mjs', '.bundlesizerc', 'rollup.config.js',
      'scripts/build-all.js', 'scripts/postbuild-client.js', 'scripts/build-workers.js']) {
      expect(existsSync(join(ROOT, p))).toBe(false);
    }
  });

  it('successor gates exist and are referenced by package.json scripts', () => {
    const pkg = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8'));
    expect(existsSync(join(ROOT, 'scripts/ci/verify-size-budgets.mjs'))).toBe(true);
    expect(existsSync(join(ROOT, 'scripts/ci/verify-deps.mjs'))).toBe(true);
    expect(existsSync(join(ROOT, 'scripts/ci/verify-pack.js'))).toBe(true);
    expect(pkg.scripts['pack:verify']).toContain('verify-pack');
    expect(pkg.scripts['artifact:size-budgets']).toBe('node scripts/ci/verify-size-budgets.mjs');
    expect(pkg.scripts['artifact:deps']).toBe('node scripts/ci/verify-deps.mjs');
  });
});
