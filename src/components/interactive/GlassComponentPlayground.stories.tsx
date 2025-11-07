import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { GlassComponentPlayground } from './GlassComponentPlayground';
import { cn } from '../../lib/utils';

const meta: Meta<typeof GlassComponentPlayground> = {
  title: 'Components/Interactive/GlassComponentPlayground',
  component: GlassComponentPlayground,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A glass morphism glasscomponentplayground component.',
      },
    },
  },
  argTypes: {
    examples: {
      control: 'object',
      description: 'Array of component examples',
    },
    defaultExample: {
      control: 'text',
      description: 'Default selected example ID',
    },
    showCode: {
      control: 'boolean',
      description: 'Whether to show code panel',
    },
    showProps: {
      control: 'boolean',
      description: 'Whether to show props panel',
    },
    className: {
      control: 'text',
      description: 'Additional CSS class',
    },
    theme: {
      control: 'select',
      options: ['light', 'dark', 'auto'],
      description: 'Theme for the playground',
    },
  },
  args: {
    examples: [
      {
        id: 'sample-button',
        name: 'Sample Button',
        description: 'A basic button component',
        category: 'buttons',
        component: ({ children }) => <button className="px-4 py-2 glass-surface-blue text-primary glass-radius-md">{children || 'Button'}</button>,
        props: { children: 'Click me!' },
      },
    ],
    defaultExample: 'sample-button',
    showCode: true,
    showProps: true,
    className: '',
    theme: 'dark',
  },
};

export default meta;
type Story = StoryObj<typeof GlassComponentPlayground>;

export const Default: Story = {
  args: {
    examples: [
      {
        id: 'default-button',
        name: 'Default Button',
        description: 'A basic button component',
        category: 'buttons',
        component: ({ children }) => <button className="px-4 py-2 glass-surface-blue text-primary glass-radius-md">{children || 'Button'}</button>,
        props: { children: 'Default Button' },
      },
    ],
    defaultExample: 'default-button',
  },
};

export const Variants: Story = {
  args: {
    examples: [
      {
        id: 'variant-1',
        name: 'Primary Button',
        description: 'A primary styled button',
        category: 'buttons',
        component: ({ children }) => <button className="px-4 py-2 glass-surface-green text-primary glass-radius-md">{children || 'Primary'}</button>,
        props: { children: 'Primary Button' },
      },
      {
        id: 'variant-2',
        name: 'Secondary Button',
        description: 'A secondary styled button',
        category: 'buttons',
        component: ({ children }) => <button className="px-4 py-2 glass-surface-primary text-primary glass-radius-md">{children || 'Secondary'}</button>,
        props: { children: 'Secondary Button' },
      },
    ],
    defaultExample: 'variant-1',
  },
};
