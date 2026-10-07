/** CMP-160 (REQ-CMP-68): Select form behaviour — PENDING until lane 3d lands
    src/components/select/** (Select is not in this lane's owned paths). */
import { describe, expect, it } from '@jest/globals';
import '@testing-library/jest-dom/jest-globals';
import { existsSync } from 'node:fs';
import { join } from 'node:path';

const SELECT_SRC = join(__dirname, '..', '..', 'src', 'components', 'select');

describe('Select form behaviour', () => {
  it('PENDING: Select (lane 3d) not present — hidden input/reset/required assertions', () => {
    if (existsSync(SELECT_SRC)) {
      throw new Error('Select source landed — implement the REQ-CMP-68 assertions (hidden input value, form.reset() restores defaultValue, required blocks submit)');
    }
    throw new Error('PENDING: src/components/select/** absent — owned by lane 3d');
  });
});
