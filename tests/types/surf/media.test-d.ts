/* REQ-SURF-09/prop-grammar for the ./media surface. tsc-only assertions —
 * never executed. Imports resolve src directly until the self-specifier
 * contract PR lands (../tests contract). */
import type {
  MediaHandle, MediaState, UseMediaElementOptions, MediaSessionMetadataInit,
} from '../../../src/media/index';
import { formatMediaTime } from '../../../src/media/index';
import type { UseMediaElementOptions as _O } from '../../../src/media/useMediaElement';

declare const handle: MediaHandle;
declare const state: MediaState;
declare const meta: MediaSessionMetadataInit;
void handle; void meta;

// MediaState fields per contract §4.6
const paused: boolean = state.paused;
const buffered: [number, number][] = state.buffered;
const tone: 'light' | 'dark' | undefined = state.tone;
const dur: number = state.duration;

// @ts-expect-error tone is only 'light'|'dark'|undefined — never 'auto'
const badTone: 'auto' = state.tone;

// options: mediaSession accepts false or metadata
const o1: UseMediaElementOptions = { snapshotHz: 4, mediaSession: false };
const o2: UseMediaElementOptions = { mediaSession: { title: 't', artwork: [{ src: '/a.png', sizes: '64x64' }] } };
// @ts-expect-error sampleTone is boolean
const o3: UseMediaElementOptions = { sampleTone: 'yes' };

// formatMediaTime signature
const t: string = formatMediaTime(92, { spoken: true });
// @ts-expect-error seconds must be a number
formatMediaTime('92');

export { paused, buffered, tone, dur, badTone, o1, o2, o3, t };
