/**
 * GlassLiquidTransition Component Tests
 *
 * Test Suite Coverage:
 * - ✅ Smoke test (renders without crashing)
 * - ✅ Props validation
 * - ✅ Accessibility (axe-core)
 * - ✅ ARIA attributes
 * - ⏭️  Focus management (not applicable)
 * - ⏭️  Reduced motion (not applicable)
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import userEvent from '@testing-library/user-event';
import { GlassLiquidTransition } from '@/components/advanced/GlassLiquidTransition';

// Extend Jest matchers
expect.extend(toHaveNoViolations);

describe('GlassLiquidTransition', () => {
  /**
   * Smoke Test: Component renders without crashing
   */
  it('renders without crashing', () => {
    const { container } = render(<GlassLiquidTransition />);
    expect(container).toBeInTheDocument();
  });

  /**
   * Accessibility Test: No axe violations
   */
  it('has no accessibility violations', async () => {
    const { container } = render(<GlassLiquidTransition />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  
  /**
   * ARIA Tests: Component has accessible name and description
   */
  describe('ARIA Attributes', () => {
    it('supports aria-label', () => {
      const { container } = render(<GlassLiquidTransition aria-label="Test component" />);
      const element = container.querySelector('[aria-label="Test component"]');
      expect(element).toBeInTheDocument();
    });
  });

  

  

  /**
   * Props Validation: Accepts and renders with custom props
   */
  it('accepts and renders with custom props', () => {
    const { container } = render(
      <GlassLiquidTransition
        className="custom-class"
        data-testid="glassliquidtransition"
      />
    );

    const element = container.querySelector('[data-testid="glassliquidtransition"]')
      || container.firstChild;

    expect(element).toHaveClass('custom-class');
  });

  /**
   * Snapshot Test: Matches snapshot
   */
  it('matches snapshot', () => {
    const { container } = render(<GlassLiquidTransition />);
    expect(container.firstChild).toMatchSnapshot();
  });
});
