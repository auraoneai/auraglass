import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Tour } from '../../../src/components/tour';
import type { StoryAgParameters } from '../../../src/contracts/testing';

const sbMeta = {
  title: 'Core/Tour',
  component: Tour.Root,
  tags: ['certified'],
  parameters: { ag: { tier: 'standard', subject: 'Tour', kind: 'component' } },
 args: { steps: [{ target: '#t1', title: 'Step', description: 'd' }] } } satisfies Meta<typeof Tour.Root>;
export default sbMeta;
type Story = StoryObj<typeof sbMeta>;

export const Default: Story = {
  parameters: { ag: { tier: 'standard', subject: 'Tour', id: 'core-tour--default' } },
  render: () => (
    <Tour.Root defaultOpen steps={[{ target: 'body', title: 'Welcome', description: 'Step one' }]} />
  ),
};

