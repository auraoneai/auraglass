import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { GlassAccordion as GlassAccordionUI } from '../data-display/GlassAccordion';

const meta: Meta<typeof GlassAccordionUI> = {
  title: 'Controls/Inputs/Glass Accordion UI',
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
    className: 'glass-w-[min(22rem,calc(100vw-3rem))] !glass-text-slate-950',
    defaultValue: 'overview',
    items: [
      {
        id: 'overview',
        title: 'Component overview',
        content: 'Accordion content renders inside a translucent panel.',
      },
      {
        id: 'usage',
        title: 'Usage',
        content: 'Use the glass accordion for grouped settings and FAQs.',
      },
    ],
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
