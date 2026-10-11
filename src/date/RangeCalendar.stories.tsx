import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { CalendarDate } from '@internationalized/date';
import { RangeCalendar } from './Calendar';

const meta = {
  title: 'surf/range-calendar',
  parameters: { ag: { subject: 'RangeCalendar', kind: 'component' } },
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <RangeCalendar defaultValue={{ start: new CalendarDate(2026, 10, 5), end: new CalendarDate(2026, 10, 9) }} />
  ),
};
