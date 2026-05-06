# AuraGlass Utility Guide vs Tailwind

## Overview

This guide provides a complete reference for AuraGlass utilities and their relationship to Tailwind CSS. AuraGlass uses a token-first architecture with glass-specific utilities that extend beyond standard Tailwind classes while maintaining compatibility.

## 🎯 Philosophy: Glass-First vs Utility-First

### Tailwind Approach
```html
<!-- Tailwind: Utility-first, generic -->
<div class="bg-white/10 backdrop-blur-lg rounded-lg shadow-lg p-4">
  Content
</div>
```

### AuraGlass Approach
```html
<!-- AuraGlass: Glass-first, design system tokens -->
<div class="glass glass-elev-level2 glass-p-4 glass-radius-lg">
  Content
</div>
```

## 🔧 Utility Categories

### 1. Foundation Glass Classes

#### Base Glass
```css
.glass                    /* Complete glass foundation */
.glass-foundation-complete /* Alias for .glass */
```

**What it includes:**
- Backdrop filter blur
- Glass gradient background
- Border with glass effect
- Default elevation (level2)
- Glass border radius
- Smooth transitions
- Proper text color

#### Glass Variants
```css
.glass-frosted           /* Heavy frosted glass effect */
.glass-subtle           /* Light glass effect */
.glass-tinted           /* Tinted glass with color */
.glass-clear            /* Minimal glass effect */
```

### 2. Blur Utilities

| AuraGlass | Tailwind Equivalent | Value | Use Case |
|-----------|-------------------|-------|----------|
| `.glass-blur-none` | `.backdrop-blur-none` | 0px | Disabled states |
| `.glass-blur-sm` | `.backdrop-blur-sm` | 4px | Subtle effects |
| `.glass-blur-md` | `.backdrop-blur` | 8px | Standard glass |
| `.glass-blur-lg` | `.backdrop-blur-lg` | 16px | Strong glass |
| `.glass-blur-xl` | `.backdrop-blur-xl` | 24px | Maximum blur |
| `.glass-blur-2xl` | `.backdrop-blur-2xl` | 32px | Extreme blur |
| `.glass-blur-3xl` | `.backdrop-blur-3xl` | 48px | Ultra blur |

**Example:**
```html
<!-- AuraGlass: Token-based, consistent -->
<div class="glass-blur-lg">Strong glass blur</div>

<!-- Tailwind: Direct utility -->
<div class="backdrop-blur-lg">Strong backdrop blur</div>
```

### 3. Elevation System

AuraGlass provides semantic elevation levels that go beyond Tailwind's generic shadows:

#### Semantic Elevation (Preferred)
```css
.glass-elev-level0      /* Flat surface */
.glass-elev-level1      /* Subtle elements */
.glass-elev-level2      /* Interactive elements */
.glass-elev-level3      /* Overlay elements */
.glass-elev-level4      /* Floating elements */
.glass-elev-level5      /* Top-level overlays */
.glass-elev-level6      /* Maximum elevation */
```

#### Numeric Elevation (Legacy)
```css
.glass-elev-0           /* Legacy: use level0 instead */
.glass-elev-1           /* Legacy: use level1 instead */
.glass-elev-2           /* Legacy: use level2 instead */
.glass-elev-3           /* Legacy: use level3 instead */
.glass-elev-4           /* Legacy: use level4 instead */
.glass-elev-5           /* Legacy: use level5 instead */
.glass-elev-6           /* Legacy: use level6 instead */
```

#### Comparison with Tailwind
| AuraGlass | Tailwind | Purpose |
|-----------|----------|---------|
| `.glass-elev-level1` | `.shadow-sm` | Badges, chips |
| `.glass-elev-level2` | `.shadow-md` | Buttons, cards |
| `.glass-elev-level3` | `.shadow-lg` | Dropdowns, popovers |
| `.glass-elev-level4` | `.shadow-xl` | FABs, tooltips |
| `.glass-elev-level5` | `.shadow-2xl` | Modals, headers |

### 4. Spacing System (4px Grid)

AuraGlass uses a 4px grid system with glass-prefixed utilities:

#### Margin Classes
```css
/* All directions */
.glass-m-0     /* 0px */      → .m-0
.glass-m-1     /* 4px */      → .m-1
.glass-m-2     /* 8px */      → .m-2
.glass-m-3     /* 12px */     → .m-3
.glass-m-4     /* 16px */     → .m-4
.glass-m-6     /* 24px */     → .m-6
.glass-m-8     /* 32px */     → .m-8
.glass-m-10    /* 40px */     → .m-10
.glass-m-12    /* 48px */     → .m-12

/* Directional margins */
.glass-mt-4    /* Top */      → .mt-4
.glass-mb-4    /* Bottom */   → .mb-4
.glass-ml-4    /* Left */     → .ml-4
.glass-mr-4    /* Right */    → .mr-4
.glass-mx-4    /* Horizontal */ → .mx-4
.glass-my-4    /* Vertical */  → .my-4
```

#### Padding Classes
```css
/* All directions */
.glass-p-0     /* 0px */      → .p-0
.glass-p-1     /* 4px */      → .p-1
.glass-p-2     /* 8px */      → .p-2
.glass-p-3     /* 12px */     → .p-3
.glass-p-4     /* 16px */     → .p-4
.glass-p-6     /* 24px */     → .p-6
.glass-p-8     /* 32px */     → .p-8

/* Directional padding */
.glass-pt-4    /* Top */      → .pt-4
.glass-pb-4    /* Bottom */   → .pb-4
.glass-pl-4    /* Left */     → .pl-4
.glass-pr-4    /* Right */    → .pr-4
.glass-px-4    /* Horizontal */ → .px-4
.glass-py-4    /* Vertical */  → .py-4
```

#### Gap Classes
```css
.glass-gap-1   /* 4px gap */   → .gap-1
.glass-gap-2   /* 8px gap */   → .gap-2
.glass-gap-4   /* 16px gap */  → .gap-4
.glass-gap-6   /* 24px gap */  → .gap-6
```

### 5. Border Radius

Glass-specific radius values optimized for glassmorphism:

```css
.glass-radius-none    /* 0px */     → .rounded-none
.glass-radius-sm      /* 8px */     → .rounded-sm (4px in Tailwind)
.glass-radius-md      /* 12px */    → .rounded-md (6px in Tailwind)
.glass-radius-lg      /* 16px */    → .rounded-lg (8px in Tailwind)
.glass-radius-xl      /* 20px */    → .rounded-xl (12px in Tailwind)
.glass-radius-2xl     /* 24px */    → .rounded-2xl (16px in Tailwind)
.glass-radius-full    /* 9999px */  → .rounded-full
```

**Note**: AuraGlass radius values are larger than Tailwind defaults for better glass aesthetics.

### 6. Color System

#### Text Colors
```css
.glass-text-primary      /* Primary text color */
.glass-text-secondary    /* Secondary text color */
.glass-text-muted        /* Muted/disabled text */
.glass-text-success      /* Success state text */
.glass-text-warning      /* Warning state text */
.glass-text-danger       /* Error/danger text */
.glass-text-info         /* Information text */
```

Note: Prefer token-driven text (glass-text-primary/secondary) over absolute `.glass-text-white`/`.glass-text-black` in components. For gradient/dynamic backgrounds, use the automatic contrast system below.

### 6.1 Automatic Text Contrast (NEW)

To keep text readable on light/dark gradients without inline styles:

- Attribute-driven tokens:
  - Set `data-bg="dark"` on a container to force white-on-dark token values inside.
  - Set `data-bg="light"` on a container to force black-on-light token values inside.

- Auto-detection for dynamic backgrounds:
```tsx
import useAutoTextContrast from '@/hooks/useAutoTextContrast';

export function GradientSection() {
  const ref = useRef<HTMLDivElement>(null);
  useAutoTextContrast(ref, { threshold: 0.55, observe: true });
  return (
    <section ref={ref} className="glass-radius-xl">
      <h2 className="glass-text-primary">Always readable</h2>
      <p className="glass-text-secondary">Tokens flip automatically.</p>
    </section>
  );
}
```

Under the hood, the hook samples background luminance and sets `data-bg='dark'` or `'light'` to flip `--glass-text-*` tokens. This remains 100% token-compliant and passes lint rules (no JSX style attrs).

#### Surface Colors
```css
.glass-surface-primary   /* Primary surface */
.glass-surface-secondary /* Secondary surface */
.glass-surface-success   /* Success surface */
.glass-surface-warning   /* Warning surface */
.glass-surface-danger    /* Danger surface */
.glass-surface-info      /* Info surface */
.glass-surface-white     /* White surface */
.glass-surface-black     /* Black surface */
```

#### Border Colors
```css
.glass-border-primary    /* Primary border */
.glass-border-secondary  /* Secondary border */
.glass-border-success    /* Success border */
.glass-border-warning    /* Warning border */
.glass-border-danger     /* Danger border */
.glass-border-white      /* White border */
.glass-border-black      /* Black border */
```

### 7. Focus & Interaction States

#### Focus Management
```css
.glass-focus            /* Complete focus ring system */
.glass-focus-primary    /* Primary color focus */
.glass-focus-success    /* Success color focus */
.glass-focus-warning    /* Warning color focus */
.glass-focus-danger     /* Danger color focus */
```

#### Touch Targets
```css
.glass-touch-target     /* 44x44px minimum touch size */
```

#### Interactive States
```css
.glass-hover            /* Hover state styles */
.glass-active           /* Active/pressed state */
.glass-disabled         /* Disabled state styles */
.glass-cursor-pointer   /* Pointer cursor */
```

### 8. Layout Utilities

#### Display
```css
.glass-flex            /* display: flex */      → .flex
.glass-grid            /* display: grid */      → .grid
.glass-block           /* display: block */     → .block
.glass-inline-block    /* display: inline-block */ → .inline-block
.glass-hidden          /* display: none */      → .hidden
```

#### Positioning
```css
.glass-relative        /* position: relative */ → .relative
.glass-absolute        /* position: absolute */ → .absolute
.glass-fixed           /* position: fixed */    → .fixed
.glass-sticky          /* position: sticky */   → .sticky
```

#### Z-Index
```css
.glass-z-0             /* z-index: 0 */        → .z-0
.glass-z-10            /* z-index: 10 */       → .z-10
.glass-z-20            /* z-index: 20 */       → .z-20
.glass-z-30            /* z-index: 30 */       → .z-30
.glass-z-40            /* z-index: 40 */       → .z-40
.glass-z-50            /* z-index: 50 */       → .z-50
```

### 9. Typography

#### Font Sizes
```css
.glass-text-xs         /* 12px */              → .text-xs
.glass-text-sm         /* 14px */              → .text-sm
.glass-text-base       /* 16px */              → .text-base
.glass-text-lg         /* 18px */              → .text-lg
.glass-text-xl         /* 20px */              → .text-xl
.glass-text-2xl        /* 24px */              → .text-2xl
```

#### Font Weights
```css
.glass-font-light      /* 300 */               → .font-light
.glass-font-normal     /* 400 */               → .font-normal
.glass-font-medium     /* 500 */               → .font-medium
.glass-font-semibold   /* 600 */               → .font-semibold
.glass-font-bold       /* 700 */               → .font-bold
```

### 10. Animation & Motion

#### Glass-Specific Animations
```css
.glass-animate-float     /* Subtle floating animation */
.glass-animate-shimmer   /* Light sweep effect */
.glass-animate-ambient   /* Breathing opacity effect */
.glass-animate-press     /* Click feedback animation */
.glass-animate-pulse     /* Loading pulse (respects reduced motion) */
```

#### Motion Preferences
All glass animations automatically respect `prefers-reduced-motion`:

```css
@media (prefers-reduced-motion: reduce) {
  .glass-animate-float {
    animation: none !important;
  }
}
```

## 🆚 When to Use Glass vs Tailwind

### Use AuraGlass Utilities When:
- Building glassmorphism interfaces
- Need design system consistency
- Require semantic elevation levels
- Want automatic accessibility features
- Need token-based theming
- Working with interactive glass elements

### Use Tailwind Utilities When:
- Need utilities not covered by AuraGlass
- Building non-glass components
- Want maximum flexibility
- Prototyping quickly
- Working with existing Tailwind patterns

### Combining Both (Recommended)
```html
<!-- Use both systems together -->
<div class="glass glass-elev-level2 glass-p-6 
            flex items-center justify-between 
            w-full max-w-lg mx-auto">
  <!-- AuraGlass for glass effects, Tailwind for layout -->
</div>
```

## 🔄 Migration Patterns

### From Tailwind to AuraGlass

#### Basic Glass Effect
```html
<!-- Before: Manual Tailwind glass -->
<div class="bg-white/10 backdrop-blur-lg rounded-lg shadow-lg border border-white/20">
  Content
</div>

<!-- After: AuraGlass utility -->
<div class="glass glass-elev-level2 glass-radius-lg">
  Content
</div>
```

#### Complex Glass Components
```html
<!-- Before: Multiple Tailwind utilities -->
<button class="bg-blue-500/20 backdrop-blur-md rounded-xl shadow-md 
               border border-blue-300/30 px-4 py-2 
               hover:bg-blue-500/30 focus:ring-2 focus:ring-blue-400">
  Button
</button>

<!-- After: Glass utilities + semantic approach -->
<button class="glass-surface-primary glass-blur-md glass-radius-xl 
               glass-elev-level2 glass-px-4 glass-py-2 
               glass-focus glass-hover">
  Button
</button>
```

## 📋 Utility Reference Chart

### Complete Spacing System

| Spacing | Value | AuraGlass Class | Tailwind Equivalent |
|---------|-------|-----------------|-------------------|
| 0 | 0px | `.glass-p-0` | `.p-0` |
| 1 | 4px | `.glass-p-1` | `.p-1` |
| 2 | 8px | `.glass-p-2` | `.p-2` |
| 3 | 12px | `.glass-p-3` | `.p-3` |
| 4 | 16px | `.glass-p-4` | `.p-4` |
| 6 | 24px | `.glass-p-6` | `.p-6` |
| 8 | 32px | `.glass-p-8` | `.p-8` |
| 10 | 40px | `.glass-p-10` | `.p-10` |
| 12 | 48px | `.glass-p-12` | `.p-12` |

### Border Radius Comparison

| Radius | AuraGlass | Tailwind | AuraGlass Value | Tailwind Value |
|--------|-----------|----------|-----------------|----------------|
| Small | `.glass-radius-sm` | `.rounded-sm` | 8px | 4px |
| Medium | `.glass-radius-md` | `.rounded-md` | 12px | 6px |
| Large | `.glass-radius-lg` | `.rounded-lg` | 16px | 8px |
| Extra Large | `.glass-radius-xl` | `.rounded-xl` | 20px | 12px |
| 2X Large | `.glass-radius-2xl` | `.rounded-2xl` | 24px | 16px |

## 🎨 Design Token Integration

### Using CSS Custom Properties
```css
/* All utilities use design tokens */
.glass-p-4 {
  padding: var(--glass-space-4); /* 16px */
}

.glass-radius-lg {
  border-radius: var(--glass-radius-lg); /* 16px */
}

.glass-elev-level2 {
  box-shadow: var(--glass-elev-2); /* 0 4px 16px rgba(0 0 0 / 0.16) */
}
```

### Custom Properties Available
```css
/* Spacing tokens */
--glass-space-0 through --glass-space-12

/* Radius tokens */
--glass-radius-none through --glass-radius-2xl

/* Elevation tokens */
--glass-elev-0 through --glass-elev-6

/* Blur tokens */
--glass-blur-none through --glass-blur-3xl

/* Motion tokens */
--glass-motion-duration-fast through --glass-motion-duration-slowest
```

## ⚡ Performance Considerations

### Efficient Class Usage
```html
<!-- Good: Combine utilities efficiently -->
<div class="glass glass-elev-level2 glass-p-4 glass-radius-lg">
  Content
</div>

<!-- Avoid: Redundant utilities -->
<div class="glass glass-blur-lg glass-elev-level2 glass-blur-md">
  <!-- Don't use multiple blur classes -->
</div>
```

### Tree Shaking
AuraGlass utilities are tree-shakeable:
```css
/* Only used utilities are included in final bundle */
@import 'aura-glass/utilities'; /* Tree-shaken automatically */
```

## 🚀 Advanced Usage

### Dynamic Classes with JavaScript
```javascript
// Generate glass utilities dynamically
const elevationLevel = 'level2';
const element = document.querySelector('.my-element');
element.className += ` glass-elev-${elevationLevel}`;
```

### CSS-in-JS Integration
```javascript
import { createGlassStyle } from 'aura-glass';

const dynamicGlass = createGlassStyle({
  elevation: 'level2',
  blur: 'lg',
  radius: 'xl'
});
```

## 📚 Related Resources

- [Component Standards](./guides/component-standards.md)
- [Elevation Guidelines](./guides/elevation-guidelines.md)
- [Design System Enforcement](./guides/design-system-enforcement.md)
- [Design Token Reference](./design-tokens.md)
- [Migration Guide](./guides/migration.md)

---

This utility system ensures consistent glassmorphism implementation while maintaining compatibility with Tailwind CSS for maximum flexibility.
