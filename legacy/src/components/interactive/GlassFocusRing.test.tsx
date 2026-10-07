'use client';
/**
 * GlassFocusRing Component Tests
 *
 * Test Suite Coverage:
 * - ✅ Smoke test (renders without crashing)
 * - ✅ Props validation
 * - ✅ Accessibility (axe-core)
 * - ⏭️  ARIA attributes (not applicable)
 * - ✅ Focus management
 * - ⏭️  Reduced motion (not applicable)
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import userEvent from '@testing-library/user-event';
import { GlassFocusRing } from '@/components/interactive/GlassFocusRing';

// Extend Jest matchers
expect.extend(toHaveNoViolations);

describe('GlassFocusRing', () => {
  /**
   * Smoke Test: Component renders without crashing
   */
  it('renders without crashing', () => {
    const { container } = render(<GlassFocusRing><div /></GlassFocusRing>);
    expect(container).toBeInTheDocument();
  });

  /**
   * Accessibility Test: No axe violations
   */
  it('has no accessibility violations', async () => {
    const { container } = render(<GlassFocusRing><button>Test</button></GlassFocusRing>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  

  
  /**
   * Focus Management Tests
   */
  describe('Focus Management', () => {
    it('can receive focus', () => {
      render(<GlassFocusRing><button>Focusable</button></GlassFocusRing>);
      const element = screen.getByRole('button');

      if (element) {
        (element as HTMLElement).focus();
        expect(element).toHaveFocus();
      }
    });

    it('shows visible focus indicator', () => {
      render(<GlassFocusRing><button>Focusable</button></GlassFocusRing>);
      const element = screen.getByRole('button');

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

  it('renders even when multiple children are provided', () => {
    const { container } = render(
      <GlassFocusRing>
        <button>One</button>
        <button>Two</button>
      </GlassFocusRing>
    );
    expect(container).toBeInTheDocument();
  });

  

  /**
   * Props Validation: Accepts and renders with custom props
   */
  it('accepts and renders with custom props', () => {
    const { container } = render(
      <GlassFocusRing
        className="custom-class"
        data-testid="glassfocusring"
      >
        <div />
      </GlassFocusRing>
    );

    const element = container.querySelector('[data-testid="glassfocusring"]')
      || container.firstChild;

    expect(element).toHaveClass('custom-class');
  });

  /**
   * Snapshot Test: Matches snapshot
   */
  it('matches snapshot', () => {
    const { container } = render(<GlassFocusRing><div /></GlassFocusRing>);
    expect(container.firstChild).toMatchSnapshot();
  });
});
