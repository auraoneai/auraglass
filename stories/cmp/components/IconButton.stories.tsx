import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { IconButton } from '../../../src/components/icon-button';
import type { StoryAgParameters } from '../../../src/contracts/testing';

const sbMeta = {
  title: 'Flagships/Controls/IconButton',
  component: IconButton,
  tags: ['certified', 'flagship'],
  parameters: { ag: { tier: 'standard', subject: 'IconButton', kind: 'component' } satisfies StoryAgParameters },
  args: { label: 'Close' },
} satisfies Meta<typeof IconButton>;
export default sbMeta;
type Story = StoryObj<typeof sbMeta>;

const XIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
    <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);

export const Default: Story = {
  args: { label: 'Close', icon: <XIcon /> },
};

export const Overview: Story = {
  args: { icon: <XIcon /> },
};

export const Shapes: Story = {
  args: { label: 'Capsule', icon: null },
  render: () => (
    <div style={{ display: 'flex', gap: '12px' }}>
      <IconButton label="Capsule" icon={<XIcon />} />
      <IconButton label="Fixed" icon={<XIcon />} shape="fixed" />
    </div>
  ),
};

export const Sizes: Story = {
  args: { label: 'x', icon: null },
  render: () => (
    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
      <IconButton label="small" icon={<XIcon />} size="sm" />
      <IconButton label="medium" icon={<XIcon />} size="md" />
      <IconButton label="large" icon={<XIcon />} size="lg" />
    </div>
  ),
};

export const Toggle: Story = {
  args: { label: 'Pin', icon: null },
  render: () => <IconButton label="Pin" icon={<XIcon />} defaultPressed />,
};
