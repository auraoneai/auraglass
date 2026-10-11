/* @jest-environment node */
/* REQ-PLAT-65: dist preserves per-module structure — emitted entries keep a
   directory tree (one dist dir per emitted subpath entry), no flat bundle. */
import { describe, expect, it } from '@jest/globals';
import { readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { DIST, ensureBuilt, walk } from './helpers';

describe('preserve-modules', () => {
  it('dist emits many js modules (no single flat bundle)', () => {
    ensureBuilt();
    const js = walk(DIST, (p) => p.endsWith('.js') && !p.endsWith('.min.js'));
    expect(js.length).toBeGreaterThan(10);
  });
  it('dist tree is a directory structure mirroring emitted entries', () => {
    ensureBuilt();
    const dirs = readdirSync(DIST).filter((d) => statSync(join(DIST, d)).isDirectory());
    // every emitted entry gets its own subtree (icons/, material/, tokens/, ...)
    expect(dirs.length).toBeGreaterThanOrEqual(3);
    const empty: string[] = [];
    for (const d of dirs) {
      // compat/ is a css-only subtree — every other dir must hold js or d.ts
      if (d === 'compat') continue;
      if (!walk(join(DIST, d), (p) => /\.(js|d\.ts)$/.test(p)).length) empty.push(d);
    }
    expect(empty).toEqual([]);
  });
  it('each emitted subtree preserves nested module files (not inlined into index)', () => {
    ensureBuilt();
    const iconFiles = walk(join(DIST, 'icons'), (p) => p.endsWith('.js'));
    // icons keep per-file modules under dist/icons/<group>/<name>.js
    expect(iconFiles.length).toBeGreaterThan(20);
    expect(iconFiles.some((p) => /\/icons\/(media|action|ai|status)\//.test(p))).toBe(true);
  });
});
