import { MediaScrubber } from 'aura-glass/media';

export default function MediaScrubberMinimal() {
  return <MediaScrubber value={80} max={300} buffered={[[0, 140]]} />;
}
