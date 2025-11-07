import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { GlassWipeSliderExamples } from './GlassWipeSliderExamples';
import { cn } from '../../lib/utils';

const meta: Meta<typeof GlassWipeSliderExamples> = {
  title: 'Components/Website-components/GlassWipeSliderExamples',
  component: GlassWipeSliderExamples,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A glass morphism glasswipesliderexamples component.',
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
type Story = StoryObj<typeof GlassWipeSliderExamples>;

export const Default: Story = {
  args: {
    
  },
};

export const Variants: Story = {
  render: (args: any) => (
    <div className="flex flex-wrap gap-4">
      <GlassWipeSliderExamples {...args}>
        Default
      </GlassWipeSliderExamples>
    </div>
  ),
  args: {
    
  },
};
