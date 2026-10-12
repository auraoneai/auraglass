import { NowPlayingBar } from 'aura-glass/media';

export default function NowPlayingBarMinimal() {
  return (
    <NowPlayingBar.Root playing={false} artwork="https://picsum.photos/seed/np/96/96" onPrevious={() => {}} onNext={() => {}}>
      <NowPlayingBar.Artwork />
      <NowPlayingBar.Title>Optics</NowPlayingBar.Title>
      <NowPlayingBar.Subtitle>The Refractions</NowPlayingBar.Subtitle>
      <NowPlayingBar.Progress />
    </NowPlayingBar.Root>
  );
}
