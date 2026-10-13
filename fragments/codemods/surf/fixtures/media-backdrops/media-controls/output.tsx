// @ts-nocheck
import { MediaControls } from 'aura-glass/media';

export function Player() {
  return (
    <MediaControls.Root playing={false} onPlayingChange={() => console.log('toggle')}>
      <MediaControls.PlayButton />
      <MediaControls.Scrubber />
    </MediaControls.Root>
  );
}
