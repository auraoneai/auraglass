import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { GlassColorSchemeGenerator } from './GlassColorSchemeGenerator';
import { cn } from '../../lib/utils';

const meta: Meta<typeof GlassColorSchemeGenerator> = {
  title: 'Effects + Advanced/Glass Color Scheme Generator',
  component: GlassColorSchemeGenerator,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A glass morphism glasscolorschemegenerator component.',
      },
    },
  },
  argTypes: {
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
    advanced: {
      control: 'boolean',
      description: 'Show advanced options',
    },
    generateCSS: {
      control: 'boolean',
      description: 'Generate CSS variables',
    },
    generateTailwind: {
      control: 'boolean',
      description: 'Generate Tailwind config',
    },
  },
  args: {
    className: '',
    advanced: false,
    generateCSS: true,
    generateTailwind: false,
  },
};

export default meta;
type Story = StoryObj<typeof GlassColorSchemeGenerator>;

export const Default: Story = {
  args: {
    initialScheme: {
      primary: '#0066cc',
      secondary: '#00a3cc',
      accent: '#00ffcc',
    },
  },
};

export const AdvancedMode: Story = {
  args: {
    advanced: true,
    generateCSS: true,
    generateTailwind: true,
    initialScheme: {
      primary: '#ff6b35',
      secondary: '#f7931e',
      accent: '#ffb627',
    },
  },
};
