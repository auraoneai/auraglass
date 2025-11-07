import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { GlassAccordion } from './GlassAccordion';
import { cn } from '../../lib/utils';

const meta: Meta<typeof GlassAccordion> = {
  title: 'Components/Data-display/GlassAccordion',
  component: GlassAccordion,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A glass morphism glassaccordion component.',
      },
    },
  },
  argTypes: {
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
    variant: {
      control: { type: 'select' },
      options: ['default', 'bordered', 'flush'],
      description: 'Accordion variant',
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
      description: 'Accordion size',
    },
    multiple: {
      control: 'boolean',
      description: 'Whether multiple items can be open at once',
    },
    animated: {
      control: 'boolean',
      description: 'Whether to animate content changes',
    },
  },
  args: {
    className: '',
    variant: 'default',
    size: 'md',
    multiple: false,
    animated: true,
    items: [
      {
        id: 'item-1',
        title: 'What is glassmorphism?',
        content: 'Glassmorphism is a design trend that uses frosted glass effects and transparency to create modern, elegant interfaces.',
        disabled: false,
      },
      {
        id: 'item-2',
        title: 'How does it work?',
        content: 'It uses CSS backdrop-filter and transparency to create the illusion of glass surfaces with blurred backgrounds.',
        disabled: false,
      },
      {
        id: 'item-3',
        title: 'Benefits',
        content: 'Glassmorphism provides depth, elegance, and a modern aesthetic that enhances user experience.',
        disabled: false,
      },
    ],
  },
};

export default meta;
type Story = StoryObj<typeof GlassAccordion>;

export const Default: Story = {
  args: {},
};

export const Variants: Story = {
  render: (args) => (
    <div className="flex flex-wrap gap-4">
      <GlassAccordion {...args} />
    </div>
  ),
};
