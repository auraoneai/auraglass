/**
 * AuraGlass Accessibility Enhancement Components and HOCs
 * Higher-order components and wrappers to enhance accessibility of existing components
 */

import React, {
  forwardRef,
  useEffect,
  useRef,
  useCallback,
  useState,
} from "react";
import { cn } from "../lib/utilsComprehensive";
import {
  useScreenReaderAnnouncement,
  useKeyboardNavigation,
  useFormFieldA11y,
  useLoadingA11y,
} from "./a11yHooks";
import {
  useA11yId,
  announceToScreenReader,
  keyboardHandlers,
  focusUtils,
} from "./a11y";

/**
 * Enhanced keyboard shortcuts support
 */
export interface KeyboardShortcut {
  key: string;
  modifiers?: {
    ctrl?: boolean;
    alt?: boolean;
    shift?: boolean;
    meta?: boolean;
  };
  action: () => void;
  description?: string;
  global?: boolean;
  preventDefault?: boolean;
}

export interface UseKeyboardShortcutsOptions {
  shortcuts: KeyboardShortcut[];
  enabled?: boolean;
}

export function useKeyboardShortcuts({
  shortcuts,
  enabled = true,
}: UseKeyboardShortcutsOptions) {
  const containerRef = useRef<HTMLElement>(null);
  const { announce } = useScreenReaderAnnouncement();

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!enabled) return;

      const matchingShortcut = shortcuts.find((shortcut) => {
        const keyMatch =
          event.key.toLowerCase() === shortcut.key.toLowerCase() ||
          event.code.toLowerCase() === shortcut.key.toLowerCase();

        const modifiersMatch =
          (!shortcut.modifiers?.ctrl || event.ctrlKey) &&
          (!shortcut.modifiers?.alt || event.altKey) &&
          (!shortcut.modifiers?.shift || event.shiftKey) &&
          (!shortcut.modifiers?.meta || event.metaKey);

        return keyMatch && modifiersMatch;
      });

      if (matchingShortcut) {
        if (matchingShortcut.preventDefault !== false) {
          event.preventDefault();
          event.stopPropagation();
        }

        matchingShortcut.action();

        if (matchingShortcut.description) {
          announce(`${matchingShortcut.description} activated`, "polite");
        }
      }
    },
    [shortcuts, enabled, announce]
  );

  useEffect(() => {
    const target = containerRef.current || document;
    target.addEventListener("keydown", handleKeyDown as any);

    return () => {
      target.removeEventListener("keydown", handleKeyDown as any);
    };
  }, [handleKeyDown]);

  return { containerRef };
}

/**
 * HOC to add keyboard shortcuts to any component
 */
export function withKeyboardShortcuts<P extends {}>(
  Component: React.ComponentType<P>,
  shortcuts: KeyboardShortcut[]
) {
  return forwardRef<HTMLElement, P & { shortcutsEnabled?: boolean }>(
    (props, ref) => {
      const { shortcutsEnabled = true, ...componentProps } = props;
      const { containerRef } = useKeyboardShortcuts({
        shortcuts,
        enabled: shortcutsEnabled,
      });

      return (
        <div ref={containerRef as React.RefObject<HTMLDivElement>}>
          <Component {...(componentProps as unknown as P)} ref={ref} />
        </div>
      );
    }
  );
}

/**
 * Enhanced Skip Links Component
 */
export interface SkipLinksProps {
  links: Array<{
    href: string;
    label: string;
  }>;
  className?: string;
}

export function SkipLinks({ links, className }: SkipLinksProps) {
  return (
    <nav className={cn("skip-links", className)} aria-label="Skip links">
      <ul className="sr-only">
        {links.map((link, index) => (
          <li key={index}>
            <a
              href={link.href}
              className={cn(
                "absolute left-0 top-0 z-50 p-2 bg-primary text-primary-foreground",
                "transform -translate-y-full transition-transform",
                "focus:translate-y-0 focus:outline-none focus:ring-2 focus:ring-ring"
              )}
              onFocus={(e) => {
                e.target.style.transform = "translateY(0)";
              }}
              onBlur={(e) => {
                e.target.style.transform = "translateY(-100%)";
              }}
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/**
 * Enhanced Focus Trap Component
 */
export interface FocusTrapProps {
  children: React.ReactNode;
  active?: boolean;
  restoreFocus?: boolean;
  autoFocus?: boolean;
  escapeDeactivates?: boolean;
  onEscape?: () => void;
  className?: string;
}

export function FocusTrap({
  children,
  active = true,
  restoreFocus = true,
  autoFocus = true,
  escapeDeactivates = true,
  onEscape,
  className,
}: FocusTrapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!active || !containerRef.current) return;

    if (restoreFocus) {
      previousFocusRef.current = document.activeElement as HTMLElement;
    }

    if (autoFocus) {
      setTimeout(() => {
        focusUtils.focusFirst(containerRef.current!);
      }, 0);
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && escapeDeactivates) {
        event.preventDefault();
        onEscape?.();
      }

      if (event.key === "Tab") {
        const focusableElements = focusUtils.getFocusableElements(
          containerRef.current!
        );
        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        const activeElement = document.activeElement as HTMLElement;

        if (!event.shiftKey) {
          if (activeElement === lastElement) {
            event.preventDefault();
            firstElement.focus();
          }
        } else {
          if (activeElement === firstElement) {
            event.preventDefault();
            lastElement.focus();
          }
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      if (restoreFocus && previousFocusRef.current) {
        previousFocusRef.current.focus();
      }
    };
  }, [active, restoreFocus, autoFocus, escapeDeactivates, onEscape]);

  return (
    <div ref={containerRef} className={className} data-focus-trap={active}>
      {children}
    </div>
  );
}

/**
 * Enhanced Tooltip with keyboard support
 */
export interface AccessibleTooltipProps {
  content: string;
  children: React.ReactElement;
  placement?: "top" | "bottom" | "left" | "right";
  delay?: number;
  className?: string;
}

export function AccessibleTooltip({
  content,
  children,
  placement = "top",
  delay = 500,
  className,
}: AccessibleTooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isKeyboardFocused, setIsKeyboardFocused] = useState(false);
  const tooltipId = useA11yId("tooltip");
  const timeoutRef = useRef<NodeJS.Timeout>();

  const showTooltip = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
    }, delay);
  }, [delay]);

  const hideTooltip = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(false);
  }, []);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === "Escape") {
        hideTooltip();
        setIsKeyboardFocused(false);
      }
    },
    [hideTooltip]
  );

  const clonedChild = React.cloneElement(children, {
    "aria-describedby": isVisible ? tooltipId : undefined,
    onMouseEnter: (e: React.MouseEvent) => {
      showTooltip();
      children.props.onMouseEnter?.(e);
    },
    onMouseLeave: (e: React.MouseEvent) => {
      if (!isKeyboardFocused) {
        hideTooltip();
      }
      children.props.onMouseLeave?.(e);
    },
    onFocus: (e: React.FocusEvent) => {
      setIsKeyboardFocused(true);
      showTooltip();
      children.props.onFocus?.(e);
    },
    onBlur: (e: React.FocusEvent) => {
      setIsKeyboardFocused(false);
      hideTooltip();
      children.props.onBlur?.(e);
    },
    onKeyDown: (e: React.KeyboardEvent) => {
      handleKeyDown(e);
      children.props.onKeyDown?.(e);
    },
  });

  return (
    <div className="relative inline-block">
      {clonedChild}
      {isVisible && (
        <div
          id={tooltipId}
          role="tooltip"
          className={cn(
            "absolute z-50 px-2 py-1 text-sm rounded shadow-lg",
            "bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900",
            "pointer-events-none",
            {
              "bottom-full left-1/2 transform -translate-x-1/2 mb-2":
                placement === "top",
              "top-full left-1/2 transform -translate-x-1/2 mt-2":
                placement === "bottom",
              "right-full top-1/2 transform -translate-y-1/2 mr-2":
                placement === "left",
              "left-full top-1/2 transform -translate-y-1/2 ml-2":
                placement === "right",
            },
            className
          )}
        >
          {content}
        </div>
      )}
    </div>
  );
}

/**
 * Enhanced Loading Spinner with accessibility
 */
export interface AccessibleLoadingProps {
  loading: boolean;
  children?: React.ReactNode;
  loadingText?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function AccessibleLoading({
  loading,
  children,
  loadingText = "Loading...",
  size = "md",
  className,
}: AccessibleLoadingProps) {
  const { loadingProps } = useLoadingA11y(loading, loadingText);

  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
  };

  if (loading) {
    return (
      <div
        className={cn("flex items-center justify-center", className)}
        {...loadingProps}
      >
        <div
          className={cn(
            "border-2 border-current border-t-transparent rounded-full animate-spin",
            sizeClasses[size]
          )}
          aria-hidden="true"
        />
        <span className="sr-only">{loadingText}</span>
        {children && <span className="ml-2">{children}</span>}
      </div>
    );
  }

  return <>{children}</>;
}

/**
 * Enhanced Form Field wrapper with comprehensive accessibility
 */
export interface AccessibleFormFieldProps {
  children: React.ReactElement;
  label?: string;
  required?: boolean;
  error?: string;
  description?: string;
  disabled?: boolean;
  className?: string;
}

export function AccessibleFormField({
  children,
  label,
  required = false,
  error,
  description,
  disabled = false,
  className,
}: AccessibleFormFieldProps) {
  const { fieldProps, labelProps, errorProps, descriptionProps, isInvalid } =
    useFormFieldA11y({
      label,
      required,
      error,
      description,
      disabled,
    });

  const enhancedChild = React.cloneElement(children, {
    ...fieldProps,
    ...children.props,
    className: cn(children.props.className, isInvalid && "border-destructive"),
  });

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <label
          {...labelProps}
          className={cn(
            "block text-sm font-medium",
            required && 'after:content-["*"] after:ml-1 after:text-destructive',
            disabled && "opacity-60"
          )}
        >
          {label}
        </label>
      )}

      {description && (
        <p
          {...descriptionProps}
          className="glass-text-sm text-muted-foreground"
        >
          {description}
        </p>
      )}

      {enhancedChild}

      {error && (
        <p {...errorProps} className="glass-text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}

/**
 * Accessible Modal overlay with focus management
 */
export interface AccessibleModalOverlayProps {
  children: React.ReactNode;
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  className?: string;
  escapeCloses?: boolean;
  backdropCloses?: boolean;
}

export function AccessibleModalOverlay({
  children,
  open,
  onClose,
  title,
  description,
  className,
  escapeCloses = true,
  backdropCloses = true,
}: AccessibleModalOverlayProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const titleId = title ? useA11yId("modal-title") : undefined;
  const descId = description ? useA11yId("modal-desc") : undefined;

  const handleBackdropClick = useCallback(
    (e: React.MouseEvent) => {
      if (backdropCloses && e.target === e.currentTarget) {
        onClose();
      }
    },
    [backdropCloses, onClose]
  );

  const handleEscapeKey = useCallback(() => {
    if (escapeCloses) {
      onClose();
    }
  }, [escapeCloses, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 glass-flex glass-items-center glass-justify-center glass-surface-dark/50"
      onClick={handleBackdropClick}
    >
      <FocusTrap
        active={open}
        onEscape={handleEscapeKey}
        className={cn(
          "relative bg-background p-6 rounded-lg shadow-lg max-w-lg w-full mx-4",
          className
        )}
      >
        <div
          ref={modalRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          aria-describedby={descId}
        >
          {title && (
            <h2 id={titleId} className="glass-text-lg font-semibold mb-2">
              {title}
            </h2>
          )}

          {description && (
            <p id={descId} className="text-muted-foreground mb-4">
              {description}
            </p>
          )}

          {children}
        </div>
      </FocusTrap>
    </div>
  );
}

/**
 * Live Region component for dynamic content announcements
 */
export interface LiveRegionProps {
  message?: string;
  level?: "polite" | "assertive" | "off";
  atomic?: boolean;
  className?: string;
}

export function LiveRegion({
  message,
  level = "polite",
  atomic = true,
  className,
}: LiveRegionProps) {
  return (
    <div
      aria-live={level}
      aria-atomic={atomic}
      className={cn("sr-only", className)}
    >
      {message}
    </div>
  );
}

/**
 * Accessible Progress component
 */
export interface AccessibleProgressProps {
  value: number;
  max?: number;
  min?: number;
  label?: string;
  description?: string;
  showValue?: boolean;
  className?: string;
}

export function AccessibleProgress({
  value,
  max = 100,
  min = 0,
  label,
  description,
  showValue = false,
  className,
}: AccessibleProgressProps) {
  const percentage = ((value - min) / (max - min)) * 100;
  const progressId = useA11yId("progress");
  const labelId = label ? useA11yId("progress-label") : undefined;
  const descId = description ? useA11yId("progress-desc") : undefined;

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <div
          id={labelId}
          className="glass-flex glass-justify-between glass-text-sm"
        >
          <span>{label}</span>
          {showValue && (
            <span className="text-muted-foreground">
              {value}/{max}
            </span>
          )}
        </div>
      )}

      {description && (
        <p id={descId} className="glass-text-sm text-muted-foreground">
          {description}
        </p>
      )}

      <div className="glass-w-full bg-secondary glass-radius-full h-2">
        <div
          id={progressId}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-labelledby={labelId}
          aria-describedby={descId}
          className="bg-primary h-2 glass-radius-full transition-all duration-300 ease-out"
          style={{ width: `${Math.max(0, Math.min(100, percentage))}%` }}
        />
      </div>
    </div>
  );
}

/**
 * Export all accessibility enhancers
 */
export const A11yEnhancers = {
  SkipLinks,
  FocusTrap,
  AccessibleTooltip,
  AccessibleLoading,
  AccessibleFormField,
  AccessibleModalOverlay,
  LiveRegion,
  AccessibleProgress,
  useKeyboardShortcuts,
  withKeyboardShortcuts,
};
