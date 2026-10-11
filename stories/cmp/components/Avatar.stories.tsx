import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Avatar } from '../../../src/components/avatar';
import type { StoryAgParameters } from '../../../src/contracts/testing';

const sbMeta = {
  title: 'Core/Avatar',
  component: Avatar.Root,
  tags: ['certified'],
  parameters: { ag: { tier: 'standard', subject: 'Avatar', kind: 'component' } },
} satisfies Meta<typeof Avatar.Root>;
export default sbMeta;
type Story = StoryObj<typeof sbMeta>;

export const Default: Story = {
  parameters: { ag: { tier: 'standard', subject: 'Avatar', id: 'core-avatar--default' } },
  render: () => (
    <Avatar.Root name="Ada Lovelace" />
  ),
};

export const Image: Story = {
  parameters: { ag: { tier: 'standard', subject: 'Avatar', id: 'core-avatar--image' } },
  render: () => (
    <Avatar.Root src="https://example.invalid/a.png" alt="Ada Lovelace" name="Ada Lovelace" />
  ),
};

export const Sizes: Story = {
  parameters: { ag: { tier: 'standard', subject: 'Avatar', id: 'core-avatar--sizes' } },
  render: () => (
    <div>
      <Avatar.Root size="sm" name="S M" /><Avatar.Root size="md" name="M D" /><Avatar.Root size="lg" name="L G" />
    </div>
  ),
};

