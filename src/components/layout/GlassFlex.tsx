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

export interface GlassFlexItemProps extends React.HTMLAttributes<HTMLDivElement> {
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
      style,
      ...props
    },
    ref
  ) => {
    const directionValues = {
      row: "row",
      "row-reverse": "row-reverse",
      col: "column",
      "col-reverse": "column-reverse",
    } as const;

    const wrapValues = {
      nowrap: "nowrap",
      wrap: "wrap",
      "wrap-reverse": "wrap-reverse",
    } as const;

    const justifyValues = {
      start: "flex-start",
      end: "flex-end",
      center: "center",
      between: "space-between",
      around: "space-around",
      evenly: "space-evenly",
    } as const;

    const alignValues = {
      start: "flex-start",
      end: "flex-end",
      center: "center",
      baseline: "baseline",
      stretch: "stretch",
    } as const;

    const alignContentValues = {
      start: "flex-start",
      end: "flex-end",
      center: "center",
      between: "space-between",
      around: "space-around",
      evenly: "space-evenly",
      stretch: "stretch",
    } as const;

    const gapValues = {
      none: "0",
      xs: "var(--glass-space-1, 0.25rem)",
      sm: "var(--glass-space-2, 0.5rem)",
      md: "var(--glass-space-4, 1rem)",
      lg: "var(--glass-space-6, 1.5rem)",
      xl: "var(--glass-space-8, 2rem)",
      "2xl": "var(--glass-space-12, 3rem)",
    } as const;

    const directionClasses = {
      row: "glass-flex-row",
      "row-reverse": "glass-flex-row-reverse",
      col: "glass-flex-col",
      "col-reverse": "glass-flex-col-reverse",
    };

    const wrapClasses = {
      nowrap: "glass-flex-nowrap",
      wrap: "glass-flex-wrap",
      "wrap-reverse": "glass-flex-wrap-reverse",
    };

    const justifyClasses = {
      start: "glass-justify-start",
      end: "glass-justify-end",
      center: "glass-justify-center",
      between: "glass-justify-between",
      around: "glass-justify-around",
      evenly: "glass-justify-evenly",
    };

    const alignClasses = {
      start: "glass-items-start",
      end: "glass-items-end",
      center: "glass-items-center",
      baseline: "glass-items-baseline",
      stretch: "glass-items-stretch",
    };

    const alignContentClasses = {
      start: "glass-content-start",
      end: "glass-content-end",
      center: "glass-content-center",
      between: "glass-content-between",
      around: "glass-content-around",
      evenly: "glass-content-evenly",
      stretch: "glass-content-stretch",
    };

    const gapClasses = {
      none: "glass-gap-0",
      xs: "glass-gap-1",
      sm: "glass-gap-2",
      md: "glass-gap-4",
      lg: "glass-gap-6",
      xl: "glass-gap-8",
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

    const flexStyle: React.CSSProperties = {
      display: "flex",
      flexDirection: directionValues[direction],
      flexWrap: wrapValues[wrap],
      justifyContent: justifyValues[justify],
      alignItems: alignValues[align],
      alignContent: alignContentValues[alignContent],
      ...(gapX
        ? { columnGap: gapValues[gapX] }
        : gapY
          ? {}
          : { gap: gapValues[gap] }),
      ...(gapY ? { rowGap: gapValues[gapY] } : {}),
      ...(fullWidth ? { width: "100%" } : {}),
      ...(fullHeight ? { height: "100%" } : {}),
      minWidth: 0,
      ...style,
    };

    return (
      <div
        ref={ref}
        className={cn(
          "glass-flex glass-min-w-0",
          directionClasses[direction],
          wrapClasses[wrap],
          justifyClasses[justify],
          alignClasses[align],
          alignContentClasses[alignContent],
          gapX ? gapXClasses[gapX] : gapY ? gapYClasses[gapY] : gapClasses[gap],
          gapX && gapY && [gapXClasses[gapX], gapYClasses[gapY]],
          fullWidth && "glass-w-full",
          fullHeight && "glass-h-full",
          // Motion preferences
          shouldRespectMotion &&
            "motion-safe:transition-all motion-reduce:transition-none",
          ...responsiveClasses,
          className
        )}
        style={flexStyle}
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
      style,
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

    const basisValues = {
      auto: "auto",
      full: "100%",
      "1/2": "50%",
      "1/3": "33.333333%",
      "2/3": "66.666667%",
      "1/4": "25%",
      "3/4": "75%",
      "1/5": "20%",
      "2/5": "40%",
      "3/5": "60%",
      "4/5": "80%",
      "1/6": "16.666667%",
      "5/6": "83.333333%",
      "1/12": "8.333333%",
      "5/12": "41.666667%",
      "7/12": "58.333333%",
      "11/12": "91.666667%",
    } as const;

    const alignSelfValues = {
      auto: "auto",
      start: "flex-start",
      end: "flex-end",
      center: "center",
      baseline: "baseline",
      stretch: "stretch",
    } as const;

    const flexValues = {
      none: "none",
      auto: "1 1 auto",
      initial: "0 1 auto",
      "1": "1 1 0%",
    } as const;

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
        style={{
          ...(flex
            ? { flex: flexValues[flex] }
            : {
                flexGrow: grow ? 1 : 0,
                flexShrink: shrink ? 1 : 0,
                flexBasis: basisValues[basis],
              }),
          alignSelf: alignSelfValues[alignSelf],
          minWidth: 0,
          ...style,
        }}
        {...a11yProps}
        {...props}
      />
    );
  }
);

GlassFlexItem.displayName = "GlassFlexItem";
