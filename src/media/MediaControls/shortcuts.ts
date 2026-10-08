'use client';
/* REQ-SURF-137 — shortcuts bound on the Root only when focus is inside;
 * never registered on window/document. */
import type { MediaModel } from './mediaContext';

const RATES = [0.5, 0.75, 1, 1.25, 1.5, 2];

export function handleMediaShortcut(key: string, m: MediaModel): boolean {
  switch (key) {
    case ' ':
    case 'k': case 'K': m.toggle(); return true;
    case 'j': case 'J': m.seekBy(-10); return true;
    case 'l': case 'L': m.seekBy(10); return true;
    case 'm': case 'M': m.setMuted(!m.muted); return true;
    case 'f': case 'F': m.requestFullscreen(); return true;
    case 'c': case 'C': m.toggleCaptions(); return true;
    case '<': m.setRate(Math.max(0.25, m.playbackRate - 0.25)); return true;
    case '>': m.setRate(Math.min(4, m.playbackRate + 0.25)); return true;
    default: return false;
  }
}
export { RATES };
