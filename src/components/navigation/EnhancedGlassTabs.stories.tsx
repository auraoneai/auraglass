import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { EnhancedGlassTabs } from './EnhancedGlassTabs';
import { cn } from '../../lib/utils';

const meta: Meta<typeof EnhancedGlassTabs> = {
  title: 'Components/Navigation/EnhancedGlassTabs',
  component: EnhancedGlassTabs,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A glass morphism enhancedglasstabs component.',
      },
    },
  },
  argTypes: {
    tabs: {
      control: 'object',
      description: 'Array of tab items',
    },
    activeTab: {
      control: 'text',
      description: 'Currently active tab ID',
    },
    variant: {
      control: { type: 'select', options: ['default', 'elevated', 'outlined', 'text'] },
      description: 'Visual variant of the tabs',
    },
    size: {
      control: { type: 'select', options: ['small', 'medium', 'large'] },
      description: 'Size of the tabs',
    },
    color: {
      control: { type: 'select', options: ['primary', 'secondary', 'accent', 'light', 'dark'] },
      description: 'Color scheme for the tabs',
    },
    highContrast: {
      control: 'boolean',
      description: 'Whether to use high contrast mode',
    },
    indicatorAnimation: {
      control: { type: 'select', options: ['slide', 'fade', 'none'] },
      description: 'Animation behavior of the indicator',
    },
    fullWidth: {
      control: 'boolean',
      description: 'Whether to stretch tabs to fill width',
    },
    showIndicator: {
      control: 'boolean',
      description: 'Whether to show the active indicator',
    },
    textAlign: {
      control: { type: 'select', options: ['center', 'left', 'right'] },
      description: 'Text alignment within tabs',
    },
  },
  args: {
    tabs: [
      { id: 'tab1', label: 'Tab 1' },
      { id: 'tab2', label: 'Tab 2' },
      { id: 'tab3', label: 'Tab 3' }
    ],
    activeTab: 'tab1',
    variant: 'default',
    size: 'medium',
    color: 'primary',
    highContrast: false,
    indicatorAnimation: 'slide',
    fullWidth: false,
    showIndicator: true,
    textAlign: 'center',
  },
};

export default meta;
type Story = StoryObj<typeof EnhancedGlassTabs>;

export const Default: Story = {
  args: {
    tabs: [
      { id: 'overview', label: 'Overview' },
      { id: 'analytics', label: 'Analytics' },
      { id: 'settings', label: 'Settings' }
    ],
    activeTab: 'overview',
  },
};

export const Variants: Story = {
  render: (args) => (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold mb-4">Default Variant</h3>
        <EnhancedGlassTabs {...args} />
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-4">Elevated Variant</h3>
        <EnhancedGlassTabs {...args} variant="elevated" />
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-4">Outlined Variant</h3>
        <EnhancedGlassTabs {...args} variant="outlined" />
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-4">Text Variant</h3>
        <EnhancedGlassTabs {...args} variant="text" />
      </div>
    </div>
  ),
  args: {
    tabs: [
      { id: 'tab1', label: 'Home' },
      { id: 'tab2', label: 'Profile' },
      { id: 'tab3', label: 'Settings' }
    ],
    activeTab: 'tab1',
  },
};

export const WithBadges: Story = {
  args: {
    tabs: [
      { id: 'notifications', label: 'Notifications', badgeCount: 5 },
      { id: 'messages', label: 'Messages', badgeCount: 12 },
      { id: 'tasks', label: 'Tasks', badgeCount: 3 }
    ],
    activeTab: 'notifications',
  },
};

export const DisabledTabs: Story = {
  args: {
    tabs: [
      { id: 'active', label: 'Active' },
      { id: 'disabled', label: 'Disabled', disabled: true },
      { id: 'another', label: 'Another' }
    ],
    activeTab: 'active',
  },
};
