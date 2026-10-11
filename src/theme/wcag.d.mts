/* Types for ./wcag.mjs, the one WCAG 2.x math module (REQ-FIN-03 / REQ-MAT-10). */
export type WcagRgb = readonly [number, number, number] | readonly number[];

export declare const srgbChannelToLinear: (x: number) => number;
export declare const srgbChannelFromLinear: (x: number) => number;
export declare function wcagRelativeLuminance(rgb: WcagRgb): number;
export declare function wcagContrastRatio(rgb1: WcagRgb, rgb2: WcagRgb): number;
export declare function wcagComposite(fg: WcagRgb, a: number, bg: WcagRgb): [number, number, number];
