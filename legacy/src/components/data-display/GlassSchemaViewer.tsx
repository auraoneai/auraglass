"use client";
import React from "react";
import { cn } from "@/lib/utils";
import { GlassJSONViewer } from "./GlassJSONViewer";

export interface GlassSchemaViewerProps {
  schema: unknown;
  className?: string;
  compact?: boolean;
  contained?: boolean;
  maxHeight?: number | string;
}

export function GlassSchemaViewer({
  schema,
  className,
  compact,
  contained,
  maxHeight,
}: GlassSchemaViewerProps) {
  return (
    <GlassJSONViewer
      value={schema}
      className={cn("glass-schema-viewer", className)}
      compact={compact}
      contained={contained}
      maxHeight={maxHeight}
    />
  );
}

export default GlassSchemaViewer;
