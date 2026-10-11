/* @jest-environment node */
/* CMP-190 (REQ-CMP-132): overlay 4.x lineage — every §2.4 overlay name maps to
   a migration row in a lane meta; the runtime warn-once seam (4.2 + 4.3 wired
   deprecation ids rendering '[aura-glass] DEP-…' exactly once per page load)
   is owned by lane 3h over fragments/deprecations/cmp.ts — now wired (REQ-CMP-132). */
import { describe, expect, it, jest, beforeEach, afterEach } from '@jest/globals';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import deprecations from '../../fragments/deprecations/cmp';
import { warnDeprecated, setDeprecationMode } from '../../src/internal/warnDeprecated';
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

  it('fragments/deprecations/cmp.ts wires DEP-C ids for every overlay 4.x name', () => {
    const symbols = new Set(deprecations.map((d) => d.symbol));
    const required = [
      'GlassModal', 'GlassDialog', 'GlassDrawer', 'GlassBottomSheet',
      'GlassActionSheet', 'LiquidGlassAdaptiveSheet', 'MobileGlassBottomSheet',
      'GlassPopover', 'GlassHoverCard', 'GlassTooltip', 'GlassDropdownMenu',
      'GlassContextMenu', 'GlassMenubar', 'LiquidGlassPopoverMenu',
      'GlassToast', 'GlassToastProvider', 'GlassToastViewport',
      'GlassNotificationCenter', 'GlassNotificationProvider', 'Positioner',
      'GlassPositioner',
    ];
    for (const s of required) expect(symbols.has(s)).toBe(true);
  });

  it('warnDeprecated resolves the overlay id and warns exactly once per load', () => {
    const spy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    try {
      warnDeprecated('DEP-C0101');
      warnDeprecated('DEP-C0101');
      const calls = spy.mock.calls.filter((c) => String(c[0]).includes('DEP-C0101'));
      expect(calls).toHaveLength(1);
      expect(String(calls[0]![0])).toContain('[aura-glass] DEP-C0101');
      expect(String(calls[0]![0])).toContain('GlassModal');
    } finally {
      spy.mockRestore();
    }
  });
});
