import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { Time } from '@internationalized/date';
import { TimeField } from './TimePicker';

const meta = {
  title: 'surf/time-field',
  parameters: { ag: { subject: 'TimeField', kind: 'component' } },
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <TimeField label="Reminder" defaultValue={new Time(9, 30)} />,
};
