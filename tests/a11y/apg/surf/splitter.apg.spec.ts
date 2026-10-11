// splitter.apg.spec.ts — SURF-44/053: APG window splitter keyboard script over the
// shipped subject (surf/resizable-panels Default: two panels, 50/50).
// Remote lane; a missing subject fails the test.
import { test, expect } from '@playwright/test';
import { listSubjects, gotoStory } from '../../../helpers';
import { apg } from '../harness';

const SUBJECT = 'ResizablePanels';

async function openDefault(page: import('@playwright/test').Page) {
  const subjects = await listSubjects({ owner: 'SURF' });
  const subject = subjects.find((s) => (s.subject === SUBJECT || s.id === 'surf-resizable-panels--default') && s.id.endsWith('--default'));
  if (!subject) throw new Error(`${SUBJECT} --default story not registered`);
  await gotoStory(page, subject.id);
}

test.describe('APG window splitter (SURF)', () => {
  test('separator semantics', async ({ page }) => {
    await openDefault(page);
    const sep = page.getByRole('separator', { name: 'Resize left' });
    await expect(sep).toHaveCount(1);
    // APG: the splitter between side-by-side panes is vertically oriented.
    await expect(sep).toHaveAttribute('aria-orientation', 'vertical');
    await expect(sep).toHaveAttribute('aria-valuenow', '50');
    await expect(sep).toHaveAttribute('aria-valuemin', '0');
    await expect(sep).toHaveAttribute('aria-valuemax', '100');
    await expect(sep).toHaveAttribute('tabindex', '0');
    const controls = await sep.getAttribute('aria-controls');
    expect(controls).toBe('left');
    await expect(page.locator(`[id="${controls}"]`)).toHaveCount(1);
  });

  test('keyboard contract', async ({ page }) => {
    await openDefault(page);
    await apg.keyboard(page, SCRIPT);
  });

  test('axe clean (throws on any violation)', async ({ page }) => {
    await openDefault(page);
    await apg.axe(page);
  });
});

const SCRIPT = [
  { press: 'Tab', expectFocus: 'resize-handle', expectState: { 'aria-valuenow': '50' } },
  { press: 'ArrowRight', expectState: { 'aria-valuenow': '52' } },
  { press: 'Shift+ArrowRight', expectState: { 'aria-valuenow': '62' } },
  { press: 'ArrowLeft', expectState: { 'aria-valuenow': '60' } },
  { press: 'Home', expectState: { 'aria-valuenow': '0' } },
  { press: 'End', expectState: { 'aria-valuenow': '100' } },
];
