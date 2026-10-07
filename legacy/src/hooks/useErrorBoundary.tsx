"use client";
import React, { useState, useCallback, useEffect, useRef } from "react";

export interface ErrorInfo {
  componentStack: string;
  errorBoundary?: string;
  timestamp: number;
}

export interface ErrorState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorId: string | null;
  retryCount: number;
}

export interface ErrorBoundaryOptions {
  maxRetries?: number;
  resetOnPropsChange?: boolean;
  resetTimeout?: number;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  onReset?: () => void;
  fallback?: React.ComponentType<{
    error: Error;
    errorInfo: ErrorInfo;
    retry: () => void;
  }>;
}

/**
 * Enhanced error boundary hook with retry logic and error reporting
 */
export function useErrorBoundary(options: ErrorBoundaryOptions = {}) {
  const {
    maxRetries = 3,
    resetOnPropsChange = true,
    resetTimeout = 5000,
    onError,
    onReset,
  } = options;

  const [errorState, setErrorState] = useState<ErrorState>({
    hasError: false,
    error: null,
    errorInfo: null,
    errorId: null,
    retryCount: 0,
  });

  const resetTimeoutRef = useRef<NodeJS.Timeout>();
  const propsHashRef = useRef<string>("");

  // Generate error ID for tracking
  const generateErrorId = useCallback(() => {
    return `error-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }, []);

  // Capture error with enhanced information
  const captureError = useCallback(
    (error: Error, errorInfo?: Partial<ErrorInfo>) => {
      const enhancedErrorInfo: ErrorInfo = {
        componentStack: errorInfo?.componentStack || "",
        errorBoundary: errorInfo?.errorBoundary || "useErrorBoundary",
        timestamp: Date.now(),
      };

      const errorId = generateErrorId();

      setErrorState((prev) => {
        const newErrorState = {
          hasError: true,
          error,
          errorInfo: enhancedErrorInfo,
          errorId,
          retryCount: prev.retryCount,
        };

        // Report error to external service
        onError?.(error, enhancedErrorInfo);

        // Auto-reset after timeout if retries available
        if (resetTimeout > 0 && prev.retryCount < maxRetries) {
          resetTimeoutRef.current = setTimeout(() => {
            retry();
          }, resetTimeout);
        }

        return newErrorState;
      });
    },
    [generateErrorId, onError, resetTimeout, maxRetries]
  );

  // Reset error state
  const resetError = useCallback(() => {
    setErrorState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null,
      retryCount: 0,
    });

    if (resetTimeoutRef.current) {
      clearTimeout(resetTimeoutRef.current);
    }

    onReset?.();
  }, [onReset]);

  // Retry with incremented counter
  const retry = useCallback(() => {
    setErrorState((prev) => {
      if (prev.retryCount >= maxRetries) {
        return prev; // Don't retry if max retries reached
      }

      return {
        hasError: false,
        error: null,
        errorInfo: null,
        errorId: null,
        retryCount: prev.retryCount + 1,
      };
    });

    if (resetTimeoutRef.current) {
      clearTimeout(resetTimeoutRef.current);
    }

    onReset?.();
  }, [maxRetries, onReset]);

  // Create error boundary wrapper
  const withErrorBoundary = useCallback(
    <P extends object>(
      Component: React.ComponentType<P>,
      fallback?: React.ComponentType<{
        error: Error;
        errorInfo: ErrorInfo;
        retry: () => void;
      }>
    ) => {
      return React.forwardRef<unknown, P>((props, ref) => {
        try {
          if (errorState.hasError && errorState.error && errorState.errorInfo) {
            if (fallback) {
              const FallbackComponent = fallback;
              return (
                <FallbackComponent
                  error={errorState.error}
                  errorInfo={errorState.errorInfo}
                  retry={retry}
                />
              );
            }

            // Default fallback UI
            return (
              <div className="glass-p-4 glass-border glass-border-red/20 glass-surface-danger/10 glass-radius-lg">
                <h3 className="glass-text-primary glass-font-semibold glass-mb-2">
                  Something went wrong
                </h3>
                <p className="glass-text-secondary glass-text-sm glass-mb-3">
                  {errorState.error.message}
                </p>
                {errorState.retryCount < maxRetries && (
                  <button
                    onClick={retry}
                    className="glass-px-3 glass-py-1 glass-surface-danger/20 glass-text-secondary glass-radius hover:glass-surface-red/30 glass-transition-colors glass-focus glass-touch-target glass-contrast-guard"
                  >
                    Try Again ({maxRetries - errorState.retryCount} attempts
                    left)
                  </button>
                )}
              </div>
            );
          }

          const ComponentWithRef = Component as React.ComponentType<
            React.PropsWithoutRef<P> & React.RefAttributes<unknown>
          >;
          return <ComponentWithRef {...props} ref={ref} />;
        } catch (error) {
          captureError(error as Error);
          return null;
        }
      });
    },
    [errorState, retry, maxRetries, captureError]
  );

  // Reset on props change (if enabled)
  useEffect(() => {
    if (!resetOnPropsChange) return;

    const currentPropsHash = JSON.stringify(arguments);
    if (propsHashRef.current !== currentPropsHash && errorState.hasError) {
      resetError();
    }
    propsHashRef.current = currentPropsHash;
  }, [resetOnPropsChange, errorState.hasError, resetError]);

  // Cleanup timeouts
  useEffect(() => {
    return () => {
      if (resetTimeoutRef.current) {
        clearTimeout(resetTimeoutRef.current);
      }
    };
  }, []);

  return {
    ...errorState,
    captureError,
    resetError,
    retry,
    withErrorBoundary,
    canRetry: errorState.retryCount < maxRetries,
  };
}

/**
 * Hook for async error handling with retry logic
 */
export function useAsyncError() {
  const [error, setError] = useState<Error | null>(null);
  const [isRetrying, setIsRetrying] = useState(false);
  const retryCountRef = useRef(0);

  const captureAsyncError = useCallback((error: Error) => {
    setError(error);
  }, []);

  const retryAsync = useCallback(
    async <T,>(
      asyncFn: () => Promise<T>,
      maxRetries: number = 3
    ): Promise<T> => {
      setIsRetrying(true);
      setError(null);

      for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
          const result = await asyncFn();
          setIsRetrying(false);
          retryCountRef.current = 0;
          return result;
        } catch (error) {
          if (attempt === maxRetries) {
            captureAsyncError(error as Error);
            setIsRetrying(false);
            retryCountRef.current = attempt + 1;
            throw error;
          }

          // Wait before retry with exponential backoff
          await new Promise((resolve) =>
            setTimeout(resolve, Math.pow(2, attempt) * 1000)
          );
        }
      }

      throw new Error("Async retry loop exited unexpectedly");
    },
    [captureAsyncError]
  );

  const clearError = useCallback(() => {
    setError(null);
    retryCountRef.current = 0;
  }, []);

  return {
    error,
    isRetrying,
    retryCount: retryCountRef.current,
    captureAsyncError,
    retryAsync,
    clearError,
  };
}

/**
 * Hook for graceful degradation
 */
export function useGracefulDegradation<T>(
  primaryFeature: () => T,
  fallbackFeature: () => T,
  testCondition: () => boolean
): T {
  const [result, setResult] = useState<T>(() => {
    try {
      return testCondition() ? primaryFeature() : fallbackFeature();
    } catch {
      return fallbackFeature();
    }
  });

  useEffect(() => {
    try {
      const shouldUsePrimary = testCondition();
      setResult(shouldUsePrimary ? primaryFeature() : fallbackFeature());
    } catch {
      setResult(fallbackFeature());
    }
  }, [primaryFeature, fallbackFeature, testCondition]);

  return result;
}

/**
 * Hook for error reporting and analytics
 */
export function useErrorReporting(
  options: {
    enableReporting?: boolean;
    endpoint?: string;
    apiKey?: string;
    userId?: string;
    sessionId?: string;
  } = {}
) {
  const {
    enableReporting = false,
    endpoint,
    apiKey,
    userId,
    sessionId,
  } = options;

  const reportError = useCallback(
    async (
      error: Error,
      context: {
        component?: string;
        action?: string;
        metadata?: Record<string, unknown>;
      } = {}
    ) => {
      if (!enableReporting || !endpoint) return;

      try {
        const errorReport = {
          message: error.message,
          stack: error.stack,
          timestamp: Date.now(),
          url: window.location.href,
          userAgent: navigator.userAgent,
          userId,
          sessionId,
          context,
        };

        await fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(apiKey && { Authorization: `Bearer ${apiKey}` }),
          },
          body: JSON.stringify(errorReport),
        });
      } catch {
        // Reporting failures should not surface through the UI.
      }
    },
    [enableReporting, endpoint, apiKey, userId, sessionId]
  );

  return { reportError };
}
