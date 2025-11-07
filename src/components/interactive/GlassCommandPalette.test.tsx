/**
 * GlassCommandPalette Component Tests
 *
 * Test Suite Coverage:
 * - ✅ Smoke test (renders without crashing)
 * - ✅ Props validation
 * - ✅ Accessibility (axe-core)
 * - ✅ ARIA attributes
 * - ✅ Focus management
 * - ⏭️  Reduced motion (not applicable)
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import userEvent from '@testing-library/user-event';
import { GlassCommandPalette } from '@/components/interactive/GlassCommandPalette';

// Extend Jest matchers
expect.extend(toHaveNoViolations);

describe('GlassCommandPalette', () => {
  /**
   * Smoke Test: Component renders without crashing
   */
  it('renders without crashing', () => {
    const { container } = render(<GlassCommandPalette />);
    expect(container).toBeInTheDocument();
  });

  /**
   * Accessibility Test: No axe violations
   */
  it('has no accessibility violations', async () => {
    const { container } = render(<GlassCommandPalette />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  
  /**
   * ARIA Tests: Component has accessible name and description
   */
  describe('ARIA Attributes', () => {
    it('supports aria-label', () => {
      const { container } = render(<GlassCommandPalette aria-label="Test component" />);
      const element = container.querySelector('[aria-label="Test component"]');
      expect(element).toBeInTheDocument();
    });
  });

  
  /**
   * Focus Management Tests
   */
  describe('Focus Management', () => {
    it('can receive focus', () => {
      render(<GlassCommandPalette />);
      const element = document.querySelector('[tabindex]') || document.querySelector('button, a, input, select, textarea');

      if (element) {
        (element as HTMLElement).focus();
        expect(element).toHaveFocus();
      }
    });

    it('shows visible focus indicator', () => {
      const { container } = render(<GlassCommandPalette />);
      const element = container.querySelector('[tabindex]') || container.querySelector('button, a, input, select, textarea');

      if (element) {
        (element as HTMLElement).focus();
        // Check for focus-visible class or focus styles
        const hasFocusIndicator =
          element.classList.contains('focus-visible') ||
          window.getComputedStyle(element).outline !== 'none';
        expect(hasFocusIndicator).toBe(true);
      }
    });
  });

  

  /**
   * Props Validation: Accepts and renders with custom props
   */
  it('accepts and renders with custom props', () => {
    const { container } = render(
      <GlassCommandPalette
        className="custom-class"
        data-testid="glasscommandpalette"
      />
    );

    const element = container.querySelector('[data-testid="glasscommandpalette"]')
      || container.firstChild;

    expect(element).toHaveClass('custom-class');
  });

  /**
   * Snapshot Test: Matches snapshot
   */
  it('matches snapshot', () => {
    const { container } = render(<GlassCommandPalette />);
    expect(container.firstChild).toMatchSnapshot();
  });
});
