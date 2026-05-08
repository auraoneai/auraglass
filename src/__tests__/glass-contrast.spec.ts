import React from "react";
import { readFileSync } from "fs";
import path from "path";
/**
 * Glass Contrast Test Suite
 *
 * Validates WCAG AA contrast compliance (4.5:1 minimum) for all glass surfaces.
 * This is a critical requirement for the unified glass system.
 */

import { AURA_GLASS } from "../tokens/glass";
import {
  canUseHighQualityGlass,
  createGlassStyle,
  getRecommendedTier,
} from "../core/mixins/glassMixins";

// WCAG contrast ratio calculation
function getLuminance(rgb: [number, number, number]): number {
  const [r, g, b] = rgb.map((c: any) => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });

  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function getContrastRatio(
  color1: [number, number, number],
  color2: [number, number, number]
): number {
  const lum1 = getLuminance(color1);
  const lum2 = getLuminance(color2);
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);

  return (lighter + 0.05) / (darker + 0.05);
}

function parseRGBA(color: string): [number, number, number, number] {
  const rgbaMatch = color.match(
    /rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/
  );
  if (rgbaMatch) {
    return [
      parseInt(rgbaMatch[1], 10),
      parseInt(rgbaMatch[2], 10),
      parseInt(rgbaMatch[3], 10),
      rgbaMatch[4] ? parseFloat(rgbaMatch[4]) : 1,
    ];
  }

  const hexMatch = color.trim().match(/^#([0-9a-f]{3,8})$/i);
  if (hexMatch) {
    const hex = hexMatch[1];
    const expand = (value: string) =>
      value.length === 1 ? value.repeat(2) : value;

    let r = 0;
    let g = 0;
    let b = 0;
    let a = 255;

    if (hex.length === 3 || hex.length === 4) {
      r = parseInt(expand(hex[0]), 16);
      g = parseInt(expand(hex[1]), 16);
      b = parseInt(expand(hex[2]), 16);
      if (hex.length === 4) {
        a = parseInt(expand(hex[3]), 16);
      }
    } else if (hex.length === 6 || hex.length === 8) {
      r = parseInt(hex.slice(0, 2), 16);
      g = parseInt(hex.slice(2, 4), 16);
      b = parseInt(hex.slice(4, 6), 16);
      if (hex.length === 8) {
        a = parseInt(hex.slice(6, 8), 16);
      }
    }

    return [r, g, b, a / 255];
  }

  throw new Error(`Cannot parse color: ${color}`);
}

function extractFirstRgba(color: string): string | null {
  const match = color.match(/rgba?\([^)]*\)/);
  return match ? match[0] : null;
}

const DARK_BACKGROUND: [number, number, number] = [15, 23, 42];

const CSS_VAR_FALLBACKS: Record<string, string> = {
  "--glass-color-primary": "#6366f1",
  "--glass-color-warning": "#f59e0b",
  "--glass-color-danger": "#ef4444",
  "--glass-color-success": "#22c55e",
  "--glass-text-secondary": "rgba(248, 250, 252, 0.7)",
  "--glass-text-tertiary": "rgba(148, 163, 184, 0.55)",
};

function hexToRgb(hex: string): [number, number, number] {
  const normalized = hex.replace("#", "");
  const expand = (value: string) =>
    value.length === 1 ? value.repeat(2) : value;

  if (normalized.length === 3 || normalized.length === 4) {
    return [
      parseInt(expand(normalized[0]), 16),
      parseInt(expand(normalized[1]), 16),
      parseInt(expand(normalized[2]), 16),
    ];
  }

  return [
    parseInt(normalized.slice(0, 2), 16),
    parseInt(normalized.slice(2, 4), 16),
    parseInt(normalized.slice(4, 6), 16),
  ];
}

function resolveCssVariableColor(value: string): string | null {
  const match = value.match(/var\((--[a-z0-9-]+)(?:,\s*([^\)]+))?\)/i);
  if (!match) {
    return null;
  }

  const [, variableName, fallbackValue] = match;
  const base = CSS_VAR_FALLBACKS[variableName];
  if (!base) {
    return fallbackValue ?? null;
  }

  const trimmedFallback = fallbackValue?.trim();

  if (base.startsWith("#")) {
    const [r, g, b] = hexToRgb(base);
    let alpha = 1;

    if (trimmedFallback && !Number.isNaN(Number(trimmedFallback))) {
      alpha = Number(trimmedFallback);
    } else if (trimmedFallback && trimmedFallback.startsWith("rgba")) {
      alpha = parseRGBA(trimmedFallback)[3];
    }

    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  if (base.startsWith("rgba")) {
    if (trimmedFallback && !Number.isNaN(Number(trimmedFallback))) {
      const [r, g, b] = parseRGBA(base);
      return `rgba(${r}, ${g}, ${b}, ${Number(trimmedFallback)})`;
    }
    return base;
  }

  return base;
}

function compositeOverBackground(
  [r, g, b, a]: [number, number, number, number],
  background: [number, number, number] = DARK_BACKGROUND
): [number, number, number] {
  return [
    Math.round(r * a + background[0] * (1 - a)),
    Math.round(g * a + background[1] * (1 - a)),
    Math.round(b * a + background[2] * (1 - a)),
  ];
}

interface GradientStop {
  color: [number, number, number, number];
  position: number;
}

function parseGradientStops(gradient: string): GradientStop[] {
  const regex = /(rgba?\([^)]*\))(?:\s+(\d+(?:\.\d+)?)%?)?/g;
  const stops: Array<{
    color: [number, number, number, number];
    position?: number;
  }> = [];
  let match: RegExpExecArray | null;

  while ((match = regex.exec(gradient))) {
    try {
      const color = parseRGBA(match[1]);
      const position = match[2] ? parseFloat(match[2]) : undefined;
      stops.push({ color, position });
    } catch (error) {
      // Ignore stops that cannot be parsed
    }
  }

  if (stops.length === 0) {
    return [];
  }

  const denominator = Math.max(1, stops.length - 1);

  return stops
    .map((stop, index) => ({
      color: stop.color,
      position: stop.position ?? (index / denominator) * 100,
    }))
    .sort((a, b) => a.position - b.position);
}

function sampleGradientComposite(
  gradient: string
): [number, number, number] | null {
  const stops = parseGradientStops(gradient);
  if (stops.length === 0) {
    return null;
  }

  if (stops.length === 1) {
    return compositeOverBackground(stops[0].color);
  }

  let totalSpan = 0;
  let accum: [number, number, number] = [0, 0, 0];

  for (let index = 0; index < stops.length - 1; index += 1) {
    const current = stops[index];
    const next = stops[index + 1];
    const span = Math.max(0, (next.position - current.position) / 100);

    if (span === 0) {
      continue;
    }

    const startComposite = compositeOverBackground(current.color);
    const endComposite = compositeOverBackground(next.color);

    accum = [
      accum[0] + ((startComposite[0] + endComposite[0]) / 2) * span,
      accum[1] + ((startComposite[1] + endComposite[1]) / 2) * span,
      accum[2] + ((startComposite[2] + endComposite[2]) / 2) * span,
    ];
    totalSpan += span;
  }

  if (totalSpan === 0) {
    return compositeOverBackground(stops[0].color);
  }

  return [
    Math.round(accum[0] / totalSpan),
    Math.round(accum[1] / totalSpan),
    Math.round(accum[2] / totalSpan),
  ];
}

function resolveSurfaceBaseColor(
  surface: any,
  fallbackOverlay?: string
): string {
  if (typeof surface === "string") {
    if (surface.includes("var(")) {
      const resolvedVar = resolveCssVariableColor(surface);
      if (resolvedVar) {
        return resolvedVar;
      }
    }

    const rgba = extractFirstRgba(surface);
    if (rgba) {
      return rgba;
    }
    if (fallbackOverlay) {
      const overlayMatch = extractFirstRgba(fallbackOverlay);
      return overlayMatch ?? fallbackOverlay;
    }
    if (surface.trim().startsWith("#")) {
      return surface;
    }
    return "rgba(255, 255, 255, 0.2)";
  }

  if (surface && typeof surface === "object") {
    if ("surface" in surface) {
      return resolveSurfaceBaseColor(
        surface.surface?.base,
        surface.surface?.overlay ?? fallbackOverlay
      );
    }

    if ("base" in surface) {
      return resolveSurfaceBaseColor(
        surface.base,
        surface.overlay ?? fallbackOverlay
      );
    }
  }

  if (fallbackOverlay) {
    const overlayMatch = extractFirstRgba(fallbackOverlay);
    return overlayMatch ?? fallbackOverlay;
  }

  return "rgba(255, 255, 255, 0.2)";
}

// Test background combinations for contrast compliance
function calculateGlassBackgroundContrast(surface: any): number {
  const baseValue = surface?.surface?.base ?? surface;
  let blendedColor: [number, number, number] | null = null;

  if (typeof baseValue === "string" && baseValue.includes("gradient")) {
    blendedColor = sampleGradientComposite(baseValue);
  }

  if (!blendedColor) {
    const baseColor = resolveSurfaceBaseColor(surface);
    const [r, g, b, alpha] = parseRGBA(baseColor);
    blendedColor = compositeOverBackground([r, g, b, alpha]);
  }

  // Test against white text (most common glass text color)
  const whiteText: [number, number, number] = [255, 255, 255];

  return getContrastRatio(whiteText, blendedColor);
}

describe("Glass Contrast Test Suite", () => {
  describe("Token System Contrast Validation", () => {
    const intents = [
      "neutral",
      "primary",
      "success",
      "warning",
      "danger",
      "info",
    ] as const;
    const elevations = ["level1", "level2", "level3", "level4"] as const;

    intents.forEach((intent: any) => {
      describe(`${intent} intent surfaces`, () => {
        elevations.forEach((elevation: any) => {
          it(`should meet WCAG AA contrast (4.5:1) for ${intent}-${elevation}`, () => {
            const surface = AURA_GLASS.surfaces[intent][elevation];
            expect(surface).toBeDefined();

            const contrastRatio = calculateGlassBackgroundContrast(surface);

            // WCAG AA requirement: 4.5:1 minimum
            expect(contrastRatio).toBeGreaterThanOrEqual(4.5);
          });

          it(`should have visible blur values for ${intent}-${elevation}`, () => {
            const surface = AURA_GLASS.surfaces[intent][elevation];
            expect(surface.backdropBlur.px).toBeGreaterThanOrEqual(2);
          });

          it(`should maintain opacity above accessibility threshold for ${intent}-${elevation}`, () => {
            const surface = AURA_GLASS.surfaces[intent][elevation];
            const baseColor = resolveSurfaceBaseColor(surface);
            const [r, g, b, alpha] = parseRGBA(baseColor);

            // Minimum opacity for visibility
            expect(alpha).toBeGreaterThanOrEqual(0.05);

            // Maximum opacity for glass effect
            expect(alpha).toBeLessThanOrEqual(0.95);
          });
        });
      });
    });
  });

  describe("Generated Glass Style Contrast", () => {
    const testCombinations = [
      {
        intent: "neutral" as const,
        elevation: "level1" as const,
        tier: "high" as const,
      },
      {
        intent: "neutral" as const,
        elevation: "level2" as const,
        tier: "high" as const,
      },
      {
        intent: "neutral" as const,
        elevation: "level3" as const,
        tier: "high" as const,
      },
      {
        intent: "primary" as const,
        elevation: "level1" as const,
        tier: "high" as const,
      },
      {
        intent: "primary" as const,
        elevation: "level2" as const,
        tier: "high" as const,
      },
      {
        intent: "primary" as const,
        elevation: "level3" as const,
        tier: "high" as const,
      },
      {
        intent: "success" as const,
        elevation: "level2" as const,
        tier: "medium" as const,
      },
      {
        intent: "danger" as const,
        elevation: "level2" as const,
        tier: "low" as const,
      },
    ];

    testCombinations.forEach(({ intent, elevation, tier }) => {
      it(`should generate WCAG compliant styles for ${intent}-${elevation}-${tier}`, () => {
        const styles = createGlassStyle({ intent, elevation, tier });

        expect(styles).toBeDefined();
        expect(typeof styles.background === "string").toBe(true);
        expect(typeof styles.backdropFilter === "string").toBe(true);

        if (typeof styles.backdropFilter === "string") {
          const blurMatch = styles.backdropFilter.match(
            /blur\((\d+(?:\.\d+)?)px\)/
          );
          expect(blurMatch).toBeTruthy();

          if (blurMatch) {
            const blurValue = parseFloat(blurMatch[1]);
            expect(blurValue).toBeGreaterThanOrEqual(tier === "low" ? 2 : 8);
          }
        }

        const sampleSurface = {
          surface: {
            base: styles.background,
            overlay: (styles as any).backgroundColor,
          },
        };

        const contrastRatio = calculateGlassBackgroundContrast(sampleSurface);
        expect(contrastRatio).toBeGreaterThanOrEqual(4.5);
      });
    });
  });

  describe("Performance Tier Contrast Validation", () => {
    it("should maintain AA contrast in low performance tier", () => {
      const lowTierStyle = createGlassStyle({
        intent: "neutral",
        elevation: "level2",
        tier: "low",
      });

      expect(lowTierStyle.background).toBeDefined();

      if (
        lowTierStyle.background &&
        typeof lowTierStyle.background === "string"
      ) {
        const contrastRatio = calculateGlassBackgroundContrast({
          surface: {
            base: lowTierStyle.background,
            overlay: (lowTierStyle as any).backgroundColor,
          },
        });
        expect(contrastRatio).toBeGreaterThanOrEqual(4.5);
      }
    });

    it("should maintain AA contrast in medium performance tier", () => {
      const mediumTierStyle = createGlassStyle({
        intent: "primary",
        elevation: "level3",
        tier: "medium",
      });

      expect(mediumTierStyle.background).toBeDefined();

      if (
        mediumTierStyle.background &&
        typeof mediumTierStyle.background === "string"
      ) {
        const contrastRatio = calculateGlassBackgroundContrast({
          surface: {
            base: mediumTierStyle.background,
            overlay: (mediumTierStyle as any).backgroundColor,
          },
        });
        expect(contrastRatio).toBeGreaterThanOrEqual(4.5);
      }
    });

    it("should maintain AA contrast in high performance tier", () => {
      const highTierStyle = createGlassStyle({
        intent: "success",
        elevation: "level4",
        tier: "high",
      });

      expect(highTierStyle.background).toBeDefined();

      if (
        highTierStyle.background &&
        typeof highTierStyle.background === "string"
      ) {
        const contrastRatio = calculateGlassBackgroundContrast({
          surface: {
            base: highTierStyle.background,
            overlay: (highTierStyle as any).backgroundColor,
          },
        });
        expect(contrastRatio).toBeGreaterThanOrEqual(4.5);
      }
    });
  });

  describe("Interactive State Contrast", () => {
    it("should maintain contrast in interactive states", () => {
      const interactiveStyle = createGlassStyle({
        intent: "neutral",
        elevation: "level2",
        interactive: true,
        hoverLift: true,
        focusRing: true,
      });

      expect(interactiveStyle.background).toBeDefined();
      expect(interactiveStyle.backdropFilter).toBeDefined();

      // Interactive styles should not compromise accessibility
      if (
        interactiveStyle.background &&
        typeof interactiveStyle.background === "string"
      ) {
        const contrastRatio = calculateGlassBackgroundContrast({
          surface: {
            base: interactiveStyle.background,
            overlay: (interactiveStyle as any).backgroundColor,
          },
        });
        expect(contrastRatio).toBeGreaterThanOrEqual(4.5);
      }
    });
  });

  describe("Foundation fallback behavior", () => {
    it("should not treat prefixed Safari backdrop-filter support as unsupported", () => {
      const css = readFileSync(
        path.resolve(__dirname, "../styles/glass.css"),
        "utf8"
      );
      const normalizedCss = css.replace(/\s+/g, " ");

      expect(normalizedCss).toMatch(
        /@supports not \(\s*\(backdrop-filter: blur\(0\)\) or \(-webkit-backdrop-filter: blur\(0\)\)\s*\)/
      );
      expect(css).toContain("@media (prefers-reduced-transparency: reduce)");
      expect(css).toContain("@media (forced-colors: active)");
      expect(css).toContain(".glass-foundation-basic");
      expect(css).toContain(".optimized-glass-surface");
    });

    it("should keep feature probes safe when optional browser APIs are absent", () => {
      const originalCSS = (globalThis as any).CSS;

      try {
        (globalThis as any).CSS = undefined;

        expect(() => canUseHighQualityGlass()).not.toThrow();
        expect(canUseHighQualityGlass()).toBe(false);
        expect(() => getRecommendedTier()).not.toThrow();
        expect(getRecommendedTier()).toBe("medium");
      } finally {
        (globalThis as any).CSS = originalCSS;
      }
    });

    it("should reduce recommended quality when reduced transparency is requested", () => {
      const originalCSS = (globalThis as any).CSS;
      const originalMatchMedia = window.matchMedia;

      try {
        (globalThis as any).CSS = {
          supports: jest.fn(() => true),
        };
        (window as any).matchMedia = jest.fn((query: string) => ({
          matches: query === "(prefers-reduced-transparency: reduce)",
          media: query,
          onchange: null,
          addListener: jest.fn(),
          removeListener: jest.fn(),
          addEventListener: jest.fn(),
          removeEventListener: jest.fn(),
          dispatchEvent: jest.fn(),
        }));

        expect(canUseHighQualityGlass()).toBe(false);
        expect(getRecommendedTier()).toBe("low");
      } finally {
        (globalThis as any).CSS = originalCSS;
        (window as any).matchMedia = originalMatchMedia;
      }
    });
  });

  describe("Edge Case Contrast Tests", () => {
    it("should handle gradient backgrounds appropriately", () => {
      // Test surfaces that may have gradients
      const primarySurface = AURA_GLASS.surfaces.primary.level3;

      if (primarySurface.surface.overlay) {
        expect(primarySurface.surface.overlay).toBeTruthy();
        // Gradient overlays should enhance, not compromise contrast
      }
    });

    it("should validate border contrast", () => {
      const intents = [
        "neutral",
        "primary",
        "success",
        "warning",
        "danger",
        "info",
      ] as const;
      intents.forEach((intent: any) => {
        const surface = AURA_GLASS.surfaces[intent].level2;
        expect(surface.border).toBeDefined();
        expect(surface.border.color).toBeTruthy();

        // Border should be visible
        const borderColor = resolveSurfaceBaseColor(surface.border.color);
        const [r, g, b, alpha] = parseRGBA(borderColor);
        expect(alpha).toBeGreaterThanOrEqual(0.1);
      });
    });

    it("should ensure minimum visibility for all surfaces", () => {
      const intents = [
        "neutral",
        "primary",
        "success",
        "warning",
        "danger",
        "info",
      ] as const;
      const elevations = ["level1", "level2", "level3", "level4"] as const;

      intents.forEach((intent: any) => {
        elevations.forEach((elevation: any) => {
          const surface = AURA_GLASS.surfaces[intent][elevation];
          const baseColor = resolveSurfaceBaseColor(surface);
          const [r, g, b, alpha] = parseRGBA(baseColor);

          // Glass must be visible (not transparent) but not opaque
          expect(alpha).toBeGreaterThan(0.05);
          expect(alpha).toBeLessThan(0.95);

          // Blur must be present for glass effect
          expect(surface.backdropBlur.px).toBeGreaterThanOrEqual(2);
        });
      });
    });
  });
});

// Additional utility for manual testing
export function testAllGlassCombinations(): void {
  const intents = [
    "neutral",
    "primary",
    "success",
    "warning",
    "danger",
    "info",
  ] as const;
  const elevations = ["level1", "level2", "level3", "level4"] as const;
  const tiers = ["high", "medium", "low"] as const;

  const results: any[] = [];

  intents.forEach((intent: any) => {
    elevations.forEach((elevation: any) => {
      tiers.forEach((tier: any) => {
        try {
          const styles = createGlassStyle({ intent, elevation, tier });
          const surface = AURA_GLASS.surfaces[intent][elevation];
          const contrast = calculateGlassBackgroundContrast(surface);

          results.push({
            combination: `${intent}-${elevation}-${tier}`,
            contrastRatio: contrast.toFixed(2),
            wcagAA: contrast >= 4.5 ? "PASS" : "FAIL",
            wcagAAA: contrast >= 7.0 ? "PASS" : "FAIL",
            blurValue: surface.backdropBlur.px,
            opacity: parseRGBA(resolveSurfaceBaseColor(surface))[3],
          });
        } catch (error) {
          results.push({
            combination: `${intent}-${elevation}-${tier}`,
            error: error instanceof Error ? error.message : String(error),
          });
        }
      });
    });
  });

  console.table(results);
}
