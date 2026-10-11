import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { CalendarDate } from '@internationalized/date';
import { DateField } from './DateField';
import { DatePicker } from './DatePicker';

const meta = {
  title: 'surf/date-picker',
  parameters: { ag: { subject: 'DatePicker', kind: 'component' } },
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

/** Perf subject `surf/date-picker--default` (fragments/perf-budgets/surf.ts). */
export const Default: Story = {
  render: () => <DatePicker label="Due date" defaultValue={new CalendarDate(2026, 10, 15)} />,
};
export const Picker: Story = {
  render: () => <DatePicker label="Due date" defaultValue={new CalendarDate(2026, 10, 15)} />,
};
export const Field: Story = {
  render: () => <DateField label="Publish on" defaultValue={new CalendarDate(2026, 10, 7)} description="Segments are spinbuttons" />,
};

/* REQ-SURF-98 locale stories: no `locale` prop — the picker resolves locale and
   direction from the closest [lang]/[dir] in the DOM. */
export const LocaleArEG: Story = {
  render: () => (
    <div lang="ar-EG" dir="rtl">
      <DatePicker label="تاريخ" defaultValue={new CalendarDate(2026, 10, 15)} />
    </div>
  ),
};
export const LocaleJaJP: Story = {
  render: () => (
    <div lang="ja-JP">
      <DatePicker label="日付" defaultValue={new CalendarDate(2026, 10, 15)} />
    </div>
  ),
};
export const LocaleDeDE: Story = {
  render: () => (
    <div lang="de-DE">
      <DatePicker label="Datum" defaultValue={new CalendarDate(2026, 10, 15)} />
    </div>
  ),
};
export const RTL: Story = {
  render: () => <DatePicker label="تاريخ" locale="ar-EG" dir="rtl" />,
};
