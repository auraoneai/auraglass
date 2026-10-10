/* REQ-QUAL-57 S1-6 mobile-productivity (REQ-QUAL-58): the primary task — open the quick-add Sheet from the tab-bar
   accessory, change its detent from the keyboard handle (each step announces the new detent and grows the sheet,
   the third wraps back), then save the task. Runs at the showcase's 390×844 viewport. */
import { beforeAllFresh, collectErrors, expect, openStory, test } from './_storybook';

const STORY = 'showcases-mobile-productivity--full-page';
const DETENT_LABELS = ['Peek', 'Form', 'Full screen'];

test.use({ viewport: { width: 390, height: 844 }, hasTouch: true });
test.beforeAll(async ({ playwright }) => beforeAllFresh(playwright));

test('S1-6 mobile-productivity: sheet detent change → save', async ({ page }) => {
  const errors = collectErrors(page);
  await openStory(page, STORY);

  await page.getByRole('button', { name: 'New task' }).click();
  const popup = page.locator('[data-ag-part="popup"][data-state="open"]');
  await expect(popup).toBeVisible();
  await expect(popup.getByRole('heading', { name: 'New task' })).toBeVisible();

  const handle = popup.getByRole('separator', { name: 'Resize new task sheet' });
  const live = popup.locator('[data-ag-part="detent-live"]');
  const settledHeight = async () => {
    let last = -1;
    await expect.poll(async () => {
      const h = Math.round((await popup.boundingBox())?.height ?? 0);
      const stable = h === last;
      last = h;
      return stable && h > 0;
    }, { intervals: [100, 100, 200, 200, 400] }).toBe(true);
    return last;
  };

  // Enter cycles to the next taller detent and wraps from the tallest to the shortest (SheetHandle keyboard).
  // Three presses from the default detent (Peek) visit every detent once and come back to Peek.
  const visits: Array<{ label: string; height: number }> = [{ label: 'Peek', height: await settledHeight() }];
  await handle.focus();
  for (let i = 0; i < 3; i++) {
    const previous = visits[visits.length - 1]!.label;
    await handle.press('Enter');
    await expect(live).toHaveText(new RegExp(`^(?!${previous}$)\\S.*$`)); // announced, and a different detent
    const label = (await live.textContent())!.trim();
    expect(DETENT_LABELS).toContain(label);
    visits.push({ label, height: await settledHeight() });
  }
  expect(visits[3]!.label).toBe('Peek');
  expect(new Set(visits.slice(1).map((v) => v.label))).toEqual(new Set(DETENT_LABELS));
  const steps = visits.slice(1).map((v, i) => Math.sign(v.height - visits[i]!.height));
  expect(steps.filter((d) => d < 0)).toHaveLength(1); // exactly one wrap
  expect(steps.filter((d) => d === 0)).toHaveLength(0); // every detent change moves the sheet
  const tallest = visits.reduce((a, b) => (b.height > a.height ? b : a));
  expect(tallest.label).toBe('Full screen');
  await expect(handle).toBeFocused();

  await popup.getByRole('button', { name: 'Save task' }).click();
  await expect(popup).toBeHidden();
  await expect(page.getByText('Task saved', { exact: true })).toBeVisible();

  expect(errors).toEqual([]);
});
