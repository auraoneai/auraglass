/** CMP-171 (REQ-CMP-131): compat adapters for the 40 4.x control names —
    PENDING until the PLAT compat seam (src/compat/**) exists. */
import { describe, expect, it } from '@jest/globals';
import '@testing-library/jest-dom/jest-globals';
import { existsSync } from 'node:fs';
import { join } from 'node:path';

const COMPAT_SRC = join(__dirname, '..', '..', 'src', 'compat');

describe('compat controls', () => {
  it('PENDING: aura-glass/compat seam absent — 40-name render matrix', () => {
    if (existsSync(COMPAT_SRC) && existsSync(join(COMPAT_SRC, 'cmp'))) {
      throw new Error('src/compat/cmp landed — implement the 40-name render matrix (4.x props → 5.0 root part)');
    }
    throw new Error('PENDING: src/compat/** seam absent (PLAT-owned) — resolves when the compat scaffold lands');
  });
});
