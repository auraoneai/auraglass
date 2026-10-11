// fixtures.ts — deterministic sample data for media-video-player (no clocks, no randomness,
// no network — contract §3.3 file contract). Stories and showcases import it.
import type { MediaVideoPlayerProps } from './index';

export const VIDEO_PLAYER_PROPS: MediaVideoPlayerProps = {
  src: '/media/film.mp4',
  poster: '/media/film.jpg',
  captions: [{ src: '/media/film.vtt', srclang: 'en', label: 'English' }],
};

export const VIDEO_PLAYER_EMPTY_PROPS: MediaVideoPlayerProps = { src: '' };
