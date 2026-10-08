import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { LoadingState } from '../../../src/components/state-view';
import type { StoryAgParameters } from '../../../src/contracts/testing';

const meta = {
  title: 'Core/LoadingState',
  component: LoadingState,
  tags: ['core'],
  parameters: { ag: { subject: 'LoadingState', kind: 'component' } satisfies StoryAgParameters },
} satisfies Meta<typeof LoadingState>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <LoadingState
      description="Loading records"
      icon={<svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="8" fill="none" stroke="currentColor" /></svg>}
    />
  ),
};
export const Minimal: Story = {
  render: () => <LoadingState />,
};
