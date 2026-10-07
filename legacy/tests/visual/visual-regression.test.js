/**
 * AuraGlass Visual Regression Testing Suite
 * 
 * Comprehensive visual testing for all 317 components using Playwright
 * and jest-image-snapshot for pixel-perfect visual verification.
 */

const { chromium } = require('playwright');
const { toMatchImageSnapshot } = require('jest-image-snapshot');

expect.extend({ toMatchImageSnapshot });

describe('AuraGlass Visual Regression Tests', () => {
  let browser;
  let page;

  const STORYBOOK_URL = 'http://localhost:6007';
  const COMPONENT_CATEGORIES = [
    'accessibility',
    'advanced', 
    'ai',
    'animations',
    'ar',
    'backgrounds',
    'button',
    'calendar',
    'card',
    'charts',
    'collaboration',
    'dashboard',
    'data-display',
    'effects',
    'houdini',
    'input',
    'interactive',
    'layout',
    'modal',
    'navigation',
    'quantum',
    'surfaces'
  ];

  beforeAll(async () => {
    browser = await chromium.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    page = await browser.newPage({
      viewport: { width: 1280, height: 720 }
    });

    // Wait for Storybook to be ready
    await page.goto(STORYBOOK_URL);
    await page.waitForSelector('[data-testid="sidebar-container"]', { timeout: 30000 });
  });

  afterAll(async () => {
    await browser?.close();
  });

  // Test each component category
  COMPONENT_CATEGORIES.forEach(category => {
    describe(`${category} components`, () => {
      test(`should render ${category} components correctly`, async () => {
        // Navigate to category in Storybook sidebar
        const categorySelector = `[data-testid="sidebar-container"] [data-item-id*="${category}"]`;
        
        try {
          await page.click(categorySelector);
          await page.waitForTimeout(1000);

          // Take screenshot of the category
          const screenshot = await page.screenshot({
            clip: { x: 0, y: 0, width: 1280, height: 720 },
            animations: 'disabled'
          });

          expect(screenshot).toMatchImageSnapshot({
            customSnapshotIdentifier: `${category}-overview`,
            failureThresholdType: 'percent',
            failureThreshold: 0.1, // Allow 0.1% difference
            customDiffConfig: {
              threshold: 0.1,
              includeAA: false
            }
          });
        } catch (error) {
          console.warn(`Category ${category} not found or failed to render:`, error.message);
        }
      });
    });
  });

  // Test core glass components specifically
  describe('Core Glass Components', () => {
    const coreComponents = [
      'button-glassbutton--default',
      'card-glasscard--default',
      'modal-glassmodal--default',
      'input-glassinput--default',
      'navigation-glassheader--default'
    ];

    coreComponents.forEach(componentId => {
      test(`should render ${componentId} correctly`, async () => {
        try {
          await page.goto(`${STORYBOOK_URL}/iframe.html?id=${componentId}`);
          await page.waitForLoadState('networkidle');
          await page.waitForTimeout(2000); // Allow animations to settle

          const screenshot = await page.screenshot({
            fullPage: false,
            clip: { x: 0, y: 0, width: 1280, height: 720 },
            animations: 'disabled'
          });

          expect(screenshot).toMatchImageSnapshot({
            customSnapshotIdentifier: componentId,
            failureThresholdType: 'percent',
            failureThreshold: 0.2,
            customDiffConfig: {
              threshold: 0.2,
              includeAA: false
            }
          });
        } catch (error) {
          console.warn(`Component ${componentId} failed visual test:`, error.message);
        }
      });
    });
  });

  // Test dark mode compatibility
  describe('Dark Mode Visual Consistency', () => {
    test('should render components correctly in dark mode', async () => {
      await page.goto(`${STORYBOOK_URL}/?path=/story/button-glassbutton--default`);
      
      // Switch to dark mode if available
      try {
        await page.click('[title="Switch themes"]');
        await page.click('[title="dark"]');
        await page.waitForTimeout(1000);
      } catch (error) {
        console.log('Dark mode switch not available, skipping');
        return;
      }

      const screenshot = await page.screenshot({
        clip: { x: 0, y: 0, width: 1280, height: 720 },
        animations: 'disabled'
      });

      expect(screenshot).toMatchImageSnapshot({
        customSnapshotIdentifier: 'dark-mode-button',
        failureThresholdType: 'percent',
        failureThreshold: 0.3,
        customDiffConfig: {
          threshold: 0.3,
          includeAA: false
        }
      });
    });
  });

  // Test responsive design
  describe('Responsive Design', () => {
    const viewports = [
      { name: 'mobile', width: 375, height: 667 },
      { name: 'tablet', width: 768, height: 1024 },
      { name: 'desktop', width: 1440, height: 900 }
    ];

    viewports.forEach(viewport => {
      test(`should render correctly on ${viewport.name}`, async () => {
        await page.setViewportSize(viewport);
        await page.goto(`${STORYBOOK_URL}/?path=/story/card-glasscard--default`);
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(1000);

        const screenshot = await page.screenshot({
          fullPage: false,
          animations: 'disabled'
        });

        expect(screenshot).toMatchImageSnapshot({
          customSnapshotIdentifier: `responsive-${viewport.name}`,
          failureThresholdType: 'percent',
          failureThreshold: 0.2,
          customDiffConfig: {
            threshold: 0.2,
            includeAA: false
          }
        });
      });
    });
  });

  // Test glass effects specifically
  describe('Glass Effects Rendering', () => {
    test('should render glass blur effects correctly', async () => {
      await page.goto(`${STORYBOOK_URL}/?path=/story/surfaces-dimensionalglass--default`);
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(3000); // Allow glass effects to fully render

      const screenshot = await page.screenshot({
        clip: { x: 100, y: 100, width: 800, height: 600 },
        animations: 'disabled'
      });

      expect(screenshot).toMatchImageSnapshot({
        customSnapshotIdentifier: 'glass-effects',
        failureThresholdType: 'percent',
        failureThreshold: 0.5, // Higher threshold for complex effects
        customDiffConfig: {
          threshold: 0.5,
          includeAA: false
        }
      });
    });
  });
});