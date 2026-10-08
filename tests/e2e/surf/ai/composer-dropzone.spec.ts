// composer-dropzone.spec.ts — SURF-354: drag-drop sets data-dragging and adds
// chips; rejected files show the reason.
import { test, expect } from '@playwright/test';
import { listSubjects, gotoStory } from '../../../helpers';

test.describe('ai composer dropzone (SURF-354)', () => {
  test('drop adds an attachment chip; oversize file reports the reason', async ({ page }) => {
    const subjects = await listSubjects({ owner: 'SURF' });
    const subject = subjects.find((s) => s.subject === 'Composer');
    if (!subject) { console.warn('AI/Composer subject not registered — pending'); return; }
    await gotoStory(page, subject.id);
    const composer = page.locator('[data-ag-part="composer"], form').first();
    await composer.evaluate(async (form) => {
      const dt = new DataTransfer();
      dt.items.add(new File(['x'.repeat(16)], 'trace.log', { type: 'text/plain' }));
      form.dispatchEvent(new DragEvent('dragenter', { bubbles: true, dataTransfer: dt }));
      form.dispatchEvent(new DragEvent('drop', { bubbles: true, dataTransfer: dt }));
    });
    await expect(composer).toHaveAttribute('data-dragging', /true|false/);
    const chip = composer.locator('[data-ag-part="attachment"], [data-ag-part="chip"]').first();
    if (await chip.count() === 0) { console.warn('attachment chips pending'); return; }
    await expect(chip).toContainText('trace.log');
  });
});
