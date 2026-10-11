/* REQ-SURF-152 — pure tone classification. Constants calibrated once at alpha
 * over the 8 QUAL scenes (scripts/surf/calibrate-media-tone.mjs →
 * src/media/sampling/__fixtures__/scene-stats.json). */
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
