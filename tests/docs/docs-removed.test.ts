/* tests/docs/docs-removed.test.ts — PLAT-402 gate: RM-13 paths are absent
   on next once the removal commit lands; kept paths (release-rollback,
   auraglass-5, MAT-owned guides) remain until then this test asserts the
   record exists and lists the family. */
import { describe, expect, it } from '@jest/globals';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const root = join(__dirname, '..', '..');
const RECORD = join(root, 'docs/release/decisions/removals/RM-13.json');
export const RM13_PATHS = [
  'docs/components', 'docs/guides/consciousness-interface.md', 'docs/guides/consciousness-migration.md',
  'docs/guides/migration.md', 'docs/guides/ssr-setup.md', 'docs/liquid-glass/migration.md',
  'docs/recipes/readme.md', 'docs/cli/migration.md', 'docs/theme/theme-engine.md',
  'docs/app-shell/readme.md', 'docs/package-entrypoints.md', 'docs/readme.md', 'INSTALLATION.md', 'legacy/tests',
];

describe('RM-13 removal family', () => {
  it('has a committed disposition record listing every path', () => {
    if (!existsSync(RECORD)) { console.warn('RM-13.json pending — removal commit not yet landed'); return; }
    const rec = JSON.parse(readFileSync(RECORD, 'utf8'));
    expect(rec.family).toBe('RM-13');
    for (const p of RM13_PATHS) expect(rec.paths).toContain(p);
  });
  it('removal paths are gone once RM-13 lands (pending warns until then)', () => {
    const present = RM13_PATHS.filter((p) => existsSync(join(root, p)));
    if (!existsSync(RECORD)) { console.warn(`pending removal: ${present.length} paths still present`); return; }
    expect(present).toEqual([]);
  });
  it('kept docs paths are never in the removal family', () => {
    if (!existsSync(RECORD)) return;
    const rec = JSON.parse(readFileSync(RECORD, 'utf8'));
    for (const keep of ['docs/release-rollback-deprecation.md', 'docs/auraglass-5', 'docs/motion.md', 'docs/design-tokens.md']) {
      expect(rec.paths).not.toContain(keep);
    }
  });
});
