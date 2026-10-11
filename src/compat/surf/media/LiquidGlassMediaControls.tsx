/* LiquidGlassMediaControls — 4.x compat adapter (REQ-SURF-13, DEP-S0600) →
   MediaControls.Root. playing/currentTime/duration/volume/onSeek/
   onVolumeChange/variant map 1:1; onPlayPause() fires on play/pause (the
   next playing state is passed as an extra argument). compact and
   localDimming are layout/material concerns of the 5.0 parts and are
   dropped. Shared with GlassMediaControls (DEP-S0601). */
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { MediaControls } from '../../../media/MediaControls/MediaControls';

export interface LiquidGlassMediaControlsProps {
  playing?: boolean;
  onPlayPause?: (playing: boolean) => void;
  currentTime?: number;
  duration?: number;
  volume?: number;
  muted?: boolean;
  onSeek?: (seconds: number) => void;
  onVolumeChange?: (volume: number) => void;
  onMutedChange?: (muted: boolean) => void;
  variant?: 'regular' | 'clear';
  className?: string;
  [legacy: string]: unknown;
}

export function LegacyMediaControls(props: LiquidGlassMediaControlsProps) {
  const { playing = false, onPlayPause, currentTime, duration, volume, muted, onSeek, onVolumeChange, onMutedChange, variant, className } = props;
  return (
    <MediaControls.Root
      playing={playing}
      {...(currentTime !== undefined ? { currentTime } : {})}
      {...(duration !== undefined ? { duration } : {})}
      {...(volume !== undefined ? { volume } : {})}
      {...(muted !== undefined ? { muted } : {})}
      {...(onPlayPause ? { onPlayingChange: onPlayPause } : {})}
      {...(onSeek ? { onSeek } : {})}
      {...(onVolumeChange ? { onVolumeChange } : {})}
      {...(onMutedChange ? { onMutedChange } : {})}
      {...(variant ? { variant } : {})}
      {...(className ? { className } : {})}
    />
  );
}

/**
 * 4.x `LiquidGlassMediaControls` compat adapter (DEP-S0600).
 * @deprecated since 4.2.0, removed in 5.0.0. Use {@link MediaControls.Root from aura-glass/media}.
 */
export function LiquidGlassMediaControls(props: LiquidGlassMediaControlsProps) {
  warnDeprecated('DEP-S0600');
  return <LegacyMediaControls {...props} />;
}
