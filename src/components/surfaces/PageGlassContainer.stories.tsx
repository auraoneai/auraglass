import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import PageGlassContainer from './PageGlassContainer';
import { cn } from '../../lib/utils';

const meta: Meta<typeof PageGlassContainer> = {
  title: 'Components/Surfaces/PageGlassContainer',
  component: PageGlassContainer,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A glass morphism pageglasscontainer component.',
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
type Story = StoryObj<typeof PageGlassContainer>;

export const Default: Story = {
  args: {
    
  },
};

export const Variants: Story = {
  render: (args: any) => (
    <div className="glass-flex glass-flex-wrap glass-gap-4">
      <PageGlassContainer {...args}>
        Default
      </PageGlassContainer>
    </div>
  ),
  args: {
    
  },
};
