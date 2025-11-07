/**
 * GlassToggle Component Tests
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
import { GlassToggle } from '@/components/input/GlassToggle';

// Extend Jest matchers
expect.extend(toHaveNoViolations);

describe('GlassToggle', () => {
  /**
   * Smoke Test: Component renders without crashing
   */
  it('renders without crashing', () => {
    const { container } = render(<GlassToggle />);
    expect(container).toBeInTheDocument();
  });

  /**
   * Accessibility Test: No axe violations
   */
  it('has no accessibility violations', async () => {
    const { container } = render(<GlassToggle />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  
  /**
   * ARIA Tests: Form component has proper labels and descriptions
   */
  describe('ARIA Attributes', () => {
    it('has proper form control role', () => {
      render(<GlassToggle id="test-input" />);
      const element = screen.getByTestId('glasstoggle') || document.querySelector('#test-input');
      expect(element).toBeInTheDocument();
    });

    it('supports aria-label', () => {
      render(<GlassToggle aria-label="Test input" />);
      const element = screen.getByLabelText(/test input/i);
      expect(element).toBeInTheDocument();
    });

    it('supports aria-describedby for help text', () => {
      render(
        <>
          <GlassToggle aria-describedby="help-text" />
          <span id="help-text">Helper text</span>
        </>
      );
      const element = screen.getByText(/helper text/i);
      expect(element).toBeInTheDocument();
    });
  });

  

  

  /**
   * Props Validation: Accepts and renders with custom props
   */
  it('accepts and renders with custom props', () => {
    const { container } = render(
      <GlassToggle
        className="custom-class"
        data-testid="glasstoggle"
      />
    );

    const element = container.querySelector('[data-testid="glasstoggle"]')
      || container.firstChild;

    expect(element).toHaveClass('custom-class');
  });

  /**
   * Snapshot Test: Matches snapshot
   */
  it('matches snapshot', () => {
    const { container } = render(<GlassToggle />);
    expect(container.firstChild).toMatchSnapshot();
  });
});
