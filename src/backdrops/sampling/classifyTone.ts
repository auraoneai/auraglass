/* REQ-SURF-152 — pure tone classification. The constants below are the ones
 * REQ-SURF-152 pins (light 0.60/0.35, dark 0.30/0.55, else busy/undefined);
 * scripts/surf/calibrate-media-tone.mjs (CI job
 * surf:test:media-tone-calibration) checks them against the 8 QUAL scenes
 * and generates src/backdrops/sampling/__fixtures__/scene-stats.json from
 * its CI artifact only — that fixture is never hand-written. */
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
