"use client";
import React from "react";
import { cn } from "../../lib/utilsComprehensive";
import { useA11yId } from "@/utils/a11y";
import {
  ContrastGuard,
  TextWithContrast,
} from "@/components/accessibility/ContrastGuard";

export interface BoxProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The HTML element or React component to render as
   */
  as?: keyof JSX.IntrinsicElements;
  /**
   * The content to render inside the box
   */
  children?: React.ReactNode;
  /**
   * Accessibility label for screen readers
   */
  "aria-label"?: string;
  /**
   * Accessibility role for semantic meaning
   */
  role?: string;
  /**
   * Whether to respect user's motion preferences
   */
  respectMotionPreference?: boolean;
}

export const Box = React.forwardRef<HTMLDivElement, BoxProps>(
  (
    {
      // ContrastGuard layout text coverage is tracked in the manual accessibility QA report.

      as: Component = "div",
      className,
      children,
      "aria-label": ariaLabel,
      role,
      respectMotionPreference = true,
      ...props
    },
    ref
  ) => {
    const elementId = useA11yId();

    const a11yProps = {
      ...(ariaLabel && { "aria-label": ariaLabel }),
      ...(role && { role }),
      ...(ariaLabel && !props.id && { id: elementId }),
    };

    return React.createElement(
      Component,
      {
        className: cn(
          // Motion preferences
          respectMotionPreference &&
            "motion-safe:transition-all motion-reduce:transition-none",
          className
        ),
        ref,
        ...a11yProps,
        ...props,
      },
      children
    );
  }
);

Box.displayName = "Box";
