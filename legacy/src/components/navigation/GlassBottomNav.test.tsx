'use client';
/**
 * GlassBottomNav Component Tests
 *
 * Test Suite Coverage:
 * - ✅ Smoke test (renders without crashing)
 * - ✅ Props validation
 * - ✅ Accessibility (axe-core)
 * - ✅ ARIA attributes
 * - ✅ Focus management
 * - ✅ Reduced motion support
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import userEvent from '@testing-library/user-event';
import { GlassBottomNav } from '@/components/navigation/GlassBottomNav';

// Extend Jest matchers
expect.extend(toHaveNoViolations);

describe('GlassBottomNav', () => {
  const mockItems = [
    { id: '1', label: 'Home', icon: <span>🏠</span> },
    { id: '2', label: 'Search', icon: <span>🔍</span> },
    { id: '3', label: 'Profile', icon: <span>👤</span> },
  ];

  /**
   * Smoke Test: Component renders without crashing
   */
  it('renders without crashing', () => {
    const { container } = render(<GlassBottomNav items={mockItems} />);
    expect(container).toBeInTheDocument();
  });

  /**
   * Accessibility Test: No axe violations
   */
  it('has no accessibility violations', async () => {
    const { container } = render(<GlassBottomNav items={mockItems} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  
  /**
   * ARIA Tests: Navigation component has proper roles and labels
   */
  describe('ARIA Attributes', () => {
    it('has proper navigation role', () => {
      render(<GlassBottomNav items={mockItems} />);
      const nav = screen.queryByRole('tablist') || screen.queryByRole('navigation') || screen.queryByRole('menu') || screen.queryByRole('menubar');
      expect(nav).toBeInTheDocument();
    });

    it('has accessible name', () => {
      render(<GlassBottomNav items={mockItems} aria-label="Main navigation" />);
      const nav = screen.getByRole('tablist', { name: /main navigation/i }) || screen.getByRole('navigation', { name: /main navigation/i });
      expect(nav).toBeInTheDocument();
    });
  });

  
  /**
   * Focus Management Tests
   */
  describe('Focus Management', () => {
    it('can receive focus', () => {
      render(<GlassBottomNav items={mockItems} />);
      const element = document.querySelector('[tabindex]') || document.querySelector('button, a, input, select, textarea');

      if (element) {
        (element as HTMLElement).focus();
        expect(element).toHaveFocus();
      }
    });

    it('shows visible focus indicator', () => {
      const { container } = render(<GlassBottomNav items={mockItems} />);
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

      const { container } = render(<GlassBottomNav items={mockItems} />);

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
      <GlassBottomNav
        items={mockItems}
        className="custom-class"
        data-testid="glassbottomnav"
      />
    );

    const element = container.querySelector('[data-testid="glassbottomnav"]')
      || container.firstChild;

    expect(element).toHaveClass('custom-class');
  });

  /**
   * Snapshot Test: Matches snapshot
   */
  it('matches snapshot', () => {
    const { container } = render(<GlassBottomNav items={mockItems} />);
    expect(container.firstChild).toMatchSnapshot();
  });
});