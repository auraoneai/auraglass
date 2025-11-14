# AuraGlass Unified API Reference

**Single Source of Truth for Glassmorphism Implementation**

Version: 1.0.0  
Phase: API Lock & Documentation  
Date: 2025-09-09

## Overview

The AuraGlass unified system provides a single, authoritative API for implementing glassmorphism effects across all components. This system eliminates fragmentation and ensures consistency, accessibility, and performance.

## 🎯 Core Philosophy

1. **Single Source of Truth**: All glass values derive from `src/tokens/glass.ts`
2. **Token-Driven**: No hardcoded values anywhere in the system
3. **Always Visible**: Glass effects never fully disappear, only reduce in intensity
4. **WCAG Compliant**: All surfaces meet AA contrast requirements (4.5:1 minimum)
5. **Performance Conscious**: Three-tier system balances quality vs performance

## 📚 Primary API

### `createGlassStyle(options: GlassOptions): CSSProperties`

**The single function for all glass styling needs.**

```typescript
import { createGlassStyle } from "aura-glass/core/mixins/glassMixins";

const glassStyles = createGlassStyle({
  intent: "primary",
  elevation: "level2",
  tier: "high",
});
```

#### Options Interface

```typescript
interface GlassOptions {
  /** Visual intent - affects color theming */
  intent?: "neutral" | "primary" | "success" | "warning" | "danger" | "info";

  /** Elevation level - affects depth and prominence */
  elevation?: "level1" | "level2" | "level3" | "level4";

  /** Performance tier - affects visual quality */
  tier?: "high" | "medium" | "low";

  /** Enable interactive states */
  interactive?: boolean;

  /** Enable hover lift effect */
  hoverLift?: boolean;

  /** Enable focus ring */
  focusRing?: boolean;

  /** Enable ripple effect */
  ripple?: boolean;

  /** Enable touch optimizations */
  touchOptimized?: boolean;

  /** Enable accessibility enhancements */
  a11y?: boolean;
}
```

## 🎨 Intent System

Visual intents provide semantic meaning and appropriate color theming:

| Intent    | Use Case                      | Color Base |
| --------- | ----------------------------- | ---------- |
| `neutral` | Default surfaces, containers  | White/Gray |
| `primary` | Primary actions, highlights   | Blue       |
| `success` | Success states, confirmations | Green      |
| `warning` | Warnings, cautions            | Yellow     |
| `danger`  | Errors, destructive actions   | Red        |
| `info`    | Information, help content     | Blue       |

## 📐 Elevation System

Elevation levels control visual depth and hierarchy:

| Level    | Use Case                            | Blur Intensity | Opacity Range |
| -------- | ----------------------------------- | -------------- | ------------- |
| `level1` | Subtle backgrounds, disabled states | 8-12px         | 0.05-0.15     |
| `level2` | Cards, panels, default surfaces     | 12-18px        | 0.15-0.25     |
| `level3` | Modal dialogs, elevated content     | 18-24px        | 0.25-0.35     |
| `level4` | Tooltips, dropdowns, overlays       | 24-32px        | 0.35-0.45     |

## ⚡ Performance Tier System

Three-tier system optimizes for different device capabilities:

### High Tier

- **Target**: Desktop, high-end mobile
- **Features**: Full blur effects, gradients, animations
- **Blur Range**: 12-32px
- **GPU**: Required

### Medium Tier

- **Target**: Mid-range devices
- **Features**: Reduced complexity, moderate blur
- **Blur Range**: 8-20px
- **GPU**: Preferred

### Low Tier

- **Target**: Low-power devices, battery saving
- **Features**: Minimal effects, reduced blur
- **Blur Range**: 4-12px
- **GPU**: Optional

## 🧩 Usage Examples

### Basic Glass Surface

```typescript
const cardStyles = createGlassStyle({
  intent: "neutral",
  elevation: "level2",
});
```

### Interactive Button

```typescript
const buttonStyles = createGlassStyle({
  intent: "primary",
  elevation: "level2",
  interactive: true,
  hoverLift: true,
  focusRing: true,
});
```

### Modal Dialog

```typescript
const modalStyles = createGlassStyle({
  intent: "neutral",
  elevation: "level4",
  tier: "high",
  a11y: true,
});
```

### Performance-Optimized Mobile

```typescript
const mobileStyles = createGlassStyle({
  intent: "neutral",
  elevation: "level2",
  tier: "low",
  touchOptimized: true,
});
```

## 🎭 CSS Classes Alternative

For convenience, pre-generated CSS classes are available:

```css
.glass-neutral-level2  /* Basic neutral surface */
.glass-primary-level3  /* Primary elevated surface */
.glass-success-level1  /* Success subtle surface */
```

Combined with tier and state classes:

```css
.glass-neutral-level2.glass-tier-high.glass-interactive
```

## 🚫 Deprecated APIs

The following APIs are deprecated and will be removed:

### ❌ Deprecated Functions

```typescript
// DON'T USE - Deprecated
glassBorder({
  /* ... */
});
glassSurface({
  /* ... */
});
interactiveGlass({
  /* ... */
});
createGlassFoundation({
  /* ... */
});

// DO USE - Unified API
createGlassStyle({ intent: "neutral", elevation: "level2" });
```

### ❌ Deprecated CSS Files

- `glassmorphism.css` → Use `glass.generated.css`
- `glass-optimized.css` → Use tier system
- `surfaces.css` → Use unified tokens

### ❌ Deprecated Imports

```typescript
// DON'T USE
import { glassSurface } from "./glassSurface";
import { createGlassMixin } from "./glassMixins";

// DO USE
import { createGlassStyle } from "aura-glass/core/mixins/glassMixins";
```

## 🔧 Token System

All glass values originate from the canonical token schema:

```typescript
// src/tokens/glass.ts
export const AURA_GLASS: AuraGlassTokens = {
  surfaces: {
    neutral: {
      level1: {
        backdropBlur: { px: 8 },
        surface: { base: "rgba(255, 255, 255, 0.08)" },
        border: { color: "rgba(255, 255, 255, 0.2)", width: 1, style: "solid" },
        text: {
          primary: "rgba(255, 255, 255, 0.95)",
          secondary: "rgba(255, 255, 255, 0.75)",
        },
      },
      // ... more levels
    },
    // ... more intents
  },
  performance: {
    high: { blurMultiplier: 1.0, opacityMultiplier: 1.0 },
    medium: { blurMultiplier: 0.8, opacityMultiplier: 0.9 },
    low: { blurMultiplier: 0.6, opacityMultiplier: 0.8 },
  },
};
```

## 🧪 Development Tools

### Runtime Probes

Monitor glass system performance and compliance:

```typescript
import { useGlassProbes } from "aura-glass/hooks/useGlassProbes";

function MyComponent() {
  const { complianceScore, deprecationWarnings } = useGlassProbes({
    monitor: true,
    onComplianceIssue: (result) => {
      console.warn("Glass compliance issue:", result);
    },
  });
}
```

### Visual Testing

Comprehensive test pages for visual validation:

- `reports/glass/visual-tests/comprehensive-test.html`
- Individual tier-specific test pages

### Contrast Testing

WCAG AA compliance validation:

```bash
npm test -- glass-contrast.spec.ts
```

## 🔒 API Stability Guarantees

### Stable APIs (Locked)

- `createGlassStyle(options: GlassOptions)`
- `GlassOptions` interface
- Intent system: `neutral | primary | success | warning | danger | info`
- Elevation system: `level1 | level2 | level3 | level4`
- Tier system: `high | medium | low`

### Generated Assets (Stable)

- `src/styles/glass.generated.css` - CSS custom properties
- Token schema structure in `src/tokens/glass.ts`

### Development Tools (May Evolve)

- Runtime probes interface
- Visual test pages
- Debug utilities

## 📏 Design Constraints

### Performance

- Blur values: 4px minimum, 32px maximum
- Opacity values: 0.05 minimum, 0.45 maximum
- GPU acceleration preferred for tier='high'

### Accessibility

- WCAG AA contrast ratio: 4.5:1 minimum
- Text always readable on glass surfaces
- Focus indicators for interactive elements
- Reduced motion support

### Browser Support

- Backdrop filter: Modern browsers (95%+ support)
- Graceful degradation for unsupported browsers
- WebKit prefix handled automatically

## 🚀 Migration Guide

### From Legacy APIs

```typescript
// Old way
const styles = {
  ...glassSurface,
  ...glassBorder,
  background: "rgba(255, 255, 255, 0.1)",
};

// New way
const styles = createGlassStyle({
  intent: "neutral",
  elevation: "level2",
});
```

### From Hardcoded Values

```typescript
// Old way
const styles = {
  backdropFilter: "blur(16px)",
  background: "rgba(255, 255, 255, 0.15)",
  border: "1px solid rgba(255, 255, 255, 0.2)",
};

// New way
const styles = createGlassStyle({
  intent: "neutral",
  elevation: "level2",
  tier: "high",
});
```

## 🎯 Quality Gates

All glass implementations must pass:

1. **ESLint Rules**: No inline glass styles
2. **Contrast Tests**: WCAG AA compliance
3. **Token Compliance**: All values from canonical source
4. **Performance Tests**: Render time < 16ms
5. **Visual Regression**: Screenshot comparison

## 📞 Support

For questions, issues, or contributions:

1. Check this API reference first
2. Review visual test pages for examples
3. Use runtime probes for debugging
4. Consult token schema for available values

---

_This API reference represents the locked, stable interface for AuraGlass v1.0.0_  
_Generated by AuraGlass Unified Migration System - Phase 6_
