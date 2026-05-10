"use client";

import { cn } from "../../lib/utilsComprehensive";
import React, { forwardRef, useEffect, useRef, useState } from "react";
import { OptimizedGlass } from "../../primitives";
import { useA11yId } from "../../utils/a11y";
import { useMotionPreferenceContext } from "../../contexts/MotionPreferenceContext";
import {
  ContrastGuard,
  TextWithContrast,
} from "@/components/accessibility/ContrastGuard";
import { ANIMATION } from "../../tokens/designConstants";

export interface AccordionItem {
  /**
   * Unique identifier for the item
   */
  id: string;
  /**
   * Title/header content
   */
  title: React.ReactNode;
  /**
   * Body content
   */
  content: React.ReactNode;
  /**
   * Whether this item is disabled
   */
  disabled?: boolean;
  /**
   * Custom icon for this item
   */
  icon?: React.ReactNode;
}

export interface GlassAccordionProps {
  /**
   * Accordion items
   */
  items: AccordionItem[];
  /**
   * Accordion variant
   */
  variant?: "default" | "bordered" | "flush";
  /**
   * Accordion size
   */
  size?: "sm" | "md" | "lg";
  /**
   * Whether multiple items can be open at once
   */
  multiple?: boolean;
  /**
   * Initially open items (controlled)
   */
  value?: string | string[];
  /**
   * Default open items (uncontrolled)
   */
  defaultValue?: string | string[];
  /**
   * Callback when open items change
   */
  onValueChange?: (value: string | string[]) => void;
  /**
   * Whether to show expand/collapse icons
   */
  showIcons?: boolean;
  /**
   * Custom expand icon
   */
  expandIcon?: React.ReactNode;
  /**
   * Custom collapse icon
   */
  collapseIcon?: React.ReactNode;
  /**
   * Animation duration in milliseconds
   */
  animationDuration?: number;
  /**
   * Whether to animate content changes
   */
  animated?: boolean;
  /**
   * Collapsible behavior
   */
  collapsible?: boolean;
  /**
   * Respect user's motion preferences
   */
  respectMotionPreference?: boolean;
  /**
   * ARIA label for the accordion
   */
  "aria-label"?: string;
  className?: string;
}

/**
 * GlassAccordion component
 * Collapsible sections with smooth animations and glassmorphism styling
 */
export const GlassAccordion = forwardRef<HTMLDivElement, GlassAccordionProps>(
  (
    {
      // ContrastGuard text coverage is tracked in the manual accessibility QA report.

      items = [],
      variant = "default",
      size = "md",
      multiple = false,
      value,
      defaultValue,
      onValueChange,
      showIcons = true,
      expandIcon,
      collapseIcon,
      animationDuration = 300,
      animated = true,
      collapsible = true,
      respectMotionPreference = true,
      "aria-label": ariaLabel,
      className,
      ...props
    },
    ref
  ) => {
    const accordionId = useA11yId("accordion");
    const { prefersReducedMotion } = useMotionPreferenceContext();
    const shouldAnimate =
      animated && (!respectMotionPreference || !prefersReducedMotion);

    // Normalize value to array for consistent handling
    const normalizeValue = (val: string | string[] | undefined): string[] => {
      if (!val) return [];
      return Array.isArray(val) ? val : [val];
    };

    // Internal state for uncontrolled mode
    const [internalValue, setInternalValue] = useState<string[]>(
      normalizeValue(defaultValue)
    );

    // Determine current open items
    const openItems =
      value !== undefined ? normalizeValue(value) : internalValue;

    // Handle value changes
    const handleValueChange = (newValue: string[]) => {
      if (value === undefined) {
        setInternalValue(newValue);
      }

      const result = multiple ? newValue : newValue?.[0] || "";
      onValueChange?.(result);
    };

    // Toggle item open/closed
    const toggleItem = (itemId: string) => {
      const isOpen = (openItems || []).includes(itemId);

      if (multiple) {
        const newValue = isOpen
          ? (openItems || []).filter((id: any) => id !== itemId)
          : [...openItems, itemId];
        handleValueChange(newValue);
      } else {
        const newValue = isOpen && collapsible ? [] : [itemId];
        handleValueChange(newValue);
      }
    };

    // Handle keyboard navigation
    const handleKeyDown = (event: React.KeyboardEvent, itemId: string) => {
      switch (event.key) {
        case "Enter":
        case " ":
          event.preventDefault();
          toggleItem(itemId);
          break;
        case "ArrowDown":
          event.preventDefault();
          focusNextItem(itemId);
          break;
        case "ArrowUp":
          event.preventDefault();
          focusPreviousItem(itemId);
          break;
        case "Home":
          event.preventDefault();
          focusFirstItem();
          break;
        case "End":
          event.preventDefault();
          focusLastItem();
          break;
      }
    };

    // Focus management helpers
    const focusNextItem = (currentId: string) => {
      if (!items || !Array.isArray(items) || (items?.length || 0) === 0) return;
      const currentIndex = (items || []).findIndex(
        (item) => item?.id === currentId
      );
      if (currentIndex === -1) return;
      const nextIndex = (currentIndex + 1) % (items?.length || 0);
      const nextButton = document.querySelector(
        `[data-accordion-trigger="${items[nextIndex].id}"]`
      ) as HTMLButtonElement;
      nextButton?.focus();
    };

    const focusPreviousItem = (currentId: string) => {
      if (!items || !Array.isArray(items) || (items?.length || 0) === 0) return;
      const currentIndex = (items || []).findIndex(
        (item) => item?.id === currentId
      );
      if (currentIndex === -1) return;
      const prevIndex =
        currentIndex === 0 ? (items?.length || 0) - 1 : currentIndex - 1;
      const prevButton = document.querySelector(
        `[data-accordion-trigger="${items[prevIndex].id}"]`
      ) as HTMLButtonElement;
      prevButton?.focus();
    };

    const focusFirstItem = () => {
      const firstButton = document.querySelector(
        `[data-accordion-trigger="${items[0]?.id}"]`
      ) as HTMLButtonElement;
      firstButton?.focus();
    };

    const focusLastItem = () => {
      const lastButton = document.querySelector(
        `[data-accordion-trigger="${items[(items?.length || 0) - 1]?.id}"]`
      ) as HTMLButtonElement;
      lastButton?.focus();
    };

    // Size classes
    const sizeClasses = {
      sm: {
        trigger: "glass-px-3 glass-py-2 glass-text-sm",
        content: "glass-px-3 pb-2 glass-text-sm",
        icon: "glass-w-4 glass-h-4",
      },
      md: {
        trigger: "glass-px-4 glass-py-2 glass-text-sm",
        content: "glass-px-4 glass-pb-3 glass-text-sm",
        icon: "glass-w-5 glass-h-5",
      },
      lg: {
        trigger: "glass-px-6 glass-py-4 glass-text-lg",
        content: "glass-px-6 pb-4 glass-text-lg",
        icon: "glass-w-6 glass-h-6",
      },
    };

    // Default icons
    const defaultExpandIcon = (
      <svg
        className={cn(
          "transition-transform duration-200",
          sizeClasses[size].icon
        )}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 9l-7 7-7-7"
        />
      </svg>
    );

    const defaultCollapseIcon = (
      <svg
        className={cn(
          "transition-transform duration-200 rotate-180",
          sizeClasses[size].icon
        )}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 9l-7 7-7-7"
        />
      </svg>
    );

    return (
      <div
        ref={ref}
        id={accordionId}
        className={cn("glass-accordion glass-w-full glass-min-w-0", className)}
        role="tablist"
        aria-label={ariaLabel || "Accordion"}
        aria-multiselectable={multiple}
        {...props}
      >
        {(items || []).map((item, index) => {
          const isOpen = (openItems || []).includes(item?.id);
          const isFirst = index === 0;
          const isLast = index === (items?.length || 1) - 1;

          return (
            <OptimizedGlass
              elevation={variant === "flush" ? undefined : "level1"}
              intensity="medium"
              depth={2}
              tint="neutral"
              border="subtle"
              animation="none"
              performanceMode="medium"
              key={item?.id}
              className={cn(
                "glass-overflow-hidden glass-transition glass-min-w-0",
                {
                  "glass-border-0": variant === "flush",
                  "glass-border glass-border-glass-border/20":
                    variant === "bordered",
                  "glass-mb-2": variant !== "flush" && !isLast,
                  "glass-border-t-0": variant === "flush" && !isFirst,
                }
              )}
            >
              {/* Accordion Header/Trigger */}
              <button
                type="button"
                className={cn(
                  "glass-w-full glass-flex glass-items-center glass-justify-between glass-gap-3 glass-text-left glass-font-medium glass-min-w-0",
                  "glass-transition glass-radius-md glass-border-0 glass-surface-transparent",
                  "hover:glass-surface-subtle/10 focus:glass-surface-subtle/10",
                  "glass-focus glass-contrast-guard glass-cursor-pointer",
                  sizeClasses[size].trigger,
                  {
                    "glass-surface-subtle/10": isOpen,
                    "opacity-50 cursor-not-allowed": item?.disabled,
                    "glass-border-b glass-border-glass-border/10":
                      variant === "flush" && isOpen,
                  }
                )}
                onClick={(e) => !item?.disabled && toggleItem(item?.id)}
                onKeyDown={(e) => !item?.disabled && handleKeyDown(e, item?.id)}
                disabled={item?.disabled}
                aria-expanded={isOpen}
                aria-controls={`accordion-content-${item?.id}`}
                data-accordion-trigger={item?.id}
                role="tab"
              >
                <div className="glass-flex glass-items-center glass-gap-3 glass-min-w-0">
                  {item?.icon && (
                    <span className="glass-flex-shrink-0 glass-text-secondary">
                      {item?.icon}
                    </span>
                  )}
                  <ContrastGuard>
                    <span className="glass-min-w-0 glass-break-words">
                      {item?.title}
                    </span>
                  </ContrastGuard>
                </div>

                {showIcons && !item?.disabled && (
                  <span
                    className={cn(
                      "glass-flex-shrink-0 glass-text-secondary glass-transition",
                      isOpen && "rotate-180"
                    )}
                  >
                    {isOpen
                      ? collapseIcon || defaultCollapseIcon
                      : expandIcon || defaultExpandIcon}
                  </span>
                )}
              </button>

              {/* Accordion Content */}
              <AccordionContent
                id={`accordion-content-${item?.id}`}
                isOpen={isOpen}
                animated={shouldAnimate}
                duration={animationDuration}
                className={sizeClasses[size].content}
                role="tabpanel"
                aria-labelledby={`accordion-trigger-${item?.id}`}
              >
                {item?.content}
              </AccordionContent>
            </OptimizedGlass>
          );
        })}
      </div>
    );
  }
);

GlassAccordion.displayName = "GlassAccordion";

// Accordion Content Component with smooth height animation
interface AccordionContentProps {
  id: string;
  isOpen: boolean;
  animated: boolean;
  duration: number;
  className?: string;
  children: React.ReactNode;
  role?: string;
  "aria-labelledby"?: string;
}

const AccordionContent = forwardRef<HTMLDivElement, AccordionContentProps>(
  ({ id, isOpen, animated, duration, className, children, ...props }, ref) => {
    const contentRef = useRef<HTMLDivElement>(null);
    const [height, setHeight] = useState<number | "auto">(isOpen ? "auto" : 0);

    useEffect(() => {
      if (!animated) {
        setHeight(isOpen ? "auto" : 0);
        return;
      }

      const content = contentRef.current;
      if (!content) return;

      if (isOpen) {
        // Opening: measure content height and animate to it
        const scrollHeight = content.scrollHeight;
        setHeight(scrollHeight);

        // After animation completes, set to auto for dynamic content
        const timer = setTimeout(() => {
          setHeight("auto");
        }, duration);

        return () => clearTimeout(timer);
      } else {
        // Closing: set explicit height first, then animate to 0
        setHeight(content.scrollHeight);

        // Force reflow to ensure height is set before animating to 0
        requestAnimationFrame(() => {
          setHeight(0);
        });
      }
    }, [isOpen, animated, duration]);

    const contentStyle: React.CSSProperties = animated
      ? {
          height: height === "auto" ? "auto" : `${height}px`,
          overflow: "hidden",
          transition: `height ${duration}ms var(--glass-motion-easing-standard)`,
        }
      : {
          height: isOpen ? "auto" : 0,
          overflow: "hidden",
        };

    return (
      <div ref={contentRef} id={id} style={{ ...contentStyle }} {...props}>
        <div
          className={cn(
            "glass-transition glass-min-w-0 glass-break-words",
            className,
            {
              "opacity-0": !isOpen && animated,
              "opacity-100": isOpen || !animated,
            }
          )}
        >
          <ContrastGuard>{children}</ContrastGuard>
        </div>
      </div>
    );
  }
);

AccordionContent.displayName = "AccordionContent";

// AccordionItem interface is already exported above
