// carousel-autoplay.spec.ts — REQ-SURF-149 (REQ-FIN-86), lane L9 (motion).
// CarouselRail autoplay is a loop: it rotates only with allowContinuous,
// motion=full and a [data-ag-continuous="on"] ancestor (contract §9). The
// gated story rotates on its 5 s interval; the user can stop it; a hidden
// document pauses it; hover pauses it. The ungated story never rotates and
// its toggle offers "Start automatic slide show". A missing subject or story
// is a failure, never a skip.
import { test, expect, type Page } from '@playwright/test';
import { listSubjects, gotoStory } from '../../../helpers';

async function open(page: Page, story: 'autoplay' | 'autoplay-gated') {
  const subjects = await listSubjects({ owner: 'SURF' });
  const subject = subjects.find((s) => s.subject === 'CarouselRail' && s.id.endsWith(`--${story}`));
  expect(subject, `CarouselRail ${story} story registered in the subject index`).toBeTruthy();
  await gotoStory(page, subject!.id);
  await expect(page.locator('[aria-roledescription="carousel"]')).toHaveCount(1);
  // keep the pointer off the rail: hover pauses rotation
  await page.mouse.move(0, 0);
}

const rail = (page: Page) => page.locator('[aria-roledescription="carousel"]');
const index = (page: Page) => page.getByTestId('carousel-index');
const toggle = (page: Page) => page.locator('[data-ag-part="carousel-autoplay-toggle"]');

test.describe('CarouselRail autoplay gate (REQ-SURF-149)', () => {
  test.describe.configure({ timeout: 60_000 });

  test('gate open: rotates every interval, Stop halts it', async ({ page }) => {
    await open(page, 'autoplay-gated');
    expect(await page.evaluate(() => !!document.querySelector('[data-ag-continuous="on"]'))).toBe(true);
    await expect(rail(page)).toHaveAttribute('data-state', 'playing');
    await expect(toggle(page)).toHaveAttribute('aria-label', 'Stop automatic slide show');
    await expect(toggle(page)).toHaveAttribute('aria-pressed', 'true');
    // the viewport is not a live region while rotating
    await expect(page.locator('[data-ag-part="carousel-viewport"]')).toHaveAttribute('aria-live', 'off');
    await expect(index(page)).toHaveText('1', { timeout: 9_000 });
    await expect(index(page)).toHaveText('2', { timeout: 9_000 });
    await expect(page.getByRole('tab').nth(2)).toHaveAttribute('aria-selected', 'true');

    // stop via the rotation control (click, then move focus and pointer away)
    await toggle(page).click();
    await page.mouse.move(0, 0);
    await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur());
    await expect(toggle(page)).toHaveAttribute('aria-label', 'Start automatic slide show');
    await expect(toggle(page)).toHaveAttribute('aria-pressed', 'false');
    await expect(rail(page)).toHaveAttribute('data-state', 'stopped');
    await page.waitForTimeout(6_500);
    await expect(index(page)).toHaveText('2');
  });

  test('gate open: a hidden document pauses rotation', async ({ page }) => {
    await open(page, 'autoplay-gated');
    await expect(rail(page)).toHaveAttribute('data-state', 'playing');
    await page.evaluate(() => {
      Object.defineProperty(document, 'hidden', { configurable: true, get: () => true });
      Object.defineProperty(document, 'visibilityState', { configurable: true, get: () => 'hidden' });
      document.dispatchEvent(new Event('visibilitychange'));
    });
    await expect(rail(page)).toHaveAttribute('data-state', 'stopped');
    await page.waitForTimeout(6_500);
    await expect(index(page)).toHaveText('');
    await page.evaluate(() => {
      Object.defineProperty(document, 'hidden', { configurable: true, get: () => false });
      Object.defineProperty(document, 'visibilityState', { configurable: true, get: () => 'visible' });
      document.dispatchEvent(new Event('visibilitychange'));
    });
    await expect(rail(page)).toHaveAttribute('data-state', 'playing');
    await expect(index(page)).toHaveText('1', { timeout: 9_000 });
  });

  test('gate open: hovering the rail pauses rotation', async ({ page }) => {
    await open(page, 'autoplay-gated');
    await page.locator('[data-ag-part="carousel-viewport"]').hover();
    await expect(rail(page)).toHaveAttribute('data-state', 'stopped');
    await page.waitForTimeout(6_500);
    await expect(index(page)).toHaveText('');
  });

  test('gate closed (prop only): never rotates; the toggle offers Start', async ({ page }) => {
    await open(page, 'autoplay');
    expect(await page.evaluate(() => !!document.querySelector('[data-ag-continuous="on"]'))).toBe(false);
    await expect(rail(page)).toHaveAttribute('data-state', 'stopped');
    await expect(toggle(page)).toHaveAttribute('aria-label', 'Start automatic slide show');
    await expect(toggle(page)).toHaveAttribute('aria-pressed', 'false');
    await page.waitForTimeout(9_000); // longer than the story's 8 s interval
    await expect(index(page)).toHaveText('');
    await expect(page.getByRole('tab').nth(0)).toHaveAttribute('aria-selected', 'true');
  });
});
