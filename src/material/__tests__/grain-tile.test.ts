/* Grain tile (MAT-117): the tile's entire purpose is its baked low alpha
   (generator writes alpha 2..14). If an encoder strips the alpha item, every
   surface paints opaque mid-gray noise at full strength — the 5.0.0/5.0.1
   regression. This pins the shipped asset to carry an AVIF alpha auxiliary
   image within the 4 KB budget. */
import { describe, expect, it } from '@jest/globals';
import { readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const TILE = join(process.cwd(), 'src/material/assets/ag-grain-128.avif');

describe('ag-grain-128.avif', () => {
  it('carries an alpha auxiliary image and stays within 4 KB', () => {
    const buf = readFileSync(TILE);
    const text = buf.subarray(0, 4096).toString('latin1');
    expect(text).toContain('auxC');
    expect(text).toContain('alpha');
    expect(statSync(TILE).size).toBeLessThanOrEqual(4096);
  });
});
