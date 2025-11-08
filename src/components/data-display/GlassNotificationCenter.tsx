import React, { useState, useEffect, createContext, useContext, forwardRef } from 'react';
import { cn } from '../../lib/utilsComprehensive';
import { OptimizedGlass } from '../../primitives';
import { Motion } from '../../primitives';
import { ContrastGuard, TextWithContrast } from '@/components/accessibility/ContrastGuard';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface GlassNotification {
  id: string;
  type: NotificationType;
  title: string;
  message?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
  persistent?: boolean;
}

export interface GlassNotificationCenterProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Position of the notification center */
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
  /** Maximum number of notifications to show */
  maxNotifications?: number;
  /** Auto-hide delay for non-persistent notifications (ms) */
  autoHideDelay?: number;
  /** Animation preset for notifications */
  animation?: 'slide' | 'fade' | 'scale' | 'bounce';
  /** Whether to show clear all button */
  showClearAll?: boolean;
}

interface NotificationContextType {
  notifications: GlassNotification[];
  addNotification: (notification: Omit<GlassNotification, 'id'>) => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    console.warn('useNotifications must be used within a GlassNotificationProvider. Using default values.');
    return {
      notifications: [],
      addNotification: () => {},
      removeNotification: () => {},
      clearAll: () => {},
    };
  }
  return context;
};

export const GlassNotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<GlassNotification[]>([]);

  const addNotification = (notification: Omit<GlassNotification, 'id'>) => {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    const newNotification: GlassNotification = {
      ...notification,
      id,
    };

    setNotifications((prev: any) => [newNotification, ...prev]);

    // Auto-remove non-persistent notifications
    if (!newNotification.persistent) {
      const duration = newNotification.duration || 5000;
      setTimeout(() => {
        removeNotification(id);
      }, duration);
    }
  };

  const removeNotification = (id: string) => {
    setNotifications((prev: any) => prev.filter((notification: any) => notification.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  return (
    <NotificationContext.Provider data-glass-component value={{
      notifications,
      addNotification,
      removeNotification,
      clearAll,
    }}>
      {children}
    </NotificationContext.Provider>
  );
};

/**
 * GlassNotificationCenter component
 * A notification center with glassmorphism styling for managing toast notifications
 */
export const GlassNotificationCenter = forwardRef<HTMLDivElement, GlassNotificationCenterProps>(
  (
    {
  // TODO: Integrate ContrastGuard for table cells, list items, badges, card titles, and other text content for WCAG AA compliance

      position = 'top-right',
      maxNotifications = 5,
      autoHideDelay = 5000,
      animation = 'slide',
      showClearAll = true,
      className,
      ...props
    },
    ref
  ) => {
  const { notifications, removeNotification, clearAll } = useNotifications();

  const positionClasses = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-center': 'top-4 left-1/2 transform -translate-x-1/2',
    'bottom-center': 'bottom-4 left-1/2 transform -translate-x-1/2',
  };

  const displayedNotifications = notifications.slice(0, maxNotifications);

  const getTypeStyles = (type: NotificationType) => {
    switch (type) {
      case 'success':
        return {
          icon: '✓',
          bgClass: 'border-green-500/20 bg-green-500/10',
          iconClass: 'text-green-400',
        };
      case 'error':
        return {
          icon: '✕',
          bgClass: 'border-red-500/20 bg-red-500/10',
          iconClass: 'text-red-400',
        };
      case 'warning':
        return {
          icon: '⚠',
          bgClass: 'border-yellow-500/20 bg-yellow-500/10',
          iconClass: 'text-yellow-400',
        };
      case 'info':
      default:
        return {
          icon: 'ℹ',
          bgClass: 'border-blue-500/20 bg-blue-500/10',
          iconClass: 'text-blue-400',
        };
    }
  };

  if (displayedNotifications.length === 0) {
    return null;
  }

    return (
      <div
        ref={ref}
        className={cn(
          'fixed z-50 glass-gap-2',
          positionClasses[position],
          className
        )}
        {...props}
      >
        {/* Clear All Button */}
        {showClearAll && notifications.length > 1 && (
          <OptimizedGlass
            elevation="level1"
            intensity="medium"
            depth={1}
            tint="neutral"
            border="subtle"
            animation="none"
            performanceMode="low"
            className="px-3 py-1 glass-radius-full text-xs cursor-pointer hover:glass-surface-subtle/10 transition-colors"
            onClick={clearAll}
          >
            Clear All ({notifications.length})
          </OptimizedGlass>
        )}

        {/* Notifications */}
        {displayedNotifications.map((notification, index) => {
          const typeStyles = getTypeStyles(notification.type);

          const getMotionPreset = () => {
            switch (animation) {
              case 'fade':
                return 'fadeIn';
              case 'scale':
                return 'scaleIn';
              case 'bounce':
                return 'bounceIn';
              case 'slide':
              default:
                return position.includes('right') ? 'slideInRight' : 'slideInLeft';
            }
          };

          return (
            <Motion
              key={notification.id}
              delay={index * 100}
            >
              <OptimizedGlass
                elevation="level2"
                intensity="medium"
                depth={2}
                tint="neutral"
                border="subtle"
                animation="none"
                performanceMode="medium"
                className={cn(
                  'min-w-80 max-w-sm glass-p-4 glass-radius-lg border glass-backdrop-blur-md',
                  typeStyles.bgClass
                )}
              >
            <div className="flex items-start gap-3">
              {/* Icon */}
              <div className={`flex-shrink-0 w-6 h-6 glass-radius-full flex items-center justify-center glass-text-sm font-bold ${typeStyles.iconClass}`}>
                {typeStyles.icon}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-primary">
                  {notification.title}
                </h4>
                {notification.message && (
                  <p className="glass-mt-1 text-sm text-primary/80">
                    {notification.message}
                  </p>
                )}

                {/* Action Button */}
                {notification.action && (
                  <button
                    onClick={notification.action.onClick}
                    className="glass-mt-2 text-sm font-medium text-primary hover:glass-text-secondary transition-colors glass-focus glass-touch-target glass-contrast-guard glass-focus glass-touch-target glass-contrast-guard"
                  >
                    {notification.action.label}
                  </button>
                )}
              </div>

              {/* Close Button */}
              <button
                onClick={(e) => removeNotification(notification.id)}
                className="flex-shrink-0 w-5 h-5 glass-radius-full flex items-center justify-center text-primary/60 hover:text-primary/90 hover:glass-surface-subtle/10 transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Progress Bar for Auto-hide */}
            {!notification.persistent && notification.duration && (
              <div className="mt-3 h-1 glass-surface-subtle/20 glass-radius-full overflow-hidden">
                <div
                  className="h-full glass-surface-subtle/40 glass-radius-full transition-all duration-100 ease-linear"
                  style={{
                    animation: `shrink ${notification.duration}ms linear forwards`,
                  }}
                />
              </div>
            )}
              </OptimizedGlass>
            </Motion>
          );
        })}
      </div>
    );
  }
);

GlassNotificationCenter.displayName = 'GlassNotificationCenter';

/**
 * Helper component for creating individual notifications
 */
export interface GlassNotificationItemProps extends React.HTMLAttributes<HTMLDivElement> {
  notification: GlassNotification;
  onClose: () => void;
}

export const GlassNotificationItem = forwardRef<HTMLDivElement, GlassNotificationItemProps>(
  ({ notification, onClose, className, ...props }, ref) => {
    const typeStyles = getTypeStyles(notification.type);

    return (
      <OptimizedGlass
        ref={ref}
        elevation="level1"
        intensity="medium"
        depth={2}
        tint="neutral"
        border="subtle"
        animation="none"
        performanceMode="medium"
        className={cn(
          'glass-p-4 glass-radius-lg border',
          typeStyles.bgClass,
          className
        )}
        {...props}
      >
      <div className="flex items-start gap-3">
        <div className={`w-6 h-6 glass-radius-full flex items-center justify-center glass-text-sm ${typeStyles.iconClass}`}>
          {typeStyles.icon}
        </div>
        <div className="flex-1">
          <h4 className="font-semibold">{notification.title}</h4>
          {notification.message && <p className="text-sm opacity-80">{notification.message}</p>}
        </div>
        <button onClick={onClose} className="glass-contrast-guard glass-focus glass-touch-target hover:text-primary text-primary/60">✕</button>
      </div>
      </OptimizedGlass>
    );
  }
);

GlassNotificationItem.displayName = 'GlassNotificationItem';

// Helper function for notification styles
const getTypeStyles = (type: NotificationType) => {
  switch (type) {
    case 'success':
      return {
        icon: '✓',
        bgClass: 'border-green-500/20 bg-green-500/10',
        iconClass: 'text-green-400',
      };
    case 'error':
      return {
        icon: '✕',
        bgClass: 'border-red-500/20 bg-red-500/10',
        iconClass: 'text-red-400',
      };
    case 'warning':
      return {
        icon: '⚠',
        bgClass: 'border-yellow-500/20 bg-yellow-500/10',
        iconClass: 'text-yellow-400',
      };
    case 'info':
    default:
      return {
        icon: 'ℹ',
        bgClass: 'border-blue-500/20 bg-blue-500/10',
        iconClass: 'text-blue-400',
      };
  }
};

// Add shrink animation for progress bar
const shrinkKeyframes = `
  @keyframes shrink {
    from { width: 100%; }
    to { width: 0%; }
  }
`;

// Inject keyframes safely with SSR check
if (typeof document !== 'undefined' && typeof window !== 'undefined') {
  const existingStyle = document.querySelector('#glass-notification-styles');
  if (!existingStyle) {
    const style = document.createElement('style');
    style.id = 'glass-notification-styles';
    style.textContent = shrinkKeyframes;
    document.head.appendChild(style);
  }
}

/**
 * Utility hooks and helpers for notifications
 */
export const useNotificationCenter = () => {
  const { addNotification, removeNotification, clearAll } = useNotifications();

  const notify = {
    success: (title: string, message?: string, options?: Partial<GlassNotification>) => {
      addNotification({ type: 'success', title, message, ...options });
    },
    error: (title: string, message?: string, options?: Partial<GlassNotification>) => {
      addNotification({ type: 'error', title, message, ...options });
    },
    warning: (title: string, message?: string, options?: Partial<GlassNotification>) => {
      addNotification({ type: 'warning', title, message, ...options });
    },
    info: (title: string, message?: string, options?: Partial<GlassNotification>) => {
      addNotification({ type: 'info', title, message, ...options });
    },
  };

  return {
    notify,
    removeNotification,
    clearAll,
  };
};
