/* The one WCAG 2.x math module (REQ-FIN-03 / REQ-MAT-10 "one WCAG module shared
   with src/theme/color.ts"): sRGB channel transfer, relative luminance, contrast
   ratio and source-over composite.

   Consumers (never copy this math into them):
   - src/theme/color.ts           typed string/Oklch API used by the runtime and tests
   - scripts/tokens/color.mjs     the tokens build's DTCG colour pipeline (re-exports)
   - scripts/tokens/transforms/** the contrast solver, through scripts/tokens/color.mjs

   It lives under src/ (plain ESM + wcag.d.mts) so the published package ships it
   at dist/theme/wcag.js beside color.js; node build scripts import it directly,
   the same way they import src/contracts/load-fragments.mjs. */

/** sRGB transfer inverse (IEC 61966-2-1): encoded channel 0..1 -> linear 0..1. */
export const srgbChannelToLinear = (x) =>
  x <= 0.04045 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4);

/** sRGB transfer (IEC 61966-2-1): linear channel 0..1 -> encoded 0..1. */
export const srgbChannelFromLinear = (x) =>
  x <= 0.0031308 ? 12.92 * x : 1.055 * Math.pow(x, 1 / 2.4) - 0.055;

/** WCAG 2.x relative luminance of an encoded sRGB triple in 0..1. */
export function wcagRelativeLuminance([r, g, b]) {
  return (
    0.2126 * srgbChannelToLinear(r) +
    0.7152 * srgbChannelToLinear(g) +
    0.0722 * srgbChannelToLinear(b)
  );
}

/** WCAG 2.x contrast ratio (1..21) of two encoded sRGB triples in 0..1. */
export function wcagContrastRatio(rgb1, rgb2) {
  const l1 = wcagRelativeLuminance(rgb1);
  const l2 = wcagRelativeLuminance(rgb2);
  const hi = Math.max(l1, l2);
  const lo = Math.min(l1, l2);
  return (hi + 0.05) / (lo + 0.05);
}

/** Source-over composite of fg (alpha a) over an opaque bg; triples in 0..1. */
export function wcagComposite(fg, a, bg) {
  return [0, 1, 2].map((i) => fg[i] * a + bg[i] * (1 - a));
}
