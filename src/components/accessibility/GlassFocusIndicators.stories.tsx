import type { Meta, StoryObj } from '@storybook/react';
import { GlassButton } from '../button/GlassButton';
import { GlassCard } from '../card/GlassCard';
import { GlassInput } from '../input/GlassInput';
import { AccessibilityProvider } from './AccessibilityProvider';
import { GlassFocusIndicators } from './GlassFocusIndicators';

const focusStoryStyles = `
  .ag-focus-story {
    --glass-text-primary: #f8fafc;
    --glass-text-secondary: #e2e8f0;
    --glass-text-tertiary: #cbd5e1;
    --typography-text-primary: #f8fafc;
    --typography-text-secondary: #e2e8f0;
    width: min(620px, 100%);
    max-width: 100%;
    overflow: visible;
    color: #f8fafc;
  }

  .ag-focus-story,
  .ag-focus-story *,
  .ag-focus-story *::before,
  .ag-focus-story *::after {
    box-sizing: border-box;
  }

  .ag-focus-story .glass-text-primary,
  .ag-focus-story .glass-text-secondary,
  .ag-focus-story h3,
  .ag-focus-story p,
  .ag-focus-story label,
  .ag-focus-story span {
    color: #f8fafc !important;
  }

  .ag-focus-story [data-testid="glass-card"],
  .ag-focus-story .glass-card {
    width: 100% !important;
    max-width: 100% !important;
    overflow: visible !important;
  }

  .ag-focus-story button,
  .ag-focus-story input {
    max-width: 100%;
  }

  .ag-focus-story button {
    background: rgba(15, 23, 42, 0.86) !important;
    color: #f8fafc !important;
    border-color: rgba(226, 232, 240, 0.26) !important;
  }

  @media (max-width: 640px) {
    .ag-focus-story {
      width: calc(100vw - 48px);
      max-width: calc(100vw - 48px);
    }
  }
`;

const meta: Meta<typeof GlassFocusIndicators> = {
  title: 'Foundations/Accessibility/Glass Focus Indicators',
  component: GlassFocusIndicators,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Advanced focus management system with animated rings, keyboard navigation, and screen reader integration for WCAG compliance.',
      },
    },
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <AccessibilityProvider>
        <Story />
      </AccessibilityProvider>
    ),
    (Story) => (
      <div className="ag-focus-story">
        <style>{focusStoryStyles}</style>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

const GlassChoice = ({
  type,
  label,
  name,
}: {
  type: 'checkbox' | 'radio';
  label: string;
  name?: string;
}) => (
  <label className="glass-flex glass-items-center glass-gap-3 glass-radius-lg glass-border glass-border-subtle glass-surface-overlay glass-p-3 glass-text-sm glass-text-primary">
    <input
      type={type}
      name={name}
      className="sr-only"
      style={{ position: 'absolute', opacity: 0, pointerEvents: 'none' }}
    />
    <span
      aria-hidden="true"
      className="glass-inline-flex glass-h-5 glass-w-5 glass-flex-shrink-0 glass-items-center glass-justify-center glass-border glass-border-subtle"
      style={{
        borderRadius: type === 'radio' ? '999px' : 6,
        background: 'rgba(255,255,255,0.5)',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.72)',
      }}
    >
      <span
        style={{
          width: type === 'radio' ? 8 : 10,
          height: type === 'radio' ? 8 : 10,
          borderRadius: type === 'radio' ? '999px' : 3,
          background: 'linear-gradient(135deg, #2563eb, #14b8a6)',
        }}
      />
    </span>
    <span>{label}</span>
  </label>
);

const DemoForm = () => (
  <GlassCard
    className="glass-p-6 glass-space-y-4"
    style={{ width: '100%', maxWidth: '100%', overflow: 'visible' }}
  >
    <h3 className="glass-text-lg glass-font-semibold">Focus Indicator Demo</h3>
    <p className="glass-text-sm glass-text-secondary">
      Use Tab to navigate between elements and see the focus indicators in action.
    </p>
    
    <div className="glass-space-y-3">
      <GlassInput 
        placeholder="First input field"
        label="Name"
      />
      
      <GlassInput 
        placeholder="Second input field"
        label="Email"
        type="email"
      />
      
      <div className="glass-flex glass-flex-wrap glass-gap-3">
        <GlassButton>Primary Button</GlassButton>
        <GlassButton variant="secondary">Secondary Button</GlassButton>
        <GlassButton variant="ghost">Ghost Button</GlassButton>
      </div>
      
      <GlassChoice type="checkbox" label="Checkbox option" />
      <GlassChoice type="radio" name="demo" label="Radio option 1" />
      <GlassChoice type="radio" name="demo" label="Radio option 2" />
    </div>
  </GlassCard>
);

export const Default: Story = {
  render: () => (
    <div>
      <GlassFocusIndicators />
      <DemoForm />
    </div>
  ),
};

export const OutlineVariant: Story = {
  render: () => (
    <div>
      <GlassFocusIndicators />
      <DemoForm />
    </div>
  ),
};

export const GlowVariant: Story = {
  render: () => (
    <div>
      <GlassFocusIndicators />
      <DemoForm />
    </div>
  ),
};

export const HighContrast: Story = {
  decorators: [
    (Story) => (
      <AccessibilityProvider initialSettings={{ highContrast: true }}>
        <Story />
      </AccessibilityProvider>
    ),
  ],
  render: () => (
    <div>
      <GlassFocusIndicators />
      <DemoForm />
    </div>
  ),
};

export const DangerColor: Story = {
  render: () => (
    <div>
      <GlassFocusIndicators />
      <DemoForm />
    </div>
  ),
};

export const AlwaysVisible: Story = {
  render: () => (
    <div>
      <GlassFocusIndicators />
      <DemoForm />
    </div>
  ),
};
