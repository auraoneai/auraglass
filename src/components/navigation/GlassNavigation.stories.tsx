import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { GlassNavigation } from './GlassNavigation';
import { cn } from '../../lib/utils';

const meta: Meta<typeof GlassNavigation> = {
  title: 'Components/Navigation/GlassNavigation',
  component: GlassNavigation,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A glassmorphism navigation component with consciousness interface features including predictive navigation, eye tracking, adaptive layouts, and spatial audio navigation cues.',
      },
    },
  },
  argTypes: {
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
    position: {
      control: { type: 'select' },
      options: ['top', 'bottom', 'left', 'right'],
      description: 'Navigation position',
    },
    variant: {
      control: { type: 'select' },
      options: ['default', 'minimal', 'prominent', 'standard'],
      description: 'Navigation variant',
    },
    compact: {
      control: 'boolean',
      description: 'Compact mode',
    },
    showLabels: {
      control: 'boolean',
      description: 'Show item labels',
    },
  },
  args: {
    className: '',
    position: 'top',
    variant: 'default',
    compact: false,
    showLabels: true,
  },
};

export default meta;

// Navigation consciousness interface overview
export const ConsciousnessOverview: Story = {
  render: () => (
    <div className="space-y-6">
      <div className="text-center gap-2">
        <h2 className="text-xl font-semibold text-primary">Navigation Consciousness Features</h2>
        <p className="text-sm glass-text-secondary">Experience intelligent navigation systems</p>
      </div>
      
      <div className="grid glass-grid-cols-1 lg:glass-grid-cols-2 gap-6">
        <div className="glass-surface-overlay glass-glass-backdrop-blur-sm glass-radius-lg p-4 gap-3 glass-contrast-guard">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 glass-surface-blue glass-radius-full animate-pulse"></div>
            <h3 className="font-medium text-primary">Predictive Navigation</h3>
          </div>
          <ul className="text-sm glass-text-secondary gap-1 ml-5">
            <li>• Route preloading</li>
            <li>• Pattern recognition</li>
            <li>• Usage analytics</li>
          </ul>
        </div>
        
        <div className="glass-surface-overlay glass-glass-backdrop-blur-sm glass-radius-lg p-4 gap-3 glass-contrast-guard">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 glass-surface-green glass-radius-full animate-pulse"></div>
            <h3 className="font-medium text-primary">Eye Tracking</h3>
          </div>
          <ul className="text-sm glass-text-secondary gap-1 ml-5">
            <li>• Gaze-based highlighting</li>
            <li>• Focus previews</li>
            <li>• Attention analytics</li>
          </ul>
        </div>
        
        <div className="glass-surface-overlay glass-glass-backdrop-blur-sm glass-radius-lg p-4 gap-3 glass-contrast-guard">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 glass-surface-primary glass-radius-full animate-pulse"></div>
            <h3 className="font-medium text-primary">Adaptive Layout</h3>
          </div>
          <ul className="text-sm glass-text-secondary gap-1 ml-5">
            <li>• Biometric responsiveness</li>
            <li>• Complexity adjustment</li>
            <li>• Personalized layouts</li>
          </ul>
        </div>
        
        <div className="glass-surface-overlay glass-glass-backdrop-blur-sm glass-radius-lg p-4 gap-3 glass-contrast-guard">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 glass-surface-primary glass-radius-full animate-pulse"></div>
            <h3 className="font-medium text-primary">Spatial Audio</h3>
          </div>
          <ul className="text-sm glass-text-secondary gap-1 ml-5">
            <li>• Directional navigation cues</li>
            <li>• Audio landmarks</li>
            <li>• Immersive wayfinding</li>
          </ul>
        </div>
      </div>
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
};
type Story = StoryObj<typeof GlassNavigation>;

export const Default: Story = {
  args: {
    items: [
      {
        key: 'home',
        label: 'Home',
        icon: '🏠',
        path: '/',
      },
      {
        key: 'dashboard',
        label: 'Dashboard',
        icon: '📊',
        path: '/dashboard',
      },
      {
        key: 'settings',
        label: 'Settings',
        icon: '⚙️',
        path: '/settings',
      },
    ],
  },
};

export const WithSubmenu: Story = {
  args: {
    items: [
      {
        key: 'home',
        label: 'Home',
        icon: '🏠',
        path: '/',
      },
      {
        key: 'projects',
        label: 'Projects',
        icon: '📁',
        children: [
          {
            key: 'project1',
            label: 'Project Alpha',
            path: '/projects/alpha',
          },
          {
            key: 'project2',
            label: 'Project Beta',
            path: '/projects/beta',
          },
        ],
      },
      {
        key: 'settings',
        label: 'Settings',
        icon: '⚙️',
        path: '/settings',
      },
    ],
  },
};

export const VerticalNavigation: Story = {
  args: {
    position: 'left',
    items: [
      {
        key: 'home',
        label: 'Home',
        icon: '🏠',
        path: '/',
      },
      {
        key: 'analytics',
        label: 'Analytics',
        icon: '📈',
        path: '/analytics',
      },
      {
        key: 'users',
        label: 'Users',
        icon: '👥',
        path: '/users',
      },
      {
        key: 'settings',
        label: 'Settings',
        icon: '⚙️',
        path: '/settings',
      },
    ],
  },
};

// Consciousness Interface Features
export const WithPredictiveNavigation: Story = {
  render: (args) => (
    <div className="space-y-6">
      <div className="glass-surface-overlay glass-glass-backdrop-blur-sm glass-radius-lg p-4 glass-contrast-guard">
        <h3 className="text-sm font-medium text-primary mb-2">Predictive Navigation</h3>
        <p className="text-xs glass-text-secondary mb-4">Anticipates user navigation patterns and preloads routes</p>
        <GlassNavigation
          {...args}
        />
      </div>
    </div>
  ),
  args: {
    items: [
      { key: 'dashboard', label: 'Dashboard', icon: '📊', path: '/dashboard' },
      { key: 'analytics', label: 'Analytics', icon: '📈', path: '/analytics' },
      { key: 'reports', label: 'Reports', icon: '📋', path: '/reports' },
      { key: 'settings', label: 'Settings', icon: '⚙️', path: '/settings' },
    ],
  },
};

export const WithEyeTracking: Story = {
  render: (args) => (
    <div className="space-y-6">
      <div className="glass-surface-overlay glass-glass-backdrop-blur-sm glass-radius-lg p-4 glass-contrast-guard">
        <h3 className="text-sm font-medium text-primary mb-2">Eye Tracking Navigation</h3>
        <p className="text-xs glass-text-secondary mb-4">Highlights navigation items based on user gaze</p>
        <GlassNavigation
          {...args}
        />
      </div>
    </div>
  ),
  args: {
    items: [
      { key: 'home', label: 'Home', icon: '🏠', path: '/' },
      { key: 'projects', label: 'Projects', icon: '📁', path: '/projects' },
      { key: 'team', label: 'Team', icon: '👥', path: '/team' },
      { key: 'profile', label: 'Profile', icon: '👤', path: '/profile' },
    ],
  },
};

export const AdaptiveLayout: Story = {
  render: (args) => (
    <div className="space-y-6">
      <div className="glass-surface-overlay glass-glass-backdrop-blur-sm glass-radius-lg p-4 glass-contrast-guard">
        <h3 className="text-sm font-medium text-primary mb-2">Adaptive Navigation</h3>
        <p className="text-xs glass-text-secondary mb-4">Adjusts layout complexity based on user stress and preferences</p>
        <GlassNavigation
          {...args}
        />
      </div>
    </div>
  ),
  args: {
    items: [
      { key: 'dashboard', label: 'Dashboard', icon: '📊', path: '/dashboard' },
      {
        key: 'data',
        label: 'Data Analysis',
        icon: '🔍',
        children: [
          { key: 'charts', label: 'Charts', path: '/data/charts' },
          { key: 'tables', label: 'Tables', path: '/data/tables' },
          { key: 'exports', label: 'Exports', path: '/data/exports' },
        ],
      },
      { key: 'settings', label: 'Settings', icon: '⚙️', path: '/settings' },
    ],
  },
};

export const WithSpatialAudio: Story = {
  render: (args) => (
    <div className="space-y-6">
      <div className="glass-surface-overlay glass-glass-backdrop-blur-sm glass-radius-lg p-4 glass-contrast-guard">
        <h3 className="text-sm font-medium text-primary mb-2">Spatial Audio Navigation</h3>
        <p className="text-xs glass-text-secondary mb-4">Provides directional audio cues for navigation items</p>
        <GlassNavigation
          {...args}
          position="top"
        />
      </div>
    </div>
  ),
  args: {
    items: [
      { key: 'prev', label: 'Previous', icon: '←', path: '/prev' },
      { key: 'current', label: 'Current Page', icon: '●', path: '/current' },
      { key: 'next', label: 'Next', icon: '→', path: '/next' },
    ],
  },
};

export const AchievementDrivenNavigation: Story = {
  render: (args) => (
    <div className="space-y-6">
      <div className="glass-surface-overlay glass-glass-backdrop-blur-sm glass-radius-lg p-4 glass-contrast-guard">
        <h3 className="text-sm font-medium text-primary mb-2">Achievement-Driven Navigation</h3>
        <p className="text-xs glass-text-secondary mb-4">Tracks navigation patterns and unlocks new features</p>
        <GlassNavigation
          {...args}
        />
      </div>
    </div>
  ),
  args: {
    items: [
      { key: 'beginner', label: 'Getting Started', icon: '🌱', path: '/start' },
      { key: 'intermediate', label: 'Advanced Features', icon: '🚀', path: '/advanced' },
      { key: 'expert', label: 'Expert Tools', icon: '⭐', path: '/expert' },
      { key: 'master', label: 'Master Level', icon: '👑', path: '/master' },
    ],
  },
};

export const ConsciousnessShowcase: Story = {
  render: (args) => (
    <div className="space-y-8">
      <div className="text-center gap-2">
        <h2 className="text-xl font-semibold text-primary">Consciousness-Enhanced Navigation</h2>
        <p className="text-sm glass-text-secondary">Full consciousness interface integration</p>
      </div>
      
      <div className="glass-surface-overlay glass-glass-backdrop-blur-sm glass-radius-lg p-6 glass-contrast-guard">
        <GlassNavigation
          {...args}
        />
      </div>
      
      <div className="grid glass-grid-cols-1 md:glass-grid-cols-2 gap-4 text-sm">
        <div className="glass-surface-overlay glass-radius-lg p-3">
          <h4 className="font-medium text-primary mb-2">Intelligence Features</h4>
          <ul className="glass-text-secondary gap-1">
            <li>• Predictive route preloading</li>
            <li>• Pattern recognition</li>
            <li>• Gaze-based highlighting</li>
            <li>• Focus previews</li>
          </ul>
        </div>
        <div className="glass-surface-overlay glass-radius-lg p-3">
          <h4 className="font-medium text-primary mb-2">Adaptive Features</h4>
          <ul className="glass-text-secondary gap-1">
            <li>• Biometric responsiveness</li>
            <li>• Complexity adjustment</li>
            <li>• Spatial audio navigation</li>
            <li>• Achievement tracking</li>
          </ul>
        </div>
      </div>
    </div>
  ),
  args: {
    items: [
      { key: 'home', label: 'Home', icon: '🏠', path: '/' },
      { key: 'dashboard', label: 'Dashboard', icon: '📊', path: '/dashboard' },
      {
        key: 'tools',
        label: 'Tools',
        icon: '🛠️',
        children: [
          { key: 'analyzer', label: 'Data Analyzer', path: '/tools/analyzer' },
          { key: 'generator', label: 'Report Generator', path: '/tools/generator' },
        ],
      },
      { key: 'settings', label: 'Settings', icon: '⚙️', path: '/settings' },
    ],
  },
  parameters: {
    layout: 'padded',
  },
};
