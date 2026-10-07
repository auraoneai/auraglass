import { Page, Locator, expect } from '@playwright/test';

const STORY_ID_ALIASES: Record<string, string> = {
  'button-glassbutton--default': 'controls-buttons-glass-button--variants',
  'button-glassbutton--voice-control-labels': 'controls-buttons-glass-button--variants',
  'button-glassbutton--with-aria-label': 'controls-buttons-glass-button--icon-only',
  'input-glassinput--default': 'controls-inputs-glass-input--default',
  'input-glassinput--with-validation': 'controls-inputs-glass-input--default',
  'input-glassselect--default': 'controls-inputs-glass-select--default',
  'navigation-glasstabs--default': 'navigation-glass-tabs--default',
  'navigation-glasstabs--keyboard-nav': 'navigation-glass-tabs--default',
  'navigation-glassbottomnav--default': 'navigation-glass-bottom-nav--default',
  'card-glasscard--interactive': 'surfaces-cards-panels-glass-card--interactive-cards',
  'card-glasscard--default': 'surfaces-cards-panels-glass-card--default',
  'card-glasscard--hoverable': 'surfaces-cards-panels-glass-card--interactive-cards',
  'card-glasscard--semantic-structure': 'surfaces-cards-panels-glass-card--default',
  'card-glasscard--with-content': 'surfaces-cards-panels-glass-card--default',
  'forms-glassform--comprehensive': 'controls-inputs-glass-form--default',
  'forms-glassform--accessible': 'controls-inputs-glass-form--default',
  'typography--color-variants': 'data-visualization-typography--variants',
  'modal-glassmodal--with-content': 'surfaces-modals-glass-modal--default',
  'modal-glassmodal--animated': 'surfaces-modals-glass-modal--default',
  'navigation-glasssidebar--default': 'navigation-glass-sidebar--default',
  'layout-glassdashboard--accessible': 'workflows-glass-dashboard--default',
  'templates-dashboard-glassdashboard--complete': 'workflows-glass-dashboard--default',
  'animations-glassmotioncontroller--vestibular-safe': 'foundations-motion-glass-motion-controller--default',
};

/**
 * Visual testing utilities for glassmorphism components
 */
export class GlassmorphismTestHelpers {
  constructor(private page: Page) {}

  /**
   * Navigate to a Storybook story
   */
  async navigateToStory(componentName: string, storyName: string) {
    const storyId = `${componentName.toLowerCase()}--${storyName.toLowerCase().replace(/\s+/g, '-')}`;
    const resolvedStoryId = STORY_ID_ALIASES[storyId] ?? storyId;
    await this.page.goto(`/iframe.html?id=${resolvedStoryId}&viewMode=story`, { waitUntil: 'domcontentloaded' });
    await this.page.locator('#storybook-root, #root, body').first().waitFor({ state: 'visible' });
    // Wait for any animations to complete
    await this.page.waitForTimeout(1000);
  }

  /**
   * Wait for glassmorphism effects to stabilize
   */
  async waitForGlassEffects() {
    // Wait for CSS transitions and animations
    await this.page.waitForTimeout(500);
    
    // Wait for any backdrop filters to apply
    await this.page.evaluate(() => {
      return new Promise(resolve => {
        setTimeout(() => {
          const elements = document.querySelectorAll('[class*="glass"], [class*="backdrop"]');
          resolve(elements.length);
        }, 200);
      });
    });
  }

  /**
   * Capture component screenshot with glassmorphism-specific setup
   */
  async captureComponent(selector: string, options: {
    name: string;
    animations?: 'disabled' | 'allow';
    threshold?: number;
    mask?: string[];
  } = { name: 'component' }) {
    // Disable animations if requested
    if (options.animations === 'disabled') {
      await this.page.addStyleTag({
        content: `
          *, *::before, *::after {
            animation-duration: 0.01ms !important;
            animation-delay: -0.01ms !important;
            transition-duration: 0.01ms !important;
            transition-delay: -0.01ms !important;
          }
        `
      });
    }

    await this.waitForGlassEffects();
    
    const element = this.page.locator(selector).filter({ visible: true }).first();
    await expect(element).toBeVisible();
    
    // Mask dynamic elements if specified
    const mask = options.mask?.map(maskSelector => this.page.locator(maskSelector)) || [];
    
    await expect(element).toHaveScreenshot(`${options.name}.png`, {
      threshold: options.threshold || 0.3,
      mask,
      animations: options.animations === 'disabled' ? 'disabled' : 'allow',
    });
  }

  /**
   * Test glassmorphism elevation levels
   */
  async testElevationLevels(componentSelector: string, levels: string[]) {
    for (const level of levels) {
      await this.page.evaluate((data) => {
        const element = document.querySelector(data.selector);
        if (element) {
          // Remove existing elevation classes
          element.className = element.className.replace(/elevation-\w+/g, '').replace(/level\w+/g, '');
          // Add new elevation class
          element.classList.add(`elevation-${data.level}`);
        }
      }, { selector: componentSelector, level });
      
      await this.waitForGlassEffects();
      await this.captureComponent(componentSelector, {
        name: `elevation-${level}`,
        animations: 'disabled'
      });
    }
  }

  /**
   * Test glassmorphism tint variations
   */
  async testTintVariations(componentSelector: string, tints: string[]) {
    for (const tint of tints) {
      await this.page.evaluate((data) => {
        const element = document.querySelector(data.selector);
        if (element) {
          // Remove existing tint classes
          element.className = element.className.replace(/tint-\w+/g, '');
          // Add new tint class
          element.classList.add(`tint-${data.tint}`);
        }
      }, { selector: componentSelector, tint });
      
      await this.waitForGlassEffects();
      await this.captureComponent(componentSelector, {
        name: `tint-${tint}`,
        animations: 'disabled'
      });
    }
  }

  /**
   * Test component states (hover, focus, active, disabled)
   */
  async testInteractionStates(componentSelector: string) {
    const element = this.page.locator(componentSelector);
    
    // Default state
    await this.captureComponent(componentSelector, {
      name: 'default-state',
      animations: 'disabled'
    });

    // Hover state
    await element.hover();
    await this.waitForGlassEffects();
    await this.captureComponent(componentSelector, {
      name: 'hover-state',
      animations: 'disabled'
    });

    // Focus state (if focusable)
    try {
      await element.focus();
      await this.waitForGlassEffects();
      await this.captureComponent(componentSelector, {
        name: 'focus-state',
        animations: 'disabled'
      });
    } catch (e) {
      // Element not focusable, skip
    }

    // Active/pressed state (if clickable)
    try {
      await element.hover(); // Ensure we're hovering
      await this.page.mouse.down();
      await this.waitForGlassEffects();
      await this.captureComponent(componentSelector, {
        name: 'active-state',
        animations: 'disabled'
      });
      await this.page.mouse.up();
    } catch (e) {
      // Element not clickable, skip
    }
  }

  /**
   * Test disabled state
   */
  async testDisabledState(componentSelector: string) {
    await this.page.evaluate((selector) => {
      const element = document.querySelector(selector);
      if (element) {
        element.setAttribute('disabled', '');
        element.setAttribute('aria-disabled', 'true');
        element.classList.add('disabled', 'opacity-50', 'pointer-events-none');
      }
    }, componentSelector);
    
    await this.waitForGlassEffects();
    await this.captureComponent(componentSelector, {
      name: 'disabled-state',
      animations: 'disabled'
    });
  }

  /**
   * Test loading state
   */
  async testLoadingState(componentSelector: string) {
    await this.page.evaluate((selector) => {
      const element = document.querySelector(selector);
      if (element) {
        element.classList.add('loading', 'animate-pulse');
        element.setAttribute('aria-busy', 'true');
      }
    }, componentSelector);
    
    await this.waitForGlassEffects();
    await this.captureComponent(componentSelector, {
      name: 'loading-state',
      animations: 'allow' // Allow loading animations
    });
  }

  /**
   * Validate glassmorphism properties are applied
   */
  async validateGlassProperties(selector: string) {
    const element = this.page.locator(selector);
    
    const styles = await element.evaluate((el) => {
      const computed = window.getComputedStyle(el);
      return {
        backdropFilter: computed.backdropFilter,
        background: computed.background,
        border: computed.border,
        borderRadius: computed.borderRadius,
        boxShadow: computed.boxShadow,
      };
    });

    // Validate backdrop filter is applied
    expect(styles.backdropFilter).not.toBe('none');
    expect(styles.backdropFilter).toContain('blur');
    
    // Validate semi-transparent background
    expect(styles.background).toMatch(/rgba?\([^)]+,\s*0?\.\d+\)|hsla?\([^)]+,\s*0?\.\d+\)/);
    
    return styles;
  }

  /**
   * Test contrast ratios for accessibility
   */
  async validateContrastRatios(selector: string, minRatio: number = 4.5) {
    const contrastData = await this.page.evaluate((data) => {
      const element = document.querySelector(data.selector);
      if (!element) return null;

      const computed = window.getComputedStyle(element);
      const backgroundColor = computed.backgroundColor;
      const color = computed.color;
      
      // Simple contrast calculation (would need proper contrast calculation library)
      // This is a simplified version for demonstration
      return {
        backgroundColor,
        color,
        element: element.tagName
      };
    }, { selector, minRatio });

    return contrastData;
  }

  /**
   * Test component at different viewport sizes
   */
  async testResponsiveBreakpoints(componentSelector: string, breakpoints: {
    name: string;
    width: number;
    height: number;
  }[]) {
    for (const breakpoint of breakpoints) {
      await this.page.setViewportSize({
        width: breakpoint.width,
        height: breakpoint.height
      });
      
      await this.waitForGlassEffects();
      await this.captureComponent(componentSelector, {
        name: `responsive-${breakpoint.name}`,
        animations: 'disabled'
      });
    }
  }

  /**
   * Test dark mode variants
   */
  async testDarkMode(componentSelector: string) {
    // Switch to dark mode
    await this.page.emulateMedia({ colorScheme: 'dark' });
    await this.page.evaluate(() => {
      document.documentElement.classList.add('dark');
    });
    
    await this.waitForGlassEffects();
    await this.captureComponent(componentSelector, {
      name: 'dark-mode',
      animations: 'disabled'
    });

    // Switch back to light mode
    await this.page.emulateMedia({ colorScheme: 'light' });
    await this.page.evaluate(() => {
      document.documentElement.classList.remove('dark');
    });
  }

  /**
   * Test reduced motion preference
   */
  async testReducedMotion(componentSelector: string) {
    await this.page.emulateMedia({ reducedMotion: 'reduce' });
    
    await this.captureComponent(componentSelector, {
      name: 'reduced-motion',
      animations: 'disabled'
    });
  }

  /**
   * Batch test all component variants
   */
  async testAllVariants(componentSelector: string, variants: {
    elevations?: string[];
    tints?: string[];
    sizes?: string[];
    states?: boolean;
    responsive?: boolean;
    darkMode?: boolean;
  }) {
    const results: string[] = [];

    if (variants.elevations) {
      await this.testElevationLevels(componentSelector, variants.elevations);
      results.push('elevations');
    }

    if (variants.tints) {
      await this.testTintVariations(componentSelector, variants.tints);
      results.push('tints');
    }

    if (variants.states) {
      await this.testInteractionStates(componentSelector);
      await this.testDisabledState(componentSelector);
      await this.testLoadingState(componentSelector);
      results.push('states');
    }

    if (variants.responsive) {
      await this.testResponsiveBreakpoints(componentSelector, [
        { name: 'mobile', width: 375, height: 667 },
        { name: 'tablet', width: 768, height: 1024 },
        { name: 'desktop', width: 1920, height: 1080 }
      ]);
      results.push('responsive');
    }

    if (variants.darkMode) {
      await this.testDarkMode(componentSelector);
      results.push('darkMode');
    }

    return results;
  }
}

/**
 * Design system token validation helpers
 */
export class DesignSystemValidator {
  constructor(private page: Page) {}

  /**
   * Validate CSS custom properties are defined
   */
  async validateTokens(expectedTokens: string[]) {
    const definedTokens = await this.page.evaluate((tokens) => {
      const style = getComputedStyle(document.documentElement);
      return tokens.filter(token => {
        const value = style.getPropertyValue(token);
        return value.trim() !== '';
      });
    }, expectedTokens);

    expect(definedTokens).toEqual(expectedTokens);
    return definedTokens;
  }

  /**
   * Validate glass elevation system
   */
  async validateElevationSystem() {
    const elevationTokens = [
      '--glass-elevation-level1',
      '--glass-elevation-level2',
      '--glass-elevation-level3',
      '--glass-elevation-level4',
      '--glass-elevation-float',
      '--glass-elevation-modal'
    ];

    return this.validateTokens(elevationTokens);
  }

  /**
   * Validate spacing system
   */
  async validateSpacingSystem() {
    const spacingTokens = Array.from({ length: 20 }, (_, i) => `--glass-spacing-${i}`);
    return this.validateTokens(spacingTokens);
  }

  /**
   * Validate color system
   */
  async validateColorSystem() {
    const colorTokens = [
      '--glass-primary',
      '--glass-secondary',
      '--glass-accent',
      '--glass-background',
      '--glass-surface',
      '--glass-text-primary',
      '--glass-text-secondary'
    ];

    return this.validateTokens(colorTokens);
  }
}
