// command.apg.spec.ts — SURF-062 (REQ-FIN-82): combobox/listbox APG script for
// Command, and the CommandPalette hotkey round-trip (Ctrl/Cmd+K opens and
// focuses the combobox; Escape clears, Escape closes; focus returns to the
// opener). Remote lane only; a missing subject fails the test.
import { test, expect } from '@playwright/test';
import { listSubjects, gotoStory } from '../../../helpers';
import { apg } from '../harness';

async function open(page: import('@playwright/test').Page, id: string) {
  const subjects = await listSubjects({ owner: 'SURF' });
  const subject = subjects.find((s) => s.id === id);
  if (!subject) throw new Error(`${id} subject not registered`);
  await gotoStory(page, subject.id);
}

test.describe('APG command (SURF)', () => {
  test('combobox keyboard contract', async ({ page }) => {
    await open(page, 'surf-command--default');
    const input = page.getByRole('combobox');
    await input.focus();
    await page.keyboard.press('ArrowDown');
    const first = await input.getAttribute('aria-activedescendant');
    expect(first).toBeTruthy();
    await expect(page.locator(`[id="${first}"]`)).toHaveAttribute('aria-selected', 'true');
    await page.keyboard.press('ArrowUp'); // wraps to the last option
    const last = await input.getAttribute('aria-activedescendant');
    expect(last).not.toBe(first);
    await expect(page.locator(`[id="${last}"]`)).toHaveText(/Save/);
    await apg.keyboard(page, [{ type: 'zzz' }]);
    await expect(page.locator('[role="option"]:not([hidden])')).toHaveCount(0);
    await page.keyboard.press('Escape'); // clears the query
    await expect(input).toHaveValue('');
  });

  test('hotkey opens the palette and Escape twice restores focus to the opener', async ({ page }) => {
    await open(page, 'surf-command-palette--with-opener');
    const opener = page.getByRole('button', { name: 'Opener' });
    await opener.focus();
    await page.keyboard.press('Control+k'); // mod = Ctrl or Meta
    const combobox = page.getByRole('combobox');
    await expect(combobox).toBeFocused();
    await page.keyboard.type('al');
    await page.keyboard.press('Escape');
    await expect(combobox).toHaveValue('');
    await expect(combobox).toBeFocused();
    await page.keyboard.press('Escape');
    await expect(page.locator('[data-ag-part="command-palette"]')).toHaveCount(0);
    await expect(opener).toBeFocused();
  });

  test('axe clean', async ({ page }) => {
    await open(page, 'surf-command--default');
    await apg.axe(page);
  });
});
