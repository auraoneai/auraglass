/* MAT-065: createBrandTheme — one brand color -> full GlassTheme.
   12-step accent ramp emitted as oklch(from var(--ag-color-accent) calc(l + d) c h)
   with precomputed literals inside `@supports not (color: oklch(from red l c h))`.
   Pure: no DOM. */

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
} from "./createGlassTheme";
import type { PresetId } from "./presets";

export interface CreateBrandThemeOptions {
  /** Hue rotation applied to the brand color to derive the accent (0..1 of 360deg). */
  accentShift?: number;
  preset?: PresetId;
}

const RAMP_LIGHTNESS = [0.98, 0.95, 0.9, 0.83, 0.75, 0.67, 0.58, 0.49, 0.4, 0.32, 0.24, 0.16];

const relativeAccentStep = (i: number, accentL: number): string => {
  const d = +(RAMP_LIGHTNESS[i]! - accentL).toFixed(4);
  const sign = d >= 0 ? "+" : "-";
  return `oklch(from var(--ag-color-accent) calc(l ${sign} ${Math.abs(d)}) c h)`;
};

export const createBrandTheme = (
  brand: string | Oklch,
  opts: CreateBrandThemeOptions = {}
): GlassTheme => {
  const brandOklch = parseColor(brand);
  const accentShift = opts.accentShift ?? 0.34;
  const accent: Oklch = { ...brandOklch, h: (brandOklch.h + accentShift * 360) % 360 };

  const theme = createGlassTheme({ brandColor: accent, ...(opts.preset !== undefined ? { preset: opts.preset } : {}) });

  // 12-step ramp: relative-color syntax for modern engines, precomputed literals
  // in the fallback block; the same ramp is computed in TS so both agree.
  const rampModern: string[] = [];
  const rampLiteral: string[] = [];
  const adjusted: ContrastAdjustment[] = [...theme.contrast.adjusted];
  const onAccent = parseColor(theme.vars["--ag-color-on-accent"]!);

  for (let i = 0; i < 12; i++) {
    rampModern.push(`--ag-accent-${i + 1}: ${relativeAccentStep(i, accent.l)};`);
    let step: Oklch = { l: RAMP_LIGHTNESS[i]!, c: accent.c, h: accent.h };
    // text steps failing on-accent 4.5:1 move by the minimum L
    if (wcagContrast(formatOklch(onAccent), formatOklch(step)) < 4.5) {
      const from = step.l;
      const bgL = onAccent.l;
      const dir = bgL > step.l ? -1 : 1;
      let l = step.l;
      for (let it = 0; it < 200; it++) {
        l = Math.min(1, Math.max(0, l + dir * 0.005));
        const cand = { ...step, l };
        if (wcagContrast(formatOklch(onAccent), formatOklch(cand)) >= 4.5) {
          step = cand;
          break;
        }
      }
      if (step.l !== from) {
        adjusted.push({ name: `accent-${i + 1}`, field: "l", from, to: step.l });
        if (typeof console !== "undefined")
          console.warn(
            `createBrandTheme: accent step ${i + 1} moved L ${from.toFixed(3)} -> ${step.l.toFixed(3)} to reach on-accent 4.5:1`
          );
      }
    }
    const mapped = oklchToSrgb(step);
    const stepCss = mapped.inGamut ? formatOklch(step) : formatOklch(srgbToOklch(mapped));
    rampLiteral.push(`--ag-accent-${i + 1}: ${stepCss};`);
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
    contrast: { ...theme.contrast, adjusted },
  };
};
