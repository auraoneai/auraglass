"use client";

import React, { forwardRef } from "react";
import { cn } from "../../lib/utils";
import "./marketing.css";

export interface DisplayTextProps extends React.HTMLAttributes<HTMLElement> {
  as?: "h1" | "h2" | "h3" | "p" | "span";
  size?: "hero" | "section" | "title" | "label";
  gradient?: boolean | "aurora" | "prism" | "ocean" | "ember";
  italic?: boolean;
  balance?: boolean;
}

export const DisplayText = forwardRef<HTMLElement, DisplayTextProps>(
  (
    {
      as: Component = "h2",
      size = "section",
      gradient = false,
      italic = false,
      balance = false,
      className,
      ...props
    },
    ref
  ) =>
    React.createElement(Component, {
      ref,
      "data-ag-palette": typeof gradient === "string" ? gradient : undefined,
      "data-balance": balance || undefined,
      "data-gradient": Boolean(gradient) || undefined,
      "data-italic": italic || undefined,
      "data-size": size,
      className: cn("ag-marketing-scope ag-display-text", className),
      ...props,
    })
);

DisplayText.displayName = "DisplayText";
