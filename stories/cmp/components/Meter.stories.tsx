import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Meter } from '../../../src/components/meter';
import type { StoryAgParameters } from '../../../src/contracts/testing';

const sbMeta = {
  title: 'Core/Meter',
  component: Meter,
  tags: ['certified'],
  parameters: { ag: { tier: 'standard', subject: 'Meter', kind: 'component' } },
 args: { value: 60, label: 'Storage used' } } satisfies Meta<typeof Meter>;
export default sbMeta;
type Story = StoryObj<typeof sbMeta>;

export const Default: Story = {
  parameters: { ag: { tier: 'standard', subject: 'Meter', id: 'core-meter--default' } },
  render: () => (
    <Meter value={30} low={20} high={80} optimum={90} label="Storage" showValue />
  ),
};

