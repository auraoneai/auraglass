// @ts-nocheck
// Fixture (REQ-MAT-51): every OS-preference read here bypasses the single source.
import * as React from 'react';
import { useReducedMotion } from '../hooks/useReducedMotion';

const CONTRAST_QUERY = '(prefers-contrast: more)';

export function useChartPrefs(win: Window) {
  const reduced = useReducedMotion();
  const a = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const b = win.matchMedia?.(`(forced-colors: active)`)?.matches;
  const c = window.matchMedia(CONTRAST_QUERY).matches;
  const d = win['matchMedia']('(prefers-reduced-transparency: ' + 'reduce)').matches;
  return React.useMemo(() => ({ reduced, a, b, c, d }), [reduced, a, b, c, d]);
}
