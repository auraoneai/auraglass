"use client";
import { cn } from "../../lib/utilsComprehensive";
import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
  forwardRef,
} from "react";
import { OptimizedGlass } from "../../primitives";
import { Motion } from "../../primitives";
import { useA11yId, announceToScreenReader } from "../../utils/a11y";
import { useMotionPreferenceContext } from "../../contexts/MotionPreferenceContext";
import { ContrastGuard } from "../accessibility/ContrastGuard";
import { ANIMATION } from "../../tokens/designConstants";
import { useReducedMotion } from "../../hooks/useReducedMotion";

export interface GlassHoverCardProps {
  /**
   * Content to display in the hover card
   */
  content: React.ReactNode;
  /**
   * Children to trigger the hover card
   */
  children: React.ReactNode;
  /**
   * Hover card placement
   */
  placement?:
    | "top"
    | "right"
    | "bottom"
    | "left"
    | "top-start"
    | "top-end"
    | "right-start"
    | "right-end"
    | "bottom-start"
    | "bottom-end"
    | "left-start"
    | "left-end";
  /**
   * Hover card alignment
   */
  align?: "start" | "center" | "end";
  /**
   * Offset from trigger element
   */
  offset?: number;
  /**
   * Delay before showing (ms)
   */
  showDelay?: number;
  /**
   * Delay before hiding (ms)
   */
  hideDelay?: number;
  /**
   * Whether hover card is open
   */
  open?: boolean;
  /**
   * Callback when open state changes
   */
  onOpenChange?: (open: boolean) => void;
  /**
   * Custom className
   */
  className?: string;
  /**
   * Maximum width
   */
  maxWidth?: string | number;
  /**
   * Custom trigger className
   */
  triggerClassName?: string;
  /**
   * Accessible title for the hover card
   */
  title?: string;
  /**
   * Accessible description for the hover card
   */
  description?: string;
  /**
   * Whether to respect motion preferences
   */
  respectMotionPreference?: boolean;
  /**
   * Custom aria-label
   */
  "aria-label"?: string;
  /**
   * Custom aria-labelledby
   */
  "aria-labelledby"?: string;
  /**
   * Custom aria-describedby
   */
  "aria-describedby"?: string;
}

export interface GlassHoverCardContentProps {
  /**
   * Content to display
   */
  children: React.ReactNode;
  /**
   * Content className
   */
  className?: string;
  /**
   * Whether to show arrow
   */
  showArrow?: boolean;
  /**
   * Arrow className
   */
  arrowClassName?: string;
}

export interface GlassHoverCardTriggerProps {
  /**
   * Trigger content
   */
  children: React.ReactNode;
  /**
   * Trigger className
   */
  className?: string;
  /**
   * Trigger as child
   */
  asChild?: boolean;
}

/**
 * GlassHoverCard component
 * A glassmorphism hover card that appears on hover
 */
export const GlassHoverCard = forwardRef<HTMLDivElement, GlassHoverCardProps>(
  (
    {
      content,
      children,
      placement = "top",
      align = "center",
      offset = 8,
      showDelay = 300,
      hideDelay = 100,
      open: controlledOpen,
      onOpenChange,
      className,
      maxWidth = "320px",
      triggerClassName,
      title,
      description,
      respectMotionPreference = true,
      "aria-label": ariaLabel,
      "aria-labelledby": ariaLabelledBy,
      "aria-describedby": ariaDescribedBy,
      ...props
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const triggerRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const showTimeoutRef = useRef<NodeJS.Timeout>();
    const hideTimeoutRef = useRef<NodeJS.Timeout>();
    const { prefersReducedMotion } = useMotionPreferenceContext();

    const open = controlledOpen !== undefined ? controlledOpen : isOpen;
    const setOpen = useCallback(
      (value: boolean) => {
        if (value === open) {
          return;
        }

        if (onOpenChange) {
          onOpenChange(value);
        } else {
          setIsOpen(value);
        }
      },
      [onOpenChange, open]
    );

    // Generate unique IDs for accessibility
    const hoverCardId = useA11yId("glass-hover-card");
    const titleId = title ? useA11yId("glass-hover-card-title") : undefined;
    const descriptionId = description
      ? useA11yId("glass-hover-card-desc")
      : undefined;

    const shouldAnimate = respectMotionPreference
      ? !prefersReducedMotion
      : true;

    // Calculate position based on placement and alignment
    const calculatePosition = () => {
      if (!triggerRef.current || !contentRef.current) return;

      const triggerRect = triggerRef.current.getBoundingClientRect();
      const contentRect = contentRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      let x = 0;
      let y = 0;

      // Horizontal positioning
      switch (placement) {
        case "left":
        case "left-start":
        case "left-end":
          x = triggerRect.left - contentRect.width - offset;
          break;
        case "right":
        case "right-start":
        case "right-end":
          x = triggerRect.right + offset;
          break;
        default: // top, bottom, top-start, top-end, bottom-start, bottom-end
          x = triggerRect.left + triggerRect.width / 2 - contentRect.width / 2;
      }

      // Vertical positioning
      switch (placement) {
        case "top":
        case "top-start":
        case "top-end":
          y = triggerRect.top - contentRect.height - offset;
          break;
        case "bottom":
        case "bottom-start":
        case "bottom-end":
          y = triggerRect.bottom + offset;
          break;
        default: // left, right, left-start, left-end, right-start, right-end
          y = triggerRect.top + triggerRect.height / 2 - contentRect.height / 2;
      }

      // Alignment adjustments
      switch (placement) {
        case "top-start":
        case "bottom-start":
          x = triggerRect.left;
          break;
        case "top-end":
        case "bottom-end":
          x = triggerRect.right - contentRect.width;
          break;
        case "left-start":
        case "right-start":
          y = triggerRect.top;
          break;
        case "left-end":
        case "right-end":
          y = triggerRect.bottom - contentRect.height;
          break;
      }

      // Keep within viewport bounds
      x = Math.max(10, Math.min(x, viewportWidth - contentRect.width - 10));
      y = Math.max(10, Math.min(y, viewportHeight - contentRect.height - 10));

      setPosition({ x, y });
    };

    // Handle mouse enter
    const handleMouseEnter = () => {
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
        hideTimeoutRef.current = undefined;
      }

      if (!open) {
        showTimeoutRef.current = setTimeout(() => {
          setOpen(true);
        }, showDelay);
      }
    };

    // Handle mouse leave
    const handleMouseLeave = () => {
      if (showTimeoutRef.current) {
        clearTimeout(showTimeoutRef.current);
        showTimeoutRef.current = undefined;
      }

      if (open) {
        hideTimeoutRef.current = setTimeout(() => {
          setOpen(false);
        }, hideDelay);
      }
    };

    // Update position when content opens
    useEffect(() => {
      if (open) {
        // Small delay to ensure content is rendered
        setTimeout(calculatePosition, ANIMATION.DURATION.instant);

        // Announce to screen readers when opened
        announceToScreenReader(
          `Hover card opened: ${title || ariaLabel || "Hover card"}`,
          "polite"
        );
      }
    }, [open, placement, align, offset, title, ariaLabel]);

    // Recalculate position on window resize
    useEffect(() => {
      if (!open) return;

      const handleResize = () => calculatePosition();
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }, [open]);

    return (
      <div className="glass-relative glass-inline-glass-block">
        <div
          ref={triggerRef}
          className={triggerClassName}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {children}
        </div>

        {open && (
          <Motion
            preset="fadeIn"
            duration={shouldAnimate ? 200 : 0}
            className="glass-fixed glass-z-9999"
            style={{
              left: position.x,
              top: position.y,
              maxWidth:
                typeof maxWidth === "number" ? `${maxWidth}px` : maxWidth,
            }}
          >
            <div
              ref={contentRef}
              className={cn("relative", className)}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              role="tooltip"
              id={hoverCardId}
              aria-labelledby={ariaLabelledBy || titleId}
              aria-describedby={ariaDescribedBy || descriptionId}
              aria-label={!ariaLabelledBy && !titleId ? ariaLabel : undefined}
              {...props}
            >
              <OptimizedGlass
                ref={ref}
                intent="neutral"
                elevation="level3"
                intensity="strong"
                depth={2}
                tint="neutral"
                border="subtle"
                animation="none"
                performanceMode="medium"
                liftOnHover
                hoverSheen
                className="glass-backdrop-blur-md glass-surface-dark/20 glass-border glass-border-white/20 glass-shadow-2xl glass-radial-reveal glass-contrast-guard"
              >
                <div className="glass-p-4">
                  {/* Header with title and description */}
                  {(title || description) && (
                    <div className="glass-mb-2">
                      {title && (
                        <h3
                          id={titleId}
                          className="glass-font-medium glass-text-primary glass-text-sm glass-mb-1"
                        >
                          {title}
                        </h3>
                      )}
                      {description && (
                        <p
                          id={descriptionId}
                          className="glass-text-xs glass-text-secondary"
                        >
                          {description}
                        </p>
                      )}
                    </div>
                  )}
                  {content}
                </div>
              </OptimizedGlass>

              {/* Arrow */}
              <div
                className={cn(
                  "absolute w-3 h-3 bg-black/20 border border-white/20 glass-backdrop-blur-md",
                  "rotate-45",
                  {
                    "-bottom-2 left-1/2 -translate-x-1/2":
                      placement.startsWith("top"),
                    "-top-2 left-1/2 -translate-x-1/2":
                      placement.startsWith("bottom"),
                    "-right-2 top-1/2 -translate-y-1/2":
                      placement.startsWith("left"),
                    "-left-2 top-1/2 -translate-y-1/2":
                      placement.startsWith("right"),
                  }
                )}
                style={{ ...{ clipPath: "polygon(0 0, 100% 100%, 0 100%)" } }}
              />
            </div>
          </Motion>
        )}
      </div>
    );
  }
);

GlassHoverCard.displayName = "GlassHoverCard";

/**
 * GlassHoverCardContent component
 * Content wrapper for hover card
 */
export const GlassHoverCardContent: React.FC<GlassHoverCardContentProps> = ({
  children,
  className,
  showArrow = true,
  arrowClassName,
}) => {
  return (
    <div className={className}>
      {children}
      {showArrow && (
        <div
          className={cn(
            "absolute w-3 h-3 bg-black/20 border border-white/20 glass-backdrop-blur-md rotate-45",
            arrowClassName
          )}
        />
      )}
    </div>
  );
};

/**
 * GlassHoverCardTrigger component
 * Trigger wrapper for hover card
 */
export const GlassHoverCardTrigger: React.FC<GlassHoverCardTriggerProps> = ({
  children,
  className,
  asChild = false,
}) => {
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      className: cn(children.props?.className, className),
    });
  }

  return <div className={className}>{children}</div>;
};

/**
 * Hook for managing hover card state
 */
export const useHoverCard = () => {
  const [isOpen, setIsOpen] = useState(false);

  return {
    isOpen,
    setIsOpen,
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
    toggle: () => setIsOpen(!isOpen),
  };
};
