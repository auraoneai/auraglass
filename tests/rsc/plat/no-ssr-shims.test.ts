/* @jest-environment node */
/* PLAT-262: no SSR shim identifiers survive anywhere under src/ or dist/. */
import { describe, expect, it } from '@jest/globals';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { ROOT, DIST, walk } from '../../build/helpers';

const SHIMS = /AuraGlassClientBoundary|AuraGlassSSRProvider|StyleSheetManager|registryGuard/;

describe('no SSR shims (PLAT-262)', () => {
  it('shim identifiers absent from src/**', () => {
    const hits = walk(join(ROOT, 'src'), p => /\.(ts|tsx)$/.test(p))
      .flatMap(f => { const { readFileSync } = require('node:fs'); return SHIMS.test(readFileSync(f, 'utf8')) ? [f] : []; });
    expect(hits).toEqual([]);
  });

  it('shim identifiers absent from dist/**', () => {
    if (!existsSync(DIST)) return;
    const { readFileSync } = require('node:fs');
    const hits = walk(DIST, p => /\.(js|d\.ts)$/.test(p)).filter(f => SHIMS.test(readFileSync(f, 'utf8')));
    expect(hits).toEqual([]);
  });
});
