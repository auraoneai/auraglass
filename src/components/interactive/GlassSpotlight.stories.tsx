import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { GlassSpotlight } from './GlassSpotlight';
import { fn } from '@storybook/test';

const meta: Meta<typeof GlassSpotlight> = {
  title: 'Effects + Advanced/Glass Spotlight',
  component: GlassSpotlight,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A glass morphism glassspotlight component.',
      },
    },
  },
  argTypes: {},
  args: {},
};

export default meta;
type Story = StoryObj<typeof GlassSpotlight>;

export const Default: Story = {
  args: {
    targetRect: new DOMRect(100, 100, 200, 100),
    onClose: fn(),
  },
};

export const LargeTarget: Story = {
  args: {
    targetRect: new DOMRect(50, 50, 300, 200),
    onClose: fn(),
  },
};
