/* @jest-environment node */
/* CMP-190 (REQ-CMP-132): overlay 4.x lineage — every §2.4 overlay name maps to
   a migration row in a lane meta; the runtime warn-once seam (4.2 + 4.3 wired
   deprecation ids rendering '[aura-glass] DEP-…' exactly once per page load)
   is owned by lane 3h over fragments/deprecations/cmp.ts — loud PENDING until
   it wires rows. */
import { describe, expect, it } from '@jest/globals';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import deprecations from '../../fragments/deprecations/cmp';
import dialogMeta from '../../src/components/dialog/Dialog.meta';
import alertMeta from '../../src/components/alert-dialog/AlertDialog.meta';
import sheetMeta from '../../src/components/sheet/Sheet.meta';

const METAS = { Dialog: dialogMeta, AlertDialog: alertMeta, Sheet: sheetMeta } as const;
const NAMES_4X = {
  Dialog: ['GlassModal', 'GlassDialog'],
  AlertDialog: ['GlassModal', 'GlassDialog'],
  Sheet: ['GlassDrawer', 'GlassBottomSheet', 'GlassActionSheet', 'LiquidGlassAdaptiveSheet', 'MobileGlassBottomSheet'],
} as const;

describe('overlay deprecations (CMP-190)', () => {
  it.each(Object.keys(NAMES_4X) as (keyof typeof NAMES_4X)[])(
    '%s meta maps its 4.x names', (name) => {
      const froms = METAS[name].migration.map((r) => r.from);
      for (const n of NAMES_4X[name]) expect(froms).toContain(n);
    },
  );

  it('PENDING: fragments/deprecations/cmp.ts wires overlay ids (lane 3h); then render-twice warns exactly once with [aura-glass] DEP-…', () => {
    if (deprecations.length === 0) {
      throw new Error('PENDING: no deprecation ids wired for overlays — lane 3h owns the runtime seam');
    }
  });
});
