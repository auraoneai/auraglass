import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { CalendarDate } from '@internationalized/date';
import { Calendar, type CalendarProps } from './Calendar';

/* REQ-SURF-100: Calendar subject for the APG grid spec. October 2026 with
   week numbers; the 13th is unavailable (aria-disabled yet focusable).
   Calendar only; RangeCalendar lives in RangeCalendar.stories.tsx (S-31).
   Flagship #14 (Controls). `id` keeps the published story ids (surf-calendar--*)
   that the perf, e2e and manual-matrix subjects already address. */
const meta = {
  title: 'Flagships/Controls/Calendar',
  id: 'surf-calendar',
  parameters: { ag: { subject: 'Calendar', kind: 'component' } },
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

const unavailable13th: CalendarProps['isDateUnavailable'] = (d) => d.year === 2026 && d.month === 10 && d.day === 13;

/* The APG grid subject: en-US, 2026-10-07 selected, the 13th unavailable, week numbers on. */
const AgendaCalendar = () => (
  <Calendar
    aria-label="Event date"
    locale="en-US"
    defaultValue={new CalendarDate(2026, 10, 7)}
    isDateUnavailable={unavailable13th}
    showWeekNumbers
  />
);

export const Default: Story = { render: () => <AgendaCalendar /> };

export const Playground: StoryObj<typeof Calendar> = {
  args: { 'aria-label': 'Event date', locale: 'en-US', showWeekNumbers: true, firstDayOfWeek: 'sun', isDisabled: false, isReadOnly: false },
  render: (args) => <Calendar {...args} defaultValue={new CalendarDate(2026, 10, 7)} isDateUnavailable={unavailable13th} />,
};

/* meta.states: selected, today, outside-month and unavailable cells in one month; then disabled and read-only. */
export const States: Story = {
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--ag-space-6)', alignItems: 'flex-start' }}>
      <Calendar aria-label="Selected, outside-month and unavailable days" locale="en-US" defaultValue={new CalendarDate(2026, 10, 7)} isDateUnavailable={unavailable13th} />
      <Calendar aria-label="Disabled calendar" locale="en-US" defaultValue={new CalendarDate(2026, 10, 7)} isDisabled />
      <Calendar aria-label="Read-only calendar" locale="en-US" defaultValue={new CalendarDate(2026, 10, 7)} isReadOnly />
    </div>
  ),
};

/* tests/a11y/apg/surf/calendar.apg.spec.ts runs the APG date-grid keyboard script on this story. */
export const Keyboard: Story = { tags: ['apg'], render: () => <AgendaCalendar /> };
