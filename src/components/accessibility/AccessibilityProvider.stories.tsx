import type { Meta, StoryObj } from '@storybook/react';
import { AccessibilityProvider, useAccessibility } from './AccessibilityProvider';
import { GlassButton } from '../button/GlassButton';
import { GlassCard } from '../card/GlassCard';

const meta: Meta<typeof AccessibilityProvider> = {
  title: 'Accessibility/AccessibilityProvider',
  component: AccessibilityProvider,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Accessibility context provider for managing WCAG compliance settings across the application.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Demo component to show accessibility features
const AccessibilityDemo = () => {
  const { settings, updateSettings, resetToDefaults } = useAccessibility();
  
  return (
    <div className="p-6 space-y-6">
      <GlassCard className="p-6">
        <h2 className="text-xl font-semibold mb-4">Accessibility Settings</h2>
        <div className="grid grid-cols-2 gap-4">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={settings.focusIndicators}
              onChange={(e) => updateSettings({ focusIndicators: e.target.checked })}
            />
            <span>Focus Indicators</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={settings.highContrast}
              onChange={(e) => updateSettings({ highContrast: e.target.checked })}
            />
            <span>High Contrast</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={settings.reducedMotion}
              onChange={(e) => updateSettings({ reducedMotion: e.target.checked })}
            />
            <span>Reduced Motion</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={settings.largeText}
              onChange={(e) => updateSettings({ largeText: e.target.checked })}
            />
            <span>Large Text</span>
          </label>
        </div>
        <div className="mt-4">
          <GlassButton onClick={resetToDefaults}>
            Reset to Defaults
          </GlassButton>
        </div>
      </GlassCard>
      
      <GlassCard className="p-6">
        <h3 className="text-lg font-semibold mb-2">Current Settings</h3>
        <pre className="text-sm glass-surface-subtle p-2 glass-radius">
          {JSON.stringify(settings, null, 2)}
        </pre>
      </GlassCard>
    </div>
  );
};

export const Default: Story = {
  render: () => (
    <AccessibilityProvider>
      <AccessibilityDemo />
    </AccessibilityProvider>
  ),
};

export const HighContrast: Story = {
  render: () => (
    <AccessibilityProvider initialSettings={{ highContrast: true }}>
      <AccessibilityDemo />
    </AccessibilityProvider>
  ),
};

export const ReducedMotion: Story = {
  render: () => (
    <AccessibilityProvider initialSettings={{ reducedMotion: true }}>
      <AccessibilityDemo />
    </AccessibilityProvider>
  ),
};