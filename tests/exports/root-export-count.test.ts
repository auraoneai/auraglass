/* @jest-environment node */
/* REQ-PLAT-67: root export count stays bounded (≤160 value names) — GA surface
   discipline against accidental barrel growth. Counted by the TypeScript
   checker over src/index.ts's full re-export closure (src/index.ts is only
   `export *` lines, so a text scan would count 0). */
import { describe, expect, it } from '@jest/globals';
import { entrySurface } from './ts-exports';

describe('root export count', () => {
  it('the root entry exposes between 1 and 160 value names', () => {
    const { values } = entrySurface('src/index.ts');
    expect(values.length).toBeGreaterThan(0);
    expect(values.length).toBeLessThanOrEqual(160);
  }, 300_000);
});
