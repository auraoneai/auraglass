/* tests/docs/lint-claims.test.ts — PLAT-391 gate. Unsourced numbers in
   PLAT-owned prose fail; allow-listed and non-PLAT files don't. */
import { describe, expect, it } from '@jest/globals';
import { lint } from '../../scripts/docs/lint-claims.mjs';
import { generate } from '../../scripts/docs/gen-claims.mjs';
import { render } from '../../scripts/docs/render-claims.mjs';
import { join } from 'node:path';
import { mkdtempSync, writeFileSync, mkdirSync } from 'node:fs';
import { tmpdir } from 'node:os';

const root = join(__dirname, '..', '..');

describe('claims lint', () => {
  it('flags no unsourced numbers in PLAT-owned prose today', () => {
    const v = lint(root).filter((x) => /^README\.md$|^llms\.txt$|^apps\/docs\/content\/plat\/|^docs\/quickstart\//.test(x.file));
    expect(v).toEqual([]);
  });
  it('detects an unsourced number in a fixture tree', () => {
    const dir = mkdtempSync(join(tmpdir(), 'claims-'));
    writeFileSync(join(dir, 'README.md'), 'Ships 42 components and a 12 KB bundle.\n');
    const v = lint(dir).filter((x) => x.file === 'README.md');
    expect(v.length).toBeGreaterThan(0);
  });
  it('render-claims fills regions and renders pending for missing claims', () => {
    const out = render('a <!-- ag:claim tarball-mb --> b <!-- ag:claim fake -->', { 'tarball-mb': { value: 3.1, unit: 'MB' } });
    expect(out).toBe('a 3.1 MB b pending');
  });
  it('gen-claims marks claims pending when artifacts are absent', () => {
    const dir = mkdtempSync(join(tmpdir(), 'claims-gen-'));
    mkdirSync(join(dir, 'apps/docs/generated'), { recursive: true });
    const { claims } = generate({ root: dir, sha: 'local' });
    expect(claims['component-count'].state).toBe('pending');
    expect(claims['tarball-mb'].value).toBeNull();
  });
});
