// Shared lookup for the Table story specs (REQ-SURF-70/72/73/76). A missing
// story is a hard failure — never a silent pass (AC-FIN-GLOBAL).
import { expect, type Page } from '@playwright/test';
import { gotoStory, listSubjects } from '../../../helpers';

export async function gotoTableStory(page: Page, exportSlug: string): Promise<void> {
  const subjects = await listSubjects({});
  const story = subjects.find((s) => s.subject === 'Table' && s.id.endsWith(`--${exportSlug}`));
  expect(story, `Table story "--${exportSlug}" must be registered in the Storybook index`).toBeDefined();
  await gotoStory(page, story!.id);
  await expect(page.locator('[data-ag-part="table-root"]').first()).toBeVisible();
}
