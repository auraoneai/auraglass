/* MAT-045: contrast helpers re-export the single color.ts implementation.
   (DS-109 deletes this file at 5.0; A11Y-004 verifies 0 importers.) */
export {
  relativeLuminance,
  contrastRatio,
  wcagContrast,
  compositeOver,
  oklchToSrgb,
  srgbToOklch,
  parseColor,
  apcaLc,
  deltaE2000,
} from './color';
export type { Oklch, Srgb } from './color';
