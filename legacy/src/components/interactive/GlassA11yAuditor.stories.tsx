import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { GlassA11yAuditor } from './GlassA11yAuditor';
import { cn } from '../../lib/utils';

const meta: Meta<typeof GlassA11yAuditor> = {
  title: 'Effects + Advanced/Glass A11y Auditor',
  component: GlassA11yAuditor,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A glass morphism glassa11yauditor component.',
      },
    },
  },
  argTypes: {
    className: {
      control: 'text',
      description: 'className prop',
    },
  },
  args: {
    className: ''
  },
};

export default meta;
type Story = StoryObj<typeof GlassA11yAuditor>;

export const Default: Story = {
  args: {
    
  },
};

export const Variants: Story = {
  render: (args: any) => (
    <div className="glass-flex glass-flex-wrap glass-gap-4">
      <GlassA11yAuditor {...args}>
        Default
      </GlassA11yAuditor>
    </div>
  ),
  args: {
    
  },
};
