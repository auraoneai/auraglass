/**
 * AuraGlass Dynamic Theming Engine
 * Runtime theme generation and CSS variable injection
 */

import {
  parseColor,
  getContrastRatio,
  adjustColorForContrast,
} from "./contrast";

export interface ThemeConfig {
  name: string;
  mode: "light" | "dark" | "auto";
  primary: string;
  success?: string;
  warning?: string;
  danger?: string;
  info?: string;
  blur?: {
    amount: number;
    saturate: number;
    brightness: number;
    contrast: number;
  };
  motion?: {
    reduced: boolean;
    duration: number;
    ease: string;
  };
}

export class DynamicThemeEngine {
  private styleElement: HTMLStyleElement | null = null;
  private currentTheme: ThemeConfig | null = null;
  private mediaQuery: MediaQueryList | null = null;

  constructor() {
    if (typeof document !== "undefined") {
      this.styleElement = document.createElement("style");
      this.styleElement.id = "auraglass-dynamic-theme";
      document.head.appendChild(this.styleElement);
    }
  }

  /**
   * Generate theme from a single color
   */
  generateFromColor(
    baseColor: string,
    mode: "light" | "dark" | "auto" = "auto"
  ): ThemeConfig {
    const base = parseColor(baseColor);
    if (!base) throw new Error("Invalid color");

    // Generate complementary colors
    const hsl = this.rgbToHsl(base.r, base.g, base.b);

    return {
      name: "custom",
      mode,
      primary: baseColor,
      success: this.hslToHex((hsl.h + 120) % 360, hsl.s, hsl.l),
      warning: this.hslToHex((hsl.h + 60) % 360, hsl.s, hsl.l),
      danger: this.hslToHex((hsl.h + 180) % 360, hsl.s, hsl.l),
      info: this.hslToHex((hsl.h + 240) % 360, hsl.s, hsl.l),
    };
  }

  /**
   * Apply theme to document
   */
  applyTheme(theme: ThemeConfig) {
    this.currentTheme = theme;

    // Determine actual mode
    const mode = this.resolveMode(theme.mode);

    // Generate CSS variables
    const css = this.generateThemeCSS(theme, mode);

    // Inject styles
    if (this.styleElement) {
      this.styleElement.textContent = css;
    }

    // Set data attribute
    document.documentElement.setAttribute("data-theme", mode);

    // Handle auto mode
    if (theme.mode === "auto") {
      this.setupAutoMode();
    }
  }

  /**
   * Generate theme CSS
   */
  private generateThemeCSS(theme: ThemeConfig, mode: "light" | "dark"): string {
    const isLight = mode === "light";

    // Parse colors
    const primary = parseColor(theme.primary);
    if (!primary) return "";

    // Generate opacity scale for the mode
    const opacities = isLight
      ? {
          bg: "0.60",
          bgHover: "0.70",
          bgActive: "0.80",
          border: "0.70",
          borderHover: "0.80",
          textPrimary: "0.90",
          textSecondary: "0.70",
        }
      : {
          bg: "0.20",
          bgHover: "0.25",
          bgActive: "0.30",
          border: "0.30",
          borderHover: "0.40",
          textPrimary: "0.95",
          textSecondary: "0.80",
        };

    // Build CSS
    let css = `:root {
      /* Dynamic theme colors */
      --glass-color-primary: ${this.rgbToHslString(primary)};
      ${theme.success ? `--glass-color-success: ${this.colorToHslString(theme.success)};` : ""}
      ${theme.warning ? `--glass-color-warning: ${this.colorToHslString(theme.warning)};` : ""}
      ${theme.danger ? `--glass-color-danger: ${this.colorToHslString(theme.danger)};` : ""}
      ${theme.info ? `--glass-color-info: ${this.colorToHslString(theme.info)};` : ""}
      
      /* Dynamic backgrounds */
      --glass-bg-default: rgba(var(--glass-color-white) / ${opacities.bg});
      --glass-bg-hover: rgba(var(--glass-color-white) / ${opacities.bgHover});
      --glass-bg-active: rgba(var(--glass-color-white) / ${opacities.bgActive});
      
      /* Dynamic borders */
      --glass-border-default: rgba(var(--glass-color-white) / ${opacities.border});
      --glass-border-hover: rgba(var(--glass-color-white) / ${opacities.borderHover});
      
      /* Dynamic text */
      --glass-text-primary: rgba(${isLight ? "0 0 0" : "255 255 255"} / ${opacities.textPrimary});
      --glass-text-secondary: rgba(${isLight ? "0 0 0" : "255 255 255"} / ${opacities.textSecondary});
    `;

    // Add blur settings if provided
    if (theme.blur) {
      css += `
      /* Dynamic blur */
      --glass-backdrop-blur: blur(${theme.blur.amount}px);
      --glass-backdrop-saturate: saturate(${theme.blur.saturate});
      --glass-backdrop-brightness: brightness(${theme.blur.brightness});
      --glass-backdrop-contrast: contrast(${theme.blur.contrast});
      `;
    }

    // Add motion settings if provided
    if (theme.motion) {
      css += `
      /* Dynamic motion */
      --glass-motion-duration-normal: ${theme.motion.duration}ms;
      --glass-motion-ease-standard: ${theme.motion.ease};
      `;

      if (theme.motion.reduced) {
        css += `
        --glass-motion-reduced: 1;
        `;
      }
    }

    css += "\n}";

    // Add mode-specific overrides
    if (!isLight) {
      css += `
      /* Dark mode enhancements */
      .glass-foundation-complete {
        box-shadow: var(--glass-elev-2), 0 0 0 1px rgba(255 255 255 / 0.1) inset;
      }
      `;
    }

    return css;
  }

  /**
   * Setup auto mode switching
   */
  private setupAutoMode() {
    if (typeof window === "undefined") return;

    this.mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleChange = (e: MediaQueryListEvent | MediaQueryList) => {
      if (this.currentTheme?.mode === "auto") {
        this.applyTheme(this.currentTheme);
      }
    };

    this.mediaQuery.addEventListener("change", handleChange);
    handleChange(this.mediaQuery);
  }

  /**
   * Resolve auto mode to actual mode
   */
  private resolveMode(mode: "light" | "dark" | "auto"): "light" | "dark" {
    if (mode !== "auto") return mode;

    if (typeof window !== "undefined") {
      return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    }

    return "light";
  }

  /**
   * Color conversion utilities
   */
  private rgbToHsl(r: number, g: number, b: number) {
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0,
      s = 0,
      l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

      switch (max) {
        case r:
          h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
          break;
        case g:
          h = ((b - r) / d + 2) / 6;
          break;
        case b:
          h = ((r - g) / d + 4) / 6;
          break;
      }
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100),
    };
  }

  private hslToHex(h: number, s: number, l: number): string {
    s /= 100;
    l /= 100;

    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = l - c / 2;

    let r = 0,
      g = 0,
      b = 0;

    if (h < 60) {
      r = c;
      g = x;
      b = 0;
    } else if (h < 120) {
      r = x;
      g = c;
      b = 0;
    } else if (h < 180) {
      r = 0;
      g = c;
      b = x;
    } else if (h < 240) {
      r = 0;
      g = x;
      b = c;
    } else if (h < 300) {
      r = x;
      g = 0;
      b = c;
    } else {
      r = c;
      g = 0;
      b = x;
    }

    return (
      "#" +
      [r, g, b]
        .map((v: any) => {
          const hex = Math.round((v + m) * 255).toString(16);
          return hex.length === 1 ? "0" + hex : hex;
        })
        .join("")
    );
  }

  private rgbToHslString(color: { r: number; g: number; b: number }): string {
    const hsl = this.rgbToHsl(color.r, color.g, color.b);
    return `${hsl.h} ${hsl.s}% ${hsl.l}%`;
  }

  private colorToHslString(color: string): string {
    const rgb = parseColor(color);
    if (!rgb) return "0 0% 0%";
    return this.rgbToHslString(rgb);
  }

  /**
   * Export current theme
   */
  exportTheme(): string {
    if (!this.currentTheme) return "";
    return JSON.stringify(this.currentTheme, null, 2);
  }

  /**
   * Import theme
   */
  importTheme(json: string) {
    try {
      const theme = JSON.parse(json) as ThemeConfig;
      this.applyTheme(theme);
    } catch {
      // Invalid theme imports are ignored so the current theme remains active.
    }
  }

  /**
   * Cleanup
   */
  destroy() {
    if (this.styleElement) {
      this.styleElement.remove();
    }
    if (this.mediaQuery) {
      this.mediaQuery.removeEventListener("change", () => {});
    }
  }
}

// Export singleton
export const dynamicTheme = new DynamicThemeEngine();

/**
 * React hook for dynamic theming
 */
export function useDynamicTheme(config?: ThemeConfig) {
  useEffect(() => {
    if (config) {
      dynamicTheme.applyTheme(config);
    }

    return () => {
      // Cleanup if needed
    };
  }, [config]);
}

import { useEffect } from "react";
