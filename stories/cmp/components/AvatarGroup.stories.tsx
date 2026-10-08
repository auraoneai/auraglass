import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { AvatarGroup } from '../../../src/components/avatar';
import type { StoryAgParameters } from '../../../src/contracts/testing';

const meta = {
  title: 'Core/AvatarGroup',
  component: AvatarGroup,
  tags: ['core'],
  parameters: { ag: { subject: 'AvatarGroup', kind: 'component' } satisfies StoryAgParameters },
} satisfies Meta<typeof AvatarGroup>;
export default meta;
type Story = StoryObj<typeof meta>;

const face = (n: string) => (
  <span key={n} style={{ display: 'inline-block', width: 24, height: 24, borderRadius: '50%', background: '#789' }}>
    {n}
  </span>
);

export const Default: Story = {
  render: () => <AvatarGroup max={3}>{['A', 'B', 'C', 'D', 'E'].map(face)}</AvatarGroup>,
};
export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 16 }}>
      <AvatarGroup size="sm">{['A', 'B'].map(face)}</AvatarGroup>
      <AvatarGroup size="md">{['A', 'B'].map(face)}</AvatarGroup>
      <AvatarGroup size="lg">{['A', 'B'].map(face)}</AvatarGroup>
    </div>
  ),
};
