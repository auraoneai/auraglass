'use client';
import { warnDeprecated } from '../../../internal';
import { MediaControls } from '../../../media/MediaControls/MediaControls';

/* REQ-SURF-13 — 4.x LiquidGlassMediaControls → MediaControls.
 * onPlayPause → onPlayingChange; compact → compact default layout handled by
 * the container rows (consumer composes parts). */
export interface LiquidGlassMediaControlsProps {
  playing?: boolean;
  onPlayPause?: ((playing: boolean) => void) | undefined;
  currentTime?: number;
  duration?: number;
  volume?: number;
  muted?: boolean;
  onVolumeChange?: ((v: number) => void) | undefined;
  onMutedChange?: ((m: boolean) => void) | undefined;
  onSeek?: ((s: number) => void) | undefined;
  compact?: boolean;
  className?: string;
}

export function LiquidGlassMediaControls(props: LiquidGlassMediaControlsProps) {
  warnDeprecated('LiquidGlassMediaControls');
  const { onPlayPause, compact, ...rest } = props;
  void compact;
  return (
    <MediaControls.Root {...rest} onPlayingChange={onPlayPause} />
  );
}
