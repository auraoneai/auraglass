"use client";

import React, { forwardRef, type CSSProperties } from "react";
import { cn } from "../../lib/utilsComprehensive";
import { LiquidGlassBottomAccessory } from "../navigation/LiquidGlassBottomAccessory";

export interface LiquidGlassNowPlayingBarProps
  extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  subtitle?: string;
  artwork?: React.ReactNode;
  playing?: boolean;
  progress?: number;
  onPlayPause?: () => void;
  onExpand?: () => void;
}

const nowPlayingMainButtonStyle: CSSProperties = {
  border: 0,
  background: "transparent",
  color: "inherit",
  cursor: "pointer",
  font: "inherit",
  minWidth: 0,
};

const nowPlayingActionButtonStyle: CSSProperties = {
  border: 0,
  borderRadius: 999,
  background:
    '/* Use createGlassStyle({ intent: "primary", elevation: "level2" }) */',
  color: "#0f172a",
  cursor: "pointer",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  font: "inherit",
  fontWeight: 700,
  minWidth: 44,
  height: 44,
  padding: "0 14px",
};

export const LiquidGlassNowPlayingBar = forwardRef<
  HTMLDivElement,
  LiquidGlassNowPlayingBarProps
>(
  (
    {
      title,
      subtitle,
      artwork,
      playing = false,
      progress = 0,
      onPlayPause,
      onExpand,
      className,
      ...props
    },
    ref
  ) => (
    <LiquidGlassBottomAccessory
      ref={ref}
      className={cn("liquid-glass-now-playing-bar", className)}
      {...props}
    >
      <button
        type="button"
        className="glass-flex glass-min-w-0 glass-flex-1 glass-items-center glass-gap-3 glass-text-left"
        style={nowPlayingMainButtonStyle}
        onClick={onExpand}
      >
        {artwork && (
          <span
            className="glass-size-10 glass-overflow-hidden glass-radius-lg"
            style={{ flex: "0 0 2.5rem" }}
          >
            {artwork}
          </span>
        )}
        <span className="glass-min-w-0 glass-flex-1">
          <span className="glass-block glass-truncate glass-font-medium">
            {title}
          </span>
          {subtitle && (
            <span className="glass-block glass-truncate glass-text-xs glass-text-secondary">
              {subtitle}
            </span>
          )}
          <span className="glass-mt-1 glass-block glass-h-1 glass-radius-full glass-surface-subtle">
            <span
              className="glass-block glass-h-full glass-radius-full glass-surface-primary"
              style={{ width: `${Math.max(0, Math.min(1, progress)) * 100}%` }}
            />
          </span>
        </span>
      </button>
      <button
        type="button"
        style={nowPlayingActionButtonStyle}
        onClick={onPlayPause}
        aria-label={playing ? "Pause" : "Play"}
      >
        {playing ? "Pause" : "Play"}
      </button>
    </LiquidGlassBottomAccessory>
  )
);

LiquidGlassNowPlayingBar.displayName = "LiquidGlassNowPlayingBar";
