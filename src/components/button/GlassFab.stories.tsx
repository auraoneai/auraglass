import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { GlassFab } from './GlassFab';
import { cn } from '../../lib/utils';
import { createGlassStyle } from '../../core/mixins/glassMixins';
import { useParallax } from '../../hooks/useParallax';

const meta: Meta<typeof GlassFab> = {
  title: 'Controls/Buttons/Glass Fab',
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
  render: (args) => (
    <div
      className="glass-radius-2xl glass-border glass-border-subtle glass-surface-overlay glass-p-6"
      style={{ width: "min(520px, calc(100vw - 64px))" }}
    >
      <div className="glass-flex glass-items-center glass-justify-between glass-gap-5">
        <div>
          <h3 className="glass-text-base glass-font-semibold glass-text-primary">
            Floating action
          </h3>
          <p className="glass-text-sm glass-text-secondary">
            Primary create action with a compact, reachable hit target.
          </p>
        </div>
        <GlassFab {...args} aria-label="Create item">
          +
        </GlassFab>
      </div>
    </div>
  ),
  args: {
    children: null,
  },
};

export const Variants: Story = {
  render: (args) => (
    <div
      className="glass-flex glass-flex-wrap glass-items-center glass-gap-4 glass-radius-2xl glass-border glass-border-subtle glass-surface-overlay glass-p-6"
      style={{ width: "min(640px, calc(100vw - 64px))" }}
    >
      {(["default", "primary", "success", "warning", "error"] as const).map((color) => (
        <GlassFab key={color} {...args} color={color} aria-label={`${color} action`}>
          +
        </GlassFab>
      ))}
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
        className="glass-radius-2xl glass-border glass-border-subtle glass-p-6"
        style={createGlassStyle({ intent: "neutral", elevation: "level2" })}
      >
        <GlassFab {...args} aria-label="Parallax create action">+</GlassFab>
      </div>
    );
  },
  args: {
    children: null,
  },
};
