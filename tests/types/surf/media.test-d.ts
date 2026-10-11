/* REQ-SURF-09/prop-grammar for the ./media surface. tsc-only assertions —
 * never executed. Imports resolve src directly until the self-specifier
 * contract PR lands (../tests contract). */
import type {
  MediaHandle, MediaState, UseMediaElementOptions, MediaSessionMetadataInit,
} from '../../../src/media/index';
import { formatMediaTime, useMediaElement } from '../../../src/media/index';
import * as React from 'react';
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

// REQ-SURF-130: useMediaElement takes only a media-element ref (inside a
// custom hook so the cases also satisfy rules-of-hooks).
declare const videoRef: React.RefObject<HTMLVideoElement | null>;
declare const audioRef: React.RefObject<HTMLAudioElement | null>;
declare const divRef: React.RefObject<HTMLDivElement | null>;
function useRefCases(): MediaHandle[] {
  const h1: MediaHandle = useMediaElement(videoRef);
  const h2: MediaHandle = useMediaElement(audioRef, { sampleTone: true });
  const h3: MediaHandle = useMediaElement(React.createRef<HTMLVideoElement>());
  // @ts-expect-error a non-media ref is a type error
  useMediaElement(React.createRef<HTMLDivElement>());
  // @ts-expect-error a non-media ref is a type error
  useMediaElement(divRef);
  return [h1, h2, h3];
}

export { paused, buffered, tone, dur, badTone, o1, o2, o3, t, useRefCases };
