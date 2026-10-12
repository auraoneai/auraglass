/* REQ-CMP-13: no element carrying data-ag-surface ever takes opacity < 1 when
   disabled; --ag-state-disabled-alpha dims inner content only. jsdom does not
   cascade the component sheets, so this collects every disabled-dimming
   selector from the control CSS and checks, on the rendered disabled DOM,
   that none of them matches a [data-ag-surface] element while the inner
   content parts are still matched (the dimming did not disappear). */
import { describe, expect, it } from '@jest/globals';
import { render } from '@testing-library/react';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import postcss from 'postcss';
import * as React from 'react';
import { Switch } from '../../../src/components/switch';
import { TextField } from '../../../src/components/text-field';
import { SearchField } from '../../../src/components/search-field';
import { NumberField } from '../../../src/components/number-field';
import { Select } from '../../../src/components/select';
import { Checkbox } from '../../../src/components/checkbox';
import { Field } from '../../../src/components/field';

const ROOT = join(__dirname, '../../..');
const SHEETS = [
  'switch/Switch', 'text-field/TextField', 'search-field/SearchField', 'number-field/NumberField',
  'select/Select', 'checkbox/Checkbox', 'field/Field',
];

/** Selectors of rules that set opacity: var(--ag-state-disabled-alpha) under a [data-disabled] host. */
function dimmingSelectors(): string[] {
  const out: string[] = [];
  for (const s of SHEETS) {
    postcss.parse(readFileSync(join(ROOT, `src/components/${s}.css`), 'utf8')).walkRules((r) => {
      const dims = r.nodes.some((n) => n.type === 'decl' && n.prop === 'opacity' && n.value.includes('--ag-state-disabled-alpha'));
      if (!dims) return;
      for (const sel of r.selectors) if (sel.includes('[data-disabled]') && sel.includes('[data-ag-part')) out.push(sel);
    });
  }
  return out;
}

const SELECTORS = dimmingSelectors();
const dimmed = (el: Element) => SELECTORS.some((s) => el.matches(s));

const CASES: [string, React.ReactElement][] = [
  ['Switch', <Switch key="s" aria-label="sw" disabled />],
  ['TextField', <TextField key="t" label="Name" disabled />],
  ['SearchField', <SearchField key="sf" label="Search" disabled />],
  ['NumberField', <NumberField key="n" label="Qty" defaultValue={1} disabled />],
  ['Select', (
    <Select.Root key="sel" disabled>
      <Select.Trigger placeholder="Pick" />
      <Select.Content><Select.Item value="a" label="A" /></Select.Content>
    </Select.Root>
  )],
  ['Field', (
    <Field.Root key="f" disabled>
      <Field.Label>Fruit</Field.Label>
      <Select.Root disabled>
        <Select.Trigger placeholder="Pick" />
        <Select.Content><Select.Item value="a" label="A" /></Select.Content>
      </Select.Root>
    </Field.Root>
  )],
];

describe('REQ-CMP-13 disabled dimming never lands on a surface', () => {
  it('collects the disabled-dimming selectors from every control sheet', () => {
    expect(SELECTORS.length).toBeGreaterThanOrEqual(SHEETS.length);
  });

  it.each(CASES)('%s: no [data-ag-surface] is dimmed; inner content is', (_name, ui) => {
    const { container } = render(ui);
    const surfaces = [...container.querySelectorAll('[data-ag-surface]')];
    expect(surfaces.length).toBeGreaterThan(0);
    expect(surfaces.filter(dimmed).map((el) => el.getAttribute('data-ag-part'))).toEqual([]);
    const content = [...container.querySelectorAll('[data-ag-part]:not([data-ag-surface])')].filter(dimmed);
    expect(content.length).toBeGreaterThan(0);
  });

  it('NumberField: a disabled stepper keeps opacity 1 and dims its glyph only', () => {
    const { container } = render(<NumberField label="Qty" defaultValue={0} min={0} />);
    const dec = container.querySelector<HTMLElement>('[data-ag-part="decrement"]')!;
    expect(dec.hasAttribute('data-disabled')).toBe(true);
    expect(dimmed(dec)).toBe(false);
    const glyph = [...dec.children].find((c) => c.getAttribute('data-ag-part') !== 'hit-area')!;
    expect(SELECTORS.some((s) => glyph.matches(s))).toBe(true);
  });

  it('Checkbox (no surface parts): the indicator is still dimmed', () => {
    const { container } = render(<Checkbox aria-label="cb" disabled />);
    expect(dimmed(container.querySelector('[data-ag-part="indicator"]')!)).toBe(true);
  });
});
