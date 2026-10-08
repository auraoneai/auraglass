import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { Checkbox } from '../../../src/components/checkbox';
import type { StoryAgParameters } from '../../../src/contracts/testing';

const sbMeta = {
  title: 'Flagships/Controls/Checkbox',
  component: Checkbox,
  tags: ['certified', 'flagship'],
  parameters: { ag: { tier: 'standard', subject: 'Checkbox', kind: 'component' } },
} satisfies Meta<typeof Checkbox>;
export default sbMeta;
type Story = StoryObj<typeof sbMeta>;

export const Default: Story = {
  render: () => <Checkbox value="a">Subscribe</Checkbox>,
};

export const Indeterminate: Story = {
  render: () => <Checkbox value="a" indeterminate>All</Checkbox>,
};
