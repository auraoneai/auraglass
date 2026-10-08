/* @jest-environment node */
/* PLAT-258 (REQ-PLAT-68): the root surface stays <=160 export names and is composed
   only of the ROOT_EXPORTS groups (cmp, surf, mat) plus the shared kernel. */
import { describe, expect, it } from '@jest/globals';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { ROOT } from '../build/helpers';

const ROOT_EXPORTS = ['cmp', 'surf', 'mat'];

describe('root surface (PLAT-258)', () => {
  it('src/index.ts re-exports only the sanctioned groups (or is still a pending seed)', () => {
    const indexPath = join(ROOT, 'src/index.ts');
    const text = readFileSync(indexPath, 'utf8');
    for (const m of text.matchAll(/from\s*['"]([^'"]+)['"]/g)) {
      const spec = m[1];
      if (spec.includes('root/')) {
        const grp = spec.split('root/')[1].replace(/['"]|\.ts.*/g, '').replace(/[^\w-]/g, '');
        expect(ROOT_EXPORTS).toContain(grp);
      }
    }
  });

  it('when the root entry ships, dist/index.js exposes <=160 names', () => {
    const distIndex = join(ROOT, 'dist/index.js');
    if (!existsSync(distIndex)) return; // '.' pending (seed graph): nothing ships yet
    const text = readFileSync(distIndex, 'utf8');
    const names = new Set<string>();
    for (const m of text.matchAll(/export\s*\{([^}]*)\}/g)) {
      for (const part of m[1].split(',')) {
        const n = part.trim().split(/\s+as\s+/).pop()?.trim();
        if (n) names.add(n);
      }
    }
    for (const m of text.matchAll(/export\s+(?:const|function|class|let|var)\s+(\w+)/g)) names.add(m[1]);
    expect(names.size).toBeLessThanOrEqual(160);
  });
});
