import type { Meta, StoryObj } from '@storybook/react';
import { GlassButton } from '../button/GlassButton';
import { GlassCard } from '../card/GlassCard';
import { GlassInput } from '../input/GlassInput';
import { AccessibilityProvider } from './AccessibilityProvider';
import { GlassFocusIndicators } from './GlassFocusIndicators';

const focusStoryStyles = `
  .ag-focus-story {
    --glass-text-primary: #0f172a;
    --glass-text-secondary: #334155;
    --glass-text-tertiary: #475569;
    --typography-text-primary: #0f172a;
    --typography-text-secondary: #334155;
    width: min(620px, 100%);
    max-width: 100%;
    overflow: visible;
    color: #0f172a;
    --glass-focus-shadow-primary: 0 0 14px rgba(28, 28, 30, 0.18);
    --glass-focus-shadow-interactive: 0 0 18px rgba(28, 28, 30, 0.2);
    --glass-focus-shadow-navigation: 0 0 14px rgba(28, 28, 30, 0.18);
    --glass-focus-shadow-form: 0 0 14px rgba(28, 28, 30, 0.18);
  }

  .ag-focus-story::before {
    content: '';
    position: fixed;
    inset: 0;
    z-index: -1;
    background:
      radial-gradient(circle at 24% 14%, rgba(255, 255, 255, 0.98), transparent 38%),
      linear-gradient(145deg, #fafafa, #e9e9e9);
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
    color: #0f172a !important;
  }

  .ag-focus-story [data-testid="glass-card"],
  .ag-focus-story .glass-card {
    width: 100% !important;
    max-width: 100% !important;
    overflow: visible !important;
    background: linear-gradient(145deg, rgba(255, 255, 255, 0.30), rgba(255, 255, 255, 0.16)) !important;
    background-color: rgba(255, 255, 255, 0.18) !important;
    border-color: rgba(255, 255, 255, 0.28) !important;
    box-shadow: inset 0 1px 0 rgba(255,255,255,0.28), inset 0 0 12px rgba(255,255,255,0.12), 0 20px 48px rgba(20,20,20,0.12) !important;
    backdrop-filter: blur(24px) saturate(1.4) brightness(1.04) contrast(1.02) !important;
    -webkit-backdrop-filter: blur(24px) saturate(1.4) brightness(1.04) contrast(1.02) !important;
  }

  .ag-focus-story label {
    background: linear-gradient(145deg, rgba(255, 255, 255, 0.30), rgba(255, 255, 255, 0.16)) !important;
    background-color: rgba(255, 255, 255, 0.18) !important;
    border-color: rgba(255, 255, 255, 0.28) !important;
    box-shadow: inset 0 1px 0 rgba(255,255,255,0.28), inset 0 0 10px rgba(255,255,255,0.12), 0 8px 22px rgba(20,20,20,0.08) !important;
  }

  .ag-focus-story button,
  .ag-focus-story input {
    max-width: 100%;
  }

  .ag-focus-story button:not([data-button-variant='ghost']) {
    min-height: 40px;
    padding-inline: 16px;
    background: linear-gradient(145deg, rgba(255, 255, 255, 0.28), rgba(255, 255, 255, 0.14)) !important;
    background-color: rgba(255, 255, 255, 0.16) !important;
    color: #0f172a !important;
    border-color: rgba(255, 255, 255, 0.48) !important;
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.28), inset 0 0 10px rgba(255, 255, 255, 0.14), 0 10px 28px rgba(20, 20, 20, 0.12) !important;
    backdrop-filter: blur(24px) saturate(1.4) brightness(1.04) contrast(1.02) !important;
    -webkit-backdrop-filter: blur(24px) saturate(1.4) brightness(1.04) contrast(1.02) !important;
  }

  .ag-focus-story button[data-button-variant='ghost'] {
    min-height: 40px;
    padding-inline: 16px;
    background: rgba(255, 255, 255, 0.16) !important;
    color: #0f172a !important;
    border-color: rgba(255, 255, 255, 0.24) !important;
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.22), inset 0 0 10px rgba(255, 255, 255, 0.12) !important;
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
          background: '#26303d',
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
        <GlassButton variant="default">Primary Button</GlassButton>
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
