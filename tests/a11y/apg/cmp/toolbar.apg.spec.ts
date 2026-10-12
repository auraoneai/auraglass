/* CMP-366 (lane 3i-Q) + REQ-CMP-40. Toolbar APG over the Keyboard story
   (Bold, Italic disabled, Undo, Docs): one tab stop; Arrow keys move with
   loop; Home/End jump to the first/last enabled item; the disabled item is
   never focused. Overflow story: below its content width the priority="low"
   items move into the trailing "More actions" Menu and the roving order is the
   inline items followed by the trigger. */
import { test, expect, type Locator } from '@playwright/test';
import { gotoStory } from '../../../helpers/index';
import { apg } from '../harness';

/** The roving items: the toolbar's own buttons and links (never their hit-area/label spans). */
const ITEMS = ':is(button, a[href])';

async function labels(toolbar: Locator): Promise<string[]> {
  return toolbar.locator(ITEMS).evaluateAll((els) =>
    els.map((el) => (el.getAttribute('aria-label') ?? el.textContent ?? '').trim()));
}
const focused = (toolbar: Locator) => toolbar.evaluate(() => {
  const el = document.activeElement as HTMLElement | null;
  return el ? (el.getAttribute('aria-label') ?? el.textContent ?? '').trim() : '';
});

test.describe('toolbar APG (CMP-366, REQ-CMP-40)', () => {
  test('roving tabindex: one tab stop; arrows loop; Home/End; disabled skipped', async ({ page }) => {
    await gotoStory(page, 'flagships-controls-toolbar--keyboard');
    const toolbar = page.locator('[role="toolbar"]').first();
    await expect(toolbar).toBeVisible();
    expect(await labels(toolbar)).toEqual(['Bold', 'Italic', 'Undo', 'Docs']);
    const tabStops = await toolbar.locator(ITEMS).evaluateAll(
      (els) => els.filter((el) => (el as HTMLElement).tabIndex === 0).length,
    );
    expect(tabStops).toBe(1);

    await toolbar.locator(ITEMS).first().focus();
    expect(await focused(toolbar)).toBe('Bold');
    await page.keyboard.press('ArrowRight'); /* Italic is disabled: skipped */
    expect(await focused(toolbar)).toBe('Undo');
    await page.keyboard.press('ArrowRight');
    expect(await focused(toolbar)).toBe('Docs');
    await page.keyboard.press('ArrowRight'); /* loops */
    expect(await focused(toolbar)).toBe('Bold');
    await page.keyboard.press('ArrowLeft'); /* loops back */
    expect(await focused(toolbar)).toBe('Docs');
    await page.keyboard.press('Home');
    expect(await focused(toolbar)).toBe('Bold');
    await page.keyboard.press('End');
    expect(await focused(toolbar)).toBe('Docs');
    /* still one tab stop, now on the focused item */
    const stops = await toolbar.locator(ITEMS).evaluateAll((els) =>
      els.filter((el) => (el as HTMLElement).tabIndex === 0).map((el) => (el.textContent ?? '').trim()));
    expect(stops).toEqual(['Docs']);
    await apg.axe(page);
  });

  test('overflow: low-priority items move into the trailing Menu; roving order stays consistent', async ({ page }) => {
    await gotoStory(page, 'flagships-controls-toolbar--overflow');
    const toolbar = page.locator('[role="toolbar"]').first();
    await expect(toolbar).toBeVisible();
    await expect.poll(() => labels(toolbar)).toEqual(['Bold', 'Italic', 'More actions']);
    /* the bar fits its 220px column */
    const fits = await toolbar.evaluate((el) => el.getBoundingClientRect().width <= (el.parentElement?.clientWidth ?? 0) + 0.5);
    expect(fits).toBe(true);
    await toolbar.locator(ITEMS).first().focus();
    expect(await focused(toolbar)).toBe('Bold');
    await page.keyboard.press('End');
    expect(await focused(toolbar)).toBe('More actions');
    await page.keyboard.press('Enter');
    const menu = page.getByRole('menu');
    await expect(menu).toBeVisible();
    await expect(menu.getByRole('menuitem')).toHaveText(['Strikethrough', 'Highlight', 'Clear formatting']);
    await page.keyboard.press('Escape');

    /* room again: every item returns inline and the Menu goes away */
    await toolbar.evaluate((el) => { (el.parentElement as HTMLElement).style.inlineSize = '1200px'; });
    await expect.poll(() => labels(toolbar)).toEqual(['Bold', 'Italic', 'Strikethrough', 'Highlight', 'Clear formatting']);
    await apg.axe(page);
  });
});
