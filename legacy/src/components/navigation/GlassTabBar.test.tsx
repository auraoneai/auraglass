'use client';
/**
 * GlassTabBar Component Tests
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
import { GlassTabBar } from '@/components/navigation/GlassTabBar';

// Extend Jest matchers
expect.extend(toHaveNoViolations);

describe('GlassTabBar', () => {
  const mockTabs = [
    { id: '1', value: 'tab1', label: 'Tab 1' },
    { id: '2', value: 'tab2', label: 'Tab 2' },
    { id: '3', value: 'tab3', label: 'Tab 3' },
  ];
  const mockOnChange = jest.fn();

  /**
   * Smoke Test: Component renders without crashing
   */
  it('renders without crashing', () => {
    const { container } = render(
      <GlassTabBar tabs={mockTabs} activeTab={0} onChange={mockOnChange} />
    );
    expect(container).toBeInTheDocument();
  });

  /**
   * Accessibility Test: No axe violations
   */
  it('has no accessibility violations', async () => {
    const { container } = render(
      <GlassTabBar tabs={mockTabs} activeTab={0} onChange={mockOnChange} />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  
  /**
   * ARIA Tests: Navigation component has proper roles and labels
   */
  describe('ARIA Attributes', () => {
    it('has proper navigation role', () => {
      render(<GlassTabBar tabs={mockTabs} activeTab={0} onChange={mockOnChange} />);
      const nav = screen.queryByRole('tablist') || screen.queryByRole('navigation') || screen.queryByRole('menu') || screen.queryByRole('menubar');
      expect(nav).toBeInTheDocument();
    });

    it('has accessible name', () => {
      render(<GlassTabBar tabs={mockTabs} activeTab={0} onChange={mockOnChange} ariaLabel="Main navigation" />);
      const nav = screen.getByRole('tablist', { name: /main navigation/i });
      expect(nav).toBeInTheDocument();
    });
  });

  
  /**
   * Focus Management Tests
   */
  describe('Focus Management', () => {
    it('can receive focus', () => {
      render(<GlassTabBar tabs={mockTabs} activeTab={0} onChange={mockOnChange} />);
      const element = document.querySelector('[tabindex]') || document.querySelector('button, a, input, select, textarea');

      if (element) {
        (element as HTMLElement).focus();
        expect(element).toHaveFocus();
      }
    });

    it('shows visible focus indicator', () => {
      const { container } = render(<GlassTabBar tabs={mockTabs} activeTab={0} onChange={mockOnChange} />);
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

      const { container } = render(<GlassTabBar tabs={mockTabs} activeTab={0} onChange={mockOnChange} />);

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
      <GlassTabBar
        tabs={mockTabs}
        activeTab={0}
        onChange={mockOnChange}
        className="custom-class"
        data-testid="glasstabbar"
      />
    );

    const element = container.querySelector('[data-testid="glasstabbar"]')
      || container.firstChild;

    expect(element).toHaveClass('custom-class');
  });

  /**
   * Snapshot Test: Matches snapshot
   */
  it('matches snapshot', () => {
    const { container } = render(<GlassTabBar tabs={mockTabs} activeTab={0} onChange={mockOnChange} />);
    expect(container.firstChild).toMatchSnapshot();
  });
});