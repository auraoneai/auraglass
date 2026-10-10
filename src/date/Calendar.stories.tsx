import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { CalendarDate } from '@internationalized/date';
import { Calendar, RangeCalendar } from './Calendar';

/* REQ-SURF-100: Calendar subject for the APG grid spec. October 2026 with
   week numbers; the 13th is unavailable (aria-disabled yet focusable). */
const meta = {
  title: 'surf/calendar',
  parameters: { ag: { subject: 'Calendar', kind: 'component' } },
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Calendar
      aria-label="Event date"
      locale="en-US"
      defaultValue={new CalendarDate(2026, 10, 7)}
      isDateUnavailable={(d) => d.year === 2026 && d.month === 10 && d.day === 13}
      showWeekNumbers
    />
  ),
};
export const Range: Story = {
  render: () => (
    <RangeCalendar
      aria-label="Stay"
      locale="en-US"
      visibleMonths={2}
      defaultValue={{ start: new CalendarDate(2026, 10, 5), end: new CalendarDate(2026, 10, 9) }}
    />
  ),
};
