import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { GlassThemeSwitcher } from './GlassThemeSwitcher';
import { cn } from '../../lib/utils';
import { fn } from '@storybook/test';

const meta: Meta<typeof GlassThemeSwitcher> = {
  title: 'Effects + Advanced/Glass Theme Switcher',
  component: GlassThemeSwitcher,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A glass morphism glassthemeswitcher component.',
      },
    },
  },
  argTypes: {
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
    currentTheme: {
      control: 'text',
      description: 'Current theme ID',
    },
    enableSystemTheme: {
      control: 'boolean',
      description: 'Enable system theme detection',
    },
    showPreview: {
      control: 'boolean',
      description: 'Show theme preview',
    },
    compact: {
      control: 'boolean',
      description: 'Compact mode',
    },
  },
  args: {
    className: '',
    currentTheme: 'light',
    enableSystemTheme: true,
    showPreview: true,
    compact: false,
  },
};

export default meta;
type Story = StoryObj<typeof GlassThemeSwitcher>;

export const Default: Story = {
  args: {
    themes: [
      {
        id: 'ocean',
        name: 'Ocean Blue',
        preview: { primary: '#0066cc', secondary: '#00a3cc', background: '#f0f8ff', text: '#003366' },
        colors: { primary: '#0066cc', secondary: '#00a3cc', accent: '#00ffcc' }
      },
      {
        id: 'sunset',
        name: 'Sunset Orange',
        preview: { primary: '#ff6b35', secondary: '#f7931e', background: '#fff5f0', text: '#8b4513' },
        colors: { primary: '#ff6b35', secondary: '#f7931e', accent: '#ffb627' }
      },
      {
        id: 'forest',
        name: 'Forest Green',
        preview: { primary: '#2d5a27', secondary: '#4a7c59', background: '#f0f8f0', text: '#1a3a1a' },
        colors: { primary: '#2d5a27', secondary: '#4a7c59', accent: '#7fb069' }
      }
    ],
    onThemeChange: fn(),
  },
};

export const CompactMode: Story = {
  args: {
    compact: true,
    themes: [
      {
        id: 'minimal',
        name: 'Minimal',
        preview: { primary: '#2c3e50', secondary: '#34495e', background: 'var(--glass-white)', text: '#2c3e50' },
        colors: { primary: '#2c3e50', secondary: '#34495e', accent: '#ecf0f1' }
      },
      {
        id: 'vibrant',
        name: 'Vibrant',
        preview: { primary: '#e91e63', secondary: '#9c27b0', background: '#f3e5f5', text: '#4a148c' },
        colors: { primary: '#e91e63', secondary: '#9c27b0', accent: '#ff9800' }
      }
    ],
    onThemeChange: fn(),
  },
};
