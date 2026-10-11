/* tests/docs/docs-removed.test.ts — REQ-PLAT-83 gate: RM-13 paths are gone
   on next, kept paths stay out of the record, and the migrate MDX ports
   carry every heading from their deleted 4.x sources. */
import { describe, expect, it } from '@jest/globals';
import { readFileSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join } from 'node:path';

const root = join(__dirname, '..', '..');
const RECORD = join(root, 'docs/release/decisions/removals/RM-13.json');
const RM13_PATHS = [
  'docs/components', 'docs/guides/consciousness-interface.md', 'docs/guides/consciousness-migration.md',
  'docs/guides/migration.md', 'docs/guides/ssr-setup.md', 'docs/liquid-glass/migration.md',
  'docs/recipes/readme.md', 'docs/cli/migration.md', 'docs/theme/theme-engine.md',
  'docs/app-shell/readme.md', 'docs/package-entrypoints.md', 'docs/readme.md', 'INSTALLATION.md', 'legacy/tests',
];

const MDX_PORTS: [string, string][] = [
  ['docs/migration/lucide-to-auraglass-icons.md', 'apps/docs/content/plat/migrate/from-lucide.mdx'],
  ['docs/migration/mui-to-auraglass.md', 'apps/docs/content/plat/migrate/from-mui.mdx'],
  ['docs/migration/radix-to-auraglass.md', 'apps/docs/content/plat/migrate/from-radix.mdx'],
];

const headings = (text: string) =>
  text.split('\n').filter((l) => /^#{1,3}\s/.test(l)).map((l) => l.replace(/^#+\s*/, '').trim().toLowerCase());

describe('RM-13 removal family', () => {
  it('has a committed disposition record listing every path', () => {
    expect(existsSync(RECORD)).toBe(true);
    const rec = JSON.parse(readFileSync(RECORD, 'utf8'));
    expect(rec.family).toBe('RM-13');
    for (const p of RM13_PATHS) expect(rec.paths).toContain(p);
  });

  it('removal paths are gone from the tree', () => {
    const present = RM13_PATHS.filter((p) => existsSync(join(root, p)));
    expect(present).toEqual([]);
  });

  it('kept docs paths are never in the removal family', () => {
    const rec = JSON.parse(readFileSync(RECORD, 'utf8'));
    for (const keep of ['docs/release-rollback-deprecation.md', 'docs/auraglass-5', 'docs/motion.md', 'docs/design-tokens.md']) {
      expect(rec.paths).not.toContain(keep);
    }
  });
});

describe('migrate MDX ports', () => {
  for (const [src, mdx] of MDX_PORTS) {
    it(`${mdx} ports every heading and is at least as long as ${src}`, () => {
      const source = execFileSync('git', ['show', `4842edc5e^:${src}`], { cwd: root, encoding: 'utf8' });
      const port = readFileSync(join(root, mdx), 'utf8');
      /* every source heading survives (case-insensitive, ### collapsed) */
      const portHeads = new Set(headings(port));
      for (const h of headings(source)) expect(portHeads.has(h)).toBe(true);
      /* code-fence and table rows carry the real content */
      expect(port.length).toBeGreaterThanOrEqual(source.length * 0.8);
      expect((port.match(/^```/gm) ?? []).length).toBeGreaterThanOrEqual((source.match(/^```/gm) ?? []).length);
    });
  }
});
