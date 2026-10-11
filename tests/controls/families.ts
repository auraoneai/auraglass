/** Control family registry (CMP-109): every flagship control family registers
    { name, meta, fixture, toggleProps } for the parametrised suites. */
import * as React from 'react';
import type { ComponentMeta } from '../../src/contracts/components';
import { ButtonFixture } from './fixtures/button';
import { CheckboxFixture } from './fixtures/checkbox';
import { SwitchFixture } from './fixtures/switch';
import { RadioGroupFixture } from './fixtures/radio-group';
import { TextFieldFixture } from './fixtures/text-field';
import { SearchFieldFixture } from './fixtures/search-field';
import { NumberFieldFixture } from './fixtures/number-field';
import { SliderFixture } from './fixtures/slider';
import { FieldFixture } from './fixtures/field';
import { SelectFixture } from './fixtures/select';
import { ComboboxFixture } from './fixtures/combobox';
import buttonMeta from '../../src/components/button/Button.meta';
import checkboxMeta from '../../src/components/checkbox/Checkbox.meta';
import comboboxMeta from '../../src/components/combobox/Combobox.meta';
import switchMeta from '../../src/components/switch/Switch.meta';
import radioGroupMeta from '../../src/components/radio-group/RadioGroup.meta';
import textFieldMeta from '../../src/components/text-field/TextField.meta';
import searchFieldMeta from '../../src/components/search-field/SearchField.meta';
import numberFieldMeta from '../../src/components/number-field/NumberField.meta';
import sliderMeta from '../../src/components/slider/Slider.meta';
import fieldMeta from '../../src/components/field/Field.meta';
import selectMeta from '../../src/components/select/Select.meta';

export interface FamilyRegistration {
  /** Meta name (ComponentMeta.name). */
  name: string;
  family: string;
  meta: ComponentMeta;
  fixture: React.ComponentType;
  /** Props the hooks suite toggles across 6 rerenders (CMP-111). */
  toggleProps: readonly string[];
}

export const CONTROL_FAMILIES: readonly FamilyRegistration[] = [
  { name: 'Button', family: 'button', meta: buttonMeta, fixture: ButtonFixture, toggleProps: ['disabled', 'loading'] },
  { name: 'Checkbox', family: 'checkbox', meta: checkboxMeta, fixture: CheckboxFixture, toggleProps: ['disabled', 'indeterminate', 'checked'] },
  { name: 'Switch', family: 'switch', meta: switchMeta, fixture: SwitchFixture, toggleProps: ['disabled', 'checked'] },
  { name: 'RadioGroup', family: 'radio-group', meta: radioGroupMeta, fixture: RadioGroupFixture, toggleProps: ['disabled', 'value'] },
  { name: 'TextField', family: 'text-field', meta: textFieldMeta, fixture: TextFieldFixture, toggleProps: ['error', 'description', 'label', 'disabled'] },
  { name: 'SearchField', family: 'search-field', meta: searchFieldMeta, fixture: SearchFieldFixture, toggleProps: ['error', 'description', 'loading', 'disabled'] },
  { name: 'NumberField', family: 'number-field', meta: numberFieldMeta, fixture: NumberFieldFixture, toggleProps: ['error', 'description', 'disabled'] },
  { name: 'Slider', family: 'slider', meta: sliderMeta, fixture: SliderFixture, toggleProps: ['disabled', 'value'] },
  { name: 'Field', family: 'field', meta: fieldMeta, fixture: FieldFixture, toggleProps: ['invalid', 'disabled'] },
  { name: 'Select', family: 'select', meta: selectMeta, fixture: SelectFixture, toggleProps: ['disabled', 'multiple', 'value'] },
  { name: 'Combobox', family: 'combobox', meta: comboboxMeta, fixture: ComboboxFixture, toggleProps: ['disabled', 'loading', 'value'] },
];
