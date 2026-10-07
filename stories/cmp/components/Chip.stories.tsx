import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { Chip } from '../../../src/components/chip';
import type { StoryAgParameters } from '../../../src/contracts/testing';

const meta = {
  title: 'Core/Chip',
  component: Chip,
  tags: ['core'],
  parameters: { ag: { subject: 'Chip', kind: 'component' } },
} satisfies Meta<typeof Chip>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <Chip>Filter</Chip>,
};
export const WithIcons: Story = {
  render: () => (
    <Chip
      leadingIcon={<svg width="12" height="12" aria-hidden="true" />}
      trailingIcon={<svg width="12" height="12" aria-hidden="true" />}
    >
      Tagged
    </Chip>
  ),
};
export const States: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 8 }}>
      <Chip pressed>Pressed</Chip>
      <Chip disabled>Disabled</Chip>
    </div>
  ),
};
