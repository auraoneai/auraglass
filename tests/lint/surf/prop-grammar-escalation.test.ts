/** @jest-environment node */
// tests/lint/surf/prop-grammar-escalation.test.ts — REQ-SURF-11 / REQ-FIN-80.
// lint/rules/surf/_strict.cjs escalates CMP's auraglass/prop-grammar to error
// over every SURF-owned glob, but only once lint/rules/cmp/prop-grammar.cjs
// exists (an unshipped rule name crashes the plugin loader repo-wide).
import { afterEach, describe, expect, it, jest } from '@jest/globals';
import { existsSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = join(__dirname, '../../..');
const STRICT = join(ROOT, 'lint/rules/surf/_strict.cjs');
const RULE = join(ROOT, 'lint/rules/cmp/prop-grammar.cjs');

type Strict = { strict: Record<string, string[]> };

function loadStrict(ruleShipped: boolean | null): Strict {
  let mod: Strict | undefined;
  jest.isolateModules(() => {
    const fs = require('node:fs') as typeof import('node:fs');
    if (ruleShipped !== null) {
      const real = fs.existsSync;
      jest.spyOn(fs, 'existsSync').mockImplementation((p) => (String(p) === RULE ? ruleShipped : real(p)));
    }
    mod = require(STRICT) as Strict;
  });
  return mod!;
}

afterEach(() => {
  jest.restoreAllMocks();
});

describe('_strict.cjs prop-grammar escalation (REQ-SURF-11)', () => {
  it('withholds prop-grammar while the CMP rule module is absent', () => {
    const { strict } = loadStrict(false);
    expect(Object.keys(strict)).not.toContain('prop-grammar');
    // the other W5 escalation is unaffected
    expect(strict['no-simulation']!.length).toBeGreaterThan(0);
  });

  it('escalates prop-grammar over exactly the SURF-owned globs once the rule ships', () => {
    const { strict } = loadStrict(true);
    expect(strict['prop-grammar']).toEqual([
      'src/app-shell/**',
      'src/data/**',
      'src/date/**',
      'src/ai/**',
      'src/media/**',
      'src/backdrops/**',
      'src/charts/**',
      'src/three/**',
      'registry/blocks/**',
      'registry/items/**',
      'packages/labs/src/**',
    ]);
    // same set no-simulation runs at error (SURF_OWNED)
    expect(strict['prop-grammar']).toEqual(strict['no-simulation']);
  });

  it('the on-disk state matches the rule module presence', () => {
    const { strict } = loadStrict(null);
    expect('prop-grammar' in strict).toBe(existsSync(RULE));
  });
});
