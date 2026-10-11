import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { InlineEdit } from '../../../src/components/inline-edit';
import type { StoryAgParameters } from '../../../src/contracts/testing';

const sbMeta = {
  title: 'Core/InlineEdit',
  component: InlineEdit,
  tags: ['certified'],
  parameters: { ag: { tier: 'standard', subject: 'InlineEdit', kind: 'component' } },
} satisfies Meta<typeof InlineEdit>;
export default sbMeta;
type Story = StoryObj<typeof sbMeta>;

export const Default: Story = {
  parameters: { ag: { tier: 'standard', subject: 'InlineEdit', id: 'core-inline-edit--default' } },
  render: () => (
    <InlineEdit defaultValue="Click to edit" />
  ),
};

export const Editing: Story = {
  parameters: { ag: { tier: 'standard', subject: 'InlineEdit', id: 'core-inline-edit--editing' } },
  render: () => (
    <InlineEdit editing defaultValue="Editing" />
  ),
};

