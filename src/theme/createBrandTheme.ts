/* MAT-065 / REQ-MAT-16 (REQ-FIN-52, FIN-D D.3-12): createBrandTheme — one
   brand color -> full GlassTheme. The brand hue is preserved by default
   (accentShift 0, OD-18 default). 12-step private accent ramp
   `--_ag-accent-1..12` emitted as oklch(from var(--ag-color-accent) calc(l ± d) c h)
   with precomputed literals inside `@supports not (color: oklch(from red l c h))`;
   both forms carry the same (contrast-adjusted) L. Every ramp step is a text
   step: one ContrastPair (on-accent vs step, min 4.5) per step is pushed into
   contrast.pairs. Pure: no DOM. */

import {
  parseColor,
  srgbToOklch,
  oklchToSrgb,
  wcagContrast,
  formatOklch,
  RELATIVE_OKLCH_QUERY,
  type Oklch,
} from "./color";
import {
  createGlassTheme,
  type GlassTheme,
  type ContrastAdjustment,
  type ContrastPair,
} from "./createGlassTheme";
import type { PresetId } from "./presets";

export interface CreateBrandThemeOptions {
  /** Hue rotation applied to the brand color to derive the accent (0..1 of
   *  360deg). Default 0: the accent keeps the brand hue (OD-18). */
  accentShift?: number;
  preset?: PresetId;
}

const RAMP_LIGHTNESS = [0.98, 0.95, 0.9, 0.83, 0.75, 0.67, 0.58, 0.49, 0.4, 0.32, 0.24, 0.16];

const relativeAccentStep = (stepL: number, accentL: number): string => {
  const d = +(stepL - accentL).toFixed(4);
  const sign = d >= 0 ? "+" : "-";
  return `oklch(from var(--ag-color-accent) calc(l ${sign} ${Math.abs(d)}) c h)`;
};

export const createBrandTheme = (
  brand: string | Oklch,
  opts: CreateBrandThemeOptions = {}
): GlassTheme => {
  const brandOklch = parseColor(brand);
  const accentShift = opts.accentShift ?? 0;
  const accent: Oklch = { ...brandOklch, h: (brandOklch.h + accentShift * 360) % 360 };

  const theme = createGlassTheme({ brandColor: accent, ...(opts.preset !== undefined ? { preset: opts.preset } : {}) });

  // 12-step ramp: relative-color syntax for modern engines, precomputed literals
  // in the fallback block; the same ramp is computed in TS so both agree.
  const rampModern: string[] = [];
  const rampLiteral: string[] = [];
  const adjusted: ContrastAdjustment[] = [...theme.contrast.adjusted];
  const rampPairs: ContrastPair[] = [];
  const onAccentCss = theme.vars["--ag-color-on-accent"]!;
  // var(--ag-color-accent) is the emitted (gamut-mapped) accent; the ramp is
  // derived from it so the relative form and the literals share c and h.
  const base = parseColor(theme.vars["--ag-color-accent"]!);
  // the literal actually emitted for a step (gamut-mapped into sRGB)
  const emit = (o: Oklch): string => {
    const mapped = oklchToSrgb(o);
    return mapped.inGamut ? formatOklch(o) : formatOklch(srgbToOklch(mapped));
  };
  const onAccent = parseColor(onAccentCss);

  for (let i = 0; i < 12; i++) {
    let step: Oklch = { l: RAMP_LIGHTNESS[i]!, c: base.c, h: base.h };
    // text steps failing on-accent 4.5:1 move by the minimum L: search both
    // directions in 0.005 steps and take the nearest L that reaches 4.5 (a
    // step darker than a dark on-accent can only pass by getting lighter)
    if (wcagContrast(onAccentCss, emit(step)) < 4.5) {
      const from = step.l;
      let best: number | undefined;
      for (let k = 1; k <= 200 && best === undefined; k++) {
        for (const dir of onAccent.l > from ? [-1, 1] : [1, -1]) {
          const l = +(from + dir * k * 0.005).toFixed(4);
          if (l < 0 || l > 1) continue;
          if (wcagContrast(onAccentCss, emit({ ...step, l })) >= 4.5) {
            best = l;
            break;
          }
        }
      }
      if (best !== undefined) step = { ...step, l: best };
      if (step.l !== from) {
        adjusted.push({ name: `accent-${i + 1}`, field: "l", from, to: step.l });
        if (typeof console !== "undefined")
          console.warn(
            `createBrandTheme: accent step ${i + 1} moved L ${from.toFixed(3)} -> ${step.l.toFixed(3)} to reach on-accent 4.5:1`
          );
      }
    }
    // the relative form uses the final (possibly adjusted) L so modern engines
    // render the same ramp the literal fallback and the report describe
    rampModern.push(`--_ag-accent-${i + 1}: ${relativeAccentStep(step.l, base.l)};`);
    const stepCss = emit(step);
    rampLiteral.push(`--_ag-accent-${i + 1}: ${stepCss};`);
    const ratio = wcagContrast(onAccentCss, stepCss);
    rampPairs.push({
      name: `onAccentOnAccent${i + 1}`,
      foreground: onAccentCss,
      background: stepCss,
      ratio,
      min: 4.5,
      pass: ratio >= 4.5,
    });
  }

  const sel = `[data-ag-theme="${theme.id}"]`;
  const cssText = [
    theme.cssText,
    `${sel} { ${rampModern.join(" ")} }`,
    `@supports not (${RELATIVE_OKLCH_QUERY}) { ${sel} { ${rampLiteral.join(" ")} } }`,
  ].join("\n");

  return {
    ...theme,
    cssText,
    contrast: { ...theme.contrast, pairs: [...theme.contrast.pairs, ...rampPairs], adjusted },
  };
};
