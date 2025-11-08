import React, { Component, ErrorInfo, ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { GlassAdvanced } from '../primitives/glass/GlassAdvanced';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * Glass-styled Error Boundary
 * Catches errors and displays beautiful glass error UI
 */
export class GlassErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }
  
  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }
  
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log to error reporting service
    console.error('Glass Error Boundary caught:', error, errorInfo);
    
    // Call custom error handler
    this.props.onError?.(error, errorInfo);
    
    // Update state with error info
    this.setState({
      error,
      errorInfo,
    });
    
    // Send to analytics
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'exception', {
        description: error.toString(),
        fatal: false,
      });
    }
  }
  
  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };
  
  render() {
    if (this.state.hasError) {
      // Custom fallback
      if (this.props.fallback) {
        return <>{this.props.fallback}</>;
      }
      
      // Default glass error UI
      return (
        <GlassAdvanced data-glass-component
          elev={3}
          variant="danger"
          className="p-8 m-4"
          role="alert"
          aria-live="assertive"
        >
          <div className="glass-stack gap-4">
            <div className="text-2xl font-bold glass-text-balance">
              ⚠️ Something went wrong
            </div>
            
            <p className="glass-text-secondary glass-text-balance">
              We encountered an unexpected error. The issue has been logged and our team will investigate.
            </p>
            
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="glass-mt-4">
                <summary className="font-semibold cursor-pointer glass-focus">
                  Error Details (Development Only)
                </summary>
                <pre className="glass-mt-2 p-4 glass-radius-md text-xs overflow-auto glass-surface-danger">
                  {this.state.error.toString()}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}
            
            <div className="gap-4 flex">
              <button
                onClick={this.handleReset}
                className="glass-button glass-touch-target glass-focus glass-touch-target glass-contrast-guard glass-focus glass-touch-target glass-contrast-guard"
                aria-label="Try again"
              >
                Try Again
              </button>
              
              <button
                onClick={(e) => window.location.href = '/'}
                className="glass-button glass-subtle glass-touch-target"
                aria-label="Go to homepage"
              >
                Go Home
              </button>
            </div>
          </div>
        </GlassAdvanced>
      );
    }
    
    return this.props.children;
  }
}