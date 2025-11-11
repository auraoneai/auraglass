"use client";
import { cn } from "../../lib/utilsComprehensive";

import React from "react";
import { GlassDataTable } from "./GlassDataTable";
import {
  ContrastGuard,
  TextWithContrast,
} from "@/components/accessibility/ContrastGuard";

export interface GlassDataGridProProps<T = any>
  extends React.HTMLAttributes<HTMLDivElement> {
  columns?: any[];
  rows?: T[];
  grouping?: string[];
  density?: "compact" | "normal" | "spacious";
}

// Lightweight wrapper around GlassDataTable; placeholder for advanced features
export const GlassDataGridPro = React.forwardRef<
  HTMLDivElement,
  GlassDataGridProProps
>(
  (
    {
      columns = [],
      rows = [],
      className,
      "aria-label": ariaLabel,
      "data-testid": dataTestId,
      ...props
    },
    ref
  ) => {
    // TODO: Integrate ContrastGuard for table cells, list items, badges, card titles, and other text content for WCAG AA compliance

    return (
      <div
        ref={ref}
        className={cn(className)}
        role="region"
        aria-label={ariaLabel || "Data Grid Pro"}
        data-testid={dataTestId}
        {...props}
      >
        <GlassDataTable columns={columns as any} data={rows as any} />
      </div>
    );
  }
);

GlassDataGridPro.displayName = "GlassDataGridPro";

export default GlassDataGridPro;
