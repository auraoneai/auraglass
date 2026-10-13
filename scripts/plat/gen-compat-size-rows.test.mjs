/* scripts/plat/gen-compat-size-rows.test.mjs — REQ-PLAT-30 compat rows:
   target row + 2 KB headroom, composite targets summed, first target row
   required, quote-safe rendering. */
import { describe, expect, it } from '@jest/globals';
import { compatSizeRows, renderBlock } from './gen-compat-size-rows.mjs';

const rows = [
  { id: 'cmp:button', import: "{ Button } from 'aura-glass'", limitBytes: 10000, kind: 'js' },
  { id: 'surf:thread', import: "{ Thread } from 'aura-glass/ai'", limitBytes: 3000, kind: 'js' },
  { id: 'surf:message', import: "export const Message = Ns.Part", limitBytes: 500, kind: 'js' },
];
const entries = [
  { symbol: 'GlassButton', compat: 'GlassButton', replacement: 'Button' },
  { symbol: 'GlassChat', compat: 'GlassChat', replacement: 'Thread + Message from aura-glass/ai' },
  { symbol: 'NoRowYet', compat: 'NoRowYet', replacement: 'MissingTarget' },
  { symbol: 'NotCompat', replacement: 'Button' },
];

describe('compatSizeRows', () => {
  it('budgets a compat export at its target row + 2048', () => {
    const out = compatSizeRows({ streamRows: rows, entries, compatExports: ['GlassButton'] });
    expect(out).toEqual([{ id: 'plat:compat:GlassButton', import: "{ GlassButton } from 'aura-glass/compat'", limitBytes: 12048, kind: 'js' }]);
  });

  it('sums composite targets; skips exports without a primary target row or compat promise', () => {
    const out = compatSizeRows({
      streamRows: rows, entries, compatExports: ['GlassChat', 'NoRowYet', 'NotCompat', 'Unlisted'],
    });
    expect(out).toEqual([{ id: 'plat:compat:GlassChat', import: "{ GlassChat } from 'aura-glass/compat'", limitBytes: 5548, kind: 'js' }]);
  });

  it('renders quote-safe static literals between the markers', () => {
    const block = renderBlock([{ id: 'x', import: "{ A } from 'aura-glass/compat'", limitBytes: 1, kind: 'js' }]);
    expect(block).toContain('import: "{ A } from \'aura-glass/compat\'"');
    expect(block.startsWith('/* GENERATED-COMPAT-ROWS:BEGIN')).toBe(true);
  });
});
