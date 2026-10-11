import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { CalendarDate } from '@internationalized/date';
import { DateField } from './DateField';

const meta = {
  title: 'surf/date-field',
  parameters: { ag: { subject: 'DateField', kind: 'component' } },
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <DateField label="Publish on" defaultValue={new CalendarDate(2026, 10, 7)} description="Segments are spinbuttons" />,
};
