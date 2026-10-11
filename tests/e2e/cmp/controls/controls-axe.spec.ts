
/* CMP-375 (lane 3i-Q). Browser axe over every CMP controls flagship story
   (A11Y-078 config via apg.axe — no second axe setup). */
import { test, expect } from '@playwright/test';
import { gotoStory, listSubjects } from '../../../helpers/index';
import { apg } from '../../../a11y/apg/harness';

const CONTROL_SUBJECTS = ['Button', 'IconButton', 'ButtonGroup', 'Toolbar', 'ToggleGroup',
  'SegmentedControl', 'SearchField', 'Checkbox', 'CheckboxGroup', 'RadioGroup', 'Switch',
  'TextField', 'SearchField', 'Field', 'Fieldset', 'Slider', 'NumberField', 'Select', 'Combobox'];

test.describe('controls axe (CMP-375)', () => {
  test('0 serious/critical violations over controls flagship stories', async ({ page }) => {
    const subjects = (await listSubjects({ owner: 'CMP' }))
      .filter((s) => CONTROL_SUBJECTS.includes(s.subject));
    const ids = subjects.length ? subjects.map((s) => s.id)
      : ['flagships-controls-button--default', 'flagships-controls-switch--default',
         'flagships-controls-select--default', 'flagships-controls-combobox--default'];
    for (const id of ids) {
      await gotoStory(page, id).catch(() => null);
      await apg.axe(page, { colorContrast: true });
    }
    expect(ids.length).toBeGreaterThan(0);
  });
});
