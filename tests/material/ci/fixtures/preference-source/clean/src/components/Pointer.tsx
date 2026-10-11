// @ts-nocheck
// Fixture: non-preference media queries and the 5.x preference hook are fine.
import { usePreference } from '../theme';

export function useFinePointer(win: Window) {
  const motion = usePreference('motion');
  const fine = win.matchMedia('(pointer: fine)').matches;
  const hover = matchMedia('(hover: hover)').matches;
  const label = 'prefers-reduced-motion is read via usePreference';
  return { motion, fine, hover, label };
}
