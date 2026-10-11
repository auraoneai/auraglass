// fixtures.ts — deterministic sample data for media-transcript (no clocks, no randomness,
// no network — contract §3.3 file contract). Stories and showcases import it.
import type { TranscriptCue } from './index';

export const TRANSCRIPT_CUES: TranscriptCue[] = [
  { start: 0, end: 2, speaker: 'Host', text: 'Welcome back to the show.' },
  { start: 2, end: 5, speaker: 'Guest', text: 'Great to be here.' },
  { start: 5, end: 9, speaker: 'Host', text: 'Today: glass.' },
];
