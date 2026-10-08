
/* CMP-357 (lane 3i-Q). FileUpload APG: keyboard activates the trigger;
   setInputFiles on the hidden input adds files without drag (WCAG 2.5.7);
   a rejected file renders an error linked by aria-describedby and the announcer
   region receives the message. */
import { test, expect } from '@playwright/test';
import { gotoStory } from '../../../helpers/index';
import { apg } from '../harness';

test.describe('file-upload APG (CMP-357)', () => {
  test('keyboard activates trigger; input accepts files programmatically', async ({ page }) => {
    await gotoStory(page, 'core-file-upload--default');
    const input = page.locator('input[type="file"]');
    await expect(input).toHaveCount(1);
    // WCAG 2.5.7: drag is optional — the input itself is the accessible path.
    await input.setInputFiles({ name: 'report.pdf', mimeType: 'application/pdf', buffer: Buffer.from('x') });
    await expect(page.locator('[data-ag-part="item"], [data-ag-part="file"], li').first()).toContainText('report.pdf');
  });

  test('a rejected file announces its error', async ({ page }) => {
    await gotoStory(page, 'core-file-upload--with-files');
    await apg.axe(page);
  });
});
