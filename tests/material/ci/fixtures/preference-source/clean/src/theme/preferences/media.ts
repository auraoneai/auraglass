// @ts-nocheck
// Fixture: allowed preference source (store media registry).
export const MEDIA_QUERIES = {
  reducedMotion: '(prefers-reduced-motion: reduce)',
  contrastMore: '(prefers-contrast: more)',
  reducedTransparency: '(prefers-reduced-transparency: reduce)',
  forcedColors: '(forced-colors: active)',
} as const;
export const read = (win: Window, q: keyof typeof MEDIA_QUERIES) => win.matchMedia(MEDIA_QUERIES[q]).matches;
export const forced = (win: Window) => win.matchMedia('(forced-colors: active)').matches;
