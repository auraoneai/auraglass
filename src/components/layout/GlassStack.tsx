import React, { forwardRef } from "react";
import { cn } from "../../lib/utilsComprehensive";
import { useA11yId } from "@/utils/a11y";
import { useMotionPreferenceContext } from "@/contexts/MotionPreferenceContext";
import {
  ContrastGuard,
  TextWithContrast,
} from "@/components/accessibility/ContrastGuard";

export interface GlassStackProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Stack direction
   */
  direction?: "vertical" | "horizontal";
  /**
   * Responsive direction
   */
  responsive?: {
    sm?: "vertical" | "horizontal";
    md?: "vertical" | "horizontal";
    lg?: "vertical" | "horizontal";
    xl?: "vertical" | "horizontal";
    "2xl"?: "vertical" | "horizontal";
  };
  /**
   * Space between items
   */
  space?: "none" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
  /**
   * Alias for space (compat)
   */
  spacing?: "none" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
  /**
   * Responsive spacing
   */
  responsiveSpace?: {
    sm?: "none" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
    md?: "none" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
    lg?: "none" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
    xl?: "none" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
    "2xl"?: "none" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
  };
  /**
   * Alignment of items
   */
  align?: "start" | "center" | "end" | "stretch" | "baseline";
  /**
   * Justify content
   */
  justify?: "start" | "center" | "end" | "between" | "around" | "evenly";
  /**
   * Whether items should wrap
   */
  wrap?: boolean;
  /**
   * Divider between items
   */
  divider?: React.ReactNode;
  /**
   * Custom divider render function
   */
  renderDivider?: (index: number) => React.ReactNode;
  /**
   * Whether to respect user's motion preferences
   */
  respectMotionPreference?: boolean;
  /**
   * Accessibility label for screen readers
   */
  "aria-label"?: string;
  /**
   * Accessibility role for semantic meaning
   */
  role?: string;
}

export interface GlassStackItemProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Whether this item should grow to fill available space
   */
  grow?: boolean;
  /**
   * Whether this item should shrink
   */
  shrink?: boolean;
  /**
   * Align this item differently from the stack alignment
   */
  alignSelf?: "auto" | "start" | "center" | "end" | "stretch" | "baseline";
  /**
   * Whether to respect user's motion preferences
   */
  respectMotionPreference?: boolean;
  /**
   * Accessibility label for screen readers
   */
  "aria-label"?: string;
  /**
   * Accessibility role for semantic meaning
   */
  role?: string;
}

/**
 * GlassStack component
 * Layout component for stacking items with consistent spacing
 */
export const GlassStack = forwardRef<HTMLDivElement, GlassStackProps>(
  (
    {
      // TODO: Integrate ContrastGuard for any section titles, labels, and helper text for WCAG AA compliance

      direction = "vertical",
      responsive,
      space = "md",
      spacing,
      responsiveSpace,
      align = "stretch",
      justify = "start",
      wrap = false,
      divider,
      renderDivider,
      respectMotionPreference = true,
      "aria-label": ariaLabel,
      role,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const spaceClasses = {
      none: "glass-gap-0",
      xs: "glass-gap-1",
      sm: "glass-gap-2",
      md: "glass-gap-4",
      lg: "glass-gap-6",
      xl: "gap-8",
      "2xl": "glass-gap-12",
    };

    const alignClasses = {
      start: "items-start",
      center: "items-center",
      end: "items-end",
      stretch: "items-stretch",
      baseline: "items-baseline",
    };

    const justifyClasses = {
      start: "justify-start",
      center: "justify-center",
      end: "justify-end",
      between: "justify-between",
      around: "justify-around",
      evenly: "justify-evenly",
    };

    const directionClasses = {
      vertical: "flex-col",
      horizontal: "flex-row",
    };

    const responsiveDirectionClasses = responsive
      ? [
          responsive.sm && `sm:${directionClasses[responsive.sm]}`,
          responsive.md && `md:${directionClasses[responsive.md]}`,
          responsive.lg && `lg:${directionClasses[responsive.lg]}`,
          responsive.xl && `xl:${directionClasses[responsive.xl]}`,
          responsive["2xl"] && `2xl:${directionClasses[responsive["2xl"]]}`,
        ].filter(Boolean)
      : [];

    const responsiveSpaceClasses = responsiveSpace
      ? [
          responsiveSpace.sm && `sm:${spaceClasses[responsiveSpace.sm]}`,
          responsiveSpace.md && `md:${spaceClasses[responsiveSpace.md]}`,
          responsiveSpace.lg && `lg:${spaceClasses[responsiveSpace.lg]}`,
          responsiveSpace.xl && `xl:${spaceClasses[responsiveSpace.xl]}`,
          responsiveSpace["2xl"] &&
            `2xl:${spaceClasses[responsiveSpace["2xl"]]}`,
        ].filter(Boolean)
      : [];

    // Process children to add dividers
    const processedChildren = React.Children.toArray(children).filter(Boolean);

    const childrenWithDividers =
      divider || renderDivider
        ? processedChildren.reduce((acc: React.ReactNode[], child, index) => {
            acc.push(child);

            // Add divider between items (not after the last item)
            if (index < processedChildren.length - 1) {
              const dividerElement = renderDivider
                ? renderDivider(index)
                : divider;
              if (dividerElement) {
                acc.push(
                  <div key={`divider-${index}`} className="glass-flex-shrink-0">
                    {dividerElement}
                  </div>
                );
              }
            }

            return acc;
          }, [] as React.ReactNode[])
        : processedChildren;

    const stackId = useA11yId();
    const { prefersReducedMotion } = useMotionPreferenceContext();
    const shouldRespectMotion =
      respectMotionPreference && !prefersReducedMotion;

    const a11yProps = {
      ...(ariaLabel && { "aria-label": ariaLabel, id: stackId }),
      ...(role && { role }),
    };

    return (
      <div
        ref={ref}
        className={cn(
          "flex",
          directionClasses[direction],
          ...responsiveDirectionClasses,
          spaceClasses[spacing ?? space],
          ...responsiveSpaceClasses,
          alignClasses[align],
          justifyClasses[justify],
          wrap && "flex-wrap",
          // Motion preferences
          shouldRespectMotion &&
            "motion-safe:transition-all motion-reduce:transition-none",
          className
        )}
        {...a11yProps}
        {...props}
      >
        {childrenWithDividers}
      </div>
    );
  }
);

GlassStack.displayName = "GlassStack";

/**
 * GlassStackItem component
 * Individual item within a stack with flex control
 */
export const GlassStackItem = forwardRef<HTMLDivElement, GlassStackItemProps>(
  (
    {
      grow = false,
      shrink = true,
      alignSelf = "auto",
      respectMotionPreference = true,
      "aria-label": ariaLabel,
      role,
      className,
      ...props
    },
    ref
  ) => {
    const alignSelfClasses = {
      auto: "self-auto",
      start: "self-start",
      center: "self-center",
      end: "self-end",
      stretch: "self-stretch",
      baseline: "self-baseline",
    };

    const itemId = useA11yId();
    const { prefersReducedMotion } = useMotionPreferenceContext();
    const shouldRespectMotion =
      respectMotionPreference && !prefersReducedMotion;

    const a11yProps = {
      ...(ariaLabel && { "aria-label": ariaLabel, id: itemId }),
      ...(role && { role }),
    };

    return (
      <div
        ref={ref}
        className={cn(
          grow && "flex-grow",
          !shrink && "flex-shrink-0",
          alignSelfClasses[alignSelf],
          // Motion preferences
          shouldRespectMotion &&
            "motion-safe:transition-all motion-reduce:transition-none",
          className
        )}
        {...a11yProps}
        {...props}
      />
    );
  }
);

GlassStackItem.displayName = "GlassStackItem";

/**
 * VStack component
 * Vertical stack (shorthand for GlassStack with direction="vertical")
 */
export const VStack = forwardRef<
  HTMLDivElement,
  Omit<GlassStackProps, "direction">
>((props, ref) => <GlassStack ref={ref} direction="vertical" {...props} />);

VStack.displayName = "VStack";

/**
 * HStack component
 * Horizontal stack (shorthand for GlassStack with direction="horizontal")
 */
export const HStack = forwardRef<
  HTMLDivElement,
  Omit<GlassStackProps, "direction">
>((props, ref) => <GlassStack ref={ref} direction="horizontal" {...props} />);

HStack.displayName = "HStack";
