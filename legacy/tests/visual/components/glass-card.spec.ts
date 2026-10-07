import { test, expect } from '@playwright/test';
import { GlassmorphismTestHelpers } from '../utils/glassmorphism-helpers';

const CARD_SELECTOR = '#storybook-root [data-liquid-glass-card="true"], #storybook-root .glass-foundation-complete';
const INTERACTIVE_CARD_SELECTOR = '#storybook-root [role="button"]';

test.describe('GlassCard Visual Regression Tests', () => {
  let glassHelpers: GlassmorphismTestHelpers;

  test.beforeEach(async ({ page }) => {
    glassHelpers = new GlassmorphismTestHelpers(page);
  });

  test.describe('Card Variants', () => {
    const variants = [
      'default',
      'outlined',
      'elevated',
      'interactive',
      'feature',
      'minimal',
      'primary'
    ];

    for (const variant of variants) {
      test(`should render ${variant} variant correctly`, async ({ page }) => {
        await glassHelpers.navigateToStory('card-glasscard', variant);
        
        await glassHelpers.captureComponent(CARD_SELECTOR, {
          name: `card-${variant}`,
          animations: 'disabled'
        });

        await glassHelpers.validateGlassProperties(CARD_SELECTOR);
      });
    }
  });

  test.describe('Card Sizes', () => {
    const sizes = ['sm', 'md', 'lg', 'xl'];

    for (const size of sizes) {
      test(`should render ${size} size correctly`, async ({ page }) => {
        await glassHelpers.navigateToStory('card-glasscard', `size-${size}`);
        
        await glassHelpers.captureComponent(CARD_SELECTOR, {
          name: `card-size-${size}`,
          animations: 'disabled'
        });
      });
    }
  });

  test.describe('Interactive States', () => {
    test('should render hoverable card states', async ({ page }) => {
      await glassHelpers.navigateToStory('card-glasscard', 'hoverable');
      await glassHelpers.testInteractionStates(INTERACTIVE_CARD_SELECTOR);
    });

    test('should render clickable card states', async ({ page }) => {
      await glassHelpers.navigateToStory('card-glasscard', 'clickable');
      
      const card = page.locator(INTERACTIVE_CARD_SELECTOR).first();
      
      // Test click state
      await card.hover();
      await page.mouse.down();
      await glassHelpers.waitForGlassEffects();
      
      await glassHelpers.captureComponent(INTERACTIVE_CARD_SELECTOR, {
        name: 'card-pressed',
        animations: 'disabled'
      });
      
      await page.mouse.up();
    });

    test('should handle loading state', async ({ page }) => {
      await glassHelpers.navigateToStory('card-glasscard', 'loading');
      
      await glassHelpers.captureComponent(CARD_SELECTOR, {
        name: 'card-loading',
        animations: 'allow'
      });

      // Verify loading indicator
      const loadingElement = page.locator('.animate-pulse, .animate-shimmer');
      await expect(loadingElement).toBeVisible();
    });
  });

  test.describe('Card Content Layout', () => {
    test('should render with header and content', async ({ page }) => {
      await glassHelpers.navigateToStory('card-glasscard', 'with-header');
      
      await glassHelpers.captureComponent(CARD_SELECTOR, {
        name: 'card-with-header',
        animations: 'disabled'
      });
    });

    test('should render with footer actions', async ({ page }) => {
      await glassHelpers.navigateToStory('card-glasscard', 'with-footer');
      
      await glassHelpers.captureComponent(CARD_SELECTOR, {
        name: 'card-with-footer',
        animations: 'disabled'
      });
    });

    test('should render complex card layout', async ({ page }) => {
      await glassHelpers.navigateToStory('card-glasscard', 'complex-layout');
      
      await glassHelpers.captureComponent(CARD_SELECTOR, {
        name: 'card-complex-layout',
        animations: 'disabled'
      });

      // Verify all sections are properly spaced
      const header = page.locator('[data-testid="card-header"]');
      const content = page.locator('[data-testid="card-content"]');
      const footer = page.locator('[data-testid="card-footer"]');

      await expect(header).toBeVisible();
      await expect(content).toBeVisible();
      await expect(footer).toBeVisible();
    });
  });

  test.describe('Glass Material Types', () => {
    test('should render with liquid glass material', async ({ page }) => {
      await glassHelpers.navigateToStory('card-glasscard', 'liquid-glass');
      
      await glassHelpers.captureComponent(CARD_SELECTOR, {
        name: 'card-liquid-glass',
        animations: 'disabled'
      });

      const liquidGlass = page.locator('[data-liquid-glass-card="true"]');
      await expect(liquidGlass).toBeVisible();
    });

    test('should render with different glass intensities', async ({ page }) => {
      const intensities = ['subtle', 'medium', 'strong', 'intense'];
      
      for (const intensity of intensities) {
        await glassHelpers.navigateToStory('card-glasscard', `intensity-${intensity}`);
        
        await glassHelpers.captureComponent(CARD_SELECTOR, {
          name: `card-intensity-${intensity}`,
          animations: 'disabled'
        });
      }
    });
  });

  test.describe('Responsive Layout', () => {
    test('should adapt to different screen sizes', async ({ page }) => {
      await glassHelpers.navigateToStory('card-glasscard', 'responsive');
      
      await glassHelpers.testResponsiveBreakpoints(CARD_SELECTOR, [
        { name: 'mobile', width: 375, height: 667 },
        { name: 'tablet', width: 768, height: 1024 },
        { name: 'desktop', width: 1920, height: 1080 }
      ]);
    });

    test('should handle card grid layouts', async ({ page }) => {
      await glassHelpers.navigateToStory('card-glasscard', 'grid-layout');
      
      const breakpoints = [
        { name: 'mobile', width: 375, height: 667 },
        { name: 'tablet', width: 768, height: 1024 },
        { name: 'desktop', width: 1920, height: 1080 }
      ];

      for (const breakpoint of breakpoints) {
        await page.setViewportSize(breakpoint);
        await glassHelpers.waitForGlassEffects();
        
        await glassHelpers.captureComponent('[data-testid="card-grid"]', {
          name: `card-grid-${breakpoint.name}`,
          animations: 'disabled'
        });
      }
    });
  });

  test.describe('Dark Mode Support', () => {
    test('should render correctly in dark mode', async ({ page }) => {
      await glassHelpers.navigateToStory('card-glasscard', 'default');
      await glassHelpers.testDarkMode(CARD_SELECTOR);
    });

    test('should maintain proper contrast in dark mode', async ({ page }) => {
      await glassHelpers.navigateToStory('card-glasscard', 'with-content');
      
      await page.emulateMedia({ colorScheme: 'dark' });
      await glassHelpers.waitForGlassEffects();
      
      const contrastData = await glassHelpers.validateContrastRatios(CARD_SELECTOR);
      expect(contrastData).toBeTruthy();
    });
  });

  test.describe('Accessibility', () => {
    test('should be keyboard navigable when interactive', async ({ page }) => {
      await glassHelpers.navigateToStory('card-glasscard', 'interactive');
      
      const card = page.locator(INTERACTIVE_CARD_SELECTOR).first();
      
      await card.focus();
      await expect(card).toBeFocused();
      
      // Take screenshot of focus state
      await glassHelpers.captureComponent(INTERACTIVE_CARD_SELECTOR, {
        name: 'card-focused',
        animations: 'disabled'
      });

      // Activate with keyboard
      await page.keyboard.press('Enter');
      await glassHelpers.waitForGlassEffects();
      
      await glassHelpers.captureComponent(INTERACTIVE_CARD_SELECTOR, {
        name: 'card-keyboard-activated',
        animations: 'disabled'
      });
    });

    test('should support reduced motion', async ({ page }) => {
      await glassHelpers.navigateToStory('card-glasscard', 'hoverable');
      await glassHelpers.testReducedMotion(CARD_SELECTOR);
    });

    test('should have proper semantic structure', async ({ page }) => {
      await glassHelpers.navigateToStory('card-glasscard', 'semantic-structure');
      
      const card = page.locator(CARD_SELECTOR).first();
      const role = await card.getAttribute('role');
      
      // Should have appropriate role if interactive
      if (role) {
        expect(['button', 'link', 'article', 'region']).toContain(role);
      }
    });
  });

  test.describe('Animation Performance', () => {
    test('should have smooth hover animations', async ({ page }) => {
      await glassHelpers.navigateToStory('card-glasscard', 'hoverable');
      
      const card = page.locator(INTERACTIVE_CARD_SELECTOR).first();
      
      // Test animation smoothness
      await card.hover();
      await page.waitForTimeout(200);
      
      await glassHelpers.captureComponent(INTERACTIVE_CARD_SELECTOR, {
        name: 'card-hover-animation',
        animations: 'allow'
      });
    });

    test('should maintain performance with multiple cards', async ({ page }) => {
      await glassHelpers.navigateToStory('card-glasscard', 'multiple-cards');
      
      // Hover over multiple cards rapidly
      const cards = page.locator(CARD_SELECTOR);
      const count = await cards.count();
      
      for (let i = 0; i < Math.min(count, 5); i++) {
        await cards.nth(i).hover();
        await page.waitForTimeout(100);
      }
      
      await glassHelpers.captureComponent('[data-testid="cards-container"]', {
        name: 'multiple-cards-hover',
        animations: 'allow'
      });
    });
  });
});
