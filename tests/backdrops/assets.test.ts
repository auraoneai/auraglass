import { describe, expect, it } from '@jest/globals';
import { statSync } from 'node:fs';
import { join } from 'node:path';

const dir = join(__dirname, '../../src/backdrops/assets');

describe('backdrop asset budgets (REQ-SURF-160)', () => {
  it('grain-112.avif ≤ 8 KB', () => {
    expect(statSync(join(dir, 'grain-112.avif')).size).toBeLessThanOrEqual(8192);
  });
  it('grain-112.png ≤ 16 KB', () => {
    expect(statSync(join(dir, 'grain-112.png')).size).toBeLessThanOrEqual(16384);
  });
});
