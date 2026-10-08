import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { CalendarDate, Time } from '@internationalized/date';
import { DateField } from './DateField';
import { Calendar, RangeCalendar } from './Calendar';
import { DatePicker } from './DatePicker';
import { DateRangePicker } from './DateRangePicker';
import { TimeField, TimePicker } from './TimePicker';

const meta = {
  title: 'surf/date-picker',
  parameters: { ag: { subject: 'DatePicker', kind: 'component' } },
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

const renderPicker = () => <DatePicker label="Due date" defaultValue={new CalendarDate(2026, 10, 15)} />;
export const Picker: Story = { render: renderPicker };

export const Field: Story = {
  render: () => <DateField label="Publish on" defaultValue={new CalendarDate(2026, 10, 7)} description="Segments are spinbuttons" />,
};
export const Cal: Story = {
  render: () => <Calendar defaultValue={new CalendarDate(2026, 10, 7)} showWeekNumbers />,
};
export const Range: Story = {
  render: () => (
    <DateRangePicker
      label="Report window"
      presets={[{ label: 'Last 7 days', value: { start: new CalendarDate(2026, 10, 1), end: new CalendarDate(2026, 10, 7) } }]}
    />
  ),
};
export const TimeP: Story = {
  render: () => <TimePicker label="Start time" defaultValue={new Time(9, 30)} minuteStep={15} />,
};
export const RTL: Story = {
  globals: { dir: 'rtl' },
  render: () => <DatePicker label="تاريخ" locale="ar-EG" />,
};
