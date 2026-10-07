"use client";
import React, { forwardRef } from "react";
import { cn } from "../../lib/utilsComprehensive";
import { OptimizedGlass } from "../../primitives";
import { useA11yId } from "../../utils/a11y";
import { ContrastGuard } from "@/components/accessibility/ContrastGuard";

const timelineInk: React.CSSProperties = {
  color: "var(--glass-theme-text, var(--glass-text-primary))",
} as React.CSSProperties;

const timelineCard: React.CSSProperties = {
  ...timelineInk,
  background:
    "linear-gradient(145deg, rgba(255,255,255,0.105) 0%, rgba(255,255,255,0.035) 52%, rgba(255,255,255,0.018) 100%)",
  backgroundColor: "rgba(255,255,255,0.018)",
  border: "1px solid rgba(255,255,255,0.18)",
  boxShadow:
    "inset 0 1px 0 rgba(255, 255, 255, 0.18), 0 10px 28px rgba(15, 23, 42, 0.1)",
};

const timelineLayoutStyles = `.glass-timeline { width: 100%; max-width: 100%; box-sizing: border-box; }
.glass-timeline-list { list-style: none; margin: 0; padding: 0; display: grid; gap: 16px; }
.glass-timeline-item { padding-left: 34px; min-width: 0; }
.glass-timeline-line { top: 18px; bottom: 18px; left: 10px; width: 2px; border-radius: 999px; }
.glass-timeline-dot { left: 5px; top: 18px; z-index: 2; box-sizing: border-box; }
.glass-timeline-card { min-width: 0; overflow: hidden; }
@media (max-width: 480px) {
  .glass-timeline-item { padding-left: 28px; }
  .glass-timeline-line { left: 8px; }
  .glass-timeline-dot { left: 3px; }
  .glass-timeline-card-row { display: grid; gap: 8px; }
  .glass-timeline-time { white-space: normal; }
}`;

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
  metadata?: Record<string, unknown>;
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

export interface GlassTimelineProps extends React.HTMLAttributes<HTMLDivElement> {
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
      items,
      variant = "default",
      size = "md",
      orientation = "vertical",
      showLine = true,
      timePosition = "right",
      lineColor,
      dotColor,
      "aria-label": ariaLabel,
      "data-testid": dataTestId,
      className,
      ...props
    },
    ref
  ) => {
    const timelineId = useA11yId("timeline");
    const sizeClasses = {
      sm: {
        container: "",
        dot: "glass-w-2 glass-h-2",
        line: "",
        content: "glass-p-2 glass-text-sm",
        title: "glass-text-sm",
        subtitle: "glass-text-xs",
        time: "glass-text-xs",
        gap: "glass-gap-3",
      },
      md: {
        container: "",
        dot: "glass-w-3 glass-h-3",
        line: "",
        content: "glass-p-3 glass-text-base",
        title: "glass-text-base",
        subtitle: "glass-text-sm",
        time: "glass-text-xs",
        gap: "glass-gap-4",
      },
      lg: {
        container: "",
        dot: "glass-w-4 glass-h-4",
        line: "",
        content: "glass-p-4 glass-text-lg",
        title: "glass-text-lg",
        subtitle: "glass-text-base",
        time: "glass-text-sm",
        gap: "space-y-6",
      },
    };

    const variantClasses = {
      default: "glass-border-0",
      bordered: "glass-border glass-border-glass-border/20",
      compact: "glass-border-0",
    };

    const config = sizeClasses[size];

    if (orientation === "horizontal") {
      return (
        <div
          data-glass-component
          ref={ref}
          id={timelineId}
          className={cn(
            "glass-timeline glass-timeline-horizontal glass-relative glass-flex glass-items-start glass-gap-4 glass-overflow-x-auto",
            className
          )}
          style={timelineInk}
          role="list"
          aria-label={ariaLabel || "Timeline"}
          {...props}
        >
          {showLine && (
            <div
              className="glass-absolute glass-top-8 glass-left-0 glass-right-0 glass-h-px"
              style={{ backgroundColor: lineColor || "rgba(15, 23, 42, 0.2)" }}
            />
          )}
          {items.map((item, index) => (
            <div
              key={item.id}
              className="glass-relative glass-flex-shrink-0 glass-min-w-0"
              role="listitem"
            >
              {/* Dot */}
              <div
                className={cn(
                  "glass-absolute top-6 left-1/2 -translate-x-1/2 glass-radius-full",
                  config.dot
                )}
                style={{
                  backgroundColor:
                    dotColor ||
                    "var(--glass-theme-text-secondary, var(--glass-text-secondary))",
                  border: "2px solid rgba(255, 255, 255, 0.9)",
                  boxShadow: "0 0 0 3px rgba(15, 23, 42, 0.12)",
                }}
              />

              {/* Content */}
              <div className="glass-pt-12">
                <OptimizedGlass
                  elevation="level1"
                  intensity="medium"
                  depth={2}
                  tint="neutral"
                  border="subtle"
                  animation="none"
                  performanceMode="medium"
                  className={cn(
                    "glass-radius-lg max-w-xs glass-min-w-48",
                    config.content,
                    variantClasses[variant]
                  )}
                  style={timelineCard}
                >
                  <div className="glass-min-w-0">
                    <div
                      className={cn(
                        "glass-font-medium glass-text-primary glass-truncate",
                        config.title
                      )}
                    >
                      <ContrastGuard>{item.title}</ContrastGuard>
                    </div>
                    {item.subtitle && (
                      <ContrastGuard>
                        <div
                          className={cn(
                            "glass-text-secondary glass-truncate glass-mt-1",
                            config.subtitle
                          )}
                        >
                          {item.subtitle}
                        </div>
                      </ContrastGuard>
                    )}
                    {item.time && (
                      <ContrastGuard>
                        <div
                          className={cn(
                            "glass-text-secondary glass-mt-2",
                            config.time
                          )}
                        >
                          {item.time}
                        </div>
                      </ContrastGuard>
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
        data-testid={dataTestId || "glasstimeline"}
        className={cn("glass-timeline glass-relative", config.container, className)}
        style={timelineInk}
        aria-label={ariaLabel || "Timeline"}
        {...props}
      >
        {/* Connecting line */}
        {showLine && (
          <div
            className={cn("glass-timeline-line glass-absolute top-0 bottom-0", config.line)}
            style={{ backgroundColor: lineColor || "rgba(15, 23, 42, 0.2)" }}
          />
        )}

        {/* Timeline items */}
        <ul className={cn("glass-timeline-list glass-relative", config.gap)} role="list">
          {items.map((item) => {
            return (
              <li key={item.id} className="glass-timeline-item glass-relative" role="listitem">
                {/* Dot */}
                <span
                  className={cn(
                    "glass-timeline-dot glass-absolute glass-radius-full",
                    config.dot
                  )}
                  style={{
                    backgroundColor:
                    dotColor ||
                    "var(--glass-theme-text-secondary, var(--glass-text-secondary))",
                    border: "2px solid rgba(255, 255, 255, 0.92)",
                    boxShadow: "0 0 0 3px rgba(15, 23, 42, 0.12)",
                  }}
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
                    "glass-timeline-card glass-radius-lg",
                    config.content,
                    variantClasses[variant]
                  )}
                  style={timelineCard}
                >
                  <div className="glass-timeline-card-row glass-flex glass-items-start glass-justify-between glass-gap-4">
                    <div className="glass-flex glass-items-start glass-gap-3 glass-min-w-0 glass-flex-1">
                      {item.icon && (
                        <div className="glass-flex-shrink-0 glass-text-secondary glass-mt-0-5">
                          {item.icon}
                        </div>
                      )}
                      <div className="glass-min-w-0 glass-flex-1">
                        <div
                          className={cn(
                            "glass-font-medium glass-text-primary",
                            config.title
                          )}
                        >
                          <ContrastGuard>{item.title}</ContrastGuard>
                        </div>
                        {item.subtitle && (
                          <ContrastGuard>
                            <div
                              className={cn(
                                "glass-text-secondary glass-mt-1",
                                config.subtitle
                              )}
                            >
                              {item.subtitle}
                            </div>
                          </ContrastGuard>
                        )}
                      </div>
                    </div>

                    {/* Time */}
                    {item.time && timePosition === "right" && (
                      <div
                        className={cn(
                          "glass-timeline-time glass-text-secondary glass-whitespace-nowrap",
                          config.time
                        )}
                      >
                        <ContrastGuard>{item.time}</ContrastGuard>
                      </div>
                    )}
                  </div>

                  {/* Inline time */}
                  {item.time && timePosition === "inline" && (
                    <ContrastGuard>
                      <div
                        className={cn(
                          "glass-text-secondary glass-mt-2",
                          config.time
                        )}
                      >
                        {item.time}
                      </div>
                    </ContrastGuard>
                  )}
                </OptimizedGlass>
              </li>
            );
          })}
        </ul>
        <style>{timelineLayoutStyles}</style>
      </div>
    );
  }
);

GlassTimeline.displayName = "GlassTimeline";

export default GlassTimeline;

/**
 * TimelineItem utility component for building timeline structures
 */
export interface TimelineItemComponentProps extends React.HTMLAttributes<HTMLDivElement> {
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
        <ContrastGuard>
          <div className="glass-font-medium glass-text-primary">
            {item.title}
          </div>
        </ContrastGuard>
        {item.subtitle && (
          <ContrastGuard>
            <div className="glass-text-sm glass-text-secondary glass-mt-1">
              {item.subtitle}
            </div>
          </ContrastGuard>
        )}
        {item.time && (
          <ContrastGuard>
            <div className="glass-text-xs glass-text-secondary glass-mt-2">
              {item.time}
            </div>
          </ContrastGuard>
        )}
      </OptimizedGlass>
    </div>
  );
});

TimelineItemComponent.displayName = "TimelineItemComponent";
