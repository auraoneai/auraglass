/* The one WCAG math module (REQ-FIN-03, MAT-10): sRGB channel linearization,
   relative luminance, contrast ratio and source-over composite. Shared by
   src/theme/color.ts (typed string API) and scripts/tokens/color.mjs (the
   tokens build's DTCG pipeline) — never copy this math into either file. */

/** sRGB transfer inverse: channel 0..1 -> linear. */
export const srgbChannelToLinear = (x) =>
  x <= 0.04045 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4);

/** sRGB -> linear: channel 0..1. */
export const srgbChannelFromLinear = (x) =>
  x <= 0.0031308 ? 12.92 * x : 1.055 * Math.pow(x, 1 / 2.4) - 0.055;

/** WCAG 2.x relative luminance of an sRGB triple in 0..1. */
export function wcagRelativeLuminance([r, g, b]) {
  const [rl, gl, bl] = [r, g, b].map(srgbChannelToLinear);
  return 0.2126 * rl + 0.7152 * gl + 0.0722 * bl;
}

/** WCAG 2.x contrast ratio of two sRGB triples in 0..1. */
export function wcagContrastRatio(rgb1, rgb2) {
  const [l1, l2] = [wcagRelativeLuminance(rgb1), wcagRelativeLuminance(rgb2)];
  const [hi, lo] = l1 >= l2 ? [l1, l2] : [l2, l1];
  return (hi + 0.05) / (lo + 0.05);
}

/** Source-over composite: fg (alpha a) over opaque bg; both sRGB 0..1. */
export function wcagComposite(f, a, b) {
  return f.map((v, i) => v * a + b[i] * (1 - a));
}
