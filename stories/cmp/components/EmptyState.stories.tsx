import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { EmptyState } from '../../../src/components/state-view';
import type { StoryAgParameters } from '../../../src/contracts/testing';

const meta = {
  title: 'Core/EmptyState',
  component: EmptyState,
  tags: ['core'],
  parameters: { ag: { subject: 'EmptyState', kind: 'component' } },
} satisfies Meta<typeof EmptyState>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { title: 'Nothing here yet' },
  render: (args) => (
    <EmptyState
      {...args}
      description="Create a record to populate this surface."
      icon={<svg width="24" height="24" aria-hidden="true" />}
      actions={<><button type="button">Create record</button><button type="button">Import data</button></>}
    />
  ),
};
export const WithoutActions: Story = {
  args: { title: 'No matches', description: 'Adjust the current filters.' },
};
