/* @jest-environment node */
/* REQ-PLAT-65: declared peers/externals are never bundled into dist output. */
import { describe, expect, it } from '@jest/globals';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { DIST, ROOT, ensureBuilt, walk } from './helpers';

const PEERS = ['react', 'react-dom', 'styled-components', 'framer-motion', 'date-fns'];

describe('externals', () => {
  it('peer package internals are not inlined in dist js', () => {
    ensureBuilt();
    const offenders: string[] = [];
    for (const f of walk(DIST, (p) => p.endsWith('.js'))) {
      const text = readFileSync(f, 'utf8');
      for (const peer of PEERS) {
        // bundling internals would inline the package's own module marker
        if (text.includes(`node_modules/${peer}/`)) offenders.push(`${f}: ${peer} inlined`);
      }
    }
    expect(offenders).toEqual([]);
  });
});
