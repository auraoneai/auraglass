/* CMP-111 dense-form story: flagship controls at compact density. */
import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { TextField } from '../../../src/components/text-field';
import { SearchField } from '../../../src/components/search-field';
import { NumberField } from '../../../src/components/number-field';
import { Checkbox, CheckboxGroup } from '../../../src/components/checkbox';
import { RadioGroup, Radio } from '../../../src/components/radio-group';
import { Switch } from '../../../src/components/switch';
import { Field, Fieldset } from '../../../src/components/field';
import type { StoryAgParameters } from '../../../src/contracts/testing';

const sbMeta = {
  title: 'Flagships/Controls/DenseForm',
  tags: ['certified', 'flagship'],
  parameters: { ag: { tier: 'standard', subject: 'ControlsDenseForm', kind: 'scene' } satisfies StoryAgParameters },
} satisfies Meta;
export default sbMeta;
type Story = StoryObj<typeof sbMeta>;

export const Default: Story = {
  render: () => (
    <div data-ag-density="compact" style={{ display: 'grid', gap: '0.75rem', maxWidth: '24rem' }}>
      <Fieldset.Root legend="Account">
        <Field.Root>
          <Field.Label>Name</Field.Label>
          <Field.Control render={<input aria-label="name" />} />
        </Field.Root>
        <TextField size="sm" label="Email" type="email" defaultValue="a@b.co" />
        <NumberField size="sm" label="Seats" defaultValue={2} min={0} max={20} />
        <SearchField size="sm" label="Search" defaultValue="x" />
        <RadioGroup.Root size="sm" defaultValue="m" aria-label="billing">
          <Radio value="m">Monthly</Radio>
          <Radio value="y">Yearly</Radio>
        </RadioGroup.Root>
        <CheckboxGroup defaultValue={['t']}>
          <Checkbox size="sm" value="t">Terms</Checkbox>
        </CheckboxGroup>
        <Switch size="sm" aria-label="Notifications" defaultChecked />
      </Fieldset.Root>
    </div>
  ),
};
