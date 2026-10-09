/* @jest-environment node */
/* REQ-PLAT-67: root export count stays bounded (≤160 names) — GA surface
   discipline against accidental barrel growth. */
import { describe, expect, it } from '@jest/globals';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { ROOT, walk } from '../build/helpers';

const SRC = join(ROOT, 'src');

describe('root export count', () => {
  it('root index.ts exports ≤160 named values', () => {
    const text = readFileSync(join(SRC, 'index.ts'), 'utf8');
    const names = new Set<string>();
    for (const m of text.matchAll(/export\s+(?:const|function|class|type|interface|let|var|enum)\s+(\w+)/g)) names.add(m[1]);
    for (const m of text.matchAll(/export\s*\{([^}]+)\}/g)) {
      for (const part of m[1].split(',')) {
        const n = part.trim().split(/\s+as\s+/).pop()?.trim();
        if (n) names.add(n);
      }
    }
    expect(names.size).toBeLessThanOrEqual(160);
  });
});
