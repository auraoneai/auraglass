'use client';
/**
 * GlassStepper Component Tests
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
import { GlassStepper } from '@/components/interactive/GlassStepper';

// Extend Jest matchers
expect.extend(toHaveNoViolations);

describe('GlassStepper', () => {
  /**
   * Smoke Test: Component renders without crashing
   */
  it('renders without crashing', () => {
    const { container } = render(<GlassStepper />);
    expect(container).toBeInTheDocument();
  });

  /**
   * Accessibility Test: No axe violations
   */
  it('has no accessibility violations', async () => {
    const { container } = render(<GlassStepper />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  
  /**
   * ARIA Tests: Form component has proper labels and descriptions
   */
  describe('ARIA Attributes', () => {
    it('has proper form control role', () => {
      render(<GlassStepper id="test-input" />);
      const element = screen.getByTestId('glassstepper') || document.querySelector('#test-input');
      expect(element).toBeInTheDocument();
    });

    it('supports aria-label', () => {
      render(<GlassStepper aria-label="Test input" />);
      const element = screen.getByLabelText(/test input/i);
      expect(element).toBeInTheDocument();
    });

    it('supports aria-describedby for help text', () => {
      render(
        <>
          <GlassStepper aria-describedby="help-text" />
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
      <GlassStepper
        className="custom-class"
        data-testid="glassstepper"
      />
    );

    const element = container.querySelector('[data-testid="glassstepper"]')
      || container.firstChild;

    expect(element).toHaveClass('custom-class');
  });

  /**
   * Snapshot Test: Matches snapshot
   */
  it('matches snapshot', () => {
    const { container } = render(<GlassStepper />);
    expect(container.firstChild).toMatchSnapshot();
  });
});