"use client";

import React, { forwardRef } from "react";
import { cn } from "../../lib/utils";
import { ShowcaseCard, type ShowcaseCardProps } from "./ShowcaseCard";
import "./marketing.css";

export interface FeatureTileProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  index?: string | number;
  title: React.ReactNode;
  description?: React.ReactNode;
  visual?: React.ReactNode;
  size?: "sm" | "md" | "lg";
  tone?: "neutral" | "aurora" | "success" | "info" | "warning";
}

const toneGlow: Record<
  NonNullable<FeatureTileProps["tone"]>,
  ShowcaseCardProps["glow"]
> = {
  neutral: "subtle",
  aurora: "aurora",
  success: "subtle",
  info: "subtle",
  warning: "subtle",
};

export const FeatureTile = forwardRef<HTMLDivElement, FeatureTileProps>(
  (
    {
      index,
      title,
      description,
      visual,
      size = "md",
      tone = "neutral",
      className,
      children,
      ...props
    },
    ref
  ) => (
    <ShowcaseCard
      ref={ref}
      data-size={size}
      data-tone={tone}
      glow={toneGlow[tone]}
      padding={size === "sm" ? "sm" : size === "lg" ? "lg" : "md"}
      className={cn("ag-feature-tile", className)}
      {...props}
    >
      <div className="ag-feature-tile__header">
        {index !== undefined && (
          <span className="ag-feature-tile__index">{index}</span>
        )}
        <h3 className="ag-feature-tile__title">{title}</h3>
      </div>
      {description && (
        <p className="ag-feature-tile__description">{description}</p>
      )}
      {visual && <div className="ag-feature-tile__visual">{visual}</div>}
      {children}
    </ShowcaseCard>
  )
);

FeatureTile.displayName = "FeatureTile";
