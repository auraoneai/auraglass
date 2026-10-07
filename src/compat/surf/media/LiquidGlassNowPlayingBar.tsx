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

export function LiquidGlassNowPlayingBar(props: LiquidGlassNowPlayingBarProps) {
  warnDeprecated('LiquidGlassNowPlayingBar');
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
