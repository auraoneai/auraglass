/* MAT-064 createGlassTheme redesign (seed marker retired — implementation is real).
   Pure: no 'use client', no DOM access. Colors enter through parseColor. */

import {
  parseColor,
  oklchToSrgb,
  srgbToOklch,
  wcagContrast,
  formatOklch,
  formatLightDark,
  type Oklch,
} from "./color";
import { manifest } from "../tokens/generated/manifest";
import { presets, type PresetId, type ThemePreset } from "./presets";

export type GlassThemeMode = "light" | "dark" | "system" | "high-contrast";
export type GlassDensity = "compact" | "comfortable" | "spacious";
export type GlassMotionAxis = "full" | "calm" | "none" | "system";
export type GlassContrastAxis = "standard" | "more";

export interface ContrastPair {
  name: string;
  foreground: string;
  background: string;
  ratio: number;
  min: number;
  pass: boolean;
}
export interface ContrastAdjustment {
  name: string;
  field: "l" | "c";
  from: number;
  to: number;
}
export interface ContrastReport {
  pairs: ContrastPair[];
  adjusted: ContrastAdjustment[];
  brandOnBackground: number;
  textOnSurface: number;
  textOnBrand: number;
}

export interface GlassThemeTokens {
  color: {
    canvas: { light: string; dark: string };
    accent: string;
    onAccent: string;
    onSurface: { light: string; dark: string };
  };
  /** resolved density axis + scale (comfortable -> regular per §21 OI-03) */
  density: { axis: "compact" | "regular" | "spacious"; scale: number };
  /** resolved motion axis (MAT-088 / REQ-MOT-07) + allowContinuous. 5.0 themes
   *  never set motion (REQ-MAT-45): always { axis: "system", allowContinuous:
   *  false }; the 4.x option lives only in src/compat/mat (DEP-M0902). */
  motion: { axis: GlassMotionAxis; allowContinuous: boolean };
  /** resolved contrast axis */
  contrast: GlassContrastAxis;
  preset: PresetId;
}

export interface GlassTheme {
  id: string;
  name: string;
  /** One `[data-ag-theme="<id>"] { ... }` rule — never :root. For mode
   *  light/dark/high-contrast it also sets `color-scheme`, so every
   *  `light-dark()` token under the theme resolves to that scheme. */
  cssText: string;
  /** Custom properties to inject; manifest --ag-* names only. */
  vars: Record<string, string>;
  contrast: ContrastReport;
  tokens: GlassThemeTokens;
}

export interface CreateGlassThemeOptions {
  id?: string;
  name?: string;
  brandColor?: string | Oklch;
  accentColor?: string | Oklch;
  preset?: PresetId;
  neutralHue?: number;
  radiusScale?: number;
  mode?: GlassThemeMode;
  density?: GlassDensity;
  contrast?: GlassContrastAxis;
}

const manifestValue = (cssVar: string, mode?: "light" | "dark"): string | undefined => {
  const t = (manifest.tokens as readonly { cssVar: string; value?: string; modes?: Record<string, string> }[]).find(
    (x) => x.cssVar === cssVar
  );
  if (mode && t?.modes?.[mode]) return t.modes[mode];
  return t?.value;
};

const DENSITY_SCALE = { compact: 0.875, regular: 1, spacious: 1.125 } as const;

type ManifestToken = {
  cssVar: string;
  public?: boolean;
  modes?: Readonly<Record<string, string>>;
  consumers?: readonly { count?: number }[];
};

/** contrast 'more' values: every public, consumed manifest var that carries a
 *  `more` mode (the same values dist/tokens.css emits under
 *  [data-ag-contrast=more]), applied in the theme scope. */
const CONTRAST_MORE_VARS: readonly (readonly [string, string])[] = (
  manifest.tokens as readonly ManifestToken[]
)
  .filter(
    (t) =>
      t.public !== false &&
      !t.cssVar.startsWith("--_ag-") &&
      t.modes?.more !== undefined &&
      (t.consumers ?? []).reduce((n, c) => n + (c.count ?? 1), 0) >= 1
  )
  .map((t) => [t.cssVar, t.modes!.more!] as const);

/** One development warning per distinct adjustment set (REQ-MAT-15). */
const warnedAdjustments = new Set<string>();
const warnAdjusted = (id: string, adjusted: readonly ContrastAdjustment[]): void => {
  if (adjusted.length === 0) return;
  if (typeof process !== "undefined" && process.env?.NODE_ENV === "production") return;
  const detail = adjusted
    .map((a) => `${a.name}.${a.field} ${+a.from.toFixed(4)}→${+a.to.toFixed(4)}`)
    .join(", ");
  const key = `${id}|${detail}`;
  if (warnedAdjustments.has(key)) return;
  warnedAdjustments.add(key);
  if (typeof console !== "undefined")
    console.warn(
      `[aura-glass] createGlassTheme("${id}"): brand input failed contrast; adjusted ${detail}. See theme.contrast.adjusted.`
    );
};

const pair = (name: string, foreground: string, background: string, min: number): ContrastPair => {
  const ratio = wcagContrast(foreground, background);
  return { name, foreground, background, ratio, min, pass: ratio >= min };
};
const RADIUS_BASE = { xs: 6, sm: 10, md: 14, lg: 20, xl: 28 } as const;

/** REQ-MAT-45: no theme option raises (or sets) motion; motion follows the OS
 *  floor and the preferences store. */
const SYSTEM_MOTION = { axis: "system", allowContinuous: false } as const;

/** Move L minimally until `fg` over `bg` passes `min`; returns adjusted color + report.
 *  Direction moves `fg` away from `bg`'s lightness (max separation). */
const floorAdjust = (
  name: string,
  fg: Oklch,
  bg: string,
  min: number,
  adjusted: ContrastAdjustment[]
): Oklch => {
  if (wcagContrast(formatOklch(fg), bg) >= min) return fg;
  const from = fg.l;
  const bgL = parseColor(bg).l;
  const primaryDir = bgL > fg.l ? -1 : 1;
  const tryDir = (dir: number): Oklch | null => {
    let l = fg.l;
    for (let i = 0; i < 200; i++) {
      l = Math.min(1, Math.max(0, l + dir * 0.005));
      const out = { ...fg, l };
      if (wcagContrast(formatOklch(out), bg) >= min) return out;
    }
    return null;
  };
  // move `fg` away from bg's lightness first; if impossible, try the other way
  const out = tryDir(primaryDir) ?? tryDir(-primaryDir);
  if (out && out.l !== from) adjusted.push({ name, field: "l", from, to: out.l });
  return out ?? fg;
};

export const createGlassTheme = (
  options: CreateGlassThemeOptions = {}
): GlassTheme => {
  const preset: ThemePreset = presets[options.preset ?? "aura"];
  const mode = options.mode ?? "system"; // system = media-driven; no pin
  const contrastAxis: GlassContrastAxis =
    options.contrast ?? (mode === "high-contrast" ? "more" : "standard");
  const densityAxis =
    options.density === "compact"
      ? "compact"
      : options.density === "spacious"
        ? "spacious"
        : "regular"; // comfortable -> regular
  const motion: GlassThemeTokens["motion"] = { ...SYSTEM_MOTION };

  // canvas: preset's authored pair; a custom brandColor/neutralHue re-hues it
  let canvasLight = parseColor(preset.canvas.light);
  let canvasDark = parseColor(preset.canvas.dark);
  if (options.neutralHue !== undefined) {
    canvasLight = { ...canvasLight, h: options.neutralHue };
    canvasDark = { ...canvasDark, h: options.neutralHue };
  }

  const accent = parseColor(
    options.brandColor ?? options.accentColor ?? preset.accent
  );
  const accentGamut = oklchToSrgb(accent); // clamps into sRGB if needed
  const accentCss = accentGamut.inGamut ? formatOklch(accent) : formatOklch(srgbToOklch(accentGamut));

  // on-accent: manifest default first; when it fails, pick the better polarity
  // (dark text on a light accent) before minimal-L adjustment.
  const onAccentDefault = manifestValue("--ag-color-on-accent");
  const adjusted: ContrastAdjustment[] = [];
  let onAccent = onAccentDefault ? parseColor(onAccentDefault) : ({ l: 1, c: 0, h: 0 } as Oklch);
  if (wcagContrast(formatOklch(onAccent), accentCss) < 4.5) {
    const darkText = parseColor(manifestValue("--ag-color-on-surface") ?? preset.canvas.dark);
    if (wcagContrast(formatOklch(darkText), accentCss) > wcagContrast(formatOklch(onAccent), accentCss)) {
      onAccent = darkText;
      adjusted.push({ name: "onAccent", field: "l", from: onAccentDefault ? parseColor(onAccentDefault).l : 1, to: darkText.l });
    }
  }
  onAccent = floorAdjust("onAccent", onAccent, accentCss, 4.5, adjusted);
  const onAccentCss = formatOklch(onAccent);

  // custom canvas floors: on-surface text must reach 4.5 against canvas per scheme
  const onSurfaceLight = parseColor(manifestValue("--ag-color-on-surface") ?? preset.canvas.light);
  const onSurfaceDark = parseColor(
    manifestValue("--ag-color-on-surface", "dark") ?? preset.canvas.dark
  );
  canvasLight = floorAdjust("canvas.light", canvasLight, formatOklch(onSurfaceLight), 4.5, adjusted);
  canvasDark = floorAdjust("canvas.dark", canvasDark, formatOklch(onSurfaceDark), 4.5, adjusted);

  const radiusScale = options.radiusScale ?? preset.radiusScale ?? 1;

  // The canvas always stays a light-dark() pair; a pinned mode sets
  // `color-scheme` on the theme scope instead, so canvas and on-surface (and
  // every other light-dark() token) resolve to the same scheme.
  const colorScheme: "light" | "dark" | null =
    mode === "light" ? "light" : mode === "dark" || mode === "high-contrast" ? "dark" : null;

  const vars: Record<string, string> = {
    "--ag-color-canvas": formatLightDark(formatOklch(canvasLight), formatOklch(canvasDark)),
    "--ag-color-accent": accentCss,
    "--ag-color-on-accent": onAccentCss,
  };
  if (radiusScale !== 1) {
    for (const [k, px] of Object.entries(RADIUS_BASE))
      vars[`--ag-radius-${k}`] = `${+((px * radiusScale)).toFixed(2)}px`;
  }
  if (densityAxis !== "regular") vars["--ag-density"] = String(DENSITY_SCALE[densityAxis]);
  if (contrastAxis === "more") for (const [k, v] of CONTRAST_MORE_VARS) vars[k] = v;

  const lightCanvasCss = formatOklch(canvasLight);
  const darkCanvasCss = formatOklch(canvasDark);
  // light-scheme pairs first (indices 0..2 are the 4.x report order), then the
  // dark-scheme pairs; the summary ratios are the worst case over both schemes.
  const pairs: ContrastPair[] = [
    pair("textOnSurface", formatOklch(onSurfaceLight), lightCanvasCss, 4.5),
    pair("brandOnBackground", accentCss, lightCanvasCss, 3),
    pair("textOnBrand", onAccentCss, accentCss, 4.5),
    pair("textOnSurface.dark", formatOklch(onSurfaceDark), darkCanvasCss, 4.5),
    pair("brandOnBackground.dark", accentCss, darkCanvasCss, 3),
  ];

  const id = options.id ?? "ag-theme";
  warnAdjusted(id, adjusted);

  const declarations = [
    ...(colorScheme ? [`color-scheme: ${colorScheme};`] : []),
    ...Object.entries(vars).map(([k, v]) => `${k}: ${v};`),
  ];
  const cssText = `[data-ag-theme="${id}"] { ${declarations.join(" ")} }`;

  return {
    id,
    name: options.name ?? "AuraGlass Theme",
    cssText,
    vars,
    contrast: {
      pairs,
      adjusted,
      brandOnBackground: Math.min(pairs[1]!.ratio, pairs[4]!.ratio),
      textOnSurface: Math.min(pairs[0]!.ratio, pairs[3]!.ratio),
      textOnBrand: pairs[2]!.ratio,
    },
    tokens: {
      color: {
        canvas: { light: formatOklch(canvasLight), dark: formatOklch(canvasDark) },
        accent: accentCss,
        onAccent: onAccentCss,
        onSurface: {
          light: formatOklch(onSurfaceLight),
          dark: formatOklch(onSurfaceDark),
        },
      },
      density: { axis: densityAxis, scale: DENSITY_SCALE[densityAxis] },
      motion,
      contrast: contrastAxis,
      preset: preset.id,
    },
  };
};

/* ---------------- 4.x deprecated wrapper (MAT-066/067) ----------------
   createGlassThemeCssVars moved to src/compat/mat/theme.ts (REQ-MAT-15,
   FIN-D D.3-11) and is no longer exported from aura-glass/theme. This
   re-export only keeps src/theme/index.ts (FIN-A, REQ-FIN-04, GitHub PR 121)
   compiling until PR 121 drops its createGlassThemeCssVars re-export; it is
   removed in the first FIN-D PR after PR 121 is on next. */
export { createGlassThemeCssVars } from "../compat/mat/theme";
