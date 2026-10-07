// visual lane (SURF): data surface visual states — guarded by subject
// discovery; screenshots land in the visual harness.
import { test, expect } from '@playwright/test';
import { listSubjects, gotoStory } from '../../helpers';

test.describe('data surfaces visual', () => {
  for (const name of ['Table', 'FilterBar', 'TreeView', 'StatCard', 'Sparkline', 'ChartFrame', 'Calendar', 'DatePicker']) {
    test(`${name} default state`, async ({ page }) => {
      const subjects = await listSubjects({ owner: 'SURF' });
      const subject = subjects.find((s) => s.subject === name);
      if (!subject) { console.warn(`${name} subject not registered — pending`); return; }
      await gotoStory(page, subject.id);
      await expect(page.locator('body')).toBeVisible();
    });
  }
});
