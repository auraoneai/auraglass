"use client";

import React, { forwardRef } from "react";
import { cn } from "../../lib/utilsComprehensive";
import { LiquidGlassMaterial } from "../../primitives/LiquidGlassMaterial";

export interface LiquidGlassMediaControlsProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onVolumeChange"> {
  playing: boolean;
  onPlayPause?: () => void;
  currentTime?: number;
  duration?: number;
  volume?: number;
  onSeek?: (value: number) => void;
  onVolumeChange?: (value: number) => void;
  variant?: "regular" | "clear";
  localDimming?: boolean;
  compact?: boolean;
}

export const LiquidGlassMediaControls = forwardRef<HTMLDivElement, LiquidGlassMediaControlsProps>(
  (
    {
      playing,
      onPlayPause,
      currentTime = 0,
      duration = 0,
      volume = 1,
      onSeek,
      onVolumeChange,
      variant = "clear",
      localDimming = true,
      compact = false,
      className,
      ...props
    },
    ref
  ) => (
    <LiquidGlassMaterial
      ref={ref}
      material="liquid"
      variant={variant}
      radius="full"
      className={cn("liquid-glass-media-controls", className)}
      data-local-dimming={localDimming ? "true" : "false"}
      {...props}
    >
      <div className={cn("glass-flex glass-items-center glass-gap-3 glass-px-3 glass-py-2", compact && "glass-gap-2")}>
        <button type="button" aria-label={playing ? "Pause" : "Play"} onClick={onPlayPause}>
          {playing ? "Pause" : "Play"}
        </button>
        <input
          type="range"
          min={0}
          max={duration || 1}
          value={currentTime}
          aria-label="Seek"
          onChange={(event) => onSeek?.(Number(event.target.value))}
        />
        {!compact && (
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={volume}
            aria-label="Volume"
            onChange={(event) => onVolumeChange?.(Number(event.target.value))}
          />
        )}
      </div>
    </LiquidGlassMaterial>
  )
);

LiquidGlassMediaControls.displayName = "LiquidGlassMediaControls";
