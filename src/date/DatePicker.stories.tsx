import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { CalendarDate } from '@internationalized/date';
import { DatePicker } from './DatePicker';

/* DatePicker only; each ./date component has its own <Name>.stories.tsx (S-31). */
const meta = {
  title: 'surf/date-picker',
  parameters: { ag: { subject: 'DatePicker', kind: 'component' } },
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

const renderPicker = () => <DatePicker label="Due date" defaultValue={new CalendarDate(2026, 10, 15)} />;
export const Picker: Story = { render: renderPicker };
export const Open: Story = {
  render: () => <DatePicker label="Due date" defaultValue={new CalendarDate(2026, 10, 15)} defaultOpen />,
};
export const RTL: Story = {
  globals: { dir: 'rtl' },
  render: () => <DatePicker label="تاريخ" locale="ar-EG" />,
};
