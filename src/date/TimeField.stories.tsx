import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { Time } from '@internationalized/date';
import { TimeField } from './TimePicker';

/* TimeField only; TimePicker lives in TimePicker.stories.tsx (S-31).
   Flagship #14 (Controls). `id` keeps the published story ids (surf-time-field--*). */
const meta = {
  title: 'Flagships/Controls/TimeField',
  id: 'surf-time-field',
  parameters: { ag: { subject: 'TimeField', kind: 'component' } },
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <TimeField label="Reminder" defaultValue={new Time(9, 30)} />,
};

export const Playground: StoryObj<typeof TimeField> = {
  args: { label: 'Reminder', size: 'md', hourCycle: 24, isDisabled: false, isReadOnly: false, isRequired: false, isInvalid: false },
  argTypes: { size: { control: 'select', options: ['sm', 'md', 'lg'] }, hourCycle: { control: 'inline-radio', options: [12, 24] } },
  render: (args) => <TimeField {...args} defaultValue={new Time(9, 30)} />,
};

/* meta.states: invalid, disabled, required, readonly. */
export const States: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 'var(--ag-space-4)', maxInlineSize: '24rem' }}>
      <TimeField label="Invalid" defaultValue={new Time(23, 30)} isInvalid errorMessage="Pick a time within office hours" />
      <TimeField label="Disabled" defaultValue={new Time(9, 30)} isDisabled />
      <TimeField label="Required" isRequired />
      <TimeField label="Read-only" defaultValue={new Time(9, 30)} isReadOnly />
    </div>
  ),
};

/* tests/a11y/apg/surf/time-field.apg.spec.ts: en-GB 24-hour segments hour / minute, 09:30. */
export const Keyboard: Story = {
  tags: ['apg'],
  render: () => <TimeField label="Reminder" locale="en-GB" hourCycle={24} defaultValue={new Time(9, 30)} />,
};
