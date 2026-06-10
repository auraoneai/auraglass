import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { GlassGradientPicker } from './GlassGradientPicker';
import { fn } from '@storybook/test';

const meta: Meta<typeof GlassGradientPicker> = {
  title: 'Effects + Advanced/Glass Gradient Picker',
  component: GlassGradientPicker,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A glass morphism glassgradientpicker component.',
      },
    },
  },
  argTypes: {
    value: {
      control: 'text',
      description: 'Current gradient CSS value',
    },
    presets: {
      control: 'object',
      description: 'Array of gradient presets',
    },
    enableCustom: {
      control: 'boolean',
      description: 'Whether to enable custom gradient creation',
    },
    showTypeSelector: {
      control: 'boolean',
      description: 'Whether to show gradient type selector',
    },
    showAngleControl: {
      control: 'boolean',
      description: 'Whether to show angle control for linear gradients',
    },
    showStopsEditor: {
      control: 'boolean',
      description: 'Whether to show color stops editor',
    },
    maxStops: {
      control: 'number',
      description: 'Maximum number of color stops',
    },
  },
  args: {
    value: 'linear-gradient(45deg, hsl(var(--glass-color-primary)) 0%, #8b5cf6 100%)',
    presets: [
      {
        id: 'sunset',
        name: 'Sunset',
        type: 'linear',
        angle: 45,
        stops: [
          { color: '#ff6b35', position: 0 },
          { color: '#f7931e', position: 50 },
          { color: '#ffd23f', position: 100 },
        ],
      },
      {
        id: 'ocean',
        name: 'Ocean',
        type: 'linear',
        angle: 90,
        stops: [
          { color: '#0077be', position: 0 },
          { color: '#00a8cc', position: 100 },
        ],
      },
      {
        id: 'purple-rain',
        name: 'Purple Rain',
        type: 'radial',
        stops: [
          { color: '#667eea', position: 0 },
          { color: '#764ba2', position: 100 },
        ],
      },
    ],
    enableCustom: true,
    showTypeSelector: true,
    showAngleControl: true,
    showStopsEditor: true,
    maxStops: 5,
    onChange: fn(),
    onPresetSelect: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof GlassGradientPicker>;

export const Default: Story = {
  args: {
    value: 'linear-gradient(45deg, #667eea 0%, #764ba2 100%)',
    presets: [
      {
        id: 'blue-purple',
        name: 'Blue to Purple',
        type: 'linear',
        angle: 45,
        stops: [
          { color: '#667eea', position: 0 },
          { color: '#764ba2', position: 100 },
        ],
      },
    ],
    onChange: fn(),
    onPresetSelect: fn(),
  },
};

export const Variants: Story = {
  args: {
    value: 'radial-gradient(circle, #ff6b35 0%, #f7931e 50%, #ffd23f 100%)',
    presets: [
      {
        id: 'radial-sun',
        name: 'Radial Sun',
        type: 'radial',
        stops: [
          { color: '#ff6b35', position: 0 },
          { color: '#f7931e', position: 50 },
          { color: '#ffd23f', position: 100 },
        ],
      },
      {
        id: 'conic-spectrum',
        name: 'Conic Spectrum',
        type: 'conic',
        stops: [
          { color: '#ff0000', position: 0 },
          { color: '#00ff00', position: 33 },
          { color: '#0000ff', position: 66 },
          { color: '#ff0000', position: 100 },
        ],
      },
    ],
    enableCustom: true,
    showTypeSelector: true,
    showAngleControl: true,
    showStopsEditor: true,
    onChange: fn(),
    onPresetSelect: fn(),
  },
};
