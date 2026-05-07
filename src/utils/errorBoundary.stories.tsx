import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import {
  GlassErrorBoundary,
  GlassAsyncErrorBoundary,
  GlassLightErrorBoundary,
  GlassComponentErrorBoundary,
  withGlassErrorBoundary
} from './errorBoundary';

const meta: Meta<typeof GlassErrorBoundary> = {
  title: 'Effects + Advanced/error Boundary',
  component: GlassErrorBoundary,
  parameters: {
    layout: 'fullscreen',
    previewSurface: 'app',
    docs: {
      description: {
        component: 'Comprehensive error boundary components with glass morphism styling for graceful error handling.',
      },
    },
  },
  argTypes: {
    maxRetries: {
      control: { type: 'number', min: 0, max: 10 },
      description: 'Maximum number of retry attempts',
    },
    resetOnPropsChange: {
      control: 'boolean',
      description: 'Reset error state when props change',
    },
  },
  args: {
    maxRetries: 3,
    resetOnPropsChange: true,
  },
};

export default meta;
type Story = StoryObj<typeof GlassErrorBoundary>;

const ErrorStoryFrame = ({ children }: { children: React.ReactNode }) => (
  <div
    data-bg="light"
    className="glass-on-light glass-error-boundary-story"
    style={{
      width: '100%',
      minHeight: '100vh',
      padding: 'clamp(20px, 4vw, 40px)',
      boxSizing: 'border-box',
      overflowX: 'hidden',
      display: 'grid',
      placeItems: 'center',
      backgroundColor: '#f8fafc',
      backgroundImage:
        'linear-gradient(135deg, #f8fafc 0%, #e7f0ff 44%, #f6efff 100%)',
      color: '#0f172a',
    }}
  >
    <style>{`
      .glass-error-boundary-story button {
        min-height: 44px;
      }

      [data-storybook-preview-mode="dark"] .glass-error-boundary-story .glass-surface-warning\\/20 {
        background: #fbbf24 !important;
        border: 1px solid rgba(146, 64, 14, 0.46) !important;
        color: #111827 !important;
      }

      [data-storybook-preview-mode="dark"] .glass-error-boundary-story button.glass-surface-warning\\/20:hover {
        background: #f59e0b !important;
        color: #111827 !important;
      }

      [data-storybook-preview-mode="high-contrast"] .glass-error-boundary-story button {
        background: #000 !important;
        border: 2px solid #fff !important;
        color: #fff !important;
      }
    `}</style>
    <div style={{ width: 'min(100%, 520px)' }}>{children}</div>
  </div>
);

const ErrorStatePreview = ({
  title = 'Loading Failed',
  message = 'The operation could not be completed.',
  children,
}: {
  title?: string;
  message?: string;
  children?: React.ReactNode;
}) => (
  <div className="glass-p-6 text-center glass-auto-gap glass-auto-gap-lg">
    <div className="w-16 h-16 mx-auto rounded-full bg-red-500/15 border border-red-500/20 flex items-center justify-center">
      <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
      </svg>
    </div>
    <div>
      <h3 className="text-xl font-bold">{title}</h3>
      <p className="text-sm opacity-80">{message}</p>
    </div>
    {children}
  </div>
);

// Component that throws an error
const ErrorComponent = ({ shouldError }: { shouldError: boolean }) => {
  if (shouldError) {
    throw new Error('This is a test error for demonstration purposes');
  }
  return <div className="glass-p-4 text-center">Component rendered successfully!</div>;
};

const AsyncLoadingComponent = () => (
  <div className="glass-p-6 text-center glass-auto-gap glass-auto-gap-lg">
    <div className="w-12 h-12 mx-auto rounded-full border-2 border-blue-500/30 border-t-blue-600 animate-spin" />
    <div>
      <h3 className="text-lg font-semibold">Loading async resource</h3>
      <p className="text-sm opacity-80">The timeout fallback will appear without throwing a page error.</p>
    </div>
  </div>
);

export const Default: Story = {
  render: (args) => (
    <ErrorStoryFrame>
      <GlassErrorBoundary {...args}>
        <ErrorComponent shouldError={false} />
      </GlassErrorBoundary>
    </ErrorStoryFrame>
  ),
};

export const WithError: Story = {
  render: (args) => (
    <ErrorStoryFrame>
      <GlassErrorBoundary {...args}>
        <ErrorStatePreview
          title="Error Boundary Fallback"
          message="A captured render failure is represented here without throwing in Storybook."
        />
      </GlassErrorBoundary>
    </ErrorStoryFrame>
  ),
};

export const AsyncErrorBoundary: Story = {
  render: (args) => (
    <ErrorStoryFrame>
      <GlassAsyncErrorBoundary {...args} timeout={900}>
        <AsyncLoadingComponent />
      </GlassAsyncErrorBoundary>
    </ErrorStoryFrame>
  ),
};

export const LightErrorBoundary: Story = {
  render: (args) => (
    <ErrorStoryFrame>
      <GlassLightErrorBoundary
        fallback={<div className="glass-p-4 text-center text-red-600">Something went wrong!</div>}
      >
        <ErrorStatePreview
          title="Lightweight Fallback"
          message="Non-critical content can collapse into a compact fallback state."
        />
      </GlassLightErrorBoundary>
    </ErrorStoryFrame>
  ),
};

export const ComponentErrorBoundary: Story = {
  render: (args) => (
    <ErrorStoryFrame>
      <GlassComponentErrorBoundary {...args}>
        <ErrorStatePreview
          title="Component Fallback"
          message="The component boundary keeps the rest of the preview stable."
        />
      </GlassComponentErrorBoundary>
    </ErrorStoryFrame>
  ),
};

export const WithRetry: Story = {
  render: (args) => {
    const [shouldError, setShouldError] = React.useState(true);

    return (
      <ErrorStoryFrame>
        <GlassErrorBoundary {...args}>
          {shouldError ? (
            <ErrorStatePreview
              title="Error Occurred"
              message="Something went wrong, but the preview can recover."
            >
              <div className="flex flex-wrap justify-center gap-2">
                <button
                  onClick={() => setShouldError(false)}
                  className="glass-px-4 glass-py-2 glass-surface-success rounded-lg hover:bg-green-500/30 transition-colors glass-focus glass-touch-target glass-contrast-guard"
                >
                  Fix Error
                </button>
              </div>
            </ErrorStatePreview>
          ) : (
            <ErrorComponent shouldError={false} />
          )}
        </GlassErrorBoundary>
      </ErrorStoryFrame>
    );
  },
};

export const WithCustomFallback: Story = {
  render: (args) => (
    <ErrorStoryFrame>
      <GlassErrorBoundary {...args}>
        <div className="p-8 text-center glass-auto-gap glass-auto-gap-lg max-w-md">
          <div className="w-16 h-16 mx-auto rounded-full bg-red-500/20 flex items-center justify-center">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold">Oops! Something went wrong</h3>
          <p className="text-sm opacity-80">
            We encountered an unexpected error. Our team has been notified.
          </p>
          <div className="text-xs opacity-60 font-mono bg-black/20 rounded p-2">
            Error ID: storybook-preview
          </div>
          <div className="flex justify-center space-x-2">
            <button
              type="button"
              className="px-6 glass-py-2 glass-surface-primary rounded-lg hover:bg-blue-500/30 transition-colors font-medium glass-focus glass-touch-target glass-contrast-guard"
            >
              Try Again
            </button>
          </div>
        </div>
      </GlassErrorBoundary>
    </ErrorStoryFrame>
  ),
};
