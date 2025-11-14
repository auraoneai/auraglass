# AuraGlass Component Standards

## Overview

This document defines proper usage patterns, standards, and best practices for all AuraGlass components. Following these standards ensures consistency, accessibility, and maintainability across the design system while maintaining our 100/100 design system score.

## 🎯 Core Principles

### 1. Token-First Architecture
Always use design tokens instead of hardcoded values:

```tsx
// ❌ Bad: Hardcoded values
<OptimizedGlass
  style={{ 
    backdropFilter: 'blur(16px)',
    background: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '12px'
  }}
/>

// ✅ Good: Token-based approach
<OptimizedGlass
  elevation="level2"
  intensity="medium" 
  className="glass-radius-lg"
/>
```

### 2. Semantic Elevation System
Use semantic elevation levels instead of arbitrary values:

```tsx
// ❌ Bad: Numeric elevation
<GlassCard elevation={2} />

// ✅ Good: Semantic elevation
<GlassCard elevation="level2" />
```

### 3. Accessibility First
All interactive components must include proper accessibility attributes:

```tsx
// ✅ Good: Complete accessibility
<GlassButton
  onClick={handleClick}
  aria-label="Save changes"
  className="glass-focus glass-touch-target"
>
  Save
</GlassButton>
```

## 🧱 Component Usage Patterns

### Buttons

#### Standard Button Pattern
```tsx
<GlassButton
  variant="primary"          // primary | secondary | ghost | danger
  size="md"                  // sm | md | lg
  elevation="level2"         // Use semantic elevation
  className="glass-focus"    // Required for accessibility
  disabled={isDisabled}      // Proper disabled state
  onClick={handleClick}
  aria-label="Descriptive label"
>
  Button Text
</GlassButton>
```

#### Magnetic Button Pattern
```tsx
<GlassMagneticButton
  variant="primary"
  magneticStrength={0.3}     // 0.1 - 1.0 range
  enableHaptic={true}        // Enable haptic feedback
  className="glass-focus glass-touch-target"
>
  Magnetic Action
</GlassMagneticButton>
```

### Cards

#### Standard Card Pattern
```tsx
<GlassCard
  elevation="level2"         // Cards typically use level2
  className="glass-p-6 glass-radius-lg"
  hoverable={true}           // Enable hover effects
  clickable={false}         // Only if card is clickable
>
  <GlassCard.Header>
    <h3 className="glass-text-lg glass-font-semibold">Card Title</h3>
  </GlassCard.Header>
  <GlassCard.Content>
    Card content goes here
  </GlassCard.Content>
</GlassCard>
```

#### Interactive Card Pattern
```tsx
<GlassCard
  elevation="level2"
  className="glass-focus glass-cursor-pointer"
  onClick={handleCardClick}
  role="button"              // Required for clickable cards
  tabIndex={0}               // Keyboard navigation
  onKeyDown={handleKeyDown}  // Handle keyboard events
  aria-label="Open item details"
>
  Card content
</GlassCard>
```

### Form Elements

#### Input Field Pattern
```tsx
<GlassInput
  label="Field Label"        // Always provide labels
  placeholder="Enter value"
  value={value}
  onChange={handleChange}
  required={isRequired}
  error={errorMessage}       // Error state handling
  helperText="Additional context"
  className="glass-focus"    // Focus styles
  aria-describedby="field-help"
/>
```

#### Select Pattern
```tsx
<GlassSelect
  label="Select Option"
  value={selectedValue}
  onChange={handleSelectChange}
  options={options}
  placeholder="Choose an option"
  elevation="level3"         // Dropdowns use level3
  className="glass-focus"
  required={isRequired}
/>
```

### Navigation

#### Header Pattern
```tsx
<GlassHeader
  variant="floating"         // default | floating | sticky | transparent
  size="md"                  // sm | md | lg
  logo={<YourLogo />}
  navigation={<NavItems />}
  search={{
    placeholder: "Search...",
    suggestions: searchSuggestions,
    onSearch: handleSearch
  }}
  userMenu={{
    user: currentUser,
    items: menuItems
  }}
  className="glass-z-50"     // Proper z-index for headers
/>
```

#### Sidebar Pattern
```tsx
<GlassSidebar
  variant="persistent"       // persistent | overlay | mini
  width="280px"              // Standard sidebar width
  elevation="level2"
  collapsible={true}
  className="glass-border-r"
>
  <GlassSidebar.Header>
    Navigation Header
  </GlassSidebar.Header>
  <GlassSidebar.Content>
    <nav role="navigation">
      Navigation items
    </nav>
  </GlassSidebar.Content>
</GlassSidebar>
```

### Modals & Overlays

#### Modal Pattern
```tsx
<GlassModal
  open={isOpen}
  onClose={handleClose}
  elevation="level5"         // Top-level overlays use level5
  backdrop="blur"            // Enable backdrop blur
  closeOnBackdropClick={true}
  aria-labelledby="modal-title"
  className="glass-max-w-lg"
>
  <GlassModal.Header>
    <h2 id="modal-title">Modal Title</h2>
    <GlassButton
      variant="ghost" 
      size="sm"
      onClick={handleClose}
      aria-label="Close modal"
    >
      ×
    </GlassButton>
  </GlassModal.Header>
  <GlassModal.Content>
    Modal content
  </GlassModal.Content>
  <GlassModal.Footer>
    <GlassButton onClick={handleClose} variant="secondary">
      Cancel
    </GlassButton>
    <GlassButton onClick={handleConfirm} variant="primary">
      Confirm
    </GlassButton>
  </GlassModal.Footer>
</GlassModal>
```

#### Tooltip Pattern
```tsx
<GlassTooltip
  content="Helpful tooltip text"
  placement="top"            // top | bottom | left | right
  elevation="level4"         // Tooltips use level4
  delay={300}                // Show delay in ms
  className="glass-max-w-xs"
>
  <GlassButton>Hover me</GlassButton>
</GlassTooltip>
```

## 🎨 Styling Standards

### Glass Utility Classes

#### Core Glass Classes
```css
.glass                    /* Base glass foundation */
.glass-elev-level1       /* Semantic elevation (level1-level5) */
.glass-blur-md           /* Blur intensity (none, sm, md, lg, xl) */
.glass-radius-lg         /* Border radius (sm, md, lg, xl, full) */
.glass-focus             /* Focus states (required for interactive elements) */
.glass-touch-target      /* Minimum touch target size */
```

#### Spacing Classes (4px grid system)
```css
/* Margin */
.glass-m-1     /* 4px margin */
.glass-m-2     /* 8px margin */
.glass-m-4     /* 16px margin */
.glass-m-6     /* 24px margin */
.glass-m-8     /* 32px margin */

/* Padding */
.glass-p-1     /* 4px padding */
.glass-p-2     /* 8px padding */
.glass-p-4     /* 16px padding */
.glass-p-6     /* 24px padding */
.glass-p-8     /* 32px padding */

/* Directional spacing */
.glass-mt-4    /* Margin top */
.glass-mb-4    /* Margin bottom */
.glass-px-4    /* Horizontal padding */
.glass-py-4    /* Vertical padding */
```

#### Color Classes
```css
/* Text Colors */
.glass-text-primary      /* Primary text color */
.glass-text-secondary    /* Secondary text color */
.glass-text-muted        /* Muted text color */
.glass-text-success      /* Success state text */
.glass-text-warning      /* Warning state text */
.glass-text-danger       /* Error state text */

/* Surface Colors */
.glass-surface-primary   /* Primary surface */
.glass-surface-secondary /* Secondary surface */
.glass-surface-success   /* Success surface */
.glass-surface-warning   /* Warning surface */
.glass-surface-danger    /* Error surface */
```

### Component Size Standards

#### Button Sizes
```tsx
// Small: 32px height, 12px padding
<GlassButton size="sm">Small</GlassButton>

// Medium: 40px height, 16px padding  
<GlassButton size="md">Medium</GlassButton>

// Large: 48px height, 20px padding
<GlassButton size="lg">Large</GlassButton>
```

#### Touch Targets
Ensure all interactive elements meet minimum touch target sizes:
```css
.glass-touch-target {
  min-height: 44px;
  min-width: 44px;
}
```

## ♿ Accessibility Standards

### Required Attributes

#### Interactive Elements
All interactive elements must include:
```tsx
// Required attributes
className="glass-focus"           // Focus styles
role="button"                     // Semantic role
tabIndex={0}                      // Keyboard navigation
aria-label="Descriptive label"   // Screen reader label
onKeyDown={handleKeyDown}         // Keyboard handling
```

#### Form Elements
```tsx
<GlassInput
  id="field-id"                   // Unique ID
  label="Field Label"             // Associated label
  aria-describedby="field-help"   // Helper text reference
  aria-invalid={hasError}         // Error state
  required={isRequired}           // Required state
/>
```

#### Loading States
```tsx
<GlassButton
  disabled={isLoading}
  aria-label={isLoading ? "Loading..." : "Submit form"}
>
  {isLoading ? (
    <>
      <GlassSpinner size="sm" />
      Loading...
    </>
  ) : (
    "Submit"
  )}
</GlassButton>
```

### Focus Management

#### Focus Styles
All interactive elements must have visible focus indicators:
```css
.glass-focus:focus-visible {
  outline: var(--glass-focus-width) solid var(--glass-focus-color-primary);
  outline-offset: var(--glass-focus-offset);
}
```

#### Focus Trapping
For modals and dropdowns:
```tsx
import { useFocusTrap } from 'aura-glass';

function MyModal({ isOpen }) {
  const focusTrapRef = useFocusTrap(isOpen);
  
  return (
    <GlassModal ref={focusTrapRef}>
      Modal content
    </GlassModal>
  );
}
```

## 🎭 Motion & Animation Standards

### Animation Classes
```css
.glass-animate-float     /* Subtle floating animation */
.glass-animate-shimmer   /* Light sweep animation */
.glass-animate-ambient   /* Breathing opacity */
.glass-animate-press     /* Click feedback */
.glass-animate-pulse     /* Loading pulse */
```

### Reduced Motion Support
All animations respect user preferences:
```css
@media (prefers-reduced-motion: reduce) {
  .glass-animate-float {
    animation: none !important;
  }
}
```

### Custom Animations
When creating custom animations:
```css
@keyframes my-custom-animation {
  /* Animation keyframes */
}

.my-component {
  animation: my-custom-animation var(--glass-motion-duration-normal) var(--glass-motion-ease-standard);
}

/* Always include reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .my-component {
    animation: none !important;
  }
}
```

## 🔧 Performance Standards

### Component Performance

#### Lazy Loading
```tsx
// Use dynamic imports for large components
const GlassChart = lazy(() => import('./GlassChart'));

function MyDashboard() {
  return (
    <Suspense fallback={<GlassLoadingSkeleton />}>
      <GlassChart data={chartData} />
    </Suspense>
  );
}
```

#### Memoization
```tsx
// Memoize expensive components
const MemoizedGlassCard = memo(GlassCard);

// Use callback memoization
const handleClick = useCallback(() => {
  // Handle click
}, [dependency]);
```

#### Virtualization
For large lists:
```tsx
<GlassVirtualList
  items={largeDataset}
  itemHeight={60}
  renderItem={({ item, index }) => (
    <GlassCard key={item.id}>
      {item.content}
    </GlassCard>
  )}
/>
```

## 🧪 Testing Standards

### Component Testing
```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { GlassButton } from 'aura-glass';

describe('GlassButton', () => {
  it('should be accessible', async () => {
    render(
      <GlassButton aria-label="Test button">
        Click me
      </GlassButton>
    );
    
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveAccessibleName('Test button');
  });

  it('should handle keyboard interaction', () => {
    const handleClick = jest.fn();
    render(
      <GlassButton onClick={handleClick}>
        Click me
      </GlassButton>
    );
    
    const button = screen.getByRole('button');
    fireEvent.keyDown(button, { key: 'Enter' });
    expect(handleClick).toHaveBeenCalled();
  });
});
```

### Visual Testing
```tsx
// Storybook visual regression tests
export const AllVariants = () => (
  <div className="glass-p-4 glass-space-y-4">
    <GlassButton variant="primary">Primary</GlassButton>
    <GlassButton variant="secondary">Secondary</GlassButton>
    <GlassButton variant="ghost">Ghost</GlassButton>
    <GlassButton variant="danger">Danger</GlassButton>
  </div>
);
```

## 📋 Code Review Checklist

When reviewing component implementations:

### ✅ Design System Compliance
- [ ] Uses design tokens instead of hardcoded values
- [ ] Follows semantic elevation system
- [ ] Uses proper glass utility classes
- [ ] Maintains consistent spacing (4px grid)
- [ ] Includes proper focus styles

### ✅ Accessibility
- [ ] Has proper semantic markup
- [ ] Includes ARIA attributes where needed
- [ ] Supports keyboard navigation
- [ ] Has sufficient color contrast
- [ ] Meets touch target size requirements

### ✅ Performance
- [ ] Uses memoization where appropriate
- [ ] Implements lazy loading for heavy components
- [ ] Avoids unnecessary re-renders
- [ ] Uses virtualization for large datasets

### ✅ Testing
- [ ] Has comprehensive unit tests
- [ ] Includes accessibility tests
- [ ] Has visual regression tests
- [ ] Tests keyboard interactions

## 🚨 Common Mistakes to Avoid

### ❌ Anti-Patterns

#### Inline Styles
```tsx
// Bad: Inline glass styles
<div style={{ backdropFilter: 'blur(8px)' }} />

// Good: Use utilities or createGlassStyle()
<div className="glass-blur-md" />
```

#### Raw Colors
```tsx
// Bad: Hardcoded colors
<div style={{ color: '#ffffff' }} />

// Good: Token-based colors
<div className="glass-text-white" />
```

#### Missing Focus States
```tsx
// Bad: No focus management
<div onClick={handleClick}>Clickable div</div>

// Good: Proper interactive element
<button 
  onClick={handleClick}
  className="glass-focus"
>
  Button text
</button>
```

#### Inconsistent Elevation
```tsx
// Bad: Random elevation values
<GlassCard elevation="level4" />  // Too high for a card

// Good: Semantic elevation
<GlassCard elevation="level2" />  // Appropriate for cards
```

## 📚 Related Resources

- [Elevation Guidelines](./elevation-guidelines.md)
- [Design System Enforcement](./design-system-enforcement.md)
- [Button Spacing Guide](./button-spacing.md)
- [Glass Utility Reference](../utilities/glass-utilities.md)
- [Migration Guide](./migration.md)
- [Accessibility Guide](./accessibility.md)

---

Following these component standards ensures consistency, accessibility, and maintainability across the entire AuraGlass design system while maintaining our 100/100 design system score.
### 4. Automatic Text Contrast (NEW)
When components render over gradients or dynamic backgrounds, avoid hardcoded white/black text. Use token-driven auto-contrast:

- Attribute-driven override on a section:
```html
<section data-bg="dark">   <!-- forces white-on-dark tokens inside -->
  <h1 class="glass-text-primary">Readable on dark</h1>
  <p class="glass-text-secondary">Secondary contrast token</p>
  ...
</section>
```

- Auto-detect for dynamic backgrounds:
```tsx
import useAutoTextContrast from '@/hooks/useAutoTextContrast';

export function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  useAutoTextContrast(ref, { threshold: 0.55, observe: true });
  return (
    <div ref={ref}>
      <h2 className="glass-text-primary">Always readable</h2>
      <p className="glass-text-secondary">Tokens flip to match background luminance.</p>
    </div>
  );
}
```

This flips `--glass-text-*` tokens to white-on-dark or black-on-light without inline styles, preserving full lint/token compliance.
