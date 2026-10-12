import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { Time } from '@internationalized/date';
import { TimePicker } from './TimePicker';

/* REQ-SURF-104: TimePicker subject — 24h default story, 12h with AM/PM.
   TimeField lives in TimeField.stories.tsx (S-31). Flagship #14 (Controls).
   `id` keeps the published story ids (surf-time-picker--*). */
const meta = {
  title: 'Flagships/Controls/TimePicker',
  id: 'surf-time-picker',
  parameters: { ag: { subject: 'TimePicker', kind: 'component' } },
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

/* The APG subject: "Start time", 09:30, 24h, minuteStep 15. */
const StartTime = ({ defaultOpen }: { defaultOpen?: boolean }) => (
  <TimePicker label="Start time" locale="en-GB" hourCycle={24} defaultValue={new Time(9, 30)} minuteStep={15} defaultOpen={defaultOpen} />
);

export const Default: Story = { render: () => <StartTime /> };
export const TwelveHour: Story = {
  render: () => <TimePicker label="Start time" locale="en-US" hourCycle={12} defaultValue={new Time(9, 30)} minuteStep={15} />,
};
export const Open: Story = { render: () => <StartTime defaultOpen /> };

export const Playground: StoryObj<typeof TimePicker> = {
  args: { label: 'Start time', locale: 'en-GB', hourCycle: 24, minuteStep: 15, isDisabled: false, isInvalid: false },
  argTypes: { hourCycle: { control: 'inline-radio', options: [12, 24] }, minuteStep: { control: 'select', options: [1, 5, 10, 15, 30] } },
  render: (args) => <TimePicker {...args} defaultValue={new Time(9, 30)} />,
};

/* meta.states: open is the Open story; invalid and disabled side by side. */
export const States: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 'var(--ag-space-4)', maxInlineSize: '24rem' }}>
      <TimePicker label="Invalid" locale="en-GB" hourCycle={24} defaultValue={new Time(23, 45)} minuteStep={15} isInvalid errorMessage="Pick a time within office hours" />
      <TimePicker label="Disabled" locale="en-GB" hourCycle={24} defaultValue={new Time(9, 30)} minuteStep={15} isDisabled />
    </div>
  ),
};

/* tests/a11y/apg/surf/time-picker.apg.spec.ts runs the dialog/listbox keyboard script on this story. */
export const Keyboard: Story = { tags: ['apg'], render: () => <StartTime /> };
