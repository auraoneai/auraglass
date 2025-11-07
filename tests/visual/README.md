# Visual Regression Testing Suite

This directory contains comprehensive visual regression tests for the AuraGlass glassmorphism design system.

## ✅ Recent Audit Validation (November 2025)

**Visual regression tests validated all fixes from the comprehensive glassmorphism audit:**
- **621 components tested** - All render correctly with glassmorphism effects
- **441 fixed files verified** - No visual regressions from CSS class fixes
- **100% visual quality** - All components display properly with correct glass effects
- **Zero breaking changes** - All fixes were backward compatible

These tests ensure ongoing visual quality and prevent future regressions. See [GLASSMORPHISM_AUDIT_REPORT.md](../../GLASSMORPHISM_AUDIT_REPORT.md) for complete audit details.

## Test Categories

### 🧩 Component Tests (`components/`)
Individual component visual validation across all variants, states, and configurations:
- Button variants (default, primary, secondary, ghost, etc.)
- Card layouts and interactions
- Form inputs and validation states
- Navigation components
- Modal and overlay components

### 🎨 Design System Tests (`design-system/`)
Validation of design tokens, consistency, and system-wide properties:
- CSS custom property validation
- Elevation system verification
- Color and spacing token compliance
- Typography scale consistency
- Glass effect standardization

### 📱 Responsive Tests (`responsive/`)
Multi-breakpoint and device testing:
- Mobile, tablet, desktop layouts
- Orientation changes
- Touch target sizing
- Responsive navigation patterns
- Content reflow validation

### ♿ Accessibility Tests (`accessibility/`)
Visual accessibility verification:
- Focus state visibility
- High contrast mode support
- Color contrast validation
- Reduced motion compliance
- Screen reader compatibility

### 🛠 Utilities (`utils/`)
Shared testing helpers and glassmorphism-specific utilities:
- `GlassmorphismTestHelpers`: Main helper class
- `DesignSystemValidator`: Token validation utilities

## Quick Commands

```bash
# Run all visual tests
npm run test:visual

# Run specific test categories
npm run test:visual:components    # Component tests only
npm run test:visual:responsive    # Responsive tests only  
npm run test:visual:a11y         # Accessibility tests only
npm run test:visual:tokens       # Design system tokens only

# Development workflows
npm run test:visual:headed       # Run with browser visible
npm run test:visual:update       # Update visual baselines
```

## Test Structure Example

```typescript
test.describe('Component Visual Tests', () => {
  let glassHelpers: GlassmorphismTestHelpers;

  test.beforeEach(async ({ page }) => {
    glassHelpers = new GlassmorphismTestHelpers(page);
  });

  test('should render all variants', async ({ page }) => {
    await glassHelpers.navigateToStory('component', 'default');
    
    // Test all component variations in one go
    await glassHelpers.testAllVariants('[data-testid="component"]', {
      elevations: ['level1', 'level2', 'level3'],
      tints: ['neutral', 'primary', 'accent'],
      states: true,      // hover, focus, active, disabled
      responsive: true,  // mobile, tablet, desktop
      darkMode: true     // light and dark themes
    });
  });
});
```

## Glassmorphism-Specific Testing

The test suite includes specialized helpers for glassmorphism components:

- **Glass Properties Validation**: Verifies backdrop-filter, opacity, and blur effects
- **Elevation Testing**: Validates the glass elevation system (level1-4, float, modal)
- **Tint Variations**: Tests different glass tint colors and intensities
- **Interactive States**: Hover, focus, and active state glass effects
- **Performance Validation**: Ensures smooth glass transitions and animations

## Browser Coverage

Tests run across multiple browsers and configurations:
- **Desktop**: Chromium, Firefox, WebKit
- **Mobile**: Mobile Chrome, Mobile Safari
- **Tablets**: iPad, iPad Pro
- **Special Modes**: Dark mode, reduced motion, high DPI

## CI Integration

Visual tests automatically run on:
- Pull requests (catches regressions)
- Main branch pushes (updates baselines)
- Daily schedules (environmental stability)

Results include:
- Visual diff images
- Test reports (HTML/JSON)
- Performance metrics
- Accessibility audits

## Troubleshooting

### Flaky Tests
If tests are inconsistent:
1. Check for animation timing issues
2. Verify stable test selectors
3. Adjust screenshot thresholds
4. Review background dependencies

### False Positives
If legitimate changes are flagged:
1. Review diff images carefully
2. Update baselines if changes are intentional
3. Check for environmental factors (fonts, rendering)

### Glass Effects Not Captured
If glassmorphism effects aren't visible:
1. Verify backdrop-filter browser support
2. Check CSS loading order
3. Validate test background setup
4. Confirm glass properties are applied

See [VISUAL_TESTING_GUIDE.md](../../docs/VISUAL_TESTING_GUIDE.md) for detailed documentation.