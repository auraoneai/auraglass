// fixtures.ts — deterministic sample data for media-audio-player (no clocks, no randomness,
// no network — contract §3.3 file contract). Stories and showcases import it.
import type { MediaAudioPlayerProps } from './index';

export const AUDIO_PLAYER_PROPS: MediaAudioPlayerProps = {
  src: '/media/podcast.mp3',
  captions: [{ src: '/media/podcast.vtt', srclang: 'en', label: 'English' }],
  'aria-label': 'Episode 12',
};

export const AUDIO_PLAYER_EMPTY_PROPS: MediaAudioPlayerProps = { src: '', 'aria-label': 'Nothing loaded' };
