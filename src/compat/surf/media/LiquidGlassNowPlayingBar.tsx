'use client';
import { warnDeprecated } from '../../../internal';
import { NowPlayingBar } from '../../../media/NowPlayingBar/NowPlayingBar';

export interface LiquidGlassNowPlayingBarProps {
  playing?: boolean;
  title?: string;
  subtitle?: string;
  artwork?: string;
  onPlayPause?: ((playing: boolean) => void) | undefined;
  onPrevious?: (() => void) | undefined;
  onNext?: (() => void) | undefined;
  className?: string;
}

/** @deprecated LiquidGlassNowPlayingBar DEP-S0602 since 4.2.0, removed in 6.0.0. {@link NowPlayingBar from aura-glass/media} */
export function LiquidGlassNowPlayingBar(props: LiquidGlassNowPlayingBarProps) {
  warnDeprecated('DEP-S0602';
  const { title, subtitle, artwork, onPlayPause, onPrevious, onNext } = props;
  return (
    <NowPlayingBar.Root playing={props.playing} onPlayingChange={onPlayPause}
      onPrevious={onPrevious} onNext={onNext} artwork={artwork}>
      <NowPlayingBar.Artwork src={artwork} />
      <NowPlayingBar.Title>{title}</NowPlayingBar.Title>
      <NowPlayingBar.Subtitle>{subtitle}</NowPlayingBar.Subtitle>
      <NowPlayingBar.Actions onPrevious={onPrevious} onNext={onNext} />
      <NowPlayingBar.Progress />
    </NowPlayingBar.Root>
  );
}
