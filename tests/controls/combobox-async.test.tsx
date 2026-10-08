/** CMP-161 (REQ-CMP-71): Combobox async contract — PENDING until lane 3d lands
    src/components/combobox/**. */
import { describe, expect, it } from '@jest/globals';
import '@testing-library/jest-dom/jest-globals';
import { existsSync } from 'node:fs';
import { join } from 'node:path';

const COMBOBOX_SRC = join(__dirname, '..', '..', 'src', 'components', 'combobox');

describe('Combobox async', () => {
  it('PENDING: Combobox (lane 3d) not present — loading/aria-busy/announcer/Empty assertions', () => {
    if (existsSync(COMBOBOX_SRC)) {
      throw new Error('Combobox source landed — implement the REQ-CMP-71 assertions (aria-busy on list, announcer ≤1/500ms, Empty role=status, virtualisation bounds)');
    }
    throw new Error('PENDING: src/components/combobox/** absent — owned by lane 3d');
  });
});
