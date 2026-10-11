/* REQ-SURF-154 step 4 — the tone sampler is reachable only through
 * library-owned media: useMediaElement takes a ref to an HTMLMediaElement
 * and `sampleTone` is a boolean switch, so neither an arbitrary Element nor a
 * selector string can be sampled. tsc-only assertions — never executed. */
import * as React from 'react';
import { useMediaElement, type UseMediaElementOptions } from '../../../src/media/index';

declare const videoRef: React.RefObject<HTMLVideoElement | null>;
declare const sectionRef: React.RefObject<HTMLElement | null>;
declare const anyElement: Element;

function useSamplingCases(): void {
  useMediaElement(videoRef, { sampleTone: true });
  // @ts-expect-error a ref to an arbitrary HTMLElement is not sampleable media
  useMediaElement(sectionRef, { sampleTone: true });
  // @ts-expect-error a selector string is not a media ref
  useMediaElement('video.hero', { sampleTone: true });
  // @ts-expect-error an Element instance is not a media ref
  useMediaElement(anyElement, { sampleTone: true });
}

// @ts-expect-error sampleTone does not accept an element to sample
const byElement: UseMediaElementOptions = { sampleTone: anyElement };
// @ts-expect-error sampleTone does not accept a selector
const bySelector: UseMediaElementOptions = { sampleTone: 'img.backdrop' };

export { useSamplingCases, byElement, bySelector };
