# GlassFocusIndicators

Advanced focus management system with animated rings, keyboard navigation, and screen reader integration.

## Overview

The `GlassFocusIndicators` component provides a comprehensive focus management system that enhances accessibility by providing visual feedback for keyboard navigation, screen reader announcements, and advanced keyboard shortcuts.

## Features

- **Animated Focus Rings**: Multiple variants (default, interactive, navigation, form) with smooth animations
- **Keyboard Navigation**: Enhanced shortcuts for landmarks, headings, and skip links
- **Screen Reader Integration**: Automatic announcements for focus changes
- **Focus Trapping**: Automatic modal focus management
- **Skip Links**: Quick navigation to main content areas
- **Landmark Announcements**: Automatic screen reader announcements for page landmarks

## Usage

```tsx
import { GlassFocusIndicators, SkipLinks, LandmarkAnnouncer, KeyboardShortcutsHelper } from 'aura-glass';

function App() {
  return (
    <div>
      {/* Basic focus indicators */}
      <GlassFocusIndicators />

      {/* Skip links for accessibility */}
      <SkipLinks />

      {/* Screen reader landmark announcements */}
      <LandmarkAnnouncer />

      {/* Keyboard shortcuts helper */}
      <KeyboardShortcutsHelper />

      {/* Your app content */}
      <main id="main-content">
        {/* Content */}
      </main>
    </div>
  );
}
```

## API Reference

### GlassFocusIndicators

```tsx
interface GlassFocusIndicatorsProps {
  className?: string;
}
```

### SkipLinks

Provides skip navigation links for screen reader users and keyboard navigation.

```tsx
interface SkipLinksProps {
  className?: string;
}
```

### LandmarkAnnouncer

Automatically announces page landmarks to screen readers.

```tsx
interface LandmarkAnnouncerProps {
  className?: string;
}
```

### KeyboardShortcutsHelper

Shows available keyboard shortcuts with toggle functionality (Alt + ?).

```tsx
interface KeyboardShortcutsHelperProps {
  className?: string;
}
```

## Keyboard Shortcuts

- **Alt + S**: Skip to main content
- **Alt + L**: Navigate between landmarks
- **Alt + H**: Navigate between headings
- **Alt + ?**: Toggle keyboard shortcuts helper
- **Escape**: Close current focus/modal

## Accessibility Features

### WCAG Compliance

- **2.1.1 Keyboard**: All interactive elements are keyboard accessible
- **2.4.1 Bypass Blocks**: Skip links provided for content navigation
- **2.4.7 Focus Visible**: Enhanced focus indicators with multiple variants
- **4.1.2 Name, Role, Value**: Proper ARIA attributes and screen reader support

### Screen Reader Support

- Automatic focus change announcements
- Landmark navigation announcements
- Skip link announcements
- Keyboard shortcut helper announcements

## Customization

The focus indicators automatically adapt to different element types:

- **Interactive elements** (buttons, links): Blue focus ring with glow
- **Navigation elements**: Purple focus ring for navigation context
- **Form elements**: Green focus ring for form inputs
- **Default elements**: Blue focus ring for general focus

## Dependencies

This component requires the `AccessibilityProvider` context to be available in the component tree.

```tsx
import { AccessibilityProvider } from 'aura-glass';

function App() {
  return (
    <AccessibilityProvider>
      <GlassFocusIndicators />
      {/* Your app */}
    </AccessibilityProvider>
  );
}
```

## Performance

- Uses `ResizeObserver` for efficient position tracking
- Optimized animations with `framer-motion`
- Minimal DOM impact with conditional rendering
- Event delegation for efficient event handling
