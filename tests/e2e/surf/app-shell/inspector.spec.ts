// inspector.spec.ts — SURF-38/059: inspector mode by container width (docked at
// 1440, floating at 1200, bottom Sheet at 375), opened only from the
// InspectorToggle, focus returns to the toggle when the sheet closes.
// Remote lane (3 engines); a missing subject or story fails the test.
import { test, expect, type Page } from '@playwright/test';
import { listSubjects, gotoStory } from '../../../helpers';

async function openInShell(page: Page, width: number) {
  await page.setViewportSize({ width, height: 900 });
  const subjects = await listSubjects({ owner: 'SURF' });
  const subject = subjects.find((s) => s.subject === 'Inspector' && s.id.endsWith('--in-shell'));
  if (!subject) throw new Error('Inspector --in-shell story not registered');
  await gotoStory(page, subject.id);
  const shell = page.locator('.ag-app-shell').first();
  await expect(shell).toHaveAttribute('data-ag-inspector', 'closed');
  return { shell, toggle: page.locator('[data-ag-toggle="inspector"]').first() };
}

const inlineStyle = (page: Page) =>
  page.evaluate(() => {
    const el = document.querySelector<HTMLElement>('.ag-app-shell [data-ag-slot="inspector"]');
    if (!el) throw new Error('inline inspector missing');
    const cs = getComputedStyle(el);
    return { display: cs.display, position: cs.position, backdropFilter: cs.backdropFilter };
  });

test.describe('inspector modes (SURF-38)', () => {
  test('mode by container width: 1440 docked', async ({ page }) => {
    const { shell, toggle } = await openInShell(page, 1440);
    await toggle.click();
    await expect(shell).toHaveAttribute('data-ag-inspector', 'open');
    await expect(shell).toHaveAttribute('data-mode', 'wide');
    await expect(page.getByRole('complementary', { name: 'Details' })).toBeVisible();
    const style = await inlineStyle(page);
    expect(style.position).not.toBe('absolute');
    expect(style.backdropFilter).toBe('none');
    await expect(page.getByRole('dialog')).toHaveCount(0);
  });

  test('mode by container width: 1200 floating', async ({ page }) => {
    const { shell, toggle } = await openInShell(page, 1200);
    await toggle.click();
    await expect(shell).toHaveAttribute('data-mode', 'expanded');
    await expect(page.getByRole('complementary', { name: 'Details' })).toBeVisible();
    const style = await inlineStyle(page);
    expect(style.position).toBe('absolute');
    await expect(page.getByRole('dialog')).toHaveCount(0);
  });

  test('compact sheet: closed by default, toggle opens a bottom Sheet, focus restores', async ({ page }) => {
    const { shell, toggle } = await openInShell(page, 375);
    await expect(shell).toHaveAttribute('data-mode', 'compact');
    // no SSR flash: nothing open before the toggle
    await expect(page.getByRole('dialog')).toHaveCount(0);
    expect((await inlineStyle(page)).display).toBe('none');

    await toggle.focus();
    await toggle.press('Enter');
    const dialog = page.getByRole('dialog');
    await expect(dialog).toHaveCount(1);
    await expect(dialog).toHaveAttribute('data-ag-part', 'inspector-sheet');
    await expect(dialog).toHaveAttribute('data-side', 'bottom');
    await expect(dialog.getByText('Atlas')).toBeVisible();
    const box = await dialog.boundingBox();
    if (!box) throw new Error('sheet has no box');
    // anchored to the bottom edge of the viewport
    expect(Math.round(box.y + box.height)).toBeGreaterThanOrEqual(899);

    await page.keyboard.press('Escape');
    await expect(page.getByRole('dialog')).toHaveCount(0);
    await expect(shell).toHaveAttribute('data-ag-inspector', 'closed');
    await expect(toggle).toBeFocused();
  });

  test('resizable via panels: Inspector has no resizable prop', async ({ page }) => {
    await openInShell(page, 1440);
    const attrs = await page.evaluate(() => {
      const el = document.querySelector('[data-ag-slot="inspector"]');
      return el ? el.getAttributeNames().filter((n) => /resiz/i.test(n)) : null;
    });
    expect(attrs).toEqual([]);
  });
});
