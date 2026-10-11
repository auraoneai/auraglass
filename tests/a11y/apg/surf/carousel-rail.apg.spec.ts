// carousel-rail.apg.spec.ts — REQ-SURF-147/148 (REQ-FIN-86): APG carousel.
// Both indicator variants: aria-roledescription=carousel + label, slides with
// roledescription=slide; axe 0 violations. Tabs variant: one tab stop,
// ArrowRight/ArrowLeft/Home/End move DOM focus and aria-selected and scroll
// the viewport. Buttons variant: aria-current follows clicks. A swipe
// (scrollLeft set on the viewport) reports onIndexChange. A missing subject
// or story is a failure, never a skip.
import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { listSubjects, gotoStory } from '../../../helpers';

async function open(page: Page, story: 'tabs' | 'buttons') {
  const subjects = await listSubjects({ owner: 'SURF' });
  const subject = subjects.find((s) => s.subject === 'CarouselRail' && s.id.endsWith(`--${story}`));
  expect(subject, `CarouselRail ${story} story registered in the subject index`).toBeTruthy();
  await gotoStory(page, subject!.id);
  const rail = page.locator('[aria-roledescription="carousel"]');
  await expect(rail).toHaveCount(1);
  await expect(rail).toBeVisible();
  return rail;
}

const activePart = (page: Page) => page.evaluate(() => {
  const el = document.activeElement as HTMLElement | null;
  return el ? { part: el.getAttribute('data-ag-part'), label: el.getAttribute('aria-label'), selected: el.getAttribute('aria-selected') } : null;
});

const viewportScroll = (page: Page) =>
  page.locator('[data-ag-part="carousel-viewport"]').evaluate((el) => Math.round(el.scrollLeft));

test.describe('CarouselRail APG (REQ-SURF-147)', () => {
  for (const story of ['tabs', 'buttons'] as const) {
    test(`${story}: carousel semantics and axe 0 violations`, async ({ page }) => {
      const rail = await open(page, story);
      await expect(rail).toHaveAttribute('aria-label', 'Highlights');
      const slides = page.locator('[data-ag-part="carousel-slide"]');
      await expect(slides).toHaveCount(5);
      for (let i = 0; i < 5; i++) {
        await expect(slides.nth(i)).toHaveAttribute('aria-roledescription', 'slide');
        await expect(slides.nth(i)).toHaveAttribute('role', story === 'tabs' ? 'tabpanel' : 'group');
        await expect(slides.nth(i)).toHaveAttribute('aria-label', `${i + 1} of 5`);
      }
      await expect(page.getByRole('button', { name: 'Previous slide' })).toHaveAttribute('aria-disabled', 'true');
      await expect(page.getByRole('button', { name: 'Next slide' })).toHaveAttribute('aria-disabled', 'false');
      const results = await new AxeBuilder({ page }).include('[aria-roledescription="carousel"]').analyze();
      expect(results.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(', ')}`)).toEqual([]);
    });
  }

  test('tabs: one tab stop; ArrowRight/ArrowLeft/Home/End move focus and aria-selected', async ({ page }) => {
    await open(page, 'tabs');
    const tablist = page.getByRole('tablist');
    const tabs = tablist.getByRole('tab');
    await expect(tabs).toHaveCount(5);
    expect(await tablist.evaluate((el) => el.querySelectorAll('[tabindex="0"]').length)).toBe(1);

    await tabs.nth(0).focus();
    expect(await activePart(page)).toEqual({ part: 'carousel-indicator', label: 'Card 1', selected: 'true' });
    await page.keyboard.press('ArrowRight');
    expect(await activePart(page)).toEqual({ part: 'carousel-indicator', label: 'Card 2', selected: 'true' });
    await expect(tabs.nth(0)).toHaveAttribute('aria-selected', 'false');
    expect(await tablist.evaluate((el) => el.querySelectorAll('[tabindex="0"]').length)).toBe(1);
    // the visible slide follows the selection
    await expect.poll(() => viewportScroll(page)).toBeGreaterThan(0);

    await page.keyboard.press('End');
    expect(await activePart(page)).toEqual({ part: 'carousel-indicator', label: 'Card 5', selected: 'true' });
    await expect(page.getByRole('button', { name: 'Next slide' })).toHaveAttribute('aria-disabled', 'true');
    await page.keyboard.press('Home');
    expect(await activePart(page)).toEqual({ part: 'carousel-indicator', label: 'Card 1', selected: 'true' });
    await expect.poll(() => viewportScroll(page)).toBe(0);
    await page.keyboard.press('ArrowLeft'); // no loop: stays on the first tab
    expect(await activePart(page)).toEqual({ part: 'carousel-indicator', label: 'Card 1', selected: 'true' });

    // Tab leaves the tablist in one step
    await page.keyboard.press('Tab');
    expect(await page.evaluate(() => document.activeElement?.closest('[role="tablist"]') === null)).toBe(true);
  });

  test('buttons: clicking an indicator scrolls to that slide and moves aria-current', async ({ page }) => {
    await open(page, 'buttons');
    const dots = page.locator('[data-ag-part="carousel-indicator"]');
    await expect(dots).toHaveCount(5);
    await expect(dots.nth(0)).toHaveAttribute('aria-current', 'true');
    await dots.nth(2).click();
    await expect(dots.nth(2)).toHaveAttribute('aria-current', 'true');
    await expect(dots.nth(0)).toHaveAttribute('aria-current', 'false');
    const expected = await page.locator('[data-ag-part="carousel-slide"]').nth(2).evaluate((el) => Math.round((el as HTMLElement).offsetLeft));
    await expect.poll(() => viewportScroll(page)).toBe(expected);
    await expect(page.getByTestId('carousel-index')).toHaveText('2');
  });

  for (const story of ['tabs', 'buttons'] as const) {
    test(`${story}: a swipe (viewport scroll) reports onIndexChange`, async ({ page }) => {
      await open(page, story);
      const index = page.getByTestId('carousel-index');
      await expect(index).toHaveText('');
      await page.locator('[data-ag-part="carousel-viewport"]').evaluate((el) => {
        const target = el.querySelectorAll<HTMLElement>('[data-ag-part="carousel-slide"]')[3]!;
        el.scrollLeft = target.offsetLeft;
      });
      await expect(index).toHaveText('3');
      const current = story === 'tabs'
        ? page.getByRole('tab').nth(3)
        : page.locator('[data-ag-part="carousel-indicator"]').nth(3);
      await expect(current).toHaveAttribute(story === 'tabs' ? 'aria-selected' : 'aria-current', 'true');
      // and back: the observer reads the latest index
      await page.locator('[data-ag-part="carousel-viewport"]').evaluate((el) => { el.scrollLeft = 0; });
      await expect(index).toHaveText('0');
    });
  }
});
