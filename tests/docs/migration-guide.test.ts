/* tests/docs/migration-guide.test.ts — PLAT-397 gate: the v5 page anchors
   every B1–B21 row and every deprecation id appears once. */
import { describe, expect, it } from '@jest/globals';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const root = join(__dirname, '..', '..');
const page = join(root, 'apps/docs/content/plat/migrate/5.mdx');

describe('v5 migration guide', () => {
  const src = existsSync(page) ? readFileSync(page, 'utf8') : '';
  it('exists', () => { expect(src.length).toBeGreaterThan(0); });
  it('anchors all 21 breaking changes', () => {
    for (let n = 1; n <= 21; n++) expect(src).toContain(`#b-${n}`);
  });
  it('carries #dep- anchors for each deprecations.json row once it exists', () => {
    const dep = join(root, 'deprecations.json');
    if (!existsSync(dep)) { console.warn('deprecations.json pending (lane 1c)'); return; }
    for (const row of JSON.parse(readFileSync(dep, 'utf8')).deprecations ?? []) {
      expect(src).toContain(`#dep-${row.id ?? row.key}`);
    }
  });
  it('other migration pages exist', () => {
    for (const slug of ['from-mui', 'from-radix', 'from-lucide']) {
      expect(existsSync(join(root, `apps/docs/content/plat/migrate/${slug}.mdx`))).toBe(true);
    }
  });
});
