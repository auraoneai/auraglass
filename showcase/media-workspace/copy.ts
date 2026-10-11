/* media-workspace copy and deterministic data (REQ-QUAL-58 / REQ-QUAL-59). */
import harbor from './assets/still-harbor.avif';
import ridge from './assets/still-ridge.avif';
import dunes from './assets/still-dunes.avif';
import night from './assets/still-night.avif';

/** Fixed showcase epoch: 2026-03-02T09:30:00Z. */
export const SHOWCASE_EPOCH = Date.UTC(2026, 2, 2, 9, 30, 0);

/** The certification video scene, served by Storybook staticDirs at /scenes (contract S-42). */
export const VIDEO_SRC = '/scenes/video-frame.webm';

export const COPY = {
  skip: 'Skip to the review',
  title: 'Coastline — reel 3, take 12',
  subtitle: 'Colour review · 00:41:12 runtime · due Friday',
  toolbarLabel: 'Review tools',
  stillsLabel: 'Approved stills',
  carouselLabel: 'Scene selects',
  carouselRailLabel: 'Scene select frames',
  inspectorTitle: 'Shot details',
  gradeLabel: 'Exposure offset',
  saturationLabel: 'Saturation',
  notesTitle: 'Reviewer note',
  notesBody: 'Lift the shadows in the harbour wide by a third of a stop; keep the sunset highlights under 95 IRE.',
  nowPlayingTitle: 'Coastline — reel 3',
  nowPlayingSubtitle: 'Take 12 · Rec. 709 proxy',
  shotLogHeading: 'Shot log',
  shotLogCaption: 'Reel 3 shots with source timecode, take and review status',
} as const;

export const STILLS = [
  { id: 'harbor', src: harbor, alt: 'Harbour at dusk under an amber sky', caption: 'Shot 3A — harbour wide', width: 1280, height: 720 },
  { id: 'ridge', src: ridge, alt: 'Green ridgeline under a pale morning sky', caption: 'Shot 3B — ridge establishing', width: 1280, height: 720 },
  { id: 'dunes', src: dunes, alt: 'Sand dunes in warm afternoon light', caption: 'Shot 3C — dunes tracking', width: 1280, height: 720 },
  { id: 'night', src: night, alt: 'Hills under a deep blue night sky', caption: 'Shot 3D — night exterior', width: 1280, height: 720 },
];

export const SHOT_LOG_COLUMNS = ['Shot', 'Timecode in', 'Take', 'Status'] as const;

export const SHOT_LOG = [
  ['3A harbour wide', '01:03:12:04', '12', 'Changes requested'],
  ['3B ridge establishing', '01:03:19:23', '4', 'Approved'],
  ['3C dunes tracking', '01:03:27:10', '7', 'Approved'],
  ['3D night exterior', '01:03:41:02', '3', 'In review'],
  ['3E pier close-up', '01:03:48:16', '9', 'In review'],
  ['3F gulls insert', '01:03:52:00', '2', 'Approved'],
  ['3G lighthouse pan', '01:04:01:11', '5', 'Changes requested'],
  ['3H boat departure', '01:04:09:20', '11', 'Approved'],
  ['3I harbour master', '01:04:18:07', '6', 'In review'],
  ['3J closing wide', '01:04:30:15', '8', 'Not started'],
] as const;

export const SHOT_FIELDS = [
  { label: 'Camera', value: 'A-cam, 35 mm, T2.8' },
  { label: 'Timecode in', value: '01:03:12:04' },
  { label: 'Timecode out', value: '01:03:19:22' },
  { label: 'Colour space', value: 'Rec. 709 proxy of ACEScct' },
  { label: 'Status', value: 'Changes requested' },
] as const;
