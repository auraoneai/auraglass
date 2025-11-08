'use client';
/**
 * GlassToolbar Component Tests
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
import { GlassToolbar } from '@/components/navigation/GlassToolbar';

// Extend Jest matchers
expect.extend(toHaveNoViolations);

describe('GlassToolbar', () => {
  /**
   * Smoke Test: Component renders without crashing
   */
  it('renders without crashing', () => {
    const { container } = render(<GlassToolbar />);
    expect(container).toBeInTheDocument();
  });

  /**
   * Accessibility Test: No axe violations
   */
  it('has no accessibility violations', async () => {
    const { container } = render(<GlassToolbar />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  
  /**
   * ARIA Tests: Navigation component has proper roles and labels
   */
  describe('ARIA Attributes', () => {
    it('has proper navigation role', () => {
      render(<GlassToolbar />);
      const nav = screen.queryByRole('navigation') || screen.queryByRole('menu') || screen.queryByRole('menubar');
      expect(nav).toBeInTheDocument();
    });

    it('has accessible name', () => {
      render(<GlassToolbar aria-label="Main navigation" />);
      const nav = screen.getByRole('navigation', { name: /main navigation/i });
      expect(nav).toBeInTheDocument();
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

      const { container } = render(<GlassToolbar />);

      // Check that animations are disabled or reduced
      const animatedElements = container.querySelectorAll('[class*="animate"], [class*="transition"]');
      animatedElements.forEach(element => {
        const styles = window.getComputedStyle(element);
        const animationDuration = parseFloat(styles.animationDuration || '0');
        const transitionDuration = parseFloat(styles.transitionDuration || '0');

        // Animations should be instant or very short (< 0.1s)
        expect(animationDuration).toBeLessThan(0.1);
        expect(transitionDuration).toBeLessThan(0.1);
      });
    });
  });

  /**
   * Props Validation: Accepts and renders with custom props
   */
  it('accepts and renders with custom props', () => {
    const { container } = render(
      <GlassToolbar
        className="custom-class"
        data-testid="glasstoolbar"
      />
    );

    const element = container.querySelector('[data-testid="glasstoolbar"]')
      || container.firstChild;

    expect(element).toHaveClass('custom-class');
  });

  /**
   * Snapshot Test: Matches snapshot
   */
  it('matches snapshot', () => {
    const { container } = render(<GlassToolbar />);
    expect(container.firstChild).toMatchSnapshot();
  });
});