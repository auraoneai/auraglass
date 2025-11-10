'use client';
import React, { useState, useRef, useEffect, forwardRef } from "react";
import { OptimizedGlass } from "../../primitives";
import { Motion } from "../../primitives";
import { useA11yId, announceToScreenReader } from "../../utils/a11y";
import { useMotionPreferenceContext } from "../../contexts/MotionPreferenceContext";
import { cn } from "../../lib/utilsComprehensive";

export type TooltipPosition = "top" | "bottom" | "left" | "right" | "auto";

export interface GlassTooltipProps {
  /** Content to show in the tooltip */
  content: React.ReactNode;
  /** Children element that triggers the tooltip */
  children: React.ReactNode;
  /** Position of the tooltip relative to trigger */
  position?: TooltipPosition;
  /** Delay before showing tooltip (ms) */
  showDelay?: number;
  /** Delay before hiding tooltip (ms) */
  hideDelay?: number;
  /** Whether tooltip is disabled */
  disabled?: boolean;
  /** Custom className for tooltip */
  className?: string;
  /** Custom className for trigger */
  triggerClassName?: string;
  /** Maximum width of tooltip */
  maxWidth?: string;
  /** Whether to show arrow pointer */
  showArrow?: boolean;
  /** Animation variant */
  variant?: "fade" | "scale" | "slide";
  /** Whether to respect motion preferences */
  respectMotionPreference?: boolean;
  /** Accessible label for the tooltip */
  "aria-label"?: string;
  /** ID of the tooltip for aria-describedby */
  id?: string;
}

export const GlassTooltip = forwardRef<HTMLDivElement, GlassTooltipProps>(
  (
    {
      content,
      children,
      position = "top",
      showDelay = 300,
      hideDelay = 150,
      disabled = false,
      className = "",
      triggerClassName = "",
      maxWidth = "200px",
      showArrow = true,
      variant = "fade",
      respectMotionPreference = true,
      "aria-label": ariaLabel,
      id,
      ...props
    },
    ref
  ) => {
    const [isVisible, setIsVisible] = useState(false);
    const [actualPosition, setActualPosition] =
      useState<TooltipPosition>(position);
    const triggerRef = useRef<HTMLDivElement>(null);
    const tooltipRef = useRef<HTMLDivElement>(null);
    const showTimeoutRef = useRef<NodeJS.Timeout>();
    const hideTimeoutRef = useRef<NodeJS.Timeout>();
    const { prefersReducedMotion } = useMotionPreferenceContext();

    // Generate unique ID for accessibility
    const tooltipId = id || useA11yId("glass-tooltip");
    const shouldAnimate = respectMotionPreference
      ? !prefersReducedMotion
      : true;

    const calculatePosition = () => {
      if (!triggerRef.current || !tooltipRef.current) return position;

      const triggerRect = triggerRef.current.getBoundingClientRect();
      const tooltipRect = tooltipRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      // Check if tooltip fits in preferred position
      const fitsTop = triggerRect.top > tooltipRect.height + 8;
      const fitsBottom =
        triggerRect.bottom + tooltipRect.height + 8 < viewportHeight;
      const fitsLeft = triggerRect.left > tooltipRect.width + 8;
      const fitsRight =
        triggerRect.right + tooltipRect.width + 8 < viewportWidth;

      // Auto-positioning logic
      if (position === "auto") {
        if (fitsTop) return "top";
        if (fitsBottom) return "bottom";
        if (fitsRight) return "right";
        if (fitsLeft) return "left";
        return "top"; // fallback
      }

      return position;
    };

    const handleMouseEnter = () => {
      if (disabled) return;

      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }

      showTimeoutRef.current = setTimeout(() => {
        setActualPosition(calculatePosition());
        setIsVisible(true);

        // Announce tooltip to screen readers
        if (content && typeof content === "string") {
          announceToScreenReader(content, "polite");
        } else if (ariaLabel) {
          announceToScreenReader(ariaLabel, "polite");
        }
      }, showDelay);
    };

    const handleMouseLeave = () => {
      if (showTimeoutRef.current) {
        clearTimeout(showTimeoutRef.current);
      }

      hideTimeoutRef.current = setTimeout(() => {
        setIsVisible(false);
      }, hideDelay);
    };

    // Cleanup timeouts on unmount
    useEffect(() => {
      return () => {
        if (showTimeoutRef.current) clearTimeout(showTimeoutRef.current);
        if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
      };
    }, []);

    const getAnimationPreset = () => {
      if (!shouldAnimate) return "none";

      switch (variant) {
        case "scale":
          return "scaleIn";
        case "slide":
          return getSlidePreset();
        case "fade":
        default:
          return "fadeIn";
      }
    };

    const getSlidePreset = () => {
      switch (actualPosition) {
        case "top":
          return "slideUp";
        case "bottom":
          return "slideDown";
        case "left":
          return "slideLeft";
        case "right":
          return "slideRight";
        default:
          return "fadeIn";
      }
    };

    const getPositionStyles = (): React.CSSProperties => {
      if (!triggerRef.current || !tooltipRef.current) return {};

      const triggerRect = triggerRef.current.getBoundingClientRect();
      const tooltipRect = tooltipRef.current.getBoundingClientRect();

      switch (actualPosition) {
        case "top":
          return {
            top: triggerRect.top - tooltipRect.height - 8,
            left:
              triggerRect.left + (triggerRect.width - tooltipRect.width) / 2,
          };
        case "bottom":
          return {
            top: triggerRect.bottom + 8,
            left:
              triggerRect.left + (triggerRect.width - tooltipRect.width) / 2,
          };
        case "left":
          return {
            top:
              triggerRect.top + (triggerRect.height - tooltipRect.height) / 2,
            left: triggerRect.left - tooltipRect.width - 8,
          };
        case "right":
          return {
            top:
              triggerRect.top + (triggerRect.height - tooltipRect.height) / 2,
            left: triggerRect.right + 8,
          };
        default:
          return {};
      }
    };

    const getArrowStyles = (): React.CSSProperties => {
      switch (actualPosition) {
        case "top":
          return { bottom: "-4px", left: "50%", transform: "translateX(-50%)" };
        case "bottom":
          return {
            top: "-4px",
            left: "50%",
            transform: "translateX(-50%) rotate(180deg)",
          };
        case "left":
          return {
            right: "-4px",
            top: "50%",
            transform: "translateY(-50%) rotate(90deg)",
          };
        case "right":
          return {
            left: "-4px",
            top: "50%",
            transform: "translateY(-50%) rotate(-90deg)",
          };
        default:
          return {};
      }
    };

    if (disabled) {
      return <>{children}</>;
    }

    return (
      <>
        <div
          ref={triggerRef}
          className={cn("inline-block", triggerClassName)}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          aria-describedby={isVisible ? tooltipId : undefined}
          {...props}
        >
          {children}
        </div>

        {isVisible && (
          <Motion
            preset={getAnimationPreset()}
            duration={shouldAnimate ? 200 : 0}
            className='fixed z-[9999] pointer-events-none'
            style={{
              ...getPositionStyles(),
              maxWidth,
            }}
          >
            <div
              ref={ref}
              id={tooltipId}
              role="tooltip"
              aria-label={ariaLabel}
              className={cn("relative", className)}
            >
              <OptimizedGlass
                ref={tooltipRef}
                intent="neutral"
                elevation="level4"
                intensity="medium"
                depth={1}
                tint="neutral"
                border="subtle"
                animation="none"
                performanceMode="medium"
                className='glass-px-3 glass-py-2 glass-radius-lg glass-text-sm text-primary glass-shadow-lg'
              >
                {content}

                {showArrow && (
                  <div
                    className='absolute w-0 h-0 glass-border-l-4 glass-border-r-4 glass-border-b-4 glass-border-transparent glass-border-b-white/20'
                    style={getArrowStyles()}
                    aria-hidden="true"
                  />
                )}
              </OptimizedGlass>
            </div>
          </Motion>
        )}
      </>
    );
  }
);

GlassTooltip.displayName = "GlassTooltip";

// Compound component for tooltip with trigger
export const GlassTooltipTrigger: React.FC<{
  asChild?: boolean;
  children: React.ReactNode;
}> = ({ asChild, children }) => {
  return <>{children}</>;
};

export const GlassTooltipContent: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  return <>{children}</>;
};