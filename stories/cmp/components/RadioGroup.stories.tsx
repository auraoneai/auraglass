import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { RadioGroup } from '../../../src/components/radio-group';
import type { StoryAgParameters } from '../../../src/contracts/testing';

const sbMeta = {
  title: 'Flagships/Controls/RadioGroup',
  component: RadioGroup.Root,
  tags: ['certified', 'flagship'],
  parameters: { ag: { tier: 'standard', subject: 'RadioGroup', kind: 'component' } },
} satisfies Meta<typeof RadioGroup.Root>;
export default sbMeta;
type Story = StoryObj<typeof sbMeta>;

export const Default: Story = {
  render: () => (
    <RadioGroup.Root defaultValue="a" aria-label="plan">
      <RadioGroup.Item value="a">Annual</RadioGroup.Item>
      <RadioGroup.Item value="b">Monthly</RadioGroup.Item>
    </RadioGroup.Root>
  ),
};
