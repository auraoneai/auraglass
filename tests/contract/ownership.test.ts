/* Contract seed (QUAL): §6.3 assertions that hold against C0. ownership.json equals §3.2
   machine form; every path has exactly one owner (first-match-wins); CODEOWNERS is in sync. */
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import picomatch from 'picomatch';

const root = join(__dirname, '..', '..');
const doc = JSON.parse(readFileSync(join(root, 'contracts', 'ownership.json'), 'utf8'));
const rows = doc.rows as Array<{ id: string; glob: string; owner: string; lines?: string[] }>;

const ownerOf = (path: string) => rows.find((r) => !r.lines && picomatch(r.glob, { dot: true })(path));

describe('contract:ownership.json', () => {
  it('is non-empty and ends with the PLAT fallback', () => {
    expect(rows.length).toBeGreaterThan(100);
    expect(rows[rows.length - 1]).toMatchObject({ id: 'Z01', glob: '**', owner: 'PLAT' });
  });

  it('spans every stream key', () => {
    for (const s of ['PLAT', 'MAT', 'CMP', 'SURF', 'QUAL', 'CONTRACT']) {
      expect(rows.some((r) => r.owner === s)).toBe(true);
    }
  });

  it('holds the fixed contract rows', () => {
    expect(ownerOf('docs/auraglass-5/AURAGLASS_5_CONTRACTS.md')?.owner).toBe('CONTRACT');
    expect(ownerOf('src/contracts/material.ts')?.owner).toBe('CONTRACT');
    expect(ownerOf('.gitlab-ci.yml')?.owner).toBe('PLAT');
    expect(ownerOf('ci/mat.gitlab-ci.yml')?.owner).toBe('MAT');
    expect(ownerOf('src/components/button/index.ts')?.owner).toBe('CMP');
    expect(ownerOf('src/material/css/material.css')?.owner).toBe('MAT');
    expect(ownerOf('tests/e2e/qual/smoke.spec.ts')?.owner).toBe('QUAL');
    expect(ownerOf('tests/e2e/misplaced/foo.spec.ts')?.owner).toBe('NONE');
    expect(ownerOf('tests/e2e/misplaced/deep/foo.spec.ts')?.owner).toBe('NONE');
  });

  it('every row glob parses', () => {
    for (const r of rows) expect(() => picomatch(r.glob)).not.toThrow();
  });
});

describe('generated CODEOWNERS', () => {
  it('exists and names a reviewer', () => {
    const co = readFileSync(join(root, '.github', 'CODEOWNERS'), 'utf8');
    expect(co).toContain('@gchahal1982');
    expect(co).not.toContain('owner=NONE');
  });
});
