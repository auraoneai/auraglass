'use client';
/* REQ-SURF-137 — the shortcut map. MediaControls.Root binds it on its own
 * element and on `shortcutTarget` (element listeners on one AbortController);
 * it is never registered on window/document. */
import type { MediaModel } from './mediaContext';

const RATES = [0.5, 0.75, 1, 1.25, 1.5, 2];
const MIN_RATE = 0.25;
const MAX_RATE = 4;
const RATE_STEP = 0.25;

/** Space/K toggle, J/L ∓10 s, M mute, F fullscreen, C captions, </> rate. */
export function handleMediaShortcut(key: string, m: MediaModel): boolean {
  switch (key) {
    case ' ':
    case 'k': case 'K': m.toggle(); return true;
    case 'j': case 'J': m.seekBy(-10); return true;
    case 'l': case 'L': m.seekBy(10); return true;
    case 'm': case 'M': m.setMuted(!m.muted); return true;
    case 'f': case 'F': m.requestFullscreen(); return true;
    case 'c': case 'C': m.toggleCaptions(); return true;
    case '<': m.setRate(Math.max(MIN_RATE, m.playbackRate - RATE_STEP)); return true;
    case '>': m.setRate(Math.min(MAX_RATE, m.playbackRate + RATE_STEP)); return true;
    default: return false;
  }
}

const TEXT_INPUT_TYPES = new Set(['', 'text', 'search', 'email', 'url', 'tel', 'password', 'number', 'date',
  'datetime-local', 'month', 'time', 'week']);

/** Keys typed into a text field are text, not shortcuts. Range inputs (the
 * scrubber/volume thumbs) are not text fields, so shortcuts still apply there. */
export function isTextEntry(el: Element | null): boolean {
  if (!el) return false;
  const h = el as HTMLElement;
  if (h.isContentEditable) return true;
  if (el.tagName === 'TEXTAREA' || el.tagName === 'SELECT') return true;
  if (el.tagName === 'INPUT') return TEXT_INPUT_TYPES.has(((el as HTMLInputElement).type ?? '').toLowerCase());
  return false;
}

/** Space/Enter on a focused button activate that button natively; the
 * shortcut map must not also act on them. */
export function isActivationKeyOnControl(key: string, el: Element | null): boolean {
  if (key !== ' ' && key !== 'Enter') return false;
  if (!el) return false;
  if (el.tagName === 'BUTTON' || el.tagName === 'A') return true;
  const role = el.getAttribute('role');
  return role === 'button' || role === 'menuitem' || role === 'menuitemradio' || role === 'menuitemcheckbox';
}

export { RATES };
