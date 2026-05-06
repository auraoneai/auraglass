import React, {
  Component,
  ErrorInfo,
  ReactNode,
  useState,
  useEffect,
} from "react";
import { OptimizedGlassCore as OptimizedGlass } from "../primitives";
import { getSafeNavigator, getSafeWindow, isBrowser } from "./env";

export interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorId: string;
  retryCount: number;
}

export interface ErrorBoundaryProps {
  /** Children to render */
  children: ReactNode;
  /** Custom fallback component */
  fallback?: React.ComponentType<{
    error: Error;
    errorInfo: ErrorInfo;
    retry: () => void;
    errorId: string;
  }>;
  /** Maximum number of retries */
  maxRetries?: number;
  /** Whether to reset error state on props change */
  resetOnPropsChange?: boolean;
  /** Error reporting callback */
  onError?: (error: Error, errorInfo: ErrorInfo, errorId: string) => void;
  /** Reset callback */
  onReset?: () => void;
  /** Component name for debugging */
  componentName?: string;
}

/**
 * Production-ready error boundary with glassmorphism styling
 */
export class GlassErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  private resetTimeoutId: NodeJS.Timeout | null = null;

  constructor(props: ErrorBoundaryProps) {
    super(props);

    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: "",
      retryCount: 0,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    const errorId = `error-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    return {
      hasError: true,
      error,
      errorId,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const { onError, componentName = "Unknown" } = this.props;
    const { errorId } = this.state;

    // Enhanced error info
    const nav = getSafeNavigator();
    const win = getSafeWindow();

    const enhancedErrorInfo = {
      ...errorInfo,
      componentName,
      timestamp: new Date().toISOString(),
      userAgent: nav?.userAgent,
      url: win?.location.href,
    };

    this.setState({ errorInfo });

    // Report error
    onError?.(error, errorInfo, errorId);

    // Development logging
    if (process.env.NODE_ENV === "development") {
      // Use structured logging in development
      const errorLog = {
        type: "ERROR_BOUNDARY",
        componentName,
        errorId,
        error: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        timestamp: enhancedErrorInfo.timestamp,
      };
      console.group(`🚨 Error Boundary: ${componentName} (${errorId})`);
      console.table(errorLog);
      console.groupEnd();
    }

    // Production error reporting (you would integrate with your error service)
    if (process.env.NODE_ENV === "production") {
      this.reportErrorToService(error, enhancedErrorInfo, errorId);
    }
  }

  componentDidUpdate(prevProps: ErrorBoundaryProps) {
    const { resetOnPropsChange, children } = this.props;
    const { hasError } = this.state;

    // Reset error state if props changed and resetOnPropsChange is enabled
    if (hasError && resetOnPropsChange && prevProps.children !== children) {
      this.resetErrorBoundary();
    }
  }

  componentWillUnmount() {
    if (this.resetTimeoutId) {
      clearTimeout(this.resetTimeoutId);
    }
  }

  private async reportErrorToService(
    error: Error,
    errorInfo: any,
    errorId: string
  ) {
    try {
      // Example error reporting - replace with your actual service
      const errorReport = {
        errorId,
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        timestamp: errorInfo.timestamp,
        userAgent: errorInfo.userAgent,
        url: errorInfo.url,
        componentName: errorInfo.componentName,
      };

      // Production error reporting would be handled here
      // Example: await errorTrackingService.report(errorReport);

      // Example: Send to error tracking service
      // await fetch('/api/errors', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(errorReport),
      // });
    } catch {
      // Reporting failures should not cascade back into the UI.
    }
  }

  private resetErrorBoundary = () => {
    const { onReset } = this.props;

    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: "",
      retryCount: 0,
    });

    if (this.resetTimeoutId) {
      clearTimeout(this.resetTimeoutId);
      this.resetTimeoutId = null;
    }

    onReset?.();
  };

  private handleRetry = () => {
    const { maxRetries = 3 } = this.props;
    const { retryCount } = this.state;

    if (retryCount >= maxRetries) {
      return;
    }

    this.setState((prevState) => ({
      ...prevState,
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: prevState.retryCount + 1,
    }));

    this.props.onReset?.();
  };

  render() {
    const { hasError, error, errorInfo, errorId, retryCount } = this.state;
    const { children, fallback: CustomFallback, maxRetries = 3 } = this.props;

    if (hasError && error && errorInfo) {
      // Use custom fallback if provided
      if (CustomFallback) {
        return (
          <CustomFallback
            error={error}
            errorInfo={errorInfo}
            retry={this.handleRetry}
            errorId={errorId}
          />
        );
      }

      // Default glassmorphism error UI
      return (
        <OptimizedGlass
          className="glass-p-8 glass-m-4 glass-max-w-md glass-mx-auto glass-text-center"
          intensity="medium"
          elevation="level2"
        >
          <div className="glass-auto-gap glass-auto-gap-lg">
            {/* Error Icon */}
            <div className="glass-w-16 glass-h-16 glass-mx-auto glass-surface-danger/20 glass-radius-full glass-flex glass-items-center glass-justify-center">
              <svg
                className="glass-w-8 glass-h-8 glass-text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>

            {/* Error Message */}
            <div>
              <h3 className="glass-text-lg glass-font-semibold glass-text-primary glass-mb-2">
                Oops! Something went wrong
              </h3>
              <p className="glass-text-primary-opacity-70 glass-text-sm">
                {error.message || "An unexpected error occurred"}
              </p>
            </div>

            {/* Error ID */}
            <p className="glass-text-xs glass-text-primary-glass-opacity-50 glass-font-mono">
              Error ID: {errorId}
            </p>

            {/* Action Buttons */}
            <div className="glass-flex glass-flex-col glass-auto-gap glass-auto-gap-sm">
              {retryCount < maxRetries && (
                <button
                  onClick={this.handleRetry}
                  className="glass-px-4 glass-py-2 glass-surface-primary/20 glass-text-secondary glass-radius hover:glass-surface-blue/30 glass-transition-colors glass-focus glass-touch-target glass-contrast-guard"
                >
                  Try Again ({maxRetries - retryCount} attempts left)
                </button>
              )}

              <button
                onClick={() => getSafeWindow()?.location.reload?.()}
                className="glass-px-4 glass-py-2 glass-surface-subtle/10 glass-text-primary-opacity-70 glass-radius hover:glass-surface-subtle/20 glass-transition-colors glass-focus glass-touch-target glass-contrast-guard"
              >
                Reload Page
              </button>

              {/* Development only: Show error details */}
              {process.env.NODE_ENV === "development" && (
                <details className="glass-mt-4 glass-text-left">
                  <summary className="glass-cursor-pointer glass-text-primary-glass-opacity-50 glass-text-xs">
                    Show Error Details
                  </summary>
                  <pre className="glass-mt-2 glass-p-3 glass-surface-dark/20 glass-radius glass-text-xs glass-text-primary-opacity-70 glass-overflow-auto glass-max-h-32">
                    {error.stack}
                  </pre>
                  <pre className="glass-mt-2 glass-p-3 glass-surface-dark/20 glass-radius glass-text-xs glass-text-primary-opacity-70 glass-overflow-auto glass-max-h-32">
                    {errorInfo.componentStack}
                  </pre>
                </details>
              )}
            </div>
          </div>
        </OptimizedGlass>
      );
    }

    return children;
  }
}

/**
 * HOC for wrapping components with error boundary
 */
export function withGlassErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<ErrorBoundaryProps, "children">
) {
  const ComponentWithRef = Component as React.ComponentType<
    P & React.RefAttributes<unknown>
  >;

  const WrappedComponent = React.forwardRef<unknown, P>((props, ref) => {
    const componentProps = {
      ...(props as P),
      ref,
    } as P & React.RefAttributes<unknown>;

    return (
      <GlassErrorBoundary {...errorBoundaryProps}>
        <ComponentWithRef {...componentProps} />
      </GlassErrorBoundary>
    );
  });

  WrappedComponent.displayName = `withGlassErrorBoundary(${Component.displayName || Component.name})`;

  return WrappedComponent;
}

/**
 * Error boundary specifically for async operations
 */
export class GlassAsyncErrorBoundary extends Component<
  ErrorBoundaryProps & { timeout?: number },
  ErrorBoundaryState & { isTimeout: boolean }
> {
  private timeoutId: NodeJS.Timeout | null = null;

  constructor(props: ErrorBoundaryProps & { timeout?: number }) {
    super(props);

    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: "",
      retryCount: 0,
      isTimeout: false,
    };
  }

  componentDidMount() {
    const { timeout = 30000 } = this.props;

    if (timeout > 0) {
      this.timeoutId = setTimeout(() => {
        this.setState({
          hasError: true,
          error: new Error("Operation timed out"),
          errorInfo: {
            componentStack: "Async operation timeout",
          } as ErrorInfo,
          errorId: `timeout-${Date.now()}`,
          isTimeout: true,
        });
      }, timeout);
    }
  }

  componentWillUnmount() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
      errorId: `async-error-${Date.now()}`,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const { onError } = this.props;
    const { errorId } = this.state;

    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }

    this.setState({ errorInfo });
    onError?.(error, errorInfo, errorId);
  }

  render() {
    const { hasError, error, isTimeout } = this.state;
    const { children } = this.props;

    if (hasError && error) {
      return (
        <OptimizedGlass
          className="glass-p-6 glass-m-4 glass-text-center"
          intensity="medium"
          elevation="level1"
        >
          <div className="glass-auto-gap glass-auto-gap-lg">
            <div className="glass-w-12 glass-h-12 glass-mx-auto glass-surface-warning/20 glass-radius-full glass-flex glass-items-center glass-justify-center">
              {isTimeout ? (
                <svg
                  className="glass-w-6 glass-h-6 glass-text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              ) : (
                <svg
                  className="glass-w-6 glass-h-6 glass-text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              )}
            </div>

            <div>
              <h3 className="glass-text-lg glass-font-semibold glass-text-primary glass-mb-2">
                {isTimeout ? "Request Timed Out" : "Loading Failed"}
              </h3>
              <p className="glass-text-primary-opacity-70 glass-text-sm">
                {isTimeout
                  ? "The operation took too long to complete"
                  : error.message || "Failed to load content"}
              </p>
            </div>

            <button
              onClick={() => getSafeWindow()?.location.reload?.()}
              className="glass-px-4 glass-py-2 glass-surface-warning/20 glass-text-secondary glass-radius hover:glass-surface-yellow/30 glass-transition-colors glass-focus glass-touch-target glass-contrast-guard"
            >
              Reload Page
            </button>
          </div>
        </OptimizedGlass>
      );
    }

    return children;
  }
}

/**
 * Lightweight error boundary for non-critical components
 */
export const GlassLightErrorBoundary: React.FC<{
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error) => void;
}> = ({ children, fallback, onError }) => {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      setHasError(true);
      onError?.(event.error);
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      setHasError(true);
      onError?.(new Error(event.reason));
    };

    if (!isBrowser()) return;

    const win = getSafeWindow();
    if (!win) return;

    win.addEventListener("error", handleError);
    win.addEventListener("unhandledrejection", handleUnhandledRejection);
    return () => {
      win.removeEventListener("error", handleError);
      win.removeEventListener("unhandledrejection", handleUnhandledRejection);
    };
  }, [onError]);

  if (hasError) {
    return (
      <div className="glass-p-4 glass-surface-danger/10 glass-border glass-border-red/20 glass-radius glass-text-center">
        {fallback || (
          <p className="glass-text-primary glass-text-sm">
            This component failed to load
          </p>
        )}
      </div>
    );
  }

  return <>{children}</>;
};

/**
 * Error boundary specifically for glass components
 */
export const GlassComponentErrorBoundary: React.FC<{
  children: ReactNode;
  componentName?: string;
}> = ({ children, componentName = "GlassComponent" }) => {
  return (
    <GlassErrorBoundary
      componentName={componentName}
      fallback={({ error, retry, errorId }) => (
        <OptimizedGlass
          className="glass-p-4 glass-text-center glass-border glass-border-red/20"
          intensity="subtle"
          elevation="level1"
        >
          <div className="glass-auto-gap glass-auto-gap-md">
            <div className="glass-w-10 glass-h-10 glass-mx-auto glass-surface-danger/20 glass-radius-full glass-flex glass-items-center glass-justify-center">
              <span className="glass-text-primary glass-text-sm">⚠</span>
            </div>

            <div>
              <h4 className="glass-text-primary glass-font-medium glass-text-sm">
                {componentName} Error
              </h4>
              <p className="glass-text-secondary/70 glass-text-xs glass-mt-1">
                {error.message}
              </p>
            </div>

            <button
              onClick={retry}
              className="glass-px-3 glass-py-1 glass-surface-danger/20 glass-text-secondary glass-radius glass-text-xs hover:glass-surface-red/30 glass-transition-colors glass-focus glass-touch-target glass-contrast-guard"
            >
              Retry
            </button>

            {process.env.NODE_ENV === "development" && (
              <p className="glass-text-primary/50 glass-text-xs glass-font-mono">
                ID: {errorId}
              </p>
            )}
          </div>
        </OptimizedGlass>
      )}
    >
      {children}
    </GlassErrorBoundary>
  );
};
