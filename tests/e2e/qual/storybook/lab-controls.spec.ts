/* REQ-QUAL-57 Lab control round-trips (Material Lab, REQ-QUAL-53/-54): in the Regular lab page, moving the public
   `--ag-light-angle` knob writes it on the Lab subtree and moving it back restores the shipped value; a discrete
   Surface axis (thickness) round-trips through the rendered Surface; "Reset to shipped" leaves no inline
   private `--_ag-*` override. Producer: G-10 (.storybook/lab/MaterialLab.stories.tsx). */
import { beforeAllFresh, collectErrors, expect, openStory, storiesTagged, test } from './_storybook';

const LAB_TITLE = 'Material Lab';
const STORY = 'material-lab--regular';

test.beforeAll(async ({ playwright }) => beforeAllFresh(playwright));

test('Material Lab: light-angle and thickness controls round-trip, reset restores shipped', async ({ page }) => {
  const errors = collectErrors(page);
  expect(storiesTagged('lab', LAB_TITLE).map((e) => e.id)).toContain(STORY);
  await openStory(page, STORY);

  const angle = page.getByRole('slider', { name: /light angle/i });
  // The inline `--ag-light-angle` on the Lab subtree ('' when the subtree carries the shipped default).
  const readAngle = () => page.evaluate(() => {
    const el = Array.from(document.querySelectorAll<HTMLElement>('[data-ag-story-content] [style]'))
      .find((n) => n.style.getPropertyValue('--ag-light-angle') !== '');
    return el ? el.style.getPropertyValue('--ag-light-angle').trim() : '';
  });
  await expect(angle).toBeVisible();
  const shipped = await angle.getAttribute('aria-valuenow');
  expect(shipped).not.toBeNull();

  await angle.focus();
  await angle.press('PageUp');
  await expect(angle).not.toHaveAttribute('aria-valuenow', shipped!);
  const moved = await angle.getAttribute('aria-valuenow');
  await expect.poll(readAngle).toBe(`${moved}deg`);
  await angle.press('PageDown');
  await expect(angle).toHaveAttribute('aria-valuenow', shipped!);
  await expect.poll(readAngle).toMatch(new RegExp(`^(${shipped}deg)?$`));

  const surface = page.locator('[data-ag-story-content] [data-ag-surface]').first();
  const thickness = page.getByRole('radiogroup', { name: /thickness/i });
  const initial = await surface.getAttribute('data-ag-thickness');
  expect(initial).not.toBeNull();
  const other = thickness.getByRole('radio', { checked: false }).first();
  const otherValue = ((await other.getAttribute('value')) ?? (await other.textContent()) ?? '').trim().toLowerCase();
  expect(otherValue).not.toBe(initial);
  await other.click();
  await expect(surface).toHaveAttribute('data-ag-thickness', otherValue);
  await thickness.getByRole('radio', { name: new RegExp(`^${initial}$`, 'i') }).click();
  await expect(surface).toHaveAttribute('data-ag-thickness', initial!);

  await angle.press('PageUp');
  await page.getByRole('button', { name: 'Reset to shipped' }).click();
  await expect(angle).toHaveAttribute('aria-valuenow', shipped!);
  const privateOverrides = await page.locator('[data-ag-lab-override]').evaluateAll((els) =>
    els.flatMap((el) => Array.from((el as HTMLElement).style).filter((p) => p.startsWith('--_ag-'))));
  expect(privateOverrides).toEqual([]);
  await expect(page.getByText('Spec deviation — not shipped')).toHaveCount(0);

  expect(errors).toEqual([]);
});
