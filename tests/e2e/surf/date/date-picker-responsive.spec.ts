// date picker responsive (SURF L5 e2e lane, REQ-SURF-98/101): at a 390px
// viewport the picker's container is below 640px, so the CMP Popover is
// presented as a bottom sheet — its box bottom equals the viewport bottom. At
// 1280px it is the anchored popover. Subject: DatePicker Default.
import { test, expect } from '@playwright/test';
import { gotoStory } from '../../../helpers';
import { requireStory } from './subjects';

test.describe('date picker responsive (REQ-SURF-101)', () => {
  test.describe('390px', () => {
    test.use({ viewport: { width: 390, height: 844 } });
    test('popup is a bottom sheet flush with the viewport bottom', async ({ page }) => {
      await gotoStory(page, await requireStory('DatePicker', 'default'));
      await page.getByRole('button', { name: 'Choose date' }).click();
      const dialog = page.getByRole('dialog', { name: 'Due date' });
      await expect(dialog).toBeVisible();
      await expect(dialog).toHaveAttribute('data-ag-presentation', 'sheet');
      await expect(dialog).toHaveAttribute('data-ag-side', 'bottom');
      // Let the sheet's enter transition settle before measuring.
      await expect(dialog).not.toHaveAttribute('data-ag-animating');
      const box = await dialog.boundingBox();
      expect(box).not.toBeNull();
      expect(Math.abs(box!.y + box!.height - 844)).toBeLessThanOrEqual(1);
      await page.keyboard.press('Escape');
      await expect(dialog).toBeHidden();
    });
  });

  test.describe('1280px', () => {
    test.use({ viewport: { width: 1280, height: 900 } });
    test('popup is the anchored popover below the field', async ({ page }) => {
      await gotoStory(page, await requireStory('DatePicker', 'default'));
      const trigger = page.getByRole('button', { name: 'Choose date' });
      await trigger.click();
      const dialog = page.getByRole('dialog', { name: 'Due date' });
      await expect(dialog).toHaveAttribute('data-ag-presentation', 'popover');
      const t = (await trigger.boundingBox())!;
      const d = (await dialog.boundingBox())!;
      expect(d.y).toBeGreaterThanOrEqual(t.y + t.height - 1);
      expect(d.y + d.height).toBeLessThan(900);
    });
  });
});
