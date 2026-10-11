/* REQ-CMP-37. The Toolbar root IS the SurfaceGroup — one element carrying the
   chrome surface + data-ag-group/data-ag-spacing attrs; no nested wrapper;
   horizontal roots get data-ag-shape=capsule. */
import { test, expect } from '@playwright/test';
import { gotoStory } from '../../../helpers/index';

test.describe('toolbar surface root (REQ-CMP-37)', () => {
  test('root carries the surface-group attrs with no wrapper element', async ({ page }) => {
    await gotoStory(page, 'flagships-controls-toolbar--default')
      .catch(() => gotoStory(page, 'flagships-controls-toolbar--overview'));
    const root = page.getByRole('toolbar').first();
    test.skip((await root.count()) === 0, 'toolbar story missing');
    await expect(root).toHaveAttribute('data-ag-part', 'root');
    await expect(root).toHaveAttribute('data-ag-group', '');
    await expect(root).toHaveAttribute('data-ag-surface', '');
    await expect(root).toHaveAttribute('data-ag-shape', 'capsule');
    const spacing = await root.getAttribute('data-ag-spacing');
    expect(spacing).not.toBeNull();
    /* no wrapper: the parent must NOT be a second surface-group element */
    const parentGroup = await root.evaluate((el) => (el.parentElement as HTMLElement | null)?.hasAttribute('data-ag-group'));
    expect(parentGroup).toBeFalsy();
  });
});
