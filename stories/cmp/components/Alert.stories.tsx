import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Alert } from '../../../src/components/alert';
import type { StoryAgParameters } from '../../../src/contracts/testing';

const sbMeta = {
  title: 'Core/Alert',
  component: Alert,
  tags: ['certified'],
  parameters: { ag: { tier: 'standard', subject: 'Alert', kind: 'component' } },
} satisfies Meta<typeof Alert>;
export default sbMeta;
type Story = StoryObj<typeof sbMeta>;

export const Default: Story = {
  parameters: { ag: { tier: 'standard', subject: 'Alert', id: 'core-alert--default' } },
  render: () => (
    <Alert intent="info" title="Heads up">Something happened</Alert>
  ),
};

export const Intents: Story = {
  parameters: { ag: { tier: 'standard', subject: 'Alert', id: 'core-alert--intents' } },
  render: () => (
    <div>
      <Alert intent="success" title="Done">OK</Alert>
      <Alert intent="warning" title="Careful">Warn</Alert>
      <Alert intent="danger" title="Bad">Err</Alert>
    </div>
  ),
};

export const Actions: Story = {
  parameters: { ag: { tier: 'standard', subject: 'Alert', id: 'core-alert--actions' } },
  render: () => (
    <Alert intent="warning" title="Limited" icon={<span>!</span>} actions={[{ label: 'Retry' }, { label: 'Dismiss' }]}>Body</Alert>
  ),
};

