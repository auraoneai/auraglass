#!/usr/bin/env node

/**
 * Simple CSS Generator - Creates glass.generated.css directly from tokens
 * This bypasses TypeScript compilation issues and generates the CSS file directly
 *
 * IMPORTANT: The values below MUST mirror AURA_GLASS in src/tokens/glass.ts.
 * Both share one parametric level scale so they cannot drift per-surface.
 */

const fs = require("fs");
const path = require("path");

// Per-level scale shared by every intent (mirrors src/tokens/glass.ts)
const LEVELS = {
  level1: { blur: 16, shadow: { y: 4, blur: 24 }, highlight: 0.18, glowBlur: 8 },
  level2: { blur: 24, shadow: { y: 8, blur: 32 }, highlight: 0.22, glowBlur: 12 },
  level3: { blur: 32, shadow: { y: 12, blur: 40 }, highlight: 0.25, glowBlur: 16 },
  level4: { blur: 40, shadow: { y: 16, blur: 48 }, highlight: 0.28, glowBlur: 20 },
  level5: { blur: 48, shadow: { y: 20, blur: 56 }, highlight: 0.32, glowBlur: 24 },
};

// Neutral: luminous white frost over a faint smoke scrim (liquid glass look)
const NEUTRAL_LEVELS = {
  level1: { stops: [0.12, 0.04, 0.08], scrim: 0.2, border: 0.16, shadowAlpha: 0.18, glow: 0.1 },
  level2: { stops: [0.14, 0.05, 0.1], scrim: 0.22, border: 0.2, shadowAlpha: 0.22, glow: 0.12 },
  level3: { stops: [0.16, 0.06, 0.11], scrim: 0.24, border: 0.24, shadowAlpha: 0.26, glow: 0.14 },
  level4: { stops: [0.18, 0.07, 0.12], scrim: 0.26, border: 0.28, shadowAlpha: 0.3, glow: 0.16 },
  level5: { stops: [0.2, 0.08, 0.14], scrim: 0.28, border: 0.32, shadowAlpha: 0.34, glow: 0.18 },
};

// Color intents: low-alpha tinted wash with hairline borders
const INTENT_LEVELS = {
  level1: { start: 0.2, end: 0.12, border: 0.35, shadowAlpha: 0.16, glow: 0.12 },
  level2: { start: 0.24, end: 0.15, border: 0.4, shadowAlpha: 0.2, glow: 0.14 },
  level3: { start: 0.28, end: 0.18, border: 0.45, shadowAlpha: 0.24, glow: 0.16 },
  level4: { start: 0.32, end: 0.21, border: 0.5, shadowAlpha: 0.28, glow: 0.18 },
  level5: { start: 0.36, end: 0.24, border: 0.55, shadowAlpha: 0.32, glow: 0.2 },
};

// Color factories: (alpha) => css color string
const INTENT_COLORS = {
  primary: {
    start: (a) => `hsl(var(--glass-color-primary)/${a})`,
    end: (a) => `hsl(var(--glass-color-primary)/${a})`,
    accent: (a) => `hsl(var(--glass-color-primary)/${a})`,
  },
  success: {
    start: (a) => `rgba(34,197,94,${a})`,
    end: (a) => `rgba(22,163,74,${a})`,
    accent: (a) => `rgba(34,197,94,${a})`,
  },
  warning: {
    start: (a) => `hsl(var(--glass-color-warning)/${a})`,
    end: (a) => `rgba(217,119,6,${a})`,
    accent: (a) => `hsl(var(--glass-color-warning)/${a})`,
  },
  danger: {
    start: (a) => `hsl(var(--glass-color-danger)/${a})`,
    end: (a) => `rgba(220,38,38,${a})`,
    accent: (a) => `hsl(var(--glass-color-danger)/${a})`,
  },
  info: {
    start: (a) => `rgba(14,165,233,${a})`,
    end: (a) => `rgba(2,132,199,${a})`,
    accent: (a) => `rgba(14,165,233,${a})`,
  },
};

const TEXT_PRIMARY = "rgba(255,255,255,0.98)";
const TEXT_SECONDARY = "rgba(255,255,255,0.88)";

// Unified backdrop filter modifiers (mirrors glassTokenUtils.buildBackdropFilter)
const BACKDROP_MODIFIERS = "saturate(1.8) brightness(1.05) contrast(1.05)";

function buildShadow(level, shadowColor, glowColor, glowAlpha) {
  const { shadow, highlight, glowBlur } = LEVELS[level];
  return [
    `0 ${shadow.y}px ${shadow.blur}px ${shadowColor}`,
    `inset 0 1px 0 rgba(255,255,255,${highlight})`,
    `inset 0 0 ${glowBlur}px ${glowColor(glowAlpha)}`,
  ].join(", ");
}

function buildTokens() {
  const surfaces = {};

  surfaces.neutral = {};
  Object.entries(NEUTRAL_LEVELS).forEach(([level, spec]) => {
    const [a, b, c] = spec.stops;
    surfaces.neutral[level] = {
      backdropBlur: LEVELS[level].blur,
      surface:
        `linear-gradient(135deg, rgba(255,255,255,${a}) 0%, rgba(255,255,255,${b}) 50%, rgba(255,255,255,${c}) 100%), ` +
        `linear-gradient(rgba(15,23,42,${spec.scrim}), rgba(15,23,42,${spec.scrim}))`,
      border: { color: `rgba(255,255,255,${spec.border})`, width: 1 },
      shadow: buildShadow(
        level,
        `rgba(0,0,0,${spec.shadowAlpha})`,
        (alpha) => `rgba(255,255,255,${alpha})`,
        spec.glow
      ),
      textPrimary: TEXT_PRIMARY,
      textSecondary: TEXT_SECONDARY,
    };
  });

  Object.entries(INTENT_COLORS).forEach(([intent, colors]) => {
    surfaces[intent] = {};
    Object.entries(INTENT_LEVELS).forEach(([level, spec]) => {
      surfaces[intent][level] = {
        backdropBlur: LEVELS[level].blur,
        surface: `linear-gradient(135deg, ${colors.start(spec.start)} 0%, ${colors.end(spec.end)} 100%)`,
        border: { color: colors.accent(spec.border), width: 1 },
        shadow: buildShadow(
          level,
          colors.accent(spec.shadowAlpha),
          colors.accent,
          spec.glow
        ),
        textPrimary: TEXT_PRIMARY,
        textSecondary: TEXT_SECONDARY,
      };
    });
  });

  return {
    surfaces,
    motion: { default: 200, enter: 150, exit: 100 },
    radii: { sm: 10, md: 16, lg: 24, xl: 32, pill: 9999 },
  };
}

const tokens = buildTokens();

function generateCSS() {
  const cssLines = [];

  // Header
  cssLines.push("/* AuraGlass Generated CSS - DO NOT EDIT MANUALLY */");
  cssLines.push(
    "/* Generated from AURA_GLASS tokens in src/tokens/glass.ts */"
  );
  cssLines.push("/* To regenerate: npm run glass:generate-css */");
  cssLines.push("");
  cssLines.push(":root {");
  cssLines.push("  /* === FOUNDATION PROPERTIES === */");

  // Foundation properties
  cssLines.push(`  --glass-motion-default: ${tokens.motion.default}ms;`);
  cssLines.push(`  --glass-motion-enter: ${tokens.motion.enter}ms;`);
  cssLines.push(`  --glass-motion-exit: ${tokens.motion.exit}ms;`);
  cssLines.push("");

  // Radii
  Object.entries(tokens.radii).forEach(([key, value]) => {
    cssLines.push(`  --glass-radius-${key}: ${value}px;`);
  });
  cssLines.push("");

  // Surface properties for each intent and elevation
  const intents = Object.keys(tokens.surfaces);
  const elevations = Object.keys(tokens.surfaces.neutral);

  intents.forEach((intent) => {
    cssLines.push(`  /* === ${intent.toUpperCase()} SURFACES === */`);
    elevations.forEach((elevation) => {
      const surface = tokens.surfaces[intent][elevation];
      const prefix = `--glass-${intent}-${elevation}`;

      cssLines.push(`  ${prefix}-surface: ${surface.surface};`);
      cssLines.push(`  ${prefix}-border-color: ${surface.border.color};`);
      cssLines.push(`  ${prefix}-border-width: ${surface.border.width}px;`);
      cssLines.push(`  ${prefix}-border-style: solid;`);
      cssLines.push(`  ${prefix}-blur: ${surface.backdropBlur}px;`);
      cssLines.push(`  ${prefix}-shadow: ${surface.shadow};`);
      cssLines.push(`  ${prefix}-text-primary: ${surface.textPrimary};`);
      cssLines.push(`  ${prefix}-text-secondary: ${surface.textSecondary};`);
    });
    cssLines.push("");
  });

  cssLines.push("}");
  cssLines.push("");

  // Utility classes
  cssLines.push("/* === GENERATED UTILITY CLASSES === */");
  cssLines.push("");

  intents.forEach((intent) => {
    elevations.forEach((elevation) => {
      const className = `.glass-${intent}-${elevation}`;
      cssLines.push(`${className} {`);
      cssLines.push(
        `  background: var(--glass-${intent}-${elevation}-surface);`
      );
      cssLines.push(
        `  border: var(--glass-${intent}-${elevation}-border-width) var(--glass-${intent}-${elevation}-border-style) var(--glass-${intent}-${elevation}-border-color);`
      );
      cssLines.push(
        `  backdrop-filter: blur(var(--glass-${intent}-${elevation}-blur)) ${BACKDROP_MODIFIERS};`
      );
      cssLines.push(
        `  -webkit-backdrop-filter: blur(var(--glass-${intent}-${elevation}-blur)) ${BACKDROP_MODIFIERS};`
      );
      cssLines.push(
        `  box-shadow: var(--glass-${intent}-${elevation}-shadow);`
      );
      cssLines.push(
        `  color: var(--glass-${intent}-${elevation}-text-primary);`
      );
      cssLines.push(`  border-radius: var(--glass-radius-md);`);
      cssLines.push(`  transition: all var(--glass-motion-default) ease-out;`);
      cssLines.push(`  position: relative;`);
      cssLines.push(`  transform: translateZ(0);`);
      cssLines.push("}");
      cssLines.push("");
    });
  });

  // Accessibility and fallbacks
  cssLines.push("/* === ACCESSIBILITY & FALLBACKS === */");
  cssLines.push("");
  cssLines.push("@media (prefers-reduced-motion: reduce) {");
  cssLines.push('  [class*="glass-"] {');
  cssLines.push("    transition: none !important;");
  cssLines.push("    animation: none !important;");
  cssLines.push("  }");
  cssLines.push("}");
  cssLines.push("");
  cssLines.push("@supports not (backdrop-filter: blur(0)) {");
  cssLines.push('  [class*="glass-"] {');
  cssLines.push("    background: rgba(0, 0, 0, 0.85) !important;");
  cssLines.push("    backdrop-filter: none !important;");
  cssLines.push("    -webkit-backdrop-filter: none !important;");
  cssLines.push("  }");
  cssLines.push("}");

  return cssLines.join("\n");
}

function main() {
  console.log("🔄 Generating glass.generated.css from tokens...");

  const cssContent = generateCSS();
  const outputPath = path.join(
    __dirname,
    "..",
    "src",
    "styles",
    "glass.generated.css"
  );

  try {
    fs.writeFileSync(outputPath, cssContent, "utf8");
    console.log(`✅ Successfully generated ${outputPath}`);
    console.log(`   File size: ${(cssContent.length / 1024).toFixed(1)} KB`);

    // Count properties
    const propertyCount = (cssContent.match(/--glass-/g) || []).length;
    console.log(`   Properties generated: ${propertyCount}`);
  } catch (error) {
    console.error(`❌ Failed to write CSS file: ${error}`);
    process.exit(1);
  }

  console.log("🎉 CSS generation completed successfully!");
}

// Execute if called directly
if (require.main === module) {
  main();
}
