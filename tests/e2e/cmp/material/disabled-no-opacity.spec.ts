
/* CMP-360 (lane 3i-Q). Disabled surfaces never dim: for every Core/ and
   Foundation/ story from index.json plus Button and Dialog, every
   [data-ag-surface][data-disabled] has computed opacity "1". */
import { test, expect } from '@playwright/test';
import { gotoStory, listSubjects } from '../../../helpers/index';

test.describe('disabled-no-opacity (CMP-360)', () => {
  test('no disabled surface renders below full opacity', async ({ page }) => {
    const subjects = await listSubjects({ owner: 'CMP' });
    const ids = subjects
      .map((s) => s.id)
      .filter((id) => /^(core-|foundation-|flagships-controls-(button|dialog))/.test(id));
    expect(ids.length).toBeGreaterThan(0);
    const offenders: string[] = [];
    for (const id of ids.slice(0, 40)) {
      await gotoStory(page, id).catch(() => null);
      const bad = await page.evaluate(() =>
        [...document.querySelectorAll<HTMLElement>('[data-ag-surface][data-disabled], [data-disabled]')]
          .filter((el) => getComputedStyle(el).opacity !== '1')
          .map((el) => el.outerHTML.slice(0, 80)),
      );
      offenders.push(...bad.map((b) => `${id}: ${b}`));
    }
    expect(offenders).toEqual([]);
  });
});
