'use client';
import React, { forwardRef } from "react";
import { cn } from "../../lib/utilsComprehensive";
import { OptimizedGlass } from "../../primitives";
import {
  ContrastGuard,
  TextWithContrast,
} from "@/components/accessibility/ContrastGuard";

export type SkeletonVariant =
  | "text"
  | "rectangular"
  | "circular"
  | "glass-radius-md";

export interface GlassSkeletonProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** Shape variant of the skeleton */
  variant?: SkeletonVariant;
  /** Width of the skeleton */
  width?: string | number;
  /** Height of the skeleton */
  height?: string | number;
  /** Animation variant */
  animation?: "pulse" | "wave" | "none";
  /** Number of skeleton lines (for text variant) */
  lines?: number;
  /** Spacing between lines (for text variant) */
  spacing?: string;
}

// Animation keyframes
const skeletonKeyframes = `
  @keyframes skeleton-pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.6;
    }
  }

  @keyframes skeleton-wave {
    0% {
      transform: translateX(-100%);
    }
    100% {
      transform: translateX(100%);
    }
  }
`;

/**
 * GlassSkeleton component
 * A skeleton loader with glassmorphism styling for loading states
 */
export const GlassSkeleton = forwardRef<HTMLDivElement, GlassSkeletonProps>(
  (
    {
      // TODO: Integrate ContrastGuard for table cells, list items, badges, card titles, and other text content for WCAG AA compliance

      variant = "text",
      width,
      height,
      animation = "pulse",
      className,
      lines = 1,
      spacing = "0.5rem",
      ...props
    },
    ref
  ) => {
    const getBaseStyles = (): React.CSSProperties => {
      const baseWidth =
        typeof width === "number" ? `${width}px` : width || "100%";
      const baseHeight = typeof height === "number" ? `${height}px` : height;

      switch (variant) {
        case "circular":
          const size = baseHeight || baseWidth || "2rem";
          return {
            width: size,
            height: size,
            borderRadius: "50%",
          };
        case "glass-radius-md":
          return {
            width: baseWidth,
            height: baseHeight || "1rem",
            borderRadius: "0.375rem",
          };
        case "rectangular":
          return {
            width: baseWidth,
            height: baseHeight || "1rem",
            borderRadius: "0.25rem",
          };
        case "text":
        default:
          return {
            width: baseWidth,
            height: baseHeight || "1rem",
            borderRadius: "0.125rem",
          };
      }
    };

    const getAnimationStyles = (): React.CSSProperties => {
      switch (animation) {
        case "pulse":
          return {
            animation: "skeleton-pulse 2s ease-in-out infinite",
          };
        case "wave":
          return {
            position: "relative",
            overflow: "hidden",
            background:
              '/* Use createGlassStyle({ intent: "neutral", elevation: "level2" }) */',
            backgroundSize: "200% 100%",
            animation: "skeleton-wave 2s infinite",
          };
        case "none":
        default:
          return {};
      }
    };

    if (variant === "text" && lines > 1) {
      return (
        <>
          <style>{skeletonKeyframes}</style>
          <div ref={ref} className={cn("glass-gap-2", className)} {...props}>
            {Array.from({ length: lines }, (_, index) => {
              const lineWidth = Array.isArray(width)
                ? width[index % width.length]
                : typeof width === "string" && width.includes(",")
                  ? width.split(",")[index % width.split(",").length].trim()
                  : index === lines - 1
                    ? "60%"
                    : "100%";

              return (
                <OptimizedGlass
                  data-glass-component
                  key={index}
                  elevation="level1"
                  intensity="subtle"
                  depth={1}
                  tint="neutral"
                  border="subtle"
                  animation="none"
                  performanceMode="low"
                  data-glass-skeleton="true"
                  data-skeleton-variant={variant}
                  className={cn(
                    "block glass-skeleton",
                    animation === "pulse" && "animate-pulse"
                  )}
                  style={{
                    ...getBaseStyles(),
                    width: lineWidth,
                    ...getAnimationStyles(),
                    animationDelay: `${index * 0.1}s`,
                  }}
                />
              );
            })}
          </div>
        </>
      );
    }

    return (
      <>
        <style>{skeletonKeyframes}</style>
        <OptimizedGlass
          ref={ref}
          elevation="level1"
          intensity="subtle"
          depth={1}
          tint="neutral"
          border="subtle"
          animation="none"
          performanceMode="low"
          data-glass-skeleton="true"
          data-skeleton-variant={variant}
          data-skeleton-animation={animation}
          className={cn(
            "block glass-skeleton",
            animation === "pulse" && "animate-pulse",
            className
          )}
          style={{
            ...getBaseStyles(),
            ...getAnimationStyles(),
          }}
          {...props}
        />
      </>
    );
  }
);

GlassSkeleton.displayName = "GlassSkeleton";

// Pre-built skeleton components for common use cases

export const GlassSkeletonAvatar: React.FC<{
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}> = ({ size = "md", className="" }) => {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
    xl: "w-16 h-16",
  };

  return (
    <GlassSkeleton
      variant="circular"
      className={`${sizeClasses[size]} ${className}`}
      animation="pulse"
    />
  );
};

export const GlassSkeletonButton: React.FC<{
  width?: string;
  className?: string;
}> = ({ width = "80px", className="" }) => {
  return (
    <GlassSkeleton
      variant="glass-radius-md"
      width={width}
      height="2.5rem"
      className={className}
      animation="pulse"
    />
  );
};

export const GlassSkeletonCard: React.FC<{
  className?: string;
}> = ({ className="" }) => {
  return (
    <OptimizedGlass
      elevation="level1"
      intensity="medium"
      depth={2}
      tint="neutral"
      border="subtle"
      animation="none"
      performanceMode="medium"
      className={cn("glass-p-6 glass-gap-4", className)}
    >
      {/* Header skeleton */}
      <div className="glass-flex glass-items-center glass-gap-4">
        <GlassSkeletonAvatar size="md" />
        <div className="glass-gap-2 glass-flex-1">
          <GlassSkeleton width="60%" height="1rem" />
          <GlassSkeleton width="40%" height="0.75rem" />
        </div>
      </div>

      {/* Content skeleton */}
      <div className="glass-gap-3">
        <GlassSkeleton height="1rem" />
        <GlassSkeleton height="1rem" width="80%" />
        <GlassSkeleton height="1rem" width="60%" />
      </div>

      {/* Actions skeleton */}
      <div className='glass-flex glass-gap-2 glass-pt-2'>
        <GlassSkeleton width="60px" height="2rem" variant="glass-radius-md" />
        <GlassSkeleton width="60px" height="2rem" variant="glass-radius-md" />
      </div>
    </OptimizedGlass>
  );
};

export const GlassSkeletonTable: React.FC<{
  rows?: number;
  columns?: number;
  className?: string;
}> = ({ rows = 5, columns = 4, className="" }) => {
  return (
    <OptimizedGlass
      elevation="level1"
      intensity="medium"
      depth={2}
      tint="neutral"
      border="subtle"
      animation="none"
      performanceMode="medium"
      className={cn("overflow-hidden", className)}
    >
      {/* Table header */}
      <div className="glass-p-4 glass-border-b glass-border-white/10">
        <div
          className="glass-grid glass-gap-4"
          style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
        >
          {Array.from({ length: columns }, (_, i) => (
            <GlassSkeleton key={`header-${i}`} height="1rem" width="80%" />
          ))}
        </div>
      </div>

      {/* Table rows */}
      <div className='glass-divide-y glass-divide-white-opacity-5'>
        {Array.from({ length: rows }, (_, rowIndex) => (
          <div key={`row-${rowIndex}`} className="glass-p-4">
            <div
              className="glass-grid glass-gap-4"
              style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
            >
              {Array.from({ length: columns }, (_, colIndex) => (
                <GlassSkeleton
                  key={`cell-${rowIndex}-${colIndex}`}
                  height="1rem"
                  width={colIndex === columns - 1 ? "60%" : "100%"}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </OptimizedGlass>
  );
};

export const GlassSkeletonList: React.FC<{
  items?: number;
  className?: string;
}> = ({ items = 3, className="" }) => {
  return (
    <div className={`glass-gap-4 ${className}`}>
      {Array.from({ length: items }, (_, index) => (
        <div key={index} className="glass-flex glass-items-center glass-gap-4">
          <GlassSkeletonAvatar size="sm" />
          <div className="glass-flex-1 glass-gap-2">
            <GlassSkeleton height="1rem" width="70%" />
            <GlassSkeleton height="0.75rem" width="50%" />
          </div>
          <GlassSkeleton
            width="60px"
            height="1.5rem"
            variant="glass-radius-md"
          />
        </div>
      ))}
    </div>
  );
};