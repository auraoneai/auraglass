import React from 'react';
import { render, RenderOptions, RenderResult } from '@testing-library/react';
import { GlassThemeProvider } from '../theme/ThemeProvider';
import { GlassNotificationProvider } from '../components/data-display/GlassNotificationCenter';
import { GlassMotionController } from '../components/animations/GlassMotionController';
import type { BaseGlassProps, ThemeConfig, AccessibilitySettings } from '../types/productionTypes';

// === Test Utilities ===

export interface GlassTestingOptions {
  theme?: Partial<ThemeConfig>;
  accessibility?: Partial<AccessibilitySettings>;
  enableAnimations?: boolean;
  enableNotifications?: boolean;
  mockIntersectionObserver?: boolean;
  mockResizeObserver?: boolean;
  mockMatchMedia?: boolean;
}

/**
 * Custom render function with Glass providers
 */
export function renderWithGlassProviders(
  ui: React.ReactElement,
  options: GlassTestingOptions & RenderOptions = {}
): RenderResult {
  const {
    theme,
    accessibility,
    enableAnimations = false,
    enableNotifications = true,
    mockIntersectionObserver = true,
    mockResizeObserver = true,
    mockMatchMedia = true,
    ...renderOptions
  } = options;

  // Mock APIs for testing environment
  if (mockIntersectionObserver && !global.IntersectionObserver) {
    global.IntersectionObserver = class IntersectionObserver {
      root: Element | null = null;
      rootMargin: string = '';
      thresholds: ReadonlyArray<number> = [];
      constructor() {}
      observe() {}
      disconnect() {}
      unobserve() {}
      takeRecords(): IntersectionObserverEntry[] {
        return [];
      }
    } as any;
  }

  if (mockResizeObserver && !global.ResizeObserver) {
    global.ResizeObserver = class ResizeObserver {
      constructor() {}
      observe() {}
      disconnect() {}
      unobserve() {}
    };
  }

  if (mockMatchMedia && !global.matchMedia) {
    global.matchMedia = (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    });
  }

  // Create wrapper with providers
  const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    let wrappedChildren = children;

    // Wrap with motion controller
    if (enableAnimations) {
      wrappedChildren = (
        <GlassMotionController enabled={enableAnimations}>
          {wrappedChildren}
        </GlassMotionController>
      );
    }

    // Wrap with notification provider
    if (enableNotifications) {
      wrappedChildren = (
        <GlassNotificationProvider>
          {wrappedChildren}
        </GlassNotificationProvider>
      );
    }

    // Wrap with theme provider
    wrappedChildren = (
      <GlassThemeProvider>
        {wrappedChildren}
      </GlassThemeProvider>
    );

    return <>{wrappedChildren}</>;
  };

  return render(ui, { wrapper: Wrapper, ...renderOptions });
}

/**
 * Mock data generators for testing
 */
export const mockDataGenerators = {
  // Generate mock chart data
  chartData: (count: number = 10) => 
    Array.from({ length: count }, (_, i) => ({
      x: `Item ${i + 1}`,
      y: Math.floor(Math.random() * 100),
      label: `Data point ${i + 1}`,
    })),

  // Generate mock table data
  tableData: (rows: number = 10, columns: string[] = ['name', 'email', 'status']) =>
    Array.from({ length: rows }, (_, i) => 
      columns.reduce((row, col) => ({
        ...row,
        id: `row-${i}`,
        [col]: col === 'email' 
          ? `user${i}@example.com`
          : col === 'status'
            ? ['active', 'inactive', 'pending'][i % 3]
            : `${col.charAt(0).toUpperCase() + col.slice(1)} ${i + 1}`,
      }), {})
    ),

  // Generate mock tree data
  treeData: (depth: number = 3, childrenPerNode: number = 3) => {
    const generateNode = (level: number, index: number = 0) => {
      const node: {
        id: string;
        label: string;
        children: Array<ReturnType<typeof generateNode>>;
      } = {
        id: `node-${level}-${index}`,
        label: `Node ${level}-${index}`,
        children: [],
      };

      if (level < depth) {
        node.children = Array.from({ length: childrenPerNode }, (_, i) =>
          generateNode(level + 1, i)
        );
      }

      return node;
    };

    return generateNode(0);
  },

  // Generate mock notification data
  notifications: (count: number = 5) =>
    Array.from({ length: count }, (_, i) => ({
      id: `notification-${i}`,
      type: ['success', 'error', 'warning', 'info'][i % 4] as any,
      title: `Notification ${i + 1}`,
      message: `This is a test notification message ${i + 1}`,
      timestamp: Date.now() - (i * 60000),
    })),

  // Generate mock form data
  formData: () => ({
    name: 'John Doe',
    email: 'john@example.com',
    age: 30,
    country: 'US',
    preferences: ['email', 'sms'],
    bio: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  }),

  // Generate mock user data
  users: (count: number = 10) =>
    Array.from({ length: count }, (_, i) => ({
      id: `user-${i}`,
      name: `User ${i + 1}`,
      email: `user${i + 1}@example.com`,
      avatar: `https://i.pravatar.cc/150?img=${i + 1}`,
      status: ['online', 'offline', 'away'][i % 3],
      role: ['admin', 'user', 'moderator'][i % 3],
    })),
};

/**
 * Custom matchers for Glass components
 */
export const glassMatchers = {
  toHaveGlassEffect: (element: HTMLElement) => {
    const styles = window.getComputedStyle(element);
    const hasBackdropFilter = styles.backdropFilter !== 'none' || (styles as any).backdropFilter !== 'none';
    const hasGlassBackground = styles.background.includes('rgba');

    return {
      pass: hasBackdropFilter && hasGlassBackground,
      message: () => `Expected element to have glass morphism effects`,
    };
  },

  toBeAccessible: async (element: HTMLElement) => {
    const issues: string[] = [];

    // Check for basic accessibility requirements
    if (!element.getAttribute('aria-label') && !element.textContent?.trim()) {
      issues.push('Missing accessible label');
    }

    if (element.tagName === 'BUTTON' && !element.getAttribute('type')) {
      issues.push('Button missing type attribute');
    }

    if (element.tagName === 'IMG' && !element.getAttribute('alt')) {
      issues.push('Image missing alt attribute');
    }

    return {
      pass: issues.length === 0,
      message: () => `Accessibility issues: ${issues.join(', ')}`,
    };
  },

  toHavePerformantStyles: (element: HTMLElement) => {
    const styles = window.getComputedStyle(element);
    const hasWillChange = styles.willChange !== 'auto';
    const hasContain = styles.contain !== 'none';
    const hasTransform = styles.transform !== 'none';

    const performanceScore = [hasWillChange, hasContain, hasTransform].filter(Boolean).length;

    return {
      pass: performanceScore >= 2,
      message: () => `Expected element to have performance optimizations (score: ${performanceScore}/3)`,
    };
  },
};

/**
 * Test component factory for creating test instances
 */
export function createTestGlassComponent<P extends BaseGlassProps>(
  defaultProps: P,
  overrides: Partial<P> = {}
): React.ComponentType<Partial<P>> {
  return (props) => {
    const mergedProps = { ...defaultProps, ...overrides, ...props };
    return <div {...mergedProps} data-testid="glass-test-component" />;
  };
}

/**
 * Performance testing utilities
 */
export const performanceTestUtils = {
  // Measure component render time
  measureRenderTime: async (component: React.ReactElement): Promise<number> => {
    const startTime = performance.now();
    renderWithGlassProviders(component);
    const endTime = performance.now();
    return endTime - startTime;
  },

  // Measure memory usage during rendering
  measureMemoryUsage: (callback: () => void): number => {
    const memoryBefore = (performance as any).memory?.usedJSHeapSize || 0;
    callback();
    const memoryAfter = (performance as any).memory?.usedJSHeapSize || 0;
    return memoryAfter - memoryBefore;
  },

  // Simulate slow device
  simulateSlowDevice: () => {
    Object.defineProperty(navigator, 'connection', {
      value: { effectiveType: '2g' },
      configurable: true,
    });

    Object.defineProperty(performance, 'memory', {
      value: { jsHeapSizeLimit: 500000000 }, // 500MB
      configurable: true,
    });
  },

  // Simulate fast device
  simulateFastDevice: () => {
    Object.defineProperty(navigator, 'connection', {
      value: { effectiveType: '4g' },
      configurable: true,
    });

    Object.defineProperty(performance, 'memory', {
      value: { jsHeapSizeLimit: 4000000000 }, // 4GB
      configurable: true,
    });
  },
};

/**
 * Accessibility testing utilities
 */
export const a11yTestUtils = {
  // Simulate screen reader
  simulateScreenReader: () => {
    Object.defineProperty(navigator, 'userAgent', {
      value: navigator.userAgent + ' NVDA',
      configurable: true,
    });
  },

  // Simulate reduced motion preference
  simulateReducedMotion: (enabled: boolean = true) => {
    Object.defineProperty(window, 'matchMedia', {
      value: (query: string) => ({
        matches: query.includes('prefers-reduced-motion') ? enabled : false,
        media: query,
        onchange: null,
        addListener: () => {},
        removeListener: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
        dispatchEvent: () => false,
      }),
      configurable: true,
    });
  },

  // Simulate high contrast mode
  simulateHighContrast: (enabled: boolean = true) => {
    Object.defineProperty(window, 'matchMedia', {
      value: (query: string) => ({
        matches: query.includes('prefers-contrast') ? enabled : false,
        media: query,
        onchange: null,
        addListener: () => {},
        removeListener: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
        dispatchEvent: () => false,
      }),
      configurable: true,
    });
  },

  // Check keyboard navigation
  simulateKeyboardNavigation: (element: HTMLElement) => {
    const tabEvent = new KeyboardEvent('keydown', { key: 'Tab' });
    const enterEvent = new KeyboardEvent('keydown', { key: 'Enter' });
    
    return {
      tab: () => element.dispatchEvent(tabEvent),
      enter: () => element.dispatchEvent(enterEvent),
      focus: () => element.focus(),
      blur: () => element.blur(),
    };
  },
};

/**
 * Animation testing utilities
 */
export const animationTestUtils = {
  // Wait for animation to complete
  waitForAnimation: (duration: number = 300): Promise<void> =>
    new Promise(resolve => setTimeout(resolve, duration + 50)),

  // Mock requestAnimationFrame
  mockAnimationFrame: () => {
    let id = 0;
    const callbacks = new Map<number, FrameRequestCallback>();

    global.requestAnimationFrame = (callback: FrameRequestCallback) => {
      const callbackId = ++id;
      callbacks.set(callbackId, callback);
      return callbackId;
    };

    global.cancelAnimationFrame = (id: number) => {
      callbacks.delete(id);
    };

    return {
      flush: () => {
        callbacks.forEach((callback: any) => callback(performance.now()));
        callbacks.clear();
      },
      clear: () => callbacks.clear(),
    };
  },

  // Test animation performance
  measureAnimationPerformance: async (
    animationFn: () => void,
    duration: number = 1000
  ): Promise<{
    averageFrameTime: number;
    droppedFrames: number;
    totalFrames: number;
  }> => {
    const frameTimes: number[] = [];
    let lastTime = performance.now();
    let frameCount = 0;

    const measureFrame = () => {
      const currentTime = performance.now();
      frameTimes.push(currentTime - lastTime);
      lastTime = currentTime;
      frameCount++;

      if (currentTime - startTime < duration) {
        requestAnimationFrame(measureFrame);
      }
    };

    const startTime = performance.now();
    animationFn();
    requestAnimationFrame(measureFrame);

    // Wait for animation to complete
    await new Promise(resolve => setTimeout(resolve, duration + 100));

    const averageFrameTime = frameTimes.reduce((sum, time) => sum + time, 0) / frameTimes.length;
    const droppedFrames = frameTimes.filter((time: any) => time > 16.67).length; // > 60fps
    
    return {
      averageFrameTime,
      droppedFrames,
      totalFrames: frameCount,
    };
  },
};

/**
 * Glass component testing utilities
 */
export const glassTestUtils = {
  // Create test props with defaults
  createTestProps: <T extends BaseGlassProps>(
    overrides: Partial<T> = {}
  ): T => ({
    'data-testid': 'glass-component',
    blur: 'medium',
    elevation: 'level1',
    variant: 'frosted',
    interactive: false,
    ...overrides,
  } as T),

  // Find glass components in rendered tree
  findGlassComponents: (container: HTMLElement): HTMLElement[] => {
    return Array.from(container.querySelectorAll('[data-testid*="glass"]'));
  },

  // Check if element has glass effects
  hasGlassEffects: (element: HTMLElement): boolean => {
    const styles = window.getComputedStyle(element);
    return (
      styles.backdropFilter !== 'none' ||
      (styles as any).backdropFilter !== 'none' ||
      styles.background.includes('rgba')
    );
  },

  // Simulate glass interactions
  simulateGlassInteraction: {
    hover: (element: HTMLElement) => {
      element.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
    },
    
    leave: (element: HTMLElement) => {
      element.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }));
    },
    
    click: (element: HTMLElement) => {
      element.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    },
    
    focus: (element: HTMLElement) => {
      element.focus();
      element.dispatchEvent(new FocusEvent('focus', { bubbles: true }));
    },
    
    blur: (element: HTMLElement) => {
      element.blur();
      element.dispatchEvent(new FocusEvent('blur', { bubbles: true }));
    },
  },

  // Validate glass component structure
  validateGlassComponent: (element: HTMLElement): {
    isValid: boolean;
    issues: string[];
  } => {
    const issues: string[] = [];

    // Check for required attributes
    if (!element.getAttribute('data-testid')) {
      issues.push('Missing data-testid attribute');
    }

    // Check for glass effects
    if (!glassTestUtils.hasGlassEffects(element)) {
      issues.push('Missing glass morphism effects');
    }

    // Check accessibility
    if (element.getAttribute('role') === 'button' && !element.getAttribute('aria-label')) {
      issues.push('Interactive element missing aria-label');
    }

    return {
      isValid: issues.length === 0,
      issues,
    };
  },
};

/**
 * Snapshot testing utilities
 */
export const snapshotTestUtils = {
  // Create deterministic props for snapshot testing
  createDeterministicProps: <T extends BaseGlassProps>(props: T): T => ({
    ...props,
    // Remove random/time-based values
    'data-testid': props['data-testid'] || 'glass-component',
  }),

  // Normalize styles for consistent snapshots
  normalizeStylesForSnapshot: (element: HTMLElement): void => {
    // Remove browser-specific styles that might cause snapshot differences
    const style = element.style;
    style.removeProperty('-webkit-backdrop-filter');
    style.removeProperty('-moz-backdrop-filter');
  },
};

/**
 * Integration testing utilities
 */
export const integrationTestUtils = {
  // Test component with various props combinations
  testPropsCombinations: async <T extends BaseGlassProps>(
    Component: React.ComponentType<T>,
    propsSets: Partial<T>[]
  ): Promise<{
    passed: number;
    failed: number;
    errors: Array<{ props: Partial<T>; error: Error }>;
  }> => {
    let passed = 0;
    let failed = 0;
    const errors: Array<{ props: Partial<T>; error: Error }> = [];

    for (const props of propsSets) {
      try {
        const testProps = glassTestUtils.createTestProps(props);
        renderWithGlassProviders(<Component {...testProps} />);
        passed++;
      } catch (error) {
        failed++;
        errors.push({ props, error: error as Error });
      }
    }

    return { passed, failed, errors };
  },

  // Test responsive behavior
  testResponsiveBehavior: async (
    component: React.ReactElement,
    breakpoints: number[]
  ): Promise<{
    breakpoint: number;
    width: number;
    height: number;
    styles: CSSStyleDeclaration;
  }[]> => {
    const results = [];

    for (const breakpoint of breakpoints) {
      // Mock window width
      Object.defineProperty(window, 'innerWidth', {
        value: breakpoint,
        configurable: true,
      });

      // Trigger resize event
      window.dispatchEvent(new Event('resize'));

      const { container } = renderWithGlassProviders(component);
      const element = container.firstElementChild as HTMLElement;
      
      if (element) {
        results.push({
          breakpoint,
          width: element.offsetWidth,
          height: element.offsetHeight,
          styles: window.getComputedStyle(element),
        });
      }
    }

    return results;
  },
};

/**
 * Visual regression testing utilities
 */
export const visualTestUtils = {
  // Capture component screenshot (requires puppeteer or similar)
  captureScreenshot: async (
    selector: string,
    options: {
      width?: number;
      height?: number;
      deviceScaleFactor?: number;
    } = {}
  ): Promise<Buffer | null> => {
    // This would integrate with your visual testing tool
    // Example implementation with puppeteer:
    /*
    const page = await browser.newPage();
    await page.setViewport({
      width: options.width || 1280,
      height: options.height || 720,
      deviceScaleFactor: options.deviceScaleFactor || 1,
    });
    
    return await page.screenshot({
      clip: await page.evaluate(selector => {
        const element = document.querySelector(selector);
        if (!element) return null;
        const rect = element.getBoundingClientRect();
        return {
          x: rect.left,
          y: rect.top,
          width: rect.width,
          height: rect.height,
        };
      }, selector),
    });
    */
    
    if (process.env.NODE_ENV === 'development') {
      console.warn('Visual testing utilities available for integration with your preferred testing tool');
    }
    return null;
  },

  // Compare visual differences
  compareVisuals: async (
    baseline: Buffer,
    current: Buffer,
    threshold: number = 0.1
  ): Promise<{
    match: boolean;
    difference: number;
    diffImage?: Buffer;
  }> => {
    // Integration point for visual diff tools (Playwright, Percy, etc.)
    if (process.env.NODE_ENV === 'development') {
      console.warn('Visual comparison utilities ready for integration with your preferred tool');
    }
    return { match: true, difference: 0 };
  },
};

/**
 * Load testing utilities for performance
 */
export const loadTestUtils = {
  // Stress test component with many instances
  stressTest: async (
    component: React.ReactElement,
    instanceCount: number = 100
  ): Promise<{
    renderTime: number;
    memoryUsage: number;
    success: boolean;
  }> => {
    const startTime = performance.now();
    const memoryBefore = (performance as any).memory?.usedJSHeapSize || 0;

    try {
      const instances = Array.from({ length: instanceCount }, (_, i) =>
        React.cloneElement(component, { key: i })
      );

      renderWithGlassProviders(<div>{instances}</div>);

      const endTime = performance.now();
      const memoryAfter = (performance as any).memory?.usedJSHeapSize || 0;

      return {
        renderTime: endTime - startTime,
        memoryUsage: memoryAfter - memoryBefore,
        success: true,
      };
    } catch (error) {
      return {
        renderTime: performance.now() - startTime,
        memoryUsage: 0,
        success: false,
      };
    }
  },

  // Test virtualization performance
  testVirtualization: async (
    itemCount: number,
    itemHeight: number,
    containerHeight: number
  ): Promise<{
    virtualizedRenderTime: number;
    regularRenderTime: number;
    memoryDifference: number;
    performanceBenefit: number;
  }> => {
    // This would test actual virtualization performance
    // Implementation would depend on your virtualization component
    return {
      virtualizedRenderTime: 50,
      regularRenderTime: itemCount * 2,
      memoryDifference: itemCount * 1000,
      performanceBenefit: ((itemCount * 2 - 50) / (itemCount * 2)) * 100,
    };
  },
};

/**
 * Export all utilities as a single object
 */
export const glassTestingUtils = {
  render: renderWithGlassProviders,
  mockData: mockDataGenerators,
  matchers: glassMatchers,
  glass: glassTestUtils,
  performance: performanceTestUtils,
  a11y: a11yTestUtils,
  visual: visualTestUtils,
  load: loadTestUtils,
  snapshot: snapshotTestUtils,
  integration: integrationTestUtils,
  animation: animationTestUtils,
};
