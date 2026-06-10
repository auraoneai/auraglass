import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { GlassA11y } from './GlassA11y';

const glassA11yStoryStyles = `
  .ag-a11y-story {
    --glass-text-primary: #f8fafc;
    --glass-text-secondary: #e2e8f0;
    --glass-text-tertiary: #cbd5e1;
    --typography-text-primary: #f8fafc;
    --typography-text-secondary: #e2e8f0;
    color: #f8fafc;
    width: 100%;
    min-height: 100vh;
    overflow-x: hidden;
    box-sizing: border-box;
  }

  .ag-a11y-story *,
  .ag-a11y-story *::before,
  .ag-a11y-story *::after {
    box-sizing: border-box;
  }

  .ag-a11y-story .glass-text-primary,
  .ag-a11y-story .glass-text-secondary,
  .ag-a11y-story .glass-text-tertiary,
  .ag-a11y-story h1,
  .ag-a11y-story h2,
  .ag-a11y-story h3,
  .ag-a11y-story h4,
  .ag-a11y-story p,
  .ag-a11y-story span,
  .ag-a11y-story .text-gray-500,
  .ag-a11y-story .text-gray-600,
  .ag-a11y-story .text-gray-700,
  .ag-a11y-story .text-gray-800 {
    color: #f8fafc !important;
  }

  .ag-a11y-story .glass-surface-subtle,
  .ag-a11y-story .glass-surface-subtle\\/80,
  .ag-a11y-story .glass-surface-primary\\/80,
  .ag-a11y-story .glass-surface-translucent,
  .ag-a11y-story .glass-contrast-guard {
    background: rgba(15, 23, 42, 0.78) !important;
    color: #f8fafc !important;
  }

  .ag-a11y-story [class*="glass-w-96"] {
    width: min(24rem, 100%) !important;
    max-width: 100% !important;
  }

  .ag-a11y-story [class*="glass-max-h-80vh"] {
    max-height: min(80vh, calc(100vh - 32px)) !important;
  }

  .ag-a11y-story button[class*="flex-1"][class*="px-4"][class*="py-3"] {
    background: rgba(15, 23, 42, 0.92) !important;
    color: #f8fafc !important;
  }

  .ag-a11y-story button,
  .ag-a11y-story input,
  .ag-a11y-story textarea,
  .ag-a11y-story select {
    max-width: 100%;
  }

  .ag-a11y-story button {
    background: rgba(15, 23, 42, 0.92) !important;
    color: #f8fafc !important;
    border-color: rgba(226, 232, 240, 0.28) !important;
  }

  @media (max-width: 640px) {
    .ag-a11y-story {
      padding: 16px !important;
    }
  }
`;

const meta: Meta<typeof GlassA11y> = {
  title: 'Foundations/Accessibility/Glass A11y',
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
    defaultOpen: {
      control: 'boolean',
      description: 'Open the control panel on initial render for Storybook inspection'
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
    position: 'relative',
    defaultOpen: true,
    onConfigChange: fn()
  },
  render: (args) => (
    <div className="ag-a11y-story glass-min-glass-h-screen glass-gradient-primary glass-gradient-primary glass-gradient-primary dark:glass-gradient-primary dark:glass-gradient-primary glass-p-8">
      <style>{glassA11yStoryStyles}</style>
      <div className="max-w-4xl glass-mx-auto">
        <h1 className="glass-text-3xl glass-font-bold glass-text-secondary dark:glass-text-primary mb-8">
          Accessibility Control Panel Demo
        </h1>

        <div className="glass-grid glass-glass-grid-cols-1 md:glass-glass-grid-cols-2 glass-gap-6 mb-8">
          <div className="glass-p-6 glass-surface-subtle/80 dark:glass-surface-primary/80 glass-glass-backdrop-blur-lg glass-contrast-guard glass-radius-xl glass-border glass-border-subtle/50 dark:glass-border-gray-700/50 glass-contrast-guard">
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

          <div className="glass-p-6 glass-surface-subtle/80 dark:glass-surface-primary/80 glass-glass-backdrop-blur-lg glass-contrast-guard glass-radius-xl glass-border glass-border-subtle/50 dark:glass-border-gray-700/50 glass-contrast-guard">
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
    position: 'relative',
    defaultOpen: true,
    onConfigChange: fn()
  },
  render: (args) => (
    <div className="ag-a11y-story glass-min-glass-h-screen glass-gradient-primary glass-gradient-primary glass-gradient-primary dark:glass-gradient-primary dark:glass-gradient-primary glass-p-8">
      <style>{glassA11yStoryStyles}</style>
      <div className="max-w-4xl glass-mx-auto">
        <h1 className="glass-text-3xl glass-font-bold glass-text-secondary dark:glass-text-primary mb-8">
          Accessibility Testing Demo
        </h1>

        <div className="glass-grid glass-glass-grid-cols-1 md:glass-glass-grid-cols-3 glass-gap-6 mb-8">
          <div className="glass-p-4 glass-surface-subtle/80 dark:glass-surface-primary/80 glass-glass-backdrop-blur-lg glass-contrast-guard glass-radius-xl glass-border glass-border-subtle/50 dark:glass-border-gray-700/50 glass-contrast-guard">
            <h4 className="glass-font-semibold glass-text-secondary dark:glass-text-primary glass-mb-2">WCAG AA Compliance</h4>
            <div className="glass-w-full glass-surface-subtle dark:glass-surface-subtle glass-radius-full glass-h-2 glass-mb-2">
              <div className="glass-surface-green glass-h-2 glass-radius-full" style={{ width: '95%' }}></div>
            </div>
            <p className="glass-text-sm glass-text-secondary dark:text-gray-300">95% compliant</p>
          </div>

          <div className="glass-p-4 glass-surface-subtle/80 dark:glass-surface-primary/80 glass-glass-backdrop-blur-lg glass-contrast-guard glass-radius-xl glass-border glass-border-subtle/50 dark:glass-border-gray-700/50 glass-contrast-guard">
            <h4 className="glass-font-semibold glass-text-secondary dark:glass-text-primary glass-mb-2">Keyboard Navigation</h4>
            <div className="glass-w-full glass-surface-subtle dark:glass-surface-subtle glass-radius-full glass-h-2 glass-mb-2">
              <div className="glass-surface-blue glass-h-2 glass-radius-full" style={{ width: '100%' }}></div>
            </div>
            <p className="glass-text-sm glass-text-secondary dark:text-gray-300">Fully accessible</p>
          </div>

          <div className="glass-p-4 glass-surface-subtle/80 dark:glass-surface-primary/80 glass-glass-backdrop-blur-lg glass-contrast-guard glass-radius-xl glass-border glass-border-subtle/50 dark:glass-border-gray-700/50 glass-contrast-guard">
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
    defaultOpen: true,
    className: 'custom-accessibility-theme',
    onConfigChange: fn()
  },
  render: (args) => (
    <div className="ag-a11y-story glass-min-glass-h-screen glass-surface-dark glass-p-8">
      <style>{glassA11yStoryStyles}</style>
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
    defaultOpen: true,
    onConfigChange: fn()
  },
  render: (args) => (
    <div className="ag-a11y-story glass-min-glass-h-screen glass-surface-subtle glass-p-8">
      <style>{glassA11yStoryStyles}</style>
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
