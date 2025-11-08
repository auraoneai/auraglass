import { cn } from '../../lib/utilsComprehensive';
import React, { forwardRef, useState, useEffect, useCallback } from 'react';
import { OptimizedGlass } from '../../primitives';

export interface GlassConnectionStatusProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Connection status
   * @default 'auto' - automatically detect
   */
  status?: 'online' | 'offline' | 'slow' | 'auto';
  /**
   * Show status text
   * @default true
   */
  showText?: boolean;
  /**
   * Show connection speed/quality
   * @default false
   */
  showQuality?: boolean;
  /**
   * Position of the indicator
   * @default 'top-right'
   */
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'inline';
  /**
   * Size of the indicator
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg';
  /**
   * Glassmorphism elevation level
   * @default 'level3'
   */
  elevation?: 'level1' | 'level2' | 'level3' | 'level4' | 'level5';
  /**
   * Auto-hide when online after duration (milliseconds)
   * @default 0 - don't auto-hide
   */
  autoHideDelay?: number;
  /**
   * Callback when status changes
   */
  onStatusChange?: (status: 'online' | 'offline' | 'slow') => void;
  /**
   * Enable pulse animation
   * @default true
   */
  animate?: boolean;
  /**
   * Custom labels for each status
   */
  labels?: {
    online?: string;
    offline?: string;
    slow?: string;
  };
}

const defaultLabels = {
  online: 'Online',
  offline: 'Offline',
  slow: 'Slow Connection',
};

export const GlassConnectionStatus = forwardRef<HTMLDivElement, GlassConnectionStatusProps>(
  (
    {
      status: statusProp = 'auto',
      showText = true,
      showQuality = false,
      position = 'top-right',
      size = 'md',
      elevation = 'level3',
      autoHideDelay = 0,
      onStatusChange,
      animate = true,
      labels = defaultLabels,
      className,
      ...props
    },
    ref
  ) => {
    const [status, setStatus] = useState<'online' | 'offline' | 'slow'>('online');
    const [effectiveType, setEffectiveType] = useState<string>('');
    const [isVisible, setIsVisible] = useState(true);

    const checkConnection = useCallback(() => {
      if (typeof window === 'undefined') return 'online';

      const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
      const online = navigator.onLine;

      if (!online) {
        return 'offline';
      }

      if (connection) {
        const effectiveType = connection.effectiveType;
        setEffectiveType(effectiveType);

        if (effectiveType === 'slow-2g' || effectiveType === '2g') {
          return 'slow';
        }
      }

      return 'online';
    }, []);

    useEffect(() => {
      if (statusProp !== 'auto') {
        setStatus(statusProp);
        onStatusChange?.(statusProp);
        return;
      }

      const updateStatus = () => {
        const newStatus = checkConnection();
        setStatus(newStatus);
        onStatusChange?.(newStatus);

        if (newStatus === 'online' && autoHideDelay > 0) {
          setTimeout(() => setIsVisible(false), autoHideDelay);
        } else {
          setIsVisible(true);
        }
      };

      updateStatus();

      const handleOnline = () => updateStatus();
      const handleOffline = () => updateStatus();
      const handleConnectionChange = () => updateStatus();

      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);

      const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
      if (connection) {
        connection.addEventListener('change', handleConnectionChange);
      }

      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
        if (connection) {
          connection.removeEventListener('change', handleConnectionChange);
        }
      };
    }, [statusProp, autoHideDelay, checkConnection, onStatusChange]);

    if (!isVisible) return null;

    const sizeClasses = {
      sm: { dot: 'w-2 h-2', text: 'glass-text-xs', padding: 'glass-p-2', icon: 'w-4 h-4' },
      md: { dot: 'w-3 h-3', text: 'glass-text-sm', padding: 'glass-p-3', icon: 'w-5 h-5' },
      lg: { dot: 'w-4 h-4', text: 'glass-text-base', padding: 'glass-p-4', icon: 'w-6 h-6' },
    };

    const statusConfig = {
      online: {
        color: 'bg-green-500',
        textColor: 'text-green-500',
        label: labels.online || defaultLabels.online,
        icon: (
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={sizeClasses[size].icon}>
            <path
              d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ),
      },
      offline: {
        color: 'bg-red-500',
        textColor: 'text-red-500',
        label: labels.offline || defaultLabels.offline,
        icon: (
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={sizeClasses[size].icon}>
            <path
              d="M3 3L21 21M16 8C17.5 9.5 18 10 18 12C18 14 17.5 14.5 16 16M8 8C6.5 9.5 6 10 6 12C6 14 6.5 14.5 8 16M12 12V12.01M12 8V8.01M12 16V16.01"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ),
      },
      slow: {
        color: 'bg-yellow-500',
        textColor: 'text-yellow-500',
        label: labels.slow || defaultLabels.slow,
        icon: (
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={sizeClasses[size].icon}>
            <path
              d="M12 2V6M12 18V22M4.93 4.93L7.76 7.76M16.24 16.24L19.07 19.07M2 12H6M18 12H22M4.93 19.07L7.76 16.24M16.24 7.76L19.07 4.93"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={animate ? 'animate-pulse' : ''}
            />
          </svg>
        ),
      },
    };

    const config = statusConfig[status];

    const positionClasses = {
      'top-left': 'fixed top-4 left-4',
      'top-right': 'fixed top-4 right-4',
      'bottom-left': 'fixed bottom-4 left-4',
      'bottom-right': 'fixed bottom-4 right-4',
      'inline': 'inline-flex',
    };

    return (
      <OptimizedGlass data-glass-component
        ref={ref}
        elevation={elevation}
        className={cn(
          'flex items-center gap-2 glass-radius-full',
          sizeClasses[size].padding,
          position !== 'inline' && 'z-50',
          positionClasses[position],
          className
        )}
        role="status"
        aria-live="polite"
        aria-atomic="true"
        {...props}
      >
        <div className="relative flex items-center gap-2">
          {config.icon ? (
            <div className={config.textColor}>
              {config.icon}
            </div>
          ) : (
            <div className="relative flex items-center justify-center">
              <div
                className={cn(
                  sizeClasses[size].dot,
                  config.color,
                  'rounded-full',
                  animate && 'animate-pulse'
                )}
              />
              {animate && status !== 'online' && (
                <div
                  className={cn(
                    sizeClasses[size].dot,
                    config.color,
                    'rounded-full absolute animate-ping opacity-75'
                  )}
                />
              )}
            </div>
          )}

          {showText && (
            <span className={cn(sizeClasses[size].text, 'font-medium glass-text-primary')}>
              {config.label}
            </span>
          )}

          {showQuality && effectiveType && (
            <span className={cn(sizeClasses[size].text, 'glass-text-secondary uppercase')}>
              {effectiveType}
            </span>
          )}
        </div>
      </OptimizedGlass>
    );
  }
);

GlassConnectionStatus.displayName = 'GlassConnectionStatus';

export default GlassConnectionStatus;
