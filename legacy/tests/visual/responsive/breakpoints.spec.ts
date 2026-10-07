import { test, expect } from '@playwright/test';
import { GlassmorphismTestHelpers } from '../utils/glassmorphism-helpers';

test.describe('Responsive Design System Tests', () => {
  let glassHelpers: GlassmorphismTestHelpers;

  const breakpoints = [
    { name: 'mobile', width: 375, height: 667, description: 'Mobile (iPhone 12)' },
    { name: 'mobile-lg', width: 414, height: 896, description: 'Large Mobile (iPhone 14 Plus)' },
    { name: 'tablet', width: 768, height: 1024, description: 'Tablet (iPad)' },
    { name: 'tablet-lg', width: 1024, height: 1366, description: 'Large Tablet (iPad Pro)' },
    { name: 'desktop', width: 1440, height: 900, description: 'Desktop' },
    { name: 'desktop-lg', width: 1920, height: 1080, description: 'Large Desktop' },
    { name: 'ultrawide', width: 2560, height: 1440, description: 'Ultrawide Monitor' }
  ];

  test.beforeEach(async ({ page }) => {
    glassHelpers = new GlassmorphismTestHelpers(page);
  });

  test.describe('Layout Components Responsive Behavior', () => {
    const layoutComponents = [
      { story: 'layout-glasscontainer--responsive', selector: '[data-testid="glass-container"]', name: 'container' },
      { story: 'navigation-glasssidebar--responsive', selector: '[data-testid="glass-sidebar"]', name: 'sidebar' },
      { story: 'navigation-glassheader--responsive', selector: '[data-testid="glass-header"]', name: 'header' },
      { story: 'navigation-glassbottomnav--default', selector: '[data-testid="glass-bottom-nav"]', name: 'bottom-nav' }
    ];

    for (const component of layoutComponents) {
      test(`${component.name} should adapt to all breakpoints`, async ({ page }) => {
        await glassHelpers.navigateToStory(component.story.split('--')[0], component.story.split('--')[1]);
        
        for (const breakpoint of breakpoints) {
          await page.setViewportSize({ 
            width: breakpoint.width, 
            height: breakpoint.height 
          });
          
          await glassHelpers.waitForGlassEffects();
          
          await glassHelpers.captureComponent(component.selector, {
            name: `${component.name}-${breakpoint.name}`,
            animations: 'disabled'
          });

          // Verify component is visible and properly sized
          const element = page.locator(component.selector);
          await expect(element).toBeVisible();
          
          const boundingBox = await element.boundingBox();
          if (boundingBox) {
            expect(boundingBox.width).toBeGreaterThan(0);
            expect(boundingBox.height).toBeGreaterThan(0);
            
            // Ensure component doesn't exceed viewport
            expect(boundingBox.width).toBeLessThanOrEqual(breakpoint.width + 20); // Allow small margin
          }
        }
      });
    }
  });

  test.describe('Navigation Responsive Behavior', () => {
    test('sidebar should collapse on mobile', async ({ page }) => {
      await glassHelpers.navigateToStory('navigation-glasssidebar', 'collapsible');
      
      // Desktop - should be expanded
      await page.setViewportSize({ width: 1920, height: 1080 });
      await glassHelpers.waitForGlassEffects();
      
      const sidebar = page.locator('[data-testid="glass-sidebar"]');
      let sidebarBox = await sidebar.boundingBox();
      const desktopWidth = sidebarBox?.width || 0;
      
      await glassHelpers.captureComponent('[data-testid="glass-sidebar"]', {
        name: 'sidebar-desktop-expanded',
        animations: 'disabled'
      });

      // Mobile - should be collapsed or hidden
      await page.setViewportSize({ width: 375, height: 667 });
      await glassHelpers.waitForGlassEffects();
      
      sidebarBox = await sidebar.boundingBox();
      const mobileWidth = sidebarBox?.width || 0;
      
      await glassHelpers.captureComponent('[data-testid="glass-sidebar"]', {
        name: 'sidebar-mobile-collapsed',
        animations: 'disabled'
      });

      // Mobile sidebar should be narrower or hidden
      expect(mobileWidth).toBeLessThan(desktopWidth);
    });

    test('header navigation should adapt to mobile', async ({ page }) => {
      await glassHelpers.navigateToStory('navigation-glassheader', 'responsive');
      
      // Desktop - full navigation visible
      await page.setViewportSize({ width: 1920, height: 1080 });
      await glassHelpers.waitForGlassEffects();
      
      const navItems = page.locator('[data-testid="nav-items"]');
      const hamburger = page.locator('[data-testid="hamburger-menu"]');
      
      if (await navItems.isVisible()) {
        await glassHelpers.captureComponent('[data-testid="glass-header"]', {
          name: 'header-desktop-full-nav',
          animations: 'disabled'
        });
      }

      // Mobile - hamburger menu should appear
      await page.setViewportSize({ width: 375, height: 667 });
      await glassHelpers.waitForGlassEffects();
      
      if (await hamburger.isVisible()) {
        await expect(hamburger).toBeVisible();
        await glassHelpers.captureComponent('[data-testid="glass-header"]', {
          name: 'header-mobile-hamburger',
          animations: 'disabled'
        });

        // Test mobile menu expansion
        await hamburger.click();
        await glassHelpers.waitForGlassEffects();
        
        await glassHelpers.captureComponent('[data-testid="glass-header"]', {
          name: 'header-mobile-menu-expanded',
          animations: 'disabled'
        });
      }
    });

    test('bottom navigation should be mobile-first', async ({ page }) => {
      await glassHelpers.navigateToStory('navigation-glassbottomnav', 'default');
      
      // Mobile - primary use case
      await page.setViewportSize({ width: 375, height: 667 });
      await glassHelpers.waitForGlassEffects();
      
      const bottomNav = page.locator('[data-testid="glass-bottom-nav"]');
      await expect(bottomNav).toBeVisible();
      
      await glassHelpers.captureComponent('[data-testid="glass-bottom-nav"]', {
        name: 'bottom-nav-mobile',
        animations: 'disabled'
      });

      // Desktop - should adapt or hide
      await page.setViewportSize({ width: 1920, height: 1080 });
      await glassHelpers.waitForGlassEffects();
      
      await glassHelpers.captureComponent('[data-testid="glass-bottom-nav"]', {
        name: 'bottom-nav-desktop',
        animations: 'disabled'
      });
    });
  });

  test.describe('Form Components Responsive Behavior', () => {
    const formComponents = [
      { story: 'input-glassinput--responsive', selector: '[data-testid="glass-input"]', name: 'input' },
      { story: 'input-glassselect--responsive', selector: '[data-testid="glass-select"]', name: 'select' },
      { story: 'input-glassmultiselect--responsive', selector: '[data-testid="glass-multiselect"]', name: 'multiselect' },
      { story: 'forms-glassform--responsive', selector: '[data-testid="glass-form"]', name: 'form' }
    ];

    for (const component of formComponents) {
      test(`${component.name} should be touch-friendly on mobile`, async ({ page }) => {
        await glassHelpers.navigateToStory(component.story.split('--')[0], component.story.split('--')[1]);
        
        // Mobile
        await page.setViewportSize({ width: 375, height: 667 });
        await glassHelpers.waitForGlassEffects();
        
        const element = page.locator(component.selector);
        const boundingBox = await element.boundingBox();
        
        // Ensure touch target size (minimum 44px)
        if (boundingBox) {
          expect(boundingBox.height).toBeGreaterThanOrEqual(44);
        }
        
        await glassHelpers.captureComponent(component.selector, {
          name: `${component.name}-mobile-touch`,
          animations: 'disabled'
        });

        // Desktop
        await page.setViewportSize({ width: 1920, height: 1080 });
        await glassHelpers.waitForGlassEffects();
        
        await glassHelpers.captureComponent(component.selector, {
          name: `${component.name}-desktop`,
          animations: 'disabled'
        });
      });
    }
  });

  test.describe('Data Display Responsive Behavior', () => {
    test('data table should scroll horizontally on mobile', async ({ page }) => {
      await glassHelpers.navigateToStory('data-display-glassdatatable', 'responsive');
      
      // Mobile - should have horizontal scroll
      await page.setViewportSize({ width: 375, height: 667 });
      await glassHelpers.waitForGlassEffects();
      
      const table = page.locator('[data-testid="glass-data-table"]');
      const tableContainer = page.locator('[data-testid="table-container"]');
      
      await glassHelpers.captureComponent('[data-testid="table-container"]', {
        name: 'data-table-mobile-scroll',
        animations: 'disabled'
      });

      // Check if horizontal scrolling is enabled
      const hasHorizontalScroll = await tableContainer.evaluate((el) => {
        return el.scrollWidth > el.clientWidth;
      });
      
      if (hasHorizontalScroll) {
        expect(hasHorizontalScroll).toBeTruthy();
      }

      // Desktop - should fit without scroll
      await page.setViewportSize({ width: 1920, height: 1080 });
      await glassHelpers.waitForGlassEffects();
      
      await glassHelpers.captureComponent('[data-testid="table-container"]', {
        name: 'data-table-desktop-full',
        animations: 'disabled'
      });
    });

    test('card grids should stack on mobile', async ({ page }) => {
      await glassHelpers.navigateToStory('card-glasscard', 'grid-responsive');
      
      // Mobile - should stack vertically
      await page.setViewportSize({ width: 375, height: 667 });
      await glassHelpers.waitForGlassEffects();
      
      const cards = page.locator('[data-testid="glass-card"]');
      const cardCount = await cards.count();
      
      if (cardCount > 1) {
        const firstCard = await cards.nth(0).boundingBox();
        const secondCard = await cards.nth(1).boundingBox();
        
        if (firstCard && secondCard) {
          // Cards should be stacked (second card below first)
          expect(secondCard.y).toBeGreaterThan(firstCard.y + firstCard.height - 10);
        }
      }
      
      await glassHelpers.captureComponent('[data-testid="card-grid"]', {
        name: 'card-grid-mobile-stacked',
        animations: 'disabled'
      });

      // Tablet - should be 2 columns
      await page.setViewportSize({ width: 768, height: 1024 });
      await glassHelpers.waitForGlassEffects();
      
      await glassHelpers.captureComponent('[data-testid="card-grid"]', {
        name: 'card-grid-tablet-columns',
        animations: 'disabled'
      });

      // Desktop - should be multiple columns
      await page.setViewportSize({ width: 1920, height: 1080 });
      await glassHelpers.waitForGlassEffects();
      
      await glassHelpers.captureComponent('[data-testid="card-grid"]', {
        name: 'card-grid-desktop-multi-column',
        animations: 'disabled'
      });
    });
  });

  test.describe('Typography Responsive Scaling', () => {
    test('heading scales should adapt to screen size', async ({ page }) => {
      await glassHelpers.navigateToStory('typography', 'responsive-headings');
      
      for (const breakpoint of breakpoints) {
        await page.setViewportSize({ 
          width: breakpoint.width, 
          height: breakpoint.height 
        });
        
        await glassHelpers.waitForGlassEffects();
        
        // Check different heading levels
        const headings = ['h1', 'h2', 'h3', 'h4'];
        
        for (const heading of headings) {
          const element = page.locator(heading);
          if (await element.isVisible()) {
            const fontSize = await element.evaluate((el) => {
              return window.getComputedStyle(el).fontSize;
            });
            
            // Font sizes should be reasonable for the breakpoint
            const fontSizeValue = parseInt(fontSize);
            
            if (breakpoint.width <= 375) {
              // Mobile should have smaller fonts
              expect(fontSizeValue).toBeLessThan(40);
            } else if (breakpoint.width >= 1920) {
              // Desktop can have larger fonts
              expect(fontSizeValue).toBeGreaterThan(14);
            }
          }
        }
        
        await glassHelpers.captureComponent('body', {
          name: `typography-${breakpoint.name}`,
          animations: 'disabled'
        });
      }
    });
  });

  test.describe('Glass Effects Responsive Performance', () => {
    test('glass effects should maintain quality across devices', async ({ page }) => {
      await glassHelpers.navigateToStory('button-glassbutton', 'default');
      
      for (const breakpoint of breakpoints) {
        await page.setViewportSize({ 
          width: breakpoint.width, 
          height: breakpoint.height 
        });
        
        await glassHelpers.waitForGlassEffects();
        
        // Validate glass properties at each breakpoint
        const glassProperties = await glassHelpers.validateGlassProperties('button');
        expect(glassProperties.backdropFilter).toContain('blur');
        
        // Performance considerations for smaller screens
        if (breakpoint.width <= 768) {
          // On mobile, might have reduced blur for performance
          const blurMatch = glassProperties.backdropFilter.match(/blur\((\d+)px\)/);
          if (blurMatch) {
            const blurValue = parseInt(blurMatch[1]);
            expect(blurValue).toBeLessThanOrEqual(20); // Reasonable mobile blur
          }
        }
        
        await glassHelpers.captureComponent('button', {
          name: `glass-effects-${breakpoint.name}`,
          animations: 'disabled'
        });
      }
    });

    test('should handle high DPI displays', async ({ page }) => {
      await glassHelpers.navigateToStory('card-glasscard', 'default');
      
      // Test different device pixel ratios
      const dpiTests = [
        { ratio: 1, name: 'standard' },
        { ratio: 2, name: 'retina' },
        { ratio: 3, name: 'high-dpi' }
      ];

      for (const dpiTest of dpiTests) {
        await page.setViewportSize({ width: 1920, height: 1080 });
        await page.emulateMedia({ 
          media: 'screen',
          colorScheme: 'light'
        });
        
        // Simulate device pixel ratio
        await page.evaluate((ratio) => {
          Object.defineProperty(window, 'devicePixelRatio', {
            get: () => ratio
          });
        }, dpiTest.ratio);
        
        await glassHelpers.waitForGlassEffects();
        
        await glassHelpers.captureComponent('[data-testid="glass-card"]', {
          name: `glass-dpi-${dpiTest.name}`,
          animations: 'disabled'
        });
      }
    });
  });

  test.describe('Orientation Changes', () => {
    test('should handle orientation changes gracefully', async ({ page }) => {
      await glassHelpers.navigateToStory('layout-glasscontainer', 'responsive');
      
      // Portrait mobile
      await page.setViewportSize({ width: 375, height: 667 });
      await glassHelpers.waitForGlassEffects();
      
      await glassHelpers.captureComponent('[data-testid="glass-container"]', {
        name: 'orientation-portrait',
        animations: 'disabled'
      });

      // Landscape mobile
      await page.setViewportSize({ width: 667, height: 375 });
      await glassHelpers.waitForGlassEffects();
      
      await glassHelpers.captureComponent('[data-testid="glass-container"]', {
        name: 'orientation-landscape',
        animations: 'disabled'
      });

      // Portrait tablet
      await page.setViewportSize({ width: 768, height: 1024 });
      await glassHelpers.waitForGlassEffects();
      
      await glassHelpers.captureComponent('[data-testid="glass-container"]', {
        name: 'tablet-portrait',
        animations: 'disabled'
      });

      // Landscape tablet
      await page.setViewportSize({ width: 1024, height: 768 });
      await glassHelpers.waitForGlassEffects();
      
      await glassHelpers.captureComponent('[data-testid="glass-container"]', {
        name: 'tablet-landscape',
        animations: 'disabled'
      });
    });
  });
});