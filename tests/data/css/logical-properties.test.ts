/** @jest-environment node */
// SURF css lane: physical box properties (left/right/width-adjacent physical
// edges) are banned in W2 css — logical properties only (RTL-safe).

import { describe, expect, it } from '@jest/globals';
import { execSync } from 'node:child_process';

describe('logical properties (W2 css)', () => {
  it('no physical edge properties in src/{data,date,charts} css', () => {
    const out = execSync(
      "grep -rEn '(^|[;{[:space:]])(margin|padding|border|inset|top|right|bottom|left)-(left|right)|[[:space:]]float:|text-align:[[:space:]]*(left|right)' src/data src/date src/charts --include='*.css' || true",
      { encoding: 'utf8', cwd: process.cwd() },
    );
    expect(out.trim()).toBe('');
  });
});
