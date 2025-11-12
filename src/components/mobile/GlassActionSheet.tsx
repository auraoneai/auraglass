'use client';
import { cn } from "../../lib/utilsComprehensive";
import React, { forwardRef, useEffect, useCallback, useRef } from "react";
import { OptimizedGlass } from "../../primitives";
import { createPortal } from "react-dom";

export interface GlassActionSheetAction {
  /**
   * Action label
   */
  label: string;
  /**
   * Action callback
   */
  onAction: () => void;
  /**
   * Action icon
   */
  icon?: React.ReactNode;
  /**
   * Action style variant
   * @default 'default'
   */
  variant?: "default" | "destructive" | "primary";
  /**
   * Whether the action is disabled
   * @default false
   */
  disabled?: boolean;
}

export interface GlassActionSheetProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  /**
   * Whether the action sheet is open
   */
  open: boolean;
  /**
   * Callback when the action sheet should close
   */
  onClose: () => void;
  /**
   * Action sheet title
   */
  title?: string;
  /**
   * Action sheet message/description
   */
  message?: string;
  /**
   * List of actions
   */
  actions: GlassActionSheetAction[];
  /**
   * Show cancel button
   * @default true
   */
  showCancel?: boolean;
  /**
   * Cancel button text
   * @default 'Cancel'
   */
  cancelText?: string;
  /**
   * Glassmorphism elevation level
   * @default 'level4'
   */
  elevation?: "level1" | "level2" | "level3" | "level4" | "level5";
  /**
   * Close on backdrop click
   * @default true
   */
  closeOnBackdrop?: boolean;
  /**
   * Animation duration in milliseconds
   * @default 300
   */
  animationDuration?: number;
}

export const GlassActionSheet = forwardRef<
  HTMLDivElement,
  GlassActionSheetProps
>(
  (
    {
      open,
      onClose,
      title,
      message,
      actions,
      showCancel = true,
      cancelText = "Cancel",
      elevation = "level4",
      closeOnBackdrop = true,
      animationDuration = 300,
      className,
      "aria-label": ariaLabel,
      ...props
    },
    ref
  ) => {
    const [isVisible, setIsVisible] = React.useState(false);
    const [isAnimating, setIsAnimating] = React.useState(false);
    const sheetRef = useRef<HTMLDivElement>(null);
    const startYRef = useRef(0);
    const currentYRef = useRef(0);

    useEffect(() => {
      if (open) {
        setIsVisible(true);
        setTimeout(() => setIsAnimating(true), 10);
      } else {
        setIsAnimating(false);
        setTimeout(() => setIsVisible(false), animationDuration);
      }
    }, [open, animationDuration]);

    useEffect(() => {
      if (!isVisible) return;

      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          onClose();
        }
      };

      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";

      return () => {
        document.removeEventListener("keydown", handleEscape);
        document.body.style.overflow = "";
      };
    }, [isVisible, onClose]);

    const handleBackdropClick = useCallback(() => {
      if (closeOnBackdrop) {
        onClose();
      }
    }, [closeOnBackdrop, onClose]);

    const handleActionClick = useCallback(
      (action: GlassActionSheetAction) => {
        if (action.disabled) return;
        action.onAction();
        onClose();
      },
      [onClose]
    );

    const handleTouchStart = useCallback((e: React.TouchEvent) => {
      startYRef.current = e.touches[0].clientY;
      currentYRef.current = 0;
    }, []);

    const handleTouchMove = useCallback((e: React.TouchEvent) => {
      const deltaY = e.touches[0].clientY - startYRef.current;
      if (deltaY > 0) {
        currentYRef.current = deltaY;
        if (sheetRef.current) {
          sheetRef.current.style.transform = `translateY(${deltaY}px)`;
        }
      }
    }, []);

    const handleTouchEnd = useCallback(() => {
      if (currentYRef.current > 100) {
        onClose();
      } else if (sheetRef.current) {
        sheetRef.current.style.transform = "";
      }
      currentYRef.current = 0;
    }, [onClose]);

    if (!isVisible) return null;

    const content = (
      <div
        className={cn(
          "fixed inset-0 z-50 flex items-end justify-center",
          "transition-colors duration-300",
          isAnimating ? "bg-black/40" : "bg-black/0"
        )}
        onClick={handleBackdropClick}
        role="presentation"
      >
        <div
          ref={sheetRef}
          onClick={(e) => e.stopPropagation()}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          className={cn(
            "w-full max-w-2xl mx-auto glass-p-4 pb-safe",
            "transition-transform duration-300 ease-out",
            isAnimating ? "translate-y-0" : "translate-y-full",
            className
          )}
          role="dialog"
          aria-modal="true"
          aria-label={ariaLabel}
          aria-labelledby={title && !ariaLabel ? "action-sheet-title" : undefined}
          aria-describedby={message ? "action-sheet-message" : undefined}
          data-testid={props['data-testid']}
          {...props}
        >
          <OptimizedGlass
            ref={ref}
            elevation={elevation}
            className={cn("overflow-hidden glass-radius-2xl")}
          >
            {(title || message) && (
              <div className='glass-p-4 text-center glass-border-b glass-border-subtle'>
                {title && (
                  <h3
                    id="action-sheet-title"
                    className='glass-text-lg font-semibold glass-text-primary mb-1'
                  >
                    {title}
                  </h3>
                )}
                {message && (
                  <p
                    id="action-sheet-message"
                    className="glass-text-sm glass-text-secondary"
                  >
                    {message}
                  </p>
                )}
              </div>
            )}

            <div className='max-h-96 overflow-y-auto'>
              {actions.map((action, index) => (
                <button
                  key={index}
                  onClick={() => handleActionClick(action)}
                  disabled={action.disabled}
                  className={cn(
                    "w-full glass-p-4 flex items-center justify-center gap-3",
                    "glass-text-base font-medium",
                    "transition-all duration-200",
                    "border-b glass-border-subtle last:border-b-0",
                    "hover:bg-white/5 active:bg-white/10",
                    "disabled:opacity-50 disabled:cursor-not-allowed",
                    action.variant === "destructive" && "text-red-500",
                    action.variant === "primary" &&
                      "text-blue-500 font-semibold",
                    action.variant === "default" && "glass-text-primary",
                    !action.disabled &&
                      "glass-focus glass-touch-target glass-contrast-guard"
                  )}
                  type="button"
                >
                  {action.icon && (
                    <span className="glass-flex-shrink-0">{action.icon}</span>
                  )}
                  <span>{action.label}</span>
                </button>
              ))}
            </div>
          </OptimizedGlass>

          {showCancel && (
            <OptimizedGlass
              elevation={elevation}
              className='mt-2 overflow-hidden glass-radius-2xl'
            >
              <button
                onClick={onClose}
                className={cn(
                  "w-full glass-p-4 flex items-center justify-center",
                  "glass-text-base font-semibold glass-text-primary",
                  "transition-all duration-200",
                  "hover:bg-white/5 active:bg-white/10",
                  "glass-focus glass-touch-target glass-contrast-guard"
                )}
                type="button"
              >
                {cancelText}
              </button>
            </OptimizedGlass>
          )}
        </div>
      </div>
    );

    return createPortal(content, document.body);
  }
);

GlassActionSheet.displayName = "GlassActionSheet";

export default GlassActionSheet;