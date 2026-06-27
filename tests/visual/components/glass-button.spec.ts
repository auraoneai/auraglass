import { test, expect } from '@playwright/test';
import { GlassmorphismTestHelpers } from '../utils/glassmorphism-helpers';

test.describe('GlassButton Visual Regression Tests', () => {
  let glassHelpers: GlassmorphismTestHelpers;

  test.beforeEach(async ({ page }) => {
    glassHelpers = new GlassmorphismTestHelpers(page);
  });

  test.describe('Button Variants', () => {
    const variants = [
      'default',
      'primary', 
      'secondary',
      'outline',
      'ghost',
      'destructive',
      'gradient'
    ];

    for (const variant of variants) {
      test(`should render ${variant} variant correctly`, async ({ page }) => {
        await glassHelpers.navigateToStory('button-glassbutton', variant);
        
        await glassHelpers.captureComponent('button', {
          name: `button-${variant}`,
          animations: 'disabled'
        });

        // Validate glassmorphism properties
        await glassHelpers.validateGlassProperties('button');
      });
    }
  });

  test.describe('Button Sizes', () => {
    const sizes = ['xs', 'sm', 'md', 'lg', 'xl'];

    for (const size of sizes) {
      test(`should render ${size} size correctly`, async ({ page }) => {
        await glassHelpers.navigateToStory('button-glassbutton', `size-${size}`);
        
        await glassHelpers.captureComponent('button', {
          name: `button-size-${size}`,
          animations: 'disabled'
        });
      });
    }
  });

  test.describe('Button States', () => {
    test('should render all interaction states', async ({ page }) => {
      await glassHelpers.navigateToStory('button-glassbutton', 'default');
      await glassHelpers.testInteractionStates('button');
    });

    test('should render disabled state', async ({ page }) => {
      await glassHelpers.navigateToStory('button-glassbutton', 'disabled');
      
      await glassHelpers.captureComponent('button', {
        name: 'button-disabled',
        animations: 'disabled'
      });

      // Verify disabled styling
      const button = page.locator('button');
      await expect(button).toHaveAttribute('disabled');
      await expect(button).toHaveCSS('opacity', /0\.[3-6]/); // Reduced opacity
    });

    test('should render loading state', async ({ page }) => {
      await glassHelpers.navigateToStory('button-glassbutton', 'loading');
      
      await glassHelpers.captureComponent('button', {
        name: 'button-loading',
        animations: 'allow' // Allow loading animations
      });

      // Verify loading indicator is present
      const loadingIndicator = page.locator('[data-testid="loading-spinner"], .animate-spin');
      await expect(loadingIndicator).toBeVisible();
    });
  });

  test.describe('Button with Icons', () => {
    test('should render with left icon', async ({ page }) => {
      await glassHelpers.navigateToStory('button-glassbutton', 'with-left-icon');
      
      await glassHelpers.captureComponent('button', {
        name: 'button-left-icon',
        animations: 'disabled'
      });
    });

    test('should render with right icon', async ({ page }) => {
      await glassHelpers.navigateToStory('button-glassbutton', 'with-right-icon');
      
      await glassHelpers.captureComponent('button', {
        name: 'button-right-icon',
        animations: 'disabled'
      });
    });

    test('should render icon only', async ({ page }) => {
      await glassHelpers.navigateToStory('button-glassbutton', 'icon-only');
      
      await glassHelpers.captureComponent('button', {
        name: 'button-icon-only',
        animations: 'disabled'
      });

      // Verify icon button has proper dimensions
      const button = page.locator('button');
      const boundingBox = await button.boundingBox();
      
      // Icon buttons should be roughly square
      if (boundingBox) {
        const aspectRatio = boundingBox.width / boundingBox.height;
        expect(aspectRatio).toBeCloseTo(1, 0.3); // Allow some variation
      }
    });
  });

  test.describe('Glass Material Variants', () => {
    test('should render with standard glass material', async ({ page }) => {
      await glassHelpers.navigateToStory('button-glassbutton', 'glass-material');
      
      await glassHelpers.captureComponent('button', {
        name: 'button-glass-material',
        animations: 'disabled'
      });

      // Validate glass properties
      const glassProperties = await glassHelpers.validateGlassProperties('button');
      expect(glassProperties.backdropFilter).toContain('blur');
    });

    test('should render with liquid glass material', async ({ page }) => {
      await glassHelpers.navigateToStory('button-glassbutton', 'liquid-glass');
      
      await glassHelpers.captureComponent('button', {
        name: 'button-liquid-glass',
        animations: 'disabled'
      });

      // Verify liquid glass specific attributes
      const liquidGlass = page.locator('[data-liquid-glass-button="true"]');
      await expect(liquidGlass).toBeVisible();
    });
  });

  test.describe('Elevation Levels', () => {
    const elevations = ['level1', 'level2', 'level3', 'level4', 'float', 'modal'];

    for (const elevation of elevations) {
      test(`should render with ${elevation} elevation`, async ({ page }) => {
        await glassHelpers.navigateToStory('button-glassbutton', `elevation-${elevation}`);
        
        await glassHelpers.captureComponent('button', {
          name: `button-elevation-${elevation}`,
          animations: 'disabled'
        });
      });
    }

    test('should show visual hierarchy between elevations', async ({ page }) => {
      await glassHelpers.navigateToStory('button-glassbutton', 'elevation-showcase');
      
      await glassHelpers.captureComponent('[data-testid="elevation-showcase"]', {
        name: 'button-elevation-hierarchy',
        animations: 'disabled'
      });
    });
  });

  test.describe('Responsive Behavior', () => {
    test('should render correctly at different screen sizes', async ({ page }) => {
      await glassHelpers.navigateToStory('button-glassbutton', 'default');
      
      await glassHelpers.testResponsiveBreakpoints('button', [
        { name: 'mobile', width: 375, height: 667 },
        { name: 'tablet', width: 768, height: 1024 },
        { name: 'desktop', width: 1920, height: 1080 },
        { name: 'ultrawide', width: 2560, height: 1440 }
      ]);
    });

    test('should handle full width correctly', async ({ page }) => {
      await glassHelpers.navigateToStory('button-glassbutton', 'full-width');
      
      // Test at different screen sizes
      const breakpoints = [
        { name: 'mobile', width: 375, height: 667 },
        { name: 'desktop', width: 1920, height: 1080 }
      ];

      for (const breakpoint of breakpoints) {
        await page.setViewportSize(breakpoint);
        await glassHelpers.waitForGlassEffects();
        
        const button = page.locator('button');
        const containerWidth = await page.evaluate(() => window.innerWidth);
        const buttonBox = await button.boundingBox();
        
        if (buttonBox) {
          // Full width button should take up significant portion of container
          expect(buttonBox.width).toBeGreaterThan(containerWidth * 0.8);
        }

        await glassHelpers.captureComponent('button', {
          name: `button-full-width-${breakpoint.name}`,
          animations: 'disabled'
        });
      }
    });
  });

  test.describe('Dark Mode', () => {
    test('should render correctly in dark mode', async ({ page }) => {
      await glassHelpers.navigateToStory('button-glassbutton', 'default');
      await glassHelpers.testDarkMode('button');
    });

    test('should maintain contrast in dark mode', async ({ page }) => {
      await glassHelpers.navigateToStory('button-glassbutton', 'default');
      
      // Switch to dark mode
      await page.emulateMedia({ colorScheme: 'dark' });
      await page.evaluate(() => {
        document.documentElement.classList.add('dark');
      });
      
      await glassHelpers.waitForGlassEffects();
      
      // Validate contrast ratios
      const contrastData = await glassHelpers.validateContrastRatios('button');
      expect(contrastData).toBeTruthy();
    });
  });

  test.describe('Accessibility States', () => {
    test('should render focus states correctly', async ({ page }) => {
      await glassHelpers.navigateToStory('button-glassbutton', 'default');
      
      const button = page.locator('#storybook-root button').first();
      
      // Focus the button
      await button.focus();
      await glassHelpers.waitForGlassEffects();
      
      // Check for focus ring
      await expect(button).toBeFocused();
      
      await glassHelpers.captureComponent('#storybook-root button', {
        name: 'button-focus-state',
        animations: 'disabled'
      });

      // Verify focus ring is visible
      const focusRing = await button.evaluate((el) => {
        const computed = window.getComputedStyle(el);
        return {
          outline: computed.outline,
          boxShadow: computed.boxShadow,
        };
      });

      // Should have either outline or box-shadow for focus indication
      expect(focusRing.outline !== 'none' || focusRing.boxShadow !== 'none').toBeTruthy();
    });

    test('should support reduced motion', async ({ page }) => {
      await glassHelpers.navigateToStory('button-glassbutton', 'default');
      await glassHelpers.testReducedMotion('#storybook-root button');
    });

    test('should have proper ARIA attributes', async ({ page }) => {
      await glassHelpers.navigateToStory('button-glassbutton', 'with-aria-label');
      
      const button = page.locator('#storybook-root button').first();
      
      // Check for essential accessibility attributes
      const ariaLabel = await button.getAttribute('aria-label');
      const ariaDescribedBy = await button.getAttribute('aria-describedby');
      
      expect(ariaLabel || ariaDescribedBy).toBeTruthy();
    });
  });

  test.describe('Performance', () => {
    test('should not cause layout thrashing on hover', async ({ page }) => {
      await glassHelpers.navigateToStory('button-glassbutton', 'default');
      
      const button = page.locator('button');
      
      // Get initial position
      const initialBox = await button.boundingBox();
      
      // Hover and check position didn't change significantly
      await button.hover();
      await glassHelpers.waitForGlassEffects();
      
      const hoverBox = await button.boundingBox();
      
      if (initialBox && hoverBox) {
        expect(Math.abs(initialBox.x - hoverBox.x)).toBeLessThan(5);
        expect(Math.abs(initialBox.y - hoverBox.y)).toBeLessThan(5);
      }
    });

    test('should have smooth animations', async ({ page }) => {
      await glassHelpers.navigateToStory('button-glassbutton', 'default');
      
      // Test animation performance by triggering state changes rapidly
      const button = page.locator('button');
      
      await button.hover();
      await page.waitForTimeout(100);
      await page.mouse.move(0, 0); // Move away
      await page.waitForTimeout(100);
      await button.hover();
      
      // Should not cause visual glitches
      await glassHelpers.captureComponent('button', {
        name: 'button-animation-stability',
        animations: 'allow'
      });
    });
  });
});
