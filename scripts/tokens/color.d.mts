// Declarations for color.mjs (sibling .d.mts convention, cf. validate.d.mts).
export type Oklch = { l: number; c: number; h: number };
export type Srgb = [number, number, number];
export type ColorValue =
  | { hex: string; alpha?: number }
  | { colorSpace: 'oklch' | 'srgb'; components: number[]; alpha?: number };
export function oklchToSrgb(v: Oklch): Srgb;
export function srgbToOklch(rgb: Srgb): Oklch;
export function gamutMapOklch(v: Oklch): Oklch;
export function clampSrgb(rgb: Srgb): Srgb;
export function srgbToHex(rgb: Srgb): string;
export function hexToSrgb(hex: string): Srgb;
export function relativeLuminance(rgb: Srgb): number;
export function contrastRatio(a: Srgb, b: Srgb): number;
export function composite(f: Srgb, a: number, b: Srgb): Srgb;
export function colorToSrgb(cv: ColorValue): { rgb: Srgb; alpha: number };
export function colorToCss(cv: ColorValue): string;
