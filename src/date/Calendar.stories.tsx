import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { CalendarDate } from '@internationalized/date';
import { Calendar } from './Calendar';

const meta = {
  title: 'surf/calendar',
  parameters: { ag: { subject: 'Calendar', kind: 'component' } },
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <Calendar defaultValue={new CalendarDate(2026, 10, 7)} showWeekNumbers />,
};
