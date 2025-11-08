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
  title: 'Utils/ErrorBoundary',
  component: GlassErrorBoundary,
  parameters: {
    layout: 'centered',
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

// Component that throws an error
const ErrorComponent = ({ shouldError }: { shouldError: boolean }) => {
  if (shouldError) {
    throw new Error('This is a test error for demonstration purposes');
  }
  return <div className="glass-p-4 text-center">Component rendered successfully!</div>;
};

// Component that throws async error
const AsyncErrorComponent = ({ shouldError }: { shouldError: boolean }) => {
  const [error, setError] = React.useState(false);

  React.useEffect(() => {
    if (shouldError) {
      setTimeout(() => {
        setError(true);
      }, 1000);
    }
  }, [shouldError]);

  if (error) {
    throw new Error('Async error occurred');
  }

  return <div className="glass-p-4 text-center">Async component working...</div>;
};

export const Default: Story = {
  render: (args) => (
    <GlassErrorBoundary {...args}>
      <ErrorComponent shouldError={false} />
    </GlassErrorBoundary>
  ),
};

export const WithError: Story = {
  render: (args) => (
    <GlassErrorBoundary {...args}>
      <ErrorComponent shouldError={true} />
    </GlassErrorBoundary>
  ),
};

export const AsyncErrorBoundary: Story = {
  render: (args) => (
    <GlassAsyncErrorBoundary {...args}>
      <AsyncErrorComponent shouldError={true} />
    </GlassAsyncErrorBoundary>
  ),
};

export const LightErrorBoundary: Story = {
  render: (args) => (
    <GlassLightErrorBoundary
      fallback={<div className="glass-p-4 text-center text-red-400">Something went wrong!</div>}
      onError={(error) => console.error('Light error boundary caught:', error)}
    >
      <ErrorComponent shouldError={true} />
    </GlassLightErrorBoundary>
  ),
};

export const ComponentErrorBoundary: Story = {
  render: (args) => (
    <GlassComponentErrorBoundary {...args}>
      <ErrorComponent shouldError={true} />
    </GlassComponentErrorBoundary>
  ),
};

export const WithRetry: Story = {
  render: (args) => {
    const [shouldError, setShouldError] = React.useState(true);

    return (
      <GlassErrorBoundary
        {...args}
        fallback={({ retry }) => (
          <div className="p-6 text-center glass-auto-gap glass-auto-gap-lg">
            <h3 className="text-lg font-semibold">Error Occurred</h3>
            <p className="text-sm opacity-80">Something went wrong, but you can retry.</p>
            <div className="space-x-2">
              <button
                onClick={retry}
                className="glass-px-4 glass-py-2 glass-surface-primary rounded-lg hover:bg-blue-500/30 transition-colors glass-focus glass-touch-target glass-contrast-guard glass-focus glass-touch-target glass-contrast-guard"
              >
                Retry
              </button>
              <button
                onClick={() => setShouldError(false)}
                className="glass-px-4 glass-py-2 glass-surface-success rounded-lg hover:bg-green-500/30 transition-colors"
              >
                Fix Error
              </button>
            </div>
          </div>
        )}
      >
        <ErrorComponent shouldError={shouldError} />
      </GlassErrorBoundary>
    );
  },
};

export const WithCustomFallback: Story = {
  render: (args) => (
    <GlassErrorBoundary
      {...args}
      fallback={({ error, retry, errorId }) => (
        <div className="p-8 text-center glass-auto-gap glass-auto-gap-lg max-w-md">
          <div className="w-16 h-16 mx-auto rounded-full bg-red-500/20 flex items-center justify-center">
            <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold">Oops! Something went wrong</h3>
          <p className="text-sm opacity-80">
            We encountered an unexpected error. Our team has been notified.
          </p>
          <div className="text-xs opacity-60 font-mono bg-black/20 rounded p-2">
            Error ID: {errorId}
          </div>
          <div className="flex justify-center space-x-2">
            <button
              onClick={retry}
              className="px-6 glass-py-2 glass-surface-primary rounded-lg hover:bg-blue-500/30 transition-colors font-medium glass-focus glass-touch-target glass-contrast-guard glass-focus glass-touch-target glass-contrast-guard"
            >
              Try Again
            </button>
          </div>
        </div>
      )}
    >
      <ErrorComponent shouldError={true} />
    </GlassErrorBoundary>
  ),
};
