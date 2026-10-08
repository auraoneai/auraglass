import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { TextField } from '../../../src/components/text-field';
import type { StoryAgParameters } from '../../../src/contracts/testing';

const sbMeta = {
  title: 'Flagships/Controls/TextField',
  component: TextField,
  tags: ['certified', 'flagship'],
  parameters: { ag: { tier: 'standard', subject: 'TextField', kind: 'component' } satisfies StoryAgParameters },
} satisfies Meta<typeof TextField>;
export default sbMeta;
type Story = StoryObj<typeof sbMeta>;

export const Default: Story = {
  render: () => (
    <TextField
      label="Project name"
      description="Up to 40 characters."
      startAdornment={<span aria-hidden="true">@</span>}
      endAdornment={<span aria-hidden="true">.ai</span>}
      maxLength={40}
      showCount
      placeholder="auraglass"
    />
  ),
};

export const Invalid: Story = {
  render: () => <TextField label="Email" error="Required" defaultValue="not-an-email" />,
};

export const Multiline: Story = {
  render: () => <TextField label="Bio" multiline rows={3} autoResize maxRows={8} defaultValue="hello" />,
};
