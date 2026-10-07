import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { GlassAccordion } from './GlassAccordion';
import { cn } from '../../lib/utils';

const meta: Meta<typeof GlassAccordion> = {
  title: 'Data + Visualization/Glass Accordion',
  component: GlassAccordion,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A glass morphism glassaccordion component.',
      },
    },
  },
  decorators: [
    (Story) => (
      <div
        className="glass-radius-2xl glass-border glass-border-subtle glass-surface-overlay glass-p-5"
        style={{ width: "min(720px, calc(100vw - 64px))" }}
      >
        <Story />
      </div>
    ),
  ],
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
    <div className="glass-flex glass-flex-wrap glass-gap-4">
      <GlassAccordion {...args} />
    </div>
  ),
};
