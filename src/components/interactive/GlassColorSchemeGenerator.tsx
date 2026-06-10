"use client";
import React, { useState, useCallback, useMemo } from "react";
import { cn } from "@/lib/utils";
import { OptimizedGlass } from "../../primitives";
import { normalizeColorInputValue } from "../../utils/colorInput";

export interface ColorScheme {
  primary: string;
  secondary: string;
  accent: string;
  neutral: string;
  success: string;
  warning: string;
  error: string;
  info: string;
  background: string;
  surface: string;
  text: string;
}

export interface GlassColorSchemeGeneratorProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** Initial color scheme */
  initialScheme?: Partial<ColorScheme>;
  /** Whether to show advanced options */
  advanced?: boolean;
  /** Whether to generate CSS variables */
  generateCSS?: boolean;
  /** Whether to generate Tailwind config */
  generateTailwind?: boolean;
  /** Custom className */
  className?: string;
  /** Compact preview/card layout */
  compact?: boolean;
  /** Bound the generator inside its parent container */
  contained?: boolean;
  /** Maximum height for compact/contained generators */
  maxHeight?: number | string;
  /** Change handler */
  onSchemeChange?: (scheme: ColorScheme) => void;
  /** Export handler */
  onExport?: (scheme: ColorScheme, format: "css" | "json" | "tailwind") => void;
  "data-testid"?: string;
  "aria-label"?: string;
}

// Predefined color palettes
const predefinedPalettes = {
  ocean: {
    primary: "#0066cc",
    secondary: "#00a3cc",
    accent: "#00ffcc",
  },
  sunset: {
    primary: "#ff6b35",
    secondary: "#f7931e",
    accent: "#ffb627",
  },
  forest: {
    primary: "#2d5a27",
    secondary: "#4a7c59",
    accent: "#7fb069",
  },
  royal: {
    primary: "#4a0e4e",
    secondary: "#7b2cbf",
    accent: "#c77dff",
  },
  minimal: {
    primary: "#2c3e50",
    secondary: "#34495e",
    accent: "#ecf0f1",
  },
};

const GlassColorSchemeGenerator = React.forwardRef<
  HTMLDivElement,
  GlassColorSchemeGeneratorProps
>(
  (
    {
      initialScheme,
      advanced = false,
      generateCSS = true,
      generateTailwind = false,
      className = "",
      compact = false,
      contained = false,
      maxHeight,
      onSchemeChange,
      onExport,
      "data-testid": dataTestId,
      "aria-label": ariaLabel,
      ...props
    },
    ref
  ) => {
    const [baseColor, setBaseColor] = useState(
      initialScheme?.primary || "#0066cc"
    );
    const [palette, setPalette] =
      useState<keyof typeof predefinedPalettes>("ocean");
    const [harmony, setHarmony] = useState<
      "analogous" | "complementary" | "triadic" | "monochromatic"
    >("analogous");

    // Generate color scheme based on base color and harmony
    const generateScheme = useCallback(
      (color: string, harmonyType: typeof harmony): ColorScheme => {
        // Convert hex to HSL
        const hexToHsl = (hex: string) => {
          const r = parseInt(hex.slice(1, 3), 16) / 255;
          const g = parseInt(hex.slice(3, 5), 16) / 255;
          const b = parseInt(hex.slice(5, 7), 16) / 255;

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
                h = (g - b) / d + (g < b ? 6 : 0);
                break;
              case g:
                h = (b - r) / d + 2;
                break;
              case b:
                h = (r - g) / d + 4;
                break;
            }
            h /= 6;
          }

          return [h * 360, s * 100, l * 100];
        };

        // Convert HSL to hex
        const hslToHex = (h: number, s: number, l: number) => {
          h /= 360;
          s /= 100;
          l /= 100;

          const hue2rgb = (p: number, q: number, t: number) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
          };

          let r, g, b;
          if (s === 0) {
            r = g = b = l;
          } else {
            const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            const p = 2 * l - q;
            r = hue2rgb(p, q, h + 1 / 3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1 / 3);
          }

          const toHex = (c: number) => {
            const hex = Math.round(c * 255).toString(16);
            return hex.length === 1 ? "0" + hex : hex;
          };

          return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
        };

        const [h, s, l] = hexToHsl(color);

        let colors: { primary: string; secondary: string; accent: string };

        switch (harmonyType) {
          case "analogous":
            colors = {
              primary: hslToHex(h, s, l),
              secondary: hslToHex((h + 30) % 360, s, l),
              accent: hslToHex((h - 30 + 360) % 360, s, l),
            };
            break;
          case "complementary":
            colors = {
              primary: hslToHex(h, s, l),
              secondary: hslToHex((h + 180) % 360, s, l),
              accent: hslToHex((h + 180) % 360, s * 0.8, l * 1.2),
            };
            break;
          case "triadic":
            colors = {
              primary: hslToHex(h, s, l),
              secondary: hslToHex((h + 120) % 360, s, l),
              accent: hslToHex((h + 240) % 360, s, l),
            };
            break;
          case "monochromatic":
          default:
            colors = {
              primary: hslToHex(h, s, l),
              secondary: hslToHex(h, s * 0.6, l * 1.1),
              accent: hslToHex(h, s * 0.4, l * 1.3),
            };
            break;
        }

        return {
          ...colors,
          neutral: hslToHex(h, 10, 50),
          success: "hsl(var(--glass-color-success))",
          warning: "hsl(var(--glass-color-warning))",
          error: "hsl(var(--glass-color-danger))",
          info: "hsl(var(--glass-color-primary))",
          background: hslToHex(h, 20, 5),
          surface: hslToHex(h, 15, 10),
          text: hslToHex(h, 10, 95),
        };
      },
      []
    );

    const colorScheme = useMemo(
      () => generateScheme(baseColor, harmony),
      [baseColor, harmony, generateScheme]
    );
    const boundedHeight = maxHeight ?? (compact || contained ? 240 : undefined);

    // Update parent when scheme changes
    React.useEffect(() => {
      onSchemeChange?.(colorScheme);
    }, [colorScheme, onSchemeChange]);

    const handlePredefinedPalette = (
      paletteName: keyof typeof predefinedPalettes
    ) => {
      const paletteColors = predefinedPalettes[paletteName];
      setPalette(paletteName);
      setBaseColor(paletteColors.primary);
    };

    const generateCSSVariables = (scheme: ColorScheme) => {
      return `:root {\n${Object.entries(scheme)
        .map(([key, value]) => `  --color-${key}: ${value};`)
        .join("\n")}\n}`;
    };

    const generateTailwindConfig = (scheme: ColorScheme) => {
      return `module.exports = {\n  theme: {\n    extend: {\n      colors: {\n${Object.entries(
        scheme
      )
        .map(([key, value]) => `        ${key}: '${value}',`)
        .join("\n")}\n      }\n    }\n  }\n}`;
    };

    const exportScheme = (format: "css" | "json" | "tailwind") => {
      let content = "";
      let filename = "";

      switch (format) {
        case "css":
          content = generateCSSVariables(colorScheme);
          filename = "color-scheme.css";
          break;
        case "json":
          content = JSON.stringify(colorScheme, null, 2);
          filename = "color-scheme.json";
          break;
        case "tailwind":
          content = generateTailwindConfig(colorScheme);
          filename = "tailwind.config.js";
          break;
      }

      // Create download
      const blob = new Blob([content], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      onExport?.(colorScheme, format);
    };

    return (
      <div
        ref={ref}
        data-glass-component
        className={cn(
          compact ? "glass-space-y-3" : "space-y-6",
          (compact || contained) && "glass-overflow-auto",
          className
        )}
        style={{
          ...(boundedHeight !== undefined
            ? {
                maxHeight:
                  typeof boundedHeight === "number"
                    ? `${boundedHeight}px`
                    : boundedHeight,
              }
            : null),
          ...(props.style as React.CSSProperties | undefined),
        }}
        data-testid={dataTestId}
        aria-label={ariaLabel || "Color scheme generator"}
        role="region"
        {...props}
      >
        {/* Color Picker Section */}
        <OptimizedGlass
          className="glass-p-6"
          intensity="medium"
          elevation="level1"
        >
          <h3
            className={cn(
              "glass-font-semibold glass-text-primary glass-mb-4",
              compact ? "glass-text-sm" : "glass-text-lg"
            )}
          >
            Base Color
          </h3>

          <div
            className={cn(
              "glass-grid glass-grid-cols-1",
              compact ? "glass-gap-3" : "md:glass-grid-cols-2 glass-gap-6"
            )}
          >
            {/* Color Input */}
            <div className="glass-gap-4">
              <div className="glass-flex glass-items-center glass-gap-4">
                <input
                  type="color"
                  value={normalizeColorInputValue(baseColor)}
                  onChange={(e) => setBaseColor(e.target.value)}
                  className={cn(
                    "glass-radius-lg glass-border-2 glass-border-white/20 glass-cursor-pointer",
                    compact ? "glass-w-10 glass-h-10" : "glass-w-16 glass-h-16"
                  )}
                  aria-label="Base color picker"
                />
                <div>
                  <label className="glass-block glass-text-sm glass-text-primary-opacity-70 glass-mb-1">
                    Hex Color
                  </label>
                  <input
                    type="text"
                    value={baseColor}
                    onChange={(e) => setBaseColor(e.target.value)}
                    className="glass-px-3 glass-py-2 glass-surface-subtle/10 glass-border glass-border-white/20 glass-radius-md glass-text-primary glass-placeholder-white-opacity-50 glass-focus-outline-none focus:glass-border-white/40"
                    placeholder="#0066cc"
                  />
                </div>
              </div>

              {/* Predefined Palettes */}
              {!compact && (
                <div>
                  <label className="glass-block glass-text-sm glass-text-primary-opacity-70 glass-mb-2">
                    Quick Palettes
                  </label>
                  <div className="glass-flex glass-flex-wrap glass-gap-2">
                    {Object.entries(predefinedPalettes).map(
                      ([name, colors]) => (
                        <button
                          key={name}
                          onClick={(e) =>
                            handlePredefinedPalette(
                              name as keyof typeof predefinedPalettes
                            )
                          }
                          className={`glass-px-3 glass-py-2 glass-radius-md glass-text-sm font-medium transition-colors ${
                            palette === name
                              ? "bg-white/20 glass-text-primary"
                              : "bg-white/10 glass-text-primary/70 hover:bg-white/15"
                          }`}
                        >
                          {name.charAt(0).toUpperCase() + name.slice(1)}
                        </button>
                      )
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Harmony Selection */}
            {!compact && (
              <div className="glass-gap-4">
                <div>
                  <label className="glass-block glass-text-sm glass-text-primary-opacity-70 glass-mb-2">
                    Color Harmony
                  </label>
                  <div className="glass-grid glass-grid-cols-2 glass-gap-2">
                    {[
                      { value: "analogous", label: "Analogous" },
                      { value: "complementary", label: "Complementary" },
                      { value: "triadic", label: "Triadic" },
                      { value: "monochromatic", label: "Monochromatic" },
                    ].map(({ value, label }) => (
                      <button
                        key={value}
                        onClick={(e) => setHarmony(value as typeof harmony)}
                        className={`glass-px-3 glass-py-2 glass-radius-md glass-text-sm font-medium transition-colors ${
                          harmony === value
                            ? "bg-white/20 glass-text-primary"
                            : "bg-white/10 glass-text-primary/70 hover:bg-white/15"
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </OptimizedGlass>

        {/* Color Preview */}
        {!compact && (
          <OptimizedGlass
            className="glass-p-6"
            intensity="medium"
            elevation="level1"
          >
            <h3 className="glass-text-lg glass-font-semibold glass-text-primary glass-mb-4">
              Color Scheme Preview
            </h3>

            <div className="glass-grid glass-grid-cols-2 md:glass-grid-cols-4 glass-gap-4">
              {Object.entries(colorScheme).map(([key, color]) => (
                <div key={key} className="glass-gap-2">
                  <div
                    className="glass-w-full glass-h-16 glass-radius-lg glass-border glass-border-white/20"
                    style={{ backgroundColor: color }}
                  />
                  <div className="glass-text-center">
                    <div className="glass-text-xs glass-text-primary-opacity-70 glass-capitalize">
                      {key}
                    </div>
                    <div className="glass-text-xs glass-text-primary-glass-opacity-50 glass-font-mono">
                      {color}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </OptimizedGlass>
        )}

        {/* Export Options */}
        {!compact && (
          <OptimizedGlass
            className="glass-p-6"
            intensity="medium"
            elevation="level1"
          >
            <h3 className="glass-text-lg glass-font-semibold glass-text-primary glass-mb-4">
              Export Options
            </h3>

            <div className="glass-flex glass-flex-wrap glass-gap-3">
              {generateCSS && (
                <button
                  onClick={(e) => exportScheme("css")}
                  className="glass-px-4 glass-py-2 glass-surface-blue/20 glass-text-secondary glass-radius-md hover:glass-surface-blue/30 glass-transition-colors"
                >
                  Export CSS Variables
                </button>
              )}
              {generateTailwind && (
                <button
                  onClick={(e) => exportScheme("tailwind")}
                  className="glass-px-4 glass-py-2 glass-surface-green/20 glass-text-secondary glass-radius-md hover:glass-surface-green/30 glass-transition-colors"
                >
                  Export Tailwind Config
                </button>
              )}
              <button
                onClick={(e) => exportScheme("json")}
                className="glass-px-4 glass-py-2 glass-surface-primary/20 glass-text-secondary glass-radius-md hover:glass-surface-primary/30 glass-transition-colors"
              >
                Export JSON
              </button>
            </div>

            {generateCSS && (
              <div className="glass-mt-4">
                <label className="glass-block glass-text-sm glass-text-primary-opacity-70 glass-mb-2">
                  CSS Variables Preview
                </label>
                <pre className="glass-p-3 glass-surface-dark/20 glass-radius-md glass-text-xs glass-text-primary-glass-opacity-80 glass-overflow-x-auto">
                  <code>{generateCSSVariables(colorScheme)}</code>
                </pre>
              </div>
            )}
          </OptimizedGlass>
        )}
      </div>
    );
  }
);

GlassColorSchemeGenerator.displayName = "GlassColorSchemeGenerator";

export { GlassColorSchemeGenerator };
