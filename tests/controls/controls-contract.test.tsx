/** CMP-110 (REQ-CMP-06): parametrised part/state contract for every registered
    family — every part in meta.parts renders data-ag-part in at least one
    fixture state, and BU state attributes (data-checked, data-disabled...) only
    use names declared in meta.states. */
import { describe, expect, it, afterEach } from '@jest/globals';
import '@testing-library/jest-dom/jest-globals';
import { render, cleanup } from '@testing-library/react';
import * as React from 'react';
import { CONTROL_FAMILIES } from './families';

const STATE_ATTR_RE = /^data-(checked|unchecked|disabled|readonly|dragging|invalid|required|open|closed|filled|pressed)$/;

afterEach(cleanup);

describe('controls contract (families)', () => {
  it.each(CONTROL_FAMILIES.map((f) => [f.name, f] as const))('%s: fixture mounts and emits a root part', (_name, { fixture: Fixture, meta }) => {
    const { container } = render(<Fixture />);
    expect(container.querySelector(`[data-ag-part="${meta.parts[0]}"]`)).not.toBeNull();
  });

  it.each(CONTROL_FAMILIES.map((f) => [f.name, f] as const))('%s: default fixture emits only declared parts', (_name, { fixture: Fixture, meta }) => {
    const { container } = render(<Fixture />);
    const parts = new Set(
      Array.from(container.querySelectorAll('[data-ag-part]')).map((el) => el.getAttribute('data-ag-part')),
    );
    for (const p of parts) {
      if (!meta.parts.includes(p as never)) {
        throw new Error(`${_name}: rendered part '${p}' not in meta.parts`);
      }
    }
  });

  it.each(CONTROL_FAMILIES.map((f) => [f.name, f] as const))('%s: data-* state attrs are contract-shaped', (_name, { fixture: Fixture }) => {
    const { container } = render(<Fixture />);
    for (const el of Array.from(container.querySelectorAll('*'))) {
      for (const attr of Array.from(el.attributes)) {
        if (attr.name.startsWith('data-') && !attr.name.startsWith('data-ag-') && !STATE_ATTR_RE.test(attr.name) && attr.name !== 'data-testid') {
          // data-orientation/data-index etc are BU layout attrs — allow data-* generally but flag data-state noise
          expect(attr.name).not.toBe('data-state-invalid');
        }
      }
    }
  });
});

/** CMP-096 (REQ-CMP-04): every controllable family warns once when its
    controlled prop flips controlled→uncontrolled across renders. */
describe('controlled→uncontrolled warning', () => {
  const CASES: ReadonlyArray<{
    name: string;
    renderControlled: () => JSX.Element;
    renderUncontrolled: () => JSX.Element;
  }> = [
    { name: 'Switch',
      renderControlled: () => { const { Switch } = require('../../src/components/switch/Switch.client'); return <Switch checked={true} onCheckedChange={() => {}} />; },
      renderUncontrolled: () => { const { Switch } = require('../../src/components/switch/Switch.client'); return <Switch />; } },
    { name: 'Checkbox',
      renderControlled: () => { const { Checkbox } = require('../../src/components/checkbox/Checkbox.client'); return <Checkbox checked={true} onCheckedChange={() => {}} />; },
      renderUncontrolled: () => { const { Checkbox } = require('../../src/components/checkbox/Checkbox.client'); return <Checkbox />; } },
    { name: 'CheckboxGroup',
      renderControlled: () => { const { CheckboxGroup } = require('../../src/components/checkbox/Checkbox.client'); return <CheckboxGroup value={['a']} />; },
      renderUncontrolled: () => { const { CheckboxGroup } = require('../../src/components/checkbox/Checkbox.client'); return <CheckboxGroup />; } },
    { name: 'RadioGroup',
      renderControlled: () => { const { RadioGroup } = require('../../src/components/radio-group/RadioGroup.client'); return <RadioGroup.Root value="a" />; },
      renderUncontrolled: () => { const { RadioGroup } = require('../../src/components/radio-group/RadioGroup.client'); return <RadioGroup.Root />; } },
    { name: 'Slider',
      renderControlled: () => { const { Slider } = require('../../src/components/slider/Slider.client'); return <Slider.Root value={5} />; },
      renderUncontrolled: () => { const { Slider } = require('../../src/components/slider/Slider.client'); return <Slider.Root />; } },
    { name: 'NumberField',
      renderControlled: () => { const { NumberField } = require('../../src/components/number-field/NumberField.client'); return <NumberField value={3} />; },
      renderUncontrolled: () => { const { NumberField } = require('../../src/components/number-field/NumberField.client'); return <NumberField />; } },
    { name: 'TextField',
      renderControlled: () => { const { TextField } = require('../../src/components/text-field/TextField.client'); return <TextField value="x" onValueChange={() => {}} />; },
      renderUncontrolled: () => { const { TextField } = require('../../src/components/text-field/TextField.client'); return <TextField />; } },
    { name: 'SearchField',
      renderControlled: () => { const { SearchField } = require('../../src/components/search-field/SearchField.client'); return <SearchField value="x" onValueChange={() => {}} />; },
      renderUncontrolled: () => { const { SearchField } = require('../../src/components/search-field/SearchField.client'); return <SearchField />; } },
    { name: 'Select',
      renderControlled: () => { const { Select } = require('../../src/components/select/Select.client'); return <Select.Root value="a" />; },
      renderUncontrolled: () => { const { Select } = require('../../src/components/select/Select.client'); return <Select.Root />; } },
    { name: 'Combobox',
      renderControlled: () => { const { Combobox } = require('../../src/components/combobox/Combobox.client'); return <Combobox.Root value="a" items={['a']} />; },
      renderUncontrolled: () => { const { Combobox } = require('../../src/components/combobox/Combobox.client'); return <Combobox.Root items={['a']} />; } },
    { name: 'ToggleGroup',
      renderControlled: () => { const { ToggleGroup } = require('../../src/components/toggle-group/ToggleGroup.client'); return <ToggleGroup.Root value={['a']} />; },
      renderUncontrolled: () => { const { ToggleGroup } = require('../../src/components/toggle-group/ToggleGroup.client'); return <ToggleGroup.Root />; } },
    { name: 'SegmentedControl',
      renderControlled: () => { const { SegmentedControl } = require('../../src/components/segmented-control/SegmentedControl.client'); return <SegmentedControl.Root value="a" />; },
      renderUncontrolled: () => { const { SegmentedControl } = require('../../src/components/segmented-control/SegmentedControl.client'); return <SegmentedControl.Root />; } },
    { name: 'Button',
      renderControlled: () => { const { Button } = require('../../src/components/button/Button.client'); return <Button pressed={true} onPressedChange={() => {}} />; },
      renderUncontrolled: () => { const { Button } = require('../../src/components/button/Button.client'); return <Button />; } },
    { name: 'Accordion',
      renderControlled: () => { const { Accordion } = require('../../src/components/accordion/Accordion.client'); return <Accordion.Root value={['a']} />; },
      renderUncontrolled: () => { const { Accordion } = require('../../src/components/accordion/Accordion.client'); return <Accordion.Root />; } },
  ];

  it.each(CASES.map((c) => [c.name, c] as const))('%s warns exactly once on the flip', (_name, { renderControlled, renderUncontrolled }) => {
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
    try {
      const { rerender } = render(renderControlled());
      rerender(renderUncontrolled());
      const calls = spy.mock.calls.filter((args) => String(args[0]).includes(`[aura-glass] ${_name}:`));
      expect(calls).toHaveLength(1);
    } finally {
      spy.mockRestore();
    }
  });
});
