import type { Meta, StoryObj } from '@storybook/react';
import { CleanGlassContainer } from './GlassPresets';

import { cn } from '../../lib/utils';
const meta: Meta<typeof CleanGlassContainer> = {
  title: 'Effects + Advanced/Glass Presets',
  component: CleanGlassContainer,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A glass morphism glasspresets component.',
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
type Story = StoryObj<typeof CleanGlassContainer>;

export const Default: Story = {
  args: {
    
  },
};

export const Variants: Story = {
  render: (args: any) => (
    <div className="glass-flex glass-flex-wrap glass-gap-4">
      <CleanGlassContainer {...args}>
        Default
      </CleanGlassContainer>
    </div>
  ),
  args: {
    
  },
};
