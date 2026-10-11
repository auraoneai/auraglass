import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { CalendarDate } from '@internationalized/date';
import { DateRangePicker } from './DateRangePicker';

const meta = {
  title: 'surf/date-range-picker',
  parameters: { ag: { subject: 'DateRangePicker', kind: 'component' } },
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

const presets = [{ label: 'Last 7 days', value: { start: new CalendarDate(2026, 10, 1), end: new CalendarDate(2026, 10, 7) } }];
export const Default: Story = {
  render: () => <DateRangePicker label="Report window" presets={presets} />,
};
export const Open: Story = {
  render: () => <DateRangePicker label="Report window" presets={presets} defaultOpen />,
};
