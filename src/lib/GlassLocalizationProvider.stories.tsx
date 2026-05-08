import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { GlassLocalizationProvider, useDateAdapter } from './GlassLocalizationProvider';
import { GlassCard } from '../components/card/GlassCard';
import { GlassButton } from '../components/button/GlassButton';

const meta: Meta<typeof GlassLocalizationProvider> = {
  title: 'Foundations/Tokens/Glass Localization Provider',
  component: GlassLocalizationProvider,
  parameters: {
    layout: 'fullscreen',
    previewSurface: 'app',
    docs: {
      description: {
        component: 'A localization provider with glass morphism styling for date formatting and internationalization.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof GlassLocalizationProvider>;

const LocalizationStoryFrame = ({ children }: { children: React.ReactNode }) => (
  <div
    data-bg="light"
    className="glass-on-light"
    style={{
      width: '100%',
      minHeight: '100vh',
      padding: 'clamp(20px, 4vw, 40px)',
      boxSizing: 'border-box',
      overflowX: 'hidden',
      backgroundColor: 'rgba(248, 250, 252, 0.72)',
      backgroundImage:
        'linear-gradient(135deg, rgba(255,255,255,0.88) 0%, rgba(219,234,254,0.7) 46%, rgba(204,251,241,0.62) 100%)',
      color: '#0f172a',
      backdropFilter: 'blur(24px)',
    }}
  >
    <div style={{ width: 'min(100%, 900px)', margin: '0 auto' }}>
      {children}
    </div>
    <style>{`
      .glass-on-light .glass,
      .glass-on-light .glass-card,
      .glass-on-light .glass-foundation-complete,
      .glass-on-light .liquid-glass-card-surface,
      .glass-on-light [data-liquid-glass-card],
      .glass-on-light [data-glass-component],
      .glass-on-light input {
        background-color: rgba(255, 255, 255, 0.72) !important;
        background: rgba(255, 255, 255, 0.72) !important;
        border-color: rgba(15, 23, 42, 0.16) !important;
        color: #0f172a !important;
      }

      .glass-on-light h1,
      .glass-on-light h2,
      .glass-on-light h3,
      .glass-on-light h4,
      .glass-on-light p,
      .glass-on-light label,
      .glass-on-light span {
        color: #0f172a;
      }

      .glass-on-light button,
      .glass-on-light button span,
      .glass-on-light [data-liquid-glass-button="true"],
      .glass-on-light [data-liquid-glass-button="true"] span,
      .glass-on-light [data-glass-component="button"],
      .glass-on-light [data-glass-component="button"] span {
        color: #f8fafc !important;
      }

      [data-storybook-preview-mode="dark"] .glass-on-light {
        background-color: rgba(15, 23, 42, 0.72) !important;
        background-image:
          linear-gradient(135deg, rgba(15, 23, 42, 0.72), rgba(23, 37, 84, 0.64), rgba(19, 78, 74, 0.58)) !important;
        color: #f8fafc !important;
      }

      [data-storybook-preview-mode="dark"] .glass-on-light .glass,
      [data-storybook-preview-mode="dark"] .glass-on-light .glass-card,
      [data-storybook-preview-mode="dark"] .glass-on-light .glass-foundation-complete,
      [data-storybook-preview-mode="dark"] .glass-on-light .liquid-glass-card-surface,
      [data-storybook-preview-mode="dark"] .glass-on-light [data-liquid-glass-card],
      [data-storybook-preview-mode="dark"] .glass-on-light [data-glass-component],
      [data-storybook-preview-mode="dark"] .glass-on-light input {
        background-color: rgba(15, 23, 42, 0.68) !important;
        background: rgba(15, 23, 42, 0.68) !important;
        border-color: rgba(226, 232, 240, 0.2) !important;
        color: #f8fafc !important;
      }

      [data-storybook-preview-mode="dark"] .glass-on-light h1,
      [data-storybook-preview-mode="dark"] .glass-on-light h2,
      [data-storybook-preview-mode="dark"] .glass-on-light h3,
      [data-storybook-preview-mode="dark"] .glass-on-light h4,
      [data-storybook-preview-mode="dark"] .glass-on-light p,
      [data-storybook-preview-mode="dark"] .glass-on-light label,
      [data-storybook-preview-mode="dark"] .glass-on-light span {
        color: #f8fafc;
      }

      [data-storybook-preview-mode="dark"] .glass-on-light button,
      [data-storybook-preview-mode="dark"] .glass-on-light button span,
      [data-storybook-preview-mode="dark"] .glass-on-light [data-liquid-glass-button="true"],
      [data-storybook-preview-mode="dark"] .glass-on-light [data-liquid-glass-button="true"] span,
      [data-storybook-preview-mode="dark"] .glass-on-light [data-glass-component="button"],
      [data-storybook-preview-mode="dark"] .glass-on-light [data-glass-component="button"] span {
        color: #f8fafc !important;
      }
    `}</style>
  </div>
);

// Component that uses the date adapter
const DateDisplayComponent = () => {
  const adapter = useDateAdapter();

  const now = new Date();
  const tomorrow = adapter.addDays(now, 1);
  const nextMonth = adapter.addMonths(now, 1);
  const nextYear = adapter.addYears(now, 1);

  return (
    <div className="glass-auto-gap glass-auto-gap-lg">
      <div className="text-center mb-6">
        <h3 className="glass-text-lg glass-font-semibold mb-2">Date Formatting Demo</h3>
        <p className="glass-text-sm opacity-80">Using the Glass Localization Provider for date operations.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 glass-gap-4 glass-p-4">
        <GlassCard>
          <div className="glass-p-4">
            <h4 className="font-medium mb-2">Current Date</h4>
            <p className="glass-text-sm opacity-80">{adapter.format(now, 'PPP')}</p>
            <p className="text-xs opacity-60 mt-1">{adapter.format(now, 'PPpp')}</p>
          </div>
        </GlassCard>

        <GlassCard>
          <div className="glass-p-4">
            <h4 className="font-medium mb-2">Tomorrow</h4>
            <p className="glass-text-sm opacity-80">{adapter.format(tomorrow, 'PPP')}</p>
            <p className="text-xs opacity-60 mt-1">{adapter.format(tomorrow, 'EEEE')}</p>
          </div>
        </GlassCard>

        <GlassCard>
          <div className="glass-p-4">
            <h4 className="font-medium mb-2">Next Month</h4>
            <p className="glass-text-sm opacity-80">{adapter.format(nextMonth, 'PPP')}</p>
            <p className="text-xs opacity-60 mt-1">{adapter.format(nextMonth, 'MMMM yyyy')}</p>
          </div>
        </GlassCard>

        <GlassCard>
          <div className="glass-p-4">
            <h4 className="font-medium mb-2">Next Year</h4>
            <p className="glass-text-sm opacity-80">{adapter.format(nextYear, 'PPP')}</p>
            <p className="text-xs opacity-60 mt-1">{adapter.format(nextYear, 'yyyy')}</p>
          </div>
        </GlassCard>
      </div>

      <div className="text-center">
        <GlassButton
          onClick={() => {
            const testDate = new Date('2024-03-15');
            alert(`Test date: ${adapter.format(testDate, 'PPP')}\nValid: ${adapter.isValid(testDate)}`);
          }}
        >
          Test Date Operations
        </GlassButton>
      </div>
    </div>
  );
};

// Component that demonstrates parsing
const DateParsingDemo = () => {
  const adapter = useDateAdapter();
  const [inputValue, setInputValue] = React.useState('2024-03-15');
  const [parsedDate, setParsedDate] = React.useState<Date | null>(null);

  const handleParse = () => {
    const parsed = adapter.parse(inputValue, 'yyyy-MM-dd');
    setParsedDate(parsed);
  };

  return (
    <GlassCard>
      <div className="p-6">
        <h4 className="font-medium mb-4">Date Parsing Demo</h4>
        <div className="glass-auto-gap glass-auto-gap-lg">
          <div>
            <label className="block glass-text-sm font-medium mb-2">Date String (yyyy-MM-dd)</label>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              placeholder="2024-03-15"
            />
          </div>

          <GlassButton onClick={handleParse} size="sm">
            Parse Date
          </GlassButton>

          {parsedDate && (
            <div className="mt-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
              <p className="glass-text-sm font-medium text-green-400">Parsed Successfully!</p>
              <p className="glass-text-sm opacity-80">{adapter.format(parsedDate, 'PPP')}</p>
              <p className="text-xs opacity-60">{parsedDate.toISOString()}</p>
            </div>
          )}
        </div>
      </div>
    </GlassCard>
  );
};

export const Default: Story = {
  render: (args) => (
    <LocalizationStoryFrame>
      <GlassLocalizationProvider {...args}>
        <DateDisplayComponent />
      </GlassLocalizationProvider>
    </LocalizationStoryFrame>
  ),
};

export const DateOperations: Story = {
  render: (args) => (
    <LocalizationStoryFrame>
      <GlassLocalizationProvider {...args}>
        <DateDisplayComponent />
      </GlassLocalizationProvider>
    </LocalizationStoryFrame>
  ),
};

export const DateParsing: Story = {
  render: (args) => (
    <LocalizationStoryFrame>
      <GlassLocalizationProvider {...args}>
        <DateParsingDemo />
      </GlassLocalizationProvider>
    </LocalizationStoryFrame>
  ),
};

export const MultipleComponents: Story = {
  render: (args) => (
    <LocalizationStoryFrame>
      <GlassLocalizationProvider {...args}>
        <div className="glass-auto-gap glass-auto-gap-2xl max-w-4xl">
          <DateDisplayComponent />
          <DateParsingDemo />
        </div>
      </GlassLocalizationProvider>
    </LocalizationStoryFrame>
  ),
};

export const WithCalendar: Story = {
  render: (args) => (
    <LocalizationStoryFrame>
      <GlassLocalizationProvider {...args}>
        <div className="glass-auto-gap glass-auto-gap-2xl">
          <DateDisplayComponent />

          <GlassCard>
            <div className="p-6">
              <h4 className="font-medium mb-4">Calendar Integration</h4>
              <p className="glass-text-sm opacity-80">
                The GlassLocalizationProvider works seamlessly with date picker and calendar components
                to provide consistent date formatting and localization across your application.
              </p>
              <div className="mt-4 glass-p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                <p className="glass-text-sm font-medium text-blue-400">Integration Ready</p>
                <p className="text-xs opacity-80 mt-1">
                  Ready to be used with GlassCalendar, GlassDatePicker, and other date components.
                </p>
              </div>
            </div>
          </GlassCard>
        </div>
      </GlassLocalizationProvider>
    </LocalizationStoryFrame>
  ),
};
