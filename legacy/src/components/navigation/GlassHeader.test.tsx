'use client';
/**
 * GlassHeader Component Tests
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
import { GlassHeader } from '@/components/navigation/GlassHeader';

// Extend Jest matchers
expect.extend(toHaveNoViolations);

describe('GlassHeader', () => {
  /**
   * Smoke Test: Component renders without crashing
   */
  it('renders without crashing', () => {
    const { container } = render(<GlassHeader />);
    expect(container).toBeInTheDocument();
  });

  /**
   * Accessibility Test: No axe violations
   */
  it('has no accessibility violations', async () => {
    const { container } = render(<GlassHeader />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  
  /**
   * ARIA Tests: Navigation component has proper roles and labels
   */
  describe('ARIA Attributes', () => {
    it('has proper navigation role', () => {
      render(<GlassHeader />);
      const nav = screen.queryByRole('navigation') || screen.queryByRole('menu') || screen.queryByRole('menubar');
      expect(nav).toBeInTheDocument();
    });

    it('has accessible name', () => {
      render(<GlassHeader aria-label="Main navigation" />);
      const nav = screen.getByRole('navigation', { name: /main navigation/i });
      expect(nav).toBeInTheDocument();
    });
  });

  
  /**
   * Focus Management Tests
   */
  describe('Focus Management', () => {
    it('can receive focus', () => {
      render(<GlassHeader />);
      const element = document.querySelector('[tabindex]') || document.querySelector('button, a, input, select, textarea');

      if (element) {
        (element as HTMLElement).focus();
        expect(element).toHaveFocus();
      }
    });

    it('shows visible focus indicator', () => {
      const { container } = render(<GlassHeader />);
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
      <GlassHeader
        className="custom-class"
        data-testid="glassheader"
      />
    );

    const element = container.querySelector('[data-testid="glassheader"]')
      || container.firstChild;

    expect(element).toHaveClass('custom-class');
  });

  /**
   * Snapshot Test: Matches snapshot
   */
  it('matches snapshot', () => {
    const { container } = render(<GlassHeader />);
    expect(container.firstChild).toMatchSnapshot();
  });
});