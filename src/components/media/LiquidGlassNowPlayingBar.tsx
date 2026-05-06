"use client";

import React, { forwardRef } from "react";
import { cn } from "../../lib/utilsComprehensive";
import { LiquidGlassBottomAccessory } from "../navigation/LiquidGlassBottomAccessory";

export interface LiquidGlassNowPlayingBarProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  subtitle?: string;
  artwork?: React.ReactNode;
  playing?: boolean;
  progress?: number;
  onPlayPause?: () => void;
  onExpand?: () => void;
}

export const LiquidGlassNowPlayingBar = forwardRef<HTMLDivElement, LiquidGlassNowPlayingBarProps>(
  ({ title, subtitle, artwork, playing = false, progress = 0, onPlayPause, onExpand, className, ...props }, ref) => (
    <LiquidGlassBottomAccessory ref={ref} className={cn("liquid-glass-now-playing-bar", className)} {...props}>
      <button type="button" className="glass-flex glass-min-w-0 glass-flex-1 glass-items-center glass-gap-3 glass-text-left" onClick={onExpand}>
        {artwork && <span className="glass-size-10 glass-overflow-hidden glass-radius-lg">{artwork}</span>}
        <span className="glass-min-w-0 glass-flex-1">
          <span className="glass-block glass-truncate glass-font-medium">{title}</span>
          {subtitle && <span className="glass-block glass-truncate glass-text-xs glass-text-secondary">{subtitle}</span>}
          <span className="glass-mt-1 glass-block glass-h-1 glass-radius-full glass-surface-subtle">
            <span className="glass-block glass-h-full glass-radius-full glass-surface-primary" style={{ width: `${Math.max(0, Math.min(1, progress)) * 100}%` }} />
          </span>
        </span>
      </button>
      <button type="button" onClick={onPlayPause} aria-label={playing ? "Pause" : "Play"}>
        {playing ? "Pause" : "Play"}
      </button>
    </LiquidGlassBottomAccessory>
  )
);

LiquidGlassNowPlayingBar.displayName = "LiquidGlassNowPlayingBar";
