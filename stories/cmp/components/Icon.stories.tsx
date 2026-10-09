import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { Icon } from '../../../src/icons';

const meta = {
  title: 'CMP/Icon',
  component: Icon,
  parameters: { ag: { subject: 'Icon', kind: 'component' } },
} satisfies Meta<typeof Icon>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { name: 'spark' },
};
