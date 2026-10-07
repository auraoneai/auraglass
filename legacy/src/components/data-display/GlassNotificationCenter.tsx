"use client";
import React, {
  useState,
  useEffect,
  createContext,
  useContext,
  forwardRef,
} from "react";
import { cn } from "../../lib/utilsComprehensive";
import { OptimizedGlass } from "../../primitives";
import { Motion } from "../../primitives";
import {
  ContrastGuard,
  TextWithContrast,
} from "@/components/accessibility/ContrastGuard";
import { ANIMATION } from "../../tokens/designConstants";

const notificationSurfaceStyle: React.CSSProperties = {
  background: "rgba(255, 255, 255, 0.30)",
  border: "1px solid rgba(255, 255, 255, 0.62)",
  boxShadow:
    "inset 0 1px 0 rgba(255, 255, 255, 0.24), 0 12px 32px rgba(15, 23, 42, 0.12)",
  color: "var(--glass-theme-text, var(--glass-text-primary))",
};

const notificationControlStyle: React.CSSProperties = {
  minWidth: 44,
  minHeight: 44,
  color: "var(--glass-theme-text, var(--glass-text-primary))",
};

export type NotificationType = "success" | "error" | "warning" | "info";

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
  position?:
    | "top-right"
    | "top-left"
    | "bottom-right"
    | "bottom-left"
    | "top-center"
    | "bottom-center";
  /** Maximum number of notifications to show */
  maxNotifications?: number;
  /** Auto-hide delay for non-persistent notifications (ms) */
  autoHideDelay?: number;
  /** Animation preset for notifications */
  animation?: "slide" | "fade" | "scale" | "bounce";
  /** Whether to show clear all button */
  showClearAll?: boolean;
}

interface NotificationContextType {
  notifications: GlassNotification[];
  addNotification: (notification: Omit<GlassNotification, "id">) => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    return {
      notifications: [],
      addNotification: () => {},
      removeNotification: () => {},
      clearAll: () => {},
    };
  }
  return context;
};

export const GlassNotificationProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [notifications, setNotifications] = useState<GlassNotification[]>([]);

  const addNotification = (notification: Omit<GlassNotification, "id">) => {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    const newNotification: GlassNotification = {
      ...notification,
      id,
    };

    setNotifications((prev: any) => [newNotification, ...prev]);

    // Auto-remove non-persistent notifications
    if (!newNotification.persistent) {
      const duration =
        newNotification.duration || ANIMATION.DURATION.slower * 5;
      setTimeout(() => {
        removeNotification(id);
      }, duration);
    }
  };

  const removeNotification = (id: string) => {
    setNotifications((prev: any) =>
      prev.filter((notification: any) => notification.id !== id)
    );
  };

  const clearAll = () => {
    setNotifications([]);
  };

  return (
    <NotificationContext.Provider
      data-glass-component
      value={{
        notifications,
        addNotification,
        removeNotification,
        clearAll,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

/**
 * GlassNotificationCenter component
 * A notification center with glassmorphism styling for managing toast notifications
 */
export const GlassNotificationCenter = forwardRef<
  HTMLDivElement,
  GlassNotificationCenterProps
>(
  (
    {
      position = "top-right",
      maxNotifications = 5,
      autoHideDelay = ANIMATION.DURATION.slower * 5,
      animation = "slide",
      showClearAll = true,
      className,
      ...props
    },
    ref
  ) => {
    const { notifications, removeNotification, clearAll } = useNotifications();

    const positionClasses = {
      "top-right": "top-4 right-4",
      "top-left": "top-4 left-4",
      "bottom-right": "bottom-4 right-4",
      "bottom-left": "bottom-4 left-4",
      "top-center": "top-4 left-1/2 transform -translate-x-1/2",
      "bottom-center": "bottom-4 left-1/2 transform -translate-x-1/2",
    };

    const displayedNotifications = notifications.slice(0, maxNotifications);

    const getTypeStyles = (type: NotificationType) => {
      switch (type) {
        case "success":
          return {
            icon: "✓",
            label: "Success",
          };
        case "error":
          return {
            icon: "✕",
            label: "Error",
          };
        case "warning":
          return {
            icon: "⚠",
            label: "Warning",
          };
        case "info":
        default:
          return {
            icon: "ℹ",
            label: "Information",
          };
      }
    };

    const containerClassName = cn(
      "fixed z-50 glass-flex glass-flex-col glass-gap-2",
      positionClasses[position],
      className
    );

    const containerStyle: React.CSSProperties = {
      width: "min(22rem, calc(100vw - 2rem))",
      maxWidth: "calc(100vw - 2rem)",
    };

    if (displayedNotifications.length === 0) {
      return (
        <div
          ref={ref}
          className={containerClassName}
          style={containerStyle}
          aria-live="polite"
          data-empty
          {...props}
        >
          <span className="glass-sr-only">No notifications</span>
        </div>
      );
    }

    return (
      <div
        ref={ref}
        className={containerClassName}
        style={containerStyle}
        aria-live="polite"
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
            className="glass-self-end glass-px-3 glass-py-2 glass-radius-full glass-text-xs glass-font-medium glass-cursor-pointer glass-transition-colors"
            style={{
              ...notificationSurfaceStyle,
              minHeight: 44,
              width: "fit-content",
              boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.22)",
            }}
            onClick={clearAll}
          >
            <ContrastGuard>Clear All ({notifications.length})</ContrastGuard>
          </OptimizedGlass>
        )}

        {/* Notifications */}
        {displayedNotifications.map((notification, index) => {
          const typeStyles = getTypeStyles(notification.type);

          const getMotionPreset = () => {
            switch (animation) {
              case "fade":
                return "fadeIn";
              case "scale":
                return "scaleIn";
              case "bounce":
                return "bounceIn";
              case "slide":
              default:
                return position.includes("right")
                  ? "slideInRight"
                  : "slideInLeft";
            }
          };

          return (
            <Motion key={notification.id} delay={index * 100}>
              <OptimizedGlass
                elevation="level2"
                intensity="medium"
                depth={2}
                tint="neutral"
                border="subtle"
                animation="none"
                performanceMode="medium"
                className={cn(
                  "glass-w-full glass-p-4 glass-radius-lg glass-border glass-backdrop-blur-md"
                )}
                style={notificationSurfaceStyle}
              >
                <div className="glass-flex glass-items-start glass-gap-3">
                  {/* Icon */}
                  <div
                    className="glass-flex-shrink-0 glass-w-6 glass-h-6 glass-radius-full glass-flex glass-items-center glass-justify-center glass-text-sm glass-font-bold"
                    style={{ color: "var(--glass-theme-text-secondary, var(--glass-text-secondary))" }}
                    role="img"
                    aria-label={typeStyles.label}
                  >
                    {typeStyles.icon}
                  </div>

                  {/* Content */}
                  <div className="glass-flex-1 glass-min-w-0">
                    <ContrastGuard>
                      <h4 className="glass-text-sm glass-font-semibold glass-text-primary">
                        {notification.title}
                      </h4>
                    </ContrastGuard>
                    {notification.message && (
                      <ContrastGuard>
                        <p className="glass-mt-1 glass-text-sm glass-text-primary-glass-opacity-80">
                          {notification.message}
                        </p>
                      </ContrastGuard>
                    )}

                    {/* Action Button */}
                    {notification.action && (
                      <ContrastGuard>
                        <button
                          onClick={notification.action.onClick}
                          className="glass-mt-2 glass-px-3 glass-py-2 glass-radius-full glass-text-sm glass-font-semibold glass-transition-colors glass-focus glass-touch-target glass-contrast-guard"
                          style={{
                            ...notificationControlStyle,
                            background: "rgba(255, 255, 255, 0.24)",
                            border: "1px solid rgba(255, 255, 255, 0.18)",
                          }}
                        >
                          {notification.action.label}
                        </button>
                      </ContrastGuard>
                    )}
                  </div>

                  {/* Close Button */}
                  <button
                    onClick={(e) => removeNotification(notification.id)}
                    className="glass-flex-shrink-0 glass-radius-full glass-flex glass-items-center glass-justify-center glass-transition-colors glass-focus glass-touch-target glass-contrast-guard"
                    style={notificationControlStyle}
                  >
                    ✕
                  </button>
                </div>

                {/* Progress Bar for Auto-hide */}
                {!notification.persistent && notification.duration && (
                  <div className="glass-mt-3 glass-h-1 glass-radius-full glass-overflow-hidden" style={{ background: "rgba(15, 23, 42, 0.10)" }}>
                    <div
                      className={`glass-h-full glass-radius-full glass-transition-all glass-duration-[${ANIMATION.DURATION.fast / 6}ms] glass-ease-linear`}
                      style={{
                        background:
                          "var(--glass-theme-text-secondary, var(--glass-text-secondary))",
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

GlassNotificationCenter.displayName = "GlassNotificationCenter";

/**
 * Helper component for creating individual notifications
 */
export interface GlassNotificationItemProps extends React.HTMLAttributes<HTMLDivElement> {
  notification: GlassNotification;
  onClose: () => void;
}

export const GlassNotificationItem = forwardRef<
  HTMLDivElement,
  GlassNotificationItemProps
>(({ notification, onClose, className, style, ...props }, ref) => {
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
        "glass-w-full glass-p-4 glass-radius-lg glass-border",
        className
      )}
      style={{ ...notificationSurfaceStyle, ...style }}
      {...props}
    >
      <div className="glass-flex glass-items-start glass-gap-3">
        <div
          className="glass-w-6 glass-h-6 glass-radius-full glass-flex glass-items-center glass-justify-center glass-text-sm glass-font-bold"
          style={{ color: "var(--glass-theme-text-secondary, var(--glass-text-secondary))" }}
          role="img"
          aria-label={typeStyles.label}
        >
          {typeStyles.icon}
        </div>
        <div className="glass-flex-1">
          <ContrastGuard>
            <h4 className="glass-font-semibold">{notification.title}</h4>
          </ContrastGuard>
          {notification.message && (
            <ContrastGuard>
              <p className="glass-text-sm glass-opacity-80">
                {notification.message}
              </p>
            </ContrastGuard>
          )}
        </div>
        <button
          onClick={onClose}
          className="glass-contrast-guard glass-focus glass-touch-target glass-radius-full glass-flex glass-items-center glass-justify-center"
          style={notificationControlStyle}
        >
          ✕
        </button>
      </div>
    </OptimizedGlass>
  );
});

GlassNotificationItem.displayName = "GlassNotificationItem";

// Helper function for notification styles
const getTypeStyles = (type: NotificationType) => {
  switch (type) {
    case "success":
      return {
        icon: "✓",
        label: "Success",
      };
    case "error":
      return {
        icon: "✕",
        label: "Error",
      };
    case "warning":
      return {
        icon: "⚠",
        label: "Warning",
      };
    case "info":
    default:
      return {
        icon: "ℹ",
        label: "Information",
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
if (typeof document !== "undefined" && typeof window !== "undefined") {
  const existingStyle = document.querySelector("#glass-notification-styles");
  if (!existingStyle) {
    const style = document.createElement("style");
    style.id = "glass-notification-styles";
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
    success: (
      title: string,
      message?: string,
      options?: Partial<GlassNotification>
    ) => {
      addNotification({ type: "success", title, message, ...options });
    },
    error: (
      title: string,
      message?: string,
      options?: Partial<GlassNotification>
    ) => {
      addNotification({ type: "error", title, message, ...options });
    },
    warning: (
      title: string,
      message?: string,
      options?: Partial<GlassNotification>
    ) => {
      addNotification({ type: "warning", title, message, ...options });
    },
    info: (
      title: string,
      message?: string,
      options?: Partial<GlassNotification>
    ) => {
      addNotification({ type: "info", title, message, ...options });
    },
  };

  return {
    notify,
    removeNotification,
    clearAll,
  };
};
