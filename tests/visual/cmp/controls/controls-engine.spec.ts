/* CMP-381 (lane 3i-Q). Engine material checks: computed (-webkit-)backdrop-filter
   on the SearchField shell and the Toolbar root contains a blur. The control
   material ships the same backdrop in every engine (only the enhanced lens is
   engine-gated), so the blur is asserted in all three projects; the WebKit run
   is the one that exercises the prefixed literal. No skip (PRD §18). */
import { test, expect } from '@playwright/test';
import { gotoStory } from '../../../helpers/index';

test.describe('controls engine material (CMP-381)', () => {
  test('search-field shell keeps a backdrop blur', async ({ page }) => {
    await gotoStory(page, 'flagships-controls-search-field--default')
      .catch(() => gotoStory(page, 'flagships-controls-searchfield--default'));
    const shell = page.locator('[data-ag-part="root"], [data-ag-part="control"]').first();
    const bf = await shell.evaluate(
      (el) => getComputedStyle(el, '::before').backdropFilter || getComputedStyle(el).backdropFilter,
    );
    expect(bf).toContain('blur');
  });

  test('toolbar root keeps a backdrop blur', async ({ page }) => {
    await gotoStory(page, 'flagships-controls-toolbar--default');
    const root = page.locator('[data-ag-part="root"], [role="toolbar"]').first();
    const bf = await root.evaluate(
      (el) => getComputedStyle(el, '::before').backdropFilter || getComputedStyle(el).backdropFilter,
    );
    expect(bf).toContain('blur');
  });
});
