"use client";
import React, { forwardRef } from "react";
import { OptimizedGlass } from "../../primitives";
import { Motion } from "../../primitives";
import { cn } from "../../lib/utilsComprehensive";
import { useA11yId } from "../../utils/a11y";
import { useMotionPreferenceContext } from "../../contexts/MotionPreferenceContext";
import {
  ContrastGuard,
  TextWithContrast,
} from "@/components/accessibility/ContrastGuard";
import { ANIMATION } from "../../tokens/designConstants";
import { useReducedMotion } from "../../hooks/useReducedMotion";

export interface GlassLoadingSkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Number of skeleton rows to display */
  rows?: number;
  /** Height of each row */
  height?: string | number;
  /** Width of the skeleton */
  width?: string | number;
  /** Whether to show avatar skeleton */
  avatar?: boolean;
  /** Avatar size */
  avatarSize?: "sm" | "md" | "lg" | "xl";
  /** Whether to animate the skeleton */
  animate?: boolean;
  /** Layout variant */
  variant?: "default" | "card" | "list" | "table" | "form" | "dashboard";
  /** Show shimmer effect */
  shimmer?: boolean;
  /** Respect user's motion preferences */
  respectMotionPreference?: boolean;
  /** ARIA label for the loading skeleton */
  "aria-label"?: string;
}

export const GlassLoadingSkeleton = forwardRef<
  HTMLDivElement,
  GlassLoadingSkeletonProps
>(
  (
    {
      rows = 3,
      height = "1rem",
      width = "100%",
      avatar = false,
      avatarSize = "md",
      animate = true,
      variant = "default",
      shimmer = true,
      respectMotionPreference = true,
      "aria-label": ariaLabel,
      className,
      children,
      "data-testid": dataTestId,
      ...props
    },
    ref
  ) => {
    const skeletonId = useA11yId("skeleton");
    const { prefersReducedMotion } = useMotionPreferenceContext();
    const shouldAnimate =
      animate && (!respectMotionPreference || !prefersReducedMotion);
    const shouldShimmer =
      shimmer && (!respectMotionPreference || !prefersReducedMotion);

    const avatarSizes = {
      sm: "glass-w-8 glass-h-8",
      md: "glass-w-12 glass-h-12",
      lg: "glass-w-16 glass-h-16",
      xl: "glass-w-20 glass-h-20",
    };

    const baseClasses = cn(
      "glass-skeleton",
      "glass-radius-md",
      shouldShimmer && shouldAnimate && "glass-animate-pulse",
      "glass-backdrop-blur-md"
    );

    // Consistent glassmorphism styling for all skeleton elements
    const getSkeletonStyle = () => ({
      background: `
        linear-gradient(135deg, rgba(71, 85, 105, 0.58) 0%, rgba(30, 41, 59, 0.48) 50%, rgba(71, 85, 105, 0.52) 100%),
        linear-gradient(135deg, rgba(15, 23, 42, 0.72) 0%, rgba(8, 13, 25, 0.68) 100%)
      `,
      border: "1px solid rgba(148, 163, 184, 0.18)",
      boxShadow:
        "0 8px 20px rgba(2, 6, 23, 0.16), inset 0 1px 0 rgba(255, 255, 255, 0.06)",
    });

    const renderBasicSkeleton = () => (
      <div className="glass-auto-gap glass-auto-gap-md">
        {avatar && (
          <div
            className={cn(
              "glass-radius-full",
              baseClasses,
              avatarSizes[avatarSize]
            )}
            style={{ ...getSkeletonStyle() }}
          />
        )}

        {Array.from({ length: rows }, (_, index) => {
          const isLast = index === rows - 1;
          const rowWidth = isLast && rows > 1 ? "80%" : width;

          return (
            <div
              key={index}
              className={baseClasses}
              style={{
                height: typeof height === "number" ? `${height}px` : height,
                width:
                  typeof rowWidth === "number" ? `${rowWidth}px` : rowWidth,
                ...getSkeletonStyle(),
              }}
            />
          );
        })}
      </div>
    );

    const renderCardSkeleton = () => (
      <OptimizedGlass
        elevation={"level1"}
        intensity="medium"
        depth={2}
        tint="neutral"
        border="subtle"
        animation="none"
        performanceMode="medium"
        className="glass-p-6"
        style={{
          background:
            "var(--glass-primary-level3-surface)",
          border: "1px solid rgba(148, 163, 184, 0.18)",
          boxShadow:
            "0 12px 28px rgba(2, 6, 23, 0.18), inset 0 1px 0 rgba(255, 255, 255, 0.06)",
        }}
      >
        <div className="glass-auto-gap glass-auto-gap-lg">
          {/* Header */}
          <div className="glass-flex glass-items-center glass-gap-4">
            {avatar && (
              <div
                className={cn(
                  "glass-radius-full",
                  baseClasses,
                  avatarSizes[avatarSize]
                )}
                style={{ ...getSkeletonStyle() }}
              />
            )}
            <div className="glass-auto-gap glass-auto-gap-sm glass-flex-1">
              <div
                className={cn(baseClasses, "glass-h-5 glass-w-3/4")}
                style={{ ...getSkeletonStyle() }}
              />
              <div
                className={cn(baseClasses, "glass-h-4 glass-w-1/2")}
                style={{ ...getSkeletonStyle() }}
              />
            </div>
          </div>

          {/* Content */}
          <div className="glass-auto-gap glass-auto-gap-sm">
            {Array.from({ length: rows }, (_, index) => (
              <div
                key={index}
                className={cn(baseClasses, "glass-h-4")}
                style={{
                  width: index === rows - 1 ? "60%" : "100%",
                  ...getSkeletonStyle(),
                }}
              />
            ))}
          </div>

          {/* Actions */}
          <div className="glass-flex glass-gap-3 glass-pt-2">
            <div
              className={cn(baseClasses, "glass-w-20 glass-radius-lg")}
              style={{ height: 36, ...getSkeletonStyle() }}
            />
            <div
              className={cn(baseClasses, "glass-w-16 glass-radius-lg")}
              style={{ height: 36, ...getSkeletonStyle() }}
            />
          </div>
        </div>
      </OptimizedGlass>
    );

    const renderListSkeleton = () => (
      <div className="glass-auto-gap glass-auto-gap-md">
        {Array.from({ length: rows }, (_, index) => (
          <div
            key={index}
            className="glass-flex glass-items-center glass-gap-4 glass-p-3"
          >
            <div
              className={cn(
                "glass-radius-full",
                baseClasses,
                "glass-w-10 glass-h-10"
              )}
              style={{ ...getSkeletonStyle() }}
            />
            <div className="glass-auto-gap glass-auto-gap-sm glass-flex-1">
              <div
                className={cn(baseClasses, "glass-h-4 glass-w-3/4")}
                style={{ ...getSkeletonStyle() }}
              />
              <div
                className={cn(baseClasses, "glass-h-3 glass-w-1/2")}
                style={{ ...getSkeletonStyle() }}
              />
            </div>
            <div
              className={cn(
                baseClasses,
                "glass-h-6 glass-w-16 glass-radius-md"
              )}
              style={{ ...getSkeletonStyle() }}
            />
          </div>
        ))}
      </div>
    );

    const renderTableSkeleton = () => (
      <div className="glass-auto-gap glass-auto-gap-sm">
        {/* Header */}
        <div className="glass-grid glass-grid-cols-4 glass-gap-4 glass-p-4 glass-border-b glass-border-white/10">
          {Array.from({ length: 4 }, (_, index) => (
            <div
              key={index}
              className={cn(baseClasses, "glass-h-4 glass-w-16")}
              style={{ ...getSkeletonStyle() }}
            />
          ))}
        </div>

        {/* Rows */}
        {Array.from({ length: rows }, (_, rowIndex) => (
          <div
            key={rowIndex}
            className="glass-grid glass-grid-cols-4 glass-gap-4 glass-p-4"
          >
            {Array.from({ length: 4 }, (_, colIndex) => (
              <div
                key={colIndex}
                className={cn(baseClasses, "glass-h-4")}
                style={{ ...getSkeletonStyle() }}
              />
            ))}
          </div>
        ))}
      </div>
    );

    const renderFormSkeleton = () => (
      <div className="glass-auto-gap glass-auto-gap-2xl">
        {Array.from({ length: rows }, (_, index) => (
          <div key={index} className="glass-auto-gap glass-auto-gap-sm">
            <div
              className={cn(baseClasses, "glass-h-4 glass-w-24")}
              style={{ ...getSkeletonStyle() }}
            />
            <div
              className={cn(
                baseClasses,
                "glass-h-10 glass-w-full glass-radius-lg"
              )}
              style={{ ...getSkeletonStyle() }}
            />
          </div>
        ))}

        <div className="glass-flex glass-gap-3 glass-pt-4">
          <div
            className={cn(baseClasses, "glass-h-10 glass-w-24 glass-radius-lg")}
            style={{ ...getSkeletonStyle() }}
          />
          <div
            className={cn(baseClasses, "glass-h-10 glass-w-20 glass-radius-lg")}
            style={{ ...getSkeletonStyle() }}
          />
        </div>
      </div>
    );

    const renderDashboardSkeleton = () => (
      <div className="glass-grid glass-grid-cols-1 md:glass-grid-cols-2 lg:glass-grid-cols-3 glass-gap-6">
        {Array.from({ length: rows }, (_, index) => (
          <OptimizedGlass
            elevation={"level1"}
            intensity="medium"
            depth={2}
            tint="neutral"
            border="subtle"
            animation="none"
            performanceMode="medium"
            key={index}
            className="glass-p-6"
            style={{
              background:
                "var(--glass-primary-level3-surface)",
              border: "1px solid rgba(148, 163, 184, 0.18)",
              boxShadow:
                "0 12px 28px rgba(2, 6, 23, 0.18), inset 0 1px 0 rgba(255, 255, 255, 0.06)",
            }}
          >
            <div className="glass-auto-gap glass-auto-gap-lg">
              <div className="glass-flex glass-items-center glass-justify-between">
                <div
                  className={cn(baseClasses, "glass-h-5 glass-w-24")}
                  style={{ ...getSkeletonStyle() }}
                />
                <div
                  className={cn(
                    baseClasses,
                    "glass-h-6 glass-w-6 glass-radius-md"
                  )}
                  style={{ ...getSkeletonStyle() }}
                />
              </div>

              <div
                className={cn(baseClasses, "glass-h-8 glass-w-16")}
                style={{ ...getSkeletonStyle() }}
              />

              <div className="glass-auto-gap glass-auto-gap-sm">
                <div
                  className={cn(baseClasses, "glass-h-3 glass-w-full")}
                  style={{ ...getSkeletonStyle() }}
                />
                <div
                  className={cn(baseClasses, "glass-h-3 glass-w-3/4")}
                  style={{ ...getSkeletonStyle() }}
                />
              </div>
            </div>
          </OptimizedGlass>
        ))}
      </div>
    );

    const renderSkeleton = () => {
      if (children) {
        return children;
      }

      switch (variant) {
        case "card":
          return renderCardSkeleton();
        case "list":
          return renderListSkeleton();
        case "table":
          return renderTableSkeleton();
        case "form":
          return renderFormSkeleton();
        case "dashboard":
          return renderDashboardSkeleton();
        default:
          return renderBasicSkeleton();
      }
    };

    return (
      <Motion
        preset={shouldAnimate ? "fadeIn" : undefined}
        className={cn("glass-loading-skeleton", className)}
      >
        <div
          ref={ref}
          id={skeletonId}
          role="status"
          aria-label={ariaLabel || "Loading content"}
          aria-busy="true"
          aria-live="polite"
          className="glass-relative glass-overflow-hidden glass-radius-md"
          data-testid={dataTestId}
          {...props}
        >
          {renderSkeleton()}

          {/* Premium Shimmer overlay */}
          {shouldShimmer && (
            <div
              className="glass-absolute glass-inset-0 glass-pointer-events-none glass-animate-glass-shimmer"
              style={{
                transform: "skewX(-12deg)",
                background:
                  "linear-gradient(90deg, transparent 0%, color-mix(in srgb, var(--glass-white) 16%, transparent) 45%, transparent 100%)",
              }}
            />
          )}
        </div>
      </Motion>
    );
  }
);

GlassLoadingSkeleton.displayName = "GlassLoadingSkeleton";

// Utility components for common patterns
export const GlassSkeletonText = forwardRef<
  HTMLDivElement,
  Omit<GlassLoadingSkeletonProps, "variant">
>((props, ref) => (
  <GlassLoadingSkeleton ref={ref} variant="default" {...props} />
));

export const GlassSkeletonCard = forwardRef<
  HTMLDivElement,
  Omit<GlassLoadingSkeletonProps, "variant">
>((props, ref) => <GlassLoadingSkeleton ref={ref} variant="card" {...props} />);

export const GlassSkeletonList = forwardRef<
  HTMLDivElement,
  Omit<GlassLoadingSkeletonProps, "variant">
>((props, ref) => <GlassLoadingSkeleton ref={ref} variant="list" {...props} />);

export const GlassSkeletonTable = forwardRef<
  HTMLDivElement,
  Omit<GlassLoadingSkeletonProps, "variant">
>((props, ref) => (
  <GlassLoadingSkeleton ref={ref} variant="table" {...props} />
));

GlassSkeletonText.displayName = "GlassSkeletonText";
GlassSkeletonCard.displayName = "GlassSkeletonCard";
GlassSkeletonList.displayName = "GlassSkeletonList";
GlassSkeletonTable.displayName = "GlassSkeletonTable";

// CSS for shimmer animation (should be added to globals.css)
export const skeletonAnimationCSS = `
@keyframes shimmer {
  0% {
    transform: translateX(-100%) skewX(-12deg);
  }
  100% {
    transform: translateX(200%) skewX(-12deg);
  }
}

.animate-shimmer {
  animation: shimmer 2s infinite;
}
`;

export default GlassLoadingSkeleton;
