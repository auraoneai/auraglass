"use client";
import React, { forwardRef } from "react";
import { cn } from "../../lib/utilsComprehensive";
import { useA11yId } from "@/utils/a11y";
import { useMotionPreferenceContext } from "@/contexts/MotionPreferenceContext";
import {
  ContrastGuard,
  TextWithContrast,
} from "@/components/accessibility/ContrastGuard";

export interface GlassFlexProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Flex direction
   */
  direction?: "row" | "row-reverse" | "col" | "col-reverse";
  /**
   * Responsive direction
   */
  responsive?: {
    sm?: "row" | "row-reverse" | "col" | "col-reverse";
    md?: "row" | "row-reverse" | "col" | "col-reverse";
    lg?: "row" | "row-reverse" | "col" | "col-reverse";
    xl?: "row" | "row-reverse" | "col" | "col-reverse";
    "2xl"?: "row" | "row-reverse" | "col" | "col-reverse";
  };
  /**
   * Flex wrap
   */
  wrap?: "nowrap" | "wrap" | "wrap-reverse";
  /**
   * Justify content
   */
  justify?: "start" | "end" | "center" | "between" | "around" | "evenly";
  /**
   * Align items
   */
  align?: "start" | "end" | "center" | "baseline" | "stretch";
  /**
   * Align content (for wrapped items)
   */
  alignContent?:
    | "start"
    | "end"
    | "center"
    | "between"
    | "around"
    | "evenly"
    | "stretch";
  /**
   * Gap between items
   */
  gap?: "none" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
  /**
   * Horizontal gap
   */
  gapX?: "none" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
  /**
   * Vertical gap
   */
  gapY?: "none" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
  /**
   * Whether flex container should grow to fill available space
   */
  fullWidth?: boolean;
  /**
   * Whether flex container should grow to fill available height
   */
  fullHeight?: boolean;
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

export interface GlassFlexItemProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Flex grow
   */
  grow?: boolean | 0 | 1;
  /**
   * Flex shrink
   */
  shrink?: boolean | 0 | 1;
  /**
   * Flex basis
   */
  basis?:
    | "auto"
    | "full"
    | "1/2"
    | "1/3"
    | "2/3"
    | "1/4"
    | "3/4"
    | "1/5"
    | "2/5"
    | "3/5"
    | "4/5"
    | "1/6"
    | "5/6"
    | "1/12"
    | "5/12"
    | "7/12"
    | "11/12";
  /**
   * Flex shorthand (grow shrink basis)
   */
  flex?: "none" | "auto" | "initial" | "1";
  /**
   * Align self
   */
  alignSelf?: "auto" | "start" | "end" | "center" | "baseline" | "stretch";
  /**
   * Order
   */
  order?:
    | "none"
    | "first"
    | "last"
    | 1
    | 2
    | 3
    | 4
    | 5
    | 6
    | 7
    | 8
    | 9
    | 10
    | 11
    | 12;
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
 * GlassFlex component
 * Flexible layout container with glassmorphism styling
 */
export const GlassFlex = forwardRef<HTMLDivElement, GlassFlexProps>(
  (
    {
      // ContrastGuard layout text coverage is tracked in the manual accessibility QA report.

      direction = "row",
      responsive,
      wrap = "nowrap",
      justify = "start",
      align = "stretch",
      alignContent = "start",
      gap = "none",
      gapX,
      gapY,
      fullWidth = false,
      fullHeight = false,
      respectMotionPreference = true,
      "aria-label": ariaLabel,
      role,
      className,
      ...props
    },
    ref
  ) => {
    const directionClasses = {
      row: "flex-row",
      "row-reverse": "flex-row-reverse",
      col: "flex-col",
      "col-reverse": "flex-col-reverse",
    };

    const wrapClasses = {
      nowrap: "flex-nowrap",
      wrap: "flex-wrap",
      "wrap-reverse": "flex-wrap-reverse",
    };

    const justifyClasses = {
      start: "justify-start",
      end: "justify-end",
      center: "justify-center",
      between: "justify-between",
      around: "justify-around",
      evenly: "justify-evenly",
    };

    const alignClasses = {
      start: "items-start",
      end: "items-end",
      center: "items-center",
      baseline: "items-baseline",
      stretch: "items-stretch",
    };

    const alignContentClasses = {
      start: "content-start",
      end: "content-end",
      center: "content-center",
      between: "content-between",
      around: "content-around",
      evenly: "content-evenly",
      stretch: "content-stretch",
    };

    const gapClasses = {
      none: "glass-gap-0",
      xs: "glass-gap-1",
      sm: "glass-gap-2",
      md: "glass-gap-4",
      lg: "glass-gap-6",
      xl: "gap-8",
      "2xl": "glass-gap-12",
    };

    const gapXClasses = {
      none: "gap-x-0",
      xs: "gap-x-1",
      sm: "gap-x-2",
      md: "gap-x-4",
      lg: "gap-x-6",
      xl: "gap-x-8",
      "2xl": "gap-x-12",
    };

    const gapYClasses = {
      none: "gap-y-0",
      xs: "gap-y-1",
      sm: "gap-y-2",
      md: "gap-y-4",
      lg: "gap-y-6",
      xl: "gap-y-8",
      "2xl": "gap-y-12",
    };

    const responsiveClasses = responsive
      ? [
          responsive.sm && `sm:${directionClasses[responsive.sm]}`,
          responsive.md && `md:${directionClasses[responsive.md]}`,
          responsive.lg && `lg:${directionClasses[responsive.lg]}`,
          responsive.xl && `xl:${directionClasses[responsive.xl]}`,
          responsive["2xl"] && `2xl:${directionClasses[responsive["2xl"]]}`,
        ].filter(Boolean)
      : [];

    const flexId = useA11yId();
    const { prefersReducedMotion } = useMotionPreferenceContext();
    const shouldRespectMotion =
      respectMotionPreference && !prefersReducedMotion;

    const a11yProps = {
      ...(ariaLabel && { "aria-label": ariaLabel, id: flexId }),
      ...(role && { role }),
    };

    return (
      <div
        ref={ref}
        className={cn(
          "flex",
          directionClasses[direction],
          wrapClasses[wrap],
          justifyClasses[justify],
          alignClasses[align],
          alignContentClasses[alignContent],
          gapX ? gapXClasses[gapX] : gapY ? gapYClasses[gapY] : gapClasses[gap],
          gapX && gapY && [gapXClasses[gapX], gapYClasses[gapY]],
          fullWidth && "w-full",
          fullHeight && "h-full",
          // Motion preferences
          shouldRespectMotion &&
            "motion-safe:transition-all motion-reduce:transition-none",
          ...responsiveClasses,
          className
        )}
        {...a11yProps}
        {...props}
      />
    );
  }
);

GlassFlex.displayName = "GlassFlex";

/**
 * GlassFlexItem component
 * Flex item with control over flex properties
 */
export const GlassFlexItem = forwardRef<HTMLDivElement, GlassFlexItemProps>(
  (
    {
      grow = false,
      shrink = true,
      basis = "auto",
      flex,
      alignSelf = "auto",
      order = "none",
      respectMotionPreference = true,
      "aria-label": ariaLabel,
      role,
      className,
      ...props
    },
    ref
  ) => {
    const growClasses = {
      false: "",
      true: "flex-grow",
      0: "flex-grow-0",
      1: "flex-grow",
    };

    const shrinkClasses = {
      false: "flex-shrink-0",
      true: "flex-shrink",
      0: "flex-shrink-0",
      1: "flex-shrink",
    };

    const basisClasses = {
      auto: "basis-auto",
      full: "basis-full",
      "1/2": "basis-1/2",
      "1/3": "basis-1/3",
      "2/3": "basis-2/3",
      "1/4": "basis-1/4",
      "3/4": "basis-3/4",
      "1/5": "basis-1/5",
      "2/5": "basis-2/5",
      "3/5": "basis-3/5",
      "4/5": "basis-4/5",
      "1/6": "basis-1/6",
      "5/6": "basis-5/6",
      "1/12": "basis-1/12",
      "5/12": "basis-5/12",
      "7/12": "basis-7/12",
      "11/12": "basis-11/12",
    };

    const flexClasses = {
      none: "flex-none",
      auto: "flex-auto",
      initial: "flex-initial",
      "1": "flex-1",
    };

    const alignSelfClasses = {
      auto: "self-auto",
      start: "self-start",
      end: "self-end",
      center: "self-center",
      baseline: "self-baseline",
      stretch: "self-stretch",
    };

    const orderClasses = {
      none: "",
      first: "order-first",
      last: "order-last",
      1: "order-1",
      2: "order-2",
      3: "order-3",
      4: "order-4",
      5: "order-5",
      6: "order-6",
      7: "order-7",
      8: "order-8",
      9: "order-9",
      10: "order-10",
      11: "order-11",
      12: "order-12",
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
          flex
            ? flexClasses[flex]
            : [
                growClasses[grow as keyof typeof growClasses],
                shrinkClasses[shrink as keyof typeof shrinkClasses],
                basisClasses[basis],
              ],
          alignSelfClasses[alignSelf],
          orderClasses[order],
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

GlassFlexItem.displayName = "GlassFlexItem";
