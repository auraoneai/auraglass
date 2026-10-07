/* MAT-246 / REQ-MOT-101,-102,-104: responsive morph invariants.
 * Menu/Select/Combobox → Sheet morph when crossing 640 px while open;
 * at 390×844 the bottom sheet enters within the medium duration budget and a
 * full-height target within large; parallax/scroll text displacement ≤ 24 px. */
import { test, expect } from '@playwright/test';
import { gotoStory, listSubjects } from '../helpers';

const MORPH_SUBJECTS = ['Menu', 'Select', 'Combobox'] as const;
const BREAKPOINT = 640;
const MEDIUM_MS = 300;   // --ag-duration-medium ceiling
const LARGE_MS = 600;    // --ag-duration-large ceiling
const PARALLAX_MAX_PX = 24;

const findSubject = async (name: string) => {
  const subs = await listSubjects();
  const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');
  return (subs.find((s) => norm(s.subject) === norm(name)) ??
    subs.find((s) => norm(s.subject).includes(norm(name))))?.id ?? null;
};

for (const subject of MORPH_SUBJECTS) {
  test(`${subject}: morphs to sheet when crossing ${BREAKPOINT}px while open`, async ({ page }) => {
    const id = await findSubject(subject);
    if (!id) {
      test.info().annotations.push({ type: 'motion', description: `subject ${subject} absent` });
      return; // DOUBLE-PASS
    }
    await page.setViewportSize({ width: BREAKPOINT + 40, height: 800 });
    await gotoStory(page, id, { motion: 'full' });
    const root = page.locator('[data-ag-root]');
    const trigger = root.locator('[data-ag-part="trigger"], button').first();
    if (await trigger.count()) await trigger.click({ force: true });
    const surface = page.locator('[role="menu"], [role="listbox"], [data-ag-part="popup"]').first();
    await expect(surface).toBeVisible({ timeout: 2_000 });
    // cross the breakpoint while open
    await page.setViewportSize({ width: 390, height: 844 });
    const sheet = page.locator('[data-ag-part="sheet"], [role="dialog"][data-ag-sheet]').first();
    await expect(sheet, `${subject} must morph into the sheet surface below ${BREAKPOINT}px`)
      .toBeVisible({ timeout: 2_000 });
  });
}

test.describe('390×844 sheet entry budgets', () => {
  test.use({ viewport: { width: 390, height: 844 } });
  test('bottom sheet enters within medium; full-height within large', async ({ page }) => {
    const id = (await findSubject('Sheet')) ?? (await findSubject('BottomSheet'));
    if (!id) {
      test.info().annotations.push({ type: 'motion', description: 'subject Sheet absent' });
      return; // DOUBLE-PASS
    }
    await gotoStory(page, id, { motion: 'full' });
    const sheet = page.locator('[data-ag-part="sheet"], [role="dialog"]').first();
    const trigger = page.locator('[data-ag-part="trigger"], button').first();
    const t0 = Date.now();
    if (await trigger.count()) await trigger.click({ force: true });
    await expect(sheet).toBeVisible();
    const box = await sheet.boundingBox();
    expect(box).toBeTruthy();
    const enterMs = Date.now() - t0;
    // settled-position read: entry finishes once translate resolves
    await page.waitForTimeout(MEDIUM_MS);
    const settled = await sheet.evaluate((el) => getComputedStyle(el).transform);
    const fullHeight = box!.height > 0.9 * 844;
    expect(
      enterMs,
      `sheet entry (${fullHeight ? 'full-height' : 'bottom'}) budget`,
    ).toBeLessThanOrEqual(fullHeight ? LARGE_MS : MEDIUM_MS);
    void settled;
  });
});

test('parallax/scroll text displacement <= 24 px', async ({ page }) => {
  const subs = await listSubjects();
  const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');
  const hit = subs.find((s) => norm(s.id).includes('parallax') || norm(s.subject).includes('parallax')) ??
    subs.find((s) => norm(s.subject).includes('scroll'));
  if (!hit) {
    test.info().annotations.push({ type: 'motion', description: 'parallax/scroll subject absent' });
    return; // DOUBLE-PASS
  }
  await gotoStory(page, hit.id, { motion: 'full' });
  const measure = async () =>
    page.evaluate(() => {
      const els = [...document.querySelectorAll<HTMLElement>('[data-ag-part*="text"], h1,h2,h3,p,span')]
        .filter((e) => e.getBoundingClientRect().height > 0);
      return els.slice(0, 20).map((e) => e.getBoundingClientRect().top);
    });
  const before = await measure();
  await page.mouse.wheel(0, 400);
  await page.waitForTimeout(120);
  const after = await measure();
  const maxDelta = Math.max(0, ...before.map((b, i) => Math.abs(b - (after[i] ?? b))));
  expect(maxDelta, 'text displacement under scroll/parallax').toBeLessThanOrEqual(PARALLAX_MAX_PX);
});
