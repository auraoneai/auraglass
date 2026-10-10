// tabs.apg.spec.ts — SURF-066 / REQ-SURF-48 (REQ-FIN-82): APG tabs keyboard
// script + axe over the shipped Tabs subject. Remote lane only; a missing
// subject fails the test.
import { test, expect } from '@playwright/test';
import { listSubjects, gotoStory } from '../../../helpers';
import { apg } from '../harness';

const STORY = 'surf-tabs--default';

async function openTabs(page: import('@playwright/test').Page) {
  const subjects = await listSubjects({ owner: 'SURF' });
  const subject = subjects.find((s) => s.id === STORY) ?? subjects.find((s) => s.subject === 'Tabs');
  if (!subject) throw new Error('Tabs subject not registered');
  await gotoStory(page, subject.id);
}

test.describe('APG tabs (SURF)', () => {
  test('keyboard contract: roving focus, wrap, Home/End, manual activation', async ({ page }) => {
    await openTabs(page);
    await apg.keyboard(page, [
      { press: 'Tab', expectFocus: 'role=tab[name=Alpha]' },
      { press: 'ArrowRight', expectFocus: 'role=tab[name=Beta]' },
      // manual activation: focus alone does not select
      { expectState: { 'aria-selected': 'false' } },
      { press: 'Enter', expectState: { 'aria-selected': 'true', 'data-state': 'active' } },
      { press: 'ArrowRight', expectFocus: 'role=tab[name=Gamma]' },
      { press: 'ArrowRight', expectFocus: 'role=tab[name=Alpha]' }, // wraps
      { press: 'ArrowLeft', expectFocus: 'role=tab[name=Gamma]' }, // wraps backwards
      { press: 'Home', expectFocus: 'role=tab[name=Alpha]' },
      { press: 'End', expectFocus: 'role=tab[name=Gamma]' },
      { press: 'Space', expectState: { 'aria-selected': 'true' } },
    ]);
    // the selected tab's panel is shown and labelled by it
    const selected = page.getByRole('tab', { name: 'Gamma' });
    const panelId = await selected.getAttribute('aria-controls');
    expect(panelId).toBeTruthy();
    const panel = page.locator(`[id="${panelId}"]`);
    await expect(panel).toBeVisible();
    await expect(panel).toHaveAttribute('aria-labelledby', (await selected.getAttribute('id'))!);
  });

  test('axe clean (incl. duplicate-id-aria)', async ({ page }) => {
    await openTabs(page);
    await apg.axe(page);
  });
});
