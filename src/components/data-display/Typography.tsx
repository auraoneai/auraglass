"use client";
import React from "react";
import { cn } from "../../lib/utilsComprehensive";
import {
  ContrastGuard,
  TextWithContrast,
} from "@/components/accessibility/ContrastGuard";
import { ANIMATION } from "../../tokens/designConstants";
import { useReducedMotion } from "../../hooks/useReducedMotion";

export interface TypographyProps extends React.HTMLAttributes<HTMLElement> {
  variant?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span" | "div";
  children?: React.ReactNode;
}

const variantMap = {
  h1: "h1",
  h2: "h2",
  h3: "h3",
  h4: "h4",
  h5: "h5",
  h6: "h6",
  p: "p",
  span: "span",
  div: "div",
} as const;

export const Typography = React.forwardRef<HTMLElement, TypographyProps>(
  ({ variant = "p", className, children, ...props }, ref) => {
    // TODO: Integrate ContrastGuard for table cells, list items, badges, card titles, and other text content for WCAG AA compliance

    const Component = variantMap[variant];
    const sizeClass: Record<keyof typeof variantMap, string> = {
      h1: "glass-text-5xl",
      h2: "glass-text-4xl",
      h3: "glass-text-3xl",
      h4: "glass-text-xl",
      h5: "glass-text-lg",
      h6: "glass-text-base",
      p: "glass-text-base",
      span: "glass-text-base",
      div: "glass-text-base",
    };
    return React.createElement(
      Component,
      {
        className: cn("glass-text-primary", sizeClass[variant], className),
        ref,
        ...props,
      },
      children
    );
  }
);

Typography.displayName = "Typography";
