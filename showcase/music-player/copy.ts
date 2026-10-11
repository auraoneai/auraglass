/* music-player copy and deterministic data (REQ-QUAL-58 / REQ-QUAL-59). */
import tidal from './assets/cover-tidal.avif';
import ember from './assets/cover-ember.avif';
import meadow from './assets/cover-meadow.avif';
import dusk from './assets/cover-dusk.avif';
import salt from './assets/cover-salt.avif';

/** Fixed showcase epoch: 2026-03-02T09:30:00Z. */
export const SHOWCASE_EPOCH = Date.UTC(2026, 2, 2, 9, 30, 0);

/** The certification video scene, served by Storybook staticDirs at /scenes (contract S-42). */
export const SESSION_VIDEO = '/scenes/video-frame.webm';

export const COPY = {
  product: 'Tideline',
  skip: 'Skip to player',
  sessionTitle: 'Live from Studio 4 — The Salt Flats',
  queueHeading: 'Up next',
  albumsHeading: 'Recently played',
  viewLabel: 'Library view',
  eqLabel: 'Bass boost',
  crossfadeLabel: 'Crossfade (seconds)',
  shuffle: 'Shuffle',
  repeat: 'Repeat',
  like: 'Save to library',
  queue: 'Open queue',
} as const;

export const NOW_PLAYING = { title: 'Low Tide Signals', artist: 'The Salt Flats', album: 'Coastal Static', duration: 254, position: 97 };

export const QUEUE = [
  { id: 'q1', title: 'Harbour Lights', artist: 'The Salt Flats', length: '3:48' },
  { id: 'q2', title: 'Undertow', artist: 'Mara Vell', length: '4:12' },
  { id: 'q3', title: 'Paper Boats', artist: 'Juniper Lane', length: '2:57' },
  { id: 'q4', title: 'Northern Drift', artist: 'Ostra', length: '5:03' },
  { id: 'q5', title: 'Wingspan', artist: 'Mara Vell', length: '3:31' },
  { id: 'q6', title: 'Last Ferry Home', artist: 'The Salt Flats', length: '4:26' },
] as const;

export const ALBUMS = [
  { id: 'a1', title: 'Coastal Static', artist: 'The Salt Flats', cover: tidal },
  { id: 'a2', title: 'Ember Season', artist: 'Ostra', cover: ember },
  { id: 'a3', title: 'Field Recordings', artist: 'Juniper Lane', cover: meadow },
  { id: 'a4', title: 'Afterglow', artist: 'Mara Vell', cover: dusk },
  { id: 'a5', title: 'White Noise Atlas', artist: 'Ostra', cover: salt },
] as const;
