import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { ErrorState } from '../../../src/components/state-view';
import type { StoryAgParameters } from '../../../src/contracts/testing';

const meta = {
  title: 'Core/ErrorState',
  component: ErrorState,
  tags: ['core'],
  parameters: { ag: { subject: 'ErrorState', kind: 'component' } satisfies StoryAgParameters },
} satisfies Meta<typeof ErrorState>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { title: 'Something went wrong' },
  render: (args) => (
    <ErrorState
      {...args}
      description="The request could not be completed."
      icon={<svg width="24" height="24" aria-hidden="true" />}
      actions={[{ label: 'Retry' }]}
    />
  ),
};
export const Urgent: Story = {
  args: { title: 'Data loss detected', urgent: true, description: 'Contact support.' },
};
