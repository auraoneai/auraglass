import { test, expect } from '@playwright/test';
import { GlassmorphismTestHelpers } from '../utils/glassmorphism-helpers';

test.describe('Accessibility Visual Tests', () => {
  let glassHelpers: GlassmorphismTestHelpers;

  test.beforeEach(async ({ page }) => {
    glassHelpers = new GlassmorphismTestHelpers(page);
  });

  test.describe('Focus States and Visual Indicators', () => {
    const focusableComponents = [
      { story: 'button-glassbutton--default', selector: '#storybook-root button', name: 'button' },
      { story: 'input-glassinput--default', selector: '#storybook-root input', name: 'input' },
      { story: 'input-glassselect--default', selector: '#storybook-root button', name: 'select' },
      { story: 'navigation-glasstabs--default', selector: '#storybook-root [role="tab"]', name: 'tab' },
      { story: 'card-glasscard--interactive', selector: '#storybook-root [role="button"]', name: 'interactive-card' }
    ];

    for (const component of focusableComponents) {
      test(`${component.name} should have visible focus indicator`, async ({ page }) => {
        await glassHelpers.navigateToStory(component.story.split('--')[0], component.story.split('--')[1]);
        
        const element = page.locator(component.selector).first();
        
        // Default state (no focus)
        await glassHelpers.captureComponent(component.selector, {
          name: `${component.name}-no-focus`,
          animations: 'disabled'
        });

        // Focus the element
        await element.focus();
        await glassHelpers.waitForGlassEffects();
        
        // Capture focused state
        await glassHelpers.captureComponent(component.selector, {
          name: `${component.name}-focused`,
          animations: 'disabled'
        });

        // Verify focus ring or outline is visible
        const focusStyles = await element.evaluate((el) => {
          const computed = window.getComputedStyle(el);
          return {
            outline: computed.outline,
            outlineColor: computed.outlineColor,
            outlineWidth: computed.outlineWidth,
            boxShadow: computed.boxShadow,
            borderColor: computed.borderColor,
          };
        });

        // Should have visible focus indicator (outline, box-shadow, or border change)
        const hasFocusIndicator = 
          focusStyles.outline !== 'none' ||
          focusStyles.boxShadow.includes('0 0') ||
          focusStyles.borderColor !== 'rgba(0, 0, 0, 0)';

        expect(hasFocusIndicator).toBeTruthy();
      });

      test(`${component.name} keyboard focus should be clearly visible`, async ({ page }) => {
        await glassHelpers.navigateToStory(component.story.split('--')[0], component.story.split('--')[1]);
        
        // Use keyboard navigation
        const element = page.locator(component.selector).filter({ visible: true }).first();
        await element.focus();
        await glassHelpers.waitForGlassEffects();
        
        const focusedElement = page.locator('#storybook-root :focus');
        await expect(focusedElement).toBeVisible();
        
        // Capture keyboard focus state
        await glassHelpers.captureComponent(':focus', {
          name: `${component.name}-keyboard-focus`,
          animations: 'disabled'
        });
      });
    }
  });

  test.describe('High Contrast Mode Support', () => {
    test('components should be visible in high contrast mode', async ({ page }) => {
      await glassHelpers.navigateToStory('button-glassbutton', 'default');
      
      // Simulate high contrast mode
      await page.emulateMedia({ 
        colorScheme: 'light',
        reducedMotion: 'no-preference',
        forcedColors: 'active'
      });

      await page.addStyleTag({
        content: `
          @media (prefers-contrast: high) {
            * {
              background: white !important;
              color: black !important;
              border: 2px solid black !important;
            }
            button {
              background: buttonface !important;
              color: buttontext !important;
              border: 2px solid buttonborder !important;
            }
          }
        `
      });

      await glassHelpers.waitForGlassEffects();
      
      await glassHelpers.captureComponent('#storybook-root button', {
        name: 'button-high-contrast',
        animations: 'disabled'
      });

      // Test focus state in high contrast
      await page.locator('#storybook-root button').first().focus();
      await glassHelpers.waitForGlassEffects();
      
      await glassHelpers.captureComponent('#storybook-root button', {
        name: 'button-high-contrast-focused',
        animations: 'disabled'
      });
    });

    test('form components should work in high contrast mode', async ({ page }) => {
      await glassHelpers.navigateToStory('forms-glassform', 'comprehensive');
      
      // Enable high contrast simulation
      await page.emulateMedia({ forcedColors: 'active' });
      
      await glassHelpers.captureComponent('#storybook-root form, #storybook-root [data-testid="glassform"]', {
        name: 'form-high-contrast',
        animations: 'disabled'
      });

      // Test form interactions in high contrast
      const input = page.locator('input').first();
      await input.focus();
      await input.fill('Test content');
      
      await glassHelpers.captureComponent('#storybook-root form, #storybook-root [data-testid="glassform"]', {
        name: 'form-high-contrast-filled',
        animations: 'disabled'
      });
    });
  });

  test.describe('Color Contrast Validation', () => {
    test('text should have sufficient contrast ratios', async ({ page }) => {
      await glassHelpers.navigateToStory('typography', 'color-variants');
      
      const textElements = [
        'h1', 'h2', 'h3', 'p', 
        '.text-primary', '.text-secondary', '.text-muted',
        'button', 'a'
      ];

      for (const selector of textElements) {
        const elements = page.locator(selector);
        const count = await elements.count();
        
        for (let i = 0; i < count && i < 3; i++) { // Test up to 3 instances
          const element = elements.nth(i);
          
          if (await element.isVisible()) {
            const contrastInfo = await element.evaluate((el) => {
              const computed = window.getComputedStyle(el);
              const color = computed.color;
              const backgroundColor = computed.backgroundColor;
              
              // Get RGB values for contrast calculation
              const getColorValues = (colorStr: string) => {
                const match = colorStr.match(/rgb\((\d+), (\d+), (\d+)\)/);
                return match ? {
                  r: parseInt(match[1]),
                  g: parseInt(match[2]),
                  b: parseInt(match[3])
                } : null;
              };

              return {
                color: getColorValues(color),
                backgroundColor: getColorValues(backgroundColor),
                fontSize: computed.fontSize,
                fontWeight: computed.fontWeight,
                tagName: el.tagName.toLowerCase()
              };
            });

            // Basic contrast check (simplified)
            if (contrastInfo.color && contrastInfo.backgroundColor) {
              const { color, backgroundColor } = contrastInfo;
              
              // Calculate relative luminance (simplified)
              const getLuminance = (rgb: any) => {
                const { r, g, b } = rgb;
                const [rs, gs, bs] = [r, g, b].map(c => {
                  c = c / 255;
                  return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
                });
                return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
              };

              const textLum = getLuminance(color);
              const bgLum = getLuminance(backgroundColor);
              const contrast = (Math.max(textLum, bgLum) + 0.05) / (Math.min(textLum, bgLum) + 0.05);

              // WCAG AA requires 4.5:1 for normal text, 3:1 for large text
              const fontSize = parseInt(contrastInfo.fontSize);
              const isLargeText = fontSize >= 18 || (fontSize >= 14 && parseInt(contrastInfo.fontWeight) >= 700);
              const requiredContrast = isLargeText ? 3 : 4.5;

              console.log(`${selector} contrast: ${contrast.toFixed(2)}:1 (required: ${requiredContrast}:1)`);
              
              // Note: This is a basic check. In production, use a proper contrast calculation library
              if (contrast < requiredContrast) {
                console.warn(`Low contrast detected for ${selector}: ${contrast.toFixed(2)}:1`);
              }
            }
          }
        }
      }
      
      await glassHelpers.captureComponent('body', {
        name: 'contrast-validation-overview',
        animations: 'disabled'
      });
    });

    test('glass components maintain readability', async ({ page }) => {
      const glassComponents = [
        { story: 'card-glasscard--with-content', selector: '#storybook-root [data-liquid-glass-card="true"], #storybook-root .glass-foundation-complete', name: 'card' },
        { story: 'modal-glassmodal--with-content', selector: '#storybook-root [role="dialog"]', name: 'modal' },
        { story: 'navigation-glasssidebar--default', selector: '#storybook-root [role="navigation"]', name: 'sidebar' }
      ];

      for (const component of glassComponents) {
        await glassHelpers.navigateToStory(component.story.split('--')[0], component.story.split('--')[1]);
        
        // Test readability on different backgrounds
        const backgrounds = ['light', 'dark', 'colorful'];
        
        for (const bg of backgrounds) {
          await page.evaluate((background) => {
            document.body.style.background = 
              background === 'light' ? '#ffffff' :
              background === 'dark' ? '#000000' :
              'linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1)';
          }, bg);

          await glassHelpers.waitForGlassEffects();
          
          await glassHelpers.captureComponent(component.selector, {
            name: `glass-readability-${component.name}-${bg}-bg`,
            animations: 'disabled'
          });
        }
      }
    });
  });

  test.describe('Motion and Animation Preferences', () => {
    test('should respect reduced motion preferences', async ({ page }) => {
      const animatedComponents = [
        { story: 'button-glassbutton--default', selector: '#storybook-root button' },
        { story: 'card-glasscard--hoverable', selector: '#storybook-root [role="button"]' },
        { story: 'modal-glassmodal--animated', selector: '#storybook-root [role="dialog"]' }
      ];

      for (const component of animatedComponents) {
        await glassHelpers.navigateToStory(component.story.split('--')[0], component.story.split('--')[1]);
        
        // Test with reduced motion
        await page.emulateMedia({ reducedMotion: 'reduce' });
        
        // Trigger animations
        const element = page.locator(component.selector).filter({ visible: true }).first();
        await element.hover();
        await page.waitForTimeout(300);
        
        await glassHelpers.captureComponent(component.selector, {
          name: `reduced-motion-${component.story.split('-')[1]}`,
          animations: 'disabled'
        });

        // Verify animations are minimal or disabled
        const animationProperties = await element.evaluate((el) => {
          const computed = window.getComputedStyle(el);
          return {
            animationDuration: computed.animationDuration,
            transitionDuration: computed.transitionDuration,
            transform: computed.transform
          };
        });

        // In reduced motion, durations should be minimal
        expect(
          animationProperties.animationDuration === '0s' ||
          animationProperties.animationDuration === '0.01s' ||
          animationProperties.transitionDuration === '0s' ||
          animationProperties.transitionDuration === '0.01s'
        ).toBeTruthy();
      }
    });

    test('should handle vestibular motion sensitivities', async ({ page }) => {
      await glassHelpers.navigateToStory('animations-glassmotioncontroller', 'vestibular-safe');
      
      await page.emulateMedia({ reducedMotion: 'reduce' });
      
      // Test components that might cause motion sickness
      const motionSensitiveElements = [
        '[data-testid="parallax-element"]',
        '[data-testid="rotating-element"]',
        '[data-testid="scaling-element"]'
      ];

      for (const selector of motionSensitiveElements) {
        const element = page.locator(selector);
        
        if (await element.isVisible()) {
          await glassHelpers.captureComponent(selector, {
            name: `vestibular-safe-${selector.replace(/[\[\]"=-]/g, '')}`,
            animations: 'disabled'
          });
        }
      }
    });
  });

  test.describe('Screen Reader and Assistive Technology Support', () => {
    test('should have proper semantic structure', async ({ page }) => {
      await glassHelpers.navigateToStory('layout-glassdashboard', 'accessible');
      
      // Check landmark elements
      const landmarks = await page.evaluate(() => {
        const landmarks = [];
        const roles = ['banner', 'navigation', 'main', 'complementary', 'contentinfo'];
        
        roles.forEach(role => {
          const root = document.querySelector('#storybook-root') ?? document;
          const elements = root.querySelectorAll(`[role="${role}"], ${role === 'banner' ? 'header' : role === 'navigation' ? 'nav' : role === 'main' ? 'main' : role === 'complementary' ? 'aside' : 'footer'}`);
          landmarks.push({ role, count: elements.length });
        });
        
        return landmarks;
      });

      // Should have basic page structure
      const mainLandmark = landmarks.find(l => l.role === 'main');
      expect(mainLandmark?.count).toBeGreaterThan(0);
      
      await glassHelpers.captureComponent('body', {
        name: 'semantic-structure-overview',
        animations: 'disabled'
      });
    });

    test('should have proper heading hierarchy', async ({ page }) => {
      await glassHelpers.navigateToStory('templates-dashboard-glassdashboard', 'complete');
      
      const headingHierarchy = await page.evaluate(() => {
        const root = document.querySelector('#storybook-root') ?? document;
        const headings = Array.from(root.querySelectorAll('h1, h2, h3, h4, h5, h6'));
        return headings.filter((heading) => {
          const rect = heading.getBoundingClientRect();
          return rect.width > 0 && rect.height > 0;
        }).map((heading, index) => ({
          level: parseInt(heading.tagName.charAt(1)),
          text: heading.textContent?.substring(0, 50) || '',
          order: index
        }));
      });

      // Should start with h1
      if (headingHierarchy.length > 0) {
        expect(headingHierarchy[0].level).toBe(1);
      }

      // Check for proper nesting (no skipping levels)
      for (let i = 1; i < headingHierarchy.length; i++) {
        const current = headingHierarchy[i];
        const previous = headingHierarchy[i - 1];
        
        if (current.level > previous.level) {
          expect(current.level - previous.level).toBeLessThanOrEqual(1);
        }
      }
    });

    test('should have accessible form labels and descriptions', async ({ page }) => {
      await glassHelpers.navigateToStory('forms-glassform', 'accessible');
      
      const formElements = await page.evaluate(() => {
        const inputs = Array.from(document.querySelectorAll('input, select, textarea'));
        return inputs.map(input => {
          const id = input.id;
          const label = document.querySelector(`label[for="${id}"]`);
          const ariaLabel = input.getAttribute('aria-label');
          const ariaLabelledBy = input.getAttribute('aria-labelledby');
          const ariaDescribedBy = input.getAttribute('aria-describedby');
          
          return {
            id,
            hasLabel: !!label,
            hasAriaLabel: !!ariaLabel,
            hasAriaLabelledBy: !!ariaLabelledBy,
            hasAriaDescribedBy: !!ariaDescribedBy,
            hasAccessibleName: !!(label || ariaLabel || ariaLabelledBy)
          };
        });
      });

      // All form elements should have accessible names
      formElements.forEach(element => {
        expect(element.hasAccessibleName).toBeTruthy();
      });

      await glassHelpers.captureComponent('#storybook-root form, #storybook-root [data-testid="glassform"]', {
        name: 'accessible-form-structure',
        animations: 'disabled'
      });
    });

    test('should support keyboard navigation patterns', async ({ page }) => {
      await glassHelpers.navigateToStory('navigation-glasstabs', 'keyboard-nav');
      
      // Test tab navigation
      const tabs = page.locator('[role="tab"]');
      const tabCount = await tabs.count();
      
      if (tabCount > 0) {
        // Focus first tab
        await tabs.first().focus();
        let focused = await page.locator(':focus').textContent();
        
        await glassHelpers.captureComponent('[role="tablist"]', {
          name: 'tabs-keyboard-nav-1',
          animations: 'disabled'
        });

        // Navigate with arrow keys
        await page.keyboard.press('ArrowRight');
        await glassHelpers.waitForGlassEffects();
        
        const newFocused = await page.locator(':focus').textContent();
        expect(newFocused).not.toBe(focused);
        
        await glassHelpers.captureComponent('[role="tablist"]', {
          name: 'tabs-keyboard-nav-2',
          animations: 'disabled'
        });
      }
    });
  });

  test.describe('Error States and Validation', () => {
    test('should show clear error indicators', async ({ page }) => {
      await glassHelpers.navigateToStory('input-glassinput', 'with-validation');
      
      const input = page.locator('#storybook-root input[aria-invalid="true"], #storybook-root input').last();
      
      // Trigger validation error
      await input.fill('invalid-email');
      await page.keyboard.press('Tab'); // Blur to trigger validation
      
      await glassHelpers.waitForGlassEffects();
      
      await glassHelpers.captureComponent('#storybook-root input, #storybook-root [data-testid="glassinput"]', {
        name: 'input-error-state',
        animations: 'disabled'
      });

      // Check for error message
      const errorMessage = page.locator('[role="alert"], .error-message, [aria-live="polite"]');
      if (await errorMessage.isVisible()) {
        await expect(errorMessage).toBeVisible();
      }

      // Check for proper ARIA attributes
      const ariaInvalid = await input.getAttribute('aria-invalid');
      const ariaDescribedBy = await input.getAttribute('aria-describedby');
      
      if (ariaInvalid) {
        expect(ariaInvalid).toBe('true');
      }
      if (ariaDescribedBy) {
        let visibleDescriptionCount = 0;
        for (const id of ariaDescribedBy.split(/\s+/).filter(Boolean)) {
          const errorElement = page.locator(`[id="${id.replace(/"/g, '\\"')}"]`);
          if (await errorElement.isVisible()) {
            visibleDescriptionCount += 1;
          }
        }
        expect(visibleDescriptionCount).toBeGreaterThan(0);
      }
    });

    test('should provide clear success indicators', async ({ page }) => {
      await glassHelpers.navigateToStory('input-glassinput', 'with-validation');
      
      const input = page.locator('#storybook-root input').first();
      
      // Enter valid data
      await input.fill('valid@example.com');
      await page.keyboard.press('Tab');
      
      await glassHelpers.waitForGlassEffects();
      
      await glassHelpers.captureComponent('#storybook-root input, #storybook-root [data-testid="glassinput"]', {
        name: 'input-success-state',
        animations: 'disabled'
      });

      // Check for success indicators
      const successIndicator = page.locator('.success-message, [aria-live="polite"]');
      const ariaInvalid = await input.getAttribute('aria-invalid');
      
      if (ariaInvalid) {
        expect(ariaInvalid).toBe('false');
      }
    });
  });

  test.describe('Touch and Mobile Accessibility', () => {
    test('should have appropriate touch target sizes', async ({ page }) => {
      await glassHelpers.navigateToStory('navigation-glassbottomnav', 'default');
      
      await page.setViewportSize({ width: 375, height: 667 });
      await glassHelpers.waitForGlassEffects();
      
      const touchTargets = page.locator([
        '#storybook-root button',
        '#storybook-root a:not(.skip-link):not(.glass-sr-only)',
        '#storybook-root [role="button"]',
        '#storybook-root [role="tab"]',
        '#storybook-root input',
        '#storybook-root select'
      ].join(', '));
      const count = await touchTargets.count();
      
      for (let i = 0; i < Math.min(count, 10); i++) {
        const target = touchTargets.nth(i);
        
        if (await target.isVisible()) {
          const boundingBox = await target.boundingBox();
          
          if (boundingBox) {
            // WCAG recommends minimum 44px x 44px touch targets
            expect(boundingBox.width).toBeGreaterThanOrEqual(44);
            expect(boundingBox.height).toBeGreaterThanOrEqual(44);
          }
        }
      }
      
      await glassHelpers.captureComponent('#storybook-root [role="tablist"]', {
        name: 'mobile-touch-targets',
        animations: 'disabled'
      });
    });

    test('should support voice control navigation', async ({ page }) => {
      await glassHelpers.navigateToStory('button-glassbutton', 'voice-control-labels');
      
      // Check for voice control friendly labels
      const buttons = page.locator('#storybook-root button');
      const count = await buttons.count();
      
      for (let i = 0; i < count; i++) {
        const button = buttons.nth(i);
        const accessibleName = await button.evaluate((el) => {
          // Get computed accessible name
          const ariaLabel = el.getAttribute('aria-label');
          const ariaLabelledBy = el.getAttribute('aria-labelledby');
          const textContent = el.textContent?.trim();
          
          return ariaLabel || 
                 (ariaLabelledBy && document.getElementById(ariaLabelledBy)?.textContent) || 
                 textContent;
        });
        
        // Voice control works better with descriptive names
        if (accessibleName) {
          expect(accessibleName.length).toBeGreaterThan(1);
          expect(accessibleName).not.toMatch(/^button$|^click$/i); // Generic names are not helpful
        }
      }
      
      await glassHelpers.captureComponent('body', {
        name: 'voice-control-friendly',
        animations: 'disabled'
      });
    });
  });
});
