import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { CalendarDate } from '@internationalized/date';
import { DateRangePicker } from './DateRangePicker';

/* REQ-SURF-102: DateRangePicker subject — presets + two months + Apply. */
const meta = {
  title: 'surf/date-range-picker',
  parameters: { ag: { subject: 'DateRangePicker', kind: 'component' } },
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <DateRangePicker
      label="Report window"
      locale="en-US"
      defaultValue={{ start: new CalendarDate(2026, 10, 1), end: new CalendarDate(2026, 10, 7) }}
      presets={[
        { label: 'Launch week', value: { start: new CalendarDate(2026, 11, 2), end: new CalendarDate(2026, 11, 8) } },
        { label: 'First half of October', value: { start: new CalendarDate(2026, 10, 1), end: new CalendarDate(2026, 10, 15) } },
      ]}
    />
  ),
};
