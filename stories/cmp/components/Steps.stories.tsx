import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { Steps } from '../../../src/components/steps';
import type { StoryAgParameters } from '../../../src/contracts/testing';

const meta = {
  title: 'Core/Steps',
  component: Steps,
  tags: ['core'],
  parameters: { ag: { subject: 'Steps', kind: 'component' } satisfies StoryAgParameters },
} satisfies Meta<typeof Steps>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Steps>
      <Steps.Item status="complete">Account</Steps.Item>
      <Steps.Item status="current" description="Pick a display name">
        Profile
      </Steps.Item>
      <Steps.Item status="upcoming">Billing</Steps.Item>
    </Steps>
  ),
};
export const WithError: Story = {
  render: () => (
    <Steps>
      <Steps.Item status="complete">Account</Steps.Item>
      <Steps.Item status="error" description="Payment failed">
        Billing
      </Steps.Item>
      <Steps.Item status="upcoming">Done</Steps.Item>
    </Steps>
  ),
};
