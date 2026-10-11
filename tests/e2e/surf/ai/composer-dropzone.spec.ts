// composer-dropzone.spec.ts — REQ-SURF-118 (SURF-354): drag-and-drop onto
// Composer.Root sets data-dragging (stable across child boundaries), accepted
// files become chips, rejected files report their reason. Remote lane only.
// A missing story fails the spec.
import { test, expect } from '@playwright/test';
import { listSubjects, gotoStory } from '../../../helpers';

test.describe('ai composer dropzone (REQ-SURF-118)', () => {
  test('drop adds an attachment chip; oversize file reports the reason', async ({ page }) => {
    const id = 'ai-composer--dropzone';
    const subjects = await listSubjects();
    const subject = subjects.find((s) => s.id === id);
    expect(subject, `story ${id} must be registered in the Storybook index`).toBeDefined();
    await gotoStory(page, subject!.id);
    const composer = page.locator('[data-ag-part="composer"]');
    await expect(composer).toHaveCount(1);

    // Enter the form, then cross into (and out of) the textarea: still dragging.
    await composer.evaluate((form) => {
      const ta = form.querySelector('textarea')!;
      const dt = new DataTransfer();
      form.dispatchEvent(new DragEvent('dragenter', { bubbles: true, cancelable: true, dataTransfer: dt }));
      ta.dispatchEvent(new DragEvent('dragenter', { bubbles: true, cancelable: true, dataTransfer: dt }));
      ta.dispatchEvent(new DragEvent('dragleave', { bubbles: true, cancelable: true, dataTransfer: dt }));
    });
    await expect(composer).toHaveAttribute('data-dragging', 'true');

    await composer.evaluate((form) => {
      const dt = new DataTransfer();
      dt.items.add(new File(['x'.repeat(16)], 'trace.log', { type: 'text/plain' }));
      dt.items.add(new File(['y'.repeat(2048)], 'huge.log', { type: 'text/plain' }));
      dt.items.add(new File(['z'], 'photo.png', { type: 'image/png' }));
      form.dispatchEvent(new DragEvent('drop', { bubbles: true, cancelable: true, dataTransfer: dt }));
    });
    await expect(composer).not.toHaveAttribute('data-dragging', /.*/);

    const chips = composer.locator('[data-ag-part="attachment"]');
    await expect(chips).toHaveCount(1);
    await expect(chips.first()).toContainText('trace.log');
    await expect(page.getByRole('button', { name: 'Remove trace.log' })).toBeVisible();
    await expect(page.getByTestId('rejections').locator('li')).toHaveText(['huge.log: size', 'photo.png: type']);

    await page.getByRole('button', { name: 'Remove trace.log' }).click();
    await expect(chips).toHaveCount(0);
  });
});
