# AuraGlass by AuraOne Elevation Guidelines

## Overview

This document defines the elevation system for the AuraGlass by AuraOne component library. Elevation creates visual hierarchy and depth through consistent shadow systems that help users understand the layered nature of interface elements.

## Elevation Levels

Our elevation system uses 7 distinct levels (0-6), each serving specific UI purposes and following semantic naming conventions:

### Level 0 - Flat Surface
- **Use for**: Base containers, backgrounds, disabled elements
- **Visual**: No shadow, flush with surface
- **Example**: Disabled buttons, inactive tabs, background panels

### Level 1 - Subtle Elements  
- **Use for**: Badges, chips, tags, inline feedback, skeleton loaders
- **Visual**: Very subtle shadow (2px blur, 12% opacity)
- **Example**: Status badges, filter chips, loading states
- **CSS**: `box-shadow: 0 2px 8px rgba(0 0 0 / 0.12)`

### Level 2 - Interactive Elements
- **Use for**: Buttons, cards, form inputs, interactive controls, navigation items
- **Visual**: Moderate shadow (4px blur, 16% opacity)  
- **Example**: Primary buttons, input fields, cards, menu items
- **CSS**: `box-shadow: 0 4px 16px rgba(0 0 0 / 0.16)`

### Level 3 - Overlay Elements
- **Use for**: Dropdown menus, modals, popovers, hover cards, sheets
- **Visual**: Pronounced shadow (8px blur, 20% opacity)
- **Example**: Select dropdowns, context menus, bottom sheets
- **CSS**: `box-shadow: 0 8px 24px rgba(0 0 0 / 0.20)`

### Level 4 - Floating Elements  
- **Use for**: Tooltips, notifications, toasts, command palettes, FABs
- **Visual**: Strong shadow (12px blur, 24% opacity)
- **Example**: Floating action buttons, toast messages, tooltips
- **CSS**: `box-shadow: 0 12px 32px rgba(0 0 0 / 0.24)`

### Level 5 - Top-level Overlays
- **Use for**: Modal backdrops, global overlays, navigation bars, headers
- **Visual**: Strong shadow (16px blur, 28% opacity)
- **Example**: Page modals, navigation headers, global announcement bars
- **CSS**: `box-shadow: 0 16px 40px rgba(0 0 0 / 0.28)`

### Level 6 - Maximum Elevation
- **Use for**: Fullscreen overlays, system-level modals, critical alerts
- **Visual**: Maximum shadow (24px blur, 32% opacity)
- **Example**: Fullscreen modals, system alerts, loading overlays
- **CSS**: `box-shadow: 0 24px 56px rgba(0 0 0 / 0.32)`

## Component-Specific Guidelines

### Buttons
- **Default buttons**: `elevation="level2"`
- **Floating Action Buttons**: `elevation="level4"`
- **Disabled buttons**: `elevation="level0"`

### Cards & Containers
- **Static cards**: `elevation="level2"`
- **Interactive cards**: `elevation="level2"` (hover to `level3`)
- **Modal containers**: `elevation="level5"`

### Navigation
- **Bottom navigation**: `elevation="level2"`
- **Dropdown menus**: `elevation="level3"`
- **Context menus**: `elevation="level4"`
- **Mobile navigation**: `elevation="level2"`

### Form Elements
- **Input fields**: `elevation="level2"`
- **Select dropdowns**: `elevation="level3"`
- **Date pickers**: `elevation="level3"`

### Feedback Elements
- **Tooltips**: `elevation="level4"`
- **Toasts**: `elevation="level4"`
- **Badges**: `elevation="level1"`
- **Progress indicators**: `elevation="level1"`

### Overlays
- **Modals**: `elevation="level5"`
- **Fullscreen modals**: `elevation="level6"`
- **Popovers**: `elevation="level3"`
- **Hover cards**: `elevation="level3"`
- **Command palette**: `elevation="level4"`
- **System alerts**: `elevation="level6"`

## Implementation

### Using Elevation in Components

```tsx
import { OptimizedGlass } from '@/primitives';

// Correct - use string format
<OptimizedGlass elevation="level2">
  Button content
</OptimizedGlass>

// Incorrect - avoid numeric format
<OptimizedGlass elevation={2}>
  Button content  
</OptimizedGlass>
```

### CSS Classes

Elevation can also be applied via CSS classes:

```css
/* Numeric elevation classes (legacy) */
.glass-elev-0 { box-shadow: none; }
.glass-elev-1 { box-shadow: var(--glass-elev-1); }
.glass-elev-2 { box-shadow: var(--glass-elev-2); }
.glass-elev-3 { box-shadow: var(--glass-elev-3); }
.glass-elev-4 { box-shadow: var(--glass-elev-4); }
.glass-elev-5 { box-shadow: var(--glass-elev-5); }
.glass-elev-6 { box-shadow: var(--glass-elev-6); }

/* Semantic elevation classes (preferred) */
.glass-elev-level0 { box-shadow: var(--glass-elev-0); }
.glass-elev-level1 { box-shadow: var(--glass-elev-1); }
.glass-elev-level2 { box-shadow: var(--glass-elev-2); }
.glass-elev-level3 { box-shadow: var(--glass-elev-3); }
.glass-elev-level4 { box-shadow: var(--glass-elev-4); }
.glass-elev-level5 { box-shadow: var(--glass-elev-5); }
.glass-elev-level6 { box-shadow: var(--glass-elev-6); }
```

## Accessibility Considerations

- Elevation should supplement, not replace, proper focus indicators
- Ensure sufficient contrast between elevated elements and their backgrounds
- Consider users with motion sensitivity - elevation changes should be subtle
- Screen readers rely on semantic markup, not visual elevation

## Animation Guidelines

When animating elevation changes:
- Use smooth transitions: `transition: box-shadow 250ms ease`
- Hover states can increase elevation by one level maximum
- Press states can decrease elevation by one level
- Avoid rapid elevation changes that may trigger motion sensitivity

## Common Mistakes

❌ **Don't**: Use arbitrary elevation values
❌ **Don't**: Mix numeric and string elevation formats  
❌ **Don't**: Skip elevation levels (level1 → level4)
❌ **Don't**: Use high elevation for static content

✅ **Do**: Follow the semantic hierarchy
✅ **Do**: Use consistent semantic format (`"level1"`, `"level2"`, etc.)
✅ **Do**: Prefer semantic classes (`.glass-elev-level2`) over numeric (`.glass-elev-2`)
✅ **Do**: Test elevation in different themes and contexts
✅ **Do**: Consider the user's visual journey through elevation layers

## Testing Elevation

1. **Visual hierarchy**: Can users quickly identify interactive vs static elements?
2. **Consistency**: Do similar components use the same elevation level?
3. **Accessibility**: Does elevation work with focus indicators?
4. **Theme compatibility**: Does elevation work in light and dark modes?
5. **Performance**: Are elevation changes smooth and performant?

## Migration Guide

If updating existing components:

1. Identify the component's primary purpose (interactive, overlay, etc.)
2. Map to the appropriate elevation level using the guidelines above
3. Update from numeric format (`elevation={2}`) to string format (`elevation="level2"`)
4. Test the component in context with other elevated elements
5. Verify accessibility and theme compatibility

## Quick Reference

| Level | Use Cases | Shadow Blur | Opacity | Components |
|-------|-----------|-------------|---------|------------|
| 0 | Flat surfaces, disabled | None | N/A | Disabled buttons, backgrounds |
| 1 | Subtle elements | 2px | 12% | Badges, chips, skeletons |
| 2 | Interactive elements | 4px | 16% | Buttons, cards, inputs |
| 3 | Overlay elements | 8px | 20% | Dropdowns, popovers |
| 4 | Floating elements | 12px | 24% | FABs, tooltips, toasts |
| 5 | Top-level overlays | 16px | 28% | Modals, headers |
| 6 | Maximum elevation | 24px | 32% | Fullscreen overlays, alerts |

## Design Token Usage

```css
/* Use these CSS custom properties in your styles */
--glass-elev-0: none;
--glass-elev-1: 0 2px 8px rgba(var(--glass-color-black) / 0.12);
--glass-elev-2: 0 4px 16px rgba(var(--glass-color-black) / 0.16);
--glass-elev-3: 0 8px 24px rgba(var(--glass-color-black) / 0.20);
--glass-elev-4: 0 12px 32px rgba(var(--glass-color-black) / 0.24);
--glass-elev-5: 0 16px 40px rgba(var(--glass-color-black) / 0.28);
--glass-elev-6: 0 24px 56px rgba(var(--glass-color-black) / 0.32);
```

## Related Resources

- [Design Tokens](../../src/styles/tokens.css)
- [Glass Utilities](../../src/styles/glass.css)
- [Component Standards](../guides/component-standards.md)
- [Design System Enforcement](./design-system-enforcement.md)
- [Button Spacing Guide](./button-spacing.md)
- [Accessibility Guide](./accessibility.md)
