# AuraGlass by AuraOne Migration Guide

## Version 2.0 - Token-First Architecture

This guide helps you migrate from raw values to the token-first AuraGlass by AuraOne system with semantic elevation levels and comprehensive utilities.

## Quick Start

```bash
# 1. Install latest version
npm install aura-glass@latest

# 2. Run automated migration
npm run codemod:all

# 3. Test your application
npm run typecheck
npm run test
```

## Breaking Changes

### 1. Raw Colors Deprecated

**Before:**
```tsx
<div style={{ color: '#ffffff', background: 'rgba(255,255,255,0.2)' }}>
```

**After:**
```tsx
<div className="glass-text-primary glass">
```

### 2. Inline Backdrop Filters Removed

**Before:**
```css
.my-component {
  backdrop-filter: blur(16px);
}
```

**After:**
```css
.my-component {
  @apply glass-blur-lg;
}
```

### 3. Elevation System Updated

**Before:**
```tsx
<OptimizedGlass elevation={2} />
```

**After:**
```tsx
<OptimizedGlass elevation="level2" />
```

### 4. Animation Classes Changed

**Before:**
```tsx
<div className="animate-pulse">
```

**After:**
```tsx
<div className="glass-animate-float">
```

### 5. Glass Utility Prefixes

**Before:**
```tsx
<div className="p-4 rounded-lg backdrop-blur-lg">
```

**After:**
```tsx
<div className="glass-p-4 glass-radius-lg glass-blur-lg">
```

## New Features

### Token System

All values now use design tokens:

```css
/* Colors */
--glass-color-primary
--glass-color-success
--glass-color-warning
--glass-color-danger
--glass-color-info

/* Spacing (4px grid) */
--glass-space-1  /* 4px */
--glass-space-2  /* 8px */
--glass-space-4  /* 16px */
--glass-space-8  /* 32px */

/* Blur Scale */
--glass-blur-sm  /* 4px */
--glass-blur-md  /* 8px */
--glass-blur-lg  /* 16px */
--glass-blur-xl  /* 24px */

/* Elevation (0-6) - Semantic Levels */
--glass-elev-0      /* Flat surface */
--glass-elev-1      /* Subtle elements */
--glass-elev-2      /* Interactive elements */
--glass-elev-3      /* Overlay elements */
--glass-elev-4      /* Floating elements */
--glass-elev-5      /* Top-level overlays */
--glass-elev-6      /* Maximum elevation */

/* Glass Utilities */
--glass-radius-sm   /* 8px */
--glass-radius-md   /* 12px */
--glass-radius-lg   /* 16px */
--glass-radius-xl   /* 20px */

/* Motion Tokens */
--glass-motion-duration-fast     /* 150ms */
--glass-motion-duration-normal   /* 250ms */
--glass-motion-ease-standard     /* cubic-bezier(0.2, 0, 0, 1) */
```

### Accessibility Improvements

All interactive elements now have:
- Proper focus states
- Keyboard navigation
- ARIA attributes
- Minimum touch targets (44×44px)

### Motion System

New motion utilities with automatic reduced-motion support:

```tsx
<div className="glass-animate-float">   // Subtle floating
<div className="glass-animate-shimmer"> // Light sweep
<div className="glass-animate-ambient">  // Opacity breathing
<div className="glass-animate-press">    // Click feedback
```

## Component API Changes

### OptimizedGlass & GlassAdvanced

**Before:**
```tsx
<GlassAdvanced 
  elevation={2}
  variant="primary"
  blur="medium"
  interactive
/>
```

**After:**
```tsx
<OptimizedGlass
  elevation="level2"  // Semantic elevation
  intent="primary"    // Renamed from variant
  blur="lg"          // Token-based blur
  interactive
  className="glass-focus" // Required for interactive
/>
```

### Glass Components

**Before:**
```tsx
<GlassButton elevation={2}>
  Button
</GlassButton>
```

**After:**
```tsx
<GlassButton 
  elevation="level2"
  size="md"          // Standardized sizing
  className="glass-focus" // Accessibility requirement
>
  Button
</GlassButton>
```

### Focus Management

Interactive divs now require proper semantics:

```tsx
// Automatically added by codemod
<div 
  onClick={handleClick}
  role="button"
  tabIndex={0}
  className="glass-focus glass-touch-target"
  onKeyDown={handleButtonKeyDown}
>
```

## Migration Steps

### 1. Update Imports

```tsx
// Before
import { Glass } from 'aura-glass';
import '../styles/custom-glass.css';

// After
import { 
  OptimizedGlass,
  GlassAdvanced,
  createGlassStyle 
} from 'aura-glass';
import 'aura-glass/styles';
```

### 2. Replace Raw Values

Run the codemod to automatically replace:
- Hex colors → CSS variables
- RGB/RGBA → Glass surface tokens
- Pixel values → Glass space tokens
- Numeric elevation → Semantic elevation
- Tailwind classes → Glass utilities
- Raw animations → Glass animations

```bash
npm run codemod:tokens      # Replace raw values with tokens
npm run codemod:elevation   # Update elevation to semantic format
npm run codemod:utilities   # Convert to glass utilities
```

### 3. Add Accessibility

Run the accessibility codemod to add:
- Focus utilities (`glass-focus`)
- ARIA attributes
- Keyboard handlers
- Touch targets (`glass-touch-target`)
- Semantic markup

```bash
npm run codemod:focus       # Add focus management
npm run codemod:a11y        # Add accessibility attributes
npm run codemod:semantic    # Add semantic HTML
```

### 4. Update Themes & Elevation

```tsx
// Before: Manual theme classes
<div className="dark-mode">
  <OptimizedGlass elevation={2} />
</div>

// After: Data attributes and semantic elevation
<div data-theme="dark">
  <OptimizedGlass elevation="level2" />
</div>
```

### 5. Test Your Application

```bash
# Complete design system validation
npm run glass:full-check

# Individual validation checks
npm run lint:tokens         # Token compliance
npm run lint:styles         # Style patterns
npm run lint:glass          # Glass validation
npm run typecheck           # TypeScript

# Testing suite
npm run test:visual         # Visual regression
npm run test:a11y           # Accessibility
npm run test:performance    # Performance
npm run test:unit           # Unit tests
```

## Manual Fixes

Some patterns require manual intervention:

### Complex Gradients

```css
/* Before */
background: linear-gradient(135deg, #fff 0%, #3b82f6 100%);

/* After */
background: var(--glass-gradient-primary);
/* Or create custom gradient with tokens */
background: linear-gradient(135deg, 
  rgba(var(--glass-color-white) / 0.3) 0%,
  hsl(var(--glass-color-primary) / 0.2) 100%
);
```

### Custom Animations

```css
/* Before */
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

/* After */
@keyframes glass-custom-pulse {
  0%, 100% { opacity: var(--glass-opacity-100); }
  50% { opacity: var(--glass-opacity-50); }
}

/* Add reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .glass-animate-custom {
    animation: none !important;
  }
}
```

### Dynamic Styles

```tsx
// Before
<div style={{ 
  backgroundColor: `rgba(255,255,255,${opacity})` 
}}>

// After
<div style={{ 
  '--glass-dynamic-opacity': opacity 
} as React.CSSProperties}
  className="glass"
>
```

## Validation

After migration, ensure:

### ✅ TypeScript
```bash
npm run typecheck
# Should complete without errors
```

### ✅ Tests Pass
```bash
npm run test
# All tests should pass
```

## Rollback

If you need to rollback:

```bash
# Revert to previous version
npm install aura-glass@1.x

# Git revert migration commits
git revert <migration-commit-hash>
```

## Getting Help

- 📚 [Documentation](https://auraglass.auraone.ai)
- 🐛 [Report Issues](https://github.com/auraoneai/auraglass/issues)
- 📧 [Email Support](mailto:support@auraone.com)

## FAQ

**Q: Will the migration break my existing styles?**
A: The codemods preserve functionality while updating syntax. Visual appearance should remain identical.

**Q: Can I use both old and new patterns during migration?**
A: Yes, but you'll get linting warnings. Complete migration for best results.

**Q: What about custom components?**
A: Apply the same token patterns. Use `createGlassStyle()` for dynamic styles or wrap with `OptimizedGlass`.

**Q: How do I handle semantic elevation migration?**
A: Run `npm run codemod:elevation` to automatically convert `elevation={2}` to `elevation="level2"`.

**Q: My design system score is low. How do I improve it?**
A: Run `npm run glass:full-check` for detailed violations, then use codemods to fix them automatically.

**Q: How do I handle third-party integrations?**
A: Wrap third-party components with glass utility classes rather than modifying them directly.


## 🔍 Common Migration Issues

### Issue 1: Legacy Elevation Numbers
```bash
# Find and fix numeric elevation
npm run codemod:elevation

# Manual fix example:
# elevation={2} → elevation="level2"
```

### Issue 2: Missing Focus States
```bash
# Add missing focus utilities
npm run codemod:focus

# Manual fix: add className="glass-focus" to interactive elements
```

### Issue 3: Raw Color Values
```bash
# Replace raw colors with tokens
npm run codemod:tokens

# Manual fix: #ffffff → glass-text-white
```

### Issue 4: Tailwind Animation Classes
```bash
# Replace with glass animations
sed -i 's/animate-pulse/glass-animate-pulse/g' src/**/*.tsx
sed -i 's/animate-bounce/glass-animate-float/g' src/**/*.tsx
```

## 🚀 Advanced Migration Patterns

### Custom Component Migration
```tsx
// Before: Custom glass component
const CustomGlass = ({ children, blur = 8 }) => (
  <div 
    style={{ 
      backdropFilter: `blur(${blur}px)`,
      background: 'rgba(255,255,255,0.1)'
    }}
  >
    {children}
  </div>
);

// After: Token-based custom component
const CustomGlass = ({ children, blur = "md" }) => (
  <OptimizedGlass
    className={`glass-blur-${blur} glass-surface-primary`}
    elevation="level2"
  >
    {children}
  </OptimizedGlass>
);
```

### Theme System Migration
```tsx
// Before: Manual theme switching
const [isDark, setIsDark] = useState(false);
const theme = isDark ? darkTheme : lightTheme;

// After: Automatic theme system
import { useGlassTheme } from 'aura-glass';
const { theme, toggleTheme } = useGlassTheme();
```

### Performance Optimization
```tsx
// Before: Heavy glass effects everywhere
<div className="backdrop-blur-xl bg-white/20 shadow-2xl">
  Content
</div>

// After: Performance-conscious glass
<OptimizedGlass
  performanceMode="balanced"  // auto | high | balanced | low
  elevation="level2"
  className="glass-blur-lg"   // Optimized blur level
>
  Content
</OptimizedGlass>
```

## 🎉 Next Steps

After successful migration:

1. **Remove legacy files**
   - Delete old CSS files
   - Remove custom glass utilities
   - Clean up unused imports

2. **Update team documentation**
   - Share new component patterns
   - Update style guides
   - Train team on glass utilities

3. **Test thoroughly**
   - Run your test suite
   - Verify visual consistency
   - Check accessibility compliance

Your application now has:
- 🎨 **Semantic Elevation System**
- ♿ **Full Accessibility Compliance**
- 🚀 **Performance Optimization**
- 🔧 **Maintainable Token Architecture**
- 📐 **Consistent Glass Utilities**
- 🎭 **Motion System with Reduced Motion Support**

## 📚 Additional Resources

- [Component Standards](./component-standards.md)
- [Glass Utilities Guide](../glass-utilities.md)
- [Elevation Guidelines](./elevation-guidelines.md)
- [Design System Enforcement](./design-system-enforcement.md)
- [Design Token Reference](../design-tokens.md)
