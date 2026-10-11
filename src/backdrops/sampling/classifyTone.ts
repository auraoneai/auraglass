/* REQ-SURF-152 — pure tone classification. Constants are checked against the
 * 8 QUAL scenes measured by scripts/surf/calibrate-media-tone.mjs (CI job
 * surf:certify:media-tone → src/backdrops/sampling/__fixtures__/scene-stats.json). */
import type { LumaStats } from './luma';

export const TONE_LIGHT_MEAN = 0.60;
export const TONE_LIGHT_P10 = 0.35;
export const TONE_DARK_MEAN = 0.30;
export const TONE_DARK_P90 = 0.55;

export type MediaTone = 'light' | 'dark' | undefined;

export function classifyTone(stats: LumaStats): MediaTone {
  if (stats.mean >= TONE_LIGHT_MEAN && stats.p10 >= TONE_LIGHT_P10) return 'light';
  if (stats.mean <= TONE_DARK_MEAN && stats.p90 <= TONE_DARK_P90) return 'dark';
  return undefined;
}
