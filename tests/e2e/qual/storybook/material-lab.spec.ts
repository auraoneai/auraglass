/* REQ-QUAL-53 (REQ-FIN-106, FIN-451): Material Lab Overview at 1440 — five materials × three thicknesses over the
   selected scene, every subject ≥360×240 CSS px; the twelve Lab pages render without console errors.
   Remote only: run against a fresh built Storybook by scripts/storybook/run-flows.mjs (GitLab job
   qual:test:storybook-flows), which serves storybook-static/ and sets AG_STORYBOOK_URL. Runs on the
   determinism fixture and the freshness check of ./_storybook (REQ-QUAL-57). */
import { beforeAllFresh, collectErrors, expect, openStory, test } from './_storybook';

const LAB = ['overview', 'regular', 'clear', 'identity', 'content-raised', 'content-sunken', 'tiers', 'nesting-and-groups',
  'shape-and-concentricity', 'scroll-edge', 'preferences', 'motion'].map((s) => `material-lab--${s}`);

test.beforeAll(async ({ playwright }) => beforeAllFresh(playwright));

test.describe('Material Lab', () => {
  test.use({ viewport: { width: 1440, height: 1800 } });

  test('Overview: 15 subjects (5 materials × 3 thicknesses), each ≥360×240 at 1440', async ({ page }) => {
    const errors = collectErrors(page);
    await openStory(page, LAB[0]!);
    const subjects = page.locator('[data-ag-story-content] [data-ag-part="lab-overview"] > [data-ag-surface]');
    await expect(subjects).toHaveCount(15);
    const boxes = await subjects.evaluateAll((els) => els.map((el) => {
      const r = el.getBoundingClientRect();
      return { material: el.getAttribute('data-ag-content') ?? el.getAttribute('data-ag-variant'), thickness: el.getAttribute('data-ag-thickness'), w: r.width, h: r.height };
    }));
    expect(boxes.filter((b) => b.w < 360 || b.h < 240)).toEqual([]);
    expect(new Set(boxes.map((b) => `${b.material}/${b.thickness}`)).size).toBe(15);
    expect(errors).toEqual([]);
  });

  for (const id of LAB) {
    test(`${id} renders a Lab subject without errors`, async ({ page }) => {
      const errors = collectErrors(page);
      await openStory(page, id);
      await expect(page.locator('[data-ag-story-content][data-ag-story-kind="lab"]')).toHaveCount(1);
      await expect(page.locator('[data-ag-story-content] [data-ag-surface]').first()).toBeVisible();
      expect(errors).toEqual([]);
    });
  }
});
