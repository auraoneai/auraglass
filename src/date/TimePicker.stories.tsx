import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { Time } from '@internationalized/date';
import { TimePicker } from './TimePicker';

const meta = {
  title: 'surf/time-picker',
  parameters: { ag: { subject: 'TimePicker', kind: 'component' } },
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <TimePicker label="Start time" defaultValue={new Time(9, 30)} minuteStep={15} />,
};
export const Open: Story = {
  render: () => <TimePicker label="Start time" defaultValue={new Time(9, 30)} minuteStep={15} defaultOpen />,
};
