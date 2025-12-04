import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { GlassAccordion as GlassAccordionUI } from '../data-display/GlassAccordion';
import { cn } from '../../lib/utils';

const meta: Meta<typeof GlassAccordionUI> = {
  title: 'Components/Ui-components/GlassAccordionUI',
  component: GlassAccordionUI,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A glass morphism glassaccordionui component.',
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
type Story = StoryObj<typeof GlassAccordionUI>;

export const Default: Story = {
  args: {
    
  },
};

export const Variants: Story = {
  render: (args: any) => (
    <div className="glass-flex glass-flex-wrap glass-gap-4">
      <GlassAccordionUI {...args}>
        Default
      </GlassAccordionUI>
    </div>
  ),
  args: {
    
  },
};
