/* @jest-environment node */
/* REQ-PLAT-76: row targeting rules — 'aura-glass/internal' is the one
   explicit internal-row allowance; generated compat rows are target + 2 KB
   and marked compatOf (reported separately). */
import { describe, expect, it } from '@jest/globals';
// @ts-expect-error -- plain .mjs gate script, no types
import { compatRows, rowTarget } from '../../scripts/ci/verify-size-budgets.mjs';

describe('size-budget row targeting (REQ-PLAT-76)', () => {
  it('aura-glass/internal resolves via the internal allowance, not pending', () => {
    const t = rowTarget({ id: 'plat:cn', import: "export { cn } from 'aura-glass/internal'", limitBytes: 512, kind: 'js' });
    expect(t?.subpath).toBe('./internal');
    expect(t?.internal).toBe(true);
    expect(t?.entry).toBeNull();
  });

  it('a public subpath resolves to its manifest entry', () => {
    const t = rowTarget({ id: 'x', import: "{ Button } from 'aura-glass'", limitBytes: 1, kind: 'js' });
    expect(t?.subpath).toBe('.');
    expect(t?.internal).toBe(false);
    expect(t?.entry).toBeTruthy();
  });

  it('an unknown subpath has no entry and is not internal (the verifier fails it)', () => {
    const t = rowTarget({ id: 'x', import: "export { y } from 'aura-glass/no-such-entry'", limitBytes: 1, kind: 'js' });
    expect(t?.entry).toBeNull();
    expect(t?.internal).toBe(false);
  });

  it('compat rows: Glass-prefixed and exact names map to target + 2048, unmapped names skipped', () => {
    const rows = [
      { id: 'Button', import: "{ Button } from 'aura-glass'", limitBytes: 10000, kind: 'js' },
      { id: 'Card', import: "{ Card } from 'aura-glass'", limitBytes: 1500, kind: 'js' },
      { id: 'mat:tokens-css', import: 'aura-glass/tokens.css', limitBytes: 8192, kind: 'css' },
    ];
    const out = compatRows(rows, ['GlassButton', 'Card', 'GlassNoSuchThing']);
    expect(out).toEqual([
      { id: 'plat:compat:GlassButton', import: "export { GlassButton } from 'aura-glass/compat'", limitBytes: 12048, kind: 'js', compatOf: 'Button' },
      { id: 'plat:compat:Card', import: "export { Card } from 'aura-glass/compat'", limitBytes: 3548, kind: 'js', compatOf: 'Card' },
    ]);
  });
});
