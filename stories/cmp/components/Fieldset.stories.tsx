import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { Fieldset } from '../../../src/components/field';
import type { StoryAgParameters } from '../../../src/contracts/testing';

const sbMeta = {
  title: 'Flagships/Controls/Fieldset',
  component: Fieldset,
  tags: ['certified', 'flagship'],
  parameters: { ag: { tier: 'standard', subject: 'Fieldset', kind: 'component' } },
} satisfies Meta<typeof Fieldset>;
export default sbMeta;
type Story = StoryObj<typeof sbMeta>;

export const Default: Story = {
  render: () => (
    <Fieldset legend="Notifications">
      <input type="checkbox" aria-label="email" />
      <input type="checkbox" aria-label="sms" />
    </Fieldset>
  ),
};
