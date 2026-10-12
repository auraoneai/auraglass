import { MediaControls } from 'aura-glass/media';

export default function MediaControlsMinimal() {
  return <MediaControls.Root playing={false} duration={125} currentTime={12} />;
}
