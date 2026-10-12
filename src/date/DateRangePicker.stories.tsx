import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { CalendarDate } from '@internationalized/date';
import { DateRangePicker, type DateRangePickerProps } from './DateRangePicker';

/* REQ-SURF-102: DateRangePicker subject — presets + two months + Apply.
   Flagship #14 (Controls). `id` keeps the published story ids (surf-date-range-picker--*). */
const meta = {
  title: 'Flagships/Controls/DateRangePicker',
  id: 'surf-date-range-picker',
  parameters: { ag: { subject: 'DateRangePicker', kind: 'component' } },
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

const PRESETS: DateRangePickerProps['presets'] = [
  { label: 'Launch week', value: { start: new CalendarDate(2026, 11, 2), end: new CalendarDate(2026, 11, 8) } },
  { label: 'First half of October', value: { start: new CalendarDate(2026, 10, 1), end: new CalendarDate(2026, 10, 15) } },
];
const FIRST_WEEK = { start: new CalendarDate(2026, 10, 1), end: new CalendarDate(2026, 10, 7) };

/* The APG subject: "Report window", 2026-10-01 – 2026-10-07, presets "Launch week" / "First half of October". */
const ReportWindow = ({ defaultOpen }: { defaultOpen?: boolean }) => (
  <DateRangePicker label="Report window" locale="en-US" defaultValue={FIRST_WEEK} presets={PRESETS} defaultOpen={defaultOpen} />
);

export const Default: Story = { render: () => <ReportWindow /> };
export const Open: Story = { render: () => <ReportWindow defaultOpen /> };

export const Playground: StoryObj<typeof DateRangePicker> = {
  args: { label: 'Report window', locale: 'en-US', visibleMonths: 2, isDisabled: false, isInvalid: false },
  argTypes: { visibleMonths: { control: 'inline-radio', options: [1, 2] } },
  render: (args) => <DateRangePicker {...args} defaultValue={FIRST_WEEK} presets={PRESETS} />,
};

/* meta.states: open is the Open story; invalid and disabled side by side. */
export const States: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 'var(--ag-space-4)', maxInlineSize: '32rem' }}>
      <DateRangePicker label="Invalid" locale="en-US" defaultValue={FIRST_WEEK} isInvalid errorMessage="The window must end in October" />
      <DateRangePicker label="Disabled" locale="en-US" defaultValue={FIRST_WEEK} isDisabled />
    </div>
  ),
};

/* tests/a11y/apg/surf/date-range-picker.apg.spec.ts runs the segment / dialog keyboard script on this story. */
export const Keyboard: Story = { tags: ['apg'], render: () => <ReportWindow /> };
