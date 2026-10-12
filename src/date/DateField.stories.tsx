import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { CalendarDate } from '@internationalized/date';
import { DateField } from './DateField';

/* DateField only; each ./date component has its own <Name>.stories.tsx (S-31).
   Flagship #14 (Controls). `id` keeps the published story ids (surf-date-field--*). */
const meta = {
  title: 'Flagships/Controls/DateField',
  id: 'surf-date-field',
  parameters: { ag: { subject: 'DateField', kind: 'component' } },
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <DateField label="Publish on" defaultValue={new CalendarDate(2026, 10, 7)} description="Segments are spinbuttons" />,
};

export const Playground: StoryObj<typeof DateField> = {
  args: { label: 'Publish on', description: 'Segments are spinbuttons', size: 'md', isDisabled: false, isReadOnly: false, isRequired: false, isInvalid: false },
  argTypes: { size: { control: 'select', options: ['sm', 'md', 'lg'] } },
  render: (args) => <DateField {...args} defaultValue={new CalendarDate(2026, 10, 7)} />,
};

/* meta.states: invalid, disabled, required, readonly. */
export const States: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 'var(--ag-space-4)', maxInlineSize: '24rem' }}>
      <DateField label="Invalid" defaultValue={new CalendarDate(2026, 10, 7)} isInvalid errorMessage="Pick a weekday" />
      <DateField label="Disabled" defaultValue={new CalendarDate(2026, 10, 7)} isDisabled />
      <DateField label="Required" isRequired />
      <DateField label="Read-only" defaultValue={new CalendarDate(2026, 10, 7)} isReadOnly />
    </div>
  ),
};

/* tests/a11y/apg/surf/date-field.apg.spec.ts: en-US segments month / day / year, 2026-10-07. */
export const Keyboard: Story = {
  tags: ['apg'],
  render: () => <DateField label="Publish on" locale="en-US" defaultValue={new CalendarDate(2026, 10, 7)} />,
};
