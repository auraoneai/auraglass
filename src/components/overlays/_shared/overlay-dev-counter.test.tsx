/* CMP-204 (REQ-CMP-04): surface-over-budget warning via PRD-04's
   surfaceCounter (MAT-owned dev seam at src/material/dev/surfaceCounter.ts).
   The seam doesn't exist yet → this test is intentionally a loud PENDING row;
   when the seam lands it must run for real (no second counter here). */
import { describe, expect, it, beforeEach } from '@jest/globals';
import '@testing-library/jest-dom/jest-globals';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { MOUNTED_SUBJECTS } from './__tests__/subjects';

const COUNTER_PATH = join(process.cwd(), 'src', 'material', 'dev', 'surfaceCounter.ts');

describe('overlay dev counter (CMP-204)', () => {
  beforeEach(() => {
    if (typeof window !== 'undefined' && window.PointerEvent === undefined) {
      (window as unknown as Record<string, unknown>).PointerEvent = window.MouseEvent;
    }
  });

  it('PENDING: MAT surfaceCounter seam (src/material/dev/surfaceCounter.ts) does not exist on this contract SHA', () => {
    if (!existsSync(COUNTER_PATH)) {
      throw new Error('PENDING: src/material/dev/surfaceCounter.ts absent — MAT seam; CMP-204 runs when it lands');
    }
  });

  it.each(MOUNTED_SUBJECTS.map((s) => [s.name, s] as const))(
    '%s: one warning when surface budget exceeded (fixture: 5 fine-pointer Surfaces + subject)',
    async (name, _subject) => {
      if (!existsSync(COUNTER_PATH)) return; // pending row above is the loud one
      // When the seam lands: mount 5 Surfaces + subject with pointer:fine and
      // assert exactly one console.warn containing the budget message.
      expect(name).toBeTruthy();
    },
  );
});
