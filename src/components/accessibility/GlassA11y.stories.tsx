import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { GlassA11y } from './GlassA11y';
import { cn } from '../../lib/utils';

const meta: Meta<typeof GlassA11y> = {
  title: 'Accessibility/GlassA11y',
  component: GlassA11y,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'A comprehensive accessibility control panel providing WCAG AAA compliance management with real-time testing and adaptive interfaces.'
      }
    }
  },
  argTypes: {
    showDashboard: {
      control: 'boolean',
      description: 'Whether to show the accessibility dashboard'
    },
    enableTesting: {
      control: 'boolean',
      description: 'Enable accessibility testing features'
    },
    position: {
      control: { type: 'select', options: ['fixed', 'relative'] },
      description: 'Positioning mode for the panel'
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes'
    },
    onConfigChange: {
      action: 'config changed',
      description: 'Called when accessibility configuration changes'
    }
  }
};

export default meta;
type Story = StoryObj<typeof GlassA11y>;

export const Default: Story = {
  args: {
    showDashboard: true,
    enableTesting: true,
    position: 'fixed',
    onConfigChange: fn()
  },
  render: (args) => (
    <div className="glass-min-glass-h-screen glass-gradient-primary glass-gradient-primary glass-gradient-primary dark:glass-gradient-primary dark:glass-gradient-primary glass-p-8">
      <div className="max-w-4xl glass-mx-auto">
        <h1 className="glass-text-3xl glass-font-bold glass-text-secondary dark:glass-text-primary mb-8">
          Accessibility Control Panel Demo
        </h1>

        <div className="glass-grid glass-glass-grid-cols-1 md:glass-glass-grid-cols-2 glass-gap-6 mb-8">
          <div className="glass-p-6 glass-surface-subtle/80 dark:glass-surface-primary/80 glass-glass-glass-backdrop-blur-lg glass-contrast-guard glass-radius-xl glass-border glass-border-subtle/50 dark:glass-border-gray-700/50 glass-contrast-guard">
            <h3 className="glass-text-xl glass-font-semibold glass-text-secondary dark:glass-text-primary glass-mb-4">
              Interactive Content
            </h3>
            <p className="glass-text-secondary dark:text-gray-300 glass-mb-4">
              This content demonstrates how accessibility settings can adapt the user interface in real-time.
              Try using the accessibility panel to see the changes.
            </p>
            <button className="glass-px-4 glass-py-2 glass-surface-blue hover:glass-surface-blue glass-text-primary glass-radius-lg transition-colors">
              Interactive Button
            </button>
          </div>

          <div className="glass-p-6 glass-surface-subtle/80 dark:glass-surface-primary/80 glass-glass-glass-backdrop-blur-lg glass-contrast-guard glass-radius-xl glass-border glass-border-subtle/50 dark:glass-border-gray-700/50 glass-contrast-guard">
            <h3 className="glass-text-xl glass-font-semibold glass-text-secondary dark:glass-text-primary glass-mb-4">
              Form Elements
            </h3>
            <div className="glass-space-y-4">
              <input
                type="text"
                placeholder="Enter text here"
                className="glass-w-full glass-p-3 glass-border glass-border-subtle dark:glass-border-gray-600 glass-radius-lg glass-surface-subtle dark:glass-surface-subtle glass-text-secondary dark:glass-text-primary glass-touch-target glass-contrast-guard"
              />
              <textarea
                placeholder="Enter longer text here"
                rows={3}
                className="glass-w-full glass-p-3 glass-border glass-border-subtle dark:glass-border-gray-600 glass-radius-lg glass-surface-subtle dark:glass-surface-subtle glass-text-secondary dark:glass-text-primary glass-touch-target glass-contrast-guard"
              />
            </div>
          </div>
        </div>

        <GlassA11y {...args} />
      </div>
    </div>
  )
};

export const TestingMode: Story = {
  args: {
    showDashboard: true,
    enableTesting: true,
    position: 'fixed',
    onConfigChange: fn()
  },
  render: (args) => (
    <div className="glass-min-glass-h-screen glass-gradient-primary glass-gradient-primary glass-gradient-primary dark:glass-gradient-primary dark:glass-gradient-primary glass-p-8">
      <div className="max-w-4xl glass-mx-auto">
        <h1 className="glass-text-3xl glass-font-bold glass-text-secondary dark:glass-text-primary mb-8">
          Accessibility Testing Demo
        </h1>

        <div className="glass-grid glass-glass-grid-cols-1 md:glass-glass-grid-cols-3 glass-gap-6 mb-8">
          <div className="glass-p-4 glass-surface-subtle/80 dark:glass-surface-primary/80 glass-glass-glass-backdrop-blur-lg glass-contrast-guard glass-radius-xl glass-border glass-border-subtle/50 dark:glass-border-gray-700/50 glass-contrast-guard">
            <h4 className="glass-font-semibold glass-text-secondary dark:glass-text-primary glass-mb-2">WCAG AA Compliance</h4>
            <div className="glass-w-full glass-surface-subtle dark:glass-surface-subtle glass-radius-full glass-h-2 glass-mb-2">
              <div className="glass-surface-green glass-h-2 glass-radius-full" style={{ width: '95%' }}></div>
            </div>
            <p className="glass-text-sm glass-text-secondary dark:text-gray-300">95% compliant</p>
          </div>

          <div className="glass-p-4 glass-surface-subtle/80 dark:glass-surface-primary/80 glass-glass-glass-backdrop-blur-lg glass-contrast-guard glass-radius-xl glass-border glass-border-subtle/50 dark:glass-border-gray-700/50 glass-contrast-guard">
            <h4 className="glass-font-semibold glass-text-secondary dark:glass-text-primary glass-mb-2">Keyboard Navigation</h4>
            <div className="glass-w-full glass-surface-subtle dark:glass-surface-subtle glass-radius-full glass-h-2 glass-mb-2">
              <div className="glass-surface-blue glass-h-2 glass-radius-full" style={{ width: '100%' }}></div>
            </div>
            <p className="glass-text-sm glass-text-secondary dark:text-gray-300">Fully accessible</p>
          </div>

          <div className="glass-p-4 glass-surface-subtle/80 dark:glass-surface-primary/80 glass-glass-glass-backdrop-blur-lg glass-contrast-guard glass-radius-xl glass-border glass-border-subtle/50 dark:glass-border-gray-700/50 glass-contrast-guard">
            <h4 className="glass-font-semibold glass-text-secondary dark:glass-text-primary glass-mb-2">Screen Reader Support</h4>
            <div className="glass-w-full glass-surface-subtle dark:glass-surface-subtle glass-radius-full glass-h-2 glass-mb-2">
              <div className="glass-surface-primary glass-h-2 glass-radius-full" style={{ width: '90%' }}></div>
            </div>
            <p className="glass-text-sm glass-text-secondary dark:text-gray-300">90% supported</p>
          </div>
        </div>

        <GlassA11y {...args} />
      </div>
    </div>
  )
};

export const HighContrast: Story = {
  args: {
    showDashboard: true,
    enableTesting: false,
    position: 'relative',
    className: 'custom-accessibility-theme',
    onConfigChange: fn()
  },
  render: (args) => (
    <div className="glass-min-glass-h-screen glass-surface-dark glass-p-8">
      <div className="max-w-4xl glass-mx-auto">
        <h1 className="glass-text-3xl glass-font-bold glass-text-primary mb-8">
          High Contrast Mode Demo
        </h1>

        <div className="glass-p-6 glass-surface-subtle glass-border-2 glass-border-black glass-radius-xl">
          <h3 className="glass-text-xl glass-font-semibold glass-text-inverse glass-mb-4">
            High Contrast Content
          </h3>
          <p className="glass-text-inverse glass-mb-4">
            This content uses high contrast colors for better visibility.
            The accessibility panel can automatically switch to high contrast mode.
          </p>
          <button className="glass-px-4 glass-py-2 glass-surface-dark glass-text-primary glass-border-2 glass-border-black glass-radius hover:glass-surface-primary transition-colors">
            High Contrast Button
          </button>
        </div>

        <div className="mt-8">
          <GlassA11y {...args} />
        </div>
      </div>
    </div>
  )
};

export const Minimal: Story = {
  args: {
    showDashboard: true,
    enableTesting: false,
    position: 'relative',
    onConfigChange: fn()
  },
  render: (args) => (
    <div className="glass-min-glass-h-screen glass-surface-subtle glass-p-8">
      <div className="max-w-4xl glass-mx-auto">
        <h1 className="glass-text-3xl glass-font-bold glass-text-secondary mb-8">
          Minimal Accessibility Demo
        </h1>

        <div className="glass-grid glass-glass-grid-cols-1 md:glass-glass-grid-cols-2 glass-gap-6 mb-8">
          <div className="glass-p-6 glass-surface-subtle glass-radius-xl glass-border glass-border-subtle">
            <h3 className="glass-text-lg glass-font-semibold glass-text-secondary glass-mb-4">
              Clean Interface
            </h3>
            <p className="glass-text-secondary glass-mb-4">
              Simple, clean design that works well with accessibility features.
            </p>
          </div>

          <div className="glass-p-6 glass-surface-subtle glass-radius-xl glass-border glass-border-subtle">
            <h3 className="glass-text-lg glass-font-semibold glass-text-secondary glass-mb-4">
              Focus States
            </h3>
            <p className="glass-text-secondary glass-mb-4">
              Clear focus indicators for keyboard navigation.
            </p>
            <button className="glass-px-4 glass-py-2 glass-surface-blue glass-text-primary glass-radius hover:glass-surface-blue focus:outline-none focus:ring-4 focus:ring-blue-300 transition-colors">
              Focusable Button
            </button>
          </div>
        </div>

        <GlassA11y {...args} />
      </div>
    </div>
  )
};

