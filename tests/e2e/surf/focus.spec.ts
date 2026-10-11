// tests/e2e/surf/focus.spec.ts — SURF slice of the focus-visible matrix
// (L12). Tabbing through a shipped SURF subject lands on interactive
// elements that render a visible focus indication.
import { test, expect } from '@playwright/test';
import { listSubjects, gotoStory } from '../../helpers';

test.describe('SURF focus-visible', () => {
  test('every shipped SURF subject shows a focus indicator on Tab', async ({ page }) => {
    const subjects = await listSubjects({ owner: 'SURF' });
    expect(subjects.length, 'no SURF subjects registered in the subject index').toBeGreaterThan(0);
    for (const subject of subjects) {
      await test.step(subject.id, async () => {
        await gotoStory(page, subject.id);
        const seen = await page.evaluate(async () => {
          const results: Array<{ tag: string; visible: boolean }> = [];
          const doc = document;
          for (let i = 0; i < 12; i++) {
            const evt = new KeyboardEvent('keydown', { key: 'Tab' });
            doc.dispatchEvent(evt);
            const ae = doc.activeElement as HTMLElement | null;
            if (!ae || ae === doc.body) break;
            const style = getComputedStyle(ae);
            const visible =
              parseFloat(style.outlineWidth) > 0 ||
              style.boxShadow !== 'none' ||
              parseFloat(style.borderWidth) > 0;
            results.push({ tag: ae.tagName, visible });
            ae.blur();
          }
          return results;
        });
        // Every interactive element reached must show some focus indication.
        for (const r of seen) expect(r.visible, `${r.tag} lost its focus indicator`).toBe(true);
      });
    }
  });
});
