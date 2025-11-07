import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { GlassFab } from './GlassFab';
import { cn } from '../../lib/utils';
import { createGlassStyle } from '../../core/mixins/glassMixins';
import { useParallax } from '../../hooks/useParallax';

const meta: Meta<typeof GlassFab> = {
  title: 'Components/Button/GlassFab',
  component: GlassFab,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A glass morphism glassfab component.',
      },
    },
  },
  argTypes: {
    className: {
      control: 'text',
      description: 'className prop',
    },
    color: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'success', 'error', 'warning', 'info', 'default'],
      description: 'Predefined color theme (not a hex color)'
    },
    children: {
      control: 'text',
      description: 'children prop',
    },
    disabled: {
      control: 'boolean',
      description: 'disabled prop',
    },
  },
  args: {
    className: '',
    color: 'default',
    children: '',
    disabled: false,
  },
};

export default meta;
type Story = StoryObj<typeof GlassFab>;

export const Default: Story = {
  args: {
    children: (
      <div className="p-4 text-center">
        <h3 className="text-lg font-semibold mb-2">GlassFab</h3>
        <p className="text-sm opacity-80">This is the default glassfab component.</p>
      </div>
    ),
  },
};

export const Variants: Story = {
  render: (args) => (
    <div className="flex flex-wrap gap-4">
      <GlassFab {...args}>
        Default
      </GlassFab>
    </div>
  ),
  args: {
    children: null,
  },
};

export const ParallaxFab: Story = {
  render: (args) => {
    const { ref, onMouseMove, onMouseLeave } = useParallax<HTMLDivElement>(8);
    return (
      <div
        ref={ref}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        style={createGlassStyle({ intent: "neutral", elevation: "level2" })}
      >
        <GlassFab {...args}>Parallax</GlassFab>
      </div>
    );
  },
  args: {
    children: null,
  },
};
