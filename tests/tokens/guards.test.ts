/** @jest-environment node */
// MAT-008: guard fixtures exit 1 naming the failing token path.
import { execFileSync } from 'node:child_process';
import { join } from 'node:path';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';

const ROOT = join(__dirname, '..', '..');
const CASES: Array<[string, RegExp]> = [
  ['unresolved-alias', /unresolved alias \{missing\.token\} referenced from sys\.bad/],
  ['cycle', /alias cycle.*sys\.a/],
  ['material-to-ref', /material\.leak.*tier 'ref'/],
  ['preset-material', /preset\.bad.*material\.\*/],
  ['preset-private-var', /preset\.bad.*--_ag-/],
  ['schema', /schema violations[\s\S]*\$\.sys\.bad/],
];

describe('build guards (MAT-008)', () => {
  for (const [name, re] of CASES) {
    test(`fixture ${name} exits 1 naming the path`, () => {
      const out = mkdtempSync(join(tmpdir(), 'ag-fix-'));
      try {
        execFileSync('node', [
          'scripts/tokens/build.mjs',
          '--fixtures', `tests/tokens/fixtures/guards/${name}/tokens`,
          '--out', out,
        ], { cwd: ROOT, encoding: 'utf8', stdio: 'pipe' });
        throw new Error('build did not fail');
      } catch (e: any) {
        const text = String(e.stderr ?? '') + String(e.stdout ?? '');
        expect(text).toMatch(re);
      }
    });
  }
});
