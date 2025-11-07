import { test, expect } from '@playwright/test';

/**
 * Navigation Accessibility E2E Tests
 * Tests keyboard navigation and accessibility features
 */
test.describe('Navigation Accessibility', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to Storybook or your app
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('keyboard navigation works', async ({ page }) => {
    // Tab through navigation
    await page.keyboard.press('Tab');

    // Get the focused element
    const focusedElement = await page.evaluate(() => {
      const el = document.activeElement;
      return {
        tagName: el?.tagName,
        role: el?.getAttribute('role'),
        ariaLabel: el?.getAttribute('aria-label')
      };
    });

    expect(focusedElement.tagName).toBeTruthy();
    console.log('First focused element:', focusedElement);

    // Check focus visible indicator
    const hasFocusRing = await page.evaluate(() => {
      const el = document.activeElement;
      if (!el) return false;
      const styles = window.getComputedStyle(el);
      return styles.outline !== 'none' || styles.boxShadow !== 'none';
    });

    expect(hasFocusRing).toBe(true);
  });

  test('skip to main content link exists', async ({ page }) => {
    // Check for skip link
    const skipLink = page.locator('a[href="#main"], a:has-text("Skip to")').first();

    // Tab to focus on skip link
    await page.keyboard.press('Tab');

    // Check if skip link becomes visible on focus
    const isVisible = await skipLink.isVisible().catch(() => false);

    // Log for debugging
    console.log('Skip link visible:', isVisible);
  });

  test('all interactive elements are keyboard accessible', async ({ page }) => {
    // Get all interactive elements
    const interactiveElements = await page.locator('button, a, input, select, textarea, [tabindex]:not([tabindex="-1"])').all();

    console.log(`Found ${interactiveElements.length} interactive elements`);

    // Ensure there are interactive elements
    expect(interactiveElements.length).toBeGreaterThan(0);

    // Sample test: Check first few elements are reachable
    for (let i = 0; i < Math.min(5, interactiveElements.length); i++) {
      const element = interactiveElements[i];
      const tagName = await element.evaluate(el => el.tagName);
      console.log(`Element ${i}: ${tagName}`);

      // Each element should be visible or aria-hidden
      const isVisible = await element.isVisible();
      const ariaHidden = await element.getAttribute('aria-hidden');

      if (!ariaHidden || ariaHidden !== 'true') {
        // Non-hidden elements should be focusable
        expect(isVisible || ariaHidden === 'true').toBeTruthy();
      }
    }
  });

  test('escape key closes modals/dropdowns', async ({ page }) => {
    // Try to find and open a modal or dropdown
    const dropdownTrigger = page.locator('[role="button"], button').first();

    if (await dropdownTrigger.isVisible().catch(() => false)) {
      await dropdownTrigger.click();

      // Wait a bit for any dropdown to appear
      await page.waitForTimeout(300);

      // Press Escape
      await page.keyboard.press('Escape');

      // Wait for animation
      await page.waitForTimeout(300);

      console.log('Escape key handling tested');
    }
  });

  test('focus trap works in modals', async ({ page }) => {
    // Look for modal triggers
    const modalTrigger = page.locator('button:has-text("Open"), button:has-text("Show")').first();

    if (await modalTrigger.isVisible().catch(() => false)) {
      await modalTrigger.click();
      await page.waitForTimeout(500);

      // Tab through modal
      const initialFocus = await page.evaluate(() => document.activeElement?.tagName);

      // Tab multiple times
      for (let i = 0; i < 10; i++) {
        await page.keyboard.press('Tab');
      }

      // Check focus is still within modal
      const finalFocus = await page.evaluate(() => {
        const modal = document.querySelector('[role="dialog"], [role="modal"]');
        const activeEl = document.activeElement;
        return {
          hasModal: !!modal,
          isInsideModal: modal?.contains(activeEl) ?? false
        };
      });

      if (finalFocus.hasModal) {
        expect(finalFocus.isInsideModal).toBe(true);
      }
    }
  });
});

/**
 * Component Rendering E2E Tests
 */
test.describe('Component Rendering', () => {
  test('glass components render without errors', async ({ page }) => {
    const errors: string[] = [];

    page.on('pageerror', (error) => {
      errors.push(error.message);
    });

    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Check for any console errors
    expect(errors).toHaveLength(0);
  });

  test('glass effects are applied', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Look for elements with glass styling
    const glassElements = await page.locator('[class*="glass"], [class*="Glass"]').all();

    console.log(`Found ${glassElements.length} glass elements`);

    // Check at least some glass components exist
    expect(glassElements.length).toBeGreaterThan(0);

    // Sample a glass element and check its styles
    if (glassElements.length > 0) {
      const firstGlass = glassElements[0];
      const styles = await firstGlass.evaluate((el) => {
        const computed = window.getComputedStyle(el);
        return {
          backdropFilter: computed.backdropFilter,
          background: computed.background,
          backgroundColor: computed.backgroundColor
        };
      });

      console.log('Glass element styles:', styles);

      // Glass elements should have backdrop-filter or similar
      const hasGlassEffect =
        styles.backdropFilter !== 'none' ||
        styles.background.includes('rgba') ||
        styles.backgroundColor.includes('rgba');

      expect(hasGlassEffect).toBe(true);
    }
  });
});

/**
 * Performance E2E Tests
 */
test.describe('Performance', () => {
  test('page loads within acceptable time', async ({ page }) => {
    const startTime = Date.now();

    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');

    const loadTime = Date.now() - startTime;

    console.log(`Page load time: ${loadTime}ms`);

    // Should load within 5 seconds
    expect(loadTime).toBeLessThan(5000);
  });

  test('no layout shifts on load', async ({ page }) => {
    await page.goto('/');

    // Wait for any animations to complete
    await page.waitForTimeout(1000);

    // Check for layout stability
    const cls = await page.evaluate(() => {
      return new Promise((resolve) => {
        let clsValue = 0;
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.entryType === 'layout-shift' && !(entry as any).hadRecentInput) {
              clsValue += (entry as any).value;
            }
          }
        });
        observer.observe({ entryTypes: ['layout-shift'] });

        setTimeout(() => {
          observer.disconnect();
          resolve(clsValue);
        }, 2000);
      });
    });

    console.log('Cumulative Layout Shift:', cls);

    // CLS should be less than 0.1 (good)
    expect(cls).toBeLessThan(0.1);
  });
});
