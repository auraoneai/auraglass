'use client';
import React, { forwardRef } from "react";
import { cn } from "../../lib/utilsComprehensive";
import { OptimizedGlass } from "../../primitives";
import { useA11yId } from "../../utils/a11y";
import {
  ContrastGuard,
  TextWithContrast,
} from "@/components/accessibility/ContrastGuard";

export interface TimelineItem {
  /**
   * Unique identifier for the timeline item
   */
  id: string;
  /**
   * Primary title/content
   */
  title: string;
  /**
   * Secondary description or subtitle
   */
  subtitle?: string;
  /**
   * Timestamp or time label
   */
  time?: string;
  /**
   * Optional icon to display
   */
  icon?: React.ReactNode;
  /**
   * Additional metadata
   */
  metadata?: Record<string, any>;
  /**
   * Custom styling for this item
   */
  className?: string;
  /**
   * Whether this item is disabled
   */
  disabled?: boolean;
  /**
   * Click handler for interactive timelines
   */
  onClick?: () => void;
}

export interface GlassTimelineProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Timeline items to display
   */
  items: TimelineItem[];
  /**
   * Timeline variant
   */
  variant?: "default" | "bordered" | "compact";
  /**
   * Timeline size
   */
  size?: "sm" | "md" | "lg";
  /**
   * Timeline orientation
   */
  orientation?: "vertical" | "horizontal";
  /**
   * Whether to show connecting line
   */
  showLine?: boolean;
  /**
   * Position of time labels
   */
  timePosition?: "left" | "right" | "inline";
  /**
   * Custom connector line color
   */
  lineColor?: string;
  /**
   * Custom dot color
   */
  dotColor?: string;
  /**
   * ARIA label for the timeline
   */
  "aria-label"?: string;
}

/**
 * GlassTimeline component
 * A timeline component with glassmorphism styling for displaying chronological events
 */
export const GlassTimeline = forwardRef<HTMLDivElement, GlassTimelineProps>(
  (
    {
      // TODO: Integrate ContrastGuard for table cells, list items, badges, card titles, and other text content for WCAG AA compliance

      items,
      variant = "default",
      size = "md",
      orientation = "vertical",
      showLine = true,
      timePosition = "right",
      lineColor,
      dotColor,
      "aria-label": ariaLabel,
      className,
      ...props
    },
    ref
  ) => {
    const timelineId = useA11yId("timeline");
    const sizeClasses = {
      sm: {
        container: "pl-4",
        dot: "w-2 h-2 -glass-ml-1",
        line: "left-1.5 w-px",
        content: "glass-p-2 glass-text-sm",
        title: "glass-text-sm",
        subtitle: "glass-text-xs",
        time: "glass-text-xs",
        gap: "glass-gap-3",
      },
      md: {
        container: "pl-6",
        dot: "w-3 h-3 -glass-ml-1.5",
        line: "left-2 w-px",
        content: "glass-p-3 glass-text-base",
        title: "glass-text-base",
        subtitle: "glass-text-sm",
        time: "glass-text-xs",
        gap: "glass-gap-4",
      },
      lg: {
        container: "pl-8",
        dot: "w-4 h-4 -glass-ml-2",
        line: "left-3 w-px",
        content: "glass-p-4 glass-text-lg",
        title: "glass-text-lg",
        subtitle: "glass-text-base",
        time: "glass-text-sm",
        gap: "space-y-6",
      },
    };

    const variantClasses = {
      default: "border-0",
      bordered: "border border-border/20",
      compact: "border-0",
    };

    const config = sizeClasses[size];

    if (orientation === "horizontal") {
      return (
        <div
          data-glass-component
          ref={ref}
          id={timelineId}
          className={cn(
            "flex items-start glass-gap-4 overflow-x-auto",
            className
          )}
          role="list"
          aria-label={ariaLabel || "Timeline"}
          {...props}
        >
          {showLine && (
            <div
              className='absolute top-8 left-0 right-0 h-px bg-border/20'
              style={{ backgroundColor: lineColor }}
            />
          )}
          {items.map((item, index) => (
            <div
              key={item.id}
              className='relative glass-flex-shrink-0 glass-min-w-0'
              role="listitem"
            >
              {/* Dot */}
              <div
                className={cn(
                  "absolute top-6 left-1/2 -translate-x-1/2 glass-radius-full bg-primary shadow-lg",
                  config.dot
                )}
                style={{ backgroundColor: dotColor }}
              />

              {/* Content */}
              <div className='pt-12'>
                <OptimizedGlass
                  elevation="level1"
                  intensity="medium"
                  depth={2}
                  tint="neutral"
                  border="subtle"
                  animation="none"
                  performanceMode="medium"
                  className={cn(
                    "glass-radius-lg max-w-xs",
                    config.content,
                    variantClasses[variant]
                  )}
                >
                  <div className="glass-min-w-0">
                    <div
                      className={cn(
                        "font-medium text-foreground truncate",
                        config.title
                      )}
                    >
                      {item.title}
                    </div>
                    {item.subtitle && (
                      <div
                        className={cn(
                          "glass-text-secondary truncate glass-mt-1",
                          config.subtitle
                        )}
                      >
                        {item.subtitle}
                      </div>
                    )}
                    {item.time && (
                      <div
                        className={cn(
                          "glass-text-secondary glass-mt-2",
                          config.time
                        )}
                      >
                        {item.time}
                      </div>
                    )}
                  </div>
                </OptimizedGlass>
              </div>
            </div>
          ))}
        </div>
      );
    }

    return (
      <div
        ref={ref}
        id={timelineId}
        className={cn("relative", config.container, className)}
        role="list"
        aria-label={ariaLabel || "Timeline"}
        {...props}
      >
        {/* Connecting line */}
        {showLine && (
          <div
            className={cn(
              "absolute top-0 bottom-0",
              config.line,
              "bg-border/20"
            )}
            style={{ backgroundColor: lineColor }}
          />
        )}

        {/* Timeline items */}
        <ul className={cn("relative", config.gap)} role="list">
          {items.map((item, index) => {
            const isLast = index === items.length - 1;

            return (
              <li key={item.id} className='relative' role="listitem">
                {/* Dot */}
                <span
                  className={cn(
                    "absolute top-2 glass-radius-full bg-primary shadow-lg",
                    config.dot
                  )}
                  style={{ backgroundColor: dotColor }}
                />

                {/* Content */}
                <OptimizedGlass
                  elevation="level1"
                  intensity="medium"
                  depth={2}
                  tint="neutral"
                  border="subtle"
                  animation="none"
                  performanceMode="medium"
                  className={cn(
                    "glass-radius-lg",
                    config.content,
                    variantClasses[variant]
                  )}
                >
                  <div className="glass-flex glass-items-start glass-justify-between glass-gap-4">
                    <div className="glass-flex glass-items-start glass-gap-3 glass-min-w-0 glass-flex-1">
                      {item.icon && (
                        <div className="glass-flex-shrink-0 glass-text-secondary glass-mt-0-5">
                          {item.icon}
                        </div>
                      )}
                      <div className="glass-min-w-0 glass-flex-1">
                        <div
                          className={cn(
                            "font-medium text-foreground",
                            config.title
                          )}
                        >
                          {item.title}
                        </div>
                        {item.subtitle && (
                          <div
                            className={cn(
                              "glass-text-secondary glass-mt-1",
                              config.subtitle
                            )}
                          >
                            {item.subtitle}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Time */}
                    {item.time && timePosition === "right" && (
                      <div
                        className={cn(
                          "glass-text-secondary whitespace-nowrap",
                          config.time
                        )}
                      >
                        {item.time}
                      </div>
                    )}
                  </div>

                  {/* Inline time */}
                  {item.time && timePosition === "inline" && (
                    <div
                      className={cn(
                        "glass-text-secondary glass-mt-2",
                        config.time
                      )}
                    >
                      {item.time}
                    </div>
                  )}
                </OptimizedGlass>
              </li>
            );
          })}
        </ul>
      </div>
    );
  }
);

GlassTimeline.displayName = "GlassTimeline";

export default GlassTimeline;

/**
 * TimelineItem utility component for building timeline structures
 */
export interface TimelineItemComponentProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Timeline item data
   */
  item: TimelineItem;
  /**
   * Whether this is the last item
   */
  isLast?: boolean;
  /**
   * Size variant
   */
  size?: "sm" | "md" | "lg";
}

export const TimelineItemComponent = forwardRef<
  HTMLDivElement,
  TimelineItemComponentProps
>(({ item, isLast = false, size = "md", className, ...props }, ref) => {
  return (
    <div ref={ref} className={cn("timeline-item", className)} {...props}>
      {/* Implementation would mirror the individual item logic from above */}
      <OptimizedGlass
        elevation="level1"
        intensity="medium"
        depth={2}
        tint="neutral"
        border="subtle"
        animation="none"
        performanceMode="medium"
        className="glass-radius-lg glass-p-3"
      >
        <div className='font-medium text-primary'>{item.title}</div>
        {item.subtitle && (
          <div className="glass-text-sm glass-text-secondary glass-mt-1">
            {item.subtitle}
          </div>
        )}
        {item.time && (
          <div className="glass-text-xs glass-text-secondary glass-mt-2">
            {item.time}
          </div>
        )}
      </OptimizedGlass>
    </div>
  );
});

TimelineItemComponent.displayName = "TimelineItemComponent";