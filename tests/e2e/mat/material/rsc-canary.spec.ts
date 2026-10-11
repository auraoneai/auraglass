/* MAT-167 — RSC canary input: marks the spec QA L11 runs in its consumer
   canary next/next16. The spec itself is authored here so the QA lane has a
   stable target; it asserts the server-safe material exports render under RSC
   with 0 console warnings. In QA-086 the page is a real Server Component —
   this spec is a no-op until that harness lands (consumed via interface). */
import { test, expect } from '@playwright/test';
import { gotoMaterialStory } from '../../../material/helpers/story';

test.describe('rsc canary', () => {
  test('material stories render with 0 console errors (L11 input)', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
    page.on('pageerror', (e) => errors.push(String(e)));
    await gotoMaterialStory(page, 'material-lab--overview');
    await gotoMaterialStory(page, 'material-lab--tiers');
    expect(errors).toEqual([]);
  });
});
