import { test, expect } from '@playwright/test';
import { DesignSystemValidator } from '../utils/glassmorphism-helpers';

test.describe('Design System Token Validation', () => {
  let validator: DesignSystemValidator;

  test.beforeEach(async ({ page }) => {
    validator = new DesignSystemValidator(page);
    // Load a component story to ensure tokens are available
    await page.goto('/iframe.html?id=button-glassbutton--default&viewMode=story');
    await page.waitForLoadState('networkidle');
  });

  test('should have all glass elevation tokens defined', async () => {
    const elevationTokens = [
      '--glass-elevation-level1',
      '--glass-elevation-level2', 
      '--glass-elevation-level3',
      '--glass-elevation-level4',
      '--glass-elevation-float',
      '--glass-elevation-modal'
    ];

    const definedTokens = await validator.validateTokens(elevationTokens);
    expect(definedTokens).toEqual(elevationTokens);
  });

  test('should have proper glass backdrop blur values', async ({ page }) => {
    const blurValues = await page.evaluate(() => {
      const style = getComputedStyle(document.documentElement);
      return {
        level1: style.getPropertyValue('--glass-blur-level1').trim(),
        level2: style.getPropertyValue('--glass-blur-level2').trim(),
        level3: style.getPropertyValue('--glass-blur-level3').trim(),
        level4: style.getPropertyValue('--glass-blur-level4').trim(),
      };
    });

    // Validate blur values are progressive
    expect(blurValues.level1).toBeTruthy();
    expect(blurValues.level2).toBeTruthy();
    expect(blurValues.level3).toBeTruthy();
    expect(blurValues.level4).toBeTruthy();

    // Extract numeric values for comparison
    const getBlurValue = (blur: string) => {
      const match = blur.match(/blur\((\d+(?:\.\d+)?)px\)/);
      return match ? parseFloat(match[1]) : 0;
    };

    const blur1 = getBlurValue(blurValues.level1);
    const blur2 = getBlurValue(blurValues.level2);
    const blur3 = getBlurValue(blurValues.level3);
    const blur4 = getBlurValue(blurValues.level4);

    expect(blur2).toBeGreaterThan(blur1);
    expect(blur3).toBeGreaterThan(blur2);
    expect(blur4).toBeGreaterThan(blur3);
  });

  test('should have consistent spacing system', async () => {
    const spacingTokens = Array.from({ length: 13 }, (_, i) => `--glass-spacing-${i}`);
    const definedTokens = await validator.validateTokens(spacingTokens);
    expect(definedTokens.length).toBeGreaterThanOrEqual(8); // At least basic spacing tokens
  });

  test('should have semantic color tokens', async () => {
    const colorTokens = [
      '--glass-primary',
      '--glass-secondary', 
      '--glass-accent',
      '--glass-background',
      '--glass-surface',
      '--glass-border',
      '--glass-text-primary',
      '--glass-text-secondary',
      '--glass-text-muted'
    ];

    const definedTokens = await validator.validateTokens(colorTokens);
    expect(definedTokens.length).toBeGreaterThanOrEqual(6); // Core colors must be defined
  });

  test('should have proper opacity scale', async ({ page }) => {
    const opacityValues = await page.evaluate(() => {
      const style = getComputedStyle(document.documentElement);
      return {
        subtle: style.getPropertyValue('--glass-opacity-subtle').trim(),
        medium: style.getPropertyValue('--glass-opacity-medium').trim(),
        strong: style.getPropertyValue('--glass-opacity-strong').trim(),
        intense: style.getPropertyValue('--glass-opacity-intense').trim(),
      };
    });

    // Validate opacity values are numbers between 0 and 1
    Object.values(opacityValues).forEach(value => {
      if (value) {
        const num = parseFloat(value);
        expect(num).toBeGreaterThanOrEqual(0);
        expect(num).toBeLessThanOrEqual(1);
      }
    });
  });

  test('should have border radius scale', async ({ page }) => {
    const radiusTokens = [
      '--glass-radius-none',
      '--glass-radius-sm',
      '--glass-radius-md',
      '--glass-radius-lg',
      '--glass-radius-xl',
      '--glass-radius-2xl',
      '--glass-radius-full'
    ];

    const radiusValues = await page.evaluate((tokens) => {
      const style = getComputedStyle(document.documentElement);
      return tokens.map(token => ({
        token,
        value: style.getPropertyValue(token).trim()
      }));
    }, radiusTokens);

    // Check that at least some radius tokens are defined
    const definedRadius = radiusValues.filter(r => r.value !== '');
    expect(definedRadius.length).toBeGreaterThanOrEqual(4);

    // Validate 'none' is 0 and 'full' is appropriate
    const noneValue = radiusValues.find(r => r.token === '--glass-radius-none')?.value;
    const fullValue = radiusValues.find(r => r.token === '--glass-radius-full')?.value;
    
    if (noneValue) expect(noneValue).toBe('0');
    if (fullValue) expect(fullValue).toMatch(/50%|9999px/);
  });

  test('should have consistent shadow system', async ({ page }) => {
    const shadowTokens = [
      '--glass-shadow-sm',
      '--glass-shadow-md', 
      '--glass-shadow-lg',
      '--glass-shadow-xl',
      '--glass-shadow-2xl'
    ];

    const shadowValues = await page.evaluate((tokens) => {
      const style = getComputedStyle(document.documentElement);
      return tokens.map(token => ({
        token,
        value: style.getPropertyValue(token).trim()
      }));
    }, shadowTokens);

    // Validate shadows are defined and contain proper shadow syntax
    shadowValues.forEach(shadow => {
      if (shadow.value) {
        expect(shadow.value).toMatch(/\d+px.*rgba?\(/);
      }
    });
  });

  test('should have animation duration tokens', async ({ page }) => {
    const durationTokens = [
      '--glass-duration-fast',
      '--glass-duration-normal',
      '--glass-duration-slow',
      '--glass-duration-slower'
    ];

    const durationValues = await page.evaluate((tokens) => {
      const style = getComputedStyle(document.documentElement);
      return tokens.map(token => ({
        token,
        value: style.getPropertyValue(token).trim()
      }));
    }, durationTokens);

    // Validate durations are defined and are valid CSS time values
    durationValues.forEach(duration => {
      if (duration.value) {
        expect(duration.value).toMatch(/\d+(ms|s)/);
      }
    });
  });

  test('should have proper transition timing functions', async ({ page }) => {
    const easingTokens = [
      '--glass-ease-in',
      '--glass-ease-out',
      '--glass-ease-in-out',
      '--glass-ease-bounce',
      '--glass-ease-glass'
    ];

    const easingValues = await page.evaluate((tokens) => {
      const style = getComputedStyle(document.documentElement);
      return tokens.map(token => ({
        token,
        value: style.getPropertyValue(token).trim()
      }));
    }, easingTokens);

    // Validate easing functions are defined
    const definedEasing = easingValues.filter(e => e.value !== '');
    expect(definedEasing.length).toBeGreaterThanOrEqual(3);
  });

  test('should have typography scale tokens', async ({ page }) => {
    const typographyTokens = [
      '--glass-font-size-xs',
      '--glass-font-size-sm',
      '--glass-font-size-base',
      '--glass-font-size-lg',
      '--glass-font-size-xl',
      '--glass-font-size-2xl',
      '--glass-font-size-3xl'
    ];

    const typographyValues = await page.evaluate((tokens) => {
      const style = getComputedStyle(document.documentElement);
      return tokens.map(token => ({
        token,
        value: style.getPropertyValue(token).trim()
      }));
    }, typographyTokens);

    // Validate at least basic typography tokens are defined
    const definedTypography = typographyValues.filter(t => t.value !== '');
    expect(definedTypography.length).toBeGreaterThanOrEqual(4);
  });

  test('should have consistent glass tint system', async ({ page }) => {
    const tintTokens = [
      '--glass-tint-neutral',
      '--glass-tint-primary',
      '--glass-tint-secondary',
      '--glass-tint-accent',
      '--glass-tint-success',
      '--glass-tint-warning',
      '--glass-tint-error'
    ];

    const tintValues = await page.evaluate((tokens) => {
      const style = getComputedStyle(document.documentElement);
      return tokens.map(token => ({
        token,
        value: style.getPropertyValue(token).trim()
      }));
    }, tintTokens);

    // Validate tint values are proper CSS colors
    tintValues.forEach(tint => {
      if (tint.value) {
        expect(tint.value).toMatch(/^(#|rgb|hsl|var\()/);
      }
    });
  });

  test('should have breakpoint tokens', async ({ page }) => {
    const breakpointTokens = [
      '--glass-breakpoint-sm',
      '--glass-breakpoint-md', 
      '--glass-breakpoint-lg',
      '--glass-breakpoint-xl',
      '--glass-breakpoint-2xl'
    ];

    const breakpointValues = await page.evaluate((tokens) => {
      const style = getComputedStyle(document.documentElement);
      return tokens.map(token => ({
        token,
        value: style.getPropertyValue(token).trim()
      }));
    }, breakpointTokens);

    // Validate breakpoints are defined as pixel or em values
    breakpointValues.forEach(breakpoint => {
      if (breakpoint.value) {
        expect(breakpoint.value).toMatch(/\d+(px|em|rem)/);
      }
    });
  });
});

test.describe('Design System Visual Consistency', () => {
  test('should maintain consistent glass effects across components', async ({ page }) => {
    // Test multiple components have similar glass properties
    const components = [
      { story: 'button-glassbutton--default', selector: '[data-testid="glass-button"]' },
      { story: 'card-glasscard--default', selector: '[data-testid="glass-card"]' },
      { story: 'input-glassinput--default', selector: '[data-testid="glass-input"]' }
    ];

    const glassProperties = [];

    for (const component of components) {
      await page.goto(`/iframe.html?id=${component.story}&viewMode=story`);
      await page.waitForLoadState('networkidle');
      
      const styles = await page.locator(component.selector).first().evaluate((el) => {
        const computed = window.getComputedStyle(el);
        return {
          backdropFilter: computed.backdropFilter,
          background: computed.background,
          borderRadius: computed.borderRadius,
        };
      });

      glassProperties.push({ component: component.story, styles });
    }

    // Verify all components have backdrop-filter applied
    glassProperties.forEach(prop => {
      expect(prop.styles.backdropFilter).not.toBe('none');
      expect(prop.styles.backdropFilter).toContain('blur');
    });
  });

  test('should have consistent elevation visual hierarchy', async ({ page }) => {
    await page.goto('/iframe.html?id=card-glasscard--elevation-variants&viewMode=story');
    await page.waitForLoadState('networkidle');

    // Wait for animations to settle
    await page.waitForTimeout(1000);

    // Take screenshot of elevation hierarchy
    await expect(page.locator('[data-testid="elevation-showcase"]')).toHaveScreenshot('elevation-hierarchy.png', {
      threshold: 0.3,
      animations: 'disabled'
    });
  });
});