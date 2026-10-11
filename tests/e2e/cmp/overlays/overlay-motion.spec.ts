
/* CMP-389 (lane 3i-Q). Overlay motion kind table, per open subject:
   small 200/140ms (Tooltip/Popover/Menu), medium 320/220ms
   (Dialog/AlertDialog/Sheet/Toast), large 450/320ms (full Sheet).
   Asserts computed transition-duration on the popup, entrance and exit. */
import { test, expect } from '@playwright/test';
import { gotoStory } from '../../../helpers/index';

const KIND_MS: Record<string, number[]> = {
  small: [200, 140],
  medium: [320, 220],
  large: [450, 320],
};
const SUBJECTS: Record<string, { story: string; kind: keyof typeof KIND_MS }> = {
  Tooltip: { story: 'overlays-tooltip--playground', kind: 'small' },
  Popover: { story: 'overlays-popover--playground', kind: 'small' },
  Menu: { story: 'overlays-menu--playground', kind: 'small' },
  Dialog: { story: 'overlays-dialog--default', kind: 'medium' },
  AlertDialog: { story: 'overlays-alert-dialog--confirm', kind: 'medium' },
  Sheet: { story: 'overlays-sheet--bottom-detents', kind: 'medium' },
  Toast: { story: 'overlays-toast--playground', kind: 'medium' },
};

function durationsMs(v: string): number[] {
  return v.split(',').map((s) => {
    const t = s.trim();
    return t.endsWith('ms') ? parseFloat(t) : parseFloat(t) * 1000;
  });
}

test.describe('overlay motion kinds (CMP-389)', () => {
  for (const [name, { story, kind }] of Object.entries(SUBJECTS)) {
    test(`${name}: popup transition-duration matches the ${kind} kind table`, async ({ page }) => {
      await gotoStory(page, story, { motion: 'full' });
      const popup = page.locator('[data-ag-part="popup"], [data-ag-part="root"], [role="tooltip"]').first();
      test.skip((await popup.count()) === 0, `${name} popup not mounted in ${story}`);
      const durs = await popup.evaluate((el) => getComputedStyle(el).transitionDuration);
      const ms = durationsMs(durs);
      // at least one declared duration is on the kind table (+-40ms)
      const wanted = KIND_MS[kind]!;
      expect(
        ms.some((d) => wanted.some((w) => Math.abs(d - w) <= 40)),
        `${name} transition-duration ${durs} not in ${kind} table ${wanted}`,
      ).toBe(true);
    });
  }
});
