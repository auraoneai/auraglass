'use client';
/**
 * GlassProgress Component Tests
 *
 * Test Suite Coverage:
 * - ✅ Smoke test (renders without crashing)
 * - ✅ Props validation
 * - ✅ Accessibility (axe-core)
 * - ✅ ARIA attributes
 * - ⏭️  Focus management (not applicable)
 * - ✅ Reduced motion support
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import userEvent from '@testing-library/user-event';
import { GlassProgress } from '@/components/data-display/GlassProgress';
import { MotionPreferenceProvider } from '@/contexts/MotionPreferenceContext';

// Extend Jest matchers
expect.extend(toHaveNoViolations);

describe('GlassProgress', () => {
  /**
   * Smoke Test: Component renders without crashing
   */
  it('renders without crashing', () => {
    const { container } = render(<GlassProgress />);
    expect(container).toBeInTheDocument();
  });

  /**
   * Accessibility Test: No axe violations
   */
  it('has no accessibility violations', async () => {
    const { container } = render(<GlassProgress />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  
  /**
   * ARIA Tests: Component has accessible name and description
   */
  describe('ARIA Attributes', () => {
    it('supports aria-label', () => {
      const { container } = render(<GlassProgress aria-label="Test component" />);
      const element = container.querySelector('[aria-label="Test component"]');
      expect(element).toBeInTheDocument();
    });
  });

  

  
  /**
   * Reduced Motion Tests
   */
  describe('Reduced Motion Support', () => {
    it('respects prefers-reduced-motion', () => {
      // Mock matchMedia for reduced motion
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: jest.fn().mockImplementation(query => ({
          matches: query === '(prefers-reduced-motion: reduce)',
          media: query,
          onchange: null,
          addListener: jest.fn(),
          removeListener: jest.fn(),
          addEventListener: jest.fn(),
          removeEventListener: jest.fn(),
          dispatchEvent: jest.fn(),
        })),
      });

      const { container } = render(
        <MotionPreferenceProvider initialMotionPolicy="auto" initialPrefersReducedMotion={true}>
          <GlassProgress value={50} />
        </MotionPreferenceProvider>
      );

      // Check that the progress fill has transitionDuration set to 0ms when reduced motion is preferred
      const progressFill = container.querySelector('[role="progressbar"] > div');
      if (progressFill) {
        const styles = window.getComputedStyle(progressFill);
        const transitionDuration = parseFloat(styles.transitionDuration || '0');
        // When reduced motion is preferred, transitionDuration should be 0ms
        expect(transitionDuration).toBeLessThan(0.1);
      }
    });
  });

  /**
   * Props Validation: Accepts and renders with custom props
   */
  it('accepts and renders with custom props', () => {
    const { container } = render(
      <GlassProgress
        className="custom-class"
        data-testid="glassprogress"
      />
    );

    const element = container.querySelector('[data-testid="glassprogress"]')
      || container.firstChild;

    expect(element).toHaveClass('custom-class');
  });

  /**
   * Snapshot Test: Matches snapshot
   */
  it('matches snapshot', () => {
    const { container } = render(<GlassProgress />);
    expect(container.firstChild).toMatchSnapshot();
  });
});