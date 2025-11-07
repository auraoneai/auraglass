# Visual Regression Testing Guide

## Overview

The AuraGlass design system includes comprehensive visual regression testing to ensure design consistency, catch visual regressions, and maintain the 100/100 design system score. Our visual testing suite covers:

- **Component Screenshots**: Baseline images for all component variants
- **Design System Validation**: Token compliance and consistency checks  
- **Responsive Testing**: Multi-breakpoint visual verification
- **Accessibility Testing**: Focus states and contrast validation
- **Glass Effects Testing**: Glassmorphism-specific visual properties

## Quick Start

```bash
# Run all visual tests
npm run test:visual

# Run tests in headed mode (see browser)
npm run test:visual:headed

# Update visual baselines
npm run test:visual:update

# Run specific test patterns
npm run test:visual -- --grep "button"
npm run test:visual -- --grep "responsive"
npm run test:visual -- --grep "accessibility"
```

## Test Structure

```
tests/visual/
├── components/          # Component-specific visual tests
│   ├── glass-button.spec.ts
│   ├── glass-card.spec.ts
│   ├── glass-input.spec.ts
│   └── ...
├── design-system/       # Design system validation
│   ├── tokens.spec.ts
│   └── consistency.spec.ts
├── responsive/          # Responsive behavior tests
│   └── breakpoints.spec.ts
├── accessibility/       # A11y visual verification
│   └── a11y-visual.spec.ts
└── utils/              # Testing utilities
    └── glassmorphism-helpers.ts
```

## Configuration

### Playwright Configuration (`playwright.config.ts`)

The configuration includes:

- **Multiple browsers**: Chrome, Firefox, Safari, Mobile devices
- **Viewports**: Desktop, tablet, mobile, ultrawide
- **Special modes**: Dark mode, reduced motion, high DPI
- **Storybook integration**: Automatic server startup
- **Screenshot settings**: Optimized thresholds and diff handling

### Key Settings

```typescript
// Screenshot comparison settings
expect: {
  threshold: 0.3,           // Pixel difference threshold
  maxDiffPixels: 1000,      // Maximum allowed different pixels
}

// Test timeout and retries
timeout: 30 * 1000,         // 30 second timeout
retries: process.env.CI ? 2 : 0,  // Retry on CI
```

## Writing Visual Tests

### Basic Component Test

```typescript
import { test, expect } from '@playwright/test';
import { GlassmorphismTestHelpers } from '../utils/glassmorphism-helpers';

test.describe('MyComponent Visual Tests', () => {
  let glassHelpers: GlassmorphismTestHelpers;

  test.beforeEach(async ({ page }) => {
    glassHelpers = new GlassmorphismTestHelpers(page);
  });

  test('should render default variant', async ({ page }) => {
    await glassHelpers.navigateToStory('mycomponent', 'default');
    
    await glassHelpers.captureComponent('[data-testid="my-component"]', {
      name: 'my-component-default',
      animations: 'disabled'
    });
  });
});
```

### Testing All Component Variants

```typescript
test('should test all variants', async ({ page }) => {
  await glassHelpers.navigateToStory('button-glassbutton', 'default');
  
  await glassHelpers.testAllVariants('button', {
    elevations: ['level1', 'level2', 'level3', 'level4'],
    tints: ['neutral', 'primary', 'secondary'],
    states: true,       // Test hover, focus, active, disabled
    responsive: true,   // Test multiple breakpoints
    darkMode: true      // Test dark mode
  });
});
```

### Glass-Specific Testing

```typescript
test('should validate glassmorphism properties', async ({ page }) => {
  await glassHelpers.navigateToStory('card-glasscard', 'default');
  
  // Validate glass effects are applied
  const properties = await glassHelpers.validateGlassProperties('[data-testid="glass-card"]');
  expect(properties.backdropFilter).toContain('blur');
  expect(properties.background).toMatch(/rgba?\([^)]+,\s*0?\.\d+\)/);
  
  // Test elevation levels
  await glassHelpers.testElevationLevels('[data-testid="glass-card"]', [
    'level1', 'level2', 'level3', 'level4'
  ]);
});
```

## Glassmorphism Test Helpers

### Key Methods

#### Navigation and Setup
- `navigateToStory(component, story)` - Navigate to Storybook story
- `waitForGlassEffects()` - Wait for glass animations to settle

#### Screenshot Capture
- `captureComponent(selector, options)` - Take component screenshot
- `testAllVariants(selector, options)` - Batch test all variants

#### Glass Validation
- `validateGlassProperties(selector)` - Check backdrop filter, opacity
- `testElevationLevels(selector, levels)` - Test glass elevation system
- `testTintVariations(selector, tints)` - Test glass tint variants

#### Interaction Testing
- `testInteractionStates(selector)` - Test hover, focus, active states
- `testDisabledState(selector)` - Test disabled styling
- `testLoadingState(selector)` - Test loading animations

#### Responsive Testing
- `testResponsiveBreakpoints(selector, breakpoints)` - Multi-viewport testing
- `testDarkMode(selector)` - Dark mode validation
- `testReducedMotion(selector)` - Accessibility motion testing

#### Accessibility
- `validateContrastRatios(selector, minRatio)` - Color contrast checking

## Breakpoints

Standard breakpoints tested:

```typescript
const breakpoints = [
  { name: 'mobile', width: 375, height: 667 },      // iPhone 12
  { name: 'mobile-lg', width: 414, height: 896 },   // iPhone 14 Plus
  { name: 'tablet', width: 768, height: 1024 },     // iPad
  { name: 'tablet-lg', width: 1024, height: 1366 }, // iPad Pro
  { name: 'desktop', width: 1440, height: 900 },    // Desktop
  { name: 'desktop-lg', width: 1920, height: 1080 },// Large Desktop
  { name: 'ultrawide', width: 2560, height: 1440 }  // Ultrawide
];
```

## CI/CD Integration

### GitHub Actions Workflow

The visual regression workflow runs on:
- **Pull requests**: Catches regressions before merge
- **Main branch pushes**: Updates baselines automatically
- **Scheduled runs**: Daily checks for environmental changes

### Workflow Jobs

1. **visual-tests**: Core visual regression testing across browsers
2. **visual-tests-mobile**: Mobile-specific responsive testing
3. **accessibility-visual-audit**: A11y visual verification
4. **design-system-validation**: Token and consistency validation
5. **pr-visual-comment**: Automated PR comments with results

### Artifact Storage

Results are stored as GitHub Actions artifacts:
- Test reports (HTML, JSON)
- Visual diff images
- Screenshot baselines
- Performance metrics

## Best Practices

### Writing Effective Visual Tests

1. **Use stable selectors**: Prefer `data-testid` over class names
2. **Disable animations**: Use `animations: 'disabled'` for consistent screenshots
3. **Wait for effects**: Always call `waitForGlassEffects()` after state changes
4. **Test edge cases**: Include loading, error, and empty states
5. **Batch similar tests**: Use `testAllVariants()` for comprehensive coverage

### Screenshot Best Practices

1. **Consistent naming**: Use descriptive, hierarchical names
2. **Appropriate thresholds**: Balance sensitivity with stability
3. **Mask dynamic content**: Hide timestamps, user-specific data
4. **Consider context**: Test components in realistic containers

### Glassmorphism-Specific Considerations

1. **Background dependency**: Test on various background colors/patterns
2. **Blur consistency**: Verify backdrop filters render consistently
3. **Opacity validation**: Ensure glass transparency is preserved
4. **Performance impact**: Monitor rendering performance on lower-end devices

## Troubleshooting

### Common Issues

#### Flaky Tests
- **Cause**: Animations not fully settled, dynamic content
- **Solution**: Increase wait times, mask dynamic elements
```typescript
await glassHelpers.waitForGlassEffects();
await page.waitForTimeout(500); // Additional wait if needed
```

#### False Positives
- **Cause**: Font rendering differences, browser inconsistencies
- **Solution**: Adjust thresholds, use consistent test environments
```typescript
await glassHelpers.captureComponent(selector, {
  name: 'component',
  threshold: 0.5, // More lenient threshold
});
```

#### Glass Effects Not Visible
- **Cause**: Missing backdrop support, CSS not loaded
- **Solution**: Verify browser support, check CSS loading
```typescript
// Validate glass properties are applied
const properties = await glassHelpers.validateGlassProperties(selector);
expect(properties.backdropFilter).not.toBe('none');
```

#### Performance Issues
- **Cause**: Complex glass effects, multiple components
- **Solution**: Reduce concurrent tests, optimize glass CSS
```bash
# Run tests serially for stability
npm run test:visual -- --workers=1
```

### Debugging Failed Tests

1. **Run in headed mode**: See what the browser sees
```bash
npm run test:visual:headed
```

2. **Check diff images**: Review actual vs expected screenshots
```bash
# Diff images are in test-results/**/*-diff.png
open test-results/
```

3. **Update baselines**: If changes are intentional
```bash
npm run test:visual:update
```

4. **Isolate specific tests**: Run only failing tests
```bash
npm run test:visual -- --grep "button-default"
```

## Maintenance

### Updating Baselines

When visual changes are intentional:

```bash
# Update all baselines
npm run test:visual:update

# Update specific component
npm run test:visual:update -- --grep "button"

# Update after reviewing diffs
git add test-results/
git commit -m "Update visual baselines for button improvements"
```

### Performance Monitoring

Monitor visual test performance:

1. **Test execution time**: Keep under 30 minutes
2. **Screenshot file sizes**: Optimize for CI artifact limits
3. **False positive rate**: Aim for <5% flaky test rate
4. **Coverage metrics**: Track component and variant coverage

### Scaling Considerations

As the design system grows:

1. **Parallel execution**: Increase worker count for faster tests
2. **Selective testing**: Run relevant tests based on changed files
3. **Baseline management**: Implement automatic baseline cleanup
4. **Regional testing**: Consider different regions for font/rendering differences

## Integration with Design Tokens

Visual tests validate design token implementation:

```typescript
test('should validate spacing tokens', async ({ page }) => {
  const validator = new DesignSystemValidator(page);
  
  // Validate spacing scale is defined
  const spacingTokens = Array.from({ length: 13 }, (_, i) => `--glass-spacing-${i}`);
  await validator.validateTokens(spacingTokens);
  
  // Visual verification of spacing
  await glassHelpers.captureComponent('[data-testid="spacing-scale"]', {
    name: 'spacing-validation'
  });
});
```

## Reporting and Analytics

### Test Reports

Generated reports include:

- **HTML Report**: Interactive test results with screenshots
- **JSON Report**: Machine-readable results for analytics
- **Markdown Summary**: Human-readable summary for PRs

### Key Metrics

Track these visual regression metrics:

- **Test coverage**: Components, variants, breakpoints tested
- **Stability**: Flaky test rate over time
- **Performance**: Test execution time trends
- **Regression rate**: Visual changes caught vs missed
- **Resolution time**: Time to fix visual regressions

### Dashboard Integration

Consider integrating with:
- **GitHub Status Checks**: Block merging on visual regressions
- **Slack Notifications**: Alert team of visual changes
- **Analytics Dashboards**: Track design system quality metrics

## Conclusion

Visual regression testing is crucial for maintaining design system quality and consistency. The AuraGlass visual testing suite provides comprehensive coverage of:

✅ **Component Variants** - All visual states and configurations  
✅ **Responsive Design** - Multi-device and viewport testing  
✅ **Accessibility** - Focus states and contrast validation  
✅ **Glass Effects** - Glassmorphism-specific visual properties  
✅ **Design Tokens** - System consistency and compliance  
✅ **Performance** - Rendering efficiency and smoothness  

Regular visual testing ensures the design system maintains its 100/100 quality score and provides a reliable foundation for product development.

---

For more information, see:
- [Playwright Documentation](https://playwright.dev/)
- [Storybook Visual Testing](https://storybook.js.org/docs/react/writing-tests/visual-testing)
- [Design System Testing Best Practices](https://www.chromatic.com/blog/visual-testing-handbook/)