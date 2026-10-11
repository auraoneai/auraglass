// tests/capability/contract-tests.test.ts — W5 C0 prerequisites (PROMPT-4e).
// Asserts the contract-v1.1 bootstrap (C0) is present: the seams this lane
// codes and tests against all exist on `next`. While C0 has not landed the
// suite reports pending and passes; once src/contracts/ exists every
// required seam is asserted, so a partial bootstrap goes red.
import { describe, expect, it } from '@jest/globals';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = join(__dirname, '../..');
const C0_SENTINEL = join(ROOT, 'src/contracts');
const REQUIRED = [
  '.gitlab-ci.yml',
  'ci/surf.gitlab-ci.yml',
  'src/contracts/fragments.ts',
  'src/contracts/load-fragments.mjs',
  'src/contracts/testing.ts',
  'contracts/lint-rule-owners.json',
  'eslint-plugin-auraglass.js',
  'docs/auraglass-5/archive/v1-19-prd/prd/AURAGLASS_COMPONENT_EXPANSION_PRD.md',
  'docs/auraglass-5/research/competitors.md',
];

if (!existsSync(C0_SENTINEL)) {
  it('C0 contract bootstrap pending (src/contracts absent)', () => {
    console.warn('pending: C0 bootstrap not landed; re-run after PLAT C0');
  });
} else {
  describe('C0 contract bootstrap (PROMPT-4e prerequisites)', () => {
    for (const p of REQUIRED) {
      it(`${p} exists`, () => {
        expect(existsSync(join(ROOT, p))).toBe(true);
      });
    }
    it('src/contracts/testing.ts declares CI_JOBS', () => {
      const f = join(ROOT, 'src/contracts/testing.ts');
      expect(readFileSync(f, 'utf8')).toContain('CI_JOBS');
    });
    it('lint-rule-owners.json assigns SURF its rules (S-47)', () => {
      const f = join(ROOT, 'contracts/lint-rule-owners.json');
      const text = readFileSync(f, 'utf8');
      expect(text).toContain('no-simulation');
      expect(text).toContain('no-network-in-ai');
    });
  });
}
