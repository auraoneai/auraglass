import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { GlassTabBar } from './GlassTabBar';
import { cn } from '../../lib/utils';
import { useParallax } from '../../hooks/useParallax';
import { fn } from '@storybook/test';
import { createGlassStyle } from '../../core/mixins/glassMixins';

const meta: Meta<typeof GlassTabBar> = {
  title: 'Components/Navigation/GlassTabBar',
  component: GlassTabBar,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A glass morphism glasstabbar component.',
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
    className: '',
  },
};

export default meta;
type Story = StoryObj<typeof GlassTabBar>;

export const Default: Story = {
  args: {
    tabs: [
      { id: 'tab1', label: 'Home', icon: '🏠' },
      { id: 'tab2', label: 'Dashboard', icon: '📊' },
      { id: 'tab3', label: 'Settings', icon: '⚙️' },
    ],
    onChange: fn(),
    activeTab: 0,
  },
};

export const Variants: Story = {
  render: (args) => (
    <div className="flex flex-wrap gap-4">
      <GlassTabBar {...args} />
    </div>
  ),
  args: {
    tabs: [
      { id: 'tab1', label: 'Home', icon: '🏠' },
      { id: 'tab2', label: 'Dashboard', icon: '📊' },
    ],
    onChange: fn(),
    activeTab: 0,
  },
};

export const ParallaxContainer: Story = {
  render: (args) => {
    const { ref, onMouseMove, onMouseLeave } = useParallax<HTMLDivElement>(6);
    return (
      <div
        ref={ref}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        style={createGlassStyle({ intent: "neutral", elevation: "level2" })}
      >
        <GlassTabBar {...args} />
      </div>
    );
  },
  args: {
    tabs: [
      { id: 'tab1', label: 'Overview', icon: '✨' },
      { id: 'tab2', label: 'Stats', icon: '📈' },
      { id: 'tab3', label: 'Settings', icon: '⚙️' },
    ],
    onChange: fn(),
    activeTab: 0,
  },
};
