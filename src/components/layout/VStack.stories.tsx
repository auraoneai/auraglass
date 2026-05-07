import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { VStack } from './VStack';

const meta: Meta<typeof VStack> = {
  title: 'Surfaces/App Shells + Layout/VStack',
  component: VStack,
  parameters: {
    layout: 'centered',
    previewSurface: 'component',
    docs: {
      description: {
        component: 'Vertical stack examples with bounded cards and readable dark-mode text.',
      },
    },
  },
  argTypes: {
    className: { control: 'text', description: 'Additional CSS classes' },
  },
  args: {
    className: '',
    spacing: 'md',
  },
};

export default meta;
type Story = StoryObj<typeof VStack>;

export const Default: Story = {
  render: (args) => (
    <VStack
      {...args}
      className="glass-w-full glass-max-w-md glass-rounded-2xl glass-bg-white/60 glass-p-5 glass-shadow-xl"
      aria-label="Account activity"
    >
      <h3 className="glass-text-lg glass-font-semibold glass-text-primary">Account activity</h3>
      {['Contract signed', 'Security review', 'Launch window'].map((item) => (
        <article key={item} className="glass-rounded-xl glass-bg-white/65 glass-p-4">
          <h4 className="glass-text-sm glass-font-semibold glass-text-primary">{item}</h4>
          <p className="glass-mt-1 glass-text-sm glass-text-secondary">Clear spacing keeps each row scannable.</p>
        </article>
      ))}
    </VStack>
  ),
};

export const Variants: Story = {
  render: (args) => (
    <div className="glass-grid glass-w-full glass-max-w-4xl glass-grid-cols-1 glass-gap-4 sm:glass-grid-cols-2">
      {['sm', 'lg'].map((spacing) => (
        <VStack key={spacing} {...args} spacing={spacing as any} className="glass-rounded-2xl glass-bg-white/60 glass-p-5 glass-shadow-lg">
          <h3 className="glass-text-base glass-font-semibold glass-text-primary">{spacing} spacing</h3>
          <p className="glass-text-sm glass-text-secondary">Vertical rhythm remains stable across viewport sizes.</p>
        </VStack>
      ))}
    </div>
  ),
};
