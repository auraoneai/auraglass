"use client";
import React from "react";
import { cn } from "@/lib/utils";
import { GlassJSONViewer } from "./GlassJSONViewer";

export interface GlassSchemaViewerProps {
  schema: unknown;
  className?: string;
}

export function GlassSchemaViewer({
  schema,
  className,
}: GlassSchemaViewerProps) {
  return (
    <GlassJSONViewer
      value={schema}
      className={cn("glass-schema-viewer", className)}
    />
  );
}

export default GlassSchemaViewer;
