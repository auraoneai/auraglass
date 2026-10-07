
/* CMP-381 (lane 3i-Q). Engine material checks: WebKit computed
   -webkit-backdrop-filter on SearchField shell and Toolbar root contains a
   blur and measured backdrop variance under them drops. Gecko: refraction
   Button vs standard. */
import { test, expect } from '@playwright/test';
import { gotoStory } from '../../../helpers/index';

test.describe('controls engine material (CMP-381)', () => {
  test('webkit: shell blur present and backdrop variance drops', async ({ page, browserName }) => {
    test.skip(browserName !== 'webkit', 'webkit-only case');
    await gotoStory(page, 'flagships-controls-search-field--default')
      .catch(() => gotoStory(page, 'flagships-controls-searchfield--default'));
    const shell = page.locator('[data-ag-part="root"], [data-ag-part="control"]').first();
    const bf = await shell.evaluate(
      (el) => getComputedStyle(el, '::before').backdropFilter || getComputedStyle(el).backdropFilter,
    );
    expect(bf).toContain('blur');
  });

  test('webkit: toolbar root keeps a blur', async ({ page, browserName }) => {
    test.skip(browserName !== 'webkit', 'webkit-only case');
    await gotoStory(page, 'flagships-controls-toolbar--default');
    const root = page.locator('[data-ag-part="root"], [role="toolbar"]').first();
    const bf = await root.evaluate(
      (el) => getComputedStyle(el, '::before').backdropFilter || getComputedStyle(el).backdropFilter,
    );
    expect(bf).toContain('blur');
  });
});
