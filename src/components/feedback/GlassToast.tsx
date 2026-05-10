"use client";
import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import { Glass } from "../../primitives";
import { cn } from "../../lib/utilsComprehensive";
import { useReducedMotion } from "../../hooks/useReducedMotion";

export type ToastType = "success" | "error" | "warning" | "info";

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
  dismissible?: boolean;
}

interface ToastContextType {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, "id">) => void;
  removeToast: (id: string) => void;
  clearAllToasts: () => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

const defaultToastContext: ToastContextType = {
  toasts: [],
  addToast: () => {},
  removeToast: () => {},
  clearAllToasts: () => {},
};

export const useToast = () => {
  const context = useContext(ToastContext);
  return context ?? defaultToastContext;
};

interface ToastProviderProps {
  children: React.ReactNode;
  maxToasts?: number;
  position?:
    | "top-right"
    | "top-left"
    | "bottom-right"
    | "bottom-left"
    | "top-center"
    | "bottom-center";
}

export const ToastProvider: React.FC<ToastProviderProps> = ({
  children,
  maxToasts = 5,
  position = "top-right",
}) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback(
    (toastData: Omit<Toast, "id">) => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const newToast: Toast = {
        id,
        duration: 5000,
        dismissible: true,
        ...toastData,
      };

      setToasts((prev) => {
        const newToasts = [newToast, ...prev];
        return newToasts.slice(0, maxToasts);
      });

      // Auto-remove toast after duration
      if (newToast.duration && newToast.duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, newToast.duration);
      }
    },
    [maxToasts]
  );

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const clearAllToasts = useCallback(() => {
    setToasts([]);
  }, []);

  const getPositionClasses = () => {
    const positions = {
      "top-right": "top-4 right-4",
      "top-left": "top-4 left-4",
      "bottom-right": "bottom-4 right-4",
      "bottom-left": "bottom-4 left-4",
      "top-center": "top-4 left-1/2 -translate-x-1/2",
      "bottom-center": "bottom-4 left-1/2 -translate-x-1/2",
    };
    return positions[position];
  };

  return (
    <ToastContext.Provider
      value={{ toasts, addToast, removeToast, clearAllToasts }}
    >
      {children}

      {/* Toast Container */}
      <div
        className={cn("fixed z-50 flex flex-col gap-2", getPositionClasses())}
      >
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

interface ToastItemProps {
  toast: Toast;
  onRemove: (id: string) => void;
}

const ToastItem: React.FC<ToastItemProps> = ({ toast, onRemove }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    // Trigger entrance animation - instant if reduced motion
    const timeout = setTimeout(
      () => setIsVisible(true),
      prefersReducedMotion ? 0 : 50
    );
    return () => clearTimeout(timeout);
  }, [prefersReducedMotion]);

  const handleRemove = () => {
    setIsRemoving(true);
    // Instant removal if reduced motion
    setTimeout(() => onRemove(toast.id), prefersReducedMotion ? 0 : 300);
  };

  const getToastIcon = () => {
    const icons = {
      success: "✅",
      error: "❌",
      warning: "⚠️",
      info: "ℹ️",
    };
    return icons[toast.type];
  };

  const getToastColors = () => {
    const colors = {
      success: "border-green-200 bg-green-50 text-green-900",
      error: "border-red-200 bg-red-50 text-red-900",
      warning: "border-yellow-200 bg-yellow-50 text-yellow-900",
      info: "border-blue-200 bg-blue-50 text-blue-900",
    };
    return colors[toast.type];
  };

  const getProgressBarColor = () => {
    const colors = {
      success: "bg-green-500",
      error: "bg-red-500",
      warning: "bg-yellow-500",
      info: "bg-blue-500",
    };
    return colors[toast.type];
  };

  return (
    <Glass
      role="status"
      aria-live="polite"
      data-glass-toast="true"
      data-toast-type={toast.type}
      className={cn(
        "w-96 max-w-sm glass-p-4 glass-radius-lg border-2 shadow-lg transform",
        !prefersReducedMotion && "transition-all duration-300",
        getToastColors(),
        isVisible && !isRemoving
          ? "translate-x-0 opacity-100"
          : prefersReducedMotion
            ? "opacity-100"
            : "translate-x-full opacity-0",
        isRemoving &&
          (prefersReducedMotion ? "opacity-0" : "-translate-x-full opacity-0")
      )}
    >
      <div className="glass-flex glass-items-start glass-gap-3">
        <div className="glass-text-lg glass-flex-shrink-0 glass-mt-0-5">
          {getToastIcon()}
        </div>

        <div className="glass-flex-1 glass-min-glass-w-0">
          <div className="glass-flex glass-items-center glass-justify-between">
            <h4 className="glass-font-semibold glass-text-sm glass-truncate glass-pr-2">
              {toast.title}
            </h4>
            {toast.dismissible && (
              <button
                onClick={handleRemove}
                className="glass-flex-shrink-0 glass-w-5 glass-h-5 glass-flex glass-items-center glass-justify-center glass-radius-full hover:glass-surface-dark/10 glass-transition-colors glass-text-xs glass-opacity-70 glass-hover-opacity-100 glass-focus glass-touch-target glass-contrast-guard glass-focus glass-touch-target glass-contrast-guard"
              >
                ✕
              </button>
            )}
          </div>

          {toast.message && (
            <p className="glass-text-sm glass-opacity-90 glass-mt-1 glass-leading-relaxed">
              {toast.message}
            </p>
          )}

          {toast.action && (
            <button
              onClick={() => {
                toast.action!.onClick();
                handleRemove();
              }}
              className="glass-mt-2 glass-text-sm glass-font-medium glass-underline glass-hover-no-underline glass-transition-all"
            >
              {toast.action.label}
            </button>
          )}
        </div>
      </div>

      {/* Progress bar */}
      {toast.duration && toast.duration > 0 && !prefersReducedMotion && (
        <div className="glass-mt-3 glass-w-full glass-h-1 glass-surface-dark/10 glass-radius-full glass-overflow-hidden">
          <div
            className={cn(
              "h-full glass-radius-full transition-all ease-linear",
              getProgressBarColor()
            )}
            style={{
              animation: `shrink ${toast.duration}ms linear forwards`,
            }}
          />
        </div>
      )}

      <style>{`
        @keyframes shrink {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </Glass>
  );
};

// Convenience hook for common toast types
export const useToastHelpers = () => {
  const { addToast } = useToast();

  const success = useCallback(
    (title: string, message?: string, options?: Partial<Toast>) =>
      addToast({ type: "success", title, message, ...options }),
    [addToast]
  );

  const error = useCallback(
    (title: string, message?: string, options?: Partial<Toast>) =>
      addToast({ type: "error", title, message, ...options }),
    [addToast]
  );

  const warning = useCallback(
    (title: string, message?: string, options?: Partial<Toast>) =>
      addToast({ type: "warning", title, message, ...options }),
    [addToast]
  );

  const info = useCallback(
    (title: string, message?: string, options?: Partial<Toast>) =>
      addToast({ type: "info", title, message, ...options }),
    [addToast]
  );

  return { success, error, warning, info };
};

const ToastDemoControls = ({ autoDemo }: { autoDemo: boolean }) => {
  const { success, warning, error } = useToastHelpers();

  useEffect(() => {
    if (!autoDemo) return;
    const timer = setTimeout(() => {
      success("Glass toast ready", "Adaptive feedback online");
    }, 200);
    return () => clearTimeout(timer);
  }, [autoDemo, success]);

  const buttons = [
    { label: "Success", action: () => success("Synced", "Glass data saved") },
    { label: "Warning", action: () => warning("Slow network", "Retry soon") },
    { label: "Error", action: () => error("Upload failed") },
  ];

  return (
    <div className="glass-flex glass-flex-wrap glass-gap-2">
      {buttons.map((button) => (
        <button
          key={button.label}
          type="button"
          onClick={button.action}
          className="glass-px-4 glass-py-2 glass-radius-full glass-surface-subtle glass-text-sm glass-focus glass-touch-target glass-contrast-guard"
        >
          {button.label} toast
        </button>
      ))}
    </div>
  );
};

export interface GlassToastProps extends React.HTMLAttributes<HTMLDivElement> {
  maxToasts?: number;
  position?: ToastProviderProps["position"];
  autoDemo?: boolean;
  children?: React.ReactNode;
}

export const GlassToast: React.FC<GlassToastProps> = ({
  maxToasts,
  position,
  autoDemo = false,
  className,
  children,
  ...rest
}) => (
  <ToastProvider maxToasts={maxToasts} position={position}>
    <div
      className={cn("glass-toast-demo glass-space-y-4", className)}
      {...rest}
    >
      {children ?? <ToastDemoControls autoDemo={autoDemo} />}
    </div>
  </ToastProvider>
);

export default GlassToast;
