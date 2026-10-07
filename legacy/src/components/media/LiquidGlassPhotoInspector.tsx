"use client";

import React, { forwardRef } from "react";
import { LiquidGlassInspectorPanel, type LiquidGlassInspectorPanelProps } from "../navigation/LiquidGlassInspectorPanel";

export interface LiquidGlassPhotoInspectorProps extends Omit<LiquidGlassInspectorPanelProps, "sections"> {
  metadata?: Record<string, React.ReactNode>;
  tags?: string[];
  rating?: React.ReactNode;
}

export const LiquidGlassPhotoInspector = forwardRef<HTMLElement, LiquidGlassPhotoInspectorProps>(
  ({ metadata = {}, tags = [], rating, ...props }, ref) => (
    <LiquidGlassInspectorPanel
      ref={ref}
      title={props.title ?? "Photo Inspector"}
      sections={[
        {
          id: "metadata",
          title: "Metadata",
          content: (
            <dl className="glass-grid glass-grid-cols-2 glass-gap-2">
              {Object.entries(metadata).map(([key, value]) => (
                <React.Fragment key={key}>
                  <dt className="glass-text-xs glass-text-secondary">{key}</dt>
                  <dd className="glass-text-sm">{value}</dd>
                </React.Fragment>
              ))}
            </dl>
          ),
        },
        {
          id: "tags",
          title: "Tags",
          content: <div className="glass-flex glass-flex-wrap glass-gap-1">{tags.map((tag) => <span key={tag} className="glass-radius-full glass-surface-subtle glass-px-2 glass-py-1 glass-text-xs">{tag}</span>)}</div>,
        },
        {
          id: "rating",
          title: "Rating",
          content: rating,
        },
      ]}
      {...props}
    />
  )
);

LiquidGlassPhotoInspector.displayName = "LiquidGlassPhotoInspector";
