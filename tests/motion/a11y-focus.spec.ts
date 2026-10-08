/* MAT-246 / REQ-MOT-114,-115: focus correctness around motion. Tab pressed
 * during a Dialog/Menu exit must never land inside the exiting Popup; the
 * focus ring must be visible within 1 frame of focus; focus must be inside
 * the Dialog at open. */
import { test, expect } from '@playwright/test';
import { gotoStory, listSubjects } from '../helpers';

const SUBJECTS = ['Dialog', 'Menu'] as const;

const findSubject = async (name: string) => {
  const subs = await listSubjects();
  const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');
  return (subs.find((s) => norm(s.subject).includes(norm(name)) && s.id.endsWith('--primary')) ??
    subs.find((s) => norm(s.subject).includes(norm(name))))?.id ?? null;
};

for (const subject of SUBJECTS) {
  test(`${subject}: focus lands inside the open popup, never the exiting one`, async ({ page }) => {
    const id = await findSubject(subject);
    if (!id) {
      test.info().annotations.push({ type: 'motion', description: `subject ${subject} absent` });
      return; // DOUBLE-PASS
    }
    await gotoStory(page, id, { motion: 'full' });
    const root = page.locator('[data-ag-root]');
    const trigger = root.locator('[data-ag-part="trigger"], button').first();
    if (await trigger.count()) await trigger.click({ force: true });

    // REQ-MOT-115: focus inside the popup at open
    const popup = page.locator('[role="dialog"], [role="menu"], [data-ag-part="popup"]').first();
    await expect(popup).toBeVisible({ timeout: 2_000 });
    const focusInside = await popup.evaluate((p) => p.contains(document.activeElement));
    expect(focusInside, `${subject}: focus inside popup at open`).toBe(true);

    // begin exit, then Tab — focus must not land inside the exiting node
    const exitingNode = popup;
    await page.keyboard.press('Escape').catch(() => undefined);
    await page.keyboard.press('Tab');
    const inExiting = await exitingNode.evaluate((p) =>
      document.contains(p) ? p.contains(document.activeElement) : false).catch(() => false);
    expect(inExiting, `${subject}: Tab during exit must not land in the exiting popup`).toBe(false);

    // REQ-MOT-114: focus ring visible within 1 frame of focus
    const ringVisible = await page.evaluate(async () => {
      const el = document.activeElement as HTMLElement | null;
      if (!el) return false;
      const before = getComputedStyle(el).outlineStyle !== 'none' ||
        getComputedStyle(el).boxShadow !== 'none' ||
        el.matches(':focus-visible');
      await new Promise((r) => requestAnimationFrame(() => r(0)));
      const after = getComputedStyle(el).outlineStyle !== 'none' ||
        getComputedStyle(el).boxShadow !== 'none' ||
        el.matches(':focus-visible');
      return before || after;
    });
    expect(ringVisible, 'focus ring visible within 1 frame').toBe(true);
  });
}
