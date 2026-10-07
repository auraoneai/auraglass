import {
  bestTextColor,
  contrastRatio,
  mixHex,
  normalizeHexColor,
} from "./color";
import {
  glassMaterialPresets,
  type GlassMaterialPreset,
  type GlassMaterialTokens,
} from "./materials";

export type GlassThemeMode = "light" | "dark" | "system" | "high-contrast";
export type GlassDensity = "compact" | "comfortable" | "spacious";
export type GlassMotionPolicy = "system" | "reduced" | "expressive" | "none";

export interface GlassThemeTokens {
  color: {
    brand: string;
    brandText: string;
    accent: string;
    background: string;
    surface: string;
    surfaceStrong: string;
    text: string;
    textMuted: string;
    border: string;
    focus: string;
    success: string;
    warning: string;
    danger: string;
  };
  density: {
    controlHeight: string;
    radius: string;
    gap: string;
    pagePadding: string;
  };
  motion: {
    durationFast: string;
    durationNormal: string;
    easingStandard: string;
    allowContinuous: boolean;
  };
  material: Record<GlassMaterialPreset, GlassMaterialTokens>;
}

export interface GlassTheme {
  id: string;
  name: string;
  mode: GlassThemeMode;
  density: GlassDensity;
  motionPolicy: GlassMotionPolicy;
  tokens: GlassThemeTokens;
  contrast: {
    brandOnBackground: number;
    textOnSurface: number;
    textOnBrand: number;
  };
}

export interface CreateGlassThemeOptions {
  id?: string;
  name?: string;
  brandColor?: string;
  accentColor?: string;
  mode?: GlassThemeMode;
  density?: GlassDensity;
  motionPolicy?: GlassMotionPolicy;
}

const densityTokens: Record<GlassDensity, GlassThemeTokens["density"]> = {
  compact: {
    controlHeight: "2rem",
    radius: "0.5rem",
    gap: "0.5rem",
    pagePadding: "1rem",
  },
  comfortable: {
    controlHeight: "2.5rem",
    radius: "0.75rem",
    gap: "0.75rem",
    pagePadding: "1.5rem",
  },
  spacious: {
    controlHeight: "3rem",
    radius: "1rem",
    gap: "1rem",
    pagePadding: "2rem",
  },
};

const motionTokens = (
  policy: GlassMotionPolicy
): GlassThemeTokens["motion"] => {
  if (policy === "none") {
    return {
      durationFast: "0ms",
      durationNormal: "0ms",
      easingStandard: "linear",
      allowContinuous: false,
    };
  }
  if (policy === "reduced") {
    return {
      durationFast: "80ms",
      durationNormal: "120ms",
      easingStandard: "cubic-bezier(0.2, 0, 0, 1)",
      allowContinuous: false,
    };
  }
  return {
    durationFast: "140ms",
    durationNormal: "220ms",
    easingStandard: "cubic-bezier(0.2, 0.8, 0.2, 1)",
    allowContinuous: policy === "expressive",
  };
};

export const createGlassTheme = (
  options: CreateGlassThemeOptions = {}
): GlassTheme => {
  const brand = normalizeHexColor(options.brandColor ?? "#7dd3fc");
  const accent = normalizeHexColor(options.accentColor ?? "#c084fc");
  const mode = options.mode ?? "dark";
  const density = options.density ?? "comfortable";
  const motionPolicy = options.motionPolicy ?? "system";
  const isLight = mode === "light";
  const isHighContrast = mode === "high-contrast";

  const background = isHighContrast
    ? "#000000"
    : isLight
      ? "#eef7fb"
      : "#06111f";
  const surface = isHighContrast ? "#050505" : isLight ? "#ffffff" : "#0c1526";
  const surfaceStrong = isHighContrast
    ? "#101010"
    : isLight
      ? "#e1eef6"
      : "#111c31";
  const text = isLight ? "#07111f" : "#f8fafc";
  const textMuted = isLight ? "#3f5269" : "#b6c4d8";
  const border = mixHex(
    brand,
    isLight ? "#0f172a" : "#ffffff",
    isLight ? 0.72 : 0.45
  );
  const brandText = bestTextColor(brand);

  const tokens: GlassThemeTokens = {
    color: {
      brand,
      brandText,
      accent,
      background,
      surface,
      surfaceStrong,
      text,
      textMuted,
      border,
      focus: mixHex(brand, "#ffffff", 0.2),
      success: "#22c55e",
      warning: "#f59e0b",
      danger: "#ef4444",
    },
    density: densityTokens[density],
    motion: motionTokens(motionPolicy),
    material: glassMaterialPresets,
  };

  return {
    id: options.id ?? "glass-theme",
    name: options.name ?? "AuraGlass Theme",
    mode,
    density,
    motionPolicy,
    tokens,
    contrast: {
      brandOnBackground: contrastRatio(brand, background),
      textOnSurface: contrastRatio(text, surface),
      textOnBrand: contrastRatio(brandText, brand),
    },
  };
};

export interface CreateBrandGlassThemeOptions
  extends Omit<CreateGlassThemeOptions, "brandColor" | "accentColor"> {
  brandColor: string;
  accentShift?: number;
}

export const createBrandGlassTheme = ({
  brandColor,
  accentShift = 0.34,
  ...options
}: CreateBrandGlassThemeOptions): GlassTheme =>
  createGlassTheme({
    ...options,
    brandColor,
    accentColor: mixHex(brandColor, "#c084fc", accentShift),
    id: options.id ?? "brand-glass-theme",
    name: options.name ?? "Brand AuraGlass Theme",
  });

export const createGlassThemeCssVars = (
  theme: GlassTheme
): Record<string, string> => ({
  "--glass-theme-brand": theme.tokens.color.brand,
  "--glass-theme-brand-text": theme.tokens.color.brandText,
  "--glass-theme-accent": theme.tokens.color.accent,
  "--glass-theme-background": theme.tokens.color.background,
  "--glass-theme-surface": theme.tokens.color.surface,
  "--glass-theme-surface-strong": theme.tokens.color.surfaceStrong,
  "--glass-theme-text": theme.tokens.color.text,
  "--glass-theme-text-muted": theme.tokens.color.textMuted,
  "--glass-theme-border": theme.tokens.color.border,
  "--glass-theme-focus": theme.tokens.color.focus,
  "--glass-theme-control-height": theme.tokens.density.controlHeight,
  "--glass-theme-radius": theme.tokens.density.radius,
  "--glass-theme-gap": theme.tokens.density.gap,
  "--glass-theme-page-padding": theme.tokens.density.pagePadding,
  "--glass-theme-duration-fast": theme.tokens.motion.durationFast,
  "--glass-theme-duration-normal": theme.tokens.motion.durationNormal,
  "--glass-theme-easing-standard": theme.tokens.motion.easingStandard,
});
