"use client";

import React, { forwardRef, type CSSProperties } from "react";
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

const mediaButtonStyle: CSSProperties = {
  border: 0,
  borderRadius: 999,
  background:
    '/* Use createGlassStyle({ intent: "neutral", elevation: "level3" }) */',
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

const rangeStyle: CSSProperties = {
  accentColor: "#2563eb",
  flex: "1 1 180px",
  minWidth: 120,
  maxWidth: 260,
};

const timeStyle: CSSProperties = {
  color: "#f8fafc",
  fontVariantNumeric: "tabular-nums",
  fontSize: 13,
  lineHeight: 1,
  minWidth: 78,
  textAlign: "center",
  textShadow: "0 1px 8px rgba(2, 6, 23, 0.36)",
};

const formatMediaTime = (seconds: number): string => {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${minutes}:${secs.toString().padStart(2, "0")}`;
};

export const LiquidGlassMediaControls = forwardRef<
  HTMLDivElement,
  LiquidGlassMediaControlsProps
>(
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
      <div
        className={cn(
          "glass-flex glass-items-center glass-gap-3 glass-px-3 glass-py-2",
          compact && "glass-gap-2"
        )}
        style={{ flexWrap: "wrap", minWidth: 0 }}
      >
        <button
          type="button"
          aria-label={playing ? "Pause" : "Play"}
          style={mediaButtonStyle}
          onClick={onPlayPause}
        >
          {playing ? "Pause" : "Play"}
        </button>
        <input
          className="liquid-glass-range"
          data-glass-component="range"
          type="range"
          min={0}
          max={duration || 1}
          value={currentTime}
          aria-label="Seek"
          style={rangeStyle}
          onChange={(event) => onSeek?.(Number(event.target.value))}
        />
        {!compact && (
          <span style={timeStyle}>
            {formatMediaTime(currentTime)} / {formatMediaTime(duration)}
          </span>
        )}
        {!compact && (
          <input
            className="liquid-glass-range"
            data-glass-component="range"
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={volume}
            aria-label="Volume"
            style={rangeStyle}
            onChange={(event) => onVolumeChange?.(Number(event.target.value))}
          />
        )}
      </div>
    </LiquidGlassMaterial>
  )
);

LiquidGlassMediaControls.displayName = "LiquidGlassMediaControls";
