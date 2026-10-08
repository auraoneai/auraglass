import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { Switch } from '../../../src/components/switch';
import type { StoryAgParameters } from '../../../src/contracts/testing';

const sbMeta = {
  title: 'Flagships/Controls/Switch',
  component: Switch,
  tags: ['certified', 'flagship'],
  parameters: { ag: { tier: 'standard', subject: 'Switch', kind: 'component' } satisfies StoryAgParameters },
} satisfies Meta<typeof Switch>;
export default sbMeta;
type Story = StoryObj<typeof sbMeta>;

export const Default: Story = {
  render: () => <Switch aria-label="Enabled" />,
};
