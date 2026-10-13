# AuraGlass by AuraOne Component Standards

> **5.0 note:** this guide was written for the 4.x `Glass*` components and
> `glass-*` utility classes, both removed in 5.0. The standards below are
> unchanged; every sample now uses the 5.0 API (`Surface`, `Button`,
> `Card`, `TextField`, `Select`, `Dialog`, `Tooltip`, the app-shell
> surfaces, and `--ag-*` tokens). Elevation levels (`level1`–`level5`) map
> to the material engine's `layer` + `variant` + `thickness` axes.

## Overview

This document defines proper usage patterns, standards, and best practices for all AuraGlass by AuraOne components. Following these standards ensures consistency, accessibility, and maintainability across the design system while maintaining our 100/100 design system score.

## 🎯 Core Principles

### 1. Token-First Architecture
Always use design tokens instead of hardcoded values:

```tsx
import { Surface } from 'aura-glass/material';

export function TokenFirst() {
  return (
    <>
      {/* ❌ Bad: hardcoded optical values */}
      <div style={{ backdropFilter: 'blur(16px)', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '12px' }} />

      {/* ✅ Good: pick a layer; the material engine resolves the tokens */}
      <Surface layer="chrome" thickness="regular" />
    </>
  );
}
```

### 2. Semantic Elevation System
Use semantic elevation levels instead of arbitrary values:

```tsx
import { Card } from 'aura-glass';

export function Elevation() {
  return (
    <>
      {/* ❌ Bad: raw shadows/blur numbers on a plain div */}
      <div style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.2)' }} />

      {/* ✅ Good: the card's material comes from variant × thickness */}
      <Card variant="regular" thickness="regular" />
    </>
  );
}
```

### 3. Accessibility First
All interactive components must include proper accessibility attributes:

```tsx
import { Button } from 'aura-glass';

// ✅ Good: a real button with an accessible name (focus ring and touch
// target are built into the component — no utility classes needed).
export function SaveButton({ onSave }: { onSave: () => void }) {
  return (
    <Button onClick={onSave} aria-label="Save changes">
      Save
    </Button>
  );
}
```

## 🧱 Component Usage Patterns

### Buttons

#### Standard Button Pattern
```tsx
import { Button } from 'aura-glass';

export function StandardButton({ isDisabled, onAction }: { isDisabled: boolean; onAction: () => void }) {
  return (
    <Button
      variant="regular"        // regular | clear | identity (material axis)
      size="md"                // sm | md | lg
      disabled={isDisabled}    // proper disabled state
      onClick={onAction}
      aria-label="Descriptive label"
    >
      Button Text
    </Button>
  );
}
```

#### Pointer-Light Button Pattern
```tsx
import { Button } from 'aura-glass';

export function PointerLightButton() {
  // Pointer-light is the 5.0 successor to the magnetic hover treatment;
  // the material engine installs the highlight, the button just opts in.
  return (
    <Button variant="regular" pointerLight>
      Magnetic Action
    </Button>
  );
}
```

### Cards

#### Standard Card Pattern
```tsx
import { Card } from 'aura-glass';

export function StandardCard() {
  return (
    <Card variant="regular" thickness="regular">
      <Card.Header>
        <Card.Title>Card Title</Card.Title>
      </Card.Header>
      <Card.Body>Card content goes here</Card.Body>
    </Card>
  );
}
```

#### Interactive Card Pattern
```tsx
import { Card } from 'aura-glass';

export function InteractiveCard({ onOpen }: { onOpen: () => void }) {
  // `interactive` + `render` makes the card itself the button, so role,
  // focus and keyboard activation come from the rendered element.
  return (
    <Card interactive render={<button type="button" onClick={onOpen} aria-label="Open item details" />}>
      Card content
    </Card>
  );
}
```

### Form Elements

#### Input Field Pattern
```tsx
import { TextField } from 'aura-glass';

export function NameField({
  value, onValueChange, errorMessage,
}: {
  value: string;
  onValueChange: (value: string) => void;
  errorMessage?: string;
}) {
  return (
    <TextField
      label="Field Label"            // always provide labels
      placeholder="Enter value"
      value={value}
      onValueChange={onValueChange}
      required
      error={errorMessage}           // error state handling
      description="Additional context" // linked via aria-describedby for you
    />
  );
}
```

#### Select Pattern
```tsx
import { Select } from 'aura-glass';

const options = [
  { value: 'one', label: 'Option one' },
  { value: 'two', label: 'Option two' },
];

export function OptionSelect({
  value, onValueChange,
}: {
  value: string | null;
  onValueChange: (value: string | null) => void;
}) {
  return (
    <Select.Root value={value} onValueChange={(next) => onValueChange(next as string | null)}>
      <Select.Trigger placeholder="Choose an option" aria-label="Select Option">
        <Select.Value />
      </Select.Trigger>
      <Select.Content>
        {options.map((option) => (
          <Select.Item key={option.value} value={option.value} label={option.label}>
            {option.label}
          </Select.Item>
        ))}
      </Select.Content>
    </Select.Root>
  );
}
```

### Navigation

#### Header Pattern
```tsx
import { TopBar } from 'aura-glass/app-shell';

export function Header({ logo, navigation, userMenu }: {
  logo: React.ReactNode;
  navigation: React.ReactNode;
  userMenu: React.ReactNode;
}) {
  // The header is composition, not a config object: leading, center and
  // trailing parts slot into the chrome-material TopBar.
  return (
    <TopBar.Root placement="overlay">
      <TopBar.Leading>{logo}</TopBar.Leading>
      <TopBar.Center>{navigation}</TopBar.Center>
      <TopBar.Trailing>{userMenu}</TopBar.Trailing>
    </TopBar.Root>
  );
}
```

#### Sidebar Pattern
```tsx
import { Sidebar } from 'aura-glass/app-shell';

export function AppSidebar() {
  return (
    <Sidebar.Root>
      <Sidebar.Header>Navigation Header</Sidebar.Header>
      <Sidebar.Content>
        <Sidebar.Nav aria-label="Primary">Navigation items</Sidebar.Nav>
      </Sidebar.Content>
    </Sidebar.Root>
  );
}
```

### Modals & Overlays

#### Modal Pattern
```tsx
import { Button, Dialog } from 'aura-glass';

export function ConfirmDialog({
  open, onOpenChange, onConfirm,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}) {
  return (
    <Dialog.Root open={open} onOpenChange={(next) => onOpenChange(next)}>
      <Dialog.Content>
        <Dialog.Header>
          <Dialog.Title>Modal Title</Dialog.Title>
          <Dialog.Close aria-label="Close modal">×</Dialog.Close>
        </Dialog.Header>
        <Dialog.Body>Modal content</Dialog.Body>
        <Dialog.Footer>
          <Dialog.Close>Cancel</Dialog.Close>
          <Button onClick={onConfirm}>Confirm</Button>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog.Root>
  );
}
```

#### Tooltip Pattern
```tsx
import { Button, Tooltip } from 'aura-glass';

export function HoverHelp() {
  return (
    <Tooltip.Root delay={300}>
      <Tooltip.Trigger>
        <Button>Hover me</Button>
      </Tooltip.Trigger>
      <Tooltip.Content side="top">Helpful tooltip text</Tooltip.Content>
    </Tooltip.Root>
  );
}
```

## 🎨 Styling Standards

### Glass Utility Classes

> **Removed in 5.0:** the `glass-*` utility classes below are 4.x globals. 5.0 ships layered component CSS in `aura-glass/styles.css` and `--ag-*` tokens instead; the old globals and `--glass-*` variables remain available only as escape hatches via `aura-glass/compat/globals.css` and `aura-glass/compat/tokens.css`. The listings below are kept as a 4.x → 5.0 mapping reference (spacing values still apply; set them with your own CSS or Tailwind).

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
import { Button } from 'aura-glass';

export function ButtonSizes() {
  return (
    <>
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
    </>
  );
}
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
import { Button } from 'aura-glass';

// A native-semantics control gives you the role, focus ring, keyboard
// activation and touch target; you supply the accessible name.
export function RequiredAttributes({ onAction }: { onAction: () => void }) {
  return (
    <Button aria-label="Descriptive label" onClick={onAction}>
      Act
    </Button>
  );
}
```

#### Form Elements
```tsx
import { TextField } from 'aura-glass';

export function AccessibleField({ hasError, isRequired }: { hasError: boolean; isRequired: boolean }) {
  // id generation, label association, description linkage and the invalid
  // state are wired by the field; pass `error` and it renders Field.Error.
  return (
    <TextField
      label="Field Label"
      description="Helper text"
      error={hasError ? 'This field has an error' : undefined}
      required={isRequired}
    />
  );
}
```

#### Loading States
```tsx
import { Button } from 'aura-glass';

export function SubmitButton({ isLoading }: { isLoading: boolean }) {
  // `loading` shows the spinner, sets aria-busy and suppresses activation
  // while keeping the label mounted for assistive tech.
  return (
    <Button type="submit" loading={isLoading}>
      Submit
    </Button>
  );
}
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
import { Dialog } from 'aura-glass';

// No hook needed: a modal Dialog traps focus, inerts the page and locks
// scroll itself (`modal` defaults to true).
export function MyModal({ isOpen, onOpenChange }: {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog.Root open={isOpen} onOpenChange={(next) => onOpenChange(next)}>
      <Dialog.Content>
        <Dialog.Title>Modal content</Dialog.Title>
      </Dialog.Content>
    </Dialog.Root>
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
import * as React from 'react';
import { Skeleton } from 'aura-glass';

// Use dynamic imports for large components (your chart module, in your app).
declare const HeavyChart: React.ComponentType<{ data: readonly number[] }>;
const LazyChart = React.lazy(async () => ({ default: HeavyChart }));

export function MyDashboard({ chartData }: { chartData: readonly number[] }) {
  return (
    <React.Suspense fallback={<Skeleton />}>
      <LazyChart data={chartData} />
    </React.Suspense>
  );
}
```

#### Memoization
```tsx
import * as React from 'react';
import { Card } from 'aura-glass';

// Memoize expensive components
const MemoizedCard = React.memo(Card);

export function MemoExample({ dependency, onAction }: { dependency: string; onAction: () => void }) {
  // Use callback memoization so memoized children keep stable props.
  const handleClick = React.useCallback(() => {
    void dependency;
    onAction();
  }, [dependency, onAction]);
  return <MemoizedCard onClick={handleClick} />;
}
```

#### Virtualization
For large lists:
```tsx
import { Card } from 'aura-glass';

interface RowItem {
  id: string;
  content: string;
}

// AuraGlass does not ship a virtualizer; window the rows yourself (or with
// your app's virtualization library) and render cards for the window only.
export function WindowedCards({ items, start, count }: {
  items: readonly RowItem[];
  start: number;
  count: number;
}) {
  return (
    <>
      {items.slice(start, start + count).map((item) => (
        <Card key={item.id}>{item.content}</Card>
      ))}
    </>
  );
}
```

## 🧪 Testing Standards

### Component Testing
```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, jest } from '@jest/globals';
import { Button } from 'aura-glass';

describe('Button', () => {
  it('should be accessible', () => {
    render(<Button aria-label="Test button">Click me</Button>);

    const button = screen.getByRole('button');
    expect(button.getAttribute('aria-label')).toBe('Test button');
  });

  it('should handle keyboard interaction', async () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    const button = screen.getByRole('button');
    button.focus();
    await userEvent.keyboard('{Enter}');
    expect(handleClick).toHaveBeenCalled();
  });
});
```

### Visual Testing
```tsx
import { Button } from 'aura-glass';

// Storybook visual regression tests
export const AllVariants = () => (
  <div style={{ padding: 16, display: 'grid', gap: 16 }}>
    <Button variant="regular">Regular</Button>
    <Button variant="clear">Clear</Button>
    <Button variant="identity">Identity</Button>
    <Button intent="danger">Danger</Button>
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
import { Surface } from 'aura-glass/material';

// Bad: inline glass styles
export const BadInline = () => <div style={{ backdropFilter: 'blur(8px)' }} />;

// Good: let the material engine own the optics
export const GoodSurface = () => <Surface layer="overlay" thickness="thin" />;
```

#### Raw Colors
```tsx
// Bad: hardcoded colors
export const BadColor = () => <div style={{ color: '#ffffff' }} />;

// Good: token-based colors (`--ag-on-surface` follows the material)
export const GoodColor = () => <div style={{ color: 'var(--ag-on-surface)' }} />;
```

#### Missing Focus States
```tsx
import { Button } from 'aura-glass';

export function FocusStates({ onAction }: { onAction: () => void }) {
  return (
    <>
      {/* Bad: no focus management, no keyboard path */}
      <div onClick={onAction}>Clickable div</div>

      {/* Good: a proper interactive element */}
      <Button onClick={onAction}>Button text</Button>
    </>
  );
}
```

#### Inconsistent Elevation
```tsx
import { Card } from 'aura-glass';

export function ElevationChoice() {
  return (
    <>
      {/* Bad: thick overlay glass on a reading surface */}
      <Card variant="regular" thickness="thick" />

      {/* Good: content cards stay on the regular content material */}
      <Card variant="regular" thickness="regular" />
    </>
  );
}
```

## 📚 Related Resources

- [Elevation Guidelines](./elevation-guidelines.md)
- [Design System Enforcement](./design-system-enforcement.md)
- [Button Spacing Guide](./button-spacing.md)
- Glass Utility Reference (4.x; deleted in the 5.0 GA cleanup, 2026-10-13)
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

- Dynamic backgrounds: render the text on a `Surface`. The material keeps
  its own legibility over any backdrop (vibrancy and the contrast-safe
  `--ag-on-surface` tokens), so no luminance-detection hook is needed:
```tsx
import { Surface } from 'aura-glass';

export function Hero() {
  return (
    <Surface layer="chrome">
      <h2>Always readable</h2>
      <p>Text tokens follow the material, not the pixels behind it.</p>
    </Surface>
  );
}
```

This keeps text readable without inline styles, preserving full lint/token compliance.
