import { MediaControls } from 'aura-glass/media';

export function Player() {
  return (
    <MediaControls.Root playing={false} onPlayingChange={(p: boolean) => console.log(p)}>
      <MediaControls.PlayButton />
      <MediaControls.Scrubber />
    </MediaControls.Root>
  );
}
