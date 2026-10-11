import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { Time } from '@internationalized/date';
import { TimePicker } from './TimePicker';

/* REQ-SURF-104: TimePicker subject — 24h default story, 12h with AM/PM.
   TimeField lives in TimeField.stories.tsx (S-31). */
const meta = {
  title: 'surf/time-picker',
  parameters: { ag: { subject: 'TimePicker', kind: 'component' } },
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <TimePicker label="Start time" locale="en-GB" hourCycle={24} defaultValue={new Time(9, 30)} minuteStep={15} />,
};
export const TwelveHour: Story = {
  render: () => <TimePicker label="Start time" locale="en-US" hourCycle={12} defaultValue={new Time(9, 30)} minuteStep={15} />,
};
export const Open: Story = {
  render: () => <TimePicker label="Start time" locale="en-GB" hourCycle={24} defaultValue={new Time(9, 30)} minuteStep={15} defaultOpen />,
};
