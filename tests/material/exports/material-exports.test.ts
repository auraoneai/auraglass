/* @jest-environment node */
/* tests/material/exports/material-exports.test.ts — MAT-347 (REQ-MAT-22).
   The ./material value-export list is exactly the frozen contract list
   (ENTRIES['./material'], 7 values — defineMaterial was dropped, OI-MAT-05);
   resolveRole and LensDefs are absent; no ./material/define entry exists. */
import { describe, expect, it } from '@jest/globals';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import * as materialModule from '../../../src/material/index';
import { ENTRIES } from '../../../src/contracts/entries';

const spec = ENTRIES.find((e) => e.subpath === './material');

describe('aura-glass/material exports', () => {
  it('contract entry exists and lists exactly the frozen value exports', () => {
    expect(spec).toBeDefined();
    expect(spec!.exports).toEqual([
      'Surface',
      'SurfaceGroup',
      'Environment',
      'ScrollEdge',
      'ConcentricFrame',
      'materialProps',
      'useMaterialTier',
    ]);
  });

  it('source module exports exactly the contract list — no more, no less', () => {
    const exported = Object.keys(materialModule).sort();
    expect(exported).toEqual([...(spec!.exports as readonly string[])].sort());
  });

  it('dropped 4.x exports are absent', () => {
    expect((materialModule as Record<string, unknown>)['defineMaterial']).toBeUndefined();
    expect((materialModule as Record<string, unknown>)['resolveRole']).toBeUndefined();
    expect((materialModule as Record<string, unknown>)['LensDefs']).toBeUndefined();
  });

  it('no ./material/define subpath entry exists', () => {
    expect(ENTRIES.some((e) => e.subpath === './material/define')).toBe(false);
    expect(
      ENTRIES.filter((e) => e.subpath.startsWith('./material')).map((e) => e.subpath).sort(),
    ).toEqual(['./material', './material.css']);
  });

  it('built dist bundle contains no defineMaterial code (pending without build)', () => {
    const distDir = join(process.cwd(), 'dist');
    if (!existsSync(distDir)) {
      console.log('pending: dist/ absent — bundle-level check runs in CI after npm run build');
      return;
    }
    const bundles = readdirSync(distDir).filter((f: string) => f.includes('material') && f.endsWith('.js'));
    for (const f of bundles) {
      expect(readFileSync(join(distDir, f), 'utf8')).not.toMatch(/defineMaterial/);
    }
  });
});
