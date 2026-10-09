import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { Timeline } from '../../../src/components/timeline/Timeline';

const meta = {
  title: 'CMP/Timeline',
  component: Timeline,
  parameters: { ag: { subject: 'Timeline', kind: 'component' } },
} satisfies Meta<typeof Timeline>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    items: [
      { id: '1', timestamp: '2026-01-01T10:00:00Z', title: 'Created', description: 'Initial revision', meta: 'ci' },
      { id: '2', timestamp: '2026-01-02T10:00:00Z', title: 'Updated' },
    ],
  },
};
