// Declarations for color.mjs (sibling .d.mts convention, cf. validate.d.mts).
// The WCAG trio is re-exported from src/theme/wcag.mjs (REQ-FIN-03 / REQ-MAT-10).
export {
  wcagRelativeLuminance as relativeLuminance,
  wcagContrastRatio as contrastRatio,
  wcagComposite as composite,
} from '../../src/theme/wcag.mjs';

export type Rgb = [number, number, number];
export interface OklchLch { l: number; c: number; h: number }
export interface DtcgColorValue {
  hex?: string;
  colorSpace?: 'oklch' | 'srgb' | string;
  components?: Array<number | string>;
  alpha?: number;
}

export function oklchToSrgb(lch: OklchLch): Rgb;
export function srgbToOklch(rgb: Rgb): OklchLch;
export function gamutMapOklch(lch: OklchLch): OklchLch;
export function clampSrgb(rgb: Rgb): Rgb;
export function srgbToHex(rgb: Rgb): string;
export function hexToSrgb(hex: string): Rgb;
export function colorToSrgb(cv: DtcgColorValue): { rgb: Rgb; alpha: number };
export function colorToCss(cv: DtcgColorValue): string;
