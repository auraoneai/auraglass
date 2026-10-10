// fixtures.ts — deterministic sample data for media-now-playing (no clocks, no randomness,
// no network — contract §3.3 file contract). Stories and showcases import it.
import type { MediaNowPlayingProps } from './index';

export const NOW_PLAYING_PROPS: MediaNowPlayingProps = {
  src: '/media/track.mp3',
  title: 'Refraction',
  subtitle: 'AuraOne Sounds',
  artworkSrc: '/media/art.jpg',
};

export const NOW_PLAYING_EMPTY_PROPS: MediaNowPlayingProps = { src: '', title: '' };
