# AuraGlass Design Token Reference

## Overview

This document provides a complete reference for all design tokens in the AuraGlass system. Design tokens are the visual design atoms that store visual design decisions and are the foundation of consistent, world-class glassmorphism experiences.

## Persona Token Schema

The canonical source for persona-specific tokens lives in `src/theme/designMatrix.ts`. Each persona implements the following structure:

```ts
interface PersonaConfig {
  meta: PersonaMetadata;              // Narrative, palette anchor, motion callouts
  colors: PersonaColorTokens;         // Background, text, accent, state, focus, shadow
  typography: PersonaTypographyScale; // Display → caption ladder with weight/size/letter spacing
  spacing: PersonaSpacing;            // Base grid, radii, blur depth, layout pattern
  motion: PersonaMotionDurations;     // Entry, hover, focus, async timing (ms strings)
}
```

### Contribution Guidelines

1. Update or add personas exclusively through `DESIGN_MATRIX` to keep docs, CSS, and runtime hooks in sync.
2. Preserve existing `PersonaId` keys (kebab-case) and extend types when new fields are required.
3. Validate changes by running `npm run typecheck` (types) and the persona CSS generation script (added in Workstream 3).
4. Avoid hard-coded values elsewhere—import helpers from `src/theme/designMatrix.ts` when consuming persona data.

#### Generation Commands

- `npm run glass:generate-persona-css` – Emit `src/styles/generated/persona-variables.css` from `DESIGN_MATRIX`.
- `npm run glass:validate-persona-css` – Verify the committed CSS matches the design matrix (recommended in CI).

## 🎯 Token Philosophy

### Token-First Architecture
Every visual design decision in AuraGlass is represented by a design token:

```css
/* ❌ Bad: Hardcoded values */
.my-component {
  backdrop-filter: blur(16px);
  box-shadow: 0 4px 16px rgba(0,0,0,0.16);
  border-radius: 12px;
  padding: 16px;
}

/* ✅ Good: Token-based design */
.my-component {
  backdrop-filter: blur(var(--glass-blur-lg));
  box-shadow: var(--glass-elev-2);
  border-radius: var(--glass-radius-lg);
  padding: var(--glass-space-4);
}
```

### Semantic Naming
Tokens use semantic names that describe their purpose, not their visual properties:

```css
/* ❌ Avoid: Visual naming */
--glass-shadow-16px
--glass-blue-300

/* ✅ Prefer: Semantic naming */
--glass-elev-level2
--glass-color-primary
```

## 🎨 Color Tokens

### Base Colors
Foundational colors using RGB values for maximum flexibility:

```css
:root {
  /* Base color values (RGB without alpha) */
  --glass-color-white: 255 255 255;
  --glass-color-black: 0 0 0;
  --glass-color-transparent: transparent;
  
  /* Primary brand colors (HSL format) */
  --glass-color-primary: 217 91% 60%;      /* Blue-500 equivalent */
  --glass-color-primary-dark: 217 91% 45%; /* Darker variant */
  --glass-color-primary-light: 217 91% 75%; /* Lighter variant */
}
```

### Semantic Color Tokens
Purpose-driven color assignments:

```css
:root {
  /* Intent-based colors */
  --glass-color-success: 160 84% 39%;    /* Green-600 */
  --glass-color-warning: 38 92% 50%;     /* Amber-500 */
  --glass-color-danger: 0 84% 60%;       /* Red-500 */
  --glass-color-info: 199 89% 48%;       /* Cyan-500 */
  
  /* Neutral colors */
  --glass-color-neutral: 220 14% 96%;    /* Gray-50 */
  --glass-color-neutral-dark: 220 13% 18%; /* Gray-800 */
  --glass-color-muted: 220 9% 46%;       /* Gray-500 */
}
```

### Usage Patterns
How to apply color tokens in different contexts:

```css
/* Text colors */
.glass-text-primary { color: rgba(var(--glass-color-white) / 0.95); }
.glass-text-secondary { color: rgba(var(--glass-color-white) / 0.75); }
.glass-text-muted { color: rgba(var(--glass-color-white) / 0.55); }
.glass-text-success { color: hsl(var(--glass-color-success)); }
.glass-text-danger { color: hsl(var(--glass-color-danger)); }

/* Surface colors with opacity */
.glass-surface-primary { background: rgba(var(--glass-color-white) / 0.1); }
.glass-surface-secondary { background: rgba(var(--glass-color-white) / 0.05); }
.glass-surface-success { background: hsl(var(--glass-color-success) / 0.1); }

/* Border colors */
.glass-border-primary { border-color: rgba(var(--glass-color-white) / 0.2); }
.glass-border-subtle { border-color: rgba(var(--glass-color-white) / 0.1); }
```

## 🌫️ Blur Scale Tokens

Consistent blur levels for glassmorphism effects:

```css
:root {
  /* Blur scale (Progressive blur levels) */
  --glass-blur-none: 0px;      /* No blur - disabled states */
  --glass-blur-sm: 4px;        /* Subtle blur - badges, chips */
  --glass-blur-md: 8px;        /* Standard blur - cards, buttons */
  --glass-blur-lg: 16px;       /* Strong blur - modals, overlays */
  --glass-blur-xl: 24px;       /* Heavy blur - backdrops */
  --glass-blur-2xl: 32px;      /* Maximum blur - full overlays */
  --glass-blur-3xl: 48px;      /* Ultra blur - special effects */
}
```

### Blur Usage Guidelines

| Token | Value | Use Cases | Components |
|-------|-------|-----------|------------|
| `--glass-blur-none` | 0px | Disabled states, flat surfaces | Disabled buttons |
| `--glass-blur-sm` | 4px | Subtle effects, micro-interactions | Badges, chips |
| `--glass-blur-md` | 8px | Standard glass effects | Cards, inputs |
| `--glass-blur-lg` | 16px | Prominent glass effects | Modals, dropdowns |
| `--glass-blur-xl` | 24px | Strong backdrop effects | Full modals |
| `--glass-blur-2xl` | 32px | Maximum practical blur | Loading overlays |
| `--glass-blur-3xl` | 48px | Special artistic effects | Hero sections |

## 📐 Elevation System Tokens

Semantic shadow system for visual hierarchy:

```css
:root {
  /* Elevation levels (Semantic naming) */
  --glass-elev-0: none;
  --glass-elev-1: 0 2px 8px rgba(var(--glass-color-black) / 0.12);
  --glass-elev-2: 0 4px 16px rgba(var(--glass-color-black) / 0.16);
  --glass-elev-3: 0 8px 24px rgba(var(--glass-color-black) / 0.20);
  --glass-elev-4: 0 12px 32px rgba(var(--glass-color-black) / 0.24);
  --glass-elev-5: 0 16px 40px rgba(var(--glass-color-black) / 0.28);
  --glass-elev-6: 0 24px 56px rgba(var(--glass-color-black) / 0.32);
}
```

### Elevation Semantic Mapping

```css
/* Semantic elevation aliases (Preferred) */
:root {
  --glass-elev-flat: var(--glass-elev-0);         /* Flat surface */
  --glass-elev-subtle: var(--glass-elev-1);       /* Badges, chips */
  --glass-elev-interactive: var(--glass-elev-2);  /* Buttons, cards */
  --glass-elev-overlay: var(--glass-elev-3);      /* Dropdowns */
  --glass-elev-floating: var(--glass-elev-4);     /* FABs, tooltips */
  --glass-elev-modal: var(--glass-elev-5);        /* Modals */
  --glass-elev-maximum: var(--glass-elev-6);      /* System overlays */
}
```

## 📏 Spacing System Tokens

4px grid-based spacing system:

```css
:root {
  /* Base spacing scale (4px grid) */
  --glass-space-0: 0px;
  --glass-space-px: 1px;
  --glass-space-0-5: 0.125rem;  /* 2px */
  --glass-space-1: 0.25rem;     /* 4px */
  --glass-space-1-5: 0.375rem;  /* 6px */
  --glass-space-2: 0.5rem;      /* 8px */
  --glass-space-2-5: 0.625rem;  /* 10px */
  --glass-space-3: 0.75rem;     /* 12px */
  --glass-space-3-5: 0.875rem;  /* 14px */
  --glass-space-4: 1rem;        /* 16px */
  --glass-space-5: 1.25rem;     /* 20px */
  --glass-space-6: 1.5rem;      /* 24px */
  --glass-space-7: 1.75rem;     /* 28px */
  --glass-space-8: 2rem;        /* 32px */
  --glass-space-9: 2.25rem;     /* 36px */
  --glass-space-10: 2.5rem;     /* 40px */
  --glass-space-11: 2.75rem;    /* 44px */
  --glass-space-12: 3rem;       /* 48px */
  --glass-space-14: 3.5rem;     /* 56px */
  --glass-space-16: 4rem;       /* 64px */
  --glass-space-20: 5rem;       /* 80px */
  --glass-space-24: 6rem;       /* 96px */
  --glass-space-28: 7rem;       /* 112px */
  --glass-space-32: 8rem;       /* 128px */
}
```

### Spacing Usage Examples

```css
/* Component spacing using tokens */
.glass-button {
  padding: var(--glass-space-3) var(--glass-space-4); /* 12px 16px */
  margin-bottom: var(--glass-space-6); /* 24px */
}

.glass-card {
  padding: var(--glass-space-6); /* 24px */
  margin: var(--glass-space-8) var(--glass-space-4); /* 32px 16px */
}

.glass-modal {
  padding: var(--glass-space-8); /* 32px */
  gap: var(--glass-space-4); /* 16px */
}
```

## 🔘 Border Radius Tokens

Glass-optimized radius values:

```css
:root {
  /* Border radius scale (Glass-optimized) */
  --glass-radius-none: 0px;
  --glass-radius-sm: 0.5rem;    /* 8px - Larger than Tailwind's 2px */
  --glass-radius-md: 0.75rem;   /* 12px - Larger than Tailwind's 6px */
  --glass-radius-lg: 1rem;      /* 16px - Larger than Tailwind's 8px */
  --glass-radius-xl: 1.25rem;   /* 20px - Larger than Tailwind's 12px */
  --glass-radius-2xl: 1.5rem;   /* 24px - Larger than Tailwind's 16px */
  --glass-radius-3xl: 1.875rem; /* 30px */
  --glass-radius-full: 9999px;  /* Perfect circle */
}
```

### Why Larger Radius Values?
AuraGlass uses larger radius values than typical design systems because:
- Glassmorphism benefits from softer, more organic shapes
- Larger radius complements blur effects better
- Creates a more premium, modern aesthetic
- Improves visual hierarchy with glass effects

## 🎭 Opacity Scale Tokens

Precise opacity levels for glass effects:

```css
:root {
  /* Opacity scale (Fine-grained for glass effects) */
  --glass-opacity-0: 0;
  --glass-opacity-5: 0.05;
  --glass-opacity-10: 0.10;
  --glass-opacity-15: 0.15;
  --glass-opacity-20: 0.20;
  --glass-opacity-25: 0.25;
  --glass-opacity-30: 0.30;
  --glass-opacity-35: 0.35;
  --glass-opacity-40: 0.40;
  --glass-opacity-45: 0.45;
  --glass-opacity-50: 0.50;
  --glass-opacity-60: 0.60;
  --glass-opacity-70: 0.70;
  --glass-opacity-80: 0.80;
  --glass-opacity-90: 0.90;
  --glass-opacity-95: 0.95;
  --glass-opacity-100: 1;
}
```

### Opacity Usage Patterns

```css
/* Glass surface backgrounds */
.glass-surface-light { background: rgba(var(--glass-color-white) / var(--glass-opacity-10)); }
.glass-surface-medium { background: rgba(var(--glass-color-white) / var(--glass-opacity-15)); }
.glass-surface-strong { background: rgba(var(--glass-color-white) / var(--glass-opacity-25)); }

/* Text opacity levels */
.glass-text-high { color: rgba(var(--glass-color-white) / var(--glass-opacity-95)); }
.glass-text-medium { color: rgba(var(--glass-color-white) / var(--glass-opacity-75)); }
.glass-text-low { color: rgba(var(--glass-color-white) / var(--glass-opacity-55)); }
```

## 🔍 Focus System Tokens

Accessibility-focused tokens for focus states:

```css
:root {
  /* Focus system tokens */
  --glass-focus-width: 2px;
  --glass-focus-offset: 2px;
  --glass-focus-style: solid;
  
  /* Focus colors by intent */
  --glass-focus-color-primary: hsl(var(--glass-color-primary) / 0.6);
  --glass-focus-color-success: hsl(var(--glass-color-success) / 0.6);
  --glass-focus-color-warning: hsl(var(--glass-color-warning) / 0.6);
  --glass-focus-color-danger: hsl(var(--glass-color-danger) / 0.6);
  --glass-focus-color-info: hsl(var(--glass-color-info) / 0.6);
  --glass-focus-color-neutral: rgba(var(--glass-color-white) / 0.6);
  
  /* Focus ring composition */
  --glass-focus-ring-primary: var(--glass-focus-width) var(--glass-focus-style) var(--glass-focus-color-primary);
  --glass-focus-ring-success: var(--glass-focus-width) var(--glass-focus-style) var(--glass-focus-color-success);
  --glass-focus-ring-danger: var(--glass-focus-width) var(--glass-focus-style) var(--glass-focus-color-danger);
}
```

## 🎬 Motion System Tokens

Animation and transition tokens with reduced motion support:

```css
:root {
  /* Duration tokens */
  --glass-motion-duration-instant: 50ms;
  --glass-motion-duration-fast: 150ms;
  --glass-motion-duration-normal: 250ms;
  --glass-motion-duration-slow: 350ms;
  --glass-motion-duration-slower: 450ms;
  --glass-motion-duration-slowest: 600ms;
  
  /* Easing functions */
  --glass-motion-ease-linear: linear;
  --glass-motion-ease-in: cubic-bezier(0.4, 0, 1, 1);
  --glass-motion-ease-out: cubic-bezier(0, 0, 0.2, 1);
  --glass-motion-ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
  --glass-motion-ease-standard: cubic-bezier(0.2, 0, 0, 1);
  --glass-motion-ease-emphasized: cubic-bezier(0.3, 0, 0, 1);
  --glass-motion-ease-decelerated: cubic-bezier(0, 0, 0, 1);
  --glass-motion-ease-accelerated: cubic-bezier(0.3, 0, 1, 1);
  --glass-motion-ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
  
  /* Composite motion tokens */
  --glass-transition-fast: all var(--glass-motion-duration-fast) var(--glass-motion-ease-out);
  --glass-transition-normal: all var(--glass-motion-duration-normal) var(--glass-motion-ease-standard);
  --glass-transition-slow: all var(--glass-motion-duration-slow) var(--glass-motion-ease-emphasized);
}
```

### Motion Usage Examples

```css
/* Standard transitions */
.glass-button {
  transition: var(--glass-transition-normal);
}

.glass-modal {
  transition: opacity var(--glass-motion-duration-normal) var(--glass-motion-ease-standard),
              transform var(--glass-motion-duration-slow) var(--glass-motion-ease-spring);
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  * {
    --glass-motion-duration-instant: 0ms !important;
    --glass-motion-duration-fast: 0ms !important;
    --glass-motion-duration-normal: 0ms !important;
    --glass-motion-duration-slow: 0ms !important;
    --glass-transition-fast: none !important;
    --glass-transition-normal: none !important;
  }
}
```

## 🔤 Typography Scale Tokens

Text sizing and hierarchy tokens:

```css
:root {
  /* Font size scale */
  --glass-text-xs: 0.75rem;    /* 12px */
  --glass-text-sm: 0.875rem;   /* 14px */
  --glass-text-base: 1rem;     /* 16px */
  --glass-text-lg: 1.125rem;   /* 18px */
  --glass-text-xl: 1.25rem;    /* 20px */
  --glass-text-2xl: 1.5rem;    /* 24px */
  --glass-text-3xl: 1.875rem;  /* 30px */
  --glass-text-4xl: 2.25rem;   /* 36px */
  --glass-text-5xl: 3rem;      /* 48px */
  --glass-text-6xl: 3.75rem;   /* 60px */
  
  /* Font weight scale */
  --glass-font-thin: 100;
  --glass-font-extralight: 200;
  --glass-font-light: 300;
  --glass-font-normal: 400;
  --glass-font-medium: 500;
  --glass-font-semibold: 600;
  --glass-font-bold: 700;
  --glass-font-extrabold: 800;
  --glass-font-black: 900;
  
  /* Line height scale */
  --glass-leading-none: 1;
  --glass-leading-tight: 1.25;
  --glass-leading-snug: 1.375;
  --glass-leading-normal: 1.5;
  --glass-leading-relaxed: 1.625;
  --glass-leading-loose: 2;
}
```

## 🌓 Theme System Tokens

Light and dark theme variations:

### Light Theme Overrides
```css
[data-theme="light"] {
  --glass-color-text-primary: var(--glass-color-black);
  --glass-color-text-secondary: 220 13% 18%; /* Gray-800 */
  --glass-color-text-muted: 220 9% 46%;      /* Gray-500 */
  
  --glass-surface-primary: rgba(var(--glass-color-black) / 0.05);
  --glass-surface-secondary: rgba(var(--glass-color-black) / 0.03);
  
  --glass-border-primary: rgba(var(--glass-color-black) / 0.1);
  --glass-border-subtle: rgba(var(--glass-color-black) / 0.05);
}
```

### Dark Theme (Default)
```css
[data-theme="dark"] {
  --glass-color-text-primary: var(--glass-color-white);
  --glass-color-text-secondary: 220 14% 75%; /* Gray-300 */
  --glass-color-text-muted: 220 9% 55%;      /* Gray-400 */
  
  --glass-surface-primary: rgba(var(--glass-color-white) / 0.1);
  --glass-surface-secondary: rgba(var(--glass-color-white) / 0.05);
  
  --glass-border-primary: rgba(var(--glass-color-white) / 0.2);
  --glass-border-subtle: rgba(var(--glass-color-white) / 0.1);
}
```

## 📱 Responsive Tokens

Breakpoint and container tokens:

```css
:root {
  /* Breakpoint tokens */
  --glass-breakpoint-xs: 480px;
  --glass-breakpoint-sm: 640px;
  --glass-breakpoint-md: 768px;
  --glass-breakpoint-lg: 1024px;
  --glass-breakpoint-xl: 1280px;
  --glass-breakpoint-2xl: 1536px;
  
  /* Container max-widths */
  --glass-container-xs: 100%;
  --glass-container-sm: 640px;
  --glass-container-md: 768px;
  --glass-container-lg: 1024px;
  --glass-container-xl: 1280px;
  --glass-container-2xl: 1536px;
  
  /* Touch targets */
  --glass-touch-target-min: 44px;  /* Minimum touch target size */
  --glass-touch-target-preferred: 48px; /* Preferred touch target */
}
```

## 🔧 Component-Specific Tokens

Tokens for specific component families:

### Button Tokens
```css
:root {
  /* Button sizing */
  --glass-button-height-sm: 32px;
  --glass-button-height-md: 40px;
  --glass-button-height-lg: 48px;
  --glass-button-height-xl: 56px;
  
  /* Button padding */
  --glass-button-padding-x-sm: var(--glass-space-3); /* 12px */
  --glass-button-padding-x-md: var(--glass-space-4); /* 16px */
  --glass-button-padding-x-lg: var(--glass-space-6); /* 24px */
  --glass-button-padding-x-xl: var(--glass-space-8); /* 32px */
}
```

### Input Tokens
```css
:root {
  /* Input sizing */
  --glass-input-height-sm: 32px;
  --glass-input-height-md: 40px;
  --glass-input-height-lg: 48px;
  
  /* Input padding */
  --glass-input-padding-x: var(--glass-space-3); /* 12px */
  --glass-input-padding-y: var(--glass-space-2); /* 8px */
}
```

## 🎨 Using Tokens in CSS

### Direct Token Usage
```css
.my-component {
  /* Use tokens directly in CSS */
  background: rgba(var(--glass-color-white) / var(--glass-opacity-10));
  backdrop-filter: blur(var(--glass-blur-lg));
  border-radius: var(--glass-radius-lg);
  box-shadow: var(--glass-elev-2);
  padding: var(--glass-space-4);
  transition: var(--glass-transition-normal);
}
```

### CSS Custom Property Composition
```css
.glass-card {
  /* Compose tokens into higher-level properties */
  --card-background: rgba(var(--glass-color-white) / var(--glass-opacity-15));
  --card-border: 1px solid rgba(var(--glass-color-white) / var(--glass-opacity-20));
  --card-shadow: var(--glass-elev-2);
  
  background: var(--card-background);
  border: var(--card-border);
  box-shadow: var(--card-shadow);
  backdrop-filter: blur(var(--glass-blur-md));
}
```

### JavaScript Token Usage
```javascript
// Access tokens in JavaScript
const getGlassToken = (tokenName) => {
  return getComputedStyle(document.documentElement)
    .getPropertyValue(`--glass-${tokenName}`)
    .trim();
};

// Usage examples
const primaryColor = getGlassToken('color-primary');
const mediumBlur = getGlassToken('blur-md');
const level2Elevation = getGlassToken('elev-2');

// Dynamic token usage
const createGlassStyle = (elevation = 'level2', blur = 'md') => ({
  boxShadow: getGlassToken(`elev-${elevation.replace('level', '')}`),
  backdropFilter: `blur(${getGlassToken(`blur-${blur}`)})`,
});
```

## 📋 Token Validation

### Linting Tokens
The AuraGlass system includes automated token validation:

```bash
# Validate token usage
npm run lint:tokens

# Check for hardcoded values that should use tokens
npm run token:audit

# Generate token usage report
npm run token:report
```

### Common Token Violations
```css
/* ❌ Violations that will be flagged */
.bad-component {
  backdrop-filter: blur(16px);           /* Use --glass-blur-lg */
  background: rgba(255,255,255,0.1);     /* Use --glass-surface-primary */
  box-shadow: 0 4px 16px rgba(0,0,0,0.16); /* Use --glass-elev-2 */
  border-radius: 12px;                   /* Use --glass-radius-lg */
  padding: 16px;                         /* Use --glass-space-4 */
}

/* ✅ Correct token usage */
.good-component {
  backdrop-filter: blur(var(--glass-blur-lg));
  background: rgba(var(--glass-color-white) / var(--glass-opacity-10));
  box-shadow: var(--glass-elev-2);
  border-radius: var(--glass-radius-lg);
  padding: var(--glass-space-4);
}
```

## 🚀 Advanced Token Patterns

### Semantic Token Layers
```css
/* Layer 1: Primitive tokens (don't use directly) */
--_primitive-blue-500: 217 91% 60%;
--_primitive-spacing-4: 1rem;

/* Layer 2: Base tokens */
--glass-color-primary: var(--_primitive-blue-500);
--glass-space-4: var(--_primitive-spacing-4);

/* Layer 3: Semantic tokens (use these) */
--glass-button-color: var(--glass-color-primary);
--glass-button-padding-x: var(--glass-space-4);
```

### Contextual Token Overrides
```css
/* Component-specific token customization */
.glass-card-prominent {
  --glass-local-blur: var(--glass-blur-xl);
  --glass-local-elevation: var(--glass-elev-3);
  
  backdrop-filter: blur(var(--glass-local-blur));
  box-shadow: var(--glass-local-elevation);
}

/* Theme-specific overrides */
[data-theme="high-contrast"] {
  --glass-color-primary: 220 100% 50%;
  --glass-opacity-10: 0.2; /* Higher opacity for better contrast */
}
```

## 📚 Related Documentation

- [Component Standards](./guides/component-standards.md)
- [Glass Utilities Guide](./glass-utilities.md)
- [Elevation Guidelines](./guides/elevation-guidelines.md)
- [Design System Enforcement](./guides/design-system-enforcement.md)
- [Migration Guide](./guides/migration.md)

---

This token system ensures consistent, maintainable, and themeable glassmorphism across your entire application while maintaining the 100/100 design system score.

## Liquid Glass System Tokens

Aura Liquid Glass adds system-level tokens for:

- scroll edges: soft/hard size, blur, opacity, transition
- concentric geometry: compact, comfortable, and spacious insets
- clear material dimming: subtle, standard, strong
- effect groups: tight, regular, loose spacing and blend strength
- density and illumination: compact controls, hover, press, and focus response
- reduced motion: transition fallback and parallax/shimmer opt-outs

TypeScript values live in `src/tokens/glass.ts` under `LIQUID_GLASS.system`. The token manifest includes a `liquidGlassSystem` section for downstream tooling.
