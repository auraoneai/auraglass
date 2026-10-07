/* MAT-170 — every Material Lab story id into the browser axe spec
   (@axe-core/playwright, color-contrast enabled, no rules disabled, no
   elements excluded). Runs on all 3 engine projects. */
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { gotoMaterialStory } from '../../material/helpers/story';

const STORY_IDS = [
  'material-lab--overview',
  'material-lab--regular',
  'material-lab--clear',
  'material-lab--identity',
  'material-lab--content-raised',
  'material-lab--content-sunken',
  'material-lab--tiers',
  'material-lab--nesting-and-groups',
  'material-lab--shape-and-concentricity',
  'material-lab--scroll-edge',
  'material-lab--preferences',
  'material-lab--motion',
  'material-lab-matrix--matrix',
  'material-optics--blur-ladder',
  'material-optics--rim',
  'material-optics--specular',
] as const;

test.describe('material lab axe', () => {
  for (const id of STORY_IDS) {
    test(`${id}: 0 violations`, async ({ page }) => {
      await gotoMaterialStory(page, id);
      const res = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa'])
        .analyze();
      expect(res.violations).toEqual([]);
    });
  }
});
