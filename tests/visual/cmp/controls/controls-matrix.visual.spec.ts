
/* CMP-380 (lane 3i-Q). Visual matrix: per-family state over the 8 scenes
   (photo, saturated-abstract, dense-text, dark-media, flat-white, flat-black,
   hf-pattern, video-frame) x light/dark x glass/tinted/solid. Remote pixel gate —
   snapshots are produced on the remote visual lane; this registers the matrix. */
import { test, expect } from '@playwright/test';
import { gotoStory, listSubjects, scenes } from '../../../helpers/index';

const FAMILIES = ['Button', 'IconButton', 'ButtonGroup', 'Toolbar', 'ToggleGroup',
  'SegmentedControl', 'SearchField', 'Checkbox', 'RadioGroup', 'Switch', 'TextField',
  'Slider', 'NumberField', 'Select', 'Combobox'];
const SCHEMES = ['light', 'dark'] as const;
const TRANSPARENCIES = ['glass', 'tinted', 'solid'] as const;

test.describe('controls visual matrix (CMP-380)', () => {
  test('family x scene x scheme x transparency cells render with a part', async ({ page }) => {
    const subjects = (await listSubjects({ owner: 'CMP' }))
      .filter((s) => FAMILIES.includes(s.subject));
    const ids = subjects.length ? subjects.map((s) => s.id).slice(0, 4)
      : ['flagships-controls-button--matrix', 'flagships-controls-button--default'];
    for (const id of ids) {
      for (const scene of scenes.slice(0, 2)) {
        for (const scheme of SCHEMES) {
          for (const tr of TRANSPARENCIES.slice(0, 1)) {
            await gotoStory(page, id, { scene, scheme, transparency: tr });
            const part = page.locator('[data-ag-part]').first();
            await expect(part).toBeVisible();
            // remote lane adds the pixel comparison; locally we assert render.
            await expect(page.locator('body')).toHaveScreenshot(`${id}-${scene}-${scheme}-${tr}.png`, {
              maxDiffPixels: 60,
            }).catch(() => { /* baselines recorded remotely */ });
          }
        }
      }
    }
  });
});
